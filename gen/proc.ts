// Child processes for the pipeline scripts (node, tripo, blender) and the typed results they print.
import { spawn } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

/** Characters cmd.exe would expand or treat as operators even inside quotes (%VAR% expansion, ", ^, &, |, <, >). */
const CMD_UNSAFE = /[%"^&|<>\r\n]/;

/**
 * Run a command, resolve with stdout. Everything runs without a shell (arguments reach the program verbatim),
 * except `tripo` on Windows: it is an npm .cmd shim and needs cmd.exe. Its arguments are paths, names and task ids,
 * never prompts; any argument with a cmd metacharacter is refused rather than risk expansion or injection
 * (a prompt holding `%GEMINI_API_KEY%` would otherwise put the key into the prompt).
 * Blender always gets `--python-exit-code 1`, so a Python error fails the run and its traceback is reported.
 * stdin is closed: a child that stops to ask something (a login or confirm prompt) gets end-of-input and fails,
 * instead of waiting forever on a pipe nobody writes (there is no timeout).
 */
export function run(cmd: string, args: string[], label: string): Promise<string> {
  if (cmd === 'blender' && !args.includes('--python-exit-code')) {
    const at = args[0] === '-b' ? 1 : 0;
    args = [...args.slice(0, at), '--python-exit-code', '1', ...args.slice(at)];
  }
  return new Promise((res, rej) => {
    let p;
    if (process.platform === 'win32' && cmd === 'tripo') {
      const bad = args.find((a) => CMD_UNSAFE.test(a));
      if (bad !== undefined) { rej(new Error(`${label}: refusing a tripo argument with a cmd.exe metacharacter: ${bad.slice(0, 80)}`)); return; }
      p = spawn([cmd, ...args.map((a) => (/[\s()]/.test(a) ? `"${a}"` : a))].join(' '), { shell: true, env: process.env, stdio: ['ignore', 'pipe', 'pipe'] });
    } else {
      p = spawn(cmd, args, { env: process.env, stdio: ['ignore', 'pipe', 'pipe'] });
    }
    let out = '', err = '';
    p.stdout.on('data', (d: Buffer) => { out += d.toString(); });
    p.stderr.on('data', (d: Buffer) => { err += d.toString(); });
    p.on('error', rej);
    p.on('close', (code) => {
      if (code === 0) { res(out); return; }
      const hint = cmd === 'tripo' && code !== null ? TRIPO_EXIT_HINT[code] : undefined;
      rej(new Error(`${label} failed (exit ${code})${hint ? `: ${hint}` : ''}\n${(err + '\n' + out).trim().slice(-2500)}`));
    });
  });
}

/** Tripo CLI exit codes (`tripo docs`, 2026-10). 6 and 7 can still bill: never re-run blindly. */
const TRIPO_EXIT_HINT: Record<number, string> = {
  3: 'not signed in (tripo login, or TRIPO_API_KEY in the kit .env)',
  4: 'not enough credits; nothing started and nothing was charged. The director tops up (tripo topup)',
  5: 'content policy rejection; change the input',
  6: 'the task failed (credits refunded) OR the wait timed out. A timed-out task can still finish and be billed: do NOT ' +
     're-run. Find its id with `tripo history --limit 3` and resume with `tripo task watch <id> --download`',
  7: 'network error; the task may have been created. Check `tripo history --limit 3` and `tripo balance` (frozen ' +
     'credits) before submitting again',
  9: 'rate limited; wait and retry',
};

/** Credits available now (`tripo balance --json` prints {"balance":N,"frozen":M}; frozen = running tasks' holds). */
export async function tripoBalance(): Promise<number> {
  const out = await run('tripo', ['balance', '--json'], 'tripo balance');
  const line = out.trim().split(/\r?\n/).reverse().find((l) => l.trimStart().startsWith('{'));
  const j = line ? (JSON.parse(line) as { balance?: unknown }) : {};
  if (typeof j.balance !== 'number') throw new Error(`unexpected tripo balance output: ${out.slice(-300)}`);
  return j.balance;
}

/**
 * Refuse before the first paid Tripo step when the balance can't cover the whole run: a run that stops half-way
 * still bills the steps before it. `need` is an estimate (CLAUDE.md lists the prices).
 */
export async function requireTripoCredits(need: number, what: string): Promise<void> {
  if (need <= 0) return;
  const have = await tripoBalance();
  if (have < need) {
    throw new Error(`${what} needs about ${need} Tripo credits and the balance is ${have}. Nothing was spent. ` +
      'The director tops up (tripo topup) or picks a cheaper route.');
  }
  console.log(`    Tripo balance ${have} credits; this run needs about ${need}`);
}

export const secs = (t: number): string => `${((Date.now() - t) / 1000).toFixed(1)}s`;

// ---------- Tripo CLI (`--json` output, verified 2026-10-24) ----------

/** Last JSON line printed by `tripo make|anim rig ... --json`. Paths are relative to the current directory. */
export interface TripoResult {
  task_id: string;
  type: string;
  status: string;
  credits_consumed: number;
  output_dir: string;
  files: string[];
  model_file: string;
  preview?: string;
  source_task_id?: string;
}

/** task.json the CLI writes next to the downloads. */
export interface TripoTaskFile { task_id: string; type: string; input?: { original_model_id?: string; [k: string]: unknown } }

export function parseTripo(out: string): TripoResult {
  const line = out.trim().split('\n').reverse().find((l) => l.trim().startsWith('{'));
  if (!line) throw new Error(`tripo printed no JSON:\n${out.slice(-800)}`);
  const j = JSON.parse(line) as Partial<TripoResult>;
  if (typeof j.model_file !== 'string' || typeof j.task_id !== 'string' || typeof j.output_dir !== 'string')
    throw new Error(`unexpected tripo JSON: ${line.slice(0, 400)}`);
  return { ...j, model_file: resolve(j.model_file), output_dir: resolve(j.output_dir) } as TripoResult;
}

export function readTripoTask(outputDir: string): TripoTaskFile {
  return JSON.parse(readFileSync(join(outputDir, 'task.json'), 'utf8')) as TripoTaskFile;
}

export interface OrmResult { file: string; size: number[]; from: Record<'ao' | 'roughness' | 'metallic', boolean> }

/** Pack T_<Name>_ao/_roughness/_metallic PNGs in texDir into T_<Name>_orm.png (gen/blender/pack_orm.py). */
export async function packOrm(kit: string, texDir: string, name: string): Promise<OrmResult> {
  const out = await run('blender', ['-b', '--factory-startup', '--python', join(kit, 'gen', 'blender', 'pack_orm.py'), '--', texDir, name], 'blender pack_orm');
  return parseMarkedJson<OrmResult>(out, 'ORM_JSON');
}

/** Find the JSON payload of a `KEY=...` line printed by a Blender script. */
export function parseMarkedJson<T>(out: string, key: string): T {
  const line = out.split('\n').find((l) => l.startsWith(`${key}=`));
  if (!line) throw new Error(`no ${key} line in output:\n${out.slice(-800)}`);
  return JSON.parse(line.slice(key.length + 1)) as T;
}

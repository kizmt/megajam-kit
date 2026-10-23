// Child processes for the pipeline scripts (node, tripo, blender) and the typed results they print.
import { spawn } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

/** Quote one argument for the Windows command line (paths and free text; " cannot occur in Windows paths). */
export const q = (s: string): string => (process.platform === 'win32' ? `"${s.replace(/"/g, '\\"')}"` : s);

/**
 * Run a command, resolve with stdout. On Windows `tripo` is an npm .cmd shim, which needs a shell; Node 24
 * deprecates args + shell:true (DEP0190: args are concatenated unescaped), so build one command line ourselves.
 * Every path or free-text argument must go through q().
 */
export function run(cmd: string, args: string[], label: string): Promise<string> {
  return new Promise((res, rej) => {
    const p = process.platform === 'win32'
      ? spawn([cmd, ...args].join(' '), { shell: true, env: process.env })
      : spawn(cmd, args, { env: process.env });
    let out = '', err = '';
    p.stdout.on('data', (d: Buffer) => { out += d.toString(); });
    p.stderr.on('data', (d: Buffer) => { err += d.toString(); });
    p.on('error', rej);
    p.on('close', (code) => (code === 0 ? res(out) : rej(new Error(`${label} failed (exit ${code}):\n${(err || out).slice(-1500)}`))));
  });
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

/** Find the JSON payload of a `KEY=...` line printed by a Blender script. */
export function parseMarkedJson<T>(out: string, key: string): T {
  const line = out.split('\n').find((l) => l.startsWith(`${key}=`));
  if (!line) throw new Error(`no ${key} line in output:\n${out.slice(-800)}`);
  return JSON.parse(line.slice(key.length + 1)) as T;
}

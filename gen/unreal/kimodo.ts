#!/usr/bin/env node
// Text to an Animation Sequence with UE 5.9's Kimodo (AnimGenOffline plugin): local, no credits, generated content.
//
//   node gen/unreal/kimodo.ts "a person throws a hard punch forward with the right fist, then stands tall" \
//        --name A_Hero_Punch --seq /Game/Characters/Hero/Kimodo/LS_HeroKimodo [--map /Game/.../L_HeroKimodo]
//        [--dest /Game/Characters/Hero/Anims] [--mesh /Game/.../SK_Hero] [--seed 7] [--timeout 300]
//   node gen/unreal/kimodo.ts --state --seq /Game/.../LS_HeroKimodo        (sections, prompts, seeds; changes nothing)
//
// Needs, once per project (SETUP.md 10b, the director's steps): the AnimGenOffline and Kimodo plugins, the Hugging
// Face token, and a Level Sequence with the character added through the plugin's Add Character (that gives it the
// Generated Animation track this script drives). 5.9 only.
// What it does: opens the sequence in Sequencer, sets the prompt (and seed) inside an editor transaction, which is
// what makes the plugin generate, waits for the plugin's "done" line in the editor log, then bakes the result to
// <dest>/<name> for the character's skeleton. The first generation after an editor start loads the models: about
// 2 minutes; later ones about 20 s per 5 s clip. Prompt rule (docs/ue/animation-library.md): name each action with
// its limb and where it goes; simultaneous actions spelled out ("while waving the right hand above the head").
// The sequence is left open and modified (its prompt changed): save it or not as you like; the clip is saved.
// A generation error opens a modal dialog in the editor, which blocks MCP: a timeout here usually means that.
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { setTimeout as sleep } from 'node:timers/promises';
import { parseArgs } from 'node:util';
import { KIT, errorMessage, fail, projectDir } from '../paths.ts';
import { parseMarkedJson } from '../proc.ts';
import { hasNewToolSearch } from './mcp.ts';
import { runPythonFileOrThrow } from './python.ts';

const { values: o, positionals } = parseArgs({
  allowPositionals: true,
  options: {
    name: { type: 'string' },
    seq: { type: 'string' },
    map: { type: 'string' },
    dest: { type: 'string' },
    mesh: { type: 'string' },
    seed: { type: 'string' },
    section: { type: 'string' },
    timeout: { type: 'string', default: '300' },
    state: { type: 'boolean', default: false },
    help: { type: 'boolean', short: 'h', default: false },
  },
});
const prompt = positionals.join(' ').trim();
if (o.help || !o.seq || (!o.state && (!prompt || !o.name))) {
  console.log(`usage: node gen/unreal/kimodo.ts "<prompt>" --name A_Name --seq /Game/.../LS_X [--map /Game/.../L_X]
            [--dest /Game/.../Anims] [--mesh /Game/.../SK_X] [--seed N] [--section i] [--timeout 300]
       node gen/unreal/kimodo.ts --state --seq /Game/.../LS_X`);
  process.exit(o.help ? 0 : 2);
}

const PY = join(KIT, 'gen', 'unreal', 'py', 'kimodo.py');
const py = async <T>(args: Record<string, string>): Promise<T> =>
  parseMarkedJson<T>(await runPythonFileOrThrow(PY, { seq: o.seq ?? '', ...args }), 'KIMODO_JSON');

interface Section { start: number | null; end: number | null; prompt: string | null; seed: number | null }
interface State { opened?: boolean; open_in_sequencer?: boolean; sections: Section[] }
interface Exported { out: string; skeleton: string; binding: string; frames: number; seconds: number }

/** The editor's log: <Project>\Saved\Logs\<Project>.log. The plugin's progress and errors only show there. */
function editorLog(): string {
  const proj = projectDir();
  const name = (readdirSync(proj).find((f) => f.endsWith('.uproject')) ?? '').replace(/\.uproject$/, '');
  return join(proj, 'Saved', 'Logs', `${name}.log`);
}
const DONE = /LogAnimGenOffline: .*Stage=CleanupAndPostGenerate/;
const FAILED = /LogAnimGenOffline: (Error|Warning): .*|Async generation failed.*/;

try {
  if (!(await hasNewToolSearch())) fail('Kimodo needs UE 5.9 (the AnimGenOffline plugin): this editor is 5.8');
  if (o.state) {
    console.log(JSON.stringify(await py<State>({ op: 'state' }), null, 2));
    process.exit(0);
  }
  const t0 = Date.now();
  const opened = await py<State>({ op: 'open', ...(o.map ? { map: o.map } : {}) });
  if (!opened.opened) fail(`could not open ${o.seq} in Sequencer`);
  if (opened.sections.length === 0) fail(`${o.seq} has no Generated Animation section (SETUP.md 10b: Add Character)`);
  console.log(`[1] sequence open (${opened.sections.length} generator section(s))`);
  await sleep(1500); // the editor has to tick before the plugin's edit mode listens

  const log = editorLog();
  const from = existsSync(log) ? statSync(log).size : 0;
  const gen = await py<State>({ op: 'generate', prompt, ...(o.seed ? { seed: o.seed } : {}), ...(o.section ? { section: o.section } : {}) });
  console.log(`[2] prompt set (seed ${gen.sections[0]?.seed ?? '?'}): generating ... first run after an editor start ~2 min, then ~20 s`);

  const deadline = Date.now() + (Number(o.timeout) || 300) * 1000;
  let done = false;
  while (Date.now() < deadline) {
    await sleep(2000);
    const text = existsSync(log) ? readFileSync(log, 'utf8').slice(from) : '';
    const bad = text.split('\n').find((l) => FAILED.test(l) && /fail|error/i.test(l));
    if (bad) fail(`generation failed: ${bad.trim().slice(0, 300)} (an error dialog may be open in the editor: close it; SETUP.md 10b for the usual causes)`);
    if (DONE.test(text)) { done = true; break; }
  }
  if (!done) {
    fail(`no "generation done" line in ${log} after ${o.timeout} s. Look at the editor: a Kimodo error dialog blocks it; ` +
      'or Live Update / the section\'s auto-generate is off (then press Generate in the Sequencer toolbar and rerun with the same prompt)');
  }
  console.log(`[3] generated (${((Date.now() - t0) / 1000).toFixed(0)} s)`);
  await sleep(1000);

  const dest = o.dest ?? (o.seq ?? '').split('/').slice(0, -1).join('/');
  const exp = await py<Exported>({ op: 'export', out: `${dest}/${o.name}`, ...(o.mesh ? { mesh: o.mesh } : {}) });
  console.log(`[4] ${exp.out}: ${exp.frames} frames, ${exp.seconds} s, skeleton ${exp.skeleton} (binding ${exp.binding})`);
  console.log('    the sequence stays open with its prompt changed (unsaved): save it to keep the prompt, or close without saving');
} catch (e) {
  console.error(`FAIL: ${errorMessage(e)}`);
  process.exit(1);
}

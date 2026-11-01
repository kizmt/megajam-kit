#!/usr/bin/env node
// Audio generation via ElevenLabs: sound effects, music, voice. No dependencies; Node 24+.
//
//   node gen/audio.ts sfx   "heavy wooden chest lid creaking open" --seconds 2 --name ChestOpen --mono
//   node gen/audio.ts sfx   "gentle night forest ambience, crickets" --seconds 20 --loop --name ForestAmb
//   node gen/audio.ts music "calm mysterious exploration theme, harp and low strings" --seconds 90 --name Explore
//   node gen/audio.ts voice "The old map was right. It's here." --name Line01 [--voice <voice_id>]
//   node gen/audio.ts voices            (list available voice ids)
//   node gen/audio.ts plan  "dark ambient cue, 72 BPM, D minor" --seconds 60 --name Explore   (free: writes a composition plan JSON)
//   node gen/audio.ts music --plan <plan.json> --seed 7 --name Explore                       (compose from an edited plan)
//
// Output: <Project>/Generated/audio/<Kind>_<Name>.mp3 (+ .json sidecar, + 48 kHz WAV via ffmpeg).
// --n 3 makes variants (_1, _2, _3). WAVs are imported into the open editor (MegajamTools.import_sound).
// ElevenLabs keeps no downloadable history of SFX or music: these files are the only copy.

import { existsSync, mkdirSync, readFileSync, readdirSync, renameSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { basename, join } from 'node:path';
import { parseArgs } from 'node:util';
import { KIT, env, errorMessage, fail, generatedDir, pascal } from './paths.ts';
import { McpUnreachableError, callTool } from './unreal/mcp.ts';

type Kind = 'sfx' | 'music' | 'voice';
const PREFIX: Record<Kind, 'SFX' | 'MUS' | 'VO'> = { sfx: 'SFX', music: 'MUS', voice: 'VO' };
const UE_FOLDER: Record<Kind, string> = { sfx: '/Game/Audio/SFX', music: '/Game/Audio/Music', voice: '/Game/Audio/Voice' };
const isKind = (k: string | undefined): k is Kind => k === 'sfx' || k === 'music' || k === 'voice';

const { values: o, positionals } = parseArgs({
  allowPositionals: true,
  options: {
    name: { type: 'string' },
    seconds: { type: 'string' },
    loop: { type: 'boolean', default: false },
    mono: { type: 'boolean', default: false },
    influence: { type: 'string', default: '0.4' },
    vocals: { type: 'boolean', default: false },
    voice: { type: 'string', default: 'JBFqnCBsd6RMkjVDRZzb' },
    model: { type: 'string' },
    format: { type: 'string', default: 'mp3_44100_128' },
    n: { type: 'string', default: '1' },
    plan: { type: 'string' },
    seed: { type: 'string' },
    timestamps: { type: 'boolean', default: false },
    preview: { type: 'string' },
    guidance: { type: 'string' },
    'design-model': { type: 'string' },
    loudness: { type: 'string' },
    enhance: { type: 'boolean', default: false },
    description: { type: 'string' },
    out: { type: 'string' },
    'no-unreal': { type: 'boolean', default: false },
    help: { type: 'boolean', short: 'h', default: false },
  },
});

const [kindArg, ...rest] = positionals;
const text = rest.join(' ').trim();
const USAGE = `usage: node gen/audio.ts sfx|music|voice "<prompt or line>" [--name N] [--seconds S] [--loop] [--mono] [--n 3] [--voice id] [--vocals]
       --mono: downmix to one channel (any sound played at a 3D location: spatialised stereo plays as two spread emitters, 6 dB quieter; docs/ue/audio-ui.md)
       --seed N: voice, or music with --plan (the API refuses a seed with a music prompt; SFX has no seed)
       --timestamps: voice only, saves per-character timing in the .json sidecar (subtitles)
       node gen/audio.ts plan "<music prompt>" [--seconds S] [--name N]   (free; edit the JSON, then: music --plan <file>)
       node gen/audio.ts voices
       node gen/audio.ts design "<voice description>" --name N [--preview "<100-1000 chars in character>"] [--seed N]
                        [--guidance 5] [--design-model eleven_ttv_v3|eleven_multilingual_ttv_v2] [--loudness 0.5] [--enhance]
                        (3 previews; bills only the preview text's characters)
       node gen/audio.ts save <generated_voice_id> --name N   (adds the chosen preview to the account; prints its voice id)`;
const needsText = kindArg !== 'voices' && !(kindArg === 'music' && o.plan);
const COMMANDS = ['voices', 'plan', 'design', 'save'];
if (o.help || (!isKind(kindArg) && !COMMANDS.includes(kindArg ?? '')) || (needsText && !text)) {
  console.log(USAGE);
  process.exit(o.help ? 0 : 2);
}

const key = env('ELEVENLABS_API_KEY') ?? fail(`ELEVENLABS_API_KEY is not set (add it to ${join(KIT, '.env')})`);
const API = 'https://api.elevenlabs.io';
const H = { 'xi-api-key': key, 'Content-Type': 'application/json' };

/** Remaining credits, printed before a batch. Silent if the key may not read the subscription. */
async function printCredits(): Promise<void> {
  try {
    const r = await fetch(`${API}/v1/user/subscription`, { headers: H });
    if (!r.ok) return;
    const s = (await r.json()) as { tier?: string; character_count?: number; character_limit?: number; next_character_count_reset_unix?: number };
    if (s.character_limit === undefined || s.character_count === undefined) return;
    const reset = s.next_character_count_reset_unix ? new Date(s.next_character_count_reset_unix * 1000).toISOString().slice(0, 10) : '?';
    console.log(`Credits left: ${s.character_limit - s.character_count} of ${s.character_limit} (${s.tier ?? '?'} plan, resets ${reset})`);
  } catch { /* offline or no permission: not worth failing the run */ }
}

interface Voice { voice_id: string; name: string; labels?: Record<string, string | undefined> }

if (kindArg === 'voices') {
  const r = await fetch(`${API}/v1/voices`, { headers: H });
  if (!r.ok) fail(`ElevenLabs HTTP ${r.status}: ${(await r.text()).slice(0, 300)}`);
  const j = (await r.json()) as { voices?: Voice[] };
  for (const v of j.voices ?? []) {
    const l = v.labels ?? {};
    console.log(`${v.voice_id}  ${v.name}  ${[l['gender'], l['age'], l['accent'], l['description']].filter(Boolean).join(', ')}`);
  }
  process.exit(0);
}

const secs = o.seconds ? Number(o.seconds) : undefined;

if (kindArg === 'plan') {
  // Composition plan from a prompt: costs no credits (rate limited). Edit chunk durations/styles, then compose with --plan.
  const body: Record<string, unknown> = { prompt: text, model_id: o.model ?? 'music_v2_5' };
  if (secs) body['music_length_ms'] = Math.round(Math.min(600, Math.max(3, secs)) * 1000);
  const r = await fetch(`${API}/v1/music/plan`, { method: 'POST', headers: H, body: JSON.stringify(body) });
  if (!r.ok) fail(`ElevenLabs HTTP ${r.status}: ${(await r.text()).slice(0, 500)}`);
  const dir = o.out ?? generatedDir('audio');
  mkdirSync(dir, { recursive: true });
  const file = join(dir, `MUS_${pascal(o.name ?? text, 4)}.plan.json`);
  writeFileSync(file, JSON.stringify(await r.json(), null, 2));
  console.log(`Plan written (no credits used): ${file}\nCompose: node gen/audio.ts music --plan "${file}" --seed 1 --name ${pascal(o.name ?? text, 4)}`);
  process.exit(0);
}
/** A file path that doesn't overwrite an earlier one (adds a time stamp if the name is taken). */
function freshPath(dir: string, stem: string, ext: string): string {
  const p = join(dir, `${stem}.${ext}`);
  return existsSync(p) ? join(dir, `${stem}_${new Date().toISOString().replace(/[:.]/g, '-')}.${ext}`) : p;
}

if (kindArg === 'design') {
  // Voice Design: 3 previews of a described voice. Listen, then `save <generated_voice_id>` the one the director picks.
  if (!o.name) fail('design needs --name (used for the preview files and the saved voice)');
  if (o.preview !== undefined && (o.preview.length < 100 || o.preview.length > 1000)) {
    fail(`--preview must be 100-1000 characters (it is ${o.preview.length}); write a line or two the character would say`);
  }
  const body: Record<string, unknown> = { voice_description: text };
  if (o.preview) body['text'] = o.preview; else body['auto_generate_text'] = true;
  if (o['design-model']) body['model_id'] = o['design-model'];
  if (o.seed !== undefined) body['seed'] = Number(o.seed);
  if (o.guidance !== undefined) body['guidance_scale'] = Number(o.guidance);
  if (o.loudness !== undefined) body['loudness'] = Number(o.loudness);
  if (o.enhance) body['should_enhance'] = true;
  await printCredits();
  const r = await fetch(`${API}/v1/text-to-voice/design?output_format=mp3_44100_128`, { method: 'POST', headers: H, body: JSON.stringify(body) });
  if (!r.ok) fail(`ElevenLabs HTTP ${r.status}: ${(await r.text()).slice(0, 500)}`);
  const j = (await r.json()) as { text?: string; previews?: { audio_base_64: string; generated_voice_id: string; duration_secs?: number }[] };
  const dir = o.out ?? generatedDir('audio');
  mkdirSync(dir, { recursive: true });
  const stem = `VOICE_${pascal(o.name, 4)}`;
  const previews = (j.previews ?? []).map((p, i) => {
    const file = freshPath(dir, `${stem}_${i + 1}`, 'mp3');
    writeFileSync(file, Buffer.from(p.audio_base_64, 'base64'));
    console.log(`  [${i + 1}] ${file} (${p.duration_secs?.toFixed(1) ?? '?'} s)  generated_voice_id ${p.generated_voice_id}`);
    return { file, generated_voice_id: p.generated_voice_id };
  });
  const sidecar = freshPath(dir, stem, 'design.json');
  writeFileSync(sidecar, JSON.stringify({ name: o.name, request: body, preview_text: j.text, previews, created: new Date().toISOString() }, null, 2));
  console.log(`${previews.length} preview(s); request saved to ${sidecar}\nKeep one: node gen/audio.ts save <generated_voice_id> --name ${pascal(o.name, 4)}`);
  process.exit(previews.length > 0 ? 0 : 1);
}

if (kindArg === 'save') {
  // Saves a design preview as a voice on the account. The description comes from the design sidecar when one matches.
  const gid = text;
  if (!o.name) fail('save needs --name');
  const dir = o.out ?? generatedDir('audio');
  let description = o.description;
  let others: string[] = [];
  for (const f of readdirSync(dir).filter((n) => n.endsWith('.design.json'))) {
    const d = JSON.parse(readFileSync(join(dir, f), 'utf8')) as { request?: { voice_description?: string }; previews?: { generated_voice_id: string }[] };
    if (d.previews?.some((p) => p.generated_voice_id === gid)) {
      description ??= d.request?.voice_description;
      others = d.previews.map((p) => p.generated_voice_id).filter((id) => id !== gid);
      break;
    }
  }
  if (!description) fail(`no design sidecar in ${dir} lists ${gid}; pass --description "<the design prompt>"`);
  const body: Record<string, unknown> = { voice_name: o.name, voice_description: description, generated_voice_id: gid };
  if (others.length) body['played_not_selected_voice_ids'] = others;
  const r = await fetch(`${API}/v1/text-to-voice`, { method: 'POST', headers: H, body: JSON.stringify(body) });
  if (!r.ok) fail(`ElevenLabs HTTP ${r.status}: ${(await r.text()).slice(0, 500)}`);
  const v = (await r.json()) as { voice_id: string };
  console.log(`Saved voice "${o.name}": voice_id ${v.voice_id}\nUse: node gen/audio.ts voice "<line>" --voice ${v.voice_id} --name <Line>   (record the id in DECISIONS.md)`);
  process.exit(0);
}

if (!isKind(kindArg)) fail(USAGE); // narrowed above; keeps the type checker honest
const kind: Kind = kindArg;

const planName = o.plan ? basename(o.plan).replace(/^MUS_/, '').replace(/\.plan\.json$|\.json$/, '') : undefined;
const name = pascal(o.name ?? planName ?? text, 4);
const seed = o.seed !== undefined ? Number(o.seed) : undefined;
if (seed !== undefined && (kind === 'sfx' || (kind === 'music' && !o.plan))) {
  console.log(`  note: --seed ignored (${kind === 'sfx' ? 'SFX has no seed' : 'music takes a seed only with --plan'})`);
}

interface ApiRequest { url: string; body: Record<string, unknown> }

function request(): ApiRequest {
  if (kind === 'sfx') {
    const body: Record<string, unknown> = { text, loop: o.loop, prompt_influence: Number(o.influence), model_id: o.model ?? 'eleven_text_to_sound_v3' };
    if (secs) body['duration_seconds'] = Math.min(30, Math.max(0.5, secs));
    return { url: `${API}/v1/sound-generation?output_format=${o.format}`, body };
  }
  if (kind === 'music') {
    if (o.plan) {
      // A plan replaces the prompt; force_instrumental and music_length_ms only work with a prompt (put "vocals" in negative_styles).
      const body: Record<string, unknown> = { composition_plan: JSON.parse(readFileSync(o.plan, 'utf8')), model_id: o.model ?? 'music_v2_5' };
      if (seed !== undefined) body['seed'] = seed;
      return { url: `${API}/v1/music?output_format=${o.format}`, body };
    }
    const body: Record<string, unknown> = { prompt: text, model_id: o.model ?? 'music_v2_5', force_instrumental: !o.vocals };
    if (secs) body['music_length_ms'] = Math.round(Math.min(600, Math.max(3, secs)) * 1000);
    return { url: `${API}/v1/music?output_format=${o.format}`, body };
  }
  const body: Record<string, unknown> = { text, model_id: o.model ?? 'eleven_v4' };
  if (seed !== undefined) body['seed'] = seed;
  const path = o.timestamps ? `${o.voice}/with-timestamps` : o.voice;
  return { url: `${API}/v1/text-to-speech/${path}?output_format=${o.format}`, body };
}

interface Clip { buf: Buffer; body: Record<string, unknown>; alignment?: unknown }

class StopBatch extends Error {}
const sleep = (ms: number): Promise<void> => new Promise((r) => setTimeout(r, ms));

async function one(): Promise<Clip> {
  const { url, body } = request();
  for (let attempt = 1; ; attempt++) {
    const res = await fetch(url, { method: 'POST', headers: H, body: JSON.stringify(body) });
    if (res.ok) {
      if (kind === 'voice' && o.timestamps) {
        const j = (await res.json()) as { audio_base64: string; alignment?: unknown; normalized_alignment?: unknown };
        return { buf: Buffer.from(j.audio_base64, 'base64'), body, alignment: j.normalized_alignment ?? j.alignment };
      }
      return { buf: Buffer.from(await res.arrayBuffer()), body };
    }
    const detail = (await res.text()).slice(0, 500);
    if (res.status === 402 || /insufficient_credits|quota_exceeded/i.test(detail)) {
      throw new StopBatch(`out of credits (HTTP ${res.status}); stop and tell the director: ${detail}`);
    }
    // 429: rate limit, concurrency limit or system busy. Back off and retry a few times.
    if (res.status === 429 && attempt < 4) { await sleep(2000 * 2 ** (attempt - 1)); continue; }
    // SFX v3 and Eleven v4 are in limited access in some regions: an account without them gets "Unknown model".
    const hint = /unknown model/i.test(detail)
      ? ' (model not available to this account: retry with --model eleven_text_to_sound_v2 for sfx or --model eleven_multilingual_v2 for voice)'
      : /bad_prompt|bad_composition_plan/i.test(detail)
        ? ' (refused prompt: no artist, song or label names; the response may include a suggested rewrite)'
        : '';
    throw new Error(`ElevenLabs HTTP ${res.status}: ${detail}${hint}`);
  }
}

/** Run `count` requests with at most `limit` in flight (music allows 2 at once on every paid plan below Scale; others 3 on Starter). */
async function runPool(count: number, limit: number): Promise<PromiseSettledResult<Clip>[]> {
  const out: PromiseSettledResult<Clip>[] = new Array<PromiseSettledResult<Clip>>(count);
  let next = 0;
  let stopped = false;
  async function worker(): Promise<void> {
    while (next < count) {
      const i = next++;
      if (stopped) { out[i] = { status: 'rejected', reason: new Error('skipped: batch stopped') }; continue; }
      try { out[i] = { status: 'fulfilled', value: await one() }; } catch (e) {
        if (e instanceof StopBatch) stopped = true;
        out[i] = { status: 'rejected', reason: e };
      }
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, count) }, worker));
  return out;
}

/** ffmpeg converts to 48 kHz 16-bit WAV for Unreal. If PATH predates the winget install, look in winget's package dir. */
function findFfmpeg(): string | null {
  const candidates = ['ffmpeg'];
  const pkgs = join(env('LOCALAPPDATA') ?? '', 'Microsoft', 'WinGet', 'Packages');
  try {
    for (const p of readdirSync(pkgs).filter((d) => d.startsWith('Gyan.FFmpeg'))) {
      for (const v of readdirSync(join(pkgs, p))) candidates.push(join(pkgs, p, v, 'bin', 'ffmpeg.exe'));
    }
  } catch { /* no winget packages dir */ }
  return candidates.find((c) => spawnSync(c, ['-version'], { stdio: 'ignore' }).status === 0) ?? null;
}
const FFMPEG = findFfmpeg();

function toWav(file: string): string | null {
  if (!FFMPEG) return null;
  const wav = file.replace(/\.[a-z0-9]+$/, '.wav');
  // ElevenLabs pcm_<rate> is headerless 16-bit mono: ffmpeg must be told the input format.
  const pcmRate = /^pcm_(\d+)/.exec(o.format)?.[1];
  const inFmt = pcmRate ? ['-f', 's16le', '-ar', pcmRate, '-ac', '1'] : [];
  const r = spawnSync(FFMPEG, ['-y', '-loglevel', 'error', ...inFmt, '-i', file, '-ar', '48000', '-sample_fmt', 's16', ...(o.mono ? ['-ac', '1'] : []), wav]);
  return r.status === 0 ? wav : null;
}

const outDir = o.out ?? generatedDir('audio');
mkdirSync(outDir, { recursive: true });

/** A re-run with the same name moves the previous take (audio, sidecar, WAV) to old/ instead of overwriting it:
 *  ElevenLabs can't re-download SFX or music, so the local file is the only copy of a paid generation. */
function keepOld(file: string): void {
  if (!existsSync(file)) return;
  const old = join(outDir, 'old');
  mkdirSync(old, { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  for (const f of [file, file.replace(/\.[a-z0-9]+$/, '.json'), file.replace(/\.[a-z0-9]+$/, '.wav')]) {
    if (existsSync(f)) renameSync(f, join(old, basename(f).replace(/(\.[a-z0-9]+)$/, `_${stamp}$1`)));
  }
}
const count = Math.max(1, Math.min(6, parseInt(o.n, 10) || 1));
const ext = o.format.startsWith('mp3') ? 'mp3' : o.format.startsWith('opus') ? 'opus' : o.format.startsWith('wav') ? 'wav' : 'pcm';
await printCredits();
console.log(`Generating ${count} ${kind} clip(s): ${name}`);
const t = Date.now();
const results = await runPool(count, kind === 'music' ? 2 : 3);
let ok = 0;
const toImport: { wav: string; asset: string }[] = [];
results.forEach((r, i) => {
  if (r.status === 'rejected') { console.error(`  [${i + 1}] FAILED: ${errorMessage(r.reason)}`); return; }
  const asset = `${PREFIX[kind]}_${name}${count > 1 ? `_${i + 1}` : ''}`;
  const file = join(outDir, `${asset}.${ext}`);
  keepOld(file);
  writeFileSync(file, r.value.buf);
  writeFileSync(file.replace(/\.[a-z0-9]+$/, '.json'), JSON.stringify({ kind, text, request: r.value.body, mono: o.mono, created: new Date().toISOString(), ...(r.value.alignment ? { alignment: r.value.alignment } : {}) }, null, 2));
  const wav = ext === 'wav' ? file : toWav(file);
  const note = wav && wav !== file ? `\n      ${wav}` : FFMPEG ? '' : '  (no ffmpeg: WAV not made)';
  console.log(`  [${i + 1}] ${file} (${(r.value.buf.length / 1024).toFixed(0)} KB)${note}`);
  ok++;
  if (wav) toImport.push({ wav, asset });
});
console.log(`${ok}/${count} succeeded in ${((Date.now() - t) / 1000).toFixed(1)}s`);

// Import into the open Unreal project (needs the MegajamTools plugin). Skipped with --no-unreal or if the editor is closed.
if (!o['no-unreal'] && toImport.length > 0) {
  const folder = UE_FOLDER[kind];
  const looping = kind === 'music' || o.loop;
  try {
    for (const { wav, asset } of toImport) {
      await callTool('megajam_tools.toolsets.MegajamTools', 'import_sound', { folder_path: folder, asset_name: asset, source_file: wav.replace(/\\/g, '/'), looping, replace: true });
      console.log(`  imported ${folder}/${asset}${looping ? ' (looping)' : ''}`);
    }
  } catch (e) {
    if (!(e instanceof McpUnreachableError)) {
      console.error(`  FAIL: Unreal import failed: ${errorMessage(e).slice(0, 300)}`);
      process.exit(1);
    }
    console.log('  editor not running: WAVs ready, import later');
  }
}
process.exit(ok > 0 ? 0 : 1);

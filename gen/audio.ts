#!/usr/bin/env node
// Audio generation via ElevenLabs: sound effects, music, voice. No dependencies; Node 24+.
//
//   node gen/audio.ts sfx   "heavy wooden chest lid creaking open" --seconds 2 --name ChestOpen --mono
//   node gen/audio.ts sfx   "gentle night forest ambience, crickets" --seconds 20 --loop --name ForestAmb
//   node gen/audio.ts music "calm mysterious exploration theme, harp and low strings" --seconds 90 --name Explore
//   node gen/audio.ts voice "The old map was right. It's here." --name Line01 [--voice <voice_id>]
//   node gen/audio.ts voices            (list available voice ids)
//
// Output: <Project>/Generated/audio/<Kind>_<Name>.mp3 (+ .json sidecar, + 48 kHz WAV via ffmpeg).
// --n 3 makes variants (_1, _2, _3). WAVs are imported into the open editor (MegajamTools.import_sound).

import { mkdirSync, readdirSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { join } from 'node:path';
import { parseArgs } from 'node:util';
import { KIT, env, errorMessage, fail, generatedDir } from './paths.ts';
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
    out: { type: 'string' },
    'no-unreal': { type: 'boolean', default: false },
    help: { type: 'boolean', short: 'h', default: false },
  },
});

const [kindArg, ...rest] = positionals;
const text = rest.join(' ').trim();
const USAGE = `usage: node gen/audio.ts sfx|music|voice "<prompt or line>" [--name N] [--seconds S] [--loop] [--mono] [--n 3] [--voice id] [--vocals]
       --mono: downmix to one channel (any sound played at a 3D location; stereo only spatialises as mono anyway)
       node gen/audio.ts voices`;
if (o.help || (!isKind(kindArg) && kindArg !== 'voices') || (kindArg !== 'voices' && !text)) {
  console.log(USAGE);
  process.exit(o.help ? 0 : 2);
}

const key = env('ELEVENLABS_API_KEY') ?? fail(`ELEVENLABS_API_KEY is not set (add it to ${join(KIT, '.env')})`);
const API = 'https://api.elevenlabs.io';
const H = { 'xi-api-key': key, 'Content-Type': 'application/json' };

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
if (!isKind(kindArg)) fail(USAGE); // narrowed above; keeps the type checker honest
const kind: Kind = kindArg;

const pascal = (s: string): string =>
  s.replace(/[^a-zA-Z0-9]+/g, ' ').trim().split(' ').slice(0, 4).map((w) => (w[0]?.toUpperCase() ?? '') + w.slice(1)).join('');
const name = pascal(o.name ?? text);
const secs = o.seconds ? Number(o.seconds) : undefined;

interface ApiRequest { url: string; body: Record<string, unknown> }

function request(): ApiRequest {
  if (kind === 'sfx') {
    const body: Record<string, unknown> = { text, loop: o.loop, prompt_influence: Number(o.influence), model_id: o.model ?? 'eleven_text_to_sound_v2' };
    if (secs) body['duration_seconds'] = Math.min(30, Math.max(0.5, secs));
    return { url: `${API}/v1/sound-generation?output_format=${o.format}`, body };
  }
  if (kind === 'music') {
    const body: Record<string, unknown> = { prompt: text, model_id: o.model ?? 'music_v2_5', force_instrumental: !o.vocals };
    if (secs) body['music_length_ms'] = Math.round(Math.min(600, Math.max(3, secs)) * 1000);
    return { url: `${API}/v1/music?output_format=${o.format}`, body };
  }
  return { url: `${API}/v1/text-to-speech/${o.voice}?output_format=${o.format}`, body: { text, model_id: o.model ?? 'eleven_multilingual_v2' } };
}

interface Clip { buf: Buffer; body: Record<string, unknown> }

async function one(): Promise<Clip> {
  const { url, body } = request();
  const res = await fetch(url, { method: 'POST', headers: H, body: JSON.stringify(body) });
  if (!res.ok) throw new Error(`ElevenLabs HTTP ${res.status}: ${(await res.text()).slice(0, 500)}`);
  return { buf: Buffer.from(await res.arrayBuffer()), body };
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
  const r = spawnSync(FFMPEG, ['-y', '-loglevel', 'error', '-i', file, '-ar', '48000', '-sample_fmt', 's16', ...(o.mono ? ['-ac', '1'] : []), wav]);
  return r.status === 0 ? wav : null;
}

const outDir = o.out ?? generatedDir('audio');
mkdirSync(outDir, { recursive: true });
const count = Math.max(1, Math.min(6, parseInt(o.n, 10) || 1));
const ext = o.format.startsWith('mp3') ? 'mp3' : o.format.startsWith('opus') ? 'opus' : o.format.startsWith('wav') ? 'wav' : 'pcm';
console.log(`Generating ${count} ${kind} clip(s): ${name}`);
const t = Date.now();
const results = await Promise.allSettled(Array.from({ length: count }, one));
let ok = 0;
const toImport: { wav: string; asset: string }[] = [];
results.forEach((r, i) => {
  if (r.status === 'rejected') { console.error(`  [${i + 1}] FAILED: ${errorMessage(r.reason)}`); return; }
  const asset = `${PREFIX[kind]}_${name}${count > 1 ? `_${i + 1}` : ''}`;
  const file = join(outDir, `${asset}.${ext}`);
  writeFileSync(file, r.value.buf);
  writeFileSync(file.replace(/\.[a-z0-9]+$/, '.json'), JSON.stringify({ kind, text, request: r.value.body, mono: o.mono, created: new Date().toISOString() }, null, 2));
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
    console.log(e instanceof McpUnreachableError ? '  editor not running: WAVs ready, import later' : `  Unreal import failed: ${errorMessage(e).slice(0, 300)}`);
  }
}
process.exit(ok > 0 ? 0 : 1);

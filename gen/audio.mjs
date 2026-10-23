#!/usr/bin/env node
// Audio generation via ElevenLabs: sound effects, music, voice. No dependencies; Node 22+.
//
//   node gen/audio.mjs sfx   "heavy wooden chest lid creaking open" --seconds 2 --name ChestOpen
//   node gen/audio.mjs sfx   "gentle night forest ambience, crickets" --seconds 20 --loop --name ForestAmb
//   node gen/audio.mjs music "calm mysterious exploration theme, harp and low strings" --seconds 90 --name Explore
//   node gen/audio.mjs voice "The old map was right. It's here." --name Line01 [--voice <voice_id>]
//   node gen/audio.mjs voices            (list available voice ids)
//
// Output: out/audio/<Kind>_<Name>.mp3 (+ .json sidecar). --n 3 makes variants (_1, _2, _3).

import { writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';

const KIT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
if (existsSync(join(KIT, '.env'))) process.loadEnvFile(join(KIT, '.env'));

const { values: o, positionals } = parseArgs({
  allowPositionals: true,
  options: {
    name: { type: 'string' },
    seconds: { type: 'string' },
    loop: { type: 'boolean', default: false },
    influence: { type: 'string', default: '0.4' },
    vocals: { type: 'boolean', default: false },
    voice: { type: 'string', default: 'JBFqnCBsd6RMkjVDRZzb' },
    model: { type: 'string' },
    format: { type: 'string', default: 'mp3_44100_128' },
    n: { type: 'string', default: '1' },
    out: { type: 'string', default: join(KIT, 'out', 'audio') },
    help: { type: 'boolean', short: 'h', default: false },
  },
});

const [kind, ...rest] = positionals;
const text = rest.join(' ').trim();
const KINDS = { sfx: 'SFX', music: 'MUS', voice: 'VO' };
if (o.help || (!KINDS[kind] && kind !== 'voices') || (kind !== 'voices' && !text)) {
  console.log('usage: node gen/audio.mjs sfx|music|voice "<prompt or line>" [--name N] [--seconds S] [--loop] [--n 3] [--voice id] [--vocals]\n       node gen/audio.mjs voices');
  process.exit(o.help ? 0 : 2);
}

const key = process.env.ELEVENLABS_API_KEY;
if (!key) { console.error(`FAIL: ELEVENLABS_API_KEY is not set (add it to ${join(KIT, '.env')})`); process.exit(1); }
const API = 'https://api.elevenlabs.io';
const H = { 'xi-api-key': key, 'Content-Type': 'application/json' };

if (kind === 'voices') {
  const r = await fetch(`${API}/v1/voices`, { headers: H });
  const j = await r.json();
  for (const v of j.voices ?? []) console.log(`${v.voice_id}  ${v.name}  ${[v.labels?.gender, v.labels?.age, v.labels?.accent, v.labels?.description].filter(Boolean).join(', ')}`);
  process.exit(0);
}

const pascal = (s) => s.replace(/[^a-zA-Z0-9]+/g, ' ').trim().split(' ').slice(0, 4).map((w) => w[0].toUpperCase() + w.slice(1)).join('');
const name = o.name ? pascal(o.name) : pascal(text);
const secs = o.seconds ? Number(o.seconds) : undefined;

function request() {
  if (kind === 'sfx') {
    const body = { text, loop: o.loop, prompt_influence: Number(o.influence), model_id: o.model ?? 'eleven_text_to_sound_v2' };
    if (secs) body.duration_seconds = Math.min(30, Math.max(0.5, secs));
    return { url: `${API}/v1/sound-generation?output_format=${o.format}`, body };
  }
  if (kind === 'music') {
    const body = { prompt: text, model_id: o.model ?? 'music_v2_5', force_instrumental: !o.vocals };
    if (secs) body.music_length_ms = Math.round(Math.min(600, Math.max(3, secs)) * 1000);
    return { url: `${API}/v1/music?output_format=${o.format}`, body };
  }
  return { url: `${API}/v1/text-to-speech/${o.voice}?output_format=${o.format}`, body: { text, model_id: o.model ?? 'eleven_multilingual_v2' } };
}

async function one() {
  const { url, body } = request();
  const res = await fetch(url, { method: 'POST', headers: H, body: JSON.stringify(body) });
  if (!res.ok) throw new Error(`ElevenLabs HTTP ${res.status}: ${(await res.text()).slice(0, 500)}`);
  return { buf: Buffer.from(await res.arrayBuffer()), body };
}

// ffmpeg converts to 48 kHz 16-bit WAV for Unreal. winget's alias dir is checked in case PATH predates the install.
function findFfmpeg() {
  const links = join(process.env.LOCALAPPDATA ?? '', 'Microsoft', 'WinGet', 'Links', 'ffmpeg.exe');
  for (const c of ['ffmpeg', links]) {
    if (spawnSync(c, ['-version'], { stdio: 'ignore' }).status === 0) return c;
  }
  return null;
}
const FFMPEG = findFfmpeg();
function toWav(file) {
  if (!FFMPEG) return null;
  const wav = file.replace(/\.[a-z0-9]+$/, '.wav');
  const r = spawnSync(FFMPEG, ['-y', '-loglevel', 'error', '-i', file, '-ar', '48000', '-sample_fmt', 's16', wav]);
  return r.status === 0 ? wav : null;
}

mkdirSync(o.out, { recursive: true });
const count = Math.max(1, Math.min(6, parseInt(o.n, 10) || 1));
const ext = o.format.startsWith('mp3') ? 'mp3' : o.format.startsWith('opus') ? 'opus' : o.format.startsWith('wav') ? 'wav' : 'pcm';
console.log(`Generating ${count} ${kind} clip(s): ${name}`);
const t = Date.now();
const results = await Promise.allSettled(Array.from({ length: count }, one));
let ok = 0;
results.forEach((r, i) => {
  if (r.status === 'rejected') { console.error(`  [${i + 1}] FAILED: ${r.reason.message}`); return; }
  const file = join(o.out, `${KINDS[kind]}_${name}${count > 1 ? `_${i + 1}` : ''}.${ext}`);
  writeFileSync(file, r.value.buf);
  writeFileSync(file.replace(/\.[a-z0-9]+$/, '.json'), JSON.stringify({ kind, text, request: r.value.body, created: new Date().toISOString() }, null, 2));
  const wav = ext === 'wav' ? file : toWav(file);
  console.log(`  [${i + 1}] ${file} (${(r.value.buf.length / 1024).toFixed(0)} KB)${wav && wav !== file ? `\n      ${wav}` : FFMPEG ? '' : '  (no ffmpeg: WAV not made)'}`);
  ok++;
});
console.log(`${ok}/${count} succeeded in ${((Date.now() - t) / 1000).toFixed(1)}s`);
process.exit(ok ? 0 : 1);

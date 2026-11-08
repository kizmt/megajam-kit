#!/usr/bin/env node
// Concept image generation for the megajam pipeline (Gemini or OpenAI). No dependencies; Node 24+.
//
//   node gen/image.ts "a cracked ceramic teapot" --asset --n 3
//   node gen/image.ts "rain-soaked city street at night, neon signs" --aspect 16:9 --provider openai
//   node gen/image.ts "a desk fan" --asset --style C:/dev/<Project>/art/style-prefix.txt `
//        --ref C:/dev/<Project>/art/reference/key.png
// (--style/--ref are project files: give absolute paths, since the scripts run from the kit folder.)
//
// Output: <Project>/Generated/images/<slug>-<timestamp>-<i>.<ext> (or --out) plus a .json sidecar with the
// full prompt and settings. --asset wraps the prompt for image-to-3D: one object, centred, plain background.
// Each saved image is printed as "  [i] <path>" (asset.ts parses that line).

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { extname, join } from 'node:path';
import { parseArgs } from 'node:util';
import { KIT, env, errorMessage, fail, generatedDir } from './paths.ts';

type Provider = 'gemini' | 'openai';
type ImageMime = 'image/png' | 'image/jpeg' | 'image/webp';
interface GeneratedImage { mime: string; data: string }
interface RefImage { mime: ImageMime; data: string; path: string }

const DEFAULT_MODELS: Record<Provider, string> = { gemini: 'gemini-3-pro-image', openai: 'gpt-image-2' };
const REF_MIME: Record<string, ImageMime> = { '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp' };
const EXT: Record<string, string> = { 'image/png': 'png', 'image/jpeg': 'jpg', 'image/webp': 'webp' };
// gpt-image-2 sizes: square, landscape, portrait.
const OPENAI_SIZE: Record<string, string> = { '1:1': '1024x1024', '16:9': '1536x1024', '4:3': '1536x1024', '9:16': '1024x1536', '3:4': '1024x1536' };

const ASSET_WRAPPER = (subject: string): string =>
  `${subject}. Single object only, centred, the entire object fully visible with margin around it, ` +
  `three-quarter view from slightly above, plain flat light-grey background, soft even lighting, ` +
  `no cast shadow, no ground plane, no text, no other objects. Game asset concept for 3D modelling.`;

const { values: opt, positionals } = parseArgs({
  allowPositionals: true,
  options: {
    provider: { type: 'string', default: 'gemini' },
    model: { type: 'string' },
    n: { type: 'string', default: '1' },
    aspect: { type: 'string', default: '1:1' },
    size: { type: 'string', default: '2K' },
    asset: { type: 'boolean', default: false },
    style: { type: 'string' },
    ref: { type: 'string', multiple: true, default: [] },
    out: { type: 'string' },
    name: { type: 'string' },
    help: { type: 'boolean', short: 'h', default: false },
  },
});

if (opt.help || positionals.length === 0) {
  console.log(`Usage: node gen/image.ts "<prompt>" [--asset] [--n 3] [--provider gemini|openai] [--model id]
       [--aspect 1:1|16:9|9:16|4:3|3:4] [--size 1K|2K|4K] [--style prefix.txt] [--ref img.png ...]
       [--out dir] [--name slug]
Defaults: provider gemini (${DEFAULT_MODELS.gemini}), openai model ${DEFAULT_MODELS.openai}.
--size is Gemini only; OpenAI picks its size from --aspect (1024x1024, 1536x1024 or 1024x1536).`);
  process.exit(opt.help ? 0 : 2);
}

const providerArg = opt.provider.toLowerCase();
if (providerArg !== 'gemini' && providerArg !== 'openai') fail(`unknown provider "${opt.provider}" (use gemini or openai)`);
const provider: Provider = providerArg;
const model = opt.model ?? DEFAULT_MODELS[provider];
const count = Math.max(1, Math.min(8, parseInt(opt.n, 10) || 1));

let prompt = positionals.join(' ').trim();
if (opt.asset) prompt = ASSET_WRAPPER(prompt);
if (opt.style) prompt = `${readFileSync(opt.style, 'utf8').trim()}\n\n${prompt}`;

const refs: RefImage[] = opt.ref.map((p) => {
  const mime = REF_MIME[extname(p).toLowerCase()];
  if (!mime) fail(`unsupported reference image type: ${p}`);
  return { mime, data: readFileSync(p).toString('base64'), path: p };
});

const slug = (opt.name ?? positionals.join(' ')).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40) || 'image';
const d = new Date();
const pad = (v: number): string => String(v).padStart(2, '0');
const stamp = `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
const outDir = opt.out ?? generatedDir('images');
mkdirSync(outDir, { recursive: true });

function needKey(name: string): string {
  return env(name) ?? fail(`${name} is not set (add it to ${join(KIT, '.env')})`);
}

// ---------- providers ----------

async function gemini(): Promise<GeneratedImage> {
  const key = needKey('GEMINI_API_KEY');
  const input = [{ type: 'text', text: prompt }, ...refs.map((r) => ({ type: 'image', mime_type: r.mime, data: r.data }))];
  const res = await fetch('https://generativelanguage.googleapis.com/v1beta/interactions', {
    method: 'POST',
    headers: { 'x-goog-api-key': key, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model,
      input,
      // Interactions API only returns JPEG for gemini-3-pro-image (PNG = HTTP 400; PIPELINE.md "Tool references").
      response_format: { type: 'image', mime_type: 'image/jpeg', aspect_ratio: opt.aspect, image_size: opt.size.toUpperCase() },
    }),
  });
  const body = await res.text();
  if (!res.ok) throw new Error(`Gemini HTTP ${res.status}: ${body.slice(0, 600)}`);
  const first = findImages(JSON.parse(body))[0];
  if (!first) throw new Error(`Gemini returned no image. Response starts: ${body.slice(0, 600)}`);
  return first;
}

interface OpenAiImagesResponse { data?: { b64_json?: string }[] }

async function openai(): Promise<GeneratedImage> {
  const key = needKey('OPENAI_API_KEY');
  const size = OPENAI_SIZE[opt.aspect] ?? '1024x1024';
  let res: Response;
  if (refs.length > 0) {
    const form = new FormData();
    form.append('model', model);
    form.append('prompt', prompt);
    form.append('size', size);
    for (const r of refs) form.append('image[]', new Blob([Buffer.from(r.data, 'base64')], { type: r.mime }), r.path.split(/[\\/]/).pop() ?? 'ref');
    res = await fetch('https://api.openai.com/v1/images/edits', { method: 'POST', headers: { Authorization: `Bearer ${key}` }, body: form });
  } else {
    res = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model, prompt, size, n: 1 }),
    });
  }
  const body = await res.text();
  if (!res.ok) throw new Error(`OpenAI HTTP ${res.status}: ${body.slice(0, 600)}`);
  const b64 = (JSON.parse(body) as OpenAiImagesResponse).data?.[0]?.b64_json;
  if (!b64) throw new Error(`OpenAI returned no image. Response starts: ${body.slice(0, 600)}`);
  return { mime: 'image/png', data: b64 };
}

/** Walk any JSON response and collect base64 image payloads ({mime_type|mimeType: image/*, data: "..."}). */
function findImages(node: unknown, found: GeneratedImage[] = []): GeneratedImage[] {
  if (Array.isArray(node)) {
    for (const n of node) findImages(n, found);
  } else if (typeof node === 'object' && node !== null) {
    const rec = node as Record<string, unknown>;
    const mime = rec['mime_type'] ?? rec['mimeType'];
    const data = rec['data'];
    if (typeof mime === 'string' && mime.startsWith('image/') && typeof data === 'string' && data.length > 1000) {
      found.push({ mime, data });
    }
    for (const v of Object.values(rec)) findImages(v, found);
  }
  return found;
}

// ---------- run ----------

const call = provider === 'gemini' ? gemini : openai;
console.log(`Generating ${count} image(s) with ${provider}/${model} ...`);
const started = Date.now();

const results = await Promise.allSettled(Array.from({ length: count }, () => call()));
let ok = 0;
results.forEach((r, i) => {
  if (r.status === 'rejected') { console.error(`  [${i + 1}] FAILED: ${errorMessage(r.reason)}`); return; }
  const file = join(outDir, `${slug}-${stamp}-${i + 1}.${EXT[r.value.mime] ?? 'png'}`);
  writeFileSync(file, Buffer.from(r.value.data, 'base64'));
  writeFileSync(file.replace(/\.[a-z]+$/, '.json'), JSON.stringify({ provider, model, prompt, aspect: opt.aspect, size: opt.size, refs: refs.map((x) => x.path), created: new Date().toISOString() }, null, 2));
  console.log(`  [${i + 1}] ${file}`);
  ok++;
});

console.log(`${ok}/${count} succeeded in ${((Date.now() - started) / 1000).toFixed(1)}s`);
process.exit(ok > 0 ? 0 : 1);

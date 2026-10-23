#!/usr/bin/env node
// One command from prompt to prop in the open Unreal level.
//
//   node gen/asset.ts "a brass lantern" --name Lantern --max 0.4
//   node gen/asset.ts "a brass lantern" --name Lantern --concepts 4      (stop after 4 concept images)
//   node gen/asset.ts --image C:/dev/<Project>/Generated/assets/lantern/concept-2.jpg --name Lantern --max 0.4
//
// Steps: concept image -> Tripo image-to-3D (FBX) -> Blender prep (size, pivot, textures) ->
//        Blender preview -> Unreal import + place + screenshot (if the editor is open).
// Everything for one asset lands in <Project>/Generated/assets/<name>/ with a manifest.json (see gen/paths.ts).

import { mkdirSync, writeFileSync } from 'node:fs';
import { basename, join, resolve } from 'node:path';
import { parseArgs } from 'node:util';
import { KIT, errorMessage, generatedDir } from './paths.ts';
import { parseMarkedJson, parseTripo, q, run, secs } from './proc.ts';
import { applyPbr, ref, type ApplyPbrResult } from './unreal/materials.ts';
import { McpUnreachableError, callTool, captureViewport, mcpCall, type Box, type CameraTransform, type ObjectRef } from './unreal/mcp.ts';

process.env['TRIPO_NO_UPDATE_CHECK'] = '1';

const { values: o, positionals } = parseArgs({
  allowPositionals: true,
  options: {
    name: { type: 'string' },
    image: { type: 'string' },
    model: { type: 'string' },
    concepts: { type: 'string' },
    provider: { type: 'string', default: 'gemini' },
    style: { type: 'string' },
    ref: { type: 'string', multiple: true, default: [] },
    max: { type: 'string' },
    height: { type: 'string' },
    tex: { type: 'string', default: '2048' },
    faces: { type: 'string', default: '30000' },
    tris: { type: 'string' },
    dest: { type: 'string', default: '/Game/Props' },
    place: { type: 'string', default: '300,0,0' },
    yaw: { type: 'string', default: '0' },
    hulls: { type: 'string' },
    'no-unreal': { type: 'boolean', default: false },
    help: { type: 'boolean', short: 'h', default: false },
  },
});

const prompt = positionals.join(' ').trim();
if (o.help || (!prompt && !o.image && !o.model)) {
  console.log(`usage: node gen/asset.ts "<prompt>" --name Name [--max 0.8 | --height 1.8]
       [--concepts N] [--image file] [--model file] [--provider gemini|openai] [--style file] [--ref img]
       [--tex 2048] [--faces 30000] [--tris N] [--dest /Game/Props] [--place x,y,z] [--yaw deg] [--hulls 4-8] [--no-unreal]
  --hulls N  replace the default collision with N convex hulls (props the player pushes, picks up or
             walks around closely; leave off for background props)`);
  process.exit(o.help ? 0 : 2);
}

// ---------- external process output shapes (verified 2026-10-24) ----------

/** PREP_JSON= line of gen/blender/prep.py. */
interface PrepResult { size_m: number[]; triangles_out: number; fbx_mb: number; [extra: string]: unknown }

interface Manifest {
  name: string;
  prompt: string;
  created: string;
  steps: {
    concept?: { files: string[]; time?: string; supplied?: boolean };
    tripo?: { model: string; supplied?: boolean; credits?: number; task?: string; time?: string };
    prep?: PrepResult & { time: string };
    preview?: string;
    material?: ApplyPbrResult;
    nanite?: boolean;
    collision?: { hulls: number; ok: boolean };
    unreal?: { asset: string; actor: string; size_cm: number[]; shot: string; time: string } | { skipped: string };
  };
  total?: string;
  error?: string;
}

function parsePrep(out: string): PrepResult {
  const j = parseMarkedJson<Partial<PrepResult>>(out, 'PREP_JSON');
  if (!Array.isArray(j.size_m) || typeof j.triangles_out !== 'number') throw new Error(`unexpected PREP_JSON: ${JSON.stringify(j).slice(0, 400)}`);
  return j as PrepResult;
}

// ---------- helpers ----------

const pascal = (s: string): string =>
  s.replace(/[^a-zA-Z0-9]+/g, ' ').trim().split(' ').map((w) => (w[0]?.toUpperCase() ?? '') + w.slice(1)).join('');
const name = pascal(o.name ?? (prompt || basename(o.image ?? o.model ?? 'Asset')).split(' ').slice(-2).join(' '));
const dir = join(generatedDir('assets'), name.toLowerCase());
mkdirSync(dir, { recursive: true });
const manifest: Manifest = { name, prompt, created: new Date().toISOString(), steps: {} };
const t0 = Date.now();
const save = (): void => writeFileSync(join(dir, 'manifest.json'), JSON.stringify(manifest, null, 2));
const step = (n: number, msg: string): void => console.log(`[${n}] ${msg}`);

const S = 'editor_toolset.toolsets.static_mesh.StaticMeshTools';
const SC = 'editor_toolset.toolsets.scene.SceneTools';
const AS = 'editor_toolset.toolsets.asset.AssetTools';
const A = 'editor_toolset.toolsets.actor.ActorTools';
const E = 'EditorToolset.EditorAppToolset';

try {
  // 1. Concept image(s)
  let image = o.image ? resolve(o.image) : null;
  if (o.model) {
    step(1, 'skipped (--model supplied)');
  } else if (!image) {
    const n = o.concepts ? parseInt(o.concepts, 10) : 1;
    step(1, `concept image x${n} (${o.provider})`);
    const t = Date.now();
    const args = [q(join(KIT, 'gen', 'image.ts')), q(prompt), '--asset', '--provider', o.provider, '--n', String(n), '--out', q(dir), '--name', 'concept'];
    if (o.style) args.push('--style', q(o.style));
    for (const r of o.ref) args.push('--ref', q(r));
    const out = await run('node', args, 'image');
    const files = [...out.matchAll(/\[\d+\] (.+\.(?:png|jpg|webp))/g)].flatMap((m) => (m[1] ? [m[1].trim()] : []));
    const firstImage = files[0];
    if (!firstImage) throw new Error(`no concept image produced:\n${out}`);
    manifest.steps.concept = { files, time: secs(t) };
    for (const f of files) console.log(`    ${f}`);
    if (o.concepts) {
      save();
      const size = o.max ? `--max ${o.max}` : o.height ? `--height ${o.height}` : '--max <m>';
      console.log(`\nStopped after concepts. Pick one, then:\n  node gen/asset.ts --image "<file>" --name ${name} ${size}`);
      process.exit(0);
    }
    image = firstImage;
  } else {
    manifest.steps.concept = { files: [image], supplied: true };
  }

  // 2. Image -> 3D (Tripo CLI)
  let t = Date.now();
  let raw: string;
  if (o.model) {
    raw = resolve(o.model);
    step(2, `skipped, using ${raw}`);
    manifest.steps.tripo = { model: raw, supplied: true };
  } else {
    if (!image) throw new Error('no concept image');
    step(2, `Tripo image-to-3D (face limit ${o.faces}) ... ~3-4 min`);
    const tripoDir = join(dir, 'tripo');
    const tj = parseTripo(await run('tripo', ['make', q(image), '--for', 'game-pc', '-p', `face_limit=${o.faces}`, '-o', q(tripoDir), '--name', name.toLowerCase(), '--json', '--yes', '--no-open'], 'tripo'));
    raw = tj.model_file; // parseTripo resolves the CLI's cwd-relative paths
    manifest.steps.tripo = { model: raw, credits: tj.credits_consumed, task: tj.source_task_id ?? tj.task_id, time: secs(t) };
    console.log(`    ${raw} (${tj.credits_consumed} credits, ${secs(t)})`);
  }

  // 3. Blender prep
  step(3, 'Blender prep (size, pivot, textures, FBX)');
  t = Date.now();
  const fbx = join(dir, `SM_${name}.fbx`);
  const pargs = ['-b', '--factory-startup', '--python', q(join(KIT, 'gen', 'blender', 'prep.py')), '--', q(raw), q(fbx), '--name', name, '--tex', o.tex];
  if (o.max) pargs.push('--max', o.max);
  if (o.height) pargs.push('--height', o.height);
  if (o.tris) pargs.push('--tris', o.tris);
  const prep = parsePrep(await run('blender', pargs, 'blender prep'));
  manifest.steps.prep = { ...prep, time: secs(t) };
  console.log(`    ${fbx}  ${prep.size_m.join(' x ')} m, ${prep.triangles_out} tris, ${prep.fbx_mb} MB`);

  // 4. Preview render
  step(4, 'Blender preview');
  const preview = join(dir, 'preview.png');
  await run('blender', ['-b', '--factory-startup', '--python', q(join(KIT, 'gen', 'blender', 'inspect.py')), '--', q(fbx), q(preview)], 'blender inspect');
  manifest.steps.preview = preview;

  // 5. Unreal import + place + screenshot
  if (o['no-unreal']) {
    step(5, 'skipped (--no-unreal)');
  } else {
    step(5, `Unreal import to ${o.dest}/SM_${name}`);
    t = Date.now();
    const folder = `${o.dest}/${name}`;
    const assetPath = `${folder}/SM_${name}`;
    const meshRef = ref(assetPath);
    try {
      if (await callTool<boolean>(AS, 'exists', { path: folder })) await mcpCall(AS, 'delete', { path: folder });
      // Import geometry only (the importer's auto materials drop metallic and can fail to compile),
      // then build MI_<Name> from the kit's master PBR material.
      await mcpCall(S, 'import_file', { folder_path: folder, asset_name: `SM_${name}`, source_file: fbx.replace(/\\/g, '/'), import_materials: true, import_textures: false });
      const autoMat = `${folder}/M_${name}`;
      manifest.steps.material = await applyPbr({ name, texDir: join(dir, `${name}_tex`), dest: o.dest, mesh: assetPath });
      if (await callTool<boolean>(AS, 'exists', { path: autoMat })) await mcpCall(AS, 'delete', { path: autoMat });
      // Nanite on: Epic's 5.8 guidance is to enable it wherever supported. Without it every generated prop
      // renders all ~25k triangles at any distance (one LOD), which adds up fast as the level fills.
      await mcpCall(S, 'set_nanite_enabled', { mesh: meshRef, enabled: true });
      manifest.steps.nanite = true;
      if (o.hulls) {
        const hull_count = Math.max(1, Math.min(16, parseInt(o.hulls, 10) || 4));
        const okHulls = await callTool<boolean>(S, 'generate_convex_collisions', { mesh: meshRef, hull_count });
        manifest.steps.collision = { hulls: hull_count, ok: okHulls };
        console.log(`    collision: ${hull_count} convex hulls ${okHulls ? 'OK' : 'FAILED'}`);
      }
      const [x = 0, y = 0, z = 0] = o.place.split(',').map(Number);
      const actor = await callTool<ObjectRef>(SC, 'add_to_scene_from_asset', {
        asset_path: assetPath, name,
        xform: { location: { x, y, z }, rotation: { pitch: 0, yaw: Number(o.yaw), roll: 0 } }, snap_to_ground: false,
      });
      const b = await callTool<Box>(A, 'get_actor_bounds', { actor });
      const c = { x: (b.min.x + b.max.x) / 2, y: (b.min.y + b.max.y) / 2, z: (b.min.z + b.max.z) / 2 };
      const r = Math.max(b.max.x - b.min.x, b.max.y - b.min.y, b.max.z - b.min.z);
      const d = Math.max(r * 2.2, 120);
      const cam = { x: c.x - d * 0.62, y: c.y - d * 0.62, z: c.z + d * 0.45 };
      const yaw = (Math.atan2(c.y - cam.y, c.x - cam.x) * 180) / Math.PI;
      const pitch = (Math.atan2(c.z - cam.z, Math.hypot(c.x - cam.x, c.y - cam.y)) * 180) / Math.PI;
      const view: CameraTransform = { location: cam, rotation: { pitch, yaw, roll: 0 } };
      await mcpCall(E, 'SetCameraTransform', { transform: view });
      const shot = await captureViewport(join(dir, 'shot.png'), { captureTransform: view });
      await mcpCall(AS, 'save_assets', { asset_paths: [] });
      const sizeCm = [b.max.x - b.min.x, b.max.y - b.min.y, b.max.z - b.min.z].map(Math.round);
      manifest.steps.unreal = { asset: assetPath, actor: actor.refPath, size_cm: sizeCm, shot, time: secs(t) };
      console.log(`    placed at ${o.place}, ${sizeCm.join(' x ')} cm, screenshot ${shot}`);
    } catch (e) {
      if (!(e instanceof McpUnreachableError)) throw e;
      manifest.steps.unreal = { skipped: 'editor not running' };
      console.log('    editor not running: FBX is ready, import later');
    }
  }

  manifest.total = secs(t0);
  save();
  console.log(`\nDone in ${manifest.total}. ${join(dir, 'manifest.json')}`);
} catch (e) {
  manifest.error = errorMessage(e);
  save();
  console.error(`\nFAIL: ${manifest.error}`);
  process.exit(1);
}

#!/usr/bin/env node
// One command from prompt to prop in the open Unreal level.
//
//   node gen/asset.mjs "a brass lantern" --name Lantern --max 0.4
//   node gen/asset.mjs "a brass lantern" --name Lantern --concepts 4      (stop after 4 concept images)
//   node gen/asset.mjs --image C:/dev/<Project>/Generated/assets/lantern/concept-2.png --name Lantern --max 0.4
//
// Steps: concept image -> Tripo image-to-3D (FBX) -> Blender prep (size, pivot, textures) ->
//        Blender preview -> Unreal import + place + screenshot (if the editor is open).
// Everything for one asset lands in <Project>/Generated/assets/<name>/ with a manifest.json (see gen/paths.mjs).

import { spawn } from 'node:child_process';
import { existsSync, mkdirSync, writeFileSync, copyFileSync, readdirSync } from 'node:fs';
import { dirname, join, resolve, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';
import { mcpCall, captureViewport } from './unreal/mcp.mjs';
import { applyPbr } from './unreal/materials.mjs';

import { KIT, generatedDir } from './paths.mjs';
process.env.TRIPO_NO_UPDATE_CHECK = '1';

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
  console.log(`usage: node gen/asset.mjs "<prompt>" --name Name [--max 0.8 | --height 1.8]
       [--concepts N] [--image file] [--provider gemini|openai] [--style file] [--ref img]
       [--tex 2048] [--faces 30000] [--tris N] [--dest /Game/Props] [--place x,y,z] [--yaw deg] [--hulls 4-8] [--no-unreal]
  --hulls N  replace the default collision with N convex hulls (props the player pushes, picks up or
             walks around closely; leave off for background props)`);
  process.exit(o.help ? 0 : 2);
}

const pascal = (s) => s.replace(/[^a-zA-Z0-9]+/g, ' ').trim().split(' ').map((w) => w[0].toUpperCase() + w.slice(1)).join('');
const name = o.name ? pascal(o.name) : pascal((prompt || basename(o.image)).split(' ').slice(-2).join(' '));
const dir = join(generatedDir('assets'), name.toLowerCase());
mkdirSync(dir, { recursive: true });
const manifest = { name, prompt, created: new Date().toISOString(), steps: {} };
const t0 = Date.now();
const secs = (t) => `${((Date.now() - t) / 1000).toFixed(1)}s`;
const save = () => writeFileSync(join(dir, 'manifest.json'), JSON.stringify(manifest, null, 2));

function run(cmd, args, { label }) {
  return new Promise((res, rej) => {
    const p = spawn(cmd, args, { shell: process.platform === 'win32', env: process.env });
    let out = '', err = '';
    p.stdout.on('data', (d) => { out += d; });
    p.stderr.on('data', (d) => { err += d; });
    p.on('close', (code) => (code === 0 ? res(out) : rej(new Error(`${label} failed (exit ${code}):\n${(err || out).slice(-1500)}`))));
  });
}
const q = (s) => (process.platform === 'win32' ? `"${s}"` : s);
const step = (n, msg) => console.log(`[${n}] ${msg}`);

try {
  // 1. Concept image(s)
  let image = o.image ? resolve(o.image) : null;
  if (o.model) {
    step(1, 'skipped (--model supplied)');
  } else if (!image) {
    const n = o.concepts ? parseInt(o.concepts, 10) : 1;
    step(1, `concept image x${n} (${o.provider})`);
    const t = Date.now();
    const args = [q(join(KIT, 'gen', 'image.mjs')), q(prompt), '--asset', '--provider', o.provider, '--n', String(n), '--out', q(dir), '--name', 'concept'];
    if (o.style) args.push('--style', q(o.style));
    for (const r of o.ref) args.push('--ref', q(r));
    const out = await run('node', args, { label: 'image' });
    const files = [...out.matchAll(/\[\d+\] (.+\.(?:png|jpg|webp))/g)].map((m) => m[1].trim());
    if (!files.length) throw new Error(`no concept image produced:\n${out}`);
    manifest.steps.concept = { files, time: secs(t) };
    files.forEach((f) => console.log(`    ${f}`));
    if (o.concepts) {
      save();
      console.log(`\nStopped after concepts. Pick one, then:\n  node gen/asset.mjs --image "<file>" --name ${name} ${o.max ? `--max ${o.max}` : o.height ? `--height ${o.height}` : '--max <m>'}`);
      process.exit(0);
    }
    image = files[0];
  } else {
    manifest.steps.concept = { files: [image], supplied: true };
  }

  // 2. Image -> 3D (Tripo CLI)
  let t = Date.now();
  let raw;
  if (o.model) {
    raw = resolve(o.model);
    step(2, `skipped, using ${raw}`);
    manifest.steps.tripo = { model: raw, supplied: true };
  } else {
    step(2, `Tripo image-to-3D (face limit ${o.faces}) ... ~3-4 min`);
    const tripoDir = join(dir, 'tripo');
    const tout = await run('tripo', ['make', q(image), '--for', 'game-pc', '-p', `face_limit=${o.faces}`, '-o', q(tripoDir), '--name', name.toLowerCase(), '--json', '--yes', '--no-open'], { label: 'tripo' });
    const last = tout.trim().split('\n').reverse().find((l) => l.trim().startsWith('{'));
    const tj = JSON.parse(last);
    raw = resolve(tj.model_file); // CLI reports paths relative to the current directory
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
  const pout = await run('blender', pargs, { label: 'blender prep' });
  const prep = JSON.parse(pout.split('\n').find((l) => l.startsWith('PREP_JSON=')).slice(10));
  manifest.steps.prep = { ...prep, time: secs(t) };
  console.log(`    ${fbx}  ${prep.size_m.join(' x ')} m, ${prep.triangles_out} tris, ${prep.fbx_mb} MB`);

  // 4. Preview render
  step(4, 'Blender preview');
  const preview = join(dir, 'preview.png');
  await run('blender', ['-b', '--factory-startup', '--python', q(join(KIT, 'gen', 'blender', 'inspect.py')), '--', q(fbx), q(preview)], { label: 'blender inspect' });
  manifest.steps.preview = preview;

  // 5. Unreal import + place + screenshot
  if (o['no-unreal']) {
    step(5, 'skipped (--no-unreal)');
  } else {
    step(5, `Unreal import to ${o.dest}/SM_${name}`);
    t = Date.now();
    const S = 'editor_toolset.toolsets.static_mesh.StaticMeshTools', SC = 'editor_toolset.toolsets.scene.SceneTools';
    const AS = 'editor_toolset.toolsets.asset.AssetTools', A = 'editor_toolset.toolsets.actor.ActorTools', E = 'EditorToolset.EditorAppToolset';
    const folder = `${o.dest}/${name}`;
    const assetPath = `${folder}/SM_${name}`;
    try {
      if ((await mcpCall(AS, 'exists', { path: folder })).returnValue) await mcpCall(AS, 'delete', { path: folder });
      // Import geometry only (the importer's auto materials drop metallic and can fail to compile),
      // then build MI_<Name> from the kit's master PBR material.
      await mcpCall(S, 'import_file', { folder_path: folder, asset_name: `SM_${name}`, source_file: fbx.replace(/\\/g, '/'), import_materials: true, import_textures: false });
      const autoMat = `${folder}/M_${name}`;
      const mat = await applyPbr({ name, texDir: join(dir, `${name}_tex`), dest: o.dest, mesh: assetPath });
      if ((await mcpCall(AS, 'exists', { path: autoMat })).returnValue) await mcpCall(AS, 'delete', { path: autoMat });
      manifest.steps.material = mat;
      // Nanite on: Epic's 5.8 guidance is to enable it wherever supported. Without it every generated prop
      // renders all ~25k triangles at any distance (one LOD), which adds up fast as the level fills.
      await mcpCall(S, 'set_nanite_enabled', { mesh: { refPath: `${assetPath}.SM_${name}` }, enabled: true });
      manifest.steps.nanite = true;
      if (o.hulls) {
        const hull_count = Math.max(1, Math.min(16, parseInt(o.hulls, 10) || 4));
        const r = await mcpCall(S, 'generate_convex_collisions', { mesh: { refPath: `${assetPath}.SM_${name}` }, hull_count });
        manifest.steps.collision = { hulls: hull_count, ok: !!r.returnValue };
        console.log(`  collision: ${hull_count} convex hulls ${r.returnValue ? 'OK' : 'FAILED'}`);
      }
      const [x, y, z] = o.place.split(',').map(Number);
      const placed = await mcpCall(SC, 'add_to_scene_from_asset', {
        asset_path: assetPath, name,
        xform: { location: { x, y, z }, rotation: { pitch: 0, yaw: Number(o.yaw), roll: 0 } }, snap_to_ground: false,
      });
      const actor = placed.returnValue;
      const b = (await mcpCall(A, 'get_actor_bounds', { actor })).returnValue;
      const c = { x: (b.min.x + b.max.x) / 2, y: (b.min.y + b.max.y) / 2, z: (b.min.z + b.max.z) / 2 };
      const r = Math.max(b.max.x - b.min.x, b.max.y - b.min.y, b.max.z - b.min.z);
      const d = Math.max(r * 2.2, 120);
      const cam = { x: c.x - d * 0.62, y: c.y - d * 0.62, z: c.z + d * 0.45 };
      const yaw = (Math.atan2(c.y - cam.y, c.x - cam.x) * 180) / Math.PI;
      const pitch = (Math.atan2(c.z - cam.z, Math.hypot(c.x - cam.x, c.y - cam.y)) * 180) / Math.PI;
      const view = { location: cam, rotation: { pitch, yaw, roll: 0 } };
      await mcpCall(E, 'SetCameraTransform', { transform: view });
      const shot = await captureViewport(join(dir, 'shot.png'), { captureTransform: view });
      await mcpCall(AS, 'save_assets', { asset_paths: [] });
      const sizeCm = ['x', 'y', 'z'].map((k) => Math.round(b.max[k] - b.min[k]));
      manifest.steps.unreal = { asset: assetPath, actor: actor.refPath, size_cm: sizeCm, shot, time: secs(t) };
      console.log(`    placed at ${o.place}, ${sizeCm.join(' x ')} cm, screenshot ${shot}`);
    } catch (e) {
      if (/cannot reach Unreal MCP/.test(e.message)) {
        manifest.steps.unreal = { skipped: 'editor not running' };
        console.log('    editor not running: FBX is ready, import later');
      } else throw e;
    }
  }

  manifest.total = secs(t0);
  save();
  console.log(`\nDone in ${manifest.total}. ${join(dir, 'manifest.json')}`);
} catch (e) {
  manifest.error = e.message;
  save();
  console.error(`\nFAIL: ${e.message}`);
  process.exit(1);
}

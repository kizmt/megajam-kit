#!/usr/bin/env node
// One command from prompt to prop in the open Unreal level.
//
//   node gen/asset.ts "a retro desk fan" --name DeskFan --max 0.4
//   node gen/asset.ts "a retro desk fan" --name DeskFan --concepts 4      (stop after 4 concept images)
//   node gen/asset.ts "a stone well with a wooden roof" --name Well --turnaround --concepts 2   (four-view sheets for multiview)
//   node gen/asset.ts --image C:/dev/<Project>/Generated/assets/deskfan/concept-<stamp>-2.jpg --name DeskFan --max 0.4
//
// Steps: concept image -> Tripo image-to-3D (FBX) -> Blender prep (size, pivot, textures) ->
//        Blender preview -> Unreal import + place + screenshot (if the editor is open).
// Everything for one asset lands in <Project>/Generated/assets/<name>/ with a manifest.json (see gen/paths.ts).

import { mkdirSync, writeFileSync } from 'node:fs';
import { basename, extname, join, resolve } from 'node:path';
import { parseArgs } from 'node:util';
import { KIT, errorMessage, generatedDir, pascal } from './paths.ts';
import { packOrm, parseMarkedJson, parseTripo, requireTripoCredits, run, secs, type OrmResult } from './proc.ts';
import { applyPbr, ref, type ApplyPbrResult } from './unreal/materials.ts';
import { McpUnreachableError, callTool, captureViewport, mcpCall, type Box, type CameraTransform, type ObjectRef } from './unreal/mcp.ts';
import { runPythonCode } from './unreal/python.ts';
import { TURNAROUND_RULES, VIEW_ORDER, parseViews, splitSheet } from './views.ts';

process.env['TRIPO_NO_UPDATE_CHECK'] = '1';

const { values: o, positionals } = parseArgs({
  allowPositionals: true,
  options: {
    name: { type: 'string' },
    image: { type: 'string' },
    sheet: { type: 'string' },
    views: { type: 'string' },
    turnaround: { type: 'boolean', default: false },
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
    'no-place': { type: 'boolean', default: false },
    yaw: { type: 'string', default: '0' },
    hulls: { type: 'string' },
    'no-unreal': { type: 'boolean', default: false },
    help: { type: 'boolean', short: 'h', default: false },
  },
});

const prompt = positionals.join(' ').trim();
if (o.help || (!prompt && !o.image && !o.sheet && !o.views && !o.model)) {
  console.log(`usage: node gen/asset.ts "<prompt>" --name Name [--max 0.8 | --height 1.8]
       [--concepts N] [--image file] [--turnaround | --sheet file | --views f,l,b,r] [--model file] [--provider gemini|openai] [--style file] [--ref img]
       [--tex 2048] [--faces 30000] [--tris N] [--dest /Game/Props] [--place x,y,z | --no-place] [--yaw deg] [--hulls 4-8] [--no-unreal]
  --turnaround  the concept is a 2x2 four-view sheet (front, left, back, right) sent to Tripo's multiview-to-3D:
             for props whose back or sides matter (seen all round, asymmetric); --sheet/--views start from one
  --hulls N  replace the default collision with N convex hulls (props the player pushes, picks up or
             walks around closely; leave off for background props)
  A value starting with '-' needs '=': --place=-300,0,0  --yaw=-90 (Node's parser rejects '--yaw -90').`);
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
    concept?: { files: string[]; time?: string; supplied?: boolean; views?: string[] };
    tripo?: { model: string; supplied?: boolean; credits?: number; task?: string; time?: string };
    prep?: PrepResult & { time: string };
    orm?: OrmResult;
    preview?: string;
    material?: ApplyPbrResult;
    nanite?: boolean;
    collision?: { hulls: number; ok: boolean };
    unreal?: { asset: string; actor: string; size_cm: number[]; shot: string; time: string } | { asset: string; placed: false; time: string } | { skipped: string };
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

/** A prop's four-view sheet for Tripo multiview (gen/views.ts cuts it). */
const TURNAROUND_WRAPPER = (subject: string): string =>
  `Game asset turnaround sheet for 3D modelling: ${subject}. A single object, no other objects. ${TURNAROUND_RULES('grid')}`;

// --name is used as given; a prompt or file name gives its last two words (a file's extension dropped).
const fromFile = (f: string): string => basename(f, extname(f));
const name = pascal(o.name ?? (prompt || fromFile(o.image ?? o.sheet ?? o.model ?? 'Asset')).split(' ').slice(-2).join(' '));
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
  let views: string[] | null = o.views ? parseViews(o.views) : null;
  const sheetToViews = (sheet: string, supplied: boolean, t?: number): void => {
    const r = splitSheet(sheet);
    views = VIEW_ORDER.map((v) => r.views[v]);
    manifest.steps.concept = { files: [r.sheet], views, ...(supplied ? { supplied } : {}), ...(t ? { time: secs(t) } : {}) };
    console.log(`    views: ${views.join('\n           ')}`);
  };
  if (o.model) {
    step(1, 'skipped (--model supplied)');
  } else if (views) {
    manifest.steps.concept = { files: views, views, supplied: true };
  } else if (o.sheet) {
    step(1, `cutting the turnaround sheet ${o.sheet}`);
    sheetToViews(resolve(o.sheet), true);
  } else if (!image) {
    const n = o.concepts ? parseInt(o.concepts, 10) : 1;
    const turn = o.turnaround;
    step(1, `${turn ? 'turnaround sheet' : 'concept image'} x${n} (${o.provider})`);
    const t = Date.now();
    const args = turn
      ? [join(KIT, 'gen', 'image.ts'), TURNAROUND_WRAPPER(prompt), '--aspect', '1:1', ...(o.provider === 'gemini' ? ['--size', '2K'] : []), '--provider', o.provider, '--n', String(n), '--out', dir, '--name', 'sheet']
      : [join(KIT, 'gen', 'image.ts'), prompt, '--asset', '--provider', o.provider, '--n', String(n), '--out', dir, '--name', 'concept'];
    if (o.style) args.push('--style', o.style);
    for (const r of o.ref) args.push('--ref', r);
    const out = await run('node', args, 'image');
    const files = [...out.matchAll(/\[\d+\] (.+\.(?:png|jpg|webp))/g)].flatMap((m) => (m[1] ? [m[1].trim()] : []));
    const firstImage = files[0];
    if (!firstImage) throw new Error(`no concept image produced:\n${out}`);
    manifest.steps.concept = { files, time: secs(t) };
    for (const f of files) console.log(`    ${f}`);
    if (o.concepts) {
      save();
      const size = o.max ? `--max ${o.max}` : o.height ? `--height ${o.height}` : '--max <m>';
      console.log(`\nStopped after concepts. Pick one, then:\n  node gen/asset.ts --${turn ? 'sheet' : 'image'} "<file>" --name ${name} ${size}`);
      process.exit(0);
    }
    if (turn) sheetToViews(firstImage, false, t);
    else image = firstImage;
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
    const inputs: string[] = views ?? (image ? [image] : []);
    if (!inputs.length) throw new Error('no concept image');
    await requireTripoCredits(45, 'This prop');
    step(2, `Tripo ${views ? 'multiview' : 'image'}-to-3D (face limit ${o.faces}) ... ~3-4 min`);
    const tripoDir = join(dir, 'tripo');
    // Four paths in front, left, back, right order make `tripo make` a multiview_to_model task.
    const tj = parseTripo(await run('tripo', ['make', ...inputs, '--for', 'game-pc', '-p', `face_limit=${o.faces}`, '-o', tripoDir, '--name', name.toLowerCase(), '--json', '--yes', '--no-open'], 'tripo'));
    raw = tj.model_file; // parseTripo resolves the CLI's cwd-relative paths
    manifest.steps.tripo = { model: raw, credits: tj.credits_consumed, task: tj.source_task_id ?? tj.task_id, time: secs(t) };
    console.log(`    ${raw} (${tj.credits_consumed} credits, ${secs(t)})`);
  }

  // 3. Blender prep
  step(3, 'Blender prep (size, pivot, textures, FBX)');
  t = Date.now();
  const fbx = join(dir, `SM_${name}.fbx`);
  const pargs = ['-b', '--factory-startup', '--python', join(KIT, 'gen', 'blender', 'prep.py'), '--', raw, fbx, '--name', name, '--tex', o.tex];
  if (o.max) pargs.push('--max', o.max);
  if (o.height) pargs.push('--height', o.height);
  if (o.tris) pargs.push('--tris', o.tris);
  const prep = parsePrep(await run('blender', pargs, 'blender prep'));
  manifest.steps.prep = { ...prep, time: secs(t) };
  // Roughness + metallic (+ AO) -> one ORM texture for M_PBR_Master v2.
  manifest.steps.orm = await packOrm(KIT, join(dir, `${name}_tex`), name);
  console.log(`    ${fbx}  ${prep.size_m.join(' x ')} m, ${prep.triangles_out} tris, ${prep.fbx_mb} MB`);

  // 4. Preview render
  step(4, 'Blender preview');
  const preview = join(dir, 'preview.png');
  try {
    await run('blender', ['-b', '--factory-startup', '--python', join(KIT, 'gen', 'blender', 'inspect.py'), '--', fbx, preview], 'blender inspect');
    manifest.steps.preview = preview;
  } catch (e) {
    console.log(`    preview failed (non-fatal): ${errorMessage(e).slice(-400)}`);
  }

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
      // Rerun: remove the actor a previous run placed FIRST. Otherwise every run stacks a new actor, and the old ones
      // keep pointing at the deleted mesh. Only actors this script placed: labelled <Name> AND showing a mesh from
      // this prop's folder. Copies placed by hand keep the reference check below in force (it refuses).
      const removed = await runPythonCode(
        'import unreal\nA = unreal.get_editor_subsystem(unreal.EditorActorSubsystem)\nn = 0\n' +
        'for a in A.get_all_level_actors():\n    if a.get_actor_label() != ARGS["label"]:\n        continue\n' +
        '    c = a.get_component_by_class(unreal.StaticMeshComponent)\n    m = c.get_editor_property("static_mesh") if c else None\n' +
        '    if m and m.get_path_name().startswith(ARGS["folder"] + "/"):\n        A.destroy_actor(a)\n        n += 1\nprint(n)',
        { label: name, folder });
      if (removed.ok && removed.output.trim() !== '0') console.log(`    removed ${removed.output.trim()} previous ${name} actor(s)`);
      if (await callTool<boolean>(AS, 'exists', { path: folder })) {
        // Deleting an asset that something outside the folder still references opens a modal dialog that stalls
        // the editor, so check first (loading referencers to confirm, so the actors removed above don't count).
        const outside = await runPythonCode(
          'from megajam_tools.refs import folder_referencers_outside\nprint("\\n".join(folder_referencers_outside(ARGS["folder"])))',
          { folder });
        if (!outside.ok) throw new Error(`reference check failed: ${outside.output.slice(-400)}`);
        if (outside.output.trim()) {
          throw new Error(`refusing to replace ${folder}: assets outside it still reference it (remove or repoint them, or use a new name):\n  ${outside.output.trim().split('\n').join('\n  ')}`);
        }
        await mcpCall(AS, 'delete', { path: folder });
      }
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
      const saveFolder = async (): Promise<void> => {
        // Save only this prop's folder: an empty asset list would save every dirty package, the user's level and
        // work included. only_if_is_dirty=False: a scripted edit can leave a package unmarked (CLAUDE.md,
        // Verification).
        const saved = await runPythonCode(
          'import unreal\nprint(unreal.EditorAssetLibrary.save_directory(ARGS["folder"], only_if_is_dirty=False, recursive=True))',
          { folder });
        if (!saved.ok || saved.output.trim() !== 'True') throw new Error(`saving ${folder} failed: ${saved.output.slice(-400)}`);
      };
      if (o['no-place']) {
        // Import only: no actor in the open level (a level rebuilt and saved by a script would keep a stray actor).
        await saveFolder();
        manifest.steps.unreal = { asset: assetPath, placed: false, time: secs(t) };
        console.log(`    imported ${assetPath} (not placed: --no-place)`);
      } else {
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
        // The placed actor lives in the open level, which stays unsaved: say so.
        await saveFolder();
        console.log('    the level now has an unsaved change (the placed actor): save it if you keep it');
        const sizeCm = [b.max.x - b.min.x, b.max.y - b.min.y, b.max.z - b.min.z].map(Math.round);
        manifest.steps.unreal = { asset: assetPath, actor: actor.refPath, size_cm: sizeCm, shot, time: secs(t) };
        console.log(`    placed at ${o.place}, ${sizeCm.join(' x ')} cm, screenshot ${shot}`);
      }
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

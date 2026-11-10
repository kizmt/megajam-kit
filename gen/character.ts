#!/usr/bin/env node
// One command from prompt to a rigged, PBR-textured character with Epic's template animations retargeted onto it.
//
//   node gen/character.ts "a young mechanic in overalls and boots" --name Mechanic --concepts 3   (stop: pick a T-pose)
//   node gen/character.ts --image <concept.jpg> --name Mechanic [--parent /Script/MyGame.GameCharacter]
//   node gen/character.ts "a young mechanic ..." --name Mechanic --turnaround --concepts 2   (four-view sheets)
//   node gen/character.ts --sheet <turnaround sheet> --name Mechanic                     (Tripo multiview-to-3D)
//   node gen/character.ts --task <tripo model/texture task id> --name Mechanic [--pbr <textured model file>]
//   node gen/character.ts --rig <tripo rig.fbx> --pbr <textured model file> --name Mechanic   (no Tripo credits)
//
// Steps: T-pose concept (or a four-view sheet cut by gen/views.ts) -> Tripo model -> Tripo re-texture (v3.5, delight; fixes blotchy textures) ->
//        Tripo rig (--spec unreal) on the textured task -> Blender extract_pbr (colour/normal/roughness/metallic
//        from the TEXTURED model: the rig output keeps only colour and wires it as the normal map) ->
//        Blender prep_rig (height, facing, cm export: root bone scale 1, no textures) -> Unreal import ->
//        MI_<Name> of the kit master material -> root-scale gate -> IK retarget of ABP_Unarmed -> optional BP.
// Credits per new character: model 45 + re-texture 20 + rig 25 (--no-retexture: 70, maps from the model).
// Needs the editor open with MegajamTools, and the Third Person content pack in the project (Manny + ABP_Unarmed).
// Everything lands in <Project>/Generated/characters/<name>/ with a manifest.json.
// No manual step: 6b removes the foot-IK Control Rig node from the new ABP (it twists non-Manny feet).

import { mkdirSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { parseArgs } from 'node:util';
import { KIT, errorMessage, generatedDir, pascal } from './paths.ts';
import { packOrm, parseMarkedJson, parseTripo, readTripoTask, requireTripoCredits, run, secs, type OrmResult } from './proc.ts';
import { applyPbr, type ApplyPbrResult } from './unreal/materials.ts';
import { McpUnreachableError } from './unreal/mcp.ts';
import { assetExists, deleteAsset } from './unreal/ue.ts';
import { runPythonFileOrThrow } from './unreal/python.ts';
import { stripFootIk } from './unreal/abp.ts';
import { TURNAROUND_RULES, VIEW_ORDER, parseViews, splitSheet } from './views.ts';

process.env['TRIPO_NO_UPDATE_CHECK'] = '1';

const { values: o, positionals } = parseArgs({
  allowPositionals: true,
  options: {
    name: { type: 'string' },
    concepts: { type: 'string' },
    image: { type: 'string' },
    sheet: { type: 'string' },
    views: { type: 'string' },
    turnaround: { type: 'boolean', default: false },
    task: { type: 'string' },
    rig: { type: 'string' },
    pbr: { type: 'string' },
    'no-retexture': { type: 'boolean', default: false },
    provider: { type: 'string', default: 'gemini' },
    style: { type: 'string' },
    ref: { type: 'string', multiple: true, default: [] },
    faces: { type: 'string', default: '30000' },
    tex: { type: 'string', default: '0' },
    'max-tex': { type: 'string', default: '2048' },
    spec: { type: 'string', default: 'unreal' },
    height: { type: 'string', default: '1.8' },
    rot: { type: 'string', default: '-90' },
    parent: { type: 'string' },
    'no-unreal': { type: 'boolean', default: false },
    help: { type: 'boolean', short: 'h', default: false },
  },
});

const prompt = positionals.join(' ').trim();
const usage = `usage: node gen/character.ts "<description>" --name Name [--concepts N]
       node gen/character.ts --image <concept> --name Name
       node gen/character.ts "<description>" --turnaround --name Name [--concepts N]   (four-view sheet, multiview 3D)
       node gen/character.ts --sheet <turnaround sheet> --name Name | --views front,left,back,right --name Name
       node gen/character.ts --task <tripo task id> [--pbr <textured model.glb|fbx>] --name Name
       node gen/character.ts --rig <tripo rig.fbx> --pbr <textured model.glb|fbx> --name Name
  options: [--no-retexture] [--height 1.8] [--rot=-90] [--faces 30000] [--max-tex 2048] [--tex 0] [--spec unreal|mixamo]
           [--provider gemini|openai] [--style file] [--ref img] [--parent /Script/<Module>.<Class>] [--no-unreal]
  --name is required (asset names: SK_<Name>, MI_<Name>, ABP_Unarmed_<Name>, BP_<Name>).
  --turnaround: the concept is a 2x2 sheet (front, left, back, right), cut by gen/views.ts and sent to Tripo's
  multiview-to-3D: Tripo stops guessing the back and sides. --sheet starts from such a sheet, --views from 4 files.
  --task: with --pbr, rigs that task as is; without, re-textures it first (unless --no-retexture).
  --max-tex: in-game texture cap (cooked size); the full-res source is kept. --tex N downsizes the source too.
  --parent makes BP_<Name>: a thin subclass of that C++ Character with mesh, anim class and offset set.
  A negative value needs '=' (--rot=-90): Node's parser rejects '--rot -90' as ambiguous.`;
if (o.help || !o.name || (!prompt && !o.image && !o.sheet && !o.views && !o.task && !o.rig)) {
  console.log(usage);
  process.exit(o.help ? 0 : 2);
}
if (o.rig && !o.pbr) {
  console.error('FAIL: --rig needs --pbr <textured model file>: the rig FBX has no normal/roughness/metallic maps.');
  process.exit(2);
}

// ---------- typed results (verified 2026-10-24) ----------

interface Facing { ok: boolean | null; why?: string; toe_forward_m?: number; toe_side_m?: number; left_foot_x_m?: number; suggest_rot?: number }
interface PrepRigResult { armature: string; bones: number; scale_factor: number; size_m: number[]; mode: string; out: string; rot: number; facing: Facing }
interface PbrMap { file: string; size: number[]; from: string; channel: number | null }
interface PbrResult { source: string; dir: string; maps: Partial<Record<'basecolor' | 'normal' | 'roughness' | 'metallic', PbrMap>>; missing: string[] }
interface ImportResult { mesh: string; skeleton: string; size_cm: number[] }
interface CheckResult { ok: boolean; root: string; root_scale: number[]; head_z_cm: number | null; bones: number }
interface RetargetResult { ik_rig: string; retargeter: string; chains: number; assets: number; anim_dir: string; abp: string | null }
interface BpResult { blueprint: string; parent: string; mesh_z: number }

interface Manifest {
  name: string;
  prompt: string;
  created: string;
  steps: {
    concept?: { files: string[]; time?: string; supplied?: boolean; views?: string[] };
    model?: { task: string; file?: string; credits?: number; time?: string; supplied?: boolean };
    texture?: { task: string; file: string; credits: number; time: string } | { skipped: string };
    rig?: { fbx: string; task?: string; credits?: number; time?: string; supplied?: boolean };
    pbr?: PbrResult;
    orm?: OrmResult;
    prep?: PrepRigResult & { time: string };
    import?: ImportResult;
    material?: ApplyPbrResult;
    check?: CheckResult;
    retarget?: RetargetResult & { time: string };
    footik?: { changed: boolean; deleted: string[] };
    blueprint?: BpResult;
    unreal?: { skipped: string };
  };
  total?: string;
  error?: string;
}

// Failure modes seen 2026-10-24: an A-pose (arms angled down), a body turned slightly off-camera, and blotchy
// dark/light patches on the final texture. The pose/camera wording fixed the first two (3/3 clean concepts).
// The blotches came from Tripo's texturing, not the concept: the v3.5 re-texture step fixes them.
const BODY_RULES =
  `Clean, evenly lit, flat colours with crisp edges between materials: no dirt, grime, stains, weathering, ` +
  `smudges or painted shadows, no dramatic lighting, no ambient occlusion. ` +
  `Strict T-pose: both arms stretched straight out to the sides, perfectly horizontal at shoulder height, ` +
  `exactly 90 degrees from the torso (NOT angled down, not an A-pose), palms facing down, fingers together. ` +
  `Legs straight, feet shoulder-width apart, flat on the ground. EMPTY HANDS: no props, no weapons, no bag ` +
  `or tool, nothing held in or attached to the hands. `;
const TPOSE_WRAPPER = (subject: string): string =>
  `Character model sheet, front view only: ${subject}. Game character proportions. ${BODY_RULES}` +
  `Body and head facing the viewer squarely, ` +
  `zero rotation, perfectly left-right symmetrical, orthographic camera at chest height. Whole body visible head ` +
  `to toe with margin, plain flat light-grey background, soft even lighting, no shadow, no text.`;
// Four views (PIPELINE.md "Four views"): the same T-pose rules, one sheet, cut by gen/views.ts.
const TURNAROUND_WRAPPER = (subject: string): string =>
  `Character turnaround model sheet: ${subject}. Game character proportions. ${BODY_RULES}` +
  `Whole body visible head to toe in every view. ${TURNAROUND_RULES('grid')}`;

const name = pascal(o.name);
const dir = join(generatedDir('characters'), name.toLowerCase());
mkdirSync(dir, { recursive: true });
const manifest: Manifest = { name, prompt, created: new Date().toISOString(), steps: {} };
const t0 = Date.now();
const save = (): void => writeFileSync(join(dir, 'manifest.json'), JSON.stringify(manifest, null, 2));
const step = (n: string, msg: string): void => console.log(`[${n}] ${msg}`);
const PY = (f: string): string => join(KIT, 'gen', 'unreal', 'py', f);
const BL = (f: string): string => join(KIT, 'gen', 'blender', f);
const fwd = (p: string): string => p.replace(/\\/g, '/');
const folder = `/Game/Characters/${name}`;
const tripoOut = (sub: string): string => join(dir, 'tripo', sub);

try {
  let rigFbx = o.rig ? resolve(o.rig) : null;
  let pbrSource = o.pbr ? resolve(o.pbr) : null;
  let task = o.task ?? null; // the task the rig step will use

  // 1. T-pose concept (one front view, or a four-view turnaround sheet)
  let image = o.image ? resolve(o.image) : null;
  let views: string[] | null = o.views ? parseViews(o.views) : null;
  const sheetToViews = (sheet: string, supplied: boolean, t?: number): void => {
    const r = splitSheet(sheet);
    views = VIEW_ORDER.map((v) => r.views[v]);
    manifest.steps.concept = { files: [r.sheet], views, ...(supplied ? { supplied } : {}), ...(t ? { time: secs(t) } : {}) };
    console.log(`    views: ${views.join('\n           ')}\n    Check the four views match (same design, left/right the right way round) before paying for the model.`);
  };
  if (rigFbx || task) {
    step('1', 'skipped (rig or task supplied)');
  } else if (views) {
    manifest.steps.concept = { files: views, views, supplied: true };
  } else if (o.sheet) {
    step('1', `cutting the turnaround sheet ${o.sheet}`);
    sheetToViews(resolve(o.sheet), true);
  } else if (!image && o.turnaround) {
    const n = o.concepts ? Math.max(1, parseInt(o.concepts, 10) || 1) : 1;
    step('1', `turnaround sheet x${n} (${o.provider})`);
    const t = Date.now();
    const args = [join(KIT, 'gen', 'image.ts'), TURNAROUND_WRAPPER(prompt), '--aspect', '1:1', '--provider', o.provider, '--n', String(n), '--out', dir, '--name', 'sheet'];
    if (o.provider === 'gemini') args.push('--size', '2K'); // ~1K px per view
    if (o.style) args.push('--style', o.style);
    for (const r of o.ref) args.push('--ref', r);
    const out = await run('node', args, 'image');
    const files = [...out.matchAll(/\[\d+\] (.+\.(?:png|jpg|webp))/g)].flatMap((m) => (m[1] ? [m[1].trim()] : []));
    const first = files[0];
    if (!first) throw new Error(`no turnaround sheet produced:\n${out}`);
    for (const f of files) console.log(`    ${f}`);
    if (o.concepts) {
      manifest.steps.concept = { files, time: secs(t) };
      save();
      console.log(`\nStopped after sheets. Pick one whose four views match, in T-pose, then:\n  node gen/character.ts --sheet "<file>" --name ${name}`);
      process.exit(0);
    }
    sheetToViews(first, false, t);
  } else if (!image) {
    const n = o.concepts ? Math.max(1, parseInt(o.concepts, 10) || 1) : 1;
    step('1', `T-pose concept x${n} (${o.provider})`);
    const t = Date.now();
    const args = [join(KIT, 'gen', 'image.ts'), TPOSE_WRAPPER(prompt), '--aspect', '3:4', '--provider', o.provider, '--n', String(n), '--out', dir, '--name', 'concept'];
    if (o.style) args.push('--style', o.style);
    for (const r of o.ref) args.push('--ref', r);
    const out = await run('node', args, 'image');
    const files = [...out.matchAll(/\[\d+\] (.+\.(?:png|jpg|webp))/g)].flatMap((m) => (m[1] ? [m[1].trim()] : []));
    const first = files[0];
    if (!first) throw new Error(`no concept image produced:\n${out}`);
    manifest.steps.concept = { files, time: secs(t) };
    for (const f of files) console.log(`    ${f}`);
    if (o.concepts) {
      save();
      console.log(`\nStopped after concepts. Pick one with ARMS STRAIGHT OUT (T-pose; A-pose rigs worse), then:\n  node gen/character.ts --image "<file>" --name ${name}`);
      process.exit(0);
    }
    image = first;
  } else {
    manifest.steps.concept = { files: [image], supplied: true };
  }

  // Balance first (prices in CLAUDE.md): model ~45, re-texture ~20, rig ~25. A run that stops half-way still bills.
  if (!rigFbx) {
    const retexture = !(o.task && o.pbr) && !o['no-retexture'];
    await requireTripoCredits((task ? 0 : 45) + (retexture ? 20 : 0) + 25, 'This character');
  }

  // 2. Tripo model. --for game-pc ends with a convert task; texture/rig need the original image_to_model (or
  // multiview_to_model) task.
  if (rigFbx) {
    step('2', 'skipped (--rig supplied)');
  } else if (task) {
    step('2', `skipped, using Tripo task ${task}`);
    manifest.steps.model = { task, supplied: true };
  } else {
    const inputs: string[] = views ?? (image ? [image] : []);
    if (!inputs.length) throw new Error('no concept image');
    step('2', `Tripo ${views ? 'multiview' : 'image'}-to-3D (face limit ${o.faces}) ... ~2-3 min`);
    const t = Date.now();
    // Four paths in front, left, back, right order make `tripo make` a multiview_to_model task.
    const tj = parseTripo(await run('tripo', ['make', ...inputs, '--for', 'game-pc', '-p', `face_limit=${o.faces}`, '-o', tripoOut('model'), '--name', `${name.toLowerCase()}-model`, '--json', '--yes', '--no-open'], 'tripo make'));
    task = tj.type === 'image_to_model' || tj.type === 'multiview_to_model' ? tj.task_id : readTripoTask(tj.output_dir).input?.original_model_id ?? null;
    if (!task) throw new Error(`could not find the original model task id in ${join(tj.output_dir, 'task.json')}`);
    pbrSource = tj.model_file; // full PBR maps (4 images); replaced by the re-texture below
    manifest.steps.model = { task, file: tj.model_file, credits: tj.credits_consumed, time: secs(t) };
    console.log(`    model task ${task} (${tj.credits_consumed} credits, ${secs(t)})`);
  }

  // 2b. Re-texture with the v3.5 texture model (delight on by default): first-pass textures were blotchy.
  if (rigFbx || (o.task && o.pbr)) {
    step('2b', 'skipped (maps supplied with --pbr)');
  } else if (o['no-retexture']) {
    step('2b', 'skipped (--no-retexture)');
    manifest.steps.texture = { skipped: '--no-retexture' };
    if (!pbrSource) throw new Error('--task with --no-retexture needs --pbr <textured model file> for the PBR maps');
  } else {
    if (!task) throw new Error('no model task');
    step('2b', 'Tripo re-texture (v3.5, detailed, delight) ... ~1 min');
    const t = Date.now();
    const tj = parseTripo(await run('tripo', ['model', 'texture', task, '--model', 'v3.5-20260815', '--texture-quality', 'detailed', '-o', tripoOut('retex'), '--name', `${name.toLowerCase()}-retex`, '--json', '--yes', '--no-open'], 'tripo texture'));
    task = tj.task_id; // rig the textured model
    pbrSource = tj.model_file;
    manifest.steps.texture = { task: tj.task_id, file: tj.model_file, credits: tj.credits_consumed, time: secs(t) };
    console.log(`    texture task ${tj.task_id} (${tj.credits_consumed} credits, ${secs(t)})`);
  }

  // 3. Tripo rig
  if (rigFbx) {
    manifest.steps.rig = { fbx: rigFbx, supplied: true };
    step('3', `skipped, using ${rigFbx}`);
  } else {
    if (!task) throw new Error('no task to rig');
    step('3', `Tripo rig (--spec ${o.spec}) ... ~20 s`);
    const t = Date.now();
    const tj = parseTripo(await run('tripo', ['anim', 'rig', task, '--spec', o.spec, '--out-format', 'fbx', '-o', tripoOut('rig'), '--name', `${name.toLowerCase()}-rig`, '--json', '--yes', '--no-open'], 'tripo rig'));
    rigFbx = tj.model_file;
    manifest.steps.rig = { fbx: rigFbx, task: tj.task_id, credits: tj.credits_consumed, time: secs(t) };
    console.log(`    ${rigFbx} (${tj.credits_consumed} credits, ${secs(t)})`);
  }

  // 3b. PBR maps from the textured model
  if (!pbrSource) throw new Error('no textured model to take PBR maps from (pass --pbr)');
  step('3b', `Blender extract_pbr (${o.tex === '0' ? 'full resolution' : `source budget ${o.tex}px`}) from ${pbrSource}`);
  const texDir = join(dir, `${name}_tex`);
  const pbr = parseMarkedJson<PbrResult>(
    await run('blender', ['-b', '--factory-startup', '--python', BL('extract_pbr.py'), '--', pbrSource, texDir, name, '--tex', o.tex], 'blender extract_pbr'),
    'PBR_JSON');
  manifest.steps.pbr = pbr;
  manifest.steps.orm = await packOrm(KIT, texDir, name); // roughness + metallic -> ORM for M_PBR_Master v2
  console.log(`    ${Object.keys(pbr.maps).join(', ')}${pbr.missing.length ? ` (missing: ${pbr.missing.join(', ')})` : ''}`);

  // 4. Blender: real height + facing applied into the armature, cm export (root bone scale 1), no textures
  step('4', `Blender prep_rig (height ${o.height} m, rot ${o.rot})`);
  let t = Date.now();
  const skFbx = join(dir, `SK_${name}.fbx`);
  const prepRig = async (r: string): Promise<PrepRigResult> => parseMarkedJson<PrepRigResult>(
    await run('blender', ['-b', '--factory-startup', '--python', BL('prep_rig.py'), '--', rigFbx, skFbx, '--height', o.height, '--rot', r], 'blender prep_rig'),
    'PREP_RIG_JSON');
  let prep = await prepRig(o.rot);
  // Facing check: some Tripo rigs face the other way, and a backward character passes every later check (it just
  // runs backward). With the default --rot, fix it; with an explicit --rot, stop and say which value would.
  const rotGiven = process.argv.some((a) => a === '--rot' || a.startsWith('--rot='));
  if (prep.facing.ok === false && prep.facing.suggest_rot !== undefined) {
    const sug = String(prep.facing.suggest_rot);
    if (rotGiven) {
      throw new Error(`the rig faces the wrong way with --rot=${o.rot} (toe forward ${prep.facing.toe_forward_m} m, side ${prep.facing.toe_side_m} m): use --rot=${sug}`);
    }
    console.log(`    facing: wrong way with the default --rot=${o.rot}; re-running prep with --rot=${sug}`);
    prep = await prepRig(sug);
    if (prep.facing.ok !== true) throw new Error(`the rig still doesn't face +Y with --rot=${sug}: inspect ${rigFbx} (facing ${JSON.stringify(prep.facing)})`);
  } else if (prep.facing.ok === false) {
    throw new Error(`the rig can't be faced forward by rotation: ${prep.facing.why} (${rigFbx})`);
  } else if (prep.facing.ok === null) {
    console.log(`    facing: not checked (${prep.facing.why}); look at the first run frame`);
  }
  o.rot = String(prep.rot);
  manifest.steps.prep = { ...prep, time: secs(t) };
  console.log(`    ${skFbx}  ${prep.bones} bones, ${prep.size_m.join(' x ')} m (export mode ${prep.mode})`);

  // 5-7. Unreal
  if (o['no-unreal']) {
    step('5', 'skipped (--no-unreal)');
  } else {
    try {
      step('5', `Unreal import to ${folder}/SK_${name} + MI_${name} + root-scale check`);
      // Rerun: remove the previous build as a whole (piecemeal re-import orphans the old ABP's skeleton).
      // Refuses, with the list, if anything outside the folder still references it.
      const clean = parseMarkedJson<{ deleted: number; existed: boolean }>(await runPythonFileOrThrow(PY('clean_character.py'), { name, folder }), 'CLEAN_JSON');
      if (clean.existed) console.log(`    removed previous build (${clean.deleted} assets)`);
      const imp = parseMarkedJson<ImportResult>(await runPythonFileOrThrow(PY('import_skeletal.py'), { fbx: fwd(skFbx), folder, name: `SK_${name}` }), 'IMPORT_JSON');
      manifest.steps.import = imp;
      // Material instance of the kit master (correct texture settings, usage flags), replacing the importer's M_.
      const mat = await applyPbr({ name, texDir, dest: '/Game/Characters', mesh: `${folder}/SK_${name}`, kind: 'skeletal', maxTextureSize: parseInt(o['max-tex'], 10) || 0 });
      manifest.steps.material = mat;
      const autoMat = `${folder}/M_${name}`;
      if (await assetExists(autoMat)) await deleteAsset(autoMat);
      const check = parseMarkedJson<CheckResult>(await runPythonFileOrThrow(PY('check_skeletal.py'), { mesh: `${folder}/SK_${name}` }), 'CHECK_JSON');
      manifest.steps.check = check;
      console.log(`    ${imp.size_cm.join(' x ')} cm, ${check.bones} bones, root scale ${check.root_scale.map((v) => v.toFixed(3)).join(',')}; ${mat.instance} (${mat.textures.join(', ')})`);
      if (!check.ok) throw new Error('root bone scale is not 1: retargeted animations would collapse or explode (PIPELINE.md hard-won facts)');

      step('6', 'IK rigs + retargeter + batch retarget (ABP_Unarmed and its animations)');
      t = Date.now();
      const rt = parseMarkedJson<RetargetResult>(await runPythonFileOrThrow(PY('retarget_setup.py'), { name, mesh: `${folder}/SK_${name}` }), 'RETARGET_JSON');
      manifest.steps.retarget = { ...rt, time: secs(t) };
      console.log(`    ${rt.chains} chains mapped, ${rt.assets} assets retargeted into ${rt.anim_dir} (${secs(t)})`);
      if (!rt.abp) throw new Error(`no retargeted ABP found in ${rt.anim_dir}`);

      step('6b', 'remove the foot-IK Control Rig node from the ABP (twists non-Manny feet)');
      const strip = await stripFootIk(rt.abp);
      manifest.steps.footik = { changed: strip.changed, deleted: strip.deleted };
      console.log(strip.changed ? `    deleted ${strip.deleted.join(', ')}, compiled and saved` : '    already removed');

      if (o.parent) {
        step('7', `BP_${name} (parent ${o.parent})`);
        const bp = parseMarkedJson<BpResult>(await runPythonFileOrThrow(PY('make_character_bp.py'), { name, parent: o.parent, folder, abp: rt.abp }), 'BP_JSON');
        manifest.steps.blueprint = bp;
        console.log(`    ${bp.blueprint} (mesh Z ${bp.mesh_z})`);
      } else {
        step('7', 'skipped (no --parent)');
      }

    } catch (e) {
      if (!(e instanceof McpUnreachableError)) throw e;
      manifest.steps.unreal = { skipped: 'editor not running' };
      console.log('    editor not running: files are ready. Open the editor, then resume (no Tripo credits) with:');
      console.log(`    node gen/character.ts --rig "${rigFbx}" --pbr "${pbrSource}" --name ${name} --height ${o.height} --rot=${o.rot} --max-tex ${o['max-tex']}${o.tex !== '0' ? ` --tex ${o.tex}` : ''}${o.parent ? ` --parent ${o.parent}` : ''}`);
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

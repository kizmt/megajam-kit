#!/usr/bin/env node
// Split a generated prop into separately movable parts (a lid, a door leaf, a lever, a wheel) and import them.
// A generator returns one fused mesh; a part that moves needs its own mesh with its pivot on the hinge or axle.
//
//   node gen/parts.ts Chest --list                                  (size and loose shells, to choose the cuts)
//   node gen/parts.ts Chest --list --slabs z:12                     (also the bounds inside 12 slabs along z)
//   node gen/parts.ts Chest --part "Lid:z>0.62:pivot=0,-0.25,0.62"  (cut at z = 0.62 m; hinge along the back edge)
//   node gen/parts.ts Clock --part "Anchor:x>0.33&z>4.31" --part "Anchor:shell=2" --list   (what is left after them)
//   node gen/parts.ts Cart --part "WheelL:x<-0.4:pivot=-0.45,0,0.2" --part "WheelR:x>0.4:pivot=0.45,0,0.2" --place=600,0,0
//
// Run gen/asset.ts for the prop first: this reads its prepped mesh <Project>/Generated/assets/<name>/SM_<Name>.fbx
// (metres, pivot at the base centre, +Z up: the space the selectors and pivots are in; preview.png shows it) and
// reuses its material instance MI_<Name> (the parts keep the prop's UVs). Selectors: gen/blender/split_parts.py.
// Each part becomes <dest>/<Name>/SM_<Name>_<Part>; the table printed at the end gives its relative location under
// the prop's root (Unreal cm). Build the actor from those: one StaticMeshComponent per part at that location; the
// part then turns or slides about its own origin. --place spawns the parts assembled in the open level as a check;
// --replace first removes the fused prop actor gen/asset.ts placed and the part actors of an earlier --place.
// A selector can join planes with & (inside all of them), and a part name given twice is one part made of both cuts.

import { existsSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { parseArgs } from 'node:util';
import { KIT, errorMessage, fail, generatedDir, pascal } from './paths.ts';
import { parseMarkedJson, run, secs } from './proc.ts';
import { McpUnreachableError, type CameraTransform } from './unreal/mcp.ts';
import { runPythonCode } from './unreal/python.ts';
import { assetExists, captureView, convexCollisions, deleteAsset, importStaticMesh, materialSlots, placeAsset, ref,
  saveAssets, setNanite, setSlotMaterial, setViewportCamera } from './unreal/ue.ts';

const { values: o, positionals } = parseArgs({
  allowPositionals: true,
  options: {
    list: { type: 'boolean', default: false },
    part: { type: 'string', multiple: true, default: [] },
    rest: { type: 'string', default: 'Body' },
    'keep-bits': { type: 'boolean', default: false },
    sliver: { type: 'string' },
    slabs: { type: 'string' },
    replace: { type: 'boolean', default: false },
    dest: { type: 'string', default: '/Game/Props' },
    hulls: { type: 'string' },
    place: { type: 'string' },
    'no-unreal': { type: 'boolean', default: false },
    help: { type: 'boolean', short: 'h', default: false },
  },
});

if (o.help || !positionals[0] || (!o.list && o.part.length === 0)) {
  console.log(`usage: node gen/parts.ts <Name> --list [--slabs z:12] [--part ...]   (with --part: what is left after those cuts)
       node gen/parts.ts <Name> --part "<Part>:<selector>[:pivot=x,y,z]" [--part ...] [--rest Body] [--keep-bits]
            [--sliver 0.05] [--dest /Game/Props] [--hulls N] [--place=x,y,z [--replace]] [--no-unreal]
  selector  x>v x<v y>v y<v z>v z<v (metres, the prepped mesh's space), joined with & for "inside all of these"
            ("x>0.33&z>4.31"),  or  shell=i[,j] (indices from --list, which change after every cut)
  pivot     where the part turns or slides; default: the centre of its bounds at its lowest point
  The same <Part> name twice makes one part from both cuts (first pivot given wins).
  --slabs   with --list: bounds of the geometry inside n slabs along an axis, to read cut values from
  --sliver  a loose bit under this fraction of its side's main shell goes back across the cut (default 0.05)`);
  process.exit(o.help ? 0 : 2);
}

interface Shell { shell: number; tris: number; min: number[]; max: number[] }
interface Slab { from: number; to: number; tris: number; min?: number[]; max?: number[] }
interface ListResult { mode: 'list'; after_parts: string[]; min?: number[]; max?: number[]; tris: number; shells: Shell[]; shells_total: number; slabs?: { axis: string; rows: Slab[] } }
interface Bit { tris: number; limit: number; min: number[]; max: number[]; side: 'part' | 'rest' }
interface Part { name: string; file: string; tris: number; pivot_m: number[]; pivot_ue_cm: [number, number, number]; size_m: number[]; cap_faces?: number; slivers_moved?: number; bits_left?: Bit[]; cuts_joined?: number }
interface SplitResult { mode: 'split'; name: string; parts: Part[] }

const name = pascal(positionals[0]);
const dir = join(generatedDir('assets'), name.toLowerCase());
const fbx = join(dir, `SM_${name}.fbx`);
if (!existsSync(fbx)) fail(`${fbx} not found: run gen/asset.ts for ${name} first (parts are cut from its prepped mesh)`);
const script = join(KIT, 'gen', 'blender', 'split_parts.py');
const outDir = join(dir, 'parts');
const blender = (extra: string[]): Promise<string> =>
  run('blender', ['-b', '--factory-startup', '--python', script, '--', fbx, outDir, name, ...extra], 'blender split_parts');

try {
  if (o.list) {
    const r = parseMarkedJson<ListResult>(
      await blender(['--list', ...o.part.flatMap((p) => ['--part', p]), ...(o.slabs ? ['--slabs', o.slabs] : []), ...(o.sliver ? ['--sliver', o.sliver] : []), ...(o['keep-bits'] ? ['--keep-bits'] : [])]),
      'PARTS_JSON');
    const what = r.after_parts.length ? `${name} after ${r.after_parts.join(', ')}` : name;
    if (!r.min || !r.max) { console.log(`${what}: nothing left`); process.exit(0); }
    console.log(`${what}: ${r.tris} tris, x ${r.min[0]}..${r.max[0]}  y ${r.min[1]}..${r.max[1]}  z ${r.min[2]}..${r.max[2]} (m)`);
    console.log(`${r.shells_total} loose shell(s)${r.shells_total > r.shells.length ? ` (first ${r.shells.length} shown)` : ''}:`);
    for (const s of r.shells) console.log(`  shell=${s.shell}  ${s.tris} tris  min ${s.min.join(', ')}  max ${s.max.join(', ')}`);
    if (r.shells_total === 1) console.log('One fused shell: cut it with plane selectors (z>v and so on; --slabs z shows where pieces begin and end).');
    if (r.slabs) {
      console.log(`slabs along ${r.slabs.axis} (bounds of the geometry inside each):`);
      for (const b of r.slabs.rows) {
        console.log(b.min && b.max
          ? `  ${r.slabs.axis} ${b.from.toFixed(3)}..${b.to.toFixed(3)}  ${String(b.tris).padStart(6)} tris  x ${b.min[0]}..${b.max[0]}  y ${b.min[1]}..${b.max[1]}  z ${b.min[2]}..${b.max[2]}`
          : `  ${r.slabs.axis} ${b.from.toFixed(3)}..${b.to.toFixed(3)}  empty`);
      }
    }
    process.exit(0);
  }

  const t0 = Date.now();
  const args = o.part.flatMap((p) => ['--part', p]);
  args.push('--rest', pascal(o.rest));
  if (o['keep-bits']) args.push('--keep-bits');
  if (o.sliver) args.push('--sliver', o.sliver);
  const split = parseMarkedJson<SplitResult>(await blender(args), 'PARTS_JSON');
  writeFileSync(join(dir, 'parts.json'), JSON.stringify(split, null, 2));
  console.log(`[1] split into ${split.parts.length} parts (${secs(t0)})`);
  for (const p of split.parts) {
    const notes = [p.cuts_joined ? `${p.cuts_joined} cuts joined` : '', p.cap_faces !== undefined ? `${p.cap_faces} cap faces` : '', p.slivers_moved ? `${p.slivers_moved} sliver(s) moved back` : ''].filter(Boolean).join(', ');
    console.log(`    ${p.name}: ${p.tris} tris, ${p.size_m.join(' x ')} m, pivot ${p.pivot_m.join(', ')} m${notes ? ` (${notes})` : ''}`);
    // A loose bit just over the sliver limit stays where the cut put it. Say so: it shows when the part moves.
    for (const b of p.bits_left ?? []) {
      console.log(`      NOTE: a loose bit of ${b.tris} tris (limit ${b.limit}) touches this cut and stayed with ${b.side === 'part' ? p.name : 'the rest'}: ` +
        `min ${b.min.join(', ')}  max ${b.max.join(', ')}. If it belongs on the other side: --sliver ${(Math.ceil((b.tris / b.limit) * (Number(o.sliver) || 0.05) * 100 + 1) / 100).toFixed(2)}, or a later cut.`);
    }
  }

  const folder = `${o.dest}/${name}`;
  const asset = (p: Part): string => `${folder}/SM_${name}_${p.name}`;
  if (o['no-unreal']) {
    console.log('[2] skipped (--no-unreal)');
  } else {
    try {
      console.log(`[2] Unreal import to ${folder}`);
      const paths = split.parts.map(asset);
      // Replacing a part that something still uses opens a modal dialog on delete: check first, refuse with a list.
      const existing: string[] = [];
      for (const p of paths) if (await assetExists(p)) existing.push(p);
      if (existing.length) {
        const refs = await runPythonCode(
          'import json\nfrom megajam_tools.refs import referencers_outside\nprint("\\n".join(referencers_outside(json.loads(ARGS["paths"]))))',
          { paths: JSON.stringify(existing) });
        if (!refs.ok) throw new Error(`reference check failed: ${refs.output.slice(-400)}`);
        if (refs.output.trim()) {
          throw new Error(`refusing to replace parts that are still in use (remove or repoint these, or use other part names):\n  ${refs.output.trim().split('\n').join('\n  ')}`);
        }
        for (const p of existing) await deleteAsset(p);
      }
      const inst = `${folder}/MI_${name}`;
      const hasInst = await assetExists(inst);
      if (!hasInst) console.log(`    WARN: ${inst} not found: the parts keep the grid material (run gen/asset.ts for ${name} first)`);
      const hulls = o.hulls ? Math.max(1, Math.min(16, parseInt(o.hulls, 10) || 4)) : 0;
      for (const p of split.parts) {
        const path = asset(p);
        await importStaticMesh(folder, `SM_${name}_${p.name}`, p.file);
        if (hasInst) for (const s of await materialSlots(path, 'static')) await setSlotMaterial(path, 'static', s, ref(inst));
        await setNanite(path, true);
        if (hulls) await convexCollisions(path, hulls);
      }
      // The 5.8 importer leaves its own material beside the mesh; nothing uses it once the slots point at MI_<Name>.
      const autoMat = `${folder}/M_${name}`;
      if (hasInst && await assetExists(autoMat)) await deleteAsset(autoMat);
      if (!(await saveAssets(paths))) throw new Error(`saving ${paths.join(', ')} failed`);

      if (o.place) {
        const [x = 0, y = 0, z = 0] = o.place.split(',').map(Number);
        // The fused prop gen/asset.ts placed as its check, and part actors from an earlier --place, would overlap these.
        const old = await runPythonCode(
          `import unreal, json
sub = unreal.get_editor_subsystem(unreal.EditorActorSubsystem)
labels, fused, do = set(json.loads(ARGS["labels"])), ARGS["fused"], ARGS["replace"] == "1"
hit = []
for a in sub.get_all_level_actors():
    lab = a.get_actor_label()
    if lab in labels:
        hit.append(lab)
    elif isinstance(a, unreal.StaticMeshActor):
        m = a.static_mesh_component.static_mesh
        if m and m.get_path_name().split(".")[0] == fused:
            hit.append(lab)
        else:
            continue
    else:
        continue
    if do:
        sub.destroy_actor(a)
print("OLD_JSON=" + json.dumps(hit))`,
          { labels: JSON.stringify(split.parts.map((p) => `${name}_${p.name}`)), fused: `${folder}/SM_${name}`, replace: o.replace ? '1' : '0' });
        const oldActors = old.ok ? parseMarkedJson<string[]>(old.output, 'OLD_JSON') : [];
        if (oldActors.length) {
          console.log(o.replace
            ? `    removed from the level: ${oldActors.join(', ')}`
            : `    NOTE: already in the level and left there: ${oldActors.join(', ')} (the fused prop or earlier parts; --replace removes them first)`);
        }
        const lo = [Infinity, Infinity, Infinity], hi = [-Infinity, -Infinity, -Infinity];
        for (const p of split.parts) {
          const [px, py, pz] = p.pivot_ue_cm;
          const { box } = await placeAsset(asset(p), `${name}_${p.name}`, [x + px, y + py, z + pz], 0);
          [box.min.x, box.min.y, box.min.z].forEach((v, i) => { lo[i] = Math.min(lo[i] ?? v, v); });
          [box.max.x, box.max.y, box.max.z].forEach((v, i) => { hi[i] = Math.max(hi[i] ?? v, v); });
        }
        const c = { x: ((lo[0] ?? 0) + (hi[0] ?? 0)) / 2, y: ((lo[1] ?? 0) + (hi[1] ?? 0)) / 2, z: ((lo[2] ?? 0) + (hi[2] ?? 0)) / 2 };
        const r = Math.max((hi[0] ?? 0) - (lo[0] ?? 0), (hi[1] ?? 0) - (lo[1] ?? 0), (hi[2] ?? 0) - (lo[2] ?? 0));
        const d = Math.max(r * 2.2, 120);
        const cam = { x: c.x - d * 0.62, y: c.y - d * 0.62, z: c.z + d * 0.45 };
        const view: CameraTransform = {
          location: cam,
          rotation: { pitch: (Math.atan2(c.z - cam.z, Math.hypot(c.x - cam.x, c.y - cam.y)) * 180) / Math.PI, yaw: (Math.atan2(c.y - cam.y, c.x - cam.x) * 180) / Math.PI, roll: 0 },
        };
        await setViewportCamera(view);
        // The parts are imported and placed by now: a failed check shot is a warning, not a failed run.
        let shot = '';
        try { shot = await captureView(join(dir, 'parts-shot.png'), view); } catch (e) {
          if (e instanceof McpUnreachableError) throw e;
          console.log(`    WARN: no check screenshot (${errorMessage(e)})`);
        }
        console.log(`    placed assembled at ${o.place} (actors ${name}_<Part>; the level has unsaved changes)${shot ? `, screenshot ${shot}` : ''}`);
      }
    } catch (e) {
      if (!(e instanceof McpUnreachableError)) throw e;
      console.log('    editor not running: the part FBX files are ready, import later');
    }
  }

  console.log('\nPart            Asset                                              Relative location (cm)');
  for (const p of split.parts) console.log(`${p.name.padEnd(15)} ${asset(p).padEnd(50)} ${p.pivot_ue_cm.join(', ')}`);
  console.log(`\nBuild the prop's actor with one StaticMeshComponent per part at its relative location: the assembled prop then
looks like the original, and each part turns or slides about its own origin (the hinge or axle given as pivot).
${join(dir, 'parts.json')}`);
} catch (e) {
  console.error(`\nFAIL: ${errorMessage(e)}`);
  process.exit(1);
}

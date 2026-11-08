#!/usr/bin/env node
// Retarget a whole animation library folder onto a character built by gen/character.ts (editor open, MCP).
//   node gen/unreal/anim_inventory.ts --project <library project> --folder <Pack>   # find the --source-mesh first
//   node gen/unreal/retarget_library.ts --name Mechanic --folder /Game/<Pack>/Animations `
//        --source-mesh /Game/<Pack>/Mannequins/Meshes/SKM_Manny_Simple --category Interact `
//        --filter Door --limit 5                                # test run: filter to the clips you will check
//   options: --mesh <target SK>  --source-rig <IK rig>  --category <subfolder>  --filter attack,dodge  --limit 5
// --filter is a substring match (it also catches neighbours such as *_Lean); --names a,b,c takes exact asset names.
// --limit takes the first N (sequences first, then by asset path), so pair it with --filter or --names. Sequences are retargeted before montages and
// blend spaces; a montage whose clips an earlier run already retargeted is skipped (it would duplicate them).
// Registers the clips' curves on the target skeleton and saves it (otherwise -game and the cook crash).
// Output: /Game/Characters/<Name>/Anims/<category>/<anim>_<Name>. Reruns skip what already exists (never overwrites:
// overwriting breaks blend spaces in the cook). Sources, licences and jam status: docs/ue/animation-library.md.
// Retargeted library clips are SOURCED assets under the jam rules: list them in SOURCED_ASSETS.md.
import { parseArgs } from 'node:util';
import { join } from 'node:path';
import { KIT, errorMessage, fail } from '../paths.ts';
import { parseMarkedJson } from '../proc.ts';
import { runPythonFileOrThrow } from './python.ts';

export interface RetargetLibraryResult {
  retargeter: string;
  source_rig: string;
  dest: string;
  found: number;
  requested: number;
  created: number;
  skipped_existing: number;
  skipped_compound: { asset: string; already_retargeted: string[] }[];
  duplicates: string[];
  skeleton_curves_added: string[];
  skeleton: string;
  unmapped_target_chains: string[];
  chain_map: Record<string, string>;
  assets: string[];
}

export async function retargetLibrary(args: Record<string, string>): Promise<RetargetLibraryResult> {
  const out = await runPythonFileOrThrow(join(KIT, 'gen', 'unreal', 'py', 'retarget_library.py'), args);
  return parseMarkedJson<RetargetLibraryResult>(out, 'RETARGET_LIB_JSON');
}

const { values: o } = parseArgs({
  options: {
    name: { type: 'string' },
    folder: { type: 'string' },
    mesh: { type: 'string' },
    'source-mesh': { type: 'string' },
    'source-rig': { type: 'string' },
    category: { type: 'string' },
    filter: { type: 'string' },
    names: { type: 'string' },
    limit: { type: 'string' },
  },
});
if (!o.name || !o.folder) fail('usage: node gen/unreal/retarget_library.ts --name <Character> --folder /Game/<library folder> [options]');

const args: Record<string, string> = { name: o.name, folder: o.folder };
if (o.mesh) args['mesh'] = o.mesh;
if (o['source-mesh']) args['source_mesh'] = o['source-mesh'];
if (o['source-rig']) args['source_rig'] = o['source-rig'];
if (o.category) args['category'] = o.category;
if (o.filter) args['filter'] = o.filter;
if (o.names) args['names'] = o.names;
if (o.limit) args['limit'] = o.limit;

try {
  const r = await retargetLibrary(args);
  console.log(`${r.created} assets created in ${r.dest} (${r.requested} requested of ${r.found} found, ${r.skipped_existing} already there) via ${r.retargeter}`);
  for (const s of r.skipped_compound) {
    console.log(`SKIPPED ${s.asset}: its clips ${s.already_retargeted.join(', ')} were retargeted by an earlier run; retargeting it would duplicate them. Build your own montage from the existing clips, or delete them and rerun with this asset.`);
  }
  if (r.duplicates.length) {
    console.log(`WARNING: duplicate copies created (break the cook if referenced): ${r.duplicates.join(', ')}`);
  }
  if (r.skeleton_curves_added.length) {
    console.log(`Registered ${r.skeleton_curves_added.length} curve(s) on ${r.skeleton} and saved it (${r.skeleton_curves_added.join(', ')}); without this, -game and the cook crash.`);
  }
  console.log('Chain map (target <- source):');
  for (const [t, s] of Object.entries(r.chain_map)) console.log(`  ${t} <- ${s === 'None' || s === '' ? '(unmapped)' : s}`);
  if (r.unmapped_target_chains.length) {
    console.log(`WARNING: target chains with no source chain: ${r.unmapped_target_chains.join(', ')}. Check the retargeter's chain mapping before trusting these clips.`);
  }
  console.log('Check a few clips in PIE from the gameplay camera (arms, feet, hands) before wiring them in.');
  console.log('Log the library in SOURCED_ASSETS.md (sourced assets are listed on submission and not scored).');
} catch (e) {
  fail(errorMessage(e));
}

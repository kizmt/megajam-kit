#!/usr/bin/env node
// Retarget a whole animation library folder onto a character built by gen/character.ts (editor open, MCP).
//   node gen/unreal/retarget_library.ts --name Hero --folder /Game/AnimLibrary/GASP                     # Epic skeleton
//   node gen/unreal/retarget_library.ts --name Hero --folder /Game/AnimLibrary/Paragon/Kwang \
//        --source-mesh /Game/AnimLibrary/Paragon/Kwang/Characters/Heroes/Kwang/Meshes/Kwang_GDC --category Sword
//   options: --mesh <target SK>  --source-rig <IK rig>  --category <subfolder>  --filter attack,dodge  --limit 5
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
  retargeted: number;
  skipped_existing: number;
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
if (o.limit) args['limit'] = o.limit;

try {
  const r = await retargetLibrary(args);
  console.log(`${r.retargeted} retargeted into ${r.dest} (${r.found} found, ${r.skipped_existing} already there) via ${r.retargeter}`);
  if (r.unmapped_target_chains.length) {
    console.log(`WARNING: target chains with no source chain: ${r.unmapped_target_chains.join(', ')}. Check the retargeter's chain mapping before trusting these clips.`);
  }
  console.log('Check a few clips in PIE from the gameplay camera (arms, feet, weapon hand) before wiring them in.');
  console.log('Log the library in SOURCED_ASSETS.md (sourced assets are listed on submission and not scored).');
} catch (e) {
  fail(errorMessage(e));
}

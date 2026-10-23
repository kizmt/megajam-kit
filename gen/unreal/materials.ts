// PBR material setup through Unreal MCP.
//   ensureMaster()  -> creates /Game/Kit/Materials/M_PBR_Master once (BaseColor, Normal, Roughness, Metallic)
//   applyPbr({...}) -> imports an asset's 4 textures with correct settings, makes MI_<Name>, assigns it to the mesh
//
// CLI: node gen/unreal/materials.ts master [--force]
//      node gen/unreal/materials.ts apply <Name> <textureDir> [/Game/Props]

import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { errorMessage, isMain } from '../paths.ts';
import { callTool, mcpCall, type ObjectRef } from './mcp.ts';

const AS = 'editor_toolset.toolsets.asset.AssetTools';
const M = 'editor_toolset.toolsets.material.MaterialTools';
const MI = 'editor_toolset.toolsets.material_instance.MaterialInstanceTools';
const TX = 'editor_toolset.toolsets.texture.TextureTools';
const OB = 'editor_toolset.toolsets.object.ObjectTools';
const SM = 'editor_toolset.toolsets.static_mesh.StaticMeshTools';
const SK = 'editor_toolset.toolsets.skeletal_mesh.SkeletalMeshTools';

export const MASTER = '/Game/Kit/Materials/M_PBR_Master';
const KIT_TEX = '/Game/Kit/Textures';

/** '/Game/X/Y' -> {refPath: '/Game/X/Y.Y'} (object path form the toolsets expect). */
export const ref = (p: string): ObjectRef => ({ refPath: p.includes('.') ? p : `${p}.${p.split('/').pop() ?? ''}` });

type Rgb = readonly [number, number, number];
type MapKey = 'basecolor' | 'normal' | 'roughness' | 'metallic';
interface TextureProps { SRGB: boolean; CompressionSettings: 'TC_Default' | 'TC_Normalmap' | 'TC_Grayscale'; MaxTextureSize?: number }
interface MapSpec {
  param: string;
  props: TextureProps;
  sampler: 'SAMPLERTYPE_Color' | 'SAMPLERTYPE_Normal' | 'SAMPLERTYPE_LinearGrayscale';
  out: 'RGB' | 'R';
  prop: 'MP_BaseColor' | 'MP_Normal' | 'MP_Roughness' | 'MP_Metallic';
  fill: Rgb;
}

// Per-map texture settings and the master parameter each one feeds.
const MAPS = {
  basecolor: { param: 'BaseColor', props: { SRGB: true, CompressionSettings: 'TC_Default' }, sampler: 'SAMPLERTYPE_Color', out: 'RGB', prop: 'MP_BaseColor', fill: [128, 128, 128] },
  normal: { param: 'Normal', props: { SRGB: false, CompressionSettings: 'TC_Normalmap' }, sampler: 'SAMPLERTYPE_Normal', out: 'RGB', prop: 'MP_Normal', fill: [128, 128, 255] },
  roughness: { param: 'Roughness', props: { SRGB: false, CompressionSettings: 'TC_Grayscale' }, sampler: 'SAMPLERTYPE_LinearGrayscale', out: 'R', prop: 'MP_Roughness', fill: [160, 160, 160] },
  metallic: { param: 'Metallic', props: { SRGB: false, CompressionSettings: 'TC_Grayscale' }, sampler: 'SAMPLERTYPE_LinearGrayscale', out: 'R', prop: 'MP_Metallic', fill: [0, 0, 0] },
} as const satisfies Record<MapKey, MapSpec>;

const MAP_KEYS = Object.keys(MAPS) as MapKey[];

/** 4x4 uncompressed TGA of one colour (used as the master's default textures). */
function writeTga(file: string, [r, g, b]: Rgb): void {
  const w = 4, h = 4, header = Buffer.alloc(18);
  header[2] = 2; header.writeUInt16LE(w, 12); header.writeUInt16LE(h, 14); header[16] = 24; header[17] = 0x20;
  const px = Buffer.alloc(w * h * 3);
  for (let i = 0; i < w * h; i++) { px[i * 3] = b; px[i * 3 + 1] = g; px[i * 3 + 2] = r; }
  writeFileSync(file, Buffer.concat([header, px]));
}

async function importTexture(folder: string, name: string, file: string, props: TextureProps): Promise<ObjectRef> {
  const path = `${folder}/${name}`;
  if (await callTool<boolean>(AS, 'exists', { path })) await mcpCall(AS, 'delete', { path });
  const t = await callTool<ObjectRef | ObjectRef[]>(TX, 'import_file', { folder_path: folder, asset_name: name, source_file: file.replace(/\\/g, '/') });
  const tex = Array.isArray(t) ? t[0] : t;
  if (!tex) throw new Error(`texture import produced nothing: ${file}`);
  await mcpCall(OB, 'set_properties', { instance: tex, values: JSON.stringify(props) });
  return tex;
}

export async function ensureMaster({ force = false }: { force?: boolean } = {}): Promise<ObjectRef> {
  const exists = await callTool<boolean>(AS, 'exists', { path: MASTER });
  if (exists && !force) return ref(MASTER);
  if (exists) await mcpCall(AS, 'delete', { path: MASTER });

  // Default textures so every parameter has a valid, correctly typed texture.
  const tmp = join(tmpdir(), 'megajam-kit-defaults');
  mkdirSync(tmp, { recursive: true });
  const defaults = {} as Record<MapKey, ObjectRef>;
  for (const key of MAP_KEYS) {
    const m = MAPS[key];
    const f = join(tmp, `T_Kit_Default_${m.param}.tga`);
    writeTga(f, m.fill);
    defaults[key] = await importTexture(KIT_TEX, `T_Kit_Default_${m.param}`, f, m.props);
  }

  const folder = MASTER.slice(0, MASTER.lastIndexOf('/'));
  const mat = await callTool<ObjectRef>(M, 'create_material', { folder_path: folder, asset_name: MASTER.split('/').pop() });
  let y = -300;
  for (const key of MAP_KEYS) {
    const m = MAPS[key];
    const expr = await callTool<ObjectRef>(M, 'add_expression', {
      material_or_function: mat, expression_class: { refPath: '/Script/Engine.MaterialExpressionTextureSampleParameter2D' }, x: -500, y,
    });
    y += 280;
    await mcpCall(OB, 'set_properties', {
      instance: expr,
      values: JSON.stringify({ ParameterName: m.param, SamplerType: m.sampler, Texture: defaults[key].refPath, Group: 'Textures' }),
    });
    await mcpCall(M, 'connect_to_output', { expression: expr, output_name: m.out, material_property: m.prop });
  }
  // Usage flags up front. Missing flags get auto-set in the editor (shaders recompile, props render grey
  // meanwhile) but CANNOT be set in a packaged game, where the mesh then shows the default material.
  await mcpCall(OB, 'set_properties', {
    instance: mat,
    values: JSON.stringify({ bUsedWithNanite: true, bUsedWithSkeletalMesh: true, bUsedWithInstancedStaticMeshes: true }),
  });
  await mcpCall(M, 'recompile', { material_or_function: mat });
  await mcpCall(AS, 'save_assets', { asset_paths: [] });
  return mat;
}

export interface ApplyPbrOptions {
  name: string;
  texDir: string;
  dest?: string;
  mesh?: string;
  /** 'skeletal' for characters (SkeletalMeshTools); default 'static'. */
  kind?: 'static' | 'skeletal';
  /**
   * In-game texture cap (Texture MaxTextureSize; cooked at this size). Source stays full-res in the asset, so a
   * hero asset can be raised later with one setting, no regeneration. 0 = no cap. Default 2048 (8 GB VRAM budget).
   */
  maxTextureSize?: number;
}
export interface ApplyPbrResult { instance: string; textures: MapKey[]; slots: string[] }

/** texDir contains T_<Name>_basecolor.png etc. (output of gen/blender/prep.py). */
export async function applyPbr({ name, texDir, dest = '/Game/Props', mesh, kind = 'static', maxTextureSize = 2048 }: ApplyPbrOptions): Promise<ApplyPbrResult> {
  const meshTools = kind === 'skeletal' ? SK : SM;
  await ensureMaster();
  const folder = `${dest}/${name}`;
  const instPath = `${folder}/MI_${name}`;
  if (await callTool<boolean>(AS, 'exists', { path: instPath })) await mcpCall(AS, 'delete', { path: instPath });
  const inst = await callTool<ObjectRef>(MI, 'create', { folder_path: folder, asset_name: `MI_${name}`, parent: ref(MASTER) });
  const applied: MapKey[] = [];
  for (const key of MAP_KEYS) {
    const m = MAPS[key];
    const file = join(texDir, `T_${name}_${key}.png`);
    if (!existsSync(file)) continue;
    const tex = await importTexture(folder, `T_${name}_${key}`, file, { ...m.props, MaxTextureSize: maxTextureSize });
    await mcpCall(MI, 'set_texture_parameter', { instance: inst, name: m.param, value: tex });
    applied.push(key);
  }
  const meshRef = ref(mesh ?? `${dest}/${kind === 'skeletal' ? 'SK' : 'SM'}_${name}`);
  const slots = await callTool<string[]>(meshTools, 'get_material_slots', { mesh: meshRef });
  for (const s of slots) await mcpCall(meshTools, 'set_material', { mesh: meshRef, slot_name: s, material: inst });
  await mcpCall(AS, 'save_assets', { asset_paths: [] });
  return { instance: instPath, textures: applied, slots };
}

if (isMain(import.meta.url)) {
  const [cmd, a, b, c] = process.argv.slice(2);
  try {
    if (cmd === 'master') console.log(JSON.stringify(await ensureMaster({ force: a === '--force' })));
    else if (cmd === 'apply' && a && b) console.log(JSON.stringify(await applyPbr({ name: a, texDir: resolve(b), dest: c ?? '/Game/Props' })));
    else { console.log('usage: materials.ts master [--force] | apply <Name> <textureDir> [/Game/Props]'); process.exit(2); }
  } catch (e) { console.error(`FAIL: ${errorMessage(e)}`); process.exit(1); }
}

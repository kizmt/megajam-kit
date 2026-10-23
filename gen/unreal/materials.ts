// PBR material setup through Unreal MCP.
//   ensureMaster()  -> builds / upgrades /Game/Kit/Materials/M_PBR_Master (v2, gen/unreal/py/build_master_material.py)
//   applyPbr({...}) -> imports an asset's textures (basecolor, normal, orm, emissive), makes MI_<Name>, assigns it
//
// v2 parameters: BaseColor, Normal, ORM (R=AO G=Roughness B=Metallic), EmissiveTexture; Tint, Saturation;
// RoughnessScale/Offset, MetallicOverride/Value, NormalStrength, AOStrength; EmissiveColor/Strength,
// UseEmissiveTexture (static switch); FlashAmount (Custom Primitive Data 0), FlashColor, FlashStrength.
// ORM comes from gen/blender/pack_orm.py (packs T_<Name>_roughness/metallic/ao).
//
// CLI: node gen/unreal/materials.ts master [--force]
//      node gen/unreal/materials.ts apply <Name> <textureDir> [/Game/Props]

import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { KIT, errorMessage, isMain } from '../paths.ts';
import { parseMarkedJson } from '../proc.ts';
import { callTool, mcpCall, type ObjectRef } from './mcp.ts';
import { runPythonFileOrThrow } from './python.ts';

const AS = 'editor_toolset.toolsets.asset.AssetTools';
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
export type MapKey = 'basecolor' | 'normal' | 'orm' | 'emissive';
interface TextureProps {
  SRGB: boolean;
  CompressionSettings: 'TC_Default' | 'TC_Normalmap' | 'TC_Masks';
  MaxTextureSize?: number;
}
interface MapSpec { param: string; props: TextureProps; fill: Rgb; defaultName: string }

// Per-map texture settings, the master parameter each one feeds, and the master's default texture.
const MAPS = {
  basecolor: { param: 'BaseColor', props: { SRGB: true, CompressionSettings: 'TC_Default' }, fill: [128, 128, 128], defaultName: 'T_Kit_Default_BaseColor' },
  normal: { param: 'Normal', props: { SRGB: false, CompressionSettings: 'TC_Normalmap' }, fill: [128, 128, 255], defaultName: 'T_Kit_Default_Normal' },
  // AO 1, roughness 0.6, metallic 0
  orm: { param: 'ORM', props: { SRGB: false, CompressionSettings: 'TC_Masks' }, fill: [255, 153, 0], defaultName: 'T_Kit_Default_ORM' },
  emissive: { param: 'EmissiveTexture', props: { SRGB: true, CompressionSettings: 'TC_Default' }, fill: [0, 0, 0], defaultName: 'T_Kit_Default_Black' },
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

/**
 * Import one texture and set its properties. Replaces an existing asset of the same name, so only use it where
 * nothing outside the caller's own folder references that texture (deleting a referenced asset = modal dialog).
 */
async function importTexture(folder: string, name: string, file: string, props: TextureProps): Promise<ObjectRef> {
  const path = `${folder}/${name}`;
  if (await callTool<boolean>(AS, 'exists', { path })) await mcpCall(AS, 'delete', { path });
  const t = await callTool<ObjectRef | ObjectRef[]>(TX, 'import_file', { folder_path: folder, asset_name: name, source_file: file.replace(/\\/g, '/') });
  const tex = Array.isArray(t) ? t[0] : t;
  if (!tex) throw new Error(`texture import produced nothing: ${file}`);
  await mcpCall(OB, 'set_properties', { instance: tex, values: JSON.stringify(props) });
  return tex;
}

export interface MasterResult { path: string; version: string; rebuilt: boolean; expressions?: number; errors?: string[] }

/**
 * Make sure M_PBR_Master is at the current version. The graph is rebuilt in place (instances keep working),
 * default textures are imported only when missing (the master references them, so they are never replaced).
 */
export async function ensureMaster({ force = false }: { force?: boolean } = {}): Promise<MasterResult> {
  const tmp = join(tmpdir(), 'megajam-kit-defaults');
  mkdirSync(tmp, { recursive: true });
  const defaults = {} as Record<MapKey, string>;
  for (const key of MAP_KEYS) {
    const m = MAPS[key];
    const path = `${KIT_TEX}/${m.defaultName}`;
    if (!(await callTool<boolean>(AS, 'exists', { path }))) {
      const f = join(tmp, `${m.defaultName}.tga`);
      writeTga(f, m.fill);
      await importTexture(KIT_TEX, m.defaultName, f, m.props);
    }
    defaults[key] = path;
  }
  const result = parseMarkedJson<MasterResult>(
    await runPythonFileOrThrow(join(KIT, 'gen', 'unreal', 'py', 'build_master_material.py'), {
      path: MASTER, tex_basecolor: defaults.basecolor, tex_normal: defaults.normal, tex_orm: defaults.orm,
      tex_black: defaults.emissive, ...(force ? { force: '1' } : {}),
    }),
    'MASTER_JSON');
  if (result.errors && result.errors.length > 0) throw new Error(`M_PBR_Master compile errors: ${result.errors.join('; ')}`);
  return result;
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

/** texDir contains T_<Name>_basecolor.png, _normal.png, _orm.png (pack_orm.py), optional _emissive.png. */
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

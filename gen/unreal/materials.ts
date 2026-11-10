// PBR material setup through Unreal MCP.
//   ensureMaster()  -> builds / upgrades /Game/Kit/Materials/M_PBR_Master (v4, gen/unreal/py/build_master_material.py)
//                      and /Game/Kit/Materials/MPC_Style, the shared style every instance reads
//   setStyle({...}) -> reads or sets MPC_Style (one change restyles every prop)
//   applyPbr({...}) -> imports an asset's textures (basecolor, normal, orm, emissive), makes (or on a re-run reuses) MI_<Name>, assigns it
//
// v3 parameters: BaseColor, Normal, ORM (R=AO G=Roughness B=Metallic), EmissiveTexture; Tint, Saturation, UseTintMask;
// RoughnessScale/Offset, MetallicOverride/Value, NormalStrength, AOStrength; EmissiveColor/Strength,
// UseEmissiveTexture (static switch); FlashAmount (Custom Primitive Data 0), FlashColor, FlashStrength.
// v4 adds StyleMask (gen/blender/bake_style.py: R edges, G occlusion, B height) and StyleAmount; the strengths and
// colours are in MPC_Style: PaletteStrength/Color, CavityStrength/Color, GradientStrength/Color, EdgeStrength/Color
// (all strengths 0 by default = the v3 look).
// ORM comes from gen/blender/pack_orm.py (packs T_<Name>_roughness/metallic/ao).
//
// Normal maps are read as DirectX (Y-) like Unreal's. Blender-made maps are OpenGL (Y+): pass openGlNormals
// (CLI --opengl-normals) to set the texture's FlipGreenChannel, or the bumps light inside out.
// A texture set with separate _roughness/_metallic/_ao maps needs pack_orm.py first (a lone roughness map is fine:
// it fills AO 1 and metallic 0); applyPbr warns when it finds those maps but no _orm.
//
// CLI: node gen/unreal/materials.ts master [--force]
//      node gen/unreal/materials.ts apply <Name> <textureDir> [/Game/Props] [--opengl-normals]
//      node gen/unreal/materials.ts style [EdgeStrength=0.6 EdgeColor=#ffd9a0 PaletteStrength=0.3 ...]   (no arguments: print)

import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { KIT, errorMessage, isMain } from '../paths.ts';
import { parseMarkedJson } from '../proc.ts';
import { type ObjectRef } from './mcp.ts';
import { assetExists, createMaterialInstance, deleteAsset, importTexture as importTextureAsset, materialSlots, ref,
  saveAssets, setInstanceTexture, setProperties, setSlotMaterial } from './ue.ts';
import { runPythonFileOrThrow } from './python.ts';


export const MASTER = '/Game/Kit/Materials/M_PBR_Master';
export const STYLE = '/Game/Kit/Materials/MPC_Style';
const KIT_TEX = '/Game/Kit/Textures';

export { ref };

type Rgb = readonly [number, number, number];
export type MapKey = 'basecolor' | 'normal' | 'orm' | 'emissive' | 'style';
interface TextureProps {
  SRGB: boolean;
  CompressionSettings: 'TC_Default' | 'TC_Normalmap' | 'TC_Masks';
  MaxTextureSize?: number;
  /** UTexture::bFlipGreenChannel: true for OpenGL (Y+) normal maps such as Blender's. */
  bFlipGreenChannel?: boolean;
}
interface MapSpec { param: string; props: TextureProps; fill: Rgb; defaultName: string }

// Per-map texture settings, the master parameter each one feeds, and the master's default texture.
const MAPS = {
  basecolor: { param: 'BaseColor', props: { SRGB: true, CompressionSettings: 'TC_Default' }, fill: [128, 128, 128], defaultName: 'T_Kit_Default_BaseColor' },
  normal: { param: 'Normal', props: { SRGB: false, CompressionSettings: 'TC_Normalmap' }, fill: [128, 128, 255], defaultName: 'T_Kit_Default_Normal' },
  // AO 1, roughness 0.6, metallic 0
  orm: { param: 'ORM', props: { SRGB: false, CompressionSettings: 'TC_Masks' }, fill: [255, 153, 0], defaultName: 'T_Kit_Default_ORM' },
  emissive: { param: 'EmissiveTexture', props: { SRGB: true, CompressionSettings: 'TC_Default' }, fill: [0, 0, 0], defaultName: 'T_Kit_Default_Black' },
  // no edge, fully open, top of the gradient: a prop without a baked mask gets only the palette part of the style
  style: { param: 'StyleMask', props: { SRGB: false, CompressionSettings: 'TC_Masks' }, fill: [0, 255, 255], defaultName: 'T_Kit_Default_Style' },
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
  if (await assetExists(path)) await deleteAsset(path);
  const tex = await importTextureAsset(folder, name, file);
  await setProperties(tex, { ...props });
  return tex;
}

export interface MasterResult { path: string; version: string; rebuilt: boolean; expressions?: number }

/**
 * Make sure M_PBR_Master is at the current version. The graph is rebuilt in place (instances keep working),
 * default textures are imported only when missing (the master references them, so they are never replaced).
 */
export async function ensureMaster({ force = false }: { force?: boolean } = {}): Promise<MasterResult> {
  const tmp = join(tmpdir(), 'megajam-kit-defaults');
  mkdirSync(tmp, { recursive: true });
  const defaults = {} as Record<MapKey, string>;
  const imported: string[] = [];
  for (const key of MAP_KEYS) {
    const m = MAPS[key];
    const path = `${KIT_TEX}/${m.defaultName}`;
    if (!(await assetExists(path))) {
      const f = join(tmp, `${m.defaultName}.tga`);
      writeTga(f, m.fill);
      await importTexture(KIT_TEX, m.defaultName, f, m.props);
      imported.push(path);
    }
    defaults[key] = path;
  }
  // The master references these: unsaved, they'd be missing after a restart or in a cook.
  if (imported.length && !(await saveAssets(imported))) {
    throw new Error(`saving ${imported.join(', ')} failed`);
  }
  const result = parseMarkedJson<MasterResult>(
    await runPythonFileOrThrow(join(KIT, 'gen', 'unreal', 'py', 'build_master_material.py'), {
      path: MASTER, mpc: STYLE, tex_style: defaults.style, tex_basecolor: defaults.basecolor, tex_normal: defaults.normal, tex_orm: defaults.orm,
      tex_black: defaults.emissive, ...(force ? { force: '1' } : {}),
    }),
    'MASTER_JSON');
  return result;
}

export interface StyleValues { scalars: Record<string, number>; vectors: Record<string, [number, number, number]> }

/** sRGB hex (#rrggbb) to linear 0-1, the form material colours are stored in. */
function hexToLinear(hex: string): [number, number, number] {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex);
  if (!m?.[1]) throw new Error(`not a colour: ${hex} (want #rrggbb or r,g,b in linear 0-1)`);
  const lin = (i: number): number => {
    const c = parseInt((m[1] ?? '').slice(i, i + 2), 16) / 255;
    return Number((c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4).toFixed(4));
  };
  return [lin(0), lin(2), lin(4)];
}

/**
 * Read (no arguments) or set MPC_Style. Scalars are numbers; colours are '#rrggbb' (sRGB, as in the style lock's
 * palette) or [r, g, b] linear. Saved into the collection asset, so it holds in the packaged game.
 */
export async function setStyle(values: Record<string, number | string | [number, number, number]> = {}): Promise<StyleValues> {
  const json: Record<string, number | [number, number, number]> = {};
  for (const [k, v] of Object.entries(values)) json[k] = typeof v === 'string' ? hexToLinear(v) : v;
  return parseMarkedJson<StyleValues>(
    await runPythonFileOrThrow(join(KIT, 'gen', 'unreal', 'py', 'set_style.py'), { mpc: STYLE, json: JSON.stringify(json) }),
    'STYLE_SET_JSON');
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
  /** The normal map is OpenGL (Y+), as Blender bakes and exports it: flip its green channel on import. */
  openGlNormals?: boolean;
}
export interface ApplyPbrResult { instance: string; textures: MapKey[]; slots: string[] }

/** texDir contains T_<Name>_basecolor.png, _normal.png, _orm.png (pack_orm.py), optional _emissive.png. */
export async function applyPbr({ name, texDir, dest = '/Game/Props', mesh, kind = 'static', maxTextureSize = 2048, openGlNormals = false }: ApplyPbrOptions): Promise<ApplyPbrResult> {
  const loose = ['roughness', 'metallic', 'ao'].filter((k) => existsSync(join(texDir, `T_${name}_${k}.png`)));
  if (loose.length && !existsSync(join(texDir, `T_${name}_orm.png`))) {
    console.warn(`WARN: ${texDir} has T_${name}_${loose.join('/')} but no T_${name}_orm.png: the master's default ORM ` +
      `(roughness 0.6) is used. Pack them first: blender -b --factory-startup --python gen/blender/pack_orm.py -- <texDir> ${name}`);
  }
  await ensureMaster();
  const folder = `${dest}/${name}`;
  const instPath = `${folder}/MI_${name}`;
  // Re-running reuses the existing instance: the mesh (and maybe levels) reference it, and deleting a referenced
  // asset opens a modal dialog that stalls the editor.
  const reuse = await assetExists(instPath);
  const inst = reuse ? ref(instPath) : await createMaterialInstance(folder, `MI_${name}`, MASTER);
  const applied: MapKey[] = [];
  const touched: string[] = [instPath];
  for (const key of MAP_KEYS) {
    const m = MAPS[key];
    const file = join(texDir, `T_${name}_${key}.png`);
    // On a reused instance, point each map at the kit default first: maps missing this run then don't keep an old
    // texture, and the old texture is unreferenced when importTexture replaces it.
    if (reuse) await setInstanceTexture(inst, m.param, ref(`${KIT_TEX}/${m.defaultName}`));
    if (!existsSync(file)) continue;
    const props: TextureProps = { ...m.props, MaxTextureSize: key === 'style' ? Math.min(maxTextureSize || 1024, 1024) : maxTextureSize };
    if (key === 'normal' && openGlNormals) props.bFlipGreenChannel = true;
    const tex = await importTexture(folder, `T_${name}_${key}`, file, props);
    await setInstanceTexture(inst, m.param, tex);
    applied.push(key);
    touched.push(`${folder}/T_${name}_${key}`);
  }
  const meshPath = (mesh ?? `${folder}/${kind === 'skeletal' ? 'SK' : 'SM'}_${name}`).split('.')[0] ?? '';  // asset.ts/character.ts import into <dest>/<Name>/
  const slots = await materialSlots(meshPath, kind);
  for (const s of slots) await setSlotMaterial(meshPath, kind, s, inst);
  // Save exactly what this call changed: an empty list would save every dirty package (the user's level included).
  if (!(await saveAssets([...touched, meshPath]))) {
    throw new Error(`saving ${[...touched, meshPath].join(', ')} failed`);
  }
  return { instance: instPath, textures: applied, slots };
}

if (isMain(import.meta.url)) {
  const argv = process.argv.slice(2);
  const openGlNormals = argv.includes('--opengl-normals');
  const [cmd, a, b, c] = argv.filter((x) => x !== '--opengl-normals');
  try {
    if (cmd === 'master') console.log(JSON.stringify(await ensureMaster({ force: a === '--force' })));
    else if (cmd === 'apply' && a && b) console.log(JSON.stringify(await applyPbr({ name: a, texDir: resolve(b), dest: c ?? '/Game/Props', openGlNormals })));
    else if (cmd === 'style') {
      const values: Record<string, number | string | [number, number, number]> = {};
      for (const kv of argv.slice(1)) {
        const [k, v] = kv.split('=');
        if (!k || v === undefined) throw new Error(`bad style argument ${kv}: want Name=value`);
        const parts = v.split(',').map(Number);
        values[k] = v.startsWith('#') ? v : parts.length === 3 ? [parts[0] ?? 0, parts[1] ?? 0, parts[2] ?? 0] : Number(v);
      }
      await ensureMaster();
      console.log(JSON.stringify(await setStyle(values), null, 2));
    }
    else { console.log('usage: materials.ts master [--force] | apply <Name> <textureDir> [/Game/Props] [--opengl-normals] | style [Name=value ...]'); process.exit(2); }
  } catch (e) { console.error(`FAIL: ${errorMessage(e)}`); process.exit(1); }
}

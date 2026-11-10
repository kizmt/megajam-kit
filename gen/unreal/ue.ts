// Engine-neutral editor operations for the kit's generators (asset.ts, character.ts, materials.ts, vfx.ts).
//
// UE 5.8.4: Epic's Python editor toolsets (editor_toolset.toolsets.*), the calls the kit was verified with.
// UE 5.9:   those toolsets are gone (replaced by C++ EditorToolset.*Toolset with other schemas; a 5.9 practice run hit
//           "Toolset 'editor_toolset.toolsets.asset.AssetTools' not found"), so the same operations run as plain
//           unreal.* Python through MegajamTools.run_python (gen/unreal/py/ue_ops.py), which works on both.
// The engine is told apart by its tool search (mcp.ts hasNewToolSearch). Paths are '/Game/X/Y' or object paths.

import { join } from 'node:path';
import { KIT } from '../paths.ts';
import { callTool, hasNewToolSearch, mcpCall, type Box, type CameraTransform, type ObjectRef } from './mcp.ts';
import { runPythonFile } from './python.ts';

const AS = 'editor_toolset.toolsets.asset.AssetTools';
const SM = 'editor_toolset.toolsets.static_mesh.StaticMeshTools';
const SK = 'editor_toolset.toolsets.skeletal_mesh.SkeletalMeshTools';
const SC = 'editor_toolset.toolsets.scene.SceneTools';
const AC = 'editor_toolset.toolsets.actor.ActorTools';
const OB = 'editor_toolset.toolsets.object.ObjectTools';
const MI = 'editor_toolset.toolsets.material_instance.MaterialInstanceTools';
const TX = 'editor_toolset.toolsets.texture.TextureTools';
const E = 'EditorToolset.EditorAppToolset';
const OPS = join(KIT, 'gen', 'unreal', 'py', 'ue_ops.py');

export type MeshKind = 'static' | 'skeletal';

/** '/Game/X/Y' -> {refPath: '/Game/X/Y.Y'} (object path form the 5.8 toolsets expect). */
export const ref = (p: string): ObjectRef => ({ refPath: p.includes('.') ? p : `${p}.${p.split('/').pop() ?? ''}` });

let python: boolean | undefined;
async function usePython(): Promise<boolean> {
  python ??= await hasNewToolSearch();
  return python;
}

async function op<T>(name: string, args: unknown): Promise<T> {
  const r = await runPythonFile(OPS, { op: name, json: JSON.stringify(args) });
  if (!r.ok) throw new Error(`ue_ops ${name} raised:\n${r.output.slice(-1500)}`);
  const line = r.output.split('\n').reverse().find((l) => l.startsWith('UE_OPS_JSON '));
  if (!line) throw new Error(`ue_ops ${name}: no result line in:\n${r.output.slice(-800)}`);
  return JSON.parse(line.slice('UE_OPS_JSON '.length)) as T;
}

/** An asset or a folder exists. */
export async function assetExists(path: string): Promise<boolean> {
  return (await usePython()) ? op<boolean>('exists', { path }) : callTool<boolean>(AS, 'exists', { path });
}

/** Delete an asset or a folder. Never on something referenced from outside (modal dialog): callers check first. */
export async function deleteAsset(path: string): Promise<void> {
  if (await usePython()) await op('delete', { path });
  else await mcpCall(AS, 'delete', { path });
}

/** Save these packages (only_if_is_dirty off on 5.9). An empty list is refused: it would save everything dirty. */
export async function saveAssets(paths: string[]): Promise<boolean> {
  if (!paths.length) throw new Error('saveAssets: empty list (would save every dirty package)');
  return (await usePython()) ? op<boolean>('save', { paths }) : callTool<boolean>(AS, 'save_assets', { asset_paths: paths });
}

/** Import an FBX as <folder>/<name>, geometry only (the importer's materials and textures are not kept on 5.9). */
export async function importStaticMesh(folder: string, name: string, file: string): Promise<void> {
  const source_file = file.replace(/\\/g, '/');
  if (await usePython()) await op('import_static_mesh', { folder, name, file: source_file });
  else await mcpCall(SM, 'import_file', { folder_path: folder, asset_name: name, source_file, import_materials: true, import_textures: false });
}

export async function setNanite(mesh: string, enabled: boolean): Promise<void> {
  if (await usePython()) await op('set_nanite', { mesh, enabled });
  else await mcpCall(SM, 'set_nanite_enabled', { mesh: ref(mesh), enabled });
}

/** Replace the simple collision with N convex hulls. */
export async function convexCollisions(mesh: string, hulls: number): Promise<boolean> {
  return (await usePython()) ? op<boolean>('convex', { mesh, hulls })
    : callTool<boolean>(SM, 'generate_convex_collisions', { mesh: ref(mesh), hull_count: hulls });
}

/** Spawn an asset in the open level, labelled, and return the actor and its bounds. */
export async function placeAsset(asset: string, label: string, location: [number, number, number], yaw: number): Promise<{ actor: ObjectRef; box: Box }> {
  if (await usePython()) return op('place', { asset, label, location, yaw });
  const [x, y, z] = location;
  const actor = await callTool<ObjectRef>(SC, 'add_to_scene_from_asset', {
    asset_path: asset, name: label,
    xform: { location: { x, y, z }, rotation: { pitch: 0, yaw, roll: 0 } }, snap_to_ground: false,
  });
  return { actor, box: await callTool<Box>(AC, 'get_actor_bounds', { actor }) };
}

export async function setViewportCamera(view: CameraTransform): Promise<void> {
  if (await usePython()) await op('camera', view);
  else await mcpCall(E, 'SetCameraTransform', { transform: view });
}

/** Import an image as the texture <folder>/<name> (replace an existing one first: callers delete it). */
export async function importTexture(folder: string, name: string, file: string): Promise<ObjectRef> {
  const source_file = file.replace(/\\/g, '/');
  if (await usePython()) return op<ObjectRef>('import_texture', { folder, name, file: source_file });
  const t = await callTool<ObjectRef | ObjectRef[]>(TX, 'import_file', { folder_path: folder, asset_name: name, source_file });
  const tex = Array.isArray(t) ? t[0] : t;
  if (!tex) throw new Error(`texture import produced nothing: ${file}`);
  return tex;
}

/** Set properties by their C++ names (SRGB, CompressionSettings: 'TC_Masks', LODGroup, AddressX, ...). */
export async function setProperties(object: ObjectRef | string, props: Record<string, unknown>): Promise<void> {
  const r = typeof object === 'string' ? ref(object) : object;
  if (await usePython()) await op('set_props', { path: r.refPath, props });
  else await mcpCall(OB, 'set_properties', { instance: r, values: JSON.stringify(props) });
}

export async function createMaterialInstance(folder: string, name: string, parent: string): Promise<ObjectRef> {
  return (await usePython()) ? op<ObjectRef>('create_mi', { folder, name, parent })
    : callTool<ObjectRef>(MI, 'create', { folder_path: folder, asset_name: name, parent: ref(parent) });
}

export async function setInstanceTexture(instance: ObjectRef, param: string, texture: ObjectRef): Promise<void> {
  if (await usePython()) await op('mi_texture', { instance: instance.refPath, param, texture: texture.refPath });
  else await mcpCall(MI, 'set_texture_parameter', { instance, name: param, value: texture });
}

export async function materialSlots(mesh: string, kind: MeshKind): Promise<string[]> {
  return (await usePython()) ? op<string[]>('slots', { mesh, kind })
    : callTool<string[]>(kind === 'skeletal' ? SK : SM, 'get_material_slots', { mesh: ref(mesh) });
}

export async function setSlotMaterial(mesh: string, kind: MeshKind, slot: string, material: ObjectRef): Promise<void> {
  if (await usePython()) await op('set_material', { mesh, kind, slot, material: material.refPath });
  else await mcpCall(kind === 'skeletal' ? SK : SM, 'set_material', { mesh: ref(mesh), slot_name: slot, material });
}

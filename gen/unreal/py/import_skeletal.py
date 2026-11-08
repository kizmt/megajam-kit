# Import a rigged FBX as a SkeletalMesh with scale / rotation control (the MCP import_file tool has neither).
# Run via: node gen/unreal/py.ts gen/unreal/py/import_skeletal.py --arg fbx=C:/.../model.fbx
#            --arg folder=/Game/Characters/Mechanic --arg name=SK_Mechanic [--arg scale=100] [--arg yaw=0]
#            [--arg materials=1] [--arg skeleton=/Game/.../SKEL_X] [--arg in_place=1]
# Replaces existing assets of the same name (refuses if something else references them). Prints size (cm) and bone count.
# in_place=1: imports over the existing mesh instead (no delete, no referencer check), with its own skeleton and the
# scale / rotation / translation from its asset_import_data (scale, yaw and skeleton= are ignored). Use it to add
# bones: the object, material slots, physics asset and referencers stay. (Interchange reimport_asset returns None on
# meshes this script imported: they carry legacy FbxSkeletalMeshImportData.) Untested as a kit option; the method was
# proven by hand.
import unreal

fbx = ARGS["fbx"]
folder = ARGS["folder"]
name = ARGS["name"]
scale = float(ARGS.get("scale", "1"))
yaw = float(ARGS.get("yaw", "0"))
materials = ARGS.get("materials", "1") == "1"
in_place = ARGS.get("in_place", "0") == "1"

from megajam_tools.refs import referencers_outside

# Refuses (instead of a blocking dialog) if anything else still uses the old mesh, skeleton or physics asset.
# Checked as one set: the skeleton and physics asset reference the mesh themselves, which mustn't count.
_eal = unreal.EditorAssetLibrary
existing = None
if in_place:
    existing = unreal.load_asset(f"{folder}/{name}")
    if not isinstance(existing, unreal.SkeletalMesh):
        raise RuntimeError(f"in_place=1 needs an existing SkeletalMesh at {folder}/{name}")
    old_data = existing.get_editor_property("asset_import_data")
    if not isinstance(old_data, unreal.FbxSkeletalMeshImportData):
        raise RuntimeError(f"in_place=1: {folder}/{name} has no FbxSkeletalMeshImportData "
                           f"({type(old_data).__name__}); it wasn't imported by this script")
else:
    old = [p for p in (f"{folder}/{name}{s}" for s in ("", "_Skeleton", "_PhysicsAsset")) if _eal.does_asset_exist(p)]
    # skeleton= naming the skeleton this run deletes would load None below and silently make a new skeleton.
    if ARGS.get("skeleton", "").split(".")[0] in old:
        raise RuntimeError(f"skeleton={ARGS['skeleton']} is one of the assets this import replaces; use in_place=1 "
                           "to keep it, or import under a new name")
    refs = referencers_outside(old)
    if refs:
        raise RuntimeError("refusing to replace " + ", ".join(old) + ": still referenced (remove or repoint these first, "
                           "or use a new name):\n  " + "\n  ".join(refs))
    for p in old:
        if not _eal.delete_asset(p):
            raise RuntimeError(f"delete failed: {p}")

ui = unreal.FbxImportUI()
ui.automated_import_should_detect_type = False
ui.import_mesh = True
ui.import_as_skeletal = True
ui.mesh_type_to_import = unreal.FBXImportType.FBXIT_SKELETAL_MESH
ui.original_import_type = unreal.FBXImportType.FBXIT_SKELETAL_MESH
ui.import_materials = materials
ui.import_textures = materials
ui.import_animations = False
ui.create_physics_asset = not in_place  # in place: keep the mesh's physics asset (a new one would clash by name)
if ARGS.get("skeleton"):
    ui.skeleton = unreal.load_asset(ARGS["skeleton"])
data = ui.skeletal_mesh_import_data
if in_place:
    ui.skeleton = existing.skeleton
    data.import_uniform_scale = old_data.get_editor_property("import_uniform_scale")
    data.import_rotation = old_data.get_editor_property("import_rotation")
    data.import_translation = old_data.get_editor_property("import_translation")
else:
    data.import_uniform_scale = scale
    data.import_rotation = unreal.Rotator(roll=0.0, pitch=0.0, yaw=yaw)

task = unreal.AssetImportTask()
task.filename = fbx
task.destination_path = folder
task.destination_name = name
task.automated = True
task.replace_existing = True
task.save = True
task.options = ui
task.factory = unreal.FbxFactory()
unreal.AssetToolsHelpers.get_asset_tools().import_asset_tasks([task])

mesh = unreal.load_asset(f"{folder}/{name}")
if not isinstance(mesh, unreal.SkeletalMesh):
    raise RuntimeError(f"no SkeletalMesh at {folder}/{name}; imported: {list(task.imported_object_paths)}")
# task.save writes the mesh only: the new Skeleton and PhysicsAsset stay in memory (5.8.4), and the mesh and every
# animation reference them, so an editor restart would lose them. Save both explicitly.
for dep in (mesh.skeleton, mesh.get_editor_property("physics_asset")):
    if dep is None:
        continue
    if not _eal.save_loaded_asset(dep, False):
        raise RuntimeError(f"saving {dep.get_path_name()} failed")
    print(f"saved {dep.get_path_name()}")
b = mesh.get_bounds()
e = b.box_extent
print(f"mesh {mesh.get_path_name()}")
print(f"size_cm x={e.x*2:.1f} y={e.y*2:.1f} z={e.z*2:.1f} origin_z={b.origin.z:.1f}")
print(f"skeleton {mesh.skeleton.get_path_name()}")
print("imported", [str(p) for p in task.imported_object_paths])
import json
print("IMPORT_JSON=" + json.dumps({"mesh": mesh.get_path_name(), "skeleton": mesh.skeleton.get_path_name(),
                                   "size_cm": [round(e.x * 2, 1), round(e.y * 2, 1), round(e.z * 2, 1)]}))

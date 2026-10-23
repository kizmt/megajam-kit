# Import a rigged FBX as a SkeletalMesh with scale / rotation control (the MCP import_file tool has neither).
# Run via: node gen/unreal/py.ts gen/unreal/py/import_skeletal.py --arg fbx=C:/.../model.fbx
#            --arg folder=/Game/Characters/Explorer --arg name=SK_Explorer [--arg scale=100] [--arg yaw=0]
#            [--arg materials=1] [--arg skeleton=/Game/.../SKEL_X]
# Replaces existing assets of the same name. Prints size (cm) and bone count.
import unreal

fbx = ARGS["fbx"]
folder = ARGS["folder"]
name = ARGS["name"]
scale = float(ARGS.get("scale", "1"))
yaw = float(ARGS.get("yaw", "0"))
materials = ARGS.get("materials", "1") == "1"

for suffix in ("", "_Skeleton", "_PhysicsAsset"):
    path = f"{folder}/{name}{suffix}"
    if unreal.EditorAssetLibrary.does_asset_exist(path):
        unreal.EditorAssetLibrary.delete_asset(path)

ui = unreal.FbxImportUI()
ui.automated_import_should_detect_type = False
ui.import_mesh = True
ui.import_as_skeletal = True
ui.mesh_type_to_import = unreal.FBXImportType.FBXIT_SKELETAL_MESH
ui.original_import_type = unreal.FBXImportType.FBXIT_SKELETAL_MESH
ui.import_materials = materials
ui.import_textures = materials
ui.import_animations = False
ui.create_physics_asset = True
if ARGS.get("skeleton"):
    ui.skeleton = unreal.load_asset(ARGS["skeleton"])
data = ui.skeletal_mesh_import_data
data.import_uniform_scale = scale
data.import_rotation = unreal.Rotator(0.0, 0.0, yaw)  # (roll, pitch, yaw)

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
b = mesh.get_bounds()
e = b.box_extent
print(f"mesh {mesh.get_path_name()}")
print(f"size_cm x={e.x*2:.1f} y={e.y*2:.1f} z={e.z*2:.1f} origin_z={b.origin.z:.1f}")
print(f"skeleton {mesh.skeleton.get_path_name()}")
print("imported", [str(p) for p in task.imported_object_paths])

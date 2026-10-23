# Thin Blueprint subclass of a C++ Character for a generated character: mesh, anim class, mesh offset only.
# Gameplay assignments (input actions, tuning asset) stay with the game's own wiring.
# Run via: node gen/unreal/py.ts gen/unreal/py/make_character_bp.py --arg name=Explorer
#            --arg parent=/Script/MyGame.PlayerCharacter [--arg folder=/Game/Characters/Explorer]
#            [--arg mesh=/Game/Characters/Explorer/SK_Explorer] [--arg abp=/Game/Characters/Explorer/Anims/ABP_Unarmed_Explorer]
# Prints BP_JSON={...}.
import json
import unreal

name = ARGS["name"]
folder = ARGS.get("folder", f"/Game/Characters/{name}")
mesh_path = ARGS.get("mesh", f"{folder}/SK_{name}")
abp_path = ARGS.get("abp", f"{folder}/Anims/ABP_Unarmed_{name}")
parent = unreal.load_class(None, ARGS["parent"])
if parent is None:
    raise RuntimeError(f"parent class not found: {ARGS['parent']} (format /Script/<Module>.<ClassWithoutPrefix>)")

eal = unreal.EditorAssetLibrary
bp_path = f"{folder}/BP_{name}"
if eal.does_asset_exist(bp_path):
    eal.delete_asset(bp_path)
factory = unreal.BlueprintFactory()
factory.set_editor_property("parent_class", parent)
bp = unreal.AssetToolsHelpers.get_asset_tools().create_asset(f"BP_{name}", folder, unreal.Blueprint, factory)

cdo = unreal.get_default_object(bp.generated_class())
mesh = cdo.get_editor_property("mesh")
mesh.set_skeletal_mesh_asset(unreal.load_asset(mesh_path))
mesh.set_editor_property("anim_class", unreal.load_asset(abp_path).generated_class())
half = cdo.get_editor_property("capsule_component").get_unscaled_capsule_half_height()
mesh.set_editor_property("relative_location", unreal.Vector(0, 0, -half))
mesh.set_editor_property("relative_rotation", unreal.Rotator(0, 0, 270))  # character faces +Y (prep_rig); actor forward is +X
unreal.BlueprintEditorLibrary.compile_blueprint(bp)
eal.save_loaded_asset(bp)
print("BP_JSON=" + json.dumps({"blueprint": bp_path, "parent": ARGS["parent"], "mesh_z": -half}))

# IK Rigs + IK Retargeter (Manny -> character) and batch-retarget Epic's template animations.
# Run via: node gen/unreal/py.ts gen/unreal/py/retarget_setup.py --arg name=Explorer
#            [--arg mesh=/Game/Characters/Explorer/SK_Explorer] [--arg anims=/Game/Characters/Mannequins/Anims/Unarmed/ABP_Unarmed,...]
# Creates: /Game/Characters/Rigs/IK_Manny (shared), /Game/Characters/<Name>/Rig/IK_<Name>, RTG_Manny_To_<Name>,
#          retargeted copies in /Game/Characters/<Name>/Anims with suffix _<Name>.
# Normally run by character.ts step 6. For anything beyond the template anims (a library, montages, clips with
# curves) use gen/unreal/retarget_library.ts: it also registers the clips' curves on the target skeleton and saves
# it, which this script does not (missing curves crashed a -game launch once).
import unreal

from megajam_tools.refs import delete_asset_safely

name = ARGS["name"]
target_mesh_path = ARGS.get("mesh", f"/Game/Characters/{name}/SK_{name}")
source_mesh_path = ARGS.get("source", "/Game/Characters/Mannequins/Meshes/SKM_Manny_Simple")
anims = [a for a in ARGS.get("anims", "/Game/Characters/Mannequins/Anims/Unarmed/ABP_Unarmed").split(",") if a]
rig_dir = f"/Game/Characters/{name}/Rig"
anim_dir = f"/Game/Characters/{name}/Anims"
tools = unreal.AssetToolsHelpers.get_asset_tools()
eal = unreal.EditorAssetLibrary
SRC, TGT = unreal.RetargetSourceOrTarget.SOURCE, unreal.RetargetSourceOrTarget.TARGET

source_mesh = unreal.load_asset(source_mesh_path)
target_mesh = unreal.load_asset(target_mesh_path)
assert source_mesh and target_mesh, f"missing mesh: {source_mesh_path} / {target_mesh_path}"


def make_ik_rig(path, mesh, reuse=False):
    folder, asset = path.rsplit("/", 1)
    if eal.does_asset_exist(path):
        if reuse:
            # Shared source rig (IK_Manny): every character's retargeter references it. Deleting a referenced
            # asset opens a modal dialog in the editor and blocks the game thread (seen 2026-10-24).
            rig = unreal.load_asset(path)
            ctrl = unreal.IKRigController.get_controller(rig)
            print(f"{asset}: reused, root={ctrl.get_retarget_root()} chains={len(ctrl.get_retarget_chains())}")
            return rig, True
        delete_asset_safely(path)
    rig = tools.create_asset(asset, folder, unreal.IKRigDefinition, unreal.IKRigDefinitionFactory())
    ctrl = unreal.IKRigController.get_controller(rig)
    ctrl.set_skeletal_mesh(mesh)
    auto = ctrl.apply_auto_generated_retarget_definition()
    chains = [str(c.chain_name) for c in ctrl.get_retarget_chains()]
    print(f"{asset}: auto_retarget_definition={auto} root={ctrl.get_retarget_root()} chains={len(chains)} {chains}")
    eal.save_loaded_asset(rig)
    return rig, auto


rtg_path = f"{rig_dir}/RTG_Manny_To_{name}"
# Delete the old retargeter BEFORE the old target IK rig it references (deleting a referenced asset = modal dialog).
delete_asset_safely(rtg_path)

src_rig, ok_src = make_ik_rig("/Game/Characters/Rigs/IK_Manny", source_mesh, reuse=True)
tgt_rig, ok_tgt = make_ik_rig(f"{rig_dir}/IK_{name}", target_mesh)
if not (ok_src and ok_tgt):
    raise RuntimeError("auto retarget definition failed; build chains by hand (docs/ue/characters.md step 5)")

rtg = tools.create_asset(f"RTG_Manny_To_{name}", rig_dir, unreal.IKRetargeter, unreal.IKRetargetFactory())
rc = unreal.IKRetargeterController.get_controller(rtg)
rc.set_ik_rig(SRC, src_rig)
rc.set_ik_rig(TGT, tgt_rig)
rc.set_preview_mesh(SRC, source_mesh)
rc.set_preview_mesh(TGT, target_mesh)
rc.remove_all_ops()
rc.add_default_ops()
rc.auto_map_chains(unreal.AutoMapChainType.FUZZY, True)
rc.auto_align_all_bones(TGT)
mapped = {str(c.chain_name): str(rc.get_source_chain(c.chain_name)) for c in unreal.IKRigController.get_controller(tgt_rig).get_retarget_chains()}
print("chain map (target <- source):", mapped)
eal.save_loaded_asset(rtg)

if eal.does_directory_exist(anim_dir) and eal.list_assets(anim_dir, recursive=True, include_folder=False):
    raise RuntimeError(f"{anim_dir} already has assets: the batch would add '<anim>_{name}1' duplicates. Clear the "
                       "character folder first (clean_character.py, as character.ts does).")
inputs = unreal.IKRetargetBatchOperationInputs()
inputs.assets_to_retarget = [unreal.EditorAssetLibrary.find_asset_data(a) for a in anims]
inputs.source_mesh = source_mesh
inputs.target_mesh = target_mesh
inputs.ik_retarget_asset = rtg
inputs.include_referenced_assets = True
inputs.overwrite_existing_files = False  # True re-saves blend spaces pointing at temp packages and breaks the cook;
# for a fresh retarget, clear the character folder first (clean_character.py, as character.ts does)
inputs.target_path = anim_dir
inputs.suffix = f"_{name}"
results = unreal.IKRetargetBatchOperation.run_batch_retarget(inputs)
print(f"retargeted {len(results)} assets into {anim_dir}:")
for r in results:
    print("  ", r.asset_class_path.asset_name, r.package_name)
eal.save_directory(anim_dir)
import json
abp = next((str(r.package_name) for r in results if "ABP_" in str(r.package_name)), None)
if abp is None:  # the ABP itself is not always in the returned list; look for it
    cand = f"{anim_dir}/ABP_Unarmed_{name}"
    abp = cand if eal.does_asset_exist(cand) else None
print("RETARGET_JSON=" + json.dumps({"ik_rig": f"{rig_dir}/IK_{name}", "retargeter": rtg_path, "chains": len(mapped),
                                     "assets": len(results), "anim_dir": anim_dir, "abp": abp}))

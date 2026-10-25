# Batch-retarget a folder of animations (an animation library) onto a character built by gen/character.ts.
# Run via gen/unreal/retarget_library.ts. ARGS:
#   name         character name (target mesh /Game/Characters/<name>/SK_<name> unless mesh=...)
#   folder       source folder of AnimSequences / AnimMontages / BlendSpaces (recursive), e.g. /Game/AnimLibrary/Paragon/Kwang
#   source_mesh  skeletal mesh on the source skeleton (default Epic's SKM_Manny_Simple)
#   source_rig   optional existing IK Rig for the source (otherwise one is auto-generated next to the library folder)
#   category     destination subfolder: /Game/Characters/<name>/Anims/<category> (default: last part of folder)
#   filter       optional comma-separated substrings; only asset names containing one are retargeted
#   limit        optional max number of assets (for a quick test)
# Never overwrites: overwrite=True re-saves blend spaces pointing at temporary packages and breaks the cook. Assets
# that already exist at the destination are skipped, so reruns only add what is missing.
# Prints RETARGET_LIB_JSON={...}.
import json
import re
import unreal

name = ARGS["name"]
folder = ARGS["folder"].rstrip("/")
target_mesh_path = ARGS.get("mesh", f"/Game/Characters/{name}/SK_{name}")
source_mesh_path = ARGS.get("source_mesh", "/Game/Characters/Mannequins/Meshes/SKM_Manny_Simple")
category = ARGS.get("category") or folder.rsplit("/", 1)[-1]
filters = [f.strip().lower() for f in ARGS.get("filter", "").split(",") if f.strip()]
limit = int(ARGS.get("limit", "0") or 0)
suffix = f"_{name}"
dest = f"/Game/Characters/{name}/Anims/{category}"
rig_dir = f"/Game/Characters/{name}/Rig"

eal = unreal.EditorAssetLibrary
tools = unreal.AssetToolsHelpers.get_asset_tools()
SRC, TGT = unreal.RetargetSourceOrTarget.SOURCE, unreal.RetargetSourceOrTarget.TARGET

source_mesh = unreal.load_asset(source_mesh_path)
target_mesh = unreal.load_asset(target_mesh_path)
if not source_mesh or not target_mesh:
    raise RuntimeError(f"missing mesh: {source_mesh_path} / {target_mesh_path}")


def ik_rig_for(mesh, path):
    """Load an IK Rig at path, or create it with the auto-generated retarget definition."""
    if eal.does_asset_exist(path):
        return unreal.load_asset(path)
    pkg, asset = path.rsplit("/", 1)
    rig = tools.create_asset(asset, pkg, unreal.IKRigDefinition, unreal.IKRigDefinitionFactory())
    ctrl = unreal.IKRigController.get_controller(rig)
    ctrl.set_skeletal_mesh(mesh)
    if not ctrl.apply_auto_generated_retarget_definition():
        raise RuntimeError(f"auto retarget definition failed for {mesh.get_path_name()}: build the IK Rig chains by hand "
                           f"(docs/ue/characters.md), save it, and pass source_rig=")
    eal.save_loaded_asset(rig, only_if_is_dirty=False)
    return rig


src_key = source_mesh.get_name()
is_manny = "Manny" in src_key or "Quinn" in src_key
src_rig_path = ARGS.get("source_rig") or ("/Game/Characters/Rigs/IK_Manny" if is_manny else f"/Game/Characters/Rigs/IK_{src_key}")
src_rig = ik_rig_for(source_mesh, src_rig_path)
tgt_rig_path = f"{rig_dir}/IK_{name}"
if not eal.does_asset_exist(tgt_rig_path):
    raise RuntimeError(f"{tgt_rig_path} not found: build the character with gen/character.ts first")
tgt_rig = unreal.load_asset(tgt_rig_path)

# One retargeter per (source skeleton, character); reused on reruns (never delete a referenced asset: modal dialog).
rtg_name = f"RTG_{'Manny' if is_manny else src_key}_To_{name}"
rtg_path = f"{rig_dir}/{rtg_name}"
if eal.does_asset_exist(rtg_path):
    rtg = unreal.load_asset(rtg_path)
else:
    rtg = tools.create_asset(rtg_name, rig_dir, unreal.IKRetargeter, unreal.IKRetargetFactory())
    rc = unreal.IKRetargeterController.get_controller(rtg)
    rc.set_ik_rig(SRC, src_rig)
    rc.set_ik_rig(TGT, tgt_rig)
    rc.set_preview_mesh(SRC, source_mesh)
    rc.set_preview_mesh(TGT, target_mesh)
    rc.remove_all_ops()
    rc.add_default_ops()
    rc.auto_map_chains(unreal.AutoMapChainType.FUZZY, True)
    rc.auto_align_all_bones(TGT)
    eal.save_loaded_asset(rtg, only_if_is_dirty=False)
rc = unreal.IKRetargeterController.get_controller(rtg)
mapped = {str(c.chain_name): str(rc.get_source_chain(c.chain_name))
          for c in unreal.IKRigController.get_controller(tgt_rig).get_retarget_chains()}
unmapped = [t for t, s in mapped.items() if s in ("None", "")]

# Collect the library's animation assets.
KINDS = ("AnimSequence", "AnimMontage", "BlendSpace", "BlendSpace1D", "AimOffsetBlendSpace", "AimOffsetBlendSpace1D")
reg = unreal.AssetRegistryHelpers.get_asset_registry()
reg.scan_paths_synchronous([folder], True)
found = [a for a in (reg.get_assets_by_path(folder, recursive=True) or []) if str(a.asset_class_path.asset_name) in KINDS]
dep_opts = unreal.AssetRegistryDependencyOptions()
dep_opts.include_soft_package_references = False


def retargeted_deps(a):
    """Names of a montage/blend space's referenced assets that are already retargeted at dest."""
    deps = reg.get_dependencies(a.package_name, dep_opts) or []
    return [str(d).rsplit("/", 1)[-1] for d in deps if eal.does_asset_exist(f"{dest}/{str(d).rsplit('/', 1)[-1]}{suffix}")]


# Sequences first, then montages / blend spaces. A montage or blend space brings its sequences with it
# (include_referenced_assets), so if one of those was retargeted by an earlier run the batch would make a second copy
# (<anim>_<Name>1) and the montage would point at it. Skip those and report them instead.
picked, skipped, skipped_compound = [], [], []
order = sorted(found, key=lambda x: (str(x.asset_class_path.asset_name) != "AnimSequence", str(x.package_name)))
for a in order:
    n = str(a.asset_name)
    if filters and not any(f in n.lower() for f in filters):
        continue
    if eal.does_asset_exist(f"{dest}/{n}{suffix}"):
        skipped.append(n)
        continue
    if str(a.asset_class_path.asset_name) != "AnimSequence":
        clash = retargeted_deps(a)
        if clash:
            skipped_compound.append({"asset": n, "already_retargeted": clash})
            continue
    picked.append(a)
    if limit and len(picked) >= limit:
        break

before = set(eal.list_assets(dest, recursive=True, include_folder=False)) if eal.does_directory_exist(dest) else set()
results = []
if picked:
    inputs = unreal.IKRetargetBatchOperationInputs()
    inputs.assets_to_retarget = picked
    inputs.source_mesh = source_mesh
    inputs.target_mesh = target_mesh
    inputs.ik_retarget_asset = rtg
    inputs.include_referenced_assets = True
    inputs.overwrite_existing_files = False
    inputs.target_path = dest
    inputs.suffix = suffix
    results = unreal.IKRetargetBatchOperation.run_batch_retarget(inputs)
    eal.save_directory(dest, only_if_is_dirty=False)

after = set(eal.list_assets(dest, recursive=True, include_folder=False)) if eal.does_directory_exist(dest) else set()
created = sorted(p.split(".")[0] for p in after - before)
duplicates = [p for p in created if re.search(re.escape(suffix) + r"\d+$", p)]

# Curves: the batch copies source curves (Paragon clips carry mask_geo) into the new sequences but never registers
# them on the target skeleton on disk. The editor patches that in memory on load, so it works in PIE, but -game,
# autoclip and the cook crash in USkeleton::AccumulateCurveMetaData. Register every curve and save the skeleton.
skeleton = target_mesh.get_editor_property("skeleton")
known = {str(c) for c in unreal.AnimationLibrary.get_curve_meta_data_names(skeleton)}
added_curves = []
for a in (reg.get_assets_by_path(dest, recursive=True) or []):
    if str(a.asset_class_path.asset_name) != "AnimSequence":
        continue
    seq = unreal.load_asset(str(a.package_name))
    for c in unreal.AnimationLibrary.get_animation_curve_names(seq, unreal.RawCurveTrackTypes.RCT_FLOAT):
        if str(c) not in known:
            unreal.AnimationLibrary.add_curve_meta_data(skeleton, c, False)
            known.add(str(c))
            added_curves.append(str(c))
skeleton.modify()
eal.save_loaded_asset(skeleton, only_if_is_dirty=False)

print("RETARGET_LIB_JSON=" + json.dumps({
    "retargeter": rtg_path, "source_rig": src_rig_path, "dest": dest, "found": len(found), "requested": len(picked),
    "created": len(created), "skipped_existing": len(skipped), "skipped_compound": skipped_compound,
    "duplicates": duplicates, "skeleton_curves_added": added_curves, "skeleton": skeleton.get_path_name(),
    "unmapped_target_chains": unmapped, "chain_map": mapped, "assets": created[:200],
}))

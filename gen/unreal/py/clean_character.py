# Remove a generated character's folder before rebuilding it (character.ts reruns).
# Run via: node gen/unreal/py.ts gen/unreal/py/clean_character.py --arg name=Mechanic [--arg folder=/Game/Characters/Mechanic]
# Deleting assets piecemeal breaks the rest (re-importing the mesh deletes the skeleton the old ABP uses:
# "The skeleton asset for this animation Blueprint is missing"), and deleting an asset that something
# outside the folder references opens a modal dialog that blocks the editor. So: check outside references
# first and refuse with a clear message, then delete the whole folder in one call. Prints CLEAN_JSON={...}.
import json
import unreal

name = ARGS["name"]
folder = ARGS.get("folder", f"/Game/Characters/{name}")
eal = unreal.EditorAssetLibrary

if not eal.does_directory_exist(folder) or not eal.list_assets(folder, recursive=True):
    print("CLEAN_JSON=" + json.dumps({"folder": folder, "deleted": 0, "existed": False}))
else:
    registry = unreal.AssetRegistryHelpers.get_asset_registry()
    opts = unreal.AssetRegistryDependencyOptions(include_soft_package_references=True, include_hard_package_references=True)
    assets = [p.split(".")[0] for p in eal.list_assets(folder, recursive=True)]
    outside = set()
    for pkg in assets:
        for ref in registry.get_referencers(pkg, opts) or []:
            ref = str(ref)
            if not ref.startswith(folder + "/") and not ref.startswith("/Temp/"):
                outside.add(f"{ref} -> {pkg}")
    # Level actors placed from this character's BP also hold references (the level package shows up above).
    if outside:
        raise RuntimeError(
            "refusing to delete: assets outside the folder still reference this character "
            "(remove/replace them first, e.g. game mode pawn class or placed actors):\n  " + "\n  ".join(sorted(outside)))
    ok = eal.delete_directory(folder)
    print("CLEAN_JSON=" + json.dumps({"folder": folder, "deleted": len(assets), "existed": True, "ok": bool(ok)}))

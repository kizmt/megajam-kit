"""Reference checks before deleting assets: the one implementation every kit script uses.

Deleting an asset that something else still references opens a modal dialog that blocks the editor (and every
script waiting on it). So: find who references it first, and refuse with a clear list instead.

Referencers are loaded to confirm (find_package_referencers_for_asset(..., True)), so an unsaved level whose actor
was just removed doesn't count, while a referencer that is only on disk still does.
"""
import unreal

_eal = unreal.EditorAssetLibrary


def referencers_outside(asset_paths, inside=""):
    """'<referencer> -> <asset>' for every package referencing one of asset_paths, ignoring the assets themselves,
    anything under the folder `inside`, and /Temp/."""
    inside = inside.rstrip("/") + "/" if inside else ""
    pkgs = {str(p).split(".")[0] for p in asset_paths}
    out = set()
    for pkg in pkgs:
        for r in _eal.find_package_referencers_for_asset(pkg, True) or []:
            r = str(r)
            if r in pkgs or r.startswith("/Temp/") or (inside and r.startswith(inside)):
                continue
            out.add(f"{r} -> {pkg}")
    return sorted(out)


def folder_referencers_outside(folder):
    """Referencers outside `folder` of anything inside it (empty when the folder doesn't exist)."""
    if not _eal.does_directory_exist(folder):
        return []
    return referencers_outside(_eal.list_assets(folder, recursive=True, include_folder=False), inside=folder)


def _refuse(what, refs):
    raise RuntimeError(f"refusing to delete {what}: still referenced (remove or repoint these first, or use a new "
                       "name):\n  " + "\n  ".join(refs))


def delete_asset_safely(path):
    """Delete one asset if it exists and nothing else references it; raise with the referencers otherwise."""
    if not _eal.does_asset_exist(path):
        return False
    refs = referencers_outside([path])
    if refs:
        _refuse(path, refs)
    if not _eal.delete_asset(path):
        raise RuntimeError(f"delete failed: {path}")
    return True


def delete_folder_safely(folder):
    """Delete a whole folder if nothing outside it references its contents; raise otherwise. Returns the asset count."""
    if not _eal.does_directory_exist(folder):
        return 0
    assets = _eal.list_assets(folder, recursive=True, include_folder=False)
    refs = referencers_outside(assets, inside=folder)
    if refs:
        _refuse(folder, refs)
    if not _eal.delete_directory(folder):
        raise RuntimeError(f"delete failed: {folder}")
    return len(assets)

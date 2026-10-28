# Remove a generated character's folder before rebuilding it (character.ts reruns).
# Run via: node gen/unreal/py.ts gen/unreal/py/clean_character.py --arg name=Mechanic [--arg folder=/Game/Characters/Mechanic]
# Deleting assets piecemeal breaks the rest (re-importing the mesh deletes the skeleton the old ABP uses:
# "The skeleton asset for this animation Blueprint is missing"), and deleting an asset that something
# outside the folder references opens a modal dialog that blocks the editor. So: check outside references
# first and refuse with a clear message (e.g. game mode pawn class or placed actors), then delete the whole folder
# in one call (megajam_tools.refs, the kit's one reference check). Prints CLEAN_JSON={...}.
import json

from megajam_tools.refs import delete_folder_safely

name = ARGS["name"]
folder = ARGS.get("folder", f"/Game/Characters/{name}")
deleted = delete_folder_safely(folder)
print("CLEAN_JSON=" + json.dumps({"folder": folder, "deleted": deleted, "existed": deleted > 0, "ok": True}))

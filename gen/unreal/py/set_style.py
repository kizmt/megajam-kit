# Read or set MPC_Style, the collection M_PBR_Master (v4) reads its shared style from: one change restyles every prop.
# ARGS: mpc = collection path, json = {"EdgeStrength": 0.6, "EdgeColor": [r, g, b] (linear 0-1), ...} or {} to read.
# Prints STYLE_SET_JSON={"scalars": {...}, "vectors": {...}} with the values after the change. Unknown names raise.
import json

import unreal

mpc = unreal.load_asset(ARGS["mpc"])  # noqa: F821 (ARGS is set by run_python)
if mpc is None:
    raise RuntimeError(f"{ARGS['mpc']} does not exist: run `node gen/unreal/materials.ts master` first")  # noqa: F821
wanted = json.loads(ARGS.get("json") or "{}")  # noqa: F821
scalars = list(mpc.get_editor_property("scalar_parameters"))
vectors = list(mpc.get_editor_property("vector_parameters"))
names = {str(p.get_editor_property("parameter_name")) for p in scalars + vectors}
unknown = [k for k in wanted if k not in names]
if unknown:
    raise RuntimeError(f"no such style parameter: {unknown} (have: {sorted(names)})")
for p in scalars:
    n = str(p.get_editor_property("parameter_name"))
    if n in wanted:
        p.set_editor_property("default_value", float(wanted[n]))
for p in vectors:
    n = str(p.get_editor_property("parameter_name"))
    if n in wanted:
        r, g, b = wanted[n]
        p.set_editor_property("default_value", unreal.LinearColor(r, g, b, 1.0))
if wanted:
    mpc.set_editor_property("scalar_parameters", scalars)
    mpc.set_editor_property("vector_parameters", vectors)
    unreal.EditorAssetLibrary.save_loaded_asset(mpc)
out = {"scalars": {str(p.get_editor_property("parameter_name")): round(p.get_editor_property("default_value"), 4) for p in scalars},
       "vectors": {}}
for p in vectors:
    c = p.get_editor_property("default_value")
    out["vectors"][str(p.get_editor_property("parameter_name"))] = [round(c.r, 4), round(c.g, 4), round(c.b, 4)]
print("STYLE_SET_JSON=" + json.dumps(out))

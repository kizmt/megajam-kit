# Pack T_<Name>_ao / _roughness / _metallic PNGs into one T_<Name>_orm.png (R=AO, G=Roughness, B=Metallic) for
# M_PBR_Master v2: one texture sample and one asset instead of three.
#   blender -b --factory-startup --python gen/blender/pack_orm.py -- <texDir> <Name>
# Missing AO = 1 (white), missing roughness = 0.6, missing metallic = 0. Prints ORM_JSON={...}.
import bpy, sys, os, json
import numpy as np

argv = sys.argv[sys.argv.index("--") + 1:]
tex_dir, name = argv[0], argv[1]


def load(key):
    path = os.path.join(tex_dir, f"T_{name}_{key}.png")
    if not os.path.exists(path):
        return None, None
    img = bpy.data.images.load(path)
    img.colorspace_settings.name = "Non-Color"
    w, h = img.size
    px = np.empty(w * h * 4, dtype=np.float32)
    img.pixels.foreach_get(px)
    return px.reshape(-1, 4)[:, 0], (w, h)


channels = {k: load(k) for k in ("ao", "roughness", "metallic")}
size = next((s for _, s in channels.values() if s), None)
if size is None:
    raise SystemExit(f"no T_{name}_roughness/metallic/ao PNG in {tex_dir}")
w, h = size
for k, (data, s) in channels.items():
    if s and s != size:
        raise SystemExit(f"T_{name}_{k} is {s}, expected {size}")
fill = {"ao": 1.0, "roughness": 0.6, "metallic": 0.0}
r, g, b = (channels[k][0] if channels[k][0] is not None else np.full(w * h, fill[k], np.float32) for k in ("ao", "roughness", "metallic"))
px = np.stack([r, g, b, np.ones(w * h, np.float32)], axis=1).ravel()

out = bpy.data.images.new(f"T_{name}_orm", w, h, alpha=False, is_data=True)
out.colorspace_settings.name = "Non-Color"
out.pixels.foreach_set(px)
path = os.path.join(tex_dir, f"T_{name}_orm.png")
out.filepath_raw = path
out.file_format = "PNG"
out.save()
print("ORM_JSON=" + json.dumps({"file": path, "size": [w, h], "from": {k: s is not None for k, (_, s) in channels.items()}}))

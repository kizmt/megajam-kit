# Extract PBR maps from a Tripo TEXTURED model (FBX or GLB) for the kit's master material.
#   blender -b --factory-startup --python gen/blender/extract_pbr.py -- <model.glb|fbx> <outdir> <Name> [--tex 2048]
# Writes <outdir>/T_<Name>_basecolor.png, _normal.png, _roughness.png, _metallic.png (the names
# gen/unreal/materials.ts applyPbr expects) and prints PBR_JSON={...}.
#
# Why: Tripo's RIG output keeps only the colour image and points its normal-map slot at that same image
# (verified 2026-10-24), so the full maps must come from the textured model. Maps are found by following the
# Principled BSDF's links, not by names: FBX models have four images; GLB models pack roughness (G) and
# metallic (B) into one image behind a Separate Color node.
import bpy, sys, os, json
import numpy as np

argv = sys.argv[sys.argv.index("--") + 1:]
src, outdir, name = argv[0], argv[1], argv[2]
opts = {argv[i].lstrip("-"): argv[i + 1] for i in range(3, len(argv) - 1, 2)}
budget = int(opts.get("tex", "0"))  # 0 = keep full resolution (cap in Unreal with MaxTextureSize instead)
os.makedirs(outdir, exist_ok=True)

bpy.ops.wm.read_factory_settings(use_empty=True)
if src.lower().endswith((".glb", ".gltf")):
    bpy.ops.import_scene.gltf(filepath=src)
else:
    bpy.ops.import_scene.fbx(filepath=src)


def source_of(socket):
    """Follow one input back to (image, channel). channel None = use the image as is."""
    if not socket.is_linked:
        return None, None
    link = socket.links[0]
    node = link.from_node
    if node.type == "TEX_IMAGE":
        return node.image, None
    if node.type == "NORMAL_MAP":
        return source_of(node.inputs["Color"])
    if node.type in ("SEPARATE_COLOR", "SEPARATE_RGB"):
        img, _ = source_of(node.inputs[0])
        chan = {"Red": 0, "R": 0, "Green": 1, "G": 1, "Blue": 2, "B": 2}.get(link.from_socket.name)
        return img, chan
    return None, None


bsdf = None
for m in bpy.data.materials:
    if m.use_nodes:
        bsdf = next((n for n in m.node_tree.nodes if n.type == "BSDF_PRINCIPLED"), None)
        if bsdf:
            break
if bsdf is None:
    raise SystemExit("no Principled BSDF material found in " + src)

maps = {
    "basecolor": source_of(bsdf.inputs["Base Color"]),
    "normal": source_of(bsdf.inputs["Normal"]),
    "roughness": source_of(bsdf.inputs["Roughness"]),
    "metallic": source_of(bsdf.inputs["Metallic"]),
}

# Colour space must be set BEFORE scaling (changing it later reloads the original pixels).
for key, (img, _) in maps.items():
    if img is not None:
        img.colorspace_settings.name = "sRGB" if key == "basecolor" else "Non-Color"
scaled = set()
for img, _ in maps.values():
    if img is not None and img.name not in scaled:
        w, h = img.size
        if budget and max(w, h) > budget:
            s = budget / max(w, h)
            img.scale(max(1, int(w * s)), max(1, int(h * s)))
        scaled.add(img.name)

written = {}
for key, (img, chan) in maps.items():
    if img is None:
        continue
    w, h = img.size
    px = np.empty(w * h * 4, dtype=np.float32)
    img.pixels.foreach_get(px)
    px = px.reshape(-1, 4)
    if chan is not None or key in ("roughness", "metallic"):
        c = px[:, chan if chan is not None else 0]
        px = np.stack([c, c, c, np.ones_like(c)], axis=1)
    out = bpy.data.images.new(f"T_{name}_{key}", w, h, alpha=False, is_data=(key != "basecolor"))
    out.colorspace_settings.name = "sRGB" if key == "basecolor" else "Non-Color"
    out.pixels.foreach_set(px.ravel())
    path = os.path.join(outdir, f"T_{name}_{key}.png")
    out.filepath_raw = path
    out.file_format = "PNG"
    out.save()
    written[key] = {"file": path, "size": [w, h], "from": img.name, "channel": chan}

print("PBR_JSON=" + json.dumps({"source": src, "dir": outdir, "maps": written, "missing": [k for k in maps if k not in written]}))

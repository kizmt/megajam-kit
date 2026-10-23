"""Prepare a generated model for Unreal: real-world size, pivot at base, texture budget, optional
triangle budget, one mesh, clean FBX export.

  blender -b --factory-startup --python gen/blender/prep.py -- <in.fbx|glb|obj> <out.fbx>
        [--name Chest] [--max 0.8 | --height 1.8] [--tex 2048] [--tris 15000]

  --max      metres for the longest side (default: keep Tripo's size)
  --height   metres for the height instead (characters, doors, trees)
  --tex      max texture size in px (default 2048; use 1024 for small props)
  --tris     triangle budget; decimates only if the mesh is above it

Prints one line starting with PREP_JSON=.
"""
import bpy, sys, os, json, argparse
from mathutils import Vector

argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
ap = argparse.ArgumentParser(prog="prep.py")
ap.add_argument("src"); ap.add_argument("dst")
ap.add_argument("--name", default=None)
g = ap.add_mutually_exclusive_group()
g.add_argument("--max", type=float); g.add_argument("--height", type=float)
ap.add_argument("--tex", type=int, default=2048)
ap.add_argument("--tris", type=int, default=0)
a = ap.parse_args(argv)

src, dst = os.path.abspath(a.src), os.path.abspath(a.dst)
name = a.name or os.path.splitext(os.path.basename(dst))[0]
os.makedirs(os.path.dirname(dst), exist_ok=True)
texdir = os.path.join(os.path.dirname(dst), name + "_tex")
os.makedirs(texdir, exist_ok=True)

bpy.ops.wm.read_factory_settings(use_empty=True)
ext = os.path.splitext(src)[1].lower()
if ext == ".fbx": bpy.ops.import_scene.fbx(filepath=src)
elif ext in (".glb", ".gltf"): bpy.ops.import_scene.gltf(filepath=src)
elif ext == ".obj": bpy.ops.wm.obj_import(filepath=src)
else: print(f"unsupported format {ext}"); sys.exit(2)

# Drop everything that isn't a mesh (empties, cameras, lights), keeping mesh world transforms.
meshes = [o for o in bpy.context.scene.objects if o.type == "MESH"]
if not meshes: print("no mesh found"); sys.exit(1)
for o in meshes:
    mw = o.matrix_world.copy(); o.parent = None; o.matrix_world = mw
for o in list(bpy.context.scene.objects):
    if o.type != "MESH": bpy.data.objects.remove(o, do_unlink=True)

# Join into one mesh and apply transforms.
bpy.ops.object.select_all(action="DESELECT")
for o in meshes: o.select_set(True)
bpy.context.view_layer.objects.active = meshes[0]
if len(meshes) > 1: bpy.ops.object.join()
obj = bpy.context.view_layer.objects.active
obj.name = obj.data.name = name
bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)

def bounds(o):
    vs = [v.co for v in o.data.vertices]
    lo = Vector((min(v.x for v in vs), min(v.y for v in vs), min(v.z for v in vs)))
    hi = Vector((max(v.x for v in vs), max(v.y for v in vs), max(v.z for v in vs)))
    return lo, hi

def tri_count(o):
    o.data.calc_loop_triangles(); return len(o.data.loop_triangles)

tris_in = tri_count(obj)

# Optional decimation to the triangle budget.
if a.tris and tris_in > a.tris:
    mod = obj.modifiers.new("dec", "DECIMATE"); mod.ratio = a.tris / tris_in
    bpy.ops.object.modifier_apply(modifier=mod.name)

# Scale to real-world size.
lo, hi = bounds(obj); size = hi - lo
factor = 1.0
if a.max: factor = a.max / max(size.x, size.y, size.z)
elif a.height: factor = a.height / size.z
if factor != 1.0:
    obj.scale = (factor, factor, factor)
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)

# Pivot at bottom centre: move geometry so the base sits on z=0, centred in x/y.
lo, hi = bounds(obj)
offset = Vector(((lo.x + hi.x) / 2, (lo.y + hi.y) / 2, lo.z))
obj.data.transform(__import__("mathutils").Matrix.Translation(-offset))
obj.location = (0, 0, 0)
lo, hi = bounds(obj); size = hi - lo

# Textures: downscale to budget and save beside the FBX so they can be embedded.
textures = []
for img in bpy.data.images:
    if img.type != "IMAGE" or img.size[0] == 0: continue
    # Colour space first: changing it later reloads pixels from the original packed data.
    if "normal" in img.name.lower(): img.colorspace_settings.name = "Non-Color"
    w, h = img.size
    if max(w, h) > a.tex:
        s = a.tex / max(w, h); img.scale(max(1, int(w * s)), max(1, int(h * s)))
    path = os.path.join(texdir, f"T_{name}_{img.name.split('_')[-1]}.png")
    img.filepath_raw = path; img.file_format = "PNG"; img.save()
    # Replace the original embedded copy with the resized file so the FBX embeds the small one.
    if img.packed_file: img.unpack(method="REMOVE")
    img.filepath = path; img.reload(); img.pack()
    textures.append(f"{os.path.basename(path)} {img.size[0]}x{img.size[1]}")

for m in obj.data.materials:
    if m: m.name = f"M_{name}"

bpy.ops.export_scene.fbx(
    filepath=dst, use_selection=False, object_types={"MESH"},
    # Tested against UE 5.8 import: FBX_SCALE_NONE + apply_unit_scale gives 1 Blender metre = 100 cm.
    # FBX_SCALE_UNITS and FBX_SCALE_ALL both imported 100x too small (and UE then dropped tiny triangles).
    apply_unit_scale=True, apply_scale_options="FBX_SCALE_NONE", global_scale=1.0, bake_space_transform=True,
    mesh_smooth_type="FACE", use_tspace=True, add_leaf_bones=False,
    path_mode="COPY", embed_textures=True,
)

info = {
    "src": src, "dst": dst, "name": name,
    "triangles_in": tris_in, "triangles_out": tri_count(obj),
    "size_m": [round(size.x, 3), round(size.y, 3), round(size.z, 3)],
    "scale_factor": round(factor, 4),
    "textures": textures,
    "fbx_mb": round(os.path.getsize(dst) / 1048576, 2),
}
print("PREP_JSON=" + json.dumps(info))

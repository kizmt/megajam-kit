"""Inspect a model headlessly: print stats as JSON and render a preview PNG.

  blender -b --factory-startup --python gen/blender/inspect.py -- <model.fbx|glb|obj> [preview.png]

Prints one line starting with INSPECT_JSON= so callers can parse it.
"""
import bpy, sys, json, math, os
from mathutils import Vector

argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
if not argv:
    print("usage: blender -b --python inspect.py -- <model> [preview.png]")
    sys.exit(2)
src = os.path.abspath(argv[0])
png = os.path.abspath(argv[1]) if len(argv) > 1 else os.path.splitext(src)[0] + "_preview.png"

bpy.ops.wm.read_factory_settings(use_empty=True)
ext = os.path.splitext(src)[1].lower()
if ext == ".fbx":
    bpy.ops.import_scene.fbx(filepath=src)
elif ext in (".glb", ".gltf"):
    bpy.ops.import_scene.gltf(filepath=src)
elif ext == ".obj":
    bpy.ops.wm.obj_import(filepath=src)
else:
    print(f"unsupported format {ext}"); sys.exit(2)

HULL_PREFIXES = ("UCX_", "UBX_", "USP_", "UCP_")  # Unreal collision hulls: report, never render
all_meshes = [o for o in bpy.context.scene.objects if o.type == "MESH"]
hulls = [o for o in all_meshes if o.name.startswith(HULL_PREFIXES)]
for o in hulls:
    o.hide_render = True
meshes = [o for o in all_meshes if o not in hulls] or all_meshes
deps = bpy.context.evaluated_depsgraph_get()
tris = 0
for o in meshes:
    ev = o.evaluated_get(deps)
    m = ev.to_mesh()
    m.calc_loop_triangles()
    tris += len(m.loop_triangles)
    ev.to_mesh_clear()

pts = [o.matrix_world @ Vector(c) for o in meshes for c in o.bound_box]
lo = Vector((min(p.x for p in pts), min(p.y for p in pts), min(p.z for p in pts)))
hi = Vector((max(p.x for p in pts), max(p.y for p in pts), max(p.z for p in pts)))
size = hi - lo

mats, images = set(), set()
for o in meshes:
    for s in o.material_slots:
        if s.material:
            mats.add(s.material.name)
            if s.material.node_tree:
                for n in s.material.node_tree.nodes:
                    if n.type == "TEX_IMAGE" and n.image:
                        images.add(f"{n.image.name} {n.image.size[0]}x{n.image.size[1]}")

info = {
    "file": src,
    "objects": len(meshes),
    "collision_hulls": sorted(o.name for o in hulls),
    "triangles": tris,
    "size_m": [round(size.x, 3), round(size.y, 3), round(size.z, 3)],
    "min_z": round(lo.z, 3),
    "center": [round(c, 3) for c in (lo + hi) / 2],
    "materials": sorted(mats),
    "textures": sorted(images),
    "armature": any(o.type == "ARMATURE" for o in bpy.context.scene.objects),
}

# --- preview render ---
scene = bpy.context.scene
center = (lo + hi) / 2
radius = max(size.length / 2, 0.01)
cam_data = bpy.data.cameras.new("cam"); cam_data.lens = 50
cam = bpy.data.objects.new("cam", cam_data); scene.collection.objects.link(cam)
dist = radius / math.tan(math.radians(18)) * 1.15
direction = Vector((1.0, -1.2, 0.8)).normalized()
cam.location = center + direction * dist
cam.rotation_euler = (center - cam.location).to_track_quat("-Z", "Y").to_euler()
scene.camera = cam

for loc, energy in (((3, -4, 6), 600), ((-5, -2, 3), 200), ((0, 5, 4), 300)):
    ld = bpy.data.lights.new("l", "AREA"); ld.energy = energy * radius * radius; ld.size = radius * 3
    lob = bpy.data.objects.new("l", ld); scene.collection.objects.link(lob)
    lob.location = center + Vector(loc) * radius
    lob.rotation_euler = (center - lob.location).to_track_quat("-Z", "Y").to_euler()

world = bpy.data.worlds.new("w"); scene.world = world
if bpy.app.version < (5, 0, 0):
    world.use_nodes = True  # deprecated in 5.x (always node-based), removed in 6.0
world.node_tree.nodes["Background"].inputs[0].default_value = (0.35, 0.35, 0.37, 1)
world.node_tree.nodes["Background"].inputs[1].default_value = 0.6

for engine in ("BLENDER_EEVEE_NEXT", "BLENDER_EEVEE", "CYCLES"):
    try:
        scene.render.engine = engine
        break
    except TypeError:
        continue
scene.render.resolution_x = scene.render.resolution_y = 768
scene.render.filepath = png
bpy.ops.render.render(write_still=True)
info["preview"] = png
info["engine"] = scene.render.engine

print("INSPECT_JSON=" + json.dumps(info))

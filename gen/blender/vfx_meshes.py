"""Generate the kit's VFX mesh set: simple open shapes with clean UVs for mesh-particle effects (slashes, swirls,
tornadoes, flames, shockwaves, shields). The look comes from M_VFX_Master panning and eroding noise across the UVs.

  blender -b --factory-startup --python gen/blender/vfx_meshes.py -- <outDir> [--segments 48]

Every mesh is 1 m across (= 100 cm in Unreal; scale it in Niagara), pivot at the base centre, U runs around/along the
shape (0..1, seam duplicated so panning U loops), V runs up/outward (0..1). Smooth shading, triangulated on export.
  SM_VFX_Cone      open cone, wide base (r 0.5) to narrow top (r 0.05), height 1: flames, tornado core, beams
  SM_VFX_Tornado   open funnel, narrow base (r 0.1) to wide top (r 0.5), height 1: tornadoes, swirls, auras
  SM_VFX_Cylinder  open tube r 0.5, height 1: pillars, beams, rising rings
  SM_VFX_Dome      half sphere r 0.5: shockwave domes, shields, bursts
  SM_VFX_Ring      flat annulus, inner r 0.35, outer 0.5 (XY plane): ground shockwaves, impact rings
  SM_VFX_Arc       flat half annulus, inner r 0.3, outer 0.5, U along the arc: slashes, swipes
  SM_VFX_Plane     1 x 1 quad (XY plane, centred): ground glows, cards
Prints VFXMESH_JSON={...}.
"""
import bpy, bmesh, sys, os, json, math, argparse

argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
ap = argparse.ArgumentParser(prog="vfx_meshes.py")
ap.add_argument("out")
ap.add_argument("--segments", type=int, default=48)
a = ap.parse_args(argv)
os.makedirs(a.out, exist_ok=True)
SEG = max(8, a.segments)


def grid(name, rows, pos):
    """Builds a (SEG+1) x (rows+1) vertex grid. pos(u, v) -> (x, y, z) for u, v in 0..1; UV = (u, v)."""
    bpy.ops.wm.read_factory_settings(use_empty=True)
    me = bpy.data.meshes.new(name)
    bm = bmesh.new()
    verts = [[bm.verts.new(pos(i / SEG, j / rows)) for i in range(SEG + 1)] for j in range(rows + 1)]
    uv_layer = bm.loops.layers.uv.new("UVMap")
    for j in range(rows):
        for i in range(SEG):
            f = bm.faces.new((verts[j][i], verts[j][i + 1], verts[j + 1][i + 1], verts[j + 1][i]))
            for loop, (du, dv) in zip(f.loops, ((0, 0), (1, 0), (1, 1), (0, 1))):
                loop[uv_layer].uv = ((i + du) / SEG, (j + dv) / rows)
    bm.normal_update()
    bm.to_mesh(me)
    bm.free()
    for p in me.polygons:
        p.use_smooth = True
    ob = bpy.data.objects.new(name, me)
    bpy.context.scene.collection.objects.link(ob)
    return ob


def ring_pos(r0, r1, z0, z1, sweep=2 * math.pi, start=0.0):
    def pos(u, v):
        ang = start + u * sweep
        r = r0 + (r1 - r0) * v
        return (r * math.cos(ang), r * math.sin(ang), z0 + (z1 - z0) * v)
    return pos


def dome_pos(u, v):
    ang, el = u * 2 * math.pi, v * math.pi / 2 * 0.98  # 0.98: no collapsed pole row (3 cm hole at the top)
    return (0.5 * math.cos(el) * math.cos(ang), 0.5 * math.cos(el) * math.sin(ang), 0.5 * math.sin(el))


SHAPES = {
    "SM_VFX_Cone": (8, ring_pos(0.5, 0.05, 0.0, 1.0)),
    "SM_VFX_Tornado": (12, ring_pos(0.1, 0.5, 0.0, 1.0)),
    "SM_VFX_Cylinder": (8, ring_pos(0.5, 0.5, 0.0, 1.0)),
    "SM_VFX_Dome": (12, dome_pos),
    "SM_VFX_Ring": (2, ring_pos(0.35, 0.5, 0.0, 0.0)),
    "SM_VFX_Arc": (2, ring_pos(0.3, 0.5, 0.0, 0.0, sweep=math.pi)),
    "SM_VFX_Plane": (1, lambda u, v: (u - 0.5, v - 0.5, 0.0)),
}

written = []
for name, (rows, pos) in SHAPES.items():
    ob = grid(name, rows, pos)
    dst = os.path.join(a.out, f"{name}.fbx")
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.export_scene.fbx(
        filepath=dst, use_selection=True, object_types={"MESH"},
        # Same settings as prep.py (tested against UE 5.8): 1 Blender metre = 100 cm.
        apply_unit_scale=True, apply_scale_options="FBX_SCALE_NONE", global_scale=1.0, bake_space_transform=True,
        mesh_smooth_type="FACE", use_tspace=False, use_triangles=True, add_leaf_bones=False,
    )
    written.append({"name": name, "file": dst, "tris": sum(len(p.vertices) - 2 for p in ob.data.polygons)})

print("VFXMESH_JSON=" + json.dumps({"out": a.out, "meshes": written}))

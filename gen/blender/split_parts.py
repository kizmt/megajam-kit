"""Split one generated mesh into separately movable parts (a lid, a door leaf, a lever, a wheel), each exported with
its pivot where it should turn or slide. Generators return one fused mesh; a part that moves needs its own mesh.

  blender -b --factory-startup --python gen/blender/split_parts.py -- <prepped.fbx> <outDir> <Name> --list
  blender -b --factory-startup --python gen/blender/split_parts.py -- <prepped.fbx> <outDir> <Name>
        --part "Lid:z>0.62:pivot=0,-0.25,0.62" [--part "Wheel:shell=3,4"] [--rest Body] [--min-tris 40]

Run on the prepped FBX (gen/blender/prep.py output: metres, pivot at the base centre, +Z up). Coordinates are in
that space, in metres.
  --list      print the mesh's size and its loose shells (connected pieces) with bounds, biggest first; no export.
              A shell that is already the part you want needs no cut: take it with shell=<index>.
  --part      "<PartName>:<selector>[:pivot=x,y,z]", applied in order to what is left of the mesh.
              selector  x>v, x<v, y>v, y<v, z>v, z<v   everything on that side of an axis plane (cut faces capped)
                        shell=i[,j...]                 whole loose shells by --list index
              pivot     where the part turns or slides (a hinge line, an axle centre). Default: the centre of the
                        part's bounds at its lowest point.
  --rest      name of what remains (default Body); its pivot stays at the original origin.
  --keep-bits a plane cut also slices anything that only dips across it (the bottom of a hanging ball), leaving a
              small capped sliver on the wrong side. By default a sliver (a shell touching the cut with under 5% of
              that side's main shell) goes back to the side it came from; this switch leaves it where the cut put it.
Writes <outDir>/SM_<Name>_<Part>.fbx for every part (same UVs and material slot as the source, so the prop's
material instance fits them all) and prints PARTS_JSON={...}: each part's pivot in metres and in Unreal centimetres
(`pivot_ue_cm`: the part's relative location under the prop's root, so the assembled prop looks unchanged).
"""
import bpy, bmesh, sys, os, json, argparse, re
from mathutils import Vector, Matrix

argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
ap = argparse.ArgumentParser(prog="split_parts.py")
ap.add_argument("src"); ap.add_argument("outdir"); ap.add_argument("name")
ap.add_argument("--list", action="store_true")
ap.add_argument("--part", action="append", default=[])
ap.add_argument("--rest", default="Body")
ap.add_argument("--min-tris", type=int, default=40)
ap.add_argument("--keep-bits", action="store_true")
a = ap.parse_args(argv)
src, outdir = os.path.abspath(a.src), os.path.abspath(a.outdir)

bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.fbx(filepath=src)
meshes = [o for o in bpy.context.scene.objects if o.type == "MESH"]
if not meshes: print("no mesh found"); sys.exit(1)
bpy.ops.object.select_all(action="DESELECT")
for o in meshes: o.select_set(True)
bpy.context.view_layer.objects.active = meshes[0]
if len(meshes) > 1: bpy.ops.object.join()
src_obj = bpy.context.view_layer.objects.active
mw = src_obj.matrix_world.copy(); src_obj.parent = None; src_obj.matrix_world = mw
bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)
materials = list(src_obj.data.materials)
r3 = lambda v: [round(c, 4) for c in v]


def bounds(verts):
    cs = [v.co for v in verts]
    return (Vector((min(c.x for c in cs), min(c.y for c in cs), min(c.z for c in cs))),
            Vector((max(c.x for c in cs), max(c.y for c in cs), max(c.z for c in cs))))


def shells(bm):
    """Loose shells as lists of faces, biggest first."""
    seen, out = set(), []
    for f in bm.faces:
        if f.index in seen: continue
        stack, comp = [f], []
        seen.add(f.index)
        while stack:
            g = stack.pop(); comp.append(g)
            for e in g.edges:
                for h in e.link_faces:
                    if h.index not in seen:
                        seen.add(h.index); stack.append(h)
        out.append(comp)
    out.sort(key=len, reverse=True)
    return out


def tris(faces):
    return sum(len(f.verts) - 2 for f in faces)


def load():
    bm = bmesh.new(); bm.from_mesh(src_obj.data)
    bm.faces.ensure_lookup_table(); bm.faces.index_update()
    return bm


if a.list:
    bm = load()
    lo, hi = bounds(bm.verts)
    rows = []
    for i, comp in enumerate(shells(bm)):
        if tris(comp) < a.min_tris: continue
        l, h = bounds({v for f in comp for v in f.verts})
        rows.append({"shell": i, "tris": tris(comp), "min": r3(l), "max": r3(h)})
    print("PARTS_JSON=" + json.dumps({"mode": "list", "min": r3(lo), "max": r3(hi), "tris": tris(bm.faces),
                                      "shells": rows[:40], "shells_total": len(rows)}))
    sys.exit(0)

if not a.part: print("nothing to do: pass --list or at least one --part"); sys.exit(2)

AX = {"x": 0, "y": 1, "z": 2}


def parse_part(spec):
    bits = spec.split(":")
    if len(bits) < 2: raise SystemExit(f"bad --part {spec!r}: want Name:selector[:pivot=x,y,z]")
    name, sel = bits[0], bits[1]
    pivot = None
    for extra in bits[2:]:
        if not extra.startswith("pivot="): raise SystemExit(f"bad --part option {extra!r}")
        pivot = Vector([float(c) for c in extra[6:].split(",")])
    m = re.fullmatch(r"([xyz])([<>])(-?[\d.]+)", sel)
    if m: return name, ("plane", AX[m[1]], m[2], float(m[3])), pivot
    m = re.fullmatch(r"shell=([\d,]+)", sel)
    if m: return name, ("shell", [int(i) for i in m[1].split(",")]), pivot
    raise SystemExit(f"bad selector {sel!r} in --part {spec!r}")


def cap(bm, cut_edges):
    """Close the cut with faces, giving each new corner the UV its vertex already has (one flat texel area)."""
    uv = bm.loops.layers.uv.active
    before = set(bm.faces)
    try:
        bmesh.ops.triangle_fill(bm, use_beauty=True, use_dissolve=False, edges=cut_edges)
    except Exception as e:
        print(f"cap failed: {e}")
        return 0
    new = [f for f in bm.faces if f not in before]
    if uv:
        for f in new:
            for l in f.loops:
                other = next((k for k in l.vert.link_loops if k.face not in new), None)
                if other: l[uv].uv = other[uv].uv
    if new and before:
        mi = next(iter(before)).material_index
        for f in new: f.material_index = mi
    return len(new)


def half(bm_src, axis, side, value, keep_selected):
    """A copy of bm_src cut at the plane; keep_selected=True keeps the selector's side."""
    bm = bm_src.copy()
    no = Vector((0, 0, 0)); no[axis] = 1.0
    co = Vector((0, 0, 0)); co[axis] = value
    positive = (side == ">") == keep_selected          # keep the +axis side?
    geom = bm.verts[:] + bm.edges[:] + bm.faces[:]
    res = bmesh.ops.bisect_plane(bm, geom=geom, dist=1e-6, plane_co=co, plane_no=no,
                                 clear_inner=positive, clear_outer=not positive)
    cut_edges = [e for e in res["geom_cut"] if isinstance(e, bmesh.types.BMEdge)]
    capped = cap(bm, cut_edges) if cut_edges else 0
    return bm, capped


def take_shells(bm_src, indices):
    bm_part, bm_rest = bm_src.copy(), bm_src.copy()
    for bm, keep in ((bm_part, True), (bm_rest, False)):
        bm.faces.ensure_lookup_table(); bm.faces.index_update()
        comps = shells(bm)
        for i in indices:
            if i >= len(comps): raise SystemExit(f"shell {i} does not exist ({len(comps)} shells)")
        chosen = {f for i in indices for f in comps[i]}
        drop = [f for f in bm.faces if (f in chosen) != keep]
        bmesh.ops.delete(bm, geom=drop, context="FACES")
    return bm_part, bm_rest


def find_slivers(bm, axis, value):
    """Face indices of bm's small shells that touch the cut plane, and how many shells that is."""
    bm.faces.ensure_lookup_table(); bm.faces.index_update()
    comps = shells(bm)
    if len(comps) < 2: return set(), 0
    limit = 0.05 * tris(comps[0])
    found = [c for c in comps[1:] if tris(c) < limit
             and any(abs(v.co[axis] - value) < 1e-4 for f in c for v in f.verts)]
    return {f.index for c in found for f in c}, len(found)


def move_faces(src, dst, idx):
    """Move the faces with these indices from src into dst (indices as found before any move)."""
    if not idx: return
    src.faces.ensure_lookup_table(); src.faces.index_update()
    dup = src.copy(); dup.faces.ensure_lookup_table(); dup.faces.index_update()
    bmesh.ops.delete(dup, geom=[f for f in dup.faces if f.index not in idx], context="FACES")
    tmp = bpy.data.meshes.new("sliver"); dup.to_mesh(tmp); dup.free()
    bmesh.ops.delete(src, geom=[f for f in src.faces if f.index in idx], context="FACES")
    dst.from_mesh(tmp); bpy.data.meshes.remove(tmp)


def export(bm, part_name, pivot):
    """Write the part with its pivot at the origin. Returns the info row, or None for an empty part."""
    if not bm.faces: return None
    lo, hi = bounds(bm.verts)
    if pivot is None: pivot = Vector(((lo.x + hi.x) / 2, (lo.y + hi.y) / 2, lo.z))
    me = bpy.data.meshes.new(f"SM_{a.name}_{part_name}")
    bm.to_mesh(me)
    me.transform(Matrix.Translation(-pivot))
    for m in materials: me.materials.append(m)
    ob = bpy.data.objects.new(me.name, me)
    bpy.context.scene.collection.objects.link(ob)
    bpy.ops.object.select_all(action="DESELECT")
    ob.select_set(True); bpy.context.view_layer.objects.active = ob
    path = os.path.join(outdir, f"SM_{a.name}_{part_name}.fbx")
    bpy.ops.export_scene.fbx(
        filepath=path, use_selection=True, object_types={"MESH"},
        apply_unit_scale=True, apply_scale_options="FBX_SCALE_NONE", global_scale=1.0, bake_space_transform=True,
        mesh_smooth_type="FACE", use_tspace=True, add_leaf_bones=False, path_mode="AUTO", embed_textures=False,
    )
    me.calc_loop_triangles()
    return {"name": part_name, "file": path, "tris": len(me.loop_triangles),
            "pivot_m": r3(pivot), "pivot_ue_cm": [round(pivot.x * 100, 2), round(-pivot.y * 100, 2), round(pivot.z * 100, 2)],
            "size_m": r3(hi - lo)}


os.makedirs(outdir, exist_ok=True)
rest = load()
parts, caps = [], {}
for spec in a.part:
    pname, sel, pivot = parse_part(spec)
    if sel[0] == "plane":
        _, axis, side, value = sel
        part_bm, c1 = half(rest, axis, side, value, True)
        new_rest, c2 = half(rest, axis, side, value, False)
        caps[pname] = c1
        slivers = 0
        if not a.keep_bits:
            # Find on both sides first: a sliver that has just arrived would otherwise be found and sent back.
            from_rest, n1 = find_slivers(new_rest, axis, value)
            from_part, n2 = find_slivers(part_bm, axis, value)
            move_faces(new_rest, part_bm, from_rest)
            # part_bm's own faces keep their indices (from_mesh appends), so from_part is still valid.
            move_faces(part_bm, new_rest, from_part)
            slivers = n1 + n2
        if pivot is None and part_bm.faces:
            lo, hi = bounds(part_bm.verts)
            pivot = Vector(((lo.x + hi.x) / 2, (lo.y + hi.y) / 2, lo.z))
    else:
        part_bm, new_rest = take_shells(rest, sel[1])
    row = export(part_bm, pname, pivot)
    if row is None: raise SystemExit(f"part {pname}: the selector matched nothing")
    if pname in caps: row["cap_faces"] = caps[pname]; row["slivers_moved"] = slivers
    parts.append(row)
    part_bm.free(); rest.free(); rest = new_rest

row = export(rest, a.rest, Vector((0, 0, 0)))
if row: parts.append(row)
print("PARTS_JSON=" + json.dumps({"mode": "split", "name": a.name, "parts": parts, "blender": bpy.app.version_string}))

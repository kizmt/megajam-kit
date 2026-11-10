"""Split one generated mesh into separately movable parts (a lid, a door leaf, a lever, a wheel), each exported with
its pivot where it should turn or slide. Generators return one fused mesh; a part that moves needs its own mesh.

  blender -b --factory-startup --python gen/blender/split_parts.py -- <prepped.fbx> <outDir> <Name> --list
        [--part ...] [--slabs z:12]
  blender -b --factory-startup --python gen/blender/split_parts.py -- <prepped.fbx> <outDir> <Name>
        --part "Lid:z>0.62:pivot=0,-0.25,0.62" [--part "Wheel:shell=3,4"] [--rest Body] [--min-tris 40]

Run on the prepped FBX (gen/blender/prep.py output: metres, pivot at the base centre, +Z up). Coordinates are in
that space, in metres.
  --list      print the mesh's size and its loose shells (connected pieces) with bounds, biggest first; no export.
              A shell that is already the part you want needs no cut: take it with shell=<index>.
              With --part: the same for what is LEFT after those cuts (shell indices change with every cut, so
              this is how to read the index for a later shell= selector).
  --slabs     with --list: "<axis>[:n]" also prints n (default 10) equal slabs along that axis with the bounds of
              the geometry inside each. Where a slab's bounds narrow or jump is where one piece ends and the next
              begins: read the cut values from it.
  --part      "<PartName>:<selector>[:pivot=x,y,z]", applied in order to what is left of the mesh.
              selector  x>v, x<v, y>v, y<v, z>v, z<v   everything on that side of an axis plane (cut faces capped)
                        a&b[&c]                        only what is on the selected side of EVERY plane
                                                       ("x>0.33&z>4.31": in front of the post AND above the wheel)
                        shell=i[,j...]                 whole loose shells by --list index
              pivot     where the part turns or slides (a hinge line, an axle centre). Default: the centre of the
                        part's bounds at its lowest point.
              The same PartName given again adds to that part (one mesh, one pivot: the first one given), so a
              part can be several cuts joined.
  --rest      name of what remains (default Body); its pivot stays at the original origin.
  --keep-bits a plane cut also slices anything that only dips across it (the bottom of a hanging ball), leaving a
              small capped sliver on the wrong side. By default a sliver (a shell touching the cut with under 5% of
              that side's main shell) goes back to the side it came from; this switch leaves it where the cut put it.
  --sliver    that 5% as a fraction (default 0.05). A shell just over the limit stays where the cut put it and is
              printed as "bits_left" with its size and bounds: raise --sliver, or take it with a later cut.
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
ap.add_argument("--sliver", type=float, default=0.05)
ap.add_argument("--slabs")
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


if not a.part and not a.list: print("nothing to do: pass --list or at least one --part"); sys.exit(2)

AX = {"x": 0, "y": 1, "z": 2}


def parse_part(spec):
    bits = spec.split(":")
    if len(bits) < 2: raise SystemExit(f"bad --part {spec!r}: want Name:selector[:pivot=x,y,z]")
    name, sel = bits[0], bits[1]
    pivot = None
    for extra in bits[2:]:
        if not extra.startswith("pivot="): raise SystemExit(f"bad --part option {extra!r}")
        pivot = Vector([float(c) for c in extra[6:].split(",")])
    planes = [re.fullmatch(r"([xyz])([<>])(-?[\d.]+)", t.strip()) for t in sel.split("&")]
    if all(planes): return name, ("planes", [(AX[m[1]], m[2], float(m[3])) for m in planes]), pivot
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
    """Face indices of bm's small shells that touch the cut plane, how many shells that is, and the shells that
    touch the cut but are over the limit (up to 5x it): left where they are, reported so the reader can decide."""
    bm.faces.ensure_lookup_table(); bm.faces.index_update()
    comps = shells(bm)
    if len(comps) < 2: return set(), 0, []
    limit = a.sliver * tris(comps[0])
    touching = [c for c in comps[1:] if any(abs(v.co[axis] - value) < 1e-4 for f in c for v in f.verts)]
    found = [c for c in touching if tris(c) < limit]
    left = []
    for c in touching:
        if limit <= tris(c) < 5 * limit:
            l, h = bounds({v for f in c for v in f.verts})
            left.append({"tris": tris(c), "limit": round(limit, 1), "min": r3(l), "max": r3(h)})
    return {f.index for c in found for f in c}, len(found), left


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


def join_into(dst, src):
    """Append src's geometry to dst (both bmesh)."""
    tmp = bpy.data.meshes.new("join"); src.to_mesh(tmp); dst.from_mesh(tmp); bpy.data.meshes.remove(tmp)


def cut_planes(rest, planes):
    """The part on the selected side of every plane, and everything else. One plane at a time: what a plane cuts
    away goes to the rest at once, slivers swap sides at that plane, and the next plane cuts what was kept."""
    current, away, capped, slivers, left = rest.copy(), bmesh.new(), 0, 0, []
    for axis, side, value in planes:
        keep, c1 = half(current, axis, side, value, True)
        gone, _ = half(current, axis, side, value, False)
        capped = c1
        if not a.keep_bits:
            # Find on both sides first: a sliver that has just arrived would otherwise be found and sent back.
            from_gone, n1, l1 = find_slivers(gone, axis, value)
            from_keep, n2, l2 = find_slivers(keep, axis, value)
            move_faces(gone, keep, from_gone)
            # keep's own faces keep their indices (from_mesh appends), so from_keep is still valid.
            move_faces(keep, gone, from_keep)
            slivers += n1 + n2
            left += [dict(b, side="rest") for b in l1] + [dict(b, side="part") for b in l2]
        join_into(away, gone); gone.free(); current.free(); current = keep
    return current, away, capped, slivers, left


os.makedirs(outdir, exist_ok=True)
rest = load()
order, built = [], {}          # part name -> {"bm", "pivot", "cap", "slivers", "left"}
for spec in a.part:
    pname, sel, pivot = parse_part(spec)
    info = {"cap": None, "slivers": 0, "left": []}
    if sel[0] == "planes":
        part_bm, new_rest, info["cap"], info["slivers"], info["left"] = cut_planes(rest, sel[1])
    else:
        part_bm, new_rest = take_shells(rest, sel[1])
    if not part_bm.faces: raise SystemExit(f"part {pname}: the selector {spec.split(':')[1]!r} matched nothing")
    if pname in built:
        b = built[pname]
        join_into(b["bm"], part_bm); part_bm.free()
        if info["cap"] is not None: b["cap"] = (b["cap"] or 0) + info["cap"]
        b["slivers"] += info["slivers"]; b["left"] += info["left"]; b["cuts"] += 1
        if b["pivot"] is None: b["pivot"] = pivot
    else:
        built[pname] = dict(info, bm=part_bm, pivot=pivot, cuts=1); order.append(pname)
    rest.free(); rest = new_rest

if a.list:
    rest.faces.ensure_lookup_table(); rest.faces.index_update()
    out = {"mode": "list", "after_parts": order, "tris": tris(rest.faces), "shells": [], "shells_total": 0}
    if rest.faces:
        lo, hi = bounds(rest.verts)
        rows = []
        for i, comp in enumerate(shells(rest)):
            if tris(comp) < a.min_tris: continue
            l, h = bounds({v for f in comp for v in f.verts})
            rows.append({"shell": i, "tris": tris(comp), "min": r3(l), "max": r3(h)})
        out.update({"min": r3(lo), "max": r3(hi), "shells": rows[:40], "shells_total": len(rows)})
        if a.slabs:
            m = re.fullmatch(r"([xyz])(?::(\d+))?", a.slabs)
            if not m: raise SystemExit(f"bad --slabs {a.slabs!r}: want x, y or z, optionally :n")
            ax, n = AX[m[1]], max(2, min(60, int(m[2] or 10)))
            step = (hi[ax] - lo[ax]) / n or 1.0
            slabs = []
            for k in range(n):
                s0, s1 = lo[ax] + k * step, lo[ax] + (k + 1) * step
                # Faces, not vertices: a long face crossing a slab with no vertex in it still counts.
                fs = [f for f in rest.faces if min(v.co[ax] for v in f.verts) < s1 and max(v.co[ax] for v in f.verts) >= s0]
                if not fs: slabs.append({"from": round(s0, 4), "to": round(s1, 4), "tris": 0}); continue
                l, h = bounds({v for f in fs for v in f.verts})
                l[ax], h[ax] = max(l[ax], s0), min(h[ax], s1)
                slabs.append({"from": round(s0, 4), "to": round(s1, 4), "tris": tris(fs), "min": r3(l), "max": r3(h)})
            out["slabs"] = {"axis": m[1], "rows": slabs}
    print("PARTS_JSON=" + json.dumps(out))
    sys.exit(0)

parts = []
for pname in order:
    b = built[pname]
    row = export(b["bm"], pname, b["pivot"])
    if b["cap"] is not None: row["cap_faces"] = b["cap"]; row["slivers_moved"] = b["slivers"]
    if b["left"]: row["bits_left"] = b["left"]
    if b["cuts"] > 1: row["cuts_joined"] = b["cuts"]
    parts.append(row)

row = export(rest, a.rest, Vector((0, 0, 0)))
if row: parts.append(row)
print("PARTS_JSON=" + json.dumps({"mode": "split", "name": a.name, "parts": parts, "blender": bpy.app.version_string}))

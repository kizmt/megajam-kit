# Compare two rigged FBX meshes in rest pose, typically a generated rig and a hand-fixed copy: counts, UV layers,
# corner normals matched by position, and how sharply skin weights change across edges. Abrupt weight steps crease
# the surface when bones move: after any scripted weight edit, edges_step_gt_0.5 should stay close to the original's
# (smooth the weights if not; docs/ue/characters.md).
#   blender -b --factory-startup --python gen/blender/mesh_compare.py -- <a.fbx> <b.fbx> <out.json>
import json
import sys

import bpy
from mathutils import kdtree

a_path, b_path, out = sys.argv[sys.argv.index("--") + 1:][:3]


def load(path):
    bpy.ops.wm.read_factory_settings(use_empty=True)
    bpy.ops.import_scene.fbx(filepath=path)
    ob = max((o for o in bpy.data.objects if o.type == "MESH"), key=lambda o: len(o.data.vertices))
    me = ob.data
    names = [g.name for g in ob.vertex_groups]
    weights = [{names[g.group]: g.weight for g in v.groups if g.weight > 0} for v in me.vertices]
    corner = {}  # vertex index -> list of corner normals
    for lp in me.loops:
        corner.setdefault(lp.vertex_index, []).append(tuple(lp.normal))
    steps = []
    for e in me.edges:
        w0, w1 = weights[e.vertices[0]], weights[e.vertices[1]]
        steps.append(max(abs(w0.get(k, 0) - w1.get(k, 0)) for k in set(w0) | set(w1)) if (w0 or w1) else 0)
    return {
        "path": path, "verts": len(me.vertices), "polys": len(me.polygons), "loops": len(me.loops),
        "uv_layers": [u.name for u in me.uv_layers], "has_custom_normals": me.has_custom_normals,
        "sharp_edges": sum(1 for e in me.edges if getattr(e, "use_edge_sharp", False)),
        "pos": [tuple(v.co) for v in me.vertices], "corner": corner, "steps": steps,
        "z": (min(v.co.z for v in me.vertices), max(v.co.z for v in me.vertices)),
    }


A, B = load(a_path), load(b_path)
# match B vertices to A by position (B's bones moved, the mesh did not)
kd = kdtree.KDTree(len(A["pos"]))
for i, p in enumerate(A["pos"]):
    kd.insert(p, i)
kd.balance()
dev, far = [], 0
for i, p in enumerate(B["pos"]):
    _, j, d = kd.find(p)
    if d > 1e-4 * (A["z"][1] - A["z"][0]):
        far += 1
        continue
    na, nb = A["corner"].get(j, []), B["corner"].get(i, [])
    if na and nb:
        avg = lambda ns: [sum(c[k] for c in ns) / len(ns) for k in range(3)]
        x, y = avg(na), avg(nb)
        dev.append(1 - sum(x[k] * y[k] for k in range(3)) / ((sum(t * t for t in x) * sum(t * t for t in y)) ** 0.5 or 1))
dev.sort()
pct = lambda v, q: v[min(len(v) - 1, int(q * len(v)))] if v else None
res = {}
for tag, M in (("a", A), ("b", B)):
    s = sorted(M["steps"])
    res[tag] = {k: M[k] for k in ("path", "verts", "polys", "loops", "uv_layers", "has_custom_normals", "sharp_edges")}
    res[tag]["weight_step_p50_p99_max"] = [round(pct(s, 0.5), 3), round(pct(s, 0.99), 3), round(s[-1], 3)]
    res[tag]["edges_step_gt_0.5"] = sum(1 for x in s if x > 0.5)
res["unmatched_b_verts"] = far
res["normal_dev_1-cos_p50_p99_max"] = [round(pct(dev, 0.5), 5), round(pct(dev, 0.99), 5), round(dev[-1], 5)] if dev else None
json.dump(res, open(out, "w"), indent=1)
print("MESH_COMPARE", json.dumps(res))

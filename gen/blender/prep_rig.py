# Armature-safe prep for a rigged character FBX (Tripo `anim rig` output) before Unreal import.
#   blender -b --factory-startup --python gen/blender/prep_rig.py -- in.fbx out.fbx [--height 1.8] [--rot -90]
# Scales to real height and rotates about Z, then APPLIES both into the armature and mesh, so the root
# bone ends up with scale 1. (Unreal's FBX import scale lands on the root bone instead, and every
# retargeted animation then collapses or explodes: see PIPELINE.md "Hard-won facts".)
# --rot is Blender degrees about Z; -90 turns most Tripo output (faces +X in Unreal) to face +Y like Manny; some rigs
# face the other way (need 90): the result's "facing" says which, with the --rot to use.
# Prints PREP_RIG_JSON=... with the result.
import bpy, sys, json, math
from mathutils import Vector

argv = sys.argv[sys.argv.index("--") + 1:]
src, dst = argv[0], argv[1]
opts = {argv[i].lstrip("-"): argv[i + 1] for i in range(2, len(argv) - 1, 2)}
height = float(opts.get("height", "1.8"))
rot = float(opts.get("rot", "-90"))
# Export variant. Only "cm" is retarget-safe (tested 2026-10-24 with check_skeletal.py): "none" puts x100 on the
# root bone, "all"/"units" import at 1/100 size. Others kept for re-testing on future Blender/UE versions.
mode = opts.get("mode", "cm")

bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.fbx(filepath=src)
arm = next(o for o in bpy.data.objects if o.type == "ARMATURE")
meshes = [o for o in bpy.data.objects if o.type == "MESH"]


def bbox(objs):
    pts = [o.matrix_world @ Vector(c) for o in objs for c in o.bound_box]
    return [min(p[i] for p in pts) for i in range(3)], [max(p[i] for p in pts) for i in range(3)]


bpy.context.view_layer.update()
mn, mx = bbox(meshes)
factor = height / (mx[2] - mn[2])
arm.scale = [s * factor for s in arm.scale]
arm.rotation_euler[2] += math.radians(rot)
bpy.context.view_layer.update()

bpy.ops.object.select_all(action="DESELECT")
for o in [arm] + meshes:
    o.select_set(True)
bpy.context.view_layer.objects.active = arm
bpy.ops.object.transform_apply(location=False, rotation=True, scale=True)
bpy.context.view_layer.update()

# Facing check (Manny convention, measured 2026-11-09 on two Tripo rigs): after the rotation, the left toe
# (ball_l) must sit at a lower Blender Y than the left foot (the mesh faces UE +Y) and the left foot on +X. A Tripo
# rig that faces the other way gets a hero that runs backward while every import check passes (rehearsal note).
# Measured on the applied armature; "suggest_rot" is the --rot that would face it forward.
def facing():
    bones = arm.data.bones
    fl, bl = bones.get("foot_l"), bones.get("ball_l")
    if not fl or not bl:
        return {"ok": None, "why": "no foot_l/ball_l bones (not the unreal rig spec)"}
    f, t = arm.matrix_world @ fl.head_local, arm.matrix_world @ bl.head_local
    d = t - f
    fwd = -d.y          # toe direction along UE +Y (Blender -Y)
    side = d.x          # toe direction sideways
    if abs(side) > abs(fwd):
        turn = -90.0 if side > 0 else 90.0   # toes along +X need -90 to point at -Y (UE +Y); along -X, +90
    else:
        turn = 0.0 if fwd > 0 else 180.0
    out = {"toe_forward_m": round(fwd, 4), "toe_side_m": round(side, 4), "left_foot_x_m": round(f.x, 4)}
    if turn == 0.0 and f.x <= 0:
        # Toes forward but the left foot on the right: a mirrored rig. No rotation fixes that.
        return {"ok": False, "why": "mirrored (left foot on -X with the toes forward): no --rot fixes it", **out}
    sug = ((rot + turn + 180.0) % 360.0) - 180.0
    return {"ok": turn == 0.0, **out, "suggest_rot": int(round(sug))}


mn, mx = bbox(meshes)
result = {
    "armature": arm.name, "bones": len(arm.data.bones), "scale_factor": round(factor, 4),
    "armature_scale": [round(v, 4) for v in arm.scale], "size_m": [round(mx[i] - mn[i], 3) for i in range(3)],
    "min_z": round(mn[2], 4), "out": dst, "rot": rot, "facing": facing(),
}
if mode == "cm":
    # work in centimetres: unit scale 0.01, objects x100 applied, so FBX carries no unit conversion
    bpy.context.scene.unit_settings.scale_length = 0.01
    arm.scale = (100.0, 100.0, 100.0)
    bpy.context.view_layer.update()
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
# No textures in the export. Tripo's rig FBX keeps only the colour image and points its normal-map slot at that
# same image (verified 2026-10-24: colour used as normal = blotchy lighting in Unreal). The real PBR maps come
# from the textured model via gen/blender/extract_pbr.py and go onto MI_<Name> of the kit's master material.
# Removing the image nodes also ends the "texture name clash" import warning. The material slot stays (M_<Name>).
import os
stem = os.path.splitext(os.path.basename(dst))[0]
stem = stem[3:] if stem.startswith("SK_") else stem
for m in bpy.data.materials:
    if m.use_nodes:
        for n in [n for n in m.node_tree.nodes if n.type in ("TEX_IMAGE", "NORMAL_MAP", "SEPARATE_COLOR", "SEPARATE_RGB")]:
            m.node_tree.nodes.remove(n)
for img in list(bpy.data.images):
    bpy.data.images.remove(img)
result["textures"] = []
mats = [m for m in bpy.data.materials if m.users > 0]
for i, m in enumerate(mats):
    m.name = f"M_{stem}" if len(mats) == 1 else f"M_{stem}_{i + 1}"
result["materials"] = [m.name for m in mats]
scale_opt = {"none": "FBX_SCALE_NONE", "all": "FBX_SCALE_ALL", "units": "FBX_SCALE_UNITS", "cm": "FBX_SCALE_NONE"}[mode]
result["mode"] = mode
bpy.ops.export_scene.fbx(
    filepath=dst, use_selection=False, object_types={"ARMATURE", "MESH"},
    apply_unit_scale=True, apply_scale_options=scale_opt, global_scale=1.0,
    bake_space_transform=False, add_leaf_bones=False, armature_nodetype="NULL",
    bake_anim=False, mesh_smooth_type="FACE", path_mode="AUTO", embed_textures=False,
)
print("PREP_RIG_JSON=" + json.dumps(result))

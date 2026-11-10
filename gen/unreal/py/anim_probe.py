# Where bones are through an Animation Sequence (component space, cm): the height a hand reaches, how far the root
# travels. For judging a generated clip by numbers before judging it by eye (a "knock on the drum at the hip" that
# peaked at head height read as a salute: rehearsal 2026-11-11). Run via gen/unreal/kimodo.ts --probe. ARGS:
#   anim    the AnimSequence, /Game/.../A_Name
#   bones   comma-separated bone names; matched exactly, then case-insensitively, then as a part of a name
#           (hand_r also finds RightHand through the aliases below). The root bone is always added.
#   step    seconds between samples (default 0.2)
# Prints PROBE_JSON={"anim","length","bones":{name:{"min":[x,y,z],"max":[x,y,z],"samples":[[t,x,y,z],...]}},"missing":[...]}
import json
import unreal

anim_path = ARGS["anim"]
want = [b.strip() for b in ARGS.get("bones", "").split(",") if b.strip()]
step = max(0.02, float(ARGS.get("step", "0.2") or 0.2))
ALIASES = {"hand_r": ["r_hand", "righthand"], "hand_l": ["l_hand", "lefthand"], "foot_r": ["r_foot", "rightfoot"],
           "foot_l": ["l_foot", "leftfoot"], "head": ["head"], "pelvis": ["hips", "pelvis"]}

anim = unreal.EditorAssetLibrary.load_asset(anim_path)
if not isinstance(anim, unreal.AnimSequence):
    raise RuntimeError(f"{anim_path} is not an AnimSequence")
P = unreal.AnimPoseExtensions
opt = unreal.AnimPoseEvaluationOptions()
length = anim.get_play_length()
names = [str(n) for n in P.get_bone_names(P.get_anim_pose_at_time(anim, 0.0, opt))]
lower = {n.lower(): n for n in names}


def find(b):
    if b in names:
        return b
    for cand in [b.lower()] + ALIASES.get(b.lower(), []):
        if cand in lower:
            return lower[cand]
    hits = [n for n in names if b.lower() in n.lower()]
    return hits[0] if len(hits) == 1 else None


bones, missing = [], []
for b in want:
    n = find(b)
    (bones if n else missing).append(n or b)
if names and names[0] not in bones:
    bones.append(names[0])

out = {n: {"samples": []} for n in bones}
count = int(length / step + 1e-6) + 1
times = [min(i * step, length) for i in range(count)]
if times[-1] < length - 1e-3:
    times.append(length)
for t in times:
    pose = P.get_anim_pose_at_time(anim, t, opt)
    for n in bones:
        v = P.get_bone_pose(pose, n, unreal.AnimPoseSpaces.WORLD).translation
        out[n]["samples"].append([round(t, 3), round(v.x, 1), round(v.y, 1), round(v.z, 1)])
for n in bones:
    s = out[n]["samples"]
    out[n]["min"] = [min(r[i] for r in s) for i in (1, 2, 3)]
    out[n]["max"] = [max(r[i] for r in s) for i in (1, 2, 3)]
print("PROBE_JSON=" + json.dumps({"anim": anim_path, "length": round(length, 3), "bones": out, "missing": missing,
                                  "all_bones": names if missing else []}))

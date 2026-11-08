# -game helper for gen/test/stability.ps1: temporal-stability bursts (shimmer, boiling, crawling edges: what a
# critic judging stills can't see). For each variant (console commands, optional volumetric-cloud overrides) and each
# camera-set camera: apply the variant, settle N frames, save K consecutive frames with `shot`; with "pan" also turn
# the camera slowly and save K frames while it moves; with "move", moving vs converged frames at the same pose.
# stability.ps1 turns the bursts into numbers and heat maps. Cloud overrides use a dynamic material instance: no
# asset changes. Real motion is not instability: actors tagged "StabilityFreeze" stop ticking and the player pawn is
# frozen (custom time dilation 0) unless KIT_FREEZE=0.
# Env: KIT_CAP_DIR, KIT_PREFIX, KIT_CAMS (comma list, empty = all), KIT_SETTLE, KIT_BURST, KIT_FREEZE,
#      KIT_VARIANTS = JSON list of {"name": str, "cmds": [...], "cloud": {"view": f, "shadow": f,
#      "params": {param: value}}, "pan": yaw degrees per frame, "move": yaw degrees per frame, "profile": bool}
# From a practice run's scratch script (2026-11-08); run with a fixed game clock (stability.ps1 -FixedFps).
import json
import os
import re

import unreal

OUT = os.environ.get("KIT_CAP_DIR", "")
PREFIX = os.environ.get("KIT_PREFIX", "st")
ONLY = [c for c in os.environ.get("KIT_CAMS", "").split(",") if c]
SETTLE = int(os.environ.get("KIT_SETTLE", "180"))
BURST = int(os.environ.get("KIT_BURST", "6"))
VARIANTS = json.loads(os.environ.get("KIT_VARIANTS", '[{"name": "base"}]'))
PAN_LEAD = 30   # frames of panning before the moving burst
SL = unreal.SystemLibrary
st = {"w": None, "pc": None, "gen": None, "handle": None, "done": False, "frame": 0}


def log(m):
    unreal.log("PROOF " + m)


def find():
    for pc in unreal.ObjectIterator(unreal.PlayerController):
        w = pc.get_world()
        if w and pc.get_controlled_pawn():
            return pc, w
    return None, None


def cam_name(a):
    for t in a.tags:
        s = str(t)
        if s.startswith("cam:"):
            return s[4:]
    return None


NOT_CVARS = ("r.SetRes", "ProfileGPU")   # commands: never "reset" them to a read-back value


def cvar_names():
    names = []
    for v in VARIANTS:
        for c in v.get("cmds", []):
            n = c.split()[0]
            if n not in names and n not in NOT_CVARS:
                names.append(n)
    return names


def fmt(x):
    return str(int(x)) if float(x).is_integer() else repr(float(x))


def shot(w, name):
    name = re.sub(r"[^\w-]", "_", name)   # variant and camera names: a space or comma would split the command
    path = os.path.join(OUT, name).replace("\\", "/")
    SL.execute_console_command(w, "shot filename=%s -nosuffix" % path)


def run():
    w, pc = st["w"], st["pc"]
    cams = []
    for a in unreal.GameplayStatics.get_all_actors_with_tag(w, "CamSet"):
        n = cam_name(a)
        if n and (not ONLY or n in ONLY):
            cams.append((n, a))
    cams.sort(key=lambda x: x[0])
    clouds = unreal.GameplayStatics.get_all_actors_of_class(w, unreal.VolumetricCloud)
    cc = clouds[0].get_component_by_class(unreal.VolumetricCloudComponent) if clouds else None
    base_mat = cc.get_editor_property("material") if cc else None
    base_view = cc.get_editor_property("view_sample_count_scale") if cc else 1.0
    base_shadow = cc.get_editor_property("shadow_view_sample_count_scale") if cc else 1.0
    defaults = {n: SL.get_console_variable_float_value(n) for n in cvar_names()}
    for n in ("r.AntiAliasingMethod", "r.ScreenPercentage", "r.VolumetricRenderTarget", "r.VolumetricRenderTarget.Mode",
              "r.VolumetricCloud.ViewRaySampleMaxCount", "r.TSR.History.ScreenPercentage",
              "r.DynamicGlobalIlluminationMethod", "r.ReflectionMethod"):
        log("cvar %s=%s" % (n, fmt(SL.get_console_variable_float_value(n))))
    log("stability cams=%s variants=%s settle=%d burst=%d cloud=%s view=%s shadow=%s" % (
        [n for n, _ in cams], [v["name"] for v in VARIANTS], SETTLE, BURST, bool(cc), base_view, base_shadow))
    if os.environ.get("KIT_FREEZE", "1") == "1":
        frozen = []
        for a in unreal.GameplayStatics.get_all_actors_with_tag(w, "StabilityFreeze"):
            a.set_actor_tick_enabled(False)
            frozen.append(a.get_name())
        pawn = pc.get_controlled_pawn()
        if pawn:
            pawn.set_editor_property("custom_time_dilation", 0.0)
            frozen.append(pawn.get_name())
        log("frozen %s" % frozen)
    yield
    for v in VARIANTS:
        for n, val in defaults.items():
            SL.execute_console_command(w, "%s %s" % (n, fmt(val)))
        for c in v.get("cmds", []):
            SL.execute_console_command(w, c)
        cl = v.get("cloud", {})
        if cc:
            cc.set_view_sample_count_scale(float(cl.get("view", base_view)))
            cc.set_shadow_view_sample_count_scale(float(cl.get("shadow", base_shadow)))
            if cl.get("params"):
                mid = unreal.MaterialLibrary.create_dynamic_material_instance(w, base_mat)   # UKismetMaterialLibrary
                for k, val in cl["params"].items():
                    mid.set_scalar_parameter_value(k, float(val))
                cc.set_material(mid)
            else:
                cc.set_material(base_mat)
        log("variant %s cmds=%s cloud=%s" % (v["name"], v.get("cmds", []), cl))
        for ci, (name, cam) in enumerate(cams):
            pc.set_view_target_with_blend(cam, 0.0)
            for _ in range(SETTLE):
                yield
            if v.get("profile") and ci == 0:   # one frame of GPU timings into the log (LogRHI tree)
                log("profile begin variant=%s cam=%s" % (v["name"], name))
                SL.execute_console_command(w, "ProfileGPU")
                for _ in range(10):
                    yield
                log("profile end variant=%s" % v["name"])
            for k in range(BURST):
                shot(w, "%s_%s_%s_s%d" % (PREFIX, v["name"], name, k))
                yield
            pan = float(v.get("pan", 0.0))
            if pan:
                r0 = cam.get_actor_rotation()
                for i in range(PAN_LEAD + BURST):
                    r = cam.get_actor_rotation()
                    cam.set_actor_rotation(unreal.Rotator(roll=r.roll, pitch=r.pitch, yaw=r.yaw + pan), False)
                    if i >= PAN_LEAD:
                        shot(w, "%s_%s_%s_p%d" % (PREFIX, v["name"], name, i - PAN_LEAD))
                    yield
                cam.set_actor_rotation(r0, False)
            mv = float(v.get("move", 0.0))
            if mv:   # moving frame vs the converged frame at the same pose = motion-only reconstruction error
                r0 = cam.get_actor_rotation()
                for k in range(2):
                    for i in range(20):
                        r = cam.get_actor_rotation()
                        cam.set_actor_rotation(unreal.Rotator(roll=r.roll, pitch=r.pitch, yaw=r.yaw + mv), False)
                        if i == 19:   # rotate and request in the same tick: the captured frame is still moving
                            shot(w, "%s_%s_%s_m%d" % (PREFIX, v["name"], name, k))
                        yield
                    for _ in range(90):
                        yield
                    shot(w, "%s_%s_%s_c%d" % (PREFIX, v["name"], name, k))
                    yield
                cam.set_actor_rotation(r0, False)
            for _ in range(4):
                yield
            log("burst done variant=%s cam=%s frame=%d" % (v["name"], name, st["frame"]))


def tick(dt):
    if st["done"]:
        return
    if st["w"] is None:
        pc, w = find()
        if not w:
            return
        st["pc"], st["w"] = pc, w
        SL.execute_console_command(w, "t.MaxFPS 60")
        st["gen"] = run()
        return
    st["frame"] += 1
    try:
        next(st["gen"])
    except StopIteration:
        st["done"] = True
        log("stability done frames=%d" % st["frame"])
        unreal.unregister_slate_post_tick_callback(st["handle"])
        SL.quit_game(st["w"], st["pc"], unreal.QuitPreference.QUIT, False)
    except Exception as e:  # never leave the game running on a script error
        st["done"] = True
        unreal.log_error("PROOF stability error %r" % e)
        unreal.unregister_slate_post_tick_callback(st["handle"])
        SL.quit_game(st["w"], st["pc"], unreal.QuitPreference.QUIT, False)


if OUT:
    os.makedirs(OUT, exist_ok=True)
st["handle"] = unreal.register_slate_post_tick_callback(tick)
log("stability_capture registered")

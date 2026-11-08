# -game helper for gen/test/camset.ps1: views the level through each camera of the fixed camera set (CameraActors
# tagged "CamSet" plus "cam:<Name>", art/camera-set.md), waits for the image to settle, saves one frame per camera
# with the engine's `shot` command, then quits. Editor viewport captures are small and show editor icons; these are
# the game's own frames, at the game's resolution and settings, for the critic and the before/after comparisons.
# Env (set by camset.ps1): KIT_CAP_DIR, KIT_PREFIX, KIT_SETTLE (frames per camera, default 120), KIT_CAMS (comma
# list of names; empty = all), KIT_EXEC (';'-separated console commands at start), KIT_MEASURE (1 = uncapped and log
# the mean frame time per camera; a rough number, the bench is gen/perf/bench.ts), KIT_SHOWUI (1 = include UI).
# From a practice run's scratch script (2026-11-08), used for every critic round there.
import os

import unreal

OUT = os.environ.get("KIT_CAP_DIR", "")
PREFIX = os.environ.get("KIT_PREFIX", "cap")
SETTLE = int(os.environ.get("KIT_SETTLE", "120"))
ONLY = [c for c in os.environ.get("KIT_CAMS", "").split(",") if c]
EXEC = [c.strip() for c in os.environ.get("KIT_EXEC", "").split(";") if c.strip()]
MEASURE = os.environ.get("KIT_MEASURE", "0") == "1"
SHOWUI = " showui" if os.environ.get("KIT_SHOWUI", "0") == "1" else ""
SL = unreal.SystemLibrary
st = {"frame": 0, "cams": None, "i": 0, "since": 0, "handle": None, "done": False, "pc": None, "w": None,
      "acc": 0.0, "n": 0}


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


def finish():
    st["done"] = True
    unreal.unregister_slate_post_tick_callback(st["handle"])
    SL.quit_game(st["w"], st["pc"], unreal.QuitPreference.QUIT, False)


def tick(dt):
    if st["done"]:
        return
    if st["w"] is None:
        pc, w = find()
        if not w:
            return
        st["pc"], st["w"] = pc, w
        SL.execute_console_command(w, "t.MaxFPS 0" if MEASURE else "t.MaxFPS 60")
        if MEASURE:
            SL.execute_console_command(w, "r.VSync 0")
        for c in EXEC:
            SL.execute_console_command(w, c)
            unreal.log("PROOF exec %s" % c)
        cams = []
        for a in unreal.GameplayStatics.get_all_actors_with_tag(w, "CamSet"):
            n = cam_name(a)
            if n and (not ONLY or n in ONLY):
                cams.append((n, a))
        cams.sort(key=lambda x: x[0])
        st["cams"] = cams
        unreal.log("PROOF camset cams=%s settle=%d" % ([n for n, _ in cams], SETTLE))
        if not cams:
            unreal.log_error("PROOF camset no cameras: tag CameraActors 'CamSet' and 'cam:<Name>'")
            finish()
            return
        pc.set_view_target_with_blend(cams[0][1], 0.0)
        return
    pc, w, cams = st["pc"], st["w"], st["cams"]
    st["frame"] += 1
    st["since"] += 1
    if 30 <= st["since"] < SETTLE:
        st["acc"] += dt
        st["n"] += 1
    if st["i"] < len(cams) and st["since"] == SETTLE:
        name = cams[st["i"]][0]
        path = os.path.join(OUT, "%s_%s" % (PREFIX, name)).replace("\\", "/")
        SL.execute_console_command(w, "shot filename=%s -nosuffix%s" % (path, SHOWUI))
        ms = 1000.0 * st["acc"] / max(st["n"], 1)
        unreal.log("PROOF shot cam=%s frame=%d mean_ms=%.2f fps=%.1f measured=%d" %
                   (name, st["frame"], ms, 1000.0 / max(ms, 0.001), 1 if MEASURE else 0))
        st["acc"], st["n"] = 0.0, 0
    if st["i"] < len(cams) and st["since"] >= SETTLE + 5:
        st["i"] += 1
        st["since"] = 0
        if st["i"] < len(cams):
            pc.set_view_target_with_blend(cams[st["i"]][1], 0.0)
    if st["i"] >= len(cams):
        unreal.log("PROOF camset done frames=%d cams=%d" % (st["frame"], len(cams)))
        finish()


if OUT:
    os.makedirs(OUT, exist_ok=True)
st["handle"] = unreal.register_slate_post_tick_callback(tick)
unreal.log("PROOF camset_capture registered")

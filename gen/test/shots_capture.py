# -game helper for gen/test/shots.ps1: renders a shot list frame by frame for the trailer and the page screenshots
# (docs/ue/cinematics-video.md D3b). The game runs on a fixed clock (-UseFixedTimeStep -FPS=N, set by shots.ps1), so
# every frame advances exactly 1/N s of game time however long the `shot` save takes: the frames play back smooth at
# N fps even on a slow machine. Saves <KIT_CAP_DIR>/<shot>/f_00000.png ...; shots.ps1 encodes them.
#
# The shot list (KIT_SHOTS = path to a JSON file) is a list of shots, in order:
#   {"name": "vista", "cam": "Vista", "seconds": 4}                    a camera-set camera, still
#   {"name": "push", "cam": "Hub", "from": [x, y, z, pitch, yaw], "to": [x, y, z, pitch, yaw], "seconds": 5}
#       the named camera actor is borrowed and moved from -> to (smoothstep), cm and degrees; "fov" optional
#   {"name": "play", "view": "player", "seconds": 6, "exec": ["MyGame.TestRoute 2"]}
#       the player's own camera; "exec" runs console commands at the shot's start (the game's test hooks: a route,
#       a staged moment). Python in -game can't spawn actors: cameras must be placed in the level (tag "CamSet" plus
#       "cam:<Name>").
# Optional per shot: "settle" (frames rendered but not saved before the shot, default KIT_SETTLE), "fov".
# Env: KIT_CAP_DIR, KIT_SHOTS, KIT_SETTLE (default 60), KIT_SHOWUI (1 = include UMG UI in frames).
import json
import os
import re

import unreal

OUT = os.environ.get("KIT_CAP_DIR", "")
SHOTS = json.load(open(os.environ["KIT_SHOTS"], encoding="utf-8-sig"))
SETTLE = int(os.environ.get("KIT_SETTLE", "60"))
SHOWUI = " -showui" if os.environ.get("KIT_SHOWUI", "0") == "1" else ""
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


def cams_by_name(w):
    out = {}
    for a in unreal.GameplayStatics.get_all_actors_with_tag(w, "CamSet"):
        for t in a.tags:
            s = str(t)
            if s.startswith("cam:"):
                out[s[4:]] = a
    return out


def place(cam, v):
    cam.set_actor_location_and_rotation(unreal.Vector(v[0], v[1], v[2]),
                                        unreal.Rotator(roll=0.0, pitch=v[3], yaw=v[4]), False, False)


def set_fov(cam, fov):
    cam.get_component_by_class(unreal.CameraComponent).set_field_of_view(float(fov))


def lerp(a, b, t):
    t = t * t * (3.0 - 2.0 * t)
    return [a[i] + (b[i] - a[i]) * t for i in range(5)]


def run():
    w, pc = st["w"], st["pc"]
    cams = cams_by_name(w)
    pawn_view = pc.get_view_target()
    # Each shot starts from the camera's placed transform and FOV: a moving shot leaves its camera at "to", and a
    # later shot of the same camera must not inherit that (or the FOV).
    home = {n: (a.get_actor_location(), a.get_actor_rotation(),
                a.get_component_by_class(unreal.CameraComponent).get_editor_property("field_of_view"))
            for n, a in cams.items()}
    log("shots %s cams=%s settle=%d" % ([s["name"] for s in SHOTS], sorted(cams), SETTLE))
    for s in SHOTS:
        name = s["name"]
        fps = 1.0 / max(unreal.GameplayStatics.get_world_delta_seconds(w), 1e-6)
        frames = max(1, int(round(float(s.get("seconds", 3)) * fps)))
        cam = None
        if s.get("view") == "player":
            pc.set_view_target_with_blend(pawn_view, 0.0)
        else:
            cam = cams.get(s.get("cam", ""))
            if cam is None:
                unreal.log_error("PROOF shot %s: no CamSet camera named %r" % (name, s.get("cam")))
                continue
            loc, rot, fov0 = home[s["cam"]]
            cam.set_actor_location_and_rotation(loc, rot, False, False)
            set_fov(cam, s.get("fov", fov0))
            if s.get("from"):
                place(cam, s["from"])
            pc.set_view_target_with_blend(cam, 0.0)
        for c in s.get("exec", []):
            SL.execute_console_command(w, c)
            log("exec %s" % c)
        for _ in range(int(s.get("settle", SETTLE))):
            yield
        folder = os.path.join(OUT, re.sub(r"[^\w-]", "_", name))
        os.makedirs(folder, exist_ok=True)
        for k in range(frames):
            if cam is not None and s.get("from") and s.get("to"):
                place(cam, lerp(s["from"], s["to"], k / max(frames - 1, 1)))
            path = os.path.join(folder, "f_%05d" % k).replace("\\", "/")
            SL.execute_console_command(w, "shot filename=%s -nosuffix%s" % (path, SHOWUI))
            yield
        for _ in range(3):   # the last request saves on a later frame
            yield
        log("shot done name=%s frames=%d fps=%.1f" % (name, frames, fps))
    for n, (loc, rot, fov0) in home.items():
        cams[n].set_actor_location_and_rotation(loc, rot, False, False)
        set_fov(cams[n], fov0)


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
        st["gen"] = run()
        return
    st["frame"] += 1
    try:
        next(st["gen"])
    except StopIteration:
        log("shots done frames=%d" % st["frame"])
        finish()
    except Exception as e:  # never leave the game running on a script error
        unreal.log_error("PROOF shots error %r" % e)
        finish()


if OUT:
    os.makedirs(OUT, exist_ok=True)
st["handle"] = unreal.register_slate_post_tick_callback(tick)
log("shots_capture registered")

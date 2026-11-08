# -game helper for gen/test/postkeys.ps1: caps the frame rate, saves every Nth frame as a PNG with the engine's
# `shot` command (no screen recorder, so nothing needs the foreground) and quits the game after a set time.
# Settings come from environment variables the caller sets (the game inherits them):
#   KIT_CAP_DIR (frames folder; empty = no frames), KIT_CAP_EVERY (default 15), KIT_QUIT_AFTER (seconds after the
#   player controller appears, default 25), KIT_MAX_FPS (default 60).
# From a practice run's scratch script (2026-11-08): `shot` frames don't include UMG UI; use `shot showui` for that.
import os
import time

import unreal

OUT = os.environ.get("KIT_CAP_DIR", "")
EVERY = int(os.environ.get("KIT_CAP_EVERY", "15"))
QUIT_AFTER = float(os.environ.get("KIT_QUIT_AFTER", "25"))
MAX_FPS = os.environ.get("KIT_MAX_FPS", "60")
SL = unreal.SystemLibrary
st = {"frame": 0, "shots": 0, "t0": None, "handle": None, "quit": False}


def find():
    for pc in unreal.ObjectIterator(unreal.PlayerController):
        w = pc.get_world()
        if w and pc.get_controlled_pawn():
            return pc, w
    return None, None


def tick(dt):
    pc, w = find()
    if not w:
        return
    if st["t0"] is None:
        st["t0"] = time.time()
        SL.execute_console_command(w, "t.MaxFPS %s" % MAX_FPS)
        unreal.log("PROOF capture start every=%d out=%s quit_after=%.1f" % (EVERY, OUT, QUIT_AFTER))
    st["frame"] += 1
    if OUT and EVERY > 0 and st["frame"] % EVERY == 0:
        path = os.path.join(OUT, "f_%05d" % st["shots"]).replace("\\", "/")
        SL.execute_console_command(w, "shot filename=%s -nosuffix" % path)
        st["shots"] += 1
    if not st["quit"] and time.time() - st["t0"] >= QUIT_AFTER:
        st["quit"] = True
        unreal.log("PROOF capture done frames=%d shots=%d" % (st["frame"], st["shots"]))
        unreal.unregister_slate_post_tick_callback(st["handle"])
        SL.quit_game(w, pc, unreal.QuitPreference.QUIT, False)


if OUT:
    os.makedirs(OUT, exist_ok=True)
st["handle"] = unreal.register_slate_post_tick_callback(tick)
unreal.log("PROOF frame_capture registered")

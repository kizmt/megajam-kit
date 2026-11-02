# Can the player walk the whole route? A -game test: the pawn runs every route line with real CharacterMovement and
# reports where it stalls, gets stuck, falls or is pushed off the line. Pair it with the editor survey
# (gen/unreal/py/traverse_survey.py): the survey says what could block, the walk says what does.
#
# Input: the same route file as the survey, <Project>/Generated/traverse/route.json ("lines", world cm), plus an
# optional "walk" block:
#   "walk": {"run_speed": 500, "time_dilation": 3.0, "look_cm": 150, "stall_cm": 60, "check_s": 1.5,
#            "fall_s": 1.5, "off_m": 8, "skip_m": 6, "settle_s": 2.5}
#   run_speed      max_walk_speed during the walk (default: the pawn's own)
#   time_dilation  global time dilation so a long route takes minutes (`slomo` does nothing in -game)
#   every check_s game seconds: moved under stall_cm -> "stall", one jump; still stuck -> "stuck", put skip_m on;
#   falling over fall_s -> "fall"; over off_m from the line -> "off", put back on the line
# Output: ROUTEWALK lines in the log and route_walk.json next to the route file (summary per line, every event with
# its place, the floor under the pawn and what blocks a capsule sweep ahead).
#   & C:\dev\megajam-kit\gen\test\game_test.ps1 -Map /Game/Maps/<Level> -Script C:\dev\megajam-kit\gen\test\route_walk.py -Tag ROUTEWALK -TimeoutSec 1500
# The game window appears: tell the director first. A game that changes the pawn's speed itself (stamina, wear,
# states) can undo run_speed: the walk re-applies it every tick. From a rehearsal script (KIT_NOTES 86, 97, 101, 147).
# Untested in this generic form.
import json
import math
import os

import unreal

PROJECT = unreal.Paths.convert_relative_path_to_full(unreal.Paths.project_dir())
ROUTE = os.path.join(PROJECT, "Generated", "traverse", "route.json")
SPEC = json.load(open(ROUTE))
WALK = SPEC.get("walk", {})
LINES = list(SPEC["lines"].items())
OUT = os.path.join(os.path.dirname(ROUTE), "route_walk.json")
cap = SPEC.get("capsule", {})
R, HH = float(cap.get("radius", 42.0)), float(cap.get("half_height", 96.0))
LOOK = float(WALK.get("look_cm", 150.0))
STALL_CM = float(WALK.get("stall_cm", 60.0))
CHECK = float(WALK.get("check_s", 1.5))
FALL_S = float(WALK.get("fall_s", 1.5))
OFF_M = float(WALK.get("off_m", 8.0))
SKIP = int(WALK.get("skip_m", 6))
SETTLE = float(WALK.get("settle_s", 2.5))
DILATION = float(WALK.get("time_dilation", 3.0))
RUN = WALK.get("run_speed")
VIS = unreal.TraceTypeQuery.ECC_VISIBILITY
SL = unreal.SystemLibrary
GS = unreal.GameplayStatics
NONE = unreal.DrawDebugTrace.NONE
st = {"line": -1, "phase": "next", "events": [], "summary": []}


def find():
    for pc in unreal.ObjectIterator(unreal.PlayerController):
        w = pc.get_world()
        if w and pc.get_controlled_pawn():
            return pc, pc.get_controlled_pawn(), w
    return None, None, None


def resample(P, step=100.0):
    """Points every metre, so the index is the distance along the line in m."""
    out = []
    for a, b in zip(P, P[1:]):
        n = max(1, int(math.dist(a[:2], b[:2]) / step))
        out += [tuple(a[i] + (b[i] - a[i]) * k / n for i in range(3)) for k in range(n)]
    return out + [tuple(P[-1])]


def name_of(comp, actor):
    mesh = comp.get_editor_property("static_mesh") if isinstance(comp, unreal.StaticMeshComponent) else None
    return "%s | %s | %s" % (actor.get_name() if actor else "?", comp.get_class().get_name() if comp else "?",
                             mesh.get_name() if mesh else "-")


def hit(t):
    t = t.to_tuple() if t else None   # a miss returns None
    return t if t and t[0] else None


def blocker_ahead(w, pawn, d):
    p = pawn.get_actor_location()
    e = unreal.Vector(p.x + d.x * 80.0, p.y + d.y * 80.0, p.z)
    t = hit(SL.capsule_trace_single_by_profile(w, p, e, R, HH, "Pawn", False, [pawn], NONE, True))
    return name_of(t[10], t[9]) if t else "nothing (floor or step)"


def floor_of(w, pawn):
    p = pawn.get_actor_location()
    t = hit(SL.line_trace_single(w, p, unreal.Vector(p.x, p.y, p.z - 2000.0), VIS, True, [pawn], NONE, True))
    return (round(t[4].z), name_of(t[10], t[9])) if t else (None, "none")


def event(kind, w, pawn, d, extra=None):
    p = pawn.get_actor_location()
    name = LINES[st["line"]][0]
    e = {"line": name, "kind": kind, "at_m": st["i"], "xy_m": [round(p.x / 100.0, 1), round(p.y / 100.0, 1)],
         "z_cm": round(p.z), "line_z_cm": round(st["P"][st["i"]][2]), "floor": floor_of(w, pawn),
         "ahead": blocker_ahead(w, pawn, d)}
    if extra:
        e.update(extra)
    st["events"].append(e)
    print("ROUTEWALK %-5s %-12s %5d m at (%.1f, %.1f) z %.0f (line %.0f) floor %s | ahead: %s" % (
        kind, name, e["at_m"], e["xy_m"][0], e["xy_m"][1], p.z, e["line_z_cm"], e["floor"], e["ahead"]))


def put(pawn, cmc, i):
    """Teleport onto the line. End any fall first, or the landing counts from the old fall's top (KIT_NOTES 147)."""
    try:
        cmc.set_movement_mode(unreal.MovementMode.MOVE_WALKING)
    except Exception as ex:  # noqa: BLE001 (a pawn without walking mode still gets placed)
        print("ROUTEWALK note: set_movement_mode failed:", ex)
    x, y, z = st["P"][i]
    pawn.set_actor_location(unreal.Vector(x, y, z + HH + 60.0), False, True)
    st["i"], st["phase"], st["t_phase"] = i, "settle", None


def nearest(p, i0):
    P = st["P"]
    best, bi = 1e18, i0
    for i in range(max(0, i0 - 3), min(len(P), i0 + 12)):
        dd = (P[i][0] - p.x) ** 2 + (P[i][1] - p.y) ** 2
        if dd < best:
            best, bi = dd, i
    return bi, math.sqrt(best)


def tick(dt):
    pc, pawn, w = find()
    if not pawn:
        return
    t = GS.get_time_seconds(w)
    cmc = pawn.get_components_by_class(unreal.CharacterMovementComponent)[0]
    if st["phase"] == "next":
        if st["line"] == -1:
            st["run"] = float(RUN) if RUN else cmc.get_editor_property("max_walk_speed")
            GS.set_global_time_dilation(w, DILATION)
            print("ROUTEWALK speed %.0f cm/s, dilation %.1f, %d line(s)" % (st["run"], DILATION, len(LINES)))
        st["line"] += 1
        if st["line"] >= len(LINES):
            finish(pc, w)
            return
        st["P"] = resample([tuple(float(v) for v in q) for q in LINES[st["line"]][1]])
        st["t_line"], st["stalls"], st["stuck"], st["falls"], st["off"] = t, 0, 0, 0, 0
        cmc.set_editor_property("max_walk_speed", st["run"])
        put(pawn, cmc, 0)
        return
    if st["phase"] == "settle":
        # Let the cells around the new spot stream in and the pawn land. The route's own floor must be there, not
        # only the landscape under it: big Nanite meshes arrive long after a teleport (KIT_NOTES 101).
        if st["t_phase"] is None:
            st["t_phase"] = t
        q = st["P"][st["i"]]
        g = hit(SL.line_trace_single(w, unreal.Vector(q[0], q[1], q[2] + 300.0), unreal.Vector(q[0], q[1], q[2] - 600.0),
                                     VIS, True, [pawn], NONE, True))
        waited = t - st["t_phase"]
        floor_in = bool(g and abs(g[4].z - q[2]) < 40.0) or waited > 40.0
        if waited < SETTLE or cmc.is_falling() or not floor_in:
            if waited > 20.0 and cmc.is_falling():
                print("ROUTEWALK never landed at", [round(v) for v in q])
                put(pawn, cmc, min(st["i"] + SKIP, len(st["P"]) - 1))
            return
        if waited > 40.0:
            print("ROUTEWALK note: the floor at", [round(v) for v in q], "never streamed in (walking what is there)")
        st["phase"], st["t_check"], st["p_check"], st["t_fall"], st["jumped"] = \
            "walk", t, pawn.get_actor_location(), None, False
        return
    P, p = st["P"], pawn.get_actor_location()
    i, off = nearest(p, st["i"])
    st["i"] = max(st["i"], i)
    if st["i"] >= len(P) - 2:
        s = {"line": LINES[st["line"]][0], "m": len(P), "game_s": round(t - st["t_line"]), "stalls": st["stalls"],
             "stuck": st["stuck"], "falls": st["falls"], "off": st["off"]}
        st["summary"].append(s)
        print("ROUTEWALK DONE %s" % s)
        st["phase"] = "next"
        return
    k = min(len(P) - 1, st["i"] + int(LOOK / 100.0) + 1)
    d = unreal.Vector(P[k][0] - p.x, P[k][1] - p.y, 0.0)
    L = math.hypot(d.x, d.y) or 1.0
    d = unreal.Vector(d.x / L, d.y / L, 0.0)
    pawn.add_movement_input(d, 1.0)
    if cmc.get_editor_property("max_walk_speed") != st["run"]:
        cmc.set_editor_property("max_walk_speed", st["run"])
    if st["jumped"]:
        pawn.stop_jumping()
    if cmc.is_falling():
        if st["t_fall"] is None:
            st["t_fall"] = t
        elif t - st["t_fall"] > FALL_S and not st.get("fall_logged"):
            st["falls"] += 1
            st["fall_logged"] = True
            event("fall", w, pawn, d)
    else:
        st["t_fall"], st["fall_logged"] = None, False
    if off > OFF_M * 100.0:
        st["off"] += 1
        event("off", w, pawn, d, {"off_m": round(off / 100.0, 1)})
        put(pawn, cmc, st["i"])
        return
    if st["i"] % 250 == 0 and st.get("logged") != (st["line"], st["i"]):
        st["logged"] = (st["line"], st["i"])
        print("ROUTEWALK at %s %d m, %.0f game s" % (LINES[st["line"]][0], st["i"], t - st["t_line"]))
    if t - st["t_check"] >= CHECK:
        moved = math.hypot(p.x - st["p_check"].x, p.y - st["p_check"].y)
        if moved < STALL_CM:
            if not st["jumped"]:
                st["stalls"] += 1
                event("stall", w, pawn, d, {"moved_cm": round(moved)})
                pawn.jump()
                st["jumped"] = True
            else:
                st["stuck"] += 1
                event("stuck", w, pawn, d, {"moved_cm": round(moved)})
                put(pawn, cmc, min(st["i"] + SKIP, len(P) - 1))
                return
        else:
            if st["jumped"] and st["events"]:
                st["events"][-1]["jump_freed"] = True
                print("ROUTEWALK   ...the jump freed it")
            st["jumped"] = False
        st["t_check"], st["p_check"] = t, p


def finish(pc, w):
    GS.set_global_time_dilation(w, 1.0)
    json.dump({"route": ROUTE, "summary": st["summary"], "events": st["events"]}, open(OUT, "w"), indent=1)
    for s in st["summary"]:
        print("ROUTEWALK SUMMARY %s" % s)
    print("ROUTEWALK done: %s" % OUT)
    unreal.unregister_slate_post_tick_callback(st["handle"])
    SL.quit_game(w, pc, unreal.QuitPreference.QUIT, False)


st["handle"] = unreal.register_slate_post_tick_callback(tick)
print("ROUTEWALK registered: %s" % ROUTE)

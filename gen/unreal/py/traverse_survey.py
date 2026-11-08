# Where can't the player go, and why? An editor survey of the walkable route for invisible walls, lids, ledges and
# steep spots, with the pawn's own collision. Run it after any change to the level's collision, walls, props or
# terrain along the route, and before a playtest (docs/ue/debugging.md F "Traversal checks"). For a game where a
# character moves on foot through the level; other games skip it.
#
# Input: a route file the game session writes (JSON, world cm), by default <Project>/Generated/traverse/route.json:
#   {"lines": {"main": [[x, y, z], ...], "side path": [...]},     polylines the player is meant to walk (z = ground)
#    "capsule": {"radius": 42, "half_height": 96},                 the player's capsule (optional; template defaults)
#    "step_cm": 45, "jump_cm": 85, "walkable_deg": 44.765,         CMC MaxStepHeight, jump rise, walkable floor angle
#    "offsets_cm": [0, -120, 120], "sample_cm": 40}                lines offset to each side (+ = right), sample spacing
# For every sample on every offset line:
#   hole       no floor for the "Pawn" profile within 6 m below
#   lid        the pawn's floor is over 10 cm above the visible ground (a complex Visibility trace): something
#              invisible to stand on, whose edges act as walls
#   ledge      the floor rises more than the step height between samples ("ledge_jump" if a jump clears it)
#   steep      over ~1 m the floor climbs steeper than the walkable angle
#   blocked    the capsule, foot at step height, overlaps a blocker (the "Pawn" profile, simple collision, as
#              CharacterMovement sweeps)
#   invisible  ... and rays from 45 cm outside the capsule toward its axis never touch that blocker's drawn
#              triangles: its simple collision stands where nothing is visible (a hidden-in-game shape counts as
#              invisible)
# Output: traverse_survey.json next to the route file (per line: counts and the first spots; per blocker: counts,
# spots, actors) and a printed summary (TRAVERSE lines).
#
# The level must be open with its streamed actors loaded (World Partition: docs/ue/worldbuilding.md "World Partition
# from Python"); wait a call after loading before running it (foliage bodies arrive late).
#   node gen\unreal\py.ts gen\unreal\py\traverse_survey.py [--arg route=C:\dev\<Project>\Generated\traverse\route.json]
#        [--arg only=<line name>] [--arg sample=40] [--arg offsets=0,-120,120]
# From a rehearsal script that found the invisible walls a director hit on an open route.
# Tested 2026-11-02 on the rehearsal's level (25,000 samples in ~2 s).
import collections
import json
import math
import os

import unreal

A = globals().get("ARGS", {})  # py.ts defines ARGS (strings)
PROJECT = unreal.Paths.convert_relative_path_to_full(unreal.Paths.project_dir())
ROUTE = A.get("route") or os.path.join(PROJECT, "Generated", "traverse", "route.json")
with open(ROUTE) as f:
    spec = json.load(f)
cap = spec.get("capsule", {})
R = float(cap.get("radius", 42.0))
HH = float(cap.get("half_height", 96.0))
STEP = float(spec.get("step_cm", 45.0))
JUMP = float(spec.get("jump_cm", 85.0))
TAN_WALK = math.tan(math.radians(float(spec.get("walkable_deg", 44.765))))
SAMPLE = float(A.get("sample", spec.get("sample_cm", 40.0)))
OFFSETS = [float(v) for v in A["offsets"].split(",")] if A.get("offsets") else \
    [float(v) for v in spec.get("offsets_cm", [0.0, -120.0, 120.0])]
ONLY = A.get("only", "")

world = unreal.get_editor_subsystem(unreal.UnrealEditorSubsystem).get_editor_world()
VIS = unreal.TraceTypeQuery.ECC_VISIBILITY
SL = unreal.SystemLibrary
NONE = unreal.DrawDebugTrace.NONE
# HitResult.to_tuple(): 0 blocking_hit, 4 location, 9 hit_actor, 10 hit_component, 13 hit_item. A miss returns None.


def tup(h):
    t = h.to_tuple() if h else None
    return t if t and t[0] else None


def ground(x, y, z):
    """(pawn floor z, its component, visible floor z): by the Pawn profile (simple) and a complex Visibility trace."""
    a, b = unreal.Vector(x, y, z + 400.0), unreal.Vector(x, y, z - 600.0)
    p = tup(SL.line_trace_single_by_profile(world, a, b, "Pawn", False, [], NONE, True))
    v = tup(SL.line_trace_single(world, a, b, VIS, True, [], NONE, True))
    return (p[4].z if p else None), (p[10] if p else None), (v[4].z if v else None)


def blocker(x, y, gz):
    c = unreal.Vector(x, y, gz + STEP + HH)
    t = tup(SL.capsule_trace_single_by_profile(world, c, unreal.Vector(x, y, c.z + 1.0), R, HH, "Pawn", False, [],
                                               NONE, True))
    return (t[10], t[13], c) if t else None


def drawn_there(comp, item, c):
    """Does any ray from 45 cm outside the capsule toward its axis hit this component's real triangles?"""
    reach = R + 45.0
    for dz in (-HH + 5.0, -HH * 0.5, 0.0, HH - 10.0):
        for k in range(8):
            a = math.radians(k * 45.0)
            s = unreal.Vector(c.x + math.cos(a) * reach, c.y + math.sin(a) * reach, c.z + dz)
            e = unreal.Vector(c.x, c.y, c.z + dz)
            t = tup(SL.line_trace_single_by_profile(world, s, e, "Pawn", True, [], NONE, True))
            if t and t[10] == comp and (item < 0 or t[13] == item):
                return True
    return False


def key_of(comp):
    if comp is None:
        return "?"
    owner = comp.get_owner()
    mesh = comp.get_editor_property("static_mesh") if isinstance(comp, unreal.StaticMeshComponent) else None
    return "%s | %s | %s" % (owner.get_class().get_name() if owner else "?", comp.get_class().get_name(),
                             mesh.get_name() if mesh else "-")


def has_triangles(comp):
    return (isinstance(comp, unreal.StaticMeshComponent) and comp.get_editor_property("static_mesh") is not None) \
        or isinstance(comp, unreal.LandscapeHeightfieldCollisionComponent)


def offset_line(P, off):
    """The polyline shifted sideways by off cm (+ = right of the direction of travel; Unreal's +Y is right of +X)."""
    Q = []
    for i, p in enumerate(P):
        a, b = P[max(i - 1, 0)], P[min(i + 1, len(P) - 1)]
        dx, dy = b[0] - a[0], b[1] - a[1]
        L = math.hypot(dx, dy) or 1.0
        Q.append((p[0] - dy / L * off, p[1] + dx / L * off, p[2]))
    return Q


def samples(P):
    for a, b in zip(P, P[1:]):
        n = max(1, int(math.dist(a[:2], b[:2]) / SAMPLE))
        for k in range(n):
            f = k / n
            yield tuple(a[i] + (b[i] - a[i]) * f for i in range(3))
    yield tuple(P[-1])


blk = collections.defaultdict(lambda: {"n": 0, "invisible": 0, "spots": [], "invisible_spots": [], "actors": set()})
lids = collections.Counter()
report = {}
for name, pts in spec["lines"].items():
    if ONLY and name != ONLY:
        continue
    P = [tuple(float(v) for v in p) for p in pts]
    r = collections.Counter()
    first = collections.defaultdict(list)
    for off in OFFSETS:
        prev = []
        for x, y, z in samples(offset_line(P, off)):
            r["samples"] += 1
            gz, gcomp, vz = ground(x, y, prev[-1][2] if prev else z)
            spot = [round(x / 100.0, 1), round(y / 100.0, 1), off]
            if gz is None:
                r["hole"] += 1
                first["hole"].append(spot)
                prev = []
                continue
            if vz is not None and gz - vz > 10.0:
                r["lid"] += 1
                lids[key_of(gcomp)] += 1
                first["lid"].append(spot + [round(gz - vz), key_of(gcomp)])
            if prev and gz - prev[-1][2] > STEP:
                kind = "ledge_jump" if gz - prev[-1][2] <= JUMP else "ledge"
                r[kind] += 1
                first[kind].append(spot + [round(gz - prev[-1][2]), key_of(gcomp)])
            if len(prev) >= 3:
                q = prev[-3]
                run = math.dist((x, y), q[:2])
                if run > 90.0 and (gz - q[2]) / run > TAN_WALK:
                    r["steep"] += 1
                    first["steep"].append(spot + [round((gz - q[2]) / run, 2)])
            hit = blocker(x, y, gz)
            if hit:
                comp, item, c = hit
                b = blk[key_of(comp)]
                b["n"] += 1
                owner = comp.get_owner()
                b["actors"].add(owner.get_actor_label() if owner else "?")
                if len(b["spots"]) < 8:
                    b["spots"].append(spot)
                r["blocked"] += 1
                drawn = has_triangles(comp) and not comp.get_editor_property("hidden_in_game") \
                    and drawn_there(comp, item, c)
                if not drawn:
                    r["invisible"] += 1
                    b["invisible"] += 1
                    if len(b["invisible_spots"]) < 12:
                        b["invisible_spots"].append(spot + [item])
            prev.append((x, y, gz))
    report[name] = {"counts": dict(r), "first": {k: v[:10] for k, v in first.items()}}
    print("TRAVERSE line %-14s %s" % (name, dict(r)))

out_path = os.path.join(os.path.dirname(ROUTE), "traverse_survey.json")
with open(out_path, "w") as f:
    json.dump({"route": ROUTE, "capsule": [R, HH], "step_cm": STEP, "lines": report, "lids": dict(lids),
               "blockers": {k: dict(v, actors=sorted(v["actors"])[:10]) for k, v in blk.items()}}, f, indent=1)
for k, v in sorted(blk.items(), key=lambda kv: -kv[1]["invisible"]):
    print("TRAVERSE blocker %5d blocked %5d invisible  %s  e.g. %s" % (v["n"], v["invisible"], k, sorted(v["actors"])[:3]))
for k, n in lids.most_common(12):
    print("TRAVERSE lid %5d  %s" % (n, k))
print("TRAVERSE done: %d blocked samples, %d invisible; %s" % (
    sum(v["n"] for v in blk.values()), sum(v["invisible"] for v in blk.values()), out_path))

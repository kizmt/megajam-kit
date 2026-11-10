# Drive UE 5.9's Kimodo text-to-motion (AnimGenOffline plugin) by script: set the prompt, let the plugin generate,
# bake the result to an Animation Sequence. Run through gen/unreal/kimodo.ts (it waits for the generation between
# the steps). Proven on the 5.9 Preview in a practice run (2026-11-10): no UI step and no C++ needed.
#
# How it works: the plugin has no "generate" function for scripts. Its edit mode regenerates a section about 0.4 s
# after an editor transaction touches the section or its pose generator, while the sequence is open in Sequencer and
# Live Update and the section's auto-generate are on (both default on). So the transaction is the trigger.
#
# ARGS: op = open | generate | state | export
#       seq = the Level Sequence holding the character's Generated Animation track (made once with the plugin's
#             Add Character: SETUP.md 10b)
#       open:     [map] = level to load first
#       generate: prompt, [seed], [section] = index of the generator section (default: all of them)
#       export:   out = /Game/.../A_Name, [mesh] = skeletal mesh whose skeleton the clip is for (default: the bound
#                 character's own)
# Prints KIMODO_JSON={...}. Errors raise (run_python reports ERROR with the traceback).
import json

import unreal

EAL = unreal.EditorAssetLibrary
seq = unreal.load_asset(ARGS["seq"])  # noqa: F821 (ARGS is set by run_python)
if seq is None:
    raise RuntimeError(f"sequence not found: {ARGS['seq']}")  # noqa: F821
op = ARGS["op"]  # noqa: F821


def generator_sections():
    found = []

    def walk(track):
        for sec in track.get_sections():
            if isinstance(sec, unreal.AnimGenOfflineGeneratorSection):
                found.append(sec)
        # Animation Mixer tracks keep their layers as child tracks.
        children = getattr(track, "get_child_tracks", None)
        if children:
            try:
                for child in children():
                    walk(child)
            except Exception:  # noqa: BLE001 (a track type without children)
                pass

    for b in seq.get_bindings():
        for t in b.get_tracks():
            walk(t)
    for t in seq.get_tracks():
        walk(t)
    return found


def generator_binding():
    def has(track):
        if isinstance(track, unreal.AnimGenOfflineGeneratorTrack):
            return True
        if any(isinstance(s, unreal.AnimGenOfflineGeneratorSection) for s in track.get_sections()):
            return True
        children = getattr(track, "get_child_tracks", None)
        try:
            return bool(children) and any(has(c) for c in children())
        except Exception:  # noqa: BLE001
            return False

    for b in seq.get_bindings():
        if any(has(t) for t in b.get_tracks()):
            return b
    raise RuntimeError("no binding with a Generated Animation track in this sequence (SETUP.md 10b: Add Character)")


def describe(sec):
    pg = sec.get_editor_property("pose_generator")
    return {
        # Generator sections can have open ranges: ask before reading a frame.
        "start": sec.get_start_frame() if sec.has_start_frame() else None,
        "end": sec.get_end_frame() if sec.has_end_frame() else None,
        # CamelCase names: KimodoPoseGenerator has no Python type, so the snake_case forms are not found.
        "prompt": str(pg.get_editor_property("AnimDescriptionOverride")) if pg else None,
        "seed": int(pg.get_editor_property("RandomSeed")) if pg else None,
    }


result = {"op": op, "seq": ARGS["seq"]}  # noqa: F821
if op == "open":
    if ARGS.get("map"):  # noqa: F821
        unreal.get_editor_subsystem(unreal.LevelEditorSubsystem).load_level(ARGS["map"])  # noqa: F821
    # The plugin's edit mode only listens while the sequence is open in Sequencer.
    result["opened"] = bool(unreal.LevelSequenceEditorBlueprintLibrary.open_level_sequence(seq))
    unreal.SystemLibrary.execute_console_command(None, "AnimGenOffline.ProfileGeneration 1")  # timing lines in the log
    result["sections"] = [describe(s) for s in generator_sections()]
elif op == "state":
    current = unreal.LevelSequenceEditorBlueprintLibrary.get_current_level_sequence()
    result["open_in_sequencer"] = bool(current and current.get_path_name() == seq.get_path_name())
    result["sections"] = [describe(s) for s in generator_sections()]
elif op == "generate":
    current = unreal.LevelSequenceEditorBlueprintLibrary.get_current_level_sequence()
    if not current or current.get_path_name() != seq.get_path_name():
        raise RuntimeError("the sequence is not open in Sequencer: run op=open first (and let the editor tick)")
    secs = generator_sections()
    if not secs:
        raise RuntimeError("no Generated Animation section in this sequence (SETUP.md 10b: Add Character)")
    if ARGS.get("section"):  # noqa: F821
        secs = [secs[int(ARGS["section"])]]  # noqa: F821
    for sec in secs:
        pg = sec.get_editor_property("pose_generator")
        if pg is None:
            raise RuntimeError("a generator section has no pose generator (set Pose Generator = Kimodo)")
        with unreal.ScopedEditorTransaction("Kimodo prompt by script"):
            sec.modify()
            pg.modify()
            pg.set_editor_property("AnimDescriptionOverride", ARGS["prompt"])  # noqa: F821
            if ARGS.get("seed"):  # noqa: F821
                pg.set_editor_property("RandomSeed", int(ARGS["seed"]))  # noqa: F821
    result["sections"] = [describe(s) for s in secs]
elif op == "export":
    binding = generator_binding()
    mesh = unreal.load_asset(ARGS["mesh"]) if ARGS.get("mesh") else None  # noqa: F821
    if mesh is None:
        # The bound character: a spawnable's template actor, or the possessed actor in the open level.
        actors = []
        try:
            template = binding.get_object_template()
            if template:
                actors.append(template)
        except Exception:  # noqa: BLE001
            pass
        try:
            # With the sequence open, the spawned character itself (seen on 5.9: a plain Actor with one
            # SkeletalMeshComponent, made by the plugin's Add Character).
            actors = list(unreal.LevelSequenceEditorBlueprintLibrary.get_bound_objects(seq.get_binding_id(binding))) + actors
        except Exception:  # noqa: BLE001
            pass
        for a in actors:
            comps = a.get_components_by_class(unreal.SkeletalMeshComponent) if hasattr(a, "get_components_by_class") else []
            mesh = next((c.get_skeletal_mesh_asset() for c in comps if c.get_skeletal_mesh_asset()), None)
            if mesh:
                break
    if mesh is None:
        raise RuntimeError("could not find the character's skeletal mesh: pass mesh=/Game/.../SK_Name")
    skeleton = mesh.get_editor_property("skeleton")
    path = ARGS["out"]  # noqa: F821
    folder, name = path.rsplit("/", 1)
    anim = unreal.load_asset(path) if EAL.does_asset_exist(path) else None
    if anim is None:
        factory = unreal.AnimSequenceFactory()
        factory.set_editor_property("target_skeleton", skeleton)
        anim = unreal.AssetToolsHelpers.get_asset_tools().create_asset(name, folder, unreal.AnimSequence, factory)
    if anim is None:
        raise RuntimeError(f"could not create {path}")
    opt = unreal.AnimSeqExportOption()
    opt.set_editor_property("export_transforms", True)
    opt.set_editor_property("record_in_world_space", False)
    if not unreal.ControlRigSequencerLibrary.export_anim_sequence_from_sequencer(anim, opt, binding, False):
        raise RuntimeError("export_anim_sequence_from_sequencer returned False")
    if not EAL.save_asset(path, only_if_is_dirty=False):
        raise RuntimeError(f"saving {path} failed")
    result.update({"out": path, "skeleton": skeleton.get_path_name(), "binding": str(binding.get_display_name()),
                   "frames": int(anim.get_editor_property("number_of_sampled_keys")),
                   "seconds": round(anim.get_play_length(), 2)})
else:
    raise RuntimeError(f"unknown op {op}")
print("KIMODO_JSON=" + json.dumps(result))

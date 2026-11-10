# Editor operations for gen/unreal/ue.ts on engines whose Python toolsets differ from 5.8.4's (UE 5.9: Epic's
# editor_toolset.toolsets.* Python toolsets are gone). Plain unreal.* calls, run through MegajamTools.run_python.
# ARGS: op = operation name, json = its arguments as JSON. Prints one line: UE_OPS_JSON <result as JSON>.
# Errors raise, so run_python reports ERROR with the traceback.
import json
import re

import unreal

EAL = unreal.EditorAssetLibrary


def _load(path):
    obj = unreal.load_asset(path) or unreal.load_object(None, path)
    if obj is None:
        raise RuntimeError(f"not found: {path}")
    return obj


def _pkg(path):
    return path.split(".")[0]


def _snake(name):
    # SRGB -> srgb, LODGroup -> lod_group, AddressX -> address_x, bFlipGreenChannel -> flip_green_channel
    if re.match(r"^b[A-Z]", name):
        name = name[1:]
    s = re.sub(r"([A-Z]+)([A-Z][a-z])", r"\1_\2", name)
    s = re.sub(r"([a-z0-9])([A-Z])", r"\1_\2", s)
    return s.lower()


def _import(file, folder, name):
    task = unreal.AssetImportTask()
    task.set_editor_property("filename", file)
    task.set_editor_property("destination_path", folder)
    task.set_editor_property("destination_name", name)
    task.set_editor_property("automated", True)
    task.set_editor_property("replace_existing", True)
    task.set_editor_property("save", False)
    unreal.AssetToolsHelpers.get_asset_tools().import_asset_tasks([task])
    paths = list(task.get_editor_property("imported_object_paths") or [])
    if not paths:
        raise RuntimeError(f"import produced nothing: {file}")
    return paths


def _rename_to(obj, folder, name):
    want = f"{folder}/{name}"
    have = _pkg(obj.get_path_name())
    if have != want:
        if EAL.does_asset_exist(want):
            raise RuntimeError(f"cannot rename {have} to {want}: it exists")
        if not EAL.rename_asset(have, want):
            raise RuntimeError(f"rename {have} -> {want} failed")
    return want


def op_exists(a):
    return EAL.does_asset_exist(a["path"]) or EAL.does_directory_exist(a["path"])


def op_delete(a):
    p = a["path"]
    ok = EAL.delete_directory(p) if EAL.does_directory_exist(p) and not EAL.does_asset_exist(p) else EAL.delete_asset(p)
    if not ok:
        raise RuntimeError(f"delete failed: {p}")
    return True


def op_save(a):
    return all(EAL.save_asset(_pkg(p), only_if_is_dirty=False) for p in a["paths"])


def op_import_static_mesh(a):
    # Geometry only: the importer's own materials and textures are removed (5.8's import_file was called with
    # import_textures false), after pointing the slots at a neutral engine material so nothing references them.
    paths = _import(a["file"], a["folder"], a["name"])
    objs = [unreal.load_asset(p) for p in paths]
    meshes = [o for o in objs if isinstance(o, unreal.StaticMesh)]
    if not meshes:
        raise RuntimeError(f"no static mesh in {paths}")
    mesh = meshes[0]
    grid = unreal.load_asset("/Engine/EngineMaterials/WorldGridMaterial")
    for i in range(len(mesh.get_editor_property("static_materials"))):
        mesh.set_material(i, grid)
    removed = []
    for kind in (unreal.MaterialInterface, unreal.Texture):
        for o in objs:
            if isinstance(o, kind):
                p = _pkg(o.get_path_name())
                if EAL.delete_asset(p):
                    removed.append(p)
    path = _rename_to(mesh, a["folder"], a["name"])
    return {"mesh": path, "removed": removed}


def op_set_nanite(a):
    sm = _load(a["mesh"])
    sub = unreal.get_editor_subsystem(unreal.StaticMeshEditorSubsystem)
    s = sub.get_nanite_settings(sm)
    s.set_editor_property("enabled", bool(a["enabled"]))
    sub.set_nanite_settings(sm, s, apply_changes=True)
    return True


def op_convex(a):
    sm = _load(a["mesh"])
    sub = unreal.get_editor_subsystem(unreal.StaticMeshEditorSubsystem)
    return bool(sub.set_convex_decomposition_collisions(sm, int(a["hulls"]), 32, 100000))


def op_place(a):
    actors = unreal.get_editor_subsystem(unreal.EditorActorSubsystem)
    loc = unreal.Vector(*a["location"])
    actor = actors.spawn_actor_from_object(_load(a["asset"]), loc, unreal.Rotator(roll=0.0, pitch=0.0, yaw=float(a["yaw"])))
    if actor is None:
        raise RuntimeError(f"spawn failed: {a['asset']}")
    actor.set_actor_label(a["label"])
    origin, extent = actor.get_actor_bounds(False)
    lo, hi = origin - extent, origin + extent
    return {"actor": {"refPath": actor.get_path_name()},
            "box": {"min": {"x": lo.x, "y": lo.y, "z": lo.z}, "max": {"x": hi.x, "y": hi.y, "z": hi.z}, "isValid": True}}


def op_camera(a):
    l, r = a["location"], a["rotation"]
    unreal.get_editor_subsystem(unreal.UnrealEditorSubsystem).set_level_viewport_camera_info(
        unreal.Vector(l["x"], l["y"], l["z"]), unreal.Rotator(roll=r["roll"], pitch=r["pitch"], yaw=r["yaw"]))
    return True


def op_import_texture(a):
    paths = _import(a["file"], a["folder"], a["name"])
    texes = [o for o in (unreal.load_asset(p) for p in paths) if isinstance(o, unreal.Texture)]
    if not texes:
        raise RuntimeError(f"no texture in {paths}")
    return {"refPath": _rename_to(texes[0], a["folder"], a["name"])}


def op_set_props(a):
    obj = _load(a["path"])
    for key, value in a["props"].items():
        name = key
        try:
            cur = obj.get_editor_property(name)
        except Exception:
            name = _snake(key)
            cur = obj.get_editor_property(name)
        if isinstance(cur, unreal.EnumBase):
            enum = type(cur)
            value = getattr(enum, str(value).upper(), None) or getattr(enum, str(value).upper().split("_", 1)[-1], None)
            if value is None:
                raise RuntimeError(f"{key}: no {enum.__name__} member {a['props'][key]}")
        elif isinstance(cur, bool):
            value = bool(value)
        elif isinstance(cur, int):
            value = int(value)
        elif isinstance(cur, float):
            value = float(value)
        obj.set_editor_property(name, value)
    return True


def op_create_mi(a):
    tools = unreal.AssetToolsHelpers.get_asset_tools()
    mi = tools.create_asset(a["name"], a["folder"], unreal.MaterialInstanceConstant, unreal.MaterialInstanceConstantFactoryNew())
    if mi is None:
        raise RuntimeError(f"could not create {a['folder']}/{a['name']}")
    unreal.MaterialEditingLibrary.set_material_instance_parent(mi, _load(a["parent"]))
    return {"refPath": mi.get_path_name()}


def op_mi_texture(a):
    mi = _load(a["instance"])
    ok = unreal.MaterialEditingLibrary.set_material_instance_texture_parameter_value(mi, a["param"], _load(a["texture"]))
    unreal.MaterialEditingLibrary.update_material_instance(mi)
    if not ok:
        raise RuntimeError(f"{a['instance']} has no texture parameter {a['param']}")
    return True


def _materials(mesh, kind):
    return list(mesh.get_editor_property("materials" if kind == "skeletal" else "static_materials"))


def op_slots(a):
    return [str(m.get_editor_property("material_slot_name")) for m in _materials(_load(a["mesh"]), a["kind"])]


def op_set_material(a):
    mesh = _load(a["mesh"])
    mats = _materials(mesh, a["kind"])
    names = [str(m.get_editor_property("material_slot_name")) for m in mats]
    if a["slot"] not in names:
        raise RuntimeError(f"no slot {a['slot']} on {a['mesh']} (slots: {names})")
    i = names.index(a["slot"])
    mat = _load(a["material"])
    if a["kind"] == "skeletal":
        m = mats[i]
        m.set_editor_property("material_interface", mat)
        mats[i] = m
        mesh.set_editor_property("materials", mats)
    else:
        mesh.set_material(i, mat)
    return True


_result = globals()["op_" + ARGS["op"]](json.loads(ARGS.get("json") or "{}"))  # noqa: F821 (ARGS is set by run_python)
print("UE_OPS_JSON " + json.dumps(_result))

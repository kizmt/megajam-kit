# One Blueprint actor for a prop cut into parts by gen/parts.ts: a "Root" scene component and one Movable
# StaticMeshComponent per part, named after the part, at the part's relative location. Assembled it looks like the
# original prop; each part turns or slides about its own origin (the pivot given to parts.ts). Checked on 5.9
# (2026-11-11): a spawned actor has the components under their part names, Movable, at the given locations, attached
# to Root (which sits under the Blueprint's DefaultSceneRoot). A thin asset wrapper:
# no graph, no logic. The game's C++ moves the parts, finding each by name:
#   for (UStaticMeshComponent* C : TInlineComponentArray<UStaticMeshComponent*>(this)) if (C->GetName() == TEXT("Lid")) ...
# Run via gen/parts.ts --blueprint. ARGS:
#   name    prop name (the Blueprint is <folder>/BP_<name>)
#   folder  /Game/Props/<name>
#   parts   JSON list of {"name": "Lid", "asset": "/Game/Props/Chest/SM_Chest_Lid", "loc": [x, y, z]} (Unreal cm)
#   parent  optional parent class, /Script/<Module>.<ClassWithoutPrefix> (an Actor subclass; default Actor)
# Prints PARTS_BP_JSON={...}.
import json
import unreal

name, folder = ARGS["name"], ARGS["folder"].rstrip("/")
parts = json.loads(ARGS["parts"])
parent_path = ARGS.get("parent") or "/Script/Engine.Actor"
parent = unreal.load_class(None, parent_path)
if parent is None:
    raise RuntimeError(f"parent class not found: {parent_path} (format /Script/<Module>.<ClassWithoutPrefix>)")

bp_path = f"{folder}/BP_{name}"
from megajam_tools.refs import delete_asset_safely
delete_asset_safely(bp_path)  # refuses if a placed actor or another asset still uses the old Blueprint
factory = unreal.BlueprintFactory()
factory.set_editor_property("parent_class", parent)
bp = unreal.AssetToolsHelpers.get_asset_tools().create_asset(f"BP_{name}", folder, unreal.Blueprint, factory)
if bp is None:
    raise RuntimeError(f"could not create {bp_path}")

sub = unreal.get_engine_subsystem(unreal.SubobjectDataSubsystem)
lib = unreal.SubobjectDataBlueprintFunctionLibrary


def add(parent_handle, cls, label):
    handle, reason = sub.add_new_subobject(unreal.AddNewSubobjectParams(
        parent_handle=parent_handle, new_class=cls, blueprint_context=bp))
    if not lib.is_handle_valid(handle):
        raise RuntimeError(f"adding {label} failed: {reason}")
    sub.rename_subobject(handle, unreal.Text(label))
    return handle, lib.get_object_for_blueprint(lib.get_data(handle), bp)


# An explicit Root first: the first component added to a bare Actor Blueprint takes the place of DefaultSceneRoot,
# and a part in that place would lose its relative location.
actor_handle = sub.k2_gather_subobject_data_for_blueprint(bp)[0]
root_handle, _ = add(actor_handle, unreal.SceneComponent, "Root")
made = []
for p in parts:
    mesh = unreal.load_asset(p["asset"])
    if mesh is None:
        raise RuntimeError(f"part mesh not found: {p['asset']}")
    _, comp = add(root_handle, unreal.StaticMeshComponent, p["name"])
    comp.set_static_mesh(mesh)
    comp.set_editor_property("mobility", unreal.ComponentMobility.MOVABLE)
    comp.set_editor_property("relative_location", unreal.Vector(*p["loc"]))
    made.append(p["name"])  # the template is <name>_GEN_VARIABLE; the component on a spawned actor is <name>

unreal.BlueprintEditorLibrary.compile_blueprint(bp)
unreal.EditorAssetLibrary.save_loaded_asset(bp, False)
print("PARTS_BP_JSON=" + json.dumps({"blueprint": bp_path, "parent": parent_path, "components": made}))

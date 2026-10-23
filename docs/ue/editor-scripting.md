# Editor scripting and in-editor content (UE 5.8.4)

How the agent changes the editor: Epic's Unreal MCP toolsets first, our own Python toolset (`MegajamTools`)
for anything missing, and in-editor geometry when it beats generating an asset. Rules: one session drives the
editor; pipeline steps are scripts; verify every change by reading state back or taking a screenshot; check the
Python stub or headers before writing an API call from memory.

## Rules that bite

- **No tool runs arbitrary Python.** `ProgrammaticToolset.execute_tool_script` is a sandbox that only batches
  other tools. For real `unreal` Python, add a tool to `MegajamTools`, or use `run_console_command` with
  `py "C:/path/script.py"` (fire-and-forget: errors only show in the Output Log).
- **MCP calls are serial.** Tools run on the game thread, and Epic says clients must not overlap calls. This is
  why one session drives the editor. Do the next call after the previous one returns.
- **Read results.** Many tools report failure in the payload, not as an MCP error. `mcp.mjs` throws on `isError`;
  for anything else, read back (`get_editor_property`, a find/list tool, `captureViewport()`).
- **Save points.** Tool edits are not always undoable (imports never are). Save before and after bulk changes.
- **Not during PIE.** Asset and level tools act differently while Play-In-Editor runs. Stop PIE first.
- **Python runs only in the editor** (embedded Python 3.11.8). It is not available in PIE, standalone or packaged
  builds, so gameplay code is C++.

## A. Python in the editor

Setup: Python Editor Script Plugin (on in our project). Turn on **Project Settings > Plugins > Python > Developer
Mode** and restart; the editor then writes the stub `<Project>/Intermediate/PythonStub/unreal.py` (~34 MB).
**Search it, don't read it.** Every Python call below was checked there.

Ways to run Python:

| How | Use |
|---|---|
| `py "C:/x/script.py"` or `py <one statement>` (console) | One-off scripts; through `MegajamTools.run_console_command` |
| `init_unreal.py` in any `Content/Python` folder | Runs at editor startup. Ours registers `MegajamTools` |
| `UnrealEditor-Cmd.exe P.uproject -run=pythonscript -script="C:\\x.py"` | Headless batch. It loads no level, so call `load_level` yourself |
| `unreal.PythonScriptLibrary.execute_python_command_ex(cmd, mode)` | Runs code and returns `(command_result, log_output)`. Best base for a `run_python` tool |

Search paths: `Content/Python` folders of the project, the engine and every enabled plugin, plus Additional
Paths / `UE_PYTHONPATH`. The interpreter is isolated by default.

### APIs we use most (5.8 status)

| Job | Use | Avoid (deprecated in 5.8) |
|---|---|---|
| Get a subsystem | `unreal.get_editor_subsystem(unreal.EditorActorSubsystem)` | - |
| Spawn, list, select, destroy actors | `EditorActorSubsystem.spawn_actor_from_object/_from_class`, `get_all_level_actors`, `get_selected_level_actors`, `set_selected_level_actors`, `destroy_actor`, `duplicate_actor` | `EditorLevelLibrary.*` (whole class) |
| Editor world, viewport camera | `UnrealEditorSubsystem.get_editor_world`, `get_level_viewport_camera_info`, `set_level_viewport_camera_info` | `EditorLevelLibrary.get_editor_world` |
| Levels, PIE | `LevelEditorSubsystem.load_level`, `new_level`, `save_current_level`, `save_all_dirty_levels`, `editor_play_simulate`, `editor_request_end_play`, `is_in_play_in_editor` | `EditorLevelLibrary.load_level/save_*` |
| Assets | `EditorAssetLibrary` (not deprecated) or `EditorAssetSubsystem`: `does_asset_exist`, `load_asset`, `save_asset`, `list_assets`, `delete_asset`, `rename_asset`, `duplicate_asset` | `os.rename`/`shutil` on .uasset files |
| Mesh LODs, Nanite | `StaticMeshEditorSubsystem.get_nanite_settings/set_nanite_settings`, `set_lods`, `get_lod_count` | `EditorStaticMeshLibrary.*`, `EditorSkeletalMeshLibrary.*` |
| Import a file | `AssetImportTask` + `AssetToolsHelpers.get_asset_tools().import_asset_tasks([task])` | - |
| Properties | `obj.set_editor_property(name, v)`, `get_editor_property`, `set_editor_properties({...})` | Direct `obj.attr = v` (skips pre/post-edit logic, like a Details panel edit would run) |
| Undo grouping | `with unreal.ScopedEditorTransaction("Place props"):` | - |
| Progress bar | `with unreal.ScopedSlowTask(n, "Working") as t: t.make_dialog(True); t.enter_progress_frame(1)`; check `t.should_cancel()` | - |
| Logging | `unreal.log`, `log_warning`, `log_error` | `print` (works, but not tagged) |

Every `EditorLevelLibrary` function except the spawns, `replace_selected_actors`, `get_pie_worlds` and
`editor_end_play` carries "The Editor Scripting Utilities Plugin is deprecated - use ...Subsystem". Use the
subsystem for all of them.

Import task fields: `filename`, `destination_path`, `destination_name`, `automated=True` (no dialogs),
`replace_existing`, `save`, `options`; results come back in `imported_object_paths`. Gotcha in the stub:
**`destination_name` is ignored by Interchange**, which handles most formats in 5.8. Check
`imported_object_paths` and rename if needed, and don't assume the name you asked for.

Other notes: Epic no longer supports defining a `BlueprintFunctionLibrary` in Python (the types are transient
and break on save/load). Old `remove_lo_ds`-style names were renamed (`remove_lods`). Prefer engine types
(`unreal.Vector`, `unreal.Transform`) over tuples.

```python
import unreal
actors = unreal.get_editor_subsystem(unreal.EditorActorSubsystem)
mesh = unreal.EditorAssetLibrary.load_asset("/Game/Props/Chest/SM_Chest")
with unreal.ScopedEditorTransaction("Place chests"):
    for i in range(3):
        a = actors.spawn_actor_from_object(mesh, unreal.Vector(i * 200, 0, 0))
        a.set_actor_label(f"Chest_{i}")
unreal.get_editor_subsystem(unreal.LevelEditorSubsystem).save_current_level()
```

## B. Writing MCP toolsets

The server lists 3 meta-tools (`list_toolsets`, `describe_toolset`, `call_tool`). `mcp.mjs` wraps them:
`node gen/unreal/mcp.mjs describe <toolset>` before calling anything new. Python toolset names are
module path + class (`megajam_tools.toolsets.MegajamTools`); C++ ones are `Plugin.Class`
(`EditorToolset.EditorAppToolset`).

**Python** (our path, in `unreal/Plugins/MegajamTools/Content/Python/megajam_tools/toolsets.py`):

- `@unreal.uclass()` class that inherits `unreal.ToolsetDefinition`. The class docstring (1-3 sentences on the
  domain) is often the only thing the agent sees.
- Each tool: `@toolset_registry.tool_call` **above** `@staticmethod`. Annotate every parameter and the return,
  using plain Python types (`list[str]`, `dict[str, int]`; dict keys must be `str`). A missing annotation raises
  at import time and the toolset does not register.
- Google-style docstring (`Args:` / `Returns:`). Document only units, ranges, encodings, and what empty means.
- Optional: a default (`x: int = 42`) goes into the schema as `default` and is not required. `T | None = None`
  for nullable. (Checked against Epic's `test_demo_toolset.py`.)
- Errors: **raise**. The decorator turns it into a script error the client sees. Never return `False` or an
  error string. Return data (actual types, `unreal.Object` subclasses, `ustruct`s), not JSON in a `str`.
- Registration is not automatic: `Registration([MyToolset]).register()` from `init_unreal.py` (what we do).
- Don't copy existing tools: `ObjectTools` already does generic property get/set, `AssetTools` does import.

**C++**: `UCLASS(BlueprintType, Hidden)` subclass of `UToolsetDefinition`; static
`UFUNCTION(meta=(AICallable))` methods. The doc comment becomes the description; `meta=(AIIgnore)` hides a
function. Register with `UToolsetRegistry::RegisterToolsetClass` in `StartupModule`. Long jobs return a
`UToolCallAsyncResult` subclass (`SetValue`/`SetError`). Only for things Python can't reach.

**Reload and refresh** (after editing a toolset):

1. Python: `toolset_registry.reload_module(megajam_tools)` reloads the package and re-registers its toolsets.
   Epic's driver `ToolsetRegistry/Content/Python/toolset_registry/tests/reload_remote.py megajam_tools` needs
   Project Settings > Python > Enable Remote Execution. Without it: console
   `py import megajam_tools, toolset_registry; toolset_registry.reload_module(megajam_tools)` (unverified).
2. Console `ModelContextProtocol.RefreshTools` so the server re-reads tools. If the client still has the old
   schema, reconnect (`mcp.mjs` opens a new session for each process, so the next script run is enough).
3. C++: Live Coding updates function bodies only. A **new UFUNCTION needs an editor restart.**
4. Verify: `mcp.mjs describe <toolset>` shows the new signature, then call it once.

**Schema strictness (C++ tools).** The `required` list comes from the C++ signature, and struct parameters
are often required even when the docs call them optional. Found so far: `EditorAppToolset.CaptureViewport` needs
`captureTransform` + `annotations` (see `captureViewport()` in `mcp.mjs`); `find_actors` needs `tag: ''` +
`collision_channels: []`. If a call fails with "input param X is required", pass an empty/zero value, and add
the case to PIPELINE.md.

Tests (Epic's convention): `ToolCallTestCase` in Python, and `LiveCodingToolset.CompileLiveCoding` before
running `AutomationTestToolset` (`DiscoverTests`, then `RunTests`). For the jam, one real call plus a read-back
is enough.

## C. Build it in the editor instead of generating it?

| Tool | Status | Worth it in the jam for | Skip when |
|---|---|---|---|
| **Modeling Mode** (Shift+5; plugin on) | Beta | Manual level blockout: boxes, ramps, stairs, Extrude Polygon/Path, PolyEdit push/pull, booleans. Output is a Static Mesh in the folder set in Quick Settings | The agent is driving: it's a mouse-driven UI with no tools for it |
| **Geometry Scripting** (Python/BP) | Beta (per docs) | Generated simple geometry the agent can script: walls, floors, arches, pipes, blockout kits, boolean cutouts, collision. Output is a real StaticMesh asset, so it works with Nanite | Organic or detailed props: use `gen/asset.mjs` |
| **Editor Utility Widgets** | Production | A button panel for a person (e.g. "rebuild level") | Agent-only work: a toolset tool is faster and testable |
| **Scriptable Tools** (needs Scriptable Tools Editor Mode plugin, off) | Beta | Custom click-in-viewport tools for a person | Almost always in a 93 h jam |

Geometry Script from Python (all verified in the stub):

```python
import unreal as GS
mesh = GS.DynamicMesh()  # transient work mesh (unverified; alt: GS.new_object(GS.DynamicMesh))
opts = GS.GeometryScriptPrimitiveOptions()
GS.GeometryScript_Primitives.append_box(mesh, opts, GS.Transform(), 400, 20, 300)    # cm, origin at base
door = GS.DynamicMesh()
GS.GeometryScript_Primitives.append_box(door, opts, GS.Transform(), 120, 60, 220)
GS.GeometryScript_MeshBooleans.apply_mesh_boolean(mesh, GS.Transform(), door, GS.Transform(),
    GS.GeometryScriptBooleanOperation.SUBTRACT, GS.GeometryScriptMeshBooleanOptions())
new = GS.GeometryScriptCreateNewStaticMeshAssetOptions()
new.set_editor_property("enable_nanite", True)
new.set_editor_property("enable_collision", True)
sm, outcome = GS.GeometryScript_NewAssetUtils.create_new_static_mesh_asset_from_mesh(
    mesh, "/Game/Blockout/SM_WallDoor", new)
```

- Check `outcome` (`GeometryScriptOutcomePins`) before going on, then load the asset and screenshot it.
- Update an existing asset with `GeometryScript_AssetUtils.copy_mesh_to_static_mesh`; give it simple collision with
  `GeometryScript_Collision.set_static_mesh_collision_from_mesh`.
- Assign `MI_*` from `M_PBR_Master` afterwards; generated meshes have no material and no useful UVs (box-project
  UVs with `GeometryScript_UVs` if textures matter).
- Don't ship `DynamicMeshActor` / `GeneratedDynamicMeshActor` in the level. Their component has no Nanite, Lumen
  mesh distance fields or LODs, and the mesh is stored in the level file. Bake to a StaticMesh.

## D. Agent Skills inside the editor

Skills are named instruction packs served by `AgentSkillToolset` (`ListSkills` returns path to description,
`GetSkills([paths])` returns instructions, plus `CreateSkill` and `UpdateSkill`). Call `ListSkills` when starting
unfamiliar editor work; Epic ships `blueprint_basics`, `material_basics`, `default_outdoor_lighting`, and
`unreal_skill_best_practices`.

Our own skill, as a Python class (version-controlled with the plugin, which is better than a UAsset from `CreateSkill`):

```python
# MegajamTools/Content/Python/megajam_tools/skills/kit_conventions.py
import unreal
from toolset_registry.agent_skill import agent_skill

@agent_skill
class MegajamKitConventionsSkill(unreal.AgentSkill):
    """Project conventions for the megajam game: folders, naming, materials, verification.
    Apply before creating or placing any asset in this project."""
    instructions = (
        'Props live in /Game/Props/<Name>/ as SM_, MI_, T_ assets; never create per-asset materials, '
        'make instances of the shared master material.\n'
        'Pivots are at the base; place props at ground height.\n'
        'After any change, read the state back or capture the viewport before reporting success.\n'
    )
```

Import it from `megajam_tools/skills/__init__.py` and import `megajam_tools.skills` from `init_unreal.py`. It
registers itself on import, and a reload is needed after edits. Epic's rules (`unreal_skill_best_practices.py`):
**novel** (only what tools can't teach), **collegial**, **durable** (no tool or property names: they change),
**agnostic** (no model, agent or orchestration names), **parsimonious**. The docstring is the description:
1-2 sentences saying when to apply it. Epic's tool doc says create/update only with the user's permission.
Keep long-lived knowledge in these `docs/ue/*.md` files; use editor skills only for short rules every editor
session must follow.

## Kit issues found while writing this

- `MegajamTools.run_console_command` calls deprecated `unreal.EditorLevelLibrary.get_editor_world()`. Switch to
  `unreal.get_editor_subsystem(unreal.UnrealEditorSubsystem).get_editor_world()`. It also returns `True` as a
  status, which goes against Epic's "return data, raise on failure" rule (harmless).
- Missing tool worth adding: `run_python(code: str) -> str` built on
  `PythonScriptLibrary.execute_python_command_ex`, returning the result and captured log, so errors come back
  instead of only reaching the Output Log.

## Verified against

- Stub `C:\dev\SmokeTest\Intermediate\PythonStub\unreal.py` (2026-10-24): `get_editor_subsystem`,
  `EditorActorSubsystem` (spawn_actor_from_object/_from_class, get_all_level_actors, get/set_selected_level_actors,
  destroy_actor, duplicate_actor), `UnrealEditorSubsystem` (get_editor_world, get/set_level_viewport_camera_info),
  `LevelEditorSubsystem` (load_level, new_level, save_current_level, save_all_dirty_levels, editor_play_simulate,
  editor_request_end_play, is_in_play_in_editor), `EditorAssetLibrary` (no deprecation flags) and
  `EditorAssetSubsystem`, `EditorLevelLibrary` / `EditorStaticMeshLibrary` / `EditorSkeletalMeshLibrary`
  deprecation text, `StaticMeshEditorSubsystem` (get/set_nanite_settings, set_lods, get_lod_count),
  `AssetImportTask` fields (incl. Interchange note), `AssetTools.import_asset_tasks`, `AssetToolsHelpers.get_asset_tools`,
  `_ObjectBase.set_editor_property/get_editor_property/set_editor_properties`, `ScopedEditorTransaction`,
  `ScopedSlowTask` (make_dialog, enter_progress_frame, should_cancel), `log*`, `SystemLibrary.execute_console_command`,
  `PythonScriptLibrary.execute_python_command_ex`, `EditorUtilitySubsystem.spawn_and_register_tab`/`try_run`,
  `ToolsetDefinition`, `ToolsetRegistry.register_toolset_class`, `AgentSkill`, `DynamicMesh`, `DynamicMeshPool`,
  `GeometryScript_Primitives.append_box`, `GeometryScript_MeshBooleans.apply_mesh_boolean`,
  `GeometryScript_NewAssetUtils.create_new_static_mesh_asset_from_mesh` (returns `(StaticMesh, outcome)`;
  options `enable_nanite`, `enable_collision`), `GeometryScript_AssetUtils.copy_mesh_to_static_mesh`,
  `GeometryScript_Collision.set_static_mesh_collision_from_mesh`, `GeneratedDynamicMeshActor`.
- Engine source, UE_5.8: `ToolsetRegistry/Content/Python/toolset_registry/{tool_call_impl,registration,agent_skill,_reload}.py`,
  `tests/{demo_toolset,test_demo_toolset,reload_remote}.py`; `ToolsetRegistry/Public/ToolsetRegistry/AgentSkill.h`;
  `ModelContextProtocolModule.cpp` (RefreshTools/StartServer/StopServer); `EditorToolset/.../toolsets/programmatic.py`;
  `editor_toolset/skills/unreal_skill_best_practices.py`; uplugins (ModelingToolsEditorMode, ScriptableToolsEditorMode Beta).
- Engine Python: `Engine/Binaries/ThirdParty/Python3/Win64/python.exe` = 3.11.8.
- Claude Code skills `create-toolset`, `unreal-skill`, `unreal-mcp` (synced plugin).
- Unverified: the `py import ...; reload_module(...)` one-liner; `unreal.DynamicMesh()` as a standalone work
  mesh (a common pattern, not run here).

## Sources (5.8)

- Python scripting: https://dev.epicgames.com/documentation/en-us/unreal-engine/scripting-the-unreal-editor-using-python?application_version=5.8
- Unreal MCP: https://dev.epicgames.com/documentation/en-us/unreal-engine/unreal-mcp-in-unreal-editor?application_version=5.8
- Geometry Scripting: https://dev.epicgames.com/documentation/en-us/unreal-engine/geometry-scripting-users-guide-in-unreal-engine?application_version=5.8
- Modeling Mode: https://dev.epicgames.com/documentation/en-us/unreal-engine/modeling-mode-in-unreal-engine?application_version=5.8
- Scriptable Tools: https://dev.epicgames.com/documentation/en-us/unreal-engine/scriptable-tools-system-in-unreal-engine?application_version=5.8
- Python API: https://dev.epicgames.com/documentation/en-us/unreal-engine/python-api/?application_version=5.8

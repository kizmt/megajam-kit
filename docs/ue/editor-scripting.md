# Editor scripting and in-editor content (UE 5.8.4)

How the agent changes the editor: Epic's Unreal MCP toolsets first, our own Python toolset (`MegajamTools`)
for anything missing, and in-editor geometry when it beats generating an asset. Rules: one session drives the
editor; pipeline steps are scripts; verify every change by reading state back or taking a screenshot; check the
Python stub or headers before writing an API call from memory.

## Rules that bite

- **Arbitrary Python goes through `MegajamTools.run_python(code)`.** It runs a Python string in the editor and
  returns `OK`/`ERROR` plus everything printed and the traceback. (Epic's `ProgrammaticToolset.execute_tool_script`
  is a sandbox that only batches other tools.) Pattern from a prototype: keep each script in a file under the
  project's `Generated/scripts/*.py`, bind inputs as globals, then send `exec(open(path).read())` through
  `run_python`, so the script is versioned and re-runnable. `run_console_command` with `py "C:/path/script.py"`
  also works but is fire-and-forget (errors only reach the Output Log).
  **5.9:** Epic's `EditorToolset` adds `PythonScriptingTools` with `execute_python`, which runs real editor Python
  (plus `search_symbols`, `get_symbol`, `grep_stubs` for API lookup, and `read_me`, meant to be called once per
  conversation). It rejects scripts with imports that aren't at the top level or star imports (the error names the
  line), returns the value of the final expression (or the awaited value), and sends `print` output to the Output Log
  (`LogPython`), not the result. A script can call other tools with `await call_tool(name, **arguments)` (full tool
  name; reading a field the tool doesn't return raises `KeyError` listing the fields). Epic: one script for many
  edits, single tool calls for inspection, screenshots and compile errors. Keep `run_python` where the printed output
  or traceback is needed in the result (docs/ue59/pages/using-python-with-ai-agents-in-unreal-engine.md).
- **MCP calls are serial.** Tools run on the game thread, and Epic says clients must not overlap calls. This is
  why one session drives the editor. Do the next call after the previous one returns.
  **5.9:** Claude Code stops waiting for a call after about 120 s. Send a `progressToken` in `_meta` for
  `notifications/progress` heartbeats, or split long work (Live Coding builds, large scripts, asset scans, automation
  runs) into shorter calls (docs/ue59/pages/unreal-mcp-in-unreal-editor.md).
- **Read results.** Many tools report failure in the payload, not as an MCP error. `mcp.ts` throws on `isError`;
  for anything else, read back (`get_editor_property`, a find/list tool, `captureViewport()`).
- **Save points.** Tool edits are not always undoable (imports never are). Save before and after bulk changes.
  Since 5.8.1 Epic's MCP disables transactions during tool script execution (`execute_tool_script` and the AI
  Assistant), so Ctrl+Z can't revert such a batch as one step, and Recovery Hub, which replays transactions, likely
  doesn't record it (inference). `features.md` "Recovery Hub" is not a substitute for saving.
- **Confirm the editor says 5.8.4.** The 5.8.1-5.8.4 hotfixes fixed crashes our scripts can hit: adding a component to
  a Blueprint with no SimpleConstructionScript, MCP tools/call response framing, renaming widgets in a WBP with a null
  parent class, a Python crash at editor shutdown, and adding a function call node via an editor script.
  **5.9:** every MCP `initialize` result carries `_meta["com.epicgames.unrealengine/instance"]` (instance ID, process
  ID, engine version, branch, changelist, project name, engine and project folders): read it to confirm which editor
  and engine answered before changing anything (docs/ue59/pages/unreal-mcp-in-unreal-editor.md).
- **A scripted edit is not saved until the file on disk changed.** Many Python edits don't mark the asset dirty, so a
  normal save (`only_if_is_dirty=True`, `save_directory`, Save All) silently skips it and the edit lives only in the
  editor's memory: it works in PIE, then vanishes from the build and the next session. Seen with input mapping keys,
  montage notifies and skeleton curve metadata, in two prototypes. Always save each edited asset with
  `save_loaded_asset(x, only_if_is_dirty=False)`, then **check the disk**: `git status` (or the file's timestamp)
  must show that `.uasset` modified. Reading the asset back in the same editor proves nothing.
- **World Partition actors: `modify()` first, then save each actor's own package.** A script moved 29 actors with
  `set_actor_location`, and `save_dirty_packages` saved none of them (lost on reload). `a.modify()` before the change,
  then `EditorLoadingAndSavingUtils.save_packages([a.get_package() for a in moved], False)` saved all; check with
  `git status` on `__ExternalActors__`.
- **A running `-game` test locks the packages it loaded.** The `-game` process is an editor build and keeps those
  files open: an editor save of them fails (`MoveFile ... (Error Code 32)`, retried, then `Error saving` and a modal
  "failed to save" dialog). New files still save. Finish or stop the test before saving assets; do read-only editor
  work meanwhile.
- **Never `reload_packages` a dirty asset from a script.** `EditorLoadingAndSavingUtils.reload_packages` raises a
  modal "Would you like to reload these assets?" window per modified package; the game thread waits on it and every
  MCP call times out while the editor still shows "Responding". To undo a scripted preview, set the old values back
  (read them first) or preview on a throwaway duplicate. Recovery: `debugging.md` B (MCP timeouts).
- **Assert every `load_asset`.** It returns None for a wrong path, and many setters then do nothing silently (a
  material instance with a None parent renders the engine's grey checker with no error; a CDO property set to
  `load_asset(wrong_path)` became None with no error).
- **Blueprint CDO edits reach instances only after a compile.** Set the defaults on
  `get_default_object(bp.generated_class())`, then `BlueprintEditorLibrary.compile_blueprint(bp)` (again, even if you
  just compiled), then save, and only then place or spawn instances. Instances copy only the properties listed at
  compile time (`CustomPropertyListForPostConstruction`), so a default set after the compile reads back fine on the
  CDO but spawns as the old value (seen on an Actor BP and an Anim BP). Respawn instances placed before the edit.
- **Opening an asset editor can write `Config/DefaultEditor.ini`** (a blend space editor wrote preview-scene
  settings). Run `git status Config/` after any scripted asset-editor open and revert what you didn't mean to change.
- **Opening a World Partition level from a script loads none of its streamed actors**, so the level looks empty and
  scripts miss actors. Load them first: `worldbuilding.md` "World Partition from Python".
- **Not during PIE.** Asset and level tools act differently while Play-In-Editor runs. Asset creation, duplication
  and saves fail with only `LogUtils: Error: The Editor is currently in a play mode` in the Output Log (a
  `duplicate_asset` just returned None). `UnrealEditorSubsystem.get_game_world()` is not None while PIE runs, and
  `py.ts` warns. The director may be playing: wait or ask, never stop their PIE.
- **A rebuild chain that re-imports assets a level uses runs every offline step first and the editor steps last,
  back to back** (import, then landscape, then placement). Between a `replace_existing` re-import and the placement
  step the level is broken: placed actors keep old transforms with new geometry, or point at deleted meshes. Tell the
  director before the editor steps start.
- **Python runs only in the editor binary** (embedded Python 3.11.8): the editor (which can reach the PIE world) and
  `UnrealEditor.exe -game` (the test harness, `debugging.md` F). Packaged builds have none, so gameplay code is C++.
## A. Python in the editor

Setup: Python Editor Script Plugin (on in our project). Turn on **Editor Preferences > Plugins > Python > Developer
Mode** (per user; SETUP step 2) and restart; the editor then writes the stub
`<Project>/Intermediate/PythonStub/unreal.py` (~34 MB).
**Search it, don't read it.** Every Python call below was checked there.

Ways to run Python:

| How | Use |
|---|---|
| `py "C:/x/script.py"` or `py <one statement>` (console) | One-off scripts; through `MegajamTools.run_console_command` |
| `init_unreal.py` in any `Content/Python` folder | Runs at editor startup. Ours registers `MegajamTools` |
| `UnrealEditor-Cmd.exe P.uproject -run=pythonscript -script="C:\\x.py"` | Headless batch. It loads no level, so call `load_level` yourself |
| `MegajamTools.run_python(code)` (MCP) | The default for agent scripts: returns status, output and traceback |
| `unreal.PythonScriptLibrary.execute_python_command_ex(cmd, mode)` | Runs code and returns `(command_result, log_output)`, or None when it failed |

Search paths: `Content/Python` folders of the project, the engine and every enabled plugin, plus Additional
Paths / `UE_PYTHONPATH`. The interpreter is isolated by default.
**5.9:** the page also lists `Documents/UnrealEngine/Python` in the user folder, and C++ can add paths through
`IPythonScriptPlugin::GetAdditionalPathsInterface()` (`IPythonAdditionalPaths`: `AddAdditionalPath` takes an existing
absolute path and returns false if invalid or already on `sys.path`; an optional mount point root gives
Python-generated types stable names; `RemoveAdditionalPath` / `RemoveAdditionalPaths(Owner)` don't unload modules).
The Python Foundation Packages plugin was removed (docs/ue59/pages/scripting-the-unreal-editor-using-python.md,
docs/ue59/pages/unreal-engine-5-9-release-notes.md).
**5.9: Blueprint classes and User Defined Structs get their own Python wrapper types.** An Actor Blueprint `BP_MyActor`
is `BP_MyActor_C` (a subclass of `unreal.Actor`) with its added properties and functions directly accessible; a User
Defined Struct is its own subclass of `unreal.StructBase`. `isinstance()` checks and `get_editor_property()` reads work
either way; code that compares `type(obj)` with a native class or relies on the Python type name must change. The 5.8
behaviour returns with the console variables `Engine.Python.WrapBlueprintClassesOnDemand` and
`Engine.Python.WrapUserDefinedStructsOnDemand` set to false (both default true)
(docs/ue59/pages/scripting-the-unreal-editor-using-python.md).

### APIs we use most (5.8 status)

| Job | Use | Avoid (deprecated in 5.8) |
|---|---|---|
| Get a subsystem | `unreal.get_editor_subsystem(unreal.EditorActorSubsystem)` | - |
| Spawn, list, select, destroy actors | `EditorActorSubsystem.spawn_actor_from_object/_from_class`, `get_all_level_actors`, `get_selected_level_actors`, `set_selected_level_actors`, `destroy_actor`, `duplicate_actor` | `EditorLevelLibrary.*` (whole class) |
| Editor world, viewport camera | `UnrealEditorSubsystem.get_editor_world`, `get_level_viewport_camera_info`, `set_level_viewport_camera_info` | `EditorLevelLibrary.get_editor_world` |
| Levels, PIE | `LevelEditorSubsystem.load_level`, `new_level`, `save_current_level`, `save_all_dirty_levels`, `editor_play_simulate`, `editor_request_end_play`, `is_in_play_in_editor`. Copy a level with `new_level_from_template(new, template)` (creates, saves and opens the copy). Open or create a map in its own `run_python` call | `EditorLevelLibrary.load_level/save_*`; `duplicate_asset` of a map then `load_level` of the copy in one call (editor crash: "World Memory Leaks", `EditorServer.cpp`) |
| Assets | `EditorAssetLibrary` (not deprecated) or `EditorAssetSubsystem`: `does_asset_exist`, `load_asset`, `save_asset`, `list_assets`, `delete_asset`, `rename_asset`, `duplicate_asset` | `os.rename`/`shutil` on .uasset files |
| Mesh LODs, Nanite | `StaticMeshEditorSubsystem.get_nanite_settings/set_nanite_settings`, `set_lods`, `get_lod_count` | `EditorStaticMeshLibrary.*`, `EditorSkeletalMeshLibrary.*` |
| Import a file | `AssetImportTask` + `AssetToolsHelpers.get_asset_tools().import_asset_tasks([task])` | - |
| Properties | `obj.set_editor_property(name, v)`, `get_editor_property`, `set_editor_properties({...})` | Direct `obj.attr = v` (skips pre/post-edit logic, like a Details panel edit would run) |
| Undo grouping | `with unreal.ScopedEditorTransaction("Place props"):` | - |
| Progress bar | `with unreal.ScopedSlowTask(n, "Working") as t: t.make_dialog(True); t.enter_progress_frame(1)`; check `t.should_cancel()` | - |
| Logging | `unreal.log`, `log_warning`, `log_error` | `print` (works, but not tagged) |
| Line traces | `SystemLibrary.line_trace_single(...)` and the like with `unreal.TraceTypeQuery.ECC_VISIBILITY` (or `ECC_CAMERA`) | `TRACE_TYPE_QUERY1/2`: same values, but warn on every call in 5.8 |

Every `EditorLevelLibrary` function except the spawns, `replace_selected_actors`, `get_pie_worlds` and
`editor_end_play` carries "The Editor Scripting Utilities Plugin is deprecated - use ...Subsystem". Use the
subsystem for all of them.

- **5.9:** the 5.9 page documents an `UnsavedChangesPolicy` argument on `LevelEditorSubsystem.load_level`: the
  default, Fail, raises an error naming the packages with unsaved changes instead of discarding them; `Save` saves
  them before the level loads (docs/ue59/pages/scripting-the-unreal-editor-using-python.md).
- **5.9: new scripting libraries** (Blueprint and Python): create and edit Blueprints, graphs, nodes and variables
  (from Python or Editor Utility Blueprints); edit StateTrees (add and rearrange tasks, considerations, evaluators and
  global tasks); build and edit chooser tables; edit Dataflow graphs. PCG gains functions to add and validate graph
  edges, and Blueprints can read and write custom HLSL node source. The release notes name no classes or functions,
  and no 5.9 page documents them: grep the 5.9 stub before using any (docs/ue59/pages/unreal-engine-5-9-release-notes.md).

Import task fields: `filename`, `destination_path`, `destination_name`, `automated=True` (no dialogs),
`replace_existing`, `save`, `options`; results come back in `imported_object_paths`. Gotcha in the stub:
**`destination_name` is ignored by Interchange**, which handles most formats in 5.8. Check
`imported_object_paths` and rename if needed, and don't assume the name you asked for.
**Animation-only FBX import ignores `import_mesh=False`:** `FbxFactory` + `FbxImportUI` (`import_mesh=False`,
`mesh_type_to_import=FBXIT_ANIMATION`, skeleton set) goes through Interchange in 5.8 and still makes a SkeletalMesh,
a PhysicsAsset and the animation named `<name>_Anim` (on the given skeleton, and correct). Delete the
non-AnimSequence outputs and rename the animation. Driving the Interchange pipeline settings directly is untried.
**An FBX with named material slots** imports one material per slot next to the mesh: delete them after assigning
the real MIs.

**Reimports keep the old asset's settings and collision** (5.8.4, seen on a prototype):
- **Static meshes with `UCX_` hulls: delete the asset, then import fresh** with a plain automated `AssetImportTask`
  (no `FbxImportUI` options). Meshes with 3 UCX hulls each came in with 0 hulls through `FbxImportUI` options, and
  again through a plain task with `replace_existing` over the existing asset; a fresh import after deleting gave 3.
  Assert `StaticMeshEditorSubsystem.get_convex_collision_count(mesh) > 0` after the import. The delete nulls every
  reference to the mesh: re-link its users before any save (section E, "A forced delete").
- **Interchange `reimport_asset` returns None, silently, on kit-imported skeletal meshes.** Meshes imported by
  `import_skeletal.py` (`FbxFactory` + `FbxImportUI`) carry legacy `FbxSkeletalMeshImportData`, which Interchange's
  reimport doesn't take. To add bones in place, run `import_skeletal.py` with `--arg in_place=1`: it imports over the
  mesh with its own skeleton and import transform, so the object, its material slots, physics asset and referencers
  stay (the method was proven by hand; the script option is untested). Clips that key the new bone must be re-imported (record what references them first:
  `find_package_referencers_for_asset`); the others keep the bind pose for it.

Other notes: Epic no longer supports defining a `BlueprintFunctionLibrary` in Python (the types are transient
and break on save/load). Old `remove_lo_ds`-style names were renamed (`remove_lods`). Prefer engine types
(`unreal.Vector`, `unreal.Transform`) over tuples.

```python
import unreal
actors = unreal.get_editor_subsystem(unreal.EditorActorSubsystem)
mesh = unreal.EditorAssetLibrary.load_asset("/Game/Props/Chest/SM_Chest")
assert mesh, "SM_Chest not found"
with unreal.ScopedEditorTransaction("Place chests"):
    for i in range(3):
        a = actors.spawn_actor_from_object(mesh, unreal.Vector(i * 200, 0, 0))
        a.set_actor_label(f"Chest_{i}")
unreal.get_editor_subsystem(unreal.LevelEditorSubsystem).save_current_level()
```

## B. Writing MCP toolsets

The server lists 3 meta-tools (`list_toolsets`, `describe_toolset`, `call_tool`). `mcp.ts` wraps them:
`node gen/unreal/mcp.ts describe <toolset>` before calling anything new. Python toolset names are
module path + class (`megajam_tools.toolsets.MegajamTools`); C++ ones are `Plugin.Class`
(`EditorToolset.EditorAppToolset`).
**5.9:** tool search returns **4** meta-tools: `list_toolsets`, `describe_toolsets` (plural; one or more toolsets,
schemas only with `include_schemas: true`), `describe_tools` (full schemas for `Toolset.Tool` names; an error per
unknown name) and `call_tool` (no toolset name calls a top-level tool). `mcp.ts` was written for 5.8's three
(docs/ue59/pages/unreal-mcp-in-unreal-editor.md).
**5.9:** tools come from the **All Toolsets** plugin (enable it in Edit > Plugins, then restart) on top of Unreal MCP;
both depend on Toolset Registry. New toolsets cover Blueprints, editor actions, MVVM, Slate inspection, performance,
files, scene capture, console, Texture Graph, widget animation and more; the Toolset Registry controls which
toolsets agents may use, and an MCP Client toolset manages a list of external MCP servers. Editor subsystems and
Blueprint function libraries can implement `IToolsetProvider` and expose tools without a wrapper
(`LevelSequenceEditorSubsystem`, `PCGEditorSubsystem`, `WidgetBlueprintEditorSubsystem`)
(docs/ue59/pages/unreal-mcp-in-unreal-editor.md, docs/ue59/pages/unreal-engine-5-9-release-notes.md).

**Keep "Enable Tool Search" on** (Editor Preferences > General > Model Context Protocol; default on). With it off,
`tools/list` returns every tool schema instead of the 3 meta-tools `mcp.ts` expects. The server speaks HTTP/SSE only
(no stdio) on `http://127.0.0.1:8000/mcp` and has "no authentication layer": keep it on localhost.

- **5.9: MCP settings moved and grew.** Editor Preferences > **Agentic Workflows > Model Context Protocol**: Auto
  Start Server (true), Server Port Number (8000), Server URL Path (`/mcp`), Enable Tool Search (true), Additional
  Allowed Origins (empty; each entry widens DNS-rebinding exposure; requests are checked against `localhost`,
  `127.0.0.1`, `[::1]`), Dump Media To Disk (false; writes MCP images/audio to `Saved/ModelContextProtocol/`),
  Instructions (sent to every client on connect, this user only), and MCP Client > Client Selection + Generate
  Client Config (writes `.mcp.json` with an `unreal-mcp` entry to the project root on installed builds, the engine root
  on source builds; JSON configs merge and update that entry's URL). The release notes also add a setting for the
  highest protocol version accepted (no name given). New project page: Project Settings > Agentic Workflows > Model
  Context Protocol > **Instructions**, stored in `DefaultGame.ini`, sent to everyone; clients reconnect to pick up
  instruction changes (docs/ue59/pages/unreal-mcp-in-unreal-editor.md,
  docs/ue59/pages/unreal-engine-5-9-release-notes.md).
- **5.9: ports and console.** `ModelContextProtocol.StartServer [port]`, `StopServer`, `RefreshTools`,
  `GenerateClientConfig <ClaudeCode|Cursor|VSCode|Gemini|Codex|All>`; flags `-ModelContextProtocolStartServer`
  (also for commandlets, which don't auto-start) and `-ModelContextProtocolPort=N`. A second editor (another engine
  version or an agent-launched one) needs its own port and its own, differently named `.mcp.json` entry, added by hand.
  CVars: `ModelContextProtocol.WrapPODToolResultsInObject` (true: primitive results come as `{"result": ...}`),
  `AudioResultOggFormat`, `ProgressIntervalSeconds`, `PaginationPageSize` (0 = off), `EnableAnalytics`. More detail:
  `Log LogModelContextProtocol Verbose`; registry problems log to `LogToolsetRegistry`
  (docs/ue59/pages/unreal-mcp-in-unreal-editor.md).
- **5.9: restart from the agent** with `EditorToolset.EditorAppToolset` `ExitEditor` (`bDiscardUnsavedChanges` if
  needed), then start the editor again; clients reconnect (docs/ue59/pages/unreal-mcp-in-unreal-editor.md).

**Python** (our path, in `unreal/Plugins/MegajamTools/Content/Python/megajam_tools/toolsets.py`):

- `@unreal.uclass()` class that inherits `unreal.ToolsetDefinition`. The class docstring (1-3 sentences on the
  domain) is often the only thing the agent sees.
- Each tool: `@toolset_registry.tool_call` **above** `@staticmethod`. Annotate every parameter and the return,
  using plain Python types (`list[str]`, `dict[str, int]`; dict keys must be `str`). A missing annotation raises
  at import time and the toolset does not register.
  **5.9:** declare each tool's access mode: `@toolset_registry.tool_call(mode=unreal.ToolAccessMode.READ)` (or
  `WRITE`, `EXECUTE`). Methods without both decorators are not advertised. Type hints: `list[T]` -> `unreal.Array(T)`,
  `dict[str, V]` -> `unreal.Map(str, V)`, `set[T]` -> `unreal.Set(T)`, `T | None` makes a parameter optional. Tools
  can be `async def` for long work (docs/ue59/pages/using-python-with-ai-agents-in-unreal-engine.md).
- Google-style docstring (`Args:` / `Returns:`). Document only units, ranges, encodings, and what empty means.
- Optional: a default (`x: int = 42`) goes into the schema as `default` and is not required. `T | None = None`
  for nullable. (Checked against Epic's `test_demo_toolset.py`.)
- Errors: **raise**. The decorator turns it into a script error the client sees. Never return `False` or an
  error string. Return data (actual types, `unreal.Object` subclasses, `ustruct`s), not JSON in a `str`.
- Registration is not automatic: `Registration([MyToolset]).register()` from `init_unreal.py` (what we do).
- Don't copy existing tools: `ObjectTools` already does generic property get/set, `AssetTools` does import.
  **5.9:** the `ImportFile` tools (Sound Waves, Textures, Static Meshes, Skeletal Meshes, Data Tables, Curve Tables,
  String Tables) take `bReplaceExisting` and `bSave`, both false by default; each replaces only an asset of its own
  class, and `bSave` runs save validators (docs/ue59/pages/unreal-mcp-in-unreal-editor.md).
- **5.9 tests:** put unit tests in a `tests` package inside the toolset's package and register them from
  `init_unreal.py` with `from _unittest_runner.unittest_runner_bridge import register_test_runner` +
  `register_test_runner('<pkg>.tests', '<Automation.Path>')`; they then show in the Session Frontend automation tests
  (docs/ue59/pages/using-python-with-ai-agents-in-unreal-engine.md).

**C++**: `UCLASS(BlueprintType, Hidden)` subclass of `UToolsetDefinition`; static
`UFUNCTION(meta=(AICallable))` methods. The doc comment becomes the description; `meta=(AIIgnore)` hides a
function. Register with `UToolsetRegistry::RegisterToolsetClass` in `StartupModule`. Long jobs return a
`UToolCallAsyncResult` subclass (`SetValue`/`SetError`). Only for things Python can't reach.
**5.9:** add `AIAccessMode = "Read"`, `"Write"` or `"Execute"` to every tool (default Execute; sent to clients as the
MCP `readOnlyHint`). `AIRuntimeCallable` (implies `AICallable`) is the only tag that puts a tool in cooked builds. To
call tools on an object instead of statically, override `UsesInstanceDispatch()` (the registry finds one target,
e.g. a subsystem) or `UsesInstanceArgument()` (each tool gets a reserved `instance` argument), not both. A function for
both Python and agents: `meta = (PythonCallable, AICallable, AIAccessMode = "Read")`. Example toolset:
`GASToolsets` `UAttributeSetToolset` (docs/ue59/pages/unreal-mcp-in-unreal-editor.md,
docs/ue59/pages/scripting-the-unreal-editor-using-python.md).

**Reload and refresh** (after editing a toolset):

1. Python: `toolset_registry.reload_module(megajam_tools)` reloads the package and re-registers its toolsets.
   Epic's driver `ToolsetRegistry/Content/Python/toolset_registry/tests/reload_remote.py megajam_tools` needs
   Project Settings > Python > Enable Remote Execution. Without it: console
   `py import megajam_tools, toolset_registry; toolset_registry.reload_module(megajam_tools)` (unverified).
2. Console `ModelContextProtocol.RefreshTools` so the server re-reads tools. If the client still has the old
   schema, reconnect (`mcp.ts` opens a new session for each process, so the next script run is enough).
3. C++: Live Coding updates function bodies only. A **new UFUNCTION needs an editor restart.**
4. Verify: `mcp.ts describe <toolset>` shows the new signature, then call it once.

**Schema strictness (C++ tools).** The `required` list comes from the C++ signature, and struct parameters
are often required even when the docs call them optional. Found so far: `EditorAppToolset.CaptureViewport` needs
`captureTransform` + `annotations` (see `captureViewport()` in `mcp.ts`); `find_actors` needs `tag: ''` +
`collision_channels: []`; `AgentSkillToolset.GetSkills` needs `{"skillPaths": [...]}`; `LogsToolset.GetLogEntries`
needs `pattern`, `category` and `maxEntries` (all required). If a call fails with "input param X is required",
pass an empty/zero value, and add the case to PIPELINE.md.

Tests (Epic's convention): `ToolCallTestCase` in Python, and a Live Coding compile before running
`AutomationTestToolset` (`DiscoverTests`, then `RunTests`). For the jam, one real call plus a read-back is enough.
The `unreal-mcp` skill names `LiveCodingToolset.CompileLiveCoding`, which 5.8.4 doesn't register: compile with the
`LiveCoding.Compile` console command (`cpp.md` "Live Coding vs full rebuild").

## C. Build it in the editor instead of generating it?

| Tool | Status | Worth it in the jam for | Skip when |
|---|---|---|---|
| **Modeling Mode** (Shift+5; plugin on) | Beta | Manual level blockout: boxes, ramps, stairs, Extrude Polygon/Path, PolyEdit push/pull, booleans. Output is a Static Mesh in the folder set in Quick Settings | The agent is driving: it's a mouse-driven UI with no tools for it |
| **Geometry Scripting** (Python/BP) | Beta (per docs) | Generated simple geometry the agent can script: walls, floors, arches, pipes, blockout kits, boolean cutouts, collision. Output is a real StaticMesh asset, so it works with Nanite | Organic or detailed props: use `gen/asset.ts` |
| **Editor Utility Widgets** | Beta (5.8 Beta hub) | A button panel for a person (e.g. "rebuild level") | Agent-only work: a toolset tool is faster and testable |
| **Scriptable Tools** (needs Scriptable Tools Editor Mode plugin, off) | Beta (`features.md`) | Custom click-in-viewport tools for a person | Almost always in a 93 h jam |

Geometry Script from Python (verified in the stub except where marked):

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
- **Check collision on every generated level mesh.** A prototype's 27 script-built boxes had no simple collision
  (`CTF_UseDefault`): traces passed through the floor and the navmesh built empty, unnoticed for three rounds.
  Fix: `StaticMeshEditorSubsystem.add_simple_collisions(sm, unreal.ScriptCollisionShapeType.BOX)`. Prove it with a
  downward line trace onto each walkable piece.
- `create_new_static_mesh_asset_from_mesh` is on `GeometryScript_NewAssetUtils`, not `GeometryScript_AssetUtils`.
- Triangle count: `DynamicMesh.get_triangle_count()`. (`GeometryScript_MeshQueries.get_num_triangle_ids` doesn't
  exist; the stub spells it `get_num_triangle_i_ds`.)
- **`append_simple_extrude_polygon` shades its top face as a dome:** every top vertex is a rim vertex sharing normals
  with the sides, so normals tilt to z ~ 0 at the edge. Call `GeometryScript_Normals.set_per_face_normals(mesh)`
  after the extrude.
- **Triangle winding:** a triangle's front face is `(c-a) x (b-a)`, not `(b-a) x (c-a)` (UE is left-handed). Don't
  assume it: read it from the engine (the first triangle of an `append_box` faces out).
- `GeometryScript_MeshQueries.get_mesh_volume_area` returns `(surface_area, volume)`: the volume is `[1]`. A negative
  volume means the mesh is inside out (a quick check after `append_sweep_polygon`).
- `append_buffers_to_mesh` is in `GeometryScript_MeshEdits`; there is no `GeometryScript_MeshBasicEdits`.
- **Moving a box's vertices keeps its UV topology.** `append_box` then `set_vertex_position` (thin wedges) gave
  smeared stripes after `set_per_face_normals` + box projection: one triangle kept UV elements shared with a
  neighbouring face. Build such shapes with `append_buffers_to_mesh`, separate vertices per face, so every face is one
  projection island.
- Assign `MI_*` from `M_PBR_Master` afterwards; generated meshes have no material and no useful UVs (box-project
  UVs with `GeometryScript_UVs` if textures matter).
- Don't ship `DynamicMeshActor` / `GeneratedDynamicMeshActor` in the level. Their component has no Nanite, Lumen
  mesh distance fields or LODs, and the mesh is stored in the level file. Bake to a StaticMesh.

## D. Agent Skills inside the editor

Skills are named instruction packs served by `AgentSkillToolset` (`ListSkills` returns path to description,
`GetSkills([paths])` returns instructions, plus `CreateSkill` and `UpdateSkill`). Call `ListSkills` when starting
unfamiliar editor work; Epic ships `blueprint_basics`, `material_basics`, `default_outdoor_lighting`, and
`unreal_skill_best_practices`, plus the Niagara (`vfx.md`) and PCG (`pcg.md`) skills.
**5.9: a skill can be a Markdown folder.** A folder holding a `SKILL.md` (frontmatter `name` + `description`, then the
instructions) is a skill when it sits in `/Skills/` of any enabled plugin, the project's `/Skills/`, or
`Engine/Extras/AgentTools/Skills/`. Keys look like `/Skills/<PluginName>/<folder>` or `/Skills/Project/<folder>` (pass
them to `AgentSkillToolset.GetSkills`); relative links in `SKILL.md` become absolute paths, so files next to it can be
opened. Python skill classes are "discovered automatically, so you do not need to register them"; C++ ones derive
from `UAgentSkill` (docs/ue59/pages/unreal-mcp-in-unreal-editor.md,
docs/ue59/pages/using-python-with-ai-agents-in-unreal-engine.md).

Template for our own skill, as a Python class (version-controlled with the plugin, which is better than a UAsset
from `CreateSkill`). **Not created yet:** the plugin has no `skills/` package; add it only if editor sessions need it.

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

## E. Gotchas found on a prototype (5.8.4)

- **Unsaved scripted edits** (rule and check: "Rules that bite" above). Example: `map_key()` / `unmap_all()` on an
  InputMappingContext didn't dirty it, so the packaged game had no bindings for the new actions.
  `duplicate_asset()` of an InputAction copies its triggers: clear `triggers` on the copy.
- **A struct read from an array property is a copy.** `path.waypoints[i].anchor = a` changes nothing. Rebuild the
  list and set the whole property: `set_editor_property('waypoints', new_list)`.
- **Scripted level rebuilds silently break references** held by other actors (e.g. path points anchored to rebuilt
  actors keep their offsets but lose the anchor, so the offsets become world positions). Re-link by actor label from
  a layout file, have components warn on a null reference at BeginPlay, and run a full autoplay playthrough after
  any rebuild.
- **The asset registry is stale after Python edits.** `find_package_referencers_for_asset` kept listing removed
  references until `AssetRegistry.scan_files_synchronous([...], force_rescan=True)`. For "is this dependency really
  gone", grepping the saved `.uasset` is the reliable check.
- `EditorAssetLibrary.delete_asset` can return True while the file stays on disk until the editor closes.
- **A forced delete silently nulls every reference to the asset in loaded packages, and the next save-all writes the
  nulls.** A rehearsal import script deleted a mesh before re-importing it (the only way its `UCX_` hulls came in);
  run for one mesh, it skipped its re-link step, a DataAsset lost the mesh in memory, the quit script's
  `save_dirty_packages` saved that, and the next package shipped without the mesh (a `-game` test caught it). After
  any delete-and-reimport, re-link; before a save-all, list `EditorLoadingAndSavingUtils.get_dirty_content_packages()`
  so a surprise referencer shows up before it reaches the cook. In a Git LFS repo, `git show <rev>:<file>` returns
  the ~130-byte pointer: grep the working file or the LFS object, not `git show`.
- **Nanite triangle counts:** `StaticMesh.get_num_triangles(0)` returns the fallback mesh, not the source. Copy to a
  DynamicMesh with `copy_mesh_from_static_mesh` (read LOD `MAX_AVAILABLE`) and use `get_triangle_count()`.
- **Positional order traps: always pass keywords.** `unreal.Rotator(a, b, c)` is **(roll, pitch, yaw)**, unlike C++
  `FRotator(Pitch, Yaw, Roll)`: `Rotator(-10, yaw, 0)` set the pitch to `yaw` and a test's camera turn did nothing.
  Write `unreal.Rotator(pitch=..., yaw=...)`. `unreal.Color(a, b, c, d)` is (b, g, r, a). Find positional calls
  with the regex `unreal\.Rotator\([-\d\w]`.
- **Python odds and ends:**
  - `get_all_level_actors()` doesn't return actors spawned with `spawn_actor_from_object(..., transient=True)`, so a
    clean-up by label found none and a re-run doubled every test actor. Find them with
    `GameplayStatics.get_all_actors_of_class(world, cls)`.
  - `EditorActorSubsystem.get_all_level_actors()` doesn't return WorldSettings: use
    `UnrealEditorSubsystem.get_editor_world().get_world_settings()` (e.g. to set the game mode).
  - Actor labels differ from object names (label "DirectionalLight", name `DirectionalLight_0`; label "SM_SkySphere",
    name `StaticMeshActor_0`). Match template actors on `get_name()` when removing them (dict keys: next bullet).
  - **Key dicts of actors by `get_path_name()` (or keep the object), never `get_name()`.** An actor spawned at runtime
    with an `Owner` goes into the owner's level (`LevelActor.cpp`), so under World Partition two cells can each have
    a `Foo_0`. A test keyed by `get_name()` read a waiting group's state for the fighting one; it passed while only one
    group was loaded.
  - `AddComponentByClass` is not exported to Python. Add components with MCP `ActorTools.add_component(owner,
    {refPath: "/Script/Engine.RotatingMovementComponent"}, name)` and set them with `ObjectTools.set_properties`
    (camelCase names, e.g. `rotationRate`, `pivotTranslation`).
  - `ExponentialHeightFogComponent` properties are read-only in the stub: use its `set_*` functions.
  - `BodyInstance` has no `set_collision_profile_name` in Python: `set_editor_property("collision_profile_name", ...)`
    and `collision_enabled`.
  - Water plugin bodies: `on_water_body_changed` is an empty deprecated function; rebuild with a forced-notify property
    set (`worldbuilding.md` "Water").
  - `EditorPerformanceSettings` is reachable only via `unreal.find_object(None,
    "/Script/UnrealEd.Default__EditorPerformanceSettings")`, and its throttle flag only by the C++ name
    `bThrottleCPUWhenNotForeground` ("Use Less CPU when in Background": the user's setting, SETUP step 8; read it,
    don't change it without asking).
- **Wait for Niagara compiles before a capture** (a compiling system draws nothing): `vfx.md` "Niagara over MCP".
- **Blend spaces built from Python play the reference pose until resampled.** Samples set via `set_editor_property`
  look right in the asset, but the runtime data is rebuilt only by `UBlendSpace::ValidateSampleData()` +
  `ResampleData()` (the blend space editor calls them when it opens); neither is exposed to Python. Fix: a small C++
  editor helper (Modify, ValidateSampleData, ResampleData, MarkPackageDirty) called before saving. Opening the editor
  also works but writes `Config/DefaultEditor.ini` (see Rules).
  **A sample moved off the axis grid snaps back** when **either** axis has `snap_to_grid`: `ResampleData` calls
  `ValidateSampleData`, which snaps samples to the closest grid point (`UBlendSpace::SnapSamplesToClosestGridPoint`),
  and the helper still returns true. Turn it off on every axis that has it first: copy each `blend_parameters`
  element, set `snap_to_grid` False, write the whole list back.
- **Anim state machines can't be authored with the Python graph tools.** `BlueprintGraphEditor` creates nodes and links
  pins, but can't add states, transitions or transition rules. A prototype used a small project editor module
  (add_state, add_transition with rule bool / blend time / inertialization / priority, expose_pin, link_pins,
  get_inner_graph) and built the whole ABP from a re-runnable script. A kit editor plugin for this is a candidate.
  **5.9:** new scripting functions create and edit Blueprints, graphs, nodes and variables from Python or Editor
  Utility Blueprints; the release notes don't say whether they cover anim state machines, and no page names the API
  (docs/ue59/pages/unreal-engine-5-9-release-notes.md).
- **AnimGraph Transform (Modify) Bone: a shown pin overrides the node's value.** Setting `Rotation` in the node struct
  did nothing because the Rotation pin is shown by default and its zero default wins. To hide it from Python:
  changing `show_pin` on an element of `get_editor_property('show_pin_for_properties')` doesn't stick; `p.copy()`
  the element, change the copy, set the whole array, then reconstruct the node. The reconstruct writes the old pin
  default back into the struct, so set the value **after** hiding the pin.
- **MCP `call_tool` shape:** `toolset_name` + `tool_name` (the short name) + `arguments`; `toolset` / `tool` keys fail
  with "Missing required parameter".
  **5.9:** with tool search off, tools are listed as `<Toolset>.<Tool>`; `describe_tools` takes that form
  (docs/ue59/pages/unreal-mcp-in-unreal-editor.md).
- **AnimGraphs can be edited with BlueprintTools** (`find_nodes`, `delete_node`, `connect_pins`, `compile_blueprint`),
  although `read_graph_dsl` returns empty for an AnimGraph.
  **5.9:** GraphDsl is now listed as a framework: "a text-based language for authoring and editing graph assets"
  (docs/ue59/pages/unreal-engine-5-9-release-notes.md).
- **AnimBlueprint parent class:** `get_editor_property("parent_class")` fails; use
  `BlueprintEditorLibrary.get_blueprint_parent_class`, and `reparent_blueprint` to change it.
- **AnimGraph nodes from MCP (cached poses, extra slots, layered blends):** `BlueprintTools.find_node_types` needs
  `type_id_filter` and `context_pins`, and listed a new `Use cached pose '<Name>'` only after a recompile;
  `create_node` with the exact type id (`Animation|CachedPoses|Usecachedpose'<Name>'`) worked anyway. `create_node`
  needs `pos {x,y}`; `connect_pins` takes `output_pin` / `input_pin`.
- **AnimGraph nodes from Python:** reach a node by object path,
  `unreal.find_object(None, "<ABP path>:AnimGraph.AnimGraphNode_Slot_1")`. Nodes inside a state machine: iterate
  `unreal.ObjectIterator(unreal.AnimGraphNode_BlendSpacePlayer)` and keep paths with the `:AnimGraph.` prefix (the
  compiler keeps copies under `ExecuteUbergraph_*`). Edit the node's `node` struct (`AnimNode_Slot.slot_name`,
  `AnimNode_LayeredBoneBlend.layer_setup`, `AnimNode_BlendSpacePlayer.blend_space`) and set it back; struct fields
  such as `InputBlendPose.branch_filters` need `get_editor_property`, not attribute access. Compiling the ABP registers
  a new slot name in the skeleton: save the skeleton too. A variant ABP (another gait) is a `duplicate_asset` of the
  main one with the blend-space player's `blend_space` swapped, then `compile_blueprint`.
- **A montage's slot:** `SlotAnimationTrack.slot_name` is read-only, but the montage's `slot_anim_tracks` array is
  writable: replace element 0 with `unreal.SlotAnimationTrack(slot_name=..., anim_track=old.get_editor_property(
  "anim_track"))`, set the array back, read it back. (`AnimMontageFactory` makes montages in `DefaultSlot`.)
- **Writing bone tracks, then reading poses back, crashed the editor.** `set_bone_track_keys` (inside
  `open_bracket`/`close_bracket`) followed at once by `get_anim_pose_at_frame` died with EXCEPTION_ACCESS_VIOLATION in
  AnimationBlueprintLibrary after ~20 clips in one run. Save the clip (`save_loaded_asset(seq, False)`) before
  evaluating it again, and batch a few clips (one character) per run. Seen on one rig: a rotation spread over
  spine_01..03 moved the pelvis-to-head line only ~63% of the angle, so a measured correction needed a gain of ~1.6.
- **World Partition's runtime grid isn't reachable from Python:** `WorldPartition.get_editor_property("runtime_hash")`
  fails ("Failed to find property"). Read the loading range in World Settings.

### Recipe: rounded blockout pieces and props from Geometry Script (free, no generation)

`append_box` with PER_FACE polygroups, then `apply_mesh_polygroup_bevel` (subdivisions 3, round weight 1),
`compute_split_normals` at 50 degrees. Multi-material meshes: `copy_mesh_to_static_mesh` with `replace_materials`.
**Collision:** the new asset has no simple collision; add and prove it as in section C ("Check collision on every
generated level mesh"), and give decoration `NoCollision`.

### Recipe: placement and probes by trace (editor world, PIE and `-game`)

- **`SystemLibrary.line_trace_single` returns None on a miss**, not a HitResult with blocking False (the bool
  out-param is folded into the return). `if hit is None:` before `hit.to_tuple()`. Seen in the editor world, PIE and
  `-game`.
- **Assert the hit is the intended actor.** After an editor start, meshes still compiling have no collision yet: a
  roof trace went through a house and put a prop on the landscape under it; a re-run was right. Wait for
  compilation before tracing: Python has no compile-wait call (`FAssetCompilingManager` is C++ only, not in the
  5.8.4 stub), so wait a call after loading, or trace onto a known mesh first and retry until it hits.
- **Ground probes: a 15 cm sphere trace, multi, filtered.** A line trace falls through small gaps (paving joints
  10-15 cm wide read as holes and steps down to the landscape); `sphere_trace_multi_for_objects` with a 15 cm radius
  bridges them, as the character's capsule does. Keep a line trace for single solid meshes.
  - An object-type query for WorldStatic also returns trigger volumes. Keep hits whose component blocks the pawn:
    `comp.get_collision_response_to_channel(ECC_PAWN) == ECR_BLOCK` (enum values: grep the stub for their class).
  - A trace that starts inside a mesh returns it as an initial overlap at the start point: skip hits with
    `bStartPenetrating`. `HitResult.to_tuple()` order: 0 blocking, 1 initial overlap, 4 location, 5 impact point,
    7 impact normal, 9 actor, 10 component.
  - Start ground traces a little above the known ground height (2.5 m worked), under any tree canopy; from high up
    they hit the canopy first.
- **Score a scripted camera with a ray grid, not one ray.** A camera with a clear ray to its subject still had half
  its frame filled by a rock. A 16 x 9 grid of rays over the FOV, counting hits short of the subject, picked clear
  spots (1-5% of rays blocked).

## Kit issues found while writing this

- `MegajamTools.run_console_command` returns `True` as a status, which goes against Epic's "return data, raise on
  failure" rule (harmless). (It now uses `UnrealEditorSubsystem.get_editor_world()`, and `run_python` exists.)

## Verified against

- Stub `<Project>\Intermediate\PythonStub\unreal.py` (2026-10-24): `get_editor_subsystem`,
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
- Beta hub (Editor Utility Widgets): https://dev.epicgames.com/documentation/en-us/unreal-engine/beta-features?application_version=5.8
- Hotfixes: 5.8.1 https://forums.unrealengine.com/t/5-8-1-hotfix-released/2738864 , 5.8.2
  https://forums.unrealengine.com/t/5-8-2-hotfix-released/2746335 , 5.8.4
  https://forums.unrealengine.com/t/5-8-4-hotfix-released/2842775

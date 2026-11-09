# Debugging, testing and profiling (UE 5.8.4, Development builds)

The goal: the agent proves every fix with a log line or a screenshot ("done means seen") and finds the
cause of a problem from evidence, not guesses. Budgets live in `performance.md`; this note is the *how*.
Facts marked "verified" were checked on the target PC (the kit's test project + its packaged build) on 2026-10-24.
`<Build>` = the packaged build folder, `C:\dev\Builds\<Project>\Windows` (`scripts\package.ps1`); the kit's docs use
it in this sense.

## Triage: when X happens, do Y

| When | Do first | Then |
|---|---|---|
| Feature "doesn't work", no crash | `GetLogEntries` filtered to `Error`/`Warning` since PIE start | Add a `UE_LOG` on the code path; re-run PIE; quote the line |
| PIE stops with red text / "Accessed None" | Message Log > Play In Editor (Window > Message Log) | Fix the first error; later ones are usually fallout |
| Editor/PIE crash | Newest `Saved/Crashes/UECC-*/` folder: `CrashContext.runtime-xml` `<ErrorMessage>` + `<CallStack>` | Also tail `Saved/Logs/<Project>.log` |
| Packaged build crash | `<Build>\<Game>\Saved\Logs\<Game>.log`, last 100 lines | Keep the matching `.pdb` (see Crashes) |
| `Saved/Crashes` folder appeared but nothing crashed | It's an **ensure** (`<CrashType>Ensure</CrashType>`) | Read `EnsureFailed: Error:` line in the log; fix it before the final package (each first fire walks the stack and writes a crash folder: a hitch of tens to hundreds of ms) |
| Game runs slow all the time | `stat unit` | Biggest of Game/Draw/GPU decides: `stat game` / `stat scenerendering` / `stat gpu` |
| Game hitches (spikes) | `stat unitgraph`, then `stat hitches` | Unreal Insights capture with the `Loading` preset |
| Textures blurry | `stat streaming` (Over budget?) | Live A/B `r.Streaming.PoolSize 3000`; if that fixes it, set the pool per quality level or cut texture res (`performance.md` "Textures and memory") |
| Memory climbing / 8 GB VRAM worry | `stat memory`, `stat rhi` | `memreport -full`, diff two reports |
| Actor not where expected / no hit | `show collision`, `DrawDebug*` at the trace | Visual Logger to scrub frames |
| AI/pathing wrong | Gameplay Debugger (`'` key), numpad categories | `show navigation` |
| New Nanite mesh shows blocky cubes or shards in a capture | Capture again a minute later: Nanite streams coarse pages first (looked exactly like a Voxelize fault) | Shards right after a big scripted spawn that survive a recapture: restart the editor before diagnosing the mesh (seen once, cause unproven) |
| Packaged build worse than PIE | Packaged smoke test (below) + `-trace` | Grey material = missing usage flag (materials.md) |
| Packaged build fails on someone else's PC | Their `<Game>.log` (A) and the startup line below | "VCRUNTIME140*.dll was not found": VC++ runtime (`production.md` "Packaging and what gets shipped"). Engine D3D12/SM6 message box: driver update, then `-dx11` only if SM5 is cooked. Out of VRAM on 4-6 GB cards: Low preset. Blocked exe: Smart App Control (`production.md`). No audio: 5.8 uses WASAPI on Windows; `[Audio] AudioMixerModuleName=AudioMixerXAudio2` in the project's `Config/Windows/WindowsEngine.ini` reverts it (the engine default is `AudioMixerWasapi`, `BaseWindowsEngine.ini`) |

## A. Logs

**Where they live (verified):**
- Editor: `<Project>\Saved\Logs\<Project>.log`. A second editor instance writes `<Project>_2.log`.
  Older runs are renamed `<Project>-backup-YYYY.MM.DD-HH.MM.SS.log`. Engine keeps 10 files / 5 days
  (`[LogFiles] MaxLogFilesOnDisk=10, PurgeLogsDays=5` in BaseEngine.ini).
- Packaged Development build: next to the build, `<Build>\<Game>\Saved\Logs\<Game>.log`
  (verified: `<Build>\<Project>\Saved\Logs\<Project>.log`). Not in %LOCALAPPDATA%. A Shipping build is believed to
  write no log and keep `Saved\` under `%LOCALAPPDATA%\<Project>` (unverified; `cpp.md` "Build configurations").
- **Log which render path ran**, next to the build stamp at startup: the RHI name (`GDynamicRHI->GetName()`), the
  feature level (`GMaxRHIFeatureLevel`), GPU brand and driver (names unverified in 5.8.4: grep the RHI headers). A
  judge's log then answers "D3D12 or D3D11, which GPU".
- Packaging (BuildCookRun) log: wherever our package script writes it (test project: `Saved\Logs\package-*.log`).
  Success marker: `BUILD SUCCESSFUL` and `AutomationTool exiting with ExitCode=0 (Success)`.
- Epic docs say "`.txt`"; on 5.8.4 the files are `.log`. Trust disk.
- **Timestamps inside the log are UTC** (`[2026.10.23-17.21.26:334][752]` = UTC time, frame number);
  the file header `Log file open, 10/24/26 02:20:52` is local time. Don't misread "old" lines.

**Line format:** `[time][frame]Category: Verbosity: message`. `Log`-level lines omit the verbosity word.
Filter with `': Error:'`, `': Warning:'`, `'Fatal'`, `'Ensure condition failed'`, `'Assertion failed'`.
PowerShell: `Select-String <log> -Pattern ': (Error|Warning):' | group Line | sort Count -desc`.

**Our own logging (C++):**
```cpp
// Header: DECLARE_LOG_CATEGORY_EXTERN(LogMyGame, Log, All);   .cpp: DEFINE_LOG_CATEGORY(LogMyGame);
UE_LOG(LogMyGame, Display, TEXT("Door %s opened by %s"), *GetName(), *GetNameSafe(Instigator));
```
- Verbosity: Fatal (crashes) > Error (red) > Warning (yellow) > Display (console + file) > Log (file only)
  > Verbose > VeryVerbose. Use **Display** for "done means seen" proof lines so they show everywhere.
- One category per project (`LogMyGame`); grep for it. Prefix proof lines e.g. `[PROOF] ...`.
- Change at runtime: console `log LogMyGame Verbose` (or MCP `SetVerbosity`). Command line:
  `-LogCmds="LogMyGame Verbose, LogTemp Warning"`. Permanent: `DefaultEngine.ini [Core.Log] LogMyGame=Verbose`.
- `UE_LOGFMT(LogMyGame, Log, "Score {0}", Score)` (structured, `#include "Logging/StructuredLog.h"`) is fine but
  `UE_LOG` is enough. Declaring the category: `cpp.md` "Logging".
- `-log` on a packaged exe opens a live log console window; `-ABSLOG=C:\path\run.log` writes to a chosen file.

**Message Log** (Window > Message Log) holds what the Output Log buries: Blueprint compile errors,
**Play In Editor** runtime errors ("Accessed None trying to read property..."), Map Check
(Build > Map Check, or console `MAP CHECK`), asset load errors. Read it after every PIE that misbehaves.
**5.9:** the editor adds a Map Check subsystem with Blueprint logging (no page details it yet; grep the 5.9 stub or
headers before scripting it) (docs/ue59/pages/unreal-engine-5-9-release-notes.md).

**Scary but harmless (all seen on the target PC):**
- `LogWindows: Failed to load 'aqProf.dll'` / `'VtuneApi.dll'` - optional profiler hooks.
- `LogHttp: Warning: [FHttpManager::Shutdown] Unbinding delegates ... datarouter` - telemetry on exit.
- `LogLayoutService: Warning: ... "UnrealEd_Layout_v1.5" was not found` - editor layout version.
- `LogModelContextProtocol: Warning: Data transmitted via this plugin ... Licensed Technology` - MCP notice.
- Packaging: `Warning: Visual Studio compiler 14.51.x is not a preferred version` - builds fine.

**Real problems (act on these):**
- `LogMaterial: Warning: ... Failed to compile Material for platform PCD3D_SM6` (e.g. the FBX
  importer's auto material): renders default material. Open the material, fix the error, re-save.
- `EnsureFailed: Error: Ensure condition failed: ...` followed by many `LogOutputDevice: Error: [Callstack]`
  lines - that block is **one** ensure and its stack, not 30 errors.
- Blueprint `Accessed None`, `LogLinker`/`LogStreaming` "failed to load"/"can't find" a package, any `Fatal`.

## B. Crashes

- **`check` / `verify` / `ensure`** and when to use which: `cpp.md` "Assertions". Prefer `ensure` in jam code: a
  crash costs a PIE restart. Most jam crashes are null or pending-kill pointers: `IsValid(Ptr)` (`cpp.md`).
- **Editor crash/ensure folder (verified):** `<Project>\Saved\Crashes\UECC-Windows-<GUID>_0000\` with
  `CrashContext.runtime-xml` (`ErrorMessage`, `CrashType` = Crash/Assert/Ensure, `CallStack`),
  `<Project>.log` copy, `UEMinidump.dmp`, `CrashReportClient.ini`. Ensures also create one.
- **Reading a callstack:** top frames are the engine's assert machinery; scan down to the **first frame in
  our module** (`UnrealEditor-<Game>.dll` in editor, `<Game>.exe` packaged). That function + line is the bug.
- **`UnknownFunction []` frames** (verified on the target PC) = no symbols for that module. Our own module's PDB is
  built with the editor target, so our frames should resolve. Engine frames need the launcher option
  *UE 5.8 > Options > "Editor symbols for debugging"* (large download, (unverified) tens of GB) - only
  install it if a crash is inside the engine and you can't tell why (an install: the user's call).
- **Naming engine frames without symbols (first step):** `<PCallStack>` in `CrashContext.runtime-xml` gives
  `module base + offset`. Match each offset to the nearest exported symbol from `dumpbin /exports <dll>` (then
  `undname`): most engine functions are `*_API` exports, so this named a whole chain in a minute. It is a hint only:
  a non-exported function resolves to its neighbour. A ~15-line PowerShell script does it; a kit script is planned.
- **MCP `ECONNREFUSED`:** check `Get-Process UnrealEditor` and the log's last line (`LogExit: Exiting.` = clean exit,
  not a crash) before diagnosing; then ask the director to reopen the editor. (Live Coding then a map load is a known crash:
  `cpp.md`.)
  - **5.9:** with Auto Start Server on, the server logs its bind address, port and URL path at editor startup, and a
    failed bind (port in use, missing plugin) is logged there too: grep the log's `LogModelContextProtocol` lines
    before asking for a reopen. The port is an Editor Preference (Agentic Workflows > Model Context Protocol > Server
    Port Number, default 8000) or `-ModelContextProtocolPort=N`; `ModelContextProtocol.StartServer [port]` starts a
    stopped server from the editor console. Each `initialize` result carries the PID, project and engine version in
    `_meta["com.epicgames.unrealengine/instance"]`: check it reached the right editor (docs/ue59/pages/unreal-mcp-in-unreal-editor.md,
    docs/ue59/pages/unreal-engine-5-9-release-notes.md).
- **MCP calls time out while the editor shows "Responding":** a modal dialog is blocking the game thread (seen after
  `reload_packages` on a dirty asset, and "Overwrite Existing Object"). List the editor's top-level windows
  (`EnumWindows` on its PID): a window titled "Message" is the dialog. `PrintWindow(hwnd, hdc, 2)` captures it even
  behind other windows (UI Automation saw no Slate controls). Read it before answering; `PostMessage`
  WM_KEYDOWN/WM_KEYUP VK_RETURN to that hwnd presses its default button.
  - **5.9:** the MCP page also names a client-side timeout: Claude Code stops waiting after about 120 s. Split long
    work (Live Coding builds, large scripts, asset scans, automation runs) into shorter calls; a timeout on a long call
    is not by itself a sign of a modal dialog (docs/ue59/pages/unreal-mcp-in-unreal-editor.md).
- **Packaged Development PDBs (verified):** BuildCookRun stages them by default ("Copying DebugFiles"):
  `<Build>\<Game>\Binaries\Win64\<Game>.pdb` (test project: 370 MB, bigger than the 337 MB exe).
  Rule: **keep the PDB next to the exe it was built with**; a PDB from another build is useless.
  (`IncludeDebugFiles` in Project Settings only matters for Shipping.)
- Packaged builds have **no crash reporter UI** (`IncludeCrashReporter=False` in BaseGame.ini; the test project's
  build has no CrashReportClient.exe). The crash stack goes into `<Game>\Saved\Logs\<Game>.log`.
- Debugging live: attach Visual Studio/Rider to `UnrealEditor.exe` (Debug > Attach) and break on the
  exception; Live Coding (Ctrl+Alt+F11) for body-only C++ changes, full rebuild for header/UPROPERTY changes.

## C. Gameplay debugging

- **On-screen text** (PIE + packaged Development; not Shipping):
  `GEngine->AddOnScreenDebugMessage(-1, 5.f, FColor::Yellow, FString::Printf(TEXT("HP %d"), HP));`
  Key `-1` = new line each call; a fixed key (e.g. `1`) overwrites in place (good for per-tick values).
  Guard with `if (GEngine)`. Visible in viewport captures, so it doubles as screenshot proof.
- **`DrawDebug*`** (`#include "DrawDebugHelpers.h"`): `DrawDebugLine/Sphere/Box/Capsule/Point/
  DirectionalArrow/String(World, ..., Color, bPersistent=false, LifeTime=-1, DepthPriority=0, Thickness=0)`.
  Draw at every trace you're unsure of. Compiled only when `ENABLE_DRAW_DEBUG` (=
  `!(UE_BUILD_SHIPPING||UE_BUILD_TEST) || WITH_EDITOR`): works in Development, compiles to nothing in
  Shipping. Wrap calls in `#if ENABLE_DRAW_DEBUG` + a cvar/bool so they're off for the final build video.
  `FlushPersistentDebugLines(World)` clears persistent ones.
- **Visual Logger** (Window > Developer Tools > Visual Logger): records per-actor logs + shapes over time,
  scrub the timeline after PIE. `UE_VLOG(this, LogMyGame, Log, TEXT("..."))`,
  `UE_VLOG_SEGMENT(this, Cat, Log, Start, End, FColor::Red, TEXT(""))`,
  `UE_VLOG_LOCATION(this, Cat, Log, Loc, Radius, Color, TEXT(""))`, `UE_VLOG_BOX(...)`.
  Free when not recording; compiled out unless `ENABLE_VISUAL_LOG`. Best for AI/movement bugs that happen
  in a single frame.
- **Gameplay Debugger**: `'` (apostrophe) toggles, numpad 0-9 toggle categories (AI, Behavior Tree, EQS,
  Perception, Navmesh), numpad +/- change row; console `EnableGDT`. Works in PIE/standalone
  (packaged Development: (unverified)). Needs a pawn/AI under the crosshair to show per-actor data.
- **`ShowDebug`** (console): `ShowDebug` cycles HUD debug; `ShowDebug Collision`, `ShowDebug Camera`,
  `ShowDebug Input`, `ShowDebug AbilitySystem` (GAS) (category list (unverified) for 5.8).
- **Show flags:** `show collision`, `show navigation`, `show bounds`, `show volumes`; toggle the same command.
- **Cheats** (UCheatManager, standalone/PIE, Development OK): `god`, `ghost` (no collision, fly), `fly`,
  `walk` (undo), `teleport` (to surface under crosshair), `slomo 0.2`, `pause`, `ChangeSize 2`,
  `PlayersOnly`, `ToggleDebugCamera` (or `;`), `BugIt` (logs a `BugItGo x y z p y r` line + screenshot),
  `BugItGo ...` to jump back to that exact spot. Use `BugIt` to make a repro reproducible.
- **Screenshots as proof:** `HighResShot 1` writes to `Saved\Screenshots\` (unverified path in 5.8);
  prefer our MCP viewport capture. During PIE, `HighResShot` sent through MCP `run_console_command` shoots the
  **editor** viewport; `unreal.SystemLibrary.execute_console_command(pie_world, 'HighResShot ...')` shoots the game.

## D. Profiling

Read `performance.md` for budgets and "The bar" (the pass/fail target). Workflow: **measure in packaged Development,
at the real resolution.**

- `stat fps`, `stat unit` (Frame/Game/Draw/GPU/RHIT/DynRes ms), `stat unitgraph` (spikes over time).
- `stat game` (tick costs), `stat gpu` (per-pass GPU ms), `stat scenerendering` (draw calls, mesh passes),
  `stat rhi` (RHI memory/draws), `stat streaming` (texture pool use), `stat memory`.
- `stat hitches` logs frames over `t.HitchFrameTimeThreshold` (milliseconds, default 60;
  `EnginePerformanceTargets.cpp`). Set it to 2000 / target fps (60 fps: 33.3) so it matches "The bar"; leave it on
  during a playthrough and grep the log afterwards. `stat none` clears all.
- `ProfileGPU` (Ctrl+Shift+,): one-frame GPU breakdown; editor opens the GPU Visualizer, packaged dumps
  the tree to the log. Look for the biggest pass (Lumen, shadows, post, Nanite).
- **5.9:** new MCP toolsets include performance, scene capture and console; the Perf toolset (CSV and GPU profiler,
  Stats), Console and Scene Capture have runtime-callable tools. A cooked build (Shipping included) can host the MCP
  server with `-ModelContextProtocolStartServer`, exposing only `AIRuntimeCallable` tools (`Cannot register Toolset …
  no entry in baked manifest` in `LogToolsetRegistry` = none). `describe_toolsets` before relying on one
  (docs/ue59/pages/unreal-mcp-in-unreal-editor.md, docs/ue59/pages/unreal-engine-5-9-release-notes.md).
- **Unreal Insights** (verified present: `Engine\Binaries\Win64\UnrealInsights.exe`):
  - Editor: bottom toolbar **Trace** status widget > start/stop; or console `Trace.File` (writes
    `<Project>\Saved\Profiling\<timestamp>.utrace`), `Trace.Stop`, `Trace.Status`.
  - Live: start UnrealInsights.exe first; the editor/game connects to the local trace server (port 1981)
    and the session shows as LIVE. Store: `%LOCALAPPDATA%\UnrealEngine\Common\UnrealTrace`.
  - Packaged: `<Game>.exe -trace=default,gpu -tracefile` (file into the build's Saved\Profiling (unverified))
    or `-tracehost=127.0.0.1` with Insights running. Add `-statnamedevents` for finer CPU scopes.
  - Presets in BaseEngine.ini (verified): `Rendering`=gpu,cpu,frame,log,bookmark;
    `Loading`=+loadtime,assetloadtime,file; `TaskGraph`; `ContextSwitching`. e.g. `-trace=Loading`.
  - Open: drag the `.utrace` onto Insights. Timing Insights: find the long frame, read the Game Thread
    track top-down. 30-60 s captures; traces get big.
- **Memory:** `memreport -full` writes to `Saved\Profiling\MemReports\` (verified in source); take one at
  level start and one after 5 min, diff the texture/mesh lists. `stat memory` for a live glance.
- **Slow vs hitch:** *slow* = every frame over budget: `stat unit` names the thread, then the matching stat
  page, then Insights. *Hitch* = occasional spikes: usually first-time shader/PSO compile, a synchronous
  asset load, a big spawn, or GC. Capture Insights with `Loading` preset and look at the spike frame.
  Hitches in PIE that vanish in the packaged build are editor noise - always confirm packaged.

## E. Automated testing (keep it small)

- Jam-worthy tests: one **packaged smoke test** (daily, with the package) and a handful of C++ automation
  tests for pure logic (scoring, inventory, save/load). Skip screenshot-comparison and big functional suites.
  - **5.9:** adds the Modular Test Framework, for writing and running scoped plugin tests (release notes only; no
    page yet). The C++ automation tests below remain the kit's path (docs/ue59/pages/unreal-engine-5-9-release-notes.md).
- C++ test (`#include "Misc/AutomationTest.h"`, in a non-shipping module or `#if WITH_AUTOMATION_TESTS`):
```cpp
IMPLEMENT_SIMPLE_AUTOMATION_TEST(FScoreTest, "Megajam.Score.Combo",
    EAutomationTestFlags::EditorContext | EAutomationTestFlags::ProductFilter)
bool FScoreTest::RunTest(const FString&) { TestEqual(TEXT("x3 combo"), ScoreFor(3), 300); return true; }
```
- **AutomationTestToolset MCP** (editor-only, experimental; enabled via `AllToolsets`, SETUP step 2):
  `DiscoverTests()` first (async, several seconds) > `ListTests(NameFilter="Megajam")` >
  `RunTests([...])` or `RunTestsByFilter("StartsWith:Megajam")` (also `^Foo`, `Bar$`, `Group:Name`) >
  `GetTestStatus()` / `GetTestResults()` (JSON with per-test errors) > `StopTests()`.
  Window > Test Automation (Session Frontend) is the same backend.
  **5.9:** keep each MCP call under Claude Code's ~120 s wait: start the run, then poll `GetTestStatus()` in separate
  calls rather than one long call (docs/ue59/pages/unreal-mcp-in-unreal-editor.md "Handle Long Tool Calls").
  **A filter that matched zero tests is not a pass:** report the test names that ran with the result, and if none
  matched, say so (and write the test if the behaviour has none).
- Command line equivalent (editor, headless): `UnrealEditor-Cmd.exe <uproject> -ExecCmds="Automation
  RunTests Megajam; Quit" -unattended -nullrhi -log` (Automation subcommands verified in source:
  `List`, `RunTests`, `RunFilter`, `RunAll`, `Quit`; the full run (unverified) on the target PC).
- **Packaged smoke test** (Development only: `-seconds=N` is compiled out of Shipping; it quits after N
  seconds of accumulated game time - verified in LaunchEngineLoop.cpp; not yet run on the target PC):
```powershell
$g='MyGame'; $b="C:\dev\Builds\$g\Windows"; $log="$b\$g\Saved\Logs\$g.log"
$p = Start-Process "$b\$g\Binaries\Win64\$g.exe" -PassThru -ArgumentList `
     '-seconds=60','-unattended','-windowed','-ResX=1280','-ResY=720','-nosplash'
if (-not $p.WaitForExit(240000)) { $p.Kill(); 'FAIL: hang/timeout' }
Select-String $log -Pattern ': Error:|Fatal|Ensure condition failed|Assertion failed|Unhandled Exception'
Select-String $log -Pattern '\[PROOF\]|Log file closed'   # proof lines + clean exit marker
```
  Pass = no error matches, our `[PROOF]` lines present, and `Log file closed` at the end (clean exit;
  verified as the last line of the test project's packaged log). Keep a real RHI (no `-nullrhi`) so
  rendering/material errors surface. `-unattended` suppresses blocking dialogs. To drive gameplay,
  add `-ExecCmds="teleport, slomo 2"` or a level that auto-plays.

## F. Capture and test patterns (from a prototype)

**Kit scripts first** (all in `-game` on the editor build, project from the kit `.env`, results as `PROOF` lines):
`gen/test/game_test.ps1` (your Python test, measured), `gen/test/postkeys.ps1` (real keys posted to the game window,
no foreground needed), `gen/test/camset.ps1` (camera-set frames), `gen/test/stability.ps1` (shimmer meter),
`gen/test/shots.ps1` (video shots), `gen/unreal/py/traverse_survey.py` + `gen/test/route_walk.py` (walked routes).
`keytest.ps1` and `record_window.ps1` need the foreground: use them with the director at the PC.

- **Scripted PIE captures:** `register_slate_post_tick_callback` + `LevelEditorSubsystem.editor_request_begin_play()`,
  then each tick `UnrealEditorSubsystem.get_game_world()` and `SystemLibrary.execute_console_command(world,
  "HighResShot 1920x1080 filename=<abs path>")` on a timeline; write a result JSON at the end and poll for it. The
  first PIE start can take 2+ minutes (shaders). Needs "Use Less CPU when in Background" off (SETUP step 8).
- `HighResShot` drops stat text and debug strings. For proof shots of stats use `Shot showui filename=<abs path>`,
  but in PIE that captures the whole editor window; use the packaged game for HUD shots.
- **Measure motion and timing in `-game`, not PIE.** With the editor in the background PIE ran at 3-8 fps (game dt
  ~0.33 s), so foot-slide and timing numbers were meaningless. A later prototype ran tests as
  `UnrealEditor.exe <project> -game -ExecCmds="py <test>.py"` at ~160 fps: the script finds the world through
  `unreal.ObjectIterator(unreal.PlayerController)`, drives the pawn with `add_movement_input` from
  `register_slate_post_tick_callback` (no OS input, so no key injection), writes JSON and quits. For foot slide,
  measure net start-to-end slip per plant (foot bones + `contact_*` curves), not summed per-frame motion (adds jitter).
  (An earlier prototype found uncooked `-game` unreliable for captures, with missing actors and a wrong camera; the
  scripted harness above, with a camera placed in the level, worked. If actors are missing, use scripted PIE or the
  packaged exe.)
- **`-game` Python harness facts (5.8.4):**
  - `EditorAssetLibrary` calls crash the `-game` process; `unreal.load_asset` works.
  - The pawn is `controller.get_controlled_pawn()`; `PlayerController.get_pawn()` doesn't exist in 5.8.4 Python
    (AttributeError; `get_pawn` is on `PlayerState`).
  - Python can't spawn into the game world: borrow a camera actor placed in the level.
  - `PlayerController.un_possess()` resets the view target: call `set_view_target_with_blend(cam, 0)` again before
    each shot, and set the FOV with `cam.camera_component.set_field_of_view`.
  - Single-node playback: `set_animation` re-initialises the instance and shots right after it show the reference
    pose. Call it once per clip, then only `set_position(t)`; set
    `visibility_based_anim_tick_option=ALWAYS_TICK_POSE_AND_REFRESH_BONES`. Single node skips the ABP (layers, bone
    modifiers, slots, root motion): for the real path play montages on the ABP under
    `GameplayStatics.set_global_time_dilation(w, 0.1)` and take a `HighResShot` every 1/20 s of game time.
  - Frame-stepped `HighResShot`s can't capture other windows; screen capture can (below). Use them for comparisons.
  - **`HighResShot` captures on the next rendered frame.** Keep the view target (and the time dilation) unchanged for
    at least one more tick after issuing it: a switch back to an overview in the same tick shot the overview.
    `shot filename=<abs>.png -nosuffix` captures the presented frame at the window size.
  - **Python sees only BlueprintVisible properties in `-game`.** `PyGenUtil.cpp` exports `CPF_BlueprintVisible`
    properties, and `CPF_Edit` ones only when `GIsEditor`, which is false in `UnrealEditor.exe -game`. A plain
    `UPROPERTY(EditAnywhere)` (also `VisibleAnywhere` components, `EditAnywhere` arrays) throws "Failed to find
    property" there although the editor reads it. Give what a test reads `BlueprintReadOnly` (header change, full
    build) or a `BlueprintCallable` getter, or hard-code it with a comment. Without a header change:
    `get_components_by_class` plus the component name, and actor transforms.
  - **5.9:** Python gives each Blueprint class its own wrapper type (`BP_MyActor_C`, a subclass of its native parent,
    with the Blueprint's added properties and functions), and each User Defined Struct its own type; 5.8 saw the
    nearest native parent / `unreal.StructBase`. `isinstance()` and `get_editor_property()` work either way; test code
    that compares `type(obj)` or the type name to a native class must change, or set
    `Engine.Python.WrapBlueprintClassesOnDemand` / `Engine.Python.WrapUserDefinedStructsOnDemand` to false for the 5.8
    behaviour (docs/ue59/pages/scripting-the-unreal-editor-using-python.md).
  - **Check the first ticks of a long run for Python exceptions** before leaving it: a 40-minute run threw on every
    tick and was wasted. `game_test.ps1` stops a run that floods the log with Python errors.
  - **`slomo` does nothing** sent through `SystemLibrary.execute_console_command`; use
    `GameplayStatics.set_global_time_dilation(world, x)`. Anything that sets dilation itself (a slow-motion effect)
    resets it, so check it each tick.
  - **World Partition streams around the view target, not the pawn.** A pawn parked away from the test's camera fell
    out of the unstreamed world (and respawned 8 times). Freeze any pawn the test doesn't use:
    `set_actor_tick_enabled(False)` and its movement component's tick off. To keep an area loaded, put the view
    target in its middle (or add a `WorldPartitionStreamingSource` component).
  - **After a teleport, wait for the ground, not a fixed time.** 15 s after a teleport the landscape was loaded but
    large Nanite meshes (recently re-imported) were not, so the walker ran on the landscape under the street. Hold the
    pawn in place (it fell through unloaded ground otherwise) until a trace at the target hits the expected surface or
    named mesh. A step that throws must not skip its wait. Don't trust the timing of the step's first tick (it came
    ~1 s late).
  - **Bones, sockets and shots need the character on screen.** With `OnlyTickPoseWhenRendered` (characters.md) an
    off-screen character reports its last rendered pose: a socket read with the view on the wrong place measured a
    standing pose. Set `ALWAYS_TICK_POSE_AND_REFRESH_BONES` for the test, and fail loudly when the test's camera
    actor is missing instead of carrying on with the player's view. Take the first shot a few seconds after a camera
    move: at ~1 fps a shot 1 s after the cut showed a character in a pose it had left.
  - **Slow starts:** after a Niagara or texture change, a `-game` test can take ~3 min to start (shader and DDC
    work; give it `-TimeoutSec` to spare), and a clock that runs while meshes compile misses its first samples.
    Warm the DDC with one run first, or start timing when the test registers.
  - **Resolution and read-only cvars:** `game_test.ps1 -ResX/-ResY` set the window (a second `-ResX` in `-GameArgs`
    loses: the first match wins). `r.SetRes 3840x2160w` from the script also works. A ReadOnly cvar can be set on the
    command line: `-ini:Engine:[/Script/Engine.RendererSettings]:r.Nanite.Foliage=0` worked.
  - **Runtime A/B without a rebuild:** `PrimitiveComponent.set_evaluate_world_position_offset(False)` toggles WPO per
    component; `unreal.MaterialLibrary.create_dynamic_material_instance(world, mi)` (not `KismetMaterialLibrary`)
    gives a runtime MID to scale parameters per variant.
  - **Traversal checks** (a game where a character moves on foot through the level: invisible walls, lids, ledges):
    write the paths the player should be able to walk to `<Project>\Generated\traverse\route.json` (`{"lines":
    {"main": [[x, y, z], ...]}, "capsule": {"radius": R, "half_height": H}}`, world cm, z on the ground; format and
    options in the scripts' headers), then:
    - `node gen\unreal\py.ts gen\unreal\py\traverse_survey.py` (editor, level open, streamed actors loaded): every
      40 cm on the line and lines offset to each side, the pawn's floor and capsule with the "Pawn" profile; reports
      holes, lids (standing on something invisible), ledges, steep spots and blockers, and whether each blocker's
      collision is drawn there or invisible. Writes `traverse_survey.json`.
    - `gen\test\game_test.ps1 -Map /Game/Maps/<Level> -Script C:\dev\megajam-kit\gen\test\route_walk.py -Tag ROUTEWALK -TimeoutSec 1500`
      (`-game`; `-Map` defaults to `Main`): the pawn runs each line at run speed and logs stalls, stuck spots, falls
      and pushes off the line, with what blocks ahead. Writes `route_walk.json`.
    Run both after any change to collision, walls, props or terrain along the route, and before a playtest. For
    stairs, run the pawn up with `add_movement_input` and log `current_floor` each tick. *Tested* 2026-11-02 on the
    rehearsal's level: the survey took ~2 s for 25,000 samples on 3.2 km of lines; the walk ran them in ~10 min at
    time dilation 3. A "floor never streamed in" note means the walk ran on what had loaded (landscape under a
    missing structure): check those spots in the editor before trusting a stall there.
  - Image work outside the editor: the system Python had PIL but not numpy; Blender's Python had numpy but not PIL.
  - Editor-only properties don't exist: `static_mesh.get_editor_property("body_setup")` raises "Failed to find
    property". Have an editor probe write what the test needs (collision shapes, bounds) to JSON and read that.
  - Non-Nanite landscape grass is render-side: its components report `get_instance_count() == 0` while the grass
    renders. Test grass with shots (`worldbuilding.md` "Foliage and landscape grass").
  - **Moving the pawn between steps:** end any fall or glide first
    (`set_movement_mode(MOVE_WALKING)` on the movement component; check the stub's enum name), or the game's fall
    damage counts from where the fall started: a teleport out of a glide landed as a 90 m fall and a respawn. Then
    wait for the ground (above).
  - **Framed shots of a third-person pawn:** set the spring arm's `use_pawn_control_rotation` False and
    `set_world_rotation` on the arm. Setting the controller's rotation was overwritten by the game's camera code.
  - Key dicts of actors by `get_path_name()`, never `get_name()` (`editor-scripting.md` E, "Python odds and ends").
  - Kit harness: `gen/test/game_test.ps1 -Script <test>.py` launches `-game`, runs the test and prints its result lines.
    Its log is `Saved\Logs\gametest_<Tag>.log`; it refuses to start while another `-game` instance of the project
    runs. While a test runs, don't save assets it loaded (`editor-scripting.md` "Rules that bite").
- **AI in PIE stills: `un_possess()`, not `destroy_actor()`.** Destroying an AIController from Python left the AI
  running (it chased and killed the player between shots). `controller.un_possess()` (not `unpossess`) stops it; check
  the pawn location and the combat log before each shot.
- **Fixed-camera captures at a set size and FOV** (e.g. 3840x2160 at FOV 80; MCP `CaptureViewport` uses the viewport's
  size and FOV 90): spawn or reuse a `CameraActor` with the FOV set, then
  `unreal.AutomationLibrary.take_high_res_screenshot(3840, 2160, "<abs path, no extension>", camera_actor, False,
  False, unreal.ComparisonTolerance.LOW, "", 0.5, True)`. It pilots the viewport, writes `<path>.png` and releases
  the pilot. With the editor in the background the request waits until the viewport draws: one MCP `CaptureViewport`
  call forces the draw (`editor_invalidate_viewports()` did not).
  - **5.9:** Editor Preferences > Agentic Workflows > Model Context Protocol > **Dump Media To Disk** (default off)
    writes every image and audio block sent over MCP to `Saved/ModelContextProtocol/`, to check what a capture tool
    actually returned (docs/ue59/pages/unreal-mcp-in-unreal-editor.md).
- **Editor captures at High scalability show black shade after an editor restart** (rehearsal: ~12% of pixels below
  luma 20 for minutes, vs 0.23% in the packaged game at the same settings). High sets
  `r.LumenScene.DirectLighting.UpdateFactor 64` and `r.LumenScene.Radiosity.UpdateFactor 128`, and a background editor
  renders so few frames that Lumen's surface cache barely converges. Set both to 8 in the editor console before
  capturing (not saved; `shot.ts --converge` does it): 0.17-1.17%. Ruled out first: surface cache atlas size, GI
  on/off, `r.Lumen.TraceMeshSDFs`, reflections.
  - **5.9:** a project that opts into the Lumen World Cache (Hardware Ray Tracing only; off by default) replaces the
    Surface Cache completely for that view; Software Ray Tracing still uses the Surface Cache. The World Cache
    averages each cell over `r.Lumen.WorldCache.MaxFramesAccumulated` frames (default 16), so lighting lags changes
    and new areas take frames to fill: give a background editor enough frames before capturing. `View Modes > Lumen >
    Surface Cache` shows the World Cache when it is active; `r.Lumen.WorldCache.Allowed 0` switches back to the
    Surface Cache without a restart (docs/ue59/pages/lumen-world-cache-in-unreal-engine.md).
- **Before capturing a World Partition level,** load its streamed actors (`worldbuilding.md` "World Partition from
  Python"); unloaded cells show coarse stand-ins that look like a Nanite bug.
- **After a water rebuild,** wait a few seconds or capture twice before judging an underwater-tinted shot
  (`worldbuilding.md` "Judging water in captures").
- **Viewport captures use whatever camera the viewport has.** When the director is working in the editor, a capture
  can come from their camera: ask for the viewport first, and use fixed cameras for the camera set.
- **Capture twice after importing or placing Nanite meshes, and keep the second.** A capture a minute after placing
  big Nanite trees showed them as stacks of 10-25 cm cubes; the same camera a minute later showed full detail (trees
  further away needed a third capture). A one-shot capture doesn't wait for Nanite streaming.
- **Exposure differs between editor sessions.** After an editor relaunch the same cameras came back up to +15 luma on
  sky and bare ground with no setting changed (suspected: the eye-adaptation state). Within one session two captures
  matched to 1 level. Before/after pairs for a critic come from one session (`prompts/critic.md`).
- **Editor A/B captures of one asset change:** with nothing changed, three captures of one camera a few minutes apart
  differed by a mean of 17-42 (8-bit): landscape grass regrew around the moved viewport camera at its own pace (tall
  grass hid a wall in one shot only), and the first shot after loading the level had trees still streaming in. With
  `grass.Enable 0` (sent with `SystemLibrary.execute_console_command`) and a 45 s wait the same A/B differed by 3-6,
  all wind. So: grass off, one throwaway capture after loading, toggle only the asset under test in the same session,
  and diff the pair numerically before giving it to the critic. Judge the grass itself from `-game` shots.
- **Particles in editor captures:** the editor world doesn't tick while the editor is unfocused, so placed Niagara
  systems show nothing. Before each capture, on every `NiagaraActor`'s component: `nc.reinitialize_system();
  nc.advance_simulation_by_time(1.0, 1/60)`. Also wait for any edited system to compile (`editor-scripting.md`).
- **Finding events in a clip:** don't aim frame grabs from log times (the log-to-clip offset varied ~0.9 s between
  runs). Detect them numerically first: e.g. count near-white pixels per frame at 192x108 and flag spikes over the
  local median; that found every hit flash, and the grabs hit first time.
- **Contact sheets:** `fps=1,scale=400:-2,eq=gamma=1.8,tile=4x3`. For labels use `drawtext` with `fontfile=`
  (without it, it segfaulted on fontconfig): recipe in `cinematics-video.md` "ffmpeg recipes".
- **Screen captures of a packaged build** (look comparisons per render variant): launch the exe with the variant's
  `-DPCVars`, wait for a known log line, call `SetProcessDPIAware()` first (otherwise a 150%-scaled 4K desktop captures
  as 2560x1440), then grab the screen. Before every grab, check the foreground window belongs to the game **by process
  name**: the root `<Game>.exe` is a launcher that starts `<Game>\Binaries\Win64\<Game>.exe`, so the launcher's PID
  never owns the window. Abort or retry if another window (tray popup, Explorer) is in front. To capture the game
  window while others are in front: `PrintWindow` with flag 3 (`PW_RENDERFULLCONTENT`) on the game's window handle,
  after `SetProcessDPIAware()` (`CopyFromScreen` captured the terminal in front instead).
- **Key-injection tests** (`gen/test/keytest.ps1`): injected keys go to whatever window has focus, and
  `SetForegroundWindow` from a background script silently fails while the user works in another app. One test typed
  into a chat window. The helper finds the game window by process, brings it forward with `AttachThreadInput`, checks
  `GetForegroundWindow()` before every key down, and releases everything and aborts on any change. It refuses to run
  without `-Approved`: ask the director before every run. A system prompt (a Windows Firewall question for a new
  Development exe) can hold the foreground for good: then use `postkeys.ps1`, which posts the keys to the game's own
  window (UE's window procedure handles posted key messages like real ones; tested 2026-11-09: walk and jump).
- **Image comparison pages lie on a scaled desktop.** A "1:1" page at 150% Windows scaling enlarged every crop 1.5x
  with nearest-neighbour, which looked pixelated and was mistaken for the game's quality. Size images to
  `naturalWidth / devicePixelRatio` in a small script and say on the page that it is true 1:1.
- **Logging timed states:** when a timed state ends (a grab, a stun), log how long it lasted and why it ended. It turns
  "it doesn't work" into a measurable report.

## Recording the screen safely

The kit's single statement of this rule (`cinematics-video.md` links here). Record only with
`gen/test/record_window.ps1` (or `gen/test/autoclip.ps1`, which launches `-game` with an autoplay flag and records
through it). Raw `ddagrab`, the NVIDIA App, Game Bar and OBS are **not for agent use**: they record **whatever is on
screen**, not the game: a prototype captured the
editor, the desktop after the game quit, and once a private chat window. The script records only while the game is
alive, focused and uncovered, and cuts back to the last clean frame. Still look at the first and last frame of every
clip; **delete at once any clip that shows anything other than the game**, and say so.

## G. Rare launch crashes: method (from a prototype)

A packaged build hung the GPU (`DXGI_ERROR_DEVICE_HUNG`) at frames 40-57 of ~2.5% of launches, never mid-game.
1. **Reproduce it the way it happens:** a real full-screen window at the real resolution, plus any capture tool that
   was running. 40 offscreen launches (`-RenderOffScreen`) were all clean: a different present path.
2. **Read the faulting shader first.** With NVIDIA Aftermath, the decode's `Active Shaders > Function` named the same
   shader every time (`CullPerPageDrawCommandsCs`, virtual shadow map culling for non-Nanite meshes), while the last
   breadcrumbs pointed at an innocent async compute pass.
3. **Size the run count to the rate:** zero crashes in N runs means 95% confidence only when (1 - rate)^N < 0.05,
   about 120 runs at 2.5%. 60 clean runs happen by chance ~22% of the time at that rate; a "fix" committed on 60 runs
   then crashed 2/60 in the shipped build.
4. **Confirm on the shipped build**, not only with a command-line cvar.
Unresolved on the prototype; candidates were VSM off (the faulting shader never runs) or delaying VSM after load.
Test whether players see it at all: every recorded crash had a screen recorder running.

## Kit decisions: fit and conflicts

- "Done means seen": proof = a `Display`-level `[PROOF]` log line or a viewport capture with
  `AddOnScreenDebugMessage`/`DrawDebug` visible. Strip or gate debug drawing before the final video.
- PDBs and the itch zip: SETUP step 7 and `performance.md` "Budgets". Keep each PDB with its build.
- **Conflict risk:** all of section C, `stat`, cheats and `-seconds` disappear in Shipping. We package
  Development, which the jam rules require for the submitted zip too, so these keep working on the final build.

## Verified against

- The target PC, 2026-10-24: `<Project>\Saved\Logs\` (names, backups, `_2` instance, UTC timestamps),
  `Saved\Crashes\UECC-*` (an ensure in `AssetManagerTypes.cpp`, `UnknownFunction` frames, no engine PDBs),
  packaged `<Build>` (log path, staged PDB, no CrashReportClient, 0 errors).
- Engine source/config 5.8: `DrawDebugHelpers.h`, `EngineDefines.h`, `AssertionMacros.h`, `VisualLogger.h`,
  `Engine.h` (AddOnScreenDebugMessage), `CheatManager.h`, `GameplayDebuggerConfig.cpp` (keys),
  `LaunchEngineLoop.cpp` (`-seconds`), `GenericPlatformOutputDevices.cpp` (`-LOG=`/`-ABSLOG=`),
  `AutomationTest.h`, `AutomationCommandline.cpp`, `UnrealEngine.cpp` (MemReports path), BaseEngine.ini
  (`[LogFiles]`, `[Trace.ChannelPresets]`), BaseGame.ini, AutomationTestToolset plugin source.

## Sources (5.8)

- Logging: https://dev.epicgames.com/documentation/en-us/unreal-engine/logging-in-unreal-engine?application_version=5.8
- Stat commands: https://dev.epicgames.com/documentation/en-us/unreal-engine/stat-commands-in-unreal-engine?application_version=5.8
- Unreal Insights: https://dev.epicgames.com/documentation/en-us/unreal-engine/unreal-insights-in-unreal-engine?application_version=5.8
- Insights reference (flags, Trace.* commands, channels): https://dev.epicgames.com/documentation/en-us/unreal-engine/unreal-insights-reference-in-unreal-engine-5?application_version=5.8
- Trace quick start: https://dev.epicgames.com/documentation/en-us/unreal-engine/trace-quick-start-guide-in-unreal-engine?application_version=5.8
- Gameplay Debugger: https://dev.epicgames.com/documentation/en-us/unreal-engine/using-the-gameplay-debugger-in-unreal-engine?application_version=5.8
- Visual Logger: https://dev.epicgames.com/documentation/en-us/unreal-engine/visual-logger-in-unreal-engine?application_version=5.8
- 5.8 release notes (WASAPI audio backend): https://dev.epicgames.com/documentation/en-us/unreal-engine/unreal-engine-5-8-release-notes?application_version=5.8
- Automation test framework: https://dev.epicgames.com/documentation/en-us/unreal-engine/automation-test-framework-in-unreal-engine?application_version=5.8

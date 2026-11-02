# Debugging, testing and profiling (UE 5.8.4, Development builds)

The goal: the agent proves every fix with a log line or a screenshot ("done means seen") and finds the
cause of a problem from evidence, not guesses. Budgets live in `performance.md`; this note is the *how*.
Facts marked "verified" were checked on the target PC (the kit's test project + its packaged build) on 2026-10-24.
`<Build>` = the packaged build folder, `C:\dev\Builds\<Project>\Windows` (`scripts\package.ps1`); the kit's docs use it in this sense.

## Triage: when X happens, do Y

| When | Do first | Then |
|---|---|---|
| Feature "doesn't work", no crash | `GetLogEntries` filtered to `Error`/`Warning` since PIE start | Add a `UE_LOG` on the code path; re-run PIE; quote the line |
| PIE stops with red text / "Accessed None" | Message Log > Play In Editor (Window > Message Log) | Fix the first error; later ones are usually fallout |
| Editor/PIE crash | Newest `Saved/Crashes/UECC-*/` folder: `CrashContext.runtime-xml` `<ErrorMessage>` + `<CallStack>` | Also tail `Saved/Logs/<Project>.log` |
| Packaged build crash | `<Build>\<Game>\Saved\Logs\<Game>.log`, last 100 lines | Keep the matching `.pdb` (see Crashes) |
| `Saved/Crashes` folder appeared but nothing crashed | It's an **ensure** (`<CrashType>Ensure</CrashType>`) | Read `EnsureFailed: Error:` line in the log; fix or note it |
| Game runs slow all the time | `stat unit` | Biggest of Game/Draw/GPU decides: `stat game` / `stat scenerendering` / `stat gpu` |
| Game hitches (spikes) | `stat unitgraph`, then `stat hitches` | Unreal Insights capture with the `Loading` preset |
| Textures blurry | `stat streaming` | Over pool = cut texture res (see performance.md) |
| Memory climbing / 8 GB VRAM worry | `stat memory`, `stat rhi` | `memreport -full`, diff two reports |
| Actor not where expected / no hit | `show collision`, `DrawDebug*` at the trace | Visual Logger to scrub frames |
| AI/pathing wrong | Gameplay Debugger (`'` key), numpad categories | `show navigation` |
| New Nanite mesh shows blocky cubes or shards in a capture | Capture again a minute later: Nanite streams coarse pages first (looked exactly like a Voxelize fault) | Shards right after a big scripted spawn that survive a recapture: restart the editor before diagnosing the mesh (seen once, cause unproven) |
| Packaged build worse than PIE | Packaged smoke test (below) + `-trace` | Grey material = missing usage flag (materials.md) |

## A. Logs

**Where they live (verified):**
- Editor: `<Project>\Saved\Logs\<Project>.log`. A second editor instance writes `<Project>_2.log`.
  Older runs are renamed `<Project>-backup-YYYY.MM.DD-HH.MM.SS.log`. Engine keeps 10 files / 5 days
  (`[LogFiles] MaxLogFilesOnDisk=10, PurgeLogsDays=5` in BaseEngine.ini).
- Packaged Development build: next to the build, `<Build>\<Game>\Saved\Logs\<Game>.log`
  (verified: `<Build>\<Project>\Saved\Logs\<Project>.log`). Not in %LOCALAPPDATA%.
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
- `UE_LOGFMT` (structured, `#include "Logging/StructuredLog.h"`) is fine but `UE_LOG` is enough.
- `-log` on a packaged exe opens a live log console window; `-ABSLOG=C:\path\run.log` writes to a chosen file.

**Message Log** (Window > Message Log) holds what the Output Log buries: Blueprint compile errors,
**Play In Editor** runtime errors ("Accessed None trying to read property..."), Map Check
(Build > Map Check, or console `MAP CHECK`), asset load errors. Read it after every PIE that misbehaves.

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

- **`check(x)` / `checkf(x, fmt, ...)`**: crash if false (Development keeps them; Shipping strips them).
  Use for "impossible" states. **`verify(x)`** keeps evaluating `x` in Shipping.
- **`ensure(x)` / `ensureMsgf(x, fmt, ...)`**: logs + callstack, **keeps running**, fires once per call site
  per session; `ensureAlways` fires every time. Prefer ensure in jam code: a crash costs a PIE restart.
- Null-check `UObject*` with `IsValid(Ptr)`; most jam crashes are null/pending-kill pointers.
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

Read `performance.md` for budgets and "The bar" (the pass/fail target). Workflow: **measure in packaged Development, at the real resolution.**

- `stat fps`, `stat unit` (Frame/Game/Draw/GPU/RHIT/DynRes ms), `stat unitgraph` (spikes over time).
- `stat game` (tick costs), `stat gpu` (per-pass GPU ms), `stat scenerendering` (draw calls, mesh passes),
  `stat rhi` (RHI memory/draws), `stat streaming` (texture pool use), `stat memory`.
- `stat hitches` logs frames over `t.HitchFrameTimeThreshold` (milliseconds, default 60;
  `EnginePerformanceTargets.cpp`). Set it to 2000 / target fps (60 fps: 33.3) so it matches "The bar"; leave it on
  during a playthrough and grep the log afterwards. `stat none` clears all.
- `ProfileGPU` (Ctrl+Shift+,): one-frame GPU breakdown; editor opens the GPU Visualizer, packaged dumps
  the tree to the log. Look for the biggest pass (Lumen, shadows, post, Nanite).
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
  - Python can't spawn into the game world: borrow a camera actor placed in the level.
  - `PlayerController.un_possess()` resets the view target: call `set_view_target_with_blend(cam, 0)` again before
    each shot, and set the FOV with `cam.camera_component.set_field_of_view`.
  - Single-node playback: `set_animation` re-initialises the instance and shots right after it show the reference
    pose. Call it once per clip, then only `set_position(t)`; set
    `visibility_based_anim_tick_option=ALWAYS_TICK_POSE_AND_REFRESH_BONES`. Single node skips the ABP (layers, bone
    modifiers, slots, root motion): for the real path play montages on the ABP under
    `GameplayStatics.set_global_time_dilation(w, 0.1)` and take a `HighResShot` every 1/20 s of game time.
  - Frame-stepped `HighResShot`s can't capture other windows; screen capture can (below). Use them for comparisons.
  - Kit harness: `gen/test/game_test.ps1 -Script <test>.py` launches `-game`, runs the test and prints its result lines.
- **AI in PIE stills: `un_possess()`, not `destroy_actor()`.** Destroying an AIController from Python left the AI
  running (it chased and killed the player between shots). `controller.un_possess()` (not `unpossess`) stops it; check
  the pawn location and the combat log before each shot.
- **Fixed-camera captures at a set size and FOV** (e.g. 3840x2160 at FOV 80; MCP `CaptureViewport` uses the viewport's
  size and FOV 90): spawn or reuse a `CameraActor` with the FOV set, then
  `unreal.AutomationLibrary.take_high_res_screenshot(3840, 2160, "<abs path, no extension>", camera_actor, False,
  False, unreal.ComparisonTolerance.LOW, "", 0.5, True)`. It pilots the viewport, writes `<path>.png` and releases
  the pilot. With the editor in the background the request waits until the viewport draws: one MCP `CaptureViewport`
  call forces the draw (`editor_invalidate_viewports()` did not).
- **Editor captures at High scalability show black shade after an editor restart** (rehearsal: ~12% of pixels below
  luma 20 for minutes, vs 0.23% in the packaged game at the same settings). High sets
  `r.LumenScene.DirectLighting.UpdateFactor 64` and `r.LumenScene.Radiosity.UpdateFactor 128`, and a background editor
  renders so few frames that Lumen's surface cache barely converges. Set both to 8 in the editor console before
  capturing (not saved; `shot.ts --converge` does it): 0.17-1.17%. Ruled out first: surface cache atlas size, GI
  on/off, `r.Lumen.TraceMeshSDFs`, reflections.
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
  never owns the window. Abort or retry if another window (tray popup, Explorer) is in front.
- **Key-injection tests** (`gen/test/keytest.ps1`): injected keys go to whatever window has focus, and
  `SetForegroundWindow` from a background script silently fails while the user works in another app. One test typed
  into a chat window. The helper finds the game window by process, brings it forward with `AttachThreadInput`, checks
  `GetForegroundWindow()` before every key down, and releases everything and aborts on any change. It refuses to run
  without `-Approved`: ask the director before every run.
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
  Development; if anyone switches to Shipping for the final upload, the smoke test stops working.

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
- Automation test framework: https://dev.epicgames.com/documentation/en-us/unreal-engine/automation-test-framework-in-unreal-engine?application_version=5.8

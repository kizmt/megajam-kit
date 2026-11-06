# Production pipeline notes (UE 5.8, from Epic's docs, checked against our setup 2026-10-24)

## Packaging and what gets shipped

- Only content that the packaged levels reference (plus Primary Assets / always-cook rules) is cooked.
  Generated props that sit in /Game but are never placed or referenced do not ship.
- **List the maps that ship:** Project Settings > Packaging > **List of maps to include in a packaged build**
  (`MapsToCook`). `package.ps1` passes no `-map=`, and with no list the cooker is believed to cook every map in /Game
  (unverified in 5.8.4), so look-test and test maps drag their content in. Then check the UnrealPak listing (below)
  for any other `.umap`.
- Before the final build: Project Settings > Game > Asset Manager > **Directories to Exclude** for test folders,
  and consider **Only Cook Production Assets** (DevelopmentCook assets then error the cook instead of shipping).
- We ship a **Development** build (`scripts/package.ps1`; the reasons are in `cpp.md` "Build configurations"). Close the
  editor first.
- **PIE can hide cook-only faults.** Seen: landscape grass drawn in PIE and missing from every packaged build until
  the landscape proxies were re-saved (`worldbuilding.md` "Foliage and landscape grass"). Look at each new system
  once in a packaged build.
- Use the Asset Manager audit tools to see what's taking disk/memory before cutting content.
- **`package.ps1` clears the archive folder first** (except `Saved\`): BuildCookRun `-archive` never deletes, and a
  rehearsal zip shipped ~15 MB of DLLs from a plugin turned off since an older package. It prints the ten largest
  zip entries; read them after every package. `-Config` takes only `Development` (default) or `Shipping`: a launcher
  engine builds a project's Game target only as DebugGame, Development or Shipping (`cpp.md` "Build configurations").
- **"No additional software" vs the VC++ runtime:** `package.ps1` passes neither `-prereqs` nor an app-local
  prerequisites folder, so the zip carries no Visual C++ runtime. A PC that never installed the VC++ 2015-2022
  runtime may fail to start the game (unverified; most gaming PCs have it). Check once: unzip into **Windows Sandbox**
  (a clean Windows 11 Pro) and start the exe. If it complains, the options are BuildCookRun `-prereqs` (stages Epic's
  prerequisites installer; the root exe offers it) or Project Settings > Packaging **Include app-local
  prerequisites** (`IncludeAppLocalPrerequisites`: runtime DLLs next to the exe). Either means editing the script's
  flags or `DefaultGame.ini`: ask the director first.
- **Where the size goes:** `UnrealPak.exe <Paks\<Project>.utoc> -List -csv=<out.csv>` (in
  `Engine\Binaries\Win64`) lists every cooked chunk with Offset, Size (uncompressed) and a Compressed flag; the gap to
  the next Offset is the stored size. Group by folder and asset prefix. Measured on the rehearsal (1,118 MB zip):
  meshes 575 MB, textures 242 MB, shader code 120 MB, and stored ≈ raw.
- **Pak compression effort follows the build config:** `PackageCompressionLevel_DebugDevelopment` defaults to 3
  ("Fast"; Shipping uses `_TestShipping` 5). Effort costs encode time only, not load time. Before the final package
  set `PackageCompressionLevel_DebugDevelopment=7` under `[/Script/UnrealEd.ProjectPackagingSettings]` in
  `DefaultGame.ini`, keep `PackageCompressionMethod=Kraken` (Leviathan is smaller but slower to decode), and measure
  the zip before and after. Epic also recommends `PackageAdditionalCompressionOptions=-compressionblocksize=256KB`.
- **Check whether SM5 shaders ship too:** the Windows target can cook a D3D12 SM6 set and a D3D11 SM5 fallback
  (`D3D12TargetedShaderFormats` / `D3D11TargetedShaderFormats` under
  `[/Script/WindowsTargetPlatform.WindowsTargetSettings]`; template defaults unverified). The UnrealPak listing shows
  shader bytes per format. Dropping SM5 shrinks shader code, but then a GPU without D3D12 SM6 can't run the game at
  all; with SM5 it runs without Nanite and Lumen. Decide once, at the style lock (`docs/submission.md` "Known
  issues" depends on it).
- **Pak compression alone doesn't shrink BC textures or Nanite pages.** Oodle Texture RDO is off by default
  (`bFinalUsesRDO=false` in BaseEngine.ini `[/Script/Engine.TextureEncodingProjectSettings]`). If the zip is near the
  limit, turn it on in `DefaultEngine.ini` before the first package (the saving was not measured in the rehearsal).
  Epic's numbers: `[TextureFormatOodle] DefaultRDOLambda=30` (key not found in the 5.8.4 source or ini: check the
  log line below) "still produces high quality results"; per LOD group or
  texture, **Lossy Compression Amount** (Lowest 1, Low 10, Medium 20, High 30, Highest 40), 5-20 for normal maps.
  The log line `Oodle Texture ... init RDO On with DefaultRDOLambda=30` confirms it. RDO only pays off after pak
  compression (Kraken).
  The editor and `-game` also encode at Final speed (`EditorUsesSpeed=FinalIfAvailable`), so the first run after the
  switch re-encodes every texture it loads (162 "Building texture" lines and hitches in one `-game` test): switch it
  before a batch of tests, not during one, and open the editor once to fill the DDC.
- **Scripted asset edits can ship nulls:** a delete-and-reimport clears references to the asset, and the next
  save-all writes them (`editor-scripting.md` E). List the dirty packages before saving ahead of a package.

## First launch: PSO warm-up

- **A judge's first launch is a cold cache.** Shaders are cooked, but D3D12 still builds each pipeline state (PSO) on
  the player's PC; one built on demand "can take 100 or more milliseconds". The driver caches them on disk and a
  driver update clears that cache, so every judge starts cold. `bench.ts` warms the cache first and never sees this.
- **What precaching covers (on by default):** component PSOs (material x vertex factory, at PostLoad) and global
  compute shaders, but of the global graphics shaders only Slate, deferred lights, Cascade and volumetric fog. Other
  post-process and global passes can still hitch once on first use. Swapping a visible mesh to a material it never
  used is "a harder case": set every swap up at load time (e.g. a dynamic MI of the same master). Proxy strategy
  (pop-in vs hitch): `materials.md` "Performance and shader compiles".
- **Warm-up screen** (Epic "highly recommends" one; an empty driver cache takes "less than a minute on medium spec
  CPUs"). For a game that starts straight in its level:
  1. In the player controller's `BeginPlay`, add an opaque full-screen widget (title + "Preparing shaders...") with
     `SetInputMode(FInputModeUIOnly)` and gameplay timers paused. Keep the world rendering behind it: that also
     compiles the post-process and global passes it uses.
  2. Meanwhile fill every pool (`performance.md` "CPU / gameplay code") and spawn one of each actor class that
     appears later, so their components precache now, not mid-play.
  3. Poll `FShaderPipelineCache::NumPrecompilesRemaining()` (`ShaderPipelineCache.h`, RenderCore; Blueprint:
     `NumPrecompilingPSOsRemaining`) on a 0.1 s timer. Fade out after 3 reads of 0 in a row, or after 30 s (log the
     count left). Log the wait with the build stamp.
- **Test cold:** run the packaged build with `-clearPSODriverCache` (otherwise "hitches may be masked") and
  `r.PSOPrecache.Validation=1` (lightweight) or `2` (logs each `PSO PRECACHING MISS:` with material and pass), then
  `stat PSOPrecache`; Insights shows `PSOPrecache: Missed` / `Too Late`. `-corelimit=8` (from Epic's page; not found
  in the 5.8.4 engine source) may limit cores like a typical player CPU. One cold run per packaged milestone. Leave
  `r.PSOPrecache.KeepInMemoryUntilUsed` off (can add > 1 GB).
- **Skip the bundled PSO cache** (`-logPSO` play-throughs, the `ShaderPipelineCacheTools` commandlet, an `.spc` in
  `Build/Windows/PipelineCaches`, a second package, redone after big content changes). With precaching Epic says it
  "may not be necessary anymore". Consider it only if a cold run on day 3 still shows global-shader hitches.

## Derived Data Cache / Zen

- UE 5.4+ stores the local DDC in Zen: `C:\ProgramData\Epic\Zen\Data` (Windows). It holds compiled shaders and
  other derived data; disposable, rebuilt from .uasset files; never goes in Git.
- Move it with the `UE-LocalDataCachePath` env var (restart editor) if C: runs short. Not needed on the target PC now.
- The "Failed reading oplog from Zen at [::1]:8558" burst seen in our packaging test recovered by itself.
  If a packaged build is missing content, suspect Zen first and re-run the package.

## C++ build tools

- UBT builds; it runs UHT (reflection code generation) first, then the compiler. Never run UHT by hand.
- **UHT runs with warnings-as-errors**: any UHT warning fails the build. The reflection rules that keep it green
  (`.generated.h` last, `UDELEGATE` for delegate-only headers, ...) and the known engine warnings: `cpp.md`.

## Editor scripting

- Use the editor subsystems (`EditorActorSubsystem`, `LevelEditorSubsystem`, `EditorAssetSubsystem`...) for
  automation. The Editor Scripting Utilities plugin is Beta and off by default, and its `EditorLevelLibrary` /
  mesh libraries are deprecated in favour of the subsystems (`EditorAssetLibrary` is still fine; `editor-scripting.md`
  A). `EditorAssetLibrary` itself lives in that plugin (`Plugins/Editor/EditorScriptingUtilities`), which
  ToolsetRegistry depends on (5.8.4 `.uplugin` files), so enabling the MCP plugins enables it; `MegajamTools.uplugin`
  lists it too, since its Python calls `EditorAssetLibrary`.
- Python editor scripting and Unreal MCP are Beta/Experimental (`features.md`); every pipeline step is therefore
  verified by reading back state or a screenshot.

## Version control

- Epic's docs cover Perforce, SVN, Anchorpoint, Diversion and Epic's new Lore, not Git. Our Git + LFS setup
  (`scripts/init-repo.ps1`) is our own and tested. Binary assets (.uasset/.umap) can't be merged: one writer at a time
  (only one session edits the editor anyway).

## Build stamp (game side)

`scripts/package.ps1` writes `<Build>\<Project>\BuildStamp.txt` (`<Build>` as defined in `debugging.md`), one line:
`<short commit>[+dirty] <time>`. In the game, read `FPaths::ProjectDir() / TEXT("BuildStamp.txt")` once into a static
`FString` (fallback `"editor"` when missing, i.e. PIE),
log it from the game mode's `InitGame`, and draw it small in a HUD corner. When someone reports a bug, the stamp says
which build they played (a stale unzipped copy fooled a prototype test).

## Unsigned builds and Windows Smart App Control

- On the dev PC, SAC blocks freshly compiled editor DLLs at random ("Bad Image ... 0xc0e90002", then "The game module
  could not be loaded"; log `GetLastError=4551`; Event Viewer CodeIntegrity 3033/3077). Keep SAC off (`SETUP.md`).
- For players: SAC checks every executable, zip-extracted ones too, with no per-file "Run anyway"; the only fix is
  turning SAC off machine-wide. New Windows 11 installs start in evaluation mode and many switch it off, so expect a
  minority of players. Only the two `<Game>.exe` files are unsigned; staged third-party DLLs are already signed.
- Mitigations: **Microsoft Artifact Signing** (~$10/month; identity check 1-20 business days; individuals must be in
  the US or Canada, organisations qualify in more countries), an **OV certificate** (~$120-220/yr, key on a hardware
  token or cloud HSM), or no signing plus a note on the game page (`SETUP.md` section 9). Self-signing doesn't help.
  Sign after packaging (any later change breaks the signature) and check with `Get-AuthenticodeSignature`.

## Final pass (last half-day, on the packaged zip)

Freeze features first: from here, only fixes. Each check is done on the build that will ship, unzipped to a fresh
folder, never on PIE.

- **Full play-through twice**, start to credits, with real input (keyboard and mouse, plus gamepad if the page claims
  it). Restart, quit and every menu path work; Esc always has a way out; the game never soft-locks.
- **No debug left on screen:** print strings, on-screen debug messages, debug draws, `stat` overlays, cheat keys,
  test levels in the level list. The build stamp is the only debug text. A Development build also prints engine
  warnings on screen (texture pool over budget and similar): run the console command `DisableAllScreenMessages` once
  at startup (e.g. from the game mode, `#if !UE_BUILD_SHIPPING`; unverified in 5.8.4). It hides
  `AddOnScreenDebugMessage` text too.
- **Starts right:** opens in the intended window mode at the monitor's native resolution, mouse captured, first
  gameplay within seconds; a missing save or settings file doesn't break the first launch.
- **Cold first launch:** delete `<Build>\<Project>\Saved\` and run with `-clearPSODriverCache`: the warm-up screen
  ends within about a minute, and the first 30 s of play show no pop-in and no hitch over twice the frame time. Start
  it once in Windows Sandbox or on a second PC for missing DLLs ("Packaging and what gets shipped").
- **No ensures:** grep the play-through's `Saved\Logs` for `Ensure condition failed`; each first fire hitches
  (`debugging.md` triage).
- **Performance:** `gen/perf/bench.ts --target-fps <target>` on this build meets `performance.md` "The bar", including
  the Low-preset check and a settings menu that changes quality, resolution scale and frame cap; one look at the
  worst spot in the level.
- **Audio:** nothing clips, music and effects balanced, no sound missing on key actions, volume sensible at launch.
- **Compliance:** credits list every sourced asset (`SOURCED_ASSETS.md`); no trademarks or real brands; content fits a
  Teen rating; all text in English.
- **Package:** zip named `TeamName_GameName.zip`, under 1,000,000,000 bytes (`scripts/package.ps1` checks), no
  `Saved/` inside (`scripts/upload.ps1` checks), build stamp matches the final commit with no `+dirty`.
- **Submission:** video passes its checklist (`cinematics-video.md`); page, form and devlog per `docs/submission.md`.

## Sources (5.8)

- Naming: https://dev.epicgames.com/documentation/en-us/unreal-engine/recommended-asset-naming-conventions-in-unreal-engine-projects?application_version=5.8
- Asset management: https://dev.epicgames.com/documentation/en-us/unreal-engine/asset-management-in-unreal-engine?application_version=5.8
- DDC: https://dev.epicgames.com/documentation/en-us/unreal-engine/using-derived-data-cache-in-unreal-engine?application_version=5.8
- Zen: https://dev.epicgames.com/documentation/en-us/unreal-engine/zen-storage-server-for-unreal-engine?application_version=5.8
- Scripting: https://dev.epicgames.com/documentation/en-us/unreal-engine/scripting-and-automating-the-unreal-editor?application_version=5.8
- Version control: https://dev.epicgames.com/documentation/en-us/unreal-engine/collaboration-and-version-control-in-unreal-engine?application_version=5.8
- Build configurations: https://dev.epicgames.com/documentation/en-us/unreal-engine/build-configurations-reference-for-unreal-engine?application_version=5.8
- Packaging settings (`MapsToCook`, prerequisites): https://dev.epicgames.com/documentation/en-us/unreal-engine/API/Developer/DeveloperToolSettings/UProjectPackagingSettings?application_version=5.8 ,
  https://dev.epicgames.com/documentation/en-us/unreal-engine/project-section-of-the-unreal-engine-project-settings?application_version=5.8
- Oodle Data / Texture: https://dev.epicgames.com/documentation/en-us/unreal-engine/oodle-data?application_version=5.8 ,
  https://dev.epicgames.com/documentation/en-us/unreal-engine/oodle-texture-in-unreal-engine?application_version=5.8
- Hardware specs (SM6 for Nanite/Lumen): https://dev.epicgames.com/documentation/en-us/unreal-engine/hardware-and-software-specifications-for-unreal-engine?application_version=5.8
- PSO precaching / caches / bundled caches: https://dev.epicgames.com/documentation/en-us/unreal-engine/pso-precaching-for-unreal-engine?application_version=5.8 ,
  https://dev.epicgames.com/documentation/en-us/unreal-engine/optimizing-rendering-with-pso-caches-in-unreal-engine?application_version=5.8 ,
  https://dev.epicgames.com/documentation/en-us/unreal-engine/manually-creating-bundled-pso-caches-in-unreal-engine?application_version=5.8
- `FShaderPipelineCache`: https://dev.epicgames.com/documentation/en-us/unreal-engine/API/Runtime/RenderCore/FShaderPipelineCache?application_version=5.8 ;
  Blueprint: https://dev.epicgames.com/documentation/unreal-engine/BlueprintAPI/Rendering/PipelineCache/NumPrecompilingPSOsRemaining
- Command-line arguments (`-dx11`): https://dev.epicgames.com/documentation/en-us/unreal-engine/unreal-engine-command-line-arguments-reference?application_version=5.8
- FLoadingScreenAttributes (SETUP 7b): https://dev.epicgames.com/documentation/en-us/unreal-engine/API/Runtime/MoviePlayer/FLoadingScreenAttributes?application_version=5.8
- Build pipeline: https://dev.epicgames.com/documentation/en-us/unreal-engine/using-the-unreal-engine-build-pipeline?application_version=5.8
  (UBT: unreal-build-tool-in-unreal-engine, UHT: unreal-header-tool-for-unreal-engine, UAT: unreal-automation-tool-for-unreal-engine)


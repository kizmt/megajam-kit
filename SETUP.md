# New project setup — UE 5.8.4 + Claude Code

Verified on the target PC (Windows 11, i5-14500, RTX 4060 8 GB, 32 GB) on 2026-10-24 with the kit's test project.
Target: ~10 minutes on jam day. Do the steps in order.

## Machine prerequisites (already done, re-check only)

- Unreal Engine 5.8.4 (Epic launcher install)
- Visual Studio 2026 (18.10.x) with the "Game development with C++" workload — verified compiling on 5.8.4
- Git + Git LFS (`git lfs version` → 3.7.1)
- Claude Code
- **Windows Smart App Control off** (Windows Security > App & browser control > Smart App Control settings).
  With it on, freshly compiled editor DLLs get blocked at random ("Bad Image ... 0xc0e90002", then "The game module
  could not be loaded"). Check: `VerifiedAndReputablePolicyState` under
  `HKLM\SYSTEM\CurrentControlSet\Control\CI\Policy` is 0. Since the April 2026 update it can be re-enabled later if
  needed.
- Node 24+ (runs the kit's `.ts` scripts directly) and pnpm (`pnpm --version`). Once per machine: `pnpm install` in
  the kit folder (TypeScript + Node types for `pnpm typecheck`; nothing is needed at runtime)
- Blender 5.2 on PATH (`blender --version`; the pipeline runs it headless)
- ffmpeg on PATH (`ffmpeg -version`; audio conversion and video recipes)
- Tripo CLI (`tripo --version`; install per Tripo's docs)

**Pasting commands and values:** copy them from their own code block, never from the end of a sentence. Trailing
punctuation copied with them has broken setup before (`GenerateClientConfig ClaudeCode.` logs
`Unknown client "ClaudeCode."`; an Asset Manager directory was saved as `/Game/Unused.`).

## 0. Planning folder for the theme window (the night before, 2 min)

The theme window runs before the project exists (`prompts/concept.md`). Check it with the rest of setup:
1. Create `C:\dev\_plan\` with an empty `design\` folder.
2. Copy the kit's `CLAUDE.md` into it (robocopy, see step 5.3).
3. `C:\dev\_plan\.claude\settings.local.json`: step 5's `attribution` and `permissions` (`additionalDirectories`,
   `deny`) lines only; no MCP lines yet.

## 1. Create the project (2 min)

1. Unreal Project Browser → Games → **Blank**, **C++**.
2. Location `C:\dev`, name `<ProjectName>` (short path; Unreal creates the project folder itself). Ask the director
   for the **team name** too (it names the zip, step 7): solo entrants use their itch.io username or their name.
3. Wait for the C++ build; the editor should open with no "rebuild modules" prompt.

## 2. Plugins (2 min)

1. Edit → Plugins → enable **Unreal MCP** and **All Toolsets**. (Python Editor Script Plugin is already on by
   default.)
2. Restart Now.
   **Launcher plugin updates can arrive mid-jam.** If a build or `package.ps1` fails with `RulesError` naming
   `FabToolset` (a Fab plugin update added a module the installed engine's precompiled rules don't know), set
   `{"Name": "Fab", "Enabled": false}` in the `.uproject` plugins list. Re-enable Fab only to import a sourced pack.
   A `"TargetAllowList": ["Editor"]` entry does not fix it (the editor target fails the same way).
3. Fix the Asset Manager entry the plugins need (otherwise a "GameFeatureData" prompt appears every launch):
   Project Settings → Game → Asset Manager → Primary Asset Types to Scan → **+**
   - Primary Asset Type: `GameFeatureData`
   - Asset Base Class: `GameFeatureData`
   - Directories:

     ```
     /Game/Unused
     ```

   A one-off "Ensure condition failed: HasValidRuntimeData()" while filling this in is expected and harmless.
4. Edit → **Editor Preferences** → Plugins → Python → tick **Developer Mode** (per-user; prefer this over the
   Project Settings copy, as Epic's own comment says). On the next restart the editor writes the Python API stub
   `Intermediate\PythonStub\unreal.py`, which Claude greps before writing editor Python.
5. Content Drawer → **Add** → **Add Feature or Content Pack** → **Third Person** → Add to Project. The character
   pipeline needs its Manny skeleton and `ABP_Unarmed` (`PIPELINE.md`, characters).
6. Optional, only if the jam idea uses procedural levels: also enable **PCG Primitives** (Experimental;
   pulls in PCG Geometry Script Interop). See `docs/ue/pcg.md`. Restart again.
7. Renderer check (no clicks needed; the Blank C++ template already has these). Open
   `Config\DefaultEngine.ini` and confirm:
   `r.DynamicGlobalIlluminationMethod=1` (Lumen), `r.ReflectionMethod=1` (Lumen),
   `r.Shadow.Virtual.Enable=1` (Virtual Shadow Maps), `r.Substrate=True`.
   Verified on a test project 2026-10-24. If one is missing, ask Claude to fix it rather than changing it by hand.

## 3. MCP server (1 min)

1. Edit → Editor Preferences → General → Model Context Protocol → tick **Auto Start Server** (port 8000, path
   `/mcp`). Do not use "Set as Default".
2. Console: Window → Output Log → the **Cmd** box at the bottom (backtick is a dead key on some layouts). Run:

   ```
   ModelContextProtocol.StartServer
   ```

3. Then this, which writes `.mcp.json` to the project root:

   ```
   ModelContextProtocol.GenerateClientConfig ClaudeCode
   ```

4. Check: the Output Log shows `Created new HttpListener on 127.0.0.1:8000` and ~52 "Registering Toolset" lines, and
   `.mcp.json` exists in the project root.

## 4. Starting level (2 min)

The Blank template opens a temporary Open World level (Landscape, World Partition, HLODs). Replace it:

1. File → New Level → **Basic**.
2. Save As → create folder `Maps` under Content → name `Main` (= `/Game/Maps/Main`).
3. Project Settings → Maps & Modes → **Editor Startup Map** and **Game Default Map** = `Main`.

## 5. Claude Code (2 min)

1. Create `<ProjectRoot>\.claude\settings.local.json`:

   ```json
   {
     "enabledMcpjsonServers": ["unreal-mcp"],
     "allowedMcpServers": [{ "serverUrl": "http://127.0.0.1:8000/mcp" }],
     "disableClaudeAiConnectors": true,
     "autoCompactWindow": 300000,
     "attribution": { "commit": "", "pr": "" },
     "permissions": {
       "additionalDirectories": ["C:\\dev\\megajam-kit"],
       "deny": ["Edit(//c/dev/megajam-kit/**)"]
     }
   }
   ```

   `additionalDirectories` gives the session the kit (scripts, `PIPELINE.md`, `docs/ue/`) without leaving the
   project; the `deny` rule keeps it read-only (Windows paths match as `//c/...`). Kit suggestions go to the
   project's `KIT_NOTES.md`.
   `attribution` with empty strings keeps "Co-Authored-By" and session links out of commit messages and PRs.
   `autoCompactWindow` compacts at 300K tokens instead of ~967K (Opus 5.5 has a 1M window): faster, cheaper turns.
   Keep `PROGRESS.md` current so nothing important lives only in the conversation when it compacts.

   Optional: `allow` rules for the read-only calls sessions make most (`git status`, `Get-Process`) mean fewer calls
   wait on the auto-mode permission check, which sometimes fails with "no verdict". Check the rule syntax first.

   This limits the session to Unreal only. Remove `disableClaudeAiConnectors` / widen the allowlist if a jam idea
   needs another service (e.g. Vercel for a backend).
2. Set effort to **high** (`/effort high`, or have Claude set it as the project default).
3. Copy the kit's `CLAUDE.md` into the project root. Re-copy it whenever the kit's copy changes (sessions compare
   the two at start and say when the copy is behind; a stale copy silently misses newer rules).
   **Copy out of the kit with robocopy.** The `deny` rule makes the session's permission check treat a `Copy-Item`
   *source* in the kit as a write target and refuse it (the error misleadingly lists the kit as allowed).
   robocopy works (exit code 1 means "files copied", not an error):

   ```
   robocopy C:\dev\megajam-kit C:\dev\<ProjectName> CLAUDE.md
   robocopy C:\dev\megajam-kit\agents C:\dev\<ProjectName>\.claude\agents critic.md
   ```

   The second line installs the blind `critic` subagent (`agents/critic.md`; its brief is `prompts/critic.md`). Do
   it **before** the first session starts: Claude Code hot-reloads `.claude\agents\` only if the folder existed when the session started.
4. With the editor already open: `cd C:\dev\<ProjectName>` → `claude` → approve `unreal-mcp`.
5. `/mcp` should list only `unreal-mcp` (3 tools: tool search mode).
6. Test: "What actors are in the current level?" — should list the Basic level's actors.

## 6. Kit scripts, plugin + Git (2 min)

1. Copy the kit's `scripts\` folder (`build.ps1`, `package.ps1`, `init-repo.ps1`, `upload.ps1`) into the project
   root (`C:\dev\<ProjectName>\scripts\`). The scripts find the project from their own location, so they must live
   inside the project.
   Copy `unreal\Plugins\MegajamTools` into `C:\dev\<ProjectName>\Plugins\` and restart the editor. Use robocopy
   (step 5.3):

   ```
   robocopy C:\dev\megajam-kit\scripts C:\dev\<ProjectName>\scripts /E
   robocopy C:\dev\megajam-kit\unreal\Plugins\MegajamTools C:\dev\<ProjectName>\Plugins\MegajamTools /E
   ```

   Check: Output Log shows `Registering Toolset megajam_tools.toolsets.MegajamTools`.
   (Adds `import_sound`, `import_any`, `run_console_command`, `run_python` and `get_sound_info` to MCP. Enabled by
   default; no prompt.)
2. `.\scripts\init-repo.ps1` → writes Unreal `.gitignore` + `.gitattributes`, runs `git init`, enables LFS,
   makes the first commit. Binaries/Intermediate/Saved/DerivedDataCache are ignored; `.uasset`/`.umap`,
   images, models and audio go through LFS.
3. Commit at the end of every round. On jam day the first commit must be after 2026-11-12 14:00 JST.
4. **The director** sets `MEGAJAM_PROJECT=C:\dev\<ProjectName>` in the **kit's** `.env` (the session may not edit
   the kit, and `.env` holds the keys it must never read). All generators (images, props, characters, audio,
   screenshots) write to `<Project>\Generated\`, which `init-repo.ps1` gitignores. Never leave it pointing at a
   practice project on jam day; `gen/paths.ts` refuses a folder with no `.uproject`.
   Until it is set, the session can point one command at the project: a variable already in the environment wins
   over `.env` (`process.loadEnvFile` doesn't override it; checked on Node 22). Each shell call is fresh, so set it
   in the same command: `$env:MEGAJAM_PROJECT='C:\dev\<ProjectName>'; node gen\audio.ts ...`

Verified 2026-10-24 on a test project: 17 files tracked (0.07 MB), `Main.umap` via LFS, clean status.

## 6b. C++ build loop (verified 2026-10-24)

- New or changed UCLASS/UPROPERTY/UFUNCTION, new files, Build.cs: Save All → close the editor →
  `.\scripts\build.ps1` (PASS = 0 errors, 0 warnings in our files) → reopen. No "rebuild modules" prompt expected.
- Function-body changes: stay in the editor; Claude runs `LiveCoding.Compile` and checks the log.

## 7. Packaging

- `scripts\package.ps1` → Win64 Development build to `C:\dev\Builds\<ProjectName>\` + zip named
  `<ZipName>_<ProjectName>.zip`. The jam wants `TeamName_GameName.zip`: name the project after the game and pass
  `-ZipName <TeamName>` (the same value to `upload.ps1`).
- **Close the editor first** (File → Save All, then exit). Live Coding locks the build tools while the editor is open.
- Verified 2026-10-24: empty project packaged in 4m47s. The zip leaves out the ~350 MB `.pdb` debug
  symbols (they stay in the build folder for crash debugging), so the empty-project zip is 401 MB.
  That is engine baseline: the game's own content has about 600 MB before the jam's 1 GB archive limit.

## 7b. Game display + render path (Claude applies, 5 min; editor closed)

Decide the render path **with the style lock**, before gameplay. Switching later costs a look re-tune. Measured
numbers: `docs/ue/performance.md` "Render paths"; re-measure with `bench.ts` (its built-in comparison runs all
three) for yours. Rule of thumb: no-Lumen for flat/stylized looks and many moving characters; full Lumen when the
look depends on bounce light (interiors, realism, mood lighting) and the budget allows; **Lumen Lite** when the look
needs dynamic bounce light but full Lumen doesn't fit the target fps (softer GI, screen-space reflections only).

**All paths**
- `Config/DefaultEngine.ini`:
  - under the existing `[/Script/Engine.RendererSettings]`: `r.DefaultFeature.MotionBlur=False`
  - under the existing `[/Script/Engine.UserInterfaceSettings]`: `bAllowHighDPIInGameMode=True` (true 4K, not
    2560x1440 stretched)
  - `[SystemSettings]`: `r.Tonemapper.Sharpen=0` (sharpening an upscaled image adds halos, not detail)
- `Config/DefaultScalability.ini`: `[AntiAliasingQuality@3]` and `[AntiAliasingQuality@Cine]` each
  `r.TSR.History.ScreenPercentage=100` (200% costs ~3 ms at 4K and is only marginally cleaner)
- `Config/DefaultScalability.ini`: texture pool per quality level (the engine's 800 MB at High blurs a dense 4K scene;
  `docs/ue/performance.md` "Textures and memory"). A prototype's working values: `[TextureQuality@1]`
  `r.Streaming.PoolSize=1000`, `@2` 1800, `@3` 2500, `@Cine` 3000, with `r.Streaming.LimitPoolSizeToVRAM=1` under
  `@3` and `@Cine`.
- Internal resolution: every path names it. Unset, a 4K display renders 1080 lines (50%). The no-Lumen path sets it
  below; on the Lumen paths add the same two `r.ScreenPercentage.Default*` lines with the value the bench chose.
- `Config/DefaultInput.ini`: add `+ConsoleKeys=F10` after `+ConsoleKeys=Tilde` (backtick is a dead key on some layouts)
- Level: delete the template's **VolumetricCloud** actor (~2.5 ms at 4K). Keep SkyAtmosphere's aerial perspective view
  distance scale at 1-2 (higher washes out the far end).

**No-Lumen path (stylized looks)**
- `[/Script/Engine.RendererSettings]`: `r.DynamicGlobalIlluminationMethod=0`, `r.ReflectionMethod=2` (SSR),
  `r.AntiAliasingMethod=4` (TSR)
- `[SystemSettings]`: `r.ScreenPercentage.Default.Desktop.Mode=0`, `r.ScreenPercentage.Default=58.33` (1260p internal on
  4K; a starting point to bench), `r.AmbientOcclusionLevels=0` (SSAO switches on without Lumen), `r.DistanceFieldAO=0`.
  `r.AllowOcclusionQueries=0` only if a bench shows it helps (it can free ~1 ms of render thread in small open scenes;
  it hurts enclosed scenes)
- Lighting stand-ins for the missing bounce (`docs/ue/lighting.md` "No-Lumen look"): sky light lower hemisphere in the
  floor colour, Sphere Reflection Captures over the play area, a sky light tint chosen for the shadow colour the
  style lock wants.

**Full Lumen path (looks that need bounce light)**
- Keep the template's Lumen GI and reflections. `Config/DefaultGameUserSettings.ini`: `[ScalabilityGroups]` with
  `sg.GlobalIlluminationQuality=2`, `sg.ReflectionQuality=2`, `sg.ShadowQuality=2` (High: ~+20 fps vs Epic).
- With a physically bright sun (~100,000 lux) add `r.EyeAdaptation.CachedLightingPreExposure=8` under
  `[/Script/Engine.RendererSettings]`, or Lumen's cached lighting clips (black shadows, on-screen "clipped" warning).
- Cap traced reflections in the post-process volume (`LumenMaxRoughnessToTraceReflections` 0.25): ~1 ms saved on
  glossy scenes. Don't also set the cvar in an ini, or it silently overrides the level. The Basic level has no
  post-process volume, so this is set when the look-test volume is built (`prompts/style-lock.md` step 4).

**Lumen Lite path (bounce light on a tighter budget)**
- As the Lumen path, but ship Medium for GI and reflections: `[ScalabilityGroups]` `sg.GlobalIlluminationQuality=1`,
  `sg.ReflectionQuality=1`, `sg.ShadowQuality=2` (Irradiance final gather + SSR; `docs/ue/lighting.md` "Scalability").
  Reflection-related PPV settings (`LumenMaxRoughnessToTraceReflections`) don't apply: there are no Lumen reflections.
- Glossy surfaces only reflect what's on screen: judge the look on the style-lock scene, not a test level.

**Check (all):** package, then `node gen/perf/bench.ts --res native --target-fps <target> --variant "check:"`
(`<target>` is 60 until the game's target is chosen). An empty level typically
averages 120+ fps on any path; the gap opens up with content. The bar is in `docs/ue/performance.md`.

## 8. Editor performance (re-check, 1 min)

Editor-only settings for the RTX 4060 on a 4K monitor. They don't change the packaged game.
Most are per-user and carry over between projects; confirm on jam day.

1. Edit → Editor Preferences → Performance → Viewport Resolution:
   - "Override project's default screen percentage mode for realtime editor viewports using desktop rendering" = **Manual**
   - Tick "Override project's manual screen percentage", set "Editor viewport screen percentage" = **60** (75 if too soft)
2. Same page: **"Use Less CPU when in Background" off** (you set it; it is a per-user setting Claude doesn't change
   without asking). The editor runs in the background while Claude drives it from the terminal: with it on, PIE drops
   to ~3 fps, Niagara compiles stall and MCP-driven captures wait for focus.
3. Viewport toolbar → speedometer icon (Performance & Scalability) → **Viewport Scalability → High**.
   Switch to Epic only when judging final visuals. Untick **Realtime Viewport** (Ctrl+R) when idle.
4. Edit → Editor Preferences → Loading & Saving → **Auto Save** on (10 min).

## 9. Shipping: itch.io upload (once per machine, before the jam)

Do this before jam day so the first real upload isn't on the final night.

1. **butler** (itch.io's upload tool): download the Windows build from https://itchio.itch.io/butler
   (direct channel: `https://broth.itch.zone/butler/windows-amd64/LATEST/archive/default`), unzip to `C:\butler`,
   add it to the **user** PATH, check `butler version`. Shells that were already open (including Claude's) don't see
   the new PATH: call `C:\butler\butler.exe` directly or restart them.
2. `butler login` once (opens a browser). The credentials file `%USERPROFILE%\.config\itch\butler_creds` is a secret;
   revoke at itch.io/user/settings/api-keys.
3. Create the game page as a **draft** early (itch.io/game/new). butler can't push to a page that doesn't exist.
4. `upload.ps1` is in the project's `scripts\` (step 6). `.\scripts\upload.ps1 -ZipName <TeamName> -Target user/game`
   is a dry run (checks the zip, build stamp, butler, login, no `Saved/` in the zip, and prints the commands);
   `-Push` uploads. It pushes the **zip**, never the build folder. A channel name containing `windows` tags the
   platform.
5. Game page text: the exe is unsigned. Add a line like *"Unsigned build: Windows SmartScreen may need More info >
   Run anyway. If Smart App Control is on, Windows blocks the game; it can only be turned off machine-wide (Windows
   Security > App & browser control)."* Code signing (Microsoft Artifact Signing, or an OV certificate) removes this
   but needs identity verification of 1-20 business days; see `docs/ue/production.md`.
6. Trailer: the jam wants a link (YouTube, unlisted is fine), not an upload. Recipes in `docs/ue/cinematics-video.md`.

## 10. Animation library (once per machine, before the jam; you do the Fab steps)

Sources and reasons: `docs/ue/animation-library.md`. These are **sourced assets** (allowed, listed on submission, not
scored); download them now, retarget them onto the game's characters during the jam.

1. Fab (in the browser or the Epic launcher): add the packs from `docs/ue/animation-library.md` "Reference
   inventory" to your library. Any other pack only if its listing says "Allows usage with AI: Yes". Adding them
   accepts their licences. **Check that flag yourself for every pack you plan to use** (the session can't load Fab:
   it answers 403) and note it with the listing URL and the date in `C:\dev\AnimLibrary\SOURCED_ASSETS.md`; the
   game's `SOURCED_ASSETS.md` copies those lines.
2. Create a library project `C:\dev\AnimLibrary` (Blank, UE 5.8.4) and add those packs to it from the launcher's
   Library tab ("Add to Project"). Not tracked in any game repo.
3. Optional: an Adobe ID for Mixamo (rolls, knockdowns, get-ups, extra deaths); a paid melee pack for parries.
4. During the jam, migrate only the folders you need into the game (Migrate keeps each pack's `/Game/<Pack>/` path)
   and run `node gen/unreal/retarget_library.ts` with the arguments in `docs/ue/animation-library.md` "Workflow".

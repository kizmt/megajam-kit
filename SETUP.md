# New project setup — UE 5.8.4 + Claude Code

Verified on GIZMO (Windows 11, i5-14500, RTX 4060 8 GB, 32 GB) on 2026-10-24 with the kit's test project.
Target: ~10 minutes on jam day. Do the steps in order.

## Machine prerequisites (already done, re-check only)

- Unreal Engine 5.8.4 (Epic launcher install)
- Visual Studio 2026 (18.10.x) with the "Game development with C++" workload — verified compiling on 5.8.4
- Git + Git LFS (`git lfs version` → 3.7.1)
- Claude Code
- **Windows Smart App Control off** (Windows Security > App & browser control > Smart App Control settings).
  With it on, freshly compiled editor DLLs get blocked at random ("Bad Image ... 0xc0e90002", then "The game module
  could not be loaded"). Check: `VerifiedAndReputablePolicyState` under
  `HKLM\SYSTEM\CurrentControlSet\Control\CI\Policy` is 0. Since the April 2026 update it can be turned back on.
- Node 24+ (runs the kit's `.ts` scripts directly). Once per machine: `pnpm install` in the kit folder
  (TypeScript + Node types for `pnpm typecheck`; nothing is needed at runtime)

## 1. Create the project (2 min)

1. Unreal Project Browser → Games → **Blank**, **C++**.
2. Location `C:\dev`, name `<ProjectName>` (short path; Unreal creates the project folder itself).
3. Wait for the C++ build; the editor should open with no "rebuild modules" prompt.

## 2. Plugins (2 min)

1. Edit → Plugins → enable **Unreal MCP** and **All Toolsets**. (Python Editor Script Plugin is already on by default.)
2. Restart Now.
3. Fix the Asset Manager entry the plugins need (otherwise a "GameFeatureData" prompt appears every launch):
   Project Settings → Game → Asset Manager → Primary Asset Types to Scan → **+**
   - Primary Asset Type: `GameFeatureData`
   - Asset Base Class: `GameFeatureData`
   - Directories: `/Game/Unused`
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

1. Edit → Editor Preferences → General → Model Context Protocol → tick **Auto Start Server** (port 8000, path `/mcp`). Do not use "Set as Default".
2. Console: Window → Output Log → the **Cmd** box at the bottom (backtick is a dead key on the NZ layout): `ModelContextProtocol.StartServer`
3. Console: `ModelContextProtocol.GenerateClientConfig ClaudeCode` → writes `.mcp.json` to the project root.
4. Output Log should show `Created new HttpListener on 127.0.0.1:8000` and ~52 "Registering Toolset" lines.

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
     "permissions": {
       "additionalDirectories": ["C:\\dev\\megajam-kit"],
       "deny": ["Edit(//c/dev/megajam-kit/**)"]
     }
   }
   ```

   `additionalDirectories` gives the session the kit (scripts, `PIPELINE.md`, `docs/ue/`) without leaving the project;
   the `deny` rule keeps it read-only (Windows paths match as `//c/...`). Kit suggestions go to the project's `KIT_NOTES.md`.
   `autoCompactWindow` compacts at 300K tokens instead of ~967K (Opus 5.5 has a 1M window): faster, cheaper turns.
   Keep `PROGRESS.md` current so nothing important lives only in the conversation when it compacts.

   This limits the session to Unreal only. Remove `disableClaudeAiConnectors` / widen the allowlist if a jam idea needs another service (e.g. Vercel for a backend).
2. Set effort to **high** (`/effort high`, or have Claude set it as the project default).
3. Copy the kit's `CLAUDE.md` into the project root.
4. With the editor already open: `cd C:\dev\<ProjectName>` → `claude` → approve `unreal-mcp`.
5. `/mcp` should list only `unreal-mcp` (3 tools: tool search mode).
6. Test: "What actors are in the current level?" — should list the Basic level's actors.

## 6. Kit scripts, plugin + Git (2 min)

1. Copy the kit's `scripts\` folder (`build.ps1`, `package.ps1`, `init-repo.ps1`) into the project root (`C:\dev\<ProjectName>\scripts\`).
   The scripts find the project from their own location, so they must live inside the project.
   Copy `unreal\Plugins\MegajamTools` into `C:\dev\<ProjectName>\Plugins\` and restart the editor.
   Check: Output Log shows `Registering Toolset megajam_tools.toolsets.MegajamTools`.
   (Adds sound import, generic import and console commands to MCP. Enabled by default; no prompt.)
2. `.\scripts\init-repo.ps1` → writes Unreal `.gitignore` + `.gitattributes`, runs `git init`, enables LFS,
   makes the first commit. Binaries/Intermediate/Saved/DerivedDataCache are ignored; `.uasset`/`.umap`,
   images, models and audio go through LFS.
3. Commit at the end of every round. On jam day the first commit must be after 2026-11-12 14:00 JST.
4. In the **kit's** `.env`, set `MEGAJAM_PROJECT=C:\dev\<ProjectName>`. All generators (images, props,
   characters, audio, screenshots) write to `<Project>\Generated\`, which `init-repo.ps1` gitignores.
   Never leave it pointing at a practice project on jam day.

Verified 2026-10-24 on a test project: 17 files tracked (0.07 MB), `Main.umap` via LFS, clean status.

## 6b. C++ build loop (verified 2026-10-24)

- New or changed UCLASS/UPROPERTY/UFUNCTION, new files, Build.cs: Save All → close the editor →
  `.\scripts\build.ps1` (PASS = 0 errors, 0 warnings in our files) → reopen. No "rebuild modules" prompt expected.
- Function-body changes: stay in the editor; Claude runs `LiveCoding.Compile` and checks the log.

## 7. Packaging

- `scripts\package.ps1` → Win64 Development build to `C:\dev\Builds\<ProjectName>\` + zip.
- **Close the editor first** (File → Save All, then exit). Live Coding locks the build tools while the editor is open.
- Verified 2026-10-24: empty project packaged in 4m47s. The zip leaves out the ~350 MB `.pdb` debug
  symbols (they stay in the build folder for crash debugging), so the empty-project zip is 401 MB.
  That is engine baseline: the game's own content has about 600 MB before itch's 1 GB zip limit.

## 7b. Game display + render path (Claude applies, 5 min; editor closed)

Decide the render path **with the style lock**, before gameplay. Switching later costs a look re-tune. The
numbers below come from one game, a stylized 3D platformer race prototype (12 characters running an obstacle course, glossy pastel look), and an empty test level: re-measure with `bench.ts` for yours.
Rule of thumb: try the no-Lumen path for flat/stylized looks and many moving characters; keep Lumen when the look
depends on bounce light (interiors, realism, mood lighting).

**Both paths**
- `Config/DefaultEngine.ini`:
  - under the existing `[/Script/Engine.RendererSettings]`: `r.DefaultFeature.MotionBlur=False`
  - under the existing `[/Script/Engine.UserInterfaceSettings]`: `bAllowHighDPIInGameMode=True` (true 4K, not 2560x1440 stretched)
  - `[SystemSettings]`: `r.Tonemapper.Sharpen=0` (sharpening an upscaled image adds halos, not detail)
- `Config/DefaultScalability.ini`: `[AntiAliasingQuality@3]` and `[AntiAliasingQuality@Cine]` each `r.TSR.History.ScreenPercentage=100`
  (200% costs ~3 ms at 4K and is only marginally cleaner)
- `Config/DefaultInput.ini`: add `+ConsoleKeys=F10` after `+ConsoleKeys=Tilde` (backtick is a dead key on some layouts, e.g. NZ)
- Level: delete the template's **VolumetricCloud** actor (~2.5 ms at 4K). Keep SkyAtmosphere's aerial perspective view
  distance scale at 1-2 (higher washes out the far end).

**No-Lumen path (stylized looks)**
- `[/Script/Engine.RendererSettings]`: `r.DynamicGlobalIlluminationMethod=0`, `r.ReflectionMethod=2` (SSR),
  `r.AntiAliasingMethod=4` (TSR)
- `[SystemSettings]`: `r.ScreenPercentage.Default.Desktop.Mode=0`, `r.ScreenPercentage.Default=58.33` (1260p internal on
  4K), `r.AmbientOcclusionLevels=0` (SSAO switches on without Lumen), `r.DistanceFieldAO=0`, `r.AllowOcclusionQueries=0`
  (small open scenes: frees ~1 ms of render thread)
- Lighting stand-ins for the missing bounce (`docs/ue/lighting.md` "No-Lumen look"): sky light lower hemisphere in the
  floor colour, Sphere Reflection Captures over the play area, a warm sky light tint for lilac rather than blue shadows.
- On the prototype: 122 fps avg / 117 p95 at 4K, vs ~101 / 95 with Lumen, and smoother ground under moving characters.

**Lumen path (looks that need bounce light)**
- Keep the template's Lumen GI and reflections. `Config/DefaultGameUserSettings.ini`: `[ScalabilityGroups]` with
  `sg.GlobalIlluminationQuality=2`, `sg.ReflectionQuality=2`, `sg.ShadowQuality=2` (High: ~+20 fps vs Epic).
- With a physically bright sun (~100,000 lux) add `r.EyeAdaptation.CachedLightingPreExposure=8` under
  `[/Script/Engine.RendererSettings]`, or Lumen's cached lighting clips (black shadows, on-screen "clipped" warning).
- Cap traced reflections in the post-process volume (`LumenMaxRoughnessToTraceReflections` 0.25): ~1 ms saved on
  glossy scenes. Don't also set the cvar in an ini, or it silently overrides the level.

**Check (both):** package, then `node gen/perf/bench.ts --res native --variant "check:"`. Expect 120+ fps (avg) on a
light level with either path; the gap opens up with content.

## 8. Editor performance (re-check, 1 min)

Editor-only settings for the RTX 4060 on a 4K monitor. They don't change the packaged game.
Most are per-user and carry over between projects; confirm on jam day.

1. Edit → Editor Preferences → Performance → Viewport Resolution:
   - "Override project's default screen percentage mode for realtime editor viewports using desktop rendering" = **Manual**
   - Tick "Override project's manual screen percentage", set "Editor viewport screen percentage" = **60** (75 if too soft)
2. Same page: "Use Less CPU when in Background" on. Scripted PIE runs need it off (the editor drops to ~3 fps in the
   background): Claude turns `bThrottleCPUWhenNotForeground` off for the run (`docs/ue/editor-scripting.md`).
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
4. Copy the kit's `scripts\upload.ps1` into the project's `scripts\`. `.\scripts\upload.ps1 -Target user/game` is a dry
   run (checks the zip, build stamp, butler, login, no `Saved/` in the zip, and prints the commands);
   `-Push` uploads. It pushes the **zip**, never the build folder. A channel name containing `windows` tags the platform.
5. Game page text: the exe is unsigned. Add a line like *"Unsigned build: Windows SmartScreen may need More info > Run
   anyway. If Smart App Control is on, Windows blocks the game; it can only be turned off machine-wide (Windows Security >
   App & browser control)."* Code signing (Microsoft Artifact Signing, or an OV certificate) removes this but needs
   identity verification of 1-20 business days; see `docs/ue/production.md`.
6. Trailer: the jam wants a link (YouTube, unlisted is fine), not an upload. Recipes in `docs/ue/cinematics-video.md`.

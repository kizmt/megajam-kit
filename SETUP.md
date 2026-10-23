# New project setup — UE 5.8.4 + Claude Code

Verified on GIZMO (Windows 11, i5-14500, RTX 4060 8 GB, 32 GB) on 2026-10-24 with the SmokeTest project.
Target: ~10 minutes on jam day. Do the steps in order.

## Machine prerequisites (already done, re-check only)

- Unreal Engine 5.8.4 (Epic launcher install)
- Visual Studio 2026 (18.10.x) with the "Game development with C++" workload — verified compiling on 5.8.4
- Git + Git LFS (`git lfs version` → 3.7.1)
- Claude Code
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
4. Optional, only if the jam idea uses procedural levels: also enable **PCG Primitives** (Experimental;
   pulls in PCG Geometry Script Interop). See `docs/ue/pcg.md`. Restart again.
5. Renderer check (no clicks needed; the Blank C++ template already has these). Open
   `Config\DefaultEngine.ini` and confirm:
   `r.DynamicGlobalIlluminationMethod=1` (Lumen), `r.ReflectionMethod=1` (Lumen),
   `r.Shadow.Virtual.Enable=1` (Virtual Shadow Maps), `r.Substrate=True`.
   Verified on SmokeTest 2026-10-24. If one is missing, ask Claude to fix it rather than changing it by hand.

## 3. MCP server (1 min)

1. Edit → Editor Preferences → General → Model Context Protocol → tick **Auto Start Server** (port 8000, path `/mcp`). Do not use "Set as Default".
2. Console (backtick): `ModelContextProtocol.StartServer`
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
     "permissions": { "additionalDirectories": ["C:\\dev\\megajam-kit"] }
   }
   ```

   `additionalDirectories` gives the session the kit (scripts, `PIPELINE.md`, `docs/ue/`) without leaving the project.

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

Verified 2026-10-24 on SmokeTest: 17 files tracked (0.07 MB), `Main.umap` via LFS, clean status.

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

## 7b. Game display + render defaults (Claude applies, 1 min; editor closed)

Measured in `docs/ue/performance.md` (UE defaults 64 fps -> these 120 fps at 4K on the RTX 4060).

- `Config/DefaultEngine.ini`:
  - under the existing `[/Script/Engine.RendererSettings]`: `r.DefaultFeature.MotionBlur=False`
  - under the existing `[/Script/Engine.UserInterfaceSettings]`: `bAllowHighDPIInGameMode=True` (true 4K, not 2560x1440 stretched)
- `Config/DefaultScalability.ini`: `[AntiAliasingQuality@3]` and `[AntiAliasingQuality@Cine]` each `r.TSR.History.ScreenPercentage=100`
- `Config/DefaultGameUserSettings.ini`: `[ScalabilityGroups]` with `sg.GlobalIlluminationQuality=2`,
  `sg.ReflectionQuality=2`, `sg.ShadowQuality=2`
- `Config/DefaultInput.ini`: add `+ConsoleKeys=F10` after `+ConsoleKeys=Tilde` (backtick is a dead key on the NZ layout)
- Level: delete the template's **VolumetricCloud** actor (~2.5 ms at 4K).
- Check: package, then `node gen/perf/bench.ts --res native --variant "check:"` -> expect ~120 fps on the starting level.

## 8. Editor performance (re-check, 1 min)

Editor-only settings for the RTX 4060 on a 4K monitor. They don't change the packaged game.
Most are per-user and carry over between projects; confirm on jam day.

1. Edit → Editor Preferences → Performance → Viewport Resolution:
   - "Override project's default screen percentage mode for realtime editor viewports using desktop rendering" = **Manual**
   - Tick "Override project's manual screen percentage", set "Editor viewport screen percentage" = **60** (75 if too soft)
2. Same page: "Use Less CPU when in Background" on.
3. Viewport toolbar → speedometer icon (Performance & Scalability) → **Viewport Scalability → High**.
   Switch to Epic only when judging final visuals. Untick **Realtime Viewport** (Ctrl+R) when idle.
4. Edit → Editor Preferences → Loading & Saving → **Auto Save** on (10 min).

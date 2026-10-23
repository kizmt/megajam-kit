# New project setup — UE 5.8.4 + Claude Code

Verified on GIZMO (Windows 11, i5-14500, RTX 4060 8 GB, 32 GB) on 2026-10-24 with the SmokeTest project.
Target: ~10 minutes on jam day. Do the steps in order.

## Machine prerequisites (already done, re-check only)

- Unreal Engine 5.8.4 (Epic launcher install)
- Visual Studio 2026 (18.10.x) with the "Game development with C++" workload — verified compiling on 5.8.4
- Git + Git LFS (`git lfs version` → 3.7.1)
- Claude Code

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
     "disableClaudeAiConnectors": true
   }
   ```

   This limits the session to Unreal only. Remove `disableClaudeAiConnectors` / widen the allowlist if a jam idea needs another service (e.g. Vercel for a backend).
2. Set effort to **high** (`/effort high`, or have Claude set it as the project default).
3. Copy the kit's `CLAUDE.md` into the project root.
4. With the editor already open: `cd C:\dev\<ProjectName>` → `claude` → approve `unreal-mcp`.
5. `/mcp` should list only `unreal-mcp` (3 tools: tool search mode).
6. Test: "What actors are in the current level?" — should list the Basic level's actors.

## 6. Kit scripts + Git (1 min)

1. Copy the kit's `scripts\` folder into the project root (`C:\dev\<ProjectName>\scripts\`).
   The scripts find the project from their own location, so they must live inside the project.
2. `.\scripts\init-repo.ps1` → writes Unreal `.gitignore` + `.gitattributes`, runs `git init`, enables LFS,
   makes the first commit. Binaries/Intermediate/Saved/DerivedDataCache are ignored; `.uasset`/`.umap`,
   images, models and audio go through LFS.
3. Commit at the end of every round. On jam day the first commit must be after 2026-11-12 14:00 JST.

Verified 2026-10-24 on SmokeTest: 17 files tracked (0.07 MB), `Main.umap` via LFS, clean status.

## 7. Packaging

- `scripts\package.ps1` → Win64 Development build to `C:\dev\Builds\<ProjectName>\` + zip.
- **Close the editor first** (File → Save All, then exit). Live Coding locks the build tools while the editor is open.
- Verified 2026-10-24: empty project packaged in 4m47s, zip 500.2 MB. That 500 MB is engine baseline,
  so the game's own content has roughly 500 MB before hitting itch's 1 GB zip limit (butler can upload larger).

## Still to add

- Editor performance settings for the 8 GB card

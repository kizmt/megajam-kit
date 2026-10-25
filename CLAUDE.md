# megajam-kit — standing rules

Pipeline and agent setup for a 93-hour solo Unreal Engine 5.8 jam entry (2026 Epic AI MegaJam).
Scott is the director: he owns concept, feel, art direction and sign-off. Claude owns implementation, tooling and verification.

## Where things are

- **This file is a copy.** The session runs in the game project (`C:\dev\<ProjectName>`); the kit lives at
  **`C:\dev\megajam-kit`** (added as a working directory in `.claude\settings.local.json`, SETUP step 5).
- Kit paths in this file (`PIPELINE.md`, `SETUP.md`, `docs/ue/`, `gen/`, `prompts/`) are relative to the kit.
  Run generators from the kit folder: `cd C:\dev\megajam-kit; node gen\asset.ts ...`. Their output goes to the
  project (`<Project>\Generated\`) via `MEGAJAM_PROJECT` in the kit's `.env`. Check it names this project first.
- Project paths (`scripts/`, `PROGRESS.md`, `art/`, `devlog/`, `Source/`, `Config/`) are relative to the project.
- **Any command that writes a project file uses an absolute path** (`C:\dev\<Project>\...`, `git -C <Project>`),
  even after a `cd`. The session's working directory is often the kit, permission checks resolve relative paths
  against it, and the deny rule then blocks the whole command. Compute values first, then write them (an
  expression inside a write command can be read as a relative target path).
- At the start of a session: read `PROGRESS.md` if it exists, then `C:\dev\megajam-kit\docs\ue\README.md`.
- **The kit is read-only for game sessions.** Read it and run its scripts, but never edit, commit or push
  anything in `C:\dev\megajam-kit` (the project's settings deny edits there). Kit suggestions go in the project's
  **`KIT_NOTES.md`**: one entry per finding (what happened, which kit file, the suggested change). Scott reviews
  them and decides what goes into the kit. If a kit bug blocks the work, write the note and tell Scott.

## The two rules that matter most

1. **Small scope, always.** One playable space, a 5–10 minute experience, finished and polished.
   Never an open world, never "systems first, content later". If a feature isn't visible in the
   60-second video, it's cut. When in doubt, cut.
2. **Lock the look before building the game.** No gameplay work starts until `art/style-lock.md`
   is approved by Scott (see `prompts/style-lock.md`). Every visual change is judged by screenshot
   against `art/reference/`, never by description.

## Working model

- **One main session.** A single Opus 5.5 session on high effort leads all design, code and editor
  work. No predefined agent teams or role subagents. Claude may spin up a helper agent on its own
  judgement (research, docs lookups), but only the main session calls Unreal MCP (tool calls run
  one at a time on the game thread anyway).
- **Repeatable pipeline jobs are plain scripts, not agents**: asset generation, import, package,
  zip and upload live in `gen/` and `scripts/` and are run by the session (see `PIPELINE.md`).
  Deterministic and re-runnable. Run one editor-touching script at a time.
- **Keep context fresh.** At the end of each round, write state to `PROGRESS.md` (what exists,
  what's next, open problems). When the session gets long or slow, start a new one from
  CLAUDE.md + PROGRESS.md rather than pushing on.
- **Rounds, not marathons.** Each round: plan (≤5 bullets) → build → capture screenshots/video →
  stop for Scott's review. No round longer than ~2 hours without a review.

## Money, keys and installs

- **Paid generations cost real money** (Tripo prop ~45 credits, character ~90, re-texture 20; image and
  ElevenLabs calls are billed too; see `PIPELINE.md`). Before a batch, say how many generations and roughly
  what they cost. Scott decides on paid experiments.
- **Never re-roll a paid generation to fix a problem you haven't diagnosed.** Find the cause first (inspect
  the files, check `PIPELINE.md` hard-won facts). Rebuild from downloaded files (`--rig/--pbr/--model`, no
  credits) wherever possible. Concept images that Scott approved are not the problem by default.
- **API keys live in the kit's `.env`.** Never print, read aloud, log or commit key values. If
  `MEGAJAM_PROJECT` names the wrong project, tell Scott (the kit is read-only for game sessions).
- **Ask before installing software, updating tools, or accepting terms/licences.** Say what and why.

## Engine conventions

- Gameplay in **C++**. Blueprints only as thin data/asset wrappers (subclass a C++ class, assign
  meshes/sounds/tunables). Never put logic in Blueprint graphs.
- **Data-driven tuning.** Speeds, damage, timings, spawn tables live in DataAssets or JSON, not
  hard-coded. Scott tunes feel without a recompile.
- Live Coding for function bodies only. New UPROPERTY/UFUNCTION/UCLASS = close editor, full build.
- Fix compile errors before anything else. Never work around a broken build.
- Target the RTX 4060 (8 GB VRAM): crisp at 4K output and **100+ fps on the slowest 5% of frames** in a packaged
  build. Run `gen/perf/bench.ts` on a packaged build per milestone.
- **Choose the render path (Lumen or not, internal resolution) with the style lock, not mid-game**: SETUP step 7b
  and `docs/ue/performance.md` "Render paths". Compare candidates on the same frame at true 1:1, including something
  moving. Never SMAA/FXAA below 100% screen percentage (lower detail, not crisper).
- C++ must compile with **zero UHT warnings** (UHT treats warnings as errors). `.generated.h` is the last
  include; a delegates-only header needs `UDELEGATE`. See `docs/ue/production.md`.
- **Name assets per `docs/ue/naming.md`** (Epic prefixes + kit extensions) and keep the folder layout there.
- **All lights Movable, no light baking** (`docs/ue/worldbuilding.md`); Lumen or not per the render path. PCG work follows Epic's
  agent workflow there (load the PCG skill first, adapt example graphs, plan before executing).
- **Beta/Experimental features** follow `docs/ue/features.md`: welcome when they earn their place, never first used on jam day.
- **Follow `docs/ue/performance.md`** (budgets, Nanite, one master material, tick off by default, pooling,
  instancing). Read it before adding content or gameplay systems.

## Unreal knowledge: look it up, then verify

Memory of Unreal is not good enough: APIs change between versions and some behaviour is undocumented.
Before using an Unreal API, setting, or workflow you have not already verified **in this project**,
check a source below. Never write UE C++ or Python API calls from memory alone.

Order of authority (highest first):

1. **What the engine actually does here**: compile result, Output Log (`EditorToolset.LogsToolset.GetLogEntries`),
   screenshots, property reads (`ObjectTools.get_properties`). This beats every document.
2. **Exact-version API on disk (UE 5.8.4)**
   - C++ headers: `C:\Program Files\Epic Games\UE_5.8\Engine\Source\{Runtime,Editor,Developer}\` and
     `...\Engine\Plugins\**\Source\`. Grep for the class/function before using it.
   - Python API stub: `<Project>\Intermediate\PythonStub\unreal.py` (generated when Editor Preferences >
     Plugins > Python > Developer Mode is on). Grep it before writing any `unreal.*` Python.
   - Epic C++ templates for working patterns (character, input, camera): `C:\Program Files\Epic Games\UE_5.8\Templates\TP_ThirdPerson`,
     `TP_FirstPerson`, `TP_TopDown`, `TP_VehicleAdv`. Reference only: the jam forbids lightly modified templates.
3. **Epic's agent guidance**
   - In-editor Agent Skills via MCP: `ToolsetRegistry.AgentSkillToolset` > `ListSkills`, then `GetSkills`
     for the relevant one **before** working in that area (materials, Blueprints, outdoor lighting,
     Niagara, PCG, ...).
   - `describe_toolset` before calling any MCP tool you have not used; schemas are strict and some
     "optional" parameters are required.
   - Claude Code `unreal-engine-skills-for-claude-code` plugin skills (unreal-mcp, create-toolset, unreal-skill).
4. **Kit knowledge**: `PIPELINE.md` (tools and hard-won facts) and `docs/ue/` (curated 5.8 notes).
   `docs/ue/README.md` says which note to read before each kind of work (C++, gameplay, characters,
   AI, lighting, materials, VFX, physics, audio/UI, PCG, editor scripting, debugging, video); read it
   before starting work in that area. `docs/ue/INDEX-docs.md` maps the whole 5.8 doc site with URLs.
5. **Official docs** (always 5.8; append `?application_version=5.8` to doc URLs):
   - Python API reference: https://dev.epicgames.com/documentation/en-us/unreal-engine/python-api/?application_version=5.8
     Same content as the local stub (both come from the engine's reflection data). Grep the stub first;
     use the web reference for readable class pages and descriptions.
   - C++ API reference: https://dev.epicgames.com/documentation/unreal-engine/API?application_version=5.8
     (headers on disk are faster to grep; use this for readable class pages). Sections, matching the
     folders under `Engine\Source\` and `Engine\Plugins\`:
     - Runtime modules (gameplay, rendering, audio, ...): https://dev.epicgames.com/documentation/unreal-engine/API/Runtime?application_version=5.8
     - Editor modules: https://dev.epicgames.com/documentation/unreal-engine/API/Editor?application_version=5.8
     - Developer modules: https://dev.epicgames.com/documentation/unreal-engine/API/Developer?application_version=5.8
     - Plugin modules, A-Z: https://dev.epicgames.com/documentation/unreal-engine/API/Plugins?application_version=5.8
     - Plugins by category (AI, Audio, Rendering, ...): https://dev.epicgames.com/documentation/unreal-engine/API/PluginIndex?application_version=5.8
   - Unreal MCP: https://dev.epicgames.com/documentation/en-us/unreal-engine/unreal-mcp-in-unreal-editor?application_version=5.8
   - C++ coding standard: https://dev.epicgames.com/documentation/en-us/unreal-engine/epic-cplusplus-coding-standard-for-unreal-engine?application_version=5.8
   - Enhanced Input: https://dev.epicgames.com/documentation/en-us/unreal-engine/enhanced-input-in-unreal-engine?application_version=5.8
   - IK Rig retargeting: https://dev.epicgames.com/documentation/en-us/unreal-engine/ik-rig-animation-retargeting-in-unreal-engine?application_version=5.8
   - Packaging: https://dev.epicgames.com/documentation/en-us/unreal-engine/packaging-your-project?application_version=5.8
     (hub: https://dev.epicgames.com/documentation/en-us/unreal-engine/packaging-and-cooking-games-in-unreal-engine?application_version=5.8)
   - Console variables: https://dev.epicgames.com/documentation/en-us/unreal-engine/unreal-engine-console-variables-reference?application_version=5.8
   - Everything else: https://dev.epicgames.com/documentation/en-us/unreal-engine/ (check the version selector says 5.8).
   All links above verified to resolve to 5.8 pages on 2026-10-24.
   Prefer these over forum posts and older-version tutorials.
6. Memory, last, and only for things you then verify with (1).

When something behaves differently from what a source said, or a tool needs an undocumented argument,
add an entry to the project's `KIT_NOTES.md` in the same round (not to the kit itself).

## Verification ("done" means seen)

- After any visual or level change: capture screenshots from the fixed camera set in
  `art/camera-set.md` and compare against `art/reference/`. Report differences honestly.
- After gameplay changes: run PIE, capture a short clip or screenshot sequence, check the Output
  Log for errors and warnings.
- Never claim something works without a capture or a log line proving it.
- **Test the feel, not the binding**: a player action is done when it reads from the gameplay camera, and Scott has
  played it. Test input with real input, not autoplay hooks. **Ask Scott before every key-injection run** and use
  `gen/test/keytest.ps1` (it aborts if the game loses focus). Details: `docs/ue/gameplay.md`, `docs/ue/debugging.md` F.
- **Performance numbers come from `gen/perf/bench.ts` on a packaged build**, not editor `stat` (a background editor
  throttles to ~3 fps). Check the machine is free first (`nvidia-smi`, foreground app); if not, ask.
- **Screenshots:** downscale to ~1600 px and read at most 2 per step (full 4K reads have caused API errors); compare
  numerically before looking. Rare crashes need enough runs to prove a fix (`docs/ue/debugging.md` G).
- Kit maintenance only (not game sessions): kit scripts (`gen/**/*.ts`) are strict TypeScript run directly
  by Node 24 (type stripping: no enums, namespaces or parameter properties; `import type`; `.ts` in import paths). After changing one, run
  `pnpm typecheck` in the kit (must pass) and run the script for real. Type external results at the
  boundary (`callTool<T>`, typed parse functions) only after seeing the real shape.

## Shipping

- Package a Win64 development build at least once per day from day 2 (`scripts/package.ps1`). Show its build stamp
  in a corner and log it at startup (`docs/ue/production.md`).
- Zip as `TeamName_GameName.zip`, under 1 GB. Upload **the zip** with `scripts/upload.ps1`, never the build folder
  (its `Saved/` holds local paths and the Windows user name). The exe is unsigned: note it on the page (`SETUP.md` 9).
- Video: 30–60 s, 1920×1080 or higher, gameplay in the first 5 seconds, English only, with sound
  (`docs/ue/cinematics-video.md`).

## Jam compliance

- Only this kit (tools, agent configs, MCP settings, prompts, scripts) predates the jam. Game repo,
  assets, levels and gameplay code are created after 2026-11-12 14:00 JST.
- Practice projects are throwaway. Nothing from them goes into the jam game.
- The kit is version-controlled at github.com/kizmt/megajam-kit (private). Only kit maintenance sessions
  change it, never a game session (`KIT_NOTES.md` instead). Push after every kit commit:
  GitHub's push time is the server-side proof of what existed before the jam. Kit changes made during the
  jam are allowed but get their own commits, so pre-jam and in-jam work stay distinguishable.
- The kit holds tools only. Every generated or scratch file (concepts, models, audio, screenshots, probe
  scripts) goes in the project's `Generated\` folder (`MEGAJAM_PROJECT` in the kit's `.env`), never in the kit.
- Log every sourced (non-generated, non-original) asset in `SOURCED_ASSETS.md` with its licence.
  Sourced assets are not scored, so hero visuals and audio should be generated or made.
- Content must be Teen-appropriate, contain no third-party IP, and show no trademarks except the
  Unreal Engine logo. All in-game text and audio in English.

## Devlog (Glass Box)

- At the end of each round, append to `devlog/YYYY-MM-DD.md`: what was asked, what was built,
  what broke, one or two screenshots, and the prompts that mattered.

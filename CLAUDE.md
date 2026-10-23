# megajam-kit — standing rules

Pipeline and agent setup for a 93-hour solo Unreal Engine 5.8 jam entry (2026 Epic AI MegaJam).
Scott is the director: he owns concept, feel, art direction and sign-off. Claude owns implementation, tooling and verification.

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

## Engine conventions

- Gameplay in **C++**. Blueprints only as thin data/asset wrappers (subclass a C++ class, assign
  meshes/sounds/tunables). Never put logic in Blueprint graphs.
- **Data-driven tuning.** Speeds, damage, timings, spawn tables live in DataAssets or JSON, not
  hard-coded. Scott tunes feel without a recompile.
- Live Coding for function bodies only. New UPROPERTY/UFUNCTION/UCLASS = close editor, full build.
- Fix compile errors before anything else. Never work around a broken build.
- Target the RTX 4060 (8 GB VRAM): 1440p internal at 60 fps in a packaged build. Prefer a stylized
  look; check `stat unit` and `stat gpu` after big visual changes.
- C++ must compile with **zero UHT warnings** (UHT treats warnings as errors). `.generated.h` is the last
  include; a delegates-only header needs `UDELEGATE`. See `docs/ue/production.md`.
- **Name assets per `docs/ue/naming.md`** (Epic prefixes + kit extensions) and keep the folder layout there.
- **Lighting is Lumen-only, all lights Movable, no baking** (`docs/ue/worldbuilding.md`). PCG work follows Epic's
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
add a one-line entry to "Hard-won facts" in `PIPELINE.md` in the same round.

## Verification ("done" means seen)

- After any visual or level change: capture screenshots from the fixed camera set in
  `art/camera-set.md` and compare against `art/reference/`. Report differences honestly.
- After gameplay changes: run PIE, capture a short clip or screenshot sequence, check the Output
  Log for errors and warnings.
- Never claim something works without a capture or a log line proving it.

## Shipping

- Package a Win64 development build at least once per day from day 2 (`scripts/package.ps1`).
- Zip as `TeamName_GameName.zip`, under 1 GB, push with butler.
- Video: 30–60 s, 1920×1080 or higher, gameplay in the first 5 seconds, English only.

## Jam compliance

- Only this kit (tools, agent configs, MCP settings, prompts, scripts) predates the jam. Game repo,
  assets, levels and gameplay code are created after 2026-11-12 14:00 JST.
- Practice projects are throwaway. Nothing from them goes into the jam game.
- Log every sourced (non-generated, non-original) asset in `SOURCED_ASSETS.md` with its licence.
  Sourced assets are not scored, so hero visuals and audio should be generated or made.
- Content must be Teen-appropriate, contain no third-party IP, and show no trademarks except the
  Unreal Engine logo. All in-game text and audio in English.

## Devlog (Glass Box)

- At the end of each round, append to `devlog/YYYY-MM-DD.md`: what was asked, what was built,
  what broke, one or two screenshots, and the prompts that mattered.

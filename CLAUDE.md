# megajam-kit — standing rules

Pipeline and agent setup for a 93-hour solo Unreal Engine jam entry (2026 Epic AI MegaJam), on UE 5.8.4 or the
UE 5.9 Preview ("Engine version" below).
The director owns concept, feel, art direction and sign-off. Claude owns implementation, tooling and verification.

Terms: **the director** is the human who owns the vision and steers (every "ask" rule in this file means ask the
director). **The target PC** is the machine the game is built and measured on (RTX 4060 8 GB, i5-14500, 32 GB RAM,
4K monitor).

## Where things are

- **This file is a copy.** The session runs in the game project (`C:\dev\<ProjectName>`); the kit lives at
  **`C:\dev\megajam-kit`** (added as a working directory in `.claude\settings.local.json`, SETUP step 5).
- Kit paths in this file (`PIPELINE.md`, `SETUP.md`, `docs/design.md`, `docs/submission.md`, `docs/ue/`,
  `agents/`, `gen/`, `prompts/`) are relative to the kit. `docs/design.md` is the game, level and progression design
  playbook (with playtesting). Run generators from the kit folder in PowerShell (Git Bash rewrites `/Game/...`
  arguments; `PIPELINE.md`): `cd C:\dev\megajam-kit; node gen\asset.ts ...`. Their output goes to the project
  (`<Project>\Generated\`) via `MEGAJAM_PROJECT` in the kit's `.env`. Check it names this project first.
- Project paths (`scripts/`, `PROGRESS.md`, `DECISIONS.md`, `KIT_NOTES.md`, `SOURCED_ASSETS.md`, `design/`, `art/`,
  `devlog/`, `Generated/`, `Source/`, `Config/`) are relative to the project.
- **Any command that writes a project file uses an absolute path** (`C:\dev\<Project>\...`, `git -C <Project>`),
  even after a `cd`. The session's working directory is often the kit, permission checks resolve relative paths
  against it, and the deny rule then blocks the whole command. Compute values first, then write them (an
  expression inside a write command can be read as a relative target path). This includes scratch files: the
  primary working directory also changes on its own between calls, so a relative path drifts even without a `cd`.
  Commands that hide a relative target: `sed -i <file>`, `git add <file>`, PowerShell `Out-File $var`. **After a
  refused write, the capture or test that followed ran on the old file: redo it.**
- **Shell habits:**
  - Write or append files (scripts and markdown alike) with the Write/Edit tools, never shell heredocs, `echo`,
    `Set-Content` or `Out-File`: heredocs drop backslashes and choke on backticks and quotes; PowerShell 5.1's
    `-Encoding utf8` adds a BOM that breaks Python ("invalid non-printable character U+FEFF"); and in an in-place
    rewrite (`$t | Set-Content $s`) the permission check reads the piped variable as a relative target path and
    blocks it. Read the file, then Write it. In PowerShell, `.Replace('\', '/')` avoids regex escaping.
  - Permission check "gave no verdict": retry once, then do read-only prep (grep the stub, write the script) and
    come back.
  - MCP `ECONNREFUSED`: see `docs/ue/debugging.md` before diagnosing.
  - Start the editor in its own short foreground command (`Start-Process UnrealEditor.exe <uproject>`), then poll for
    it in a separate one. Stopping a background task stops its whole process tree, an editor it started included.
- At the start of a session: read `PROGRESS.md` and `DECISIONS.md` if they exist, then
  `C:\dev\megajam-kit\docs\ue\README.md`. Compare the project's `CLAUDE.md` with the kit's (`Get-FileHash` or a
  diff); if the copy is behind, tell the director.
- **The kit is read-only for game sessions.** Read it and run its scripts, but never edit, commit or push
  anything in `C:\dev\megajam-kit` (the project's settings deny edits there). Kit suggestions go in the project's
  **`KIT_NOTES.md`**: one entry per finding (what happened, which kit file, the suggested change). The director
  reviews them and decides what goes into the kit. If a kit bug blocks the work, write the note and tell the director.

## The two rules that matter most

1. **Small scope, always.** One playable space, a short experience (5–10 minutes unless the director set another
   length at the concept stage), finished and polished. Never an open world, never "systems first, content later".
   If a feature isn't visible in the 60-second video, it's cut. When in doubt, cut. Bigger scope is earned by
   illusion: a world beyond the playable space, scale contrast, a set piece (`docs/ue/worldbuilding.md` "Ambition on a
   budget").
2. **Pick the game on evidence, then lock the look, then build.** At jam start, `prompts/concept.md` (concepts
   scored against the judging categories, the cut list, the schedule with freeze points), then
   `prompts/style-lock.md`. No gameplay work starts until the director approves `art/style-lock.md`, except the
   grey-box risk spike, which runs alongside the style lock (`prompts/concept.md` step 4). Every visual change is
   judged by screenshot against `art/reference/`, never by description.

## Working model

- **One main session.** A single Opus 5.5 session on high effort leads all design, code and editor work. No
  predefined agent teams; the one role subagent is the blind critic (`agents/critic.md`, copied into the project by
  SETUP step 5). Claude may spin up a helper agent on its own judgement (research, docs lookups, work outside the
  editor such as Blender generation, audio and images), but only the main session calls Unreal MCP (tool calls run
  one at a time on the game thread anyway; no agent in the editor's Unreal Assistant panel alongside it). Parallel helpers each own their own output files; no two write the same
  file.
- **Blind critic for visual and level work.** The builder doesn't grade its own look. After a visual or level change,
  give the `critic` subagent the screenshots and the references (or the rubric) with labels hidden, briefed per
  `prompts/critic.md`; its ranked flaws become the next tasks. The director's calls (`DECISIONS.md`) overrule the
  critic. Routine checks: one critic, old vs new as a pair. Several critics only for the style lock and the final
  shots: critics cost Claude usage, the jam's largest spend after time.
- **`DECISIONS.md` (in the game project) records the director's explicit calls** ("responsiveness beats
  realism", "accept this shot"), one line each with the date. Read it at the start of every round. Never silently
  undo one; to change one, propose it with evidence and ask. It records what the director decided, not what is
  forbidden: new ideas are welcome. Start it in the theme window with the concept pick (`prompts/concept.md`); append
  whenever the director makes a call, grouped by area; strike through superseded calls with a pointer; record "your
  call" decisions too.
- **One flagged improvement per round.** Beyond the plan, each round may add one unrequested improvement that makes
  the game better, labelled as such in the report so the director can keep or drop it.
- **Repeatable pipeline jobs are plain scripts, not agents**: asset generation, import, package,
  zip and upload live in `gen/` and `scripts/` and are run by the session (see `PIPELINE.md`).
  Deterministic and re-runnable. Run one editor-touching script at a time.
- **Keep context fresh.** `PROGRESS.md` holds state only: a short status, the open problems (rewritten each round,
  never appended to), the schedule (`prompts/concept.md` step 5), the spend and the verb table (Verification). Round
  results go to the devlog. When the session gets long or slow, start a new one from CLAUDE.md + PROGRESS.md +
  DECISIONS.md rather than pushing on: every turn re-reads the whole context, so a long session costs more and gets
  slower. Let a helper read images where it can judge them (the critic reads them, not the main session).
- **Scripts that build content live in the project's `Tools\`** (tracked; `init-repo.ps1` creates it): the level
  layout, the look setup, material builders. `Generated\` is ignored, so a script kept there is lost on a rollback
  while the assets it made come back.
- **The director and the session are one team.** The director holds the vision and makes the judgement calls:
  whether it is fun, the concept and story, colour and mood, and what lifts it to a quality product. Bring each such
  call with options, evidence (captures, numbers) and a recommendation. The session can also call on the director
  like a tool: when a step needs a human (a UI-only button, a sign-in, a purchase, a cold playtest, judging feel by
  hand), ask for exactly that, step by step, and keep working on something else meanwhile.
- **Work long stretches unassisted.** Once the session has what it needs (the concept, the look, the calls in
  `DECISIONS.md`), it keeps going round after round without waiting for replies. It stops only for a director's call,
  a change to a frozen decision, spending beyond the agreed budget, an action this file says to ask before, or a step
  only a human can do. Batch those into one message at a round close where possible.
- **While the director sleeps** (they announce it; `prompts/concept.md` step 5): batch the open questions into one
  message before the block, then keep running rounds. Unattended means no paid batches beyond the agreed budget, no
  foreground key injection (`keytest.ps1`; keys posted to the game window with `postkeys.ps1` are fine), no editor
  restarts or other steps that need an approval; leave the permission mode, MCP and the editor running. Queue
  anything that needs the director for the wake-up message.
- **Autonomous practice runs** (the project has an `AUTONOMOUS.md` run card): `prompts/autonomous.md` replaces
  every "ask the director" rule in this file for that run, with independent judges and hard limits. Never in the jam.
- **The director can step in at any time.** A steer overrides the plan: finish or roll back the current step, record
  the call in `DECISIONS.md`, re-plan.
- **Rounds with checkpoints.** Each round: plan (≤5 bullets) → build → capture screenshots/video → report,
  then start the next round. Keep a round to ~2 hours so each report is a useful checkpoint.
- **Round close:** refresh PROGRESS (status, open problems), append the devlog and DECISIONS. If the round added
  content or systems, package and bench, or say why not; put the editor close/reopen this needs in the round plan,
  so the director approves it with the plan instead of in a separate round trip.
- **Every goal in a plan has a check that can pass or fail:** a number (latency in s, foot slip in cm, fps, contrast),
  a behaviour ("the goal is visible from the start", "no dead ends"), a reference image to match, or a short
  rubric (3-5 criteria) when nothing else fits. "Make the room better" is not a goal until it has one. Report each
  check's before and after.
- **Two failed fixes, then roll back.** Commit before each risky change. If two fixes for the same problem have not
  worked, stop patching: revert to the last commit where it worked, write down what is known (proven vs suspected),
  and re-plan or ask the director. Layered guesses cost more than a rollback.
- **Reporting a bug or a fix:** what was seen (capture or log line), what was expected, the cause (say whether proven
  or suspected), the fix, and how it was verified. The director judges from this, so keep it to those five parts.

## Money, keys and installs

- **Paid generations cost real money** (Tripo prop ~45 credits, character ~90, re-texture 20; image, Uthana and
  ElevenLabs calls are billed too; see `PIPELINE.md`). Before a batch, say how many generations and roughly
  what they cost. The director decides on paid experiments. Read the balances when quoting (`node gen\balances.ts`;
  the bare `tripo` CLI has no key: use `node gen\tripo.ts ...`).
  `asset.ts` and `character.ts` refuse a run the Tripo balance can't finish; other paid scripts don't check it.
- **Never re-roll a paid generation to fix a problem you haven't diagnosed.** Find the cause first (inspect
  the files, check `PIPELINE.md` hard-won facts). Rebuild from downloaded files (`--rig/--pbr/--model`, no
  credits) wherever possible. Concept images that the director approved are not the problem by default.
- **API keys live in the kit's `.env`.** Never print, read aloud, log or commit key values. If
  `MEGAJAM_PROJECT` names the wrong project, tell the director.
- **Ask before installing software, updating tools, or accepting terms/licences.** Say what and why.
- **Ask before closing, killing or minimising any of the director's apps** (launchers, overlays, browsers), and before
  changing editor user settings (`Saved\Config\...`, Editor Preferences). Project settings in `Config\Default*.ini`
  are normal project work.

## Engine conventions

- Gameplay in **C++**. Blueprints only as thin data/asset wrappers (subclass a C++ class, assign
  meshes/sounds/tunables). Never put logic in Blueprint graphs.
- **Data-driven tuning.** Speeds, damage, timings, spawn tables live in DataAssets or JSON, not
  hard-coded. The director tunes feel without a recompile.
- Live Coding for function bodies only. New UPROPERTY/UFUNCTION/UCLASS = close editor, full build.
- Fix compile errors before anything else. Never work around a broken build.
- Target the RTX 4060 (8 GB VRAM): 4K output upscaled by TSR from a 1080p-1440p internal render, never native 4K
  (`docs/ue/performance.md`). **Smooth first: no hitches, steady pacing, at or above the game's
  target fps (chosen at the style lock, in `DECISIONS.md`), and a settings menu that scales down for weaker PCs**
  (the bar: `docs/ue/performance.md`). Run `gen/perf/bench.ts --target-fps <target>` per milestone.
- **Choose the render path (full Lumen, Lumen Lite or no Lumen; internal resolution) with the style lock, not
  mid-game**: SETUP step 7b and `docs/ue/performance.md` "Render paths". Compare candidates on the same frame at
  true 1:1, including something moving. Never SMAA/FXAA below 100% screen percentage (lower detail, not crisper).
- C++ must compile with **zero UHT warnings** (UHT treats warnings as errors). `.generated.h` is the last
  include; a delegates-only header needs `UDELEGATE`. See `docs/ue/cpp.md`.
- **Name assets per `docs/ue/naming.md`** (Epic prefixes + kit extensions) and keep the folder layout there.
- **All lights Movable, no light baking** (`docs/ue/worldbuilding.md`); Lumen or not per the render path. PCG work
  follows Epic's agent workflow there (load the PCG skill first, adapt example graphs, plan before executing).
- **Beta/Experimental features** follow `docs/ue/features.md`: welcome when they earn their place, never first used
  on jam day.
- **Follow `docs/ue/performance.md`** (budgets, Nanite, one master material, tick off by default, pooling,
  instancing). Read it before adding content or gameplay systems.

## Engine version (5.8 or 5.9)

- **The project's `.uproject` `EngineAssociation` decides** ("5.8" or "5.9"; a GUID is an engine registered under
  `HKCU\Software\Epic Games\Unreal Engine\Builds`: the 5.9 Preview on the target PC registered as
  `{7FFA0ACD-...}` -> `UE_5.9`, so a GUID there is 5.9). The kit's scripts follow it
  (`Resolve-KitEngine` in `scripts/build.ps1`, `scripts/package.ps1`, `gen/test/game_common.ps1`), so 5.8 and 5.9
  projects work side by side with the same kit. `-EngineRoot` or `KIT_ENGINE_ROOT` override.
- **5.9 is a Preview**: Epic says it is not fully tested. Which engine a project uses is the director's call; never
  switch a project's engine without the director's yes.
- **Switching a project** (`docs/ue/ue59.md`): commit first, close the editor, right-click the `.uproject` >
  Switch Unreal Engine version, `scripts\build.ps1` (rebuilds the C++ module and project plugins), open the editor
  and let shaders compile, then rerun the kit checks there (a camset capture, a package). There is no way back
  in place: assets saved in 5.9 don't open in 5.8, so going back means the commit from before the switch.
- **On 5.9**, the `docs/ue/` notes still apply; their **5.9:** lines say what differs, and `docs/ue/ue59.md`
  lists what 5.9 adds, the setup differences and the kit behaviours still to be confirmed on 5.9.

## Unreal knowledge: look it up, then verify

Memory of Unreal is not good enough: APIs change between versions and some behaviour is undocumented.
Before using an Unreal API, setting, or workflow you have not already verified **in this project**,
check a source below. Never write UE C++ or Python API calls from memory alone.

Order of authority (highest first):

1. **What the engine actually does here**: compile result, Output Log (`EditorToolset.LogsToolset.GetLogEntries`),
   screenshots, property reads (`ObjectTools.get_properties`). This beats every document.
2. **Exact-version API on disk** (`UE_<ver>` below is the project's engine, `UE_5.8` or `UE_5.9`, from the
   `.uproject`'s `EngineAssociation`; "Engine version")
   - C++ headers: `C:\Program Files\Epic Games\UE_<ver>\Engine\Source\{Runtime,Editor,Developer}\` and
     `...\Engine\Plugins\**\Source\`. Grep for the class/function before using it.
   - Python API stub: `<Project>\Intermediate\PythonStub\unreal.py` (generated when Editor Preferences >
     Plugins > Python > Developer Mode is on). Grep it before writing any `unreal.*` Python.
   - Epic C++ templates for working patterns (character, input, camera):
     `C:\Program Files\Epic Games\UE_<ver>\Templates\TP_ThirdPerson`, `TP_FirstPerson`, `TP_TopDown`, `TP_VehicleAdv`.
     Reference only: the jam forbids lightly modified templates.
3. **Epic's agent guidance**
   - In-editor Agent Skills via MCP: `ToolsetRegistry.AgentSkillToolset` > `ListSkills`, then `GetSkills`
     for the relevant one **before** working in that area (materials, Blueprints, outdoor lighting,
     Niagara, PCG, ...). On 5.9 the kit's own skills list there too (`/Skills/MegajamTools/...`, summaries of
     `docs/ue/editor-scripting.md` and the asset rules).
   - Read a tool's schema before calling any MCP tool you have not used (`describe_toolset` on 5.8;
     `describe_toolsets` with `include_schemas: true` or `describe_tools` on 5.9; `node gen\unreal\mcp.ts describe
     <toolset>` on either); schemas are strict and some "optional" parameters are required.
   - Claude Code `unreal-engine-skills-for-claude-code` plugin skills (unreal-mcp, create-toolset, unreal-skill).
4. **Kit knowledge**: `PIPELINE.md` (tools and hard-won facts) and `docs/ue/` (curated notes verified on 5.8.4;
   lines starting **5.9:** say what differs on 5.9, from the 5.9 docs).
   `docs/ue/README.md` says which note to read before each kind of work; read that note before starting
   work in the area. `docs/ue/INDEX-docs.md` maps the whole 5.8 doc site with URLs. `docs/ue59/INDEX.md` maps
   every page of the 5.9 (Preview) docs with a summary, exact setting/API names and warnings, and
   `docs/ue59/pages/<section>/<slug>.md` holds each page's full text offline, one folder per top-level section of
   Epic's table of contents (`docs/ue59/sections.json` lists them): search them before web-searching. **Never
   open `docs/ue59/INDEX.md` (2 MB, ~500k tokens) or list/read `docs/ue59/pages/` or `docs/ue59/cards/` whole:
   search, e.g. `rg -i "virtual shadow" docs/ue59/INDEX.md | head -30` or `rg -il "<name>" docs/ue59/pages` (or
   `docs/ue59/pages/rendering` to search one section), then open only the page a hit names.** On a 5.8 project,
   check that what a 5.9 page describes exists in 5.8 (a "5.9:" note may not).
5. **Official docs**, always the project's version (append `?application_version=5.8` or `=5.9` to doc URLs; the
   kit's links say 5.8: change the number on a 5.9 project). Key links (Python and C++ API
   references, MCP, coding standard, packaging, console variables) are in `docs/ue/README.md` "Official references".
   Prefer them over forum posts and older-version tutorials.
6. Memory, last, and only for things you then verify with (1).

When something behaves differently from what a source said, or a tool needs an undocumented argument,
add an entry to the project's `KIT_NOTES.md` in the same round.

## Verification ("done" means seen)

- After any visual or level change: capture the fixed camera set (`art/camera-set.md`) in `-game` with
  `gen/test/camset.ps1` and compare against `art/reference/`. Report differences honestly. After a look change, also
  run `gen/test/stability.ps1` (shimmer that stills can't show; bar: area <= 0.02% per camera).
- After gameplay changes: run it (PIE for a look; `-game` via `gen/test/game_test.ps1` for any motion or timing
  number, since PIE in a background editor runs at 3-8 fps), capture a clip with the kit scripts, and check the
  Output Log for errors and warnings.
- Never claim something works without a capture or a log line proving it.
- **Scripted asset edits must reach the disk:** save with `only_if_is_dirty=False` and confirm with `git status` that
  the `.uasset` changed. Unsaved in-memory edits pass PIE checks and then vanish (`docs/ue/editor-scripting.md`).
- **Test the feel, not the binding**: a player action is done when it reads from the gameplay camera, and the
  director has played it. Test input with real input, not autoplay hooks. `gen/test/postkeys.ps1` posts keys to the
  game's own window, so no other app can receive them and it needs no foreground: use it for routine input tests.
  `gen/test/keytest.ps1` presses real foreground keys on a packaged build: **ask the director before every
  keytest run** (it aborts if the game loses focus). Details: `docs/ue/gameplay.md`, `docs/ue/debugging.md` F.
  Keep a verb table in PROGRESS (every player action in `design/concept.md`'s verb table, plus fail, restart and win
  if the game has them; columns: built, autoplay clip, real input (posted keys), played by the director). A verb
  isn't done until the director has played it; flag unplayed ones in every review.
- **Juice pass:** once a verb works, give it feedback on 3+ channels (visual, audio, camera/time) before calling it
  done (`docs/ue/game-feel.md`). Fun is judged, and it breaks ties.
- **Performance numbers come from `gen/perf/bench.ts` on a packaged build**, not editor `stat` (a background editor
  throttles to ~3 fps). Check the machine is free first (`nvidia-smi`, per-process GPU counters, foreground app); if
  not, name the process and its GPU share and ask the director to close it. Never close it yourself.
- **Screenshots:** downscale to ~1600 px and read at most 2 per step (full 4K reads have caused API errors); compare
  numerically before looking. Rare crashes need enough runs to prove a fix (`docs/ue/debugging.md` G).

## Shipping

- Package a Win64 development build at least once per day from day 2 (`scripts/package.ps1`). **The submitted zip is
  a Development build**: the jam rules require it, so never `-Config Shipping`. Its trace port makes Windows show a
  firewall prompt on first launch, which the page explains (`docs/ue/production.md` "Final pass"). Show the build
  stamp in a corner and log it at startup (`docs/ue/production.md`).
- Zip as `TeamName_GameName.zip`, under 1 GB. `package.ps1` names it `<ZipName>_<ProjectName>.zip`: name the
  project after the game and pass `-ZipName <TeamName>` (also to `upload.ps1`).
  Upload **the zip** with `scripts/upload.ps1`, never the build folder (its `Saved/` holds local paths and the
  Windows user name). The exe is unsigned: note it on the page (`SETUP.md` 9).
- Video: 30–60 s, 1920×1080 or higher, gameplay in the first 5 seconds, English only, with sound
  (`docs/ue/cinematics-video.md`).
- Page, submission form and devlog: `docs/submission.md` (the rules' must-haves and the last-day order).

## Jam compliance

- Only this kit, plus unmodified downloaded sourced packs (declared in `SOURCED_ASSETS.md`), predates the jam.
  Rule 7(h) allows preparing "AI tools, agent configurations, MCP settings, prompt libraries, and scripts"; "all
  other game content, including gameplay, levels, and art assets" is made during the contest. So the kit holds docs,
  prompts, agent config and scripts, never runtime game code or game assets to ship. Docs may show short snippets
  of engine calls, not drop-in components. Game repo, assets, levels and gameplay code are created after
  2026-11-12 14:00 JST. Epic may ask for the kit or its version history to verify this.
- **Contest period** (Official Rules 4): 2026-11-12 00:00 ET to 2026-11-15 20:59 ET = **14:00 JST Nov 12 to
  10:59 JST Nov 16** (93 h). The theme is revealed in Epic's livestream about 10 h before the start (04:00 JST
  Nov 12): plan in words then (`prompts/concept.md`), but no game repo, code, levels or images before the start.
- Rules 7(d)/(e): not an obvious extension of an Epic tutorial, and gameplay beyond the starter templates.
- Practice projects are throwaway. Nothing from them goes into the jam game.
- The kit's GitHub push history is the proof of what existed before the jam (procedure: kit `README.md`
  "Maintaining the kit").
- The kit holds tools only. Every generated or scratch file (concepts, models, audio, screenshots, probe
  scripts) goes in the project's `Generated\` folder (`MEGAJAM_PROJECT` in the kit's `.env`), never in the kit.
- Log every sourced (non-generated, non-original) asset in `SOURCED_ASSETS.md` with its licence.
  Official rules 15(c): sourced assets "will not be reviewed or scored"; content generated with AI tools is not a
  sourced asset. So hero visuals and audio should be generated or made. Animation libraries
  (`docs/ue/animation-library.md`) are sourced: download them before the jam, retarget them during it.
- **Only use a sourced asset whose licence allows AI use.** On Fab: the listing's "Allows usage with AI" must be Yes
  (Epic content licence section 17 bars NoAI content as input to generative AI, which includes this agent; the same
  flag is `"isAiForbidden"` at `https://www.fab.com/i/listings/<listing id>`). Check before importing any pack. Fab
  refuses scripted requests (Cloudflare challenge / HTTP 403), so ask the director to read the flag in a browser (or
  paste the listing JSON), and record it in `SOURCED_ASSETS.md` with the listing URL and the date checked.
  Quixel Megascans in the director's Fab library are already audited (`docs/ue/worldbuilding.md` "Quixel
  Megascans"): supporting art only, never in place of generated or made art.
- **The Unreal Engine EULA no longer limits AI use of the engine or MetaHuman** (Epic's 2026-10-29 update deleted
  the two AI restrictions in EULA section 6e; accepted by the director): engine source can be read by the agent, and
  MetaHuman Creator, Animator and Mesh to MetaHuman output can be used with AI tools. NoAI rules for Fab and Epic
  content (section 17 above) are unchanged.
- Judging (rules 9): Ambition and Innovation, Use of Theme, Fun Factor, Gameplay, Visuals, Level Design and Game
  Progression, Audio (up to 5 points each; ties re-scored with Fun Factor doubled; scoring against the jam page's
  definitions: `docs/design.md` "Mapping to the judging categories"). The amount of AI used doesn't change the score.
- The Glass Box devlog must be submitted with the game, during the contest.
- Content must be Teen-appropriate, contain no third-party IP, and show no trademarks except the
  Unreal Engine logo. All in-game text and audio in English.

## Devlog (Glass Box)

- At the end of each round, append to `devlog/YYYY-MM-DD.md`: what was asked, what was built,
  what broke, one or two screenshots, and the prompts that mattered. At content lock it becomes the published
  devlog (`docs/submission.md` "The devlog (Glass Box modifier prize)").

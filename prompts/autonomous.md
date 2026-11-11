# Autonomous run: the session is its own director

A test of the kit with **no director input at all**: from the start command to the final report, nobody answers
questions, approves plans, plays builds or picks options. The session makes every call itself, on evidence, and
writes down what it decided and what it would have asked. Use it for practice runs only; the jam itself keeps the
director (CLAUDE.md).

How it starts (`SETUP.md` "Autonomous runs" has the director's checklist): the director sets up the project, fills
in the run card below in the project's `AUTONOMOUS.md`, runs `scripts\preflight.ps1 -Autonomous` until it says
READY, starts Claude Code in auto mode in the project, and sends
one `/goal` (end of this file). After that the director doesn't type.

## The run card (the director fills this in before the start; the session never changes it)

Copied to `<Project>\AUTONOMOUS.md`. Defaults in brackets.

| Field | Value |
|---|---|
| Start S | [the time of the `/goal`, JST] |
| Length | [93 h, like the jam; a shorter test scales the schedule below] |
| Theme | [none: the session rolls one, step 1] |
| Team name (zip prefix) | [the director's itch.io name] |
| Tripo credits the run may spend | [150] |
| Image spend (Gemini / OpenAI) | [$6] |
| ElevenLabs credits the run may spend | [100,000] |
| Uthana / other paid services | [none] |
| Notes from the director | [none] |

## What changes from CLAUDE.md

CLAUDE.md still applies in full, except these rules, which this file replaces for the run.

**The session decides.** Every "ask the director", "the director picks", "the director approves" and "until the
director says" becomes a decision the session makes with the evidence that rule asks for, using an independent
judge where one is named below. Each decision goes in `DECISIONS.md` as usual, tagged `(auto)` with its evidence:
`2026-11-08 (auto) Style: direction B (critic 8/10 vs 6/10 and 5/10 against the mood words; art/keyart/B_1.jpg)`.
Never wait for a reply; never end a turn with a question.

**Judges instead of the director.** The builder doesn't grade its own work:
- **Look:** the blind `critic` subagent (`prompts/critic.md`) after every visual or level change, as usual, and for
  every choice between looks (style directions, key art, a lighting pass). It sees images and the rubric only.
- **Concept pick:** a fresh `general-purpose` subagent as the **panel**. It gets the five concepts from
  `design/concepts.md` with titles replaced by letters, the judges' category definitions and the jam's length, and
  nothing else. It scores each concept 1-5 per category and names its pick. Take the panel's pick unless its build
  risk is 1-2 with no fallback; then take its next pick and say why.
- **Fun and clarity:** the `prompts/playtest.md` reviewer on every recorded run (below), and the panel again at
  first playable, feature freeze and content lock: contact sheets and the 60-second cut, scored per judging
  category with the three changes that would most raise the total. Its top change becomes the next round's
  flagged improvement.
- The judges' answers are evidence, not orders: drop a finding the captures don't support, and say so.

**Things a human did, now done by the session:**
- **Playing the game.** Nobody plays. The verb table's "played by the director" column stays empty; the **"real
  input"** column carries the proof:
  the verb works through `gen/test/postkeys.ps1` (real keys posted to the game window, no foreground needed: a
  Windows prompt can hold the foreground on an unattended PC) with frames from the gameplay camera.
- **Cold playtest** (`docs/design.md` "Playtesting"): a scripted first-time run in `-game` with real input
  (`postkeys.ps1`, plus `route_walk.py` if the game has a walked route), recorded and reviewed by the playtest
  reviewer. Say in the devlog that no human played it.
- **Editor and game restarts:** allowed whenever a round needs them; no approval round-trip.
- **Feel calls** ("responsiveness beats accuracy"): decide from numbers (latency, plus the verb's own:
  frames to apex, foot slip, turn rate, snap distance...) and the references in `docs/ue/game-feel.md`, and record
  them.

**Hard limits that stay, because nobody is there to undo them:**
- **Spend:** only what the run card allows, per service, counted from the balances read at the start (write the
  starting balances in `PROGRESS.md`). Quote each batch's cost in the round plan as usual. At 80% of a cap, switch
  to free fallbacks (primitives, kit-built materials, template content, `gen/vfx`, re-use). Never exceed a cap.
- **No installs, updates, sign-ins, purchases, terms, uploads or posts.** No itch.io upload, no `butler`, no
  pushing anywhere: the game repo stays local. A step that needs any of these goes in `QUESTIONS.md` (below) with
  the workaround taken.
- **No new sourced assets.** Fab's "Allows usage with AI" flag needs a human to read it, so use only what the
  project already has (the Third Person template content and anything already recorded as allowed in
  `SOURCED_ASSETS.md`) plus what the kit generates. Never touch NoAI packs.
- **The director's apps and machine:** never close, kill or minimise an app the session didn't start, and don't
  change Windows or editor user settings. If something else is using the GPU at a bench, bench anyway, record the
  process and its share next to the numbers, and re-bench later.
- **The kit stays read-only;** keys stay unprinted; nothing outside the project folder is created or deleted
  (scratch goes in `Generated\`).
- **Two failed fixes, then roll back** (CLAUDE.md) matters more with nobody watching: no layered guesses.

## The files this run adds

- **`AUTONOMOUS.md`:** the run card (read-only for the session).
- **`QUESTIONS.md`:** everything the session would have asked the director, one line each, with the time, the
  default it took and why: `S+7h: target fps? Took 60 (bench: 71 fps at Medium in the hub).` The director reads it
  after the run.
- **`KIT_NOTES.md`** (as usual), plus one entry for every kit rule or step that assumed a director and how the
  session got around it. These are the main lesson of the run.

## Order of work

0. **Facts (5 min).** Read `AUTONOMOUS.md`, CLAUDE.md, `docs/ue/README.md`. Read the balances (`node
   gen\balances.ts`; image providers have no balance call: count spend from prices). Check SETUP step 6 is done
   (`scripts\package.ps1` and `Plugins\MegajamTools` in the project, `megajam_tools` in the MCP toolset list); if not,
   run its two robocopy lines and restart the editor. Run `scripts\preflight.ps1 -Autonomous` and act on every
   line: its 7b WARNs list the `SETUP.md` 7b settings still missing (the 2026-11-10 run never applied them and
   measured 1440p for 7 hours while reporting 4K). Write `PROGRESS.md` with the run card, the balances and S (the
   run card's S wins over the `/goal` time when they differ). If
   the editor or MCP isn't up, start it (CLAUDE.md "Shell habits"). Count spend from this run's own calls (the
   manifests and logs), not balance differences: other sessions may share the accounts.
1. **Theme.** If the run card gives none, roll one so the session doesn't pick its own comfort zone:
   `Get-Random -InputObject @(...)` over this list, and record the roll in `DECISIONS.md`:
   "Out of control", "Only one", "Built to scale", "Roles reversed", "It's spreading", "Echoes",
   "Light and shadow", "Running out", "Small world", "Change of perspective", "Connections", "Unstable".
2. **Concept** (`prompts/concept.md`, all steps; the theme window doesn't apply, so planning files go straight in
   the project). Step 1's direction comes from the run card: target length 5-10 min, budget as the card says, no
   taste given. Step 3's pick comes from the panel. Then `init-repo.ps1` (it commits locally; nothing is pushed).
3. **Style lock** (`prompts/style-lock.md`). The session writes the mood words and references itself (step 1),
   makes 2-3 key-art directions, and the critic picks against the mood words and the concept's set-piece shot.
   One revision round at most, then lock.
4. **Build** in rounds, as CLAUDE.md says, against the schedule below. Every round closes as usual (PROGRESS,
   devlog, DECISIONS, package and bench when content was added). No round waits for anything.
5. **Ship** as `docs/submission.md` says up to the upload: the zip (`package.ps1 -ZipName <team name> -BuildRoot
   <Project>\Builds`: nothing is created outside the project; `Builds/` is gitignored; Development, as the rules require), the
   30-60 s video (`docs/ue/cinematics-video.md`, D3b first), the page text, screenshots and the devlog, all in the
   project. Then the final report.

## Schedule (fractions of the run length L; for L = 93 h these are the jam's times)

| When | Milestone (pass/fail) |
|---|---|
| S + 3%, and never before S + 45 min | Concept picked (the ten theme readings first), cut list and schedule written |
| S + 6%, and never before S + 1.5 h | Style lock done with the hero sheet; the hero is generating; SETUP 7b applied (`scripts\preflight.ps1` shows no 7b WARN) |
| S + 6% | Risk spike answered: the core verb works and is fun in grey boxes (the panel judges a posted-key clip), or the fallback is chosen |
| S + 19% | First playable start to end in grey boxes; packaged and benched; panel review 1 |
| S + 46% | All beats playable in rough form |
| S + 66% | **Feature freeze**; panel review 2 |
| S + 78% | **Content lock**; cold playtest reviewed; panel review 3 |
| S + 85% | Video cut; page text and screenshots drafted |
| S + 87% | Final pass on the packaged zip (`docs/ue/production.md` "Final pass") |
| S + 97% | **Done:** the final report. The rest is buffer |

The two floors exist because a short run scaled the creative steps to 14 minutes in the 2026-11-10 test, and the
game was forgettable; the build milestones after them move later by the same amount. A slip of more than one round
cuts from the lowest tier first, as usual. There is no sleep block: rounds run
back to back. Keep each round to ~2 h so the devlog shows the path.

## Every turn

- **Start each turn with a clock line:** `[clock 2026-11-08 03:10 JST | S+3.2h of 93h | round 4 | Tripo 120/150
  left]`. The `/goal` evaluator only sees the conversation, so the time and progress must be in it.
- Don't leave long background jobs to wait on: an idle background task delays the next turn (the goal checks in
  only every 30 min and pauses after three idle check-ins). Prefer foreground polling with a timeout.
- Long sessions compact: keep `PROGRESS.md` current every round so nothing lives only in the conversation. After a
  compaction, re-read `AUTONOMOUS.md`, `PROGRESS.md` and `DECISIONS.md` before the next step.

## The final report

Print it in the conversation, headed `AUTONOMOUS RUN COMPLETE`, and save it as `devlog/FINAL_REPORT.md`:
- The zip's path and size (under 1 GB), its build stamp, and the bench line for that build.
- The video's path and length; the page text and devlog paths.
- The concept, the theme, and the panel's last scores per judging category.
- Spend per service against the run card.
- The verb table, with each verb's real-input evidence.
- The open problems, the cuts made, `QUESTIONS.md` and the `KIT_NOTES.md` entries, each summarised in a line.

## The start command (the director pastes this once, in auto mode)

```
/goal Autonomous MegaJam practice run: follow C:\dev\megajam-kit\prompts\autonomous.md and the run card in AUTONOMOUS.md, with CLAUDE.md for everything that file doesn't replace. Never ask questions or wait for replies: decide on evidence and log what you would have asked in QUESTIONS.md. Start every turn with the clock line. The goal is met only when the clock line shows S + 97% of the run length or later AND the session has printed the AUTONOMOUS RUN COMPLETE report with: the packaged zip path and size under 1 GB, a bench result line for that build, the video file path and length, the devlog and page text paths, and spend per service within the run card's caps. Finishing early is not completion: until the time is reached, keep polishing from the cut list and the panel's top changes.
```

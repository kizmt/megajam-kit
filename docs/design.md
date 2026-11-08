# Game design, level design and progression playbook

Engine-neutral craft for a short jam game. "Level Design and Game Progression", "Fun Factor" and "Gameplay" are
three of the seven judging categories, and Fun Factor counts double in a tie: this is where most points are.
The concept and the beats come from `prompts/concept.md`; this note is how to turn them into a game that teaches
itself, escalates and ends well. Engine how-tos live in `docs/ue/` (`gameplay.md`, `worldbuilding.md`,
`game-feel.md`).

## Principles

- **One core verb, done well, then varied.** Depth comes from new situations for the same verb, not from more verbs.
  A second verb earns its place only if it combines with the first.
- **Teach by doing, not by reading.** The level is the tutorial. Text is a last resort, short and in context.
- **One new idea at a time.** Introduce it safely, test it, then combine it with what came before.
- **Escalate, then end on a high.** The last beat uses everything the player has learned, in the best-looking space.
- **Respect the player's time.** A death or a mistake costs seconds, not minutes. Judges play many games: confusion
  in the first minute loses them.

## Shape of a short game (default 5-10 min for a first-time player; the director sets it at the concept stage)

| Part | Time | Job | Checks |
|---|---|---|---|
| Hook | 0:00-0:30 | The player acts within seconds and something good happens | First input possible ≤ 5 s after the title; core verb used ≤ 10 s |
| Onboarding | to ~2:00 | Teach the core verb and the goal, safely | A first-time player reaches the first goal unaided |
| Development | 2-3 beats | Each beat adds one twist: a new obstacle, a combination, tighter timing, a new space | Each beat introduces exactly one new idea; name it |
| Climax | ~1-2 min | Everything learned, combined, in the set piece (`docs/ue/worldbuilding.md` "Ambition on a budget") | The best shot in the video comes from here |
| Resolution | ~0:30 | An explicit end: result, time or score, credits, restart | Reaching the end screen is possible in every run |

Pacing alternates **tension and release**: after each hard section, a short calm one (a reward, a view, a new
space) before the next idea. Uninterrupted difficulty reads as a grind; uninterrupted calm reads as empty.

## Onboarding

- Open in a **safe space** where the core verb can't fail badly, with the first goal visible.
- **Signpost with the look, not with UI:** the style lock's accent colour marks interactive things and the path;
  light pulls the eye (bright exit, dark dead end); in a space the player moves through, a landmark visible from the
  start gives direction.
- Prompts: in world or on HUD, ≤ 5 words, shown when needed, gone once used ("Space: jump" by the first gap,
  "Click: place" by the first empty slot).
  Show the real key or button. No text walls, no pause-to-read tutorials.
- **Gate by ability:** the first obstacle can only be passed with the verb just taught, so learning is proven.
- Controls on the pause screen too, for players who skipped a prompt.
- **Accessibility and gamepad basics read as polish** for about 3 h: full gamepad play including menus, prompts
  that follow the last device, subtitles on by default, text size, a colour-blind mode, shake and flash scales,
  hold or toggle. Checklist with the engine calls: `docs/ue/audio-ui.md` "Accessibility and gamepad checklist".

## Level design craft

These fit a game with a space the player moves through. A game without one (single screen, board, menu-driven,
abstract) takes the ideas that apply (readability, introduce-test-twist-combine, space or layout telling difficulty)
and skips the rest; none of this says what kind of game to make.

- **Readable critical path.** At any moment the player can tell where to go next. Test: from each spawn point and
  checkpoint, is the next goal or a lead toward it visible on screen?
- **Landmarks and sightlines.** Something distinct the player orients by, seen from most of the space (the goal, or
  the set piece); preview the next area before the player gets there.
- **Gates and loops.** Gate new areas behind the newly taught idea. Prefer a loop or a shortcut back over
  backtracking through a cleared area.
- **No dead ends without a reward.** A side path ends in a pickup, a view or a secret; otherwise cut it.
- **Introduce, test, twist, combine.** For each idea: meet it safely, use it under mild pressure, see it changed,
  then use it together with an earlier idea.
- **Space tells difficulty before numbers do.** Narrow, dark, cluttered = tense; wide, lit, open = safe. Change
  the space first, the tuning numbers second.
- **Grey-box first.** Lay out every beat in grey boxes (`docs/ue/worldbuilding.md` "Blockout and level
  organisation"; optionally by the director: "Director blockout" below) and play it before any art goes in. Art
  follows the layout, never the other way round.
- **Scale and metrics:** measure the player's movement and reach numbers early (whatever the game has: speed,
  jump, reach, turn rate, a cell size), write them in the verb table, and build the space from those numbers.
- **Boundaries are proven, not assumed.** Every edge the player must not cross gets a pawn-sized walk test
  (`docs/ue/gameplay.md` "Verification lessons"); a gentle steady slope leaks as surely as a cliff edge.
- **Check where the route meets water or a drop** (games with a walked route). When a script lays the route and
  the water (or cliffs) separately, nothing checks where they meet: in the rehearsal the director found the route
  crossing two streams with no way over. After laying a route, list every point where it crosses water or a drop
  deeper than a step (the route's line against the water outlines, then a trace down at each crossing for what
  carries the player), and give each one a crossing (bridge, stepping stones, ford) before playtesting.

## Director blockout (optional): when the director wants to shape a space by hand

The session builds grey boxes itself, by script, and that is the default: in the 2026-11-08 practice run a scripted
grey box of five beats took part of one round and its test route passed first time. A director blockout saves no
time; use it only when the director wants to shape a beat's space themselves (flow, sightlines, pacing). Otherwise
the director's layout input is playing the grey box and saying what to change. When they do want it, the steps:

**1. The session prepares (≤ 15 min), in `design/blockout.md`:**
- **The brief per beat:** its one new idea, what the player does there, what the space must hold, a rough size and a
  sketch (ASCII or a quick image). Written from the game's own design, not from a template.
- **The metrics table**, measured in this project, not guessed: the movement and reach numbers this game has, and the
  safe limits that follow from them (e.g. for a jumping character: the longest gap a jump clears and 80% of it).
- **The level to block in:** a level or folder named for the beat, the player able to play it in PIE, and three
  flat colours (e.g. usable, blocked, hazard or goal) as materials the director can drop on blocks.

**2. The director blocks it out (20-45 min a beat).** Nothing needs to look good or be exact.
- **Blocks:** drag meshes from `/Game/LevelPrototyping/Meshes` in the Content Browser (`SM_Cube`, `SM_ChamferCube`,
  `SM_Ramp`, `SM_Cylinder`, `SM_QuarterCylinder`), or Quick Add (the **+** button on the toolbar) > Shapes.
- **Keys:** W move, E rotate, R scale; hold Alt while dragging to duplicate; End drops the selection to the floor;
  F focuses on it; G hides the editor icons; Ctrl+S saves. Turn grid snapping on in the viewport toolbar (50 cm for
  moving, 15° for rotating) so pieces meet cleanly.
- **Order:** what the beat is built around first, then how the player moves through or uses it, then the rest.
- **Play it:** Alt+P plays in the viewport. Is it clear what to do? Does it feel fair? Adjust, play again.
- **Then tell the session, in a few lines per beat:** what the space is for, the moment that matters, and anything
  you're unsure about. Save first.

**3. The session takes over (≤ 1 round):**
- **Record it:** read every block's mesh and transform and write them to `design/blockout_<beat>.json` (tracked), so
  the layout survives any rebuild; commit.
- **Check it against the metrics and the craft rules that apply:** for a walked space, `traverse_survey.py` and
  `route_walk.py` (`docs/ue/debugging.md` F "Traversal checks"); a capture of the whole space for the critic with the
  rules above as the rubric. Report what fails.
- **Fix without changing intent:** what breaks the metrics or a rule (too tight, unreachable, unreadable). A change
  to the layout's idea is the director's call: propose it.
- **Build on it:** art replaces blocks keeping their footprint (art follows the layout).

## Difficulty and fairness

- **Telegraph before it hurts:** every threat the game has shows a readable wind-up (sound, light, animation) before it can
  damage (`docs/ue/game-feel.md`). An unreadable hit feels unfair, even when it isn't.
- **A loss must be possible, and cheap.** "Respect the player's time" means a cheap loss, not no loss: lose the
  attempt, never the run. A core resource with no failure state is decoration. A concept with no fail state at all
  (a toy, a story, a puzzle with free undo) names what the player risks instead (time, score, a choice that
  sticks). Each concept names its stakes (`prompts/concept.md` step 2).
- **Checkpoints at the start of each beat**; respawn and retry in ≤ 5 s, without replaying solved parts.
- **The critical path is moderate; the challenge is optional.** Extra difficulty goes in side goals, faster times,
  higher scores or collectibles, so a first-time judge still reaches the end.
- **Tune one variable at a time** and log what changed in the round's devlog entry; difficulty problems are usually
  one number (a timing window, an enemy count, a gap width).

## Progression that fits a jam

Pick one; keep it visible on screen and in the video:
- **Spatial:** the player moves through distinct areas, each with its new idea; very readable in a short game.
- **Ability:** the player gains one ability mid-game that recontextualises earlier spaces (a short loop back pays off).
- **Score or time:** a run judged by a number, with a reason to replay (best time, rank, collectibles).
Avoid inventories, skill trees, crafting, levelling and dialogue trees: they cost days and show badly in 60 s.

## Audio and pacing

Audio is a full judging category; plan it with the beats, not at the end (the audio direction in
`design/audio.md`: `prompts/style-lock.md` "Audio direction"; generation and import: `gen/audio.ts`, engine side:
`docs/ue/audio-ui.md`):
- **Music follows tension and release:** one cue for exploration or calm, one for pressure; the climax gets its own
  cue or a clear lift. Change cues at beat boundaries, never mid-action.
- **Every telegraph has a sound** before the hit lands; every player action has a sound (the verb table).
- **Silence is a tool:** a short quiet moment before the climax makes it land.
- **Mix check** in the packaged build: music under effects, nothing clips, the important cues (danger, success)
  are heard over everything else. **Whole-game target: -24 LUFS integrated (+/-2 LU), true peak at most -1 dBTP**
  over one full run (IESD's console/PC reference level), measured on the final mix in Audio Insights
  (`docs/ue/audio-ui.md` "Reverb, voices, memory"). This is the game's output, not a per-file level: the trailer's
  -14 LUFS (web) and the bed-under-music balance are separate numbers (`docs/elevenlabs.md` "Checking and matching
  levels").

## Ending

- A clear final moment (the climax's payoff), then an end screen: the result, the time or score, a thank-you,
  short credits (the director, the AI tools used, sourced assets per `SOURCED_ASSETS.md`), and Restart / Quit.
- Every run must be able to reach it: test the end from a fresh start at least once per day from day 2.

## Instrument the game

Log a line, with the time since the run started, for: run start (log it when recording starts too), title
dismissed, first input, first use of the core verb, each beat start, each goal reached, each checkpoint, each fail
(a death or failed attempt: cause and position), respawn complete, and the end (one log category, `docs/ue/debugging.md` "A. Logs"). The
playtest and tuning numbers below come from these lines, not from memory.

## Playtesting

The builder can't play the game for the first time again, so test with fresh eyes on a schedule:
1. **A cold run, once per day from first playable on.** Someone who has never seen the game (a friend or family
   member) is best; the director is next best, though they know it better each day. They play the packaged build
   from the start with no help. Whoever watches (usually the director) writes short notes with the clock time of
   anything confusing; clips have no microphone. Claude records with `gen/test/record_window.ps1` (never
   `autoclip.ps1`: that one lets the game play itself) and reads the event log afterwards.
2. **Fresh-agent review of the run.** A new helper agent gets only the clip's contact sheets, the event log, the
   pitch, goal, controls and beat list, and the watcher's notes (no code, no history) and reports where a first-time
   player would be confused, stuck or bored: brief in `prompts/playtest.md`. Like the visual critic, the director's
   calls overrule it.
3. **Numbers per run** (from the log): time to first input, time to first goal, fails and time per beat,
   longest time without progress, total length, whether the end was reached.

Pass/fail checks for each playtest round (report before and after):
- First input ≤ 5 s after the title; core verb used ≤ 10 s; first goal reached unaided.
- No stretch over 60 s without progress or a new thing; no more than 3 fails in any beat.
- Retry ≤ 5 s after a fail; total length within the target; end screen reached.
- Each beat names its one new idea, and the log shows the player passed that idea's gate in 3 attempts or fewer.
- The set-piece shot named in `design/concept.md` exists in the game and in the video.

## Mapping to the judging categories

The jam page defines each category in one line; copy all seven into `design/concept.md` at kickoff
(`prompts/concept.md` step 0). Ambition and Innovation reads: "Something you couldn't usually pull off in a four-day
jam: a new mechanic, a bold art style, or a bigger scope." Placement, and the grants that follow it, come from the
total across all seven (`docs/submission.md`).

Write one line per category in `design/concept.md` and check it at feature freeze:
- **Fun Factor / Gameplay:** the core verb feels good in a grey room; the juice pass is done; playtest checks pass.
- **Level Design and Game Progression:** readable path, one new idea per beat, escalation to a climax, a real end.
- **Use of Theme:** the theme changes the rules, and the video shows it in the first 15 s.
- **Ambition and Innovation:** one twist nobody else will have, made solid. The judges name three routes: a new
  mechanic, a bold art style, a bigger scope. Bigger scope is earned by illusion (a world beyond the playable space,
  scale contrast, one set piece: `docs/ue/worldbuilding.md` "Ambition on a budget"), not by a bigger map.
- **Visuals:** the style lock holds everywhere (checked by the blind critic, `prompts/critic.md`).
- **Audio:** see "Audio and pacing" above.

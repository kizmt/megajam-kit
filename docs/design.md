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

## Shape of a short game (5-10 min for a first-time player)

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
  light pulls the eye (bright exit, dark dead end); a landmark visible from the start gives direction.
- Prompts: in world or on HUD, ≤ 5 words, shown when needed, gone once used ("Space: jump" by the first gap).
  Show the real key or button. No text walls, no pause-to-read tutorials.
- **Gate by ability:** the first obstacle can only be passed with the verb just taught, so learning is proven.
- Controls on the pause screen too, for players who skipped a prompt.

## Level design craft

- **Readable critical path.** At any moment the player can tell where to go next. Test: from each spawn point and
  checkpoint, is the next goal or a lead toward it visible on screen?
- **Landmarks and sightlines.** One tall, distinct landmark seen from most of the level (the goal, or the set
  piece); preview the next area before the player gets there (a window, a drop, a gap).
- **Gates and loops.** Gate new areas behind the newly taught idea. Prefer a loop or a shortcut back over
  backtracking through a cleared area.
- **No dead ends without a reward.** A side path ends in a pickup, a view or a secret; otherwise cut it.
- **Introduce, test, twist, combine.** For each idea: meet it safely, use it under mild pressure, see it changed,
  then use it together with an earlier idea.
- **Space tells difficulty before numbers do.** Narrow, dark, cluttered = tense; wide, lit, open = safe. Change
  the space first, the tuning numbers second.
- **Grey-box first.** Lay out every beat in grey boxes (`docs/ue/worldbuilding.md` "Blockout and level
  organisation") and play it before any art goes in. Art follows the layout, never the other way round.
- **Scale and metrics:** decide the player's jump height, run speed and reach early, write them in the verb table,
  and build every gap, ledge and corridor from those numbers.

## Difficulty and fairness

- **Telegraph before it hurts:** every threat shows a readable wind-up (sound, light, animation) before it can
  damage (`docs/ue/game-feel.md`). An unreadable hit feels unfair, even when it isn't.
- **Checkpoints at the start of each beat**; respawn and retry in ≤ 5 s, without replaying solved parts.
- **The critical path is moderate; the challenge is optional.** Extra difficulty goes in side goals, faster times,
  higher scores or collectibles, so a first-time judge still reaches the end.
- **Tune one variable at a time** and log what changed in `PROGRESS.md`; difficulty problems are usually one
  number (a timing window, an enemy count, a gap width).

## Progression that fits a jam

Pick one; keep it visible on screen and in the video:
- **Spatial (the default):** the player moves through distinct areas, each with its new idea; the most readable
  in a short game.
- **Ability:** the player gains one ability mid-game that recontextualises earlier spaces (a short loop back pays off).
- **Score or time:** a run judged by a number, with a reason to replay (best time, rank, collectibles).
Avoid inventories, skill trees, crafting, levelling and dialogue trees: they cost days and show badly in 60 s.

## Audio and pacing

Audio is a full judging category; plan it with the beats, not at the end (generation and import: `gen/audio.ts`,
engine side: `docs/ue/audio-ui.md`):
- **Music follows tension and release:** one cue for exploration or calm, one for pressure; the climax gets its own
  cue or a clear lift. Change cues at beat boundaries, never mid-action.
- **Every telegraph has a sound** before the hit lands; every player action has a sound (the verb table).
- **Silence is a tool:** a short quiet moment before the climax makes it land.
- **Mix check** in the packaged build: music under effects, nothing clips, the important cues (danger, success)
  are heard over everything else.

## Ending

- A clear final moment (the climax's payoff), then an end screen: the result, the time or score, a thank-you,
  short credits (the director, the AI tools used, sourced assets per `SOURCED_ASSETS.md`), and Restart / Quit.
- Every run must be able to reach it: test the end from a fresh start at least once per day from day 2.

## Instrument the game

Log a line, with the time since the run started, for: run start (log it when recording starts too), title
dismissed, first input, first use of the core verb, each beat start, each goal reached, each checkpoint, each death
(cause and position), respawn complete, and the end (one log category, `docs/ue/debugging.md` "A. Logs"). The playtest and tuning numbers below come from
these lines, not from memory.

## Playtesting

The builder can't play the game for the first time again, so test with fresh eyes on a schedule:
1. **A cold run, once per day from first playable on.** Someone who has never seen the game (a friend or family
   member) is best; the director is next best, though they know it better each day. They play the packaged build
   from the start with no help. Whoever watches (usually the director) writes short notes with the clock time of
   anything confusing; clips have no microphone. Claude records with `gen/test/record_window.ps1` (never
   `autoclip.ps1`: that one lets the game play itself) and reads the event log afterwards.
2. **Fresh-agent review of the run.** A new helper agent gets only the clip's contact sheet, the event log, the
   pitch and the beat list (no code, no history) and reports where a first-time player would be confused, stuck or
   bored: brief in `prompts/playtest.md`. Like the visual critic, the director's calls overrule it.
3. **Numbers per run** (from the log): time to first input, time to first goal, deaths and time per beat,
   longest time without progress, total length, whether the end was reached.

Pass/fail checks for each playtest round (report before and after):
- First input ≤ 5 s after the title; core verb used ≤ 10 s; first goal reached unaided.
- No stretch over 60 s without progress or a new thing; no more than 3 deaths in any beat.
- Retry ≤ 5 s after a death; total length within the target; end screen reached.
- Each beat names its one new idea, and the log shows the player passed that idea's gate in 3 attempts or fewer.
- The set-piece shot named in `design/concept.md` exists in the game and in the video.

## Mapping to the judging categories

Write one line per category in `design/concept.md` and check it at feature freeze:
- **Fun Factor / Gameplay:** the core verb feels good in a grey room; the juice pass is done; playtest checks pass.
- **Level Design and Game Progression:** readable path, one new idea per beat, escalation to a climax, a real end.
- **Use of Theme:** the theme changes the rules, and the video shows it in the first 15 s.
- **Ambition and Innovation:** one twist nobody else will have, made solid; ambition through the mechanic and the
  set piece, not through scope (`docs/ue/worldbuilding.md` "Ambition on a budget").
- **Visuals:** the style lock holds everywhere (checked by the blind critic, `prompts/critic.md`).
- **Audio:** see "Audio and pacing" above.

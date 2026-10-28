# Concept, scope and schedule: run at the theme reveal, before the contest starts

Goal: one game concept the director picks on evidence, a scope that fits the jam, and a schedule with fixed freeze
points. Everything here is words and tables (no images, no credits). Budget: ~1.5 hours, ~45 min in practice runs.
Order: **theme reveal → this prompt (in words) → contest start → `prompts/style-lock.md` → build** (CLAUDE.md
"The two rules that matter most", "Jam compliance").

**The theme window.** The theme is revealed in Epic's livestream about 10 hours before the contest starts (S).
Rule 7(h): gameplay, levels and art assets are made during the contest. So in the window: words, tables and
decisions only. No game repo, no code, no level, no images (key art included).
**Where the session runs before S:** a planning folder, e.g. `C:\dev\_plan\` with a copy of the kit's `CLAUDE.md`
and `design\concept.md`; start Claude Code there. At S, create the project (`SETUP.md`), move `design\` into it, and
commit it as the repo's first file. From then on the session runs in the project as usual.
The reveal is at 04:00 JST: decide the night before whether the director watches live or sleeps and starts planning
in the morning; the window fits either.

## 0. Facts first (5 min)
- Read the jam page at kickoff: the exact submission deadline (with time zone), the theme wording, any new rules.
  Write them at the top of `design/concept.md`. Schedule from the real times, not from memory (CLAUDE.md "Jam
  compliance": S = 14:00 JST Nov 12, D = 10:59 JST Nov 16, 93 h).
- The judging categories (CLAUDE.md "Jam compliance"): Ambition and Innovation, Use of Theme, Fun Factor,
  Gameplay, Visuals, Level Design, Audio. Ties are re-scored with Fun Factor doubled.

## 1. Direction (the director, 10 min)
The director gives: first reactions to the theme, any genre or feel they want or want to avoid, and how many hours
they can review each day. Ask once if anything is missing, then go.

## 2. Five concepts in words (Claude, 20 min)
Five different takes, not five variants of one. At least one literal reading of the theme, at least one twist
(the theme as a mechanic, not a backdrop), at least one that is cheap to build. Each, in this format:

- **Pitch:** one sentence a judge would repeat.
- **Core verb:** the one thing the player does most (jump, push, aim, time, steer...). One verb, done well.
- **Theme link:** how the theme changes the *rules*, not only the setting.
- **The 60-second moment:** the shot that sells it in the video's first 5 seconds.
- **Beats:** onboarding, 2-3 twists (each adds one new idea to the core verb), climax
  (`docs/design.md` "Shape of a short game").
- **Look and sound:** what makes it beautiful and what makes it sound good, in one line each.
- **Build list:** what the kit makes it from (props `gen/asset.ts`, characters `gen/character.ts`, effects
  `gen/vfx/vfx.ts`, animation sources, audio) and the hardest engine feature it needs.
- **Biggest risk:** the one thing most likely to fail, and the fallback if it does.

## 3. Score them (Claude, 10 min)
One table, 1-5 per column, with a one-line reason per score. No averaging away a red flag:

| Concept | Theme | Fun + gameplay in 30 s | Ambition / novelty | Level + progression room | Look + sound potential | Video moment | Build risk (5 = safe) |
|---|---|---|---|---|---|---|---|

- **Fun + gameplay in 30 s:** would a stranger enjoy the core verb in an empty grey room? If not, no amount of
  content fixes it.
- **Build risk:** anything needing a system the kit hasn't proven (networking, physics-driven gameplay at scale,
  large open spaces, many unique characters, dialogue trees) scores 1-2. Any 1 here needs a named fallback.
- Recommend one (or a merge) in two sentences. The director picks. Record the pick and the reason in `DECISIONS.md`.

## 4. Scope: the cut list (Claude, 15 min)
Write `design/concept.md` in the game project:
- Pitch, core verb, theme link, target length (5-10 min for a first-time player), win and lose conditions.
- **Verb table:** each player action, its input, and its feedback on 3+ channels (visual, audio, camera/time):
  CLAUDE.md "Juice pass" and `docs/ue/game-feel.md` work from this table.
- **Beats:** onboarding, each twist with the one new idea it adds, the climax, the end.
- **The set-piece shot:** the one image the climax is built around; the video must contain it.
- **Cut list in three tiers.**
  - *Must* (not a game without it): the core verb with 3-channel feedback; onboarding, 2-3 twists and an end,
    playable start to finish; one music track and a sound on every action; start and end screens.
  - *Should* (makes it good): the set piece, a second music cue for the climax, the full juice pass, extra props.
  - *Could* (only when ahead): side goals, a secret, extra polish.
  - **No *Should* work before every *Must* is playable; no *Could* before every *Should*.** Everything starts in
    the lowest tier it can live in.
- **Risk spike:** the riskiest *Must* item, built first in grey boxes right after the style lock (≤ 2 hours). If it
  fails, switch to its fallback then, not later.

## 5. Schedule with freeze points (Claude, 10 min)
S = contest start, D = submission deadline (S + 93 h). Sleep is part of the plan: put the sleep blocks in the
table first, then fit the milestones between them. Keep the order and the gaps:

| When | Milestone (pass/fail) |
|---|---|
| Before S | Concept picked; cut list, schedule and style directions (in words) written |
| S + 3 h | Style lock approved (`prompts/style-lock.md`: key art images start at S) |
| S + 6 h | Risk spike answered: core verb works in grey boxes, or the fallback is chosen |
| S + 18 h | **First playable:** start → core verb → an end, in grey boxes; game repo committed; **packaged and benched** |
| D − 50 h | All beats playable in rough form, start to end |
| **D − 32 h** | **Feature freeze:** no new systems or verbs after this. Only content, tuning, polish and fixes |
| D − 20 h | **Content lock:** levels, assets and audio in. Cold playtest done (`docs/design.md` "Playtesting") |
| D − 14 h | Video captured and cut (`docs/ue/cinematics-video.md`); page text and screenshots drafted |
| D − 12 h | Final pass on the packaged zip (`docs/ue/production.md` "Final pass": the last half-day) |
| **D − 3 h** | **Submitted.** The remaining hours are the buffer for upload or page problems, not for features |

Package and bench from first playable onward, at every round close that added content (CLAUDE.md "Working model").
Put the table in `PROGRESS.md`. At every round close, compare against it; if a milestone slips by more than one
round (~3 h), cut from the lowest tier first and say what was cut.

## Why this order
A concept judged in words costs nothing to throw away; the same concept judged after a day of building costs the
jam. Freeze points turn "one more feature" into a decision the director makes on purpose.

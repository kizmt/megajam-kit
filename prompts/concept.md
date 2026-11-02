# Concept, scope and schedule: run at the theme reveal, before the contest starts

Goal: one game concept the director picks on evidence, a scope that fits the jam, and a schedule with fixed freeze
points. Everything here is words and tables (no images, no credits). Budget: ~1.5 hours, ~45 min in practice runs.
Order: **theme reveal → this prompt (in words) → contest start → `prompts/style-lock.md` → build** (CLAUDE.md
"The two rules that matter most", "Jam compliance").

**The theme window.** The theme is revealed in Epic's livestream about 10 hours before the contest starts (S).
Rule 7(h): gameplay, levels and art assets are made during the contest. So in the window: words, tables and
decisions only. No game repo, no code, no level, no images (key art included).
**Where the session runs before S:** a planning folder, e.g. `C:\dev\_plan\` (set up the night before: `SETUP.md`
"0. Planning folder"); start Claude Code there. There is no game project yet, so every file this prompt names goes
in the planning folder: `design\concept.md`, `design\concepts.md`, `design\schedule.md` (the step 5 table) and
`DECISIONS.md` at the planning folder root.
**At S:** create the project (`SETUP.md`), then give the planning session access to it before moving anything:
`/add-dir C:\dev\<Project>` (or restart Claude Code in the project with `C:\dev\_plan` in `additionalDirectories`).
Without it, shell copies into the project are refused. Move `design\` and `DECISIONS.md` into the project, copy the
schedule table into `PROGRESS.md`, and commit them as the repo's first files. From then on the session runs in the
project as usual.
The reveal is at 04:00 JST: decide the night before whether the director watches live or sleeps and starts planning
in the morning; the window fits either.

## 0. Facts first (5 min)
- Read the jam page at kickoff: the exact submission deadline (with time zone), the theme wording, any new rules.
  Write them at the top of `design/concept.md`. Schedule from the real times, not from memory (CLAUDE.md "Jam
  compliance": S = 14:00 JST Nov 12, D = 10:59 JST Nov 16, 93 h).
- **The itch overview's start and end times are UTC** but show no time zone ("Submissions open from 2026-11-12
  05:00:00 to 2026-11-16 01:59:00"). Convert them, and check they match the EST times in the page text.
- **AI tool credits:** the jam page has an "AI tool credits" section (details were "coming soon" in late October).
  If credits are offered, tell the director: they claim them before S (a sign-up may accept terms). Note which
  services they cover and the balance; they change the paid-generation budget (CLAUDE.md "Money, keys and installs").
- The judging categories (CLAUDE.md "Jam compliance"): Ambition and Innovation, Use of Theme, Fun Factor, Gameplay,
  Visuals, Level Design and Game Progression, Audio. Ties are re-scored with Fun Factor doubled. Copy the jam page's
  one-line definition of each into `design/concept.md`; score against the judges' words (`docs/design.md` "Mapping
  to the judging categories").

## 1. Direction (the director, 10 min)
The director gives: first reactions to the theme, any genre or feel they want or want to avoid, and how many hours
they can review each day. Also ask, so the concepts don't have to be redone:
- **Target length** for a first-time player (the kit's default is 5-10 min; the director's answer sets it, CLAUDE.md
  rule 1).
- **Paid-generation budget and appetite:** should credit cost or the number of characters to generate and rig count
  as build risk in step 3, or not?
- **Naming taste:** what kind of working titles they like.

Ask once if anything is missing, then go.

## 2. Five concepts in words (Claude, 20 min)
Five different takes, not five variants of one. At least one literal reading of the theme, at least one twist
(the theme as a mechanic, not a backdrop), at least one that is cheap to build. Write all five and the step 3 table
to `design/concepts.md` and keep it: the devlog tells "the concept and why it won" (`docs/submission.md`). Each, in
this format:

- **Working title:** distinctive, not a single common word.
- **Pitch:** one sentence a judge would repeat.
- **Core verb:** the one thing the player does most (jump, push, aim, time, steer...). One verb, done well.
- **Theme link:** how the theme changes the *rules*, not only the setting.
- **Stakes:** how the player can lose an attempt, and what it costs (`docs/design.md` "Difficulty and fairness").
- **The 60-second moment:** the shot that sells it in the video's first 5 seconds.
- **Beats:** onboarding, 2-3 twists (each adds one new idea to the core verb), climax
  (`docs/design.md` "Shape of a short game").
- **Look and sound:** what makes it beautiful and what makes it sound good, in one line each.
- **Build list:** what the kit makes it from (props `gen/asset.ts`, characters `gen/character.ts`, effects
  `gen/vfx/vfx.ts`, animation sources, audio) and the hardest engine feature it needs.
- **Biggest risk:** the one thing most likely to fail, and the fallback if it does.

## 3. Score them (Claude, 10 min)
One table, 1-5 per column, with a one-line reason per score. One column per judged category, so a strong look
can't hide weak audio. No averaging away a red flag:

| Concept | Theme | Fun in 30 s | Gameplay | Ambition / novelty | Level + progression room | Visuals | Audio | Video moment | Build risk (5 = safe) |
|---|---|---|---|---|---|---|---|---|---|

- **Fun in 30 s:** would a stranger enjoy the core verb in an empty grey room? If not, no amount of content fixes it.
- **Ambition:** the judges' wording includes "a bigger scope"; in this kit bigger scope is earned by illusion (a
  world beyond the playable space, scale contrast, one set piece: `docs/ue/worldbuilding.md` "Ambition on a budget").
- **Build risk:** anything needing a system the kit hasn't proven (networking, physics-driven gameplay at scale,
  large open spaces, many unique characters, dialogue trees) scores 1-2, unless the director said in step 1 that
  credit cost or character count isn't a risk. Any 1 here needs a named fallback.
- **Placement, and the Development Continuation Grants that follow it, come from the total across all seven
  categories** (`docs/submission.md`). A concept that wins one column and fails two loses.
- Recommend one (or a merge) in two sentences. The director picks. Record the pick and the reason in `DECISIONS.md`.

## 4. Scope: the cut list (Claude, 15 min)
Write `design/concept.md` (in the planning folder until S):
- Pitch, core verb, theme link, target length (from step 1; default 5-10 min for a first-time player), win and lose
  conditions.
- **Verb table:** each player action, its input, and its feedback on 3+ channels (visual, audio, camera/time):
  CLAUDE.md "Juice pass" and `docs/ue/game-feel.md` work from this table.
- **Beats:** onboarding, each twist with the one new idea it adds, the climax, the end.
- **The set-piece shot:** the one image the climax is built around; the video must contain it.
- **Cut list in three tiers.**
  - *Must* (not a game without it): the core verb with 3-channel feedback; onboarding, 2-3 twists and an end,
    playable start to finish; one music track and a sound on every action; start and end screens; **by S + 48 h**, a
    reset hook and the test hooks the trailer needs (stage a shot, log events), so the video can be filmed offline
    (`docs/ue/cinematics-video.md` D3b).
  - *Should* (makes it good): the set piece, a second music cue for the climax, the full juice pass, extra props.
  - *Could* (only when ahead): side goals, a secret, extra polish.
  - **No *Should* work before every *Must* is playable; no *Could* before every *Should*.** Everything starts in
    the lowest tier it can live in.
- **Risk spike:** the riskiest *Must* item, built first in grey boxes right after the style lock (≤ 2 hours). If it
  fails, switch to its fallback then, not later.

## 5. Schedule with freeze points (Claude, 10 min)
S = contest start, D = submission deadline (S + 93 h). Sleep is announced, not planned: the director says when
a block starts. Before it, batch the questions into one message, and move any milestone that falls inside the block
earlier, never later; then run unattended rounds until the wake-up (CLAUDE.md "While the director sleeps").
Keep the order and the gaps:

| When | Milestone (pass/fail) |
|---|---|
| Before S | Concept picked; cut list, schedule, style and audio directions (in words) written (steps 2-6) |
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
Write the table to `design/schedule.md`; at S it is copied into `PROGRESS.md`. At every round close, compare against
it; if a milestone slips by more than one round (~2 h), cut from the lowest tier first and say what was cut.

## 6. Style and audio directions in words (director + Claude, 20 min)
The "Before S" row needs them, and they are free. Run `prompts/style-lock.md` steps 1 and 2.1 now (the director's
mood words, references and first-10-seconds feeling; 2-3 directions as paragraphs), and its "Audio direction"
section in words. Images and generated audio wait for S.

## Why this order
A concept judged in words costs nothing to throw away; the same concept judged after a day of building costs the
jam. Freeze points turn "one more feature" into a decision the director makes on purpose.

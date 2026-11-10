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
schedule table into `PROGRESS.md`, and commit them right after `init-repo.ps1`'s first commit. From then on the
session runs in the project as usual.
The reveal is at 04:00 JST: decide the night before whether the director watches live or sleeps and starts planning
in the morning; the window fits either.

## 0. Facts first (5 min)
- Read the jam page at kickoff: the exact submission deadline (with time zone), the theme wording, any new rules.
  Write them at the top of `design/concept.md`. Schedule from the real times, not from memory (CLAUDE.md "Jam
  compliance": S = 14:00 JST Nov 12, D = 10:59 JST Nov 16, 93 h).
- **The itch overview's times carry no time zone**, and which zone it uses has varied: in late October it showed UTC
  ("2026-11-12 05:00:00 to 2026-11-16 01:59:00"); on 2026-11-11 it showed the viewer's local time ("November 12th
  2026 at 2:00 PM to November 16th 2026 at 10:59 AM", JST). Check them against the ET times in the page text and
  the rules (00:00 EST Nov 12 to 20:59 EST Nov 15).
- **Prizes this entry can win** (`docs/submission.md` "What a solo Unreal Engine entry can win"): Best Overall,
  Solo Driver, Render Royalty, Glass Box, and the NVIDIA RTX Award if its conditions fit. Read the submission form's
  questions now (the NVIDIA ones included) and note anything a prize needs from the game or the dev log.
- **Partner credits** (emailed on Nov 10; the list and claim deadlines are in `docs/submission.md` "Partner credits").
  Ask the director which are claimed and their balances: they change the paid-generation budget (CLAUDE.md "Money,
  keys and installs"). Claiming is the director's (sign-ups accept terms; Meshy asks for a card).
- The judging categories (CLAUDE.md "Jam compliance"): Ambition and Innovation, Use of Theme, Fun Factor, Gameplay,
  Visuals, Level Design and Game Progression, Audio. Ties are re-scored with Fun Factor doubled. Copy the jam page's
  one-line definition of each into `design/concept.md`; score against the judges' words (`docs/design.md` "Mapping
  to the judging categories").

## 1. Direction (the director, 10 min)
The director gives: first reactions to the theme, any genre or feel they want or want to avoid, and how many hours
they can review each day. Also ask, so the concepts don't have to be redone:
- **Target length** for a first-time player (the kit's default is 5-10 min; the director's answer sets it, CLAUDE.md
  rule 1).
- **Story and character, or spectacle and feel?** Which should weigh more when the concepts are scored: a
  protagonist with a reason to be there and a theme that means something, or a striking world and a great core verb.
  Step 3 doubles the columns the answer names. Both still count.
- **Paid-generation budget:** how much the game may spend. The default is to use it: every concept plans a
  generated hero and signature assets (CLAUDE.md "The hero and the budget"); a smaller budget changes how many, not
  whether.
- **Naming taste:** what kind of working titles they like.

Ask once if anything is missing, then go.

## 2. Five concepts in words (Claude, 20 min)
**First, read the theme ten ways** (in `design/concepts.md`, one line each): three literal readings (the words as a
rule or a mechanic) and at least seven lateral ones: what the theme means to a person (a feeling, a fear, a wish),
a story it could be the moral or the twist of, a place or a culture it suggests, an image it evokes, its opposite.
The concepts come from the strongest of these, not from the first.

Five different takes, not five variants of one: different protagonists, different places, different core verbs.
At least two come from lateral readings (the theme carries the story or the feeling, and also changes the rules),
at least one is a literal reading, at least one is cheap to build. Every concept has a **protagonist** (someone or
something the player is, with a want) and a **world** a judge hasn't seen in every other jam entry.

**Ruled out unless the director asks for them** (the 2026-11-10 practice run made all five of its concepts this way
and was forgettable): the template mannequin as the player; an abstract test chamber, grid void or "facility" as
the setting; the HUD or the rules themselves as the main way the theme shows; a theme link that is only a
mechanic with no person or place behind it.

Write the ten readings, all five concepts and the step 3 table to `design/concepts.md` and keep it: the devlog
tells "the concept and why it won" (`docs/submission.md`). Each, in this format:

- **Working title:** distinctive, not a single common word.
- **Pitch:** one sentence a judge would repeat.
- **Protagonist and world:** who the player is, what they want and why it is hard; where it happens and the one
  thing that makes the place unlike a stock setting. One line each.
- **Story in three lines:** the start, the turn, the end. A short game still has a shape a player can retell.
- **Theme meaning:** what the theme says through this game (the feeling or idea a player leaves with), in one line,
  next to the theme link below.
- **Core verb:** the one thing the player does most (jump, aim, steer, time, place, connect, sort, hide, choose...).
  One verb, done well.
- **Theme link:** how the theme changes the *rules*, not only the setting.
- **Stakes:** how the player can lose an attempt and what it costs, or, with no fail state, what the player risks
  instead (`docs/design.md` "Difficulty and fairness").
- **The 60-second moment:** the shot that sells it in the video's first 5 seconds.
- **Beats:** onboarding, 2-3 twists (each adds one new idea to the core verb), climax
  (`docs/design.md` "Shape of a short game").
- **Look and sound:** what makes it beautiful and what makes it sound good, in one line each.
- **Signature assets:** the hero (the protagonist, generated: `gen/character.ts`, or a generated hero object
  for a game without a body) and 3 assets the game is remembered by (a creature, a landmark, a set-piece prop).
  Say which of them moves when the player uses it (a lid, a lever, a gate, a wheel) and what the player sees it do:
  a part that answers the core verb is feedback the player reads at once, and a generated prop only moves if it is
  planned as parts (`gen/parts.ts`, `PIPELINE.md` "Moving parts"). One is enough; a concept with none says why.
- **Build list:** what the kit makes it from (props `gen/asset.ts`, characters `gen/character.ts`, effects
  `gen/vfx/vfx.ts`, animation: Kimodo on 5.9, libraries, Uthana; audio) and the hardest engine feature it needs.
- **Biggest risk:** the one thing most likely to fail, and the fallback if it does.

## 3. Score them (Claude, 10 min)
One table, 1-5 per column, with a one-line reason per score. One column per judged category, so a strong look
can't hide weak audio. No averaging away a red flag:

| Concept | Theme | Theme meaning | Protagonist + world | Memorability | Fun in 30 s | Gameplay | Ambition / novelty | Level + progression room | Visuals | Audio | Video moment | Build risk (5 = safe) |
|---|---|---|---|---|---|---|---|---|---|---|---|---|

- **Weighting (step 1):** "story and character" doubles Theme meaning and Protagonist + world; "spectacle and
  feel" doubles Visuals, Video moment and Fun in 30 s. Show both the plain and the weighted total.
- **Theme meaning:** 5 when the theme is felt (in the story, the place or the player's choices) as well as used as
  a rule; 2 when it is only a rule or a label.
- **Protagonist + world:** 5 when a judge could describe who they played and where after one minute, and neither
  is a stock default; 1 for the template mannequin in a grey or abstract space.
- **Memorability:** write the sentence a judge says about it the next day. 5 if it names someone, somewhere or a
  moment ("the lighthouse keeper who..."); 2 if it only names a mechanic ("the one where you remove limits").
- **Fun in 30 s:** would a stranger enjoy the core verb in grey boxes, with no content? If not, no amount of
  content fixes it.
- **Ambition:** the judges' wording includes "a bigger scope"; in this kit bigger scope is earned by illusion (a
  world beyond the playable space, scale contrast, one set piece: `docs/ue/worldbuilding.md` "Ambition on a budget").
- **Build risk:** anything needing a system the kit hasn't proven (networking, physics-driven gameplay at scale,
  large open spaces, dialogue trees) scores 1-2. A generated hero and up to three generated characters are **not**
  a risk: the kit has the pipeline (`gen/character.ts`, retargeting, Kimodo on 5.9) and the budget is there to be
  used. Only more than three, or one that needs a custom rig (quadruped, many limbs), counts. Any 1 here needs a
  named fallback. Build risk never outweighs Theme meaning or Memorability on its own: a safe forgettable game
  loses the jam as surely as a broken one.
- **Placement, and the Development Continuation Grants that follow it, come from the total across all seven
  categories** (`docs/submission.md`). A concept that wins one column and fails two loses.
- Recommend one (or a merge) in two sentences. The director picks. Record the pick and the reason in `DECISIONS.md`.

## 4. Scope: the cut list (Claude, 15 min)
Write `design/concept.md` (in the planning folder until S):
- Pitch, core verb, theme link, target length (from step 1; default 5-10 min for a first-time player), win and lose
  conditions (or what the stakes put at risk instead).
- **Verb table:** each player action, its input, and its feedback on 3+ channels (visual, audio, camera/time):
  CLAUDE.md "Juice pass" and `docs/ue/game-feel.md` work from this table.
- **Beats:** onboarding, each twist with the one new idea it adds, the climax, the end.
- **The set-piece shot:** the one image the climax is built around; the video must contain it.
- **Cut list in three tiers.**
  - *Must* (not a game without it): **the hero** (generated, rigged and animated, CLAUDE.md "The hero and the
    budget") and the signature assets from step 2; the core verb with 3-channel feedback; onboarding, 2-3 twists and an end,
    playable start to finish; one music track and a sound on every action; start and end screens; **by S + 48 h**, a
    reset hook and the test hooks the trailer needs (stage a shot, log events), so the video can be filmed offline
    (`docs/ue/cinematics-video.md` D3b). **The shot list now** (`design/shots.json`, rendered later by
    `gen/test/shots.ps1`): the 60-second moment, the set piece and the ending, so those places get built on purpose.
  - *Should* (makes it good): the set piece, a second music cue for the climax, the full juice pass, extra props.
  - *Could* (only when ahead): side goals, a secret, extra polish.
  - **No *Should* work before every *Must* is playable; no *Could* before every *Should*.** Everything starts in
    the lowest tier it can live in.
- **Hero first:** the hero's concept sheet comes with the style lock and its model starts generating at S + 3 h,
  so it is in the game, animated, by first playable: the grey-box rooms are the only thing that stays grey.
- **Risk spike:** the riskiest *Must* item, built first in grey boxes (≤ 2 hours), in parallel with the style lock
  (the director reviews key art while the session builds). **It passes when the director has played the core verb
  in grey boxes and calls it fun**, not when it merely works: fun is weighted most (ties re-score Fun Factor
  doubled), and grey boxes are the cheapest moment to find out. If it isn't fun, change the verb, switch to the
  fallback, or take the next concept, then, not later.

## 5. Schedule with freeze points (Claude, 10 min)
S = contest start, D = submission deadline (S + 93 h). Sleep is announced, not planned: the director says when
a block starts. Before it, batch the questions into one message, and move any milestone that falls inside the block
earlier, never later; then run unattended rounds until the wake-up (CLAUDE.md "While the director sleeps").
Keep the order and the gaps:

| When | Milestone (pass/fail) |
|---|---|
| Before S | Concept picked; cut list, schedule, style and audio directions (in words) written (steps 2-6) |
| S + 3 h | Style lock approved (`prompts/style-lock.md`: key art images start at S) |
| S + 6 h | Risk spike answered: the director played the core verb in grey boxes and calls it fun, or the fallback (or the next concept) is chosen |
| S + 18 h | **First playable:** start → core verb → an end, in grey boxes; game repo committed; **packaged and benched** |
| S + 30 h | **Vertical slice:** one beat at final quality (look, audio, juice): it sets the bar for the rest and gives the first trailer shot |
| D − 50 h | All beats playable in rough form, start to end; **playtest 1** (the director plays the packaged build cold) |
| **D − 32 h** | **Feature freeze**, after **playtest 2**, so its findings can still change systems. Then only content, tuning, polish and fixes |
| D − 30 h | Rough video cut from the shot list (`gen/test/shots.ps1`): shows which shots still need building |
| D − 20 h | **Content lock:** levels, assets and audio in. Final cold playtest done (`docs/design.md` "Playtesting") |
| D − 14 h | Video captured and cut (`docs/ue/cinematics-video.md`); page text and screenshots drafted |
| D − 12 h | Final pass on the Development zip (`docs/ue/production.md` "Final pass": the last half-day) |
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

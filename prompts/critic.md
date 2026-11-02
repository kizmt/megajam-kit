# Blind critic: brief for a fresh helper agent

Use after a visual or level change, before reporting it to the director. The critic is a **new** helper agent that has not
seen the work being built. Give it only what is below; never your own opinion of the result.

## What the main session prepares

1. Screenshots from the fixed camera set (`art/camera-set.md`), downscaled to ~1600 px. For an A/B of one change in
   the editor, take both in one session with landscape grass off and diff the pair first: run-to-run noise can be
   bigger than the change (`docs/ue/debugging.md` F, "Editor A/B captures").
2. One of:
   - the matching reference images (`art/reference/`), or
   - the previous version's screenshots of the same cameras (before/after), captured **in the same editor session**
     (exposure shifts between sessions: `docs/ue/debugging.md` F). If the "before" is from an older session,
     recapture it (roll back, capture, restore) or match its exposure on regions that did not change, and say so in
     the brief. In the rehearsal an unmatched pair made a critic call the same pebbles "dark charcoal" that it called
     "pale limestone" once matched, or
   - a rubric of 3-5 criteria when there is no image (e.g. "the exit reads from the start", "one clear landmark per
     room", "fight spaces are readable from the gameplay camera", "no flat, evenly lit walls").
3. Copies with neutral names (`A_1.jpg`, `B_1.jpg`...) and a random A/B order per camera, recorded in your own notes.
   The critic must not know which image is the game, which is the reference, or which is newer.
4. `art/style-lock.md` (palette, lighting, materials) if it exists, **cut down to the look itself**: remove round
   numbers, dates, version names and anything that describes what was built when ("Round 7 room"), or the critic
   can tell which image is newer.
5. Write the rubric **before** running the critic, and keep it to what the camera can show. List the deliberate
   states the camera will show and say how to judge them ("the exit gate is closed until the enemies are dead; judge
   whether it reads as the exit, not whether it is open"). This says nothing about which image is newer.

## The brief (paste, fill the brackets)

> You are reviewing images from a small 3D game for [genre / mood words]. For each camera there are two images, A
> and B. [Either: One is a reference for the intended look. / Or: They are two versions of the same view.] You are
> not told which is which.
>
> For each camera:
> 1. Score A and B from 1 to 10 against these criteria: [style-lock points or the rubric].
> 2. List the concrete flaws of the weaker image, most important first, each with where it is in the frame and what
>    would fix it ("left wall is one flat colour: add a light pool or a trim break", not "make it better").
> 3. Say what the stronger image does that the weaker one doesn't.
>
> Be specific and blunt. Ignore UI text and the build stamp. Answer in under 400 words.

## After the critic answers

- Unblind it yourself. If the game lost to the reference, or the new version lost to the old, the ranked flaws
  become the next tasks (within the round's limits).
- Check each flaw against `DECISIONS.md`: the director's calls overrule the critic. Drop flaws that contradict one
  (in practice: "cut the fill light" against a frozen lighting call).
- Don't spend tuning cycles on a rubric item the design or a frozen call blocks: a score that won't move under the
  constraints is a question for the director, not a task. Report it.
- Report to the director: the scores, the top 3 flaws, what you changed. Never present the critic's verdict as the director's.
- **Scores only compare within one run.** The same image scored 34/50 in one run and 26/50 in the next with the same
  brief; the A-versus-B ranking was consistent. For a trend, put the old and new images in the same run (or average
  2-3 critics), never compare totals across runs.
- For a high-stakes look (the style lock, the final submission shots) run 2-3 critics in parallel and act on flaws
  that at least two of them raise.

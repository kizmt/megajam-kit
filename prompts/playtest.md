# Fresh-eyes playtest review: brief for a fresh helper agent

The builder knows the game too well to see what confuses a first-time player. After each cold run
(`docs/design.md` "Playtesting"), a new helper agent reviews the run with no access to the code or the session's
history. Its findings become tuning and layout tasks; the director's calls (`DECISIONS.md`) overrule it.

## What the main session prepares

- **Contact sheets** of the run's clip: 1 frame every 5 s with the time printed on each frame, 6x5 tiles per sheet
  (a 10-minute run = 4 sheets). Recipes: `docs/ue/cinematics-video.md` "ffmpeg recipes" and `docs/ue/debugging.md`
  "F. Capture and test patterns" (the contact sheets bullet).
- **Event log** lines from the run (`docs/design.md` "Instrument the game"), each with its time since the run
  started, plus the **offset** between the log's run start and the clip's first frame (from the run-start line
  logged when recording began), so frame times and log times line up.
- **The pitch, the goal as the player is told it, the controls, and the beat list** from `design/concept.md`,
  each beat with its one new idea.
- **The watcher's written notes** with their clock times, quoted as written.
- Nothing else: no code, no plans, no earlier reviews (they bias the read).

## The brief (paste, fill the brackets)

> You are reviewing a recorded first-time play of a short game. You have never seen it before.
> Pitch: [one sentence]. Goal as shown to the player: [text]. Controls: [list].
> Beats, in order, with the one new idea each introduces: [list].
> Attached: contact sheets with timestamps, the event log (with its offset to the clip), and the watcher's notes.
> For each beat, say whether the player understood its new idea, citing frame times or log lines as evidence.
> Then list the problems a first-time player meets, most damaging first, each as: time / where, what happened,
> the likely cause (say if it's a guess), and one concrete fix in the level, the signposting or a tuning number.
> Flag any stretch over 60 s without progress or a new thing, any beat with more than 3 deaths, any death whose
> cause was not visible beforehand, and anything that blocks reaching the end.
> Finish with the three changes that would most improve the next run. Be specific; don't praise.

## After the reviewer answers

- Check each problem against the evidence (frame, log line). Drop any the evidence doesn't support.
- Check each fix against `DECISIONS.md`; drop or flag ones that contradict a director's call.
- Turn the top three into the next round's tasks, each with a pass/fail check from `docs/design.md`
  "Playtesting" (e.g. "first goal reached unaided", "deaths in beat 2 ≤ 3").
- After the fixes, the next cold run is the test. Report the numbers before and after.

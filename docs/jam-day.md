# Jam day: the order of things

One page for the director. Times are JST. Each line names the file that holds the detail; this page adds none.
Contest: **14:00 Thu Nov 12 to 10:59 Mon Nov 16** (93 h). Theme reveal: **04:00 Nov 12**. Submit by **07:59 Nov 16**
(D - 3 h); the last three hours are for upload and page problems only.

## The night before

- Kit: `git -C C:\dev\megajam-kit status` is clean and on `main`, pushed. `node gen\balances.ts` shows every
  service OK. Partner credits claimed where wanted (`docs/submission.md` "Partner credits").
- `C:\dev\_plan` holds only an empty `design\`, `CLAUDE.md` and `.claude\` (`SETUP.md` step 0).
- Machine: Launcher signed in, 5.9 opens, no editor or packaged game left running, 40+ GB free on `C:` (preflight checks it).
- Decide: watch the reveal live, or sleep and plan in the morning. The window fits either.

## Theme window (04:00 to 14:00): words only

No project, no code, no level, no images (rule 7(h)).

1. `cd C:\dev\_plan`, `claude`, `/effort high`.
2. Tell it the theme and: "Follow `C:\dev\megajam-kit\prompts\concept.md`." Answer its step 1 questions (target
   length, story or spectacle, budget, naming taste).
3. Pick a concept from the scored table. It writes `design\concept.md`, `design\schedule.md`, `DECISIONS.md` and the
   style and audio directions in words.
4. Have ready for 14:00: the project name (the game's name, no spaces) and the team name (for the zip).

## Contest start (14:00): the project, about 15 minutes

1. Epic Launcher > 5.9 > Games > **Blank**, **C++**, location `C:\dev`, name `<Name>`. Wait for the editor, close it.
2. `C:\dev\megajam-kit\scripts\setup-project.ps1 -Project C:\dev\<Name>` and do what it lists:
   - the kit's `.env`: `MEGAJAM_PROJECT=C:\dev\<Name>`;
   - open the project and let the first start finish (Kimodo's packages, several minutes);
   - Content Drawer > Add > Add Feature or Content Pack > **Third Person**;
   - File > New Level > Basic, save as `Content\Maps\Main`; Project Settings > Maps & Modes: both maps = Main;
   - Editor Preferences > Plugins > Python > **Developer Mode** on;
   - close the editor, run the script again (it installs Kimodo's two packages), reopen;
   - the Kimodo sequence: a Basic level saved as `/Game/_Kimodo/L_Kimodo`, a Level Sequence `LS_Kimodo` beside it,
     Sequencer's AnimGenOffline drop-down > **Add Character** with `SKM_Manny_Simple` and Control Rig on **Auto**
     (`SETUP.md` 10b step 4); save.
3. `C:\dev\<Name>\scripts\init-repo.ps1` (the first commit: it must be after 14:00).
4. With the editor open: `C:\dev\megajam-kit\scripts\preflight.ps1 -Project C:\dev\<Name>`. Fix every FAIL; the 7b
   WARN goes away at the style lock.
5. `cd C:\dev\<Name>`, `claude`, approve `unreal-mcp`, `/effort high`. Tell it: "The planning files are in
   `C:\dev\_plan`: move them in as `prompts/concept.md` says, then follow `prompts/style-lock.md`", with the
   budget caps (Tripo credits, images).

## While it runs

- **Leave the editor window open** (behind other windows is fine). Minimised, it draws nothing and Kimodo never
  starts; the tools restore it if they find it minimised.
- The session asks before paid batches, before closing the editor and before anything that takes the screen.
  Reports come at each round close (about every 2 hours) with captures.
- Your calls go in `DECISIONS.md`: say them plainly and it records them.
- **You are the second generator.** The partner credits are web app credits (Tripo's 3,000, Rodin, Meshy). The
  session gives you a concept image and settings; you generate in the web app, save the download to
  `<Project>\Generated\inbox\<Name>.glb` and say "done"; it imports it (`PIPELINE.md` "The director as a second
  generator"). The scripts spend the API balances, which you top up separately (`node gen\balances.ts`).
- Before sleeping, say so: it batches its questions, then works unattended (`CLAUDE.md` "While the director sleeps").
- Milestones to hold it to (`prompts/concept.md` step 5): style lock by 17:00 Thu; grey-box verb played and judged
  fun by 20:00 Thu; first playable by 08:00 Fri; vertical slice by 20:00 Fri; all beats rough and playtest 1 by 09:00 Sat; feature freeze 03:00 Sun; content lock
  15:00 Sun; video cut 21:00 Sun; final pass 23:00 Sun; submitted 07:59 Mon.

## The last day

`docs/submission.md` has the order: the Development zip played from the zip, the page, the video (30-60 s, gameplay
in the first 5 s), the devlog, the form with "Tools you used" filled in. Upload with `scripts\upload.ps1`.

## If something breaks

- MCP not answering, a stuck editor, a restore dialog after a crash: `docs/ue/debugging.md` (the triage table at
  the top).
- A 5.9 error that won't yield: search (never open) `docs/ue59/known-issues.md`.
- Two failed fixes for the same problem: roll back to the last good commit (`CLAUDE.md` "Working model").

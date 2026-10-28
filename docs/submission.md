# Submission: the page, the form, the devlog

What the judges see before they play: the itch.io page, the video and the devlog. This note is what goes on them,
from the Official Rules (2026-10-22) and the kit's shipping steps. Mechanics live elsewhere: packaging and upload in
CLAUDE.md "Shipping" and `SETUP.md` 9, the video in `docs/ue/cinematics-video.md`, the last checks on the build in
`docs/ue/production.md` "Final pass".

## What the rules require (all of it, or the entry can be disqualified)

- [ ] Submitted on the jam page (https://itch.io/jam/2026-epic-ai-megajam) before **10:59 JST Nov 16**
      (20:59 ET Nov 15). Late or broken entries are not accepted, and "proof of submission is not proof of receipt".
- [ ] Packaged for Windows, playable on Windows 10/11, needing **no additional software** (rules 1, 7(f)).
- [ ] **Full name and email of every entrant**, one named as the team owner (rule 1(c)).
- [ ] **Sourced assets noted at submission** (rule 1(d)): the list from `SOURCED_ASSETS.md`, with licences.
- [ ] **Video:** 30-60 s of recorded gameplay, 1920x1080 or higher, English (rules 1(e), 7(c), 7(i)).
- [ ] **Uses the theme** visibly (rule 7(g)).
- [ ] Not an obvious extension of an Epic tutorial; gameplay beyond the starter templates (rules 7(d), 7(e)).
- [ ] Everything in English: in-game text, audio, video, page and form (rule 7(i)).
- [ ] Teen-appropriate, no third-party IP, no trademarks except the Unreal Engine logo (CLAUDE.md "Jam compliance").
- [ ] **Devlog submitted with the game, during the contest** (rule 10, Glass Box), if competing for it.

## The game page (itch.io)

Draft it at D − 14 h (`prompts/concept.md` schedule), finish it in the final pass. Judges skim: the first screen
of the page has to sell the game and get it running.

- **Title and a one-line pitch** (the pitch from `design/concept.md`).
- **Cover image:** the game's best shot, readable small, with the title. itch's recommended size was 630x500 at the
  time of writing; check the upload form. Made from an in-game capture (the style-lock camera set or the set piece),
  not from key art, so it shows the real game.
- **Video:** the trailer link at the top (unlisted YouTube is fine, `SETUP.md` 9).
- **3-5 screenshots** at 1920x1080 from the packaged build: the first view, two beats, the set piece, the end. No
  debug text (the build stamp is fine in a corner, or crop it).
- **How to play:** the controls (keyboard/mouse, gamepad only if tested), the goal in one sentence, the play time
  (e.g. "8-12 minutes").
- **How to run it:** download, unzip, run `<Game>.exe`; the unsigned-build note (`SETUP.md` 9 step 5). The
  hardware it was tested on (the target PC) and the lowest settings preset for weaker PCs.
- **Theme:** one or two sentences on how the theme shapes the play, not only the setting.
- **Credits:** the team; AI tools used (models, agents, services from the kit README); sourced assets with licences.
  AI use is "considered for context only" in judging (rule 9): state it plainly.
- **Known issues:** anything a judge might hit, with the workaround. Better said than discovered.
- **Visibility:** the jam must be able to accept the page. Publish it (public or as the jam requires) well before
  D − 3 h, then check it from a logged-out browser window.

## The devlog (Glass Box modifier prize)

Judged on how well it documents *how the game was made*. The kit already writes the raw material: each round
appends `devlog/YYYY-MM-DD.md` (CLAUDE.md "Devlog (Glass Box)"). At content lock, turn it into one readable post:
- **Overview first:** the game, the team, the tools (Unreal 5.8.4, Claude Code with Unreal MCP, the kit's
  pipeline, the generators and services used), and the time it took.
- **The story by day:** concept and why it won, the style lock, first playable, what broke and how it was fixed,
  what was cut and why, the final pass.
- **Show the process:** before/after screenshots, a few prompts that mattered (quoted), a generated asset next to
  its concept, a playtest finding and its fix (`prompts/playtest.md`), numbers (rounds, assets generated, credits
  spent, bench results).
- **Honest about AI:** what the agent did, what the director decided, where AI output needed fixing.
- No keys, no local paths, no personal data in screenshots or logs.
- Publish it where the jam asks (itch devlog post on the game page, unless the jam page says otherwise) and link it
  in the submission, inside the contest period.

## Order on the last day

1. D − 14 h: video cut, page and devlog drafted (text and screenshots).
2. D − 12 h: final pass on the packaged zip (`docs/ue/production.md`).
3. Upload the zip with `scripts/upload.ps1 -Push` (the director's go-ahead), then download it from the page,
   unzip to a fresh folder and play the first minute.
4. Fill the submission form: entrants, sourced assets, video link, devlog link. Submit by **D − 3 h**.
5. Check the submission from a logged-out browser: the page, the video, the download. Screenshot the confirmation.
6. Keep the remaining hours for problems. Whether a fixed build may replace the submitted one depends on the jam's
   settings (check the jam page at kickoff); if it is allowed, only before the deadline, and say so in the devlog.

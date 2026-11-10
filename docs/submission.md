# Submission: the page, the form, the devlog

What the judges see before they play: the itch.io page, the video and the devlog. This note is what goes on them,
from the Official Rules (PDF, last updated 2026-11-05) and the jam page, and the kit's shipping steps. Read both:
rule 1 makes "all terms and conditions of any Contest website" binding too, and the jam page alone holds the
packaging rules (development build, zip name) and the pre-jam declaration. Mechanics live elsewhere: packaging and upload in
CLAUDE.md "Shipping" and `SETUP.md` 9, the video in `docs/ue/cinematics-video.md`, the last checks on the build in
`docs/ue/production.md` "Final pass".

## What the rules require (all of it, or the entry can be disqualified)

- [ ] Submitted on the jam page (https://itch.io/jam/2026-epic-ai-megajam) before **10:59 JST Nov 16**
      (20:59 ET Nov 15). Late or broken entries are not accepted, and "proof of submission is not proof of receipt".
- [ ] Packaged for Windows, playable on Windows 10/11, needing **no additional software** (rules 1, 7(f)): the
      VC++ runtime check in Windows Sandbox (`docs/ue/production.md` "Packaging and what gets shipped").
- [ ] A **development build** (jam page, Unreal Engine teams, as of 2026-11-11: "Desktop or mobile: Windows, macOS,
      Android, or iOS (development build). Windows builds must run on Windows 10 or 11."): `package.ps1` without
      `-Config`, never Shipping. Zip named `TeamName_GameName`, under 1 GB (bigger: butler, which `upload.ps1`
      uses anyway), uploaded to our own itch.io account, then submitted to the jam.
      The page also offers an experimental **web** build (5.9 MegaJam Preview, Shipping, `index.html` at the zip's
      top level, under 500 MB total and 200 MB per file, marked playable in the browser). Not for us: rule 1(b)
      names Windows, macOS, Android and iOS only, and a web export is an untested pipeline four days out.
- [ ] **Team name, game name, and every entrant's full name and the email linked to their Epic Games account**, one
      named as the team owner (rule 1(c); the jam page asks for the Epic-account email). Winners are notified at that
      email around 2027-01-29 and have 72 hours to answer (rule 14).
- [ ] **Pre-jam work declared** (jam page: "Declare any prompts, scripts, or assets you made before the jam"; rule
      7(h) lets Epic ask for them and their version history): name this kit (prompts, scripts, docs; the private repo
      and its push history) and any pre-downloaded sourced packs, on the form and in the page credits.
- [ ] **Submitted by the director, by hand**: rule 17 says a submission "must be submitted by an Entrant (on behalf of
      the team) and not by an AI agent or other automated means". The agent prepares everything; the director fills
      and sends the form.
- [ ] **Sourced assets noted at submission** (rule 1(d)): the list from `SOURCED_ASSETS.md`, with licences.
- [ ] **Dev log link** (form field, optional; required for Glass Box) and **Tools you used** (optional; partner prizes
      need it: Hyper3D's Rodin cash pool, the NVIDIA RTX Award). List every AI tool and service actually used.
- [ ] **Video:** 30-60 s of recorded gameplay, 1920x1080 or higher, English (rules 1(e), 7(c), 7(i)).
- [ ] **Uses the theme** visibly (rule 7(g)).
- [ ] Not an obvious extension of an Epic tutorial; gameplay beyond the starter templates (rules 7(d), 7(e)).
- [ ] Everything in English: in-game text, audio, video, page and form (rule 7(i)).
- [ ] Teen-appropriate, no third-party IP, no trademarks except the Unreal Engine logo (CLAUDE.md "Jam compliance").
- [ ] **Devlog submitted with the game, during the contest** (rule 10, Glass Box), if competing for it.

## Grants and credits

- **Development Continuation Grants:** the jam page lists them per engine as $50,000 / $25,000 / $10,000 for first,
  second and third place. They follow overall placement, the total across all seven categories, not one category.
  At kickoff, check whether they need anything on the submission form.
- **Fab credits** go to each winning team's lead. Partner prizes are per team unless marked per member.
- **Hyper3D:** $10,000 split equally among *winning* teams (any category) that used Rodin and listed it under
  "Tools you used". Only pays if the game wins something; one honest Rodin asset in the game qualifies.

## Partner credits (jam page, 2026-11-11)

Codes and claim links were emailed on Nov 10 (check spam). The director claims them; times are as the page gives
them (PST where stated).

| Partner | What | Claim by | Notes |
|---|---|---|---|
| Tripo | 3,000 credits + Pro | Nov 16 (code from worlds.tripo3d.ai/epicaimegajam2026promotion, then tripo3d.ai > Upgrade > Redeem Code) | Pro ends Nov 18 00:00 PST (17:00 JST); the kit's main 3D generator |
| Hyper3D (Rodin) | Business plan, 208 credits | Nov 16 | Benefits end Nov 20; see the Rodin pool above |
| Meshy | Pro month, 1,000 credits (web or API) | Nov 17 | Sign-up link only; card required |
| PBRgen | Tileable PBR materials from text or an image | Valid Nov 7-15 | Floors, walls, terrain: albedo, normal, roughness, metallic, height, AO |
| fal | $30 | Nov 30 | Image, video, audio, 3D models through one API |
| Claude | $25 API credits (platform.claude.com) | 90 days from claiming | API, not the Claude Code plan |
| SpaceXSI | $50 across Cursor and Grok Bot | Nov 15 | Lasts 7 days from claiming |
| WeLoveIndies | Sound and music | -- | **Non-commercial licence**: fine for the jam, a commercial licence if the game is ever sold (a grant could lead there). Sourced assets: log them |
| Diversion, Rokoko, Reallusion | Version control, mocap, iClone | -- | Not in the kit's pipeline |

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
  (e.g. "about 8 minutes").
- **How to run it:** download, unzip, run `<Game>.exe`; the unsigned-build note (`SETUP.md` 9 step 5). The
  hardware it was tested on (the target PC) and the lowest settings preset for weaker PCs. Requirements (Epic's spec
  page, the same on 5.8 and 5.9): Windows 10 22H2 or Windows 11, 64-bit; a DirectX 12 GPU with current drivers (Nanite and Lumen need
  D3D12 SM6). Recommend a driver update: it fixes most D3D12 start-up crashes. Say the first launch prepares
  shaders for up to a minute (`docs/ue/production.md` "First launch: PSO warm-up").
- **Theme:** one or two sentences on how the theme shapes the play, not only the setting.
- **Credits:** the team; AI tools used (models, agents, services from the kit README); sourced assets with licences;
  the pre-jam kit (prompts, scripts and docs made before the contest, as the jam page asks to declare).
  AI use is "considered for context only" in judging (rule 9): state it plainly.
- **Known issues:** anything a judge might hit, with the workaround. Better said than discovered. Only if the SM5
  shader set is cooked (`docs/ue/production.md`): "If it crashes at start, run `<Game>.exe -dx11`". Without it the
  flag can't help; leave it off.
- **Visibility:** the jam must be able to accept the page. Publish it (public or as the jam requires) well before
  D − 3 h, then check it from a logged-out browser window.

## The devlog (Glass Box modifier prize)

Judged on how well it documents *how the game was made*. The kit already writes the raw material: each round
appends `devlog/YYYY-MM-DD.md` (CLAUDE.md "Devlog (Glass Box)"). At content lock, turn it into one readable post:
- **Overview first:** the game, the team, the tools (the Unreal version the project used, Claude Code with Unreal MCP, the kit's
  pipeline, the generators and services used), and the time it took.
- **The story by day:** concept and why it won, the style lock, first playable, what broke and how it was fixed,
  what was cut and why, the final pass.
- **Show the process:** before/after screenshots, a few prompts that mattered (quoted), a generated asset next to
  its concept, a playtest finding and its fix (`prompts/playtest.md`), numbers (rounds, assets generated, credits
  spent, bench results).
- **Honest about AI:** what the agent did, what the director decided, where AI output needed fixing.
- **Caption from the frames, not the file names.** Before captioning, open every image and a frame sheet of every
  clip (first, middle, last frame). A caption says what is on screen, stand-ins included ("the grey test model"). In
  the rehearsal a helper captioned three animation previews on the grey test model as the game, from their names
  and the round notes; a frame check caught it before the commit.
- No keys, no local paths, no personal data in screenshots or logs.
- Publish it where the jam asks (itch devlog post on the game page, unless the jam page says otherwise) and link it
  in the submission, inside the contest period.

## Order on the last day

1. D − 14 h: video cut, page and devlog drafted (text and screenshots).
2. D − 12 h: final pass on the **Development** zip the rules require (`package.ps1`, never `-Config Shipping`;
   `docs/ue/production.md` "Final pass").
3. Upload the zip with `scripts/upload.ps1 -Push` (the director's go-ahead), then download it from the page,
   unzip to a fresh folder and play the first minute.
4. The director fills and sends the submission form (rule 17): team and game name, entrants with their Epic-account
   emails, sourced assets, the pre-jam declaration, video link, devlog link, tools used. Submit by **D − 3 h**.
5. Check the submission from a logged-out browser: the page, the video, the download. Screenshot the confirmation.
6. Keep the remaining hours for problems. Whether a fixed build may replace the submitted one depends on the jam's
   settings (check the jam page at kickoff); if it is allowed, only before the deadline, and say so in the devlog.
7. After the jam: keep the submitted build and its commit as they are (jam page FAQ: "Keep the jam version as your
   submitted build"); later work goes on a branch or a new page.

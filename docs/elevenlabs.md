# ElevenLabs: sound effects, music and voice

Read this before generating any game audio with `gen/audio.ts` (commands and options: `PIPELINE.md` "Audio"). Audio
is a judging category, and most of the quality comes from the prompt.

**Status:** from ElevenLabs' docs, read 2026-11-01 (sources at the end), plus our own runs where marked *tested*.
ElevenLabs changes models often: if something here fails, check the linked page before working around it.

## Account, cost and limits

- **Ship only audio made on a paid plan.** Paid plans include a commercial licence for content made while subscribed,
  usable after the subscription ends. Free-plan output needs "elevenlabs.io" credited and is not for commercial use.
  Output of Beta services is not for commercial use; SFX v3 is "limited access" (fine for the jam entry; check the
  terms before a commercial release).
- **Music terms:** paid plans allow commercial use except film, TV, radio and "Studio Games". A jam game is an Indie
  Game (under $500k lifetime revenue, developer under $1M a year), with 60 days to upgrade if it outgrows that. No
  attribution on paid plans. **Prompts may not name artists, songwriters, labels, songs or albums, or quote lyrics**:
  the API refuses them (422 `bad_prompt`, sometimes with a suggested rewrite).
- **Parallel requests:** music 2 at once on Starter, Creator and Pro; speech and SFX 3 (Starter), 5 (Creator), 10 (Pro).
  `audio.ts` runs at most 2 (music) or 3 (others) at once, retries a 429 with back-off, and stops the batch on 402
  (out of credits; prints STOPPED and exits 3): tell the director.
- **No re-download.** ElevenLabs' history can't return SFX or music, so the local file is the only copy of a paid
  generation. `audio.ts` moves an earlier take with the same name to `old\` instead of overwriting it.
- **Credits:** `audio.ts` prints the remaining credits and plan before a batch (`/v1/user/subscription`; *tested*
  2026-11-01, Creator plan). Quote them when asking the director to approve a batch.
- **Prices to quote** (check the pricing page before a batch): SFX with a set length 40 credits per second; music about
  $0.15 per minute; a composition plan is free; Voice Design charges only the preview text's characters; Voice
  Changer and Voice Isolator 1,000 credits per minute.
- **Output format:** the default `mp3_44100_128` is converted to 48 kHz WAV by ffmpeg (hiss-heavy beds: 192 kbps,
  "Checking and matching levels"). WAV and PCM at 44.1 kHz need the Pro plan, MP3 192 kbps needs Creator. On Pro,
  `--format wav_48000` skips the lossy MP3 step (ffmpeg still applies `--mono`; SFX: non-looping only; untested).
  **Music:** the API's own default for `music_v2`/`music_v2_5` is `mp3_48000_192`, but `audio.ts` always sends
  `--format` (128 kbps unless set), so pass `--format mp3_48000_192` for music. Music has no `wav_*` formats.

## Sound effects (SFX v3)

*Tested* 2026-11-01: SFX v3 works on our account, one-shot and 20 s `--loop`. It is limited access: an account
without it gets "Unknown model" (the script then suggests `--model eleven_text_to_sound_v2`).

- **Describe the action, the setting and how it is performed**, not a category: `footsteps on gravel approaching
  slowly`, not `footsteps`. Wording matters ("arguing" beat "fighting" in ElevenLabs' test): rephrase before
  re-rolling. Prompts are limited to 450 characters.
- **Sequences in order with "then"** (`sword drawn, then clashing with another blade`). **Exact counts are not
  followed** (`hit 4 times`): make one hit and repeat it in the game.
- **Audio terms work:** impact, whoosh, braam (big cinematic brass hit), glitch, drone, one-shot, loop, stem. Musical
  pieces too (`vintage brass stabs in F minor`): put stingers in the game's music key.
- **Layers are separate files:** whoosh, impact and body tail as three one-shots, played together or mixed in a
  MetaSound (`docs/ue/game-feel.md`, catalogue row "Sound"). One prompt for all three is harder to tune.
- **Variations:** there is no seed, so every run differs. `--n 3` for repeated sounds (footsteps, hits); a lower
  `--influence` (ours defaults to 0.4, the API to 0.3) gives more varied takes, a higher one more literal and alike.
- **Length:** 0.5-30 s. A set `--seconds` bills per second, so keep one-shots short (0.5-3 s); without it the model
  picks. `--loop` makes a seamless loop of up to 30 s for ambience; Unreal repeats it.
- v3 clips less on high sounds (chimes, whistles) than v2.

## Music

### Prompts

- **Decide five things, or the model picks the most average answer:** genre, mood, instruments, tempo (BPM) and
  production era, plus a key. Example: `ambient folk exploration theme, 72 BPM, D dorian, solo bouzouki over low
  drone strings, sparse frame drum, weathered and warm, recorded in a stone chapel, instrumental`.
- **Studio words change the mix** (`close-mic'd`, `bone-dry`, `plate reverb`, `tape saturation`); without them,
  describe the room. Take them from the style lock so the music matches the look.
- **One BPM and key for all the game's cues** (calm, pressure, climax), so crossfades and layers line up; the model
  holds a stated BPM and key closely. **Intensity layers:** `solo` before an instrument gives a stem-like part
  (`solo taiko percussion, 72 BPM, D dorian`) to fade in over the base cue (MetaSound `Intensity`,
  `docs/ue/audio-ui.md`).
- **Narrate intros, stingers and endings in order:** `start with just a drone, bring in the melody after eight bars,
  then...`. "Just" keeps the model from filling the silence.
- **Musical ambience:** the model also renders non-musical sound in a key and tempo (`wind through a ruined temple,
  in D, slow`), for beds that should sit under the score.
- Record each cue's final prompt or plan in `DECISIONS.md` so later cues match it.

### Composition plans: exact section lengths (recommended for game cues)

`node gen/audio.ts plan "<prompt>" --seconds 60 --name Explore` asks ElevenLabs for a plan (free, rate limited) and
writes `MUS_Explore.plan.json` (*tested* 2026-11-01). Edit it, then compose with
`node gen/audio.ts music --plan <file> --seed 1 --name Explore`.

- A plan is up to 30 chunks, 3 s to 10 min in total, each chunk 3-120 s with `text` (a `[Section name]`),
  `duration_ms`, `positive_styles` and `negative_styles` (up to 50 each) and `context_adherence` (low/medium/high).
- **The first chunk's styles set the whole track** (give it 6-7 or more); later chunks' styles change that section
  only. Don't put style words in `text`.
- `music_v2_5` holds each chunk to its exact duration: plan a 4 s intro, a loop body of whole bars and a 3 s ending
  as separate chunks, then cut in Unreal or ffmpeg.
- **Instrumental:** `--vocals`/`force_instrumental` doesn't apply to plans. Add `vocals`, `lyrics` and `singing` to
  every chunk's `negative_styles` (our test plan came back with none).
- **Seeds work only with a plan** (the API refuses a seed with a prompt), and reproduction is best-effort. Keep the
  plan JSON and seed of each cue you keep.

### Loops

- Whole bars: seconds = bars x beats per bar x 60 / BPM (16 bars of 4/4 at 72 BPM = 53.3 s). Check the seam by
  playing it three times: `ffmpeg -stream_loop 2 -i cue.wav -c copy cue_x3.wav`.
- **Official seamless loop (not scripted yet):** compose with `store_for_inpainting` to get a `song_id`, then a plan of
  [audio reference chunk: a slice of that song] + [short generated "glue" chunk] + [the same slice]. Needs
  `music_v2`/`music_v2_5`. Inpainting also extends a track (new intro or outro around a kept slice) or regenerates
  one section.
- **Stems** from a finished track: `/v1/music/stem-separation` (2 or 6 stems, returned as a ZIP; not scripted).

## Voice lines (Eleven v4)

`audio.ts voice` uses `eleven_v4` by default and always sends the model (the API's default is the older
`eleven_multilingual_v2`). v4 is still being trained: test the game's voice and key lines first, and generate a
character's lines in one batch on one day.

- **Direct the delivery with audio tags** in square brackets before the words: `[low, gravelly voice, slow and
  measured] The tower has stood for a thousand years.` Describe the voice, not an event: v4 also makes sound effects
  and can read an ambiguous tag (`[thunder]`) as one. Match tags to the voice: a calm voice won't shout convincingly.
- **No SSML.** `<break>` tags don't work on v4. Pause with ellipses, `[short pause]` / `[long pause]` and line
  breaks. v4 has no Speed or Style setting; only Stability (lower is more varied) and Similarity apply
  (`--stability`, `--similarity`, untested).
- **CAPITALS add emphasis**, ellipses add weight. Write what is said: numbers and abbreviations in words
  ("forty-two", "Doctor"). Stage directions in the text ("she said softly") are spoken aloud: use tags instead.
- **Names:** IPA between slashes in the text (`"/ˈθeɪlɪs/"`), with stress marks; or one pronunciation dictionary for
  all lines (case-sensitive: add both "Name" and "name"; not scripted).
- **Accents:** `[strong Greek accent]` is an experimental tag; test it per voice. A voice keeps its accent in its own
  language, but v4 drops it when generating another language.
- **Subtitles:** `--timestamps` saves per-character timing in the line's `.json` sidecar (untested).
- `--seed` is best-effort repeatability. Lines generated together can share context through request stitching
  (`previous_request_ids`, up to 3, under 2 hours old; not scripted).
- **One line per file** (`--name`), so the game can trigger, subtitle and replace lines one at a time. For a
  conversation, `/v1/text-to-dialogue` takes up to 10 voices and 2,000 characters per request (not scripted).

## Making a narrator or character voice

Script it (repeatable, and the director only has to listen):

```powershell
node gen/audio.ts design "<description>" --name Narrator --preview "<100-1000 characters in character>" --seed 1 --guidance 8
#   -> Generated\audio\VOICE_Narrator_1..3.mp3 + VOICE_Narrator.design.json (request, preview ids)
node gen/audio.ts save <generated_voice_id> --name Narrator      # the preview the director picked; prints the voice id
node gen/audio.ts voice "[slow, measured narration] ..." --voice <voice id> --name Line01
```

Each `design` call bills only the preview text's characters, once for all three previews. Change one thing per call
(wording, `--guidance`, `--design-model eleven_ttv_v3`, `--seed`) so the director can compare. `save` adds a voice
to the account, so save only the pick. Record the voice id, description, seed and settings in `DECISIONS.md`. The
site's Voice Design page works too; `voices` then lists the id. The rehearsal narrator (a bare "Greek accent"
label, ignored in every preview) taught us the first rule below.

- **Write the accent into the description, using ElevenLabs' structure:**
  `Native <language>. <Gender>, <age range>. <Quality level>.` then `Persona: <2-5 words>. Emotion: <2-3 adjectives>.`
  then 1-2 sentences on timbre, pacing and delivery. Example: `Native English speaker with a thick Greek accent. Male,
  70s. Studio quality. Persona: wise old storyteller. Emotion: warm, patient, wry. Deep, raspy voice, rolled r's and
  full open vowels; slow, measured pacing with long pauses.`
- **"Thick" works better than "strong"** for how much accent. Combine it with age, tone and pacing; give ages, not
  "old". Describe timbre (raspy, gravelly) separately from emotion.
- **Guidance scale:** higher follows the prompt more closely, "recommended when accent or tone accuracy" matters; too
  high on a niche prompt can lower audio quality or sound robotic. ElevenLabs' UI examples sit at 20-40%; the API's
  `guidance_scale` defaults to 5 and the docs don't say how the two map. For an accent, try the default, then higher
  (`--guidance 8`, `12`), one step per call.
- **A quality level** ("Studio quality") belongs in the structure, but such phrases can reduce accuracy on unusual
  prompts: drop it if the accent won't come through.
- **Preview text in the character's voice**, a full sentence or a short paragraph (100-1,000 characters): longer
  previews are more stable and expressive.
- **Then test the saved voice on v4** with real lines: ElevenLabs says Voice Design voices "may not be as performative"
  on v4. If it falls flat, try designing with the `eleven_ttv_v3` model, Remix (changes a copy of a voice's accent,
  age or pacing), or a Library voice with the right age and timbre plus an accent tag.
- **The director can perform a line instead:** Voice Changer turns a recording into the character's voice and keeps
  the performance (timing, whispers, laughs, and the speaker's own accent). 1,000 credits per minute; not scripted.
- `design` also takes `--loudness` (-1 to 1, default 0.5; 0 is about -24 LUFS) and `--enhance` (ElevenLabs expands a
  short description; off by default, since our descriptions are already detailed). The API's reference-audio input
  (`eleven_ttv_v3` only) isn't scripted. `design` *tested* 2026-11-01 (3 previews of 23-26 s from a 330-character
  preview text); `save` untested.

## Checking and matching levels

From the rehearsal (2026-11-01). A take can come back broken and still count as a success: listen, and measure.
- **Near-silent takes:** 3 of 53 SFX generations peaked at -24 to -42 dB (an ambience, a footstep, a sting).
  `audio.ts` prints each take's peak and mean and warns under -20 dBFS. Re-prompt rather than re-roll: the ambience
  came back usable with its sound sources named and "no speech".
- **Match a batch before import:** measure every file (`ffmpeg -i x.wav -af volumedetect -f null -`, or `ebur128`
  for LUFS), then gain-match one-shots by peak and loops by mean. Unmatched, a batch plays at wildly different
  loudness.
- **Beds of hiss or insects:** a cicada bed at the default `mp3_44100_128` (SFX v2) sounded "broken": 99.8% of its
  energy was above 4 kHz and the spectrogram had blocky holes at about 5.5 and 12.5 kHz. Re-made with SFX v3 at
  `--format mp3_44100_192` (Creator plan and up) it was clean; the model and the bitrate changed together, so which
  one fixed it is not known. For such beds pass `--format mp3_44100_192` and look at a spectrogram before import
  (`ffmpeg -i bed.wav -lavfi showspectrumpic=s=1024x512 bed.png`).
- **Mix beds well under the music:** about -30 LUFS against music at -21. At 2 LU apart the bed read as a fault, not
  as atmosphere. Beds of one loop that overlap in the level: `docs/ue/audio-ui.md` "Attenuation and spatialization".
- **Three loudness numbers, three jobs; don't mix them up:** -14 LUFS is the uploaded trailer (web platforms,
  `docs/ue/cinematics-video.md`); -30 LUFS beds under -21 LUFS music is the balance measured in the rehearsal; -24
  LUFS integrated is the target for the whole game's output mix, measured in-engine (`docs/design.md` "Audio and
  pacing"). Don't normalise game files to -14 or -24; balance them against each other, then check the game's mix.
  (The `--loudness` "-24 LUFS" in voice design above is only that API's scale.)
- **Cutting a take into lines (or any cut with fades):** seek on the input side (`-ss` before `-i`) or trim in the
  filter chain and restart its clock before the fades:
  `-af "atrim=start=<a>:end=<b>,asetpts=PTS-STARTPTS,afade=t=in:d=0.03,afade=t=out:st=<len-0.12>:d=0.12"`.
  With `-ss` after `-i` the filters stay on the source's clock and `afade` silences the cut: in the rehearsal three of
  four cut lines were all zeros. Check every cut's peak before import (stop under about 0.05, i.e. -26 dBFS). Unreal
  imports a silent WAV without a warning; the asset's size gives it away (a few KB).

## Sources (read 2026-11-01)

- Sound effects: https://elevenlabs.io/docs/overview/capabilities/sound-effects.md ,
  https://elevenlabs.io/docs/api-reference/text-to-sound-effects/convert.md
- Music: https://elevenlabs.io/docs/overview/capabilities/music/best-practices.md ,
  https://elevenlabs.io/docs/api-reference/music/compose.md (music output formats re-read 2026-11-07),
  https://elevenlabs.io/docs/api-reference/music/create-composition-plan.md ,
  https://elevenlabs.io/docs/eleven-api/guides/how-to/music/composition-plans.md ,
  https://elevenlabs.io/docs/eleven-api/guides/how-to/music/inpainting.md , https://elevenlabs.io/music-terms
- Voice: https://elevenlabs.io/docs/overview/capabilities/text-to-speech/eleven-v4.md ,
  https://elevenlabs.io/docs/overview/capabilities/text-to-speech/best-practices.md ,
  https://elevenlabs.io/docs/api-reference/text-to-speech/convert.md ,
  https://elevenlabs.io/docs/eleven-creative/voices/voice-design.md ,
  https://elevenlabs.io/docs/api-reference/text-to-voice/design.md ,
  https://elevenlabs.io/docs/overview/capabilities/voice-changer.md
- Limits and licence: https://elevenlabs.io/docs/overview/models.md (concurrency, limited access),
  https://elevenlabs.io/docs/api-reference/history/list.md ,
  https://elevenlabs.io/docs/help-center/legal/can-i-publish-the-content-i-generate-on-the-platform.md ,
  https://elevenlabs.io/pricing/api

# Cinematics and video capture (UE 5.8.4; target PC: RTX 4060)

The submission needs a **30-60 s gameplay video, >= 1920x1080, gameplay in the first 5 s, English only**.
This note covers getting that video with the least risk, then optional in-game cinematics.
Rule of thumb: the video is **real gameplay**, filmed the way the director's call says. **Default: offline frame
capture in `-game` (D3b)**, if the game has its reset hook and test hooks by S + 48 h (`prompts/concept.md` step 4);
the rehearsal's live-capture cut was rejected and the D3b re-shoot accepted. Without the hooks by then, or as the
fallback, **live capture from the packaged build** (route 1). Sequencer and Movie Render Queue are extras for an
intro/ending or one or two hero shots, never the critical path.

## A. Getting the gameplay video (ranked for 3am on deadline day)

| # | Route | Use for | Verdict |
|---|---|---|---|
| 1 | **Kit capture scripts**: `gen/test/record_window.ps1` (records one game window, e.g. the packaged build you launched, given its PID and window handle) or `gen/test/autoclip.ps1` (launches a map with `-game` in a 1920x1080 window plus the game's autoplay flag and records it through record_window.ps1) | The gameplay footage | The fallback, and the safe route on deadline night. Records only while the game is alive, focused and uncovered (`debugging.md` "Recording the screen safely"). The game takes the foreground: tell the director first. 60 fps (`record_window.ps1 -Fps`; autoclip always records at 60); clips are video only, so add the D1 audio (or `anullsrc` silence) before recipes that use `[0:a]` |
| 1b | **Offline frame capture in `-game`** (D3b): the game runs at a fixed 1/60 s step, a script stages each shot through the game's test hooks and saves every frame | The trailer | **Default** when the game has its reset and test hooks by S + 48 h. The rehearsal's accepted trailer (its live-capture cut was rejected). No plugin. Slow (~2 frames/s; ~2 h of runs for 45 s); needs test hooks in the game; no game audio |
| 2 | Movie Render Queue/Graph from a Level Sequence | Rendered trailer shots, intro/ending | Renders a Sequence; with an autoplay mode the game plays itself inside the render (D3). Offline, slow, plugin off by default |
| 3 | Take Recorder -> re-render with MRQ | "Gameplay with nicer cameras" | Too fragile for a jam (see B). Skip |
| - | NVIDIA App (ShadowPlay), OBS, Windows Game Bar, raw ffmpeg `ddagrab` | - | **Not for agent use: records whatever is on screen** (`debugging.md` "Recording the screen safely"). The director may use them by hand |
| - | `HighResShot` / legacy "Render Movie" capture | Stills only / legacy | Not for the video |

Why live capture is the fallback: it shows exactly what judges will play, costs zero engine work, and works on the
packaged build we make daily anyway. But it films whatever happened, hitches and HUD included, so the trailer comes
from D3b when the hooks exist; MRQ can also render gameplay if the game has an autoplay mode (section D3).

### Capture settings

- Live-capture footage (route 1) comes from the **packaged Development build** (autoclip's `-game` clips are for
  review), captured at **2560x1440 or 1920x1080** (not 4K: D2). Capturing at 1440p and downscaling to 1080p in ffmpeg
  looks sharper than native 1080p capture. Windowed launch for testing: `MyGame.exe -windowed -ResX=1920 -ResY=1080`
  (verified: `gen/test/autoclip.ps1` and `gen/test/game_test.ps1` launch with these).
- **60 fps, H.264 (or HEVC), high bitrate**: 50+ Mbps at 1440p60 / 30+ Mbps at 1080p60. The capture is the
  master; ffmpeg makes the upload file.
- Audio: game audio only (record the engine's own mix if the capture can't hear it: D1). **No mic** (English-only
  rule; no accidental talking). 48 kHz.
- Before recording, in the game console (Development build has `~`): `stat none`,
  `DisableAllScreenMessages` (hides `AddOnScreenDebugMessage` spam; unverified name in 5.8). No FPS counter.
- No trademarks/third-party IP on screen: overlays (Discord, Steam, NVIDIA perf HUD) must be off.
- Record **many short takes (20-60 s each)** of the best moments, not one long run. Name them `take01.mp4`...
- Lumen settles over ~1 s after a level loads or a hard camera jump (GI/reflection history rebuilds).
  Start recording a couple of seconds after spawn and trim the head (unverified exact time; just look).

### ffmpeg recipes (ffmpeg 9.0.2, Gyan full build; every filter/flag below was dry-run on the target PC)

PowerShell. Set the path once per shell:

```powershell
$ff = (Get-ChildItem "$env:LOCALAPPDATA\Microsoft\WinGet\Packages\Gyan.FFmpeg*\*\bin\ffmpeg.exe" | select -First 1).FullName
$fp = $ff -replace 'ffmpeg.exe','ffprobe.exe'
& $fp -hide_banner take01.mp4          # check resolution, fps, audio present
```

1) **Cut a clip** (re-encode = frame accurate; normalises every clip to 1080p60/yuv420p/48 kHz stereo so they
concatenate cleanly). `-ss` = start, `-t` = length. Keep `-ss` **before** `-i` (input seek): after `-i` the filters
stay on the source's clock, and a fade placed at the clip's own time silences it (`docs/elevenlabs.md` "Checking and
matching levels" has the audio-only cut):

```powershell
& $ff -ss 00:00:12.5 -i take01.mp4 -t 8 -vf "scale=1920:1080:flags=lanczos,fps=60,format=yuv420p" `
  -c:v libx264 -preset slow -crf 16 -c:a aac -b:a 192k -ar 48000 -ac 2 clip01.mp4
```

2) **End card** (3 s, black, title text, silent audio so it concatenates). Do NOT open the video with it:
gameplay must be on screen within 5 s, so the title goes on top of the first gameplay clip (step 3) and
the card goes at the end.

```powershell
& $ff -f lavfi -i "color=c=black:s=1920x1080:r=60:d=3" -f lavfi -i "anullsrc=r=48000:cl=stereo" -t 3 `
  -vf "drawtext=fontfile='C\:/Windows/Fonts/arialbd.ttf':text='MY GAME':fontsize=120:fontcolor=white:x=(w-text_w)/2:y=(h-text_h)/2,fade=t=in:st=0:d=0.5" `
  -c:v libx264 -preset slow -crf 16 -pix_fmt yuv420p -c:a aac -b:a 192k endcard.mp4
```

3) **Title overlay on the opening clip** (first 3 s, outlined text over gameplay):

```powershell
& $ff -i clip01.mp4 -vf "drawtext=fontfile='C\:/Windows/Fonts/arialbd.ttf':text='MY GAME':fontsize=90:fontcolor=white:borderw=4:bordercolor=black:x=(w-text_w)/2:y=h*0.1:enable='lt(t,3)'" `
  -c:v libx264 -preset slow -crf 16 -c:a copy clip01_title.mp4
```

4) **Concatenate + loudness-normalise + final encode** in one pass. All inputs must share size/fps/sample
rate (steps 1-2 guarantee it). `loudnorm` targets -14 LUFS (typical web level), true peak -1.5 dB.
`-maxrate 12M` is a quality ceiling well above what CRF 20 needs at 1080p60 (60 s stays under ~90 MB); the
submission is a link, so size is not a constraint (see below). `+faststart` puts the index first for web players.

```powershell
& $ff -i clip01_title.mp4 -i clip02.mp4 -i clip03.mp4 -i endcard.mp4 -filter_complex `
  "[0:v][0:a][1:v][1:a][2:v][2:a][3:v][3:a]concat=n=4:v=1:a=1[v][a];[a]loudnorm=I=-14:TP=-1.5:LRA=11,aresample=48000[an]" `
  -map "[v]" -map "[an]" -c:v libx264 -preset slow -crf 20 -maxrate 12M -bufsize 24M -profile:v high -pix_fmt yuv420p `
  -c:a aac -b:a 192k -ac 2 -movflags +faststart TeamName_GameName_video.mp4
```

Optional crossfade between two clips instead of a hard cut (video only; offset = clip A length - fade):
`-filter_complex "[0:v][1:v]xfade=transition=fade:duration=0.5:offset=7.5,format=yuv420p[v]"`.
Fast GPU encode if libx264 is too slow: `-c:v h264_nvenc -preset p7 -rc vbr -cq 19 -b:v 0 -maxrate 12M -bufsize 24M`.
Check the final file: `& $fp -hide_banner TeamName_GameName_video.mp4` (1920x1080, 60 fps, 30-60 s, aac).
The jam asks for a gameplay video **link** (itch submission field), not an upload: host it on YouTube (unlisted is
fine) or similar, so file size is not a constraint: don't lower `-maxrate` below 12M to save space; YouTube
re-encodes anyway.

### Submission video checklist

- [ ] Gameplay from the game itself (D3b frames from `-game`, a D3 MRQ render, or live capture of the **packaged**
  build; not a screen capture of PIE), no debug text, no stat overlays, no third-party overlays
- [ ] Gameplay visible by **0:05** (title only as overlay on gameplay; card at the end)
- [ ] Duration **30-60 s** (aim 45-55 s); resolution **>= 1920x1080**; 60 fps; H.264 MP4, yuv420p, AAC
- [ ] **English only**: on-screen text, UI, VO; no mic audio; no music with lyrics in another language
- [ ] No trademarks or third-party IP visible/audible (Unreal logo is the only allowed mark)
- [ ] Audio normalised (loudnorm), no clipping; plays in a browser (faststart)
- [ ] Shows the features judges score: core loop, best visual moment, ending/goal; every 3-6 s something new
- [ ] Watched end-to-end once at full screen before upload; ffprobe confirms specs
- [ ] Captured early (rough cut by day 3) so the deadline-day job is only re-capture + step 4

## B. Sequencer for in-game cinematics (only if scope allows)

- **Level Sequence** asset (`LS_Intro`) holds tracks; actors are bound as **possessables** (placed in level)
  or **spawnables** (sequence spawns/destroys them). Cameras: **Cine Camera Actor** + a **Camera Cut track**
  that says which camera is live when.
- Keyframe Transform channels (`Location.X` ... `Rotation.Z`) on the camera binding; ease/blend via
  section ease-in/out. Cine camera: Filmback / Crop Settings (1.77 = 16:9, 2.39 for scope),
  **Constrain Aspect Ratio** draws black bars = cheap letterbox. Focus: Manual or Tracking (actor).
- **Depth of field: shots only, Cinematic method.** Keep DOF off in gameplay (readability); use it in the intro,
  menus and trailer shots. Cinematic DOF is Epic's "faster, scalable" method (legacy Bokeh "more costly"); it runs
  before TSR at rendering resolution. Keep Cine Camera **Current Aperture** inside Min/Max F-Stop, Focus Method
  Tracking on the subject; blade shapes only at Epic/Cinematic post quality. Debug: Show > Visualize > Depth of Field
  Layers. No Epic cost figure: bench the shot if it runs in-game.
- **Blend to/from gameplay**: right-click Camera Cut track > **Can Blend**, then drag the camera-cut
  section's top corner to blend in/out from the gameplay camera. Section property **Lock Previous Camera**
  stops our camera logic switching mid-blend. Hard cuts also reset Lumen/TSR history (brief shimmer).
- **When finished**: tracks default to **Restore State**; set **Keep State** for things that must stay
  changed (door opened). The Level Sequence actor's own Restore State overrides track Keep State.

Playing it from **C++** (headers verified on disk; module deps `"LevelSequence", "MovieScene"`):

```cpp
#include "LevelSequencePlayer.h"   // ULevelSequencePlayer::CreateLevelSequencePlayer
#include "LevelSequenceActor.h"
// UPROPERTY(EditDefaultsOnly) TObjectPtr<ULevelSequence> IntroSequence;  (set in the BP subclass / DataAsset)
FMovieSceneSequencePlaybackSettings S;
S.bDisableMovementInput = true; S.bDisableLookAtInput = true; S.bHideHud = true; S.bPauseAtEnd = false;
ALevelSequenceActor* SeqActor = nullptr;
ULevelSequencePlayer* Player = ULevelSequencePlayer::CreateLevelSequencePlayer(this, IntroSequence, S, SeqActor);
Player->OnFinished.AddDynamic(this, &AMyGameMode::HandleIntroFinished); // handler must be a UFUNCTION()
Player->Play();
```

- Other player calls: `Pause()`, `Stop()`, `GoToEndAndStop()` (= **skip** button: jumps to final state),
  `SetPlayRate()`, events `OnPlay/OnStop/OnPause/OnFinished` (dynamic multicast). `bHidePlayer`,
  `bDisableCameraCuts`, `LoopCount` also in the settings struct. `OnCameraCut` gives the new camera component.
- Keep gameplay logic in C++; trigger sequence-side moments with an Event track only if needed (Event track
  endpoints are Blueprint: keep them as one-line calls into C++).
- Always give a skip key. Keep intro <= 10 s and ending <= 15 s. A camera move over the playable space at
  start doubles as the opening of the video.
- **Take Recorder** (plugin `Takes`, off by default): Window > Take Recorder, + Source > From Actor,
  record during Play; takes land in `Cinematics/Takes` as sequences. Re-rendering gameplay with new cameras
  in principle works, but gameplay-spawned/pooled actors, Niagara, UI and C++-driven material changes may not
  record faithfully (unverified). **Not worth it in 93 h**: use D3b or the kit capture scripts (A) instead.

### What the agent can script via MCP (AnimationAssistantToolset, Experimental, editor-only)

Source: `Engine\Plugins\Experimental\Toolsets\AnimationAssistantToolset\Content\Python\animation_toolset\toolsets\`.
Run `describe_toolset` first; schemas are strict.

- **SequencerTools** (`sequencer.py`): `create_level_sequence(package_path, asset_name)` (deletes an existing
  asset of the same name!), `open_sequence`, `play/pause/set_playhead_frame`, `set_display_rate`,
  `set_playback_range`, `add_actors` / `add_actors_by_name`, `add_spawnable_from_class`,
  **`create_camera(spawnable)`** (Cine Camera), `add_track_to_binding` / `add_track_to_sequence`, `add_section`,
  `set_section_range`, **`set_camera_cut_binding(section, camera_binding_id)`**, `set_section_ease_in/out`,
  `set_section_completion_mode`, `add_event_trigger_section`, `bake_transform`, folders, tags, copy/paste.
- **SequencerKeyframingTools** (`keyframing.py`): `get_channel_names(section)` (e.g. `Location.X`),
  **`add_key_float(section, channel_name, frame, value, interpolation)`** ("linear", "constant", "auto",
  default smart-auto), `add_key_bool/integer/string`, `get_keys`, `remove_key_at_frame`, `bake_channel_keys`.
- Also: **SequencerOutlinerTools** (mute/solo/lock nodes), **SequencerConditionTools**,
  **SequencerCustomBindingTools** (`convert_to_spawnable/possessable`), **SequencerImportExportTools**
  (FBX in/out), **SequencerControlRigTools**; separate plugin **SequencerAnimMixerToolset**.
- **No MRQ toolset.** Rendering must go through Python (`MoviePipelineQueueSubsystem`, editor) once the MRQ
  plugin is enabled; its classes are absent from a test project's stub because the plugin is off there.
- Typical scripted intro: create sequence -> create_camera -> add Transform track + section -> add_key_float on
  Location/Rotation at frames 0 and N -> add Camera Cut track -> set_camera_cut_binding -> screenshot to verify.

## C. Movie Render Queue / Movie Render Graph in 5.8

- **MRQ** (plugin `MovieRenderPipeline` v1.3, not Beta, **disabled by default**) is the stable offline renderer.
  **Movie Render Graph** is the graph-based successor, labelled **Beta** in the 5.8 docs; presets are
  interchangeable. **Quick Render** (in 5.8) renders the current sequence/viewport in one click with graph defaults.
- 5.8 ships a native **MP4 (H.264) output** (`UMoviePipelineMP4EncoderOutput` / `MovieGraphMP4EncoderNode`,
  Windows Media Foundation): CRF 20 default (16-51), or VBR (8 Mbps avg), High profile, audio on. The docs page
  doesn't list it yet; PNG sequence + ffmpeg remains the safe fallback. Other outputs: EXR/PNG/JPG/BMP,
  ProRes/DNx, WAV, Command Line Encoder (ffmpeg).
- Worth it only for: a trailer-quality flythrough or the intro/ending rendered at higher quality than real time.
  Cost: enabling the plugin = editor restart; renders take minutes; it's another thing to learn.
- **Avoiding Lumen/TAA noise and smear** (settings exist in `MoviePipelineAntiAliasingSetting.h`):
  - Anti-aliasing: Spatial Sample Count 1, **Temporal Sample Count 8** (more = cleaner Lumen + motion blur, slower).
    With temporal samples > 1, Override AA = **None** is the usual choice (unverified for 5.8).
  - **Warm-up** (scripted shots only; a game playing itself inside the render uses none: D3): tick "Use Camera Cut for
    Warm Up" (needs camera-cut section starting before frame 0) or Engine Warm Up Count ~32-64 frames; Render Warm Up
    Count ~32 so Lumen/TSR history and streaming settle (counts unverified; increase if first frames shimmer). Graph
    equivalent: Warm Up node `NumWarmUpFrames`.
  - Game Overrides: Cinematic Quality on, texture streaming fully loaded, LOD0 (`bUseLODZero`), high-quality shadows.
  - Console Variables setting applies cvars only during the render and reverts after.
- Resolution 1920x1080 (or 2560x1440 and let ffmpeg scale). Output frame rate 60 to match gameplay footage.

## D. Trailer recipes (verified on a prototype, 5.8.4)

Routes D2-D3 work best when the game has an **autoplay mode** (the player's side driven by AI or a script, switched
on by a cvar) so it can play itself during a capture or render; worth adding early if the genre allows it. D1 and D4 apply to any game.

### D1. Game audio: record the engine's own mix

Screen recorders don't reliably hear the game. Record the master submix in the engine instead:
- `UAudioMixerBlueprintLibrary::StartRecordingOutput(World, MaxSeconds, nullptr)` when the capture starts,
  `StopRecordingOutput(World, EAudioRecordingExportType::WavFile, Name, Path)` at the end (runtime code, module
  `AudioMixer`; works in a packaged build). The WAV (48 kHz stereo) lands in `Saved/BouncedWavFiles/`. Trigger it from
  a cvar in the game mode and log start/stop lines.
- **Must do:** `au.NeverDisableSubmixes 1` before recording. Silent submixes auto-disable and skip the recording
  append (`AudioMixerSubmix.cpp`), so silence is dropped, not written: without it a 182 s recording came out 6.3 s
  short and the audio drifted out of sync.
- **Sync:** take one anchor from each side for the same moment: a distinctive frame (e.g. a start event or a big
  hit appearing) and the onsets of SFX logged at known times. The first play of a sound is ~0.1 s late (loading),
  later ones a steady ~27 ms, so use the median of the later ones. Checked result: a cue sound within 5 ms of its
  frame, no drift over 135 s.

### D2. Live screen capture (raw footage)

- Use the kit scripts (route 1; they use ffmpeg `ddagrab` under the hood, guarded). Raw `ddagrab` or the NVIDIA App
  are not for agent use (`debugging.md` "Recording the screen safely"). **At 4K the capture drops frames on an RTX
  4060** (~38-56 fps captured while the game ran at 110+): gaps padded with duplicates read as stutter. Capture at
  1440p or 1080p, and count frames and gaps (`ffprobe -count_frames`) before cutting.
- **Recording a whole play session** (e.g. the director's run, for footage to cut from): call `record_window.ps1` in
  segments (300 s each in the rehearsal) and keep each segment's `REC` lines. Line clips up with the game's log by
  `REC first frame`, not `REC start` (ffmpeg's first frame came 0.25-0.35 s after launch). Check the offset once per
  segment on an event the log times and the frames show (a camera cut). Exit code 2 means the game had already
  closed: the session ended, nothing failed.
- **Pick shots from the game's event log, not by watching.** With one log line per notable event (an ability, a
  perfect dodge, a set-piece cut), each event maps to a segment and a second: the rehearsal picked 11 shots from
  13.5 minutes of footage that way.
- Fixed frame rate for captures of a Development build:
  `-ini:Engine:[/Script/Engine.Engine]:bUseFixedFrameRate=True,[/Script/Engine.Engine]:FixedFrameRate=60`
  (works because Development allows ini overrides from the command line; not Shipping).

### D3. MRQ gameplay trailer (best quality, offline)

MRQ renders a Level Sequence, but **the game can play itself inside the MRQ PIE session**, so the sequence only has
to supply the cameras.
- **Game mode:** MRQ's default override is `AMoviePipelineGameMode` (no pawn, no game). Set
  `MoviePipelineGameOverrideSetting.soft_game_mode_override` to the game's own mode. Autoplay cvars set before
  `render_queue_with_executor(MoviePipelinePIEExecutor)` carry into the PIE world.
- **No warm-up:** set `RenderWarmUpCount` and `EngineWarmUpCount` to 0 and `use_camera_cut_for_warm_up` False, or game
  time drifts ahead of sequence time at every cut. Then sequence frame f = world time f/60, so log event times map
  1:1 to frames.
- **Cameras on runtime-spawned actors:** a sequence can't bind actors spawned at runtime. Make a small C++ rig actor
  (follows the player or the action with smoothing, never rotates) as a sequence spawnable, and attach cine cameras
  to it (`MovieScene3DAttachTrack`, keep relative). Keyed offsets are then world-aligned offsets from the action.
- **Sequencer Python (5.8):** spawnables are custom bindings and `get_object_template()` returns None. Spawn a temp
  actor, configure it, `seq.add_spawnable_from_instance(actor)`, destroy the temp (deprecated in favour of
  `LevelSequenceEditorSubsystem.add_spawnable_from_instance(seq, actor)`). Channel names are `unreal.Name` (use
  `str()`); `Rotation.X` = roll, `.Y` = pitch, `.Z` = yaw. Attach: `section.set_constraint_binding_id(
  seq.get_binding_id(rig))`. Camera cut: `add_section()` + `set_camera_binding_id`.
- **Gotcha:** deleting a loaded Level Sequence fails ("Failed to unload all packages") and the following
  `create_asset` opens a modal "Overwrite?" dialog that freezes MCP. Reuse the asset and clear its bindings and tracks.
- **Autoplay runs (AI, physics) aren't deterministic between renders**, even with fixed 1/60 steps. Lay out shots from
  a cheap 960x540 preview, keep fixed world shots with margins, then pick in-points from the final render's frames and
  log.
- AA: 8 temporal samples with Override AA = None gave clean, settled frames with no warm-up.
- Cost: 4K, 8 temporal samples, PNG: ~3 frames/s on an RTX 4060 (160 s of footage in ~52 min) and ~7 MB per frame
  (66 GB): plan the disk. The MRQ render has no game audio (that needs the deterministic audio mixer): add music
  and SFX in the edit, placing hits from the log's event times. MRQ doesn't render the Canvas HUD: draw titles in
  the edit.

### D3b. Offline frame capture in `-game` (no plugin)

Verified in the rehearsal (5.8.4). A 48 s cut of the director's recorded play was rejected as a trailer (desktop
capture of the gameplay camera, with its hitches, the HUD, and shots picked from whatever happened). Re-shot this way
it was accepted: 45 s from six capture runs of 8-34 min each (just under 2 h). Recommended for the trailer when the
game has test hooks that can stage its moments.
- **Launch:** `UnrealEditor.exe <uproject> <Map> -game -windowed -ResX=2560 -ResY=1440 -UseFixedTimeStep -FPS=60
  -nosound -ExecCmds="py <script>"`. `-UseFixedTimeStep` makes every frame exactly 1/60 s of game time however long
  it takes to draw (`UnrealEngine.cpp`), so slow frames don't show.
- **Save every frame:** each frame the script runs `shot filename=<dir>/f_<frame, 5 digits> -nosuffix`
  (`GameViewportClient.cpp`: the viewport at its size, no re-render, so TSR keeps its history). Render settings:
  `scalability 3`, `r.ScreenPercentage 150`, `r.TSR.History.ScreenPercentage 200`, `r.MotionBlurQuality 0`, and
  `showhud` to hide the HUD.
- **Cost:** ~1.9 frames/s at 1440p, limited by the PNG writes (~4.6 MB a frame: plan the disk). Frames outside a
  shot's kept windows still render but skip the write (4.4 frames/s): a 12 s fight with 5 s kept took 2.8 min. Keep
  only the seconds the edit needs.
- **Camera:** Python can't spawn actors in `-game`, so borrow a CameraActor placed in the level (`debugging.md` F) and
  set its pose every frame from a Slate post-tick. A pose set at tick N draws at N+1: lead a moving target by its
  velocity / 60.
- **Action:** a JSON shot list (start pose, the game actions on cue, the camera, the windows to keep) drives the game
  through its own test hooks (in the rehearsal: move input, abilities, the set piece). Log the game's events per frame (action,
  time dilation, enemy states) so the edit can put sound on them.
- **What cost re-shoots:**
  - The game keeps running between shots, so one shot's events spill into the next (enemies following, a respawn's
    teleport and fade). Clear hostile actors near the pawn for shots that aren't fights, end any fall before moving
    the pawn (`debugging.md` F), and stage where the player actually goes.
  - Check a staging point's ground against its subject's: a trace down from a point offset from a group found the
    foot of a cliff, 30 m below the group.
  - A stateful event replays exactly (fixed step, seeded enemies) only from a fresh start: a second take of a fight
    later in the same run met enemies already roused, and a second take of a breakable found it broken. Take each
    stateful shot first in its own run, or give the game a reset hook.
  - Look at each shot's first frames while the batch is still running: the frames land on disk as they go.
- **Framing** (a game with a followed character): aim at that character, not at the action. In the rehearsal a
  follow camera leaning 45% toward an attacker striking from 3-4 m up lost the hero out of the frame; slow height
  smoothing (0.06 a frame) lost the hero on a slope; a front camera on a downhill road filmed the hillside. Dark
  enemies read in silhouette against the sky: a level camera at the hero's height, 4.5 m back, read where a camera
  2.3 m up behind the hero gave blobs (blind critic readability 2/5). Stage fights at the hero's height.
- **Can't do:** the game's audio (`-nosound`; build the mix in the edit from the log's event times, D4) or spawning
  actors from Python. It films the editor build's `-game`, not the packaged build.

### D4. The edit

- Cut on the music's beat grid: find bpm and the first downbeat (onset autocorrelation), express clips as in-points
  plus a length in beats, round cut frames from the grid so cuts never drift.
- Titles that match the in-game HUD: same font (Roboto Bold ships in `Engine/Content/Slate/Fonts`), outline and
  shadow, the same pop animation, drawn onto frames with PIL.
- Audio mix: music + SFX (`adelay`/`amix normalize=0`), a limiter (`alimiter=limit=0.79`) on a float pre-mix, then
  two-pass `loudnorm` to -14 LUFS, TP -1.5. Generated music can already peak near 0 dBFS, so SFX on top clip without
  the limiter and single-pass loudnorm falls back to dynamic mode.
- **MRQ 4K renders only: deliver 4K60 as HEVC (or AV1), never H.264.** (Live captures are 1440p/1080p: D2.) H.264 4K60
  is Level 5.2 and stuttered in the Windows player on an RTX 4060 PC while 1080p played clean. HEVC: `hevc_nvenc
  -preset p7 -cq 18 -profile main -level 5.1 -maxrate 38M -tag:v hvc1` (NVENC refuses Level 5.1 with a max rate above
  40 Mbps). 1080p60: libx264 CRF 16-20, AAC 192k, `+faststart`.
- Check the final file against the submission checklist above (ffprobe), then watch it once **with sound**.

## Kit decisions: fit and contradictions

- C++ gameplay: fine. Sequences are assets; playback from C++ as above. Event-track endpoints are Blueprint
  (flag: keep them as thin calls into C++).
- Lumen path: live capture inherits Lumen ghosting/settling; MRQ temporal samples fix it offline.
- **features.md rule "never first used on jam day"**: MRQ and Take Recorder plugins are off by default, so try
  them in a practice project **before** 2026-11-12 or don't use them. The video routes (D3b frame capture, or the kit
  capture scripts, then ffmpeg) need no plugin.
- Capture live footage at 1440p or 1080p (4K live capture drops frames on an RTX 4060, D2); >= 1080p rule satisfied.
  This is the capture size, not the game's internal render resolution (SETUP 7b).
- Package daily: also record a 20 s test capture from each daily build (doubles as devlog footage).

## Verified against

- The target PC, 2026-10-24: ffmpeg 9.0.2 (libx264, h264_nvenc, aac, loudnorm, drawtext, xfade, concat) - every recipe above
  dry-run to a null output with lavfi test sources (exit 0). NVIDIA App 11.0.9 + ShadowPlay installed (hand use only); OBS not.
- UE 5.8 headers: `LevelSequencePlayer.h` (CreateLevelSequencePlayer, OnCameraCut), `LevelSequenceActor.h`,
  `MovieSceneSequencePlaybackSettings.h`, `MovieSceneSequencePlayer.h`, `MovieSceneCameraCutTrack.h` (bCanBlend),
  MRQ `MoviePipelineAntiAliasingSetting.h`, `MovieGraphWarmUpSettingNode.h`, `MoviePipelineMP4EncoderOutput.h`,
  `MoviePipelineQueueSubsystem.h`, `MovieGraphQuickRenderSettings.h`; `.uplugin` files (MRQ/Takes not enabled by default).
- Toolset sources: `sequencer.py`, `keyframing.py`, `outliner.py`, `conditions.py`, `custom_bindings.py`, `import_export.py`.

## Sources (5.8)

- Cinematics hub: https://dev.epicgames.com/documentation/en-us/unreal-engine/cinematics-and-movie-making-in-unreal-engine?application_version=5.8
- Movie Render Pipeline: https://dev.epicgames.com/documentation/en-us/unreal-engine/movie-render-pipeline-in-unreal-engine?application_version=5.8
- Render settings and formats: https://dev.epicgames.com/documentation/en-us/unreal-engine/cinematic-render-settings-and-formats-in-unreal-engine?application_version=5.8
- MRQ -> MRG: https://dev.epicgames.com/documentation/en-us/unreal-engine/transitioning-to-the-movie-render-graph-from-movie-render-queue-in-unreal-engine?application_version=5.8
- Camera Cut track: https://dev.epicgames.com/documentation/en-us/unreal-engine/cinematic-camera-cut-track-in-unreal-engine?application_version=5.8
- Cinematic cameras: https://dev.epicgames.com/documentation/en-us/unreal-engine/cinematic-cameras-in-unreal-engine?application_version=5.8
- Depth of field / Cinematic DOF: https://dev.epicgames.com/documentation/en-us/unreal-engine/depth-of-field-in-unreal-engine?application_version=5.8 ,
  https://dev.epicgames.com/documentation/en-us/unreal-engine/cinematic-depth-of-field-in-unreal-engine?application_version=5.8
- Play cinematics: https://dev.epicgames.com/documentation/en-us/unreal-engine/play-cinematics-from-blueprints-in-unreal-engine?application_version=5.8
- When a cinematic ends: https://dev.epicgames.com/documentation/en-us/unreal-engine/what-happens-when-my-cinematic-ends-in-unreal-engine?application_version=5.8
- Record gameplay (Take Recorder): https://dev.epicgames.com/documentation/en-us/unreal-engine/record-gameplay-in-unreal-engine?application_version=5.8
- Python in Sequencer: https://dev.epicgames.com/documentation/en-us/unreal-engine/python-scripting-in-sequencer-in-unreal-engine?application_version=5.8

# Cinematics and video capture (UE 5.8.4, GIZMO: RTX 4060)

The submission needs a **30-60 s gameplay video, >= 1920x1080, gameplay in the first 5 s, English only**.
This note covers getting that video with the least risk, then optional in-game cinematics.
Rule of thumb: the video is **real gameplay captured from the packaged build**. Sequencer and Movie Render
Queue are extras for an intro/ending or one or two hero shots, never the critical path.

## A. Getting the gameplay video (ranked for 3am on deadline day)

| # | Route | Use for | Verdict |
|---|---|---|---|
| 1 | **NVIDIA App (ShadowPlay) recording of the packaged build** | The whole video | Installed on GIZMO (NVIDIA App 11.0.9). NVENC, near-zero fps cost. Default |
| 2 | OBS Studio, Game Capture or Display Capture | Same, more control (scenes, audio tracks) | **Not installed.** Install before the jam if wanted (it's a kit tool) |
| 3 | Windows Game Bar (Win+Alt+R) | Emergency fallback | Lower quality control (unverified settings) |
| 4 | Movie Render Queue/Graph from a Level Sequence | Pre-authored trailer shots, intro/ending | Renders **Sequencer**, not live gameplay. Offline, slow, plugin off by default |
| 5 | Take Recorder -> re-render with MRQ | "Gameplay with nicer cameras" | Too fragile for a jam (see B). Skip |
| - | `HighResShot` / legacy "Render Movie" capture | Stills only / legacy | Not for the video |

Why live capture wins: it shows exactly what judges will play, costs zero engine work, and works on the
packaged build we make daily anyway. MRQ cannot record a player playing; it only renders a sequence.

### Capture settings (NVIDIA App / OBS)

- Run the **packaged Development build**, fullscreen at **2560x1440** (our internal target) or 1920x1080.
  Capturing at 1440p and downscaling to 1080p in ffmpeg looks sharper than native 1080p capture.
  Windowed launch for testing: `MyGame.exe -windowed -ResX=1920 -ResY=1080` (unverified for 5.8).
- **60 fps, H.264 (or HEVC), high bitrate**: 50+ Mbps at 1440p60 / 30+ Mbps at 1080p60. The capture is the
  master; ffmpeg makes the small upload file. NVIDIA App: Alt+Z overlay > Record > settings; Alt+F9 start/stop
  (default hotkeys, unverified for this app version). Set "Resolution: In-game", frame rate 60, bitrate max.
- Audio: game audio only. **Mic off** (English-only rule; no accidental talking). OBS: one track, 48 kHz.
- Before recording, in the game console (Development build has `~`): `stat none`,
  `DisableAllScreenMessages` (hides `AddOnScreenDebugMessage` spam; unverified name in 5.8). No FPS counter.
- No trademarks/third-party IP on screen: close overlays (Discord, Steam, NVIDIA perf HUD) before recording.
- Record **many short takes (20-60 s each)** of the best moments, not one long run. Name them `take01.mp4`...
- Lumen settles over ~1 s after a level loads or a hard camera jump (GI/reflection history rebuilds).
  Start recording a couple of seconds after spawn and trim the head (unverified exact time; just look).

### ffmpeg recipes (ffmpeg 9.0.2, Gyan full build; every filter/flag below was dry-run on GIZMO)

PowerShell. Set the path once per shell:

```powershell
$ff = (Get-ChildItem "$env:LOCALAPPDATA\Microsoft\WinGet\Packages\Gyan.FFmpeg*\*\bin\ffmpeg.exe" | select -First 1).FullName
$fp = $ff -replace 'ffmpeg.exe','ffprobe.exe'
& $fp -hide_banner take01.mp4          # check resolution, fps, audio present
```

1) **Cut a clip** (re-encode = frame accurate; normalises every clip to 1080p60/yuv420p/48 kHz stereo so they
concatenate cleanly). `-ss` = start, `-t` = length:

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
`-maxrate 12M` keeps 60 s under ~90 MB; `+faststart` puts the index first for web players.

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
fine) or similar, so file size is not a constraint. Keep `-maxrate` high for quality; YouTube re-encodes anyway.

### Submission video checklist

- [ ] Captured from the **packaged** build (not PIE), no debug text, no stat overlays, no third-party overlays
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
  record faithfully (unverified). **Not worth it in 93 h**: capture live instead.

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
  plugin is enabled; its classes are absent from the SmokeTest stub because the plugin is off there.
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
  - **Warm-up**: tick "Use Camera Cut for Warm Up" (needs camera-cut section starting before frame 0) or Engine
    Warm Up Count ~32-64 frames; Render Warm Up Count ~32 so Lumen/TSR history and streaming settle
    (counts unverified; increase if first frames shimmer). Graph equivalent: Warm Up node `NumWarmUpFrames`.
  - Game Overrides: Cinematic Quality on, texture streaming fully loaded, LOD0 (`bUseLODZero`), high-quality shadows.
  - Console Variables setting applies cvars only during the render and reverts after.
- Resolution 1920x1080 (or 2560x1440 and let ffmpeg scale). Output frame rate 60 to match gameplay footage.

## Kit decisions: fit and contradictions

- C++ gameplay: fine. Sequences are assets; playback from C++ as above. Event-track endpoints are Blueprint
  (flag: keep them as thin calls into C++).
- Lumen-only: live capture inherits Lumen ghosting/settling; MRQ warm-up/temporal samples fix it offline.
- **features.md rule "never first used on jam day"**: MRQ and Take Recorder plugins are off by default, so try
  them in SmokeTest **before** 2026-11-12 or don't use them. The video route (NVIDIA App + ffmpeg) needs no plugin.
- "1440p internal at 60 fps": capture at 1440p and downscale; >= 1080p rule satisfied.
- Package daily: also record a 20 s test capture from each daily build (doubles as devlog footage).

## Verified against

- GIZMO 2026-10-24: ffmpeg 9.0.2 (libx264, h264_nvenc, aac, loudnorm, drawtext, xfade, concat) - every recipe above
  dry-run to a null output with lavfi test sources (exit 0). NVIDIA App 11.0.9 + ShadowPlay installed; OBS not.
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
- Play cinematics: https://dev.epicgames.com/documentation/en-us/unreal-engine/play-cinematics-from-blueprints-in-unreal-engine?application_version=5.8
- When a cinematic ends: https://dev.epicgames.com/documentation/en-us/unreal-engine/what-happens-when-my-cinematic-ends-in-unreal-engine?application_version=5.8
- Record gameplay (Take Recorder): https://dev.epicgames.com/documentation/en-us/unreal-engine/record-gameplay-in-unreal-engine?application_version=5.8
- Python in Sequencer: https://dev.epicgames.com/documentation/en-us/unreal-engine/python-scripting-in-sequencer-in-unreal-engine?application_version=5.8

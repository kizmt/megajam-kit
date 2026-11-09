# Audio and UI (UE 5.8.4)

Audio is a judged category: cheap wins are variation (no sound repeats identically), correct 3D placement,
no spam, music that fades instead of cutting, and working volume sliders. UI must be readable, event-driven, and
never leave the player stuck without a cursor. Logic in C++; WBP_/MSS_ assets are layout/sound-design wrappers.

## Audio

### Playing sounds from C++ (`Kismet/GameplayStatics.h`, 5.8.4 signatures)

| Need | Call | Returns |
|---|---|---|
| UI click, stinger, non-positional | `PlaySound2D(this, Sound, Vol, Pitch, StartTime, Concurrency, OwningActor, bIsUISound=true)` | nothing |
| One-shot at a point (impact, pickup) | `PlaySoundAtLocation(this, Sound, Loc, Vol, Pitch, StartTime, Attenuation, Concurrency, InitialParams)` | nothing |
| Follows an actor (engine hum, footsteps loop) | `SpawnSoundAttached(Sound, Comp, Socket, ...)` | `UAudioComponent*` |
| 2D you need to control later (music, ambience) | `SpawnSound2D(this, Sound, Vol, Pitch, Start, Concurrency, bPersistAcrossLevelTransition, bAutoDestroy)` | `UAudioComponent*` |

- `PlaySound*` is fire-and-forget: you can't stop it or set parameters afterwards. If you need to, use `Spawn*`
  (or pass `UInitialActiveSoundParams` to `PlaySoundAtLocation` for start-time parameters).
- **`PlaySound2D` defaults `bIsUISound = true`, so the sound keeps playing while the game is paused.** Pass `false`
  for gameplay 2D sounds. Same flag exists on `UAudioComponent::bIsUISound` and `USoundClass`.
- Spawned components default to `bAutoDestroy = true`: don't keep a raw pointer to them; keep `UPROPERTY()
  TObjectPtr<UAudioComponent>` and spawn with `bAutoDestroy=false` for anything you reuse (music).
- Load sound refs as `UPROPERTY(EditDefaultsOnly) TObjectPtr<USoundBase>` on a data asset (`DA_Audio`) or the actor's
  BP defaults. `USoundBase` accepts SoundWave, Sound Cue and MetaSound Source alike, so designers can swap one for another.

### Music (`UAudioComponent`)

```cpp
// Crossfade: old fades out (and stops), new fades in. FadeOut(Duration, TargetVolume, Curve).
if (MusicComp) MusicComp->FadeOut(1.5f, 0.f);
MusicComp = UGameplayStatics::SpawnSound2D(this, NewTrack, 1.f, 1.f, 0.f, nullptr,
                                           /*bPersistAcrossLevelTransition*/ false, /*bAutoDestroy*/ false);
if (MusicComp) { MusicComp->bIsUISound = false; MusicComp->FadeIn(1.5f, 1.f); }
```
- Other useful calls: `AdjustVolume(Duration, Level)` (duck music under VO), `SetPaused(bool)`, `Stop()`,
  `SetVolumeMultiplier`, `SetPitchMultiplier`. Music loops because `bLooping` is set on the SoundWave by our tool.
- **Stems that must stay in sync go in one MetaSound, not in several audio components.** `MSS_Music` (OneShot
  interface removed): `On Play` starts every `Wave Player (Stereo)` with `Loop` on; each stem's gain is a `Map Range`
  of a float input `Intensity`, smoothed by `InterpTo` (`Interp Time` ~1-2 s, so a jump fades instead of clicking),
  into a `Stereo Mixer` (or `Crossfade` for a 2-8-way blend). Stems from one ElevenLabs track share one length, so
  they loop together. From C++: `MusicComp->SetFloatParameter(TEXT("Intensity"), X)` on change only.

### Beat-synced transitions and stingers (Quartz)

- **Quartz plays a sound on a beat or bar, sample-accurate.** A plain play call lands at the next audio buffer
  (Epic's example: up to 43 ms at 2048 samples/48 kHz, plus ~13 ms thread latency, plus any game-thread hitch). Core
  engine (AudioMixer module), no plugin. Use it for stingers, cue changes and beat-locked visuals.
- **C++:** `UQuartzSubsystem::Get(World)->CreateNewClock(this, TEXT("Music"), Settings,
  bOverrideSettingsIfClockExists, bUseAudioEngineClockManager)` returns a `UQuartzClockHandle*`
  (`Quartz/QuartzSubsystem.h`); on the handle: `SetBeatsPerMinute`, `StartClock`, `StopClock`,
  `SubscribeToQuantizationEvent`, `GetBeatProgressPercent` (drive a pulse material). All but the last take the world
  context and the handle itself as a `ClockHandle&` out-param (pass the member); `SetBeatsPerMinute` also takes a
  boundary and a delegate; `GetBeatProgressPercent(Boundary, PhaseOffset, MsOffset)` takes neither. Then
  `MusicComp->PlayQuantized(this, Clock, Boundary, FOnQuartzCommandEventBP(), StartTime, FadeInDuration,
  FadeVolumeLevel, FadeCurve)` (*verified* in 5.8.4's `AudioComponent.h`; pass all eight). Boundary
  (`Sound/QuartzQuantizationUtilities.h`): `FQuartzQuantizationBoundary(EQuartzCommandQuantization::Bar, 1.f,
  EQuarztQuantizationReference::TransportRelative, true)`; **the enum really is spelled `Quarzt`**.
- **Recipe:** at level start create clock `Music` at the cue's BPM (4/4 is the default), start it, then
  `PlayQuantized(..., Bar)` the music so bar 1 of the track is bar 1 of the clock. A stinger is a second component
  (`SpawnSound2D`, `bAutoDestroy=false`) played on the next Beat or Bar; a cue change is a `FadeOut` from a Bar
  subscription plus the next cue's `PlayQuantized(..., Bar)` with a fade-in. Turn on `bCanPlayMultipleInstances`
  on a component you `PlayQuantized` repeatedly (or each play cuts the last), keep clock and components in
  `UPROPERTY()`, and spell the clock name the same everywhere.
- **The clock trusts the BPM you give it.** Generated music holds a stated BPM only "closely" (`../elevenlabs.md`):
  with a composition plan, a whole-bar loop chunk's `duration_ms` gives the exact BPM; otherwise measure the loop
  length. A 1% error drifts a beat in about 25 s at 72 BPM (our arithmetic).
- **Skip Harmonix** (Music Clock, MIDI, Fusion sampler): Experimental in 5.8, plugin off. Quartz covers jam needs.

### Attenuation and spatialization (`USoundAttenuation`, `ATT_`)

- Make 3-4 shared assets (`ATT_Small` ~1500 uu, `ATT_Medium`, `ATT_Large`, `ATT_Ambient`) and pass them to
  `PlaySoundAtLocation`/`SpawnSoundAttached` or set them on the sound asset. No attenuation = sound is 2D everywhere.
- Key fields: `bSpatialize` ("Enable Spatialization"), `SpatializationAlgorithm`, `StereoSpread` ("3D Stereo Spread":
  distance between L/R when a stereo asset is spatialized), `NonSpatializedRadiusStart/End` (blend to non-spatialized
  when the listener is close: good for big sources like waterfalls), `bEnableOcclusion` (costs line traces; leave off).
- **Falloff per sound type:** `Linear` (default) for big background sounds, `Logarithmic` for spot sounds that need
  sharp positioning, `Natural Sound` in between (adds `dB Attenuation At Max`), `Log Reverse` stays loud over
  distance. Box shape suits room tone. **Enable Air Absorption** (`bAttenuateWithLPF`; Epic: min/max distance =
  inner radius/falloff distance) is the cheap distance cue: put it on `ATT_Medium`/`ATT_Large`.
- **Occlusion only for 1-2 key sounds** that must muffle behind walls: `bEnableOcclusion` on their own attenuation
  asset, a custom Audio trace channel rather than Visibility, `Occlusion Low Pass Filter Frequency` and
  `Occlusion Volume Attenuation`; simple collision is "significantly cheaper" than complex. A/B with
  `au.DisableOcclusion 1`.
- **Listener Focus** (`Focus Volume Attenuation` > 1) lifts sounds in front of the camera and dims those behind: a
  free clarity win for whatever the player must hear (an enemy telegraph, a speaking NPC, a puzzle cue).
- **PC spatialisation: keep the default panning** (`SPATIALIZATION_Default`). HRTF needs a spatialization plugin
  and binaural "breaks down" on stereo speakers. Epic recommends Project Settings > Audio > Panning Method = Equal
  Power (no loudness dip between speakers); check the 5.8.4 default.
- **5.8 changed the Windows audio backend to WASAPI** (`AudioMixerWasapi`, handles device swaps), from XAudio2. If
  audio misbehaves on a test PC, try `[Audio] AudioMixerModuleName=AudioMixerXAudio2` in
  `Config/Windows/WindowsEngine.ini` (unverified in 5.8.4).
- **`gen/audio.ts` outputs stereo by default.** A spatialized stereo sound is placed as two emitters spread
  `StereoSpread` apart, and Epic applies a 6 dB cut to spatialized stereo ("Normalize 3D Stereo Sounds"). Result:
  vaguer position and quieter than expected. Rule: **3D one-shots (impacts, footsteps, enemy barks) should be mono** -
  generate them with `node gen/audio.ts sfx ... --mono` (also halves memory). Keep stereo for music, UI, 2D stingers
  and wide ambient beds. (Mono-for-3D is our rule; Epic's attenuation page describes the stereo behaviour but makes
  no recommendation.)
- **Several ambience beds of one loop don't crossfade: they sum in phase.** Beds that all start at BeginPlay stay
  sample-aligned, so where two are at full gain the same loop plays 6 dB louder (seen in the rehearsal with five
  `AmbientSound` beds of 120 m inner radius; `au.DumpActiveSounds` listed both). In a game the player walks through,
  a winding route also brings beds that aren't neighbours into range: lay the beds along the route and choose each
  one's inner radius and falloff so the summed linear gain stays about 1 along the walk; fit it numerically on the
  route's polyline (a short script does it in seconds). Otherwise fit it at the places the listener can be. Then check
  with `au.DumpActiveSounds` at the overlaps.

### Concurrency (stop spam) (`USoundConcurrency`, `SCON_`)

- Asset with `FSoundConcurrencySettings`: `MaxCount`, `bLimitToOwner`, `ResolutionRule` (default
  `StopFarthestThenOldest`; others: `PreventNew`, `StopOldest`, `StopLowestPriority`, `StopQuietest`, ...),
  `RetriggerTime` (minimum seconds between starts: kills machine-gun spam), volume scaling.
- Typical: footsteps MaxCount 4 + bLimitToOwner; impacts MaxCount 6 StopOldest, RetriggerTime 0.05; UI click MaxCount 1
  StopOldest. Assign on the sound asset or pass as the `ConcurrencySettings` argument.

### Volume sliders (Sound Classes + Sound Mix)

- Create `SCL_Master` with children `SCL_Music`, `SCL_SFX`, `SCL_Voice`, `SCL_UI`; set the class on every sound asset
  (in the editor, or a short editor script setting `sound_class_object` per folder; the kit's import doesn't set it).
  One `MIX_Settings` sound mix.
```cpp
// On slider change (Volume 0..1). Fade 0 so the slider feels immediate.
UGameplayStatics::SetSoundMixClassOverride(this, MIX_Settings, SCL_Music, Volume, 1.f, /*FadeIn*/ 0.f, /*bApplyToChildren*/ true);
UGameplayStatics::PushSoundMixModifier(this, MIX_Settings); // pushing again is harmless; Pop to remove
```
- Persist the values in a `USaveGame` and re-apply on startup. Audio Modulation (Control Buses) is the more modern
  system but the plugin is off by default: not worth it for a jam. Epic now calls Sound Classes, Mixes and Cues
  "legacy" (supported, not removed); the choice stands. If you do use Modulation: put buses on Sound Classes, list
  every bus on each class (the hierarchy is ignored), MetaSound sources need Volume Routing = Union.
- **Project Settings > Audio > Default Sound Class** is assigned to newly created sounds: point it at `SCL_SFX`
  before a big SFX import and fewer assets need fixing by script.

### Ducking music under voice

- **Cheapest: a Passive Sound Mix Modifier on the voice class.** `SCL_Voice` > Passive Sound Mix Modifiers >
  `MIX_DuckMusic`, active automatically while a voice sound plays. The mix has one adjuster (`SCL_Music`, volume
  ~0.4-0.5, apply to children), fade in ~0.2 s, out ~0.6 s. The modifier is active only between its
  `min_volume_threshold` and `max_volume_threshold`: set both (for example 0.1 and 10). No plugin, no C++.
- **Built by Python, set every struct field and read the asset back.** Epic's Python reference shows
  `SoundClassAdjuster(volume_adjuster=0.0, ...)` and `PassiveSoundMixModifier(max_volume_threshold=0.0, ...)`; a
  field left at 0 mutes the class or never fires (5.7 Python page; unverified in 5.8.4).
- **If the passive duck pumps, sidechain on submixes:** music to `SM_Music`, voice to `SM_Voice` (sound asset
  `Submix` or the class's `Default Submix`); on `SM_Music` a Submix Effect Dynamics Processor preset with
  `KeySource = Submix`, `ExternalSubmix = SM_Voice` (`FSubmixEffectDynamicsProcessorSettings`). Start at
  `ThresholdDb` -30, `Ratio` 4, attack 10 ms, release 400 ms (our numbers); `bKeyAudition` plays the key to debug.
  An unconnected submix outputs to the Master Submix; don't use a submix's Output Volume for game volume (Epic).
- **A stuck duck** (music suddenly inaudible): `au.Debug.SoundMixes 1` lists the active mixes.

### MetaSounds vs Sound Cues

- **Prefer MetaSounds (`MSS_`) for anything beyond "play this wave"**; play plain SoundWaves directly otherwise.
  Sound Cues (`SC_`) still work in 5.8 (not deprecated; Epic calls them "legacy", with MetaSounds at feature
  parity) but add nothing we need.
- **Exception: random variants made by script.** A Sound Cue from `SoundCueFactoryNew` with `initial_sound_waves`
  set to 2+ waves comes out wired under a Random node in one factory call (`SoundCueFactoryNew.cpp`); a MetaSound
  needs its graph built node by node.
- Status: the 5.8 Metasound plugin descriptor is `IsBetaVersion: false`, enabled by default; Epic's MetaSounds Quick
  Start page still carries a Beta caution. Treat as usable; test in the packaged build.
- Jam uses: random pick from a wave array (Random Get node) + random pitch/volume (~0.95-1.05) for footsteps/impacts;
  layered sounds (click + body + tail); looping ambience with a float input; adaptive music via inputs/triggers.
  Presets let one graph serve many sounds with different inputs.
- **Variation nodes:** `Random Get` (array; `Seed` -1 = time, `No Repeats`, optional `Weights`), `Shuffle` (plays
  every item before repeating), `Random` Float/Int (`Min`/`Max`) for pitch and volume jitter; `Decibels To Linear
  Gain` lets an input be in dB. Wave Player outputs: `On Finished`, `On Nearly Finished` (Epic's use: pick the next
  variation), `On Looped`, `Loop Percent`, `On Cue Point`.
- **Gameplay can only drive graph Inputs, not Variables** (variable changes aren't registered while playing, and
  C++ can't reach them). Constructor pins are fixed once play starts: cheaper for per-preset values.
- Graph basics: `On Play` trigger in, audio out (`Out Mono`; set Output Format to Stereo for `Out Left/Right`).
  One-shots use the **OneShot interface: wire the Wave Player's `On Finished` to the `On Finished` output**; Epic:
  "If the On Finished node is not triggered, the MetaSound will play indefinitely" (and holds a voice).
  Looping music/ambience: remove the OneShot interface.
- **Interfaces:** `UE.Attenuation` adds a `Distance` input (cross-fade a near/far layer in one graph);
  `UE.Spatialization` adds `Azimuth` and `Elevation`. 5.8's new MetaSound features (Templates, Wave Player 2.0, CAT
  Mixer, Grain Player) are Experimental: don't build on them.
- From C++ a MetaSound Source (`UMetaSoundSource : USoundWaveProcedural`) is just a `USoundBase`: same play calls.
  Parameters go through the audio component (`IAudioParameterControllerInterface`):
```cpp
UAudioComponent* C = UGameplayStatics::SpawnSoundAttached(MSS_Engine, GetRootComponent());
C->SetFloatParameter(TEXT("Speed"), Speed);   // also SetIntParameter, SetBoolParameter, SetObjectParameter
C->SetTriggerParameter(TEXT("Explode"));     // fires a Trigger input
```
  Names must match the graph input exactly (silent no-op otherwise;
  `au.MetaSound.Parameter.EnableWarningOnIgnoredParameter 1` logs ignored ones in development). Set on change, not
  every tick.

### Reverb, voices, memory

- Reverb, cheapest: an Audio Volume actor with a reverb effect for interiors. Skip submix effect chains. **Sounds
  need a reverb send or the volume seems to do nothing:** 3D sounds via attenuation `Enable Reverb Send`, 2D sounds
  via the Sound Class `Default 2D Reverb Send Amount`. Overlapping volumes need distinct `Priority` (smaller space
  higher). To muffle the outside when indoors: the volume's Ambient Zone `Exterior Volume`/`Exterior LPF`, and the
  sounds' class needs **Apply Ambient Volumes**. Audio Gameplay Volumes (Beta, plugin off) aren't needed.
- Voice budget: `FAudioQualitySettings::MaxChannels` defaults to 32 (Project Settings > Audio > Quality). Concurrency +
  attenuation (inaudible sounds get virtualized) keep you under it; raise only if sounds audibly drop out.
- Debug (all found in the 5.8.4 source): `au.3dVisualize.Enabled 1` (+ `.ActiveSounds`, `.Attenuation`),
  `au.Debug.Sounds 1`, `au.Debug.SoundMixes 1`, `au.Debug.SoundReverb 1`, `au.DumpActiveSounds`,
  `au.BypassAllSubmixEffects`, `au.ClearMutesAndSolos`. (Epic's page also lists `au.Debug.AudioMemReport`, which is
  not in the 5.8.4 source; `stat soundwaves` is untested.)
- **Measure the game's loudness in Audio Insights** (Production Ready in 5.8, on by default): Tools > Audio
  Insights, check Monitoring is green, Reset, then PIE a full run. The Loudness tab (editor only) shows Momentary,
  Short Term and Integrated LUFS, loudness range and true peak of the final mix; set the target and peak limit in
  its Settings. The Events tab lists every sound start/stop. Target: `../design.md` "Audio and pacing".
- **Proving sounds play, with no microphone or listening** (tested in `-game`): a screen recorder captures video only,
  and `unreal.AudioMixerBlueprintLibrary` is missing from Python in `-game`, but the main submix has the same calls:
  `sm = unreal.load_asset('/Engine/EngineSounds/Submixes/MasterSubmixDefault')`,
  `sm.start_recording_output(world, secs)`, then
  `sm.stop_recording_output(world, unreal.AudioRecordingExportType.WAV_FILE, name, folder)`. The game must still be
  running at stop (record a few seconds less than the clip). Check the WAV's 100 ms RMS around each logged event
  (it jumped 8-12 dB at every swing, hit and kill), then listen. The WAV can also be muxed onto the clip, lined up
  by the log's start time. Set `au.NeverDisableSubmixes 1` first or silence is dropped and the WAV drifts
  (`cinematics-video.md` D1).
- Music/long VO: stream cache loading behaviour `ESoundWaveLoadingBehavior` (`Inherited`, `RetainOnLoad`, `PrimeOnLoad`,
  `LoadOnDemand`, `ForceInline`). Set music to **Load On Demand** (set on the SoundWave or its Sound Class); short SFX
  can stay default. Compression is per wave (`ESoundAssetCompressionType`: BinkAudio, RADAudio, ADPCM, PCM, Opus,
  PlatformSpecific, ProjectDefined) with a 1-100 quality; defaults are fine, lower music quality if the zip is tight.
- `UGameplayStatics::PrimeSound(Sound)` pre-loads the first chunk of a sound you are about to play (boss music).

## UI

### C++ base + Widget Blueprint (BindWidget)

```cpp
UCLASS(Abstract)
class UMyHUDWidget : public UUserWidget
{
    GENERATED_BODY()
public:
    void SetPrompt(const FText& Text);           // called by gameplay on change
protected:
    virtual void NativeOnInitialized() override; // bind button delegates here (runs once)
    UPROPERTY(meta = (BindWidget))          TObjectPtr<UTextBlock>   PromptText;  // WBP must have a TextBlock named PromptText
    UPROPERTY(meta = (BindWidgetOptional))  TObjectPtr<UProgressBar> HealthBar;
    UPROPERTY(Transient, meta = (BindWidgetAnim)) TObjectPtr<UWidgetAnimation> PromptFadeIn;
};
```
- Build.cs: `"UMG"`, plus `"Slate", "SlateCore"` (for `TakeWidget()`/input modes).
- `WBP_HUD` reparented to `UMyHUDWidget`; the widget **name and type must match** the property or the WBP fails to
  compile (`BindWidgetOptional` / `BindWidgetAnimOptional` allow missing). Mark those widgets "Is Variable".
- Buttons: `Button->OnClicked.AddDynamic(this, &ThisClass::HandleX)` in `NativeOnInitialized` (handler is a
  `UFUNCTION()`). Not in `NativeConstruct`, which runs again every time the widget is re-added (double bindings).
- Text is `FText`, English only: `FText::FromString`/`INVTEXT("...")` is fine; no localization tables.

### Creating widgets and input modes

- Own UI in the PlayerController (or AHUD): `UPROPERTY(EditDefaultsOnly) TSubclassOf<UMyHUDWidget> HUDClass;` set
  in `BP_PlayerController`. In `BeginPlay`, only if `IsLocalController()`:
  `HUD = CreateWidget<UMyHUDWidget>(this, HUDClass); HUD->AddToViewport(0);` Menus use higher Z (pause 10).
  Keep the pointer as `UPROPERTY()`; hide/show with `SetVisibility` rather than recreating.
- Input mode structs (`PlayerController.h`): `FInputModeGameOnly`, `FInputModeUIOnly`, `FInputModeGameAndUI`.
```cpp
// Open pause menu
FInputModeGameAndUI Mode;                      // UIOnly would block our IA_Pause, so Esc couldn't close it
Mode.SetWidgetToFocus(PauseMenu->TakeWidget()); // widget must be focusable (SetIsFocusable(true) in ctor/defaults)
Mode.SetLockMouseToViewportBehavior(EMouseLockMode::DoNotLock);
SetInputMode(Mode); SetShowMouseCursor(true); SetPause(true);
// Close: SetInputMode(FInputModeGameOnly()); SetShowMouseCursor(false); SetPause(false);
```
- **`IA_Pause` needs `bTriggerWhenPaused = true`** (InputAction asset) or it can't unpause. Every path that hides a
  menu must restore GameOnly + hide cursor, or the player is stuck (classic jam bug, test it in the packaged build).
- Main menu: separate `L_MainMenu` map (or a state of `Main`) with `WBP_MainMenu` + UIOnly + cursor; Play =
  `UGameplayStatics::OpenLevel`. Add Settings ("Settings menu" below) and Quit (`UKismetSystemLibrary::QuitGame`).
- **In UIOnly, Esc and Start never reach `IA_Pause`** (Slate has the keys). Use GameAndUI (as above), or handle
  `EKeys::Escape`, `EKeys::Gamepad_Special_Right` and `EKeys::Gamepad_FaceButton_Right` (B = back) in the menu
  widget's `NativeOnKeyDown`. The UIOnly title screen and sub-menus need this for Back.

### Gamepad menus and device prompts

- **Plain UMG works with a gamepad through Slate focus.** The D-pad and left stick move focus between focusable
  widgets; the bottom face button clicks the focused button. So **every menu focuses its first button when it
  opens** (`Mode.SetWidgetToFocus(FirstButton->TakeWidget())`, or `UWidgetBlueprintLibrary::SetInputMode_UIOnlyEx(PC,
  FirstButton, MouseLockMode, bFlushInput)`) and again when the player switches to the pad: a mouse click on empty
  space drops focus and leaves the pad dead. After closing a menu, `UWidgetBlueprintLibrary::SetFocusToGameViewport()`.
- **Show which button has focus.** `UButton`'s style has Normal/Hovered/Pressed/Disabled but no Focused state
  (unverified in 5.8.4). Override `NativeOnAddedToFocusPath` / `NativeOnRemovedFromFocusPath` on the menu-button
  widget to show the hovered look. Then set Project Settings > User Interface > Render Focus Rule
  (`UUserInterfaceSettings::RenderFocusRule`) to Never to hide Slate's dashed focus box.
- **Track the last device used.** Prompts, cursor and focus all follow it. Default: about 40 lines of our own, an
  `IInputProcessor` registered with `FSlateApplication::Get().RegisterInputPreProcessor` that sets `bUsingGamepad`
  from `FKey::IsGamepadKey()` on key down or analog input above ~0.3, clears it on mouse move or a keyboard key, and
  broadcasts only on change. Alternative: enable CommonUI for its `CommonInput` module only and read
  `UCommonInputSubsystem::Get(LocalPlayer)->GetCurrentInputType()` / `OnInputMethodChangedNative`; whether it works
  without `CommonGameViewportClient` is unverified, so test it in PIE before relying on it.
- **Cursor rules (Windows).** Gameplay: GameOnly, cursor hidden. Menus: cursor shown, hidden while the pad is the last
  device. Project Settings > Input (`UInputSettings`) has `DefaultViewportMouseCaptureMode`,
  `DefaultViewportMouseLockMode`, `bCaptureMouseOnLaunch`, and `bShouldFlushPressedKeysOnViewportFocusLost` (stops a
  key held through alt-tab from sticking). Test alt-tab in play and on the pause menu in the packaged build.
- **Prompts show the real key** from the active mappings (`gameplay.md` "Enhanced Input", `QueryKeysMappedToAction`):
  key text for keyboard, a small icon map for the pad, rebuilt when the device changes.

### HUD and interaction prompt

- Event-driven: the interaction component (timer/overlap, not tick) calls `HUD->SetPrompt(...)` only when the
  focused interactable changes; empty text = collapsed. Health etc. via delegates (`OnHealthChanged`).
- **No designer property Bindings ("Create Binding")**: they're evaluated every frame on the game thread. Push values
  on change. Avoid `NativeTick` on widgets for the same reason.
- World-space prompt over an object: `UWidgetComponent` with Space = Screen; one shared instance moved to the target.
- Animations: author in the WBP, expose via `BindWidgetAnim`, play with
  `PlayAnimation(Anim, StartAt, NumLoops, EUMGSequencePlayMode::Forward, Speed)`. Use for prompt fade / damage flash.

### Layout, fonts, DPI

- Design at 1920x1080; anchor HUD elements to corners/edges, menus centred. Default DPI scale rule is
  `ShortestSide` (BaseEngine.ini) so the UI scales with resolution; check 1440p and 4K in PIE ("Screen Size" preview).
- Import one TTF/OTF as a Font asset and use it everywhere; size 18+ for body text, outline/shadow for text over 3D.
  No dialog from Python: `FontFileImportFactory` with `batch_create_font_asset = unreal.BatchCreateFontAsset.NO`
  imports a TTF as a font face (`FF_`, `naming.md`).
- **Slate font sizes are points at 96 DPI, mockup sizes are pixels: pt = px x 0.75** (`FontConstants::RenderDPI` in
  `SlateFontInfo.h`). The rehearsal put PIL mockup pixel sizes straight into `FSlateFontInfo`: every text came out 1.33x
  (a title 882 px wide against 660), panels grew to fit, and the blind critic scored the game well under the mockup.
  Keep the data in mockup pixels, convert in one font helper, and compare one measured text width between the mockup
  and the first capture.
- **UI textures drawn at more than one size need mips.** `TEXTUREGROUP_UI` defaults to no mipmaps, so a key-cap icon
  drawn at a third of its size aliased. Import UI textures with `compression_settings = TC_EDITOR_ICON` (the Python
  name of UserInterface2D), `lod_group = TEXTUREGROUP_UI`, `mip_gen_settings = TMGS_SIMPLE_AVERAGE`,
  `never_stream = True`, sRGB on, clamp addressing.

### CommonUI and Viewmodel: skip for the jam

- CommonUI (plugin, off by default, not beta) brings activatable widget stacks, input routing and gamepad
  navigation, but requires `CommonGameViewportClient` and its own widget classes; for its **Enhanced Input support**
  Epic's 5.8 page says "We do not recommend attempting to ship titles with this feature at this time", and our input
  is Enhanced Input only. Setup is also heavy: a `CommonUIInputData` asset (Click/Back), a
  `CommonInputBaseControllerData` per device for icons (its Gamepad Name must match the Default Gamepad Name exactly
  or no icons show), an action data table and style assets, because Common widgets lack UMG's inline styles. Allow
  half a day or more. Plain UMG with Slate focus ("Gamepad menus and device prompts") is enough for a few menus.
- UMG Viewmodel (ModelViewViewModel plugin, `IsBetaVersion: true`, off by default): `UMVVMViewModelBase` +
  `UE_MVVM_SET_PROPERTY_VALUE` give change-driven bindings. Nice, but setter functions on our C++ widget already avoid
  per-frame bindings with fewer moving parts.

### Settings menu (`UGameUserSettings`)

- **Calls** (`UGameUserSettings::GetGameUserSettings()`): `SetOverallScalabilityLevel(0-4)` (Low..Cinematic);
  per-group `SetShadowQuality`, `SetGlobalIlluminationQuality`, `SetReflectionQuality`, ... (0-4);
  `SetResolutionScaleNormalized` / `GetResolutionScaleInformationEx(Normalized, Value, Min, Max)`;
  `SetFrameRateLimit` (0 = no limit); `SetVSyncEnabled`; `SetFullscreenMode(EWindowMode::...)`;
  `SetScreenResolution`; `IsDirty()`; `SetToDefaults()`; `ApplySettings(bool bCheckForCommandLineOverrides)`.
- **`ApplySettings` already saves** (Epic: it "applies all current user settings and saves them to permanent
  storage"). Call `ApplySettings(false)` from the menu, so the bench's `-ResX`/`-windowed` command-line overrides
  aren't written into the player's ini.
- **The shipped mix reads as "Custom".** We ship mixed groups (`performance.md` "The bar"), so
  `GetOverallScalabilityLevel()` returns -1. The preset list needs a **Recommended** entry that re-applies the
  shipped per-group values (not `SetOverallScalabilityLevel(3)`), and shows "Custom" once the player changes a
  group. The menu never calls `RunHardwareBenchmark` / `ApplyHardwareBenchmarkResults` (they overwrite the benched
  mix); the only use is the optional first-launch check in `performance.md` "The bar" (applied only below High).
- **Resolution scale can undo the bench's internal resolution** (unverified in 5.8.4). SETUP pins it with
  `r.ScreenPercentage.Default`; the menu's scale writes `r.ScreenPercentage`, which may override it, so a slider saved
  at 100% could render native 4K (about 4x the benched pixels). After `ApplySettings`, type `r.ScreenPercentage` in
  the console to see the value and what set it. Start the slider at the shipped percentage, label it in %, cap it
  near the benched value.
- **Window mode and resolution need a confirm.** After `SetFullscreenMode` / `SetScreenResolution`, call
  `ApplyResolutionSettings(false)`, show a 10 s "Keep these settings?" prompt, then `ConfirmVideoMode()` or
  `RevertVideoMode()`. In WindowedFullscreen (the default) the resolution list does nothing (`performance.md`):
  grey it out. Leave HDR out of the menu.
- **One settings object for everything.** Subclass `UGameUserSettings` (`UCLASS(Config=GameUserSettings)`) and add
  `UPROPERTY(Config)` fields for the volumes, subtitles, text scale, shake/flash scale and hold/toggle; set Project
  Settings > Engine > General Settings > Game User Settings Class (ini: `[/Script/Engine.Engine]
  GameUserSettingsClassName`, unverified in 5.8.4). Options then save to `GameUserSettings.ini` with the video
  settings and need no `USaveGame`; re-apply the audio and accessibility values in the GameInstance's `Init`.

### Accessibility and gamepad checklist

What a jam game should ship (about 3 h total). Put the options on one Accessibility tab, default them sensibly, save
them ("Settings menu" above) and name them in the submission text.
- [ ] **Full gamepad play, menus included:** gamepad mappings in `IMC_Default` (`gameplay.md` "Enhanced Input"),
  first button focused on every menu, visible focus, Start pauses, B backs out ("Gamepad menus and device prompts").
- [ ] **Prompts follow the last device used**, with the real key or button.
- [ ] **Subtitles on by default.** Our own UMG widget: the code that plays a VO line also pushes its `FText` to a
  bottom-centre text block on a 60-75% opaque dark box, hidden after `USoundBase::GetDuration()`. (The engine's
  legacy `UGameplayStatics::SetSubtitlesEnabled` only affects engine subtitles; the Beta "Subtitles and Closed
  Captions" plugin, `USubtitleAssetUserData` on a sound, is worth it only if lines must sync in Sequencer.)
  **5.9:** if the plugin is used, subtitles embedded as AssetUserData in localized Waves from 5.8 or earlier must
  be migrated on 5.9: right-click the source Wave > Migrate Embedded Subtitles to Asset, then Fix Localized
  Subtitle Waves; the migration tool is Beta (docs/ue59/pages/subtitles-and-closed-captions-plugin-in-unreal-engine.md).
- [ ] **Text size 100 / 125 / 150%:** multiply in the one px-to-pt font helper ("Layout, fonts, DPI") and re-push
  text on change. Check 150% at 1080p for overflow.
- [ ] **Colour-blind mode, one call:** `UWidgetBlueprintLibrary::SetColorVisionDeficiencyType(Type, Severity,
  bCorrectDeficiency, bShowCorrectionWithDeficiency)` applies to the game window. Dropdown Off / Deuteranope /
  Protanope / Tritanope with Severity 10 and Correct = true (false only simulates, a QA view; Epic staff on the
  forum). Never carry meaning by colour alone.
- [ ] **Screen shake scale (0 / 0.5 / 1) and Reduce flashing:** multiply at the source, the trauma-to-shake scale and
  the flash alpha in the central feedback code (`game-feel.md`); reduce flashing also caps full-screen flashes at
  ~3 per second. No global shake multiplier was found in the 5.8 docs.
- [ ] **Hold or toggle for held verbs** (sprint, aim, crouch): there is no toggle trigger (recipe: `gameplay.md`
  "Enhanced Input").
- [ ] **Pause works everywhere** and resumes with focus back on the game (`SetFocusToGameViewport()`).

### UMG MCP toolset (`UMGToolSet`, Experimental) for building WBPs

Functions (C++ names; the MCP may expose them snake_cased):
- Creation: `CreateWidgetBlueprint(FolderPath, AssetName, ParentClass)`, `AddWidget(WBP, WidgetClass, DisplayName,
  ParentWidget=null, ChildIndex=-1)`, `SetNamedSlotContent`.
- Query: `GetWidgets`, `GetWidgetDescription` (full property dump, `[N]` index lines), `GetWidgetTreeDepth`,
  `GetNamedSlots`, `ListWidgetBlueprints(Folder)`, `ListWidgetClasses(Filter)`, `GetWidgetClassInfo`.
- Modification: `MoveWidget`, `RemoveWidget`, `RenameWidget`, `ToggleWidgetAsVariable`, `WrapWidgets`,
  `ReplaceWidgetWithTemplate`, `ReplaceWidgetWithNamedSlot`, `ReplaceWidgetWithChild`, `BindToEventProperty`,
  `AddUIComponent` / `RemoveUIComponent` / `MoveUIComponent`.
- Lifecycle: `CompileWidgetBlueprint` (reports missing BindWidget names) then save via `AssetTools.save_asset`.
- Workflow from the header: **always `ObjectTools.list_properties` on a widget/slot before `set_properties`**
  (names vary per class; guessing fails silently). Set anchors/padding on the returned `Slot`, not the widget.
- Create the WBP with our C++ class as `ParentClass`, add widgets named exactly as the `BindWidget` properties, compile.
- Don't use `BindToEventProperty`: it puts logic in the BP graph. Bind delegates in C++ instead (kit rule).
- `MVVMToolset` also exists (CreateViewModel, CreateViewBinding, ...); unused since we skip Viewmodel.
- **5.9:** more AI toolsets ship, including MVVM, Slate inspection and widget animation, and a Toolset Registry
  controls which toolsets agents may use (docs/ue59/pages/unreal-engine-5-9-release-notes.md). The 5.9 MCP page
  names `WidgetBlueprintEditorSubsystem` as a toolset provider and Widget Finder among the runtime-callable
  toolsets (docs/ue59/pages/unreal-mcp-in-unreal-editor.md). On 5.9, `list_toolsets` / `describe_toolsets` before
  building WBPs or their animations, to see what is registered next to `UMGToolSet` and under which names.

## Quick canvas HUD (before a UMG HUD exists)

- `FCanvasTextItem` with an `FSlateFontInfo` renders through the runtime font cache with no outline (5.8
  `CanvasItem.cpp`): outline settings in the font info are ignored and `bOutlined` is only a 1 px offset. For a
  readable cartoon prompt, draw the text on a ring of offsets in the outline colour (16 offsets for a thick ring),
  then the fill. Keep the font size fixed while a prompt shows and animate `Item.Scale`, so glyphs aren't re-cached
  every frame. Remove all `AddOnScreenDebugMessage` text before shipping.
- **Canvas text needs a `UFont` behind the font info**, or it draws nothing and logs nothing. `FCanvasTextItem`'s
  Slate-font constructor sets `Font = Cast<const UFont>(InFontInfo.FontObject)` and `HasValidText()` is
  `Font != nullptr` (5.8 `CanvasItem.h`), so an `FSlateFontInfo` built from a composite font alone is skipped. With
  imported `UFontFace` assets, wrap each in a runtime font: `NewObject<UFont>`, `FontCacheType =
  EFontCacheType::Runtime`, one `FTypefaceEntry` with `FFontData(Face)` in
  `GetMutableInternalCompositeFont().DefaultTypeface` (the public `CompositeFont` member is deprecated), then
  `FSlateFontInfo(Font, Size)`. Keep the fonts in a `UPROPERTY` so GC leaves them.
- Game audio for the trailer: record the engine's own mix (`cinematics-video.md` D1).

## Verified against

- `Engine\Source\Runtime\Engine\Classes\Kismet\GameplayStatics.h`: PlaySound2D (bIsUISound=true default),
  PlaySoundAtLocation, SpawnSound2D, SpawnSoundAtLocation, SpawnSoundAttached, SetSoundMixClassOverride,
  Push/PopSoundMixModifier, SetBaseSoundMix, PrimeSound signatures.
- `...\Classes\Components\AudioComponent.h`: FadeIn/FadeOut/AdjustVolume/SetPaused/Stop, bIsUISound ("plays when
  the game is paused"), bAutoDestroy.
- `...\Classes\Sound\SoundAttenuation.h` (bSpatialize, StereoSpread, NonSpatializedRadius*, bEnableOcclusion),
  `SoundConcurrency.h` (MaxCount, bLimitToOwner, ResolutionRule enum + default, RetriggerTime), `SoundClass.h`,
  `SoundMix.h`, `SoundWave.h` + `SoundWaveLoadingBehavior.h` (loading behaviours, compression types),
  `SoundCue.h` (no class deprecation), `AudioSettings.h` (MaxChannels default 32).
- `Engine\Plugins\Runtime\Metasound\Metasound.uplugin` (IsBetaVersion false, EnabledByDefault true);
  `MetasoundEngine\Public\MetasoundSource.h` (UMetaSoundSource : USoundWaveProcedural);
  `AudioParameterControllerInterface.h` (Set*Parameter, SetTriggerParameter).
- `Engine\Source\Runtime\UMG\Public\Blueprint\UserWidget.h` (CreateWidget template, AddToViewport, NativeOnInitialized,
  PlayAnimation, SetIsFocusable); `Editor\UMGEditor\Private\WidgetBlueprintEditorUtils.cpp` (BindWidget,
  BindWidgetOptional, BindWidgetAnim, BindWidgetAnimOptional meta).
- `...\Classes\GameFramework\PlayerController.h` (FInputMode* structs, SetInputMode, SetShowMouseCursor, SetPause);
  `Plugins\EnhancedInput\...\InputAction.h` (bTriggerWhenPaused); `Engine\Config\BaseEngine.ini` (UIScaleRule=ShortestSide).
- `Plugins\Runtime\CommonUI\CommonUI.uplugin`, `Plugins\Runtime\ModelViewViewModel\ModelViewViewModel.uplugin`,
  `MVVMViewModelBase.h`, `Plugins\Runtime\AudioModulation\AudioModulation.uplugin` (off by default).
- `Engine\Plugins\Experimental\Toolsets\UMGToolSet\Source\UMGToolSet\Private\UMGToolSet.h` (full tool list),
  `...\MVVMToolset\...\MVVMToolset.h`.
- `...\Classes\Components\AudioComponent.h`: `PlayQuantized` signature (checked on the target PC).
- Names found in the 5.8.4 engine source on the target PC (2026-11-02; existence, not behaviour): the Quartz calls
  (`CreateNewClock`, `SetBeatsPerMinute`, `SubscribeToQuantizationEvent`, `GetBeatProgressPercent`,
  `EQuarztQuantizationReference::TransportRelative`, `FOnQuartzCommandEventBP`), `bCanPlayMultipleInstances`,
  `FSubmixEffectDynamicsProcessorSettings` (`ExternalSubmix`, `bKeyAudition`), `VolumeAdjuster`,
  `MaxVolumeThreshold`, `SPATIALIZATION_Default`, `AudioMixerXAudio2`, the audio cvars listed above; the
  `UGameUserSettings` calls, `SetInputMode_UIOnlyEx`, `SetFocusToGameViewport`, `SetColorVisionDeficiencyType`,
  `RenderFocusRule`, the `UInputSettings` mouse fields, `OnInputMethodChangedNative`, `QueueSingleSubtitle`.
- Not verified: Windows per-platform MaxChannels; the 5.8.4 defaults of `PanningMethod`, `MaxVolumeThreshold` and
  `VolumeAdjuster`; the Quartz delegate parameter lists.

## Sources (5.8)

- MetaSounds: https://dev.epicgames.com/documentation/en-us/unreal-engine/metasounds-in-unreal-engine?application_version=5.8
- MetaSounds overview: https://dev.epicgames.com/documentation/en-us/unreal-engine/metasounds-the-next-generation-sound-sources-in-unreal-engine?application_version=5.8
- MetaSounds Quick Start: https://dev.epicgames.com/documentation/en-us/unreal-engine/metasounds-quick-start?application_version=5.8
- Sound attenuation: https://dev.epicgames.com/documentation/en-us/unreal-engine/sound-attenuation-in-unreal-engine?application_version=5.8
- Working with audio (hub): https://dev.epicgames.com/documentation/en-us/unreal-engine/working-with-audio-in-unreal-engine?application_version=5.8
- Audio mixing (hub): https://dev.epicgames.com/documentation/en-us/unreal-engine/audio-mixing-in-unreal-engine?application_version=5.8
- Audio in UE5 ("legacy" classes): https://dev.epicgames.com/documentation/en-us/unreal-engine/audio-in-unreal-engine-5?application_version=5.8
- MetaSounds reference: https://dev.epicgames.com/documentation/en-us/unreal-engine/metasounds-reference-guide-in-unreal-engine?application_version=5.8
- MetaSound nodes: https://dev.epicgames.com/documentation/en-us/unreal-engine/metasound-function-nodes-reference-guide-in-unreal-engine?application_version=5.8
- Quartz: https://dev.epicgames.com/documentation/en-us/unreal-engine/overview-of-quartz-in-unreal-engine?application_version=5.8 ,
  https://dev.epicgames.com/documentation/en-us/unreal-engine/quartz-quick-start?application_version=5.8 ,
  https://dev.epicgames.com/documentation/en-us/unreal-engine/API/Runtime/AudioMixer/UQuartzClockHandle?application_version=5.8 ,
  https://dev.epicgames.com/documentation/en-us/unreal-engine/API/Runtime/Engine/FQuartzQuantizationBoundary?application_version=5.8
- Harmonix (Experimental): https://dev.epicgames.com/documentation/en-us/unreal-engine/harmonix-plugin-in-unreal-engine?application_version=5.8
- Sound classes: https://dev.epicgames.com/documentation/en-us/unreal-engine/sound-classes-in-unreal-engine?application_version=5.8 ;
  Python `PassiveSoundMixModifier`: https://dev.epicgames.com/documentation/en-us/unreal-engine/python-api/class/PassiveSoundMixModifier
- Submixes: https://dev.epicgames.com/documentation/en-us/unreal-engine/overview-of-submixes-in-unreal-engine?application_version=5.8 ;
  dynamics processor: https://dev.epicgames.com/documentation/unreal-engine/API/Runtime/AudioMixer/FSubmixEffectDynamicsProcessorSe-
- Audio Modulation quick start: https://dev.epicgames.com/documentation/en-us/unreal-engine/audio-modulation-quick-start-guide?application_version=5.8
- Spatialization: https://dev.epicgames.com/documentation/en-us/unreal-engine/spatialization-overview-in-unreal-engine?application_version=5.8
- Audio volumes / ambient zones: https://dev.epicgames.com/documentation/en-us/unreal-engine/audio-volumes-in-unreal-engine?application_version=5.8 ,
  https://dev.epicgames.com/documentation/en-us/unreal-engine/ambient-zones-in-unreal-engine?application_version=5.8
- Audio console commands: https://dev.epicgames.com/documentation/en-us/unreal-engine/audio-console-commands-in-unreal-engine?application_version=5.8
- Audio Insights loudness: https://dev.epicgames.com/documentation/en-us/unreal-engine/analyzers-and-output-metering-in-audio-insights-in-unreal-engine?application_version=5.8
- 5.8 release notes (WASAPI, Audio Insights, MetaSound additions): https://dev.epicgames.com/documentation/en-us/unreal-engine/unreal-engine-5-8-release-notes?application_version=5.8
- Game mix loudness (IESD, not Epic): https://www.audiogang.org/wp-content/uploads/2015/04/IESD-Mix-Ref-Levels-v03.02.pdf
- Common UI: https://dev.epicgames.com/documentation/en-us/unreal-engine/common-ui-plugin-for-advanced-user-interfaces-in-unreal-engine?application_version=5.8
- CommonUI + Enhanced Input (Experimental): https://dev.epicgames.com/documentation/en-us/unreal-engine/using-commonui-with-enhnaced-input-in-unreal-engine?application_version=5.8
- Common UI quickstart: https://dev.epicgames.com/documentation/en-us/unreal-engine/common-ui-quickstart-guide-for-unreal-engine?application_version=5.8
- UCommonInputSubsystem: https://dev.epicgames.com/documentation/en-us/unreal-engine/API/Plugins/CommonInput/UCommonInputSubsystem
- UGameUserSettings: https://dev.epicgames.com/documentation/en-us/unreal-engine/API/Runtime/Engine/UGameUserSettings
- UWidgetBlueprintLibrary: https://dev.epicgames.com/documentation/en-us/unreal-engine/API/Runtime/UMG/UWidgetBlueprintLibrary
- UUserInterfaceSettings: https://dev.epicgames.com/documentation/en-us/unreal-engine/API/Runtime/Engine/UUserInterfaceSettings
- UInputSettings: https://dev.epicgames.com/documentation/en-us/unreal-engine/API/Runtime/Engine/UInputSettings
- UGameplayStatics: https://dev.epicgames.com/documentation/en-us/unreal-engine/API/Runtime/Engine/UGameplayStatics
- Subtitles and Closed Captions plugin: https://dev.epicgames.com/documentation/en-us/unreal-engine/subtitles-and-closed-captions-plugin-in-unreal-engine?application_version=5.8
- Screen percentage with temporal upscale: https://dev.epicgames.com/documentation/en-us/unreal-engine/screen-percentage-with-temporal-upscale-in-unreal-engine?application_version=5.8
- Colour-blind correction vs simulation (Epic staff, forum, Jul 2026): https://forums.unrealengine.com/t/colorblind-mode-tritanope-shift-colors-to-red-not-green-and-violet/2743118

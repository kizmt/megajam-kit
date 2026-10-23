# Audio and UI (UE 5.8.4)

Audio is a judged category: cheap wins are variation (no sound repeats identically), correct 3D placement,
no spam, music that fades instead of cutting, and working volume sliders. UI must be readable, event-driven, and
never leave the player stuck without a cursor. Logic in C++; WBP_/MS_ assets are layout/sound-design wrappers.

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
- Gameplay-driven intensity: one MetaSound music source with a float input (`Intensity`) beats juggling components.

### Attenuation and spatialization (`USoundAttenuation`, `ATT_`)

- Make 3-4 shared assets (`ATT_Small` ~1500 uu, `ATT_Medium`, `ATT_Large`, `ATT_Ambient`) and pass them to
  `PlaySoundAtLocation`/`SpawnSoundAttached` or set them on the sound asset. No attenuation = sound is 2D everywhere.
- Key fields: `bSpatialize` ("Enable Spatialization"), `SpatializationAlgorithm`, `StereoSpread` ("3D Stereo Spread":
  distance between L/R when a stereo asset is spatialized), `NonSpatializedRadiusStart/End` (blend to non-spatialized
  when the listener is close: good for big sources like waterfalls), `bEnableOcclusion` (costs line traces; leave off).
- **Our WAVs are stereo.** A spatialized stereo sound is placed as two emitters spread `StereoSpread` apart, and Epic
  applies a 6 dB cut to spatialized stereo ("Normalize 3D Stereo Sounds"). Result: vaguer position and quieter than
  expected. Rule: **3D one-shots (impacts, footsteps, enemy barks) should be mono** - downmix at generation/import
  time (also halves memory). Keep stereo for music, UI, 2D stingers and wide ambient beds. (Mono-for-3D is our rule;
  Epic's attenuation page describes the stereo behaviour but makes no recommendation.)

### Concurrency (stop spam) (`USoundConcurrency`)

- Asset with `FSoundConcurrencySettings`: `MaxCount`, `bLimitToOwner`, `ResolutionRule` (default
  `StopFarthestThenOldest`; others: `PreventNew`, `StopOldest`, `StopLowestPriority`, `StopQuietest`, ...),
  `RetriggerTime` (minimum seconds between starts: kills machine-gun spam), volume scaling.
- Typical: footsteps MaxCount 4 + bLimitToOwner; impacts MaxCount 6 StopOldest, RetriggerTime 0.05; UI click MaxCount 1
  StopOldest. Assign on the sound asset or pass as the `ConcurrencySettings` argument.

### Volume sliders (Sound Classes + Sound Mix)

- Create `SCL_Master` with children `SCL_Music`, `SCL_SFX`, `SCL_Voice`, `SCL_UI`; set the class on every sound asset
  (our tool can set it by folder). One `MIX_Settings` sound mix.
```cpp
// On slider change (Volume 0..1). Fade 0 so the slider feels immediate.
UGameplayStatics::SetSoundMixClassOverride(this, MIX_Settings, SCL_Music, Volume, 1.f, /*FadeIn*/ 0.f, /*bApplyToChildren*/ true);
UGameplayStatics::PushSoundMixModifier(this, MIX_Settings); // pushing again is harmless; Pop to remove
```
- Persist the values in a `USaveGame` and re-apply on startup. Audio Modulation (Control Buses) is the more modern
  system but the plugin is off by default: not worth it for a jam.

### MetaSounds vs Sound Cues

- **Prefer MetaSounds (`MS_`) for anything beyond "play this wave"**; play plain SoundWaves directly otherwise.
  Sound Cues (`SC_`) still work in 5.8 (not deprecated) but add nothing we need.
- Status: the 5.8 Metasound plugin descriptor is `IsBetaVersion: false`, enabled by default; Epic's MetaSounds Quick
  Start page still carries a Beta caution. Treat as usable; test in the packaged build.
- Jam uses: random pick from a wave array (Random Get node) + random pitch/volume (~0.95-1.05) for footsteps/impacts;
  layered sounds (click + body + tail); looping ambience with a float input; adaptive music via inputs/triggers.
  Presets let one graph serve many sounds with different inputs.
- Graph basics: `On Play` trigger in, audio out (`Out Mono`; set Output Format to Stereo for `Out Left/Right`).
  One-shots use the **OneShot interface: wire the Wave Player's `On Finished` to the `On Finished` output**, otherwise
  the source never ends and holds a voice (unverified wording; Epic's quick start wires it in every one-shot example).
  Looping music/ambience: remove the OneShot interface.
- From C++ a MetaSound Source (`UMetaSoundSource : USoundWaveProcedural`) is just a `USoundBase`: same play calls.
  Parameters go through the audio component (`IAudioParameterControllerInterface`):
```cpp
UAudioComponent* C = UGameplayStatics::SpawnSoundAttached(MS_Engine, GetRootComponent());
C->SetFloatParameter(TEXT("Speed"), Speed);   // also SetIntParameter, SetBoolParameter, SetObjectParameter
C->SetTriggerParameter(TEXT("Explode"));     // fires a Trigger input
```
  Names must match the graph input exactly (silent no-op otherwise). Set on change, not every tick.

### Reverb, voices, memory

- Reverb, cheapest: an Audio Volume actor with a reverb effect for interiors. Skip submix effect chains.
- Voice budget: `FAudioQualitySettings::MaxChannels` defaults to 32 (Project Settings > Audio > Quality). Concurrency +
  attenuation (inaudible sounds get virtualized) keep you under it; raise only if sounds audibly drop out.
- Debug: `au.3dVisualize.Enabled 1`, `stat soundwaves`, `au.Debug.Sounds 1` (cvar names unverified for 5.8).
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
  `UGameplayStatics::OpenLevel`. Add Settings (volume sliders above) and Quit (`UKismetSystemLibrary::QuitGame`).

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

### CommonUI and Viewmodel: skip for the jam

- CommonUI (plugin, off by default, not beta) brings activatable widget stacks, input routing and gamepad
  navigation, but requires `CommonGameViewportClient` and its own widget classes; its **Enhanced Input support is
  Experimental** ("use caution when shipping"). Worth it only for a gamepad-first, many-layer UI. Plain UMG above is enough.
- UMG Viewmodel (ModelViewViewModel plugin, `IsBetaVersion: true`, off by default): `UMVVMViewModelBase` +
  `UE_MVVM_SET_PROPERTY_VALUE` give change-driven bindings. Nice, but setter functions on our C++ widget already avoid
  per-frame bindings with fewer moving parts.

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
- Not verified: OneShot/On Finished "holds a voice" wording, audio debug cvar names, Windows per-platform MaxChannels.

## Sources (5.8)

- MetaSounds: https://dev.epicgames.com/documentation/en-us/unreal-engine/metasounds-in-unreal-engine?application_version=5.8
- MetaSounds overview: https://dev.epicgames.com/documentation/en-us/unreal-engine/metasounds-the-next-generation-sound-sources-in-unreal-engine?application_version=5.8
- MetaSounds Quick Start: https://dev.epicgames.com/documentation/en-us/unreal-engine/metasounds-quick-start?application_version=5.8
- Sound attenuation: https://dev.epicgames.com/documentation/en-us/unreal-engine/sound-attenuation-in-unreal-engine?application_version=5.8
- Working with audio (hub): https://dev.epicgames.com/documentation/en-us/unreal-engine/working-with-audio-in-unreal-engine?application_version=5.8
- Audio mixing (hub): https://dev.epicgames.com/documentation/en-us/unreal-engine/audio-mixing-in-unreal-engine?application_version=5.8
- Common UI: https://dev.epicgames.com/documentation/en-us/unreal-engine/common-ui-plugin-for-advanced-user-interfaces-in-unreal-engine?application_version=5.8
- CommonUI + Enhanced Input (Experimental): https://dev.epicgames.com/documentation/en-us/unreal-engine/using-commonui-with-enhnaced-input-in-unreal-engine?application_version=5.8

## Kit notes / contradictions

- `naming.md` has no prefix for Sound Concurrency: use `SCON_` (proposed; add to naming.md).
- Kit brief calls MetaSounds "Beta in 5.8"; the 5.8 plugin descriptor says not beta (quick start page still says Beta).
- `gen/audio.mjs` outputs stereo only: add a mono option for 3D one-shots (see Attenuation).

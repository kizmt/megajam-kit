# Game feel ("juice") playbook (UE 5.8.4)

Read this before a juice pass, and when a mechanic works but doesn't feel good. Fun is a judging criterion and the
tiebreaker (counted twice), and feedback is a large part of why an action feels good. It amplifies a fun loop; it does
not replace one (a goal, risk and reward come first).

**Status:** recipe. Engine calls are checked against the 5.8 headers (paths at the end). Starting values are
starting points to tune by play, except those marked *proven* (measured in a prototype).

**Jam rules:** this file is knowledge, not game content. Write the game's feedback code during the contest from these
recipes; never copy a prototype's implementation into the jam project (rule 7(h): prepared materials are AI tools,
agent configs, MCP settings, prompt libraries and scripts; gameplay is made in the contest period).

## Principles

- **Every player verb gets feedback on at least three channels:** visual (flash, particles, animation), audio, and
  camera or time (shake, hit-stop, rumble). One channel reads as "nothing happened".
- **Four beats per event:** anticipation (wind-up, charge sound), impact (hit-stop, flash, shake, sound), reaction
  (target recoils, knockback, debris), aftermath (dust settles, lingering decal, UI updates).
- **Scale by intensity:** one event type, one intensity value (light 0.3, heavy 0.7, kill 1.0) multiplied into shake
  scale, hit-stop length, rumble and particle count. Hierarchy reads better than everything at maximum.
- **Stacked hits use trauma, not stacked shakes:** a trauma value 0-1 on the camera; each hit adds 0.3-0.6 (by
  intensity), it decays ~1 per second, and shake scale = trauma². Squaring keeps small hits subtle and lets a flurry
  build up; starting a new shake per hit instead jitters.
- **The player's actions first,** then threats to the player, then ambient events. Enemy-on-enemy events get little.
- **Restraint:** no shake on routine actions (walking, normal jumps), short durations (most impacts finish in
  < 0.25 s), and a settings toggle or slider for screen shake.
- **Time-based, never frame-based.** Everything below is in seconds so it survives frame-rate changes. For custom
  smoothing, use `Alpha = 1 - FMath::Exp(-Speed * DeltaTime)` with a lerp: `FInterpTo` uses `Clamp(DeltaTime * Speed, 0, 1)`,
  which feels different at different frame rates and snaps in one step when the product reaches 1.
- **UI motion eases out:** panels and prompts move in ~0.3 s with an ease-out (`UKismetMathLibrary::Ease`,
  `EEasingFunc::EaseOut`, BlendExp 3, or a UMG animation curve); a slight overshoot on rewards and buttons.
- **Judge it from the gameplay camera at full speed** (record a clip, watch it at 1x, then frame by frame).

## Catalogue: feedback, engine call, starting values

| Feedback | Engine call (5.8) | Start values | Notes |
|---|---|---|---|
| **Hit-stop** (freeze on impact) | `AActor::CustomTimeDilation` on attacker and victim, restored by a world timer | light 0.05-0.07 s, heavy 0.10-0.15 s, dilation 0.02 | Local: the rest of the world keeps moving. World timers run on global time, so `CustomTimeDilation` doesn't slow them. Use a small value, not 0 (some movement code divides by delta time) |
| **Slow motion** (kill, last enemy) | `UGameplayStatics::SetGlobalTimeDilation(World, 0.25)` | 0.25 for 0.3-0.5 s real time | World timers are scaled by global dilation: a timer of `real * 0.25` restores after `real` seconds. Sound is not slowed by default |
| **Camera shake** | `UDefaultCameraShakeBase` subclass (EngineCameras plugin, on by default) with a root pattern; `APlayerController::ClientStartCameraShake(Class, Scale)` | Perlin: rotation amplitude 0.5-2 deg, frequency 10-25, 0.15-0.3 s, short blend out | Perlin for impacts, `UWaveOscillatorCameraShakePattern` for directional punches, `UCompositeCameraShakePattern` to combine. Third person: shake rotation more than location. **`UPerlinNoiseCameraShakePattern::RotationAmplitudeMultiplier` defaults to 0** (location only): set it to 1 or the rotation amplitudes do nothing (*proven*). No asset per value: `PlayerCameraManager->StartCameraShake(UDefaultCameraShakeBase::StaticClass(), Params)` with `FAddCameraShakeParams::Initializer` building the pattern (multipliers, amplitudes, frequencies, duration, blend out) from the feedback entry. `UGameplayStatics::PlayWorldCameraShake` for explosions with falloff |
| **Field-of-view kick** | Camera `FieldOfView` driven by `UKismetMathLibrary::FloatSpringInterp` each tick | +3 to +6 deg on dash or heavy hit, spring stiffness 150-300, damping 0.4-0.6 | Kick the spring's velocity or target, let it settle. Keep `FFloatSpringState` per value |
| **Hit flash** (target turns white) | Default: the master material's built-in flash, `SetCustomPrimitiveDataFloat(0, 1)` (`FlashAmount`), fade to 0; `FlashColor` / `FlashStrength` on the MI (`materials.md` "Master material"). Meshes not on the master: `UMeshComponent::SetOverlayMaterial` (unlit translucent, emissive by a CPD value) | 0.06-0.1 s | CPD 0 is taken by `FlashAmount`: reserve other CPD indexes per project from 1 up (a vector parameter takes **4 consecutive slots**). The overlay draws over every slot without touching the base material; built by script, it needs the right usage flags (`materials.md` "Master material", usage flags) |
| **Squash and stretch** | Mesh relative scale driven by `FloatSpringInterp` (or `VectorSpringInterp`) | land: Z 0.8 / XY 1.1, spring back over ~0.2 s | For stylized characters and pickups. Scale the mesh component, never the capsule |
| **Knockback** | `ACharacter::LaunchCharacter(Velocity, bXYOverride, bZOverride)` | small on light hits, large on the finisher | A big push on a light hit moves the target out of reach of the next hit |
| **Controller rumble** | `APlayerController::PlayDynamicForceFeedback(Intensity, Duration, ...)` (no asset needed) or `ClientPlayForceFeedback(UForceFeedbackEffect*, Params)` | light 0.3 x 0.08 s, heavy 0.7 x 0.15 s | Large motors for weight, small for texture |
| **Particles** | `UNiagaraFunctionLibrary::SpawnSystemAtLocation` / `SpawnSystemAttached` | burst at the hit point, along the hit normal | Pool frequent effects (`ENCPoolMethod::AutoRelease`). Recipes: `vfx.md` |
| **Sound** | `UGameplayStatics::PlaySoundAtLocation(World, Sound, Loc, Volume, Pitch)` / `SpawnSoundAttached` | pitch random 0.9-1.1 per play; layer whoosh + impact + body | Repetition kills feel: 3+ variations or pitch variance. Recipes: `audio-ui.md` |
| **Screen flash / fade** | `APlayerCameraManager::StartCameraFade(From, To, Duration, Color)` | damage: red, alpha 0.25 -> 0 over 0.2 s | Use sparingly; a vignette pulse (post-process) is softer |
| **Post-process pulse** | Blend weight of a post-process component or volume, or a Material Parameter Collection scalar | chromatic aberration / vignette up for 0.1-0.2 s | Global; keep for big moments only |
| **Light flash** | Point light intensity spike on the impact, then fade | 0.05-0.1 s | Reads strongly in dark scenes; cheap with no shadows |
| **UI punch** | Widget render transform scale via a spring or a UMG animation | 1.0 -> 1.15 -> 1.0 over 0.15 s | Score, health and button presses |
| **Damage numbers / hit markers** | World-space widget or HUD draw at the projected hit point | rise and fade over 0.6 s | Optional; genre-dependent |
| **Lingering marks** | Decals (`UGameplayStatics::SpawnDecalAtLocation`), debris that stays | a few seconds | Aftermath: the world remembers the hit |

**One action, one dominant feedback:** when events coincide (a kill and a deflect off the wall), play the stronger,
never both.

## Pattern: a feedback player (write it in the project, during the jam)

Feel's core idea in Unreal terms, described so the session can write it quickly:

- A `UDataAsset` per event (`DA_Feel_LightHit`, `DA_Feel_Kill`...) holding a list of entries. Each entry: a type
  (HitStop, Shake, FovKick, Flash, Rumble, Niagara, Sound, Launch, SlowMo...), its parameters and a delay.
- A `UActorComponent` on the player (or a world subsystem) with one call: `Play(Asset, Context)`, where the context
  carries location, normal, instigator, target and an intensity 0-1 multiplied into the scalable parameters.
- Entries with a delay use world timers; hit-stop and slow-mo restore themselves; springs (FOV, scale) tick in the
  component.
- Gameplay code calls only `Play`: tuning happens in the data assets, with no rebuild.
- Log each `Play` (event name, intensity) at Verbose for the autoplay or clip review.

## Juice pass checklist (one pass per verb, after the mechanic works)

1. List the player verbs **that exist in this game** (for example attack, hit, get hit, kill, dodge, jump, land, pick
   up, open, win, lose) and the important world events. Don't juice a verb the game lacks; if the design needs a
   missing one (a dodge, say), build it first.
2. For each verb that exists, write the four beats (anticipation, impact, reaction, aftermath) and pick 3+ channels.
3. Add them in order of frequency and importance: hit and get-hit first, then kill, then movement, then UI.
4. Record a clip after each verb and watch it at full speed. Too much? Cut the duration before the amplitude.
5. Check readability: the player can still see the target and the threat during shake and flashes.
6. Check performance: particles pooled, no shadows on flash lights, the bench still meets the target.
7. Add the shake setting (and a reduced-flash option if flashes are strong).

## Free effect packs on Fab

Packs such as impact frames, shockwaves and spell effects are **sourced assets**: only packs whose licence allows AI
use (CLAUDE.md "Jam compliance"); list them, and they are not scored.
They are fine for impact frames and placeholders; effects built in Niagara during the jam count as the game's own
visuals. Check `docs/ue/animation-library.md` for the library-project approach.

## Verified against (5.8 headers)

- `Engine/Classes/GameFramework/Actor.h` (`CustomTimeDilation`), `Kismet/GameplayStatics.h` (`SetGlobalTimeDilation`,
  `PlayWorldCameraShake`, `PlaySoundAtLocation`, `SpawnSoundAttached`), `Private/LevelTick.cpp` (timer manager ticks
  with globally dilated delta).
- `Engine/Classes/GameFramework/PlayerController.h` (`ClientStartCameraShake`, `ClientPlayForceFeedback`,
  `PlayDynamicForceFeedback`), `Camera/PlayerCameraManager.h` (`StartCameraShake`, `StartCameraFade`).
- `Plugins/Cameras/EngineCameras/.../Shakes/` (`DefaultCameraShakeBase`, `PerlinNoiseCameraShakePattern`,
  `WaveOscillatorCameraShakePattern`, `CompositeCameraShakePattern`; plugin enabled by default).
- `Engine/Classes/Kismet/KismetMathLibrary.h` (`FloatSpringInterp`, `VectorSpringInterp`, `QuaternionSpringInterp`).
- `Engine/Classes/Components/MeshComponent.h` (`SetOverlayMaterial`), `PrimitiveComponent.h`
  (`SetCustomPrimitiveDataFloat`), `GameFramework/Character.h` (`LaunchCharacter`),
  `Plugins/FX/Niagara/.../NiagaraFunctionLibrary.h` (`SpawnSystemAtLocation`, `SpawnSystemAttached`).

## Background

The ideas behind this playbook come from well-known talks: "Juice it or lose it" (Martin Jonasson and Petri Purho),
"The art of screenshake" (Jan Willem Nijman, Vlambeer), and "Juicing your cameras with math" (Squirrel Eiserloh,
GDC). The Unity asset Feel (More Mountains) is the reference for the catalogue-of-feedbacks idea.

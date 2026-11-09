# Gameplay framework (UE 5.8.4): C++ patterns

Read this before you write player, input, camera, interaction, or game-flow code. Signatures were checked against
the 5.8 headers and Epic's 5.8 C++ templates (see "Verified against"). Kit rules apply: gameplay in C++, Blueprints
only as thin subclasses that assign meshes, sounds and tunables, tuning in DataAssets, tick off, pooling.
Jam rules forbid shipping a lightly modified template, so take the patterns below and write our own classes.

## Which framework classes a small single-player game needs

| Class | Role | Do we need it? |
|---|---|---|
| `AGameModeBase` | Rules, win/lose, spawns the other framework actors. One per level load, so it does not persist | **Yes**: one C++ GameMode. Set the default classes in its constructor or in its BP subclass |
| `APlayerController` | The player's will: adds input mapping contexts, input mode, UI widgets, possesses the pawn | **Yes** |
| `ACharacter` | Pawn with capsule, skeletal mesh and `UCharacterMovementComponent` (walk, jump, fall, swim, fly) | If the player (or an NPC) is a walking body |
| `APawn` | Base for anything controllable (vehicle, top-down cursor, camera rig, board or puzzle view) | If the player controls something that does not walk |
| `AGameStateBase` | Game-wide replicated state (score, objectives) | Optional. In single player, the GameMode can hold it |
| `APlayerState` | Per-player replicated data | **Skip**. Keep per-player data (health, inventory, score) on the pawn or a component |
| `AHUD` | Legacy canvas drawing | **Skip**. Create UMG widgets from the PlayerController |
| `UGameInstance` | Lives from launch to quit and survives `OpenLevel` | Only if data must cross level loads, such as settings or a run timer |

- In the GameMode constructor, set `DefaultPawnClass`, `PlayerControllerClass`, and optionally `HUDClass`,
  `GameStateClass` and `PlayerStateClass`. Point them at the **BP subclasses** (`BP_<Name>`), because the
  BP is where the meshes are assigned. Then set the GameMode in World Settings > GameMode Override or in Project
  Settings > Maps & Modes.
- Do not hard-code asset paths in C++. The templates leave mesh and anim BP references to the derived Blueprint.

## Character and CharacterMovementComponent

For a walking player or NPC. A vehicle, cursor, board or fixed-camera game may not need it (`APawn` above).

- The capsule is the root and does all the collision. The mesh is visual only. The template sizes the capsule with
  `GetCapsuleComponent()->InitCapsuleSize(42.f, 96.f)` and offsets the mesh down by the half-height in the BP.
- Move with `AddMovementInput(Direction, Scale)`, look with `AddControllerYawInput` / `AddControllerPitchInput`,
  and jump with `Jump()` / `StopJumping()` (`JumpMaxCount` allows a double jump). Use `LaunchCharacter(Vel, bXY, bZ)`
  for jump pads and knockback. `Crouch()` needs `GetCharacterMovement()->NavAgentProps.bCanCrouch = true`.
- Key CMC tunables (all UPROPERTYs on `UCharacterMovementComponent`). The values are the 5.8 TP template's:
  - `MaxWalkSpeed` 500, `MaxAcceleration`, `BrakingDecelerationWalking` 2000, `GroundFriction`
  - `JumpZVelocity` 500, `AirControl` 0.35, `GravityScale`, `BrakingDecelerationFalling` 1500
  - `RotationRate` (0,500,0), `bOrientRotationToMovement`, `bUseControllerDesiredRotation`
  - `MaxStepHeight`, `SetWalkableFloorAngle()`, `bCanWalkOffLedges`, `MinAnalogWalkSpeed` 20
- **Modelled stairs with complex collision: set `bUseFlatBaseForFloorChecks = true`** in the character's constructor.
  On a prototype (32 cm treads, 14 cm risers, bevelled nosings; capsule radius 30, step 45, walkable 44.8°) the
  step-up was rejected on most climbs: the character perched on the nosing and slid along the riser. A 60° walkable
  override fixed only some; flat-base floor checks climbed all 5 test stairs with 0 falls (measured in `-game`; the
  stair check is in `debugging.md` F "Traversal checks").
- **Third-person rotation setup:** set the Character's `bUseControllerRotationYaw/Pitch/Roll = false` and
  `bOrientRotationToMovement = true`, so the body turns toward movement and the camera orbits freely.
  **First-person:** keep `bUseControllerRotationYaw = true` (the APawn default), so the body turns with the mouse.
- **Data-driven tuning:** put speed, jump and air control in a `UPrimaryDataAsset` (for example
  `UPlayerTuningData`), reference it with `UPROPERTY(EditDefaultsOnly) TObjectPtr<UPlayerTuningData> Tuning`, and
  copy the values onto `GetCharacterMovement()` in `BeginPlay`. Constructor defaults are only fallbacks.
- **Tick:** an `ACharacter`'s actor tick may be off (`PrimaryActorTick.bCanEverTick = false`, our default for player
  and enemies alike); `UCharacterMovementComponent` ticks as its own component, so movement and path following keep
  working. Don't put polling in the character's `Tick`.
- **Root motion:** skip it unless an animation must drive the movement, such as a dodge or a climb. The animation
  needs "Enable Root Motion", and the AnimBP needs Root Motion Mode. "Root Motion from Montages Only" is the sane
  choice: play the montage with `PlayAnimMontage`. While the character walks or falls, the Z axis of root motion is
  ignored and gravity still applies. Only "Root Motion from Everything" forces the anim update onto the game thread
  (`UAnimInstance::NeedsImmediateUpdate`); "from Montages Only" keeps the parallel update.

## Forgiving, responsive controls (starting values)

The player judges the controls by whether a press does what they meant. These windows are invisible but make a
platformer or action game feel fair; put every number in the tuning DataAsset. Engine hooks are from the 5.8
headers; the patterns are unbuilt in a prototype.

- **Coyote time: 0.1-0.15 s to jump after walking off a ledge.** The CMC has none: a first jump while falling is
  refused. Record the time in `OnWalkingOffLedge_Implementation` (fires for walk-offs, not jumps) and override
  `virtual bool CanJumpWhileFalling() const` (default `false`) to return true while `JumpCurrentCount == 0` and the
  window is open. `JumpIsAllowedInternal` then allows the jump as a first jump.
- **Jump buffer: 0.1 s.** A press just before landing should still jump. Store the press time when `CanJump()` is
  false; in `Landed()` (override, call Super), `Jump()` if the press is within the window, then clear it so one
  press gives one jump. The same idea queues the next attack during recovery or hit-stop and fires it at the combo
  window (`animation-library.md` "Combat animation pattern", cancel window).
- **Fall damage: reset the fall's top on a teleport too, not only on landing.** A rehearsal game measured
  `FallTopZ - Z` on landing, with `FallTopZ` set when a fall starts. A test script teleported the pawn out of a glide
  ending high in the air, the fall never ended, and the landing far below counted a 90 m drop. Reset it in the
  game's teleport/respawn path (test scripts: `debugging.md` F).
- **Acceleration and stopping.** Time to top speed 0.1-0.2 s for snappy, 0.3 s+ for heavy: `MaxAcceleration` ≈
  `MaxWalkSpeed / seconds` (the template's 1500 at 500 is ~0.33 s). Stop in ~0.1-0.2 s: `BrakingDecelerationWalking`
  ≈ speed / seconds. `GroundFriction` sets how fast direction changes (higher is snappier turns). Less control in the
  air (`AirControl` 0.2-0.5). Friction interacts with all of these: measure the real times in a clip, don't trust the
  arithmetic.
- **Invincibility after a hit: 0.5-1 s for the player**, shown by a blink (~10 Hz, the master material's flash or
  visibility) and a knockback away from the source. Enemies get little or none, or combos stop landing.
- **Fast movers tunnel.** Move by `SetActorLocation(..., bSweep=true)`, keep `UProjectileMovementComponent`'s sweep
  on, and set `bUseCCD` on fast simulated bodies (`FBodyInstance`; `physics.md` "CCD (fast objects)").

## Example: third-person player

A structure, not defaults for every genre: pick the verbs and numbers the game needs. Write it fresh in the jam
project (no pre-jam gameplay code in the kit).

- `UPlayerTuningData : UPrimaryDataAsset`: run and walk speeds (match them to the blend space's sample speeds:
  `characters.md` "Blend Space"), JumpZVelocity, AirControl, TurnRate, BrakingDecelerationWalking, CameraDistance,
  bCameraLag + CameraLagSpeed (start from the template's values). `EditDefaultsOnly, BlueprintReadOnly`, `ClampMin` metas.
- `APlayerCharacter : ACharacter` (`UCLASS(Abstract)`): capsule 42/96, controller rotation off, orient to
  movement, spring arm + camera (template pattern), `TObjectPtr` UPROPERTYs for Tuning and one `UInputAction` per
  verb. `BeginPlay` → `ApplyTuning()` copies the asset onto the CMC and boom (and logs
  it). `SetupPlayerInputComponent` warns for each unassigned action (null actions bind silently), binds Walk
  `Started`/`Completed` → `SetWalking(true/false)` which swaps `MaxWalkSpeed`.
- `AMainPlayerController`: `TArray<TObjectPtr<UInputMappingContext>> DefaultMappingContexts`, added in
  `SetupInputComponent` for local players. `AMainGameMode`: sets `PlayerControllerClass` as a fallback.
- Thin BPs (editor Python, no graph logic): `BP_<Name>` (mesh, ABP class, mesh Z = -capsule half-height,
  yaw -90 (= 270) for a +Y-facing mesh, input actions, DA), `BP_MainPlayerController` (IMC_Default +
  IMC_MouseLook), `BP_MainGameMode` (pawn + controller) → World Settings GameMode Override.
- Python facts: the 5.8.4 stub has `InputAction_Factory` and `InputMappingContext_Factory`, so input assets can be
  created directly (duplicating an existing bool action, `IA_Jump` → `IA_Walk`, also works: set `value_type` and
  clear `triggers`); `imc.map_key(action, key)` with `key.set_editor_property("key_name", "LeftShift")`. **`map_key`
  never de-duplicates**, and `key_name` is an `unreal.Name`, so `"LeftShift" in {m.key.key_name ...}` is always False
  and a re-run mapped the key twice: make mapping scripts re-runnable with `imc.unmap_all_keys_from_action(action)`
  then `map_key` each key, or compare `str(key_name)`; data assets via `DataAssetFactory` + `data_asset_class`;
  BPs via `BlueprintFactory` + `parent_class`, then set CDO properties (`get_default_object`) and compile.
- **5.9:** new scripting functions create and edit Blueprints, graphs, nodes and variables from Python or Editor
  Utility Blueprints; the page names no functions, so grep the 5.9 stub before using them
  (docs/ue59/pages/unreal-engine-5-9-release-notes.md).
- Verify in PIE from script: pawn/controller/game mode classes, `MaxWalkSpeed` before/after `set_walking(True)`,
  feet on the floor, no warnings from the player's log category.
- **5.9:** Python wraps each Blueprint class as its own type (`BP_MainGameMode_C`, a subclass of the native parent)
  instead of the nearest native class (default `Engine.Python.WrapBlueprintClassesOnDemand` true). A class check that
  compares `type(obj)` or the Python type name with the C++ class fails on 5.9: use `isinstance()` (works on both),
  or set the cvar to false (docs/ue59/pages/scripting-the-unreal-editor-using-python.md).

## Enhanced Input (the only input path in 5.8)

- **Never** use the legacy `BindAxis` / `BindAction(FName, IE_Pressed...)` or the ActionMappings in Project Settings.
  Those are old-version patterns.
- Add `"EnhancedInput"` to the module's Build.cs dependencies (the template uses Public; Private is fine too, see
  `cpp.md` "Modules"). The plugin is on by default.
- Assets: one `UInputAction` (IA_) per verb, with Value Type Bool, Axis1D, Axis2D (FVector2D) or Axis3D. One
  `UInputMappingContext` (IMC_) maps keys to actions, with per-key **modifiers** and **triggers**.
  - WASD into one Axis2D `IA_Move`, read as the template's `Move` reads it (Y = forward, X = right): W = `Swizzle
    Input Axis Values` (YXZ), S = Swizzle + `Negate`, D = no modifier, A = Negate. A missing Swizzle makes W/S move
    sideways (a classic bug).
  - Common modifiers: `Negate`, `SwizzleAxis`, `DeadZone` (gamepad sticks), `Scalar` (sensitivity).
  - Common triggers: none (= Down, fires every frame while held), `Pressed` (once), `Released`, `Hold`,
    `HoldAndRelease`, `Tap`, `RepeatedTap`, `Pulse`. Put "press E once" behaviour in a `Pressed` trigger on the IA,
    or bind `ETriggerEvent::Started`. `Hold` defaults to `HoldTimeThreshold` 1.0 s and `bIsOneShot` false (fires every
    frame after the threshold): for "hold to interact" set 0.3-0.5 s and one-shot.
  - **There is no toggle trigger.** For a hold/toggle option (sprint, aim, crouch), bind `Started` and `Completed`:
    hold mode sets on `Started` and clears on `Completed`; toggle mode flips on `Started` and ignores `Completed`.
- **Gamepad mappings in the same `IMC_Default`** (judges may play on a pad): `Gamepad_Left2D` to `IA_Move` with
  `DeadZone` (Radial); `Gamepad_Right2D` to `IA_Look` with `DeadZone`, `Scalar` and **`ScaleByDeltaTime`** (mouse
  delta is a distance per frame, a stick is a rate, so without it look speed changes with fps);
  `Gamepad_FaceButton_Bottom` to the main action (jump, confirm, place), `Gamepad_FaceButton_Left` to a second one
  (interact), `Gamepad_Special_Right` (Start) to `IA_Pause`. `ResponseCurveExponential` gives finer aim near the
  centre. Menus: `audio-ui.md` "Gamepad menus and device prompts".
- **Add the mapping context in the PlayerController**, local players only. This is the template pattern:

```cpp
void AMyPlayerController::SetupInputComponent()
{
    Super::SetupInputComponent();
    if (!IsLocalPlayerController()) return;
    if (auto* Subsys = ULocalPlayer::GetSubsystem<UEnhancedInputLocalPlayerSubsystem>(GetLocalPlayer()))
    {
        Subsys->AddMappingContext(DefaultMappingContext, /*Priority*/ 0);   // UPROPERTY(EditDefaultsOnly) TObjectPtr<UInputMappingContext>
    }
}
```

- **Bind in the Pawn's `SetupPlayerInputComponent`.** Cast to `UEnhancedInputComponent`, and log an error if the
  cast fails:

```cpp
if (auto* EIC = Cast<UEnhancedInputComponent>(PlayerInputComponent))
{
    EIC->BindAction(JumpAction,     ETriggerEvent::Started,   this, &ACharacter::Jump);
    EIC->BindAction(JumpAction,     ETriggerEvent::Completed, this, &ACharacter::StopJumping);
    EIC->BindAction(MoveAction,     ETriggerEvent::Triggered, this, &AMyCharacter::Move);   // void Move(const FInputActionValue& V) { V.Get<FVector2D>() }
    EIC->BindAction(InteractAction, ETriggerEvent::Started,   this, &AMyCharacter::Interact);
}
```

- `ETriggerEvent` values: `Triggered` (every frame while the trigger is met, so use it for axes), `Started`
  (first frame), `Ongoing` (for example, a Hold before its threshold), `Canceled` (released before Hold completed),
  `Completed` (Triggered to None).
- Input-action UPROPERTYs are `EditDefaultsOnly` on the C++ class and assigned in the BP subclass. A null action
  silently does nothing, so check the BP first when "input doesn't work".
- Swap contexts for modes (gameplay, menu, vehicle) with `AddMappingContext` / `RemoveMappingContext` (`ClearAllMappings()` also exists).
  When several contexts map the same key, the higher priority wins.
- Menus: in the PlayerController call `SetInputMode(FInputModeUIOnly / GameAndUI / GameOnly)` and set
  `bShowMouseCursor`.
- **Prompts show the real key:** `Subsys->QueryKeysMappedToAction(IA_Interact)` returns the `TArray<FKey>` mapped
  in the active contexts. Pick the first whose `IsGamepadKey()` matches the last device used, then
  `Key.GetDisplayName()` for keyboard text or a small `TMap<FKey, UTexture2D*>` for pad icons.
- **Test input without a pad:** `showdebug enhancedinput` lists the active contexts and mappings; the console
  commands `Input.+key Gamepad_Left2D X=0.7 Y=0.5` / `Input.-key <Key>` inject input, and the subsystem's
  `InjectInputForAction` does it from code.
- **Key remapping (Enhanced Input User Settings) is Experimental** (Epic's 5.8 Parrot sample: "use caution when
  trying to ship"); optional for a jam. If built: Project Settings > Enhanced Input `bEnableUserSettings`; a unique
  Player Mappable Key Settings > Name on each remappable IA; add contexts with an `FModifyContextOptions` whose
  `bNotifyUserSettings = true`; remap with `GetUserSettings()->MapPlayerKey(FMapPlayerKeyArgs{MappingName, Slot =
  EPlayerMappableKeySlot::First, NewKey}, FailureReason)`, then `ApplySettings()` and `SaveSettings()`
  (`ResetKeyProfileIdToDefault`, which takes the profile id string, for Reset; `ProfileIdString` in the args, as
  `ProfileId` is deprecated). It saves to `Saved/SaveGames/EnhancedInputUserSettings.sav`: delete it when testing
  defaults.
- **A held action that sticks after alt-tab:** `UEnhancedInputDeveloperSettings::bSendTriggeredEventsWhenInputIsFlushed`
  controls whether in-progress actions get their end events when the viewport loses focus; leave the default, but
  check it first.
- `UInputTriggerCombo` is **deprecated in 5.8**. Don't use it.

## Cameras

- **Third person** (template pattern): `USpringArmComponent` attached to the root, with `TargetArmLength` 400 and
  `bUsePawnControlRotation = true`. A `UCameraComponent` attaches to the arm at `USpringArmComponent::SocketName`
  with `bUsePawnControlRotation = false`. The arm sweeps (`bDoCollisionTest`, `ProbeSize`) to pull the camera in
  front of walls. `bEnableCameraLag` smooths movement.
- **Third person in tight interiors** (one data point: a dungeon crawl). The default arm feels broken indoors:
  - What pulls the arm in is mostly **small props and pawns**, not walls. Set small props (crates, shelves, sconces,
    decals with collision) and characters (`characters.md`) to ignore `ECC_Camera`; keep walls and large geometry
    blocking.
  - **Pull in fast, ease out slowly.** Compress the arm immediately when blocked and interpolate it back out
    (a small `USpringArmComponent` subclass, or interp `TargetArmLength`), or the camera pops.
  - A **shorter arm** than the template's 400 with an over-the-shoulder `SocketOffset` suits rooms better (one
    prototype's value: ~240 cm).
  - When the arm compresses near zero (backing into a wall), the near clip plane slices through the player and the
    body shows its hollow inside. Fix both ways: raise the camera over the shoulder as the arm shortens (scale
    `SocketOffset.Z` up as length drops), and **dither-fade the character** when the camera gets close (one
    prototype's fade distance: ~60-80 cm; masked material, `DitherTemporalAA` into Opacity Mask, a `Fade` scalar
    set per tick from camera distance).
    Fade any pawn between the camera and the player the same way, since it no longer pushes the arm in.
- **First person (simple):** a `UCameraComponent` attached to the capsule at eye height (about +60 Z), with
  `bUsePawnControlRotation = true`. Hide the body mesh from its owner with `GetMesh()->SetOwnerNoSee(true)`. If you
  need arms, add a separate arms mesh with `SetOnlyOwnerSee(true)` and `SetCollisionProfileName("NoCollision")`.
  The 5.8 FP template also uses `FirstPersonPrimitiveType` and the camera's `bEnableFirstPersonFieldOfView` /
  `FirstPersonScale` so the arms don't clip into walls. It's optional polish.
- **Top-down / fixed:** a spring arm with absolute rotation (pitch -60 or so) and `bUsePawnControlRotation = false`.
  For a fixed room camera, use a CameraActor and `PlayerController->SetViewTargetWithBlend(CamActor, BlendTime)`.

## Collision

- Every primitive has an **Object Type** (WorldStatic, WorldDynamic, Pawn, PhysicsBody...) and a response
  (Ignore / Overlap / Block) to each object and trace channel. Pick a **profile** (`SetCollisionProfileName`):
  `Pawn`, `BlockAll`, `OverlapAllDynamic`, `NoCollision`, `Trigger`...
- **Block** needs both sides to block. If either side overlaps, you get an overlap. If either side ignores, nothing happens.
- **Overlap events need `Generate Overlap Events` on BOTH components.** It defaults to on for primitives but **off
  for skeletal meshes**. Bind `OnComponentBeginOverlap` / `OnComponentEndOverlap` (component) or
  `OnActorBeginOverlap` (actor) with `AddDynamic` to a `UFUNCTION()`. A handler without `UFUNCTION()` never fires.
  The overlap delegate signature is `(UPrimitiveComponent* OverlappedComp, AActor* Other, UPrimitiveComponent*
  OtherComp, int32 OtherBodyIndex, bool bFromSweep, const FHitResult& Sweep)`.
- **Hit events** (`OnComponentHit`) from physics contacts: `physics.md` "Hit and overlap events".
- Turn off overlap events on static set dressing, because they cost CPU. Trigger volumes should be a box or sphere
  component with the `Trigger` profile, not a mesh.
- Custom channel: add it in Project Settings > Collision, then use `ECC_GameTraceChannel1..` in code
  (`#define COLLISION_INTERACT ECC_GameTraceChannel1`).
- **Traces from C++:**

```cpp
FHitResult Hit;
FCollisionQueryParams Params(SCENE_QUERY_STAT(InteractTrace), /*bTraceComplex*/ false, /*Ignore*/ this);
const FVector Start = Camera->GetComponentLocation();
const FVector End   = Start + Camera->GetForwardVector() * InteractRange;
if (GetWorld()->LineTraceSingleByChannel(Hit, Start, End, ECC_Visibility, Params)) { AActor* A = Hit.GetActor(); }
// Fat trace: GetWorld()->SweepSingleByChannel(Hit, Start, End, FQuat::Identity, ECC_Visibility, FCollisionShape::MakeSphere(20.f), Params);
// Area query: OverlapMultiByChannel(...)
```

- Debug with the `show collision` console command or `DrawDebugLine` (DrawDebugHelpers.h).

## Interaction ("press E to use")

- Use a **C++ interface**, the same shape as the 5.8 template's `SideScrollingInteractable`. It is
  `NotBlueprintable` with a pure virtual, so the logic stays in C++:

```cpp
UINTERFACE(MinimalAPI, NotBlueprintable) class UInteractable : public UInterface { GENERATED_BODY() };
class IInteractable { GENERATED_BODY()
public:
    virtual void Interact(AActor* Interactor) = 0;
    virtual FText GetPrompt() const { return FText::GetEmpty(); }
};
// call site: if (IInteractable* I = Cast<IInteractable>(Hit.GetActor())) I->Interact(this);
```

- Find the target in one of two ways:
  - A camera line trace on the Interact input. This is the cheapest option and right for first person.
  - A sphere component on the player, with overlap begin/end keeping a `TWeakObjectPtr` to the current target.
    This suits third person.
- To show a "Press E" prompt without Tick, run a looping timer at 0.1 s that traces and updates the UI only when
  the target changes.
- Doors, levers and pickups are C++ actors that implement `IInteractable`. Their BP subclasses only assign meshes and sounds.

## Spawning and pooling

- `GetWorld()->SpawnActor<AMyProj>(ProjClass, Transform, Params)`. Pass a `TSubclassOf<>` UPROPERTY (the BP class),
  not `AMyProj::StaticClass()`, so the BP's meshes come along. `Params.SpawnCollisionHandlingOverride =
  ESpawnActorCollisionHandlingMethod::AdjustIfPossibleButAlwaysSpawn` stops a spawn from silently failing inside geometry.
- `SpawnActorDeferred<T>(...)`, then set the properties, then `UGameplayStatics::FinishSpawningActor`: use this when
  `BeginPlay` needs the values.
- **Pool** projectiles, pickups and hit VFX. Pre-spawn N at BeginPlay. To deactivate: `SetActorHiddenInGame(true)`,
  `SetActorEnableCollision(false)`, stop movement and timers. Reactivate in reverse. There is no engine-wide actor
  pool to rely on, so write a small `UWorldSubsystem` or a manager on the GameMode.

## Timers (instead of Tick)

- `GetWorldTimerManager().SetTimer(Handle, this, &AThing::Fire, Rate, /*bLoop*/ true, /*FirstDelay*/ -1.f);`
  A lambda overload exists: `SetTimer(Handle, [this]{...}, Rate, bLoop)`. One-frame defer: `SetTimerForNextTick`.
- Keep the `FTimerHandle` as a member. Calling `SetTimer` with an existing handle replaces that timer.
  `ClearTimer(Handle)` and `ClearAllTimersForObject(this)` cancel. A rate <= 0 also clears.
- If the target object is destroyed, its timers are cancelled automatically. A lambda capturing `this` is **not**
  protected that way, so clear it in `EndPlay` or use the UObject overload.
- Change a rate by calling `SetTimer` again; it can't be edited in place. `PauseTimer` / `UnPauseTimer` freeze the timer.
- Game thread only.

## Damage

- Built-in and good enough: `UGameplayStatics::ApplyDamage(Target, Amount, InstigatorController, Causer,
  DamageTypeClass)`. A null damage type is replaced with `UDamageType`, and `Amount == 0` does nothing.
  `ApplyPointDamage` / `ApplyRadialDamage` also exist.
- Receive it by overriding `virtual float TakeDamage(float, FDamageEvent const&, AController*, AActor*)`. Call
  `Super` first, because it fires `OnTakeAnyDamage`. Then subtract health and return the damage applied. Put health
  in a small `UHealthComponent` if more than one actor class needs it.

## Saving (brief)

- Subclass `USaveGame` with `UPROPERTY()` fields. Only UPROPERTYs are serialized; raw pointers to level actors are
  not, so save IDs or names. `UGameplayStatics::CreateSaveGameObject(UMySave::StaticClass())`, then
  `AsyncSaveGameToSlot(Obj, "Slot0", 0)` (Epic recommends async; it avoids a hitch) or `SaveGameToSlot` while paused
  or in menus. Load with `DoesSaveGameExist`, then `LoadGameFromSlot` and a `Cast`. The file is
  `Saved/SaveGames/Slot0.sav`.
- A 5-10 minute game probably needs only settings, best time and checkpoint. Don't build a save system you don't need.

## Level transitions (brief)

- `UGameplayStatics::OpenLevel(this, FName("Main"))`, or `OpenLevelBySoftObjectPtr(this, LevelSoftPtr)`, which
  survives renames. Everything except the GameInstance is destroyed. Our scope is one playable space, so use this
  mainly for menu to game and game to credits.
- Packaged builds only include maps listed in Project Settings > Packaging > "List of maps to include". A missing
  map is a classic "works in PIE, black screen in build" bug (unverified for 5.8 UI wording).
- To restart the level: `OpenLevel` with the current level name. Reset the GameMode state rather than relying on
  leftovers.

## Montages and attached props

- **Never let a full-body montage play under locomotion.** Lock movement for the montage's full
  `UAnimSequenceBase::GetPlayLength`, or let input stop it with a blend-out (`Montage_Stop(BlendOut, M)`).
- **`ACharacter::PlayAnimMontage` returns the unscaled length.** It calls `Montage_Play` with the default
  `EMontagePlayReturnType::MontageLength`, ignoring both the play rate and `RateScale`. Timers derived from it
  (stagger, lock) desync from a montage with `RateScale` != 1: call `Montage_Play(M, Rate, EMontagePlayReturnType::Duration)`, or divide by the rate.
  Simpler still: retime the clip itself and keep `RateScale` at 1.
- **Attached props on death:** death clips are made for an empty hand, so a held prop drives through the floor.
  Detach it to physics (simple collision, `PhysicsActor` profile, the hand's velocity) when it nears a traced floor.
  Component world bounds and the capsule bottom are not floor tests (a tilted mesh's AABB dips below; the capsule
  floats ~2 cm up).

## Verification lessons (from a prototype)

- **Test the feel, not the binding.** A grab "worked" in logs but held 0.03-0.97 s with almost no visual change, so the
  player reported it broken. Done means: visible from the gameplay camera within ~0.2 s, lasts long enough to read,
  ends for a logged reason (log duration and reason when a timed state ends).
- **Autoplay hooks are great for captures and benchmarks but bypass input.** Keep an autoplay cvar (the player driven
  by bot logic) and test input separately with real keys (`docs/ue/debugging.md` F).
- **Prove a "can't leave here" boundary with a pawn-sized walk, not with the rule that placed it.** A fence placed
  where the ground 6 m out fell 2.5 m still let a capsule walked sideways off the path get down at 13 places, where
  the slope fell steadily (35-50%). The check: `capsule_trace_single_by_profile` (profile Pawn, the player's capsule)
  stepped 0.5 m at a time off every edge, an unwalkable rise counting as a wall; any route out is a hole. If the game
  has a walked route, the kit's traversal survey and route walker find invisible walls and stuck spots along it
  (`debugging.md` F).
- **After any scripted level rebuild, run a full autoplay playthrough**: rebuilds can silently break references, and
  on one prototype, characters silently headed back to their start point and nobody noticed for minutes.

## Verified against

- `Templates/TP_ThirdPerson/Source/TP_ThirdPerson/TP_ThirdPersonCharacter.{h,cpp}`: capsule size, the CMC values
  listed, the spring arm/camera setup, the BindAction calls and ETriggerEvent usage.
- `.../TP_ThirdPersonPlayerController.cpp`: `ULocalPlayer::GetSubsystem<UEnhancedInputLocalPlayerSubsystem>(GetLocalPlayer())`,
  `AddMappingContext(Ctx, 0)` in `SetupInputComponent`, `IsLocalPlayerController()`. `TP_ThirdPerson.Build.cs`: `"EnhancedInput"`.
- `Templates/TP_FirstPerson/.../TP_FirstPersonCharacter.cpp`: the FP camera, `SetOnlyOwnerSee`,
  `SetOwnerNoSee`, `FirstPersonPrimitiveType`, `bEnableFirstPersonFieldOfView`.
- `.../Variant_SideScrolling/Interfaces/SideScrollingInteractable.h`: the NotBlueprintable interface pattern.
  The Variant_Combat sources: SetTimer, SpawnActor with AdjustIfPossibleButAlwaysSpawn, the TakeDamage override.
- `Engine/Plugins/EnhancedInput/Source/EnhancedInput/Public/`: `EnhancedInputSubsystemInterface.h:265`
  (`AddMappingContext(const UInputMappingContext*, int32 Priority, const FModifyContextOptions& = {})`),
  `EnhancedInputComponent.h:482` (BindAction), `InputTriggers.h:34` (ETriggerEvent values; Combo deprecated 5.8),
  `InputModifiers.h` (Negate, SwizzleAxis, DeadZone, Scalar).
- `Engine/Source/Runtime/Engine/Classes/`: `Kismet/GameplayStatics.h` (OpenLevel, OpenLevelBySoftObjectPtr,
  ApplyDamage, CreateSaveGameObject, (Async)SaveGameToSlot, LoadGameFromSlot, DoesSaveGameExist),
  `GameFramework/Actor.h:3660` (TakeDamage), `Engine/World.h` (LineTraceSingleByChannel, SweepSingleByChannel,
  OverlapMultiByChannel, SpawnActor, SpawnActorDeferred), `GameFramework/GameModeBase.h` (the default class
  properties), `GameFramework/CharacterMovementComponent.h` and `Character.h` (tunables, Jump, LaunchCharacter,
  JumpMaxCount, Crouch), `Components/PrimitiveComponent.h` (SetGenerateOverlapEvents, the overlap delegate
  signature), `Engine/EngineTypes.h` (ECC_GameTraceChannel1).
- `Engine/Public/TimerManager.h` (SetTimer overloads, ClearTimer, ClearAllTimersForObject, SetTimerForNextTick).
- `Engine/Private/Components/*.cpp`: overlap events are on in the UPrimitiveComponent constructor and off in
  SkeletalMeshComponent. `GameplayStatics.cpp:793`: null DamageType is replaced and zero damage is skipped.
  SaveGameToSlot does not set ArIsSaveGame, so plain UPROPERTY() fields serialize.

## Sources (5.8)

- Gameplay framework: https://dev.epicgames.com/documentation/en-us/unreal-engine/gameplay-framework-in-unreal-engine?application_version=5.8
- Enhanced Input: https://dev.epicgames.com/documentation/en-us/unreal-engine/enhanced-input-in-unreal-engine?application_version=5.8
- Collision overview: https://dev.epicgames.com/documentation/en-us/unreal-engine/collision-in-unreal-engine---overview?application_version=5.8
- Gameplay timers: https://dev.epicgames.com/documentation/en-us/unreal-engine/gameplay-timers-in-unreal-engine?application_version=5.8
- Saving and loading: https://dev.epicgames.com/documentation/en-us/unreal-engine/saving-and-loading-your-game-in-unreal-engine?application_version=5.8
- Root motion: https://dev.epicgames.com/documentation/en-us/unreal-engine/root-motion-in-unreal-engine?application_version=5.8
- EnhancedInput API index (trigger and modifier classes): https://dev.epicgames.com/documentation/en-us/unreal-engine/API/Plugins/EnhancedInput
- IEnhancedInputSubsystemInterface (QueryKeysMappedToAction): https://dev.epicgames.com/documentation/en-us/unreal-engine/API/Plugins/EnhancedInput/IEnhancedInputSubsystemInterface
- UEnhancedInputUserSettings: https://dev.epicgames.com/documentation/en-us/unreal-engine/API/Plugins/EnhancedInput/UEnhancedInputUserSettings
- FMapPlayerKeyArgs: https://dev.epicgames.com/documentation/en-us/unreal-engine/API/Plugins/EnhancedInput/FMapPlayerKeyArgs
- UEnhancedInputDeveloperSettings: https://dev.epicgames.com/documentation/en-us/unreal-engine/API/Plugins/EnhancedInput/UEnhancedInputDeveloperSettings
- Enhanced Input in Parrot (remapping sample): https://dev.epicgames.com/documentation/unreal-engine/enhanced-input-in-parrot-for-unreal-engine

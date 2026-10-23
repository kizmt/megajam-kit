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
| `ACharacter` | Pawn with capsule, skeletal mesh and `UCharacterMovementComponent` (walk, jump, fall, swim, fly) | **Yes**, for any walking player |
| `APawn` | Base for anything controllable (vehicle, top-down cursor, camera rig) | Only if the player does not walk |
| `AGameStateBase` | Game-wide replicated state (score, objectives) | Optional. In single player, the GameMode can hold it |
| `APlayerState` | Per-player replicated data | **Skip**. Keep health and inventory on the Character or a component |
| `AHUD` | Legacy canvas drawing | **Skip**. Create UMG widgets from the PlayerController |
| `UGameInstance` | Lives from launch to quit and survives `OpenLevel` | Only if data must cross level loads, such as settings or a run timer |

- In the GameMode constructor, set `DefaultPawnClass`, `PlayerControllerClass`, and optionally `HUDClass`,
  `GameStateClass` and `PlayerStateClass`. Point them at the **BP subclasses** (`BP_PlayerCharacter`), because the
  BP is where the meshes are assigned. Then set the GameMode in World Settings > GameMode Override or in Project
  Settings > Maps & Modes.
- Do not hard-code asset paths in C++. The templates leave mesh and anim BP references to the derived Blueprint.

## Character and CharacterMovementComponent

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
- **Third-person rotation setup:** set the Character's `bUseControllerRotationYaw/Pitch/Roll = false` and
  `bOrientRotationToMovement = true`, so the body turns toward movement and the camera orbits freely.
  **First-person:** keep `bUseControllerRotationYaw = true` (the APawn default), so the body turns with the mouse.
- **Data-driven tuning:** put speed, jump and air control in a `UPrimaryDataAsset` (for example
  `UPlayerTuningData`), reference it with `UPROPERTY(EditDefaultsOnly) TObjectPtr<UPlayerTuningData> Tuning`, and
  copy the values onto `GetCharacterMovement()` in `BeginPlay`. Constructor defaults are only fallbacks.
- `ACharacter` keeps its actor tick, and the CMC ticks as a component. That is correct, so leave it. Our tick-off rule
  is for our own actors and our own logic. Don't put polling in the character's `Tick`.
- **Root motion:** skip it unless an animation must drive the movement, such as a dodge or a climb. The animation
  needs "Enable Root Motion", and the AnimBP needs Root Motion Mode. "Root Motion from Montages Only" is the sane
  choice: play the montage with `PlayAnimMontage`. While the character walks or falls, the Z axis of root motion is
  ignored and gravity still applies. Root-motion modes push the anim graph update onto the game thread, which costs CPU.

## Enhanced Input (the only input path in 5.8)

- **Never** use the legacy `BindAxis` / `BindAction(FName, IE_Pressed...)` or the ActionMappings in Project Settings.
  Those are old-version patterns.
- Add `"EnhancedInput"` to the module's `PublicDependencyModuleNames` in Build.cs (the template does). The plugin is
  on by default.
- Assets: one `UInputAction` (IA_) per verb, with Value Type Bool, Axis1D, Axis2D (FVector2D) or Axis3D. One
  `UInputMappingContext` (IMC_) maps keys to actions, with per-key **modifiers** and **triggers**.
  - WASD into one Axis2D `IA_Move`: W = no modifier. S = `Negate`. D = `Swizzle Input Axis Values` (YXZ).
    A = Swizzle + Negate. A missing Swizzle makes W/S move sideways (a classic bug).
  - Common modifiers: `Negate`, `SwizzleAxis`, `DeadZone` (gamepad sticks), `Scalar` (sensitivity).
  - Common triggers: none (= Down, fires every frame while held), `Pressed` (once), `Released`, `Hold`, `Tap`, `Pulse`.
    Put "press E once" behaviour in a `Pressed` trigger on the IA, or bind `ETriggerEvent::Started`.
- **Add the mapping context in the PlayerController**, local players only. This is the template pattern:

```cpp
void AMyPlayerController::SetupInputComponent()
{
    Super::SetupInputComponent();
    if (!IsLocalPlayerController()) return;
    if (auto* Subsys = ULocalPlayer::GetSubsystem<UEnhancedInputLocalPlayerSubsystem>(GetLocalPlayer()))
    {
        Subsys->AddMappingContext(DefaultMappingContext, /*Priority*/ 0);   // UPROPERTY(EditAnywhere) TObjectPtr<UInputMappingContext>
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
- Input-action UPROPERTYs are `EditAnywhere` on the C++ class and assigned in the BP subclass. A null action
  silently does nothing, so check the BP first when "input doesn't work".
- Swap contexts for modes (gameplay, menu, vehicle) with `AddMappingContext` / `RemoveMappingContext` (`ClearAllMappings()` also exists).
  When several contexts map the same key, the higher priority wins.
- Menus: in the PlayerController call `SetInputMode(FInputModeUIOnly / GameAndUI / GameOnly)` and set
  `bShowMouseCursor`.
- `UInputTriggerCombo` is **deprecated in 5.8**. Don't use it.

## Cameras

- **Third person** (template pattern): `USpringArmComponent` attached to the root, with `TargetArmLength` 400 and
  `bUsePawnControlRotation = true`. A `UCameraComponent` attaches to the arm at `USpringArmComponent::SocketName`
  with `bUsePawnControlRotation = false`. The arm sweeps (`bDoCollisionTest`, `ProbeSize`) to pull the camera in
  front of walls. `bEnableCameraLag` smooths movement.
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
- **Hit events** (`OnComponentHit`) on blocking contacts need "Simulation Generates Hit Events". Resting contact
  can fire them every frame, so filter.
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

- `UGameplayStatics::OpenLevel(this, FName("L_Main"))`, or `OpenLevelBySoftObjectPtr(this, LevelSoftPtr)`, which
  survives renames. Everything except the GameInstance is destroyed. Our scope is one playable space, so use this
  mainly for menu to game and game to credits.
- Packaged builds only include maps listed in Project Settings > Packaging > "List of maps to include". A missing
  map is a classic "works in PIE, black screen in build" bug (unverified for 5.8 UI wording).
- To restart the level: `OpenLevel` with the current level name. Reset the GameMode state rather than relying on
  leftovers.

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

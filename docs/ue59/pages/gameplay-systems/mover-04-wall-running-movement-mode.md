# Wall Running Movement Mode

https://dev.epicgames.com/documentation/en-us/unreal-engine/mover-04-wall-running-movement-mode?application_version=5.9

> Build a Movement Mode in C++ that gives a character the ability to run along walls and jump from wall to wall.

[image: Wall Running Movement Mode]

Learn to use this **Experimental** feature, but use caution when shipping with it.

The player character you’ve been building in this tutorial now has a Sprint Movement Modifier and Grappling Hook Movement Mode. In this part of the series, you’ll implement another Movement Mode class that gives the player the ability to run along walls if the player is moving fast enough. Understanding both the Grappling Hook and Wall Run implementations gives you a good base for learning the Mover system so you can start creating your own custom Movement Modes.

Similar to the Grappling Hook, creating the Wall Run move also involves making an Actor Component that checks for wall running conditions and facilitates communication between the Pawn and Movement Mode. Unlike with the Grappling Hook, the player still has some control over character movement and can perform a jump action while in the Wall Run Movement Mode.

The wall running Actor Component will perform line traces to the sides of the character, detecting walls and passing information about the wall and wall jump status to the Wall Run Movement Mode. When the Movement Mode is active, it automatically moves the player along the wall until the wall run ends. You’ll also implement wall jumping and modify the Pawn’s existing jump logic to execute the wall jump.

## Create the Wall Running Component

Your Wall Run Actor Component will be responsible for:

- Finding valid walls and wall information using a line trace.
- Handling wall jump requests.
- Enforcing cooldowns to prevent re-entering a wall run and restarting jump input.

### Set Up a New Actor Component Class

To set up a new Wall Running component, follow these steps:

- In Unreal Editor, go to **Tools > New C++ Class** and create a new **Actor Component** class.
- Name the class `WallRunActorComponent` and click **Create Class**.
- Declare the following exposed public functions. Give them a `UFUNCTION` macro with `BlueprintCallable` and `Category = “Wall Run”`.`bool FindWall(FVector& OutWallLocation, FVector& OutWallNormal) const;`
- `void SetWallJump();`
- `void SetCooldown();`
- `void ResetCooldown();`
- `void ResetWallJump();`

- Declare a `public` `bool` variable named `bShouldWallJump` and set its default value to `false`. No `UPROPERTY` macro is needed here. C++ ```
// Copyright Epic Games, Inc. All Rights Reserved.

#pragma once

#include "CoreMinimal.h"
#include "Components/ActorComponent.h"
#include "WallRunActorComponent.generated.h"

UCLASS( ClassGroup=(Custom), meta=(BlueprintSpawnableComponent) )
```
- Declare `protected` variables. Expose them to Blueprints with a `UPROPERTY` that contains `EditAnywhere` and `Category = "Wall Run"`. `float TraceDistance = 85.f;`
- `bool bIsOnCooldown = false;`
- `float ForwardAngleDegrees = 15.f;`
- `float WallRunCD = 0.8f;`
- `float WallJumpCD = 0.2f;`
- `float WallNormalTolerance = 0.35f;`

 C++

```
protected:
	// How long the line trace will be
	UPROPERTY(EditAnywhere, Category = "Wall Run")
	float TraceDistance = 85.f;

	// Indicates if the wall run cooldown is currently active
	UPROPERTY(EditAnywhere, Category = "Wall Run")
	bool bIsOnCooldown = false;

	// The angular offset (degrees) used to bias left/right wall traces more toward the player's forward direction
```

`WallJumpCD` and `bShouldWallJump` also affect normal jumping behavior. No jump movements can activate while `WallJumpCD` is active.

- Also in the `protected` section, declare a `FTimerHandle` for the wall running cooldown and the jump cooldown. C++ ```
	FTimerHandle ResetCDTimerHandle;

	FTimerHandle ResetWallJumpTimerHandle;
``` FTimerHandle ResetCDTimerHandle; FTimerHandle ResetWallJumpTimerHandle; A `TimerHandle` is used by Unreal Engine’s TimerManager to store and control a timer instance. It’s like a remote control for your timer.

The finished `WallRunActorComponent.h` file should look like this:

 C++

```
// Copyright Epic Games, Inc. All Rights Reserved.

#pragma once

#include "CoreMinimal.h"
#include "Components/ActorComponent.h"
#include "WallRunActorComponent.generated.h"

UCLASS( ClassGroup=(Custom), meta=(BlueprintSpawnableComponent) )
```

### Set up WallRunActorComponent.cpp

In `WallRunActorComponent.cpp`, add the following includes:

 C++

```
#include "WallRunActorComponent.h"
// --- New Code Start ---
#include "GameFramework/Actor.h"
#include "Engine/World.h"
// --- New Code End ---
```

#include "WallRunActorComponent.h"
// --- New Code Start ---
#include "GameFramework/Actor.h"
#include "Engine/World.h"
// --- New Code End ---

### Disable Ticking in the Constructor

This Movement Mode uses cooldowns, jump actions, and wall detection to control movement behavior, so per-frame updates and checks aren’t needed. Disable ticking to avoid unnecessary overhead.

The component’s constructor should look like this:

 C++

```
UWallRunActorComponent::UWallRunActorComponent()
{
    PrimaryComponentTick.bCanEverTick = false;
}
```

UWallRunActorComponent::UWallRunActorComponent()
{
 PrimaryComponentTick.bCanEverTick = false;
}

### Define SetCooldown()

`SetCooldown()` starts the wall run cooldown timer.

This component class has functions that work with timers and line traces. These operations use the `UWorld`, which is the top-level runtime context for everything in your level. Always check that the `UWorld` is valid before calling functions or storing pointers that rely on it.

The `SetCooldown()` function does the following:

- Sets `bIsOnCooldown` to true, indicating a wall run cooldown is active.
- Gets the `UWorld` and checks that it’s valid.
- Calls `SetTimer()` on the `UWorld`’s `FTimerManager` so `ResetCooldown()` runs on this component after the wall running cooldown expires. Pass `SetTimer()` the following arguments:`ResetCDTimerHandle`: The FTimerHandle identifier for the timer.
- `this`: The owning object.
- `&UWallRunActorComponent::ResetCooldown`: Pointer to a function to call after the timer has expired.
- `WallRunCD`: The number of seconds the timer should run.
- `false`: Whether the timer loops or not.

 C++

```
void UWallRunActorComponent::SetCooldown()
{
	// Activates wall run cooldown state, blocking wall run attempts
	bIsOnCooldown = true;

	if (UWorld* World = GetWorld())
	{
		// Schedules ResetCooldown() to run after WallRunCD seconds (one-shot timer)
		World->GetTimerManager().SetTimer(
			ResetCDTimerHandle, this, &UWallRunActorComponent::ResetCooldown, WallRunCD, false);
```

### Define ResetCooldown()

`ResetCooldown()` sets `bIsOnCooldown` to false.

 C++

```
void UWallRunActorComponent::ResetCooldown()
{
    bIsOnCooldown = false;
}
```

void UWallRunActorComponent::ResetCooldown()
{
 bIsOnCooldown = false;
}

### Define SetWallJump()

`SetWallJump()` performs the same operations as `SetCooldown()` but for the wall jump cooldown.

 C++

```
void UWallRunActorComponent::SetWallJump()
{
	// Marks that a wall jump has been requested (consumed by Movement Mode)
	bShouldWallJump = true;

	if (UWorld* World = GetWorld())
	{
		// Schedules ResetWallJump() to clear the jump request after WallJumpCD seconds (one-shot timer)
		World->GetTimerManager().SetTimer(
			ResetWallJumpTimerHandle, this, &UWallRunActorComponent::ResetWallJump, WallJumpCD, false);
```

### Define ResetWallJump()

`ResetWallJump()` sets `bShouldWallJump` to false.

 C++

```
void UWallRunActorComponent::ResetWallJump()
{
    bShouldWallJump = false;
}
```

void UWallRunActorComponent::ResetWallJump()
{
 bShouldWallJump = false;
}

### Define FindWall()

The `FindWall()` function performs a line trace from either side of the character and then returns `true` if it finds a valid wall and `false` if it doesn’t. The angles of these line traces also mean that the player must be running roughly alongside a wall to detect it — approaching a wall head on won’t register a hit.

The function also sets two parameters to pass by reference:

- `OutWallLocation`: The location of the wall hit by the line trace.
- `OutWallNormal`: The surface normal of the wall hit by the line trace.

The Wall Run Movement Mode uses `OutWallLocation` and `OutWallNormal` to calculate the player's starting position on the wall and the direction they move along its surface.

To implement `FindWall()`, you’ll use rotators to orient line trace directions by applying a yaw offset to a base direction. Vectors are useful when working with directions, while rotators are best when you want to modify orientation.

To define variables and gather data needed for the line trace in `FindWall()`, follow these steps:

- In the function, store the component’s owning player and return `false` if the player isn’t valid. C++ ```
bool UWallRunActorComponent::FindWall(FVector& OutWallLocation, FVector& OutWallNormal) const
{
AActor* Owner = GetOwner();
if (!Owner) return false;

}
``` bool UWallRunActorComponent::FindWall(FVector& OutWallLocation, FVector& OutWallNormal) const { AActor* Owner = GetOwner(); if (!Owner) return false; }
- Return `false` if wall running is currently on cooldown. C++ ```
bool UWallRunActorComponent::FindWall(FVector& OutWallLocation, FVector& OutWallNormal) const
{
AActor* Owner = GetOwner();
if (!Owner) return false;
if (bIsOnCooldown) return false;

}
``` bool UWallRunActorComponent::FindWall(FVector& OutWallLocation, FVector& OutWallNormal) const { AActor* Owner = GetOwner(); if (!Owner) return false; if (bIsOnCooldown) return false; }
- Declare and get two new `FVectors`:`Start`: the player’s current location.
- `Right`: The player’s right vector.

 C++

```
bool UWallRunActorComponent::FindWall(FVector& OutWallLocation, FVector& OutWallNormal) const
{
AActor* Owner = GetOwner();
if (!Owner) return false;
if (bIsOnCooldown) return false;

// --- New Code Start ---
FVector Start = Owner->GetActorLocation();
FVector Right = Owner->GetActorRightVector();
// --- New Code End ---
```

- Convert the player’s `Right` vector into a `FRotator`: Declare a `FRotator` named `RightRot`. An `FRotator` stores the pitch (up/down tilt), yaw (turn left/right), and roll (sideways tilt) around each axis.
- Use `FRotationMatrix::MakeFromX(Right)` to convert the player’s `Right` vector into a full 3D coordinate frame. This rotation matrix uses `Right` as the forward X axis and calculates Y and Z to maintain orthogonality.
- Call `.Rotator();` on the `FRotationMatrix` to convert it to a `FRotator` to store in `RightRot`.The vector is first converted into a rotation matrix to fully define the orientation in 3D space before converting it to a rotator. Converting directly from vector to rotator only defines the forward direction (yaw and pitch).

 C++

```
FRotator RightRot = FRotationMatrix::MakeFromX(Right).Rotator();
```

FRotator RightRot = FRotationMatrix::MakeFromX(Right).Rotator();

- Rotate the `RightRot`’s `Yaw` forward by `ForwardAngleDegrees` to bias the angle forward so a line trace will detect walls the player is moving towards, not directly beside.
- Get the normalized vector of `RightRot` to use in the line trace. C++ ```
bool UWallRunActorComponent::FindWall(FVector& OutWallLocation, FVector& OutWallNormal) const
{
AActor* Owner = GetOwner();
if (!Owner) return false;
if (bIsOnCooldown) return false;

FVector Start = Owner->GetActorLocation();
FVector Right = Owner->GetActorRightVector();

// Rotate the side traces slightly forward
```
- Repeat the process for the left side, using the negated `Right` vector to build the rotation matrix. Because the left direction faces the opposite way, add `ForwardAngleDegrees` to the `Yaw` instead of subtracting it, so both traces angle toward the player's forward direction. C++ ```
// Rotate the side traces slightly forward
FRotator RightRot = FRotationMatrix::MakeFromX(Right).Rotator();
RightRot.Yaw -= ForwardAngleDegrees;
FVector RightDir = RightRot.Vector();

// --- New Code Start ---
FRotator LeftRot = FRotationMatrix::MakeFromX(-Right).Rotator();
LeftRot.Yaw += ForwardAngleDegrees;
FVector LeftDir = LeftRot.Vector();
// --- New Code End ---
``` // Rotate the side traces slightly forward FRotator RightRot = FRotationMatrix::MakeFromX(Right).Rotator(); RightRot.Yaw -= ForwardAngleDegrees; FVector RightDir = RightRot.Vector(); // --- New Code Start --- FRotator LeftRot = FRotationMatrix::MakeFromX(-Right).Rotator(); LeftRot.Yaw += ForwardAngleDegrees; FVector LeftDir = LeftRot.Vector(); // --- New Code End ---
- Declare an array with `LeftDir` and `RightDir` as elements.
- To set up variables and collision query parameters to perform line traces and store hits, declare the following local variables:`FHitResult Hit`
- `FCollisionQueryParams Params;`

Add `AddIgnoredActor(Owner);` to `Params` so line traces ignore the Pawn.

 C++

```
FRotator LeftRot = FRotationMatrix::MakeFromX(-Right).Rotator();
LeftRot.Yaw += ForwardAngleDegrees;
FVector LeftDir = LeftRot.Vector();

// --- New Code Start ---
// Set up traces
TArray<FVector> Directions = { LeftDir, RightDir };

FHitResult Hit;
FCollisionQueryParams Params;
```

Setting up the `Params` variable creates and configures collision query settings for the line traces so the trace doesn’t register hits on the player.

To perform the line trace and save a hit, follow these steps:

- Add a `for` loop that repeats the line trace for each `FVector` (right and left) in the `Directions` array. C++ ```
FHitResult Hit;
FCollisionQueryParams Params;
Params.AddIgnoredActor(Owner);

// --- New Code Start ---
for (const FVector& Dir : Directions)
{

}
// --- New Code End ---
``` FHitResult Hit; FCollisionQueryParams Params; Params.AddIgnoredActor(Owner); // --- New Code Start --- for (const FVector& Dir : Directions) { } // --- New Code End ---
- In the loop, calculate where the trace should end by starting at the player and moving `TraceDistance` units (cm) in the `Dir` vector’s direction. C++ ```
for (const FVector& Dir : Directions)
{
// --- New Code Start ---
FVector End = Start + Dir * TraceDistance;
// --- New Code End ---
}
``` for (const FVector& Dir : Directions) { // --- New Code Start --- FVector End = Start + Dir * TraceDistance; // --- New Code End --- }
- Perform a line trace with `GetWorld()->LineTraceSingleByChannel()`, storing the boolean result in a new variable named `bHit`. Pass the line trace `Hit`, `Start`, `End`, the `ECC_Visibility` collision channel (used for line-of-sight camera checks), and `Params`. This simulates a line trace from `Start` to `End`, colliding with any visible objects that aren’t the player, and stores the hit result data in `Hit`. The line trace returns `true` if it hit something and `false` if it didn’t. C++ ```
for (const FVector& Dir : Directions)
{
FVector End = Start + Dir * TraceDistance;

// --- New Code Start ---
bool bHit = GetWorld()->LineTraceSingleByChannel(Hit, Start, End, ECC_Visibility, Params);
// --- New Code End ---
}
``` for (const FVector& Dir : Directions) { FVector End = Start + Dir * TraceDistance; // --- New Code Start --- bool bHit = GetWorld()->LineTraceSingleByChannel(Hit, Start, End, ECC_Visibility, Params); // --- New Code End --- }

To process the hit result, follow these steps:

- After the line trace and still within the `for` loop, add an `if` statement to check `bHit`. C++ ```
for (const FVector& Dir : Directions)
{
FVector End = Start + Dir * TraceDistance;

bool bHit = GetWorld()->LineTraceSingleByChannel(Hit, Start, End, ECC_Visibility, Params);

// --- New Code Start ---
if (bHit)
{
```
- If there’s a hit, get and save the Actor that was hit, and check that the Actor is valid.
- Ignore the Actor if it has a `NoWallRun` tag. C++ ```
if (bHit)
{
AActor* HitActor = Hit.GetActor();
if (!HitActor) continue;

// If Actor is tagged NoWallRun, skip it and continue to next loop iteration
if (HitActor->ActorHasTag(FName("NoWallRun")))
{
		continue;
}
``` In the level editor, you’ll add this tag to Actors in your level to block wall running on those Actors.
- Get and save the hit’s impact normal, and then calculate the cross product of the impact normal and a `FVector::UpVector`. C++ ```
if (bHit)
{
AActor* HitActor = Hit.GetActor();
if (!HitActor) continue;

// If Actor is tagged NoWallRun, skip it and continue to next loop iteration
if (HitActor->ActorHasTag(FName("NoWallRun")))
{
		continue;
}
``` Similar to the dot product calculations you used in Grappling Hook Movement Mode (-> mover-03-grappling-hook-movement-mode), you can use the **cross product** to measure how different the hit surface **normal **is from an **up** (vertical) vector. The magnitude of the cross product equals the area of the parallelogram formed by these two vectors. The area of that parallelogram is smaller if the vectors are similar and larger if they are perpendicular.So, if the hit surface normal is parallel to the up vector (a floor or ceiling), the cross product is zero; if it’s perpendicular to the up vector (a vertical wall), the cross product has its highest possible magnitude. The length of the cross product vector is large when the hit surface normal (n) is very different from an up vector (and therefore the hit surface is vertical).
- Add an `if` statement to compare the cross product with `WallNormalTolerance`.`Cross.Size()` returns the magnitude of the Cross vector.
- If the hit surface passes the wall check:Get the impact point of the line trace hit and save it to `OutWallLocation`.
- Get the safe normal of the impact normal and save it to `OutWallNormal`.
- Return `true`.

 C++

```
if (bHit)
{
AActor* HitActor = Hit.GetActor();
if (!HitActor) continue;

// If Actor is tagged NoWallRun, skip it
if (HitActor->ActorHasTag(FName("NoWallRun")))
{
		continue;
}
```

- After the `if (bHit)` statement, at the end of the function, return `false`.

The finished `WallRunActorComponent.cpp` file should look like this:

 C++

```
// Copyright Epic Games, Inc. All Rights Reserved.

#include "WallRunActorComponent.h"
#include "GameFramework/Actor.h"
#include "Engine/World.h"

// Sets default values for this component's properties
UWallRunActorComponent::UWallRunActorComponent()
{
	PrimaryComponentTick.bCanEverTick = false;
```

## Create the Wall Running Movement Mode

The Wall Run Movement Mode builds on what you learned implementing the Grappling Hook Movement Mode. With wall running, you’ll use more variables that interact with the movement.

The Movement Mode will:

- Get the location and normal vector from a target wall (passed from the Wall Run Actor Component).
- Tilt the camera to give visual feedback to the player.
- Check the wall’s location and vector every frame in case the wall curves or changes to a different angle.
- Constrict the player camera so they can’t look too far from the direction the Pawn is running along the wall, as it would feel unnatural to look back while wall running forward.

### Create and Set Up the Movement Mode Class

First, create a new Movement Mode class for wall running.

To set up the Wall Run Movement Mode class, follow these steps:

- In Unreal Editor, create a new C++ class of type **BaseMovementMode**. Name it `WallRunMovementMode`.
- In the header file, add the following includes and forward declarations: C++ ```
// Copyright Epic Games, Inc. All Rights Reserved.

#pragma once

#include "CoreMinimal.h"
#include "MovementMode.h"
// --- New Code Start ---
#include "Camera/CameraComponent.h"
#include "WallRunActorComponent.h"
// --- New Code End ---
```
- In the `UCLASS` macro, add `Blueprintable` and `BlueprintType` specifiers.
- In the `public` section, declare the class constructor. C++ ```
UCLASS(Blueprintable, BlueprintType)
class PARKOURGAME_API UWallRunMovementMode : public UBaseMovementMode
{
	GENERATED_BODY()

public:
UWallRunMovementMode(const FObjectInitializer& ObjectInitializer);
};
``` UCLASS(Blueprintable, BlueprintType) class PARKOURGAME_API UWallRunMovementMode : public UBaseMovementMode { GENERATED_BODY() public: UWallRunMovementMode(const FObjectInitializer& ObjectInitializer); };
- Declare overrides for the core functions and `CommonLegacySettings` (same as the Grappling Hook Movement Mode). C++ ```
UCLASS(Blueprintable, BlueprintType)
class PARKOURGAME_API UWallRunMovementMode : public UBaseMovementMode
{
	GENERATED_BODY()

public:
UWallRunMovementMode(const FObjectInitializer& ObjectInitializer);

	virtual void GenerateMove_Implementation(const FMoverSimContext& SimContext, const FMoverTickStartData& StartState,const FMoverTimeStep& TimeStep, FProposedMove& OutProposedMove) const override;
```
- In the cpp file, include the following headers: C++ ```
// Copyright Epic Games, Inc. All Rights Reserved.

#include "WallRunMovementMode.h"
#include "GameFramework/Pawn.h"
#include "Camera/CameraComponent.h"
#include "MoveLibrary/MovementUtils.h"
#include "MoveLibrary/FloorQueryUtils.h"
#include "MoverComponent.h"
#include "DefaultMovementSet/Settings/CommonLegacyMovementSettings.h"
#include "DefaultMovementSet/InstantMovementEffects/BasicInstantMovementEffects.h"
```

### Implement Core Functions

To set up the class constructor and `GenerateMove` functions, follow these steps:

- Add a class constructor that registers shared settings and adds the `Mover_IsOnGround` gameplay tag. C++ ```
UWallRunMovementMode::UWallRunMovementMode(const FObjectInitializer& ObjectInitializer)
	: Super(ObjectInitializer)
{
	SharedSettingsClasses.Add(UCommonLegacyMovementSettings::StaticClass());
	GameplayTags.AddTag(Mover_IsOnGround);
}
``` UWallRunMovementMode::UWallRunMovementMode(const FObjectInitializer& ObjectInitializer) : Super(ObjectInitializer) { SharedSettingsClasses.Add(UCommonLegacyMovementSettings::StaticClass()); GameplayTags.AddTag(Mover_IsOnGround); }
- Add the implementation for `GenerateMove`. This is the same setup used in the Grappling Hook Movement Mode. C++ ```
//Movement handled by simulation tick
void UWallRunMovementMode::GenerateMove_Implementation(const FMoverSimContext& SimContext, const FMoverTickStartData& StartState, const FMoverTimeStep& TimeStep, FProposedMove& OutProposedMove) const
{
	const UMoverComponent* MoverComp = GetMoverComponent();
	const FCharacterDefaultInputs* CharacterInputs = StartState.InputCmd.InputCollection.FindDataByType<FCharacterDefaultInputs>();
	const FMoverDefaultSyncState* StartingSyncState = StartState.SyncState.SyncStateCollection.FindDataByType<FMoverDefaultSyncState>();
	check(StartingSyncState);

	const float DeltaSeconds = TimeStep.StepMs * 0.001f;
```

### Define InitializeWallRun()

`InitializeWallRun()` runs once at the start of a wall run movement once a valid wall is detected. It does the following to set up the initial state needed for wall running:

- Positions the character at a consistent offset from the wall.
- Computes the tangent direction to move along the wall.
- Aligns that direction with the player’s forward movement.
- Applies an initial camera roll based on which side the wall is on.

To implement `InitializeWallRun()`, follow these steps:

- In the header file, in the protected section, declare the function.The function takes the following arguments:`float DeltaSeconds`: time step for the current frame
- `UMoverComponent* MoverComp`: the player’s Mover Component

 C++

```
// Initializes wall run state when a valid wall is first detected
// Computes starting position, movement direction along the wall, and applies initial camera tilt
void InitializeWallRun(float DeltaSeconds, UMoverComponent* MoverComp);
```

// Initializes wall run state when a valid wall is first detected
// Computes starting position, movement direction along the wall, and applies initial camera tilt
void InitializeWallRun(float DeltaSeconds, UMoverComponent* MoverComp);

- Declare the following `public` variables and references: C++ ```
// World-space location where the wall was detected (set by wall detection logic)
UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = Mover)
FVector HitLocation = FVector::ZeroVector;

// Surface normal of the detected wall (used to determine orientation and movement direction)
UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = Mover)
FVector WallNormal = FVector(0, 0, 0);

// Desired offset distance from the wall to keep the character from clipping into it
UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = Mover)
``` Your Pawn Blueprint will use `FindWall()` in the `WallRunActorComponent` to provide `HitLocation` and `WallNormal` to the Movement Mode class.
- In the .cpp file, implement the function. First, calculate the `StartLocation` where the player should begin on the wall by offsetting `HitLocation`. C++ ```
void UWallRunMovementMode::InitializeWallRun(float DeltaSeconds, UMoverComponent* MoverComp)
{
	// Offset start position slightly away from the wall
	StartLocation = HitLocation + WallNormal * DistanceFromWall;

}
``` void UWallRunMovementMode::InitializeWallRun(float DeltaSeconds, UMoverComponent* MoverComp) { // Offset start position slightly away from the wall StartLocation = HitLocation + WallNormal * DistanceFromWall; }
- Calculate the cross product of the detected wall’s surface normal and an up vector and get the safe normal of the resulting vector. Save the result as the `WallTangentVector`, or the direction that runs along the wall’s surface. The wall tangent becomes the axis the player moves along during the wall run. C++ ```
void UWallRunMovementMode::InitializeWallRun(float DeltaSeconds, UMoverComponent* MoverComp)
{
	// Offset start position slightly away from the wall
	StartLocation = HitLocation + WallNormal * DistanceFromWall;

	// --- New Code Start ---
	// Compute a horizontal direction along the wall (perpendicular to wall normal)
	WallTangentVector = FVector::CrossProduct(FVector::UpVector, WallNormal).GetSafeNormal();
	// --- New Code End ---
}
``` void UWallRunMovementMode::InitializeWallRun(float DeltaSeconds, UMoverComponent* MoverComp) { // Offset start position slightly away from the wall StartLocation = HitLocation + WallNormal * DistanceFromWall; // --- New Code Start --- // Compute a horizontal direction along the wall (perpendicular to wall normal) WallTangentVector = FVector::CrossProduct(FVector::UpVector, WallNormal).GetSafeNormal(); // --- New Code End --- } The resulting vector of a cross product is always perpendicular to the input vectors.
- Get and save the player’s current forward vector to compare with the wall tangent vector. C++ ```
void UWallRunMovementMode::InitializeWallRun(float DeltaSeconds, UMoverComponent* MoverComp)
{
	// Offset start position slightly away from the wall
	StartLocation = HitLocation + WallNormal * DistanceFromWall;

	// Compute a horizontal direction along the wall (perpendicular to wall normal)
	WallTangentVector = FVector::CrossProduct(FVector::UpVector, WallNormal).GetSafeNormal();

	// --- New Code Start ---
	// Ensure wall run direction aligns with player forward direction
```
- The wall tangent can point in either direction along the wall. Add an `if` statement that checks if the dot product between the tangent and the player’s forward vector is less than 0. If it is, negate the wall tangent to align it with forward movement. C++ ```
FVector ForwardVector = MoverComp->GetOwner()->GetActorForwardVector();
// --- New Code Start ---
if (FVector::DotProduct(WallTangentVector, ForwardVector) < 0.f)
	WallTangentVector *= -1.f;
// --- New Code End ---
``` FVector ForwardVector = MoverComp->GetOwner()->GetActorForwardVector(); // --- New Code Start --- if (FVector::DotProduct(WallTangentVector, ForwardVector) C++

```
// Ensure wall run direction aligns with player forward direction
FVector ForwardVector = MoverComp->GetOwner()->GetActorForwardVector();
if (FVector::DotProduct(WallTangentVector, ForwardVector) < 0.f)
	WallTangentVector *= -1.f;

// --- New Code Start ---
if (Camera)
{
	// Determine which side of the player the wall is on (left/right)
	FVector PlayerRight = MoverComp->GetOwner()->GetActorRightVector();
```

If the dot product is greater than 0, the wall is on the right side of the player. If the dot product is less than 0, the wall is on their left side.

- In the header file, you set a default `CameraTargetRoll` of `11` degrees, which is appropriate if the wall is on the right side of the player. If the wall is to the left, negate the default value to roll the other way. Declare a new float named `FinalRoll` and set it to the inverse of `CameraTargetRoll` if `WallSideSign` is less than 0.Store the result in a new variable instead of modifying `CameraTargetRoll` (a fixed tuning parameter). Inverting `CameraTargetRoll` directly alters the base configuration for future calculations. C++ ```
if (Camera)
{
	FVector PlayerRight = MoverComp->GetOwner()->GetActorRightVector();
	float WallSideSign = FVector::DotProduct(WallNormal, PlayerRight);
// --- New Code Start ---
	float FinalRoll = (WallSideSign > 0.f ? CameraTargetRoll : -CameraTargetRoll);
// --- New Code End ---
}
``` if (Camera) { FVector PlayerRight = MoverComp->GetOwner()->GetActorRightVector(); float WallSideSign = FVector::DotProduct(WallNormal, PlayerRight); // --- New Code Start --- float FinalRoll = (WallSideSign > 0.f ? CameraTargetRoll : -CameraTargetRoll); // --- New Code End --- }
- Get the current relative rotation of the player camera, set the roll to `FinalRoll`, and then apply the new rotation settings back to the camera component. C++ ```
if (Camera)
{
	FVector PlayerRight = MoverComp->GetOwner()->GetActorRightVector();
	float WallSideSign = FVector::DotProduct(WallNormal, PlayerRight);
	float FinalRoll = (WallSideSign > 0.f ? CameraTargetRoll : -CameraTargetRoll);

// --- New Code Start ---
	TargetRot = Camera->GetRelativeRotation();
	TargetRot.Roll = FinalRoll;
	Camera->SetRelativeRotation(TargetRot);
```
- After the `if` statement, set `bIsLocationInitialized` to `true` to avoid calling this function again in future frames.

Your finished `InitializeWallRun()` function should look like this:

 C++

```
void UWallRunMovementMode::InitializeWallRun(float DeltaSeconds, UMoverComponent* MoverComp)
{
	// Offset start position slightly away from the wall
	StartLocation = HitLocation + WallNormal * DistanceFromWall;

	// Compute a horizontal direction along the wall (perpendicular to wall normal)
	WallTangentVector = FVector::CrossProduct(FVector::UpVector, WallNormal).GetSafeNormal();

	// Ensure wall run direction aligns with player forward direction
	FVector ForwardVector = MoverComp->GetOwner()->GetActorForwardVector();
```

### Define ApplyMovementAlongWall()

`ApplyMovementAlongWall()` uses the setup from `InitializeWallRun()` to move the player continuously along the wall each frame of the wall run movement.

This function:

- Advances the character along the wall tangent (the direction computed during initialization).
- Orients the player to face down the wall tangent.
- Maintains a consistent offset from the wall surface and keeps movement aligned to the wall plane.

To implement `ApplyMovementAlongWall()`, follow these steps:

- In the header file, in the protected section, declare the function with the following arguments:`float DeltaSeconds`: The time step for the current frame.
- `UMoverComponent* MoverComp`: The player's Mover Component.
- `USceneComponent* UpdatedComponent`: The scene component to move.
- `FMoverDefaultSyncState& OutputSyncState`: The Mover sync state to update.

 C++

```
// Moves the character along the wall surface each tick
void ApplyMovementAlongWall(float DeltaSeconds, UMoverComponent* MoverComp, USceneComponent* UpdatedComponent, FMoverDefaultSyncState& OutputSyncState);
```

// Moves the character along the wall surface each tick
void ApplyMovementAlongWall(float DeltaSeconds, UMoverComponent* MoverComp, USceneComponent* UpdatedComponent, FMoverDefaultSyncState& OutputSyncState);

- Declare the following `public` variables: C++ ```
// Tracks how long the current wall run interpolation has been active, in seconds
float ElapsedTime = 0.f;

// Duration in seconds for the lerp alpha to travel from 0 to 1
UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = Mover)
float TotalTime = 1.3f;

// Speed at which the character moves along the wall surface, in units (cm) per second
UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = Mover)
float WallRunSpeed = 1500.f;
```
- In the `.cpp` file, define `ApplyMovementAlongWall()` and increment `ElapsedTime` by `DeltaSeconds`: C++ ```
void UWallRunMovementMode::ApplyMovementAlongWall(float DeltaSeconds, UMoverComponent* MoverComp, USceneComponent* UpdatedComponent, FMoverDefaultSyncState& OutputSyncState)
{
	// Advance elapsed time for this frame
	ElapsedTime += DeltaSeconds;
}
``` void UWallRunMovementMode::ApplyMovementAlongWall(float DeltaSeconds, UMoverComponent* MoverComp, USceneComponent* UpdatedComponent, FMoverDefaultSyncState& OutputSyncState) { // Advance elapsed time for this frame ElapsedTime += DeltaSeconds; }
- To move the player each frame, you’ll lerp them from their current location forward by `WallRunSpeed` cm/s. Declare a new `FVector` to calculate and store the lerp endpoint. Add `WallTangentVector` scaled by `WallRunSpeed` to `StartLocation`. C++ ```
void UWallRunMovementMode::ApplyMovementAlongWall(float DeltaSeconds, UMoverComponent* MoverComp, USceneComponent* UpdatedComponent, FMoverDefaultSyncState& OutputSyncState)
{
	// Advance elapsed time for this frame
	ElapsedTime += DeltaSeconds;

// --- New Code Start ---
// Calculate the lerp target
FVector LerpEndLocation = StartLocation + WallTangentVector * WallRunSpeed;
// --- New Code End ---
}
``` void UWallRunMovementMode::ApplyMovementAlongWall(float DeltaSeconds, UMoverComponent* MoverComp, USceneComponent* UpdatedComponent, FMoverDefaultSyncState& OutputSyncState) { // Advance elapsed time for this frame ElapsedTime += DeltaSeconds; // --- New Code Start --- // Calculate the lerp target FVector LerpEndLocation = StartLocation + WallTangentVector * WallRunSpeed; // --- New Code End --- }
- For the lerp’s alpha weight, calculate the ratio of `ElapsedTime` to `TotalTime`. C++ ```
// Calculate the lerp target
FVector LerpEndLocation = StartLocation + WallTangentVector * WallRunSpeed;

// --- New Code Start ---
// Interpolation weight: 0 at the start of the lerp, 1 at TotalTime seconds
float Alpha = ElapsedTime / TotalTime;
// --- New Code End ---
``` // Calculate the lerp target FVector LerpEndLocation = StartLocation + WallTangentVector * WallRunSpeed; // --- New Code Start --- // Interpolation weight: 0 at the start of the lerp, 1 at TotalTime seconds float Alpha = ElapsedTime / TotalTime; // --- New Code End ---
- Lerp `LocationToPlaceActor` between `StartLocation` and `LerpEndLocation` using `Alpha`. Set the world location of `UpdatedComponent` to `LocationToPlaceActor`. C++ ```
// Interpolation weight: 0 at the start of the lerp, 1 at TotalTime seconds
float Alpha = ElapsedTime / TotalTime;

// --- New Code Start ---
// Lerp the character's placement location between start and target
LocationToPlaceActor = FMath::Lerp(StartLocation, LerpEndLocation, Alpha);
// --- New Code End ---
``` // Interpolation weight: 0 at the start of the lerp, 1 at TotalTime seconds float Alpha = ElapsedTime / TotalTime; // --- New Code Start --- // Lerp the character's placement location between start and target LocationToPlaceActor = FMath::Lerp(StartLocation, LerpEndLocation, Alpha); // --- New Code End --- When you implement `SimulationTick` later in this part of the tutorial, you’ll make `StartLocation` and `ElapsedTime` update every frame. This means that each frame, the player restarts a new lerp from their current position towards a fresh target ahead; they are always near the beginning of a new lerp and they should never reach `LerpEndLocation`.
- Apply the new location to `UpdatedComponent`. C++ ```
// Lerp the character's placement location between start and target
LocationToPlaceActor = FMath::Lerp(StartLocation, LerpEndLocation, Alpha);

// --- New Code Start ---
UpdatedComponent->SetWorldLocation(LocationToPlaceActor);
// --- New Code End ---
``` // Lerp the character's placement location between start and target LocationToPlaceActor = FMath::Lerp(StartLocation, LerpEndLocation, Alpha); // --- New Code Start --- UpdatedComponent->SetWorldLocation(LocationToPlaceActor); // --- New Code End --- Just like in the Grappling Hook Movement Mode, you’ll define `UpdatedComponent` in `SimulationTick`’s setup code, retrieving it from Mover. It’s the scene component that Mover moves in the world (usually the Pawn’s root collision component).
- Apply the correct movement direction and orientation to the Pawn while on the wall:Set `UpdatedComponent`’s velocity to `WallTangentVector * WallRunSpeed` to orient the character in the correct direction. C++ ```
// Apply location, velocity, and rotation to UpdatedComponent
UpdatedComponent->SetWorldLocation(LocationToPlaceActor);
// --- New Code Start ---
UpdatedComponent->ComponentVelocity = WallTangentVector * WallRunSpeed;
// --- New Code End ---
``` // Apply location, velocity, and rotation to UpdatedComponent UpdatedComponent->SetWorldLocation(LocationToPlaceActor); // --- New Code Start --- UpdatedComponent->ComponentVelocity = WallTangentVector * WallRunSpeed; // --- New Code End ---
- To rotate the player and ensure they continue to face down the wall, you’ll need to pass a rotator yaw value to `UpdatedComponent`.Use `ToOrientationRotator()` to convert `WallTangentVector` to a `FRotator` and store the result in a new variable named `WallRunRotation`. Then, zero out the pitch and roll to keep the character upright. C++ ```
// Apply location, velocity, and rotation to UpdatedComponent
UpdatedComponent->SetWorldLocation(LocationToPlaceActor);
UpdatedComponent->ComponentVelocity = WallTangentVector * WallRunSpeed;

// --- New Code Start ---
FRotator WallRunRotation = WallTangentVector.ToOrientationRotator();
// Keep the character upright; zero out pitch and roll
WallRunRotation.Pitch = WallRunRotation.Roll = 0.f;
// --- New Code End ---
``` // Apply location, velocity, and rotation to UpdatedComponent UpdatedComponent->SetWorldLocation(LocationToPlaceActor); UpdatedComponent->ComponentVelocity = WallTangentVector * WallRunSpeed; // --- New Code Start --- FRotator WallRunRotation = WallTangentVector.ToOrientationRotator(); // Keep the character upright; zero out pitch and roll WallRunRotation.Pitch = WallRunRotation.Roll = 0.f; // --- New Code End ---
- Apply the new rotation to `UpdatedComponent`. C++ ```
// Keep the character upright; zero out pitch and roll
WallRunRotation.Pitch = WallRunRotation.Roll = 0.f;
// --- New Code Start ---
UpdatedComponent->SetWorldRotation(WallRunRotation);
// --- New Code End ---
``` // Keep the character upright; zero out pitch and roll WallRunRotation.Pitch = WallRunRotation.Roll = 0.f; // --- New Code Start --- UpdatedComponent->SetWorldRotation(WallRunRotation); // --- New Code End ---

- Update the `OutputSyncState` to keep Mover in sync with the player’s state: Call `OutputSyncState.SetTransforms_WorldSpace()`, passing the same location, rotation, and world velocity you just applied to `UpdatedComponent`. C++ ```
UpdatedComponent->SetWorldRotation(WallRunRotation);

// --- New Code Start ---
// Sync OutputSyncState with the same transforms to keep Mover in sync
OutputSyncState.SetTransforms_WorldSpace(
LocationToPlaceActor,
WallRunRotation,
WallTangentVector * WallRunSpeed,
	FVector::ZeroVector,
nullptr);
``` Remember that `UpdatedComponent` and `OutputSyncState` must always receive identical transforms. Mover uses both to track the character's position, and mismatched values can cause desync.
- As long as there is a wall, the player should never reach the end of the lerp, but it’s best practice to add a safety check just in case this happens. At the end of the function, add an `if` statement to check if `Alpha` is approaching 1. In the `if` statement, reset `ElapsedTime` and set `StartLocation` to the character's current world location so the next call of this function can calculate a new lerp end target further in front of the player. C++ ```
// Sync OutputSyncState with the same transforms to keep Mover in sync
OutputSyncState.SetTransforms_WorldSpace(
       LocationToPlaceActor,
       WallRunRotation,
       WallTangentVector * WallRunSpeed,
	FVector::ZeroVector,
       nullptr);

// --- New Code Start ---
// Safety fallback: reset interpolation state if Alpha approaches 1
```

Your finished `ApplyMovementAlongWall()` function should look like this:

 C++

```
void UWallRunMovementMode::ApplyMovementAlongWall(
	float DeltaSeconds, UMoverComponent* MoverComp,
	USceneComponent* UpdatedComponent, FMoverDefaultSyncState& OutputSyncState)
{
	// Advance elapsed time for this frame
	ElapsedTime += DeltaSeconds;

	// Calculate the lerp target: one WallRunSpeed unit along the wall from StartLocation
	FVector LerpEndLocation = StartLocation + WallTangentVector * WallRunSpeed;
```

### Define ProcessWallJump()

`ProcessWallJump()` checks whether a wall jump has been requested and, if so, applies the appropriate launch velocity and transitions the character to Falling.

This function:

- Checks if a wall jump has been requested.
- Applies a launch velocity that carries the character off the wall and upward.
- Transitions to Falling Movement Mode.

To implement `ProcessWallJump()`, follow these steps:

- In the header file, declare `ProcessWallJump()` with a `bool` return type. The function takes the following arguments: C++ ```
// Checks if a wall jump has been requested and, if so, applies the launch velocity and transitions to Falling
bool ProcessWallJump(UMoverComponent* MoverComp, USceneComponent* UpdatedComponent, FMoverDefaultSyncState& OutputSyncState, const FVector& FoundWallNormal, const FVector& FoundWallLocation);
``` // Checks if a wall jump has been requested and, if so, applies the launch velocity and transitions to Falling bool ProcessWallJump(UMoverComponent* MoverComp, USceneComponent* UpdatedComponent, FMoverDefaultSyncState& OutputSyncState, const FVector& FoundWallNormal, const FVector& FoundWallLocation);
- Declare the following `public` member variables: C++ ```
// Velocity applied along the wall tangent when the character performs a wall jump
UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = Mover)
float WallJumpForwardVelocity = 1500.f;

// Velocity applied away from the wall surface when the character performs a wall jump
UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = Mover)
float WallJumpHorizontalVelocity = 500.f;

// Velocity applied upward when the character performs a wall jump
UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = Mover)
```
- In the `.cpp` file, define `ProcessWallJump()`. Start with an `if` statement that checks that `WallRunComponent` has a value and `bShouldWallJump` is `true`. For this function, all code except for a return statement goes inside this `if` statement. C++ ```
bool UWallRunMovementMode::ProcessWallJump(UMoverComponent* MoverComp, USceneComponent* UpdatedComponent, FMoverDefaultSyncState& OutputSyncState, const FVector& FoundWallNormal, const FVector& FoundWallLocation)
{
	// Check if a wall jump has been requested
if (WallRunComponent && WallRunComponent->bShouldWallJump)
	{
	}
}
``` bool UWallRunMovementMode::ProcessWallJump(UMoverComponent* MoverComp, USceneComponent* UpdatedComponent, FMoverDefaultSyncState& OutputSyncState, const FVector& FoundWallNormal, const FVector& FoundWallLocation) { // Check if a wall jump has been requested if (WallRunComponent && WallRunComponent->bShouldWallJump) { } }
- Inside the `if` statement, create a new `WallRunRotation` rotator from `WallTangentVector` and zero out its pitch and roll. C++ ```
if (WallRunComponent && WallRunComponent->bShouldWallJump)
{
	// --- New Code Start ---
// Build rotation from wall tangent direction, keeping the character upright
FRotator WallRunRotation = WallTangentVector.ToOrientationRotator();
WallRunRotation.Pitch = 0.f;
WallRunRotation.Roll = 0.f;
	// --- New Code End ---
}
``` if (WallRunComponent && WallRunComponent->bShouldWallJump) { // --- New Code Start --- // Build rotation from wall tangent direction, keeping the character upright FRotator WallRunRotation = WallTangentVector.ToOrientationRotator(); WallRunRotation.Pitch = 0.f; WallRunRotation.Roll = 0.f; // --- New Code End --- }
- Set the world location of `UpdatedComponent` to `LocationToPlaceActor`. You already set the world location in `ApplyMovementAlongWall()`, but since you’ll update the `OutputSyncState` in this function, it’s best practice to ensure that `UpdatedComponent` and `OutputSyncState` stay in sync. C++ ```
if (WallRunComponent && WallRunComponent->bShouldWallJump)
{
FRotator WallRunRotation = WallTangentVector.ToOrientationRotator();
WallRunRotation.Pitch = 0.f;
WallRunRotation.Roll = 0.f;

// --- New Code Start ---
UpdatedComponent->SetWorldLocation(LocationToPlaceActor);
// --- New Code End ---
}
``` if (WallRunComponent && WallRunComponent->bShouldWallJump) { FRotator WallRunRotation = WallTangentVector.ToOrientationRotator(); WallRunRotation.Pitch = 0.f; WallRunRotation.Roll = 0.f; // --- New Code Start --- UpdatedComponent->SetWorldLocation(LocationToPlaceActor); // --- New Code End --- }
- Set `ComponentVelocity` on `UpdatedComponent` to the combined wall jump velocity: forward along the wall tangent, horizontal away from the wall surface, and upward. C++ ```
UpdatedComponent->ComponentVelocity = WallTangentVector * WallJumpForwardVelocity + FoundWallNormal * WallJumpHorizontalVelocity + (MoverComp->GetOwner()->GetActorUpVector() * WallJumpUpwardVelocity);
``` UpdatedComponent->ComponentVelocity = WallTangentVector * WallJumpForwardVelocity + FoundWallNormal * WallJumpHorizontalVelocity + (MoverComp->GetOwner()->GetActorUpVector() * WallJumpUpwardVelocity);
- Set the world rotation of `UpdatedComponent` to `WallRunRotation`. C++ ```
UpdatedComponent->SetWorldRotation(WallRunRotation);
``` UpdatedComponent->SetWorldRotation(WallRunRotation);
- Sync `OutputSyncState` with the same location, rotation, and velocity. C++ ```
// Sync OutputSyncState with the same transforms to prevent Mover desync
OutputSyncState.SetTransforms_WorldSpace(LocationToPlaceActor,
       WallRunRotation,
       WallTangentVector * WallJumpForwardVelocity + FoundWallNormal * WallJumpHorizontalVelocity + (MoverComp->GetOwner()->GetActorUpVector() * WallJumpUpwardVelocity),
	FVector::ZeroVector,
       nullptr);
``` // Sync OutputSyncState with the same transforms to prevent Mover desync OutputSyncState.SetTransforms_WorldSpace(LocationToPlaceActor, WallRunRotation, WallTangentVector * WallJumpForwardVelocity + FoundWallNormal * WallJumpHorizontalVelocity + (MoverComp->GetOwner()->GetActorUpVector() * WallJumpUpwardVelocity), FVector::ZeroVector, nullptr);
- Queue the `Falling` movement mode and return `true`. End the `if` statement. C++ ```
// Check if a wall jump has been requested
if (WallRunComponent && WallRunComponent->bShouldWallJump)
{
	// Build rotation from wall tangent direction, keeping the character upright
	FRotator WallRunRotation = WallTangentVector.ToOrientationRotator();
	WallRunRotation.Pitch = 0.f;
	WallRunRotation.Roll = 0.f;

	// Apply location, composite launch velocity, and rotation to UpdatedComponent
	UpdatedComponent->SetWorldLocation(LocationToPlaceActor);
```
- After the `if` statement, return `false` for the case where no wall jump was requested.

Your finished `ProcessWallJump()` function should look like this:

 C++

```
bool UWallRunMovementMode::ProcessWallJump(UMoverComponent* MoverComp, USceneComponent* UpdatedComponent, FMoverDefaultSyncState& OutputSyncState, const FVector& FoundWallNormal, const FVector& FoundWallLocation)
{
	// Check if a wall jump has been requested
	if (WallRunComponent && WallRunComponent->bShouldWallJump)
	{
		// Build rotation from wall tangent direction, keeping the character upright
		FRotator WallRunRotation = WallTangentVector.ToOrientationRotator();
		WallRunRotation.Pitch = 0.f;
		WallRunRotation.Roll = 0.f;
```

### Define DetectSharpTurnBreak()

`DetectSharpTurnBreak()` runs each frame during a wall run to detect sudden direction changes along the wall's surface. If the difference in wall angle is too large, it queues the Falling Movement Mode to end the wall run.

To implement `DetectSharpTurnBreak()`, follow these steps:

- In the header file, declare `DetectSharpTurnBreak()` in the protected section. The function takes the player’s Mover Component as an argument. C++ ```
// Ends wall run if player encounters a sharp direction change along the wall
bool DetectSharpTurnBreak(UMoverComponent* MoverComp);
``` // Ends wall run if player encounters a sharp direction change along the wall bool DetectSharpTurnBreak(UMoverComponent* MoverComp);
- In the `public` section, declare the following member variables: C++ ```
// Maximum angle change between wall tangent directions across frames before the wall run is broken
UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = Mover)
float MaxAngleDifference = 50.f;

// Wall tangent direction from the previous frame, used to detect sharp turns during a wall run
FVector PreviousWallTangent = FVector::ZeroVector;
``` // Maximum angle change between wall tangent directions across frames before the wall run is broken UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = Mover) float MaxAngleDifference = 50.f; // Wall tangent direction from the previous frame, used to detect sharp turns during a wall run FVector PreviousWallTangent = FVector::ZeroVector;
- In the `.cpp` file, define `DetectSharpTurnBreak()`. Start with an `if` statement that skips the angle comparison on the first frame (when `PreviousWallTangent` is still zero). C++ ```
bool UWallRunMovementMode::DetectSharpTurnBreak(UMoverComponent* MoverComp)
{
// Skip on the first frame. PreviousWallTangent is zero until at least one frame has run
if (!PreviousWallTangent.IsNearlyZero())
{
}
}
``` bool UWallRunMovementMode::DetectSharpTurnBreak(UMoverComponent* MoverComp) { // Skip on the first frame. PreviousWallTangent is zero until at least one frame has run if (!PreviousWallTangent.IsNearlyZero()) { } } `PreviousWallTangent` starts as `FVector::ZeroVector` on the first frame. Without this guard, the dot product computes against a zero vector and returns an incorrect angle.
- Inside the `if` statement, calculate the angle between `WallTangentVector` and `PreviousWallTangent`. Get the dot product (cosine) of the two vectors, pass the result to `FMath::Acos` to get the angle between them, and then use `FMath::RadiansToDegrees` to convert to degrees to compare with `MaxAngleDifference`. C++ ```
bool UWallRunMovementMode::DetectSharpTurnBreak(UMoverComponent* MoverComp)
{
// Skip on the first frame. PreviousWallTangent is zero until at least one frame has run
if (!PreviousWallTangent.IsNearlyZero())
{
		// --- New Code Start ---
// Angle between last frame's wall tangent and the current one
float AngleDegrees = FMath::RadiansToDegrees(
    FMath::Acos(FVector::DotProduct(WallTangentVector, PreviousWallTangent)));
		// --- New Code End ---
```
- If `AngleDegrees` exceeds `MaxAngleDifference`, call `QueueNextMode()` to transition to `Falling` and return `true`. C++ ```
if (!PreviousWallTangent.IsNearlyZero())
{
// Angle between last frame's wall tangent and the current one
float AngleDegrees = FMath::RadiansToDegrees(
    FMath::Acos(FVector::DotProduct(WallTangentVector, PreviousWallTangent)));

	// --- New Code Start ---
	// Sharp turn detected — end the wall run
if (AngleDegrees > MaxAngleDifference)
{
```
- After the outer `if` statement, store `WallTangentVector` as `PreviousWallTangent` for the next frame, then return `false`. C++ ```
// Skip on the first frame. PreviousWallTangent is zero until at least one frame has run
if (!PreviousWallTangent.IsNearlyZero())
{
		// Angle between last frame's wall tangent and the current one
float AngleDegrees = FMath::RadiansToDegrees(
    FMath::Acos(FVector::DotProduct(WallTangentVector, PreviousWallTangent)));

		// Sharp turn detected — end the wall run
if (AngleDegrees > MaxAngleDifference)
{
```

Your finished `DetectSharpTurnBreak()` function should look like this:

 C++

```
bool UWallRunMovementMode::DetectSharpTurnBreak(UMoverComponent* MoverComp)
{
	// Skip on the first frame. PreviousWallTangent is zero until at least one frame has run
	if (!PreviousWallTangent.IsNearlyZero())
	{
		// Angle between last frame's wall tangent and the current one
		float AngleDegrees = FMath::RadiansToDegrees(
			FMath::Acos(FVector::DotProduct(WallTangentVector, PreviousWallTangent))
		);

```

### Define UpdateCameraClamp()

`UpdateCameraClamp()` runs each frame during a wall run to keep the player's camera yaw within a defined offset of the wall run direction. Without this constraint, the player could freely rotate their camera away from the wall while wall running.

To implement `UpdateCameraClamp()`, follow these steps:

- In the header file, declare `UpdateCameraClamp()` in the protected section. The function takes `DeltaSeconds` and the Mover Component as arguments. C++ ```
// Restricts maximum camera yaw movements during a wall run
void UpdateCameraClamp(float DeltaSeconds, UMoverComponent* MoverComp);
``` // Restricts maximum camera yaw movements during a wall run void UpdateCameraClamp(float DeltaSeconds, UMoverComponent* MoverComp);
- In the `public` section, declare the following member variables: C++ ```
// Interpolation speed used to smoothly move the camera toward the clamped yaw target during a wall run
UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = Mover)
float WallRunCameraInterpolationSpeed = 4.f;

// Maximum yaw offset allowed between the camera direction and the wall run direction
UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = Mover)
float MaxYawOffset = 15.f;
``` // Interpolation speed used to smoothly move the camera toward the clamped yaw target during a wall run UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = Mover) float WallRunCameraInterpolationSpeed = 4.f; // Maximum yaw offset allowed between the camera direction and the wall run direction UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = Mover) float MaxYawOffset = 15.f;
- In the `.cpp` file, start `UpdateCameraClamp()`’s implementation with an if statement that retrieves the `APlayerController` from the owning Pawn. The rest of the function runs only if the cast succeeds. C++ ```
void UWallRunMovementMode::UpdateCameraClamp(float DeltaSeconds, UMoverComponent* MoverComp)
{
	// Only proceed if the owning Pawn has a player controller
	if (APlayerController* PlayerController = Cast<APlayerController>(Cast<APawn>(MoverComp->GetOwner())->GetController()))
	{

	}
}
``` void UWallRunMovementMode::UpdateCameraClamp(float DeltaSeconds, UMoverComponent* MoverComp) { // Only proceed if the owning Pawn has a player controller if (APlayerController* PlayerController = Cast(Cast(MoverComp->GetOwner())->GetController())) { } }
- Inside the `if` statement, get the current control rotation from the player controller. C++ ```
void UWallRunMovementMode::UpdateCameraClamp(float DeltaSeconds, UMoverComponent* MoverComp)
{
	// Only proceed if the owning Pawn has a player controller
	if (APlayerController* PlayerController = Cast<APlayerController>(Cast<APawn>(MoverComp->GetOwner())->GetController()))
	{
		// --- New Code Start ---
FRotator ControlRot = PlayerController->GetControlRotation();
		// --- New Code End ---
	}
}
``` void UWallRunMovementMode::UpdateCameraClamp(float DeltaSeconds, UMoverComponent* MoverComp) { // Only proceed if the owning Pawn has a player controller if (APlayerController* PlayerController = Cast(Cast(MoverComp->GetOwner())->GetController())) { // --- New Code Start --- FRotator ControlRot = PlayerController->GetControlRotation(); // --- New Code End --- } }
- Compute the wall run direction by taking the cross product of `WallNormal` and the world up vector, then normalize the result. C++ ```
if (APlayerController* PlayerController = Cast<APlayerController>(Cast<APawn>(MoverComp->GetOwner())->GetController()))
{
	FRotator ControlRot = PlayerController->GetControlRotation();

	// --- New Code Start ---
// Direction along the wall surface (perpendicular to the wall normal, in the horizontal plane)
	FVector WallRunDir = FVector::CrossProduct(WallNormal, FVector::UpVector);
	WallRunDir.Normalize();
	// --- New Code End ---
}
``` if (APlayerController* PlayerController = Cast(Cast(MoverComp->GetOwner())->GetController())) { FRotator ControlRot = PlayerController->GetControlRotation(); // --- New Code Start --- // Direction along the wall surface (perpendicular to the wall normal, in the horizontal plane) FVector WallRunDir = FVector::CrossProduct(WallNormal, FVector::UpVector); WallRunDir.Normalize(); // --- New Code End --- } The cross product vector is perpendicular to the `WallNormal` and `UpVector` vectors.
- If the dot product of `WallRunDir` with the Actor's forward vector is negative, flip `WallRunDir` so it always points in the direction the character is running. C++ ```
if (APlayerController* PlayerController = Cast<APlayerController>(Cast<APawn>(MoverComp->GetOwner())->GetController()))
{
	FRotator ControlRot = PlayerController->GetControlRotation();

// Direction along the wall surface (perpendicular to the wall normal, in the horizontal plane)
	FVector WallRunDir = FVector::CrossProduct(WallNormal, FVector::UpVector);
	WallRunDir.Normalize();

	// --- New Code Start ---
if (FVector::DotProduct(WallRunDir, MoverComp->GetOwner()->GetActorForwardVector()) < 0.f)
``` The cross product gives a direction perpendicular to the wall, but it could point either forward or backward relative to the character. This check ensures `WallRunDir` always matches the character's travel direction.
- After the dot product `if` statement, convert `WallRunDir` to a `FRotator`. C++ ```
if (FVector::DotProduct(WallRunDir, MoverComp->GetOwner()->GetActorForwardVector()) < 0.f)
{
	WallRunDir *= -1.f;
}
// --- New Code Start ---
FRotator WallRunRot = WallRunDir.Rotation();
// --- New Code End ---
``` if (FVector::DotProduct(WallRunDir, MoverComp->GetOwner()->GetActorForwardVector()) SetControlRotation(SmoothedRot); `FMath::RInterpTo` interpolates between two rotators at a given speed per second. `DeltaSeconds` keeps the interpolation frame-rate independent.

Your finished `UpdateCameraClamp()` function should look like this:

 C++

```
void UWallRunMovementMode::UpdateCameraClamp(float DeltaSeconds, UMoverComponent* MoverComp)
{
	// Only proceed if the owning Pawn has a player controller
	if (APlayerController* PlayerController = Cast<APlayerController>(Cast<APawn>(MoverComp->GetOwner())->GetController()))
	{
		FRotator ControlRot = PlayerController->GetControlRotation();

		// Direction along the wall surface (perpendicular to the wall normal, in the horizontal plane)
		FVector WallRunDir = FVector::CrossProduct(WallNormal, FVector::UpVector);
		WallRunDir.Normalize();
```

### Define SimulationTick_Implementation

Now, you’ll pull all the code you’ve implemented together in `SimulationTick` and define how the Movement Mode works.

Each frame, `SimulationTick` will:

- Run standard Mover setup to initialize movement components and state variables.
- If not initialized, run the `InitializeWallRun()` function.
- Call `ApplyMovementAlongWall` to move the player forward.
- Call `ProcessWallJump` to check if it should wall jump.
- Check if there is still a wall nearby and stop the wall run if no wall is found.
- If the wall run movement can continue, update `HitLocation`, `WallNormal`, `WallTangentVector`, `StartLocation`, and reset `ElapsedTime`.
- Use updated wall information to check for sharp turns.
- Update the camera clamp.

#### Add Standard Setup Code

At the start of `SimulationTick_Implementation`, add the same movement setup code you added to the Grappling Hook Movement Mode:

 C++

```
void UWallRunMovementMode::SimulationTick_Implementation(const FSimulationTickParams& Params, FMoverTickEndData& OutputState)
{
	/*
	// --- Standard Movement Mode Setup Code STARTS ---
	*/
UMoverComponent* MoverComp = GetMoverComponent();
	const FMoverTickStartData& StartState = Params.StartState;
	USceneComponent* UpdatedComponent = Params.MovingComps.UpdatedComponent.Get();
	UPrimitiveComponent* UpdatedPrimitive = Params.MovingComps.UpdatedPrimitive.Get();
	FProposedMove ProposedMove = Params.ProposedMove;
```

#### Initialize Wall Running

Call `InitializeWallRun()` if the wall run movement hasn’t been initialized yet.

To check for a valid wall hit location and initialize a new wall run, follow these steps:

- After the standard movement setup code, add an if statement that checks if `FindWall()` has run and set `HitLocation` to non-zero value.This prevents the wall run logic from executing before a wall has been detected. C++ ```
// Only run wall run logic if a valid wall hit has been registered
if (HitLocation != FVector(0, 0, 0))
{
}
``` // Only run wall run logic if a valid wall hit has been registered if (HitLocation != FVector(0, 0, 0)) { }
- Inside the `if` statement, check that this is the first frame of the wall run (`bIsLocationInitialized` is false). If so, call `InitializeWallRun()` to set up the starting position and state. C++ ```
// Only run wall run logic if a valid wall hit has been registered
if (HitLocation != FVector(0, 0, 0))
{
	// --- New Code Start ---
// First frame of wall run — set up starting position and state
if (!bIsLocationInitialized)
{
   		InitializeWallRun(DeltaSeconds, MoverComp);
}
// --- New Code End ---
```

#### Move Player Along the Wall

Move the player and then call `FindWall()` to get the wall location and normal at the player’s new location. You’ll use this updated wall information to perform checks to detect if the movement should end.

To move the player and update `FindWall()` data, follow these steps:

- After the inner `if` statement, call `ApplyMovementAlongWall()` to move the character along the wall this frame. C++ ```
// Only run wall run logic if a valid wall hit has been registered
if (HitLocation != FVector(0, 0, 0))
{
	// First frame of wall run — set up starting position and state
if (!bIsLocationInitialized)
{
   		InitializeWallRun(DeltaSeconds, MoverComp);

}
```
- Before updating the `FindWall()` check from the player’s new location, check that `WallRunComponent` has a value.
- In the `if` statement, declare two vectors for `FindWall` to save the new wall information to, then call `FindWall()`. C++ ```
// Only run wall run logic if a valid wall hit has been registered
if (HitLocation != FVector(0, 0, 0))
{
	// First frame of wall run — set up starting position and state
	if (!bIsLocationInitialized)
	{
		InitializeWallRun(DeltaSeconds, MoverComp);
	}

// Move the character along the wall surface
```

#### End the Wall Run

Use the wall information in the player’s new location to check for and process a wall jump, update the rest of the wall data, and detect sharp turns.

To check for conditions that end the wall run, follow these steps:

- In the `if (WallRunComponent)` statement, call `ProcessWallJump()`. If it returns `true`, return out of `SimulationTick` early. A wall jump has been applied and the Movement Mode is transitioning to `Falling`. C++ ```
// Refresh wall data and handle state transitions
if (WallRunComponent)
{
	FVector FoundWallLocation;
	FVector FoundWallNormal;
	bool bFoundWall = WallRunComponent->FindWall(FoundWallLocation, FoundWallNormal);

	// --- New Code Start ---
// Apply wall jump if requested; transition to Falling and return
if (ProcessWallJump(MoverComp, UpdatedComponent, OutputSyncState, FoundWallNormal, FoundWallLocation))
```
- If `FindWall()` returned `false`, queue the `Falling` movement mode and `return`. C++ ```
// Apply wall jump if requested; transition to Falling and return
if (ProcessWallJump(MoverComp, UpdatedComponent, OutputSyncState, FoundWallNormal, FoundWallLocation))
{
   	 return;
}

// --- New Code Start ---
// Wall lost — end the wall run
if (!bFoundWall)
{
```
- To check for sharp turns in the player’s new location, you need to update the rest of the wall data first. You’ll use the updated wall data for calculations during the next frame.If the wall is still present, update stored wall data for the next frame. C++ ```
// Wall lost — end the wall run
if (!bFoundWall)
{
	MoverComp->QueueNextMode("Falling", false);
	return;
}

// --- New Code Start ---
// Wall still present — update stored wall data for next frame
if (bFoundWall)
``` Setting `ElapsedTime` to `0` every frame keeps the lerp alpha in `ApplyMovementAlongWall` from accumulating.
- After the `if (bFoundWall)` statement, call `DetectSharpTurnBreak()`. If it returns `true`, the wall run has ended and `DetectSharpTurnBreak()` queued the Falling Movement Mode. C++ ```
// Wall still present — update stored wall data for next frame
if (bFoundWall)
{
	HitLocation = FoundWallLocation;
	WallNormal = FoundWallNormal;
	WallTangentVector = FVector::CrossProduct(FVector::UpVector, WallNormal);
	WallTangentVector.Normalize();
	StartLocation = HitLocation + WallNormal * DistanceFromWall;
	// Reset each frame so Alpha in ApplyMovementAlongWall doesn't accumulate
	ElapsedTime = 0.f;
```

#### Update the Player Camera

Near the end of `SimulationTick`, after the `if (DetectSharpTurnBreak(MoverComp))` statement, you know the player is continuing the wall run movement, so call `UpdateCameraClamp()` to constrain the camera yaw to the wall run direction.

 C++

```
// Only run wall run logic if a valid wall hit has been registered
if (HitLocation != FVector(0, 0, 0))
{
	// First frame of wall run — set up starting position and state
	if (!bIsLocationInitialized)
	{
		InitializeWallRun(DeltaSeconds, MoverComp);
	}
	// Move the character along the wall surface
	ApplyMovementAlongWall(DeltaSeconds, MoverComp, UpdatedComponent, OutputSyncState);
```

The full `SimulationTick` function should look like this:

 C++

```
// Runs every tick to orchestrate wall run movement — calls all other functions in this module in sequence
void UWallRunMovementMode::SimulationTick_Implementation(const FSimulationTickParams& Params, FMoverTickEndData& OutputState)
{
	/*
	// --- Standard Movement Mode Setup Code STARTS ---
	*/
	UMoverComponent* MoverComp = GetMoverComponent();
	const FMoverTickStartData& StartState = Params.StartState;
	USceneComponent* UpdatedComponent = Params.MovingComps.UpdatedComponent.Get();
	UPrimitiveComponent* UpdatedPrimitive = Params.MovingComps.UpdatedPrimitive.Get();
```

### Define Deactivate()

`Deactivate()` runs when the player character switches out of the Wall Run Movement Mode. It resets `PreviousWallTangent`, the camera rotation, and the variables initialized in `InitializeWallRun`. It also starts a new cooldown timer with `SetCooldown()`.

 C++

```
void UWallRunMovementMode::Deactivate(const FMoverEventContext& Context, FName NextModeName, const FMoverSimContext& SimContext)
{
	Super::Deactivate(Context, NextModeName, SimContext);

	HitLocation = FVector::ZeroVector;
	WallNormal = FVector::ZeroVector;
	WallTangentVector = FVector::ZeroVector;
	PreviousWallTangent = FVector::ZeroVector;
	ElapsedTime = 0.f;
	bIsLocationInitialized = false;
```

### Define OnRegistered() and OnUnregistered()

Just like in your Grappling Hook Movement Mode, use `OnRegistered()` to set up references when the Movement Mode is connected to the Mover system and use `OnUnRegistered()` for unbinding events and clearing external references when the Movement Mode is removed from the system.

`OnRegistered()` initializes the `CommonLegacySettings`, the Mover Component reference, the `WallRunActorComponent` reference, and the player’s camera component reference.

 C++

```
void UWallRunMovementMode::OnRegistered(const FName ModeName, const FMoverSimContext& SimContext)
{
	Super::OnRegistered(ModeName, SimContext);

	CommonLegacySettings = GetMoverComponent()->FindSharedSettings<UCommonLegacyMovementSettings>();
	ensureMsgf(CommonLegacySettings, TEXT("Failed to find instance of CommonLegacyMovementSettings on %s. Movement may not function properly."), *GetPathNameSafe(this));
	UMoverComponent* MoverComp = GetMoverComponent();
	WallRunComponent = MoverComp->GetOwner()->FindComponentByClass<UWallRunActorComponent>();
	Camera = MoverComp->GetOwner()->FindComponentByClass<UCameraComponent>();
}
```

void UWallRunMovementMode::OnRegistered(const FName ModeName, const FMoverSimContext& SimContext)
{
 Super::OnRegistered(ModeName, SimContext);

 CommonLegacySettings = GetMoverComponent()->FindSharedSettings<UCommonLegacyMovementSettings>();
 ensureMsgf(CommonLegacySettings, TEXT("Failed to find instance of CommonLegacyMovementSettings on %s. Movement may not function properly."), *GetPathNameSafe(this));
 UMoverComponent* MoverComp = GetMoverComponent();
 WallRunComponent = MoverComp->GetOwner()->FindComponentByClass<UWallRunActorComponent>();
 Camera = MoverComp->GetOwner()->FindComponentByClass<UCameraComponent>();
}

`OnUnregistered()` resets the `CommonLegacySettings` to a null pointer and calls the parent function.

 C++

```
void UWallRunMovementMode::OnUnregistered(const FMoverSimContext& SimContext)
{
	CommonLegacySettings = nullptr;
	Super::OnUnregistered(SimContext);
}
```

void UWallRunMovementMode::OnUnregistered(const FMoverSimContext& SimContext)
{
 CommonLegacySettings = nullptr;
 Super::OnUnregistered(SimContext);
}

### Complete Code

The finished `WallRunMovementMode.h` file should look like this:

 C++

```
// Copyright Epic Games, Inc. All Rights Reserved.

#pragma once

#include "CoreMinimal.h"
#include "MovementMode.h"
#include "Camera/CameraComponent.h"
#include "WallRunActorComponent.h"
#include "WallRunMovementMode.generated.h"
```

The finished `WallRunMovementMode.cpp` file should look like this:

 C++

```
// Copyright Epic Games, Inc. All Rights Reserved.

#include "WallRunMovementMode.h"
#include "GameFramework/Pawn.h"
#include "Camera/CameraComponent.h"
#include "MoveLibrary/MovementUtils.h"
#include "MoveLibrary/FloorQueryUtils.h"
#include "MoverComponent.h"
#include "DefaultMovementSet/Settings/CommonLegacyMovementSettings.h"
#include "DefaultMovementSet/InstantMovementEffects/BasicInstantMovementEffects.h"
```

## Add Wall Running to the Character Blueprint

Now that you’ve implemented the movement behavior, you can add the Movement Mode to BP_ParkourPawn.

### Add the Component and Movement Mode

To add the Wall Run Movement Mode to the player character, follow these steps:

- In Unreal Editor, open your Pawn Blueprint.
- In the **Components **panel, add a **WallRunActor** component.
- Select the **ExtendedCharacterMoverComponent**.
- In the **Details **panel, in the **Mover **section, expand **Movement Modes**.
- Add a new map element to the **Movement Modes** list and enter `WallRun` as the mode name. You’ll reference this name in Event Graph logic.
- In the new map element’s dropdown list, select **Wall Run Movement Mode**.
- Compile the Blueprint.

### Queue the Movement Mode

Unlike sprint and grapple, wall running requires environmental conditions, not an input, to queue the Movement Mode, so you’ll use Event Tick to check for and queue the Wall Run movement mode.

The logic here will check for these conditions:

- Is the player falling (i.e. just finished a jump, grapple, or similar movement)?
- Is there a wall in range?
- Is the player moving fast enough to wall run?

When working in node graphs, ensure **Context Sensitive** is enabled in the node actions list as often as possible so Unreal Engine can automatically add appropriate targets to function nodes for you.

To queue the Movement Mode, follow these steps:

- In the Pawn’s **EventGraph **tab, in the** My Blueprint **panel, expand the **EventGraph **list and double-click **Event Tick** to find it in the graph.
- Drag off the **Parent: Tick **node and add a **Branch **node to test if the player is in the Falling Movement Mode.
- Add the falling condition:For the **Branch **node’s **Condition **pin, connect an** Is Falling (ExtendedCharacterMoverComponent)** node.To access this option, enable **Context Sensitive** in the node actions list.

- Drag off the **Branch **node’s **True** pin and add a second **Branch **node. This **Branch **node will test if a wall is in range and the character is moving at an appropriate velocity to start wall running.
- Add the Find Wall condition:Below the second **Branch **node, add a **Find Wall (WallRunActor)** node.

- Add the player speed condition:In the **Variables **list, create a new **float **variable named `WallRunSpeedThreshold`. Compile the Blueprint and enter `750` as its default value.A speed threshold of 750 cm/s makes the wall run only work if the player is sprinting.
- Below the **FindWall **node, right-click to add a new node, search for `get velocity mover`, and add a **Get Velocity (ExtendedCharacterMoverComponent)** node.
- You only need the player’s horizontal speed, so isolate the X and Y values from the velocity result. In the **Get Velocity** node, right click the **Return Value** pin and select **Split Struct Pin**. Connect the **Return Value X** and** Return Value Y** pins to a new **Make Vector** node.
- Drag off the **Make Vector **node’s **Return Value** pin, add a **Vector Length** node, and then check if its **Return Value** is greater or equal to **WallRunSpeedThreshold**.Getting the length of the flattened vector tells you how fast the player is moving horizontally.

- Connect the **Find Wall** node’s **Return Value** and player speed condition with an **And **boolean node, and then connect the **And **node to the second **Branch** node’s **Condition **pin.
- In the **Variables **list, create two new **Vector **variables:`OutWallLocation`
- `OutWallNormal`

You’ll use these variables to store the vectors that `FindWall()` calculated and then pass these values to the WallRun Movement Mode when queueing it.

- From the second **Branch **node’s **True **pin, connect a **Set OutWallLocation** node, then connect a **Set OutWallNormal** node. Connect the **Find Wall** function node’s outputs to the respective **Set **nodes to save these values for later.
- After the second **Set **node, add a** Queue Next Movement Mode (ExtendedCharacterMoverComponent)**. Enter `WallRun` as the **Desired Mode Name**.
- Add a comment to group these nodes together.
- Save and compile the Blueprint.

Your final EventTick logic should look like this:

 Blueprint

Begin Object Class=/Script/BlueprintGraph.K2Node_Event Name="K2Node_Event_2" ExportPath="/Script/BlueprintGraph.K2Node_Event'/Game/Parkour/Blueprints/BP_ParkourPawn.BP_ParkourPawn:EventGraph.K2Node_Event_2'"
 EventReference=(MemberParent="/Script/CoreUObject.Class'/Script/Engine.Actor'",MemberName="ReceiveTick")
 bOverrideFunction=True
 NodePosY=128
 bCommentBubblePinned=True
 NodeGuid=E50AC0C94441D68999A36E8638944ED1
 CustomProperties Pin (PinId=94F81A914EBEF3C74B640BBD3E86BB7E,PinName="OutputDelegate",Direction="EGPD_Output",PinType.PinCategory="delegate",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(MemberParent="/Script/CoreUObject.Class'/Script/Engine.Actor'",MemberName="ReceiveTick"),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=71498E6D4EE655068D98DDBF391D9B75,PinName="then",Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CallParentFunction_2 3196EF3A4CC9384F567CB4A1DA099550,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=C6C0CD2E415C549BF419A7A63359EC90,PinName="DeltaSeconds",PinToolTip="Delta Seconds\nFloat (single-precision)",Direction="EGPD_Output",PinType.PinCategory="real",PinType.PinSubCategory="float",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="0.0",AutogeneratedDefaultValue="0.0",LinkedTo=(K2Node_CallParentFunction_2 775A11C9427BC4342A34E097AD5F75D3,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_CallParentFunction Name="K2Node_CallParentFunction_2" ExportPath="/Script/BlueprintGraph.K2Node_CallParentFunction'/Game/Parkour/Blueprints/BP_ParkourPawn.BP_ParkourPawn:EventGraph.K2Node_CallParentFunction_2'"
 FunctionReference=(MemberParent="/Script/Engine.BlueprintGeneratedClass'/MoverExamples/Pawns/BaseAnimatedMannyPawn.BaseAnimatedMannyPawn_C'",MemberName="ReceiveTick",MemberGuid=38F62B564FF4377E3F8536AED3F65109)
 NodePosX=200
 NodePosY=128
 NodeGuid=441B94F44A498ECF5A54649DEF2BE2D7
 CustomProperties Pin (PinId=3196EF3A4CC9384F567CB4A1DA099550,PinName="execute",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_Event_2 71498E6D4EE655068D98DDBF391D9B75,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=FF7C7C524165741221516D8B92AAF4F5,PinName="then",Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_IfThenElse_10 6F195FE746F06035DCE2449CEC29E1F6,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=E06842A845F84633234FFE8DE4C2FDF3,PinName="self",PinFriendlyName=NSLOCTEXT("K2Node", "Target", "Target"),PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/Engine.Actor'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=True,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=775A11C9427BC4342A34E097AD5F75D3,PinName="DeltaSeconds",PinType.PinCategory="real",PinType.PinSubCategory="float",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="0.0",AutogeneratedDefaultValue="0.0",LinkedTo=(K2Node_Event_2 C6C0CD2E415C549BF419A7A63359EC90,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_IfThenElse Name="K2Node_IfThenElse_10" ExportPath="/Script/BlueprintGraph.K2Node_IfThenElse'/Game/Parkour/Blueprints/BP_ParkourPawn.BP_ParkourPawn:EventGraph.K2Node_IfThenElse_10'"
 NodePosX=448
 NodePosY=128
 NodeGuid=22CB2F144C01E396E312C7BBCBFA5B24
 CustomProperties Pin (PinId=6F195FE746F06035DCE2449CEC29E1F6,PinName="execute",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CallParentFunction_2 FF7C7C524165741221516D8B92AAF4F5,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=80034E2448AF2736BA544689F90FE438,PinName="Condition",PinType.PinCategory="bool",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="true",AutogeneratedDefaultValue="true",LinkedTo=(K2Node_CallFunction_41 689BA54443C7A28536029B9720A73245,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=2D07C3DF4F58468FD4D360A394F5E5AE,PinName="then",PinFriendlyName=NSLOCTEXT("K2Node", "true", "true"),Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_IfThenElse_11 AFDAE5B8464BF8FDDB37EDA9FC8485E3,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=6D2F35674630B0B2691FC287DC42542A,PinName="else",PinFriendlyName=NSLOCTEXT("K2Node", "false", "false"),Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_CallFunction Name="K2Node_CallFunction_41" ExportPath="/Script/BlueprintGraph.K2Node_CallFunction'/Game/Parkour/Blueprints/BP_ParkourPawn.BP_ParkourPawn:EventGraph.K2Node_CallFunction_41'"
 bDefaultsToPureFunc=True
 FunctionReference=(MemberParent="/Script/CoreUObject.Class'/Script/Mover.CharacterMoverComponent'",MemberName="IsFalling")
 NodePosX=160
 NodePosY=272
 NodeGuid=F0A4C56443245F49D4477C90DE2DC76F
 CustomProperties Pin (PinId=2B83C91C40A1113699D96AB0A408597C,PinName="self",PinFriendlyName=NSLOCTEXT("K2Node", "Target", "Target"),PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/Mover.CharacterMoverComponent'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_VariableGet_45 BD91108B420F74B48067FC899C555126,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=689BA54443C7A28536029B9720A73245,PinName="ReturnValue",Direction="EGPD_Output",PinType.PinCategory="bool",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="false",AutogeneratedDefaultValue="false",LinkedTo=(K2Node_IfThenElse_10 80034E2448AF2736BA544689F90FE438,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_VariableGet Name="K2Node_VariableGet_45" ExportPath="/Script/BlueprintGraph.K2Node_VariableGet'/Game/Parkour/Blueprints/BP_ParkourPawn.BP_ParkourPawn:EventGraph.K2Node_VariableGet_45'"
 VariableReference=(MemberName="ExtendedCharacterMoverComponent",bSelfContext=True)
 NodePosX=-144
 NodePosY=288
 NodeGuid=83C1CF1E44E846A51BE71695361895E4
 CustomProperties Pin (PinId=BD91108B420F74B48067FC899C555126,PinName="ExtendedCharacterMoverComponent",Direction="EGPD_Output",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/Engine.BlueprintGeneratedClass'/MoverExamples/Components/ExtendedCharacterMoverComponent.ExtendedCharacterMoverComponent_C'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CallFunction_41 2B83C91C40A1113699D96AB0A408597C,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=D480F95444E3A4BDF7F8069045362129,PinName="self",PinFriendlyName=NSLOCTEXT("K2Node", "Target", "Target"),PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/Engine.BlueprintGeneratedClass'/Game/Parkour/Blueprints/BP_ParkourPawn.BP_ParkourPawn_C'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=True,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_IfThenElse Name="K2Node_IfThenElse_11" ExportPath="/Script/BlueprintGraph.K2Node_IfThenElse'/Game/Parkour/Blueprints/BP_ParkourPawn.BP_ParkourPawn:EventGraph.K2Node_IfThenElse_11'"
 NodePosX=1696
 NodePosY=128
 NodeGuid=CE09B7A6443BFB4AEB5850B54F5EC214
 CustomProperties Pin (PinId=AFDAE5B8464BF8FDDB37EDA9FC8485E3,PinName="execute",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_IfThenElse_10 2D07C3DF4F58468FD4D360A394F5E5AE,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=548FFDBF49E7E4911ED46FA731CAFCEF,PinName="Condition",PinType.PinCategory="bool",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="true",AutogeneratedDefaultValue="true",LinkedTo=(K2Node_CommutativeAssociativeBinaryOperator_3 62362C6A489C5E03F444289F8FBA0D45,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=1B7CFFDE4AF44674563796B1FBCA7292,PinName="then",PinFriendlyName=NSLOCTEXT("K2Node", "true", "true"),Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_VariableSet_22 F79190E745EDD39E53762487684C4137,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=F865C50B4DE185A14938F7BBCB208BCC,PinName="else",PinFriendlyName=NSLOCTEXT("K2Node", "false", "false"),Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_CallFunction Name="K2Node_CallFunction_44" ExportPath="/Script/BlueprintGraph.K2Node_CallFunction'/Game/Parkour/Blueprints/BP_ParkourPawn.BP_ParkourPawn:EventGraph.K2Node_CallFunction_44'"
 bDefaultsToPureFunc=True
 FunctionReference=(MemberParent="/Script/CoreUObject.Class'/Script/ParkourGame.WallRunActorComponent'",MemberName="FindWall")
 NodePosX=1040
 NodePosY=240
 NodeGuid=93E99E5249F98B0B76C8F5BC5A26DBFC
 CustomProperties Pin (PinId=F6515F3D49329A1B60DD4FB22708B339,PinName="self",PinFriendlyName=NSLOCTEXT("K2Node", "Target", "Target"),PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/ParkourGame.WallRunActorComponent'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_VariableGet_47 93FA3D9942FA18414555F59179E132DF,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=C378B8484E4719E4C1EF79B29F2FD9DE,PinName="OutWallLocation",Direction="EGPD_Output",PinType.PinCategory="struct",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.ScriptStruct'/Script/CoreUObject.Vector'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="0, 0, 0",AutogeneratedDefaultValue="0, 0, 0",LinkedTo=(K2Node_VariableSet_22 75ABB0034242E0579D6489A24C154843,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=9CBA499E4E4F3C9DEB36109137D02E3E,PinName="OutWallNormal",Direction="EGPD_Output",PinType.PinCategory="struct",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.ScriptStruct'/Script/CoreUObject.Vector'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="0, 0, 0",AutogeneratedDefaultValue="0, 0, 0",LinkedTo=(K2Node_VariableSet_25 74354A424CAA1F0F95DA6792BDE372AF,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=1C9FADCB447B8BEC0D40F192F82765A7,PinName="ReturnValue",Direction="EGPD_Output",PinType.PinCategory="bool",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="false",AutogeneratedDefaultValue="false",LinkedTo=(K2Node_CommutativeAssociativeBinaryOperator_3 300215244743FD580CE7C39DBA9E5B0E,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_VariableGet Name="K2Node_VariableGet_47" ExportPath="/Script/BlueprintGraph.K2Node_VariableGet'/Game/Parkour/Blueprints/BP_ParkourPawn.BP_ParkourPawn:EventGraph.K2Node_VariableGet_47'"
 VariableReference=(MemberName="WallRunActor",bSelfContext=True)
 NodePosX=832
 NodePosY=272
 NodeGuid=B66DE688425A521979582283E9CDF82C
 CustomProperties Pin (PinId=93FA3D9942FA18414555F59179E132DF,PinName="WallRunActor",Direction="EGPD_Output",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/ParkourGame.WallRunActorComponent'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CallFunction_44 F6515F3D49329A1B60DD4FB22708B339,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=BAC57C7641F182B4C75D24AA3AA7EFDA,PinName="self",PinFriendlyName=NSLOCTEXT("K2Node", "Target", "Target"),PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/Engine.BlueprintGeneratedClass'/Game/Parkour/Blueprints/BP_ParkourPawn.BP_ParkourPawn_C'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=True,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_CallFunction Name="K2Node_CallFunction_46" ExportPath="/Script/BlueprintGraph.K2Node_CallFunction'/Game/Parkour/Blueprints/BP_ParkourPawn.BP_ParkourPawn:EventGraph.K2Node_CallFunction_46'"
 bDefaultsToPureFunc=True
 FunctionReference=(MemberParent="/Script/CoreUObject.Class'/Script/Mover.MoverComponent'",MemberName="GetVelocity")
 NodePosX=624
 NodePosY=416
 NodeGuid=5F32116A41B9BF9EB18A05860962FADC
 CustomProperties Pin (PinId=616C40484BBBA0BCAEFE228EDFD992DB,PinName="self",PinFriendlyName=NSLOCTEXT("K2Node", "Target", "Target"),PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/Mover.MoverComponent'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_VariableGet_48 98742D93430BC70BA2E04F939F672430,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=AF86FB784DF5106410915C952B5A5247,PinName="ReturnValue",Direction="EGPD_Output",PinType.PinCategory="struct",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.ScriptStruct'/Script/CoreUObject.Vector'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="0, 0, 0",AutogeneratedDefaultValue="0, 0, 0",SubPins=(K2Node_CallFunction_46 E2CAB43B4F6D0711AEB85CBD54FF1FBD,K2Node_CallFunction_46 ACDE0ECE479723892317749BA409633F,K2Node_CallFunction_46 F74FD2BF4FE68C3F591ADABD47A7D600,),PersistentGuid=00000000000000000000000000000000,bHidden=True,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=E2CAB43B4F6D0711AEB85CBD54FF1FBD,PinName="ReturnValue_X",PinFriendlyName=LOCGEN_FORMAT_NAMED(NSLOCTEXT("KismetSchema", "SplitPinFriendlyNameFormat", "{PinDisplayName} {ProtoPinDisplayName}"), "PinDisplayName", INVTEXT("Return Value"), "ProtoPinDisplayName", INVTEXT("X")),Direction="EGPD_Output",PinType.PinCategory="real",PinType.PinSubCategory="double",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="0.0",AutogeneratedDefaultValue="0.0",LinkedTo=(K2Node_CallFunction_48 646814FB4BE44A9EBFE42296A3583277,),ParentPin=K2Node_CallFunction_46 AF86FB784DF5106410915C952B5A5247,PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=ACDE0ECE479723892317749BA409633F,PinName="ReturnValue_Y",PinFriendlyName=LOCGEN_FORMAT_NAMED(NSLOCTEXT("KismetSchema", "SplitPinFriendlyNameFormat", "{PinDisplayName} {ProtoPinDisplayName}"), "PinDisplayName", INVTEXT("Return Value"), "ProtoPinDisplayName", INVTEXT("Y")),Direction="EGPD_Output",PinType.PinCategory="real",PinType.PinSubCategory="double",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="0.0",AutogeneratedDefaultValue="0.0",LinkedTo=(K2Node_CallFunction_48 4917AC7D4A40FC9A795CA0A5F81DFE87,),ParentPin=K2Node_CallFunction_46 AF86FB784DF5106410915C952B5A5247,PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=F74FD2BF4FE68C3F591ADABD47A7D600,PinName="ReturnValue_Z",PinFriendlyName=LOCGEN_FORMAT_NAMED(NSLOCTEXT("KismetSchema", "SplitPinFriendlyNameFormat", "{PinDisplayName} {ProtoPinDisplayName}"), "PinDisplayName", INVTEXT("Return Value"), "ProtoPinDisplayName", INVTEXT("Z")),Direction="EGPD_Output",PinType.PinCategory="real",PinType.PinSubCategory="double",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="0.0",AutogeneratedDefaultValue="0.0",ParentPin=K2Node_CallFunction_46 AF86FB784DF5106410915C952B5A5247,PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_VariableGet Name="K2Node_VariableGet_48" ExportPath="/Script/BlueprintGraph.K2Node_VariableGet'/Game/Parkour/Blueprints/BP_ParkourPawn.BP_ParkourPawn:EventGraph.K2Node_VariableGet_48'"
 VariableReference=(MemberName="ExtendedCharacterMoverComponent",bSelfContext=True)
 NodePosX=336
 NodePosY=432
 NodeGuid=4B7246424E9A4E51BA3AF6BA8926D73B
 CustomProperties Pin (PinId=98742D93430BC70BA2E04F939F672430,PinName="ExtendedCharacterMoverComponent",Direction="EGPD_Output",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/Engine.BlueprintGeneratedClass'/MoverExamples/Components/ExtendedCharacterMoverComponent.ExtendedCharacterMoverComponent_C'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CallFunction_46 616C40484BBBA0BCAEFE228EDFD992DB,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=AEC8626345D1A344C61E0F917A390537,PinName="self",PinFriendlyName=NSLOCTEXT("K2Node", "Target", "Target"),PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/Engine.BlueprintGeneratedClass'/Game/Parkour/Blueprints/BP_ParkourPawn.BP_ParkourPawn_C'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=True,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_CallFunction Name="K2Node_CallFunction_48" ExportPath="/Script/BlueprintGraph.K2Node_CallFunction'/Game/Parkour/Blueprints/BP_ParkourPawn.BP_ParkourPawn:EventGraph.K2Node_CallFunction_48'"
 bDefaultsToPureFunc=True
 FunctionReference=(MemberParent="/Script/CoreUObject.Class'/Script/Engine.KismetMathLibrary'",MemberName="MakeVector")
 NodePosX=864
 NodePosY=432
 NodeGuid=B6789078439408235B032D8207E18CD3
 CustomProperties Pin (PinId=558AFDF2461E342608EA92B774B00179,PinName="self",PinFriendlyName=NSLOCTEXT("K2Node", "Target", "Target"),PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/Engine.KismetMathLibrary'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultObject="/Script/Engine.Default__KismetMathLibrary",PersistentGuid=00000000000000000000000000000000,bHidden=True,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=646814FB4BE44A9EBFE42296A3583277,PinName="X",PinType.PinCategory="real",PinType.PinSubCategory="double",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="0.0",AutogeneratedDefaultValue="0.0",LinkedTo=(K2Node_CallFunction_46 E2CAB43B4F6D0711AEB85CBD54FF1FBD,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=4917AC7D4A40FC9A795CA0A5F81DFE87,PinName="Y",PinType.PinCategory="real",PinType.PinSubCategory="double",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="0.0",AutogeneratedDefaultValue="0.0",LinkedTo=(K2Node_CallFunction_46 ACDE0ECE479723892317749BA409633F,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=C2B23E1B4702C596CA4F8F981E39A630,PinName="Z",PinType.PinCategory="real",PinType.PinSubCategory="double",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="0.0",AutogeneratedDefaultValue="0.0",PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=09A3CDD143DEFF83F14B2CBFD657193F,PinName="ReturnValue",Direction="EGPD_Output",PinType.PinCategory="struct",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.ScriptStruct'/Script/CoreUObject.Vector'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="0, 0, 0",AutogeneratedDefaultValue="0, 0, 0",LinkedTo=(K2Node_CallFunction_49 5953E441421BE3F0280B7DABEBB2EF82,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_CallFunction Name="K2Node_CallFunction_49" ExportPath="/Script/BlueprintGraph.K2Node_CallFunction'/Game/Parkour/Blueprints/BP_ParkourPawn.BP_ParkourPawn:EventGraph.K2Node_CallFunction_49'"
 bDefaultsToPureFunc=True
 FunctionReference=(MemberParent="/Script/CoreUObject.Class'/Script/Engine.KismetMathLibrary'",MemberName="VSize")
 NodePosX=1120
 NodePosY=432
 NodeGuid=24ACFCF84A0C5A598D14F3953AA30AC3
 CustomProperties Pin (PinId=C98372914A6355202BC6FA80CB3F6572,PinName="self",PinFriendlyName=NSLOCTEXT("K2Node", "Target", "Target"),PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/Engine.KismetMathLibrary'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultObject="/Script/Engine.Default__KismetMathLibrary",PersistentGuid=00000000000000000000000000000000,bHidden=True,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=5953E441421BE3F0280B7DABEBB2EF82,PinName="A",PinType.PinCategory="struct",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.ScriptStruct'/Script/CoreUObject.Vector'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="0, 0, 0",AutogeneratedDefaultValue="0, 0, 0",LinkedTo=(K2Node_CallFunction_48 09A3CDD143DEFF83F14B2CBFD657193F,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=6C20FDED4FBA9113FAFAFA886CBA671C,PinName="ReturnValue",Direction="EGPD_Output",PinType.PinCategory="real",PinType.PinSubCategory="double",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="0.0",AutogeneratedDefaultValue="0.0",LinkedTo=(K2Node_PromotableOperator_3 C182860D42E15E8F07DDF7850C372A23,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_PromotableOperator Name="K2Node_PromotableOperator_3" ExportPath="/Script/BlueprintGraph.K2Node_PromotableOperator'/Game/Parkour/Blueprints/BP_ParkourPawn.BP_ParkourPawn:EventGraph.K2Node_PromotableOperator_3'"
 OperationName="GreaterEqual"
 bDefaultsToPureFunc=True
 FunctionReference=(MemberParent="/Script/CoreUObject.Class'/Script/Engine.KismetMathLibrary'",MemberName="GreaterEqual_DoubleDouble")
 NodePosX=1344
 NodePosY=464
 NodeGuid=1DE757C249AEFB92CDABE984383357E1
 CustomProperties Pin (PinId=C182860D42E15E8F07DDF7850C372A23,PinName="A",PinType.PinCategory="real",PinType.PinSubCategory="double",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CallFunction_49 6C20FDED4FBA9113FAFAFA886CBA671C,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=C3EF171A4D6CF515DB4982B62A58D33C,PinName="B",PinType.PinCategory="real",PinType.PinSubCategory="double",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_VariableGet_49 CCAE7C924B340F89D952569CCE52CE20,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=2D18A8FB4CD7FF240A193981EA7CEF2B,PinName="ReturnValue",Direction="EGPD_Output",PinType.PinCategory="bool",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CommutativeAssociativeBinaryOperator_3 5C3BFDC5458DDEBC3E936F93CBE6AE31,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=D9D033944CF2FA3A2297179DFAF48833,PinName="ErrorTolerance",PinType.PinCategory="",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=True,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_VariableGet Name="K2Node_VariableGet_49" ExportPath="/Script/BlueprintGraph.K2Node_VariableGet'/Game/Parkour/Blueprints/BP_ParkourPawn.BP_ParkourPawn:EventGraph.K2Node_VariableGet_49'"
 VariableReference=(MemberName="WallRunSpeedThreshold",MemberGuid=2B9B587645B5A7A19A2BD49DA991CB32,bSelfContext=True)
 NodePosX=1104
 NodePosY=528
 NodeGuid=90A7CA2A42083740363FD994B2037C5C
 CustomProperties Pin (PinId=CCAE7C924B340F89D952569CCE52CE20,PinName="WallRunSpeedThreshold",Direction="EGPD_Output",PinType.PinCategory="real",PinType.PinSubCategory="double",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="0.0",AutogeneratedDefaultValue="0.0",LinkedTo=(K2Node_PromotableOperator_3 C3EF171A4D6CF515DB4982B62A58D33C,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=6E79E87D47B6BBB34FE7D6ADCCDDD590,PinName="self",PinFriendlyName=NSLOCTEXT("K2Node", "Target", "Target"),PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/Engine.BlueprintGeneratedClass'/Game/Parkour/Blueprints/BP_ParkourPawn.BP_ParkourPawn_C'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=True,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_CommutativeAssociativeBinaryOperator Name="K2Node_CommutativeAssociativeBinaryOperator_3" ExportPath="/Script/BlueprintGraph.K2Node_CommutativeAssociativeBinaryOperator'/Game/Parkour/Blueprints/BP_ParkourPawn.BP_ParkourPawn:EventGraph.K2Node_CommutativeAssociativeBinaryOperator_3'"
 bDefaultsToPureFunc=True
 FunctionReference=(MemberParent="/Script/CoreUObject.Class'/Script/Engine.KismetMathLibrary'",MemberName="BooleanAND")
 NodePosX=1504
 NodePosY=208
 NodeGuid=3C32DCFE4455CBA6CEF00EBE18F624A3
 CustomProperties Pin (PinId=1616700542073EEABC09AD9E50ECB91A,PinName="self",PinFriendlyName=NSLOCTEXT("K2Node", "Target", "Target"),PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/Engine.KismetMathLibrary'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultObject="/Script/Engine.Default__KismetMathLibrary",PersistentGuid=00000000000000000000000000000000,bHidden=True,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=300215244743FD580CE7C39DBA9E5B0E,PinName="A",PinType.PinCategory="bool",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="false",AutogeneratedDefaultValue="false",LinkedTo=(K2Node_CallFunction_44 1C9FADCB447B8BEC0D40F192F82765A7,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=5C3BFDC5458DDEBC3E936F93CBE6AE31,PinName="B",PinType.PinCategory="bool",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="false",AutogeneratedDefaultValue="false",LinkedTo=(K2Node_PromotableOperator_3 2D18A8FB4CD7FF240A193981EA7CEF2B,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=62362C6A489C5E03F444289F8FBA0D45,PinName="ReturnValue",Direction="EGPD_Output",PinType.PinCategory="bool",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="false",AutogeneratedDefaultValue="false",LinkedTo=(K2Node_IfThenElse_11 548FFDBF49E7E4911ED46FA731CAFCEF,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_VariableSet Name="K2Node_VariableSet_22" ExportPath="/Script/BlueprintGraph.K2Node_VariableSet'/Game/Parkour/Blueprints/BP_ParkourPawn.BP_ParkourPawn:EventGraph.K2Node_VariableSet_22'"
 VariableReference=(MemberName="OutWallLocation",MemberGuid=9D106BC84902D624DF4002B7BFAD2A9E,bSelfContext=True)
 NodePosX=1920
 NodePosY=224
 NodeGuid=B4F1A730465F55B4EF7BD7B3E7B34CE3
 CustomProperties Pin (PinId=F79190E745EDD39E53762487684C4137,PinName="execute",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_IfThenElse_11 1B7CFFDE4AF44674563796B1FBCA7292,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=22FAEEBE419A47DBEE3FD1BC084BF6CA,PinName="then",Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_VariableSet_25 660FD06442918862600F7FB3315EA5BB,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=75ABB0034242E0579D6489A24C154843,PinName="OutWallLocation",PinType.PinCategory="struct",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.ScriptStruct'/Script/CoreUObject.Vector'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="0, 0, 0",AutogeneratedDefaultValue="0, 0, 0",LinkedTo=(K2Node_CallFunction_44 C378B8484E4719E4C1EF79B29F2FD9DE,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=2275A9EA4334413FB6AB3B9E2357CC69,PinName="Output_Get",PinToolTip="Retrieves the value of the variable, can use instead of a separate Get node",Direction="EGPD_Output",PinType.PinCategory="struct",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.ScriptStruct'/Script/CoreUObject.Vector'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="0, 0, 0",AutogeneratedDefaultValue="0, 0, 0",PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=A8078F414A17A5695C4540A142519050,PinName="self",PinFriendlyName=NSLOCTEXT("K2Node", "Target", "Target"),PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/Engine.BlueprintGeneratedClass'/Game/Parkour/Blueprints/BP_ParkourPawn.BP_ParkourPawn_C'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=True,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_VariableSet Name="K2Node_VariableSet_25" ExportPath="/Script/BlueprintGraph.K2Node_VariableSet'/Game/Parkour/Blueprints/BP_ParkourPawn.BP_ParkourPawn:EventGraph.K2Node_VariableSet_25'"
 VariableReference=(MemberName="OutWallNormal",MemberGuid=BDBD314D4D3EF3D059AE5AB634C005BB,bSelfContext=True)
 NodePosX=2176
 NodePosY=288
 NodeGuid=C8145E1F4D639E25DC2013890FC5E51E
 CustomProperties Pin (PinId=660FD06442918862600F7FB3315EA5BB,PinName="execute",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_VariableSet_22 22FAEEBE419A47DBEE3FD1BC084BF6CA,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=E5734985492901BE80886FBE7178F2B9,PinName="then",Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CallFunction_50 DCB2AEE34AACB72A047E1CBE64A99A95,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=74354A424CAA1F0F95DA6792BDE372AF,PinName="OutWallNormal",PinType.PinCategory="struct",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.ScriptStruct'/Script/CoreUObject.Vector'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="0, 0, 0",AutogeneratedDefaultValue="0, 0, 0",LinkedTo=(K2Node_CallFunction_44 9CBA499E4E4F3C9DEB36109137D02E3E,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=6973AC27483FEBCCF291C481E4D93D01,PinName="Output_Get",PinToolTip="Retrieves the value of the variable, can use instead of a separate Get node",Direction="EGPD_Output",PinType.PinCategory="struct",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.ScriptStruct'/Script/CoreUObject.Vector'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="0, 0, 0",AutogeneratedDefaultValue="0, 0, 0",PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=1104F2444A769B87BD8A75A6C269F963,PinName="self",PinFriendlyName=NSLOCTEXT("K2Node", "Target", "Target"),PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/Engine.BlueprintGeneratedClass'/Game/Parkour/Blueprints/BP_ParkourPawn.BP_ParkourPawn_C'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=True,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_CallFunction Name="K2Node_CallFunction_50" ExportPath="/Script/BlueprintGraph.K2Node_CallFunction'/Game/Parkour/Blueprints/BP_ParkourPawn.BP_ParkourPawn:EventGraph.K2Node_CallFunction_50'"
 FunctionReference=(MemberParent="/Script/CoreUObject.Class'/Script/Mover.MoverComponent'",MemberName="QueueNextMode")
 NodePosX=2448
 NodePosY=384
 NodeGuid=78E4B4EE45AEA6F978428B8D0B7BE670
 CustomProperties Pin (PinId=DCB2AEE34AACB72A047E1CBE64A99A95,PinName="execute",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_VariableSet_25 E5734985492901BE80886FBE7178F2B9,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=7F0C1945406F8DDFCC3D75BAB8672BBF,PinName="then",Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=00CC33584BDD56EB5859248F79C86F48,PinName="self",PinFriendlyName=NSLOCTEXT("K2Node", "Target", "Target"),PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/Mover.MoverComponent'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_VariableGet_50 8008928245C34C54237638AF15BC0A93,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=11DA04E7429B152B23BF5987D8724284,PinName="DesiredModeName",PinType.PinCategory="name",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="WallRun",AutogeneratedDefaultValue="None",PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=B3E91CA647633DF7EA20C891E371A69C,PinName="bShouldReenter",PinType.PinCategory="bool",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="false",AutogeneratedDefaultValue="false",PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_VariableGet Name="K2Node_VariableGet_50" ExportPath="/Script/BlueprintGraph.K2Node_VariableGet'/Game/Parkour/Blueprints/BP_ParkourPawn.BP_ParkourPawn:EventGraph.K2Node_VariableGet_50'"
 VariableReference=(MemberName="ExtendedCharacterMoverComponent",bSelfContext=True)
 NodePosX=2032
 NodePosY=432
 NodeGuid=520D32254CD3E6A433D1468AE05CE3CD
 CustomProperties Pin (PinId=8008928245C34C54237638AF15BC0A93,PinName="ExtendedCharacterMoverComponent",Direction="EGPD_Output",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/Engine.BlueprintGeneratedClass'/MoverExamples/Components/ExtendedCharacterMoverComponent.ExtendedCharacterMoverComponent_C'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CallFunction_50 00CC33584BDD56EB5859248F79C86F48,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=67F7755D4064C21C2C5D3F84E62F61E0,PinName="self",PinFriendlyName=NSLOCTEXT("K2Node", "Target", "Target"),PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/Engine.BlueprintGeneratedClass'/Game/Parkour/Blueprints/BP_ParkourPawn.BP_ParkourPawn_C'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=True,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/UnrealEd.EdGraphNode_Comment Name="EdGraphNode_Comment_19" ExportPath="/Script/UnrealEd.EdGraphNode_Comment'/Game/Parkour/Blueprints/BP_ParkourPawn.BP_ParkourPawn:EventGraph.EdGraphNode_Comment_19'"
 CommentColor=(R=0.150000,G=0.150000,B=0.150000,A=0.500000)
 bCommentBubbleVisible_InDetailsPanel=False
 NodePosX=-176
 NodePosY=64
 NodeWidth=2928
 NodeHeight=544
 bCommentBubblePinned=False
 bCommentBubbleVisible=False
 NodeComment="Check for wall running conditions (player is falling, wall is in range, player is moving over speed threshold) and queue wall running"
 NodeGuid=5F26233246E338AEF4B718B520F76A11
End Object

### Check for Double Jump While Wall Running

Your character includes some Blueprint logic that handles jump actions. Every frame, the Blueprint checks for jump input and if the player has pressed jump while being on the ground, it triggers a Double Jump event that creates a multi-jump move. When you created the Wall Running Movement mode, you added the `Mover_IsOnGround` tag so the conditions for jumping will be true even when wall running. You’ll modify the existing jump-handling logic to check if the player is in the Wall Run Movement Mode and call `SetWallJump()` if they are.

You implemented `SetWallJump()` in the `WallRunActorComponent` class. This function sets `bShouldWallJump` to true, starts the wall jump cooldown, and queues `ResetWallJump()`. Then next tick, `ProcessWallJump()` in the Movement Mode checks `bShouldWallJump`.

To check for jump input during a wall run, follow these steps:

- In the **My Blueprint** panel, double-click the **Double Jump** event to find it in the graph. This logic applies a multi jump to whatever the current Movement Mode is doing. Instead of always running the existing logic, you want to instead call `SetWallJump()` if the player is wall running.
- Delete the wire coming from the **Event DoubleJump** node and add some space between the event node and the other nodes.
- Drag off the event node pin and add a **Branch **node to check if the player is currently in the Wall Run Movement Mode.
- Set up the **Branch **node’s **Condition **to check if the active Movement Mode is named **WallRun**:Below the **Branch **node, add a **Get Movement Mode Name (ExtendedCharacterMoverComponent)**.
- Drag off the **Return Value **pin, add an **Equal **operator node and enter `WallRun` in the second pin’s text box.
- Connect the **Equal **node’s return value pin to the **Condition **pin.

- Connect the **Branch **node’s **False **pin to the existing **Queue Layered Movement Node**.
- Drag off the **Branch **node’s **True **pin and add a** Set Wall Jump (WallRunActor)** node.
- Save and compile the Blueprint.

### Add a Wall Run Option to OnMovementModeChanged Event

Just like you did with the Grappling Hook Movement Mode, you’ll need to initialize the Wall Run Movement Mode with some information when it becomes the active Movement Mode.

To set up the Wall Run Movement mode with the found wall location and normal from `FindWall()`, follow these steps:

- In the** My Blueprint** panel, double-click **OnMovementModeChanged_Event **to find it in the graph.
- In the** Switch on Name** node, add a new pin, and use the **Details **panel to name it `WallRun`.
- Similar to the Grappling Hook setup, drag off the **WallRun **pin, add a **Cast To WallRunMovementMode** node, and connect its **Object **pin to a **Find Movement Mode By Name (ExtendedCharacterMoverComponent)** node.
- In the **Find Movement Mode** node, enter `WallRun` as the **Movement Mode Name**.
- After the **Cast To** node, connect a **Set Hit Location** node and a **Set Wall Normal** node. In the node actions list, you may need to turn off **Context Sensitive** to find nodes for these Wall Run Movement Mode variables.
- Connect the** Cast To **node’s **As Wall Run Movement Mode** pin to the **Target **pin of both **Set **nodes.
- In the **My Blueprint **panel, from the **Variables **list, drag **OutWallLocation **onto the **Hit Location** pin and drag **OutWallNormal **onto the **Wall Normal** pin.
- Save and compile your Blueprint.

## Test the Wall Running Movement

Play your game, run toward a wall, and jump at the wall to try running along it. Try to jump while wall running both in a location where the wall run can continue and in a location where jumping ends the wall run. Experiment with building different angles of wall segments to see what angles continue or end a wall run.

For jumping from wall to wall, try positioning parallel walls about three meters apart.

### Adjust Wall Running Behavior

To adjust wall running behavior, select your Pawn’s **ExtendedCharacterMoverComponent **and expand the **Movement Mode > WallRun ** properties. Adjust **Wall Run Speed** and the wall jump velocity values to speed up or slow down the wall run movement.

### Mark Walls as Runnable or Not Runnable

When you defined the `FindWall()` function in the Wall Run Actor Component class, you added this check for a `NoWallRun` Actor tag:

 C++

```
// If Actor is tagged NoWallRun, skip it and continue to next loop iteration
if (HitActor->ActorHasTag(FName("NoWallRun")))
{
	continue;
}
```

// If Actor is tagged NoWallRun, skip it and continue to next loop iteration
if (HitActor->ActorHasTag(FName("NoWallRun")))
{
 continue;
}

To add this Actor tag to a wall Actor in your level and prevent the player from wall running on it, follow these steps:

- In the level editor, select a wall or other surface in your level.
- In the **Details **panel, search for `tags`. In the **Actor **section, next to the **Tags **list, click **+** to add a new Actor tag.
- Enter `NoWallRun` as the tag’s name.

However, it’s best to design this Actor tag check so that you have to add tags to as few Actors as possible. Depending on what portion of your level should be wall runnable, you can negate the if statement and change the tag name to make this Actor tag check more convenient for your project.

For example, to make Actors opt in to being wall runnable instead of opting out, change the Actor tag check in your code to this:

 C++

```
// If Actor does not have "WallRunnable" tag, skip it and continue to next loop iteration
if (!HitActor->ActorHasTag(FName("WallRunnable")))
{
	continue;
}
```

// If Actor does not have "WallRunnable" tag, skip it and continue to next loop iteration
if (!HitActor->ActorHasTag(FName("WallRunnable")))
{
 continue;
}

In this case, you’d add the `WallRunnable` tag to valid walls in your level instead of restricting walls with the `NoWallRun` tag.

## Next Up

Your Pawn character now has all their movement behaviors! To round out your game, you’ll add checkpoints and a respawn mechanic, and then build your parkour obstacle course.

- [image: Track Progress With Checkpoints] Track Progress With CheckpointsBuild a Checkpoint gameplay object in C++ and Blueprints to track a player’s progress through a platforming obstacle course and set where they respawn. (-> parkour-05-course-progress-with-checkpoints)

On this page

- Create the Wall Running Component (-> mover-04-wall-running-movement-mode)
- Set Up a New Actor Component Class (-> mover-04-wall-running-movement-mode)
- Set up WallRunActorComponent.cpp (-> mover-04-wall-running-movement-mode)
- Disable Ticking in the Constructor (-> mover-04-wall-running-movement-mode)
- Define SetCooldown() (-> mover-04-wall-running-movement-mode)
- Define ResetCooldown() (-> mover-04-wall-running-movement-mode)
- Define SetWallJump() (-> mover-04-wall-running-movement-mode)
- Define ResetWallJump() (-> mover-04-wall-running-movement-mode)
- Define FindWall() (-> mover-04-wall-running-movement-mode)
- Create the Wall Running Movement Mode (-> mover-04-wall-running-movement-mode)
- Create and Set Up the Movement Mode Class (-> mover-04-wall-running-movement-mode)
- Implement Core Functions (-> mover-04-wall-running-movement-mode)
- Define InitializeWallRun() (-> mover-04-wall-running-movement-mode)
- Define ApplyMovementAlongWall() (-> mover-04-wall-running-movement-mode)
- Define ProcessWallJump() (-> mover-04-wall-running-movement-mode)
- Define DetectSharpTurnBreak() (-> mover-04-wall-running-movement-mode)
- Define UpdateCameraClamp() (-> mover-04-wall-running-movement-mode)
- Define SimulationTick_Implementation (-> mover-04-wall-running-movement-mode)
- Add Standard Setup Code (-> mover-04-wall-running-movement-mode)
- Initialize Wall Running (-> mover-04-wall-running-movement-mode)
- Move Player Along the Wall (-> mover-04-wall-running-movement-mode)
- End the Wall Run (-> mover-04-wall-running-movement-mode)
- Update the Player Camera (-> mover-04-wall-running-movement-mode)
- Define Deactivate() (-> mover-04-wall-running-movement-mode)
- Define OnRegistered() and OnUnregistered() (-> mover-04-wall-running-movement-mode)
- Complete Code (-> mover-04-wall-running-movement-mode)
- Add Wall Running to the Character Blueprint (-> mover-04-wall-running-movement-mode)
- Add the Component and Movement Mode (-> mover-04-wall-running-movement-mode)
- Queue the Movement Mode (-> mover-04-wall-running-movement-mode)
- Check for Double Jump While Wall Running (-> mover-04-wall-running-movement-mode)
- Add a Wall Run Option to OnMovementModeChanged Event (-> mover-04-wall-running-movement-mode)
- Test the Wall Running Movement (-> mover-04-wall-running-movement-mode)
- Adjust Wall Running Behavior (-> mover-04-wall-running-movement-mode)
- Mark Walls as Runnable or Not Runnable (-> mover-04-wall-running-movement-mode)
- Next Up (-> mover-04-wall-running-movement-mode)

Related documents

Build a Parkour Platforming Game with Mover

 [image: Build a Parkour Platforming Game with Mover] (-> mover-00-build-a-platformer-course-with-mover)Mover

 [image: Mover] (-> mover-in-unreal-engine)

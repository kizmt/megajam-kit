# Sprint Movement Modifier

https://dev.epicgames.com/documentation/en-us/unreal-engine/mover-02-sprint-movement-modifier?application_version=5.9

> Build a Movement Modifier with Mover in C++ that changes the character’s movement to sprinting speed.

[image: Sprint Movement Modifier]

Learn to use this **Experimental** feature, but use caution when shipping with it.

With the Mover plugin, you can build **Movement Modifiers** that change an Actor’s movement independently of the active Movement Mode. Movement Modifiers are useful for temporary gameplay effects such as sprinting, slowing movement, or buffs that adjust movement behavior.

In this part of the tutorial series, you’ll finish implementing the Pawn’s Sprint action by creating a new Movement Modifier class that temporarily changes the maximum speed of the Pawn.

Using a standard Character Movement Component, you would directly modify its maximum speed property and manually restore the original value. Using a **Sprint Movement Modifier**, the modifier adjusts the maximum speed when it’s active and restores the original speed setting when the modifier ends. In the Pawn’s Blueprint, you’ll tell Mover to apply and remove the modifier.

This approach makes temporary movement effects easier to manage:

- Movement Modifiers apply their changes independently, so multiple modifiers that affect the same setting can coexist instead of overwriting each other.

- You can configure a modifier to restore original settings when it ends, so you don’t need to manually keep track of and reset these values.

## Create a Sprint Movement Modifier Struct

The Mover plugin defines a base struct named `FMovementModifierBase` in `MovementModifier.h`. This struct provides several functions that control how a Movement Modifier behaves. To create a new Movement Modifier, derive a new struct from FMovementModifierBase and implement the functions you need.

The Unreal Editor’s New C++ Class Wizard doesn’t include Mover classes in the Choose Parent Class list, so you’ll start by creating an empty class and manually edit the files in Visual Studio to make a struct that inherits from FMovementModifierBase.

### Create the Class

To create a new, empty class that will become your Sprint Movement Modifier, follow these steps:

- In Unreal Editor, go to **Tools > New C++ Class**.
- Select **None **as the parent class.
- Name it `SprintModifier`.
- Select **Public **and click** Create Class**.
- The new class files open in Visual Studio. Refresh the project when prompted.

### Edit the Header to Inherit from MovementModifier

To turn the class into a struct that inherits from MovementModifier, follow these steps:

- In `SprintModifier.h`, include the Mover plugin’s `MovementModifier.h` file to access the base struct.
- In the class declaration line, change class to struct and add `: public FMovementModifierBase` to make it inherit from the struct in `MovementModifier`.
- Before the class declaration, add `USTRUCT(BlueprintType)` to tell the Unreal Header Tool this is a struct and expose it to Blueprints. Adding the `USTRUCT` macro turns the plain C++ struct into a reflected Unreal Engine type.
- Because this type now uses Unreal Engine’s reflection system, add `SprintModifier.generated.h` as the last include in the file as required by Unreal Engine.
- Inside the struct, before the public section, add `GENERATED_BODY()`.
- In the class and constructor declaration lines, rename your struct to `FSprintModifier` so it matches Unreal Engine naming conventions for structs.
- Delete the destructor in the public section. C++ ```
// Copyright Epic Games, Inc. All Rights Reserved.

#pragma once

#include "CoreMinimal.h"
#include "MovementModifier.h"
#include "SprintModifier.generated.h"

USTRUCT(BlueprintType)
struct PARKOURGAME_API FSprintModifier : public FMovementModifierBase
```
- Save your files and close VS. In Unreal Editor, refresh your Visual Studio project to generate the new files, and then open VS again.
- Rebuild your solution.

Take some time to look at the definition of the `FMovementModifierBase` struct in the `MovementModifier.h` file. This struct definition shows the data and functions that your movement modifiers can use or override.

To finish setting up the header file with the overrides you need for sprinting, follow these steps:

- Override the `OnStart`, `OnEnd`, and `Clone` functions. C++ ```
USTRUCT(BlueprintType)
struct PARKOURGAME_API FSprintModifier : public FMovementModifierBase
{
	GENERATED_BODY()

public:
	FSprintModifier();

	virtual void OnStart(UMoverComponent* MoverComp, const FMoverTimeStep& TimeStep, const FMoverSyncState& SyncState, const FMoverAuxStateContext& AuxState) override;
``` Mover calls `OnStart()` when code or the Blueprint queues the modifier, and Mover calls `OnEnd()` when you remove the modifier.
- Declare the two protected functions that you’ll call to apply or remove temporary movement settings:`void ApplyMovementSettings(UMoverComponent* MoverComp)`
- `void RevertMovementSettings(UMoverComponent* MoverComp)`

 C++

```
USTRUCT(BlueprintType)
struct PARKOURGAME_API FSprintModifier : public FMovementModifierBase
{
	GENERATED_BODY()

public:
	FSprintModifier();

	virtual void OnStart(UMoverComponent* MoverComp, const FMoverTimeStep& TimeStep, const FMoverSyncState& SyncState, const FMoverAuxStateContext& AuxState) override;
```

- Declare a public `float` variable named `SprintMaxSpeed`. Add a `UPROPERTY` macro with `EditAnywhere`, `BlueprintReadWrite`, and a category named `“Movement Modifier”`. Set its default value to `1600`.You’ll use this property to customize sprint speed from the level editor.

The complete header file should look like this:

 C++

```
// Copyright Epic Games, Inc. All Rights Reserved.

#pragma once

#include "CoreMinimal.h"
#include "MovementModifier.h"
#include "SprintModifier.generated.h"

USTRUCT(BlueprintType)
struct PARKOURGAME_API FSprintModifier : public FMovementModifierBase
```

### Implement the OnStart and OnEnd Functions

To start implementing `SprintModifier`, you’ll add logic to handle the Movement Modifier’s lifecycle. `OnStart()` should check for proper input and then apply sprint movement. OnEnd() can simply revert to original settings.

To set up `SprintModifier.cpp`, follow these steps:

- In `SprintModifier.cpp`, delete the destructor.
- In the class constructor, add the `F` prefix in front of `SprintModifier`.
- Add the following include statements after the `SprintModifier.h` include: C++ ```
#include "MoverComponent.h"
#include "DefaultMovementSet/Settings/CommonLegacyMovementSettings.h"
#include "DefaultMovementSet/Settings/StanceSettings.h"
#include "Engine/Blueprint.h"
#include "GameFramework/Pawn.h"
#include "MoveLibrary/MovementUtils.h"
``` #include "MoverComponent.h" #include "DefaultMovementSet/Settings/CommonLegacyMovementSettings.h" #include "DefaultMovementSet/Settings/StanceSettings.h" #include "Engine/Blueprint.h" #include "GameFramework/Pawn.h" #include "MoveLibrary/MovementUtils.h"

To implement your OnStart function override, follow these steps:

- In `SprintModifier.cpp`, add a function definition for `OnStart()`.
- Inside the function, check that the Mover Component has valid stance settings that you can modify. Add an `if` statement with a condition that calls `FindSharedSettings_Mutable` to get the component’s shared stance settings object and save it in a new `UStanceSettings` object pointer. C++ ```
void FSprintModifier::OnStart(UMoverComponent* MoverComp, const FMoverTimeStep& TimeStep, const FMoverSyncState& SyncState, const FMoverAuxStateContext& AuxState)
{
	if (UStanceSettings* StanceSettings = MoverComp->FindSharedSettings_Mutable<UStanceSettings>())
	{

	}
}
``` void FSprintModifier::OnStart(UMoverComponent* MoverComp, const FMoverTimeStep& TimeStep, const FMoverSyncState& SyncState, const FMoverAuxStateContext& AuxState) { if (UStanceSettings* StanceSettings = MoverComp->FindSharedSettings_Mutable()) { } }Shared settings are configuration objects owned by the MoverComponent (not just a specific modifier or mode) that store movement parameters used by different movement behaviors.
- In the `if` statement, call `ApplyMovementSettings`, passing the `MoverComponent`. C++ ```
void FSprintModifier::OnStart(UMoverComponent* MoverComp, const FMoverTimeStep& TimeStep, const FMoverSyncState& SyncState, const FMoverAuxStateContext& AuxState)
{
	if (UStanceSettings* StanceSettings = MoverComp->FindSharedSettings_Mutable<UStanceSettings>())
	{
		ApplyMovementSettings(MoverComp);
	}
}
``` void FSprintModifier::OnStart(UMoverComponent* MoverComp, const FMoverTimeStep& TimeStep, const FMoverSyncState& SyncState, const FMoverAuxStateContext& AuxState) { if (UStanceSettings* StanceSettings = MoverComp->FindSharedSettings_Mutable()) { ApplyMovementSettings(MoverComp); } }

If you expand this project with additional stances like crouching, OnStart is where you can check that the player is in an acceptable stance before applying sprint settings. Use the SyncState passed to OnStart to check the Pawn’s current stance. You’ll learn more about working with stances and Movement Modes when implementing the Grappling Hook and Wall Running Movement Modes.

To implement `OnEnd()`, follow these steps:

- Add a function definition for `OnEnd()`.
- In the function, call `RevertMovementSettings`, passing the `MoverComponent`. C++ ```
void FSprintModifier::OnEnd(UMoverComponent* MoverComp, const FMoverTimeStep& TimeStep, const FMoverSyncState& SyncState, const FMoverAuxStateContext& AuxState)
{
	RevertMovementSettings(MoverComp);
}
``` void FSprintModifier::OnEnd(UMoverComponent* MoverComp, const FMoverTimeStep& TimeStep, const FMoverSyncState& SyncState, const FMoverAuxStateContext& AuxState) { RevertMovementSettings(MoverComp); }

`SprintModifier.cpp` should now look like this:

 C++

```
// Copyright Epic Games, Inc. All Rights Reserved.

#include "SprintModifier.h"
#include "MoverComponent.h"
#include "DefaultMovementSet/Settings/CommonLegacyMovementSettings.h"
#include "DefaultMovementSet/Settings/StanceSettings.h"
#include "Engine/Blueprint.h"
#include "GameFramework/Pawn.h"
#include "MoveLibrary/MovementUtils.h"
```

### Implement the Clone Function

When you queue (or apply) a Movement Modifier, Mover creates a new copy of the modifier which becomes the active modifier in the movement system. It uses the `Clone()` function to create that copy. Every custom Movement Modifier must implement `Clone()` so Mover can correctly copy the derived type.

Add a function definition for `Clone()` and add the following code:

- Create a new `FSprintModifier` by copying the current one and store the pointer in `CopyPtr`.
- Return the copy. C++ ```
FMovementModifierBase* FSprintModifier::Clone() const
{
	FSprintModifier* CopyPtr = new FSprintModifier(*this);
	return CopyPtr;
}
``` FMovementModifierBase* FSprintModifier::Clone() const { FSprintModifier* CopyPtr = new FSprintModifier(*this); return CopyPtr; }

### Apply and Revert Sprint Movement Speed

To finish your code, define the `ApplyMovementSettings` and `RevertMovementSettings` functions.

In `ApplyMovementSettings()`, you’ll get the Common Legacy Movement Settings object from the Mover Component, and set its `MaxSpeed` to the `SprintMaxSpeed`.

Add a function definition for `ApplyMovementSettings()` and add the following code:

- Add an `if` statement to check if the Mover Component’s legacy movement settings are valid. The condition should call `FindSharedSettings_Mutable` to get `MoverComp`’s Common Legacy Movement Settings and save it in a new `UCommonLegacyMovementSettings` pointer.`CommonLegacyMovementSettings` is a shared settings object that stores the core movement parameters used by the traditional `CharacterMovementComponent` model, such as maximum speed and acceleration.
- Inside the `if` statement, apply the `SprintMaxSpeed` to the `MaxSpeed` setting in `MovementSettings`. C++ ```
//Applying SprintMaxSpeed setting.
void FSprintModifier::ApplyMovementSettings(UMoverComponent* MoverComp)
{
	if (UCommonLegacyMovementSettings* MovementSettings = MoverComp->FindSharedSettings_Mutable<UCommonLegacyMovementSettings>())
	{
		MovementSettings->MaxSpeed = SprintMaxSpeed;
	}
}
``` //Applying SprintMaxSpeed setting. void FSprintModifier::ApplyMovementSettings(UMoverComponent* MoverComp) { if (UCommonLegacyMovementSettings* MovementSettings = MoverComp->FindSharedSettings_Mutable()) { MovementSettings->MaxSpeed = SprintMaxSpeed; } }

`RevertMovementSettings()` should:

- Retrieve the original Mover Component with default values.
- Look up the original movement settings in the original component.
- Retrieve the current movement settings.
- Set the current `MaxSpeed` to the original `MaxSpeed`.

With this method, you’ll be able to change the original component’s max speed and the modifier’s max speed in the level editor without needing to compile the code.

To get the original Mover Component and its configuration, retrieve it from the owning Actor’s **Class Default Object (CDO)**. In Unreal Engine, the CDO stores the class’ default property values and the engine uses the CDO as a template when creating new instances. Use `UMovementUtils::GetOriginalComponentType<T>(OwningActor)` to get the component of type `T` from the Actor’s CDO.

Add a function definition for `RevertMovementSettings()` and add the following code:

- Add an `if` statement that retrieves the original default Mover Component (the CDO) and checks that it’s valid. The condition should declare a new const `UMoverComponent` pointer and set it to the result of calling `UMovementUtils::GetOriginalComponentType` on the owning Actor. C++ ```
//Reverting Settings to Original Settings
void FSprintModifier::RevertMovementSettings(UMoverComponent* MoverComp)
{
	if (const UMoverComponent* CDOMoverComp = UMovementUtils::GetOriginalComponentType<UMoverComponent>(MoverComp->GetOwner()))
	{

	}
}
``` //Reverting Settings to Original Settings void FSprintModifier::RevertMovementSettings(UMoverComponent* MoverComp) { if (const UMoverComponent* CDOMoverComp = UMovementUtils::GetOriginalComponentType(MoverComp->GetOwner())) { } }GetOriginalComponentType returns the MoverComponent that exists on the Actor’s default template, not the runtime instance.
- In the `if` statement, declare a new const `UCommonLegacyMovementSettings` pointer to store the Mover Component’s original settings.To retrieve those settings, call `FindSharedSettings` on `CDOMoverComp`. C++ ```
if (const UMoverComponent* CDOMoverComp = UMovementUtils::GetOriginalComponentType<UMoverComponent>(MoverComp->GetOwner()))
{
	// --- New Code Start ---
	const UCommonLegacyMovementSettings* OriginalMovementSettings = CDOMoverComp->FindSharedSettings<UCommonLegacyMovementSettings>();
	// --- New Code Start ---

}
``` if (const UMoverComponent* CDOMoverComp = UMovementUtils::GetOriginalComponentType(MoverComp->GetOwner())) { // --- New Code Start --- const UCommonLegacyMovementSettings* OriginalMovementSettings = CDOMoverComp->FindSharedSettings(); // --- New Code Start --- }
- Declare a `MovementSettings` pointer to capture the current, modified movement settings. It should be the same as `MovementSetting`’s declaration in `ApplyMovementSettings()`. C++ ```
if (const UMoverComponent* CDOMoverComp = UMovementUtils::GetOriginalComponentType<UMoverComponent>(MoverComp->GetOwner()))
{
	const UCommonLegacyMovementSettings* OriginalMovementSettings = CDOMoverComp->FindSharedSettings<UCommonLegacyMovementSettings>();

	// --- New Code Start ---
	UCommonLegacyMovementSettings* MovementSettings = MoverComp->FindSharedSettings_Mutable<UCommonLegacyMovementSettings>();
	// --- New Code End ---

}
``` if (const UMoverComponent* CDOMoverComp = UMovementUtils::GetOriginalComponentType(MoverComp->GetOwner())) { const UCommonLegacyMovementSettings* OriginalMovementSettings = CDOMoverComp->FindSharedSettings(); // --- New Code Start --- UCommonLegacyMovementSettings* MovementSettings = MoverComp->FindSharedSettings_Mutable(); // --- New Code End --- }
- Declare an `if` statement that checks if the original and current movement settings are not null. C++ ```
if (const UMoverComponent* CDOMoverComp = UMovementUtils::GetOriginalComponentType<UMoverComponent>(MoverComp->GetOwner()))
{
	const UCommonLegacyMovementSettings* OriginalMovementSettings = CDOMoverComp->FindSharedSettings<UCommonLegacyMovementSettings>();

UCommonLegacyMovementSettings* MovementSettings = MoverComp->FindSharedSettings_Mutable<UCommonLegacyMovementSettings>();

	// --- New Code Start ---
	if (MovementSettings && OriginalMovementSettings)
	{
```
- In the `if` statement, make the current `MovementSettings`’s `MaxSpeed` value equal to `OriginalMovementSettings`’ `MaxSpeed` value. C++ ```
if (MovementSettings && OriginalMovementSettings)
{
MovementSettings->MaxSpeed = OriginalMovementSettings->MaxSpeed;
}
``` if (MovementSettings && OriginalMovementSettings) { MovementSettings->MaxSpeed = OriginalMovementSettings->MaxSpeed; }
- Build your project.

The final cpp should look like this:

 C++

```
// Copyright Epic Games, Inc. All Rights Reserved.

#include "SprintModifier.h"
#include "MoverComponent.h"
#include "DefaultMovementSet/Settings/CommonLegacyMovementSettings.h"
#include "DefaultMovementSet/Settings/StanceSettings.h"
#include "Engine/Blueprint.h"
#include "GameFramework/Pawn.h"
#include "MoveLibrary/MovementUtils.h"
```

## Add Sprint to the Character’s Blueprint

Now that your sprint behavior is defined, you can wire it into the movement system so Unreal Engine applies the modifier in response to sprint input.

To apply the movement modifier when the Sprint action starts, follow these steps:

- In Unreal Editor, open your Pawn’s Blueprint and go to the **Event Graph**.
- In the** My Blueprint **panel, expand **EventGraph** and double-click **EnhancedInputAction IA_Dash** to go to the area of the graph with input action events.
- Above the **Capture Dashing Inputs** group, right-click in the empty area of the graph, search for `IA_Sprint`, and create a new** IA_Sprint Enhanced Action Event **node.
- Click the arrow at the bottom of the node to see more options. When IA_Sprint starts, you want to activate your Sprint Movement Modifier. So, from the **Started **exec pin, create a **Queue Movement Modifier** node. Unreal Engine automatically adds the Pawn’s **Mover Component** as the **Target**.**Started** fires once when the input first becomes active, while **Triggered **fires every frame while the input is active.
- Set up a new variable for your SprintModifier struct:In the **My Blueprint **panel, in the **Variables **section, click **+** to add a new variable.
- Name it `MySprintModifier`.
- Change its type to **Sprint Modifier**.
- Drag it onto the **Queue Movement Modifier** node’s **Movement Modifier** pin.

- The** Queue Movement Modifier** node returns a Movement Modifier Handle which is an identifier for that modifier. You’ll need to use it elsewhere in the graph, so set up a new variable to store this handle:Right-click the** Queue Movement Modifier** node’s **Return Value** pin and select **Promote to Variable**.
- In the **Variables **list, change the new **Movement Modifier Handle** variable’s name to `SprintModifierHandle`.

To remove the movement modifier when the Sprint action finishes, follow these steps:

- From the Event node’s **Completed **pin, add a **Cancel Modifier from Handle **node. Pick the first node in the list, where the target is **Mover Component**.
- Duplicate the **Extended Character Mover Component** (right-click > **Duplicate**) and set it as the **Target **of the** Cancel Modifier** node.
- From the **Variables **list, drag **SprintModifierHandle **onto the **Modifier Handle **pin.
- Compile the Blueprint.

To confirm the correct default values in the struct, follow these steps:

- In the **Variables **list, click **MySprintModifier**.
- In the **Details **panel, expand the** Default Value** entry.
- Ensure the **Sprint Max Speed** is set to **1600 **and **Duration **is set to **-1.0**. A negative **Duration **value means the sprint effect is permanent until the action is stopped.
- Save and compile the Blueprint.

## Test the Sprint Action

Now, when the player presses the Sprint key during gameplay:

- **Queue Movement Modifier** adds your SprintModifier.
- `OnStart()` runs and calls `ApplyMovementSettings()`.
- `MaxSpeed` becomes 1600.

When they release the Sprint key during gameplay:

- **Cancel Movement Modifier** removes that modifier.
- `OnEnd()` runs and calls `RevertMovementSettings()`.
- `MaxSpeed` returns to the original default value.

Try it out! Play your game and hold left **Shift **when running forward to make your character sprint.

A playtest where the Pawn character alternates between running normally and sprinting.

## Next Up

You’ve learned how to use a Movement Modifier to change a setting in existing movement modes. Next, you’ll learn to add a new movement mode and implement the grappling hook action.

- [image: Grappling Hook Movement Mode] Grappling Hook Movement ModeBuild a Movement Mode in C++ that gives a character the ability to grapple towards a target. (-> mover-03-grappling-hook-movement-mode)

On this page

- Create a Sprint Movement Modifier Struct (-> mover-02-sprint-movement-modifier)
- Create the Class (-> mover-02-sprint-movement-modifier)
- Edit the Header to Inherit from MovementModifier (-> mover-02-sprint-movement-modifier)
- Implement the OnStart and OnEnd Functions (-> mover-02-sprint-movement-modifier)
- Implement the Clone Function (-> mover-02-sprint-movement-modifier)
- Apply and Revert Sprint Movement Speed (-> mover-02-sprint-movement-modifier)
- Add Sprint to the Character’s Blueprint (-> mover-02-sprint-movement-modifier)
- Test the Sprint Action (-> mover-02-sprint-movement-modifier)
- Next Up (-> mover-02-sprint-movement-modifier)

Related documents

Build a Parkour Platforming Game with Mover

 [image: Build a Parkour Platforming Game with Mover] (-> mover-00-build-a-platformer-course-with-mover)Mover

 [image: Mover] (-> mover-in-unreal-engine)Introduction to Blueprints

 [image: Introduction to Blueprints] (-> introduction-to-blueprints-visual-scripting-in-unreal-engine)

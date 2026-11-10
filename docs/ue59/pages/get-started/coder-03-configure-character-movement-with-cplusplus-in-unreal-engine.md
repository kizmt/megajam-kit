# Configure Character Movement

https://dev.epicgames.com/documentation/en-us/unreal-engine/coder-03-configure-character-movement-with-cplusplus-in-unreal-engine?application_version=5.9

> Learn how to bind player input to character movement in C++.

[image: Configure Character Movement]

## Before You Start

Ensure you've completed the following objectives in the previous section, Create a Player Character With Input Actions (-> coder-02-create-a-player-character-with-input-actions-in-cplusplus):

- Created a Character C++ class.
- Learned how Input Actions and Input Mapping Contexts work.

## Learn to Link Input and Movement

Explore a sample Character Blueprint to learn how Input Actions, Input Mapping Contexts, and code combine to produce movement. Then, learn to replicate that functionality in code.

### Visualize Input in Blueprints

The `BP_FirstPersonCharacter` class that comes with the First Person template is a great example of how Blueprints and Input Actions interact.

In the **Content Browser **asset tree, navigate to **Content > FirstPerson > Blueprints**. Double-click the `BP_FirstPersonCharacter` class to open it in the **Blueprint Editor**.

The Blueprint’s **Event Graph is **in the middle of the **Blueprint Editor**. The **EventGraph **is a node graph that uses events and function calls to perform an ordered series of actions in response to gameplay. In this graph, there’s node groups for **Camera Input**, **Movement Input**, and **Jump Input**.

### Understand Jump Input Logic

Zoom in to the **Jump Input **group. The **EnhancedInputAction IA_Jump** node represents the `IA_Jump` input action asset you explored in the last step.

When the Input Action is triggered, it fires the **Started **and **Triggered **events. The node’s **Started **event leads to a function node named **Jump**. This Blueprint’s parent Character class has built-in jump functionality, and this function is called whenever **IA_Jump **is triggered by a button press.

When the jump finishes, the node triggers a **Completed **event. This event leads to another function node, **Stop Jumping**, which it also inherits from the Character class.

 Jump Input logic also adds touch controls, but these aren’t covered in this tutorial.

### Understand Movement Input Logic

Next, look at the **Movement Input **group. This group also starts with a node corresponding to an Input Action, `IA_Move`.

The **IA_Move **node has a **Triggered **event that fires when any buttons bound to `IA_Move` are pressed.

**IA_Move **also contains **Action Value X** and **Action Value Y**, which are the **X **and **Y **movement values produced by player input. Because the **X **and **Y **values are separate, you need to apply each of them to the character individually.

The **Move **node is a custom function node that applies movement to the character. You can see on the node and in its Details panel that it takes two inputs named Left/Right and Forward/Backward, and IA_Move’s X and Y movement values are passed into these inputs.

Double-click the Move node or click the **Move **tab above the graph to view the logic inside the function.

The function starts with a function entry node with its input values.

The **Left/Right** node group contains an **Add Movement Input **function node that adds movement to the character based on two values: **World Direction **and **Scale Value**.

**World Direction **is the direction the character is facing in the world, and the **Scale Value **is the amount of movement to apply. Since this node handles **Left/Right** movement, it uses the **Get Actor** **Right Vector** function node to first get the right vector of the character’s position in the world, and then uses the **Left / Right** input (or the Input Action's X value**)** as the **Scale Value** to apply movement along that vector.

If `Left / Right` is positive, the character moves up the X axis, or to the right. If `Left / Right` is negative, the character moves down the X axis, or to the left.

The **Forward/Backward **group has the same setup as the **Left/Right** group, but instead uses the **Forward / Backward** input (the Input Action's Y value**)** to determine the **Scale Value** along the actor’s **Forward Vector**.

Replicating these nodes in code requires a little more effort but gives precise control over how and where your character moves.

### Assign Input to a Player With a PlayerController

The Input Mapping Context maps player input to Input Actions, but you also need to connect that input context to the player. The default player does this with the PlayerController class and input subsystem.

The PlayerController asset acts as a bridge between the human player and any in-game pawns they are controlling. It receives and processes player input and translates that input into commands, then the Pawn receives those commands and figures out how to perform that movement in the game world. You can use the same PlayerController to control different Pawns.

The PlayerController can also:

- Disable input during cutscenes or menus.
- Track scores or other player data.
- Spawn or hide UI elements

The separation between PlayerController and Character allows for flexibility and data persistence. For example, being able to switch characters (such as when a player dies) without losing player data or input handling logic because this lives within the PlayerController).

To explore how to set this up in Blueprints, back in the **Blueprints **folder in the **Content Browser**, open the `BP_FirstPersonPlayerController` Blueprint.

PlayerController classes have an Enhanced Input Local Player Subsystem. This is a subsystem that is attached to a specific local player and manages that player’s input context and mappings at runtime. Use it to manage what inputs are active and swap between input contexts at runtime. To learn more about UE subsystems, see Programming Subsystems (-> programming-subsystems-in-unreal-engine).

When the game begins, if the **Enhanced Input Local Player Subsystem** is valid, it calls **Add Mapping Context** to bind the `IMC_Default` Input Mapping Context to the player’s input subsystem. In other words, this group of nodes activates this set of inputs for the player.

- While this PlayerController logic is in a separate Blueprint from the other movement logic, in C++, you’ll implement this all within the Character class so a second C++ class isn’t necessary.
- `BP_FirstPersonCharacter`'s event graph shows another way to apply Input Mapping Contexts that involves waiting until the Pawn is possessed. This approach isn't covered in this tutorial, but you can explore it on your own.

## Set Up Your Character Class

Now that you’ve seen how movement works in Blueprints, it’s time to build it in code, then test out moving your character around the level! You’ll start by adding all necessary modules and `#include` statements, then declare the classes, functions, and properties you’ll need to implement character movement.

 The code examples in this tutorial use a project named `AdventureGame` and a Character class named `AdventureCharacter`.

### Add the Enhanced Input System

You've already ensured the Enhanced Input System is enabled in Unreal Editor, but you'll also have to manually declare it it in your project's `Build.cs` and add certain components to your Character class.

To use the Enhanced Input System in your C++ project, follow these steps:

- Open your project in Visual Studio and open `[ProjectName].Build.cs` (located in the `Source` folder with your project’s other class files). This file tells Unreal Engine what modules you need to build your project.
- In the `PublicDependencyModuleNames` function call, add `“EnhancedInput”` to the list of modules: C++ ```
PublicDependencyModuleNames.AddRange(new string[] { "Core", "CoreUObject", "Engine", "InputCore", "EnhancedInput" });
``` PublicDependencyModuleNames.AddRange(new string[] { "Core", "CoreUObject", "Engine", "InputCore", "EnhancedInput" });
- Save and close the `Build.cs` file.

To add Enhanced Input System components to your Character class, follow these steps:

- Open your Character’s `.h` file. Near the top of the file, add the following include statements:`#include “EnhancedInputComponent.h”` adds the Enhanced Input component module.
- `#include “InputActionValue.h”` enables access to the Input Action Values produced by your Input Actions.
- `#include “EnhancedInputSubsystems.h”` enables access to the local player subsystem.

 C++

```
// Copyright Epic Games, Inc. All Rights Reserved.

#pragma once

#include "CoreMinimal.h"
#include "GameFramework/Character.h"
#include "EnhancedInputComponent.h"
#include "EnhancedInputSubsystems.h"
#include "InputActionValue.h"
#include "AdventureCharacter.generated.h"
```

// Copyright Epic Games, Inc. All Rights Reserved.

#pragma once

#include "CoreMinimal.h"
#include "GameFramework/Character.h"
#include "EnhancedInputComponent.h"
#include "EnhancedInputSubsystems.h"
#include "InputActionValue.h"
#include "AdventureCharacter.generated.h"

Ensure that any `#include` statements you add come before the `AdventureCharacter.generated.h` statement. For your code to function property, this statement must be last in the list of inputs.

- After the `#include` statements, declare three new classes: `UInputMappingContext`
- `UInputAction`
- `UInputComponent`

These classes already exist in the Enhanced Input module. Declaring an existing object like this is called forward declaration and it tells the compiler that the class exists and that you’ll be using it.

 C++

```
// Copyright Epic Games, Inc. All Rights Reserved.

#pragma once

#include "CoreMinimal.h"
#include "GameFramework/Character.h"
#include "EnhancedInputComponent.h"
#include "EnhancedInputSubsystems.h"
#include "InputActionValue.h"
#include "AdventureCharacter.generated.h"
```

### Declare an InputMappingContext Pointer

In the `protected` section of your character’s `.h` file, use `TObjectPtr` to add a new `UInputMappingContext` pointer named `FirstPersonContext`. This is a pointer to the Input Mapping Context that links your Input Actions to button presses.

`TObjectPtr` is a smart pointer wrapper in Unreal Engine that is a safer way to reference `UObject`-derived types. It’s an editor-aware, garbage collection-safe replacement for raw `UObject` pointers. It’s a hard reference, so it keeps the object loaded at runtime. We recommend declaring pointers this way when programming with Unreal Engine.

Add the following declaration to the .h file:

 C++

```
UCLASS()
class ADVENTUREGAME_API AAdventureCharacter : public ACharacter
{
	GENERATED_BODY()

public:
	// Sets default values for this character's properties
	AAdventureCharacter();

protected:
```

The U prefix identifies the InputMappingContext as a UObject.

The `UPROPERTY()` macro that comes before a variable declaration tells Unreal Engine about that variable. Unreal Header Tool uses the macro to process information about your code and controls where the variable can be accessed, how it appears in the editor, and more.

This pointer has the following `UPROPERTY` values:

- `EditAnywhere`: Exposes the property to Unreal Editor in the class’ **Details **panel.
- `BlueprintReadOnly`: Blueprints can access this property but not edit it.
- `Category = Input`: The property will appear under a section named **Input **in the class’ **Details **panel. Categories are useful for organizing your code and can make navigating the editor much easier.

### Declare Jump and Move InputAction Pointers

Also in the `protected` section, add two `UInputAction` pointers named `MoveAction` and `JumpAction`. These are pointers to the `IA_Jump` and `IA_Move` Input Actions.

Give these the same `UPROPERTY()` macro as `UInputMappingContext`.

 C++

```
protected:
	// Called when the game starts or when spawned
	virtual void BeginPlay() override;

	UPROPERTY(EditAnywhere, BlueprintReadOnly, Category = Input)
	TObjectPtr<UInputMappingContext> FirstPersonContext;

	// --- New Code Start ---

	// Move Input Actions
```

### Declare the Move() Function

Your Input Actions produce Input Action Values, and you’ll pass these values to a new function that uses these values to apply movement to your character.

In the `public` section of the file, declare a new function named `Move()` that takes a const `FInputActionValue `reference named `Value`.

 C++

```
public:
	// Called every frame
	virtual void Tick(float DeltaTime) override;

	// Called to bind functionality to input
	virtual void SetupPlayerInputComponent(class UInputComponent* PlayerInputComponent) override;

	// --- New Code Start ---

	// Handles 2D Movement Input
```

The `UFUNCTION()` macro that comes before the function declaration makes Unreal Header Tool aware of the function.

Save the file. Your character’s header file should now look like the following:

 C++

```
#pragma once

#include "CoreMinimal.h"
#include "GameFramework/Character.h"
#include "EnhancedInputComponent.h"
#include "EnhancedInputSubsystems.h"
#include "InputActionValue.h"
#include "AdventureCharacter.generated.h"

class UInputMappingContext;
```

## Implement Movement Functions

Now that you’ve declared the properties you need for character movement, in your character’s `.cpp` file, you’ll design your functions to mimic the functionality you saw in the default character’s Blueprint.

### Set up the Move() Function

To start implementing the `Move()` function you declared in your `.h` file, follow these steps:

- Open your character’s `.cpp` class and add a new function definition for `Move()` at the end of the file. C++ ```
#include "AdventureCharacter.h"

// Sets default values
AAdventureCharacter::AAdventureCharacter()
{
 	// Set this character to call Tick() every frame.  You can turn this off to improve performance if you don't need it.
	PrimaryActorTick.bCanEverTick = true;

}
```
- When exploring the default character’s Input Actions, you saw that `IA_Move` has a **Value Type** of **Axis2D (Vector2D)**, so it returns an FVector2D value when triggered. Inside `Move()`, get the value of the `FInputActionValue` and store that inside a new FVector2D named `MovementValue`: C++ ```
void AAdventureCharacter::Move(const FInputActionValue& Value)
{
	// --- New Code Start ---

	// 2D Vector of movement values returned from the input action
	const FVector2D MovementValue = Value.Get<FVector2D>();

	// --- New Code End ---
}
``` void AAdventureCharacter::Move(const FInputActionValue& Value) { // --- New Code Start --- // 2D Vector of movement values returned from the input action const FVector2D MovementValue = Value.Get(); // --- New Code End --- }
- Next, before you do anything with that movement value, add an `if` statement to check if the Controller is valid. `Controller` is a pointer to the controller possessing this Actor and it must be valid for movement to work. C++ ```
void AAdventureCharacter::Move(const FInputActionValue& Value)
{
	// 2D Vector of movement values returned from the input action
	const FVector2D MovementValue = Value.Get<FVector2D>();

	// --- New Code Start ---

	// Check if the controller possessing this Actor is valid
	if (Controller)
	{
```

### Add 2D Movement Input with Move()

To produce left, right, forward, and backward movement in the Character Blueprint, the event graph added movement input by combining `IA_Move`’s **Action Value X** and **Action Value Y** with the Actor’s right vector and forward vector. You’ll implement this in code within the `Move()` function.

To apply the movement value to the character, follow these steps:

- Inside the `if` statement, call `GetActorRightVector()` to store the Actor’s right vector in a new `FVector` named `Right`. C++ ```
void AAdventureCharacter::Move(const FInputActionValue& Value)
{
	// 2D Vector of movement values returned from the input action
	const FVector2D MovementValue = Value.Get<FVector2D>();

	// Check if the controller possessing this Actor is valid
	if (Controller)
	{
		// --- New Code Start ---
```
- Then, call `AddMovementInput()` to add movement to the character, passing `Right` and the `MovementValue.X`. C++ ```
	// Check if the controller possessing this Actor is valid
	if (Controller)
	{
		// Add left and right movement
		const FVector Right = GetActorRightVector();
		// --- New Code Start ---
		AddMovementInput(Right, MovementValue.X);
		// --- New Code End ---
	}
``` // Check if the controller possessing this Actor is valid if (Controller) { // Add left and right movement const FVector Right = GetActorRightVector(); // --- New Code Start --- AddMovementInput(Right, MovementValue.X); // --- New Code End --- }
- Repeat this process for forward and backward movement storing the`GetActorForwardVector()` result in an FVector named `Forward`. Apply the movement with `MovementValue.Y`. C++ ```
	// Check if the controller possessing this Actor is valid
	if (Controller)
	{
		// Add left and right movement
		const FVector Right = GetActorRightVector();
		AddMovementInput(Right, MovementValue.X);

		// --- New Code Start ---

		// Add forward and back movement
```

Your complete `Move()` function should look like the following:

 C++

```
void AAdventureCharacter::Move(const FInputActionValue& Value)
{
	// 2D Vector of movement values returned from the input action
	const FVector2D MovementValue = Value.Get<FVector2D>();

	// Check if the controller posessing this Actor is valid
	if (Controller)
	{
		// Add left and right movement
		const FVector Right = GetActorRightVector();
```

### Bind Movement to Input with SetupPlayerInputComponent

Next, link your `Move` function to the `FirstPersonContext` input mapping context you declared earlier.

The function for this, `SetupPlayerInputComponent()`, is already defined in your character’s `.cpp` file since it’s inherited from ACharacter. This function takes a UInputComponent and uses it to set up player input.

#### Check for an Enhanced Input Component

By default, your character's `SetupPlayerInputComponent()` function starts with a call to the `SetupPlayerInputComponent()` function from ACharacter which checks if an input component exists on the character.

 C++

```
// Called to bind functionality to input
void AAdventureCharacter::SetupPlayerInputComponent(UInputComponent* PlayerInputComponent)
{
	Super::SetupPlayerInputComponent(PlayerInputComponent);
}
```

// Called to bind functionality to input
void AAdventureCharacter::SetupPlayerInputComponent(UInputComponent* PlayerInputComponent)
{
 Super::SetupPlayerInputComponent(PlayerInputComponent);
}

This only checks if a regular input component exists on the character, and you need to check if an Enhanced Input component is present instead, so delete this call to the parent class’ `SetupPlayerInputComponent()` function.

Instead, in an if statement, declare a new `UEnhancedInputComponent` pointer named `EnhancedInputComponent`. Set this equal to the result of calling `CastChecked()` on the `PlayerInputComponent` passed to this function while casting it to `UEnhancedInputComponent`.

 C++

```
// Called to bind functionality to input
void AAdventureCharacter::SetupPlayerInputComponent(UInputComponent* PlayerInputComponent)
{
	// --- New Code Start ---
	if (UEnhancedInputComponent* EnhancedInputComponent = CastChecked<UEnhancedInputComponent>(PlayerInputComponent))
	{

	}
	// --- New Code End ---
}
```

// Called to bind functionality to input
void AAdventureCharacter::SetupPlayerInputComponent(UInputComponent* PlayerInputComponent)
{
 // --- New Code Start ---
 if (UEnhancedInputComponent* EnhancedInputComponent = CastChecked<UEnhancedInputComponent>(PlayerInputComponent))
 {

 }
 // --- New Code End ---
}

#### Bind Movement Actions

Inside the `if` statement, call the `BindAction()` function from the `EnhancedInputComponent`.

`BindAction()` binds an Input Action to a function so when that action happens, the function runs. Pass the following arguments to the function:

- `MoveAction`: The input action to bind (declared in the character’s `.h` file).
- `Triggered` event from `ETriggeredEvent` : The type of trigger for the event.
- `this`: The character to bind to.
- `Move()`: A reference to the function you want to bind.

 C++

```
	if (UEnhancedInputComponent* EnhancedInputComponent = CastChecked<UEnhancedInputComponent>(PlayerInputComponent))
	{
		// --- New Code Start ---

		// Bind Movement Actions
		EnhancedInputComponent->BindAction(MoveAction, ETriggerEvent::Triggered, this, &AAdventureCharacter::Move);

		// --- New Code End ---
	}
```

 if (UEnhancedInputComponent* EnhancedInputComponent = CastChecked<UEnhancedInputComponent>(PlayerInputComponent))
 {
 // --- New Code Start ---

 // Bind Movement Actions
 EnhancedInputComponent->BindAction(MoveAction, ETriggerEvent::Triggered, this, &AAdventureCharacter::Move);

 // --- New Code End ---
 }

Now when **IA_Move** is triggered, it calls the `Move()` function to add movement to your character!

#### Bind Jump Actions

Next, add two bindings to IA_Jump, one to start jumping and another to stop jumping.

You’ll use the following arguments:

- `JumpAction`, the Input Action pointer to IA_Jump you declared in the `.h` file.
- `Started` and `Completed` trigger events.
- `Jump` and `StopJumping` functions inherited from and defined in the ACharacter parent class.

 C++

```
	if (UEnhancedInputComponent* EnhancedInputComponent = CastChecked<UEnhancedInputComponent>(PlayerInputComponent))
	{
		// Bind Movement Actions
		EnhancedInputComponent->BindAction(MoveAction, ETriggerEvent::Triggered, this, &AAdventureCharacter::Move);

		// --- New Code Start ---

		// Bind Jump Actions
		EnhancedInputComponent->BindAction(JumpAction, ETriggerEvent::Started, this, &ACharacter::Jump);
		EnhancedInputComponent->BindAction(JumpAction, ETriggerEvent::Completed, this, &ACharacter::StopJumping);
```

Your `SetupPlayerInputComponent()` function should now look like this:

 C++

```
// Called to bind functionality to input
void AAdventureCharacter::SetupPlayerInputComponent(UInputComponent* PlayerInputComponent)
{
	// Check the UInputComponent passed to this function and cast it to an UEnhancedInputComponent
	if (UEnhancedInputComponent* EnhancedInputComponent = CastChecked<UEnhancedInputComponent>(PlayerInputComponent))
	{
		// Bind Movement Actions
		EnhancedInputComponent->BindAction(MoveAction, ETriggerEvent::Triggered, this, &AAdventureCharacter::Move);

		// Bind Jump Actions
```

### Bind the Input Mapping to the Character

You’ve bound your inputs to your functions, but you still need to bind your input mapping context to your character. You’ll do this in your character’s `BeginPlay()` function so input is set up when the game starts.

`BeginPlay()` is a virtual function in the parent `AActor` class, and it's called when the game starts or when an Actor is spawned and fully initialized in the world. Use it for logic that should run once for that Actor at the start of gameplay.

To add the inputs to the player character when the game starts, follow these steps:

- In `BeginPlay()`, check if the global engine pointer is null before proceeding. C++ ```
// Called when the game starts or when spawned
void AAdventureCharacter::BeginPlay()
{
	Super::BeginPlay();

	// --- New Code Start ---
	check(GEngine != nullptr);
	// --- New Code End ---

}
``` // Called when the game starts or when spawned void AAdventureCharacter::BeginPlay() { Super::BeginPlay(); // --- New Code Start --- check(GEngine != nullptr); // --- New Code End --- }
- In an `if` statement, create a new `APlayerController` pointer named `PlayerController`. Set this to the result of casting `Controller` to `APlayerController`. C++ ```
// Called when the game starts or when spawned
void AAdventureCharacter::BeginPlay()
{
	Super::BeginPlay();

	check(GEngine != nullptr);

	// --- New Code Start ---

	// Get the player controller for this character
``` The `if` statement ensures execution only proceeds if the pointer isn’t null.
- Now you need to get the Enhanced Input Local Player Subsystem and add the `FirstPersonContext` input mapping context (declared in your `.h` file) to the subsystem. In another `if` statement, create a new `UEnhancedInputLocalPlayerSubsystem` pointer named `Subsystem` by calling `ULocalPlayer::GetSubsystem()`, passing the current player. You can get the current player by calling `PlayerController->GetLocalPlayer()`. C++ ```
	if (APlayerController* PlayerController = Cast<APlayerController>(Controller))
	{
		// --- New Code Start ---

		if (UEnhancedInputLocalPlayerSubsystem* Subsystem = ULocalPlayer::GetSubsystem<UEnhancedInputLocalPlayerSubsystem>(PlayerController->GetLocalPlayer()))
		{

		}

		// --- New Code End ---
```
- Add the mapping context to the subsystem by calling `AddMappingContext()`, passing the mapping context and a priority of `0` to set this mapping context as the highest priority. C++ ```
		// Get the enhanced input local player subsystem and add a new input mapping context to it
		if (UEnhancedInputLocalPlayerSubsystem* Subsystem = ULocalPlayer::GetSubsystem<UEnhancedInputLocalPlayerSubsystem>(PlayerController->GetLocalPlayer()))
		{
			// --- New Code Start ---
			Subsystem->AddMappingContext(FirstPersonContext, 0);
			// --- New Code End ---
		}
``` // Get the enhanced input local player subsystem and add a new input mapping context to it if (UEnhancedInputLocalPlayerSubsystem* Subsystem = ULocalPlayer::GetSubsystem(PlayerController->GetLocalPlayer())) { // --- New Code Start --- Subsystem->AddMappingContext(FirstPersonContext, 0); // --- New Code End --- }
- After both if statements, add a new debug message to verify that your game is using your custom Character class.

Your `BeginPlay()` function should look like the following:

 C++

```
// Called when the game starts or when spawned
void AAdventureCharacter::BeginPlay()
{
	Super::BeginPlay();

	check(GEngine != nullptr);

	// Get the player controller for this character
	if (APlayerController* PlayerController = Cast<APlayerController>(Controller))
	{
```

Save your `.h` header and `.cpp` implementation files in Visual Studio, then click **Build **to compile your project.

## Set Variables in the Character Blueprint

To finish setting up these movement controls, use your character’s Blueprint to assign assets to the variables you declared in code.

To populate your Character’s new properties with assets, follow these steps:

- In Unreal Editor, if it’s not open already, open your Character Blueprint.
- In the **Details **panel, search for `Input` to filter for that category. If you don't see the new properties, click the Compile button in the toolbar at the bottom of the main editor window, and then return to the Character Blueprint tab.
- In the **Input **category of properties, set the following properties:Set **First Person Context** to `IMC_Adventure`.
- Set **Move Action** to `IA_Move`.
- Set **Jump Action** to `IA_Jump`.

- Save your Blueprint and click **Compile **to compile it.

## Test Character Movement

Press **Play **in the **Level Editor Toolbar** to start **Play In Editor** mode. When the game begins, you should see “Hello World!” and “We are using AdventureCharacter” printed on the screen. You should be able to move around using the WASD or arrow keys and jump using the Spacebar!

## Next Up

You have a moving character, but it’s still missing a proper mesh and camera. In the next section, you’ll learn how to create a camera component, bind it to your character, and add skeletal meshes to get a real first-person viewpoint!

- [image: Add a First-Person Camera, Mesh, and Animation] Add a First-Person Camera, Mesh, and AnimationLearn how to use C++ to attach mesh and camera components on a first-person Character. (-> coder-04-adding-a-firstperson-camera-mesh-and-animation)

## Complete Code

 C++

 AdventureCharacter.h

```
#pragma once

#include "CoreMinimal.h"
#include "GameFramework/Character.h"
#include "EnhancedInputComponent.h"
#include "EnhancedInputSubsystems.h"
#include "InputActionValue.h"
#include "AdventureCharacter.generated.h"

class UInputMappingContext;
```

 C++

 AdventureCharacter.cpp

```
#include "AdventureCharacter.h"

// Sets default values
AAdventureCharacter::AAdventureCharacter()
{
 	// Set this character to call Tick() every frame.  You can turn this off to improve performance if you don't need it.
	PrimaryActorTick.bCanEverTick = true;

}
```

 C++

 AdventureGame.Build.cs

```
using UnrealBuildTool;

public class AdventureGame : ModuleRules
{
	public AdventureGame(ReadOnlyTargetRules Target) : base(Target)
	{
		PCHUsage = PCHUsageMode.UseExplicitOrSharedPCHs;

        PublicDependencyModuleNames.AddRange(new string[] { "Core", "CoreUObject", "Engine", "InputCore", "EnhancedInput" });
```

On this page

- Before You Start (-> coder-03-configure-character-movement-with-cplusplus-in-unreal-engine)
- Learn to Link Input and Movement (-> coder-03-configure-character-movement-with-cplusplus-in-unreal-engine)
- Visualize Input in Blueprints (-> coder-03-configure-character-movement-with-cplusplus-in-unreal-engine)
- Understand Jump Input Logic (-> coder-03-configure-character-movement-with-cplusplus-in-unreal-engine)
- Understand Movement Input Logic (-> coder-03-configure-character-movement-with-cplusplus-in-unreal-engine)
- Assign Input to a Player With a PlayerController (-> coder-03-configure-character-movement-with-cplusplus-in-unreal-engine)
- Set Up Your Character Class (-> coder-03-configure-character-movement-with-cplusplus-in-unreal-engine)
- Add the Enhanced Input System (-> coder-03-configure-character-movement-with-cplusplus-in-unreal-engine)
- Declare an InputMappingContext Pointer (-> coder-03-configure-character-movement-with-cplusplus-in-unreal-engine)
- Declare Jump and Move InputAction Pointers (-> coder-03-configure-character-movement-with-cplusplus-in-unreal-engine)
- Declare the Move() Function (-> coder-03-configure-character-movement-with-cplusplus-in-unreal-engine)
- Implement Movement Functions (-> coder-03-configure-character-movement-with-cplusplus-in-unreal-engine)
- Set up the Move() Function (-> coder-03-configure-character-movement-with-cplusplus-in-unreal-engine)
- Add 2D Movement Input with Move() (-> coder-03-configure-character-movement-with-cplusplus-in-unreal-engine)
- Bind Movement to Input with SetupPlayerInputComponent (-> coder-03-configure-character-movement-with-cplusplus-in-unreal-engine)
- Check for an Enhanced Input Component (-> coder-03-configure-character-movement-with-cplusplus-in-unreal-engine)
- Bind Movement Actions (-> coder-03-configure-character-movement-with-cplusplus-in-unreal-engine)
- Bind Jump Actions (-> coder-03-configure-character-movement-with-cplusplus-in-unreal-engine)
- Bind the Input Mapping to the Character (-> coder-03-configure-character-movement-with-cplusplus-in-unreal-engine)
- Set Variables in the Character Blueprint (-> coder-03-configure-character-movement-with-cplusplus-in-unreal-engine)
- Test Character Movement (-> coder-03-configure-character-movement-with-cplusplus-in-unreal-engine)
- Next Up (-> coder-03-configure-character-movement-with-cplusplus-in-unreal-engine)
- Complete Code (-> coder-03-configure-character-movement-with-cplusplus-in-unreal-engine)

Related documents

Set Input Actions (-> BlueprintAPI)Code a First-Person Adventure Game

 [image: Code a First-Person Adventure Game] (-> code-a-firstperson-adventure-game-in-unreal-engine)Create a Player Character With Input Actions

 [image: Create a Player Character With Input Actions] (-> coder-02-create-a-player-character-with-input-actions-in-cplusplus)Add a First-Person Camera, Mesh, and Animation

 [image: Add a First-Person Camera, Mesh, and Animation] (-> coder-04-adding-a-firstperson-camera-mesh-and-animation)

# Add a First-Person Camera, Mesh, and Animation

https://dev.epicgames.com/documentation/en-us/unreal-engine/coder-04-adding-a-firstperson-camera-mesh-and-animation?application_version=5.9

> Learn how to use C++ to attach mesh and camera components on a first-person Character.

[image: Add a First-Person Camera, Mesh, and Animation]

## Before You Start

Ensure you've completed the following objectives in the previous section, Configure Character Movement (-> coder-03-configure-character-movement-with-cplusplus-in-unreal-engine):

- Understand how Input Actions and Input Mapping Contexts work.
- Set up a character with forward, backward, left, right, and jump movements.

## First-Person Camera Controls

To change the camera orientation, we change the **Rotation **value of the camera’s **Transform **property. To rotate in a 3D space, objects use **Pitch**, **Roll**, and **Yaw **to control what direction they turn and along what axis.

- **Pitch**: Controls rotation along the horizontal (X) axis. Changing it rotates an object up or down, similar to nodding your head.
- **Yaw**: Controls rotation along the vertical (Y) axis. Changing it rotates an object left or right, similar to rotating right or left.
- **Roll**: Controls rotation along the longitudinal (Z) axis. Changing it rolls an object side to side, similar to leaning your head right or left.

Cameras in first-person games usually use Yaw and Pitch to control movement. Roll may become relevant if you’re programming a game where you need to rotate an airplane or spaceship or if you need to simulate peeking around corners.

### Explore Camera Movement in Blueprints

Open `BP_FirstPersonCharacter` to view the default character’s camera control logic in the **Blueprint Editor**. In the **EventGraph**, look at two nodes in the top-left corner of the **Camera Input** node group.

Just like with `IA_Move`, the `IA_Look` input action has an **Axis2D Value Type**, so it splits movement into both **X** and **Y** values. This time, X and Y become the custom **Aim** function's **Yaw **and **Pitch **inputs.

Double-click the **Aim **function node to see the logic inside. The **Add Controller Yaw Input** and **Pitch Input** function nodes add the values to the character.

### Explore First-Person Character Components

Go to `BP_FirstPersonCharacter`‘s **Viewport **tab to view a 3D preview of the Actor and its components.

In the **Components **tab, you’ll see a structured hierarchy of attached components that define the character in the world.

Character Blueprints are automatically instantiated with:

- a **Capsule Component** that makes the character collide with objects in the world.
- a **Skeletal Mesh** component that enables animations and visualizes the character. In the **Details **panel, you’ll see this character uses `SKM_Manny_Simple` as its **Skeletal Mesh Asset**.
- A **Character Movement Component** that allows the character to move around.

This character also has a second **Skeletal Mesh** named **FirstPersonMesh **(also using `SKM_Manny_Simple`) that is a child of the main mesh component. In first-person games, characters usually have separate meshes for both third-person and first-person contexts:

- The third-person mesh is only visible to other players or when the player is in a third-person view.
- The first-person mesh is visible to the player when they are in first-person view.

The **FirstPersonMesh **has a child **Camera Component** named **FirstPersonCamera**. This camera determines the player’s first-person view and rotates with the character as they look around. In this part of the tutorial, you’ll use C++ to instantiate a camera on your character at runtime and position it to match this camera’s position.

For more information about Character components, see the Characters Gameplay Framework documentation (-> characters-in-unreal-engine).

## Implement Look Input in Code

To implement this camera functionality in code, just like the movement you implemented in the previous step, you’ll bind the `IA_Look` input action to a function and then bind that function to your character.

### Declare the Look() Function and Variables

To declare the function and variables you need to implement and control the camera-look input action, follow these steps:

- In Visual Studio, open your character’s `.h` file. The code samples in this tutorial use a Character class named `AdventureCharacter`.
- When your character is built at runtime, you’ll tell UE to add a camera component to it and position the camera dynamically. To enable this functionality, add a new `#include` for `”Camera/CameraComponent.h”`: C++ ```
#include "CoreMinimal.h"
// --- New Code Start ---
#include "Camera/CameraComponent.h"
// --- New Code End ---
#include "GameFramework/Character.h"
#include "EnhancedInputComponent.h"
#include "EnhancedInputSubsystems.h"
#include "InputActionValue.h"
#include "AdventureCharacter.generated.h"
``` #include "CoreMinimal.h" // --- New Code Start --- #include "Camera/CameraComponent.h" // --- New Code End --- #include "GameFramework/Character.h" #include "EnhancedInputComponent.h" #include "EnhancedInputSubsystems.h" #include "InputActionValue.h" #include "AdventureCharacter.generated.h"
- In the header’s `protected` section, declare a `TObjectPtr` to a `UInputAction` named `LookAction`. Give this pointer the same `UPROPERTY()` macro as `MoveAction` and `JumpAction`. C++ ```
protected:
	// Called when the game starts or when spawned
	virtual void BeginPlay() override;

	UPROPERTY(EditAnywhere, BlueprintReadOnly, Category = Input)
	TObjectPtr<UInputMappingContext> FirstPersonContext;

	// Move Input Actions
	UPROPERTY(EditAnywhere, BlueprintReadOnly, Category = Input)
	TObjectPtr<UInputAction> MoveAction;
``` This will point to the `IA_Look` Input Action.
- In the `public` section, declare a new function named `Look()` that takes a const `FInputActionValue` reference named `Value`. Ensure you add a `UFUNCTION()` macro to the function. C++ ```
public:
	// Called every frame
	virtual void Tick(float DeltaTime) override;

	// Called to bind functionality to input
	virtual void SetupPlayerInputComponent(class UInputComponent* PlayerInputComponent) override;

	// Handles 2D Movement Input
	UFUNCTION()
	void Move(const FInputActionValue& Value);
```
- After the `Look()` function declaration, declare a `TObjectPtr` to a `UCameraComponent` named `FirstPersonCameraComponent`. To expose this property to Unreal Editor, add a `UPROPERTY()` macro with `VisibleAnywhere` and `Category = Camera` arguments so it appears in the **Camera **section of the **Details **panel. C++ ```
// First Person camera
UPROPERTY(VisibleAnywhere, Category = Camera)
TObjectPtr<UCameraComponent> FirstPersonCameraComponent;
``` // First Person camera UPROPERTY(VisibleAnywhere, Category = Camera) TObjectPtr FirstPersonCameraComponent;
- Also in the `public` section, declare an `FVector` named `FirstPersonCameraOffset`. Initialize it to an `FVector` with the default values in the code block below. Include `EditAnywhere` and `Category = Camera` in its `UPROPERTY` macro so you can adjust it in Unreal Editor if needed. C++ ```
// Offset for the first-person camera
UPROPERTY(EditAnywhere, Category = Camera)
FVector FirstPersonCameraOffset = FVector(2.8f, 5.9f, 0.0f);
``` // Offset for the first-person camera UPROPERTY(EditAnywhere, Category = Camera) FVector FirstPersonCameraOffset = FVector(2.8f, 5.9f, 0.0f);This offset positions the camera when the character spawns.
- You need two more properties to adjust how close-up objects (like the character's body) appear in the camera's view. Declare the following `float` variables: `FirstPersonFieldOfView`: The horizontal field of view (in degrees) that this camera should use when rendering `FirstPerson`-tagged primitive components. Set to `70.0f`.
- `FirstPersonScale`: The scale this camera should apply to `FirstPerson`-tagged primitive components. Set to `0.6f`.

Give these properties a `UPROPERTY` macro with `EditAnywhere` and `Category = Camera` specifiers.

 C++

```
// First-person primitives field of view
UPROPERTY(EditAnywhere, Category = Camera)
float FirstPersonFieldOfView = 70.0f;

// First-person primitives view scale
UPROPERTY(EditAnywhere, Category = Camera)
float FirstPersonScale = 0.6f;
```

// First-person primitives field of view
UPROPERTY(EditAnywhere, Category = Camera)
float FirstPersonFieldOfView = 70.0f;

// First-person primitives view scale
UPROPERTY(EditAnywhere, Category = Camera)
float FirstPersonScale = 0.6f;

Primitive components are components that have a physical presence in the world, such as player arms or held items.

These camera settings render those tagged components differently so they don't appear too large or stretched. Narrowing the FOV can reduce this distortion and reducing the scale prevents those objects from protruding into walls.

For more information about controlling how first-person and third-person objects appear to the player, see theFirst Person Rendering (-> first-person-rendering) documentation.

- Declare a new `TObjectPtr` to a `USkeletalMeshComponent` named `FirstPersonMeshComponent`. Give it a `UPROPERTY()` macro with `VisibleAnywhere` and `Category = Mesh` arguments. C++ ```
public:
	// Called every frame
	virtual void Tick(float DeltaTime) override;

	// Called to bind functionality to input
	virtual void SetupPlayerInputComponent(class UInputComponent* PlayerInputComponent) override;

	// Handles 2D Movement Input
	UFUNCTION()
	void Move(const FInputActionValue& Value);
```
- Save the file.

You’ve now set up declarations for the following:

- First-person mesh (which correlates to the child **FirstPersonMesh** you saw in the Blueprint)
- Camera component
- `Look()` function
- `IA_Look` Input Action

Your character’s `.h` file should look like this:

 C++

```

#pragma once

#include "CoreMinimal.h"
#include "Camera/CameraComponent.h"
#include "GameFramework/Character.h"
#include "EnhancedInputComponent.h"
#include "EnhancedInputSubsystems.h"
#include "InputActionValue.h"
#include "AdventureCharacter.generated.h"
```

### Add Look Input with Look()

Now you can implement the Look() function so it applies the Look input action to the player camera position. Just as with `IA_Move`, `IA_Look` returns an FVector2D value when triggered.

To implement the camera input logic, follow these steps:

- Open your Character Blueprint’s `.cpp` file.
- Below the `Move()` function, add a new function definition for `Look()`. C++ ```
void AAdventureCharacter::Move(const FInputActionValue& Value)
{
	// 2D Vector of movement values returned from the input action
	const FVector2D MovementValue = Value.Get<FVector2D>();

	// Check if the controller possessing this Actor is valid
	if (Controller)
	{
		// Add left and right movement
		const FVector Right = GetActorRightVector();
```
- Inside the function, get the value of the `FInputActionValue` inside a new `FVector2D` named `LookAxisValue`. C++ ```
void AAdventureCharacter::Look(const FInputActionValue& Value)
{
	// --- New Code Start ---

	const FVector2D LookAxisValue = Value.Get<FVector2D>();

	// --- New Code End ---
}
``` void AAdventureCharacter::Look(const FInputActionValue& Value) { // --- New Code Start --- const FVector2D LookAxisValue = Value.Get(); // --- New Code End --- }
- In an `if` statement, check if the Controller is valid. If it is, call `AddControllerYawInput()` and `AddControllerPitchInput()`, passing the `LookAxisValue.X` and `LookAxisValue.Y` values, respectively. C++ ```
void AAdventureCharacter::Look(const FInputActionValue& Value)
{
	const FVector2D LookAxisValue = Value.Get<FVector2D>();

	// --- New Code Start ---
	if (Controller)
	{
		AddControllerYawInput(LookAxisValue.X);
		AddControllerPitchInput(LookAxisValue.Y);
	}
```

Your complete `Look()` function should look like the following:

 C++

```
void AAdventureCharacter::Look(const FInputActionValue& Value)
{
	const FVector2D LookAxisValue = Value.Get<FVector2D>();

	if (Controller)
	{
		AddControllerYawInput(LookAxisValue.X);
		AddControllerPitchInput(LookAxisValue.Y);
	}
}
```

void AAdventureCharacter::Look(const FInputActionValue& Value)
{
 const FVector2D LookAxisValue = Value.Get<FVector2D>();

 if (Controller)
 {
 AddControllerYawInput(LookAxisValue.X);
 AddControllerPitchInput(LookAxisValue.Y);
 }
}

### Bind Look Functionality to Input with SetupPlayerInputComponent

Inside `SetupPlayerInputComponent()`, similar to the movement actions, you’ll bind the `Look()` function to the `LookAction` Input Action.

 C++

```
// Called to bind functionality to input
void AAdventureCharacter::SetupPlayerInputComponent(UInputComponent* PlayerInputComponent)
{

	if (UEnhancedInputComponent* EnhancedInputComponent = CastChecked<UEnhancedInputComponent>(PlayerInputComponent))
	{
		// Bind Movement Actions
		EnhancedInputComponent->BindAction(MoveAction, ETriggerEvent::Triggered, this, &AAdventureCharacter::Move);

		// Bind Jump Actions
```

Save your code and compile it by clicking **Build **in Visual Studio.

### Assign a Look Input Action in the Blueprint

Last, assign an Input Action to the Character Blueprint’s new **Look Action** property.

To assign look controls to your character, follow these steps:

- In Unreal Editor, open your Character Blueprint. Click **Compile **in the main editor if the blueprint didn't update with its new properties.
- In the **Details **panel, in the **Input **section, set** Look Action** to `IA_Look`.
- Compile and save your Blueprint.

### Test Look Movements

If you press **Play **to test out your game, you’ll be able to look around and move your character in any direction you want!

Note that while your in-game view appears to come from a first-person camera, you don’t actually have a camera component on your character yet. Instead, Unreal Engine simulates a view from the center of your character’s capsule component. In the next step, you’ll learn to change this by adding a camera to your Character class.

## Create Components at Runtime

Next, you’ll finish creating your character’s first-person mesh and camera by instantiating the `FirstPersonCameraComponent` and `FirstPersonMeshComponent` pointers you declared in the header file.

To get started, return to your character’s `.cpp` file.

At the top of the file, you’ll see the **class constructor** (`AAdventureCharacter()` in this tutorial). This class runs when the object is allocated in memory and it sets the default values for your character. This is where you’ll add additional components.

When adding code to the class constructor or `BeginPlay()`, consider when each is executed in the Actor's lifecycle and if other objects are initialized yet.

When the class constructor runs, other components or actors may not exist yet. `BeginPlay()` runs when when gameplay starts or when the Actor is spawned, so the Actor and all its components are fully initialized and registered, and it's safe to reference other Actors here.

Also, because of the way Unreal Engine handles timing of attachment, physics, networking, or parent-child relationships behind the scenes, some operations behave more reliably when done in `BeginPlay()`, even if they technically could be done earlier.

### Create a Camera Component

To add components to the Character class, you’ll use the `CreateDefaultSubobject()` template function. It returns a pointer to the new component and takes the following arguments:

`CreateDefaultSubobject<type>(TEXT(“Name”));`

Where type is the type of subobject you’re creating and Name is the internal name Unreal Engine uses to identify the subobject and display it in the editor.

To add a camera component to the character, follow these steps:

- In the class constructor, set the `FirstPersonCameraComponent` pointer to the result of calling `CreateDefaultSubobject()` of type `UCameraComponent`. In the `TEXT` argument, name the object ”FirstPersonCamera”. C++ ```
// Sets default values
AAdventureCharacter::AAdventureCharacter()
{
 	// Set this character to call Tick() every frame.  You can turn this off to improve performance if you don't need it.
	PrimaryActorTick.bCanEverTick = true;

	// --- New Code Start ---
	// Create a first-person camera component
	FirstPersonCameraComponent = CreateDefaultSubobject<UCameraComponent>(TEXT("FirstPersonCamera"));
	// --- New Code End ---
``` This creates a default camera component as a child component of the Character class.
- To ensure the camera was properly instantiated, check that `FirstPersonCameraComponent` isn’t null. C++ ```
// Sets default values
AAdventureCharacter::AAdventureCharacter()
{
 	// Set this character to call Tick() every frame.  You can turn this off to improve performance if you don't need it.
	PrimaryActorTick.bCanEverTick = true;

	// Create a first-person camera component
	FirstPersonCameraComponent = CreateDefaultSubobject<UCameraComponent>(TEXT("FirstPersonCamera"));
	// --- New Code Start ---
	check(FirstPersonCameraComponent != nullptr);
```

### Create a Mesh Component

Set `FirstPersonMeshComponent` to another `CreateDefaultSubobject` function call. This time, use `USkeletalMeshComponent` as the type and “FirstPersonMesh” as the name. Remember to add a `check` afterwards.

 C++

```
// Sets default values
AAdventureCharacter::AAdventureCharacter()
{
 	// Set this character to call Tick() every frame.  You can turn this off to improve performance if you don't need it.
	PrimaryActorTick.bCanEverTick = true;

	FirstPersonCameraComponent = CreateDefaultSubobject<UCameraComponent>(TEXT("FirstPersonCamera"));
	check(FirstPersonCameraComponent != nullptr);

	// --- New Code Start ---
```

### Attach and Configure the Mesh

Now that your mesh is created, attach it to the character and enable first-person rendering on it.

In these steps, you'll use the `SetupAttachment()` function, which attaches one scene component to another, establishing a parent-child relationship in the component hierarchy.

To set up the player mesh, follow these steps:

- In the class constructor, call the `SetupAttachment()` function on the object that `FirstPersonMeshComponent` points to and pass it the parent component. In this case, the parent should be the character’s default skeletal mesh, which you can get using `GetMesh()`. C++ ```
// Sets default values
AAdventureCharacter::AAdventureCharacter()
{
 	// Set this character to call Tick() every frame.  You can turn this off to improve performance if you don't need it.
	PrimaryActorTick.bCanEverTick = true;

	FirstPersonCameraComponent = CreateDefaultSubobject<UCameraComponent>(TEXT("FirstPersonCamera"));
	check(FirstPersonCameraComponent != nullptr);

	// Create a first person mesh component for the owning player.
```
- In the character's header file, you declared a camera field of view and scale to use for components close to the camera. To make these camera properties apply to the first-person mesh, set the mesh's `FirstPersonPrimitiveType` property to `FirstPerson`. C++ ```
// Sets default values
AAdventureCharacter::AAdventureCharacter()
{
 	// Set this character to call Tick() every frame.  You can turn this off to improve performance if you don't need it.
	PrimaryActorTick.bCanEverTick = true;

	FirstPersonCameraComponent = CreateDefaultSubobject<UCameraComponent>(TEXT("FirstPersonCamera"));
	check(FirstPersonCameraComponent != nullptr);

	// Create a first person mesh component for the owning player.
``` `FirstPerson`-type primitives are rendered in a separate render pass, often with different camera parameters, so they don't cast a shadow. Player shadows perform best when cast from the third-person mesh, and you'll set this up next.
- Set the first-person mesh collision profile name to `NoCollision` to prevent the first-person mesh from colliding with the environment. C++ ```
// Set the first person mesh to not collide with other objects
    FirstPersonMeshComponent->SetCollisionProfileName(FName("NoCollision"));
``` // Set the first person mesh to not collide with other objects FirstPersonMeshComponent->SetCollisionProfileName(FName("NoCollision"));The first-person mesh should only provide camera-space visuals for the owning player. The Character Blueprint's Capsule Component provides a simpler collision shape.
- Your first-person camera settings shouldn't apply to the third-person mesh, so set the third-person mesh component's `FirstPersonPrimitiveType` to `WorldSpaceRepresentation`. C++ ```
// Treat the 3rd-person mesh as a regular world object
GetMesh()->FirstPersonPrimitiveType = EFirstPersonPrimitiveType::WorldSpaceRepresentation;
``` // Treat the 3rd-person mesh as a regular world object GetMesh()->FirstPersonPrimitiveType = EFirstPersonPrimitiveType::WorldSpaceRepresentation; This primitive type tells the first-person rendering pass to treat the third-person mesh as normal world geometry. The mesh uses the standard world FOV and world-space rendering rules even when hidden from the owning player.

### Set Mesh and Shadow Visibility

So far, your character has a first and third-person skeletal mesh that overlap during gameplay. However, the first-person mesh should be invisible to other players and the third-person mesh should be invisible to you, the player.

To configure first-person and third-person mesh visibility, follow these steps:

- In `BeginPlay()`, after the global engine pointer check, call `SetOnlyOwnerSee()` on `FirstPersonMeshComponent`, passing `true` to make the first-person mesh visible only to the owning player. C++ ```
// Called when the game starts or when spawned
void AAdventureCharacter::BeginPlay()
{
	Super::BeginPlay();

	check(GEngine != nullptr);

	// --- New Code Start ---

	// Only the owning player sees the first-person mesh
```
- For the third-person mesh, use `SetOwnerNoSee()` to hide the mesh from the owning player. C++ ```
// Hide the 3rd-person mesh from the owning player
GetMesh()->SetOwnerNoSee(true);
``` // Hide the 3rd-person mesh from the owning player GetMesh()->SetOwnerNoSee(true);
- You've set up the character's first-person mesh as a first-person primitive, which is rendered in the camera-space first-person rendering pass and therefore doesn't contribute to world shadows. To give the character a shadow, enable the `CastShadow` and `bCastHiddenShadow` properties on the third-person mesh, since that mesh is a regular world object and participates in world shadow rendering. C++ ```
// Make the 3rd-person mesh cast a shadow
GetMesh()->CastShadow = true;
GetMesh()->bCastHiddenShadow = true;
``` // Make the 3rd-person mesh cast a shadow GetMesh()->CastShadow = true; GetMesh()->bCastHiddenShadow = true;

In general, initialization belongs in the constructor, but these actions work more reliably in `BeginPlay()`.

### Attach the Camera Component

The `SKM_Manny_Simple` skeletal mesh used in this tutorial has a collection of preset **sockets** (or bones) used for animation. To attach components to the character mesh, you'll use a socket as an attachment point.

Each socket has a name, so you can reference sockets in code using an `FName` string.

`FName` is a special string-like type used in Unreal Engine to store unique, immutable names in a memory-efficient way.

It’s best to position the camera near the character’s head, so you’ll pass the `Head` socket name to `SetupAttachment()` to attach the camera to that socket. You’ll move the camera closer to the character’s eyes next.

In the character's constructor, use another `SetupAttachment()` call to attach the camera component to the first-person mesh.

 C++

```
// Sets default values
AAdventureCharacter::AAdventureCharacter()
{
 	// Set this character to call Tick() every frame.  You can turn this off to improve performance if you don't need it.
	PrimaryActorTick.bCanEverTick = true;

	FirstPersonCameraComponent = CreateDefaultSubobject<UCameraComponent>(TEXT("FirstPersonCamera"));
	check(FirstPersonCameraComponent != nullptr);

	// Create a first person mesh component for the owning player.
```

For more information about what sockets are and how they’re created, see Skeletal Mesh Sockets (-> skeletal-mesh-sockets-in-unreal-engine).

### Configure the Camera

When you initialized your camera component, you attached it to the character’s Head socket. However, the camera looks more accurate when it’s positioned at the character’s eyes. The camera is also pointing down by default, so you'll need to rotate it behind the character's head.

To finish setting up the player camera, follow these steps:

- To move and rotate the camera into position, after the camera's `SetupAttachment` line in the class constructor, call `SetRelativeLocationAndRotation()`, passing the `FirstPersonCameraOffset` and a new `FRotator` set to `(0.0f, 90.0f, -90.0f)`. C++ ```
	// Attach the camera component to the first-person Skeletal Mesh.
	FirstPersonCameraComponent->SetupAttachment(FirstPersonMeshComponent, FName("head"));

	// --- New Code Start ---
	// Position the camera slightly above the eyes and rotate it to behind the player's head
	FirstPersonCameraComponent->SetRelativeLocationAndRotation(FirstPersonCameraOffset, FRotator(0.0f, 90.0f, -90.0f));
	// --- New Code End ---
``` // Attach the camera component to the first-person Skeletal Mesh. FirstPersonCameraComponent->SetupAttachment(FirstPersonMeshComponent, FName("head")); // --- New Code Start --- // Position the camera slightly above the eyes and rotate it to behind the player's head FirstPersonCameraComponent->SetRelativeLocationAndRotation(FirstPersonCameraOffset, FRotator(0.0f, 90.0f, -90.0f)); // --- New Code End ---
- To make the camera rotate with the character during gameplay, set `FirstPersonCameraComponent`'s `bUsePawnControlRotation` property to `true`. This makes the camera inherit rotation from its parent Pawn so when the character turns, the camera follows. C++ ```
// Enable the pawn to control camera rotation.
FirstPersonCameraComponent->bUsePawnControlRotation = true;
``` // Enable the pawn to control camera rotation. FirstPersonCameraComponent->bUsePawnControlRotation = true;
- Apply your First Person Field of View and First Person Scale rendering values to the camera component's corresponding settings. Set the component's `bEnableFirstPersonFieldOfView` and `bEnableFirstPersonScale` properties to `true`. Then, assign the default FOV and scale values you declared earlier. C++ ```
// Enable first-person rendering and set default FOV and scale values
FirstPersonCameraComponent->bEnableFirstPersonFieldOfView = true;
FirstPersonCameraComponent->bEnableFirstPersonScale = true;
FirstPersonCameraComponent->FirstPersonFieldOfView = FirstPersonFieldOfView;
FirstPersonCameraComponent->FirstPersonScale = FirstPersonScale;
``` // Enable first-person rendering and set default FOV and scale values FirstPersonCameraComponent->bEnableFirstPersonFieldOfView = true; FirstPersonCameraComponent->bEnableFirstPersonScale = true; FirstPersonCameraComponent->FirstPersonFieldOfView = FirstPersonFieldOfView; FirstPersonCameraComponent->FirstPersonScale = FirstPersonScale;
- Save and compile your code.

Your character’s constructor should look like the following:

 C++

```
// Sets default values
AAdventureCharacter::AAdventureCharacter()
{
	// Set this character to call Tick() every frame.  You can turn this off to improve performance if you don't need it
	PrimaryActorTick.bCanEverTick = true;

	// Create a first person camera component
	FirstPersonCameraComponent = CreateDefaultSubobject<UCameraComponent>(TEXT("FirstPersonCamera"));
	check(FirstPersonCameraComponent != nullptr);
```

## Assign Meshes in Unreal Editor

Your camera controls are set up, but you still have one step left — use the editor to add the Skeletal Mesh assets to the variables you declared in code.

To add a Skeletal Mesh to a Character Blueprint, follow these steps:

- In Unreal Editor, if it’s not open already, open your Character Blueprint.You may need to click **Compile** in Unreal Editor to update the Character Blueprint with your new code changes.
- So far, Unreal Engine has likely categorized your Blueprint as a Data-Only Blueprint Class and only displays a list of properties in the Blueprint Editor. To convert the asset to a regular Blueprint Class, click the **Open Full Blueprint Editor** link in the **NOTE **above the list of properties.
- Click the **Viewport **tab so you can see a preview of the character and its components.
- In the **Components **panel, ensure the root **BP_[CharacterName]** is selected.
- In the Blueprint Editor, click **Compile **to make your character's new components appear in the **Components** panel.
- In the **Details **panel, in the **Mesh **section, your character has two **Skeletal Mesh Asset** slots instead of one because you created `FirstPersonMeshComponent` in code. Click the arrow in each property’s dropdown menu and select `SKM_Manny_Simple` for both meshes. When you set the **FirstPersonMeshComponent**, your camera should move into position behind the character’s head.
- As a final adjustment, use the Blueprint Editor to transform the character's mesh so it's inside the Capsule Component and facing the same direction as the Arrow Component:In the **Components** panel, select the root.
- In the **Details **panel, In the **Transform > Mesh** section, change the **Rotation**'s **Z** value to `-90`.
- Change the **Location**'s Z value to `-95`.

- Final mesh alignment is best done in the editor rather than code for faster iteration and easier visual alignment.
- The Arrow Component indicates the actor's forward direction in the editor.

- Save your Blueprint and click **Compile**.

If you play your game and look down, you should see the first-person mesh on your character! The mesh rotates as you look around, and your camera matches that movement. The third-person mesh is hidden at runtime and only other players can see it.

However, your character is still in a static T-pose, so next you'll use an Animation Blueprint to add animations to your character and finish bringing it to life!

## Add Animations to Your Character

In code, you can access animation logic through instances of the **UAnimInstance** class, which is a controller that determines what animations are blended and played on a Skeletal Mesh based on state and other variables. Animation Blueprints also derive from `UAnimInstance`, and you can reference them in C++ with the `UAnimBlueprint` type.

Building an Anim Instance class is outside the scope of this tutorial; instead, you’ll add the First Person template’s prebuilt Animation Blueprint to your character. This Blueprint includes the animations and logic your character needs to play different movement and idle animations.

Animations in Unreal Engine are set on a per-mesh basis, so you’ll need separate animations for both your first and third-person meshes. Because your third-person mesh is hidden when the game begins, you only need to set animations on the first-person mesh.

To add an animation property and Animation Blueprint to your character, follow these steps:

- At the top of your character's `.h` file, forward-declare the `UAnimBlueprint` class. This class represents the Animation Blueprints in your project. C++ ```
#include "CoreMinimal.h"
#include "Camera/CameraComponent.h"
#include "GameFramework/Character.h"
#include "EnhancedInputComponent.h"
#include "EnhancedInputSubsystems.h"
#include "InputActionValue.h"
#include "AdventureCharacter.generated.h"

// --- New Code Start ---
class UAnimBlueprint;
```
- In the `public` section, declare a `TObjectPtr` to a `UAnimBlueprint` named `FirstPersonDefaultAnim`. Give it the `UCLASS()` macro with `EditAnywhere` and `Category = Animation`. C++ ```
public:
	// Sets default values for this character's properties
	AAdventureCharacter();

	// --- New Code Start ---
	// First Person animations
	UPROPERTY(EditAnywhere, Category = Animation)
	TObjectPtr<UAnimBlueprint> FirstPersonDefaultAnim;
	// --- New Code End ---
``` public: // Sets default values for this character's properties AAdventureCharacter(); // --- New Code Start --- // First Person animations UPROPERTY(EditAnywhere, Category = Animation) TObjectPtr FirstPersonDefaultAnim; // --- New Code End ---
- In your character's `.cpp` file, in `BeginPlay()` after the `check` line, call `FirstPersonMeshComponent->SetAnimInstanceClass()`. Even though you haven’t defined an Anim Instance class in code, you can generate a class from the Animation Blueprint using `GeneratedClass`. C++ ```
// Called when the game starts or when spawned
void AAdventureCharacter::BeginPlay()
{
	Super::BeginPlay();

	check(GEngine != nullptr);

	// --- New Code Start ---
	// Set the animations on the first person mesh.
	FirstPersonMeshComponent->SetAnimInstanceClass(FirstPersonDefaultAnim->GeneratedClass);
```
- On the next line, call `SetAnimInstanceClass()` again to assign the AnimInstance to the third-person mesh so if you create a multi-player game, other players will see your character animating. C++ ```
	// Set the animations on the first person mesh.
	FirstPersonMeshComponent->SetAnimInstanceClass(FirstPersonDefaultAnim->GeneratedClass);

	// --- New Code Start ---
	// Set the animations on the third-person mesh.
	GetMesh()->SetAnimInstanceClass(FirstPersonDefaultAnim->GeneratedClass);
	// --- New Code End ---
``` // Set the animations on the first person mesh. FirstPersonMeshComponent->SetAnimInstanceClass(FirstPersonDefaultAnim->GeneratedClass); // --- New Code Start --- // Set the animations on the third-person mesh. GetMesh()->SetAnimInstanceClass(FirstPersonDefaultAnim->GeneratedClass); // --- New Code End ---
- Save your code and compile it from Visual Studio.
- In Unreal Editor, return to your Character Blueprint, compile it, and select the root **BP_[CharacterName] **component.
- In the **Details **panel, under **Animation**, set the **First Person Default Anim** to `ABP_Unarmed`.
- Save your Blueprint and compile it.

## Test Your Character

Press **Play **to test out your game. If you look down, you'll see the first-person mesh animate as you move! Try moving around and jumping to see the different animations controlled by this Blueprint.

## Next Up

In the next section, you’ll learn how to create an item for your character to pick up and use!

- [image: Manage Items and Data] Manage Items and DataLearn to use Item Data Structs, Data Assets, and Data Tables to define items and store and organize item data for scalability. (-> coder-05-manage-item-and-data-in-an-unreal-engine-game)

## Complete Code

Here is the complete code built in this section:

 C++

 AdventureCharacter.h

```
// Copyright Epic Games, Inc. All Rights Reserved.

#pragma once

#include "CoreMinimal.h"
#include "Camera/CameraComponent.h"
#include "GameFramework/Character.h"
#include "EnhancedInputComponent.h"
#include "EnhancedInputSubsystems.h"
#include "InputActionValue.h"
```

 C++

 AdventureCharacter.cpp

```
// Copyright Epic Games, Inc. All Rights Reserved.

#include "AdventureCharacter.h"

// Sets default values
AAdventureCharacter::AAdventureCharacter()
{
	// Set this character to call Tick() every frame.  You can turn this off to improve performance if you don't need it
	PrimaryActorTick.bCanEverTick = true;
```

On this page

- Before You Start (-> coder-04-adding-a-firstperson-camera-mesh-and-animation)
- First-Person Camera Controls (-> coder-04-adding-a-firstperson-camera-mesh-and-animation)
- Explore Camera Movement in Blueprints (-> coder-04-adding-a-firstperson-camera-mesh-and-animation)
- Explore First-Person Character Components (-> coder-04-adding-a-firstperson-camera-mesh-and-animation)
- Implement Look Input in Code (-> coder-04-adding-a-firstperson-camera-mesh-and-animation)
- Declare the Look() Function and Variables (-> coder-04-adding-a-firstperson-camera-mesh-and-animation)
- Add Look Input with Look() (-> coder-04-adding-a-firstperson-camera-mesh-and-animation)
- Bind Look Functionality to Input with SetupPlayerInputComponent (-> coder-04-adding-a-firstperson-camera-mesh-and-animation)
- Assign a Look Input Action in the Blueprint (-> coder-04-adding-a-firstperson-camera-mesh-and-animation)
- Test Look Movements (-> coder-04-adding-a-firstperson-camera-mesh-and-animation)
- Create Components at Runtime (-> coder-04-adding-a-firstperson-camera-mesh-and-animation)
- Create a Camera Component (-> coder-04-adding-a-firstperson-camera-mesh-and-animation)
- Create a Mesh Component (-> coder-04-adding-a-firstperson-camera-mesh-and-animation)
- Attach and Configure the Mesh (-> coder-04-adding-a-firstperson-camera-mesh-and-animation)
- Set Mesh and Shadow Visibility (-> coder-04-adding-a-firstperson-camera-mesh-and-animation)
- Attach the Camera Component (-> coder-04-adding-a-firstperson-camera-mesh-and-animation)
- Configure the Camera (-> coder-04-adding-a-firstperson-camera-mesh-and-animation)
- Assign Meshes in Unreal Editor (-> coder-04-adding-a-firstperson-camera-mesh-and-animation)
- Add Animations to Your Character (-> coder-04-adding-a-firstperson-camera-mesh-and-animation)
- Test Your Character (-> coder-04-adding-a-firstperson-camera-mesh-and-animation)
- Next Up (-> coder-04-adding-a-firstperson-camera-mesh-and-animation)
- Complete Code (-> coder-04-adding-a-firstperson-camera-mesh-and-animation)

Related documents

Code a First-Person Adventure Game

 [image: Code a First-Person Adventure Game] (-> code-a-firstperson-adventure-game-in-unreal-engine)Create a Player Character With Input Actions

 [image: Create a Player Character With Input Actions] (-> coder-02-create-a-player-character-with-input-actions-in-cplusplus)Configure Character Movement

 [image: Configure Character Movement] (-> coder-03-configure-character-movement-with-cplusplus-in-unreal-engine)Manage Items and Data

 [image: Manage Items and Data] (-> coder-05-manage-item-and-data-in-an-unreal-engine-game)

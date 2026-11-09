# Setting Up Inputs

https://dev.epicgames.com/documentation/en-us/unreal-engine/setting-up-user-inputs-in-unreal-engine?application_version=5.9

> How to set up user input

[image: Setting Up Inputs]

Programming Language

×C++

Select an option from the dropdown to see content relevant to it.

In this tutorial, you will create a Character (-> characters-in-unreal-engine) and set it up to receive input, then assign the character to a GameMode (-> game-mode-and-game-state-in-unreal-engine) so that it is the default pawn during gameplay. After you create your Character, you will define how it reacts to Player Input.

Unreal provides for more complex Input mappings for a variety of project types. Refer to Enhanced Input (-> enhanced-input-in-unreal-engine) for additional documentation.

## Project Setup

- Create a new **Games** > **Blank > C++ **project named "**SettingUpInput**".
- In the **Editor**, navigate to **Edit** > **Project Settings** > **Input > Bindings**.

[image: project-settings]

### Action and Axis Mapping Setup

Defining Input is done through user-defined **Bindings** of **Action **and **Axis Mappings**. Both mappings provide a mechanism to conveniently map keys and axes to input behaviors by inserting a layer of indirection between the input behavior and the keys that invoke it.

Action Mappings are for key presses and releases, while Axis Mappings allow for inputs that have a continuous range. Once you have defined your Mappings, you can then bind them to behaviors in Blueprints or C++.

- Click **Add**(**+**) next to** Action Mappings** to create a new Action named **Jump.**[image: action-mapping-jump]
- From either the drop down arrow(1) or the **Select Key Value **button(2), search for and select the **Space Bar** key value.[image: key-map-select]
- Navigate to the** Axis mappings **and click **Add**(**+**) to create the following** Axis Mapping **names, **Key** values,** **and **Scale** values: | Axis Mapping Name | Key Value | Scale Value |
| --- | --- | --- |
| MoveForward | W | 1.0 |
|  | S | -1.0 |
| MoveRight | A | -1.0 |
|  | D | 1.0 |
| Turn | Mouse X | 1.0 |
| LookUp | Mouse Y | -1.0 | [image: input-settings]

## Creating the Example Character

A Character (-> characters-in-unreal-engine) is a special type of **Pawn** that has the ability to walk around. Characters extend from the Pawn class, and inherit similar properties such as physical representation of a player or AI entity within the world.

Refer to the Pawn (-> pawn-in-unreal-engine) and Input (-> input-in-unreal-engine) pages for additional documentation.

- From the **Content Drawer**, navigate to the **C++ classes** folder, right-click and select **New C++ Class**, then choose **Character** as your parent class.[image: choose-parent-class]
- Name your character class "**ExampleCharacter**", then click **Create Class**.[image: name-your-new-character]

### Creating the SpringArm and Camera Components

When the **Camera** and **SpringArm Components** are used together, they provide functionality for a third-person perspective that can dynamically adjust to your game world. The camera component contains a camera that represents the player's point of view or how the player sees the world. The SpringArm component is used as a "camera boom" to keep the camera for a player from colliding into the world.

- In your code editor, navigate to ExampleCharacter.h**. **In the **Class defaults,** declare the following classes. C++ ```
protected:
         UPROPERTY(EditDefaultsOnly, BlueprintReadOnly, Category = "Components")
         class USpringArmComponent* CameraBoom;

         UPROPERTY(EditDefaultsOnly, BlueprintReadOnly, Category = "Components")
         class UCameraComponent* FollowCamera; |
``` protected: UPROPERTY(EditDefaultsOnly, BlueprintReadOnly, Category = "Components") class USpringArmComponent* CameraBoom; UPROPERTY(EditDefaultsOnly, BlueprintReadOnly, Category = "Components") class UCameraComponent* FollowCamera; |UProperty Specifiers (-> unreal-engine-uproperties) are used to provide visibility of the component in the Blueprint Editor.
- Navigate to your `ExampleCharacter.cpp` file. Add the following libraries to the include line. C++ ```
#include "GameFramework/SpringArmComponent.h"
         #include "Camera/CameraComponent.h"
``` #include "GameFramework/SpringArmComponent.h" #include "Camera/CameraComponent.h"
- Next, implement the following in the `AExampleCharacter` constructor. C++ ```
AExampleCharacter::AExampleCharacter()
        {
        //Initialize the Camera Boom
        CameraBoom = CreateDefaultSubobject<USpringArmComponent>(TEXT("CameraBoom"));

        //Setup Camera Boom attachment to the Root component of the class
        CameraBoom->SetupAttachment(RootComponent);

        //Set the boolean to use the PawnControlRotation to true.
        CameraBoom->bUsePawnControlRotation = true;
``` The component calls the FObjectInitializer::CreateDefaultSubobject (-> API)template, then uses the SetupAttachment (-> API) method to attach to a parent Scene Component. When setting the Camera Boom to use the Pawn's control rotation (-> API), it uses its parent pawn's rotation instead of its own.
- Compile your code.

#### Creating the Action/Axis Functions to your Input Component

- In your `ExampleCharacter.h` class defaults, declare the following Input functions. C++ ```
protected:

         void MoveForward(float AxisValue);

         void MoveRight(float AxisValue);
``` protected: void MoveForward(float AxisValue); void MoveRight(float AxisValue);
- Navigate to your `ExampleCharacter.cpp` and implement your `MoveForward` and `MoveRight` methods. C++ ```
void AExampleCharacter::MoveForward(float AxisValue)
         {
             if ((Controller != NULL) && (AxisValue != 0.0f))
             {
                 // find out which direction is forward
                 const FRotator Rotation = Controller->GetControlRotation();
                 const FRotator YawRotation(0, Rotation.Yaw, 0);

                 // get forward vector
                 const FVector Direction = FRotationMatrix(YawRotation).GetUnitAxis(EAxis::X);
```
- Navigate to the SetupPlayerInputComponent(UInputComponent* PlayerInputComponent) method, then implement the following code. C++ ```
void AExampleCharacter::SetupPlayerInputComponent(UInputComponent* PlayerInputComponent)
         {
             Super::SetupPlayerInputComponent(PlayerInputComponent);

             PlayerInputComponent->BindAction("Jump", IE_Pressed, this, &ACharacter::Jump);
             PlayerInputComponent->BindAction("Jump", IE_Released, this, &ACharacter::StopJumping);

             PlayerInputComponent->BindAxis("MoveForward", this, &AExampleCharacter::MoveForward);
             PlayerInputComponent->BindAxis("MoveRight", this, &AExampleCharacter::MoveRight);
             PlayerInputComponent->BindAxis("Turn", this, &APawn::AddControllerYawInput);
``` The Player Input Component (-> input-overview-in-unreal-engine) links the AxisMappings and ActionMappings in your project to game actions. Both the Pawn and Character class contain methods that are inherited and can be used or extended for your custom characters. In our example, we've used the Pawn's AddControllerYawInput and AddControllerPitchInput functions, and the Character's Jump and StopJumping functions.
- Compile your code.

## Finished Code

#### ExampleCharacter.h

 C++

```
#pragma once

		#include "CoreMinimal.h"
		#include "GameFramework/Character.h"
		#include "ExampleCharacter.generated.h"

		UCLASS()
		class SETTINGUPINPUT_API AExampleCharacter : public ACharacter
		{
			GENERATED_BODY()
```

#### ExampleCharacter.cpp

 C++

```
// Sets default values
		AExampleCharacter::AExampleCharacter()
		{
			//Initialize the Camera Boom
			CameraBoom = CreateDefaultSubobject<USpringArmComponent>(TEXT("CameraBoom"));

			//Setup its attachment to the Root component of the class
			CameraBoom->SetupAttachment(RootComponent);

			//Set the boolean to use the PawnControlRotation to true.
```

## Creating the Character Blueprint

- Navigate to your **C++ Classes Folder** and right click your **ExampleCharacter**, from the drop down menu select **Create Blueprint class based on ExampleCharacter**. Name your Blueprint **BP_ExampleCharacter**.
- In the **Components** panel, select the **Mesh** Skeletal Mesh Component.[image: components-mesh-select]
- Navigate to** Details** > **Mesh** > **Skeletal Mesh** and expand the drop-down menu. In the Browser section, click the **Settings** Icon. Then from the context menu, select **Content** > **Show Engine Content**.[image: show-engine-content]
- Search for and select the **TutorialTPP **Skeletal Mesh.[image: details-skeletalmesh-select]
- Navigate to the **Transform** category, then set the **Location** and **Rotation** vector values to (**0.0, 0.0, -90**)[image: transform-details]

## Creating the GameMode Blueprint

The GameMode (-> game-mode-and-game-state-in-unreal-engine) defines the game's set of rules. These rules include what default pawn the player will spawn when the game is launched. You need to set up these rules to spawn the Player Character you created.

- In the **Content Drawer**, navigate to your **C++ Classes** folder, right-click the **SettingUpInputGameModeBase**, then in the drop-down menu select **Create Blueprint Based on SettingUpInputGameModeBase**. Name your game mode Blueprint "**BP_InputGameMode**".[image: image alt text]
- In the **Class** defaults, navigate to **Classes** > **Default Pawn Class**, and select the **BP_ExampleCharacter**.[image: image alt text]
- **Compile** and **Save**.[image: compile-and-save]
- Navigate to **Edit** > **Project Settings** > **Maps and Modes**. Set the **Default GameMode** to **BP_InputGameMode.**[image: project-settings]
- Navigate to the **Editor** and select **Play** (**Play in Editor**)[image: play-in-editor]

You can now control your character's movement using the W, A, S, D keys. Moving the mouse moves the camera, and pressing the spacebar causes the character to jump.

## Result

[image: image alt text]

- blueprints
- programming
- input
- action mapping
- axis mapping

On this page

- Project Setup (-> setting-up-user-inputs-in-unreal-engine)
- Action and Axis Mapping Setup (-> setting-up-user-inputs-in-unreal-engine)
- Creating the Example Character (-> setting-up-user-inputs-in-unreal-engine)
- Creating the SpringArm and Camera Components (-> setting-up-user-inputs-in-unreal-engine)
- Creating the Action/Axis Functions to your Input Component (-> setting-up-user-inputs-in-unreal-engine)
- Finished Code (-> setting-up-user-inputs-in-unreal-engine)
- ExampleCharacter.h (-> setting-up-user-inputs-in-unreal-engine)
- ExampleCharacter.cpp (-> setting-up-user-inputs-in-unreal-engine)
- Creating the Character Blueprint (-> setting-up-user-inputs-in-unreal-engine)
- Creating the GameMode Blueprint (-> setting-up-user-inputs-in-unreal-engine)
- Result (-> setting-up-user-inputs-in-unreal-engine)

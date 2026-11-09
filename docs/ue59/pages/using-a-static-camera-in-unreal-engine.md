# Using a Static Camera

https://dev.epicgames.com/documentation/en-us/unreal-engine/using-a-static-camera-in-unreal-engine?application_version=5.9

> A how-to guide for using a static camera to blend between player viewpoints.

[image: Using a Static Camera]

Programming Language

×C++

Select an option from the dropdown to see content relevant to it.

In this How-to tutorial you will create a static (or fixed) camera angle that is used for the player's perspective during gameplay in a third person example map, and then you will create a trigger volume which will transition your viewpoint to the new static camera once your character overlaps the volume. Upon completing this tutorial, you can take the process used here and apply it to your own game to set up a fixed perspective for a player.

## Creating The Static Camera Actor

- Begin by creating a **New > Games > Third Person > C++** project named **StaticCameras**.
- Launch the **C++ Class Wizard**, enable the checkbox for **Show All Classes**, then type **CameraActor** within the search field to select and create your new **Camera Actor** class named **ExampleCameraActor**.[image: New C++ Camera Actor class]
- From the **C++ Class** panel, right click on your **ExampleCamera** and from the dropdown **C++ Class** actions menu select **Create a Blueprint class based on ExampleCameraActor**. Then drag an instance of **BP_ExampleCameraActor** into the level.[image: Place Actor in level] Click image to expand.

## Level Setup

In order to demonstrate the transition of perspectives between the player's camera and the static camera Actor, you will need to set up the scene. You can accomplish this by modifying some of the static mesh geometry from the third person template level.

- Begin by navigating to the world outliner panel, and shift select the **Floor** and the four **Wall** Static Mesh Actors from the **ArenaGeometry > Arena** folder.[image: selecting-floors-and-walls-in-the-world-outliner]In the example image above, the four Wall Static Mesh Actors are listed as **Wall6**, **Wall7**, **Wall8**, and **Wall9**.
- **Alt-click** and drag the **Transform** gizmo to create a duplicate floor and wall setup.
- This will result in the creation of a second **Floor**, and four additional **Wall** Static Mesh Actors.[image: Duplicated walls and floors]In the example image above, the duplicated floor is labeled Floor2, and the duplicated walls are named **Wall10**, **Wall11**, **Wall12**, and **Wall13**.
- Move the newly duplicated static meshes to resemble the layout below, a new room duplicating the first but without any contents.[image: Overhead view of new room] Click image to expand.
- From the world outliner, select the two walls that connect the two rooms, and set their **X Scale** values to 14.In the example image above, these two walls are labeled **Wall9** and **Wall12**.[image: x-scale-value-in-details-panel]
- Select both the connecting walls, then move them using the **Transform** gizmo so that they form a partition between rooms with a gap as shown in the gif below.In the example image above, these two walls are labeled **Wall9** and **Wall10**
- Your completed level setup should look similar to the image below, with a second room connected to the first by an opening in the wall.[image: Connected rooms] Click image to expand.

## Camera Perspective Setup

Now that you have completed the level setup, you can place the **BP_ExampleCameraActor** in the level to get a better idea of the view the player will have once they overlap the trigger volume. You can take a First Person perspective from the Camera's Point of View by locking the **Viewport** to the Camera Actor and entering **Pilot** mode.

- With the Camera selected in the level, right-click on it, then from the context menu select **Pilot CameraActor**.[image: Context menu Pilot CameraActor]
- You can now move around the Viewport using the **WASD** keys while holding the **Left** or **Right Mouse Button** down. While you fly around the level, the Camera's position will move along with your movement allowing you to get an idea of the perspective the camera will take during gameplay.
- To unlock the Camera, click the **Unlock** button.[image: Unlock button]The camera will remain where it was positioned when you unlocked it. The icon next to the Unlock button allows you to toggle between showing the in-game camera view or the level editor view.
- Pilot the Camera into a position looking down on the second room similar to the gif below.
- Your completed camera scene setup should look similar to the image below, with a static camera looking down on the new room along with the original camera following the third-person actor.[image: Completed Camera setup] Click image to expand.

## Creating the Overlap Trigger Actor

In this example, the trigger Actor functions as the transition manager between the player's camera view point and the static camera view point, once the player overlaps its box component volume bounds, a transitional blend will occur between the perspectives.

- Using the **C++ Class Wizard**, create a new Actor class named BlendTriggerVolume.[image: New C++ Blend Trigger Volume class]
- Navigate to your `BlendTriggerVolume.h` file, and declare the following code in your **class definition**. C++ ```
protected:

         //Collision Bounds of the Actor Volume
         UPROPERTY(EditAnywhere, BlueprintReadWrite)
             class UBoxComponent* OverlapVolume;

             //Camera Actor which the Actor Volume blends to
             UPROPERTY(EditAnywhere, BlueprintReadWrite)
             TSubclassOf<ACameraActor> CameraToFind;

```
- Next, navigate to your `BlendTriggerVolume.cpp` file to set up your constructor and box component overlap methods. Declare the following include class libraries. C++ ```
`#include "Components/BoxComponent.h"`

         `#include "StaticCamerasCharacter.h"`

         `#include "Camera/CameraActor.h"`

         `#include "Runtime/Engine/Classes/Kismet/GameplayStatics.h"`
``` `#include "Components/BoxComponent.h"` `#include "StaticCamerasCharacter.h"` `#include "Camera/CameraActor.h"` `#include "Runtime/Engine/Classes/Kismet/GameplayStatics.h"`
- In the constructor **ABlendTriggerVolume::ABlendTriggerVolume**, declare the following code. C++ ```
ABlendTriggerVolume::ABlendTriggerVolume()
         {
         //Create box component default components
         OverlapVolume = CreateDefaultSubobject<UBoxComponent>(TEXT("CameraProximityVolume"));
         //Set the box component attachment to the root component.
         OverlapVolume->SetupAttachment(RootComponent);
         }
``` ABlendTriggerVolume::ABlendTriggerVolume() { //Create box component default components OverlapVolume = CreateDefaultSubobject(TEXT("CameraProximityVolume")); //Set the box component attachment to the root component. OverlapVolume->SetupAttachment(RootComponent); }
- Next, implement your `NotifyActorBeginOverlap` and `NotifyActorEndOverlap` class methods: C++ ```
void ABlendTriggerVolume::NotifyActorBeginOverlap(AActor* OtherActor){
         //Cast check to see if overlapped Actor is Third Person Player Character

         if (AStaticCamerasCharacter* PlayerCharacterCheck = Cast<AStaticCamerasCharacter>(OtherActor))
             {

         //Cast to Player Character's PlayerController

         if (APlayerController* PlayerCharacterController = Cast<APlayerController>(PlayerCharacterCheck->GetController()))
                 {
```
- **Compile** your code.

## Finished Code

### BlendTriggerVolume.h

 C++

```
#pragma once

	#include "CoreMinimal.h"
	#include "GameFramework/Actor.h"
	#include "BlendTriggerVolume.generated.h"

	UCLASS()
	class STATICCAMERAS_API ABlendTriggerVolume : public AActor
	{
		GENERATED_BODY()
```

### BlendTriggerVolume.cpp

 C++

```
#include "BlendTriggerVolume.h"
	#include "Components/BoxComponent.h"
	#include "StaticCamerasCharacter.h"
	#include "Camera/CameraActor.h"
	#include "Runtime/Engine/Classes/Kismet/GameplayStatics.h"

	// Sets default values
	ABlendTriggerVolume::ABlendTriggerVolume()
	{
```

## Setting up the Overlap Trigger Actor

Now that you have created your overlap Actor, you will need to place it into the level and set up its bounds.

- Begin by navigating to your **C++ Classes** folder, right-click on your **BlendTriggerVolume** class, select **Create Blueprint Class based on BlendTriggerVolume**, then name your **Blueprint Actor** **BP_BlendTriggerVolume**.[image: Create Blueprint class]
- From the class defaults, navigate to **Camera To Find** in the **Details** panel, open the drop down menu, then select **BP_ExampleCameraActor**.[image: Finding the camera]
- Optionally, you can change the default blend time for this Blueprint without having to go back into the source code, or affecting other Blueprints with the same inherited parent class.[image: Change default Blend time]
- **Compile** and **Save**.[image: Compile button]
- From the **Content Browser**, drag an instance of **BP_BlendTriggerVolume** into the level.[image: Place Volume actor] Click image to expand.
- Move the **BP_BlendTriggerVolume** into the room with your **BP_ExampleCameraActor**, and from the **Details** panel select the box component. Navigate to the **Shape** category and modify the **Box Extent** X, Y, and Z values so the volume will fit your room.[image: Adjust Volume actor to fit room] Click image to expand.
- From the **Main Editor View**, click the **Play** button to play in the Editor.

## End Result

When the game starts, the player controls their character's movement using **WASD**. Upon overlapping the **BP_BlendTriggerVolume** the camera view is assigned to the **Camera Actor** that you have created and placed in your level, and the view will switch to an overhead shot of the player-controlled character.

You may have noticed that the view is Widescreen; you can disable this by un-checking the **Constrain Aspect Ratio** option inside the **Details** panel for the Camera Actor.

[image: Constrain Aspect Ratio checkbox]

On this page

- Creating The Static Camera Actor (-> using-a-static-camera-in-unreal-engine)
- Level Setup (-> using-a-static-camera-in-unreal-engine)
- Camera Perspective Setup (-> using-a-static-camera-in-unreal-engine)
- Creating the Overlap Trigger Actor (-> using-a-static-camera-in-unreal-engine)
- Finished Code (-> using-a-static-camera-in-unreal-engine)
- BlendTriggerVolume.h (-> using-a-static-camera-in-unreal-engine)
- BlendTriggerVolume.cpp (-> using-a-static-camera-in-unreal-engine)
- Setting up the Overlap Trigger Actor (-> using-a-static-camera-in-unreal-engine)
- End Result (-> using-a-static-camera-in-unreal-engine)

Related documents

Camera

 [image: Camera] (-> cameras-in-unreal-engine)Blueprints Visual Scripting

 [image: Blueprints Visual Scripting] (-> blueprints-visual-scripting-in-unreal-engine)

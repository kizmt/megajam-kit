# Opening Doors

https://dev.epicgames.com/documentation/en-us/unreal-engine/opening-doors-in-unreal-engine?application_version=5.9

> An example use of a timeline in which we set up a classic proximity-based opening door using Blueprints and C++.

[image: Opening Doors]

Programming Language

×C++

Select an option from the dropdown to see content relevant to it.

An example C++ **Timeline** is used to set up a classic proximity-based opening door.

## Creating the Door Actor

- Create the new **C++** project based on **Blank** template with **Starter Content** enabled, name it **TimelineDoorActor**. Click image for full size.
- Navigate to the **Content Browser**, click **C++ Classes** folder, then click **Add (+)** button and select **New C++ Class**. Click image for full size.
- Select **Actor** as a **Parent Class**. Click image for full size.
- Name created Actor as **DoorActor**. Click image for full size.
- When new Actor is created, **Visual Studio** automatically opens `DoorActor.h` and `DoorActor.cpp` files. Navigate to the `DoorActor.h` file and declare the following:DoorActor.h C++ ```
#include "Components/TimelineComponent.h"
``` #include "Components/TimelineComponent.h"
- Next, in the `DoorActor` class definition, add the following code:DoorActor.h C++ ```
protected:

         //MeshComponents to represent Door assets
         UPROPERTY(VisibleAnywhere, BlueprintReadWrite)
         UStaticMeshComponent* DoorFrame;
         UPROPERTY(VisibleAnywhere, BlueprintReadWrite)
         UStaticMeshComponent* Door;

         //TimelineComponent to animate Door meshes
         UPROPERTY(VisibleAnywhere, BlueprintReadWrite)
```
- Navigate to the `DoorActor.cpp`. You will need to include the following class library to utilize your Box Component.DoorActor.cpp C++ ```
#include "Components/BoxComponent.h"
``` #include "Components/BoxComponent.h"
- In the constructor of your `ADoorActor::ADoorActor` declare the following:DoorActor.cpp C++ ```
// Sets default values
     ADoorActor::ADoorActor()
     {
         // Set this actor to call Tick() every frame.  You can turn this off to improve performance if you don't need it.
         PrimaryActorTick.bCanEverTick = true;

         //Create our Default Components
         DoorFrame = CreateDefaultSubobject<UStaticMeshComponent>(TEXT("DoorFrameMesh"));
         Door = CreateDefaultSubobject<UStaticMeshComponent>(TEXT("DoorMesh"));
         DoorTimelineComp = CreateDefaultSubobject<UTimelineComponent>(TEXT("DoorTimelineComp"));
``` Note: We keep the door's relative transform as an attachment rule, in order to manipulate it later with a custom method for our Door Actor. For further documentation, see FAttachmentTransformRules (-> API).
- Compile your code.

## Setting Up the Door Static Mesh

You will need to set up the **Static Mesh** assets that will visually represent your DoorFrame and Door Static Mesh components.

- From the **Content Browser**, navigate to your **C++ Classes folder**.
- Right click your **DoorActor** class, select **Create Blueprint Class based on DoorActor**.
- Name your Blueprint Actor **Bp_DoorActor** and place it in appropriate folder. Click image for full size.
- From the **Components** tab, select the **DoorFrame** Static Mesh component.
- Navigate to the **Details panel** and change the **Static Mesh** to **SM_DoorFrame**.
- Navigate to the **Components** tab, select the **DoorMesh** component.
- From the **Details** panel change the **Static Mesh** to **SM_Door**.
- Then navigate to the **Transform** category and change the **Y Location** value to **45.0**.
- Click **Compile** and **Save** buttons.

## Creating UCurveFloat and Timeline Event Tracks

The Timeline Component requires a Timeline Curve (-> keys-and-curves-in-unreal-engine). Each curve can contain multiple keys that define a time and value.Curves interpolate these keys to calculate the value at any point during the Timeline.

For this example, we will be using a UCurveFloat (-> API).

- Navigate to the `ADoorActor` class definition in `DoorActor.h` and declare the following variables:DoorActor.h C++ ```
public:
         // Variable to hold the Curve asset
         UPROPERTY(EditAnywhere)
         UCurveFloat* DoorTimelineFloatCurve;

     private:
         //Float Track Signature to handle our update track event
         FOnTimelineFloat UpdateFunctionFloat;

         //Function which updates our Door's relative location with the timeline graph
```
- Navigate to `DoorActor.cpp` and implement the `UpdateTimelineComp` method:DoorActor.cpp C++ ```
void ADoorActor::UpdateTimelineComp(float Output)
     {
         // Create and set our Door's new relative location based on the output from our Timeline Curve
         FRotator DoorNewRotation = FRotator(0.0f, Output, 0.f);
         Door->SetRelativeRotation(DoorNewRotation);
     }
``` void ADoorActor::UpdateTimelineComp(float Output) { // Create and set our Door's new relative location based on the output from our Timeline Curve FRotator DoorNewRotation = FRotator(0.0f, Output, 0.f); Door->SetRelativeRotation(DoorNewRotation); }
- Then, in the `BeginPlay` method, add the following code:DoorActor.cpp C++ ```
//Binding our float track to our UpdateTimelineComp Function's output
     UpdateFunctionFloat.BindDynamic(this, &ADoorActor::UpdateTimelineComp);

     //If we have a float curve, bind it's graph to our update function
     if (DoorTimelineFloatCurve)
     {
        DoorTimelineComp->AddInterpFloat(DoorTimelineFloatCurve, UpdateFunctionFloat);
     }
``` //Binding our float track to our UpdateTimelineComp Function's output UpdateFunctionFloat.BindDynamic(this, &ADoorActor::UpdateTimelineComp); //If we have a float curve, bind it's graph to our update function if (DoorTimelineFloatCurve) { DoorTimelineComp->AddInterpFloat(DoorTimelineFloatCurve, UpdateFunctionFloat); }
- Compile your code.

## Work-In-Progress Code

DoorActor.h

 C++

```
// Copyright 1998-2022 Epic Games, Inc. All Rights Reserved.
	#pragma once
	#include "Components/TimelineComponent.h"
	#include "CoreMinimal.h"
	#include "GameFramework/Actor.h"
	#include "DoorActor.generated.h"

	UCLASS()
	class TIMELINEDOORACTOR_API ADoorActor : public AActor
	{
```

DoorActor.cpp

 C++

```
//Copyright 1998-2022 Epic Games, Inc. All Rights Reserved.

	#include "DoorActor.h"
	#include "Components/BoxComponent.h"

	// Sets default values
	ADoorActor::ADoorActor()
	{
		// Set this actor to call Tick() every frame.  You can turn this off to improve performance if you don't need it.
		PrimaryActorTick.bCanEverTick = true;
```

## Creating and Binding Collision Overlap Events

The Box Component requires the ability to react when an Actor enters or leaves its collision bounds.

- Navigate to the class definition of your `DoorActor.h` file and declare the following:DoorActor.h C++ ```
// Begin and End Overlap Events for our DoorProxVolume
     UFUNCTION()
     void OnOverlapBegin(class UPrimitiveComponent* OverlappedComp, class AActor* OtherActor, class UPrimitiveComponent* OtherComp, int32 OtherBodyIndex, bool bFromSweep, const FHitResult& SweepResult);

     UFUNCTION()
     void OnOverlapEnd(class UPrimitiveComponent* OverlappedComp, class AActor* OtherActor, class UPrimitiveComponent* OtherComp, int32 OtherBodyIndex);
``` // Begin and End Overlap Events for our DoorProxVolume UFUNCTION() void OnOverlapBegin(class UPrimitiveComponent* OverlappedComp, class AActor* OtherActor, class UPrimitiveComponent* OtherComp, int32 OtherBodyIndex, bool bFromSweep, const FHitResult& SweepResult); UFUNCTION() void OnOverlapEnd(class UPrimitiveComponent* OverlappedComp, class AActor* OtherActor, class UPrimitiveComponent* OtherComp, int32 OtherBodyIndex);
- Next, navigate to your `DoorActor.cpp` file to implement your `OnOverlapBegin` and `OnOverlapEnd` class methods:DoorActor.cpp C++ ```
void ADoorActor::OnOverlapBegin(UPrimitiveComponent * OverlappedComp, AActor * OtherActor, UPrimitiveComponent * OtherComp, int32 OtherBodyIndex, bool bFromSweep, const FHitResult & SweepResult)
     {
         DoorTimelineComp->Play();
     }

     void ADoorActor::OnOverlapEnd(UPrimitiveComponent * OverlappedComp, AActor * OtherActor, UPrimitiveComponent * OtherComp, int32 OtherBodyIndex)
     {
         DoorTimelineComp->Reverse();
     }
``` void ADoorActor::OnOverlapBegin(UPrimitiveComponent * OverlappedComp, AActor * OtherActor, UPrimitiveComponent * OtherComp, int32 OtherBodyIndex, bool bFromSweep, const FHitResult & SweepResult) { DoorTimelineComp->Play(); } void ADoorActor::OnOverlapEnd(UPrimitiveComponent * OverlappedComp, AActor * OtherActor, UPrimitiveComponent * OtherComp, int32 OtherBodyIndex) { DoorTimelineComp->Reverse(); }
- Bind your overlap functions in the `BeginPlay` method, as following:DoorActor.cpp C++ ```
void ADoorActor::BeginPlay()
     {
         Super::BeginPlay();

         //Binding our float track to our UpdateTimelineComp Function's output
         UpdateFunctionFloat.BindDynamic(this, &ADoorActor::UpdateTimelineComp);

         //If we have a float curve, bind it's graph to our update function
         if (DoorTimelineFloatCurve)
         {
```
- Compile your code.

## Creating a Curve Asset in the Unreal Editor

You must create a **Curve Asset** in the **Unreal Editor** to assign it to your Timeline Actor Blueprint.

- Navigate to the **Content Browser**, select **Add (+) > Miscellaneous > Curve**.
- Select **CurveFloat** and name the Asset **DoorCurveFloat**.
- Double-click created **DoorCurveFloat** to open the **Timeline Editor**.
- Add two keys to the Float Curve, by right clicking on the **Graph**, then select **Add Key**. Adjust time-value of the first key to the **(0, 0)**. Adjust time-value of the second key to the **(4, 90)**. Click image for full size. For more information on editing **Timeline** curves, see Keys and Curves (-> keys-and-curves-in-unreal-engine).
- Press **Shift** and click to select both your keys, right click on the **Graph** and set them to **Auto** interpolation. Click image for full size.
- Your Curve now should look as following. Save your **DoorCuveFloat** and close **Timeline Editor**. Click image for full size.
- Open your **Bp_DoorActor** and select the **Bp_DoorActor** from the **Components** tab.
- Navigate to the **Details** panel and select **DoorCurveFloat** from the **Door Timeline Float Curve** dropdown menu of the **Door Action** section.
- Navigate to the **Content Browser** and place the **Bp_DoorActor** into the **Level**.
- Compile and Save, then press PIE.Using input with WASD, you can control your spectator Pawn. Upon navigating to the collision bounds of your DoorActor, you can observe the timeline play, and upon exiting the bounds, you can observe it play in reverse.

## Finished Code

DoorActor.h

 C++

```
// Copyright 1998-2022 Epic Games, Inc. All Rights Reserved.

	#pragma once
	#include "Components/TimelineComponent.h"
	#include "CoreMinimal.h"
	#include "GameFramework/Actor.h"
	#include "DoorActor.generated.h"

	UCLASS()
	class TIMELINEDOORACTOR_API ADoorActor : public AActor
```

DoorActor.cpp

 C++

```
// Copyright 1998-2022 Epic Games, Inc. All Rights Reserved.

	#include "DoorActor.h"
	#include "Components/BoxComponent.h"

	// Sets default values
	ADoorActor::ADoorActor()
	{
		// Set this actor to call Tick() every frame.  You can turn this off to improve performance if you don't need it.
		PrimaryActorTick.bCanEverTick = true;
```

- blueprints
- blueprint

On this page

- Creating the Door Actor (-> opening-doors-in-unreal-engine)
- Setting Up the Door Static Mesh (-> opening-doors-in-unreal-engine)
- Creating UCurveFloat and Timeline Event Tracks (-> opening-doors-in-unreal-engine)
- Work-In-Progress Code (-> opening-doors-in-unreal-engine)
- Creating and Binding Collision Overlap Events (-> opening-doors-in-unreal-engine)
- Creating a Curve Asset in the Unreal Editor (-> opening-doors-in-unreal-engine)
- Finished Code (-> opening-doors-in-unreal-engine)

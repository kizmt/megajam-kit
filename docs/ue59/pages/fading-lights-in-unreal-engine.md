# Fading Lights

https://dev.epicgames.com/documentation/en-us/unreal-engine/fading-lights-in-unreal-engine?application_version=5.9

> An example use of a timeline in which we set up a fading light that also changes color.

[image: Fading Lights]

Programming Language

×C++

Select an option from the dropdown to see content relevant to it.

This document describes how to set up a light Actor that changes color and slowly fades away on contact.

This will be done using a Point Light Component (-> point-lights-in-unreal-engine) containing a Box Component to serve as an overlap trigger and a Timeline component to manipulate the Point Light Actor.

## Creating the Fading Light Actor

- Create the new **C++** project based on **Blank** template, name it **FadingLights**. Click image for full size.
- Navigate to the **Content Browser**, click **C++ Classes** folder, then click **Add (+)** button and select **New C++ Class**. Click image for full size.
- Select **Actor** as a **Parent Class**. Click image for full size.
- Name created Actor as **LightActor**. Click image for full size.
- When new Actor is created, **Visual Studio** automatically opens `LightActor.h` and `LightActor.cpp` files. Navigate to the `LightActor.h` file and declare the following:LightActor.h C++ ```
#include "Components/TimelineComponent.h"
``` #include "Components/TimelineComponent.h"
- Next, in the `LightActor` class definition, add the following code:LightActor.h C++ ```
public:

             UPROPERTY(EditAnywhere)
             UCurveFloat* PointLightFloatCurve;

             UPROPERTY(EditAnywhere)
             UCurveLinearColor* PointLightColorCurve;

     protected:
```
- Navigate to `LightActor.cpp` and add the following class libraries.LightActor.cpp C++ ```
#include "Components/BoxComponent.h"
     #include "Components/PointLightComponent.h"
``` #include "Components/BoxComponent.h" #include "Components/PointLightComponent.h"
- In the constructor for `ALightActor::ALightActor` declare the following:LightActor.cpp C++ ```
ALightActor::ALightActor()
     {
         // Set this actor to call Tick() every frame.  You can turn this off to improve performance if you don't need it.
         PrimaryActorTick.bCanEverTick = true;

         //Create our Default Components
         PointLightComp = CreateDefaultSubobject<UPointLightComponent>(TEXT("PointLightComp"));
         LightTimelineComp = CreateDefaultSubobject<UTimelineComponent>(TEXT("LightTimelineComp"));
         LightOverlapVolume = CreateDefaultSubobject<UBoxComponent>(TEXT("LightOverlapVolume"));
```
- Next, implement the Point Light component's `UFunction` methods:LightActor.cpp C++ ```
void ALightActor::UpdateLightBrightness(float BrightnessOutput)
     {
         PointLightComp->SetLightBrightness(BrightnessOutput * 20.0f);
     }

     void ALightActor::UpdateLightColor(FLinearColor ColorOutput)
     {
         PointLightComp->SetLightColor(ColorOutput);
     }
``` void ALightActor::UpdateLightBrightness(float BrightnessOutput) { PointLightComp->SetLightBrightness(BrightnessOutput * 20.0f); } void ALightActor::UpdateLightColor(FLinearColor ColorOutput) { PointLightComp->SetLightColor(ColorOutput); }
- Then, in the `BeginPlay` method, add the following code:LightActor.cpp C++ ```
void ALightActor::BeginPlay()
     {
         Super::BeginPlay();

         //Binding our float and color track to their respective functions
         UpdateBrightnessTrack.BindDynamic(this, &ALightActor::UpdateLightBrightness);
         UpdateColorTrack.BindDynamic(this, &ALightActor::UpdateLightColor);

         //If we have a float curve, bind it's graph to our update function
         if (PointLightFloatCurve)
```
- Compile your code.
- From the **Content Browser**, navigate to the **C++ Classes folder**.
- Right click the **LightActor**, select **Create Blueprint Class based on LightActor**, and name the Blueprint Actor **BP_LightActor**.

The BP_LightActor's Class Defaults will appear as they do below:

 Click image for full size.

## Work-In-Progress Code

LightActor.h

 C++

```
//Copyright 1998-2022 Epic Games, Inc. All Rights Reserved.

	#pragma once
	#include "Components/TimelineComponent.h"
	#include "CoreMinimal.h"
	#include "GameFramework/Actor.h"
	#include "LightActor.generated.h"

	UCLASS()
	class FADINGLIGHTS_API ALightActor : public AActor
```

LightActor.cpp

 C++

```
//Copyright 1998-2022 Epic Games, Inc. All Rights Reserved.

	#include "LightActor.h"
	#include "Components/BoxComponent.h"
	#include "Components/PointLightComponent.h"

	// Sets default values
	ALightActor::ALightActor()
	{
		// Set this actor to call Tick() every frame.  You can turn this off to improve performance if you don't need it.
```

## Creating and Binding the Collision Overlap Event

The Box Component requires the ability to trigger the **TimelineComponent** when an Actor enters its collision bounds.

- Navigate to the class definition of the `LightActor.h` file and declare the following under `BrightnessMultiplier`:LightActor.h C++ ```
protected:

         UFUNCTION()
         void OnOverlapBegin(class UPrimitiveComponent* OverlappedComp, class AActor* OtherActor, class UPrimitiveComponent* OtherComp, int32 OtherBodyIndex, bool bFromSweep, const FHitResult& SweepResult);
``` protected: UFUNCTION() void OnOverlapBegin(class UPrimitiveComponent* OverlappedComp, class AActor* OtherActor, class UPrimitiveComponent* OtherComp, int32 OtherBodyIndex, bool bFromSweep, const FHitResult& SweepResult);
- Next, navigate to the `LightActor.cpp` file and implement the `OnOverlapBegin` function.LightActor.cpp C++ ```
void ALightActor::OnOverlapBegin(class UPrimitiveComponent* OverlappedComp, class AActor* OtherActor, class UPrimitiveComponent* OtherComp, int32 OtherBodyIndex, bool bFromSweep, const FHitResult& SweepResult)
     {
         LightTimelineComp->Play();
     }
``` void ALightActor::OnOverlapBegin(class UPrimitiveComponent* OverlappedComp, class AActor* OtherActor, class UPrimitiveComponent* OtherComp, int32 OtherBodyIndex, bool bFromSweep, const FHitResult& SweepResult) { LightTimelineComp->Play(); }
- Bind the overlap function in the `BeginPlay` method:LightActor.cpp C++ ```
//Binding our Box Component to our Light Actor's Overlap Function
     LightOverlapVolume->OnComponentBeginOverlap.AddDynamic(this, &ALightActor::OnOverlapBegin);
``` //Binding our Box Component to our Light Actor's Overlap Function LightOverlapVolume->OnComponentBeginOverlap.AddDynamic(this, &ALightActor::OnOverlapBegin);
- Compile your code.

## Finished Code

LightActor.h

 C++

```
//Copyright 1998-2022 Epic Games, Inc. All Rights Reserved.

	#pragma once
	#include "Components/TimelineComponent.h"
	#include "CoreMinimal.h"
	#include "GameFramework/Actor.h"
	#include "LightActor.generated.h"

	UCLASS()
	class FADINGLIGHTS_API ALightActor : public AActor
```

LightActor.cpp

 C++

```
//Copyright 1998-2022 Epic Games, Inc. All Rights Reserved.

	// Fill out your copyright notice in the Description page of Project Settings.

	#include "LightActor.h"
	#include "Components/BoxComponent.h"
	#include "Components/PointLightComponent.h"

	// Sets default values
	ALightActor::ALightActor()
```

## Setting Up the Brightness Track

When the player overlaps with the light Actor's box component bounds, the Timeline component will require a float curve to manipulate the Point Light component's brightness value.

The luminosity will have an initial value of **5000** and will decrease to **0** over the span of **5** seconds.

- Navigate to the **Content Browser**, select **Add (+) > Miscellaneous > Curve**.
- Select **CurveFloat** and name the Asset **BrightnessCurveFloat**.
- Double-click the **BrightnessCurveFloat** to open the **Timeline Editor**.
- Add two keys to the Float Curve, by right clicking on the **Graph**, then select **Add Key**. Adjust time-value of the first key to the **(0, 5000)**. Adjust time-value of the second key to the **(5, 0)**. Your **BrightnessCurveFloat** should look as following: Click image for full size.
- Save the **BrightnessCurveFloat**, then navigate back to the **Content Browser** and double-click the **BP_LightActor** to open its **Class Defaults**.
- Navigate to the **Details** panel and select **Brightness Curve Float** from the **Point Light Float Curve** dropdown menu.
- Click **Compile** and **Save** buttons.

## Setting Up the Color Track

When the player overlaps with the light Actor's box component bounds, the PointLight Timeline will require a linear color curve track to manipulate the Point Light component's color property.

- Navigate to the **Content Browser**, select **Add (+) > Miscellaneous > Curve**.
- Select **CurveLinearColor** and name the asset **LinearColorCurve**.
- Double-click the **LinearColorCurve** to open the **Timeline Editor**.
- Double-click the first color key to modify it, set **RGB** value of: (**R**:1, **G:**0.665, **B**:0.015). Click image for full size.
- Double-click the second color key to modify it, set **RGB** value of: (**R**:0, **G:**0, **B**:0). Click image for full size.
- Select second **Point** on the **Graph** by clicking on it and set the time to **5** seconds. Click image for full size.
- Your **LinearColorCurve** should look as following: Click image for full size.
- Save the **LinearColorCurve**, then navigate back to the Content Browser and double-click the **BP_LightActor** to open its class defaults.
- Navigate to the **Details Panel** and select **Brightness Curve Float** from the **Point Light Float Curve** dropdown menu.
- Click **Compile** and **Save** buttons.

## Level Setup

To best demonstrate the functionality of the code you have written, you will need to remove all Light Sources Actors from the Level.

- In the **Content Browser** navigate to the **BP_LightActor** Asset, select it and drag it into the **Level**. Click image for full size.
- Select the **BP_LightActor** in the **World Outliner**, navigate to the **Details** panel and set the **Location** settings to **(0, 0, 300)** and the **Scale** settings to **(10, 10, 10)**.
- Delete the **DirectionalLight Actor** in the **World Outliner**.
- The Level should look as the following. Click image for full size.

## End Result

Now that the Light Actor and Level have been set up, click **Play (PIE)** to automatically take possession of the spectator Pawn.

You can control the spectator Pawn and navigate into the Light Actor's box component bounds.

Once the Timeline Component's Play function has been triggered, the light's color and luminosity should begin to change over a 5-second timespan.

- blueprints
- blueprint

On this page

- Creating the Fading Light Actor (-> fading-lights-in-unreal-engine)
- Work-In-Progress Code (-> fading-lights-in-unreal-engine)
- Creating and Binding the Collision Overlap Event (-> fading-lights-in-unreal-engine)
- Finished Code (-> fading-lights-in-unreal-engine)
- Setting Up the Brightness Track (-> fading-lights-in-unreal-engine)
- Setting Up the Color Track (-> fading-lights-in-unreal-engine)
- Level Setup (-> fading-lights-in-unreal-engine)
- End Result (-> fading-lights-in-unreal-engine)

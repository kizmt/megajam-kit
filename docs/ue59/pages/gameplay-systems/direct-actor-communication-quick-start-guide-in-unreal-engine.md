# Direct Actor Communication Quick Start Guide

https://dev.epicgames.com/documentation/en-us/unreal-engine/direct-actor-communication-quick-start-guide-in-unreal-engine?application_version=5.9

> Quick Start for the Direct Actor Communication method.

[image: Direct Actor Communication Quick Start Guide]

Programming Language

×C++

Select an option from the dropdown to see content relevant to it.

## Overview

Direct Actor communication is a common method of sharing information between Actors in your Level.
This method requires a reference to the target Actor so you can access it from your working Actor. This communication method uses a one-to-one relationship between your working Actor and your target Actor.
In this Quick Start guide, you will learn how to use direct Actor communication to access information from a target Actor in order to use its functions.

## 1 - Required Setup

- In the **New Project Categories** section of the menu, select **Games** and click **Next**.
- Select the **Third Person** template and click **Next**.
- Select **C++ **and **With Starter Content** options and click **Create Project**.

### Section Results

You have created a new Third Person project and are now ready to learn about direct Blueprint communication.

## 2 - Creating the Ceiling Light Actor

- From the C++ Class Wizard (-> using-the-cplusplus-class-wizard-in-unreal-engine), create a new Actor class named **CeilingLight**.
- In the class defaults of **CeilingLight.h** implement the following code. C++ ```
protected:
            UPROPERTY(EditInstanceOnly, BlueprintReadWrite)
            USceneComponent* SceneComp;

            UPROPERTY(EditInstanceOnly, BlueprintReadWrite)
            class UPointLightComponent* PointLightComp;

            UPROPERTY(EditInstanceOnly, BlueprintReadWrite)
            UStaticMeshComponent* StaticMeshComp;

```
- Next navigate to **CeilingLight.Cpp** and declare the following Include library. C++ ```
#include "Components/PointLightComponent.h"
``` #include "Components/PointLightComponent.h"
- From the constructor **ACeilingLight::CeilingLight** declare the following. C++ ```
ACeilingLight::ACeilingLight()
         {
             // Set this actor to call Tick() every frame.  You can turn this off to improve performance if you don't need it.
             PrimaryActorTick.bCanEverTick = true;
             SceneComp = CreateDefaultSubobject<USceneComponent>(TEXT("SceneComp"));
             PointLightComp = CreateDefaultSubobject<UPointLightComponent>(TEXT("PointLightComp"));
             StaticMeshComp = CreateDefaultSubobject<UStaticMeshComponent>(TEXT("StaticMeshComp"));
             SceneComp = RootComponent;
             PointLightComp->AttachToComponent(SceneComp,FAttachmentTransformRules::KeepRelativeTransform);
             StaticMeshComp->AttachToComponent(SceneComp, FAttachmentTransformRules::KeepRelativeTransform);
```
- Compile your code.

## Finished Code

CeilingLight.h

 C++

```
// Fill out your copyright notice in the Description page of Project Settings.
	#pragma once

	#include "CoreMinimal.h"
	#include "GameFramework/Actor.h"
	#include "CeilingLight.generated.h"

	UCLASS()
	class BPCOMMUNICATION_API ACeilingLight : public AActor
	{
```

CeilingLight.cpp

 C++

```
//Copyright Epic Games, Inc. All Rights Reserved.
	#include "CeilingLight.h"
	#include "Components/PointLightComponent.h"

	// Sets default values
	ACeilingLight::ACeilingLight()
	{
		// Set this actor to call Tick() every frame.  You can turn this off to improve performance if you don't need it.
		PrimaryActorTick.bCanEverTick = true;
		SceneComp = CreateDefaultSubobject<USceneComponent>(TEXT("SceneComp"));
```

- From the **C++ Classes folder**, right-click your **CeilingLight** Actor, then from the **C++ Class Actions** dropdown menu, select **Create Blueprint class based on CeilingLight**. Name your Blueprint **BP_CeilingLight**.
- From the **BP_CeilingLight** class defaults, navigate to the **Components** panel, then select the **StaticMeshComp**.
- From the **Details **panel, navigate to the **Static Mesh category**, select the dropdown arrow next to the **Static Mesh** variable, then search and select for **SM_Lamp_Ceiling**.
- Compile and save your Blueprint.
- From the **Content Browser**, drag an instance of your **BP_CeilingLight Actor** into your Level.

## Modifying the ThirdPersonCharacter Class

- Navigate to your C++ Classes folder, and double-click the **BPCommunicationCharacter** class to open its **BPCommunicationCharacter.h**, then declare the following code in the class defaults. C++ ```
protected:
             UPROPERTY(EditInstanceOnly, BlueprintReadWrite)
             class ACeilingLight* CeilingLightToToggle;
             void ToggleCeilingLight();
``` protected: UPROPERTY(EditInstanceOnly, BlueprintReadWrite) class ACeilingLight* CeilingLightToToggle; void ToggleCeilingLight();
- Navigate to your **BPCommunicationCharacter.cpp**, and declare the following include. C++ ```
#include "CeilingLight.h"
``` #include "CeilingLight.h"
- Implement your **ABPCommunicationCharacter::ToggleCeilingLight** method. C++ ```
void ABPCommunicationCharacter::ToggleCeilingLight()
         {
             if (CeilingLightToToggle)
                 {
                   CeilingLightToToggle->TurnOffLight();
                 }
         }
``` void ABPCommunicationCharacter::ToggleCeilingLight() { if (CeilingLightToToggle) { CeilingLightToToggle->TurnOffLight(); } }
- Navigate to the **ABPCommunicationCharacter::SetupPlayerInputComponent** method and declare the following. C++ ```
PlayerInputComponent->BindAction("Use", IE_Pressed, this, &ABPCommunicationCharacter::ToggleCeilingLight);
``` PlayerInputComponent->BindAction("Use", IE_Pressed, this, &ABPCommunicationCharacter::ToggleCeilingLight);
- In the **Editor**, navigate to **Edit > Project Settings > Input**. From the **Bindings **category, navigate to the **Action Mappings** then click the **Add (+)** button to create a new **Action mapping** named **Use**, and select the **E** key for the **key value**.
- Compile your code.

## Finished Code

BPCommunicationCharacter.h

 C++

```
// Copyright Epic Games, Inc. All Rights Reserved.
	#pragma once

	#include "CoreMinimal.h"
	#include "GameFramework/Character.h"
	#include "BPCommunicationCharacter.generated.h"

	UCLASS(config=Game)
	class ABPCommunicationCharacter : public ACharacter
	{
```

BPCommunicationCharacter.cpp

 C++

```
// Copyright Epic Games, Inc. All Rights Reserved.
	#include "BPCommunicationCharacter.h"
	#include "HeadMountedDisplayFunctionLibrary.h"
	#include "Camera/CameraComponent.h"
	#include "Components/CapsuleComponent.h"
	#include "Components/InputComponent.h"
	#include "GameFramework/CharacterMovementComponent.h"
	#include "GameFramework/Controller.h"
	#include "GameFramework/SpringArmComponent.h"
	#include "CeilingLight.h"
```

## 3 - Interacting with the Lamp Blueprint

- Select your **ThirdPersonCharacter **Blueprint in the Level and position it closer to the lamp.
- With your **ThirdPersonCharacter **selected, navigate to the **Details **panel, then from the BPCommunication Character category, find the **Ceiling Light To Toggle **variable, and select the arrow adjacent to it. From the dropdown menu, search for and select the **BP_CeilingLight **Actor.
- Press **Play** to go into **PlE **(Play-in Editor) mode and press the **E key** to turn the lamp on and off.

### Section Results

In this section you added the Ceiling Light Actor reference to the **ThirdPersonCharacter **Blueprint and you turned the light on and off by pressing the E key.

## Next Steps

Now that you know how to use direct Blueprint communication type, take a look at the other communication types referenced in the documentation page.

- blueprints
- programming
- blueprint

On this page

- Overview (-> direct-actor-communication-quick-start-guide-in-unreal-engine)
- 1 - Required Setup (-> direct-actor-communication-quick-start-guide-in-unreal-engine)
- Section Results (-> direct-actor-communication-quick-start-guide-in-unreal-engine)
- 2 - Creating the Ceiling Light Actor (-> direct-actor-communication-quick-start-guide-in-unreal-engine)
- Finished Code (-> direct-actor-communication-quick-start-guide-in-unreal-engine)
- Modifying the ThirdPersonCharacter Class (-> direct-actor-communication-quick-start-guide-in-unreal-engine)
- Finished Code (-> direct-actor-communication-quick-start-guide-in-unreal-engine)
- 3 - Interacting with the Lamp Blueprint (-> direct-actor-communication-quick-start-guide-in-unreal-engine)
- Section Results (-> direct-actor-communication-quick-start-guide-in-unreal-engine)
- Next Steps (-> direct-actor-communication-quick-start-guide-in-unreal-engine)

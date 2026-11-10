# Casting Quick Start Guide

https://dev.epicgames.com/documentation/en-us/unreal-engine/casting-quick-start-guide-in-unreal-engine?application_version=5.9

> Quick Start for the Casting communication method.

[image: Casting Quick Start Guide]

Programming Language

×C++

Select an option from the dropdown to see content relevant to it.

## Overview

Casting Blueprint classes is a common communication type, in which you use a reference to an Actor class Blueprint and convert it to a different class. If this conversion is successful, then you can use Direct Blueprint communication to access its information and functionality.

This method requires a reference to the Actor class Blueprint in your Level so you can use the **Cast **node to try to convert it to a specific class. This communication type uses a one-to-one relationship between your working Actor class Blueprint to your target Actor class Blueprint.

In this Quick Start guide, you will learn how to create an Actor in C++, that has the Blueprint casting functionality used to access information from a target Blueprint.

## Setup

- Begin by creating a new **Games** > **Third Person** > **C++** project named **BPCommunication**.

## Creating a Rotating Actor

For this example, you will create an Actor class Blueprint that has the functionality to rotate its Static Mesh Component when the player is nearby.

- From the C++ Class Wizard (-> using-the-cplusplus-class-wizard-in-unreal-engine), create a new Actor class named **RotatingActor**.
- In the class defaults of your **RotatingActor.h** implement the following code. C++ ```
public:

            void SetbCanRotate(bool value);

        protected:

            // Called when the game starts or when spawned
            virtual void BeginPlay() override;
            void RotateActor();
            bool bCanRotate;
```
- Navigate to your **RotatingActor.cpp** and declare the following code in the constructor **ARotatingActor::ARotatingActor** C++ ```
ARotatingActor::ARotatingActor()
     {
         RootComponent = CreateDefaultSubobject<USceneComponent>(TEXT("SceneComponent"));
         MeshComp = CreateDefaultSubobject<UStaticMeshComponent>(TEXT("StaticMesh"));
         MeshComp->SetupAttachment(RootComponent, FAttachmentTransformRules::KeepRelativeTransform);
         bCanRotate = false;
     }
``` ARotatingActor::ARotatingActor() { RootComponent = CreateDefaultSubobject(TEXT("SceneComponent")); MeshComp = CreateDefaultSubobject(TEXT("StaticMesh")); MeshComp->SetupAttachment(RootComponent, FAttachmentTransformRules::KeepRelativeTransform); bCanRotate = false; }
- Implement the following code for your **ARotatingActor::RotateActor** method. C++ ```
void ARotatingActor::RotateActor()
     {
         AddActorLocalRotation(ActorRotation);
     }
``` void ARotatingActor::RotateActor() { AddActorLocalRotation(ActorRotation); }
- Navigate to the **ARotatingActor::Tick** method and implement the following code. C++ ```
void ARotatingActor::Tick(float DeltaTime)
         {
             Super::Tick(DeltaTime);

             if (bCanRotate)
             {
                 RotateActor();
             }
         }
``` void ARotatingActor::Tick(float DeltaTime) { Super::Tick(DeltaTime); if (bCanRotate) { RotateActor(); } }

## Finished Code

RotatingActor.h

 C++

```
#pragma once
	#include "CoreMinimal.h"
	#include "GameFramework/Actor.h"
	#include "RotatingActor.generated.h"

	UCLASS()
	class BPCOMMUNICATION_API ARotatingActor : public AActor
	{
	GENERATED_BODY()
```

RotatingActor.cpp

 C++

```
#include "RotatingActor.h"

	// Sets default values
	ARotatingActor::ARotatingActor()
	{
		// Set this actor to call Tick() every frame.  You can turn this off to improve performance if you don't need it.
		PrimaryActorTick.bCanEverTick = true;
		RootComponent = CreateDefaultSubobject<USceneComponent>(TEXT("SceneComponent"));
		MeshComp = CreateDefaultSubobject<UStaticMeshComponent>(TEXT("MeshComp"));
		MeshComp->SetupAttachment(RootComponent, FAttachmentTransformRules::KeepRelativeTransform);
```

- **Compile** your code.
- In the editor, navigate to your **C++ Classes folder**, right-click your **RotatingActor** and from the **C++ class actions** dropdown menu, select **Create Blueprint class based on RotatingActor** named **BP_RotatingActor**.
- In the class defaults for your **BP_RotatingActor** Blueprint, navigate to the **Components **tab, select the **MeshComp** **Static Mesh Component**, then navigate to the **Details panel **and from the **Static Mesh category**,** **select the arrow next to the **Static Mesh variable**. Lastly, from the dropdown menu, select the **Shape_Cube **static mesh.
- **Compile **and **save **your Blueprint.
- From the **Content Browser**, drag an instance of your **Bp_RotatingActor** into the Level.

## Modifying the Third Person Character Class

In this section, you will modify the **BPCommunicationCharacter **class** **to cast to the **Rotating Actor **class and set the **bCanRotate **variable to **True** when your player is nearby.

- Open your **BPCommunicationCharacter.h** and implement the following. C++ ```
protected:
             virtual void NotifyActorBeginOverlap(AActor* OtherActor);
             virtual void NotifyActorEndOverlap(AActor* OtherActor);
             class USphereComponent* SphereComp;
``` protected: virtual void NotifyActorBeginOverlap(AActor* OtherActor); virtual void NotifyActorEndOverlap(AActor* OtherActor); class USphereComponent* SphereComp;
- In your **BPCommunicationCharacter.cpp** include the following class libraries C++ ```
#include "RotatingActor.h"
         #include "Components/SphereComponent.h"
``` #include "RotatingActor.h" #include "Components/SphereComponent.h"
- From the constructor **ABPCommunicaionCharacter::BPCommunicationCharacter** declare the following code. C++ ```
SphereComp = CreateDefaultSubobject<USphereComponent>(TEXT("SphereComp"));
         SphereComp->AttachToComponent(GetMesh(), FAttachmentTransformRules::KeepRelativeTransform);
         SphereComp->SetSphereRadius(200);
``` SphereComp = CreateDefaultSubobject(TEXT("SphereComp")); SphereComp->AttachToComponent(GetMesh(), FAttachmentTransformRules::KeepRelativeTransform); SphereComp->SetSphereRadius(200);
- Next, implement the **ABPCommunicationCharacter::NotifyActorBeginOverlap**, and **ABPCommunicationCharacter::NotifyActorEndOverlap**. C++ ```
void ABPCommunicationCharacter::NotifyActorBeginOverlap(AActor* OtherActor)
         {
             if (ARotatingActor* RotatingActorCheck =Cast<ARotatingActor>(OtherActor))
             {
                 ActorCheck->SetbCanRotate(true);
             }
         }

         void ABPCommunicationCharacter::NotifyActorEndOverlap(AActor* OtherActor)
         {
```
- Compile your code.

## Finished Code

BpCommunicationCharacter.h

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
		GENERATED_BODY()
```

BpCommunication.cpp

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

- Press Play and approach the **BP_RotateActor **Actor to see it rotate only when the player is nearby.

## Next Steps

Now that you know how to use Blueprint casting, take a look at the other communication types referenced in the documentation page.

- blueprints
- programming
- blueprint

On this page

- Overview (-> casting-quick-start-guide-in-unreal-engine)
- Setup (-> casting-quick-start-guide-in-unreal-engine)
- Creating a Rotating Actor (-> casting-quick-start-guide-in-unreal-engine)
- Finished Code (-> casting-quick-start-guide-in-unreal-engine)
- Modifying the Third Person Character Class (-> casting-quick-start-guide-in-unreal-engine)
- Finished Code (-> casting-quick-start-guide-in-unreal-engine)
- Next Steps (-> casting-quick-start-guide-in-unreal-engine)

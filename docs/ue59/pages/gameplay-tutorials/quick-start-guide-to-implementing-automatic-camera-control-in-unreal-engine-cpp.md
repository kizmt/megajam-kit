# Game-Controlled Cameras

https://dev.epicgames.com/documentation/en-us/unreal-engine/quick-start-guide-to-implementing-automatic-camera-control-in-unreal-engine-cpp?application_version=5.9

> Learn to activate and switch between different view perspectives.

[image: Game-Controlled Cameras]

This tutorial will show you how to activate a camera, and change your active camera from one to another.

## 1 - Place Cameras in the World

If you are new to **Unreal Engine**, you might want to read our Programming Quick Start (-> unreal-engine-cpp-quick-start) first. For this tutorial, we will assume you are familiar with creating a project, adding C++ code to it, compiling your code, and adding **Components** to **Actors** in Unreal Engine.

- We will begin by creating a new Basic Code project, with starter content, named "HowTo_AutoCamera". The first thing we'll need to do is create two cameras in our world. Since there are multiple ways to set up cameras, we'll go with the two most common ways here. For our first camera, go to the **Place Actors** panel and select the **All Classes** tab, you'll find a **Camera** actor. Drag this into the **Level Editor** and position it so that it has a good view of our scene. When this is done, the **Level Editor** window will have a picture-in-picture view of what our new **Camera Actor** can see as long as we have the **Camera Actor** selected.

- For our second camera, we'll use a method that goes a little more in-depth and gives us a little more control. Start by clicking the **Basic** tab in the **Place Actors** panel, then drag a **Cube** into the **Level Editor** window. We can use almost any actor class for this step. The MyActor class we created in the Quick Start tutorial might be interesting to substitute for the Cube.

- When our **Cube** actor is placed, add a **CameraComponent** by clicking the **+ Add Component** button in the **Details** panel for the **Cube**. You can now set the position and rotation of that **CameraComponent** to give us a different view of the scene than the **CameraActor** we placed earlier.

- We should customize our **CameraComponent** by turning on **Constrain Aspect Ratio** so that it matches the setting on our **CameraActor**. This will make transitions between camera views smoother, but it is not required.

With our world set up, we're now ready to create the class that will control our camera view.

## 2 - Control Camera View in C++

- We're ready to create a C++ class to control our camera view. For this tutorial, we can extend **Actor** into a new class which we'll call CameraDirector.

- In CameraDirector.h, add the following code to the bottom of the ACameraDirector class definition: ```
        UPROPERTY(EditAnywhere)
        AActor* CameraOne;

        UPROPERTY(EditAnywhere)
        AActor* CameraTwo;

        float TimeToNextCameraChange;

``` UPROPERTY(EditAnywhere) AActor* CameraOne; UPROPERTY(EditAnywhere) AActor* CameraTwo; float TimeToNextCameraChange; The **UPROPERTY** macro makes our variables visible to **Unreal Engine**. This way, values set in these variables will not be reset when we launch the game or reload our level or project in a future work session. We have also added the **EditAnywhere** keyword, which will allow us to set CameraOne and CameraTwo in the **Unreal Editor**.

- In CameraDirector.cpp, add the following line of code to the top of the file, right underneath the other #include lines: ```
        #include "Kismet/GameplayStatics.h"

``` #include "Kismet/GameplayStatics.h" The GameplayStatics header file gives us access to some useful general-purpose functions, one of which we will need for this tutorial. When that is done, add the following code to the bottom of **ACameraDirector::Tick**: ```
    const float TimeBetweenCameraChanges = 2.0f;
    const float SmoothBlendTime = 0.75f;
    TimeToNextCameraChange -= DeltaTime;
    if (TimeToNextCameraChange <= 0.0f)
    {
        TimeToNextCameraChange += TimeBetweenCameraChanges;

        // Find the actor that handles control for the local player.
        APlayerController* OurPlayerController = UGameplayStatics::GetPlayerController(this, 0);
        if (OurPlayerController)
        {
            if ((OurPlayerController->GetViewTarget() != CameraOne) && (CameraOne != nullptr))
            {
                // Cut instantly to camera one.
                OurPlayerController->SetViewTarget(CameraOne);
            }
            else if ((OurPlayerController->GetViewTarget() != CameraTwo) && (CameraTwo != nullptr))
            {
                // Blend smoothly to camera two.
                OurPlayerController->SetViewTargetWithBlend(CameraTwo, SmoothBlendTime);
            }
        }
    }
``` const float TimeBetweenCameraChanges = 2.0f; const float SmoothBlendTime = 0.75f; TimeToNextCameraChange -= DeltaTime; if (TimeToNextCameraChange GetViewTarget() != CameraOne) && (CameraOne != nullptr)) { // Cut instantly to camera one. OurPlayerController->SetViewTarget(CameraOne); } else if ((OurPlayerController->GetViewTarget() != CameraTwo) && (CameraTwo != nullptr)) { // Blend smoothly to camera two. OurPlayerController->SetViewTargetWithBlend(CameraTwo, SmoothBlendTime); } } } This code will cause us to switch the default player's view between two different cameras every three seconds.

- Our code is now ready to be compiled, so we can return to the **Unreal Editor** and press the **Compile** button.

No further code is needed. We can set up our CameraDirector in our world now.

### Finished Code

**CameraDirector.h**

```
	// Copyright 1998-2017 Epic Games, Inc. All Rights Reserved.

	#pragma once

	#include "GameFramework/Actor.h"
	#include "CameraDirector.generated.h"

	UCLASS()
	class HOWTO_AUTOCAMERA_API ACameraDirector : public AActor
	{
		GENERATED_BODY()

	public:
		// Sets default values for this actor's properties
		ACameraDirector();

	protected:
		// Called when the game starts or when spawned
		virtual void BeginPlay() override;

	public:
		// Called every frame
		virtual void Tick( float DeltaSeconds ) override;

		UPROPERTY(EditAnywhere)
		AActor* CameraOne;

		UPROPERTY(EditAnywhere)
		AActor* CameraTwo;

		float TimeToNextCameraChange;
	};
```

// Copyright 1998-2017 Epic Games, Inc. All Rights Reserved.

 #pragma once

 #include "GameFramework/Actor.h"
 #include "CameraDirector.generated.h"

 UCLASS()
 class HOWTO_AUTOCAMERA_API ACameraDirector : public AActor
 {
 GENERATED_BODY()

 public:
 // Sets default values for this actor's properties
 ACameraDirector();

 protected:
 // Called when the game starts or when spawned
 virtual void BeginPlay() override;

 public:
 // Called every frame
 virtual void Tick( float DeltaSeconds ) override;

 UPROPERTY(EditAnywhere)
 AActor* CameraOne;

 UPROPERTY(EditAnywhere)
 AActor* CameraTwo;

 float TimeToNextCameraChange;
 };

**CameraDirector.cpp**

```
	// Copyright 1998-2017 Epic Games, Inc. All Rights Reserved.

	#include "HowTo_AutoCamera.h"
	#include "CameraDirector.h"
	#include "Kismet/GameplayStatics.h"

	// Sets default values
	ACameraDirector::ACameraDirector()
	{
		// Set this actor to call Tick() every frame.  You can turn this off to improve performance if you don't need it.
		PrimaryActorTick.bCanEverTick = true;

	}

	// Called when the game starts or when spawned
	void ACameraDirector::BeginPlay()
	{
		Super::BeginPlay();

	}

	// Called every frame
	void ACameraDirector::Tick( float DeltaTime )
	{
		Super::Tick( DeltaTime );

		const float TimeBetweenCameraChanges = 2.0f;
		const float SmoothBlendTime = 0.75f;
		TimeToNextCameraChange -= DeltaTime;
		if (TimeToNextCameraChange <= 0.0f)
		{
			TimeToNextCameraChange += TimeBetweenCameraChanges;

			//Find the actor that handles control for the local player.
			APlayerController* OurPlayerController = UGameplayStatics::GetPlayerController(this, 0);
			if (OurPlayerController)
			{
				if ((OurPlayerController->GetViewTarget() != CameraOne) && (CameraOne != nullptr))
				{
					//Cut instantly to camera one.
					OurPlayerController->SetViewTarget(CameraOne);
				}
				else if ((OurPlayerController->GetViewTarget() != CameraTwo) && (CameraTwo != nullptr))
				{
					//Blend smoothly to camera two.
					OurPlayerController->SetViewTargetWithBlend(CameraTwo, SmoothBlendTime);
				}
			}
		}
	}
```

// Copyright 1998-2017 Epic Games, Inc. All Rights Reserved.

 #include "HowTo_AutoCamera.h"
 #include "CameraDirector.h"
 #include "Kismet/GameplayStatics.h"

 // Sets default values
 ACameraDirector::ACameraDirector()
 {
 // Set this actor to call Tick() every frame. You can turn this off to improve performance if you don't need it.
 PrimaryActorTick.bCanEverTick = true;

 }

 // Called when the game starts or when spawned
 void ACameraDirector::BeginPlay()
 {
 Super::BeginPlay();

 }

 // Called every frame
 void ACameraDirector::Tick( float DeltaTime )
 {
 Super::Tick( DeltaTime );

 const float TimeBetweenCameraChanges = 2.0f;
 const float SmoothBlendTime = 0.75f;
 TimeToNextCameraChange -= DeltaTime;
 if (TimeToNextCameraChange <= 0.0f)
 {
 TimeToNextCameraChange += TimeBetweenCameraChanges;

 //Find the actor that handles control for the local player.
 APlayerController* OurPlayerController = UGameplayStatics::GetPlayerController(this, 0);
 if (OurPlayerController)
 {
 if ((OurPlayerController->GetViewTarget() != CameraOne) && (CameraOne != nullptr))
 {
 //Cut instantly to camera one.
 OurPlayerController->SetViewTarget(CameraOne);
 }
 else if ((OurPlayerController->GetViewTarget() != CameraTwo) && (CameraTwo != nullptr))
 {
 //Blend smoothly to camera two.
 OurPlayerController->SetViewTargetWithBlend(CameraTwo, SmoothBlendTime);
 }
 }
 }
 }

## 3 - Place a Camera Director in the World

- Once our code has compiled, we can drag an instance of our new class from the **Content Browser** into the **Level Editor**.

- Next, we'll need to set the CameraOne and CameraTwo variables. Find our CameraDirector in the **World Outliner** and edit it in the **Details Panel**. Click on the dropdown boxes labeled "None" and set our variables to the **Cube** and the **CameraActor** that we created earlier.

- If we press **Play**, we will see the camera snap to this view: And then blend smoothly to this view: Where it will wait a few seconds before snapping back.

We now have a system that moves the player's camera based purely on game logic. This code can be modified for use in any game where the player does not have direct control over the camera, or where blending between camera views is useful.

### Finished Code

**CameraDirector.h**

```
	// Copyright 1998-2017 Epic Games, Inc. All Rights Reserved.

	#pragma once

	#include "GameFramework/Actor.h"
	#include "CameraDirector.generated.h"

	UCLASS()
	class HOWTO_AUTOCAMERA_API ACameraDirector : public AActor
	{
		GENERATED_BODY()

	public:
		// Sets default values for this actor's properties
		ACameraDirector();

	protected:
		// Called when the game starts or when spawned
		virtual void BeginPlay() override;

	public:
		// Called every frame
		virtual void Tick( float DeltaSeconds ) override;

		UPROPERTY(EditAnywhere)
		AActor* CameraOne;

		UPROPERTY(EditAnywhere)
		AActor* CameraTwo;

		float TimeToNextCameraChange;
	};
```

// Copyright 1998-2017 Epic Games, Inc. All Rights Reserved.

 #pragma once

 #include "GameFramework/Actor.h"
 #include "CameraDirector.generated.h"

 UCLASS()
 class HOWTO_AUTOCAMERA_API ACameraDirector : public AActor
 {
 GENERATED_BODY()

 public:
 // Sets default values for this actor's properties
 ACameraDirector();

 protected:
 // Called when the game starts or when spawned
 virtual void BeginPlay() override;

 public:
 // Called every frame
 virtual void Tick( float DeltaSeconds ) override;

 UPROPERTY(EditAnywhere)
 AActor* CameraOne;

 UPROPERTY(EditAnywhere)
 AActor* CameraTwo;

 float TimeToNextCameraChange;
 };

**CameraDirector.cpp**

```
	// Copyright 1998-2017 Epic Games, Inc. All Rights Reserved.

	#include "HowTo_AutoCamera.h"
	#include "CameraDirector.h"
	#include "Kismet/GameplayStatics.h"

	// Sets default values
	ACameraDirector::ACameraDirector()
	{
		// Set this actor to call Tick() every frame.  You can turn this off to improve performance if you don't need it.
		PrimaryActorTick.bCanEverTick = true;

	}

	// Called when the game starts or when spawned
	void ACameraDirector::BeginPlay()
	{
		Super::BeginPlay();

	}

	// Called every frame
	void ACameraDirector::Tick( float DeltaTime )
	{
		Super::Tick( DeltaTime );

		const float TimeBetweenCameraChanges = 2.0f;
		const float SmoothBlendTime = 0.75f;
		TimeToNextCameraChange -= DeltaTime;
		if (TimeToNextCameraChange <= 0.0f)
		{
			TimeToNextCameraChange += TimeBetweenCameraChanges;

			//Find the actor that handles control for the local player.
			APlayerController* OurPlayerController = UGameplayStatics::GetPlayerController(this, 0);
			if (OurPlayerController)
			{
				if (CameraTwo && (OurPlayerController->GetViewTarget() == CameraOne))
				{
					//Blend smoothly to camera two.
					OurPlayerController->SetViewTargetWithBlend(CameraTwo, SmoothBlendTime);
				}
				else if (CameraOne)
				{
					//Cut instantly to camera one.
					OurPlayerController->SetViewTarget(CameraOne);
				}
			}
		}
	}
```

// Copyright 1998-2017 Epic Games, Inc. All Rights Reserved.

 #include "HowTo_AutoCamera.h"
 #include "CameraDirector.h"
 #include "Kismet/GameplayStatics.h"

 // Sets default values
 ACameraDirector::ACameraDirector()
 {
 // Set this actor to call Tick() every frame. You can turn this off to improve performance if you don't need it.
 PrimaryActorTick.bCanEverTick = true;

 }

 // Called when the game starts or when spawned
 void ACameraDirector::BeginPlay()
 {
 Super::BeginPlay();

 }

 // Called every frame
 void ACameraDirector::Tick( float DeltaTime )
 {
 Super::Tick( DeltaTime );

 const float TimeBetweenCameraChanges = 2.0f;
 const float SmoothBlendTime = 0.75f;
 TimeToNextCameraChange -= DeltaTime;
 if (TimeToNextCameraChange <= 0.0f)
 {
 TimeToNextCameraChange += TimeBetweenCameraChanges;

 //Find the actor that handles control for the local player.
 APlayerController* OurPlayerController = UGameplayStatics::GetPlayerController(this, 0);
 if (OurPlayerController)
 {
 if (CameraTwo && (OurPlayerController->GetViewTarget() == CameraOne))
 {
 //Blend smoothly to camera two.
 OurPlayerController->SetViewTargetWithBlend(CameraTwo, SmoothBlendTime);
 }
 else if (CameraOne)
 {
 //Cut instantly to camera one.
 OurPlayerController->SetViewTarget(CameraOne);
 }
 }
 }
 }

## 4 - On Your Own!

Using what you have learned, try to do the following:

- Attach a Camera to a moving Actor to create a crane or dolly shot.

- Use a single Array (-> array-containers-in-unreal-engine) variable to store your cameras, instead of CameraOne and CameraTwo, so you can go through a sequence of any number of cameras, instead of just two.

- Instead of using Actor (-> actors-in-unreal-engine) pointers to store your cameras, create a Structure that holds the pointer, as well as time before changing the view, and blend time to the new view.

As for the specifics covered in this tutorial:

- For more information on Cameras and ways to control them, see the Camera (-> cameras-in-unreal-engine) framework page, or try the Player-Controlled Cameras (-> quick-start-guide-to-player-controlled-cameras-in-unreal-engine-cpp) tutorial.

- For further tutorials, see the C++ Programming Tutorials (-> unreal-engine-cpp-programming-tutorials) page.

- programming

On this page

- 1 - Place Cameras in the World (-> quick-start-guide-to-implementing-automatic-camera-control-in-unreal-engine-cpp)
- 2 - Control Camera View in C++ (-> quick-start-guide-to-implementing-automatic-camera-control-in-unreal-engine-cpp)
- Finished Code (-> quick-start-guide-to-implementing-automatic-camera-control-in-unreal-engine-cpp)
- 3 - Place a Camera Director in the World (-> quick-start-guide-to-implementing-automatic-camera-control-in-unreal-engine-cpp)
- Finished Code (-> quick-start-guide-to-implementing-automatic-camera-control-in-unreal-engine-cpp)
- 4 - On Your Own! (-> quick-start-guide-to-implementing-automatic-camera-control-in-unreal-engine-cpp)

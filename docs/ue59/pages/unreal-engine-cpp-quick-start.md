# Programming Quick Start

https://dev.epicgames.com/documentation/en-us/unreal-engine/unreal-engine-cpp-quick-start?application_version=5.9

> Create your first code project and add a new C++ class.

[image: Programming Quick Start]

###### Prerequisite topics

In order to understand and use the content on this page, make sure you are familiar with the following topics:

- Content Browser Interface (-> content-browser-interface-in-unreal-engine)

Windows
 macOS
 Linux

In this Quick Start Guide, you will learn how to set up a C++ project in the Unreal Engine and program your first C++ gameplay class in Visual Studio. By the time you've completed this tutorial, you will know how to do the following:

- Create a new C++ Project

- Create a new Actor class in C++

- Edit that C++ class in your development environment, adding visual representation and functionality

- Compile your project

- Test your new Actor in the Unreal Editor

This guide assumes that you have already set up Visual Studio as your programming environment. If not, please refer to Setting Up Visual Studio for the Unreal Engine for instructions on how to install it and get it set up for programming with the Unreal Engine. We also assume that you have some familiarity with using the **Unreal Editor** before starting this guide, but for your convenience we will walk through all the steps necessary to create and manage C++ classes from the editor. The end product of this guide will be a cube that floats softly in mid-air and continually rotates, giving you a simple object to test as you learn to use the development environment for programming.

This guide assumes that you have already set up XCode as your programming environment. We also assume that you have some familiarity with using the **Unreal Editor** before starting this guide, but for your convenience we will walk through all the steps necessary to create and manage C++ classes from the editor. The end product of this guide will be a cube that floats softly in mid-air and continually rotates, giving you a simple object to test as you learn to use the development environment for programming.

## 1. Required Setup

Launch the **Unreal Editor**. When the **Project Browser** comes up, click **Games** Project category and select a **Blank** template. Make sure that you have **C++** and **Starter Content** enabled, choose your preferred **Save Location** and **Name** for this project, and then click **Create Project**. In our instance, we're naming our project QuickStart.

This will automatically create a simple, blank project with only essential C++ code in the solution, and it will automatically open inside both the Unreal Editor and Visual Studio. For more information on managing and creating Projects, please refer to the Project Browser (-> creating-a-new-project-in-unreal-engine) page.

This will automatically create a simple, blank project with only essential C++ code in the solution, and it will automatically open inside both the Unreal Editor and XCode. For more information on managing and creating Projects, please refer to the Project Browser (-> creating-a-new-project-in-unreal-engine) page.

Any Blueprint project can be converted to a C++ project. If you have a Blueprint project that you want to add C++ to, create a new C++ class per the next section, and the editor will set up your code environment for you.
Also note that using a C++ project does not prevent you from using Blueprint. C++ projects simply set up the base classes for your project in C++ instead of Blueprint.

## 2. Create a New C++ Class

- In the **Unreal Editor**, click the **File** drop-down menu, then select the **New C++ Class...** command. Click image for full size.

- The **Choose Parent Class** menu will display. You can choose an existing class to extend, adding its functionality to your own. Choose **Actor**, as it is the most basic type of object that can be placed in the world, then click **Next**. Click image for full size.

- In the **Name Your New Actor** menu, name your Actor **FloatingActor** and click **Create Class**. Click image for full size. The Unreal Engine will automatically compile and reload with our new class selected in the Content Browser, and your programming environment will automatically open with `FloatingActor.cpp`.

## 3. Edit Your C++ Class

Now that we have created our C++ Class, we're going to switch over to Visual Studio and edit our code.

- In **Visual Studio**, locate the **Solution Explorer**, which by default is on the left side of the window, then use it to locate `FloatingActor.h`. In our project, it will be located under **Games > QuickStart > Source > QuickStart**. [image: Solution Explorer]

- Double-click `FloatingActor.h` to open it and bring it into focus in the text editor. [image: Open Header File] This is a header file. You can think of it as being sort of like a table of contents for a C++ class. Before we can start building any new functionality, we must declare any new **Variables** or **Functions** that we're using in this file.

- Add the following code underneath the declaration for **AFloatingActor()**: ```
         UPROPERTY(VisibleAnywhere)
         UStaticMeshComponent* VisualMesh;

``` UPROPERTY(VisibleAnywhere) UStaticMeshComponent* VisualMesh; Here we're declaring a **StaticMeshComponent**, which will act as our visual representation for our object. Note that it uses a **UProperty** macro, which makes it visible inside the Unreal Editor. For more information on UProperty and its specifiers, see the page on Properties (-> unreal-engine-uproperties).

- Now open `FloatingActor.cpp` and add the following code inside of **AFloatingActor::AFloatingActor()**, just before the closing bracket: ```
         VisualMesh = CreateDefaultSubobject<UStaticMeshComponent>(TEXT("Mesh"));
         VisualMesh->SetupAttachment(RootComponent);

         static ConstructorHelpers::FObjectFinder<UStaticMesh> CubeVisualAsset(TEXT("/Game/StarterContent/Shapes/Shape_Cube.Shape_Cube"));

         if (CubeVisualAsset.Succeeded())
         {
             VisualMesh->SetStaticMesh(CubeVisualAsset.Object);
             VisualMesh->SetRelativeLocation(FVector(0.0f, 0.0f, 0.0f));
         }

``` VisualMesh = CreateDefaultSubobject(TEXT("Mesh")); VisualMesh->SetupAttachment(RootComponent); static ConstructorHelpers::FObjectFinder CubeVisualAsset(TEXT("/Game/StarterContent/Shapes/Shape_Cube.Shape_Cube")); if (CubeVisualAsset.Succeeded()) { VisualMesh->SetStaticMesh(CubeVisualAsset.Object); VisualMesh->SetRelativeLocation(FVector(0.0f, 0.0f, 0.0f)); } This function is the constructor, and it tells the class how to initialize itself when it is first created. The code we have added will fill our VisualMesh reference in with a new StaticMeshComponent, attach it to our Actor, and set it to the cube mesh from the **Starter Content** assets. For more information about attaching components in code, refer to our guide for Creating and Attaching Components (-> quick-start-guide-to-components-and-collision-in-unreal-engine-cpp).

- Add the following code inside of **AFloatingActor::Tick(float DeltaTime)**, just before the closing bracket: ```
         FVector NewLocation = GetActorLocation();
         FRotator NewRotation = GetActorRotation();
         float RunningTime = GetGameTimeSinceCreation();
         float DeltaHeight = (FMath::Sin(RunningTime + DeltaTime) - FMath::Sin(RunningTime));
         NewLocation.Z += DeltaHeight * 20.0f;       //Scale our height by a factor of 20
         float DeltaRotation = DeltaTime * 20.0f;	//Rotate by 20 degrees per second
         NewRotation.Yaw += DeltaRotation;
         SetActorLocationAndRotation(NewLocation, NewRotation);

``` FVector NewLocation = GetActorLocation(); FRotator NewRotation = GetActorRotation(); float RunningTime = GetGameTimeSinceCreation(); float DeltaHeight = (FMath::Sin(RunningTime + DeltaTime) - FMath::Sin(RunningTime)); NewLocation.Z += DeltaHeight * 20.0f; //Scale our height by a factor of 20 float DeltaRotation = DeltaTime * 20.0f; //Rotate by 20 degrees per second NewRotation.Yaw += DeltaRotation; SetActorLocationAndRotation(NewLocation, NewRotation); The **Tick** function is where we add code that we want to execute in real-time. In this case, it will make our cube simultaneously rotate while also floating up and down. For more information about Ticking actors, see Actor Ticking (-> actor-ticking-in-unreal-engine).

Now that we have created our C++ Class, we're going to switch over to XCode and edit our code.

- In **XCode**, locate the **Project Navigator**, which by default is on the left side of the window, then use it to locate `FloatingActor.h`. In our project, it will be located under **Games > QuickStart > Source > QuickStart**. [image: Solution Explorer]

- Double-click `FloatingActor.h` to open it and bring it into focus in the text editor. This is a header file. You can think of it as a table of contents for a C++ class. Before we can start building any new functionality, we must declare any new **Variables** or **Functions** that we're using in this file.

- Add the following code underneath the declaration for **AFloatingActor()**: ```
         UPROPERTY(VisibleAnywhere)
         UStaticMeshComponent* VisualMesh;

``` UPROPERTY(VisibleAnywhere) UStaticMeshComponent* VisualMesh; Here we're declaring a **StaticMeshComponent**, which will act as our visual representation for our object. Note that it uses a **UProperty** macro, which makes it visible inside the Unreal Editor. For more information on UProperty and its specifiers, see the page on Properties (-> unreal-engine-uproperties).

- Now open `FloatingActor.cpp` and add the following code inside of **AFloatingActor::AFloatingActor()**, just before the closing bracket: ```
         VisualMesh = CreateDefaultSubobject<UStaticMeshComponent>(TEXT("Mesh"));
         VisualMesh->SetupAttachment(RootComponent);

         static ConstructorHelpers::FObjectFinder<UStaticMesh> CubeVisualAsset(TEXT("/Game/StarterContent/Shapes/Shape_Cube.Shape_Cube"));

         if (CubeVisualAsset.Succeeded())
         {
             VisualMesh->SetStaticMesh(CubeVisualAsset.Object);
             VisualMesh->SetRelativeLocation(FVector(0.0f, 0.0f, 0.0f));
         }

``` VisualMesh = CreateDefaultSubobject(TEXT("Mesh")); VisualMesh->SetupAttachment(RootComponent); static ConstructorHelpers::FObjectFinder CubeVisualAsset(TEXT("/Game/StarterContent/Shapes/Shape_Cube.Shape_Cube")); if (CubeVisualAsset.Succeeded()) { VisualMesh->SetStaticMesh(CubeVisualAsset.Object); VisualMesh->SetRelativeLocation(FVector(0.0f, 0.0f, 0.0f)); } This function is the constructor, and it tells the class how to initialize itself when it is first created. The code we have added will fill our VisualMesh reference in with a new StaticMeshComponent, attach it to our Actor, and set it to the cube mesh from the **Starter Content** assets. For more information about attaching components in code, refer to our guide for Creating and Attaching Components (-> quick-start-guide-to-components-and-collision-in-unreal-engine-cpp).

- Add the following code inside of **AFloatingActor::Tick(float DeltaTime)**, just before the closing bracket: ```
         FVector NewLocation = GetActorLocation();
         FRotator NewRotation = GetActorRotation();
         float RunningTime = GetGameTimeSinceCreation();
         float DeltaHeight = (FMath::Sin(RunningTime + DeltaTime) - FMath::Sin(RunningTime));
         NewLocation.Z += DeltaHeight * 20.0f;       //Scale our height by a factor of 20
         float DeltaRotation = DeltaTime * 20.0f;	//Rotate by 20 degrees per second
         NewRotation.Yaw += DeltaRotation;
         SetActorLocationAndRotation(NewLocation, NewRotation);

``` FVector NewLocation = GetActorLocation(); FRotator NewRotation = GetActorRotation(); float RunningTime = GetGameTimeSinceCreation(); float DeltaHeight = (FMath::Sin(RunningTime + DeltaTime) - FMath::Sin(RunningTime)); NewLocation.Z += DeltaHeight * 20.0f; //Scale our height by a factor of 20 float DeltaRotation = DeltaTime * 20.0f; //Rotate by 20 degrees per second NewRotation.Yaw += DeltaRotation; SetActorLocationAndRotation(NewLocation, NewRotation); The **Tick** function is where we add code that we want to execute in real-time. In this case, it will make our cube simultaneously rotate while also floating up and down. For more information about Ticking actors, see Actor Ticking (-> actor-ticking-in-unreal-engine).

## 4. Compile and Test Your C++ Code

- **Save** your work in both `FloatingActor.h` and `FloatingActor.cpp`. Then, in the **Solution Explorer**, right-click the project, click the **Build** command in the context menu, and wait for the project to finish compiling. You should see a message that says "Succeeded" in the **Output** log at the bottom of the window. Alternatively, you can go back to the **Unreal Editor** and click the **Compile** button in the toolbar at the top of the screen.

You should always save your work before attempting to compile, otherwise the changes you make in your code will not take effect.

- In the **Unreal Editor**, go back to the **Content Browser**, unfold **C++ Classes**, and then locate **FloatingActor**. It will be located in the folder that has the same name as your project, in our case, QuickStart.

- Click and drag **FloatingActor** into the **Perspective Viewport** to create an instance of FloatingActor. It will be selected in the **World Outliner** as "FloatingActor1" and its properties will be visible in the **Details Panel**. For more information about navigating the Viewport and placing Actors in the World, refer to the Level Designer Quick Start (-> level-designer-quick-start-in-unreal-engine).

- In the **Details Panel** for **FloatingActor1**, set your Actor's **Location** to (-180, 0, 180). This will place it directly over the table in the default scene. Alternatively, you can use the Move gizmo to move it there manually.

- Press the **Play In Editor** button at the top of the screen.

- **Save** your work in both `FloatingActor.h` and `FloatingActor.cpp`. Then, click the **Product** drop-down menu at the top of the screen, select the **Build** command, and wait for the project to finish building. You should see a message that says "Succeeded" in the **Output** log at the bottom of the window. Alternatively, you can go back to the **Unreal Editor** and click the **Compile** button in the toolbar at the top of the screen.

You should always save your work before attempting to compile, otherwise the changes you make in your code will not take effect.

- In the **Unreal Editor**, go back to the **Content Browser**, unfold **C++ Classes**, and then locate **FloatingActor**. It will be located in the folder that has the same name as your project, in our case, QuickStart.

- Click and drag **FloatingActor** into the **Perspective Viewport** to create an instance of FloatingActor. It will be selected in the **World Outliner** as "FloatingActor1" and its properties will be visible in the **Details Panel**. For more information about navigating the Viewport and placing Actors in the World, refer to the Level Designer Quick Start (-> level-designer-quick-start-in-unreal-engine).

- In the **Details Panel** for **FloatingActor1**, set your Actor's **Location** to (-180, 0, 180). This will place it directly over the table in the default scene. Alternatively, you can use the Move gizmo to move it there manually.

- Press the **Play In Editor** button at the top of the screen.

## 5. End Result

You should now see your cube gently floating up and down over the table while it slowly rotates.

Congratulations! You've created your first Actor class entirely with C++! While this represents a very simple object and only scratches the surface of what you can do with C++ source code,
you have at this point touched on all the essentials of creating, editing, and compiling C++ code for your game. You are now ready for more complex gameplay programming challenges, and we suggest a few below.

## 6. On Your Own!

Now that you know how to build a simple C++ Actor, try making it more configurable. For instance, you can add variables to control its behavior:

In **FloatingActor.h**:

```
	...
	public:
		UPROPERTY(EditAnywhere, BlueprintReadWrite, Category="FloatingActor")
		float FloatSpeed = 20.0f;

		UPROPERTY(EditAnywhere, BlueprintReadWrite, Category="FloatingActor")
		float RotationSpeed = 20.0f;
	...
```

...
 public:
 UPROPERTY(EditAnywhere, BlueprintReadWrite, Category="FloatingActor")
 float FloatSpeed = 20.0f;

 UPROPERTY(EditAnywhere, BlueprintReadWrite, Category="FloatingActor")
 float RotationSpeed = 20.0f;
 ...

In **FloatingActor.cpp**:

```
	...
	NewLocation.Z += DeltaHeight * FloatSpeed;			//Scale our height by FloatSpeed
	float DeltaRotation = DeltaTime * RotationSpeed;	//Rotate by a number of degrees equal to RotationSpeed each second
	...
```

...
 NewLocation.Z += DeltaHeight * FloatSpeed; //Scale our height by FloatSpeed
 float DeltaRotation = DeltaTime * RotationSpeed; //Rotate by a number of degrees equal to RotationSpeed each second
 ...

By adding these variables in the header and replacing the float values we were using to scale DeltaHeight and DeltaRotation in the .cpp, we can now edit the float and rotation speed in the **Details Panel** when we select our Actor.

You can experiment by adding other kinds of behavior to the Tick function using Location, Rotation, and Scale.

You can also try attaching other kinds of components in C++ to create a more complex object. Refer to the Creating and Attaching Components (-> quick-start-guide-to-components-and-collision-in-unreal-engine-cpp) guide for examples of different types of components you have available,
and try adding a Particle System Component to add a bit of flare to your floating object.

Finally, if you right-click your own Actor class in the **Content Browser**, you will find the option to extend it, either in C++ or in Blueprint, enabling you to create new variations of it.

You can have a whole library of FloatingActors, each substituting different Meshes or parameters as you so choose.

## Sample Code

**FloatingActor.h**

```
	// Copyright 1998-2019 Epic Games, Inc. All Rights Reserved.

	#pragma once

	#include "CoreMinimal.h"
	#include "GameFramework/Actor.h"
	#include "FloatingActor.generated.h"

	UCLASS()
	class QUICKSTART_API AFloatingActor : public AActor
	{
		GENERATED_BODY()

	public:
		// Sets default values for this actor's properties
		AFloatingActor();

		UPROPERTY(VisibleAnywhere)
		UStaticMeshComponent* VisualMesh;

	protected:
		// Called when the game starts or when spawned
		virtual void BeginPlay() override;

	public:
		// Called every frame
		virtual void Tick(float DeltaTime) override;

	};
```

// Copyright 1998-2019 Epic Games, Inc. All Rights Reserved.

 #pragma once

 #include "CoreMinimal.h"
 #include "GameFramework/Actor.h"
 #include "FloatingActor.generated.h"

 UCLASS()
 class QUICKSTART_API AFloatingActor : public AActor
 {
 GENERATED_BODY()

 public:
 // Sets default values for this actor's properties
 AFloatingActor();

 UPROPERTY(VisibleAnywhere)
 UStaticMeshComponent* VisualMesh;

 protected:
 // Called when the game starts or when spawned
 virtual void BeginPlay() override;

 public:
 // Called every frame
 virtual void Tick(float DeltaTime) override;

 };

**FloatingActor.cpp**

```
	// Copyright 1998-2019 Epic Games, Inc. All Rights Reserved.

	#include "FloatingActor.h"

	// Sets default values
	AFloatingActor::AFloatingActor()
	{
		// Set this actor to call Tick() every frame.  You can turn this off to improve performance if you don't need it.
		PrimaryActorTick.bCanEverTick = true;

		VisualMesh = CreateDefaultSubobject<UStaticMeshComponent>(TEXT("Mesh"));
		VisualMesh->SetupAttachment(RootComponent);

		static ConstructorHelpers::FObjectFinder<UStaticMesh> CubeVisualAsset(TEXT("/Game/StarterContent/Shapes/Shape_Cube.Shape_Cube"));

		if (CubeVisualAsset.Succeeded())
		{
			VisualMesh->SetStaticMesh(CubeVisualAsset.Object);
			VisualMesh->SetRelativeLocation(FVector(0.0f, 0.0f, 0.0f));
		}
	}

	// Called when the game starts or when spawned
	void AFloatingActor::BeginPlay()
	{
		Super::BeginPlay();

	}

	// Called every frame
	void AFloatingActor::Tick(float DeltaTime)
	{
		Super::Tick(DeltaTime);

		FVector NewLocation = GetActorLocation();
		FRotator NewRotation = GetActorRotation();
		float RunningTime = GetGameTimeSinceCreation();
		float DeltaHeight = (FMath::Sin(RunningTime + DeltaTime) - FMath::Sin(RunningTime));
		NewLocation.Z += DeltaHeight * 20.0f;       //Scale our height by a factor of 20
		float DeltaRotation = DeltaTime * 20.0f;	//Rotate by 20 degrees per second
		NewRotation.Yaw += DeltaRotation;
		SetActorLocationAndRotation(NewLocation, NewRotation);
	}
```

// Copyright 1998-2019 Epic Games, Inc. All Rights Reserved.

 #include "FloatingActor.h"

 // Sets default values
 AFloatingActor::AFloatingActor()
 {
 // Set this actor to call Tick() every frame. You can turn this off to improve performance if you don't need it.
 PrimaryActorTick.bCanEverTick = true;

 VisualMesh = CreateDefaultSubobject<UStaticMeshComponent>(TEXT("Mesh"));
 VisualMesh->SetupAttachment(RootComponent);

 static ConstructorHelpers::FObjectFinder<UStaticMesh> CubeVisualAsset(TEXT("/Game/StarterContent/Shapes/Shape_Cube.Shape_Cube"));

 if (CubeVisualAsset.Succeeded())
 {
 VisualMesh->SetStaticMesh(CubeVisualAsset.Object);
 VisualMesh->SetRelativeLocation(FVector(0.0f, 0.0f, 0.0f));
 }
 }

 // Called when the game starts or when spawned
 void AFloatingActor::BeginPlay()
 {
 Super::BeginPlay();

 }

 // Called every frame
 void AFloatingActor::Tick(float DeltaTime)
 {
 Super::Tick(DeltaTime);

 FVector NewLocation = GetActorLocation();
 FRotator NewRotation = GetActorRotation();
 float RunningTime = GetGameTimeSinceCreation();
 float DeltaHeight = (FMath::Sin(RunningTime + DeltaTime) - FMath::Sin(RunningTime));
 NewLocation.Z += DeltaHeight * 20.0f; //Scale our height by a factor of 20
 float DeltaRotation = DeltaTime * 20.0f; //Rotate by 20 degrees per second
 NewRotation.Yaw += DeltaRotation;
 SetActorLocationAndRotation(NewLocation, NewRotation);
 }

- programming
- c++

On this page

- 1. Required Setup (-> unreal-engine-cpp-quick-start)
- 2. Create a New C++ Class (-> unreal-engine-cpp-quick-start)
- 3. Edit Your C++ Class (-> unreal-engine-cpp-quick-start)
- 4. Compile and Test Your C++ Code (-> unreal-engine-cpp-quick-start)
- 5. End Result (-> unreal-engine-cpp-quick-start)
- 6. On Your Own! (-> unreal-engine-cpp-quick-start)
- Sample Code (-> unreal-engine-cpp-quick-start)

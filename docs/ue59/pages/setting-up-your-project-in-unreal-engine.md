# Setting up your Project

https://dev.epicgames.com/documentation/en-us/unreal-engine/setting-up-your-project-in-unreal-engine?application_version=5.9

> How to set up your First Person Shooter project.

[image: Setting up your Project]

 This is what you will see at the end of this section.

## Goals

The purpose of this section is to show you how to set up your First Person Shooter project.

## Objectives

By the end of this section of the tutorial, you will be able to:

- Set Up a New Project
- Set the Editor Startup Map
- Open Your Project in Visual Studio
- Add Log Messaging to Your Project
- Compile Your First C++ Class
- Set the Default Game Mode

## Steps

- 1.1 - Project Setup
- 1.2 - Opening the Project in Visual Studio
- 1.3 - Adding Log Messaging
- 1.4 - Compiling the Project
- 1.5 - Setting the Default Game Mode
- 1.6 - Section One Summary

## 1.1 - Project Setup

During this step, you are going to create a starting point for our First Person Shooter (FPS) game by using the Unreal Engine.

- Open **Unreal Engine** from the Epic Launcher and create a New Project (-> creating-a-new-project-in-unreal-engine).
- Select the **Games** project category.
- Select the **Blank** template.
- Select the **C++** project type (instead of **Blueprint**).
- Disable the **Starter Content**.
- Name your project **FPSProject**.
- After you have named your project, go ahead and click the **Create** button. Project should automatically open in the Unreal Editor. Click image to expand. Some of the code samples in this tutorial will need to be updated if you name your project differently.
- Navigate to the **Content Browser** and go to the **Engine > Content > Maps > Templates**, double-click the **Template_Default** Level to open this.
- Click the **Play** button in the **Level Editor Toolbar** to start **Play in Editor** (PIE) mode. Use the WASD keys to move around the Level while using your mouse to aim the camera.
- Press the **Shift + Escape** or click **Stop** in the **Level Editor Toolbar** to exit PIE mode.
- Now that you are done exploring the Level, navigate to the **Content Browser** and create a **Maps** folder under the **Content** folder (Select the **Content** folder, right-click in the file window of the **Content Browser**, and select **New Folder**).
- Click the **File** in the **Main** menu panel, select **Save Current Level as...**
- Select the **Maps** folder in the **Save Level As** window, name your new map **FPSMap** and click **Save**.
- Click the **Edit** in the **Main** menu panel and select **Project Settings**.
- Navigate to the **Project** section on the left side of the **Project Settings** tab, click on **Maps & Modes**. Expand the **Editor Startup Map** dropdown menu, and select **FPSMap**. With this setings, the Editor will automatically load FPSMap as the default map.
- Finally, close the **Project Settings** menu and save your project before moving onto the next step.

## 1.2 - Opening the Project in Visual Studio

When you set up your **Basic Code** project in the previous step, Unreal Engine created a **Game Mode** for you. Game Modes define a game's rules and win conditions. The Game Mode also sets default classes that will be used for some basic gameplay framework types, including Pawn, PlayerController, and HUD. During this section, you are going to use the Editor to open your project as a solution in **Visual Studio** so that you can view your project's Game Mode class.

- Click the **Tools** in the **Main** menu panel and select **Open Visual Studio** to open your C++ code in Visual Studio.
- After Visual Studio launches your project, you should see the `.cpp` and `.h` files inside of Visual Studio's **Solution Explorer**.Do not be alarmed if Visual Studio in the example images looks a little different than yours, in this examples Dark Mode are used. You can enable this by going to: **Tools > Options > Environment > General > Color Theme**.
- Expand **Source** and then **FPSProject** to view the main files for your new game.
- Open `FPSProjectGameModeBase.cpp`. It should look like the following: C++ FPSProjectGameModeBase.cpp ```
// Copyright Epic Games, Inc. All Rights Reserved.

    #include "FPSProjectGameModeBase.h"
``` // Copyright Epic Games, Inc. All Rights Reserved. #include "FPSProjectGameModeBase.h"
- Now open `FPSProjectGameModeBase.h`. It should look like the following: C++ FPSProjectGameModeBase.h ```
// Copyright Epic Games, Inc. All Rights Reserved.

    #pragma once

    #include "CoreMinimal.h"
    #include "GameFramework/GameModeBase.h"
    #include "FPSProjectGameModeBase.generated.h"

    /**
     *
```
- Now that you have opened your C++ project in Visual Studio, you are ready to start adding code to the project.

## 1.3 - Adding Log Messaging

A great way to start adding code to your project is by adding a log message to **FPSGameMode**. Log messages are really useful for verifying and debugging code during development. During this step, you will use a log message to verify that you are actually using **FPSGameMode** rather than the default Game Mode provided by Unreal Engine.

### FPSProjectGameMode Header File

- In the **Solution Explorer**, go to **FPSProject > Source > FPSProject**.
- Double-click `FPSProjectGameModeBase.h` to open the header file for your **FPSGameMode** class.
- Your class declaration should look like the following: C++ FPSProjectGameModeBase.h ```
UCLASS()
    class FPSPROJECT_API AFPSProjectGameModeBase : public AGameModeBase
    {
        GENERATED_BODY()

    };
``` UCLASS() class FPSPROJECT_API AFPSProjectGameModeBase : public AGameModeBase { GENERATED_BODY() };
- Add the following function declaration under the `AFPSProjectGameMode` constructor declaration: C++ FPSProjectGameModeBase.h ```
virtual void StartPlay() override;
``` virtual void StartPlay() override;This function declaration allows you to override StartPlay (-> API) so that you can print a log message to the screen when gameplay begins.
- `FPSProjectGameMode.h` should now look like the following: C++ FPSProjectGameModeBase.h ```
// Copyright Epic Games, Inc. All Rights Reserved.

    #pragma once

    #include "CoreMinimal.h"
    #include "GameFramework/GameModeBase.h"
    #include "FPSProjectGameModeBase.generated.h"

    /**
     *
```
- Save your `FPSProjectGameMode.h` header file in Visual Studio.

### FPSProjectGameMode CPP File

- In the **Solution Explorer**, go to **FPSProject > Source > FPSProject**.
- Double-click `FPSProjectGameModeBase.cpp` to open the implementation file for your **FPSGameModeBase** class.
- Now add the following lines of code to the file: C++ FPSProjectGameModeBase.cpp ```
void AFPSProjectGameModeBase::StartPlay()
    {
        Super::StartPlay();

        check(GEngine != nullptr);

        // Display a debug message for five seconds.
        // The -1 "Key" value argument prevents the message from being updated or refreshed.
        GEngine->AddOnScreenDebugMessage(-1, 5.0f, FColor::Yellow, TEXT("Hello World, this is FPSGameMode!"));
    }
``` void AFPSProjectGameModeBase::StartPlay() { Super::StartPlay(); check(GEngine != nullptr); // Display a debug message for five seconds. // The -1 "Key" value argument prevents the message from being updated or refreshed. GEngine->AddOnScreenDebugMessage(-1, 5.0f, FColor::Yellow, TEXT("Hello World, this is FPSGameMode!")); }`StartPlay()` will print a new debug message ("Hello World, this is FPSGameModeBase!") to the screen in yellow text for five seconds when gameplay begins.
- `FPSProjectGameModeBase.cpp` should now look like the following: C++ FPSProjectGameModeBase.cpp ```
// Copyright Epic Games, Inc. All Rights Reserved.

    #include "FPSProjectGameMode.h"

    void AFPSProjectGameModeBase::StartPlay()
    {
        Super::StartPlay();

        check(GEngine != nullptr);

```
- Save your `FPSProjectGameModeBase.cpp` implementation file in Visual Studio.

## 1.4 - Compiling the Project

Now is a good time to compile your project so that you can see your code changes reflected in-game.

- Going back to the Editor, click the **Compile** button to compile your code. Since you started developing your project as a C++ project, you are able to compile your C++ code directly from Unreal Editor. Click for full image.
- Click the **Play** button in the **Level Editor Toolbar** to start Play in Editor (PIE) mode.You might be wondering why your log message is not being displayed on screen when you are in PIE mode. The reason you are not seeing your log message is because the Editor is still using the default Game Mode at this stage in development.
- Press the **Shift + Escape** or click **Stop** in the **Level Editor Toolbar** to exit PIE mode..

### Extending your C++ Game Mode Class to Blueprints

Now is a good time to extend the C++ Game Mode class to Blueprints. Please feel free to go to the C++ and Blueprints (-> cpp-and-blueprints-example) reference page to learn more about extending
C++ classes to Blueprints.

- Create a **Blueprints** folder inside of the **Content** folder.
- Right-click the **FPSProjectGameModeBase** class (in **C++ Classes > FPSProject**) to open the **C++ Class Actions** menu.
- Click **Create Blueprint class based on FPSProjectGameModeBase** to open the **Add Blueprint Class** dialog menu.
- Name your new Blueprint Class **BP_FPSProjectGameModeBase** and choose the **Blueprints** folder, click the **Create Blueprint Class** button.
- As a result, you should have a newly created **BP_FPSProjectGameModeBase** Blueprint Class located inside of the **Blueprints** folder.
- Make sure to save your **BP_FPSProjectGameModeBase** Blueprint before closing the **Blueprint Editor**.

## 1.5 - Setting the Default Game Mode

Now that you have successfully extended your newly modified Game Mode to Blueprints, you will need to set your project to use **BP_FPSProjectGameModeBase** as the default **Game Mode** in this step.

- Click the **Edit** in the **Main** menu panel and select **Project Settings**.
- Navigate to the **Project** section on the left side of the **Project Settings** tab, click on **Maps & Modes**. Expand the **Default GameMode** dropdown menu, and select **BP_FPSGameModeBase**.
- Close the **Project Settings** menu.
- Click the **Play** button in the **Level Editor Toolbar**. "Hello World, this is FPSGameMode!" should now be displayed in yellow text for five seconds in the upper left hand corner of your viewport.
- Press the **Shift + Escape** or click **Stop** in the **Level Editor Toolbar** to exit PIE mode.

## 1.6 Section One Summary

 C++

 FPSProjectGameModeBase.h

```
// Copyright Epic Games, Inc. All Rights Reserved.

#pragma once

#include "CoreMinimal.h"
#include "GameFramework/GameModeBase.h"
#include "FPSProjectGameModeBase.generated.h"

/**
 *
```

 C++

 FPSProjectGameModeBase.cpp

```
// Copyright Epic Games, Inc. All Rights Reserved.

#include "FPSProjectGameMode.h"

void AFPSProjectGameMode::StartPlay()
{
    Super::StartPlay();

    checkGEngine != nullptr);

```

Congratulations! You've learned how to:

✓ Set up a New Project

✓ Open your Project in Visual Studio

✓ Add Log Messaging to your Project

✓ Compile your First C++ Class

✓ Set the Default Game Mode

You're now ready to learn how to implement your character in the next section.

- programming

On this page

- Goals (-> setting-up-your-project-in-unreal-engine)
- Objectives (-> setting-up-your-project-in-unreal-engine)
- Steps (-> setting-up-your-project-in-unreal-engine)
- 1.1 - Project Setup (-> setting-up-your-project-in-unreal-engine)
- 1.2 - Opening the Project in Visual Studio (-> setting-up-your-project-in-unreal-engine)
- 1.3 - Adding Log Messaging (-> setting-up-your-project-in-unreal-engine)
- FPSProjectGameMode Header File (-> setting-up-your-project-in-unreal-engine)
- FPSProjectGameMode CPP File (-> setting-up-your-project-in-unreal-engine)
- 1.4 - Compiling the Project (-> setting-up-your-project-in-unreal-engine)
- Extending your C++ Game Mode Class to Blueprints (-> setting-up-your-project-in-unreal-engine)
- 1.5 - Setting the Default Game Mode (-> setting-up-your-project-in-unreal-engine)
- 1.6 Section One Summary (-> setting-up-your-project-in-unreal-engine)

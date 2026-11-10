# Set Up and Compile Your Project

https://dev.epicgames.com/documentation/en-us/unreal-engine/coder-01-set-up-and-compile-a-cplusplus-project-in-unreal-engine?application_version=5.9

> Learn how to set up and compile a new C++ game project from a template.

[image: Set Up and Compile Your Project]

## Before You Begin

Ensure you've done the following:

- Installed Unreal Engine (-> install-unreal-engine) and set up Visual Studio (-> setting-up-visual-studio-development-environment-for-cplusplus-projects-in-unreal-engine) for Unreal Engine
- Learned about Projects and Actors and how to navigate Unreal Editor
- Read Code a First-Person Adventure Game (-> code-a-firstperson-adventure-game-in-unreal-engine)

## Start From a Template

This tutorial starts you off with a Blueprint-based project containing sample assets. You'll gradually add code that replicates and expands on the existing Blueprint functionality. This way, you can learn to build new classes in a fresh C++ project while also having the equivalent Blueprints available as a reference.

To create a new game project from a template, follow these steps:

- Open Unreal Engine. In the **Unreal Project Browser**, go to the **Games **project category, and select the **First Person **template.
- In the **Project Defaults**, keep the project type set to **Blueprint**. This means Unreal Engine creates a project with Blueprint-type default assets instead of C++ assets.
- For the **Variant**, select **Arena Shooter**.
- Name your project. This tutorial uses `AdventureGame` as the project name.
- Click **Create** to open your new project in the editor.

## Verify Enhanced Input

With the **Enhanced Input system**, you can control character movement by building custom Input Actions that define the actions your character can do, such as jumping or crouching. Each Input Action exists as a data asset that you can reference in code to communicate between your code and your character.

Later in this tutorial, you’ll combine Input Actions and code to enable your character to move and look around.

The Enhanced Input system should already be enabled in your project. To verify this, follow these steps:

- In Unreal Editor’s main menu, go to the **Edit **menu, and select **Plugins**.
- Search for **Enhanced Input**. You should see the plugin installed and enabled.

To learn more about the Enhanced Input system and Input Actions, see Enhanced Input (-> enhanced-input-in-unreal-engine).

## Create a C++ Game Mode Class

Your Blueprint-based project doesn’t have any C++ files or a Visual Studio (VS) project to work with. Next, you'll create your first C++ class, which tells Unreal Engine to generate the Visual Studio project and files you need to get coding.

You'll start with a Game Mode class.** Game Mode** assets define a game's rules, win conditions, and what characters are used. The Game Mode also sets the default gameplay framework classes your project uses, including the Pawn, PlayerController, and HUD. Later in this tutorial, you’ll use your Game Mode to change the default player character.

To create a new Game Mode C++ class, follow these steps:

- In Unreal Editor’s main menu, go to **Tools > New C++ Class**.
- In the **Choose Parent Class **window, find and select **Game Mode Base**, and click **Next**. This means your custom class is derived from the parent `AGameModeBase` class.
- In the **Name Your New Game Mode Base** step, next to **Class Type**, click **Public**, which places the class header in your game module's Public folder so it can be included by other code.Modern Unreal projects use a `Public/Private` module layout to control header visibilty. To avoid include issues and follow current best practices, always select **Public** when creating new C++ class in this tutorial series.
- Enter a name for the new class, then click **Create Class**. This tutorial uses `AdventureGameMode`.
- Adding code to your project may take a minute or two. During this process, two warning prompts appear, stating that you’ll need to build or compile your project from VS at least once before the C++ classes appear in the Content Browser. Click **OK**, and then click **Yes **on the second warning to open your code.

## Build Your Project

Before you start adding code, finish preparing your environment by building your project in VS and refreshing Unreal Editor.

### Open the Project in Visual Studio

If the engine didn’t automatically prompt you to open your project in VS after you created the Game Mode class, in Unreal Editor’s main menu, go to **Tools **and select **Open Visual Studio**.

You can also find your project’s `.sln` file in `/Documents/Unreal Projects/[ProjectName]` by default.

Unreal Engine tracks changes you make to your project, like adding new classes, modules, plugins, or modifying build settings. However, the VS project files may not automatically reflect these updates. Use **Refresh Visual Studio Project **(also in the **Tools **menu) to regenerate the solution and project files based on the current project state so everything is up-to-date.

When you open Visual Studio, you'll see your project files organized in the **Solution Explorer**.

When you open your first Unreal Engine C++ project in VS, you might see a warning about missing components in the **Solution Explorer**. Click **Install **to allow VS to install any additional components that may be necessary for your project.

In the **Solution Explorer**, expand **Games > [ProjectName] > Source > [ProjectName]**. This is where the main files for your game are located, including two files corresponding to your new Game Mode, `[GameModeName].cpp` and `[GameModeName].h`.

### Build the Project and Refresh Unreal Editor

To make Unreal Editor recognize your code project and include your C++ classes in the Content Browser, build your project from VS and restart the editor.

To build your project so its classes appear in Unreal Editor, follow these steps:

- In the **Solution Explorer**, under the **Games **folder, right-click your project, and select **Build**.
- When the build is complete, go back to Unreal Editor and check if the **Compile **button has appeared in the bottom toolbar and if a new C++ Classes folder has appeared in the Content Browser.
- If they haven’t appeared, close the editor and open your project again. Opening the editor recompiles your project, telling UE that your C++ classes exist. If Unreal Engine asks to rebuild your project, click **Yes**.

### Disable Live Coding

Before compiling your code again, turn off **Live Coding **in Unreal Editor. With Live Coding, you can change and rebuild C++ code in implementation (`.cpp`) files while the engine is running; however, it follows a different compilation workflow and may produce errors when editing header (`.h`) files or trying to compile from Visual Studio. Live Coding is useful when iterating on a developed code base, but we recommend disabling it when starting a new project.

To turn off Live Coding, in the editor’s bottom toolbar, click the three dots next to the **Compile **button and disable **Enable Live Coding**.

## Extend a C++ Class to Blueprints

Now that you've made your own custom Game Mode, extend it to Blueprints to expose its properties to the editor, then set that new Blueprint as your project’s default Game Mode.

Extending your Game Mode class to Blueprints exposes class values directly to the editor instead of doing everything through code. The Blueprint acts as a child of the C++ class, inheriting all functionality of the class.

To derive a Blueprint asset from your GameMode class, follow these steps:

- In the **Content Browser **asset tree, go to **C++ Classes > [ProjectName]** **> Public **to find the C++ classes you’ve created.
- Right-click your **Game Mode Base** class and select **Create Blueprint class based on [GameModeBaseName]**.
- In the **Add Blueprint Class** window, name your Blueprint with a `BP_` prefix so you can identify it later. This tutorial uses `BP_AdventureGameMode`.
- For the **Path**, select **All **> **Content **> **FirstPerson **> **Blueprints, **and click **Create Class**. Unreal Engine automatically opens the Blueprint in a new Blueprint Editor window.
- In the Game Mode Blueprint's tab, click **Save**.

You can dock the new window within the main editor window by dragging the Blueprint’s tab next to the map tab (**Lvl_FirstPerson**) in the main editor window.

## Change the Project’s Game Mode

By default, new Unreal Engine projects use a sample Game Mode. To change this to your custom Game Mode, edit your project’s settings.

To change the default Game Mode, follow these steps:

- In the editor’s main menu, go to **Edit > Project Settings**.
- In the **Project **section in the left panel, select **Maps & Modes**.
- At the top of the settings table, change the **Default GameMode** to your Game Mode Blueprint.
- Close **Project Settings**.
- Return to the level editor tab. Next to the **Details **panel tab, click the **World Settings **tab. The **World Settings** panel contains settings control how the current level behaves.If you can't find the World Settings panel, in the main menu, go to the **Window **menu and ensure **World Settings **has a check mark next to it.
- In the **Game Mode** section, set **GameMode Override** to your new Game Mode Blueprint (ensure the asset you select has the `BP_` prefix). Or, click the arrow icon to remove the override so the level uses the default Game Mode set in the project settings.You only need to change the **GameMode Override** for any sample levels. If you create a new, blank level, the **GameMode Override** is set to **None** by default.
- In the level editor, click **Save**.

## Add an On-Screen Debug Message

A great way to start adding code to your project is by adding a “Hello World!” message on screen.

Add a debug message to verify that you are using your new Game Mode rather than the default Game Mode provided by Unreal Engine. Log messages and debug messages are useful for verifying and debugging code during development.

### Override the Default StartPlay() Function

`AGameModeBase` includes a `StartPlay()` function that UE calls when the game is ready to start gameplay. You'll typically override this function in your custom GameMode classes to add global game start logic. Here, you'll override it to make a debug message appear when the game starts.

To override `StartPlay()` in your custom GameMode class, follow these steps:

- In VS, open your Game Mode class’ `.h` header file. The code samples in this tutorial use a class named `AdventureGameMode.`The default code should look like this: C++ ```
UCLASS()
class ADVENTUREGAME_API AAdventureGameMode : public AGameModeBase
{
	GENERATED_BODY()

};
``` UCLASS() class ADVENTUREGAME_API AAdventureGameMode : public AGameModeBase { GENERATED_BODY() };`GENERATED_BODY()` is a macro used by Unreal Header Tool that automatically generates code required for this class and other UObjects to work with Unreal Engine. To learn more about Unreal Header Tool, see the UHT documentation (-> unreal-header-tool-for-unreal-engine). The `AAdventureGameMode` class exposes different Game Mode states to your code, such as a game starting or ending, entering a map, or a game being in progress. When each state is triggered, it runs an associated function such as `StartPlay()` or `ResetLevel()`.
- Add an override declaration for the `StartPlay()` function to your `AAdventureGameModeBase` class. C++ ```
UCLASS()
class ADVENTUREGAME_API AAdventureGameMode : public AGameModeBase
{
	GENERATED_BODY()

	// --- New Code Start ---

	virtual void StartPlay() override;

	// --- New Code End ---
``` Place this override after the `GENERATED_BODY()` line.
- Save the `.h` file.

Unreal Engine classes and functions have prefixes tell the Unreal Header Tool about the class type. For example, an `A` prefix for Actors, `U` for UObjects, and `F` for Structs. To learn more about Unreal Engine C++ Class Prefixes, see Epic C++ Coding Standards: Naming Conventions (-> epic-cplusplus-coding-standard-for-unreal-engine).

### Add a Debug Message to StartPlay()

Implement your `StartPlay()` override with some custom code that prints a debug message.

To print a debug message on screen when gameplay starts, follow these steps:

- Open your Game Mode’s `.cpp` file to implement the function you just declared.
- Add a new function definition for `StartPlay()`. This function is declared in `AAdventureGameMode`, so define it using `AAdventureGameMode::StartPlay()`. C++ ```
void AAdventureGameMode::StartPlay()
{

}
``` void AAdventureGameMode::StartPlay() { }Place this code after the `#include` line.
- Inside `AMyGameModeBase::StartPlay()`, add `Super::StartPlay()` to call the `StartPlay()` function from the `AAdventureGameMode` parent class. This is necessary to handle the other logic that should run when the game starts.
- After `Super::StartPlay()`, add a `check` for `GEngine != nullptr` to ensure the global engine pointer is valid. C++ ```
void AAdventureGameMode::StartPlay()
{
	// --- New Code Start ---

	Super::StartPlay();

	check(GEngine != nullptr);

	// --- New Code End ---
``` This is a pointer to the UEngine class that Unreal Engine itself uses, and checking that it's valid ensures your game is running properly before your code continues. If the global engine pointer isn’t valid, your game will crash.
- Use `GEngine` to access UEngine's `AddOnScreenDebugMessage()` member function, which prints a message on-screen when the game is running. This function takes four values:A unique int key that identifies the message and prevents the same message from being added multiple times. Use `-1` if the uniqueness doesn’t matter.
- A float number of seconds to display the message.
- An `FColor` that sets the text color.
- An `FString` message to print.

Calling this function with the following values displays a “Hello World!” message in yellow text on the screen for five seconds when the game begins:

 C++

```
GEngine->AddOnScreenDebugMessage(-1, 5.0f, FColor::Yellow, TEXT("Hello World, this is AdventureGameMode!"));
```

GEngine->AddOnScreenDebugMessage(-1, 5.0f, FColor::Yellow, TEXT("Hello World, this is AdventureGameMode!"));

Place this code after the `check` line.

- Save the `.cpp` file.

 Now, `AAdventureGameMode::StartPlay()` should look like this:

 C++

```
#include "AdventureGameMode.h"

void AAdventureGameMode::StartPlay()
{
	Super::StartPlay();

	check(GEngine != nullptr);

	GEngine->AddOnScreenDebugMessage(-1, 5.0f, FColor::Yellow, TEXT("Hello World!"));
}
```

#include "AdventureGameMode.h"

void AAdventureGameMode::StartPlay()
{
 Super::StartPlay();

 check(GEngine != nullptr);

 GEngine->AddOnScreenDebugMessage(-1, 5.0f, FColor::Yellow, TEXT("Hello World!"));
}

`UE_LOG` is another helpful function for printing debug messages. Instead of printing a message on-screen, it logs messages to Unreal Engine’s output log or console during runtime. It’s useful for logging or tracking detailed information about what’s happening in your game. You can categorize logs into different channels and define the message type (such as informational, error, or warning messages). For example:

`UE_LOG(LogTemp, Warning, TEXT("This is a warning message!"));`

## Compile and Test Your Code

You can click the **Compile **button in Unreal Editor to rebuild your project; however, we recommend rebuilding from VS. Once compiled, you can see your code changes reflected in the editor and in-game.

To see your changes in game, click **Play **in the main toolbar to start **Play in Editor **(**PIE**) mode. Your debug message appears in the top-left corner.

To exit PIE mode, press **Shift + Escape** or click **Stop **in the Level Editor toolbar.

## Next Up

Now that you have a basic project with a new Game Mode, you can start creating your player character! In the next section, you’ll build a new Character class and learn how to use Input Actions to add movement controls to your character.

- [image: Create a Player Character With Input Actions] Create a Player Character With Input ActionsLearn how to start building a C++ character with Input Actions. (-> coder-02-create-a-player-character-with-input-actions-in-cplusplus)

## Complete Code

Here is the complete code built in this section:

 C++

 AdventureGameMode.h

```
#pragma once

#include "CoreMinimal.h"
#include "GameFramework/GameModeBase.h"
#include "AdventureGameMode.generated.h"

UCLASS()
class ADVENTUREGAME_API AAdventureGameMode : public AGameModeBase
{
	GENERATED_BODY()
```

 C++

 AdventureGameMode.cpp

```
#include "AdventureGameMode.h"

void AAdventureGameMode::StartPlay()
{
	Super::StartPlay();

	check(GEngine != nullptr);

	GEngine->AddOnScreenDebugMessage(-1, 5.0f, FColor::Yellow, TEXT("Hello World!"));
}
```

#include "AdventureGameMode.h"

void AAdventureGameMode::StartPlay()
{
 Super::StartPlay();

 check(GEngine != nullptr);

 GEngine->AddOnScreenDebugMessage(-1, 5.0f, FColor::Yellow, TEXT("Hello World!"));
}

On this page

- Before You Begin (-> coder-01-set-up-and-compile-a-cplusplus-project-in-unreal-engine)
- Start From a Template (-> coder-01-set-up-and-compile-a-cplusplus-project-in-unreal-engine)
- Verify Enhanced Input (-> coder-01-set-up-and-compile-a-cplusplus-project-in-unreal-engine)
- Create a C++ Game Mode Class (-> coder-01-set-up-and-compile-a-cplusplus-project-in-unreal-engine)
- Build Your Project (-> coder-01-set-up-and-compile-a-cplusplus-project-in-unreal-engine)
- Open the Project in Visual Studio (-> coder-01-set-up-and-compile-a-cplusplus-project-in-unreal-engine)
- Build the Project and Refresh Unreal Editor (-> coder-01-set-up-and-compile-a-cplusplus-project-in-unreal-engine)
- Disable Live Coding (-> coder-01-set-up-and-compile-a-cplusplus-project-in-unreal-engine)
- Extend a C++ Class to Blueprints (-> coder-01-set-up-and-compile-a-cplusplus-project-in-unreal-engine)
- Change the Project’s Game Mode (-> coder-01-set-up-and-compile-a-cplusplus-project-in-unreal-engine)
- Add an On-Screen Debug Message (-> coder-01-set-up-and-compile-a-cplusplus-project-in-unreal-engine)
- Override the Default StartPlay() Function (-> coder-01-set-up-and-compile-a-cplusplus-project-in-unreal-engine)
- Add a Debug Message to StartPlay() (-> coder-01-set-up-and-compile-a-cplusplus-project-in-unreal-engine)
- Compile and Test Your Code (-> coder-01-set-up-and-compile-a-cplusplus-project-in-unreal-engine)
- Next Up (-> coder-01-set-up-and-compile-a-cplusplus-project-in-unreal-engine)
- Complete Code (-> coder-01-set-up-and-compile-a-cplusplus-project-in-unreal-engine)

Related documents

Code a First-Person Adventure Game

 [image: Code a First-Person Adventure Game] (-> code-a-firstperson-adventure-game-in-unreal-engine)Create a Player Character With Input Actions

 [image: Create a Player Character With Input Actions] (-> coder-02-create-a-player-character-with-input-actions-in-cplusplus)

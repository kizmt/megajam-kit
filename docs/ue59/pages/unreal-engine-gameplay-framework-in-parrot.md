# Unreal Gameplay Framework in Parrot

https://dev.epicgames.com/documentation/en-us/unreal-engine/unreal-engine-gameplay-framework-in-parrot?application_version=5.9

> Learn how Parrot uses the Unreal Engine Gameplay Framework.

When learning the basics of Unreal Engine, you should learn how the Unreal Gameplay Framework (-> gameplay-framework-in-unreal-engine) works. In this document, we’ll cover how we’ll set up the game mode and game state classes for Parrot.

## Game Mode 

The game mode is responsible for defining fundamental rules of play, such as the number of players, or how players join the game. It also provides a framework for setting up useful games classes, such as the game state, player controller, HUD, and default pawn class.

To set up the game mode for Parrot, follow these steps:

- In the **Content Browser**, click **Content** > **Blueprints** > **Game**.

- Right-click in the browser and click **Blueprint Class**.

- Set the parent class to **AGameModeBase**.

- Name the class "BP_ParrotGameMode".

- Double-click the newly created blueprint to see the core classes it defines. For Parrot, some of these classes should be changed: - **Game State Class** should be set to **BP_ParrotGameState** - **Player Controller Class **should be set to **BP_ParrotPlayerController** - **HUD Class **should be set to **BP_ParrotHUD** - **Default Pawn Class **should be set to **BP_ParrotPlayerCharacter** [image: The classes list after the changes for Parrot.]

- Go to **Edit** > **Project Settings** > **Maps & Modes** and set the** Default GameMode** to** BP_ParrotGameMode.** [image: The Default GameMode set to BP_ParrotGameMode]

Now that the game mode is set up, you can set up the game state.

## The Game State

The game state handles what is currently happening in the game. It manages information that clients need to know but is not tied to any specific player. For example, you might store team scores here.

To create a game state for Parrot, follow these steps:

- In the main editor, select Tools > New C++ Class...

- Set the parent class to **AGameStateBase**.

- Name the class "AParrotGameState".

- In the Content Browser, click **+ Add** > **Blueprint Class**.

- Set the parent class to **AParrotGameState**.

- Name the class "BP_ParrotGameState".

- In your game mode blueprint, assign **BP_ParrotGameState** to the game state field.

## Game Mode and Game State Concept Review

For more information about game mode and game state, see Game Mode and Game State (-> game-mode-and-game-state-in-unreal-engine). As new classes are created throughout development, remember to update your game mode and game state.

The game mode can also be set per map. The Main Menu in Parrot uses a different game mode than the one that is used by levels in the game.

## Game Instance 

The game instance is a single persistent class instance in the engine that handles project specific functionality. It exists for the entire lifetime of your application. It contains the game’s viewport client and the local player.

Following the same pattern as the game mode and state, we create a base C++ class, UParrotGameInstance, and a blueprint class, BP_ParrotGameInstance. You can set the game instance class for your project under Edit->Project Settings->Maps & Modes

To create a game instance for Parrot, follow these steps:

- In the main editor, select Tools > New C++ Class...

- Set the parent class to **UGameInstance**.

- Name the class "UParrotGameInstance".

- In the Content Browser, click **+ Add** > **Blueprint Class**.

- Set the parent class to **UParrotGameInstance**.

- Name the class "BP_ParrotGameInstance".

- Go to Edit > Project Settings > Maps & Modes and set the Game Instance Class to BP_ParrotGameInstance. [image: The Game Instance Class set to BP_ParrotGameInstance]

## Level Streaming Example

In Parrot, different maps are specific to different game modes, and the game instance tells the game which map should be loaded using `UParrotMapDataAsset` files. These are data assets (-> data-assets-in-unreal-engine) that contain a soft object pointer to a map file. These assets are organized on the game instance and can cycle through them as the player progresses through the game. Since this is on the game instance, you can always stream the next level in from anywhere. The player controller listens for game state changes and then call into the game instance as needed.

The following screenshot shows a Blueprint that uses the **Stream Level** node and **Async Load Asset** node to asynchronously load the soft object reference to a **ParrotMapDataAsset**. Then, the **Open Level** node is called without having to wait for a synchronous load, since the level has already been loaded. The **CommonLoadingScreen** plugin is also used here. The loading screen widget will be invoked during the preload of the next map and removed during the postload.

[image: The Blueprint that asynchronously loads the soft object reference.]

For more details on the loading screen and why Parrot does an asynchronous load instead of a synchronous one here, see the User Interface for Parrot (-> user-interface-for-parrot-in-unreal-engine) documentation.

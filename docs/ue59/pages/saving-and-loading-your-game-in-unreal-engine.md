# Saving and Loading Your Game

https://dev.epicgames.com/documentation/en-us/unreal-engine/saving-and-loading-your-game-in-unreal-engine?application_version=5.9

> Overview of how to save and load your game

[image: Saving and Loading Your Game]

Programming Language

×C++

Select an option from the dropdown to see content relevant to it.

The meaning of "saving the game" can vary considerably from one game to the next, but the general idea of enabling players to quit the game and then resume where they left off at a later time is a part of most modern games. Depending on what type of game you're making, you may only need a few basic pieces of information, such as the last checkpoint the player reached and maybe which items the player has found. Or you may need much more detailed information, possibly involving things like a long list of the player's social interactions with other in-game characters, or the current status of a variety of quests, mission objectives, or subplots.

Unreal Engine (UE) features a saving and loading system that revolves around one or more custom **SaveGame** classes that you create to meet your game's specific needs, including all of the information that you need to preserve across multiple play sessions. The system supports the ability to have multiple saved game files, and to save different SaveGame classes to those files. This is useful for separating globally-unlocked features from playthrough-specific game data.

## Creating a SaveGame Object

The `USaveGame` class sets up an object that can be used as a target for the saving and loading functions declared in `Kismet/GameplayStatics.h`.

You can create a new class based on `USaveGame` using the C++ Class Wizard (-> using-the-cplusplus-class-wizard-in-unreal-engine).

In this example, the new `USaveGame` class is called `UMySaveGame`. In order to use it, add the following lines to your game module's header file, after any other `#include` directives:

 C++

 MyProject.h

```
#include "MySaveGame.h"
	#include "Kismet/GameplayStatics.h"
```

#include "MySaveGame.h"
 #include "Kismet/GameplayStatics.h"

### Header

In the header file for your `SaveGame` object, you can declare any variables you want your `SaveGame` to store.

 C++

```
UPROPERTY(VisibleAnywhere, Category = Basic)
	FString PlayerName;
```

UPROPERTY(VisibleAnywhere, Category = Basic)
 FString PlayerName;

In this example, there are also variables declared that will be used to store default values for the `SaveSlotName` and the `UserIndex`, so that each class that saves to this
`SaveGame` object will not have to independently set those variables. This step is optional, and will cause there to be one save slot that gets overwritten if the default values are not changed.

 C++

 MySaveGame.h

```
#pragma once

	#include "GameFramework/SaveGame.h"
	#include "MySaveGame.generated.h"

	/**
	 *
	 */
	UCLASS()
	class [PROJECTNAME]_API UMySaveGame : public USaveGame
```

### Source

Generally, the `SaveGame` object's source file does not need any particular code to function, unless your particular save system has additional functionality you would like to set up
here.

This example does define the values of `SaveSlotName` and `UserIndex` in the class constructor, so they can be read out and used by other gameplay classes.

 C++

 MySaveGame.cpp

```
// Copyright 1998-2018 Epic Games, Inc. All Rights Reserved.

	#include "[ProjectName].h"
	#include "MySaveGame.h"

	UMySaveGame::UMySaveGame()
	{
		SaveSlotName = TEXT("TestSaveSlot");
		UserIndex = 0;
	}
```

// Copyright 1998-2018 Epic Games, Inc. All Rights Reserved.

 #include "[ProjectName].h"
 #include "MySaveGame.h"

 UMySaveGame::UMySaveGame()
 {
 SaveSlotName = TEXT("TestSaveSlot");
 UserIndex = 0;
 }

## Saving A Game

Once you have created a SaveGame class, you can populate it with variables to store your game's data. For example, you might create an integer variable to store the player's score, or a string variable for the player's name. When you save the game, you will transfer that information from the current game world into a SaveGame object, and when loading a game, you will copy it from the SaveGame object to game object like Characters, the Player Controller, or the Game Mode.

First, call `CreateSaveGameObject` (from the `UGameplayStatics` library) to get a new `UMySaveGame` object. Once you have the object, you can populate it with the data you want to save. Finally, call `SaveGameToSlot` or `AsyncSaveGameToSlot` to write the data out to your device.

### Asynchronous Saving

`AsyncSaveGameToSlot` is the recommended method for saving the game. Running asynchronously prevents a sudden framerate hitch, making it less noticeable to players and avoiding a possible certification issue on some platforms. When the save process is complete, the delegate (of type `FAsyncSaveGameToSlotDelegate`) will be called with the slot name, the user index, and a `bool` indicating success or failure.

 C++

```
if (UMySaveGame* SaveGameInstance = Cast<UMySaveGame>(UGameplayStatics::CreateSaveGameObject(UMySaveGame::StaticClass())))
	{
		// Set up the (optional) delegate.
		FAsyncSaveGameToSlotDelegate SavedDelegate;
		// USomeUObjectClass::SaveGameDelegateFunction is a void function that takes the following parameters: const FString& SlotName, const int32 UserIndex, bool bSuccess
		SavedDelegate.BindUObject(SomeUObjectPointer, &USomeUObjectClass::SaveGameDelegateFunction);

		// Set data on the savegame object.
		SaveGameInstance->PlayerName = TEXT("PlayerOne");
```

### Synchronous Saving

`SaveGameToSlot` is sufficient for small SaveGame formats, and for saving the game while paused or in a menu. It's also easy to use, as it simply saves the game immediately and returns a `bool` indicating success or failure. For larger amounts of data, or for auto-saving game while the player is still actively interacting with your game world, `AsyncSaveGameToSlot` is a better choice.

 C++

```
if (UMySaveGame* SaveGameInstance = Cast<UMySaveGame>(UGameplayStatics::CreateSaveGameObject(UMySaveGame::StaticClass())))
	{
		// Set data on the savegame object.
		SaveGameInstance->PlayerName = TEXT("PlayerOne");

		// Save the data immediately.
		if (UGameplayStatics::SaveGameToSlot(SaveGameInstance, SlotNameString, UserIndexInt32))
		{
			// Save succeeded.
		}
```

### Binary Saving

You can transfer a SaveGame object to memory with the `SaveGameToMemory` function. This function only offers synchronous operation, but is faster than saving to a drive. The caller provides a reference to a buffer (a `TArray<uint8>&`) where the data will be stored. On success, the function returns true.

 C++

```
TArray<uint8> OutSaveData;
	if (UGameplayStatics::SaveGameToMemory(SaveGameObject, OutSaveData))
	{
		// The operation succeeded, and OutSaveData now contains a binary represenation of the SaveGame object.
	}
```

TArray<uint8> OutSaveData;
 if (UGameplayStatics::SaveGameToMemory(SaveGameObject, OutSaveData))
 {
 // The operation succeeded, and OutSaveData now contains a binary represenation of the SaveGame object.
 }

You can also save binary data directly to a file, similar to the `SaveGameToSlot` function, by calling `SaveDataToSlot` with the buffer (a `const TArray<uint8>&`) and the slot name and user ID information. As with `SaveGameToMemory`, this function only offers synchronous operation, and returns a `bool` to indicate success or failure.

 C++

```
if (UGameplayStatics::SaveDataToSlot(InSaveData, SlotNameString, UserIndexInt32))
	{
		// The operation succeeded, and InSaveData has been written to the save file defined by the slot name and user ID we provided.
	}
```

if (UGameplayStatics::SaveDataToSlot(InSaveData, SlotNameString, UserIndexInt32))
 {
 // The operation succeeded, and InSaveData has been written to the save file defined by the slot name and user ID we provided.
 }

On development platforms, saved game files use the `.sav` extension and appear in the project's `Saved\SaveGames` folder. On other platforms, particularly consoles, this varies to accommodate the specific file system.

## Loading A Game

To load a saved game, you must provide the save slot name and user ID that you used when you saved it. If the SaveGame you specified exists, the Engine will populate your SaveGame object with the data it contains and return it as a base SaveGame (class `USaveGame`) object. You can then cast that object back to your custom SaveGame class and access the data. Depending on what kind of data your SaveGame type contains, you may want to keep a copy of it, or simply use the data and discard the object.

As with saving, you can load synchronously or asynchronously. If you have a large amount of data, or wish to use a loading screen or animation during load time, we recommend the asychronous method. For small amounts of data that load quickly, a synchronous method exists.

### Asynchronous Loading

When loading asynchronously with `AsyncLoadGameFromSlot`, you must provide a callback delegate in order to receive the data that the system loads.

 C++

```
// Set up the delegate.
	FAsyncLoadGameFromSlotDelegate LoadedDelegate;
	// USomeUObjectClass::LoadGameDelegateFunction is a void function that takes the following parameters: const FString& SlotName, const int32 UserIndex, USaveGame* LoadedGameData
	LoadedDelegate.BindUObject(SomeUObjectPointer, &USomeUObjectClass::LoadGameDelegateFunction);
	UGameplayStatics::AsyncLoadGameFromSlot(SlotName, 0, LoadedDelegate);
```

// Set up the delegate.
 FAsyncLoadGameFromSlotDelegate LoadedDelegate;
 // USomeUObjectClass::LoadGameDelegateFunction is a void function that takes the following parameters: const FString& SlotName, const int32 UserIndex, USaveGame* LoadedGameData
 LoadedDelegate.BindUObject(SomeUObjectPointer, &USomeUObjectClass::LoadGameDelegateFunction);
 UGameplayStatics::AsyncLoadGameFromSlot(SlotName, 0, LoadedDelegate);

### Synchronous Loading

The `LoadGameFromSlot` function will create and return a `USaveGame` object if it succeeds.

 C++

```
// Retrieve and cast the USaveGame object to UMySaveGame.
	if (UMySaveGame* LoadedGame = Cast<UMySaveGame>(UGameplayStatics::LoadGameFromSlot(SlotName, 0)))
	{
		// The operation was successful, so LoadedGame now contains the data we saved earlier.
		UE_LOG(LogTemp, Warning, TEXT("LOADED: %s"), *LoadedGame->PlayerName);
	}
```

// Retrieve and cast the USaveGame object to UMySaveGame.
 if (UMySaveGame* LoadedGame = Cast<UMySaveGame>(UGameplayStatics::LoadGameFromSlot(SlotName, 0)))
 {
 // The operation was successful, so LoadedGame now contains the data we saved earlier.
 UE_LOG(LogTemp, Warning, TEXT("LOADED: %s"), *LoadedGame->PlayerName);
 }

### Binary Loading

You can load SaveGame data from a file in raw, binary form with `LoadDataFromSlot`. This function is very similar to `LoadGameFromSlot`, except that it does not create a SaveGame object. Only synchronous operation is available for this type of loading.

 C++

```
TArray<uint8> OutSaveData;
	if (UGameplayStatics::LoadDataFromSlot(OutSaveData, SlotNameString, UserIndexInt32))
	{
		// The operation succeeded, and OutSaveData now contains a binary represenation of the SaveGame object.
	}
```

TArray<uint8> OutSaveData;
 if (UGameplayStatics::LoadDataFromSlot(OutSaveData, SlotNameString, UserIndexInt32))
 {
 // The operation succeeded, and OutSaveData now contains a binary represenation of the SaveGame object.
 }

You can also convert this binary data to a SaveGame object by calling `LoadGameFromMemory`. This is a synchronous call, and returns a new `USaveGame` object upon success, or a null pointer on failure.

 C++

```
if (UMySaveGame* SaveGameInstance = Cast<UMySaveGame>(LoadGameFromMemory(InSaveData)))
	{
		// The operation succeeded, and SaveGameInstance was able to cast to type we expected (UMySaveGame).
	}
```

if (UMySaveGame* SaveGameInstance = Cast<UMySaveGame>(LoadGameFromMemory(InSaveData)))
 {
 // The operation succeeded, and SaveGameInstance was able to cast to type we expected (UMySaveGame).
 }

- gameplay
- programming
- save game
- load game
- savegame

On this page

- Creating a SaveGame Object (-> saving-and-loading-your-game-in-unreal-engine)
- Header (-> saving-and-loading-your-game-in-unreal-engine)
- Source (-> saving-and-loading-your-game-in-unreal-engine)
- Saving A Game (-> saving-and-loading-your-game-in-unreal-engine)
- Asynchronous Saving (-> saving-and-loading-your-game-in-unreal-engine)
- Synchronous Saving (-> saving-and-loading-your-game-in-unreal-engine)
- Binary Saving (-> saving-and-loading-your-game-in-unreal-engine)
- Loading A Game (-> saving-and-loading-your-game-in-unreal-engine)
- Asynchronous Loading (-> saving-and-loading-your-game-in-unreal-engine)
- Synchronous Loading (-> saving-and-loading-your-game-in-unreal-engine)
- Binary Loading (-> saving-and-loading-your-game-in-unreal-engine)

# Track Progress With Checkpoints

https://dev.epicgames.com/documentation/en-us/unreal-engine/parkour-05-course-progress-with-checkpoints?application_version=5.9

> Build a Checkpoint gameplay object in C++ and Blueprints to track a player’s progress through a platforming obstacle course and set where they respawn.

[image: Track Progress With Checkpoints]

Learn to use this **Experimental** feature, but use caution when shipping with it.

Now that you have a character that can traverse a platforming obstacle course, you’ll create two gameplay objects to:

- Checkpoints that mark the player’s progress.
- Danger zones that end the game and return the player to the most recent checkpoint if the player falls from an obstacle into one of these zones.

In this part of the tutorial series, you’ll build the checkpoint game objects and set up the game logic that tracks checkpoints as the player progresses through the level. The level ends at the final checkpoint.

You’ll set up the game rules so that the player must collect checkpoints in order. To define that order, you’ll assign ID numbers to each checkpoint actor. The game’s checkpoint-tracking logic marks the next checkpoint in the sequence with an “IsNext” flag and the player can only collect a checkpoint if it has that flag. The game moves the flag forward when the player clears that checkpoint.

## Create Materials

First, create new Material assets for your checkpoints: one for default checkpoints and a brighter version to indicate the next checkpoint.

## Create a Base Checkpoint Material

To create the Material for the base checkpoint, follow these steps:

- In the Content Browser, in the **Content > Parkour > Materials** folder, click the **Add (+)** button and select **Material**.
- Name the material `M_BaseCheckpoint`.
- Double-click the material to open the Material Editor.
- In the **Details **panel:Set **Blend Mode** to **TranslucentGreyTransmittance**.
- Enable **Two Sided**.

- In the Material Graph, change the following input parameters on the Material root node:Right-click **Base Color** and select **Promote to Parameter**.
- Click **Base Color**’s **Default Value** swatch and change the **Hex sRGB** to `2F4097FF`.
- Right-click **Emissive Color** and select **Promote to Parameter**.
- Set **Opacity Override** to `0.3`.

- Save the Material.

## Create a Next-Checkpoint Material

Using a Material Instance, you’ll create a brighter version of the base Material to indicate the next collectable checkpoint.

To create the Material Instance, follow these steps:

- In the **Content Browser**, right-click **M_BaseCheckpoint** and select **Create Material Instance**.
- Name the asset `MI_NextCheckpoint` and open it.
- In the **Details **panel, in the **Global Vector Parameter Values** section:Set **Base Color** to **Hex sRGB** = `4E67E9FF`.
- Set **Emissive Color** to **Hex sRGB** = `4E67E9FF`.

- Save the Material Instance.

For the purposes of this tutorial, we’ve created basic Materials that act as placeholders for final art assets. You can customize your checkpoints as desired.

## Create a Checkpoint

To create a checkpoint asset, you’ll use both C++ and Blueprints. It's best to implement algorithm-heavy logic with C++. Blueprints have no built-in way to sort an array by a custom property, so the checkpoint's `ID` property and `SortCheckpointsByID()` function live in C++ instead. The comparator needs direct access to ID, so it stays in the same class.

You’ll build how the checkpoint looks, how it responds to being touched, and how it communicates with the Player Controller and Game Mode in Blueprints, since this functionality is created by wiring objects and events together.

## Create a CheckpointBase C++ Class

The CheckpointBase class gets an `ID` property and a function that sorts an array of checkpoints by ID. When the game starts, the Game Mode gathers all checkpoint actors in the level into an array and passes the array to `SortCheckpointsByID()`. This function compares the ID of each pair of checkpoints and sorts the array in ascending order. The game uses the sorted array to determine which checkpoint the player should reach next.

To create the Checkpoint class’s base logic, follow these steps:

- Select **Tools > New C++ Class**.
- In the **Add C++ Class** window, select **Actor **as the parent class and click **Next**.
- Name the class `CheckpointBase` then select **Create Class**.
- In `CheckpointBase.h`, delete all default code in the `public` and `protected` sections; you won’t need it.
- In the `public` section, add the following:An `ID` variable of type `int32`. In your level, you’ll assign an ID number to each checkpoint actor to indicate the order the player must collect the checkpoints in.
- A `SortCheckpointsByID` function that sorts all checkpoints by their IDs. Both should be available to Blueprints.

 C++

```
// Copyright Epic Games, Inc. All Rights Reserved.

#pragma once

#include "CoreMinimal.h"
#include "GameFramework/Actor.h"
#include "CheckpointBase.generated.h"

UCLASS()
class PARKOURGAME_API ACheckpointBase : public AActor
```

- Save and compile your code.

## Create the Checkpoint Blueprint

To derive a Blueprint from your Checkpoint class, follow these steps:

- In the **Content Browser**, in the **Content > Parkour > Blueprints** folder, click the **Add (+)** button and select **Blueprint Class**.
- In the **Pick Parent Class **window, expand **All Classes** and select **CheckpointBase**.
- Name the class `BP_Checkpoint`.
- Double-click the class to open the Blueprint Editor.

To set up the Checkpoint Blueprint’s appearance, follow these steps:

- In the **Components **panel, select the **BP_Checkpoint **root object.
- In the **Details **panel, in the **Tags **section, add the `NoWallRun` tag.
- In the **Components **panel, add a **Cylinder **component, and set up its properties:In its **Details **panel, set **Scale **to `4`, `4`, `4`.
- Set **Material **to **M_BaseCheckpoint**.
- In the **Collision **section, set **Collision Presets** to **OverlapOnlyPawn**.

- Select the **Cylinder **component, add a new **Arrow **component, and set up its properties:In the **Details **panel, set** Arrow Length** to `50.0`.

- With the **Cylinder **component still selected, move the mesh `200` units up the **Z** (blue) axis so the checkpoint’s origin lines up with the cylinder’s base.
- Save and compile the Blueprint.

## Define Checkpoint Variables and Event Dispatcher

Your checkpoints will use an **Event Dispatcher** to tell your Game Mode when the player collects them.

In Blueprints, an Event Dispatcher (-> event-dispatchers-in-unreal-engine) is like a notification system — it’s a way for one object to broadcast an event without needing to know who is listening. A listening object can bind to the broadcasted event and react when the event fires. Event Dispatchers are commonly used for UI updates and gameplay events.

To add the variables and Event Dispatcher the checkpoint needs for its Blueprint logic, follow these steps:

- In the** My Blueprint** panel, create a new variable named `BaseMaterial`:Set its type to **Material Interface**.
- Compile the Blueprint. In the **Details **panel, set the **Default Value** to **M_BaseCheckpoint**.

- Create another new variable named `NextMaterial`, also of type **Material Interface**.
- Create a third new variable named `IsNext` of type **Boolean**.You’ll use **IsNext** to mark the next checkpoint in sequence and control how checkpoints are collected. When a BP_Checkpoint instance has **IsNext** set to true, it gets a different material and is collectable by the player.
- Create a new **Event Dispatcher** named `OnCheckpointCollectedED`.In the **Details **panel, add an input named `CheckpointCollected` of type **BP_Checkpoint**.

When the player successfully collects a checkpoint, that checkpoint broadcasts this Event Dispatcher. Later in this tutorial, you’ll add an **OnCheckpointCollected** event to your Game Mode and bind it to each checkpoint’s Event Dispatcher so the Game Mode is notified each time a checkpoint is collected.

## Add CollectCheckpoint to BP_ParkourPlayerController

Checkpoint data describes the player's progress through the course rather than the state of the Pawn in the world. That makes the Player Controller the right place to track collected checkpoints and where to respawn the player

To bring all checkpoint logic together, you'll create a function named **CollectCheckpoint** in BP_ParkourPlayerController. You’ll finish this function’s implementation later in the tutorial series, but define it now so you can call it from BP_Checkpoint.

This function starts by adding a checkpoint to a new CollectedCheckpoints array if the player has not already collected it. You’ll add to this function in future parts of the tutorial series.

To define a CollectCheckpoint function in the Player Controller, follow these steps:

- In the **Content Browser**, in **Content > Parkour > Blueprints**, open **BP_ParkourPlayerController**.
- In the **My Blueprint** panel, add a new function named `CollectCheckpoint`.
- In the function’s **Details **panel, add an **Input **named `InCheckpoint` of type **BP_Checkpoint**.
- In the **My Blueprint **panel, add a new variable named `CollectedCheckpoints`. Change its type to **BP Checkpoint** and its container type to **array**.
- In the **CollectCheckpoint **function graph, drag off the function entry node’s exec pin and add a **Branch **node.
- Drag off the **Condition **pin, add a **Contains Item (Array)** node, and set up the node:From the **My Blueprint** panel, drag the **CollectedCheckpoints **array variable onto the **Contains **node’s array pin.
- Connect the function entry node’s** In Checkpoint** pin to the **Contains **node’s lower input pin.

- Drag off the **Branch **node’s **False **pin, search for `add array`, add an **Add **node, and set it up:From the **My Blueprint** panel, drag the **CollectedCheckpoints **variable onto the **Add **node’s array pin.
- Connect the function entry node’s **In Checkpoint** pin to the **Add **node’s lower input pin.

- Save and compile the Blueprint.

## Add Checkpoint Blueprint Logic

The checkpoint Blueprint needs two functions:

- **SetNext**: Updates this checkpoint’s IsNext variable and applies the appropriate Material to a checkpoint depending on whether it is the next checkpoint or not.
- **TryCollect**: If IsNext is true, the function collects the checkpoint, hides it in-game, and broadcasts OnCheckpointCollectedED so the game can move the IsNext flag to the next checkpoint.

To implement BP_Checkpoint’s **SetNext **function, follow these steps:

- In the **My Blueprint** panel, create a new function named `SetNext`.
- In the function’s **Details **panel, add an input named `InIsNext` to indicate it’s the function-input version of **IsNext**. Set its type to **Boolean**.
- In the function’s node graph, drag off the function entry node and add a Set Is Next node. Connect In Is Next to Is Next.
- After the **Set **node, add a **Branch **node that checks the value of** Is Next**.
- Add two **Set Material (Cylinder)** nodes, connecting one to the **Branch**’s **True **pin and one to the **False **pin.Both **Set Material **nodes should have the **Cylinder **component as their **Target**.
- For the **True **execution path, drag the **NextMaterial **variable onto the **Material **pin in that path’s **Set Material **node.
- For the **False **execution path, drag **BaseMaterial **onto that** Set Material **node’s **Material **pin.
- Save and compile the Blueprint.

To implement BP_Checkpoint's **TryCollect **function, follow these steps:

- In the **My Blueprint** panel, create a new function named `TryCollect`.
- In the function’s **Details **panel, add an input named `ForActor` of type **Actor**.
- In the function’s node graph, drag off the function entry node and add a **Branch **node to check if this checkpoint is the next checkpoint.
- Drag the **IsNext **variable onto the **Branch **node’s **Condition**.
- Drag off the **Branch **node’s **True **pin, add a **Cast To Pawn** node, and connect its **Object **to the function entry node's **For Actor** pin to cast the Actor as a Pawn.
- Use the **As Pawn** output pin with a **Get Controller** node to get the Player Controller.
- Continue execution flow from the** Cast To Pawn** node to a new **Cast To BP_ParkourPlayerController** node, casting **Get Controller**’s **Return Value**.
- After the second **Cast To** node, call **CollectCheckpoint**. (**CollectCheckpoint **is the empty function you declared in BP_ParkourPlayerController.)If you don’t see this function in the node actions list, disable **Context Sensitive**.For the **Target**, connect the** Cast To** node’s **BP_ParkourPlayerController** output.
- For the **In Checkpoint**, drag off the pin and get a reference to **Self**.

- After **Collect Checkpoint**, call **SetNext**. The player has collected this checkpoint now and it’s no longer the next checkpoint, so set **In Is Next** to false.
- After **Set Next**, call **Toggle Visibility**. In the node, add a checkmark next to **Propagate to Children**.
- After **Toggle Visibility**, add a **Call On Checkpoint Collected **node to trigger the Event Dispatcher.Drag off the **Checkpoint Collected** pin and add a reference to **Self**.

When a checkpoint is collected, it broadcasts the Event Dispatcher. Later, you’ll set up your Game Mode to listen for this message.

- Save and compile the blueprint.

The finished **TryCollect **function graph should look like this:

To run the checkpoint logic when the player touches a checkpoint object, follow these steps:

- Go to BP_Checkpoint’s **EventGraph **tab.
- Right-click the **Cylinder **component, go to **Add Event**, and select **Add OnComponentBeginOverlap**.
- In the graph, drag off the new event node and call **TryCollect**. Connect the **Other Actor** and** For Actor** pins to pass the player Pawn into the function.
- Save and compile the Blueprint.

## Set Up Checkpoints with the Game Mode Blueprint

For persistent player data, you used the Player Controller class. Checkpoint data is level-wide, and should be available to any future obstacle course levels you create. For this reason, add checkpoint setup and tracking logic to the Game Mode.

You’ll use the Game Mode to collect checkpoint data when the game starts and find the next checkpoint each time the player collects a checkpoint (causing the **OnCheckpointCollected **event to trigger).

### Initialize Checkpoints

This function gathers all checkpoints in the level, binds a collect-checkpoint event to each checkpoint, sorts all checkpoints by ID, and flags the checkpoint with the smallest ID (the first checkpoint in the level) as the next checkpoint.

To track all checkpoints in the level with InitCheckpoints(), follow these steps:

- In the **Content Browser**, in **Content > Parkour > Blueprints**, open your **BP_ParkourGameMode **Blueprint.
- In the **My Blueprint **panel, create a variable named `Checkpoints` of type **BP_Checkpoint**. In the **Details **panel, make it an array.
- In the Event Graph, right-click and search for** Add Custom Event** to add a new event node.Name the event `OnCheckpointCollected`.
- In the event’s **Details **panel, add an input named** Checkpoint Collected** of type **BP Checkpoint**.

The **OnCheckpointCollected** event triggers when the game broadcasts the **OnCheckpointCollectedED** Event Dispatcher.

- Add a new function named `InitCheckpoints`.
- In the function’s node graph, drag off the function entry node and add a **Get All Actors of Class** node.In the node, change the** Actor Class** to **BP_Checkpoint**.
- From the **My Blueprints** panel, drag the **Checkpoints **array variable onto the **Out Actors **pin.

- Check that the array isn’t empty:After the **Set **node, add a **Branch **node.
- For the **Condition**, add an **Is Not Empty (Array)** node.
- Connect the **Set **node’s array output pin to the **Is Not Empty **node’s input pin.

- Drag off the **Branch **node’s **True **pin and add a **Sequence **node to organize the graph.
- Drag off the **Then 0** pin and add a For Each Loop. Set up the loop to bind the Game Mode’s **OnCheckpointCollected** event to each BP_Checkpoint’s **OnCheckpointCollectedED **Event Dispatcher:From the **My Blueprints** panel, drag the **Checkpoints **array variable onto the **Loop **node’s **Array **pin.
- Drag off the **Loop Body** pin and add a** Bind Event to On Checkpoint Collected ED** node.
- Connect the **Array Element** pin to the **Bind Event **node’s **Target **pin.
- Drag off the **Bind Event** node’s **Event **pin and add a **Create Event** node.
- In the **Create Event** node, select the **OnCheckpointCollected **event in the dropdown list.

- Drag off the **Sequence **node’s** Then 1** pin and call** Sort Checkpoints by ID**. This is the function you defined in the `CheckpointBase` C++ class.Drag the **Checkpoints **array variable onto the **Checkpoints **pin.

- Set the first element in the sorted array as the next checkpoint:After the **Sort **node, call **SetNext**.To find this node, disable **Context Sensitive **in the node actions list.
- For the **Target **input, connect a **Get (a copy)** node.
- To set up the **Get **node, connect the array pin to the existing **Checkpoints **reference and keep the index **0**.
- In the **SetNext **function node, add a checkmark next to** In Is Next** to set it to true.

- Save and compile the Blueprint.

The finished **InitCheckpoints **graph should look like this:

## Find the Next Checkpoint

Create another function to update the next checkpoint as the player progresses through the level.

To set the next checkpoint, follow these steps:

- In BP_ParkourGameMode, create a new function named `GetNextCheckpoint`.
- In the function’s **Details **panel, add the following:An input named **ClearedCheckpoint **of type **BP_Checkpoint**.
- An output named **NextCheckpoint **of type **BP_Checkpoint**.

- In the function’s node graph, add extra space between the entry and return nodes.
- Drag off the function entry node and add a **Branch **node. Move the **Branch **node next to the **Return Node** so you have room for the condition logic.
- For the **Branch **node’s **Condition**, get the element in the **Checkpoints **array that comes after **ClearedCheckpoint **and check that it’s valid:Drag off the entry node’s **Cleared Checkpoint** pin and add a **Find Item** node.
- Drag the **Checkpoints **array variable onto the **Find **node’s array pin.
- Use an **Add **operator node to add **1** to the **Find **node’s output.
- Drag off the **Add **node’s output and add an **Is Valid Index** (array type) node.
- Connect the **Checkpoints **reference to the **Is Valid Index** node’s array pin, and then connect the output pin to the **Branch**’s **Condition **pin.

- Drag off the **Add **node’s output again and add a **Get (a ref)** node.Connect the **Checkpoints **reference to the **Get **node’s array pin.
- Connect the **Get **node’s output to the** Return Node**’s **Next Checkpoint** pin.

- Save and compile the Blueprint.

To trigger **InitCheckpoints()** and **GetNextCheckpoint()** from the Game Mode, follow these steps:

- In BP_ParkourGameMode’s **Event Graph**, drag off **Event BeginPlay** and call **InitCheckpoints**.
- Drag off the **OnCheckpointCollected **event node’s exec pin and call **GetNextCheckpoint**.Connect the **Checkpoint Collected** and **Cleared Checkpoint** pins.

- Check that the next checkpoint is valid:Drag off the **Get Next Checkpoint** node’s exec pin, search for **Is Valid** in the node actions list, and select the** Is Valid **node with the question mark (?) next to it.
- Connect the **Next Checkpoint** pin to the **Is Valid** node’s **Input Object** pin.

- Drag off the** Is Valid **pin and call **SetNext**.Connect its **Target **pin to the **Get Next Checkpoint** node’s** Next Checkpoint **pin.
- Add a checkmark next to** In Is Next** to set it to true.

- Save and compile the Blueprint.

## Test Your Checkpoints

Add a few checkpoints to your test level to see how they look and function. It’s best to get all your checkpoints in place first and then assign IDs.

Once you’ve added your test checkpoints, select each and assign them an ID, leaving some space in your numbering in case you want to add additional checkpoints later. For example, you could number your checkpoints in 10s (0, 10, 20, 30, and so on). Rotate the checkpoints so their arrows point in the direction the player should advance through the course. You’ll configure the player to respawn at a checkpoint facing in the arrow’s direction.

Make sure you are forced to collect checkpoints in order — you should not be able to collect the third checkpoint before the first and second checkpoints.

In your obstacle course, it’s best to position checkpoints after the player reaches a natural milestone. For example, after performing a series of platforming jumps or after completing a challenging wall run segment. Fewer checkpoints mean the player repeats more of the course after falling into a danger zone; more checkpoints mean they pick up closer to where they left off.

## Next Up

For the last module in this tutorial series, you’ll give the player the ability to respawn at checkpoints or at the start of the level. When you’ve finished implementing all gameplay mechanics, you’ll learn some tips for building an effective platforming obstacle course for the player.

- [image: Player Respawn With Mover] Player Respawn With MoverUse Mover to teleport the player to a respawn location. (-> 06-parkour-player-respawn-with-mover)

On this page

- Create Materials (-> parkour-05-course-progress-with-checkpoints)
- Create a Base Checkpoint Material (-> parkour-05-course-progress-with-checkpoints)
- Create a Next-Checkpoint Material (-> parkour-05-course-progress-with-checkpoints)
- Create a Checkpoint (-> parkour-05-course-progress-with-checkpoints)
- Create a CheckpointBase C++ Class (-> parkour-05-course-progress-with-checkpoints)
- Create the Checkpoint Blueprint (-> parkour-05-course-progress-with-checkpoints)
- Define Checkpoint Variables and Event Dispatcher (-> parkour-05-course-progress-with-checkpoints)
- Add CollectCheckpoint to BP_ParkourPlayerController (-> parkour-05-course-progress-with-checkpoints)
- Add Checkpoint Blueprint Logic (-> parkour-05-course-progress-with-checkpoints)
- Set Up Checkpoints with the Game Mode Blueprint (-> parkour-05-course-progress-with-checkpoints)
- Initialize Checkpoints (-> parkour-05-course-progress-with-checkpoints)
- Find the Next Checkpoint (-> parkour-05-course-progress-with-checkpoints)
- Test Your Checkpoints (-> parkour-05-course-progress-with-checkpoints)
- Next Up (-> parkour-05-course-progress-with-checkpoints)

Related documents

Build a Parkour Platforming Game with Mover

 [image: Build a Parkour Platforming Game with Mover] (-> mover-00-build-a-platformer-course-with-mover)Mover

 [image: Mover] (-> mover-in-unreal-engine)Event Dispatchers

 [image: Event Dispatchers] (-> event-dispatchers-in-unreal-engine)

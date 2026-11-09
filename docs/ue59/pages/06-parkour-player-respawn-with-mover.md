# Player Respawn With Mover

https://dev.epicgames.com/documentation/en-us/unreal-engine/06-parkour-player-respawn-with-mover?application_version=5.9

> Use Mover to teleport the player to a respawn location.

[image: Player Respawn With Mover]

Learn to use this **Experimental** feature, but use caution when shipping with it.

In this part of the Mover Plugin tutorial series, you’ll implement two ways to respawn the player:

- If the player touches a danger zone, use Mover to return them to a respawn point so they can try that segment of the course again.
- If the player wants to restart their run or try again after finishing a run, they can press a key to reload the level.

You’ll also learn some strategies and tips for building an effective obstacle course for players.

## Save the Player’s Start Location

If the player touches a danger zone before they have reached a checkpoint, they need to be able to respawn at the start of the level. To do this, you need to retrieve and save the position and rotation of the PlayerStart Actor in your level. To keep this logic organized, implement it in a separate function.

To save the player’s starting location and rotation for respawning purposes, follow these steps:

- In BP_ParkourPlayerController, in the **My Blueprint panel**, add a new function named `SetPlayerStart`.
- In the **Variables **section, add two new variables:`RespawnLocation` (**Vector**)
- `RespawnRotation` (**Rotator**)

- In **SetPlayerStart**’s graph, from the function entry node, drag off the exec pin and create a **Get Actor Of Class** node.
- In the node, set the** Actor Class** to **Player Start**.
- Drag off the **Return Value** pin twice to add two new nodes: **Get Actor Location** and **Get Actor Rotation**.
- From the **My Blueprint** panel, drag **Respawn Location **and **Respawn Rotation **onto the graph to create **Set **nodes for both variables.
- Connect the execution flow from** Get Actor Of Class** to the two **Set **nodes.
- Connect the **Get Actor Location **and **Get Actor Rotation** nodes’ **Return Value** pins to the respective **Set **node pins.
- In BP_ParkourPlayerController, go to the **Event Graph**, drag off **Event BeginPlay**, and call **SetPlayerStart **so it runs when the game starts.
- Save and compile the Blueprint.

## Update the Respawn Location

When the game starts, you use **SetPlayerStart **to save the respawn location at the start of the level. Your Player Controller’s **CollectCheckpoint **function should update the respawn location each time the player collects a checkpoint.

To update the respawn location as the player collects checkpoints, follow these steps:

- In BP_ParkourPlayerController, go to the **CollectCheckpoint **function graph.
- Drag off the **Add **node’s exec pin and add a** Set Respawn Location** node.
- Drag off the **Set **node’s exec pin and add a **Set Respawn Rotation** node.
- From the function entry node, drag off the **In Checkpoint** pin and add a **Get Actor Location** node.
- Drag off **In Checkpoint** again (or add a reroute node on the existing wire) and add a **Get Actor Rotation** node.
- Connect the **Location **and **Rotation **outputs to the matching **Set **nodes.
- Save and compile the Blueprint.

## Teleport the Player When Respawning

Now that the Player Controller has a respawn location and rotation, you’ll implement a new function that uses Mover to teleport the Pawn to that location.

The **Respawn **function queues two pieces of movement on the Pawn's Mover component:

- An **Instant Movement Effect** teleports the Pawn to the respawn location and rotation. These movement effects keep the Pawn’s existing velocity, so a player who fell into a danger zone would arrive at the respawn location still moving.
- A **Layered Move **then moves the Pawn to that same respawn location, but also overrides the Pawn’s velocity so the Pawn is standing still after respawning. A Layered Move on its own isn't enough, because it moves the Pawn over time and the player would visibly travel from where they were to the respawn location.

To implement a Respawn function that moves the player to their respawn point, follow these steps:

- In BP_ParkourPlayerController, create a new function named `Respawn`.
- In the **Respawn **function graph, drag off the function entry node and create a **Queue Instant Movement Effect** node (where the **Target **is **Mover Component**). To find this node, you may need to disable **Context Sensitive**. Remember to re-enable it the next time you open the node actions list.
- After **Queue Instant Movement Effect**, create a **Queue Layered Move** node.
- Add the controlled Pawn’s Mover Component as the Target of both nodes:Below the function entry node, add a **Get Controlled Pawn** node.
- Drag off the **Return Value** pin and add a **Get Component by Class** node.
- In the node, change **Component Class** to **Mover Component**.
- Connect the **Get Component by Class** node’s **Return Value** to both **Queue **nodes’ **Target **pins.

- Set up the Instant Movement Effect:Drag off the **Instant Movement Effec**t pin and add a **Make Teleport Instant Movement Effect** node.
- From the **My Blueprints** panel, drag the **Respawn Location** and **Respawn Rotation **variables onto their matching pins in the **Movement Effect** node.
- For **Use Actor Rotation**, remove the checkmark to set it to false. Now the effect applies **Target Rotation** instead of keeping the Pawn's current rotation.

- Set up the Layered Move:Drag off the** Layered Move** pin and add a **Make Layered Move Move To** node.
- From the **My Blueprint** panel, drag the **Respawn Location **variable onto the **Start Location **pin, then connect the reference to the **Target Location **pin as well.

- After **Queue Layered Move**, create a **Set Control Rotation **node. This syncs the Player Controller with the respawn rotation.
- From the **My** **Blueprints **panel, drag **RespawnRotation **onto the** New Rotation** pin.
- Save and compile the Blueprint.

Your **Respawn **function graph should look like this:

## Add a Restart Level Control

The player should be able to restart the level to try again when they are ready. In this tutorial, you’ll implement this with a specific key press.

To add an Input Action that restarts the level, follow these steps:

- In your** Content > Parkour > Input > Actions** folder, create a new Input Action named `IA_Restart`.
- Add a binding for **IA_Restart** in your Input Mapping Context (IMC_Mover). In the binding, add a **Trigger **and set it to **Pressed**.Add a binding for a game controller if you are supporting both types of input.
- Restarting the level isn’t Pawn behavior, so it’s best to add this control to the Player Controller. In BP_ParkourPlayerController’s **Event Graph**, add an **IA_Restart **Enhanced Input Action event node.
- Expand the node to see more pin options. Drag off the **Started **pin and add a **Get Current Level Name** node.
- Drag off the **Get Current Level Name** node and add an **Open Level (by Name)** node. Connect the **Return Value **and** Level Name** pins.
- Save and compile the Blueprint.

## Optional: Check if the Player Is Finished

If you'd like to implement a win condition, you’ll need to know when the player has touched the last checkpoint in the level. To do this, a new function will compare the length of your Game Mode’s Checkpoints array with the length of the Player Controller’s CollectedCheckpoints array.

To implement a function that checks if the player has collected all checkpoints, follow these steps:

- In BP_ParkourPlayerController, in the **My Blueprint** panel, create a new function named `CheckIfFinished`.
- Add a new variable named `Finished` of type **Boolean**.
- In the function’s graph, retrieve your Game Mode:Drag off the function entry node and add a** Cast To BP_ParkourGameMode**.
- Drag off the **Object **pin and add a** Get Game Mode **node.

- Drag off the **Cast To** node’s **As BP Parkour Game Mode **pin and add a** Get Checkpoints** variable reference node.
- From the **My Blueprint** panel, drag the **CollectedCheckpoints **array variable below the **Checkpoints **node and click **Get**.
- Connect both array nodes to two new **Length **nodes to calculate the length of each array, and connect both **Length **outputs to an **Equal **operator node.
- Drag off the** Cast To **node’s exec pin, add a **Branch **node, and connect the **Equal **node’s output to the **Condition **pin.
- Drag off the **Branch **node’s **True **pin and add a **Set Finished** node. Add a checkmark to set **Finished **to true.
- **Optional:** For testing, drag off the **Set **node’s exec pin and add a** Print String** node. Change the **In String** text to `Course Complete!` Later, you can replace this with other win condition logic.
- Save and compile the Blueprint.

To call **CheckIfFinished **when the player collects a checkpoint, follow these steps:

- In BP_PawnPlayerController, go to the **CollectCheckpoint **function graph.
- Drag off the second **Set **node and call **CheckIfFinished**. This function call updates the **Finished **variable if the player has collected all checkpoints.
- Save and compile and Blueprint.

These steps track whether the player has collected every checkpoint. Nothing in this tutorial acts on that result, but the **Finished** variable gives you a hook for your own end-of-run logic. For example, saving a best run time, or displaying a Widget Blueprint that congratulates the player and prompts them to play again or go to the next level.

## Create a Danger Zone

In earlier parts of your obstacle course, a fail state for the player could be falling from a platform into a pit that the player can go back and climb out of. As the player makes their way further into your obstacle course and the difficulty increases, you can add danger zones that defeat the player when touched, forcing them to respawn at a checkpoint and start over from that location.

For this tutorial, you’ll create a translucent red volume to represent the danger zone.

### Create a Danger Zone Material

To create a Material for the danger zones, follow these steps:

- In the **Content Browser**, in **Content > Parkour > Materials**, right-click **M_BaseCheckpoint **and select **Create Material Instance **to reuse this translucent base.
- Name the material `MI_DangerZone` and open it.
- In the **Details **panel, in the **Global Vector Parameter Values** section:Override **Base Color** and use the color picker to set **Hex sRGB** to `FF6767FF`.
- Override Emissive Color and set **Hex sRGB** to `FF6767FF`.

- Save the Material Instance.

## Create the Danger Zone Blueprint

To create the resizable danger zone level object, follow these steps:

- In the **Content Browser**, in **Content > Parkour > Blueprints**, create a new **Blueprint Class**.
- In the **Pick Parent Class** window, select **Actor**.
- Name the class `BP_DangerZone` and open it.
- In the **Components **panel, add a **Cube **component.
- With the **Cube **selected, in the **Details **panel, configure the following properties:Set **Material **to **MI_DangerZone**.
- In the **Collision **section, set **Collision Presets** to **OverlapOnlyPawn**.

- Go to the **Event Graph**. Drag off **Event Actor BeginOverlap**’s exec pin and add a **Cast To Pawn** node to cast **Other Actor**.
- Get the Pawn’s controller and cast it to BP_ParkourPlayerController.
- Call **Respawn**, where the **Target **is the BP_ParkourPlayerController you retrieved from the overlapping Actor.
- Save and compile the Blueprint.

## Test Your Respawn Mechanics

Add a **BP_DangerZone **to your level and resize it as desired. Now play your game and confirm the following:

- Running into a danger zone before collecting any checkpoints returns the player to the original spawn point.
- Collecting checkpoints and then touching a danger zone returns the player to the most recent checkpoint they collected.
- Pressing the key or button you bound to IA_Restart restarts the level.

The player captures a checkpoint and then touches a danger zone, respawning at the last checkpoint location.

In your obstacle course, place danger zones beneath the parts of the course where a missed jump would otherwise leave the player stranded, such as the gaps between platforms.

After the final checkpoint, add a message with a Text Render Actor (-> designer-01-project-setup-and-level-blockout-in-unreal-engine), imported asset, or Widget Blueprint (-> widget-blueprints-in-umg-for-unreal-engine) (UI message) that tells the player they need to press the Restart key (R or other button) to try again.

## Building Your Obstacle Course

You now have the moves and the game objects you need, so it's time to finish building your course. The example images shown below are from a sample course.

Introduce one movement mechanic at a time, and design each section so the player has to use that mechanic to get through it. A ledge the player can't reach with a single jump teaches the double jump far better than a sign does. Once the player clears a section, place a checkpoint to mark the progress they've earned, then combine that mechanic with the ones they already know in the section that follows.

Give the player somewhere safe to practice before adding consequences. The first time they try a wall run, let a missed attempt drop them somewhere they can climb out of and try again. While the player is still learning, a lower platform they can reach with a single jump gives them a way back without returning to the last checkpoint.

Once they're comfortable, repeat the mechanic over a danger zone. Place danger zones beneath the parts of the course where a missed jump would otherwise leave the player stranded, such as the gaps between platforms.

Guide the player's eye through the course. Confined walls, contrasting colors, and grapple points suspended in open air all signal where to go next.

 Distinct wall sections show where the player is able to wall run.

Sections that turn a corner or hide the next platform need a clear visual cue, such as a lighting change, a sign, or large arrow, or players lose their momentum searching for the path.

[image: Arrows show wall run direction and which way to turn at this blind corner.]

Incrementally increase the challenge. First with one mechanic, and then by combining many mechanics. For example, wall running skill can progress like this:

- Single wall run on a straight wall.
- Multiple wall run, jumping between straight walls.
- Grappling hook to a curved wall run.
- Jumping between multiple curved walls and precisely landing on a small platform.

 The first wall run section is a single run over a safe space, while the final wall run section requires jumping from wall to wall over a danger zone.

Remember to add the `NoWallRun` tag to the walls that bound your play area so players can't wall run past whole sections of the course.

Add signs where a section introduces a new move, and include the controls the player needs. After the final checkpoint, add a sign or Widget Blueprint (UI message) telling the player to press the restart key to try again. You can use **Text Render** Actors to block out signage in your level.

## Next Up

You did it! You have a parkour character, a full obstacle course, and a respawn loop. To add more to your game, these modules from Your First Game in Unreal Engine (-> your-first-game-in-unreal-engine) cover features that build on what you've made:

- [image: Module 2: Setting Up the Start Countdown] Module 2: Setting Up the Start CountdownIn this module, we will show you how to create a countdown timer that plays at the start of the level. You will create an animated 3, 2, 1 countdown using Unreal Motion Graphics (UMG) and then use Blueprint logic to make it play at the start of the level. (-> module-2-setting-up-the-start-countdown-in-unreal-engine)

- [image: Module 3: Creating the Game Timer] Module 3: Creating the Game TimerIn this module, we will show you how to create a game timer that counts down and tracks the time in Blueprint, and convert the time to a minutes and seconds format. (-> module-3-creating-the-game-timer-in-unreal-engine)

- [image: Module 4: Creating the Game Over and Level Complete Screens] Module 4: Creating the Game Over and Level Complete ScreensCreate win and loss states using Game Over and Level Complete screens built in Unreal Motion Graphics (UMG). (-> module-4-creating-the-game-over-and-level-complete-screens)

On this page

- Save the Player’s Start Location (-> 06-parkour-player-respawn-with-mover)
- Update the Respawn Location (-> 06-parkour-player-respawn-with-mover)
- Teleport the Player When Respawning (-> 06-parkour-player-respawn-with-mover)
- Add a Restart Level Control (-> 06-parkour-player-respawn-with-mover)
- Optional: Check if the Player Is Finished (-> 06-parkour-player-respawn-with-mover)
- Create a Danger Zone (-> 06-parkour-player-respawn-with-mover)
- Create a Danger Zone Material (-> 06-parkour-player-respawn-with-mover)
- Create the Danger Zone Blueprint (-> 06-parkour-player-respawn-with-mover)
- Test Your Respawn Mechanics (-> 06-parkour-player-respawn-with-mover)
- Building Your Obstacle Course (-> 06-parkour-player-respawn-with-mover)
- Next Up (-> 06-parkour-player-respawn-with-mover)

Related documents

Build a Parkour Platforming Game with Mover

 [image: Build a Parkour Platforming Game with Mover] (-> mover-00-build-a-platformer-course-with-mover)Mover

 [image: Mover] (-> mover-in-unreal-engine)FTeleportEffect (-> API)Project Setup and Level Blockout

 [image: Project Setup and Level Blockout] (-> designer-01-project-setup-and-level-blockout-in-unreal-engine)

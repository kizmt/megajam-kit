# Mover Project and Character Setup

https://dev.epicgames.com/documentation/en-us/unreal-engine/mover-01-project-and-character-setup?application_version=5.9

> Set up a new C++ project, the Mover plugin, and a player Pawn that functions with a Character Mover Component.

[image: Mover Project and Character Setup]

Learn to use this **Experimental** feature, but use caution when shipping with it.

To get started, you need a project and a character with a moveset that allows them to smoothly maneuver through a parkour-style obstacle course.

You’ll base your character off an existing example Pawn provided in the Mover plugin. This sample demonstrates several traversal abilities such as vaulting, dashing, double jumping, and crouching, and includes Blueprint logic that connects player input to those movement behaviors. You’ll use the sample Pawn as a foundation, using some of its included actions as well as building new actions from scratch with the Mover system.

## Create a Project and Add the Mover Plugin

To prepare a new project, create a new C++ project based on the First-Person Template, add the Mover plugin in Unreal Editor, and then add Mover to your code source.

To create a new game project from a template, follow these steps:

- Open Unreal Engine and click **New Project**.
- In the **Unreal Project Browser**, go to the **Games **project category, and select the **First Person** template.
- In the **Project Defaults**, change the project type to **C++**. Keep all other defaults.[image: New project window with C++ selected in Project Defaults.]
- Name your project. This tutorial uses `ParkourGame` as the project name.
- Click **Create**.

You’ll be working with reflected types in this tutorial, so remember to disable **Live Coding** in Unreal Editor for a more stable coding experience.

To add Mover to your project, follow these steps:

- When your project opens in Unreal Editor, go to **Edit > Plugins**.
- In the search bar, search for `Mover`.
- Enable the **Mover **and **Mover Examples** plugins.[image: Mover and Mover Examples plugins in the Plugins window in Unreal Editor.]
- Restart Unreal Engine to finish adding the plugins to your project.

To add the Mover plugin to your `.Build.cs` file, follow these steps:

- In Visual Studio, in the solution’s **Games > ProjectName > Source > ProjectName** folder, open your project’s `.Build.cs` file. It should be in **Games > ProjectName > Source > ProjectName**.
- In `PublicDependencyModuleNames`, add:`Mover`
- `CableComponent` (used in the Grappling Hook Movement Mode)
- `GameplayTags` (UCommonLegacyMovementsettings uses Gameplay Tags internally)

 C++

```
		PublicDependencyModuleNames.AddRange(new string[] {
			"Core",
			"CoreUObject",
			"Engine",
			"InputCore",
			"EnhancedInput",
			"AIModule",
			"StateTreeModule",
			"GameplayStateTreeModule",
			"UMG",
```

- Save the file and close Visual Studio (VS).
- In Unreal Editor, go to **Tools > Refresh Visual Studio Project**.
- Open your project in Visual Studio again and rebuild the project.

## Set Up a Pawn with a First-Person Camera

For this project, you’ll modify a character that is packaged with the Mover Examples plugin.

Instead of duplicating a sample Character Blueprint Class, you’ll duplicate a **Pawn **Blueprint Class. A Character is a subclass of Pawn that includes a CapsuleComponent and CharacterMovementComponent. A plain Pawn is more lightweight and requires you to implement your own movement logic, which you’ll do with the Mover plugin. The example Pawn has a third-person camera, so for this project, you'll create a first-person variation of the sample Pawn.

To create a new Pawn based from Mover’s AnimatedMannyPawnExtended Pawn, follow these steps:

- In the** Content Browser**, in the **Content **folder, create a new folder named `Parkour` (or the name of your project) to store assets for your game.
- In the **Parkour** folder, create another new folder named `Blueprints`.[image: Folder structure in the Content Browser, showing the All > Content > Parkour > Blueprints folder.]
- Navigate to **All > Engine > Plugins > Mover Examples > Pawns**.
- Right-click **AnimatedMannyPawnExtended** and select **Duplicate**. Name the copy `BP_ParkourPawn`.
- Move the copy to your **Content > Parkour > Blueprints** folder.
- Double-click the Pawn to open it in the Blueprint Editor.

To modify the Pawn to be first-person, follow these steps:

- In the **Components **panel, keep **BP_ParkourPawn** selected.
- In the Details panel, turn on these settings to enable strafing:In the **Aiming **section, enable** Should Strafe** to prevent the Pawn from rotating to match its direction of movement.[image: Should Strafe property in the Details panel]
- In the **Pawn **section, enable **Use Controller Rotation Yaw** to make the character always face the camera’s direction.

- In the **Component **panel, select **SpringArm**.[image: The Pawn's Components panel, with SpringArm highlighted.]A Spring Arm Component is an adjustable, collision-aware camera boom that maintains a set distance between the camera and mesh.
- This Pawn is set up with a third-person camera, but the parkour game should be played in first person. In the **Details **panel, adjust the following settings to convert the setup from third-person to a first-person perspective:In the **Transform **section, set **Location **to **-2.0, 30.0, 165.0**.
- In the **Camera **section, set **Target Arm Length** to **0.0**.
- In the **Camera Settings** section, enable **Use Pawn Control Rotation** so the camera follows the player’s look input instead of inheriting rotation from the parent component.[image: Details panel with Location, Target Arm Length, and Use Pawn Control Rotation properties highlighted.]

- Save and compile your Blueprint.

Because **AnimatedMannyPawnExtended** is a third-person character adapted for this tutorial series, the shortened Spring Arm creates a first-person view but causes the camera to clip through walls when the player presses against one. If you continue working on your project after completing this series, you can replace the character with a dedicated first-person character.

Instead of a CharacterMovementComponent you may have worked with in other projects, this character uses an ExtendedCharacterMoverComponent which is part of the Mover plugin.

- **CharacterMovementComponent**: Provides a built-in locomotion system that manages predefined movement modes like walking and falling. With this system, you can modify movement behavior with exposed properties like speed or friction, or by subclassing the component and overriding its underlying movement logic.
- **ExtendedCharacterMoverComponent**: Replaces the built-in movement component with the Mover plugin’s modular system, so you can customize and extend behavior more directly.

## Create a Game Mode and Player Controller

Your C++ project comes with basic premade classes, including a GameMode class and PlayerController class. From these classes, you’ll derive Blueprints to use in your Parkour level.

To derive Game Mode and Player Controller Blueprints that you can use with your levels, follow these steps:

- In the **Content Browser**, navigate to **All > C++ Classes > ProjectName**.
- Right-click on your project’s GameMode class and select **Create Blueprint class based on ParkourGameMode**.
- Name this new blueprint `BP_ParkourGameMode`.[image: Right-click ParkourGameGameMode and select Create Blueprint class from the context menu.]
- For the **Path**, select your **Content > Parkour > Blueprints** folder, and then click the **Create **button.
- Return to your **C++ Classes > ProjectName** folder and create a Blueprint class based on the provided **PlayerController** class.
- Name the new Blueprint `BP_ParkourPlayerController` and create it in your **Content > Parkour > Blueprints** folder.[image: Highlighting the new Game Mode and Player Controller Blueprints.]

To set up your Game Mode and project settings with the correct default classes, follow these steps:

- Open your new GameMode Blueprint. In the **Details **panel, in the **Classes **section, change the **Player Controller Class** to **BP_ProjectNamePlayerController**.
- Set the **Default Pawn Class** to **BP_ParkourPawn**.[image: BP_ParkourGameMode properties]
- Compile your GameMode Blueprint, and save your GameMode and (unchanged) PlayerController Blueprints.
- Return to the main level editor, go to **Edit > Project Settings**.
- In the left panel, in the **Project **section, select **Maps & Modes**.
- Set the **Default GameMode** to your new GameMode Blueprint. Ensure the asset you select has the **BP** prefix. Close Project Settings.[image: The Default GameMode dropdown list in Project Settings.]
- Next to the level’s **Details **panel, click the **World Settings** panel. In the **Game Mode** section, set the **GameMode Override** to **None **so the template level’s settings don’t override your default Game Mode.[image: World Settings tab highlighting the GameMode Override option.]If you don’t see the **World Setting** panel, go to the **Window **menu and select **World Settings**.
- Save your level.

## Set Up Player Input

For the Parkour game, you’ll need the following moveset for your player:

- Forward, back, left, and right movement
- Look around (rotate the camera)
- Jump and double jump
- Sprint (make the character run faster while a key is continuously pressed)
- Dash (make the character quickly dash forward when a key is pressed)
- Use Grappling Hook (make the character fly towards grappling anchor point when a key is pressed)

Your character comes with some of these actions, and you’ll implement the rest.

### Create Input Actions

First, you’ll set up Input Action assets for each move the player can perform in the game.

For more information about the Enhanced Input system, see Enhanced Input (-> enhanced-input-in-unreal-engine) or the Create a Flashlight with Enhanced Input (-> module-2-create-a-flashlight-with-enhanced-input) tutorial.

To duplicate and modify existing Input Actions, follow these steps:

- In the **Content Browser**, go to **Content > Parkour** and create a new folder named `Input`. In the Input folder, create another new folder named `Actions`.
- Go to **Content > Input > Actions**. Duplicate **IA_Jump**, name it `IA_ParkourJump`, move it to your new **Content > Parkour > Input > Actions** folder, and open it.
- In the **Details **panel, next to **Triggers**, click the bin icon to delete both triggers.
- Save and close the Input Action.
- In the **Content Browser**, in **Content > Input > Actions**, duplicate **IA_Look**, name it `IA_ParkourLook`, move it to your new **Actions **folder, and open it.
- Next to **Modifiers**, click the plus icon (**+**) to add an element.
- For the new modifier element, select **Dead Zone**.
- Keep the Dead Zone’s default values, and save and close the Input Action.
- In the **Content Browser**, in **Content > Input > Actions**, duplicate** IA_Move**, name it `IA_ParkourMove`, move it to your new **Actions **folder, and open it.
- Change the **Value Type** to** Axis3D (Vector)**, and save and close the Input Action.

To create three new Input Actions, follow these steps:

- In the **Content Browser**, in the **Content > Parkour > Input > Actions** folder, create three new Input Action assets:**IA_Dash**
- **IA_GrapplingHook**
- **IA_Sprint**

- Ensure these three Input Actions all have **Value Type** set to **Digital (bool)** and have no **Triggers **or **Modifiers**.

### Create an Input Mapping Context

The Input Mapping Context maps keyboard, mouse, or gamepad buttons to the Input Actions you created.

To set up a new Input Mapping Context with your actions, follow these steps:

- Go to the** Content > Input** folder, duplicate **IMC_Default**, and name it `IMC_Mover`.
- Move **IMC_Mover** to **Content > Parkour > Input** and open it.
- Expand **Mappings > Default Key Mappings > Mappings**.
- Edit the **IA_Jump** action mapping:Use the dropdown-menu to change** IA_Jump** to** IA_ParkourJump**.

- Edit the **IA_Move** action mapping:Change **IA_Move** to **IA_ParkourMove**.
- Expand the **W** control binding and delete all **Modifiers**.
- Expand the **S **control binding and delete the S**wizzle Input Axis Values** modifier.
- Expand the **A** control binding, add a second element to the **Modifiers **list, and set the new modifier to **Swizzle Input Axis Values**.
- Expand the **D** control binding, add an element to the **Modifiers **list, and set it to **Swizzle Input Axis Values**.
- Delete the **Up**, **Down**, **Left**, and **Right **action mappings.

- Edit the **IA_Look **action mapping:Change **IA_Look **to **IA_ParkourLook**.
- Next to **IA_ParkourLook**, click **+** to add another control binding.
- Click the **None **drop-down list, search for **Mouse XY 2D-Axis**, and select it.

- Bind **IA_GrapplingHook**:Next to the **Mappings **category heading, click **+** to add a new action mapping.
- In the new action mapping drop-down menu, select **IA_GrapplingHook**. Expand the mapping.
- Click the **keyboard **button, and press **G**.
- Expand the control binding, add a **Trigger**, and set it to **Pressed**.

- Bind **IA_Sprint**:Add a new action mapping and set it to **IA_Sprint** (make sure to pick the IA_Sprint action in your Parkour folder).
- Set the control binding to **Left Shift**.
- Add a **Trigger **and set it to **Down**.

- Bind **IA_Dash**:Add a new action mapping set to **IA_Dash**.
- Set the control binding to **Left Ctrl**.
- Add a Trigger and set it to Pressed.

- Save and close the Input Mapping Controller.

You can choose your own key mappings for your character’s actions. However, some key mappings (**Shift**, **Ctrl**, **Alt**, etc.) are used by Unreal Editor and therefore may not work when testing your game in the viewport or Play-in-Editor (PIE) mode. If using one of these mappings, test in standalone mode or use a different key during development and then switch to the desired key before packaging your game. Key mappings that are usually safe in PIE mode include letter and number keys, arrow keys, **Caps Lock**, **Enter**, **Backspace**, **Page Up**, **Page Down**, **Home**, and **End**.

If you’d like to add gamepad support to your game, add these control bindings to your IMC:

| Acton Mapping | Key Value | Triggers/Modifiers |
| --- | --- | --- |
| IA_ParkourMove | Gamepad Left Thumbstick | Modifiers: Dead Zone, Swizzle Input Axis Values (YXZ) |
|  | Gamepad D-pad Up | Modifiers: Swizzle Input Axis Values (ZYX) |
|  | Gamepad D-pad Down | Modifiers: Negate, Swizzle Input Axis Values (ZYX) |
| IA_ParkourLook | Gamepad Right Thumbstick 2D-Axis | Modifiers: Negate |
| IA_ParkourJump | Gamepad Face Button Bottom | None |
| IA_GrapplingHook | Gamepad Right Trigger (Digital) | None |
| IA_Sprint | Gamepad Left Trigger (Digital) | None |
|  | Gamepad Left Thumbstick Button | None |
| IA_Dash | Gamepad Face Button Left | None |

### Add Actions to the Pawn

Give the set of actions and mapping context to your Pawn by referencing them in the Pawn’s Blueprint.

To make your Pawn use the new mapping context and input actions, follow these steps:

- Open your character Blueprint (**BP_ParkourPawn**). Ensure you’ve selected the **BP_ParkourPawn** root component.
- In the **Details **panel, in the **Input **section, set the **Move**, **Look **and **Jump Input Action** properties to your Parkour-Game versions.
- In the **Default **section, change the** Input Mapping Contexts Applied** array element to **IMC_Mover**.
- In the **My Blueprint** panel, in the **Functions **section, double-click **ApplyIMC**.
- In the **Add Mapping Context** node, change the **MappingContext **to **IMC_Mover**.
- Go to the **Construction Script** tab. Drag off the **Parent: Construction Script** node’s exec pin and add a **Set Show Controls** node. Keep **Show Controls** disabled to hide the character’s on-screen controls widget.
- In the **My Blueprint **tab, double-click the **EnhancedInputAction IA_Dash **event to go to that node in the Event Graph.
- This event is linked to the IA_Dash in the `/MoverExamples/` folder, so delete it and connect your own:Click and delete the existing **IA_Dash** event node.
- Right-click the graph, search for `IA_Dash` in the node actions list, and select the **IA_Dash Enhanced Action Event** in your project's folder.
- In the **IA_Dash** event node, click the arrow to see more options. Connect the **Started **exec pin to the **Set Is Dash Just Pressed** node.
- Connect the **Completed **exec pin to the **Set Is Dash Pressed** node.

- Save and compile the Blueprint.

## Test Your Input Actions

In the main level editor, play the game and ensure your character can move, look around, and jump.

To test actions with Unreal Engine-reserved keyboard keys like **Ctrl**, play your level in Standalone Game mode. Or, in your IMC, temporarily assign a different key to the action for testing.

If you press **Spacebar **twice, the character performs a double jump. Press **Ctrl **while running to dash forward. The logic that implements this and other actions is already part of the AnimatedMannyPawnExtended Pawn that you created your Pawn from. You’ll use Mover to implement sprinting, grappling, and wall running in later parts of this tutorial series.

## Next Up

Now that your character is set up with all of its actions, you can start adding logic to implement more character actions. First, you’ll use Mover to create a Movement Modifier that makes the Pawn sprint.

- [image: Sprint Movement Modifier] Sprint Movement ModifierBuild a Movement Modifier with Mover in C++ that changes the character’s movement to sprinting speed. (-> mover-02-sprint-movement-modifier)

On this page

- Create a Project and Add the Mover Plugin (-> mover-01-project-and-character-setup)
- Set Up a Pawn with a First-Person Camera (-> mover-01-project-and-character-setup)
- Create a Game Mode and Player Controller (-> mover-01-project-and-character-setup)
- Set Up Player Input (-> mover-01-project-and-character-setup)
- Create Input Actions (-> mover-01-project-and-character-setup)
- Create an Input Mapping Context (-> mover-01-project-and-character-setup)
- Add Actions to the Pawn (-> mover-01-project-and-character-setup)
- Test Your Input Actions (-> mover-01-project-and-character-setup)
- Next Up (-> mover-01-project-and-character-setup)

Related documents

Build a Parkour Platforming Game with Mover

 [image: Build a Parkour Platforming Game with Mover] (-> mover-00-build-a-platformer-course-with-mover)Enhanced Input

 [image: Enhanced Input] (-> enhanced-input-in-unreal-engine)Mover

 [image: Mover] (-> mover-in-unreal-engine)

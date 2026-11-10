# Stack O Bot Sample Game

https://dev.epicgames.com/documentation/en-us/unreal-engine/stack-o-bot-sample-game-in-unreal-engine?application_version=5.9

> A breakdown of the Stack O Bot sample game and what features are used to build it.

[image: Stack O Bot Sample Game]

**Stack O Bot** is a sample game project made as a learning resource for exploring game development with Unreal Engine. It demonstrates various engine features, including **Procedural Content Generation (PCG)**, **Blueprints**, and **level instances**. The sample project includes in-game developer commentary that discusses design choices and implementation, as well as commented Blueprints and materials.

In Stack O Bot, the player controls a robot character from a third-person perspective and must complete a series of platforming challenges and physics-based puzzles. It supports a wide range of devices, from mobile phones to high-end PCs, and can be controlled using keyboard and mouse, controller, and touchscreen inputs.

This page explains how to open the Stack O Bot sample project, provides an overview of the major features of the project, and links to related documentation for further learning.

## Open The Stack O Bot Project

The Stack O Bot sample described on this page is built using Unreal Engine 5.6. To try the older Stack O Bot sample, download the project for engine versions preceding 5.6.

To open the Stack O Bot sample project, follow these steps:

- From Fab, go to the Stack O Bot sample, and click **Add to My Library**.Alternatively, you can search for the sample project from the Fab plugin (-> fab-window-in-unreal-engine) for Unreal Engine.

- Go to **Stack O Bot** and click **Create Project**.
- In the **Epic Games Launcher**, go to **Unreal Engine **> **Library** > **Fab Library**.
- Enter a name and location for your project.
- Select **5.6 **as the engine version.
- Click **Create**. The project will open.

To learn more about accessing sample content and the Fab plugin for Unreal Engine, see Samples and Tutorials (-> samples-and-tutorials-for-unreal-engine).

### Recommended System Specifications

Stack O Bot is designed to support a wide range of devices, including mobile phones and PC. The content scales across detail levels and is fully mobile-compatible.

The following system specifications are recommended for a PC:

- Windows 10 64-bit version 1909 revision .1350 or higher, or versions 2004 and 20H2 revision .789 or higherWindows 11 is compatible with Unreal Engine 5 and fits in the recommended specs.

- Quad-core Intel or AMD, 2.5 GHz or faster
- 32 GB of system RAM
- 8 GB of VRAM
- DirectX 11 or 12 compatible graphics card

## Navigating The Stack O Bot Project

After you open the Stack O Bot project, the **Lvl_Empty** map opens by default in the level editor (-> level-editor-in-unreal-engine). The map provides some on-screen information for using this sample project.

Most of the contents of the sample project are located in the `/Content/StackOBot/` folder. The main game map, **Lvl_StackOBot**, is located in the `/Content/StackOBot/Maps` folder.

To play the game, click the **play** icon in the **Main Toolbar**.

The game starts with a main menu, which is contained in the **Lvl_MainMenu** map. Click **PLAY** to go to the main game map, **Lvl_StackOBot**.

[image: The Stack O Bot main menu]

The main game map includes bubble icons that trigger developer commentary when the player gets close. This commentary explains some of the implementation details and design decisions the developers made when making Stack O Bot.

[image: A bubble icon in Stack O Bot]

The content of the developer commentary bubbles is located in the `/Content/DevCom` folder.

### Stack O Bot In-Game Controls

To play Stack O Bot, the player can use a keyboard and mouse, controller, or touchscreen controls.

| Action | Keyboard and Mouse | Controller | Touch (see image below) |
| --- | --- | --- | --- |
| Move | W, A, S, D | Left thumbstick | 1 |
| Look | Mouse | Right thumbstick | 2 |
| Jump | Space (press) | Bottom face button (press) | 3 (press) |
| Jetpack | Space (hold) | Bottom face button (hold) | 3 (hold) |
| Grab | E | Right trigger | 4 |
| Pause | Escape or Left Shift | Start button | 5 |

[image: Touch controls for Stack O Bot] Touch controls for Stack O Bot

## Stack O Bot Features

This section describes the features used in the Stack O Bot sample project, and the locations of related assets in the project folder.

### Level Introduction

Stack O Bot starts with a level introduction, built as a level sequence using Sequencer (-> unreal-engine-sequencer-movie-tool-overview). In the level sequence, three cinematic cameras and a camera cut track are used to move around the level and show various elements of the game map.

The level sequence (**SQ_Lvl1_fly**) is located in the `/Content/StackOBot/Maps` folder.

### Customizable Third-Person Character

The Stack O Bot project includes a third-person character that moves, jumps, and can interact with non-player characters (NPCs) and objects. The Blueprint for the character, **BP_Bot**, combines an animation graph (-> graphing-in-animation-blueprints-in-unreal-engine), a control rig (-> control-rig-in-unreal-engine), and customizable materials (-> unreal-engine-materials).

The animation graph is used for animating the character in various states, such as standing, running, or jumping. The control rig is used for contextual animations, such as positioning the character's feet on different surfaces, and for guiding the hand to the button position when pressing buttons. The customizable materials include parameters to change color combinations and facial expressions for the character.

The **BP_Bot **Blueprint is located in the `/Content/StackOBot/Blueprints/Character` folder, and the character animations and materials are located in the `/Content/StackOBot/Characters/Bot` folder.

### Procedural Content Generation (PCG)

The map in Stack O Bot is created using Procedural Content Generation (PCG) (-> procedural-content-generation-overview). PCG is used to make many of the assets, including the floating islands, the foliage, the platforms, the hexagonal domes, the fences, and the coin spawners.

The platforms are created by setting a size, using existing tile pieces, and a set of rules to keep the platforms visually consistent. Domes are placed throughout the map, but you can set a level entrance and exit that is left clear of domes.

The fences are created using a PCG system that samples a spline, **PCG_BP_FenceSpline**, and applies rules to generate the different parts of the fence, like posts and end caps. The map includes coin spawners, which also use PCG to spawn coins along a spline.

The PCG content is located in the `/Content/StackOBot/Blueprints/PCG` folder.

### Smart UV-Less Materials

The Stack O Bot project uses smart UV-less materials to apply high-quality textures to every mesh in the map with a concrete, metal, or painted surface, such as the floating platforms, the metal cylinders, and the metal parts of the bio dome structure. Instead of creating UV channels (-> using-uv-channels-with-static-meshes-in-unreal-engine) for each section of a mesh, the team added vertex color (-> paint-vertex-colors-tool-in-unreal-engine) information to each mesh using modeling tools (-> modeling-tools-in-unreal-engine). The smart materials then use the vertex colors to position the texture on each mesh.

### HLOD Generation

The map in Stack O Bot is large with many assets to render, so the project uses the Hierarchical Level of Detail (HLOD) (-> hierarchical-level-of-detail-in-unreal-engine) system in Unreal Engine to improve performance when playing the game.

### StateTree NPC Behavior

Stack O Bot includes NPCs that can interact with the player character. The NPCs walk around parts of the map, chase the player if they are nearby, bump into the player to knock them back, and can be destroyed when the player character jumps on their heads. The NPC behavior is controlled using a StateTree (-> overview-of-state-tree-in-unreal-engine), which defines the different states that each NPC can be in (such as idle, walking, or dead), and the actions that the NPC should perform in each state.

The StateTree for the NPCs is located in the `/Content/StackOBot/AI/STree_Bug` folder.

### Modular Level Instances

Stack O Bot uses level instances (-> level-instancing-in-unreal-engine) to create re-usable modular level segments. For example, there are level instances with variants of the floating islands that you can use to build game maps without having to create unique content for each new area.

Each level instance can be played as a standalone map, or added to a World Partition (-> world-partition-in-unreal-engine) map. When placed in another map, each instance has a transform so it can be rotated and positioned.

You can add objects to an instance that are tagged **Main World Only** in the object's details panel. These objects only show up if the instance is played as a standalone map, and not if you use the map as a level instance in a World Partition map. Check the **Main World Only **checkbox on lighting, player starts, and other objects that you don’t want to use in the World Partition map, but do want to use when testing and debugging the level instance as a standalone map.

Level instances are located in the `/Content/StackOBot/Maps/LevelInstances` folder. Level instances that use objects tagged as Main World Only have a `Main World` folder that includes these objects.

### Physics-based Interactions

Stack O Bot uses Unreal Engine's physics (-> physics-in-unreal-engine) systems to implement physics objects, interactions, and destruction.

For physics objects like the stackable crates, the player character grabs them using a physics handle. Objects like the bounce pads and fans use physics commands to throw the player in the air. Floating platforms and bridges use a physics constraints setup. Destructible objects, like the roofs and respawning platforms, use a pre-fractured geometry collection (-> geometry-collections-user-guide) that the Chaos master field triggers.

The physics objects are located in the `/Content/StackOBot/Blueprints/PhysicsElements` folder.

### Dynamic Camera

Stack O Bot uses a custom player camera manager (-> cameras-in-unreal-engine) (**BP_CamManager**) to create three distinct camera types:

- A third-person camera that follows behind the player
- A locked third-person perspective designed to show off various elements of the game map from a cinematic angle
- A side-scrolling implementation designed to recreate the style of classic 2D platform games

The third-person camera that follows the player is used throughout most of the main map. When standing on certain moving platforms, the camera switches to the locked third-person perspective. There is one part of the map where the camera switches to the side-scrolling perspective.

The camera manager transitions between all 3 camera types using a Blueprint actor (**BP_GameCamVolume**), logic in the camera manager, and an interface (**BPI_CamManager**) to communicate between the manager and the Blueprint actor.

The camera manager and game camera volume Blueprint are located in the `/Content/StackOBot/Blueprints/Camera` folder.

### Gameplay Interactions

Stack O Bot includes an interaction handler component (-> unreal-engine-terminology) that is added to any actor that the player character can interact with. This applies to objects like buttons and pressure pads.

Objects that can be grabbed, like the crates, have the **GRAB **actor tab that is checked by the **Grab_Check** function in **BP_Bot**. Grabbed objects are updated by the **Grab_Update** function.

The interaction handler component is located in the `/Content/StackOBot/Blueprints/GameElements` folder. The grab logic is included in the **BP_Bot** Blueprint, which is located in the `/Content/StackOBot/Blueprints/Character` folder.

### Objective Tracking

Stack O Bot implements an objective system using the Game Mode (-> game-mode-and-game-state-in-unreal-engine). You can tag interactive actors using the **IsObjective** boolean in the interaction handler blueprint component. When the player interacts with the tagged actor, the objective updates.

The objectives are tracked in the game's user interface (UI) (-> user-interfaces-and-huds-in-unreal-engine). The interaction handler sends the object status to the UI and updates the UI as necessary.

Objectives are also visually represented in the map by the **BP_Portal** actor, which has one light per objective. The lights turn on as the objectives are completed. After all objectives are completed and all lights are lit, the portal becomes active and the trigger collision is enabled. This activation allows the player to complete the map by entering the portal. The interaction handler component manages the logic for the lights and the portal.

The interaction handler component (**BPC_InteractionHandler**) and the portal blueprint (**BP_Portal**) are located in the `/Content/StackOBot/Blueprints/GameElements` folder. The user interface asset (**HUD_InGame**) is located in the `/Content/StackOBot/Blueprints/Framework` folder.

- animation
- blueprints
- physics
- level instancing
- programming
- mobile
- statetree
- procedural generation
- fab
- learning

On this page

- Open The Stack O Bot Project (-> stack-o-bot-sample-game-in-unreal-engine)
- Recommended System Specifications (-> stack-o-bot-sample-game-in-unreal-engine)
- Navigating The Stack O Bot Project (-> stack-o-bot-sample-game-in-unreal-engine)
- Stack O Bot In-Game Controls (-> stack-o-bot-sample-game-in-unreal-engine)
- Stack O Bot Features (-> stack-o-bot-sample-game-in-unreal-engine)
- Level Introduction (-> stack-o-bot-sample-game-in-unreal-engine)
- Customizable Third-Person Character (-> stack-o-bot-sample-game-in-unreal-engine)
- Procedural Content Generation (PCG) (-> stack-o-bot-sample-game-in-unreal-engine)
- Smart UV-Less Materials (-> stack-o-bot-sample-game-in-unreal-engine)
- HLOD Generation (-> stack-o-bot-sample-game-in-unreal-engine)
- StateTree NPC Behavior (-> stack-o-bot-sample-game-in-unreal-engine)
- Modular Level Instances (-> stack-o-bot-sample-game-in-unreal-engine)
- Physics-based Interactions (-> stack-o-bot-sample-game-in-unreal-engine)
- Dynamic Camera (-> stack-o-bot-sample-game-in-unreal-engine)
- Gameplay Interactions (-> stack-o-bot-sample-game-in-unreal-engine)
- Objective Tracking (-> stack-o-bot-sample-game-in-unreal-engine)

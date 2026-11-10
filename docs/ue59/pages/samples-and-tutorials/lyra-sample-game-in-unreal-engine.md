# Lyra Sample Game

https://dev.epicgames.com/documentation/en-us/unreal-engine/lyra-sample-game-in-unreal-engine?application_version=5.9

> Explore how to develop projects in UE5 using techniques from the Lyra Sample Game.

[image: Lyra Sample Game]

**Lyra** is a learning resource designed as a sample game project to help you understand the frameworks of Unreal Engine 5 (UE5). Its architecture is designed to be modular, including a core system and plugins that are updated regularly along with the development of UE5.

- Cross-Platform compatibility and scalability.
- Online Multiplayer and cross-play support for Epic Online Services and Console Online Subsystems.
- Features a choice between three different Game modes: Elimination (Team Deathmatch), Control (Capture the Control point) and Exploder (a top down party game).
- A customized Gameplay Ability System.
- Niagara FX.
- Unreal Motion Graphics (UMG) widget classes and UI Icons for the project's gameplay concepts including menu settings, controller key sticks, and displays for health, mana, and ammo. These UI features are designed with modularity so you could use their systems in your own game independent of Lyra.
- Optimized, hand-crafted content including locomotion animation assets, sounds, and a weapon system compatible with any Pawn.
- New UE5 Mannequins, Manny, and Quinn. These Mannequins are playable characters that share the same core skeleton hierarchy as MetaHumans, with a compatible animation system.

## Downloading the Lyra Starter Game

To install the Lyra Starter Game sample project, follow these steps:

- Access the Lyra Starter Game sample from **Fab** and click **Add to My Library** for the project file to show in the **Epic Games Launcher**.Alternatively, you can search for the sample project using Fab in Launcher, or the Fab plugin for UE.

- From the **Epic Games Launcher** go to **Unreal Engine > Library > Fab Library** to access the project.Sample projects only appear in **Fab Library** when you have the compatible engine version installed.
- Click **Create Project** and follow the on-screen instructions to download the sample and start a new project.

To learn more about accessing sample content from Fab, see Samples and Tutorials (-> samples-and-tutorials-for-unreal-engine).

## Downloading Lyra for Engine Source Builds

You can download your own source build of Unreal Engine, refer to Downloading Unreal Engine SourceCode.

When you have finished downloading your Unreal Engine source build, you will want to download and install Lyra inside the top level directory of your custom-built engine. After selecting a top level directory, it will create a LyraStarterGame subdirectory, then create a LyraStarterGame.uproject file including the source code and content.

[image: lyra-uproject-directory]

To launch your installed copy of the sample, you can either double click the `.uproject` file or launch the sample directly from the Library tab of the launcher.

[image: lyra-sample-from-library-launcher]

If you are using a custom-built version of the engine, you can recreate project files and launch Lyra as a project from inside your source code editor such as Visual Studio.

If you right click the `LyraStarterGame.uproject` file you can associate it with a different installed version of the engine if you have multiple copies installed, or generate project files for compiling with a source code editor.

[image: uproject-options-list]

## Playing the Game Sample

When you launch Lyra, the **DefaultEditorOverview** level will be loaded as the **Default Map**. From the Editor, you can click on **Play In Editor**(**PIE**) to launch the default level.

[image: play-in-editor-arrow]

When in PIE, Your Player Controller will take possession of the Lyra Pawn. In the level there are several portals that load into an **Experience**.

[image: main-game-select]

The table below provides a brief description into each map:

| Game Mode Map | Description | Content File Path |
| --- | --- | --- |
| **Control** | Secure the control points along with your teammates to increase your score and win. | `/ShooterMaps/Maps/L_Convolution_Blockout` |
| **Elimination** | Find and eliminate enough enemies to win in this classic head-to-head team match. | `/ShooterMaps/Maps/L_Expanse` |
| **Front End** | Contains the Main Menu of the Lyra sample game. | `/Game/System/FrontEnd/Maps/L_LyraFrontEnd` |
| **Default Map** | The base example of the user facing map. | `/Game/System/DefaultEditorMap/L_DefaultEditorOverview` |
| **Shooter Gym** | A small test level to test the ShooterCore plugin functionality. | `/ShooterCore/Maps/L_ShooterGym` |
| **Exploder** | Destroy blocks, collect power-ups, and avoid getting exploded in this top-down party game. | `/TopDownArena/Maps/L_TopDownArenaGym` |

The maps for each game mode can be loaded directly in the editor by using **File > Open Level** and navigating to the content file paths listed above.

[image: using-the-open-level-window]

Most of the maps are located inside game feature plugins. After loading a map like **Expanse** for the first time, the **Editor Viewport** will be empty because it is a **World Partition** map.

[image: expanse-world-partition]

To see the level Actors, select the **world partition grid cells** by clicking and dragging in the bottom right **World Partition** details panel, then right click and select **Load Selected Cells** to load that part of the map.

Using PIE while one of the Game Mode levels is open will load the appropriate game mode as if you had walked into the appropriate portal on the default map.

For more information on Lyra's Game maps and menus, refer to the A Tour of Lyra (-> tour-of-lyra-in-unreal-engine) reference page.

## Lyra Framework Systems

Lyra makes use of the **Gameplay Feature Plugins**, this means that the Content folder only contains generic assets and the main lobby, however, the plugins folder contains the different core elements that create the Lyra Starter Game.

[image: plugins-content-folder]

When a game experience is chosen inside the lobby, the game will load the plugins that are required. For example, choosing the **Expanse** Team Deathmatch_ map will load **ShooterCore** for the pawn and mechanics, and **ShooterMaps** for the level.

| Plugin Folder Name | Description |
| --- | --- |
| **Lyra Example Content** | Contains shared materials, such as grids. |
| **Shooter Core Content** | The core elements of the LyraShooterGame experience. This includes gameplay logic for game modes, specific Gameplay Abilities like Dash, and Blueprints for Actors such as teleporters and grenades, Bots, Weapons and User Interface elements. |
| **ShooterMaps Content** | The maps used by the LyraShooterGame (Expanse and Convolution), with associated materials and content. |
| **TopDownArena Content** | The content for the TopDownArena experience, from the map generator to power ups. |

Experiences are defined using a **LyraExperienceDefinition** class. You can access the **Default Gameplay Experience** from the World Settings by navigating to the **Toolbar** > **Window** > **World Settings** > **Game Mode**.

[image: world-settings-experience-definition]

You can think of experiences as a much more advanced version of a GameMode. Multiple Experiences can exist inside a plugin, for example the experiences Team Death Match and Control Points both use the ShooterCore plugins and are derived from the same parent class(**B_LyraShooterGameVase**, a child class of the LyraExperienceDefinition.)

These classes contain the information that are used in Lyra's input and gameplay mechanics. While other options contain information like the scoring system (based on Elimination for Team Deathmatch and Capture for Control Points)

## Topics

- [image: Common User Plugin] Common User PluginThe Common User plugin provides a common interface between C++, Blueprint Scripting, and the Online Subsystem(OSS) or other online backends. (-> common-user-plugin-in-unreal-engine-for-lyra-sample-game)
- [image: Abilities in Lyra] Abilities in LyraAn overview of how Lyra uses the Gameplay Ability System for its Gameplay. (-> abilities-in-lyra-in-unreal-engine)
- [image: Animation In Lyra] Animation In LyraAn overview of the Animation System in Lyra (-> animation-in-lyra-sample-game-in-unreal-engine)
- [image: Lyra Game Settings] Lyra Game SettingsAn overview of Game Settings for the Lyra Game Sample. (-> lyra-sample-game-settings-in-unreal-engine)
- [image: Geometry Tools in Lyra] Geometry Tools in LyraAn overview of how Geometry Tools was used in Lyra to create parametric level level design geometry objects in Blueprints, and the workflows that Level Designers use to build the level with these pieces. (-> lyra-geometry-tools-in-unreal-engine)
- [image: Lyra Input Settings] Lyra Input SettingsAn overview of how Lyra uses its Input Settings system to solve many common input configuration setups. (-> lyra-input-settings-in-unreal-engine)
- [image: Lyra Interaction System] Lyra Interaction SystemAn overview of the Lyra Interaction System for the Lyra Game sample. (-> lyra-sample-game-interaction-system-in-unreal-engine)
- [image: Lyra Inventory and Equipment] Lyra Inventory and EquipmentExplore the Inventory and Equipment systems used in the Lyra Sample Game. (-> lyra-inventory-and-equipment-in-unreal-engine)
- [image: Lyra Scalability and Device Profiles] Lyra Scalability and Device ProfilesAn overview of Scalability and Device Profiles in the Lyra Game Sample. (-> scalability-and-device-profiles-in-lyra-sample-game-for-unreal-engine)
- [image: Tour of Lyra] Tour of LyraReference page of Lyra in Unreal Engine (-> tour-of-lyra-in-unreal-engine)
- [image: Upgrading the Lyra Starter Game to the Latest Engine Release] Upgrading the Lyra Starter Game to the Latest Engine ReleaseDocuments the major changes to Lyra for each engine version and includes information that help you upgrade existing games to take advantage of the newest release of Unreal Engine 5. (-> upgrading-the-lyra-starter-game-to-the-latest-engine-release-in-unreal-engine)
- [image: Using Lyra With Epic Online Services] Using Lyra With Epic Online ServicesA step-by-step tutorial describing how to use the Lyra sample game for working with Epic Online Services. (-> using-lyra-with-epic-online-services-in-unreal-engine)

- animation
- blueprints
- audio
- programming
- ai
- lyra
- shootercore

On this page

- Downloading the Lyra Starter Game (-> lyra-sample-game-in-unreal-engine)
- Downloading Lyra for Engine Source Builds (-> lyra-sample-game-in-unreal-engine)
- Playing the Game Sample (-> lyra-sample-game-in-unreal-engine)
- Lyra Framework Systems (-> lyra-sample-game-in-unreal-engine)
- Topics (-> lyra-sample-game-in-unreal-engine)

Related documents

Samples and Tutorials

 [image: Samples and Tutorials] (-> samples-and-tutorials-for-unreal-engine)

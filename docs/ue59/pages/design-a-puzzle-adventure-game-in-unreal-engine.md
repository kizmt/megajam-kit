# Design a Puzzle Adventure

https://dev.epicgames.com/documentation/en-us/unreal-engine/design-a-puzzle-adventure-game-in-unreal-engine?application_version=5.9

> Learn how to design a full level and gameplay loop in this getting started tutorial!

[image: Design a Puzzle Adventure]

Unreal Engine provides users with the professional-grade tools to bring their game ideas to life. Once you have made decisions about what types of gameplay you want, it’s time to start building the play spaces and environments that will define the visual world of your game.

Designer Track Overview

Game and Level Design is about designing experiences that challenge players while still providing a fun and engaging world that supports those experiences. While the Code a First-Person Adventure Game tutorial focuses on using C++ to create gameplay, you can create many of the same elements using the Blueprint Scripting language. Blueprints provide non-programmers with a flexible scripting language that can be used to create gameplay, scripted events, and interactable elements. Unreal Engine provides the ability to create games using Blueprints, C++, or a mix of both.

This tutorial series takes you through the design process of building a level and several puzzles using blueprints to create a completely playable gameplay experience. You will learn how to create gameplay using Blueprints, as well as how to use and reuse gameplay elements to prototype a level using a process called grayboxing.

[image: Designer Track Puzzles] Designer Track Puzzles

## Designer Track Overview

Throughout this tutorial, you will build an adventure puzzle game with multiple rooms, showcasing different kinds of mechanics.

[image: Overview Diagram of the Designer Track Level] Overview Diagram of the Designer Track Level

- Set up and grayboxing your level. This is an important first step to thinking through your level’s design before you start digging into the level’s mechanics and gameplay.
- Create a key and door open and close mechanic.
- Implement a heads-up-display (HUD) on the player’s user interface using UMG.
- Design the cube puzzles, first with a light switch activator and then with moving platforms.
- Build traps under the platformer and learn about player failure and how to set damage over time.
- Configure enemy pawns to attack the player, and then a sprint movement for the player so they can get past the enemies quickly!
- Add an end state so the game knows when the game is over, plus additional polish!

When you finish the tutorial, you will have a fully functional puzzle game!

## Before You Begin

- If you’re new to Unreal Engine, read the other getting-started pages in Unreal Engine for New Users (-> unreal-engine-for-new-users).
- The Code a First-Person Adventure Game is a tutorial series that uses C++ and Unreal Editor to build a custom player character. You can use what you build in the Programmer Track as a starting point for this track.

## Example Project

Below is a link to download the final sample project that you can build using this tutorial series. You can use this example project to see what your final project might look like, or as a reference to see how we built and designed the project.

Download the Designer Track here

 (Download size: 75 MB)

To open the project, unzip the file and move the **adventuredesigner** folder to your Unreal Projects directory (by default, find this in `C:\Users\UserName\Documents\Unreal Projects`).

## Let’s Go!

- [image: Project Setup and Level Blockout] Project Setup and Level BlockoutGet started planning, designing, and blocking out your puzzle adventure level! Practice using different Viewport modes, transforming objects, and organizing assets in the Outliner. (-> designer-01-project-setup-and-level-blockout-in-unreal-engine)
- [image: Create a Key] Create a KeyUsing blueprints, learn how to create a key that players can pick up. (-> designer-02-create-a-key-in-unreal-engine)
- [image: Open Doors with Keys] Open Doors with KeysConfigure the BP_DoorFrame blueprint so the doors can change color and only open with the matching BP_Key. (-> designer-03-open-doors-with-keys-in-unreal-engine)
- [image: Player HUD] Player HUDCreate a simple heads-up-display (HUD) that updates when the player picks up an item. (-> designer-04-player-hud-in-unreal-engine)
- [image: Puzzles: Switches and Cubes] Puzzles: Switches and CubesIn the first part of the platformer puzzle section, use materials, physics, and blueprints to create a switch that’s activated by a cube. (-> designer-05-puzzles-switches-and-cubes-in-unreal-engine)
- [image: Puzzles: Moving Platforms] Puzzles: Moving PlatformsIn the second part of the platformer puzzle, create the moving platforms with blueprints and learn how to debug your script. (-> designer-06-puzzles-moving-platforms-in-unreal-engine)
- [image: Traps and Damage] Traps and DamageLearn to build environmental blueprints that damage the player and build a game-over loop that triggers when the player is eliminated. (-> designer-07-traps-and-damage-in-unreal-engine)
- [image: Create an Enemy] Create an EnemyBuild game logic to create Enemy Characters that deal and receive damage. (-> designer-08-create-an-enemy-in-unreal-engine)
- [image: Add a Sprint Mechanic to the Player] Add a Sprint Mechanic to the PlayerUse Input Actions to add a sprint mechanic to the player character's move set. (-> designer-09-sprint-input-action-in-unreal-engine)
- [image: Complete the Level] Complete the LevelFinish the level by completing the gameplay loop and configuring an end state for the player. (-> designer-10-complete-the-level-in-unreal-engine)
- [image: Bonus: Spawn New Cubes] Bonus: Spawn New CubesAdd a new mechanic to your puzzle adventure game where BP_Cube actors spawn to a specified limit. (-> designer-11-spawn-new-cubes-mechanic-in-unreal-engine)

- blueprint
- level design
- beginner
- graybox

On this page

- Designer Track Overview (-> design-a-puzzle-adventure-game-in-unreal-engine)
- Before You Begin (-> design-a-puzzle-adventure-game-in-unreal-engine)
- Example Project (-> design-a-puzzle-adventure-game-in-unreal-engine)
- Let’s Go! (-> design-a-puzzle-adventure-game-in-unreal-engine)

Related documents

Code a First-Person Adventure Game

 [image: Code a First-Person Adventure Game] (-> code-a-firstperson-adventure-game-in-unreal-engine)Art Pass for a Puzzle Adventure Game

 [image: Art Pass for a Puzzle Adventure Game] (-> art-pass-for-a-puzzle-adventure-game)Your First Hour in Unreal Engine

 [image: Your First Hour in Unreal Engine] (-> first-hour-in-unreal-engine)Unreal Engine for New Users

 [image: Unreal Engine for New Users] (-> unreal-engine-for-new-users)

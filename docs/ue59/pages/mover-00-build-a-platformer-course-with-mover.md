# Build a Parkour Platforming Game with Mover

https://dev.epicgames.com/documentation/en-us/unreal-engine/mover-00-build-a-platformer-course-with-mover?application_version=5.9

> Learn to use C++, Mover, and Blueprints to build a Pawn with a fluid, fast-paced moveset that can traverse a parkour-style obstacle course.

[image: Build a Parkour Platforming Game with Mover]

Learn to use this **Experimental** feature, but use caution when shipping with it.

Where the traditional Character Movement Component (-> comparing-mover-and-character-movement-component-in-unreal-engine) gives you a set of predefined movement parameters to work with, you can use the **Mover** plugin to define new, modular movement behaviors in C++ and integrate them into your character.

With Mover, you'll build **Movement Modifiers** that adjust existing movement parameters, and **Movement Modes** that take over how the character moves while they're active. During gameplay, the character's Mover Component layers Movement Modifiers or transitions between Movement Modes depending on input or environment.

Mover also adds rollback networking support, which rolls the character’s position back if there is a slight lag between the client and the server, ensuring that your players have a smooth, lag-free, experience. This makes Mover a strong foundation for multiplayer games because it produces tight, responsive controls that are well-suited for fast-paced action games and platforming games alike.

This tutorial series teaches you how to create custom Movement Modifiers and Movement Modes for your character with Mover. To do this, you’ll build a first-person parkour game that uses a Mover-enabled Pawn. In this series, you’ll learn the implementation details as well as the design rationale. So, you’ll not only understand how to write each system, but you’ll also understand how the Mover-enabled Pawn communicates with its movement components.

## Parkour Game Overview

Starting from a new C++ project, you’ll take a sample Pawn from the Mover plugin and implement sprinting as a Movement Modifier and grappling and wall running as Movement Modes in Mover. As you implement the two Movement Modes, you’ll also learn how Mover’s simulation tick and sync state system work in practice. You'll finish the series with a complete, playable parkour game with a timed obstacle course, a save system for best run times, and a level design that teaches and challenges the player.

Through this tutorial, you’ll learn how to:

- Create a Movement Modifier struct by deriving from `FMovementModifierBase`.
- Build custom Movement Mode classes and integrate them with a Mover-enabled Pawn.
- Use Actor Components to communicate between a Pawn and its Movement Modes.
- Use the Mover plugin to teleport the player to a respawn point.
- Design a level that teaches movement mechanics progressively.

## Before You Begin

This tutorial series requires Unreal Engine 5.8 or later.

Before starting this tutorial, complete these requirements:

- Set Up Visual Studio for Unreal Engine (-> setting-up-visual-studio-development-environment-for-cplusplus-projects-in-unreal-engine).
- Be familiar with basic Unreal Editor skills such as:Manipulating objects in viewports.
- Creating assets.
- Working with Blueprints and basic Materials. If you’re new to Unreal Engine, read Unreal Engine for New Users (-> unreal-engine-for-new-users).

- Be comfortable with intermediate C++ and have prior experience writing C++ in Unreal Engine.If you're new to C++ in Unreal Engine, complete Code a First-Person Adventure Game (-> code-a-firstperson-adventure-game-in-unreal-engine).

## Let's Go!

- [image: Mover Project and Character Setup] Mover Project and Character SetupSet up a new C++ project, the Mover plugin, and a player Pawn that functions with a Character Mover Component. (-> mover-01-project-and-character-setup)
- [image: Sprint Movement Modifier] Sprint Movement ModifierBuild a Movement Modifier with Mover in C++ that changes the character’s movement to sprinting speed. (-> mover-02-sprint-movement-modifier)
- [image: Grappling Hook Movement Mode] Grappling Hook Movement ModeBuild a Movement Mode in C++ that gives a character the ability to grapple towards a target. (-> mover-03-grappling-hook-movement-mode)
- [image: Wall Running Movement Mode] Wall Running Movement ModeBuild a Movement Mode in C++ that gives a character the ability to run along walls and jump from wall to wall. (-> mover-04-wall-running-movement-mode)
- [image: Track Progress With Checkpoints] Track Progress With CheckpointsBuild a Checkpoint gameplay object in C++ and Blueprints to track a player’s progress through a platforming obstacle course and set where they respawn. (-> parkour-05-course-progress-with-checkpoints)
- [image: Player Respawn With Mover] Player Respawn With MoverUse Mover to teleport the player to a respawn location. (-> 06-parkour-player-respawn-with-mover)

On this page

- Parkour Game Overview (-> mover-00-build-a-platformer-course-with-mover)
- Before You Begin (-> mover-00-build-a-platformer-course-with-mover)
- Let's Go! (-> mover-00-build-a-platformer-course-with-mover)

Related documents

Code a First-Person Adventure Game

 [image: Code a First-Person Adventure Game] (-> code-a-firstperson-adventure-game-in-unreal-engine)Unreal Engine for New Users

 [image: Unreal Engine for New Users] (-> unreal-engine-for-new-users)Your First Game in Unreal Engine

 [image: Your First Game in Unreal Engine] (-> your-first-game-in-unreal-engine)Mover

 [image: Mover] (-> mover-in-unreal-engine)

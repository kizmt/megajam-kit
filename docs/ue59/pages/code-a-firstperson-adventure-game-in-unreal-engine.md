# Code a First-Person Adventure Game

https://dev.epicgames.com/documentation/en-us/unreal-engine/code-a-firstperson-adventure-game-in-unreal-engine?application_version=5.9

> Learn how to create C++ classes that implement the basic mechanics of a first-person game.

[image: Code a First-Person Adventure Game]

Using C++ with Unreal Engine gives you full control and access to the engine’s features so you can create new functionality within your project. It's perfect for creating complex systems, optimizing performance, and taking your game to the next level!

You can use **Blueprints** or C++ classes to create new functionality through code in Unreal Engine. Blueprints is the engine’s visual coding tool. It’s beginner friendly, easy to discover, and quick to edit. You’ll edit Blueprints in UE’s Blueprint Editor and end up with a Blueprint-type asset in your Content Browser.

However, Blueprints can become hard to read and manage as they grow in complexity. In larger projects, C++ is more concise to read, performs faster, and gives you access to all functionality within Unreal so you get full control over gameplay mechanics.

C++ and Blueprints also work together! You can extend your C++ class to a Blueprint so designers can easily tweak variables or use it in a more visual way. The Blueprint acts as a child of the C++ class, inheriting all functionality of the class.

A first-person player character collects two pickups, equips a dart launcher, and shoots some darts.

In this tutorial, you’ll use C++ and Unreal Editor to set up a new UE code project and build a custom player character.

This tutorial requires Unreal Engine 5.6.1 or later. Unreal Engine 5.6.0 has a known issue that breaks Blueprint creation from C++ in Blueprint-based projects, which is required for this tutorial series.

## Before You Begin

- Read the other getting-started pages in Unreal Engine for New Users (-> unreal-engine-for-new-users).
- Set Up Visual Studio for Unreal Engine (-> setting-up-visual-studio-development-environment-for-cplusplus-projects-in-unreal-engine)

## Let's Go!

- [image: Set Up and Compile Your Project] Set Up and Compile Your ProjectLearn how to set up and compile a new C++ game project from a template. (-> coder-01-set-up-and-compile-a-cplusplus-project-in-unreal-engine)
- [image: Create a Player Character With Input Actions] Create a Player Character With Input ActionsLearn how to start building a C++ character with Input Actions. (-> coder-02-create-a-player-character-with-input-actions-in-cplusplus)
- [image: Configure Character Movement] Configure Character MovementLearn how to bind player input to character movement in C++. (-> coder-03-configure-character-movement-with-cplusplus-in-unreal-engine)
- [image: Add a First-Person Camera, Mesh, and Animation] Add a First-Person Camera, Mesh, and AnimationLearn how to use C++ to attach mesh and camera components on a first-person Character. (-> coder-04-adding-a-firstperson-camera-mesh-and-animation)
- [image: Manage Items and Data] Manage Items and DataLearn to use Item Data Structs, Data Assets, and Data Tables to define items and store and organize item data for scalability. (-> coder-05-manage-item-and-data-in-an-unreal-engine-game)
- [image: Create a Respawning Pickup Item] Create a Respawning Pickup ItemLearn how to use C++ to create custom pickups and initialize them in your level. (-> coder-06-create-a-respawning-pickup-item-in-unreal-engine)
- [image: Equip Your Character] Equip Your CharacterLearn to use C++ to create custom equippable items and attach them to your character. (-> coder-07-equip-your-character-with-cplusplus-tools)
- [image: Implement a Projectile] Implement a ProjectileLearn to use C++ to implement projectiles and spawn them during gameplay. (-> coder-08-implement-a-projectile-in-unreal-engine)

On this page

- Before You Begin (-> code-a-firstperson-adventure-game-in-unreal-engine)
- Let's Go! (-> code-a-firstperson-adventure-game-in-unreal-engine)

Related documents

Your First Hour in Unreal Engine

 [image: Your First Hour in Unreal Engine] (-> first-hour-in-unreal-engine)Design a Puzzle Adventure

 [image: Design a Puzzle Adventure] (-> design-a-puzzle-adventure-game-in-unreal-engine)Art Pass for a Puzzle Adventure Game

 [image: Art Pass for a Puzzle Adventure Game] (-> art-pass-for-a-puzzle-adventure-game)

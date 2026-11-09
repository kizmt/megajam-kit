# Skeletal Mesh Actors

https://dev.epicgames.com/documentation/en-us/unreal-engine/skeletal-mesh-actors-in-unreal-engine?application_version=5.9

> Use Skeletal Mesh Actors to create player avatars and populate your game world.

[image: Skeletal Mesh Actors]

The **Skeletal Mesh Actor** displays an animated mesh whose geometry can be deformed, typically through the use of control points during animation sequences. These can either be created and exported from external 3D animation applications, or programmed directly in Unreal Engine.

To learn more about how to import content into Unreal Engine, refer to the Importing Assets Directly (-> importing-assets-directly-into-unreal-engine) page.

Like the name suggests, Skeletal Meshes have a **skeleton** that consists of a number of **bones**. These are used in the animation process.

Skeletal Mesh Actors are commonly used to represent player characters, NPCs, other animated creatures, and complex machinery. The Unreal Engine Mannequin that appears in the Third Person template is an example of a Skeletal Mesh Actor.

## Placing a Skeletal Mesh Actor

The quickest way to place a Skeletal Mesh Actor is to drag it into the Level Viewport from the Content Browser. You can then use its Transform properties to place it where it needs to be.

 [image: Placing a Skeletal Mesh Actor from the Content Browser]

To learn about other methods for placing Actors, refer to the Placing Actors (-> placing-actors-in-unreal-engine) page.

## Animating a Skeletal Mesh Actor

There are two basic ways to animate a Skeletal Mesh Actor in Unreal Engine:

- Using an Animation Blueprint (-> animation-blueprints-in-unreal-engine) to play and blend multiple animations together.

- Using an Animation Asset to play a single Animation Sequence (-> animation-sequences-in-unreal-engine) one time or in a loop.

To learn more about animating Skeletal Meshes, refer to the Skeletal Mesh Animation System (-> skeletal-mesh-animation-system-in-unreal-engine) page.

## Changing a Skeletal Mesh Actor's Material

You can override the material of a Skeletal Mesh Actor individually to change its appearance. This is useful if you want to use the same Static Mesh in the Level multiple times, but want to have some variation between them.

The example below shows three Skeletal Mesh Actors that use the Unreal Mannequin Skeletal Mesh. Each Actor uses a different Material.

 [image: Unreal Mannequins using different Materials]

To replace the Material assigned to a Skeletal Mesh, locate the Material in the Content Browser, then drag it over the Skeletal Mesh Actor in the Level Viewport, as shown in the example below.

 [image: Changing a Skeletal Mesh Actor's Material]

To use a Material with a Skeletal Mesh Actor, you need to enable the **Used with Skeletal Mesh** option. To do this:

- In the **Content Browser**, double click the **Material** to open it in the **Material Editor**.

- In the **Details** panel, enable the **Used with Skeletal Mesh** option.

The Used with Skeletal Mesh option in the Material Editor. Click for full size.

## Skeletal Mesh Actor Collision

Normal collision creation and detection does not work with Skeletal Mesh Actors. To have your Skeletal Meshes collide with objects in the Level, your Skeletal Mesh Actors need to have a **Physics Asset** that is specifically created for them.

To learn more about Physics Assets and their use, refer to the Physics Asset Editor (-> physics-asset-editor-in-unreal-engine) documentation.

To create and assign a Physics Asset to a Skeletal Mesh Actor, follow these steps:

- Find the **Skeletal Mesh** in the **Content Browser** and right-click it.

- In the **context menu**, select **Create > Physics Asset > Create and Assign**.

 [image: Creating and assigning a Physics Asset to a Skeletal Mesh]

Creating and assigning a Physics Asset to a Skeletal Mesh.

- actors

On this page

- Placing a Skeletal Mesh Actor (-> skeletal-mesh-actors-in-unreal-engine)
- Animating a Skeletal Mesh Actor (-> skeletal-mesh-actors-in-unreal-engine)
- Changing a Skeletal Mesh Actor's Material (-> skeletal-mesh-actors-in-unreal-engine)
- Skeletal Mesh Actor Collision (-> skeletal-mesh-actors-in-unreal-engine)

Related documents

Actors and Geometry

 [image: Actors and Geometry] (-> actors-and-geometry-in-unreal-engine)

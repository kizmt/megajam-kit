# Static Mesh Actors

https://dev.epicgames.com/documentation/en-us/unreal-engine/static-mesh-actors-in-unreal-engine?application_version=5.9

> Place Static Mesh Actors in your Level to create your game world.

[image: Static Mesh Actors]

The **Static Mesh Actor** is a simple type of Actor that displays a 3D mesh in the Level. Although the name implies that the Actor is static (or unable to move), the "static" refers to the type of mesh used rather than the Actor's ability to move. A mesh is **static** if its geometry does not change. Otherwise, the Actor itself can be moved or changed in other ways during play.

Static Mesh Actors are commonly used to create game worlds or other types of environments.

Unreal Engine includes the following default Static Mesh Actors:

- Cube

- Sphere

- Cylinder

- Cone

- Plane

In addition to these, you can import your own Static Mesh Actors that were created in other 3D applications.

To learn more about how to import content into Unreal Engine, refer to the Importing Assets Directly (-> importing-assets-directly-into-unreal-engine) page.

## Placing a Static Mesh Actor

The quickest way to place a Static Mesh Actor is to drag it into the Level Viewport from the Content Browser. You can then use its Transform properties to place it where it needs to be.

 [image: Placing a Static Mesh Actor through drag-and-drop]

To learn about other methods for placing Actors, refer to the Placing Actors (-> placing-actors-in-unreal-engine) page.

## Changing a Static Mesh Actor's Material

You can override the Materials applied to a Static Mesh individually for each Static Mesh Actor. This way, you can use a single Static Mesh Asset more than once in a Level while giving each a unique appearance.

The example below shows three Static Mesh Actors that use the same Static Mesh, which is a simple three-dimensional cube. Each Actor uses a different Material.

 [image: Three Static Mesh Actors using different Materials]

To replace the Material assigned to a Static Mesh, locate the Material in the Content Browser, then drag it over the Static Mesh Actor in the Level Viewport, as shown in the example below.

 [image: Changing the Material assigned to a Static Mesh Actor]

To learn about other methods for assigning a Material to a Static Mesh, refer to the Setting Up Materials With Static Meshes (-> using-materials-with-static-meshes-in-unreal-engine) page.

## Moving a Static Mesh Actor During Gameplay

An Actor's **Mobility** setting controls whether an Actor can move or change in some way during gameplay.

By default, Static Mesh Actors have **Static** mobility. To move, rotate, or scale a StaticMeshActor during play, you must first make it **Movable**. To do this, in the Actor's **Details** panel, set its **Mobility** to **Movable**.

 [image: An Actor's Movable Mobility property]

To learn more about different Mobility settings and how they affect Static Mesh Actors, refer to the Actor Mobility (-> actor-mobility-in-unreal-engine) page.

## Enabling Physics for Static Mesh Actors

If you want a Static Mesh Actor to be affected by gravity and collisions, enable the **Simulate Physics** property in the Actor's **Details** panel.

 [image: A Static Mesh Actor's Simulate Physics property]

You can read more about how physics are implemented in Unreal Engine in the Physics (-> physics-in-unreal-engine) section.

In the example below, the sphere Static Mesh Actor has **Simulate Physics** enabled. When simulation starts, gravity affects the sphere and makes it fall until it collides with the ground.

 [image: A sphere Static Mesh Actor affected by gravity]

## Enabling Collision for Static Mesh Actors

**Collision** is an Actor's property to react to other Actors in the environment when they collide with that Actor.

By default, if a Static Mesh has **Physics Bodies**, either generated in your 3D authoring package (see FBX Content Pipeline (-> fbx-content-pipeline)) or in the **Static Mesh Editor** (see Collision Response Reference (-> collision-response-reference-in-unreal-engine)), it will have collision and it will be set to **Block All**.

Refer to the Collision (-> collision-in-unreal-engine) documentation for more information on different types of collision and how they affect a Static Mesh Actor.

On this page

- Placing a Static Mesh Actor (-> static-mesh-actors-in-unreal-engine)
- Changing a Static Mesh Actor's Material (-> static-mesh-actors-in-unreal-engine)
- Moving a Static Mesh Actor During Gameplay (-> static-mesh-actors-in-unreal-engine)
- Enabling Physics for Static Mesh Actors (-> static-mesh-actors-in-unreal-engine)
- Enabling Collision for Static Mesh Actors (-> static-mesh-actors-in-unreal-engine)

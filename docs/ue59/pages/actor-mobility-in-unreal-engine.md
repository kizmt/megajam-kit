# Actor Mobility

https://dev.epicgames.com/documentation/en-us/unreal-engine/actor-mobility-in-unreal-engine?application_version=5.9

> Setting that controls whether an Actor can move or change in some way during gameplay.

[image: Actor Mobility]

The **Mobility** setting controls whether an Actor can move or change in some way during gameplay. This primarily applies to Static Mesh Actors and Light Actors. It is located in the Actor's **Details** panel, under the Actor's Transform coordinates.

 [image: Mobility setting in an Actor's Details panel]

The Mobility setting in an Actor's Details panel.

An Actor that supports this setting can have one of three mobility states:

- Static

- Stationary

- Movable

## Static Actors

**Static** mobility is reserved for Actors that will not move or update in any way during gameplay.

**Static Mesh** Actors whose mobility is set to Static have their shadows contribute to pre-calculated lightmaps that use Lightmass to generate and process them. This mobility makes them ideal for structural or decorative meshes that never need to relocate during gameplay. Note, however, that their Materials can still be animated.

**Light** Actors whose mobility is set to Static contribute to pre-calculated lightmaps that use Lightmass. They illuminate the Level for Static and Stationary Actors. For Movable Actors, they use an indirect lighting method like Volumetric Lightmaps (-> volumetric-lightmaps-in-unreal-engine).

For more information, refer to the Static Light Mobility (-> static-light-mobility-in-unreal-engine) page.

## Stationary Actors

**Stationary** mobility is reserved for Actors that can change during gameplay but not move.

**Static Mesh** Actors whose mobility is set to Stationary can be changed but not moved. They do not contribute to pre-calculated lightmaps using Lightmass and are lit like Movable Actors when lit by a Static or Stationary Light. However, when lit by a Movable Light, they will use a Cached Shadow Map to reuse for the next frame when the light is not moving, which can improve performance for projects using dynamic lighting.

**Light** Actors whose mobility is set to Stationary can change in some way during gameplay, such as having their color or intensity changed (to be brighter or dimmer), or even being completely off. Stationary lights still contribute to pre-calculated lightmaps using Lightmass but can also cast dynamic shadows for moving objects.

Too many Stationary Lights affecting the same Actor can have a significant impact on performance. Refer to the page for more information.

## Movable Actors

**Movable** mobility is reserved for Actors that need to be added, removed, or changed in some way during gameplay. This includes moving, scaling, swapping with another Actor, and so on.

**Static Mesh** Actors whose mobility is set to Movable cast fully dynamic shadows that do not contribute to precomputed lighting stored in lightmaps. The way Movable Static Mesh Actors interact with lights depends on the light type:

- **Movable** light: The Actor only casts only a dynamic shadow.

- **Stationary** light: The Actor uses a combination of dynamic shadowing and precomputed lighting data, such as Volumetric Lightmaps.

- **Static** light: The Actor is only lit by precomputed lighting data and does not cast any dynamic shadows.

- **Light** Actors whose mobility is set to Moveable can only cast dynamic shadows. In addition to being able to move the light during gameplay, they can also change their color and intensity at runtime and have it update the scene accordingly. However, care must be taken when making these lights cast dynamic shadows since their shadowing method is the most performance intensive, depending on which shadow-casting features (-> shadowing-in-unreal-engine) are enabled for your project.

Movable lights also support Lumen, a dynamic global illumination and reflections system.

Non-shadow-casting Movable Lights add no cost to scene rendering due to Unreal Engine's Deferred rendering system.

- actors

On this page

- Static Actors (-> actor-mobility-in-unreal-engine)
- Stationary Actors (-> actor-mobility-in-unreal-engine)
- Movable Actors (-> actor-mobility-in-unreal-engine)

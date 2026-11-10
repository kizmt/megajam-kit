# Colliders, Triggers, and Pickups in Parrot

https://dev.epicgames.com/documentation/en-us/unreal-engine/colliders-triggers-and-pickups-in-parrot-for-unreal-engine?application_version=5.9

> Collisions and triggers in Project Parrot.

## Collision Types

Collision in Unreal Engine is similar to Unity but has some differences that are covered here. If you have used Unity’s layer-based collision detection, the project collision settings should look similar to the collision matrix. You can access this by going to **Edit >** **Project Settings > Collision**. If you expand the **Preset** tab, you can see all of the default preset profiles with a description of what they do.

[image: Image of the options on the Engine Collision landing page with descriptions of presets.]

You will notice that Unreal has a few more options when it comes to resolving collisions. These are covered in depth in the Unreal Engine Collision Overview (-> collision-in-unreal-engine---overview). This level of granularity in collision detection is nice to have and can help your game’s performance. It’s important to understand:

- Channels or individual colliders can be set to Blocking, Overlap, or Ignore.

- A common mistake is not having the Generate Overlap Events checkbox set correctly on your colliders when you need those events.

- Static geometry should be blocking and overlapping but not necessarily generate overlap or hit events since it’s not needed for gameplay.

- Overlap events can be generated even if an object blocks another - particularly when traveling at high speeds. In Unity, this can be a problem if you’re directly modifying the translation instead of a Rigidbody component. Doing so bypasses physics considerations.

- In Unreal, when you call any function that updates an actor’s transform, there are two boolean parameters that dictate how you’d like the actor to move: - **Sweep** sets to true triggers overlaps and stops that actor short of the destination if blocked. **Teleport** determines whether or not the physics velocity is preserved.

- Channels can also be used for Traces which are equivalent to Unity’s physics cast (i.e. Raycast, SphereCast etc.). You can pass the channel during your Line Trace function call the same way you would pass the layer mask in a Raycast in Unity.

### Parrot Custom Collision Types

Parrot has a few custom collision object channels setup: **Player**, **Cannonball**, and **Enemy**.

[image: Object channel menu options for Player, Cannonball, or Enemy.]

By adding these object types, Parrot can control exactly how these object channels interact with trace channels as collision traces occur in the world. A default response is set for what should generally happen - but this can be customized as desired. Parrot also has a few custom trace channel presets: **Player**, **OverlapAllPlayers**, **BlockAllPlayers**, **Cannonball**, and **Enemy**.

[image: Image of trace channel presets in Parrot.]

These presets are particularly useful for gameplay triggers. For example, `OverlapAllPlayers` can ignore all other collisions and just respond to collision events with player collision object types. If you look at the collision settings for different meshes in the game, you will see these presets used frequently.

Collision settings can also be customized on a per mesh basis if desired.

### World Bounds

When creating your levels, something to note is the **World Bounds**. This can be set from **World Settings > World**. You can implement a custom damage type for when an actor interacts with these defined world bounds. Parrot bounds use a combination of the **KillZ** world setting and **Out of Bounds** trigger volumes.

[image: Image of the KillZ setting.]

## Trigger Volumes

Unreal Engine has built-in trigger volume actors (see Trigger Volume Actors in Unreal Engine (-> trigger-volume-actors-in-unreal-engine)) that can be used to trigger events. Examples where developers use these in Parrot are **Out Of Bounds** and **Finish Line** trigger volumes. Trigger volumes are often used in conjunction with the level blueprint (see the developer document Level Blueprints in Parrot (-> unreal-engine-level-blueprints-in-parrot)) but do not have to be. Parrot's trigger for Out Of Bounds is a box trigger with a straightforward event graph:

[image: Example of out of bounds trigger with image of coast line in game.]

[image: Image of Blueprints workflow in UE.]

If you look at the actor’s collision settings in the Details panel, you’ll see the collision channel preset does most of the work here.

[image: Image of the Collision presets options.]

### Power Pickup

Let’s take a look at a practical example of the collision system with Parrot’s powerup pickup implementation. If you open **BP_PickupBase under Content** **>** **Blueprints** **> Pickups** and look at the viewport you can see the hierarchy which contains the collision component.

[image: Image of item in viewport with hierarchy in folders in left nav menu.]

The collision settings and the Out of Bounds have a trigger preset that generates overlap events with players:

[image: Image of checkbox for Generate Overlap Events option.]

If you look at the Event Graph, you’ll see the `ActorBeginOverlap` event with Other Actor as a parameter. This event works much like `OnCollisionEnter` in Unity. The difference here is that instead of being passed a collider component, you’re given the actor itself.

Parrot casts to check that the actor is a player that has overlapped. Then the `OnPickedUp` event is called. This allows derived blueprint classes to define their own behavior for `OnPickedUp` while the base class handles the actor overlap event itself.

The developers use the base blueprint to handle having all pickups play a sound and spawn some particle effects. The pickup sound and particle effect variables are instance-editable so that they can be set in the class defaults of the derived classes. **Class Defaults** are located in the Blueprint editor at the top by the compile button:

[image: Class Defaults option in the menu bar settings.]

An example of changed class defaults can be found with the speed pickup, which uses a Niagra system with green particles (versus the heart pickup that uses pink). Similarly, the pickup mesh itself can be set on derived blueprints. The last step in the overlap logic is to destroy the pickup actor since we don’t want it to persist after a player has collected it.

With only a few nodes, you’re able to create some robust logic that can expand to derived blueprints with ease. All derived blueprints stem from an overlap event tied to the actor.

## Player Character Jumping Off an Enemy

Another great example to look at is the player jumping off of an enemy. The enemy’s capsule collider type is ‘enemy’ and will collide with player object types. Enemies with swords also have a similar overlap event. These are commonly referred to as hit-boxes and are where an attack is effective.

But when a player goes to jump off an enemy, how does Parrot get around this? The solution was to place a hurt-box on the enemies heads. When the player overlaps this hurt-box volume, the player character can then do a series of checks to see if it’s a valid jump based on the location of the character, the location of the hurt-box, and the box extents. If the checks pass, the player can perform their jump and hit the enemy. The heavy lifting is once again done by the collision channels filtering to just the overlaps that Parrot cares about - a player collision object and an enemy on the hurt-box volume.

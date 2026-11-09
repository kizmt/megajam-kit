# Physics Components

https://dev.epicgames.com/documentation/en-us/unreal-engine/physics-components-in-unreal-engine?application_version=5.9

> Details some of the Components used in Physics, including the Physical Animation, Thruster, and Force Components.

[image: Physics Components]

The Physics Components are used to affect any objects that are utilizing physics at your level in varying ways.

## Physical Animation Component

The **Physical Animation Component** applies a **physics simulation** on top of the animation of a **Skeletal Mesh**. By using this component you can apply realistic physical simulations to specific groups of bones in the Skeletal Mesh, while still playing an animation.

 [image: Physical Animation Component]

## Physics Constraint Component

A **PhysicsConstraintComponent** is a joint that allows you to connect two rigid bodies. You can create different types of joints using the various parameters of this Component.

By using a **Physics Constraint Component** and two **Static Mesh Components**, you can create dangling type objects such as a tire swing, heavy bag, or sign that reacts to physics in the world allowing players to interact with the Component (see **Constraints Blueprints (-> physics-constraint-component-user-guide-in-unreal-engine)** for an example in **Blueprints**).

 [image: Physics Constraint Component]

## Physics Handle Component

The **Physics Handle Component** is an object for "grabbing" and moving physics objects around while allowing the object you are grabbing to continue to use physics. An example of this could be in the form of a "gravity gun" where you can pick up and drop physics objects (see the **Physics Content Examples** (-> physics-in-unreal-engine) for more information).

 [image: Physics Handle Component]

## Physics Thruster Component

A **Physics Thruster Component** is used with objects that have physics to apply a specified force down the negative-X direction (i.e. point X in the direction you want to thrust in). The thruster uses continuous force and can be auto-activated, activated ,or deactivated through the script.

An example of using a thruster is in the form of a rocket (pictured below) which continuously applies force propelling the rocket upward (since the thruster is positioned under the rocket). You can contain the movement of the Component that is influenced by a thruster by using **Blocking Volumes**.

 [image: Physics Thruster Component]

## Radial Force Component

The **Radial Force Component** is used to emit a radial force or impulse that can affect physics objects and or destructible objects. Unlike a **Physics Thruster Component**, this type of Component applies a "fire-and-forget" type of force and is not continuous.

You can use this type of Component to push the fractured pieces of a destroyed object, for example, an explosion. Using a **Radial Force Component** to specify the force and direction, when an object is destroyed you can "push" the pieces outwards in a particular direction as seen in the example image below (see the **Destructibles Content Examples** (-> content-examples-sample-project-for-unreal-engine) for more information).

 [image: Radial Force Component]

On this page

- Physical Animation Component (-> physics-components-in-unreal-engine)
- Physics Constraint Component (-> physics-components-in-unreal-engine)
- Physics Handle Component (-> physics-components-in-unreal-engine)
- Physics Thruster Component (-> physics-components-in-unreal-engine)
- Radial Force Component (-> physics-components-in-unreal-engine)

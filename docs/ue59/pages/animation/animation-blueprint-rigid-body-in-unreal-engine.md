# RigidBody

https://dev.epicgames.com/documentation/en-us/unreal-engine/animation-blueprint-rigid-body-in-unreal-engine?application_version=5.9

> Describes the RigidBody node and how it can be used as a lightweight physics simulation inside Animation Blueprints.

[image: RigidBody]

With the **RigidBody** Animation Blueprint (-> animation-blueprints-in-unreal-engine) node, you can use a character's physics asset (-> physics-asset-editor-in-unreal-engine), to perform light-weight simulated physics motion of a character's auxiliary objects. This document will provide an overview of the RigidBody node and explain how you can get started using the RigidBody node, with an example workflow.

 [image: rigidbody node animation blueprint node]

#### Prerequisites

- Your project contains a Skeletal Mesh (-> skeletal-mesh-assets-in-unreal-engine) character, with an Animation Sequence (-> animation-sequences-in-unreal-engine) or Montage (-> animation-montage-in-unreal-engine).

## Overview

The RigidBody node performs a similar function to the Anim Dynamics (-> animation-blueprint-animdynamics-in-unreal-engine) node, but offers a more feature-rich physics simulation solution by enabling you to integrate a character's physics asset to have better control over the simulation. By using the RigidBody node, in conjunction with a physics asset, you can also simulate collisions with the rest of the character and any other objects in the level.

A typical use case for the RigidBody node is to simulate motion for secondary structures on the character's Skeletal Mesh (-> skeletal-mesh-assets-in-unreal-engine), such as ponytails, chains, or other bones that are hanging or extended from the character's main body that require collision interaction with the rest of the Skeletal Mesh (-> skeletal-mesh-assets-in-unreal-engine) and the level. The RigidBody node can be used to simulate dynamic and reactive motion to these structures in real time, in a more efficient process than more performance demanding techniques, such as true physics simulation.

|  |  |
| --- | --- |
| [image: copy bone demo disabled] | [image: copy bone demo enabled] |
| RigidBody Disabled | RigidBody Enabled |

## Set-Up

The example workflow will demonstrate how you can set-up and implement a RigidBody node in the character's animation blueprint (-> animation-blueprints-in-unreal-engine) using a physics asset to simulate dynamic and reactive motion for secondary structures on your character's Skeletal Mesh (-> skeletal-mesh-assets-in-unreal-engine).

### Creating a Physics Asset

To begin using the RigidBody node, you must first set up a physics asset for your character. A full set up guide can be found in the Creating a New Physics Asset (-> creating-a-new-physics-asset-in-unreal-engine) documentation.

If your character already has an associated physics asset, you can optionally choose to make a specialized physics asset to isolate the secondary structures you are simulating motion and collision with the RigidBody node. Using a specialized physics asset with the RigidBody node can be a more optimal method to better control the behaviors of the structures during the simulation.

 [image: physics asset in the content browser]

If your character does not have a physics asset, or you are choosing to create a specialized physics asset for use with the RigidBody node, you can create a new physics asset for your character by **right-clicking** the character's Skeletal Mesh (-> skeletal-mesh-assets-in-unreal-engine) asset in the **Content Browser** and selecting **Create > Physics Asset > Create**.

 [image: create a new physics asset by right clicking a skeletal mesh in the content browser]

From the **New Physics Asset** window, select **Create Asset** to create a new physics asset for your character.

For more information about creating a physics asset please see the Creating a New Physics Asset (-> creating-a-new-physics-asset-in-unreal-engine) guide.

### Editing the Physics Asset

Open your character's physics asset in the Physics Asset Editor (-> physics-asset-editor-in-unreal-engine) and ensure your character's physics Asset has physics bodies (-> physics-bodies-in-unreal-engine) for the structure or structures you wish to use with the RigidBody node. In the example, physics bodies have been generated for the character's head hoses, as well as the objects the head hoses will interact with, such as the characters head, back, arms and weapon.

 [image: physics asset physics bodies represent collision and components]

With default settings, collision will be disabled on all physics bodies (-> physics-bodies-in-unreal-engine). Enable collision on the bodies that comprise the parts of the Skeletal Mesh (-> skeletal-mesh-assets-in-unreal-engine) you wish to simulate physics motion in the **Skeleton Tree** by **right-clicking** and selecting **Collision > Enable Collision All**.

 [image: enable collision on all]

With all of the bodies that comprise the parts of the Skeletal Mesh (-> skeletal-mesh-assets-in-unreal-engine) you wish to simulate physics and collision selected, set their **Physics Mode** to **Simulated** in the **Details** panel.

 [image: select the physics type as simulated for the hoses]

Select the remaining physics bodies, and set their **Physics Mode** to **Kinematic**.

 [image: set remainging physics bodies to kinematic]

You can test the basic functionality of the physics asset with the **Simulate** button in the Physics Asset Editor (-> physics-asset-editor-in-unreal-engine)'s **Toolbar**.

 [image: demo of siumulaiton]

Jittering or shaking of the simulated objects will be common at this stage, you can fix this issue by enabling and tapering the **Mass (kg)** property on each of the physics bodies. Start by setting the closest body to the parent structure, as the heaviest physics body, and halving the mass for each subsequent body in the chain.

In the example, the first head hose physics body was set to a mass of **2kg**, and the second head hose physics body was set to a mass of **1kg**.

**Mass (kg) properties for Physics Bodies**

Finally, on all of the bodies you are simulating motion and collision with, set a value for the **Linear Damping** and **Angular Damping** properties. Higher values will reduce motion, controlling flailing and shaking of the simulated bodies. In the example, a value of **5.0** was set for each property, but fine tuning this value, for each unique implementation, is essential to achieving ideal results.

 [image: damping settings]

### Animation Blueprint

With a physics asset, you can now add the RigidBody node to the character's Animation Blueprint in the AnimGraph.

The RigidBody node operates within **Component Space**, so a space conversion (-> animation-blueprint-component-space-conversion-in-unreal-engine) will need to occur to implement the node within your character's Animation Blueprint.

By default the RigidBody node will utilize the physics asset associated with the character. If a secondary physics asset is being used, you can define the specific asset in the Rigidbody node's **Override Physics Asset** property in the **Details** panel.

 [image: override physics asset porperty in the rigidbody nodes details panel]

### Adjustments and Tweaks

More adjustments can be made using the constraints in the RigidBody node's properties (**Component Liner Acc Scale**, **Component Linear Vel Scale**, **Component Applies Linear Acc Clamp** and the **Sim Space Settings** properties), or by adjusting the location of the physics bodies (-> physics-bodies-in-unreal-engine) in the physics asset to more closely align with the skeleton's joints.

 [image: scale settings]

You can also adjust the **Center of Mass** property on each physics body in the physics asset to align closer to the nearest skeletal joint, to further reduce shaking and excessive motion.

 [image: adjust the physics bodies]

### Results

Here you can see the final results of the simple implementation of the RigidBody node demonstrated in the example workflow.

 [image: example demo of the rigidbody node]

## Base Bone Simulation Reference

By setting the **Simulation Space** to **Base Bone Space** and defining a **Base Bone** in the RigidBody node's details panel, any joint can be used as a reference point for simulation.

Moving the entire Skeletal Mesh (-> skeletal-mesh-assets-in-unreal-engine) and individually modifying the **Base Bone** will have no effect on velocities. So when using a **Base Bone Space** as the **Simulation Space**, character motion will not influence the simulation.

## Resetting Dynamics

The RigidBody node also supports the **Reset Dynamics** Blueprint node which you can use in the Animation Blueprint's **EventGraph**. To use the function node, get the Animation Instance from the Skeletal Mesh (-> skeletal-mesh-assets-in-unreal-engine) in Blueprint and use the function call, Reset Dynamics node to reset the simulation.

 [image: reset dynamics node aniamtion blueprint event graph]

This function node can be especially useful to reset the simulation, to avoid visual and behavioral issue that could occur, for example, when teleporting a character.

## Property Reference

 [image: rigid body node details panel]

Here you can reference a list of the RigidBody node's **Settings** properties.

| Property | Description |
| --- | --- |
| **Override Physics Asset** | Select the physics asset to use. If empty, use the Skeletal Mesh (-> skeletal-mesh-assets-in-unreal-engine)'s default physics asset. |
| **Override World Gravity** | When enabled, overrides the world gravity, to the set values on the **X**, **Y**, and **Z** axes. |
| **External Forces** | Applies a uniform external force in world-space. This allows for easy simulation of inertia of movement while still simulating in component-space. By default, this property appears as a pin on the node in the **AnimGraph**. |
| **Component Linear Acc Scale** | When using a non-world-space simulation, this property controls how much of the component's world-space acceleration is passed on to the local-space simulation. |
| **Component Linear Vel Scale** | When using a non-world-space simulation, this property applies a drag to the physics bodies (-> physics-bodies-in-unreal-engine) in the local-space simulation, based on the component's world-space velocity. |
| **Component Applied Linear Acc Clamp** | When using non-world-space simulation, this is an overall clamp of acceleration derived from teh **Component Linear Acc Scale** property, to ensure it is not too large. |
| **Cashed Bounds Scale** | Scale of cached bounds (vs. actual bounds). Increasing this may improve performance, but overlaps may not work as well. (A value of 1.0 effectively disables cached bonds). |
| **Base Bone Ref** | When **Simulation Space** is set to **Base Bone**, select a bone from the character's skeleton (-> skeletons-in-unreal-engine) to act as a reference point for the simulation. |
| **Overlap Channel** | The channel used to find static geometry to collide with. Options include: **World Static** **World Dynamic** **Pawn** **Visibility Camera** **Physics Body** **Vehicle** **Destructible** |
| **Simulation Space** | What space to simulate the physics bodies (-> physics-bodies-in-unreal-engine) in. This affects how velocities are generated. Options include: **Component Space**: Simulate in component-space. Moving the entire Skeletal Mesh (-> skeletal-mesh-assets-in-unreal-engine) will have no effect on velocities. **World Space**: Simulate in world-space. Moving the Skeletal Mesh (-> skeletal-mesh-assets-in-unreal-engine) will generate velocity changes. **Base Bone Space**: Simulate in the selected **Base Bone**'s bone-space . Moving the entire Skeletal Mesh (-> skeletal-mesh-assets-in-unreal-engine) and individually modifying the **Base Bone** will have no effect on velocities. |
| **Force Disable Collision Between Constrained Bodies** | Whether to allow collisions between two physics bodies (-> physics-bodies-in-unreal-engine) joined by a constraint. |
| **Transfer Bone Velocities** | When simulation starts, transfer previous bone velocities from the input pose to make transition into simulation seamless. |
| **Freeze Incoming Pose on Start** | When simulating starts, freeze the incoming pose. This is useful for ragdolls, when we want the simulation to take over. It prevents nin simulated bones from animating. |
| **Clamp Linear Translation Limit to Ref Pose** | Correct for lineratearing on bodes with all axes locked. This only works if all axes linear translation are locked. |
| **World Space Minimum Scale** | For world-space simulations, if the magnitude of the component's 3D scale is less than world-space minimum scale do not update this mode. |
| **Evaluation Rest Time** | If the node is not evaluated for this amount of time(seconds), either because a lower LOD was in use for a whole or the component was not visible, rest the simulation to the default pose on the next evaluation. Set to 0 to disable time-based rest. |

### Sim Space Settings

The RigidBody node's Sim Space Settings Settings control the motion passed from the simulation's space into the simulation. This allows the simulation to pass a fraction of the world-space motion onto the physics bodies (-> physics-bodies-in-unreal-engine) which allows **Bone-Space** and **Component-Space** simulations to react to world-space movement in a controllable way.

This system is a superset of the functionality provided by the **Component Liner Acc Scale**, **Component Linear Vel Scale** and **Component Applied Linear Acc Clamp**. For most cases you should not have both systems enabled.

Here you can reference a list of the RigidBody node's Sim Space settings properties.

| Property | Description |
| --- | --- |
| **Master Alpha** | Global multiplier on the effects of simulation space movement. But be in range [0, 1]. If the Master Alpha is set to 0, the system is disabled and the simulation will be fully local, for example, world-space actor movement and rotation does not affect the simulation. When Master Alpha is set to 1, the simulation effectively acts as a world-space simulation, but with the ability to apply limits to other parameters. |
| **Velocity Scale Z** | Multiplier on the Z-Component of velocity and acceleration that is passed to the simulation. Usually from 0.0 to 1.0 to reduce the effects of jumping and crouching on the simulation, but it can be higher than 1.0 if you need to exaggerate this motion. |
| **Max Linear Velocity** | A clamp on the effective world-space velocity that is passed to the simulation. Units are cm/s. The default value effectively means "unlimited". It is not usually required to change this but you would reduce this to limit the effects of drag on the physics bodies (-> physics-bodies-in-unreal-engine) in the simulation (if you have bodies that have linear drag set to non-zero in the physics asset). Expected values in this case would be somewhat less than the usual velocities of your object which is commonly a few hundred for a character. |
| **Max Angular Velocity** | A clamp on the effective world-space angular velocity that is passed to the simulation. Units are radian/s, so a value of about 6.0 is one rotation per second. The default value effectively means "unlimited". You would reduce this (and Max Angular Acceleration) to limit how much bodies fly out when the actor spins on the spot. This is especially useful if you have characters that can rotate very quickly and you would probably want values around or less than 10 in this case. |
| **Max Linear Acceleration** | A clamp on the effective world-space acceleration that is passed to the simulation. Units are cm/s/s. The default value effectively means "unlimited". This property is used to stop the physics bodies (-> physics-bodies-in-unreal-engine) of the simulation flying out when suddenly changing linear speed. It is useful when you have characters that can change from stationary to running very quickly such as in an FPS. A common value for a character might be in the few hundreds. |
| **Max Angular Acceleration** | A clamp on the effective world-space angular acceleration that is passed to the simulation. Units are radian/s/s. The default value effectively means "unlimited". This has a similar effect to Max angular velocity, except that it is related to the flying out of bodies when the rotation speed suddenly changes. Typical limits for a character might be around 100. |
| **External Linear Drag V** | Additional linear drag applies to every body in addition to linear drag specified on them in the physics asset. When combined with external linear velocity, this can be used to add a temporary wind-blown effect without having to tune linear drag on all the bodies in the physics asset. The result is that each body has a force equal to (- External linear drag v * external linear velocity) applied to it, in addition to all other forces. This vector is in simulation local-space. |
| **External Linear Velocity** | Additional velocity is added to the component velocity so the simulation acts as if the actor is moving at speed, even when stationary. Vector is in world-space. Units are cm/s. Could be used for wind effects ext. Typical values are similar to the velocity of the object or effect, and usually around or less than 1000 for characters / wind. |
| **External Angular Velocity** | Additional angular velocity that is added to the component angular velocity. This can be used to make the simulation act as if the actor is rotating even when it is not. For example, to apply physics to a character on a podium as the camera rotates around it, to emulate the podium itself rotating. Vector is in world-space. Units are radian/s. |

- animation
- skeletal control
- physics simulation

On this page

- Prerequisites (-> animation-blueprint-rigid-body-in-unreal-engine)
- Overview (-> animation-blueprint-rigid-body-in-unreal-engine)
- Set-Up (-> animation-blueprint-rigid-body-in-unreal-engine)
- Creating a Physics Asset (-> animation-blueprint-rigid-body-in-unreal-engine)
- Editing the Physics Asset (-> animation-blueprint-rigid-body-in-unreal-engine)
- Animation Blueprint (-> animation-blueprint-rigid-body-in-unreal-engine)
- Adjustments and Tweaks (-> animation-blueprint-rigid-body-in-unreal-engine)
- Results (-> animation-blueprint-rigid-body-in-unreal-engine)
- Base Bone Simulation Reference (-> animation-blueprint-rigid-body-in-unreal-engine)
- Resetting Dynamics (-> animation-blueprint-rigid-body-in-unreal-engine)
- Property Reference (-> animation-blueprint-rigid-body-in-unreal-engine)
- Sim Space Settings (-> animation-blueprint-rigid-body-in-unreal-engine)

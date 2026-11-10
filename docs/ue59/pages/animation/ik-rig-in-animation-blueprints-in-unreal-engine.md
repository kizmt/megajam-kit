# IK Rig in Animation Blueprints

https://dev.epicgames.com/documentation/en-us/unreal-engine/ik-rig-in-animation-blueprints-in-unreal-engine?application_version=5.9

> Use IK Rig in Animation Blueprints to create procedural IK adjustment of your character in gameplay.

[image: IK Rig in Animation Blueprints]

Once your **IK Rig** is created, you can reference it within Animation Blueprints (-> animation-blueprints-in-unreal-engine) to use its IK behavior in gameplay.

This document provides an overview of this process, and the various features available to you.

#### Prerequisites

- You have created an IK Rig for a **Skeletal Mesh**. Refer to the IK Rig Editor (-> ik-rig-in-unreal-engine) page for example setup instructions.

- Your Skeletal Mesh has an **Animation Blueprint**, which the Third Person Template project provides if you do not have one.

- You have a basic understanding of using Animation Blueprints (-> animation-blueprints-in-unreal-engine).

## Setup

IK Rigs are referenced in Animation Blueprints from the AnimGraph panel. Right-click in the **graph** and select **IK Rig** from the **Misc** category to create an IK Rig node.

 [image: ik rig blueprint node]

Once added, you will need to assign your IK Rig to the **Rig Definition Asset** property in the **Details **panel.

 [image: ik rig definition asset]

In common setups the IK Rig node is placed after most of your locomotion and other AnimBP logic. This is so that IK adjustments can occur correctly in sequence after other effects.

 [image: ik rig node graph placement]

## Usage

By default the IK Rig will not cause any change in your animation pose. In order to affect IK changes from the node you need to expose an IK Goal's position, rotation, or both.

To do this, select an **IK Goal** in the **IK Rig editor** and enable **Expose Position** and **Expose Rotation** in the **Details** panel. This will add pins for that goal's position or rotation on the IK Rig node, and expose the goal for manipulation.

 [image: expose position expose rotation]

From here you can create **Variables** for these properties and build logic that manipulates your IK Rig.

You can test the behavior of the IK Rig in the Animation Blueprint by adjusting either the **Goal Position** or **Rotation** pin values.

 [image: ik rig node adjust ik position]

Editing the **Position / Rotation Alpha** will blend the IK effect on/off for that goal on the respective axis.

 [image: position rotation alpha]

## Properties

Selecting the IK Rig node reveals the following IK Rig-specific properties in the Details panel:

 [image: ik rig node properties]

| Name | Description |
| --- | --- |
| **Goals** | The property section will populate for each IK Goal that is exposed, and provide you with additional settings to control its behavior. You can specify a goal to be one of the following types: **Manual Input**, which exposes the Position and Rotation pins on the node for manual control of the goal's transform. You can also choose the position or rotation space that is applied to the goal: **Additive**, which treats the goal transform as a world-space additive offset relative to the to the Bone at the effector. **Component**, which treats the goal transform as being in the space of the Skeletal Mesh Actor Component. **World**, which treats the goal transform as being in world space. **Bone**, where you can specify a Bone within this skeleton for the goal to snap to. This can be useful when using auxiliary Bones, like weapon or prop Bones, which may procedurally adjust. [image: ik goal bone] |
| **Rig Definition Asset** | The IK Rig Asset to modify the incoming pose. |
| **Start from Ref Pose** | Enabling this ignores the incoming pose and instead starts the solve using the Skeletal Mesh reference pose. |
| **Enable Debug Draw** | This enables the visibility of all IK Goals within the Viewport for debugging and preview. [image: enable debug draw] |
| **Debug Scale** | Increases or decreases the scale of the IK Rig debug draw, if Enable Debug Draw is enabled. |

- animation

On this page

- Prerequisites (-> ik-rig-in-animation-blueprints-in-unreal-engine)
- Setup (-> ik-rig-in-animation-blueprints-in-unreal-engine)
- Usage (-> ik-rig-in-animation-blueprints-in-unreal-engine)
- Properties (-> ik-rig-in-animation-blueprints-in-unreal-engine)

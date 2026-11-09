# Full-Body IK

https://dev.epicgames.com/documentation/en-us/unreal-engine/control-rig-full-body-ik-in-unreal-engine?application_version=5.9

> Build Full Body IK systems for your character.

[image: Full-Body IK]

Use Control Rig's Full Body Inverse Kinematic (FBIK) feature to construct rigs in Control Rig with a high degree of control and flexibility. The overall solver method is built on a **Position Based IK** framework, which enables faster rig performance, per-bone settings, preferred angles, squash and stretch, and more. FBIK is designed to act as a procedural adjustment tool within Control Rig, such as for ground alignment, or arm reaching behavior.

This document provides an overview of how to create the FBIK node, and its various features.

#### Prerequisites

- FBIK is a node within the **Control Rig Graph** (-> control-rig-editor-in-unreal-engine), therefore you should have an understanding of the Control Rig Editor.

- You must enable the **FullBodyIK **plugin. To do this, navigate in the Unreal Editor menu bar to **Edit > Plugins** and locate **FullBodyIK**. Ensure the plugin is enabled and restart the editor. [image: full body ik plugin]

- You must have created a Control Rig asset for a character and know how to create controls. See the **Control Rig Quick Start (-> how-to-create-control-rigs-in-unreal-engine)** page for information on how to do this.

## Creation and Setup

FBIK is achieved within Control Rig by creating the FBIK node, then assigning bones and effectors to the appropriate pins.

To start, right-click in the Control Rig graph, and in the context menu select **Hierarchy > Full Body IK**. This will create the Full Body IK node. Connect the node to the **Forwards Solve (-> control-rig-forwards-solve-and-backwards-solve-in-unreal-engine)** node.

 [image: create full body ik control rig node]

### Rig Graph Setup

Next, set the **Root **bone property on the Full Body IK node. In typical full-body setups, this will likely be the hips or pelvis bone.

 [image: full body ik root bone]

Create and add your chosen controls for the FBIK system. Typically these controls correspond to the limbs you want to affect, and are based on the primary ending bone of the chain. In this example, controls are created for the head, hands, and feet.

 [image: full body ik controls]

### Effector Setup

You will need to add an effector pin for each control added to the graph. To do this, click the **Add (+)** button next to the **Effectors **property. Effectors will need to be created for each control.

 [image: full body ik effectors]

Expanding one of the Effectors entries will reveal its properties. Within each Effector you will set the corresponding **Bone **value for the control, then connect the Transform pins from the corresponding **Get Transform** node.

 [image: full body ik effectors]

Connect each effector to their corresponding Get Transform nodes in the same way until all effectors and controls are connected.

 [image: full body ik effectors]

### Setup Result

You should now have a basic FBIK setup for your character. You can manipulate the controls within the Control Rig viewport to see the results.

 [image: full body ik setup]

## Bone Settings

Depending on your setup, the base FBIK behavior may not behave as intended. This might be because certain bone settings are not enabled. **Bone Settings** are properties within the Full Body IK node, and are used to control the behavior of each bone that FBIK is affecting.

Bone Settings are added to the Full Body IK node by clicking the **Add (+)** button next to **Bone Settings**, then specifying the bone you wish to affect in the **Bone **property. Each bone setting only affects a single bone, so you may want to add multiple bone settings depending the specific problem you are experiencing with your rig.

 [image: full body ik bone settings]

In a humanoid example, the following issues are visible:

- The hips are rotating and translating too aggressively. [image: fbik hips pelvis]

- The legs are not bending enough, having a stiff appearance. [image: fbik legs bend]

- The ankle is rotating too far upward, causing an unnatural pose. [image: fbik ankle bend]

**Bone Settings** can be used to resolve issues like these, in order to support your preferred IK setup.

### Rotation and Position Stiffness

**Rotation **and **Position Stiffness** properties are used to control how much a bone in the IK Chain can be affected by controls and effectors. Use these properties to change the degree to which the pelvis bone will be affected by the movement of the controls. A value of **0** results in completely free movement, whereas a value of **1** completely locks the bone from movement.

 [image: fbik stiffness]

In the humanoid example, the pelvis bone is specified as the bone setting, and a value of** 0.8** is set for both **Rotation **and **Position Stiffness**. In this case, some movement is still preferable.

 [image: fbik stiffness]

### Preferred Angles

Preferred Angles can be used to prioritize joints rotating along a specific axis to reach the effector. In the humanoid example, they can be used to resolve stiffness issues in the legs and knees.

Near the bottom of the Bone Settings are properties for **Preferred Angles**. You must also ensure **Use Preferred Angles** is enabled in order to use these Preferred Angles.

 [image: fbik preferred angles]

The Preferred Angle properties you specify depend on the type of character, and its joint structure. For this example, the mannequin's knee should bend along the **Z axis** in a positive direction, therefore a value of **45 **should be set on the **Z** property.

 [image: fbik preferred angles]

### Limits

**Limits **can be used to limit the range of, or completely lock, the rotation of bone axes along the IK chain. These settings are located between the Stiffness and Preferred Angles properties.

 [image: fbik limits]

Each axis has settings that allow for the following limits:

- **Free**, which allows for the bone to move freely.

- **Limited**, which only allows movement within a specified range. If this is chosen, then the **Min/Max** properties are used to define the range of movement.

- **Locked**, which disables movement along that axis.

In the humanoid example, these limits can be used to correct the unnatural ankle rotation issue. A value of **-70** is set for **Min Z** and **70 **for **Max Z**, and the **Z** axis is set to **Limited**.

 [image: fbik limits]

## Excluding Bones

Depending on the needs of your rig, there may be cases where you want to exclude bones from the FBIK solve. This can be useful when correcting unnatural-looking poses, or when simplifying FBIK behavior.

 [image: fbik excluded bones]

Excluding bones is recommended rather than exclusively using Bone Settings to set bones to be fully stiff or locked.

To exclude a bone, click the **Add (+)** button next to **Excluded Bones**, and select a bone from the dropdown menu to exclude.

 [image: fbik excluded bones]

## Node Reference

The following is a list of all the pins and settings on the Full Body IK node.

| Name | Description |
| --- | --- |
| **Root** | The root bone for the FBIK chain. |
| Effectors |  |
| **Bone** | An endpoint bone for the IK chain, which corresponds to a control. |
| **Transform** | The transform to use to control the end-point bone. Typically this is provided by a **Get Transform** node linked to a control that shares the same transform information as the end-point bone. |
| **Position Alpha** | This property weighs the ability for the effector or bone to reach the target's **position**. When set to **1**, the effector does its best to reach the target transform. When set to **0**, the effector remains at the input pose. |
| **Rotation Alpha** | This property weighs the ability for the effector or bone to reach the target's **rotation**. When set to **1**, the effector does its best to reach the target transform. When set to **0**, the effector remains at the input pose. |
| **Strength Alpha** | This property affects the strength of this effector's influence on the IK chain. When set to **0**, the effector will not pull the chain towards it and other effectors will take priority. |
| **Pull Chain Alpha** | When enabled by setting the value greater than 0.0, the FBIK solver will partition the skeleton into "chains" which extend from the effector to the nearest skeleton hierarchy divergence. Using this can improve results for sparse bone chains, but cause undesirable results for more complex constrained bone chains. |
| **Pin Rotation** | Blends the effector bone rotation between the rotation of the effector transform (**1.0**), and the rotation of the input bone (**0.0**). |
| Bone Settings |  |
| **Bone** | The specified bone these settings are applied to. This can be any bone in the hierarchy between the **Effectors** and the **Root**. |
| **Rotation/Position Stiffness** | The amount of stiffness to apply to a bone's rotation or translation property. A value of **0** allows for free movement, whereas a value of **1** will completely lock down the bone. |
| **XYZ Limit Setting** | The type of allowed movement on the selected bone's axis. **Free** allows for the bone to move freely. **Limited** allows movement within a specified range. If this is chosen, then the **Min/Max** properties are used to define the range of movement. **Locked** disables movement along that axis. |
| **Min/Max XYZ** | If **Limited** is set as a **Limit Setting**, the Min/Max XYZ properties are used to specify the range of movement allowed. |
| **Use Preferred Angles** | Enables the use of **Preferred Angles**. |
| **Preferred Angles** | Specifies how much the Bone should rotate, in each axis, as the chain is compressed. |
| Settings |  |
| **Iterations** | Increase this value until the effectors converge on their desired goal locations. Increasing this value also increases the CPU cost of the FBIK chain. The addition of **Stiffness**, a high **Mass Multiplier** and **Rotation Limits** can all affect the convergence rate and may require more adjustments to this value. |
| **Mass Multiplier** | This is a global value that affects how much the bones resist rotations and translations. Typical values range between **0.0** and **5.0**, with **0.0** being completely loose and **5.0** being very stiff. Higher **Mass Multiplier** values require more iterations to achieve convergence. |
| **Allow Stretch** | Enabling this will cause bones along the IK chain to translate to reach their effector. Position Stiffness values affect this result, where higher stiffness will cause less stretching. |
| **Root Behavior** | Sets the behavior of the solver root. You can select from the following options: **Pre Pull**, which translates the root and all children by the average motion of the stretched effectors to help achieve better convergence when reaching far distances. **Pin to Input**, which locks the translation and rotation of the root bone to the input pose and overrides any bone settings applied to the root. This can be useful for low-distance, partial-body setups. **Free**, which makes the root bone behave like other bones in the chain, allowing it move freely or according to any bone settings applied to it. |
| **Start Solve from Input Pose** | When enabled, the solver is reset each tick to start from the current input pose. If disabled, incoming animated poses are ignored and the solver starts from the results of the previous solve. |
| Debug |  |
| **Draw Scale** | Multiplier that controls size of debug lines. |
| **Draw Debug** | Enable this to show all affected bones along the IK chain for this FBIK node. |

- animation
- control rig
- rigging
- bone
- fbik

On this page

- Prerequisites (-> control-rig-full-body-ik-in-unreal-engine)
- Creation and Setup (-> control-rig-full-body-ik-in-unreal-engine)
- Rig Graph Setup (-> control-rig-full-body-ik-in-unreal-engine)
- Effector Setup (-> control-rig-full-body-ik-in-unreal-engine)
- Setup Result (-> control-rig-full-body-ik-in-unreal-engine)
- Bone Settings (-> control-rig-full-body-ik-in-unreal-engine)
- Rotation and Position Stiffness (-> control-rig-full-body-ik-in-unreal-engine)
- Preferred Angles (-> control-rig-full-body-ik-in-unreal-engine)
- Limits (-> control-rig-full-body-ik-in-unreal-engine)
- Excluding Bones (-> control-rig-full-body-ik-in-unreal-engine)
- Node Reference (-> control-rig-full-body-ik-in-unreal-engine)

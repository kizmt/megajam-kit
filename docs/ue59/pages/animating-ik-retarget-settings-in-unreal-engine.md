# Using Retarget Profiles

https://dev.epicgames.com/documentation/en-us/unreal-engine/animating-ik-retarget-settings-in-unreal-engine?application_version=5.9

> Override and animate IK Retargeter settings at runtime on your retargeted characters.

[image: Using Retarget Profiles]

In addition to **IK Retargeting** your characters during runtime, you can modify **Global**, **Root**, and **Chain** settings dynamically using **Retarget Profiles**. Retarget Profiles are an additional feature of the **Retarget Pose From Mesh** Animation Blueprint Node which you can use to change or animate these settings. This can be useful in cases where you need to change or apply different retarget settings at different points throughout an animation.

This document provides instructions on how to set up Retarget Profiles and various ways to modify them.

#### Prerequisites

- You have set up characters to dynamically retarget at runtime using **Retarget Pose From Mesh**. Refer to the Runtime IK Retargeting (-> runtime-ik-retargeting-in-unreal-engine) page for instructions on how to do this.

- You are familiar with using Animation Blueprints (-> animation-blueprints-in-unreal-engine).

- You are familiar with creating and using Sequencer (-> how-to-make-movies-in-unreal-engine).

## Accessing Retarget Profiles

You can access Retarget Profiles from the **Retarget Pose From Mesh** node in the target character's Animation Blueprint you created in the Runtime IK Retargeting (-> runtime-ik-retargeting-in-unreal-engine) prerequisite step. Select **Retarget Pose From Mesh** and locate the **Custom Retarget Profile** properties in the **Details **panel.

 [image: retarget profile details]

## Static Override

By default, the settings you set up in the assigned IK Retargeter Asset are used by the **Retarget Pose From Mesh** node. You can statically override those settings by modifying the **Custom Retarget Profile** properties on the node:

| Name | Description |
| --- | --- |
| **Apply Target Retarget Pose** | Enabling this overrides the Retarget Pose used for the target character. |
| **Target Retarget Pose Name** | If **Apply Target Retarget Pose** is enabled, this setting specifies the new Retarget Pose name to use instead. |
| **Apply Source Retarget Pose** | Enabling this overrides the Retarget Pose used for the source character. |
| **Source Retarget Pose Name** | If **Apply Source Retarget Pose** is enabled, this setting specifies the new Retarget Pose name to use instead. |
| **Apply Chain Settings** | Enabling this overrides the Chain Settings used in the IK Retargeter Asset with new ones specified below in **Chain Settings**. |
| **Chain Settings** | An array to add chains to override with new Chain Settings. Click **Add (+)** to add a new chain and set the name to match one of the retarget chains in the IK Retargeter Asset. Expand **FK**, **IK** or **Speed Planting** categories to modify the settings within. |
| **Apply Root Settings** | Enabling this overrides the Root Settings used in the IK Retargeter Asset with new ones specified below in **Root Settings**. |
| **Root Settings** | If **Apply Root Settings** is enabled, these settings override the Root Settings used in the IK Retargeter Asset. |
| **Apply Global Settings** | Enabling this overrides the Global Settings used in the IK Retargeter Asset with new ones specified below in **Global Settings**. |
| **Global Settings** | If **Apply Global Settings** is enabled, these settings override the Global Settings used in the IK Retargeter Asset. |

## Dynamic Override

If you need to control when retarget settings change, then you must create additional blueprint logic. Due to the arbitrary nature of Blueprints and Animation situations, there are many ways you can create logic to edit a variety of retarget situations.

In this example, Retarget Profiles will be used to adjust the larger character's arm to correctly reach for the ground, matching the Mannequin.

 [image: target character incorrect]

### IK Rig Setup

Because of this specific retarget situation, you need to modify the target character's IK Rig (-> ik-rig-in-unreal-engine) to use IK Goals and Solvers. This example uses a Full Body IK (FBIK) (-> ik-rig-solvers-in-unreal-engine) solver, however depending on your character, you could choose other kinds of IK Rig Solvers (-> ik-rig-solvers-in-unreal-engine). This step is required to provide IK arm Chain Settings for the Retarget Profile to modify.

Open the target character's IK Rig Asset used for retargeting and do the following:

- Right-click one of the hand bones in the **Hierarchy **panel and select **New IK Goal**.

- In the next prompt, ensure **Full Body IK** is set as the solver and click **Add Solver**.

- Select the** Full Body IK solver** in the **Solver Stack** panel, then right-click the other hand bone and select **New IK Goal**.

- Lastly, select the **Full Body IK solver**, right-click the root bone (typically the **pelvis **or **hips**) in the hierarchy and select **Set Root Bone on Selected Solver**.

 [image: create FBIK goals and solver]

#### FBIK Settings

Select **Full Body IK** in the **Solver Stack** and set **Root Behavior** to **Pin to Input** in the Details panel. This is required to prevent the lower body from moving when the IK goals move.

 [image: pin to input]

You may also need to create additional bone settings for bones that are controlled by the FBIK solver. This resolves stiffness or incorrect joint rotation that can result from the FBIK solve. To create a bone setting, select the **Full Body IK Solver**, then right-click a bone you want to create settings for and select **Add Settings to Selected Bone**.

In this example, to resolve rotational stiffness for the spine, shoulder, and arm bones, bone settings were created for these bones (including any symmetrical bones) with the following properties:

- **Spine_01** **Rotation and Position Stiffness**: 0.75

- **Spine_02** **Rotation and Position Stiffness**: 0.75

- **Spine_03** **Rotation and Position Stiffness**: 0.75

- **Clavicle_l** **Rotation and Position Stiffness**: 0.8

- **Lowerarm_l** **Use Preferred Angles: **Enabled

- **Preferred Angles:** 0, 0, 45

 [image: fbik bone settings]

### Retarget Profile Variable Setup

Returning to the target Animation Blueprint, select the **Retarget Pose From Mesh** node. In the **Details **panel click the **Custom Retarget Profile** dropdown menu and enable **Expose As Pin**, which adds a Custom Retarget Profile pin on the node.

 [image: expose custom retarget profile]

Right-click the newly created pin and select **Promote to Variable**. This creates a new Struct Variable (-> blueprint-struct-variables-in-unreal-engine) of type `Retarget Profile` and connects to the pin. The variable is also visible in the **My Blueprint** panel.

 [image: promote to variable]

### Create Event Graph Logic

Open the Animation Blueprint Event Graph (-> graphing-in-animation-blueprints-in-unreal-engine) and reference the **Retarget Profile variable** here, then do the following:

- Drag off it and create a **Get Chain Settings from Retarget Profile** node.

- Set **Target Chain Name** to the retarget chain that you want to animate. In this example it is `LeftArm`.

- Right-click **Return Value** and select **Split Struct Pin**.

 [image: get chain settings from retarget profile]

Next, drag off **Return Value IK** and create a **Set ****members**** in TargetChainIKSettings** node. Select it, and enable **Static Offset** in the **Details **panel, which exposes the Static Offset chain property as a pin on the node.

 [image: set members in target chain ik settings]

Drag off **Struct Out** and create a **Set Chain IKSettings in Retarget Profile** node, then do the following:

- Set **Target Chain Name** to the same chain name used earlier: `LeftArm`,

- Connect the **Retarget Profile** variable to the **Retarget Profile** input.

 [image: set chain IK settings in retarget profile]

Connect **Event Blueprint Update Animation** to this execution chain, and expose **Static Offset** as a variable by right-clicking the pin and selecting **Promote to Variable**.

 [image: update animate event and expose static offset]

Finally, in the **Details **panel for the Static Offset variable, enable **Expose to Cinematics** and **Instance Editable**, which makes the variable editable externally.

 [image: expose variable to instance and cinematics]

### Animate Retarget Setting

Because you created logic in the Target's Animation Blueprint Event Graph and linked it to **Event Blueprint Update Animation**, you can animate the exposed variable in Sequencer the same way you would animate Anim Instances (-> control-animation-blueprint-parameters-from-sequencer-in-unreal-engine).

Assuming you have already created and opened a Level Sequence (-> how-to-make-movies-in-unreal-engine), add the retargeted character blueprint to it and the source Skeletal Mesh Component, then play an animation (-> how-to-add-cinematic-animation-to-a-character-in-unreal-engine) on the source component to observe the retargeting effects on the target.

 [image: runtime retargeting in sequencer]

Next, add the Chain Setting variable you exposed earlier by doing the following:

- Add the target Skeletal Mesh Component by clicking **Add Track (+)** on the **Blueprint Track** and select the **Target **component.

- Click **Add Track (+)** on the target **Component Track** and select **Anim Instance**.

- Select **Add Track (+)** on the **Anim Instance Track** and select the variable.

 [image: add target anim instance track]

You can now keyframe (-> creating-animation-keyframes-in-unreal-engine) this track to adjust the chain property in real-time.

 [image: keyframe retarget profile settings]

Animating Retarget Profiles in conjunction with Runtime Retargeting (-> runtime-ik-retargeting-in-unreal-engine) provides you with a way to make fine-tuning adjustments to your runtime retargeting results without creating new animations or additional assets.

|  |  |  |
| --- | --- | --- |
|  |  |  |
| Original Animation | Animating Retarget Profiles on Large Character | Animating Retarget Profiles on Small Character |

- animation
- sequencer

On this page

- Prerequisites (-> animating-ik-retarget-settings-in-unreal-engine)
- Accessing Retarget Profiles (-> animating-ik-retarget-settings-in-unreal-engine)
- Static Override (-> animating-ik-retarget-settings-in-unreal-engine)
- Dynamic Override (-> animating-ik-retarget-settings-in-unreal-engine)
- IK Rig Setup (-> animating-ik-retarget-settings-in-unreal-engine)
- FBIK Settings (-> animating-ik-retarget-settings-in-unreal-engine)
- Retarget Profile Variable Setup (-> animating-ik-retarget-settings-in-unreal-engine)
- Create Event Graph Logic (-> animating-ik-retarget-settings-in-unreal-engine)
- Animate Retarget Setting (-> animating-ik-retarget-settings-in-unreal-engine)

# Retargeting Bipeds with IK Rig

https://dev.epicgames.com/documentation/en-us/unreal-engine/retargeting-bipeds-with-ik-rig-in-unreal-engine?application_version=5.9

> Learn how to retarget two different bipedal characters using Unreal Engine's IK Rig and Retargeting features.

[image: Retargeting Bipeds with IK Rig]

Unreal Engine provides flexible tools for retargeting animation from one character to another. One of the ways you can do this is by using IK Rigs (-> ik-rig-in-unreal-engine) in conjunction with the IK Retargeter, which make it possible to retarget characters with vastly different skeleton hierarchies and proportions. Retargeting animations is a way to share animation data between multiple different skeletons without needing to create and manage new animations outside of Unreal Engine.

This document provides an overview of how to use these tools to retarget animation between two different bipedal characters.

#### Prerequisites

- Your project contains at least two different bipedal characters. This example uses the Unreal Engine Mannequin available from the Third Person Template and the Stack O Bot.

- Both characters should have different Skeleton Assets and bone hierarchies so you can maximize the rationale for retargeting this way. Otherwise, it may be better to use Compatible Skeletons (-> skeletons-in-unreal-engine) if your characters have similar proportions and hierarchies.

## Source and Target IK Rig Setup

Retargeting with IK Rig requires a **source **and **target **Skeletal Mesh, which are defined by an **IK Rig Asset** for each of those meshes. Therefore, you must first create an **IK Rig** for each of the characters being used in the retargeting process.

- Open the Content Browser and click **Add (+) > Animation > IK Rig > IK Rig**.

- Select the Skeletal Mesh you wish to add the rig to.

- Do this for both characters, then open each IK Rig Asset.

 [image: create ik rig]

### Retarget Root

Within both IK Rig Assets, you must define the **root **for each character, which is typically the **pelvis **or **hip **bone. This is done in order for the character's root motion to be defined and transferred in a proportional way.

In the **Hierarchy **panel, right-click the bone and select **Set Retarget Root**. Do this in both IK Rig Assets.

 [image: set retarget root]

Once done, the chosen bone shows an indication that it is the **Retarget Root** in the **Hierarchy **and the **IK Retargeting** panels.

 [image: retarget root indication]

### Retarget Chains

You must also define limbs and other appendages that you want to transfer in the retarget process on both the source and target IK Rigs. This is a process similar to characterizing your rig in other applications like Autodesk MotionBuilder or Maya. The main difference is that you define it by **joint chains**, rather than by individual bones. This provides flexibility in retargeting characters with vastly different bone structures.

You must create chains for all major limbs that you want to retarget. You can optionally create chains for minor limbs such as fingers, too. In this example, you will create the following chains in both IK Rigs:

- Spine

- Left Arm

- Right Arm

- Neck

- Head

- Left Leg

- Right Leg

 [image: retarget chains]

To create a chain, follow these steps:

- Select the first bone of the chain in the **Hierarchy **panel, then select all bones down the hierarchy until you reach the last bone of the chain.

- Right-click these bones and select **New Retarget Chain from Selected Bones**.

- In the **Add New Retarget Chain** dialog window, make sure the **Chain Name** is set correctly, then click **OK**. In most cases, IK Rig will automatically assign this value from its list of common chain names.

- In the **Add Goal to New Chain** dialog window, select **No Goal**. Typically, you do not need to add IK Goals (-> ik-rig-in-unreal-engine) unless your retargeting requires additional IK adjustments, such as Speed Planting (-> fix-foot-sliding-with-ik-retargeter-in-unreal-engine), Stride Warping, or **Blend to Source**.

 [image: create chain]

Repeat this step for all major chains in both IK Rig Assets. Once completed, the **IK Retargeting** panel should be populated with several chains.

 [image: create chains]

It is valid for a chain to consist of a single bone. This can happen in some cases, such as for shoulders, neck, or head bones. In those cases, you can still right-click a single bone in the **Hierarchy **panel and select **New Retarget Chain from Selected Bones**. The chain entry will have the same bone defined in the **Start Bone** and **End Bone** fields.

## IK Retargeting

After you create the necessary bone chains, you can begin the retargeting process in the **IK Retargeter**. The IK Retargeter is an Asset that references both source and target IK Rigs. In the IK Retargeter Editor, you can customize how to transfer animation between the source and the target.

### Create and Set Up IK Retargeter

To create an IK Retargeter, do the following steps:

- Click **Add (+)** in the Content Browser, then select **Animation > IK Retargeter**.

- In the dialog window that appears, select the IK Rig that you want to retarget animation from.

- After you select a rig, name the new IK Retargeter Asset, then double-click it to open it in the IK Retargeter Editor.

 [image: create ik retargeter]

The IK Retargeter Editor only shows the source Skeletal Mesh in the viewport and in the **Source IKRig Asset** property. To add the target character, click the **Target IKRig Asset** dropdown menu and select the target IK Rig.

 [image: add target ik rig]

### Checklist Before Retargeting

Before continuing, there are a few things you should check to ensure the retargeting process is correct and accurate.

- In the **Chain Mapping** panel, make sure the **Target **and **Source Chains** are matching. In most cases, the names should correctly auto-match. If not, then you can click the **Source Chain** dropdown menu and change the chain assignment to match with the **Target Chain**. [image: matching chains]

- Make sure both characters have matching reference poses. If these reference poses differ, such as if one character is T-posed and another is A-posed, then you will need to adjust one of their retarget poses so they match. [image: matching retarget pose]

- You can optionally adjust offset and scale settings in the **Details** panel to more easily see both source and target skeletons. [image: offset target character]

### Preview Retargeting

In the **Asset Browser** panel, double-click different animations to preview the retargeting effect on different Animation Sequences.

 [image: preview retargeting]

### Export Retargeting Results

Once you are satisfied with your retargeting results on the target character, you can export the animations to Animation Sequences (-> animation-sequences-in-unreal-engine) that are compatible with that character's Skeleton. To do this, select the animations you want to export in the **Asset Browser** panel, then click **Export Selected Animations**.

 [image: export selected animations]

Specify your export path in the dialog window and click **OK** to export the animations. The retargeted animations will now be available in the output folder with the postfix `_Retargeted`.

 [image: export naming]

## Embellishing Motion

If you are retargeting realistic motion-capture animation to a non-realistic character, the resulting animation may appear incorrect or strange looking. This can be somewhat subjective, but in these cases it may be helpful to perform extra steps to embellish or diminish certain character motions to achieve a more fitting appearance.

For example, when previewing a run animation on the retargeted robot character, you might want the character to have more bounce. The following steps detail how you can achieve this.

|  |  |
| --- | --- |
| [image: running with no bounce] | [image: running with bounce] |
| Original retargeting results | Retargeting with adjusted settings |

### Create IK Goals

The first step is to create IK Goals to ensure the feet stay planted on the ground when adding the extra bouncing.

Assuming no IK Goals are already created, open the IK Rig Asset for the target character. In the **Hierarchy** panel, right-click one of the feet bones and select **New IK Goal**.

 [image: create new ik goal]

In the following prompts, ensure **Limb IK** is set as the solver and click **Add Solver**, then click **Assign Goal**.

 [image: add solver and assign goal]

Next, ensure that the newly created Limb IK solver is selected in the **Solver Stack** panel, then right-click the thigh bone and select **Set Root Bone on Selected Solver**.

 [image: set root bone on selected solver]

Perform the same steps above for the other leg until you have two IK Goals and Limb IK solvers.

 [image: limb ik set up]

### IK Retargeter Root Settings

Next, return to the IK Retargeter Asset and open the root settings by either selecting the root debug visualizer in the viewport or clicking **Root Settings** in the **Chain Mapping** panel.

 [image: root settings]

The two properties you need to edit are **Scale Horizontal** and **Translate Offset Z**.

- **Scale Horizontal** increases the overall scale of the animation curve on the retarget root, which in most cases is the pelvis or hip bone. This increases the overall vertical motion of the character, but also causes the character to rise higher away from the floor.

- **Translation Offset Z** compensates for this. When decreasing it, it lowers the retarget root, but does not affect its overall scale.

Using both these properties together makes it so that you can increase the up and down bounce of a retargeted character. The amount to increase or decrease the properties depends on your character and the animation.

 [image: adjust vertical scale and offset]

In this example, to achieve a desirable bounce, **Translation Offset Z** is set to **-173**, and **Scale Vertical** is set to **6**.

 [image: embellishment results]

- animation

On this page

- Prerequisites (-> retargeting-bipeds-with-ik-rig-in-unreal-engine)
- Source and Target IK Rig Setup (-> retargeting-bipeds-with-ik-rig-in-unreal-engine)
- Retarget Root (-> retargeting-bipeds-with-ik-rig-in-unreal-engine)
- Retarget Chains (-> retargeting-bipeds-with-ik-rig-in-unreal-engine)
- IK Retargeting (-> retargeting-bipeds-with-ik-rig-in-unreal-engine)
- Create and Set Up IK Retargeter (-> retargeting-bipeds-with-ik-rig-in-unreal-engine)
- Checklist Before Retargeting (-> retargeting-bipeds-with-ik-rig-in-unreal-engine)
- Preview Retargeting (-> retargeting-bipeds-with-ik-rig-in-unreal-engine)
- Export Retargeting Results (-> retargeting-bipeds-with-ik-rig-in-unreal-engine)
- Embellishing Motion (-> retargeting-bipeds-with-ik-rig-in-unreal-engine)
- Create IK Goals (-> retargeting-bipeds-with-ik-rig-in-unreal-engine)
- IK Retargeter Root Settings (-> retargeting-bipeds-with-ik-rig-in-unreal-engine)

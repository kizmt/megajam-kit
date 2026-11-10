# Runtime IK Retargeting

https://dev.epicgames.com/documentation/en-us/unreal-engine/runtime-ik-retargeting-in-unreal-engine?application_version=5.9

> Use Retarget Pose From Mesh to enable dynamic runtime retargeting on your characters.

[image: Runtime IK Retargeting]

One of the options available to you when retargeting characters using IK Retargeting is to retarget during runtime sessions. Doing this means you can retarget to other characters without generating new Animation Sequences (-> animation-sequences-in-unreal-engine), or during Live Link (-> live-link-in-unreal-engine) sessions.

This document provides instructions on how to set up a character to retarget to another during runtime sessions using **IK Retargeting** and **Retarget Pose From Mesh**.

#### Prerequisites

- You have created an **IK Retargeter Asset** retargeting from one character to another. Refer to the Retargeting Bipeds with IK Rig (-> retargeting-bipeds-with-ik-rig-in-unreal-engine) page for how to do this.

- Although not absolutely required, your source character should be gameplay controllable to better preview the retargeting effects at runtime. You can use the Third Person Template, which contains a controllable Mannequin.

## Animation Blueprint Setup

The first main step is to create an Animation Blueprint (-> animation-blueprints-in-unreal-engine) for the target character. In this example, the Mannequin is retargeting to the Stack-O-Bot, therefore, create a new **Animation Blueprint** for the Stack-O-Bot and a **Retarget Pose From Mesh Node**.

In the Content Browser, click **Add (+)**, then select **Animation > Animation Blueprint**. In the next window, select the target **Skeletal Mesh** and click **Create**. Name your Animation Blueprint Asset and double-click it to open it.

 [image: create animation blueprint]

Next, right-click in the Anim Graph (-> graphing-in-animation-blueprints-in-unreal-engine) and select **Misc. > Retarget Pose From Mesh** to create this node, then connect it to **Output Pose**.

 [image: add retarget pose from mesh]

Select the **Retarget Pose From Mesh** node and ensure the following properties are set:

- Enable **Use Attached Parent**. Doing this simplifies content set-up, without needing you to find and assign the **Source Mesh Component** manually.

- Set **IKRetargeter Asset** to your IK Retargeter Asset created as a prerequisite (-> runtime-ik-retargeting-in-unreal-engine) for this tutorial.

 [image: retarget pose from mesh properties]

## Blueprint Setup

In this next step, you will need to set up both source and target characters in a single Blueprint and assign the Animation Blueprint created in the previous step to the Target character.

First, create a new **Actor Blueprint** by clicking **Add (+)** in the **Content Browser**, then select **Blueprint Class** and click **Actor**. Name your Blueprint Asset and double-click it to open it.

 [image: create blueprint]

In the **Components **panel of the **Blueprint**, click **Add (+)** and add two **Skeletal Mesh Components**, one for the source, and the other for the target. Assign the **Skeletal Mesh Asset** property in the **Details** panel to the appropriate Skeletal Mesh Asset for each Component.

 [image: add skeletal mesh components]

If **Use Attached Parent** is enabled in your target Animation Blueprint, then the target Skeletal Mesh must be parented to the source Component so that the retargeting will work correctly. As this setting is based on using the parent Component as the source.

 [image: parent components and use attached parent]

Select your source character and set **Animation Mode** to **Use Animation Asset**, then assign an animation to **Anim to Play**. Next, select your target character and assign the Animation Blueprint created earlier to **Anim Class**.

 [image: assign animation blueprints to skeletal mesh components]

You should now see the target character retargeting to the source character in the Blueprint Viewport.

 [image: retargeting results in blueprint]

## Character Blueprint Example

Depending on your project's needs, runtime retargeting can be useful for prototyping gameplay animation on different characters. In this example, the **Third Person Template** Character Blueprint has been modified with the Stack-O-Bot added to the Blueprint.

 [image: character blueprint setup]

You can then create logic to switch **Visibility **between the different characters to preview the retargeting results in a gameplay scenario.

 [image: gameplay example]

In situations where you are hiding the source character, you must set **Visibility Based Anim Tick Option** to **Always Tick Pose and Refresh Bones** under the **Optimizations **category.

 [image: always tick pose and refresh bones]

- animation

On this page

- Prerequisites (-> runtime-ik-retargeting-in-unreal-engine)
- Animation Blueprint Setup (-> runtime-ik-retargeting-in-unreal-engine)
- Blueprint Setup (-> runtime-ik-retargeting-in-unreal-engine)
- Character Blueprint Example (-> runtime-ik-retargeting-in-unreal-engine)

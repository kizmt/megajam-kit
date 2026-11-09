# Fix Foot Sliding with IK Retargeter

https://dev.epicgames.com/documentation/en-us/unreal-engine/fix-foot-sliding-with-ik-retargeter-in-unreal-engine?application_version=5.9

> Use Speed Planting workflows to resolve feet sliding problems when retargeting between very different characters.

[image: Fix Foot Sliding with IK Retargeter]

When using the IK Retargeter to retarget animation between different characters, the target character may exhibit noticeable feet sliding. This can occur if leg lengths and stances between the source and target characters are very different, causing leg retargeting to be imperfect. To resolve this, you can use **Speed Planting** workflows which pin IK Goals (-> ik-rig-in-unreal-engine) in place when they should not be moving.

|  |  |
| --- | --- |
|  |  |
| Original retargeting results | Modified retargeted results using Speed Planting |

This document provides instructions on how to use Speed Planting to resolve foot sliding in your retargeted animations.

#### Prerequisites

- You have retargeted animations from one character to another using the IK Retargeter. Refer to the Retargeting Bipeds with IK Rig (-> retargeting-bipeds-with-ik-rig-in-unreal-engine) page for how to do this.

- You are familiar with creating Full Body IK (-> ik-rig-solvers-in-unreal-engine) solvers in IK Rig.

## Source Animation Setup

The first step for setting up Speed Planting is to create Animation Curves (-> animation-curves-in-unreal-engine) in the source animation that will define the speed of each foot bone throughout the animation. You can do this using Animation Data Modifiers (-> animation-modifiers-in-unreal-engine) to generate the curve so that it produces accurate motion data quickly. The intent of this step is to use Animation Curve data to determine at what point during the animation the feet should be planted.

### Animation Data Modifier

In your source Animation Sequence (-> animation-sequences-in-unreal-engine), from the main menu, go to **Window > Animation Data Modifiers**.

 [image: open animation data modifiers]

Next, add a Motion Extractor Modifier by clicking **Add Modifier > MotionExtractorModifier**. Do this for each foot bone within the source animation. In this example, two Motion Extractor Modifiers are added.

 [image: add motion extractor modifier]

Within both Motion Extractor Modifiers, set the following properties:

- **Bone Name**: The name of the foot bone to watch for its speed. This example uses the `ball_r` and `ball_l` bones.

- **Motion Type**: Translation Speed.

- **Axis**: XYZ.

 [image: motion extractor modifier properties]

### Generate Speed Curve

Once your Animation Data Modifiers are set up, click **Apply All Modifiers** to generate speed curves for the specified bones.

 [image: apply all modifiers]

Double-click the curve track to open the Curve Editor (-> animation-curve-editor-in-unreal-engine) where you can see more detailed information about it. Select or hover your cursor over the keyframes to see the values. This information can be used to determine the threshold of speed at which the foot should be planted. In most cases, this means that the lower flat parts of the curve are where the foot is stationary, whereas the peaks are where it is in motion.

 [image: check curve editor]

Because you modified this Animation Sequence and the Skeleton (-> skeletons-in-unreal-engine) (due to creating a new curve), make sure you save both Assets now.

## IK Rig Setup

Continuing the setup process, you must now create IK Goals and Solvers for the leg chains on the target character. This example uses a Full Body IK (FBIK) (-> ik-rig-solvers-in-unreal-engine) solver, however depending on your character, you could choose other kinds of IK Rig Solvers (-> ik-rig-solvers-in-unreal-engine). This step is required in order to pin the legs using IK when they become stationary during the animation.

### Create FBIK

Open the target character's **IK Rig Asset** used for retargeting, navigate to the **Hierarchy **panel, right-click the end bone in one of the leg retarget chains, and select **New IK Goal**.

 [image: new ik goal]

In the following prompts, ensure **Full Body IK** is set as the solver and click **Add Solver**, then click **Assign Goal**.

 [image: add solver and assign goal]

Next, ensure that the newly created Full Body IK solver is selected in the **Solver Stack** panel, right-click the other foot bone, select **New IK Goal**, then click **Assign Goal**.

 [image: new ik goal and assign]

Finally, select the **Full Body IK** solver, then right-click the root bone in the hierarchy and select **Set Root Bone on Selected Solver**. Typically, the root bone for an FBIK solver is the pelvis or hips.

 [image: set root bone on selected solver]

### FBIK Settings

Depending on the bone structure of your character's legs, you may also need to create additional bone settings for bones that are controlled by the FBIK solver. This resolves stiffness or incorrect joint rotation that can result from the FBIK solve. To create a Bone setting, select the **Full Body IK Solver**, then right-click a bone you want to create settings for and select **Add Settings to Selected Bone**.

 [image: fbik settings]

In this example, to resolve rotational stiffness for some leg bones, bone settings were created for these bones with the following properties:

- **thigh_l** **Use Preferred Angles**: Enabled

- **Preferred Angles**: 0, 0, -45

- **calf_l** **Use Preferred Angles**: Enabled

- **Preferred Angles**: 0, 0, 45

- **thigh_r** **Use Preferred Angles**: Enabled

- **Preferred Angles**: 0, 0, -45

- **calf_r** **Use Preferred Angles**: Enabled

- **Preferred Angles**: 0, 0, 45

 [image: fbik preferred angles]

Depending on your character's needs, there may be other bone settings required to ensure your FBIK solver functions correctly, such as **Stiffness**, **Limits**, and **Mass Multiplier**. Refer to the **Full Body IK** section of the Solvers (-> ik-rig-solvers-in-unreal-engine) page for more information.

## Speed Planting in IK Retargeter

Next, open the **IK Retargeter Asset** for your characters. In the viewport select either the IK Goal or the chain, and in the **Details **panel enable **Speed Planting**.

 [image: enable speed planting]

Set the following properties in the **Speed Planting **section:

- Set **Speed Curve Name** to the name of the corresponding leg curve that was generated earlier on the source character. In this example it is set to `ball_l_translation_speed_XYZ`.

- Depending on the generated curve values, you may need to adjust **Speed Threshold** to a number that is slightly higher than where the curve stays flat. If you notice that your character's feet are still unplanting inappropriately, then increase this number. In this example, it is set to **30**.

Do this for all necessary leg chains on your target character.

 [image: speed planting properties]

## Final Result

Now when you play animations in the retargeter, you should see better feet planting for your target character. You can now export (-> ik-rig-in-unreal-engine) the retargeted animation to a new Animation Sequence.

 [image: final result]

- animation

On this page

- Prerequisites (-> fix-foot-sliding-with-ik-retargeter-in-unreal-engine)
- Source Animation Setup (-> fix-foot-sliding-with-ik-retargeter-in-unreal-engine)
- Animation Data Modifier (-> fix-foot-sliding-with-ik-retargeter-in-unreal-engine)
- Generate Speed Curve (-> fix-foot-sliding-with-ik-retargeter-in-unreal-engine)
- IK Rig Setup (-> fix-foot-sliding-with-ik-retargeter-in-unreal-engine)
- Create FBIK (-> fix-foot-sliding-with-ik-retargeter-in-unreal-engine)
- FBIK Settings (-> fix-foot-sliding-with-ik-retargeter-in-unreal-engine)
- Speed Planting in IK Retargeter (-> fix-foot-sliding-with-ik-retargeter-in-unreal-engine)
- Final Result (-> fix-foot-sliding-with-ik-retargeter-in-unreal-engine)

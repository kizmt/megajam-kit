# FK Control Rig

https://dev.epicgames.com/documentation/en-us/unreal-engine/fk-control-rig-in-unreal-engine?application_version=5.9

> Quickly edit animation without needing Control Rig Assets using FK Control Rig.

[image: FK Control Rig]

**FK Control Rigs** are procedurally-generated Control Rigs that can be added to any **Skeletal Mesh** in **Sequencer**, regardless of whether that actor has a Control Rig asset or not. These rigs can be used to make additive adjustments to bones without requiring you to create an entire Control Rig asset. Additionally, you can bake any Animation Sequence to an FK Control Rig to perform overriding adjustments.

This document provides an overview of how to create and use FK Control Rigs in Sequencer (-> cinematics-and-movie-making-in-unreal-engine).

#### Prerequisites

- You have added a Skeletal Mesh character to Sequencer. See the Apply Animation to a Character (-> how-to-add-cinematic-animation-to-a-character-in-unreal-engine) page for information on how to do this.

- You are familiar with Keyframing (-> creating-animation-keyframes-in-unreal-engine) in Sequencer.

## Creation and Overview

To create a FK Control Rig, assuming you have already added a Skeletal Mesh to Sequencer, click **Add (+) Track** on the character's track and select **Control Rig > FK Control Rig**.

 [image: create control rig]

The FK Control Rig track is now visible, and bones are shown on the Skeletal Mesh in the level viewport.

 [image: fk control rig sequencer track]

Expanding the FK Control Rig track reveals the list of bones. You can select bones here, which also selects them in the viewport, or select bones directly in the viewport, which also selects the track. Once a bone is selected, it can be manipulated and keyframed (-> creating-animation-keyframes-in-unreal-engine) just like any other object in Sequencer.

 [image: fk control rig select bone]

## Usage

Once an FK Control Rig is created in Sequencer, you can animate the bones individually to create animation on the Skeletal Mesh. Depending on the complexity of your character or the scope of animation, it may be preferable to use FK Control Rig rather than creating a unique animation outside of Unreal Engine.

For example, Skeletal Meshes with few bones can be easily animated with FK Control Rig. Select the bone you want to animate and keyframe it by either pressing **S** (if your focus is in the viewport), or **Enter **(if your focus is in Sequencer).

 [image: keyframe fk control rig]

### Additive FK

FK Control Rig can also apply additively to Animation Sequences playing in Sequencer. This is useful if you want to perform additive edits to an animation instead of overriding it.

To make FK Control Rig additive, right-click on the **FK Control Rig track** and select **Additive**.

 [image: additive fk control rig]

Now you can edit and keyframe bones and have those changes apply cumulatively to the base animation.

 [image: additive fk control rig]

### Bake to FK Control Rig

You can also bake animation from Sequencer to FK Control Rig. This is useful if you need to perform overriding adjustments, such as fixing animation pops or bad curves, without needing to perform the same fixes outside Unreal Engine and re-importing.

To do this, right-click on the **Skeletal Mesh track** in Sequencer and select **Edit With FK Control Rig**. This opens a baking dialog window where you can specify the following options:

 [image: bake to fk control rig]

| Name | Description |
| --- | --- |
| **Export Transforms ** | Bakes transform data to FK controls. |
| **Export Curves** | Bakes **AnimCurve** data to FK controls. |
| **Record in World Space** | Bakes in absolute world space coordinates. |
| **Evaluate All Skeletal Mesh Components** | Evaluates all skeletal mesh components when baking. Typically you may want to enable this if you are using a Blueprint with other Skeletal Mesh Components. |
| **Warm Up Frames** | The amount of frames to evaluate before the baking process occurs. This is useful if there are post-process Animation Blueprint effects that require additional time to settle before evaluation. |
| **Delay Before Start** | The amount of Display Rate frames to delay before the baking process occurs. This is useful if there are post-process Animation Blueprint effects you need to run repeatedly before evaluation. |
| **Reduce Keys** | Enable this to run a Simplify (-> animation-curve-editor-in-unreal-engine) process after the baking process occurs, which removes redundant keyframes based on a tolerance amount. |
| **Tolerance** | The higher the **Tolerance** value, the more the filtered curve is allowed to deviate from the original, which causes more keyframes to be removed if **Reduce Keys** is enabled. |

Pressing **Create **completes the bake operation, which creates a FK Control Rig track with keyframes according to the baked animation.

 [image: bake to fk control rig]

Once you have edited your animation using FK Control Rig, you can also bake back to an Animation Sequence by right-clicking on the **Skeletal Mesh track** and selecting either **Bake Animation Sequence** or **Create Linked Animation Sequence**.

 [image: bake fk control rig to animation]

### Filter Bone List

Depending on the Skeletal Mesh, the list of bones displayed by FK Control Rig can sometimes be very large and contain unnecessary bones for your animation. To resolve this, you can filter the list of displayed bones to only include the bones that are relevant for your workflow.

To filter bones, right-click on the **FK Control Rig track** and click **Select Bones Or Curves To Animate**. This opens a window where you can manually enable or disable individual bones from showing.

 [image: fk control rig bone filter]

Filtering out bones removes them from FK Control Track as well as hides them in the viewport, making it easier to work with just the bones you want. Once you have specified which bones to filter, click **OK **to apply the filter.

 [image: fk control rig bone filter]

- control rig
- sequencer
- fk

On this page

- Prerequisites (-> fk-control-rig-in-unreal-engine)
- Creation and Overview (-> fk-control-rig-in-unreal-engine)
- Usage (-> fk-control-rig-in-unreal-engine)
- Additive FK (-> fk-control-rig-in-unreal-engine)
- Bake to FK Control Rig (-> fk-control-rig-in-unreal-engine)
- Filter Bone List (-> fk-control-rig-in-unreal-engine)

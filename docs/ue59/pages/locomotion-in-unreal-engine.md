# Locomotion

https://dev.epicgames.com/documentation/en-us/unreal-engine/locomotion-in-unreal-engine?application_version=5.9

> An overview of Character Locomotion features in Unreal Engine.

[image: Locomotion]

In **Unreal Engine** character **Locomotion** is built on the foundation of character object (-> setting-up-a-character-in-unreal-engine), movement, and animation (-> animation-assets-and-features-in-unreal-engine) playback. This foundation is supported with Locomotion tools that you can use to synchronize character movement behavior with reactive and dynamic animations.

This document provides an overview of the character Locomotion tool in Unreal Engine.

## Root Motion

By enabling **Root Motion**, a character's movement can be driven by an animation sequence using motion data from the Root Bone. Animations with their Root Motion** **enabled, create more realistic and grounded movement behaviors and interactions within levels.

 [image: root motion enabled animation]

Read about how you can drive a Character's movement with animation playback using Root Motion in the following documentation.

## Pose Warping

You can enable **Pose Warping** to dynamically adjustment a character's animated poses to align with character movement, using Root Motion (-> locomotion-in-unreal-engine). With Pose Warping, you need fewer individual animations to reach the same level of animated-movement coverage as before. This reduces the dependency on animation-dictated gameplay, and allows animation and gameplay tuning to evolve side by side during development.

 [image: pose warping demo]

Read about Pose Warping and an example implementation in the following documentation.

## Motion Warping

With **Motion Warping**, you can dynamically warp windows of a character's animation to align with Root Motion (-> locomotion-in-unreal-engine) or to align with assigned **Warp Targets**. With this feature, you can rely less on the manual creation and fine tuning of animations to fit specific object interactions, and apply logic to bend base animations to fit pre-established conditions.

 [image: motion warping animation to warp target]

In the following documentation you can read more about Motion Warping and follow along with an example workflow.

## Distance Matching

With **Distance Matching** you can use a calculated distance value, to or from, a target to drive Animation Sequences. Distance Matching can align animation playback with character speed, reducing the need for manual animation tuning when altering character behaviors.

 [image: distance matching animation pose selection]

Read about Distance Matching and see an example workflow in the documentation below.

- animation

On this page

- Root Motion (-> locomotion-in-unreal-engine)
- Pose Warping (-> locomotion-in-unreal-engine)
- Motion Warping (-> locomotion-in-unreal-engine)
- Distance Matching (-> locomotion-in-unreal-engine)

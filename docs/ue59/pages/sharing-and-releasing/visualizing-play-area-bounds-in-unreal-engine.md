# Visualizing Play Area Bounds

https://dev.epicgames.com/documentation/en-us/unreal-engine/visualizing-play-area-bounds-in-unreal-engine?application_version=5.9

> Visualize the user's stage in their head-mounted experience with OpenXR

[image: Visualizing Play Area Bounds]

Users can specify the bounds of their play area, sometimes called the stage, on their device. You can access these bounds in Unreal Engine with the OpenXR APIs (-> developing-for-headmounted-experiences-with-openxr-in-unreal-engine).

 [image: image alt text]

On Oculus devices, the Guardian boundary appears when the user gets close.

This page shows how you can visualize the play area bounds in your project. For setting up play area bounds on your device, refer to your device's documentation.

## Get Play Area Bounds

The `Get Play Area Bounds` function returns the length of the largest rectangle that can be found inside your play area. Play area bounds are visualized by your OpenXR compatible runtime when the user gets close to the boundary. It can also be useful to inform the user when they are moving close to the boundary with custom visualizations in your application.

 [image: image alt text]

The `Get Play Area Bounds` function has three reference spaces it can return: **Eye Level**, **Floor Level**, and **Stage**. These three spaces map to the OpenXR reference spaces **View**, **Local**, and **Stage**, respectively. In most cases, we recommend you return the **Stage **reference space. For more details on the OpenXR reference spaces, refer to the OpenXR Specification.

If the `Get Play Area Bounds` function doesn't return any data, the OpenXR runtime you're using might not have implemented the OpenXR functionality for play area bounds.

## Teleportation Visualization

An example of visualizing play area bounds is teleportation visualization. The VR Template (-> vr-template-in-unreal-engine) provides an implementation of this visualization during teleport.

 [image: image alt text]

The teleport visualization is defined in the Blueprint **VRTeleportVisualizer** located in **Content/VRTemplate/Blueprints**. The following is a description of the logic for visualizing the boundaries.

**On Begin Play:**

- The Blueprint calls `Get Play Area Bounds` using the Stage reference space.

- The Blueprint then assigns the X and Y data to a User Variable in the Niagara System (-> creating-visual-effects-in-niagara-for-unreal-engine) **NS_PlayAreaBounds**.

- NS_PlayAreaBounds dynamically draws a rectangle using the X and Y values returned from Get Play Area Bounds.

**On Tick:**

- The Blueprint moves NS_PlayAreaBounds relative to the teleport location, identified by **NS_TeleportRing**.

- This results in an accurate visualization of where the player will be, relative to the play area bounds, after teleportation.

On this page

- Get Play Area Bounds (-> visualizing-play-area-bounds-in-unreal-engine)
- Teleportation Visualization (-> visualizing-play-area-bounds-in-unreal-engine)

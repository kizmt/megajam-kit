# Using Distance Field Ambient Occlusion

https://dev.epicgames.com/documentation/en-us/unreal-engine/using-distance-field-ambient-occlusion-in-unreal-engine?application_version=5.9

> How to setup and use Distance Field Ambient Occlusion.

[image: Using Distance Field Ambient Occlusion]

In your games, you may rely mostly on screen space techniques to provide dynamic Ambient Occlusion (AO) or even precomputed lighting to make objects feel grounded in the world. These techniques are very useful but have their limitations. Screen Space Ambient Occlusion (SSAO) is limited to using scene depth and can only work within the visible screen space. Precomputed methods only work for static objects in the world, which means they can't update in realtime. Distance Field Ambient Occlusion (-> distance-field-ambient-occlusion-in-unreal-engine) (DFAO) is a fully dynamic AO method using Mesh Distance Fields for movable Static Meshes. It is also not limited to only being used in dynamically lit worlds; it can be used with precomputed lighting.

In this guide, you'll learn how to enable DFAO for your scene with a Sky Light and then explore the settings that can be adjusted.

## Steps

This feature requires that **Generate Mesh Distance Fields** be enabled in your **Project Settings** in the **Rendering** section. See how to enable Mesh Distance Fields here, if you have not done so already.

- Start by navigating to the **Place Actors** panel, then in the **Lights** tab, select and drag a **Sky Light** into the Level Viewport.
- With the Sky Light selected, navigate over to its **Details** panel and set its **Mobility** to **Movable**.

## End Result

Once the Sky Light is set to Movable, Distance Field Ambient Occlusion will automatically be enabled for your level.

 [image: Sky Light | without | Distance Field Ambient Occlusion]

 [image: Sky Light | with | Distance Field Ambient Occlusion]

You can see in this comparison example how much of a difference adding a Sky Light to your scene can make when Distance Field Ambient Occlusion is enabled.

## Additional Sky Light Settings

Use the Distance Field Reference to learn about settings specific to Distance Field Ambient Occlusion (-> distance-field-ambient-occlusion-in-unreal-engine) for Sky Lights. These settings enable you to have artistic control over your scene, like controlling the accuracy of the occlusion, its tint and contrasts, and more.

- static mesh
- rendering
- lighting
- shadows
- distance fields

On this page

- Steps (-> using-distance-field-ambient-occlusion-in-unreal-engine)
- End Result (-> using-distance-field-ambient-occlusion-in-unreal-engine)
- Additional Sky Light Settings (-> using-distance-field-ambient-occlusion-in-unreal-engine)

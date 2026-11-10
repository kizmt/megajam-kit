# Using Distance Field Indirect Shadows

https://dev.epicgames.com/documentation/en-us/unreal-engine/using-distance-field-indirect-shadows-in-unreal-engine?application_version=5.9

> How to setup and use Distance Field Indirect Shadows.

[image: Using Distance Field Indirect Shadows]

When your game relies on precomputed lighting with indirectly lit areas, it can be a challenge to blend movable objects because they will not have soft area shadowing. Sometimes you would need to fake this type of effect to blend dynamic objects with the rest of the scene by using complex material setups or even decals. **Distance Field Indirect Shadows** (DFIS) enables you to generate a Mesh Distance Fields for single Static Meshes for area shadowing in these indirectly lit areas where traditional shadow mapping techniques wouldn't work well.

Distance Field Indirect Shadowing works similarly to Capsule Shadows for Skeletal Meshes by using precomputed lighting samples generated during a lighting build. The lighting samples use Volumetric Lightmaps (-> volumetric-lightmaps-in-unreal-engine) to determine the directionality and intensity of the indirect lighting.

In this guide, you'll learn how to enable Distance Fields for individual meshes that can then be used in your levels for area shadowing in areas lit with static indirect lighting so that you see results similar to this:

## Steps

Unlike other Mesh Distance Fields features, DFIS does not require **Generate Mesh Distance Fields** to be enabled for the entire project. It can be enabled per-mesh, as explained in the steps below.

- In the **Content Browser**, start by selecting any **Static Mesh** asset and double-clicking to open the **Static Mesh Editor**.[image: Open Static Mesh asset in the Static Mesh Editor]
- In the Static Mesh Editor, navigate to the **Details** panel. In the **Static Mesh Settings** section, set **Generate Mesh Distance Fields** to enabled. After enabling this, you can **save** and **close** the Static Mesh Editor.[image: Enable generating of the Mesh Distance Field]Click for full image.
- From the **Content Browser** select the **SM_MatPreviewMesh_01** mesh and drag it into the Level **Viewport**.[image: Drag Static Mesh asset into the Level Viewport]
- With the Actor selected in the Level, go to the **Details** panel and set its **Mobility** to **Movable**.[image: Set Mobility of the Static Mesh asset to Movable]
- Then, under the **Lighting** tab, enable **Distance Field Indirect Shadow**.[image: Enable Distance Field Indirect Shadow of the Static Mesh asset]
- If your scene has not already had it's lighting built, click the **Build** on the **Main** menu and select **Build Lighting Only** to build your lighting for the scene.[image: Build lighting for the scene]

## End Result

In your indirectly lit areas that get a good amount of bounce light, you should see that your movable Static Mesh can cast a soft shadow in indirectly lit areas whereas before there would be no shadow cast.

Keep in mind, that indirect shadows will be practically non-existent in areas that are directly lit or areas that are brightly lit.

## Additional Settings

Use the Distance Fields Reference to learn about settings specific to Distance Field Indirect Shadows for Static Mesh Actors.

- static mesh
- rendering
- lighting
- shadows
- distance fields

On this page

- Steps (-> using-distance-field-indirect-shadows-in-unreal-engine)
- End Result (-> using-distance-field-indirect-shadows-in-unreal-engine)
- Additional Settings (-> using-distance-field-indirect-shadows-in-unreal-engine)

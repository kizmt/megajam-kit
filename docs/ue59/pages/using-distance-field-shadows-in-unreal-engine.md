# Using Distance Field Shadows

https://dev.epicgames.com/documentation/en-us/unreal-engine/using-distance-field-shadows-in-unreal-engine?application_version=5.9

> How to setup and use Distance Field Shadowing.

[image: Using Distance Field Shadows]

When you're developing your games, you will find that there are situations where dynamic lighting is the best choice for your levels, like those with long view distances or ones where you have a large open world. In instances like this, precomputed lighting can be inefficient or too demanding on the target system's resources. **Distance Field Shadows**, also referred to as **Distance Field Shadows**, enables you to shadow at farther distances than traditional **Cascaded Shadow Maps** (CSM) with a Directional Light.

In this guide, you'll learn how to enable Distance Field Shadowing for different Light Types, including Directional, Point, and Spot Lights.

## Steps

This feature requires that **Generate Mesh Distance Fields** be enabled in your **Project Settings** in the **Rendering** section. See how to enable Mesh Distance Fields here, if you have not done so already.

- Start by navigating to the **Place Actors** panel, then in the **Lights** tab, select and drag a **Directional**, **Spot**, or **Point** Light into the main viewport.To enable Distance Field Shadows on any Light component, the process is the same. The additional sections of this guide will cover specific properties for these light types.
- With the Light selected, navigate over to its **Details** panel and set its Mobility to **Movable** or **Stationary**.
- In the **Details** panel under **Distance Field Shadows**, set **Distance Field Shadows** to enabled. |  |  |
| --- | --- |
|  |  |
| Directional Light | Spot/Point Light | If this option is grayed out, make sure that you've first enabled the option for **Generate Mesh Distance Fields** in the Project Settings, and then check to make sure that the light's Mobility is set to **Movable** or **Stationary**.

## End Result

Once your Light's have been set to Movable or Stationary and toggled **Distance Field Shadowing** on, your light will automatically use them for your level. For Directional Lights, Distance Field Shadowing will be enabled for any distance beyond the Cascaded Shadow Maps **Dynamic Shadow Distance** value.

 [image: Cascaded Shadow Maps Only]

 [image: Cascaded Shadow Maps | and | Distance Field Shadows]

In this test level for Fortnite, Cascaded Shadow Map (CSM) **Dynamic Shadow Distance** is 4,500 cm (centimeters) from the camera and when Distance Field Shadowing is enabled, they handle any shadowing beyond the CSM Shadow Distance. When CSM is the only shadowing method being used, distant objects (like the Court House columns) will have light leaking because it is not within the shadow distance. Farther distance objects will also not be shadowed properly.

When using a Directional Light, it can be helpful to set the Cascaded Shadow Map **Dynamic Shadow Distance Moveable Light** slider to **0** making it possible to only see the shadows produced from Mesh Distance Fields. This is a useful way of testing your scene and diagnosing any potential Distance Field Quality issues in addition to using the visualization view modes.

## Additional Light Settings

Use the Distance Field Reference to learn about settings specific to Distance Field Shadowing for Directional Lights and Point/Spot Lights. These settings enable you to have artistic control over your scene where you'll be able to control the softness of shadows and the farthest distance any shadow can cast. There are also some global adjustments specific to Directional Lights that can be used to remove self-shadowing artifacts in the scene caused from LOD (Level of Detail) meshes at farther distances from the camera.

- static mesh
- rendering
- lighting
- shadows
- distance fields

On this page

- Steps (-> using-distance-field-shadows-in-unreal-engine)
- End Result (-> using-distance-field-shadows-in-unreal-engine)
- Additional Light Settings (-> using-distance-field-shadows-in-unreal-engine)

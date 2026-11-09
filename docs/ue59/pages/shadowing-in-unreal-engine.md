# Shadowing

https://dev.epicgames.com/documentation/en-us/unreal-engine/shadowing-in-unreal-engine?application_version=5.9

> An overview of available shadowing methods and the properties they support.

[image: Shadowing]

Shadows make objects feel grounded in the world. They give the viewer a sense of depth and space. Shadowing is supported by all available types of lights and determined by a light's mobility.

## Supported Shadowing Methods

The type of shadowing used by a light is determined by what its Mobility is set to: **Static**, **Stationary**, or **Movable**. Mobility is the primary guiding factor in whether a light should cast a precomputed shadow baked into a texture called a lightmap, a dynamic shadow generated in real-time, or one that uses a combination of precomputed and dynamic shadowing.

A Light's Mobility can be set independently of other lights in the Level, meaning that you can use any combination of mobilities to light the scene.

The following shadowing methods are available to use:

Some require Project Settings to be enabled, or additional properties to be enabled on the Light to work.

- Shadow MappingThe default shadowing method that renders geometry into shadow depth maps. This shadowing method works for all platforms that support dynamic shadowing, but it requires manual setup of shadowing distances and only culls per-component, causing poor performance with high polygon scenes. Also, it does not support Nanite geometry.

- Virtual Shadow MapsThis shadowing method renders geometry into virtualized shadow depth maps. It provides high quality shadows for next-gen projects with simplified setup. It has high efficiency culling when used with Nanite geometry.

- Ray-traced ShadowsThis method traces a set number of samples per pixel using Hardware Ray Tracing with denoising algorithms to render high quality ray-traced shadows in real-time.

- Distance Field ShadowsThis method uses signed distance fields per Static Mesh and is used by Lumen Software Ray Tracing for dynamic soft area shadows.

- Precomputed Shadows with LightmassThis method uses lighting data from the scene to generate lightmap textures that are applied to Static geometry in the Level. Geometry requires additional setup with proper lightmap UVs. Precomputing lighting for the scene can vary depending on machine specifications, scene complexity, and other factors when determining how long a light build will take.

## Static and Stationary Light Preview Shadowing

When editing a Light with its Mobility set to **Stationary** or **Static** the light is considered un-built. **Preview Shadowing** is enabled to give you an idea of what the shadows will look like when lighting is rebuilt, but they are not representative of the final, baked result.

To indicate what are actually preview shadows, shadows from these lights are shown in the Level Editor with the text **Preview**.

Preview text over shadows is visible only while working in the Level Editor. If you launch your project in Play-In-Editor (PIE) or Standalone Game modes, no text will appear over unbuilt shadows.

To resolve any preview shadows, you will need to build lighting. Use the Main Menu to select **Build > Build All Levels** to kick off a lighting build.

|  |  |
| --- | --- |
| [image: built scene shadows] | [image: preview shadows] |
| Built Scene Shadows | Preview Shadows |

Preview shadows can be disabled while working in the Editor by unchecking the **Preview Shadows Indicator** under the Level Viewport **Show > Visualize** menu.

## Configuring Shadowing Properties of Lights

The following properties can be found on the available Types of Lights.

The properties are accessible through the Level's **Details** panel when a Light is selected.

|  |  |  |  |  |
| --- | --- | --- | --- | --- |
| [image: directional light properties] | [image: sky light properties] | [image: point light properties] | [image: spot light properties] | [image: rect light properties] |
| Directional Light | Sky Light | Point Light | Spot Light | Rect Light |

Click images for full size.

### Source Angle, Radius, Height and Width

Each type of light has an option to set the angle, radius, or height and width of its light source to control the size and shape of the shadows it casts. Larger angles, radii, heights, and widths soften shadows for objects the light affects.

In the examples below, the left Spot Light has no source radius specified and produces sharp shadows. The right Spot Light has a moderate source radius specified, which softens the shadows of that light depending on the distance of the objects from it.

[image: source radius example]

When looking at the Spot Lights in the Level Editor viewport, you can see the Source Radius of the light is represented by the yellow sphere on the Spot Light on the right side.

[image: source radius editor example]

Point, Spot, and Rect Lights all have a visible source size that updates in real-time while being edited.

[image: point, spot, rect light source sizes]

Point Lights and Spot Lights have an additional option to control length of the Source Radius with the **Source Length** property, making it possible to create cylindrical light shapes like a tube light.

[image: point and spot light source length]

### Attenuation Radius

The **Attenuation Radius** of Point, Spot, and Rect Lights enable you to set a bounding area that this light will affect. While this is not physically accurate, it is important to clamp the bounds of dynamic shadowing-casting lights for performance.

In the examples below, the left Spot Light has a smaller attenuation radius than the one one on the right. Notice how the light only affects the area within the farthest point of its radius.

[image: light attenuation radius example]

When the lights are selected, you can see how the distance of the attenuation radius affects the objects within its area and doesn't shadow objects outside of its reach.

[image: light attenuation radius editor view]

### Casting Shadows

**Cast Shadow** controls whether the selected light should contribute shadows to the scene.

[image: shadow casting on and off]

Left, shadow casting enabled; Right, shadow casting disabled.

### Volumetric Shadowing

The **Volumetric Scattering Intensity** scales the fog intensity and light color when enabled. It enables a light to contribute more to fog without having to directly increase its intensity.

Lights contribute to Volumetric Fog when enabled for the scene.

You can control the contribution of individual lights to Volumetric Fog with **Volumetric Scattering Intensity**. By default, volumetric shadows are disabled for lights but can be enabled with **Cast Volumetric Fog**.

 [image: Volumetric Shadow: Disabled (default)]

 [image: Volumetric Shadow: Enabled]

### Global Illumination Indirect Lighting

Global Illumination provides indirect lighting for a scene from light that hits a surface and bounces within a space. It provides fill lighting and soft area shadowing for surfaces to ground objects within the space. Unreal Engine supports indirect lighting with precomputed baked global illumination from Lightmass, and dynamically with Lumen and Screen Space Global Illumimation.

The Mobility of a light determines which method a light should contribute to (in some cases).

[image: lumen-global-illumination example scene]

Scene showing real-time indirect lighting with Lumen dynamic global illumination.

Some dynamic global illumination methods are not able to be combined with precomputed ones, such as Lumen with baked global illumination. However can work together, such as using Hardware Ray Tracing with baked global illumination.

### Shadow Bias

When using the default shadow mapping method, the shadow map generated to shadow assets in the Level are set per-light to maintain a balance between performance and shadowing quality. Shadow maps have some limitations, such as faceting on curved geometric surfaces or self-shadowing artifacts, that can be adjusted using **Shadow Biasing** properties found on lights.

Shadow bias is a per-light set of properties that help improve accuracy of self-shadowing and contact hardening from a light source. Biasing settings are useful for finding a trade-off between accuracy in one area while reducing self-shadowing artifacts in another.

 [image: Default Shadow Bias Settings]

 [image: Adjusted Shadow Bias Settings]

For more information, see Movable Lights.

### Contact Shadows

Contact Shadows are a per-light additive feature to use on top of other shadowing methods employed by lights. It is a screen space effect that draws rays from a pixel's position toward the light source through the scene's depth buffer. Thus, it helps improve contact hardening and accuracy of shadows in some cases, but is limited by what is visible within the current camera view.

Use **Contact Shadows Length** property to define their length whereby a value of 1 is equal to the entire screen, 0.5 is half the screen, and 0 is disabled. Lower values produce less noise and may appear more accurate depending on the scene.

 [image: Contact Shadows Disabled]

 [image: Contact Shadows Enabled]

### Lightmass Settings

The **Lightmass** settings on a light affect precomputed lighting when the Light Mobility is set to **Static** or **Stationary** and a lighting build has been completed.

These settings control the baked softness of the shadow with Source Angle (-> shadowing-in-unreal-engine) for Directional Lights, how much this light's saturation affects indirect lighting, and the fall off of shadow penumbras with a shadow exponent.

### Shadowing with Materials and Textures

Lights can use Light Functions and IES Light Profiles to further define aspects of lights and their shadows.

**Light Functions** are a Material type that can be applied to non-lightmapped lights, like **Movable Lights** and the direct lighting of **Stationary Lights** to filter a light's intensity, but not its color. It can also be used to apply an animated texture to the light source. For example, simulating moving cloud shadows from a Directional Light.

[image: light function on a spot light]

**IES Light Profiles** are textures which describe a light's distribution from a light source using real-world measured data. They are a lighting industry standard method of diagramming the brightness and fall off of lights as it exists in a particular light fixture.

[image: ies profile examples]

### Distance Field Shadowing

Mesh Distance Fields have a variety of uses from shadowing to creating interactive materials and dynamic indirect lighting and reflections with Lumen.

A mesh distance field representation of a Static Mesh is used to produce soft shadowing from a **Movable** light sources when the **Distance Field Shadows** property is enabled.

This method of shadowing is similar to other methods, like Hardware Ray Tracing and Virtual Shadow Maps where the Source Angle, Radius, or Size (-> shadowing-in-unreal-engine) control penumbra of shadow.

[image: shadow maps versus distance field shadows]

Left, shadows maps; Right, shadows from mesh distance fields.

### Directional Light

Directional Lights

contains unique settings relevant to this light source to simulate large world lighting.

#### Cloud and Atmosphere Shadowing

In the Light's **Atmosphere and Clouds** section, there are settings and properties that affect how this light source will interact with Sky Atmosphere and Volumetric Clouds, such as having the sun affect the atmosphere and clouds, casting shadows from or onto clouds, and shadow quality, to name a few.

[image: cloud and atomosphere shadowing]

#### Cascaded Shadow Maps

Cascaded Shadow Maps split the camera view frustum into different cascades (or shadow levels of detail) for whole scene dynamic shadowing. This optimizes shadows over larger distances to provide quality where it's needed: higher quality closer to the camera position, lower quality farther away from the camera position.

The settings found under the **Cascaded Shadow Maps** section specify the number of cascades to use, their maximum distance, where to distribute quality, and where the transition between each cascade should be.

Cascaded shadow maps have a maximum distance you specify. But when you need shadowing on larger objects beyond this, you can use the **Far Shadow Cascades** to enable shadowing art farther distances. However, the one difference here is that you have to enable specified assets that you want to have shadowing at this distance. You can do this with this by selecting an Actor in the Level and enabling **Far Shadow** on that asset.

[image: directional light far shadow]

## Shadow Performance and Optimization Options

Performance of shadows can largely depend on the shadowing method being employed (-> shadowing-in-unreal-engine) for your project.

The properties mentioned in this section are starting points for optimizing lighting within a scene, especially for dynamic lights where some methods of shadowing are more expensive, like the default shadow mapping.

- **Attenuation Radius** for Point, Spot, and Rect Lights is important to control not only where light is within the scene but to limit the number of objects that have to be shadowed, which can make them expensive for some shadowing methods, especially the default shadow mapping method.
- Disabling **Cast Shadows** on dynamic lights can improve performance if the shadows are not contributing a lot to the scene, the light affects a lot of objects with a large attenuation radius, or assets have a lot of geometric detail. This mostly affects methods lit using traditional shadow mapping, but it's important to consider for any dynamic light to reduce frame cost.
- Setting a **Max Draw Distance** on a light will limit its dynamic shadowing contribution up to that point. For scenes where you have a lot of small to medium-sized lights affecting an area, this can help reduce frame cost. Using **Max Fade Range** in addition to the max draw distance will fade that light out over time so that it doesn't abruptly appear and disappear.
- The Shadow Map shadowing method is a product of balancing quality with performance. Sometimes, you want to trade performance for a bit of quality. The **Shadow Map Resolution** property enables you to increase the shadow map of the selected light to trade quality for performance.
- When using Hardware Ray Tracing Shadows you can adjust the **Samples Per Pixel** property under the **Ray Tracing** section to apply more samples to the light's ray-traced shadows. Fewer samples reduce quality and improve performance, while more samples improve quality (to a point with the denoising algorithm) but cost more.

- rendering
- lighting
- shadows
- mobility

On this page

- Supported Shadowing Methods (-> shadowing-in-unreal-engine)
- Static and Stationary Light Preview Shadowing (-> shadowing-in-unreal-engine)
- Configuring Shadowing Properties of Lights (-> shadowing-in-unreal-engine)
- Source Angle, Radius, Height and Width (-> shadowing-in-unreal-engine)
- Attenuation Radius (-> shadowing-in-unreal-engine)
- Casting Shadows (-> shadowing-in-unreal-engine)
- Volumetric Shadowing (-> shadowing-in-unreal-engine)
- Global Illumination Indirect Lighting (-> shadowing-in-unreal-engine)
- Shadow Bias (-> shadowing-in-unreal-engine)
- Contact Shadows (-> shadowing-in-unreal-engine)
- Lightmass Settings (-> shadowing-in-unreal-engine)
- Shadowing with Materials and Textures (-> shadowing-in-unreal-engine)
- Distance Field Shadowing (-> shadowing-in-unreal-engine)
- Directional Light (-> shadowing-in-unreal-engine)
- Cloud and Atmosphere Shadowing (-> shadowing-in-unreal-engine)
- Cascaded Shadow Maps (-> shadowing-in-unreal-engine)
- Shadow Performance and Optimization Options (-> shadowing-in-unreal-engine)

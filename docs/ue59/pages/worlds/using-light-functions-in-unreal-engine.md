# Light Functions

https://dev.epicgames.com/documentation/en-us/unreal-engine/using-light-functions-in-unreal-engine?application_version=5.9

> An overview of using materials to mask a light's projected area.

[image: Light Functions]

Light functions are materials that can be applied to lights to mask out and filter the light’s intensity. This is a material-driven approach that means you can have animated effects that work with lights when applied to opaque meshes. They also support shadowing with volumetric fog, making lighting functions most useful for creating lighting variations, such as caustics in water, clouds, and projected stencils.

Light function from Content Examples project demonstrating material-driven animation using a light function with volumetric fog.

Light functions can only be applied to lights with their mobility set to **Movable** or **Stationary** and cannot be baked into lightmaps. Light functions follow the same expensive rendering passes as lights that cast dynamic shadows, because the light function contribution needs to be accumulated in screen space first. The light function's second pass then evaluates the lighting in screen space. This is a sequential operation that happens on the GPU, and it takes more time due to resource synchronizations and cache flushes that happen.

Below are some examples of light functions used with different light types.

|  |  |  |
| --- | --- | --- |
|  | [image: Spot light with animated caustics light function.] | [image: Spot and Point Light with Colored light function with volumetric fog.] |
| Directional Light with Cloud Shadows Light Function | Spot Light with Caustics Light Function | Spot and Point Light with Colored Light Function with Volumetric Fog |

## Creating a Light Function

You can create a light function in a material by setting the **Material Domain** to **Light Function**. All nodes feed into the **Emissive Color** input on the main material node.

[image: Setting material domain in a material.]

## Applying a Light Function to a Light

To use a light function material with a light, assign it to a light’s **Light Function Material** slot using the light’s **Details** panel.

[image: Light details panel with light function material assignment slot.]

Once a light function has been assigned to a light, it does not require **Cast Shadows** to be enabled to display the light function material.

Light functions include the following properties on Lights:

[image: Light actor’s light function properties.]

| Property | Description |
| --- | --- |
| **Light Function Material** | The slot to apply a light function material to this light.Only non-lightmapped lights can have a light function applied. |
| **Light Function Scale** | Scales the light function being projected. X and Y scale the directions perpendicular to the light’s direction. Z scales along the light direction. |
| **Fade Distance** | Sets a distance at which the light function should be completely faded to the **Disabled Brightness** value. This is useful for hiding aliasing from light functions applied in the distance. |
| **Disabled Brightness** | Brightness factor applied to the light when the light function is specified but disabled, such as in scene captures that uses a view that have shadows disabled. This should be set to the average brightness of the light function material’s emissive input, which should be between 0 and 1. |

## Light Function Atlas

Light functions use the same expensive rendering passes as lights casting dynamic shadows. Light function contribution needs to be accumulated first in screen space, and then have a second pass that evaluates the lighting in screen space. This sequential operation on the GPU takes more time due to resource synchronization and cache flushes.

To mitigate the expensive GPU cost during this process, the **Light Function Atlas** is generative process used to bake animated light functions into tiles (or 2D textures) that make up make up the atlas. These 2D texture are stored and then projected onto the scene. To get a better sense of this operation, you can use the light function atlas visualization to see how each light function in the scene is stored in the atlas as a tile.

The example scene below contains four light functions that have been baked into 2D texture tiles and stored in the atlas.

[image: Example scene using Light Funciton Atlas visualization.] Example scene using the light function atlas visualization to demonstrate how light functions are baked into the light function atlas.

The process of baking light functions into the Atlas 2D texture is a fully parallel process done on the GPU, and the result is shared between all views of a scene. Then, during the **Light Pass**, all lights having a light function material on them with no shadow casting enabled can be accumulated in parallel on screen. This can result in significant savings of GPU time. For example, the Talisman Environment Template in Unreal Engine Fortnite Editor (UEFN) measured a GPU time reduction of more than 2 milliseconds (ms).

[image: Light function gpu timeline diagram.]

Unlike legacy light functions, the light function atlas can support grayscale or colored light function materials.

 [image: Light Functions using Legacy Pipeline and Passes]

 [image: Light Function Atlas with 8 Bit Gray Scale (and with Reduced GPU Cost)]

### Light Function Atlas Restrictions

Light function materials have some restrictions in order for them to be valid and baked into a light function atlas. Consider the following when enabling the light function atlas for your project:

- You cannot sample the depth buffer or world position.
- You cannot sample the GBuffer.
- To sample a texture, UVs should not be manipulated. However, if you do this, it’s important that the UV manipulation be aligned to the texture space edges of the light function. Otherwise, the atlas slot is not repeatable.This problem is visible on Directional and Rect lights, or any light that uses the scaling control from their details panel.
- Directional Lights are currently forced to not sample the atlas.

When these restrictions are met, a light function can be baked into the light function atlas for the fast lighting evaluation passes. Light functions are automatically detected and routed in and out of the light function atlas.

### Light Function Atlas Visualization

You can visualize which light functions have been included or excluded from the light function atlas using the command `ShowFlag.VisualizeLightFunctionAtlas 1`

[image: Light function atlas visualization.] This is an example of a light function atlas visualization. It includes a single light function being reported as non-compatible.

In this visualization, the following information is displayed:

- The **Light Function Atlas** shows all light functions that are a part of its atlas.
- Information about light functions in the scene:The number of **Light Functions in atlas**.
- The number of **Local Lights sampling atlas**.

- A color chart linking the number of lights affecting a light function in the atlas.
- A list of light functions which are not compatible with the light function atlas.

### Light Function Atlas Project Settings

The following properties can be found in the Project Settings window under **Engine > Rendering** in the **Light Function Atlas** category:

[image: Light function project settings.]

| Property | Description | Default State |
| --- | --- | --- |
| **Light Function Atlas** | Select the format of the light function atlas texture. | 8 bits Gray Scale |
| **Volumetric Fog Uses Light Function Atlas** | Enable support for light function on volumetric fog when the light function atlas is enabled. | Enabled |
| **Deferred Lighting Uses Light Function Atlas** | Enable support for light function on deferred lighting (multi-pass and clustered) when the light function atlas is enabled. | Enabled |
| **Single Layer Water Uses Light Function Atlas** | Enable support for light function on single layer water when the light function atlas is enabled. | Disabled |
| **Translucent Uses Light Function Atlas** | Enable support for light function on translucent materials using forward shading mode when the light function atlas is enabled. | Disabled |

### Setting Light Function Atlas Format

By default, the light function atlas uses grayscale for light functions, but you can change this in the project settings by setting the **Light Function Atlas Format** to **8 bits RGB Color** to have them use color. Colored light functions work with volumetric fog, Lumen global illumination and reflections, and with materials set to translucent or single layer water.

|  |  |
| --- | --- |
| [image: Light Function Atlas set to 8 Bits Gray Scale.] | [image: Light Function Atlas set to 8 Bits RGB Color.] |
| Light Function Atlas Format: 8 bits Gray Scale (Default) | Light Function Atlas Format: 8 bits RGB Color |

Colored light functions require the project setting **Deferred Lighting Uses Light Function Atlas** to be enabled. This setting is on by default when using the light function atlas.

### Light Function Atlas on Translucent and Single Layer Water Materials

By default, the light function atlas is used for deferred lighting, volumetric fog (-> volumetric-fog-in-unreal-engine), and Lumen global illumination and reflections (-> lumen-global-illumination-and-reflections-in-unreal-engine). You can further increase the fidelity of your project with light functions by enabling them to support sampling on translucent and single layer water (-> single-layer-water-shading-model-in-unreal-engine) materials.

You can toggle on support for translucent and single layer water materials in the project settings under **Engine > Rendering** in the **Light Function Atlas** category with **Translucent Uses Light Function Atlas** and **Single Layer Water Uses Light Function Atlas**.

|  |  |
| --- | --- |
| [image: Without Translucent Uses Light Function Atlas.] | [image: With Translucent Uses Light Function Atlas.] |
| Translucent Uses Light Function Atlas: Disabled | Translucent Uses Light Function Atlas: Enabled |

When **Translucent Uses Light Function Atlas** is enabled, any translucent material that has its **Lighting Mode** set to **Surface ForwardShading** can receive a light function on its surface. While light will cast onto the surface of a translucent material, the light function is only visible (in grayscale or color) on the surface when the material is set up to do so.

|  |  |
| --- | --- |
| [image: Translucent material with lighting mode set to Surface TranslucencyVolume.] | [image: Translucent material with lighting mode set to Surface ForwardShading.] |
| Translucent Material with Lighting Mode set to “Surface TranslucencyVolume”. | Translucent Material with Lighting Mode set to “Surface ForwardShading”. |

When **Single Layer Water Uses Light Function Atlas** is enabled, a water body using a single layer water material will receive light functions cast from a light source. The absorption coefficients (-> single-layer-water-shading-model-in-unreal-engine) and scattering coefficients (-> single-layer-water-shading-model-in-unreal-engine) of the single layer water material affect the look of the light function below the water’s surface. These properties affect how light travels through the medium, with blue light scattering by default causing colors in the red spectrum to become muted.

|  |  |
| --- | --- |
| [image: Custom water body without single layer water support for light function atlas.] | [image: Custom water body with single layer water support for light function atlas.] |
| Single Layer Water Uses Light Function Atlas: Disabled | Single Layer Water Uses Light Function Atlas: Enabled |

If you’re using the default single layer water material with a water body, you can adjust the roughness to make the light function more or less visible.

### Additional Light Function Atlas Notes

These are some additional notes and console variables you can use when working with the light function atlas:

- Light functions in the texture atlas will tile and fade out properly according to the parameters set up on the light component.
- An instanced light function material will use its own slot independently from the material it instances.
- For colored light functions, when the format is set to 8 Bits Gray Scale, an R8 texture format is used. When set otherwise, an R8G8B8 texture format is used.
- Useful console variables:`r.LightFunctionAtlas`: Use this to enable / disable the light function atlas and use legacy light functions.
- `r.LightFunctionAtlas.SlotResolution`: Sets the resolution at which a light function material is baked. You can see the resolution in the light function atlas visualization.
- `r.LightFunctionAtlas.Size`: Sets the size of the light function atlas. A value of 4 (4x4) means there will be maximum room for 16 light function materials baked into the atlas. You can see the atlas size in the light function atlas visualization.

- materials
- rendering
- lighting
- shadows
- light function
- light function atlas

On this page

- Creating a Light Function (-> using-light-functions-in-unreal-engine)
- Applying a Light Function to a Light (-> using-light-functions-in-unreal-engine)
- Light Function Atlas (-> using-light-functions-in-unreal-engine)
- Light Function Atlas Restrictions (-> using-light-functions-in-unreal-engine)
- Light Function Atlas Visualization (-> using-light-functions-in-unreal-engine)
- Light Function Atlas Project Settings (-> using-light-functions-in-unreal-engine)
- Setting Light Function Atlas Format (-> using-light-functions-in-unreal-engine)
- Light Function Atlas on Translucent and Single Layer Water Materials (-> using-light-functions-in-unreal-engine)
- Additional Light Function Atlas Notes (-> using-light-functions-in-unreal-engine)

# Shading Models

https://dev.epicgames.com/documentation/en-us/unreal-engine/shading-models-in-unreal-engine?application_version=5.9

> This document breaks down the Material Shading Models property options.

[image: Shading Models]

Shading Models control how your Material reflects incoming light. Or, put another way, it controls how the input data that makes up the Material is used to create the final look.

 [image: Shading Models drop-down menu]

Unreal Engine has many **Shading Models** designed to achieve specific looks for the Materials you set up. For instance, the **Default Lit** Shading Model is a general purpose model you will likely use for most of your surfaces. Unreal also includes Shading Models designed for specific surface types. For example, the **Clear Coat**, **Hair**, and **Cloth** Shading Models are tailored to provide natural results for those specific types of Materials.

## Unlit

The **Unlit** Shading Model only outputs Emissive for color, making this perfect for special effects such as fire or any light emitting object. Note that in this example, the Material is not casting light into the scene. Instead, its high Emissive value results in a glow effect, which is also picked up by the dirt mask applied to the camera. It appears to illuminate, but no lighting or shadows are cast by this object. Emissive Materials can cast light into the scene if Lumen is enabled, or with Lightmass when Use Emissive for Static Lighting (-> using-the-emissive-material-input-in-unreal-engine) is turned on.

 [image: Unlit example]

When using the Unlit Shading Model, you have access to the following inputs:

- Emissive Color

- World Position Offset

- Pixel Depth Offset

## Default Lit

**Default Lit** is the default shading model and is likely the one that you will use most often. This shading model makes use of direct and indirect lighting, as well as specularity for reflections.

 [image: Default Lit Shading Model]

When using the Default Lit Shading Model, you have access to the following inputs:

- Base Color

- Metallic

- Specular

- Roughness

- Emissive Color

- Normal

- World Position Offset

- Ambient Occlusion

- Pixel Depth Offset

## Subsurface

The **Subsurface** Shading Model simulates the effect of subsurface scattering. This is a real-world phenomenon in which light penetrates a surface and then diffuses throughout it. Subsurface scattering is readily apparent on objects such as ice, wax candles, and skin.

The Subsurface model (as well as the Preintegrated Skin model described below) relies on the **Subsurface Color** input. This input defines the color of the matter just beneath the surface of the object. When light scatters through the surface, the Subsurface Color becomes visible.

For human skin, you can often get good results using a dark red color, which simulates blood circulating beneath the surface. In the Ice Elemental below, a dark blue-green color (with a variety of calculations based on lighting) is used to give a sense of translucent depth to the surface.

For more information, see the Subsurface Shading Model documentation (-> subsurface-shading-model-in-unreal-engine).

 [image: Ice subsurface scattering example]

When using the Subsurface Shading Model, you have access to the following inputs:

- Base Color

- Metallic

- Specular

- Roughness

- Emissive Color

- Opacity

- Normal

- World Position Offset

- Subsurface Color

- Ambient Occlusion

- Pixel Depth Offset

## Preintegrated Skin

The **Preintegrated Skin** Shading Model is very similar to the Subsurface model, but prioritizes lower performance cost while sacrificing some accuracy. While not physically perfect, this Shading Model often gives nice results for human skin with better performance than the Subsurface method. In the image below, the character's flesh uses the Preintegrated Skin Shading Model.

 [image: Infiltrator demo preintegrated skin]

When using the Preintegrated Skin Shading Model, you have access to the following inputs:

- Base Color

- Metallic

- Specular

- Roughness

- Emissive Color

- Opacity

- Normal

- World Position Offset

- Subsurface Color

- Ambient Occlusion

- Pixel Depth Offset

## Clear Coat

The **Clear Coat** Shading Model is used to better simulate multilayer Materials that have a thin translucent layer of film over the surface of a standard Material. This Shading Model was specifically designed to model smooth colored films over a non-colored metal. However, you can use this Shading Model with both metal and non-metal surfaces.

Some examples include acrylic or lacquer clear coats, and colored films over metals such as soda cans and car paint.

 [image: Clear coat Material]

Note that the flecks were done in the Material Editor and are not part of the Shading Model

### Dual-Normal Clear Coat

The Clear Coat Shading Model also has an option to add a second Normal Map for the surface that is below the clear coat layer. This enables the Material to more accurately model complex Materials such as carbon fiber and car paints, which have a different geometric or reflective surface than the clear coat layer.

|  |  |
| --- | --- |
| [image: Clear Coat with Bottom Normal] | [image: Photograph of real-world Clear Coat Material] |
| Clear Coat with Bottom Normal | Actual Photograph |

When using the Clear Coat Shading Model, you have access to the following inputs:

- Base Color

- Metallic

- Specular

- Roughness

- Emissive Color

- Normal

- World Position Offset

- Clear Coat

- Clear Coat Roughness

- Ambient Occlusion

- Pixel Depth Offset

## Subsurface Profile

The Subsurface Profile Shading Model (-> subsurface-profile-shading-model-in-unreal-engine) is very similar in nature to both the Subsurface and Preintegrated Skin Shading Model, but it is geared towards higher-end skin rendering. If you are trying to simulate skin, especially human skin, this is the highest quality Shading Model to use for that purpose.

 [image: Standard Shading]

 [image: Subsurface Profile Shading]

When using the Subsurface Profile Shading Model, you have access to the following inputs:

- Base Color

- Metallic

- Specular

- Roughness

- Emissive Color

- Opacity

- Normal

- World Position Offset

- Ambient Occlusion

- Pixel Depth Offset

## Two Sided Foliage

The **Two Sided Foliage** Shading Model allows light transmission through the surface of the Material creating natural, uniform looking results, like light passing through the leaves of a tree. The subsurface color is used to define the amount of light transmission and is used for creating masks for things such as the stems and veins of the leaves.

The Two Sided Foliage Shading Model helps eliminate some issues present in the Subsurface (-> shading-models-in-unreal-engine) scattering model, which works well on skin or thicker surfaces, but is not as accurate for thin surfaces like leaves. Similarly, using the **Default Lit** shading model for foliage can lead to incorrect looking results. In the example below, the Default Lit result appears almost black on the underside surfaces because it does not simulate any sort of light transmission, which is critical for natural looking foliage.

 [image: Default Lit]

 [image: Two Sided Foliage]

When using the Two Sided Foliage Shading Model, you have access to the following inputs:

- Base Color

- Metallic

- Specular

- Roughness

- Emissive Color

- Normal

- World Position Offset

- Subsurface Color

- Ambient Occlusion

- Pixel Depth Offset

## Hair

The **Hair** Shading Model enables you to create natural looking hair that simulates multiple specular highlights: one representing the color of light, and another representing a mix of hair and light color.

 [image: Hair shading model example]

When using the Hair Shading Model, you have access to the following inputs:

- Base Color

- Scatter

- Specular

- Roughness

- Emissive Color

- Tangent

- World Position Offset

- Backlit

- Ambient Occlusion

- Pixel Depth Offset

## Cloth

The **Cloth** Shading Model enables you to create Materials that mimic the properties of cloth more accurately. This includes a thin "fuzz" layer across the cloth surface, better simulating the way light interacts with these types of Materials.

 [image: Cloth shading model]

When using the Cloth Shading Model, you have access to the following inputs:

- Base Color

- Metallic

- Specular

- Roughness

- Emissive Color

- Opacity

- Normal

- World Position Offset

- Fuzz Color

- Cloth

- Ambient Occlusion

- Pixel Depth Offset

## Eye

The **Eye** Shading Model is designed to simulate the surface of an eye, exposing artistic controls for the iris shape and distance. This Shading Model is highly technical and has been developed in a way that produces very strong dependencies between the shader code, the Material, the shape of the geometry, and its UV layout.

Building an eye Material on your own is not recommended without extensive experience in shader development. If you are interested in creating realistic humanoid eyes, Epic recommends extracting the eye geometry from the Digital Humans example project available on the Epic Games Launcher in the **Learn** tab. Use the Material assigned to the eye geometry in that project **as-is**, replacing the necessary textures to suit your purpose.

 [image: Eye shading model example]

When using the Eye Shading Model, you have access to the following inputs:

- Base Color

- Metallic

- Specular

- Roughness

- Emissive Color

- Opacity

- Normal

- World Position Offset

- Iris Mask

- Iris Distance

- Ambient Occlusion

- Pixel Depth Offset

## Single Layer Water

The **Single Layer Water** Shading Model enables you to achieve the effect of a transparent water surface while using an **Opaque** Blend Mode. This reduces the cost and complexity of using Materials that require the **Transparent** Blend Mode.

 [image: Shading Model: Default Lit]

 [image: Shading Model: Single Layer Water]

When using the Single Layer Water Shading Model, you have access to the following inputs:

- Base Color

- Metallic

- Specular

- Roughness

- Emissive Color

- Opacity

- Normal

- World Position Offset

- Ambient Occlusion

- Refraction

- Pixel Depth Offset

For more information, see Single Layer Water Shading Model (-> single-layer-water-shading-model-in-unreal-engine).

## Thin Translucent

The **Thin Translucent** Shading Model supports physically based translucent Material types, enabling you to create true tinted or colored glass that handles specular and background objects accurately.

For example, when creating a tinted glass Material, both the white specular highlight and the tinted background are needed. This Shading Model renders both in a single pass with a physically based shader that accounts for light bounces from the air into the glass, and from the glass into the air.

 [image: Shading Model: Transparency]

 [image: Shading Model: Thin Transparency]

When using the Thin Translucent Shading Model, you have access to the following inputs:

- Base Color

- Metallic

- Specular

- Roughness

- Emissive Color

- Opacity

- Normal

- World Position Offset

- Ambient Occlusion

- Pixel Depth Offset

## From Material Expression

The **From Material Expression** (or Per-Pixel) shader model is an advanced feature enabling you to combine multiple Shading Models into a single Material (or Material Instance) through logic in the Material Graph.

When the **Shading Model** is set to **From Material Expression**, the **Shading Model** input is enabled and you can use the **Shading Model** node in your Material Graph to set it.

 [image: From Material Expression example]
 [image: Blend Material attributes example]

When using the From Material Expression Shading Model, you have access to the following inputs:

- Base Color

- Metallic

- Specular

- Roughness

- Emissive Color

- Normal

- World Position Offset

- Ambient Occlusion

- Pixel Depth Offset

- Shading Model

For additional information and example use cases, see From Material Expression (-> from-material-expression-shading-model-in-unreal-engine) shading model.

- materials
- rendering
- shaders
- material properties

On this page

- Unlit (-> shading-models-in-unreal-engine)
- Default Lit (-> shading-models-in-unreal-engine)
- Subsurface (-> shading-models-in-unreal-engine)
- Preintegrated Skin (-> shading-models-in-unreal-engine)
- Clear Coat (-> shading-models-in-unreal-engine)
- Dual-Normal Clear Coat (-> shading-models-in-unreal-engine)
- Subsurface Profile (-> shading-models-in-unreal-engine)
- Two Sided Foliage (-> shading-models-in-unreal-engine)
- Hair (-> shading-models-in-unreal-engine)
- Cloth (-> shading-models-in-unreal-engine)
- Eye (-> shading-models-in-unreal-engine)
- Single Layer Water (-> shading-models-in-unreal-engine)
- Thin Translucent (-> shading-models-in-unreal-engine)
- From Material Expression (-> shading-models-in-unreal-engine)

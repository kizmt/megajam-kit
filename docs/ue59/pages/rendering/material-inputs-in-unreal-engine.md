# Material Inputs

https://dev.epicgames.com/documentation/en-us/unreal-engine/material-inputs-in-unreal-engine?application_version=5.9

> An in-depth look at the various inputs available on a Material and how they are used.

[image: Material Inputs]

This page documents all the available inputs on the Main Material Node. By feeding data (by way of constants, parameters, and textures) into these inputs, you can define the surface properties of your Material and create an almost infinite variety of physical surfaces.

Not all inputs are required for every Material, and some Material types require inputs that are not visible on the Main Material Node by default.

## Inputs and Material Properties

When you change certain Material properties in the Details panel, you will notice that some inputs on the Main Material Node turn white (indicating that they are enabled), while others are grayed out.

Three material properties control which inputs are enabled in the Material:

- **Blend Mode** - This controls how your Material blends with the pixels behind it.

- **Shading Model** - This defines how light is calculated for the surface of the Material.

- **Material Domain** - This dictates how the Material is intended to be used. For instance, whether it is meant to be part of a surface, a Light Function, or a Post Process Material.

If an input you need for your Material is disabled, it is because one or more of the above properties is set incorrectly. For example, if you are trying to make a pane of glass, but the opacity input is disabled. The solution in that example is to change the **Blend Mode** to **Translucent**.

## Base Color

Base Color defines the overall color of the Material. In principle, Base Color should represent the diffuse light reflected off a surface, minus any specular reflections/highlights.

If taken from the real world, base color textures should be photographed using a polarizing filter. Polarization removes the specular of nonmetals when aligned.

 [image: Base Color]

## Metallic

The Metallic input controls how 'metal-like' your surface will be. Metallic accepts any value between 0 and 1, but in a majority of cases Metallic is considered an either/or property.

- Nonmetals have a Metallic value of 0.

- Metals have a Metallic value of 1.

For pure surfaces, such as pure metal, pure stone, or pure plastic this value will be 0 or 1, not anything in between. When creating hybrid surfaces like corroded, dusty, or rusty metals, you may find that you need some value between 0 and 1.

 [image: Metallic Value 0]
 [image: Metallic Value 0]
 [image: Metallic Value 1]

**Metallic values of 0, 0.5, and 1.**

When using metallic masks, the values in the texture should be pure black or pure white. Only use grayscale values if you specifically mean to create a blend (corroded metal, for example).

## Specular

Specularity is a measure of how much light a surface reflects. The Specular input takes a value between 0 and 1, and defines the extent to which a surface is reflective:

- **Value of 0** - Fully non-reflective

- **Value of 1** - Fully reflective

- The default value is 0.5, which represents approximately 4% reflectivity.

 [image: Specular value 0]
 [image: Specular value 0.5]
 [image: Specular value 1]

**Specular values of 0, 0.5, and 1**

## Roughness

The Roughness input controls how rough or smooth a Material's surface is. Rough Materials scatter reflected light in more directions than smooth Materials. This value controls how blurry or sharp a reflection is (or how broad or tight a specular highlight is).

- A Roughness of 0 (smooth) results in a mirror-like reflection.

- A Roughness of 1 (rough) results in a diffuse or matte surface.

 [image: Roughness Value 0]
 [image: Roughness Value 0]
 [image: Roughness Value 1]

**Roughness values of 0, 0.5, and 1.**

Most surfaces are not uniformly rough or smooth. Roughness is a property that is frequently mapped on your objects in order to add physical variation to the surface.

Scratches on metal, scuffs on a wood floor, or fingerprints on plastic are examples of materials that would require a roughness map.

 [image: Roughness map]

## Anisotropy and Tangent

The **Anisotropy** and **Tangent** inputs enable you to control how anisotropic the roughness of the Material is and its light directionality. These two inputs are used to recreate the anisotropic effect of something like brushed metal.

Without using the Anisotropic and Tangent inputs, materials have an isotropic response. This is also true when the anisotropic input has a value of 0.

 [image: Isotropic Material Response]

 [image: Anisotropic Material Response]

The anisotropic response is controllable using a value between -1.0 and 1.0, where a value of 0 has no anisotropic effect.

Anisotropic materials are enabled by default but can be disabled using the console command `r.AnisotropicMaterials.` When enabled, anisotropy works with supported Gen5 platforms, and when scalabiltiy settings are High, Epic, or Cinematic.

**Dragging the slider shows the anisotropic response positively increasing from 0.0 to 1.0.**

Use the **Tangent** input to define light directionality with a texture or Vector expression.

## Emissive Color

The **Emissive Color** input controls which parts of your Material will glow or emit light, and the brightness of the emission. Ideally this input will receive a masked texture (mostly black except the areas that need to glow).

Values greater than 1 are allowed as HDR lighting is supported.

 [image: Emissive map]

## Opacity

The Opacity input is enabled when the Translucent Blend Mode (-> material-blend-modes-in-unreal-engine) is selected, typically for Translucent, Additive, and Modulated Materials.

- 0.0 represents a completely transparent Material.

- 1.0 represents a fully opaque Material.

- Fractional values between 0 and 1 produce semi-transparent or translucent Materials.

Opaque and masked blend modes also use Opacity when using one of the subsurface shading models.

 [image: Translucency Image]

Opacity is mostly used for **Translucent**, **Additive**, and **Modulated** Materials.

## Opacity Mask

**Opacity Mask** is similar to Opacity, but is only available when using the Masked Blend Mode.

Unlike the opacity input, the opacity mask does not allow for partial or intermediate transparency levels. When using an opacity mask, regions of the Material are either fully visible, or fully invisible. This makes it a good solution when you need Materials that define complex solid surfaces such as wire mesh, chain link faces, and so on.

 [image: Opacity masked Material]

The **Opacity Mask Clip Value** property allows you to set the value at which clipping takes place. For example, if the Opacity Mask Clip Value is set to 0.5:

- Pixels with a value greater than 0.5 on the Opacity Mask become fully opaque.

- Pixels with a value lower than 0.5 on the Opacity Mask become fully transparent.

See the Masked Blend Mode documentation (-> material-blend-modes-in-unreal-engine) for more details.

## Normal

The **Normal** input takes in a normal map, which is used to add significant physical detail to the surface by modifying the "normal," or facing direction, of each individual pixel.

**In the image above**, both weapons are using the same Static Mesh. The lower one employs a highly detailed normal map, which provides additional detail. This gives the illusion that the surface contains many more polygons than are actually being rendered.

Typically, normal maps are often created from high-resolution modeling packages.

## World Position Offset

The World Position Offset input allows a Material to manipulate the vertices of a mesh in world space. This is useful for making objects move, change shape, rotate, and a variety of other effects. World Position Offset is often used for subtle, ambient animation.

The above network causes the sphere to grow and shrink along its vertex normals with a sinusoidal period of one second.

When using World Position Offset to expand your object beyond its original bounds, keep in mind that the renderer still uses those original bounds. This means that you may see culling and shadowing errors. You may go into the properties of a mesh and set its **Scale Bounds** property to compensate, though this has a draw on performance and may lead to shadowing errors.

## Subsurface Color

The **Subsurface Color** input is only enabled when the Shading Model (-> subsurface-shading-model-in-unreal-engine) property is set to Subsurface. This input allows you to add a color to your Material to simulate shifts in color when light passes through the surface.

For example, human skin shaders often use a red Subsurface Color to simulate blood beneath the surface. Subsurface skin effects are most noticeable in extremities like the tip of the nose, fingers or earlobes when backlit by a strong light source.

## Custom Data

The Custom Data Material inputs are disabled by default, and are only enabled when certain Shading Models are in use. The Custom Data slots are populated with context-specific inputs that support the unique needs of some Shading Models.

For example, if you select the **Eye** shading model, the Custom Data inputs become **Iris Mask** and **Iris Distance**.

Shading Models that use the Custom Data inputs include:

- Clear Coat

- Subsurface Profile

- Hair

- Cloth

- Eye

## Hair

The **Hair** Shading Model is used to better simulate the translucent nature of hair. This shading model approximates the way light passes through hair, accounting for the fact that strands of hair are not perfectly cylindrical.

Additionally, instead of rendering a unified specular highlight, the specular reflections are independently placed based on the direction that the hair is pointing.

 [image: Hair Example]

When the hair shading model is selected, three inputs are enabled on the Main Material Node:

- **Scatter:** This input controls the amount of light scatter that is allowed to happen through the hair.

- **Tangent:** This input replaces the **Normal** input and is used to control the normal direction along the U and V texture coordinates.

- **Backlit:** This input controls the amount of backlighting that affects this hair material.

For an example of hair set up using this Shading Model, see the Digital Humans documentation and sample project available on the Epic Games Launcher in the **Learn** tab.

## Cloth

The **Cloth** Shading Model can be used to better simulate cloth-like materials that have a thin layer of fuzz over the surface of the Material.

 [image: Cloth example]

The Cloth Shading Model opens up two inputs on the Main Material node:

- **Fuzz Color:** This input enables you to add color to your Material to simulate shifts in color when light passes through the surface.

- **Cloth:** This input enables you to control the strength of the **Fuzz Color** as a mask. A value of 0 indicates no fuzz color contribution to the Base Color, whereas a value of 1 blends fully over the Base Color.

## Eye

This is an advanced shading model that is highly technical and has very strong dependencies between shader code, the Material, the shape of the geometry and its UV layout. Epic recommends using our Digital Humans sample project as a starting point when developing your own eye assets or migrating them directly from this project.

The **Eye** Shading Model is designed to simulate that of an eye's surface.

The Eye Material Instance below has been set up to expose artistic cotnrol over the different biological parts of the eye shader that can be found in the Digital Humans sample project.

Click image for full size.

The Eye Shading Model adds two additional inputs to the Main Material node:

- **Iris Mask:** This helps control the index of refraction and depth of the iris. In the Material **M_EyeRefractive** in the Digital Humans sample project, see the **IOR** and **Depth Scale** parameters.

- **Iris Distance:** This controls the concavity of the refracted iris. In the Material **M_EyeRefractive** in the Digital Humans sample project, see the **Iris Concavity Scale** and **Iris Concavity Power** parameters.

## Clear Coat

The **Clear Coat** Shading Model is used to better simulate multilayer materials that have a thin translucent layer of film over the surface of the Material. You can use Clear Coat with either metal or non-metal surfaces.

Examples of clear coat Materials include lacquer clear coats (used on furniture, for example), or colored films over uncolored metal, such as with car paint or soda cans.

 [image: Clear coat example]

The Clear Coat Shading Model enables two new Material inputs on the Main Material Node:

- **Clear Coat**: Amount of clear coat layer, 0 acts like the standard shading model, 1 is the full clear coat model. This is useful for masking.

- **Clear Coat Roughness**: Roughness for the clear coat layer. Our approximation is accurate for small values. Very rough clear coat layers are supported but will not be very accurate compared to their real world counterparts.

## Ambient Occlusion

The **Ambient Occlusion** input is used to help simulate the self-shadowing that happens within the crevices of a surface. Generally this input will be connected to an ambient occlusion texture map of some kind, which is often created within 3D modeling packages such as Maya, 3ds Max, or Zbrush.

Note that this input relies on light sources using **Static** or **Stationary** mobility to generate built lighting. This material input is silently ignored when its Material is used in conjunction with any **Movable** light sources.

## Refraction

The Refraction input takes in a texture or value that simulated the index of refraction of the surface. This is useful for things like glass and water, which refract light passing through them.

In the graph pictured above a Fresnel Material function is used to blend between two different IOR values.

 [image: Refraction network]

| Common Indices of Refraction |  |
| --- | --- |
| **Air** | 1.00 |
| **Water** | 1.33 |
| **Ice** | 1.31 |
| **Glass** | 1.52 |
| **Diamond** | 2.42 |

## Pixel Depth Offset

The **Pixel Depth Offset** input is used to control pixel depth in the shader graph using logic you set up. This enables you to create your own logic to blend or fade objects based on their scene depth.

 [image: Pixel depth offset]

In this comparison, using Pixel Depth Offset with the DitherTemporalAA Material Function enables you to set an "offset" value that blends the ground with the object intersecting it using a stipple pattern texture.

 [image: Without Pixel Depth Offset]

 [image: With Pixel Depth Offset]

## Shading Model

This input requires you to select the **From Material Expression** Shading Model in the Material **Details** panel.

The **Shading Models** input enables you to use logic in your Material Graph to select from a list of available Shading Models to use for part of your Material. This input is useful when you have a single object that needs to use multiple shading models, like Clear Coat and Default Lit. This can reduce the number of Materials required, in turn, saving performance and draw calls. All of this can be driven by logic in your Material using the Shading Model expression node and some texture masks.

The following is a simple example using an **If** expression to choose between Shading Models.

Using this example, when A is greater than B, the resulting shading model is **Default Lit**. When A is less or equal to B, a texture mask is used to display **Default Lit** and **Clear Coat** shading models on parts of the mesh.

 [image: A > B: Uses Default Lit | B = 0.0]

 [image: A <= B: Uses Clear Coat | B = 0.5]

For more information and examples of this inputs usage, see the From Material Expression (-> from-material-expression-shading-model-in-unreal-engine) page.

- materials
- shaders
- material properties

On this page

- Inputs and Material Properties (-> material-inputs-in-unreal-engine)
- Base Color (-> material-inputs-in-unreal-engine)
- Metallic (-> material-inputs-in-unreal-engine)
- Specular (-> material-inputs-in-unreal-engine)
- Roughness (-> material-inputs-in-unreal-engine)
- Anisotropy and Tangent (-> material-inputs-in-unreal-engine)
- Emissive Color (-> material-inputs-in-unreal-engine)
- Opacity (-> material-inputs-in-unreal-engine)
- Opacity Mask (-> material-inputs-in-unreal-engine)
- Normal (-> material-inputs-in-unreal-engine)
- World Position Offset (-> material-inputs-in-unreal-engine)
- Subsurface Color (-> material-inputs-in-unreal-engine)
- Custom Data (-> material-inputs-in-unreal-engine)
- Hair (-> material-inputs-in-unreal-engine)
- Cloth (-> material-inputs-in-unreal-engine)
- Eye (-> material-inputs-in-unreal-engine)
- Clear Coat (-> material-inputs-in-unreal-engine)
- Ambient Occlusion (-> material-inputs-in-unreal-engine)
- Refraction (-> material-inputs-in-unreal-engine)
- Pixel Depth Offset (-> material-inputs-in-unreal-engine)
- Shading Model (-> material-inputs-in-unreal-engine)

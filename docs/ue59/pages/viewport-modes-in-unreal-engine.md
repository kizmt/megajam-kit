# Viewport Modes

https://dev.epicgames.com/documentation/en-us/unreal-engine/viewport-modes-in-unreal-engine?application_version=5.9

> Explanations for the available View Modes within the viewports.

[image: Viewport Modes]

[image: Viewmode Header]

The Unreal Editor viewports have a large number of visualization modes to help you see the type of data being processed in your scene, as well as to diagnose any errors or unexpected results. The more common view modes have their own hotkeys, but all can be accessed from the viewport within the **View Mode** menu.

[image: Viewmode Menu] Click image for full size.

[image: Viewmodes Submenu Button] Click image for full size.

## Lit

[image: Viewmode Lit] Click image for full size.

- View Mode Hotkey: **Alt + 4**
- Console command: `viewmode lit`

**Lit** view mode shows the final result of your scene once all of the Materials and lighting have been applied.

## Unlit

[image: Viewmode Unlit] Click image for full size.

- View Mode Hotkey: **Alt + 3**
- Console command: `viewmode unlit`

**Unlit** view mode removes all lighting from the scene, showing you Base Color only.

## Wireframe

[image: Viewmode Wireframe] Click image for full size.

- View Mode Hotkey: **Alt + 2**
- Console command: `viewmode wireframe`

**Wireframe** shows all of the polygon edges in the scene. In the case of Brushes, you will see the resultant geometry.

## Detail Lighting

[image: Detail Lighting] Click image for full size.

- View Mode Hotkey: **Alt + 5**
- Console command: `viewmode lit_detaillighting`

**Detail Lighting** activates a neutral Material across the entire scene, using the normal maps of the original materials. This is useful for isolating whether your BaseColor is obscuring lighting by being too dark or noisy.

## Lighting Only

[image: Lighting Only] Click image for full size.

- View Mode Hotkey: **Alt + 6**
- Console command: `viewmode lightingonly`

**Lighting Only** shows a neutral Material that is only affected by lighting. It differs from Detail Lighting mode in that you will not see normal maps.

## Light Complexity

[image: Optimization Viewmodes Menu] Click image for full size.

[image: Light Complexity] Click image for full size.

- View Mode Hotkey: **Alt + 7**
- Console command: `viewmode lightcomplexity`

Light Complexity shows the number of non-static lights affecting your geometry. This is useful for tracking lighting cost - the more lights affecting a surface, the more expensive it will be to shade.

| Light Complexity Coloration |  |  |  |  |  |  |
| --- | --- | --- | --- | --- | --- | --- |
| **Color** | [image: LightComplexity_0] | [image: LightComplexity_1] | [image: LightComplexity_2] | [image: LightComplexity_3] | [image: LightComplexity_4] | [image: LightComplexity_5] |
| **Number of Lights Affecting Surface** | **0** | **1** | **2** | **3** | **4** | **5+** |

This color scheme is defined in the shader code.

## Shader Complexity

[image: Shader Complexity] Click image for full size.

- View Mode Hotkey: **Alt + 8**
- Console command: `viewmode shadercomplexity`

**Shader Complexity** Mode is used to visualize the number of shader instructions being used to calculate each pixel of your scene. It is generally a good indication of how performance-friendly your scene will be. In general, it is used to test overall performance for your base scene, as well as to optimize particle effects, which tend to cause performance spikes with a large amount of overdraw for a short period of time.

Only instruction count is used to calculate shader complexity, which may not always be accurate. For example, a shader with 16 instructions, all texture lookups, will be much slower on all platforms than a shader with 16 math instructions. Also shaders which contain loops that are not unrolled will not be represented accurately by the instruction count, this is mainly an issue for vertex shaders. Overall the instruction count is a good metric in the vast majority of cases.

The view mode uses a color spectrum to indicate how expensive the scene is. Green through red represent a linear relationship of "very inexpensive" to "expensive", while pink and white indicate a large jump to "very expensive" pixels. Small areas of white can be tolerated, but if the majority of your screen is covered in bright red or white, the performance will be poor.

|  |  |  |  |  |  |  |  |  |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Shader Complexity Coloration |  |  |  |  |  |  |  |  |
|  |  |  |  |  |  |  |  |  |
| **Ideal** |  |  | **Moderate** |  |  | **Expensive** | **Very Expensive** |  |

**+ShaderComplexityColors** is defined in the `BaseEngine.ini` file and is linearly interpolated (lerped) based on the total number of instructions for a given pixel.

 C++

```
+ShaderComplexityColors=(R=0.0,G=1.0,B=0.127,A=1.0)
+ShaderComplexityColors=(R=0.0,G=1.0,B=0.0,A=1.0)
+ShaderComplexityColors=(R=0.046,G=0.52,B=0.0,A=1.0)
+ShaderComplexityColors=(R=0.215,G=0.215,B=0.0,A=1.0)
+ShaderComplexityColors=(R=0.52,G=0.046,B=0.0,A=1.0)
+ShaderComplexityColors=(R=0.7,G=0.0,B=0.0,A=1.0)
+ShaderComplexityColors=(R=1.0,G=0.0,B=0.0,A=1.0)
+ShaderComplexityColors=(R=1.0,G=0.0,B=0.5,A=1.0)
+ShaderComplexityColors=(R=1.0,G=0.9,B=0.9,A=1.0)
```

+ShaderComplexityColors=(R=0.0,G=1.0,B=0.127,A=1.0)
+ShaderComplexityColors=(R=0.0,G=1.0,B=0.0,A=1.0)
+ShaderComplexityColors=(R=0.046,G=0.52,B=0.0,A=1.0)
+ShaderComplexityColors=(R=0.215,G=0.215,B=0.0,A=1.0)
+ShaderComplexityColors=(R=0.52,G=0.046,B=0.0,A=1.0)
+ShaderComplexityColors=(R=0.7,G=0.0,B=0.0,A=1.0)
+ShaderComplexityColors=(R=1.0,G=0.0,B=0.0,A=1.0)
+ShaderComplexityColors=(R=1.0,G=0.0,B=0.5,A=1.0)
+ShaderComplexityColors=(R=1.0,G=0.9,B=0.9,A=1.0)

**MaxPixelShaderAdditiveComplexityCount** is set to a default range of 2000, however, this value can be changed in the `BaseEngine.ini` file to help with the optimization of materials in your project.

 C++

```
MaxPixelShaderAdditiveComplexityCount=2000
```

MaxPixelShaderAdditiveComplexityCount=2000

**MaxES3PixelShaderAdditiveComplexityCount** defines the range in the ES3 Preview Mode and is set to a default range of 800.

 C++

```
MaxES3PixelShaderAdditiveComplexityCount=800
```

MaxES3PixelShaderAdditiveComplexityCount=800

These Colors can be modified in the `BaseEngine.ini` file. The max pixel shader additive complexity count variables can also be overridden in your project's `DefaultEngine.ini` file.

## Stationary Light Overlap

[image: Stationary Light Overlap] Click image for full size.

- View Mode Hotkey: **None (Menu only by default)**

## Lightmap Density

[image: Lightmap Density] Click image for full size.

View Mode Hotkey: **Alt + 0**

**Lightmap Density** mode displays the lightmap density of objects that are texture mapped, color coding them by their relation to an ideal/max density setting and displaying a grid that maps to the actual lightmap texels. It is important to have even texel density across your scene to get consistent lightmap lighting.

|  |  |  |
| --- | --- | --- |
| [image: Lightmap Density Light] | [image: Lightmap Density Medium] | [image: Lightmap Density Heavy] |
| Less than ideal texel density | Ideal texel density | Max or greater than ideal texel density |

Skeletal Meshes will appear in light brown and are not considered in this calculation.

## Reflections

[image: Reflections] Click image for full size.

- View Mode Hotkey: **None (Menu only by default)**

**Reflections** view mode overrides all materials with a flat normal and a roughness of 0, which is a mirror. This is useful for diagnosing the detail of reflections and allowing you to place more Reflection Capture Actors in areas where you need more detail.

## Player Collision

[image: Player Collision] Click image for full size.

- Console command: `viewmode CollisionPawn`

The** Player Collision** viewmode highlights assets that collide with a character or Pawn and uses the following colors:

| Player Collision Coloration |  |  |  |  |  |  |
| --- | --- | --- | --- | --- | --- | --- |
| **Color** |  |  |  |  |  |  |
| **Description** | **Static Mesh** | **Stationary Static Mesh** | **Movable Static Mesh** | **Volume** | **Trigger Volume** | **Brush** |

## Visibility Collision

[image: Visibility Collision] Click image for full size.

- Console command: `viewmode CollisionVisibility`

The **Collision Visibility** viewmode highlights whitch Actors will block visibility. It uses the following colors:

| Collision Visibility Coloration |  |  |  |  |  |
| --- | --- | --- | --- | --- | --- |
| **Color** |  |  |  |  |  |
| **Description** | **Static Mesh** | **Stationary Static Mesh** | **Movable Static Mesh** | **Volume** | **Brush** |

## LOD Coloration

[image: Level of Detail Coloration Menu] Click image for full size.

[image: LOD Coloration] Click image for full size.

- Console command: `viewmode LODColoration`

**LOD Coloration** view mode displays the current LOD index of a primitive. This is useful for diagnosing any LOD issues or to see at which distance your LODs are switching.

| LOD Primitive Coloration |  |  |  |  |  |  |  |  |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| **Color** | [image: LOD Coloration_0] | [image: LOD Coloration_1] | [image: LOD Coloration_2] | [image: LOD Coloration_3] | [image: LOD Coloration_4] | [image: LOD Coloration_5] | [image: LOD Coloration_6] | [image: LOD Coloration_7] |
| **LOD Primitive Color** | **0** | **1** | **2** | **3** | **4** | **5** | **6** | **7** |

 C++

```
+LODColorationColors=(R=1.0,G=1.0,B=1.0,A=1.0)
+LODColorationColors=(R=1.0,G=0.0,B=0.0,A=1.0)
+LODColorationColors=(R=0.0,G=1.0,B=0.0,A=1.0)
+LODColorationColors=(R=0.0,G=0.0,B=1.0,A=1.0)
+LODColorationColors=(R=1.0,G=1.0,B=0.0,A=1.0)
+LODColorationColors=(R=1.0,G=0.0,B=1.0,A=1.0)
+LODColorationColors=(R=0.0,G=1.0,B=1.0,A=1.0)
+LODColorationColors=(R=0.5,G=0.0,B=0.5,A=1.0)
```

+LODColorationColors=(R=1.0,G=1.0,B=1.0,A=1.0)
+LODColorationColors=(R=1.0,G=0.0,B=0.0,A=1.0)
+LODColorationColors=(R=0.0,G=1.0,B=0.0,A=1.0)
+LODColorationColors=(R=0.0,G=0.0,B=1.0,A=1.0)
+LODColorationColors=(R=1.0,G=1.0,B=0.0,A=1.0)
+LODColorationColors=(R=1.0,G=0.0,B=1.0,A=1.0)
+LODColorationColors=(R=0.0,G=1.0,B=1.0,A=1.0)
+LODColorationColors=(R=0.5,G=0.0,B=0.5,A=1.0)

By default the engine uses only four LODs, but this can be extended in the source code.

## HLOD Coloration

[image: Hierarchical LOD Coloration] Click image for full size.

- Console command: `viewmode hlodcoloration`

**HLOD Coloration** view mode displays the Hierarchial LOD Cluster index of a primitive.

| HLOD Primitive Coloration |  |  |  |  |  |
| --- | --- | --- | --- | --- | --- |
| **Color** | [image: LOD Coloration_3] | [image: LOD Coloration_4] | [image: LOD Coloration_7] | [image: LOD Coloration_6] | [image: LOD Coloration_8] |
| **HLOD Primitive Color** | **0** | **1** | **2** | **3** | **4** |

 C++

```
+HLODColorationColors=(R=1.0,G=1.0,B=1.0,A=1.0)  //white (not part of HLOD)
+HLODColorationColors=(R=0.0,G=1.0,B=0.0,A=1.0)  //green (part of HLOD but being drawn outside of it)
+HLODColorationColors=(R=0.0,G=0.0,B=1.0,A=1.0)  //blue (HLOD level 0)
+HLODColorationColors=(R=1.0,G=1.0,B=0.0,A=1.0)  //yellow (HLOD level 1)
+HLODColorationColors=(R=1.0,G=0.0,B=1.0,A=1.0)  //purple
+HLODColorationColors=(R=0.0,G=1.0,B=1.0,A=1.0)  //cyan
+HLODColorationColors=(R=0.5,G=0.5,B=0.5,A=1.0)  //grey
```

+HLODColorationColors=(R=1.0,G=1.0,B=1.0,A=1.0) //white (not part of HLOD)
+HLODColorationColors=(R=0.0,G=1.0,B=0.0,A=1.0) //green (part of HLOD but being drawn outside of it)
+HLODColorationColors=(R=0.0,G=0.0,B=1.0,A=1.0) //blue (HLOD level 0)
+HLODColorationColors=(R=1.0,G=1.0,B=0.0,A=1.0) //yellow (HLOD level 1)
+HLODColorationColors=(R=1.0,G=0.0,B=1.0,A=1.0) //purple
+HLODColorationColors=(R=0.0,G=1.0,B=1.0,A=1.0) //cyan
+HLODColorationColors=(R=0.5,G=0.5,B=0.5,A=1.0) //grey

## Buffer Visualization

[image: Buffer Visualization] Click image for full size.

The **Buffer Visualization** area offers you access to individual buffers within the graphics card, which can help you diagnose problems how your scenes look. In order to make the most out of the buffer visualization modes, it will help to understand the basics of Material Inputs (-> material-inputs-in-unreal-engine) and Material Properties (-> unreal-engine-material-properties).

### Buffer Overview

[image: Buffer Overview] Click image for full size.

The **Buffer Overview** visualization mode allows you to see multiple images from the graphics card's GBuffer. Many of these correlate to inputs on Materials, meaning you can see how the scene looks with just a single Material input being used.

### Base Color

[image: Base Color] Click image for full size.

- View Mode Hotkey: **None (Menu only by default)**

The **Base Color** mode allows you to see the only the Base Color of the Materials in your scene.

### Decal Mask

[image: Decal Mask] Click image for full size.

- View Mode Hotkey: **None (Menu only by default)**

The **Decal Mask** mode shows in white any surface which can receive deferred decals. Objects which cannot, appear in black.

### Diffuse Color

[image: Diffuse Color] Click image for full size.

- View Mode Hotkey: **None (Menu only by default)**

**Diffuse Color** shows the result of Base Color and the Material's Ambient Occlusion inputs.

### Shading Model

[image: Shading Model] Click image for full size.

- View Mode Hotkey: **None (Menu only by default)**

The **Shading Model** mode shows value of the Shading Model property for each Material in the scene.

| Light Complexity Coloration |  |  |  |  |
| --- | --- | --- | --- | --- |
| **Color** | [image: Light Model Lit] | [image: Light Model Unlit] | [image: Light Model Subsurface] | [image: Light Model Preintegratedskin] |
| **Material's Shading Model** | **Default Lit** | **Unlit** | **Subsurface** | **Preintegrated Skin** |

### Material AO

 [image: Scene in Lit Mode (Game View On)]

 [image: Scene in Buffer Material AO Mode (Game View On)]

- View Mode Hotkey: **None (Menu only by default)**

The **Material AO** visualization mode shows the result of any texturing or Material Expression nodes that are connected to the Material's Ambient Occlusion input.

### Metallic

[image: Metallic] Click image for full size.

- View Mode Hotkey: **None (Menu only by default)**

The **Metallic** visualization mode shows the result of any texturing or Material Expression nodes that are connected to the Material's Metallic input.

Note: Materials should generally have Metallic values of 0 or 1, not in between. Values between 0 and 1 will happen due to layer blending, but physical materials will always be a metal or not.

### Opacity

 [image: Scene in Lit Mode]

 [image: Scene in Buffer Material Opacity Mode (Game View On)]

- View Mode Hotkey: **None (Menu only by default)**

**Opacity** visualization mode shows the result of any texturing or Material Expression nodes that are connected to the Material's Opacity input. In the images above, you can see the outer shell of the character is somewhat transparent.

The Opacity viewmode only shows opaque materials with Opacity being used, which is important in the case of subsurface scattering materials, as the Opacity controls how far light can penetrate.

### Roughness

[image: Roughness] Click image for full size.

- View Mode Hotkey: **None (Menu only by default)**

**Roughness** visualization mode shows the result of any texturing or Material Expression nodes that are connected to the Material's Roughness input. Roughness variation is where a lot of reflection variation will come from.

### Scene Color

[image: Scene Color] Click image for full size.

- View Mode Hotkey: **None (Menu only by default)**

**Scene Color** shows the result of the scene before any post processing is done. This means before any exposure, bloom, color correction, or antialiasing. In the above image, the scene appears very dark because exposure has not brightened it up for us.

### Scene Depth

[image: Scene Depth] Click image for full size.

- View Mode Hotkey: **None (Menu only by default)**

**Scene Depth** shows the depth of the scene in a constant gradient from white (farthest away) to black (closest).

### Separate Translucency RGB

[image: Separate Translucency RGB] Click image for full size.

- View Mode Hotkey: **None (Menu only by default)**

**Separate Translucency RGB** shows the color information of any Materials that are Translucent and using Separate Translucency.

### Separate Translucency A

[image: Separate Translucency A] Click image for full size.

- View Mode Hotkey: **None (Menu only by default)**

**Separate Translucency A** shows only the alpha information of any Materials that are Translucent and using Separate Translucency.

### Specular Color

[image: Specular Color] Click image for full size.

- View Mode Hotkey: **None (Menu only by default)**

**Specular Color** shows the color being imparted to the specular reflections of a Material. Generally, this is inferred from a combination of the Base Color and Metallic values.

### Specular

[image: Specular] Click image for full size.

- View Mode Hotkey: **None (Menu only by default)**

**Specular** shows the results of any texturing or Material Expression nodes that are fed into a Material's Specular input.

### Subsurface Color

[image: Subsurface Color] Click image for full size.

- View Mode Hotkey: **None (Menu only by default)**

**Subsurface Color** shows the results of any texturing or Material Expression nodes that are fed into a Material's Subsurface Color input.

### World Normal

[image: World Normal] Click image for full size.

- View Mode Hotkey: **None (Menu only by default)**

**World Normal** shows the world space normal of any opaque surfaces.

### Ambient Occlusion

[image: Ambient Occlusion] Click image for full size.

- View Mode Hotkey: **None (Menu only by default)**

**Ambient Occlusion (AO)** shows the result of any ambient occlusion calculations that are taking place on the scene. This is separate from any AO textures applied to Materials, as this is a calculation the engine makes based on surfaces and normal maps.

## Landscape Visualizers

[image: Landscape Visualizers] Click image for full size.

### Normal

[image: Landscape Normal] Click image for full size.

The **Normal** Landscape visualization mode shows a Landscape in its normal, lit state.

### LOD

[image: Landscape LOD] Click image for full size.

The **LOD** Landscape visualization mode breaks a landscape up into color-coded panels which represent their current LOD state.

### Layer Density

[image: Layer Density] Click image for full size.

The **Layer Density** Landscape visualization mode shows the landscape in a color-coded mode which shifts from green to red as more layers are added to the Landscape.

## Exposure

[image: Exposure]

Exposure is a post-processing effect that controls the overall brightness of a scene. This can be set to a fixed value or left to automatic.

### Automatic vs. Fixed Exposure

When playing games with Exposure activated in your post processing, you will notice that moving from a light to a dark area or vice versa will cause the camera to temporarily adjust, similarly to how our eyes adjust when moving to different light environments. In most cases, this will be the desired result. However, if the constant shifting is distracting in your particular level, then you can set the view to a fixed exposure. This will lock the exposure in place so it no longer automatically changes as you move from light to dark or dark to light, but it also means that you can easily end up in a situation where the lights are overbright or overdark for the work you need to do.

- ui
- building virtual worlds

On this page

- Lit (-> viewport-modes-in-unreal-engine)
- Unlit (-> viewport-modes-in-unreal-engine)
- Wireframe (-> viewport-modes-in-unreal-engine)
- Detail Lighting (-> viewport-modes-in-unreal-engine)
- Lighting Only (-> viewport-modes-in-unreal-engine)
- Light Complexity (-> viewport-modes-in-unreal-engine)
- Shader Complexity (-> viewport-modes-in-unreal-engine)
- Stationary Light Overlap (-> viewport-modes-in-unreal-engine)
- Lightmap Density (-> viewport-modes-in-unreal-engine)
- Reflections (-> viewport-modes-in-unreal-engine)
- Player Collision (-> viewport-modes-in-unreal-engine)
- Visibility Collision (-> viewport-modes-in-unreal-engine)
- LOD Coloration (-> viewport-modes-in-unreal-engine)
- HLOD Coloration (-> viewport-modes-in-unreal-engine)
- Buffer Visualization (-> viewport-modes-in-unreal-engine)
- Buffer Overview (-> viewport-modes-in-unreal-engine)
- Base Color (-> viewport-modes-in-unreal-engine)
- Decal Mask (-> viewport-modes-in-unreal-engine)
- Diffuse Color (-> viewport-modes-in-unreal-engine)
- Shading Model (-> viewport-modes-in-unreal-engine)
- Material AO (-> viewport-modes-in-unreal-engine)
- Metallic (-> viewport-modes-in-unreal-engine)
- Opacity (-> viewport-modes-in-unreal-engine)
- Roughness (-> viewport-modes-in-unreal-engine)
- Scene Color (-> viewport-modes-in-unreal-engine)
- Scene Depth (-> viewport-modes-in-unreal-engine)
- Separate Translucency RGB (-> viewport-modes-in-unreal-engine)
- Separate Translucency A (-> viewport-modes-in-unreal-engine)
- Specular Color (-> viewport-modes-in-unreal-engine)
- Specular (-> viewport-modes-in-unreal-engine)
- Subsurface Color (-> viewport-modes-in-unreal-engine)
- World Normal (-> viewport-modes-in-unreal-engine)
- Ambient Occlusion (-> viewport-modes-in-unreal-engine)
- Landscape Visualizers (-> viewport-modes-in-unreal-engine)
- Normal (-> viewport-modes-in-unreal-engine)
- LOD (-> viewport-modes-in-unreal-engine)
- Layer Density (-> viewport-modes-in-unreal-engine)
- Exposure (-> viewport-modes-in-unreal-engine)
- Automatic vs. Fixed Exposure (-> viewport-modes-in-unreal-engine)

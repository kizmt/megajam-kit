# How the glTF Exporter Handles Unreal Engine Content

https://dev.epicgames.com/documentation/en-us/unreal-engine/how-the-gltf-exporter-handles-unreal-engine-content?application_version=5.9

> Special considerations for exporting Unreal Engine content to glTF

[image: How the glTF Exporter Handles Unreal Engine Content]

**glTF** is a data-driven format, and does not support everything in Unreal Engine. This page explains what kind of content you can export using glTF, and describes how the glTF exporter handles each type of content.

## Overview: What You Can Export

The glTF exporter can export several types of Asset from Unreal Engine. When you export an Asset that references other content, the exporter can export some of that content as well.

Assets that you can export directly include the following:

- Materials (-> how-the-gltf-exporter-handles-unreal-engine-content)

- Static Meshes (-> how-the-gltf-exporter-handles-unreal-engine-content)

- Skeletal Meshes (-> how-the-gltf-exporter-handles-unreal-engine-content)

- Animation Sequences (-> how-the-gltf-exporter-handles-unreal-engine-content)

- Level Sequences (-> how-the-gltf-exporter-handles-unreal-engine-content)

- Level Variant Sets (-> how-the-gltf-exporter-handles-unreal-engine-content)

- Levels (see Export the Current Level (-> exporting-unreal-engine-content-to-gltf))

Content that you can export indirectly, when a supported Asset references it, includes the following:

- Actors (-> how-the-gltf-exporter-handles-unreal-engine-content)

- Components (-> how-the-gltf-exporter-handles-unreal-engine-content)

- Textures (-> how-the-gltf-exporter-handles-unreal-engine-content)

## Materials

The glTF format uses a Metallic / Roughness physically-based rendering (PBR) workflow that can produce photorealistic materials. The glTF workflow is similar to Unreal Engine's workflow, but does not support arbitrary material expressions. Instead, it allows a single texture or constant for each material input.

In the glTF format, some inputs share the same texture (for example, **Metallic** / **Roughness** and **Base Color** / **Opacity (Mask)** ). To convert an Unreal Engine Material to glTF, the exporter uses the following methods, in the following order:

- Material expression matching (-> how-the-gltf-exporter-handles-unreal-engine-content): faster and more accurate, but supports only simple Material expression patterns.

- Material baking (-> how-the-gltf-exporter-handles-unreal-engine-content): supports most Material expression patterns, but is slower, and requires configuration.

When you export a Material, the exporter tries expression matching first. If expression matching fails, it falls back to material baking. This can happen frequently because most Unreal Engine Material inputs use more advanced expressions than expression matching supports.

You can configure the Material Bake settings to only use expression matching. For details, see Disable Material Baking.

### Material Expression Matching

Material expression matching examines each material input expression to determine whether it matches one of a limited range of expression node patterns. If it matches, the glTF exporter extracts the values from the material expression, and converts them.

Expression matching is quicker and more accurate than Material baking, but can only handle very simple and strict expression patterns. The exporter uses it whenever a Material expression satisfies the necessary conditions.

#### Examples of Supported Patterns for Material Expression Matching

- Constant and Vector Parameter nodes [image: Examples of Constant and Vector Parameter material nodes] Examples of Constant and Vector Parameter material nodes Constant and Vector Parameter patterns are not supported for Normal or Ambient Occlusion inputs because of limitations in glTF.

- Texture Sample and Texture Parameter nodes, with or without a Texture Coordinate node [image: Examples of Texture Sample and Texture Parameter material nodes] Examples of Texture Sample and Texture Parameter material nodes Expression matching does not support multiplying a Texture Sample node with a constant.

### Material Baking

Material baking renders a specific Material input's full expression into a 2D texture. It can handle most Material expressions, but is slower than expression matching, and requires that you configure some settings.

- You set the global default values from the glTF export options dialog, in the **Material** section. See Configure Global Default Material Bake Settings (-> how-the-gltf-exporter-handles-unreal-engine-content).

- You can override the global default settings with per-input default settings. See Configure Global Material Bake Settings for Specific Inputs (-> how-the-gltf-exporter-handles-unreal-engine-content).

- You can also create default Material bake settings for an individual Asset, and even a specific Material input on that Asset. See Configure Asset Specific Material Bake Options (-> how-the-gltf-exporter-handles-unreal-engine-content).

Material baking works best, and most accurately for Materials that do not depend on when or how they are viewed (for example, things such as time or viewing angle). When the glTF exporter bakes a material, it evaluates each input expression, pixel by pixel, at that moment. Dynamic nodes such as **Time**, **Camera Position**, and **Reflection Vector** become static. We recommend that you avoid view-dependent expressions when you export Materials.

#### How the glTF Exporter Applies Material Bake Settings

The glTF exporter uses the most specific setting it can find. For any given input on a given Material Asset, the exporter prioritizes settings in the following order.

- Settings for a specific input on a specific Material Asset.

- Default settings for a specific Material Asset.

- Global default settings for a specific type of Material input.

- Global default settings.

#### Configure Global Default Material Bake Settings

Configure the global default Material bake settings from the glTF export options dialog, in the **Material** section.

The global default settings are the ultimate fallback settings. If the exporter does not find a more specific setting for a given input on a given Material Asset, it uses the global default.

You can set the following options:

| Option | Description |
| --- | --- |
| **Bake Material Inputs** | Specifies whether to bake a Material into a texture, and if so, how to bake it. **Disabled**: Never use material baking and only rely on material expression matching. **Simple**: If a material input needs baking, then only use a simple plane as mesh data. **Use Mesh Data**: If a Material input uses mesh-specific data such as vertex color, world position, vector transform nodes and so on, this setting includes that data in the Material baking process, and the resulting texture. For materials that don't use mesh-specific data, the exporter uses a simple plane. The exporter only uses baking for complex material inputs. For simple texture or constant expressions, it uses Material expression matching. |
| **Default Material Bake Size** | When **Bake Material Inputs** is enabled, this setting specifies the default size of the baked texture that contains the Material input. You can override this default setting with Material-specific and input-specific bake settings. For more information, see the following sections: Configure Global Material Bake Settings for Specific Inputs (-> how-the-gltf-exporter-handles-unreal-engine-content). Configure Asset Specific Material Bake Options (-> how-the-gltf-exporter-handles-unreal-engine-content). |
| **Default Material Bake Filter** | When **Bake Material Inputs** is enabled, this setting specifies the default filtering mode used to sample the baked texture. You can override this default setting with Material-specific and input-specific bake settings. For more information, see the following sections: Configure Global Material Bake Settings for Specific Inputs (-> how-the-gltf-exporter-handles-unreal-engine-content). Configure Asset Specific Material Bake Options (-> how-the-gltf-exporter-handles-unreal-engine-content). |
| **Default Material Bake Tiling** | When Bake Material Inputs is enabled, this setting specifies the default addressing mode used to sample the baked texture. You can override this default setting with Material-specific and input-specific bake settings. For more information, see the following sections: Configure Global Material Bake Settings for Specific Inputs (-> how-the-gltf-exporter-handles-unreal-engine-content). Configure Asset Specific Material Bake Options (-> how-the-gltf-exporter-handles-unreal-engine-content). |

##### Choosing a Material Bake Mode

In general, we recommend **Use Mesh Data** mode for Material baking. **Use Mesh Data** mode exports unique, per-mesh glTF Materials, but only for Materials that rely on mesh-specific data. This includes Materials that use the following expressions or nodes:

- Vertex Color (-> constant-material-expressions-in-unreal-engine)

- VertexNormalWS (-> vector-material-expressions-in-unreal-engine)

- PixelNormalWS (-> vector-material-expressions-in-unreal-engine)

- Local Position

- World Position (-> coordinates-material-expressions-in-unreal-engine)

- Actor Position (-> coordinates-material-expressions-in-unreal-engine)

- Object Position (-> coordinates-material-expressions-in-unreal-engine)

- Object Orientation (-> coordinates-material-expressions-in-unreal-engine)

- Object Radius (-> coordinates-material-expressions-in-unreal-engine)

- Object Bounds (-> vector-material-expressions-in-unreal-engine)

- Object Local Bounds

- Pre-Skinned Local Bounds

- Transform (-> vector-operation-material-expressions-in-unreal-engine) and Transform Position (-> vector-operation-material-expressions-in-unreal-engine)

- Precomputed AO Mask (-> constant-material-expressions-in-unreal-engine)

- Lightmap UVs (-> coordinates-material-expressions-in-unreal-engine)

- Custom Primitive Data (-> storing-custom-data-in-unreal-engine-materials-per-primitive)

If a Material does not require mesh-specific data, the exporter falls back to **Simple** mode for that material.

**Simple** baking mode produces Materials that are not unique to specific meshes. It can use the full texture area, because the mesh data used to bake the Material is a quad. It is more suitable for tiled or repeating textures.

When you bake a Material using mesh-specific data, the glTF exporter assumes that the mesh has lightmap UVs that cover the entire mesh, and do not overlap, which is not always the case. If **Use Mesh Data** mode produces Materials that look different from what you expect, we recommend that you change the baking mode to **Simple**.

#### Configure Global Material Bake Settings for Specific Inputs

Global, per-input, default Material bake settings override the global default settings, and are overridden by per-Asset settings.

You set global default Material bake options for a specific input in the **glTF Export Options** dialog.

Do the following:

- In the **Material** section, locate the **Default Input Bake Settings** row, and click **Add Element (+)**. A new sub-option appears.

- From the drop-down list in the new sub-option row, select a Material input.

- Expand the sub-option to display the **Size**, **Filter**, and **Tiling** Material bake settings for the selected input. You can toggle each setting on and off, and set it as needed.

Repeat the process for each Material input that you want to create global default settings for.

#### Configure Asset Specific Material Bake Options

You can set Material bake options for individual Assets. A Material Asset can have default material bake options, and input specific Material bake options.

- The Asset's default settings override both per-input global default settings, and overall global default settings.

- Input-specific settings for an Asset override all other Material Bake settings.

Asset specific settings are inherited by the Asset's children. If a Material Asset has its own bake settings, any Material instance that is a child of the Asset (directly or indirectly) inherits those settings. If the Instance has its own settings, they override the Asset's settings.

To configure Material bake settings for a Material Asset, you add **GLTF Material Export Options** to its **Asset User Data** array.

##### Step 1: Add glTF Material Export Options for the Asset

- In the **Content Browser**, select the Asset.

- In the **Details** panel, expand the **Asset User Data** section.

- Locate the **Asset User Data** row, and click **Add Element (+)**. A new **Index** row appears.

- From the dropdown list in the new Index row, select **GLTF Material Export Options**.

- Do one or both of the following: Set default Material bake options for the Asset.

- Set Material bake options for specific inputs on the Material Asset.

##### Step 2a: Set default Material bake options for the Asset

- Expand the **Index > Override bake Settings > Default** section to display the **Size**, **Filter**, and **Tiling** Material bake settings for the Asset. You can toggle each setting on and off, and set it as needed.

##### Step 2b: Set Material bake options for specific inputs

- Expand the **Index > Override bake Settings** section.

- Locate the **Inputs** row, and click **Add Element (+)**. A new sub-option appears.

- From the drop-down list in the new sub-option row, select a Material input.

- Expand the sub-option to display the **Size**, **Filter**, and **Tiling** Material bake settings for the selected input. You can toggle each setting on and off, and set it as needed.

Repeat the process for each Material input that you want to create settings for.

#### Disable Material Baking

You can disable Material baking completely, and force the glTF exporter to use Material expression matching.

In the glTF Export options dialog, go to the Materials section, and set **Bake Material Inputs** to **Disabled**.

When you disable Material baking, the exporter skips any Material input it can't export properly, and logs a warning in the output log. Skipped inputs get the default values specified in the glTF spec.

### Shading Model Support

The glTF format supports the following Unreal Engine shading models:

- Default Lit (-> shading-models-in-unreal-engine)

- Clear Coat (-> shading-models-in-unreal-engine)

- Unlit (-> shading-models-in-unreal-engine)

It treats unsupported shading models as Default Lit.

If the material expression graph specifies the shading model, the exporter tries to evaluate it using static analysis. The static analyzer can only handle certain types of expressions. For example, the expression shown in this image:

 [image: Example of Shading Model Expression that the static analyzer can evaluate]

Example of Shading Model Expression that the static analyzer can evaluate

The static analyzer might not be able to resolve more complicated expressions that use non-static variables. If the analyzer cannot resolve the evaluation to a single static shading model, the exporter chooses whichever of the remaining models supports the most rich and complex shading.

In order of priority it will choose:

- Clear Coat

- Default Lit

- Unlit

If the static analyzer has already eliminated one of those models, the exporter chooses the model with the next highest priority.

 [image: Example of Shading Model Expression that the static analyzer cannot evaluate]

Example of Shading Model Expression that the static analyzer can evaluate

#### Default Lit

Unreal Engine's **Default Lit** shading model has almost exactly the same material inputs as the default glTF shading model. For a list of Default Lit material inputs, see Shading Models (-> shading-models-in-unreal-engine).

There are some important differences between the Unreal Engine model and the glTF model. In the default glTF shading model:

- Some inputs share texture slots (see Shared Texture Slots (-> how-the-gltf-exporter-handles-unreal-engine-content)).

- Some inputs can only accept textures (see Texture-Only Inputs (-> how-the-gltf-exporter-handles-unreal-engine-content)).

- The glTF Metallic / Roughness PBR workflow does not support **Specular**.

##### Shared Texture Slots

In the default glTF shading model some inputs are paired, and share texture slots.

- **Base Color** shares a slot with **Opacity (Mask)**

- **Metallic** shares a slot with **Roughness**

Paired inputs use the same texture, which means they always have the same texture resolution and coordinates. However, each input is represented by a different color channel. For example, in the Metallic / Roughness pair, the Metallic input uses the blue channel and the Roughness input uses the green channel.

##### Texture-Only Inputs

In the default glTF shading model the following inputs can only accept textures:

- **Normal**

- **Ambient Occlusion**

Unlike other inputs, these cannot have a constant non-default value, unless you use 1x1 pixel texture to simulate a constant. If the exporter finds a constant value for either input, it does the following:

- For **Ambient Occlusion**, the exporter automatically generates a 1x1 pixel texture to simulate the constant value.

- For **Normal**, the exporter discards the constant, and assumes that the normal vector is meant to be aligned with the surface.

#### Clear Coat

Unreal Engine's Clear Coat shading model extends the Default Lit model.

- **Clear Coat (intensity)**

- **Clear Coat Roughness**

- **Clear Coat Bottom Normal**

The **Clear Coat Bottom Normal** input is not a regular material input pin. It is a separate custom output node. To use it, you must enable the **Materials > Clear Coat Enable Second Normal** option in your Unreal Engine project settings.

To support the Clear Coat shading model, the glTF exporter uses the KHR_materials_clearcoat extension. You can toggle Clear Coat shading on and off in the glTF export options (-> exporting-unreal-engine-content-to-gltf) dialog. Use the **Material > Export Clear Coat materials** option.

There are some important differences between the way Unreal Engine and glTF support the Clear Coat shading model.

- Some inputs share texture slots (see Shared Texture Slots (-> how-the-gltf-exporter-handles-unreal-engine-content)).

- Some inputs can only accept textures (see Texture-Only Inputs (-> how-the-gltf-exporter-handles-unreal-engine-content)).

##### Shared Texture Slots

In the glTF Clear Coat shading model, the **Clear Coat** and **Clear Coat Roughness** inputs are paired. Paired inputs use the same texture, which means they always have the same texture resolution and coordinates. However each input is represented by a different color channel. The **Clear Coat** input uses the red channel and the **Clear Coat Roughness** input uses the green channel.

##### Texture-Only Inputs

In the glTF Clear Coat shading model, the **Clear Coat Bottom Normal** input can only accept textures. Unlike other inputs, it cannot have a constant non-default value, unless you use 1x1 pixel texture to simulate a constant.

#### Unlit

Unreal Engine's Unlit shading model is a standalone model with two material inputs:

- **Emissive Color**

- **Opacity / Opacity Mask** (depending on blend mode)

In the glTF Unlit shading model, these two inputs are paired. Paired inputs use the same texture, which means they always have the same texture resolution and coordinates. However each input is represented by a different color channel. The **Emissive Color** input uses the blue channel and the **Opacity / Opacity Mask** input uses the green channel.

To support the Unlit shading model, the glTF exporter uses the KHR_materials_unlit extension, which you can toggle on and off in the glTF export options (-> exporting-unreal-engine-content-to-gltf) dialog. Use the **Material > Export Unlit materials** option.

### Blend Mode Support

The glTF exporter supports the following Material blend modes:

- Opaque (-> material-blend-modes-in-unreal-engine)

- Masked (-> material-blend-modes-in-unreal-engine)

- Translucent (-> material-blend-modes-in-unreal-engine)

## Static Meshes

glTF provides good support for Static Meshes, but there are a few caveats. This section describes special considerations for exporting Static Meshes from Unreal Engine to glTF.

#### Vertex Colors

In glTF, vertex colors always act as a multiplier for the base color, regardless of material. This can produce undesirable results. In most cases, we recommend that you set the glTF export options as follows:

- In the **Mesh** (-> exporting-unreal-engine-content-to-gltf) section, disable **Export Vertex Colors**.

- In the **Material** (-> exporting-unreal-engine-content-to-gltf) section, set **Bake Material Inputs** to **Use Mesh Data**.

#### UVs

- glTF does not support half-precision (16-bit) UVs. We recommend that you use full precision (32-bit) UVs for Static Mesh Assets. Edit the Asset, and In the Details panel, enable the **LOD[NUMBER] > Build Settings > Use Full Precision UVs** option. *The glTF exporter exports all of a Static Mesh's UV channels. However, most glTF applications, including Unreal's glTF viewer, only support two UV texture coordinate channels. If you plan to export to glTF, make sure that your Materials only use texture coordinates in the first two UV channels.

#### Collision Geometry

The glTF file format does not support collision Geometry. The glTF exporter ignores it.

#### Level of Detail (LOD)

glTF does not support multiple levels of detail. The exporter uses a single LOD to export a Static Mesh. It uses the following rules to decide which LOD to export.

| Setting | Location | Scope | Priority |
| --- | --- | --- | --- |
| **Default Level Of Detail** | glTF export options (-> exporting-unreal-engine-content-to-gltf) dialog, in the **Mesh** section. | Global | Lowest. This is the global fallback. If no other settings override it, the glTF exporter uses the LOD specified here. |
| **Minimum LOD** | Static Mesh Asset properties, in the **LOD Settings** section. To access, open a Static Mesh Asset in the Static Mesh Editor (-> static-mesh-editor-ui-in-unreal-engine), and find the setting in the **Details** panel. | Per Static Mesh Asset | If this LOD is configured for a Static Mesh Asset, and it is set to higher LOD level than the **Default Level of Detail** setting, then the glTF exporter uses this LOD to export the Static Mesh. |
| **Override Min LOD** | Static Mesh Actor properties or Static Mesh Component properties, in the LOD section. To access, select a Static Mesh Actor, and find the setting for the Actor or a Component in the **Details** panel. | Per Mesh Component or Actor | If this option is enabled for a Static Mesh Actor or a Component, the **Min LOD** setting overrides the Asset- level **Minimum LOD** setting. |
| **Forced Lod Model** | Static Mesh Actor properties or Static Mesh Component properties, in the **LOD** section. To access, select a Static Mesh Actor, and find the setting for the Actor or a Component in the **Details** panel. | Per Mesh Component or Actor | If you configure this LOD for a Static Mesh Actor or a Component, it overrides all other LOD settings, and the glTF exporter uses it to export the Actor. |

#### Mesh Quantization for High Quality Lighting and Reflections

Quantization is the process of transforming vector attributes that are normally stored at floating point precision so they can be stored at 8-bit or 16-bit precision instead. Quantizing saves disk space and memory.

The following vertex attributes are quantized in Unreal Engine and glTF:

- Vertex colors (8-bit per component).

- Vertex normals (8-bit or 16-bit per component).

- Vertex tangents (8-bit or 16-bit per component).

If you need high-quality reflections and lighting, we recommend that you enable the **Use High Precision Tangent Basis** option for Static Mesh Assets. When this option is enabled, Unreal Engine stores quantized vertex normals and vertex tangents at 16-bit precision rather than 8-bit precision.

You can find the **Use High Precision Tangent Basis** option in each Static Mesh Asset's properties.

- Open a Static Mesh Asset in the Static Mesh Editor (-> static-mesh-editor-ui-in-unreal-engine).

- In the **Details** panel, look for the option in the **LOD [LEVEL] > Build Settings** section, where [LEVEL] is the LOD level you plan to export using the glTF exporter.

To quantize vertex normals and vertex tangents, the glTF exporter uses the KHR_mesh_quantization extension, which you can toggle on and off in the glTF Export Options dialog. In the Mesh (-> exporting-unreal-engine-content-to-gltf) section, enable or disable the **Use Mesh Quantization** option.

## Skeletal Meshes

The same export considerations that apply to Static Meshes (see Static Meshes (-> how-the-gltf-exporter-handles-unreal-engine-content) also apply to Skeletal Meshes. The glTF exporter also has some additional limitations for Skeletal Meshes.

glTF does not support the following:

- Mesh clothing Assets.

- Morph target animations.

## Animation Sequences

Unreal animation sequences are fully supported in glTF, as long as you also export vertex skin weights. The glTF exporter also accounts for Unreal Engine animation retargeting.

The **Export Vertex Skin Weights** option is in the **glTF Export Options** dialog, in the **Mesh** section. For details, see the glTF Export Options Reference (-> exporting-unreal-engine-content-to-gltf).

## Level Sequences

For the glTF exporter to include a Level Sequence Asset in a scene export, the Asset needs to be assigned to a Level Sequence Actor in the scene.

Support for Level Sequences is limited to transform tracks in absolute space. The glTF exporter does not support blending of multiple tracks.

The glTF exporter exports each Level Sequence at its selected Sequence Display Rate: the frames per second (FPS) setting in the Level Sequence Asset.

## Level Variant Sets

In Unreal Engine, you can use Variant Sets to configure almost any property in a scene. To include a Level Variant in a glTF scene export, the Asset needs to be assigned to a Level Variant Sets Actor in the scene.

To export Level Variant Sets, the glTF exporter uses the Khronos, extension KHR_materials_variants. This extension works with several glTF viewers, but has the following limitations:

- It only supports Material variants.

- It supports only one active variant at a time

- It bundles all variants into the same set.

This is different from Unreal Engine, where you can have multiple variants from different sets active at the same time.

If you plan to export to glTF, you can use Material Variants to change Any Material asset on a Static Mesh or Skeletal Mesh Component. The exporter does not support other Variant types.

## Actors

The glTF exporter supports some types of Actors in a Level, and can export specific properties for each type. For details, see the following sections:

- Level Sequence Actors (-> how-the-gltf-exporter-handles-unreal-engine-content)

- Level Variant Sets Actors (-> how-the-gltf-exporter-handles-unreal-engine-content)

The exporter also supports some types of Components, and can export actors that are not one of the supported types, but have one or more supported Components assigned to them. If an Actor has a supported Component assigned to it, the exporter exports specific properties of the Component. For more information, see Components.

### Level Sequence Actors

The Level Sequence Actor is an engine actor that plays Level sequences in the scene. The glTF exporter supports the following Level Sequence Actor properties:

| Property | Description |
| --- | --- |
| **Level Sequence** | Auto-play the sequence when created. |

### Level Variant Sets Actors

The Level Variant Sets Actor queries and activates variants in Level Variant Sets at runtime. It is provided by the Variant Manager plugin, which is distributed with Unreal Engine.

The **Level Variant Sets** property is the only Level Variant Sets Actor property that the glTF exporter supports.

The glTF exporter uses the KHR_materials_variantsextension to export Level Variant Sets. You can toggle Level Variant Set export on and off in the glTF export options (-> exporting-unreal-engine-content-to-gltf).

## Components

If an exported Actor has a supported Component assigned to it, the glTF exporter exports specific properties of the Component. The following sections provide information about which properties it exports for each supported Component type.

**Primitives:**

- Scene Component (-> how-the-gltf-exporter-handles-unreal-engine-content)

- Static Mesh Component (-> how-the-gltf-exporter-handles-unreal-engine-content)

- Skeletal Mesh Component (-> how-the-gltf-exporter-handles-unreal-engine-content)

**Cameras:**

- Camera Component (-> how-the-gltf-exporter-handles-unreal-engine-content)

**Lights:**

- Directional Light (-> how-the-gltf-exporter-handles-unreal-engine-content)

- Point Light (-> how-the-gltf-exporter-handles-unreal-engine-content)

- Spot Light (-> how-the-gltf-exporter-handles-unreal-engine-content)

### Scene Component

The glTF exporter supports the following Scene Component properties:

Transformation properties: **Location**, **Rotation**, and **Scale**.

Due to differences in how Unreal Engine applies scale, non-uniform scale may be represented differently in glTF.

### Static Mesh Component

The glTF exporter supports the following properties that the Static Mesh Component inherits from the Scene component:

Transformation properties: **Location**, **Rotation**, and **Scale**.

Due to differences in how Unreal Engine applies scale, non-uniform scale may be represented differently in glTF.

It also supports the following Static Mesh properties.

| Property | Description |
| --- | --- |
| **Static Mesh** | The Static Mesh used by this component. |
| **Materials** | The Materials used by this component. |

When it exports a Static Mesh, the glTF exporter uses the following settings:

- The level of detail that you configure in the component's LOD settings, using the **Forced Lod Model**, **Min LOD**, and **Override Min LOD** options.

- The Asset's **Minimum LOD** setting.

- The **Default Level Of Detail** specified in the glTF export options.

For details see Level of Detail (LOD) (-> how-the-gltf-exporter-handles-unreal-engine-content).

### Skeletal Mesh Component

The glTF exporter supports the following properties that the Skeletal Mesh Component inherits from the Scene component.

Transformation properties: **Location**, **Rotation**, and **Scale**.

Due to differences in how Unreal Engine applies scale, non-uniform scale may be represented differently in glTF.

It also supports the following Skeletal Mesh properties.

| Property | Description |
| --- | --- |
| **Skeletal Mesh** | The Skeletal Mesh used by this component. |
| **Materials** | The Materials used by this component. |
| **Anim to Play** | The sequence to play on this skeletal mesh. |

When it exports a Skeletal Mesh, the glTF exporter uses the following settings:

The level of detail that you configure in the component's LOD settings, using the **Forced Lod Model**, **Min LOD**, and **Override Min LOD** options.

- The Asset's **Minimum LOD** setting.

- The **Default Level Of Detail** specified in the glTF export options.

For details see Level of Detail (LOD) (-> how-the-gltf-exporter-handles-unreal-engine-content).

### Camera Component

The glTF exporter supports the following properties the Camera Component inherits from the Scene component:

Transformation properties: **Location**, **Rotation**, and **Scale**.

Due to differences in how Unreal Engine applies scale, non-uniform scale may be represented differently in glTF.

It also supports the following camera properties:

| Property | Description |
| --- | --- |
| **Projection Mode** | Specifies the type of camera. Choose Perspective or Orthographic. |
| **Field Of View** | The horizontal field of view (in degrees) in perspective mode (ignored in Orthographic mode). |
| **Ortho Width** | The desired width (in world units) of the orthographic view (ignored in Perspective mode). |
| **Ortho Near Clip Plane** | The near plane distance of the orthographic view (in world units). |
| **Ortho Far Clip Plane** | The far plane distance of the orthographic view (in world units). |
| **Aspect Ratio** | The ratio of width to height. |
| **Constrain Aspect Ratio** | If enabled, black bars will be added if the destination view has a different aspect ratio than this camera requested. |

### Directional Light Component

The glTF exporter uses the KHR_lights_punctual extension to export directional lights. It supports the following properties that the Directional Light Component inherits from the Scene component.

Transformation properties: **Location**, **Rotation**, and **Scale**.

Due to differences in how Unreal Engine applies scale, non-uniform scale may be represented differently in glTF.

It also supports the following directional light properties:

| Property | Description |
| --- | --- |
| **Intensity** | Total energy that the light emits. |
| **Light Color** | Filter color of the light. |
| **Temperature** | Color temperature in Kelvin of the blackbody illuminant. |
| **Use Temperature** | If disabled, use white (D65) as the illuminant. |

You can toggle directional lights on and off in the glTF Export Options dialog, in the **Scene** section. For details, see the glTF Export Options Reference (-> exporting-unreal-engine-content-to-gltf).

### Point Light Component

The glTF exporter uses the KHR_lights_punctual extension to export point lights. It supports the following properties that the Point Light Component inherits from the Scene component:

Transformation properties: **Location**, **Rotation**, and **Scale**.

Due to differences in how Unreal Engine applies scale, non-uniform scale may be represented differently in glTF.

It also supports the following point light properties:

| Property | Description |
| --- | --- |
| **Intensity** | Total energy that the light emits. |
| **Light Color** | Filter color of the light. |
| **Temperature** | Color temperature in Kelvin of the blackbody illuminant. |
| **Use Temperature** | If disabled, use white (D65) as illuminant. |
| **Attenuation Radius** | Bounds the light's visible influence. |

You can toggle point lights on and off in the glTF Export Options dialog, in the **Scene** section. For details, see the glTF Export Options Reference (-> exporting-unreal-engine-content-to-gltf).

### Spot Light Component

The glTF exporter uses the KHR_lights_punctual extension to export spotlights. It supports the following properties that the Spotlight Component inherits from the Scene Component.

Transformation properties: **Location**, **Rotation**, and **Scale**.

Due to differences in how Unreal Engine applies scale, non-uniform scale may be represented differently in glTF.

It also supports the following spotlight properties:

| Property | Description |
| --- | --- |
| **Intensity** | Total energy that the light emits. |
| **Light Color** | Filter color of the light. |
| **Temperature** | Color temperature in Kelvin of the blackbody illuminant. |
| **Use Temperature** | If disabled, use white (D65) as illuminant. |
| **Attenuation Radius** | Bounds the light's visible influence. |
| **Inner Cone Angle** | Angle, in degrees,from the center of the spotlight, where falloff begins. |
| **Outer Cone Angle** | Angle, in degrees, from the center of the spotlight, where falloff ends. |

You can toggle spotlights on and off in the glTF Export Options dialog, in the **Scene** section. For details, see the glTF Export Options Reference (-> exporting-unreal-engine-content-to-gltf).

## Textures

The glTF uses the EPIC_lightmap_textures extension to export textures. It supports following texture types:

- Texture 2D

- Texture Cube

- Light Map Texture 2D

You can configure how the exporter exports textures from the glTF Export Options dialog. Use the options in the **Texture** section. For details, see the glTF Export Options Reference (-> exporting-unreal-engine-content-to-gltf).

To support texture settings such as color adjustments, the exporter uses the render data (platform data) that Unreal Engine stores internally, rather than the source data.

The advantage to this approach is textures you export look the same as they do when they're rendered in the Unreal Editor or in-game.

The disadvantage is that if Unreal Engine's compression settings introduce any artifacts into the textures, they appear in the exported textures. To minimize artifacts, use the User Interface 2D and HDR compression settings whenever possible.

- gltf
- gl transmission format
- import / export

On this page

- Overview: What You Can Export (-> how-the-gltf-exporter-handles-unreal-engine-content)
- Materials (-> how-the-gltf-exporter-handles-unreal-engine-content)
- Material Expression Matching (-> how-the-gltf-exporter-handles-unreal-engine-content)
- Examples of Supported Patterns for Material Expression Matching (-> how-the-gltf-exporter-handles-unreal-engine-content)
- Material Baking (-> how-the-gltf-exporter-handles-unreal-engine-content)
- How the glTF Exporter Applies Material Bake Settings (-> how-the-gltf-exporter-handles-unreal-engine-content)
- Configure Global Default Material Bake Settings (-> how-the-gltf-exporter-handles-unreal-engine-content)
- Choosing a Material Bake Mode (-> how-the-gltf-exporter-handles-unreal-engine-content)
- Configure Global Material Bake Settings for Specific Inputs (-> how-the-gltf-exporter-handles-unreal-engine-content)
- Configure Asset Specific Material Bake Options (-> how-the-gltf-exporter-handles-unreal-engine-content)
- Step 1: Add glTF Material Export Options for the Asset (-> how-the-gltf-exporter-handles-unreal-engine-content)
- Step 2a: Set default Material bake options for the Asset (-> how-the-gltf-exporter-handles-unreal-engine-content)
- Step 2b: Set Material bake options for specific inputs (-> how-the-gltf-exporter-handles-unreal-engine-content)
- Disable Material Baking (-> how-the-gltf-exporter-handles-unreal-engine-content)
- Shading Model Support (-> how-the-gltf-exporter-handles-unreal-engine-content)
- Default Lit (-> how-the-gltf-exporter-handles-unreal-engine-content)
- Shared Texture Slots (-> how-the-gltf-exporter-handles-unreal-engine-content)
- Texture-Only Inputs (-> how-the-gltf-exporter-handles-unreal-engine-content)
- Clear Coat (-> how-the-gltf-exporter-handles-unreal-engine-content)
- Shared Texture Slots (-> how-the-gltf-exporter-handles-unreal-engine-content)
- Texture-Only Inputs (-> how-the-gltf-exporter-handles-unreal-engine-content)
- Unlit (-> how-the-gltf-exporter-handles-unreal-engine-content)
- Blend Mode Support (-> how-the-gltf-exporter-handles-unreal-engine-content)
- Static Meshes (-> how-the-gltf-exporter-handles-unreal-engine-content)
- Vertex Colors (-> how-the-gltf-exporter-handles-unreal-engine-content)
- UVs (-> how-the-gltf-exporter-handles-unreal-engine-content)
- Collision Geometry (-> how-the-gltf-exporter-handles-unreal-engine-content)
- Level of Detail (LOD) (-> how-the-gltf-exporter-handles-unreal-engine-content)
- Mesh Quantization for High Quality Lighting and Reflections (-> how-the-gltf-exporter-handles-unreal-engine-content)
- Skeletal Meshes (-> how-the-gltf-exporter-handles-unreal-engine-content)
- Animation Sequences (-> how-the-gltf-exporter-handles-unreal-engine-content)
- Level Sequences (-> how-the-gltf-exporter-handles-unreal-engine-content)
- Level Variant Sets (-> how-the-gltf-exporter-handles-unreal-engine-content)
- Actors (-> how-the-gltf-exporter-handles-unreal-engine-content)
- Level Sequence Actors (-> how-the-gltf-exporter-handles-unreal-engine-content)
- Level Variant Sets Actors (-> how-the-gltf-exporter-handles-unreal-engine-content)
- Components (-> how-the-gltf-exporter-handles-unreal-engine-content)
- Scene Component (-> how-the-gltf-exporter-handles-unreal-engine-content)
- Static Mesh Component (-> how-the-gltf-exporter-handles-unreal-engine-content)
- Skeletal Mesh Component (-> how-the-gltf-exporter-handles-unreal-engine-content)
- Camera Component (-> how-the-gltf-exporter-handles-unreal-engine-content)
- Directional Light Component (-> how-the-gltf-exporter-handles-unreal-engine-content)
- Point Light Component (-> how-the-gltf-exporter-handles-unreal-engine-content)
- Spot Light Component (-> how-the-gltf-exporter-handles-unreal-engine-content)
- Textures (-> how-the-gltf-exporter-handles-unreal-engine-content)

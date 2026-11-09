# Landscape Overview

https://dev.epicgames.com/documentation/en-us/unreal-engine/landscape-overview?application_version=5.9

> An overview of the Landscape Outdoor Terrain System and how to use it in your projects.

[image: Landscape Overview]

Using the **Landscape** system, you can create terrain for your world. Mountains, valleys, uneven or sloped ground, and even openings for caves are possible. Using the collection of tools in the Landscape system, you can modify your terrain's shape and appearance.

For information about opening and using the Landscape tool, refer to the Landscape Quick Start Guide.

## Landscape Tool Modes

[image: Landscape Tool Modes]

The Landscape tool has three modes, accessible by their buttons at the top of the Landscape tool's window.

[image: Landscape-modes-in-landscape-tab]

| Icon | Mode | Description |
| --- | --- | --- |
| [image: Manage mode] | **Manage mode** | Create new Landscapes, and modify Landscape components. Manage mode is also where you work with Landscape Copy Tool (-> landscape-copy-tool-in-unreal-engine) to copy, paste, import, and export parts of your Landscape. For more information about Manage mode, refer to Landscape Manage Mode (-> landscape-manage-mode-in-unreal-engine). |
| [image: Sculpt mode] | **Sculpt mode** | Modify the shape of your Landscape by selecting and using specific tools. For more information about Sculpt mode, refer to Landscape Sculpt Mode (-> landscape-sculpt-mode-in-unreal-engine). |
| [image: Paint mode] | **Paint mode** | Modify the appearance of parts of your Landscape by painting textures on it, based on the layers defined in the Landscape's Material. For more information about Paint mode, refer to Landscape Paint Mode (-> landscape-paint-mode-in-unreal-engine). |

Creating a Landscape means creating a Landscape Actor. As with other Actors, you can edit many of its properties, including its assigned Material, in the Level Editor's **Details** panel. For more information about **Details** panels, refer to Level Editor Details Panel (-> level-editor-details-panel-in-unreal-engine).

## Landscape Features

Below are the main features and techniques employed by the Landscape terrain system.

### Large Terrain Sizes

The Landscape system paves the way for terrains that are orders of magnitude larger than what has been possible in Unreal Engine previously. Because of its powerful Level of Detail (LOD) system and the way it makes efficient use of memory, heightmaps up to 8192x8192 are now legitimately possible and feasible. Unreal Engine now supports expansive outdoor worlds, which means quick game creation without modifying the stock engine or tools.

[image: Landscape Terrain Size] City Sample Landscape. Click image to expand.

### World Partition

Landscape integrates natively with World Partition (-> world-partition-in-unreal-engine) to subdivide a landscape into separately streamable parts. The landscape is edited as a single unified object, which is internally subdivided into separate Actors (called **Landscape Proxies**). The Proxies can be dynamically loaded and unloaded in the editor and by the client runtime.

This allows overall landscape sizes that would be too slow to usefully render or edit all at once. It also enables multiple users to edit different areas of the landscape at the same time without file contention conflicts.

### Landscape Memory Usage

Landscapes are generally a better choice for creating large terrains than **Static Meshes**.

Landscapes use 4 bytes per vertex for the vertex data. Static Meshes store position as a 12-byte vector, and tangent X and Z vectors packed into 4 bytes each, and either 16-bit or 32-bit float UVs for a total of either 24 or 28 bytes per vertex.

This means Static Meshes use 6 or 7 times the memory Landscapes use for the same vertex density. Landscapes also store their data as **Textures** and can stream out unused LOD levels for distant areas and load them from disk in the background as you approach them. Landscapes use a regular heightfield that efficiently stores collision data compared to the collision data for Static Meshes.

### Static Render Data Stored as Textures in GPU Memory

On most platforms, the Landscape system stores the render data for the terrain in Textures in GPU memory. This storage can be used for data look-up in the vertex shader. The render data uses a 32-bit Texture for storage, with the height occupying 16-bits in the form of the R and G channels and the normal stored as 28-bit values for X and Y, occupying the B and A channels, respectively.

### Continuous Geo-MipMap LOD

Standard Texture mipmaps handle LODs for Landscape terrains. Each mipmap is a level of detail, and the mipmap to sample can be specified using the `text2Dlod` HLSL instruction. Your Landscape can have a large number of LODs, yet maintain smooth LOD transitions, because mip levels for both LODs involved in a transition can be sampled, and then the heights and X and Y offsets can be interpolated in the vertex shader creating a clean morphing effect.

|  |  |  |
| --- | --- | --- |
| [image: Landscape LOD1] | [image: Landscape LOD1 to LOD2] | [image: Landscape LOD2] |
| **Fully LOD 1** | **Morphing from LOD 1 to LOD 2** | **Fully LOD 2** |

### Heightmap and Weight Data Streaming

With Textures storing data, the standard Texture streaming system in Unreal Engine handles streaming mipmaps in and out as needed. This applies to the heightmap data and the weights for Texture layers. Only requiring the mipmaps needed for each LOD minimizes the amount of memory used at any time, which means you can create a more extensive terrain.

### High Resolution LOD-Independent Lighting

The entire high-resolution (non-LOD'd) normal data is available for lighting calculations due to the storage of the X and Y slopes of the Landscape.

|  |  |
| --- | --- |
| [image: Landscape LODs] | [image: Landscape Full Resolution Normals] |
| **Landscape LODs** | **Full Resolution Normals** |

This means you can always use the highest resolution of the terrain for per-pixel lighting, even on distant components that have been LOD'd out.

|  |  |
| --- | --- |
| [image: Landscape Simple Vertex Lighting] | [image: Landscape High Res Per-Pixel] |
| **Simple Vertex Lighting** | **High Res Per-Pixel Lighting** |

When this high-resolution normal data combines with detailed normal maps, Landscape terrains can achieve highly detailed lighting with very little overhead.

|  |  |
| --- | --- |
| [image: Landscape Geometry Normals] | [image: Landscape Detail Normals] |
| **Geometry Normals Only** | **With Detail Normals** |

### Collision

Landscape uses a heightfield object for its collision. Each target layer can specify a Physical Material (-> physical-materials-in-unreal-engine). The collision system will use the dominant layer at each position to determine which Physical Material to use. It is possible to use a reduced resolution collision heightfield (for example, 0.5x render resolution) to save on memory requirements for large Landscape terrains. The collision and render components for distant Landscapes can also be streamed out using the level streaming system.

## Landscape Project Settings

[image: Landscape Project Settings] Landscape Project Settings. Click to expand.

| Option | Description |
| --- | --- |
| **Max Number of Layers** | Defines the maximum number of edit layers that can be added to the landscape. |
| **Show Dialog for Automatic Layer Creation** | When true, automatic edit layer creation pops up a dialog where the new layer can be reordered relative to other layers. |
| **Show Update Edit Layers During Interactive Changes** | For landscape layers-affecting changes, allows the landscape to be updated when performing an interactive change (e.g. when changing an edit layer’s alpha). Set to false if the performance when editing gets too bad (the landscape will be properly updated when the dragging operation is done). |
| **Max Components** | Defines the maximum number of components in a Landscape. |
| **Max Image Import Cache Size Mega Bytes** | Defines the maximum size of the import image cache in MB. |
| **Paint Strength Gamma** | Defines the exponent used for adjusting the strength of the **Paint** tool. |
| **Disable Painting Startup Slowdown** | (Will be decomm'ed in 5.8) Enabling this feature creates a reduced brush strength at the beginning of a brush stroke. You need to hover in one place until the brush output is at the desired strength. |
| **Landscape Dirtying Mode** | Defines when the engine requires the Landscape to be resaved:**In Landscape Mode and User Triggered Change****s**: Landscapes that are marked as needing to be resaved will not appear in the **Choose file****s** to save dialog. However, any user-triggered changes (direct or indirect) will require the Landscape to be resaved. This mode is recommended for team collaboration as it provides the best features of the other two modes while ensuring that modified landscape actors are still saved and properly submitted to source control. Default mode.**In Landscape Mode Only**: Landscapes that are marked as needing to be resaved will not appear in the **Choose files to save** dialog. This is a manual saving mode that puts the responsibility on the user to avoid file contention with other team members. The viewport will display an error message indicating that landscape actors are not up-to-date and need to be resaved. This is done using **Build > Save Modified Landscapes**.**Auto**: Landscapes that are marked as needing to be resaved will appear in the **Choose files to save** dialog. Changes are saved whenever the Landscape requires it. |
| **Brush Size UIMax** | Maximum size that can be set via the slider for the landscape sculpt/paint brushes. |
| **Brush Size Clamp Max** | Maximum size that can be set manually for the landscape sculpt/paint brushes. |
| **Disable Temporal Anti Aliasing in Landscape Mode** | When true, temporal anti-aliasing will be inactive while in landscape mode. This avoids the ghosting effect on the landscape brush but can lead to aliasing or shimmering on other parts of the image. |
| **Default Landscape Material** | Defines which landscape material is assigned to new landscapes by default. |
| **Default Layer Info Object** | Defines which **Layer Info Object** is added to a new landscape by default. |
| **Display Target Layer Thumbnails** | When true, each target layer will have a representative thumbnail in landscape mode. However, the thumbnail system can be slow. Plus, certain landscape materials (e.g. using RVT) are not able to properly render thumbnails. Thus, setting this to false will skip needlessly rendering landscape layer thumbnails, which can improve the editing experience. |
| **Target Layer Default Blend Method** | Target layer blend method to use for newly created Landscape Layer Info assets. Changing this setting will not affect existing Landscape Layer Info assets. This is only used when `DefaultLayerInfoObject` isn’t set. |
| **HLOD Max ****Texture**** Size** | Maximum size of the textures generated for Landscape HLODs. |
| **Spline Icon World ZOffset** | Offset in Z for the landscape spline icon in world-space. |
| **Spline Icon Scale** | Size of the landscape spline control point icon in the viewport. |

- landscape
- building virtual worlds
- open world

On this page

- Landscape Tool Modes (-> landscape-overview)
- Landscape Features (-> landscape-overview)
- Large Terrain Sizes (-> landscape-overview)
- World Partition (-> landscape-overview)
- Landscape Memory Usage (-> landscape-overview)
- Static Render Data Stored as Textures in GPU Memory (-> landscape-overview)
- Continuous Geo-MipMap LOD (-> landscape-overview)
- Heightmap and Weight Data Streaming (-> landscape-overview)
- High Resolution LOD-Independent Lighting (-> landscape-overview)
- Collision (-> landscape-overview)
- Landscape Project Settings (-> landscape-overview)

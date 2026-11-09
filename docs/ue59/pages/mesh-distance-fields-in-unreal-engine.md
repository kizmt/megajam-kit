# Mesh Distance Fields

https://dev.epicgames.com/documentation/en-us/unreal-engine/mesh-distance-fields-in-unreal-engine?application_version=5.9

> An overview of Mesh Distance Fields and its available features that you can use when developing your games.

[image: Mesh Distance Fields]

**Unreal Engine** leverages the power of **Distance Fields** to have dynamic ambient occlusion and shadowing for Static Mesh Actors in your games. In addition to that, the Mesh Distance Field representation of an Actor can be used for other features like GPU particle collision or even with the Material Editor to create dynamic flow maps and much more. Lumen Global Illumination and Reflections also uses Mesh Distance Fields for Software Ray Tracing.

Continue reading below to learn how Mesh Distance Fields work and some of the ways you can use it in your games.

## How Does It Work?

To represent a Static Mesh's surfaces, a **Signed Distance Field** (SDF) is used. It works by storing the distance to the nearest surface in a volume texture. For every point on the exterior of the mesh is considered positive distance and any point inside the mesh stores a negative distance. In the example below, the positive distances are being traced and stored to represent the tree later on.

[image: Example of the storing distance to the nearest surface]

The first property of SDF that make them useful is that when tracing a ray, you can safely skip through empty space as the distance to the nearest surface is already known (this is sometimes called Sphere Tracing). This allows the intersections to be determined with a small number steps. By ray tracing a distance field, a visibility result is produced, meaning that if the ray intersects the mesh, the light will then be shadowed.

[image: Example of the sphere tracing principle]

The second property that makes SDF useful is that when you trace a ray, by tracking the closest distance a ray passed by an occluding object, an approximate cone intersection can be computed with no extra cost. This approximation makes it possible to do very soft area shadows and sky occlusion using distance fields. This property is key to features like Distance Field Ambient Occlusion (-> distance-field-ambient-occlusion-in-unreal-engine) as a small number of cones can compute a soft visibility for the entire hemisphere of a receiver point.

[image: Example of the tracking the closest distance a ray passed by an occluding object]

You can read further about using Distance Fields for Lighting here.

## Scene Representation

Each level that you create is made up of all these Mesh Distance Fields for your placed Actors. When Mesh Distance Fields are generate, they are done so "offline" using triangle raytracing that stores the results in a volume texture. Because of this, mesh distance field generation cannot be done at runtime. This method computes the Signed Distance Field rays in all directions to find the nearest surface and stores that information.

You can visualize the Mesh Distance Fields that represent your scene by using the viewport and selecting **Show > Visualize > Mesh Distance Fields**.

|  |  |
| --- | --- |
| [image: Enabling of the Mesh Distance Field Visualization] Menu to Enable Visualization | [image: Example of the scene using Mesh Distance Field Visualization] Mesh Distance Field Visualization |

When you see areas that are more white than gray, it means that many steps were needed to find the intersection of the mesh surface. Rays at grazing angles to surfaces took many more steps to intersect than would have for a simpler mesh.

### Quality

The quality of a Mesh Distance Field representation is controlled by its volume texture resolution. This can be modified using **Distance Field Resolution Scale** in the Build Settings (-> mesh-distance-fields-properties-in-unreal-engine) of the **Static Mesh Editor**.

[image: Mesh Distance Field Visualization quality settings]

The Mesh Distance Field quality will be best for levels that are built out of meshes with similar size, as large meshes tend to create errors. For example, meshes in Fortnite either conform to a grid or are props placed around parts of the level, which gives the best results with few errors. Landscapes are handled separately by heightfields (-> distance-field-ambient-occlusion-in-unreal-engine) and are not affected by Distance Field resolution.

|  |  |  |
| --- | --- | --- |
| [image: Original Mesh] Original Mesh | [image: Mesh Distance Field visualization with low resolution] Resolution is too low, important features are lost | [image: Mesh Distance Field visualization with increased resolution] Resolution has been increased, important features represented |

The resolution of your Mesh Distance Field should be adjusted enough to capture the important features. As you increase the resolution of the mesh, the memory footprint of the Mesh Distance Field will increase as well. In the Static Mesh Editor, you can see the Mesh Distance Field size listed on the top left of the Viewport, including how much of it is always loaded and how much is streamed. You can also preview the Mesh Distance Field there by enabling **Visualize Distance Field** in the viewport's **Show** menu.

[image: Mesh Distance Field size listed in the Viewport of the Static Mesh Editor]

When the Mesh Distance Field is generated, corners are rounded off based on resolution. This can be offset by increasing its resolution, but in most cases, should not be an issue depending on the complexity of the mesh. By default, the highest resolution any single mesh's distance field can have is 256 voxels along each axis.

|  |  |  |
| --- | --- | --- |
| [image: Rounded corners based on the resolution 1] | [image: Rounded corners based on the resolution 2] | [image: Rounded corners based on the resolution 3] |

For thin surfaces, they can only be represented with a negative texel inside the mesh, which is necessary for finding its root. Increasing the resolution can capture the larger detail more accurately here, but in cases where you're only using Distance Field Ambient Occlusion (-> distance-field-ambient-occlusion-in-unreal-engine) and the surfaces aren't represented properly. Occlusion further from the surface will be accurate, so it's often not noticeable with sky occlusion.

[image: Thin serfaces representation with Mesh Distance Field visualization]

### Global Distance Field

The Global Distance Field is a low-resolution Distance Field that uses Signed Distance Fields occlusion in your levels while following the camera. It creates a cache of the per-object Mesh Distance Fields and composites them into a few volume textures centered around the camera, called clipmaps. Only newly visible areas or those affected by the scene modification need to be updated, so composition doesn't cost much.

The lower resolution of the object Distance Field means that it can be used for everything, but when computing cone traces for sky occlusion, they are sampled near the point of being shaded while the Global Distance Field is sampled further away.

You can visualize the Global Distance Field in the viewport by clicking **Show > Visualize > Global Distance Field**.

[image: Thin surfaces are represented with a negative texel inside the mesh]

Below is a comparison of the per-object Mesh Distance Field visualization in comparison to the Global Distance Field visualization that combines them into clipmaps based on the camera view and distance.

 [image: Mesh Distance Fields Visualization]

 [image: Global Distance Fields Visualization]

For more information, visit the Distance Field Ambient Occlusion (-> distance-field-ambient-occlusion-in-unreal-engine) page.

### Foliage

Foliage assets can also leverage the Distance Fields making it possible to have dynamic occlusion or even have distance shadowing beyond what Cascaded Shadow Maps can shadow.

Below are some options you should consider when using any foliage assets in your games to get the most out of performance and quality.

#### Two-Sided Distance Field

For high-density meshes (like trees) where you have surface that are usually made up of a masked material that represents many holes for leaves or branches, these cannot adequately be represented as a solid surface. For this reason, you can enable the Build Setting (-> mesh-distance-fields-properties-in-unreal-engine) for **Two-Sided Distance Field Generation** in the **Static Mesh Editor**. This option will work well for foliage but does come at a higher ray marching cost.

[image: Enabling the Two-Sided Distance Field]

Look at the example below. The tree on the left is using a default opaque Mesh Distance Field representation. The one on the right has **Two-Sided Distance Field Generation** enabled. You'll notices that the two-sided mesh distance field is more white than it is gray and the surfaces are now translucent. This means that many more steps were needed to find the intersection of the mesh when generating the volume texture than the opaque one and will come at a higher cost.

|  |  |
| --- | --- |
| [image: Two-Sided Distance Field Generation Disabled] Two-Sided Distance Field Generation Disabled | [image: Two-Sided Distance Field Generation Enabled] Two-Sided Distance Field Generation Enabled |

#### Foliage Tool Settings

In the Foliage Tool (-> procedural-foliage-tool-in-unreal-engine), you must enable each foliage type that you want to use Distance Field lighting features for ambient occlusion and shadowing. By default, this setting is disabled because some foliage assets (like grass) where you would have thousands or tens of thousands of instances would overflow the tile culling buffer. When this happens, you can unsightly artifacts. So, only enable **Affect Distance Field Lighting** for the foliage assets that you need.

[image: Enable Affect Distance Field Lighting]

### Enabling Distance Fields

To enable Mesh Distance Fields for your project, click **Edit** on the **Main** menu and select **Project Settings**.

[image: Open Project Settings]

Navigate to the **Engine** section and select **Rendering**. Under the **Software Ray Tracing** category, toggle the checkbox next to **Generate Mesh Distance Fields**.

[image: Enable Generate Mesh Distance Field]

When you enable this, you will be prompted to restart your project.

[image: Restart Editor to apply new settings]

Once completed, you can visualize the Mesh Distance Fields in the viewport by clicking **Show** \> **Visualize** \> **Mesh DistanceFields**. You should see a similar view to this.

 [image: Scene View]

 [image: Mesh Distance Fields Visualization]

The entirety of this level is represented by instanced Distance Fields that are stored in volume textures.

### Limitations

**Limitations of the Distance Fields technique:**

- Support for feature level 5 platforms only (DX-11 and above)
- Only casts shadows from rigid meshes. For Skeletal Meshes, you can use Capsule Shadows (-> capsule-shadows-in-unreal-engine) for indirectly lit areas with Distance Field Ambient Occlusion (DFAO) and soft direct shadowing.
- Materials that deform the mesh through World Position Offset or displacement may cause self-shadowing artifacts, as the Distance Field representation is generated offline and does not know about these deformations.

**Limitations of the current implementation but can be improved in the future:**

- Non-uniform scaling cannot be handled correctly (although, mirroring is ok). Scaling the mesh by two times or less is not generally noticeable.
- Only supports Static Mesh, Instanced Static Mesh, Foliage, and Landscape (Heightfield). Foliage must be enabled with **Affect Distance Field Lighting** from the Foliage Tool settings.

### References

- Quilez,Inigo. "Raymarching Distance Fields." N.p, 2008

## Essentials

- [image: Distance Field Ambient Occlusion] Distance Field Ambient OcclusionAn overview of using Mesh Distance Fields to create dynamic ambient occlusion for SkyLights. (-> distance-field-ambient-occlusion-in-unreal-engine)
- [image: Distance Field Soft Shadows] Distance Field Soft ShadowsAn overview of using Mesh Distance Fields to create dynamic soft area shadowing. (-> distance-field-soft-shadows-in-unreal-engine)
- [image: Using Distance Field Shadows] Using Distance Field ShadowsHow to setup and use Distance Field Shadowing. (-> using-distance-field-shadows-in-unreal-engine)
- [image: Using Distance Field Ambient Occlusion] Using Distance Field Ambient OcclusionHow to setup and use Distance Field Ambient Occlusion. (-> using-distance-field-ambient-occlusion-in-unreal-engine)
- [image: Using Distance Field Indirect Shadows] Using Distance Field Indirect ShadowsHow to setup and use Distance Field Indirect Shadows. (-> using-distance-field-indirect-shadows-in-unreal-engine)
- [image: Mesh Distance Fields Properties] Mesh Distance Fields PropertiesA reference page for all the Mesh Distance Field settings that can be found in the Project Settings, Light Components, Static Mesh Editor, and individual Actors. (-> mesh-distance-fields-properties-in-unreal-engine)

- static mesh
- rendering
- lighting
- shadows
- distance fields

On this page

- How Does It Work? (-> mesh-distance-fields-in-unreal-engine)
- Scene Representation (-> mesh-distance-fields-in-unreal-engine)
- Quality (-> mesh-distance-fields-in-unreal-engine)
- Global Distance Field (-> mesh-distance-fields-in-unreal-engine)
- Foliage (-> mesh-distance-fields-in-unreal-engine)
- Two-Sided Distance Field (-> mesh-distance-fields-in-unreal-engine)
- Foliage Tool Settings (-> mesh-distance-fields-in-unreal-engine)
- Enabling Distance Fields (-> mesh-distance-fields-in-unreal-engine)
- Limitations (-> mesh-distance-fields-in-unreal-engine)
- References (-> mesh-distance-fields-in-unreal-engine)
- Essentials (-> mesh-distance-fields-in-unreal-engine)

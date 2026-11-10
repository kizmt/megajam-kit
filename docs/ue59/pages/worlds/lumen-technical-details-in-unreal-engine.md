# Lumen Technical Details

https://dev.epicgames.com/documentation/en-us/unreal-engine/lumen-technical-details-in-unreal-engine?application_version=5.9

> Dive into the technical details of using Lumen's global illumination and reflections features with software or hardware ray tracing.

[image: Lumen Technical Details]

Lumen uses multiple ray-tracing methods to solve Global Illumination and Reflections. Screen Traces are done first, followed by a more reliable method. Lumen supports two different ray tracing methods: Hardware Ray Tracing and Software Ray Tracing through signed distance fields. Hardware ray tracing provides higher quality and is enabled by default, but it requires dedicated video card support and is more expensive.

Lumen's Global Illumination and Reflections primary shipping target is to support large, open worlds running at 60 frames per second (FPS) on next-generation consoles. The engine's **High** scalability level contains settings for Lumen targeting 60 FPS.

Lumen's secondary focus is on clean indoor lighting at 30 FPS on next-generation consoles. The engine's **Epic** scalability level produces around 8 milliseconds (ms) on next-generation consoles for global illumination and reflections at 1080p internal resolution, relying on Temporal Super Resolution (-> temporal-super-resolution-in-unreal-engine) to output at quality approaching native 4K.

You can read more about Lumen performance in the Lumen Performance Guide (-> lumen-performance-guide-for-unreal-engine).

## Surface Cache

Lumen generates an automatic parameterization of the nearby scene's surface called the **Surface Cache**. It is used to quickly look up lighting at ray hit points in the scene. Lumen captures the material properties for each mesh from multiple angles. These capture positions (called **Cards**) are generated offline for each mesh.

Cards can be visualized with the console command `r.Lumen.Visualize.CardPlacement 1`.

[image: Lumen Card Placement Visualization]

By default, Lumen only places 12 Cards on a mesh, but you can increase that amount by setting **Max Lumen Mesh Cards** in the **Build Settings** of the Static Mesh Editor. Adjusting the number of cards is useful for more complex interiors or single meshes with irregular shapes.

[image: Static Mesh Editor Build Setting Max Lumen Mesh Cards]

Areas that don't have Surface Cache coverage are colored pink in the **Surface Cache** View Mode of the Level Editor.

These areas will not bounce light and will appear black in reflections. Issues like this can be fixed by increasing the number of Cards used with **Max Lumen Mesh Cards**, but that may not solve all issues. Alternatively, breaking the mesh into less complex pieces can resolve these types of issues as well.

|  |  |
| --- | --- |
| [image: View Mode Lumen Surface Cache] Click image for full size. | [image: Lumen Surface Cache Visualization Example] Click image for full size. |
| View Mode > Lumen > Surface Cache | Lumen Surface Cache Visualization of Complex Mesh |

Surface cache support for skeletal meshes is enabled by default (`r.MeshCardRepresentation.SkeletalMesh`). Unlike static meshes, they don’t have offline generated cards due to their dynamic nature. Instead, six cards are placed around their pre-skinned bounding boxes when they are added to scenes. As a result, surface cache coverage and quality are fairly limited for skeletal meshes, especially during animations that deform the meshes a lot.

Surface cache support for spline meshes has been improved. Since each spline mesh instance can deform the mesh differently, instead of generating offline cards for each instance, a new mesh cards bounds is computed for the post-deformed mesh and cards from the pre-deformed mesh are refitted to the new bounds. It should still provide reasonable coverage but expect coverage and quality to degrade as the meshes go through greater deformation.

Materials with view-dependent logic, such as Pixel Depth, Camera Position, or Camera Vector may appear incorrectly in Lumen Surface Cache view mode. Materials that use these nodes can use the **Ray Tracing Quality Switch** node to provide a version of the Material that works with Lumen Surface Cache, or to optimize Surface Cache captures for complex materials.

[image: ray tracing quality switch material node]

For more information about using the Ray Tracing Quality Switch node, see Ray Tracing Performance Guide (-> ray-tracing-performance-guide-in-unreal-engine).

Nanite accelerates the mesh captures used to keep Surface Cache in sync with the triangle scene. High polygon meshes in particular, need to be using Nanite (-> nanite-virtualized-geometry-in-unreal-engine) to have efficient captures. Foliage and Instanced Static Mesh Components can only be supported if the mesh is using Nanite.

After the Surface Cache is populated with material properties, Lumen calculates direct and indirect lighting for these surface positions. These updates are amortized over multiple frames, providing efficient support for many dynamic lights and multiple bounce global illumination.

Unreal Engine provides visualization modes for Surface Cache and Cards representation. See the Lumen Visualization Options (-> lumen-technical-details-in-unreal-engine) section of this page for more details.

Only meshes with simple interiors can be supported — walls, floors, and ceilings should all be separate meshes. Importing an entire room, which includes furniture, in a single mesh is not expected to work with Lumen.

## Screen Tracing

Lumen features trace rays against the screen first (called **Screen Tracing** or Screen Space Tracing), before using a more reliable method if no hit is found, or the ray passes behind a surface. Screen tracing supports any geometry type and is useful for covering up mismatches between the Lumen Scene and triangle scene.

The disadvantage in using screen traces is that they greatly limit controls for art direction, which would only apply to indirect lighting, like lighting properties for Indirect Lighting Scale or Emissive Boost. Setting a large Indirect Lighting Scale on a light will cause view-dependent global illumination, as Screen Traces cannot support it correctly.

The example scene below uses Screen Traces first before falling back to other, more costly tracing options. When disabling Screen Traces for global illumination and reflections, it is possible to see only the Lumen Scene produced by Software Ray Tracing. Screen Traces help resolve the mismatch that can happen between the triangle scene and Lumen Scene.

You can perform this type of comparison by disabling Screen Traces from the Level Viewport's **Show > Lumen** menu and removing the check next to **Screen Traces**, or disable the setting for **Screen Traces** in the **Post Process Volume** under **Lumen Global Illumination** and **Lumen Reflections** categories.

 [image: Screen Traces Enabled | (Default)]

 [image: Screen Traces Disabled | Using Surface Cache]

## Lumen Ray Tracing

Lumen provides two methods of ray tracing the scene: Software Ray Tracing and Hardware Ray Tracing.

- **Software Ray Tracing** uses Mesh Distance Fields to operate on the widest range of hardware and platforms but is limited in the types of geometry, materials, and workflows it can effectively use.
- **Hardware Ray Tracing** supports a larger range of geometry types for high quality by tracing against triangles and to evaluate lighting at the ray hit instead of the lower quality Surface Cache. It requires supported video cards and systems to operate.

Software Ray Tracing is the only performant option in scenes with many overlapping instances, while Hardware Ray Tracing is the only way to achieve high quality mirror reflections on surfaces.

### Software Ray Tracing

Lumen uses Software Ray Tracing against Signed Distance Fields by default. This tracing representation is supported on any hardware supporting Shader Model 6 (SM6), and only requires that **Generate Mesh Distance Fields** be enabled in the Project Settings. The renderer merges Mesh Distance Fields into a Global Distance Field to accelerate tracing. By default, Lumen traces against each mesh's distance field for the first two meters for accuracy, and the merged Global Distance Field for the rest of each ray.

Projects with extreme overlapping instances can control the method Lumen uses with the project setting **Software Ray Tracing Mode**. Lumen provides two options to choose from:

- **Detail Tracing** involves tracing against the individual mesh's signed distance field for the highest quality. The first two meters are used for accuracy and the Global Distance Field for the rest of each ray. This method has extremely high cost in levels built with kitbashing.
- **Global Tracing** traces against the Global Distance Field for each ray for the fastest traces. This is the engine default.

Mesh Distance Fields are streamed in and out based on distance as the camera moves through the world. They are packed into a single atlas to allow ray tracing.

Use the command `r.DistanceFields.LogAtlasStats 1` to output mesh distance field statistics to the log.

The quality of Lumen's Software Ray Tracing depends on the quality of the mesh's distance field representation. There are two visualization options, one for **Mesh DistanceFields** and the other for **Global DistanceField**. These visualization modes are found under the viewport's **Show > Visualize** menu.

[image: Show Visualization menu selections for Mesh Distance Fields and Global Distance Field]

|  |  |  |
| --- | --- | --- |
| [image: Lumen Scene View] Click image for full size. | [image: Mesh Distance Field Visualization] Click image for full size. | [image: Global Distance Field Visualization] Click image for full size. |
| Scene View | Mesh Distance Fields Visualization | Global Distance Field Visualization |

For some meshes, thin surfaces may not have a good distance field representation and could cause issues with light leaking. The Mesh Distance Field visualization can help you spot these types of issues. Pay particular attention to the quality of window meshes, these can have a huge impact on the brightness of the room’s interior.

(Left to Right) Triangle Mesh, Distance Field Resolution Scales 1.0 (Default), 1.5, 2.0

There are two ways to go about improving a meshes distance field representation:

|  |  |
| --- | --- |
| Click image for full size. | Click image for full size. |
| Project Settings: Distance Field Voxel Density | Static Mesh Editor: Distance Field Resolution Scale |

- Projects can globally increase mesh distance field quality using the **Distance Field Voxel Density** found in the Project Settings.
- Increase the **Distance Field Resolution Scale** of individual meshes that need more quality from the Static Mesh Editor **Build Settings**.

Increasing Distance Field resolution or density will increase the disk size of the project.

#### Limitations of Software Ray Tracing

Software Ray Tracing has some limitations relating to how you should work with it in your projects and what types of geometry and materials it currently supports.

**Geometry Limitations:**

- Only Static Meshes, Instanced Static Meshes, Hierarchical Instanced Static Meshes, and Landscape terrain are represented in the Lumen Scene.
- Foliage must be enabled with the setting **Affect Distance Field Lighting** found in the Foliage Tool settings.

**Material Limitations:**

- World Position Offset (WPO) is not supported.
- Translucent materials are added as a lumen card so they can receive diffuse global illumination when using **Hit Lighting for Reflections** with Lumen.
- Distance fields are built off of properties of the material assigned to the Static Mesh Asset rather than the override component.Overriding with a material that has a different Blend Mode or that has Two-Sided property enabled will cause a mismatch between the triangle representation and the mesh's distance field representation.

**Workflow Limitations:**

- Software Ray Tracing requires that levels be composed of modular geometry. Things like walls, floors, and ceilings should be separate meshes. Large single meshes, such as a mountain or multi-story building, will have a poor distance field representation that can cause self-occlusion artifacts to appear.
- Walls should be no thinner than 10 centimeters (cm) to avoid light leaking.
- Distance Fields cannot represent extremely thin features, or one-sided meshes seen from behind. Avoid these types of artifacts by ensuring the viewer doesn't see the triangle back faces of one-sided meshes or only use closed geometry.
- Mesh Distance Field resolution is assigned based on the imported scale of the Static Mesh.A mesh that is imported very small and then scaled up on the component **will not** have sufficient distance field resolution. Instead, set the distance field resolution from the Static Mesh Editor's Build Settings if you use scaling on placed instances in a Level.

### Hardware Ray Tracing

Hardware Ray Tracing supports a larger range of geometry types than Software Ray Tracing, in particular it supports tracing against skinned meshes. Hardware Ray Tracing also scales up better to higher qualities — it intersects against the actual triangles and has the option to evaluate lighting at the ray hit instead of the lower quality Surface Cache.

To use high quality hit lighting, the following must be enabled in the Project Settings under the **Engine > Rendering** section:

[image: Lumen Project Settings for High Quality]

- Support Hardware Ray Tracing: **Enabled**
- Use Hardware Ray Tracing when available: **Enabled**
- Ray Lighting Mode: **Hit Lighting for Reflections**

While Hardware Ray Tracing provides the highest quality of the two ray tracing methods, it also has the highest setup cost in large scenes causing tracing to become expensive with many overlapping meshes. Dynamically deforming meshes, like skinned meshes, also incur a large cost to update the Ray Tracing acceleration structures each frame, proportional to the number of skinned triangles. You can learn more about the setup and cost of Hardware Ray Tracing in the Ray Tracing Performance Guide (-> ray-tracing-performance-guide-in-unreal-engine).

For static meshes that have Nanite enabled, Hardware Ray Tracing mode can use the Nanite geometry or the **Fallback Mesh**. This is the mesh that is generated by **Fallback Relative Error** property to be used when the full detail mesh cannot be. These fallback meshes can be visualized in the level viewport under the **Show > Advanced > Nanite Meshes**.

Screen Traces are used to cover the mismatch between the full triangle meshes rendered by Nanite and the Fallback Mesh being ray-traced by Lumen. However, there are some cases where the mismatch is too large to be hidden. In these cases, raising the Fallback Relative Error can reduce incorrect self-intersection artifacts.

 [image: Full-detail Triangle Mesh]

 [image: Nanite Generated Fallback Mesh]

Lumen will use Hardware Ray Tracing when:

- The project has **Support Hardware Ray Tracing** and **Use Hardware Ray Tracing when available** enabled.Changing the first setting requires restarting the engine.

- The project is running on a supported operating system, RHI, and video card. Currently only the following platforms support performant Hardware Ray Tracing:Windows 10+ with DirectX 12Video cards must be NVIDIA RTX-2000 series and higher, or AMD RX 6000 series and higher.

- PlayStation 5
- Xbox Series S / X
- Switch 2

A project using Hardware Ray Tracing for Lumen may also want to fallback to Software Ray Tracing when needed, but not pay the memory costs and scene update costs of both at the same time. In these cases, you should add the following console variable to your `DefaultEngine.ini` configuration file:

 C++

```
r.DistanceFields.SupportEvenIfHardwareRayTracingSupported=0
```

r.DistanceFields.SupportEvenIfHardwareRayTracingSupported=0

With this setting disabled, it is no longer possible to toggle **Use Hardware Ray Tracing when available** at runtime.

## Large Worlds

Lumen Scene operates on the world around the camera, enabling large worlds and streaming. Lumen relies on Nanite's Level of Detail (LOD) and Multi-View rasterization for fast scene captures to maintain the Surface Cache, with all operations throttled to prevent hitches from occurring. Lumen does not require Nanite to operate, but Lumen's scene capturing becomes very slow in scenes with lots of high polygon meshes that have not enabled Nanite. This is especially true in scenes if the assets do not have good LODs set up for them.

Fast camera movement will cause Lumen Scene updating to fall behind where the camera is looking, causing indirect lighting to pop in as it catches up.

When Lumen is using Software Ray Tracing, Lumen Scene only covers 200 meters (m) from the camera position, but can be increased up to 800 m with the **Lumen Scene View Distance** setting in the Post Process Volume. Past the highest Lumen Scene distance, only Screen Traces are active for global illumination.

### Far Field

Lumen Hardware Ray Tracing implements **Far Field** traces, which extend Lumen Global Illumination and Reflections to one kilometer distance from the camera by default.

Far Field (-> ray-tracing-performance-guide-in-unreal-engine) traces are enabled by the console variable `r.LumenScene.FarField=1` in the `DefaultEngine.ini` configuration file, and requires the use of World Partition's Hierarchical Level of Detail (-> world-partition---hierarchical-level-of-detail-in-unreal-engine) (HLOD). Far Field requires the use of HLOD1 to be built.

When Far Field is enabled, it is traced beginning at the **Max Trace Distance** (default is 200m) and continues to `r.LumenScene.FarField.MaxtraceDistance` (default is 1 kilometer). Since objects can be culled from ray tracing using `r.RayTracing.Culling.Radius`, your projects will likely want the culling radius and max trace distance to match. Otherwise, the near-field (objects from the camera to the Max Trace Distance) may be culled before the far-field traversal point, which will leave a gap in coverage.

[image: Lumen Far Field Global Illumination and Reflections] The Unreal Engine 5 technical demo "The Matrix Awakens" demonstrates large-world global illumination using Far Field traces.

## General Limitations of Lumen Features

- Lumen Global Illumination cannot be used with Static Lighting (-> static-light-mobility-in-unreal-engine) in lightmaps. Lumen Reflections can be used with global illumination from lightmaps, which provides a way to further scale up render quality for projects using Static lighting techniques.
- Lumen is **not** compatible with Forward Shading (-> forward-shading-renderer-in-unreal-engine).

## Lumen Platform Support

- Lumen **does not** support previous-generation consoles, such as PlayStation 4 and Xbox One.
- Projects that rely on dynamic lighting can use a combination of Distance Field Ambient Occlusion (-> distance-field-ambient-occlusion-in-unreal-engine) on those platforms and legacy PC hardware.
- Lumen is developed for next-generation consoles (PlayStation 5, Xbox Series S / X and Switch 2) and high-end PCs. Lumen has two ray tracing modes, each with different requirements.
- Software Ray Tracing Requirements:Video cards using DirectX 12 with support for Shader Model 6 (SM6)Requires an NVIDIA GeForce GTX-1070 or higher card.

- Lumen is supported on **Android Vulkan** and can be used with the Mobile Renderer. Games using dynamic lighting on mobile platforms that are not supported need to use unshadowed Sky Light (-> sky-lights-in-unreal-engine).
- Lumen **does not** currently support Virtual Reality (VR) systems. While VR can be supported, the high frame rates and resolutions required by VR make dynamic global illumination a poor fit.
- Hardware Ray Tracing Requirements:Windows 10 with DirectX 12, or Linux with Vulkan.
- Video cards must be NVIDIA RTX-2000 series or higher, or AMD RX-6000 series or higher.

## Lumen Visualization Options

Lumen provides several ways of visualizing data in the Unreal Editor that can be helpful in inspecting and troubleshooting how Lumen is lighting the scene.

The primary Lumen view modes are found in the Level Viewport under the View Modes menu:

|  |  |
| --- | --- |
| [image: lumen viewmodes menu] Click image for full size. | [image: lumen overview viewmode] Click image for full size. |
| Lumen View Modes Options | Lumen Overview Visualization |

- **Overview** shows three of Lumen's visualizations as small tiles over the rendered scene.
- **Lumen Scene** shows Lumen's version of the scene, in the highest quality available: Surface Cache or Hardware Ray Tracing.
- **Geometry Normals** shows the normals of geometry making it easier to spot issues with the global distance field (for software ray tracing) or Nanite fallback meshes (for hardware ray tracing).
- **Reflection View** shows the scene as Lumen Reflections see it, including limited tracing distances used by reflections.
- **Surface Cache** is the same as Lumen Scene except that areas of meshes that were too complex to be covered are color highlighted in pink.

Additional visualizations are found in the Level Viewport's **Show > Visualize** menu.

[image: Show Visualization menu selections for Mesh Distance Fields and Global Distance Field]

|  |  |  |
| --- | --- | --- |
| [image: Lumen Scene View] Click image for full size. | [image: Mesh Distance Field Visualization] Click image for full size. | [image: Global Distance Field Visualization] Click image for full size. |
| Scene View | Mesh Distance Fields Visualization | Global Distance Field Visualization |

- **Mesh Distance Fields** shows the individual mesh's Signed Distance Field representations that make up the scene.
- **Global Distance Field** shows the lower detail distance field that has been merged of individual mesh distance fields. There are also some console commands you can use to visualize other data used for Lumen:
- Lumen's **Card Placement** looks at how capture positions (called **Cards**) are used in the scene. These Cards are generated offline for each mesh, and are used to capture the material properties of each mesh from multiple angles. Enable this visualization mode using `r.Lumen.Visualize.CardPlacement 1`.
- Hardware Ray Tracing uses the **Nanite Fallback Mesh**, which is generated from the **Fallback Relative Error** property of the Static Mesh Asset. The fallback mesh is used to cover mismatches between Screen Traces and the Nanite ray-traced scene in Lumen Reflections. Use **Show > Advanced > Nanite Meshes** to disable Nanite rendering and see the fallback mesh used by Lumen.

## Troubleshooting Topics

When troubleshooting any Lumen-related issues in your scene, a good place to start is with the **Lumen Overview** view mode.

Lumen Scene should match the main scene view in ways that have noticeable impact on indirect lighting. Significant pink areas in Lumen Surface Cache view mode should be solved by raising the **Max Lumen Mesh Cards** in the Static Mesh settings, or splitting the mesh into multiple parts.

### Problem-Causing Meshes

In cases where you have problem-causing meshes contributing to indirect lighting, they can be removed from Lumen Scene using by using the Level instance's **Details** panel to disable one of the following:

- For **Software Ray Tracing**, unchecking the box for **Affect Distance Field Lighting** removes them.
- For **Hardware Ray Tracing**, unchecking the box for **Visible in Ray Tracing** removes them.

#### Problem: Splotchy Artifacts seen in Mirror Reflections Indoors

Splotchy artifacts seen in mirror reflections happen because Lumen uses very low quality settings to calculate multi-bounce global illumination as there is not much budget for it. In the Post Process settings, increase the **Lumen Scene Quality** to reduce artifacts.

|  |  |
| --- | --- |
| Click image for full size. | Click image for full size. |
| Lumen Scene View Mode | Improved Lumen Scene Lighting Quality to 4 |

#### Problem: Small Meshes are Black in Mirror Reflections

Small meshes appear black in mirror reflections because Lumen culls small objects from Lumen Scene for performance. In the **Post Process** Setting, increase the **Lumen Scene Detail** will capture smaller meshes over farther distances.

 [image: Lumen Scene View Mode]

 [image: Lumen Scene Detail Increased]

#### Problem: Sky Occlusion and Global Illumination Disappears at 200 Meters

Sky occlusion and global illumination are only maintained in Lumen Scene for the first 200 meters. In the Post Process settings, increase the **Lumen Scene View Distance** to maintain Lumen Scene over farther distances.

#### Problem: Light Leaking in Large Cave-like Areas

In cave-like, or enclosed areas, if light leaking is happening, it is because Lumen limits how far rays are traced to improve performance, but missing an occluder causes light leaking.

In the **Post Process** Setting, raise the **Lumen Scene Detail** and the **Max Trace Distance**.

For example, the mesh below is an enclosed box with no holes viewed from the outside.

Inside the box, you can see that skylighting is leaking throughout the scene.

Raise the following values:

- Lumen Scene View Distance
- Max Trace Distance

The light leaking should now be fixed.

#### Problem: Lighting Changes Propagate too Slowly to Global Illumination

When changing or toggling Lumen Global Illumination off, the lighting in the scene changes too slowly causing it to fade rather than quickly turn on or off.

For example, toggling the Sky Light off in the following scene, you see the lighting slowly fade out.

You can improve the speed at which Lumen Global Illumination changes by increasing the **Post Process Volume** setting for **Final Gather Lighting Update Speed**.

Notice how the skylighting turns off more quickly than before.

Remember to turn these settings back to defaults after the change to get back to cheaper lighting.

#### Problem: Small Emissive Meshes Do Not Light the Scene Consistently

Small objects are culled from Lumen Scene leaving only the Screen Traces to pick up small emissive meshes. This leads to inconsistency in their lighting in the scene. Set the Level instances **Emissive Light Source** from the **Details** panel.

 [image: Lumen Scene View Mode]

 [image: Emissive Light Source Property Enabled]

#### Problem: Wanting Highest Quality Mirror Reflections Even if Not Performant

Lumen uses its Surface Cache for lighting reflection rays by default since it is significantly faster to render. However, lighting can be configured to evaluate at the ray hit by setting one of the following:

- In the Project Settings, set **Ray Lighting Mode** to **Hit Lighting for Reflections**.
- This changes lighting for the entire project.
- In the Post Process Volume, set **Ray Lighting Mode** to **Hit Lighting for Reflections**.Ideal for individual changes where you only need it for a single shot or viewpoint.

In the example scene below, notice how the specular highlights on the wall and stairs are missing in the reflection.

 [image: Lumen Surface Cache]

 [image: Lumen Hit Lighting for Reflections]

- rendering
- lighting
- global illumination

On this page

- Surface Cache (-> lumen-technical-details-in-unreal-engine)
- Screen Tracing (-> lumen-technical-details-in-unreal-engine)
- Lumen Ray Tracing (-> lumen-technical-details-in-unreal-engine)
- Software Ray Tracing (-> lumen-technical-details-in-unreal-engine)
- Limitations of Software Ray Tracing (-> lumen-technical-details-in-unreal-engine)
- Hardware Ray Tracing (-> lumen-technical-details-in-unreal-engine)
- Large Worlds (-> lumen-technical-details-in-unreal-engine)
- Far Field (-> lumen-technical-details-in-unreal-engine)
- General Limitations of Lumen Features (-> lumen-technical-details-in-unreal-engine)
- Lumen Platform Support (-> lumen-technical-details-in-unreal-engine)
- Lumen Visualization Options (-> lumen-technical-details-in-unreal-engine)
- Troubleshooting Topics (-> lumen-technical-details-in-unreal-engine)
- Problem-Causing Meshes (-> lumen-technical-details-in-unreal-engine)
- Problem: Splotchy Artifacts seen in Mirror Reflections Indoors (-> lumen-technical-details-in-unreal-engine)
- Problem: Small Meshes are Black in Mirror Reflections (-> lumen-technical-details-in-unreal-engine)
- Problem: Sky Occlusion and Global Illumination Disappears at 200 Meters (-> lumen-technical-details-in-unreal-engine)
- Problem: Light Leaking in Large Cave-like Areas (-> lumen-technical-details-in-unreal-engine)
- Problem: Lighting Changes Propagate too Slowly to Global Illumination (-> lumen-technical-details-in-unreal-engine)
- Problem: Small Emissive Meshes Do Not Light the Scene Consistently (-> lumen-technical-details-in-unreal-engine)
- Problem: Wanting Highest Quality Mirror Reflections Even if Not Performant (-> lumen-technical-details-in-unreal-engine)

# Nanite Technical Details

https://dev.epicgames.com/documentation/en-us/unreal-engine/nanite-technical-details?application_version=5.9

> Dive into the technical details of using Nanite's virtualized geometry system.

This page provides deeper understanding and usage examples of Nanite's geometry system.

## Nanite Fallback Mesh and Precision Settings

Static and skeletal meshes include additional properties that control the precision of the Nanite representation and its fallback mesh generated from the originally imported source mesh.

These settings are located in the mesh asset’s editor in the **Details **panel under the **Nanite Settings **section.

 Nanite Mesh Editor Settings

| Property | Description |
| --- | --- |
| Enable Nanite Support | Enables this mesh to be used with Nanite and to generate a fallback mesh in situations where Nanite cannot be used. |
| Preserve Area | Enables Nanite meshes that would lose surface area due to simplification to redistribute that lost area to the remaining triangles by dilating out the open boundary edges. This is most useful for foliage where leaves tend to become disjoint triangles and quads through simplification. The effect of this setting is to scale each leaf up. For geometry ribbons, like blades of grass, it has the effect of thickening them. This setting should be enabled on all foliage meshes and nothing else. |
| Explicit Tangents | When true, the original model tangents are stored and used per asset. This setting means tangents are stored explicitly on disk instead of being derived implicitly at runtime. The Tangent Precision setting becomes available for additional control of vertex tangents. Enabling the setting increases storage by roughly 10% but can be preferable when implicit tangents are not precise enough. |
| Lerp UVs | Whether to interpolate UVs when simplifying. This should be enabled whenever possible. For real UV coordinates, this enables calculating the lowest-error optimal UVs for new vertices when simplifying, assuming the UVs are used as normal texture coordinates and will interpolate across the face of the triangles. This should be disabled if data stored in the UVs isn't valid to interpolate. For example, if indexes are stored in UVs, lerping an index doesn't make sense and will break the shader trying to use it.If disabled, error from UVs is no longer accounted for when Nanite selects the LOD to render because error due to arbitrary vertex attributes that aren't interpolatable can't be generally reasoned about. |
| Position Precision | Choose the precision this mesh should use when generating the vertex positions of a Nanite mesh. Automatically determines the appropriate precision based on the size of the mesh. The precision can be overridden to improve precision or optimize disk footprint. |
| Normal Precision | Choose the precision this mesh should use when generating the vertex normals of a Nanite mesh. Automatically determines the appropriate precision based on the size of the mesh. The precision can be overridden to improve precision or optimize disk footprint. |
| Minimum Residency (Root Geometry) | Sets the memory byte size this mesh should always keep in memory and has the rest streamed in. Higher values require more memory, but for some meshes, this can mitigate streaming pop-in issues from occurring. |
| Keep Triangle Percent | The percentage of triangles to keep from the source mesh. Reduce this percentage to optimize disk size. |
| Trim Relative Error | Sets the maximum amount of relative error that can be removed for the Nanite mesh. All detail in the source mesh with less visual impact than this relative error amount is removed. The relative error does not have a unit size and is relative to the size of the mesh. By default, Nanite stores all of the original source mesh's triangles. |
| Fallback Target | Determine which targeting system to use when generating a fallback mesh.Auto: Automatically create a fallback mesh based on project settings.Fallback Triangle Percent: Sets the percentage of triangles that remain when reducing the source mesh for Nanite.Fallback Relative Error: Reduce until the specified error is reached relative to the mesh size. All detail in the generated fallback mesh with less visual impact than this relative error amount is removed. |
| Source Import Filename | The file path used to import a high-resolution mesh for use with Nanite. The high-resolution version of the mesh is used in place of LOD0 by systems that can benefit from more detailed geometry, such as Nanite and Geometry Modeling in Unreal Engine. |
| Displacement UV Channel | UV channel to use when sampling displacement maps. |
| Displacement Maps | Add and edit displacement maps. |
| Max Edge Length Factor | Controls the maximum distance allowed between each vertex of the mesh on screen. This can be used to prevent over-simplification of meshes that are intended to be deformed, such as animation using world position offset, and spline meshes. This should be left at 0 by default unless explicitly needed to fix issues caused by over-simplification. |

### Vertex Precision

Nanite quantizes mesh vertex positions to maximize memory density and minimize disk footprint. The quantization step size is a power of two that can be selected to match the requirements of individual meshes using the Position Precision property. By default, Auto picks the appropriate precision based on the size of the mesh and its triangle density. You can manually override by selecting a precision size to improve precision or optimize disk footprint.

 Vertex Position Precision Options

Quantization is a form of lossy compression. Lossy compression is particularly challenging when working with modular mesh pieces or other meshes that have shared boundaries, especially when those boundaries need to align perfectly to not introduce holes or cracks in the geometry.

To ensure consistency, quantization happens in unnormalized object coordinates centered around the mesh origin. This ensures that the quantization never causes cracks when the mesh uses the same precision setting, and the translation between the mesh center is a multiple of that precision.

### Trimming Mesh Data

There are times when you’ll need to reduce the amount of data that Nanite stores in order to optimize for disk size. Nanite includes settings which provide a way for you to trim the detail data from a stored Nanite mesh at any point during production. This means you can safely overshoot quality up front and adjust accordingly later on to fit the size budget of the project and its platform targets.

Trimming Nanite’s detail data is like having a pre-decimate option before being stored as a Nanite mesh. In Nanite’s case, detail doesn’t need to be uniform across the mesh, as it removes the least significant data first and is more akin to lossy compression.

To trim detail data, you can adjust the following settings:

- Keep Triangle Percent sets the percentage of triangles to keep from the original source (full detail) mesh.
- Trim Relative Error sets the maximum amount of relative error that is allowed when trimming the data from the source mesh. Any triangle that, if removed, would incur a relative error less than this amount is removed. The relative error does not have a unit size and is relative to the size of the mesh.

The defaults for both of these properties are that nothing is trimmed by default, having Nanite store all of the original source mesh’s triangles. This is why it’s important to trim data to reduce disk size (in other words, download size), not specifically for improving performance.

For more detailed information on this aspect, see Data Size (-> nanite-technical-details) below.

### Fallback Mesh

Many parts of Unreal Engine need access to the vertex buffer provided by traditionally-rendered meshes. When you enable Nanite for a static mesh, it generates a coarse representation, the fallback mesh, of the highly detailed mesh. The fallback mesh is used when Nanite rendering is not supported. It is also used when it wouldn't be ideal to use the full-detail mesh, like when a complex collision is needed, using lightmaps for baked lighting, and for hardware ray tracing reflections with Lumen.

The **Fallback Triangle Percent** property represents the percentage of triangles from the original source mesh that are used to generate the Fallback Mesh. You can specify the percentage of triangles to keep between 0 and 100 percent, where large percentages keep more of the original mesh's detail.

The **Fallback Relative Error** property sets the maximum amount of relative error that is acceptable when removing details from the source mesh. Any triangles whose removal incurs less relative error than this amount are removed, with detail of less visual impact removed first. The relative error does not have a unit size and is relative to the size of the mesh.

For example, if you wanted your mesh without any decimation (removal of triangles), you would use a Fallback Triangle Percentage of 100 and a Fallback Relative Error of 0.

The comparison below shows the highly-detailed Nanite mesh based on the original source mesh versus the generated Fallback Mesh using default settings.

 [image: High Poly Nanite Mesh]

 [image: Nanite-generated Fallback mesh with Default Settings]

Use the Fallback Relative Error value to specify how much of the original detail is retained from the source mesh, and the Fallback Percentage value to set how much of that detail is used.

The comparison below shows the fallback mesh with properties reflecting changes to the Fallback Triangle Percent and Fallback Relative Error properties to retain more of the original source mesh’s triangles. When adjusting these values, use the Nanite details for **Nanite Triangles** in the viewport as an indicator of how many triangles the fallback mesh has.

 [image: Nanite-generated Fallback Mesh with Default Settings]

#### Fallback Mesh Visualization

In the Static Mesh editor, you can toggle between the fully detailed Nanite mesh and the Nanite fallback mesh using the viewports Nanite Fallback option in the Show dropdown menu. Alternatively, you can use the hotkey Ctrl + N to quickly toggle between the two visualization options.

#### Using Custom Fallback Mesh LODs for Nanite-enabled Meshes

The fallback mesh is used for engine features, such as complex per-poly collision, ray tracing, light baking, and so on. It is also used for platforms that do not support Nanite. When generating the fallback mesh, a Nanite-enabled mesh always uses the LOD0 slot of the source mesh for auto-generating the fallback mesh. However, there are times when it is desirable to use a manually specified fallback mesh, or a series of traditional LODs, rather than an auto-generated one.

This level of control would allow you to use Nanite in a project but also directly control the geometry seen in ray-traced reflections, or on platforms that do not support Nanite.

Follow the steps below to specify your own custom fallback mesh, or to use a series of LODs:

- Set the Fallback Triangle Percent to 0 so that the fallback mesh is as small as possible since it will be ignored when using this approach.
- Add one or more LODs to the mesh using this traditional LOD setup procedure.
- Use the LOD Import dropdown to Import LOD Level 1 from the LOD Settings section.
- Set the Minimum LOD to 1 under the LOD Settings section. This causes the Nanite-generated fallback mesh to be ignored.

Complex collision presents a special case. Use the LOD for the Collision property under General Settings to specify which LOD should be used for collision. Any LOD can be used for collision, including LOD0.

This particular approach may not be feasible to make Nanite projects automatically compatible with non-Nanite-supporting platforms and should be tested and evaluated for your project specifically.

Nanite efficiently handles very large numbers of instances, but if Nanite is disabled, there could be an overwhelming number of draw calls for the traditional render pipeline. You can feasibly test this in your own project using r.Nanite 0 to toggle Nanite off and on.

See the Console Variables and Commands section of this page for more information.

## Data Size

One could assume that because Nanite has the ability to achieve micro detail, it means a large increase in geometry data, ultimately resulting in larger game packages and download sizes for players. Nanite’s mesh format is significantly smaller than the standard static mesh format because of its specialized encoding.

For example, using the Unreal Engine 5 sample Valley of the Ancients, Nanite meshes average 14.4 bytes per input triangle. This means an average one million triangle Nanite mesh will be ~13.8 megabytes (MB) on disk.

When comparing a traditional low poly mesh plus its Normal map to a high poly Nanite mesh, you would see something like:

 [image: Low Polygon Static Mesh with a 4k Normal Map]

 [image: High Polygon Static Mesh with 4k Normal Map]

| Low Polygon mesh | High Polygon Mesh |
| --- | --- |
| Triangles: 19,066Vertices: 10,930Num LODs: 4Nanite: DisabledStatic mesh compressed package size: 1.34MB | Triangles: 1,545,338Vertices: 793,330Num LODs: n/aNanite: EnabledStatic mesh compressed package size: 19.64MB |

However, the compressed package size isn't the entire size of the asset. There are also unique textures only used by this mesh that have to be accounted for. Many of the materials used by meshes have their own unique textures made up of different Normal, BaseColor, Metallic, Specular, Roughness, and Mask textures.

This particular asset only uses two textures (BaseColor and Normal) and thus is not as costly on disk space as one with many other unique textures. For example, note the size of the Nanite mesh with ~1.5 million triangles is smaller in size (at 19.64MB) than a 4k normal map texture.

| Texture Type | Texture Size | Size on Disk |
| --- | --- | --- |
| BaseColor | 4k x 4k | 8.2MB |
| Normal | 4k x 4k | 21.85MB |

The total compressed package size for this mesh and its textures is:

- Low-polygon mesh: 31.04MB
- High-polygon mesh: 49.69MB

Because the Nanite mesh is very detailed already, replacing the unique normal map with a tiling detail map that is shared with other assets is a good approach to reduce texture sizes. This can result in some visual loss in quality, but it’s smaller than the difference in quality between the low poly and high poly meshes. A 1.5 million triangle Nanite mesh can both look better and be smaller than a low poly mesh with a 4k normal map texture when taking this into consideration.

Total compressed package size for the Nanite-enabled mesh and textures: 27.83 MB

 [image: High Polygon Static Mesh with 4K Normal Map]

 [image: Nanite Mesh with 4K "Detail" Normal Map]

You can try plenty of experiments with texture resolution and "detail" normal maps, and this particular comparison demonstrates that the data sizes of Nanite meshes are not too dissimilar from data that artists are already familiar with.

Lastly, we can compare the Nanite compression to the standard static mesh format using the high poly, where both are identical at LOD0.

| High Polygon Static Mesh | Nanite Static Mesh |
| --- | --- |
| Triangles: 1,545,338Vertices: 793,330Num LODs: 4Nanite: DisabledStatic mesh compressed package size: 148.95MB | Triangles: 1,545,338Vertices: 793,330Num LODs: n/aNanite: EnabledStatic mesh compressed package size: 19.64MB |

Comparing the Nanite compression from earlier with a size of 19.64MB is 7.6x smaller than the standard static mesh compression with 4 LODs.

### General Advice on Data Size

Nanite and Virtual Texturing (-> virtual-texturing-in-unreal-engine) systems, coupled with fast SSDs, have lessened concern over runtime budgets of geometry and textures. The biggest bottleneck now is how to deliver this data to the user.

Data size on disk is an important factor when considering how content is delivered — on physical media or downloaded over the internet — and compression technology can only do so much. The average end user's internet bandwidth, optical media sizes, and hard drive sizes have not scaled at the same rate as hard drive bandwidth and access latency, GPU compute power, and software technology like Nanite. Pushing that data to users is proving challenging.

Rendering highly detailed meshes efficiently is less of a concern with Nanite, but storage of its data on disk is what must be kept in check.

## Visualization Modes

Nanite includes a number of visualization modes to inspect its data in the current scene.

In the Level viewport under the View Modes dropdown, hover over Nanite Visualization and choose from the selection.

The Overview visualization displays the rendered scene in the center of the image with select Nanite visualizations around the screen for reference.

The following Nanite visualization modes are available to choose from:

| Nanite Vir |  |
| --- | --- |
| Mask | Visualization that marks Nanite (green) and Non-Nanite (red) geometry. |
| Triangles | Display all triangles of the Nanite meshes in the current scene. |
| Patches | Display all patches of the Nanite meshes in the current scene. |
| Clusters | Display colored representations of all grouping of triangles rendered in the current scene view. |
| Primitives | Visualization that colors components all the same color for all instances in an instance static mesh (ISM). |
| Instances | Visualization that applies a different color for each instance in the scene. |
| Overdraw | Displays the amount of overdraw happening for scene geometry. All evaluated pixels, including masked-out pixels, are added to the overdraw view. Smaller objects that are closely stacked together create more overdraw than larger ones. |
| Lightmap UV | Visualization that displays the UV coordinates of Nanite mesh surfaces.Visualization that displays the UV coordinates of Nanite mesh surfaces. |
| Evaluate WPO | Colors Nanite-enabled geometry that are using world position offset (green) versus ones that are not (red). |
| Pixel Programmable |  |
| Tessellation | Visualization for Nanite mesh using tessellation and amount of tessellation happening on only tessellated meshes. |
| Raster Bins | Displays groups that represent batches of geometry. |
| Shading Bins |  |

Nanite includes an Advanced visualizations mode that enables additional visualization options in the Nanite Visualization menu. These visualizations are useful for programmers who are debugging or profiling various low-level aspects of Nanite.

Enable this advanced visualization mode with the console variable `r.Nanite.Visualize.Advanced 1`.

## Nanite Culling

Before Nanite rasterizes a view, it culls. It walks the cluster hierarchy of every visible instance and keeps only the clusters that are inside the view frustum, aren't hidden behind other geometry, and are at the right level of detail for the screen.

Nanite splits this work into two classes, simple and complex, and culls each class in its own GPU dispatch, with the two dispatches running alongside each other. The simple class leaves out the extra work that deforming geometry needs, so it runs faster, and in most scenes it covers most instances. An instance is culled in the complex class if any of the following are true:

- It's a skeletal mesh or a spline mesh.
- It's part of a Nanite Assembly.
- It's a first-person primitive.
- Its material uses World Position Offset with **Max World Position Offset Displacement** set above 0, and World Position Offset is active, for instance. **Evaluate World Position Offset** and **World Position Offset Disable Distance** on the component control whether it's active.
- Its material uses displacement (Nanite Tessellation or Static Displacement Mapping).
- It moved this frame, or it carries previous-frame transform data because it's animated.

Nanite also adapts how many hierarchy levels it tests in each culling step. Near the top of the hierarchy, where only a few nodes are left to test, it assigns more GPU threads to each node so that one dispatch can descend several levels at once. This keeps the GPU busy in scenes with many instances.

You don't need to change content to benefit from this. If you're profiling, you can test the effect of each part with the following console variables. Both can be changed at runtime.

|  |  |
| --- | --- |
| Property | Description |
| `r.Nanite.Culling.Classification` | Splits culling work into simple and complex classes and culls each class in its own dispatch. Set to 0 to cull every instance with the complex path. Default: 1. |
| `r.Nanite.Culling.AdaptiveFanoutThreadBudget` | The target number of GPU threads for adaptive culling fanout. Higher values let culling descend further in each dispatch when few nodes are left to test. Set to 0 to test one level of the hierarchy at a time. Default: 6144. |

### Nanite Ray Tracing Quality Scaling

When Nanite ray tracing uses cluster acceleration structures (r.RayTracing.Nanite.Mode 2), Nanite builds them in a fixed-size memory pool. When the geometry that ray tracing requests needs more of the pool than it has, Nanite lowers ray tracing detail so the scene still fits. When demand drops again, it slowly raises detail back to full quality. It reacts quickly when the pool is over budget for more than one update, and recovers slowly when it is well under budget, so quality doesn't flicker. Cluster acceleration structures need a GPU and driver that support ray tracing cluster operations. On a GPU without that support, Nanite logs a warning and ray tracing uses fallback meshes instead.

When more than one view renders with Nanite ray tracing, such as in split-screen, Nanite requests streaming and selects ray tracing detail for the instances in each view's ray tracing scene.

You can tune the pool and the scaling with the following console variables. To watch the current scale, use `stat NaniteRayTracing` and look at **CLAS Quality Scale**.

|  |  |
| --- | --- |
| Property | Description |
| `r.RayTracing.Nanite.CLASBufferSize` | The size of the cluster acceleration structure pool, in MB. A larger pool reduces how often quality scaling has to lower detail. Default: 512. Maximum: 2048. |
| `r.RayTracing.Nanite.CLAS.QualityScaling` | Lowers ray tracing detail automatically when the pool can't hold the requested geometry. Default: 1. |
| `r.RayTracing.Nanite.CLAS.QualityScaling.HighThresholdPercentage` | Detail goes down while requested geometry needs more than this percentage of the pool. Default: 85. |
| `r.RayTracing.Nanite.CLAS.QualityScaling.LowThresholdPercentage` | Detail goes back up while requested geometry needs less than this percentage of the pool. Default: 70. |
| `r.RayTracing.Nanite.CLAS.QualityScaling.MinScale` | The lowest quality scale that scaling can reach. 1.0 disables scaling. Default: 0.3. |
| `r.RayTracing.Nanite.CLAS.DemandDriven` | Builds cluster acceleration structures only for streamed pages that ray tracing uses, instead of every resident page. Quality scaling requires this. Default: 1. |
| `r.RayTracing.Nanite.CLAS.Reclaim` | Frees cluster acceleration structures for pages that ray tracing stops using, so the pool follows the working set as the camera moves. Default: 1. |

## Console Variables and Commands

The following stats and console variables are available for use in debugging and configuring Nanite.

 Nanite rendering can be enabled and disabled globally at runtime using the console variable` r.Nanite 0`. Disabling Nanite is a good way to emulate platforms where it is not supported.

### Nanite Fallback Rendering Modes

Nanite provides fallback mesh rendering modes when Nanite is either disabled or unsupported by a platform. You can control which mode is used with the console variable r.Nanite.ProxyRenderMode.

- **0** is the default mode and falls back to rendering fallback meshes, or screen space-driven LODs if set. This includes the recognition of Min LOD in the Static Mesh Editor properties (described in the Fallback Mesh section above).
- **1** disables all rendering of Nanite-enabled meshes.
- **2** works similarly to mode 1 but allows the Show > Nanite Fallback visualization in the Static Mesh Editor to render a Nanite fallback.

The fallback render modes 1 and 2 are useful for scenes that have far more instances than could possibly be supported without Nanite. They provide a way to open the scene in the editor on non-Nanite-supporting platforms.

For example, in the Unreal Engine 5 Valley of the Ancients sample project, disabling Nanite would cause there to be tens of thousands of regular draw calls to happen, making it difficult to open the map on a non-supporting platform.

### Nanite Stats Command

The command `NaniteStats` adds an overlay of Nanite culling statistics to the top-right of the viewport.

 NaniteStats display on screen.

Command arguments are used to specify what stats Nanite displays on the screen. When no argument is provided, the primary view is used.

Use NaniteStats List to show all available views in the debug output:

- Primary
- VirtualShadowMaps
- ShadowAtlas (only when available)
- CubemapShadows (only when available)

Select a view by entering the command followed by the stat list name you want to view. For example, enter `NaniteStats VirtualShadowMaps`.

For views that use two-pass occlusion culling, the statistics are split into separate buckets for Main and Post pass.

### Resizing the Nanite Streaming Pool Size

Control the amount of memory dedicated to holding Nanite streaming data with the console variable `r.Nanite.Streaming.StreamingPoolSize`. Using larger pools reduces IO and decompression work when moving around the scene but at the cost of a larger memory footprint.

If the pool is not large enough to fit all the data needed for a view, cache thrashing can occur where streaming never settles even for a static view.

To visualize Nanite streaming data, you can use the **Streaming Geometry** show flag, **Show > Nanite > Streaming Geometry**. When disabled, Nanite meshes are only rendered at the quality level that is always resident in memory.

### Setting Maximum Clusters in a Single Pass

You can specify the maximum number of candidate and visible clusters used in a single pass with the console variable `r.Nanite.MaxCandidateClusters` and `r.Nanite.MaxVisibleClusters`. Their values are used for sizing intermediate buffers and their default values have been chosen to work for common rendering scenarios.

There is no mechanism for dynamically resizing either of these buffers, or automatically scaling down quality on overflow, which can result in rendering artifacts from them being too small for scene complexity, and typically manifesting as missing or blinking geometry. When these types of artifacts occur, use NaniteStats to determine conservative bounds for candidates and visible clusters. More specifically, look at the stats for ClustersSW and ClustersHW. The memory cost of a candidate cluster is currently 12 bytes and a visible cluster is 16 bytes.

 This console variable cannot be changed at runtime and must be specified in a configuration (.ini) file.

On this page

- Nanite Fallback Mesh and Precision Settings (-> nanite-technical-details)
- Vertex Precision (-> nanite-technical-details)
- Trimming Mesh Data (-> nanite-technical-details)
- Fallback Mesh (-> nanite-technical-details)
- Fallback Mesh Visualization (-> nanite-technical-details)
- Using Custom Fallback Mesh LODs for Nanite-enabled Meshes (-> nanite-technical-details)
- Data Size (-> nanite-technical-details)
- General Advice on Data Size (-> nanite-technical-details)
- Visualization Modes (-> nanite-technical-details)
- Nanite Culling (-> nanite-technical-details)
- Nanite Ray Tracing Quality Scaling (-> nanite-technical-details)
- Console Variables and Commands (-> nanite-technical-details)
- Nanite Fallback Rendering Modes (-> nanite-technical-details)
- Nanite Stats Command (-> nanite-technical-details)
- Resizing the Nanite Streaming Pool Size (-> nanite-technical-details)
- Setting Maximum Clusters in a Single Pass (-> nanite-technical-details)

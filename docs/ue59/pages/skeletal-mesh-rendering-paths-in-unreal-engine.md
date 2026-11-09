# Skeletal Mesh Rendering Paths

https://dev.epicgames.com/documentation/en-us/unreal-engine/skeletal-mesh-rendering-paths-in-unreal-engine?application_version=5.9

> A high-level overview of the rendering paths available for Skeletal Meshes.

[image: Skeletal Mesh Rendering Paths]

There are several ways that Skeletal Meshes are rendered in Unreal Engine using different paths. In this page, you will learn about these different paths and how to use them in your projects.

## How Skeletal Meshes are Rendered

Skeletal Meshes have three rendering paths:

- GPUSkinVertexFactory (-> skeletal-mesh-rendering-paths-in-unreal-engine)

- Skin Cache System (-> skeletal-mesh-rendering-paths-in-unreal-engine)

- Mesh Deformer with Deformer Graph Plugin (-> skeletal-mesh-rendering-paths-in-unreal-engine)

### Sections and Chunks

Skeletal Meshes are divided in two ways: **Sections** or **Chunks**. Each Section of a Skeletal Mesh is associated with a Material. If the geometry of one Section is too complex — meaning it has too many different bones influencing the section vertices — it's further divided into Chunks by the Geometry Pipeline, which corresponds to the number of draw calls the mesh will create.

When looking at a Skeletal Mesh Asset in the Skeletal Mesh Editor, the **Details** panel can give you a sense of how the mesh's Materials are divided. Under each **LOD** category, expand **Sections** to see the list of Materials and Chunks.

Below are two examples. The first, the most common result, shows a list of Materials (or Sections) for each Skeletal Mesh and its LODs. The second is a more advanced breakdown that shows when a Section (1) has been broken into Chunks (2). Generally speaking, Sections in the Skeletal Mesh Editor map to Materials. At runtime, Sections in rendering code refer to Chunks.

|  |  |
| --- | --- |
| [image: Skeletal Mesh with only Material Sections] | [image: Skeletal Mesh with Material Sections and Chunks] |
| Skeletal Mesh Asset with only Materials Sections | Skeletal Mesh Asset with Sections (1) and Chunks (2) |

### 8-bit and 16-bit Bone Indexes

When importing Skeletal Meshes, they can have either **8-bit** or **16-bit** bone indexes, which sets how many bones a Section can support. An 8-bit bone index supports up to 256 bones per Section where a 16-bit bone index supports anything above 256 bones.

By default, all meshes are imported using an 8-bit bone index. In the **Project Settings** under **Engine > Rendering > Skinning**, check the box for **Support 16-bit Bone Index** to support more bones per section.

 [image: Enable Support 16-bit Bone Index]

When enabling this setting:

- You need to restart the editor for this change to take effect.

- Skeletal Meshes already in your project before this change **must** be re-imported for them to be updated.

- Imported Skeletal Meshes will use 8 or 16-bit depending on whether Sections have up to 256 bones or more.

### Max Bones Per Section

Skeletal Meshes allow a maximum limit of bones per Section for any source mesh being imported. The number of bones allowed per Section is the number of bones that can be skinned on the GPU in a single draw call. If the source mesh exceeds the maximum limit of bones per Section, the Geometry Pipeline divides the Section into smaller Chunks that fit within that limit.

A typical use case for controlling the maximum number of bones per Section is when your project supports both high-end and mobile platforms. You can use the **Project Settings** to set a **Maximum bones per Sections** for all platforms or individual ones in **Engine > Rendering > Skinning**.

By default, the maximum bones per Section is set to 65536. Mobile platforms have a capped maximum of 75 bones per Section.

 [image: Set Maximum bones per Sections]

You can override this setting per-platform by clicking the **Add** (**+**) icon and selecting a platform from the list.

 [image: Add maximum bones per Sections per platform]

The per-platform is clamped to the global setting `Compat.MAX_GPUSKIN_Bones`. By default, it is set to 65536 and should not exceed this value. If 16-bit index mode is not enabled, the limit is clamped to 256 (or an 8-bit bone index).

Use the console command `SkeletalMeshReport` to output a log of stats that breaks down each Skeletal Mesh in the project. The breakdown includes information about their set up and memory usage.

## GPU Skinned Vertex Factory

The **GPU Skinned Vertex Factory** skins positions and normals / tangents using a Vertex Shader, and the results are stored as needed on the GPU. Each Vertex Factory supports both **Default Bone Influences** and **Unlimited Bone Influences** modes.

- **Default Bone Influences** mode controls whether each vertex can be skinned by either 4 or 8 influences (depending on platform support). The number of bone influences is fixed such that if a skeletal mesh is rendered with four bones per vertex and there is a vertex that only uses one bone, the remaining three slots are filled with zero weights and still used for skinning computation. The bone indices and weights are bound to vertex streams, making this mode suitable for low-end hardware and platforms.

- **Unlimited Bone Influences** mode removes the fixed number of bone influences per vertex. This allows a variable number of bone influences to be used instead, which are globally set for the project and per skeletal mesh. Instead of bone indices and weights being bound directly to the vertex streams, each vertex stores an index offset and bone influence count packed into a single integer. This value is used to look into a vertex buffer containing the bone indices and weights data.

### Unlimited Bone Influence Mode

The Unlimited Bone Influence mode is enabled from the **Project Settings** under the **Engine > Rendering > Skinning** section.

 [image: Enable use unlimited bone influences]

There are two settings that must be set:

- **Use Unlimited Bone Influences** enables any newly imported (or re-imported) Skeletal Mesh to use the unlimited bone buffer instead of the default maximum bone influences for rendering. This setting cannot be changed at runtime and requires a restart of the editor when enabled.

- **Unlimited Bone Influences Threshold** uses a fixed bone influence per buffer until the max default bone influence of the mesh exceeds that limit.

While the maximum number of influences per vertex is unlimited, in theory, in practice the maximum number of influences is capped to 12 because of the way Skeletal Mesh source data is stored.

When using this mode, we recommend enabling **Unlimited Bone Influences** and setting the **Unlimited Bone Influences Threshold** to **8**. Skeletal Meshes with bone influences between 9 and 12 are rendered with the Unlimited Bone Influences path, and bone influences between 0 to 8 are rendered with the fixed 4 / 8 bone influences path.

### Setting Bone Influence Limits

There are times when you want to control the number of bone influences. You can do this on a per project and per skeletal mesh basis. By default, bone influences are clamped at 4 and 8 influences with the default mode. The Unlimited Bone Influences mode allows for meshes to have more influences project-wide, while also allowing for skeletal meshes to control the maximum number of influences per level of detail (LOD) for performance and memory reasons.

For example, if you imported a skeletal mesh that has 10 bone influences per vertex and the default mode is used, the number of influences is clamped to 4 and 8 depending on target platform. If Unlimited Bone Influences is enabled, you would get all 10 influences with the option to limit the number of influences further using a skeletal mesh's LOD Build Settings when needed.

You can set the number of bone influences in two places:

- Project Settings under the **Rendering > Skinning** section with **Default Bone Influences Limits**. This sets a global default for the project which can be overridden by individual assets.

 [image: Default Bone Influences Limits setting in Project Settings.]

- Per Skeletal Mesh under the **LOD Build Settings** section with **Bone Influence Limit**. This sets the number of influences per vertex this mesh can have.

 [image: Skeletal Mesh LOD Bone Influence Limit setting.]

When setting up bone influences using the Unlimited Bone Influences mode, consider the following:

- Set a **Default Bone Influence Limit** for the project. When set to **0**, there is no limit applied to bone influences.

- The per skeletal mesh Bone Influence Limit setting falls back to the project setting when it is set to **0**.

- You can specify a project-wide default limit by platform when clicking the **Add** (+) button next to this setting.

- Set a **Bone Influence Limit** per skeletal mesh LOD when needed. When given a number, this will be used to limit the number of bone influences per vertex.

- When set to **0**, the Default Bone Influence Limit project setting will be used.

## Skin Cache System

The **Skin Cache** system skins positions and normals / tangents using a **Compute Shader**, and the results are cached in vertex buffers then passed to `GPUSkinPassThroughVertexFactory` — a variation of `LocalVertexFactory` — for rendering.

 [image: Skin Cache System Buffers flow]

You can enable the Skin Cache system in the **Project Settings** under the **Engine > Rendering > Optimizations** section using the **Support Compute Skin Cache** setting.

 [image: Enable support compute skin cache]

The system provides flexibility to define behavior at the project level and for individual Skeletal Meshes to override its behavior.

Use the following Project Settings to set Skin Cache behavior and support:

- **Default Skin Cache Behavior** controls Skeletal Meshes go through Skin Cache or GPUSkinVertexFactory path. There are two behaviors to choose from: **Inclusive** includes all Skeletal Meshes in Skin Cache by default. Individual Skeletal Meshes can opt out and use the GPUSkinVertexFactory path instead.

- **Exclusive** excludes all Skeletal Meshes from Skin Cache and uses GPUSkinVertexFactory by default. Individual Skeletal Meshes can opt in to use Skin Cache.

- **Maximum memory for Compute Skin Cache per world (MB)** sets the maximum amount of memory (in megabytes) per world / scene allowed for the Compute Skin Cache to generate output vertex data and recompute tangents. Each world has its own Skin Cache object where Skeletal Meshes are inserted into Skin Cache on a first come, first serve basis. The order of insertion is game dependent. If the Skin Cache is full and cannot accommodate another Skeletal Mesh, that mesh instead goes through the GPUSkinVertexFactory path. This can create a situation with level of detail (LOD) when a mesh switches from higher (lower-detailed) LOD to lower (higher-detailed) LOD, Skin Cache unloads the higher LOD but then cannot accommodate the lower LOD due to heavier memory requirements.

You can use the following console commands:

- `r.SkinCache.Mode` sets whether Skin Caching is enabled or disabled. By default, it is enabled (1).

- `r.SkinCache.SkipCompilingGPUSkinVF` reduces GPU Skin Vertex Factory variants by skipping compiling their shader permutations when the Skin Cache system is enabled. **0** Compiles all GPU Skin Vertex Factory variants. (Default)

- **1** Does not compile all GPU Skin Vertex Factory shader permutations.

### Overriding Skin Cache on Skeletal Meshes

Individual Skeletal Mesh LODs can override Skin Cache behavior with the **Skin Cache Usage** dropdown selection.

 [image: Set usage for skin cache usage with a skeletal mesh]

Choose between:

- **Auto:** Uses the global behavior set in the Project Settings for Default Skin Cache Behavior.

- **Disabled:** This mesh will not use the Skin Cache. If Hardware Ray Tracing is enabled on the mesh, it implies Skin Cache is enabled.

- **Enabled:** This mesh will use the Skin Cache.

### Ray Tracing and Hair Strand Skin Cache Rendering Requirements

Rendering features such as Hardware Ray Tracing and Hair Strand rendering (-> hair-rendering-and-simulation-in-unreal-engine) require the Skin Cache path for rendering. However, the Skin Cache path isn't used when a Deformer Graph is used to drive displacement. Ray Tracing and Hair Strand rendering will still work whenever a Deformer Graph is used.

With Hardware Ray Tracing, all Skeletal Meshes automatically go through the Skin Cache path and are rendered into ray tracing effects. You can disable Skeletal Meshes for Hardware Ray Tracing with `r.RayTracing.Geometry.SupportSkeletalMeshes`, which saves GPU memory and time resources. This cannot be changed at runtime.

Meshes also have the option of using a separate ray-traced LOD from a traditional raster LOD. You can control this using a combination of setting the Global Ray Tracing LOD Bias (`r.RayTracing.Geometry.SkeletalMeshes.LODBias`) and the individual Skeletal Mesh setting **Ray Tracing Min LOD**. The higher LOD index is chosen between Raster LOD Index and Global Ray Tracing LOD Index, and the set Ray Tracing Min LOD.

 [image: Set the minimum LOD to be used for Ray Tracing on a Skeletal Mesh]

### Recompute Tangents

**Recompute Tangents** is an optional step of Skin Cache after the skinning pass. Skin Cache recomputes the normals and tangents using the skinned triangles and does so in two compute shader steps:

- A **Triangle Pass** where each triangle computes its normal and tangent from skinned vertex positions and accumulates the result to each of its three vertices.

- A **Vertex Pass** where each vertex normalizes the accumulated normal and tangent. One of the mesh's vertex color buffer channels is optionally used as a blend mask between skinned normals / tangents and recomputed normals / tangents.

You can set recompute tangents globally for the project or per Skeletal Mesh.

**Global Settings:**

- `r.SkinCache.RecomputeTangents` **1** forces recompute tangents on all Skeletal Meshes.

- **2** only recompute tangents on Skeletal Meshes that have enabled them on their Sections. (Default)

**Per Mesh Settings:**

Under the **LOD [n]** category, use the Sections to set how Recompute Tangents is handled for each Material Section.

 [image: Set recompute tangents on a Skeletal Mesh]

Choose from the following:

- **None:** Do not recompute tangents.

- **All:** Recompute tangents for all color channels and use recomputed results.

- **Red / Green / Blue:** Recompute tangents and lerp with skinned results using R/G/B vertex color buffer channel as a blending mask.

One limitation of Recompute Tangents is that each Chunk is processed independently from other Chunks of the mesh. Therefore, the vertices of a Chunk connected with adjacent Chunk(s) have no awareness of their connectivity. As a result, along the borders of two Chunks, there can be visible seams.

### Tips for Debugging Skin Cache

Use the following to debug Skin Caching in your project.

#### Console Commands

- Use `profilegpu` to capture a GPU frame with details of individual Skin Cache entries and the Skeletal Meshes they belong to. [image: Captured GPU Frame details for profiling Skin Cache entries]

- Use `r.SkinCache.PrintMemorySummary` to output a breakdown of the memory usages of all Skin Cache entries. **0** disables the summary. (Default)

- **1** prints the summary on frames when memory exceeds the limit set by `r.SkinCache.SceneMemoryLimitInMB` or **Maximum memory for Compute Skin Cache per world (MB)** in the Project Settings.

- **2** prints the summary every frame.

#### Skin Cache Debug Visualizations

Use the **View Modes** dropdown to one of the debug visualizations from the **GPU Skin Cache** list to visualize individual Skeletal Meshes with colorization..

 [image: Skin Cache debugging visualizations menu]

You can use these visualization modes when launching the project with the `-game` command line argument when entering the console command `r.SkinCache.Visualize` followed by `Overview`, `Memory`, or `RayTracingLODOffset`. Disable the visualization by following the command with `None`. These view modes are disabled in packaged builds.

#### Overview Visualization

The **Overview** visualization shows Actors in the scene which have Skin Cache and Recompute Tangents enabled or disabled.

 [image: Skin Cache Overview debugging visualization.]

The top-left of the viewport displays color reference for the Actors in the scene.

 [image: Skin Cache Overview debugging visualization stats.]

#### Memory Visualization

The **Memory** visualization shows low, mid, and high Skin Cache memory usages for raster and ray tracing combined.

 [image: Skin Cache Memory debugging visualization.]

The top-left of the viewport displays Skin Cache memory information.

 [image: Skin Cache Memory debugging visualization stats.]

You can override the memory threshold per project by editing the values for `GPUSkinCacheVisualizationLowMemoryThresholdInMB` and `GPUSkinCacheVisualizationHighMemoryThresholdInMB` under the `[/Script/Engine.Engine]` section of the **DefaultEngine.ini** configuration file.

#### RayTracingLODOffset Visualization

The **RayTracingLODOffset** visualization shows the LOD index difference between a ray-traced Skin Cache entry and a raster Skin Cache entry, which is useful when ray tracing uses separate LODs from ones used for rasterization.

 [image: Skin Cache RayTracingLOD Offset debugging visualization.]

This visualization mode is only available when Hardware Ray Tracing is enabled in the Project Settings.

The top-left of the viewport displays the color codes for the ray tracing LOD offset for the Actors in the scene.

 [image: Skin Cache RayTracingLOD Offset debugging visualization stats.]

## Deformer Graph Plugin

This feature is currently in Beta.

The **Deformer Graph** plugin is an editor that enables you to construct vertex deformation pipelines that run exclusively on the GPU. It provides graph editing features for plug-and-play and setting up the required data flow to modify mesh vertex points according to some input it receives.

 [image: The Deformer Graph]

- rendering
- lighting
- skeletal mesh

On this page

- How Skeletal Meshes are Rendered (-> skeletal-mesh-rendering-paths-in-unreal-engine)
- Sections and Chunks (-> skeletal-mesh-rendering-paths-in-unreal-engine)
- 8-bit and 16-bit Bone Indexes (-> skeletal-mesh-rendering-paths-in-unreal-engine)
- Max Bones Per Section (-> skeletal-mesh-rendering-paths-in-unreal-engine)
- GPU Skinned Vertex Factory (-> skeletal-mesh-rendering-paths-in-unreal-engine)
- Unlimited Bone Influence Mode (-> skeletal-mesh-rendering-paths-in-unreal-engine)
- Setting Bone Influence Limits (-> skeletal-mesh-rendering-paths-in-unreal-engine)
- Skin Cache System (-> skeletal-mesh-rendering-paths-in-unreal-engine)
- Overriding Skin Cache on Skeletal Meshes (-> skeletal-mesh-rendering-paths-in-unreal-engine)
- Ray Tracing and Hair Strand Skin Cache Rendering Requirements (-> skeletal-mesh-rendering-paths-in-unreal-engine)
- Recompute Tangents (-> skeletal-mesh-rendering-paths-in-unreal-engine)
- Tips for Debugging Skin Cache (-> skeletal-mesh-rendering-paths-in-unreal-engine)
- Console Commands (-> skeletal-mesh-rendering-paths-in-unreal-engine)
- Skin Cache Debug Visualizations (-> skeletal-mesh-rendering-paths-in-unreal-engine)
- Overview Visualization (-> skeletal-mesh-rendering-paths-in-unreal-engine)
- Memory Visualization (-> skeletal-mesh-rendering-paths-in-unreal-engine)
- RayTracingLODOffset Visualization (-> skeletal-mesh-rendering-paths-in-unreal-engine)
- Deformer Graph Plugin (-> skeletal-mesh-rendering-paths-in-unreal-engine)

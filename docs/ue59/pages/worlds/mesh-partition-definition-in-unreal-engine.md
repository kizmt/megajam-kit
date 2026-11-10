# Mesh Partition Definition

https://dev.epicgames.com/documentation/en-us/unreal-engine/mesh-partition-definition-in-unreal-engine?application_version=5.9

> An overview of how to set up a mesh partition definition.

[image: Mesh Partition Definition]

Learn to use this **Experimental** feature, but use caution when shipping with it.

Setting up a new mesh partition requires a few different assets that work together to make the development process more efficient with a higher level of control. Mesh terrain is designed with the idea that a core technical artist or lead will define a number of files like the mesh partition definition data asset, transformer pipeline data assets, material, weight channels, and priority layers. This structure minimizes the number of shader permutations, incompatible layer structures, unnecessary weight channels, and more.

## Naming Conventions and Standards

| Asset | Asset Type | Prefix |
| --- | --- | --- |
| Mesh Partition Definition | Data Asset | MPD_<Name> |
| Mesh Partition Transformer Pipeline | Data Asset | TP_Compiled_<Platform>_<Name>TP_Preview_<Platform>_<Name> |

### Create a Mesh Partition Definition

The mesh partition definition defines numerous core aspects of the mesh terrain including the material, priority layers, and weight channels, among others. You can use the same definition on multiple mesh partitions.

- Create a new **Data Asset** and select the **Mesh Partition Definition** class.
- Name it `MPD_` (`MPD_` is for **M**esh**P**artition**D**efinition).

[image: Create the Mesh Partition Definition data asset]

### Set Up a Mesh Partition Definition

Once created, open the new Mesh Partition Definition data asset. There are 4 main sections:

- Material
- Modifiers
- Build
- Preview

[image: Mesh partition definition sections]

### Mesh Partition Definition - Material

The Material settings are where you can define the materials and associated channels used for your mesh partition definition.

[image: Mesh partition definition Material settings]

| Parameter | Description |
| --- | --- |
| **Material** | This is the material applied to Mesh Partition geometry. |
| **Channel Texel Size** | This controls the resolution of the baked textures for runtime use of the attribute channels (see Channels below). |
| **Physical Material Channels** | This defines the available physical material channels for the mesh partition actor. The physical material channels are a way to map areas with a given attribute data to specific physical materials. |
| **Default Physical Material** | This is the default physical material applied to the mesh partition. |
| **Channels** | This is user defined attributes that are available on the mesh partition geometry. The data in these channels can then be painted or injected from various modifiers or PCG.Modifiers can write channels that are not defined in the definition, however they remain editor only and don't get converted to textures for the runtime compiled sections. These channels remain available for other modifiers that might read them and also to PCG.You can use them for a variety of purposes. For example:Material effectsPCG masksBiomes |

### Mesh Partition Definition - Modifiers

In the **Modifiers** settings, you can find the **Modifier Layer Priorities** which define the order in which modifiers are built.

- Create your desired priority layers here.
- Modifiers assigned to Index[0] will be built first.
- Modifiers assigned to Index[1] will be built second, and so on.
- You can assign several modifiers to a single layer.
- Modifiers have a sub-priority you can use to manually order their effects on a given layer. For more information, see the Modifiers section in the Crafting Mesh Terrain documentation.

[image: Modifier layer priorities]

### Mesh Partition Definition - Build

You can use the **Build **settings to set up the geometry generation of compiled sections for various platforms. Compiled sections are serialized for runtime.

[image: Mesh partition Build settings] Here is an example with HighEnd, LowEnd and Common build variants. HighEnd and LowEnd both contain static mesh transformers set for appropriate quality levels. The Common build variant contains a collision transformer meant to share the same collisions among all platforms. The default platform uses HighEnd and Common build variants. The low end platform uses LowEnd and Common build variants.

Here is what you can find in the build section:

| Compiled Sections Build Variants |  |
| --- | --- |
| **Name** | Name of the build variant |
| **Max Section Complexity** | Maximum vertex count for a section |
| **Transformer Pipeline** | Select a transformer pipeline data asset here. Refer to the Transformer Pipeline section below for more details. |
| Platforms - Per Platform Runtime Settings |  |
| Default |  |
| **Build Variant Names** | Select a build variant defined in the Compiled Section Build Variants settings as the default build variant, which is the variant used when the cooked platform name isn't matching any defined platform entry below. |
| Per Platform |  |
| **Name** | Give a name to this platform element. |
| **Build Variant Names** | Select a build variant defined in the Compiled Section Build Variants above as the build variant assigned to this platform. |

#### Mesh Partition Definition - Preview

Preview sections are for the editor only and are decoupled from compiled sections used at runtime. Preview sections are optimized for build time, invalidation, and iteration. Compiled sections are optimized for rendering for the target platform.

[image: Mesh partition Preview settings]

Here is what you can find in the preview section:

|  |  |
| --- | --- |
| **Max Section Complexity** | Maximum vertex count for a section. |
| **Transformer Pipeline** | Select a transformer pipeline data asset here. Refer to the Transformer Pipeline section below for more details. |

### Transformer Pipelines

Transformer pipelines are data assets that provide a way to create and configure various features for the preview sections and compiled sections.

They provide for a user-programmable pipeline which defines what happens after the mesh data is built for a mesh partition and how that transforms into persistent data (actors and components).

Because the transformer pipeline is a separate asset from the mesh partition definition, it is convenient to reuse project or platform defined configurations quickly on different mesh partition definitions.

To create a transformer pipeline asset, create a new data asset and select the **Transformer Pipeline** class.

[image: Select Transformer Pipeline data asset class]

Inside of your transformer pipeline data asset you can then add various transformers.

The types of transformers available are:

- Collision Transformer
- Far Field Transformer
- RVT Transformer (RVT = Runtime Virtual Texture)
- Skirt Transformer
- Static Mesh Transformer
- Subsection Transformer
- WP Actor Properties Transformer (WP = World Partition)

[image: Transformer pipeline options] Transformer pipeline example used for preview sections.

#### Collision Transformer

The Collision Transformer enables and defines the generation of collision geometry which is decoupled from the visual mesh.

If you need to simplify the collision geometry, adjust the Error Tolerance setting.

[image: Collision transformer settings]

#### Far Field Transformer

The **Far Field** Transformer enables and defines a special mesh generation which is used for Lumen’s internal representation for far field.

[image: Far Field transformer settings]

|  |  |
| --- | --- |
| **Far Field Mesh Edge Length** | This is the target edge length for the generated far field mesh. |

#### RVT Transformer

The **RVT T**ransformer controls the availability of runtime virtual textures (RVT) for the mesh partition.

[image: RVT transformer settings]

#### Static Mesh Transformer

The **Static Mesh** Transformer enables and defines the static mesh component of the compiled and preview sections. It makes it possible to set up LODs and enables Nanite.

The Static Mesh Transformer also has the option to add skirts to the geometry to prevent seams or cracks in some situation.

[image: Mesh partition skirts side view] Mesh partition skirts in between sections from a side view.

#### Subsection Transformer

The **Subsection T**ransformer subdivides sections into small components.

[image: Subsection transformer settings]

|  |  |
| --- | --- |
| **Sub Section Size** | Represents the target vertex count for each sub section. |

The index of the subsection transformer in the stack is important and affects the following transformers (with higher index).

[image: Subsection transformer index]

#### WP Actor Properties Transformer

The **WP Actor Properties** Transformer controls the world partition runtime grid, data layer assignment, and HLOD layer of the mesh partition.

[image: WP Actor Properties transformer settings]

## Authoring Static Mesh Transformer Simplification Settings

The Static Mesh Transformer builds a static mesh per partition unit and, for each LOD slot, runs an attribute-aware simplifier on a copy of the source geometry. `FMeshPartitionTransformerSimplificationSettings` is the per-LOD authoring surface for that simplifier. This section guides you through the `Mode` selector, then through `ScreenSize` and `PixelError`, and ends with a worked example for each LOD strategy.

### Workflow Overview

| You want to author… | Set Mode to |  |  |
| --- | --- | --- | --- |
| Geometric error budget per LOD (cm of deviation) | Derive ScreenSize from Error | `ErrorTolerance`, `PixelError` | `ScreenSize`(post-simplify, from actual deviation) |
| Distance / on-screen size at which each LOD activates | Derive Target ErrorTolerance from ScreenSize | `ScreenSize`, `PixelError` | `ErrorTolerance` |
| A simple knob for keeping a fixed fraction of the triangles | TriangleCount from ScreenSize | `ScreenSize` (= retention fraction) | `MaxTrianglesFraction `(`ErrorTolerance `is unused) |
| Full manual control | Custom | All fields | Nothing |

Pick **Custom** only when you need to defeat the auto-pairing. The three Auto modes exist precisely because pairing the driver and derived values is difficult to get right by hand.

### How the Three Modes Relate

The simplifier operates on three independent levers:

- `ErrorTolerance` - World-space geometric deviation budget (cm in UE units). Stops collapsing edges once the simplified surface would deviate from the original by more than this.
- `MaxTrianglesFraction` / `MinTrianglesFraction` - Fractional retention bounds, used as caps (or, when ErrorTolerance is not positive, as a target).
- `ScreenSize` - The on-screen projected diameter at which the runtime decides this LOD is the coarsest one still acceptable. Smaller LOD corresponds to smaller screen size; values must monotonically decrease.

`PixelError` is the **conversion factor** between `ErrorTolerance` and `ScreenSize`. Conceptually, it's how many pixels of geometric error you are willing to see at the camera distance where this LOD activates.

Internally the conversion uses a fixed reference projection (1920×1080, HFOV 90°, matching the engine Static Mesh Editor behavior). It mirrors the standard auto-LOD path, so an `ErrorTolerance` - `ScreenSize` pair derived through these modes is consistent with how the static mesh runtime selects LODs. `PixelError = 8` is a sensible default for opaque-rendered terrain or architectural meshes.

For adjustments, you can:

- Increase it (for example 16) for backgrounds/skirts where the LOD can pop closer.
- Lower it (for example 2–4) for hero meshes where deviation must remain imperceptible until the LOD is very small on screen.

### Mode Examples

#### Derive ScreenSize from Error

Use this mode when you can express each LOD as a maximum deviation from the source (for example, no more than X cm) and you'd like the LOD's activation screen size to follow from how that error projects on screen.

You author:

- `ErrorTolerance` - Increase per LOD as you go coarser (for example, LOD0 = 0.5cm, LOD1 = 2cm, LOD2 = 8cm).
- `PixelError` - Keep consistent across LODs of the same mesh.
- `MinTrianglesFraction` / `MaxTrianglesFraction` - Guardrails. `MinTrianglesFraction` keeps very flat meshes from being decimated to a triangle. `MaxTrianglesFraction` forces at least some reduction even if the error budget would allow keeping everything.

You do not need to author `ScreenSize`. The transformer measures the achieved symmetric Hausdorff deviation post-simplification and projects it through `PixelError` to a screen size, and writes that to the LOD source model. This is the recommended default for terrain and blockout LODs, because error tolerance is an intuitive measure — it is a length — and you do not have to also reason about how the resulting deviation will look on screen.

Tuning loop:

- Set `ErrorTolerance` per LOD, leaving `ScreenSize = 0`.
- Build, then check the log: Config ```
Static mesh transformer LOD2 simplified: 12345 -> 1234 tris (10.0% retained), ErrorTolerance=2.000000, achieved MaxDeviation symmetric=1.872 one-sided=1.640Static mesh transformer: LOD2 ScreenSize=0.142 (source: auto, ...)
``` Static mesh transformer LOD2 simplified: 12345 -> 1234 tris (10.0% retained), ErrorTolerance=2.000000, achieved MaxDeviation symmetric=1.872 one-sided=1.640Static mesh transformer: LOD2 ScreenSize=0.142 (source: auto, ...)If the LOD pops too late or early, change `PixelError` (not `ErrorTolerance`) - that re-maps the same geometry to a different activation distance without re-running the simplifier.
- If the achieved deviation is much smaller than the budget, the triangle-fraction cap is binding. Raise `MaxTrianglesFraction` to let the simplifier ride the error budget instead.

#### Derive Target ErrorTolerance from ScreenSize

Use this mode when you know a LOD should activate at roughly a set fraction of the screen diameter (for example, 30%) and you want the error tolerance computed from that target.

You author:

- `ScreenSize` - Must monotonically decrease across LODs (for example, LOD0 = 1.0, LOD1 = 0.5, LOD2 = 0.25, LOD3 = 0.1).
- `PixelError` - Same consistency advice as above.
- `MinTrianglesFraction` / `MaxTrianglesFraction` - Same guardrail role.

The engine derives `ErrorTolerance` from `ScreenSize * PixelError * bounds radius`; the field is greyed out.

An example edge case: if you leave `ScreenSize` at 0, the transformer falls back to the geometric default `pow(0.75, LODIndex)` (1.0, 0.75, 0.5625, etc.) so the simplifier still has a target to aim at. The same fallback is then echoed back to the LOD's activation screen size, so the LOD activates at the size it was simplified for. This means you can leave the slot blank and still get sane behavior, but explicit values are clearer.

#### TriangleCount from ScreenSize

Use this mode when you do not trust the geometric error metric and want a plain triangle-budget control.

You author:

- `ScreenSize` only. The value is reinterpreted as a retained fraction of triangles, clamped to [0, 1]. For example, `ScreenSize = 0.25` retains 25% of the triangles.

The engine sets `ErrorTolerance = 0` (so the error budget never stops collapses), and `MaxTrianglesFraction = ScreenSize` (so retention is the binding criterion). `PixelError` is unused.

In this mode, `ScreenSize` serves two purposes: it drives both the simplifier's retention-fraction target and the LOD's activation screen size. That is intentional — the simplification level scales with the LOD's on-screen footprint — but it means you cannot independently target, for example, an LOD2 activation of 0.3 screen size with 10% triangles. Pick one of the other modes for that.

#### Custom

All fields are editable. Use this mode only when you need to break the pairing between `ErrorTolerance` and `ScreenSize` (for example, tuning the simplifier for one set of constraints while explicitly choosing an LOD activation size that does not follow from the achieved deviation). If you find yourself using Custom for the common case, you probably want one of the Auto modes instead.

### A Worked LOD Chain (Four LODs, Terrain-Style Mesh)

 C++

```
LOD0 — bReduceMesh = false (source geometry, ScreenSize defaults to 1.0), or use a conservative ErrorTolerance to get simplification in flat areas for free.

LOD1
  Mode            = Derive ScreenSize from Error
  ErrorTolerance  = 4.0
  PixelError      = 8
  MaxTrianglesFraction = 0.5     // force at least 2× reduction
  MinTrianglesFraction = 0.05

LOD2
```

LOD0 — bReduceMesh = false (source geometry, ScreenSize defaults to 1.0), or use a conservative ErrorTolerance to get simplification in flat areas for free.

LOD1
 Mode = Derive ScreenSize from Error
 ErrorTolerance = 4.0
 PixelError = 8
 MaxTrianglesFraction = 0.5 // force at least 2× reduction
 MinTrianglesFraction = 0.05

LOD2

LOD0 is the source. LOD1 and LOD2 author error budgets and let the activation screen size fall out of the achieved deviation. LOD3 drops to the cheap retention-only mode for the smallest, far-distance LOD where the error metric isn't worth tuning.

### Other Fields

- `EdgeLength` - Caps the maximum edge length of any retained edge. Useful when later passes (lighting, UVs) need a minimum tessellation density.
- `ScaleCorrection` - The attribute weighting are set to defaults for prop-scale assets. This scaling factor accounts for the larger scale of terrains and accordingly upweights the attributes. Decrease toward smaller scale meshes if you see attribute artifacts.
- `MeshRegularization` - Small positive value; increase if flat regions are getting noisy collapses.
- `Simplification|Advanced` Weights - Leave at defaults unless a specific attribute (normals, UVs, colors, weight layers) is visibly degrading. The weights re-balance the attribute-aware quadric. Raising one preserves that attribute better at the expense of geometry.

### Diagnosing the result

Every LOD logs to `LogMegaMeshEditor` after build, for example:

 C++

```
LOD1 simplified: 240000 -> 60012 tris (25.0% retained), ErrorTolerance=1.000000, achieved MaxDeviation symmetric=0.974 one-sided=0.812LOD1 ScreenSize=0.512 (source: auto, calculated (from actual geometric deviation and PixelError): 0.512)
```

LOD1 simplified: 240000 -> 60012 tris (25.0% retained), ErrorTolerance=1.000000, achieved MaxDeviation symmetric=0.974 one-sided=0.812LOD1 ScreenSize=0.512 (source: auto, calculated (from actual geometric deviation and PixelError): 0.512)

- `Achieved MaxDeviation` much smaller than `ErrorTolerance `- A triangle-fraction cap was binding. Raise `MaxTrianglesFraction ` or lower `MinTrianglesFraction`.
- `Achieved MaxDeviation` much larger than `ErrorTolerance`- `MaxTrianglesFraction `is forcing collapses past the budget. Either accept it (you've explicitly bounded triangle count) or raise `MaxTrianglesFraction`.
- Symmetric much larger than one-sided - A feature was dropped entirely on one side. Check the attribute weights or lower the LOD's reduction aggressiveness.
- `Source: manual` in the ScreenSize log when you expected `auto ` - A stale `ScreenSize` is set and your mode does not override it. Either clear it or switch to `AutoScreenSizeFromError`.

## Building Mesh Partition Runtime Sections

Once your mesh partition definition build variants are set up, you can manually build the compiled sections from the Build menu / Build Mesh Partition option.

[image: Build menu Build Mesh Partition options]

### Showing Mesh Partition Compiled Sections

The base and compiled sections are hidden by default in the outliner.You can display them from the outliner filter menu and toggling ON:

- Show Mesh Partition Bases
- Show Build Mesh Partition Sections

The sections are then displayed under your Mesh Partition actor.

[image: Base and compiled sections under the mesh partition actor]

- landscape
- mesh terrain

On this page

- Naming Conventions and Standards (-> mesh-partition-definition-in-unreal-engine)
- Create a Mesh Partition Definition (-> mesh-partition-definition-in-unreal-engine)
- Set Up a Mesh Partition Definition (-> mesh-partition-definition-in-unreal-engine)
- Mesh Partition Definition - Material (-> mesh-partition-definition-in-unreal-engine)
- Mesh Partition Definition - Modifiers (-> mesh-partition-definition-in-unreal-engine)
- Mesh Partition Definition - Build (-> mesh-partition-definition-in-unreal-engine)
- Mesh Partition Definition - Preview (-> mesh-partition-definition-in-unreal-engine)
- Transformer Pipelines (-> mesh-partition-definition-in-unreal-engine)
- Collision Transformer (-> mesh-partition-definition-in-unreal-engine)
- Far Field Transformer (-> mesh-partition-definition-in-unreal-engine)
- RVT Transformer (-> mesh-partition-definition-in-unreal-engine)
- Static Mesh Transformer (-> mesh-partition-definition-in-unreal-engine)
- Subsection Transformer (-> mesh-partition-definition-in-unreal-engine)
- WP Actor Properties Transformer (-> mesh-partition-definition-in-unreal-engine)
- Authoring Static Mesh Transformer Simplification Settings (-> mesh-partition-definition-in-unreal-engine)
- Workflow Overview (-> mesh-partition-definition-in-unreal-engine)
- How the Three Modes Relate (-> mesh-partition-definition-in-unreal-engine)
- Mode Examples (-> mesh-partition-definition-in-unreal-engine)
- Derive ScreenSize from Error (-> mesh-partition-definition-in-unreal-engine)
- Derive Target ErrorTolerance from ScreenSize (-> mesh-partition-definition-in-unreal-engine)
- TriangleCount from ScreenSize (-> mesh-partition-definition-in-unreal-engine)
- Custom (-> mesh-partition-definition-in-unreal-engine)
- A Worked LOD Chain (Four LODs, Terrain-Style Mesh) (-> mesh-partition-definition-in-unreal-engine)
- Other Fields (-> mesh-partition-definition-in-unreal-engine)
- Diagnosing the result (-> mesh-partition-definition-in-unreal-engine)
- Building Mesh Partition Runtime Sections (-> mesh-partition-definition-in-unreal-engine)
- Showing Mesh Partition Compiled Sections (-> mesh-partition-definition-in-unreal-engine)

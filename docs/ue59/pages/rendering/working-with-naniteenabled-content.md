# Working with Nanite-Enabled Content

https://dev.epicgames.com/documentation/en-us/unreal-engine/working-with-naniteenabled-content?application_version=5.9

> Some examples and use cases of how to work with Nanite content in your projects.

In most cases, Nanite scales extremely well within screen resolution. It does so based on two techniques: fine-grained level of detail and occlusion culling. Typically, this means, regardless of the geometric complexity of the source data in the scene, the number of triangles Nanite attempts to actually draw to the screen is consistent and proportional to the number of pixels.

Nanite follows the design principle that there is no use in drawing far more triangles than there are pixels.

However, there are some cases of content that break the techniques Nanite uses to scale, but this doesn't mean it should not be used at all for this content, or that it will not render faster than the traditional rendering pipeline. It only means that for this type of content, scaling with pixels — and not scene complexity — no longer applies to them. Use the Profiling features provided by Unreal Engine to monitor these types of situations when they occur.

## Aggregate Geometry

Aggregate geometry is geometry that has many disjointed parts that become a volume in the distance, such as hair, leaves on trees, and grass. This type of geometry breaks Nanite's level of detail and occlusion culling techniques. Nanite is inherently a hierarchical level of detail structure that relies on being able to simplify small triangles into larger triangles and choosing the coarser one when it determines the difference is smaller than can be perceived. For continuous surfaces, this works well, but not for aggregate geometry that from a distance appears more like a partially opaque cloud than a solid surface. As such, Nanite is more likely to determine it cannot reduce aggregate geometry nearly as aggressively as it would typical solid surfaces, thus resulting in drawing more triangles for the same number of pixels covered.

Another optimization that aggregate geometry breaks is Occlusion Culling. Although it is very fine-grained, its granularity is not per-pixel. Geometry that is filled with holes — and worse yet, layers upon layers of geometry filled with holes — causes excessive overdraw because many depth layers need to build up before that area on the screen will block anything behind it. One way to think about this is to consider an 8x8 pixel region on screen and how many depth layers need to be drawn before every pixel is filled. Excessive overdraw means that for the same number of pixels covered, Nanite attempts to draw more triangles causing it to render slower.

Foliage is the most obvious case for causing problems with occlusion culling, but even then, it does not mean that Nanite should not be used on foliage-type meshes at all. Refer to the Foliage Using Nanite (-> nanite-virtualized-geometry-in-unreal-engine) section below for more. It is good to experiment with different use cases and see what works well for your projects. Use profiling tools to confirm good performance from Nanite with these types of meshes.

## Closely Stacked Surfaces

Occlusion culling with traditional meshes makes kitbashing workflows nearly impossible on a large scale due to practical limitations. The fine-grained nature of occlusion culling with Nanite makes it possible to use these types of workflows during development with less concern. As is explained in the Aggregate Geometry section above, overdraw can come from hidden surfaces being very close to visible surfaces below them. If any geometry is buried well below the visible surface, Nanite detects and culls it fairly cheaply, such that it can mostly be considered free of cost. However, when there is stacked geometry that is close together near the top-most surface, Nanite is not able to determine which is on top or bottom, causing both to be drawn simultaneously.

This particular issue with culling is a worst-case scenario where Nanite does not know which surface is on top and just draws all the layers instead. Imprecision like this scales with screen size and distance, so while 10 centimeters may separate layers and look fine while close to the surface, farther distances away can cause the difference in distance to be smaller than a pixel, resulting in overdraw.

|  |  |
| --- | --- |
|  |  |
| Game View | Nanite Visualization showing many instances of closely stacked together meshes. |

In the example below, if the camera is moved to look down at the area where the character is standing, the Nanite Overdraw visualization shows how these stacked surfaces are being rendered. Brighter areas indicate more overdraw is happening in those areas than others.

The Overdraw visualization is the most effective way to find issues of overdraw. While you should expect some amount of overdraw, excessive amounts result in higher Nanite culling and rasterization costs, and Nanite's scaling independently of scene complexity becomes less effective in the process.

## Faceted and Hard-edge Normals

Be mindful when importing highly detailed meshes that have faceted normals, meaning that the normal between two different polygons was not smoothed. This issue is common and easy to miss, and you should take caution to avoid this particular issue because low amounts of vertex sharing in a mesh can become significantly more expensive both in rendering performance and data size. Ideally, the number of vertices for a mesh should be less than the number of triangles it has. If the ratio is 2:1 or higher, then there is likely a problem, especially if this results in a high triangle count. Having a ratio of 3:1 means the mesh is completely faceted where every triangle has its own three vertices, none of which are shared with another triangle. Most often, this is caused by the normals not being the same because they are not smoothed.

With that in mind, more vertices means more data to store. It also means more vertex transform work, and ratios higher than 2:1 fall down some slow rendering paths. Intentional use in hard surface modeling shouldn't cause any issues, and there is no reason not to use them. However, accidental 100% facet very dense meshes are far more expensive than intended. Another issue to watch out for is imported normals on dense organic-type surfaces generated in other DCC packages that have hard normal thresholds that might be sensible on lower polygon meshes, but can add unnecessary expense with Nanite.

For example, In the two meshes below, the mesh on the left has faceted normals while the one on the right has smoothed normals. When comparing these using the Nanite Triangles visualization, there are noticeable differences in the number of triangles used by Nanite to draw them. The faceted one on the left draws significantly more triangles than the smoothed one on the right.

|  |  |
| --- | --- |
|  |  |
| Nanite-enabled meshes with faceted (left) and smoothed (right) normals | Nanite Triangle Visualization of Nanite-enabled meshes with faceted (left) and smoothed (right) normals |

## Nanite Skeletal Mesh

Nanite Skeletal Meshes include support for:

- A new Skeletal Mesh API simplifies rendering them.
- One draw call for an entire mesh.
- Shadowing from virtual shadow maps.
- No geometry LODs; Nanite skeletal meshes use animation LODs.
- Instancing with animation banks.

## Foliage Using Nanite

Foliage using Nanite is considered Beta and is being actively researched and developed. This section provides some guidance on using foliage geometry with Nanite, but is not the Nanite Foliage feature set.

For assets like trees with default Nanite settings you might find that the canopies tend to thin out with distance. These cases are a particular form of Aggregate Geometry (-> nanite-virtualized-geometry-in-unreal-engine) where each disjoint part (a leaf or grass blade) has open edges at its boundary. Enabling Preserve Area is useful to prevent this thinning out when Nanite is enabled. When Nanite simplifies the geometry in the distance by reducing the number of triangles, it eventually needs to start removing some of these disjoint elements completely. Without Nanite having more information the result will look thinned out because there was major surface area loss. Preserve Area will redistribute that lost area to the remaining triangles by dilating out the open boundary edges. Dilation for symmetric shapes like leaves has the same effect as scaling them up. In non-symmetric cases like ribbons, for example, blades of grass, it has the effect of thickening them.

We recommend using Preserve Area for all foliage meshes, but not for meshes that are not intended to be used as scene foliage.

 [image: Without Preserve Area enabled.]

 [image: With Preserve Area enabled.]

The Nanite Cluster visualization provides a clearer look at how the Preserve Area setting redistributes lost area.

 [image: Nanite Cluster Visualization without Preserve Area enabled.]

 [image: Nanite Cluster Visualization with Preserve Area enabled.]

Below are some recommendations when using and authoring foliage assets with Nanite in mind. We are still experimenting and learning ourselves what are the best approaches. So far, we have seen that foliage using Nanite should be authored differently than before, but if you play to its strengths, you can get faster, higher-quality results using Nanite.

- Use Preserve Area (enabled in the Static Mesh editor).
- Use geometry instead of masked cards.Masked materials are fairly expensive compared to Opaque ones. The fastest results are likely obtained by not using them at all.
- The traditional card approach (many elements are represented with a single card) with Nanite can be slower than non-Nanite. Do not expect that enabling Nanite on card-based foliage will always be a performance improvement.
- Masked-out pixels cost nearly as much as drawn pixels.
- Geometry foliage has shown to be faster with Nanite than card approaches, both Nanite cards and non-Nanite cards. It also looks better.The Megascans: Grass pack on Fab offers good examples for testing. The pack offers both masked and high-poly geometry where each element is independent and masked low-poly cards where many elements are represented by a single card.

- When using World Position Offset (WPO), more vertices equal higher cost. WPO logic must be limited and monitored.
- The issues explained in the Aggregate Geometry (-> nanite-virtualized-geometry-in-unreal-engine) section of this page still apply. Dense forests (like the examples above) will render much slower than the same scene with all meshes replaced with solid shapes of the same triangle count.

## Using Max World Position Offset Displacement with Nanite

In your materials and material instances, you can use the **Max World Position Offset Displacement** setting to set an upper limit to the amount of offset WPO can have. This can be especially useful for Nanite meshes because they are split into smaller clusters whereby each of those clusters have their own individual bounds and are culled individually on the GPU. Clamping WPO is a good way to manage this.

You can find the Max World Position Offset Displacement setting under the material's **Details > World Position Offset** category, or under Material Property Overrides in a material instance.

For details, see Material Properties (-> unreal-engine-material-properties).

## Nanite Static Displacement Mapping

This feature of Nanite is experimental.

The Static Mesh editor includes an option to add detail to Nanite-enabled meshes through an offline adaptive tessellator. The tessellator generates an optimized Nanite mesh using displacement maps baked into it. This texture-driven approach is non-destructive and gives you control over the amount of tessellation and displacement through scalar parameters.

In the Details panel under Nanite Settings, do the following:

- Set the Trim Relative Error to a value other than 0 to control the amount of tessellation.A good default is 0.04, but you should keep it above 0.02. This value targets an error level when tessellating the mesh. Going too small will simply use a lot of triangles and inflate build times.

- Add Displacement Maps.
- Expand the Index element and add a Texture to use for displacement.If your mesh has more than one material slot, each Displacement Maps index is mapped to the corresponding material slot. For example, Material Slot 0 maps to Displacement Maps Index 0, Material Slot 1 maps to Index 1, and so on.

- Set a Magnitude to control the amount of displacement.
- Click Apply Changes.

## Nanite Tessellation

This feature of Nanite is experimental.

Nanite tessellation is dynamic programmable displacement that provides a way to modify Nanite meshes at runtime using a displacement map or procedural material. Unlike World Position Offset which can only operate on the original mesh vertices, Nanite displacement tessellates the mesh at runtime into additional triangles to conform to the detail of the displacement map. Only as much triangle detail as required for the current pixel density is generated.

The benefits of Nanite tessellation include:

- Using source meshes that include less detail in the authoring pipeline.
- Material-driven and animated displacement.
- Creating detailed Nanite landscapes.

|  |  |
| --- | --- |
|  |  |
| With Nanite Tessellation | Without Nanite Tessellation |

To enable Nanite tessellation, you need to set the following console variables in the **ConsoleVariables.ini** or your project’s .ini configuration files:

 Config

```
// This is read-only and must be set in the config file for the project.
r.Nanite.AllowTessellation=1

// This can be dynamically toggled at runtime.
r.Nanite.Tessellation=1
```

// This is read-only and must be set in the config file for the project.
r.Nanite.AllowTessellation=1

// This can be dynamically toggled at runtime.
r.Nanite.Tessellation=1

Once these variables are set, you can set up tessellation using the Material editor by following these steps:

- Select the main material node.
- In the Details panel under the Nanite settings, check the box for Enable Tessellation.
- Connect a Texture Sample to the Displacement input on the main material node.

 The Displacement input value range is 0-1.

There are two settings to configure when using tessellation in a material:

- Magnitude: This is the height of the displacement measured from min to max that the Displacement pin’s 0-1 range maps to. It also dictates the bounds that are used for culling, so only set this as large as is necessary. This value has a significant impact on performance and can have other unintended effects. For more information, see the “Things to know” section below.

- Center: This specifies what displacement value corresponds to no change from the base mesh. So if mid gray is the center and you want equal displacement both in and out of the mesh, use 0.5. If you want to only push outwards, set this to 0.

Additionally, in a material, you can optimize Nanite Tessellation with Displacement Fade enabled in the Details panel. It has two settings:

- Start Fade Size (Pixels): How large the max displacement is, in on-screen pixels, when beginning to fade out displacement. This value must be a larger number than the End Fade Size value.
- End Fade Size (Pixels): How large the max displacement is, in on-screen pixels, when fading out completes, and displacement is disabled. This value must be smaller than the Start Fade Size.

Things to know:

- Only works on Nanite meshes. Tessellation and displacement are ignored on non-Nanite meshes or in cases where Nanite isn’t supported.
- Displacement doesn’t change shading (unlike offline renderers). You need to supply a corresponding normal map or derive a normal from the displacement derivatives. For the sake of quality and compression, we recommend having an additional normal map.
- Scalar displacement only. Vector displacement is not currently supported.
- Displacement is along the unnormalized interpolated vertex normal. There is no option currently to control the displacement direction in the shader as it is always along the normal.
- Displacement is in local space, and is before any sort of object scale. That means the displacement Magnitude specified in the material is in object space units before the scaling of the mesh. This is often what you want but may not be. For example, in cases where you want a tiling brick on a cube you scaled to be a wall. We will likely add an option for world space in the future to address these cases.
- Tessellation and displacement works on Landscape as well, so long as Nanite has been generated for it. Unfortunately, the meshes Landscape generates have a significant scale automatically applied to them so be sure to use much smaller Magnitude for Landscape materials, we recommend 64x smaller. This will likely be addressed in the future using the option mentioned in the previous point.
- Keep the Magnitude setting’s value as small as is necessary. Instead, try to use the entire 0-1 range of the Displacement output. Don’t set the Magnitude to 100 and then scale down the value you plug into the Displacement output to compensate. The reason for this is because the Magnitude value is used to bound patches for culling. If the Magnitude is large it can have serious impacts on performance, especially with virtual shadow maps.
- There is currently no solution for crack-free displacement. This means that UV seams, hard edge normals, or any vertex attribute affecting the displacement that isn’t smooth will cause cracks.
- Tessellation can be combined with World Position Offset. WPO in this case is applied to the base mesh vertices before tessellation. Displacement, like always, applies to the diced triangle vertices after tessellation.
- Tessellation is not compatible with Pixel Depth Offset. PDO is ignored if tessellation is enabled.
- Tessellation can be combined with Opacity Mask but for performance reasons the masking is done at diced triangle rate, not per pixel. For most use cases this should be fine but will not work well with dithering since that needs to be per pixel.
- It’s possible for texture compression artifacts to be obvious for displacement maps and appear like staircase stepping. Texture compression setting Alpha, which uses BC4, works decently in many cases. Stored in the alpha of an RGBA with Default/DXT5/BC3 should get similar results. Sometimes uncompressed may be required but floating point is likely overkill. Channel packing, especially packing height with normals, with any compressed format will likely show artifacts. This may run counter to prior experience when heightmaps were used for other purposes.
- Displacement is relative to the flat triangles of the base mesh. That means it does not start from a curved surface like PN triangles or Catmull-Clark subdivision surfaces. Tessellation doesn’t inherently smooth the surface.

## Nanite Splines

Spline meshes are used for deforming meshes along the shape of a spline, such as roads and paths over a landscape terrain. Nanite-enabled meshes support splines by default and you can create them as Landscape Splines (-> landscape-splines-in-unreal-engine) and Blueprint Splines (-> blueprint-splines-in-unreal-engine).

Example scene with Nanite mesh in foreground and Nanite Spline. This scene shows the Lit and Nanite Triangles visualization.

Nanite spline meshes can have visual issues. One such is that when creating a spline mesh with a Nanite-enabled static mesh, it is possible for the spline mesh to drop to a lower resolution as the camera travels away from it. This happens because Nanite doesn’t take into account deformation of spline meshes when generating its lower level of detail (LOD). As a result, simplifications that are unnoticeable at a given distance when not deformed can become obvious when stretched along a spline curve.

You can mitigate this deformation issue with the Max Edge Length Factor setting found in the Static Mesh editor under Nanite Settings in the Details panel. This parameter mitigates this issue by forcing Nanite to keep enough detail to maintain a desired amount of distance between vertices of the mesh on screen, preventing the mesh from rendering below some threshold of vertex density.

The default Max Edge Length Factor is 0. This indicates that the edge length will not be considered for this mesh. Values greater than 0 represent a desired distance between any two connected vertices in screen space. More specifically, this distance is represented as a multiple of the smallest desired Nanite triangle edge (as configured by` r.Nanite.MaxPixelsPerEdge`).

### Upgrading to Nanite Splines from a Previous Engine Version

For projects made with Unreal Engine 5.3 and earlier, spline mesh components that used Nanite-enabled static meshes would previously render fallback meshes generated from the Nanite mesh as ordinary static meshes. Because rendering splines with Nanite is now enabled by default in Unreal Engine 5.4 and later, these meshes now render as Nanite, which can result in visual differences.

To retain the previous behavior of having the fallback mesh render as the spline mesh, you can set `r.SplineMesh.RenderNanite` to 0.

On this page

- Aggregate Geometry (-> working-with-naniteenabled-content)
- Closely Stacked Surfaces (-> working-with-naniteenabled-content)
- Faceted and Hard-edge Normals (-> working-with-naniteenabled-content)
- Nanite Skeletal Mesh (-> working-with-naniteenabled-content)
- Foliage Using Nanite (-> working-with-naniteenabled-content)
- Using Max World Position Offset Displacement with Nanite (-> working-with-naniteenabled-content)
- Nanite Static Displacement Mapping (-> working-with-naniteenabled-content)
- Nanite Tessellation (-> working-with-naniteenabled-content)
- Nanite Splines (-> working-with-naniteenabled-content)
- Upgrading to Nanite Splines from a Previous Engine Version (-> working-with-naniteenabled-content)

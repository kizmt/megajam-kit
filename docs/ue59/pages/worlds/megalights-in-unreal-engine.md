# MegaLights

https://dev.epicgames.com/documentation/en-us/unreal-engine/megalights-in-unreal-engine?application_version=5.9

> A whole new direct lighting path to place many dynamic and shadowed area lights in a scene.

[image: MegaLights]

MegaLights is a whole new direct lighting path in Unreal Engine 5 enabling artists to place orders of magnitudes more dynamic and shadowed area lights than they could ever before.

MegaLights is designed to support current generation consoles and leverages ray tracing to enable realistic soft shadows from various types of area lights.

MegaLights not only reduces the cost of dynamic shadowing, it also reduces the cost of unshadowed light evaluation, making it possible to use expensive light sources, such as textured area lights, on consoles.

MegaLights also supports Volumetric Fog (-> volumetric-fog-in-unreal-engine) and translucency.

## Using MegaLights

You can enable MegaLights for your project from the Project Settings in the **Rendering > Direct Lighting** category. This prompts you to also enable **Support Hardware Ray Tracing**, which is a recommended setting for MegaLights.

Once enabled, all local lights are handled by the MegaLights system. MegaLights can be disabled per light using **Allow MegaLights** light component property. You can also set the **MegaLights Shadow Method** to select the source of shadowing to either be **Ray Tracing (Default)** or **Virtual Shadow Maps** (VSMs).

While Virtual Shadow Maps will cast shadows directly from the non-simplified Nanite geometry, it only approximates area shadows. There is CPU, memory and GPU time overhead for VSMs on a per-light basis for preparing shadow map depths in advance.

For a more fine-grained control inside a single project, MegaLights can be enabled or disabled using Post Process Volume settings.

MegaLights can be disabled per scalability level or device profile with `r.MegaLights.Allow 0`.

## Technique Overview

MegaLights is a stochastic direct lighting technique, which solves direct lighting though importance sampling of lights. It traces a fixed number of rays per pixel towards important light sources. If a light source is hit by a ray then that light’s contribution is added to the current pixel.

This approach has a few important implications:

- Direct lighting is handled by a single pass in an unified manner, replacing multiple existing Deferred Renderer shadowing and shading techniques.
- MegaLights not only reduce the cost of shadowing, but also reduce the cost of the shading itself.
- MegaLights have a constant performance overhead, but quality may decrease as lighting complexity increases at a given pixel.

Where Deferred Shading has a constant lighting quality, the GPU cost increases with the number of lights. Whereas, MegaLights have constant performance, but the quality depends on the lighting complexity at a given pixel.

MegaLights replaces the following features:

- Shadow MapsDistance Field Shadows
- Ray Traced Shadows
- Deferred Shading (BRDF and light evaluation)
- Volumetric Fog shadowing and light evaluation
- Virtual Shadow Map projectionVirtual Shadow Maps can still be used with MegaLights if selected as the shadow method on the individual light actor’s settings.

By default, MegaLights first traces a short conservative screen space ray in order to pick up tiny details, which may not be available in the simplified Ray Tracing Scene. If such ray goes offscreen, behind an object, or just reaches its max length, then MegaLights continues tracing from the last valid position using Hardware or Software Ray Tracing. MegaLights can also be configured to ray trace a virtual shadow map, but its shadows have additional upfront cost since shadow maps need to be generated per light, while the BVH (Ray Tracing Scene) is generated once for all lights in the scene.

The ray guiding in MegaLights is useful for selecting important light sources and is crucial for sending more samples to lights that are likely to have influence on a given pixel. In turn, ray guiding sends fewer samples towards lights that are to have less influence, like those that are likely occluded. This is an important part of the technique, allowing it to extract the best possible lighting quality out of the fixed per pixel light sample budget. While ray guiding reduces the number of rays sent towards occluded light sources, it still needs to periodically sample those to check whether they became visible in the current frame. With this in mind, you should avoid placing light sources with huge bounds affecting the entire scene.

Finally, all accumulated lighting goes through a denoiser that tries to reconstruct high quality direct lighting from the stochastic and possibly noisy input. As the lighting complexity increases in the scene, the denoiser needs to do more work to account for this. Increased lighting complexity can lead to blurring of the lighting or cause ghosting, which you can avoid by merging smaller light sources into large area lights and carefully narrowing down the bounds of light sources to improve the final lighting quality.

## Lighting Complexity

There’s a limitation of how many important lights can affect a single pixel before it has to rely heavily on the denoiser because there’s a fixed budget and fixed number of samples per pixel, which can cause the denoiser to produce blurry lighting and eventually noise or ghosting in the scene. It continues to be important to optimize light placement by narrowing light attenuation range, and replacing clusters of light sources with a single area light.

To keep MegaLights working well within a scene, it’s best to avoid placing lights inside scene geometry and to optimize a light’s bounds. You can use the console command `r.MegaLights.Debug 1` to visualize where rays are being sent from a selected pixel. You can freeze a selected ray using this console command `r.ShaderPrint.Lock 1`, which allows you to fly around the scene to inspect traced rays.

In the example below, part of the textured rect light is inside the wall and even though it won’t be ever visible, it still needs to be sampled by MegaLights. This can be seen in the visualization, which shows some of the rays being traced into the wall. Ideally textured rect light’s **Source Width** and **Source Height** should be narrowed down, so that light source fills this arch, but doesn’t extend past it.

To minimize noise avoid placing lights inside geometry, optimize light attenuation range, spotlight cone angles, and rect light barn doors to narrow down the influence of light.

### Lighting Complexity Visualization

By default, MegaLights uses ray tracing, and shadow quality depends on the quality of Ray Tracing Scene representation. For performance, the Ray Tracing Scene is built using automatically simplified Nanite meshes and has more aggressive culling settings than the main view. This may cause shadow artifacts, leaking, or missing shadows.

In a level using MegaLights, it is not uncommon to have a lot of light sources in a single location and it is not always easy to find the important lights that influence a screen region. From time to time, there are needs to find lights such as strong hidden lights which can be stealing samples and worsening noise. Light complexity visualization has been added mainly for this purpose. Go to **MegaLights > Light Complexity** under the view mode dropdown menu and select an input source for debugging or use `r.MegaLights.Visualize.LightComplexity` if you are running in a game and don’t have access to editor UIs. Hover the cursor over a screen region of interest. You will see lines drawn from the pixel being investigated to the lights that influence the pixel.

Light shape symbols are drawn on the light locations to show where the lights are and their types. A list of those lights will be displayed to the left side of the viewport. Each entry of the list shows the weight ratio and visibility of the light to the pixel being inspected as well as the name and type of the light. The list is sorted by light weight ratios which is a measurement of the light importance towards the pixel. `r.MegaLights.Visualize.LightComplexity.Dump` can be used to dump the list to the log. The log output will include world space light positions which can be useful when running the tool in a game but need to go back to the editor to find lights.

Hovering the cursor over an entry on the list or a light symbol will highlight the corresponding light or list entry. This is useful in situations such as finding which light corresponds to the top entry in the list. You may want to freeze the mouse cursor using `r.FreezeMouseCursor 1` or freeze the visualization using `r.MegaLights.Visualize.LightComplexity.Freeze 1` before highlighting so the debug pixel coordinates doesn’t change as the cursor moves. By default, lines are colored by the colors of the corresponding lights but it can be disabled by unchecking the light color checkbox in the top-right of the viewport. This could be useful when highlighting lights if the light colors are similar to the highlight color.

A heatmap view is also available for visualizing the estimated sampling cost of each pixel. The metric estimates the cost to sample lights based on the complexity of the lights and the pixel material type. In a scene with very high light and/or material complexity, `r.MegaLights.Visualize.LightComplexity.MaxLightSamplingCost` may need to be adjusted.

### Shadowing Methods

MegaLights exposes two shadowing methods, which can be selected per light using light component’s properties:

- Ray Tracing is the default and recommended method. It doesn't add any extra cost per light and can achieve correct area shadows. The downside is that the quality of the shadows depends on the simplified Ray Tracing Scene.
- Virtual Shadow Maps traces rays against a Virtual Shadow Map. Virtual Shadow Maps are generated per light using rasterization and can capture full Nanite mesh details. The downside is that it can only approximate area shadows, and it has a significant additional per light cost in terms of memory, CPU, and GPU overhead used to generate shadow depths. This should be used sparingly.

In practice most projects use ray tracing for all their local lights due to performance reasons and if they need a higher quality light source like a strong directional light then they simply exclude it from the MegaLights altogether.

By default, all lights, especially larger area light sources with softer shadows or less important lights, should use Ray Tracing, as softer lights don’t need precise shadow casters. It’s also worth allocating a bit more budget for the Ray Tracing Scene, as higher quality ray tracing representation allows for more lights going through the cheaper ray tracing path.

## Ray Tracing Shadow Quality

By default, MegaLights uses ray tracing for casting shadow rays and the main limitation for shadow quality is how well the scene is represented in the BVH. For performance reasons the ray tracing scene is built using automatically simplified Nanite meshes and has more aggressive culling settings than the main view. Additionally any kind of animation has a considerable memory and performance overhead requiring a limiting number of animated vertices per frame, requiring simplifying animated meshes and time-spliced animation. All of this can cause various shadowing artifacts like self-shadowing, leaking or missing shadows.

MegaLights exposes a set of visualizations which are useful to investigate shadowing issues. They allow to quickly spot missing objects in the ray tracing scene or mismatches between rasterized geometry and its ray tracing representation. Those visualizations can be found in the Level Viewport under the View Modes menu or can be enabled using `r.MegaLights.Visualize 1` console command.

Screen space traces may obfuscate ray tracing scene mismatches. It can be useful to temporarily disable them using show flags in order to see how shadows would look when screen space traces fail due to shadow casting geometry being offscreen or occluded.

If some shadows are missing or disappearing with distance, it may be due to Ray Tracing Scene culling. You can start adjusting culling by using the console commands under `r.RayTracing.Culling.*`. You’ll want to look at the culling mode, radius, and solid angle variables.

For culling purposes, you can merge smaller objects together using **Ray Tracing Group Id**, so that they are culled together using their merged bounds.

For more detailed information about Ray Tracing Scene culling controls, see the Ray Tracing Performance Guide (-> ray-tracing-performance-guide-in-unreal-engine).

Ray Tracing Scene is based on automatically simplified Nanite Fallback Meshes. Default settings can sometimes result in fallback meshes that are too low quality for the purposes of shadowing and may require manual adjustment. Follow these steps to do this:

- Open the mesh in the Static Mesh Editor.
- In the Details panel under **Nanite Setting**, set the **Fallback Target** to **Relative Error**.
- A new setting is revealed named **Fallback Relative Error**, and you can set its value. Reducing the value increases the number of triangles and fidelity of the Nanite Fallback mesh.
- Once you’re done, click **Apply Changes** to rebuild the Nanite Fallback Mesh.

For more information about setting up Nanite Fallback Meshes, see Nanite Virtualized Geometry (-> nanite-virtualized-geometry-in-unreal-engine).

Nanite Fallback Mesh triangle count and number of instances included in the Ray Tracing Scene will affect ray tracing BVH build times, used memory, and ray tracing performance. We recommend carefully increasing them according to the available performance and memory budget of your project.

For non real-time rendering, it’s also possible to use `r.RayTracing.Nanite.Mode 1`, which builds the Ray Tracing Scene out of full detail Nanite Meshes. This has a large performance and memory cost and can result in hitches during scene or camera animation when the Nanite LOD cut changes and its BVH needs to be rebuilt.

## Screen Space Traces

MegaLights uses the Ray Tracing Scene when casting shadows for larger geometry detail but leverages screen space traces for smaller scale geometry that may be missing from the simplified Ray Tracing Scene. Screen space traces use Scene Depth and they will hit anything that's visible on the screen. This may cause issues with certain art direction tweaks, like invisible shadow casters which don’t affect Scene Depth and only exist in the Ray Tracing

`Scene.r.RayTracing.Culling.*`.

MegaLights Show flags in the Level Viewport under the Current Viewport Flags menu can be used to temporarily disable screen space traces for troubleshooting. This can be also done using `ShowFlag.MegaLightsScreenTraces 0` console command.

For traces that extend past the ray tracing scene coverage (or when the far field representation is too coarse), MegaLights supports distant screen traces. The length of the distant screen traces is defined as a percentage of the screen using `r.MegaLights.DistantScreenTraces.Length`.

## Light Functions

Light Functions are supported as long as they are compatible with the Light Function Atlas (-> using-light-functions-in-unreal-engine) and if the Light Function atlas is enabled in the project settings.

## Alpha Masking

By default, only Screen Space Traces can correctly handle alpha masked surfaces. It’s possible to enable Alpha Masking support for Ray Tracing using the console command `r.MegaLights.HardwareRayTracing.EvaluateMaterialMode 1`. Enabling this option has a non-trivial performance overhead, so it’s best to avoid alpha masking in content.

## Directional Lights

Directional lights are disabled be default and have to be manually enabled using `r.MegaLights.DirectionalLights 1`.

Quality of directional light shadows heavily depends on the ray tracing representation in the distance, which can be challenging due to BVH build and traversal overhead. Some of those issues can be hidden by enabling Far Field.

Quality of directional light shadows heavily depends on the ray tracing representation in the distance, which can be challenging due to BVH build and traversal overhead or memory limitations. It’s possible to work-around some limitations by enabling Far Field which extends BVH range using a simplified HLOD scene representation.

The recommended approach is to use Deferred Lighting and VSM for strong directional lights like sun and only enable MegaLights for dim and softer lights like moonlight where quality limitations are harder to spot.

Strong directional lights can also make indoors noisy by redirecting some samples towards invisible directional light, which doesn’t contribute to the final pixels. It’s possible to work around this by placing post process volumes, which would make directional light dimmer indoors or just disable them entirely.

## Far Field

MegaLights implements Far Field (-> ray-tracing-performance-guide-in-unreal-engine) traces, which allow extending shadow ray range past the TLAS culling range with a relatively low overhead by tracing against very simplified and merged HLOD1 meshes.

Far Field traces are enabled by the console variable `r.MegaLights.HardwareRayTracing.FarField` in the `DefaultEngine.ini` configuration file, and requires the use of World Partition's Hierarchical Level of Detail (HLOD) (-> world-partition---hierarchical-level-of-detail-in-unreal-engine). Far Field requires the use of HLOD1 to be built.

## Particle Lights

MegaLights supports particle lights but only for those spawned by Niagara systems (-> overview-of-niagara-effects-for-unreal-engine) currently. They can also be made shadow casting when handled by MegaLights.

By default, particle lights will only be handled by MegaLights when users enable it explicitly in assets. This behavior can be changed using the console variable `r.MegaLights.SimpleLightMode`, where setting it to 2 makes MegaLights handle all particle lights — shadow casting still needs to be enabled per asset — and setting it to 0 disables particle lights from MegaLights.

To enable MegaLights for a Niagara emitter:

[image: Niagara emitter with MegaLights settings.] Niagara emitter with MegaLights settings.

- Select the Light Renderer module under the emitter.
- In the **Details** panel, enable **Allow Mega Lights** and **Mega Lights Cast Shadows**. Checking the second setting makes the particle lights cast shadows.
- Checking the first setting enables MegaLights for the lights spawned.

Since an emitter can spawn a lot of lights, care needs to be taken to avoid having too many strong lights affecting a screen pixel at the same time. Otherwise, quality may degrade noticeably. We recommend keeping the lights small, sparse in space, and only enable shadow casting on a small number of particle lights.

## Lit Translucency and Volumetric Fog

MegaLights integrates with the Translucency Lighting Volume (-> lit-translucency-in-unreal-engine) and Volumetric Fog (-> volumetric-fog-in-unreal-engine) to stochastically evaluate lighting and shadowing on those volumes. It uses the same importance-sampling approach as opaque surfaces, tracing a fixed number of shadow rays per voxel and denoising the result.

Shadowing is calculated using a shared froxel volume, which means both features share the same sampling and tracing work. The resolution of the volume is defined using `r.MegaLights.Volume.GridPixelSize` and `r.MegaLights.Volume.GridSizeZ`. Its coverage is automatically extended based on `r.TranslucencyLightingVolume.OuterDistance` and the View Distance of the active Exponential Height Fog component.

Changing these settings will affect the quality of shadowing on both lit translucency and volumetric fog. Lower resolutions can result in blurrier, less stable shadowing, while higher resolutions increase GPU cost.

## Forward Shaded Translucency

 Forward shading for translucency is split into two paths:

- **Front layer**: The frontmost visible layer uses a dedicated pass to calculate high quality per-pixel direct lighting. This path supports the full feature set matching the quality of opaque surface lighting.
- **Other layers**: All layers behind the front layer use the translucency lighting volume used for lit translucency to calculate approximate lighting. Diffuse lighting is read directly from the volume. Specular lighting is approximated using a single dominant light direction derived from the surrounding lighting. This approximation is lower quality than the front layer but is significantly cheaper as it requires no additional sampling and tracing work.

Using a dedicated pass for front layer lighting can add significant overhead to rendering time when there is a lot of forward shaded translucency on screen. See Performance section below for more information and scalability options.

Images below demonstrate the difference between forward shading using front layer translucency and lighting volume:

Front Layer Disabled:

Front Layer Enabled:

## Performance

When comparing performance it’s important to understand that MegaLights is solving all direct lighting and replaces a variety of Deferred Renderer passes, such as:

- **Shadow Depths:** if using Shadow Maps or Virtual Shadow Maps
- **RenderDeferredLighting::Lights**
- **InjectTranslucencyLightingVolume**
- **VolumetricFog::Shadowed Lights**
- Removes light evaluation from **VolumetricFog::LightScattering**

Performance is mostly dependent on the internal rendering resolution, downsampling mode (`r.MegaLights.DownsampleMode`) and number of taken per downsampled pixel (`r.MegaLights.NumSamplesPerPixel`).

Each sample for a shadowed light needs to trace a ray, which can get expensive if the ray tracing scene isn’t optimized.

The third factor is the number of overlapping lights per pixel. All lights affecting a given pixel have to be estimated in order to select good samples. While the cost is much smaller than deferred light evaluation it still can get expensive if lights don’t have tight culling radius or are clustered in one spot.

`r.MegaLights.LightAttenuationFalloff` can be used to tighten light influence range improving quality and performance at an expense of cutting off part of the light energy.

- There’s an additional memory, CPU and GPU overhead for generating shadow map depths per each light, which uses Virtual Shadow Map for shadowing instead of Ray Tracing.

 It’s recommended to only use Ray Tracing for this reason.

- There’s also a small cost for pixels on screen with complex BRDFs and affected by heavy light types.

 like textured rect lights.

MegaLights cost is mostly constant, and there isn’t a large difference between unshadowed and shadowed lights, so all lights in the scene can have shadows enabled.

Ideally, MegaLights should be used with Lumen HWRT, which allows sharing Ray Tracing Scene overhead and optimizations between both systems.

Front Layer Translucency adds a separate GBuffer rendering pass for the frontmost layer of forward shaded translucent surfaces (the cost of this pass is shared with Lumen Front Layer Reflections when enabled). This is followed by a full MegaLights lighting pass, including tile classification, sample generation, ray tracing, and denoising. The cost scales with the number of on-screen pixels covered by forward shaded translucent surfaces, and in situations where most of the screen has forward shaded translucency it can end up doubling the overall lighting cost depending on the selected scalability settings.

`Stat GPU` shows GPU timing overview, including the MegaLights pass. In-depth timings can be obtained using built-in `ProfileGPU` or third party profilers.

Unreal Engine uses Async Compute to overlap multiple dispatches from various features. `Stat GPU` and `ProfileGPU` timings will be distorted by the overlapping work until you disable Async Compute using the `r.RDG.AsyncCompute 0` console command. Profiling with async compute enabled is important for understanding the final performance, but it also makes it challenging to measure performance of an individual feature.

Although MegaLights is fully GPU driven, there’s still some legacy CPU cost per light. If all lights are MegaLights using ray tracing, most of the per light CPU cost can be removed using the console command `r.Visibility.LocalLightPrimitiveInteraction 0`.

### Scalability

The default engine scalability profiles contain individual MegaLights settings in the shadow quality scalability group. Scalability profiles are a great starting point for any performance tweaks and are useful as a reference for important and up-to-date renderer performance scalability settings. Individual settings can be found in [Engine Root]\Engine\Config\BaseScalability.ini:

These are the primary controls for scalability of MegaLights:

- r`.MegaLights.DownsampleMode` controls the downsample factor for sampling and tracing.
- `r.MegaLights.NumSamplesPerPixel` controls how many samples and traces are done per downsampled pixel.

For scalability of lighting for volumetric fog and hair strands, you can use console variables under `r.Megalights.Volume.*` and `r.MegaLights.HairStrands.*` to adjust lighting quality for them.

Front Layer Translucency supports a number of scalability options to balance lighting quality and performance:

- r`.MegaLights.FrontLayerTranslucency.SpecularOnly` is the primary scalability control. When enabled, only specular lighting is calculated per-pixel on the front layer while diffuse lighting falls back to the Translucency Lighting Volume. This significantly reduces the number of rays traced and pixels shaded.
- `r.MegaLights.FrontLayerTranslucency.SoftShadows` and `r.MegaLights.FrontLayerTranslucency.TexturedRectLights` can be disabled individually to further reduce cost.
- The feature can also be globally disabled in the project settings **MegaLights - High Quality Translucency** and then selectively enabled using Post Process Volumes in specific locations.

Reference mode can be used to scale quality further for offline rendering. Reference mode is controlled by specifying the desired number of samples through the `r.MegaLights.Reference.NumShadingPass` console variable.

### Ray Tracing Performance

A large part of MegaLights is tracing rays. Certain geometry configurations or types can have considerable impact on the performance of tracing rays. This often includes skeletal meshes without ray tracing specific LODs, large objects full of empty space or objects rotated off the main axis. For in-depth information about optimizing the Ray Tracing Scene, see the Ray Tracing Performance Guide (-> ray-tracing-performance-guide-in-unreal-engine).

On supported platforms it’s possible to use `r.MegaLights.VisualizeRays.MinIterations` to visualize the most expensive rays in the scene. This can be useful to track down the most expensive objects in the BVH in order to optimize them by merging or simplifying geometry.

### Async Compute

MegaLights offer the following async compute options:

- `r.MegaLights.AsyncCompute.Volume`: Hoist the dispatch of volume passes earlier in the frame and run them on async compute.
- `r.MegaLights.AsyncCompute.GenerateSamples`: Run light sample generation passes on async compute.
- `r.StochasticLighting.AsyncCompute`: Run `TileClassificationMark` on async compute. This is technically not a part of MegaLights but it is related. There are two modes. When the cvar is set to 1 (default), the pass will automatically run async when downstream features (MegaLights, Lumen final gather) run async. This behavior is usually desired because other non-dependent graphics passes can start sooner, which will increase overlap as long as there is enough work left on the graphics pipe. Setting the cvar to 2 will force the pass to run async when async compute is supported and allowed.

MegaLights async compute options are disabled by default because there is usually not much room left on the compute pipe when Lumen runs async and running Lumen async usually gives a bigger win because Lumen usually has more work to overlap. If a game doesn’t have a lot of Lumen work and some passes such as BasePass and ShadowDepths take longer to run on the graphics pipe on some platforms, there may be enough room to run some MegaLights passes async.

MegaLights volume passes are not dependent on BasePass so, if LumenSceneLighting finishes early on async compute and remaining async compute work cannot start before BasePass finishes, running MegaLights volume passes async and letting them overlap with BasePass may reduce overall frame time. TileClassificationMark and MegaLights sampling passes can overlap with ShadowDepths, Lumen reflections, and non-MegaLights direct lighting. If Lumen final gather work is short enough on the compute pipe, running MegaLights sampling passes async will increase overlap and potentially lead to better performance. Whether or not to use these options depends on workload distribution between the graphics and compute pipes. Users should always A/B test before enabling them in their projects.

## Debugging

In-depth debugging tools are under `r.MegaLights.Debug.*` and `r.MegaLights.Visualize.*`.

Console command `r.MegaLights.Debug 1` is useful to visualize where rays are being sent from a selected pixel and why. `r.ShaderPrint.Lock 1` can then be used to freeze current visualization and fly around the scene to inspect traced rays.

Console command r`.MegaLights.Visualize` exposes various internal visualization modes allowing to inspect the current state of denoiser.

## Limitations

 General limitations:

- MegaLights is incompatible with the Forward Renderer

Current limitations, which we want to improve:

- Water, Clouds, Heterogenous Volumes and Local Volumetrics aren’t supported

## Platform Support

- MegaLights are designed for current gen consoles (such as PlayStation 5, Xbox Series X | S) and PCs with ray tracing capabilities.
- MegaLights do not support mobile, Switch, or previous-generation consoles (such as PlayStation 4 and Xbox One)

- rendering
- lighting
- experimental
- lights
- megalights
- hardware ray tracing

On this page

- Using MegaLights (-> megalights-in-unreal-engine)
- Technique Overview (-> megalights-in-unreal-engine)
- Lighting Complexity (-> megalights-in-unreal-engine)
- Lighting Complexity Visualization (-> megalights-in-unreal-engine)
- Shadowing Methods (-> megalights-in-unreal-engine)
- Ray Tracing Shadow Quality (-> megalights-in-unreal-engine)
- Screen Space Traces (-> megalights-in-unreal-engine)
- Light Functions (-> megalights-in-unreal-engine)
- Alpha Masking (-> megalights-in-unreal-engine)
- Directional Lights (-> megalights-in-unreal-engine)
- Far Field (-> megalights-in-unreal-engine)
- Particle Lights (-> megalights-in-unreal-engine)
- Lit Translucency and Volumetric Fog (-> megalights-in-unreal-engine)
- Forward Shaded Translucency (-> megalights-in-unreal-engine)
- Performance (-> megalights-in-unreal-engine)
- Scalability (-> megalights-in-unreal-engine)
- Ray Tracing Performance (-> megalights-in-unreal-engine)
- Async Compute (-> megalights-in-unreal-engine)
- Debugging (-> megalights-in-unreal-engine)
- Limitations (-> megalights-in-unreal-engine)
- Platform Support (-> megalights-in-unreal-engine)

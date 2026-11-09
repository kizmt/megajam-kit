# Lumen Performance Guide

https://dev.epicgames.com/documentation/en-us/unreal-engine/lumen-performance-guide-for-unreal-engine?application_version=5.9

> Scalability options for Lumen Global Illumination and Reflections.

[image: Lumen Performance Guide]

Lumen targets 30 and 60 frames per second (fps) on consoles with 8ms and 4ms frame budgets at 1080p for global illumination and reflections on opaque and translucent materials, and volumetric fog. The engine uses preconfigured Scalability settings to control Lumen's target FPS. The **Epic** scalability level targets 30 fps. The **High** scalability level targets 60 fps on current-generation consoles, aside from Nintendo's Switch 2. The Medium global illumination scalability level targets Switch 2 and lower-end PCs.

Lumen relies on Temporal Upsampling (-> dynamic-resolution-in-unreal-engine) with Unreal Engine 5's Temporal Super Resolution (-> temporal-super-resolution-in-unreal-engine) (TSR) for 4k output. Lumen and other features use a lower internal resolution (1080p) that is unsampled by TSR. This gives better final image quality than running Lumen natively at 4k resolution with significantly lower quality settings.

## Scalability Settings

Lumen quality is set by the Global Illumination and Reflections quality groups. Each lower level costs approximately half of the level above it, while providing the best quality possible for that cost.

You can find the Scalability settings in the Level Editor under the **Viewport-related** **Settings > Viewport Scalability Settings**. In-game, control the Scalability settings with GameUserSettings and the graphics settings menus (see the Lyra (-> lyra-sample-game-in-unreal-engine) project for an example). The console variables `sg.GlobalIlluminationQuality` and `sg.ReflectionQuality` can also be used.

- **Cinematic** scalability level targets Movie Render Queue (-> movie-render-pipeline-in-unreal-engine).
- **Epic** scalability level targets a 30 fps console budget.
- **High** scalability level targets a 60 fps console budget.
- **Medium** scalability level targets 60 fps on Switch 2 and medium spec PC.
- **Low** scalability level disables Lumen features.

[image: Viewport Scalability Settings] Viewport Scalability Settings

By default, Unreal Engine targets 30 fps on consoles. To target 60 fps, set the **Global Illumination** and **Reflections** quality groups to **High** in the console Device Profiles. These profiles can be found in `[Your Project Name]\Platforms[Console]\Config\` folder. For example, `[Your Project Name]\Platforms\PS5\Config\PS5DeviceProfiles.ini`.

A PlayStation 5 Device Profile targeting 60 fps would look like:

 Config

```
[PS5 DeviceProfile]
    ; Set Lumen GI and reflection quality to High, targeting 60 fps
    +CVars=sg.GlobalIlluminationQuality=2
    +CVars=sg.ReflectionQuality=2
```

[PS5 DeviceProfile]
 ; Set Lumen GI and reflection quality to High, targeting 60 fps
 +CVars=sg.GlobalIlluminationQuality=2
 +CVars=sg.ReflectionQuality=2

## Lumen Lite

On Medium Quality Reflections (`sg.ReflectionQuality 1`), Lumen Reflections are disabled and Screen Space Reflections (SSR) is used instead on smooth surfaces, together with rough specular from Lumen GI.

Lumen on Medium GI Quality (`sg.GlobalIlluminationQuality 1`) uses a special Final Gather called **Irradiance Final Gather**, enabled by the setting `r.Lumen.FinalGatherMethod 0`.

**Irradiance Field Gather **places World Space Radiance Cache probes around pixels, pre-calculates their irradiance, and interpolates to pixels with probe occlusion. It provides faster but lower quality global illumination and is targeted at low-end PC and Switch 2 at 60 fps (including Handheld mode).

[image: A debug view showing the irradiance probes. Probes which had to be moved out of geometry are green, and probes which are still stuck in geometry are red, and not used for lighting.] A debug view showing the irradiance probes. Probes which had to be moved out of geometry are green, and probes which are still stuck in geometry are red, and not used for lighting.

## Scaling Down Beyond Lumen

The default **Global Illumination** and **Reflections** quality groups are in `\Engine\Config\BaseScalability.ini`. These settings attempt to keep indirect lighting looking similar between quality levels. This has the added benefit of not needing to redo your lighting per platform while scaling down costs of Lumen.

Medium Quality Level

- Lumen Irradiance Fields are used for global illumination on platforms that support it, otherwise: For small-scale ambient occlusion, **Screen Space Ambient Occlusion **is allowed, if set up in the Post Process Volume.
- For large-scale ambient occlusion, **Distance Field Ambient Occlusion** replaces **Lumen Global Illumination**.

Low Quality Level

- Uses only unshadowed skylight.
- Reduces skylight intensity (`r.SkylightIntensityMultiplier=0.7`) to better match **Medium** quality level since there's no form of skylight shadowing.

### Software Ray Tracing

Software Ray Tracing (-> lumen-technical-details-in-unreal-engine) is the fastest tracing method in Lumen and we recommend it for games which cannot afford Hardware Ray Tracing or as a fallback for GPUs which don't support Hardware Ray Tracing.

In this configuration Lumen traces a single merged Global Distance Field. Tracing the global distance field makes tracing independent from the number of instances and their overlap with other instances. It's also a great fit for content with a large amount of overlapping instances.

Global Distance Field update performance is still dependent on the number of instances, but it’s heavily cached which reduces the cost of updates.

Global Distance Field caches movable and static objects separately. It’s important to correctly set up component mobility, as moving static actors will invalidate static cache, which can be very expensive. `r.GlobalDistanceField.Debug.LogModifiedPrimitives` can be used to debug, which static actors are being moved at runtime.

Disable **Affects Distance Field Lighting** in component or set **Distance Field Resolution Scale** to **0** in the static mesh editor in order to remove individual distance field instances from rendering in the distance field scene. Removing less important instances that don't have a major impact on global illumination or reflections can help to optimize Global Distance Field update performance.

### Hardware Ray Tracing

Hardware Ray Tracing provides Lumen with improved quality and we recommend it as a default option on consoles for both 30 fps and 60 fps. It is more expensive than Software Ray Tracing and requires careful scene optimization as it is quite sensitive to large amounts of instance overlaps.

Hardware Ray Tracing requires rebuilding the **Top Level Acceleration Structure** (TLAS) every frame. This cost is proportional to the number of instances you need to include in this acceleration structure. Achieving good performance on current generation consoles generally means having fewer than 100,000 instances in the **Ray Tracing Scene** after culling. On Microsoft Windows, the number of instances can vary.

Use `Stat SceneRendering` to check how many instances are visible in the ray tracing scene. Look at the **Ray tracing active instances** stat.

The ray tracing scene culling settings are the most powerful tool for controlling how many ray tracing instances are in the scene. Ray tracing culling is enabled by default to simplify its setup, but additional changes can be made to the **DefaultEngine.ini** configuration file found in the `[Your Project Name]\Config\` folder.

 Config

```
[SystemSettings]
    r.RayTracing.Culling=3
    r.RayTracing.Culling.Radius=15000
    r.RayTracing.Culling.Angle=0.5
```

[SystemSettings]
 r.RayTracing.Culling=3
 r.RayTracing.Culling.Radius=15000
 r.RayTracing.Culling.Angle=0.5

You can remove Individual instances from the ray tracing scene by disabling **Visible In Ray Tracing** on the actor in the level.

See the Ray Tracing Performance Guide (-> ray-tracing-performance-guide-in-unreal-engine) for detailed information on Hardware Ray Tracing performance, including performance counters and debug views.

**Far Field** provides aggressive culling without compromising global illumination and reflection distance. After the ray tracing scene radius, all rays use the far field traces to extend global illumination and reflections at a cheaper cost. Lumen Technical Details (-> lumen-technical-details-in-unreal-engine) provides information on how to set up Far Field.

Increasing ray tracing scene culling coupled with Far Field helps you to optimize and scale down Lumen Hardware Ray Tracing performance.

Hardware Ray Tracing performance depends on how much the meshes in the scene overlap. Large meshes that overlap the entire scene are a performance issue, such as a skybox. These meshes should have **Visible In Ray Tracing** disabled. You can also save tracing costs on grass meshes, and kit-bashed meshes with multiple layers of intersecting combined meshes.

To keep scenes performant with Hardware Ray Tracing, you must keep overlapping meshes to a reasonable level.

**Hit Lighting for Reflections** provides improved reflection quality. It evaluates materials and lighting at every hit point, but is expensive for games. We don't recommend using it for games unless materials are trivial and optimized with **Ray Tracing Quality Switch** nodes. On consoles, you can limit the number of BVH traversal iterations and terminate long and expensive rays early using `r.Lumen.HardwareRayTracing.MaxIterations`. Terminated rays are treated as fully occluded with zero radiance causing over-occlusion. This setting is useful to finetune performance and avoid performance issues caused by parts of the scene with lots of overlapping geometry.

## Tips

The cost of **Lumen Reflections** can vary depending on how much of the screen has smooth, or low-roughness, materials. These materials need dedicated reflection rays. By default, all pixels with roughness below 0.4 will trace a reflection ray. Pixels with roughness above that get free reflection approximation based on Lumen Global illumination.

### Lumen Reflection Roughness Threshold

You can control the roughness threshold using **Max Roughness To Trace** setting in the **Post Process Volume**. It can be additionally clamped from scalability settings using `r.Lumen.Reflections.MaxRoughnessToTraceClamp`. Pixels with roughness below the set threshold will trace dedicated **Lumen Reflection** rays, and pixels with roughness above this threshold fall back to free rough specular approximation.

Foliage has an independent roughness threshold. Any pixel with materials **Two Sided Foliage** or **Subsurface** shading models are treated as foliage. You can control foliage roughness with `r.Lumen.Reflections.MaxRoughnessToTraceForFoliage`. Pixels requiring dedicated reflection rays can be visualized using **Performance Overview** view mode, which is found in the Level Viewport under the View Modes menu.

Reflections on foliage are often hard to see. Without compromising quality, it's possible to achieve some significant performance wins by setting the foliage max roughness threshold to 0.

### Lumen Reflection Downsample Factor

The Lumen Reflection Downsample Factor is set by `r.Lumen.Reflections.DownsampleFactor`. It can be set to 1 or 2 to trade between quality and performance. When the console variable is set to 2, we only trace one ray for one of the pixels in a quad. Tracing fewer rays increases performance but full resolution lighting needs to be reconstructed from the lower resolution trace result, which can make reflections more blurry and less stable.

There is also a middle ground option for Downsample Checkerboard that you can enable with `r.Lumen.Reflections.DownsampleCheckerboard`. Instead of tracing one ray for every four pixels, one ray is traced every two pixels in this mode. Quality and performance are expected to fall between full and quarter resolution tracing.

### Replacing Lumen Reflections with Screen Space Reflections

Reflection costs can be more aggressively scaled down by replacing Lumen Reflections with **Screen Space Reflections** (SSR). You can do this by setting `r.Lumen.Reflections.Allow=0`. For example, you can save 1 ms on Xbox Series S by adding the following to the `XSXDeviceProfiles.ini` file.

 Config

```
[XSX_Lockhart DeviceProfile]
    ; Use SSR in lieu of Lumen reflections for perf
    +CVars=r.Lumen.Reflections.Allow=0
```

[XSX_Lockhart DeviceProfile]
 ; Use SSR in lieu of Lumen reflections for perf
 +CVars=r.Lumen.Reflections.Allow=0

The example below demonstrates how Lumen Global Illumination provides rough specular even when Lumen Reflections is disabled.

Some performance increase from Lumen Reflections is gained by reusing rays traced for diffuse global illumination. This experimental path only provides a speed increase for scenes with many pixels whose roughness is in the range of 0.2–0.4. You can enable this using `r.Lumen.Reflections.RadianceCache=1`.

### Lumen Scene Lighting

**Lumen Scene Lighting** updates the surface cache's direct and indirect lighting, which is used for lighting ray hits both for global illumination and for reflections. Performance depends on the fraction of surface cache updated every frame. Speed up updates can be set separately for direct lighting using `r.LumenScene.DirectLighting.UpdateFactor`, and for indirect lighting, using `r.LumenScene.DirectLighting.MaxLightsPerTile` and `r.LumenScene.Radiosity.UpdateFactor`.

Lumen Scene Lighting selects a small subset of the most important lights per surface cache tile, which makes its performance less sensitive to the total number of lights in the scene. The number of lights per tile can be controlled by `r.LumenScene.DirectLighting.MaxLightsPerTile`.

### Lumen World Space Radiance Cache

Lumen caches distant lighting using a **World Space Radiance Cache**.

Individual probe resolution can be controlled using `r.Lumen.ScreenProbeGather.RadianceCache.ProbeResolution` and `r.Lumen.TranslucencyVolume.RadianceCache.ProbeResolution`. Higher values increase the quality of indirect lighting but are more expensive to update.

The second main performance control is the number of probes to be updated per frame. This can be set using `r.Lumen.ScreenProbeGather.RadianceCache.NumProbesToTraceBudget`and `r.Lumen.TranslucencyVolume.RadianceCache.NumProbesToTraceBudget`. Higher values make lighting more responsive but cost more. Setting this value too low can cause lighting pops during fast camera movements due to Lumen having to slowly catch-up, so at some point in order to scale down further the resolution of a probe grid has also to be reduced using `r.Lumen.ScreenProbeGather.RadianceCache.GridResolution` and `r.Lumen.TranslucencyVolume.GridPixelSize`.

### Lumen Screen Probe Gather

**Screen Probe Gather** is responsible for the final gather by tracing rays from pixels and integrating incoming lighting.

The main performance control here is probe spacing (`r.Lumen.ScreenProbeGather.DownsampleFactor`) and resolution of screen space probes (`r.Lumen.ScreenProbeGather.TracingOctahedronResolution`). Increasing probe spacing will reduce the quality of indirect shadows and blur indirect lighting. Decreasing screen probe resolution will reduce indirect lighting directionality and quality of rough reflections.

Indirect lighting integration can be optionally run at half-resolution using `r.Lumen.ScreenProbeGather.IntegrateDownsampleFactor 2`. This will greatly speedup integration, but can cause extra noise and soften normals, so it’s not enabled by default by any of the default scalability or device presets.

### Profiling Lumen

Lumen is divided into three passes:

- **Lumen Scene Lighting** for evaluating surface cache lighting.
- **Lumen Screen Probe Gather** for evaluating diffuse global illumination and rough reflections, and translucency global illumination.
- **Lumen Reflections** for evaluating dedicated reflection rays on smooth surfaces.

`Stat GPU` displays GPU pass timings, including individual Lumen passes.

For a more detailed performance breakdown, use the `ProfileGPU` command. You can also use third-party profiling tools like RenderDoc.

Lumen is using Async Compute, running in parallel with other workloads. In order to measure Lumen individuality, it's recommended to disable it with the console command `r.Lumen.AsyncCompute 0`. See the next section for more details about Async Compute.

## Async Compute

Lumen uses **Async Compute** on consoles. This allows the GPU to overlap Lumen's work with the non-Nanite geometry pass and direct lighting pass. Additionally, Lumen can overlap with the **Lumen Screen Probe Gather** and **Lumen Reflections** passes.

Async Compute is pre-configured for common workloads, but in some cases non-default settings can be faster. One of these cases which we encountered is when the **Lumen Screen Probe Gather** pass can't overlap with the **Lumen Reflections** pass due to large amounts of direct lighting or shadow map work on the graphics queue. In this case, it may be beneficial to run the Lumen entirely as an async compute pass. You can do this by setting the following:

 Config

```
r.LumenScene.Lighting.AsyncCompute=1
r.Lumen.DiffuseIndirect.AsyncCompute=1
r.Lumen.Reflections.AsyncCompute=1
```

r.LumenScene.Lighting.AsyncCompute=1
r.Lumen.DiffuseIndirect.AsyncCompute=1
r.Lumen.Reflections.AsyncCompute=1

Async Compute makes Lumen overlap with other rendering passes. This makes profiling harder since timings will include not only the cost of Lumen, but also the cost of other workloads which overlap with it. When profiling Lumen individually, disable Async Compute.

## Scalability Reference

The default engine scalability and per-platform device profiles contain individual Lumen settings. These are useful as a reference for important and up-to-date renderer performance scalability settings. Also, they are a good starting point for custom scalability settings. We recommend using the default scalability levels to achieve 30 fps or 60 fps, but also for a consistent look between levels. You can take a look at these scalability settings in either of these files:

 Config

```
[Engine Root]\Engine\Config\BaseScalability.ini
[Engine Root]\Platforms\[Console Name]\Base[ConsoleName]DeviceProfile.ini
```

[Engine Root]\Engine\Config\BaseScalability.ini
[Engine Root]\Platforms\[Console Name]\Base[ConsoleName]DeviceProfile.ini

- performance
- rendering
- lighting
- optimization
- global illumination
- lumen

On this page

- Scalability Settings (-> lumen-performance-guide-for-unreal-engine)
- Lumen Lite (-> lumen-performance-guide-for-unreal-engine)
- Scaling Down Beyond Lumen (-> lumen-performance-guide-for-unreal-engine)
- Software Ray Tracing (-> lumen-performance-guide-for-unreal-engine)
- Hardware Ray Tracing (-> lumen-performance-guide-for-unreal-engine)
- Tips (-> lumen-performance-guide-for-unreal-engine)
- Lumen Reflection Roughness Threshold (-> lumen-performance-guide-for-unreal-engine)
- Lumen Reflection Downsample Factor (-> lumen-performance-guide-for-unreal-engine)
- Replacing Lumen Reflections with Screen Space Reflections (-> lumen-performance-guide-for-unreal-engine)
- Lumen Scene Lighting (-> lumen-performance-guide-for-unreal-engine)
- Lumen World Space Radiance Cache (-> lumen-performance-guide-for-unreal-engine)
- Lumen Screen Probe Gather (-> lumen-performance-guide-for-unreal-engine)
- Profiling Lumen (-> lumen-performance-guide-for-unreal-engine)
- Async Compute (-> lumen-performance-guide-for-unreal-engine)
- Scalability Reference (-> lumen-performance-guide-for-unreal-engine)

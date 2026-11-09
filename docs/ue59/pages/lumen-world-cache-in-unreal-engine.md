# Lumen World Cache

https://dev.epicgames.com/documentation/en-us/unreal-engine/lumen-world-cache-in-unreal-engine?application_version=5.9

> A world-space lighting cache for Lumen Hardware Ray Tracing.

The **Lumen World Cache** is a world-space lighting cache for Lumen Hardware Ray Tracing. When a Lumen ray hits a surface, Lumen needs the lighting at that hit point. By default, it looks that lighting up in the Surface Cache (-> lumen-technical-details-in-unreal-engine), which Lumen builds by capturing each mesh's material properties from cards placed around it. The World Cache takes a different approach: it's built at runtime by path tracing the scene, evaluating the material and lighting at each hit, and it stores the results in a sparse grid of cells in world space. It doesn't need mesh cards or captures at all.

Because the cache is filled from ray hits rather than from cards, it works the same way for small meshes, single large meshes, spline meshes, animated skeletal meshes and meshes deformed by World Position Offset. These are the cases where the Surface Cache's card coverage tends to fall short.

The World Cache is off by default. It only applies when Lumen uses Hardware Ray Tracing. When it's active, it replaces the Surface Cache completely for that view, so the Surface Cache isn't captured, lit, or kept in memory. It also works with the Simplified Material ray tracing mode, a lighter-weight way to support ray tracing on a platform.

The change notes for 5.9 report these benefits over the Surface Cache:

- You don't need to fix up meshes for card coverage, and projects skip card cooking.
- Global illumination gets more bounces, and reflections show more color.
- Lighting appears almost instantly after a camera cut.
- There's no per-instance CPU cost.
- It uses much less memory.

## How the World Cache Works

The World Cache stores lighting in small cells laid out in world space around the camera. Cells near the camera are small, and they get larger with distance: at 10 meters from the camera, each cell is about 25.6 cm across with the default settings. Each cell stores lighting separately for the main direction a surface faces (up, down, or one of four sides), so a wall and the floor that meets it get separate entries.

Every frame, Lumen fills the cache by tracing paths from the screen. It picks one random pixel in each 8 × 8 pixel tile and traces a path of up to three bounces from it. At each surface a path hits, Lumen evaluates the hit material, adds its emissive light, samples one light with a shadow ray, and stores the result in the cell at that point. The last bounce reads the cache from the previous frame instead of tracing further, which carries light from more bounces into the cache over time. Rays that leave the scene pick up sky lighting.

To choose which light to sample, the World Cache uses the energy-based light culling that 5.9 shares between MegaLights, Lumen hit lighting, LumenPT and the World Cache. Lights that would add too little energy at a point are skipped, so the cache spends its samples on the lights that matter. The change notes report that this makes light sampling faster and less noisy.

Lighting in each cell is averaged over up to 16 frames to reduce noise. Cells that no path has reached for 64 frames are removed to make room for new ones.

When Lumen Global Illumination, Lumen Reflections, or the translucency volume trace a hardware ray and hit a surface, they read the lighting from the World Cache at the hit point, where they would otherwise read the Surface Cache. Reflections jitter their lookups across neighboring cells, which smooths out the cell edges.

Because the cache is built from what the camera sees and from the paths that bounce from there, it's kept per view. Each camera view keeps its own cache from frame to frame.

## Enabling the Lumen World Cache

The World Cache has no setting of its own in the Project Settings. You turn it on with a console variable in a configuration file, and it relies on the Lumen and ray tracing settings in **Project Settings**.

To turn it on, add this line to your project's `DefaultEngine.ini` configuration file and restart the editor:

 Config

```
[SystemSettings]
r.Lumen.WorldCache.Supported=1
```

[SystemSettings]
r.Lumen.WorldCache.Supported=1

### Requirements

Lumen then uses the World Cache whenever all of these are true:

- Lumen Global Illumination is using Hardware Ray Tracing. In **Project Settings**, this means **Dynamic Global Illumination Method** is **Lumen**, **Support Hardware Ray Tracing** is enabled, and **Use Hardware Ray Tracing when available** is enabled. For the hardware this needs, see Hardware Ray Tracing (-> lumen-technical-details-in-unreal-engine) in Lumen Technical Details.
- The platform's **Hardware Ray Tracing Mode** is **Full** or **Simplified Material**. The World Cache fills itself by evaluating materials at ray hits, the way hit lighting does, so it needs ray tracing material shaders and isn't available in **Inline** mode. You don't need to set **Ray Lighting Mode** to a hit lighting option.
- The platform runs Shader Model 6, and supports inline ray tracing and wave operations. On D3D12, ray tracing also needs bindless resources (Shader Model 6.6 and Resource Binding Tier 3). If the Output Log reports that ray tracing is disabled, Lumen uses Software Ray Tracing and the World Cache stays off.
- `r.Lumen.WorldCache.Allowed` is enabled, which it is by default.

There's no switch for the World Cache in the editor UI. To check that it's active, use the **Surface Cache** view mode, described in Visualizing the World Cache (-> lumen-world-cache-in-unreal-engine). If the World Cache isn't active, the view mode's label reads Lumen Scene, Pink - missing Surface Cache coverage, Yellow - culled Surface Cache.

### Switching Between the World Cache and the Surface Cache

Once the World Cache is supported, you can switch between it and the classic Surface Cache without a restart:

- To use the Surface Cache, set `r.Lumen.WorldCache.Allowed 0` in the console.
- To go back to the World Cache, set `r.Lumen.WorldCache.Allowed 1`.

`r.Lumen.WorldCache.Allowed` is a scalability setting, so you can also use it to turn the World Cache off for some scalability levels or device profiles, and use the Surface Cache there instead. When you switch back to the Surface Cache, Lumen has to rebuild it, so expect a few frames of incomplete lighting.

Lumen also falls back to the Surface Cache on its own whenever the World Cache's requirements aren't met: for example, with Software Ray Tracing, in **Inline** mode, or on a platform that doesn't support it. To remove the World Cache from the project completely, including its shaders, set `r.Lumen.WorldCache.Supported` back to 0 and restart the editor.

## Simplified Material Ray Tracing Mode

**Hardware Ray Tracing Mode** includes the option **Simplified Material**. You can find **Hardware Ray Tracing Mode** in **Project Settings > Platforms > Windows**, in the **Renderer** section. Linux has the same setting. The options are:

|  |  |
| --- | --- |
| **Option** | **Description** |
| **Disabled** | Ray tracing is disabled. |
| **Inline** | Only inline ray tracing passes are supported. This removes some runtime and cook time overhead, but disables ray tracing passes that use material shaders, such as Lumen hit lighting. |
| **Simplified Material** | Inline ray tracing passes, plus a simplified material hit shader. Only some features, such as the Lumen World Cache, can use materials. Other features fall back to inline ray tracing. |
| **Full** | Full support for ray tracing features, including ray generation, hit and miss shaders, and inline ray queries. This is the default. |

**Simplified Material** sits between **Inline** and **Full**. It compiles only a simplified material hit shader, so it costs less in shaders and memory than **Full**, but it can still give the World Cache the surface color it needs at each hit. Lumen hit lighting isn't available in this mode, so the World Cache is how Lumen gets material-based lighting at ray hits.

## Using the Lumen World Cache

### Previewing Simplified Material Mode in the Editor

To see how the World Cache looks with **Simplified Material** without changing the platform setting, set the console variable `r.RayTracing.SimplifiedMaterialOverride` in the editor. A value of 1 switches the editor to **Simplified Material**, 2 switches it to **Full**, and 0 uses the platform's **Hardware Ray Tracing Mode**. This only affects the editor, not cooked builds.

### Visualizing the World Cache

When the World Cache is active, the **Surface Cache** view mode (**View Modes > Lumen > Surface Cache**) shows the World Cache instead. Pink areas show hash collisions, where two surfaces compete for the same cache entry. Yellow areas show surfaces that don't have a cache entry yet.

To see how the cache is filled, set `r.Lumen.WorldCache.Debug 1`. This draws the paths traced from the screen tile under the debug cursor, and prints statistics on how much of the cache is in use.

The debug cursor follows the mouse cursor. To keep it on one spot while you move the mouse, set `r.DebugCursor.Freeze 1`. To place it on an exact pixel, set `r.DebugCursor.X` and `r.DebugCursor.Y`, and set them back to -1 to follow the mouse again. Outside the editor, when there's no mouse cursor, the debug cursor defaults to the center of the screen.

To inspect the cache, you can also freeze it with `r.Lumen.WorldCache.Freeze 1`, so Lumen keeps sampling it but stops updating it, then move the camera around. To rebuild it from scratch, use `r.Lumen.WorldCache.Reset 1`.

### Measuring World Cache Cost

The World Cache's GPU time is reported under **LumenWorldCache** in GPU profiling tools such as `stat gpu`. It runs on async compute by default, where the platform supports async ray tracing dispatch.

## Lumen World Cache Settings

### Console Variables

The World Cache has no editor properties. You control it with console variables, which you can set in the console or in a configuration file. All of the quality settings below are scalability settings, so you can also set them per scalability level or device profile.

#### Quality and Performance

|  |  |
| --- | --- |
| **Property** | **Description** |
| `r.Lumen.WorldCache.Allowed` | Whether scalability and device profiles allow the World Cache. When disabled, Lumen Hardware Ray Tracing uses the Surface Cache. Enabled by default. |
| `r.Lumen.WorldCache.CellDensity` | How many cells to use per unit of distance from the camera, from 1 to 63. Higher values reduce artifacts such as light leaking, but use more memory and make the cache slower to update. The default is 20. |
| `r.Lumen.WorldCache.MaxEntriesLog2` | The maximum number of cache entries, as a power of two. The default of 20 allows about one million entries. |
| `r.Lumen.WorldCache.PathDownsampleFactor` | The size of the screen tiles that start new paths. Each N × N tile traces one path per frame. Lower values improve cache quality, but cost more to update. The default is 8. |
| `r.Lumen.WorldCache.MaxBounces` | The maximum number of bounces for each path that fills the cache. Higher values add more bounce lighting, but cost more. The default is 3. |
| `r.Lumen.WorldCache.MaxFramesAccumulated` | How many frames of lighting each cell averages. Lower values react faster to lighting changes, but are noisier. The default is 16. |
| `r.Lumen.WorldCache.MaxFramesUnused` | How many frames a cell can go unused before it's removed. The default is 64. |
| `r.Lumen.WorldCache.MaxLocalLightCandidateSamples` | The maximum number of local lights considered for each cache entry when choosing which light to sample. Higher values improve quality in scenes with many lights, but reduce performance. The default is 16. |
| `r.Lumen.WorldCache.MaxRayIntensity` | Clamps the brightest ray that can be added to the cache, to reduce fireflies. The default is 40. |
| `r.Lumen.WorldCache.AsyncCompute` | Whether to run World Cache passes on async compute. This needs async ray tracing dispatch support. Enabled by default. |

#### Ray Biasing

These settings offset the rays that fill the cache away from the surfaces they start on. Increasing them reduces self-shadowing artifacts, but can increase light leaking.

|  |  |
| --- | --- |
| **Property** | **Description** |
| `r.Lumen.WorldCache.GBufferRayBias` | Constant bias for rays traced from rasterized pixels on screen. The default is 0.5. |
| `r.Lumen.WorldCache.GBufferRayNormalBias` | Bias along the surface normal for rays traced from rasterized pixels on screen. The default is 0.25. |
| `r.Lumen.WorldCache.RayHitRayBias` | Constant bias for rays traced from ray tracing hits. The default is 0.1. |
| `r.Lumen.WorldCache.RayHitRayNormalBias` | Bias along the surface normal for rays traced from ray tracing hits. The default is 0.05. |

#### Debugging

|  |  |
| --- | --- |
| **Property** | **Description** |
| `r.Lumen.WorldCache.Debug` | Draws the paths traced from the screen tile under the debug cursor and prints cache use statistics. Use `r.DebugCursor.Freeze`, `r.DebugCursor.X` and `r.DebugCursor.Y` to control the debug cursor. |
| `r.Lumen.WorldCache.Freeze` | Freezes the cache. Lumen keeps sampling it, but stops updating its entries and their lighting. |
| `r.Lumen.WorldCache.Reset` | Clears the cache once. |
| `r.Lumen.WorldCache.ResetEveryNthFrame` | Clears the cache every N frames. A value of 0 disables this. |

## Limitations

- **Hardware Ray Tracing only.** The World Cache only replaces the Surface Cache when Lumen uses Hardware Ray Tracing. Software Ray Tracing still uses the Surface Cache.
- **No editor setting.** The World Cache is off by default and you can only turn it on with a read-only console variable in a configuration file. Changing it needs a restart and recompiles shaders.
- **Not available in Inline mode.** The World Cache needs ray tracing shaders, so it's unavailable when **Hardware Ray Tracing Mode** is **Inline**.
- **Lighting lags behind changes.** Each cell averages lighting over several frames, and newly seen areas need a few frames to fill in, so lighting changes can take a moment to appear. Lower `r.Lumen.WorldCache.MaxFramesAccumulated` for a faster response, at the cost of more noise.
- **Translucent surfaces aren't cached.** The paths that fill the cache pass through translucent materials and only store lighting for opaque surfaces.
- **Only the first view resets.** With more than one view, such as split screen, `r.Lumen.WorldCache.Reset` only resets the cache of the first view.
- **Currently unsupported features.** Water, ray traced translucency, foliage and subsurface transmission, and Far Field.

## Additional Notes

### World Cache and the Surface Cache

Most of the Surface Cache guidance in Lumen Technical Details (-> lumen-technical-details-in-unreal-engine) doesn't apply when the World Cache is active. The World Cache doesn't use mesh cards, so pink areas of missing card coverage, the **Max Lumen Mesh Cards** setting, and the limited card coverage of skeletal and spline meshes don't affect ray hits.

### World Cache and LumenPT

Lumen Path Tracing has its own world-space lighting cache, with its own settings under `r.LumenPT.WorldCache`. The two caches are separate: the settings on this page only affect the Lumen World Cache.

## More Information

- Lumen Technical Details (-> lumen-technical-details-in-unreal-engine)
- Lumen Global Illumination and Reflections (-> lumen-global-illumination-and-reflections-in-unreal-engine)
- Lumen Performance Guide (-> lumen-performance-guide-for-unreal-engine)
- Hardware Ray Tracing (-> hardware-ray-tracing-in-unreal-engine)

On this page

- How the World Cache Works (-> lumen-world-cache-in-unreal-engine)
- Enabling the Lumen World Cache (-> lumen-world-cache-in-unreal-engine)
- Requirements (-> lumen-world-cache-in-unreal-engine)
- Switching Between the World Cache and the Surface Cache (-> lumen-world-cache-in-unreal-engine)
- Simplified Material Ray Tracing Mode (-> lumen-world-cache-in-unreal-engine)
- Using the Lumen World Cache (-> lumen-world-cache-in-unreal-engine)
- Previewing Simplified Material Mode in the Editor (-> lumen-world-cache-in-unreal-engine)
- Visualizing the World Cache (-> lumen-world-cache-in-unreal-engine)
- Measuring World Cache Cost (-> lumen-world-cache-in-unreal-engine)
- Lumen World Cache Settings (-> lumen-world-cache-in-unreal-engine)
- Console Variables (-> lumen-world-cache-in-unreal-engine)
- Quality and Performance (-> lumen-world-cache-in-unreal-engine)
- Ray Biasing (-> lumen-world-cache-in-unreal-engine)
- Debugging (-> lumen-world-cache-in-unreal-engine)
- Limitations (-> lumen-world-cache-in-unreal-engine)
- Additional Notes (-> lumen-world-cache-in-unreal-engine)
- World Cache and the Surface Cache (-> lumen-world-cache-in-unreal-engine)
- World Cache and LumenPT (-> lumen-world-cache-in-unreal-engine)
- More Information (-> lumen-world-cache-in-unreal-engine)

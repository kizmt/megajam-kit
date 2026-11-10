# Adaptive Voxel-Based Order Independent Transparency

https://dev.epicgames.com/documentation/en-us/unreal-engine/adaptive-voxelbased-order-independent-transparency-in-unreal-engine?application_version=5.9

> An order independent transparency method you can employee through materials.

Learn to use this **Experimental** feature, but use caution when shipping with it.

**Adaptive Voxel-Based Order Independent Transparency** (AVBOIT) blends overlapping translucent surfaces, such as glass, smoke and particles, so they look right no matter which order they're drawn in. With standard translucency, Unreal Engine sorts translucent objects and draws them back to front. When objects overlap or pass through each other, that sorting can't be correct everywhere, and you see layers pop in front of or behind each other. AVBOIT works out how much light each translucent surface lets through at every depth, so each surface is dimmed by exactly the surfaces in front of it. It works with both Nanite and non-Nanite translucency, and it handles colored glass.

AVBOIT is one of the order-independent transparency (OIT) methods you can choose for a project. The other is the sorted-pixels method, which you turn on with the **Enable Order Independent Transparency (Experimental)** project setting. AVBOIT doesn't need that setting, and it doesn't need raster ordered views, a GPU feature that the sorted-pixels method relies on.

## How AVBOIT Works

AVBOIT divides the view into a grid of small cells that follow the camera's view: a few pixels wide and tall, and sliced by distance from the camera. Before translucency is drawn, every translucent object is drawn once at low resolution to record how much light it blocks in each cell. AVBOIT then works out, for every cell, how much light gets through everything in front of it.

When translucent surfaces are then drawn at full resolution, each pixel looks up that value at its own depth and uses it as its weight. A final pass combines all the weighted surfaces over the scene. Because the weights come from depth rather than from draw order, the result doesn't depend on the order the objects are drawn in.

The grid is adaptive. AVBOIT puts its depth slices where translucent objects actually are and skips empty distances, so the slices are packed closely around your translucent content.

AVBOIT also skips work behind dense content. Where translucency, such as thick smoke, blocks all the light, translucent pixels behind it aren't drawn.

## Enabling AVBOIT in a Project

AVBOIT has no setting in the **Project Settings** window. You turn it on with console variables, which you can set in the console or in your project's `DefaultEngine.ini` configuration file.

AVBOIT requires a desktop platform that uses Shader Model 6 (SM6). It isn't available on mobile platforms, and it turns off when the view uses MSAA anti-aliasing.

To use AVBOIT:

- Leave `r.AVBOIT.Support` at its default value of `1`. This compiles the shader versions AVBOIT needs for translucent materials. It's read-only, so you can only change it in a configuration file, and you need to restart the editor afterward.
- Set `r.OIT.Method` to `1` to select AVBOIT. The default, `0`, uses standard sorted translucency.
- To apply AVBOIT to non-Nanite translucency, including particles, set `r.AVBOIT.NonNanite` to `1`. It's off by default.

For example, add these lines to `DefaultEngine.ini`:

 Config

```
[SystemSettings]
r.OIT.Method=1
r.AVBOIT.NonNanite=1
```

[SystemSettings]
r.OIT.Method=1
r.AVBOIT.NonNanite=1

AVBOIT applies to Nanite translucency by default (`r.AVBOIT.Nanite` is `1`). Nanite translucency itself is off by default in a project and is turned on with `r.Nanite.AllowTranslucency`.

You can switch `r.OIT.Method` while the editor or game is running. When the value changes, the engine recreates the render state of all components, so expect a short hitch.

### Choosing an Order-Independent Transparency Method

`r.OIT.Method` chooses which OIT method translucency uses. If a project or platform doesn't support the method you choose, translucency falls back to standard sorted translucency.

|  |  |
| --- | --- |
| **Value** | **Description** |
| `0` | None. Translucency uses standard sorting. This is the default. |
| `1` | AVBOIT. Requires `r.AVBOIT.Support` and an SM6 desktop platform. |
| `2` | Sorted pixels. Requires the **Enable Order Independent Transparency (Experimental)** project setting and a platform that supports raster ordered views. |

The sorted-triangles option (`r.OIT.SortedTriangles`), which sorts the triangles inside a single mesh, is separate from `r.OIT.Method` and isn't affected by it.

## Preparing Translucent Materials for AVBOIT

AVBOIT works with materials that use the **Translucent**, **Additive**, **Modulate** and **AlphaComposite (Premultiplied Alpha)** blend modes, and with colored transmittance, such as tinted glass.

For AVBOIT to combine surfaces correctly, each translucent material must output only its own light: its lighting, specular and emissive color. AVBOIT adds the background behind each surface itself, in its final pass. If a material also samples the scene behind it, for example with the **SceneColor** expression, the background is added twice. The surface washes out and looks like a flat color filter, with no visible specular.

Additive materials only add light, so AVBOIT doesn't treat them as blocking anything behind them. They're still dimmed by the surfaces in front of them.

## Debugging AVBOIT

AVBOIT has its own set of debug views, which you turn on with `r.AVBOIT.Visualize`. Each view draws over the scene after translucency. These views aren't available in Test or Shipping builds. The views draw with the shader print system, so also set `r.ShaderPrint` to 1. With `r.ShaderPrint` at its default of 0, nothing appears.

|  |  |
| --- | --- |
| **Value** | **Description** |
| `1` | Stats overlay: grid size, slice counts, how much the adaptive slicing compresses depth, and GPU memory use. |
| `2` | Slice viewer for how much light each cell blocks. Choose the slice with `r.AVBOIT.Visualize.Slice`. |
| `3` | Slice viewer for how much light gets through to each cell. Choose the slice with `r.AVBOIT.Visualize.Slice`. |
| `4` | Heatmap of the depth where translucency blocks all light, with the tiles AVBOIT skips. |
| `5` | Graph of light transmission along depth at the pixel under the mouse cursor. Pin the pixel with `r.AVBOIT.Visualize.ProbeX` and `r.AVBOIT.Visualize.ProbeY`. |
| `6` | How AVBOIT maps depth to slices, and which depth ranges hold translucent content. |
| `7` | The weight a surface would get at each pixel's scene depth. |
| `8` | The accumulated color, normalization and transmission side by side. |
| `9` | The final blend, recomputed from the accumulated values. |
| `10` | Whether Nanite translucency recorded its light blocking in software (green), on hardware (red) or both (yellow). |

To check whether a material samples the scene behind it, set `r.AVBOIT.DebugWeightOutput` to `2`. Translucent surfaces then show their own lit color before AVBOIT weights it. If you can see the background inside that color, the material is adding the scene behind it itself, and you need to remove that from the material.

## AVBOIT Settings

### Console Variables

These console variables control whether AVBOIT runs and what it applies to. The others under `r.AVBOIT` tune quality and performance for rendering engineers.

|  |  |
| --- | --- |
| **Console Variable** | **Description** |
| `r.OIT.Method` | Order-independent transparency method: `0` none (default), `1` AVBOIT, `2` sorted pixels. |
| `r.AVBOIT.Support` | Compiles the shader versions AVBOIT needs. Read-only; restart required. Default `1`. |
| `r.AVBOIT.Nanite` | Applies AVBOIT to Nanite translucency. Default `1`. |
| `r.AVBOIT.NonNanite` | Applies AVBOIT to non-Nanite translucency. Default `0`. |
| `r.AVBOIT.RGB` | Supports colored transmittance, such as tinted glass. Default `1`. |
| `r.AVBOIT.PixelSize` | Width and height of each grid cell, in pixels. Smaller values give sharper edges where translucent layers overlap, at a higher cost. Default `8`. |
| `r.AVBOIT.MaxDistance` | Farthest distance from the camera, in centimeters, that the grid covers. Default `20000`. |
| `r.AVBOIT.EarlyOut` | Skips translucent pixels behind translucency that blocks all light. Default `1`. |
| `r.AVBOIT.Visualize` | Debug views. Default `0` (off). |

## Limitations

- **Refraction and distortion.** AVBOIT doesn't handle refraction or distortion. Materials that bend or sample the scene behind them don't blend correctly under AVBOIT.
- **Platforms.** AVBOIT needs an SM6 desktop platform. It isn't available on mobile platforms or SM5. On those, translucency uses standard sorting.
- **MSAA.** AVBOIT turns off for views that use MSAA.
- **Debug view modes.** AVBOIT turns off in view modes that replace materials with debug shading, and when translucency is hidden.
- **Surfaces very close together.** Surfaces that fall in the same depth slice blend as a weighted average, so their order within that slice is lost.
- **Large translucent objects around the camera.** When the camera is inside large translucent bounds, such as enclosing walls or volumes, the adaptive slicing has little room to help, and depth precision drops.
- **Far translucency.** Translucency beyond `r.AVBOIT.MaxDistance` is grouped into the last slice and isn't skipped when hidden behind dense content.
- **Edges between overlapping layers.** Where translucent layers overlap, color mixing at their edges steps at the size of a grid cell. Lower `r.AVBOIT.PixelSize` to reduce it. Intersecting layers can also show faint stripes across the whole overlap at the same scale.
- **Shader count.** Because `r.AVBOIT.Support` is on by default, SM6 desktop projects compile an extra shader version of each translucent material, even when `r.OIT.Method` is `0`. To avoid this in a project that doesn't use AVBOIT, set `r.AVBOIT.Support=0` in `DefaultEngine.ini`.

## Troubleshooting

### Translucent Surfaces Look Washed Out or Like Flat Color Filters

The material samples the scene behind it, so the background is added twice. Use `r.AVBOIT.DebugWeightOutput 2` to confirm, then change the material so it outputs only its own light. See Preparing Translucent Materials for AVBOIT (-> adaptive-voxelbased-order-independent-transparency-in-unreal-engine).

### AVBOIT Has No Effect

Check that `r.OIT.Method` is `1`, that the platform is an SM6 desktop platform, and that the view doesn't use MSAA. For non-Nanite objects and particles, also check that `r.AVBOIT.NonNanite` is `1`. If both `r.AVBOIT.Nanite` and `r.AVBOIT.NonNanite` are `0`, translucency uses standard sorting.

## More Information

- Using Transparency in Materials (-> using-transparency-in-unreal-engine-materials)
- Lit Translucency (-> lit-translucency-in-unreal-engine)
- Using Refraction (-> using-refraction-in-unreal-engine)
- Nanite Virtualized Geometry (-> nanite-virtualized-geometry-in-unreal-engine)

- experimental

On this page

- How AVBOIT Works (-> adaptive-voxelbased-order-independent-transparency-in-unreal-engine)
- Enabling AVBOIT in a Project (-> adaptive-voxelbased-order-independent-transparency-in-unreal-engine)
- Choosing an Order-Independent Transparency Method (-> adaptive-voxelbased-order-independent-transparency-in-unreal-engine)
- Preparing Translucent Materials for AVBOIT (-> adaptive-voxelbased-order-independent-transparency-in-unreal-engine)
- Debugging AVBOIT (-> adaptive-voxelbased-order-independent-transparency-in-unreal-engine)
- AVBOIT Settings (-> adaptive-voxelbased-order-independent-transparency-in-unreal-engine)
- Console Variables (-> adaptive-voxelbased-order-independent-transparency-in-unreal-engine)
- Limitations (-> adaptive-voxelbased-order-independent-transparency-in-unreal-engine)
- Troubleshooting (-> adaptive-voxelbased-order-independent-transparency-in-unreal-engine)
- Translucent Surfaces Look Washed Out or Like Flat Color Filters (-> adaptive-voxelbased-order-independent-transparency-in-unreal-engine)
- AVBOIT Has No Effect (-> adaptive-voxelbased-order-independent-transparency-in-unreal-engine)
- More Information (-> adaptive-voxelbased-order-independent-transparency-in-unreal-engine)

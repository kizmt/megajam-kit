# Thin Geometry Detection with Temporal Super Resolution

https://dev.epicgames.com/documentation/en-us/unreal-engine/thin-geometry-detection-with-temporal-super-resolution?application_version=5.9

> A detection system that deals with sub-pixel geometry to improve image stability.

[image: Thin Geometry Detection with Temporal Super Resolution]

Temporal Super Resolution (TSR) tries to balance ghosting and flickering when shading changes between frames. While effective for most surfaces, the rejection is overly aggressive on sub-pixel geometry — thin structures like Nanite foliage, hair, and fine mesh edges that only partially cover a pixel. The result is flickering.

This happens because the partially-covered pixel’s color oscillates between foreground and background as the jitter pattern shifts. Neighbor clamping rejects the history each frame rather than allowing it to converge when the current frame’s bounding box is totally different from the history. The flickering also becomes patchy when it fails since TSR also uses a cascading chain of manual 3x3 convolution operators.

**Thin Geometry Detection** is meant to deal with sub-pixel geometry “boiling” artifacts. It approaches this problem by identifying regions that contain depth-varying sub-pixel geometry. When found, it selectively relaxes the history rejection based on lighting and translucency overlay, thus preserving sharp and stable response.

Thin geometry detection identifies sub-pixel geometry (left, `r.tsr.visualize 15`) and relaxes history rejection, preserving sharp, stable detail (middle) versus baseline TSR (right). Red indicates edge line segments.

 Red = depth-edge pixels without coverage history; Green = cluster regions with partial coverage (relaxation applied); Yellow = cluster regions without relaxation.

Thin geometry detection primarily focuses on improving quality for projects using Nanite foliage and scenes with high-contrast silhouette edges with relatively stable lighting conditions. Dithered hair card rendering also benefits from this.

A scene with stable Nanite foliage with dynamic lighting, objects and translucency overlay when thin geometry detection is on. This is a clip taken from The Witcher 4 Technical Demo shown at Unreal Fest.

Thin geometry detection is automatically enabled when Nanite foliage is turned on. Alternatively, you can use the console command `r.TSR.ThinGeometryDetection 1` to manually set it.

The solution details below can help you create cleaner, more stable content with significantly reduced flickering across different platforms supporting TSR. The pipeline below demonstrates how this works.

 Overview of how the thin geometry detection works.

The detection algorithm estimates a coverage map for thin geometry clusters and detects geometry edge and high contrast intensity lines separately. Both produce a per-pixel relaxation weight that loosens the neighbor clamping bounds in the reject shading pass. To deal with any over-relaxation, several controls through the `bHasPixelAnimation` and Temporal Responsiveness node can be used. Thin geometry detection handles the after-DoF translucency automatically.

## Coverage Map Estimation

The coverage map is derived from depth and GBuffer shading model ID based on `r.TSR.ThinGeometryDetection.Coverage.ShadingRange` setting that controls which shading models are eligible for thin geometry detection, and classifies each pixel as sub-pixel geometry cluster or general lit geometry, and is used for weight computation.

The image below shows how it affects the final weights under different settings.

The **varying-range** mode is the default. It applies stronger relaxation to foliage while using lighter relaxation for other materials. This mode only supports contrast line detection. Foliage only (or Foliage + hair) mode is more performant and a preferable configuration if high contrast artifacts are not severe.

The coverage map tracks how often each pixel is covered by thin geometry across frames, using a temporal moving average that converges to the true sub-pixel coverage ratio. A statistical test validates whether the scene has changed at each pixel. If coverage history no longer matches the current frame, it resets to prevent ghosting from stale relaxation, giving each pixel a stable coverage estimate that adapts quickly to scene changes but remains smooth during normal rendering.

## Relaxation Weight Computation

The relaxation weight is derived from the accumulated coverage map where partial coverage receives more relaxation than full or zero coverage. Since sub-pixel geometry like Nanite foliage has local correlations and reject shading heuristics uses convolutions, a gated spatial diffusion process is conservatively applied to suppress flickering of cluster regions rather than a pixel.

The max relaxation weight each sub-pixel coverage contributes is set by `r.TSR.ThinGeometryDetection.Coverage.MaxRelaxationWeight` (default 0.037).

 Temporal Stability with Thin Geometry Detection on Foliage.

Because of the max relaxation weight, when there are both sub-pixel geometries and highly dynamic changing lighting and shadows, the relaxation would prefer higher stability.

## Edge and Line Detection

The spatial weight diffusion works well for sub-pixel geometry clusters. However, with 3D applications, such as those for games, are regular repeating structures — windows, railings, fences, and rooftops — that the diffusion alone doesn’t detect reliably.

The Temporal Analysis heuristic operates globally and has no knowledge of whether flickering originates from geometry or shading, so it can’t adapt its behavior to the source. This is addressed by running a dedicated geometry edge and contrast line detection. This improves stability on its own and lets the Temporal Analysis anti-flickering heuristic further resolve geometry aliasing without introducing ghosting on flat shading regions.

|  |  |
| --- | --- |
| 1. No Anti-Aliasing | 2. Plus Shading Anti-Aliasing |
| 3. Plus Weight Diffusion | 4. Plus Edge and Line Detection |

Edges and lines share the same detection kernels but with different error thresholds: depth error for edges, and luma contrasts for lines. Neighboring pixels along the detected edge direction are then checked for consistency to confirm the edge is spatially coherent rather than noise. This supports both axis-aligned and diagonal edges.

The weight from edge detection is consumed per frame to deal with direct shading noise and provide hints to the shading anti-aliasing logic for relaxation. High contrast thin lines flicker in and out across frames (for example, specular aliasing). The edge detection is not enough to resolve it. To handle this, the detection result is accumulated using stochastic OR. Namely, once a line is detected, the flag persists with a random per-pixel decay. The decay rate is slower inside thin geometry regions so that real detections persist longer, while isolated false positives clear more quickly.

 Contrast line detection improves specular aliasing. (No line detection versus detection with r.TSR.ThinGeometryDetection.Coverage.MinKeepLineContrast 0.1, 50% DynamicRes).

## Handling Over-Relaxation

Relaxing history rejection creates a risk of over-relaxation when other rendering features overlay thin-geometry regions. Apart from the benefit of Parallax disocclusion heuristics that prevents ghosting of disocclusion, two cases require special handling: those with after-DoF translucency, and those before-DoF translucency.

### After-DoF Translucency

Translucent effects rendered after depth of field (such as, particles, fog, and volumetrics) composite on top of the scene color that TSR operates on. When translucency dominates the pixel color, relaxing the history rejection is troublesome – the relaxation was intended for the opaque thin geometry underneath, not the translucent overlay. It could cause smearing to occur.

|  |  |
| --- | --- |
|  |  |
| Rooftop Smoke After-DoF Translucency | No relaxation for smoke covered region with r.TSR.Visualize 15. |

The `WeightRelaxation` pass addresses this by computing the ratio of translucent contribution to total pixel luminance. When this ratio exceeds a threshold (`r.TSR.ThinGeometryDetection.RejectTranslucency`, default 0.6), the relaxation weight is attenuated toward zero.

For transient translucency (such as a muzzle flash), the pass writes a translucency bit into the coverage texture. On the next frame, the `DetectThinGeometry` pass reads this bit and zeroes out the relaxation weight entirely, preventing a single-frame burst of translucency from causing a ghosting streak.

|  |  |
| --- | --- |
|  |  |
| Muzzle flash with transient translucency lagging artifact. | With translucency rejection. |

### Before-DoF Translucency

Translucent objects rendered before depth of field (such as glass and VFX) write into the scene color before TSR processes it. These are not visible in the separate translucency texture, so the luminance-ratio approach cannot detect them.

For these cases, the Temporal Responsiveness material node can be used to mark pixels that should use strict history rejection regardless of thin geometry detection. The node can be enabled with `r.Velocity.TemporalResponsiveness.Supported 1`. It requires the platform support for uint64 image atomics.

With this node, we can get both stable nanite foliages and better temporal responsiveness.

|  |  |
| --- | --- |
| Thin Geometry Detection Off | Thin Geometry Detection On |

 Thin Geometry Detection with BeforeDoF Translucency setting medium Temporal Responsiveness. We get both stable Nanite foliage and better temporal responsiveness.

For translucent regions where the depth and velocity are clipped away (such as translucent hair cards supporting partially blurred DOF) can possibly cause ghosting in regular gameplay. This node can also be used to combat the ghosting by: enabling the clipped depth pass with `r.Velocity.OutputTranslucentClippedDepth.Supported 1`, and setting it conditionally based on an **Opacity Mask Clip Value** as shown in the material graph below.

This node then adds another translucency pass to write the temporal responsiveness bit for translucency material with opacity lower than the Opacity Mask Clip Value.

## Performance

Thin geometry detection is not free. It adds compute passes to the TSR pipeline: coverage measurement from the GBuffer, the main detection and edge analysis pass, and the weight relaxation pass. The before-DoF translucency handling introduces a significant performance impact. When translucency needs to write depth or the responsiveness, TSR's async compute overlap with the GPU timeline is constrained. It cannot begin until after translucency completes.

To mitigate the performance impact for 60 frames per second (fps) on platforms support async compute, you can use **early translucency velocity** (`r.Translucency.EarlyVelocityPass`) to allow the translucency velocity pass to run well before the main translucency rendering, decoupling TSR’s scheduling dependency.

Below are the pass location options available:

- `0` is disabled. Velocity renders in the standard translucency block.
- `1` is after deferred lighting, with maximum TSR async overlap.
- `2` is after volumetric cloud reconstruction, avoiding TSR and cloud bandwidth contention. (Default)
- `3` is at the beginning of translucency. This is best if translucency occupancy is low but has high rendering cost. When the present single layer water depth prepass does not write velocity, the early velocity location 1 and 2 will fallback to run at the beginning of translucency (3)

## Console Variables

| Console Variable | Description | Default Value |
| --- | --- | --- |
| `r.TSR.ThinGeometryDetection` | Define if we should perform another pass to detect thin geometries (sub-pixel in frame buffer) either due to sampling algorithm before TSR or the geometry being too thin (Default = 0). When enabled thin geometry pixels will relax history rejection based on the types.Edge line: single pixel line over non foliage (Red in `r.TSR.Visualize 15`)Cluster hole region: foliage pixels with partial coverage against background material (Green)Other: no history relaxation (Yellow).When Nanite Foliage is enabled in the Project Settings, this option is enabled by default, and a value < 0 must be used to disable it. | 0 |
| `r.TSR.ThinGeometryDetection.AntiFlickering` | Thin geometry detection can sometimes fail. Whether the anti-flickering logic considers the thin geometry detection pass. | 1 |
| `r.TSR.ThinGeometryDetection.Coverage. MaxRelaxationWeight` | The max history clamping box relaxation weight due to thin geometry detection (0 to 1) | 0.037 |
| `r.TSR.ThinGeometryDetection.Coverage. MinKeepLineContrast` | The minimum luminance contrast needed to keep a detected intensity line after normalization | 0.3 |
| `r.TSR.ThinGeometryDetection. Coverage.ShadingRange` | The shading model range regarded as thin geometry and accumulate the coverage.0: Two-sided foliage only.1: Two-sided foliage and hair.2: All shading models except unlit.3: All shading models except unlit participate in coverage. Foliage gets full relaxation dilation. Regular materials get lightweight edge-only relaxation (no dilation). Requires `r.TSR.ShadingRejection.Flickering 1` or `r.TSR.ThinGeometryDetection.Coverage.MinKeepLineContrast` > 0. Otherwise falls back to 0 (foliage only). (Default) | 3 |
| `r.TSR.ThinGeometryDetection.ErrorMultiplier` | Scales the depth-based edge detection threshold. Higher values require larger depth discontinuities to classify as thin geometry edges.Reduce for more sensitive detection at higher upscale ratios | 200 |
| `r.TSR.ThinGeometryDetection. HighContrastLineFadeRate` | How quickly reprojected high contrast line markers fade out outside validated thin geometry regions. 0=never, 1=instant. | 0.1 |
| `r.TSR.ThinGeometryDetection. HighContrastLineFadeRateInsideRegion` | How quickly reprojected high contrast line markers fade out inside validated thin geometry regions. 0=never, 1=instant. | 0.03 |
| `r.TSR.ThinGeometryDetection. HighContrastLineWeight` | Relaxation weight applied to detected high contrast lines when no cluster-based relaxation is active. | 0.6 |
| `r.TSR.ThinGeometryDetection.RejectTranslucency` | Translucency ratio threshold above which all thin geometry detection is rejected for a pixel in the next frame (0 to disable). | 0.6 |
| `r.TSR.ThinGeometryDetection.WeightRelaxation` | Adaptively trim the history relaxation to avoid ghosting. | 1 |

## Known Constraints

Thin geometry detection relies on depth discontinuities and coverage variation within a local neighborhood. It does not cover all thin-geometry scenarios:

- **Normal-map detail on flat surfaces.** Moiré from sub-pixel detail encoded in normal maps produces no depth or coverage signal because the surface is geometrically flat, so there is nothing for the detector to latch onto.
- **Spatially uniform coverage loss.** When all pixels in the local neighborhood lose coverage under the same jitter offset, there is no local contrast to distinguish thin geometry from a scene change. This can happen with dense parallel lines whose spacing causes an entire patch to go dark or white at once.

As a content guideline, avoid geometry with dense, uniformly sub-pixel parallel lines. Slight variation in angle, curvature, or spacing ensures that at least some pixels in the neighborhood retain partial coverage, giving the detection a signal to work with.

When neither detection nor content adjustment is viable, shading rejection temporal analysis (`r.TSR.ShadingRejection.Flickering`) can reduce the flickering in the shading domain as a last resort.

|  |  |
| --- | --- |
| Thin Geometry Detection: On | Thin Geometry + Temporal Analysis |

- temporal super resolution
- tsr
- nanite

On this page

- Coverage Map Estimation (-> thin-geometry-detection-with-temporal-super-resolution)
- Relaxation Weight Computation (-> thin-geometry-detection-with-temporal-super-resolution)
- Edge and Line Detection (-> thin-geometry-detection-with-temporal-super-resolution)
- Handling Over-Relaxation (-> thin-geometry-detection-with-temporal-super-resolution)
- After-DoF Translucency (-> thin-geometry-detection-with-temporal-super-resolution)
- Before-DoF Translucency (-> thin-geometry-detection-with-temporal-super-resolution)
- Performance (-> thin-geometry-detection-with-temporal-super-resolution)
- Console Variables (-> thin-geometry-detection-with-temporal-super-resolution)
- Known Constraints (-> thin-geometry-detection-with-temporal-super-resolution)

# Temporal Upscalers

https://dev.epicgames.com/documentation/en-us/unreal-engine/temporal-upscalers-in-unreal-engine?application_version=5.9

> How temporal upscalers are used in Unreal Engine.

[image: Temporal Upscalers]

**Temporal Upscalers** use data from the current and previous frames to produce a high-quality upscaled result. Temporal upscalers all work the same with Unreal Engine, whether they are Unreal Engine 4's Temporal Anti-Aliasing Upscaling (TAAU), Unreal Engine 5's Temporal Super Resolution (-> temporal-super-resolution-in-unreal-engine), or a third-party distributed plugins such as NVIDIA's DLSS 2+ Super Resolution, AMD's FSR 2.0+, and Intel's XeSS. They all plug into the post-processing chain in the same location — between Depth of Field and Motion Blur.

Regardless of what temporal upscaler is being used, the rendering resolution is controlled consistently using Screen Percentage (-> screen-percentage-with-temporal-upscale-in-unreal-engine) or with Dynamic Resolution when supported.

## Automatic View Texture Mip Bias

Screen percentage causes geometry to render at a lower pixel density, which means that temporal upsample requires more texture information per rendered pixel from the **Surface** and **Deferred Decal** Material Domains to maintain the same output sharpness.

With a **Texture Sample** node selected in the Material Graph, you can use its **Details** panel to enable using **Automatic View Mip Bias** to set whether the texture should be sampled with per-view Mip biasing for sharper output with Temporal Anti-Aliasing methods like TSR and TAAU.

 [image: Automatic View Mip Bias]

Automatic View Mip Bias can become problematic for textures with lots of small or high-frequency detail when combined with lower primary screen percentages, as sharper detail can be lost. You can compensate by setting **MipValueMode** to **MipBias** to apply some value to the **Bias** input on the Texture Sample or to the Const Mip Value in the Details panel, or you can opt out of Automatic View Mip Bias completely.

 [image: Example of Mip Value on Fence Mesh]

Automatic View Mip Bias only happens when either TAAU or TSR is enabled. Other anti-aliasing methods, such as MSAA and FXAA, do not use this setting.

## Post Process Materials After TSR

Post Process Materials must select a **Blendable Location** from where they will be used. The options for **After Tonemapping** and **Replacing the Tonemapper** happens after TSR in the rendering chain. This means that they are running at full resolution and are different from the view size.

The **View Property** expression includes options for **View Size** and **Render Target Size** that returns the resolution of the view before TSR happens in the pipeline, even though it's actually happening after TSR. To know what the view size and the texel UV size are after TSR, use the **Scene Texture** expression with **PostProcessInput0** with the outputs for **Size** and **InvSize**.

 [image: View Property View Size]

If you want to recompute the viewport UV from the pixel position, multiply **SceneTexture:PostProcessInput0** by **ScreenPosition**, like in the example below.

 [image: Viewport UV from Pixel Position]

## Temporal Upscaler Visualization Show Flag

The **Temporal Upscaler** visualization show flag includes an overview of all relevant buffers that can help debug common ghosting problems that affect all temporal upscalers, such as Temporal Super Resolution (-> temporal-super-resolution-in-unreal-engine)
, Temporal Anti-Aliasing or third party plugins. Common issues can include the wrong velocity vector of objects, ghosting with translucency, overly dark pre-exposure of internal buffers that cause TSR to be misled by what the actual exposure is for pixels, and generally any artifacts produced by other rendering algorithms.

You can access this show flag from the Level Editor's **Show > Visualize** menu by selecting **Temporal Upscaler (TSR, TAAU, or third party plugins)**.

 [image: Show menu to select temporal upscalers show flag option.]

This visualization mode includes raw input and output buffers to help you diagnose artifacts affecting the temporal upscaler.

|  |  |
| --- | --- |
|  |  |
| Temporal Upscaler Visualization Map | Temporal Upscaler Visualization with Example Scene |

Each of these is the raw inputs and outputs of the temporal upscaler. Colors are still in pre-exposed linear color space.

#### Thumbnails annotated with the corresponding command to dig deeper

Each thumbnail is annotated with the console command that shares its name with the resource name used in resource debugging tools, such as DumpGPU (-> gpudump-viewer-tool-in-unreal-engine) and other third-party GPU debugging tools. For example, the depth buffer is called **SceneDepthZ**, and it can be visualized with our runtime visualization tool using `vis SceneDepth`.

Below is an example of the TSR pass using the SceneDepthZ in DumpGPU (-> gpudump-viewer-tool-in-unreal-engine).

 [image: DumpGPU Example]

These are some tips you can use with DumpGPU (-> gpudump-viewer-tool-in-unreal-engine) for debugging temporal upscalers:

- Use `r.DumpGPU.Root *PostProcess*` to dump only the post processing chain that contains the temporal upscaler being used to speed up the process. For TSR specifically, you can use `r.DumpGPU.Root *TSR*`, which includes the pass producing TSR.Moire.Luma earlier in the pipeline.

- If you notice ghosting, you can debug it in DumpGPU. You can delay the dump by a few seconds from the execution of the DumpGPU command with `r.DumpGPU.Delay 3` (in seconds) to give you time to reproduce the ghosting with gameplay logic.

- You can dump multiple successive frames with DumpGPU using `r.DumpGPU.FrameCount`.

- Unlike other frame debugging tools, DumpGPU is implemented on top of Unreal Engine's RHI like any other rendering feature, meaning there is no incompatibility with third-party temporal upscalers' binaries.

#### Importance of depth and velocity buffers

The leftmost columns of the visualization overview are used for diagnosing common temporal reprojection issues. Reprojections in temporal upscalers are dependent on the depth buffer and velocity buffer. While the scene depth buffer is directly displayed in the visualization, the velocity buffer is encoded in such a way that is not always easy to interpret. Instead, the VisualizeTemporalUpscaler show flag displays the `VisualizeMotionBlur` and `VisualizeReprojection` show flags — both of these visualization are available in the editor viewport or at runtime by entering `show [command name]` in the console.

The **VisualizeMotionBlur** show flag (located in the **Show > Visualize** menu of the Level Viewport) intuitively displays the motion of objects rasterized in the internal velocity buffer with arrays in the direction and length of the motion vector encoded internally in the renderer. Static geometry renders as gray pixels since they don't render velocity to save on GPU performance. Their pixel velocities are computed solely from camera movements using the depth buffer.

 [image: visualize Motion Blur]

The Visualize Reprojection show (located in the **Show > Visualize** menu of the Level Viewport) reprojects the previous frame displayed using a motion vector and displays in color any difference between the current frame and that reprojected last frame. This allows for verification that even if the motion vector may look coherent with the motion of objects, they do indeed reproject the previous frame precisely. This is important for the quality of temporal upscalers and other internal temporal accumulation.

 [image: visualize reprojection]

VisualizeReprojection shows images to see reprojection failure. If you suspect an object has the wrong moton vector because it doesn't have enough texture details, try applying a material with more texture details. This material has an object-spaced aligned grid and can even work on animated Skeletal Meshes before bone transformation.

For reference, the scene below is using the VisualizeMotionBlur and VisualizeReprojection show flags with the raw internal velocity buffer (`vis SceneVelocity`) to show static geometry draws as black.

 [image: vis SceneVelocity]

#### Importance of post DOF translucency

Translucency can be a particular challenge for a temporal upscaler to reproject correctly because they often don't draw depth and velocity for reprojection. Where most temporal upscalers will compose the scene before, TSR takes in post DOF translucency and reprojects and composes the scene color. For this purpose, the VisualizeTemporalUpscaler displays both the post DOF translucency buffer and post DOF translucency's alpha channel buffer.

Translucent materials can also be a challenge for depth of field for VFX happening in the background. They can become camera-dependent and create translucency sorting issues whether it was set to draw before or after depth of field in the material editor. To lessen this issue for the temporal upscaler, `r.Translucency.AutoBeforeDOF` (on by default) draws post DOF automatically when a translucent material is behind the focus distance. This simplifies translucency sorting issues and better incentivizes content that uses translucency to remain as much as possible post DOF in the interest of the temporal upscalers.

When it happens that post DOF translucent behind the focus distance is drawn before DOF, the DOF blurring of the full image makes it a lot simpler for the temporal upscaler to reproject it without introducing ghosting because of depth of field's blur minimizes noise coming into the scene color input.

Post DOF translucency format is premultiplied RGBA with Alpha = Translucency = 1 - Opacity. It gets composed onto scene color so that `SceneColor.rgb = SceneColor.rgb * PostDOFTranlucency.a + PostDOFTranslucency.rgb`.

#### Summary

The **Summary** in the bottom-left corner displays useful information that drives the temporal upscaler.

 [image: Summary tile]

| Summary Item | Description |
| --- | --- |
| **TemporalUpscaler** | Displays which temporal upscaler is being used and at which Engine Scalability level it's set for in-engine ones. |
| **Input** | The current resolution and pixel format the temporal upscaler is taking in. |
| **Output** | The current resolution and pixel format being output by the temporal upscaler. |
| **PreExposure** | The current pre-exposure of the color pixel format to diagnose these types of problems. If the pre-exposure is overridden (`r.EyeAdaptation.PreExposureOverride`) this information is also specified. It's important for temporal upscalers to know what the exposure is for a rendered pixel being displayed by the tonemapper in order for the temporal upscaler to function correctly. If pre-exposure is too low, the scene color can end up looking abnormally dark in internal buffers and start hitting all sorts of low bit-depth encoding issues in the temporal upscaler that are used for performance reasons, which can result in ghosting. In theory, pre-exposure should be automatically computed internally by the renderer. Edge cases like this can cause the temporal upscaler to fail. This is a case where using `r.EyeAdaptation.PreExposureOverride` is not encouraged since pre-exposure should mostly be automatic. However, it can be useful to override the pre-exposure to work around issues to avoid a specific issue of the renderer. |
| **Support Alpha** | Whether alpha channel of SceneColor and temporal upscaler's output are displayed when set by `r.PostProcessing.PropagrateAlpha.` |

- rendering
- lighting
- anti aliasing
- temporal super resolution
- tsr
- temporal upscaler

On this page

- Automatic View Texture Mip Bias (-> temporal-upscalers-in-unreal-engine)
- Post Process Materials After TSR (-> temporal-upscalers-in-unreal-engine)
- Temporal Upscaler Visualization Show Flag (-> temporal-upscalers-in-unreal-engine)
- Thumbnails annotated with the corresponding command to dig deeper (-> temporal-upscalers-in-unreal-engine)
- Importance of depth and velocity buffers (-> temporal-upscalers-in-unreal-engine)
- Importance of post DOF translucency (-> temporal-upscalers-in-unreal-engine)
- Summary (-> temporal-upscalers-in-unreal-engine)

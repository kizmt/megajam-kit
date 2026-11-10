# Composure

https://dev.epicgames.com/documentation/en-us/unreal-engine/composure?application_version=5.9

> The new Composure plugin renews support for real‑time compositing pipelines in Unreal Engine, and intends to replace the Legacy Composure plugin.

[image: Composure]

Learn to use this **Experimental** feature, but use caution when shipping with it.

### Our Motivation

**Composure** provides a viable platform for real-time compositing with both live video input as well as file / image media plates. This fills a critical gap in Unreal Engine's **virtual production** capabilities.

### What is in Scope

Unreal Engine 5.7 reintroduces Composure in Experimental as an updated system for real-time compositing. The new Composure is a layer-based tool with numerous improvements over the legacy system, including:

- Redesigned user experience and streamlined workflow.
- Performant **Shadow and Reflection** integration for live-action footage using **Custom Render Passes**.
- Improved **Keyer**.

The legacy version of Composure remains available, but is no longer maintained and will be phased out going forward.

### Who will Benefit

In general, Composure and real-time compositing will be most applicable to work that uses live-action footage. Sophisticated **Computer-Generated (CG)** compositing remains best served by dedicated offline tools such as Nuke and After Effects. The two most common types of shots that Composure aims to support are:

- Greenscreen / bluescreen foreground footage over a CG (Unreal Engine) background.
- CG (Unreal Engine) foreground elements / characters over live-action background footage.

While final-quality composited shots will be possible, it is more likely that Film/TV productions will initially use Composure for Simulcam-style previewing during production on set, and post-vis for editorial. Broadcasts (that is, news, sports, etc.) are included as candidates for the new Composure.

### Legacy Composure

While the reintroduced Composure in Unreal Engine 5.7 is technically Experimental, the existing feature set is officially documented and is prioritized to avoid confusion about versions. Going forward, the prior / existing system will be branded as **Legacy Composure**. Documentation for Legacy Composure will not be updated. You can find Legacy Composure in the Unreal Engine 5.6 documentation here:

Real-Time Compositing with Composure (-> realtime-compositing-with-composure-in-unreal-engine)

The prior / existing Legacy Composure can still be accessed from the **Virtual Production** menu for any user who still relies on it. The old system will likely remain for several releases until the new system takes hold.

[image: Legacy-composure-in-dropdown-menu]

## Overview

The new **Composure** **plugin** reintroduces support for real‑time compositing pipelines in Unreal Engine, and intends to replace the **Legacy Composure** **plugin**. Its purpose is to simplify workflows for common use cases such as CG-over-video, or a keyed-video in a CG environment. It introduces 3D workflows by projecting footage into the scene, which improves interactions between footage and CG. When compared to Legacy Composure, the new plugin leverages recent engine features with improvements to: scene captures, custom render passes, primitive alpha holdout, material branching per render, and the render dependency graph.

The compositing setup is controlled by the **Composite Actor**. It orchestrates layers (which merge imagery) and passes (which process imagery). It also automatically manages scene captures or lightweight custom render passes as needed, to re‑render parts of the world from the main camera’s point of view.

- **Layers** decide what to merge and how to merge (for example, a main render with holdout masks over a plate). Layers can also register passes to pre-process inputs at various points during rendering.**Main Render Layer**
- **Plate Layer**
- **Scene Capture Layer**
- **Shadow Reflection Catcher Layer**
- **Single Light Shadow Layer**
- **Processing Layer**

- **Passes** are small, reusable image processors added on each layer’s secondary input, such as a media texture or a scene capture render.**Centered Scale Pass**
- **Color Grade Pass**
- **Color Keyer Pass**
- **Distortion Pass**
- **Fast Approximate Anti-Aliasing (FXAA) Pass**
- **Post-Process Material Pass**
- **OpenColorIO Pass**
- Render Target Extraction Pass
- Resample Pass
- Sharpen Pass
- **Subpixel Morphological Anti-Aliasing (SMAA) Pass**
- Transform 2D Pass

[image: Simplified-structure-of-layers-&-passes] Simplified structure of layers & passes. For this initial release, the graph structure remains fairly rigid.

Scene captures are automatically spawned and owned by the Composite Actor on behalf of layers when they require additional renders (for example, a shadow / reflection matte or a custom render of selected actors).

### 3D vs. 2D Workflow

#### 3D with Composite Meshes (Recommended)

A 3D workflow is enabled by using composite meshes on the plate layer. These meshes can act as holdout occluders in the main render, while the projected media contributes to indirect lighting and reflections onto virtual CG objects.

#### 2D Only

Users may skip meshes, and composite scene capture layers in 2D over the main render. This can be useful for simple composite shots but plausible indirect lighting from the plate will be lost.

## Getting Started

- Add a **Cine Camera Actor** to your level. This camera should mirror the real camera. It will be used as the source of projection for other renders.Optional: Calibrated lens file component. Follow our Lens Calibration Quick Start Guide (-> camera-lens-calibration-quick-start-for-unreal-engine) to match the lens distortion between the physical camera lens and the engine cine camera for accurate compositing and occlusion.
- Optional: Live link components for tracking & FIZ data.

- Open the Composure window, under **Window > Virtual Production > Composure**.
- Click **Place Composite Actor** to add to your level:[image: Place-composite-mesh-actor]It should come preconfigured with 3 layers:[image: Composite-actor-layers]Main Render Layer: `MainRenderLayer`
- Shadow & Reflection Catcher Layer (deselected): `ShadowReflectionLayer`
- **Plate Laye****r**: `PlateLayer`

- Point the **Composite Actor** to your `CineCameraActor`, and update the **Render Resolution** to match your desired output resolution.[image: Point-the-cine-camera]
- Select the `PlateLayer` and click **+** to **Place** **Composite Mesh Actor** in your level.[image: Place-composite-mesh-actor-in-menu]Right-click the actor and select **Default Lit Masked** material type to catch CG shadows & reflections, and rough keying with alpha-masked edges.
- Right-click the actor and select **Default Unlit Alpha Composite** material type for keying plates while preserving good alpha quality (no shadows and reflections).
- Optionally update its **Material Type** given your use case, by right-clicking on the added mesh (or with the Material Type option exposed on the Composite Mesh Actor).[image: Default-lit-and-unlit-options]

- On the `PlateLayer`, update the **Texture** with your live video input.Media Profile sources selected for a texture start playing automatically.Note that a (live video) media profile texture can be selected here directly.[image: Texture-input-menu]

- Add a **Hero CG Mesh** into the scene (for example, **SM_MatPreviewMesh_01**).
- Optionally **select** the `ShadowReflectionCatcher` layer, then select the CG actor from which we want to catch shadows & reflections.The **Shadow Reflection Catcher** layer is the most expensive layer, since it creates two scene captures. It can be replaced with the much faster **Single Light Shadow** layer to trade quality for performance.[image: Shadow-reflection-layer-selected]
- Pilot the cine camera.[image: Image-of-airplane-icon-in-the-composure-tab]

Example resulting composite:

[image: Image-of-camera-over-color-bars-background]

## Actors and Components

### Composite Actor

The central compositing orchestrator manages all the compositing logic, ticking, layers, passes, and components.

#### Properties

| Property | Description |
| --- | --- |
| **Enabled** | Whether or not the composite behavior is enabled. This property is serialized and transacted through multi-user. |
| **Render Resolution** | Used for transient scene-capture render target size that layers may create. |
| **Camera** | Reference to the (optionally tracked and calibrated) camera used as a source of projection. Properties are also automatically derived from its lens file, if present. |
| **Enable Screen Space Reflections** | Automatically update the screen space reflections in post-processing, such that the plate is present in reflections. |
| **Overrides View User Flags / View User Flags** | A custom User Flag's value used to alter materials in the composite render pass. Set to one by default such that branching can be used in Lit materials. (See `TestPostVolumeUserFlag` material node.) |
| **Main Render Output** | Setting to control the render’s color space & encoding.Default (Tonemapped Final Color Low Dynamic Range (LDR))Linear High Dynamic Range (HDR) with Tone CurveLinear High Dynamic Range (HDR) |
| **Allowed View Modes** | Constrain composite rendering to specific view modes, which can be useful for multi-viewport workflows.**Default**: Compositing is allowed on viewports with Lit, Path Tracing or Unknown view modes.**Media Profile (Unknown)**: Compositing is only allowed with the media profile viewport (default Unknown view mode).**All View Modes**: Compositing is allowed with all view modes. |

### Composite Mesh Actor & Component

A **Composite Mesh Actor** with its built-in composite mesh component are convenience objects for receiving a video plate in the scene. Its material can be updated with preconfigured options: **Default Lit Masked** or **Default Unlit Alpha Composite**.

[image: Material-type-for-the-composite-mesh-actor]

This actor is only exposed for convenient access to plugin materials: any mesh / material combination can be used as a plate layer composite mesh.

Material instances can also be created from the default plugin materials to adjust properties such as **Metallic**, **Specular** and **Roughness**.

### Automatically Managed Components

The following components are managed automatically by the **Composite Actor**, and should not require user input except for specific use cases.

|  |  |
| --- | --- |
| **View‑Projection Component** | Writes the camera view‑projection matrix into a **Material Parameter Collection** every frame (4 vectors starting at `MatrixParameterName`). Targets any `CameraComponent` or `CineCameraComponent` via a component reference. |
| **Composite Scene Capture****s** | Wrapper(s) over the standard `USceneCaptureComponent2D` used by the system for captures. Layers obtain and manage these through the **Composite Actor**. |

## Layers

**Layers** sequentially merge textures or render targets based on the specified merge operation for each layer. They operate bottom-up, as shown in the **Composure** window. You can edit layers and passes in the Composure window while Play-In-Editor is running. Here is a description of the Composure table, column by column (starting from the left):undefined

- **Active**: The active state controls whether the **Composite Actor** is actively rendering. It also enforces the activation of a single composite actor at a time. When joining multi-user, actors are automatically de-activated, and need to be re-activated manually (via a blueprint script). This property is not transacted.
- **Enabled**: Transacted and serialized enabled state, for each layer or actor.
- **Solo**: Solo layers allow you to quickly preview a single layer at a time.
- **Object Name**
- **Type**: Actor or layer type name.
- **Operation**: Merge or blend operation with the previous layer.

Merge operators control how each layer or element is combined in the scene composition. There are many options, here are the currently supported merge operations:

|  |  |
| --- | --- |
| **None** | Current layer A previous replaces previous layer B. |
| **Over** | Current layer A over previous layer B: A + B * (1-a). |
| **Under** | Current layer A under previous layer B: A * (1-b) + B. |
| **Add** | Current layer A added to previous layer B: A + B. |
| **Subtract** | Previous layer B subtracted from current layer A: A - B. |
| **Multiply** | Current layer A multiplied by previous layer B: A * B. |
| **Divide** | Current layer A (safely) divided by previous layer B: A / B. |
| **Min** | Per-component minimum between current layer A and previous layer B. |
| **Max** | Per-component maximum between current layer A and previous layer B. |
| **In** | Current layer A masked by the previous layer B's alpha: A * b. |
| **Mask** | Current layer A's alpha masking the previous layer B: B * a. |
| **Screen** | Screen advanced blend mode. |
| **Overlay** | Overlay advanced blend mode. |
| **Darken** | Darken advanced blend mode. |
| **Lighten** | Lighten advanced blend mode. |
| **ColorDodge** | Color dodge advanced blend mode. |
| **ColorBurn** | Color burn advanced blend mode. |
| **HardLight** | Hard light advanced blend mode. |
| **SoftLight** | Soft light advanced blend mode. |
| **Difference** | Difference advanced blend mode. |
| **Exclusion** | Exclusion advanced blend mode. |

### Layer Base Class

The **Layer Base Class** exposes default properties such as **Enabled**, **Solo**, **Name**, a merge **Operation** (default **Over**), and an interface for registering **Passes** proxies to send to the render thread.

[image: Layer-base-class-and-passes-options]

### Plate

`UCompositeLayerPlate`: Integrates a 2D texture or media texture as a plate.

#### Properties

| Property | Description |
| --- | --- |
| **Composite Meshes** | Receives the projected plate texture, marked as holdout in the main render, but re-renders separately in a built-in custom render pass.The separate render is automatically dilated to hide aliasing artifacts under smoothed **Temporal Super Resolution (TSR)** primitive alpha holdout edges. |
| **Texture** | Plate source texture (`Texture2D` or `MediaTexture`), usually selected from a **Media Profile** video input. |
| **Media Passes** | Passes applied before rendering as a series of pre-processing steps onto the plate.Media passes will usually host passes such as the **Centered Scale** pass (to counteract overscan) or the **Color Keyer** pass. |
| **Layer Passes** | Passes applied during post-processing, before integration with other layers. |
| **Mode** | **Composite Mesh** mode will sample the built-in custom render pass, while **Texture** mode will sample the processed plate texture directly (see diagrams below). |

[image: Example render pipeline with media, scene, and layer passes.] Example render pipeline with media, scene, and layer passes.

For comparison, when the **Texture** mode is enabled on the plate layer, the pipeline changes as follows:

[image: The-pipeline-is-changed-since-the-texture-mode-is-applied]

### Scene Capture

`UCompositeLayerSceneCapture`: Renders a subset of actors from a composite, managed scene-capture and merges the result.

[image: Scene-capture-options]

#### Properties

| Property | Description |
| --- | --- |
| **Actors** | List of meshes that auto‑drives the capture’s `ShowOnlyComponents`. |
| **Custom Render Pass** | Optionally runs as a **Custom Render Pass** inline with the main renderer. Custom Render Passes are fast, minimal scene captures without lighting and anti-aliasing. |
| **Layer Passes** | Render target processing passes, for example **SMAA** or **FXAA** on an aliased custom render pass.The **Scene Capture** layer automatically creates a scene capture component on the **Composite Actor**. Its properties can be further adjusted as needed. |

### Single Light Shadow

`UCompositeLayerSingleLightShadow`: Captures a single light (currently Directional) shadow map (Percentage-Closure Filtering (PCF), non‑cascaded) and builds a shadow matte.

[image: Single-light-shadow-options]

Through its use of custom render passes for depth rendering, this layer is significantly faster than the alternative `UCompositeLayerShadowReflection`, but produces limited/lower quality shadows. Reflections are not included with this layer.

#### Properties

| Property | Description |
| --- | --- |
| **Light** | The reference light, whose exact transform will be used to render a shadow map.Please make sure the light is aligned to your shadow-casting scene by **piloting the light**. Only directional lights are currently supported. |
| **Orthographic Width** | The desired width (in world units) of the shadow map view (ignored if light is not directional). Reduce size to only contain the shadow casting geometry in view of the light. |
| **Shadow Map Resolution** | Resolution of the shadow map texture. Lower resolutions will cause more blurry shadows, but require a higher shadow bias. |
| **Shadow Strength** | Basic shadow strength multiplier, from 0 to 1. |
| **Shadow Bias** | Shadow bias to avoid shadow acne. Increase until unwanted shadowing disappears (automatically scaled by `r.Shadow.CSMDepthBias` console variable). |
| **Shadow Casting Content** | (optional): List of shadow casting actors to be removed from the main camera view's scene depth. This helps create a cleaner shadow matte preventing aliased dark edges around CG objects. |

### Shadow & Reflection Catcher

`UCompositeLayerShadowReflection`: Produces a shadow / reflection matte to be multiplied on the plate. It uses two captures: one with CG and one without.

#### Properties

| Property | Description |
| --- | --- |
| **Auto-Configure Actors** | Marks the CG as normally visible or as hidden in scene capture, but with shadows / indirect while hidden is enabled. Hidden yields cleaner edges on the multiplicative matte, but loses screen space **Ambient Occlusion (AO)**. |
| **Actors** | List of CG actors from which to catch shadows and reflections. |

#### Current Known Limitations

- Being multiplicative in nature, the reflections currently disappear on colors with zero components.
- Reflections can be incorrectly tinted as they pick up saturated colors in the background.

#### Additional Notes

- With animated skeletal meshes, you may wish to disable `TemporalAA` (manually) on the reflection shadow catcher components hosted on the **Composite Actor**. This can prevent temporal history ghosting with moving shadows.
- This layer is significantly heavier than the Single Light Shadow, but should yield better quality results, despite known limitations.

### Processing

`UCompositeLayerProcessing`: Special layer that does not add a new input, it only processes the output of previous layers.

[image: Pipeline-with-a-special-layer]

For more information, see the next section on Passes (-> composure).

One important use case involves two **OpenColorIO (OCIO)** passes to preserve the Unreal Engine’s tonecurve look while forcing the render to be HDR Linear (on the Composite Actor). Without **Academy Color Encoding Specification (ACES 2.0)**, the colors are not perfectly preserved—however, this works well enough in practice.

Please refer to the Open Color IO documentation: Color Management with Open Color IO (-> color-management-with-opencolorio-in-unreal-engine).

Forcing the main render to HDR Linear can help avoid incorrect blending artifacts, which could manifest as overlight bright colors in alpha gradients.

## Passes

**Passes** are small, reusable image processors added on each layer’s secondary input, such as a media texture or a scene capture render.

#### Color Keyer

`UCompositePassColorKeyer`: Production‑oriented keyer with chroma keying, clean‑plate support, spill removal, optional pre‑denoise, and multiple visualization modes. You can turn on Chroma Projection keying with the `Composite.ColorKeyer.UseChromaProjection` console variable.

#### Key Properties

| Property | Description |
| --- | --- |
| **Screen Type** | Backing channel for the legacy keyer. Chroma Projection derives its direction from the Key Color or Clean Plate instead, and the editor hides this setting while Chroma Projection is on. |
| **Key Color** | Static background key color. |
| **C****lean Plate** | Clean plate background for calculating color differences per pixel, instead of the static key color. Resolution must match the composite actor render resolution. You can also capture a clean plate from a script with the Capture Clean Plate function. |
| **R****ed / Green / Blue Weights** | The weight of each channel that contributes to the key matte. The legacy keyer ignores the weight of the selected backing channel; Chroma Projection weights the channels opposing the key color. |
| **Alpha Threshold** | Keeps any alpha value outside the specified threshold range to zero or one respectively, with linear interpolation in-between. |
| **De-spill Strength** | Strength of the spill reduction, 0.0: none, 1.0: full. |
| **D****e-vignette Strength** | Strength of the vignette removal. Used to improve plate uniformity & remove darker corners. |
| **Preserve Vignette After Key** | When enabled, we undo de-vignetting before outputting the keyed plate. |
| **Denoise Method** | Denoising method applied before the keyer (None, Median3x3). |
| **Visualization** | Visualize the alpha key or fill. |
| **Invert Alpha** | Invert this key before multiplying by existing input coverage. |
| Input Is Premultiplied | Whether the input RGB is premultiplied by opacity. Disable for straight-alpha sources. The output is always premultiplied, so leave this enabled when chaining keyers. Enabled by default. |

### Centered Scale

`UCompositePassCenteredScale`: Scale footage to counteract overscan or uncropped footage with black bars (top / bottom bars are letterboxing, left / right bars are pillarboxing). Properties can be automatically derived from the Composite Actor’s camera component reference.

#### Properties

| Property | Description |
| --- | --- |
| **Scale Mode** | Centered scale calculation mode used to rescale a media texture with black bars into an already constrained aspect ratio viewport.**None**: No constraint applied.**Automatic**: Automatically derive aspect ratio from the parent layer media texture & composite actor camera.**AspectRatio**: Calculate the scaling factor from source & target aspect ratios.**Manual**: Manually define the scaling factor. |
| **Source Aspect Ratio** | Source container aspect ratio (or resolution). |
| **Target Aspect Ratio** | Embedded target aspect ratio (or resolution), without black bars. |
| **Scale Factor** | Manual scale factor. |
| **O****verscan Uncrop Mode** | Uncrop calculation mode used to uncrop a viewport cropped in by overscan.**None**: No crop applied.**Automatic**: Automatically derive the overscan crop factor from the parent composite actor camera reference.**Manual**: Manually define the overscan crop factor. |
| **Overscan** | Manual overscan to uncrop, with values from 0.0 to 1.0 matching the source camera overscan. |

### Color Grade

`UCompositePassColorGrade`: Apply regular Unreal Engine color grading. See tonemapper documentation for color grading controls: Color Grading and the Filmic Tonemapper (-> color-grading-and-the-filmic-tonemapper-in-unreal-engine).

### OpenColorIO

`UCompositePassOpenColorIO`: Applies an `OpenColorIO` transform. See our documentation on `OpenColorIO` here: OpenColorIO Quick Start Guide (-> opencolorio-quick-start-for-unreal-engine).

### FXAA

`UCompositePassFXAA`: Non-temporal anti-aliasing for CG. Expose Quality (0–5).

### SMAA

`UCompositePassSMAA`: Non-temporal anti-aliasing for CG. Expose Quality (0–5) analogous to `r.fxaa.quality` scale.

### Sharpen

`UCompositePassSharpen`: Sharpens the image with either an unsharp mask or an edge-aware filter.

| Property | Description |
| --- | --- |
| Method | Sharpening method. Unsharp Mask (default) subtracts a blurred copy and adds the difference back. Edges sharpen only where there is an edge, so flat areas and plate grain are left alone. |
| Amount | Sharpening strength:0 disables the pass1 is full strength for the chosen method |
| Radius | Unsharp Mask only. Radius of the blur that Unsharp Mask subtracts, in pixels. Larger radii sharpen coarser detail. |
| Threshold | Unsharp Mask only. Detail below this contrast is left alone, so plate grain and sensor noise are not amplified. |
| Edge Threshold | Edges only. Luminance gradient at which Edges reaches full strength. |
| Sharpen Alpha | Sharpen alpha as well as color. Enabled by default. |

### Resample

`UCompositePassResample`: Resamples the image to a target resolution and back to the output resolution.

| Property | Description |
| --- | --- |
| Mode | Set the target resolution in pixels (**Resolution**) or as a percentage of the output resolution (**Scale**). |
| Target Resolution | **Resolution **mode only. Target resolution in pixels. |
| Match Aspect Ratio | **Resolution **mode only. Calculates the target height from the target width using the output aspect ratio. |
| Scale | **Scale **mode only. Target resolution as a percentage of the output resolution. |
| Downsample Filter | Filter used to resample the image to the target resolution. |
| Upsample Filter | Filter used to resample the image from the target resolution back to the output resolution. |
| Filter In Linear Space | Filters gamma or sRGB input in linear space, then restores its original encoding. |

### Render Target Extraction

`UCompositePassRenderTargetExtraction`: Copies the image at its point in the pass stack into a render target asset, without changing the rest of the pipeline.

| Property | Description |
| --- | --- |
| Render Target | Destination render target that receives the image at this point in the pass stack. |
| Match Source Resolution | Resizes the render target asset to match the source resolution. When disabled, the source is rescaled to the render target's size. |
| Convert To Linear | Decodes the extracted color to linear using the source’s color encoding, and is enabled by default. To find it, expand the Show **Advanced **options at the bottom of the **Composite **category in the pass’s **Details **panel. |

### Transform 2D

`UCompositePassTransform2D`: Moves, rotates, scales, mirrors and crops the layer input. You can edit it directly in the level viewport with the Transform 2D gizmo.

To use the Transform 2D gizmo:

- In the Composure window, select a single Transform 2D pass.
- Pilot the composite camera. The gizmo appears in the level viewport.
- Use the gizmo to adjust the image:To move the image, drag the center.
- To scale the image, drag the scale box.
- To rotate the image, drag the rotation handle.
- To crop the image, drag a frame edge. To feather the edge, hold Shift while you drag.
- To mirror the image, click the flip buttons in the top-right corner.

To see every gizmo control and shortcut, hover over the **?** button in the top-right corner.

If a Level Sequence is open, changes you make with the gizmo can be keyed automatically.

#### Properties

| Property | Description |
| --- | --- |
| Translation | 2D offset in normalized viewport coordinates. Positive Y moves the image up. |
| Rotation Angle | Counter-clockwise rotation in degrees. A Level Sequence can animate it past 360 degrees. |
| Scale Mode | How to fit the video into the camera viewport: automatically, from aspect ratios, by removing black bar padding (Unpad), or manually. |
| Uniform Scale | Manual mode only. Uses a single scale for both axes. Disable to scale X and Y independently. |
| Manual Scale | Manual mode only. Scale factor. Values above 1 zoom in; values below 1 zoom out. |
| Pivot | Normalized pivot point for rotation and scale. (0.5, 0.5) is the viewport center. |
| Crop | Crops the image to a rectangle and makes everything outside it transparent, so underlying layers show through. Use the gizmo's frame edges, or Crop Insets and Crop Softness Per Side under Advanced. |
| Crop Insets | Advanced. How far each side is cropped inward, as a fraction of the frame:X = leftY = topZ = rightW = bottomlook |
| Crop Softness Per Side | Advanced. Feather of each cropped edge, as a fraction of the frame height. 0 gives a hard edge. |
| Crop Falloff | Shape of the feathered edge's fade: Straight rampEased S-curveSoft Gaussian roll-off (default)Sharp fade |
| Mip Filtering | When the transform shrinks the image, filters it with mips so fine detail stays smooth instead of aliasing. |

### Distortion (UCompositePassDistortion)

`UCompositePassDistortion`: Applies Distort using the lens distortion scene-view extension.

This pass is automatically applied, and only accessible via code or Blueprint.

Follow our Lens Calibration Quick Start Guide (-> camera-lens-calibration-quick-start-for-unreal-engine) to learn more about lens distortion.

## Scripting

You can set up a composite from Python or Editor Utility Blueprints with the Composite Editor Library, in the **Composite | Editor** category. Its functions can:

- Create a default Composite Actor
- Add, remove, move and duplicate layers and passes
- Create composite mesh actors
- Create depth mesh actors and sky spheres for plates
- Generate depth grid meshes
- Capture clean plates
- Bind composite objects to an open Level Sequence

- composure

On this page

- Our Motivation (-> composure)
- What is in Scope (-> composure)
- Who will Benefit (-> composure)
- Legacy Composure (-> composure)
- Overview (-> composure)
- 3D vs. 2D Workflow (-> composure)
- 3D with Composite Meshes (Recommended) (-> composure)
- 2D Only (-> composure)
- Getting Started (-> composure)
- Actors and Components (-> composure)
- Composite Actor (-> composure)
- Properties (-> composure)
- Composite Mesh Actor & Component (-> composure)
- Automatically Managed Components (-> composure)
- Layers (-> composure)
- Layer Base Class (-> composure)
- Plate (-> composure)
- Properties (-> composure)
- Scene Capture (-> composure)
- Properties (-> composure)
- Single Light Shadow (-> composure)
- Properties (-> composure)
- Shadow & Reflection Catcher (-> composure)
- Properties (-> composure)
- Current Known Limitations (-> composure)
- Additional Notes (-> composure)
- Processing (-> composure)
- Passes (-> composure)
- Color Keyer (-> composure)
- Key Properties (-> composure)
- Centered Scale (-> composure)
- Properties (-> composure)
- Color Grade (-> composure)
- OpenColorIO (-> composure)
- FXAA (-> composure)
- SMAA (-> composure)
- Sharpen (-> composure)
- Resample (-> composure)
- Render Target Extraction (-> composure)
- Transform 2D (-> composure)
- Properties (-> composure)
- Distortion (UCompositePassDistortion) (-> composure)
- Scripting (-> composure)

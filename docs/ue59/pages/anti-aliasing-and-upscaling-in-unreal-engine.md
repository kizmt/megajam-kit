# Anti-Aliasing and Upscaling

https://dev.epicgames.com/documentation/en-us/unreal-engine/anti-aliasing-and-upscaling-in-unreal-engine?application_version=5.9

> A high level overview of the Anti Aliasing options available in Unreal Engine.

[image: Anti-Aliasing and Upscaling]

**Anti-Aliasing** is the process of removing jagged, or stair-stepped, lines on edges and objects that should otherwise be smooth. There are different methods of anti-aliasing used to reduce these types of visual artifacts. Some are developed for use with specific renderers and platforms, while others are ideal for improving performance and fidelity.

 [image: No anti-aliasing applied to the scene.]

 [image: With anti-aliasing applied to the scene.]

## Anti-Aliasing Methods

Many different methods of anti-aliasing have been developed. Unreal Engine provides several methods to choose from depending on the needs and requirements of your project. You can choose between anti-aliasing methods for desktop / console and mobile platforms.

Unreal Engine provides the following methods of anti-aliasing for your projects.

| Anti-Aliasing Method | Desktop / Console: Deferred Renderer | Desktop / Console: Forward Renderer | Mobile: Deferred Renderer | Mobile: Forward Renderer |
| --- | --- | --- | --- | --- |
|  | Y | Y | N | N |
| Temporal Anti-Aliasing Upsampling (TAAU) (-> anti-aliasing-and-upscaling-in-unreal-engine) | Y | Y | Y | N |
| Fast Approximate Anti-Aliasing (FXAA) (-> anti-aliasing-and-upscaling-in-unreal-engine) | Y | Y | Y | N |
| Multi-Sample Anti-Aliasing (MSAA) (-> anti-aliasing-and-upscaling-in-unreal-engine) | N | Y | N | Y |

Use the image slider below to switch between no anti-aliasing and the available anti-aliasing methods to compare their result. These are single frame captures that show a static scene. To see the clearest results of anti-aliasing, you should test in a scene where you have different types of assets and materials and where you can freely move around.

 [image: Drag the slider to see the scene when using no anti-aliasing, TSR, TAA, FAA, or MSAA (Forward Renderer).] [image: Drag the slider to see the scene when using no anti-aliasing, TSR, TAA, FAA, or MSAA (Forward Renderer).] [image: Drag the slider to see the scene when using no anti-aliasing, TSR, TAA, FAA, or MSAA (Forward Renderer).] [image: Drag the slider to see the scene when using no anti-aliasing, TSR, TAA, FAA, or MSAA (Forward Renderer).] [image: Drag the slider to see the scene when using no anti-aliasing, TSR, TAA, FAA, or MSAA (Forward Renderer).]

**Drag the slider to see the scene when using no anti-aliasing, TSR, TAA, FAA, or MSAA (Forward Renderer).**

## Anti-Aliasing Scalability Settings

Anti-aliasing settings have their own scalability group in the **Engine Scalability Settings** to scale GPU costs directly related to the anti-aliasing quality for each of the methods. The scalability group controls the console variables for each of the respective anti-aliasing methods.

You can access the **Anti-Aliasing** scalability settings from the **Settings** dropdown menu under **Engine Scalability Settings**.

[image: Opening the Engine Scalability Settings]

You can control the quality by choosing an option between **Low**to **Cinematic**, or use **Auto** if you want the editor to test your system and choose the best options. Alternatively, you can adjust the quality of specific features, such as anti-aliasing or shadows.

[image: Engine Scalability Settings Quality Options]

Each of the Engine Scalability Settings entries corresponds to a set of configurable console variables found in the **DefaultScalability.ini** file. You can edit these to better fit your project based on the quality settings you want.

Refer to Scalability Settings for more information on setting up and configuring console variables. This is an advanced workflow.

## Choose an Anti-Aliasing Method

Open the **Project Settings** from the main menu under **Window**. In the Project Settings, anti-aliasing settings are found in the **Engine > Rendering** settings.

For **Desktop / Console** platforms, anti-aliasing settings are located under the **Default Settings** section.

[image: Rendering Project Settings Anti-Aliasing settings]

For **Mobile** platforms, anti-aliasing settings are located under the **Mobile** section.

[image: Rendering Project Settings Mobile Anti-Aliasing Settings]

## Temporal Super Resolution

**Temporal Super Resolution** (or TSR) is a platform-agnostic temporal upscaler using an algorithm that focuses primarily on investing more GPU cycles of a frame into temporal upscaling quality to save total GPU frame cost. It does this by rendering a significantly lower internal resolution than what Temporal Anti-Aliasing Upsampling in Unreal Engine 4 could do.

TSR provides a native high-quality upsampling technique that meets the demand of next-generation games through the amount of detail and fidelity possible with Nanite micropolygon geometry.

The comparison below demonstrates the quality and performance difference of captured frames rendered at native 4K resolution with 1080p resolution upscale to 4K. TSR makes it possible to achieve image quality near 4K resolution while also reducing GPU frame time by half.

 [image: 4k frames rendered at native 4K resolution | Frame time: 57.50ms]

 [image: 4k frames rendered at 1080p resolution (r.ScreenPercentage=50) | Frame Time 33.37ms]

Each of the images in the comparison above are 4K images that are limited to the width of this page. To see their fully uncompressed resolution, right-click on either and save them to your computer, or open them in a new browser window.

Temporal Super Resolution has the following properties:

- Rendered frames approach the quality of native 4K with input resolutions as low as 1080p.
- Less "ghosting" artifacts against high-frequency backgrounds than were visible with Unreal Engine 4's default Temporal Anti-Aliasing method.
- Reduced flickering on geometry with high complexity.
- Supports Dynamic Resolution (-> dynamic-resolution-in-unreal-engine) scaling on console platforms.
- Runs on any hardware that supports D3D11, D3D12, Vulkan, Metal, PlayStation 5, and Xbox Series S | X.
- Shaders are optimized specifically for PlayStation 5 and Xbox Series S | X GPU architectures.

For more information, see Temporal Super Resolution (-> temporal-super-resolution-in-unreal-engine).

### Additional Topics

- [image: Thin Geometry Detection with Temporal Super Resolution] Thin Geometry Detection with Temporal Super ResolutionA detection system that deals with sub-pixel geometry to improve image stability. (-> thin-geometry-detection-with-temporal-super-resolution)

- [image: Temporal Super Resolution Frequently Asked Questions] Temporal Super Resolution Frequently Asked QuestionsQuestions and answers to common questions related to Temporal Super Resolution. (-> temporal-super-resolution-frequently-asked-questions-for-unreal-engine)

## Temporal Anti-Aliasing Upsampling

**Temporal Anti-Aliasing Upsampling** (or TAAU) samples different locations within each frame and uses past frames to blend samples together to remove and smooth jagged edges.

 [image: Without any anti-aliasing.]

 [image: With Temporal Anti-Aliasing Upsampling]

The quality of TAAU is controlled using the console variable `r.TemporalAA.Quality`. You can choose from the following values:

- **0:** Disables input filtering.
- **1:** Enables input filtering.
- **2:** Enables input filtering with mobility-based anti-ghosting (default)

You can use the **Engine Scalability Settings** to change the quality of anti-aliasing.

In the rendering chain, TAAU uses the Temporal Upscaler configuration with Screen Percentage by default.

[image: Temporal Anti-Aliasing Upsampling with Primary Screen Percentage less than 100%.]

### Disabling Temporal Upsampling

To simplify the process of migrating projects from Unreal Engine 4 to Unreal Engine 5, Temporal Upsampling can be disabled to use the Spatial Upscaler for primary Screen Percentage.

To do so, in the UE5 Project Settings under **Engine > Rendering > Default Settings**, disable the **Temporal Upsampling** setting.

[image: Rendering Project Settings Temporal Upsampling checkbox]

When disabling the setting, the rendering chain for Temporal Anti-Aliasing will look like this:

[image: Spatial and Temporal Upsample with primary screen percentage less than 100%]

### TAAU-Specific Shader Permutations for Screen Percentage

TAAU includes its own shader permutation for primary Screen Percentage ranges:

- **50 - 70** renders faster because it uses a smaller LDS tile in memory.
- **71 - 100** is useful for "normal" DPI rendering on desktop and base consoles.

You can set the primary **Screen Percentage** in the Level Editor **Viewport Options** dropdown menu.

[image: Level viewport Options setting the Primary Screen Percentage]

## Fast Approximate Anti-Aliasing

**Fast Approximate Anti-Aliasing** (or FXAA) is a spatial-only anti-aliasing technique that is a post-processing effect that uses a high contrast filter to find edges and smooth them by blending (dithering) between the pixel edges. As the name suggests for this technique, it is fast to render and well-suited for low-end devices and desktops.

While this technique is fast to render, the final image can lose fidelity when compared to other anti-aliasing techniques.

 [image: Without Anti-Aliasing]

 [image: With Fast Approximate Anti-Aliasing]

The dithering quality of FXAA is controlled using the console variable `r.FXAA.Quality`. You can set how many samples are used for dithering to remove jagged edges. More samples equals higher fidelity but at increased GPU cost.

Choose from the following:

- **0:** Console
- **1:** PC Medium dithering using 3 samples
- **2:** PC Medium dithering using 5 samples
- **3:** PC Medium dithering using 8 samples
- **4:** PC Low dithering using 12 samples (Default)
- **5:** PC Extreme dithering using 12 samples.

You can also use the **Engine Scalability Settings** to change the quality of anti-aliasing.

In the spatial and temporal upsampling chain, the Spatial Upscaler happens at the end of the post processing chain for the primary Screen Percentage.

[image: Spatial and Temporal Upsample with primary screen percentage less than 100% for FXAA]

## Multi-Sample Anti-Aliasing

This anti-aliasing technique is only available on Mobile and Desktop / Console when using the Forward Renderer (-> forward-shading-renderer-in-unreal-engine).

**Multi-Sample Anti-Aliasing** (or MSAA) is a technique that only smooths parts of the frame. MSAA primarily looks at areas that are issue-prone, like the edges of geometry. Where aliasing problems can occur on edges, MSAA manipulates their color to be between the color of the two pixels that make up the edge. The dithering effect gives the illusion of smoother edges.

 [image: Without Anti-Aliasing | Forward Renderer]

 [image: With Multi-Sampling Anti-Aliasing | Forward Renderer]

The quality of MSAA is dependent on the number of samples it uses to blend colors along edges that it determines to have aliasing. More samples equal better visual quality, but at the cost of higher GPU processing.

You can set the number of samples MSAA uses in the Project Settings under the **Engine > Rendering > Default Settings** with the **MSAA Sample Count** setting. This setting controls the sample count for desktop / console and mobile. Alternatively, you can use the console variable `r.MSAA.Quality` to set the quality.

[image: Rendering Project Setting Multi-Sample Anti-Aliasing options.]

Choose between **2**, **4**, and **8** samples.

 [image: Drag the slider to increase the number of samples that Multi-Sample Anti-Aliasing uses.] [image: Drag the slider to increase the number of samples that Multi-Sample Anti-Aliasing uses.] [image: Drag the slider to increase the number of samples that Multi-Sample Anti-Aliasing uses.] [image: Drag the slider to increase the number of samples that Multi-Sample Anti-Aliasing uses.]

**Drag the slider to increase the number of samples that Multi-Sample Anti-Aliasing uses.**

Unlike other anti-aliasing techniques, MSAA is **not** controlled by the Engine Scalability Settings and must be set using the console variable or its project setting.

In the rendering chain, MSAA primarily resolves geometry aliasing along edges before the Spatial Upscaler. Aliasing from materials, textures, and transparent surfaces are not affected by MSAA.

[image: MSAA plus Spatial Upscaler with primary screen percentage less than 100%.]

## Temporal Upscalers

**Temporal Upscalers** use data from the current and previous frames to produce a high-quality upscaled result. Temporal upscalers all work the same with Unreal Engine, whether they are Unreal Engine 4's Temporal Anti-Aliasing Upscaling (TAAU), Unreal Engine 5's Temporal Super Resolution (-> temporal-super-resolution-in-unreal-engine), or a third-party plugin such as NVIDIA's DLSS 2+ Super Resolution, AMD's FSR 2.0+, and Intel's XeSS.

For more information, see Temporal Upscalers (-> temporal-upscalers-in-unreal-engine).Temporal Super Resolution (TSR)

- rendering
- lighting
- anti aliasing

On this page

- Anti-Aliasing Methods (-> anti-aliasing-and-upscaling-in-unreal-engine)
- Anti-Aliasing Scalability Settings (-> anti-aliasing-and-upscaling-in-unreal-engine)
- Choose an Anti-Aliasing Method (-> anti-aliasing-and-upscaling-in-unreal-engine)
- Temporal Super Resolution (-> anti-aliasing-and-upscaling-in-unreal-engine)
- Additional Topics (-> anti-aliasing-and-upscaling-in-unreal-engine)
- Temporal Anti-Aliasing Upsampling (-> anti-aliasing-and-upscaling-in-unreal-engine)
- Disabling Temporal Upsampling (-> anti-aliasing-and-upscaling-in-unreal-engine)
- TAAU-Specific Shader Permutations for Screen Percentage (-> anti-aliasing-and-upscaling-in-unreal-engine)
- Fast Approximate Anti-Aliasing (-> anti-aliasing-and-upscaling-in-unreal-engine)
- Multi-Sample Anti-Aliasing (-> anti-aliasing-and-upscaling-in-unreal-engine)
- Temporal Upscalers (-> anti-aliasing-and-upscaling-in-unreal-engine)

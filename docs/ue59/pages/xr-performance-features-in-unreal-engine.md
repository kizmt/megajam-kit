# XR Performance Features

https://dev.epicgames.com/documentation/en-us/unreal-engine/xr-performance-features-in-unreal-engine?application_version=5.9

> Information on different performance optmizations for XR.

[image: XR Performance Features]

Due to the demanding rendering requirements XR requires a number of performance optimizations and new rendering modes that are specific to XR have been introduced to Unreal Engine (UE). In the following document we will take a look at these features and how to use them in your UE XR projects.

## Variable Rate Shading and Fixed Foveated Rendering

**Variable Rate Shading (VRS)** is a feature supported on newer GPUs that provides various methods for adjusting the shading rate of pixels in a render target (or targets). The default shading rate in any setup is 1:1, where 1 pixel-shader invocation applies to 1 target pixel on the screen. With VRS, you can specify alternate shading rates, specifically 1x2, 2x1, 2x2, 2x4, 4x2, and 4x4. For example, for 2x2 shading rate, you would see a single pixel shader invocation for a group of 2x2 pixels (4 pixels), and for 4x4 you'd see a single pixel-shader invocation for a 4x4 group (16 pixels).

Shading rate can be applied either on a per-material basis, or via a shading rate image attachment (via Tier 2 VRS).

**Fixed Foveated Rendering** is a technique which can make use of image-based VRS in VR headsets to adjust the shading rate for a target, reducing the shading rate towards the periphery of the view. Due to optical distortion, the GPU ends up throwing away increasing amounts of pixel detail towards the edge of the image, so by applying a VRS image that reduces shading rate further out from the image center, you can improve performance with little perceptual degradation in image quality.

Fixed-foveation uses an attachment generated via compute shader:

The center (black) areas on both sides correspond to the center of each stereo view; darker areas are higher shading rate, with black being full (1x1, 1 pixel-shader invocation per pixel), dark red at half-rate in both x and y (2x2, 1 pixel shader invocation per 4 pixels), and lighter red quarter rate (4x4, 1 pixel shader invocation per 16 pixels).

Initial results with VRS attachments applied to the base pass and transparency passes show significant promise. Currently this is still proof of concept, and it could be applied elsewhere other than base and transparency passes.

### Project Settings

To access VRS settings, from the main menu, go to **Edit > Project Settings**. Then, in the **Project Settings** window, go to **Engine > Rendering > VR**.

### Console Variables

You can use the following console variables:

| Variable | Description |
| --- | --- |
| r.vrs.Enable | Enable or disable VRS across the engine (material-based VRS and any active image-based VRS). |
| r.VRS.EnableImage | Enable or disable image-based VRS only. Per-material VRS will still function if it is enabled and supported. |
| vr.VRS.HMDFixedFoveationLevel | HMD fixed foveated rendering quality and performance setting. |
| vr.VRS.HMDFixedFoveationDynamic | Enable or disable whether fixed-foveation level should adjust based on GPU utilization. |

### Known Limitations

- Only available on Windows devices with DirectX 12 and VRS Tier 2 support, Windows devices with Vulkan and VK_KHR_fragment_shading_rate extension support, and Oculus Quest.
- Not compatible with NVIDIA's DLSS.
- Eye-tracked foveated rendering is currently not supported.

## Instanced Stereo

Instanced Stereo Rendering lessens the performance impact of XR in UE.
Enable this feature by navigating to **Project Settings > Engine > Rendering > Instanced Stereo**, then check the **Instanced Stereo** option.

[image: Instanced Stereo enabled in VR settings] Click for full image.

After **Instanced Stereo** rendering has been enabled, it will require an enginpe restart, and shader recompile.
 The base pass, and early-z pass, works with static meshes, skeletal meshes, srite particles, and mesh particles with the feature turned on (both serial and parallel rendering paths).
 **Instanced Stereo** currently works on PC (DirectX) and PS4 with support for other platforms coming after the initial 4.11 release.
 Here is a video showing Standard Stereo Rendering in VR, versus Instanced Stereo Rendering in VR.

## Multiview Support for Mobile

Certain (supported) mobile devices can now support VR Multiview. Mobile Multiview is similar to Instanced Stereo rendering that is available to desktop PC's, and works by providing an optimized path for Stereo Rendering on the mobile device's CPU. To enable this feature, you will need to do the following:

- From the Main Toolbar, go to **Edit** > **Projects Settings**, to open the Editor's Project Settings.
- Then, go to **Engine** > **Rendering** > **VR**, and look for the **Mobile Multi-View** option.
- Enable the Mobile Multi-View option, and restart Unreal Engine for the changes to take effect.[image: Enable mobile multi-view in the VR settings]

- Mobile Multiview only works with modern Mali-based GPU's.
- This feature is diabled at runtime if you package this project but do not have a compatible GPU.

## Forward Rendering

By default, Unreal Engine uses a Deferred Renderer as it provides the most versatility and grants access to more rendering features.
However, there are some trade-offs in using the Deferred Renderer that might not be right for all VR experiences.
**Forward Rendering** provides a faster baseline, with faster rendering passes, which may lead to better performance on VR platforms.
Not only is Forward Rendering faster, it also provides better anti-aliasing options than the Deferred Renderer, which may lead to better visuals.

Please see the Forward Shading Renderer (-> forward-shading-renderer-in-unreal-engine) documentation for more information on this feature.

## Performance Profiling

To track down assets that are too expensive for VR, you need to profile what your project is doing on the CPU and GPU as much as possible over the lifetime of your project.

- **GPU Profiling** - To activate the GPU profiler, all you need to do is press **CTRL + SHIFT + ,(Comma Key)** together, while running your project. After the keys have been pressed, you will see a new window come up that should look similar to the image below.[image: GPU Visualizer]
- **CPU Profiler** - Profiling what your project is doing on the CPU is a bit more involved than profiling for the GPU. To find out more on how to do this, please refer to the Performance Profiler documents.

## Post Process Settings

Due to the demanding rendering requirements of VR, many of the advanced Post Processing features that are enabled by default should be disabled, or your project could suffer
 from performance problems. To accomplish this in your project, you will need to do the following.

1. Add a Post Process(PP) volume to your level if there is not one already there.
 1. Select the PP volume, and in the **Post Process Volume** section, enable the **Infinite Extent (Unbound)** option so that the settings in the PP volume will be applied to the entire level.

![Enable unbound option for the post process volume(enable-unbound-post-process-volume.png)

1. Expand the **Settings** of the **Post Process Volume**, and then go through each section to disable any active PP settings by enabling that property; clicking on it, and then setting the value from the default (usually 1.0) to **0**, thus disabling the feature.

[image: Lens flare intensity is enabled and set to zero]

When doing this, you won't need to hit every section and set all of the properties to 0. Instead, first disable the really heavy hitting features like Lens Flares, Screen Space reflections, Temporal AA, SSAO, Bloom and anything else that might have an impact on performance.

- performance
- xr

On this page

- Variable Rate Shading and Fixed Foveated Rendering (-> xr-performance-features-in-unreal-engine)
- Project Settings (-> xr-performance-features-in-unreal-engine)
- Console Variables (-> xr-performance-features-in-unreal-engine)
- Known Limitations (-> xr-performance-features-in-unreal-engine)
- Instanced Stereo (-> xr-performance-features-in-unreal-engine)
- Multiview Support for Mobile (-> xr-performance-features-in-unreal-engine)
- Forward Rendering (-> xr-performance-features-in-unreal-engine)
- Performance Profiling (-> xr-performance-features-in-unreal-engine)
- Post Process Settings (-> xr-performance-features-in-unreal-engine)

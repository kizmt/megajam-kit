# GPU Lightmass Global Illumination

https://dev.epicgames.com/documentation/en-us/unreal-engine/gpu-lightmass-global-illumination-in-unreal-engine?application_version=5.9

> Learn about the GPU-based system for generating precomputed lighting data.

[image: GPU Lightmass Global Illumination]

Learn to use this **Beta** feature, but use caution when shipping with it.

GPU Lightmass (GPULM) is a light-baking solution that precomputes complex light interactions from lights which have their mobility set to Stationary or Static, and stores that data in generated lightmap textures that are applied to scene geometry. This system of baking lighting into textures is similar to the CPU-based Lightmass Global Illumination system. However, using the GPU to generate and build lighting data means that you can leverage the latest ray tracing capabilities with DirectX 12 (DX12) and Microsoft's DXR framework.

GPU Lightmass significantly reduces the time it takes to calculate, build, and generate lighting data for complex scenes, achieving speeds comparable to those of distributed builds using Swarm with the CPU-based Lightmass. Additionally, GPULM offers new workflows with interactivity that enables you to edit the scene, then recalculate and rebuild lighting on-the-fly. This workflow is not possible with the CPU-based Lightmass system.

## Enabling GPU Lightmass

Use the following steps to enable GPU Lightmass in your projects.

- Open the **Plugins** tab from the **Edit > Plugins** menu. Under the** Built-In > Editor** category, locate and enable **GPU Lightmass**.[image: Enable the GPU Lightmass plugin]A prompt to restart the Unreal Editor will appear after you enable GPU Lightmass. To save time, modify the following Project Settings before you restart the Editor.
- Open the **Project Settings** window from the **Edit > Project Settings** menu:Under the **Engine > Rendering** category, enable the following:**Hardware Ray Tracing > Support Hardware Ray Tracing**[image: Support hardware raytracing toggle]**Ray Traced Shadows** and **Ray Traced Skylight** are not needed for GPU Lightmass to function. Leave these features disabled unless you need them for your project.
- **Virtual Textures > Enable Virtual Texture Support**
- **Virtual Textures > Enable Virtual Texture Lightmaps**

- Under the **Platforms > Windows** category, set the following:**Targeted RHIs > Default RHI: DirectX 12**

- **Restart** the editor for these changes to take effect.

### Additional Requirements for Setting Up GPU Lightmass

The following are additional suggestions to best work with GPU Lightmass in your projects.

#### Reducing GPU Timeout Detection and Recovery Crashes

Situations where you have a complex scene that puts the GPU under heavy load can cause a timeout delay (or TDR). This subsequently causes a crash to occur within Windows 10. This type of crash impacts not only Unreal Engine but anything on your machine using the GPU. You will typically see a message similar to the one below.

[image: GPU driver crash error message]

It is possible to prevent, or reduce, occurance of these types of crashes by extending the time it takes for the GPU to timeout, giving your GPU time to potentially recover without causing the Editor to close.

See the Movie Render Queue (-> rendering-high-quality-frames-with-movie-render-queue-in-unreal-engine) documentation for details on how to adjust the timeout delay and recovery settings within Windows 10.

#### Disabling Real-Time Ray Tracing Features

Ray Tracing features require a Windows 10 development environment with DirectX 12 and a Ray Tracing-capable NVIDIA GPU.
For additional information, see our Ray Tracing features documentation for a full list of requirements.

GPU Lightmass leverages Microsoft's DXR API for ray tracing, which requires DirectX 12. While ray tracing is required for GPU Lightmass to work, it does not require any additional ray-tracing features, including ray-traced shadows, ambient occlusion, and reflections.

Unless you explicitly want to use those ray tracing features along with baked lighting, it is best to disable all these features. If you require baked lighting with ray traced features, you can have a scene containing both static and dynamic lights. Use the following console command to disable ray tracing effects.

 C++

```
r.RayTracing.ForceAllRayTracingEffects 0
```

r.RayTracing.ForceAllRayTracingEffects 0

Alternatively, you can set this in your project configuration file so that all ray tracing features are disabled when the project loads. Add the following lines to the project's **DefaultEngine.ini** configuration file located in your project's Config folder. Add these lines under the `[/Script/Engine.RendererSettings]` section:

 C++

```
[/Script/Engine.RendererSettings]
	r.RayTracing.ForceAllRayTracingEffects=0
```

[/Script/Engine.RendererSettings]
 r.RayTracing.ForceAllRayTracingEffects=0

#### Configuring GPU Memory

GPU Lightmass requires that there be enough GPU memory available to account for its overhead. With that in mind, the following considerations affect the success of using GPULM to bake complex scenes.

- There must be enough GPU memory to store the entire scene in memory at the lowest level of detail (LOD) mesh, that is, the highest quality LOD mesh.GPULM does not currently take LODs into consideration while baking. See the Limitations of GPU Lightmass (-> gpu-lightmass-global-illumination-in-unreal-engine) section of this page for more details.
- The Virtual Texture system can require significant memory use during light builds. This largely depends on the complexity of your scene and its size.
- There must be enough CPU memory to store all generated lightmaps in RAM. The GPU can swap out lightmaps to the CPU's RAM, but lightmaps are not saved to disk until the entire light bake is completed.
- DX12 generally uses more GPU memory than DX11. If you have a scene that was pushing the limits of your GPU memory in DX11, you may find it difficult to use in DX12 without some sacrafices, due to additional overhead from ray tracing and virtual texture requirements.
- GPULM has its own memory usage requirements for optional settings, like **Irradiance Cache**.

The CPU-based Lightmass system requires a significant amount of memory for large scenes, which could be problematic for light baking. Often using a distributed build with Swarm could mitigate these types of issues. With GPULM, currently the only solution when running out of memory is to optimize the scene by reducing geometric or texture detail, or to upgrade to a GPU with more memory.

#### Using Virtual Texture Lightmaps for In-Editor Previewing

Enabling the Virtual Texture system with Virtual Texture Lightmaps allows for lightmaps to be generated and stored as virtual textures. This has the added benefit of allowing for light builds to update in the level viewport in real time. It also enables editing as the scene is being built instead of having to cancel or wait for the build to complete.

GPULM does not require the Virtual Texturing system to be enabled to simply build lighting but does require it for the interactive and real-time editing functionality. If you do not intend to use virtual texturing in your project or do not require interactive preview, you can forego enabling these and save some overhead while working in the editor.

#### Enabling Multiple GPUs for Building Lighting

Windows 10 version 2004 or newer is required for multi-GPU support.

Multiple GPUs to compute lighting for your project is supported when using an NVIDIA SLI-based GPU that also supports ray tracing. Multi-GPU support is enabled with the following steps.

- Your GPUs must be connected with NVLink bridges and you must enable SLI in the NVIDIA Control Panel.
- In the Unreal Engine **DefaultEngine.ini** file located in your `[Engine Install Path]/Engine/Config` folder, under the `[/Script/Engine.RendererSettings]` section, enable multiple GPUs by adding `r.AllowMultiGPUInEditor=1`.
- Pass the command line argument `-MaxGPUCount=[n]` — where **n** represents the number of GPUs available through SLI — when launching the editor. For example, `-MaxGPUCount=2` would use two GPUs while in multi-GPU mode to compute lighting.Optionally, you can create a shortcut for UnrealEditor.exe and in the **Properties** settings, set the add `-MaxGPUCount=[n]` to the **Target** line.[image: UnrealEditor.exe properties settings]

Once the editor starts, you can confirm you are using Multi-GPU mode by opening the **Output Log** and searching the log for message:

 C++

```
LogD3D12RHI: Enabling multi-GPU with 2 nodes
```

LogD3D12RHI: Enabling multi-GPU with 2 nodes

Performance when using multiple GPUs can decrease the build completion times on average. For example, in medium-sized test scenes using two RTX-2080TIs, build times were found to be about 1.7x faster on average when volumetric lightmaps are not heavily used. Improved speeds for build completion are dependent on a number of factors, such as scene size and complexity, engine feature multi-GPU support, and the number of GPUs being utilized.

GPU Lightmass multi-GPU support is ideally suited for architectural and virtual production-type environments that rely on a single area. Large game-sized levels might encounter memory and virtual texture limitations depending on their complexity and the amount of VRAM available on the GPU. It is possible for architectural and virtual production environments to reach the same limitations as game-size levels if they have a lot of complexity to their design and set up.
Multi-GPU limitations:

- Volumetric Lightmap (-> volumetric-lightmaps-in-unreal-engine) calculation is not yet supported. Scenes that have a significant Volumetric Lightmap computation will see less overall performance gains.
- Irradiance cache is generated locally on each GPU. Depending on the content, you may have slight shading differences between different baked tiles. This can be addressed by increasing the **Irradiance Cache Quality**, or by disabling **Use Irradiance Caching** entirely.
- Texture encoding and denoising are run on the CPU, and are not affected by multi-GPU.

## Using GPU Lightmass

GPU Lightmass has its own panel which you can access through the Level Editor's toolbar. Under the **Build** dropdown menu, select **GPU Lightmass**.

[image: Toolbar Build dropdown showing GPU Lightmass option]

You can dock the GPU Lightmass panel within the Editor, similarly to other panels. Unlike CPU Lightmass, which has most of its properties in World Settings, almost all the settings that affect GPU Lightmass are found within the plugin's own panel, pictured below.

[image: GPU Lightmass Settings docked]

Once you have configured your settings, click **Build Lighting** to start a bake.

[image: GPU Lightmass panel build lighting button]

Use the **Viewport Realtime** checkbox to toggle the viewport's realtime mode. The speed at which GPU Lightmass builds lighting is significantly increased when the viewport has realtime mode disabled. See the Using GPU Lightmass Speed Modes (-> gpu-lightmass-global-illumination-in-unreal-engine) section of this page for more details.

[image: GPU Lightmass panel realtime viewport toggle]

### GPU Lightmass Baking Modes

GPU Lightmass includes two modes with which to bake lighting: **Full Bake** and **Bake What You See (BWYS)**.

[image: GPU Lightmass bake mode dropdown]

- **Full Bake** mode renders the full lightmap resolution for every object in the scene as lighting is being calculated and built. The results aren't visible until the build completes.
- **Bake What You See** mode offers greater flexibility in that you only build lighting for what is visible within the viewport instead of the entire scene. It also enables interactivity during the light building process to recalculate lighting as changes are being made, when the viewport's real-time mode is enabled.

Both of these baking modes are view-dependent, meaning that they first prioritize objects within the view before moving onto other objects in the scene.

In Full Bake mode, GPULM uses the following procedures.

- Every object within the scene is considered, and objects within the current view are prioritized.
- Lighting is baked in texture space at an object's full lightmap resolution, and completed lightmap tiles are sent to the Virtual Texture system to update the display.
- Once all objects have been calculated and a lightmap rendered, encoding takes place and saves the data automatically.

Bake What You See mode offers a non-destructive way of interactively working within a scene with lighting results being calculated (and recalculated) in real-time. It encourages on-the-fly adjustments in areas of your scene where lighting is actively being worked on. Because of this interactivity, the BWYS workflow for light builds differs from that of Full Bake as follows.

- The Runtime Virtual Texture system determines visible tiles at the mipmap level necessary to resolve on screen.
- Lighting is baked in texture space at the resolved mipmap resolution of each tile within the camera view.
- Once all on-screen tiles have completed, BWYS waits indefinitely for the scene or viewport camera to update.
- Pressing the **Save** button starts encoding the final lightmaps. A completed lighting build is not produced for the scene if you choose to save the results; only parts of the scene which were visible on screen have their lighting data ready to be stored and saved.
- Pressing Save does not end the light bake, it only saves any encoded lightmap data that has been generated up to this point. Instead, press **Cancel** to stop the process.

#### Interactive Baking

Interactive baking is readily available for both Full Bake and BWYS modes, prioritizing visible virtual texture tiles that have been mapped to the current camera view; moving the camera will re-prioritize tiles for the current view. While interactive baking is used for both light baking modes, it is most useful used in conjunction with BWYS mode.

Starting BWYS mode kicks off a lighting build that only completes when it is manually stopped. This mode only considers and builds lighting for objects within the camera view. Moving the camera around the scene, changing position or adding/removing objects from the scene, or changing properties of scene Actors cause lighting to be recalculated in real-time. Because this mode requires the lighting results to be manually saved, it is a non-destructive way to work if lighting was previously built for the scene.

#### Using GPU Lightmass Speed Modes

One benefit of GPU Lightmass is that it leverages virtual texturing during light bakes. This enables lighting to be built and displayed in real-time in the editor viewport. It also works progressively if the scene is being edited at the same time and updates the scene lighting accordingly. The drawback to using in-editor previewing in real time is that there is additional overhead of re-rendering frames in the scenes to update the visible result. Disabling this overhead frees up the GPU to work more efficiently and quicker.

When the state of the Level Viewport's **Realtime** mode controls the two speeds at which GPULM operates. When Realtime mode is:

- **On:** GPU Lightmass uses slow mode because of the additional overhead of rendering frames in real-time.
- **Off:** The overhead of rendering the scene in real-time is removed, which significantly increases the speed of lighting builds.

There are three ways to toggle the Level Viewport Realtime mode.

- In the GPU Lightmass panel, use the realtime viewport checkbox to toggle the Realtime mode of the viewport.[image: GPU Lightmass panel realtime viewport toggle]
- Use the Level Viewport Options dropdown menu to toggle **Realtime** mode.[image: Level viewport real time toggle]
- Keyboard shortcut **Ctrl + R**.

In addition to the Realtime mode toggle for the viewport, GPULM also includes settings to increase the speed of lighting builds using some built-in parameters.

[image: GPU Lightmass build speed settings]

- **Realtime Workload Factor** is a multiplier that can improve the speed of a lighting build when **Realtime** mode is toggled **On** in the viewport. Using too high a value can cause the editor to become unresponsive in scenes with lots of geometry.
- **Non-Realtime Workload Factor** is a multiplier that can improve speed of lighting builds when **Realtime** mode is toggled **Off**.

The **Workload Factor** options are not a guarantee that your builds will instantly become faster and these options should be used with caution. The multipliers determine the size of the chunks of work sent to the GPU, and the effectiveness of this size is one of many factors that determines the final speed on the GPU. For example, increasing **Non-Realtime Workload Factor** can make a fast bake go slower in some projects. There is no hard and fast rule for settings that will work in every situation.

### GPU Lightmass Settings

GPU Lightmass contains most of its settings within its own panel.

[image: GPU Lightmass panel]

| Properties | Description |
| --- | --- |
| General |  |
| **Show Progress Bars** | If true, a green progress bar is drawn within each tile as it renders. A red bar indicates the **First Bounce Ray Guiding** is in progress. Bars may appear black in very bright scenes that have their exposure turned down. |
| **Mode** | Choose the baking mode that best fits your development needs:**Full Bake:** This mode renders the full lightmap resolution for every object in the scene.**Bake What You See:** This mode renders only the virtual texture tiles for objects in view, at the mip level determined by the Virtual Texture system. The camera can be moved to render more tiles. This mode only saves its results if you press the **Save** button. |
| Denoising |  |
| **Denoise when** | When enabled, denoising will take place on the CPU after rendering. When deciding when denoising of the lightmap bake should happen, choose between the following options:**None:** Lightmaps will not have any denoising applied to them.**On Completion:** The entire lightmap will have denoising applied when the bake is finished.**During Interactive Preview:** Each tile is denoised as it finishes, which is useful for previewing parts of a scene but is less efficient. |
| **Denoiser** | **Intel Open Image Denoise:** The default option uses the Intel Open Image Denoise library to reduce the overall amount of residual noise in the rendered output.**Simple Firefly Remover:** An alternative denoiser that specifically targets firefly artifacts, or excessively bright specks sometimes caused by small intense light sources. |
| Global Illumination |  |
| **GI Samples** | The total number of ray paths executed per texel across all bounces against surfaces. This should be set to the lowest value that gives artifact-free results with the denoiser. |
| **Stationary Light Shadow Samples** | The number of samples used for lights that have their mobility set to **Stationary**. The shadows are calculated and stored separately from global illumination. |
| **Use Irradiance Caching** | Enable this for interior scenes, to achieve more physically correct global illumination intensities (with some biasing). If not enabled, results may appear darker than expected. Disable for exterior scenes. |
| **Use First Bounce Ray Guiding** | When **Use Irradiance Caching** is enabled, this option searches the hemisphere over each first bounce sample to find the brightest directions to weigh the rest of the samples towards. It improves results for interior scenes with specific sources of light, such as a window. The quality of this pass is controlled with the **Trial Samples** setting. |
| Volumetric Lightmap |  |
| **Quality Multiplier** | Enables you to allocate more Global Illumination samples into Volumetric Lightmaps to reduce noise. |
| **Detail Cell Size** | Sets the size of the Volumetric Lightmap voxel at the highest density used around geometry in the scene, in world space units. |
| Irradiance Caching |  |
| **Quality** | The number of samples per Irradiance Cache cell. |
| **Agressive Leak Prevention** | When enabled, use Irradience Cache Backface Detection to prevent light leaks at the cost of more fireflies and slower speed. Recommended when Irradience Cache Quality is >=256. |
| **Size** | The size of each Irradiance Cache cell. Smaller sizes will be slower but more accurate. |
| **Corner Rejection** | Provides better control over rejection of Irradiance Cache entries around corners, helping reduce light leaking and artifacts that can happen. |
| **Debug: Visualize** | When enabled, the Irradiance Cache cells are visible. It's useful for setting the Irradiance Cache cell size and its quality. The visualization may appear black in very bright scenes that have their exposure turned down. |
| First Bounce Ray Guiding |  |
| **Trial Samples** | The number of samples used for **First Bounce Ray Guiding**, which are thrown away before sampling for lighting. |
| System |  |
| **Realtime Workload Factor** | Control the baking speed with this multiplier when the viewport has **Realtime** mode enabled. |
| **Non-Realtime Workload Factor** | Control the baking speed with this multiplier when the viewport has **Realtime** mode disabled. |
| **Lightmap Tile Pool Size** | The pool of visible tiles which GPU Lightmass manages for calculations. The pool size should be set based on the size of the viewport and how many tiles will be visible on screen at once. Increasing the pool size increases GPU memory usage. |

The **Volumetric Lightmap Detail Cell Size** sets the size of a Volumetric Lightmap voxel at the highest density around geometry in the scene. Decreasing the size of the voxel can significantly increase the time it takes to build lighting and the amount of memory that gets used. In some cases, halving this value can increase memory by up to a factor of eight.

[image: Volumetric Lightmap Detail Cell Size]

#### Setting Up Lightmap UVs and their Resolutions

Baking lighting requires that each Static Mesh have its own Lightmap UV and that the UV charts (also called UV islands) are all contained within the 0-1 texture space and have no overlapping or wrapping pieces. This ensures that when lighting is calculated that no artefacts occur due to a bad lightmap UV.

You can learn more about setting up lightmap UVs and generating them within Unreal Engine by taking a look at these pages:

- Unwrapping UVs for Lightmaps (-> understanding-lightmapping-in-unreal-engine)
- Auto-Generating Lightmap UVs (-> generating-lightmap-uvs-in-unreal-engine)

Setting up a good Lightmap UV is the first step to getting a quality light bake for your object's geometry. Next, it's important to make sure that the lightmap texture applied to your geometry has enough resolution to capture all the necessary light and shadow detail. This means changing the lightmap resolution per object, as needed. You can do this in one of two ways:

- Set the **Light Map Resolution** of the object using the **Static Mesh Editor**.[image: Static Mesh Editor light map resolution setting]
- Select a **Static Mesh Actor** in the scene and, in the **Details** panel under the **Lighting** category, set a new lightmap resolution for this individual Actor using its **Overridden Light Map Res** property.[image: Overriden light map res property in details panel]

#### Controlling the Number of Light Bounces

The number of light bounces within any given scene is not controllable. Instead, GPULM uses a Russian Roulette algorithm, which takes into account various probabilities and weighting calculations to determine how many bounces any given ray being cast will take. This also means that light bounces unlikely to contribute to indirect lighting and illumination of the scene are more likely to be terminated.

The **GI Samples** property of GPULM controls the maximum number of path-traced segments for each texel (or pixel within a texture map), including spatial samples and bounce segments. Increasing the number of GI Samples increases the number of both the spatial samples and (potentially) the depth samples.

#### Choosing a Denoising Option

GPU Lightmass relies on denoising methods provided by Intel's Open Image Denoise library to remove noise and smooth the results of the final lightmap renders.

There are three options to choose from when considering how you want your light bakes to be denoised. Use the **Denoise when** dropdown to make your selection:

[image: GPU Lightmass denoise setting options dropdown]

- **None**: No denoising is applied to the lighting render. This can be useful to determine a number of **GI Samples** to use for a given scene. For example, if you noticed artifacts being introduced by the denoiser, increasing the samples and possibly other settings, such as Irradiance Cache and First Bounce Ray Guiding, provide the denoiser with higher quality input.
- **On Completion**: Denoises the results of the light build on the CPU after rendering. The entirety of the scene's lightmaps are denoised when the light build is finished.
- **During Interactive Preview**: Denoises each virtual texture tile as it completes. This can be useful for seeing final results more quickly but is less efficient because it requires transferring each tile off the GPU to denoise on the CPU, and then back to the GPU to display.

The comparison below shows a completed light build with and without denoising applied.

 [image: Denoising Disabled]

 [image: Denoising Applied to Final Result]

## Limitations of GPU Lightmass

Below are some of the known limitations of the current implementation of GPULM. This is not an exhaustive list and is intended to give you a rough idea of the support of core features. Keep in mind that some features in this list may never be supported while many will be resolved in future releases of the engine.

| Feature | Supported (Yes/No/Partially) | Description |
| --- | --- | --- |
| **Distributed Baking** | N | There are currently no plans to support distributed builds by Swarm Agent for GPULM. The current strategy is to focus on support for multiple GPUs and rely on their power and memory capacity. |
| **Multiple GPU** | Yes | Requires NVIDIA cards that support NVLink or SLI. |
| **Translucent Shadows** | Y | Translucent and colored translucent shadows are now supported. |
| **World Position Offset** | N |  |
| **Pixel Depth Offset** | N | GPULM does not take into account PDO, which could lead to lighting discontinuities. |
| **Stationary Sky Light** | N | Support is planned in a future release of the engine. |
| **Lighting Channels** | N |  |
| **Lighting Scenarios** | Y |  |
| **Custom Settings and Properties of Lights** | N | The following lights settings are not yet supported with GPULM:Indirect Lighting IntensitySource Texture (with exception of Rect Lights)Some of these settings can be used partially with **Stationary** lights. The baked GI will not honor the feature, but the dynamic direct lighting from the light source will. |
| **Precomputed Ambient Occlusion** | N |  |
| **Lightmass Portals** | N | This is partially handled by the First Bounce Ray Guiding property of GPULM. |
| **Lightmass Importance Volume** | Partially | These volumes are not used to make distinction between areas of the scene to control quality. Instead, they are used for determining placement of Volumetric Lightmaps. |
| **Volumetric Lightmaps** | Y | These are honored by GPULM. Their placement can be done by using Lightmass Importance Volumes around the level, but it is not required. Settings for Volumetric Lightmap Detail Cell Size and are found in the GPULM panel.. The Volumetric Lightmap is always rendered in full, even when using Bake What You See mode. |
| **Level of Detail Meshes** | Y |  |
| **Lightmass World Settings and Per-Object Settings** | N | There are many settings to tweak the results of lightmass for the CPU-based workflow. Most of these settings are not used with GPULM and do not have equivalent features or settings. |

- beta
- rendering
- lighting
- global illumination

On this page

- Enabling GPU Lightmass (-> gpu-lightmass-global-illumination-in-unreal-engine)
- Additional Requirements for Setting Up GPU Lightmass (-> gpu-lightmass-global-illumination-in-unreal-engine)
- Reducing GPU Timeout Detection and Recovery Crashes (-> gpu-lightmass-global-illumination-in-unreal-engine)
- Disabling Real-Time Ray Tracing Features (-> gpu-lightmass-global-illumination-in-unreal-engine)
- Configuring GPU Memory (-> gpu-lightmass-global-illumination-in-unreal-engine)
- Using Virtual Texture Lightmaps for In-Editor Previewing (-> gpu-lightmass-global-illumination-in-unreal-engine)
- Enabling Multiple GPUs for Building Lighting (-> gpu-lightmass-global-illumination-in-unreal-engine)
- Using GPU Lightmass (-> gpu-lightmass-global-illumination-in-unreal-engine)
- GPU Lightmass Baking Modes (-> gpu-lightmass-global-illumination-in-unreal-engine)
- Interactive Baking (-> gpu-lightmass-global-illumination-in-unreal-engine)
- Using GPU Lightmass Speed Modes (-> gpu-lightmass-global-illumination-in-unreal-engine)
- GPU Lightmass Settings (-> gpu-lightmass-global-illumination-in-unreal-engine)
- Setting Up Lightmap UVs and their Resolutions (-> gpu-lightmass-global-illumination-in-unreal-engine)
- Controlling the Number of Light Bounces (-> gpu-lightmass-global-illumination-in-unreal-engine)
- Choosing a Denoising Option (-> gpu-lightmass-global-illumination-in-unreal-engine)
- Limitations of GPU Lightmass (-> gpu-lightmass-global-illumination-in-unreal-engine)

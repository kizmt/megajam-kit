# Optimizing and Debugging Projects for Real-Time Rendering

https://dev.epicgames.com/documentation/en-us/unreal-engine/optimizing-and-debugging-projects-for-realtime-rendering-in-unreal-engine?application_version=5.9

> Concepts and approaches to optimizing and debugging your projects for real-time rendering with features and tools available in Unreal Engine.

[image: Optimizing and Debugging Projects for Real-Time Rendering]

Optimizing a project is not always a straightforward task and getting the maximum performance can be challenging because it can, at times, be where milliseconds matter most.

## Getting Started Optimizing Your Project

There are multiple places you can start looking to improve performance by optimizing your project. This can start with improving content creation workflows, performing profiling captures to know where time is being spent to render each frame, and using built-in editor tools.

Unreal Engine already does a lot of heavy-lifting to optimize your project for performance without needing to set up anything. But, that doesn't mean that these built-in systems can't be adjusted to fit your project's needs more closely.

The guide below will help you get started in identifying common performance issues and where to look for them. You'll also learn about some of the tools available in the editor that you can use to optimize and improve performance.

- [image: Guidelines for Optimizing Rendering for Real-Time] Guidelines for Optimizing Rendering for Real-TimeOptimization and development best practices for real-time rendering. (-> guidelines-for-optimizing-rendering-for-real-time-in-unreal-engine)

## Rendering Pipeline Optimization

The choice of some optimizations can directly affect the rendering pipeline that Unreal Engine uses. They can improve performance for the project in general or may be well-suited for a specific platform you want to develop for.

For example, Unreal Engine offers multiple rendering paths with a Deferred path (default) and a Forward renderer. For platforms like VR and Mobile, the Forward Renderer can improve performance but it does not support all rendering features of the engine.

In other cases, changes to the rendering pipeline can improve performance by rendering at a lower resolution and upscaling rather than rendering at native resolution, all while maintaining the same visual fidelity as the native resolution.

- [image: Forward Shading Renderer] Forward Shading RendererDescribes the advantages of using the Forward Shading Renderer. (-> forward-shading-renderer-in-unreal-engine)

- [image: Screen Percentage with Temporal Upscale] Screen Percentage with Temporal UpscaleAn overview of using Screen Percentage with Temporal Upsampling. (-> screen-percentage-with-temporal-upscale-in-unreal-engine)

- [image: Dynamic Resolution] Dynamic ResolutionA method of dynamically adjusting the screen percentage to improve performance. (-> dynamic-resolution-in-unreal-engine)

## Configuration Files and Scalability Optimizations

Through console commands and configuration files, you can set properties that scales your project for the type of experience or platform your application is developed for.

Console commands are used to call and set specific properties. These can be used in configuration files and scalability settings to improve quality and performance of the rendered image for development of the project or for the final shipped product. Configuration files can store these callable scalability settings to automatically set them for the project, and they can even be platform-specific.

For example, a configuration file can be set up which has multiple scalability options for a user to select from to make the application run better on lower end hardware, or the configuration file can store presets that are designed for specific platforms to use that best optimize the application to run on it.

- [image: Configuration Files] Configuration FilesInitial settings for configuring gameplay or engine behavior on startup. (-> configuration-files-in-unreal-engine)

- [image: Command-Line Arguments Reference] Command-Line Arguments ReferenceList of command-line arguments available for Unreal Engine. (-> unreal-engine-command-line-arguments-reference)

- [image: Anti-Aliasing and Upscaling] Anti-Aliasing and UpscalingA high level overview of the Anti Aliasing options available in Unreal Engine. (-> anti-aliasing-and-upscaling-in-unreal-engine)

- [image: Ray Tracing Performance Guide] Ray Tracing Performance GuideA selection of topics for improving performance of ray tracing features in your projects. (-> ray-tracing-performance-guide-in-unreal-engine)

- [image: Ray Tracing Performance Guide] Ray Tracing Performance GuideA selection of topics for improving performance of ray tracing features in your projects. (-> ray-tracing-performance-guide-in-unreal-engine)

- [image: Hardware Ray Tracing Tips and Tricks] Hardware Ray Tracing Tips and TricksA collection of topics to aid with development of projects using hardware ray tracing features. (-> hardware-ray-tracing-tips-and-tricks-in-unreal-engine)

- [image: Scalability and The Developer] Scalability and The DeveloperAn overview of Scalability options and considerations for content creators, testers, programmers, and managers. (-> scalability-and-the-developer-for-unreal-engine)

- [image: Scalability Reference] Scalability ReferenceScalability options, properties, and console variables. (-> scalability-reference-for-unreal-engine)

- [image: Stat Commands] Stat CommandsConsole commands specific to displaying game statistics (-> stat-commands-in-unreal-engine)

## Asset Optimization

Optimization of assets in your project starts with the workflows you choose when developing the project. Sometimes this can mean creating those assets in ways that work best with Unreal Engine's tools. Other times, the built-in editor tools can do this work for you.

For example, manually creating level of detail (LOD) meshes for every object can be a time-consuming process. Unreal Engine provides its own automatic tool to generate LODs for your meshes. You can even configure the properties for how LODs are generated manually or let it perform the task automatically.

The built-in tools and systems below can help you to improve performance during development of your project.

- [image: Nanite Virtualized Geometry] Nanite Virtualized GeometryLearn about Nanite's virtualized geometry system and how it achieves pixel scale detail and high object counts. (-> nanite-virtualized-geometry-in-unreal-engine)

- [image: Nanite Virtualized Geometry Overview] Nanite Virtualized Geometry OverviewLearn about Nanite's virtualized geometry system and how it achieves pixel scale detail and high object counts. (-> nanite-virtualized-geometry-in-unreal-engine)

- [image: Visibility and Occlusion Culling] Visibility and Occlusion CullingAn overview of available visibility and occlusion culling methods. (-> visibility-and-occlusion-culling-in-unreal-engine)

- [image: Texture Streaming] Texture StreamingSystem for loading and unloading textures into and out of memory during gameplay. (-> texture-streaming-in-unreal-engine)

- [image: Creating and Using LODs] Creating and Using LODsHow To Create and Use LODs. (-> creating-and-using-lods-in-unreal-engine)

- [image: Setting Up Per-Platform LODs] Setting Up Per-Platform LODsHow to set up LOD's on a per-platform basis. (-> setting-up-per-platform-lods)

- [image: Static Mesh Automatic LOD Generation] Static Mesh Automatic LOD GenerationHow To use the Automatic LOD Generation system in UE5. (-> static-mesh-automatic-lod-generation-in-unreal-engine)

- [image: Proxy Geometry Tool] Proxy Geometry ToolThe Proxy Geometry tool set was developed as a way to increase your Unreal Engine 4 (UE4) projects performance while keeping the visual quality of your project uneffected. (-> proxy-geometry-tool-in-unreal-engine)

## Debugging and Profiling Tools

Unreal Engine provides its own debugging and profiling tools and offers plugins for some external applications. These tools are useful for inspecting and identifying areas to improve performance.

For example, using the visualization modes of the Level Editor can visually identify costs of materials currently being rendered on screen. Profiling tools for the CPU and GPU can capture individual frames and breakdown millisecond cost of what is being rendered. With this type of information, you can see what is taking the longest to render in a single frame. By investigating high-cost line items, it may be possible to optimize those elements further.

The tools below will help you debug and profile elements of your project to look for performance optimization opportunities.

- [image: Using RenderDoc with Unreal Engine] Using RenderDoc with Unreal EngineRenderDoc is a standalone open-source graphics debugger that you can use to perform single-frame captures and inspect them. (-> using-renderdoc-with-unreal-engine)

- [image: Unreal Insights] Unreal InsightsProfile your project's performance with Unreal Insights. (-> unreal-insights-in-unreal-engine)

- [image: GPUDump Viewer Tool] GPUDump Viewer ToolA multi-platform command that dumps intermediary RDG textures and buffers to disk for investigating and debugging rendering issues. (-> gpudump-viewer-tool-in-unreal-engine)

- [image: Render Resource Viewer] Render Resource ViewerA tool to assist in identifying resources and their assets allocated to GPU memory. (-> render-resource-viewer-in-unreal-engine)

- [image: Primitive Debugger] Primitive DebuggerThis is a runtime-only tool to view information about primitives being rendered in the game client. (-> primitive-debugger-in-unreal-engine)

## Other Topics

- [image: How to Fix a GPU Driver Crash] How to Fix a GPU Driver CrashLearn how to fix a GPU driver crash in Windows by editing your registry keys. (-> how-to-fix-a-gpu-driver-crash-when-using-unreal-engine)

- [image: Dealing with a GPU Crash] Dealing with a GPU CrashAn overview of investigating, resolving, and reporting GPU Crashes in Unreal Engine. (-> dealing-with-a-gpu-crash-when-using-unreal-engine)

### Additional Epic-Created Resources

- Unreal Performance Optimization Learning Path

- performance
- rendering
- optimization

On this page

- Getting Started Optimizing Your Project (-> optimizing-and-debugging-projects-for-realtime-rendering-in-unreal-engine)
- Rendering Pipeline Optimization (-> optimizing-and-debugging-projects-for-realtime-rendering-in-unreal-engine)
- Configuration Files and Scalability Optimizations (-> optimizing-and-debugging-projects-for-realtime-rendering-in-unreal-engine)
- Asset Optimization (-> optimizing-and-debugging-projects-for-realtime-rendering-in-unreal-engine)
- Debugging and Profiling Tools (-> optimizing-and-debugging-projects-for-realtime-rendering-in-unreal-engine)
- Other Topics (-> optimizing-and-debugging-projects-for-realtime-rendering-in-unreal-engine)
- Additional Epic-Created Resources (-> optimizing-and-debugging-projects-for-realtime-rendering-in-unreal-engine)

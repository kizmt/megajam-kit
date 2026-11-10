# Designing Visuals, Rendering, and Graphics

https://dev.epicgames.com/documentation/en-us/unreal-engine/designing-visuals-rendering-and-graphics-with-unreal-engine?application_version=5.9

> Rendering subsystem including lighting and shadowing, materials and textures, visual effects, and post processing.

[image: Designing Visuals, Rendering, and Graphics]

Unreal Engine's rendering system is the core of its industry-leading visuals for designing interactive real-time experiences. Here, you'll learn about the features, concepts, and tools used to design and develop your projects that can scale from cinematic film and television quality to next-gen console and mobile platforms with remarkable fidelity.

The topics below can help you in setting up and managing your textures and materials applied to surfaces, learning about conceptual lighting techniques that can be applied when building your virtual worlds, creating stunning visual effects, optimizing and debugging content for performance, and much more.

## Unreal Engine 5 Rendering Features and Tools

- [image: Lumen Global Illumination and Reflections] Lumen Global Illumination and ReflectionsTake a look at a high-level overview of Lumen's dynamic global illumination and reflections features. (-> lumen-global-illumination-and-reflections-in-unreal-engine)

- [image: Lumen Technical Details] Lumen Technical DetailsDive into the technical details of using Lumen's global illumination and reflections features with software or hardware ray tracing. (-> lumen-technical-details-in-unreal-engine)

- [image: Nanite Virtualized Geometry] Nanite Virtualized GeometryLearn about Nanite's virtualized geometry system and how it achieves pixel scale detail and high object counts. (-> nanite-virtualized-geometry-in-unreal-engine)

- [image: Virtual Shadow Maps] Virtual Shadow MapsLearn about the high-resolution shadow techniques designed with film-quality assets and large dynamically lit open worlds in mind. (-> virtual-shadow-maps-in-unreal-engine)

- [image: Substrate Materials] Substrate MaterialsTopics and reference about using the Substrate Materials framework. (-> substrate-materials-in-unreal-engine)

- [image: Path Tracer] Path TracerLearn about the Path Tracer and how you can use it to render high quality images for final shots and ground truth comparisons against the real-time rendered scenes. (-> path-tracer-in-unreal-engine)

- [image: GPUDump Viewer Tool] GPUDump Viewer ToolA multi-platform command that dumps intermediary RDG textures and buffers to disk for investigating and debugging rendering issues. (-> gpudump-viewer-tool-in-unreal-engine)

- [image: Render Dependency Graph] Render Dependency GraphAn immediate-mode API which records render commands into a graph data structure to be compiled and executed. (-> render-dependency-graph-in-unreal-engine)

## Art Setup and Tools

- [image: Textures] TexturesTopics that discuss how and where texture assets are used. (-> textures-in-unreal-engine)

- [image: Materials] MaterialsControlling the appearance of surfaces in the world using shaders. (-> unreal-engine-materials)

- [image: Physically Based Materials] Physically Based MaterialsAn overview of the primary physically based Material inputs and how best to use them. (-> physically-based-materials-in-unreal-engine)

- [image: UV Editor] UV EditorOverview of the UV Editor interface and tools. (-> uv-editor-in-unreal-engine)

## Lighting Concepts and Features

- [image: Lighting the Environment] Lighting the EnvironmentTopics that demonstrate features and tools for lighting scenes. (-> lighting-the-environment-in-unreal-engine)

- [image: Global Illumination] Global IlluminationA collection of topics on the global illumination options available to choose from. (-> global-illumination-in-unreal-engine)

- [image: Lumen Global Illumination and Reflections] Lumen Global Illumination and ReflectionsTake a look at a high-level overview of Lumen's dynamic global illumination and reflections features. (-> lumen-global-illumination-and-reflections-in-unreal-engine)

- [image: Lumen Technical Details] Lumen Technical DetailsDive into the technical details of using Lumen's global illumination and reflections features with software or hardware ray tracing. (-> lumen-technical-details-in-unreal-engine)

- [image: Virtual Shadow Maps] Virtual Shadow MapsLearn about the high-resolution shadow techniques designed with film-quality assets and large dynamically lit open worlds in mind. (-> virtual-shadow-maps-in-unreal-engine)

- [image: Heterogeneous Volumes] Heterogeneous VolumesUse the Heterogeneous Volume component to render volume-domain materials that sample from Sparse Volume Textures. (-> heterogeneous-volumes-in-unreal-engine)

- [image: Sparse Volume Textures] Sparse Volume TexturesAn asset that stores baked simulation data representing volumetric media, such as smoke, fire, and water. (-> sparse-volume-textures-in-unreal-engine)

- [image: Hardware Ray Tracing and Path Tracing Features] Hardware Ray Tracing and Path Tracing FeaturesExplore topics for setting up and using real-time hardware ray tracing and path tracing to render scenes using ray-traced lighting features. (-> ray-tracing-and-path-tracing-features-in-unreal-engine)

- [image: Direct Lighting] Direct LightingAn overview of the various properties and features that lights support. (-> features-and-properties-of-lights-in-unreal-engine)

- [image: Light Types and Their Mobility] Light Types and Their MobilityThe available types of lights to choose from and how their mobility settings affect lighting in the scene. (-> light-types-and-their-mobility-in-unreal-engine)

- [image: Environmental Light with Fog, Clouds, Sky and Atmosphere] Environmental Light with Fog, Clouds, Sky and AtmosphereComponents and tools that enable users to build immersive worlds with environment lighting from fog, clouds, sky and atmosphere. (-> environmental-light-with-fog-clouds-sky-and-atmosphere-in-unreal-engine)

- [image: Mesh Distance Fields] Mesh Distance FieldsAn overview of Mesh Distance Fields and its available features that you can use when developing your games. (-> mesh-distance-fields-in-unreal-engine)

- [image: Reflections Environment] Reflections EnvironmentSystems for how reflections are captured and displayed on reflective surfaces. (-> reflections-environment-in-unreal-engine)

- [image: Shadowing] ShadowingAn overview of available shadowing methods and the properties they support. (-> shadowing-in-unreal-engine)

## General Rendering Features

- [image: Rendering Components] Rendering ComponentsOutlines different types of Rendering Components, including Particle Systems, Decals, and Billboards. (-> rendering-components-in-unreal-engine)

- [image: Skeletal Mesh Rendering Paths] Skeletal Mesh Rendering PathsA high-level overview of the rendering paths available for Skeletal Meshes. (-> skeletal-mesh-rendering-paths-in-unreal-engine)

- [image: Rendering High Quality Frames with Movie Render Queue] Rendering High Quality Frames with Movie Render QueueA how-to guide for configuring the Unreal Engine Movie Render Queue feature to get high-quality cinematics—particularly when using ray tracing. (-> rendering-high-quality-frames-with-movie-render-queue-in-unreal-engine)

- [image: Landscape Materials] Landscape MaterialsA reference guide to Landscape Materials and how to use them with your terrain. (-> landscape-materials-in-unreal-engine)

- [image: Creating and Using LODs] Creating and Using LODsHow To Create and Use LODs. (-> creating-and-using-lods-in-unreal-engine)

- [image: Understanding Lightmapping in Unreal Engine] Understanding Lightmapping in Unreal EngineTechniques and guidelines for setting up lightmap UVs for Static Meshes. (-> understanding-lightmapping-in-unreal-engine)

- [image: Generating Lightmap UVs] Generating Lightmap UVsAn overview of generating your own lightmap UVs in Unreal Engine. (-> generating-lightmap-uvs-in-unreal-engine)

## Visuals and System Tools

- [image: Post Process Effects] Post Process EffectsLearn about the effects that can be applied through placed-volumes and cameras. These art-directed effects can define the look and feel of your scenes with coloring, tonemapping, lighting, and more. (-> post-process-effects-in-unreal-engine)

- [image: Creating Visual Effects] Creating Visual EffectsUse Unreal Engine's Niagara visual effects system to create and preview particle effects in real time. (-> creating-visual-effects-in-niagara-for-unreal-engine)

- [image: Forward Shading Renderer] Forward Shading RendererDescribes the advantages of using the Forward Shading Renderer. (-> forward-shading-renderer-in-unreal-engine)

- [image: Orthographic Camera] Orthographic CameraAn overview of setting up a camera with Orthographic projection. (-> orthographic-camera-in-unreal-engine)

## Performance and Debugging

- [image: Optimizing and Debugging Projects for Real-Time Rendering] Optimizing and Debugging Projects for Real-Time RenderingConcepts and approaches to optimizing and debugging your projects for real-time rendering with features and tools available in Unreal Engine. (-> optimizing-and-debugging-projects-for-realtime-rendering-in-unreal-engine)

- [image: Nanite Virtualized Geometry] Nanite Virtualized GeometryLearn about Nanite's virtualized geometry system and how it achieves pixel scale detail and high object counts. (-> nanite-virtualized-geometry-in-unreal-engine)

- [image: Anti-Aliasing and Upscaling] Anti-Aliasing and UpscalingA high level overview of the Anti Aliasing options available in Unreal Engine. (-> anti-aliasing-and-upscaling-in-unreal-engine)

- [image: Temporal Super Resolution] Temporal Super ResolutionA high-level overview of the Anti Aliasing options available in Unreal Engine. (-> temporal-super-resolution-in-unreal-engine)

- [image: Virtual Texturing] Virtual TexturingAn overview of the available virtual texturing methods in Unreal Engine. (-> virtual-texturing-in-unreal-engine)

- [image: Visibility and Occlusion Culling] Visibility and Occlusion CullingAn overview of available visibility and occlusion culling methods. (-> visibility-and-occlusion-culling-in-unreal-engine)

- [image: Using RenderDoc with Unreal Engine] Using RenderDoc with Unreal EngineRenderDoc is a standalone open-source graphics debugger that you can use to perform single-frame captures and inspect them. (-> using-renderdoc-with-unreal-engine)

- [image: GPUDump Viewer Tool] GPUDump Viewer ToolA multi-platform command that dumps intermediary RDG textures and buffers to disk for investigating and debugging rendering issues. (-> gpudump-viewer-tool-in-unreal-engine)

- [image: Texture Streaming] Texture StreamingSystem for loading and unloading textures into and out of memory during gameplay. (-> texture-streaming-in-unreal-engine)

- [image: Render Resource Viewer] Render Resource ViewerA tool to assist in identifying resources and their assets allocated to GPU memory. (-> render-resource-viewer-in-unreal-engine)

## Mobile Rendering and Visualization

- [image: Mobile Rendering Features] Mobile Rendering FeaturesLearn about Unreal Engine's mobile rendering path. (-> mobile-rendering-features-in-unreal-engine)

- [image: Mobile Previewer] Mobile PreviewerPreviewing your games inside the Unreal Engine is based on the selected Mobile Platforms. (-> using-the-mobile-previewer-in-unreal-engine)

## Visualization Tools

- [image: Path Tracer] Path TracerLearn about the Path Tracer and how you can use it to render high quality images for final shots and ground truth comparisons against the real-time rendered scenes. (-> path-tracer-in-unreal-engine)

- [image: HDRI Backdrop Visualization Tool] HDRI Backdrop Visualization ToolA Blueprint tool to quickly set up product visualization using an HDR image projection with real-time lighting and shadowing. (-> hdri-backdrop-visualization-tool-in-unreal-engine)

- [image: Sun and Sky Actor] Sun and Sky ActorA tool that provides a time of day system that is geographically accurate for location, date, and time. (-> sun-and-sky-actor-in-unreal-engine)

- [image: Geographically Accurate Sun Positioning Tool] Geographically Accurate Sun Positioning ToolA tool giving you fine control over the Sun's geographic location based on latitude, longitude, date, and time. (-> geographically-accurate-sun-positioning-tool-in-unreal-engine)

## Third-Party Tools

- [image: Third-Party Rendering Tools and Plugins] Third-Party Rendering Tools and PluginsA listing of third-party tools and plugins that are available. (-> thirdparty-rendering-tools-and-plugins-in-unreal-engine)

## Graphics Programming

- [image: FShaderCache] FShaderCacheThe FShaderCache provides mechanisms for reducing shader hitching in-game. (-> fshadercache-in-unreal-engine)
- [image: Mesh Drawing Pipeline] Mesh Drawing PipelineGuide to adding custom mesh passes and understanding Unreal Engine's mesh drawing performance characteristics. (-> mesh-drawing-pipeline-in-unreal-engine)
- [image: Graphics Programming Overview] Graphics Programming OverviewInformation for graphics programmers working with the rendering systems and writing shaders. (-> graphics-programming-overview-for-unreal-engine)
- [image: Parallel Rendering Overview] Parallel Rendering OverviewAn overview of parallel rendering. (-> parallel-rendering-overview-for-unreal-engine)
- [image: Render Dependency Graph] Render Dependency GraphAn immediate-mode API which records render commands into a graph data structure to be compiled and executed. (-> render-dependency-graph-in-unreal-engine)
- [image: Shader Development] Shader DevelopmentInformation for graphics programmers writing shaders. (-> shader-development-in-unreal-engine)
- [image: AsyncCompute] AsyncComputeAsyncCompute is a hardware feature that interleaves different GPU tasks to improve efficiency. (-> asynccompute-in-unreal-engine)
- [image: Shaders in Plugins] Shaders in PluginsInformation on creating and using shaders in plugins. (-> shaders-in-plugins-for-unreal-engine)
- [image: Threaded Rendering] Threaded RenderingInformation for graphics programmers working with the threaded renderer. (-> threaded-rendering-in-unreal-engine)

- [image: Large World Coordinates Rendering Overview.] Large World Coordinates Rendering Overview.An overview of Rendering Large World Coordinates. (-> large-world-coordinates-rendering-in-unreal-engine-5)

## Artificial Intelligence / Machine Learning

- [image: Neural Network Engine] Neural Network EngineA collection of topics related to using artificial intelligence through Unreal Engine's neural network engine. (-> neural-network-engine-in-unreal-engine)

- rendering
- lighting
- film
- architectural visualization
- ray tracing
- path tracing
- tv

On this page

- Unreal Engine 5 Rendering Features and Tools (-> designing-visuals-rendering-and-graphics-with-unreal-engine)
- Art Setup and Tools (-> designing-visuals-rendering-and-graphics-with-unreal-engine)
- Lighting Concepts and Features (-> designing-visuals-rendering-and-graphics-with-unreal-engine)
- General Rendering Features (-> designing-visuals-rendering-and-graphics-with-unreal-engine)
- Visuals and System Tools (-> designing-visuals-rendering-and-graphics-with-unreal-engine)
- Performance and Debugging (-> designing-visuals-rendering-and-graphics-with-unreal-engine)
- Mobile Rendering and Visualization (-> designing-visuals-rendering-and-graphics-with-unreal-engine)
- Visualization Tools (-> designing-visuals-rendering-and-graphics-with-unreal-engine)
- Third-Party Tools (-> designing-visuals-rendering-and-graphics-with-unreal-engine)
- Graphics Programming (-> designing-visuals-rendering-and-graphics-with-unreal-engine)
- Artificial Intelligence / Machine Learning (-> designing-visuals-rendering-and-graphics-with-unreal-engine)

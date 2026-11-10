# Hardware Ray Tracing and Path Tracing Features

https://dev.epicgames.com/documentation/en-us/unreal-engine/ray-tracing-and-path-tracing-features-in-unreal-engine?application_version=5.9

> Explore topics for setting up and using real-time hardware ray tracing and path tracing to render scenes using ray-traced lighting features.

[image: Hardware Ray Tracing and Path Tracing Features]

Ray Tracing techniques have long been used in film, television, and visualization for rendering photo-realistic images, but often it required powerful computers and time to render individual images (or frames). For architectural visualization, this can often mean hours of rendering. For film and television, it can take many hours or even days to render high-quality image sequences.

Unreal Engine uses its own ray tracing code base that is shared with both its real-time and offline rendering paths. Real-Time Ray Tracing is an optimized path to work in real-time to render scenes, such as interactive experiences or in games. The offline path uses the built-in Path Tracer to generate uncompromised renderings of scenes. It works seamlessly with the Movie Render Queue (-> movie-render-pipeline-in-unreal-engine) to output the highest quality frame renders.

Explore the topics below to learn more about these paths and how you can use them in your own projects.

## Ray Tracing in Unreal Engine

Ray Tracing in Unreal Engine supports two modes:

- A hybrid **Ray Tracer** that couples ray tracing capabilities with traditional raster techniques for real-time rendering.
- A **Path Tracer** for generating high quality, compromise-free rendered results.

## System Requirements

The following system requirements must be met to use Ray Tracing and Path Tracing features of Unreal Engine:

| System Requirements |  |
| --- | --- |
| **Operating System** | Windows 10 RS5 (Build 1809) or laterVerify your Windows build by typing **winver** in the Windows search bar.Vulkan Desktop on Linux and WindowsFor details on what operating system builds are needed, see Hardware and Software Specifications (-> hardware-and-software-specifications-for-unreal-engine). |
| **GPU** | NVIDIA RTX and some GTX series cards with DXR support using the latest device drivers.For more information, see NVIDIA's site here. |
| **Unreal Engine Version** | 5.0 and Later |
| **Unreal Engine Rendering Path** | Deferred Path |

## Overviews

- [image: Hardware Ray Tracing] Hardware Ray TracingAn overview of the features that use hardware to render real-time ray traced results. (-> hardware-ray-tracing-in-unreal-engine)

- [image: Path Tracer] Path TracerLearn about the Path Tracer and how you can use it to render high quality images for final shots and ground truth comparisons against the real-time rendered scenes. (-> path-tracer-in-unreal-engine)

## Guides

- [image: Ray Tracing Performance Guide] Ray Tracing Performance GuideA selection of topics for improving performance of ray tracing features in your projects. (-> ray-tracing-performance-guide-in-unreal-engine)

- [image: Hardware Ray Tracing Tips and Tricks] Hardware Ray Tracing Tips and TricksA collection of topics to aid with development of projects using hardware ray tracing features. (-> hardware-ray-tracing-tips-and-tricks-in-unreal-engine)

- [image: Rendering High Quality Frames with Movie Render Queue] Rendering High Quality Frames with Movie Render QueueA how-to guide for configuring the Unreal Engine Movie Render Queue feature to get high-quality cinematics—particularly when using ray tracing. (-> rendering-high-quality-frames-with-movie-render-queue-in-unreal-engine)

## Reference

- [image: Hardware Ray Tracing and Path Tracer Features Properties] Hardware Ray Tracing and Path Tracer Features PropertiesA listing of all available properties setting for Ray Tracing and Path Tracer features. (-> ray-tracing-and-path-tracer-features-properties-in-unreal-engine)

- rendering
- lighting
- film
- architectural visualization
- ray tracing
- path tracing
- tv

On this page

- Ray Tracing in Unreal Engine (-> ray-tracing-and-path-tracing-features-in-unreal-engine)
- System Requirements (-> ray-tracing-and-path-tracing-features-in-unreal-engine)
- Overviews (-> ray-tracing-and-path-tracing-features-in-unreal-engine)
- Guides (-> ray-tracing-and-path-tracing-features-in-unreal-engine)
- Reference (-> ray-tracing-and-path-tracing-features-in-unreal-engine)

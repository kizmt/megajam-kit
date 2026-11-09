# Multi-Process Rendering

https://dev.epicgames.com/documentation/en-us/unreal-engine/multiprocess-rendering-with-unreal-engine?application_version=5.9

> Learn about multi-process rendering and how it differs from multi-GPU rendering.

[image: Multi-Process Rendering]

## What is Multi-Process Rendering?

**Multi-Process Rendering** is a method of using the power of multiple GPUs for nDisplay rendering. This approach means specific viewports can be rendered simultaneously on each GPU. For example, the outer frustum could be rendered on the primary GPU while the inner frustum is rendered on a secondary GPU.

In the vast majority of cases (scene dependent), Multi-Process rendering is more performant than Multi-GPU rendering, which was introduced in 4.27. Multi-Process and Multi-GPU share the same physical hardware configuration, so there is no disadvantage to switching to a Multi-Process workflow. Multi-Process is also the recommended way to render with multiple NVIDIA ADA Lovelace GPUs, as they do not support NVLink which is recommended for Multi-GPU (mGPU) configurations.

As the name implies, Multi-Process rendering launches two instances, or processes, of Unreal Engine on each render node. The first is a regular nDisplay node. This is also known as the **onscreen node** because it renders out to the LED wall and is visible in Windows when rendering. The second node, which operates as a separate Windows process, is a headless instance that is not directly visible and is referred to as the **offscreen node**.

In the frustum example above, the offscreen node will render the inner frustum on the secondary GPU, sharing it back to the onscreen node as a texture. The onscreen node, which is rendering on the primary GPU, composites the inner frustum over the outer frustum and displays it out to the LED wall.

Multi-Process will only share the final rendered texture between GPUs via CPU/Motherboard. Sharing the rendered texture is more efficient than Multi-GPU, which requires huge bandwidth to share all GPU memory via the NVLink and SLI.

The two methods can be compared in the following table:

[image: comparison table]

## Technical Prerequisites

- At least **two GPUs**
- **SLI must be disabled** (see Nvidia documentation for configuring SLI)
- If using Nvidia Mosaic, ensure that it is not set to Premium Mosaic, as this enables SLI
- **Disable Intel Hyper-Threading / AMD Simultaneous Multi-Threading.** We recommend doing this to ensure the best performance. Please note that disabling either of these may impact performance for other software you are using. You may experience longer shader compile times.
- The currently supported NVIDIA drivers and control panel settings, including synchronization. This information can be found on our nDisplay Synchronisation with NVIDIA GPUs page (-> synchronization-in-ndisplay-in-unreal-engine).

## Knowledge Prerequisites

- Familiar with the concepts in the ICVFX quickstart guide (-> in-camera-vfx-quick-start-for-unreal-engine), including how to create a new config.

## Additional Topics

- [image: Converting from mGPU to Multi-Processing Rendering] Converting from mGPU to Multi-Processing RenderingConvert an existing multi-GPU config for multi-process rendering. (-> converting-from-mgpu-to-multi-process-rendering-in-unreal-engine)
- [image: Getting Started with Multi-Process Rendering] Getting Started with Multi-Process RenderingLearn how to set up multi-process rendering. (-> getting-started-with-multiprocess-rendering-in-unreal-engine)

## Useful Links

- NVIDIA Documentation
- nDisplay Synchronization with NVIDIA GPUs (-> synchronization-in-ndisplay-in-unreal-engine)
- In-Camera VFX Quick Start (-> in-camera-vfx-quick-start-for-unreal-engine)

- ndisplay
- icvfx
- bronze
- multi-process rendering
- mgpu

On this page

- What is Multi-Process Rendering? (-> multiprocess-rendering-with-unreal-engine)
- Technical Prerequisites (-> multiprocess-rendering-with-unreal-engine)
- Knowledge Prerequisites (-> multiprocess-rendering-with-unreal-engine)
- Additional Topics (-> multiprocess-rendering-with-unreal-engine)
- Useful Links (-> multiprocess-rendering-with-unreal-engine)

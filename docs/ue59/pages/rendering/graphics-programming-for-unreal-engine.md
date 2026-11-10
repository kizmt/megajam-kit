# Graphics Programming

https://dev.epicgames.com/documentation/en-us/unreal-engine/graphics-programming-for-unreal-engine?application_version=5.9

> Information for graphics programmers working with the rendering systems and writing shaders.

The Renderer module in the engine manages and renders scenes, which hold the renderable information associated with each world. It includes the definition of all drawing policies and shader.

The RHI module, which is the interface for rendering APIs, is another key module for graphics programming. The Graphics Programming Overview (-> graphics-programming-overview-for-unreal-engine) covers many key classes, settings, and variables to investigate, while the other subpages below cover specific rendering topics.

- FShaderCache (-> fshadercache-in-unreal-engine): The FShaderCache provides mechanisms for reducing shader hitching in-game.

- Mesh Drawing Pipeline (-> mesh-drawing-pipeline-in-unreal-engine): Guide to adding custom mesh passes and understanding Unreal Engine's mesh drawing performance characteristics.

- Graphics Programming Overview (-> graphics-programming-overview-for-unreal-engine): Information for graphics programmers working with the rendering systems and writing shaders.

- Parallel Rendering Overview (-> parallel-rendering-overview-for-unreal-engine): An overview of parallel rendering.

- Render Dependency Graph (-> render-dependency-graph-in-unreal-engine): An immediate-mode API which records render commands into a graph data structure to be compiled and executed.

- Shader Development (-> shader-development-in-unreal-engine): Information for graphics programmers writing shaders.

- AsyncCompute (-> asynccompute-in-unreal-engine): AsyncCompute is a hardware feature that interleaves different GPU tasks to improve efficiency.

- Shaders in Plugins (-> shaders-in-plugins-for-unreal-engine): Information on creating and using shaders in plugins.

- Threaded Rendering (-> threaded-rendering-in-unreal-engine): Information for graphics programmers working with the threaded renderer.

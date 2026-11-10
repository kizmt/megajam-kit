# Render Resource Viewer

https://dev.epicgames.com/documentation/en-us/unreal-engine/render-resource-viewer-in-unreal-engine?application_version=5.9

> A tool to assist in identifying resources and their assets allocated to GPU memory.

[image: Render Resource Viewer]

The **Render Resource Viewer** is a tool that provides a snapshot in time — captured when the window opens — of where all GPU memory allocations are going and to what render resources. These include Vertex and Index buffers, and the types of assets they come from. This tool is useful for artists and developers to identify and understand which assets are making allocations. It also provides the information needed to optimize GPU memory and keep a project within its rendering budget.

 [image: Render Resource Viewer]

This tool includes an interactive interface that:

- Displays each render resource allocation with its name, size, type, flags, and owner.

- Has a sortable and filterable table of allocations.

- Provides information to identify and understand which assets are making the allocations.

## Open the Render Resource Viewer

You can open the **Render Resource Viewer** from the **Tools** menu.

 [image: UE Main menu to launch Render Resource Viewer]

## Working with the Render Resource Viewer Interface

The Render Resource Viewer interface is made up of the following:

- **Refresh Button** The viewer creates a snapshot in time when it is opened and doesn't automatically update in real-time. Use this button to refresh the list and create a new snapshot of GPU memory allocations. [image: Render Resource Viewer Interface Refresh Button]

- **Resource Filters** Each resource has some rendering flags. Use these resource checkboxes to show filtered entries relevant to your search. Choose from the following resources:

- **Resident:** Is accessible by the GPU, and not evicted (unused).

- **Transient:** Is only allocated during the duration of the render passes where it is active and it will share underlying memory with other resources in the frame. (This filter is unchecked by default.)

- **Streaming:** Is a streamable texture.

- **Render Target (RT):** Can be written to as a Render Target buffer by the GPU.

- **Depth Stencil (DS):** Can be written to as a Depth Stencil buffer by the GPU.

- **Unordered Access View (UAV):** Supports Unordered Access View which allows temporarily unordered read/write access from multiple GPU threads without generating memory conflicts.

- **Ray Tracing Acceleration Structure (RTAS):** Is a Ray Tracing Acceleration Structure. [image: Render Resource Viewer Interface Filter By Flags]

- **Search Box** Searches text from both the **Resource Name** and **Owner** categories. For example, it can be hard to find all resources belonging to a skeletal mesh, but by searching its owner's path, you can see the total memory being used. [image: Render Resource Viewer Interface Search Field]

- **Resource Totals** Displays the total number of entries and their combined size in the list. Changing the filtered flags and searching lists only the filtered results and their totals. [image: Render Resource Viewer Interface Totals of all Resources]

- **Resource Table** The window includes listed information about a given resource occupying memory. In this window, you see the name of the resource, its type, size, and flags, and the owner of that resource. The Owner column provides the path name of the UObject the resource belongs to, including its LOD index. [image: Render Resource Viewer Interface Resource List]

## Additional Notes

### Owner is None

When a resource has an owner as "None", it means the resource owner is not currently tracked. Currently tracked resources include static meshes, skeletal meshes, textures, and hair/groom assets. The list of tracked resources will continue to grow.

### Owner Paths and LOD Index

If the resource belongs to a mesh, the Owner path will also indicate the LOD index that mesh belongs to at the end of the path. For example, the Quinn mannequin included with some of the default templates in Unreal Engine has multiple levels of detail set up. When looking at the resource entry for this skeletal mesh, the path looks like `/Game/Characters/Mannequins/Meshes/SKM_Quinn.SKM_Quinn[LOD1]`.

### Browse to Asset in the Content Browser

You can find listed entries assets using either the hot key **CTRL + B** or right-clicking on them and selecting **Browse to Asset**. This opens the Content Browser to show their location. If there is no asset path associated with the **Owner** **column**, no action is taken.

 [image: Right-click on an entry to browse to its asset in the Content Browser.]

- optimization
- debugging
- memory
- gpu

On this page

- Open the Render Resource Viewer (-> render-resource-viewer-in-unreal-engine)
- Working with the Render Resource Viewer Interface (-> render-resource-viewer-in-unreal-engine)
- Additional Notes (-> render-resource-viewer-in-unreal-engine)
- Owner is None (-> render-resource-viewer-in-unreal-engine)
- Owner Paths and LOD Index (-> render-resource-viewer-in-unreal-engine)
- Browse to Asset in the Content Browser (-> render-resource-viewer-in-unreal-engine)

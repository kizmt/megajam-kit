# Offset

https://dev.epicgames.com/documentation/en-us/unreal-engine/offset-tool-in-unreal-engine?application_version=5.9

> Overview of the Offset modeling tool.

[image: Offset]

Learn to use this **Beta** feature, but use caution when shipping with it.

The **Offset** tool adjusts the position of a mesh's vertices by a specified amount along its normal, such as creating additional details, like a cobblestone pattern, in highly tessellated geometry.

|  |  |
| --- | --- |
|  |  |
| Flat Rectangle | Cobblestone |

The tool is additionally helpful for:

- Adding thickness to a mesh, such as a wall.

- Growing or shrinking a solid object.

- Creating custom Volume Actors (-> volume-actors-in-unreal-engine) and Cutting Actors for fracturing.

## Accessing the Tool

You can access the Offset tool from the following:

- The **Deform** category in **Modeling Mode**. To learn more about Modeling Mode and how to access it, see Modeling Mode Overview (-> modeling-mode-in-unreal-engine).

- The **Editing Tools** tab in the **Skeleton Editor**. To learn more, see Skeleton Editing.

## Using Offset

Offset has the following operation types:

- **Iterative**: Offsets with N iterations.

- **Implicit**: Offsets in a way that produces smoother output and does a better job at preserving UVs but can be slow on large meshes.

When you offset a mesh, you can toggle **Create Shell** to add a thickened shell instead of only moving the input vertices.

To help visualize the effect of the brush on your mesh, you can toggle **Show Wireframe** and **Flat Shading** and change the material mode in the **Rending** section.

 [image: Weight Map]

Once you are done using the tool, accept or cancel the changes in the Tool Confirmation (-> modeling-mode-in-unreal-engine) panel.

| **Key Command** | **Operation** |
| --- | --- |
| **F** | Zooms into the location of the mesh. |
| **ESC** | Cancels the changes and exits the tool. |
| **Enter** | Accepts the tool changes. |

- beta
- modeling mode
- sculpting
- skeleton editing

On this page

- Accessing the Tool (-> offset-tool-in-unreal-engine)
- Using Offset (-> offset-tool-in-unreal-engine)

Related documents

Modeling Tools

 [image: Modeling Tools] (-> modeling-tools-in-unreal-engine)Modeling Mode Overview

 [image: Modeling Mode Overview] (-> modeling-mode-in-unreal-engine)

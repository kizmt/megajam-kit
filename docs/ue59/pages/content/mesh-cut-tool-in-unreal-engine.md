# Mesh Cut

https://dev.epicgames.com/documentation/en-us/unreal-engine/mesh-cut-tool-in-unreal-engine?application_version=5.9

> Overview of the Mesh Cut modeling tool for editing mesh pairs.

[image: Mesh Cut]

Learn to use this **Beta** feature, but use caution when shipping with it.

The **Mesh Cut** tool splits one mesh into parts using a second mesh. You can use the tool to break up meshes into smaller components and add detail, reducing the manual process of adding edges and deleting faces when modeling.

## Accessing the Tool

Mesh Cut is located in the **Model** category of **Modeling Mode**. To learn more about Modeling Mode and how to access it, see Modeling Mode Overview (-> modeling-mode-in-unreal-engine).

## Using Mesh Cut

Gizmos for each mesh appear in the Viewport to dynamically change the cut.

Similar to the Boolean (-> boolean-tool-in-unreal-engine) tool, the selection order matters as follows:

- The first selected mesh becomes the one you cut.

- The second selection becomes the cutting boundary.

Mesh Cut is a single-cut tool, meaning you must start a new session for each cut you want to make on the mesh.

Once you are done using the tool, accept or cancel the changes in the Tool Confirmation (-> modeling-mode-in-unreal-engine) panel.

## Settings

| **Setting** | **Description** |
| --- | --- |
| **Try Fix Holes** | When true, Mesh Cut automatically attempts to fill holes created by numerical errors. |
| **Try Collapse Edges** | When true, any extra edges created by the boolean operation are collapsed. |
| **Winding Threshold** | Determines whether a triangle in one mesh is inside or outside of the other. |
| **Show New Boundaries** | When true, shows boundary edges created by the boolean operation caused by numerical errors. |
| **Use First Mesh Materials** | When True, only the first mesh keeps its material assignments. All other triangles are assigned material 0. |
| **Show Gizmo** | Toggles the transform gizmo's visibility. |

- animation
- landscape
- beta
- modeling mode
- modeling tools
- low-poly modeling

On this page

- Accessing the Tool (-> mesh-cut-tool-in-unreal-engine)
- Using Mesh Cut (-> mesh-cut-tool-in-unreal-engine)
- Settings (-> mesh-cut-tool-in-unreal-engine)

Related documents

Modeling Tools

 [image: Modeling Tools] (-> modeling-tools-in-unreal-engine)Modeling Mode Overview

 [image: Modeling Mode Overview] (-> modeling-mode-in-unreal-engine)

# Boolean

https://dev.epicgames.com/documentation/en-us/unreal-engine/boolean-tool-in-unreal-engine?application_version=5.9

> Overview of the Boolean modeling tool for editing mesh pairs.

[image: Boolean]

Learn to use this **Beta** feature, but use caution when shipping with it.

The **Boolean** tool subtracts or adds mesh pairs. It is helpful for quickly adding detail and displacement effects to your mesh.

## Accessing the Tool

Boolean is located in the **Model** category of **Modeling Mode**. To learn more about Modeling Mode and how to access it, see Modeling Mode Overview (-> modeling-mode-in-unreal-engine).

## Using Boolean

Two meshes are required to use the tool as the resulting mesh change revolves around the area where both meshes intersect. The order in which you select the meshes matters for the first two operations:

- Your first selection becomes **A**.

- Your second selection becomes **B**.

You can choose from four operations shown in the table below.

| **Operation** | **Description** |
| --- | --- |
| **Difference A - B** | Subtracts the second mesh from the first mesh. |
| **Difference B - A** | Subtracts the first mesh from the second mesh. |
| **Intersection** | Subtracts non-overlapping geometry. |
| **Union** | Combines both meshes and resolves self-intersections. |

Once both meshes are selected and the tool is activated, you can interactively manipulate one or both meshes in the Viewport, depending on the operation.

After you edit the mesh, you can decide how to handle the mesh output using the operations shown in the table below.

| **Operation** | **Description** |
| --- | --- |
| **Output Type** | Chooses the type of actor to create. Only available if **New Object** is selected in **Output Object**. |
| **Output Object** | Determines whether to create a new actor or to override one of the input meshes. |
| **On Tool Accept** | Determines what happens to the selected meshes when changes are accepted. |

- animation
- landscape
- beta
- modeling mode
- modeling tools
- low-poly modeling

On this page

- Accessing the Tool (-> boolean-tool-in-unreal-engine)
- Using Boolean (-> boolean-tool-in-unreal-engine)

Related documents

Modeling Tools

 [image: Modeling Tools] (-> modeling-tools-in-unreal-engine)Modeling Mode Overview

 [image: Modeling Mode Overview] (-> modeling-mode-in-unreal-engine)

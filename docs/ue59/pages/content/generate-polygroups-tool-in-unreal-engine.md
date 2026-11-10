# Generate PolyGroups

https://dev.epicgames.com/documentation/en-us/unreal-engine/generate-polygroups-tool-in-unreal-engine?application_version=5.9

> Overview for automatically grouping triangles to create PolyGroups with the Generate PolyGroup modeling tool.

[image: Generate PolyGroups]

Learn to use this **Beta** feature, but use caution when shipping with it.

The **Generate PolyGroup** tool automatically groups triangles to create PolyGroups for a mesh. A PolyGroup is a set of grouped triangles. You can use PolyGroups for various operations, such as:

- Modeling and deformation

- Traditional box modeling

- UV layout

- Material organization

- Skin weights

To learn more, see Understanding PolyGroups (-> understanding-polygroups-in-unreal-engine).

In the video above, we generate PolyGroups based on the mesh's UV islands. The groupings are then used to insert an edge and dynamically alter the shape of a mesh. In addition, the video uses the PolyGroup Edit (-> polygroup-edit-tool-in-unreal-engine) and Deform PolyGroups (-> deform-polygroups-tool-in-unreal-engine) tools.

The Generate PolyGroups tool is a great starting point for applying baseline PolyGroup data to a mesh, which you can then fine-tune with the Paint PolyGroups tool.

## Accessing the Tool

You can access the Generate PolyGroup tool from the following:

- The **Attributes** category in **Modeling Mode**. To learn more about Modeling Mode and how to access it, see Modeling Mode Overview (-> modeling-mode-in-unreal-engine).

- The **Editing Tools** tab in the **Skeleton Editor**. To learn more, see Skeleton Editing.

## Using Generate PolyGroup

Upon opening the Generate PolyGroup tool, PolyGroups are automatically generated. The **Conversion Mode** defines how triangles are grouped. Choose a conversion mode to generate new PolyGroups and adjust specified values. The table below lists these conversion modes.

| Conversion Mode | Description |
| --- | --- |
| **Face Normal Deviation** | Creates PolyGroups based on the **Angle Tolerance** between face normals. |
| **Find Quads** | Creates PolyGroups by merging triangle pairs into quads. |
| **From UV Islands** | Creates PolyGroups based on UV islands. To learn more about creating UV islands, see UV Editor (-> uv-editor-in-unreal-engine). |
| **From Hard Normal Seams** | Creates PolyGroups based on hard normal seams. |
| **From Connected Tris** | Creates PolyGroups based on connected triangles. Useful for a mesh with disconnected parts. |
| **Furthest Point Sampling** | Creates PolyGroups centered on well-spaced sample points, approximating a surface Voronoi diagram. |
| **Copy From Layer** | Copies PolyGroups from an existing PolyGroup layer. |

You can generate PolyGroups on existing or new PolyGroup layers. These layers can correspond to different operations without having to go back and adjust PolyGroups each time. For example, you can set layer 1 for adjusting topology, layer 2 for UVs, and layer 3 for multiple materials assignment. To add additional layers, use the **Output Layer** property.

Once you are done using the tool, accept or cancel the changes in the Tools Confirmation (-> modeling-mode-in-unreal-engine) panel.

### Hotkeys

| **Hotkey** | **Description** |
| --- | --- |
| **Enter** | Accepts tool changes. |
| **ESC** | Cancels the changes and exits the tool. |

- beta
- modeling mode
- modeling tools
- polygroups
- quads
- skeleton editing

On this page

- Accessing the Tool (-> generate-polygroups-tool-in-unreal-engine)
- Using Generate PolyGroup (-> generate-polygroups-tool-in-unreal-engine)
- Hotkeys (-> generate-polygroups-tool-in-unreal-engine)

Related documents

Modeling Tools

 [image: Modeling Tools] (-> modeling-tools-in-unreal-engine)Modeling Mode Overview

 [image: Modeling Mode Overview] (-> modeling-mode-in-unreal-engine)

# Mesh Element Selection

https://dev.epicgames.com/documentation/en-us/unreal-engine/mesh-element-selection-in-unreal-engine?application_version=5.9

> Overview of the mesh element selection workflow for editing the faces, vertices, and edges of a mesh.

Learn to use this **Beta** feature, but use caution when shipping with it.

**Modeling Mode** provides the option for direct mesh element (topology) selection in Unreal Engine for a more consistent and optimized modeling workflow. Artists can use the **Mesh Element Selection** toolbar to select a mesh or mesh element and then invoke an operation without using an intermediate tool such as **PolyGroup Edit** or **Triangle Edit**.

Mesh elements consist of the following:

- Triangle
- Triangle vertex
- Triangle edge
- PolyGroup
- PolyGroup edge
- PolyGroup vertex

These elements represent the granular geometry that makes up your mesh. This workflow of selecting and editing elements can help you create a clean mesh topology.

PolyGroups are a set of grouped triangles that help your modeling workflow. For example, you can construct quad-like groups for box modeling. To learn more about PolyGroups and how they differ from triangles, see Understanding PolyGroups (-> understanding-polygroups-in-unreal-engine).

## Accessing the Toolbar

The Mesh Element Selection toolbar is enabled by default in Modeling Mode. For more information about Modeling Mode and how to access it, see Modeling Mode Overview (-> modeling-mode-in-unreal-engine).

To toggle the toolbar, follow these steps:

- In **Modeling Mode Quick Settings**, click the **gear **icon.
- Click **Mesh Element Selection**.
- Exit and re-enter Modeling Mode.

The toolbar should appear in the **Viewport**. Additionally, when you re-enter Modeling Mode, the **Select** category becomes available with tools for editing your element selections.

## Using Mesh Element Selection

You can transform element selections with the modeling gizmo and use the **Select** category tools for additional edits. When you open an available tool, your selected elements are carried over.

The element selection is not editable when you open a tool. To update the selected elements, you must exit the tool, adjust the selection, and then re-enter the tool.

Selection commands, such as **Select All** and **Invert Selection**, help you quickly select your desired elements. You can adjust the method for highlighting elements by toggling **Drag Mode**. The Drag Mode options are clicking individual elements or dragging to select multiple elements with your mouse. To learn more about these properties, see the **Toolbar Properties** section on this page.

The mesh element selection is locked by default for imported static meshes and volumes. This setting ensures you don't accidentally edit the mesh's geometry. To enable element selection, you can toggle the **lock** icon in the toolbar.

### Gizmo and Numerical Control

You can transform each element selection with the modeling gizmo or use the **Transformation** panel for numerical input. To adjust the gizmo's orientation from local space to normal selection, use the additional settings section of the toolbar (see the table below).

To learn more about the modeling gizmo and Transformation panel, see the Gizmo (-> modeling-mode-in-unreal-engine) section of the Modeling Mode overview.

### Toolbar Properties

| Icon | Description |
| --- | --- |
| [image: Element Selection] | Disable element selection. Returns to mesh selection. |
| [image: Triangles] | Select triangles (faces). |
| [image: Triangle Edges] | Select triangle edges. |
| [image: Triangle Vertices] | Select triangle vertices. |
| [image: PolyGroup] | Select PolyGroups (faces). |
| [image: PolyGroup Edges] | Select PolyGroup edges, also known as borders. |
| [image: PolyGroup Vertices] | Select PolyGroup vertices, also known as corners. |
| [image: Additional Selection] | Additional selection functionality:Select AllExpand to ConnectedInvert SelectionInvert ConnectedExpand SelectionContract Selection |
| [image: Additional Settings] | Additional settings:**Drag Mode:** Method for mouse selection:**None:** Click individual elements**Path:** Click an element, then drag to highlight more**Selectable Mesh Types:**VolumesStatic Meshes**Local Frame Mode:** Adjusts the gizmo's orientation:**From Geometry** (selection normal)**From Object** (local space)Selection Filters:Hit Back FacesSoft Selection:RadiusModeLock Target |
| [image: Lock] | Locks and unlocks the selected mesh from element selection. Available when you choose an element type. |

PolyGroup elements are based on the grouping of triangles. To obtain a specific selection, try adjusting your PolyGroups. To learn more, see Understanding PolyGroups (-> understanding-polygroups-in-unreal-engine).

You can change how mesh element selections look in **Editor Preferences > Plugins > Mesh Element Selection**.

**Point Size** and **Line Width** set the size of points and lines. Set either to 0 to hide them. **Occluded Brightness** sets how bright elements behind the mesh appear in wireframe view modes. You can also set the **Unselected**, **Selected**, **Hover Over Selected**, **Hover Over Unselected**, and **Soft Selected** colors.

### HotKeys

| Command | Description |
| --- | --- |
| **Shift + Click (Mesh)** | Adds elements to selection. Use** Ctrl + Drag **when **Path Drag Mode** is enabled. |
| **Ctrl + Click (Mesh)** | Removes elements from selection. Use **Ctrl + Drag** when **Path Drag Mode** is enabled. |
| **Ctrl + Z ** | Undo an action. |
| **Middle Mouse + Translate (Gizmo)** | Repositions the gizmo temporarily. |
| **Shift + Ctrl + Click (Gizmo)** | Repositions the gizmo grid to the hit normal. |
| **B** | Toggle **Soft Selection**. |

## Select Category Tools

Many of the tools in the **Select** category open a panel with additional operations. However, the **Clean** and **Delete** options are one-click operations.

- **Delete:** Removes the selection.
- **Clean:** Retriangulates the selection. Works on PolyGroup selections only.

You can find more information on the remaining tools in the table below.

Some tools are only available for specific elements or located in another category.

| Tool | Description |
| --- | --- |
| **Extrude** | Protrudes geometry from the set of selected faces by moving and stitching them. |
| **Extrude Edges** | Protrudes geometry from the set of selected edges by moving and stitching them. |
| **Offset** | Protrudes selected faces similar to the Extrude operation, but defaults to moving faces along vertex normals instead of a single direction. Mouse movement controls the offset distance. Click in the viewport to complete the offset. |
| **PushPull** | Faces can cut away the mesh or bridge mesh parts. To learn more, see Push Pull (-> push-pull-tool-in-unreal-engine). |
| **Inset** | Insets the current set of selected faces. Mouse movement controls the inset distance. Click in the viewport to complete the inset. |
| **Outset** | Expands the set of selected faces out. Mouse movement controls the outset distance. Click in the viewport to confirm the outset distance. |
| **Cut** | Divides the selected PolyGroup faces at the drawn line, as if cutting them with a plane through that line. Click the face to draw the cutting line. New PolyGroups are formed at the border of the cut. |
| **Bevel** | Slants the edge loops around the selected faces. |
| **Insert Loops** | Adds a chain of edges across quads in a mesh. You can not insert edges on non-quad faces. |
| **Weld** | Merges the selected element to its matching disconnected element within a distance tolerance. The tool is available in the **Mesh** category. |
| **Split** | Disconnects the elements you select from the non-selected elements to create a second mesh. The tool is available in the **XForm** category. |
| **Smooth** | Softens the edges of surfaces by moving vertices towards the averaged location of their neighbors. Available in the **Deform** category. To learn more, see Smooth (-> smooth-tool-in-unreal-engine). |
| **Lattice** | Edits a mesh's vertices through a 3D grid of points. The tool is available in the **Deform** category. To learn more, see Lattice (-> lattice-tool-in-unreal-engine). |
| **Displace** | Adds tessellation and distortion to a mesh. The tool is available in the **Deform** category and when using the **Flat** subdivsion type. To learn more, see Displace (-> displace-tool-in-unreal-engine). |

- beta
- modeling mode
- modeling tools
- mesh selection
- topology

On this page

- Accessing the Toolbar (-> mesh-element-selection-in-unreal-engine)
- Using Mesh Element Selection (-> mesh-element-selection-in-unreal-engine)
- Gizmo and Numerical Control (-> mesh-element-selection-in-unreal-engine)
- Toolbar Properties (-> mesh-element-selection-in-unreal-engine)
- HotKeys (-> mesh-element-selection-in-unreal-engine)
- Select Category Tools (-> mesh-element-selection-in-unreal-engine)

Related documents

Modeling Tools

 [image: Modeling Tools] (-> modeling-tools-in-unreal-engine)Modeling Mode Overview

 [image: Modeling Mode Overview] (-> modeling-mode-in-unreal-engine)Working with Meshes

 [image: Working with Meshes] (-> working-with-meshes-in-unreal-engine)

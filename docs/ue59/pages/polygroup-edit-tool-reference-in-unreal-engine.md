# PolyGroup Edit Reference

https://dev.epicgames.com/documentation/en-us/unreal-engine/polygroup-edit-tool-reference-in-unreal-engine?application_version=5.9

> PolyGroup Edit tool's properties for polygon modeling.

[image: PolyGroup Edit Reference]

Learn to use this **Beta** feature, but use caution when shipping with it.

This document is a reference guide for the properties of the PolyGroup Edit tool, which provides a suite of operations for editing a mesh with PolyGroups. For an overview of the tool and how to access it, see PolyGroup Edit (-> polygroup-edit-tool-in-unreal-engine).

Before you start using the PolyGroup Edit tool, we recommend reviewing the Understanding PolyGroups (-> understanding-polygroups-in-unreal-engine) documentation to learn more about PolyGroups and how to create them.

The PolyGroup Edit tool consists of the following key sections:

- Face Edits (-> polygroup-edit-tool-reference-in-unreal-engine): Operations for editing the PolyGroup faces of a mesh.

- Shape Edits (-> polygroup-edit-tool-reference-in-unreal-engine): Operations for editing the mesh as a whole.

- Edge Edits (-> polygroup-edit-tool-reference-in-unreal-engine): Operations for editing the PolyGroup edge of a mesh.

- UVs (-> polygroup-edit-tool-reference-in-unreal-engine): Operations for creating UVs.

- Selection (-> polygroup-edit-tool-reference-in-unreal-engine): Operations for highlighting mesh elements (PolyGroup vertices, edges, and faces). You must select an element to use many of the operations in the editing sections.

Associated hotkeys (-> polygroup-edit-tool-reference-in-unreal-engine) are listed at the end of this document.

If you click **Accept** or **Cancel** in the Tool Confirmation (-> modeling-mode-in-unreal-engine) panel, the PolyGroup Edit tool closes.

## Face Edits

The **Face Edits** section includes operations for editing the PolyGroup faces of a mesh. A single triangle can be a PolyGroup face. Before using the operations, you must first select a face. For more information, see the Selection Filter (-> polygroup-edit-tool-reference-in-unreal-engine) section.

### Extrude

The **Extrude** operation protrudes geometry in a positive or negative direction from the set of selected faces and connects them to the mesh with new faces around the selection boundary. New faces inherit the PolyGroup divisions of the adjacent faces. If the selection lies on a mesh boundary (no adjacent faces exist), you can adjust the PolyGroup division of the new faces using the **Use Colinearity for Setting Border Groups** setting in the table below.

Click image to expand.

When you click the Extrude operation, the Tool Properties panel displays the operation's properties. The Extrude operation is also available as a standalone tool in the **Select** category when selecting faces. To learn more about this category, see Mesh Element Selection (-> modeling-mode-in-unreal-engine).

| **Current Operation** | **Description** |
| --- | --- |
| **Apply** | Bakes extrusion changes into the mesh. |
| **Cancel (Esc)** | Negates changes. |

| **Extrude** | **Description** |
| --- | --- |
| **Distance Mode** | Determines how the extrusion distance is set. You can use the following methods: **Click in Viewport:** Mouse movement controls extrusion height and depth. Click in the viewport to complete the extrusion and exit the operation. Using the cursor, you can align the extrusion distance to objects in the level. An additional line from the center of the selection indicates the direction of measurement for the extrusion. **Fixed:** Set extrusion height or depth from a numerical input (**Distance**). |
| **Shells to Solids** | Controls whether extruding an entire open-border patch should create a solid or open shell. True (enable): Open-border faces are extruded as a solid shell (no holes in the mesh). False (disable): Open-border faces are extruded with an open shell. |
| **Direction Mode** | Determines the direction vertices move during extrusion. You can use the following methods: **Single Direction:** Extrude all triangles in the same direction regardless of their normals. **Selected Triangle Normals:** Take the angle-weighted average of the selected triangles around each extruded vertex to determine vertex movement direction. **Selected Triangle Normals Even:** Similar to Selected Triangle Normals, but also adjust the distance moved in an attempt to keep triangles parallel to their original facing. **Max Distance Scale Factor:** Controls the maximum distance vertices can move from the target distance in order to stay parallel with their source triangles. See below for examples. (-> polygroup-edit-tool-reference-in-unreal-engine) |
| **Direction** | The direction of extrusion when Single Direction in the Direction Mode section is active. You can choose from the following: **Selection Normal** **World X** **World Y** **World Z** **Local X** **Local Y** **Local Z** |

| **Advanced** | **Description** |
| --- | --- |
| **Measure Direction ** | The direction to measure the distance of extrusion when Selected Triangle Normals** **or Selected Triangle Normals Even and Click In Viewport is active. The extrusion height is set based on the mouse location on the respective axis. You can choose from the following: **Selection Normal** **World X** **World Y** **World Z** **Local X** **Local Y** **Local Z** |
| **Use Colinearity for Setting Border Groups** | Considers edge colinearity for determining how side triangles connecting the extruded face are grouped when extruded faces touch the mesh border. If true, side triangles touching the mesh border are grouped per colinear section of boundary. If false, all side triangles touching the mesh border are grouped as one. For example, when true, extruding a flat rectangle gives four different PolyGroups on its side rather than one connected PolyGroup. |

Properties for Options (-> polygroup-edit-tool-reference-in-unreal-engine) and Gizmo (-> polygroup-edit-tool-reference-in-unreal-engine) are also available.

#### Extrude Direction Mode Examples

|  |  |  |  |
| --- | --- | --- | --- |
|  |  |  |  |
| No Extrusion | Single Direction | Selected Triangle Normals | Selected Triangle Normals Even |

### Offset

The **Offset** operation protrudes selected faces similar to the Extrude operation, but defaults to moving faces along vertex normals instead of a single direction.

Click image to expand.

When you click the Offset operation, the Tool Properties panel displays the operation's properties. The Offset operation is also available as a standalone tool in the **Select** category when selecting faces. To learn more about this category, see Mesh Element Selection (-> modeling-mode-in-unreal-engine).

| **Current Operation** | **Description** |
| --- | --- |
| **Apply** | Bakes extrusion changes into the mesh. |
| **Cancel (Esc)** | Negates changes. |

| **Extrude** | **Description** |
| --- | --- |
| **Distance Mode ** | Determines how the extrusion distance is set. You can use the following methods: **Click in Viewport:** Mouse movement controls extrusion height and depth. Click in the viewport to complete the extrusion and exit the operation. Using the cursor, you can align the extrusion distance to objects in the level. An additional line from the center of the selection indicates the direction of measurement for the extrusion. **Fixed:** Set extrusion height or depth from a numerical input (**Distance**). |

| **Offset** | **Description** |
| --- | --- |
| **Shells to Solids** | Controls whether extruding an entire open-border patch should create a solid or open shell. True (enable): Open-border faces are extruded as a solid shell (no holes in the mesh). False (disable): Open-border faces are extruded with an open shell. |
| **Direction Mode** | Determines the direction vertices move during extrusion. You can use the following methods: **Vertex Normals:** Follow the vertex normals regardless of selection. **Selected Triangle Normals:** Take the angle-weighted average of the selected triangles around each extruded vertex to determine vertex movement direction. **Selected Triangle Normals Even:** Similar to Selected Triangle Normals, but also adjust the distance moved in an attempt to keep triangles parallel to their original facing. **Max Distance Scale Factor:** Controls the maximum distance vertices can move from the target distance in order to stay parallel with their source triangles. See below for examples. (-> polygroup-edit-tool-reference-in-unreal-engine) |

| **Advanced** | **Description** |
| --- | --- |
| **Measure Direction** | The direction to measure the distance of extrusion when Click In Viewport is active. The extrusion height is set based on the mouse location on the respective axis. You can choose from the following directions: **Selection Normal** **World X** **World Y** **World Z** **Local X** **Local Y** **Local Z** |
| **Use Colinearity for Setting Border Groups ** | Considers edge colinearity for determining how side triangles connecting the extruded face are grouped when extruded faces touch the mesh border. If true, side triangles touching the mesh border are grouped per colinear section of boundary. If false, all side triangles touching the mesh border are grouped as one. For example, when true, extruding a flat rectangle gives four different PolyGroups on its side rather than one connected PolyGroup. |

Properties for Options (-> polygroup-edit-tool-reference-in-unreal-engine) and Gizmo (-> polygroup-edit-tool-reference-in-unreal-engine) are also available.

#### Offset Direction Mode Examples

|  |  |  |  |
| --- | --- | --- | --- |
|  | [image: Vertex Normals] | [image: Selected Triangle Normals] | [image: Triangle Normal Even] |
| No Extrusion | Vertex Normal | Selected Triangle Normals | Selected Triangle Normals Even |

### Push Pull

The **Push Pull** operation extrudes faces that cut or merge mesh parts. You can think of this as performing a boolean operation (like those done by the Boolean tool (-> boolean-tool-in-unreal-engine) between the original mesh and an extruded selection.

Left is the face selection; middle is the Push Pull operation; right is the Extrude operation.

When you click the Push Pull operation, the Tool Properties panel displays the operation's properties. The Push Pull operation is also available as a standalone tool in the **Select** category when selecting faces. To learn more about this category, see Mesh Element Selection (-> modeling-mode-in-unreal-engine).

| **Current Operation** | **Description** |
| --- | --- |
| **Apply** | Bakes extrusion changes into the mesh. |
| **Cancel (Esc)** | Negates changes. |

| **Extrude** | **Description** |
| --- | --- |
| **Distance Mode ** | Determines how the extrusion distance is set. You can use the following methods: **Click in Viewport:** Mouse movement controls extrusion height and depth. Click in the viewport to complete the extrusion and exit the operation. Using the cursor, you can align the extrusion distance to objects in the level. An additional line from the center of the selection indicates the direction of measurement for the extrusion. **Fixed:** Set extrusion height or depth from a numerical input (**Distance**). |

| **Extrusion Options** | **Description** |
| --- | --- |
| **Direction Mode** | Determines the direction vertices move during extrusion before the boolean operation. You can use the following methods: **Vertex Normals:** Follow the vertex normals regardless of selection. **Single Direction:** Move all triangles in the same direction regardless of their normals. **Selected Triangle Normals:** Take the angle-weighted average of the selected triangles around each extruded vertex to determine vertex movement direction. **Selected Triangle Normals Even:** Similar to Selected Triangle Normals, but also adjust the distance moved in an attempt to keep triangles parallel to their original facing. **Max Distance Scale Factor:** Controls the maximum distance vertices can move from the target distance in order to stay parallel with their source triangles. See below for examples. (-> polygroup-edit-tool-reference-in-unreal-engine) |
| **Shells to Solids** | Controls whether extruding an entire open-border patch should create a solid or open shell. True (enable): Open-border faces are extruded as a solid shell (no holes in the mesh). False (disable): Open-border faces are extruded with an open shell. |

| **Advanced** | **Description** |
| --- | --- |
| **Measure Direction** | The Measure Direction setting is the direction to measure the distance of extrusion when Selected Triangle Normals, Vertex Normals, or Selected Triangle Normals Even is active. The extrusion height is set based on the mouse location on the respective axis. When Single Direction is active, the direction of the extrusion is based on Measure Direction. The setting is only available when Distance Mode is set to Click in Viewport. You can choose from the following directions: **Selection Normal** **World X** **World Y** **World Z** **Local X** **Local Y** **Local Z** |
| **Use Colinearity for Setting Border Groups** | Considers edge colinearity for determining how side triangles connecting the extruded face are grouped when extruded faces touch the mesh border. If true, side triangles touching the mesh border are grouped per colinear section of boundary. If false, all side triangles touching the mesh border are grouped as one. For example, when true, extruding a flat rectangle gives four different PolyGroups on its side rather than one connected PolyGroup. |

Properties for Options (-> polygroup-edit-tool-reference-in-unreal-engine) and Gizmo (-> polygroup-edit-tool-reference-in-unreal-engine) are also available.

#### Push Pull Direction Mode Examples

|  |  |  |  |  |
| --- | --- | --- | --- | --- |
|  | [image: Vertex Normals] |  | [image: Selected Triangle Normals] | [image: Triangle Normal Even] |
| No Extrusion | Vertex Normal | Single Direction | Selected Triangle Normals | Selected Triangle Normals Even |

### Inset

The **Inset** operation contracts a set of selected faces to create new faces. Mouse movement controls the inset distance. Click in the viewport to complete the inset.

When you click the Inset operation, the Tool Properties panel displays the operation's properties.The Inset operation is also available as a standalone tool in the **Select** category. To learn more about this category, see Mesh Element Selection (-> modeling-mode-in-unreal-engine).

| **Current Operation** | **Description** |
| --- | --- |
| **Done** | Click to exit the operation if you decide no changes are needed. You can also use **Ctrl **+ **Z** to cancel the operation. |

| **Inset/Outset** | **Description** |
| --- | --- |
| **Softness** | Amount of smoothing applied to the inset boundary. When low, faces may begin to overlap at bends in the selection boundary. |
| **Reproject** | Determines whether vertices in the inset region should be projected back onto the input surface. |
| **Boundary Only** | Controls whether the operation moves interior vertices as well, or only the boundary vertices. |
| **Area Scale** | Adjusts area scaling when solving for interior vertices. |

These settings are most noticeable on high-resolution and curved surfaces.

Properties for Options (-> polygroup-edit-tool-reference-in-unreal-engine) and Gizmo (-> polygroup-edit-tool-reference-in-unreal-engine) are also available.

### Outset

The **Outset** operation expands the set of selected faces out to create new faces. Mouse movement controls the outset distance. Click in the viewport to confirm the outset distance.

When you click the Outset operation, the Tool Properties panel displays the operation's properties. The Outset operation is also available as a standalone tool in the **Select** category. To learn more about this category, see Mesh Element Selection (-> modeling-mode-in-unreal-engine).

| **Current Operation** | Description |
| --- | --- |
| **Done** | Click to exit the operation if you decide no changes are needed. You can also use **Ctrl **+ **Z** to cancel the operation. |

| **Inset/Outset** | Description |
| --- | --- |
| **Softness** | Amount of smoothing applied to the inset boundary. When low, faces may begin to overlap at bends in the selection boundary. |
| **Boundary Only** | Controls whether outset operation moves interior vertices as well as border vertices. |
| **Area Scale** | Adjusts area scaling when solving for interior vertices. |

These settings are most noticeable on high-resolution and curved surfaces.

Properties for Options (-> polygroup-edit-tool-reference-in-unreal-engine) and Gizmo (-> polygroup-edit-tool-reference-in-unreal-engine) are also available.

### Bevel

The **Bevel** operation slants the edge loops around the selected faces, creating edge-aligned faces.

When you click the Bevel operation, the Tool Properties panel displays the operation's properties. The Bevel operation is also available as a standalone tool in the **Select** category. To learn more about this category, see Mesh Element Selection (-> modeling-mode-in-unreal-engine).

| **Current Operation** | Description |
| --- | --- |
| **Apply** | Bakes changes into the mesh. |
| **Cancel (Esc)** | Negates changes. |

| **Bevel** | Description |
| --- | --- |
| **Bevel Distance** | Adjusts the length of the bevel. Setting the length too high can cause faces to overlap. |

Properties for Options (-> polygroup-edit-tool-reference-in-unreal-engine) and Gizmo (-> polygroup-edit-tool-reference-in-unreal-engine) are also available.

### Delete

The **Delete** operation removes selected faces. You can also use the hotkeys **Backspace** and **Delete**.

### Merge

The **Merge** operation combines the set of selected faces into one, creating a new PolyGroup.

### Cut Faces

The **Cut Faces** operation divides the selected faces at the drawn line, as if cutting them with a plane through that line. New PolyGroups are formed at the border of the cut.

To draw a line, follow these steps:

- Click any point on the selected faces or snap to a vertex.

- Move your cursor to set the line direction and distance.

- Click to set the cut line.

The cut occurs only on selected faces, including occluded faces, where the drawn line intersects.

When you click the Cut Faces operation, the Tool Properties panel displays the operation's properties. The Cut Faces operation is also available as a standalone tool in the **Select** category. To learn more about this category, see Mesh Element Selection (-> modeling-mode-in-unreal-engine).

| **Current Operation** | **Description** |
| --- | --- |
| **Done** | Click to exit the operation if you decide no changes are needed. You can also use **Ctrl **+ **Z** to cancel the operation. |

| **Cut** | **Description** |
| --- | --- |
| **Orientation** | Determines how the cutting plane is oriented when splitting the faces. The difference is easier to see when cutting a curved face. You can choose from the following: **Face Normals:** The cutting plane is oriented using the normals at the endpoints of the drawn line. **View Direction:** The cutting plane is oriented to align with the view direction. |
| **Snap Vertices** | Determines if the cursor should snap to vertices. |

Properties for Options (-> polygroup-edit-tool-reference-in-unreal-engine) and Gizmo (-> polygroup-edit-tool-reference-in-unreal-engine) are also available.

### Recalc Normals

The **Recalc Normals** operation recalculates normals for the current set of selected faces.

 [image: Normals After Editing a Mesh]

 [image: Normals Recalucated]

### Flip

The **Flip** operation inverts normals and face orientation for the current set of selected faces.

Click image to expand.

### Retriangulate

The **Retriangulate** operation removes all interior vertices in the selection and attempts to retriangulate it using only its boundary.

 [image: Interior Vertices]

 [image: Minimized Triangulation]

### Decompose

The **Decompose** operation splits each of the selected faces into a separate PolyGroup per triangle.

### Disconnect

The **Disconnect** operation separates the selected faces at their borders, disconnecting them from the mesh.

Click image to expand.

### Duplicate

The **Duplicate** operation copies the selected faces at their border. Duplicated faces are disconnected from the mesh.

Click image to expand.

## Shape Edits

The **Shape Edits** section contains operations for editing the mesh as a whole.

### Insert Edge Loop

Use the **Insert Edge Loop** operation to insert a chain of edges across quad-like PolyGroups in a mesh. You can only add edges to quad-like faces, which have exactly four corners. You can set multiple insertions while the operation is active.

When you click the Insert Edge Loop operation, the Tool Properties panel displays the operation's properties. The Insert Edge Loop operation is also available as a standalone tool in the **Select** category. To learn more about this category, see Mesh Element Selection (-> modeling-mode-in-unreal-engine).

| **Current Operation** | Description |
| --- | --- |
| **Done** | Click to exit the operation if you decide no changes are needed. You can also use **Ctrl **+ **Z** to cancel the operation. |

| **Insert Edge Loop** | Description |
| --- | --- |
| **Position Mode** | Determines how edge loops position themselves vertically relative to loop direction. You can choose from the following methods: **Even:** Inserts edges by evenly dividing the start and destination edges of each face. For example, when inserting a single loop at a time, the new edges cross existing edges exactly at their halfway point. When Even is active, **Number of Loops** is available. **Number of Loops:** Determines how many loops to insert at a time. **Proportion Offset:** Edge loops fall at the same length proportion at each edge they intersect. **Distance Offset:** Edge loops fall at a constant distance from the start of each edge they intersect. This clamps to the end if the edge is too short. When Distance Offset is active, Flip Offset Direction is available. **Flip Offset Direction:** Measure the distance offset from the opposite side of the edges. |
| **Insertion Mode** | Determines how edge loops are added to the mesh. You can choose from the following methods: **Retriangulate:** Deletes existing groups, and new triangles are created for the new groups. This process keeps topology simple but breaks non-planer groups. **Plane Cut:** Keeps existing triangles and cuts them to create a new path. This process preserves the shape of non-planar groups, but may result in fragmented triangles over time. |
| **Highlight Problem Groups ** | When true, non-quad-like PolyGroups that stop the loop are highlighted with X’s marking the corners. |

| **Advanced** | Description |
| --- | --- |
| **Interactive** | Decides if the offset amount of the edge is set by the cursor or numerical value. When false, the offset is numerically specified by Distance or Proportion Offset, and mouse clicks only choose the edge. Not available for the Even position mode. |
| **Distance Offset** | Numerically sets the offset amount.Only available when Interactive is false and Position Mode is set to Distance Offset. |
| **Proportion Offset** | Numerically sets the offset amount. Only available when Interactive is false, and Position Mode is set to Proportion Offset. |
| **Vertex Tolerance** | Determines** **how close a new loop edge needs to pass next to an existing vertex when crossing an edge to use that vertex rather than creating a new one. |

Properties for Options (-> polygroup-edit-tool-reference-in-unreal-engine) and Gizmo (-> polygroup-edit-tool-reference-in-unreal-engine) are also available.

### Insert Edge

Use **Insert Edge** to add an edge to existing edges or vertices across a single face. You can set multiple insertions while the operation is active.

To insert an edge, follow these steps:

- Click along an edge of the mesh or snap to a vertex.

- Move your cursor to set the edge direction and distance.

- Click a neighboring edge or snap to a vertex to add the new edge.

Insert Edge cannot add an edge in cases where doing so would not be enough to divide the given face into separate parts.

For example, it is unable to connect the inner and outer edges of an O-shaped face because the triangles of the face would stay connected in a C-shape, meaning there is no PolyGroup boundary at the new edge. Inserting edges in such situations requires using the Cut Faces tool (which cuts through the entire face, not just between the endpoints) or breaking up the face into new PolyGroups.

When you click the Insert Edge operation, the Tool Properties panel displays the operation's properties.

| **Current Operation** | **Description** |
| --- | --- |
| **Done** | Click to exit the operation if you decide no changes are needed. You can also use **Ctrl **+ **Z** to cancel the operation. |

| **Insert Edge** | **Description** |
| --- | --- |
| **Insertion Mode** | Determines how edge loops are added to the mesh. You can choose from the following methods: **Retriangulate:** Deletes existing groups, and new triangles are created for the new groups. This process keeps topology simple but breaks non-planer groups. **Plane Cut:** Keeps existing triangles and cuts them to create a new path. This process preserves the shape of non-planar groups, but may result in fragmented triangles over time. |
| **Continuous Insertion** | When true, edge insertions are chained together so that each endpoint becomes the new start point. |

| **Advanced** | **Description** |
| --- | --- |
| **Vertex Tolerance** | Determines how close a new edge needs to pass next to an existing vertex when crossing an edge to use that vertex rather than creating a new one. Particularly relevant when using Plane Cut mode when there are interior vertices present. |

Properties for Options (-> polygroup-edit-tool-reference-in-unreal-engine) and Gizmo (-> polygroup-edit-tool-reference-in-unreal-engine) are also available.

### Simplify by Groups

**Simplify by Groups** simplifies every PolyGroup by removing vertices on shared straight edges, removing all interior vertices, and retriangulating.

This process is helpful in cleaning up mesh topology when PolyGroups are simple and there are unneeded interior or colinear vertices. However, avoid using the operation for PolyGroup topologies that involve non-planar faces, as it loses their shape and destroys any faces that could not be retriangulated (a warning is shown in this case after completion). For instance this currently fails to retriangulate the side of a cylinder when it is a single PolyGroup.

 [image: Interior Vertices]

 [image: Simplified]

## Edge Edits

The **Edge Edits** section contains operations for editing the PolyGroup edges of a mesh. Before using the operations, you must select an edge. For more information, see the Selection Filter (-> polygroup-edit-tool-reference-in-unreal-engine) section.

### Weld

The Weld operation merges two selected edges, moving the first selected edge to the second.

### Straighten

The **Straighten** operation makes each selected edge follow a straight path between its endpoints.

### Fill Hole

The **Fill Hole** operation fills the adjacent hole for any selected boundary edges.

### Bevel

The **Bevel** operation slants the selected edges, replacing them with angled faces.

 [image: No Bevel]

 [image: Bevel]

### Bridge

The **Bridge** operation creates a new face that connects the selected edges.

### Simplify

The **Simplify** operation attempts to remove colinear vertices along the edge when doing so does not change the UVs or make low-quality triangles.

## UVs

The **UVs** section contains operations for editing the UVs of a mesh.

### Planar Projection

The **Planar Projection** operation interactively sets UVs on selected faces.

To set UVs, follow these steps:

- Click the face.

- Drag the cursor in or out.

- Click to set the UV.

The drawn line can snap to vertices, helping control orientation. To learn more about creating and editing UVs, see UV Editor (-> uv-editor-in-unreal-engine). When you click the Planar Projection operation, the Tool Properties panel displays the operation's properties.

|  | **Current Operation** | **Description** |
| --- | --- | --- |
| **Done** | Click to exit the operation if you decide no changes are needed. You can also use **Ctrl **+ **Z** to cancel the operation. |  |

| **Planar Project UV** | **Description** |
| --- | --- |
| **Show Material** | Determines the type of material to set, default or checkerboard. When false, the checkerboard material becomes active. |

Properties for Options (-> polygroup-edit-tool-reference-in-unreal-engine) and Gizmo (-> polygroup-edit-tool-reference-in-unreal-engine) are also available.

## Selection Actions

You can manually select elements (PolyGroup vertices, edges, and faces) of a mesh using the **Selection Filter** or perform quick selections using **Selection Actions**.

| **Selection Action** | **Description** |
| --- | --- |
| **Invert Selection** | Selects all of the specified element that you did not select and deselect any elements that were selected. The selected element type depends on the Selection Filter. If multiple element icons are selected, the first active element in the Selection Filter (furthest to the left) is selected. |
| **Select All** | Selects all of the specified element. The selected element type depends on the selection filter. If multiple element icons are selected, the first active element in the Selection Filter (furthest to the left) is selected. |

## Selection Filter

The **Selection Filter** controls which element (PolyGroup vertices, edges, and faces) of your mesh can be selected. All elements can be set to true at once. Click the icons to enable and disable the selection of the element.

 [image: Selection Filter Icons]

For marquee selection, click and drag in the viewport to select multiple components of an element at once. Use the properties in **Additional Selection Options** for further control. If multiple elements are enabled when marquee selecting, then the first active element (furthest to the left) is selected.

| **Element Icon** | **Description** |
| --- | --- |
| [image: Select Verticies PolyGroups] | Select vertices of a PolyGroup. |
| [image: Select PolyGroup Edges] | Select edges of a PolyGroup. |
| [image: Select PolyGroup Faces] | Select PolyGroup faces |
| [image: Select PolyGroup Edge Loops] | Select PolyGroup edge loops. Edge loops are paths through vertices with four attached edges. |
| [image: Select PolyGroup Ring E] | Select ring of PolyGroup edges. Rings are sequences of edges that lie across from each other over a face that has four PolyGroup edges. |

If you cannot select elements as expected, confirm you set your PolyGroups correctly.

## Additional Selection Options

| **Additional Selection Options** | **Description** |
| --- | --- |
| **Marquee Ignore Occlusion** | When true, the marquee selection includes all valid geometric components. When false, the marquee selection only includes elements that are visible from the current camera. |

| **Ortho Viewport Behavior** | **Description** |
| --- | --- |
| **Prefer Projected Element** | Selects an edge projected to a point rather than the vertex at that point, or a face projected to an edge rather than that edge. |
| **Select Down Ray** | If the closest element is valid, selects other elements behind it that are aligned with it. |
| **Ignore Occlusion** | Does not check whether the closet element is occluded from the current view in a lit version of the scene. |
| **Hit Back Faces** | Selects the back side of a face. It can be helpful to turn this off when working with an "inside-out" mesh, such as a cube representing the inside of a room where the sides face inward, to avoid selecting the closer back faces. |
| **Enable Marquee** | Activates marquee selection. |

## Options

Additional options for visualization.

| **Visualization Option** | Description |
| --- | --- |
| **Show Wireframe** | Creates an outline of your mesh's topology at the triangle level. |
| **Show Selectable Corners** | Toggle visibility of generated corners. For more information, see the **Topology Options (-> polygroup-edit-tool-reference-in-unreal-engine)** section below. |
| **Gizmo Visible** | Toggle visibility of the transform gizmo. |

## Gizmo

Additional gizmo control when you set the gizmo's coordinate system to local space is active. The settings are deactivated when you enable world transform.

| **Gizmo Opton** | **Description** |
| --- | --- |
| **Local Frame Mode** | Determines if the gizmo's rotation is taken from the selected element (**From Geometry**) or from the transform of the mesh as a whole (**From Object**). |
| **Lock Rotation** | When true, keep the gizmo orientation of the last selection. Toggle with **Q0** hotkey. |

## Topology Options

As you group triangles to create a PolyGroup, a boundary edge will form, encompassing the triangles. Depending on the topology of your mesh and generated PolyGroups, editing the edges of your mesh may not work as you expect compared to other modeling Digital Content Creation (DCC) software.

In the image below, the mesh includes two PolyGroups, represented by the highlighted boundary edge. Although the boundary of the PolyGroups appears to have multiple edges due to its bending shape, it does not consist of any PolyGroup vertices, meaning there is only one PolyGroup edge.

 [image: PolyGroup Boundary Edge]

PolyGroup edges and vertices are generated under the following conditions:

- Two or more connecting PolyGroup faces (or a mesh boundary) create a PolyGroup edge.

- Three or more connecting PolyGroup edges create a PolyGroup vertex.

To help generate extra edges and vertices along a PolyGroup boundary where there are one or no neighboring faces, the following topology options are available.

| **Topology Options** | **Description** |
| --- | --- |
| **Add Extra Corners** | Adds corners at sharp group edge bends to generate PolyGroup vertices. This generation is in addition to the normal corners that are placed at junctions of three or more PolyGroup edges |
| **Extra Corner Angle Threshold Degrees** | Determines how sharp the angle must be to warrant an extra corner. Lower values require sharper corners, making it more tolerant of curved group edges. The setting is applied either when Regenerate Extra Corners is clicked or after any operation that modifies topology. If you have unexpected corners (extra vertices and edges) either adjust the angle threshold or disable Add Extra Corners, then click Regenerate Extra Corners. |
| **Regenerate Extra Corners** | Regenerates extra corners. Must be clicked after toggling Add Extra Corners or adjusting the angle threshold. |

## Hotkeys

| **Hotkey ** | **Description ** |
| --- | --- |
| ** F** | Zooms into the location of the selection. |
| **Shift + Click/Drag** | Adds elements to the current selection. |
| **Ctrl + Click/Drag** | Removes elements from the current selection. |
| ** Ctrl + Shift + Click/Drag** | Toggles the elements in the selection. |
| **Enter** | Accepts tool changes. |
| **ESC** | Cancels the changes and exit the tool. |
| **Middle-Drag Gizmo** | Transforms mesh pivot. Hold Ctrl to enable snapping. |
| **Ctrl + Drag Gizmo** | Snaps transform of selected element. |
| **Q** | Locks the gizmo rotation. |

- beta
- modeling mode
- modeling tools
- polygon modeling

On this page

- Face Edits (-> polygroup-edit-tool-reference-in-unreal-engine)
- Extrude (-> polygroup-edit-tool-reference-in-unreal-engine)
- Extrude Direction Mode Examples (-> polygroup-edit-tool-reference-in-unreal-engine)
- Offset (-> polygroup-edit-tool-reference-in-unreal-engine)
- Offset Direction Mode Examples (-> polygroup-edit-tool-reference-in-unreal-engine)
- Push Pull (-> polygroup-edit-tool-reference-in-unreal-engine)
- Push Pull Direction Mode Examples (-> polygroup-edit-tool-reference-in-unreal-engine)
- Inset (-> polygroup-edit-tool-reference-in-unreal-engine)
- Outset (-> polygroup-edit-tool-reference-in-unreal-engine)
- Bevel (-> polygroup-edit-tool-reference-in-unreal-engine)
- Delete (-> polygroup-edit-tool-reference-in-unreal-engine)
- Merge (-> polygroup-edit-tool-reference-in-unreal-engine)
- Cut Faces (-> polygroup-edit-tool-reference-in-unreal-engine)
- Recalc Normals (-> polygroup-edit-tool-reference-in-unreal-engine)
- Flip (-> polygroup-edit-tool-reference-in-unreal-engine)
- Retriangulate (-> polygroup-edit-tool-reference-in-unreal-engine)
- Decompose (-> polygroup-edit-tool-reference-in-unreal-engine)
- Disconnect (-> polygroup-edit-tool-reference-in-unreal-engine)
- Duplicate (-> polygroup-edit-tool-reference-in-unreal-engine)
- Shape Edits (-> polygroup-edit-tool-reference-in-unreal-engine)
- Insert Edge Loop (-> polygroup-edit-tool-reference-in-unreal-engine)
- Insert Edge (-> polygroup-edit-tool-reference-in-unreal-engine)
- Simplify by Groups (-> polygroup-edit-tool-reference-in-unreal-engine)
- Edge Edits (-> polygroup-edit-tool-reference-in-unreal-engine)
- Weld (-> polygroup-edit-tool-reference-in-unreal-engine)
- Straighten (-> polygroup-edit-tool-reference-in-unreal-engine)
- Fill Hole (-> polygroup-edit-tool-reference-in-unreal-engine)
- Bevel (-> polygroup-edit-tool-reference-in-unreal-engine)
- Bridge (-> polygroup-edit-tool-reference-in-unreal-engine)
- Simplify (-> polygroup-edit-tool-reference-in-unreal-engine)
- UVs (-> polygroup-edit-tool-reference-in-unreal-engine)
- Planar Projection (-> polygroup-edit-tool-reference-in-unreal-engine)
- Selection Actions (-> polygroup-edit-tool-reference-in-unreal-engine)
- Selection Filter (-> polygroup-edit-tool-reference-in-unreal-engine)
- Additional Selection Options (-> polygroup-edit-tool-reference-in-unreal-engine)
- Options (-> polygroup-edit-tool-reference-in-unreal-engine)
- Gizmo (-> polygroup-edit-tool-reference-in-unreal-engine)
- Topology Options (-> polygroup-edit-tool-reference-in-unreal-engine)
- Hotkeys (-> polygroup-edit-tool-reference-in-unreal-engine)

Related documents

PolyGroup Edit

 [image: PolyGroup Edit] (-> polygroup-edit-tool-in-unreal-engine)Modeling Tools

 [image: Modeling Tools] (-> modeling-tools-in-unreal-engine)Modeling Mode Overview

 [image: Modeling Mode Overview] (-> modeling-mode-in-unreal-engine)

# Draw Spline

https://dev.epicgames.com/documentation/en-us/unreal-engine/draw-spline-tool-in-unreal-engine?application_version=5.9

> Overview for creating splines with the Draw Spline modeling tool.

[image: Draw Spline]

Learn to use this **Beta** feature, but use caution when shipping with it.

The **Draw Spline** tool creates splines in the Level Editor. You can use your created splines with the **Revolve Spline** and **Mesh Splines** modeling tools to create meshes, or with custom blueprint actors to create a variety of objects such as rails or vines.

To learn more about other spline workflows, see the following:

- Blueprint Splines (-> blueprint-splines-in-unreal-engine)

- Camera Rig (-> camera-jibs-and-dollies-in-unreal-engine)

You can edit splines outside of the tool by selecting and manipulating points on the spline, right-clicking the spline, or using the** Details** panel.

## Accessing the Tool

You can access the Draw Splines tool from the **Create** category in **Modeling Mode**. To learn more about Modeling Mode and how to access it, see Modeling Mode Overview (-> modeling-mode-in-unreal-engine).

## Using Draw Spline

To create a spline, follow these steps:

- Choose an output type for the spline from the **Output Mode** dropdown.

- Choose how to draw your spline from the **Draw Mode** dropdown.

- Click or drag in the level to draw your spline.

- Accept or cancel the changes in the Tool Confirmation (-> modeling-mode-in-unreal-engine) panel.

### Output Mode

**Output Mode** determines how a spline component is created.

| **Output Mode** | **Description** |
| --- | --- |
| **Empty Actor** | Creates an empty actor with a spline component. |
| **Existing Actor** | Attaches the spline component to an existing actor or replaces a spline inside that actor if **Existing Spline Index To Replace** is valid. To choose an existing actor, click the actor before switching the mode or use the eyedropper to choose. |
| **Create Blueprint** | Creates the Blueprint specified by **Blueprint To Create** and attaches the spline to that, or replaces an existing spline in the created object if **Existing Spline Index To Replace** is valid. |

If you are working with a blueprint actor that has an expensive construction script, it can be helpful to turn off **Rerun Construction Script on Drag **under advanced options.

### Draw Mode

To adjust how the spline is drawn in the scene, use the properties in the **Draw Mode** section. You can switch between the modes while creating a spline in the level.

| **Draw Mode** | **Description** | **Example** |
| --- | --- | --- |
| **Tangent Drag** | Draws a spline point by point with manual control over curvature (via tangents). Click to place a point and drag to set its tangent. Clicking without dragging creates sharp corners. | [image: Tangent Drag Draw Mode] |
| **Click Auto Tangent ** | Draws a spline point by point with curvature automatically set. Click and drag to place new points, with the tangent set automatically. | [image: Click Auto Tangent Draw Mode] |
| **Free Draw ** | Draws a spline with a freehand motion. Click and drag to place multiple points, with spacing controlled by **Min Point Spacing**. | [image: Free Draw Draw Mode] |

To have an open or closed path you can toggle **Loop**. When true, points continue to append to the loop as you draw onto it. To help visualize the path and rotation, increase the **Frame Visualization Width** value.

### Raycast Targets

The **Raycast Targets** section determines how the mouse location interacts with the scene while drawing a spline. You can toggle multiple options at the same time.

You must have at least one option enabled to draw a spline.

| **Raycast Targets ** | **Description** | **Example** |
| --- | --- | --- |
| **World ** | Splines are drawn on mesh surfaces in the level, except the target mesh when **Existing Actor** is enabled. | [image: World Raycast Target] |
| **Custom Plane ** | Splines are drawn on a plane that you can reposition with the gizmo or with **Ctrl + Click.** | [image: Custom Plane Raycast Target] |
| **Ground Planes** | Splines are drawn on the XY ground plane in the perspective viewport, or on the viewed plane in orthographic viewports. | [image: Ground Plane Raycast Target] |

### Hotkeys

| **Hotkey ** | **Description ** |
| --- | --- |
| **C** | Zooms into the location of the mouse. |
| **Enter** | Accepts tool changes. |
| **ESC** | Cancels the changes and exit the tool. |

- beta
- modeling mode
- modeling tools
- splines
- spline mesh

On this page

- Accessing the Tool (-> draw-spline-tool-in-unreal-engine)
- Using Draw Spline (-> draw-spline-tool-in-unreal-engine)
- Output Mode (-> draw-spline-tool-in-unreal-engine)
- Draw Mode (-> draw-spline-tool-in-unreal-engine)
- Raycast Targets (-> draw-spline-tool-in-unreal-engine)
- Hotkeys (-> draw-spline-tool-in-unreal-engine)

Related documents

Modeling Tools

 [image: Modeling Tools] (-> modeling-tools-in-unreal-engine)Modeling Mode Overview

 [image: Modeling Mode Overview] (-> modeling-mode-in-unreal-engine)

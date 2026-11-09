# Data Visualization Flags

https://dev.epicgames.com/documentation/en-us/unreal-engine/data-visualization-flags-in-chaos-visual-debugger?application_version=5.9

> Understand data visualization flags in Chaos Visual Debugger.

[image: Data Visualization Flags]

To help you identify unusual physics behavior, **Chaos Visual Debugger (-> chaos-visual-debugger-in-unreal-engine)** (**CVD**) provides debug draw tools to visualize aspects of your application that are not normally visible during runtime.

You can control which debug draw tools are visualized in the viewport by toggling data flags. Data flags are organized into the following categories:

- Collision Data (-> data-visualization-flags-in-chaos-visual-debugger)
- Scene Queries (-> data-visualization-flags-in-chaos-visual-debugger)
- Particle Data (-> data-visualization-flags-in-chaos-visual-debugger)
- Joint Constraints (-> data-visualization-flags-in-chaos-visual-debugger)
- Character Ground Constraints (-> data-visualization-flags-in-chaos-visual-debugger)
- Generic Debug Draw Data (-> data-visualization-flags-in-chaos-visual-debugger)
- Acceleration Structures (-> data-visualization-flags-in-chaos-visual-debugger)
- Common Show Flags (-> data-visualization-flags-in-chaos-visual-debugger)

Certain flags, such as **Center of Mass**, can have a performance impact on CVD. If the debug draw limit is reached, a warning appears in the viewport reading:

`Max Debug Draw lines limit reached! Try selecting fewer debug draw categories or focus the camera in a narrower area.`

## Collision Data

Visualized collision data can help you identify areas where collisions are behaving unexpectedly. For example, when two objects intersect one another, instead of colliding as expected.

To enable collision data, follow these steps:

- In the Viewport Toolbar, click **Show > Collision Data Flags > Enable Draw**. This option opens a list of data flags.[image: Collision Data Flags]
- Choose from the list of data flags to toggle on or off. [image: Collision Data Flags]
- Click **Collision Data Visualization Settings** to customize how the data is drawn in the viewport.[image: Collision Visualization Settings]

The visualization settings include the following options:

- **Show Debug Text:** Toggles viewport debug text (if any) on and off.
- **Depth Priority:** Draws data in **worldspace **or in the **foreground **(always on top of any other scene components).
- **Options for Scale and Radius:** Control the size of debug draw elements, making them easier to see in the viewport.

Most data flags include visualization settings that contain similar toggleable features.

## Scene Queries

Visualized scene queries (-> traces-in-unreal-engine---overview) (line traces, sweeps, and overlaps) can help you debug cases where you performed a query during runtime but the query didn't find an expected object.

To enable scene query data, follow these steps:

- In the Viewport Toolbar, click **Show > Scene Query Data Flags > Enable Draw**. This option opens a list of data flags.[image: Scene Query Data Flags]
- Choose from the list of data flags to toggle on or off. [image: Scene Query Flags]
- Click **Scene Query Visualization Settings** to customize how the data is drawn in the viewport.[image: Scene Query Visualization Settings]

## Particle Data

Visualized particle data can help you identify irregular particle behavior, such as a particle moving faster than expected after applying a force.

To enable particle data, follow these steps:

- In the Viewport Toolbar, click **Show > Particle Data Flags > Enable Draw**. This option opens a list of data flags.[image: Particle Data Flags]
- Choose from the list of data flags to toggle on or off. [image: Particle Data Flags]
- Click **Particle Data Visualization Settings** to customize how the data is drawn in the viewport.[image: Particle Visualization Settings]

CVD only records and visualizes **physics thread** particle data, not **game thread** particle data. Game thread particle data is not visualized.

### Geometry

Most particles have both simple and complex collision geometry (-> simple-versus-complex-collision-in-unreal-engine), but only one is used for collision detection.

Options for toggling between simple and complex geometry, and other geometry visualization flags, are located in the Viewport Toolbar under **Show > Geometry Flags** menu.

[image: Geometry Visualization Flags]

**Query Only** geometry is visualized with translucent material. You can click through translucent materials by pressing **T **(or click **Allow Translucent Selection** in the Hamburger Menu) to enable or disable translucent selects.

### Particle Colorization

To increase draw visibility, you can choose to colorize particles using the following modes:

- **None:** Draws particles in default gray.
- **State: **Colorizes based on a physics body’s state (-> physics-bodies-reference-for-unreal-engine) in a simulation (dynamic, sleeping, kinematic, or static).
- **Shape Type: **Colorizes based on collision geometry type (-> simple-versus-complex-collision-in-unreal-engine) (simple shapes, convex, heightfield, or trimesh).
- **Client Server:** Colorizes based on client or server-spawned particles.

 [image: State and Default Gray] [image: State and Default Gray]

**State and Default Gray**

To change the mode and customize the colors, follow these steps:

- In the Viewport Toolbar, click **Show > Particle Colorization**. [image: Particle Colorization]
- In the **Colors Mode** dropdown, click the **Particle Color Mode** dropdown, and select the mode to use. [image: Particle Color Mode]
- Click the **Colors by [mode]** dropdown menu to customize colors. Then, click a color tile to open a contextual color picker.[image: Color Picker]

The table below describes the contextual color picker user interface (UI).

| Number | Description |
| --- | --- |
| 1 | Color wheel (or color spectrum if toggled). |
| 2 | Displays current and previously selected colors. |
| 3 | Toggles sRGB preview. |
| 4 | Toggles between the color wheel and color spectrum. |
| 5 | Toggles visibility of **Color Schemes**. |
| 6 | Eyedropper tool. |
| 7 | RBG/HSV sliders. |
| 8 | Alpha slider. |
| 9 | Displays the current color’s hex code. |
| 10 | **Color Schemes**: Functions similarly to swatches in Adobe Photoshop and other design programs. |

## Joint Constraints

Visualized joint constraints can help you debug unwanted ragdoll behavior, such as twisting joints. CVD records joint constraint data as an individual piece of data for every frame. Due to this, maintaining a selection across gameplay frames is not currently possible.

To enable joint constraint data, follow these steps:

- In the Viewport Toolbar, click **Show > Joint Constraint Data Flags > Enable Draw**. This option opens a list of data flags.[image: Enable Joint Constraint Flags]
- Choose from the list of data flags to toggle on or off. [image: Joint Constraint Flags]
- Click **Joint Constraint Visualization Settings** to customize how the data is drawn in the viewport.[image: Joint Constraint Visualization Flags]

CVD doesn’t record joint constraints by default. To enable it, click the **Data Channel** dropdown menu in the main toolbar, and check **JointConstraints**.

[image: Enable Join Constraints]

## Character Ground Constraints

CVD can record the state of character ground constraints used by Unreal Engine’s Character Movement System, called Mover 2.0 (-> mover-in-unreal-engine). Using this flag, you can identify and debug unusual behavior such as characters floating above or clipping through a ground plane.

To enable character ground constraint data, follow these steps:

- In the Viewport Toolbar, click **Show > Character Ground Constraints Data Flags > Enable Draw**. This option opens a list of data flags.[image: Enable Ground Constraints]
- Choose from the list of data flags to toggle on or off. [image: Ground Constraint Flags]
- Click **Character Ground Constraints Visualization Settings**, to customize how the data is drawn in the viewport.[image: Ground Constraint Visualization Flags]

CVD doesn’t record character ground constraints by default. To enable it, click the **Data Channel** dropdown menu in the main toolbar, and check **Character Ground Constraints**.

[image: Data Channels Ground Constraints]

## Generic Debug Draw Data

The following C++ macros and Blueprint nodes (-> nodes-in-unreal-engine) record debug draw shapes directly in CVD. Debug draw shapes can offer context when debugging physics calculations.

For example, if you use two points in space to calculate a force applied to a physics body, CVD only shows the body before and after the force is applied. If something looks off, you can use generic debug draw macros (or Blueprint nodes) to visualize the two points, and the force, frame-by-frame. This workflow can provide context on how the force was calculated and help you to correct it.

### C++ Macros

Depending on the shape you need to draw, each macro has its own set of parameters — except for the following optional parameters, which each macro uses:

| Macro | Parameter | Description |
| --- | --- | --- |
| **TraceDebugDrawBox** | **InBox** | The shape you want to record. |
| All macros | **Tag** | The FName that is used as a tag for filtering, search, and debug draw as a text tag in CVD’s viewport. |
| All macros | **Color** | The color to apply to this shape when it’s debug drawn in CVD. |
| All macros | **SolverID** | The ID of the solver this shape should be associated with. If no ID is provided, this shape is added as part of the current game from data bucket. |
| **TraceDebugDrawLine**, **TraceDebugDrawVector** | **InStartLocation** | The start point of the line. |
| **TraceDebugDrawLine** | **InEndLocation** | The end point of the line. |
| **TraceDebugDrawVector** | **InVector** | The vector you want to record. |
| **TraceDebugDrawSphere** | **Center** | The origin point of the sphere. |
| **TraceDebugDrawSphere** | **Radius** | The radius of the sphere. |
| All macros | **Owner** | Any UObject this debug draw shape is related to. This is used internally to know if a shape is recorded from a server solver or a client solver. |

### Blueprint Nodes

The following generic debug draw macros can also be implemented as function nodes in a Blueprint’s **Event Graph:**

- CVD Record Debug Draw Sphere
- CVD Record Debug Draw Box
- CVD Record Debug Draw Line

[image: Event Graph]

For more information about each node, see the Chaos Visual Debugger section of Unreal Engine Blueprint API Reference (-> BlueprintAPI).

#### Enable Generic Debug Draw Data

To enable generic debug draw data, follow these steps:

- In the Viewport Toolbar, click **Show > Generic Debug Draw Data Flags > Enable Draw**. This option opens a list of data flags.[image: Generic Debug Draw Data Flags]
- Choose from the list of data flags to toggle on or off. [image: Generic Debug Draw Options]
- Click **Generic Debug Draw Data Visualization Settings** to customize how the data is drawn in the viewport.[image: Generic Debug Draw Data Enabled]

## Acceleration Structures

CVD can record and visualize acceleration structures used by the scene query system, which is currently an AABB (Axis-Aligned Bounding Box) Tree. An AABB Tree is a bounding volume hierarchy you can use to determine potential overlaps between objects.

In CVD, you can use AABB Tree visualization to see the composition of the tree and the bounds of each object as they were added to the tree.

This visualization is useful when an object that a scene query should have hit wasn’t hit, or wasn’t even evaluated by the physics engine. You can use AABB Tree visualization in CVD to inspect the bounds of the object and determine whether the error was caused by, for example, the bounds failing to encompass the object visually or incorrect bounds within the tree.

To customize which acceleration structure data flags are drawn, follow these steps:

- In the **Viewport, click Show > Acceleration Structure Data Flags**, and select your desired data flags.[image: Acceleration Structure Data Flags]
- Click **Acceleration Structure Visualization Settings** to customize how the data is drawn in the viewport.[image: Acceleration Structure Visualization Settings]

CVD doesn’t record acceleration structures by default. To enable it, click the **Data Channel** dropdown menu in the Main Toolbar, and check **Acceleration Structures Data**.

[image: Enable Acceleration Structure Data Channel]

## Common Show Flags

The **Common Show Flags** menu contains flags derived from the engine itself that can assist with visibility in CVD.

To customize which flags are enabled, in the Viewport Toolbar, click the **Show > Common Show Flags**.

[image: Common Show Flags]

## Next Up

- [image: Data Inspectors] Data InspectorsUnderstand data inspectors in Chaos Visual Debugger. (-> data-inspectors-in-chaos-visual-debugger)

- [image: Capturing Data with Chaos Visual Debugger] Capturing Data with Chaos Visual DebuggerCapture and play back recordings with Chaos Visual Debugger. (-> capturing-data-with-chaos-visual-debugger)

- chaos visual debugger

On this page

- Collision Data (-> data-visualization-flags-in-chaos-visual-debugger)
- Scene Queries (-> data-visualization-flags-in-chaos-visual-debugger)
- Particle Data (-> data-visualization-flags-in-chaos-visual-debugger)
- Geometry (-> data-visualization-flags-in-chaos-visual-debugger)
- Particle Colorization (-> data-visualization-flags-in-chaos-visual-debugger)
- Joint Constraints (-> data-visualization-flags-in-chaos-visual-debugger)
- Character Ground Constraints (-> data-visualization-flags-in-chaos-visual-debugger)
- Generic Debug Draw Data (-> data-visualization-flags-in-chaos-visual-debugger)
- C++ Macros (-> data-visualization-flags-in-chaos-visual-debugger)
- Blueprint Nodes (-> data-visualization-flags-in-chaos-visual-debugger)
- Enable Generic Debug Draw Data (-> data-visualization-flags-in-chaos-visual-debugger)
- Acceleration Structures (-> data-visualization-flags-in-chaos-visual-debugger)
- Common Show Flags (-> data-visualization-flags-in-chaos-visual-debugger)
- Next Up (-> data-visualization-flags-in-chaos-visual-debugger)

# Landscape Splines

https://dev.epicgames.com/documentation/en-us/unreal-engine/landscape-splines-in-unreal-engine?application_version=5.9

> Splines for carving Landscape, modifying blendmask and deforming meshes into roads.

[image: Landscape Splines]

**Landscape Splines** provide a powerful toolset for creating roads, paths, fences, and other long, contiguous features that conform naturally to the landscape. Using the spline system, you can define smooth, adjustable curves that automatically deform the terrain and apply meshes along the path. The Landscape Spline system is procedural and editable. You can adjust, move, or reshape spline control points at any time in a non-destructive editing workflow.

## Creating a Spline

- Under the **Manage** tab, select **Spline**.****[image: Spline-tool-in-the-menu]
- Press **Ctrl + Left-click** to set your spline's first control point. The control point's sprite looks like a sculpted Landscape mountain.[image: A Spline control point]
- Press **Ctrl + Left-click** again to create another control point and connect it to the first point by a spline segment. The selection changes to the new control point so that you can repeat this action and add more control points.[image: A second spline control point]Alternatively, you can use **ALT + Left Mouse Button (LMB) Drag** to create a new spline control point and segment. Select an existing control point and **ALT+LMB Drag** in the direction you want to place the new point. If you select the point at either end of the spline, **ALT+LMB Drag** adds a new segment and extends the spline. As you drag the point, you can see what the new segment looks like in the viewport.

### Joining and Splitting Splines

To join two splines, select one spline and then **Ctrl + Left-click** on the other.

To split a spline, **Ctrl + Left-click** on a segment. This splits the segment at that point and inserts a new control point.

In addition to **Ctrl + Left-click**, you can use **ALT+LMB Drag** to split a spline. Select a spline point on either side of the segment and **ALT+LMB Drag** the cursor towards an existing segment to split the path.

If you enable **Use Auto Rotate Control Point**, after you release the cursor, the spline point auto-rotates to maintain a smooth spline.

If you enable **Auto-Rotate Always Forward**, after you release the cursor, the spline point-auto rotates in a forward direction to maintain a consistent orientation.

[image: Auto-rotate-always-forward]

### Adding a Static Mesh Actor to a Spline

- In the **Content Browser**, find and select the Static Mesh asset that you want to use with your spline.
- Click on a spline control point on your Landscape.
- In the Level Editor's **Details** panel, in the **Landscape Spline** section, click the **Segments** button. This ensures that the Static Mesh is added to all the spline's segments. **Select All** selects every spline actor within the level. If you only want to apply changes to the selected Spline graph, use the **Select Spline Points** / **Select Spline Segments** tool in the Details panel.[image: All Segments button]
- In the **Landscape Spline Meshes** section, under **Spline Meshes**, if there is no element, click the **plus** icon to add one.[image: Add Mesh]
- Expand the element you just added. Next to **Mesh**, click the **Assign** arrow icon to assign the selected Static Mesh.[image: Mesh Added]

You can also assign a Static Mesh to an individual control point by selecting that control point and assigning the Static Mesh in the **Details** panel, in the **Mesh** section.

## Editing a Spline

Spline control points respond as you would expect to the translation and rotation tools, but the scale tool brings up a different tool, spline tangents.

[image: Segment tangent scale tool]

If you select a segment, it shows the tangents at each end of the segment, and if you select a control point, it shows the tangents of all connected segments.
You can adjust the scale of the tangent by dragging the end of it, which alters how curved the segment of the spline is.

| Controls | Operation |
| --- | --- |
| **Left Mouse Button (LMB)** | Selects a control point or segment. |
| **Shift + LMB** | Selects multiple control points or segments. |
| **Ctrl + A** | Selects all control points connected to the currently selected control points and/or all segments connected to the currently selected segment. |
| **Ctrl + LMB** | Adds a new control point, and automatically connects to any selected control points.With a control point or multiple control points selected, creates a segment joining any selected control points to the new control point.With a segment selected, splits the segment at that point and inserts a new control point. |
| **ALT + LMB drag** | With a control point selected, adds a new control point and translates it in the direction of the drag.Splits the path when dragged through an existing segment.Adds a new segment when dragged away from either end of the spline |
| **Del** | Deletes the selected control points or segments. |
| **R** | Automatically calculate rotation for selected spline control points. |
| **T** | Automatically flip the tangents for the selected control points / segments. |
| **F** | Flips selected spline segments (only affects meshes on the spline). |
| **End** | Snaps the selected control points to the Landscape below. |

## Applying Splines to the Landscape

Landscape splines do not affect the heightmap until a **Spline edit layer** is added to the edit layer stack.

To add a Spline edit layer:

- Navigate to the **Edit Layer Stack.**
- **Create** a new **edit layer**.
- Select **Spline Edit Layer.**

Once you add a Spline edit layer the landscape automatically reacts to changes in the landscape spline.

The heightmap is raised or lowered to fit the spline, with a smooth cosine-blended falloff on either side. This is controlled by the width and falloff properties of the spline control points, and the **Raise/Lower Terrain** option on the individual spline segments.
The Texture layer that is painted (if any) is specified in the **Layer Name** property of the individual spline segments, and the painting is affected by the spline width and falloff settings in the control points.

## Spline Selection

The **Spline Segment/Control Point** Details panel has additional spline selection and navigation controls to help traverse the spline. The **Select All** spline buttons under the Landscape Mode panel affects all spline actors within a given level.

The **Spline Selection/Navigation** **(1)** controls in the Details panel help navigate a single, contiguous spline graph based on the current selection.

The Select controls have two modes: **Segment Selection** or **Control Point Selection**. Use the **Convert Selection To** **(2)** button to toggle the selection mode.

[image: Spline-selection-menu]

Selection Options:

| Button | Description |
| --- | --- |
| **Select First** | Selects the first segment/control point within the selected spline graph. |
| **Add Previous to Selection** | Adds the previous segment/control point to the current selection. |
| **Select Previous** | Selects the previous segment/control point in the current selected spline graph. |
| **Select All** | Select all segments/control points. |
| **Select Next** | Select the next segment/control point in the current selected spline graph. |
| **Add Next to Selection** | Adds the next segment/control point to the current selection. |
| **Select Last** | Selects the first segment/control point within the selected spline graph. |
| **Convert Selection To** | Convert current spline selection to segments or convert current segment selection to control points. |

## Spline Properties

The properties of the selected control points or segments are displayed in the Level Editor's **Details** panel.

### Control Point Properties

| Property | Description |
| --- | --- |
| **Location** | Position of the control point relative to the Landscape. |
| **Rotation** | Rotation of the control point, and controls the direction of the tangent of any attached spline segments. |
| **Half-Width** | Half-width of the spline, and shown as solid lines. Affects all connected segments. |
| **Layer Width Ratio** | Layer Width ratio of the spline at this segment. |
| **Side Falloff** | The width of the cosine-blended falloff region on either side of the spline, and shown as dotted lines. |
| **Left Side Falloff Factor** | The amount of side falloff on the left side of the control point. |
| **Right Side Falloff Factor** | The amount of side falloff on the right side of the control point. |
| **Left Side Layer Falloff Factor** | The amount of falloff on the left side of the spline applied to the target layer. |
| **Right Side Layer Falloff Factor** | The amount of falloff on the right side of the spline applied to the target layer. |
| **End Falloff** | Control point at the end of a spline with only one attached segment. The length of the cosine-blended falloff region smoothly ends the spline segment. |
| **Mesh Vertical Offset** | The offset on Z-axis for control point static meshes. |
| **Layer Name** | Name of the painted blendmask layer when applying the spline to the Landscape. |
| **Raise Terrain** | Raises the Landscape to match spline when applying the spline to the Landscape. Good for roads on embankments. |
| **Lower Terrain** | Lowers the Landscape to match spline when applying the spline to the Landscape. Good for rivers and ditches. |

### Spline Segment Properties

#### Landscape Spline Segment

| Property | Description |
| --- | --- |
| **Connections** | Settings specific to the two control points attached to the segment. |
| **Connections Sub-Properties** | **Tangent Len**: Scale of the tangent at this point, and controls the segment curve. Negative tangents cause the segment to connect to the back of the control point. **Socket Name**: Overrides the Static Mesh's assigned Material with a different Material for the spline. |
| **Layer Name** | Name of the painted blendmask layer when applying the spline to the Landscape. |
| **Raise Terrain** | Raises the Landscape to match spline when applying the spline to the Landscape. Good for roads on embankments. |
| **Lower Terrain** | Lowers the Landscape to match spline when applying the spline to the Landscape. Good for rivers and ditches. |

#### Landscape Spline Meshes

| Property | Description |
| --- | --- |
| **Spline Meshes** | The meshes applied to the spline. Multiple meshes will be applied in random order controlled by the random seed. |
| **Spline Meshes Sub-Properties (per mesh used)** | **Mesh**: The Static Mesh applied to the spline. **Material Overrides**: Socket on the control point connected to the end of the segment. **Center H**: Determines whether to horizontally center the mesh on the spline or use the mesh's origin. **Offset**: Offsets the mesh from the spline (units are in mesh-space, unscaled by the spline). **Scale to Width**: Determines whether to scale the mesh to fit the spline width or to use the mesh as-is. **Scale**: Multiplier to the size of the mesh. If **Scale to Width** is enabled, the **Scale** specified here is relative to the spline width. Otherwise, it is relative to the mesh's natural size. **Forward Axis**: Chooses the forward axis of the **Spline Mesh**. **Up Axis**: Chooses the Up axis of the **Spline Mesh**. |
| **Collision Profile Name** | Name of the Collision Profile to use with this spline. |
| **Cast Shadow** | Enables the casting of shadows by the mesh. |
| **Random Seed** | Controls the application order of multiple spline meshes to the spline. |
| **Max Draw Distance** | Max Draw Distance for all the meshes used in the spline. |
| **Translucency Sort Priority** | Sets the sort priority of translucent objects. Ignore if your meshes are not translucent. The default priority is zero. |
| **Hidden in Game** | Hides the Static Meshes in game. |
| **Place Spline Meshes in Streaming Levels** | Determines whether spline meshes should be placed in Landscape proxy streaming levels or the spline's level. Default is True. |

- landscape
- splines

On this page

- Creating a Spline (-> landscape-splines-in-unreal-engine)
- Joining and Splitting Splines (-> landscape-splines-in-unreal-engine)
- Adding a Static Mesh Actor to a Spline (-> landscape-splines-in-unreal-engine)
- Editing a Spline (-> landscape-splines-in-unreal-engine)
- Applying Splines to the Landscape (-> landscape-splines-in-unreal-engine)
- Spline Selection (-> landscape-splines-in-unreal-engine)
- Spline Properties (-> landscape-splines-in-unreal-engine)
- Control Point Properties (-> landscape-splines-in-unreal-engine)
- Spline Segment Properties (-> landscape-splines-in-unreal-engine)
- Landscape Spline Segment (-> landscape-splines-in-unreal-engine)
- Landscape Spline Meshes (-> landscape-splines-in-unreal-engine)

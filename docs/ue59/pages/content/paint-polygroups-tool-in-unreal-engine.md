# Paint PolyGroups

https://dev.epicgames.com/documentation/en-us/unreal-engine/paint-polygroups-tool-in-unreal-engine?application_version=5.9

> Overview for interactively grouping triangles to create PolyGroups with the Paint PolyGroup modeling tool.

[image: Paint PolyGroups]

Learn to use this **Beta** feature, but use caution when shipping with it.

The **Paint PolyGroups** tool provides the means for interactively painting PolyGroups on a mesh. A PolyGroup is a set of grouped triangles. You can use PolyGroups for various operations, such as:

- Modeling and deformation
- Traditional box modeling
- UV layout
- Material organization
- Skin weights

To learn more, see Understanding PolyGroups (-> understanding-polygroups-in-unreal-engine).

## Accessing the Tool

You can access the Paint PolyGroups tool from the following:

- The **Attributes** category in **Modeling Mode**. To learn more about Modeling Mode and how to access it, see Modeling Mode Overview (-> modeling-mode-in-unreal-engine).
- The **Editing Tools** tab in the **Skeleton Editor**. To learn more, see Skeleton Editing (-> skeleton-editing-in-unreal-engine).

## Using Paint PolyGroup

The Paint PolyGroups tool carries over preexisting groupings when opening the tool. Choose the PolyGroup layer you want to edit from the **Active PolyGroup** property. To create new layers, use the Edit Attributes (-> edit-attributes-tool-in-unreal-engine) or Generate PolyGroup (-> generate-polygroups-tool-in-unreal-engine) tools.

Use the **Action** setting to choose any of the following selection modes for painting PolyGroups:

- **Brush:** Paints PolyGroups with a brush. **Click + Drag** across the mesh to paint.
- **Fill:** Fills the entire component with the current group. **Click** the mesh to add the fill.
- **Group Fill:** Fills only the hovered group(s) with the current set group ID.
- **Poly Lasso:** Draws an area on the mesh to paint the current group ID. **Click + Drag** to highlight an area of the mesh to add PolyGroups.

Use **Brush Area Mode** to choose which faces the brush paints. **Connected** paints only faces connected to the face under the cursor. **Volumetric** paints every face inside the brush sphere.

In the Filters section, use **Angle Threshold**, **UVSeams**, and **Normal Seams** to stop the painted region at edges or seams. These filters apply only when **Brush Area Mode** is set to Connected. To limit painting to front-facing or unoccluded triangles, use **Visibility Filter**.

If you open the tool with a mesh element selection, **Isolate Geometry Selection** hides everything except the selection and limits painting to it. This option is only available when the tool starts with a selection.

To create a different PolyGroup, add a value in the **Set Group** property. The value represents the group ID. You can erase groupings by adding the group ID to the **Erase Group** property and using the **Shift + Click + Drag** hotkey. To view the current group IDs, toggle the properties in the** Visualization** section or use the **Shift + G** hotkey.

If the active layer is a label layer, **Set Group** and **Erase Group** become **Set Label** and **Erase Label**. Enter a label name, such as `Arm_l`, instead of a group number.

By default, the tool shows the ID of the group under the cursor. To turn this off, clear **Show Hit Group** in the Visualization section. To show the IDs of all visible groups, turn on **Show All Groups**. To make the group under the cursor the Set Group, press **Shift + G**.

To help control group selection, use the quick action buttons in the **Freezing** and **Operations** sections.

To paint both sides of a symmetrical mesh at once, turn on **Enable Symmetry**. A second brush indicator shows where the mirrored stroke lands. If you paint labels with symmetry on, the mirrored side gets the matching label for the other side. For example, painting `Arm_l` on one side paints `Arm_r` on the other. To change the text that marks a label as left or right, set **Left String** and **Right String** (`_l` and `_r` by default).

Once you are done using the tool, accept or cancel the changes in the Tools Confirmation (-> modeling-mode-in-unreal-engine) panel.

### Hotkeys

| Hotkey | Description |
| --- | --- |
| **Shift + Click + Drag** | Erases painted PolyGroups. |
| **[ or S** | Decreases the brush size. Hold **Shift** for smaller steps. |
| **] or D** | Increases the brush size. Hold **Shift** for smaller steps. |
| **Shift + Q** | Creates a new group and applies it to **Set Group**. |
| **Shift + G** | Assigns the hovered group as the **Set Group**. |
| **Shift + F** | Freezes or unfreezes the hovered group. |
| **Enter** | Accepts tool changes. |
| **ESC** | Cancels the changes and exits the tool. |

- beta
- modeling mode
- modeling tools
- polygroups
- quads
- skeleton editing

On this page

- Accessing the Tool (-> paint-polygroups-tool-in-unreal-engine)
- Using Paint PolyGroup (-> paint-polygroups-tool-in-unreal-engine)
- Hotkeys (-> paint-polygroups-tool-in-unreal-engine)

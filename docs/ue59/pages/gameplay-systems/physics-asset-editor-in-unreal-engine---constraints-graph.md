# Physics Asset Editor - Constraints Graph

https://dev.epicgames.com/documentation/en-us/unreal-engine/physics-asset-editor-in-unreal-engine---constraints-graph?application_version=5.9

> User guide for the Constraints Graph inside the Physics Asset Editor.

[image: Physics Asset Editor - Constraints Graph]

 [image: The Constraints Graph shows the linkages for constraints between the selected bodies in the Physics Asset]

The **Constraints Graph** shows the linkages for constraints between the selected bodies in the Physics Asset. Within it, you can perform the following actions:

- Select and view bodies and constraints in the skeletal hierarchy.

- Create and edit bodies and constraints using the right-click context menus (-> physics-asset-editor-in-unreal-engine---skeleton-tree).

- Create constraint links using pin-dragging selection.

- Assign / Unassign profiles for Physical Animation and Constraints.

## Skeletal Hierarchy Selection Displayed in the Graph

When bodies or constraints are selected in the Skeleton Tree (-> physics-asset-editor-in-unreal-engine---skeleton-tree), the graph will display the currently selected ones and their connections.

 [image: The graph will display the currently selected ones and their connections]

The body "spine_03" is selected in the Skeleton Tree, and the Graph displays the constraints and the bodies they connect to.

### Bodies

When a Body (-> physics-bodies-in-unreal-engine) is selected, the Graph will display the following information:

- Bone Name

- Number of Primitive Shapes used

 [image: The Graph will display the following information]

In this example, the Bone Name is **hand_l** and there is a single primitive shape.

You can double-click any Body node on the far right to move through the hierarchy list to that body and its constraints.

#### Graph Pin-Dragging Connections

The node-based display in the graph enables you to drag from the output pin of the main Body (far left, **hand_l**) and use the selection menu to select a body to create a constraint. The same
workflow can be achieved through the right-click context menus in the Skeleton Tree (-> physics-asset-editor-in-unreal-engine---skeleton-tree) as well.

|  |  |
| --- | --- |
| [image: The node-based display in the graph enables you to drag from the output pin of the main Body and use the selection menu to select a body to create a constraint] | [image: The resulting Constraint] |
| Pull off the Body output pin and select a Body from the list. | The resulting Constraint. |

If the Graph does not update after creating or deleting a constraint, click away and then back to see the update.

### Constraints

When a Constraint (-> physics-constraint-reference-in-unreal-engine) is selected, the Graph will display the following information:

- Bone Names that are linked

 [image: The Graph will display the following information]

Here, the Bone named **lowerarm_l** is constrained to **hand_l**.

## Profile Assignment

In the Graph, you'll be able to see the Profiles (-> physics-asset-editor-in-unreal-engine---tools-and-profiles) that the selected bodies and constraints are assigned to.

There are two types of profiles that can be created and assigned: **Physical Animation** which bodies can be assigned to and Constraint ones which constraints can be assigned to. Profiles contain a set of default values for properties of bodies and constraints. When the **Current Profile** is set in the **Profiles** tab, the nodes in the Graph will indicate their assignment status of a profile for the displayed bodies and constraints.

There are two states that a node can be in indicated by its color:

- Is **assigned** to a profile.

- Is **not assigned** to a profile or none is selected

When the **Current Profile** is assigned to the selected body or constraint, or if none is selected, the node's fill color (green for bodies and beige for constraints) is used. When the selected body or constraint is not assigned to the Current Profile, the node will be shaded.

 [image: When the Current Profile is assigned to the selected body or constraint the node's fill color is used]

Here, the bodies for **lowerarm_l** and **middle_01_l** have been assigned the profile **MyPhysicalAnimation_Profile**, and the remaining body nodes have not been assigned this particular profile, as
indicated by their shaded color.

 [image: The bodies for lowerarml and middle01l have been assigned the profile MyPhysicalAnimationProfile]

For the constraints, since the Current Profile is set to **None**, the fill color remains unshaded until any selected constraints are assigned a selected profile.

For additional information about using Profiles and assigning them to bodies and constraints, see the Tools and Profiles (-> physics-asset-editor-in-unreal-engine---tools-and-profiles) page.

- animation
- physics

On this page

- Skeletal Hierarchy Selection Displayed in the Graph (-> physics-asset-editor-in-unreal-engine---constraints-graph)
- Bodies (-> physics-asset-editor-in-unreal-engine---constraints-graph)
- Graph Pin-Dragging Connections (-> physics-asset-editor-in-unreal-engine---constraints-graph)
- Constraints (-> physics-asset-editor-in-unreal-engine---constraints-graph)
- Profile Assignment (-> physics-asset-editor-in-unreal-engine---constraints-graph)

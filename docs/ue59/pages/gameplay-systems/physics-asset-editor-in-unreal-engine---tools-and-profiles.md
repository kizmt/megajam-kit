# Physics Asset Editor - Tools and Profiles

https://dev.epicgames.com/documentation/en-us/unreal-engine/physics-asset-editor-in-unreal-engine---tools-and-profiles?application_version=5.9

> User guide for the Tools and Profiles properties inside the Physics Asset Editor.

[image: Physics Asset Editor - Tools and Profiles]

The **Tools** and **Profiles** tabs enable you to choose how Bodies (-> physics-bodies-in-unreal-engine) are generated and allow for custom profiles for default properties of assigned
bodies and constraints.

 [image: The Tools and Profiles tabs enable you to choose how Bodies are generated and allow for custom profiles for default properties of assigned bodies and constraints]

## Tools Tab

The **Tools** tab enables you to perform batch edits of your Physics Asset. It includes being able to add, generate or re-generate bodies for the entire skeleton or selected bodies
in the Skeleton Tree (-> physics-asset-editor-in-unreal-engine---skeleton-tree).

 [image: The Tools tab enables you to perform batch edits of your Physics Asset]

### Body Creation Settings

The following options are available when creating or editing primitive shapes, sizes, and more for bodies:

 [image: The following options are available when creating or editing body]

| Property | Description |
| --- | --- |
| **Min Bone Size** | Bones that are shorter than this value will be ignored for body creation. |
| **Primitive Type** | The geometry type that should be used when creating bodies. Box Capsule Sphere Tapered Capsule (Cloth Only) Single Convex Hull Multi Convex Hull |
| **Vertex Weighting Type** | How vertices are mapped to bones when approximating them with bodies. Any Weight Dominant Weight |
| **Auto Orient to Bone** | Whether to automatically orient the created bodies to their corresponding bones. |
| **Walk Past Small Bones** | Whether to skip small bones entirely (rather than merge them with the adjacent bones). |
| **Create Body for All Bones** | Forces the creation of a body for each bone. |
| **Disable Collisions by Default** | Whether to disable collision of body with other bodies on creation. |
| Advanced Properties |  |
| **Min Weld Size** | Bones that are smaller than this value will be merged for body creation. |
| **Hull Accuracy** | When creating convex hulls, the target accuracy of the created hull. |
| **Max Hull Verts** | When creating convex hulls, the maximum verts that should be created. |

### Constraint Creation Settings

The following options are available when creating or editing the constraints of bodies:

 [image: The following options are available when creating or editing constraint]

| Property | Description |
| --- | --- |
| **Create Joints** | Whether to create constraints between adjacent created bodies. |
| **Angular Constraint Mode** | The type of angular constraints to create between bodies. **Free**: No constraint against this axis. **Limited**: Limited freedom along this axis. **Locked**: Fully constraint against this axis. |

#### Body Generation Options

Once the properties have been set for the **Body Creation** and **Constraint Creation** categories, any selected bodies, constraints, or bones will display an action to add, generate, or re-generate
bodies.

 [image: Body Generation Option]

| Button |  |
| --- | --- |
| ![All physics bodies and constraints will be re-created] (all-bodies.png) | All physics bodies and constraints will be re-created. |
| [image: This button will enable all bodies and constraints to be recreated using the new settings] | When a constraint is selected, this button will enable all bodies and constraints to be recreated using the new settings. |
| [image: Selected bodies will be replaced along with their constraints using the new settings] | Selected bodies will be replaced along with their constraints using the new settings. |

## Profiles Tab

The Physics Asset **Profiles** tab enables you to view, select, and edit a collection of settings for **Physical Animations** and **Constraints** that can be saved to profiles which can then be assigned
to the selected bodies or constraints in the Skeleton Tree (-> physics-asset-editor-in-unreal-engine---skeleton-tree).

 [image: Profiles Tab]

For additional information, see the Using Profiles for Bodies and Constraints (-> using-profiles-for-bodies-and-constraints-in-unreal-engine) page.

### Current Profile

The **Current Profile** drop-down is where you'll find any new or existing profiles that have been created. When the profile is selected, options to remove it from the list of profiles, and assign or
unassign it from the selected bodies or constraints will become available.

 [image: The Current Profile drop-down is where you'll find any new or existing profiles that have been created]

| Option | Description |
| --- | --- |
| **New** | Creates a new profile that has properties set and can be assigned to bodies or constraints. |
| **Delete** | Removes the custom profile when it is set as the **Current Profile** selection. |
| **Assign** | Assigns the selected bodies or constraints to the **Current Profile** selection. |
| **Unassign** | Unassigns the selected bodies or constraints from the **Current Profile** selection. |

Some options are available for the Current Profile by clicking the **arrow** drop-down.

 [image: Some options are available for the Current Profile by clicking the arrow drop-down]

| Option | Description |
| --- | --- |
| **Duplicate** | Copies the currently set profile. |
| **Set Current Constraint Profile** | Select from the currently created profiles the one to be used as the Current Profile to assign, unassign, or delete. |

#### Current Profile Assignment

When bodies or constraints are assigned a profile, there are a couple of places where you can check the status of the assignment:

- From the Details panel

- From the Graph (-> physics-asset-editor-in-unreal-engine---constraints-graph)

In the **Details** panel, the **Current Profile** being used for the selected body will be listed. When there isn't a profile assigned, it will be listed as **None**.

 [image: Current Profile Assignment]

|  |  |
| --- | --- |
| [image: Unassigned Profile] | [image: Assigned Profile] |
| Unassigned Profile | Assigned Profile |

In the Graph (-> physics-asset-editor-in-unreal-engine---constraints-graph), the selected bodies and their constraints will be displayed. The shading of the bodies and constraints will be based on which
 the profile is selected as the **Current Profile**.

 [image: The shading of the bodies and constraints will be based on which profile is selected as the Current Profile]

For example, the Graph is showing the selected body and constraints, while the Profiles tab is showing the Current Profile for Physical Animation set to **MyPhysicalAnimation_Profile** which
is assigned to two of the four bodies in the Graph. When the Current Profile selected is assigned to a node, it will have an unshaded fill color, and when the node is not assigned that profile,
it will appear shaded. The constraints displayed all appear with their fill color since the Current Profile for Constraints is set to **None**.

For additional information about the nodes in the Graph, see the Constraints Graph (-> physics-asset-editor-in-unreal-engine---constraints-graph) page.

#### Physical Animation Profiles

When Bodies are selected and assigned a Physical Animation profile, the following options will become available:

 [image: Physical Animation Profiles]

| Property | Description |
| --- | --- |
| **Is Local Simulation** | Whether the drive targets are in the world or local space. |
| **Orientation Strength** | The strength used to correct orientation error. |
| **Angular Velocity Strength** | The strength used to correct angular velocity error. |
| **Position Strength** | The strength used to correct linear position error. Only used for non-local simulation. |
| **Velocity Strength** | The strength used to correct linear velocity. Only used for non-local simulation. |
| **Max Linear Force** | The max force used to correct linear errors. |
| **Max Angular Force** | The max force used to correct angular errors. |

#### Constraint Profiles

When Constraints are selected and assigned a Constraints Profile, the following options will become available:

Click the image to view the full size.

For additional information, visit the Constraints Reference (-> physics-constraint-reference-in-unreal-engine) page.

### Thumbnail

Control how the thumbnail image for the Physics Asset should appear in the **Content Drawer**. You can control the Pitch, Yaw, and Zoom of the thumbnail.

 [image: Control how the thumbnail image for the Physics Asset should appear in the Content Drawer]

When the Thumbnail pitch, yaw, and zoom values are adjusted the thumbnail in the **Content Drawer** will update in real-time.

 [image: When the Thumbnail pitch yaw and zoom values are adjusted the thumbnail in the Content Drawer will update in real time]

### Physics

The following options are available that will apply to all assigned profiles.

 [image: The following options are available that will apply to all assigned profiles]

| Property | Description |
| --- | --- |
| **Not for Dedicated Server** | If true, skips instancing bodies for the PhysicsAsset on dedicated servers. |

- assets
- physics

On this page

- Tools Tab (-> physics-asset-editor-in-unreal-engine---tools-and-profiles)
- Body Creation Settings (-> physics-asset-editor-in-unreal-engine---tools-and-profiles)
- Constraint Creation Settings (-> physics-asset-editor-in-unreal-engine---tools-and-profiles)
- Body Generation Options (-> physics-asset-editor-in-unreal-engine---tools-and-profiles)
- Profiles Tab (-> physics-asset-editor-in-unreal-engine---tools-and-profiles)
- Current Profile (-> physics-asset-editor-in-unreal-engine---tools-and-profiles)
- Current Profile Assignment (-> physics-asset-editor-in-unreal-engine---tools-and-profiles)
- Physical Animation Profiles (-> physics-asset-editor-in-unreal-engine---tools-and-profiles)
- Constraint Profiles (-> physics-asset-editor-in-unreal-engine---tools-and-profiles)
- Thumbnail (-> physics-asset-editor-in-unreal-engine---tools-and-profiles)
- Physics (-> physics-asset-editor-in-unreal-engine---tools-and-profiles)

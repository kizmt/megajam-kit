# Observe Bone

https://dev.epicgames.com/documentation/en-us/unreal-engine/animation-blueprint-observe-bone-in-unreal-engine?application_version=5.9

> Describes how you can debug a specified Bone with the Observe Bone node.

[image: Observe Bone]

With the **Observe Bone** Animation Blueprint (-> animation-blueprints-in-unreal-engine) node, you can watch a selected bone's translation rotation and scale motion for debug purposes.

 [image: observe bone animation blueprint node]

Here a character's `upperarm_l` is being observed during an animation.

 [image: observe bone animation blueprint node demonstration]

The node will display debug data in the **AnimGraph** with the coordinates of the **Bone to Observe**'s motion. Each line of the debug data displays an element of motion data on each axis.

For example:

- **TX** represents Translation on the X axis.

- **RY** represents Rotation on the Y axis.

- **SZ** represents Scale on the Z axis.

## Property Reference

Here you can reference the Observe Bone properties accessible in the node's **Details** panel.

| Property | Description |
| --- | --- |
| **Bone to Observe** | Here you can define a bone from the character's skeleton (-> skeletons-in-unreal-engine) to track position and motion data. |
| **Display Space** | Here you can select what space the **Bone to Observe** motion is calculated. **World Space**: observes the absolute position of the **Bone to Observe*** in world space. **Component Space**: observes the position of the **Bone to Observe** within the Skeletal Mesh (-> skeletal-mesh-assets-in-unreal-engine)'s reference frame. **Parent Bone Space**: observes the position of the **Bone to Observe** relative to the parent bone. **Bone Space**: observes the position of the **Bone to Observe** within its own reference frame. |
| **Relative to Ref Pose** | When enabled this property will track the position and motion data of the **Bone to Observe** relevant to the Skeletal Mesh (-> skeletal-mesh-assets-in-unreal-engine)'s reference pose, based on the space defined in the **Display Space** property. |

- animation
- skeletal control

On this page

- Property Reference (-> animation-blueprint-observe-bone-in-unreal-engine)

# Transform Bone

https://dev.epicgames.com/documentation/en-us/unreal-engine/animation-blueprint-transform-bone-in-unreal-engine?application_version=5.9

> Describes the Transform (Modify) Bone skeletal control node which can be used to modify the transform of a specified bone.

[image: Transform Bone]

You can use the **Transform (Modify) Bone** Animation Blueprint (-> animation-blueprints-in-unreal-engine) node to transform (**Translation**, **Rotation**, and **Scale**) a specified bone.

 [image: transform bone animation blueprint node]

After selecting a bone to control with the **Bone to Modify** property, you can select the kind of transform mode within the **Translation**, **Rotation**, and **Scale** property sections. Here the character's `upperarm_l` has been selected and additive transforms are being made using the controller in the viewport.

 [image: transform modify bone animation blueprint node demo]

The Transform Bone node operates within **Component Space**, so a space conversion (-> animation-blueprint-component-space-conversion-in-unreal-engine) will need to occur to implement the node within your character's Animation Blueprint.

## Property Reference

 [image: transform bone animation blueprint node details panel]

Here you can reference a list of the Transform Bone node's properties.

| Property | Description |
| --- | --- |
| **Bone To Modify** | Select a bone from the character's skeleton (-> skeletons-in-unreal-engine) to control with the Transform Bone node. |
| **Translation** | Control the **translation** of the selected bone. By default the translation coordinates are controllable in the AnimGraph. With the **Translation Mode** property you can set the node to **Ignore** the modifications made by the node, retaining any existing translation on the bone, **Replace Existing** to replace any translation on the bone with the translation the node is performing, and **Add to Existing** which will add the Transform Bone's translation to any existing Translation on the bone. You can also set the **Translation Space** of the node to control the space the translation is applied. You can set the following options: **World Space**: Applies the translation based on the absolute position in world space. **Component Space**: Applies the translation based on the bones position in relation to the Skeletal Mesh (-> skeletal-mesh-assets-in-unreal-engine)'s reference frame. **Parent Bone Space**: Applies the translation based on the bones position in relation to its parent bone. **Bone Space**: Applies the translation based on the bone's own reference frame. |
| **Rotation** | Control the **rotation** of the selected bone. By default the rotation coordinates are controllable in the AnimGraph. With the **Rotation Mode** property you can set the node to **Ignore** the modifications made by the node, retaining any existing rotation on the bone, **Replace Existing** to replace any rotation on the bone with the rotation the node is performing, and **Add to Existing** which will add the Transform Bone's rotation to any existing rotation on the bone. You can also set the **Rotation Space** of the node to control the space the rotation is applied. You can set the following options: **World Space**: Applies the rotation based on the absolute position in world space. **Component Space**: Applies the rotation based on the bones position in relation to the Skeletal Mesh (-> skeletal-mesh-assets-in-unreal-engine)'s reference frame. **Parent Bone Space**: Applies the rotation based on the bones position in relation to its parent bone. **Bone Space**: Applies the rotation based on the bone's own reference frame. |
| **Scale** | Control the scale of the selected bone. By default the scale coordinates are controllable in the AnimGraph. With the **Scale Mode** property you can set the node to **Ignore** the modifications made by the node, retaining any existing scale on the bone, **Replace Existing** to replace any scale on the bone with the scale the node is performing, and **Add to Existing** which will add the Transform Bone's scale to any existing scale on the bone. You can also set the **Scale Space** of the node to control the space the scale is applied. You can set the following options: **World Space**: Applies the scale based on the absolute position in world space. **Component Space**: Applies the scale based on the bones position in relation to the Skeletal Mesh (-> skeletal-mesh-assets-in-unreal-engine)'s reference frame. **Parent Bone Space**: Applies the scale based on the bones position in relation to its parent bone. **Bone Space**: Applies the scale based on the bone's own reference frame. |

- animation
- animation blending
- skeletal control

On this page

- Property Reference (-> animation-blueprint-transform-bone-in-unreal-engine)

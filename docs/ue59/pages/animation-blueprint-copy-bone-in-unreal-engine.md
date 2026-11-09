# Copy Bone

https://dev.epicgames.com/documentation/en-us/unreal-engine/animation-blueprint-copy-bone-in-unreal-engine?application_version=5.9

> Describes the Copy Bone node which copies the Transform data or any component of it from one bone to another.

[image: Copy Bone]

With the **Copy Bone** Animation Blueprint (-> animation-blueprints-in-unreal-engine) node, you can copy transform data such as **Translation**, **Rotation**, and **Scale**, from a **Source Bone** to a **Target Bone**.

 [image: copy bone animation blueprint node]

Using a simple implementation, you can use the Copy Bone node to copy the position and motion of the **Source Bone** to the **Target Bone**. Here the character's right-hand auxiliary weapon bone (`weapon_r`), is selected as the **Target Bone**, copying the **Source Bone**'s, the character's left hand (`hand_l`), position and motion. Here the effect of the Copy Bone node can be seen as it moves the weapon bone at runtime from the character's right hand to their left hand.

|  |  |
| --- | --- |
| [image: copy bone demo disabled] | [image: copy bone demo enabled] |
| Copy Bone Disabled | Copy Bone Enabled |

You can use this implementation of the Copy Bone node to pass an object from one of the Skeletal Mesh (-> skeletal-mesh-assets-in-unreal-engine)'s hands to the other during animation playback.

In the **AnimGraph**, you can toggle the different components of motion, including **Translation**, **Rotation**, and **Scale**, to apply the **Source Bone** motion to the **Target Bone**.

With the **Alpha** value or pin, you can control the degree of the blend on the generated output pose. A value of **1** will fully use the generated output pose, while a value of **0** will output the source pose.

## Property Reference

 [image: copy bone animation blueprint node details panel]

Here you can reference the Copy Bone node's properties.

| Property | Description |
| --- | --- |
| **Source Bone** | Select a bone from the character's skeleton (-> skeletons-in-unreal-engine) as the source of the motion data applied to the **Target Bone**. |
| **Target Bone** | Select a bone from the character's skeleton (-> skeletons-in-unreal-engine) as the destination for the motion data. |
| **Copy Translation** | Applies the **Translation** motion from the **Source Bone** to the **Target Bone**. By default this property appears as a Boolean on the node in the **AnimGraph**. |
| **Copy Rotation** | Applies the **Rotation** motion from the **Source Bone** to the **Target Bone**. By default this property appears as a Boolean on the node in the **AnimGraph**. |
| **Copy Scale** | Applies the **Scale** motion from the **Source Bone** to the **Target Bone**. By default this property appears as a Boolean on the node in the **AnimGraph**. |
| **Control Space** | Select in which space the **Source Bone** motion is calculated and applied to the **Target Bone**. **World Space**: copies the absolute position of the **Source Bone** in world space. **Component Space**: copies the position and motion data of the **Source Bone** within the Skeletal Mesh (-> skeletal-mesh-assets-in-unreal-engine)'s reference frame. **Parent Bone Space**: copies the position and motion data of the **Source Bone** relative to the parent bone. **Bone Space**: copies the position and motion data of the **Source Bone** within its own reference frame. |

- animation
- landing page
- skeletal controls
- skeletal control

On this page

- Property Reference (-> animation-blueprint-copy-bone-in-unreal-engine)

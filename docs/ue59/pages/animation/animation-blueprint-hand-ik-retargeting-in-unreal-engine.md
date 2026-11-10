# Hand IK Retargeting

https://dev.epicgames.com/documentation/en-us/unreal-engine/animation-blueprint-hand-ik-retargeting-in-unreal-engine?application_version=5.9

> Describes the Hand IK Retargeting control which can be used to handle retargeting of IK bones.

[image: Hand IK Retargeting]

With the **Hand IK Retargeting** Animation Blueprint (-> animation-blueprints-in-unreal-engine) node, you can retarget IK bone chains, to correct fk hand locations when using animations with characters of different proportions.

Here, the same animation is playing across both Masculine and Feminine characters, as the Feminine character twists, their right arm is overextending in order to keep their hands connected to the weapon.

|  |  |
| --- | --- |
|  |  |
| Masculine Character with Hand IK Retargeting Node Disabled | Feminine Character with Hand IK Retargeting Node Disabled |

You can use the Hand IK Retargeting node's **Hand FKWeight** property to shift the prioritization weight of the set FK bone, to correct any over-extension.

|  |
| --- |
|  |
| Feminine Character with Hand IK Retargeting Node Enabled |

In the example, the characters arms are being attached to the weapon, using a combination of the Two Bone IK (-> animation-blueprint-two-bone-ik-in-unreal-engine) nodes. The Hand IK Retargeting node is then being used to correct for the over extension of the character's left arm. The Hand FKWeight is set to a value of 0 to achieve this result.

## Property Reference

Here you can reference a list of the Hand IK Retargeting node's properties.

| Property | Description |
| --- | --- |
| **Right Hand FK** | Select the characters right hand bone from the characters skeleton to set as the **Right Hand FK**. |
| **Left Hand FK** | Select the characters left hand bone from the characters skeleton to set as the **Left Hand FK**. |
| **Right Hand IK** | Select the right hand IK bone from the characters skeleton to set as the **Right Hand IK**. |
| **Left Hand IK** | Select the left hand IK bone from the characters skeleton to set as the **Left Hand IK**. |
| **IKBones to Move** | Here you can select other bones to be moved. You can add bones with **Add (+)** and select a bone from the character's skeleton in the drop down. Additional bones to move could be weapon bones, or other bones used for object interactions. |
| **Hand FKWeight** | Here you can set the weight to favor the right or the left hand to correct for joint popping and stretching. For example, 0 would favor the left hand, 1 would favor the right hand and 0.5 would be equal weight. By default this property appears as a pin on the Hand IK Retargeting node in the **AnimGraph**. |

- animation
- skeletal control

On this page

- Property Reference (-> animation-blueprint-hand-ik-retargeting-in-unreal-engine)

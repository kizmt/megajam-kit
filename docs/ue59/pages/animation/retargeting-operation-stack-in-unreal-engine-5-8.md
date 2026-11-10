# Retargeting Operation Stack

https://dev.epicgames.com/documentation/en-us/unreal-engine/retargeting-operation-stack-in-unreal-engine-5-8?application_version=5.9

> Use operations in the Retarget Stack to get faithfully retargeted poses and animations.

[image: Retargeting Operation Stack]

The **IK Retargeter** is a platform you can use to quickly retarget 3D animations from a source character to a target character with a different skeleton structure and proportions while maintaining high visual quality.

The IK Retargeter uses an operation stack to determine how poses and motion data are transferred between a source and target skeletal mesh. The **Retarget Stack** is a modular framework that provides a way to add custom operations for the retargeter. You can reorder and move around all operations in the Retarget Stack.

Each operation has its own editor interface depending on what you are editing. Operations also have the ability to create substacks for logic and evaluations that need to be applied in a certain order or method to expand the existing operation. Depending on the target character, you might need to use different setups on the Retarget Stack to have a better transference of animation.

#### Prerequisites

- You have an understanding of IK Rigs (-> unreal-engine-ik-rig), IK Rig Editor (-> ik-rig-in-unreal-engine), and IK Rig Retargeting (-> ik-rig-animation-retargeting-in-unreal-engine).

## Operations List

Below is a list of the operations you can use for IK Rig retargeting. You can reorder operations in the ops stack, or delete them from the list if unnecessary.

### Pelvis Motion

**Pelvis Motion** accurately transfers the hip’s position, rotation, and translation from a source character to maintain proper posture and root motion. Pelvis Motion acts as the retarget pelvis in IK rigs, ensuring that translation data is scaled properly between characters of different proportions. This is critical for realistic movement and preventing animation sliding.

The Pelvis Motion tools map the pelvis of the source asset’s pelvis to the pelvis of the target asset. All settings of the Pelvis Motion operation are concerned with the motion and rotation of the pelvic bones. This operation was formerly known as Root Phase.

This is a default operation. When you click **Add Default Ops**, Pelvis Motion appears in the Op Stack list. The debug operations of Pelvis Motion show debug drawing. It uses the LOD threshold to enable and disable the maximum LOD the operation can run at.

#### Pelvis Motion Setup

By default, the Pelvis Motion operation takes the assigned retarget pelvis from the source and target character IK rig if they are defined there. An IK rig is not necessary for Pelvis Motion operations, you can determine a custom pelvis bone for both the source and target characters.

|  |  |
| --- | --- |
| **Name** | **Description** |
| **Source Pelvis Bone** | The pelvis bone on the source skeleton to copy motion from.Select the bones you want to target from the dropdown menu. |
| **Target Pelvis Bone** | The pelvis bone on the target skeleton to copy motion from.Select the bones you want to target from the dropdown menu. Ideally these mirror the bones selected under the Source Pelvis Bone option. |

#### Pelvis Motion - Floor Constraint

**Floor Constraint** constrains IK goals to the floor. Each goal can be constrained to the floor. The floor is static, or world 0.

|  |  |
| --- | --- |
| **Name** | **Description** |
| **Floor Constraint Weight** | When set, the floor constraint adjusts the vertical pelvis motion separately according to the following rule:When the source pelvis is lower than the reference pose, the target pelvis is lowered proportional to their relative crotch height.When the source pelvis is higher than the reference pose, the target pelvis is raised proportional to their relative crotch height.The range for Floor Constraint Weight is **0-1**. The default value is set to 0. Set the value to** 1 **to turn the option **On**. |
| **Source Crotch Offset** | A negative vertical offset in centimeters relative to the pelvis bone of the source.Adjust this option until the green dot is located roughly at the crotch of the character. |
| **Target Crotch Offset** | A negative vertical offset in centimeters relative to the pelvis bone of the target.Adjust this option until the green dot is located roughly at the crotch of the character. |
| **Use Ground Falloff** | Toggle the option on and off. |
| **Ground Falloff Height Percent** | Controls the height at which the floor constraint will begin blending in as a percentage of the pelvis height in the retarget pose.Use this to prevent the floor constraint from dampening vertical pelvis motion at normal heights.At 1, the constraint is active at normal standing height. At 0, the constraint only activates when within 10% of the height off the floor. |

#### Pelvis Rotation

Transfers the core motion, weight, and posture of the source character to the target.

|  |  |
| --- | --- |
| **Name** | **Description** |
| **Rotation Alpha** | Blends the animation on the retarget pelvis between the retarget pose (0) and the incoming retarget source (1). |
| **Rotation Offset Local** | Applies a static local-space rotation offset to the pelvis using X, Y, and Z coordinates. |
| **Rotation Offset Global** | Applies a static global-space rotation offset to the pelvis using X, Y, and Z coordinates. |

#### Pelvis Translation

Defines how the source character’s hip movement is transferred from the skeleton to the target skeleton, ensuring the proper height, scale, and positioning on the target.

|  |  |
| --- | --- |
| **Name** | **Description** |
| **Translation Alpha** | Blends the animation on the retarget pelvis between the retarget pose (0) and the incoming retarget source (1). |
| **Translation Offset Local** | Applies a static local-space translation offset to the pelvis using X, Y, Z coordinates. |
| **Translation Offset Global** | Applies a static global-space translation offset to the pelvis using X, Y, Z coordinates. |
| **Blend to Source Translation** | Blends the retarget pelvis’ translation between its retargeted location (0) and the exact source location (1). This property is similar to "reach" as seen in other retargeting tools. |
| **Blend to Source Translation Weights** | Per-axis for the blending control multipliers for BlendtoSource using X, Y, Z coordinates. |

#### Scale Pelvis Translation

Adjusts the amount of vertical or horizontal movement of the target character’s hips relative to the animation source. The scale is used to correct for height and proportion differences between characters, preventing issues like floating feet, overly long legs, or distorted torsos.

|  |  |
| --- | --- |
| **Name** | **Description** |
| **Scale Horizontal** | Scales the motion of the retarget pelvis in the horizontal direction. You can use this in conjunction with IK goals and translation offset to create embellished or diminished movements on your retargeted characters. |
| **Scale Vertical** | Scales the motion of the retarget pelvis in the vertical direction. You can use this in conjunction with IK goals and translation offset to create embellished or diminished movements on your retargeted characters. |

#### Affect IK Settings

Determines whether a specific joint chain uses Inverse Kinematics to match the source animation’s hand and foot positions.

|  |  |
| --- | --- |
| **Name** | **Description** |
| **Affect IK Horizontal** | If you are using IK goals, these sliders control whether all IK goals should move along with the pelvis if the pelvis is modified along the horizontal axes. At **0** the IK goals remain at their retargeted position, and at **1** they move relative to the modified pelvis transform. |
| **Affect IK Vertical** | If you are using IK goals, these sliders control whether all IK goals should move along with the pelvis if the pelvis is modified along the vertical axes. At **0** the IK goals remain at their retargeted position, and at **1** they move relative to the modified pelvis transform. |

#### Pelvis Motion Debug

|  |  |
| --- | --- |
| **Name** | **Description** |
| **Debug Draw Size** | Adjusts the size of the debug draw in the target pelvis. |
| **Debug Draw Thickness** | Adjusts the thickness of the debug drawing in the pelvis. |

#### Pelvis Motion Enable Op

|  |  |
| --- | --- |
| **Name** | **Description** |
| **Enabled** | Toggles the operation on and off. When an op is toggled off, it is skipped entirely and doesn't run at all. |

### FK Chains

**FK Chains** provides a way to target specific bones and bone chains on the target IK Rig asset to copy the rotation, orientation, and translation of the source skeleton to the target skeleton. These operations run before the IK pass to establish the base pose for each joint. Base operations use interpolation for better matching.

This is a default operation. When you click Add Default Ops, FK Chains appears in the Op Stack list. FK Chains uses the LOD threshold to enable and disable the maximum LOD the operation can run at. The debug operations show debug drawing.

#### Retarget Chains Settings

The tools within this setting do the following:

[image: The Retarget Chain Settings provide a way to target specific bone chains and individual bones.] Retarget Chain Settings

- **IK Rig Asset**: This property is set from the Default Target IK Rig property from Asset settings. Below, the asset’s bone chains are listed in a scrollable menu.You can use a separate target for this setting.
- **Chain Mapping Options**: Filters bones using different filtering options:**Hide Mapped Chains**: Hides chains mapped to a source chain.
- **Hide Unmapped Chains**: Hides chains not mapped to a source chain.
- **Hide Chains Without IK**: Hides chains not using IK.
- **Clear Filters**: Clears filter options.

- **Auto-Maps Chains**: Automatically assigns source based on matching rule.**Map All (Fuzzy)**: Maps all chains to the source chain with the closest name.
- **Map Only Empty (Fuzzy)**: Map all unmapped chains to the source chain with the closest name.
- **Map All (Exact)**: Maps all chains with identical names. Does not change mapping if an exact match is not found.
- **Map Only Empty (Exact)**: Maps unmapped chains using identical names. Does not change mapping if an exact match is not found.
- **Clear Filters**: Clears filter options.

#### FK Chain Retarget

|  |  |
| --- | --- |
| **Name** | **Description** |
| **Enable FK** | Enables copying the shape of the chain from the source character using rotation and translation. |
| **Rotation Mode** | Determines how rotation is copied from the source chain to the target chain. You can select from the following:**Interpolated**: The source and target chains are normalized by their length, then each target bone rotation is generated by finding the rotation at the same normalized distance on the source chain and then applying that normalized rotation to the target. This typically provides the best result for targets with a different amount of bones in the chain, or different proportions.**One to One**: Each bone in the source chain is copied to the equivalent bone in the target chain, based on the bone order starting from the root chain bone. If the target chain has more bones than the source, the extra bones remain at their reference pose. This option is best chosen when the amount of bones in a chain match between the target and source, and typically is the best choice for finger chains.**One to One Reversed**: This operates similarly to One to One, but the copying order is started from the end bone in the chain instead of the root.**None**: No rotation copying occurs, causing bone rotations to remain at their reference pose. |
| **Rotation Alpha** | Blends the amount of FK rotation copying. |
| **Translation Mode** | Determines how translation is copied from the source chain to all bones in the target chain. You can select from the following:**None**: No translation copying occurs, causing bone translations to remain at their reference pose. In most cases this is the best option to choose.**Globally Scaled**: The target bone translations are set to the source bone, multiplied by the relative global scale of the target skeleton.**Absolute**: The target bone translations are set to the absolute positions of the source bones.**Stretch Bone Length Uniformly**: The target bone translations stretch uniformly to the absolute position of the source bones.**Stretch Bone Length Non-Uniformly**: The target bone translations stretch non-uniformly to the absolute position of the source bones.**Orient and Scale**: Transfers local translation or scale animations from the source to the target bone. This works no matter the size of bones or length of bones in the chain. This provides for stretching animations to retarget faithfully to the bone’s translations. |
| **Translation Alpha** | Blends the amount of FK translation copying. |

#### FK Chains Debug

|  |  |
| --- | --- |
| **Name** | **Description** |
| **Draw Chain Lines** | Debug lines on each chain in the viewport. |
| **Draw Single Bone Chain** | Debug spheres on single-bone chains in the viewport. |
| **Chain Draw Thickness** | Debug draw chain line thickness in the target chain drawing. |
| **Chain Draw Size** | Debug draw used for single-bone chains in the target chain drawing. |

### Root Motion

**Root Motion** uses specialized settings to either generate or transfer root motion from the source to the target. Generate root motion data by copying it from the source directly, or creating it from scratch based on the Pelvis motion.

These settings are generally used on the retargeted animation or pose. This is considered one of the default operations. When you click **Add Default Ops**, Root Motion appears in the Op Stack list.

#### Bones

Determines the skeleton and chains that drive skeletal movement.

|  |  |
| --- | --- |
| **Name** | **Description** |
| **Source Root** | The root of the source skeleton. |
| **Target Root** | The root of the target skeleton. |

#### Main Source

Defines which specific bone chain or movement component from the source character acts as the driving force for the root motion of the character.

|  |  |
| --- | --- |
| **Name** | **Description** |
| **Root Motion Source** | Determines where to copy the root motion from.**Copy From Source Root**: Copies the motion from the source root bone, but scales it according to relative height difference.**Generate From Target Pelvis**: Uses the retargeted pelvis motion to generate root motion.Root Motion is generated from the pelvis. |
| **Target Pelvis** | The pelvis of the target skeleton. This setting is only used when the RootMotionSource is set to the target pelvis. |
| **Rotate with Pelvis** | When enabled, this setting applies an offset rotation with the pelvis when generating root motion from the pelvis.This may cause unwanted rotations, for example, if Pelvis Yaw is animated. |

#### Height Source

Determines which bone’s vertical movement is used to drive the pelvis motion.

|  |  |
| --- | --- |
| **Name** | **Description** |
| **Root Height Source** | Determines how to set the height of the root bone.**Copy Height From Source**: Copies the height of the root bone on the source skeleton’s root bone.**Snap To Ground**: Sets the root bone height to the ground plane (Z = 0). |

#### Root Motion Offset

Adjusts the spatial difference between the source and target skeletons’ pelvis bones.

|  |  |
| --- | --- |
| **Name** | **Description** |
| **Global Offset** | A manual offset applied to global space to the root bone based on:**Location****Rotation****Scale** |
| **Maintain Offset from Pelvis** | Applies only when generating root motion from the pelvis.Maintains the offset between the root and pelvis as recorded in the target retarget pose.If set to false, the root bone is placed directly under the Pelvis bone. |

#### Update Children

Ensures the pelvis movement or rotation during retargeted animation moves proportionally in the child bones.

|  |  |
| --- | --- |
| **Name** | **Description** |
| **Prepare to Non Retargeted Children** | When enabled, transforms all children of the target that aren’t part of a retarget chain. |

### Remap Curves

**Remap Curves** is used to map input values from the source to new output values for the target based on a custom curve. By adjusting the curve’s shape, you control how an input range translates to a new output range to create non-linear and tailored transformations of values.

This is considered one of the default operations. When you click **Add Default Ops**, Remap Curves appear in the Op Stack list.

#### Copy Curves

Converts the movement from one skeleton to another.

|  |  |
| --- | --- |
| **Name** | **Description** |
| **Copy All Source Curves** | Determines whether to copy all curves over to the target animation instance.**When enabled**: All source curves are copied to the target animation instance/asset.**When disabled**: Only remapped curves are copied on the target animation instance/asset.This setting also applies when exporting retargeted animations. |

#### Remap Curves

Maps named curves from the source character to the target character.

|  |  |
| --- | --- |
| **Name** | **Description** |
| **Remap Curves** | Toggles curve mapping on and off. |
| **Curves to Remap** | Adds pairs of source and target curve names to an array to remap.While retargeting, the animation from the source curves are redirected to the curves on the target skeletal meshes. This can be used to drive blendshapes or other downstream systems.By default, the IK Retargeter automatically copies all equivalently named curves from the source to the target. Remapping is only necessary when the Target curve name(s) are different. |

#### Remap Curves Enable Op

|  |  |
| --- | --- |
| **Name** | **Description** |
| **Enabled** | Toggles the operation on and off. When an op is toggled off, it is skipped entirely and doesn't run at all. |

### Retarget Pose

**Retarget Pose** provides a way for you to override the default retarget pose of the source or target skeletal mesh before the rest of the ops in the op stack evaluates. Retarget Pose overrides the source or target’s retarget pose.

Retargeted assets can only use one copy of an op at a time in the op stack.

Retarget Pose must be the first op in the stack for the retargeting op to work as expected.

#### Source Pose

|  |  |
| --- | --- |
| Name | Description |
| Override Source Pose | Toggles Override Source Pose on and off. When set to true, overrides the default retarget pose for the source skeleton. |
| Source Pose to Use | A retarget pose that’s applied to the source skeleton. The pose name must match the name of a retarget pose stored in this asset.Add the name of the source pose to be overridden. |

#### Target Pose

|  |  |
| --- | --- |
| Name | Description |
| Override Target Pose | Toggles Override Target Pose on and off. When set to true, the tool overrides the default retarget pose for the target skeleton. |
| Target Pose to Use | A retarget pose applied to the target skeleton. The name of the pose must match the name of the retarget pose stored in the asset.Add the name of the target pose to be overridden. |

#### Retarget Pose Enable Op

|  |  |
| --- | --- |
| Name | Description |
| Enable Op | Toggles the Retarget Pose op on and off. Disabled ops are skipped entirely and don’t run at all. |

### Additive Pose

**Additive Pose** is an operation that provides a way to additively apply a Retarget Pose on the target character. This operation is used to apply precise layered adjustments on top of the existing retargeted result to handle additional corrections.

This operation can be added to the default ops stack and arranged in any order to optimize retargeting.

#### Additive Pose Op Settings

|  |  |
| --- | --- |
| **Name** | **Description** |
| **Pose to Apply** | The name of the retarget pose that is applied to the output of the target skeleton. |
| **Alpha** | Blends the pose on the target based on the set value. |

### Pin Bones

**Pin Bones** is a post processing feature used within the IK Retargeter to lock a specific bone (for example, `ik_hand_weapon`) to another bone (for example, `hand_r`). This operation ensures that special bones follow the animated character, preventing issues like the weapon snapping and maintaining proper hand placement during animations.

This operation can be added to the default ops stack and arranged in any order to optimize retargeting.

Using the Pin Bones operation together with Scale Source improves the animation transfer between to characters of different heights.

#### Pin Bones Setup

Defines the bones and chains targeted in Pin Bones.

|  |  |
| --- | --- |
| **Name** | **Description** |
| **Bones to Pin** | A list of bone-pairs to copy transforms between.**Bone to Copy From**: The bone group to copy from.**Bone to Copy To**: The bone group to copy to. |
| **Skeleton to Copy From** | Determines which skeleton to copy the animation from. You can choose between the source and target characters. |

#### Translation

Ensures precise contact points to copy translation data.

|  |  |
| --- | --- |
| **Name** | Description |
| **Copy Translation** | Toggle on and off the function for copying the translation of the bone. |
| **Translation Mode** | The method used to calculate the translation of the bone. |

#### Rotation

Ensures precise contact points to copy rotation data.

|  |  |
| --- | --- |
| **Name** | **Description** |
| **Copy Rotation** | Toggle on and off the function for copying the rotation of the bone. |
| **Rotation Mode** | The method used to calculate the rotation of the bone. |

#### Scale

Ensures the bone’s scale to copy movement from one character to another.

|  |  |
| --- | --- |
| **Name** | **Description** |
| **Copy Scale** | Copy the scale of the bone. |

#### Propagate Transform

Forces a target skeleton’s bones to match the exact position and rotation of a source skeleton’s bone, then propagates the transform down the chain to child bones.

|  |  |
| --- | --- |
| **Name** | **Description** |
| **Propagate to Children** | Determines whether to recursively update children bone transforms. |

#### Pin Bones Offset

Maintains the target bone’s positional relationship relative to the source bone’s position.

|  |  |
| --- | --- |
| **Name** | **Description** |
| **Global Offset** | A manual offset applied to global-space to the root bone based on:**Location****Rotation****Scale** |
| **Local Offset** | A manual offset applied to local-space to the root bone based on:**Location ****Rotation****Scale** |

### Filter Bones

**Filter Bones** is used for animations with large creatures, providing a way to select, isolate, or modify specific bone chains during the transfer of animation from source to a target skeleton. This operation filters down in a hierarchical manner to ensure that structural differences, such as bone counts or proportions in arms and legs, don’t cause issues like floating feet, distorted limbs, or inaccurate prop interactions.

This operation can be added to the default ops stack and arranged in any order to optimize retargeting.

#### Filter Bones Setup

Determines which bones to target.

|  |  |
| --- | --- |
| **Name** | **Description** |
| **Bones to Filter** | Add multiple or singular bones to an array. The selected bones have any changes made with this tool applied to them. |

#### One Euro Filter

|  |  |
| --- | --- |
| **Name** | **Description** |
| **Min Frequency** | Determines the low-pass cutoff point when motion is near zero. Values are set in Hertz (Hz).Higher values result in less smoothing at rest and are more responsive to jitter.Lower values result in more smoothing at rest and less jitter. |
| **Responsiveness** | Raises the cutoff as angular speed grows. Use values between **0.3-0.8** for the best results.Larger values are snappier on fast turns.Smaller values are smoother but lag during quick motion. |
| **Velocity Cutoff Hz** | Low-passes the raw angular velocity before it can be used to adapt the derivative cutoff. For best results begin with values between **15-30Hz.**If breathing or pumping of the smoothing onsets or reversals is visible, lower the value. For example between **30-20 Hz**.If responsiveness to fast changes is sluggish, raise the Velocity Cutoff value a bit.Keep under the Nyquist frequency (frame_rate/2). |
| **Reset Playback** | Select True or False. When this option is set to true, the filter resets when playback loops in the Editor. |

### Scale Source

**Scale Source** operations include features that control how the source animation’s scale and proportion-driven translation are adapted to a target character of a different size. This operation can’t be used multiple times in an op stack.

Scale Source operations affect IK Goals that use Blend to Source sub-operations.

The Scale Source operation optimizes retargeting best when it’s placed at the top of the operations stack, but you can add Scale Source to the default ops stack and arrange it in any order you want.

#### Scale

|  |  |
| --- | --- |
| **Name** | **Description** |
| **Source Scale Factor** | Scales the incoming source pose using a custom ranged setting. The set scale affects the entire skeleton and all IK goals. This setting is set to 0 by default. |

#### Scale Pivot

|  |  |
| --- | --- |
| **Name** | **Description** |
| **Scale Pivot** | Determines the space in which the scale should pivot from the component or a specific bone on the source skeleton. |
| **Scale Pivot Bone** | The source skeleton bone space in which the scale pivots from. |
| **Project Scale Pivot to Floor** | Provides a way for the Scale Pivot Bone’s scale to be projected based on Z = 0. |

#### Scale Source Enable Op

|  |  |
| --- | --- |
| **Name** | **Description** |
| **Enabled** | Toggles the operation on and off. When an op is toggled off, it is skipped entirely and doesn't run at all. |

### Stretch Chains

**Stretch Chains** provide a way to determine the length or stretch of bone chains per chain to match the length of the source bone chains. This can be achieved by copying bone chains, or selecting bone chains and stretching them individually to match the source character.

You can exclude bone chains from the copy to optimize performance by running the operation only on the necessary parts of the body.

This operation can be added to the default ops stack and arranged in any order to optimize retargeting.

#### Stretch Chain Settings

The tools within this setting do the following:

[image: The Stretch Chains Settings provides a way for you to target bone chains or individual bones.] Stretch Chain Settings

- **IK Rig Asset**: Automatically sets the target asset and lists the target bone chains in a scrollable menu below.
- **Chain Mapping Options**: Filters bones using different filtering options:**Hide Mapped Chains**: Hides chains mapped to a source chain.
- **Hide Unmapped Chains**: Hides chains not mapped to a source chain.
- **Hide Chains Without IK**: Hides chains not using IK.
- **Clear Filters**: Clears filter options.

- **Auto-Maps Chains**: Automatically assigns source based on matching rule.**Map All (Fuzzy)**: Maps all chains to the source chain with the closest name.
- **Map Only Empty (Fuzzy)**: Map all unmapped chains to the source chain with the closest name.
- **Map All (Exact)**: Maps all chains with identical names. Does not change mapping if an exact match is not found.
- **Map Only Empty (Exact)**: Maps unmapped chains using identical names. Does not change mapping if an exact match is not found.
- **Clear Filters**: Clears filter options.

#### Stretch Chain

|  |  |
| --- | --- |
| **Name** | **Description** |
| **Enabled** | Turn the Stretch Chain settings on and off. |
| **Match Source Length** | Matches the total length of this chain with the mapped source chain using a range from **0-1**. At **0**, the chain’s length is left alone. At **1**, the chain is stretched to match the length of the source. The default setting is 0. |
| **Scale Chain Length** | A multiplier on the length of the chain, applied after matching the source length using a custom value. The default value is 1. |

### Pole Vector Alignment

**Pole vector alignment** is the process of mapping the knee or elbow direction from the source character to the target character with different proportions, ensuring that the joints bend in the correct direction. It matches the rotational angle of the target’s limb chain to the source, typically by twisting the joint chain to align with the pole vector, without altering the location of the end effectors (such as hand or feet.)

This operation can be added to the default ops stack and arranged in any order to optimize retargeting.

This operation runs in the same way as FK Chains.

#### Pole Vector Alignment Settings

The tools within this setting do the following:

[image: The Pole Vector Alignment Settings provides a way to target bone chains or individual bones.] Pole Vector Alignment Settings

- **IK Rig Asset**: Automatically sets the target asset and lists the target bone chains in a scrollable menu below.
- **Chain Mapping Options**: Filters bones using different filtering options:**Hide Mapped Chains**: Hides chains mapped to a source chain.
- **Hide Unmapped Chains**: Hides chains not mapped to a source chain.
- **Hide Chains Without IK**: Hides chains not using IK.
- **Clear Filters**: Clears filter options.

- **Auto-Maps Chains**: Automatically assigns source based on matching rule.**Map All (Fuzzy)**: Maps all chains to the source chain with the closest name.
- **Map Only Empty (Fuzzy)**: Map all unmapped chains to the source chain with the closest name.
- **Map All (Exact)**: Maps all chains with identical names. Does not change mapping if an exact match is not found.
- **Map Only Empty (Exact)**: Maps unmapped chains using identical names. Does not change mapping if an exact match is not found.
- **Clear Filters**: Clears filter options.

#### Align Pole Vector

Align Pole Vector settings can be found in the Details panel.

Ensures the joints in a target character’s limb bend the same direction as the source animation.

|  |  |
| --- | --- |
| **Name** | **Description** |
| **Enabled** | Determines whether the pole vector alignment on this chain is turned on or not. |
| **Align Alpha** | Matches the twist angle of this chain along the Pole direction to the source chain using a range of **0-1**.At **0**, the chain’s pole vector direction is left alone.At **1**, the root bone of the chain is twist-rotated in the pole direction to match the orientation of the source chain. |
| **Static Angular Offset** | An angular offset, in degrees, for the pole direction of the chain. The offset values don’t have to be positive. This setting is set to 0 by default. |
| **Maintain Offset** | When set to true, the original angular offset between the source and the target pole vectors are maintained when aligning pole vectors. This setting is off by default. |

### Copy Base Pose

**Copy Base Pose** defines and aligns the default resting pose of a target character to match the source character. This operation ensures that animations such as walking or idling transfer accurately without broken limbs or incorrect joint rotations, especially when the two characters were modeled in different poses, for example a T-pose versus an A-pose.

This operation fixes discrepancies between the source and the target skeleton resting poses to ensure high-quality, accurate animation retargeting. By properly defying the base pose, the IK Retargeter accurately calculates the difference in joint rotation between the two characters, which provides a way for the source animation to appear more natural on the target character.

This operation can be added to the default ops stack and arranged in any order to optimize retargeting.

#### Retarget Phases

Defines the stages of mapping animation data from a source skeleton to a target skeleton.

|  |  |
| --- | --- |
| **Name** | **Description** |
| **Copy Base Pose** | When set to True, this setting copies all the source bone transforms with matching names to use as a base pose. This is useful for partial retargeting.No retargeting is applied to the bone transforms, they are assumed to be fully compatible between the source and the target skeletons. |
| **Copy from Start** | Filters the bones to copy when using Copy Base Pose. If specified, this setting only copies the children of the specified bone (inclusive). |
| **Bones to Exclude** | Bones added to this list (and their children) don’t have their pose copied. They are left at the reference pose. |

#### Copy Base Pose Enable Op

|  |  |
| --- | --- |
| **Name** | **Description** |
| **Enabled** | Toggles the operation on and off. When an op is toggled off, it is skipped entirely and doesn't run at all. |

### Run IK Rig

**Run IK Rig** refers to the process of applying inverse kinematic (IK) solvers and goals to a skeletal mesh during animation retargeting to ensure precise limb positioning, particularly when transferring animation between characters with different proportions.

Run IK Rig houses all operations and tools that use an IK Rig. You can add and order sub-operations of Run IK Rig in any sequence to capture distinct movements for better retargeting.

Sub-operations are IK phases of retargeting operations. Separating them into a customizable operation stack provides different kinds of IK goal adjustments. Run IK Rig is considered one of the default operations. When you click **Add Default Ops**, Run IK Rig appears in the Op Stack list.

Run IK Rig uses the LOD threshold to enable and disable the maximum LOD the operation can run at.

#### Solve IK Goal Settings

The tools within this setting do the following:

[image: Solve IK Goals Settings provides a way to target and run an IK specific sub-operation on bone chains or individual bones.] Solve IK Goals Settings

- **IK Rig Asset**: This property is set from the Default Target IK Rig property from Asset settings (-> ik-rig-animation-retargeting-in-unreal-engine). Below, the asset’s bone chains are listed in a scrollable menu.You can use a separate target for this setting.
- **Chain Mapping Options**: Filters bones using different filtering options:**Hide Mapped Chains**: Hides chains mapped to a source chain.
- **Hide Unmapped Chains**: Hides chains not mapped to a source chain.
- **Hide Chains Without IK**: Hides chains not using IK.
- **Clear Filters**: Clears filter options.

- **Auto-Maps Chains**: Automatically assigns source based on matching rule.**Map All (Fuzzy)**: Maps all chains to the source chain with the closest name.
- **Map Only Empty (Fuzzy)**: Map all unmapped chains to the source chain with the closest name.
- **Map All (Exact)**: Maps all chains with identical names. Does not change mapping if an exact match is not found.
- **Map Only Empty (Exact)**: Maps unmapped chains using identical names. Does not change mapping if an exact match is not found.
- **Clear All Mapping**: Clears mapping and sets mappin gto None.

#### Run Ik Rig Chain Settings

Select a chain from the list to open the Chain Settings options.

|  |  |
| --- | --- |
| **Name** | **Description** |
| **Enable IK** | Determines whether to modify the location of the IK goal on this chain. This setting is set to true by default.When this option is disabled on an asset with an IK goal, the IK is still evaluated, but the goal is set to the input bone location from the FK pass.This only has an effect if the chain has an IK goal assigned to it in the Target IK Rig asset. |
| **Chain Position Alpha** | Retargets the goal position based on the source length and direction. This tool has a range of 0-1.At 0, the goal is left at the input pose bone location.At 1, the goal is transferred in the direction of the source chain, at a distance from the base of the chain proportional to how much it’s compressed or stretched. |
| **Chain Rotation Alpha** | Retargets the goal rotation based on the source chain end bone rotation. This tool has a range of 0-1. This setting is useful; if no IK retargeting is being performed on this chain before the IK op.At 0, the goal is left at the input pose bone rotation.At 1, the goal is rotated by the same world space rotation applied to the source chain end bone.If the target end bone rotation was already retargeted before this op, this setting may have no effect. The Op Stack doesn’t double-rotate the goal. |
| **Override Goal Alpha** | Toggle this option on and off. When set to on, the alpha values override the goal alpha settings from the IK Rig asset. The default value is 0. |
| **Final Position Alpha** | Blends all goal translation offsets on and off. This tool has a range of 0-1.At 0, the goal is left at the input bone location.At 1, the goal is moved to the location generated by the IK goal ops. |
| **Final Rotation Alpha** | Blends all goal translation offsets on and off. This tool has a range of 0-1.At 0, the goal is left at the input bone location.At 1, the goal is moved to the location generated by the IK goal ops. |

#### Run IK Rig Debug

Run IK Rig has default debug operations that evaluate different draw parameters.

|  |  |
| --- | --- |
| **Name** | **Description** |
| **Draw Final Goals** | Draws the final IK goal locations. |
| **Draw Source Locations** | When turned on, the debugger uses draw locations of the source bone (pre-solve). |
| **Goal Draw Size** | Adjusts the size of the goal debug drawing in the viewport. |
| **Goal Draw Thickness** | Adjusts the thickness of goal debug drawing in the viewport of the target IK goals. |

## Sub-operations List

Below is a list of the sub-operations that complement the Run IK Rig operation. You can add, reorder, and delete them from the Run IK Rig operation stack framework.

### Blend to Source

A sub-operation that evaluates the IK goals for the retarget, these tools are required in order to run the evaluation. Specialized retarget IK goals tools run inverse kinematics on the target character through sub-operations that affect the IK goals outcomes.

#### Blend To Source Settings

[image: An example of applying Blend to Source Settings on a selected chain.]

- **Chain Mapping Options** - Filters bones using different filtering options:**Hide Mapped Chains** - Hides chains mapped to a source chain.
- **Hide Unmapped Chains** - Hides chains not mapped to a source chain.
- **Hide Chains Without IK** - Hides chains not using IK.
- **Clear Filters** - Clears filter options.

#### Blend to Source Chain Settings

Select a chain in the list to open these options.

|  |  |
| --- | --- |
| **Name** | **Description** |
| **Blend to Source** | Blends the retarget pelvis’ translation between its retargeted location (**0**) and the exact source location (**1**). This property is similar to "reach" as seen in other retargeting tools. |
| **Translation Alpha** | Blends the translational component of BlenToSource in a range of **0-1**.At **0**, the goal is placed at the location.At **1**, the goal is placed at the location of the source chain’s end bone. The default setting is **1**. |
| **Rotation Alpha** | Blends the amount of FK rotation copying between the retargeted rotation (**0**) and the exact source rotation (**1**) of the chain’s end bone. The default setting is **0**.At **0**, the goal is oriented to the input rotation.At **1**, the goal is oriented to the source chain’s end bone rotation. |
| **Translation Per Sxis Alpha** | Weight each axis separately when using Blend To Source between the retargeted location (**0**) and the exact source location (**1**) of the chain’s end bone. The default setting is **1**. |
| **Apply Pelvis Offset** | When set to true, the source locations are affected by the target pelvis motion.When set to false, the Pelvis Motion operation is present, or if the Affect IK weights in the Pelvis Motion op are zero, then this setting has no effect. The default setting is false.This setting applies all offsets generated in the Pelvis Motion op. |

#### Blend to Source Op Settings

|  |  |
| --- | --- |
| **Name** | **Description** |
| **Alpha** | Blends the offset effects on all chains. This tool has a range of **0-1**. |

#### Blend to Source Debug

|  |  |
| --- | --- |
| **Name** | **Description** |
| **Debug Draw Size** | Adjusts the size of the goal debug drawing in the viewport. |

### Offset Goals

Applies either a translational or rotational offset to the IK goal on the target chain.

#### Offset Goals Settings

[image: An example of applying the Offset Goals Settings to the selected chain.]

- **Chain Mapping Options** - Filters bones using different filtering options:**Hide Mapped Chains** - Hides chains mapped to a source chain.
- **Hide Unmapped Chains** - Hides chains not mapped to a source chain.
- **Hide Chains Without IK** - Hides chains not using IK.
- **Clear Filters** - Clears filter options.

### Offset Goals Chain Settings

Select a chain in the list to open these options.

|  |  |
| --- | --- |
| **Name** | **Description** |
| **Global Translation Offset** | Applies a global-space translation offset to the IK goal. |
| **Local Translation Offset** | Applies a local-space translation offset to the IK goal. |
| **Global Rotation Offset** | Applies a global-space rotation offset to the IK goal. |
| **Local Rotation Offset** | Applies a local-space rotation offset to the IK goal. |

#### Offset Goals Op Settings

|  |  |
| --- | --- |
| **Name** | **Description** |
| **Alpha** | Blends the offset effects on all chains. This tool has a range of **0-1**. |
| **Translation Alpha** | Blends the translation offset effects on all chains. This tool has a range of **0**-**1**. |
| **Rotation Alpha** | Blends the rotation offset effects on all chains. This tool has a range of **0-1**. |

### Scale Goals

Scales the specified bones and chains of the target according to the Chain Settings.

#### Scale Goals Settings

[image: An example of the Scale Goals Settings that are applied to chains.]

- **Chain Mapping Options** - Filters bones using different filtering options:**Hide Mapped Chains** - Hides chains mapped to a source chain.
- **Hide Unmapped Chains** - Hides chains not mapped to a source chain.
- **Hide Chains Without IK** - Hides chains not using IK.
- **Clear Filters** - Clears filter options.

#### Scale Goals - Chain Settings

|  |  |
| --- | --- |
| **Name** | **Description** |
| **Scale Vertical** | Scales the vertical component of the IK goals’ vertical position. |
| **Scale Horizontal** | Scales the horizontal component of the IK goals’ vertical position. |
| **Scale Along Chain** | Brings IK goal closer (**0**) or further (**1+**) from the origin of the chain. This chain has a default value of **1**, but can be scaled higher or lower.At **0**, the effector is placed at the origin of the chain, for example the shoulder or hip.At **1**, the effector is left at the end of the chain, for example the wrist or foot.Values in-between **0-1** slide the effector along the vector from the start to the end of the chain.Values greater than **1** stretch the chain beyond the retargeted length. |

#### Scale Goals Op Settings

|  |  |
| --- | --- |
| **Name** | **Description** |
| **Alpha** | Blends the effect on all chains. This tool has a range of **0-1.** |

### Floor Constraint

A sub-operation that applies a **floor constraint** to specific IK goals to prevent a character’s feet and hands from penetrating the ground based on the source character. It applies specialized **floor constraint chain** tools to a bone chain selected in the Retarget Chain settings.

#### Floor Goal Op Settings

[image: An example of Floor Op Settings applied to the selected chain.]

The **Floor Goal Op Settings** filters bones using different **Chain Mapping Options**:

- **Hide Mapped Chains** - Hides chains mapped to a source chain.
- **Hide Unmapped Chains** - Hides chains not mapped to a source chain.
- **Hide Chains Without IK** - Hides chains not using IK.
- **Clear Filters** - Clears filter options.

#### Floor Constraint Chain Settings

Select a chain in the list to open these options.

|  |  |
| --- | --- |
| **Name** | **Description** |
| **Enable Floor Constraint** | Determines whether to apply the floor constraint location of the IK goal on this chain. The default value is set to False.When this option is enabled, the floor constraint adjusts the vertical position of the IK goal according to the following rules:When the source goal bone is lower than the `FloorHeightFalloffStart`, the height of the goal is smoothly blended to the height of the source bone.When the source goal bone is Higher than the `FloorHeightFalloffStart`, the height of the goal is left at its normal retargeted location.The floor is assumed to be the XY plane where **Z=0**. This only has an effect if the chain has an IK goal assigned to it in the Target IK Rig asset. |
| **Alpha** | Blends the effect of the constraint on this goal. This option when toggled On has a range of **0-1**. The setting is set to **0** by default. |
| **Maintain Height Offset** | Maintains the height difference between the source and target from the retarget pose using a range between **0-1**. The default value is set to **0**. |

#### Foot Settings

With **Foot Settings** you are not limited to a specific chain, instead you can toggle Foot and Toe options on and off, or default an option to off. You can also configure properties that define the foot plane.

|  |  |
| --- | --- |
| **Name** | **Description** |
| **Use Foot** | Toggles the option on and off. When set to on, uses the foot definition for more accurate foot and ground retargeting. When set to false, this operation treats the foot as a point. |
| **Use Toes** | Toggles the option on and off. When set to on, this op uses the toes definition for more accurate toe and ground collusion. |
| **Foot Op** | Operations specific to the foot plane. |
| **Medial Offset** | The height in centimeters from the middle of the foot’s plane that snaps directly to the source bone height. The default value is set to **10**; slide the bar to set the height on the target asset. |
| **Lateral Offset** | The height in centimeters from the left and right sides of the foot’s plane that snaps directly to the source bone height. The default value is set to **10**; slide the bar to set the height on the target asset. |
| **Heel Offset** | The height in centimeters from the heel of the foot’s plane that snaps directly to the source bone height. The default value is set to **10**; slide the bar to set the height on the target asset. |
| **Toe Offset** | The height in centimeters from the toes of the foot’s plane that snaps directly to the source bone height. The default value is set to **10**; slide the bar to set the height on the target asset. |
| **Vertical Offset** | The height in centimeters from the top of the foot’s plane that snaps directly to the source bone height. The default value is set to **10**; slide the bar to set the height on the target asset. |
| **Toes Op** | Operations specific to the bones in the toes. The toes will bend accordingly based on the foot definition and the toe definition. |
| **Alpha** | Blends the effect of the toe operation on this goal. When the Use Toe option is toggled On, this tool has a range of **0-1**. The setting is set to **1** by default. |
| **Responsiveness** | Speed coefficient; increases cutoff when signal changes quickly (reactivity). |
| **Cutoff Frequency** | Minimum cutoff frequency for the One Euro Filter (higher values mean less smoothing). |
| **Velocity Cutoff** | Cutoff frequency for the derivative smoothing step. |
| **All Toes** | Operations specific to the bone definition in all the toes. Add a toe bone to the index to target that bone in the chain. |
| **Toe Bone** | The selected toe bone from the bone chain hierarchy. |
| **Length** | Length of the bone in centimeters. This helps define toes for larger assets that have complex toe and foot structure. |
| **Yaw Offset** | The height in centimeters from the left and right direction of the toe’s definition that snaps directly to the source bone height. The default value is set to **10**; slide the bar to set the height on the target asset. |
| **Vertical Offset** | The height in centimeters from the top of the toe’s definition that snaps directly to the source bone height. The default value is set to 10; slide the bar to set the height on the target asset. |

### Speed Plant IK Goals

A sub-operation that speed plants specified IK goals based on a **speed curve**. These tools are used on bone chains selected in the Retarget Chain settings.

#### Speed Plant Settings

[image: An example of the Speed Plant Settings that are applied to chains.]

- **Chain Mapping Options** - Filters bones using different filtering options:**Hide Mapped Chains** - Hides chains mapped to a source chain.
- **Hide Unmapped Chains** - Hides chains not mapped to a source chain.
- **Hide Chains Without IK** - Hides chains not using IK.
- **Clear Filters** - Clears filter options.

#### Speed Plant Chain Settings

|  |  |
| --- | --- |
| **Name** | **Description** |
| **Alpha** | Blends the effect of the speed planting on this chain only on a range from **0-1**. At **0**, there is no effect. |
| **Speed Curve Name** | The name of the animation curve that contains the speed curve data. |

#### Speed Planting Op Settings

|  |  |
| --- | --- |
| **Name** | **Description** |
| **Alpha** | Blends the effect of the speed planting on a range of **0-1.** At **0**, there is no effect. |
| **Speed Threshold** | The maximum speed a source bone is allowed to move for the Speed Planting system to determine it is not moving. This causes the target IK goal to not move whenever the source bone speed drops below this threshold. |
| **Blend Method** | The method to use when blending the IK goal of a planted position. The **Spring** method uses a critically damped spring equation to blend into and out of the planted states.The **Move Towards** method more accurately tracks fast motion without looking mushy. It only blends out of planted states. |
| **Critical Damping** | How much damping to apply to the spring. A value of **0** means no damping, and a value of **1** means critically damped, causing no oscillation. |

### Stride Warp IK Goals

A sub-operation that scales and warps specified IK goals based on a specified forward direction. These tools are used on bone chains selected in the Retarget Chain settings.

### Stride Warp Settings

[image: An example of the Stride Warp Settings that are applied to chains.]

- **Chain Mapping Options** - Filters bones using different filtering options:**Hide Mapped Chains** - Hides chains mapped to a source chain.
- **Hide Unmapped Chains** - Hides chains not mapped to a source chain.
- **Hide Chains Without IK** - Hides chains not using IK.
- **Clear Filters** - Clears filter options.

#### Stride Warp Chain Settings

|  |  |
| --- | --- |
| **Name** | **Description** |
| **Enable Stride Warping** | Enables stride warping functionality, which gives you a way to manipulate the stride length, width, and splay of the retargeted animations. Stride warping requires you to set up your character using IK goals for retargeting. |
| **Alpha** | Blends the effect of the stride warping on this chain only on a range of **0-1**. At **0**, there is no effect. |

#### Stride Warp Op Settings

|  |  |
| --- | --- |
| **Name** | **Description** |
| **Alpha** | Blends the effect of the stride warping on this chain only on a range of **0-1**. At **0**, there is no effect. |
| **Direction Source** | The source to use to determine a "best fit" global rotation that approximates the facing direction of the character over time. You can select from the following:**Goals**: Uses the positions of IK goals to approximate the facing direction. This option is best used on characters with a vertical spine, like bipeds.**Chain**: Uses the positions of the bones in retarget chains to approximate the facing direction. This is best used for characters with a horizontal spine, like quadrupeds. |
| **Forward Direction** | The world space facing direction of your character. In most cases this is Y. |
| **Direction Chain** | If you set `DirectionSourcetoChain`, this property is used to specify which chain to use to help define the forward direction of the character. |
| **Warp Forwards** | Warps the IK goals along the forward direction. Values lower than 1 creates smaller strides, which values higher than 1 increase the stride length. |
| **Sideways Offset** | Warps the sideways stance of the character. Values below **0** pulls the IK goals together perpendicularly to the forward direction, and higher than **0** pushes them apart. |
| **Warp Splay** | Warps the overall stance of the character. Values below **1** pulls the IK goals together to an average location, and higher than **1** pushes them apart. |

#### Stride Warp Debug

|  |  |
| --- | --- |
| **Name** | **Description** |
| **Debug Draw Size** | Adjusts the size of the debug drawing. |
| **Debug Draw Thickness** | Adjusts the size of the debug drawing. |

### Relative IK Retarget

To use this experimental sub-operation, add the **Spatially Aware Retarget Ops** plugin to your project.

This sub-operation takes animation data created from one character and maps it to another character with different proportions. The animation notify data records which parts of the character come in contact with each other during an animation, such as a hand touching a shoulder. Then, when the animation is applied to a different character with different proportions, the same body parts connect in the correct places, based on the new proportions.

#### Create Animation Notify Data

Before you create animation notify data and use it for the Relative IK Retarget sub-operation, you must have two characters, which each have an associated physics asset and a skeletal mesh body that's set to be collided.

To create animation notify data for the Relative IK Retarget sub-operation, follow these steps:

- Open the animation sequence you want to retarget.
- Go to **Window** > **Animation Data Modifiers**.
- Click **Add Modifier** and select **RelativeBodyAnimModifier**.[image: The RelativeBodyAnim modifier]
- In the **RelativeBodyAnimModifier** settings, set the **Skeletal Mesh Asset** and the **Physics Asset Override** of the character that uses the animation.
- Click **Apply All Modifiers**.
- Set the bone names that the modifier should look at to generate the animation notify data:**Contact Body Names**: The bone names from the physics asset that come in contact with any domain body parts.Each animation can have a different set of domain and contact bodies depending on which parts come in contact. In the image below, the domain body parts are the hips, legs, arms, neck, head, and spine of the character, and the contact body parts are the hands.[image: the RelativeBodyAnimModifier settings]
- **Domain Body Names**: The bone names from the physics asset that you want the modifier to record in the domain space.

When the modifier is applied, it creates **RelativeBodyBakeAnimNotify** data and adds it to the animation sequence’s timeline. This data can be read by the Relative IK Target sub-operation.

[image: The RelativeBodyBakeAnimNotify data]

If you edit the physics asset after creating the animation data, you will have to apply the modifier again to create new animation data that includes your edits.

#### Add Relative IK Retarget Sub-Operation

After you create animation notify data from the first character, you can apply the data to a new skeleton using the Relative IK sub-operation in IK Retargeter. This requires a Retarget IK operation, with an assigned IK Rig, IK Solver, and IK Goals.

To add the Relative IK Retarget sub-operation, follow these steps:

- In the **Op Stack** tab, click the **add (+)** button next to **Run IK Rig**.[image: The add button next to Run IK Rig]
- Click **Relative IK Retarget** to add the sub-operation.
- In the **Details** tab, under **Physics**, add a **Source Physics Asset Override** and a **Target Physics Asset Override**. Set the source asset to be the physics asset used when generating the animation notify data, and set the target asset to the physics asset of the character you want to apply the animation to.[image: The Source Physics Asset Override and Target Physics Asset Override settings]
- If the source and target assets' skeletons have different hierarchy and names, then use the **Body Mapping** property to map the target asset's bones to the source asset's bones. The relationships between the target and source bones are referred to as body pairs.[image: The Body Mapping property]

If the animation doesn't play for the new character, check to make sure the original animation sequence has the animation notify data. The Relative IK Retarget sub-op won't work if there is no animation notify data.

#### Relative IK Retarget Settings

|  |  |
| --- | --- |
| Name | Description |
| **Floor Threshold** | The maximum distance for bone-to-floor connections to be applied to IK goals. |
| **Floor Constraint Scalar** | Adjusts where the feet bones of the character connect with the floor. |
| **Distance Threshold** | The maximum distance for body pairs to be applied to IK goals. |
| **Dist Half Point Lambda** | The point where the distance weight value will be 0.5. The lower the value, the faster the falloff. |
| **Distance Weight Mode** | The type of fade to apply to the distance threshold. Can be Linear, Quadratic, Cubic, or Quartic. |
| **Feasibility Length Bias** | The bias goal feasibility distance relative to IK chain radius. The default feasibility is weighted by comparing the IK goal distance to the maximum IK chain length. |
| **Contribution Sum Weight** | A weight applied to normalize IK goals. |
| **Temporal Smoothing Radius** | The number of frames of temporal smoothing applied to body pair verts. Can be used to help with jittering. |
| **Ignore Source Scale** | Whether to ignore Source Scale operations when calculating relative source distances. |

#### Relative IK Retarget Debug Settings

|  |  |
| --- | --- |
| Name | Description |
| **Debug Draw Body Pairs** | Draw the source and target body pair relationships for the current animation. |
| **Debug Full Retarget Pair Bones** | Draw the full retarget quad relationship for a specified bone name. |
| **Debug Draw Goal Contributions** | Draw each pair’s goal contribution in white, and show the weighted final goal location in yellow. |
| **Debug Draw Retarget Vert Averages** | Draw the retarget pair-line for each pair contribution. Uses the following colors:**Gray**: The distance-weighted goal point for each pair**Green and yellow**: Goal feasibility constraint minimum and maximum on pair-line |
| **Debug Draw Physics Bodies** | Draw the source and target physics bodies from the Physics Override. |
| **Debug Draw Body Transforms** | Draw the body-local transform setup, such as baked verts. |

### Body Intersect Goals

To use this experimental sub-operation, add the **Spatially Aware Retarget Ops** plugin to your project.

The **Body Intersect Goals** sub-operation moves specified IK goals based on collisions to prevent a character's body parts from intersecting during an animation. It takes a list of IK goals and a list of body names from a physics asset. The sub-operation checks if the IK goals intersect with the bodies, and adjusts the position of the IK goals to prevent clipping.

If you're using this sub-operation with the Relative IK Retarget sub-operation, put Relative IK Retarget before Body Intersect Goals in the operation stack. Otherwise, the Body Intersect Goals sub-operation will be overwritten.

Before using the Body Intersect Goals sub-operation, you must have a target character, which has an associated physics asset and a skeletal mesh body that's set to be collided.

To set up Body Intersect Goals, follow these steps:

- In the Details panel for the Body Intersect Goals sub-operation, assign a Target Physics Asset Override for the target character.
- Set the Intersect Goals, which must be the end bones on chains with IK goals (such as hands).
- Set the Intersect Bodies to include any parts of the character's body that the Intersect Goals should avoid collisions with to prevent visual clipping.

[image: Intersect Goals and Intersect Bodies]

To turn debug drawing on or off, click the **debug** button next to **Body Intersect Goals** in the **Op Stack**.

[image: The debug button]

- animation
- ik rig
- ik retargeting

On this page

- Prerequisites (-> retargeting-operation-stack-in-unreal-engine-5-8)
- Operations List (-> retargeting-operation-stack-in-unreal-engine-5-8)
- Pelvis Motion (-> retargeting-operation-stack-in-unreal-engine-5-8)
- Pelvis Motion Setup (-> retargeting-operation-stack-in-unreal-engine-5-8)
- Pelvis Motion - Floor Constraint (-> retargeting-operation-stack-in-unreal-engine-5-8)
- Pelvis Rotation (-> retargeting-operation-stack-in-unreal-engine-5-8)
- Pelvis Translation (-> retargeting-operation-stack-in-unreal-engine-5-8)
- Scale Pelvis Translation (-> retargeting-operation-stack-in-unreal-engine-5-8)
- Affect IK Settings (-> retargeting-operation-stack-in-unreal-engine-5-8)
- Pelvis Motion Debug (-> retargeting-operation-stack-in-unreal-engine-5-8)
- Pelvis Motion Enable Op (-> retargeting-operation-stack-in-unreal-engine-5-8)
- FK Chains (-> retargeting-operation-stack-in-unreal-engine-5-8)
- Retarget Chains Settings (-> retargeting-operation-stack-in-unreal-engine-5-8)
- FK Chain Retarget (-> retargeting-operation-stack-in-unreal-engine-5-8)
- FK Chains Debug (-> retargeting-operation-stack-in-unreal-engine-5-8)
- Root Motion (-> retargeting-operation-stack-in-unreal-engine-5-8)
- Bones (-> retargeting-operation-stack-in-unreal-engine-5-8)
- Main Source (-> retargeting-operation-stack-in-unreal-engine-5-8)
- Height Source (-> retargeting-operation-stack-in-unreal-engine-5-8)
- Root Motion Offset (-> retargeting-operation-stack-in-unreal-engine-5-8)
- Update Children (-> retargeting-operation-stack-in-unreal-engine-5-8)
- Remap Curves (-> retargeting-operation-stack-in-unreal-engine-5-8)
- Copy Curves (-> retargeting-operation-stack-in-unreal-engine-5-8)
- Remap Curves (-> retargeting-operation-stack-in-unreal-engine-5-8)
- Remap Curves Enable Op (-> retargeting-operation-stack-in-unreal-engine-5-8)
- Retarget Pose (-> retargeting-operation-stack-in-unreal-engine-5-8)
- Source Pose (-> retargeting-operation-stack-in-unreal-engine-5-8)
- Target Pose (-> retargeting-operation-stack-in-unreal-engine-5-8)
- Retarget Pose Enable Op (-> retargeting-operation-stack-in-unreal-engine-5-8)
- Additive Pose (-> retargeting-operation-stack-in-unreal-engine-5-8)
- Additive Pose Op Settings (-> retargeting-operation-stack-in-unreal-engine-5-8)
- Pin Bones (-> retargeting-operation-stack-in-unreal-engine-5-8)
- Pin Bones Setup (-> retargeting-operation-stack-in-unreal-engine-5-8)
- Translation (-> retargeting-operation-stack-in-unreal-engine-5-8)
- Rotation (-> retargeting-operation-stack-in-unreal-engine-5-8)
- Scale (-> retargeting-operation-stack-in-unreal-engine-5-8)
- Propagate Transform (-> retargeting-operation-stack-in-unreal-engine-5-8)
- Pin Bones Offset (-> retargeting-operation-stack-in-unreal-engine-5-8)
- Filter Bones (-> retargeting-operation-stack-in-unreal-engine-5-8)
- Filter Bones Setup (-> retargeting-operation-stack-in-unreal-engine-5-8)
- One Euro Filter (-> retargeting-operation-stack-in-unreal-engine-5-8)
- Scale Source (-> retargeting-operation-stack-in-unreal-engine-5-8)
- Scale (-> retargeting-operation-stack-in-unreal-engine-5-8)
- Scale Pivot (-> retargeting-operation-stack-in-unreal-engine-5-8)
- Scale Source Enable Op (-> retargeting-operation-stack-in-unreal-engine-5-8)
- Stretch Chains (-> retargeting-operation-stack-in-unreal-engine-5-8)
- Stretch Chain Settings (-> retargeting-operation-stack-in-unreal-engine-5-8)
- Stretch Chain (-> retargeting-operation-stack-in-unreal-engine-5-8)
- Pole Vector Alignment (-> retargeting-operation-stack-in-unreal-engine-5-8)
- Pole Vector Alignment Settings (-> retargeting-operation-stack-in-unreal-engine-5-8)
- Align Pole Vector (-> retargeting-operation-stack-in-unreal-engine-5-8)
- Copy Base Pose (-> retargeting-operation-stack-in-unreal-engine-5-8)
- Retarget Phases (-> retargeting-operation-stack-in-unreal-engine-5-8)
- Copy Base Pose Enable Op (-> retargeting-operation-stack-in-unreal-engine-5-8)
- Run IK Rig (-> retargeting-operation-stack-in-unreal-engine-5-8)
- Solve IK Goal Settings (-> retargeting-operation-stack-in-unreal-engine-5-8)
- Run Ik Rig Chain Settings (-> retargeting-operation-stack-in-unreal-engine-5-8)
- Run IK Rig Debug (-> retargeting-operation-stack-in-unreal-engine-5-8)
- Sub-operations List (-> retargeting-operation-stack-in-unreal-engine-5-8)
- Blend to Source (-> retargeting-operation-stack-in-unreal-engine-5-8)
- Blend To Source Settings (-> retargeting-operation-stack-in-unreal-engine-5-8)
- Blend to Source Chain Settings (-> retargeting-operation-stack-in-unreal-engine-5-8)
- Blend to Source Op Settings (-> retargeting-operation-stack-in-unreal-engine-5-8)
- Blend to Source Debug (-> retargeting-operation-stack-in-unreal-engine-5-8)
- Offset Goals (-> retargeting-operation-stack-in-unreal-engine-5-8)
- Offset Goals Settings (-> retargeting-operation-stack-in-unreal-engine-5-8)
- Offset Goals Chain Settings (-> retargeting-operation-stack-in-unreal-engine-5-8)
- Offset Goals Op Settings (-> retargeting-operation-stack-in-unreal-engine-5-8)
- Scale Goals (-> retargeting-operation-stack-in-unreal-engine-5-8)
- Scale Goals Settings (-> retargeting-operation-stack-in-unreal-engine-5-8)
- Scale Goals - Chain Settings (-> retargeting-operation-stack-in-unreal-engine-5-8)
- Scale Goals Op Settings (-> retargeting-operation-stack-in-unreal-engine-5-8)
- Floor Constraint (-> retargeting-operation-stack-in-unreal-engine-5-8)
- Floor Goal Op Settings (-> retargeting-operation-stack-in-unreal-engine-5-8)
- Floor Constraint Chain Settings (-> retargeting-operation-stack-in-unreal-engine-5-8)
- Foot Settings (-> retargeting-operation-stack-in-unreal-engine-5-8)
- Speed Plant IK Goals (-> retargeting-operation-stack-in-unreal-engine-5-8)
- Speed Plant Settings (-> retargeting-operation-stack-in-unreal-engine-5-8)
- Speed Plant Chain Settings (-> retargeting-operation-stack-in-unreal-engine-5-8)
- Speed Planting Op Settings (-> retargeting-operation-stack-in-unreal-engine-5-8)
- Stride Warp IK Goals (-> retargeting-operation-stack-in-unreal-engine-5-8)
- Stride Warp Settings (-> retargeting-operation-stack-in-unreal-engine-5-8)
- Stride Warp Chain Settings (-> retargeting-operation-stack-in-unreal-engine-5-8)
- Stride Warp Op Settings (-> retargeting-operation-stack-in-unreal-engine-5-8)
- Stride Warp Debug (-> retargeting-operation-stack-in-unreal-engine-5-8)
- Relative IK Retarget (-> retargeting-operation-stack-in-unreal-engine-5-8)
- Create Animation Notify Data (-> retargeting-operation-stack-in-unreal-engine-5-8)
- Add Relative IK Retarget Sub-Operation (-> retargeting-operation-stack-in-unreal-engine-5-8)
- Relative IK Retarget Settings (-> retargeting-operation-stack-in-unreal-engine-5-8)
- Relative IK Retarget Debug Settings (-> retargeting-operation-stack-in-unreal-engine-5-8)
- Body Intersect Goals (-> retargeting-operation-stack-in-unreal-engine-5-8)

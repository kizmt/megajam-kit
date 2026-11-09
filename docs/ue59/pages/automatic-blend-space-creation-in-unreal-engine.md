# Blend Space Analysis

https://dev.epicgames.com/documentation/en-us/unreal-engine/automatic-blend-space-creation-in-unreal-engine?application_version=5.9

> Accurately calculate and place your Blend Space samples using Blend Space Analysis.

[image: Blend Space Analysis]

Placing samples accurately in the Blend Graph (-> blend-spaces-in-unreal-engine) can be slow and tedious, especially if you are not sure exactly what characteristics the animations have. **Blend Space Analysis** can be used to calculate a range of relevant properties, and to then automatically place your samples in the Blend Space.

This document provides an overview of the Blend Space Analysis system in Blend Spaces.

#### Prerequisites

- You have an understanding of Blend Spaces (-> blend-spaces-in-unreal-engine).

- Your project has a Skeletal Mesh character with the necessary imported animations to use as samples in the Blend Space graph.

Blend Space Analysis cannot be used for Blend Space nodes created in Animation Blueprints.

## Enabling Analysis

Blend Space Analysis can be enabled for all Blend Space types (-> blend-spaces-in-unreal-engine) by setting the analysis axis function properties located in the **Asset Details** panel. Setting the **Axis Function** to a value other than **None **will enable Blend Space Analysis, and the value to select depends on the kind of Blend Space you are creating. For example, if you are creating an Aim Offset (-> aim-offset-in-unreal-engine), then typically you may want to select **Orientation**.

 [image: blend space analysis]

The following **Axis Functions** are available for use:

| Axis Function | Description |
| --- | --- |
| **None** | Disables analysis for this axis. |
| **Position** | Calculates the position of a Bone or Socket averaged over the duration of the sample. |
| **Velocity** | Calculates the velocity of a Bone or Socket averaged over the duration of the sample. |
| **Delta Position** | Calculates the change in position of a Bone or Socket over the duration of the sample. |
| **Orientation** | Calculates the orientation (roll, pitch and yaw) of a Bone or Socket averaged over the duration of the sample. |
| **Orientation Rate** | Calculates the rate of change of roll/pitch/yaw of a Bone or Socket averaged over the duration of the sample. |
| **Delta Orientation** | Calculates the change in roll/pitch/yaw of a Bone or Socket over the duration of the sample. |
| **Angular Velocity** | Calculates the angular velocity as a rotation vector (in degrees per second) averaged over the duration of the sample. |
| **Locomotion** | Estimates the locomotion velocity of a biped character based on the foot movements. |
| **Root Motion** | Estimates the locomotion velocity of a character based on the motion of the root (requires root motion data in the animation sequences). |

### Analysis Properties

Selecting any of the Axis Function types will reveal additional properties, which are used to configure the analysis. Most of these properties are common for all types, however there are some that are exclusive to certain types.

 [image: analysis properties]

| Name | Description |
| --- | --- |
| **Axis** | The axis of the Bone or Socket to analyze. Depending on the chosen Axis Function, there will be a different **Axis** to select: **Position**, **Velocity**, **Delta Position**, and **Angular Velocity** provides **X**, **Y**, or **Z** for the analysis axis. **Orientation**, **Orientation Rate**, and **Delta Orientation** provides **Pitch**, **Roll**, or **Yaw** for the analysis axis. **Locomotion** and **Root Motion** provides **Speed**, **Direction**, **Forward Speed**, **Rightward Speed**, **Upward Speed**, **Forward Slope**, and **Rightward Slope** for the analysis axis. |
| **Bone/Socket** | This specifies the Bone or Socket to analyze. If **Axis** is set to **Locomotion**, then two Bone/Socket properties are required, one for each foot. Some analysis functions will also use the orientation of the Bone for calculating Pitch, Roll, or Yaw values. In these cases, you need to ensure that the **facing** and **right** axes are set correctly, depending on how the character's skeleton is set up. |
| **Bone Facing Axis** | The forward-facing axis of the selected Bone or Socket if **Orientation**, **OrientationRate**, or **DeltaOrientation** is selected as the Axis Function. |
| **Bone Right Axis** | The right-facing axis of the selected Bone or Socket if **Orientation**, **OrientationRate**, or **DeltaOrientation** is selected as the Axis Function. |
| **Space** | The spatial coordinates in which to perform the analysis, so you can calculate the position and orientation of one Bone with respect to another. You can select the following spatial coordinates: **World** space represents the space the character is in at the start of each animation sequence, and can be determined from the viewport axis display. **Fixed** space uses the space of a particular bone or socket, without updating it during the animation sequence. Using it, you can specify your own "world space" coordinate frame using the Bone or Socket from the first frame of the animation sequence. **Changing**, which is similar to **Fixed**, but the space is updated for each frame that is analyzed in the animation sequence. **Moving** space, which is similar to **Changing**, except that the velocities are also calculated relative to the Bone space. |
| **Analysis Space Bone/Socket** | If Space is set to either **Fixed**, **Changing**, or **Moving**, then this is where you specify the Bone or Socket to use for the spatial analysis. |
| **Character Facing Axis** | The facing direction of your character, which can be determined from the viewport axis display. Typically this should be set to **+Y**. [image: character facing axis] |
| **Character Up Axis** | The upward direction of your character, which can be discerned from the viewport axis display. Typically this should be set to **+Z**. |
| **Start Time Fraction** | The normalized start time of the animation sample to analyze. You may want to adjust this if you only want a certain section of an animation to be analyzed. |
| **End Time Fraction** | The normalized end time of the animation sample to analyze. You may want to adjust this if you only want a certain section of an animation to be analyzed. |

## Analysis Examples

The following are some examples of how you can use Blend Space Analysis to populate your Blend Space graph.

### Aim Offset

If you want to automatically place your Aim Offset (-> aim-offset-in-unreal-engine) samples, you can use Blend Space Analysis in the following way. This example will assume you have already created an Aim Offset Asset.

In the Aim Offset Asset Details panel, locate both the **Horizontal Axis Function **and **Vertical Axis Function** properties and set them to **Orientation**.

 [image: aim offset analysis orientation]

Additional analysis properties (-> automatic-blend-space-creation-in-unreal-engine) will appear under each Axis Function. Under **Horizontal Axis**, set the following properties:

- Set **Axis **to **Yaw**, which will analyze the selected Bone or Socket along its yaw (sideways) axis.

- Set **Bone/Socket** to your character's **weapon **or **prop Bone** that the weapon attaches to. In most cases this will be the weapon bone on the right hand.

- Set **Bone Facing Axis** to match the direction the weapon will be aimed when attached to the Bone. In most cases this will be **+X**.

- Set **Bone Right Axis** to match the right-facing direction of the weapon when attached to the Bone. In most cases this will be **+Y**.

 [image: aim offset horizontal axis properties]

Under Vertical Axis Function, set the following properties:

- Set **Axis **to **Pitch**, which will analyze the selected Bone or Socket along its pitch (up and down) axis.

- Set **Bone/Socket** to your character's **weapon **or **prop Bone** that the weapon attaches to. In most cases this will be the weapon bone on the right hand.

- Set **Bone Facing Axis** to match the direction the weapon will be aimed when attached to the Bone. In most cases this will be **+X**.

- Set **Bone Right Axis** to match the right-facing direction of the weapon when attached to the Bone. In most cases this will be **+Y**.

 [image: aim offset vertical axis properties]

You can now drag in your samples from the **Asset Browser**. Doing this will analyze and automatically position them within the blend graph. The graph will also automatically adjust its ranges and grid divisions based on the analysis.

 [image: add samples to analyze]

Press **Ctrl** and move your cursor in the graph to preview the results.

 [image: preview analysis results]

After analyzing your samples, you may need to adjust the axis ranges for your Blend Space so that they encompass your samples more accurately.

### Locomotion

This example will create a Blend Space that controls forward movement on the vertical axis, and sideways / strafing movement on the horizontal axis. We will assume you have already created a Blend Space Asset.

In the Blend Space Asset Details panel, locate both the **Horizontal Axis Function **and **Vertical Axis Function** properties and set them to **Locomotion**.

 [image: locomotion analysis]

Additional analysis properties will appear under each Axis Function. Under **Horizontal Axis**, set the following properties:

- Set **Axis **to **Rightward Speed**.

- Set **Bone/Socket 1** to one of your character's feet bones.

- Set **Bone/Socket 2** to the other foot bone.

 [image: locomotion analysis properties]

Under **Vertical Axis Function**, set the following properties:

- Set **Axis **to **Forward Speed**.

- Set **Bone/Socket 1** to one of your character's feet bones.

- Set **Bone/Socket 2** to the other foot bone.

 [image: locomotion analysis properties]

You can now drag in your samples from the Asset Browser. Doing this will analyze and automatically position them within the blend graph. The graph will also automatically adjust its ranges and grid divisions based on the analysis.

 [image: analyze locomotion samples]

You can also drag in additional samples, which will add them to the analysis array.

 [image: additional samples]

## Managing your Analysis

When tweaking your sample positions in the graph, you can click **Analyze all Samples** in the Asset Details panel to revert all samples back to their analyzed positions.

 [image: reset analysis]

### Post-Analysis Cleanup

Depending on your Blend Space complexity, you may see some resulting triangulation problems, indicated by red lines in the graph.

 [image: blend space analysis red error]

These can cause blending discontinuities when interpolating the Blend Space, and need adjustment. You can perform any of the following operations to resolve this:

- Moving existing samples, which can fix the triangulation problems, but may result in slightly inaccurate sample positions.

- Duplicating existing samples and placing them outside the current area so the perimeter is more convex (circular) shaped.

- Creating new samples that you can place in locations to remove the bad triangles.

#### Moving Example

In this example, two samples were placed almost on top of each other on the left of the graph, causing blending problems. The extra sample can be selected and moved to its desired position at the right side of the graph, since aiming distinguishes between +180 and -180 degrees.

 [image: move sample to fix analysis]

#### Duplication Example

In this example, a few perimeter samples will cause problems when using the Blend Space outside or near the edge of the region containing samples. You can move these samples to the outer edges of the graph where they will no longer generate long / thin triangles, then duplicate them by right-clicking on them and selecting **Duplicate**. This will place the duplicate at the analyzed position, while retaining the sample you just moved.

 [image: perimeter blend space fix analysis]

- animation

On this page

- Prerequisites (-> automatic-blend-space-creation-in-unreal-engine)
- Enabling Analysis (-> automatic-blend-space-creation-in-unreal-engine)
- Analysis Properties (-> automatic-blend-space-creation-in-unreal-engine)
- Analysis Examples (-> automatic-blend-space-creation-in-unreal-engine)
- Aim Offset (-> automatic-blend-space-creation-in-unreal-engine)
- Locomotion (-> automatic-blend-space-creation-in-unreal-engine)
- Managing your Analysis (-> automatic-blend-space-creation-in-unreal-engine)
- Post-Analysis Cleanup (-> automatic-blend-space-creation-in-unreal-engine)
- Moving Example (-> automatic-blend-space-creation-in-unreal-engine)
- Duplication Example (-> automatic-blend-space-creation-in-unreal-engine)

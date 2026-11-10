# Spline Rigging

https://dev.epicgames.com/documentation/en-us/unreal-engine/control-rig-spline-rigging-in-unreal-engine?application_version=5.9

> Utilize Splines in your Control Rig to achieve easier procedural animation on long joint chains.

[image: Spline Rigging]

Splines can be built and used in Control Rig in order to create dynamic and procedural motion regardless of skeletal hierarchy. With splines, you can create more complex poses with fewer necessary controls on limbs such as tentacles, spines, and snakes.

This document provides an overview of how to create and use splines in your rig.

#### Prerequisites

- You have created a Control Rig Asset for a Skeletal Mesh that has a suitable joint structure for splines, such as a tail. See the **Control Rig Quick Start (-> how-to-create-control-rigs-in-unreal-engine)** page for information on how to do this.

- You are familiar with how to create and position **Controls (-> controls-bones-and-nulls-in-control-rig-in-unreal-engine)**.

## Create Spline

Spline creation in Control Rig is done by specifying arbitrary translation points, which are used to construct the spline. In typical setups, these points are based on the transform information from **Controls**.

To start, create a **Spline From Points** node by right-clicking in the rig graph and selecting **Spline From Points**.

 [image: spline from points]

Next, create rig elements which are used to define the points in the spline. In this example, four controls are created and evenly distributed along the length of the tentacle. The number of controls does not need to correspond to the number of bones in the chain.

 [image: create spline controls]

Next, reference your root rig element into the rig graph, and click the **Add (+)** button on the **Spline From Points** node to add the first spline point in the array. Expand the **Transform **pin on your element reference and connect the **Translation **pin to the input on the **Points **pin.

 [image: control rig spline points]

Continue to add additional spline points for all the rig elements you want to use to form the spline. You must ensure that the order in which you connect them to the **Spline From Points** node corresponds to the direction of the spline.

 [image: control rig spline points]

Splines in Control Rig require a minimum of four points in order to create the spline successfully.

You can now preview your spline by using the **Draw Spline** node, which provides a visual display for the spline. Create this node by right-clicking in the graph and selecting **Draw Spline**, then connect the **Spline **pin from **Spline From Points**, and the **Execute **event from **Forwards Solve**. Manipulating your controls in the viewport will preview the spline behavior.

 [image: control rig spline preview]

### Apply Spline to Bones

Once the spline has been created, you can apply it to your joint chain.

First, create a **Fit Chain on Spline Curve** node by right-clicking in the graph and selecting **Fit Chain on Spline Curve**.

 [image: fit chain on spline curve]

Next, multi-select the bones you want to include in the spline from the **Rig Hierarchy** panel, drag them into the Rig Graph, and select **Create Item Array**. For this operation, selection order is important to ensure the resulting bone array matches the same order as the spline points.

 [image: spline bone array]

Lastly, connect the **Rig Element** array to the **Items **pin, the **Spline **pin from **Spline From Points**, and ensure the **Execute **event is connected to your Control Rig logic chain.

 [image: control rig spline bones]

Your spline should now affect the bone chain.

 [image: control rig spline]

## Spline Properties

The following properties are available on the **Spline From Points** node.

 [image: spline from points]

| Name | Description |
| --- | --- |
| **Points** | The position information that will be used to construct the spline. Can be either an array or built using individual translation pins by clicking the **Add (+)** button. |
| **Spline Mode** | The type of spline to use. You can choose from either: **Hermite**, which will ensure the Spline passes through all defined **Points**. [image: hermite spline type] **BSpline**, which is a smoother spline and will only pass through the start and end points. This is based on the **TinySpline** library. [image: bspline type] |
| **Samples Per Segment** | This property controls the approximation accuracy of the spline. Higher numbers will cause the spline to be more accurate and smooth. Lower numbers will cause the spline to appear more jagged and incorrect. Performance costs increase with the sample count, so it is a good idea to ensure this number is not set too high. |
| **Compression** | The amount the spline should compress when reducing its length. |
| **Stretch** | The amount the spline should stretch when increasing its length. |
| **Spline (Output)** | The resulting spline from this node. |

The following properties are available on the **Fit Chain on Spline Curve** node.

 [image: fit chain on spline curve]

| Name | Description |
| --- | --- |
| **Items** | An array of rig elements to align to the provided **Spline**. |
| **Spline** | The **Spline** curve to align to. |
| **Alignment** | Whether or not to stretch the aligned elements to the full spline length. **Stretched** will cause the full amount of stretching to occur. [image: spline stretched alignment] **Front** will disable stretching. [image: spline front alignment] |
| **Minimum** | The Minimum **U** value to use on the curve. **U** is the normalized (0 - 1) percentage between all combined control points. |
| **Maximum** | The Maximum **U** value to use on the curve. **U** is the normalized (0 - 1) percentage between all combined control points. |
| **Sampling Precision** | This property controls the approximation accuracy of the spline. Higher numbers will cause the spline to be more accurate and smooth. Lower numbers will cause the spline to appear more jagged and incorrect. This overwrites the **Samples Per Segment** property from **Spline From Points**. Performance costs increase with the sample count, so it is a good idea to ensure this number is not set too high. |
| **Primary Axis** | The major axis being aligned in the chain. In simple setups this property can be ignored, but typically you will want to set this to be the direction your item chain is progressing in. [image: spline primary axis] |
| **Secondary Axis** | The minor or "up" axis being aligned in the chain. In simple setups this property can be ignored, but typically you will want to set this to be in the direction of a pole vector if it is being used. [image: spline secondary axis] |
| **Pole Vector Position** | The position of an optional pole vector control. This only has an effect if the **Secondary Axis** is set. |
| **Rotations** | An array of rotations to apply additively to the overall spline. |
| **Rotation Ease Type** | The easing type to use between each rotation element. |
| **Weight** | The factor to apply the elements to the curve. |
| **Propagate to Children** | Whether or not the changes in the rig elements should apply recursively to all children. |

## Spline Nodes

The following Spline nodes are available for use in your Control Rig Graph:

| Name | Image | Description |
| --- | --- | --- |
| **Closest Parameter From Spline** | [image: closest parameter from spline] | Retrieves the closest **U** value from a given spline and position. |
| **Draw Spline** | [image: draw spline] | Displays the spline curve in the viewport for preview purposes. Includes properties for controlling the **Color**, **Thickness**, and sample **Detail**. |
| **Fit Chain on Spline Curve** | [image: fit chain on spline curve] | Fits a given spline along an array of items. This node typically is used when performing backwards solves that include splines. |
| **Fit Spline Curve on Chain** | [image: fit spline curve on chain] | Applies a chain of rig elements to a spline. |
| **Get Length Of Spline** | [image: get length of spline] | Gets the length of a spline. |
| **Parameter At Length Percentage** | [image: parameter at length percentage] | Returns the **U** value of a spline given a length percentage. |
| **Position From Spline** | [image: position from spline] | Returns the position along a spline given the **U** value. |
| **Set Spline Points** | [image: set spline points] | Sets the currently existing points of a spline to new values, then outputs the resulting new spline. |
| **Spline From Points** | [image: spline from points] | Builds a spline from an array of translation points. |
| **Tangent From Spline** | [image: tangent from spline] | Returns the tangent angle of a point along the spline defined by **U**. |
| **Transform From Spline** | [image: transform from spline] | Returns a transform from a given **Spline** and **U** value based on the given **Up** and **Roll**. |

- animation
- control rig
- spline
- rigging

On this page

- Prerequisites (-> control-rig-spline-rigging-in-unreal-engine)
- Create Spline (-> control-rig-spline-rigging-in-unreal-engine)
- Apply Spline to Bones (-> control-rig-spline-rigging-in-unreal-engine)
- Spline Properties (-> control-rig-spline-rigging-in-unreal-engine)
- Spline Nodes (-> control-rig-spline-rigging-in-unreal-engine)

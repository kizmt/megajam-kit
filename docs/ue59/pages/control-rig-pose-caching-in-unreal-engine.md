# Pose Caching

https://dev.epicgames.com/documentation/en-us/unreal-engine/control-rig-pose-caching-in-unreal-engine?application_version=5.9

> Save bone poses and states to reference in your Control Rig graph.

[image: Pose Caching]

The Pose Caching feature in Control Rig is used to save and apply animation poses at different times in the control rig graph. Any **Rig Element (-> controls-bones-and-nulls-in-control-rig-in-unreal-engine)** can be cached into a pose and different properties can be accessed within the rig graph, such as curve values or transforms.

This document provides an overview of the Pose Caching feature, and how to store and apply poses.

#### Prerequisites

- You have created a Control Rig Asset for a character. See the **Control Rig Quick Start (-> how-to-create-control-rigs-in-unreal-engine)** page for information on how to do this.

## Quickstart

The following is a quick guide showing how to store and retrieve a pose.

### Storing Poses

Poses are stored as variables within Control Rig's **My Blueprint** panel. To create a new pose variable, click the **Add (+)** button on the **Variables **category and set the variable type to **Rig Pose**.

 [image: rig pose variable]

Next, reference the variable within the Rig Graph as a **Set **operation by dragging the variable into the graph and selecting **Set**.

 [image: rig pose reference]

Then, create a **Get Pose Cache** node by right-clicking in the graph and selecting **Get Pose Cache**. Connect the **Pose **and **Value **pins.

 [image: gest pose cache]

Lastly, connect the Set node to an event. In this example, you can connect it to the **Setup Event (-> control-rig-forwards-solve-and-backwards-solve-in-unreal-engine)**, which will store the character's initial A-Pose.

 [image: store control rig pose]

### Applying Poses

Poses are applied by using the **Apply Pose Cache **node, which reads from your Rig Pose variable.

To start, reference the Rig Pose variable in the graph as a **Get **operation by dragging the variable into the graph and selecting **Get**.

 [image: rig pose reference]

Then, create an **Apply Pose Cache** node by right-clicking in the graph and selecting **Apply Pose Cache**. Connect the **Pose **and **Value **pins. Also connect it to an event so you can preview its evaluation, like the **Forwards Solve (-> control-rig-forwards-solve-and-backwards-solve-in-unreal-engine)** event.

 [image: apply pose cache]

Since you are applying the entire pose, you can preview the pose effect by editing the **Weight **value. For this example, you can also use a Preview Controller from the **Preview Scene Settings (-> control-rig-editor-in-unreal-engine)** in order to better see the pose application.

 [image: apply pose]

## Pose Cache Nodes

The following pose cache nodes are available for use in your Control Rig Graph:

| Name | Image | Description |
| --- | --- | --- |
| **Apply Pose Cache** | [image: apply pose cache] | Applies a saved pose. Includes properties for setting rig elements, the transform space, items to set, and weight. |
| **For Each Pose Cache Element** | [image: for each pose cache element] | This node executes iteratively across all items from a given pose. |
| **Get Pose Cache** | [image: get pose cache] | Saves a pose based on the input of **Items to Get** and rig element types. If no items are specified, then all items will be used. |
| **Get Pose Cache Curve** | [image: get pose cache curve] | Gets a single **Animation Curve (-> animation-curves-in-unreal-engine)** from a saved pose. |
| **Get Pose Cache Delta** | [image: get pose cache delta] | Compares two poses and outputs a comparison check boolean. |
| **Get Pose Cache Items** | [image: get pose cache items] | Returns rig elements in an item array. |
| **Get Pose Cache Transform** | [image: get pose cache transform] | Gets the transform or Animation Curve value from a single rig element in a pose. |
| **Get Pose Cache Transform Array** | [image: get pose cache transform array] | Gets the transforms of all items in a pose and returns them as a transform array. |
| **Is Pose Cache Empty** | [image: is pose cache empty] | Checks if a pose is empty or not. |
| **Draw Pose Cache** | [image: draw pose cache] | Draws axis debug information on the saved pose in the viewport. It will only draw the elements saved in a pose. [image: draw pose cache] |

Most nodes related to pose caching contain the following common properties:

 [image: apply pose cache]

| Name | Description |
| --- | --- |
| **Element Type** | The Rig Elements to filter for when saving poses. You can choose from the following elements: **Bones** **Nulls** **Controls** **Curves** **All** |
| **Space** | The transform space that the pose information should be stored and applied in. Can either be **Local** or **Global** space. |
| **Items to Set** | An array of rig elements to include when saving the pose. If nothing is set here, then all elements will be included according to the **Element Type** specified. |

## Workflow Examples

By using array building nodes, like **Get Children**, you can get just a subsection of rig elements to save into a pose. This is useful if you want to only save and apply the pose to certain elements.

 [image: apply pose partial]

Execution nodes like **Branch **can be used to save poses at specific times or states.

 [image: branch set pose]

- animation
- control rig
- pose caching

On this page

- Prerequisites (-> control-rig-pose-caching-in-unreal-engine)
- Quickstart (-> control-rig-pose-caching-in-unreal-engine)
- Storing Poses (-> control-rig-pose-caching-in-unreal-engine)
- Applying Poses (-> control-rig-pose-caching-in-unreal-engine)
- Pose Cache Nodes (-> control-rig-pose-caching-in-unreal-engine)
- Workflow Examples (-> control-rig-pose-caching-in-unreal-engine)

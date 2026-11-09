# Edit Tools User Guide

https://dev.epicgames.com/documentation/en-us/unreal-engine/edit-tools-user-guide-in-unreal-engine?application_version=5.9

> Overview of the Edit Panel included with the Fracture Mode.

[image: Edit Tools User Guide]

You can find similar information in video format in the Epic Developer Community site by watching the Fracture and Clustering tutorials.

The **Fracture Mode** comes with editing tools that provide the ability to remove unwanted bones (fractured pieces) from the Geometry Collection hierarchy, as well as hide and unhide specific bones. These tools present a workflow improvement when working with complex fracturing of Geometry Collections.

In this guide you will learn how to use the available tools in the **Edit** panel.

Before learning about the Edit Tools, you should know how to create Geometry Collections and fracture them. If you are not familiar with the process, refer to the Geometry Collections User Guide (-> chaos-destruction-key-concepts-in-unreal-engine) and the Fracturing User Guide (-> fracturing-geometry-collections-user-guide).

## Fracture a Geometry Collection

In this section, you will create and fracture a Geometry Collection so you can learn about the Edit tools included with the **Fracture Mode**.

- Create a Geometry Collection from a Static Mesh Actor in your Level. [image: Create a Geometry Collection from a Static Mesh Actor in your Level]

- Fracture the Geometry Collection by using one of the available methods included. In the example below, we used the **Slice** tool to fracture the Geometry Collection into 8 pieces. Click the image for full size.

## Use the Edit Tools

### The Prune tool

The **Prune** tool is used to remove any selected bones (fractured pieces) from the fracture hierarchy.

Select one or more bones in the viewport or the hierarchy.

Click the image for full size.

Click **Prune** to remove selected bones.

 [image: Click Prune to remove the selected bones]

This tool is commonly used to remove intersecting geometry or unwanted Bones after fracturing the Geometry Collection.

 [image: The selected bone has been removed]

## The Visibility tools

The **Visibility** tools are used to temporarily hide selected bones from the viewport. This can be useful when trying to focus on a specific set of Bones in the hierarchy.

Click **Hide** in the **Edit** category to hide all selected Bones.

 [image: Click Hide in the Edit category to hide all selected Bones]
 [image: Showing all bones]

 [image: Hiding the selected bones]

To show the hidden Bones, select them in the **Fracture Hierarchy** and click **Unhide**.

 [image: Select the Bones in the Fracture Hierarchy]
 [image: Click Unhide to show the Bones in the viewport]

- physics
- chaos
- destruction

On this page

- Fracture a Geometry Collection (-> edit-tools-user-guide-in-unreal-engine)
- Use the Edit Tools (-> edit-tools-user-guide-in-unreal-engine)
- The Prune tool (-> edit-tools-user-guide-in-unreal-engine)
- The Visibility tools (-> edit-tools-user-guide-in-unreal-engine)

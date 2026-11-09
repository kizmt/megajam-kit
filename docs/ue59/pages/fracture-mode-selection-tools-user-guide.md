# Fracture Mode Selection Tools User Guide

https://dev.epicgames.com/documentation/en-us/unreal-engine/fracture-mode-selection-tools-user-guide?application_version=5.9

> Overview of the various selection tools included in the Fracture Mode.

[image: Fracture Mode Selection Tools User Guide]

You can find similar information in video format in the Epic Developer Community site by watching the Using the selection tools tutorial.

The **Fracture Mode** is a Level Editor Mode (-> level-editor-modes-in-unreal-engine) that contains a variety of tools, including ones used by the Chaos Destruction System for creating, fracturing, and manipulating **Geometry Collections**, the asset type for simulating real-time fracturing in Unreal Engine.

In this guide you will learn to use the various selection tools available in the Fracture Mode. These tools provide useful ways of selecting specific fractured pieces (also called Bones) in the Geometry Collection that can be further fractured or clustered.

Before learning about the Fracture Mode, you should know how to create Geometry Collections from Actors in the Level. If you are not familiar with the process, refer to the Geometry Collections User Guide (-> geometry-collections-user-guide).

## Fracture a Geometry Collection

In this section, you will create and fracture a Geometry Collection so you can learn about the selection tools included with the **Fracture Mode**.

- Create a Geometry Collection from a Static Mesh Actor in your Level. [image: Create a Geometry Collection from a Static Mesh Actor in your Level]

- With your Geometry Collection selected, go to the **Fracture** section and select one of the fracturing tools available. Go to the **Fracture** panel and click **Fracture**. You can fracture the Geometry Collection multiple times by using the same fracturing tool, or selecting a different one each time you click Fracture. [image: Go to the Fracture panel and click Fracture]

- The example below used the **Slice** and **Uniform Voronoi** fracture tools to fracture the Geometry Collection. [image: The example below used the Slice and Uniform Voronoi fracture tools to fracture the Geometry Collection] [image: The Geometry Collection is fractured]

Refer to the Fracturing Geometry Collections User Guide (-> fracturing-geometry-collections-user-guide) to learn more about fracturing Geometry Collections.

## Use the Selection Tools

The fracture hierarchy of a Geometry Collection resembles a tree structure. It contains a root bone (Level 0) with one or more child bones (Levels 1). Each child bone can, in turn, contain its own children (Level 2 and 3).

 [image: A 4 level fracture hierarchy]

When in **Fracture Mode**, you can use the **selection tools** to select the bones of a Geometry Collection directly.

You will find the selection tools in the **Select** section with the following options:

 [image: Selection Tools]

| Name | Description |
| --- | --- |
| **All** | Selects all the bones in the Geometry Collection. |
| **Invert** | Inverts the current selection of bones in the Geometry Collection. |
| **None** | Deselects all bones in the Geometry Collection. |
| **Parent** | Selects the parent bone of the current bone selection. |
| **Children** | Selects all the child bones of the current bone selection. |
| **Siblings** | Selects all bones that contain the same parent as the currently selected bone. |
| **Level** | Selects all bones in the same level of the hierarchy. |
| **Contact** | Selects all bones that are adjacent to any currently selected bones. |
| **Interactive** | Enables an interactive selection mode where you can use marquee selection and filtering to select a desired number of bones in the Geometry Collection. |

You can select multiple bones (fractured pieces) in the Geometry Collection by pressing **CTRL** and clicking them directly in the viewport.

### Select All Nodes

Click the **All** button to select all the bones in the Geometry Collection. This includes all the bones of each level in the hierarchy.

 [image: Click the All button to select all the bones in the Geometry Collection]

### Invert Your Selection

Use the selection tools, or CTRL+click, to select any individual bones of the fracture mesh. Then, click the **Invert** button to invert your selection.

 [image: Click the Inverse button to invert your selection]

### Deselect All Bones

Click the **None** button to deselect all bones in the Geometry Collection.

 [image: Click the None button to deselect all bones]

### Select the Parent Bones

Select a bone that is the child of another bone in the Geometry Collection. Click **Parent** to select the immediate parent bone to the selected child bone in the hierarchy.

 [image: Click the Parent button to select that bone's parent bone]

In the example below, selecting the child bone 87 and then clicking Parent selects the parent of it, Bone 12.

 [image: The parent bone is selected in the hierarchy]

### Select the Child Bones

Select a parent bone and click **Children** to select all child bones of the selected parent bone.

In the example below, all children of Bone 12 are selected.

 [image: All the child bones are selected in the hierarchy]

### Select the Sibling Bones

Select a bone in the Geometry Collection. Click **Sibling** to select all the bones that share the same parent as the selected bone(s).

 [image: Click the Sibling button to select all bones that share the same parent]

In the example below, Bone 87 is selected. When Sibling is clicked, all children of Bone 12 are selected because they share that same parent bone.

 [image: All bones that share the same parent are selected in the hierarchy]

### Select All Bones at the Same Hierarchy Level

Select a bone in the Geometry Collection. Click **Level** to select all bones in the same level of the hierarchy.

 [image: Click the Level button to select all bones in the same level of the hierarchy]

In the example below, the Geometry Collection contains several bones that are the same hierarchy level in their fracture tree. With Bone 5 selected, when Level is clicked in the selection tools, all other Bones at that same hierarchy level will be selected, like Bones 6, 7 and 8.

 [image: All bones at the same level are selected in the hierarchy]

### Contact Selection of Bones

Click **Contact** to select all bones that are adjacent to the currently selected bones in the Geometry Collection.

 [image: Click the Contact button to select all bones that are adjacent to the currently selected bones]

### Interactive Selection of Bones

Click **Interactive** to enter a marquee selection mode. Left-click and drag the mouse in the viewport to select multiple bones. You can hold the CTRL key and drag the mouse to remove bones from the selection.

The interactive selection mode has the following options:

 [image: Interactive selection mode options]

| Option | Description |
| --- | --- |
| **Mouse Selection Method** | Determines the bone selection method. **Rect Select** uses a rectangular marquee for selecting all overlapping bones. **Standard Select** allows bone selection by left-clicking the mouse on each bone to select them directly. |
| **Volume Selection Method** | Determines the method used to calculate the bones selected by the filter operation. |
| **Selection Operation** | Determines whether the filter operation will **replace**, **add**, or **remove** from the current selection. |
| **Min Volume Fracture** | Determines the minimum bone volume considered for selection. |
| **Max Volume Fracture** | Determines the maximum bone volume considered for selection. |

You can filter your selection by bone size by using the **Filter Settings**. Increasing **Max Volume Fracture** to **1** will include all bone sizes in the filter operation.

Click the image for full size.

Use **Min Volume Fracture** to filter out the smallest bones. Do this until you reach a desired selection. A common example is excluding the smallest bones from the selection so you can add an additional fracture level to the biggest bones.

 [image: You can start filtering out the smallest bones by increasing the value of the Min Volume Fracture]

- physics
- chaos
- destruction

On this page

- Fracture a Geometry Collection (-> fracture-mode-selection-tools-user-guide)
- Use the Selection Tools (-> fracture-mode-selection-tools-user-guide)
- Select All Nodes (-> fracture-mode-selection-tools-user-guide)
- Invert Your Selection (-> fracture-mode-selection-tools-user-guide)
- Deselect All Bones (-> fracture-mode-selection-tools-user-guide)
- Select the Parent Bones (-> fracture-mode-selection-tools-user-guide)
- Select the Child Bones (-> fracture-mode-selection-tools-user-guide)
- Select the Sibling Bones (-> fracture-mode-selection-tools-user-guide)
- Select All Bones at the Same Hierarchy Level (-> fracture-mode-selection-tools-user-guide)
- Contact Selection of Bones (-> fracture-mode-selection-tools-user-guide)
- Interactive Selection of Bones (-> fracture-mode-selection-tools-user-guide)

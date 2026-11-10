# Understanding PolyGroups

https://dev.epicgames.com/documentation/en-us/unreal-engine/understanding-polygroups-in-unreal-engine?application_version=5.9

> Learn the use of PolyGroups and how to create them.

[image: Understanding PolyGroups]

Learn to use this **Beta** feature, but use caution when shipping with it.

The Modeling Mode Overview (-> modeling-mode-in-unreal-engine), introduces you to **PolyGroups**, and the Quick Start (-> modeling-mode-quick-start-in-unreal-engine) guide shows you how to use some of the tools for assigning PolyGroups. We recommend reviewing these two documents before continuing.

This guide further explores the tools for creating PolyGroups and how you can use these groups in other tools and scripts. The goal at the end of this guide is to understand PolyGroups to build an efficient workflow for creating and editing your geometry in-engine.

## The Why and What of PolyGroups

### Why

In traditional modeling software, you have the option of polygonal modeling. However, Unreal Engine renders all models as triangulated meshes.

|  |  |
| --- | --- |
| [image: Quad modeling in Autodesk Maya] | [image: Triangle based rendering in Unreal Engine] |
| A quad based cube in Maya. | The same cube rendered as triangles in Unreal Engine. |

The conversion to triangles means Unreal Engine does not natively recognize quads or n-gons, making triangles the foundation on which in-engine modeling is built. To provide an approximation to the traditional modeling workflow, you can use **PolyGroups**.

### What

PolyGroups are a set of grouped triangles. You can use the groups for:

- UV layout
- Material organization
- Modeling and deformation
- Traditional box modeling with quads
- Creating and editing skin weights

For example, using the cube imported from Maya, we assign a separate PolyGroup to each triangle using the **Tri Select** tool under the **Mesh** category.

To visualize the PolyGroups on the mesh, set **Face Color Mode** to **By Group**.

With PolyGroups set, you can use the PolyGroup Edit (-> polygroup-edit-tool-in-unreal-engine) tool under the **Model** category. However, the current PolyGroups each represent a single triangle, which isn't the best use of the PolyGroup Edit tool.

[image: Creating PolyGroups in Unreal Engine] PolyGroups consisting of one triangle, where each color indicates a PolyGroup.

When you merge two triangles into one PolyGroup, you have the representation of a quad.

In the video, using **Merge** creates a new PolyGroup consisting of two triangles.

When working with low-polygon meshes and blockouts, PolyGroups provide a way to interact with more intuitive surfaces than raw triangles. However, you can also apply PolyGroups to high-polygon meshes to help manipulate chunks of complex geometry, which otherwise would be complicated to edit.

## PolyGroup Anatomy

A PolyGroup consists of three elements which you can select and edit:

- Face: The area of a PolyGroup.
- Vertex: Connecting point of edges. Also known as a corner.
- Edge: The border between PolyGroups.

As you group triangles to create a PolyGroup, a boundary edge forms, encompassing the triangles. Depending on the topology of your mesh and generated PolyGroups, editing the edges of your mesh may not work as you expect compared to other modeling Digital Content Creation (DCC) software.

In the image below the mesh includes two PolyGroups, represented by the highlighted boundary edge. Although the boundary of the PolyGroups appears to have multiple edges due to the bending shape, it does not consist of any PolyGroup vertices, and consists of only one PolyGroup edge.

[image: PolyGroup Boundary Edge]

PolyGroup edges and vertices are generated under the following conditions:

- Two or more connecting PolyGroup faces (or a mesh boundary) create a PolyGroup edge.
- Three or more connecting PolyGroup edges create a PolyGroup vertex.

## Creating PolyGroups

To better understand PolyGroups, it helps to know the tools you can use to create them. The order in which you use these tools depends on your preferred workflow and needs. The important thing to remember is you can use any set of triangles as a PolyGroup.

### Triangle Selection Tool

As shown in the video above, the **Tri Select** tool can assign a PolyGroup to one or more triangles. Instead of selecting one triangle per PolyGroup, we now select two in order to perform quad editing with the **PolyGroup Edit** tool.

In the video, new PolyGroups are created at the intersection of each edge loop.

Triangles not assigned a PolyGroup are automatically grouped into one.

### Merge

When using the **PolyGroup Edit** tool, you can continue combining existing PolyGroups into a new group.

The process of combining existing PolyGroups is destructive, meaning the prior PolyGroups will no longer exist.

In the video each face represents a PolyGroup, and you can group faces using Merge.

### Paint PolyGroups Tool

There are dedicated tools for creating PolyGroups, and one is the Paint PolyGroups (-> paint-polygroups-tool-in-unreal-engine) tool, where you can interactively paint your groupings.

In the video the Paint PolyGroup tool creates new PolyGroups consisting of two triangles. **Show Wireframe** is enabled to visualize the two triangles in each PolyGroup.

You can use the **Action** setting to choose any of the following selection modes:

- **Brush**
- **Fill**
- **Group Fill**
- **Lasso**

To see what PolyGroup is assigned, hover over said PolyGroup and use the hotkey **Shit + G**. The **Set Group** row will update to the associated number.

### Generate PolyGroups Tool

Another dedicated tool for grouping triangles is the Generate PolyGroups (-> generate-polygroups-tool-in-unreal-engine) tool. PolyGroups are automatically assigned upon opening the tool. How the PolyGroups are assigned is determined by the **Conversion Mode**.

| Conversion Mode | Description |
| --- | --- |
| **Face Normal Deviation** | Convert based on Angle Tolerance between face normals. |
| **Find Quads** | Create PolyGroups by merging triangle pairs into quads. |
| **From UV Islands** | Create PolyGroups based on UV islands. |
| **From Hard Normal Seams** | Create PolyGroups based on hard normal seams. |
| **From Connected Tris** | Create PolyGroups based on connected triangles. |
| **Furthest Point Sampling** | Create PolyGroups centered on well-spaced sample points, approximating a surface Voronoi diagram. |
| **Copy From Layer** | Copy from existing PolyGroup layer. |

[image: Generate PolyGroups in Unreal Engine] PolyGroups are generated by quads (merging triangle pairs).

You can use the **Output Layer** to create a new PolyGroup layer.

### Predefined Shapes

When creating predefined shapes in the **Create** category, you can configure the PolyGroups of your new meshes using the **PolyGroup Mode** setting.

[image: Creating PolyGroups for Quad Modeling in Unreal Engine]

The Polygroup Mode has the following grouping options:

|  |  |  |
| --- | --- | --- |
| [image: Generate PolyGroups per Shape] | [image: Generate PolyGroups per Face] | [image: Generate PolyGroups per Quad] |
| **Per Shape** | **Per Face** | **Per Quad** |
| Outputs the entire mesh as a single group. | Automatically divide the mesh into recognizable face groups. | Automatically divide the mesh into a group for each quad. |

### PolyGroup Layers

Because PolyGroups are arbitrary, you can create multiple **PolyGroup Layers** to handle different sets of them on the same model. You can configure these layers in the Edit Attributes (-> edit-attributes-tool-in-unreal-engine) tool of the **Attributes** category.

PolyGroup Layers are not universal to your project. Instead, you create them for individual static mesh assets. This particular assignment means that you cannot assume that two different meshes have the same PolyGroup layers. However, it also means that you can define them as needed on a case-by-case basis.

## Using PolyGroups

### Building shapes

The fundamental use of PolyGroups is geometry editing, as shown with the **PolyGroup Edit** tool.

Additional ways in which PolyGroups help with constructing a mesh include:

- Precise region edits.Four PolyGroups are merged into one for extrusion.
- Hole creation.
- Smoothing a mesh with the Subdivide (-> subdivide-tool-in-unreal-engine) tool.[image: Subdividing a model in Unreal Engine] Click image to expand.
- Creating deformations with the Deform PolyGroups (-> deform-polygroups-tool-in-unreal-engine) tool.

Interior vertices of a PolyGroup are not selectable, only bordering vertices. To select the interior vertices, use **Decompose** to deconstruct the PolyGroup.

### Creating UVs

You can use PolyGroups to assist in creating UVs for your model. In the Modeling Mode Quick Start (-> modeling-mode-quick-start-in-unreal-engine) guide, six PolyGroups are assigned to the crate (one per side). Then UV islands are generated based on the existing PolyGroups.

[image: Using PolyGroups to UV Unwrap in Unreal Engine]

You can then use the UV tools to deconstruct the UVs further or you can add more PolyGroups.

[image: Assigning Additional PolyGroups to UV Unwrap in Unreal Engine] Additional PolyGroups are assigned to indicate an UV island.

Now when you unwrap your model, more UV islands are created.

[image: Using PolyGroups to UV Unwrap in Unreal Engine]

To learn more about the UV tools, refer to the UVs Category documentation.

### Assigning Multiple Materials to One Mesh

You can assign multiple Materials to your geometry using the **Edit Materials** tool. To help visualize what triangles you want to assign the Material, you can select PolyGroups from the **Face Color Mode**, which is especially helpful for high-density meshes.

## Frequently Asked Questions

**Is there a way to clear all PolyGroups to start over?**

Yes, by using the **Clear All** option in the **Paint PolyGroups** tool.

**Does it matter if I have PolyGroups consisting of one triangle?**

Although you can still edit your mesh using tools such as **PolyGroup Edit**, it may yield unexpected results. For example, when adding an edge loop to a mesh where the top side has two PolyGroups containing one triangle, the loop will slant to the side. If there is one PolyGroup grouping the two triangles (representing a quad), then the loop would continue straight across.

|  |  |
| --- | --- |
| [image: Distorted Edge Loop in Unreal Engine] | [image: Corrected Edge Loop in Unreal Engine] |
| Distorted Edge Loop | Corrected Edge Loop |

**Does creating PolyGroups interfere with rendering?**

No, PolyGroups are just a tool to help perform classic modeling techniques you may be used to in other modeling software. At render time, triangles are still used.

- animation
- landscape
- modeling
- geometry
- beta
- modeling tools

On this page

- The Why and What of PolyGroups (-> understanding-polygroups-in-unreal-engine)
- Why (-> understanding-polygroups-in-unreal-engine)
- What (-> understanding-polygroups-in-unreal-engine)
- PolyGroup Anatomy (-> understanding-polygroups-in-unreal-engine)
- Creating PolyGroups (-> understanding-polygroups-in-unreal-engine)
- Triangle Selection Tool (-> understanding-polygroups-in-unreal-engine)
- Merge (-> understanding-polygroups-in-unreal-engine)
- Paint PolyGroups Tool (-> understanding-polygroups-in-unreal-engine)
- Generate PolyGroups Tool (-> understanding-polygroups-in-unreal-engine)
- Predefined Shapes (-> understanding-polygroups-in-unreal-engine)
- PolyGroup Layers (-> understanding-polygroups-in-unreal-engine)
- Using PolyGroups (-> understanding-polygroups-in-unreal-engine)
- Building shapes (-> understanding-polygroups-in-unreal-engine)
- Creating UVs (-> understanding-polygroups-in-unreal-engine)
- Assigning Multiple Materials to One Mesh (-> understanding-polygroups-in-unreal-engine)
- Frequently Asked Questions (-> understanding-polygroups-in-unreal-engine)

Related documents

Modeling Mode Quick Start

 [image: Modeling Mode Quick Start] (-> modeling-mode-quick-start-in-unreal-engine)Modeling Mode Overview

 [image: Modeling Mode Overview] (-> modeling-mode-in-unreal-engine)

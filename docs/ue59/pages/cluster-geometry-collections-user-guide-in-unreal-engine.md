# Cluster Geometry Collections User Guide

https://dev.epicgames.com/documentation/en-us/unreal-engine/cluster-geometry-collections-user-guide-in-unreal-engine?application_version=5.9

> Overview of the various methods of clustering Geometry Collections.

[image: Cluster Geometry Collections User Guide]

You can find similar information in video format in the Developer Community site by watching the Fracture and Clustering tutorials.

**Fracture Mode** is a Level Editor Mode (-> level-editor-modes-in-unreal-engine) that contains a variety of tools, including those used by the **Chaos Destruction System** for creating, fracturing, and manipulating **Geometry Collections**, the asset type for simulating real-time fracturing in Unreal Engine.

When you fracture a Geometry Collection, a new **fracture level** is created. This is reflected in the Geometry Collection's **Fracture Hierarchy** window.

 [image: When you fracture a Geometry Collection, a new fracture level is created]

You can also see a summary of the fracture levels in the **Level Statistics** panel.

 [image: Level Statistics panel]

Each fracture level in the hierarchy represents a **cluster of bones** (fractured pieces) for the Geometry Collection. In other words, all the bones grouped in the same level will be treated as a group when it comes to the fracture simulation.

Clustering helps reduce the performance impact of the simulation as the system has less collisions to calculate at the same time. During the simulation, the higher level clusters will break first, followed by the lower ones. In the example above, Level 1 (20 pieces) will break first, followed by Level 2 (87), and so on.

Clustering can create a more realistic destruction simulation as most objects in the real world fracture into larger pieces when strain is first applied. Clustering can also be used to give your destructible object different artistics looks by applying different fracture patterns to your Geometry Collection.

You can enable or disable Clustering during the simulation by selecting your Geometry Collection and referring to the **Details** panel. Scroll down to the **Clustering** section and toggle the **Enable Clustering** checkbox.

 [image: Scroll down to the Clustering section and toggle the Enable Clustering checkbox]
 [image: Clustering enabled]
 [image: Clustering disabled]

Fracture Mode has a variety of tools to adjust the bone clusters in your Geometry Collection. This gives you more control over the performance and aesthetics of the simulation.

In this guide you will learn how to use the available clustering tools.

Before learning about the clustering tools, you should know how to create Geometry Collections and fracture them. If you are not familiar with the process, refer to the Geometry Collections User Guide (-> geometry-collections-user-guide) and the Fracturing User Guide (-> fracturing-geometry-collections-user-guide).

## The Cluster Tools

In this section you will learn how to use the available clustering tools in the Fracture Mode.

### Auto Cluster

 [image: The Auto cluster tool selected]

The **Auto** cluster tool creates bone clusters by using a specified number of **Cluster Sites**. This gives you precise control of how many clusters are created when the cluster operation is applied to the Geometry Collection. You can also specify whether bones grouped together should connect by enabling the **Enforce Cluster Connectivity** checkbox.

 [image: The Auto cluster tool creates bone clusters by using a specified number of Cluster Sites]

The tool is branch-based, meaning that it creates a cluster based on the current number of bones selected in the **Fracture Hierarchy**.

In the example below, the **Uniform Voronoi** fracture tool was used to create **500** sites.

 [image: Geometry Collection fractured into 500 sites]

You can see the hierarchy in the Level Statistics panel or the Fracture Hierarchy window.

 [image: Level Statistics panel]

Select the **Auto** cluster tool and enter **200 Cluster Sites**.

 [image: Select the Auto cluster tool and enter 200 Cluster Sites]

Click **Auto Cluster** button to see the results.

 [image: Click Auto Cluster to see the results]

Now you can see the result.

 [image: Level 1 now has 200 bones]

Repeat this process and add an additional 100, 50, and 15 Cluster Sites.

 [image: The new hierarchy reflects the clusters you created]

As you can see, you can create as many fracture levels (clusters) as you want to achieve a desired effect.

### Magnet Cluster

 [image: The Magnet Cluster tool selected]

The **Magnet Cluster** tool creates bone clusters by grouping all connecting bones of the current selection. You can specify the number of **Iterations** to control how many bones are grouped using the operation.

 [image: Number of Iterations in the Cluster Magnet tool]

In the example below, **1** iteration is used to cluster all bones on the outer ring of the selection.

|  |  |
| --- | --- |
| [image: Before clustering] | [image: After clustering] |
| Before clustering | After clustering |
| Click image for full size. | Click image for full size. |

In this example, **2** iterations are used to cluster the outer 2 rings from the selection.

|  |  |
| --- | --- |
| [image: Before clustering] | [image: After clustering] |
| Before clustering | After clustering |
| Click image for full size. | Click image for full size. |

The Magnet Cluster tool can also work with multiple selections at once. In the example below, the tool is used with 3 bones selected for 1 iteration at a time. You can see how each time we apply the operation, the connecting bones of each selection are clustered separately.

 [image: Each time you apply the operation, the connecting bones of each selection are clustered separately]

### Flatten Cluster

 [image: The Flatten Cluster tool]

The **Flatten** cluster tool flattens the bone hierarchy, removing the middle levels of the **Destruction Hierarchy**. This can be useful to remove the intermediate fracturing steps to get to a final fracture pattern.

In the example below, we see a Geometry Collection fractured into beams for its first level (Level 1), then further fractured into blocks (Level 2).

|  |  |
| --- | --- |
| [image: Level 1] | [image: Level 2] |
| Level 1 | Level 2 |
| Click image for full size. | Click image for full size. |

We can use the Flatten cluster tool to flatten the hierarchy and remove the beam configuration altogether. Select the root bone in the hierarchy and click **Flatten**.

|  |  |
| --- | --- |
| [image: Before using Flatten] | [image: After using Flatten] |
| Before using Flatten | After using Flatten |
| Click image for full size. | Click image for full size. |

### Cluster and Uncluster

 [image: The Cluster and Uncluster tools]

The **Cluster** tool creates a bone cluster from the current bone selection. Conversely, the **Uncluster** tool removes a bone cluster from the current selection. This gives you complete control over the creation of Clusters in your Geometry Collection.

In the example below, we have a Geometry Collection fractured into blocks with two levels in the hierarchy.

 [image: The Geometry Collection has two levels in the Fracture Hierarchy]

Select a group of bones and click **Cluster** to create a new cluster for the selected bones.

|  |  |
| --- | --- |
| [image: Before using Cluster] | [image: After using Cluster] |
| Before using Cluster | After using Cluster |
| Click image for full size. | Click image for full size. |

Repeat this process and create two more clusters.

 [image: Repeat this process and create two more clusters]
 [image: The new hierarchy after clustering]

You can use the **Uncluster** tool to remove a cluster by selecting the bone in the hierarchy and clicking **UnClstr**.

|  |  |
| --- | --- |
| [image: Before using Uncluster] | [image: After using Uncluster] |
| Before using Uncluster | After using Uncluster |
| Click image for full size. | Click image for full size. |

### Merge Cluster

 [image: The Merge tool]

The **Merge** cluster tool combines clusters into a single cluster and keeps the same structure in the hierarchy.

This can be useful to keep a certain number of bones in the hierarchy for your simulation.

In the example below you can see a Geometry Collection that has three clusters in Level 1. If we select two clusters and click **Cluster**, both clusters combine into one. However, the hierarchy now looks like this:

|  |  |
| --- | --- |
| [image: Before using Cluster] | [image: After using Cluster] |
| Before using Cluster | After using Cluster |
| Click image for full size. | Click image for full size. |

As you can see, the hierarchy has been altered after the operation. In contrast, if we use the **Merge** cluster tool, the hierarchy remains the same:

|  |  |
| --- | --- |
| [image: Before using Merge] | [image: After using Merge] |
| Before using Merge | After using Merge |
| Click image for full size. | Click image for full size. |

### Level Up Cluster

 [image: The Level Up cluster tool]

The **Level Up** cluster tool moves the selected bones to a higher level in the hierarchy. Select the desired nodes in the **Fracture Hierarchy** window and click **Level Up** to see the results.

You can also perform this operation on the entire hierarchy by selecting the root bone and clicking **Level Up**.

 [image: Before using the Level Up tool]

 [image: After using the Level Up tool]

### Drag and Drop Clustering

You can create bone clusters manually by dragging and dropping bones directly in the **Fracture Hierarchy** window. You can drag clusters or leaf nodes into other clusters.

In the example below, the Geometry Collection has **2** bones in **Level 1** and **25** bones in **Level 2** of the hierarchy.

|  |  |
| --- | --- |
| [image: Level 1] | [image: Level 2] |
| Level 1 | Level 2 |
| Click image for full size. | Click image for full size. |

You can select any bone in the hierarchy and move it to alter the clusters in the level above.

 [image: You can select any bone in the hierarchy and move it to alter the clusters in the level above]

## Embedded Geometry Tools

The Fracture Mode comes with tools to embed additional geometry into the fracture simulation. The primary purpose of embedded geometry is to add a layer of visual complexity to augment the simulation. For this reason, embedded geometry does not have any collision nor is it considered part of the simulation.

A common example is using embedded geometry to create the internal structure of a building. This can be rebar, cabling or grout within the walls.

In the example below, we have a Geometry Collection that has been cut diagonally. Drag a **Static Mesh** into the Geometry Collection and make sure it intersects with the Geometry Collection.

 [image: Drag a Static Mesh into the Geometry Collection and make sure they intersect]

Duplicate the Static Mesh and move it to the other side of the Geometry Collection.

 [image: Duplicate the Static Mesh and move it to the other side of the Geometry Collection]

Select both Static Meshes and the Geometry Collection and go to the **Embed** section and click **Auto**.

 [image: Click Auto to embed the Static Meshes into the Geometry Collection]

You can now remove the Static Meshes from the level. You will notice that the Static Meshes still appear to be intersecting the Geometry Collection.

Go to the **Content Browser** and open the **Geometry Collection** asset. Scroll down to the **Embedded Geometry Exemplar** section and expand it. Notice how the Static Mesh has been added to the list along with the **Instance Count** denoting that we are using 2 instances of the Mesh in the Geometry Collection.

 [image: Scroll down to the Embedded Geometry Exemplar section and expand it]

You can continue to add Static Meshes to the Geometry collection by clicking **Auto** to embed them into the Geometry Collection.

 [image: The meshes are embedded to their respective bones in the Geometry Collection]

If you want to embed a Static Mesh that does not overlap the Geometry Collection, select a bone in the Geometry Collection and the Static Mesh, then click **Embed**.

 [image: Select the Static Mesh and bone of the Geometry Collection and click Embed]
 [image: The Mesh is embedded to the Geometry Collection bone without overlapping it]

Click **Flush** to remove all embedded geometry from the Geometry Collection.

 [image: You can remove all embedded geometry from the Geometry Collection by clicking Flush]

- physics
- chaos
- destruction

On this page

- The Cluster Tools (-> cluster-geometry-collections-user-guide-in-unreal-engine)
- Auto Cluster (-> cluster-geometry-collections-user-guide-in-unreal-engine)
- Magnet Cluster (-> cluster-geometry-collections-user-guide-in-unreal-engine)
- Flatten Cluster (-> cluster-geometry-collections-user-guide-in-unreal-engine)
- Cluster and Uncluster (-> cluster-geometry-collections-user-guide-in-unreal-engine)
- Merge Cluster (-> cluster-geometry-collections-user-guide-in-unreal-engine)
- Level Up Cluster (-> cluster-geometry-collections-user-guide-in-unreal-engine)
- Drag and Drop Clustering (-> cluster-geometry-collections-user-guide-in-unreal-engine)
- Embedded Geometry Tools (-> cluster-geometry-collections-user-guide-in-unreal-engine)

# Add a Collision Hull to a Static Mesh Using the Auto Convex Collision Tool

https://dev.epicgames.com/documentation/en-us/unreal-engine/add-a-collision-hull-to-a-static-mesh-using-the-auto-convex-collision-tool-in-unreal-engine?application_version=5.9

> Product documentation including reference and guides for Unreal Engine

[image: Add a Collision Hull to a Static Mesh Using the Auto Convex Collision Tool]

In the following How-To we will take a look at using the Auto Convex Collision tool to automatically create collision for Static Meshes.

The Auto Convex Tool also uses a newer version of V-HACD library that should give more accurate results.

## Steps

- First open up the Static Mesh you want to add collision to in the Static Meshes Editor. For this example, we will be using the **SM_Rock Mesh** that comes with the Starter Content.

- Next, open up the Auto Convex Collision tool by going to **Collision > Auto Convex Collision**. This will open up the Auto Convex Collision in the lower right-hand corner of the Static Mesh Editor.

- Inside of the Auto Convex Collision tool set the following parameters with the following settings: | Property Name | Value |
| --- | --- |
| **Hull Count** | 32 |
| **Max Hull Verts** | 16 |
| **Hull Precision** | 50,000 |

- When all of the above settings have been input, click the **Apply** button to begin the collision creation process. Computation of the collision will now run as background task in the Static Mesh Editor. The progress of the collision creation will be shown in the following progress window.

## End Result

When completed you can view the new collision, if not already enabled, by clicking on the Collision icon and then selecting the Simple Collision option from the drop-down list.

The following image sequence shows what type of results you get when increasing the values of the Auto Convex Collision from the default settings to the maximum settings allowed.

Auto Convex Collision Settings Results

- collision
- physics

On this page

- Steps (-> add-a-collision-hull-to-a-static-mesh-using-the-auto-convex-collision-tool-in-unreal-engine)
- End Result (-> add-a-collision-hull-to-a-static-mesh-using-the-auto-convex-collision-tool-in-unreal-engine)

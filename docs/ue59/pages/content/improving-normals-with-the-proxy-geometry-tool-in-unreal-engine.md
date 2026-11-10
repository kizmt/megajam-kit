# Improving Normals

https://dev.epicgames.com/documentation/en-us/unreal-engine/improving-normals-with-the-proxy-geometry-tool-in-unreal-engine?application_version=5.9

> Going over how to improve the normals on geometry that is generated using the Proxy Geometry Tool set.

[image: Improving Normals]

The extreme constraints on Fortnite memory usage call for very efficient use of Level of Detail (LOD) meshes. For most of the proxies, very small Base Color Textures where generated and no Normal map is used. Because of this, this approach requires the highest quality normals on the proxy mesh itself. In the following How-To we will take a look at how you can specify how the Normals of a Static Mesh are calculated when using the Proxy Geometry tools.

## Steps

In the following section we will take a look at how you can adjust the manner in which the generated Static Meshes Normals are calculated when using the Proxy Geometry tool.

- First locate an object that requires you to create a Proxy Static Mesh for it. For this example, the following small house was constructed using only Static Meshes that can be found in the Starter Content.

- Next, open up the **Merge Actor **tool by going to **Window > Developer Tools > Merge Actors**.

- Inside the level, select all the Static Mesh Actors that make up the object for which you want to generate new geometry.

- In the Merge Actor tool, click the **second icon** to access the Proxy Geometry tool and then expand the **Proxy Settings**.

- Under the Proxy Settings, expand the **Material Settings** section and disable the **Normal Map** option. If you don't disable the Normals here, you will not see the correct results because you will be seeing the Normals from the Normal map, and not from the generated Static Mesh.

- Next, click the box next to the **Hard Edge Angle** option to disable it. This disables all normal calculations on the generated Static Mesh.

- Next, click the **Merge Actors** button and input a name and location in the **Content Browser** for the newly created Static Mesh. Then click the **Save** button to start the merging process.

- Once everything has completed, open up the newly created Static Mesh, which should look something like the following image.

- The above image is not what we want; we want the generated object to have Normals that look almost identical to the Normals of the object that it was generated from. To fix this issue, go to the Merge Actor tool and re-enable the Hard Edge Angle option.

- Once the Hard Edge Angle has been re-enabled, re-run the Merge Actors tool. When it has completed, you should now have a building that looks like the following image:

## End Results

Getting the best results is going to take some time and iteration as each object could require slightly different settings to get the best results. Also keep in mind that when you are specifying a value for the Hard Edge Angle you could increase or decrease the number of vertices that are used in the generated Static Mesh. The following image comparison shows what happens a Static Mesh and it's vertices when setting the Hard Edge Angle to values of **0**, **5**, **10**, **50**, **80**, **130**, and **180**.

The following image comparison shows the different shading and vertex counts when setting the Hard Edge Angle to values of 0, 5, 10, 50, 80, 130, and 180.

-

On this page

- Steps (-> improving-normals-with-the-proxy-geometry-tool-in-unreal-engine)
- End Results (-> improving-normals-with-the-proxy-geometry-tool-in-unreal-engine)

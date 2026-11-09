# Using the Proxy Geometry tool with HLODs

https://dev.epicgames.com/documentation/en-us/unreal-engine/using-the-proxy-geometry-tool-with-hlods-in-unreal-engine?application_version=5.9

> How to use the Proxy Geometry Tool with the Hierarchical Level of Detail (HLOD) system.

[image: Using the Proxy Geometry tool with HLODs]

In the following How-To, we will take a look at using the Proxy Geometry Tool in conjunction with the Hierarchical Level of Detail (-> hierarchical-level-of-detail-in-unreal-engine) (HLOD) system. Using these two tools together will help increase your Unreal Engine 4 (UE4) project's rendering performance by reducing both draw calls and number of triangles drawn to the screen per frame.

## Steps

- Go to your project's World Settings (-> world-settings-in-unreal-engine) and display the **LODSystem** menu option.

- In the LODSystem menu, enable the following two options: | **Property Name** | **Description** |
| --- | --- |
| **Enable Hierarchical LOD System** | Enables the HLOD to be used with this level. |
| **Simplify Mesh** | Enables Proxy Geometry Static Mesh simplification. |

- Open up the **Hierarchical LOD Outliner** tools by going to **Window > Hierarchical LOD Outliner**.

- Press the **Generate Clusters** button on the **Hierarchical LOD Outliner** and when that is completed, press the **Generate Proxy Meshes** button to begin the HLOD and Proxy Geometry creation process.

## End Result

When the Hierachical LOD tool has finished processing, you can see how many triangles were removed and also compare the results against the original by moving the slider back and forth.

The image comparison slider below shows an example of the types of results you can get when using just the default settings with **Simplify Mesh** enabled.

 [image: Before Running HLOD & Proxy Geo]

 [image: After Running HLOD & Proxy Geo]

- hlod
- proxygeometry
- optmization

On this page

- Steps (-> using-the-proxy-geometry-tool-with-hlods-in-unreal-engine)
- End Result (-> using-the-proxy-geometry-tool-with-hlods-in-unreal-engine)

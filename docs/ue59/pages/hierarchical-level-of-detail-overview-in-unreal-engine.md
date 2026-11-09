# Hierarchical Level of Detail Overview

https://dev.epicgames.com/documentation/en-us/unreal-engine/hierarchical-level-of-detail-overview-in-unreal-engine?application_version=5.9

> Overview of the Hierarchical Level of Detail system in Unreal Engine 4

[image: Hierarchical Level of Detail Overview]

**Hierarchical Level of Detail** (or HLOD), in its simplest form, is a way to combine pre-existing Static Mesh Actors (-> static-mesh-actors-in-unreal-engine) into a single HLOD Proxy Mesh and Material (with atlased Textures). Using HLOD may lead to increased performance as they reduce draw calls down to one call per Proxy Mesh as opposed to a draw call for each individual Static Mesh Actor. When generating HLOD Proxy Meshes, there several parameters you can adjust which help define how Static Mesh Actors are grouped together as clusters that will ultimately be built into Proxy Meshes.

To use HLOD, you will need to enable the HLOD system in each of the Levels you wish to take advantage of the system.

## Proxy Meshes

Proxy Meshes can be opened independently and their settings can be adjusted as desired.

The Proxy Mesh above contains several elements that had their own Textures which were combined into a single texture (below).

For anything using **Mask** or **Opacity**, alpha channels are not passed to the merged Texture. If opacity or masked items are needed, disable the option for **Merge Textures**. When doing this the Proxy Mesh will assign the original material as a **Material Element ID** instead of combining them.

## Hierarchical LOD Volume

The **Hierarchical LOD Volume** (HLOD Volume) is used to manually define/create an HLOD cluster. The **Hierarchical LODVolume** can be an be dragged into your Level from the **Place Actors** panel in the **Volumes** tab.

You can place this volume around Actors you want to be grouped in the same cluster. It can be helpful to make this slightly larger than the Actors you wish to include and should not be tightly bounding them. Once you have placed the volume around the Actors you can use the option **Generate Clusters** from the **HLOD Outliner** to create a new cluster with these grouped Actors.

Below, we have several cubes and spheres within an HLOD Volume and one cube and the floor outside the volume.

When we **Generate Clusters** inside the **HLOD Outliner**, we have two separate clusters: one containing the Static Mesh Actors inside the HLOD Volume, the other containing the Static Mesh Actors that are not inside the HLOD Volume.

Click image for full view.

Optionally, you can enable **Only Generate Clusters for Volumes** (below) to generate clusters for only Static Mesh Actors that exist within an HLOD Volume.

Click image for full view.

### Example

Below is an example of Generated Clusters before and after adding HLOD Volume.

HLOD Level Desired Bound Radius: 500

Drag in the Volume and scale accordingly to cover your **Actors**.

Selecting the generated **LODActor** from the HLOD Outliner shows the cluster created and the Cluster bounds.

Right-click on the **LODActor** in the HLOD Outliner and click on **Select Contained Actors** to see the **Actors** used for this particular **LODActor** in your scene.

## HLOD Overrides

When you select an LOD Actor in the Level, inside the **Details** panel, you can override the **Hierarchical LODSettings** being used.

Please see Mesh Generation Settings (-> hierarchical-level-of-detail-outliner-in-unreal-engine) and properties for more information.

## HLOD Visualization

There are visualization modes you can use to view Mesh LODs and HLODs in the viewport. To access these, click the **View Mode** button in the upper-left corner of the viewport and select your perfered method of LOD Coloration.

During a play session you can enter console command `viewmode hlodcoloration` to achieve the same result.

- hlod

On this page

- Proxy Meshes (-> hierarchical-level-of-detail-overview-in-unreal-engine)
- Hierarchical LOD Volume (-> hierarchical-level-of-detail-overview-in-unreal-engine)
- Example (-> hierarchical-level-of-detail-overview-in-unreal-engine)
- HLOD Overrides (-> hierarchical-level-of-detail-overview-in-unreal-engine)
- HLOD Visualization (-> hierarchical-level-of-detail-overview-in-unreal-engine)

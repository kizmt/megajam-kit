# Optimizing Navigation Mesh Generation Speed

https://dev.epicgames.com/documentation/en-us/unreal-engine/optimizing-navigation-mesh-generation-speed-in-unreal-engine?application_version=5.9

> A How-To guide on how to optimize the Navigation Mesh generation speed.

[image: Optimizing Navigation Mesh Generation Speed]

The latest version of this guide can be found in your local installation of Unreal Engine under the following directory: `Engine\Source\Runtime\NavigationSystem\DevDocs\How To Optimize Navmesh Generation.md`

## Overview

Unreal Engine's **Navigation System** provides pathfinding capabilities to Artificial Intelligence Agents. To find a path between a start location and a destination, a **Navigation Mesh** is generated from the collision geometry of the world.

The Navigation Mesh is divided into tiles which are used to rebuild localized parts of the Navigation Mesh at runtime.

The Navigation System provides a variety of settings that advanced users can use to modify the way navigation is computed in the Level. This guide provides recommendations to optimize the generation speed of the Navigation Mesh.

## Use the Highest Cell Size and Cell Height Possible

The **Cell Size** and **Cell Height** properties define the size of the voxels used to generate the Navigation Tiles. The smaller the voxels, the more precision is gained and the more accurate the navigation will be around obstacles. However, the smaller the voxels, the more processing is required when rebuilding the Navigation Mesh at runtime.

For this reason, it is important to balance the size of the cells (voxels) with the amount of navigation precision needed in your project.

Follow these steps to adjust the Cell Size and Cell Height properties of your Navigation Mesh:

- Click **Settings > Project Settings** to open the **Project Settings** window. [image: Open the Project Settings window]

- Go to the **Navigation Mesh** section and scroll down to the **Generation **section. You can increase the **Cell Size** and **Cell Height** values to improve generation speed. Note that increasing the Size and Height values will decrease the Navigation Mesh precision in your level. [image: Open the Project Settings window]

- Alternatively, you can adjust individual Navigation Meshes inside your Level by selecting the **RecastNavMesh-Default **Actor in the ** Outliner** and going to the **Details **panel. [image: Select the NavMesh Actor in the World Outliner window]

- In this example the **Cell Size** was changed from **19** to **64**. Notice how precision is reduced and the Navigation Mesh is less accurate around the objects in the level. The new Cell Size of 64 prevents navigation generation between the wall and the box (see the arrow in the image below).

 [image: Tile Size is 19]

 [image: Tile Size is 64]

### Recommendation

Make the cells as large as possible while maintaining the required precision for your Agents.

In the example above, setting the **Cell Size** to 64 caused the path between the wall and the box to be removed. If this path is needed for your Agent, you can either continue to adjust **Cell Size** until a path is generated or move the box further from the wall.

## Limit the Tile Size

The Navigation Mesh is divided into tiles which are used to rebuild localized parts of the Navigation Mesh at runtime. Since each tile is built from cells, rebuilding a Navigation Tile will result in the recreation of all its cells with the new collision information.

Larger tiles contain more cells and are more expensive to rebuild than smaller tiles. However, when processing a tile, the system also processes the contiguous cells on the edges of the tile. You should consider this overhead cost when setting the size of your tiles, as there can be situations where the overhead cost of processing many smaller tiles is greater than the cost of rebuilding a single large tile.

### Recommendation

The **Tile Size** should be set between **32** to **128 cells** per side. This will provide the best performance when rebuilding tiles at runtime.

In the previous example the **Cell Size** was set to **64**. In that case, the **Tile Size UU** should be set between **2048 **(6432) and **8192 **(64128).

 [image: Set the Tile Size UU]

## Use Simplified Collision for Your Meshes

The Navigation System uses each object's collision data to generate the Navigation Mesh. Simpler object collision results in faster processing compared to higher triangle count collision data.

### Recommendation

Use **Simple Collision** when possible for Static Meshes. The lower the triangle count used in the collision mesh, the faster the generation will be.

## Reduce the Number of Objects That Affect the Navigation Mesh

By default, Blueprint Actors and Static Meshes in your Level affect navigation. The number of objects that affect a Navigation Tile has a direct impact on the cost of generating that tile.

### Recommendation

Smaller objects that should not affect the Navigation Mesh should be configured so they don't affect navigation. Select your Actor in the Level and go to the **Details **panel. Scroll down to the **Collision **section and **disable **the **Can Ever Affect Navigation** checkbox.

 [image: Disable navigation on your Actor]

This setting should be disabled for any Actor that should not affect the Navigation Mesh, such as moving objects in inaccessible areas of the Level.

If possible, you should avoid affecting large tile areas or multiple tiles at the same time.

## Useful Developer Tools to Manage Navigation Generation

### Locking and Unlocking the Navigation Mesh Generation at Strategic Times

It is possible to stop the automatic generation of the Navigation Mesh before loading many assets that might affect it. You can unlock the generation once all the assets have completed loading. This method prevents the Navigation System from rebuilding the same tile several times.

To lock the Navigation Mesh generation, set your navigation system's **bInitialBuildingLocked **to **True. **To unlock the generation, call the function **ReleaseInitialBuildingLock()**. Once unlocked, the Navigation Mesh will rebuild all the tiles marked as dirty by the loaded assets. To prevent this, you can call **DefaultDirtyAreasController.Reset()** before unlocking the generation.

### Enable Multi-threaded Navigation Mesh Generation

You can control multi-threaded Navigation Mesh generation by setting the **MaxSimultaneousTileGenerationJobsCount** property in the Navigation System. Note that this is limited by the total number of worker threads in **FRecastNavMeshGenerator::Init()**.

### Use Dynamic Obstacles with Full Dynamic Navigation Mesh Generation

You can mark Static Meshes and other Actors in your Level as **Dynamic Obstacles**. Dynamic Obstacles mark the Navigation Mesh surface where generation needs to be rebuilt. This prevents the entire Navigation Tile from being rebuilt.

Using this method is less costly than generating the full Navigation Tile and should be used when a Navigation Mesh surface is not needed on top of moving obstacles.

 [image: Set your Static Mesh to be a Dynamic Obstacle]

### Use Data Chunk Streaming for Static Navigation Meshes Loaded in Sublevels

If the only changes to the Navigation Mesh come from loading and unloading sublevels, you can set the Navigation Mesh Generation Method to **Static **and use **NavMesh Data Chunk Streaming**, instead of using a dynamic Navigation Mesh.

With this method, the Navigation Mesh will be fully built in the editor and only the relevant parts will be loaded in and out at runtime.

- ai
- navigation

On this page

- Overview (-> optimizing-navigation-mesh-generation-speed-in-unreal-engine)
- Use the Highest Cell Size and Cell Height Possible (-> optimizing-navigation-mesh-generation-speed-in-unreal-engine)
- Recommendation (-> optimizing-navigation-mesh-generation-speed-in-unreal-engine)
- Limit the Tile Size (-> optimizing-navigation-mesh-generation-speed-in-unreal-engine)
- Recommendation (-> optimizing-navigation-mesh-generation-speed-in-unreal-engine)
- Use Simplified Collision for Your Meshes (-> optimizing-navigation-mesh-generation-speed-in-unreal-engine)
- Recommendation (-> optimizing-navigation-mesh-generation-speed-in-unreal-engine)
- Reduce the Number of Objects That Affect the Navigation Mesh (-> optimizing-navigation-mesh-generation-speed-in-unreal-engine)
- Recommendation (-> optimizing-navigation-mesh-generation-speed-in-unreal-engine)
- Useful Developer Tools to Manage Navigation Generation (-> optimizing-navigation-mesh-generation-speed-in-unreal-engine)
- Locking and Unlocking the Navigation Mesh Generation at Strategic Times (-> optimizing-navigation-mesh-generation-speed-in-unreal-engine)
- Enable Multi-threaded Navigation Mesh Generation (-> optimizing-navigation-mesh-generation-speed-in-unreal-engine)
- Use Dynamic Obstacles with Full Dynamic Navigation Mesh Generation (-> optimizing-navigation-mesh-generation-speed-in-unreal-engine)
- Use Data Chunk Streaming for Static Navigation Meshes Loaded in Sublevels (-> optimizing-navigation-mesh-generation-speed-in-unreal-engine)

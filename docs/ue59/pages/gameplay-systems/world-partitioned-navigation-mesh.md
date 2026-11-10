# World Partitioned Navigation Mesh

https://dev.epicgames.com/documentation/en-us/unreal-engine/world-partitioned-navigation-mesh?application_version=5.9

> An overview of how to use a Navigation Mesh with World Partition.

[image: World Partitioned Navigation Mesh]

Learn to use this **Experimental** feature, but use caution when shipping with it.

## Overview

This document provides an overview of how to use a world-partitioned **Navigation Mesh** with Unreal Engine's **World Partition** system.

World Partition is an automatic data management and distance-based level streaming system that provides a complete solution for large world management. The system removes the need to divide large levels into sublevels by storing your world in a single persistent level separated into grid cells, and provides an automatic streaming system to load and unload those cells based on distance from a streaming source.

Learn more about the system by reading the World Partition documentation.

## World-Partitioned Navigation Mesh

A World Partition Navmesh is split into several Navmesh chunk Actors that are loaded / unloaded like other world partitioned resources.

A World Partition Navmesh only makes sense in the context of a world partitioned map. To convert a map so it uses World Partition, refer to the World Partition documentation.

Alternatively, you can create a world partitioned map by creating a new Level and selecting the Open World template.

## Runtime Generation

World Partition Navigation Meshes support all available generation modes: **Static**, **Dynamic Modifiers Only**, and **Dynamic**.

## Dynamic Modes

When using the Dynamic generation mode, the Navmesh tile generation will occur at runtime. However, navigation dirtiness (the need to rebuild the navigation) is ignored for objects that are loaded and unloaded which are part of the base Navmesh (see below). This prevents excessive dirtiness as a result of the loading and unloading of the world.

Dynamic tile building is limited to the loaded space when using a World Partition Dynamic Navmesh.

## Base Navigation Mesh and Data Layers

All runtime navigation generation modes use a **Base Navmesh**. This refers to the initial Navmesh that gets loaded via streaming as cells are loaded.

In Static mode, this Navmesh will not change. However, in the Dynamic modes, spawned Actors that are relevant to the navigation will dirty the Base Navmesh and trigger the rebuilding of navigation tiles.

### What is included in the Base Navmesh?

Navigation-relevant objects outside of Data Layers will be included in the Base Navmesh (i.e. baked in the initial Navmesh). In addition, any objects in editor Data Layers are also included.

Finally, any layers (including runtime Data Layers) in the Base Navmesh Data Layers list will also be considered in the Base Navmesh.

Learn more about World Partition Data Layers by reading the Data Layers (-> world-partition---data-layers-in-unreal-engine) documentation.

## External Packaging

When building a World Partitioned Navmesh, the navigation data actor (ANavigationData) is externally packaged. This means that building a World Partitioned Navmesh does not dirty the main map.

For more information on external packaging see the One File Per Actor (-> one-file-per-actor-in-unreal-engine) documentation.

## Create a World Partitioned Navigation Mesh

### 1 - Required Setup

- Create a new project from a template in the **Games **category. In this example, we selected the **Third Person** template. [image: Create a new project]

- In the editor, click **File > New Level**. Select the **Open World **map type and click **Create**. Save the level. [image: Create a new Open World level] The Open World default map type is designed as a starting point for creating large open-world maps and has the following features enabled by default: World Partition

- One File Per Actor

- Data Layers

- Hierarchical Levels of Detail

- Go to the **World Settings** window and scroll down to the **World Partition** section. Expand **Runtime Settings > Grids > Index [0]**.

- Change the **Loading Range** value to **12800**. The smaller value will make it easier to visualize when the Navigation Mesh is loaded by World Partition.

 [image: Create a new Open World level]

#### Section Results

In this section, you created a new project with a level set up to use World Partition. In the next section, you will configure a Navigation Mesh so it works with World Partition.

### 2 - Configuring the Navigation Mesh to use World Partition

- Click **Settings > Project Settings** to open the **Project Settings** window. [image: Click Settings > Project Settings to open the Project Settings window]

- Click the **Navigation Mesh** category and scroll down to the **Runtime **section. Click the **Runtime Generation** dropdown and select **Static**. [image: Click the Runtime Generation dropdown and select Static]

- If your project has large worlds, you can limit memory utilization by going to the **Generation** section and enabling the **Fixed Tile Pool Size** checkbox, and adjusting the **Tile Pool Size**. The pool size will limit the memory size utilized by the Navigation Mesh. The number of tiles in the pool must be large enough to allow you to add: The maximum number of tiles required to load the Navmesh Actors in the loading bubble at runtime. The maximum number of tiles you want to visualize in the editor when loading parts of the world partitioned map. [image: Click the Runtime Generation dropdown and select Static]

- Click **Add + > Volumes > NavMeshBoundsVolume** to add a **Navigation Mesh** volume actor to your level. [image: Add a Navigation Mesh volume actor to your level]

- Select the **NavMeshBoundsVolume **actor in the **Outliner **window and go to the **Details **panel. **Scale **the actor so it covers the playable space in the level.

- Press **P** to see the navigation being built in the viewport.

 [image: Select the NavMeshBoundsVolume actor in the Outliner window]
 [image: Press P to see the navigation being built in the viewport]

- Select the **RecastNavMesh-Default **actor in the **Outliner **window and go to the **Details **panel. Scroll down to the **Generation **section and **enable **the **Is World Partitioned Navmesh** checkbox. [image: Select the RecastNavMesh-Default actor in the Outliner window] [image: Enable the Is World Partitioned checkbox]

#### Section Results

In this section, you added a Navigation Mesh Bounds volume to your level. You also configured the Navigation mesh to work with World Partition.

In the next section you will configure the editor to improve your workflow.

### 3 - Configuring the Editor

Since you are most likely working on a really big level, it is recommended that you disable automatic Navigation Mesh generation to improve your workflow.

To do so, follow these steps:

- Click **Edit > Editor Preferences** to open the **Preferences **window. [image: Click Edit - Editor Preferences to open the Preferences window]

- Scroll down to the **Level Editor** section and click the **Miscellaneous **category. Scroll down to the **Editing **category and disable the **Update Navigation Automatically** checkbox. [image: Disable the Update Navigation Automatically checkbox]

#### Section Results

In this section, you configured your Navigation Mesh so it does not update automatically. This generally improves your workflow as you work with large worlds using World Partition.

In the next section, you will build the Navigation Mesh in your level.

### 4 - Building the Navigation Mesh

When working with a world partitioned map, some assets are usually loaded while others are unloaded. Because of this, building the entire Navigation Mesh requires a different process.

To build the Navigation Mesh in your level, follow these steps:

- Enter the following console command in the command line and press **Enter**: **n.bNavmeshAllowPartitionedBuildingFromEditor 1** [image: Enter the command n.bNavmeshAllowPartitionedBuildingFromEditor 1]

- Click **Build > Build Paths** to build the Navigation Mesh in your level. [image: Click Build - Build Paths to build the Navigation Mesh in your level]

- In the **Build Navigation Settings** window, click **Ok** to build the Navigation Mesh. You also have the following options available: **Verbose **- Enable this checkbox if you want to see a more detailed log of the build process. You can find the output log named **WPNavigationBuilderLog.txt** in the **Saved > Logs** directory of your project.

- **Clean Packages** - Enable this if you want to remove all world partitioned NavMesh actor packages from your project. This will not build the navigation.

 [image: Build Navigation Settings options]

- Go to the **Outliner **window and notice that you now have four **NavDataChunk **Actors. These actors hold the navigation data loaded and unloaded by World Partition. The number of NavDataChunk Actors created depends on the size of the Data Chunk Grid (see section 6 for more details). [image: Go to the Outliner window and notice that you now have four NavDataChunk Actors]

#### Section Results

In this section, you learned how to build the navigation for your level. You also learned about the different Navigation Settings options and how NavDataChunk actors are created in your level.

In the next section, you will learn how to build navigation outside of the editor.

### 5 - Building the Navigation Mesh with the World Partition Navigation Data Builder

It is also possible to build a world partitioned static Navigation Mesh outside the editor by using the **WorldPartitionBuilderCommandlet **with the **WorldPartitionNavigationDataBuilder**.

Follow the instructions in the World Partition documentation, under the **World Partition Navigation Data Builder** section to learn how to do this.

### 6 - Additional settings for your Navigation Mesh

- Go to the **World Settings** window and scroll down to the **Navigation **section to find the **Navigation Mesh** settings for the level. The options are as follows: | Setting | Description |
| --- | --- |
| Navigation Data Chunk Grid Size | This defines the size of the data chunk actors loaded with each cell of World Partition. The smaller the number, the more granular the data. |
| Navigation Data Builder Loading Cell Size | This defines the size of the loading cells used to load the Navigation data into memory. | Set the **Navigation Data Chunk Grid Size** to **25600**. This lower value better shows how the Navigation Mesh is loaded and unloaded by World Partition. This value should be adjusted based on your gameplay needs, loading range, and required granularity. [image: Set the Navigation Data Chunk Grid Size to 25600]

- Click **Build > Build Paths** to build the Navigation Mesh in your level.

- Go to the **Outliner **window and notice that you have many more **NavDataChunk **actors in the level. This is expected as the Chunk Grid Size is smaller than before. [image: There are many more NavDataChunk** **actors in the level]

#### Section Results

In this section, you learned how to change the Navigation Data Chunk Grid Size and how it affects the number of NavDataChunk actors that are created in your level.

In the next section, you will see how the Navigation Mesh is loaded and unloaded as the player traverses the level.

### 7 - World Partition Settings

In addition to the Navigation Mesh settings, you can also use the following World Partition settings to set up your map.

#### Use the Partition Actor Bounds

To set the Partition Actor to use its **bounds** (instead of its location) when checking if it should be loaded, follow these steps:

- Go to the **World Settings** panel and scroll down to the **Runtime Settings** section.

- Expand the **Advanced** options and click the **Place Partition Actors Using Location** dropdown.

- Select **Disabled**.

 [image: Click the Place Partition Actors Using Location dropdown and select Disabled]

This might be useful when using large landscape tiles with a small loading radius.

#### Force Garbage Collection

To force Garbage Collection after the level is streamed out, use the console command **LevelStreaming.ShouldReuseUnloadedButStillAroundLevels 0**.

This will remove the Navigation Actors that have been unloaded by World Partition. Otherwise, it might take some time for the unloaded Actors to be collected.

### 8 - Viewing your results

Follow these steps to view how the Navigation Mesh is loaded and unloaded with the World Partition cells.

- Enter the following Navigation Mesh Gameplay Debugger console commands in the command line and press **Enter**: **ai.debug.nav.RefreshInterval 0.3**

- **ai.debug.nav.DisplaySize 100**

These commands adjust the display size and how frequently the Navigation Mesh visualization is updated.

 [image: Enter the ai.debug.nav.DisplaySize 100 command]

- Press **Play **to start the game. Open the command line by pressing **tilde (~),** then enter the following World Partition debug commands: **wp.Runtime.ToggleDrawRuntimeHash2D**

- **wp.Runtime.ShowRuntimeSpatialHashGridLevel 2**

These commands display which World Partition cells are loaded around the player.

 [image: During gameplay you can see a display of which World Partition cells are loaded around the player]

- Press **single-quotation (')** to enable the **Gameplay Debugger** and press **zero** **(0) **to switch to the **Navigation **view. You can now see the Navigation Mesh loaded around the player. [image: You can see the Navigation Mesh loaded around the player]

- Move around the level and see how the Navigation Mesh is loaded as each World Partition cell is loaded around the player. [image: Move around the level and see how the Navigation Mesh is loaded around the player] [image: Top view of the Navigation Mesh being loaded around the player]

#### Section Results

In this section, you learned how to visualize when the Navigation Mesh is loaded and unloaded by World Partition.

- experimental
- ai
- navigation

On this page

- Overview (-> world-partitioned-navigation-mesh)
- World-Partitioned Navigation Mesh (-> world-partitioned-navigation-mesh)
- Runtime Generation (-> world-partitioned-navigation-mesh)
- Dynamic Modes (-> world-partitioned-navigation-mesh)
- Base Navigation Mesh and Data Layers (-> world-partitioned-navigation-mesh)
- What is included in the Base Navmesh? (-> world-partitioned-navigation-mesh)
- External Packaging (-> world-partitioned-navigation-mesh)
- Create a World Partitioned Navigation Mesh (-> world-partitioned-navigation-mesh)
- 1 - Required Setup (-> world-partitioned-navigation-mesh)
- Section Results (-> world-partitioned-navigation-mesh)
- 2 - Configuring the Navigation Mesh to use World Partition (-> world-partitioned-navigation-mesh)
- Section Results (-> world-partitioned-navigation-mesh)
- 3 - Configuring the Editor (-> world-partitioned-navigation-mesh)
- Section Results (-> world-partitioned-navigation-mesh)
- 4 - Building the Navigation Mesh (-> world-partitioned-navigation-mesh)
- Section Results (-> world-partitioned-navigation-mesh)
- 5 - Building the Navigation Mesh with the World Partition Navigation Data Builder (-> world-partitioned-navigation-mesh)
- 6 - Additional settings for your Navigation Mesh (-> world-partitioned-navigation-mesh)
- Section Results (-> world-partitioned-navigation-mesh)
- 7 - World Partition Settings (-> world-partitioned-navigation-mesh)
- Use the Partition Actor Bounds (-> world-partitioned-navigation-mesh)
- Force Garbage Collection (-> world-partitioned-navigation-mesh)
- 8 - Viewing your results (-> world-partitioned-navigation-mesh)
- Section Results (-> world-partitioned-navigation-mesh)

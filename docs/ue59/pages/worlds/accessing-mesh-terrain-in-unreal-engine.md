# Accessing Mesh Terrain

https://dev.epicgames.com/documentation/en-us/unreal-engine/accessing-mesh-terrain-in-unreal-engine?application_version=5.9

> Learn how to set up your project to use Mesh Terrain, and access the features in the editor.

[image: Accessing Mesh Terrain]

Learn to use this **Experimental** feature, but use caution when shipping with it.

###### Prerequisite topics

In order to understand and use the content on this page, make sure you are familiar with the following topics:

- Working with Plugins (-> working-with-plugins-in-unreal-engine)

### Enable Mesh Partition Plugins

To use Mesh Terrain you must enable these plugins:

|  |  |
| --- | --- |
| **MeshPartition** | Enables the Mesh Partition system core functionalities. |
| **MeshPartitionWater** | Enables waterbody tools to translate to the Mesh Partition system. |
| **PCG MeshPartition Interop** | Extra plugin for the Procedural Content Generation (PCG) framework interacting with the Mesh Partition system. |
| **Mesh Terrain Mode** | Enables the Mesh Terrain Mode toolbar. |

[image: Select Plugins in the Edit menu]

[image: Mesh Terrain plugins]

### Mesh Terrain Mode

After you enable the plugins, the **Mesh Terrain mode** is available in the editor.

[image: Select Mesh Terrain mode]

The Mesh Terrain mode toolbar has 6 tabs:

|  |  |  |
| --- | --- | --- |
| **Create** | [image: Mesh Terrain mode Create tab] | The create tab is your starting point to create your base mesh partition actor. |
| **Edit** | [image: Mesh Terrain mode Edit tab] | Edit base sections of an existing mesh partition or convert regular static mesh in the level into mesh partition geometry. |
| **Modifiers** | [image: Mesh Terrain mode Modifiers tab] | All mesh terrain modifiers are accessible here. Drag and drop any of them onto your terrain. |
| **Sculpt** | [image: Mesh Terrain mode Sculpt tab] | Access available brushes for modifiers with sculpting capabilities. You need to first select a modifier. |
| **Paint** | [image: Mesh Terrain mode Paint tab] | This enables paint mode for modifiers that have painting capabilities. You need to first select a modifier. |
| **Shapes** | [image: Mesh Terrain mode Shapes tab] | Add common primitive shapes to your level which you can then convert into mesh partitions. |

### Mesh Partition Outliner

The **Mesh Partition Outliner** provides you with a consolidated view of all the modifiers, priorities, visibility, and other useful information. The modifiers are shown in build order from the bottom. Modifiers are shown in their appropriate layer.

In addition, the modifiers show a count that reflects the time to calculate the modifier. This is useful for diagnosing which modifiers have the biggest impact on processing time.

Next to the time is the "Build To" slider bar. You can slide the bar up or down to control how much of the layer stack gets built. This can be useful when you are working on a layer and you want to hide any other modifiers on top for quicker iterations.

Selecting a modifier from this panel selects the modifier component and not the root of the parent actor.

[image: Mesh Partition Settings in the Tools menu] Open the Mesh Partition Outliner from the UE main menu, under Tools > Mesh Partition Settings.

[image: Modifiers in the Mesh Partition Outliner] Mesh Partition Outliner

- landscape
- mesh terrain

On this page

- Enable Mesh Partition Plugins (-> accessing-mesh-terrain-in-unreal-engine)
- Mesh Terrain Mode (-> accessing-mesh-terrain-in-unreal-engine)
- Mesh Partition Outliner (-> accessing-mesh-terrain-in-unreal-engine)

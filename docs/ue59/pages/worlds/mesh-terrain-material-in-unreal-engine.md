# Mesh Terrain Material

https://dev.epicgames.com/documentation/en-us/unreal-engine/mesh-terrain-material-in-unreal-engine?application_version=5.9

> An overview of how to use mesh terrain material.

[image: Mesh Terrain Material]

Learn to use this **Experimental** feature, but use caution when shipping with it.

## Mesh Partition Nodes

Mesh partition data is available in the Material graph. The available mesh partition nodes are:

- Mesh Partition Resource
- Mesh Partition Channel Sample
- Mesh Partition Channel Sample Index
- Mesh Partition Channel Inspector
- Mesh Partition Tex Coord

### Mesh Partition Resource

This node provides the mesh partition channel texture to the material.

[image: MeshPartitionResource node]

### Mesh Partition Channel Sample

This node samples a mesh partition channel by name. You must specify a mesh partition definition to get a list of available channels.

[image: Mesh Partition Channel Sample node]

[image: Mesh Partition Channel Sample node settings]

|  |  |
| --- | --- |
| **Channel** | Select a weight channel defined in the selected mesh partition definition. Select the MPD first to populate the list. |
| **Mesh Partition Definition** | Select a mesh partition definition asset from the content browser. |

### Mesh Partition Channel Sample Index

This node samples a mesh partition channel by reading it by index instead of doing so by name.

[image: Mesh Partition Channel Sample Index node]

### Mesh Partition Channel Inspector

This node is used for debug purposes, it displays one unique color for each mesh partition channel.

[image: Mesh Partition Channel Inspector node]

### Mesh Partition Tex Coord

This node returns the UVs of the mesh partition geometry.

[image: Mesh Partition Tex Coord node]

|  |  |
| --- | --- |
| **UV** | Regular UVs normalized for each mesh partition sections |
| **UV [unit]** | The UVs in 3D units, if a section is 100cm the UVs will go from 0 to 100 instead from 0 to 1. |

## Reading Weight Channels in Material

A common use case is to read mesh partition weight channels as defined in the mesh partition definition. Proceed as follows:

- Connect the **Mesh Partition Resource** node output to the **Mesh Partition Channel Sample** node input.[image: Connect nodes]
- You can now read the channel of your choice, in this example the Gravel channel.[image: Reading the Gravel channel]
- You can then use that channel to create various material effects, for example blending material attributes.[image: Blending Material attributes using the output]

- landscape
- material
- mesh terrain

On this page

- Mesh Partition Nodes (-> mesh-terrain-material-in-unreal-engine)
- Mesh Partition Resource (-> mesh-terrain-material-in-unreal-engine)
- Mesh Partition Channel Sample (-> mesh-terrain-material-in-unreal-engine)
- Mesh Partition Channel Sample Index (-> mesh-terrain-material-in-unreal-engine)
- Mesh Partition Channel Inspector (-> mesh-terrain-material-in-unreal-engine)
- Mesh Partition Tex Coord (-> mesh-terrain-material-in-unreal-engine)
- Reading Weight Channels in Material (-> mesh-terrain-material-in-unreal-engine)

Related documents

Materials (-> BlueprintAPI)Material Editor Guide

 [image: Material Editor Guide] (-> unreal-engine-material-editor-user-guide)

# PCG and Mesh Terrain

https://dev.epicgames.com/documentation/en-us/unreal-engine/pcg-and-mesh-terrain-in-unreal-engine?application_version=5.9

> An overview of how to use PCG with mesh terrain.

[image: PCG and Mesh Terrain]

Learn to use this **Experimental** feature, but use caution when shipping with it.

It is possible to read and write mesh partitions from a PCG graph. This can be powerful and opens up many possibilities. For example:

- Creating a custom erosion effect.
- Applying material effects automatically.
- Scattering assets using mesh partition weight channels.

Here is an example of a PCG graph used to apply an erosion effect on the mesh partition.

[image: PCG graph for mesh terrain erosion effect]

 [image: PCG erosion effect in action]

You can set the mesh partition **Query **and Write nodes to read the mesh up to a specific priority layer and then write back results to another specific layer.

[image: Query and Write nodes workflow]

Best practice is to connect the same priority layer and sub-priority into both the mesh partition Query node and Write node. Avoid setting up the Query as inclusive by default, in order to avoid feedback loops with each graph generation.

[image: Inclusive setting for Query node]

[image: PCG graph for mesh terrain]

## PCG Mesh Partition nodes

### Query

The mesh partition **Query** node loads the mesh partition surface geometry within the PCG volume. You can then sample it, or convert it to points using the ToPoint node. It can also get weight channels.

[image: Mesh partition Query node settings]

### ToPoint

The ToPoint node converts mesh partition geometry surface from the mesh partition Query node into PCG points.

### Write

The mesh partition **Write **node writes back modifications done to mesh partition points. The number of points has to match the value provided by the mesh partition Query node. The original positions of the points, before any PCG operations, have to be stored in a FVector attribute (for example, SourcePositions). Alternatively, you can keep the original position unaltered in the Position attribute and modify the Destination Positions attribute instead.

[image: Mesh partition Write node settings]

### Patch Instance Spawner

The mesh partition **Patch Instance Spawner** spawns patch instance modifiers from its input PCG points.

[image: Mesh partition Patch Instance Spawner node settings]

### Mesh Projection Instance Spawner

The mesh partition Mesh Projection Instance Spawner spawns mesh projection instance modifiers from its input PCG points.

[image: Mesh partition Mesh Projection Instance Spawner node settings]

- landscape
- pcg
- mesh terrain

On this page

- PCG Mesh Partition nodes (-> pcg-and-mesh-terrain-in-unreal-engine)
- Query (-> pcg-and-mesh-terrain-in-unreal-engine)
- ToPoint (-> pcg-and-mesh-terrain-in-unreal-engine)
- Write (-> pcg-and-mesh-terrain-in-unreal-engine)
- Patch Instance Spawner (-> pcg-and-mesh-terrain-in-unreal-engine)
- Mesh Projection Instance Spawner (-> pcg-and-mesh-terrain-in-unreal-engine)

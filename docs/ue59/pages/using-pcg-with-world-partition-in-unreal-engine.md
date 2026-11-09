# Using PCG with World Partition

https://dev.epicgames.com/documentation/en-us/unreal-engine/using-pcg-with-world-partition-in-unreal-engine?application_version=5.9

> Learn how PCG works with World Partition Data Layers and HLOD Layers.

When PCG assets are assigned to an World Partition - Data Layer (-> world-partition---data-layers-in-unreal-engine) and a HLOD Layer (-> world-partition---hierarchical-level-of-detail-in-unreal-engine), the PCG graph generates the actors and assigns them to the same data layer and HLOD layer.

## Using Data Layers

In the example below, there are two partitioned (-> using-pcg-generation-modes-in-unreal-engine) PCG volumes. One generates rock meshes and is assigned to the **DL_Rocks** data layer. The other generates tree meshes and is assigned to the **DL_Trees** data layer.

[image: A generated tree selected in the Data Layers window. It is assigned to the DL_Trees data layer.]

Selecting the generated meshes in the **Data Layers** window shows that the rocks are automatically assigned to **DL_Rocks** and the trees are automatically assigned to **DL_Trees**.

### Data Layer Settings for Spawn Actor and Create Target Actor Nodes

The Spawn Actor and Create Target Actor nodes each have a setting called Data Layer Source Type that controls how the node assigns actors to a Data Layer.

[image: The Data Layer Settings.]

The Data Layer Source Type can be set to the following options:

- **Self**: The Spawn Actor or Create Target Actor node assigns the same Data Layers to the spawned actors as the source PCG Component actor.
- **Data Layer References**: The node assigns Data Layers using an input Param Data set by the **Data Layer Reference** **Attribute**.

The Spawn Actor and Create Target Actor nodes support filtering using the **Included Data Layers** and **Excluded Data Layers** properties, which can be inputs or direct references.

There is also an **Add Data Layers** category where you can specify additional Data Layers to assign, either as input or as direct references.

### Get Actor Data Layers

The **Get Actor Data Layers** node reads the **ActorReference** attribute from the inputs, and then outputs all the Data Layers used by those inputs into the **DataLayerReference** attribute. The output is a single Param Data that contains one entry per Data Layer asset.

[image: The Get Actor Data Layers node]

### Partition By Actor Data Layers

The **Partition By Actor Data Layers** node takes Point Data as input, and outputs one or more partitions of Point Data based on the Data Layers in the input Point Data.

[image: The Partition by Actor Data Layers node.]

The node resolves input points using an **ActorReference** attribute to get the Data Layers used by the Actor. Then it creates a Point Data and a Data Layer Partition for every combination of those Data Layers found on the input.

To include or exclude data layers from the process, use the **Included Data Layers** and **Excluded Data Layers** inputs on the node, or use **DataLayer** asset references in the node settings.

[image: Using a DataLayer asset reference in the node settings] Using a DataLayer asset reference in the node settings

When using Included Data Layers, any other Data Layer will be ignored. When using Excluded Data Layers, all Data Layers will be considered except for the excluded Data Layers.

#### Example 1

The input data has three Points that point to three different actors. One actor uses **DataLayerA**, and the other two actors use **DataLayerB**.

The output will include two Point Data, and two Data Layer Partitions (stored as Param Data).

The first Point Data will contain the point that is using **DataLayerA. **The second Point Data will contain both points that are using **DataLayerB**.

The first Data Layer Partition will contain one entry with a **DataLayerReference** attribute pointing to the **DataLayerA **asset. The second partition will contain one entry with a **DataLayerReference** attribute pointing to the **DataLayerB** asset.

#### Example 2

The input has the following Points:

- a Point that resolves to **DataLayerA**
- a Point that resolves to **DataLayerB**
- a Point that resolves to both **DataLayerA** and **DataLayerB**

The output will include three Point Data with a single point each, and three Param Data.

The first Point Data will contain the point that is using DataLayerA. The second Point Data will contain the point that is using DataLayerB. The third Point Data will contain the point that is using both **DataLayerA** and **DataLayerB**.

The first Data Layer Partition will contain one entry with a DataLayerReference attribute pointing to the DataLayerA asset. The second partition will contain one entry with a DataLayerReference attribute pointing to the DataLayerB asset. The third partition will contain two entries, one that points to the **DataLayerA** asset and one that points to the **DataLayerB** asset.

## Using HLOD Layers

In the example below, there is a **Surface Sampler** that generates rock meshes.

[image: A Blueprint graph showing a Surface Sampler.]

The PCG Graph that contains the sampler is set to assign all of its components and actors to an HLOD layer called **MyHLODLayer**.

[image: The PCG graph's HLOD settings.]

Selecting the generated meshes shows that the generated rocks are automatically assigned to **MyHLODLayer**.

[image: Multiple rock meshes are selected. All of them are assigned to MyHLODLayer.]

### HLOD Settings for Spawn Actor and Create Target Actor Nodes

The Spawn Actor and Create Target Actor nodes each have a setting called **HLODSource Type** that controls how the node assigns actors to an HLOD Layer.

[image: The HLODSource Type setting]

The **HLODSource Type** can be set to the following options:

- **Self**: The Spawn Actor or Create Target Actor node assigns the same HLOD Layer to the spawned actors as the source PCG Component actor.
- **Reference**: The node assigns an HLOD Layer through a direct reference to the HLOD Layer on the node settings.
- **Template**: The node uses the HLOD Layer reference from its Template Actor.

On this page

- Using Data Layers (-> using-pcg-with-world-partition-in-unreal-engine)
- Data Layer Settings for Spawn Actor and Create Target Actor Nodes (-> using-pcg-with-world-partition-in-unreal-engine)
- Get Actor Data Layers (-> using-pcg-with-world-partition-in-unreal-engine)
- Partition By Actor Data Layers (-> using-pcg-with-world-partition-in-unreal-engine)
- Example 1 (-> using-pcg-with-world-partition-in-unreal-engine)
- Example 2 (-> using-pcg-with-world-partition-in-unreal-engine)
- Using HLOD Layers (-> using-pcg-with-world-partition-in-unreal-engine)
- HLOD Settings for Spawn Actor and Create Target Actor Nodes (-> using-pcg-with-world-partition-in-unreal-engine)

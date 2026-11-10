# nDisplay Actor Replication

https://dev.epicgames.com/documentation/en-us/unreal-engine/ndisplay-actor-replication-in-unreal-engine?application_version=5.9

> An overview of how to control Actor replication across your nDisplay cluster.

[image: nDisplay Actor Replication]

All inputs to the nDisplay system are handled only by the primary node. Without any replication, only the primary node would see changes in the scene. Therefore, the primary node needs to be able to replicate changes to all other parts of the nDisplay network.

To accomplish this, nDisplay offers two different kinds of Components that you can attach to your Actors:

- The **DisplayClusterSceneComponentSyncParent** Component tracks changes in the 3D transforms of its parent Component, and pushes those changes to the other cluster nodes in the network. The default DisplayClusterPawn used by the nDisplay system uses this Component.

- The **DisplayClusterSceneComponentSyncParent** Component tracks changes to the 3D transforms of its child components, and pushes those changes to the other cluster nodes in the network.

For example, in the Actor shown below, the **DisplayClusterSceneComponentSyncParent_Scene** Component tracks and replicates changes to the 3D transforms of its parent Actor as the Actor moves around the Level. The **DisplayClusterSceneComponentSyncThis** Component tracks and synchronizes movements of its child Static Mesh component as it moves relative to the scene graph root.

 [image: DisplayClusterSceneComponentSyncParent]

If you have other Actors in your scene that can be affected during gameplay, you must use one of these two Components to replicate those changes to all nodes. To do this:

- Select the Actor you need to replicate in the Level viewport or the **World Outliner** panel.

- In the **Details** panel, click **+ Add Component**. Search for either **DisplayClusterSceneComponentSyncParent** or **DisplayClusterSceneComponentSyncThis**, and select it from the list. [image: Add an nDisplay sync Component]

These components do not carry out a full replication. Only the transforms of the parent Actor or of child Components are sent to the cluster.

## Replicating Custom Data

If you need to replicate other custom data between your primary node and the rest of your cluster, you can write your own C++ class that implements the `IDisplayClusterClusterSyncObject` interface. nDisplay will automatically invoke the methods in this interface to check whether each instance of this class needs to be synchronized from the primary node to the other cluster nodes.

- rendering
- vfx
- graphics
- guide
- ndisplay

On this page

- Replicating Custom Data (-> ndisplay-actor-replication-in-unreal-engine)

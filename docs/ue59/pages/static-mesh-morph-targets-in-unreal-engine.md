# Static Mesh Morph Targets

https://dev.epicgames.com/documentation/en-us/unreal-engine/static-mesh-morph-targets-in-unreal-engine?application_version=5.9

> Deforming a StaticMesh using morph targets and WorldPositionOffset.

[image: Static Mesh Morph Targets]

**Morph Targets** provide a way to deform a mesh from its base form towards a target form. Generally, these are used with SkeletalMeshes as part of the Animation system; however, using the `StaticMeshMorpher.ms` maxscript and the **StaticMeshMorphTarget** Material Function (-> material-functions-in-unreal-engine), StaticMeshes also have the ability to be setup for deformation using morph targets.

This method performs the deformation by using multiple UV channels, vertex colors, and the WorldPositionOffset. The offsets of the vertices for each morph target are stored as vertex colors in a UV channel. The StaticMeshMorphTarget Material Function then extracts these and makes them available within the Material. By passing them to the WorldPositionOffset input of the material, the vertices of the mesh can be transformed to the positions of the vertices in the morph target.

## Script Setup and Installation

The `StaticMeshMorpher.ms` maxscript is located in your build at `UE/Engine/Extras/FX_tools/3DSMax2012_x64/`.

**To run the** `StaticMeshMorpher.ms` **maxscript:**

- In 3dsMax, in the **MAXScript** menu choose **Run Script...**.

- Navigate to the location of the `StaticMeshMorpher.ms` maxscript in your build and open it.

- The script's interface is displayed and ready to be used.

The script can also be bound to a key combination or added to a custom menu to make running it faster and easier.

## Creating Morph Targets

Morph targets require multiple instances of the same mesh with their vertices transformed. For example,
a melting ball of ice could have three forms:

|  |  |  |
| --- | --- | --- |
| [image: Game Model] | [image: Morph target 1] | [image: Morph target 1] |
| Game Model | Morph Target 1 | Morph Target 2 |

The morph targets are packed into UV channels 2 and 3 (assuming two morph targets are being packed),
and the normals for morph target 1 can also be stored in the mesh's vertex colors if desired.

**To pack morph targets:**

- Press the [image: Pick Game Mesh] button and then select the game model mesh in the scene. [image: Game Mesh Selected]

- Press the [image: Pick Morph Target 1] button and then select the mesh for the first morph target in the scene. [image: Morph Target 2 Selected]

- Repeat the process above for the second morph target in the scene, if one exists. [image: Morph Target 2 Selected]

- Check the **Store Morph 1 Normals** checkbox if desired.

- Press the [image: Pack Morph Targets] button to begin the process of packing the morph targets into the UV channels. [image: Morph Packing Progress]

- The mesh can be exported from 3dsMax and imported into Unreal normally. See **FBX Static Mesh Pipeline (-> fbx-static-mesh-pipeline-in-unreal-engine)** for details on this process.

## Material Setup

The StaticMeshMorphTargets function provides access to the morph targets and normals inside the Material applied to the StaticMesh. This function has two outputs corresponding to the two morph targets and one output for the normals. The morph target outputs provide values that can be plugged into the WorldPositionOffset input channel of the Material node, while the normal output, as you might expect, can be connected to the Normal input channel of the Material node.

In order to allow for morphing between the base mesh and the morph targets, one or more LinearInterpolate expressions are used with a single ScalarParameter driving the Alpha input. This allows the morph targets to be driven at runtime by gameplay code or Sequencer.

An example setup (only the morph network) is shown here:

The result as the Time parameter in the network above goes from 0 to 1 is shown below:

- static mesh
- morph target

On this page

- Script Setup and Installation (-> static-mesh-morph-targets-in-unreal-engine)
- Creating Morph Targets (-> static-mesh-morph-targets-in-unreal-engine)
- Material Setup (-> static-mesh-morph-targets-in-unreal-engine)

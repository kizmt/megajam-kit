# Skeletal Controls

https://dev.epicgames.com/documentation/en-us/unreal-engine/animation-blueprint-skeletal-controls-in-unreal-engine?application_version=5.9

> Animation nodes that enable direct manipulation and applying solvers to the bones of the target Skeleton.

[image: Skeletal Controls]

With **Skeletal Control** Animation Blueprint (-> animation-blueprints-in-unreal-engine) nodes you can take direct control of a character's Skeleton asset (-> skeletons-in-unreal-engine). Skeletal Control nodes can be used within a character's Animation Blueprint, on the **AnimGraph**, to control an individual bone, create IK chains, and other procedural, dynamic bone-driven animations.

 [image: overview skeletal control nodes]

Skeletal Control nodes are structured similarly to other AnimBP nodes. The node can receive an animation pose through the **input pin** and generates a modified pose through the **output pin**. Most Skeletal Control nodes operate and compute transforms in the **Component Space**. Animation poses generated in **Component Space** calculate bone transforms relative to the Skeletal Mesh Component (-> skeletal-mesh-assets-in-unreal-engine) of your character as opposed to the bone's Parent Bone. Component space pose pins appear as blue in the Anim Graph.

 [image: skeletal control animation blueprint node with highlighted input and ouput pins component pose]

You can convert poses from Local Space to Component space with space conversion nodes (-> animation-blueprint-component-space-conversion-in-unreal-engine).

 [image: space conversion nodes]

Space Conversion nodes have an associated cost to your project's performance. It is recommended that space conversions occur as infrequently as possible by grouping specific space reliant functions together, near the final pose node when possible.

An **alpha value** is also common among Skeletal Control nodes. Similar to Blend nodes (-> animation-blueprint-blend-nodes-in-unreal-engine) the alpha value controls the degree of applied modification to the source pose, when generating the new pose.

 [image: skeletal control node with the alpha pin highlighted]

In the case of Skeletal Control nodes, a float value between 0.0 and 1.0 is used as the alpha value to determine the weight of the applied Skeletal Transform. A value of 0.0 gives full weighting to the input pose, while a value of 1.0 gives full weighting to the control's computed Transform.

Within the **Details** panel of each Skeletal Control node, you can also set the **LOD Threshold** in which the node is considered. The value defined as the LOD Threshold will be the highest LOD level the Skeletal Control node will be used. Any higher LOD levels (-> skeletal-mesh-lods-in-unreal-engine), (lower quality models), will ignore the Skeletal Control node.

 [image: lod level of detail threshold property in details panel of skeletal control nodes]

By restricting the LOD level Skeletal Control nodes to compute bone transforms, you can reduce the performance cost of your animation system.

## Skeletal Control Nodes

Here you can reference additional documentation about each of the Skeletal Control Nodes you can use in your projects.

- animation
- animation blending
- skeletal controls

On this page

- Skeletal Control Nodes (-> animation-blueprint-skeletal-controls-in-unreal-engine)

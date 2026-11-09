# Space Conversion Nodes

https://dev.epicgames.com/documentation/en-us/unreal-engine/animation-blueprint-component-space-conversion-in-unreal-engine?application_version=5.9

> Animation nodes that convert poses between local and component space.

[image: Space Conversion Nodes]

Animation Blueprint nodes on the **AnimGraph** calculate and generate new poses that drive animations in either the **Local Space** or a **Component Space**. Animation poses generated in **Local space** calculate bone transforms relative to the bones **parent bone**. Animation poses generated in **Component Space** calculate bone transforms relative to the Skeletal Mesh Component (-> skeletal-mesh-assets-in-unreal-engine) of your character.

 [image: space conversion nodes overview]

The **Convert Spaces** nodes available in the **AnimGraph** of Animation Blueprints provides the ability to convert poses between **local** and **component** space.

When working with poses in an Animation Blueprint, most nodes will operate within Local Space, indicated with **white** pose input and output pins. However, certain blend nodes (-> animation-blueprint-blend-nodes-in-unreal-engine) and all skeletal controls nodes (-> animation-blueprint-skeletal-controls-in-unreal-engine), operate in **Component Space**, indicated with **blue** pose input and output.

To use nodes that operate within Component Space, poses must first be converted to Component Space using the Local to Component conversion node.

 [image: local to component space conversion node animbp animgraph]

After an animation pose has undergone component space operations, it must be converted back to local space in order to be usable by additional nodes, or provide a final pose for the output node.

 [image: component to local space conversion node animbp animgraph]

Because there is a cost associated with each conversion **to** or **from** Component Space, it is best to group any nodes that operate in Component Space, to reduce the number of conversions needed.

- animation
- blueprints
- programming
- animation features

Related documents

Blueprints Visual Scripting

 [image: Blueprints Visual Scripting] (-> blueprints-visual-scripting-in-unreal-engine)

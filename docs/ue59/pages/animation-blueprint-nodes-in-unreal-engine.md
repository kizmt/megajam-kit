# Animation Node Reference

https://dev.epicgames.com/documentation/en-us/unreal-engine/animation-blueprint-nodes-in-unreal-engine?application_version=5.9

> Descriptions of the various animation nodes available for use in Animation Blueprints.

[image: Animation Node Reference]

An Animation Blueprint (-> animation-blueprints-in-unreal-engine) (**AnimBP**) is a special class of Blueprint (-> blueprints-visual-scripting-in-unreal-engine) that specifically controls an object's animations behaviors. AnimBPs are divided into two graphs, the EventGraph (-> graphing-in-animation-blueprints-in-unreal-engine), for controlling the animation logic and interaction behaviors, and the AnimGraph (-> graphing-in-animation-blueprints-in-unreal-engine), which controls the animation pose output for the object. Each graph within an AnimBP uses nodes (-> nodes-in-unreal-engine) to perform operations. These nodes can be classified into a few distinct types based on their function in an AnimBP.

## Animation Node Structure

AnimBP nodes on the AnimGraph and EventGraph can have **input** and **output** pins in which information can be passed.

 [image: input and output pins]

AnimBP nodes can also have property pins, such as data values or variables that can be modified with linked functions in the AnimBP AnimGraph and EventGraph.

 [image: property pins]

AnimBP node properties can also be accessed in the node's **Details** panel after selecting the node in the AnimBP.

 [image: animbp node details panel]

## EventGraph Nodes

Event graph nodes are used to process incoming data that in turn is used to drive the pose data in the Anim Graph, such as triggering playback, activating or disabling animations functions, and updating animation data.

 [image: event graph animation blueprint example]

With the **Animation Events** documentation, you can reference the function and properties of **EventGraph** AnimBP nodes.

## AnimGraph Nodes

Using data from the **EventGraph**, **AnimGraph** nodes determine the actual frame-by-frame pose to use for the animating object.

 [image: anim graph animation blueprint example]

Here you can access a reference doc for each of the main types of Anim Graph Nodes.

## Animation Node Pose Watching

When working in an AnimBP, you can toggle **Pose Watching** on specific AnimBP nodes to see a color coded debug drawing of the pose that it is generating in the **Viewport**.

 [image: pose watch animation blueprint example]

To toggle an AnimBP node to pose watch, **right-click** on a node that contains pose data and select **Toggle Pose Watch** from the context menu.

 [image: pose watch animation blueprint example]

You can also have multiple nodes toggled to Pose Watch at once, allowing you to compare poses at different points in the AnimBP to find the exact point in which any errors in your current pose are introduced.

By clicking the icon in the upper left corner of the node You can hide the node's watched pose. To change a node's watched pose color, open the **Pose Watch Manager** by navigating in the **Menu Bar** to **Window > Pose Watch Manager** and select the color option next to the desired pose.

 [image: pose watch manager animation blueprint example]

You can disable a Pose Watch from the color picker window or by reselecting **Toggle Pose Watch** on the Animation Node.

- animation
- blueprints
- programming
- animation features

On this page

- Animation Node Structure (-> animation-blueprint-nodes-in-unreal-engine)
- EventGraph Nodes (-> animation-blueprint-nodes-in-unreal-engine)
- AnimGraph Nodes (-> animation-blueprint-nodes-in-unreal-engine)
- Animation Node Pose Watching (-> animation-blueprint-nodes-in-unreal-engine)

Related documents

Blueprints Visual Scripting

 [image: Blueprints Visual Scripting] (-> blueprints-visual-scripting-in-unreal-engine)

# Using a Multi Line Trace (Raycast) by Object

https://dev.epicgames.com/documentation/en-us/unreal-engine/using-a-multi-line-trace-raycast-by-object-in-unreal-engine?application_version=5.9

> This tutorial covers using a Multi Line Trace by Object Blueprint node to return all World Dynamic Actors it hits, and prints their names.

[image: Using a Multi Line Trace (Raycast) by Object]

**Multi LineTrace For Objects** will perform a collision trace along a given line and return all hits encountered, returning only objects that match one of the specified Object Types. Below, you will find steps for setting up a **Multi LineTrace For Objects** Blueprint.

## Steps

- Follow the steps used for the Line Trace By Channel (-> using-a-single-line-trace-raycast-by-channel-in-unreal-engine) example to set up a trace.

- Replace the **Line Trace By Channel** node with the **Multi Line Trace For Objects** node.

- Drag off the **Object Types** pin and add a **Make Array** node, then use the drop-down menus to add Objects to the Array. [image: Drag off the Object Types pin and add a Make Array node then use the drop-down menus to add Objects to the Array] Here we assign **WorldDynamic** and **PhysicsBody** as our Object Types. You can use the **Add pin** button to add more Object Types to the Array.

- Drag off the **Out Hits** pin of the trace node and add a **For Each Loop** node. [image: Drag off the Out Hits pin of the trace node and add a For Each Loop node] This will allow us to do something for each of the Actors hit by the trace.

- Drag off the **Array Element** and add a **Break Hit Result** node. Then, drag off the **Hit Actor**, add a **Get Display Name (Object)** node and connect to a **Print String** node. Click image for a full view. This will now print to the screen each of the Actors hit by the array.

## Result

Here, we have a hanging ceiling light (World Dynamic Object Type) in front of a Physics Actor (Physics Body Object Type).

 [image: A hanging ceiling light World Dynamic Object Type in front of a Physics Actor Physics Body Object Type]

Multi LineTrace For Objects, unlike Multi Line Trace by Channel, does not stop at the first object it hits, which is why the trace continues through the light to the cube.

- gameplay
- physics
- tracing
- raycast

On this page

- Steps (-> using-a-multi-line-trace-raycast-by-object-in-unreal-engine)
- Result (-> using-a-multi-line-trace-raycast-by-object-in-unreal-engine)

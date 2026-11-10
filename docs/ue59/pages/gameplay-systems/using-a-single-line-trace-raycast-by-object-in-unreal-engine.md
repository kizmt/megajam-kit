# Using a Single Line Trace (Raycast) by Object

https://dev.epicgames.com/documentation/en-us/unreal-engine/using-a-single-line-trace-raycast-by-object-in-unreal-engine?application_version=5.9

> This how-to guide covers using a Single Line Trace by Object Blueprint node to return the first World Dynamic Actor it hits, and prints its name.

[image: Using a Single Line Trace (Raycast) by Object]

**Line Trace For Objects** will perform a collision trace along a given line and return the first Object the trace hits that matches one of the specified Object Types. To set up a **Line Trace For Objects** Blueprint, do the following:

## Steps

- Follow the steps used for the Line Trace By Channel (-> using-a-single-line-trace-raycast-by-channel-in-unreal-engine) example to set up a trace.

- Replace the **Line Trace By Channel** node with the **Line Trace For Objects** node.

- Drag off the **Object Types** pin and add the **Make Array** node. [image: Drag off the Object Types pin and add the Make Array node]

- On the **Make Array** node, specify the **ObjectType** you want to trace for (via the drop-down menu). [image: Specify the ObjectType you want to trace for via the drop-down menu] Here, we are tracing for **WorldDyanmic** Objects. You can add more by clicking the **Add Pin** button.

- You can set the rest of the trace up the same way a **Line Trace By Channel** is setup. Click image for a full view.

## Result

We have added a single WorldDynamic Object to our level.

 [image: A single WorldDynamic Object in our level]

Only the added Actor is now returning as a hit; consequently, the cubes (since they are Physics Actors) do not return a hit.

- gameplay
- physics
- tracing
- raycast

On this page

- Steps (-> using-a-single-line-trace-raycast-by-object-in-unreal-engine)
- Result (-> using-a-single-line-trace-raycast-by-object-in-unreal-engine)

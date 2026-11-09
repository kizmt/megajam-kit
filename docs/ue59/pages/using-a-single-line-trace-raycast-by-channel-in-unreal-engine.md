# Using a Single Line Trace (Raycast) by Channel

https://dev.epicgames.com/documentation/en-us/unreal-engine/using-a-single-line-trace-raycast-by-channel-in-unreal-engine?application_version=5.9

> This how-to guide covers using a Single Line Trace by Channel Blueprint node to return the first Actor it hits that responds on the Visibility channel, and prints its name.

[image: Using a Single Line Trace (Raycast) by Channel]

**Line Trace By Channel** will perform a collision trace along a given line and return the first Object that the trace hits. Below, you will find steps for setting up a **Single Line Trace By Channel** Blueprint.

## Steps

- Create a new project using the **Blueprint First Person** template with **Include Starter Content** and open the project.

- In the **FirstPerson/Blueprints** folder, open the **BP_FirstPersonCharacter** Blueprint.

- Right-click in the graph, search for and add an **Event Tick** node. [image: Add an Event Tick node] This will cause the trace to run every frame.

- Drag off the execute pin, then search for the **Line Trace By Channel** node. [image: Search for the Line Trace By Channel node]

- While holding down the **Ctrl** key, drag in the **First Person Camera** component. [image: Drag in the First Person Camera component] The camera is where we will start our trace from.

- Drag off the **First Person Camera** node, and add a **Get World Location** node, then connect it to the **Start** of the trace.

- Drag off the **First Person Camera** node again and add a **Get World Rotation** node. [image: Add a Get World Rotation node] Here, we are starting the trace from the location of the First Person Camera, then we are getting the rotation of the First Person Camera.

- Drag off the **Get World Rotation** node and add a **Get Forward Vector**, then drag off that and add a **Vector * Float** node set to **1500**. [image: Drag off the Get World Rotation node and add a Get Forward Vector then drag off that and add a Vector Multiple Float node set to 1500] We are getting the rotation and the forward vector, extending outward from it by 1500 (this value is the length of the trace).

- Drag off the **Get World Location** node and add a **Vector + Vector** node, connecting (as shown below) to the **End** of the Line Trace By Channel node. [image: Drag off the Get World Location node and add a Vector Plus Vector node connecting to the End of the Line Trace By Channel node] Here, we are taking the location of the First Person Camera and extending out from it, 1500 units based on its rotation and forward vector.

- On the Line Trace By Channel node, set the **Draw Debug Type** to **For One Frame**. [image: Set the Draw Debug Type to For One Frame on the Line Trace By Channel node] This will allow us to see a debug line while playing in-game to see our line trace.

- Drag off the execution out pin of the Line Trace By Channel node and add a **Print String** node. [image: Drag off the execution out pin of the Line Trace By Channel node and add a Print String node]

- Drag off the **Out Hit** pin and search for **Break Hit** then add a **Break Hit Result** node. [image: Drag off the Out Hit pin and search for Break Hit then add a Break Hit Result node]

- Drag off the **Hit Actor** pin (off of the **Break Hit Result** node), add a **To String (Object)** node, and connect it to the **Print String** node. Click image for a full view. This will allow us to debug print the object we hit with our trace.

- Click the **Compile** button, then play in the Editor and look at the cubes in the level. [image: Play in the Editor and look at the cubes in the level] Here, we have ejected from the First Person's perspective so that you can see the view angle of the trace. You should see that when the trace hits a cube, it prints the cube to the screen.

## End Result

The example above returns all Objects that are set to respond to the provided Trace Channel, however, there may be instances when you want to only return certain objects. In the example above, you can use the **Actors to Ignore** pin, taking an Array of Actors that should be ignored by the trace (this means that you have to specify each Actor to ignore).

You can also perform a **Line Trace By Object** where only the specified **Object Types** are returned. This will allow you to target a specific set of Objects (only to be included in the trace).

- gameplay
- physics
- tracing
- raycast

On this page

- Steps (-> using-a-single-line-trace-raycast-by-channel-in-unreal-engine)
- End Result (-> using-a-single-line-trace-raycast-by-channel-in-unreal-engine)

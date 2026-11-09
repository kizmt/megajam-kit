# Creating Functions

https://dev.epicgames.com/documentation/en-us/unreal-engine/creating-functions-in-unreal-engine?application_version=5.9

> Create a Function which displays text when a key is pressed.

[image: Creating Functions]

**Functions** are node graphs belonging to a particular **Blueprint** that can be executed, or called, from another
graph within the Blueprint. Functions have a single entry point designated by a node with the name of the Function
containing a single exec output pin. When the Function is called from another graph, the output exec pin is activated
causing the connected network to execute.

The steps below will guide you through creating a Function which will print text to the screen when a button is pressed.

- Inside the **Content Browser**, click the **New** Button then select **Blueprint Class**.

- In the **Pick Parent Class** window, select **Actor**.

- Name the Blueprint, then **Double-click** on it to open it up in the Blueprint Editor.

- **Right-click** in the graph and search for and add the **Event Begin Play** Event. This node will execute once when the game is launched, along with any script that follows it.

- **Right-click** in the graph and search for and add the **Get Player Controller** node. This will get the currently assigned player controller and allow us to Enable Input for this Blueprint.

- **Right-click** in the graph and search for and add the **Enable Input** node. This is the node which will allow input to be received for this Blueprint.

- Connect the nodes as shown below. When the game is launched, we get the player controller and enable input from it in this Blueprint.

- In the **MyBlueprint** window, click the **Add New Function** button.

- Select the new function in the **My Blueprint** window and press **F2** to rename it. Give the Function a name such as "Print Text".

- In the Function's graph, drag off the **Print Text** pin and search for and add a **Print String** node.

- In the **In String** box, you can leave or change the text to the text you want to display in-game.

- Click the **Event Graph** tab to return to the Event Graph.

- **Right-click** in the graph and search for and add an **F** Key Event.

- Drag off the **Pressed** pin and search for and add your **Print Text** function. When **F** is pressed, it will call the Print Text function which is set to print text to the screen using a Print String. If you do not see your function, try clicking the **Compile** button from the Toolbar then try your search again.

- Your network should look similar to below.

- Click the **Compile** button then close the Blueprint.

- Drag the Blueprint into the level, then click the **Play** button to play in the Editor.

- Press **F** and the Function will be called and print your text to the screen.

While this example Function only prints text to the screen when a key is pressed, you could add more script to the Function which would be executed by the assigned key press.

For example, your Function could be used to cast a spell when the key is pressed and the script containing the spawning of the spell and its location, the effects associated with the spell and how it affects the world, or if it damages other Actors could all be contained within the function leaving your Event Graph free from all that script which would be contained neatly within the Function.

There are other ways Functions can be used and accessed, for more on Functions please see the **Related Topics** section below.

- blueprints
- blueprint

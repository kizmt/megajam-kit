# Loading and Unloading Levels using Blueprints

https://dev.epicgames.com/documentation/en-us/unreal-engine/loading-and-unloading-levels-using-blueprints-in-unreal-engine?application_version=5.9

> How to stream levels with a custom streaming Actor created with Blueprints

[image: Loading and Unloading Levels using Blueprints]

We want to start streaming in the patio level here, so that by the time the player rounds the corner and begins approaching the patio, the streaming level
will be loaded and visible.

As part of the setup, we have two levels, **SunTemple_Persistent** and **SunTemple_Streaming**. Our **Player Start** is in **SunTemple_Persistent**, and our player in the game is
represented by a Character.

- Open **SunTemple_Persistent** in the **Content Browser**.

- Move the **Player Start** to the very beginning of the temple.

- Click on **Windows**, then select **Levels**.

- Click on the **Levels** dropdown menu, then select **Add Existing...** to add a new sublevel.

- Select **SunTemple_Streaming** to add in the **Open Level** dialog, then click on **Open**.

- **Right-click** on **Persistent Level** and select **Make Current** from the dropdown menu.

## Streaming In Levels with Blueprints

- Open the **Content Browser** and create a new **Blueprint Class**. This class is going to be based on **Actor**.

- Name the new **Blueprint Class** "LevelStreamer", then save it.

- Open **LevelStreamer** in the **Blueprint Editor**.

For this scenario, we want to stream the second level in once the **Character** overlaps the Box Component.

- Add a **Box Collision** Component using the **Add Component** button in the **Components** tab.

- Open the Blueprint's **Event Graph**. Select the **Box** Component in the **Components** tab, then **right-click** in the graph to summon the context menu.

- Type "begin overlap" then select **On Component Begin Overlap** to add the event.

- Click and drag off of the **Other Actor** pin, then type "=" into the context menu's search. Select the **Equal (Object)** entry to add the node.

- Click and drag off of the second Object pin on the **==** node, then type "character" into the context menu's search. Select the **Get Player Character** entry to add the node.

- Hold down the **B** key and click in the graph to add a **Branch** node, then connect the boolean pin of the **==** node to the input on the **Branch** node.

- Connect the execution output pin of the **OnComponentBeginOverlap** node to the execution input pin of the **Branch** node.

- **Right-click** in the graph, then type "level" to search in the context menu. Select **Load Stream Level** from the menu.

- **Right-click** on the **Level Name** pin and promote it to a variable, then name the variable "LevelToStream" and make it **Editable** in the **Details** panel.

- Toggle **Make Visible After Load** and **Should Block on Load** to true on the **Load Stream Level** node. For this example, we are going to have the same default loading behavior for all levels using this Blueprint, but you could also make those **Editable** variables.

- Connect the **True** execution output pin of the **Branch** node to the input execution pin on the **Load Stream Level** node.

- Place your **LevelStreamer** Blueprint into your level, and adjust the placement and scale until it encompasses the part of the persistent world you want your **Character** to be in to begin streaming, as well as the entire walkable volume where the streaming level will be.

- Enter **SunTemple_Streaming** as the **Level to Stream**.

- Use Play In Editor to test out your streaming level.

## Unloading Levels with Blueprints

To unload the level as your Character exits the **Box** component, your graph will have very similar logic but will end in an **Unload Stream Level** node.

- level streaming

On this page

- Streaming In Levels with Blueprints (-> loading-and-unloading-levels-using-blueprints-in-unreal-engine)
- Unloading Levels with Blueprints (-> loading-and-unloading-levels-using-blueprints-in-unreal-engine)

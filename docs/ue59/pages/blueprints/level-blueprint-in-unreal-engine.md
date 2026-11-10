# Level Blueprint

https://dev.epicgames.com/documentation/en-us/unreal-engine/level-blueprint-in-unreal-engine?application_version=5.9

> Blueprints used for scripting level-specific events within maps.

[image: Level Blueprint]

A **Level Blueprint** is a specialized type of **Blueprint** that acts as a level-wide global event graph.
Each level in your project has its own Level Blueprint created by default that can be edited within the Unreal Editor, however new Level Blueprints
cannot be created through the editor interface.

Events pertaining to the level as a whole, or specific instances of Actors within the level, are
used to fire off sequences of actions in the form of Function Calls or Flow Control operations.
Those familiar with Unreal Engine 3 should be very familiar with this concept as this is very similar
to how Kismet worked in Unreal Engine 3.

Level Blueprints also provide a control mechanism for level streaming and Sequencer (-> real-time-compositing-with-sequencer-in-unreal-engine) as well
as for binding events to Actors placed within the level.

For more information about the Level Blueprint UI, see Blueprint Editor Level Blueprint UI (-> blueprints-visual-scripting-editor-user-interface-for-level-blueprints-in-unreal-engine).

## Default Level Blueprint

Each game can specify the default Level Blueprint class in the DefaultGame.ini config file. The Level Blueprints
for all new maps will be created using this class allowing for game-specific additions and functionality.

## Opening a Level Blueprint

To open a Level Blueprint for editing, click the **Blueprints** button in the **Level Editor Toolbar** and select **Open Level Blueprint**.

 [image: Level Blueprint Button]

This opens the Level Blueprint in the **Blueprint Editor**:

The **Blueprint Editor** only uses Graph Editor (-> graph-editor-for-the-blueprints-visual-scripting-editor-in-unreal-engine), **My Blueprints** panel, and **Details** panel. The **Class Defaults** panel using the **Class Defaults** button on the menu bar.

## Referencing Actors

Often, you will need to connect a reference to an Actor to a **Target** pin on a node in your Level Blueprint. To get a node that contains an Actor reference:

- Select the Actor in the **Level Viewport** or in the **World Outliner**.

- Open the Level Blueprint. [image: Level Blueprint Button]

- Right-click in the graph where you would like to add the node.

- Select **Create a reference to [SelectedActor]** in the context menu that appears.

Alternatively:

- Drag and drop an Actor from the **World Outliner** tab into a graph in the Level Blueprint. Click image for full view.

The Actor reference node that appears can be connected to any compatible **Target** pin.

In some cases, you will not need a reference node, as you can connect an output pin with the correct type to the **Target** input pin.

## Adding Events

There are two ways that Events (-> events-in-unreal-engine) for a specific Actor can be added to a Level Blueprint.

- Right-click an Actor in the Level, then in the context menu under **Level Blueprint**, select the Event you wish to add.

Alternatively, once you have your Actor selected:

- Open the Level Blueprint. [image: Level Blueprint Button]

- Right-click in the graph where you would like to add the node.

- In the context menu that appears, expand **Add Event for [ActorName]** and select your desired Event type.

- blueprints
- blueprint

On this page

- Default Level Blueprint (-> level-blueprint-in-unreal-engine)
- Opening a Level Blueprint (-> level-blueprint-in-unreal-engine)
- Referencing Actors (-> level-blueprint-in-unreal-engine)
- Adding Events (-> level-blueprint-in-unreal-engine)

Related documents

Blueprints Visual Scripting

 [image: Blueprints Visual Scripting] (-> blueprints-visual-scripting-in-unreal-engine)

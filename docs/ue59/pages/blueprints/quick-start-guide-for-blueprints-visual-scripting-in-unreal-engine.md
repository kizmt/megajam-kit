# Blueprints Quick Start Guide

https://dev.epicgames.com/documentation/en-us/unreal-engine/quick-start-guide-for-blueprints-visual-scripting-in-unreal-engine?application_version=5.9

> Get up and running by creating your first Blueprint.

[image: Blueprints Quick Start Guide]

This quick start guide will walk you through building an Actor in the level with different Components, then turning it into a Blueprint Class you can add launching behavior to so your Character will fly around the level! Making it into a Blueprint Class also means you can create as many launchpads in your world as you want, just by dragging into the level from the **Content Browser**.

## 1 - Required Project Setup

- From the New Project tab of the Unreal Project Browser, create a new project (-> creating-a-new-project-in-unreal-engine) from the Games category that uses the following settings: Side Scroller

- Blueprint

- With Starter Content

- Choose whatever scalability and quality settings work best for your setup. If you are unsure of what settings are right for you, you can find more information in the Project Settings (-> creating-a-new-project-in-unreal-engine) section.

- Name your project, then create it by clicking the **Create Project** button.

You should now be ready to jump into and start adding to the side-scroller level that appears.

## 2 - Construct your Launchpad

In the Level Editor, you will build a launchpad, then convert it to a Blueprint Class so you can add your gameplay behavior to it.

- First, move around in the viewport until you are looking at the top platforms in the level. We are going to create the container to hold all the parts of our launchpad by using the Empty Actor. The two parts (or Components) you will need are a shape to represent the launchpad, and a trigger for when the character overlaps it.

- In the Main Toolbar, press the **Modes** button, and from the dropdown click on **Select** to display the Place Actors panel.

- In the Place Actors panel, click on **Basic**, then find the **Empty Actor**.

- Drag it into the level so that it is sitting on one of the top platforms.

- Now that you have the Actor selected in the level, its properties are visible in the **Details** panel. At the top of the **Details** panel, you can rename it. Go ahead and click in the box to enter a new name, like **LaunchPad**.

- In the **Details** panel, click the **Add Component** button, then select **Cube** under **Common**.

- Click and drag the newly added **Cube** to the **DefaultSceneRoot** to make the **Cube** the new root.

- With the **Cube** component selected, change the **Scale** to (X: 1.0, Y: 1.0, Z: 0.1)

- Now, we will add a Box Collision Component, which will fire off an event whenever something overlaps it. In the **Details** panel, click the **Add Component** button, then (under **Collision**) select **Box Collision**.

- Change the **Box Collision** scale to ( X: 1.25, Y: 1.25, Z: 9.75) and location to ( X: 0, Y: 0, Z: 200) so the box covers and extends above the launch pad.

If at any time you need to change your Actor's properties, you can click on **LaunchPad (Instance)**, found in the **Details** panel, under the **Add Components** button.

Now that you have your Actor the way you want it, we will turn it into a Blueprint Class. You can add more components inside the **Blueprint Editor**, and tweak them just like you can in the Level.

## 3 - Convert Your Actor to a Blueprint Class

When you make changes inside the Blueprint, each time you make a new launchpad in the Level, it will have the look and feel that you have created in the **Blueprint Editor**. While you could simply duplicate your LaunchPad Actor around the level, any changes you make on a particular launchpad would only affect that one copy.

- In the **Details** panel, click on the **Blueprint/Add Script** button.

- The **Create Blueprint from Selection** dialog box appears. We are going to edit the default path of the Blueprint.

- Change the path from **Game/SideScrollerBP** to **Game/SideScrollerBP/Blueprints**.

- At this point, you could rename your Blueprint, or leave it as the default **LaunchPad_Blueprint**.

- Click on **Create Blueprint**.

Your Blueprint is now visible in the **Content Browser**. Right now, you could drag and drop from the **Content Browser** into the level to create lots of copies of your platform mesh and trigger, but there will not be any behavior on it yet. In the next step, you will start setting up the graph nodes inside of your Blueprint to launch your Character when it crosses the launchpad.

## 4 - Create Your Starting Point

To start adding behavior to your Blueprint Class, you will need to open it in the Blueprint Editor.

- Double-click the Blueprint Class in the **Content Browser**.

- The **Blueprint Editor** will open, and you can see your **Cube** and **Box** components in a viewport. At this point, if you adjust the **Box** Component's placement, it will be applied to all launchpads you make from this Blueprint Class. Just like when you were working with components on your LaunchPad Actor, you can select the **Box** component in the **Components** list and adjust the location. Try a location of (X: 0, Y: 0, Z: 350).

- Docked next to the **Viewport** tab is a **Construction Script** tab and an **Event Graph** tab. Since you are going to be creating gameplay behavior, you should start with the **Event Graph**. Click on that tab now. Events are the starting point of your Blueprint graph's execution, and can be associated with a number of different gameplay situations. A selection of the most commonly used events are visible right away, seen as translucent Event nodes. Though certainly useful for many of your Blueprint graphs, we will be making one of our very own.

- We want an event that will execute when anything overlaps our **Box** component. First, select the **Box** component in the **Components** tab.

- Right-click in an empty spot in your graph to bring up the context menu of nodes you could add to the graph. To move around in the graph, right-click and drag around. At this point, you could drag the graph to the left, moving the pre-placed event nodes off the left side of the screen and creating more blank space to create your launchpad logic in.

- We are adding an event for this Component, so expand the **Add Event for Box** dropdown, and then **Collision**. You could also use the search box, using "Component Begin Overlap" to filter the menu.

- Select **On Component Begin Overlap**.

Your graph now has an **OnComponentBeginOverlap** node. Any nodes connected to this event will execute when something overlaps the Box component of your launchpad.

In the next step of this guide, you will begin connecting nodes to the output pins of this node, and learn more about working with nodes in Blueprints.

## 5 - Test the Overlapping Actor

Right now, that **OnComponentBeginOverlap** event will execute when anything overlaps the Box trigger. We only want to actually execute our launching behavior, though, if the overlapping thing is our avatar, or Pawn. Think of it as asking "Is the Actor overlapping the Box trigger the same Actor as our Pawn?"

We will do that by working with the Other Actor output from the **OnComponentBeginOverlap** event.

- From the **OnComponentBeginOverlap** event, click on the **Other Actor** pin , drag into an empty spot on the graph, and release to display the context menu. The context menu is adaptive, filtering by the pin you are currently working with to show you only nodes that are compatible.

- Type **=** into the search box to filter the available nodes, then select **Equal (Object)**. We could set **Side Scroller Character** as the other input to the **Equal** node, but then if we changed the Character we were using, we would need to re-open this Blueprint and manually update that. Instead, let's get a reference to the current Pawn we are using.

- Right-click in an empty part of the graph to bring up the context menu.

- Type **Player Pawn** in the menu's search box, then (under **Game**) select **Get Player Pawn**.

- Connect the **Return Value** output on **Get Player Pawn** to the second input on the **Equal** node. Now that we have got a node that will tell us if the Other Actor is the Pawn our player controls, we will use the answer to change the execution flow of our graph. That is, we will direct the execution flow as it leaves the On Component Begin Overlap node. For that, we want to use a Flow Control node, specifically the **Branch** node.

- Drag off of the execution pin on the **OnComponentBeginOverlap** node and release in an empty part of the graph.

- Type **Branch** in the search, then select **Branch** from the context menu.

- Connect the output pin of the **Equals** node to the input Boolean pin on the **Condition** node.

The graph is now ready for you to set up different behavior to execute depending on whether the overlapping Actor is your Pawn or not. In the next step, we will do just that, and set up Blueprint nodes to launch our Character if the result of the **Equals** comparison is **True**.

## 6 - Launch Your Character

Our launchpad is going to work by using a function called **Launch Character**. The **Launch Character** function adds the velocity you specify to the Character's current velocity, allowing you to throw it in whichever direction you would like. It only works on Characters, though, so we need to make sure that our Pawn (avatar) is a Character (humanoid avatar).

We do this by casting. Casting attempts to convert your input into a different type, so you can access specific functionality that is only allowed for that particular type. It will succeed if your input is based on that type.

Everything you can place in your level is an Actor, in addition to any other specialized behavior added on later. That means that you can get a reference to anything in your level, cast it to **Actor**, and it will succeed. However, not everything in your level is the Pawn representing you in the game, so casting something to **Pawn** may or may not succeed.

- From the ****Get Player Pawn**** node, drag off of the **Return Value** pin.

- Begin typing **Cast to Character** in the search field of the context menu to find the node of the same name.

- From the **Cast to Character** node, drag off of the **As Character** pin.

- Type "Launch" into the search box, then select **Launch Character** in the context menu. Click image for full size. Notice that the output execution pin for successfully casting automatically connected to the input execution pin of **Launch Character**.

- Type **3000** into the Z field of the **Launch Character** node.

- Finally, connect the **Branch** node **True** execution pin to the **Cast to Character** node's input execution pin, so that **Cast to Character** and **Launch Character** only occur if the overlapping Actor is our Pawn. Click image for full size. At this point, **Compile** and **Save** the Blueprint using the toolbar buttons, then close the Blueprint Editor.

- Drag several of the launchpads into your Level from the **Content Browser**.

- Click on **Play** in the toolbar, then run around the Level (using WASD) and jump (using the Spacebar). Land on one of the platforms and watch as you go flying through the air!

## 7 - On Your Own!

Using what you have learned over the course of this Quick Start guide, try to do the following:

- Play a sound when your Character is launched using an Audio Component (-> basic-components-in-unreal-engine).

- Create a variable (-> blueprint-variables-in-unreal-engine) to store your Launch Velocity, and expose it so you can set it on each copy in the level.

- Add a Particle System Component (-> rendering-components-in-unreal-engine) to your Blueprint and use one of the Particle Systems (-> creating-visual-effects-in-niagara-for-unreal-engine) from the **Starter Content**.

- Add an Arrow Component (-> basic-components-in-unreal-engine) and use its rotation to define the direction to launch the character.

- Using Timelines (-> timelines-in-unreal-engine), add some animation to the Box Mesh to represent it launching the character.

For more information on Blueprint Visual Scripting, see the Blueprints (-> blueprints-visual-scripting-in-unreal-engine) page.

As for specifics covered in this quick start:

- For a quick overview of different types of Blueprint Classes you can make, see Blueprints Getting Started (-> introduction-to-blueprints-visual-scripting-in-unreal-engine)

- For more information on Blueprint Classes, see: Blueprint Classes (-> blueprint-class-assets-in-unreal-engine)

- For more short tutorials on creating and working with Blueprint Classes, see: Blueprints How-To (-> blueprint-workflows-in-unreal-engine)

- For more information on the Blueprint Editor, see: Blueprint Editor (-> user-interface-reference-for-the-blueprints-visual-scripting-editor-in-unreal-engine)

- blueprints

On this page

- 1 - Required Project Setup (-> quick-start-guide-for-blueprints-visual-scripting-in-unreal-engine)
- 2 - Construct your Launchpad (-> quick-start-guide-for-blueprints-visual-scripting-in-unreal-engine)
- 3 - Convert Your Actor to a Blueprint Class (-> quick-start-guide-for-blueprints-visual-scripting-in-unreal-engine)
- 4 - Create Your Starting Point (-> quick-start-guide-for-blueprints-visual-scripting-in-unreal-engine)
- 5 - Test the Overlapping Actor (-> quick-start-guide-for-blueprints-visual-scripting-in-unreal-engine)
- 6 - Launch Your Character (-> quick-start-guide-for-blueprints-visual-scripting-in-unreal-engine)
- 7 - On Your Own! (-> quick-start-guide-for-blueprints-visual-scripting-in-unreal-engine)

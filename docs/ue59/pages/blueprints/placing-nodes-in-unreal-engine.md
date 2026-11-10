# Placing Nodes

https://dev.epicgames.com/documentation/en-us/unreal-engine/placing-nodes-in-unreal-engine?application_version=5.9

> Illustrates the methods in which you can add nodes to Blueprints.

[image: Placing Nodes]

On this page, you will learn how you can place nodes on your graphs in Blueprints.

## Drag-and-Drop

The first method uses a **Drag-and-drop** procedure where you add nodes to your graph by dragging and dropping nodes from the **MyBlueprint** window onto your graph. For example, below we have several variables where we drag the **PlayerHealth** variable into and drop it in our graph so that we can use it in our script.

By **Left-clicking** on and dragging a variable into the Graph window, we are presented with two options, **Get** or **Set**. Selecting Get will create a **Getter** node which will get the variable or value of the variable while selecting Set will create a **Setter** node which will allow you to set the value of the variable. Depending upon the type of node, there may be instances where Get is the only option available.

In the image above, the top node is a Getter while the bottom node is a Setter. The Getter, for example, could be used as a condition for elements in your games (such as getting the Player Health and checking if that value is above a specified range and if not, killing the player). The Setter on the other hand, using the previous example, could be used to increase the Player's Health as you are telling the Player Health variable what its value should be by setting it.

You can also drag in any **Functions** or **Macros** you have created into your graph in the same manner.

- See Functions (-> functions-in-unreal-engine) or Macros (-> macros-in-unreal-engine) for more information.

There are some special context actions that become available when dragging in an **Event Dispatcher** as illustrated below.

You can select the action you wish to perform from the context menu that appears when dragging in an Event Dispatcher.

- See Event Dispatchers (-> event-dispatchers-in-unreal-engine) for more information.

## Context Menu Search

Most of the time when placing nodes, you will use the **Context Menu** which can be accessed by **Right-clicking** inside a Blueprint graph.

From the menu above, you can expand any category (or sub category) and select the node you wish to add to the graph.

There is also an option in the upper right corner of the window called **Context Sensitive** that is enabled by default but can be disabled which automatically filters the options presented in the menu based on the current context.

As you can see below, when **Right-clicking** and searching for **Animation** with **Context Sensitive** on, you are presented with a filtered list.

However, if you un-check **Context Sensitive** and search for **Animation**, you are presented with everything related to animation.

While **Right-clicking** in the graph brings up the Context Menu, you can drag off an existing node to access the Context Menu as well.

Above, we have a **Character Movement** Component Reference and by dragging off its out pin, we can add nodes that contextually make sense and are relevant to the node we are dragging off of as seen in the example below.

Above we can set the character's Max Walk Speed by searching for **Set Max Walk** then choosing **Set Max Walk Speed** from the menu.

## Keyboard Shortcuts

You can also use **Keyboard Shortcuts** to place (and work with) nodes, increasing your productivity.

- See Blueprint Editor Cheat Sheet (-> blueprint-editor-cheat-sheet-in-unreal-engine) for more information.

- blueprints
- blueprint

On this page

- Drag-and-Drop (-> placing-nodes-in-unreal-engine)
- Context Menu Search (-> placing-nodes-in-unreal-engine)
- Keyboard Shortcuts (-> placing-nodes-in-unreal-engine)

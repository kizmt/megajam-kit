# Blueprint Basic User Guide

https://dev.epicgames.com/documentation/en-us/unreal-engine/blueprint-basic-user-guide-in-unreal-engine?application_version=5.9

> A quick guide on the elements needed to begin working with Blueprints.

[image: Blueprint Basic User Guide]

This page aims to quickly get you started using **Blueprints** by covering the most basic use cases and commonly used actions.

For more detailed information on Blueprints, refer to the Blueprints Visual Scripting (-> blueprints-visual-scripting-in-unreal-engine) documentation.

## Creating Blueprints

There are several methods in which you can create Blueprints, the first is through the **Content Browser** using the **Add New** button:

- In the **Content Browser**, click the **Add New** button.

- Select **Blueprint Class** from the **Create Basic Asset** section of the dropdown menu. You can create several different types of Blueprint Assets (-> types-of-blueprints-in-unreal-engine) from the **Blueprints** option under **Create Advanced Asset**.

- Choose a **Parent Class** for your Blueprint Asset. See Parent Classes (-> blueprint-class-assets-in-unreal-engine) for more information. [image: Choose a Parent Class]

After you select your class, a new Blueprint asset will be added to the **Content Browser** which you can then assign a name.

### Create Blueprint Using Assets

You can also create a Blueprint by **Right-clicking** on an asset in the **Content Browser**, then under Asset Actions, selecting the **Create Blueprint Using This...** option.

This option is only available for assets that support it - Static Meshes, Skeletal Meshes, Particle Effects, Sound Cues or Sound Waves, etc. If the option is not available for the selected asset, it will appear grayed out.

After selecting the **Create Blueprint Using This...** option, you will be prompted on where you want to save the Blueprint. After confirming your save location, the Blueprint will automatically open in the Blueprint Editor.

## Placing Blueprints in Levels

To place a Blueprint in your level, you can either...

**Drag-and-drop** it from the **Content Browser** into your level.

Or with the Blueprint selected in the **Content Browser**, you can **Right-click** in the level and select **Place Actor** from the context menu.

## Placing Blueprint Nodes

There are several methods in which you can place nodes while using the **Graph** (see Placing Nodes (-> placing-nodes-in-unreal-engine) for more information), this section will show you the most common method as well as how to connect nodes together.

Most of the time when placing nodes, you will use the **Context Menu** which can be accessed by **Right-clicking** inside a Blueprint graph.

From the menu above, you can expand any category (or sub category) and select the node you wish to add to the graph.

There is also an option in the upper right corner of the window called **Context Sensitive** that is enabled by default but can be disabled which automatically filters the options presented in the menu based on the current context.

As you can see below, when **Right-clicking** and searching for **Animation** with **Context Sensitive** on, you are presented with a filtered list.

However, if you un-check **Context Sensitive** and search for **Animation**, you are presented with everything related to animation.

While **Right-clicking** in the graph brings up the Context Menu, you can drag off an existing node to access the Context Menu as well.

Above, we have a **Character Movement** Component Reference and by dragging off its out pin, we can add nodes that contextually make sense and are relevant to the node we are dragging off of as seen in the example below.

Above we can set the character's Max Walk Speed by searching for **Set Max Walk** then choosing **Set Max Walk Speed** from the menu.

## Connecting Blueprint Nodes

To connect nodes, drag off one pin and connect it to another pin of the same type (there are some instances where a conversion node will be created, for example, connecting a Float output to a Text input will create a conversion node between the two and automatically convert and connect the two nodes).

Here is a basic connection between two nodes where the input/output pins are of the same type.

And here is an example of a conversion in progress.

- See Blueprint Editor Cheat Sheet (-> blueprint-editor-cheat-sheet-in-unreal-engine) for additional node based actions and shortcuts.

## Creating Variables

**Variables** are properties that hold a value or reference an Object or Actor in the world. These
properties can be accessible internally to the **Blueprint** containing them, or they can be made
accessible externally so that their values can be modified by designers working with instances
of the Blueprint placed in a level.

You can create variables for your Blueprints from the **MyBlueprint** window, by clicking on the **Add Button (+)** on the variable list header.

Once you have created a variable, you will need to be able to define the properties of the variable.

- See Blueprint Variables (-> blueprint-variables-in-unreal-engine) for more information on variable types and more on working with them.

- class
- blueprints
- blueprint

On this page

- Creating Blueprints (-> blueprint-basic-user-guide-in-unreal-engine)
- Create Blueprint Using Assets (-> blueprint-basic-user-guide-in-unreal-engine)
- Placing Blueprints in Levels (-> blueprint-basic-user-guide-in-unreal-engine)
- Placing Blueprint Nodes (-> blueprint-basic-user-guide-in-unreal-engine)
- Connecting Blueprint Nodes (-> blueprint-basic-user-guide-in-unreal-engine)
- Creating Variables (-> blueprint-basic-user-guide-in-unreal-engine)

Related documents

Blueprints Visual Scripting

 [image: Blueprints Visual Scripting] (-> blueprints-visual-scripting-in-unreal-engine)

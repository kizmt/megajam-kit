# Custom Binding

https://dev.epicgames.com/documentation/en-us/unreal-engine/dynamic-binding-in-sequencer?application_version=5.9

> Create custom binding types using Blueprints or custom classes to bind objects to tracks in Sequencer.

[image: Custom Binding]

In Sequencer, you can bind actors and objects to tracks using binding types. The default binding types include the following:

- **Possessable**: Possess an existing actor in a level and use it in the sequence both in editing and runtime.
- **Spawnable**: Spawn a new actor and use it in the sequence both in editing and runtime.
- **Replaceable**: Create and use a preview actor when editing the sequence, then at runtime, dynamically bind to an existing in-game actor.

You can also create **custom binding **types using Blueprints or custom classes to override the default binding type behaviors and to dynamically bind objects to Sequencer tracks at runtime.

## Prerequisites

- You understand Sequencer (-> unreal-engine-sequencer-movie-tool-overview) and its interface (-> sequencer-cinematic-editor-unreal-engine).
- You know how to create and use tracks (-> sequencer-track-list-in-unreal-engine).
- You understand spawnables and possessables (-> spawn-temporary-actors-in-unreal-engine-cinematics).
- You understand Blueprints (-> introduction-to-blueprints-visual-scripting-in-unreal-engine).

## Create a Custom Binding

You can create custom bindings in the following ways:

- Create a new custom binding endpoint in the level sequence director Blueprint
- Create a custom replaceable binding class

## Create Custom Binding Endpoint In Director Blueprint

To create a custom binding endpoint in the director Blueprint, follow these steps:

- In **Sequencer**, right-click the track you want to create a custom binding for.
- Go to **Convert Selected Binding(s) To…** and click one of the following:**Spawnable from Director Blueprint…** > **Create New Binding Endpoint**
- **Replaceable from Director Blueprint…** > **Create New Binding Endpoint**

Creating a new binding endpoint creates a pair of custom Blueprint nodes: a binding node and a return node. In between these nodes you can add your own logic for how the binding happens. The binding node name includes the name of the object being bound, followed by "Dynamic Binding". For example, if you made a Dynamic Binding from a generic cube, the binding name would be "Cube Dynamic Binding".

[image: A binding node and return node]

Using the return node, you can set which object is returned, and whether the object is possessed or spawned. Right-click the blue input pin for **Return Value** and click **Split Struct Pin**. After the pin is split, you can select which object is returned from the **Return Value Object** dropdown menu. Check **Return Value Is Possessed Object** for the object to be possessed, and uncheck it to spawn the object instead.

[image: A return node with a split struct pin]

## Create Custom Replaceable Binding Class

The default replaceable binding works by spawning a preview object when you are editing a sequence, and then dynamically binding to an existing object at runtime. A custom replaceable binding class works the same way, except you can add custom logic to determine which object is bound at runtime.

To create a custom replaceable binding class, follow these steps:

- In **Sequencer**, right-click a track you want to create a custom binding for.
- Click **Convert Selected Binding(s) To…** > **Custom Bindings** > **Create new Replaceable Binding Class**.

Creating a new replaceable binding class creates a pair of Blueprint nodes: a **Resolve Runtime Binding** node and a return node. Between these nodes you can add custom logic for the binding.

The **Resolve Runtime Binding** node is called at runtime and the return node returns the bound object based on your custom logic. In the editor, instead of showing the bound object, Sequencer spawns a preview object, as it would with a default replaceable binding.

## Quick Bind

You can use **Quick Bind** to create custom bindings using existing functions in the level sequence director Blueprint.

To assign an existing custom binding, follow these steps:

- In Sequencer, right-click a track you want to change the binding for.
- From the list, select the function you want to use to bind the track.
- Go to **Convert Selected Binding(s) To…** and then go to one of the following:**Replaceable from Director Blueprint…** > **Quick Bind**
- **Spawnable from Director Blueprint…** > **Quick Bind**

This creates a binding endpoint in the level sequence director Blueprint that uses the selected function as the binding logic.

### Resolve to Player Pawn

There is a default Quick Bind option called **Resolve to Player Pawn**. This creates a binding endpoint in the level sequence director Blueprint that uses the **Resolve to Player Pawn** function to dynamically bind the player pawn to the track.

[image: A custom binding endpoint with the Resolve to Player Pawn function]

## Remove a Custom Binding

To remove a custom binding from a track, follow these steps:

- In **Sequencer**, right-click the track you want to create a custom binding for.
- Go to **Binding Properties** and click the **trash can** icon.

Removing the custom binding does not delete any Blueprints created by the custom binding. If you want to remove any unused custom binding Blueprints, you need to delete their functions from the level sequence director Blueprint.

## UMG and Custom Binding

Creating a custom binding endpoint for an Unreal Motion Graphics UI Designer (UMG) (-> umg-ui-designer-quick-start-guide-in-unreal-engine) asset does not open the Level Sequence Blueprint Director. Instead, this process creates a function inside the UMG asset, since there is a UI Blueprint graph already associated with the asset.

- sequencer
- dynamic binding

On this page

- Prerequisites (-> dynamic-binding-in-sequencer)
- Create a Custom Binding (-> dynamic-binding-in-sequencer)
- Create Custom Binding Endpoint In Director Blueprint (-> dynamic-binding-in-sequencer)
- Create Custom Replaceable Binding Class (-> dynamic-binding-in-sequencer)
- Quick Bind (-> dynamic-binding-in-sequencer)
- Resolve to Player Pawn (-> dynamic-binding-in-sequencer)
- Remove a Custom Binding (-> dynamic-binding-in-sequencer)
- UMG and Custom Binding (-> dynamic-binding-in-sequencer)

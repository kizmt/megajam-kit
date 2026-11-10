# Animation Blueprints

https://dev.epicgames.com/documentation/en-us/unreal-engine/animation-blueprints-in-unreal-engine?application_version=5.9

> Animation Blueprints are visual scripts that are used for the creation and control of complex animation behaviors.

[image: Animation Blueprints]

**Animation Blueprints** are specialized **Blueprints** that control the animation of a **Skeletal Mesh** during simulation or gameplay. **Graphs** are edited inside of the **Animation Blueprint Editor**, where you can blend animation, control the bones of a Skeleton, or create logic that will define the final animation pose for a Skeletal Mesh to use per frame.

This document provides an overview of how to create an Animation Blueprint, its editor, and its primary features.

#### Prerequisites

- Your project contains a Skeletal Mesh (-> skeletal-mesh-actors-in-unreal-engine).

## Animation Blueprint Creation

You can create Animation Blueprints in the following ways:

In the **Content Browser**, click **Add (+)**, then select **Animation > Animation Blueprint**. You will then be prompted to specify which **Skeleton **to target for the Animation Blueprint. Select one and click **Create**.

 [image: create animation blueprint]

For this creation method, you can optionally specify a **Template Animation Blueprint**, and **Parent Class**, if you are wanting to create a child Blueprint. For more information about templates, visit the Animation Blueprint Linking (-> animation-blueprint-linking-in-unreal-engine) page.

Animation Blueprints can also be created by right-clicking on a **Skeletal Mesh Asset** in the **Content Browser** and selecting **Create > Anim Blueprint**.

 [image: create animation blueprint]

Once created, double-click your new **Animation Blueprint** to open it in the **Animation Blueprint Editor**. To learn more about the interface, toolbar, and sections of this editor, refer to the Animation Blueprint Editor (-> animation-blueprint-editor-in-unreal-engine) page.

### Assigning to Characters

Animation Blueprints on their own will not affect your characters until you assign them. Typically this is done on the Skeletal Mesh of your character, regardless if it is referenced in a level or as a component in Blueprints.

To assign your Animation Blueprint, select your Skeletal Mesh and set the following properties:

- Set **Animation Mode** to **Use Animation Blueprint**.

- Set **Anim Class** to your Animation Blueprint asset.

 [image: assign animation blueprint to character]

## Working with Animation Blueprints

There are several features and workflows available to you when using Animation Blueprints. From creating animation logic using the **AnimGraph**, to using **Linked Anim Instances**, Animation Blueprints provide a powerful suite of tools for you.

Reference the following pages to learn how to create robust Animation Blueprint logic for your characters.

- animation

On this page

- Prerequisites (-> animation-blueprints-in-unreal-engine)
- Animation Blueprint Creation (-> animation-blueprints-in-unreal-engine)
- Assigning to Characters (-> animation-blueprints-in-unreal-engine)
- Working with Animation Blueprints (-> animation-blueprints-in-unreal-engine)

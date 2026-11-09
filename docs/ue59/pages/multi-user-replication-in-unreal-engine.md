# Multi-User Replication

https://dev.epicgames.com/documentation/en-us/unreal-engine/multi-user-replication-in-unreal-engine?application_version=5.9

> How to replicate actor properties between clients in a Multi-User Editing session.

## Overview

Multi-User Replication offers real-time replication of actor properties between clients through Multi-User Editing (-> multi-user-editing-in-unreal-engine). This user guide will show how to use Multi-User Replication.

This feature is intended for replicating objects between editors. This system is not intended for gameplay replication.

## Prerequisites

To use Multi-User Replication, you must configure your Unreal Engine project to use Multi-User Editing, be running a Multi-User Server, and have joined a session. For more information on this setup process, see Getting Started with Multi-User Editing (-> getting-started-with-multi-user-editing-in-unreal-engine).

## Open The Replication Tab

Once you have joined a Multi-User session, click the **Replication** tab.

 [image: The Replication tab]

## Replicate a Property

Multi-User Replication does not replicate the entire actor and it is not suggested to attempt replicating every property on an actor due to bandwidth limitations. Instead, individual properties are selected for replication.

To replicate a property in real-time using Multi-User Replication, follow these steps:

- Click **Add** in the **Replication** tab and select an actor to replicate. [image: Adding an actor]

- Click **Edit** in the bottom panel, and select the property from the component that it is on. [image: Selecting a property] The added property should be automatically assigned to the client that added it. That client's evaluation of the property is now being replicated to the other clients in the session.

- To pause replication of an actor, click the **Pause** button next to the actor's name. To resume replication, click the **Play** button. [image: The Pause button]

## Set the Replication rate

By default, actors added to replication are attempted to be replicated at 30 frames per second. To change this rate, right-click the actor and hover over the component whose rate you want to change.

 [image: The rate settings]

The rate can be set to one of the following options:

- **Realtime**: The component will replicate as fast as the engine is able to evaluate.

- **Specified Rate**: The component will attempt to replicate at the rate specified in Replication Rate.

If the editor is evaluating at a rate lower than the specified replication rate, the replication rate will be capped at the lower rate.

## Change the Property Author

To change the client acting as the author of the replication of all properties on an actor, right-click the actor in the top panel and click a new author in the **Reassign All To** category.

 [image: Clicking a new author]

To change the client acting as the author of the replication of a single property, navigate to that property in the bottom panel and click the **Author** dropdown to select a new author.

 [image: Clicking the Author dropdown]

Multiple clients can replicate the same actor if the clients are assigned as the authors of different properties.

## Using Multi-User Replication Presets

In complex replication environments, it can be valuable to save the assignments of actors and properties to be recalled later. This can be accomplished through the use of Replication Presets.

Presets work by mapping the actor label to the client name. If multiple clients share the same name, presets will not function. To avoid this, set the client's **Display Name** from the **Multi-User Editing** section of the project settings.

### Create a Replication Preset

To create a Replication Preset, follow these steps:

- In the **Replication** tab, click **Presets** > **Save Preset as...**. [image: Saving a preset]

- Save the preset.

Do not forget to persist the preset asset if you plan to use it in different sessions in the future.

### Load a Replication Preset

To load a preset, follow these steps:

- In the **Replication** tab, click **Presets**, then click the preset asset to load. [image: Loading a preset]

## Advanced Topic: Default Properties

You can configure the properties that are added by default when you add a component of a given class for replication.

To configure the default properties, follow these steps:

- From Unreal Engine's main menu, go to **Edit** > **Project Settings**.

- In the Multi-User Replication section, expand **Replication Editor Settings**.

- Under **Default Property Selection**, map classes (typically those of components) to the properties you want to automatically add. [image: Default Property Selection]

- Under **Default Added Subobject Rules**, you can specify which types of actors the rules defined in **Default Property Selection** are applied to. This allows you to only apply the defaults for the components specified in **Default Property Selection** to the desired actor classes. As key, you assign the class of actor you want the rule to apply; by default, there is a rule that is applied to all actor classes.

- As value, you specify the types of subobjects, typically components, for which you want the rules from **Default Property Selection** to apply.

 [image: Default Added Subobject Rules]

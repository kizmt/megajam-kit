# Blend Spaces in Animation Blueprints

https://dev.epicgames.com/documentation/en-us/unreal-engine/blend-spaces-in-animation-blueprints-in-unreal-engine?application_version=5.9

> Start using Blend Spaces in Unreal Engine by referencing or creating them in Animation Blueprints.

[image: Blend Spaces in Animation Blueprints]

**Blend Spaces** are used in Unreal Engine by placing nodes in the AnimGraph (-> graphing-in-animation-blueprints-in-unreal-engine) of Animation Blueprints (-> animation-blueprints-in-unreal-engine) which take input data to drive the blending of the samples used in the **Blend Graph**. They can also be created directly in the AnimGraph without needing a pre-existing Blend Space.

This page provides an overview of the different types of Blend Space nodes in Animation Blueprints, and how to use them.

#### Prerequisites

- You have created and have an understanding of Animation Blueprints (-> animation-blueprints-in-unreal-engine).

- You have created a Blend Space (-> blend-spaces-in-unreal-engine) or Aim Offset (-> aim-offset-in-unreal-engine).

## Blend Space Player

**Blendspace Players** are nodes which reference a currently existing Blend Space Asset. They contain data pin inputs for both axes, or one axis if using a 1D Blend Space (-> blend-spaces-in-unreal-engine). The node outputs the resulting pose based on those inputs.

 [image: blendspace player]

Aim Offsets can also be used as players.

### Creation and Usage

Blendspace Players can be created in any of the following ways:

By right-clicking in the AnimGraph and selecting your Blend Space from the **Blend Spaces** category. Ensure it contains the **Blendspace Player** prefix.

 [image: create blendspace player]

By dragging the Blend Space Asset from the Asset Browser or Content Browser into the AnimGraph.

 [image: create blendspace player]

Double-clicking a Blendspace Player will open that Asset in a separate window, if the Blend Space is assigned.

 [image: open blendspace player]

### Properties

Selecting the Blendspace Player will reveal the following properties relevant to the Blend Space in the **Details **panel.

 [image: blendspace player settings]

| Name | Description |
| --- | --- |
| **Coordinates** | The Axes or Axis (if 1D) of the Blend Space. |
| **Play Rate** | The speed of the playing samples in the Blend Space. Setting this to negative values will cause the samples to play in reverse. |
| **Loop** | Enabling this will cause the samples to repeat playing indefinitely. When disabled, this will cause the final frame of the sample to be held. |
| **Reset Play Time when Blend Space Changes** | Resets the normalized time of the playing samples if the **Blend Space** property changes. |
| **Start Position** | The start time for all the samples in the Blend Space. This is in normalized time, so it must be a value between **0** and **1**. |
| **Blend Space** | The Blend Space Asset to use. |
| **LOD Threshold** | Controls the maximum Level of Detail (LOD) that this node is permitted to run on. For example, if you set this to **2**, it will enable until **LOD2**, but disables once the component's LOD becomes **3**. A value of **-1** will cause the node to always execute, regardless of LOD. This property only appears for **Aim Offset** and **Aim Offset Players**. |

## Blend Space Graph

While Blendspace Players are nodes that reference currently existing Blend Spaces, **Blend Space Graphs** are nodes that contain Blend Spaces within the Animation Blueprint. Using them, you can create bespoke Blend Spaces for your Animation Blueprint, diverge them from other assets, and edit sample logic.

 [image: blend space graph]

Aim Offsets can also be used in this manner.

### Creation

To create this Blend Space type, right-click in the AnimGraph and select **Blend Space** from the Blend Spaces category. You can also select a pre-existing Blend Space Asset by selecting it, ensuring the prefix says **Blendspace**. Doing this will import (instead of referencing) the Blend Space, in which you can diverge it from the original.

 [image: create blend space graph]

### Usage

As Blend Space Graphs are meant to be created and managed within your Animation Blueprint, you can open the Blend Space interface by double-clicking on the Blend Space entry in the **My Blueprint** panel. From here, you can add samples (-> blend-spaces-in-unreal-engine), define your axis values (-> blend-spaces-in-unreal-engine), and edit other properties (-> blend-spaces-in-unreal-engine) just like a Blend Space asset.

 [image: add samples to blend space graph]

Each sample in the blend space contains its own sub-graph, which can be viewed by double-clicking it. In this way, you can assign more features to a sample by creating additional logic.

 [image: blend space sample animgraph]

## Blend Space Evaluator

**Blendspace Evaluators** are Blend Space nodes that have the times of all their samples' times controlled externally, rather than play automatically. This time control is a normalized (0 - 1) float value that determines the point at which the pose is sampled.

 [image: blend space evaluator]

To create this Blend Space type, right-click in the AnimGraph and select **Blendspace**** Evaluator** from the Blend Spaces category. You can also select a pre-existing Blend Space Asset by selecting it, ensuring the prefix says **Blendspace Evaluator**.

 [image: create blend space evaluator]

By default, the Blendspace Evaluator teleports to the provided time and does not advance time, which causes root motion or Animation Notifies to not evaluate. Disabling **Teleport to Normalized Time** will restore this functionality.

 [image: blend space evaluator settings]

- animation

On this page

- Prerequisites (-> blend-spaces-in-animation-blueprints-in-unreal-engine)
- Blend Space Player (-> blend-spaces-in-animation-blueprints-in-unreal-engine)
- Creation and Usage (-> blend-spaces-in-animation-blueprints-in-unreal-engine)
- Properties (-> blend-spaces-in-animation-blueprints-in-unreal-engine)
- Blend Space Graph (-> blend-spaces-in-animation-blueprints-in-unreal-engine)
- Creation (-> blend-spaces-in-animation-blueprints-in-unreal-engine)
- Usage (-> blend-spaces-in-animation-blueprints-in-unreal-engine)
- Blend Space Evaluator (-> blend-spaces-in-animation-blueprints-in-unreal-engine)

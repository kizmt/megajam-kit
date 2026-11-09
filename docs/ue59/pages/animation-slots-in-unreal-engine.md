# Animation Slots

https://dev.epicgames.com/documentation/en-us/unreal-engine/animation-slots-in-unreal-engine?application_version=5.9

> Insert entry-points within your Anim Graph to play animation from using Slots.

As you create more complex Animation behavior for your characters, it may be necessary to create proxy areas in your Animation Blueprint where you can insert one-off animations. This can be accomplished by using **Slots**, which are nodes that you can add to your Animation Blueprint at various points to layer and play animations into. Slots are mainly used together with Animation Montages (-> animation-montage-in-unreal-engine), however they can also be used with Sequencer (-> cinematics-and-movie-making-in-unreal-engine).

This document provides an overview of how to create and use Animation Slots in your Animation Blueprint, Montages, and Sequencer.

#### Prerequisites

- You are familiar with how to graph within Animation Blueprints (-> graphing-in-animation-blueprints-in-unreal-engine).

## Overview

The main purpose of Slots is to provide a place in the Anim Graph to insert animations into your Animation Blueprint. This can be useful when using Animation Montages (-> animation-montage-in-unreal-engine) as a way to insert one-off animations, such as shooting or interacting with objects. Slots can also be used together with blending nodes to separate playback to only occur on certain Bones on your character, such as upper body or arms.

For example, in this setup, Slots are used in the following two ways:

 [image: slot example]

- A **Full Body Slot** is used after the main locomotion State Machine (-> state-machines-in-unreal-engine), which can insert animations in an overriding manner. This Slot can be used for full-body object interaction or emote gestures.

- An **Upper Body Slot** is used together with a Layered blend per bone (-> animation-blueprint-blend-nodes-in-unreal-engine) node to remove animation on the lower body so that only the upper body is affected. This Slot can be used for weapon reloading, shooting, or other similar animations which can work correctly regardless of your character's locomotion state.

## Creating and Managing Slots

Slots are created and managed from the **Anim Slot Manager**, which is a panel that can be opened from the** Animation Blueprint**, **Skeleton**, or **Animation Sequence** Editors. To open the panel, in any one of those editors, go to **Window > Anim Slot Manager** from the main menu.

 [image: anim slot manager]

By default, all Skeletons come with a starting Slot named **DefaultSlot**. To add a new Slot, click **Add Slot (+)**, type in a name for the Slot, then press **Enter**.

 [image: create new slot]

Regardless of the animation editor you are in, Slots are stored on the Skeleton (-> skeletons-in-unreal-engine) Asset, therefore, when you are creating or changing Slots, you are also editing the Skeleton. Clicking **Save** in the Anim Slot Manager will save the Skeleton when you make any Slot changes.

Right-clicking in the Anim Slot Manager or on Slot entries will show the following context menu commands:

 [image: slot context menu]

| Name | Description |
| --- | --- |
| **Set Slot Group to** | Moves the selected Slot to a different Slot Group (-> animation-slots-in-unreal-engine), if one is available. |
| **Rename Slot** | Renames the selected Slot. |
| **Delete Slot** | Deletes the selected Slot. |
| **Add Slot** | Creates a new Slot. |
| **Add Group** | Creates a new Slot Group (-> animation-slots-in-unreal-engine). |

## Using Slots

Before you start using Slots, you must first ensure they are added to your Animation Blueprint (-> animation-blueprints-in-unreal-engine).

In the Anim Graph, right-click and add the **Slot 'DefaultSlot' **node.

 [image: create default slot node]

By default, newly created Slot nodes will use **DefaultSlot**. To change this, select the node and set the **Slot Name** property in the **Details **panel to your desired Slot.

 [image: change slot name]

Slots are designed to support incoming source pose links so that the Slot passes through the incoming pose if animations are not being inserted into it. The Slot only begins to override the incoming animation with its own once animation starts playing on the Slot.

Once an incoming source pose is overridden, it will no longer evaluate. You can change this to ensure the incoming animation keeps evaluating by enabling **Always Update Source Pose** in the Slot's **Details** panel.

 [image: always update source pose]

### In Animation Montages

Animation Montages (-> animation-montage-in-unreal-engine) require Slots in your Anim Graph to function, as they exclusively play animation using Slots. In this example, an Animation Montage will apply this animation to the **Upper Body Slot**.

 [image: slots in montages]

To change or add Slots to the Montage, click the Slot dropdown menu on the Slot track to view the following commands:

 [image: change slot in montage]

| Name | Description |
| --- | --- |
| **Slot name** | Exposes a menu where you can change the current Slot. If this is the topmost Slot track, then selecting a Slot that is part of a different Slot Group (-> animation-slots-in-unreal-engine) will change the Montage's Slot Group. |
| **New Slot** | Adds a new Slot Track using a pre-existing Slot. |
| **Delete Slot** | Deletes the Slot. |
| **Duplicate Slot** | Duplicates the Slot track and its contents into a new Slot track. |
| **Preview Slot** | If you have more than one Slot track, enabling this will cause the contents of this Slot to preview in the Viewport. |
| **Slot Manager** | Opens the Slot Manager (-> animation-slots-in-unreal-engine) panel. |

A single Montage can play animations on multiple Slots at the same time, but they must be within the same Slot Group (-> animation-slots-in-unreal-engine).

Refer to the Animation Montage (-> animation-montage-in-unreal-engine) page for more information on using Animation Montages.

### In Sequencer

Slots can also be used in Sequencer (-> cinematics-and-movie-making-in-unreal-engine), which is Unreal Engine's cinematic and movie-making tool. Using Slots in Sequencer enables inserting cinematic animation within an Animation Blueprint, so that your characters can benefit from its additional logic.

Slots are used for animations in the Animation Track (-> cinematic-animation-track-in-unreal-engine). To set an animation to play from a Slot, right-click an animation section and navigate to **Properties > Slot Name**. Enter the name of the Slot you want to insert this animation into.

 [image: slots in sequencer]

A common use-case for using Slots in Sequencer is to blend cinematic and gameplay animation together. Refer to the Blending Gameplay and Sequencer Animation (-> blend-gameplay-animation-to-cinematic-animation-in-unreal-engine) page to learn more.

## Slot Groups

In addition to Slots, you can also create Slot groups to organize and control Slot playback within Animation Montages (-> animation-montage-in-unreal-engine).

A **DefaultGroup **Slot group will already exist on your Skeleton. To create another Slot group, click **Add Group (+)** in the **Anim Slot Manager**, type in a name for the Slot group, then press **Enter**.

 [image: slot groups]

An existing Slot can be moved to a different Slot group by right-clicking it and selecting **Set Slot Group to**.

 [image: change slot group]

Slot groups are not just organizational. When you play a montage that uses a Slot in the same group as one that's already running, it stops the active one. This automatic behavior allows for montages to be interrupted. For example, a weapon reloading montage could be interrupted to play an ability or melee attack montage. If both montages are playing animations on Slots within the same group, then the most recent montage will interrupt the previous.

To learn more about using Slot groups in Animation Montages, refer to the Animation Montage (-> animation-montage-in-unreal-engine) page.

- animation
- sequencer

On this page

- Prerequisites (-> animation-slots-in-unreal-engine)
- Overview (-> animation-slots-in-unreal-engine)
- Creating and Managing Slots (-> animation-slots-in-unreal-engine)
- Using Slots (-> animation-slots-in-unreal-engine)
- In Animation Montages (-> animation-slots-in-unreal-engine)
- In Sequencer (-> animation-slots-in-unreal-engine)
- Slot Groups (-> animation-slots-in-unreal-engine)

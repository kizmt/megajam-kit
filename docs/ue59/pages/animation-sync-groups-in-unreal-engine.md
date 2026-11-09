# Sync Groups

https://dev.epicgames.com/documentation/en-us/unreal-engine/animation-sync-groups-in-unreal-engine?application_version=5.9

> Synchronize the cycles of animations with different lengths using Sync Groups.

[image: Sync Groups]

To improve blending behavior in **Animation Blueprints**, **Sync Groups** can be used to automatically synchronize the related animation's lengths and playback during the blend. This can be useful when blending between walking and running cycles of different lengths. In such a case, directly blending from one to the other without Sync Groups could cause unnatural results as the feet placement may not be synchronized.

This document provides an overview of the Sync Group system in Animation Blueprints.

#### Prerequisites

- Sync Groups are created and managed in Animation Blueprints (-> animation-blueprints-in-unreal-engine), therefore you should have a basic knowledge working in this editor.

## Overview

Sync Groups work with the concept of roles, in which one animation is the **leader **while all other animations are **followers**. Leaders provide the master animation length that is used by all followers and have priority for triggering Animation Notifies (-> animation-notifies-in-unreal-engine). Followers match their animation lengths to leaders and have their notifies suppressed.

By default during the blend, leader and follower assignment can change based on the weight distribution. The animation with the highest blend influence is considered the leader.

| Image | Description |
| --- | --- |
|  | As an example, you can compare a walk and run cycle animation. Typically these animations may not match in length. Without Sync Groups, the general body movement cycles of these animations will not align. |
|  | When using Sync Groups, and with the **run cycle as leader**, this will cause the walk cycle to adjust its playback speed to match the leader. In this case, the walk cycle is being shortened to play faster to match the run cycle. |
|  | When using Sync Groups, and with the **walk cycle as leader**, this will cause the run cycle to adjust its playback speed to match the leader. In this case, the run cycle is being lengthened to play slower to match the walk cycle. |

Due to the nature of synchronizing animations with Sync Groups, there are certain animation restrictions that you should consider when using animations in this way:

- Ensure that all animations being synchronized have the same general body movement from the start to the end. For walk and run animations, this might mean ensuring that the same feet are being planted at the start and ending frames. [image: synchronize foot placement]

- Also ensure that there are no drastic length differences between the animations that are blending. This may result in some animations playing noticeably faster than others, as well as causing noticeable playrate "pops" when leader and follower animations switch.

### Sync Settings

When syncing animations in a variety of ways, you can edit the behavior with the following settings found in the **Details **panel.

| Name | Description |
| --- | --- |
| **Group Name** | Defines the name of the Sync Group. Generally, you will want all related animations that are meant to blend together (such as body motions for sneak, walk, run, sprint) to have the same name, causing them to be in the same Sync Group. |
| **Group Role** | Specifies certain leader and follower rules for this animation. You can select from the following: **Can be Leader**, which is the default behavior, and when selected causes this animation to be the leader as long as it has the highest blend weight. **Always Follower**, which causes this animation to always follow the Sync Group leader. If all animations are set to this, then the first animation evaluated will be set to the leader. **Always Leader**, which causes this animation to always be the leader. If more than one animation in the group is set to this option, then the last one evaluated will be set to the leader. **Transition Leader**, which causes this animation to be excluded from syncing while blending in. Once blended in it will become the Sync Group leader until blended out. **Transition Follower**, which causes this animation to be excluded from syncing while blending in. Once blended in it will become a follower until blended out. |
| **Method** | Defines how syncing is determined. You can select from the following: **Do Not Sync**, which is the default setting and causes no animation syncing to occur. **Sync Group**, which will enable Group-Based Syncing (-> animation-sync-groups-in-unreal-engine). **Graph**, which will enable Graph-Based Syncing (-> animation-sync-groups-in-unreal-engine). |

## Sync Group Types

There are several ways to set up Sync Groups, you can choose from the following types.

### Group-Based Syncing

**Group-Based Syncing** groups animations together by name. To create a group-based Sync Group, select the animation nodes to sync in the **AnimGraph **and locate the **Sync **category in the **Details **panel. Set the following properties:

- Set **Method **to **Sync Group**.

- Type a name in **Group Name**. The **Group Name **must match for all animations you want to sync.

 [image: sync group name]

Your animations now sync when blending. You can preview this behavior by connecting them to a **Blend **node and setting the **Alpha **to 0.5.

|  |  |
| --- | --- |
|  |  |
| Group Sync Off | Group Sync On |

When using Sync Groups with Animation Nodes, the node will display a text watermark for the sync method, and the group name.

 [image: sync group watermark]

### Marker-Based Syncing

In addition to Sync Groups, animations can be synchronized using **Sync Markers** within Animation Sequences. This causes the playback of animations to synchronize based on the relative position of playback between markers placed along the timeline of animations.

This can be useful for a variety of blending conditions:

- When general body movement does not have a matching number of steps. For example, when blending a run cycle that has the right foot touching the ground four times, and the walk cycle's foot only touches the ground two times.

- When the stride lengths are not the same. For example, when blending a time-rigid marching walk animation to a time-loose scramble running animation.

- When blending with non-looping animations, such as run and walk starts and stops. Additionally with this case, the start and stop animations should be set to **Always Leader**.

 [image: sync markers]

To add a Sync Marker, right-click within an Animation Notify (-> animation-notifies-in-unreal-engine) timeline and select **Add Sync Marker...** > **New Sync Marker…**. Next, type in the name of the Sync Markers and press **Enter**.

 [image: create sync marker]

Once a Sync Marker has been added, it will be saved to the Skeleton. Once added, you can easily reuse Sync Marker names on different animations, ensuring that the same names are being used and standardized. Saved Sync Markers can be added by right-clicking in the notify timeline and selecting **Add Sync Marker...** > **Existing Sync Markers**, then selecting a Sync Marker from the list.

 [image: add existing sync marker]

Sync Markers will only synchronize with other markers if the animations are in the same Sync Group (-> animation-sync-groups-in-unreal-engine). This means you must ensure that both Sync Marker and Sync Group names match.

Animation Montages (-> animation-montage-in-unreal-engine) also support marker-based syncing while blending out, so you can transition back to other animations seamlessly. In the Animation Montage Editor, navigate to the **Sync Group** properties in the **Asset Details Panel** to edit the relevant sync properties.

 [image: animation montage sync settings]

Other elements to consider when using Sync Markers are:

- Only markers common to all animations within a group are synced. For example, if one animation is missing "Right Foot Down" markers, then those markers will be ignored for all animations when determining that frame's position.

- Marker-based syncing is used automatically when animations in a Sync Group have matching markers. Otherwise, the system will fall back to normal length syncing behavior.

### Graph-Based Syncing

When building complex Animation Blueprints, it can become tedious to manage name-based sync groups. You can instead use **Graph-Based Syncing** to propagate a single Sync Group to various sub-graphs and child nodes. Graph-Based Syncing requires children nodes and graphs that have their **Method **property set to **Graph**.

 [image: graph method]

The first method of using Graph-Based Syncing is by creating the **Sync **node. This node propagates sync behavior to all incoming pose nodes that have their **Method **property set to **Graph**. To add a Sync node to your graph, right-click and select **Sync **from the **Misc.** category.

 [image: create sync node]

Typically, you may want to place this node after your pose logic, so that it can synchronize all incoming animation data.

 [image: synchronize incoming pose]

#### Blend Space Graphs

In addition to the Sync node, Blend Space Graphs (-> blend-spaces-in-animation-blueprints-in-unreal-engine) also provide graph syncing functionality. This will cause the sync behavior to propagate to all children samples within the graph.

Similar to the Sync node, Blend Space Graphs require a **Group Name** in order for the sync behavior to propagate.

 [image: blend space graph sync]

By default, **Sequence Players** generated in Blend Space Graph samples will default to using the **Graph** sync method, to accept synchronization from the Blend Space Graph node.

 [image: blend space graph sync]

- animation

On this page

- Prerequisites (-> animation-sync-groups-in-unreal-engine)
- Overview (-> animation-sync-groups-in-unreal-engine)
- Sync Settings (-> animation-sync-groups-in-unreal-engine)
- Sync Group Types (-> animation-sync-groups-in-unreal-engine)
- Group-Based Syncing (-> animation-sync-groups-in-unreal-engine)
- Marker-Based Syncing (-> animation-sync-groups-in-unreal-engine)
- Graph-Based Syncing (-> animation-sync-groups-in-unreal-engine)
- Blend Space Graphs (-> animation-sync-groups-in-unreal-engine)

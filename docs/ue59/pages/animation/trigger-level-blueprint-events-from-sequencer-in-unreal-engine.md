# Trigger Level Blueprint Events from Sequencer

https://dev.epicgames.com/documentation/en-us/unreal-engine/trigger-level-blueprint-events-from-sequencer-in-unreal-engine?application_version=5.9

> Use Blueprint Interfaces to communicate Sequencer's Event Track to a Level Blueprint

[image: Trigger Level Blueprint Events from Sequencer]

Event Tracks (-> cinematic-event-track-in-unreal-engine) are mainly used to trigger Blueprint Scripts (-> blueprints-visual-scripting-in-unreal-engine) within Sequencer's **Director Blueprint**. In your project, there may be cases where you instead want events from Sequencer to trigger in other Blueprints, such as the **Level Blueprint**. You can do this using Blueprint Interfaces (-> blueprint-interface-in-unreal-engine) and additional set-up steps in the Director Blueprint.

This document provides instructions on how to trigger Level Blueprint events from Sequencer's Event Track.

#### Prerequisites

- You have a basic understanding of how to create and open a Level Sequence (-> unreal-engine-sequencer-movie-tool-overview).

- You have an understanding of how to create and use the Event Track (-> cinematic-event-track-in-unreal-engine).

- You have a basic understanding of Blueprints (-> blueprints-visual-scripting-in-unreal-engine).

## Create Blueprint Interface

First, create a Blueprint Interface. In the **Content Browser**, click **Add (+)** and select **Blueprints > Blueprint Interface**. Name your asset and open it.

 [image: create blueprint interface]

In the **Blueprint Interface Editor**, give a unique name to the default Function, to help you locate it later in this guide.

 [image: name blueprint interface function]

The purpose of the Blueprint Interface is to provide communication between the Sequencer Director Blueprint and the Level Blueprint.

## Implement the Interface in your Level

Next, open your Level Blueprint by clicking **Level Blueprint** in the **Level Toolbar** and selecting **Open Level Blueprint**.

 [image: open level blueprint]

Enable **Class Settings**, and in the **Details **panel click the **Add **dropdown menu for **Inherited Interfaces**. Locate and select your Blueprint Interface to add it to the Level Blueprint.

 [image: implement blueprint interface in level blueprint]

Right-click in the **Event Graph** and add the **Event** from your Blueprint Interface. The event name matches the name of the Function you named earlier in this guide. Add the Event and connect it to the Level Blueprint logic you want to trigger. Due to the arbitrary nature of Blueprints, this guide will assume your Level Blueprint logic is already created. In this example, the logic is activating a Niagara System (-> creating-visual-effects-in-niagara-for-unreal-engine).

 [image: reference blueprint interface event in level blueprint logic]

## Set Up Event Track

Now that the Level Blueprint side of the logic is set up, you can implement the rest of the logic in Sequencer's Event Track.

Open your **Level Sequence**, then create an **Event Track** by clicking **Add Track (+) > Event Track > Trigger**.

 [image: create event track]

Select the **Event Track** and press **Enter **to create an **Event keyframe** at the Playhead. Double-click this keyframe to open the **Director Blueprint** and bind the keyframe to a new **Event**.

 [image: create event keyframe]

### Implement Interface

Like you did in the Level Blueprint earlier, enable **Class Settings** in the **Director Blueprint**, and in the **Details** panel click the **Add **dropdown menu for **Inherited Interfaces**. Locate and select your **Blueprint Interface** to add it to the Level Blueprint.

 [image: implement blueprint interface in director blueprint]

### Create Logic

Right-click in the **Director Blueprint Graph** and add the **Function** from your Blueprint Interface under the **Call Function** category. The Function name matches the name of the Function you named earlier in this guide.

 [image: reference blueprint interface function]

Make sure you are using the Blueprint Interface Function that targets your Sequence Director BP. Other function targets will not work.

 [image: ensure function targets sequence director]

Connect the **execution** and **target** pins to the **Event**.

 [image: connect function to event]

### Bind Keyframe to Target

Lastly, return to the **Event Track** and right-click the **keyframe**. Under the **Properties** menu, set **Pass Bound Object To** to **Target**.

 [image: set pass bound object to target]

Connecting and binding the **Target **is a necessary step, despite there being no actual target. This is because when no target is specified, the Blueprint Interface system will fallback to the Level Blueprint, and then correctly link to the interface there.

## Results

Once the preceding steps are finished, you can now play or simulate your level. Upon playing your sequence, the level event should trigger.

 [image: sequencer event triggers level event]

- trigger
- sequencer
- blueprint

On this page

- Prerequisites (-> trigger-level-blueprint-events-from-sequencer-in-unreal-engine)
- Create Blueprint Interface (-> trigger-level-blueprint-events-from-sequencer-in-unreal-engine)
- Implement the Interface in your Level (-> trigger-level-blueprint-events-from-sequencer-in-unreal-engine)
- Set Up Event Track (-> trigger-level-blueprint-events-from-sequencer-in-unreal-engine)
- Implement Interface (-> trigger-level-blueprint-events-from-sequencer-in-unreal-engine)
- Create Logic (-> trigger-level-blueprint-events-from-sequencer-in-unreal-engine)
- Bind Keyframe to Target (-> trigger-level-blueprint-events-from-sequencer-in-unreal-engine)
- Results (-> trigger-level-blueprint-events-from-sequencer-in-unreal-engine)

# Event Track

https://dev.epicgames.com/documentation/en-us/unreal-engine/cinematic-event-track-in-unreal-engine?application_version=5.9

> Event Tracks support the creation of custom events that are scripted in a dedicated Sequencer Blueprint layer.

[image: Event Track]

In Sequencer, you can define frames in your sequence where you want to execute Blueprint Scripting (-> blueprints-visual-scripting-in-unreal-engine) functionality. This is accomplished using the **Event Track**.

This guide provides an overview of the Event Track, including how to create it, access the Director Blueprint, and the types of events you can create.

#### Prerequisites

- You have an understanding of Sequencer (-> how-to-make-movies-in-unreal-engine), and its Interface.

- You have an understanding of Blueprints Visual Scripting (-> blueprints-visual-scripting-in-unreal-engine).

## Creation

To create an Event Track, click **Add Track (+)** in Sequencer, navigate to **Event Track**, and select either the Trigger (-> cinematic-event-track-in-unreal-engine) or Repeater (-> cinematic-event-track-in-unreal-engine) event type.

 [image: create event track]

Event Tracks can also be created under an Object Binding Track (-> cinematic-actor-tracks-in-unreal-engine), which will bind the event to that object (-> cinematic-event-track-in-unreal-engine).

 [image: create event track actor]

Once an Event Track is created, you can create additional event Sections (-> creating-animation-keyframes-in-unreal-engine) by clicking **Add Section (+)** on the Event Track and selecting an event type.

 [image: add more event tracks]

When adding events, you can choose to add either **Trigger **or **Repeater **type events. Trigger Events cause an event to evaluate on the same frame as the keyframe, whereas Repeater Events will evaluate for each frame for the duration of the event section.

### Trigger Events

Trigger events are events that evaluate once per keyframe. When this track is created, you can then **Keyframe (-> creating-animation-keyframes-in-unreal-engine)** it to create event keyframes.

 [image: trigger event]

### Repeater Events

Repeater events are events that will fire or evaluate for each frame of the sequence continuously for the duration of the event section. Adjusting the Frames Per Second (-> sequencer-cinematic-toolbar-in-unreal-engine) of the sequence will also adjust the evaluation rate of the repeater to match. When this track is created, it will contain a finite Section (-> creating-animation-keyframes-in-unreal-engine) range, controlling its evaluation time.

 [image: repeater event]

You can edit, move, and trim (-> creating-animation-keyframes-in-unreal-engine) this event section just like any other section in Sequencer.

## Director Blueprint

The Director Blueprint is the logic center for the Event Track from which you will perform Blueprint Visual Scripting (-> blueprints-visual-scripting-in-unreal-engine) from your event endpoints. **Parameters **and **Object Bindings** can also be specified in the Blueprint in order to pass variable and object information throughout the script. Each **Level Sequence** has its own Director Blueprint, containing all the logic for the events in that sequence.

There are several ways you can open the Director Blueprint:

- Double clicking an event keyframe or section. This method will also bind the event to a new **endpoint** (-> cinematic-event-track-in-unreal-engine) if it is currently unbound. [image: double click event]

- Clicking the Director Blueprint Toolbar button (-> sequencer-cinematic-toolbar-in-unreal-engine). [image: director blueprint toolbar button]

- Clicking the Actions Toolbar button (-> sequencer-cinematic-toolbar-in-unreal-engine) and then selecting **Open Director Blueprint**. [image: open director blueprint]

### Event Endpoint

Regardless of whether a Trigger or Repeater event is created, you must bind it to an **Event Endpoint** in order to add logic to it. To do this, right-click the keyframe (if using trigger) or section (if using repeater) and select **Properties > Unbound > Create New Endpoint**. Doing this will bind the event keyframe or section to a new endpoint node and open the **Director Blueprint**.

 [image: create new endpoint]

The Event Endpoint can be renamed in the Blueprint's Details panel from the **Name** property.

 [image: rename event]

You can create as many event keyframes or sections as you need. Event nodes can also be shared between multiple event sources by using the **Quick Bind** or **Rebind To** menus.

 [image: event track link]

### Parameters and Event Payloads

Similar to Blueprint Custom Events (-> custom-events-in-unreal-engine), the Event Track can have input parameters associated with it. Using event parameters and payloads, you can send property values to targets when the event fires.

To add a parameter to your event, select the event endpoint and click **Add Parameter (+)** in the Details panel. Doing this will create a new parameter in the details and on the node for scripting

 [image: event track parameter property]

When you right-click the event keyframe or section, additional properties for your parameters will be displayed under the **Payload **category. Here you can define the values on the parameters, which will be sent when the event executes.

 [image: payload]

### Object Binding

When creating an Event Track under a bound object in Sequencer, it will create an **Object Binding** for the Event Track where the target object of the event node becomes bound to the object the Event Track has been added to. This makes it easier to script functions on specific Actors in your sequence, as functions can now be called on the object directly.

 [image: event track actor binding]

An additional property will also be exposed on the keyframe or section properties context menu. **Pass Bound Object To** controls which object parameter this event should be bound to. If you have added additional **Object **or Blueprint Interface (-> blueprint-interface-in-unreal-engine) parameters to your endpoint node, then they will be selectable here.

 [image: pass bound object to]

If an endpoint node is not yet designated for your object bound event, you can use the **Quick Bind** command to add script functions directly related to the bound object, similar to calling functions from an object reference in Blueprints.

 [image: quick bind event actor]

## Event Properties

When right-clicking either a Trigger keyframe or Repeater section, you can view the following properties in the **Properties **context menu.

 [image: event properties]

| Name | Description |
| --- | --- |
| **Event** | The **Event Endpoint** this keyframe or section is bound to in the Director Blueprint (-> cinematic-event-track-in-unreal-engine). By default this is unbound and can be bound by clicking the dropdown menu and selecting **Create New Endpoint** or any other existing endpoint node. [image: unbound create new endpoint] **Quick Bind** contains a list of compatible functions for this event, including the object binding if the Event Track is bound to an object. [image: quick bind] |
| **Call In Editor** | Enabling this will cause the event logic to evaluate in the editor session without requiring you to Play or Simulate in Editor (-> ineditor-testing-play-and-simulate-in-unreal-engine). This property appears once the event is bound to an endpoint node. |

You can also right-click the Event Track to view the following properties in the **Properties **context menu.

 [image: event track properties]

| Name | Description |
| --- | --- |
| Fire Event when Forwards | Enabling this will cause the Event to fire when the sequence is playing forward normally. |
| Fire Event when Backwards | Enabling this will cause the Event to fire when the sequence is playing in reverse. Using the **Forwards** and **Backwards** properties can be useful if you need to reset an event chain back to normal when previewing your sequence multiple times. You can set one Event Track to fire forward only and another to fire backward only. Afterward, you can hook up the forward event to the normal event chain, and the backward event to the reset chain. |
| Event Position | Defines where in the evaluation the event should trigger. **At Start Of Evaluation** will cause the event to fire first, before anything else is evaluated in the sequence. **At End Of Evaluation** will cause the event to fire last, after everything else has been evaluated in the sequence. **After Spawn** will cause the event to fire after Spawnables have spawned and evaluated. |

- sequencer
- event track

On this page

- Prerequisites (-> cinematic-event-track-in-unreal-engine)
- Creation (-> cinematic-event-track-in-unreal-engine)
- Trigger Events (-> cinematic-event-track-in-unreal-engine)
- Repeater Events (-> cinematic-event-track-in-unreal-engine)
- Director Blueprint (-> cinematic-event-track-in-unreal-engine)
- Event Endpoint (-> cinematic-event-track-in-unreal-engine)
- Parameters and Event Payloads (-> cinematic-event-track-in-unreal-engine)
- Object Binding (-> cinematic-event-track-in-unreal-engine)
- Event Properties (-> cinematic-event-track-in-unreal-engine)

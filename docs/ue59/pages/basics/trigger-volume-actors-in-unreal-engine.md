# Trigger Volume Actors

https://dev.epicgames.com/documentation/en-us/unreal-engine/trigger-volume-actors-in-unreal-engine?application_version=5.9

> Actor that can be activated and cause events to occur in the Level.

[image: Trigger Volume Actors]

**Triggers** are Actors that are used to cause an event to occur when they are interacted with by some other object in the level. In other words, they are used to trigger events in response to some other action in the level. All of the default Triggers are generally the same, differing only in the shape of the area of influence - box, capsule, and sphere - used by the Trigger to detect if another object has activated it.

|  |  |  |
| --- | --- | --- |
| [image: box trigger] | [image: capsule trigger] | [image: sphere trigger] |
| Box Trigger | Capsule Trigger | Sphere Trigger |

## Placing Triggers

Triggers can be placed in the level by dragging and dropping one of the Trigger types. In **Select** mode, you can drag a Trigger type from the **Place Actors** panel **Basic** tab.

 [image: Placing a trigger]

## Triggering Events

Triggers are used to activate events placed inside of the Level Blueprint (-> level-blueprint-in-unreal-engine). There are several different types of events that a Trigger can activate. The main ones happen in response to some type of collision with another object, such as something hitting or overlapping with the Trigger, or in response to input from the player.

With the Trigger selected in the **Viewport**:

- **Right-click** in the **Level Blueprint Event Graph** and choose one of the events under **Add Event for [Trigger Actor Name]**. [image: Trigger events context menu]

Choosing an event via either of these methods results in an Event node (-> events-in-unreal-engine) being added to the Level Blueprint for the current level:

 [image: Trigger event in Blueprint]

The exec pin of the new event node will fire each time the particular event occurs - in the example above, any time an Actor overlaps (or runs through) the Trigger:

- actors
- trigger

On this page

- Placing Triggers (-> trigger-volume-actors-in-unreal-engine)
- Triggering Events (-> trigger-volume-actors-in-unreal-engine)

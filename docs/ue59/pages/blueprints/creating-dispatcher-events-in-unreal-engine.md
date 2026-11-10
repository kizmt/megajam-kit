# Creating Dispatcher Events

https://dev.epicgames.com/documentation/en-us/unreal-engine/creating-dispatcher-events-in-unreal-engine?application_version=5.9

> Creating events that can be bound and added to the Event Dispatcher's events list.

[image: Creating Dispatcher Events]

Using the **Event** option on the Event Dispatcher's menu creates a custom event with the correct
signature so that it can be bound to the Event Dispatcher. While the event node appears similar to a Custom Event node (-> custom-events-in-unreal-engine), without being connected to a **Bind** node,
this event will never be triggered when the **Call [EventDispatcherName]** node is executed.

## Creating Event Dispatcher Event Nodes

Event Dispatcher **Event** nodes are connected to **Bind Event** nodes by wiring the red square pin on their upper right corner to the red square **Event** input pin on the **Bind Event** node. So, if you already
have a **Bind Event** node for a particular Event Dispatcher and would like to create the event node for it:

- Drag off of the **Event** input pin and release to show the context menu.

- Select **Add Custom Event for Dispatcher** in the context menu.

- An event node will be created and automatically wired correctly to the **Bind Event** node. Enter a name for your event.

Selecting **Assign** from either the Event Dispatcher menu or the context menu will also create a **Bind Event** node and a corresponding **Event** node, already wired together.

### In Blueprint Classes

- Drag off of the Event Dispatcher's name in the **My Blueprint** tab, and drop into the graph you are working in.

- Select **Event** in the menu that appears.

- Enter a name for your event.

### In Level Blueprints

A special type of Event Dispatcher event can be set up in the Level Blueprint, and it is the one case where an event is automatically bound to the Event Dispatcher. These events are created
with the same steps as the default events such as **OnClicked** or **OnOverlap** events. The Level Blueprint documentation (-> level-blueprint-in-unreal-engine) provides
a walkthrough for this process.

These particular events are unique, and are automatically bound at the start of gameplay. As a result, an **Unbind All** node executed at any point will unbind these events as well. It is possible to rebind them,
however, by wiring their delegate pins to **Bind Event** nodes that are executed at other points in gameplay.

- blueprints
- blueprint

On this page

- Creating Event Dispatcher Event Nodes (-> creating-dispatcher-events-in-unreal-engine)
- In Blueprint Classes (-> creating-dispatcher-events-in-unreal-engine)
- In Level Blueprints (-> creating-dispatcher-events-in-unreal-engine)

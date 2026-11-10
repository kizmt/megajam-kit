# Calling Event Dispatchers

https://dev.epicgames.com/documentation/en-us/unreal-engine/calling-event-dispatchers-in-unreal-engine?application_version=5.9

> Calling the Event Dispatcher executes all of the currently bound events in the events list.

[image: Calling Event Dispatchers]

Calling an Event Dispatcher with a **Call** node causes all of the events bound to the Event Dispatcher to fire. You can have more than one **Call** node for each Event Dispatcher, and you can also
call the Event Dispatcher in both Blueprint Classes and Level Blueprints.

## Calling in Blueprint Classes

- Drag off of the Event Dispatcher's name in the **My Blueprint** tab, and drop into the graph you are working in.

- Select **Call** in the menu that appears.

**Alternatively:**

- **Right-click** in the graph.

- Expand **Event Dispatcher** in the context menu that appears.

- Select **Call [EventDispatcherName]** under **Event Dispatcher**.

## Calling in Level Blueprints

- Add a reference (-> level-blueprint-in-unreal-engine) to the Actor in your level you would like to call the Event Dispatcher for.

- Drag off of the output pin of the reference node and release to show the context menu.

- Navigate to **Event Dispatcher > Call [EventDispatcherName]** in the context menu. Searching for "Event Call" should quickly bring up the correct entry. The **Call** node will appear, with the Actor reference already wired to the **Target** pin.

- blueprints

On this page

- Calling in Blueprint Classes (-> calling-event-dispatchers-in-unreal-engine)
- Calling in Level Blueprints (-> calling-event-dispatchers-in-unreal-engine)

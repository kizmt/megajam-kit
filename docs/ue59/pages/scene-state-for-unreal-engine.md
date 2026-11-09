# Scene State

https://dev.epicgames.com/documentation/en-us/unreal-engine/scene-state-for-unreal-engine?application_version=5.9

> An overview of Motion Design Scene State.

[image: Scene State]

## What is Motion Design Scene State?

**Motion Design Scene State** is a state machine plugin designed for broadcast graphics to have behavior encapsulated in states. The main goal of this plugin is to provide a way to isolate different behaviors within a graphic while also defining a relationship between these behaviors and states so that it results in an easier, more maintainable way to build logic.

The plugin itself is built to be usable outside of Motion Design levels. A second plugin, **Motion Design Scene State Integration**, exists to integrate scene state into Motion Design levels, and offer Motion Design-specific tasks.

If you are familiar with state machines in Animation Blueprints, a lot of the elements in Motion Design Scene State will be familiar to you. However, keep in mind that these two systems are completely different and are designed to solve different problems.

## Overview

[image: Scene State User Interface]

- State Machine List TabLists all the state machines present in the Scene State Blueprint.
- Add new state machines by clicking on the ‘Add’ button.
- Select a state machine to view and edit its settings in the details view (4).
- Double-click a state machine to open them in the graph view (7).
- Drag a state machine to reorder them and categorize them.

- Debug View TabViewpoint of the debugged Scene State object.
- For a Motion Design Scene State object, the viewpoint is the game viewport.
- You can change the debugged object from the debug toolbar (3).

- Play World and Debug ToolbarPlay the current world in a specified mode (PIE, Standalone)
- Set the debugged object to inspect the scene state behavior and data for that object.
- You can visualize Scene State behavior and data in the graph view (7) and debug controls (8).

- Details View TabThe Property editor tab for the currently selected editor object.
- This object can be a state, state machine, transition, task, or a Blueprint node like a variable and function, macro, or similar.

- Property Binding ExtensionAn extension to the Details view to provide a way for the target property to be bound to a source property or a property function.
- A source property can be a Blueprint variable, for example.
- It is only available for properties that are bindable.

- My Blueprint TabLike other Blueprints, it holds the variables, functions, events, and other nodes for the Blueprint.
- You can add new variables, events, functions or other nodes by clicking the Add button.

- Graph ViewShows the currently opened graphs.
- These graphs can be state machine graphs, transition graphs, or Blueprint graphs like function or event graphs.
- When in play, it shows the current execution flow for the currently debugged object.
- You can change the debugged object from the debug toolbar (3).

- Debug ControlsSend events to or change the data of the currently debugged object to inspect behavior changes in play.
- You can change the debugged object from the debug toolbar (3).

### State

A **state **is the base object in a state machine. Only one state can be active at a time in a state machine. A state can have tasks, transitions to other states (known as exit transitions), child state machines, and event handlers. Each is discussed in its own section.

When a state becomes active, the state stores the event data required by the event handlers (if any) and both the task graph and child state machines start their execution.

[image: State node]

### State Machine

A **state machine** is the base starting point of execution in a scene state system. Top-level state machines have a Run Mode property you can set to either Auto or Manual.

- ******Auto **means that when the scene state system starts, the state machine will start as well. This is the default option.
- **Manual **means that the state machine will not automatically start, but rather can be started by other means like the Run State Machine task.

[image: State machine category and run mode]

[image: State machine graph]

Due to the underlying scene state architecture, the same state machine can be executed multiple times simultaneously, each execution managing its own instance data separately.

State Machines also contain parameters. For more information, see State Machine Parameters (-> scene-state-for-unreal-engine).

### Entry

An **entry **indicates to the owning state machine which state to first activate when the state machine starts. Only one entry node is considered in a state machine graph.

[image: Entry node]

### Exit

An **exit **indicates to the state machine to finish execution. It is optional so a state machine can have none or multiple. Exits can be a target to transitions, but cannot be a source, as once a transition to an exit executes, the owning state machine’s execution stops.

[image: Exit node]

### Task

A **task **is the main implementable object in the scene state system. It holds specific logic to execute at runtime. Built-in examples include Print String, Delay, and similar. You can implement tasks in either C++ or Blueprints, but C++ is preferable as it has a clearer distinction between logic and instance data, which makes it more performant and memory efficient.

A task can only be owned by one state. A task starts execution when both its owning state is active and its prerequisite tasks are complete. These prerequisite tasks are also owned by the same state.

[image: State task graph]

In the example above, the state owns three tasks: Print Red, Print Blue, and Wait 1s, a delay task. Only Print Blue has a prerequisite task, which is the Wait 1s delay task. This means that once the state becomes active, both the Print Red and the delay task execute in the same frame, and Print Blue executes once the one second wait is over.

A task with more than one prerequisite executes only when all the prerequisite tasks are complete.

### Transition

A **transition **defines a link from a source to a target. The source and targets are typically a state, but can also be conduits or exits (exits can only be targets to a transition).

[image: State machine transition]

[image: State machine transition settings]

Transitions have a priority value. Transitions exiting from the same state or conduit are evaluated in order from highest to lowest priority. The first transition whose conditions are satisfied is executed. If the transition is to another state, the source state becomes inactive and the target state becomes active. If the transition is to an exit, the owning state machine’s execution stops. If the transition is to a conduit, that conduit is evaluated (its exit transitions are evaluated and the process repeats for these).

A transition has a **Wait for tasks to finish** option. If enabled, the state’s tasks must all complete prior to the transition being considered.

[image: State machine transition to an event]

If a transition is to a target state that requires first pushing or broadcasting certain events, the transition also checks that these events are present in the stream. If they are not, the transition is not considered in that evaluation pass. In the above example, the transition from State A to On Event X can only occur if Event X is present in the event stream. For more information about events, see Event (-> scene-state-for-unreal-engine).

#### Transition Graph

[image: Transition graph]

**Transition graphs** are Blueprint graphs that have a boolean as a result that determines whether the transition can occur. Because it goes through the Blueprint system, these graphs are executed last when evaluating a transition. If the other conditions are not met, the transition graph is not executed at all.

In addition, transition graphs with **Can Transition** set to true explicitly get compiled to have no Blueprint overhead. Transition graphs with Can Transition set to false explicitly do not get compiled at all so the transition link does not exist at all in the compiled data.

Transitions have parameters you can use with the transition graphs. For more information, see Transition Parameters (-> scene-state-for-unreal-engine).

### Conduit

**Conduits **are a transition indirection and can hold multiple exit transitions to other targets. A conduit can be connected from multiple states (or other conduits), enabling a reduction of transition links in cases where these same transitions and rules are reusable across multiple states.

A conduit, like a transition, becomes relevant when one of its source states is currently active in the state machine. Conduits have an additional condition graph to determine whether the conduit should be enabled or not.

[image: Complex transitions]

[image: Simplified conduit]

The example above illustrates the benefits of using a conduit. Both graphs express that each state in the graph can transition to the other. The conduit version reduces the number of transition links from twelve to eight while also increasing clarity. This reduction in transition links improves the more states you add.

### Event

When an interesting thing happens outside of a scene state system, it can push an **event **to the scene state system’s event stream, so that it can be handled.

An event is created from an **event schema** which holds a name and an optional user defined struct. These event schemas are held in an **Event Schema Collection** asset. The example below shows a collection with two event schemas:

- Event X that has no properties.
- Event Y that has two properties.

[image: Event schema collection]

#### Event Stream

An **event stream** is the queue of events for a particular scene state system. An event can either be pushed directly to an event stream, or broadcast to a particular context, where all the event streams in that context push a copy of that event to their own stream.

[image: Event stream]

One of the principal ways to broadcast or push events is using the Blueprint API that provides both the **Broadcast Event** and **Push Event** nodes. A Broadcast Event only requires a world context object (for example, an actor, component, or similar), whereas a Push Event requires an explicit stream to push the event to.

These event nodes automatically create pins matching the payload struct of the event. In the example above, the Broadcast Event: Event Y node automatically adds Property A and Property B pins to match the Event Y payload struct.

### Event Handler

**Event handlers** are objects that take ownership of particular events pushed in a stream. This is referred to as capturing events. When an event is captured by a handler, it is no longer visible to other handlers in the stream, and only accessible to the handler that captured the event.

Event handlers are composed of a unique ID, and a handle to an event schema, so that any event created with that event schema is prone to be captured by the event handler.

As mentioned above, you can set states to have event handlers. When a state is activated, it signals to all its event handlers to capture their matching events. The data these captured events hold is then forwarded to tasks in the system by the property binding system. For more information about this binding mechanism, see Property Binding System (-> scene-state-for-unreal-engine).

[image: State machine event handler]

In the example above, the On Event Y state has a handler to the Event Y schema, and so its tasks like the ‘Print String’ task can bind to the payload data of Event Y, which in this case can be Property B. When Event Y gets pushed to the stream, it contains data in that Property B string and is copied to the Print String Message argument.

### Property Binding System

A simple task like Print String has a Message parameter you can set in the Details panel directly. However in a real scenario, tasks usually require something beyond a fixed value. This value can come from Blueprint variables, events, and other sources.

You can use the **property binding system** to solve this. It binds source data to target data. For a task, the target is the task instance data itself. In the example described above, the target struct in this case is the struct containing the message parameter. The source data for a task can be Blueprint variables, events captured by event handlers in the owning state, state machine parameters (of the owning state machine), or results from property functions.

[image: Proeprty binding variable data source]

[image: Property binding in the state machine]

[image: Property binding data bound to task]

The example above illustrates how to bind the SourceMessage variable in the Scene State Blueprint to the Print String task Message parameter.

These bindings get applied once, just before the task starts execution. The bindings are copy operations, so for Print String dealing with its Message parameter, it’s dealing with a copy of the value SourceMessage had at the time. Print String executes its logic immediately, but for tasks that process data at a later time, the source data they copied might have already changed and the data they then process would be only a copy of the source data at the time the task started. For more information, see Property Functions.

As mentioned in the Event Handler section, if a state has event handlers, it means that the state can only be activated if the necessary events are present in the stream. If an event handler is added to a state, the state knows the event data will be present when the state is activated, and so this event data is available as a source for binding:

[image: Event handler property binding]

### Property References

**Property references** give the binding system a way to handle a property by reference rather than by copy. This means the tasks can not only save on copy operations for large structs, but tasks can also write back to properties.

At the moment, property references are limited to being usable in C++ tasks only, but support for Blueprint Tasks is planned.

[image: State machine print Hello World!]

The example above shows the Set String tasks, one of multiple setter tasks where the Target parameter is a property reference. In this example, running the task sets the Source Message variable to "Hello World!".

In addition, you can use property references in parameters like State Machine parameters:

[image: Setting state machine parameters]

[image: State machine parameters]

### Property Functions

Direct binding to properties works well if the source data type is compatible and is in a usable format for the task. In situations where this is not the case, the source data either needs to change to make it usable for the task, or additional custom tasks are needed to address this. Neither option is ideal.

**Property functions** are a layer of logic that execute prior to applying property bindings. The functions mediate between the source data and the target data.

Currently, property functions are only implementable in C++.

For example, a property function like Integer to String gives you a way to feed a source data of type integer into a task’s string parameter. These functions can be found in the same property binding menu, and their availability/visibility depend on the target property type:

[image: State machine set property function source data]

[image: State machine set property function target data]

[image: State machine complete property function]

In the above example, only string functions are shown, as the target property Message is a string. The Integer to String function is used to bind to the Count integer variable.

Property functions unlock all sorts of capabilities. As an example, in combination with property references, the Count integer variable can be incremented using the Integer setter task:

[image: State machine use property function]

Below you can see the result after activating State A multiple times to rerun its tasks:

[image: State machine property function output]

### State Machine Parameters

A state machine can have **parameters**.

[image: State machine parameters]

When executing state machines using the **Run State Machine** task, you can edit these parameters. In the example below, the same state machine is run twice, but with different parameters passed to it.

[image: State machine parameters version 1]

[image: State machine parameters version 2]

These state machine parameters are available for binding for tasks and transition parameters:

[image: State machine using parameters]

### Transition Parameters

Similar to state machine parameters, **transitions **also have **parameters**. The primary reason for transitions to have parameters is to bridge the transition graph with data accessible through the property binding system like state machine parameters, events, and similar.

[image: State machine transition parameters]

These parameters can then be accessed in the transition graph using the Transition Parameters node:

[image: Transition graph parameters node]

On this page

- What is Motion Design Scene State? (-> scene-state-for-unreal-engine)
- Overview (-> scene-state-for-unreal-engine)
- State (-> scene-state-for-unreal-engine)
- State Machine (-> scene-state-for-unreal-engine)
- Entry (-> scene-state-for-unreal-engine)
- Exit (-> scene-state-for-unreal-engine)
- Task (-> scene-state-for-unreal-engine)
- Transition (-> scene-state-for-unreal-engine)
- Transition Graph (-> scene-state-for-unreal-engine)
- Conduit (-> scene-state-for-unreal-engine)
- Event (-> scene-state-for-unreal-engine)
- Event Stream (-> scene-state-for-unreal-engine)
- Event Handler (-> scene-state-for-unreal-engine)
- Property Binding System (-> scene-state-for-unreal-engine)
- Property References (-> scene-state-for-unreal-engine)
- Property Functions (-> scene-state-for-unreal-engine)
- State Machine Parameters (-> scene-state-for-unreal-engine)
- Transition Parameters (-> scene-state-for-unreal-engine)

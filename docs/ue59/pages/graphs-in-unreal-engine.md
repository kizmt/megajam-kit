# Graphs

https://dev.epicgames.com/documentation/en-us/unreal-engine/graphs-in-unreal-engine?application_version=5.9

> Node graph that uses events and function calls to perform actions in response to events associated with the Blueprint.

[image: Graphs]

A **Graph** is a network of nodes that can be connected to one another in order to define the flow of execution for the network. Graphs are the basis for implementing functionality in Blueprints.
Each Blueprint can contain one or more graphs, depending on the type of Blueprint, that define the implementation of a particular aspect of the Blueprint. Each graph within a Blueprint can also
contain sub-graphs, which are essentially collections of nodes collapsed into their own separate graph, mainly for organizational purposes. There are specialized types of Graphs that have unique
properties, but the key principles of adding variable references, adding and connecting Nodes, and debugging will apply throughout.

## Graph Types

### Event Graphs

**Event Graphs** are the most general type of Blueprint graph. Each new Blueprint Class will contain one Event Graph when it is created, although more can be added. These additional Event Graphs can
help to organize your Blueprint networks. Event Graphs generally contain the networks for the gameplay behavior of the Blueprint, with Events (-> events-in-unreal-engine),
CustomEvents (-> custom-events-in-unreal-engine), and **Input** nodes serving to initiate the flow of execution through the Event Graph.

For more information about this section, see the Event Graph (-> event-graph-in-unreal-engine) documentation.

### Construction Script

 [image: Construction Script]

**Construction Scripts** are unique to Blueprint Classes, with only one ConstructionScript graph present in each Blueprint Class. Construction Scripts are useful for Blueprint Class initialization,
as they run right after the **Components** list is set up for the Blueprint Class.

For more information about this section, see the Construction Script (-> construction-script-in-unreal-engine) documentation.

### Functions

 [image: Functions]

**Functions** are node graphs belonging to a particular **Blueprint** that can be executed, or called, from another
graph within the Blueprint. Functions have a single entry point designated by a node with the name of the Function
containing a single exec output pin. When the Function is called from another graph, the output exec pin is activated
causing the connected network to execute.

For more information about this section, see the Functions (-> functions-in-unreal-engine) documentation.

### Macros

**Blueprint Macros**, or **Macros**, are essentially the same as collapsed graphs of nodes. They have an entry point and exit point designated by
tunnel nodes. Each tunnel can have any number of execution or data pins which are visible on the macro node when used in other
Blueprints and graphs.

For more information about this section, see the Macros (-> macros-in-unreal-engine) documentation.

## Working with Graphs

Whether your Graph is a Construction Script, EventGraph, Function, or Macro, you will edit it in the Graph (-> blueprints-visual-scripting-user-interface-for-blueprint-classes-in-unreal-engine) mode of the Editor (-> user-interface-reference-for-the-blueprints-visual-scripting-editor-in-unreal-engine). Fundamentally,
all Graphs contain networks of Nodes connected by Wires.

- blueprints
- graphs

On this page

- Graph Types (-> graphs-in-unreal-engine)
- Event Graphs (-> graphs-in-unreal-engine)
- Construction Script (-> graphs-in-unreal-engine)
- Functions (-> graphs-in-unreal-engine)
- Macros (-> graphs-in-unreal-engine)
- Working with Graphs (-> graphs-in-unreal-engine)

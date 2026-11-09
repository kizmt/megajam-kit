# MetaSound Builder API

https://dev.epicgames.com/documentation/en-us/unreal-engine/metasound-builder-api-in-unreal-engine?application_version=5.9

> Learn how to procedurally author MetaSounds via Blueprint.

[image: MetaSound Builder API]

Learn to use this **Beta** feature, but use caution when shipping with it.

The **MetaSound Builder API** refers to the public Blueprint and C++ API that enables gameplay developers and designers to author MetaSounds procedurally from gameplay code with variations you can use to support different hardware performance levels. With the Builder API, you can create MetaSounds in memory without using the MetaSound Editor.

Additionally, builder-managed MetaSound Sources provide the following benefits:

- You can serialize them at edit time.

- You can play them at edit or runtime.

- You can audition changes live with the Blueprint API. With this, you can produce audible feedback for multiple MetaSound graphs in real time with buffer crossfade support without pops or clicks due to graph changes.

The Builder API does not currently support variables. Paged inputs and graphs also have limited support and are not authorable by Blueprint nor outside of edit time from the frontend Builder API.

## Builder API Overview

The Builder API refers to a loosely related collection of classes or structs in the MetaSound plugin that enable the authoring and execution of MetaSounds.

The MetaSound Editor, Engine, Frontend, and GraphCore modules each have their a builder in charge of:

- Managing MetaSound visualization,

- UObject manipulation and reflection,

- serialization,

- execution.

This document covers how to author MetaSounds more broadly, the `BuilderSubsystem` class (in the MetaSound Engine module), and the `FrontendDocumentBuilder` struct (in the Frontend module).

 [image: slide_3]

MetaSound `UObject` asset classes (`UMetaSoundSource` and `UMetaSoundPatch` types) contain a struct called the `MetaSoundFrontendDocument`.

The `MetaSoundFrontendDocument` contains:

- All graph information necessary to build a `MetaSoundGenerator` instance for playback.

- Style and display metadata utilized by the graph (including node placement coordinates, graph object display names, and widget display information).

The `MetaSoundFrontendDocumentBuilder` struct manipulates the `MetaSoundFrontendDocument` struct. The Blueprint-friendly classes discussed below wrap the `MetaSoundFrontendDocumentBuilder` struct.

## Introduction to Builder Blueprint UClasses

The following table provides an introduction to the primary Blueprint UClasses used when building MetaSounds.

| **Class Name** | **Context** | **Description** |
| --- | --- | --- |
| **MetaSound Builder Subsystem** | Editor / Runtime | Entry point to create and access MetaSound Builders. |
| **MetaSound Editor Subsystem** | Editor Only | Entry point for manipulating editor-only MetaSound data and exporting or serializing MetaSound assets. |
| **MetaSound Asset Subsystem** | Editor / Runtime | MetaSound-specific asset-loading/unloading related functionality. |
| **MetaSound Patch** | Editor / Runtime | Encapsulates shareable utility MetaSound graph behavior. |
| **MetaSound Source** | Editor / Runtime | Encapsulates a graph that outputs audio as a single sound source. |
| **MetaSound Document Interface** | Editor / Runtime | Base Interface implemented by all MetaSound UObjects as entry point to MetaSound Frontend Document struct. |
| **MetaSound Patch Builder** | Editor / Runtime | UObject used to mutate or query MetaSound Patch UObjects. |
| **MetaSound Source Builder** | Editor / Runtime | UObject used to mutate or query MetaSound Source UObjects. |

## Builder Graph Handles

The following UStructs are handles to various types of graph data found in a MetaSound Document.

Underlying handle IDs may be changed when versioning content or rebuilding a transient asset. You should never serialize these.

| **Handle Name** | **Description** |
| --- | --- |
| **MetaSound Node Handle** | Handle to a node in a MetaSound graph. |
| **MetaSound Node Output Handle** | Handle to a node output in a MetaSound graph. |
| **MetaSound Node Input Handle** | Handle to a node input in a MetaSound graph. |

## Builder Blueprint Functions And Editor Actions

Virtually all functionality in the Blueprint Builder API can be related to executable actions that can be performed in the MetaSound Editor.

The most common actions (paired with their MetaSound Editor equivalents) are listed in the sections below.

### MetaSound Construction

Utilizing the MetaSound Builder Subsystem, the following example shows the construction of a builder that creates a new analogous, internally managed MetaSound as it relates to creating a MetaSound from the Content Browser.

Constructing a Source builder returns the builder and handles the underlying MetaSound graph's inputs and outputs.

 [image: slide_8]

Some handles may be invalid or contextual depending on the options set on the Create Source Builder Blueprint node's input. For example, depending on the Is One Shot Blueprint input options, the returned OnFinished node input handle may or may not be valid.

 [image: slide_9]

### Adding Or Removing Interfaces

Similar to utilizing the interface MetaSound panel in the MetaSound Editor, the Blueprint API enables adding and removing entire related sets of inputs and outputs using interfaces.

 [image: slide_10]

### Adding Nodes

You can add nodes with two functions. The first requires a class name and is for natively-defined node classes such as Mixer, Math, or Generator. The second function requires a reference to an object reference that implements a MetaSound Document Interface (for example, MetaSound Source or MetaSound Patch).

 [image: slide_11]

You can determine the name of a natively-defined node class without access to the code by holding **Shift** while hovering a node's name in the MetaSound Editor. A tooltip will display debug info for that node, including the full class name.

 [image: slide_12]

The Blueprint Builder API does not support adding template nodes like reroutes. However, the native Frontend Document Builder API does.

### Accessing MetaSound Node Vertices

You can access individual inputs and outputs on a node with the **Find Node Input/Output** functions.

 [image: slide_13]

Depending on the module / code layer, node connection points may be called pins, vertices, or node inputs and outputs.

### Connecting MetaSound Node Vertices

You can apply connections between nodes by using the **Connect Nodes** function with corresponding input and output handles. This is equivalent to dragging connections between nodes in the MetaSound Editor.

 [image: slide_14]

Depending on the module / code layer, the associations between vertices may be called connections or edges.

### Accessing Graph Input/Output Nodes

You can retrieve member node handles with the **Find Graph Input/Output** functions.

 [image: slide_15]

In the MetaSound Editor, you can hold **Shift** while hovering over a node's pin to display a tooltip with the code name of a given member. Vertices may have display names that differ from the FName.

### Element Removal

You can remove graph elements with the following functions:

- **Disconnect Node** - Removes the connection between the provided input and output handles.

- **Remove Node** - Removes the node associated with the given handle and any associated connections.

- **Remove Graph Input/Output** - Removes the given graph vertex, node, and any associated connections.

- **Remove Interface** - Removes the given interface and all related inputs, outputs, nodes, and connections.

 [image: slide_16]

## Builder Auditioning

One of the MetaSound Source Builder's most powerful features is the ability to audition changes to the underlying MetaSound Source's graph topology in real time.

You can use the **Audition** function on a source builder to play the managed MetaSound Source on the provided AudioComponent. If you set **Live Updated Enabled**, changes to the graph's topology will be instantly reflected.

 [image: slide_17]

As of 5.5, Live Updates is a beta feature.

## MetaSound Editor Subsystem Builder Functions

You can use the **Find Or Begin Building** function to modify an existing MetaSound.

Due to requiring the **MetaSound Editor Subsystem**, you can only modify serialized MetaSound assets in editor builds.

 [image: slide_18]

To set a node's graph position, you can use the **Set Node Location** function on the MetaSound Editor Subsystem at edit time.

 [image: slide_19]

The **Build To Asset** function exports the Builder's MetaSound to a serialized asset with the provided name and path.

Use the right-click context menu in the **Content Browser** to get path information quickly.

 [image: slide_20]

- beta
- audio
- sound sources
- metasounds

On this page

- Builder API Overview (-> metasound-builder-api-in-unreal-engine)
- Introduction to Builder Blueprint UClasses (-> metasound-builder-api-in-unreal-engine)
- Builder Graph Handles (-> metasound-builder-api-in-unreal-engine)
- Builder Blueprint Functions And Editor Actions (-> metasound-builder-api-in-unreal-engine)
- MetaSound Construction (-> metasound-builder-api-in-unreal-engine)
- Adding Or Removing Interfaces (-> metasound-builder-api-in-unreal-engine)
- Adding Nodes (-> metasound-builder-api-in-unreal-engine)
- Accessing MetaSound Node Vertices (-> metasound-builder-api-in-unreal-engine)
- Connecting MetaSound Node Vertices (-> metasound-builder-api-in-unreal-engine)
- Accessing Graph Input/Output Nodes (-> metasound-builder-api-in-unreal-engine)
- Element Removal (-> metasound-builder-api-in-unreal-engine)
- Builder Auditioning (-> metasound-builder-api-in-unreal-engine)
- MetaSound Editor Subsystem Builder Functions (-> metasound-builder-api-in-unreal-engine)

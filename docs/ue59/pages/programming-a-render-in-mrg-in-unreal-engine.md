# Programming a Render in Movie Render Graph

https://dev.epicgames.com/documentation/en-us/unreal-engine/programming-a-render-in-mrg-in-unreal-engine?application_version=5.9

> Movie render graph scripting and concept discussion.

[image: Programming a Render in Movie Render Graph]

This document focuses on Scripting with **Movie Render Graph** which is the successor of **Movie Render Queue**. Movie Render Graph (**MRG**) features a similar feature set to **MRQ** but configuration files are backed by a graph editor. The functionality in Queues and Executors is shared between both systems, but the actual Movie Config and Rendering is now split into two systems that use different Configurations and Functions.

The full runnable scripts and more examples will be available inside of `MovieGraphEditorExample.py` and `MovieGraphEditorExampleHelpers.py` which will be located in the folder `/Engine/Plugins/MovieScene/MovieRenderPipeline/ Content/Python/` and is at the moment attached at the end of the course for the time being. In this document we will be referring to code snippets from the python code and discuss the new concepts within the Movie Render Graph that we should be aware of.

#### Prerequisites

- Familiarize yourself with Movie Render Queue and Movie Render Graph documentation before continuing:Movie Render Queue (-> movie-render-pipeline-in-unreal-engine)
- Movie Render Graph (-> movie-render-pipeline-in-unreal-engine)

- A Level Sequence and a Level to render (Shot)

## Simple Automation Example

The simplest way to render the same shots in an automated way repeatedly is by saving render jobs with specific settings in a Movie Pipeline Queue. Queues organize render jobs, applying preset settings and job properties, which streamlines authoring and managing render jobs.

In the Movie Render Window make sure to either add jobs to render or load a queue. If not done already, in the settings column, choose "replace with graph" and choose the created Movie Graph Setting. In Movie Render Queue Window under the section “Movie Graph Variables” you should see the exposed variable “Custom Output Resolution”

### Creating the Movie Graph Config UAsset

Let's first create an example graph that will help running our code examples. Our Config is based on the default Movie Render Graph Asset which you can either create by running the following snippet which will place a graph in `/Game/MyTests/IntermediateConfig`

 C++

```
import MovieGraphCreateConfigExample

MovieGraphCreateConfigExample.CreateIntermediateConfig()
```

import MovieGraphCreateConfigExample

MovieGraphCreateConfigExample.CreateIntermediateConfig()

or you can create one manually through the Content Browser by right clicking and selecting "Cinematics > Movie Render Graph Config" and applying the following 2 changes.

- On the "Global Output Settings" Node expose the `OutputResolution` by right clicking the node and selecting the checkbox in the context menu
- Expose the Output Resolution to a variable by right mouse clicking the `OutputResolution` pin of the "Global Output Settings" Node and selecting “promote to variable”

Your graph should look similar to this.

If you use the script, visually all nodes will turn entangled, you can just move them apart.

## Modifying User Exposed Parameters

With the new Movie Render Graph we now have the ability to surface per-property overrides as user parameters which are directly overridable in the details panel of the job, similar to how it’s done in Blueprints. Previously, we could only achieve this by creating our own variant of a MoviePipelineExecutorJob in C++ which required maintaining additional code and rebuilding the Editor. Furthermore you could only have one version of an Executor Job definition, which was less ideal for bigger projects that needed different attributes exposed for different kinds of renders. The graph makes it further easy for artists to directly see in the graph what path’s are taken when properties are modified.

In the next snippet we are going to override the exposed variable `CustomOutputRes` which appears on the Movie Render Queue Panel of the job.

 C++

```
def set_user_exposed_variables(job:unreal.MoviePipelineExecutorJob):

    """Find user exposed variable CustomOutputResolution and modify"""

    graph = job.get_graph_preset()

    variables = graph.get_variables()

    if not variables:
```

Discussion:

We first get the graph preset and iterate through the variables until we find "CustomOutputResolution", which we exposed in our graph, to override the render resolution of the rendered images. After that we set the new CustomOutputResolution attribute to a new resolution “720p”, and finally we set the enable state of the variable so that our override is actually applied.

If you wanted to test this on the job that you have in your Queue, you can grab a reference to a job, for example the first one in your queue, and run this function.

 C++

```
#Get The queue subsystem to access the current queue

subsytem = unreal.get_editor_subsystem(unreal.MoviePipelineQueueSubsystem)

pipeline_queue = subsytem.get_queue()

#Get the first job

job = pipeline_queue.get_jobs()[0]
```

If your code is successful, it will set the `Custom Output Resolution` To 720p (HD) - 1280x720.

## Modifying Default Parameters of Graph Node Settings

Even though the recommended way of managing overrides is to expose graph variables and hook them to the graph logic, you might have situations where you need to override settings directly on the nodes themselves. In other words, you might not have exposed user variables, but still want to modify the default values.

 C++

```
@staticmethod

def set_global_output_settings_node(job:unreal.MoviePipelineExecutorJob):

    '''

    This example demonstrates how to make a modification to the global Output Settings

    Node to edit the default values. If you are interseted in just overriding some exposed
```

In this example we first used the input pin of the "Globals" node as our entry point, and assumed that the connected node is `MovieGraphGlobalOutputSettingNode` which we created in this example.

To focus this example on the override of settings, we assume that the Input to the Globals (Outputs Node) is the Global Output Settings Node.

To test setting the global output settings node, you can run the following snippet which should set the resolution on the "Global Output Settings" node.

 C++

```
#Get The queue subsystem to access the current queue

subsytem = unreal.get_editor_subsystem(unreal.MoviePipelineQueueSubsystem)

pipeline_queue = subsytem.get_queue()

#Get the first job

job = pipeline_queue.get_jobs()[0]
```

## Movie Graph Traversal

This is an example of how you traverse your graph settings to visit every node using a depth first search. In the following example, we use the Globals nodes Pin as a starting point to search from right to left until we exhaust all nodes.

To visit every node without traversing pins, call `get_all_nodes()` on the graph config. The graph config also `provides get_graph_topology()` which returns a text snapshot of every node and its connections. Then it **duplicate_nodes()** which copies nodes and the connections between them.

 C++

```
graph = unreal.load_asset("/Game/YourGraph.YourGraph")

output_node = graph.get_output_node()

visisted = set()

def dfs(node, visisted=None):

    visited.add(node.get_name())
```

Having a graph as shown in the image below, we are traversing the nodes and using the "pins" to find the next nodes to process. As different node types can have named pins, we need to keep a list of these properties when encountering a specific node type such as the `MovieGraphBranchNode` which we need to search for both the "True" and "False" Pins recursively. Nodes with a single input will only have an empty string on the pin.

You can also script the graph's comment boxes with:

- `Add_comment_box`
- `Get_comment_boxes`
- `Update_comment_box`
- `Remove_comment_box`
- `Get_nodes_in_comment_box`

Additional examples on Graph operations can be found inside of `Content/Python/MovieGraphCreateConfigExample.py`.

## Additional Movie Render Graph Examples

Attached are two Python files that cover additonal functionality and usage cases with comments. You can import both and study their logic. The `MovieGraphEditorExample.py` offers a complete scripted example of how to create an automation, while reusable functions can be found in the `MovieGraphEditorExample.py` file.

The executor finished callback receives `success = False` if any job had a fatal error. Reporting an error doesn't finish the executor, so custom executors must call `on_executor_finished_impl()` when they have no more work, including after a fatal error.

 C++

```
# Copyright Epic Games, Inc. All Rights Reserved.

# These examples showcase how to use scripting with movie render graph

import unreal

import MovieGraphCreateConfigExample as graph_helper

import MovieGraphEditorExampleHelpers
```

`MovieGraphEditorExample.py`

 C++

```
# Copyright Epic Games, Inc. All Rights Reserved.

#

#

# Helper functions for the Movie Render Graph, each function is a static method

# which helps testing individual functions in isolation. This module is used
```

- sequencer
- movie render queue
- render

On this page

- Prerequisites (-> programming-a-render-in-mrg-in-unreal-engine)
- Simple Automation Example (-> programming-a-render-in-mrg-in-unreal-engine)
- Creating the Movie Graph Config UAsset (-> programming-a-render-in-mrg-in-unreal-engine)
- Modifying User Exposed Parameters (-> programming-a-render-in-mrg-in-unreal-engine)
- Modifying Default Parameters of Graph Node Settings (-> programming-a-render-in-mrg-in-unreal-engine)
- Movie Graph Traversal (-> programming-a-render-in-mrg-in-unreal-engine)
- Additional Movie Render Graph Examples (-> programming-a-render-in-mrg-in-unreal-engine)

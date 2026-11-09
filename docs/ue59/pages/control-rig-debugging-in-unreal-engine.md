# Control Rig Debugging

https://dev.epicgames.com/documentation/en-us/unreal-engine/control-rig-debugging-in-unreal-engine?application_version=5.9

> Find and fix issues inside the Control Rig graph using Control Rig Debugging tools.

[image: Control Rig Debugging]

Use Control Rig's debug tools to evaluate your rig behavior, and address issues in the Rig Graph. This document provides an overview of these tools.

#### Prerequisites

- You have created a Control Rig Asset. See the **Control Rig Quick Start (-> how-to-create-control-rigs-in-unreal-engine)** page for information on how to do this.

## Debug Mode

Similar to **Blueprint Debugging (-> blueprint-debugging-example-in-unreal-engine)**, Control Rig Graphs can be debugged using **Debug Mode**. Using this mode, you can add breakpoints to nodes, step through graph logic, and inspect the live value of properties at any point in the graph.

Debug Mode can be enabled by clicking **ReleaseMode **in the Control Rig Toolbar. This button toggles between **Debug **and **Release **modes.

 [image: control rig debug mode]

Debug mode supports your **Solve Direction (-> control-rig-forwards-solve-and-backwards-solve-in-unreal-engine)** context, and will apply depending on if you are evaluating **Forwards Solve**, **Backwards Solve**, or **Setup Event**.

### Breakpoints

When debugging your node graph, use breakpoints to stop the evaluation of your graph at specified nodes and step through subsequent nodes.. With this, you can temporarily preview parts of your graph that were evaluated before the breakpoint within the viewport. When using breakpoints, time doesn't advance until the evaluation reaches the end of the graph, which causes accumulated time nodes to not change their results.

You can add breakpoints to pause graph evaluation at the chosen node by right-clicking a rig graph node and selecting **Add Breakpoint**. Adding breakpoints will also automatically enable Debug Mode if it is not already enabled.

 [image: control rig breakpoint]

Once a breakpoint is specified, use the **Step **toolbar buttons to step through your graph evaluation, node by node. The Control Rig will only evaluate to the breakpoint or the currently evaluated node.

 [image: control rig node step]

The step buttons perform the following functions:

| Name | Icon | Description |
| --- | --- | --- |
| **Resume** | [image: resume] | Resumes execution after being halted at a breakpoint. This will stop if another breakpoint is encountered. |
| **Focus** | [image: focus] | Focuses the graph view on the node currently being debugged. |
| **Step Next** | [image: step node] | When stopped at a breakpoint, this will jump the debug focus to the next node in the evaluation. |
| **Step Into Function** | [image: step in next] | When stopped at a breakpoint, this will jump the debug focus to the next node in the evaluation. If the next node is contained within a function or collapsed group, the view will enter into the function to focus on the first node of that group. |
| **Step out of Function** | [image: step out next] | When stopped at a breakpoint, this will jump the debug focus to the next node in the evaluation. If the current node is contained within a function or collapsed group, and the next node is located outside the function or group, then the graph view will change to focus on the next node outside of the group. |

### Property Watching

When debugging, the property values for each graph node can be configured to display their updated values in real-time. To enable this, right-click the node pin you want to update in realtime and select **Watch this value**.

 [image: control rig property watch]

Once a property is being watched, it will display value information on top of the node, and an icon next to the property to denote that it is being watched.

 [image: control rig property watch]

To stop debugging a property, right-click the pin and select **Stop watching this value**.

 [image: control rig property watch]

## Class Settings Debug and Profiling

The Class Settings Details panel contains tools and properties for debugging your graph's performance. Click **Class Settings** to reveal this panel.

 [image: control rig class settings]

Enabling **Show Node Run Counts** will display the number of times a node has run in its execution. This can be useful when determining if looping or collection nodes are running correctly.

 [image: control rig show node run count]

### VM Profiling

**Virtual Machine Profiling**, or **VM Profiling**, can also be used to debug real-time graph performance and the speed of node execution.

Click **Enable Profiling** under the **VMRuntime Settings** category to start profiling the rig graph. The **Min **and **Max Duration Color** properties are used to show which nodes are taking the shortest or longest amount of time, in microseconds, to execute. The total microsecond (μs) count is also displayed next to the node.

 [image: control rig vm profiling]

## Execution Stack

The Execution Stack panel provides a reference for the order of node operations within your graph. This can be used to debug your nodes and evaluate the sequence of events.

The Execution Stack panel can be opened by navigating to the Control Rig menu bar and selecting **Window > Execution Stack**.

 [image: execution stack]

Once opened, the Execution Stack displays the following information:

 [image: execution stack]

- **Node Column**, which displays the order of evaluation for all nodes from the given solve direction. Double-clicking any node here will frame the rig graph view to that node. Selecting a node in the Rig Graph will also highlight the instructions associated with it.

- **Node Run Count**, which displays the number of times the node has been executed. This will only display if **Show Node Run Counts** is enabled from **Class Settings** (-> control-rig-debugging-in-unreal-engine).

- **Microsecond Count**, which displays the total time in microseconds (μs) it takes for the node to execute, if **Profiling** (-> control-rig-debugging-in-unreal-engine) is enabled.

- animation
- control rig
- debug

On this page

- Prerequisites (-> control-rig-debugging-in-unreal-engine)
- Debug Mode (-> control-rig-debugging-in-unreal-engine)
- Breakpoints (-> control-rig-debugging-in-unreal-engine)
- Property Watching (-> control-rig-debugging-in-unreal-engine)
- Class Settings Debug and Profiling (-> control-rig-debugging-in-unreal-engine)
- VM Profiling (-> control-rig-debugging-in-unreal-engine)
- Execution Stack (-> control-rig-debugging-in-unreal-engine)

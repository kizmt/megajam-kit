# Property Access

https://dev.epicgames.com/documentation/en-us/unreal-engine/property-access-in-unreal-engine?application_version=5.9

> Using Property Access Node Functions.

[image: Property Access]

**Property Access** allows you to access components and variables that are only accessible on the **Game Thread** anywhere within an Animation Blueprint. Calling a component or variable using Property Access takes a snapshot of its data, which you can use to drive function logic in the Anim Graph (-> graphing-in-animation-blueprints-in-unreal-engine), Animation Node Function (-> graphing-in-animation-blueprints-in-unreal-engine), a Blueprint Thread Safe Function (-> graphing-in-animation-blueprints-in-unreal-engine), or in the Event Graph. Using Property Access reduces the amount of work your project must evaluate on the **Game Thread**, and also reduces the amount of manual blueprint scripting you must perform, leading to increased game and workflow performance.

You can use the following documentation to learn more about using Property Access nodes, pins, and functions that you can use to optimize your project's animation system.

## Overview

When creating logic in an Animation Blueprint (-> animation-blueprints-in-unreal-engine), you will typically use the Event Graph (-> graphing-in-animation-blueprints-in-unreal-engine) to set variables and interface with other Blueprints and Components. The Event Graph is always evaluated on your project's** Game Thread**.

To increase your animation system's performance, you can run **Event Graph** functions on the same **Worker ****Thread** the Animation Graph is updating on, using **Property Access Functions**. For example, you can use Property Access to directly access the character's Velocity without the need to cast to the character blueprint and create a function node to extract the velocity vector.

| Without Property Access | With Property Access |
| --- | --- |
| [image: traditional casting and variable setting on event graph] | [image: property access] |

## Property Access Functions

Property Access works by evaluating a function graph to take a snapshot of a Game Thread variable's or component's data, and converting that data to be Thread Safe compatible (-> graphing-in-animation-blueprints-in-unreal-engine). When creating a Property Access node, or calling a Property Access function on an Animation Blueprint Node pin, you can select from a number of pre-generated functions that access your project's base components and variables.

These functions can provide variables and components such as a character's velocity, movement direction, or a movement component reference, that you can use to drive animation pose selection or blending in the AnimGraph.

 [image: property access node]

For more information about binding Property Access nodes and pins, see the Property Access Bindings (-> property-access-in-unreal-engine) section.

### Custom Property Access Functions

You can also create custom Property Access Functions in order to output more specific or unique values. To create a custom Property Access function, start by adding a new function to the graph, by selecting **Add** (**+**) in the **My Blueprint** panel.

 [image: add function button]

Create a Return Node, and connect it to the Function Node.

 [image: add return node]

Select the **Return Node** and enable the** Pure** property in the **Details** Panel.

 [image: enabled pure property]

Add a new Output value using **Add** (**+**) and name the output, `ReturnValue`.

The Output must be named `ReturnValue` exactly. Any other name will result in the Property Access Function being inaccessible from a Property Access node or pin binding.

 [image: create function output]

You can now build any logic to set the Return Node's Output pin, which will then become the output of any Property Access node or pin bound to your function.

You can now bind the Property Access Function to any Property Access node or pin by selecting the function using the Bind drop down-menu. Property Access Functions are color-coded depending on the data type of the Output.

 [image: property node function]

For optimized performance, we recommend you enable the Thread Safe property for Property Access Functions. After enabling the function as thread safe, you will need to make all of your variable and component references using Property Access as well. By making custom Property Access functions Thread Safe, you can significantly increase your animation system's performance.

## Property Access Bindings

You can access default and custom Property Access Functions anywhere in an Animation Blueprint using either a Property Access node (-> property-access-in-unreal-engine), or as a pin (-> property-access-in-unreal-engine) binding on an existing Animation Blueprint node.

### As a Node

You can create a Property Access node anywhere in an Animation Blueprint. To create a Property Access node, right-click in the** AnimGraph** and select** Property Access **from the **Variables** category.

 [image: create property access node]

After creating a Property Access node, you will need to bind it to a** Function** to reference the component or variable you want to access. You can also bind custom Property Access function graphs, if they meet the necessary requirements. To bind a function to a Property Access node, select a Function from the** Bind** drop-down menu.

Functions are organized by hierarchy, with parent component functions containing child functions that correspond to their child properties. For example, you can navigate beyond a parent Function, to isolate a more specific property that it contains. In this example, a Get property path is created from **TryGetPawnOwner**, to **GetActorLocation**, to a specific axis float value (**X**, **Y**, or **Z**).

 [image: bind property access node]

Once you bind a Property Access node, you can use the node to access the component or variable in your graph, to drive a node's logic.

 [image: property access example]

## As a Pin

You can also bind Property Access Functions directly to some AnimNode pins. To bind a Property Access Function to an AnimNode pin, select the node in the graph and navigate in the node's Details panel to the Input pin binding settings. Select **Function** from the Pin drop-down menu to dynamically drive the pins value.

 [image: property access function as a pin]

## Property Access Settings

The Property Access context-menu contains the following selections and properties:

 [image: property access context menu settings]

| Name | Description |
| --- | --- |
| **Call Site** | The **Call Site** controls which thread to execute the bound Property Access function on. You can select the following options: **Automatic**: Automatically determines the **call site** for the bound Property Access Function based on context and thread safety. You should leave this as the selection in most cases. **Thread Safe**: Evaluates the bound Property Access Function on the **Worker Thread**. **Game Thread** (**Pre-Event Graph**): Evaluates the bound Property Access Function on the **Game Thread**, before the **Event Graph** is evaluated. **Game Thread** (**Post-Event Graph**): Evaluates the bound Property Access Function on the **Game Thread**, after the **Event Graph** is evaluated. **Worker Thread** (**Pre-Event Graph**): Evaluates the bound Property Access Function on the next available **Worker Thread**, before the Event Graph is evaluated. **Worker Thread** (**Post-Event Graph): Evaluates the bound Property Access function on the next available **Worker Thread**, after the **Event Graph** is evaluated. |
| **Functions** | Select a Property Access Function to bind to the node or pin. |
| **Properties** | Select a Variable or Component Reference contained within your Animation Blueprint, that you can bind to the Property Access node or pin. |

## Additional Resources

For more information about using Blueprint Thread Safe Functions and Property Access to optimize your animation system, see the Animation Optimization (-> animation-optimization-in-unreal-engine) documentation.

For a workflow example of using Blueprint Thread Safe Functions and Property Access to get Animation Variables, see the How to Get Animation Variables (-> how-to-get-animation-variables-in-animation-blueprints-in-unreal-engine) documentation.

For a workflow example of optimizing an Unreal Engine project to use Thread Safe functions, see the Adapting Lyra's Animation System blog post.

- optimization
- animation blueprints

On this page

- Overview (-> property-access-in-unreal-engine)
- Property Access Functions (-> property-access-in-unreal-engine)
- Custom Property Access Functions (-> property-access-in-unreal-engine)
- Property Access Bindings (-> property-access-in-unreal-engine)
- As a Node (-> property-access-in-unreal-engine)
- As a Pin (-> property-access-in-unreal-engine)
- Property Access Settings (-> property-access-in-unreal-engine)
- Additional Resources (-> property-access-in-unreal-engine)

# Blueprint Macro Library

https://dev.epicgames.com/documentation/en-us/unreal-engine/blueprint-macro-library-in-unreal-engine?application_version=5.9

> Blueprints that declare and define macros for reuse in other Blueprints.

[image: Blueprint Macro Library]

A **Blueprint Macro Library** is a container that holds a collection of **Macros** or self-contained graphs that can
be placed as nodes in other Blueprints. These can be time-savers as they can store commonly used sequences of nodes
complete with inputs and outputs for both execution and data transfer.

Macros are shared among all graphs that reference them, but they are auto-expanded into graphs as if they were a
collapsed node during compiling. This means that Blueprint Macro Libraries do not need to be compiled. However, changes
to a Macro are only reflected in graphs that reference that Macro when the Blueprint containing those graphs is
recompiled.

## Creating a Blueprint Macro Library

Blueprint Macro Libraries are stored in packages and can be created through the **Content Browser** like any other asset.

- In the **Content Browser**, click on [image: New Asset button] .

- Select **Blueprints > Blueprint Macro Library** under **Create Advanced Asset** from the menu that appears.

- Choose a **Parent Class** for your Blueprint Macro Library. [image: Choose a Parent Class]

- Your Blueprint Macro Library will now appear in the **Content Browser**. Type a name for your Blueprint Macro Library under its icon in the **Content Browser**. When your Blueprint Macro Library is first created, or when you make changes to it in the **Blueprint Editor**, an asterisk will be added to the Blueprint Macro Library's icon in the **Content Browser**. This indicates that the Blueprint Macro Library is not saved.

There are two other methods by which to access the Blueprint Macro Library Creation menu from the **Content Browser**.

- **Right-click** in the Asset View (right-hand) panel of the **Content Browser**, or on a folder in the Asset Tree (left-hand) panel of the **Content Browser**.

- In the menu that appears, select **Blueprints > Blueprint Macro Library** under **Create Advanced Asset**.

- The **Pick Parent Class** window will appear, and from this point the Blueprint Macro Library creation process is the same as if you had used the **New Asset** button.

## Blueprint Macros

**Blueprint Macros**, or **Macros**, are essentially the same as collapsed graphs of nodes. They have an entry point and exit point designated by
tunnel nodes. Each tunnel can have any number of execution or data pins which are visible on the macro node when used in other
Blueprints and graphs.

### Creating Blueprint Macros

Blueprint Macros can be created within a Blueprint Class or Level Blueprint, just like Blueprint Functions. They can also be organized into Blueprint Macro Libraries.

To create a Blueprint Macro inside a Blueprint Class, Level Blueprint, or Blueprint Macro Library:

- In the **My Blueprint** tab create a new macro, by clicking on the **Add Button** on the macros list header .

- Enter a name for your Blueprint Macro.

Your Blueprint Macro will open in a new tab in the **Graph** tab of the Blueprint Editor.

You can also create a Blueprint Macro by **Right-clicking** in the **My Blueprint** tab and selecting **Macro**.

### Building Blueprint Macros

When you first create a Blueprint Macro, a new graph will open containing an **Inputs** tunnel node and an **Outputs** tunnel node.

In the **Details** pane for your Blueprint Macro, you can add input and output execution and data pins. You can also set the **Description**, **Category**, and **Instance Color** of your Blueprint Macro.

To add input or output parameters:

- Click on the **New** button in either the **Inputs** or **Outputs** section of the **Details** pane.

- Name the new parameter and set its type using the dropdown menu. In this example, there is an Integer data input parameter named **Score**, an input execution pin named **Test**, and two output execution pins named **Win** and **Lose**. The tunnel nodes in the Blueprint Macro graph will automatically update with the correct pins.

- You can also set a default value by expanding the entry for the parameter.

To change the location of the pin for this parameter on the edge of the node, use the up and down arrows in the expanded **Details** pane entry.

To give your Blueprint Macro some functionality, connect data and execution wires to the pins of your **Inputs** and **Outputs** tunnel nodes and create a network between them.

This example Blueprint Macro checks if the score that is input into the Macro is greater than the necessary score for winning, and then triggers different output execution flows depending on
the result of the comparison. Note here that the **Test** and **Score** pins were flipped using the up and down arrows in the **Details** pane, to avoid wires crossing in the Blueprint Macro graph.

Unlike Functions, Macros can have more than one output execution pin, so you can have execution flow like this where different output execution pins are activated
depending on the results of graph logic. Also, you could have a Macro with no execution pins that only manipulates data, as long as the nodes within the Macro are not execution nodes.

### Using Macros stored in Blueprint Macro Libraries

Storing Macros in a Blueprint Macro Library makes them accessible to Blueprint Classes and Level Blueprints throughout your project.

There are several ways to add a Macro node to another Blueprint graph. Like Function nodes and Custom Event Call nodes, it is possible to add multiple copies of Macro nodes
throughout the graphs in your Blueprint.

To add a Macro, **Right-click** in the graph and select the Macro in the context menu that appears.

You can also drag and drop off the pin of another node, and the Macro will appear in the context menu if it has a parameter pin of the corresponding variable type and flow direction.

Once the Macro node has been added to the graph, it behaves like any other node and the input and output pins can be wired accordingly. **Double-clicking** on a Macro node in any Blueprint graph
 will open the Macro's graph.

- blueprints
- blueprint

On this page

- Creating a Blueprint Macro Library (-> blueprint-macro-library-in-unreal-engine)
- Blueprint Macros (-> blueprint-macro-library-in-unreal-engine)
- Creating Blueprint Macros (-> blueprint-macro-library-in-unreal-engine)
- Building Blueprint Macros (-> blueprint-macro-library-in-unreal-engine)
- Using Macros stored in Blueprint Macro Libraries (-> blueprint-macro-library-in-unreal-engine)

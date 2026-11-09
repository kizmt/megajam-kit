# Behavior Tree User Guide

https://dev.epicgames.com/documentation/en-us/unreal-engine/behavior-tree-in-unreal-engine---user-guide?application_version=5.9

> Describes how to create and edit Behavior Trees and Behavior Tree related assets.

[image: Behavior Tree User Guide]

## Creating Behavior Tree Assets

This section illustrates how to create the various **Behavior Tree** assets within Unreal Engine 5.

### Creating a Behavior Tree

**Behavior Trees** are essentially the AI's processor and can make decisions and execute various branches based on the outcome of those decisions. **Behavior Trees** are created inside the **Content Drawer** in the following manner:

Click the **+Add** button, then under **Create Advanced Asset** select **Artificial Intelligence** and **Behavior Tree**.

 [image: Click the Add button then under Create Advanced Asset select Artificial Intelligence and Behavior Tree]

The new **Behavior Tree** asset will be added to the **Content Drawer** where you can define its name.

 [image: The new Behavior Tree asset will be added to the Content Drawer where you can define its name]

You can also use the right-click context menu and select **+Add > Artificial Intelligence > Behavior Tree. **

### Creating a Blackboard

The **Blackboard **asset can be considered as the "brain" of the AI and stores **Key** values that the **Behavior Tree** uses to make its decisions. **Blackboard** assets can be created using the following methods:

Click the **+Add** button, then under **Create Advanced Asset **select **Artificial Intelligence **and **Blackboard**.

 [image: Click the Add button, then under Create Advanced Asset select Artificial Intelligence and Blackboard]

The new **Blackboard **asset will be added to the **Content Drawer **which you can rename to your desired name.

 [image: The new Blackboard asset will be added to the Content Drawer which you can rename to your desired name]

Another method in which you can create a Blackboard is inside a Behavior Tree:

Inside the **Behavior Tree Editor** from the Toolbar by clicking the **New Blackboard **button.

 [image: Inside the Behavior Tree Editor from the Toolbar by clicking the New Blackboard button]

This will also create a new **Blackboard** asset inside the **Content Drawer**.

### Creating a Behavior Tree Task

A **Task **is an "action" you want the AI to perform, such as move to a location or rotate to face something.

If optimization is a concern, you may want to consider switching Blueprint Behavior Tree Tasks to native Behavior Tree Tasks.

In addition to the existing **Tasks** available, you can create custom **Tasks** with your own logic:

Click the **New Task **button from the Toolbar inside the **Behavior Tree Editor**.

 [image: Click the New Task button from the Toolbar inside the Behavior Tree Editor]

This will open a new **Blueprint** of the **BTTask_BlueprintBase** class where you can provide your **Task** logic.

 [image: This will open a new Blueprint of the BTTask_BlueprintBase class where you can provide your Task logic]

The **Task Blueprint** will be created inside the **Content Drawer **in the same location as your **Behavior Tree** asset.

Whenever you create a new **Task **from the **Behavior Tree Editor**, it's a good practice to go into the **Content Drawer **and rename the asset instead of using the default name.

When creating a new **Task**, you can use an existing **Behavior Tree Task** as the **Parent Class **to inherit functionality by selecting it from the drop-down menu.

 [image: You can use an existing Behavior Tree Task as the Parent Class to inherit functionality by selecting it from the drop-down menu]

### Creating a Behavior Tree Decorator

**Decorators **(also known as conditionals) attach to nodes inside **Behavior Trees** and can be used to make decisions on whether a branch (or even a single node) in the tree can be executed. There are several default **Decorators** that you can use in your **Behavior Trees**, however, you can also create custom ones:

Click the **New Decorator **button from the Toolbar inside the **Behavior Tree Editor**.

 [image: Click the New Decorator button from the Toolbar inside the Behavior Tree Editor]

This will open a new **BTDecorator_BlueprintBase **class where you can provide your **Decorator** logic.

 [image: This will open a new BTDecorator_BlueprintBase class where you can provide your Decorator logic]

The **Decorator Blueprint** will be created inside the **Content Drawer **in the same location as your **Behavior Tree** asset.

Whenever you create a new **Decorator **from the **Behavior Tree Editor**, it's a good practice to go into the **Content Drawer **and rename the asset instead of using the default name.

When creating a new **Decorator**, you can use an existing **Behavior Tree Decorator** as the **Parent Class** to inherit functionality from by selecting it from the drop-down menu.

 [image: You can use an existing Behavior Tree Decorator as the Parent Class to inherit functionality from by selecting it from the drop-down menu]

### Creating a Behavior Tree Service

**Services** attach to **Composite** nodes and will execute at their defined frequency as long as their branch is being executed. These are often used to make checks and to update the **Blackboard **and take the place of traditional Parallel nodes in other Behavior Tree systems. While there are a few **Services **available by default, you will more than likely want to create your own custom **Services** that assist in determining how your **Behavior Tree** is executed.

If optimization is a concern, you may want to consider switching Blueprint Behavior Tree Services to native Behavior Tree Services.

Click the **New Service **button from the Toolbar inside the **Behavior Tree Editor**.

 [image: Click the New Service button from the Toolbar inside the Behavior Tree Editor]

This will open a new **BTService_BlueprintBase **class where you can provide your **Service **logic.

 [image: This will open a new BTService_BlueprintBase class where you can provide your Service logic]

The **Service** **Blueprint** will be created inside the **Content Drawer** in the same location as your **Behavior Tree** asset.

Whenever you create a new **Service** from the **Behavior Tree Editor**, it's a good practice to go into the **Content Drawer **and rename the asset instead of using the default name.

When creating a new **Service**, you can use an existing **Behavior Tree Service **as the **Parent Class **to inherit functionality by selecting it from the drop-down menu.

 [image: You can use an existing Behavior Tree Service as the Parent Class to inherit functionality from by selecting it from the drop-down menu]

## Editing a Blackboard

Usually, you'll create a **Blackboard** before your **Behavior Tree** as the **Behavior Tree** references the **Blackboard** in its decision-making process (you can always add **Keys** later as you need them). You can edit a **Blackboard** asset by double-clicking on the asset in the **Content Drawer** to open it up in the **Blackboard Editor**.

 [image: You can edit a Blackboard asset by double-clicking on the asset in the Content Drawer to open it up in the Blackboard Editor]

If you are editing a **Behavior Tree** that has an assigned **Blackboard**, you can switch to the **Blackboard** by clicking the tab in the upper-right corner of the window.

 [image: You can switch to the Blackboard by clicking the tab in the upper-right corner of the window]

In the **Blackboard Details** panel, you can assign a different **Blackboard** as the **Parent**, inheriting **Keys** from it.

 [image: In the Blackboard Details panel you can assign a different Blackboard as the Parent, inheriting Keys from it]

You can add **Keys** by clicking the **New Key** button in the **Blackboard** window.

 [image: You can add Keys by clicking the New Key button in the Blackboard window]

Please see **Blueprint Variables** for a breakdown of variable types that can be stored as **Keys**.

When a **Key** has been created, you can define properties associated with the **Key** in the **Blackboard Details** panel.

 [image: You can define properties associated with the Key in the Blackboard Details panel]

| Property | Description |
| --- | --- |
| **Entry Name** | The user defined name of the Key. |
| **Entry Description** | Optional description to explain what this Blackboard Key does. |
| **Key Type** | Defined when you create the Key, however ,**Object** and **Class** Keys provide the additional option of defining a specific **Class**. This enables you to store any type of data that inherits from Object (such as Actors) in them. |
| **Instance Synced** | This is used to determine if the Key will be synchronized across all instances of the Blackboard. |

To **Rename** or **Delete** Key, right-click a **Key** to bring up the context menu, or press **F2** or **Delete** on a **Key**.

 [image: To Rename or Delete Key right-click a Key to bring up the context menu]

For **Class** and **Object** Keys, you can click the little triangle beside **Key Type** which enables you to define the Base Actor Class to use.

 [image: For Class and Object Keys you can click the little triangle beside Key Type]

For **Enum** Keys, there are additional properties that can be set by clicking the little triangle beside **Key Type**.

 [image: For Enum Keys there are additional properties that can be set by clicking the little triangle beside Key Type]

| Property | Description |
| --- | --- |
| **Enum Type** | The assigned Enumeration to use. |
| **Enum Name** | The name of the enum defined in C++ code will take priority over the asset assigned under **Enum Type**. |
| **Is Enum Name Valid** | Set when **Enum Name** override is valid and active. |

## Editing a Behavior Tree

To edit a **Behavior Tree**, you will need to open a **Behavior Tree **asset:

Double-click a **Behavior Tree **asset in the **Content Drawer** to enter **Behavior Tree Mode**.

 [image: Double-click a Behavior Tree asset in the Content Drawer to enter Behavior Tree Mode]

Or by switching over to **Behavior Tree Mode**:

Click the **Behavior Tree **tab in the upper-right corner of the **Behavior Tree Editor**.

 [image: Click the Behavior Tree tab in the upper-right corner of the Behavior Tree Editor]

To switch over to **Behavior Tree Mode**, you will need to have a currently opened **Behavior Tree **asset and are switching from **Blackboard Mode**.

### Assigning a Blackboard

In order for the **Behavior Tree** to access a **Blackboard**, you must assign a **Blackboard **asset:

Select the **Root **node in the graph (or deselect all nodes), then in the **Details **panel, set your desired **Blackboard Asset**.

 [image: In the Details panel set your desired Blackboard Asset]

After assigning a **Blackboard**, the **Blackboard **panel will update with its associated **Blackboard Keys**.

 [image: The Blackboard panel will update with its associated Blackboard Keys]

### Working with Nodes

To add **Composites **or **Tasks **to the graph of your **Behavior Tree**, right-click the graph to bring up the context menu and select your desired node.

 [image: Right-click the graph to bring up the context menu and select your desired node]

Only **Composite **nodes can be connected to the **Root **node of a **Behavior Tree**.

You can also drag off a node and select a node to add from the context menu.

 [image: You can also drag off a node and select a node to add from the context menu]

To remove nodes from the graph, select a node (or nodes) and press **Delete** (or right-click and select **Delete**).

 [image: To remove nodes from the graph select a node or nodes and press Delete or right-click and select Delete]

To connect nodes together, left-click and drag from the output pin, to input pin on another node.

 [image: To connect nodes together left-click and drag from the output pin, to an input pin on another node]

Connecting nodes in **Behavior Trees** only work by connecting an output to an input (you cannot connect from an input to an output).

To disconnect nodes, right-click a node (or define a selection of nodes) and select your desired **Break All Pin Link(s) **method.

 [image: To disconnect nodes right-click a node or define a selection of nodes and select your desired Break Link(s) method]

**Break All Pin Link(s) **can be used to break a single link or multiple nodes that are pinned. **Break link to**... will break the connection to the specified node.

You can also press alt + left-click on an input or output pin to break the connection.

To edit a node, select a node, then in the **Details **panel, you can adjust its properties.

 [image: Select a node and in the Details panel you can adjust its properties]

You can also copy and paste selected nodes and their settings. To do this, select a node (or drag a selection box around a selection of nodes) then press ctrl+c (to copy) and ctrl+v (to paste).

 [image: To copy or paste a node select a node then press ctrl+c to copy and ctrl+v to paste]

### Node Decorators and Services

You can add **Decorators **or **Services **to a node in your **Behavior Tree **graphs from the node context menu.

To do this, right-click a **Composite **or **Task **node, then select the **Decorator **or **Service** you want to add to the node.

 [image: To do this right-click a Composite or Task node then select the Decorator or Service you want to add to the node]

To remove a **Decorator **or **Service **from a node, select a **Decorator **or **Service** then press the **Delete **key or use the right-click context menu.

 [image: To remove a Decorator or Service from a node select a Decorator or Service then press the Delete key or use the right-click context menu]

To edit a **Decorator **or **Service **attached to the node, first, select the **Decorator **or **Service**, then you can adjust your desired properties in the **Details **panel.

 [image: To edit a Decorator or Service attached to the node first select the Decorator or Service then you can adjust your desired properties in the Details panel]

**Composite** **Decorators **that are added to a node, can be opened up for editing.

To open a Composite Decorator, double-click a **Composite Decorator** to open a graph that returns a Boolean (true or false) value.

Click image for full view

Any **Task**, **Decorator**, or **Service **created from the toolbar, can be opened up in **Blueprint **for editing.

After creating a custom **Task**, **Decorator**, or **Service** and adding it to your graph, double-click it to open it for editing:

 [image: After creating a custom Task Decorator or Service and adding it to your graph double-click it to open it for editing]

You can also open any custom **Task**, **Decorator**, or **Service **in the **Content Drawer**.

Double-click a custom **Task**, **Decorator**, or **Service** in the **Content Drawer** to open it in **Blueprint** for editing.

 [image: Double-click a custom Task Decorator or Service in the Content Drawer to open it in Blueprint for editing]

You can also copy **Decorators **or **Services **and paste them onto other nodes.

Select a Decorator or Service and press ctrl+c (to copy) and ctrl+v (to paste) onto another node.

 [image: Select a Decorator or Service and press ctrl+c to copy and ctrl+v to paste onto another node]

- ai
- behavior trees
- behavior tree essentials

On this page

- Creating Behavior Tree Assets (-> behavior-tree-in-unreal-engine---user-guide)
- Creating a Behavior Tree (-> behavior-tree-in-unreal-engine---user-guide)
- Creating a Blackboard (-> behavior-tree-in-unreal-engine---user-guide)
- Creating a Behavior Tree Task (-> behavior-tree-in-unreal-engine---user-guide)
- Creating a Behavior Tree Decorator (-> behavior-tree-in-unreal-engine---user-guide)
- Creating a Behavior Tree Service (-> behavior-tree-in-unreal-engine---user-guide)
- Editing a Blackboard (-> behavior-tree-in-unreal-engine---user-guide)
- Editing a Behavior Tree (-> behavior-tree-in-unreal-engine---user-guide)
- Assigning a Blackboard (-> behavior-tree-in-unreal-engine---user-guide)
- Working with Nodes (-> behavior-tree-in-unreal-engine---user-guide)
- Node Decorators and Services (-> behavior-tree-in-unreal-engine---user-guide)

# Nodes

https://dev.epicgames.com/documentation/en-us/unreal-engine/nodes-in-unreal-engine?application_version=5.9

> Node graph that uses events and function calls to perform actions in response to gameplay events associated with the Blueprint.

[image: Nodes]

**Nodes** are objects such as events, function calls, flow control operations, variables, and so on that can be used in graphs to define the functionality of the particular graph and Blueprint that contains it.

## Working with Nodes

Each type of node performs a unique function; however, the way in which nodes are created and used is common to all nodes. This helps to make for an intuitive experience when creating node graphs.

### Placing Nodes

New nodes are added to a graph by selecting the type of node from the **Context menu**. The node types listed in the context menu depend on the manner in which the list is accessed and what is currently selected.

- **Right-clicking** on an empty space in the **Graph Editor** tab brings up a list of all nodes that can be added to the graph. If an Actor is selected, events supported by that type of Actor are also listed. [image: Blueprint Context Menu]

- Dragging a connection from a pin on a node and releasing in empty space brings up a list of nodes compatible with the type of pin the connection originated from. [image: Blueprint New Connection] [image: Blueprint Context Menu - Pin Specific]

### Selecting Nodes

Nodes are selected by clicking on the node in the **Graph Editor** tab.

A node can be added to, or removed from, the current selection by holding **Ctrl** and clicking on the node.

Multiple nodes can be selected at once by clicking and dragging to create a marquee selection. Holding **Ctrl** + clicking and dragging creates a marquee selection that toggles selection. Holding **Shift** + clicking and dragging creates a marquee selection that adds to the current selection.

To deselect all nodes, simply click in an empty space of the **Graph Editor** tab.

### Moving Nodes

A node is moved by clicking on the node and dragging. If multiple nodes are selected, clicking on any node in the selection and dragging will move all of the nodes.

 [image: Blueprint Moving Nodes]

### Pins

Nodes can have pins on either side. Pins on the left are input pins, while those on the right of the node are outputs.

 [image: Blueprint Input and Output Pins]

There are two main types of pins: execution pins and data pins.

#### Execution Pins

 [image: Blueprint Exec Pins]

**Execution pins** are used to connect nodes together to create a flow of execution. When an input execution pin is activated, the node is executed. Once execution of the node completes, it activates an output execution pin to continue the flow of execution. Execution pins are displayed as an outline when not wired, and solid when wired to another execution pin. Function Call nodes always have only a single input execution pin and a single output execution pin as functions only have one entry point and one exit point. Other types of nodes can have multiple input and output execution pins, allowing for different behavior dependent on which pin is activated.

#### Data Pins

 [image: Blueprint Data Pin Types]

**Data pins** are used for taking data into a node or outputting data from a node. Data pins are type-specific and can be wired to variables of the same type (which have data pins of their own) or a data pin of the same type on another node. Like execution pins, data pins are displayed as an outline when not wired to anything, and solid when wired.

 [image: Blueprint Data Pins]

Nodes can have any number of input or output data pins. The data pins of a Function Call node correspond to the parameters and return value of the corresponding function.

#### Auto-Casting

Connections can be made between certain pins of different data types by way of the auto-casting feature in Blueprints. Compatible types can be identified by the tooltip displayed when attempting to create a connection between two pins.

 [image: Blueprint - Compatible Types Message]

Dragging a wire from a pin of one type to a pin of a different, but compatible, type will cause an **autocast** node to be created with wires to both pins.

 [image: Blueprint - Autocast Node]

#### Promote to Variable

The value represented by a data pin can be converted to a variable within the Blueprint using the **Promote to Variable** command. This command creates a new variable in the Blueprint and wires it to the data pin being promoted. In the case of an output data pin, a Set node is used to set the value of the new variable. Essentially, this is just a shortcut to manually adding a new variable, adding it to the graph and wiring it to the data pin.

You can also create variables by using **Promote to Variable**.

Right-click any input or output data pins on a Blueprint node and select **Promote to Variable**.

By right-clicking the **New Light Color** pin and selecting **Promote to Variable**, we can assign a variable as the **New Light Color** value.

Alternatively, you can drag off an input or output pin and select **Promote to Variable**.

### Wires

Connections between pins are called **Wires**. Wires can represent either the flow of execution or the flow of data.

#### Execution Wires

Wires between exec pins represent the flow of execution. Exec wires are displayed as white arrows spanning from an output exec pin to an input exec pin. The direction of the arrow indicates the flow of execution.

Exec wires produce a visual indicator when being executed. During play, as one node completes execution and the next is activated, the wire between their execution pins highlights the fact that execution is being transferred from one node to another.

The visual indicator for an exec wire fades away over time.

#### Data Wires

Data wires connect one data pin to another data pin of the same type. They are displayed as colored arrows and are used to visualize the transfer of data, with the direction of the arrow representing the direction the data is traveling. The color of a data wire is dependent upon the type of data, just as the color of the data pins.

 [image: Blueprint Data Wire]

#### Working with Wires

Wires are created in the **Graph Editor** tab using one of the methods below:

- Click on one pin and drag and release on another pin of the same type to create a direct connection. The connection can only be made between two compatible types of pins. If you drag a connection on to a pin that is not compatible, an error will be displayed informing you the connection cannot be made.

- Drag a connection from a pin and release in an empty space to summon a context-sensitive menu that lists all the nodes that are compatible with the type of pin the connection originated from. Selecting a node from this list creates a new instance of that node and makes a connection to a compatible pin on the new node. [image: Blueprint Wire Creation - New Node] A wire between two pins can be broken using one of the methods below:

- **Alt + Click** on one of the connected pins.

- **Right-click** on one of the connected pins and choose Break Link(s).

### Collapsed Graphs

Collections of nodes in the graph can be collapsed into sub-graphs for organizational purposes. This creates a hierarchy of graphs and allows large or complex portions of a graph to be viewed as a single node in the parent graph, with inputs and outputs, while still being able to edit the contents of the collapsed graph.

Unlike macros, a set of collapsed nodes is not shared, even within a single Level Blueprint or Blueprint Class. If you copy the collapsed node, it duplicates the internal graph. This can be handy if you want to make several variants of the same approximate behavior, but it also means that any bug fixes would have to be applied to each copy. The feature is really more intended to 'tidy up' a graph, hiding complexity inside, rather than any sort of sharing or reuse.

#### Tunnels

The collapsed graph uses tunnel nodes to communicate and interact externally with the graph that contains it.

The **Inputs** tunnel node acts as the entry point into the collapsed graph. It contains the execution and data pins that correspond to the input pins on the collapsed graph node in the parent graph.

 [image: Blueprint Tunnel Entrance Node]

The **Outputs** tunnel node acts as the exit point of the collapsed graph. It contains the execution and data pins corresponding to the output pins of the collapsed graph node in the parent sequence.

 [image: Blueprint Tunnel Exit Node]

These pins are automatically generated when the nodes are collapsed. Any execution or data wires connected to pins on the first node in the sequence causes a corresponding pin to be created on the **Inputs** tunnel node which appear on the collapsed graph node in the parent sequence as input pins. Similarly, any execution or data wires connected to the last node in the sequence cause corresponding pins to be generated on the **Outputs** tunnel node, and thus as pins on the collapsed graph node in the parent sequence.

#### To Collapse a Collection of Nodes

- Select the nodes to be collapsed in the graph by clicking and dragging a marquee selection box around them or **Ctrl + Clicking** on each node.

- **Right-click** on one of the nodes and choose **Collapse Nodes**. [image: Blueprint Collapse Nodes - Menu Option]

- Enter a name for the collapsed graph in the text field of the new node that appears and press **Enter**. [image: Blueprint Collapse Nodes - Graph Name]

- The collapsed graph is now displayed as a single node, and a reference to the collapsed graph appears in the **My Blueprint** tab.

- To edit the collapsed nodes, **Double-click** the collapsed graph node or select the sub-graph in the **My Blueprint** tab.

#### To Expand a Collapsed Graph:

- **Right-click** on a collapsed graph node and choose **Expand Node**. [image: Blueprint Expand Node - Menu Option]

- The collapsed graph node is replaced by the nodes it contained and is no longer present in the **My Blueprint** tab graph hierarchy. [image: Blueprint Expand Node - Resulting Nodes]

- blueprints
- execution flow

On this page

- Working with Nodes (-> nodes-in-unreal-engine)
- Placing Nodes (-> nodes-in-unreal-engine)
- Selecting Nodes (-> nodes-in-unreal-engine)
- Moving Nodes (-> nodes-in-unreal-engine)
- Pins (-> nodes-in-unreal-engine)
- Execution Pins (-> nodes-in-unreal-engine)
- Data Pins (-> nodes-in-unreal-engine)
- Auto-Casting (-> nodes-in-unreal-engine)
- Promote to Variable (-> nodes-in-unreal-engine)
- Wires (-> nodes-in-unreal-engine)
- Execution Wires (-> nodes-in-unreal-engine)
- Data Wires (-> nodes-in-unreal-engine)
- Working with Wires (-> nodes-in-unreal-engine)
- Collapsed Graphs (-> nodes-in-unreal-engine)
- Tunnels (-> nodes-in-unreal-engine)
- To Collapse a Collection of Nodes (-> nodes-in-unreal-engine)
- To Expand a Collapsed Graph: (-> nodes-in-unreal-engine)

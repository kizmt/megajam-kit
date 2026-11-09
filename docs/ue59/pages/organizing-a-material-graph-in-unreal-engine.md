# Organizing a Material Graph

https://dev.epicgames.com/documentation/en-us/unreal-engine/organizing-a-material-graph-in-unreal-engine?application_version=5.9

> How to use commenting, reroutes, and other strategies to organize Material Graphs and keep them easy to read and edit.

[image: Organizing a Material Graph]

As Materials increase in complexity, the node graph can quickly become difficult to read and interact with. Complicated, unorganized graphs can be slow to edit, and difficult to comprehend when a Material is handed off from the primary author to another artist or developer.

## Material Editor Organization Tools

Unreal Engine includes several tools to improve the organization of your Material graphs.

- Commenting (-> organizing-a-material-graph-in-unreal-engine)

- Reroute Nodes (-> organizing-a-material-graph-in-unreal-engine)

- Named Reroutes (-> organizing-a-material-graph-in-unreal-engine)

- Align and Distribute (-> organizing-a-material-graph-in-unreal-engine)

- Collapse Nodes (-> organizing-a-material-graph-in-unreal-engine)

## Commenting

Comments are the easiest way to improve the readability of a Material graph. This Material isn't overwhelmingly complicated, but without annotations it would take a moment or two to interpret if it was passed off to a second artist.

 [image: Uncommented Material Graph]
 [image: Material Graph with comment boxes]

**A Material Graph network with and without comments.**

Drag the slider to see the same Material annotated with comments. It is immediately apparent from the labels what each group of nodes is doing.

There are two ways to add comments to Materials.

### Node Description

You can add a comment or description to any individual Material Expression or Function in the node graph.

- Hover the mouse pointer over a node in the Material graph.

- **Left-click** the **Toggle Comment Bubble **icon. [image: Toggle comment bubble]

- Enter a comment in the field. [image: Enter comment]

- Click the pin icon if you want the comment to remain visible as you zoom in and out of the Material Graph. This keeps the comment at a readable scale, even when zoomed out. You can click the **Toggle Comment Bubble **icon again to hide the comment. [image: Pin Comment]

Anything you type in the Comment Bubble will also appear in the **Desc **field in the **Details **panel for that node. This description remains visible even when the Comment Bubble is hidden.

 [image: Node description box]

### Comment Box

You can use a comment box to group a selection of related nodes.

 [image: UV Tiling comment box]

- Select all the nodes you want to place in a comment box.

- Press the **C key** to create a comment box around the selected nodes.

- Type a name in the header field.

Comment boxes let you move all the nodes within the box as a single group. **Left-click and drag** the header bar to move a comment box.

- You can add and remove nodes by dragging them in or out of the comment box.

- Resize a comment box by dragging the corners or edges.

- You can nest comment boxes within one another.

### Comment color

Comment boxes have a color property in the **Details **panel.

- Click the **header bar** of a comment box to access its Details properties. [image: Comment header bar]

- Click the **Comment Color **swatch and choose a new color in the **Color Picker** dialog. [image: Comment color picker]

## Reroute Nodes

Reroute nodes provide a way to modify the path of the wire between two Material expression nodes. You can also use a reroute node to split a wire in order to connect it to multiple inputs.

Double-click anywhere along the length of a wire to add a Reroute node.

 [image: Add wire reroute pin]

To modify the path of the wire, hover over the Reroute node until the mouse displays a move icon.

 [image: Move cable reroute pin]

Left-click and drag the node to a new location. Reroutes allow you to redirect wires around nodes that are in the way of the original path.

 [image: New cable path]

In this video a Reroute node is used to split a wire in order to feed it into three downstream inputs.

## Named Reroutes

**Named Reroutes** let you simplify a Material graph by eliminating wire connections and routing information through input and output nodes instead. A Named Reroute is like a tunnel or portal from one region of the Material graph to another.

For example, this small cluster of nodes related to the Roughness map creates a relatively long wire across the middle of the Material graph. Using a Named Reroute you can eliminate the wire without affecting the flow of data.

 [image: Unnecessary cable]

### Creating Named Reroutes

- Double-click along a wire to add a Reroute node. [image: Named reroute pin]

- Right-click the node and choose **Convert to Named Reroute** from the context menu. [image: Convert to named reroute]

- The wire connection disappears and two **Named Reroute **nodes are created at the beginning and end of the connection. Shown side by side you can see how a Named Reroute resembles a tunnel. Data flows into the first node, and exits through the second, which is called a **Named Reroute Usage node.** [image: Named reroute nodes]

The first node in a reroute is called the **Named Reroute Declaration.** It is extremely important to give this node a unique, descriptive name in the **Details **panel.

 [image: Reroute declaration description]

Select the Named Reroute Declaration node and enter a description in the **Name **field. You can also change the **Node Color** property if you want to color-code your reroutes.

Named Reroute **output nodes** can be passed into multiple inputs further downstream, or can be duplicated and used multiple times.

For example, earlier we used a Reroute node to pass the Global UV Controls into three downstream inputs.

 [image: Triple reroute pin]

If this pin is converted to a Named Reroute, three **Usage** nodes spawn instead of one.

 [image: Three usage nodes]

Everything within the **Global UV Controls** comment box is now physically detached from the rest of the node network. You can move it anywhere in the graph and the data will still flow through the Named Reroute into the **Albedo**, **Roughness**, and **Base Normal** UVs.

 [image: Named reroute data flow]

Or if you prefer you could use a single Named Reroute output node and feed it into all three UV inputs.

 [image: Single usage three inputs]

### Adding Named Reroute Usage Nodes

You can add additional Named Reroute Usage nodes from the **right-click ** menu or the **Palette. **

Any Named Reroutes in your Material appear at the very top of the menu. You can also duplicate existing reroute nodes by selecting them and pressing **Ctrl+D. **

 [image: Named Reroutes in palette]

### Convert Back to Traditional Reroute

You can convert any Named Reroute back to an unnamed Reroute pin if you decide it is beneficial to see the wire connection.

 [image: Named reroute]
 [image: Named reroute converted to pin]

The Roughness Named Reroute is converted back to a traditional Reroute pin.

- **Right-click** a Named Reroute Declaration or Usage Node (either one works).

- Choose **Convert to Reroute **from the menu. [image: Convert back to reroute]

- The wire is restored and an unnamed Reroute pin is left behind. You can select the pin and press **delete** if it is no longer needed. [image: Delete reroute pin]

### Reroute Selection Options

There are selection options for Named Reroute nodes that let you **find and select** corresponding Reroute nodes in the Material Graph.

Right-click a **Named Reroute Declaration **node and click **Select Named Reroute Usages** to select all the downstream output nodes for that reroute.

 [image: Select reroute usages]

Right-click a **Named Reroute Usage **node and click **Select Named Reroute Declaration** to select the upstream origin node of the reroute.

 [image: Select reroute declarations]

## Align and Distribute

The Material Editor has several options in the right-click menu to align and distribute nodes in your Material graph.

- Select two or more nodes that you want to align. [image: Select multiple nodes]

- **Right-click** one of the nodes and open the **Alignment **sub-menu. [image: Alignment options]

- Select one of the options to align or distribute the selected nodes. [image: Nodes left-aligned]

In this example, **Align Left** was used to line up the left edge of the selected nodes. **Distribute Vertically** was then used to create equal spacing between them on the vertical axis.

### Align

The options in the Align menu let you align nodes along six different axes. You can also straighten the connection wire between two nodes.

| Option | Result | Shortcut |
| --- | --- | --- |
| Align Top | Align the top edge of selected nodes. | Shift+W |
| Align Middle | Align selected nodes at their vertical middles. | Alt+Shift+W |
| Align Bottom | Align the bottom edge of selected nodes. | Shift+S |
| Align Left | Align the left edge of selected nodes. | Shift+A |
| Align Center | Align selected nodes at horizontal centers. | Alt+Shift+S |
| Align Right | Align the right edge of selected nodes. | Shift+D |
| Straighten Connection | Straightens the wire between two nodes so that it is perfectly horizontal. | Q |

### Distribution

The **Distribution** options allow you to create equal spacing between the selected nodes on either the horizontal or vertical axis.

| Option | Result |
| --- | --- |
| Distribute Horizontally | Create equal horizontal spacing between selected nodes. |
| Distribute Vertically | Create equal vertical spacing between selected nodes. |

## Collapse Nodes

You can use the **Collapse Nodes** option to condense multiple Material Expressions or Functions into a single node.

There are a few reasons you might want to do this.

- If a large group of related nodes is getting too complicated, collapsing them can free up space in the graph and make the Material easier to read.

- A second use case is if a set of nodes is so commonplace or repetitive that you don't need to see the full node network to understand its purpose.

For example, the **Detail Normal Tiling** nodes shown below use a familiar method for controlling the scale of a texture.

 [image: Detail normal tiling]

To simplify the graph, you could collapse everything within the Detail Normal Tiling box .

### How to Collapse Nodes

- Select all the Material nodes you want to collapse. [image: Select node group]

- . **Right-click** one of the nodes and choose **Collapse Nodes** from the context menu. [image: Collapse nodes]

- The selected Material Expressions are replaced by a single node with the default name **Collapsed Nodes**. [image: Nodes collapsed]

- **Left-click **the name at the top of the node, and enter a descriptive name in the field. [image: Rename nodes]

- The Detail Normals section of the graph is greatly simplified. [image: Detail normal simplified]

### Editing Collapsed Nodes

Nothing has changed about the Material Graph. The Collapsed Node simply acts as a container for the node network within it.

If you mouse over a Collapsed Node you will see a preview of the Material graph stored inside.

 [image: Hover preview]

**Double-click** a Collapsed Node to view and edit the contents. This opens a sub-graph within the same Material Editor tab.

Click **Material Graph** in the breadcrumb navigation at the top of the Material Editor to stop viewing the collapsed nodes and return to the main graph.

 [image: Return to graph]

### Expanding Collapsed Nodes

You can expand collapsed nodes back to their previous configuration in the Material Graph.

- Right-click a collapsed node.

- Click **Expand Node** in the context menu. [image: Expand node]

- The collapsed nodes are restored to their original position. [image: Nodes restored]

- materials
- shaders

On this page

- Material Editor Organization Tools (-> organizing-a-material-graph-in-unreal-engine)
- Commenting (-> organizing-a-material-graph-in-unreal-engine)
- Node Description (-> organizing-a-material-graph-in-unreal-engine)
- Comment Box (-> organizing-a-material-graph-in-unreal-engine)
- Comment color (-> organizing-a-material-graph-in-unreal-engine)
- Reroute Nodes (-> organizing-a-material-graph-in-unreal-engine)
- Named Reroutes (-> organizing-a-material-graph-in-unreal-engine)
- Creating Named Reroutes (-> organizing-a-material-graph-in-unreal-engine)
- Adding Named Reroute Usage Nodes (-> organizing-a-material-graph-in-unreal-engine)
- Convert Back to Traditional Reroute (-> organizing-a-material-graph-in-unreal-engine)
- Reroute Selection Options (-> organizing-a-material-graph-in-unreal-engine)
- Align and Distribute (-> organizing-a-material-graph-in-unreal-engine)
- Align (-> organizing-a-material-graph-in-unreal-engine)
- Distribution (-> organizing-a-material-graph-in-unreal-engine)
- Collapse Nodes (-> organizing-a-material-graph-in-unreal-engine)
- How to Collapse Nodes (-> organizing-a-material-graph-in-unreal-engine)
- Editing Collapsed Nodes (-> organizing-a-material-graph-in-unreal-engine)
- Expanding Collapsed Nodes (-> organizing-a-material-graph-in-unreal-engine)

Related documents

Material Functions Reference

 [image: Material Functions Reference] (-> unreal-engine-material-functions-reference)

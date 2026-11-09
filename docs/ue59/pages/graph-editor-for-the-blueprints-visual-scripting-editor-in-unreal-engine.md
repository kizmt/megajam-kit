# Blueprint Editor Graph Editor

https://dev.epicgames.com/documentation/en-us/unreal-engine/graph-editor-for-the-blueprints-visual-scripting-editor-in-unreal-engine?application_version=5.9

> Editable, visual representation of a network of nodes within a Blueprint.

[image: Blueprint Editor Graph Editor]

The **Graph Editor** panel is the heart of the Blueprint system. It is here that you will create the networks of nodes and wires that will define your scripted behavior. Nodes can quickly be selected by clicking on them and repositioned via dragging.

- **Graph Area** - This is where you will actually lay out all of your nodes.

- **Forward and Back Buttons** - These allow you to jump between different graphs very much as you would navigate a web browser.

- **Tabs area** - As you open different graphs, tabs for each one will open here, allowing you to quickly jump between different graphs.

- **Breadcrumbs** - These show a progression of graphs and subgraphs. As you step down into functions or collapsed graphs, this will show you where you are within your network.

- **Zoom Factor** - This simply shows the current zoom ratio in the graph editor.

- **Blueprint label** - This shows the type of Blueprint you are editing. As you edit Blueprint Interfaces, Animation Blueprints, Macros, and other types, this label will update.

### Graph Editor Controls

The **Graph Editor** tab can be navigated using the controls below:

| Control | Action |
| --- | --- |
| **Right-Click + Drag** | Pans the Graph. |
| **Mouse Scroll** | Zooms the Graph. |
| **Right-Click** | Brings up context menu. |
| **Click** on node | Selects the node. |
| **Click + Drag** in empty space | Selects the nodes inside the marquee select box. |
| **Ctrl + Click + Drag** in empty space | Toggles selection of the nodes inside the marquee select box. |
| **Shift + Click + Drag** in empty space | Adds the nodes inside the marquee select box to the current selection. |
| **Click + Drag** on node | Move node. |
| **Click + Drag** from pin to pin | Wires the pins together. |
| **Ctrl + Click + Drag** from pin to pin | Moves wires from origin pin to destination pin. |
| **Click + Drag** from pin to empty space | Brings up context menu showing only relevant nodes. Wires the original pin to a compatible pin on the created node. |
| **Alt + Click** on a pin | Remove all wires connected to the selected pin. |

StaticMesh, SoundCue, SkeletalMesh, and ParticleSystem assets can be dragged from the **Content Browser** and
dropped on the **Graph Editor** tab to create a new AddComponent function call with the asset automatically assigned.

 [image: Blueprints - Drag and Drop Component]

- blueprints

On this page

- Graph Editor Controls (-> graph-editor-for-the-blueprints-visual-scripting-editor-in-unreal-engine)

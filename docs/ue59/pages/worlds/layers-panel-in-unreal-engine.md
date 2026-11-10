# Layers Panel

https://dev.epicgames.com/documentation/en-us/unreal-engine/layers-panel-in-unreal-engine?application_version=5.9

> Tool for organizing Actors in the level into layers for quick selection and controlling visibility.

[image: Layers Panel]

The **Layers** panel allows you to organize Actors in your Level.

Click image for full size.

Layers provide the ability to quickly select as well as control visibility of groups of related Actors.
You can use your layers to quickly un-clutter a scene leaving only the geometry and Actors that you are
working with. For example, you might be working on a building that has multiple levels but is comprised
of many modular parts. By assigning each floor to a layer, you can hide each of the floors you are not
working on making the top view much more manageable.

An Actor can be in as many layers as you want. This might be useful if you have different sets of Actors
that fall under overlapping layers. For instance, you could organize your layers by assigning everything
within a particular zone to one layer and have another layer comprised of all the doors in your level.

When creating large levels, the more extensively you use layers, the easier your job will be. And remember,
it is always easier to start using layers from the beginning rather than trying to incorporate them after
you are already deep into the creation of your level.

## Layer Creation

Layers are created in the **Layers** panel either as empty or using the current selection.

**To create an empty layer:**

- **Right-click** in the **Layers** panel and choose Create Empty Layer. [image: Create Empty Layer menu option]

- The new layer is displayed in the list. [image: Layer1]

**To create a layer from a selection:**

- Select the objects to add to the layer in the viewport. [image: Selected Actors]

- **Right-click** in the **Layers** panel and choose Add Selected Actors to New Layer. [image: New Layer from Selection menu option]

- The new layer containing the Actors is displayed in the list. [image: Layer 1]

**To create a layer by drag and drop:**

- Select the Actor(s) to add to the layer.

- Drag the Actor(s) from the **World Outliner** on to the empty area in the **Layers** panel. [image: Layer drag drop]

- The new layer containing the Actors is displayed in the list. [image: Layer 1]

## Layer Naming

By default, new layers are given a name using a Layer[number] naming scheme. The number is incremented
for each new layer. It is best to make sure you name your layers with descriptive names, and never leave
the default naming. For instance, a layer that contains small items scattered on the floor might be named
Ground Clutter. This not only makes it easy to quickly see what each layer contains, but also makes it
possible to filter the layers using the search (-> layers-panel-in-unreal-engine) feature.

Layer names can contain any alphanumeric characters and can also include spaces, hyphens, and underscores.

**To rename a layer:**

- **Right-click** on the layer and choose **Rename** from the context menu. [image: Rename layer]

- Enter a name in the text box containing the current name. [image: Layer new name]

- The layer is displayed with the new name. [image: Layer new name]

## Searching Layers

Layers can be filtered using the search box at the top of the **Layers** panel. Filtering occurs based on
matches between the text entered in the search box and the names of the layers. As you type in the box, the
list of layers is filtered in real-time; only displaying those layers whose names match the text.

|  |  |
| --- | --- |
| [image: Unfiltered Layer List] | [image: Filtered Layer List] |
| Unfiltered Layer List | Filtered Layer List |

Press the 'X' button to clear the current search terms.

## Layer Contents

The contents of a layer can be viewed directly in the **Layers** panel. The layer contents view displays the
name of the layer, a list of all Actors contained in the layer, and information about the layer's contents.
To enter the layer contents view, press the **See Contents** button at the bottom of the
**Layers** panel with the layer you want to view selected.

Click image for full size.

The name of the layer is displayed at the top along with a collection of buttons showing the various types
and numbers of Actors contained within the layer.

Click image for full size.

The various buttons to the right of the layer's name show how many of each individual type of Actor are contained
within the layer. For instance, the button in the bottom right of the Layers panel informs the user that
there are 139 StaticMeshActors contained within the layer.

These buttons can also be used to perform type-specific selections (-> layers-panel-in-unreal-engine).

To return to the layer list, press the [image: Back button] button.

### Adding Actors

Actors can be added to one or more layers as a selection or by dragging and dropping from the **World Outliner**.

**To add a selection of Actors:**

- Select the Actor(s) to add to the layer. [image: Select Actors to add]

- **Right-click** on the layer you want to add the Actors to and choose Add Selected Actors to Selected Layers. [image: Add Selected Actors to Selected Layers]

**To add by drag and drop:**

- Select the Actor(s) to add to the layer.

- Drag the Actor(s) from the **World Outliner** on to a layer in the **Layers** panel. You can also drag to the contents bar at the bottom of the **Layers** panel to assign the Actors to the selected layer. [image: Layers drag and drop] The layers the Actors are already assigned to are grayed out when dragging and dropping. Additionally, if the Actors being dragged are already assigned to the target layer, a message will inform you of this: [image: All Actors already Assigned to Layer]

- The Actors are added to the layer.

### Removing Actors

Actors can be removed from the layer individually or as a group of selected Actors.

**To remove individual Actors:**

- Press the 'X' button next to the Actor in the layer contents view. [image: Remove Actor button]

- The Actor is removed from the layer and the list is updated. [image: Remove Actor button]

**To remove a selection of Actors:**

- Select the Actors to be removed from the layer. [image: Select Actors to remove]

- **Right-click** on the layer and choose Remove Selected Actors from Layers. [image: Remove Selected Actors menu option]

- The Actors are removed from the layer.

### Searching Layer Contents

The Actors within a layer can be filtered in the layer contents view using the search box at the top. Filtering
occurs based on matches between the text entered in the search box and the names of the Actors. As you type in
the box, the list of Actors is filtered in real-time; only displaying those Actors whose names match the text.

|  |  |
| --- | --- |
| [image: Unfiltered Layer Contents] | [image: Filtered Layer Contents] |
| Unfiltered Layer Contents | Filtered Layer Contents |

Press the 'X' button to clear the current search terms.

## Visibility

The contents of any layer can be shown or hidden by toggling the Visibility (eye)
button for the layer in the layer list.

|  |  |
| --- | --- |
| [image: Layer Visible] | [image: Layer Hidden] |
| Visible [image: Visibility] | Hidden [image: Visibility] |

## Selection Methods

Actors within a layer can be selected as a group, individually, or based on type. The Actors within a layer can also be added to or removed from the current selection.

**To select all Actors within a layer:**

- **Double-click** the layer in the layer list or **right-click** on the layer and choose Select Actors. [image: Select Actors menu option]

- All Actors in the layer are selected, replacing the current selection set. [image: Actors Selected]

**To append layer Actors to the selection:**

- **Right-click** on the layer and choose Append Actors to Selection. [image: Select Actors menu option]

- All Actors in the layer are selected, appending them to the current selection set. |  |  |
| --- | --- |
| [image: Initial Actors Selected] | [image: Layer Actors Appended] |
| Initial Selection | Layer Actors Appended |

**To remove layer Actors from the selection:**

- **Right-click** on the layer and choose Deselect Actors. [image: Select Actors menu option]

- All Actors in the layer are removed from deselected, removing them from the current selection set. |  |  |
| --- | --- |
| [image: Initial Actors Selected] | [image: Layer Actors Removed] |
| Initial Selection | Layer Actors Removed |

### Type-Specific Selection

Type-specific selection allows you to quickly select all of one type of Actor contained within a layer. This can be performed using the buttons in the contents bar of the main layer list or the title bar of the layer contents view.

|  |  |
| --- | --- |
| [image: Contents Bar] | [image: Title Bar] |
| Layer List Contents Bar | Layer Contents View Title Bar |

Pressing the instances button selects all of the StaticMeshActors in the layer.

 [image: Selected StaticMeshActors]

## Details Layers Section

The **Layers** category displays which layers the selected Actor(s) belong to using a tag cloud style layout.

 [image: Layer cloud]

Only the layers common to all selected Actors will be displayed.

Clicking the [image: Remove] button for a particular layer will remove all selected Actors from that layer.

- ui
- building virtual worlds

On this page

- Layer Creation (-> layers-panel-in-unreal-engine)
- Layer Naming (-> layers-panel-in-unreal-engine)
- Searching Layers (-> layers-panel-in-unreal-engine)
- Layer Contents (-> layers-panel-in-unreal-engine)
- Adding Actors (-> layers-panel-in-unreal-engine)
- Removing Actors (-> layers-panel-in-unreal-engine)
- Searching Layer Contents (-> layers-panel-in-unreal-engine)
- Visibility (-> layers-panel-in-unreal-engine)
- Selection Methods (-> layers-panel-in-unreal-engine)
- Type-Specific Selection (-> layers-panel-in-unreal-engine)
- Details Layers Section (-> layers-panel-in-unreal-engine)

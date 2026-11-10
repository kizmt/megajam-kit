# Landscape Visibility Tool

https://dev.epicgames.com/documentation/en-us/unreal-engine/landscape-visibility-tool-in-unreal-engine?application_version=5.9

> This is an overview of the Visibility painting tool.

[image: Landscape Visibility Tool]

The **Visibility** tool gives you a way to mask out (create holes) parts of your Landscape, for areas such as tunnels or caves. This means you can create three-dimensional level environments while using the landscape system despite its two-dimensional heightmap sculpting limitations. You can create areas like tunnels artificially by adding holes to the landscape that seamlessly transition to non-landscape static mesh sections.

## Using the Visibility Tool

In this example, we used the Visibility tool with a **Landscape Material** set up to use a Landscape Visibility Mask node (-> landscape-materials-in-unreal-engine). This means you can paint parts of the Landscape invisible or visible so that you can create caves and other underground areas using additional Static Mesh Actors. This demonstration shows painting the invisibility and then repainting the visibility.

Use the following controls to paint masked or to unmask areas of visibility for your Landscape:

| Controls | Operation |
| --- | --- |
| **Left-Click** | Adds the visibility mask, making the Landscape invisible. |
| **Shift + Left-click** | Removes the visibility mask, making the Landscape components visible again. |

 [image: Before]

 [image: After]

In this example, we used the functionality of the Landscape Visibility Masking node to paint invisible (or masked out) areas for the Landscape. When painting masked-out areas, you only get a visible or invisible state, so there is no way to have a transitional gradient from fully masked to unmasked.

### Using a Visibility Mask to Create a Hole

Although you can use the sculpting tools to create vertical holes in your Landscape, you might find that you also want to create horizontal ones, such as ones for tunnels or caves. You can do so by using visibility masking to "paint" away the visibility of a section of your Landscape with the Visibility tool.

Before you can paint away the visibility of a section of your Landscape, you must set up the Landscape Material correctly using a Visibility Mask Node. For information about setting this up properly, see the Landscape Visibility Mask Node (-> landscape-materials-in-unreal-engine) section in the Landscape Material documentation.

You can also use a Landscape Hole Material assigned to your Landscape Material to paint away visibility, but this is a legacy feature and is more costly to render, and so is not the preferred method. If you are using this method, we recommend switching to using the Landscape Visibility Mask node instead.

### Create a Landscape Hole

- Make sure you have a **Landscape Hole Material** assigned to your Landscape.[image: Landscape Visibility Mask node]
- In the Landscape toolbar, in **Sculpt** mode, select the **Visibility** tool.[image: Visibility Tool]
- Find the location on your Landscape where you want to create a hole.[image: Landscape No Tunnel]
- Adjust the brush size to the size you want to use, then **Left-click** to paint a hole and S**hift + Left-click** to erase an existing hole.[image: Landscape Mountain Cave Mask]
- You can now fit Static Mesh Actors in the hole in the Landscape to create a tunnel.[image: Landscape Mountain Hole] To test out the collision of the new hole using Play In Editor (PIE), you may have to change from **Landscape** mode to **Place** mode.

## Tool Settings

[image: Visibility Tool]

There are no tool settings specific to Visibility that can be adjusted in this section. Follow the steps to set up your Landscape Material with a Visibility Mask node (-> landscape-materials-in-unreal-engine), and use the paint controls to draw in your masked areas.

If you do not have a Landscape Visibility Mask node in the Landscape Material assigned to your Landscape, you will see the following warning in the Visibility tool panel under **Target Layers**:

[image: Visibility Tool Warning]

- landscape

On this page

- Using the Visibility Tool (-> landscape-visibility-tool-in-unreal-engine)
- Using a Visibility Mask to Create a Hole (-> landscape-visibility-tool-in-unreal-engine)
- Create a Landscape Hole (-> landscape-visibility-tool-in-unreal-engine)
- Tool Settings (-> landscape-visibility-tool-in-unreal-engine)

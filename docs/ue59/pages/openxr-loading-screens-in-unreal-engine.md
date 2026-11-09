# OpenXR Loading Screens

https://dev.epicgames.com/documentation/en-us/unreal-engine/openxr-loading-screens-in-unreal-engine?application_version=5.9

> Learn how to use a texture as a loading screen to ease transitions between levels in XR experiences.

[image: OpenXR Loading Screens]

For apps targeting head-mounted displays (HMDs), you can use a texture as a loading screen to ease transitions between levels. At the end of this guide, you will be familiar with the Blueprint nodes used for loading screens and will know how to use them within your project.

## Set Loading Screen Node

The loading screen must be defined before you can display it in the HMD.

On the **Set Loading Screen** node, you can select the texture that you want to use for the loading screen from the **Texture** pin's Select Asset dropdown.

Then, change the **Offset **vector to specify the texture's position relative to the position of the HMD.

 [image: Set Loading Screen Blueprint Node]

Media playback through Media Framework (-> media-framework-in-unreal-engine) is not currently supported with Loading Screens in XR.

## Show and Hide Loading Screen Nodes

Once the Set Loading Screen node has been created, connect its output pin to the **Show Loading Screen** node's execution pin to display it in the HMD.

When you want the loading screen to no longer display, you can connect it to the **Hide Loading Screen** node's execution pin.

 [image: Show Loading Screen and Hide Loading Screen Blueprint Nodes]

Sometimes it's necessary to add a short delay, using the Delay node, after the Show Loading Screen to ensure the loading screen is visible before the next operation.

## Using Loading Screen Nodes

In the following example, a map is loaded using Level Streaming (-> level-streaming-in-unreal-engine) as the map transition.

Follow these general steps to add a loading screen to your project:

- In the Unreal Editor, open your Map in the Level Editor.

- Click **Blueprints > Open Level** **Blueprint**. [image: Open Level Blueprint in the Editor]

- In the Event Graph, add the following nodes: Delay

- Set Loading Screen

- Show Loading Screen

- Load Stream Level

- Hide Loading Screen

 [image: Level Blueprint with all the listed nodes added]

- Connect the output pin from the **Event BeginPlay** node to the input of the **Set Loading Screen** node.

- On the **Set Loading Screen** node: Select a texture from the **Texture** dropdown.

- Set the **Scale** 2D vector to **(1.0, 1.0)** — a nonzero value — to see the texture.

- Set the **Offset** 3D vector for the loading screen to **(1.0, 0.0, 0.5)**. The loading screen should appear in front of you within the HMD, but this position can be different depending on your headset.

 [image: Level Blueprint where the Event BeginPlay node is connected as an input to the Set Loading Screen node]

- Connect the output pin of the **Set Loading Screen** node to the input of the **Show Loading Screen** node. [image: Level Blueprint where the Set Loading Screen node is connected as an input to the Show Loading Screen node]

- Connect the output of the **Show Loading Screen** node to the input of the **Delay** node. The delay node will set a specific time duration for the loading screen to display.

- Set the **Delay** node's **Duration** parameter to **3.0** seconds to make the loading screen display for at least three seconds when you launch the app. [image: Level Blueprint where the Show Loading Screen node is connected as an input to the Delay node]

- Connect the output pin from the **Delay** node to the input of the **Load Stream Level** node.

- On the **Load Stream Level** node: Set the **Level Name** parameter to a different Level in your project.

- Enable **Make Visible After Load**.

- Enable **Should Block on Load**.

 [image: Level Blueprint where the Delay node is connected as an input to the Load Stream Level node]

- Connect the output pin of the **Load Stream Level** node to the input of the **Hide Loading Screen** node. Placing the Hide Loading Screen node after the Load Stream Level node ensures that the Level has finished loading before being displayed. [image: Level Blueprint where the Load Stream Level node is connected as an input to the Hide Loading Screen node]

- Launch the Level on your HMD to see the loading screen appear as the Level changes.

You can also call Hide Loading Screen from Event BeginPlay in the Level Blueprint for the Level you're loading next to ensure the loading screen isn't hidden until the Level has finished loading. You won't need to enable Should Block on Load in the Load Stream Level node when using this method. |

- xr
- vr
- openxr
- splash screens
- loading screens
- ar/vr/xr

On this page

- Set Loading Screen Node (-> openxr-loading-screens-in-unreal-engine)
- Show and Hide Loading Screen Nodes (-> openxr-loading-screens-in-unreal-engine)
- Using Loading Screen Nodes (-> openxr-loading-screens-in-unreal-engine)

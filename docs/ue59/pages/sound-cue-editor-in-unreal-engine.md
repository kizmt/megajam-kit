# Sound Cue Editor

https://dev.epicgames.com/documentation/en-us/unreal-engine/sound-cue-editor-in-unreal-engine?application_version=5.9

> An overview of Sound Waves, Sound Cues, and the Sound Cue Editor.

[image: Sound Cue Editor]

 [image: Sound Cue Editor Overview]

The Sound Cue Editor is a node-based editor that is used to design Sound Cue assets. Sound Cues contain a Sound Node Graph which can store references to imported audio assets, known as Sound Waves, or contain instructions on how to manipulate audio as it flows through the graph.

## Sound Wave

A **Sound Wave** asset is created by importing an audio file and wrapping it with additional properties and control options. These properties can be found by double-clicking on a Sound Wave asset, or by right-clicking and selecting Edit from the context menu.

In Sound Cues, Sound Wave references are built into the Sound Node Graph by using a Wave Player Sound Node or a Wave Param Sound Node.

See Importing Audio Files (-> importing-audio-files) for information on how to create Sound Waves.

A Sound Wave's properties work as a base and can influence any Sound Cues which contain it. For example, increasing the pitch or volume will increase it everywhere it is referenced.

## Sound Cue

A **Sound Cue** is an asset which acts as a container for audio behavior information. Sound Cues are made up of Sound Nodes, which are individual modules that each affect a sound's design. The Sound Nodes are arranged in a graph which displays the relationships between the Sound Nodes and the flow of data between them.

## Creating Sound Cues

To create a Sound Cue, do the following:

- In the **Content Browser**, click the [image: Add Content Button] button or right-click in an empty space in the **Content Browser** to bring up a context menu.

- Under the **Create Advanced Assets** section, click **Sounds**, and then click **Sound Cue**.

- Enter a name for your new Sound Cue.

## Opening the Sound Cue Editor

You can open the Sound Cue Editor by double-clicking a Sound Cue asset in the **Content Browser** or by right-clicking a Sound Cue asset in the **Content Browser** and then clicking **Edit** on the context menu.

For more information about the Sound Cue Editor's User Interface, see the Sound Cue Editor UI (-> sound-cue-editor-ui-in-unreal-engine) documentation.

## Sound Node Graph

The **Viewport** panel contains the Sound Node Graph, which displays the audio signal path with wire-connected Sound Nodes which manipulate the signal as data flows through the Sound Cue.

 [image: Sound Cue Editor Viewport Panel]

You can add a new Sound Node by right-clicking on an empty space in the **Viewport** panel or by dragging off an existing node's connection pin into an empty space. In both cases, you will be prompted with a search-enabled context menu where you can select the Sound Node type of the new node.

 [image: Add Node Methods and Search Context Menu]

You can also add a new Sound Node by dragging a Sound Node type from the **Palette** panel to either an empty space or to an existing node's connection pin.

 [image: Palette Panel Drag to Empty]
 [image: Palette Panel Drag to Pin]

To preview playback, use the play buttons located in the toolbar at the top of the Sound Cue Editor window. The **Play Cue** button plays the entire Sound Cue, and the **Play Node** button plays the sound from the selected node. (If multiple nodes are selected, the **Play Node** button is grayed out and unavailable.)

 [image: Sound Node Graph Example 00]

While a Sound Cue is playing, to aid in debugging, the wires of currently active nodes turn red. This makes it easy to follow the Sound Cue's construction in real time.

 [image: Sound Node Graph Example 00 Playing]

Due to the connection pin locations on Sound Nodes, it's highly recommended to build a Sound Node Graph from left to right. Start with Sound Wave playing nodes (such as Wave Player or Wave Param), then all relevant control nodes (such as Delay or Modulator), and end with the Output node.

For explanations of the nodes available for use within the Sound Cue Editor, see the Sound Cue Reference (-> sound-cue-reference-for-unreal-engine) documentation.

- audio
- sound
- sound cues

On this page

- Sound Wave (-> sound-cue-editor-in-unreal-engine)
- Sound Cue (-> sound-cue-editor-in-unreal-engine)
- Creating Sound Cues (-> sound-cue-editor-in-unreal-engine)
- Opening the Sound Cue Editor (-> sound-cue-editor-in-unreal-engine)
- Sound Node Graph (-> sound-cue-editor-in-unreal-engine)

# Rewind Debugger

https://dev.epicgames.com/documentation/en-us/unreal-engine/animation-rewind-debugger-in-unreal-engine?application_version=5.9

> With the Rewind Debugger you can record real-time segments of projects and preserve the data for debugging workflows.

[image: Rewind Debugger]

Using the **Rewind Debugger,** you can record a gameplay segment of a project during runtime, and rewind the simulation to observe information about animation behaviors and interactions. Building off of the Animation Insights (-> animation-insights-in-unreal-engine) foundation, the Rewind Debugger provides a refreshed visual interface to debug animation content in **Unreal Engine**.

#### Prerequisites

- Enable the **Animation Insights** plugin (-> working-with-plugins-in-unreal-engine). Navigate in the **Menu Bar** to **Edit > Plugins** and locate **Animation Insights** in the **Animation** section, or use the **Search Bar**. Enable the plugin and restart the editor.

 [image: animation insights plugin]

## Overview

When working with character animation systems in Unreal Engine, it can be difficult to isolate the source of a bug. Using the Rewind Debugger, you can record a segment of gameplay, and then scrub through the recording to debug animation content in a more functional and stable work environment.

 [image: demonstration of the rewind debugger]

Animation data is represented visually, on tracks that populate the **Rewind Debugger Timeline** after selecting a target object. The Rewind Debugger tracks can contain information about Animation Blueprints (-> animation-blueprints-in-unreal-engine), Sequence (-> animation-sequences-in-unreal-engine) playback, animation variables (-> how-to-get-animation-variables-in-animation-blueprints-in-unreal-engine), notifies (-> animation-notifies-in-unreal-engine) and more.

 [image: animation data tracks in the rewind debugger timeline]

To open the Rewind Debugger window, navigate in the **Menu Bar** to **Tools** > **Debug** > **Rewind Debugger**.

 [image: open the rewind debugger by navigating to the menu bar and then tools and then debug and then select rewind debugger]

You can view more precise animation data in the **Rewind Debugger Details** panel, after selecting a track from the Rewind Debugger Timeline. To open the Rewind Debugger Details panel, navigate in the **Menu Bar** to **Tools** > **Debug** > **Rewind Debugger Details**.

 [image: open the rewind debugger details panel by navigating to the menu bar and then tools and then debug and then select rewind debugger details panel]

## Rewind Debugger Interface

The Rewind Debugger panel is populated with a unique interface you can use to observe animation data while navigating recorded gameplay segments.

 [image: rewind debugger window overview with highlighted regions]

| Feature | Image | Description |
| --- | --- | --- |
| **1. Project Simulation Controls** | [image: project simulation controls play pause stop eject] | Controls the project's simulation with features such as **Play**, **Pause**, and **Stop**. For more information, refer to the Unreal Editor Interface (-> unreal-editor-interface) documentation. |
| **2. Rewind Debugger Camera Menu** | [image: rewind debugger menu featuring camera mode and view options for available data tabs] | Select the camera behavior for the gameplay recording playback. The Camera Modes are as follows: **Disabled**: Disables camera movement, leaving the camera unattached and untethered to any game object. **Follow Target Actor**: Locks the camera to the selected object from a pre-positioned location. You can position the camera anywhere in the level, and the camera moves along the same track as the selected object. This option does not track the selected object, it moves the camera based on the same movement data as the character. **Replay Recorded Camera**: locks the camera to the position it occupied in the simulation, following the same movements if there were any. Eject the player control in the Project Simulation Controls before attempting to change the Camera Control Mode. |
| **3. Object Outliner** | [image: rewind debugger object outliner with dropper and filter tool highlighted] | After recording a gameplay segment, you can choose a game object from the **Object Outliner** dropdown menu to populate the Rewind Debugger panel. After selecting a game object, the Object Outliner lists the selected object, and all child objects and components, including any that are created or destroyed during runtime as well as any attached controllers. The Object Outline has the following tools you can use to assist in selecting game objects to debug, and in filtering their connected components. **Dropper Tool**: You can use the Dropper tool to manually select a game object to debug in the Viewport. **Filter Menu**: You can use the Filter Menu to filter the Object Outliner's list of components and child objects of the selected game object. Some game objects are composed of many components, such as a Movement Component, Animation Blueprints (-> animation-blueprints-in-unreal-engine), and more. Each of these components is listed as a child object in the Object Outliner with an associated track in the Rewind Debugger Timeline, and must be selected individually to see their respective data within the **Rewind Debugger Details** panel. |
| **4. Playback Controls** | [image: rewind debugger playback controls play pause forward back with record highlighted] | Lets you control the playback of the recorded gameplay segment. You can **Start** and **Stop** the recording with the **Record Button**, as well as **Play**, **Pause**, and **Scrub** through the **Rewind Debugger Timeline**. |
| **5. Rewind Debugger Timeline** | [image: rewind debugger timeline with red playhead and animation data tracks] | After selecting a game object to debug, the Rewind Debugger Timeline populates with the selected game object's components and child objects. Each component or child object is given a track where you can visually see changes in its data, variables, and curve values during the recorded gameplay segment. You can select a track in the Rewind Debugger Timeline to observe more precise animation data values in the **Rewind Debugger Details** panel. By clicking and dragging the red playhead, you can scrub through the Timeline manually to observe the animation data changes in the Rewind Debugger Details Panel and Viewport simultaneously. |
| **6. Rewind Debugger Details Panel | [image: rewind debugger details panel with data tabs and view options highlighted] | The Rewind Debugger Details panel displays all available data depending on the selected track in the Rewind Debugger Timeline and the position on the Timeline. Displayed information can include variable values, boolean states, and more. Depending on the track you have selected in the Rewind Debugger Timeline, contextual data populates the panel. You can open the Rewind Debugger Details panel by navigating in the Menu Bar to **Tools > Debug > Rewind Debugger Details**. |

## Using the Rewind Debugger

- To use the Rewind Debugger, first start the game simulation by clicking the** Green Play Button** in the Project Simulation Controls.

- Click **Record** in the Rewind Debugger Playback controls to begin recording the project simulation. To disconnect your cursor from the simulation, without stopping or pausing the simulation, use the hot key **Shift + F1**.

- When you have recorded a gameplay segment, pause the simulation and eject the camera using the Project Simulation Controls. [image: in the simulation controls pause and then eject the game controller]

- The recording stops automatically when the simulation is paused.

The recorded section of gameplay is now prepared for use. You can begin debugging game objects by selecting a game object from the **Object Outliner** or by selecting your game object in the Viewport using the **Dropper** tool.

After selecting a game object, the **Rewind Debugger Timeline** contextually populates with tracks of animation data relevant to the game object's components and child objects. You can scrub through the Rewind Debugger Timeline with the Playhead or the Playback Controls, to see how the recorded animation data updates the game object in the Viewport.

For a quick readout of animation data values in the Timeline, hover over a timeline track to see a readout of the current value of the animation track at the position in time of the recorded segment.

 [image: hover your cursor over animation data tracks for a quick readout of animation data values]

Within the **Rewind Debugger Menu** you can also select a different **Camera Mode** to obtain a different view of the subject while debugging. For example, with the **Disabled** option, you can detach the camera and position it freely and observe your game object from any angle to assist in your workflow.

 [image: playback scrubbing from a different camera angle]

With the recorded gameplay segment paused you can temporarily detach the viewport from the actor, when using the **Follow Target Actor** or **Replay Recorded Camera** options, using the **Pilot Actor** view settings in the Viewport.

 [image: pilot actor viewport option]

After making edits to your game object or animation system, you can simply reattach the game controller using the controller icon in the Project Simulation Controls, and resume the game to continue debugging. The Rewind Debugger continues recording gameplay when the game simulation is resumed, unless manually stopped.

### Trace Files

When recording gameplay segments with the Rewind Debugger, Trace Files (-> trace-in-unreal-engine-5) are simultaneously recorded and stored on your local machine. You can access properties and settings to manage your Trace Files, such as pause trace file recording, start new trace file recordings, and open recent trace file recordings in Unreal Insights.

 [image: trace file settings]

Trace Files will be recorded and stored indefinitely, so it is important to manage your trace files, deleting old files occasionally. You can access the location of your save trace files for management, by selecting the Trace Icon in the bottom bar, and navigating to Open Trace Store Directory.

 [image: open trace file directory]

You can also access trace files by following the file path trajectory:

```
"Drive":\Users\"User Name"\AppData\Local\UnrealEngine\Common\UnrealTrace\Store\001
```

"Drive":\Users\"User Name"\AppData\Local\UnrealEngine\Common\UnrealTrace\Store\001

## Animation Blueprints

After obtaining a recorded gameplay segment you can** double-click **an Animation Blueprint component in the Object Outliner to open and attach the Animation Blueprint Editor (-> animation-blueprint-editor-in-unreal-engine) in a new window. While scrubbing through the recorded segment, the Animation Blueprint Editor displays the recorded state of the selected Animation Blueprint corresponding to the recorded moment of the game object.

 [image: attached animation blueprint demo simultaneous debugging]

With this functionality, you can observe how the animation blueprint produces the Output pose at any moment of the recorded gameplay segment. You can observe Animation Blueprint nodes (-> animation-blueprint-nodes-in-unreal-engine), variables (-> how-to-get-animation-variables-in-animation-blueprints-in-unreal-engine), state machine (-> state-machines-in-unreal-engine) positions and more.

### Pose Watch

While within an Animation Blueprint, you can enable pose watching (-> animation-shortcuts-and-tips-unreal-engine) on **Animation Blueprint Nodes** to see each node's effect on the **Output Animation Pose** during the recorded gameplay. This can be extremely useful for understanding what influence each node has on the object's animation during the gameplay recording.

 [image: use pose watch animation blueprint nodes with rewind debugger]

Animation Blueprint Nodes (-> animation-blueprint-nodes-in-unreal-engine) must be enabled to Pose Watch (-> animation-shortcuts-and-tips-unreal-engine), before the Rewind Debugger records a segment of gameplay. Pose Watching can then be toggled while using the recorded gameplay segment.

## Rewind Debugger Settings

Here you can reference the **Rewind Debugger Settings**, accessed in Unreal Engine's Project Settings (-> unreal-editor-preferences). Open the Project Settings by selecting **Edit** **>** **Project Settings** in the menu. The Rewind Debugger Settings section is listed under the **Plugins** category.

 [image: rewind debugger settings in unreal engine project settings under plugins]

| Setting | Description |
| --- | --- |
| **Camera Mode** | Here you can view the current, saved **Camera Mode**. You can set the saved **Camera Mode** option within the settings, or within the **Rewind Debugger Camera Menu**. You can select from the following camera options: **Disabled**: disables camera movement, leaving the camera unattached and untethered to any game object. **Follow Target Actor**: locks the camera to the selected object from a pre-positioned location. You can position the camera anywhere in the level, and the camera will move along the same track as the selected object. This option does not track the selected object, it moves the camera based on the same movement data as the character. **Replay Recorded Camera**: locks the camera to the position it occupied in the simulation, following the same movements if there were any. |
| **Should Auto Record on PIE** (**Play In Editor**) | When **enabled**, the Rewind Debugger will automatically record gameplay when the game simulation has begun, as long as the Rewind Debugger is open. When **disabled**, gameplay recording will need to be manually activated. |
| **Show Empty Object Tracks** | When **enabled**, empty animation data tracks will still be visible in the Rewind Debugger Timeline. When **disabled**, all empty tracks will be hidden. |

## Extensibility

The Rewind Debugger's uses extend beyond the version packaged with the Animation Insights plugin. Teams can build and add their own custom tracks to Rewind Debugger to display their project specific components or gameplay elements.

An example of how the Rewind Debugger can be modified to fit a project's specific needs can be seen in the **Pose Search plugin** with unique debug tools designed for working with Pose Searching animations.

 [image: pose search plug in experimental]

With both plugins installed, a custom Pose Search track is added to the Rewind Debugger when the selected character uses the Pose Searching node, which contains expanded Pose Search animation data to assist with debugging.

 [image: custom pose search node data tracks in the rewind debugger timeline]

You can try out the Pose Searching feature, but it is Experimental, and we do not recommend shipping projects with it.

- animation
- blueprints
- sequencer

On this page

- Prerequisites (-> animation-rewind-debugger-in-unreal-engine)
- Overview (-> animation-rewind-debugger-in-unreal-engine)
- Rewind Debugger Interface (-> animation-rewind-debugger-in-unreal-engine)
- Using the Rewind Debugger (-> animation-rewind-debugger-in-unreal-engine)
- Trace Files (-> animation-rewind-debugger-in-unreal-engine)
- Animation Blueprints (-> animation-rewind-debugger-in-unreal-engine)
- Pose Watch (-> animation-rewind-debugger-in-unreal-engine)
- Rewind Debugger Settings (-> animation-rewind-debugger-in-unreal-engine)
- Extensibility (-> animation-rewind-debugger-in-unreal-engine)

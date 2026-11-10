# Animation Blueprint Editor

https://dev.epicgames.com/documentation/en-us/unreal-engine/animation-blueprint-editor-in-unreal-engine?application_version=5.9

> An overview of the Animation Blueprint Editor and its user interface.

[image: Animation Blueprint Editor]

The **Animation Blueprint Editor** shares similar functionality to the Blueprint Editor (-> user-interface-reference-for-the-blueprints-visual-scripting-editor-in-unreal-engine), but contains different features, tools, and windows to aid in character animation scripting.

This document provides an overview of the Animation Blueprint Editor interface.

#### Prerequisites

- You have created an Animation Blueprint (-> animation-blueprints-in-unreal-engine) and opened it.

- You have a basic understanding of Blueprint Visual Scripting (-> blueprints-visual-scripting-in-unreal-engine), from which the Animation Blueprint Editor derives much of its interface and behavior.

Upon opening an Animation Blueprint, the following interface will be displayed:

 [image: animation blueprint editor]

- **Toolbar** (-> animation-blueprint-editor-in-unreal-engine), which contains buttons for Animation Blueprint management and editor type switching.

- **Viewport**, where you can preview the behavior of your Animation Blueprint logic on your character. For more information, refer to the Viewport (-> animation-editors-in-unreal-engine) section of the Animation Editors (-> animation-editors-in-unreal-engine) page.

- **My Blueprint**, similarly found (-> my-blueprint-panel-in-the-blueprints-visual-scripting-editor-for-unreal-engine) in the Blueprint Editor, contains a list of your graphs, functions, variables and other related properties within the Animation Blueprint. Also contained here is the **Pose Watch Manager** panel, refer to the Animation Shortcuts and Tips (-> animation-shortcuts-and-tips-unreal-engine) page for more information.

- **Graph** (-> animation-blueprint-editor-in-unreal-engine), which displays the different graphs for visual scripting in your Animation Blueprint.

- **Details**, which displays properties for the selected item.

- **Anim Preview Editor** (-> animation-blueprint-editor-in-unreal-engine), where you can make changes to your variables and class defaults. Docked on a separate tab is the **Asset Browser** where you can view and open the animation assets that are associated with this Skeleton. Visit the Asset Editor (-> animation-sequence-editor-in-unreal-engine) section of the Animation Sequence Editor (-> animation-sequence-editor-in-unreal-engine) page for more information.

## Toolbar

The Toolbar is where you compile your Blueprints, **Save**, locate the Animation Blueprint asset in the **Content Browser**, and define **Class Settings** and **Class Defaults** settings. Several buttons and tools here are common for most Animation Editors, such as **Preview Mesh**. You can learn more about these common menus from the Animation Editors Toolbar Section (-> animation-editors-in-unreal-engine).

 [image: animation blueprint toolbar]

The Animation Blueprint Editor Toolbar provides the following buttons and menus:

| Name | Icon | Description |
| --- | --- | --- |
| **Compile** |  | Compiles this Animation Blueprint. This icon will change depending on the compilation state of the Blueprint. In most cases, making changes to any Graph will require you to recompile. Clicking the **Options** menu will reveal additional behaviors when compiling. **Save On Compile** can be used to automatically save the Animation Blueprint upon compiling. **Jump to Error Node** can also be enabled to automatically frame the graph node preventing a successful compile. [image: animation blueprint compile settings] |
| **Diff** |  | If you are using a Source Control Package (-> using-source-control-in-the-unreal-editor) in Unreal Engine, then this dropdown menu can be used to compare your current Animation Blueprint against previous revisions. |
| **Find** |  | Opens a search panel where you can search for references to functions, events, variables, nodes, and pins within all graphs. You can also press **Ctrl + F**. Additionally, pressing **Ctrl + Shift + F** will open a search window where you can search through all Blueprints in your project, Animation or otherwise. |
| **Hide Unrelated** |  | Enabling this will fade out any nodes not currently selected or directly linked to your selected node in the Graph. You can also enable **Lock Node State** from the options menu, which will maintain the current hidden state of all nodes, regardless of your selection afterwards. [image: animation blueprint hide unrelated] |
| **Class Settings** |  | Clicking this exposes several Blueprint class settings in the Details panel. Most of these properties are general Blueprint (-> blueprints-visual-scripting-in-unreal-engine) class settings. However the following settings are specific to Animation Blueprints. **Target Skeleton**: Specifies the Skeleton Asset to use for this Animation Blueprint. **Use Multi Threaded Animation Update**: Enables the Animation Blueprint to update its native update, blend tree, montages, and asset players on a worker thread. The compiler will attempt to pick up any issues that may occur with the threaded update. **Warn About Blueprint Usage**: Enabling this causes warnings to occur whenever a call into the Blueprint is made from the AnimGraph. This can help locate optimizations that need to be made. |
| **Class Defaults** |  | Clicking this exposes your Blueprint's variables in the Details panel, including default variables from the Blueprint class. **Root Motion Mode**: Controls how root motion (-> root-motion-in-unreal-engine) is applied within this Animation Blueprint. You can select the following options: **No Root Motion Extraction**, which causes no root motion to be extracted or applied. **Ignore Root Motion**, which extracts root motion, but does not apply it. **Root Motion from Everything**, which enables root motion from all animation sources. Typically you should not enable this in multiplayer or network setups. **Root Motion from Montages Only**, which causes root motion to only apply from Animation Montages (-> animation-montage-in-unreal-engine). This is a more suitable option for multiplayer or network setups. **Receive Notifies from Linked Instances**: Whether to process notifies from any linked anim instances. **Propagate Notifies to Linked Instances**: Whether to propagate notifies to any linked anim instances. **Use Main Instance Montage Evaluation Data**: Enabling this causes linked instances to use the main instances' montage data, synchronizing all instances when the main instance plays a montage. |
| **Play / Simulate** |  | These buttons can be used as a way to start playing or simulating the Animation Blueprint, using the In-Editor Testing (-> ineditor-testing-play-and-simulate-in-unreal-engine) framework. |
| **Debug Object** |  | This drop-down menu links the Animation Blueprint viewport to an active animation instance in a simulating or playing session. This previews the current animation from that session in the Control Rig viewport. Additionally, your graph nodes will also respond to any inputs and changes that occur in session, so that you can debug your graph and character state. |
| **Animation Editors / Blueprint** |  | When creating an Animation Blueprint for a Skeleton, this button will appear as a selectable editor type within the Animation Editor Modes (-> animation-editors-in-unreal-engine) region. Clicking here opens the Animation Blueprint. You can also click the **Options** dropdown menu next to this button to select a specific Blueprint if more than one Animation Blueprint uses this Skeleton. |

## Graph

The Graph panel is where you create the logic that controls your character during gameplay. There are three main types of graphs, each with different interfaces:

- The **Event Graph**, where you construct Blueprint-based logic to define node properties and variables which inform your other graph areas. [image: animation blueprint event graph]

- The **Anim Graph**, where you construct pose-based logic which evaluates the final pose of the Skeletal Mesh for the current frame. [image: animation blueprint anim graph]

- **State Machines**, where you construct state-based logic, typically used for locomotion. [image: animation blueprint state machine]

Visit the Graphing in Animation Blueprints (-> graphing-in-animation-blueprints-in-unreal-engine) and State Machines (-> state-machines-in-unreal-engine) pages for more information about the different graph types and graphing within Animation Blueprints.

## Anim Preview Editor

The Anim Preview Editor is where you can make changes to your variables (including Class Defaults), which will update the Skeletal Mesh in the viewport.

 [image: anim preview editor]

Clicking **Edit Preview** changes the behavior of this panel so that you are only making temporary edits to your variables. This can be useful if you only want to preview different variable states, without making destructive edits. When you make changes, a prompt will appear where you can choose to apply these changes to the default.

 [image: edit preview]

- animation

On this page

- Prerequisites (-> animation-blueprint-editor-in-unreal-engine)
- Toolbar (-> animation-blueprint-editor-in-unreal-engine)
- Graph (-> animation-blueprint-editor-in-unreal-engine)
- Anim Preview Editor (-> animation-blueprint-editor-in-unreal-engine)

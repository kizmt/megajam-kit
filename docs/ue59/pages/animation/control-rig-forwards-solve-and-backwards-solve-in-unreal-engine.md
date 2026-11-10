# Solve Directions

https://dev.epicgames.com/documentation/en-us/unreal-engine/control-rig-forwards-solve-and-backwards-solve-in-unreal-engine?application_version=5.9

> Learn about the different solve directions in Control Rig and the features they enable.

[image: Solve Directions]

Control Rigs are evaluated in several ways, called **solve directions**, which are created in the Control Rig Rig Graph. By using these tools to split the rig logic into multiple solve directions, or **solvers**, you can expand on the incoming data for a rig, which enables workflows such as rig sharing, baking animation back to your controls, and debugging this behavior.

This page provides an overview of the different solve directions available in Control Rig, how to use them, and the workflows these features enable.

#### Prerequisites

- You have an understanding of the Control Rig Editor (-> control-rig-editor-in-unreal-engine).
- You have an understanding of Sequencer (-> how-to-make-movies-in-unreal-engine), and know how to add Control Rig characters to Sequencer (-> how-to-create-control-rigs-in-unreal-engine).

## Forwards Solve

[image: forwards solve]

Forwards Solve is the solve direction used for driving your skeleton with controls, variables, and other rig elements. It is the primary solve direction for Control Rig, as it is used when animating your Control Rig within Sequencer and Animation Blueprints.

By default, all Control Rig assets will include the Forwards Solve node in the Rig Graph. From this node, the logic you will be creating will be based on affecting the skeleton's bones through controls, variables, and other rig elements. In this way, your controls are behaving in a "forward" manner, where controls affect bones.

[image: forward solve rig graph]

### Previewing Forwards Solve

Forwards Solve is the default preview mode within the Viewport (-> control-rig-editor-in-unreal-engine). This can be verified by ensuring the solve direction Toolbar (-> control-rig-editor-in-unreal-engine) button is set to **Forwards Solve**. Similar to AnimBP's, Forwards Solve will continuously execute regardless of your editor state within a level.

[image: forwards solve]

Depending on which solve direction is active, then this will affect which execution lines are highlighted in the rig graph. For example, if Forwards Solve is active, then the execution lines from Backwards Solve will appear more transparent.

[image: solve direction execution]

## Backwards Solve

[image: backwards solve]

Backwards Solve is the solve direction used for driving your controls from your skeleton. It is the **inverse **of Forwards Solve, and is used to bake animation from animation sequences onto a Control Rig in Sequencer.

In order to create Backwards Solve logic in your Rig Graph, you must create a **Backwards Solve** node. Right-click in the **Control Rig Graph** and select **Events > Backwards Solve**.

[image: create backwards solve]

From this node, the logic you will be creating will be based on affecting your controls from the bones in the skeleton. In this way, your controls are behaving in a "backward" manner, where bones affect controls.

[image: backwards solve]

### Previewing Backwards Solve

You can preview Backwards Solve behavior in the the Viewport (-> control-rig-editor-in-unreal-engine) by opening the solve direction **dropdown menu** in the Toolbar (-> control-rig-editor-in-unreal-engine), then clicking **Backwards Solve**. This will cause the viewport to execute Backwards Solve logic from the Rig Graph, rather than Forwards Solve.

[image: enable backwards solve]

To better preview this inverse Control Rig behavior, you can navigate to the **Preview Scene Settings** panel in Control Rig and specify an animation to play on your character. Set **Preview Controller** to **Use Specified Animation**, then select an animation from the **Animation **property. You should now see your controls match the playing animation.

[image: preview backwards solve]

When previewing Backwards Solve, the viewport will be outlined in a **yellow** border. This color and other colors can be changed in the **Control Rig Editor Preferences**.

[image: solve viewport color preference]

### Bake Animation to Control Rig

The main use of Backwards Solve is to bake animation sequences to your Control Rig, in order to make further changes to an animation in Unreal Engine.

To do this, assuming you have an animated character in Sequencer (-> how-to-add-cinematic-animation-to-a-character-in-unreal-engine), right-click on the character track, select **Bake To Control Rig**, then select your **Control Rig Asset** you want to bake to.

[image: bake to control rig]

If your Control Rig asset does not use the Backwards Solve node in the Rig Graph, then the Control Rig will not be selectable in the **Bake To Control Rig** menu.

A dialog window will appear where you can specify options related to the bake operation:

[image: bake options]

| Name | Description |
| --- | --- |
| **Export Transforms** | Bakes transform data to controls. |
| **Export Curves** | Bakes **AnimCurve** data to controls. This includes AnimCurves when evaluating the Backwards Solve logic. |
| **Record in World Space** | Bakes in absolute world space coordinates. |
| **Evaluate All Skeletal Mesh Components** | Evaluates all skeletal mesh components when baking. Typically you may want to enable this if you are using a Blueprint with other Skeletal Mesh Components. |
| **Warm Up Frames** | The number of frames to evaluate before the baking process occurs. This is useful if there are post process Animation Blueprint effects that require additional time to settle before evaluation. |
| **Delay Before Start** | The number of Display Rate frames to delay before the baking process occurs. This is useful if there are post process Animation Blueprint effects you need to run repeatedly before evaluation. |
| **Reduce Keys** | Enable this to run a Simplify (-> animation-curve-editor-in-unreal-engine) process after the baking process occurs, which removes redundant keyframes based on a tolerance amount. |
| **Tolerance** | The higher the **Tolerance** value, the more the filtered curve is allowed to deviate from the original, which causes more keyframes to be removed if **Reduce Keys** is enabled. |

Click **Create **to bake the animation sequence to Control Rig. Once completed, you should now see a Control Rig track with keyframes along the timeline. These keyframes should correspond to the overall animation that you have baked from.

[image: bake animation to control rig]

You can also import an animation sequence directly as Control Rig keyframes by right-clicking on the **Control Rig Section**, then selecting an animation from **Import Anim Sequence Into This Sequence**. The animation will import relative to the Sequencer Playhead.

## Construction Event

[image: setup event]

Similar to Blueprints, you can also create a **Construction Event**, which is used to execute preparation logic, such as initializing variables and setting initial positions on controls. It is executed once, at the post-initialization stage of the Control Rig.

In order to create Construction Event logic in your Rig Graph, you must create a **Construction Event** node. Right-click in the **Control Rig Graph** and select **Events > Construction Event**.

[image: create setup event]

From this node, the logic you will be creating will be based on affecting the initial state of your rig elements. This can include things like defining the initial offset of your controls to their respective bones, which enables Rig Sharing. Additionally, you can define initial values for variables, or change the initial positions of bones.

[image: setup event logic]

### Spawn Rig Elements

One of the other main purposes of the Construction Event is to spawn rig elements during this initialization phase. This makes it possible to create procedural Control Rigs by spawning new Controls, Bones, and Nulls (-> controls-bones-and-nulls-in-control-rig-in-unreal-engine), and initialize them using Rig Graph logic.

To create a spawn node, right-click in the Rig Graph and click one of the **Spawn** nodes from the **Dynamic Hierarchy** category. The following nodes can be added:

[image: spawn rig elements]

| Name | Description |
| --- | --- |
| **Spawn Bone** | Creates a new Bone (-> controls-bones-and-nulls-in-control-rig-in-unreal-engine) in the hierarchy. |
| **Spawn Null** | Creates a new Null (-> controls-bones-and-nulls-in-control-rig-in-unreal-engine) in the hierarchy. |
| **Spawn Animation Channel** | Creates a new **Animation Channel** in the hierarchy. Animation Channels are a type (-> controls-bones-and-nulls-in-control-rig-in-unreal-engine) of **Control** that is used to provide an animation channel or custom attribute. |
| **Spawn Control** | Creates a new Control (-> controls-bones-and-nulls-in-control-rig-in-unreal-engine) in the hierarchy. |

When spawning **Animation Channels** or **Controls**, you will need to specify their property type. Do this by right-clicking the **Initial Value** pin and selecting a type from the **Wildcard** dropdown menu.

[image: spawn control property type]

When connecting the Spawn node to the Construction Event, you should see the new element appear in the Hierarchy Panel, as well as in the Viewport as if it were created normally. All spawned element names are colored yellow to distinguish them from non-spawned elements.

[image: spawn control hierarchy]

Spawn nodes currently only function with the Construction Event.

You can also right-click any spawned element and click **Select Spawner Node**, which frames the node used to spawn this element. This makes it easy to locate spawn nodes in a complex graph.

[image: select spawner node]

Unlike non-spawned elements, initial values and settings for spawned elements are read-only, and must be defined on the node, instead of in the Details panel. You can do this by expanding the Initial Value and Settings pins and editing the properties. You can also connect properties and variables to these to drive them from other logic sources.

[image: spawn element properties]

There is a limit to the number of spawned elements you can create in a Control Rig, which can be reached if you are creating large rigs or using **For Loop** logic. By default this limit is set to **128**, and can be changed by enabling **Class Settings** and changing the **Procedural Element Limit** property.

[image: procedural element limit]

### Previewing Construction Event

You can preview Construction Event behavior in the Viewport (-> control-rig-editor-in-unreal-engine) by selecting the Solve Direction dropdown menu in the Toolbar (-> control-rig-editor-in-unreal-engine), then clicking **Construction Event**. This causes the viewport to execute Construction Event logic from the Rig Graph, rather than Forwards Solve. Entering into this mode is useful for debugging your construction logic.

[image: enable setup event]

When Construction Event is enabled, you can also edit the initial locations of bones and nulls from the viewport.

[image: edit initial rig location]

When previewing Construction Event, the viewport will be outlined in a **red** border.

## Backwards and Forwards

[image: backwards and forwards]

The Backwards and Forwards preview mode executes the Backwards Solve, then the Forwards Solve rig logic. This results in behavior that mimics the Bake Animation to Control Rig (-> control-rig-forwards-solve-and-backwards-solve-in-unreal-engine) process within the viewport. Typically you will enable this mode if you want to debug the baking process to ensure your bones and controls are operating correctly.

You can preview Backwards and Forwards behavior in the Viewport (-> control-rig-editor-in-unreal-engine) by selecting the Solve Direction dropdown menu in the Toolbar (-> control-rig-editor-in-unreal-engine), then clicking **Backwards and Forwards**. This will cause the viewport to execute both the Backwards and Forwards Solve logic sequentially from the Rig Graph.

[image: backwards and forwards]

When previewing Backwards and Forwards, the viewport will be outlined in a **blue **border.

- animation
- control rig
- sequencer
- rig graph
- solve direction

On this page

- Prerequisites (-> control-rig-forwards-solve-and-backwards-solve-in-unreal-engine)
- Forwards Solve (-> control-rig-forwards-solve-and-backwards-solve-in-unreal-engine)
- Previewing Forwards Solve (-> control-rig-forwards-solve-and-backwards-solve-in-unreal-engine)
- Backwards Solve (-> control-rig-forwards-solve-and-backwards-solve-in-unreal-engine)
- Previewing Backwards Solve (-> control-rig-forwards-solve-and-backwards-solve-in-unreal-engine)
- Bake Animation to Control Rig (-> control-rig-forwards-solve-and-backwards-solve-in-unreal-engine)
- Construction Event (-> control-rig-forwards-solve-and-backwards-solve-in-unreal-engine)
- Spawn Rig Elements (-> control-rig-forwards-solve-and-backwards-solve-in-unreal-engine)
- Previewing Construction Event (-> control-rig-forwards-solve-and-backwards-solve-in-unreal-engine)
- Backwards and Forwards (-> control-rig-forwards-solve-and-backwards-solve-in-unreal-engine)

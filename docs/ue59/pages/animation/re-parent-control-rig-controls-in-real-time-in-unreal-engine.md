# Space Switching

https://dev.epicgames.com/documentation/en-us/unreal-engine/re-parent-control-rig-controls-in-real-time-in-unreal-engine?application_version=5.9

> Dynamically re-parent your Controls when animating with Control Rig.

[image: Space Switching]

When animating, there may be cases where you want to change the transform space on Controls to suit different circumstances, such as hands contacting and moving with parts of the body or other objects. Depending on your rig complexity, this can be a difficult problem to solve as it requires you to create preset constraint systems within your Controls.

With **Control Rig Space Switching**, you can easily and dynamically re-parent your Controls to other rig elements in order to suit your animation needs. Spaces can be pre-defined within the **Control Rig Asset**, or created within **Sequencer**, providing you flexibility.

This document provides an overview of Space Switching within Sequencer and Control Rig.

#### Prerequisites

- You have created a **Control Rig Asset**. Refer to the Control Rig Quick Start (-> how-to-create-control-rigs-in-unreal-engine) page for information on how to do this.

- Space Switching when animating is accessed through the Animation Mode (-> animation-editor-mode-in-unreal-engine) panel, therefore you need to enable **Animation Mode**.

- Space Switching is mainly dependent on using Control Rig within **Sequencer**, therefore you need a basic knowledge (-> how-to-make-movies-in-unreal-engine) of Sequencer.

## Space Switching in Sequencer

Space Switching when animating a Control Rig is accessed through the **Animation **panel when Animation Mode (-> animation-editor-mode-in-unreal-engine) is enabled. Click **Spaces **within the panel to reveal the Space Switching interface.

 [image: animation spaces]

You can also press **Tab** when your cursor is on the **Viewport** to open a temporary **Spaces **menu.

 [image: tab spaces menu]

### Parent and World Space

By default there are two main spaces that can be applied to Controls: **Parent **and **World**.

For typical Controls, the default space will be set to **Parent**, which places the Control within the parent-space defined in the Control Rig outliner. For example, selecting the Neck Control will highlight the Parent space, denoting that it is the current transform space, which you can correlate to the hierarchy in the **Anim Outliner**.

 [image: parent transform space]

Clicking **World **will change the transform space of the selected control to be relative to absolute world coordinates. In effect, this dynamically un-parents any selected control from its hierarchy position in the Control Rig.

 [image: world transform space]

### Custom Spaces

Any Control, Bone, or Null (-> controls-bones-and-nulls-in-control-rig-in-unreal-engine) can also be used as a transform space, which makes space switching more versatile as you can dynamically re-parent Controls to other Controls.

 [image: custom transform space]

To add a custom space for your selected Controls, click **Add (+)** in the Spaces **header menu**, then select your **rig element**. This will add it to the spaces list as a selectable space.

 [image: add custom space]

Although you can select either Bones, Controls, or Nulls as a custom space, we recommend that you typically select **Controls **in order to avoid cyclical rig errors in the re-parenting.

### Keyframing Space Switching

One of the main benefits of spaces is being able to change spaces in your animation. This can be useful if characters are placing their hands on points of contact and then animating those points.

When you select different spaces, it will automatically create a **space Keyframe** for that control, as well as create compensating **Transform Keyframes** that maintain the visual position of that Control. Each space keyframe will also use a unique color on the track for the duration of that space.

 [image: keyframe transform space switch]

When Controls switch spaces, they occupy the local space of that new parent. Because of this, their local spatial coordinates become different from what they were before. In this way, space switching occurs over a single frame. This can be visualized by viewing the keyframes in the Curve Editor (-> animation-curve-editor-in-unreal-engine).

 [image: transform space switch curve editor]

You can preview the space switching functionality by moving the Playhead over the different space Keyframes and manipulating the parent Control. In this example when the head Control is the parent, then it will affect the hand IK Control, without needing to keyframe the hand.

 [image: keyframe transform space switch]

### Baking

Once you have finalized your animation with space switching, you can bake the final result of your keyframes. This is useful if you are wanting to stabilize the final animation back to the default parent space.

To bake your selected Controls, click **Bake…** in the Spaces menu, which will open the bake **dialog menu** with the following interface:

 [image: bake transform space switch]

- The transform space to bake to. Typically you will want to select **Parent** in order to restore the original space of the control, but you can also select or add any other space if you want to maintain a non-parent transform space.

- Bake settings, which include the following properties:

| Name | Description |
| --- | --- |
| **Start Frame** | The start frame in Sequencer to define the range of baking. |
| **End Frame** | The end frame in Sequencer to define the range of baking. |
| **Reduce Keys** | Enable this to run a Simplify (-> animation-curve-editor-in-unreal-engine) process after the baking process occurs, which removes redundant keyframes based on a tolerance amount. |
| **Tolerance** | The higher the **Tolerance** value, the more the filtered curve is allowed to deviate from the original, which causes more keyframes to be removed if **Reduce Keys** is enabled. |

### Settings and Preferences

You can change the space Keyframe colors that are used in Sequencer from the **Editor Preferences** window. To access these settings, select **Edit > Editor Preferences** from the Unreal Engine menu, then navigate to the **Curve Editor** section, and locate the following properties:

 [image: space keyframe color setting]

| Setting | Description |
| --- | --- |
| **Parent Space Custom Color** | The keyframe track color to use when the current space is set to **Parent**. |
| **World Space Custom Color** | The keyframe track color to use when the current space is set to **World**. |
| **Control Space Custom Colors** | A customizable array you can add custom Control names to and set explicit keyframe track colors to use for those Controls. |

## Space Switching in Control Rig Assets

Space Switching can also be pre-built within your Control Rig asset. This is useful if you are wanting to define common spaces on controls beforehand, alleviating the need to add them continuously in Sequencer. You can also create logic to control space switching through Control attributes.

### Pre-defining Custom Spaces

In your Control Rig asset, select a **Control**, navigate to the **Details** panel, and locate the **Available Spaces** property. With this array, you can pre-define other rig elements to use as a transform space.

 [image: available spaces]

Click the** Add (+)** button to add a new entry and specify the **Type** and the **Element** to use in the **drop-down menu**. As mentioned previously, although you can select either Bones, Controls, or Nulls as a custom space, we recommend that you typically select **Controls **in order to avoid cyclical rig errors in the re-parenting.

 [image: add available spaces]

Once an item is specified in the Available Spaces property, you can now see this custom space automatically listed as a switchable space for that Control.

 [image: transform space add]

### Dynamic Hierarchy Nodes

Space switching functionality can also be graphed within the Control Rig graph using the Dynamic Hierarchy nodes. Right-click within the **Control Rig graph** and locate the following nodes under **Dynamic Hierarchy**:

 [image: dynamic hierarchy nodes]

| Name | Image | Description |
| --- | --- | --- |
| **Add Parent** | [image: add parent] | Adds a second parent to a rig element. The weight of the new parent is initially 0, and you can use **Set Parent Weights** to set the weight. This node contains the following options: **Child**, where you define the item to receive the additional parent. **Parent**, where you define the new parent. |
| **Get Parent Weights** | [image: get parent weights] | Returns the current weight array of all parents of a given rig element. |
| **Set Parent Weights** | [image: set parent weights] | Sets the parent weight array of a given rig element. The number of weights must equal the number of parents of a rig element. |
| **Switch Parent** | [image: switch parent] | Switches a Rig Element to a new parent. This node contains the following options: **Mode**, where you can specify the Child to either switch to a new **Parent**, **World Space**, or back to its **Default Space**. **Child**, where you define the item to space switch. **Parent**, where you define the new parent element to switch to if Mode is set to **Parent Item**. Otherwise you can leave this pin unlinked. **Maintain Global**, which is used to define if local or world space should be maintained upon switching. |

### Preview Space Switching

Space switching is built upon a **Dynamic Hierarchy** system, which you can preview and debug from within a Control Rig asset. In this example, the Rig Hierarchy panel automatically updates as it accounts for a Control space switching to **World Space**.

 [image: dynamic hierarchy]

You can also temporarily test different spaces by either right-clicking on a selected **Control** in the viewport and selecting **Space Switching**, or by pressing **Tab**.

 [image: test space switching]

- animation
- control rig
- sequencer
- space

On this page

- Prerequisites (-> re-parent-control-rig-controls-in-real-time-in-unreal-engine)
- Space Switching in Sequencer (-> re-parent-control-rig-controls-in-real-time-in-unreal-engine)
- Parent and World Space (-> re-parent-control-rig-controls-in-real-time-in-unreal-engine)
- Custom Spaces (-> re-parent-control-rig-controls-in-real-time-in-unreal-engine)
- Keyframing Space Switching (-> re-parent-control-rig-controls-in-real-time-in-unreal-engine)
- Baking (-> re-parent-control-rig-controls-in-real-time-in-unreal-engine)
- Settings and Preferences (-> re-parent-control-rig-controls-in-real-time-in-unreal-engine)
- Space Switching in Control Rig Assets (-> re-parent-control-rig-controls-in-real-time-in-unreal-engine)
- Pre-defining Custom Spaces (-> re-parent-control-rig-controls-in-real-time-in-unreal-engine)
- Dynamic Hierarchy Nodes (-> re-parent-control-rig-controls-in-real-time-in-unreal-engine)
- Preview Space Switching (-> re-parent-control-rig-controls-in-real-time-in-unreal-engine)

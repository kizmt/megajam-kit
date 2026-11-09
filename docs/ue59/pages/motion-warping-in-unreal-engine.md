# Motion Warping

https://dev.epicgames.com/documentation/en-us/unreal-engine/motion-warping-in-unreal-engine?application_version=5.9

> An in depth look at Motion Warping for animations in Unreal Engine.

[image: Motion Warping]

**Motion Warping** is a feature where you can dynamically adjust a character's root motion to align to targets. This document will show you how to create the Motion Warping logic in your character blueprint, assign Motion Warping windows within animation montages, and link them to named positions.

#### Prerequisites

- You must enable the **Motion Warping** plugin. For more information regarding Plugins and how to Install them, see: Working With Plugins (-> working-with-plugins-in-unreal-engine).

 [image: motion warping plugin]

- Motion Warping utilizes Blueprint (-> blueprints-visual-scripting-in-unreal-engine) and Animation Montage (-> animation-montage-in-unreal-engine) workflows. Therefore you should have an understanding of these features.

- You have a Character Blueprint (-> setting-up-a-character-in-unreal-engine), Input Controls (-> input-in-unreal-engine), and Animations (-> animation-sequences-in-unreal-engine) in your project that you can create gameplay examples with.

## Motion Warping Overview

The overall feature for Motion Warping can be broken down into two main areas:

- **Animation Montage**, where you create motion warping windows with Anim Notify States.

 [image: animation montage overview]

- **Blueprint Logic**, where you set up the logic to assign the warp target and play the Montage.

 [image: blueprint overview]

## Animation Montage

Animation Montages are where you specify the Motion Warping areas, customize their behavior, and name them.

### Creation

To create a new Motion Warping region, right-click on one of the **Notifies **tracks and select **Add Notify State... > Motion Warping**.

 [image: create motion warp notify state]

These are customizable areas with start and end times that you can align to areas of the animation where warping is best applied.

For example, in this mantling montage, you likely need to ensure your starting warp region covers the area when the character places their hand on the obstacle.

 [image: motion warp sequence]

### Details

The **Anim Notify**'s **Details** panel contains properties and settings necessary for your Motion Warping to function. Select your motion warping section to reveal these details.

 [image: motion warp details panel]

| Detail Name | Description |
| --- | --- |
| **Root Motion Modifier** | The Motion Warping type to specify. **Scale**: A Motion Warp that alters an animation's scale in a uniform manner. **Skew Warp**: Warps the game object's root motion so that it matches the animation's location and rotation in the level at the end of the warping window. |
| **Warp Target Name** | The name used to find this warp target. Correlates to the **Add or Update Warp Target** Blueprint node. |
| **Warp Point Anim Provider** | Select which provider is desired for the **Warp Point**. **None**: No Warp Point Provider is declared here. **Static**: Warp Point defined by a user-defined parameter transform, which can be declared through the warping notify itself. **Bone**: Warp Point is defined by a Bone. |
| **Warp Point Anim Transform** | Transform the Animation Warp Point. Only relevant when the **Warp Point Anim Provider** is set to **Static**. |
| **Warp Point Anim Bone Name** | Declare the Bone Name with which to target as a Warp Point. Only relevant when the **Warp Point Anim Provider** is set to **Bone**. |
| **Warp Translation** | Whether to warp the translation component of the root motion. |
| **Ignore ZAxis** | Whether to warp the Z component of the translation. |
| **Warp Rotation** | Whether to warp the rotation component of the root motion. |
| **Rotation Type** | Whether the rotation should warp to match the warp target's rotation or face the warp target. **Default**: Character rotates to match the rotation of the warp target. **Facing**: Character rotates to face the warp target. |
| **Warp Rotation Time Multiplier** | Modifies how fast the rotation is warped. For example, if the Motion Warping window lasts for two seconds, and this property is 0.5, then the final rotation will be reached in one second. |
| **Notify Color** | Sets the color of the Motion Warping Notify keyframe. |

## Blueprint

Blueprints are used to add your Motion Warping component, trigger the warp to occur, and specify warp targets.

### Motion Warping Component

You must add a Motion Warping Component to your blueprint to enable Motion Warping behavior. To do this, click **(+) Add** in the **Components** panel and locate **Motion Warping** under the **Movement** category. Click it to add.

 [image: motion warping component]

The Component can now be referenced in your blueprint graph by dragging and dropping it from the Components panel to the **Event Graph**.

 [image: motion warping blueprint instance]

### Nodes

Dragging a link from the Motion Warping reference allows you to browse for functions and events related to it. These are located within the Motion Warping category.

 [image: new node from motion warp]

You can use the following Motion Warping nodes in your Blueprint:

| Node Name | Node Image | Description |
| --- | --- | --- |
| **Add or Update WarpTarget** | [image: add or update warp target node] | This node is used to link the Warp Target Name, which was defined in the Montage Asset, to a location. The **Warp Target** pin can be split into separate **Translation** and **Rotation** pins by right-clicking it and selecting **Split Struct Pin**. Conversely, you can use the **Remove Warp Target** node to unlink the **Warp Target Name**. |
| **Add Root Motion Modifier Skew Warp** | [image: add root motion modifier skep warp] | You can use this node to generate new Motion Warping Windows with Blueprints instead of adding **Skew Warp Anim Notifies** in the Montage Asset. Settings for this Motion Warping Window can also be assigned here, such as **Start Time** and **End Time** and **Warp Target Name**. Also available is an **Add Root Motion Modifier for Scale** node, as well as a node for disabling all Root Motion Modifiers. |

## Motion Warping Example

This section describes how you can set up a simple Motion Warping example of a character warping to a target to punch.

#### Warping Disabled

 [image: warp disabled]

Before starting, ensure the animation you intend to use has Root Motion enabled. Do this by opening the Animation Asset and enabling **EnableRootMotion**.

 [image: enable root motion window]

### Set up Target Location

The first step is to create and position a target for you to warp to. In this example, a Cylinder is used.

In the **Place Actors** panel, click **All Classes** and locate **Target Point**. Drag and drop it into your level to add a Target Point. Ensure it is aligned and rotated to your desired warp point.

 [image: add motion warp target]

### Set up the Animation Montage

Next, create an Animation Montage Asset. An easy way to create one that derives from an existing animation is to right-click on your Animation Asset and select **Create** > **Create AnimMontage**. After you have created the montage, open the asset.

 [image: create animation montage]

With your Montage now open, you can scrub through the sequence to preview your animation. The next step is to add a Motion Warping window under the Notifies track. Do this by right-clicking in the track area and selecting **Add Notify State…** > **Motion Warping**.

 [image: motion warp notify state]

A Motion Warping window is now created, with handles where you can set the start and end ranges.

Set the range of this Motion Warping Window so that it begins near the start of the animation, and ends at the moment the character strikes. You can also hold down the **Shift** key as you move your **Notify** keyframes to preview the current animation at that time.

 [image: motion warp notify]

Next, select the Motion Warping keyframe and navigate to the **Details **panel. Here you will set some properties for this keyframe.

- Set **Root Motion Modifier Config** to **Skew**** Warp**. This is done to specify the type of warp.

- Set a name for **Warp Target Name**. This is done to identify this warp with a name.

 [image: set details panel]

### Get Target Location

Now open your Character Blueprint Asset. In the Event Graph, create an **Input Action** node mapped to your desired input action. Do this by right-clicking in the graph and select your input event from **Input > Action Events**.

In this example there is an Input Action Event for Punch.

 [image: get input]

Next you will want to get the location of the Target Point you placed earlier in this example. There are a few ways you could choose to do this, but for this example create a **Get All Actors Of Class** node. Set the **Actor Class** to **Target Point**. Finally, hook the **Pressed **output pin from the Input Action node into the input execution pin for the Get All Actors of Class function.

 [image: get actor]

Finally, add a **Get **(a copy) node to connect to the Out Actors array data pin. Also add a **Get Actor Location** function and connect its input **Target data **pin to the **Get **node's output data pin.

 [image: get location]

### Warp Target

Now you create logic for getting your Target Point's location.

To start, add a Motion Warping Component to your Character Blueprint. Do this by clicking **(+) Add **in the Components panel and locate Motion Warping under the Movement category. Click it to add the component.

 [image: add motion warping component]

Next, drag and drop the Motion Warping component from the Components panel to the Event Graph.

 [image: motion warping instance]

Drag off from the Motion Warping reference pin to add an **Add or Update Warp Target from Transform** node. Once created, connect its input event pin with the **Get All Actors Of Class** node. Also, ensure you assign a Warp Target Name to the **Name** pin. This name must match the Warp Target Name you defined earlier in the Montage.

 [image: sync point logic]

You also need to link the **Add or Update Warp Target from Transform** node to the Target location. Right-click on the Warp Target pin and select **Split Struct Pin** to convert this into a dual Location/Rotation pin structure. Then connect the **Get Actor Location**'s **Return Value** pin to the **Get Actor Location**'s Return Value pin.

When connecting the **Return Value** of the Get Actor Location node, (a vector value, indicated by a yellow pin) and the Add or Update Warp Target from Transform node's Target Transform pin, (a transform value, indicated by an orange pin) a conversion node is created. In instances where different value types are present, but are compatible through a conversion, Unreal Engine automatically creates a conversion node when connecting the pins.

 [image: sync point location]

### Play Montage

Now you can reference your **Skeletal Mesh** Component in the Event Graph, and play the Montage on it. Drag and drop the **Skeletal Mesh **Component into your event graph.

Right-click in the graph and select **Animation > Montage > Play Montage** to add a **Play Montage** node. Then assign your Montage Asset to the **Montage to Play** pin.

 [image: play montage]

### Results

When you play your level now, you should be able to see your character warp to the appropriate point as they play their punch animation.

 [image: motion warping enabled]

Below you can see a full image of the Character Blueprint logic used for this page's implementation of Motion Warping to a simple warp target location.

 [image: blueprint overview]

- animation
- sequencer

On this page

- Prerequisites (-> motion-warping-in-unreal-engine)
- Motion Warping Overview (-> motion-warping-in-unreal-engine)
- Animation Montage (-> motion-warping-in-unreal-engine)
- Creation (-> motion-warping-in-unreal-engine)
- Details (-> motion-warping-in-unreal-engine)
- Blueprint (-> motion-warping-in-unreal-engine)
- Motion Warping Component (-> motion-warping-in-unreal-engine)
- Nodes (-> motion-warping-in-unreal-engine)
- Motion Warping Example (-> motion-warping-in-unreal-engine)
- Warping Disabled (-> motion-warping-in-unreal-engine)
- Set up Target Location (-> motion-warping-in-unreal-engine)
- Set up the Animation Montage (-> motion-warping-in-unreal-engine)
- Get Target Location (-> motion-warping-in-unreal-engine)
- Warp Target (-> motion-warping-in-unreal-engine)
- Play Montage (-> motion-warping-in-unreal-engine)
- Results (-> motion-warping-in-unreal-engine)

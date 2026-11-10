# Control Rig Quick Start

https://dev.epicgames.com/documentation/en-us/unreal-engine/how-to-create-control-rigs-in-unreal-engine?application_version=5.9

> Learn the basic fundamentals of Control Rig in Unreal Engine.

[image: Control Rig Quick Start]

This page provides an overview of Control Rig, and shows how to create and animate rigs in Unreal Engine.

## What is a Control Rig?

Control Rig is Unreal Engine's solution to animating characters directly in the engine.

The **Control Rig Editor** is where you can create custom controls, channels, and other manipulators for your characters. After a rig is created, you can animate these controls within other areas of Unreal Engine, such as **Sequencer**.

[image: control rig editor overview]

Control Rigs require the creation of **Control Rig Assets**, which are created and stored in the **Content Browser**.

[image: Control-rig-asset-content-browser]

## How do I Create and Open a Control Rig?

The main way to create a new Control Rig asset is to right-click on a **Skeletal Mesh** in the Content Browser and select **Create > Control Rig**. This creates a Control Rig asset in the same directory with the postfix "_CtrlRig".

[image: create control rig]

Next, double-click on the Control Rig asset to open the **Control Rig Editor**.

[image: open control rig]

## How do I Rig and Animate with Control Rig?

One of the simplest control types you can create is an **FK Control**. This guide gives an overview of how to create this control and animate it in **Sequencer**.

### Create Control

In the Control Rig Editor, select the **Rig Hierarchy** tab to view the skeleton hierarchy for your character. Navigate to the bone you want to animate, right-click it, and select **New Element > New Control**.

[image: Create-new-control]

This creates a control at the same location and orientation of the bone. The control is also named the same as the bone with the postfix "_ctrl".

[image: create new control]

Although you can keep the control nested within the skeleton hierarchy, it is best practice to remove it from the hierarchy and build your own control rig hierarchy adjacent to the skeleton. Select the control and press **Shift+P** to unparent the control from the skeleton.

[image: unparent control]

### Edit Control Shape

In order to better see and select the control in the viewport, you can change the **Control Shape**. To do this, navigate to the **Details **panel and locate the **Shape** property category. Here you can set a new shape using the **Shape Properties**, as well as customize the scale and offset of it using the **Shape** **Transform **properties.

For this example, the shape is set to **Circle_Thick**, Rotation Y is set to **90**, and all Scale axes are set to **3.0**.

[image: change control shape]

### Drive Bone with Control

Next, reference your control and bone in the **Rig Graph**. Do this by dragging the control from the **Rig Hierarchy** panel into the graph, then select **Get Control**.

[image: get control graph]

Do the same for the bone you want this control to affect. Drag the bone from the **Rig Hierarchy** panel into the graph, then select **Set Bone**.

[image: set bone graph]

Connect the **Transform **output data pin from the **Get Transform - Control** node to the **Value**** **input data pin of the **Set Transform - Bone** node, then connect the **Execute **output pin from the** Forwards Solve** node to the input execution pin of the **Set Transform - Bone** node.

[image: set bone transform control]

You can now manipulate the control in the viewport and see the control driving the bone.

[image: test control]

Clicking **Compile **resets the control position back to default.

### Animate Control in Sequencer

Now that your control is appropriately manipulating a character's bone, you can start to animate it in **Sequencer**.

[image: Animate-control-in-sequencer]

Drag the **Control Rig Asset** from the **Content Browser** into the Level viewport. Once this is done, Sequencer opens with the character added to it as a **Track (-> sequencer-track-list-in-unreal-engine)**.

Expand the **Control Rig** track to locate the controls you created. You can either select them here, or in the viewport.

[image: control rig in sequencer]

With the control selected in the Viewport, press the **S** key to create a transform **Keyframe **for the selected control at the Playhead (-> sequencer-cinematic-editor-unreal-engine). Afterward, drag the **Playhead **to a different location in the sequence, manipulate your control, then press **S** again to set a second **Keyframe**.

Now when playing or scrubbing the sequence, you should see your control and character animate between the two keyframes.

[image: keyframe control rig]

- control rig
- controls
- ring

On this page

- What is a Control Rig? (-> how-to-create-control-rigs-in-unreal-engine)
- How do I Create and Open a Control Rig? (-> how-to-create-control-rigs-in-unreal-engine)
- How do I Rig and Animate with Control Rig? (-> how-to-create-control-rigs-in-unreal-engine)
- Create Control (-> how-to-create-control-rigs-in-unreal-engine)
- Edit Control Shape (-> how-to-create-control-rigs-in-unreal-engine)
- Drive Bone with Control (-> how-to-create-control-rigs-in-unreal-engine)
- Animate Control in Sequencer (-> how-to-create-control-rigs-in-unreal-engine)

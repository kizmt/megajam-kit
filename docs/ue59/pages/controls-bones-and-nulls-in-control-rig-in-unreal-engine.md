# Controls, Bones, and Nulls

https://dev.epicgames.com/documentation/en-us/unreal-engine/controls-bones-and-nulls-in-control-rig-in-unreal-engine?application_version=5.9

> Learn about the primary Rig Elements you can use for constructing Control Rigs.

[image: Controls, Bones, and Nulls]

The primary rig elements used when creating robust rigs in Control Rig are **Controls**, **Bones**, and **Nulls**. Each of these elements have wide-ranging applications and can be used together to create complete rigs.

This document provides an overview of Controls, Bones, and Nulls, and provides simple workflow examples for using them.

#### Prerequisites

- You have created and opened a Control Rig (-> rigging-with-control-rig-in-unreal-engine) for a skeletal mesh.

## Elements Overview

Controls, Bones, and Nulls are created by right-clicking in the **Rig Hierarchy** panel and selecting one of the options from the **New **menu.

 [image: new bone new control new null]

By default, creating one of these elements will locate it at the origin (0,0,0) of the viewport. If you have an element selected in the Rig Hierarchy panel, it will instead create it at the location of, and parented to, that selected element. This makes it easy to align your elements with each other, using this selection context.

 [image: create control]

### Organization

Elements can be renamed by right-clicking them in the **Rig Hierarchy** and selecting **Rename **or by pressing **F2**.

 [image: rename control]

Elements can be re-organized by dragging them in the **Rig Hierarchy**.

- Dragging an element onto another element parents it to that element.

- Dragging an element to an empty region unparents it.

- Pressing **Shift+P** also unparents selected elements.

 [image: control drag drop reparent]

## Controls

**Controls **are the main elements used for your Control Rig interaction. They are used to drive your Bone chains, animate in **Sequencer**, and provide additional custom attributes. You can also customize your Controls to have different shapes and colors (-> control-shapes-and-control-shape-library-in-unreal-engine), property types, and transform limits.

### Creation Context

When creating Controls relative to a Bone, the Control will automatically inherit the same name as that Bone and apply `_ctrl` as a suffix.

 [image: create control]

#### Creating Multiple Controls

In addition to the normal creation method, you can also create Controls when multiple Bones are selected using a provided Python script (-> control-rig-python-scripting-in-unreal-engine). In the Rig Hierarchy (-> control-rig-editor-in-unreal-engine), select multiple Bones, then right-click on them and select **New > Add Controls For Selected**. This will create Controls for all selected Bones, matching their names with the suffix `_ctrl`, and matching the hierarchy structure.

 [image: add controls for selected]

You can customize this creation method by holding **Alt **and clicking **New > Add Controls For Selected**. This will open a dialog window where you can customize the following settings:

 [image: add controls for selected options]

| Name | Description |
| --- | --- |
| **Output Format** | How to organize the controls once created. You can select the following options: **Hierarchy**: Copies the same hierarchy as the selected Bones, with the top-most control unparented from the Bone hierarchy. **List**: Unparents all created Controls so they appear at the root of the Rig Hierarchy as a flat list. **Child**: Parents all created Controls underneath the associated Bone. |
| **Suffix** | The text to apply after the Control name, which is copied from the Bone name. |
| **Prefix** | The text to apply before the Control name, which is copied from the Bone name. |

### Control and Value Types

There are a variety of Control types that you can specify for Controls which provide alternative or more limited properties for it. This can be useful if you are wanting to create attribute-based Controls, Proxy Controls, or feedback Controls.

You can specify the type of the Control by clicking the **Animation Type** drop-down menu for a selected Control in the Details panel. The following Control types can be chosen:

 [image: control type]

| Control Type | Description |
| --- | --- |
| **Animation Control** | The default Control type, which provides a normal visible animatable Control. |
| **Animation Channel** | A type of Control that is used to provide an animation channel or custom attribute. If **Group Channels** is enabled, this attribute will be accessible on the parent Control, where it can be animated together with other attributes. |
| **Proxy Control** | Proxy Controls are a type of Control which can be linked to other Controls in a **Driver / Driven** relationship. This is done by adding the Controls you want to drive in the **Driven Controls** array. Proxy Controls cannot be animated directly, however you can use them to drive other Controls in a consolidated manner using **Get Driven** and **Set Driven** nodes. |
| **Visual Cue** |  |

In addition to the Animation Type, you can also adjust the **Value Type**, which sets the output data of a Control. From the **Value Type** dropdown menu, you can set the following types:

| Name | Description |
| --- | --- |
| **Bool** | Makes the Control become a **bool-type**, where you can set **True / False** states in animation. Bool-type Controls are not visible in the **Viewport**. [image: control type bool] |
| **Float** | Makes the Control become a **float-type**, where you can animate the Control along a single position axis. If **Animation Type** is set to **Animation Control**, then you can specify which axis by selecting an axis from the **Primary Axis** property. The range you can move the Control when using this type is limited by default (-> controls-bones-and-nulls-in-control-rig-in-unreal-engine) between **0 - 100**. Floats can be useful if you are wanting to create a slider Control. [image: control type float] |
| **Integer** | Makes the Control become an **integer-type**, where you can animate the Control along a single position axis, incrementing by one. If **Animation Type** is set to **Animation Control**, then you can specify which axis by selecting an axis from the **Primary Axis** property. The range you can move the Control when using this type is limited by default (-> controls-bones-and-nulls-in-control-rig-in-unreal-engine) between **0 - 100**. You can also convert this Control Type to an Enum by referencing an **Enumeration** in the **Control Enum** property. [image: control type integer enum] |
| **Vector 2D** | Makes the Control become a **vector 2d-type**, where you can animate the Control along two position axes. If **Animation Type** is set to **Animation Control**, then the axis specified in **Primary Axis** will not be used, with the remaining axes being the ones providing the 2D plane. The range you can move the Control on both axes when using this type are limited by default (-> controls-bones-and-nulls-in-control-rig-in-unreal-engine) to between **0 - 100**. [image: control type vector 2d] |
| **Position** | Makes the Control become a **position-type**, where you can only animate the Control's location. [image: control type position] |
| **Scale** | Makes the Control become a **scale-type**, where you can only animate the Control's scale. [image: control type scale] |
| **Rotator** | Makes the Control become a **rotator-type**, where you can only animate the Control's rotation. [image: control type rotator] |
| **Euler Transform** | Makes the Control become a **transform-type**, where you can freely manipulate the Control on all translation, rotation, and scale axes. This is the default type. [image: control type euler transform] |

For spatial Controls, such as **Euler Transform**, **Rotator**, **Scale**, and **Position**, there are additional transform-related features available to you in the details panel when viewing the **Transform **properties:

 [image: control transform buttons]

- The **Rotation** drop-down menu is where you can select different rotation interpolation modes, such as **Euler**, **Quaternion**, or **Axis and Angle**.

- **Local /World Space** buttons will swap the axis information displayed between local and world space. Shift-clicking will change all three axes.

- Locks **Scale**, which will cause scaling to occur uniformly in each direction when changing scale.

### Transform Limits

Spatial Controls can have limits placed on them so that they only can animate within a certain range. This can be useful if you are wanting to create slider or 2D-based controls and limit their movement range.

Limits are set on Controls by defining their minimum and maximum property ranges. You can locate these properties for a selected Control by clicking **Min **or **Max **under the **Transform** category in the **Details** panel.

 [image: control limits min max]

Enable any axis channel to enable limits for that value, and define the number within the region next to it. In this example a Minimum limit of -**50** and Maximum limit of **50** is set. Manipulating your Control will now keep its movement restricted to those limits.

 [image: control limits min max]

Enable **Draw Limits** to visualize the limits of all Controls in the Viewport.

 [image: draw limits]

## Bones

Separate from normal Bones that are included in your skeleton, new Bones can also be created in Control Rig. These Bones can be used in an auxiliary manner to provide extra Bones for specific rigging behavior, such as making ending effectors in an IK-chain, or making "dummy" Bones in order to control "real" Bones in a consolidated manner.

Bones created in the Control Rig editor have their hierarchy icons displayed hollow to differentiate them from normal Skeletal Mesh Bones.

After creating a new Bone, you can move it in the viewport by entering into the **Setup Event** mode, which enables the ability to edit the **Initial Pose** of an element in the viewport. In the toolbar, click the Solve Direction (-> control-rig-forwards-solve-and-backwards-solve-in-unreal-engine) drop-down menu and select **Setup Event**.

 [image: setup event]

Once **Setup Event** is enabled, you can move your Bone in the viewport.

 [image: setup event bone manipulation]

By default, only selected Bones are displayed in the viewport. You can change this view mode by clicking **Character > Bones** in the viewport toolbar, then select your desired Bone drawing setting.

 [image: bone display]

### Workflow Example

In this example, a Bone created in Control Rig is being used as an end effector for a finger IK chain.

 [image: bone control example]

## Nulls

**Nulls **are container elements used to collect, group, and transform other rig elements together in arbitrary ways. In a typical humanoid control rig setup, they can be used as a way to group your symmetrical controls, such as legs and arms, in order to mirror these controls. In this way, Nulls are a similar concept to **Groups **from Autodesk Maya, and are meant to be used for rigging organization.

 [image: new null]

By default, Nulls are not visible in the viewport. To view nulls, you can enable **Display Nulls** from the Viewport toolbar.

 [image: display nulls]

Similar to Bones, Nulls can be edited by enabling **Setup Event** from the Solve Direction (-> control-rig-forwards-solve-and-backwards-solve-in-unreal-engine) dropdown menu. Once **Setup Event** is enabled, you can move your Null in the viewport.

 [image: setup event null move]

Enabling **Setup Event** will also enable visibility on all Nulls in the Viewport.

### Workflow Example

In this example, Nulls are being used to group several controls together along symmetrical and limb lines. This grouping can now facilitate easier organization, mirroring, and other rigging operations.

 [image: null group symmetrical controls]

## Transform Types

The position, rotation, and scale of rig elements are determined from multiple transform sources, which are named **Initial**, **Current**, and **Offset**. These transform types each perform transformations on rig elements at different phases of the Control Rig execution. You can view these different types from any selected rig element's details.

 [image: initial current offset transform]

When a different Control type (-> controls-bones-and-nulls-in-control-rig-in-unreal-engine) is specified for a Control, you can only specify **Initial** and **Current Values**.

 [image: initial current value]

Holding **Shift **and clicking the different types will display them alongside each other in the Details panel.

 [image: multiple type display]

### Initial

**Initial **is the starting value of the element before control rig logic from the rig graph executes. It also specifies the default value of a rig element within its range of operation, and will affect the default value of **Current**.

You can edit the Initial value by either editing it from the Details panel, or by enabling Setup Event (-> control-rig-forwards-solve-and-backwards-solve-in-unreal-engine) and manipulating the element in the Viewport, if it has a Transform.

 [image: initial transform]

### Current

**Current **is the value of the element when operating in the **Forwards Solve** mode. It is meant to be the real-time actual transform of your Control, and manipulating Controls in the viewport will edit the Current pose. Within the Control rig editor, the Current pose is temporary and can be reset by recompiling or reopening the asset.

 [image: current transform]

When animating a Control Rig within Sequencer, you are animating the Current value.

### Offset Transform

**Offset **only appears for Controls with **Control Type** set to **Euler Transform**. It is used to spatially offset controls without changing the Initial or Current values, and provides the ability to change a Control's "zero position". In other rigging tools such as Autodesk Maya, Offset is analogous to **Freeze Transformations**, or **Transform Offset Parent Matrix**.

 [image: offset transform]

If you are outputting Transform values from a Control with an offset specified, the resulting transform will combine both **Offset **and **Current **for its final calculated transform. You can change this by setting the **Space **property to **Local Space**, which will then only output **Current**.

 [image: transform pin]

- animation
- control rig
- sequencer
- bone
- null

On this page

- Prerequisites (-> controls-bones-and-nulls-in-control-rig-in-unreal-engine)
- Elements Overview (-> controls-bones-and-nulls-in-control-rig-in-unreal-engine)
- Organization (-> controls-bones-and-nulls-in-control-rig-in-unreal-engine)
- Controls (-> controls-bones-and-nulls-in-control-rig-in-unreal-engine)
- Creation Context (-> controls-bones-and-nulls-in-control-rig-in-unreal-engine)
- Creating Multiple Controls (-> controls-bones-and-nulls-in-control-rig-in-unreal-engine)
- Control and Value Types (-> controls-bones-and-nulls-in-control-rig-in-unreal-engine)
- Transform Limits (-> controls-bones-and-nulls-in-control-rig-in-unreal-engine)
- Bones (-> controls-bones-and-nulls-in-control-rig-in-unreal-engine)
- Workflow Example (-> controls-bones-and-nulls-in-control-rig-in-unreal-engine)
- Nulls (-> controls-bones-and-nulls-in-control-rig-in-unreal-engine)
- Workflow Example (-> controls-bones-and-nulls-in-control-rig-in-unreal-engine)
- Transform Types (-> controls-bones-and-nulls-in-control-rig-in-unreal-engine)
- Initial (-> controls-bones-and-nulls-in-control-rig-in-unreal-engine)
- Current (-> controls-bones-and-nulls-in-control-rig-in-unreal-engine)
- Offset Transform (-> controls-bones-and-nulls-in-control-rig-in-unreal-engine)

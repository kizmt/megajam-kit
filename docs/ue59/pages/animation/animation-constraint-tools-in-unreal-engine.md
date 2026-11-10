# Constraints

https://dev.epicgames.com/documentation/en-us/unreal-engine/animation-constraint-tools-in-unreal-engine?application_version=5.9

> Attach the position, orientation, or scale of an object to other objects using a variety of constraints.

[image: Constraints]

When animating, there may be cases where you need to attach elements together without causing a change in the Outliner or Control hierarchy. This kind of attachment is known as **constraining**. Constraints in Unreal Engine are broken up into different methods: **Position**, **Rotation**, **Scale**, **Parent**, and **LookAt**. With these methods, you can set options to control how these constraints operate, such as controlling the attachment offset and baking the constraint back to normal keyframes.

This document provides an overview of constraining in Sequencer, and the different workflows for each constraint method.

#### Prerequisites

- You have created a **Control Rig Asset**. Refer to the Control Rig Quick Start (-> how-to-create-control-rigs-in-unreal-engine) page for information on how to do this.

- Constraints when animating are accessed through the Animation Mode (-> animation-editor-mode-in-unreal-engine) panel, therefore you need to enable **Animation Mode**.

- Constraining is mainly dependent on using Control Rig within **Sequencer**, therefore you need a basic knowledge (-> how-to-make-movies-in-unreal-engine) of Sequencer.

## Create a Constraint

Constraint information, as well as the workflow for adding constraints, is located in the Animation panel when Animation Mode (-> animation-editor-mode-in-unreal-engine) is enabled.

 [image: constraint section in animation panel]

Constraints are established by creating a **Parent - Child** relationship between two or more objects. To create a new constraint, first select your Controls you want to constrain (child), then click **Add Constraint (+)** and select a constraint type. Your cursor changes to an eyedropper tool you can use to select the object to constrain to (parent) in the Viewport.

 [image: create constraint]

Constraining is not limited to Control Rig elements, you can constrain any object or Actor. Additionally, Actors can be constrained without needing Sequencer to be open.

After creating your constraint, you can view its keyframe information in Sequencer for the constrained Control. Most constraints will also create compensating keyframes, which maintains the current visual position of the child when the constraint activates. These compensating keyframes are linked to the constraint keyframe, and follow it if you change the timing.

 [image: constraint keyframe]

## Constraint Usage

Your constraints can also be viewed in the Animation Panel's **Constraints **section, when selecting the constrained Control. Here you can create new constraint keyframes, edit the properties of the constraint, and bake the constraint back to normal keyframes.

 [image: constraint select]

If you have more than one constraint applied to an object, they also appear here too. When you play or scrub the sequence, each constraint indicates its status by highlighting when it becomes active or inactive.

 [image: constraint switching]

The buttons for a constraint entry provide the following functionality:

| Button | Description |
| --- | --- |
|  | Creates an active keyframe for the constraint at your current time in Sequencer. If the constraint is already active, then a deactivate keyframe is created instead. Compensating keyframes are also created to maintain the same world position on the constrained object |
|  | If you have multiple constraints on the same object, these buttons move the constraint up or down on the list. Constraints in Unreal Engine are hierarchical and override other constraints higher on the list (only if the constraints animate the same channels). New constraints always take priority over older ones and are placed lower on the list. Because constraints can be overridden, it is not always necessary to deactivate other constraints. For example, since Parent Constraints (-> animation-constraint-tools-in-unreal-engine) animate all transform channels of a control, simply activating one is enough to essentially deactivate all others, so long as the one activated is higher priority. In this example, although both constraints are active, only the **root** constraint is providing the constraint effect due to it being lower in the list and higher priority |
|  | Removes this constraint. |

Right-clicking on a constraint entry reveals a context menu where you can edit properties specific to that constraint type, bake (-> animation-constraint-tools-in-unreal-engine) the constraint, and set compensating keyframes (-> animation-constraint-tools-in-unreal-engine).

 [image: constraint properties]

### Bake Constraint

Once you have finalized animating with constraints, you can bake the final result to keyframes. This can be useful if you want to revert to normal keyframe animation to make further edits without constraint considerations.

To bake your selected Controls, right-click a constraint entry and select **Bake**.

 [image: bake constraint]

### Compensate Keyframes

When animating, there may be cases where the constraint exhibits a noticeable pop when it activates or deactivates. This commonly happens if you adjust the pose of the parent after the constraint has been created, which breaks the visual matching that the original compensating keyframes were providing.

 [image: constraint pop]

To resolve this, select the offending Controls, right-click the constraint, and select **Compensate Key**. You must also ensure that the Sequencer **Playhead **is on the same time as the constraint keyframe that you want to fix. This will re-create new compensating keyframes for the new location of the parent object.

 [image: fix constraint pop]

While **Compensate Keys** can be used to resolve errors with single constraints, **Compensate All Keys** can also be used to re-create all compensating keyframes for every constrained Control in the sequence, regardless of selection or Playhead position.

### Dynamic Offset

By default, you can keyframe the constrained object in addition to the constraint affecting it. If you want to disable this option and not allow the child object to animate, right-click the constraint and disable **Dynamic Offset**. This locks the position of the constrained object at its current transform, and it will now only move if the parent object moves.

 [image: dynamic offset]

### Constraints Manager

As you constrain many objects in your Level Sequence, it may become more difficult to manage and view your constraints. You can use the **Constraints Manager Actor** as a way to view and manage all constraints within a Level.

When you create any constraint for the first time, the **Constraints Manager Actor** automatically creates within your level, and selecting it consolidates all used constraints into a single list. This makes it easier to view and manage large numbers of constraints on several objects at the same time.

 [image: constraints manager]

## Constraint Types

The following constraint types can be created when clicking **Add Constraint (+)**:

 [image: constraint types]

- Translation Constraint (-> animation-constraint-tools-in-unreal-engine)

- Rotation Constraint (-> animation-constraint-tools-in-unreal-engine)

- Scale Constraint (-> animation-constraint-tools-in-unreal-engine)

- Parent Constraint (-> animation-constraint-tools-in-unreal-engine)

- LookAt Constraint (-> animation-constraint-tools-in-unreal-engine)

### Translation Constraint

**Translation Constraints** constrain an object along translation axes only. It follows the parent position but not its rotation or scale.

 [image: translation constraint]

If **Maintain Offset** is disabled from the constraint context menu, then the constrained object follows the parent object position in absolute coordinates, instead of relative to when the constraint was made.

 [image: translation constraint maintain offset]

### Rotation Constraint

**Rotation Constraints** constrain an object along rotation axes only. It follows the parent rotation but not its translation or scale.

 [image: rotation constraint]

If **Maintain Offset** is disabled from the constraint context menu, then the constrained object follows the parent object rotation in absolute coordinates, instead of relative to when the constraint was made.

 [image: rotation constraint maintain offset]

### Scale Constraint

**Scale Constraints** constrain an object along scale axes only. It follows the parent scale but not its translation or rotation.

 [image: scale constraint]

If **Maintain Offset** is disabled from the constraint context menu, then the constrained object follows the parent object scale in absolute coordinates, instead of relative to when the constraint was made.

 [image: scale constraint maintain offset]

### Parent Constraint

**Parent Constraints** constrain an object along all axes and channels to a parent as if it were attached hierarchically.

 [image: parent constraint]

By default, scale is not included in a Parent Constraint. To include it, right-click on the constraint entry and enable **Scaling**.

 [image: enable scale in parent constraint]

Similar to the other constraint types, disabling **Maintain Offset** causes the constrained object to follow the parent transform in absolute coordinates, instead of relative to when the constraint was made.

### LookAt Constraint

**LookAt Constraints** constrain an object along rotation axes only by aiming at the parent location.

 [image: aim constraint]

You can set the aim direction for the child object by right-clicking the constraint entry and editing the **Axis **properties.

 [image: aim axis]

Unlike other aim-type attachments, the LookAt Constraint does not use up vectors. Instead, you can animate the **roll **axis to manually control how you want the roll to behave. This can also be useful to eliminate rotation flipping problems, which are common in other aim-type attachments.

 [image: aim constraint roll no flip]

- animation
- control rig
- sequencer
- constraint

On this page

- Prerequisites (-> animation-constraint-tools-in-unreal-engine)
- Create a Constraint (-> animation-constraint-tools-in-unreal-engine)
- Constraint Usage (-> animation-constraint-tools-in-unreal-engine)
- Bake Constraint (-> animation-constraint-tools-in-unreal-engine)
- Compensate Keyframes (-> animation-constraint-tools-in-unreal-engine)
- Dynamic Offset (-> animation-constraint-tools-in-unreal-engine)
- Constraints Manager (-> animation-constraint-tools-in-unreal-engine)
- Constraint Types (-> animation-constraint-tools-in-unreal-engine)
- Translation Constraint (-> animation-constraint-tools-in-unreal-engine)
- Rotation Constraint (-> animation-constraint-tools-in-unreal-engine)
- Scale Constraint (-> animation-constraint-tools-in-unreal-engine)
- Parent Constraint (-> animation-constraint-tools-in-unreal-engine)
- LookAt Constraint (-> animation-constraint-tools-in-unreal-engine)

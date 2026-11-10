# Skeletal Mesh Sockets

https://dev.epicgames.com/documentation/en-us/unreal-engine/skeletal-mesh-sockets-in-unreal-engine?application_version=5.9

> Create attachment points within your Skeletal Mesh using Sockets.

[image: Skeletal Mesh Sockets]

When attaching objects to Bones on your Skeletal Mesh, it may be necessary to offset this attachment. Instead of using math operations to estimate the offset transform, you can create **Sockets**. Sockets are dedicated attach points within the hierarchy of your Skeleton, which can be transformed relative to the Bone it is parented to. Once set up, you can attach your objects, weapons, and other actors to the Socket.

This document provides an overview of how to create and use Sockets.

#### Prerequisites

- Your project has a Skeletal Mesh (-> skeletal-mesh-assets-in-unreal-engine).

## Creating Sockets

Sockets are created from the **Skeleton Tree**, which can be accessed from any of the main Animation Editors (-> animation-editors-in-unreal-engine). Right-click on a Bone in the **Skeleton Tree** and select **Add Socket.**

 [image: add socket]

Your new Socket will now be displayed in the Skeleton Tree, parented to the Bone that you selected previously.

 [image: new socket]

Sockets can be deleted by right-clicking on them and selecting **Delete **or by pressing **Delete **on your keyboard.

 [image: delete socket]

By default, when creating and manipulating Sockets, this will edit the Skeleton Asset (-> skeletons-in-unreal-engine) of your Skeletal Mesh. Therefore, you must save it when making Socket changes.

## Managing and Editing Sockets

Once you have created a Socket, you can interact with them in the following ways.

### Socket Visibility

By default, Sockets are not visible in the Animation Editor Viewport (-> animation-editors-in-unreal-engine), you can make them visible by navigating in the Viewport menu to **Character > Bones**, and enabling **Sockets**.

 [image: show sockets in viewport]

### Selection and Movement

Sockets can be selected by either clicking them in the Skeleton Tree, or if made visible in the viewport, by clicking them in the Viewport. You can then move them by dragging on the transform manipulator in the Viewport. Sockets can be translated, rotated, and scaled.

 [image: select and move socket]

### Copy and Paste

Sockets can be copied and pasted in different ways depending on your requirements.

To copy a Socket, right-click on it in the Skeleton Tree and select **Copy Selected Sockets**, or press **Ctrl+C**.

 [image: copy selected sockets]

Next, you can choose to either:

- Paste the Socket to the same bone, which is done by right-clicking on any Bone in the Skeleton Tree and selecting **Paste Sockets**. This will essentially duplicate the Socket. [image: paste sockets]

- Paste the Socket to a different Bone, which is done by right-clicking a different Bone in the Skeleton Tree and selecting **Paste Sockets To Selected Bone**. This will paste a copy of that Socket with the same offset information, but parented to the new Bone. [image: paste sockets to selected bone]

### Mesh Sockets

When sharing Skeletons (-> skeletons-in-unreal-engine) between different Skeletal Meshes, it may be necessary to create Sockets that are exclusive for one of the Skeletal Meshes. This can be done by using **Mesh Sockets**, which will make a Socket exist on the **Skeletal Mesh**, instead of the **Skeleton**.

 [image: mesh socket compare]

To make a Mesh Socket, right-click an existing Socket and select **Create Mesh Socket**. This will convert the Socket into a Mesh Socket. Ensure that you are currently using the Skeletal Mesh Editor (-> skeletal-mesh-editor-in-unreal-engine) for the Skeletal Mesh you want to create this for.

 [image: create mesh socket]

As with Sockets existing on the Skeleton Asset, Mesh Sockets will instead exist on the Skeletal Mesh, requiring you to save that asset if you create or modify Mesh Sockets.

### Socket Details

Sockets contain the following properties in the **Details **panel when selected.

 [image: socket details]

| Name | Description |
| --- | --- |
| **Relative Location / Rotation / Scale** | The current transform coordinates of the Socket in relative coordinates to its parent Bone in either location, rotation, or scale. |
| **Force Always Animated** | Enabling this will cause all parent bones of this Socket to always evaluate, regardless of if they are being removed due to the current LOD setting. |
| **Socket Name** | The name of this Socket. |
| **Bone Name** | The name of the Bone this Socket is attached to. Changing this value to a different Bone will re-parent the Socket. |

## Attaching with Sockets

Once you have created and positioned your Socket, you can attach objects, effects, and other actors to it. The following kinds of attachments can be performed.

### Basic Level Attachment

You can set up a basic attachment within a Level, where an object will be attached to a Socket by default. There are a few ways you can do this.

 [image: basic socket attachment in level]

#### Drag and Drop

In the Level Outliner, drag the object onto your Skeletal Mesh Actor. A window will appear after where you can select any Bone or Socket to attach to. Select your Socket and the attachment process will complete.

 [image: drag and drop socket attach]

When attaching in the Level, the object will retain its world transform from before, which can be useful if you are creating unique offsets for different objects. If you want the object to match the Socket's transform, then set the transform values of the object to default.

 [image: zero transform]

#### Context Menu

Right-click your object and select **Attach To**, then click on your Skeletal Mesh Actor. A window will appear after where you can select any Bone or Socket to attach to. Select your Socket and the attachment process will complete.

 [image: context menu socket attach]

#### Socket Snapping

Click the **Settings** dropdown menu in the Level editor and select **Enable Socket Snapping**. This will make all **Sockets **visible in the viewport.

 [image: enable socket snapping]

Next, you can quickly attach an object to any visible Socket by selecting the object first, then selecting a Socket.

 [image: socket snap attach]

### Basic Blueprint Attachment

You can also set up a basic default attachment to a **Skeletal Mesh Component** in Blueprints (-> blueprints-visual-scripting-in-unreal-engine).

First, parent the object to the Skeletal Mesh Component by dragging the object on the Skeletal Mesh in the **Components **panel.

 [image: blueprint socket attachment]

Next, select the child object, and in the **Details **panel locate the **Parent Socket** property. Click the **search button** and select the Socket to attach to.

 [image: blueprint parent socket attachment]

### Dynamic Attachment

In cases where you want to control when your object attaches and detaches to Sockets, you can use various **Attach **and **Detach **Blueprint functions.

For attaching, you can use the following functions:

- **Attach Actor To Actor**.

- **Attach Actor To Component**.

- **Attach Component To Component**.

 [image: attach blueprint functions]

Attaching functions contain the following properties:

| Name | Description |
| --- | --- |
| **Target** | The child actor or component that is being attached. |
| **Parent** | The parent actor or component that the **Target** is being attached to. |
| **Socket** | The Socket to use when attaching |
| **Location / Rotation / Scale Rule** | Transform rules that control where the **Target** should end up after being attached. You can select from the following options: **Keep Relative**, which maintains the current transform numerical values. This will likely cause the Target to pop into a new position and is useful to maintain the same offset coordinates when attaching. **Keep World**, which will maintain the current visual transform of the Target. This will not cause a pop when attaching as a calculation will occur to maintain the same visual transform before and after the attachment. **Snap to Target**, which will teleport the Target to the coordinates of the Parent or Socket. |
| **Weld Simulated Bodies** | Whether or not to weld (-> welding-physics-bodies-in-unreal-engine-by-using-the-physics-asset-editor) the Target to the Parent. |

For detaching, you can use the following functions:

- **Detach From Actor**

- **Detach From Component**

 [image: detach blueprint functions]

- animation

On this page

- Prerequisites (-> skeletal-mesh-sockets-in-unreal-engine)
- Creating Sockets (-> skeletal-mesh-sockets-in-unreal-engine)
- Managing and Editing Sockets (-> skeletal-mesh-sockets-in-unreal-engine)
- Socket Visibility (-> skeletal-mesh-sockets-in-unreal-engine)
- Selection and Movement (-> skeletal-mesh-sockets-in-unreal-engine)
- Copy and Paste (-> skeletal-mesh-sockets-in-unreal-engine)
- Mesh Sockets (-> skeletal-mesh-sockets-in-unreal-engine)
- Socket Details (-> skeletal-mesh-sockets-in-unreal-engine)
- Attaching with Sockets (-> skeletal-mesh-sockets-in-unreal-engine)
- Basic Level Attachment (-> skeletal-mesh-sockets-in-unreal-engine)
- Drag and Drop (-> skeletal-mesh-sockets-in-unreal-engine)
- Context Menu (-> skeletal-mesh-sockets-in-unreal-engine)
- Socket Snapping (-> skeletal-mesh-sockets-in-unreal-engine)
- Basic Blueprint Attachment (-> skeletal-mesh-sockets-in-unreal-engine)
- Dynamic Attachment (-> skeletal-mesh-sockets-in-unreal-engine)

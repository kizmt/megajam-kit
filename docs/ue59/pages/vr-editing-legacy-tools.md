# VR Editing Legacy Tools

https://dev.epicgames.com/documentation/en-us/unreal-engine/vr-editing-legacy-tools?application_version=5.9

> How to use the VR editing tools for virtual scouting.

[image: VR Editing Legacy Tools]

The Virtual Scouting Legacy tools (-> virtual-scouting-legacy-tools) described on this page will be sunset and deprecated in a future engine release. We encourage users to move to the new Virtual Scouting tools (-> virtual-scouting-in-unreal-engine). Unused VREditor code and
modules will be fully deprecated in a future engine release.

## Interaction

The **Interaction** tool allows you to transform and manipulate objects in your scene. When in Interact mode, a ray always appears from your virtual controller indicating where you are pointing in the scene. Direct this pointer at an object in the scene in order to interact with it by translating, scaling, or rotating the object in the scene. There are two ways to switch to the Interact tool:

- Select the **Interact** option in the Virtual Scouting menu.

- Double tap the menu button on one of your motion controllers. |  |  |
| --- | --- |
|  |  |
| Vive | Oculus Touch |

Select an object by directing the pointer at the object and then pressing and releasing the trigger on your motion controller.

- When an object is selected, it is highlighted in the scene.

- After an object is selected, press and hold the trigger to move it around at the end of the pointer.

- Scroll up or down on the Vive motion controller's trackpad to move the object away from or toward you, respectively, along the pointer ray.

- You can also select an object by holding your virtual controller inside the object's collision layer. With your virtual controller still inside the object's collision layer, press and hold the trigger to grab the object and move it around the scene.

### Transformation Gizmos

The Interaction tool includes the ability to transform objects by scaling, rotating, and translating them.

#### Transformation Gizmos with the Vive Controllers

The Vive motion controller's trackpad is divided into four sections:.

- Press the top section of the trackpad to fly through the scene while holding an object.

- As with the Navigation tool, use the bottom section of the Vive motion controller's trackpad to teleport.

- The right side of the trackpad cycles through the standard transformation gizmos—translation, rotation, and scaling. These transformations can occur along all three axes with ways to constrain movement to a combination of two axes.

- The left side of the trackpad toggles between the selected gizmo and the Universal Gizmo. Translation, rotation, and scaling are separate gizmos and occur along all three axes with ways to constrain movement to a combination of two axes.

- The Universal Gizmo combines translation, rotation, and scaling into one gizmo.

#### Transformation Gizmos with the Oculus Touch Controllers

The Oculus Touch controllers are organized as follows:

- Move the thumbstick on the Oculus Touch controller in the direction you want to fly.

- As with the Navigation tool, you can teleport by pressing the B or Y buttons on the Oculus Touch controller.

- Clicking down on the Oculus Touch controller's thumbstick cycles through the standard transformation gizmos as well as the Universal Gizmo. Translation, rotation, and scaling are separate gizmos and occur along all three axes with ways to constrain movement to a combination of two axes.

- The Universal Gizmo combines translation, rotation, and scaling into one gizmo.

|  |  |
| --- | --- |
|  |  |
| Universal Transform Gizmo | Standard Translation Gizmo |

### Object Context Menu

When an object is selected, you can open a context menu to quickly perform a series of actions. To open the context menu, press the **Menu** button on the motion controller. For most objects the context menu buttons default to the two options below. Cameras and lights have other options. Refer to the **Camera Context Menu** in the **Viewfinder** tool section and the **Light Context Menu** in the **Gaffer** tool section of the VR Camera and Light Tools (-> vr-camera-and-light-legacy-tools) for more.

- **Delete**: Removes the selected object from the scene.

- **Duplicate**: Makes a copy of the selected object in the scene.

To use the gizmos, you must enable the Transform Gizmo option in the Virtual Scouting menu.

## Marker

With the **Marker** tool, you can spawn a colored ribbon in your scene for making notations in the scene. These marks are also visible to other users in a Multi-User Virtual Scouting session. To switch to the Marker tool, open the Virtual Scouting menu and select the Marker option.

- With the Marker tool equipped, press the trigger on your motion controller to draw a three-dimensional ribbon in the scene with the tip of the virtual controller.

- To change the color of the marker, rest your thumb on the Vive motion controller's trackpad or move the Oculus Touch controller's thumbstick to select a color in the color wheel.

- Clicking down on the Vive motion controller's trackpad or the Oculus Touch controller's thumbstick selects the color to which the white circle is pointing.

|  |  |
| --- | --- |
|  |  |
| Vive | Oculus Touch |

You can erase the marks you make with the Marker tool.

- Select the eraser icon in the middle of the color wheel to switch the marker into an eraser.

- To delete a mark, move the tip of the virtual controller to the mark and press the trigger on the motion controller.

- Marks can also be deleted with the **Undo** option in the Virtual Scouting menu or with the Undo gesture.

## Measure

|  |  |
| --- | --- |
|  |  |
| Measure tool example with metric units | Measure tool example with imperial units |

With the **Measure** tool, you can measure the distance between objects or specific locations in your scene, in either metric or imperial units. To switch to the Measure tool, open the Virtual Scouting menu and select the Measure option.

With the Measure tool equipped, a pointer ray projects from your virtual controller.

- A small gold cube appears at the end of the ray when there is an object from which that you can measure the distance from. Press the trigger on your motion controller to trace a light blue line to another object.

- Release the trigger to measure the length of the light blue line. A heads-up display (HUD) appears with the measurement between the two points.

- To switch the measurement units in the HUD, open the Settings panel in the Virtual Scouting menu and toggle between metric and imperial unit scale.

In addition to measuring the distance between objects, you can place custom flags to measure between different locations in your scene. Placing multiple flags shows the distance between neighboring flags as well as the total distance from end to end.

- To place these flags in your scene, use the top section of the Vive motion controller's trackpad or the B or Y buttons on the Oculus Touch controller with the Measure tool active.

- To remove an existing flag, move the virtual controller towards the flag until it interacts with it. Then, click the bottom half of the Vive motion controller's trackpad or pull the Oculus Touch controller's thumbstick down.

- Flags also disappear when you switch away from the Measure tool.

|  |  |
| --- | --- |
|  |  |
| Vive | Oculus Touch |

## Multi-User Editing

Virtual Scouting as a workflow concept makes heavy use of the **Multi-User Editor** so all of the key members of a production can explore a scene together. All tools, unless otherwise noted, will have their changes reflected to all users in the multi-user session.

When multiple users are in a session, their names will appear in the left section of the menu. You can teleport to another user's location by selecting that user in this list.

Not all users have to be in virtual reality to participate. Sessions often work best when one of the artists is working from the desktop, performing complex actions that are hard to do in VR but straightforward when sitting in front of a computer.

For more information on multi-user editing, see Multi-User Editing (-> multi-user-editing-in-unreal-engine).

**Pointer**

You can create a pointer ray from your virtual controller that is visible to other users in your Multi-User scouting session in order to direct their attention to a particular part of the scene. To use the pointer function, activate the Navigation tool and either press on the top section of the Vive motion controller's trackpad or press the trigger on the Oculus Touch controller.

### Flare

To show where you are in the level to other users who are in a Multi-User scouting session with you, hold both controllers up over your head until they are close together. A red flare appears from the tip of your virtual controller.

|  |  |
| --- | --- |
|  |  |

## Sequencer

Using the **Sequencer** tool, you can play back a sequence within your scene. To activate the tool, open the Virtual Scouting Menu and select the Sequence panel at the bottom of the menu.

You must have a sequence already added to your level and the Sequencer window / tab must be open in UE4 for this tool to function properly. See the Sequencer Overview (-> unreal-engine-sequencer-movie-tool-overview) for more information on adding a sequence to your level.

- To scrub the sequence timeline, press and hold the trigger on your motion controller and move the motion controller to your right or left.

- To play or pause the sequence, press the B or Y buttons on your Oculus Touch controller or press down on the center of your Vive controller's trackpad.

- You can slowly track the playhead forward or back. Using the Vive motion controller, slide your thumb over the trackpad in a clockwise or counter-clockwise direction.

- Using the Oculus Touch controller, move the thumbstick on to the left or right.

|  |  |
| --- | --- |
|  |  |
| Vive | Oculus Touch |

### Live Editing with Sequencer

**Live Editing** provides the ability to animate objects and keyframe objects in real time while in VR. This requires that your level have a sequence associated with it so the additional keys can be saved within that sequence.

Live Editing must be enabled in the Virtual Scouting Settings to use this feature.

To set keys and manipulate objects in your scene over time, you need to make changes to the position, rotation, or scale of your object on different frames in your sequence. Move the sequence to the frame number you wish to modify and edit the objects using the Interaction tool. When you scrub the sequence, you can see the edit you made to the object in the playback.

The Sequencer tool is important for this workflow.

**Editing: Turn Off Snapping**

When interacting directly with objects in VR, disabling snapping features can provide a better experience because movements will be smoother. You can disable these settings by following these steps.

- Navigate to Edit > Editor Preferences.

- Select the Viewports section.

- Disable Grid Snapping, Rotation Snapping, and Scale Snapping.

- virtual scouting

On this page

- Interaction (-> vr-editing-legacy-tools)
- Transformation Gizmos (-> vr-editing-legacy-tools)
- Transformation Gizmos with the Vive Controllers (-> vr-editing-legacy-tools)
- Transformation Gizmos with the Oculus Touch Controllers (-> vr-editing-legacy-tools)
- Object Context Menu (-> vr-editing-legacy-tools)
- Marker (-> vr-editing-legacy-tools)
- Measure (-> vr-editing-legacy-tools)
- Multi-User Editing (-> vr-editing-legacy-tools)
- Flare (-> vr-editing-legacy-tools)
- Sequencer (-> vr-editing-legacy-tools)
- Live Editing with Sequencer (-> vr-editing-legacy-tools)

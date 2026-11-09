# Animation Mode

https://dev.epicgames.com/documentation/en-us/unreal-engine/animation-editor-mode-in-unreal-engine?application_version=5.9

> Enable Animation Mode to provide an animator-friendly workspace and tools in Unreal Engine.

[image: Animation Mode]

**Animation Mode** is a Mode (-> level-editor-modes-in-unreal-engine) in Unreal Engine that exposes new tools, panels, and editor behaviors that assist your animation workflows. Using this Mode when animating with Control Rig offers a more animation-focused editor experience, with tabs to aid in selecting Controls, transform displays, and launching tools.

This document provides an overview of Animation Mode, including its user interface, tools, and settings.

#### Prerequisites

- You have created a **Control Rig Asset**. See the Control Rig Quick Start (-> how-to-create-control-rigs-in-unreal-engine) page for information on how to do this.

- Animation Mode is mainly dependent on using Control Rig within Sequencer, therefore a basic knowledge (-> how-to-make-movies-in-unreal-engine) of Sequencer is required.

## Enabling Animation Mode

Animation Mode can be enabled in the following ways:

- Dragging a Control Rig Asset from the Content Browser into a Level. This will create a new Level Sequence (-> cinematics-and-movie-making-in-unreal-engine), add the character with a **Control Rig Track**, and enable Animation Mode. [image: enable animation mode]

- Selecting a Control Rig Track in Sequencer. [image: enable animation mode]

- Manually enabling Animation Mode by clicking the **Mode **dropdown menu and selecting **Animation**. Alternatively, you can also press **Shift + 7**. [image: enable animation mode]

Animation Mode can be disabled and normal level editing mode restored either by selecting the **Mode **dropdown menu and clicking **Select**, or by pressing **Shift + 1**.

 [image: disable animation mode]

## Animation Mode Overview

Animation Mode is a level editor Mode (-> level-editor-modes-in-unreal-engine) which contains specialized editing interfaces and workflows. Activating it will add the following panels to the Unreal Editor interface:

 [image: animation mode user interface]

- The **Animation** panel, which contains Animation Mode Tools (-> animation-editor-mode-in-unreal-engine), Settings (-> animation-editor-mode-in-unreal-engine), Space Switching Controls (-> re-parent-control-rig-controls-in-real-time-in-unreal-engine), and Constraints (-> animation-constraint-tools-in-unreal-engine).

- The **Anim Outliner (-> animation-editor-mode-in-unreal-engine)**, which is an Outliner modified to only show Controls on the selected Control Rig.

- **Anim Details (-> animation-editor-mode-in-unreal-engine)**, which is a Details panel modified to only show relevant animatable properties of selected Controls.

### Anim Outliner

The Anim Outliner panel displays all animatable Controls and organizes them according to their hierarchy, as defined in the Control Rig.

 [image: anim outliner]

Selecting Controls here will also select them in the Viewport and Sequencer. Inversely, selecting Controls in either the Viewport or Sequencer selects them here, too.

Control icons inherit the control shape color (-> control-shapes-and-control-shape-library-in-unreal-engine) of their control, which makes it easier to read the control and match it to the Viewport color.

### Anim Details

The Anim Details panel displays relevant animatable properties for the selected Control, including properties of children channel Controls.

 [image: anim details]

Transform values are relative to the Initial Local / Global values defined on the Control in the Control Rig Asset, therefore, the "zero-point" of these Controls is equal to those values.

Boolean, Float, Integer, and Enum Controls that are children of a selected Control will automatically be selected when selecting the parent, and will display within the Anim Details panel as **Channels**. This way, you can manipulate these Controls at the same time as the parent, and also create custom attributes and channels on a single Control.

## Animation Mode Tools

The Animation panel contains the following tools to aid your animation workflows:

| Name | Icon | Description |
| --- | --- | --- |
| **Select** | [image: select tool] | Enabling this will only make Control Rig controls be selectable in the Viewport. All other objects, including the character, will not be selectable. This can also be enabled from the Animation Settings (-> animation-editor-mode-in-unreal-engine) by enabling **Only Select Rig Controls**. |
| **Poses** | [image: poses tool] | Opens the Control Rig Pose Tool (-> animation-editor-mode-in-unreal-engine). |
| **Tweens** | [image: tweens tool] | Opens the Tween Controller (-> animation-editor-mode-in-unreal-engine). |
| **Snapper** | [image: snapper tool] | Opens the Control Rig Snapper Tool (-> animation-editor-mode-in-unreal-engine). |
| **Trails** | [image: motion trails] | Opens the Motion Trail Window (-> animation-editor-mode-in-unreal-engine). |
| **Pivot** | [image: pivot tool] | Creates a temporary pivot (-> animation-editor-mode-in-unreal-engine) for alternative Control manipulation. |

### Poses Tool

The Control Rig Pose Tool is a tool that stores and retrieves data on your Controls. You can save the relative pose on selected Controls, adjust the thumbnail icon, and configure your saved pose to apply to symmetrical Controls.

 [image: pose tool interface]

#### Saving Poses

To save a new pose, first select the Controls you want to include in the pose, then click **Create Pose** in the toolbar. You will then be prompted to name the pose Asset. Enter a name, then click **Create Asset** to create the pose. The new pose will be created within the selected folder.

 [image: create pose]

You can also adjust the Thumbnail by selecting the pose in the browser, changing your Viewport camera, and clicking **Capture Thumbnail**.

 [image: pose tool capture thumbnail]

#### Applying Poses

Before applying poses, you must ensure you have the appropriate Controls selected. You can do this either by manually selecting the Controls or by selecting the pose and clicking **Select Controls**, which selects all Controls from that pose.

 [image: pose tool select controls]

There are several ways you can apply saved poses to your Controls. You can either:

- Double-click the pose from the browser, which will apply the selected pose. [image: apply saved pose]

- Click **Paste Pose**. [image: apply pose]

- Manipulate the **Blend Pose Slider**, which will apply the pose partially based on a delta between the current pose of the Controls and the selected Pose. A value of **0** will maintain the current pose, whereas a value of **1** will fully apply the selected pose. [image: apply pose]

Enabling the **Key** option will create Keyframes (-> creating-animation-keyframes-in-unreal-engine) when a pose is applied to the selected Controls.

 [image: pose tool keyframe]

#### Mirroring Poses

For humanoid and other symmetrical rigs, you can also apply your poses on either side of the line of symmetry. This is done with a combination of namespace searching and axis mirroring and flipping. Enabling the **Mirror** option will apply your saved poses to the other side, ensuring you select the Controls first.

 [image: mirror pose]

By default, the naming convention system assumes **Left **and **Right **are designated as `_l_` and `_r_` respectively. You can change this by editing the **Right Side** and** Left Side** property fields to match your Control Rig's symmetry designation. For example, you may want to change these properties to read as `_left` and `_right` if your symmetry designation is a postfix.

 [image: mirror pose left side right side]

**Mirror Axis** is where you designate the axis of symmetry along your character. In most cases this will remain as **X** if you use a standard **Y - Facing** character in Unreal Engine.

 [image: mirror axis]

**Axis to Flip** is the rotation axis to maintain while inverting the others in order to calculate the mirrored pose. In most cases this should be set to **X**, which is meant to keep rotational **X** values the same, while inverting **Y** and **Z**.

Because of the arbitrary nature of some Control Rigs, you should ensure your Control Rig symmetry is constructed in such a way that it can appropriately comply with axis mirroring and flipping.

#### Additional Controls and Hotkeys

Right-clicking on a pose will expose a context menu with the following commands:

 [image: pose context menu]

| Name | Description |
| --- | --- |
| **Rename Asset** | Renames the pose. |
| **Save Asset** | Saves the pose. |
| **Delete Asset** | Deletes the pose. |
| **Paste Pose** | Applies the pose to the selected Controls. |
| **Paste Mirror Pose** | Applies the pose to the selected mirrored Controls. |
| **Select Controls** | Selects the Controls defined by the pose. |
| **Update Pose** | Updates the pose based on the currently selected Controls and their pose. |
| **Rename Controls** | Opens a property matrix for changing the names of the saved Controls within a pose. This is useful if you want a pose to apply to a different Control Rig with differently named Controls. |

Holding **Alt **and double-clicking a pose will select the Controls from that pose.

 [image: alt click pose]

#### Folder Display

By default, the folder structure for saving and using poses is `Content/ControlRig/Pose`. In cases where you want to save to a different directory, or have imported poses that are not within this default directory, you can add other folders to your pose tool directory.

To do this, right-click in the directory area and select **Add Existing Folder To View**. Select the folder you want to add and click **OK**.

 [image: add existing folder to view]

The folder, and any poses within, should now display in the pose tool directory.

 [image: add existing folder to view]

### Tweens Tool

The Tweens Tool can be used to adjust the interpolation between selected keyframes or their neighbors in a variety of ways.

 [image: tweens tool controller]

With the **Tween Controller** open, select your keyframed Controls and ensure your playhead is between two keyframes. Manipulate the Tween Controller value by either dragging the slider or typing in a value between **-1** and **1**. A value of **-1** will cause the new in-between keyframe to match the value of the preceding keyframe, whereas a value of **1** will match the next keyframe's value.

 [image: tween controller edit]

The Tween Controller has several modes for adjusting the in-between keyframe available in the Tween tool dropdown menu.

| Tween Mode | Description |
| --- | --- |
| **Blend to Neighbor (BN)** | Moves the key to the previous (-1) or next (1) neighboring keyframes from its relative current position. |
| **Push Pull (PP)** | Softens (-1) or intensifies (1) the selected keyframes' overall values between the first and last key. |
| **Tween (TW)** | Moves the key to the previous (-1) or next (1) neighboring keyframes in absolute values. This means that **0** will always move the key's value half-way between neighboring values. |

### Snapper Tool

The Snapper Tool can be used to pin your Controls to other sources for a duration of time. Rather than attaching the Control, it bakes keyframes instead, so you can easily modify the resulting animation after snapping. You can snap to other Controls, objects in Sequencer, or the world.

 [image: snapper tool]

#### Snapper Tool Usage

To use the Snapper Tool, you must first define the Child and Parent actors. Clicking on the **Children **or **Parent **buttons will assign your current selection to that category. In this example, the **Hand Control** is selected to be the **Child**, and the **Ball **is selected to be the **Parent**.

 [image: snapper tool parent child]

Next, if needed, you can define the range of time for the snapping effect to be active and where Keyframes (-> creating-animation-keyframes-in-unreal-engine) will be baked. In this example the range of time is specified between frames **6 - 24**.

 [image: snapper tool time region]

Lastly, there are a few settings available that control the snapping behavior:

| Name | Description |
| --- | --- |
| **Keep Offset** | Whether to maintain the offset between the parent and child at the initial snap time. If disabled, then the child will attach to the same transform as the parent for the duration of the snap. |
| **Snap Position** | Whether or not to snap the child's position to the parent. |
| **Snap Rotation** | Whether or not to snap the child's rotation to the parent. |
| **Snap Scale** | Whether or not to snap the child's scale to the parent. |

Clicking **Snap Animation** will perform the snap operation. In this example, **Keep Offset** is enabled in order to maintain the hand at the top of the ball.

 [image: snapper tool]

### Motion Trail Tool

The Motion Trail Tool previews your overall Control motion by drawing the motion as an interactable curve in the Viewport. You can then edit the motion by manipulating the keyframes along the curve.

 [image: motion trail tool]

#### Motion Trail Usage

After opening the **Motion Trail** window, enable the **Show Trails** option to make the motion curve visible for your selected Controls.

 [image: motion trail show trails]

Selecting other Controls or multi-selecting Controls while **Show Trails** is enabled will draw motion trails for those Controls, too.

 [image: motion trails multi select]

Enable the **Show Keys** option to draw the position information of Keyframes (-> creating-animation-keyframes-in-unreal-engine) along the curve. Select these keys in the Viewport to reveal a manipulator you can use to edit the position data of your motion from the Viewport.

 [image: motion trails show keys]

#### Motion Trail Properties

The following properties and features are available in the Motion Trail tool:

| Name | Description |
| --- | --- |
| **Show Trails** | Draws a Motion Trail for the selected Controls. |
| **Trail Color** | Sets the color of the Motion Trail. |
| **Show Full Trail** | Enabling this draws the full Motion Trail based on all keyframes within Sequencer. Disabling this will only draw a section of the trail relative to the Playhead. [image: motion trails show full trail] |
| **Trail Thickness** | Controls the thickness of the Motion Trail. A value of **0** will make the trail be 1 pixel thin. |
| **Frames Before** | The amount of the trail, in Frames, to display before the current Playhead time when **Show Full Trail** is disabled. |
| **Frames After** | The amount of the trail, in Frames, to display after the current Playhead time when **Show Full Trail** is disabled. |
| **Evals Per Frame** | This controls the smoothness of the Motion Trail curve. Increasing this will result in a smoother-looking curve, but at a performance cost. |
| **Show Keys** | Enables the display of keyframes along the Motion Trail. Requires **Show Trails** to also be enabled. Keyframes can be selected and manipulated to change their position information. |
| **Show Frame Number** | Enables a frame counter display next to each keyframe. The number is based on the keyframe time in Frames, and adheres to Sequencer's **Frames Per Second** setting. |
| **Key Color** | Sets the color of the keyframe display, including the keyframe number. |
| **Key Size** | Controls the size of the keyframe points. |
| **Show Marks** | Enables the display of visual timing marks along the Motion Trail. These marks are useful for visualizing the speed of a motion along the curve. Marks that are spread apart denote high-speed regions, whereas marks that are close together denote lower-speed regions. [image: motion trails show marks] |
| **Mark Color** | Sets the color of the timing marks. |
| **Mark Size** | Controls the size of the timing marks. |
| **Lock Marks to Frames** | Sets the distribution of the timing marks to match Sequencer's **Frames Per Second** setting. |
| **Seconds Per Mark** | If **Lock Marks to Frames** is disabled, you can set an arbitrary time here (in seconds) for marks to be distributed along the curve. |

Motion Trails can be enabled for non-Control Rig objects and actors in Sequencer by using the console command: `Sequencer.UseOldSequencerTrails 0`. This will disable the legacy transform trajectory display, enabling the new Motion Trails tool to be used instead.

### Pivot Tool

The Pivot Tool creates a temporary pivot point for a selected Control, which can then be moved to any arbitrary point. This tool is useful if you need to temporarily manipulate a Control relative to other points. After enabling the Pivot Tool, clicking **Edit** enables the pivot to be moved to different points. Clicking **Pose** will lock the pivot to its current position, where manipulating it will move the selected Control relative to the pivot.

 [image: pivot tool]

#### Pivot Tool Usage

There are several hotkeys and behaviors to aid you using the Pivot Tool in different ways.

| Hotkey | Description |
| --- | --- |
| **Ctrl + Shift + Alt + G** | Resets the pivot position back to the Control. [image: reset pivot tool] |
| **Shift + LMB Pivot Tool** | When multiple Controls are selected, holding Shift and clicking the Pivot Tool will snap all pivots to the last selected Control. [image: snap pivot] |
| **Ctrl + LMB Pivot Tool** | When multiple Controls are selected, holding Ctrl and clicking the Pivot Tool will snap all pivots to the middle point of all selected Controls. [image: snap pivot middle] |
| **Ctrl + LMB in Viewport** | Holding Ctrl and clicking in the Viewport will snap the pivot point to the selected point. [image: raycast pivot] |
| **Shift + Pivot** | Holding **Shift** while pivoting will disable rotation on the Control when pivoting, causing it to only translate. [image: pivot rotation off] |

## Animation Mode Settings

In the **Animation Mode Panel**, you can expand the Animation Settings section to reveal the following additional settings:

 [image: animation mode settings]

| Name | Description |
| --- | --- |
| **Display Hierarchy** | Enabling this will draw Bones on the character. [image: animation mode display hierarchy] |
| **Display Nulls** | Enabling this will draw all Nulls (-> controls-bones-and-nulls-in-control-rig-in-unreal-engine) from the Control Rig in the Viewport. |
| **Hide Control Shapes** | Hides all Controls in the Viewport. This will also hide Bones and Nulls if **Display Hierarchy** or **Display Nulls** are enabled. |
| **Show All Proxy Controls** | Hides or shows all Proxy Controls (-> controls-bones-and-nulls-in-control-rig-in-unreal-engine) in the viewport. Proxy Controls are invisible until you select one of the Controls they are driving. Enabling this can be a useful way to discover all Proxy Controls in a rig. |
| **Show Controls as Overlay** | Enabling this makes occluded Controls visible (similar to X-ray modes in other software), allowing them to be selected if they are behind other Controls or geometry. |
| **Driven Control Color** | When a Proxy Control is selected, this is the color that all driven Controls will exhibit, which can be useful to aid in selection feedback for your Proxy Control relationships. |
| **Display Axes on Selection** | Shows a preview axis on the selected element. |
| **Axis Scale** | The scale of the preview axis when **Display Axes on Selection** is enabled. |
| **Coord System Per Widget Mode** | Restores the coordinate space when changing Gizmo modes in the Viewport. |
| **Only Select Rig Controls** | Enabling this will only make Control Rig controls be selectable in the Viewport. All other objects, including the character, will not be selectable. This can also be enabled from the toolbar by clicking the **Select** button in the Animation panel toolbar. |
| **Local Transforms in Each Local Space** | Enabling this will transform each selected control relative to their local transform space, if your transformation gizmo is set to local coordinates. [image: animation mode local transforms in each local space] |
| **Gizmo Scale** | Increases or decreases the gizmo scale. [image: animation mode gizmo scale] |

- animation
- control rig
- sequencer
- tool

On this page

- Prerequisites (-> animation-editor-mode-in-unreal-engine)
- Enabling Animation Mode (-> animation-editor-mode-in-unreal-engine)
- Animation Mode Overview (-> animation-editor-mode-in-unreal-engine)
- Anim Outliner (-> animation-editor-mode-in-unreal-engine)
- Anim Details (-> animation-editor-mode-in-unreal-engine)
- Animation Mode Tools (-> animation-editor-mode-in-unreal-engine)
- Poses Tool (-> animation-editor-mode-in-unreal-engine)
- Saving Poses (-> animation-editor-mode-in-unreal-engine)
- Applying Poses (-> animation-editor-mode-in-unreal-engine)
- Mirroring Poses (-> animation-editor-mode-in-unreal-engine)
- Additional Controls and Hotkeys (-> animation-editor-mode-in-unreal-engine)
- Folder Display (-> animation-editor-mode-in-unreal-engine)
- Tweens Tool (-> animation-editor-mode-in-unreal-engine)
- Snapper Tool (-> animation-editor-mode-in-unreal-engine)
- Snapper Tool Usage (-> animation-editor-mode-in-unreal-engine)
- Motion Trail Tool (-> animation-editor-mode-in-unreal-engine)
- Motion Trail Usage (-> animation-editor-mode-in-unreal-engine)
- Motion Trail Properties (-> animation-editor-mode-in-unreal-engine)
- Pivot Tool (-> animation-editor-mode-in-unreal-engine)
- Pivot Tool Usage (-> animation-editor-mode-in-unreal-engine)
- Animation Mode Settings (-> animation-editor-mode-in-unreal-engine)

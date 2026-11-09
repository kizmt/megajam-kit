# Sequencer Editor

https://dev.epicgames.com/documentation/en-us/unreal-engine/sequencer-cinematic-editor-unreal-engine?application_version=5.9

> An overview of the Sequence Editor's user interface, tools, and options.

[image: Sequencer Editor]

The **Sequencer Editor** is the main interface you can use to edit Level Sequences assets (-> unreal-engine-sequencer-movie-tool-overview), in order to create cinematic content in **Unreal Engine**.

The following document provides an overview of the Sequencer Editor's user Interface, tools, and properties.

[image: sequencer editor overview with highlights]

- Toolbar (-> sequencer-cinematic-editor-unreal-engine)
- Outliner (-> sequencer-cinematic-editor-unreal-engine)
- Timeline (-> sequencer-cinematic-editor-unreal-engine)
- Playback Controls (-> sequencer-cinematic-editor-unreal-engine)

## Toolbar

The Sequencer Editor Toolbar contains a suite of tools, options and settings you can use to interface with Level Sequence assets.

[image: sequencer toolbar overview with highlights]

| Name | Icon | Description |
| --- | --- | --- |
| World (-> sequencer-cinematic-toolbar-in-unreal-engine) | [image: sequencer world] | Lists information on the current world context, Level Sequence Actor, and playback realm. It contains options for specifying whether you want your sequence to autobind to Play In Editor (PIE), Simulation, or other runtime sessions. |
| **Save** | [image: sequencer save] | Saves the current sequence and any subscenes or shots. |
| **Find in Content Browser** | [image: sequencer find] | Locates the current sequence's Level Sequence asset in the Content Browser. |
| Create Camera (-> sequencer-cinematic-toolbar-in-unreal-engine) | [image: sequencer camera] | Creates a new **Cine Camera Actor (-> cinematic-cameras-in-unreal-engine)**. A new **Camera Cut Track (-> cinematic-camera-cut-track-in-unreal-engine)** will also be created and will reference this camera if one had not already been created. |
| Render (-> sequencer-cinematic-toolbar-in-unreal-engine) | [image: sequencer render] | Opens the **** Settings dialog, or the **Movie Render Queue** if its plugin is enabled. |
| Director Blueprint (-> sequencer-cinematic-toolbar-in-unreal-engine) | [image: sequencer director] | Opens the Director Blueprint for this sequence, from which **Event Track (-> cinematic-event-track-in-unreal-engine)** logic can be accessed. |
| Actions (-> sequencer-cinematic-toolbar-in-unreal-engine) | [image: sequencer actions] | Lists various sequence editor actions such as saving, import/export, baking, and selection editing. |
| View Options (-> sequencer-cinematic-toolbar-in-unreal-engine) | [image: sequencer view options] | Lists various sequence view options. |
| Playback Options (-> sequencer-cinematic-toolbar-in-unreal-engine) | [image: sequencer playback options] | Lists various playback options such as playrate, start/end times, and playhead behavior. |
| Keyframe Options (-> sequencer-cinematic-toolbar-in-unreal-engine) | [image: sequencer keyframe options] | Lists settings for Auto Key transform keyframing behavior, and what default tangents are created. |
| Auto Key (-> sequencer-cinematic-toolbar-in-unreal-engine) | [image: sequencer autokey] | Enables Autokey mode, where keyframes are automatically created whenever a property or transform changes. |
| Edit Options (-> sequencer-cinematic-toolbar-in-unreal-engine) | [image: sequencer edit options] | Lists settings for how edits from the Details panel are interpreted by Sequencer when using Auto Key. |
| Snapping (-> sequencer-cinematic-toolbar-in-unreal-engine) | [image: sequencer snapping] | Enables snapping. The dropdown menu next to this lists options for setting snapping rules for keyframes, sections, and the timeline. |
| Frames Per Second (-> sequencer-cinematic-toolbar-in-unreal-engine) | [image: sequencer fps] | Lists settings for various Frames Per Second (FPS) targets at runtime. Also contains options to enable the runtime to lock to the chosen frame rate. |
| Curve Editor (-> sequencer-cinematic-toolbar-in-unreal-engine) | [image: sequencer curve editor] | Opens the **Curve Editor (-> animation-curve-editor-in-unreal-engine)** which is used for fine tuning of animation keyframes and tangents. |
| Breadcrumbs (-> sequencer-cinematic-toolbar-in-unreal-engine) | [image: sequencer breadcrumbs] | Displays the current sequence name, and is used to navigate master sequences and shots. |
| **Lock** | [image: sequencer lock] | Locks the entire sequence to prevent editing. |

Refer to Sequence Editor toolbar (-> sequencer-cinematic-toolbar-in-unreal-engine) for more information about Sequencer's toolbar.

## Outliner

The Sequencer Editor's Outliner contains a list of the Level Sequence asset's tracks, as well as tools to add, filter, and search for tracks. Tracks can represent Actors attached to your Level Sequence such as Cameras, Characters, Audio, and Effects.

[image: sequencer outliner overview with highlights]

Refer to Sequencer Tracks (-> sequencer-track-list-in-unreal-engine) for more information about different types of tracks.

## Timeline

The Sequencer's Timeline is a non-linear editing environment that represents the entire playable region of your Level Sequence asset. The Timeline includes horizontal regions for each Track, and can include assets, keyframes and timeline controls.

The playback range of your Level Sequence asset is contained within **Start **(Green) and **End **(Red) markers. The current location of your playback is indicated by the Playhead (-> sequencer-cinematic-editor-unreal-engine).

[image: sequencer overview with highlights]

### Navigation

To navigate your Level Sequence asset in the Sequencer Editor, you can pan (-> sequencer-cinematic-editor-unreal-engine) and zoom (-> sequencer-cinematic-editor-unreal-engine) within the timeline.

#### Panning

You can pan your Timeline view vertically, to see additional track regions, by dragging the right-side scrollbar up and down.

[image: sequencer vertical pan scroll bar]

You can pan and zoom the Timeline view horizontally, to see different content in the playback, using the **Range Slider** at the bottom of the timeline.

Dragging the middle area of the slider pans, while dragging the left/right margins will zoom your view.

The Range Slider is enabled by default and can be disabled from the **View Options** dropdown in the Sequencer toolbar.

Image

Holding the right mouse button and dragging along the timeline enables panning horizontally and vertically.

Scrolling will pan the timeline up and down, while holding **Shift **and scrolling the mouse wheel will pan the timeline left and right.

#### Zooming

You can zoom in the timeline by holding **CTRL **and scrolling the mouse wheel.

[image: horizontal scrolling]

By holding **ALT** + **Shift **and clicking and dragging left and right with the Right Mouse Button, you can free-form zoom.

[image: horizontal scrolling]

By holding **CTRL **and dragging along the time bar to the **right**, you can define a zoom region. Holding **CTRL **and dragging the time bar to the **left **resets the zoom back to full.

[image: horizontal scrolling]

The zoom pivot is relative to the playhead by default and can be changed by locating the **Zoom Position** preference in the **Level Sequence Editor** section of the **Editor Preferences**.

If your zoom and timeline framing have overextended, you can reset your zoom and timeline framing by pressing the **Home **key, which also resets the bounds of the range slider.

[image: home button horizontal zoom scrolling]

### Playhead

The playhead displays the current time in the sequence and is one of the main controls for timeline interactions. During playback it will move across the timeline at the specified playrate and can be stopped in place by pausing.

[image: sequencer playhead]

You can **Left Mouse Button **(**LMB**)** **drag the playhead to change the current time in the sequence, and preview changes in the viewport. This is commonly referred to as "scrubbing". See Scrubbing Responsiveness (-> sequencer-cinematic-editor-unreal-engine) and Synchronous Scrubbing (-> sequencer-cinematic-editor-unreal-engine) below for more information.

**Middle Mouse Button** (**MMB**) dragging causes the playhead to change to the selected position without causing the sequence to evaluate. This technique is used to change time, without changing property values and can be used to create same-value keyframes quickly. When manipulating the playhead in this way, it will change its color to **yellow**, to indicate the sequence is not evaluating.

The current time of the playhead is displayed and can be manipulated from the sequence outliner. You can press **CTRL + T** to focus selection to this field and type in a new time value.

[image: sequencer playhead values]

You can also right-click the playhead or anywhere on the time bar to reveal additional options.

[image: sequencer timeline playhead context menu]

| Name | Description | Hotkey |
| --- | --- | --- |
| **Set Start Time** | Set the start time of the sequence to the current position of your cursor. | **[** |
| **Set End Time** | Set the end time of the sequence to your cursor. | **]** |
| **Set Selection Start** | Set the start point of a custom timeline selection range to your cursor. | **i** |
| **Set Selection End** | Set the endpoint of a custom timeline selection range to your cursor. | **o** |
| **Clear Selection Range** | Remove the selected range. |  |
| **Add Mark** | Create a custom timeline mark at the current playhead time. | **m** |
| **Delete All Marks** | Remove all custom marks from the sequence. |  |
| **Locked** | When enabled, all marks will be locked, which prevents marks from being edited allowing you to scrub the timeline slider freely. |  |

The Playhead time indicator can display with an **asterisk** (*) if the current time is on a sub-frame or in-between frame. This can happen if snapping (-> sequencer-cinematic-toolbar-in-unreal-engine) is disabled.

[image: sequencer sub frames asterisk]

#### Scrubbing Responsiveness

Seeking a specific location and scrubbing along a track in Sequencer are both asynchronous non-blocking operations, whose responsiveness depends on the video codec used.

- **Apple Pro Res** provides the best scrubbing experience.
- **H.264/5** is effective, but shows a few frames of lag even when you enable hardware decoding.

#### Media Player Info

For convenience, Media Sections display media player and media file information directly in the Sequencer UI. This provides visual confirmation of the media player in use for playback.

Certain GOP codecs (H.264 in the screenshot below) might cause slow scrubbing performance; a yellow warning message is shown in such cases.

[image: Codec warning message in Sequencer UI]

#### Synchronous Scrubbing

For use-cases where you need perfect frame alignment while scrubbing, for example when animating in Sequencer against reference video footage, you can enable the **Synchronous Scrubbing** Sequencer media track option. It aligns the video and animation frames exactly where the playhead is located, which ensures perfect alignment at some editor scrubbing responsiveness cost. This option is disabled by default to favor speed and responsiveness.

This setting only affects scrubbing, it has no impact on playback which is always frame accurate.

[image: Synchronous Scrubbing]

### Selection Ranges

Selection ranges are custom regions you can define in a sequence to assist with timeline selection and playback.

To create a selection range, right- click a point in the timeline bar and set a **Start **and **End Selection Range**.

[image: sequencer selection range start end]

The selection range handles can be adjusted similarly to the start and end times of the sequence.

[image: sequencer selection range manipulation]

You can also set the playback of the sequence to loop within the section range.

Selection ranges can also be used to select keyframes and sections within them by clicking the **Actions **toolbar button and selecting **Select Keys in Selection Range** or **Select Sections in Selection Range**.

[image: sequencer selection range settings]

To remove a selection range, right-click the time bar and select **Clear Selection Range**.

### Custom Frame Marks

Custom frame marks are points you can add to call attention to areas or provide annotation for your sequence.

To create a mark, right-click a point in the timeline bar and select **Add Mark**.

[image: sequencer add mark option]

Frame Marks can be selected and multi-selected in the Sequencer Timeline in order to edit their location.

To edit a mark, right-click the mark flag in the Sequencer Timeline to access its context menu. Here you can customize its properties such as **Frame Number, Label,** and **Color**.

[image: sequencer mark properties]

Use these properties to observe and set Custom Frame Mark behavior when creating cinematics in the Sequencer Editor:

| Property | Description |
| --- | --- |
| **Marked Frame** | Sets or reference the **frame number** the mark is located in your Level Sequence. |
| **Label** | Sets a name for the Custom Frame Mark. The value set will be visible in the Sequencer Timeline at the top of the Mark flag. |
| **Comment** | Adds comments associated with the custom mark. |
| **Color** | Sets a custom color for the Mark flag in the Sequencer Timeline. |
| **Is Determinism Fence?** | When enabled, the Mark is treated as a **Determinism Fence**, which ensures that all Sequencer Components are evaluated at the Mark's location in the Sequencer Timeline.Determinism Fences cannot be crossed with a single evaluation, and force the evaluation to be conducted in two separate parts, ensuring an accurate evaluation of all present Sequencer components.It is recommended to add Marks, with the **Is Determinism Fence** property enabled, to important frames in your Level Sequence, in order to ensure accurate playback at runtime. |
| **Add Mark** | Creates a new custom mark at the timecode your cursor is at.Only one custom mark can exist per level sequence frame. |
| **Delete Mark** | Deletes the currently selected mark. |
| **Delete All Marks** | Deletes all custom marks within the level sequence asset. |

## Playback Controls

The playback controls can be found in the bottom-left corner of Sequencer and function similarly to standard media playback applications.

Buttons for toggling playing, pausing, and other playback-related functions are found here.

[image: sequencer add mark option]

| Icon | Description |
| --- | --- |
| [image: sequencer record button take recorder] | Records the motion of a selected actor in the Sequencer Outliner, using **Take Recorder**.In order to use this playback control, you must install the Take Recorder plugin. For more information, see the Take Recorder (-> take-recorder-in-unreal-engine) documentation. |
|  | Sets the start time of the sequence to the current location of the playhead. |
|  | Jumps to the start of the sequence. |
|  | Jumps to the previous keyframe in the selected track. |
|  | Jumps to the previous frame. |
|  | Plays or pauses the sequence in reverse from the current position of the playhead. |
|  | Plays or pauses the sequence from the position of the playhead. |
|  | Jumps to the next frame. |
|  | Jumps to the next keyframe in the selected track. |
|  | Jumps to the end of the sequence. |
|  | Sets the end time of the sequence to the current location of the playhead. |
|  | Toggles between looping and no looping. Selection range looping is added if selection ranges are being used in the timeline. |

### Playback and Looping

Playback and looping performance are the most important functions of video playback. However, the Sequencer timeline makes a wide variety of Media Track section configurations possible, including native, cropped, extended, extended and cropped, with or without pre-roll and post-roll. These create edge-cases which cause problems for looping. The examples below are the currently-supported use cases for looping.

#### Baseline Looping

Baseline looping applies for use cases where:

- The Media Section length is unaltered, that is, it corresponds to the duration of the video clip.
- The Sequencer playback range fits within the Media Section pre-roll and post-roll bounds.

[image: Sequencer baseline looping]

In this configuration, the video clip is at full length and located at T=0, which prevents using the pre-roll section. Since the red and green crop lines are located at clip edges, the Media Section implementation keeps the Player alive and can perform proper seamless looping when the playhead reaches the end of the Sequencer’s playback range.

To prevent user error and because it is difficult to precisely set the red crop line in Sequencer, we recommend you use special care in placing the red line or to use the Media Section post-roll feature to prevent the Player unallocating prematurely.

#### Internal Clipped Looping

Internal clipped looping applies for use cases where you have done either of the following:

- Cropped a video in Sequencer by moving the green and red crop lines within the Media Section.For example, placing the green line at frame 100 and red line at frame 700 while the Media Section has 1000 Frames.

- Manually cropped the Media Section by adjusting its start and end points inside the video clip’s duration.For example, starting at frame 100 and ending at frame 700 if the Media Section had 1000 frames to begin with.

[image: Sequencer internal clipped looping]

This use case is fully supported because the media player is properly notified of those new start and end frames, and can cache the correct frames accordingly.

- animation
- sequencer

On this page

- Toolbar (-> sequencer-cinematic-editor-unreal-engine)
- Outliner (-> sequencer-cinematic-editor-unreal-engine)
- Timeline (-> sequencer-cinematic-editor-unreal-engine)
- Navigation (-> sequencer-cinematic-editor-unreal-engine)
- Panning (-> sequencer-cinematic-editor-unreal-engine)
- Zooming (-> sequencer-cinematic-editor-unreal-engine)
- Playhead (-> sequencer-cinematic-editor-unreal-engine)
- Scrubbing Responsiveness (-> sequencer-cinematic-editor-unreal-engine)
- Media Player Info (-> sequencer-cinematic-editor-unreal-engine)
- Synchronous Scrubbing (-> sequencer-cinematic-editor-unreal-engine)
- Selection Ranges (-> sequencer-cinematic-editor-unreal-engine)
- Custom Frame Marks (-> sequencer-cinematic-editor-unreal-engine)
- Playback Controls (-> sequencer-cinematic-editor-unreal-engine)
- Playback and Looping (-> sequencer-cinematic-editor-unreal-engine)
- Baseline Looping (-> sequencer-cinematic-editor-unreal-engine)
- Internal Clipped Looping (-> sequencer-cinematic-editor-unreal-engine)

# Camera Cut Track

https://dev.epicgames.com/documentation/en-us/unreal-engine/cinematic-camera-cut-track-in-unreal-engine?application_version=5.9

> The Camera Cut Track controls which Cine Camera Actor is currently active during playback in Sequencer.

[image: Camera Cut Track]

One of the key parts of creating a cinematic in **Sequencer** is selecting which camera to be active during a sequence. You can use the **Camera Cut Track** to control this behavior, as well as providing tools to blend cameras together, or to and from gameplay.

This document provides an overview of how to create and use the Camera Cut Track in Sequencer.

#### Prerequisites

- You have an understanding of Sequencer.

- You are familiar with how to add Cameras to Sequencer (-> how-to-animate-cinematic-cameras-in-unreal-engine).

## Creation

There are a variety of ways to create a Camera Cut Track:

- Click **Add Track (+) > Camera Cut Track**.

- Click the **Camera **button in the Sequencer Toolbar (-> sequencer-cinematic-toolbar-in-unreal-engine), which creates a Camera Cut Track and a spawnable Cine Camera Actor (-> cinematic-cameras-in-unreal-engine), then binds the camera to the track.

- Add a currently-existing Camera Actor to the sequence by clicking **Add Track (+) > Actor To Sequencer > Camera Actor**. When you do this, you create a Camera Cut Track automatically and bind it to this camera.

### Binding Cameras

To make Sequencer use a specific camera to look through, you must bind it to the Camera Cut Track. In most creation methods detailed above, your camera is already bound. If not, then you can bind it by clicking **Add Camera (+)** and selecting the following:

- If you already have Cameras added to the sequence, you can select one from the **Existing Bindings** category here.

- If you want to add a new camera, you can select one from the level list under **New Binding**.

After selecting a Camera, a Camera Cut section creates and binds to the selected camera. Enable the **Camera Lock** button on the Camera Cut Track to make the viewport look through the active camera.

Viewport camera control is disabled when locking your view to the Camera Cut Track. If you want to move or keyframe the current active camera, then you need to enable that Camera Track first.

## Making Cuts

To cut between cameras, move the **Playhead** to the point in the timeline where you want the camera to cut. Next, click **Add Camera (+)** on the Camera Cut Track and select the camera you want to cut to. This creates a cut at the playhead, making a new Camera Cut section bound to the camera you selected.

To change the timing of your cut, click and drag on any of the touching section edges to a different time. Unlike most other sections (-> creating-animation-keyframes-in-unreal-engine), Camera Cut sections by default do not allow any gaps or overlaps between cuts.

In most cinematic cases we do not recommend constructing full-length cinematic sequences using multiple cameras and cuts. Instead you should construct your cinematic sequences using shots, which partition a single Camera and Camera Cut for each shot.

## Blending Cameras

Instead of hard-cutting between cameras, you can choose to blend between them, which blends the transforms and camera component properties (Depth of Field, Focal Length, and other properties). To do this, right-click the Camera Cut Track and enable **Can Blend**.

Once enabled, you can now blend (-> creating-animation-keyframes-in-unreal-engine) the Camera Cut sections, similarly to normal section usage. For example:

- You can overlap two Camera Cut sections, blending from one camera in your sequence to another.

- You can drag on the upper corner of a section to blend it in and out. Blending a Camera Cut section in this way can make your sequence camera blend in or out to gameplay.

Blending cameras can be useful when constructing complex shots. In this example, an unconstrained "free" camera blends to an attached camera tracking a fast-moving object. Creating and maintaining this motion with a single camera can be tedious, but with blending cameras it can be much easier.

## Properties

You can find the following Camera Cut-specific properties when right-clicking a section:

| Name | Description |
| --- | --- |
| **Lock Previous Camera** | Enabling this ensures that outgoing cameras do not switch if you are blending from gameplay. This can be useful to enable if your game contains possible camera switching logic that could occur during a blend. Enabling this locks the last used camera as the view to blend from. |
| **Camera Binding ID** | The camera this Camera Cut section is looking through. |

### Thumbnails

Similar to shots, Camera Cut sections display a thumbnail preview of the camera view. You can customize the thumbnail display by right-clicking the section and navigating to the **Thumbnails **menu.

| Name | Description |
| --- | --- |
| **Refresh** | Regenerates the thumbnails for this section. This is useful if the thumbnail images are out of date or are displaying incorrectly. |
| **Set Thumbnail Time to...** | If **Draw Single Thumbnail** is enabled, then selecting this picks a specific frame of the current sequence to use as the single thumbnail image. |
| **Refresh All** | Regenerates the thumbnails for all Camera Cut sections. This is useful if the thumbnail images are out of date or are showing incorrectly. |
| **Draw Thumbnails** | Controls the display of thumbnails for all shots. If disabled, then no thumbnails display, and the track size reduces. |
| **Draw Single Thumbnail** | Enabling this causes only a single thumbnail image to display, at the start region of the camera cut section. |
| **Thumbnail Size** | Controls the width and height of thumbnails. Adjusting the height of your thumbnail will increase or decrease the track size. |
| **Quality** | The quality used to render the thumbnail images. |

Generating thumbnails has a performance cost. If you find the Unreal Editor is running slowly while a Sequence is open, try disabling **Draw Thumbnails**.

- sequencer

On this page

- Prerequisites (-> cinematic-camera-cut-track-in-unreal-engine)
- Creation (-> cinematic-camera-cut-track-in-unreal-engine)
- Binding Cameras (-> cinematic-camera-cut-track-in-unreal-engine)
- Making Cuts (-> cinematic-camera-cut-track-in-unreal-engine)
- Blending Cameras (-> cinematic-camera-cut-track-in-unreal-engine)
- Properties (-> cinematic-camera-cut-track-in-unreal-engine)
- Thumbnails (-> cinematic-camera-cut-track-in-unreal-engine)

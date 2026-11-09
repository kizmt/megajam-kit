# Rendering from Multiple Camera Angles

https://dev.epicgames.com/documentation/en-us/unreal-engine/rendering-from-multiple-camera-angles-in-unreal-engine?application_version=5.9

> Learn how to render from multiple cinematic cameras within the same sequence without needing to create extra shots or takes.

[image: Rendering from Multiple Camera Angles]

When rendering using Movie Render Queue, there may be a requirement to render from multiple Cinematic cameras within a single sequence or Shot. For example, you could be rendering a product demonstration video or training material, which may require multiple angles. Rendering from multiple angles within a single shot can be more ideal than using Takes, as Takes cause new Level Sequence assets to be created, diverging your content.

This document provides an overview of how to render multiple camera angles from a single shot using Movie Render Queue.

#### Prerequisites

- You have a basic knowledge of how to create and open a Level Sequence (-> unreal-engine-sequencer-movie-tool-overview)

- Movie Render Queue is a Plugin (-> working-with-plugins-in-unreal-engine) you must enable prior to use. From Unreal Engine's main menu, go to **Edit > Plugins**, locate **Movie Render Queue** in the **Rendering **section, and click the checkbox to enable it. Then, restart Unreal Engine. [image: enable mrq plugin]

## First Camera Setup

Assuming Sequencer is already open within the Level you want to render, the first step is to start creating your Cinematic Cameras (-> cinematic-cameras-in-unreal-engine).

- Click **Camera **in the **Sequencer Toolbar.** This creates a spawnable Cine Camera Actor, Camera Cuts Track (-> cinematic-camera-cut-track-in-unreal-engine), and then binds the Cine Camera Actor to the Camera Cuts section. [image: create first camera]

- Next, move and keyframe (-> how-to-animate-cinematic-cameras-in-unreal-engine) the camera to your desired framing and animation for this shot. Enable the **Camera icon** on the Cine Camera Actor track, which pilots the camera.

- You can also adjust camera-specific properties, such as **Aperture**, **Focal Length**, and **Focus Distance** to help with your shot composition.

 [image: create camera shot]

## Additional Camera Setup

You can now start to add new cameras to the sequence. Do this the same way you added the first camera, by clicking **Camera **in the Sequencer Toolbar. Each click will add a new camera, so add as many as you require. Although the Camera Cuts Track still is bound to the first camera (making it appear as if this shot only has one camera), these other cameras will be correctly rendered with Movie Render Queue in the final steps of this guide.

 [image: add more cameras]

Similar to the steps taken for the first camera, enable the **Camera **icon on each new camera track to pilot it and set up your composition.

 [image: set up all cameras]

Although not required, we recommend you rename your camera tracks to better reflect their content or usage. Right-click on a track and select **Rename**, or press **F2**. If two cameras share the same name, Movie Render Queue automatically renames them to avoid a filename conflict.

 [image: rename cameras]

## Open Movie Render Queue

Once all your cameras are composed and animated within the sequence, you can now render using Movie Render Queue (MRQ). To open MRQ, click **Render **in the Sequencer Toolbar.

 [image: open mrq]

If MRQ is not correctly opening from this button, check the dropdown menu next to **Render **and ensure it is set to **Movie Render Queue**.

 [image: enable mrq]

## Render Settings

With the MRQ window open, click the **Settings **entry to open the Render Settings (-> cinematic-render-settings-and-formats-in-unreal-engine) window.

 [image: mrq render settings]

Click **Add Setting (+)** and select **Camera**, then select the newly added Camera entry and enable **Render All Cameras**.

 [image: add camera render settings]

Although optional, you may want to edit **Output Directory** or **File Name Format** in Output settings with the `{camera_name}` Format String (-> cinematic-rendering-image-quality-settings-in-unreal-engine). Using this provides you extra control over how your output renders are named or categorized. For example, setting **Output Directory** to `{project_dir}/Saved/MovieRenders/{camera_name}/` outputs each camera angle to a different folder.

 [image: set output directory]

If you don't use `{camera_name}`, then MRQ automatically adds the camera name as a suffix to the file name when **Render All Cameras** is enabled, to prevent file name conflicts.

## Render and Results

Once your render settings are set up, click **Render (Local)** to start the MRQ render process.

 [image: start render]

When the render completes, click the **Output **entry to open a file explorer window to the output directory. You should see your multiple angles rendered here. In this example, the different angles were separated by folder using the steps detailed above.

 [image: render results]

- rendering
- sequencer
- movie render queue
- camera

On this page

- Prerequisites (-> rendering-from-multiple-camera-angles-in-unreal-engine)
- First Camera Setup (-> rendering-from-multiple-camera-angles-in-unreal-engine)
- Additional Camera Setup (-> rendering-from-multiple-camera-angles-in-unreal-engine)
- Open Movie Render Queue (-> rendering-from-multiple-camera-angles-in-unreal-engine)
- Render Settings (-> rendering-from-multiple-camera-angles-in-unreal-engine)
- Render and Results (-> rendering-from-multiple-camera-angles-in-unreal-engine)

# Meerkat Demo

https://dev.epicgames.com/documentation/en-us/unreal-engine/meerkat-sample-project-for-unreal-engine?application_version=5.9

> How to set up the Meerkat demo, render it with Movie Render Queue, and explore its animation and optimization features

[image: Meerkat Demo]

Real-time rendering technology is an increasingly important tool in the filmmaking process, from previsualization to the final render, as it enables filmmakers to review and iterate on digital scenes and effects very quickly. The **Meerkat Demo** by Weta Digital is a short film rendered entirely in **Unreal Engine**, built to explore the highest level of quality possible while maintaining as fast a rendering speed as possible. With the right graphics card, the Meerkat short will run in real time. This document will guide you through the process of outputting a high-quality render of the Meerkat short yourself using the **Movie Render Queue** plugin.

This sample is available for Unreal Engine 5 and later. Be aware that it is an especially graphically intensive scene, and needs a powerful video card to run at a stable framerate.

## Required Setup

To set up a project with the Meerkat sample, follow these steps:

- Access the Meerkat sample from **Fab** and click **Add to My Library** for the project file to show in the **Epic Games Launcher**.Alternatively, you can search for the sample project using Fab in Launcher, or the Fab plugin for UE.

- From the **Epic Games Launcher**, go to **Unreal Engine > Library > Fab Library** to access the project.Sample projects only appear in **Fab Library** when you install the compatible engine version.
- Click **Create Project** and follow the on-screen instructions to download the sample and start a new project.To learn more about accessing sample content from Fab, see Samples and Tutorials (-> samples-and-tutorials-for-unreal-engine).

- Open your new project in the **Unreal Editor**.
- Open the **Edit** > **Plugins** window and navigate to the **Built-In** > **Rendering** section. Make sure that the **Movie Render Queue** plugin is enabled and, if necessary, restart the editor.[image: Enabling the Movie Render Queue plugin] Enabling the Movie Render Queue plugin. Click the image to enlarge it.

## Viewing the Meerkat Sequence

Once you have loaded Unreal Editor and opened the Meerkat Demo project, go to the **Content Drawer** and double-click **Master_SEQ**.

[image: Master_SEQ location in the content drawer]

This opens **Sequencer** and loads the Master_SEQ level sequence.

[image: The Master_SEQ level sequence loaded in the Sequencer tab] The Master_SEQ level sequence is loaded in the Sequencer tab. Click the image to enlarge it.

You can scrub the timeline through the different shots by clicking on the timeline.

[image: The timeline for Master_SEQ] The timeline for the Master_SEQ level sequence. Click the image to enlarge it.

If you want to be able to see the shots through the cinematic cameras set up in the scene, you can click on the **camera icon** for **Shots**. Your viewport will then look through the camera corresponding to the position of the timeline.

[image: The toggle for Cinematic camera mode in the Sequencer tab] The toggle button for Cinematic camera mode as it appears in the Sequencer tab. Click the image to enlarge it.

You can also change your viewport mode from Perspective to **Cinematic Viewport**.

[image: Changing to Cinematic Viewport Mode using the Viewport controls] Changing to Cinematic Viewport Mode using the Viewport controls. Click the image to enlarge it.

For more information about working with Sequencer, refer to the Sequencer Editor section.

## Optimization Settings

To improve performance, the Meerkat demo uses low-resolution settings by default. If you want the highest-quality visual, there are several optimization settings you can change.

### Toggling High-Resolution Environment Meshes

In the **Outliner**, click the **VisualSettings_BP** Blueprint. In the **Details** tab, under **Default**, you will find the **Highres Env Meshes** setting. Your scene will have improved fidelity with it turned on, but it will run slightly faster with it turned off.

 [image: Highres Meshes Off]

 [image: Highres Meshes On]

Move the slider to compare the scene without high-resolution environment meshes versus with them turned on.

### Changing the Eagle's Groom Resolution

The **Eagle** in the Meerkat demo uses a **Groom** hair asset to represent its feathers. By default, it uses a low-resolution groom to improve performance, but you can change this to a high-resolution asset instead.

- In the **Outliner**, click the **Characters** group, then select **amlEagle_BP** and look at its **Details** tab.
- Select the **Groom** property, which is listed under **amlEagle_BP(self)** in the **Details** tab.[image: The Groom property in the Details tab] You can access the Groom properties from the Details tab. Click the image to enlarge it.
- There are both a **Groom Asset** and **Binding Asset**, and each has a dropdown menu to the right of the icon.Click the **Groom Asset** menu, then change the groom from amlEagle_groomLowRes_r036_GRO to **amlEagle_highRes_GRO**.
- Click the **Binding Asset**, then change it from amlEagle_groomLowRes_r036_GRB to **amlEagle_highRes_GRB**.

 [image: Low-res Groom Asset]

 [image: High-res Groom Asset]

Move the slider to compare the Eagle with low-resolution groom assets versus high-resolution assets. Note the finer detail in the feathers.

For more information about working with Groom assets, refer to the Groom Asset Editor User Guide (-> groom-asset-editor-user-guide-in-unreal-engine).

## Rendering the Meerkat Demo With Movie Render Queue

To render the Meerkat Demo, you need the Movie Render Queue (-> movie-render-pipeline-in-unreal-engine), which is used for outputting high-quality renders of Sequencer movies. Review the steps in Required Setup (-> meerkat-sample-project-for-unreal-engine) to ensure that you have the Movie Render Queue plugin enabled, then follow the steps below to set up a rendering job:

- Launch the Movie Render Queue by selecting **Window** > **Cinematics** > **Movie Render Queue**.[image: Accessing the Movie Render Queue]
- In the top-left corner of the **Movie Render Queue window**, click the **+ Render** button. Select **Master_SEQ** from the dropdown menu.[image: Accessing the Master_SEQ from the + Render dropdown] Accessing Master_SEQ from the + Render dropdown. Click the image to enlarge it. This will add an entry to the Movie Render Queue's list of **jobs** to render.
- In the entry for Master_SEQ, click **Unsaved Config** under the **Settings** column to open the **Settings Window**.[image: Clicking Unsaved Config opens the Settings window.]
- In the Settings Window, click the **Load/Save Presets** dropdown in the top right corner and select the **MoviePipelineConfig_Temporal** preset.[image: Selecting the MoviePipelineConfig_Temporal preset] Selecting the MoviePipelineConfig_Temporal preset and applying it to the shot. Click the image to enlarge it.

You now have the settings needed for rendering the Meerkat demo. In the Settings window, you will see a list along the left side of the window that represents items that have been explicitly set for this project. You can edit these settings to change the output directory for the rendered images, change the type of image that will be saved, or edit post-processing settings. Click the **Accept** button on the bottom right corner to close the window.

[image: Movie Render Queue settings window with the applied settings] The Settings window with the applied settings from MoviePipelineConfig_Temporal. Click the image to enlarge it.

Note: The image above displays a warning icon in the **Settings** window. If you click it, you can see the warning details. The TAA samples in the project are set to 16, but the warning will appear anyway. You can ignore this warning.

To launch the render, click the **Render (Local)** button in the lower-right corner of the Movie Render Queue window.

[image: The Render (Local) button will start rendering your video] Finalized settings in the Movie Render Queue window. Click the image to enlarge it.

A Render Preview window will appear, showing information related to the render.

[image: The render preview for Movie Render Queue] The Movie Render Queue preview window displays information about the rendering progress. Click the image to enlarge it.

For more information about how to use Movie Render Queue, refer to the Movie Render Queue section of the Sequencer workflow guides.

## Adding the Meerkat Control Rig to a Shot

This project includes a **control rig** for the Meerkat, which you can use to explore some keyframe animation inside Unreal Editor. To use this control rig, you need to add the **amlMeerkat_BP** into a shot in Sequencer. The easiest way to do this is to create a new level sequence.

- Select **Cinematics** > **Add Level Sequence**.[image: Add Level Sequence]
- In the **Save Asset As** window, navigate to the **Levels** folder, name the level sequence **MeerkatAnim_SEQ**, then click **Save**. The level sequence you just saved will become the active sequence in Sequencer.[image: Saving the new sequence] Saving the new sequence to use with the Meerkat control rig. Click the image to enlarge it. You can return to the original sequence by locating Master_SEQ in the Content Drawer and double-clicking it.
- In the Content Drawer, open the **Content** > **Assets** > **meerkat** > **Blueprints** folder and locate the **amlMeerkat_BP** asset.[image: The location of the Meerkat control rig asset] The Meerkat control rig asset in the Content Drawer. Click the image to enlarge it.
- Click and drag the **amlMeerkat_BP** asset into **MeerkatAnim_SEQ**.[image: Clicking and dragging the Meerkat control rig asset into the sequence] Clicking and dragging the Meerkat control rig Blueprint into the sequence. Click the image to enlarge it.

You now have a copy of the Meerkat asset with a control rig that you can use in your level sequence.

[image: The Meerkat control rig in the Sequencer timeline] Keyframing the Meerkat control rig in the Sequencer timeline. Click the image to enlarge it.

You can edit its parameters in the timeline or manipulate the control rig directly in the viewport.

[image: The Meerkat control rig visible in the level] Manipulating the control rig in the level viewport. Click the image to enlarge it.

If you are trying to use the Meerkat control rig and you do not have a high-end graphics card, you can turn the visibility of the groom component off to hide the fur, which will improve performance.

To do this, click on the Meerkat in your viewport to display its information in the details panel. Under SkeletalMeshComponent click on Groom(Inherited), scroll down to Rendering, and turn off the Visible flag.

[image: Groom visibility checkbox] Manipulating the control rig in the level viewport. Click the image to enlarge it.

- sequencer
- hair
- groom
- movie render queue
- groom asset

On this page

- Required Setup (-> meerkat-sample-project-for-unreal-engine)
- Viewing the Meerkat Sequence (-> meerkat-sample-project-for-unreal-engine)
- Optimization Settings (-> meerkat-sample-project-for-unreal-engine)
- Toggling High-Resolution Environment Meshes (-> meerkat-sample-project-for-unreal-engine)
- Changing the Eagle's Groom Resolution (-> meerkat-sample-project-for-unreal-engine)
- Rendering the Meerkat Demo With Movie Render Queue (-> meerkat-sample-project-for-unreal-engine)
- Adding the Meerkat Control Rig to a Shot (-> meerkat-sample-project-for-unreal-engine)

# NDI Video I/O Quick Start

https://dev.epicgames.com/documentation/en-us/unreal-engine/ndi-video-io-quick-start-for-unreal-engine?application_version=5.9

> A step-by-step guide to getting video from an NDI source into Unreal Engine, and sending captured video output from Unreal Engine out to an external NDI application.

[image: NDI Video I/O Quick Start]

In this Quick Start guide, we walk through the process of setting up an Unreal Engine Project to work with NDI for both video input and output. At the end of this guide:

- You'll have video input from your NDI source playing inside your Unreal Engine Project.
- You'll be able to capture camera viewpoints both from the Editor and from your runtime application, and send them out as a stream through NDI.

For a working example that shows many of the elements described below put into practice, see theVirtual Studio (-> virtual-studio-sample-project-in-unreal-engine) showcase, available on the Samples tab of the Epic Games Launcher.

**Prerequisites**:

- Make sure that you download and install the NDI Tools from the NDI site.
- Make sure that your NDI source is set up, and that you have some video streaming from it. The NDI Test Patterns are a good starting point.
- Open an Unreal Engine Project that you want to integrate with your video stream. This page shows the steps in an empty Blueprint-enabled project, but the same steps will work equally well in any Project.

The NDI Media components used in this guide are built on top of the Media Framework (-> media-framework-in-unreal-engine), and you'll use Blueprints (-> blueprints-visual-scripting-in-unreal-engine) to script the video capturing process at runtime. Some prior knowledge of these topics is recommended but not required.

## 1 - Set Up the Project

Before you can get video input from your NDI source into your Unreal Engine Level, and stream output from Unreal Engine using NDI, you'll need to do some basic setup to enable the NDI Media Player Plugin in your Project.

### Steps

- Open the Project that you want to use with NDI in the Unreal Editor.
- From the main menu, select **Edit > Plugins**.
- In the Plugins window, find the NDI Media Player plugin under the Media Players category. Check its Enabled checkbox.[image: NDI plugin]
- Find the Media Framework Utilities Plugin under the Media Players category. Check its Enabled checkbox, if it's not already checked.[image: Media Framework Utilities plugin]
- Click **Restart Now** to restart the Unreal Editor and reopen your Project.[image: Restart Unreal Engine]

### End Result

Your Project is now ready to accept video from your NDI source, and to stream rendered output using NDI. In the next sections, you'll set it up and start playing video in and out.

## 2 - Rendering Video Input in Unreal Engine

In this process, you'll make video input from the NDI source visible in the current Level in the Unreal Editor. This process uses a Media Plate (-> the-media-plate-actor-in-unreal-engine) actor, a direct way to show the video input that automatically sets up standard settings which are functional in most cases.

### Steps

- Open the **Content Drawer**, and select the **Content **folder. Right-click, and choose **New Folder** from the context menu. Name your new folder **NDI**.[image: New NDI folder]
- Open your new folder, then right-click and select **Media > NDI Media Source**. [image: New NDI Media Source]
- Your new asset is named automatically by UE, so rename it something descriptive like **NDI_Quick_Start_Source**. [image: Rename NDI Media Source]
- Save your new asset by clicking the **Save All** button in the **Content Drawer**, or by pressing ctrl+S.[image: Save all]
- Double-click your **NDI Media Source** asset to open it in the **Media Editor**. If you only have one NDI source running locally, it is automatically detected as the default media source in the **Configuration **dropdown menu. However, the NDI test pattern doesn't show in the playback window yet.[image: NDI Media Source open in Unreal Editor]
- Click **Open **in the Toolbar to show the media from the NDI source. You now see the NDI test pattern you chose in the playback window. The other settings are fine for the purposes of this quick start. Save and close your Media Source when you're done.For more information on the NDI Media Source settings, refer to the NDI Media Reference (-> ndi-media-reference).[image: Open the NDI test pattern source]
- Go back to the **Content Drawer**, then drag your **NDI Media Source** asset into the level. This automatically creates a **Media Plate** actor connected to your NDI Media Source.[image: Drag NDI Media Source]
- Initially, the Media Plate actor does not show the NDI test pattern. Select the **Media Plate** actor in the **World Outliner** panel, then click **Open Media Plate** in the **Details **panel to open the Media Plate actor in the editor.[image: Media Plate actor before opening media]
- In the editor, click **Open **in the **Toolbar**. The NDI test pattern now appears in the playback window.[image: NDI test pattern in Media Plate actor in the Unreal Editor]
- Return to the Viewport, where your Media Plate actor is now displaying the NDI media in your level.[image: NDI test pattern on Media Plate actor in UE level]

### End Result

At this point, you should have media from an NDI source appearing inside your Unreal Engine level on a Media Plate actor. If you want to modify the display settings of your Media Plate actor, refer to the Media Plate (-> the-media-plate-actor-in-unreal-engine) documentation for more information.

## 3 - Output Captures from the Unreal Editor

In this process, you'll set up an NDI Media Output object, and use the **Media Captures** panel in the Unreal Editor to output the view from selected cameras in the level to an external NDI playback app like NDI Studio Monitor.

### Steps

- Right-click in the **Content Drawer**, and select **Media > NDI Media Output**.[image: Create NDI Media Output]
- Your new asset is named automatically by UE, so rename it something descriptive like **NDI_Quick_Start_Output**.[image: Rename NDI Media Output]
- Double-click your new Asset to open it up for editing. Your Source Name has a default name defined by UE, so change it to something more specific, like **NDI Quick Start**. This name is how the source is designated in the NDI tools. All the other settings are fine as they are for the purposes of this quick start. Save and close your Media Output when you're done.For more information on the NDI Media Output settings, refer to the NDI Media Reference (-> ndi-media-reference).[image: Change NDI Source Name]
- Now you'll place two cameras in the level, to create viewpoints for the output you'll send to the external NDI playback app. In the Place Actors panel, open the Cinematic tab, and drag two instances of the Cine Camera Actor into the Viewport.[image: Place Cine Camera actors]Place the cameras where you want them in the Level, so that they're showing different viewpoints on the scene.Piloting the camera is a fast and easy way to set its viewpoint exactly the way you want it. See Using Editor Viewports (-> using-editor-viewports-in-unreal-engine) for more information.
- From the main menu, select **Window > Virtual Production > Media Capture**. You'll use the **Media Captur**e window to control when the Editor sends output to your NDI external app, and what camera it should use in the level.[image: Media Capture window]
- Under the **Media Viewport Capture** area, find the **Viewport Captures** control. Click the **Add (+)** button to add a new capture to this list.[image: Add a Viewport Capture]
- Expand the new entry. First, add the cameras that you want to capture from. In the **Cameras** array, click the **Add (+)** button to add a new entry.[image: Add a Camera to the array]Then, use the drop-down list to choose one of the cameras you placed in the level.[image: Add a Camera actor to the array] Repeat the same steps to add the other camera to the list.
- Next, set up the output that you want to capture these cameras to. Set the **Media Output** control to point to the new NDI Media Output Asset that you created above. You can do this by selecting it in the drop-down list, or drag your NDI Media Output Asset from the Content Drawer and drop it into this slot.[image: Select the Media Output]
- At the top of the window, click the Capture button.[image: Capture Media button] You'll see a new frame at the bottom of the window that shows a preview of the output being sent to the external NDI output. If you have your external NDI source connected to another playback app or device, you should start to see the output coming through.[image: Camera Viewport Capture]
- Each camera that you added to the Cameras array list for this viewport capture is represented by a corresponding button above the video preview. Click the buttons to switch the capture back and forth between the two views.[image: Swap viewport captures]

### End Result

Now you've set up the Unreal Editor to stream output from cameras in your level to an external NDI playback app. Next, you'll explore how to use Blueprint scripting to do the same thing in a running Unreal Engine project.

[image: UE output playing in the NDI Studio Monitor app]

## 4 - Output Captures at Runtime

The **Media Capture** window that you used in the last section is a practical and easy way to send captures to an external NDI playback app. However, it only works inside the Unreal Editor. To do the same thing when you're running your project as a standalone application, you'll need to use the Blueprint API provided by the Media Output. In this procedure, we'll set up a simple toggle switch in the level Blueprint that starts and stops capturing when the player presses a key on the keyboard.

The Virtual Studio (-> virtual-studio-sample-project-in-unreal-engine)
 showcase, available on the **Samples** tab of the Epic Games Launcher,
contains a UMG interface widget that demonstrates how you could control
capturing from an on-screen user interface.

### Steps

- From the main toolbar in the Unreal Editor, choose **Blueprints > Open Level Blueprint**.[image: Open Level Blueprint]
- Start from the NDI Media Output Asset that you've created. In the **Variables** list in the **My Blueprint** panel, click the **Add (+)** button to add a new variable.[image: Create a new variable]
- In the **Details** panel, set the **Variable Name** to **NDI_Media_Output**, and use the **Variable Type** drop-down list to make it an **NDI Media Output Object Reference**.[image: NDI Media Output Object Reference variable]
- Enable the **Instance Editable** setting (1), and compile the Blueprint. Then, in the **Default Value** section, set the variable to point to the NDI Media Output asset that you created in your Content Drawer (2).[image: Edit the variable settings]
- Press **Ctrl**, and drag the **NDI_Media_Output** from the **Variables** list in the **My Blueprint** panel into the **Event Graph**.[image: Drag variable on to the Event Graph]
- Click and drag from the output port of the **NDI_Media_Output** variable node, and choose **Media > Output > Create Media Capture**.[image: Create Media Capture node] Connect your nodes to the **Event BeginPlay** node as shown below:[image: Connect the Event BeginPlay node] This creates a new Media Capture object from your NDI Media Output. The Media Capture offers two main Blueprint functions that you'll use to control the capturing: **Capture Active Scene Viewport** and **Stop Capture**.
- First, save the new Media Capture object into its own variable, so you can access it again elsewhere. Click and drag from the output port of the **Create Media Capture** node, and choose **Promote to Variable**.[image: Promote to variable] Rename the new variable **Media_Capture** in the Variables list in the My Blueprint panel.[image: Rename the variable]It's important to save the Media Capture to a variable here. If you don't, the Unreal Engine's garbage collector may destroy it automatically before you're done with it.
- Press **Ctrl **and drag the **Media_Capture** variable into the **Event Graph**.[image: Drag Media_Capture variable into the Event Graph]
- Click and drag from the output port of the **Media_Capture** variable node, and choose **Media > Output > Capture Active Scene Viewport**. Do it again, and choose **Media > Output > Stop Capture**.[image: Create Media Output control options]
- Right-click in the **Event Graph** and choose **Input > Keyboard Events > P**. Click and drag from the **Pressed** output of the **P** node and choose **Flow Control > Flip Flop**.[image: Create Keyboard Input P and Flip Flop nodes]
- Connect the **A** output of the **Flip Flop** node to the input event of the **Capture Active Scene Viewport** node, and connect the **B** output of the **Flip Flop** node to the input event of the **Stop Capture** node, as shown below:[image: Connect the Flip Flop node to the Media Output nodes]
- Compile and save the Blueprint, and try playing your Project. Click the arrow next to the Play button in the main Toolbar, and choose either the **New Editor Window (PIE)** or **Standalone Game** option.[image: Select Play mode]Video capture from the Editor will only work when you play your Project in a New Editor Window (PIE) or a Standalone Game. It won't work in the default Selected Viewport mode, or in Simulate mode. In addition, the viewport resolution of your project (that is, the size of the rendered image the Unreal Engine generates each frame) must match the output resolution set in the active Media Profile, so that it will be the right size for the output video feed.After your project starts up, you should be able to press the P button on your keyboard to toggle sending the output from the engine to the external NDI app.

### End Result

At this point, you should have a basic idea of how to work with NDI Media Source assets, NDI Media Output assets, and the Media Capture system, and you should understand how all of these elements work together to send and receive video using NDI and Unreal Engine.

## On Your Own

Now that you've seen the basics of how to get a new Project exchanging video input and output with NDI tools, you can continue learning on your own:

- Explore the Virtual Studio (-> virtual-studio-sample-project-in-unreal-engine) showcase to see what it adds to this basic setup, like its on-screen UI that switches cameras and controls video capture at runtime.

- getting started
- vfx
- professional video

On this page

- 1 - Set Up the Project (-> ndi-video-io-quick-start-for-unreal-engine)
- Steps (-> ndi-video-io-quick-start-for-unreal-engine)
- End Result (-> ndi-video-io-quick-start-for-unreal-engine)
- 2 - Rendering Video Input in Unreal Engine (-> ndi-video-io-quick-start-for-unreal-engine)
- Steps (-> ndi-video-io-quick-start-for-unreal-engine)
- End Result (-> ndi-video-io-quick-start-for-unreal-engine)
- 3 - Output Captures from the Unreal Editor (-> ndi-video-io-quick-start-for-unreal-engine)
- Steps (-> ndi-video-io-quick-start-for-unreal-engine)
- End Result (-> ndi-video-io-quick-start-for-unreal-engine)
- 4 - Output Captures at Runtime (-> ndi-video-io-quick-start-for-unreal-engine)
- Steps (-> ndi-video-io-quick-start-for-unreal-engine)
- End Result (-> ndi-video-io-quick-start-for-unreal-engine)
- On Your Own (-> ndi-video-io-quick-start-for-unreal-engine)

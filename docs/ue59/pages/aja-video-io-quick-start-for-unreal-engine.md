# AJA Video I/O Quick Start

https://dev.epicgames.com/documentation/en-us/unreal-engine/aja-video-io-quick-start-for-unreal-engine?application_version=5.9

> A step-by-step guide to getting video from a supported AJA media card into the Unreal Engine, and sending captured video output from the Unreal Engine out to a port on the AJA card.

[image: AJA Video I/O Quick Start]

In this Quick Start guide, we walk through the process of setting up an Unreal Engine Project to work with a professional video card from AJA Video Systems. At the end of this guide:

- You'll have video input from your AJA card playing inside your Unreal Engine Project.
- You'll be able to capture camera viewpoints both from the Editor and from your runtime application, and send them out to an SDI port on your AJA card.
- You'll know where to go when you want to set up more advanced adjustments to your video inputs, such as correcting lens deformation and applying chroma-keying effects.

For a working example that shows many of the elements described below put into practice, see the **Virtual Studio (-> virtual-studio-sample-project-in-unreal-engine)** showcase, available on the Samples tab of the Epic Games Launcher.

**Prerequisites:**

- Make sure that you have a supported card from AJA Video Systems, and that you've installed the necessary drivers and software. For details, see the AJA Media Reference (-> aja-media-reference-for-unreal-engine) page.
- Make sure that your card is working correctly, and that you have some video input feeding in to at least one of the card's SDI ports.
- Open an Unreal Engine Project that you want to integrate with your video feeds. This page shows the steps in the **Third Person** Blueprint template, but the same steps will work equally well in any Project.

The AJA Media components used in this guide are built on top of the Media Framework (-> media-framework-in-unreal-engine), and we'll use Blueprints (-> blueprints-visual-scripting-in-unreal-engine) to script the video capturing process at runtime. Some prior knowledge of these topics is recommended but not required.

## 1 - Set Up the Project

Before you can get video input from your AJA card into your Unreal Engine Level, and send output from Unreal Engine through one of your AJA card's SDI ports, you'll need to do some basic setup to enable the AJA Media Player Plugin in your Project.

If you started your Unreal Engine Project from one of the Templates in the **Film, Television, and Live Events** category, the necessary plugins may already be enabled for you. If not, follow the instructions below to enable them.

### Steps

- Open the Project that you want to use with AJA video I/O in the Unreal Editor.
- From the main menu, select **Edit > Plugins**.
- In the **Plugins** window, find the **AJA Media Player** plugin under the **Media Players** category. Check its **Enabled** checkbox.[image: Enable the AJA Media Player Plugin] Click image to expand.
- Find the **Media Framework Utilities** Plugin under the **Media Players** category. Check its **Enabled** checkbox, if it's not already checked.[image: Enable the Media Framework Utilities Plugin] Click image to expand.
- Click **Restart Now** to restart Unreal Engine and reopen your Project.[image: Restart Now] Click image to expand.

### End Result

Your Project is now ready to accept video from the AJA card, and to send rendered output to the card. In the next sections, we'll hook it up and start playing video in and out.

## 2 - Rendering Video Input in Unreal Engine

In this process, we'll make video input from the AJA card visible in the current Level in the Unreal Editor. This process uses a Media Bundle: a kind of Asset that packages together several different types of Assets involved in the Media Framework, and that offers you control over some advanced features like lens deformation, chroma-keying, color correction, and more.

### Steps

- In your **Content Browser**, expand the **Sources** panel. Right-click, and choose **New Folder** from the context menu. Rename your new folder **AJA**.
- Open your new folder, right-click in the **Content Browser** and choose **Media > Media Bundle**.[image: New Media Bundle]
- Your new Asset's name is automatically selected in the Content Browser, so you can give it a descriptive name:[image: Name the Media Bundle]Type a new name, like **AjaMediaBundle**, and press **Enter**. A new folder of Media Framework Assets is automatically created next to your Media Bundle, named with the suffix **_InnerAssets**.
- Save your new Assets by clicking the **Save All** button in the **Content Browser**.[image: Save All Assets]
- Double-click your new Media Bundle to edit its properties. The Media Bundle is capable of playing video from any kind of media source the Engine supports, so you'll need to tell it that you want to get the video from your AJA card.In the **Media Source** property, select **Aja Media Source** from the drop-down list:[image: Set the AJA Media Source] Click image to expand.
- Once you've identified the type of Media Source you want the Media Bundle to handle, you can then set up any configuration properties offered by that type of source.You can make Unreal Engine automatically match the format and framerate of the incoming video signal. To enable automatic format detection, click the **Configuration** dropdown, enable **Auto**, and then click **Apply**. The engine now seamlessly handles changes and restarts automatically if the signal is temporarily lost.[image: Aja Media Source Configuration] Click image to expand. The options you see may vary depending on the devices you have installed. For details on all of the properties you can set for an AJA Media Source, see the AJA Media Reference (-> aja-media-reference-for-unreal-engine) page.
- If you want to apply any compensation to the incoming video to account for lens distortion, you can set up the physical properties of the lens in the **Lens Parameters** section. [image: Lens undistortion parameters] Click image to expand. These **Lens Parameters** just set up the physical properties of the lens. You'll actually activate the lens compensation later, when you edit the Material Instance used by the Media Bundle. Save your Media Bundle when you're done setting up its properties, and return to the **AJA** folder in the Content Browser.
- Drag your **AjaMediaBundle** Asset from the Content Browser into the Level Viewport.[image: Drag and drop the Media Bundle] Click image to expand. You'll see a new plane appear, showing the video currently being played over the port configured for your Media Bundle. Use the transform tools in the Viewport toolbar to move, rotate, and resize it. If your Media Bundle doesn't start playing automatically, select it, then click the **Media Bundle > Request Play Media** button in the **Details** panel.[image: Request Play Media]
- Now, we'll see how to apply keying and compositing effects to the video stream. Back in the Media Bundle Editor, click the **Open Material Editor** button in the Toolbar to edit the Material Instance that this Media Bundle uses to draw its incoming video feed on to an object in the Level.[image: Open Material Editor]This Material Instance is saved inside the **AjaMediaBundle_InnerAssets** folder that was created automatically with your Media Bundle.[image: Material Instance] Click image to expand.
- In the Material Instance Editor, you'll see a number of properties exposed for you to configure keying, cropping, and color correction, and to activate the correction for the lens distortion that you set up in the Media Bundle.[image: Material Instance Editor] Click image to expand. While you adjust the settings in the Material Instance Editor, you can see the effect of your changes on the video feed playing back in the main Level Viewport. You may find it more convenient to see the effects of the changes you make in the preview panel of the Material Instance Editor instead. To do this, temporarily enable the **IsValid** setting, and set its value to `1.0`. [image: IsValid] Click the arrow at the top left of the Viewport toolbar, and enable the **Realtime** option in the menu. [image: Realtime Viewport]You'll be able to judge the effect of your changes more easily by changing the preview mesh to a plane or a cube. Use the controls at the bottom of the Viewport:[image: Preview mesh] When you're done, return the **IsValid** setting to its previous value.
- When you're done changing the Material Instance properties, click the **Save** button in the Toolbar.

### End Result

At this point, you should have video playing over an SDI port showing up inside your Unreal Engine Level, and you should understand where to set up more advanced features like lens deformation and chroma-keying.

If you're already familiar with the Media Framework, another way you could get video into your Level is to create a new **AjaMediaSource** Asset in your Project, and set it up with the same source properties you set up inside the Media Bundle in the procedure above. Then, create your own **MediaPlayer** and **MediaTexture** Assets to handle the playback of that source in your Level. For details, see the Media Framework (-> media-framework-in-unreal-engine) documentation. However, we recommend using the Media Bundle, as shown above, to get the best balance between ease of use and professional quality video features.

## 3 - Output Captures from the Unreal Editor

In this process, you'll set up an AJA Media Output object, and use the **Media Captures** panel in the Unreal Editor to output the view from selected cameras in the Level to your AJA card.

### Steps

- Right-click in the Content Browser, and select **Media > Aja Media Output**. [image: New AJA Media Output] Click image to expand. Name your new Asset **AjaMediaOutput**.
- Double-click your new Asset to open it up for editing. Just like when you created your Aja Media Source, you have to set up the **Configuration** property to control the properties of the video feed that the Unreal Engine sends to your AJA card. Click the arrow to open the submenu, select the options that match your video setup, then click **Apply** in the submenu.[image: Aja Media Output Configuration] Click image to expand. For details on all of the properties you can set in the AJA Media Output, see the AJA Media Reference (-> aja-media-reference-for-unreal-engine) page. Save and close your Media Output when you're done.
- Now we'll place two cameras in the Level, to give us viewpoints for the output we'll send to the AJA card. In the **Place Actors** panel, open the **Cinematic** tab, and drag two instances of the **Cine Camera Actor** into the Viewport.[image: Drag and drop Cine Camera Actors]Place the cameras where you want them in the Level, so that they're showing different viewpoints on the scene.**Piloting** the camera is a fast and easy way to set its viewpoint exactly the way you want it. See Pilot Actors in the Viewport (-> using-editor-viewports-in-unreal-engine).
- From the main menu, choose **Window > Virtual Production > Media Capture**. You'll use the **Media Capture** window to control when the Editor sends output to your AJA port, and what camera it should use in the Level.[image: Media Capture window]
- Under the **Media Viewport Capture** area, find the **Viewport Captures** control. Click the **Add (+)** button to add a new capture to this list.[image: Add a viewport capture]
- Expand the new entry. First, we'll add the cameras that we want to capture from. In the **Locked Camera Actors** control, click the **Add (+)** button to add a new entry.[image: Add a camera actor]Then, use the drop-down list to choose one of the cameras you placed in the Level.[image: Select the camera actor]Repeat the same steps to add the other camera to the list.
- Now, set up the output that you want to capture these cameras to. Set the **Media Output** control to point to the new AJA Media Output Asset that you created above. You can do this by selecting it in the drop-down list, or drag your AJA Media Output Asset from the Content Browser and drop it into this slot.[image: Set the AJA Media Output]
- At the top of the window, click the **Capture** button.[image: Start capturing]You'll see a new frame at the bottom of the window that shows a preview of the output being sent to the AJA card. If you have this port hooked up to another downstream device, you should start to see the output coming through.[image: Active Media Capture]
- Each camera that you added to the Locked Camera Actors list for this viewport capture is represented by a corresponding button above the video preview. Click the buttons to switch the capture back and forth between the two views.[image: Switch Cameras] Click image to expand.

### End Result

Now you've set up the Unreal Editor to stream output from cameras in your Level to a port on your AJA card. Next, we'll see how to use Blueprint scripting to do the same thing in a running Unreal Engine Project.

## 4 - Output Captures at Runtime

The **Media Capture** window that you used in the last section is a practical and easy way to send captures to the AJA card. However, it only works inside the Unreal Editor. To do the same thing when you're running your Project as a standalone application, you'll need to use the Blueprint API provided by the Media Output. In this procedure, we'll set up a simple toggle switch in the Level Blueprint that starts and stops capturing when the player presses a key on the keyboard.

The **Virtual Studio (-> virtual-studio-sample-project-in-unreal-engine)** showcase, available on the **Samples** tab of the Epic Games Launcher, contains a UMG interface widget that demonstrates how you could control capturing from an on-screen user interface.

### Steps

- From the main toolbar in the Unreal Editor, choose **Blueprints > Open Level Blueprint**.[image: Open Level Blueprint]
- We'll need to start from the AJA Media Output Asset that you've created, where you identify the port you want to output to. In the **Variables** list in the **My Blueprint** panel, click the **Add (+)** button to add a new variable.[image: New Variable]
- In the **Details** panel, set the **Variable Name** to **AjaMediaOutput**, and use the **Variable Type** drop-down list to make it an **Aja Media Output Object Reference**.[image: Aja Media Output Object Reference]
- Enable the **Instance Editable** setting (1), and compile the Blueprint. Then, in the **Default Value** section, set the variable to point to the AJA Media Output Asset that you created in your Content Browser (2).[image: Set the default value]
- Press **Ctrl**, and drag the **AjaMediaOutput** from the Variables list in the **My Blueprint** panel into the **Event Graph**.[image: Control+drag the AjaMediaOutput]
- Click and drag from the output port of the **AjaMediaOutput** variable node, and choose **Media > Output > Create Media Capture**. [image: Create Media Capture]Hook up your nodes to the **Event BeginPlay** node as shown below:[image: Event Begin Play]This creates a new Media Capture object from your Aja Media Output. The Media Capture offers two main Blueprint functions that we'll use to control the capturing: **Capture Active Scene Viewport** and **Stop Capture**.
- First, we'll save the new Media Capture object into its own variable, so we can get access to it again elsewhere. Click and drag from the output port of the **Create Media Capture** node, and choose **Promote to Variable**.[image: Promote to variable]Rename the new variable **MediaCapture** in the Variables list in the **My Blueprint** panel.It's important to save the Media Capture to a variable here. If you don't, the Unreal Engine's garbage collector may destroy it automatically before you're done with it.
- Press **Ctrl** and drag the **MediaCapture** variable into the **Event Graph**.[image: Control+drag the MediaCapture]
- Click and drag from the output port of the **MediaCapture** variable node, and choose **Media > Output > Capture Active Scene Viewport**. Do it again, and choose **Media > Output > Stop Capture**.[image: Start and stop the capture]
- Right-click in the **Event Graph** and choose **Input > Keyboard Events > P**. Click and drag from the **Pressed** output of the **P** node and choose **Flow Control > FlipFlop**. [image: FlipFlop]
- Connect the **A** output of the **FlipFlop** node to the input event of the **Capture Active Scene Viewport** node, and connect the **B** output of the **FlipFlop** node to the input event of the **Stop Capture** node, as shown below: [image: Connect the nodes]
- Compile and save the Blueprint, and try playing your Project. Click the arrow next to the Play button in the main Toolbar, and choose either the **New Editor Window (PIE)** or **Standalone Game** option. [image: Launch the Project]

Video capture from the Editor will only work when you play your Project in a **New Editor Window (PIE)** or a **Standalone Game**. It won't work in the default **Selected Viewport** mode, or in **Simulate** mode.
 In addition, the viewport resolution of your Project (that is, the size of the rendered image the Unreal Engine generates each frame) must match the output resolution set in the active Media Profile, so that it will be the right size for the output video feed.

After your project starts up, you should be able to press the **P** button on your keyboard to toggle sending the output from the Engine to the AJA card.

### End Result

At this point, you should have a basic idea of how to work with Aja Media Sources, Media Bundles, and the Media Capture system, and you should understand how all of these elements work together to get professional video in and out of the Unreal Engine.

## On Your Own

Now that you've seen the basics of how to get a new Project exchanging video input and output with an AJA card, you can continue learning on your own:

- Explore the in-engine keying solution in the Material Instance created by your Media Bundle. Try passing some green-screen video into your card's input port, and use the keying controls in the Material Instance to remove the background.
- Explore the **Virtual Studio (-> virtual-studio-sample-project-in-unreal-engine)** showcase to see what it adds to this basic setup, like its on-screen UI that switches cameras and controls video capture at runtime.

- getting started
- vfx
- professional video

On this page

- 1 - Set Up the Project (-> aja-video-io-quick-start-for-unreal-engine)
- Steps (-> aja-video-io-quick-start-for-unreal-engine)
- End Result (-> aja-video-io-quick-start-for-unreal-engine)
- 2 - Rendering Video Input in Unreal Engine (-> aja-video-io-quick-start-for-unreal-engine)
- Steps (-> aja-video-io-quick-start-for-unreal-engine)
- End Result (-> aja-video-io-quick-start-for-unreal-engine)
- 3 - Output Captures from the Unreal Editor (-> aja-video-io-quick-start-for-unreal-engine)
- Steps (-> aja-video-io-quick-start-for-unreal-engine)
- End Result (-> aja-video-io-quick-start-for-unreal-engine)
- 4 - Output Captures at Runtime (-> aja-video-io-quick-start-for-unreal-engine)
- Steps (-> aja-video-io-quick-start-for-unreal-engine)
- End Result (-> aja-video-io-quick-start-for-unreal-engine)
- On Your Own (-> aja-video-io-quick-start-for-unreal-engine)

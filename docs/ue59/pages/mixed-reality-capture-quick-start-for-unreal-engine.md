# Mixed Reality Capture Quick Start

https://dev.epicgames.com/documentation/en-us/unreal-engine/mixed-reality-capture-quick-start-for-unreal-engine?application_version=5.9

> A walkthrough of setting up and using the Mixed Reality Capture feature.

[image: Mixed Reality Capture Quick Start]

Learn to use this **Beta** feature, but use caution when shipping with it.

 [image: MR_RoboRecall.png]

At the end of this tutorial, you will have setup and calibrated your system for Mixed Reality Capture (MRC).

## 1 - Setting up Green Screen and Camera

Before you can take a capture, you will need the right equipment for the job. Here is a quick overview of the equipment you will need, and some tips on how to set it up.

- **Video Camera** UE5 only supports a very specific set of video capture devices; see Supported Video Devices (-> supported-video-devices-for-mixed-reality-capture-in-unreal-engine) for the current list of the supported devices. Using a device from the list, connect it to your PC for streaming.

- **Chroma backdrop** For chroma keying, we generally use a green screen. When setting up the green screen, you will want to make sure it's taut, minimizing any wrinkles, especially behind your subject. If you are setting up lighting, you will want to make sure not to cast shadows directly behind the subject. You want a smooth, flat color. The more shades of green that there are across the backdrop, the harder it is to chroma key. It helps if the subject is far away from the backdrop as possible. If you plan on filming the subject's feet, consider a green screen for the floor as well.

- **Camera Mount** For the initial setup (calibration), your camera needs to be static. If you are using a webcam, this may be as simple as attaching it to your desk/monitor. Another option is to mount the camera to a tripod.

- **Multi-Mount + Tracker (Optional)** If you plan on moving the camera around while filming, you will want to attach a tracking device to the camera, such as an HTC Vive Tracker. In addition, connect the camera and tracker together with a multi mount, so that they stay firmly locked in place.

## 2 - Calibrating Physical and Virtual Cameras

Once you have your physical space and equipment set up, you are ready to run through calibration. At runtime, the game needs to know where your camera is in relation to your virtual scene. The configuration is different for each setup, which is why you need to run through a calibration process. To simplify calibration, we've created a standalone calibration tool (MRCalibration.exe), which can be downloaded here.

The calibration process is complicated, so we've created a separate How To Use The Mixed Reality Capture Calibration Tool (-> how-to-use-the-mixed-reality-capture-calibration-tool-in-unreal-engine) topic that contains detailed instructions on using the calibration tool.

When the calibration process is complete, the calibration tool will generate a calibration settings file (MrcCalibration.sav). The calibration settings file (MrcCalibration.sav) file can be found in the calibration tool's /Saved/SaveGames/ folder. This settings file will be used by the game when starting a Mixed Reality Capture. As long as your physical setup stays the same, you don't need to rerun the calibration process. You can use the same calibration settings file across multiple games.

If you have a camera with an adjustable lens, be careful not to adjust the zoom after you've completed calibration. Adjusting the zoom will change the physical camera's field-of-view (FOV), but not the virtual one. The virtual camera will use the FOV that was used during calibration. If you adjust the camera's zoom after calibration, you will need to repeat the calibration process.

## 3 - Adding the Calibration File to Your Game Project

In the last step, we covered how to use the MRC Calibration Tool to produce a MrcCalibration.sav file. Once you have a MrcCalibration.sav file, copy it into your game's /Saved/SaveGames/ folder. If your game doesn't have a SaveGames directory yet, you will need to create it manually.

If you have the Mixed Reality Capture Framework plugin enabled in your game, it checks for a calibration settings file on startup.

## 4 - Enabling the Mixed Reality Capture Framework Plugin

Integrating the Mixed Reality Capture (MRC) framework into your project is as easy as enabling the Mixed Reality Capture framework plugin. With the MRC plugin enabled and the calibration settings file in place, the game should start in MRC mode and display the composited scene to the spectator window.

By default, MRC broadcasting uses the VR Spectator Screen (-> virtual-reality-spectator-screen-in-unreal-engine) to display the composited scene. If the game isn't in VR mode, then the Mixed Reality capture will not be displayed. The MRC plugin is capturing; it's just not displaying.

Mixed Reality captures are supported both in the editor (VR PIE) and in packaged projects, as long as the MRC plugin is enabled.

- Under the **Edit** menu, select **Plugins**. Click image to expand.

- Use the Search bar to find the Mixed Reality Capture Framework plugin.

- Click the **Enabled** checkbox, then click **Yes** on the warning pop-up. Click image to expand.

- Unreal Editor must be restarted to compelte the process of enabling the plugin. Click image to expand.

#### Starting in MRC Mode

When the MRC plugin starts up, it checks for a calibration settings file (MrcCalibration.sav) in the game's /Saved/SaveGames/ folder. If the MRC plugin does not find a calibration settings file, it will not start in MRC mode. Below is a diagram showing how the game determines whether to start in MRC mode or not.

## 5 - Recording the Mixed Reality Capture

The MRC framework does not record a video of the capture. The MRC framework handles compositing the scene and outputting that to the display window. You must use 3rd party software, like OBS or Nvidia ShadowPlay to record the capture.

## 6 - On your own!

The hardest part of creating a Mixed Reality Capture is properly calibrating. Once you've done that, you can keep reusing the calibration file. It's as simple as copying a file and running!

If your equipment setup changes, you will need to recalibrate using the Mixed Reality Capture Calibration Tool again.

- beta
- basics/gettingstarted
- mr
- virtual sets

On this page

- 1 - Setting up Green Screen and Camera (-> mixed-reality-capture-quick-start-for-unreal-engine)
- 2 - Calibrating Physical and Virtual Cameras (-> mixed-reality-capture-quick-start-for-unreal-engine)
- 3 - Adding the Calibration File to Your Game Project (-> mixed-reality-capture-quick-start-for-unreal-engine)
- 4 - Enabling the Mixed Reality Capture Framework Plugin (-> mixed-reality-capture-quick-start-for-unreal-engine)
- Starting in MRC Mode (-> mixed-reality-capture-quick-start-for-unreal-engine)
- 5 - Recording the Mixed Reality Capture (-> mixed-reality-capture-quick-start-for-unreal-engine)
- 6 - On your own! (-> mixed-reality-capture-quick-start-for-unreal-engine)

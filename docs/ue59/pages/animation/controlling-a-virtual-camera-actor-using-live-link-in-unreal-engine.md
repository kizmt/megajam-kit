# Controlling a Virtual Camera Actor using Live Link

https://dev.epicgames.com/documentation/en-us/unreal-engine/controlling-a-virtual-camera-actor-using-live-link-in-unreal-engine?application_version=5.9

> Use the sample Virtual Camera Actor, driven by Live Link, to control a Cine Camera Actor.

[image: Controlling a Virtual Camera Actor using Live Link]

The **Virtual Camera** Actor is a camera placed in your Unreal Engine scene that you can use to stream data from a Live Link-connected device. The Live Link-connected device can be used to view and move around the scene and to set up and record shots. This user guide will show you how to use virtual cameras in your project and the different parts of the Unreal VCam app.

## Required Setup

To use Virtual Cameras, you must set up and configure your Unreal Engine project before setting up and connecting your Live Link-enabled device.

### Unreal Engine Setup

Enable the following plugins from the **Plugins** browser found in the **Edit** menu:

- **VirtualCamera**This plugin enables controlling and viewing of cameras with physical devices.

- **Live Link**This plugin enables streaming of animated data into Unreal Engine. For more information, see Live Link (-> live-link-in-unreal-engine).

- **Take Recorder**This is a suite of tools and interfaces designed for recording, reviewing and playing back takes in a virtual production environment. For more information, see Take Recorder (-> take-recorder-in-unreal-engine) and Using Take Recorder (-> record-gameplay-in-unreal-engine).

Features such as Live Link and Take Recorder with Sequencer are larger topics than this page covers. We suggest spending time familiarizing yourself with these features and their use cases. See their linked documentation above.

### Device Setup

Before you can start, you must have a compatible iOS or Android device, and you must download the **Unreal VCam** app from the App Store or Google Play Store.

**iOS Device System Requirements:**

- iOS 15.0 and later
- iPadOS 15.0 and later
- Support for ArKit

**Android Device System Requirements:**

- Android 24 (Nougat) or higher
- ARCore Support

When you open the app for the first time, you must accept the license agreement to use the app. No further setup is needed at this time.

### Optional Prerequisite for this Guide

The **Meerkat Demo** sample project is a real-time short film developed by Weta Digital and rendered entirely in Unreal Engine. This is a project well-suited to test out some of the capabilities of using virtual cameras in a project. This guide uses the sample project for demonstration for setup and usage in a virtual production environment.

You can download the project from Fab or you can download it directly from the Epic Games Launcher in the **Samples** tab.

You can learn more specifics about the sample project by visiting the Meerkat Demo documentation.

## Preparing a Scene for Virtual Cameras

To prepare your project to use a virtual camera setup, you must first prepare your scene in Unreal Engine, and then set up your iOS or Android mobile device to interact with it.

**Unreal Engine scene setup:**

To set up your Unreal Engine scene:

- Navigate to the **Place Actors** panel, and enter "**VCAM**" into the search field, or select the **Virtual Production** icon.For newly created projects, the **Place Actors** panel is not displayed by default in Unreal Engine. If you do not see one, navigate to the **Windows** menu and click on **Place Actors** to open one.
- Click and drag a **VCam Actor** into the scene.

Immediately upon dragging a VCam Actor into the scene, the viewport changes to automatically pilot the virtual camera. Your viewport should look like the image below.

[image: image alt text]

Next, you'll connect your mobile device to the Unreal Editor to drive a virtual camera placed in the scene.

**Mobile device setup:**

To set up your device:

- Connect your mobile device to the same network the machine running your project is using.
- In the **Unreal Editor**, click the **Pixel Streaming** dropdown menu in the toolbar. Under the **Signaling Server URLs** section of the menu, you should see at least two IP addresses. Enter the one sharing the same network (for instance 192.x.x.x) as your device into the Unreal VCam app.
- On your device, open the **Unreal VCam** app. Using the IP address that matches your shared network, enter the IP address into the text field in the app.
- Click **Connect**.

You may see two Pixel Streaming dropdowns, depending on your current configuration. Virtual Camera does not currently support Pixel Streaming 2. Only refer to the “Pixel Streaming” dropdown and not the “Pixel Streaming 2” dropdown when working with Virtual Camera.

If your scene has a single virtual camera, your mobile device automatically connects to that VCam Actor. However, if you have multiple virtual cameras in the scene, you must select one to connect to. See Using Multiple Virtual Cameras (-> using-multiple-virtual-cameras-in-unreal-engine) for more information on setting up and using multiple cameras in your project.

Your mobile device should now be connected to a virtual camera placed in your Unreal Editor scene. You should also have control of the virtual camera from your mobile device, and be able to move around to change the view. You should also have access to the Unreal VCam interface on your mobile device and from the Unreal Editor viewport. The VCam interface contains many controls for managing the look and behavior of virtual cameras in the scene.

[image: image alt text]

## Controlling Inputs to Virtual Camera Controls

The Enhanced Input feature of Unreal Engine is capable of managing a large number of actions and changing them dynamically. Inputs can change behavior depending on their current state. This means that you can assign more mappable keys than there are buttons for in the user interface. In this case, it's ideal for mapping inputs of hardware devices to virtual camera controls in Unreal Engine through the VCam app.

You can add and configure mapped inputs in two ways:

- In the **Project Settings** under the **VCam Input Settings**
- From the **Details Panel **of the VCam Component under the **Input Profile **section.

For more information on setting up and using Enhanced Inputs, see Controlling Inputs to Virtual Camera Controls (-> controlling-inputs-to-virtual-camera-controls-in-unreal-engine).

## Virtual Camera Interface

The Virtual Camera's **Controller Interface** features a range of controls and settings. You can use these settings to modify the look and behavior of a virtual camera in Unreal Engine through an external device. For example, you can use an ARKit-enabled iOS device to make modifications. The ARKit features enable physical position and rotation of your device to move and control the virtual camera's position and rotation in your project in real time.

[image: image alt text]

The Virtual Camera Actor includes the following:

- Camera and Device Information
- Virtual Camera Settings
- Unreal VCam App Settings
- Sequencer and Bookmarks Settings

## Adjusting Settings Dials

The majority of configurable settings within the Unreal VCam app use radial dials. These dials can be located on either side of the interface. They sometimes include an inner and outer dial. To select an option, you can drag your finger along the dial in either direction, and dial in your desired values. Changes made with the dials are reflected in real-time in Unreal Engine.

## Navigating the Virtual Scene with the Unreal VCam App

The Unreal VCam app provides a full range of motion tracking in a physical space using ARKit. ARKit does this by streaming out positional and rotational data live to an Unreal Engine instance with Live Link over a network. With the app, you can drive the 3D camera within the real-time environment and visualize the shot on a supported mobile device.

Additionally, touch screen joysticks provide manual controls for navigating the scene using the Unreal VCam app. Movement using the joysticks is layered on top of any motion tracked movement through ARKit.

[image: image alt text]

### Moving Around With an ARKit-enabled Device

With an ARKit-enabled device, you can move freely within a space, and that movement translates to the Unreal Engine instance running your project. Your tracked movements include being able to fully tilt, pan, and roll your device, and move around in the space in any direction.

Motion tracked through Live Link happens automatically, and syncs with your 3D camera in Unreal Engine. This means you can set up shots using the app, including previs shots before a shoot, capturing real takes during principal photography, and creating a new shot in post production.

The Unreal VCam app includes settings to scale how movement translates to the 3D scene with motion tracking. To learn about how you can adjust these settings, see Unreal VCam Virtual Camera Settings (-> unreal-vcam-virtual-camera-settings).

### Moving With Touch Screen Joysticks

You can manually move the Virtual Camera actors in the scene using touch screen joysticks on your Live Link-connected device. You can use the joysticks for directional movement, vertical-only movement, and panning of the camera.

The Unreal VCam app includes settings to adjust the sensitivity and scale of movement in the Live Link-connected device. To learn about how you can adjust these settings, see Unreal VCam Virtual Camera Settings (-> unreal-vcam-virtual-camera-settings).

## Camera Information

The top-most section of the Virtual Camera actor provides quick reference information for configured camera settings.

[image: image alt text]

In the graphic above, the numbers correspond to the following:

- Quick reference and action for configured camera settings.
- Timestamp and film frames per second.
- Quick Action buttons for toggling Camera BehaviorManual and Tracking Focus
- Focus Peaking
- Exposure Zebra Striping
- Hold Position
- Local Space Flight Mode
- Kill Roll

### Quick Access to Virtual Camera Settings and Reference

On either side of the Virtual Camera actor is the configured settings for the camera. Tapping on any of these settings directly opens its adjustable dial within the Unreal VCam app.

[image: image alt text]

The adjustable settings include:

- Lens Size
- FIlmback Size
- Mask Size
- Toggle Camera UI
- ISO
- Focus Distance
- Iris F-Stop
- Shutter Speed

### Accessing and Sharing the Output Log

You can access and share the Output Log to view detailed information about your Vcam session in order to identify and troubleshoot any potential problems you encounter.

To access the Output Log:

- In the top-right corner of the Unreal VCam app, tap the **Gear** icon to open the settings.
- Tap **Application Log **to view the available logs.
- Tap a log to open the **Log Viewer. **The log marked (Current) is the log for the active session.

[image: image alt text]

[image: image alt text]

[image: image alt text]

[image: image alt text]

To share the output log, click the **Share** icon in the log to save and send the log.

[image: image alt text]

- getting started
- virtual camera
- working with media

On this page

- Required Setup (-> controlling-a-virtual-camera-actor-using-live-link-in-unreal-engine)
- Unreal Engine Setup (-> controlling-a-virtual-camera-actor-using-live-link-in-unreal-engine)
- Device Setup (-> controlling-a-virtual-camera-actor-using-live-link-in-unreal-engine)
- Optional Prerequisite for this Guide (-> controlling-a-virtual-camera-actor-using-live-link-in-unreal-engine)
- Preparing a Scene for Virtual Cameras (-> controlling-a-virtual-camera-actor-using-live-link-in-unreal-engine)
- Controlling Inputs to Virtual Camera Controls (-> controlling-a-virtual-camera-actor-using-live-link-in-unreal-engine)
- Virtual Camera Interface (-> controlling-a-virtual-camera-actor-using-live-link-in-unreal-engine)
- Adjusting Settings Dials (-> controlling-a-virtual-camera-actor-using-live-link-in-unreal-engine)
- Navigating the Virtual Scene with the Unreal VCam App (-> controlling-a-virtual-camera-actor-using-live-link-in-unreal-engine)
- Moving Around With an ARKit-enabled Device (-> controlling-a-virtual-camera-actor-using-live-link-in-unreal-engine)
- Moving With Touch Screen Joysticks (-> controlling-a-virtual-camera-actor-using-live-link-in-unreal-engine)
- Camera Information (-> controlling-a-virtual-camera-actor-using-live-link-in-unreal-engine)
- Quick Access to Virtual Camera Settings and Reference (-> controlling-a-virtual-camera-actor-using-live-link-in-unreal-engine)
- Accessing and Sharing the Output Log (-> controlling-a-virtual-camera-actor-using-live-link-in-unreal-engine)

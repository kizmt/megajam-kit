# Virtual Cameras

https://dev.epicgames.com/documentation/en-us/unreal-engine/virtual-cameras-in-unreal-engine?application_version=5.9

> Control Cameras inside Unreal Engine by using a modular component system to manipulate and output Camera data.

[image: Virtual Cameras]

A **Virtual Camera** drives a **Cine Camera** in **Unreal Engine** by using a modular component system to manipulate camera data and output the final results to a variety of external output devices. In addition, the Virtual Camera system provides its functionality while in the **editor** and during **Play In Editor (PIE)** or **Standalone Game** mode.

The **Virtual Camera Component (VCamComponent)** is the base component that enables building custom virtual cameras in Unreal Engine. With the VCamComponent, a user can drive a Cine Camera inside Unreal Engine by adding custom **Modifiers** and **Output Providers**. The Modifiers manipulate the camera data with custom effects such as filtering, tracking, and auto focus. The Output Providers route the output of the virtual camera to **Composure**, **Media Framework**, editor viewports, or any devices running the **Unreal Remote** app.

In addition, this new architecture includes the following:

- **Multi-User editing (-> multi-user-editing-in-unreal-engine)** support for all features.
- The ability to overlay custom UMG controls over the output and interact with them in the editor or on a device.
- Built-in support for input hardware such as controllers and touchscreens.
- Provides the functionality to switch to any custom tracking system with **Live Link**.
- An updated Unreal Remote app with a new UI and improved streaming performance.

For further documentation regarding the virtual camera system, please see the page links below.

- [image: Controlling a Virtual Camera Actor using Live Link] Controlling a Virtual Camera Actor using Live LinkUse the sample Virtual Camera Actor, driven by Live Link, to control a Cine Camera Actor. (-> controlling-a-virtual-camera-actor-using-live-link-in-unreal-engine)

- [image: Unreal VCam Tools and Configuration] Unreal VCam Tools and ConfigurationTools and configuration options for the Unreal VCam app. (-> unreal-vcam-tools-and-configuration-in-unreal-engine)

- [image: Unreal VCam Virtual Camera Settings] Unreal VCam Virtual Camera SettingsSettings and configuration information for the Unreal VCam app (-> unreal-vcam-virtual-camera-settings)

- [image: Virtual Camera Multi-User Quick-Start Guide] Virtual Camera Multi-User Quick-Start GuideUse Switchboard to connect multiple users to simultaneously operate Virtual Cameras. (-> virtual-camera-multiuser-quickstart-guide-in-unreal-engine)

- [image: Configuring a Virtual Camera Component] Configuring a Virtual Camera ComponentA guide to understanding and configuring a custom virtual camera. (-> configuring-a-virtual-camera-component-in-unreal-engine)

- [image: Controlling Inputs to Virtual Camera Controls] Controlling Inputs to Virtual Camera ControlsHow to manage, edit, and configure inputs to virtual camera controls. (-> controlling-inputs-to-virtual-camera-controls-in-unreal-engine)

- [image: Using Multiple Virtual Cameras] Using Multiple Virtual CamerasHow to set up multiple virtual cameras in a virtual production environment. (-> using-multiple-virtual-cameras-in-unreal-engine)

- virtual production
- sequencer
- camera
- live link
- take recorder
- virtual camera
- ar

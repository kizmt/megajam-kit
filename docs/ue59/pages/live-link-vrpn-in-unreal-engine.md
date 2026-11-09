# Live Link VRPN

https://dev.epicgames.com/documentation/en-us/unreal-engine/live-link-vrpn-in-unreal-engine?application_version=5.9

> Add tracking and input data from VR peripherals with the Live Link VRPN plugin.

[image: Live Link VRPN]

**Live Link** supports devices exposed through a VRPN server that has OpenVR support. VRPN provides an abstraction layer for VR peripherals so that they all appear to have the same data reports. Because of the nature of VRPN, you can have multiple **Live Link Subjects** that map to the same device.

## Getting Started

Follow these steps to set up your devices with **Live Link VRPN**.

- Start your VRPN server. The VRPN server must support OpenVR.

- Launch **Unreal Engine** and open your project.

- Enable the following plugins: **Live Link**

- **Live Link VRPN**

- Restart Unreal Engine.

- In Unreal Editor's **main menu**, choose **Window > Live Link** to open the **Live Link** window.

- Click **Add Source** and choose **Live Link VRPN Source**. [image: Select the Live Link VRPN Source] A user-selected Live Link VRPN Source which shows the Connection Settings panel. These are the default settings.

- In the **Connection Settings** window: Set **IPAddress** to the IP address and port number of the VRPN server. In this example, the VRPN server is running on the local computer using port 3884, so the text value is 127.0.0.1:3884.

- Set **Local Update Rate in Hz** for the frequency to poll the VRPN server. The default is 120, and the max is 1000.

- Set **Device Name** to the identifier used by the VRPN server for your device. It is better to use the serial number than the generic device identifier because the serial number won't change. In this example, the VRPN server uses the identifier openvr/controller/1GNGH850VE0304_Controller_Left for the left VR controller.

- Set **Subject Name** to a friendly name. This will be the **Live Link Subject Name**. In this example, the subject name is LeftController_VRPNTracker.

- Set **Type** to one of the following: **Tracker**: Returns the position and orientation of the device as an Unreal Transform.

- **Analog: **Returns one or more analog axes in the 0 - 1 range, such as joystick or sliders from the device.

- **Dial**: Returns a float to represent the rotation, such as a dial from the device.

- **Button**: Returns an array of floats with 0 or 1 values.

- Click **Add**. [image: Adding the connection settings to the VRPN source]

- A Live Link Subject with the given name appears under a **VRPN** section when the first data is received. In this example, the subject name is LeftController_VRPNTracker. [image: Live Link Subject in the VRPN section] If your Live Link VRPN Subject doesn't appear, refer to the Troubleshooting (-> live-link-vrpn-in-unreal-engine) section below for tips on how to make sure you're receiving data.

- **For Tracker type:** Select an **Actor** in the level and add a **LiveLinkComponentController** to it. Set **Subject Representation** to the Live Link VRPN Subject. In this example, the subject is LeftController_VRPNTracker. [image: Ading a Live Link Component Controller] **For the other types:** Since the other types are floats, use them in **Blueprints** to modify the scene.

## Reorienting Axis Mapping

Since VRPN doesn't enforce a standard axis mapping, Live Link provides controls for reorienting the axis mappings using Live Link preprocessors.

Follow these steps to change the axis mappings in Unreal Engine for your device.

- In the **Live Link** window, click on the **Live Link VRPN Subject**.

- Click **View Options > Show Subject Properties**.

- Next to **Pre Processors,** click the **Add (+)** button to add a Live Link preprocessor. [image: Adding a Live Link Pre Processor]

- Set the Pre Processors element to **Transform Axis Switch** and expand the section. [image: Expand the Transform Axis Switch section]

- Change the **Front**, **Right**, and **Up Axes** to match the coordinate system of the device. Each VRPN server may have a different default axis mapping, and each device may have its own axis mapping. Refer to the documentation or configuration file for your VRPN server for details. In this example, the device uses -Z forward, +X right, and +Y up. [image: Setting the axes]

- Once the axes are moving as expected, enable and set **Offset Position** or **Offset Rotation** to achieve the right orientation or position in the world, if necessary. [image: Enabling Ofset Position and Offset Rotation]

## Troubleshooting

If your Live Link VRPN Subject doesn't appear when you add a Live Link Source, try the following tips to troubleshoot.

- Make sure the IP address and port specified in Live Link match the VRPN server.

- You can use the LiveLinkXR (-> livelinkxr-in-unreal-engine) plugin on the same server to troubleshoot if the stream of data is correctly sent from VRPN.

- In Live Link, select the Live Link VRPN Subject and click **View Options > Show Frame Data** to see what data Unreal Engine is receiving.

 [image: The Show Frame Data View Option]

- live link

On this page

- Getting Started (-> live-link-vrpn-in-unreal-engine)
- Reorienting Axis Mapping (-> live-link-vrpn-in-unreal-engine)
- Troubleshooting (-> live-link-vrpn-in-unreal-engine)

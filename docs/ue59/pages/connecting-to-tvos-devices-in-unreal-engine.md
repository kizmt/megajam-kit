# Connecting to tvOS Devices

https://dev.epicgames.com/documentation/en-us/unreal-engine/connecting-to-tvos-devices-in-unreal-engine?application_version=5.9

> Set up your testing and debugging pipeline for tvOS connecting over a local area network.

[image: Connecting to tvOS Devices]

**AppleTV **devices use similar methods for launching and debugging projects in Xcode as iOS devices. However, because recent tvOS devices do not have a USB port, you need to use your local area network to access them instead. This page will show you how to set up a tvOS device so that you can connect to it using either Unreal Editor's **Device Manager **or Xcode.

## Connecting a tvOS Device

Ideally, both Unreal Editor's Device Manager and Xcode should recognize your tvOS device automatically over the local area network. Follow this checklist to ensure that it is visible to your computer:

- Make sure your tvOS device is connected to your local network with an Ethernet cable. While it is possible to connect to an Apple TV with WiFi, Ethernet connections are more stable and reliable.

- In Unreal Editor, from the main menu, select **Window** > **Developer Tools** > **Device Manager**.

- In the Device Manager window, verify that your tvOS device is visible.

- If your tvOS device is not visible, click **Connect to IP**, then type in the IP address of the Apple TV.

Once your Apple TV is visible in the Device Manager, you can follow the same workflows for launching and debugging projects (-> debugging-ios-projects-with-xcode-in-unreal-engine) as iOS devices.

- testing
- debugging
- tvos
- xcode
- platform delivery

On this page

- Connecting a tvOS Device (-> connecting-to-tvos-devices-in-unreal-engine)

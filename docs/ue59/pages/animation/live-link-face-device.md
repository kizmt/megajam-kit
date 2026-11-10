# Live Link Face Device

https://dev.epicgames.com/documentation/en-us/unreal-engine/live-link-face-device?application_version=5.9

> An overview of the Live Link Face device provided by Capture Manager.

The **Live Link Face** device enables the ingest of takes directly from a connected iOS device running the Live Link Face App. When using this device, make sure the LiveLink Face application is running in the foreground (is active).

> **warning:** Although the Live Link Face application is available on Android devices for real time animation in MetaHuman Animator, it does not support capture for offline processing.

[image: Device Details Live Link Face]

- **Display Name**: The name of the device as it will appear in the **Devices** list.

- **Ip Address**: The IP address of the device on the network.

- **Port**: The port of the device on the network.

- **Connect**: Tokens that can be extracted from the folder and file name of the audio file to identify the take.

> **note:** Live Link Hub and the mobile device must be able to connect across the network; make sure your network settings, firewalls, VPNs, and so on are set to allow this connection.

## Capturing Data

It is possible to trigger recording in the Live Link Face app from the Live Link Hub Live Data layout. This will pass **Session**, **Slate**, and **Take **information to the app.

[image: Capturing Data]

> **note:** This will trigger recording on all connected Live Link Hub devices; it is not possible to trigger a specific device.

# Switchboard Quick Start

https://dev.epicgames.com/documentation/en-us/unreal-engine/switchboard-quick-start-for-unreal-engine?application_version=5.9

> Learn how to add Switchboard to your project and connect to multiple devices remotely.

[image: Switchboard Quick Start]

Learn to use this **Beta** feature, but use caution when shipping with it.

The instructions on this page provide a step-by-step guide to getting started with Switchboard. By the end of this tutorial, you'll know how to set up Switchboard to connect to multiple devices.

## Prerequisites

You must have the following set up before completing the next steps:

- The **Switchboard **plugin enabled. After you've added the plugin and restarted the engine, Switchboard and SwitchboardListener options appear in the Toolbar. Click image to expand

- Dependencies installed. In the main menu, choose **Edit > Editor Preferences > Plugins > Switchboard** and click **Install Dependencies**. Click image to expand

- (Optional) If you're using Windows as your OS, you can choose to install a desktop shortcut for Switchboard. In the main menu, choose **Edit > Project Settings > Plugins > Switchboard** and click **Add Shortcut**. Click image to expand

- If you built the engine from source, you will need to build **SwitchboardListener** separately. You can either build the project in Visual Studio or run the following command in the root directory of the engine source code: `Engine\Binaries\DotNET\UnrealBuildTool.exe Win64 Development SwitchboardListener`.

## Step 1 - Launching Switchboard Listener

On each device you want to connect to Switchboard, you will need to launch SwitchboardListener. In the Toolbar, select **Switchboard Options > Launch Switchboard Listener**, which launches the listener on the local machine with the default address 0.0.0.0:2980, or the address you specified for **Listener Commandline Arguments** in **Editor Preferences**.

 [image: Launch Switchboard Listener]

The listener minimizes its window automatically on start to avoid issues with nDisplay devices. You can find the application in your OS's taskbar.

 [image: Switchboard Listener application]

You can also select **Launch Switchboard Listener on Login** which launches the listener on the local machine every time you log into the computer.

## Step 2 - Launching Switchboard

There are multiple ways to launch Switchboard:

- Opening a project in Unreal Editor, and selecting **Launch Switchboard** from the Toolbar. [image: Launch Switchboard from Unreal Editor Toolbar]

- Using the desktop shortcut, if you installed it on your computer. Refer to Switchboard Prerequisites for steps on installing this shortcut.

- Running **Engine\Plugins\VirtualProduction\Switchboard\Source\Switchboard\Switchboard.bat**.

The **Add New Switchboard Configuration** window appears when Switchboard is launched for the first time. You can either fill out the fields and select **OK**, or select **Cancel **and update them later in the Switchboard Settings. Both options open Switchboard in a window.

 [image: Add new Switchboard Configuration]

Switchboard Configuration Parameters:

| Parameter | Description |
| --- | --- |
| Name | The name you want to use to identify your Switchboard project. |
| uProject | The local path to the uProject you want to control via Switchboard. |
| Engine Dir | The local path to the engine directory of the engine you want to use. It is possible to either specify a path to an engine you have built from source or an installed engine release. Example: "C:\Program Files\Epic Games\UE_5.00\Engine" |
| Perforce | Enable this checkbox to use Perforce as your source repository. |
| P4 Project Path | The depot path to the directory containing the uproject file specified above. |
| P4 Engine Path | The depot path to the engine directory specified above. May be omitted if you don't plan on building the engine from source. |
| Workspace Name | The name of the locally available perforce workspace that has the uproject directory mapped. |

## Step 3 - Adding a Device in Switchboard

Switchboard supports several types of devices. These devices are implemented as plugins for Switchboard. Refer to Switchboard Settings (-> switchboard-settings-reference-for-unreal-engine) for the list of device plugins available by default, and steps on how to create your own device plugin.

The following example shows how to add an Unreal Device in

- In Switchboard, select **Add Device > Unreal **to open the **Add Unreal Device** window. [image: Add Unreal Device in Switchboard]

- In the Add Unreal Device window, assign a Name to the machine running Unreal Engine and the IP Address of the computer. Select **OK**. The device is added to the list of Unreal Devices in Switchboard. [image: Add Unreal Device window]

You can also change the IP address and name of the device after it has been added.

- Click **Connect to listener** to connect to the SwitchboardListener application running on the remote machine. The status icon turns blue when the device is connected. [image: Connect to Switchboard Listener]

- Click **Start Unreal** to launch an instance of the Unreal Editor on the remote machine. [image: Start Unreal instance remotely]

- The status icon on the left turns either orange or green when the Unreal instance launches. The green status indicates that the Unreal instance is connected through OSC so you can use Take Recorder from Switchboard.

- The orange status indicates that it is not connected through OSC.

 [image: Example of orange status]

- Click **Stop Unreal** to close the Unreal Editor on the remote machine. [image: Stop Unreal instance remotely]

## Step 4 - On Your Own

This quick start showed you how to start Switchboard and SwitchboardListener, connect to remote devices, and control them from Switchboard. Refer to Switchboard Settings Reference (-> switchboard-settings-reference-for-unreal-engine) for a complete list of options you can modify in Switchboard. Learn more about the following features to use in your project:

- Sync and build your project and engine remotely.

- Record a take remotely from Switchboard.

- Launch and monitor your nDisplay cluster.

- beta
- vfx

On this page

- Prerequisites (-> switchboard-quick-start-for-unreal-engine)
- Step 1 - Launching Switchboard Listener (-> switchboard-quick-start-for-unreal-engine)
- Step 2 - Launching Switchboard (-> switchboard-quick-start-for-unreal-engine)
- Step 3 - Adding a Device in Switchboard (-> switchboard-quick-start-for-unreal-engine)
- Step 4 - On Your Own (-> switchboard-quick-start-for-unreal-engine)

# Switchboard

https://dev.epicgames.com/documentation/en-us/unreal-engine/switchboard-in-unreal-engine?application_version=5.9

> Control multiple remote machines from one application with Switchboard.

[image: Switchboard]

Learn to use this **Beta** feature, but use caution when shipping with it.

**Switchboard** is a Python application for controlling multiple remote devices and relies on the companion application SwitchboardListener to communicate with them. **SwitchboardListener** is an Unreal Engine C++ application that runs a TCP socket server on each device to share JSON messages with Switchboard.

Switchboard's features include:

- Start Unreal Engine remotely on a device in a Multi-User session (-> multi-user-editing-in-unreal-engine).

- Launch nDisplay (-> rendering-to-multiple-displays-with-ndisplay-in-unreal-engine) on multiple devices.

- Record with embedded Take Recorder (-> record-gameplay-in-unreal-engine) controls.

- Sync all devices to a specific changelist and build your Project and Unreal Engine from source.

- Connect to and control the following devices: KiPro, Live Link Face (-> recording-face-animation-on-ios-device-in-unreal-engine), Shogun, and SoundDevices.

- Add your own device plugins and extend Switchboard and SwitchboardListener for custom controls.

This page covers some of the features available in Switchboard. For getting started with Switchboard, follow the steps in the Switchboard Quick Start (-> switchboard-quick-start-for-unreal-engine). See the Switchboard Settings Reference (-> switchboard-settings-reference-for-unreal-engine) for specific details on all the settings available.

## Virtual Production Roles

The **Switchboard** application requires each user to occupy a **VP Role**, such as an **Editor** or **Render**, to differentiate and identify connected users.

- On your primary workstation in the Unreal Editor, navigate to the Toolbar, and select the **VP Roles**, then select (**+**) **Add Role** from the drop-down menu. Give the new role a name. In this workflow example the primary workstation is named Editor.

- Using the same steps, add a second **Role** for your secondary device to occupy. In this workflow example, the secondary workstation is named Render.

- In the **Menu Bar**, navigate to** Edit** > **Project Settings**, and under the** Multi-User Editing** section,set the **Validation Mode** property to **Soft**, using the drop-down menu.

If your project contains any dirty packages, an error prompt displays when you join a multi-user session. You then have the opportunity to cancel the connection or to fix any present issues. If you choose to proceed any dirty packages will be deleted.

Your project is now ready to connect other devices using Switchboard.

## Take Recording with Switchboard

You can record takes in a connected Unreal device using the TakeRecorder functionality embedded in Switchboard. Switchboard uses OSC (-> osc-plugin-overview-for-unreal-engine) to communicate with the Unreal Instance for recording. The Switchboard plugin includes a default **OSC Listener** to create this connection for you.

Make sure the following settings are set up properly:

- Enable **Start an OSC Server when the editor launches** in the **Virtual Production Editor** plugin.

- The **OSC Server Port** in the **Virtual Production Editor** plugin matches the **OSC Client Port** in the Switchboard Settings (-> switchboard-settings-reference-for-unreal-engine).

- The **OSC Server Address** is reachable by Switchboard.

Click image to expand.

 [image: Virtual production editor port settings]

In Switchboard, the status icon turns green if the OSC connection is successful for the device.

 [image: Not connected]
 [image: Attempting to connect]
 [image: Successfully connected]

Comparing the Switchboard status icons.

The status icon will turn orange after starting Unreal if the OSC connection is unsuccessful.

 [image: Unsuccessful connection]

- At the top of Switchboard, you can set the **Sequence** name, **Slate** name, and **Take** number.

- The names should immediately be reflected in the **TakeRecorder** of the OSC-connected Unreal device.

- Press the red button on the right to start and stop recording.

- If a device is recording, its background is set to red in Switchboard.

- After each recording, the **Take** number is incremented. [image: Switchboard device recording]

Check the Debug log to verify expected status changes for devices.

 [image: Switchboard debug log]

## Launching nDisplay with Switchboard

You can set up Switchboard to communicate with all your nDisplay devices. When you choose to add an nDisplay device in Switchboard, you add the location of your nDisplay config file (-> ndisplay-configuration-file-reference-for-unreal-engine). Switchboard parses the config file and converts the cluster nodes specified in the file to Switchboard devices. See Switchboard Settings (-> switchboard-settings-reference-for-unreal-engine) for more details on how the nDisplay devices can be further configured in Switchboard.

 [image: nDisplay device list]

In addition to adding nDisplay devices, information on the status of the nDisplay cluster appears on the right side of the Switchboard window in the nDisplay Monitor panel. The following table describes the information included in the monitor. Whenever the values are unexpected, the color of the cell turns yellow as a warning.

You can execute commands remotely to the nDisplay cluster by entering a command in the **Console** text box (such as "stat fps" or "r.RayTracing.SceneCaptures 0") and clicking **Exec**.

 [image: nDisplay monitor]

| **Column** | **Description** |
| --- | --- |
| Node | The nDisplay scene node (-> ndisplay-configuration-file-reference-for-unreal-engine). |
| Host | The device's IP address. |
| Connected | Displays **yes** or **no**. |
| Driver | The NVIDIA driver version. |
| PresentMode | The swap chain presentation mode. |
| Gpus | Indicates if the detected GPUs are being synchronized by a Quadro Sync card. |
| Display | Indicates if the detected displays are being synchronized. |
| SyncRate | The display refresh rate. |
| HouseSync | Indicates the presence of an external synchronization signal into the Quadro Sync card. |
| SyncSource | Indicates if the synchronization source is house sync or vsync. |
| Mosaics | Lists the display grid configuration. |
| Taskbar | Indicates whether the taskbar auto-hide setting is set or not. |
| InFocus | Indicates whether the nDisplay instance window is in focus. It is recommended to be in focus. |
| ExeFlags | Flags on the UnrealEngine executable. We recommend using the **Disable Fullscreen Optimizations** option. |
| OSVer | Operating system version. |
| CPUUtilization | Average CPU utilization. The number of overloaded cores are displayed in parentheses. |
| MemUtilization | Physical memory utilization |
| GpuUtilization | Average GPU utilization. Clock speed is specified in parentheses. |
| GpuTemperature | Max GPU Temperature in Celsius degrees across all sensors. |

## Syncing and Building

You can connect your source control to Switchboard, then sync and build your project and engine according to a certain changelist across all connected devices. You can see what changelists are on each connected device to know which ones need to be updated.

Follow these steps to add your source control information to Switchboard:

- Open **Switchboard Settings**.

- In the Switchboard Settings dialog, check the box next to **Source Control**.

- In the section under **Source Control**: Set **P4 Project Path** to your project's Perforce Stream.

- If you want to build the engine from source, set **P4 Engine Path** to your engine's Perforce Stream. Setting this path is not required if you only plan to sync and build your project.

- Set **Workspace Name** to the name of your Perforce Workspace.

 [image: Switchboard source control paths]

- In the section under **Project Settings**: Set **UProject** to the location of your Unreal Engine project.

- Set **Engine Dir** to the directory where the binary release of the engine is located.

- If you want to build the engine from source, check the **Build Engine** checkbox. If you are only building your project, leave it unchecked.

 [image: Switchboard project paths]

When your source control information is added, the Engine and Project changelists appear in Switchboard above the list of devices. This means that there is only one place where the current changelist for all devices is specified.

 [image: Switchboard changelists]

In this screenshot, the Project changelist and Engine changelist are shown.

Each device also shows what Engine and Project changelists it has. If a device's changelist is behind the one selected at the top of Switchboard, its text color turns red.

 [image: Switchboard device changelist]

### Source Control Buttons

| **Icon** | **Action** | **Description** |
| --- | --- | --- |
| [image: Refresh] | Refresh | Updates the source control information in Switchboard. |
| [image: Sync] | Sync | Syncs all connected devices to the changelist. If this button is on the device's row, Switchboard only syncs that device. Controls on the devices are locked during a sync. |
| [image: Build] | Build | Builds on all connected devices. If this button is on the device's row, Switchboard only builds on that device. Controls on the devices are locked during a build. |
| [image: Sync and Build] | Sync and Build | Syncs and builds on all connected devices. If you enabled Build Engine in the settings, this option will sync and build the engine before the project. |

If you don't want to sync the engine or the project, select the **--None--** entry in the changelist dropdown to ignore the engine or project in the next sync and build operation.

- python
- beta
- c++
- virtual sets

On this page

- Virtual Production Roles (-> switchboard-in-unreal-engine)
- Take Recording with Switchboard (-> switchboard-in-unreal-engine)
- Launching nDisplay with Switchboard (-> switchboard-in-unreal-engine)
- Syncing and Building (-> switchboard-in-unreal-engine)
- Source Control Buttons (-> switchboard-in-unreal-engine)

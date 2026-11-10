# Live Link Hub Quick Start

https://dev.epicgames.com/documentation/en-us/unreal-engine/live-link-hub-quick-start-in-unreal-engine?application_version=5.9

> Get started using the Live Link Hub application.

This page provides the basic steps to set up and get started using Live Link Hub.

## Activate Required Plugins in Unreal Editor

To enable the Live Link Hub plugin navigate to **Edit** > **Plugins** and open the **Plugin Browser**. Search for "Live Link".

[image: Live Link plugins]

Enable the Live Link Hub plugin entry.

> **note:** Live Link - this plugin is on by default in blank projects. You may have disabled it previously. If so, enable it now.

Restart the editor.

## Launch Live Link Hub

On the menu there will be a new entry for Live Link Hub. Navigate to **Tools->Live Link Hub**.

[image: Live Link Hub in the Tools menu]

This will launch Live Link Hub on your machine.

If you want to run Live Link Hub on a machine that does not have Unreal Engine installed, you can download Live Link Hub from the Epic Games store.

When starting Live Link Hub, any client PCs on the same network, running Unreal Editor with the Live Link Hub Plugin enabled, will be listed in the Clients panel.

Your editor session should already be listed on the right-most Clients panel.

[image: An Unreal Editor session in Live Link Hub]

In UE, the message bar will show a green Live Link Connected banner:

[image: Live Link Connected banner]

If there is an error, the message bar will show a warning message:

[image: Live Link Hub Error warning message]

Open the Live Link panel in UE to check if there is a source listed, labeled Live Link Hub. It should appear as follows:

[image: Live Link Hub source in the Live Link panel]

If there is no Live Link Hub source listed, you can add it manually by clicking **+Add Source**.

New clients (engine sessions) are automatically added to Live Link Hub when they are brought online. They will be listed as disconnected when they are no longer connected.

## Add a Source

To add a source of real time animation data, click **+Add Source** on the **Sources** panel:

[image: Add a source]

Data will be sent to all the connected clients. Your source’s subjects will be listed on the central **Subjects** panel:

[image: Your source's subjects]

And in UE, if you click the Live Link Hub section of the message bar or open the Live Link Panel you will see the subjects listed:

[image: Live Link subjects listed in Unreal Engine]

Data is now streaming to your Unreal Editor(s), to be consumed as described in the Live Link documentation (-> using-live-link-data-in-unreal-engine).

## Advanced Topics

### Launching from the Command Line

You can launch Live Link Hub from the command line, which provides access to some additional launch arguments.

If you are running Live Link Hub from an Unreal Engine install, you can optionally enable the following Live Link Plugins in Hub:

- LiveLinkFreeD

- LiveLinkPrestonMDR

- LiveLinkMasterLockit

- LiveLinkVRPN

Press Windows+R and type CMD. Press enter to open a command line window.

Type and execute the following command:

```cpp_programming
[your install directory]\Engine\Binaries\LiveLinkHub.exe -EnablePlugins="LiveLinkFreeD,LiveLinkPrestonMDR,LiveLinkMasterLockit,LiveLinkVRPN"
```

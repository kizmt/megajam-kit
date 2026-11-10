# Activating the Virtual Scouting Legacy Tools

https://dev.epicgames.com/documentation/en-us/unreal-engine/activating-the-virtual-scouting-legacy-tools?application_version=5.9

> Describes how to enable the Virtual Scouting Legacy tools.

[image: Activating the Virtual Scouting Legacy Tools]

Learn to use this **Beta** feature, but use caution when shipping with it.

The Virtual Scouting Legacy tools (-> virtual-scouting-legacy-tools) described on this page will be sunset and deprecated in a future engine release. We encourage users to move to the new Virtual Scouting tools (-> virtual-scouting-in-unreal-engine). Unused VREditor code and
modules will be fully deprecated in a future engine release.

Virtual Scouting is compatible with the HTC Vive, HTC Vive Pro, Oculus Rift, and Oculus Rift S VR HMDs. See SteamVR Prerequisites (-> steamvr-prerequisites-in-unreal-engine) and Oculus Prerequisites (-> oculus-prerequisites-in-unreal-engine) for connecting your headsets to Unreal Engine.

In this how-to guide, you will configure a project to enable access to the Virtual Scouting tools.

## Steps

- With your project open, select **Edit** > **Plugins** from the main menu.

- From the **Plugins** menu, under **Virtual Production**, enable the **Virtual Production Utilities** plugin.

- Restart the **editor** when prompted.

- Select **Edit** > **Project Settings** from the main menu.

- In **Project Settings** > **Plugins** > **Virtual Production Editor** > **Virtual Production**, set the **Virtual Scouting User Interface** to **Virtual Scouting Widget**. If the **Virtual Production Utilities** plugin is enabled, but the **Virtual Scouting User Interface** is not set to **VirtualScoutingWidget**, it may affect **VR Editor** behavior. This will be resolved in a future release.

- Select **Edit** > **Editor Preferences** from the main menu.

- In **General** > **VR Mode** > **Motion Controllers**, set the **Interactor Class** to **VirtualScoutingInteractor**.

- Select **Edit** > **Editor Preferences** from the main menu.

- In **Editor Preferences** > **General** > **VR Mode** > **Motion Controllers**, set the **Teleporter Class** to **VirtualScoutingTeleporter**.

- Select **Edit** > **Editor Preferences** from the main menu.

- In **Editor Preferences** > **General** > **VR Mode** > **World Movement**, uncheck **Show World Movement Grid** and **Show World Movement Post Process**.

- Select **Edit** > **Editor Preferences** from the main menu.

- In **Editor Preferences** > **Level Editor** > **Viewports** > **Grid Snapping**, uncheck **Enable Grid Snapping**, **Enable Rotation Snapping**, and **Enable Scale Snapping**.

- Enter **VR Mode**.

## End Result

Once you are in **VR Mode**, pressing the Menu button on your VR controller will make the Virtual Scouting panel appear, giving you access to the various Virtual Scouting tools. For more information about the individual tools, see the Virtual Scouting Overview (-> virtual-scouting-legacy-overview).

- beta
- virtual scouting

On this page

- Steps (-> activating-the-virtual-scouting-legacy-tools)
- End Result (-> activating-the-virtual-scouting-legacy-tools)

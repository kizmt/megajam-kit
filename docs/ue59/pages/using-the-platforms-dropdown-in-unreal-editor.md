# Managing Platforms in Unreal Editor

https://dev.epicgames.com/documentation/en-us/unreal-engine/using-the-platforms-dropdown-in-unreal-editor?application_version=5.9

> Using the new Platform dropdown in Unreal Editor to install SDKs and manage devices

[image: Managing Platforms in Unreal Editor]

**Unreal Editor** now features a dedicated **Platforms** dropdown in the toolbar. This dropdown accesses the **Turnkey** platform support system, providing a means for quickly installing and updating SDKs, as well as an interface for launching and testing on devices.

 [image: Accessing the Platform Menu in the Unreal Editor]

This page provides a reference for the tools available through this menu.

The editor functions here access the same system as the Turnkey commandline (-> using-the-turnkey-commandline-for-unreal-engine).

## Prerequisites

To use the Platforms menu for installing SDKs, your organization must make the SDK files for your platforms available in a file source repository, and you must have a valid TurnkeyManifest XML file pointing to that repository. For more information about how to prepare a file source repository, refer to Setting up Turnkey for Your Organization (-> setting-up-turnkey-for-your-organization-in-unreal-engine).

## Installing and Managing SDKs

Each platform supported by your project appears in the **Content/SDK/Device Management** section of the Platforms dropdown. To install SDKs, navigate to the menu entry for the platform whose SDK you want to install, then click **Install Sdk**.

 [image: Selecting an SDK to install]

If the platform you want does not appear in this list, navigate to **Platforms With No Compiled Support**, which will display all platforms that Unreal Engine supports but that you do not have SDKs set up for.

 [image: Accessing platforms with no compiled support]

Selecting **Install Sdk** will start up Turnkey and initialize the download and installation process for the selected SDK. **Prefer Full** will favor a full SDK installation. **Prefer Minimal** will prefer the smallest possible SDK installation, such as a Flash SDK for testing purposes.

Depending on which SDK you are installing, additional prompts may appear for setting up specific SDK components, like Android Studio.

You can check the SDK status by looking at a platform's **SDK Management** section, which will display your current SDK and the range of compatible SDKs for your platform. You can check the SDK status for an individual device in the submenu for its platform. Locate the **All Devices** section and highlight the entry for a device to display this information.

 [image: Showing device information for an Android device]

## Packaging Projects

To package a project, click the **Platforms** dropdown in the editor, then navigate to the platform that you want to package for and click **Package Project**. A dialog will prompt you to save the packaged project, then initiate the packaging process when you select a directory to save to.

 [image: Packaging a project for Android]

You can change build targets and binary configurations with the settings in the submenu for your platform.

To configure packaging settings, you can either click **Packaging Settings** in the Platforms dropdown menu, or you can open **Project Settings > Packaging Settings**.

## Setting Up Target Devices

If you click **Device Manager** in the dropdown, it will open the Device Manager window.

 [image: Using the Device Manager]

This window will display recognized devices and dev kits on your local network, including compatible mobile devices connected to your computer. You can use this menu to claim, release, or share devices. Only devices that you have claimed will appear in the **Project Launcher**. You can also use this menu to control devices remotely by powering them on or off, rebooting them, or connecting/disconnecting them.

If you select a device, the **Running Processes** tab will display a snapshot about current processes that device is running and their resource load, provided that device supports process snapshots. Additionally, the **Device Details** tab will list what features are available on that device.

## Launching Projects on Devices

The Platforms dropdown has a **Quick Launch** section, and you can click one of the devices listed here to immediately install and launch a build on it using the default settings.

 [image: Accessing Quick Launch from the Platform menu]

Quick Launch options are also available in the dropdown menu for the **Play** button.

 [image: Accessing Quick Launch from the Play dropdown]

### Project Launcher

For advanced use cases, you can also click the **Project Launcher** button in the **Platforms** dropdown to bring up the **Project Launcher** window.

 [image: Using the Project Launcher window]

This menu will show any devices that you have set up using the Device Manager, and you can configure the profile that you want to use to launch it. By default the **variant** field is displayed, but toggling the **Advanced** button will show the project configuration and cooking settings. The **Custom Launch Profiles** menu enables you to set up custom profiles with detailed packaging and deployment options for even more advanced use cases on specific projects.

 [image: Creating a custom profile in the Project Launcher window]

- platforms
- turnkey
- platform sdks
- sdks
- turnkeyusage
- platform delivery

On this page

- Prerequisites (-> using-the-platforms-dropdown-in-unreal-editor)
- Installing and Managing SDKs (-> using-the-platforms-dropdown-in-unreal-editor)
- Packaging Projects (-> using-the-platforms-dropdown-in-unreal-editor)
- Setting Up Target Devices (-> using-the-platforms-dropdown-in-unreal-editor)
- Launching Projects on Devices (-> using-the-platforms-dropdown-in-unreal-editor)
- Project Launcher (-> using-the-platforms-dropdown-in-unreal-editor)

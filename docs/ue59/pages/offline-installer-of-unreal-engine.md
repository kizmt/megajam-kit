# Offline Installer

https://dev.epicgames.com/documentation/en-us/unreal-engine/offline-installer-of-unreal-engine?application_version=5.9

> Learn how to use the Unreal Engine offline installer.

[image: Offline Installer]

Standalone, offline installers provide a means for customizing your organization's Unreal Engine (UE) installation. This document guides you through using an offline installer, how to handle silent installations through a command line, and how to update your installation and its components.

The standalone installer does not include the Epic Games Launcher, which provides access to the Unreal Marketplace and many useful project management features.

## Required Setup

To follow this guide, you must download an offline installer on a machine that meets or exceeds the Hardware and Software Specifications (-> hardware-and-software-requirements-for-container-deployments-in-unreal-engine).

The offline installer is only available to administrators of organizations on the Developer Portal who have purchased Unreal seats or have otherwise been approved for access.

Once your organization is provisioned with UE offline installer access, your organization owner or administrator should do the following:

- Go to https://dev.epicgames.com/portal and log in with your Epic Games account.

- Choose the appropriate organization if you belong to multiple.

- From the navigation menu on the left, under **Epic Tools**, choose **Unreal Engine > Downloads**.

- Set the **Type** dropdown to **Unreal Engine Offline Installer**.

- Download the UE offline installer for the desired version.

After you download the offline installer, you can install UE using either of the following methods:

- Manual Installation (-> offline-installer-of-unreal-engine) - Run your installer directly on the computer where you want to install the engine.

- Silent Installation (-> offline-installer-of-unreal-engine) - Use a command line to perform a silent installation.

## Windows Installation

### Manual Installation

Running the `UnrealEngineInstaller.msi` directly performs a manual installation using the installation wizard.

To configure your installation with the wizard, do the following:

- Extract the `UnrealEngineInstaller.msi` from the downloaded `.zip` file.

- Run the `UnrealEngineInstaller.msi` to start the installation wizard.

- Use the wizard to customize your installation.

### Silent Installation

Silent installations are useful for deploying a large number of licenses across many devices within your organization.

You can perform a silent installation by running the `UnrealEngineInstaller.msi` using a command line and customize your installation via additional parameters.

The base command to a silent installation is as follows:

```
msiexec /i path/to/your/UnrealEngineInstaller.msi /qn /l+ "PathToYour/Logname.log" /norestart
```

msiexec /i path/to/your/UnrealEngineInstaller.msi /qn /l+ "PathToYour/Logname.log" /norestart

The `/qn` parameter is necessary for a silent install, while the `/l+` parameter and the following path outputs a log for the installation.

Use the `msiexec` command with the `/?` parameter to display a help menu containing a list of the standard parameters available for `.msi` files.

#### Unreal Engine-Specific .msi Parameters

When you perform a silent installation, you can configure any of the options available in the installation wizard using the following parameters:

| Parameter | Default Value | Description |
| --- | --- | --- |
| `INSTALLLOCATION=[path]` | `"C:\Program Files\Epic Games\[UE Version]\"` | Your UE install location. |
| `INSTALL_CREATE_SHORTCUT=[0/1]` | 1 (true) | If true, create a desktop shortcut. |
| `ENGINE_STARTER_CHECKED=[0/1]` | 1 (true) | If true, install starter content. |
| `ENGINE_TEMPLATES_CHECKED=[0/1]` | 1 (true) | If true, install project templates and feature packs. |
| `ENGINE_SOURCE_CHECKED=[0/1]` | 1 (true) | If true, install UE C++ source code. |
| `ENGINE_SYMBOLS_CHECKED=[0/1]` | 1 (true) | If true, include engine symbols for debugging. |
| `ENGINE_IOS_CHECKED=[0/1]` | 1 (true) | If true, include iOS platform support. |
| `ENGINE_TVOS_CHECKED=[0/1]` | 1 (true) | If true, include tvOS platform support. Requires iOS support. |
| `ENGINE_ANDROID_CHECKED=[0/1]` | 1 (true) | If true, include Android platform support. |
| `ENGINE_LUMIN_CHECKED=[0/1]` | 1 (true) | If true, include Magic Leap platform support. Requires Android support. |
| `ENGINE_HOLOLENS_CHECKED=[0/1]` | 1 (true) | If true, include Hololens platform support. |
| `ENGINE_LINUX_CHECKED=[0/1]` | 1 (true) | If true, include Linux platform support. |

For example, if you wanted to perform a silent installation to a custom install path and wanted to configure some of the installation settings, your command would resemble the following:

```
msiexec /i path/to/your/UnrealEngineInstaller.msi /qn /l+

"PathToYour/Logname.log" /norestart INSTALLLOCATION="C:\Epic Games\[UE Version]" ENGINE_IOS_CHECKED=0 ENGINE_ANDROID_CHECKED=0 ENGINE_LUMIN_CHECKED=0 ENGINE_TVOS_CHECKED=0 INSTALL_CREATE_SHORTCUT=0
```

msiexec /i path/to/your/UnrealEngineInstaller.msi /qn /l+

"PathToYour/Logname.log" /norestart INSTALLLOCATION="C:\Epic Games\[UE Version]" ENGINE_IOS_CHECKED=0 ENGINE_ANDROID_CHECKED=0 ENGINE_LUMIN_CHECKED=0 ENGINE_TVOS_CHECKED=0 INSTALL_CREATE_SHORTCUT=0

The above command changes the defaults so that the installer:

- Installs UE to `C:\Epic Games\[UE Version]`.

- Excludes iOS, Android, tvOS, and MagicLeap support.

- Does not create a desktop shortcut.

`ENGINE_SOURCE_CHECKED=1` is not required to create C++ projects. However, you can only edit your project's C++ and not UE's.

### Run Unreal Editor

If you included a desktop shortcut in your installation, you can run UE from your desktop.

Otherwise, follow these steps:

- Go to your UE installation directory, `C:\Program Files\Epic Games\[UE Version]` by default.

- Go to `Engine\Binaries\Win64` inside that directory.

- Run `UnrealEditor.exe`.

If you installed the source code, run the `GenerateProjectFiles.bat` in your installation directory under `Engine\Build\BatchFiles\` to generate the Visual Studio solution and accompanying project files.

### How to Update UE

If you need to adjust your UE installation on the same version, you can rerun the installer with any desired changes. This is useful if your initial installation omitted platform support you want to add now.

If you need to update UE, download and run the installer for the new version. If you are running a hotfix update (such as 5.3 to 5.3.1), you can install to the same directory as the previous version. If you are running a major update (such as 5.3 to 5.4), you should install the new version to a different directory and migrate your project.

To migrate your project, do the following:

- Backup your project.

- Right-click your `.uproject` file and select **Switch Unreal Engine Version**.

## MacOS Installation

### Manual Installation

Running the `FullInstall_OnMac.pkg` directly performs a manual installation using the installation wizard.

To configure your installation with the wizard, do the following:

- Download the package `FullInstall_OnMac.pkg`.

- Double-click `FullInstall_OnMac.pkg` to run the install wizard.

- Use the wizard to install UE with everything except the symbols.

If you encounter issues during installation, you can review the log at `/var/log/install.log`.

### Silent Installation

Silent installations are useful for deploying a large number of licenses across many devices within your organization.

You can perform a silent installation on Mac by doing the following:

- Download the package `FullInstall_OnMac.pkg`.

- Run `sudo installer -pkg ~/Downloads/FullInstall_OnMac.pkg -target /` in a terminal.

- Run `sudo chown -R $USER /Users/Shared/Epic\ Games/UE*_SI` in a terminal.

If you encounter issues during installation, you can review the log at `/var/log/install.log`.

### Run Unreal Editor

After installation, you can start Unreal Editor from one of the following locations:

- Launchpad

- Install Folder (`/Users/Shared/Epic Games/UE_[version]_SI/Engine/Binaries/Mac/UnrealEditor.app`)

- Spotlight with Command + Space, then search for UnrealEditor

### How to Update UE

To update Unreal Engine from a `.pkg` install, perform the installation steps again for the new version.

You can keep or remove the previous version. To remove the older version, do one of the following:

- Drag and drop the older version into the trash.

- In a terminal, use the command `rm -Rf /Users/Shared/Epic\ Games/UE*_SI`

- installation
- offline

On this page

- Required Setup (-> offline-installer-of-unreal-engine)
- Windows Installation (-> offline-installer-of-unreal-engine)
- Manual Installation (-> offline-installer-of-unreal-engine)
- Silent Installation (-> offline-installer-of-unreal-engine)
- Unreal Engine-Specific .msi Parameters (-> offline-installer-of-unreal-engine)
- Run Unreal Editor (-> offline-installer-of-unreal-engine)
- How to Update UE (-> offline-installer-of-unreal-engine)
- MacOS Installation (-> offline-installer-of-unreal-engine)
- Manual Installation (-> offline-installer-of-unreal-engine)
- Silent Installation (-> offline-installer-of-unreal-engine)
- Run Unreal Editor (-> offline-installer-of-unreal-engine)
- How to Update UE (-> offline-installer-of-unreal-engine)

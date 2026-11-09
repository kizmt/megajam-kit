# Create an Installed Build

https://dev.epicgames.com/documentation/en-us/unreal-engine/create-an-installed-build-of-unreal-engine?application_version=5.9

> Create pre-packaged binaries for Unreal Editor that you can distribute to your team.

[image: Create an Installed Build]

Operating System

×Windows

Select an option from the dropdown to see content relevant to it.

When working on a source build of an **Unreal Engine (UE)** project with a team, some team members might not have the necessary software or knowledge to build and run Unreal Engine from source (-> building-unreal-engine-from-source). In these cases, you can build Unreal Engine binaries and distribute them to your team as an **installed build**. This creates a package similar to what is deployed by the Epic Games Launcher.

For more general instructions on how to create an Installed Build, refer to the Installed Build Reference Guide (-> installed-build-reference-guide-for-unreal-engine). This page provides additional information and steps for developers using **Windows**.

## Prerequisites

Before you make an installed build, make sure you have the following prerequisites:

- A source code build of Unreal Engine (-> building-unreal-engine-from-source).
- Windows DotNet 6.0 Runtime.
- Windows Debugging Tools component for Windows 10 SDK (Windows 10 only – See below).

### Recommended Hardware

We recommend you use a machine with a high processor core/thread count for builds. While UE builds on a single core, build times are significantly reduced with multi-core processors. See Hardware and Software Specifications (-> hardware-and-software-specifications-for-unreal-engine) for more details on recommended hardware.

### Windows 10 SDK (Windows 10 users only)

On Windows 10, you need to install the Windows Debugging Tools component in the Windows 10 SDK. This enables `PDBCopy.exe`, which is used in the build process to strip symbols and optimize the resulting package size.

If you do not already have the Windows 10 SDK installed, follow these steps:

- Download and install the Windows 10 SDK from Microsoft's site.
- When you reach the dialogue that says **select the features you want to install**, make sure **Debugging Tools for Windows** is checked, then proceed with the installation.[image: Debugging Tools for Windows is selected in the feature selection dialog for the Windows 10 SDK installer.]
- Proceed with the installation.

If you already have the Windows 10 SDK set up, but don’t have Debugging Tools for Windows, follow these steps:

- Open **Add or Remove Programs.**
- In the list of available programs, locate your Windows Software Development Kit installation. Click **Modify**.[image: Modifying the Windows SDK in Add or Remove Programs]
- In the list of options that appears, check **Change** and click **Next.**
- When you see the dialog that says **select the features you want to change**, check **Debugging Tools for Windows**, then click **Change** to proceed with the installation.

## Make an Installed Build

To make an Installed Build on Windows, follow these steps:

- Regenerate your Unreal Engine project files.If you encounter error messages when attempting to regenerate project files, double check that you have the Windows DotNet 6.0 runtime installed.

- Use `RunUAT.bat` to create an installed build. The following is an example of a BuildGraph command to create an installed build for Windows:Command Line C++ ```
RunUAT.bat BuildGraph -script=Engine/Build/InstalledEngineBuild.xml -target="Make Installed Build Win64" -nosign -set:GameConfigurations=Development;Shipping -set:WithWin64=true -set:WithAndroid=true -set:WithDDC=false -set:WithLinux=false -set:WithLinuxArm64=false -set:WithIOS=false -set:WithTVOS=false -set:WithMac=false -clean
``` RunUAT.bat BuildGraph -script=Engine/Build/InstalledEngineBuild.xml -target="Make Installed Build Win64" -nosign -set:GameConfigurations=Development;Shipping -set:WithWin64=true -set:WithAndroid=true -set:WithDDC=false -set:WithLinux=false -set:WithLinuxArm64=false -set:WithIOS=false -set:WithTVOS=false -set:WithMac=false -cleanMake sure you specify whether or not every platform that you have available should be added or not. If you have additional platforms not mentioned here in your source code, add `-Set:With[Platform]=true` or `-Set:With[Platform]=false` according to your project’s needs, where [Platform] is replaced with the name of the added platform.The details about the parameters used in the above example are as follows: | Parameter | Required or Optional | Description |
| --- | --- | --- |
| `-target="Make Installed Build Win64”` | Required | Instructs BuildGraph to run a specific operation. This graph of dependencies is described in the script="Engine/Build/InstalledEngineBuild.xml" and there are other options available that may meet your requirements better, but for the purposes of this document our example targets a build that matches what a user would receive from the launcher version of Unreal Engine. |
| `-set With[Platform]=true` or `-set With[Platform]=false` | Required | Specifies whether or not support for a given platform should be added to your installed build, where [Platform] is replaced with the name of a platform you want to enable or disable. **Make sure to add this parameter for every platform you have source code for. **For details on which platforms to enable or disable, refer to the Required Platforms section below. |
| `-set:GameConfigurations=Development;Shipping` | Required | Flag for different versions of the editor. We recommend including **Development **and **Shipping**. |
| `-set WithClient=false` and `-set WithServer=false` | Optional | Specifies whether to create Client and Server builds for network multiplayer projects. Defaults to false. |
| `-set WithDDC=false` | Optional | Specifies whether to create a build that includes Derived Data Cache (-> using-derived-data-cache-in-unreal-engine) support. Defaults to false. |
| `-clean` | Recommended | Performs a fresh recompile of the project. Remove this parameter if you encounter an "Other Compilation Error” message. | If you receive an "Other Compilation Error" message, remove the `-clean` parameter and try again, as there are known issues with this command on Linux.
- Build the Shader Compiler Worker. C++ ```
Engine\Build\BatchFiles\Build.bat ShaderCompileWorker Win64 Development
``` Engine\Build\BatchFiles\Build.bat ShaderCompileWorker Win64 Development

Your build appears in the Windows directory where Feature Packs, Templates, and Engine are located for distribution.

### Required Platforms

When creating installed builds on Windows, make sure you enable the following platforms with the `-With[Platform]` parameter:

| Platform | Parameter | Description |
| --- | --- | --- |
| Android | `-set WithAndroid=true` | Required to support publishing on Android, which is the target platform for most HMI projects. |
| Windows 64-bit | `-set WithWin64=true` | Required to support building the editor on Windows. |

Disable all other platforms, as they are not necessary for either running Unreal Editor or packaging HMI projects.

## Test the Installed Build Executable

Installed builds appear in the LocalBuilds folder under `LocalBuilds/Engine/Linux/Engine/Binaries/Win64`. On the Windows operating system, `UnrealEditor.exe` is the main executable for the Unreal Editor. Run this executable to test your build.

[image: The location of UEEditor.exe]

When you run your installed build for the first time, a prompt appears to ask for firewall permissions. We advise that you accept these permissions for full functionality.

To archive and distribute the build, place your installed build in the top directory of your source control repository alongside the FeaturePacks, Templates, and Engine directories.

[image: An error stating "unable to launch ShaderCompileWorker"]

If you see a prompt stating "Unable to launch ShaderCompileWorker" or experience a crash while compiling shaders, the Shader Compiler Worker has not been built yet. Revisit the last step of the workflow under Make an Installed Build above. We build Shader Compiler Worker separately so that you do not need to rebuild Shader Compiler Worker every time you build the editor.

- android
- installed build
- binaries
- precompiled binaries
- hmi

On this page

- Prerequisites (-> create-an-installed-build-of-unreal-engine)
- Recommended Hardware (-> create-an-installed-build-of-unreal-engine)
- Windows 10 SDK (Windows 10 users only) (-> create-an-installed-build-of-unreal-engine)
- Make an Installed Build (-> create-an-installed-build-of-unreal-engine)
- Required Platforms (-> create-an-installed-build-of-unreal-engine)
- Test the Installed Build Executable (-> create-an-installed-build-of-unreal-engine)

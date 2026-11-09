# Manual Android SDK Setup With Android Studio

https://dev.epicgames.com/documentation/en-us/unreal-engine/manual-android-sdk-setup-with-android-studio-for-unreal-engine?application_version=5.9

> An advanced setup and troubleshooting guide for using Android Studio to integrate Android SDK with Unreal Engine.

[image: Manual Android SDK Setup With Android Studio]

If you are installing the Android SDK for the first time, we recommend using the Automated Android SDK, NDK, and JDK Setup (-> automated-android-sdk-ndk-and-jdk-setup-in-unreal-engine) workflow to install the Android toolchain from within Unreal Engine.

Use the manual workflow in this page if you have conflicting Android SDK installations or need troubleshooting help.

Unreal Engine uses the **Android Software Development Kit (SDK)** distributed with **Android Studio** for all essential Android development components, including the **Android Native Development Kit (NDK) **and **Java Development Kit (JDK)**.

This page explains the workflow for:

- Setting up Android Studio manually.
- Ensuring that Unreal Engine recognizes the Android toolchain components correctly.
- Troubleshooting NDK installations.
- Setting up Android SDK paths to support new and old Unreal Engine installations simultaneously.

## Prerequisites

Before continuing, ensure you're familiar with Unreal Engine's Android SDK Requirements (-> android-development-requirements-for-unreal-engine). Use this page to find the NDK version needed for your Unreal Engine version.

Make sure that **Unreal Editor** and the **Epic Games Launcher** are both closed so there are no problems with either the installation of NDK components or setting your environment variables for the engine.

Unreal Engine 5.3 and newer uses JBR (OpenJDK 17) for its JDK installation, but UE 5.2 and older use JRE (Java 1.8). This means that when you uninstall your previous Android Studio installation, you may lose JRE and cause errors in UE 5.2 and older.

If you need to support UE 5.2 and older, before continuing, locate the JRE directory and copy it somewhere outside the Android Studio directory to avoid losing it. You can then target this folder manually in your older versions of Unreal Engine, and you'll learn how to do this in the **Manually Target SDK Paths** section of this page.

## Install Android Studio

Before setting up the required SDK and NDK components on your computer, you need to install **Android Studio**.

Refer to Android Development Requirements (-> android-development-requirements-for-unreal-engine) for information about which Android Studio and NDK versions are compatible with your current version of Unreal Engine.

To install Android Studio, follow these steps:

- Go to the Android Studio Archive in your web browser. If the Terms and Conditions text doesn't appear properly, refresh the page.
- Scroll to **Android Studio Koala Feature Drop | 2024.1.2 Patch 1 September 17, 2024**. Expand that version and download the appropriate installer or zip file for your operating system.[image: Select Android Studio Koala Feature Drop 2024.1.2 Patch 1 September 17, 2024 on the Android Studio archive page]
- Run the **Android Studio installer**. In the **Android Studio Setup** window, click **Next** to continue.
- In the **Choose Components** page, leave the default components enabled. Click **Next** to continue.
- For **Install Locations**, keep the installation location set to the default path. Click **Next** to continue.If you choose a custom install location, the `SetupAndroid` script will not be able to find files unless you edit it first. We highly recommend keeping the default installation location.
- In the **Choose Start Menu Folder** page, click **Install** to begin the installation process.
- When the installation finishes, click **Next** to begin setting up components.
- When setup completes, make sure the **Start Android Studio** checkbox is enabled and click **Finish** to exit the installer.
- When a new install of Android Studio starts for the first time, the **Android Studio Setup Wizard** appears. Click **Next**.
- Click **Next **through each page in the setup wizard, keeping the **Standard **install type and all default settings, and accepting the license agreements.
- The wizard downloads and installs all required components. When it's done, click **Finish**. The **Welcome to Android Studio** screen appears.

## Set Up Android Studio for First-Time Use

To set up your new Android Studio install, follow these steps:

- In the **Welcome to Android Studio** screen, click **More Actions** and click **SDK Manager**.[image: The Welcome to Android Studio dialog. The SDK Manager option is highlighted in the More Actions dropdown.]
- In the **Android SDK** system settings, next to Android SDK Location, click **Edit** .[image: Edit the Android SDK Location]
- In the **SDK Components Setup** wizard, keep all default selected components, and click **Next** to install them.[image: Installing the SDK Components]
- In the **Verify Settings** page, click **Next** again to continue the installation. When installation completes, click Finish.
- In the **Settings** window, in **Android SDK** settings, click the **SDK Tools** tab. This displays a list of optional components.
- Below the list of tools, select the **Show Package Details** checkbox to display all available SDK components.
- Collapse the tools at the top of the list tool until you see **Android SDK Command-line Tools (latest)**. Select the checkbox next to this component to enable it, click **Apply** to download and install it, and follow the installer.
- When the SDK Component Installer is finished, click **Finish **to close the installer, click **OK** to close the **Settings** window, and close the welcome window.

## Finalize the Android Studio Installation on Your OS

After completing all of the above steps, you need to finalize your installation to make sure your environment is fully set up before proceeding. Each operating system requires a different step to finalize installation.

| Operating System | Required Action |
| --- | --- |
| Windows | Restart your computer. |
| Linux | Close your terminal window and reopen it. |
| macOS | Either close your terminal window and reopen it, or log out and log back in. |

## Reset or Verify Your Environment Variables

If you have moved from Unreal Engine 5.2 and earlier to your current version or need to remove data from old Android toolkit installations, follow these instructions to reset or delete your Android SDK-related environment variables. If you are working with a fresh installation of Unreal Engine and Android Studio, skip this section and continue to **Run the SetupAndroid Script**.

If you have used AGDE for debugging in the past, Unreal Engine and AGDE now target the JBR directory and don’t need separate environment variables.

Resetting environment variables may affect older Unreal Engine installations on your machine. After completing the steps below, you’ll learn how to preserve SDK paths for previous versions of Unreal Engine in the **Manually Target SDK Paths** section of this page.

### Windows Instructions

To reset environment variables from past Unreal Engine or Android SDK installations on Windows, follow these steps:

- Open your computer's **System Properties**.
- Click **Environment Variables**.
- If you have an environment variable named `AGDE_JAVA_HOME`, delete it. This variable is no longer necessary, as both Unreal Engine and AGDE now use the same Java version.
- Delete the following environment variables to reset them: `JAVA_HOME`
- `ANDROID_HOME`
- `NDK_ROOT`
- `NDKROOT`

Environment variables are replaced by the SetupAndroid script in a later step.

### macOS and Linux Instructions

To reset environment variables from past Unreal Engine or Android SDK installations on macOS or Linux, follow these steps:

- Open your shell's configuration file in a text editor. This is typically `~/.zshrc` on macOS (the default shell is zsh) or `~/.bashrc` on Linux (the default shell is usually bash). If you use a different shell, edit its corresponding configuration file.
- If you have an environment variable named `AGDE_JAVA_HOME`, delete its export line. This variable is no longer necessary, as both Unreal Engine and AGDE now use the same Java version.
- Delete the following environment variables to reset them: `JAVA_HOME`
- `ANDROID_HOME`
- `NDK_ROOT`
- `NDKROOT`

Environment variables are replaced by the SetupAndroid script in a later step.

- After saving the file, restart your Terminal application to reload the variables.

## Run the SetupAndroid Script

With the necessary Android SDK components installed, you can use the `SetupAndroid` script to download and install the appropriate version of Android NDK.

To install Android NDK, follow these steps:

- Open your Unreal Engine `Engine/Extras/Android` directory and run the appropriate `SetupAndroid` script for your operating system:`SetupAndroid.bat` – Windows
- `SetupAndroid.command` – Mac
- `SetupAndroid.sh` – Linux.

Once the command line window opens, the script may take a few seconds to start downloading the NDK. If the script prompts you to accept the Android SDK license agreement, enter **Y** and press **Enter **to accept.

- When the installation completes, press any key to dismiss the command prompt.
- Restart your computer for all changes to take effect.

The install directory for NDK should be `C:/Users/Username/AppData/Local/Android/SDK/ndk/`, where `Username` is your login name for your computer. You should see a folder containing the required NDK version in this location.

If you can find your new NDK folder and environment variables, installation was successful and Unreal Engine automatically associates the SDK paths for the Android SDK, the current Android NDK version, and the Java Development Kit (JDK).

## Manually Target SDK Paths in Older Unreal Engine Versions

If you are also still using an earlier version of Unreal Engine (usually 5.0-5.2) alongside Android Studio, you may need to manually target your SDK paths to be compatible.

To find the SDK paths, open **Edit** > **Project Settings**, then go to the **Platforms** > **Android** > **Android SDK** section.

[image: Configure Manual SDKs in Project Settings/Platforms/Android/Android SDK in Unreal Editor]

If these fields are blank, UE falls back on a set of default paths used by the installation process in the previous sections. If you have multiple installations of these components, or have installed them in non-standard directories, you can manually provide their paths here. Alternatively, you can open `BaseEngine.ini` and provide them under the `[/Script/AndroidPlatformEditor.AndroidSDKSettings]` section.

 C++

```
[/Script/AndroidPlatformEditor.AndroidSDKSettings]
    SDKPath = (Path="C:\Filepath")
    NDKPath = (Path="C:\Filepath")
    JDKPath = (Path="C:\Filepath")
```

[/Script/AndroidPlatformEditor.AndroidSDKSettings]
 SDKPath = (Path="C:\Filepath")
 NDKPath = (Path="C:\Filepath")
 JDKPath = (Path="C:\Filepath")

If the entries for SDKPath, NDKPath, and JDKPath do not exist in your `BaseEngine.ini`, they will use the default path to the Android home directory.

- ide
- mobile
- android
- sdk
- android studio
- ndk
- platform delivery
- mobile development

On this page

- Prerequisites (-> manual-android-sdk-setup-with-android-studio-for-unreal-engine)
- Install Android Studio (-> manual-android-sdk-setup-with-android-studio-for-unreal-engine)
- Set Up Android Studio for First-Time Use (-> manual-android-sdk-setup-with-android-studio-for-unreal-engine)
- Finalize the Android Studio Installation on Your OS (-> manual-android-sdk-setup-with-android-studio-for-unreal-engine)
- Reset or Verify Your Environment Variables (-> manual-android-sdk-setup-with-android-studio-for-unreal-engine)
- Windows Instructions (-> manual-android-sdk-setup-with-android-studio-for-unreal-engine)
- macOS and Linux Instructions (-> manual-android-sdk-setup-with-android-studio-for-unreal-engine)
- Run the SetupAndroid Script (-> manual-android-sdk-setup-with-android-studio-for-unreal-engine)
- Manually Target SDK Paths in Older Unreal Engine Versions (-> manual-android-sdk-setup-with-android-studio-for-unreal-engine)

Related documents

Android Development Requirements

 [image: Android Development Requirements] (-> android-development-requirements-for-unreal-engine)Debugging with AGDE in Visual Studio

 [image: Debugging with AGDE in Visual Studio] (-> debugging-unreal-engine-projects-for-android-in-visual-studio-with-the-agde-plugin)Automated Android SDK, NDK, and JDK Setup

 [image: Automated Android SDK, NDK, and JDK Setup] (-> automated-android-sdk-ndk-and-jdk-setup-in-unreal-engine)Android Support

 [image: Android Support] (-> android-support-for-unreal-engine)

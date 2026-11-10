# Android Quick Start

https://dev.epicgames.com/documentation/en-us/unreal-engine/android-quick-start?application_version=5.9

> Configure a project for Android platforms using Unreal Engine.

[image: Android Quick Start]

This quick start guide walks you through the essentials for setting up Unreal Engine for Android game development, including the following topics:

- Setting up your test device and computer for Android game development.
- Configuring new projects for mobile development.
- Setting up Unreal Editor for packaging Android builds.
- Setting the Editor to preview with mobile rendering feature levels.
- Testing your project on-device from the Editor.
- Packaging a standalone build of your project.

Once you’ve completed this guide, you’ll be prepared to take an Android project from initial setup to testing and packaging.

## Android Development Prerequisites

The following is a list of development prerequisites:

Since August 31, 2025, the Google Play Store requires both new apps and app updates to target Android 15 (API level 35). Apps built with versions of UE that target a lower API level won't submit successfully — neither for new submissions nor for updates to existing apps. To publish or update apps on Google Play, you must use UE 5.7 or newer, which provides target SDK 35 support.

Existing apps that are not being updated must already target API level 34 to remain available to new users on devices running newer versions of Android. Apps targeting API level 33 or lower will only be served to devices on the same or older OS version.

For more information, see the Android documentation on Google Play's target API level requirement.

- Current UE Version: 5.8
- Android Studio Version: Koala 2024.1.2 Patch 1 September 17, 2024
- Android SDK:Recommended target SDK: SDK 35
- Minimum target SDK for compilation: SDK 34
- Minimum install SDK level: SDK 26Different stores have their own target SDK minimum requirements, which may differ from that mentioned above.

- NDK Version: r27c
- Build-tools: 35.0.1
- Java runtime: OpenJDK 21.0.3 2024-04-16
- AGDE v23.2.91+ required for AGDE debugging (-> debugging-unreal-engine-projects-for-android-in-visual-studio-with-the-agde-plugin).

Unreal Engine 5.8 supports Android devices meeting the following specifications:

- Android 8 or higher
- 64-bit Arm-based CPU
- UE 5.6 supports both 4KB and 16KB page sizes
- Compatible GPUsMali-T8xx, G5x, G6x, G7x, G6xx, G7xx, and G9xx series
- Adreno 5xx, 6xx, 7xx, and 8xx series
- PowerVR Rogue (GM9446 and newer), and IMG B-series and newer (BXM, BXT, CXT, DXT)
- Samsung Xclipse 5xx and 9xx series

- Compatible Graphics APIsOpenGL ES 3.2
- Vulkan 1.1 on Android 10 or later devices with compatible drivers

## Set Up Your Android Device

To set up your Android device for development, follow these steps:

- On the device that you want to use for testing, open **Settings **and enable **Developer Mode **by tapping the **Build number **seven times. You may be prompted to verify your device pin.
- In your device’s **Settings**, locate **Developer Options**.
- In **Developer Options**, enable **USB Debugging**.
- Plug your device into your computer, then allow your computer to access your device's data.
- Permit your computer to install any needed drivers for your device.

For a deeper dive into setting up your Android device, see Setting up Your Android Device for Development (-> setting-up-your-android-device-for-developing-applications-in-unreal-engine).

## Create a Project

To set up a mobile project, follow these steps:

- Open **Unreal Editor**. In the **Project Browser**, click **Games**.
- Select the game template that best suits your project.
- Under **Project Defaults**, select either **Blueprint** or **C++**. Choose the option that best suits your project.
- Set **Target Platform **to **Mobile**.
- Set **Quality** **Preset **to **Scalable**.
- Next to **Project Name**, enter a name for your project. Your Project Browser should now look similar to the image below.
- Click **Create**.

 Your project will open in Unreal Editor.

For a deeper dive into the project specifications shown in the images above, see Creating a Mobile Project (-> setting-up-an-unreal-engine-project-for-mobile-platforms).

## Set Up Android SDK, NDK, and JDK Using Turnkey

Unreal Engine includes Turnkey, an automation tool that installs everything required to build for Android without manual configuration. Turnkey includes the following:

- Android command-line tools.
- Android Studio.
- The SDK / NDK / JDK versions that are verified against your engine release.

To set up your SDK, NDK, and JK using Turnkey, follow these steps:

- In the **Unreal Editor**, in the menu bar, click **Platforms > SDK Management > Android > Install SDK**.
- A toast will appear displaying** Installing Sdk for Android…**
- Follow the on-screen prompts. Turnkey will:Install Android Studio (if not already present).
- Download the Android command-line tools.
- Install the SDK, NDK, and JDK versions required by your engine release.
- Set the `ANDROID_HOME, JAVA_HOME`, and related environment variables.

For more information on Android SDK setup, see Setting Up Android SDK and NDK (-> set-up-android-sdk-ndk-and-android-studio-using-turnkey-for-unreal-engine).

If you need to manage your Android toolchain manually — for example, to pin a specific Android Studio version or set up a headless build agent — see Advanced Android SDK Setup (-> advanced-setup-and-troubleshooting-guide-for-using-android-sdk) instead.

## Configure Your Project for Android

To configure your Unreal Engine Project Settings for Android, follow these steps:

- In the menu bar, click **Edit > Project Settings**. The Project Settings window will open.
- In **Project Settings**, navigate to **Platforms > Android**.
- Under **APK Packaging**, find the **Android Package Name **and fill it with an appropriate company and project name. The example below uses **com.EpicGames.AndroidQuickStart**.
- Under **APK Packaging**, find the **Minimum SDK Version **and **Target SDK Version **fields. Enter the target Android API device version for your project. The example below uses SDK Version 26 and SDK Version 35.
- Under **APK Packaging**, you’ll see a warning that reads **Project is not configured for the Android platform**. Click **Configure Now **to configure your project to write the required platform files.
- If the **Accept SDK License** button is enabled, click it to accept Android's SDK license agreement. If you have previously accepted this agreement, you won’t need to complete this step.
- Under Google Play Services, you’ll see a warning that reads **Project is not configured for the Google Play services**. Click the **Configure Now** button to configure your project to write the required files.

Your project can now create Android builds and launch on an Android device.

## Launch on an Android Device

**Quick Launch** is the fastest way to test your project on a device. Quick Launch cooks, packages, and deploys your project in one step. To package a standalone APK for distribution or testing, see Package an Android Build.

To get started with Quick Launch, follow these steps:

- Connect your Android device to your machine with a USB cable, or pair over Wi-Fi.USB connection is recommended for the first deployment.
- Confirm **Developer Mode **and **USB** **Debugging **are enabled, and accept the **Allow USB debugging?** prompt that appears on the device.
- In the Editor, in the main toolbar, open the **Platforms **dropdown. Your device should appear in the **Quick Launch Current Level **section.
- Click the device's name.

Unreal Engine will cook, package, and deploy the project to that device. You can monitor progress on the toast that appears in the bottom right-hand corner of the screen.

When the deployment has finished, the project should automatically start running on your Android device. If the project fails to automatically start, find your app on your device and tap it to launch manually.

## Package an Android Build

To package a standalone APK for distribution and testing, follow these steps:

- In the menu bar, click **Platforms > Package Project > Android. Select Android (Multi:ASTC,DXT,ETC2)** option.
- Click on **Platforms > Package Project > Package Project**.
- In the **Package project **dialogue, choose a destination folder to save your project and click **Select Folder**.

Unreal Editor will begin packaging your project. If you navigate to the destination folder, you’ll find the APK and OBB files necessary to install your game on an Android device. There are also a pair of `.bat` files for installing or uninstalling your build on a connected device.

For more information on configuring the packaging settings for Android builds, see Packaging Android Projects (-> packaging-android-projects-in-unreal-engine).

## On Your Own

You’re now prepared to package and distribute your Unreal Engine projects to general Android devices.

Depending on your project's needs and the devices that you’re targeting, further configuration is required in order to optimize your builds. The following links provide more information for building your projects:

- [image: Android Development Reference] Android Development ReferenceHow to install different Android SDKs, set environment variables, and work with texture formats. (-> android-development-basics-for-unreal-engine)

- [image: Android Development Requirements] Android Development RequirementsAndroid development requirements including compatible hardware, software, and SDK information. (-> android-development-requirements-for-unreal-engine)

- [image: Debugging Android Projects] Debugging Android ProjectsHow to debug your Android project in Android Studio (-> debugging-unreal-engine-projects-for-android-using-android-studio)

- [image: Mobile Rendering Features] Mobile Rendering FeaturesLearn about Unreal Engine's mobile rendering path. (-> mobile-rendering-features-in-unreal-engine)

- [image: Packaging and Publishing for Android] Packaging and Publishing for AndroidGuides for distribution on Android platforms (-> packaging-and-publishing-android-projects-in-unreal-engine)

- mobile
- android
- startingout
- platform delivery

On this page

- Android Development Prerequisites (-> android-quick-start)
- Set Up Your Android Device (-> android-quick-start)
- Create a Project (-> android-quick-start)
- Set Up Android SDK, NDK, and JDK Using Turnkey (-> android-quick-start)
- Configure Your Project for Android (-> android-quick-start)
- Launch on an Android Device (-> android-quick-start)
- Package an Android Build (-> android-quick-start)
- On Your Own (-> android-quick-start)

Related documents

Mobile Development

 [image: Mobile Development] (-> getting-started-with-mobile-development-in-unreal-engine)Android Support

 [image: Android Support] (-> android-support-for-unreal-engine)

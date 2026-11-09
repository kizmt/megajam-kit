# Automated Android SDK, NDK, and JDK Setup

https://dev.epicgames.com/documentation/en-us/unreal-engine/automated-android-sdk-ndk-and-jdk-setup-in-unreal-engine?application_version=5.9

> Set up SDK and NDK components automatically from Unreal Engine with Turnkey.

[image: Automated Android SDK, NDK, and JDK Setup]

Unreal Engine includes **Turnkey**, an automation tool that installs everything required to build Unreal Engine projects for Android without manual configuration. This Android toolchain includes the Android command-line tools, Android Studio, and the SDK, NDK, and JDK versions verified against your engine release.

## Prerequisites

- Ensure you're familiar with Unreal Engine's Android Development Requirements (-> android-development-requirements-for-unreal-engine).
- This automated workflow is updated in Unreal Engine 5.8. If you are using Unreal Engine 5.7 or earlier, see the previous version of this workflow (-> set-up-android-sdk-ndk-and-android-studio-using-turnkey-for-unreal-engine).
- For Turnkey to install the Android toolchain properly, you must have a fresh system with no previous Android Studio installations or environment variables. If you'd like to use the automated install workflow explained on this page but have installed Android Studio or Android SDK before, first follow the steps below to remove data from past installations.For manual SDK Installation instructions that support past Android Studio installations, see Set Up iOS, iPadOS, and tvOS Devices for Development (-> set-up-ios-ipados-and-tvos-devices-for-development-in-unreal-engine).

### Remove Previous Android Studio and SDK Installations

To reset your Android setup to a clean state and prevent old Android Studio or SDK installations from interfering with Unreal Engine's automated Android SDK installation, follow these steps:

- Uninstall any existing Android Studio instances.
- Delete the SDK directory from your user profile (`%LOCALAPPDATA%\Android\Sdk` on Windows, `~/Library/Android/sdk` on macOS).
- Remove the `ANDROID_HOME`, `ANDROID_SDK_ROOT`, `NDKROOT`, and `JAVA_HOME` environment variables, as well as any related Android variables you have set.
- Restart Unreal Editor.

For additional help removing old Android SDK environment variables, see the **Reset or Verify Your Environment Variables** section of Set Up iOS, iPadOS, and tvOS Devices for Development (-> set-up-ios-ipados-and-tvos-devices-for-development-in-unreal-engine).

## Install the Android Toolchain With Turnkey

Unreal Engine uses an Unreal Automation Tool script named Turnkey to distribute SDKs throughout teams. You can run Turnkey and install Android tools from within Unreal Editor or from a command line. Turnkey automatically downloads and installs the Android toolchain for you.

During the SDK install and setup process, Turnkey:

- Installs Android Studio (if not already present).
- Downloads the Android command-line tools.
- Installs the SDK, NDK, and JDK versions required by your engine release.
- Sets the `ANDROID_HOME`, `JAVA_HOME`, and other environment variables.

For more information about Turnkey, see the Unreal Turnkey (-> automating-platform-and-sdk-management-with-unreal-turnkey) documentation.

### Run Turnkey From Unreal Editor

To run the Android Turnkey installation process from Unreal Editor, follow these steps:

- Open Unreal Editor.
- Click **Platforms > SDK Management > Android > Install Sdk**.A message appears saying the SDK is installing.
- Follow the on-screen prompts, including the following:A separate command-prompt window opens and install pauses while waiting for Android SDK license acceptance. Bring the command prompt to the foreground and enter **Y** to accept the licenses and continue with SDK installation.
- If your workspace is not configured for AutoSDK, the editor may prompt you about AutoSDK during the install. Click **No **to continue the installation without AutoSDK. Only click **Yes **if you have a Perforce depot prepared with the appropriate Android tooling layout. This is optional.

After the Android Studio install completes, Turnkey attempts to set up an Android emulator. This step may fail with an "Android SDK not found" error in some configurations. The SDK itself is installed correctly and is unaffected.

### Run Turnkey From a Command Line

To run the Android Turnkey installation process from a command line, follow these steps:

- Open a terminal or command prompt.
- Change directory to your Unreal Engine installation's `Engine/Build/BatchFiles/` folder.
- Run the Turnkey command for your platform:**Windows** Command Line ```
RunUAT.bat Turnkey -Command=InstallSDK -platform=Android -SdkType=Full -BestAvailable -Unattended -nocompile -nocompileuat
``` RunUAT.bat Turnkey -Command=InstallSDK -platform=Android -SdkType=Full -BestAvailable -Unattended -nocompile -nocompileuat
- **macOS or Linux**: Command Line ```
./RunUAT.sh Turnkey -Command=InstallSDK -platform=Android -SdkType=Full -BestAvailable -Unattended -nocompile -nocompileuat
``` ./RunUAT.sh Turnkey -Command=InstallSDK -platform=Android -SdkType=Full -BestAvailable -Unattended -nocompile -nocompileuat

- Follow the on-screen prompts, including the following: When installation stalls and a new command-line window appears asking to accept the Android SDK license agreement, enter **Y** in the new window to accept.
- If Turnkey asks if you'd like to create a workspace for AutoSDK, click **No **unless you have have a Perforce depot prepared with the appropriate Android tooling layout. This is optional.

After the Android Studio install completes, Turnkey attempts to set up an Android emulator. This step may fail with an "Android SDK not found" error in some configurations. The SDK itself is installed correctly and is unaffected.

## Finalize and Verify Your SDK Setup

To finalize the Android SDK installation and make sure it works correctly, follow these steps:

- Close Unreal Editor or your command line.
- To finalize your Android environment variables, log out of your machine and then log back in.
- Open Unreal Editor and go to the **Platforms > SDK Management > Android** menu. The allowed version and installed version of the SDK should match, and you should not see an option to install or repair Android SDK.

The Turnkey installation process immediately downloads the command-line tools, NDK, and JDK, but it doesn't download your target API level's matching SDK until you package a project for that API level. Until you've packaged a project, the SDK may not appear in Android Studio's SDK Manager or Unreal Engine's **Platforms **menu.

## Troubleshooting

The information below covers behaviors you may encounter during Turnkey's Android toolkit installation and how to handle them. See the Advanced Android SDK Setup (-> advanced-setup-and-troubleshooting-guide-for-using-android-sdk) guide for additional diagnostic steps.

### Android SDK Installation Stalls

The notification dialog for the SDK installation does not always close itself when the install succeeds. If the editor log indicates the installation completed and the **Platforms > SDK Management > Android** menu shows a valid installation, you can safely click **Cancel **in the installation progress dialog window. This is a UI-only issue and does not affect the installed SDK.

### Installation Error in Unreal Editor Log

Android Studio's command-line installer does not always return a success exit code on a successful install, so the editor log may show error lines even when the installation completed normally. If the **Platforms > SDK Management > Android** menu shows a valid installation after the flow finishes, the install was successful regardless of the log warnings.

- android
- platform development
- android sdk
- android ndk
- android turnkey
- android jdk
- android jni

On this page

- Prerequisites (-> automated-android-sdk-ndk-and-jdk-setup-in-unreal-engine)
- Remove Previous Android Studio and SDK Installations (-> automated-android-sdk-ndk-and-jdk-setup-in-unreal-engine)
- Install the Android Toolchain With Turnkey (-> automated-android-sdk-ndk-and-jdk-setup-in-unreal-engine)
- Run Turnkey From Unreal Editor (-> automated-android-sdk-ndk-and-jdk-setup-in-unreal-engine)
- Run Turnkey From a Command Line (-> automated-android-sdk-ndk-and-jdk-setup-in-unreal-engine)
- Finalize and Verify Your SDK Setup (-> automated-android-sdk-ndk-and-jdk-setup-in-unreal-engine)
- Troubleshooting (-> automated-android-sdk-ndk-and-jdk-setup-in-unreal-engine)
- Android SDK Installation Stalls (-> automated-android-sdk-ndk-and-jdk-setup-in-unreal-engine)
- Installation Error in Unreal Editor Log (-> automated-android-sdk-ndk-and-jdk-setup-in-unreal-engine)

Related documents

Android Development Requirements

 [image: Android Development Requirements] (-> android-development-requirements-for-unreal-engine)Advanced Android SDK Setup

 [image: Advanced Android SDK Setup] (-> advanced-setup-and-troubleshooting-guide-for-using-android-sdk)Android Support

 [image: Android Support] (-> android-support-for-unreal-engine)

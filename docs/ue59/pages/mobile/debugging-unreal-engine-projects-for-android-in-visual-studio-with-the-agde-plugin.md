# Debugging with AGDE in Visual Studio

https://dev.epicgames.com/documentation/en-us/unreal-engine/debugging-unreal-engine-projects-for-android-in-visual-studio-with-the-agde-plugin?application_version=5.9

> Use AGDE to debug Android projects in Visual Studio

[image: Debugging with AGDE in Visual Studio]

**Unreal Engine (UE)** supports debugging with the **Android Game Development Extension (AGDE) Plugin** for **Visual Studio**, which provides debugging and profiling tools for Android projects in Visual Studio without the need to switch environments to Android Studio. This is the recommended debugging environment for Android projects in UE for Windows users.

This guide will walk you through the process of downloading and enabling this plugin, and provide links to helpful resources for using it.

## Downloading and Installing the AGDE

To install the AGDE plugin and set up your project's solution to work with it, follow these steps:

- Make sure you have installed **Visual Studio 2022** and are using it as your default Visual Studio version for Unreal Engine.
- Download the AGDE plugin from the Android Developer page. The current version of UE requires AGDE version of 23.1.82 or higher.
- Install the AGDE Plugin to Visual Studio.
- Locate the .uproject file for your project, right-click it to open the context menu, then click **Generate Project Files** to regenerate your Visual Studio solution.

The new solution files will have the plugin enabled by default.

## Verify your JDK Environment Variables

Starting with Unreal Engine 5.3, both AGDE and Unreal Engine require **OpenJDK 17.0.6 2023-01-17** as their target version of JDK. If you are working with a fresh installation of Android Studio and Unreal Engine 5.3 and later, no additional steps are required, as the Android SDK setup process for UE automatically sets up this version of JDK. If you are migrating from an earlier version of UE, follow these steps:

- Open your **System Settings** and click **Environment Variables**.
- If you see an environment variable called `AGDE_JAVA_HOME`, delete it.
- Make sure that `JAVA_HOME` points to `C:\Program Files\Android\Android Studio\jbr`.

If you need to maintain an installation of an earlier version of Unreal Engine, refer to Setting Up Android SDK and NDK for information on how to manually target SDK paths in UE. If you are working with an earlier version of Unreal Engine, refer to the documentation for that version.

## Launch a Project With AGDE

AGDE can debug or attach to Unreal Engine applications on your Android device. This requires you to set some configuration options in Visual Studio, and you also need to package an APK before using AGDE, as it can compile your Android project's code but can not cook content. Follow these steps to launch your project on your device.

- Use the **BuildCookRun **command to package your project for Android. You can also use **Turnkey** or the **Platforms** dropdown in **Unreal Editor**.[image: Click the Platforms dropdown to package your project from the editor]Refer to Build Operations and Cooking Content for more information about the cooking and packaging process.
- Open your project's Visual Studio solution.
- Set your **Solution Configuration **to **DebugGame** and your **Solution Platform** to **Android**.
- Plug the Android device you want to test with into your computer with a USB cable. When the device asks if you want to grant permission for USB debugging or permission for the computer to access the device's data, grant it.When using a USB connection, make sure the cable and port on your computer both support data.
- The button to build and debug your project should now display the device's name. Either click it or press **F5** to begin debugging. You may need to wait for the debugger.If you encounter a SIGILL error, press F5 to skip through the error and continue running AGDE.

The project will build and launch on your device, and you will be able to use Visual Studio's debugging tools just like you would for a Windows application.

## Attach AGDE to an Application

To attach to a running instance of your Unreal Engine application, follow these steps:

- Click the **Debug** dropdown in the toolbar, then click **Attach to Process**.[image: Click Debug > Attach to Process]
- Set the **Connection Type** to **Android Game Development Extension**.
- Click the **Connection Target** dropdown and click the entry for your device.
- Select the process for your application, then click **Attach**.[image: Choose the process to attach to from the menu]

## Troubleshooting

This section provides fixes and troubleshooting tips for issues that can occur when debugging with AGDE.

### Fix Asserts on Android 14 Devices

AGDE may throw an assert when running on Android 14 devices. To fix this assert, follow these steps:

- In Visual Studio, Open your project's **Configuration Properties** and click **Debugging**.
- In LLDB Post Attach Commands, add the following:LLDB Post Attach Commands C++ ```
process handle --pass true --stop false --notify true SIGBUS
``` process handle --pass true --stop false --notify true SIGBUS[image: LL DB Post Attach Commands]Under Configuration Properties > Debugging, fill LLDB Post Attach Commands with the text above.

##

- debugging
- visual studio
- profiling
- android
- agde
- platform delivery

On this page

- Downloading and Installing the AGDE (-> debugging-unreal-engine-projects-for-android-in-visual-studio-with-the-agde-plugin)
- Verify your JDK Environment Variables (-> debugging-unreal-engine-projects-for-android-in-visual-studio-with-the-agde-plugin)
- Launch a Project With AGDE (-> debugging-unreal-engine-projects-for-android-in-visual-studio-with-the-agde-plugin)
- Attach AGDE to an Application (-> debugging-unreal-engine-projects-for-android-in-visual-studio-with-the-agde-plugin)
- Troubleshooting (-> debugging-unreal-engine-projects-for-android-in-visual-studio-with-the-agde-plugin)
- Fix Asserts on Android 14 Devices (-> debugging-unreal-engine-projects-for-android-in-visual-studio-with-the-agde-plugin)
- (-> debugging-unreal-engine-projects-for-android-in-visual-studio-with-the-agde-plugin)

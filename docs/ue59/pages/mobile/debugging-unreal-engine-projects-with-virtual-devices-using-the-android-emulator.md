# Android Emulator

https://dev.epicgames.com/documentation/en-us/unreal-engine/debugging-unreal-engine-projects-with-virtual-devices-using-the-android-emulator?application_version=5.9

> Use the Android Emulator to launch a virtual device, then test your Unreal Engine apps on it.

[image: Android Emulator]

###### Prerequisite topics

In order to understand and use the content on this page, make sure you are familiar with the following topics:

- Setting Up Android SDK and NDK (-> set-up-android-sdk-ndk-and-android-studio-using-turnkey-for-unreal-engine)

You can launch **Unreal Engine (UE)** applications for **Android** on the **Android Emulator** included with **Android Studio**, providing a way to test on a wide range of virtual Android devices without relying on a stock of physical devices. Once you have a virtual device set up, launch your application using Unreal Editor or UAT like you would with a physical device. This page provides a guide to:

- Setting up a virtual device.Required specifications for running on Unreal Engine.

- Launching the virtual device on your desktop.
- Playing builds of your projects on your virtual device.
- Debugging on a virtual device.

## Set Up a Virtual Device

By default, virtual devices in Android Studio are set up with roughly 256 MB of RAM and a limited amount of internal storage. You need to override these with the following specifications to be able to run Unreal applications reliably:

- **RAM:** At least **4 GB**
- **Internal Storage:** Twice the size of your packaged game.

To create a new device and set it up according to these specifications, follow these steps:

- Open **Android Studio**.
- Open the **Device Manager**.If you do not have an Android Studio project to load, in the **Welcome to Android Studio** dialog, click the **More Actions** dropdown and select **Virtual Device Manager.[image: The Welcome to Android Studio dialog. The More Actions dropdown is clicked and the Virtual Device Manager is highlighted.]
- If you have an Android Studio project open, click **Tools** > **Device Manager**.[image: The Tools dropdown in Android Studio, with a project open. The Device Manager is highlighted.]

- When the Device Manager panel appears, click the **+** symbol and click **Create Virtual Device**. This opens the Virtual Device Configuration window.[image: The Device Manager panel. The + button is clicked, and Create Virtual Device is highlighted.]
- In the Virtual Device Configuration window, right-click a profile for an existing device and click **Clone**. This opens the Hardware Profile Configuration window. This example uses the **Pixel 8 Pro** as a base.[image: The Select Hardware dialog. The Pixel 8 Pro entry is highlighted in the hardware list, and the user has right-clicked. The Clone button is highlighted in the context menu.]
- Set the following parameters for your device:**Device Name:** Rename it using a naming convention that suits your organization. This example adds the suffix `(UE)` to denote that this hardware profile is tuned for UE.
- **Memory**: Set your device's RAM to at least 4 GB.

- Click **Finish** to return to the Virtual Device Configuration window.
- Select your custom profile, then click **Next**.[image: The Select Hardware Dialog. The custom Pixel 8 Pro (UE) profile is selected.]
- You will be prompted to select a **System Image**. Select Vanilla Ice Cream or later. Make sure whatever version you choose supports **API 35** or later. When you are ready to proceed, click **Next**.If the System Image you want is grayed out, or if you can't click the Next button after selecting it, click the download button next to the release name, which will install the components needed for that device image.If you do not use a system image that is compatible with Android 35, you can't run arm64. Instead, you need to target x86-64.

- You will be prompted to verify your configuration. Click **Show Advanced Settings**.[image: The Android Virtual Device Configuration dialog. The Show Advanced Settings button is highlighted near the bottom.]
- In the advanced settings, make sure you have the following settings for **Memory and Storage**:Double-check that the **RAM **is at **4 GB** or greater. The dropdown defaults to MB, so check that you switch it to GB or increase the memory accordingly before proceeding.
- Set the **Internal Storage **to roughly twice the size of your game. For example, if your game is expected to be 2 GB in size, set this value to 4 GB.

[image: The Android Virtual Device configuration dialog. RAM is set to 4 GB, Internal Storage is set to 4 GB.]

- Click **Finish **and the device will appear in the list of devices you can launch. You can click the **Play** button to start running your application. This may take a few minutes as the emulator loads up.[image: The Device Manager panel. The custom Pixel 8 Pro (UE) profile is available in the device list, and the virtual device is running.]

### Set Up Required Android Features For Your Virtual Device

For your virtual device to fully support UE projects, you need to enable some graphics features for it:

- Open the `Users/Username/.Android` folder.
- Open `AndroidFeatures.ini`.If an `AndroidFeatures.ini` file does not exist, create one.

- Add the following variables:`Vulkan=on`.
- `GLDirectMem=on`. This enables hardware GPU acceleration.

## Run Your Android Virtual Device

You need to run your virtual device in the Android emulator to launch applications on your virtual device and attach debug processes to it. You can think of this as the emulator equivalent of turning your device on and hooking it up to your computer in developer mode. You can launch from Android Studio, or you can launch a standalone version of the emulator.

### Launch From Android Studio

To launch your virtual device from Android Studio:

- Open Android Studio, then click **Tools **> **Device Manager**.
- In the **Device Manager**, click the **Play** button next to the device you want to launch.

The emulator will take a few minutes to load, but once it is loaded, you can control the virtual device with your mouse as you would a touchscreen.

### Launch a Standalone Emulator From Your Desktop

You can launch it from Android Studio from the **Device Manager**, or you can follow these steps to launch a standalone version of the emulator:

- Open the Android SDK root directory, then open the `Emulator` folder. You should see an executable called `Emulator.exe`.
- Use a command line to run this executable with the argument `-avd=[name of virtual device profile]`. For example, if you named your profile Pixel8_UE, you would run with the argument `-avd=Pixel8_UE`.

The Android Emulator will display your virtual device on your desktop.

## Launch Your UE Application On a Virtual Device

Once your Android Emulator is running, it will be visible to UE through the Device Manager and the Platforms dropdown in Unreal Editor.

[image: The Platforms dropdown. The virtual device is highlighted at the top of the list.]

See the Build Operations (-> cooking-content-in-unreal-engine) guide for more information.

While you specified a name for your virtual device's profile in Android Studio, this is not the same as the name of an instance of that virtual device. Double-check the device's name before providing the device name in command line arguments.

## Debugging On a Virtual Device

As long as your Android virtual device is running, you can debug on it with Android Studio or Visual Studio using AGDE the same way you could with a physical device. However, to use the debugger, your Android app's architecture needs to match your PC's host architecture. For example:

- If you are running on an x86_64 PC or an Intel mac, your app must be set to use the x86_64 architecture to debug on your desktop.
- If you are using an Apple Silicon Mac or an arm64 Linux machine, your app must be set to use the arm64 architecture to debug on your desktop.

You can also take advantage of the following debugging and profiling resources:

- Using Android File Server and Unreal Android File Tool (-> android-file-server-for-unreal-engine) for debugging and file management.
- Running Traces with Unreal Insights (-> how-to-use-unreal-insights-to-profile-android-games-for-unreal-engine).

- android
- android emulator
- testing on android
- debugging on android
- virtual device

On this page

- Set Up a Virtual Device (-> debugging-unreal-engine-projects-with-virtual-devices-using-the-android-emulator)
- Set Up Required Android Features For Your Virtual Device (-> debugging-unreal-engine-projects-with-virtual-devices-using-the-android-emulator)
- Run Your Android Virtual Device (-> debugging-unreal-engine-projects-with-virtual-devices-using-the-android-emulator)
- Launch From Android Studio (-> debugging-unreal-engine-projects-with-virtual-devices-using-the-android-emulator)
- Launch a Standalone Emulator From Your Desktop (-> debugging-unreal-engine-projects-with-virtual-devices-using-the-android-emulator)
- Launch Your UE Application On a Virtual Device (-> debugging-unreal-engine-projects-with-virtual-devices-using-the-android-emulator)
- Debugging On a Virtual Device (-> debugging-unreal-engine-projects-with-virtual-devices-using-the-android-emulator)

Related documents

Android File Server

 [image: Android File Server] (-> android-file-server-for-unreal-engine)Unreal Insights on Android Devices

 [image: Unreal Insights on Android Devices] (-> how-to-use-unreal-insights-to-profile-android-games-for-unreal-engine)

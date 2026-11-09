# Android Vulkan Mobile Renderer

https://dev.epicgames.com/documentation/en-us/unreal-engine/using-the-android-vulkan-mobile-renderer-in-unreal-engine?application_version=5.9

> Information about Vulkan compatibility and how to use the Vulkan mobile renderer in Android projects

[image: Android Vulkan Mobile Renderer]

**Unreal Engine** (UE) has built-in support for the **Vulkan** graphics API. Vulkan is a low-overhead, cross-platform 3D graphics library that gives developers more control over the GPU and lower level CPU usage for their Android base mobile projects. The following document shows how you can enable and use Vulkan in your UE Android projects.

## Vulkan Video Drivers for PC Development

To make sure that you can visualize the rendering options Vulkan has available on your development PC, you will need to make sure you download and install the latest version of video card drivers for your graphics card. Below you will find the minimal driver version you need to use to be able to preview what Vulkan will look like on your development PC.

- NVIDIA: 390.0 or later
- AMD: 17 or later

## Checking Vulkan Device Compatibility

Determining if your smartphone supports the Vulkan rendering API can be challenging due to the wide range of Android smartphones on the market. To help you quickly find out if your smartphone supports the Vulkan API, it is recommended to install the following program from Google Play Store: Hardware Caps Viewer for Vulkan.

The Vulkan Hardware Capability Viewer is a client tool aimed at developers needing to gather hardware implementation details for devices that support the new Vulkan Graphics API.

## Supported Vulkan Devices

The following devices have Vulkan-specific profiles available in addition to non-Vulkan profiles:

- Adreno 6xx
- Mali G72
- Mali G76
- Mali G77
- PowerVR GM9xxx
- Samsung XClipse series

If your device uses Android 9 or higher and you have Vulkan enabled as a feature level for your project, it will use the Vulkan-enabled version of these GPU families' device profiles.

Please note that the ability to use the Vulkan API depends on if your mobile carrier has released the Vulkain update for your specific device variant. To find if this support has been pushed to your mobile device, you will need to contact your mobile carrier.

## Building for Vulkan

To build a UE project that has support for the Vulkan API you will need to do the following:

- Before you begin, make sure that you have your Android smartphone plugged into your development PC via USB and that your Android smartphone has developer mode enabled.
- Launch the UE Editor and create a new project using the **Games > Blank** template using the following settings:**Blueprint Project** enabled
- **Mobile** enabled
- **Maximum Quality** enabled
- **Starter Content** disabled

When that is completed, press the **Create** button to create and load the new project.

[image: Creating Project setup] Click image for full view.

- Once the project has loaded, go to **Edit > Project Settings**, then under **Engine**, go to the **Rendering** section and make sure that **Mobile HDR** has been enabled under **VR**.[image: Enable Mobile HDR option] Click image for full view.
- In the **Project Settings**, navigate to the **Platforms**, go to the **Android** section, make sure that the following options are enabled under **Build**:**Support OpenGL ES3.2**
- **Support Vulkan**[image: Set Build options] Click image for full view.

- From the menu bar, click on the **Platform** button, go to **Android**, make sure, that **Android(ASTC)** option is selected and click on **Package Project**.[image: Launch packaging project process]
- Select a location for UE to save the Android build and then press the **Select Folder** button to start the packaging process.[image: Set packaging project folder]
- When the packaging process has been completed, open up the folder that the packaged build was placed in. Inside this folder, you should see two `BAT` files. Locate the `BAT` file that has the word **Install** in the name and double-click on it to install it to your device.[image: Launch installation to device]
- Once installed on your device, press on the UE icon that has your project name under it to launch the project on the device.[image: Example of the project on device] Click image for full view.

## Enabling Vulkan Preview Rendering in Editor

If you have enabled Vulkan in your project as described above, a preview rendering option will appear automatically. On the **Main Toolbar**, click on the **Settings** button and go to the **Preview Rendering Level** option. Select the **Android Vulkan** option to enable the Vulkan preview in the UE Viewport.

[image: Set Preview Rendering Level]

The Viewport should read **Feature Level: Android Vulkan ES31** in the lower-right corner.

After doing this, the Editor will need to recompile the entire shader cache to include the required Vulkan options. Depending on the size of your project and power of your development computer, this process could take anywhere from a few minutes, to an hour or more to complete.

- rendering
- mobile
- android
- platform delivery

On this page

- Vulkan Video Drivers for PC Development (-> using-the-android-vulkan-mobile-renderer-in-unreal-engine)
- Checking Vulkan Device Compatibility (-> using-the-android-vulkan-mobile-renderer-in-unreal-engine)
- Supported Vulkan Devices (-> using-the-android-vulkan-mobile-renderer-in-unreal-engine)
- Building for Vulkan (-> using-the-android-vulkan-mobile-renderer-in-unreal-engine)
- Enabling Vulkan Preview Rendering in Editor (-> using-the-android-vulkan-mobile-renderer-in-unreal-engine)

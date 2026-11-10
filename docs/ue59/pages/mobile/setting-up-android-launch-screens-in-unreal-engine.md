# Setting up Android Launch Screens

https://dev.epicgames.com/documentation/en-us/unreal-engine/setting-up-android-launch-screens-in-unreal-engine?application_version=5.9

> Overview of setting up optional custom Android Launch screens for Android projects.

[image: Setting up Android Launch Screens]

Support for custom launch screens in **Android** projects is available inside the **Project Settings** under the **Platforms > Android > Launch Images** section.
You can set the background, portrait, or landscape images used as well as whether or not the feature is enabled/disabled (refer to the table below for more information).

Launch Images Options

| Option | Description |
| --- | --- |
| **Show Launch Image** | Shows the launch image as a startup splash screen. If enabled, either or both launch images selected for the project will be included depending on the orientation setting in the project. |
| **Download Background Vertical Image** | Used as the background for OBB downloading when a device is in a vertical orientation. |
| **Download Background Horizontal Image** | Used as the background for OBB downloading when a device is in a horizontal orientation. |
| **Launch Portrait** | Used as a splash screen for applications with Portrait, Reverse Portrait, Sensor Portrait, Sensor or Full Sensor orientation. |
| **Launch Landscape** | Used as a splash screen for applications with Landscape, Sensor Landscape, Reverse Landscape, Sensor or Full Sensor orientation. |

You can change your application's orientation settings in Project Settings. Navigate to **Platforms > Android > APK Packaging** and click the **Orientation** dropdown to select what orientations you want to be valid for your application.

[image: Orientation Settings Dropdown menu]

## Configuring Launch Images

To configure your project to use the Launch Images:

- Inside your project from the **Main** menu, select **Edit > Project Settings**.[image: Open the Project Settings]
- In the **Project Settings**, on the left under **Platforms** select **Android** to display the project settings for Android apps.[image: Navigate to the Android section]
- Scroll down to the **Launch Images** section and make sure the **Show launch image** check box is enabled.[image: Set the Show launch image option]
- Click the **...** icon next to each image to open a browser where you can select your image from your computer.[image: Open browser for selecting the image]
- Once you have selected the images you want to use they will be added to the project and included during the startup splash screen.[image: Example of the final setup]

Examples for portrait and landscape images may be found in the Engine/Build/Android/Java/res/drawable folder as PNG files.

- development
- mobile
- android
- platform delivery

On this page

- Configuring Launch Images (-> setting-up-android-launch-screens-in-unreal-engine)

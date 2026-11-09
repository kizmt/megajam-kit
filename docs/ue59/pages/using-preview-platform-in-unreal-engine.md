# Using Preview Platform

https://dev.epicgames.com/documentation/en-us/unreal-engine/using-preview-platform-in-unreal-engine?application_version=5.9

> Previewing your games inside of Unreal Engine based on the selected Mobile Platforms.

[image: Using Preview Platform]

In Unreal Engine (UE), you can use the **Preview Platform** feature to preview what your scene will look like on different platforms directly in the Editor's Viewport. Enabling a given Preview Platform recompiles your scene's materials to emulate the selected renderer and loads the platform's scalability settings — device profiles, default scalability group levels, and platform-specific console variables — so the viewport reflects how your project will look at runtime on the target platform. You can switch between rendering levels, without having to restart the editor.

[image: Example of Rendering Level] 1: Mobile / HTML5 - Open GL ES2 | 2: Shader Model 4.0 - DX10 / OpenGL 3.3+ | 3: Shader Model 5.0 - DX11 / OpenGL 4.3+

## Using Preview Platform

Preview Platform lets you quickly change between different renderers for your current UE session so that you can see what your game will look like on the device(s) that you're targeting without leaving the editor.

To learn how to change to a different renderer preview, follow these steps:

While you do not need to restart the editor for the new preview rendering level to take effect, the first time you change to a preview rendering level, it will take time to recompile the shaders. Subsequent changes to previously used rendering levels do not require recompiling.

- Click the **Performance and Scalability button** in the editor viewport toolbar and open the **Preview Platform** sub-menu.
- Select the platform and graphics API that you want to use for the editor preview.[image: Previewing the selected platform and graphics API] Previewing the selected platform and graphics API You will see the **Changing Preview Platform** progress indicating that shaders are recompiling.[image: Recompiling the shaders to the selected platform and graphics API] Recompiling the shaders to the selected platform and graphics API
- Once a rendering level has been compiled, the materials in the viewport will automatically update to reflect the new rendering method using the Material Qualities enabled or disabled for that target platform. (See the Platform Material Quality Settings (-> using-preview-platform-in-unreal-engine) section of this page for more details on how to adjust these further.) [image: droid Vulkan Preview] [image: Desktop Shader Model 5 (SM5) Preview]

Additionally, the scalability settings for the selected platform are loaded and applied to the viewport after a Preview Platform is selected. This includes the platform's device profiles, the default scalability group levels (Shadows, View Distance, Effects, Post Processing, Anti-Aliasing, and so on), and any platform-specific console variables that affect rendering quality. The viewport then reflects how your project's scalability will resolve at runtime on the target platform, rather than the editor's default desktop quality. Switching back to a desktop preview restores your editor's original scalability state. While a Preview Platform is active, you can further adjust its scalability without affecting the editor's normal quality settings or any other Preview Platform's scalability; click the Default button in the Scalability Group menu to reset back to that platform's runtime defaults. See the Scalability Reference (-> scalability-reference-for-unreal-engine) page for more details.

The Preview Platform button shows the icon for the selected preview mode. Clicking it toggles the Platform Preview on and off.

[image: The Preview Platform icon displays the current selected preview mode] The Preview Platform icon displays the current selected preview mode.

Preview Platform is intended to match a platform’s visual output as closely as possible but it may not always be indicative of what your project is going to look like on the target device.

Always fully test your project on your target device. Platform Preview is for preview purposes only.

### Platform Material Quality Settings

In the **Project Settings** under the **Platforms **category, you can select different platform **Material Quality** settings to toggle specific features for your target platform.

Click the **Update Preview Shaders** button for your changes to take effect.

[image: The Platform Material Quality Settings] The Platform Material Quality Settings

## Preview Rendering Level Selections

When you select your Preview Rendering Level, you will be able to select from the following options. Select the settings that best fit your target device.

| Device Target | Description |
| --- | --- |
| **Android GLES 3.1** | Provides a preview emulation of supported Android OpenGL ES3.1 quality settings. The Material Quality settings can be set in the **Project Settings > Android Material Quality - ES31** section. |
| **Android Vulkan** | Provides a preview emulation of supported Android Vulkan quality settings. The Material Quality settings can be set in the **Project Settings > Android Material Quality - Vulkan** section. |
| **iOS Metal** | Provides a preview emulation of supported iOS Metal quality settings. The Material Quality settings can be set in the **Project Settings > iOS Material Quality - Metal** section. |

Some of the available Preview Rendering Levels are not visible until you've toggled them as a target platform via the Project Settings, specifically Android OpenGLES 3.1 and Android Vulkan. iOS Metal is available by default, but will be removed if its target platform is disabled.

## Copying a Physical Device's Configuration using Platform Preview

In Unreal Engine 5.5 and newer, you can save a Json file containing the device profile and cvars for a specific device. UE can load these settings to use with Platform Preview, providing a 1:1 match for all your project's graphics settings as they would appear on your device.

For any of these changes to take effect, click the **Update Preview Shaders** button.

### Prerequisites

When you select your Preview Rendering Level, you will have a few options to select from. Use the table below to select the option that best fits your target device.

To copy a physical device's configuration, you need to set up your project for Android or iOS development and connect a device to your computer with the necessary development settings.

For Android, refer to the Android Quick Start (-> android-quick-start) and Setting Up Your Android Device For Development (-> setting-up-your-android-device-for-developing-applications-in-unreal-engine).

For iOS, refer to the iOS, iPadOS, tvOS Quick Start Guide (-> ios-ipados-tvos-quick-start-guide-for-unreal-engine) and Setting Up Your iOS/iPadOS/tvOS Device For Development (-> set-up-ios-ipados-and-tvos-devices-for-development-in-unreal-engine).

### Saving Device Data to a Json file

To save your target device's data to a Json file, follow these steps:

- Click the **Performance and Scalability** button in the editor viewport toolbar and open the **Preview Platform** sub-menu. Open the sub-menu for your preferred platform.
- Click **Generate Platform Json**. Select the test device you want to generate a Json file for.[image: Click Generate Platform Json] Click Generate Platform Json
- A dialog appears prompting you to open a Json file. Locate the Json file you previously saved and open it.

### Loading Json Device Data

To load your device's data in Unreal Editor's Platform Preview menu, follow these steps:

- Click the **Performance and Scalability** button in the editor viewport toolbar, open the **Preview Platform** sub-menu, and open the sub-menu for your preferred platform.
- Click **Preview Android with Json > Preview via Json**.[image: Previewing your application using a Json settings file] Previewing your application using a Json settings file.
- A dialog appears prompting you to open a Json file. Locate the Json file you previously saved and open it.

### Further Reading

For more information about Vulkan compatibility with Android devices, see the Vulkan Mobile Renderer (-> using-the-android-vulkan-mobile-renderer-in-unreal-engine) page.

For more information about device profiles, see the following pages:

- Device Profiles (-> setting-up-device-profiles-in-unreal-engine)
- Customizing Android Device Profiles (-> customizing-device-profiles-and-scalability-in-unreal-engine-projects-for-android)

- rendering
- mobile
- android
- platform delivery

On this page

- Using Preview Platform (-> using-preview-platform-in-unreal-engine)
- Platform Material Quality Settings (-> using-preview-platform-in-unreal-engine)
- Preview Rendering Level Selections (-> using-preview-platform-in-unreal-engine)
- Copying a Physical Device's Configuration using Platform Preview (-> using-preview-platform-in-unreal-engine)
- Prerequisites (-> using-preview-platform-in-unreal-engine)
- Saving Device Data to a Json file (-> using-preview-platform-in-unreal-engine)
- Loading Json Device Data (-> using-preview-platform-in-unreal-engine)
- Further Reading (-> using-preview-platform-in-unreal-engine)

Related documents

Mobile Development

 [image: Mobile Development] (-> getting-started-with-mobile-development-in-unreal-engine)Android Support

 [image: Android Support] (-> android-support-for-unreal-engine)

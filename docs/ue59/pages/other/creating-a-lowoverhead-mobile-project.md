# Create a Low-Overhead Mobile Project

https://dev.epicgames.com/documentation/en-us/unreal-engine/creating-a-lowoverhead-mobile-project?application_version=5.9

> Set up a low-overhead project with minimal rendering features for Android devices.

Most new **Unreal Engine **(UE) projects provide a large array of powerful rendering features out of the box with the expectation that teams will optimize their projects by removing or disabling features that are not necessary.

Mobile and Automotive HMI projects require high efficiency to make the most of their hardware and provide users the most responsive possible experience. Therefore, the most productive workflow for this type of project is to start with as minimalistic a feature set as possible and carefully choose the features you want to include.

This guide provides instructions for how to set up a template project with minimalist specs, stripping UE to the leanest overhead for highly performance-oriented new projects.

When you initially import assets into projects based on these instructions, the disabled rendering features may compromise the fidelity of your assets. If you are interested in seeing your assets with the best possible fidelity, we recommend importing them into a different project set up for high fidelity.

## Create Your Project

To set up your project, we recommend the following guides:

- Android Quick Start (-> android-quick-start) for Android and HMI developers.
- iOS Quick Start Guide (-> setting-up-an-unreal-engine-project-for-ios) for iOS, tvOS, and iPadOS developers.

This ensures that you set up all the components you need to support a mobile project and package on your device.

## Disable Plugins

By default, UE has a large suite of plugins enabled so that users can explore a wide range of tools and platforms. This section provides instructions on how to remove all plugins that will not impact a mobile project.

To disable unnecessary plugins, follow these steps:

- Locate your project's directory on your computer. Your `.uproject` file is located in your project's root folder.[image: Locater Uproject File]
- Right-click your `.uproject` file to edit it in a text editor.
- In the **Plugins **section of your `.uproject` file, copy and paste the following text: Console Output ```
"Plugins": [
		{
			"Name": "SteamVR",
			"Enabled": false
		},
		{
			"Name": "MagicLeapMedia",
			"Enabled": false
		},
		{
``` You can re-enable any plugins that you need in the **Plugins **manager later.
- If you are using a C++ project, right-click your `.uproject` file and click **Generate Project Files** to regenerate your IDE's project files.[image: Generate Project Files]
- Relaunch **Unreal Editor** and load your project.

## Set Your Project to Low Scalability Settings

**Scalability settings** are presets for groups of settings, such as shadows, lighting, and texture quality. Each setting takes multiple config variables and condenses them into buckets for **Low**, **Medium**, **High**, **Epic**, and **Cinematic **quality levels. **Low **represents the settings scaled down to their absolute minimum, while **Epic **represents the highest setting you'd use for a realtime application.

UE typically sets new projects' scalability settings to **Epic **to ensure the best possible visuals when you import new art assets. This section provides instructions on how to quickly set all scalability settings to **Low **so that you can build up your feature set starting from the most low-overhead project possible.

To adjust **Scalability Settings**, follow these steps:

- Open your project in Unreal Editor.
- Click the **Settings** button in the main toolbar.
- Highlight the **Engine Scalability Settings** sub-menu. Click **Low **to set every scalability group to the lowest possible setting.[image: Unreal Editor Scalability Settings]

Changing scalability settings in the Editor does not affect final builds. Unreal Engine uses configuration files (`.ini`) to set values that load upon startup. Scalability settings are defined in `Engine/Config/BaseScalability.ini` and platform-specific config files (such as `Engine/Config/Android/AndroidScalability.ini`).

Config files take precedence over each other in the following order:

[image: Config Precedence]

For information about how you can set values on a per-device basis and within device profiles, see Customizing Device Profiles and Scalability for Android (-> customizing-device-profiles-and-scalability-in-unreal-engine-projects-for-android).

You can learn more about scalability settings in Introduction to Performance Profiling and Configuration (-> introduction-to-performance-profiling-and-configuration-in-unreal-engine) and the Scalability Reference.

## Set Your Preview Platform

Your **Preview Platform** is the target platform that you want Unreal Editor to imitate in its viewports. The in-editor preview platform is an approximation of what your application will look like on a target platform. It is important that you test on the actual device, the Android emulator in Android Studio (-> debugging-unreal-engine-projects-with-virtual-devices-using-the-android-emulator), or the iOS emulator in Xcode for more accurate testing. However, the preview platform will give you the quickest idea of what your visuals should look like directly from the editor.

To set your Preview Platform, follow these steps:

- Click the **Settings** button in the editor's main toolbar.
- Highlight the **Preview Platform** sub-menu.
- Select the platform that you want the editor to emulate.[image: Unreal Editor Preview Platforms]

Unreal Editor will take some time to re-compile shaders for the new platform, but once it's done, your visuals should reflect the device profile for the selected preview platform. You can also load a `.json` file from your test device to get an even more fine-tuned preview with that device's specific device profile and settings.

For more information about setting up your Preview Platform, see the Mobile Previewer (-> using-the-mobile-previewer-in-unreal-engine) documentation.

For Android and HMI developers, UE supports Vulkan rendering feature levels. See the Android Vulkan Mobile Renderer (-> using-the-android-vulkan-mobile-renderer-in-unreal-engine) page for more information about Vulkan compatibility in UE.

## Further Reading

Now that you have reduced the overhead in your project, this is a great opportunity to test out different settings and see their impact on your application's fidelity and performance.

For an introductory overview of performance profiling, see Introduction to Performance Profiling and Configuration (-> introduction-to-performance-profiling-and-configuration-in-unreal-engine). We recommend setting yourself up to profile your application with **Stat Commands** at a minimum, but ideally you should also be prepared to use Unreal Insights (-> how-to-use-unreal-insights-to-profile-android-games-for-unreal-engine) and RenderDoc (-> using-renderdoc-with-unreal-engine).

Once you've got those resources set up, see Configuring Graphics Performance on Mobile (-> configuring-graphics-performance-on-mobile) for an overview of mobile-specific performance considerations and scalability tools.

- beta
- hmi
- hmi test project
- test project

On this page

- Create Your Project (-> creating-a-lowoverhead-mobile-project)
- Disable Plugins (-> creating-a-lowoverhead-mobile-project)
- Set Your Project to Low Scalability Settings (-> creating-a-lowoverhead-mobile-project)
- Set Your Preview Platform (-> creating-a-lowoverhead-mobile-project)
- Further Reading (-> creating-a-lowoverhead-mobile-project)

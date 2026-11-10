# Creating Bundled PSO Caches for Android

https://dev.epicgames.com/documentation/en-us/unreal-engine/creating-bundled-pso-caches-for-android-in-unreal-engine?application_version=5.9

> Step-by-step walkthrough for creating a bundled PSO cache for an Android device.

[image: Creating Bundled PSO Caches for Android]

PSO Caching (-> optimizing-rendering-with-pso-caches-in-unreal-engine) creates and stores the most commonly-used Pipeline State Object data for your app in advance to improve rendering performance, most especially to reduce hitches while running your application. This guide provides a walkthrough of implementing PSO Caching in an Android project in Unreal Engine (UE).

This page provides instructions for the Bundled PSO caching method, which is the legacy, manual PSO caching system used in UE versions 5.2 and earlier. We recommend using the PSO precaching system from 5.3 and newer if it is viable for your project. See the documentation for PSO Precaching for more details.

## Required Setup

To follow this guide, you need the following:

- An Unreal Engine project that is set up for Android as a target platform (-> android-quick-start).
- The version of Android SDK and NDK (-> advanced-setup-and-troubleshooting-guide-for-using-android-sdk) compatible with your current version of Unreal Engine.
- A compatible Android testing device with developer mode and USB debugging (-> setting-up-your-android-device-for-developing-applications-in-unreal-engine) enabled.

To learn more about which Android devices are compatible with your version of Unreal Engine, see Android Development Requirements

## Set Up Project Settings for PSO Caching

To configure your project settings to support PSO caching, follow these steps:

- Open your project in Unreal Editor.
- Open **Edit **> **Project Settings**.
- Navigate to **Project **> **Packaging **and make sure **Share Material Shader Code** and **Shared Material Native Libraries** are both enabled.
- In the next step you need to edit config files manually. Close Unreal Editor to avoid conflicts between your manual edits and the Project Settings.
- Open your project's `Config/Android` folder, then open `AndroidEngine.ini`. Add the following settings: C++ ```
[DevOptions.Shaders]
     NeedsShaderStableKeys=true
``` [DevOptions.Shaders] NeedsShaderStableKeys=true

## Run Your Game and Gather PSOs

Now that your project settings are PSO cache-compatible, run a build of your project with the `-logPSO` command line enabled.

- Make sure your testing device is connected to your computer.
- Open your project in Unreal Editor.
- Click **Platforms **> **Project Launcher**.
- In the Project Launcher, click **+ Add **> **Create Custom Profile **to make a new launch profile.[image: In the Project Launcher, the user selects the Add button and clicks Create Custom Profile.]
- Re-name your profile **PSO Caching - ETC2**.
- In the dropdown next to **How would you like to cook your content?**, click **Cook by the Book**.
- Choose **Android_ETC2 **as your target platform.[image: In the Project Launcher, Cook by the Book is the cook setting, and Android_ETC2 is the target platform.]
- Under **Deploy**, choose your mobile device as the target device and set the **Variant** to **Android_ETC2**.
- Under the **Launch** category, add the `-logPSO` command to **Additional Command Line Parameters**.[image: The -logPSO command is added to Additional Command Line Parameters]You can use **Android File Server (AFS)** to add the `-logPSO` command to the `UECommandLine.txt` file to an existing build on your device. For more details, see the documentation for AFS (-> android-file-server-for-unreal-engine).
- Launch your profile. UE builds and packages the project, then deploys it to your device.
- Play through your game. The Output Log displays a message anytime your game logs a new PSO.

When you do future PSO gathering sessions, you can re-use the profile you created from this section.

### Tips for Gathering PSOs

The more PSOs you gather, the longer your game's startup time will be when you package the final app, as all your PSOs have to be loaded before users can start playing. Therefore, we advise gathering PSOs specifically in locations you know are commonly used and have noticeable stuttering, as PSO caches for these locations provide the most benefit to users’ experience.

Anytime a location significantly changes, previously-gathered PSOs for that location will become outdated. Therefore, make sure to gather PSOs frequently throughout production.

## Retrieve Gathered PSO Data From Your Device

After logging your PSOs, you need to retrieve the data from your testing device and incorporate it into a new build. To retrieve your PSO data, follow these steps:

- Unplug your testing device from your computer and close your game.If you try to close your game from the Project Launcher, your device might not save the PSO data it logged.
- Close your project and re-connect your testing device to your computer.
- Pull the PSOs from the following directory:`Internal Storage/Android/Data/[package name of project]/files/UnrealGame/[project name]/Saved/CollectedPSOs`You can pull the CollectedPSOs directory's contents using any of the following methods: Run the following command using Android File Server (AFS): `UnrealAndroidFileTool -p [package name] -k [security token] pull ^saved/CollectedPSOs [destination path]`
- Connect your device to your computer and use your computer's file system to browse to the location of the PSOs.

- Copy the `.UPIPELINECACHE` file to your computer in a location that is easily accessible. This example uses a folder in in the project's directory called `Import/PSOFiles`.

## Build Final PSO Cache Data and Add It To Your Project

To incorporate your PSO cache into a build, follow these steps:

- Open your project folder and locate Saved/Cooked/Android_ETC2/[Project Name]/Metadata/PipelineCaches. Copy the files in this folder into Import/PSOFiles.
- Open your command line tool and navigate to the install directory for the engine version you are using for your project, then locate the Engine/Binaries/Win64 folder. For example: C:/Program FIles/Epic Games/UE_5.2/Engine/Binaries/Win64.
- Run the following command line: C++ ```
UnrealEditor-Cmd.exe "YourProjectPath.uproject" -run=ShaderPipelineCacheTools expand C:\PSOfiles\*.rec.upipelinecache C:\PSOfiles\*.shk C:\PSOfiles\"Alias Name"_"Project Name"_"Used Graphics API".spc
``` UnrealEditor-Cmd.exe "YourProjectPath.uproject" -run=ShaderPipelineCacheTools expand C:\PSOfiles\*.rec.upipelinecache C:\PSOfiles\*.shk C:\PSOfiles\"Alias Name"_"Project Name"_"Used Graphics API".spc
- After the command line runs successfully, the Import/PSOFiles directory should contain a new PKCS #7 certificate file. Copy it to your project's Build/Android/PipelineCaches folder.
- Rebuild and launch your game again. The new build includes the final PSO cache data.

## Result

On launch, you should also see a log stating how many PSOs were loaded. When you run your game, any rendering stutters from locations you gathered PSOs from should be addressed.

- optimization
- mobile
- android
- psos
- pso caching
- rendering optimization

On this page

- Required Setup (-> creating-bundled-pso-caches-for-android-in-unreal-engine)
- Set Up Project Settings for PSO Caching (-> creating-bundled-pso-caches-for-android-in-unreal-engine)
- Run Your Game and Gather PSOs (-> creating-bundled-pso-caches-for-android-in-unreal-engine)
- Tips for Gathering PSOs (-> creating-bundled-pso-caches-for-android-in-unreal-engine)
- Retrieve Gathered PSO Data From Your Device (-> creating-bundled-pso-caches-for-android-in-unreal-engine)
- Build Final PSO Cache Data and Add It To Your Project (-> creating-bundled-pso-caches-for-android-in-unreal-engine)
- Result (-> creating-bundled-pso-caches-for-android-in-unreal-engine)

Related documents

Android File Server

 [image: Android File Server] (-> android-file-server-for-unreal-engine)PSO Caches

 [image: PSO Caches] (-> optimizing-rendering-with-pso-caches-in-unreal-engine)Creating a Bundled PSO Cache

 [image: Creating a Bundled PSO Cache] (-> manually-creating-bundled-pso-caches-in-unreal-engine)

# Unreal Insights on Android Devices

https://dev.epicgames.com/documentation/en-us/unreal-engine/how-to-use-unreal-insights-to-profile-android-games-for-unreal-engine?application_version=5.9

> Step-by-step guide for attaching the Unreal Insights profiler to an Android application running on a test device.

[image: Unreal Insights on Android Devices]

Unreal Insights (-> unreal-insights-in-unreal-engine) is a profiling tool that can record and review performance data for your **Unreal Engine (UE)** applications, including builds deployed on target devices. To record trace sessions, you need to run applications with Unreal Insights command line arguments. To provide these arguments on an Android device, you will need to follow some extra steps, detailed in this guide.

In this quickstart guide, you will:

- Set up Unreal Insights with your Unreal Engine installation.

- Deploy a build to your Android device.

- Add `UECommandline.txt` to the deployed Android application and provide the needed arguments to record Unreal Insights trace information.

- Launch Unreal Insights and attach it to the build on your Android device.

## Recommended Setup and Prerequisites

You can use any Android project with this guide. This quickstart guide uses a new project with the following settings:

- Top-Down Template

- Mobile/Tablet Platform

- Scalable 2D/3D Quality

- No Starter Content

To follow this guide, you will need:

- A version of the Android SDK compatible with your version of Unreal Engine. See the Android SDK setup guide.

- Android support enabled for your project. See the Android Quickstart guide.

- An Android device set up for USB or WiFi debugging with your computer. See Setting Up Your Android Device for Development (-> setting-up-your-android-device-for-developing-applications-in-unreal-engine).

## Compile Unreal Insights

Check the `Engine/Binaries/` folder for your operating system in your Unreal Engine install directory to see if Unreal Insights is already built. For example, on Windows you would see UnrealInsights.exe in `Engine/Binaries/Win64` if it is already built.

 [image: image alt text]

This executable is available in builds distributed through the Epic Games Launcher. If you are using a source code build and it is not present, open your Unreal Engine solution in your IDE and build the project listed under `Programs/UnrealInsights`.

 [image: image alt text]

## Enable AndroidFileServer For Your Project

In a later step, you will need to push a command line file to your Android device to enable Unreal Insights trace channels. To do this, you will need the Android File Server (AFS) plugin, which embeds a file server with your project that you can connect to using Unreal Android File Tool (UAFT). This is an alternative to Android Debug Bridge (adb) and is specifically created for Unreal Engine projects, providing more direct access to the UE application and its file paths. To add AFS to your project, follow these steps:

- Enable the AndroidFileServer plugin.

- Enable the `Use AndroidFileServer` setting in **Project Settings** > **Plugins **> **AndroidFileServer**. This will make it possible to connect to the **UnrealAndroidFileTool (UAFT)** and manage files in a later section.

- Configure your other settings as needed for your organization's security and network needs.

For more information about configuring AFS and UAFT, see their documentation (-> android-file-server-for-unreal-engine).

This walkthrough uses a device's serial number to connect with UAFT, but you can also use the **Security Token** in the **Plugins **> **AndroidFileServer **settings.

## Package your UE Android Project

Package your UE project and push it to your Android device. See Packaging Android Projects (-> packaging-android-projects-in-unreal-engine) for detailed instructions. If you have already set up your test device, you can use the **Quick Launch** option at the top of the **Platforms** dropdown in Unreal Editor to build your project and push it directly to your device.

For more information about packaging your project, see the Build Operations (-> cooking-content-in-unreal-engine) guide.

## Connect to Your Android Device in the Device Manager

To view a live trace on your device, you need to set it up for USB or wifi debugging and make sure it's available in your **Device Manager**. See Setting Up Your Android Device for Development (-> setting-up-your-android-device-for-developing-applications-in-unreal-engine) for more information about setting up your Android device to connect with UE, and see the Device Manager (-> connecting-to-and-managing-devices-in-unreal-engine) page for more info about using the Device Manager.

## Add UECommandline.txt to Your Android Device With Trace Enabled

Your application must run with a set of command line arguments to enable trace sessions in Unreal Insights. UE applications on Android can take command line arguments through a file called `UECommandline.txt`. To push a `UECommandLine.txt` file to your device with the needed arguments for Unreal Insights, follow these steps:

- In your Unreal Engine install directory, open the `Engine/Build/Android/UnrealGame` folder.

- Create an empty text file called `UECommandline.txt`.

- Add the following parameters to this text file, substituting [ProjectName] with the name of your project: Example UECommandline.txt ```
     ../../../[ProjectName]/[ProjectName].uproject		-tracehost=127.0.0.1	-cpuprofilertrace
``` ../../../[ProjectName]/[ProjectName].uproject -tracehost=127.0.0.1 -cpuprofilertrace You can use the following arguments to get additional load time information: Example UECommandline.txt ```
     ../../../[ProjectName]/[ProjectName].uproject  -tracehost=127.0.0.1 -filetrace -loadtimetrace  -statnamedevents -trace=Bookmark,Frame,CPU,GPU,LoadTime,File
``` ../../../[ProjectName]/[ProjectName].uproject -tracehost=127.0.0.1 -filetrace -loadtimetrace -statnamedevents -trace=Bookmark,Frame,CPU,GPU,LoadTime,File

- Run `UnrealAndroidFileTool.exe` with the `devices` command to see a list of the devices attached to your computer. Take note of the serial number for your target device, but do not include the `@` prefix.

- Run `UnrealAndroidFileTool.exe` with the shell command to connect it to your device in interactive mode. The following is an example of connecting to a device with a device serial number and a package name for `ExampleGame`. Substitute the example serial number with the one you obtained in the previous step, and substitute the package name with the one you provided for your application. Command Line ```
     UnrealAndroidFileTool.exe -s AB187923123CD123 -p -k [security token] com.OrganizationName.ExampleGame shell
``` UnrealAndroidFileTool.exe -s AB187923123CD123 -p -k [security token] com.OrganizationName.ExampleGame shell

- Use the `push` command to push `UECommandLine.txt` to your device, using the `"commandfile` shortcut in place of the target path. In the example below, the project is called ExampleGame. Command Line ```
     push D:/UnrealEngine/Projects/ExampleGame/Engine/Build/Android/UnrealGame/UECommandLine.txt ^commandfile
``` push D:/UnrealEngine/Projects/ExampleGame/Engine/Build/Android/UnrealGame/UECommandLine.txt ^commandfile

- Close UAFT by running the `quit` or `exit` command. Command Line ```
     quit
``` quit

If you browse your device using your file system, you will see a `UECommandline.txt` file on your device in the `UEGame/[ProjectName]` directory. When you launch your application, it will now record trace data for Unreal Insights. You can configure what trace channels and features are active with more command lines, see Unreal Insights (-> unreal-insights-in-unreal-engine) for more information.

## Launch Timing Insights With a Live Trace Session

- Open your Unreal Engine install directory and navigate to the `Engine/Binaries` folder.

- Locate `UnrealInsights.exe` in the folder for your platform and double-click it to open Unreal Insights.

- In the Unreal Insights **Session Browser**, select a session with a **LIVE **status that is running on your Android device, then click the **Open **button. [image: image alt text] The Timing Insights window will appear showing processing data for your CPU and GPU threads.

You can now use Unreal Insights to profile performance on your Android device.

## Load a Recorded Trace Session From Your Android Device

Unreal Insights trace sessions are recorded so that you can pass them between developers and review them asynchronously. You can retrieve trace session files from your device using the follwing steps:

- Run UAFT with the shell command to connect it to your device in interactive mode. The example below uses a placeholder for a device's serial number to designate the target device. Command Line ```
     UnrealAndroidFileTool.exe -s AB187923123CD123 -p com.OrganizationName.ExampleGame -k [security token] shell
``` UnrealAndroidFileTool.exe -s AB187923123CD123 -p com.OrganizationName.ExampleGame -k [security token] shell

- Use the `pull` command to pull the trace file you want to put on your computer. It should be saved under your game's `Saved/Traces` directory, which you can access with the `^saved` shortcut. Command Line ```
     pull ^saved/Traces/2202999_112345.trace D:/Insights/MyProject/Saved/Traces
``` pull ^saved/Traces/2202999_112345.trace D:/Insights/MyProject/Saved/Traces The trace file that you designate with the first file path will appear in the directory you specify on your local machine with the second file path. If you aren't sure what the name or filepath for your trace file is, use the `ls` command and the `-R` argument to get a list of the files in your project's directory. The `^project` shortcut will give you a quick way to access it from the top level. Command Line ```
     ls -R ^unreal
``` ls -R ^unreal

- Close UAFT by running the `quit` or `exit` command. Command Line ```
     quit
``` quit

- Run Unreal Insights and load the trace session.

## Further Reading

For more information about how to use Unreal Insights’ suite of profiling tools, see the Unreal Insights documentation (-> unreal-insights-in-unreal-engine).

For more information about Android File Server and UAFT, see the Android File Server documentation (-> android-file-server-for-unreal-engine).

- profiling
- android
- unreal insights

On this page

- Recommended Setup and Prerequisites (-> how-to-use-unreal-insights-to-profile-android-games-for-unreal-engine)
- Compile Unreal Insights (-> how-to-use-unreal-insights-to-profile-android-games-for-unreal-engine)
- Enable AndroidFileServer For Your Project (-> how-to-use-unreal-insights-to-profile-android-games-for-unreal-engine)
- Package your UE Android Project (-> how-to-use-unreal-insights-to-profile-android-games-for-unreal-engine)
- Connect to Your Android Device in the Device Manager (-> how-to-use-unreal-insights-to-profile-android-games-for-unreal-engine)
- Add UECommandline.txt to Your Android Device With Trace Enabled (-> how-to-use-unreal-insights-to-profile-android-games-for-unreal-engine)
- Launch Timing Insights With a Live Trace Session (-> how-to-use-unreal-insights-to-profile-android-games-for-unreal-engine)
- Load a Recorded Trace Session From Your Android Device (-> how-to-use-unreal-insights-to-profile-android-games-for-unreal-engine)
- Further Reading (-> how-to-use-unreal-insights-to-profile-android-games-for-unreal-engine)

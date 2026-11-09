# Launching to Devices

https://dev.epicgames.com/documentation/en-us/unreal-engine/launching-unreal-engine-projects-on-devices?application_version=5.9

> One-click deploying your project to devices like iOS and Android for testing

[image: Launching to Devices]

In the Main toolbar of the Unreal Editor, there is a button labeled **Platforms**, with a drop-down menu.

 [image: Platforms drop-dawn menu]

In the drop-down menu, you will see a list of possible platforms you can launch the current Level on.
Generally, you would not need Windows or Mac, as you can use the **Play** button for that without needing to cook your data.
This page will primarily cover the information you need for launching on mobile platforms.

For Android, there will be multiple selections. See the **Android Texture Formats** (-> android-development-basics-for-unreal-engine) page for more information.

If you have multiple devices for a particular platform, you can choose between them here. Clicking on the platform (and device), the Editor will start to cook the Level, install the data on the device, and run the Level on the device.

This method will only install the current Level on the device for fast iteration, and switching between Levels is unsupported with this method. If you want to have all of your Levels installed to the device at once, see the documentation.

### Generic UnrealGame App

If you are making a content-only project, the executable that runs for One-Click Deploy is actually the generic "UnrealGame" game (since it can be used with any content-only project).
When it runs on a device, the icon that gets installed is just labeled as UnrealGame. However, when you package a game, the name of your project is used in the final packaged build.
When you install the packaged build, the icon will have your name (as well as your icons if you updated the default icons).

## Advanced Mode (UnrealFrontend)

There is an additional tool for performing advanced building, cooking, deploying, packaging, and launching options. It is called **Unreal Frontend** and is located in the following locations depending on your platform:

| Platform | Location |
| --- | --- |
| PC | [ENGINE INSTALL LOCATION]\Engine\Binaries\Win64\UnrealFrontend.exe |
| Mac | [ENGINE INSTALL LOCATION]\Engine\Binaries\Mac\UnrealFrontend.app |

This tool will let you only cook certain maps, change the commandline, or even run your game without precooking all the data (called "Cook on the Fly" mode).
These are advanced tools - for more information, see **Unreal Frontend (-> using-the-unreal-frontend-tool)**.

- packaging
- launching
- platform delivery

On this page

- Generic UnrealGame App (-> launching-unreal-engine-projects-on-devices)
- Advanced Mode (UnrealFrontend) (-> launching-unreal-engine-projects-on-devices)

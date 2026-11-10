# Project Launcher

https://dev.epicgames.com/documentation/en-us/unreal-engine/using-the-project-launcher-in-unreal-engine?application_version=5.9

> A reference for the Project Launcher used to deploy projects.

[image: Project Launcher]

The Project Launcher is used to cook and deploy builds of your projects to specified platforms for testing, debugging, and releasing your project. The following reference page breaks down the elements that make up the Project Launcher and the settings you can use when creating your own Custom Launch Profiles for deploying your content to different platforms.

 [image: Project Launcher UI]

## Project Launcher interface

To open the Project Launcher click **Platform** and select **Project Launcher**.

 [image: Open the Project Launcher window]

The Project Launcher interface can be broken up into two main areas:

 [image: Project Launcher UI description]

- Default Launch Profiles

- Custom Launch Profiles

From the **Default Launch Profiles** window, you can see the available platforms and select from the devices that you want to deploy builds to. At the top of this window, you can specify a **Project** (if it's different than the current one you have opened) and a toggle for **Advanced** settings for these default launch profiles.

When you click the **Advanced** toggle button, you'll get additional options next to the default launch profiles that enables you to select a **Build Configuration** and a **Cook** method.

 [image: Advance options in the Project Launcher]

In the **Custom Launch Profiles** window, you can create your own profiles that enable you to specify many more options for how content is built and deployed, which is detailed more in the Custom Launch Profiles (-> using-the-project-launcher-in-unreal-engine) section.

## Custom Launch Profiles

From the Project Launcher, you can create a **Custom Launch Profile** that can be used with all platforms or even specific ones, like the Nintendo Switch. These profiles enable you to build your content in specific ways by setting how it is cooked, packaged, and even deployed using the available build operations.

To add your own Custom Launch Profile, click the **+Add** button in the **Custom Launch Profiles** section.

 [image: Add a Custom Launch Profile]

After doing so, your Custom Launcher Profile will immediately open. Be sure to give it a name so that you can identify it later on.

 [image: Custom Launch Profile editor window]

### Name and Description

In the header bar, you'll find the **Name** and **Description** that you can apply to this custom profile. To edit these, double-click on either section's text to start editing them.

 [image: Editing of the name and description of the Custom Launcher Profile]

### Project

In the **Project** section, you can specify what project you want this profile to be associated with or if it can be used with any project. By default **Any Project** is set, but it can be set to a specific one. This can be useful when you are developing your project for multiple platforms, and those platforms require particular ways to deploy, test, debug, and even release them.

 [image: Specify project for the Custom Launch Profile]

### Build

The **Build** section enables you to specify the type of configuration you want to build and deploy against depending on your project's progression in development and how you need to test, debug, or release your project.

 [image: Build section]

| Setting | Description |
| --- | --- |
| **Build Configuration** | Choose from the available configurations you want to build and test with your project. [image: Settings of the Build Configuration] **DebugGame**: This configuration builds the Engine as optimized but leaves the game code debuggable. It is ideal only for debugging game modules. **Development**: This configuration is equivalent to a release build. Unreal Editor uses the Development configuration by default. When your project is compiled using this configuration, it enables you to see code changes made to your project reflected in the Editor. **Shipping**: This is the configuration for optimal performance and shipping your game. This configuration strips out console commands, stats, and profiling tools. This configuration should be used when you are ready to release your game. |
| **Build UAT** | When enabled, the Unreal Automation Tool (-> automation-test-framework-in-unreal-engine) will be built as part of the build. |
| **Additional Command Line Parameters** | Parameters specified here will be passed to the app on launch |

### Cook

In the **Cook** section, there are two ways you can cook content for your projects: **By the book** and **On the fly**.

#### By the Book

The Cook **By the book** option enables you to specify which content should be cooked and cooks everything in advance before launching the game.

 [image: Cook By the Book option]

| Setting | Description |
| --- | --- |
| **Cooked Platform** | Select from the available target platforms listed that you would like this custom launch profile to be able to cook content for. |
| **Cooked Cultures** | Select from the available localization cultures you would like this content to be cooked for. |
| **Cooked Maps** | Select from the available maps in your title that you would like to cook. |
| Release/DLC/Patching Settings |  |
| **Create a release version of the game for distribution** | Enables you to create a release version of your title that will be used for distribution. |
| **Name of the new release to create** | Give your release a new name that will be used during the cook. |
| **Release version this is based on** | This is the release version to base the next release / DLC / patch on. |
| **Generate Patch** | If enabled, content will be diffed against source content and only changed files will be included in the new pak file. |
| **Build DLC** | If enabled, DLC will be built without the content released with the original game. |
| **Name of the DLC to build** | Give a name to the DLC that is going to be built. |
| **Include Engine Content** | If enabled, DLC will include Engine content which was not included in the original release. If it is not checked, an error will be produced when accessing content from the **Engine** directory. |
| Advanced Settings |  |
| **Iterative Cooking: Only cook content modified from previous cook** | If enabled, only modified content will be cooked resulting in much faster cooking times. It is recommended to enable this option whenever possible. |
| **Stage base release pak files** | If enabled, unchanged pak files present in the base release version will be staged. |
| **Compress Content** | If enabled, content generated will be compressed. These will be smaller but potentially take longer to load as it decompresses. |
| **Add a new patch tier** | If enabled, a new numbered pak file will be generated with the patch content. |
| **Save Packages Without Versions** | If enabled, the version is assumed to be the current at load. This is potentially dangerous but results in smaller patch sizes. |
| **Store all content in a single file (UnrealPak)** | If enabled, the content will be deployed as a single UnrealPak file instead of many separate files. |
| **Encrypt INI files (only with Use Pak File enabled)** | If enabled, ini files stored inside the UnrealPak file will be encrypted. |
| **Generate Chunks** | If enabled, the content will be deployed as multiple UnrealPak files instead of many separate files. |
| **Don't include Editor content in the build** | If enabled, the cooker will skip Editor content and not include it in the build. |
| **HTTP Chunk Install Data Path** | **Create HTTP Chunk Install Data**: If enabled, the content will be split into multiple Pak files and stored as data that can be downloaded. **HTTP Chunk Install Data Path**: Specify the file path for the Chunk Install Data. **HTTP Chunk Install Release Name**: Name of this version of the HTTP Chunk Install Data. |
| **Cooker Build Configuration** | Sets the build configuration to use for the cooker commandlet. |
| **Additional Cooker Options** | Additional cooker command line parameters can be specified here. |

#### On the Fly

The Cook **On the fly** option enables content to be cooked at runtime as needed before it is being sent to the device.

 [image: Cook On the Fly option]

| Setting | Description |
| --- | --- |
| **Only Cook Modified Content** | If enabled, only modified content will be cooked, resulting in much faster cooking times. It is recommended to use this option whenever possible. |
| **Additional Cooker Options** | Additional cooker command line parameters can be specified here. |

### Package

In the **Package** section, you can choose how the build is packaged and whether it should be stored locally or in a shared repository that can be accessed.

 [image: Package section]

#### Package Method

| Setting | Description |
| --- | --- |
| Package & Store Locally |  |
| **Local Directory Path** |  |
| **Is this build for distribution to the public** | If checked the build will be marked as for release to the public (distribution) |
| **Include an installer for prerequisitea of packaged games** | If checked the build will include the prerequisites installer on platforms that support it. |
| **Use container files for optimized loading (I/O Store)** | If checked the build will use container files for optimized loading (I/O Store). |
| **Make a binary config file for faster runtime startup times** | Bakes the config (.ini, with plugins) data into a binary file, along with optional custom data. |
| **Optional I/O Store Reference Block Database:** | The path to a global UTOC in a derictory of previously released iostore containers. The path to a crypto JSON to decrypt the reference block containers, if indeed. |
| Package & Store In Repository |  |
| **Repository Path** |  |

### Archive

In the **Archive** section, you can specify whether or not to archive the build and the directory path if it is going to be archived for later reference.

 [image: Archive section]

### Deploy

In the **Deploy** section, you'll need to decide how you would like to deploy your current build to a device; using a **File server**, **Copy to device**, or **Copy repository**.

Use the following selections to determine which deployment method to use:

 [image: Deploy method selection]

- **File Server** will cook and deploy the content at runtime as it is needed to the device.

- **Copy to Device** will copy the entire cooked build to the device.

- **Do Not Deploy** will not deploy the build to any device once the cook and package complete.

- **Copy Repository** will copy a build from a specified file location to deploy to any device.

#### File Server

The available settings you can use when selecting File Server.

 [image: File server deploy method]

| Setting | Description |
| --- | --- |
| **Default Deploy Platform** | Set the default target platform(s) you want to deploy content. |
| Advanced Settings |  |
| **Hide the file server's console window** | If enabled, the file server's console window will be hidden from your desktop. |
| **Streaming server (experimental) ** | If enabled, the file server will use an experimental implementation that can serve multiple files simultaneously. |

#### Copy to Device

The available settings you can use when selecting Copy to Device.

 [image: Copy to device deploy method]

| Setting | Description |
| --- | --- |
| **Default Deploy Platform** | Set the default target platform(s) you want to deploy content. |
| Advanced Settings |  |
| **Only deploy modified content** | If enabled, only modified content will be deployed, resulting in much faster deployment times. It is recommended to use this option whenever possible. |

#### Copy Repository

The available settings you can use when selecting Copy Repository.

 [image: Copy repository deploy method]

| Setting | Description |
| --- | --- |
| **Repository Path** | Set the file path to the repository that you want to copy to device. |
| **Default Deploy Platform** | Set the default target platform(s) you want to deploy content. |

### Launch

 [image: Launch section]

| Setting | Description |
| --- | --- |
| **Launch As** | Select how you would like to launch this instance of your build. [image: Launch As options] **Standalone Client**: Launches this instance as a standalone game client. **Listen Server**: Launches this instances a game client that can accept connections from other clients. **Dedicated Server**: Launches this instance as a dedicated game server. **Unreal Editor**: Launches this instance as an Unreal Editor. |
| **Initial Culture** | Select the culture that you're initially targeting to use when launching the build. |
| **Initial Map** | Select the initial map you want the project to use when launching the build. |
| **Additional Command Line Parameters** | Enter any necessary command line parameters you want to use when launching the build. |
| **Synchronize Screen Refresh Rate (VSync)** | Enable this for the build to attempt to run the project at the same refresh rate as the monitor it's being run on. |

- packaging
- launching
- platform delivery

On this page

- Project Launcher interface (-> using-the-project-launcher-in-unreal-engine)
- Custom Launch Profiles (-> using-the-project-launcher-in-unreal-engine)
- Name and Description (-> using-the-project-launcher-in-unreal-engine)
- Project (-> using-the-project-launcher-in-unreal-engine)
- Build (-> using-the-project-launcher-in-unreal-engine)
- Cook (-> using-the-project-launcher-in-unreal-engine)
- By the Book (-> using-the-project-launcher-in-unreal-engine)
- On the Fly (-> using-the-project-launcher-in-unreal-engine)
- Package (-> using-the-project-launcher-in-unreal-engine)
- Package Method (-> using-the-project-launcher-in-unreal-engine)
- Archive (-> using-the-project-launcher-in-unreal-engine)
- Deploy (-> using-the-project-launcher-in-unreal-engine)
- File Server (-> using-the-project-launcher-in-unreal-engine)
- Copy to Device (-> using-the-project-launcher-in-unreal-engine)
- Copy Repository (-> using-the-project-launcher-in-unreal-engine)
- Launch (-> using-the-project-launcher-in-unreal-engine)

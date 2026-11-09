# Setting Up an ASIS Project

https://dev.epicgames.com/documentation/en-us/unreal-engine/setting-up-an-asis-project-in-unreal-engine?application_version=5.9

> Learn how to set up your project using the ASIS template or adding ASIS to an existing project.

When setting up your project to use Android Single Instance Service (ASIS) in your project, there are a couple of ways you can do this by:

- Creating a new project from the** ASIS Template**.
- Adding ASIS to an existing project.

Below you’ll find examples of both of these setups.

## Project Prerequisites and Toolchain

ASIS-enabled projects require the following:

- A source build of Unreal Engine 5.8 or later.ASIS cannot be used with a launcher (binary) install of the engine.
- The plugin modifies the engine’s Android platform code base (engine Android runtime and Java GameActivity-level integration. For licensees, you can access the source code through Perforce with your credentials, or for non-licensees, you can access source code through the Epic Games GitHub repository.
- Additionally, the plugin itself is located here, which is only present in a source build: `Engine\Restricted\LimitedAccess\Plugins\HMI`.
- For information on this procedure, see Building Unreal Engine from Source (-> building-unreal-engine-from-source).

- Android SDK / NDK / JDKSetup the Android toolchain using these guides:Automated Android SDK, NDK, and JDK Setup (-> automated-android-sdk-ndk-and-jdk-setup-in-unreal-engine) (recommended)
- Manual Android SDK Setup with Android Studio (-> manual-android-sdk-setup-with-android-studio-for-unreal-engine)

## Create a New Project from the ASIS Template

The ASIS plugin includes an Automotive Human-Machine Interface (or HMI for short) project template. This template is named **TP_HMI_ASIS** (“HMI Automotive Blank”) and comes pre-configured with the ASIS plugin enabled, remap directories set, and the AsisGameEngine selected.

Using this as a starting point is the quickest way to get set up and running with an ASIS-enabled project. The plugin exposed this template directly from its own Templates folder, so it is discovered automatically, meaning there’s no need to copy the project manually into `Engine/Templates`.

To get started, follow these steps:

- Launch the editor (run** UnrealEditor** from your source build with no project or use the **Epic Games Project Browser**).
- In the Project Browser, open the **HMI **category on the left-hand side named **Automotive HMI & Vehicle Cockpit using Android Single Instance Service** from the options.
- Select the **HMI Automotive Blank** template.
- Click **Create**.

The generated project will include these settings and plugins already set up for the project:

- Plugins:AndroidSingleInstanceService
- MultiWindow
- ModularViewports

- Staging Remap settings so the plugin is staged into a packaged build. (See below for more details)
- ASIS game engine set up for render-interval control.
- ASIS plugin project settings pre-configured.

For more specifics about each of these, see the sections below.

If the HMI category does not appear in the Epic Games Project Browser, confirm you are running a source build that contains the ASIS plugin by checking if it’s there in the `Engine/Restricted/LimitedAccess/Plugins/HMI/AndroidSingleInstanceService/` folder.

The template only becomes available when the plugin is present in this folder.

## Add ASIS to an Existing Project

If you already have a project you want to use, you can set up the ASIS plugin manually. This requires the following:

- Enabling Plugins
- Configuring Staging Remap Settings
- Setting ASIS Game Engine
- Configuring ASIS Project Settings

### Enabling ASIS Plugins

Follow these steps to enable ASIS plugins for your project:

- Go to the main menu and select **Edit > Plugins**. Search for **AndroidSingleInstanceService** and enable it. Enabling this plugin will automatically enable **MultiWindow** and **ModularViewports** plugins. These are required to use ASIS.
- Restart the editor when prompted.

### Configuring Staging Remap Settings

Because restricted plugins live under `Engine/Restricted/LimitedAccess/`, and these are stripped at the time of staging, you’ll need to add remapping to the configuration file so that the plugin is staged into the packaged build.

Locate your DefaultGame.ini configuration file in your `{Project}/Config/` folder and add the following under `[Staging]`:

 Config

```
[Staging]
+RemapDirectories=(From="Engine/Restricted/LimitedAccess/Plugins/HMI/AndroidSingleInstanceService", To="Engine/Plugins/HMI/AndroidSingleInstanceService")
+RemapDirectories=(From="Engine/Restricted/LimitedAccess/Plugins/HMI/MultiWindow", To="Engine/Plugins/HMI/MultiWindow")
```

[Staging]
+RemapDirectories=(From="Engine/Restricted/LimitedAccess/Plugins/HMI/AndroidSingleInstanceService", To="Engine/Plugins/HMI/AndroidSingleInstanceService")
+RemapDirectories=(From="Engine/Restricted/LimitedAccess/Plugins/HMI/MultiWindow", To="Engine/Plugins/HMI/MultiWindow")

### Selecting the ASIS Game Engine

This is required for Render-Interval Control.

In order to use the extra-view frame skipping that is implemented by `UGameEngine `subclass, you’ll need to edit the **DefaultEngine.ini** configuration file.

Locate the DefaultEngine.ini configuration file in your `{Project}/Config/` folder, and add the following to `[/Script/Engine.Engine]`:

 Config

```
[/Script/Engine.Engine]
GameEngine=/Script/AndroidSingleInstanceService.AsisGameEngine
```

[/Script/Engine.Engine]
GameEngine=/Script/AndroidSingleInstanceService.AsisGameEngine

If your project already ships a custom GameEngine, derive it from `UAsisGameEngine` instead of `UGameEngine`. This will ensure that per-view render intervals are still honored.

### Configuring the Plugin Setting

In the main menu under **Edit > Project Settings** in the Plugins category, locate the **AndroidSingleInstanceService** section and enable the following packaging settings:

| Setting | Purpose |
| --- | --- |
| **Use AndroidSingleInstanceService** | Master switch. Turns on the service, manifest patching, and permissions in packaged builds and quick launch. |
| **Compile ASISProject** | Also builds the standalone example client (`ExampleUseCase_{Project}`) during packaging. |
| **Enable asis libs generation** | Emits the `asiscommon` / `asisclientlib` AARs (and source JARs) that clients link against. |

These settings also map to the `UAndroidSingleInstanceServiceRuntimeSettings` section and are written to the **DefaultEngine.ini** configuration file.

 Config

```
[/Script/AndroidSingleInstanceServiceEditor.AndroidSingleInstanceServiceRuntimeSettings]
bEnableASISPlugin=True
bCompileASISProject=True
bEnableAsisLibGeneration=True
```

[/Script/AndroidSingleInstanceServiceEditor.AndroidSingleInstanceServiceRuntimeSettings]
bEnableASISPlugin=True
bCompileASISProject=True
bEnableAsisLibGeneration=True

- automotive
- android
- hmi
- asis

On this page

- Project Prerequisites and Toolchain (-> setting-up-an-asis-project-in-unreal-engine)
- Create a New Project from the ASIS Template (-> setting-up-an-asis-project-in-unreal-engine)
- Add ASIS to an Existing Project (-> setting-up-an-asis-project-in-unreal-engine)
- Enabling ASIS Plugins (-> setting-up-an-asis-project-in-unreal-engine)
- Configuring Staging Remap Settings (-> setting-up-an-asis-project-in-unreal-engine)
- Selecting the ASIS Game Engine (-> setting-up-an-asis-project-in-unreal-engine)
- Configuring the Plugin Setting (-> setting-up-an-asis-project-in-unreal-engine)

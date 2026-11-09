# Microsoft GDK Plugins for Unreal Engine

https://dev.epicgames.com/documentation/en-us/unreal-engine/microsoft-gdk-plugins-for-unreal-engine?application_version=5.9

> Plugins for using the Microsoft Store, Xbox PC app, and GDK runtime libraries.

### Overview

In earlier versions of Unreal Engine, PC games targeting the Microsoft Store / Xbox PC App would typically use a separate platform: WinGDK. This platform was designed to provide close parity with Xbox including package generation, Xbox Online Services, and the other GDK runtime libraries. Nevertheless, this approach presented several drawbacks. Many plugins did not list 'WinGDK' as a supported platform which could lead to a suboptimal user experience. Furthermore, for games targeting multiple PC stores, the cooking process had to be performed twice: once for the standard Win64 version and again for WinGDK.

Unreal 5.8 now includes a set of plugins for Win64 titles that can provide access to the Microsoft Store / Xbox PC App, and the Microsoft Game Development Kit (GDK) runtime libraries.

Please note that this guide assumes some knowledge of the Microsoft GDK. Please familiarize yourself with Microsoft’s Game Development Kit documentation first.

### About the Plugins

There are two key PC GDK plugins available. A title can choose to use one or both depending on the need.

- The Microsoft GDK Store Plug-in (MSGameStore) provides automatic generation of `.msixvc` packages for submission to the Xbox PC App.

- The Microsoft GDK Runtime Plugin-in (MSGamingRuntime) provides access to the GDK runtime functionality, such as Xbox-compatible save games and Xbox user selection.

There are additional runtime plugins available depending on the needs of your project:

- The GDK Package Chunk Installer plugin implements support for Intelligent Delivery in your .msixvc package.

- The Online Subsystem GDK plugin implements support for Xbox Live Services (XSAPI).

- The Online Subsystem Selector for PC GDK to automatically switch to Online System GDK when the game is installed using the Xbox PC App.

- The GDK Virtual Keyboard plugin for on-screen text input, although we recommend the newer Windows Virtual Keyboard plugin instead.

Your setup depends on which PC store(s) you are shipping on, and whether you want to use the GDK runtime (for Xbox services, on-demand chunk installation, etc). Depending on the complexity of the situation, it may be necessary to create a dedicated build target for the PC GDK build.

| Store | MSGameStore | MSGamingRuntime | Dedicated Build Target |
| --- | --- | --- | --- |
| Xbox PC Store | ✅ ✅ | ❌ ✅ | no no |
| Other PC Stores | ❌ ❌ | ❌ ✅ | no no |
| All PC Stores | ✅ ✅ ✅ ✅ | ❌ ✅ (All stores) ✅ (Only Xbox PC app) ✅ (MSGameOSSSelector) § | no † no † **yes ‡** no † |

† See Patching Considerations below.

‡ While Microsoft policies do not prohibit GDK binaries from being shipped in other PC storefronts, a dedicated PC GDK build target means the executable for other PC stores can exclude GDK runtime behavior. See Custom Build Target (-> microsoft-gdk-plugins-for-unreal-engine) below.

§ The Online Subsystem Selector for the PC GDK (MSGameOSSSelector) plugin removes the need for a dedicated build target if your game can handle switching automatically, which means you can use a single build with all PC stores.

### Getting Started

A comprehensive migration script is provided to assist existing WinGDK games in transferring your settings across to use these new plugins; further details can be found later in this document.

We recommend that you register for ID@Xbox, create a Partner Center account and that you add a project definition for your game. See the Steps For All Games in Microsoft’s Game Development Kit documentation for details.

The Microsoft GDK Store and Microsoft GDK Runtime plugins are both configurable through the Editor's Project Settings in the **MS Gaming (PC GDK)** section:

[image: GDK Associate Your Project]

The first step is to associate the game with the project definition created in Partner Center - either via the button or by manually copying items from Partner Center. (Due to limitations with the Partner Center API, it is necessary to manually copy the publisher details in either case.)

> **note:** If you have an existing WinGDK title, it is recommended to use the more comprehensive migration script described later, rather than the “Import from WinGDK” button on this screen.

[image: PC GDK Plugin Options]

Once that is done, you can  configure the localizable images and text used for the build in the Content section.

[image: GDK Content Options]

If you enabled the Microsoft GDK Store plugin, you also see these additional sections:

[image: Packaging Options]

[image: Chunk Install Options]

Note that when defining the Chunk Install details here, any on-demand chunks require using the GDK Package Chunk Installer plugin to manage them.

### Custom Build Target

Supporting a single build executable for multiple PC storefronts is possible but usually requires modifying code to support runtime switching beyond what the plugins provide in. To avoid having any GDK runtime functionality in the executable for other PC game stores, it is currently necessary to have a separate build target. This is also the recommended approach if you have an existing Win64 build and are migrating your WinGDK build to PC GDK.

> **note:** A separate build target differs from the separate WinGDK platform in that the cooked data is identical between the two, and only the Build, Stage and Pak steps need to be performed separately.

Start by creating a new `.target.cs` file in your game’s Source folder. The convention is to add an ‘MSG’ suffix to indicate it is for the MS Game store. In most cases it can inherit from your normal game’s build target. It should list the additional plugins you require. It can also specify a custom config (the convention is MSGameStore).

**target.cs**
```c_sharp
using UnrealBuildTool;
[SupportedPlatforms("Win64")] // PC-GDK is Win64 only
public class LyraGameMSGTarget : LyraGameTarget
{
public LyraGameMSGTarget(TargetInfo Target) : base(Target)
{
EnablePlugins.AddRange([
"MSGameStore",
"MSGamingRuntime",
"OnlineSubsystemGDK",
```
(6 more lines on the web page)

You can then create the custom config files for your build in a `Config/Windows/Custom/MSGameStore` folder. This can contain any supported config files, but the most important is a `WindowsEngine.ini`.

**WindowsEngine.ini**
```config
; add this if you are expecting to do intelligent delivery and use on-demand
chunks etc
[StreamingInstall]
DefaultProviderName=GDKPackageChunkInstall
; add this if you are planning on using Xbox cross-platform save games
[PlatformFeatures]
SaveGameSystemModule=GDKSaveGameSystem
; add this if you are planning on using the GDK online subsystem (XSAPI)
[OnlineSubsystem]
DefaultPlatformService=GDK
```
(1 more lines on the web page)

Finally, make sure your project no longer has the PC GDK plugins enabled — these can be deselected in the editor. This means your main game executable will not have GDK runtime behavior in it.

You can now create two separate builds. First, cook the main game in the usual way, for example:

**Command Line**
```command_line
RunUAT BuildCookRun -project=Lyra -platform=Win64 -build -cook -stage
-pak -archive -archivedirectory=D:\LyraGame\
```

Now you can generate the custom build and package, re-using the previously cooked data:

**Command Line**
```command_line
RunUAT BuildCookRun -project=Lyra -Platform=Win64 -build -skipcook
-stage -pak -archive -archivedirectory=D:\LyraGameMSG\ -package
-target=LyraGameMSG
```

This gives you a folder with the `LyraGameMSG` staged build, and the `.msixvc` package in an `MSGameStore` folder underneath.

### Patching Considerations

The `.msixvc` CUv3 package patching system uses 4k-aligned chunks, and Unreal Engine `.pak` files are aligned in 2k chunks by default. It is possible to re-use the same `.pak` files for both stores, however the PC GDK patch download size might be suboptimal. It depends on the size and frequency of your game’s likely updates as to whether you should be concerned about this or not.

If 4k `.pak` alignment is required on the PC GDK package, the recommended way in is to use a Custom Build Target as described above, then add the following to your custom MSGameStore `WindowsEngine.ini`:

**WindowsEngine.ini**
```config
[/Script/WindowsTargetPlatform.WindowsTargetSettings]
CustomDeployment=MSGameStore
```

When you use the BuildCookRun command provided in the previous section, the archive directory only contains the `.msixvc` package and not the staged build.

### Migrating WinGDK Games

If you have an existing title that is using WinGDK, you might want to migrate to the PC GDK plugins by running the following script which will guide you through the choices.

**Command Line**
```command_line
RunUAT MigrateWinGDK -project=Path/To/Project.uproject -p4
```

> **tip:** You can also run with `-nop4` if you are not using Perforce

There are three ways you can migrate your WinGDK settings. Which you choose will depend on your project's packaging and publishing requirements.

The first option is to upgrade your Win64 project with the MSGameOSSSelector plugin.

- We recommend this when you are releasing on other PC stores in addition to the Windows Store and want to re-use the same executable.

- Adds MSGameStore, MSGamingRuntime and MSGameOSSSelector to your project.

- GDK online services are configured using `.ini` files in Config/Windows/MSGameOSS/.

- These settings only take effect when running as a packaged MSIXVC process (or with `-ForceOSSGDK` on the command line), otherwise the build behaves as it did before.

- We recommend that you ensure the rest of your game code can handle changing PC stores and OSS at runtime.

The second option is to create a PC-GDK specific build target.

- We recommend this when releasing on other PC stores in addition to the Windows Store and you need to write custom code for PC GDK.

- This results in a different `.exe` file, just like WinGDK. Unlike WinGDK, this uses the same cooked data as the default game target.

- Default subsystems are set to GDK, such as save games and online subsystems.

- A custom `.ini` file is created that can override options in the default game (this is what sets the default subsystems).

The third option is to upgrade your Win64 project with all PC GDK plugins.

- We recommend this when you are only ever releasing on the Windows Store.

- This adds your chosen PC GDK plugins to your project and they will be present in your normal Win64 `.exe` file.

- Default subsystems are unchanged and not set to GDK, such as save games and online subsystems.

- You can set them to GDK as default by modifying your `WindowsEngine.ini`, `target.cs` and `.uproject` files later as needed.

In all cases, your project's `DefaultEngine.ini `is modified to add the configuration options for GDK such as TitleId, Publisher name, and so on, but these do not alter the behavior of the normal Win64 build.

### Module Usage

This list is not exhaustive but serves to highlight some of the key functions that might be useful when getting started.

#### MSGameStore Module

This module becomes available when the Microsoft GDK Store Plug-In is enabled.

```cpp_programming
IMSGameStoreModule::Get().IsPackaged()
```

This function can be used to determine if the game is running as an installed package, without relying on the GDK runtime libraries.

```cpp_programming
IMSGameStoreModule::Get().GetChunkInstaller()
```

This helper function will return the GDK Chunk Installer module if it is available - you need to have enabled both the MSGamingRuntime and GDKPackageChunkInstall plugins too.

#### MSGamingRuntime module

This module becomes available when the Microsoft GDK Runtime Plug-in is enabled.

```cpp_programming
IMSGamingRuntimeModule::Get().IsAvailable()
```

This function returns whether the GDK is available. This means that the GDK was successfully initialized and the current executable was compiled with the GDK as well.

If this returns true, it is safe to access the main GDK runtime module via `IGDKRuntimeModule::Get()` which contains many functions for working with the GDK APIs.

#### MSGameOSSSelector Module

This module becomes available when you enable the Online Subsystem Selector for PC GDK Plug-In is enabled.

```cpp_programming
IMSGameOSSSelectorModule::Get().HasModifiedConfiguration()
```

You can use this function can be used to determine if the game should run in “GDK mode” — that is, the game is an installed MSIXVC package or was run with `-ForceOSSGDK`.

### Testing for PC GDK

It might be necessary to detect whether a valid PC GDK is available from a plugin or game module’s `build.cs` file.

You can accomplish this by calling a helper function on the GRDK module:

```cpp_programming
bool bHasValidGDK = GRDK.IsGDKEditionValid();
```

In 5.6 and 5.7, this module is still part of the NDA GDK code. Everyone may not have access to this so it is necessary to call the function via C# reflection instead.

```cpp_programming
MethodInfo IsValidFn = System.Type.GetType("GRDK, UE5Rules", false)?
.GetMethod("IsGDKEditionValid", BindingFlags.Public|BindingFlags.Static);
bool bHasValidGDK = (IsValidFn != null) && (bool)IsValidFn.Invoke(null,null);
```

There is no functionality in engine releases prior to 5.6. If the reflection check above can’t find the function the best fallback would be to query the WinGDK platform SDK status, as follows:

```cpp_programming
UEBuildPlatformSDK SDK = UEBuildPlatformSDK.GetSDKForPlatform("WinGDK");
bool bHasValidGDK = SDK.IsVersionValid(SDK?.GetInstalledVersion(), "Sdk");
```

Putting it together, the following code snippet should work on all recent engine releases:

```c_sharp
bool bHasValidGDK = false;
// for 5.6 onwards
MethodInfo IsValidFn = System.Type.GetType("GRDK, UE5Rules", false)?
.GetMethod("IsGDKEditionValid", BindingFlags.Public|BindingFlags.Static);
if (IsValidFn != null)
{
bHasValidGDK = (bool)IsValidFn.Invoke(null,null);
}
else
{
```
(3 more lines on the web page)

### ARM64

ARM64 support with PC GDK requires the April 2026 GDK or higher.

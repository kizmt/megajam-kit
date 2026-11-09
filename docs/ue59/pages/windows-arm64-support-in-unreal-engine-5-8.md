# Windows ARM64 Support

https://dev.epicgames.com/documentation/en-us/unreal-engine/windows-arm64-support-in-unreal-engine-5-8?application_version=5.9

> Building and deploying game targets to Windows on ARM64 hardware.

Learn to use this **Experimental** feature, but use caution when shipping with it.

This page covers how to build and deploy game targets to Windows on ARM64 hardware.

This covers two ARM64 variants:

- **ARM64**: Native ARM64 code. Produces the most efficient binaries for ARM64 hardware and is the recommended choice for dedicated ARM64 game builds.
- **ARM64EC **(Emulation Compatible): ARM64 code that can interoperate with x64 DLLs in the same process. Useful when your project depends on third-party plugins or middleware that only ships x64 binaries. ARM64EC binaries carry a small overhead compared to pure ARM64 due to x64 interop support.

You can also produce a **combined arm64+x64 build**, which packages two side-by-side executables. The UE bootstrapper launches the correct one based on the machine's architecture.

This support is for game targets only. The Unreal Editor is not supported on ARM64.

## Prerequisites

- A Windows on ARM64 development or test PC
- Visual Studio 2022 with the **ARM64 build tools** component installed (available in the Visual Studio Installer under Individual Components)

## Building via the Editor

Select **Platforms > Package Project > Windows** from the main editor toolbar, then select the target architecture:

- `x64`
- `arm64`
- `arm64ec`

Then select **Platforms > Package Project** to start packaging.

The **Project Launcher** (accessible via **Platforms > Project Launcher**) supports creating and saving custom launch profiles for ARM64 builds.

Combined builds (`arm64+x64`, `x64+arm64ec`) require the command line.

## Building via RunUAT BuildCookRun

### Single-Architecture Builds

To build for arm64, add the -clientarchitecture parameter to BuildCookRun:

 Command Line

```
-clientarchitecture=arm64
```

-clientarchitecture=arm64

or

 Command Line

```
-clientarchitecture=arm64ec
```

-clientarchitecture=arm64ec

### Combined Architecture Builds

Combined builds package two side-by-side executables; the UE bootstrapper selects the correct one at launch. Use `-clientarchitecture=arm64+x64` to produce a build that includes both a native ARM64 executable and an x64 executable:

 Command Line

```
Engine\Build\BatchFiles\RunUAT.bat BuildCookRun
  -project=MyGame\MyGame.uproject
  -platform=Win64
  -clientarchitecture=arm64+x64
  -build -cook -stage -pak
```

Engine\Build\BatchFiles\RunUAT.bat BuildCookRun
 -project=MyGame\MyGame.uproject
 -platform=Win64
 -clientarchitecture=arm64+x64
 -build -cook -stage -pak

Use `-clientarchitecture=x64+arm64ec` to combine x64 with ARM64EC instead.

## Windows ARM64 PC GDK Support

ARM64 game targets are supported with the Microsoft GDK Plug-ins when using the April 2026 GDK or later. Install the April 2026 GDK, then build with `-platform=Win64 -clientarchitecture=arm64` as described above. No additional project configuration is required.

## Known Limitations

- **ARM64 Editor**: The native ARM64 and ARM64EC editor builds are not supported. While it is possible to run the x64 editor on ARM64, the recommended workflow is to develop on an x64 PC and deploy game builds to ARM64 hardware for testing.
- **Clang**: Clang is not supported for Windows ARM64 and ARM64EC targets. Use MSVC to build these targets.

- windows
- builds

On this page

- Prerequisites (-> windows-arm64-support-in-unreal-engine-5-8)
- Building via the Editor (-> windows-arm64-support-in-unreal-engine-5-8)
- Building via RunUAT BuildCookRun (-> windows-arm64-support-in-unreal-engine-5-8)
- Single-Architecture Builds (-> windows-arm64-support-in-unreal-engine-5-8)
- Combined Architecture Builds (-> windows-arm64-support-in-unreal-engine-5-8)
- Windows ARM64 PC GDK Support (-> windows-arm64-support-in-unreal-engine-5-8)
- Known Limitations (-> windows-arm64-support-in-unreal-engine-5-8)

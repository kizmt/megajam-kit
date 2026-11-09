# Android Development Requirements

https://dev.epicgames.com/documentation/en-us/unreal-engine/android-development-requirements-for-unreal-engine?application_version=5.9

> Android development requirements including compatible hardware, software, and SDK information.

[image: Android Development Requirements]

This page contains the software development kit (SDK) requirements needed to develop Unreal Engine (UE) projects for Android devices, as well as compatible hardware for the current version of UE.

## Current SDK Information

Since August 31, 2025, the Google Play Store requires both new apps and app updates to target Android 15 (API level 35). Apps built with versions of UE that target a lower API level won't submit successfully — neither for new submissions nor for updates to existing apps. To publish or update apps on Google Play, you must use UE 5.7 or newer, which provides target SDK 35 support.

Existing apps that are not being updated must already target API level 34 to remain available to new users on devices running newer versions of Android. Apps targeting API level 33 or lower will only be served to devices on the same or older OS version.

For more information, see the Android documentation on Google Play's target API level requirement.

- Current UE Version: 5.8
- Android Studio Version: Koala 2024.1.2 Patch 1 September 17, 2024
- Android SDK:Recommended target SDK: SDK 35
- Minimum target SDK for compilation: SDK 34
- Minimum install SDK level: SDK 26Different stores have their own target SDK minimum requirements, which may differ from that mentioned above.

- NDK Version: r27c
- Build-tools: 35.0.1
- Java runtime: OpenJDK 21.0.3 2024-04-16
- AGDE v23.2.91+ required for AGDE debugging (-> debugging-unreal-engine-projects-for-android-in-visual-studio-with-the-agde-plugin).

## Current Compatible Devices

UE supports Android devices meeting the following specifications:

- Android 8 or higher
- 64-bit Arm-based CPU
- UE 5.6 supports both 4KB and 16KB page sizes
- Compatible GPUsMali-T8xx, G5x, G6x, G7x, G6xx, G7xx, and G9xx series
- Adreno 5xx, 6xx, 7xx, and 8xx series
- PowerVR Rogue (GM9446 and newer), and IMG B-series and newer (BXM, BXT, CXT, DXT)
- Samsung Xclipse 5xx and 9xx series

- Compatible Graphics APIsOpenGL ES 3.2
- Vulkan 1.1 on Android 10 or later devices with compatible drivers

## Version History

| UE Version | Android Studio Version | Minimum Android SDK Version | Android NDK Version | Notes |
| --- | --- | --- | --- | --- |
| 5.8 | Koala 2024.1.2 Patch 1 September 17, 2024 | Recommended: SDK 35Minimum: SDK 34 | NDK r27c |  |
| 5.7 | Koala 2024.1.2 Patch 1 September 17, 2024 | Recommended: SDK 35 | NDK r27c |  |
| 5.6 | Koala 2024.1.2 August 29, 2024 | Recommended: SDK 34 Minimum: SDK 34 | NDK r27c | Supports 16kb memory page size. |
| 5.5 | Koala 2024.1.2 August 29, 2024 | Recommended: SDK 34 Minimum: SDK 34 | NDK r25b |  |
| 5.3-5.4 | Flamingo 2022.2.1 Patch 2 May 24, 2023 | Recommended: SDK 33 Minimum: SDK 30 | NDK r25b |  |
| 5.1-5.2 | Android Studio 4.0 | Recommended: SDK 32 Minimum: SDK 30 | NDK r25b | While SDK 30 is the minimum needed to compile on your system, SDK 26 is the minimum SDK you can target for shipping projects on devices. |
| 5.0 | Android Studio 4.0 | SDK 23 | NDK r21e | Minimum SDK version required to use Android File Server (AFS) is 26. |

- specifications
- android
- compatibility
- sdk
- platform delivery

On this page

- Current SDK Information (-> android-development-requirements-for-unreal-engine)
- Current Compatible Devices (-> android-development-requirements-for-unreal-engine)
- Version History (-> android-development-requirements-for-unreal-engine)

Related documents

Android Support

 [image: Android Support] (-> android-support-for-unreal-engine)

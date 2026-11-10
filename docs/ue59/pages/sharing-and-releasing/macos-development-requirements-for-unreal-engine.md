# MacOS Development Requirements

https://dev.epicgames.com/documentation/en-us/unreal-engine/macos-development-requirements-for-unreal-engine?application_version=5.9

> Development requirements for macOS, including compatible hardware, software, and SDK information.

[image: MacOS Development Requirements]

This page contains the software development kit (SDK) requirements needed to develop Unreal Engine (UE) projects for macOS.

## Recommended Hardware

|  |  |
| --- | --- |
| **Recommended Operating System** | Latest macOS Sequoia 14 |
| **Recommended Processor** | Apple Silicon M3 |
| **Minimum Processor** | M1 or M2 depending on rendering features |
| **Recommended Memory** | 32 GB or more |
| **Minimum Memory** | 16 GB |
| **Video Card** | Metal 1.2 Compatible Graphics Card |

## Minimum Software Requirements

Minimum requirements for running the engine or editor are listed below.

| Running the Engine |  |
| --- | --- |
| **Minimum Operating System** | Sonoma 14.5 |

The requirements for programmers developing with the engine are listed below.

| Developing with the Engine |  |
| --- | --- |
| **Recommended Xcode Version** | Xcode 26.1.1 |
| **Minimum Xcode Version** | Xcode 26.0 |

Xcode 26.4 is not compatible with Unreal Engine.

Although Xcode is preferred for macOS development, Unreal Engine also supports VS Code and Rider.

## Requirements for UE5 Rendering Features

| UE5 Feature | System Requirements |
| --- | --- |
| **Lumen Global Illumination and Reflections with Software Ray Tracing** | Apple computers with an Intel and AMD Based GPU and/or Apple Silicon M1+.To learn more see, Lumen Technical Details (-> lumen-technical-details-in-unreal-engine). |
| **Lumen Global Illumination and Reflections with Hardware Ray Tracing and MegaLights** | Apple Sillicon M2+ (Experimental support)To learn more, see, Lumen Technical Details (-> lumen-technical-details-in-unreal-engine). |
| **Nanite Virtualized Geometry and Virtual Shadow Maps** | Apple Silicon M2+ (Beta support).To learn more see, Nanite Virtualized Geometry (-> nanite-in-unreal-engine). |
| **Temporal Super Resolution** | Apple computers with an Intel and AMD Based GPU and/or Apple Silicon M1+.To learn more see, Temporal Super Resolution (-> temporal-super-resolution-in-unreal-engine).There are some runtime costs to be aware of. To learn more see the Anti-aliasing Performance section of our tech blog. |

## Version History

| UE Version | Minimum macOS Version | Recommended macOS Version | Minimum Xcode Version | Recommended Xcode Version | Notes |
| --- | --- | --- | --- | --- | --- |
| 5.8 | Sonoma 14.5 | Latest macOS Sequoia 15 | Xcode 26.0 | Xcode 26.1.1 | Xcode 26.4 is not compatible with Unreal Engine. |
| 5.6 - 5.7 | Sonoma 14.0 | Latest macOS 14 Sonoma | Xcode 15.2 | 15.4 or newer |  |
| 5.5 | Ventura 13.5 | Latest macOS 13 Ventura | Xcode 15.2 | 15.4 or newer |  |
| 5.4 | macOS 13 Ventura | Latest macOS 13 Ventura | Xcode 14.1 | Latest Xcode 14 |  |
| 5.2 - 5.3 | macOS 12.5 Monterey | Latest macOS 13 Ventura | Xcode 14.1 | Latest Xcode 14 | Unreal Editor is distributed with universal binaries for macOS through the Epic Games Launcher. Code plugins are required to use universal binaries to be considered compatible with macOS.MacOS requirements are now updated to maintain consistency with iOS requirements. |
| 5.1 | macOS 12 Monterey | Latest macOS 13 Ventura | Xcode 13.4.1 | Latest Xcode 14 | Native Apple Silicon support is available for macOS targets for both editor and project builds. Editor support for Apple Silicon is experimental. Some third-party SDKs and plugins do not yet contain ARM64 slices and may have compatibility issues. |
| 5.0 | macOS Catalina 10.15.7 | Latest macOS Monterey | Xcode 12.4 | Latest Xcode 13 | Added preliminary support for native Apple Silicon for macOS targets. Some SDKs do not yet contain ARM64 slices (e.g. Steam, Vivox). |

- specifications
- macos
- compatibility
- sdk
- platform delivery

On this page

- Recommended Hardware (-> macos-development-requirements-for-unreal-engine)
- Minimum Software Requirements (-> macos-development-requirements-for-unreal-engine)
- Requirements for UE5 Rendering Features (-> macos-development-requirements-for-unreal-engine)
- Version History (-> macos-development-requirements-for-unreal-engine)

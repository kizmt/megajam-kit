# iOS, iPadOS, and tvOS Development Requirements

https://dev.epicgames.com/documentation/en-us/unreal-engine/ios-ipados-and-tvos-development-requirements-for-unreal-engine?application_version=5.9

> iOS development requirements including compatible hardware, software, and SDK information.

[image: iOS, iPadOS, and tvOS Development Requirements]

This page contains the software development kit (SDK) requirements needed to develop Unreal Engine (UE) projects for iOS, iPadOS, and tvOS devices, as well as compatible hardware for the current version of UE.

## SDK Information

- Current UE Version: 5.8Supported Target SDK versions: iOS/iPadOS/tvOS 17 or later.
- Recommended macOS, Xcode, iOS base SDK versions:macOS Sequoia 15.x
- Xcode 26.1.1
- Base iOS/iPadOS/tvOS SDK 26

## Compatible Devices

UE 5.5 supports iOS, iPadOS, and tvOS devices that support the operating system version 15 and higher for their respective SDKs and use an Apple A8 processor or later. The following are the minimum compatible device models:

- iOS 17iPhone 11 or later

- iPadOS 17iPad (6th generation) or later
- iPad Air (3rd generation) or later
- iPad Mini (5th generation) or later
- iPad Pro (all models)

- tvOS 17Apple TV 4K (first generation) or later

Apple requires apps uploaded to App Store Connect to be built with Xcode 26 or later using base SDK iOS 26, iPadOS 26, tvOS 26, visionOS 26, or watchOS 26 since April 28, 2026.

To select iOS SDKs 15 and 16 in Unreal Engine 5.8, disable Metal Shader Stripping (`r.Shaders.Symbols=1`) to avoid a corrupted library assertion under the Xcode 26 metal-strip toolchain. Disabling shader stripping significantly increases Metal shader library size, which can affect performance.

Apple A8/A8X-based devices (iPad Air 2, iPad Mini 4 and Apple TV HD) are not supported in Unreal Engine 5.8.

## Version History

| UE Version | Supported macOS Versions | Xcode Version |
| --- | --- | --- |
| 5.8 | macOS Sonoma 15 | Xcode 26 |
| 5.7 | macOS Sonoma 14.5Latest macOS 14 | Xcode 16 |
| 5.6 | macOS Sonoma 14.5Latest macOS 14 | Xcode 16 |
| 5.5 | macOS Ventura 13 Latest macOS 14 | Xcode 15.2 |
| 5.4 | macOS Ventura 13 Latest macOS 14 | Xcode 14.1 |
| 5.2-5.3 | macOS Monterey 12.5Latest macOS Ventura 13 | Xcode 14.1 |
| 5.1 | macOS Monterey 12Latest macOS 13 Ventura | Xcode 14, Xcode 13.4.1 |
| 5.0 | macOS Catalina 10.15.7macOS Big Sur 11.6.4Latest macOS Monterey 12 | Xcode 13, Xcode 12.4 |

- specifications
- ios
- tvos
- ipados
- compatibility
- sdk
- platform delivery

On this page

- SDK Information (-> ios-ipados-and-tvos-development-requirements-for-unreal-engine)
- Compatible Devices (-> ios-ipados-and-tvos-development-requirements-for-unreal-engine)
- Version History (-> ios-ipados-and-tvos-development-requirements-for-unreal-engine)

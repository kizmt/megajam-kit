# iOS, iPadOS, and tvOS

https://dev.epicgames.com/documentation/en-us/unreal-engine/ios-ipados-and-tvos-in-unreal-engine?application_version=5.9

> Learn how to build and debug projects for iOS, iPadOS, and Apple TV.

[image: iOS, iPadOS, and tvOS]

Unreal Engine supports publishing to **iOS**, **iPadOS**, and **tvOS **devices. Developing for these platforms requires some specialized setup: a **Mac** computer is required to make signed builds for C++ projects, though Windows users can ship Blueprint-only projects without one. You must also use **Xcode **to debug builds on Apple devices.

This section covers the full development workflow for Apple platforms — from setting up your devices and managing provisioning profiles and signing certificates, to debugging and profiling your project with Apple's tools. It also includes guidance for Windows-based teams, platform-specific features, and advanced topics such as iOS app extensions, asset packs, and optimizing packaged game size. Although iOS and tvOS workflows are mostly the same, these guides cover the differences between them.

## Getting Started

- [image: iOS, iPadOS, tvOS Quick Start Guide] iOS, iPadOS, tvOS Quick Start GuideSet up an Unreal Engine project for iOS, tvOS, or iPadOS. (-> ios-ipados-tvos-quick-start-guide-for-unreal-engine)

- [image: iOS, iPadOS, and tvOS Development Requirements] iOS, iPadOS, and tvOS Development RequirementsiOS development requirements including compatible hardware, software, and SDK information. (-> ios-ipados-and-tvos-development-requirements-for-unreal-engine)

- [image: Set Up iOS, iPadOS, and tvOS Devices for Development] Set Up iOS, iPadOS, and tvOS Devices for DevelopmentSet up an Apple device so you can deploy Unreal Engine builds directly to that device for testing. (-> set-up-ios-ipados-and-tvos-devices-for-development-in-unreal-engine)

- [image: Connecting to tvOS Devices] Connecting to tvOS DevicesSet up your testing and debugging pipeline for tvOS connecting over a local area network. (-> connecting-to-tvos-devices-in-unreal-engine)

## iOS and tvOS for Windows Users

- [image: Remote Mac Builds] Remote Mac BuildsDo part of your compilation on a remote Mac from a Windows machine. (-> creating-remote-builds-of-unreal-engine-projects-for-ios)
- [image: Windows Metal Shader Compiler] Windows Metal Shader CompilerUse the Windows Metal Shader Compiler for iOS (-> using-the-windows-metal-shader-compiler-for-ios-in-unreal-engine)

## Development Guides

- [image: Test on Mac With Designed for iPad] Test on Mac With Designed for iPadUse Apple's Designed for iPad mode to test your iPad or iPhone project on your Apple Silicon Mac without using a physical device. (-> test-on-mac-with-designed-for-ipad-in-unreal-engine)

- [image: Working with iOS Input] Working with iOS InputGuidelines for working with external input devices in iOS, tvOS and iPadOS 14 and later (-> working-with-ios-input-in-unreal-engine)

- [image: Localizing plist and NSLocalizedString] Localizing plist and NSLocalizedStringIdentify strings in your project code that need to be translated. (-> localizing-plist-and-nslocalizedstring-in-an-ios-project-in-unreal-engine)

- [image: iOS Launch Storyboards] iOS Launch StoryboardsSetting up launch screen storyboards in your Unreal Engine projects for iOS (-> setting-up-ios-launch-storyboards-in-unreal-engine-projects)

- [image: Using In-App Purchases on iOS] Using In-App Purchases on iOSUsing in-app purchases to offer additional paid content for your iOS game. (-> how-to-use-inapp-purchases-in-unreal-engine-projects-on-ios)

## Packaging and Publishing

- [image: Packaging iOS Projects] Packaging iOS ProjectsLearn how to package iOS Projects in Unreal Engine (-> packaging-ios-projects-in-unreal-engine)

- [image: Provisioning Profiles and Signing Certificates] Provisioning Profiles and Signing CertificatesCreate a Provisioning Profile and Signing Certificate so you can package iOS, iPadOS, and tvOS applications. (-> setting-up-ios-tvos-and-ipados-provisioning-profiles-and-signing-certificates-for-unreal-engine-projects)

## Debugging

- [image: Accessing Logs and Crash Reports on iOS and tvOS] Accessing Logs and Crash Reports on iOS and tvOSDownload and read iOS and tvOS logs and crash reports either directly from device or from TestFlight. (-> accessing-logs-and-crash-reports-on-ios-and-tvos-in-unreal-engine)

- [image: Debugging iOS Projects With Xcode] Debugging iOS Projects With XcodeUse Xcode to launch your project on device and debug with break points and LLDB commands. (-> debugging-ios-projects-with-xcode-in-unreal-engine)

- [image: Using Unreal Engine Remote with Remote Session] Using Unreal Engine Remote with Remote SessionReplicate inputs from a mobile device on your workstation for testing. (-> using-unreal-engine-remote-with-remote-session)

## Optimization

- [image: iOS Packaged Game Size] iOS Packaged Game SizeFactors that affect the size of a packaged iOS game. (-> optimizing-packaged-game-size-for-ios-projects-in-unreal-engine)

- [image: Profiling iOS Projects with Platform-Native Tools] Profiling iOS Projects with Platform-Native ToolsPerform diagnostics on Unreal Engine iOS projects using Xcode and Instruments. (-> profiling-ios-projects-with-platformnative-tools)

- ios
- tvos
- ipados
- platform delivery

On this page

- Getting Started (-> ios-ipados-and-tvos-in-unreal-engine)
- iOS and tvOS for Windows Users (-> ios-ipados-and-tvos-in-unreal-engine)
- Development Guides (-> ios-ipados-and-tvos-in-unreal-engine)
- Packaging and Publishing (-> ios-ipados-and-tvos-in-unreal-engine)
- Debugging (-> ios-ipados-and-tvos-in-unreal-engine)
- Optimization (-> ios-ipados-and-tvos-in-unreal-engine)

Related documents

Performance and Optimization

 [image: Performance and Optimization] (-> performance-and-optimization-for-mobile-in-unreal-engine)

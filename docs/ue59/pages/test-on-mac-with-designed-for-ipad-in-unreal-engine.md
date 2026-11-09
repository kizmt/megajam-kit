# Test on Mac With Designed for iPad

https://dev.epicgames.com/documentation/en-us/unreal-engine/test-on-mac-with-designed-for-ipad-in-unreal-engine?application_version=5.9

> Use Apple's Designed for iPad mode to test your iPad or iPhone project on your Apple Silicon Mac without using a physical device.

[image: Test on Mac With Designed for iPad]

**Designed for iPad** and **Designed for iPhone** modes run your iOS or iPadOS application in a new window on your Mac workstation. These modes simulate running your app on an iPad or iPhone with no separate Mac-specific build required.

While this is an Apple feature available in Xcode, you can set up your environment to directly access these modes from within Unreal Editor.

This workflow replaces the Xcode iOS Simulator.

## Prerequisites

To follow this guide, make sure you have the following:

- An Apple Silicon Mac (M1/M2/M3/M4) with Unreal Engine and the required version of Xcode installed. For more information about Xcode version requirements, see iOS, iPadOS, and tvOS Development Requirements (-> ios-ipados-and-tvos-development-requirements-for-unreal-engine).
- Your Mac must be registered as a development device on the Apple Developer team that signs your iOS builds. Without this, macOS refuses to launch the application.
- Xcode signed in to your Apple Developer account in Xcode.
- A UE project that is set up for mobile development (-> setting-up-an-unreal-engine-project-for-mobile-platforms).

Additionally, we recommend enabling automatic code signing in Xcode.

## Configure iPad Settings in Unreal Editor

Before you can launch your project on your Mac, set up your project's iPad support settings to support iPad, iPhone, or both.

To enable support for iPad and iPhone in your Unreal Engine project, follow these steps:

- In Unreal Editor, go to **Edit > Project Settings > Platforms > iOS Settings**.
- In the **Build **section, set the following:**Supports iPad**: Enable to launch as Designed for iPad.
- **Supports iPhone**: Enable to launch as Designed for iPhone.

If you enable both, Designed for iPad takes priority. This matches Apple's behavior in Xcode.

## Launch Simulation from Unreal Editor

To launch your game on your Mac as a Designed for iPad or Designed for iPhone application directly from Unreal Editor, follow these steps:

- Go to **Platforms > Quick Launch Current Level > IOS**.The Designed for iPad or iPhone launch options may appear directly in the **Platforms > Quick Launch Current Level** menu if this platform mode is the only deployment target available for iOS.[image: The My Mac (Designed for iPad) option in Unreal Editor's Platforms > Quick Launch Current Level > IOS menu]
- Select your Mac from the device list. Your device appears as one of the following:**My Mac (Designed for iPad)** if your project supports iPad.
- **My Mac (Designed for iPhone)** if your project is iPhone-only.

Unreal Engine creates a build of your app and installs it directly on your Mac. The app launches as a window on the desktop and runs as if it were an iOS app on an iPad or iPhone.

## Adjust Game Behavior for Designed for iPad Mode

For C++ projects, you can detect at runtime whether your game is running as a Designed for iPad or Designed for iPhone application on Mac. This is useful for branching input handling, disabling motion-dependent features, or adjusting UI scaling.

Call `FIOSPlatformMisc::IsDesignedForIpadOnMacOS()` in your project’s C++ code to detect if your game is running in a simulation or on a device. This function returns true when your iOS build is running on Mac with Designed for iPad or Designed for iPhone mode, and false when running on a physical iPhone or iPad.

## Known Limitations

Designed for iPad and Designed for iPhone modes run your iOS app on Mac hardware, which differs from physical iOS devices in several important ways:

- **No touchscreen**: Mouse clicks emulate single-touch input. Multi-touch gestures, such as pinch, rotate, and two-finger swipe, may not translate reliably.
- **No motion sensors**: The accelerometer, gyroscope, and compass APIs return null data. Games that rely on motion controls require alternate input or runtime feature gating.
- **No camera or ARKit support**: Camera and ARKit features fail or return empty results.
- **Resizable window**: By default, your app runs in a freely resizable window on macOS. To enforce a fixed window size, set `UIRequiresFullScreen=true` in your project's `Info.plist`.
- **Performance differences**: Apple Silicon Macs are typically faster than the iPhones and iPads your game ships to. Always profile on physical hardware before drawing performance conclusions.

## Troubleshooting

### macOS Refuses to Launch the App

**Error**: After a successful build, the editor reports Launch failed! and macOS displays a dialog that says “ProjectName” cannot be opened because the developer did not intend for it to run on this Mac. Contact the developer for support.

**Cause**: macOS Gatekeeper rejects the application because the signing profile does not authorize this Mac. As of macOS 26, the `spctl --add` command and other historical Gatekeeper bypasses no longer work.

**Solution**: To resolve this issue, do one of the following:

- Register this Mac as a development device under the Apple Developer team that signs your iOS builds. After registration, the team's provisioning profile regenerates to include this Mac, and Launch On succeeds without further intervention. If you do not have admin access to register devices on your team, contact your team's Apple Developer admin.

Or

- Sign your iOS builds with a Personal Team that already includes this Mac. In **Edit > Project Settings > Platforms > iOS**, set your **Bundle Identifier **to one your Personal Team owns (for example, `com..[ProjectName]`) and update the signing certificate and provisioning profile accordingly. Personal Team profiles expire every seven days, so you must re-sign your build weekly. For more information, see Provisioning Profiles and Signing Certificates (-> setting-up-ios-tvos-and-ipados-provisioning-profiles-and-signing-certificates-for-unreal-engine-projects).

Designed for iPad is also available as a run destination within Xcode.

[image: Designed for iPad option in Run Destinations list at the top of UnrealGame window in XCode]

- ios
- iphone
- ipad
- mobile development
- simulator

On this page

- Prerequisites (-> test-on-mac-with-designed-for-ipad-in-unreal-engine)
- Configure iPad Settings in Unreal Editor (-> test-on-mac-with-designed-for-ipad-in-unreal-engine)
- Launch Simulation from Unreal Editor (-> test-on-mac-with-designed-for-ipad-in-unreal-engine)
- Adjust Game Behavior for Designed for iPad Mode (-> test-on-mac-with-designed-for-ipad-in-unreal-engine)
- Known Limitations (-> test-on-mac-with-designed-for-ipad-in-unreal-engine)
- Troubleshooting (-> test-on-mac-with-designed-for-ipad-in-unreal-engine)
- macOS Refuses to Launch the App (-> test-on-mac-with-designed-for-ipad-in-unreal-engine)

Related documents

Creating a Mobile Project

 [image: Creating a Mobile Project] (-> setting-up-an-unreal-engine-project-for-mobile-platforms)Packaging and Publishing for iOS, tvOS, and iPadOS

 [image: Packaging and Publishing for iOS, tvOS, and iPadOS] (-> building-packaging-and-publishing-unreal-engine-projects-for-ios-tvos-and-ipados)Performance and Optimization

 [image: Performance and Optimization] (-> performance-and-optimization-for-mobile-in-unreal-engine)iOS, iPadOS, and tvOS

 [image: iOS, iPadOS, and tvOS] (-> ios-ipados-and-tvos-in-unreal-engine)

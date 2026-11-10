# Developing for ARKit

https://dev.epicgames.com/documentation/en-us/unreal-engine/developing-for-arkit-in-unreal-engine?application_version=5.9

> How you can develop for ARKit-supported devices in Unreal Engine

[image: Developing for ARKit]

ARKit is a handheld augmented reality (-> developing-for-handheld-augmented-reality-experiences-in-unreal-engine) platform from Apple that is supported in Unreal Engine. This page describes how ARKit is supported in Unreal Engine, and how to set up your environment to develop with ARKit. Refer to Supported XR Devices (-> supported-xr-devices-in-unreal-engine) for the full list of which devices and which SDK versions Unreal Engine supports.

## Developing with the ARKit APIs

To develop for ARKit in Unreal Engine you must set up the following:

- Updated hardware and software. Refer to iOS Development Requirements (-> ios-ipados-and-tvos-in-unreal-engine).

- Xcode 12 or later installed.

- iOS 14 or later installed

- A supported, configured, and connected handheld iOS device with an A12 Bionic chip or greater.

- **Apple ARKit** plugin enabled in your project.

Once you're set up for developing with ARKit, you can use the unique ARKit functionality to develop for your iOS devices. Refer to Handheld AR Features (-> developing-for-handheld-augmented-reality-experiences-in-unreal-engine) for what features are supported in Unreal Engine.

## Getting Started with Development

After setting up your project with the Apple ARKit plugin, follow these guides to get started developing for ARKit devices.

%sharing-and-releasing-projects/xr-development/sharing-xr-experiences/arpins:topic%

## Profiling

The following guides show how to profile your XR application and what to consider when you need to improve performance.

- XR Performance and Profiling in Unreal Engine (-> xr-performance-and-profiling-in-unreal-engine)

- Testing and Optimizing Your Content in Unreal Engine (-> testing-and-optimizing-your-content)

- Debugging iOS and tvOS Projects

## Known Limitations

The following are known limitations of features in ARKit:

- Candidate images for image detection must have unique friendly names. If multiple candidate images share the same friendly name, only the image with the first instance of the friendly name will be recognized.

- mobile
- ar
- ios
- handheld ar
- arkit
- ar/vr/xr

On this page

- Developing with the ARKit APIs (-> developing-for-arkit-in-unreal-engine)
- Getting Started with Development (-> developing-for-arkit-in-unreal-engine)
- Profiling (-> developing-for-arkit-in-unreal-engine)
- Known Limitations (-> developing-for-arkit-in-unreal-engine)

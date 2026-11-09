# Augmented Reality Overview

https://dev.epicgames.com/documentation/en-us/unreal-engine/augmented-reality-overview-in-unreal-engine?application_version=5.9

> An overview of Epic's Augmented Reality implementation.

Augmented reality (AR) is a technology that overlays a computer-generated image on a user's view of the real world, providing a composite view.

The Unreal Engine AR framework provides a rich, unified framework for building augmented reality apps with the Unreal Engine for both iOS and Android handheld platforms. The unified framework provides a single path of development for both platforms, allowing developers to build augmented reality apps for both platforms using a single code path. The **Handheld AR** Blueprint template provides a complete example project demonstrating the augmented reality functionality available in the Unreal Engine.

Augmented reality provides user experiences that add 2D or 3D elements to a live view from a device's camera in a way that makes those elements appear to inhabit the real world.

## iOS and Android Release Support

The unified AR framework includes support for basic AR functionality like Alignment, Light Estimation, Pinning, Session State, Trace Results, and Tracking.

However, the augmented reality story for Android and iOS is constantly evolving. As of Unreal Engine 4.23, we now support some of the advanced functionality available in the latest ARCore and ARKit releases.

**ARCore 1.7**

- Augmented Faces

- Augmented Images

- Cloud Anchors

- Vertical Plane Detection

**ARKit 3.0**

- 2D Image Detection

- 3D Object Detection

- Face Tracking

- Persistent Experiences

- Shared Experiences

- People Occlusion&ast;

- Motion Capture (2D, 3D, LiveLink)&ast;

&ast; Unreal Engine 4.23.1 provides beta support for this feature.

Epic Games developer **Joe Graf** has written several informative blogs discussing ARKit functionality in UE4.

- 2D Image Detection in UE4 4.20

- ARKit 2.0 support in UE4 4.20

- AR Environment Probes in UE4 4.20

## Augmented Reality API

The unified AR framework provides a framework to build augmented reality apps with Unreal Engine for both iOS and Android handheld platforms. The unified AR framework provides a new library of C++ and Blueprint functions that allow developers to build augmented reality apps for both platforms using a single code path. These new functions also make working with augmented reality easier.
More detailed information can be found in the Unreal Engine API Reference.

The **Handheld AR** Blueprint template provides a complete example project demonstrating the new augmented reality functionality available in Unreal Engine. A good place to start exploring the project and the new augmented reality functions is to open the **Content Browser**, navigate to **Content\HandheldARBP\Blueprints\UI** and open the **BP_DebugMenu** asset in the **Blueprint Editor**.

## Supported Handheld Platforms

Currently, we support the iOS and Android platforms. Please read through the following pages to learn which devices are supported on each platform.

- Apple's iOS Device Compatibility Reference

- ARCore Supported Devices Overview

It's worth mentioning that support for handheld iOS and Android devices isn't new to the Unreal Engine, so if you're already working with Unreal Engine and iOS or Android devices, you'll only need a minimal amount of additional configuration to get started with augmented reality in Unreal Engine.

### iOS

For detailed iOS augmented reality prerequisite information, see the ARKit Prerequisits (-> arkit-prerequisites-in-unreal-engine) topic. Additionally, basic configuration of Unreal Engine and iOS devices is covered in the iOs and tvOS section of the Unreal Engine documentation.

### Android

For detailed Android augmented reality prerequisite information, see the ARCore Prerequisites (-> arcore-prerequisites-in-unreal-engine) topic. Basic configuration of Unreal Engine and Android devices is covered in the  section of the Unreal  Engine documentation.

## Getting Started with Unreal AR

Now that you understand some basic information about using Unreal Engine with augmented reality, it's time to get started by running through the Handheld AR Template Quickstart (-> handheld-ar-template-quickstart-in-unreal-engine) tutorial.

# Developing for Head-Mounted Experiences with OpenXR

https://dev.epicgames.com/documentation/en-us/unreal-engine/developing-for-headmounted-experiences-with-openxr-in-unreal-engine?application_version=5.9

> Develop on head-mounted AR and VR devices with OpenXR in Unreal Engine.

[image: Developing for Head-Mounted Experiences with OpenXR]

OpenXR is a royalty-free, open standard that provides high-performance access to XR platforms and devices. Epic Games is one of the founding members of the OpenXR Working Group, along with the Khronos Group and industry partners. This multi-company group is working to solve XR fragmentation with a cross-platform standard.

With OpenXR, you can create an immersive experience in Unreal Engine that can run on any system that supports the OpenXR APIs. Currently, OpenXR in Unreal Engine only supports head-mounted devices. To develop XR projects for handheld devices, refer to Developing for Handheld Augmented Reality Experiences (-> developing-for-handheld-augmented-reality-experiences-in-unreal-engine).

[image: The openxr logo] OpenXR and the OpenXR logo are trademarks of the Khronos Group Inc.

This page contains links to documentation about the devices supported by OpenXR and how to develop for head-mounted devices with OpenXR in Unreal Engine.

## OpenXR Runtimes

Each platform has an OpenXR runtime, which is the implementation of the OpenXR APIs for that platform. This page describes all the supported OpenXR runtimes and how to set up your projects to work with them.

- [image: OpenXR Runtime] OpenXR RuntimeLearn how to install the OpenXR runtime and set up your projects for OpenXR. (-> openxr-prerequisites-in-unreal-engine)

### Plugin Priority

Your Unreal Engine project can ship with the following plugins enabled: OpenXR, Oculus, SteamVR, and Windows Mixed Reality. When you launch your app, the list of plugins is checked in order of the plugin's priority from highest to lowest. The first plugin in the list, whose runtime the app can connect to, is selected.

The following is the current order of plugin priority in Unreal Engine, from highest to lowest:

- Oculus
- OpenXR
- Windows Mixed Reality
- SteamVR

## Extending OpenXR in Unreal Engine

The OpenXR plugin in Unreal Engine supports extension plugins so you can add functionality to OpenXR without relying on engine releases. There are OpenXR extension plugins included in the engine release.

The plugins currently available in Unreal Engine to extend the OpenXR plugin include:

- OpenXRHandTracking
- OpenXREyeTracker
- XRVisualization
- OpenXRMsftHandInteraction
- HP Motion Controller
- OpenXRViveTracker
- XRScribe

You can also install extension plugins from Fab or make your own.

## Supported Platforms

Unreal Engine 5 supports OpenXR devices on Windows and Android.
For device specific features provided through OpenXR Vendor Extensions, device vendors are responsible for development and support. You can find vendor plugins for XR devices on Fab.

### Internally validated devices using the native OpenXR Plugin

- Meta Quest 2/3 (PC and Android)
- HTC Vive
- Valve Index

### Externally validated devices

Epic does not guarantee or provide support for device specific features using the following platforms.

- Meta Quest
- Windows Mixed Reality
- Varjo
- Pico
- Magic Leap

- xr
- steamvr
- openxr
- oculus
- windows mixed reality
- ar/vr/xr

On this page

- OpenXR Runtimes (-> developing-for-headmounted-experiences-with-openxr-in-unreal-engine)
- Plugin Priority (-> developing-for-headmounted-experiences-with-openxr-in-unreal-engine)
- Extending OpenXR in Unreal Engine (-> developing-for-headmounted-experiences-with-openxr-in-unreal-engine)
- Supported Platforms (-> developing-for-headmounted-experiences-with-openxr-in-unreal-engine)
- Internally validated devices using the native OpenXR Plugin (-> developing-for-headmounted-experiences-with-openxr-in-unreal-engine)
- Externally validated devices (-> developing-for-headmounted-experiences-with-openxr-in-unreal-engine)

# OpenXR Runtime

https://dev.epicgames.com/documentation/en-us/unreal-engine/openxr-prerequisites-in-unreal-engine?application_version=5.9

> Learn how to install the OpenXR runtime and set up your projects for OpenXR.

[image: OpenXR Runtime]

OpenXR Runtime

To develop OpenXR projects in Unreal Engine (UE), you must install the OpenXR runtime for the platform and hardware you are developing for. The following sections cover how to install the correct OpenXR runtime and which plugins are needed for each platform.

Currently, some of the platform-specific plugins in UE are incompatible with the OpenXR plugin. Make sure you disable the Oculus, SteamVR and Windows Mixed Reality plugins when using the OpenXR plugin in your Unreal project.

## Windows Mixed Reality

Complete the following items to begin using your Windows Mixed Reality devices with OpenXR in the Unreal Editor:

- Complete the steps in Microsoft's Getting Started with OpenXR documentation to install the **OpenXR** runtime for **Windows Mixed Reality** on your computer.

- Enable the **OpenXR** plugin in your Unreal project.

- Optional:Install the Microsoft OpenXR Plugin

## Oculus

Complete the following items to begin using your Oculus devices with OpenXR in the Unreal Editor:

- Complete the steps in Oculus Prerequisites (-> oculus-prerequisites-in-unreal-engine) to set up your computer and device.

- Enable the **OpenXR** plugin in your Unreal project.

## SteamVR

Complete the following items to begin using your SteamVR devices with OpenXR in the Unreal Editor:

- Complete the steps in SteamVR Prerequisites (-> steamvr-prerequisites-in-unreal-engine) to set up your computer and device.

- Enable the **OpenXR** plugin in your Unreal project.

## OpenXR Runtime Environment Variable

If there are several OpenXR runtimes on your computer, you will need to set an environment variable so that Unreal Engine can find the correct OpenXR runtime.

While each OpenXR compatible runtime should support any OpenXR device, for best results, install the official runtime (SteamVR for Vive/Index, Oculus app for Quest, etc). You can do this manually but we use, and recommend using OpenXR Explorer. It allows for easy switching between OpenXR runtimes, shows lists of the runtime's supported extensions, and allows for inspection of common properties and enumerations, with direct links to relevant parts of the OpenXR specification.

- xr
- steamvr
- openxr
- oculus
- windows mixed reality

On this page

- Windows Mixed Reality (-> openxr-prerequisites-in-unreal-engine)
- Oculus (-> openxr-prerequisites-in-unreal-engine)
- SteamVR (-> openxr-prerequisites-in-unreal-engine)
- OpenXR Runtime Environment Variable (-> openxr-prerequisites-in-unreal-engine)

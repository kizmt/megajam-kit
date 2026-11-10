# Developing for SteamVR

https://dev.epicgames.com/documentation/en-us/unreal-engine/developing-for-steamvr-in-unreal-engine?application_version=5.9

> How you can develop for SteamVR in Unreal Engine.

> **warning:** The SteamVR plugin was deprecated in Unreal Engine 5.1. You should use the OpenXR plugin instead.

SteamVR is a head-mounted virtual reality (-> developing-for-headmounted-experiences-with-openxr-in-unreal-engine) platform from Valve that is supported in Unreal Engine through the OpenXR APIs. This page describes how SteamVR is supported in Unreal Engine, and how to set up your environment to develop with SteamVR.

SteamVR supports Vive, Oculus, and Windows Mixed Reality headsets. Refer to Supported XR Devices (-> supported-xr-devices-in-unreal-engine) for the full list of XR devices Unreal Engine supports.

Currently, you can develop for SteamVR with either the OpenXR plugin or the SteamVR plugin:

- When you develop with the OpenXR plugin, your application can run on any device that supports the OpenXR APIs.

- When you develop with the SteamVR plugin, your application can only run on devices that SteamVR supports. Some Unreal Engine features, such as Live Link XR (-> livelinkxr-in-unreal-engine), require the SteamVR plugin to use.

Refer to the Developing with OpenXR APIs (-> developing-for-steamvr-in-unreal-engine) and Developing with SteamVR APIs (-> developing-for-steamvr-in-unreal-engine) sections below for more details.

## Developing with OpenXR APIs

To develop with SteamVR using OpenXR in Unreal Engine you must set up the following:

- Updated hardware and software. Refer to your device's system and hardware requirements.

- SteamVR version 1.5.17 or later

- OpenXR Runtime for SteamVR (-> openxr-prerequisites-in-unreal-engine)

- **OpenXR** plugin enabled in your project

Once you're set up for developing with OpenXR, you can use the OpenXR APIs to develop for not only devices that SteamVR supports but any device that supports the OpenXR APIs. Refer to Developing for Head-Mounted Experiences with OpenXR (-> developing-for-headmounted-experiences-with-openxr-in-unreal-engine) for more details.

## Developing with SteamVR APIs

To develop with the SteamVR plugin you must set up the following:

- Updated hardware and software. Refer to your device's system and hardware requirements.

- SteamVR version 1.5.17 or later

- **SteamVR** plugin enabled in your project

Once you're set up for developing with the SteamVR plugin, you can use the SteamVR APIs to develop for SteamVR-supported devices.

## Getting Started with Development

After setting up your project with the OpenXR or SteamVR plugin, follow these guides to get started developing for XR.

- Getting Started with XR Development (-> getting-started-with-xr-development-in-unreal-engine): Set up your project and apply best practices for AR and VR devices with Unreal Engine.

- Making Interactive XR Experiences (-> making-interactive-xr-experiences-in-unreal-engine): Add user input to your AR and VR projects in Unreal Engine

- Creating UI for XR Experiences (-> design-user-interfaces-for-xr-experiences-in-unreal-engine): Design user interfaces for XR experiences in Unreal Engine

- XR Performance and Profiling (-> xr-performance-and-profiling-in-unreal-engine): Tools and strategies for profiling your XR projects in Unreal Engine

## Troubleshooting and Profiling

The following guides show how to profile your XR application and what to consider when you need to improve performance.

- XR Performance and Profiling in Unreal Engine (-> xr-performance-and-profiling-in-unreal-engine)

- Testing and Optimizing Your Content in Unreal Engine (-> testing-and-optimizing-your-content)

- SteamVR Frame Timing

If you experience issues with your headset, visit SteamVR Support or HTC Vive Support for troubleshooting help.

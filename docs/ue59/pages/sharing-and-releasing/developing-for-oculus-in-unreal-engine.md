# Developing for Oculus

https://dev.epicgames.com/documentation/en-us/unreal-engine/developing-for-oculus-in-unreal-engine?application_version=5.9

> How you can develop for Oculus devices in Unreal Engine.

> **warning:** The OculusVR plugin was deprecated in Unreal Engine 5.1. You should use the OpenXR plugin instead.

Oculus is a head-mounted virtual reality (-> developing-for-headmounted-experiences-with-openxr-in-unreal-engine) platform from Meta that is supported in Unreal Engine. This page describes how Oculus is supported in Unreal Engine, and how to set up your environment to develop with Oculus. Refer to Supported XR Devices for the full list of which Oculus devices Unreal Engine supports.

Currently, you can develop for Oculus devices with either the **OpenXR** plugin or the **Oculus VR** plugin:

- When you develop with the OpenXR plugin, your application can run on any device that supports the OpenXR APIs.

- When you develop with the Oculus VR plugin, your application can use Oculus-specific features that aren't currently included in the **Oculus OpenXR** extension plugin.

Refer to the Developing with OpenXR APIs (-> developing-for-oculus-in-unreal-engine) and Developing with Oculus APIs (-> developing-for-oculus-in-unreal-engine) sections below for more details.

## Developing with OpenXR APIs

To develop for Oculus using OpenXR in Unreal Engine you must set up the following:

- Updated hardware and software. Refer to Oculus' System and Hardware Requirements

- Oculus app

- Oculus Runtime v33.0 or later

- OpenXR Runtime for Oculus (-> openxr-prerequisites-in-unreal-engine)

- **OpenXR** plugin enabled in your project

- (Oculus Quest only) **Oculus OpenXR** plugin enabled in your project

Once you're set up for developing with OpenXR, you can use the OpenXR APIs to develop for not only Oculus devices but any device that supports the OpenXR APIs. Refer to Developing for Head-Mounted Experiences with OpenXR (-> developing-for-headmounted-experiences-with-openxr-in-unreal-engine) for more details.

## Developing with Oculus APIs

To develop for Oculus using the Oculus-specific APIs in Unreal Engine you must set up the following:

- Updated hardware and software. Refer to Oculus' System and Hardware Requirements

- Oculus app

- Oculus Runtime v33.0 or later

- **Oculus VR **plugin enabled in your project

Once you're set up for developing with the Oculus VR plugin, you can use Oculus-specific features that aren't available in the OpenXR APIs yet. The following features are currently available only in the Oculus VR plugin for Oculus devices:

- Hand tracking with Oculus Quest (-> making-interactive-xr-experiences-in-unreal-engine)

- Fixed Foveated Rendering (-> xr-performance-features-in-unreal-engine)

## Getting Started with Development

After setting up your project with the **OpenXR **or **Oculus VR** plugins, follow these guides to get started developing for Oculus devices.

- Getting Started with XR Development (-> getting-started-with-xr-development-in-unreal-engine): Set up your project and apply best practices for AR and VR devices with Unreal Engine.

- Making Interactive XR Experiences (-> making-interactive-xr-experiences-in-unreal-engine): Add user input to your AR and VR projects in Unreal Engine

- Creating UI for XR Experiences (-> design-user-interfaces-for-xr-experiences-in-unreal-engine): Design user interfaces for XR experiences in Unreal Engine

- XR Performance and Profiling (-> xr-performance-and-profiling-in-unreal-engine): Tools and strategies for profiling your XR projects in Unreal Engine

## Auto Instancing on Oculus

A **draw call** is the RHI command to draw an object. **Auto-Instancing** is a feature that automatically combines multiple draw calls into one instanced draw call. An **instanced draw call** is a way for the graphics API to draw multiple instances of similar objects that have varying attributes. These can be any attributes that relate to the rendering of a mesh: position, orientation, color, and so on. This page contains more details about auto-instancing on Oculus Quest.

- Auto Instancing on Oculus (-> auto-instancing-on-oculus-in-unreal-engine): Debugging auto-instancing in UE4 for Oculus Quest

## Troubleshooting and Profiling

The following guides show how to profile your XR application and what to consider when you need to improve performance.

- XR Performance and Profiling in Unreal Engine (-> xr-performance-and-profiling-in-unreal-engine)

- Testing and Optimizing Your Content in Unreal Engine (-> testing-and-optimizing-your-content)

- Oculus's page on Optimization Tools

If you experience issues with your Oculus headset, visit the Oculus Support Center for troubleshooting help.

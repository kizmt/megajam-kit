# Developing for Windows Mixed Reality

https://dev.epicgames.com/documentation/en-us/unreal-engine/develping-for-windows-mixed-reality-in-unreal-engine?application_version=5.9

> How you can develop for Windows Mixed Reality VR devices in Unreal Engine

Windows Mixed Reality is a head-mounted virtual reality (-> developing-for-headmounted-experiences-with-openxr-in-unreal-engine) platform from Microsoft that is supported in Unreal Engine through the OpenXR APIs. This page describes how Windows Mixed Reality is supported in Unreal Engine, and how to set up your environment to develop with Windows Mixed Reality. Refer to Supported XR Devices (-> supported-xr-devices-in-unreal-engine) for the full list of which devices Unreal Engine supports.

To develop Unreal Engine projects for Windows Mixed Reality VR devices you should use the **OpenXR** plugin and the **Microsoft OpenXR** plugin.

Refer to the Developing with OpenXR APIs (-> develping-for-windows-mixed-reality-in-unreal-engine) and Developing with Windows Mixed Reality APIs (-> develping-for-windows-mixed-reality-in-unreal-engine) sections below for more details.

## Developing with OpenXR APIs

To develop for Windows Mixed Reality VR devices using OpenXR in Unreal Engine you must set up the following:

- Updated hardware and software. Refer to Microsoft's Installation checklist.

- OpenXR Runtime for Windows Mixed Reality (-> openxr-prerequisites-in-unreal-engine).

- **OpenXR** plugin enabled in your project.

- Microsoft OpenXR plugin installed from Fab and enabled.

Once you're set up for developing with OpenXR, you can use the OpenXR APIs to develop for not only Windows Mixed Reality VR devices but any device that supports the OpenXR APIs. Refer to Developing for Head-Mounted Experiences with OpenXR (-> developing-for-headmounted-experiences-with-openxr-in-unreal-engine) for more details.

## Developing with Windows Mixed Reality APIs

To develop for Windows Mixed Reality VR devices using Windows Mixed Reality APIs in Unreal Engine you must set up the following:

- Updated hardware and software. Refer to Microsoft's Installation checklist

- **Windows Mixed Reality** plugin enabled in your project.

Once you're set up for developing with the Windows Mixed Reality plugin, you can use the Windows Mixed Reality APIs to create experiences for your Windows Mixed Reality VR devices.

## Getting Started with Development

After setting up your project with the OpenXR or Windows Mixed Reality plugin, follow these guides to get started developing for XR.

%sharing-and-releasing-projects/xr-development/getting-started-with-xr-development:topic%
%sharing-and-releasing-projects/xr-development/making-interactive-xr-experiences:topic%
%sharing-and-releasing-projects/xr-development/creating-ui-for-xr-experiences:topic%

## Profiling

The following guides show how to profile your XR application and what to consider when you need to improve performance.

- XR Performance and Profiling in Unreal Engine (-> xr-performance-and-profiling-in-unreal-engine)

- Testing and Optimizing Your Content in Unreal Engine (-> testing-and-optimizing-your-content)

- Microsoft's documentation on Profiling with Unreal Insights

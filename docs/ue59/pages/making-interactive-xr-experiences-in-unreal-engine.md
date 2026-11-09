# Making Interactive XR Experiences

https://dev.epicgames.com/documentation/en-us/unreal-engine/making-interactive-xr-experiences-in-unreal-engine?application_version=5.9

> Add user input to your AR and VR projects in Unreal Engine

[image: Making Interactive XR Experiences]

There are many different kinds of input for XR, such as hand tracking, motion controllers, and eye tracking. This page contains links to documentation about how to add input to your XR projects.

## Input in OpenXR for Head-Mounted Experiences

The OpenXR runtime uses interaction profiles to support various hardware controllers and provide action bindings for whichever controller is connected. This page explains the concepts of input and controller mapping emulation with OpenXR in Unreal Engine.

## Motion Controllers

Motion Controllers represent the controller or hands used for input with XR devices. Motion Controllers can be accessed through a Motion Controller Component, which is typically attached to your project's Pawn. The Motion Controller Component inherits from the Scene Component, which supports location-based behavior, and moves the Pawn it is attached to based on the tracking data from the hardware. This component provides the functionality to render the Motion Controller and to expose the controller for user interactions defined by the Pawn.

These pages show how to set up motion controllers in your project.

- [image: Using Motion Controllers] Using Motion ControllersShowing you how to pick up and drop objects using Motion Controllers. (-> using-motion-controllers-in-unreal-engine)
- [image: Motion Controller Component Setup] Motion Controller Component SetupInformation on how to setup Motion Controllers for VR interaction. (-> motion-controller-component-setup-in-unreal-engine)

## Hand Tracking

The following sections explain how to get started with using hand tracking for input on each platform that supports it.

### Oculus Quest

Hand tracking on Oculus Quest is available through the **Oculus VR** plugin. Currently, you cannot use hand tracking with an OpenXR project. The APIs for hand tracking on Oculus Quest are provided through an Oculus-custom component. Refer to Oculus's hand tracking documentation for more details on visualizing the user's hands and using them as input.

## Training Streams

Watch these training streams to learn how to add input to your XR projects.

## Next Steps

After setting up input in your XR project, follow these guides to add more functionality to your project and to improve its performance.

- [image: Creating UI for XR Experiences] Creating UI for XR ExperiencesDesign user interfaces for XR experiences in Unreal Engine (-> design-user-interfaces-for-xr-experiences-in-unreal-engine)

- [image: Sharing XR Experiences] Sharing XR ExperiencesCreate an immersive experience for multiple users in Unreal Engine (-> sharing-xr-experiences-in-unreal-engine)

- [image: XR Performance and Profiling] XR Performance and ProfilingTools and strategies for profiling your XR projects in Unreal Engine (-> xr-performance-and-profiling-in-unreal-engine)

- xr
- input
- openxr
- hand tracking
- motion controllers
- ar/vr/xr

On this page

- Input in OpenXR for Head-Mounted Experiences (-> making-interactive-xr-experiences-in-unreal-engine)
- Motion Controllers (-> making-interactive-xr-experiences-in-unreal-engine)
- Hand Tracking (-> making-interactive-xr-experiences-in-unreal-engine)
- Oculus Quest (-> making-interactive-xr-experiences-in-unreal-engine)
- Training Streams (-> making-interactive-xr-experiences-in-unreal-engine)
- Next Steps (-> making-interactive-xr-experiences-in-unreal-engine)

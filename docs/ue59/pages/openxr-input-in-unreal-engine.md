# OpenXR Input

https://dev.epicgames.com/documentation/en-us/unreal-engine/openxr-input-in-unreal-engine?application_version=5.9

> OpenXR runtimes provide controller emulation to support as many platforms as possible, and controller and hand poses to create immersive interactions.

The OpenXR runtime uses interaction profiles to support various hardware controllers and provide action bindings for whichever controller is connected. OpenXR input mapping in Unreal Engine relies on the Action Mappings Input System (-> input-in-unreal-engine) to connect actions to the OpenXR interaction profiles. See Creating New Inputs (-> setting-up-user-inputs-in-unreal-engine) for a guide on how to use the Action Mappings Input System.

The OpenXR input system is designed to provide cross-device compatibility by emulating any controller mapping that isn't explicitly specified with **Action Mappings** in the Unreal project. When emulating controller mappings, the OpenXR runtime chooses controller bindings that closely match the user's controller.
Because OpenXR provides this cross-compatibility for you, you should only add bindings for controllers you support and can test with. Any bindings you specify for a controller define what actions are connected to that controller. If you only partially apply bindings to a controller, then the controller won't support any missing bindings.
In the example below, the project has two actions: **Jump** and **Pickup**.

- **Jump** is mapped to keys on multiple controllers, such as **Vive Index (L) Trigger** and **Oculus Touch (L) Trigger**.

- **Pickup** is only mapped to **Valve Index (L) A Touch**. In this case, the OpenXR runtime will not emulate any of the other controllers for the **Pickup** action, because those controllers have bindings for **Jump** but not for **Pickup**. If the keys for the other controllers were removed from **Jump**, then the OpenXR runtime would be able to emulate the controllers for both **Jump** and **Pickup**.

 [image: Example engine input action mappings]

Some runtimes may only support a single interaction profile and do not have the ability to emulate any other profile. You should add bindings for as many devices as you have access to and plan to support.

## Poses

OpenXR provides two poses to represent how a user would hold their hand when performing the actions:

- **Grip:** Represents the position and orientation of the user's closed hand in order to hold a virtual object.

- **Aim:** Represents a ray from the user's hand or controller used to point at a target. See the OpenXR specification for more details on the two poses. In Unreal Engine, these two poses are represented as motion sources and are returned in the results when you call Enumerate Motion Sources, if they're available for your device.

Unreal Engine uses a different coordinate system than what's described in the OpenXR specification. Unreal uses the left-handed coordinate system: +X forward, +Z up, and +Y right.

Enable the **OpenXRMsftHandInteraction** plugin to replicate the OpenXR grip and aim poses of tracked hands on runtimes that support this extension plugin.
 [image: Openxr hand interaction plugin]

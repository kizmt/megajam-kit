# Android Single Instance Service Overview

https://dev.epicgames.com/documentation/en-us/unreal-engine/android-single-instance-service-overview-for-unreal-engine?application_version=5.9

> A plugin that enables Unreal Engine to run as an Android Service.

**Android Single Instance Service** (ASIS) is a plugin that enables you to run Unreal Engine as an Android service. Instead of shipping a self-contained full-screen application (app for short), the engine runs inside a long-lived Android Service, which native Android applications then connect to. This allows for the service to render content from Unreal Engine into external Android surfaces that the native app owns and sizes to that surface.

Normally, each Unreal Android app is a self-contained APK that owns the whole screen and runs its own engine process. However, that model doesn’t fit systems where the Android side owns the user interface (UI) and wants Unreal-rendered content embedded inside native app windows. For example, an automotive HMI / vehicle cockpit where the Android system UI arranges the surfaces and Unreal fills them with live 3D content.

ASIS splits the system into two cooperating apps:

- **The Unreal APK** runs the engine inside an Android Service — a single, long-lived engine instance.
- **A separate native “client” APK** (yours) binds to that service, hands it Android surfaces (SurfaceView / TextureView), and drives them. The client owns the Android UI and layout, Unreal only renders into the surface it is given.

## What Purpose Does ASIS Serve?

The core purpose of ASIS is to let native Android apps drive Unreal Engine’s rendering through external surfaces while getting the most out of a single running engine.

What this equates to is:

- **Rendering into external Android surfaces of arbitrary size.**The native app supplies the surface and its dimensions, and Unreal Engine renders into it and follows it as it resizes. The surface size is decided by the Android UI, not by Unreal Engine.

- **Reuse of Unreal Engine resources.**There is only ever one engine instance — one loaded world, one set of assets, one GPU / CPU budget — regardless of how many surfaces or apps attach to it. Content isn’t loaded or rendered redundantly per consumer.

- **Shared content across different Android applications.**Because every client binds to the same shared engine instance, several separate Android apps can attach their own surfaces. This allows them to present the same live Unreal Engine content — a common OEM pattern where the same 3D scene, such as a vehicle model or a shared visualization, appears across multiple applications instead of being duplicated in each.

Beyond this scope, ASIS also supports multiple simultaneous views from the one engine — a “main” view plus additional “extra” views — where each view is driven by its own client source. Client sources can be a camera, player controller, or game instance viewport, with each of these optionally rendered at its own frame rate. Multi-view is a capability built on top of the external surface model.

It’s important to consider what problem ASIS is most useful to solve when choosing to utilize it. It’s also useful to know when you shouldn’t use ASIS. For example, you wouldn’t want to use ASIS when a standard full screen Unreal Android app is enough. The service / external surface model adds additional setup and moving parts you wouldn’t otherwise need in this case.

## ASIS Concepts

Below are the essential concepts of how ASIS operates.

|  |  |
| --- | --- |
| **Concept** | **Description** |
| **Single Instance Service** | The packaged Unreal APK exposes an Android bound / foreground Service (`com.epicgames.asis.UnrealSharedInstanceService`). A separate client Android app binds to that service and drives it. Only one engine instance runs, regardless of how many client surfaces are attached. |
| **Main View Versus Extra Views** | The engine renders a primary (“main”) view plus zero or more extra views. Each extra view is bound to an Android Surface supplied by the client and is associated in the engine with a client source, such as a camera, player controller, or game instance viewport. |
| **Client ID / Attach ID** | The client identifies each surface with a Client ID (an int32 that you choose). Internally, the engine pairs the surface (`AttachId`) with a registered client source that shares the same client ID. The surface and the client source can arrive in either order, the view is created once both are present. |
| **Helper Libraries** | Two AARs (Android Archives) are generated alongside the APK: `asiscommon ` shared message types) and `asisclientlib `(client-side connection API). Your client app links against these to talk to the service. |

The service runs as a foreground service of type `mediaPlayback`. It requires the corresponding runtime permissions, which are automatically added by the plugin. See Packaging and Running an ASIS Project (-> packaging-and-running-an-asis-project-with-unreal-engine) for more information.

### ASIS System Architecture

One Unreal APK hosts a single engine instance behind a bound foreground service. A separate client APK binds to it over an Android Messenger channel and drives one or more Android surfaces, whereby the engine renders a view into each.

On Unreal Engine’s side, every extra view is paired with a **client source**, such as a camera, player controller, or game instance viewport) that shares the same **client ID** as the surface.

## About the ASIS Plugin and Toolchain

Here are few things you’ll need to get you started using ASIS with your project:

- **ASIS requires a source build of Unreal Engine 5.8 or later.**The plugin modifies the engine’s Android platform code base (engine Android runtime and Java GameActivity-level integration. For licensees, you can access the source code through Perforce with your credentials, or for non-licensees, you can access source code through the Epic Games GitHub repository.
- Additionally, the plugin itself is located here, which is only present in a source build: `Engine\Restricted\LimitedAccess\Plugins\HMI`.
- For information on this procedure, see Building Unreal Engine from Source.

- **Setup the Android SDK / NDK / JDK**Setup the Android toolchain using these guides:Automated Android SDK, NDK, and JDK Setup (-> automated-android-sdk-ndk-and-jdk-setup-in-unreal-engine) (recommended)
- Manual Android SDK Setup with Android Studio (-> manual-android-sdk-setup-with-android-studio-for-unreal-engine)

For additional information and steps, see Setting Up an ASIS Project (-> setting-up-an-asis-project-in-unreal-engine).

## PLUGIN PROJECT SETTINGS

In **Edit > Project Settings > Plugins > Android Single Instance Service**, enable:

| Setting | Config Key | Purpose |
| --- | --- | --- |
| **Use AndroidSingleInstanceService** | `bEnableASISPlugin` | Master switch. Turns on the service, manifest patching, and permissions in packaged builds and quick launch. |
| **Compile ASISProject** | `bCompileASISProject` | Also builds the standalone example client (`ExampleUseCase_{Project}`) during packaging. |
| **Enable asis libs generation** | `bEnableAsisLibGeneration` | Emits the `asiscommon` / `asisclientlib` AARs (and source JARs) that clients link against. |

These project settings map to `UAndroidSingleInstanceServiceRuntimeSettings` and are written to **DefaultEngine.ini.**

 Config

```
[/Script/AndroidSingleInstanceServiceEditor.AndroidSingleInstanceServiceRuntimeSettings]
bEnableASISPlugin=True
bCompileASISProject=True
bEnableAsisLibGeneration=True
```

[/Script/AndroidSingleInstanceServiceEditor.AndroidSingleInstanceServiceRuntimeSettings]
bEnableASISPlugin=True
bCompileASISProject=True
bEnableAsisLibGeneration=True

- automotive
- android
- hmi

On this page

- What Purpose Does ASIS Serve? (-> android-single-instance-service-overview-for-unreal-engine)
- ASIS Concepts (-> android-single-instance-service-overview-for-unreal-engine)
- ASIS System Architecture (-> android-single-instance-service-overview-for-unreal-engine)
- About the ASIS Plugin and Toolchain (-> android-single-instance-service-overview-for-unreal-engine)
- PLUGIN PROJECT SETTINGS (-> android-single-instance-service-overview-for-unreal-engine)

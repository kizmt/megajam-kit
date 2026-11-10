# Using the ASIS Client Library

https://dev.epicgames.com/documentation/en-us/unreal-engine/using-the-asis-client-library-in-unreal-engine?application_version=5.9

> Information on how the ASIS client library functions and can be used in your ASIS-enabled projects.

The **Client **is a separate Android app that binds to the packaged Unreal service and drives the views. It links against the two generated AARs (`asiscommon` and `asisclientlib`) and uses the `com.epicgames.asis.asisclientlib` API. The example client is the reference implementation, and you can find it in the `{Project_Name}\Binaries\Android\ExampleUseCase_{Project_Name}\` folder.

## Add the Libraries

The client app depends on the generated AARs from `{Project_Name}\Binaries\Android\`:

 Java

```
dependencies {
    implementation files('libs/asiscommon-<ver>.aar')
    implementation files('libs/asisclientlib-<ver>.aar')
}
```

dependencies {
 implementation files('libs/asiscommon-<ver>.aar')
 implementation files('libs/asisclientlib-<ver>.aar')
}

The example client’s Gradle scripts already reference `:asiscommon` and `:asisclientlib` and rebuilt them on `assembleDebug`.

### Create the Connection

An ASISConnection is created with `ConnectionBuilder` and represents the bound link to the service. The service package name is provided at package time as `BuildConfig.ASISPackageName`.

 Java

```
mServiceConnection = new ASISConnection.ConnectionBuilder(this)
        .withServicePackageName(BuildConfig.ASISPackageName)
        .withServiceClassName("com.epicgames.asis.UnrealSharedInstanceService")
        .withConnectionId("mainActivity")
        .withConnectionListener(this)
        .withEngineMessageListener(this)
        .withOverridePropagateAlpha(true)
        .build();
```

mServiceConnection = new ASISConnection.ConnectionBuilder(this)
 .withServicePackageName(BuildConfig.ASISPackageName)
 .withServiceClassName("com.epicgames.asis.UnrealSharedInstanceService")
 .withConnectionId("mainActivity")
 .withConnectionListener(this)
 .withEngineMessageListener(this)
 .withOverridePropagateAlpha(true)
 .build();

 Below is an example of how you would implement the two listener interfaces:

 Java

```
// ASISConnection.ASISConnectionCallBacks
@Override public void onConnectionSuccess()
   { /* safe to attach views now */ }
@Override public void onServiceDisconnected()
 { /* the service went away */ }
// ASISConnection.EngineMessagesListener
@Override public void onEngineMessage(Message message)
 { /* messages forwarded from the engine */ }
```

// ASISConnection.ASISConnectionCallBacks
@Override public void onConnectionSuccess()
 { /* safe to attach views now */ }
@Override public void onServiceDisconnected()
 { /* the service went away */ }
// ASISConnection.EngineMessagesListener
@Override public void onEngineMessage(Message message)
 { /* messages forwarded from the engine */ }

Bind and unbind with the Activity lifecycle using this:

 Java

```
@Override protected void onStart()
{
    super.onStart();
    ServiceConnection.bindToUnrealInstanceService();
}

@Override protected void onStop()
{
    mServiceConnection.unbindToUnrealInstanceService();
    super.onStop();
```

### Attach Views

Rather than managing surfaces directly, wrap each Android SurfaceView / TextureView in an `ASISMainViewClient` (the primary view) or `ASISExtraViewClient` (an extra view, identified by a client ID). Both implement the ASISView interface and are created with a builder.

 Java

```
// The main view — backed by a SurfaceView here.
ASISView mainView = new ASISMainViewClient.Builder(mServiceConnection, mSurfaceView)
        .withTransparency(true)
        .withTouchSupport()
        .build();

// An extra view with client ID 1 — backed by a TextureView, half-rate.
ASISView extraView1 = new ASISExtraViewClient.Builder(
            mServiceConnection, mTextureView) mTextureView1), /*clientId=*/1)
        .withTransparency(true)
```

The **Client ID** on each `ASISExtraViewClient` must match the ID the engine uses when it registers the view’s source: `RegisterCameraForAsis` / `RegisterPlayerControllerForAsis` / `RegisterGameForAsis`.

### The ASISView Interface

Once built, drive each view through `ASISView`:

| Method | Purpose |
| --- | --- |
| `activateView()` | Attach the view's surface to the service and start rendering into it. |
| `deActivateView()` | Detach the surface; stops rendering that view. |
| `changeRenderInterval(int)` | Change the frame-skip interval for this view at runtime (extra views). |
| `setClientId(int)` | Reassign the client ID (extra views). |
| `forceResurface()` | Force the underlying surface to be destroyed and recreated (useful for SurfaceView after visibility changes). |
| `reInitView(View)` | Rebind to a new / replaced Android View. |
| `doCleanup()` | Release resources for the view. |
| `getBaseView()` | Access the underlying ViewResource. |

### Sending Data and Commands to the Engine

The connection can push data / commands and forward input directly. Below is an example of this.

 Java

```
mServiceConnection.sendData("color", someColorObject);
mServiceConnection.consoleCommand("stat fps");
mServiceConnection.sendTouchEvent(motionEvent, attachId);
```

mServiceConnection.sendData("color", someColorObject);
mServiceConnection.consoleCommand("stat fps");
mServiceConnection.sendTouchEvent(motionEvent, attachId);

### Lower-level Connection API

This is optional.

If you are not using the `ASISMainViewClient` / `ASISExtraViewClient` wrappers, you can drive surfaces directly on `ASISConnection`. The high-level view clients call these for you and manage the Surface lifecycle. You should prefer their usage unless you need direct control.

| Method | Purpose |
| --- | --- |
| `attachSurfaceToService(Surface)` -> `attachId` | Attach the main surface. |
| `attachExtraView(int clientId, Surface, int renderInterval)` -> `attachId` | Attach an extra view surface. |
| `detachView(int attachId)` / `detachSurfaceFromService(int attachId, Callback)` | Detach a view / surface. |
| `setRenderInterval(int attachId, int)` | Change render interval by attach ID. |
| `sendResizeSurface(int attachId, int width, int height)` | Notify the engine a surface resized. |

## The Attach Sequence

A view exists only when both halves for a client ID are present: the Android surface (attached from the client) and a registered client source (registered on the engine). They may arrive in either order — whichever comes second triggers view creation.

The engine holds an early surface as a pending window until the source registers (and vice versa).

## Frame-rate Control (Render Interval)

The render interval applies exclusively to extra views.

The main view always renders every engine tick and is not affected by these settings.

Extra views can render at a fraction of the main-loop rate to save GPU time, using a **render interval N**. This draws one frame every N engine ticks. You can set it to one of the following:

- **1** draws every tick (default).
- **2** every other tick.
- **N** ever Nth tick.

In the engine, you can set it like this:

 Java

```
UAndroidSingleInstanceServiceBPLibrary::SetRenderInterval(/*ClientId=*/2, /*RenderInterval=*/3);
```

UAndroidSingleInstanceServiceBPLibrary::SetRenderInterval(/*ClientId=*/2, /*RenderInterval=*/3);

Also, render interval can be changed from the Client app like this:

 Java

```
mView.changeRenderInterval(/*RenderInterval=*/3)
```

mView.changeRenderInterval(/*RenderInterval=*/3)

- automotive
- android
- hmi
- asis

On this page

- Add the Libraries (-> using-the-asis-client-library-in-unreal-engine)
- Create the Connection (-> using-the-asis-client-library-in-unreal-engine)
- Attach Views (-> using-the-asis-client-library-in-unreal-engine)
- The ASISView Interface (-> using-the-asis-client-library-in-unreal-engine)
- Sending Data and Commands to the Engine (-> using-the-asis-client-library-in-unreal-engine)
- Lower-level Connection API (-> using-the-asis-client-library-in-unreal-engine)
- The Attach Sequence (-> using-the-asis-client-library-in-unreal-engine)
- Frame-rate Control (Render Interval) (-> using-the-asis-client-library-in-unreal-engine)

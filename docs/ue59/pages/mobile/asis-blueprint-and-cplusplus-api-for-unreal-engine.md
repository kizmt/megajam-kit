# ASIS Blueprint and C++ API

https://dev.epicgames.com/documentation/en-us/unreal-engine/asis-blueprint-and-cplusplus-api-for-unreal-engine?application_version=5.9

> Information regarding the ASIS Blueprint and C++ API for a list of useful functions and static members.

Below is a listing of functions and static members of `UAndroidSingleInstanceServiceBPLibrary` (category **AndroidSingleInstanceService**) that are callable from Blueprint and C++.

## Events

Below are the available Event functions you can use:

| Function | Description |
| --- | --- |
| `SendAndroidEvent(int32 EventId, FString Param1, int32 Param2, int32 Param3, float Param4)` | Send an event from the engine to the Android side. |
| `RegisterAndroidEventReceivedDelegate(FOnAndroidEventReceived)` | Register to receive events from Java. Delegate signature: (int32 EventId, FString Param1, int32 Param2, int32 Param3, float Param4). |
| `UnregisterAndroidEventReceivedDelegate(FOnAndroidEventReceived)` | Unregister. |

## Typed Data Receivers

For each scalar type and its array form, there is a register / unregister pair. Delegate signature is (`int32 DataId, FString Key, <T> Data`):

| Type | Register (scalar / array) |
| --- | --- |
| `String` | RegisterAndroidDataReceivedStringDelegate / ...StringArrayDelegate |
| `Boolean` | RegisterAndroidDataReceivedBooleanDelegate / ...BooleanArrayDelegate |
| `Byte` | RegisterAndroidDataReceivedByteDelegate / ...ByteArrayDelegate |
| `Int` | RegisterAndroidDataReceivedIntDelegate / ...IntArrayDelegate |
| `Short` | RegisterAndroidDataReceivedShortDelegate / ...ShortArrayDelegate |
| `Long` | RegisterAndroidDataReceivedLongDelegate / ...LongArrayDelegate |
| `Float` | RegisterAndroidDataReceivedFloatDelegate / ...FloatArrayDelegate |
| `Double` | RegisterAndroidDataReceivedDoubleDelegate / ...DoubleArrayDelegate |

## Extra-View Registration

Below are the available Extra-View Registration functions you can use:

| Function | Description |
| --- | --- |
| `RegisterCameraForAsis(UCameraComponent* Camera, int32 CameraId)` | Register a camera as the client source for the extra view with this client ID. |
| `RegisterPlayerControllerForAsis(APlayerController* PlayerController, int32 ClientId)` | Register a player controller; the view renders through the PC's camera manager. |
| `RegisterGameForAsis(UGameInstance* GameInstance, int32 ClientId)` | Register the game instance's viewport client as the source. |
| `SetRenderInterval(int32 ClientId, int32 RenderInterval)` | Set how often this view draws (see section 10). |

- automotive
- android
- hmi
- asis

On this page

- Events (-> asis-blueprint-and-cplusplus-api-for-unreal-engine)
- Typed Data Receivers (-> asis-blueprint-and-cplusplus-api-for-unreal-engine)
- Extra-View Registration (-> asis-blueprint-and-cplusplus-api-for-unreal-engine)

# Android Multi-View

https://dev.epicgames.com/documentation/en-us/unreal-engine/android-multiview-in-unreal-engine?application_version=5.9

> Setup guide for Android Multi-View

## Setup Android for Unreal Engine

To successfully package ASIS (Android Single Instance Service), you will need to setup Android SDK and NDK. Unreal Engine (UE) uses Android Studio and the Android SDK Command-Line Tools to download and install the Android SDK components required to develop Android projects. Follow the following documentation:

- [image: Setting Up Android SDK and NDK] Setting Up Android SDK and NDKInstall Android Studio and automatically add SDK components. (-> set-up-android-sdk-ndk-and-android-studio-using-turnkey-for-unreal-engine)

If you are using Unreal Engine 5.5.x, enable the following SDK Platforms and Tools:

[image: enable sdk platform and tools options]

[image: enable settings]

[image: enable settings]

## Create project from template

With Android SDK/NDK installed, we can now setup the ASIS template plugin. The plugin is delivered as a separate archive, so manual steps need to be done to prepare UE source code.

## Get UE5.* source code

Pull the latest source code from UE5 Main (Perforce or Github)

Perforce:

- Accessing Unreal Engine with Perforce (-> accessing-unreal-engine-with-perforce)

Github:

- Downloading Unreal Engine Source Code from GitHub (-> downloading-source-code-in-unreal-engine)

## Setup ASIS Plugin

### If using Perforce:

- Navigate to ASIS plugin folder: `UE5_Main\Engine\Restricted\NotForLicensees\Plugins\AndroidSingleInstanceService`
- Inside the `AndroidSingleInstanceService` folder, open the `Templates` folder: `UE5_Main/Engine\Restricted\NotForLicensees\Plugins\AndroidSingleInstanceService\Templates\`

### If using Github:

Unzip Archive provided by Epic and copy ASIS plugin contents to: `Engine\Restricted\NotForLicensees\Plugins\AndroidSingleInstanceService`

### Copy the Template

Copy the **TP_HMI_ASIS** folder to the **UE5/Templates/**

Next copy the following code to the **UE5_Main/Templates/TemplateCategories.ini**

 C++

```
Categories=(Key="HMI", LocalizedDisplayNames=((Language="en",Text="Automotive\nHMI &\nVehicle Cockpit using Android Single Instance Service")), LocalizedDescriptions=((Language="en",Text="Find templates for automotive vehicle cockpit using Android Single Instance Service"), Icon="TP_HMI_ASIS/Media/AutomotiveHMI_2x.png", IsMajorCategory=true)
```

Categories=(Key="HMI", LocalizedDisplayNames=((Language="en",Text="Automotive\nHMI &\nVehicle Cockpit using Android Single Instance Service")), LocalizedDescriptions=((Language="en",Text="Find templates for automotive vehicle cockpit using Android Single Instance Service"), Icon="TP_HMI_ASIS/Media/AutomotiveHMI_2x.png", IsMajorCategory=true)

Run UnrealEditor. Now we should see the new HMI template when we open the Unreal Engine Project browser:

## Create Project from HMI template

The project should look like this:

## Add ASIS plugin to existing Project

If you have an existing project you need to add ASIS to, do the following:

- Enable ASIS in the Plugin Settings
- Add remap plugin directory. Add next code to the {ProjectName}/Config/DefaultGame.ini C++ ```
[Staging]
+RemapDirectories=(From="Engine/Restricted/NotForLicensees/Plugins/AndroidSingleInstanceService", To="Engine/Plugins/Runtime/AndroidSingleInstanceService")
+RemapDirectories=(From="Engine/Restricted/NotForLicensees/Plugins/Experimental/MultiWindow", To="Engine/Plugins/Experimental/MultiWindow")
``` [Staging] +RemapDirectories=(From="Engine/Restricted/NotForLicensees/Plugins/AndroidSingleInstanceService", To="Engine/Plugins/Runtime/AndroidSingleInstanceService") +RemapDirectories=(From="Engine/Restricted/NotForLicensees/Plugins/Experimental/MultiWindow", To="Engine/Plugins/Experimental/MultiWindow")
- Open your project and enable the following ASIS plugin settings

### Package and run ASIS example

With Android SDK/NDK and the Template setup in Unreal engine, we can now package the project as Android application:

## App Communication

With the app packaged from Unreal Engine, we will use an example client app to communicate with the Unreal Engine APK

The Unreal Engine Package will have 3 artifacts.

- APK with Android Service. It is located in the folder that was chosen while project package dialog.
- ASIS helper libraries that are used in the client applications. C++ ```
Binaries/Android/aars
├── asisclientlib-1.0.1-debug.aar
├── asisclientlib-1.0.1-debug.jar
├── asiscommon-1.0.1-debug.aar
``` Binaries/Android/aars ├── asisclientlib-1.0.1-debug.aar ├── asisclientlib-1.0.1-debug.jar ├── asiscommon-1.0.1-debug.aar
- Example of client application that communicates with Service. This is NOT located in the packaged unreal project instead in the Binaries folder of your Unreal Engine Project. The location is **\Unreal Projects\*Project_Name*\Binaries\Android **

You can use Android Studio to open the Android project. It will automatically go through the android build process once you open it.

Or you could use command line.

cmd could be using to generate client apk

 C++

```
cd {Project_Name}\Binaries\Android\ExampleUseCase_{Project_Name}\
gradlew assembleDebug
```

cd {Project_Name}\Binaries\Android\ExampleUseCase_{Project_Name}\
gradlew assembleDebug

The apk will be generated in:

`{Project_Name}\Binaries\Android\ExampleUseCase_{Project_Name}\app\build\outputs\apk\debug\app-debug.apk`

Back in Android Studio and with an Android device selected, you can run the app with** Shift**+**F10** or select the green Play button at the top menu

### After installation Service

Now run install the Unreal Engine apk run applications to your device. You can use cmd line in the Unreal Engine package folder and run adb

In the Android App, select Activate View1, View2, and View3 to view the Android Service communicating with the Unreal Engine application

### Enable Multiview

Multiview works from version UE 5.6. Enabling Multiview requires AndroidSingleInstanceService Plugin. Go through the previous steps to enable ASIS then you can start here.

**Enable** the **Multiview** plugin in the plugin settings.

Create two cameras in the level to test Multiview. The TP_HMI_Automotive will be used for this example.

Next, open the Level Blueprint. Add the Camera Actors to the Blueprints. Drag off the Camera Actor node and Select ‘Get Camera View’. Then Delete the Get Camera Node, we just need the Camera Component Object Reference.

Then create `Register Camera for Asis`. Connect the camera object node to the respective nodes. Make sure to set the Camera Id to 1 and 2 for each camera. Connect the execution pins to **Event Begin Play.**

Package the project for Android.

Now we will open the client app in Android Studio. Open the example client Android application project. This is NOT located in the packaged unreal project instead in the Binaries folder of your Unreal Engine Project. The location for the course code for client app is:

`{Project_Name}\Binaries\Android\ExampleUseCase_{Project_Name}\`

Next, switch from standard ASIS to MultiviewEdit.

Edit `Binaries\Android\ExampleUseCase_{Project_Name}\app\src\main\AndroidManifest.xml `Change game activity to **ActivityForMultiView** line 22.

In Android Studio and with an Android device connected, you can run the app with Shift+F10 or select the green Play button at the top menu.

After installation Service

Now run install the Unreal Engine apk run applications to your device. You can use cmd line in the Unreal Engine package folder and run adb.

Select the Attach/Detach View1 and Attach/Detach View2 to view the cameras. You now have ASIS with multiview working on Android.

### Architecture Overview

 Supported approaches

### Interface Description

Class `ASISConnection`

This class allows establishing a connection and communicating with an ASIS service. It encapsulates the complexities of this communication and provides an easy to use interface for sending and receiving data and commands.

`ASISConnection.ASISConnectionCallBacks` interface defines callbacks for ASISConnection events. Implement this interface when you want to handle connection success events.

 Java

```
public interface ASISConnectionCallBacks
{
void onConnectionSuccess();
void onServiceDisconnected();
}
```

public interface ASISConnectionCallBacks
{
void onConnectionSuccess();
void onServiceDisconnected();
}

`onConnectionSuccess()` - is called when connection to the service was successfully established.

`onServiceDisconnected() `- is called when a connection to the Service has been lost

`ASISConnection.EngineMessagesListener` interface defines a listener for engine messages. Implement this interface when you want to handle messages from the engine.

 Java

```
public interface EngineMessagesListener
{
void onEngineMessage(Message message);
}
```

public interface EngineMessagesListener
{
void onEngineMessage(Message message);
}

`onEngineMessage(Message message)` - called when a message is received from the engine.

`Message` - values of the incoming message

Class `ASISConnection.ConnectionBuilder `

This class implements the builder design pattern to create instances of `ASISConnection`. It follows a fluent style where methods can be chained, allowing for more readability when multiple parameters are required.

 Java

```
ConnectionBuilder(Context ctx)
```

ConnectionBuilder(Context ctx)

Initializes a new instance of the `ConnectionBuilder` class using the given Context.

Parameters

- `ctx` - The Context in which to create the ConnectionBuilder.

 Java

```
public ConnectionBuilder withConnectionListener(ASISConnectionCallBacks connectionListener)
```

public ConnectionBuilder withConnectionListener(ASISConnectionCallBacks connectionListener)

Sets the ASISConnectionCallBacks listener for the ASISConnection.

Parameters

- `connectionListener` - The ASISConnectionCallBacks listener to set.

Returns

- The ConnectionBuilder instance, allowing for method chaining.

 Java

```
public ConnectionBuilder withEngineMessageListener(EngineMessagesListener engineMessageListener)
```

public ConnectionBuilder withEngineMessageListener(EngineMessagesListener engineMessageListener)

Sets the EngineMessagesListener for the ASISConnection.

Parameters

- `engineMessageListener` - The EngineMessagesListener listener to set.

Returns

- The ConnectionBuilder instance, allowing for method chaining.

 Java

```
public ConnectionBuilder withConnectionId(String connectionID)
```

public ConnectionBuilder withConnectionId(String connectionID)

Sets the connectionID for the ASISConnection.

Parameters

- `connectionID` - string with connectioID

Returns

- The ConnectionBuilder instance, allowing for method chaining.

 Java

```
public ConnectionBuilder withServicePackageName(String packageName)
```

public ConnectionBuilder withServicePackageName(String packageName)

Override default service package name

Parameters

- `packageName` - service package name (com.epicgames.PROJECTNAME)

Returns

- The ConnectionBuilder instance, allowing for method chaining.

 Java

```
public ConnectionBuilder withServiceClassName(String className)
```

public ConnectionBuilder withServiceClassName(String className)

Override default service class name

Parameters

- `className` - service class name (com.epicgames.makeaar.UnrealSharedInstanceService)

Returns

- The ConnectionBuilder instance, allowing for method chaining.

 Java

```
public ConnectionBuilder withObbModuleName(String obbModuleName)
```

public ConnectionBuilder withObbModuleName(String obbModuleName)

Override default obbModuleName

Parameters

- obbModuleName - content obb name (UE project name)

Returns

- The ConnectionBuilder instance, allowing for method chaining.

 C++

```
public ConnectionBuilder withInsightsTracing()
```

public ConnectionBuilder withInsightsTracing()

Enable InsightsTracing

Returns

- The ConnectionBuilder instance, allowing for method chaining.

 Java

```
public ConnectionBuilder withCommandLineArgs(String cmdArgs)
```

public ConnectionBuilder withCommandLineArgs(String cmdArgs)

Override default command line args

Parameters

- cmdArgs - command line arguments to start UE

Returns

- The ConnectionBuilder instance, allowing for method chaining.

 Java

```
public ConnectionBuilder withOverridePropagateAlpha(boolean value)
```

public ConnectionBuilder withOverridePropagateAlpha(boolean value)

Override default mobile propagate alpha value

Parameters

- `value` - override mobile propagate alpha value

Returns

- The ConnectionBuilder instance, allowing for method chaining.

 Java

```
public ASISConnection build()
```

public ASISConnection build()

Builds an ASISConnection instance using the parameters that have been set.

Returns

- A new ASISConnection instance.

Example:

 Java

```
public class UseServiceActivity extends Activity
     implements ASISConnection.ASISConnectionCallBacks,
   ASISConnection.EngineMessagesListener
....
ASISConnection mServiceConnection ;
...

mServiceConnection = new ASISConnection.ConnectionBuilder(this)					.withServicePackageName("com.epicgames.UE_PROJECT")
		.withObbModuleName("UE_PROJECT")
		.withConnectionListener(this)
```

 Java

```
ASISConnection(ConnectionBuilder builder)
```

ASISConnection(ConnectionBuilder builder)

Constructor that takes a `ConnectionBuilder` as an argument.ConnectionBuilder

This constructor is typically used through the `ConnectionBuilder`'s `build()` method.

 Java

```
public boolean bindToUnrealInstanceService()
```

public boolean bindToUnrealInstanceService()

Binds to an unreal android single instance service by the given caller.

Returns

- `true `if binding was successful, false otherwise.

 Java

```
public void unbindToUnrealInstanceService()
```

public void unbindToUnrealInstanceService()

Unbinds from the Unreal instance service.

 Java

```
public boolean isBoundToService()
```

public boolean isBoundToService()

Checks whether the application is currently bound to the service.

Returns

- This method returns true if the application is bound to the service.

 Java

```
public int attachSurfaceToService(int displayIndex, Surface externalSurface)
```

public int attachSurfaceToService(int displayIndex, Surface externalSurface)

Attach an external surface to the service for rendering.

Parameters:

- displayIndex: the index of the display, 0 for single display.
- externalSurface: the Surface to attach.

Returns:

- the ID of the attached Surface.

 Java

```
public boolean detachSurfaceFromService(int attachId, Handler.Callback callback)
```

public boolean detachSurfaceFromService(int attachId, Handler.Callback callback)

Detaches a Surface from the service by attaching ID.

Parameters:

- attachId: the ID of the attachment to detach the Surface.
- callback: a callback that will be called when detachment is complete.

Returns

- true if detachment was initiated successfully, false otherwise.

 Java

```
public boolean sendData(String key, Object value)
```

public boolean sendData(String key, Object value)

This method allows you to send key-value data to the ASIS Service.

Parameters

- key: A String that represents the key for the data being sent.
- value: The piece of data to be sent.

Returns

- This method returns a boolean that indicates whether the data was sent successfully.

 Java

```
public boolean consoleCommand(String consoleCommand)
```

public boolean consoleCommand(String consoleCommand)

Sends a console command to the connected service.

Parameters

- consoleCommand: A String with a console command.

Returns

- Returns true if the message was sent successfully.

 Java

```
public boolean sendTouchEvent(MotionEvent event, int attachId)
```

public boolean sendTouchEvent(MotionEvent event, int attachId)

Forward touch event to the service from attached surfaces.

Parameters

- event: Android MotionEvent representing the touch event.
- attachId the ID associated with the surface.

Returns

- Returns true if the touch event was sent successfully, false otherwise.

### Android application integration

Import ASIS java libraries to your project.

- Copy generated libraries from {Project_Name}\Binaries\Android\aars to your app space (e.g libs)

 C++

```
{Android_app}/libs
├── asisclientlib-1.0.1-debug.aar
├── asisclientlib-1.0.1-debug.jar
├── asiscommon-1.0.1-debug.aar
└── asiscommon-1.0.1-debug.jar
```

{Android_app}/libs
├── asisclientlib-1.0.1-debug.aar
├── asisclientlib-1.0.1-debug.jar
├── asiscommon-1.0.1-debug.aar
└── asiscommon-1.0.1-debug.jar

- Add import to the lig via build.gradle

 Java

```
android {
 	...
	repositories {
		flatDir { dirs 'libs' }
	}
...
}

def asiscommonVersion = "1.0.1"
def asisclientlibVersion = "1.0.1"
```

The application activity lifecycle sequence diagram:

On this page

- Setup Android for Unreal Engine (-> android-multiview-in-unreal-engine)
- Create project from template (-> android-multiview-in-unreal-engine)
- Get UE5.* source code (-> android-multiview-in-unreal-engine)
- Setup ASIS Plugin (-> android-multiview-in-unreal-engine)
- If using Perforce: (-> android-multiview-in-unreal-engine)
- If using Github: (-> android-multiview-in-unreal-engine)
- Copy the Template (-> android-multiview-in-unreal-engine)
- Create Project from HMI template (-> android-multiview-in-unreal-engine)
- Add ASIS plugin to existing Project (-> android-multiview-in-unreal-engine)
- Package and run ASIS example (-> android-multiview-in-unreal-engine)
- App Communication (-> android-multiview-in-unreal-engine)
- After installation Service (-> android-multiview-in-unreal-engine)
- Enable Multiview (-> android-multiview-in-unreal-engine)
- Architecture Overview (-> android-multiview-in-unreal-engine)
- Interface Description (-> android-multiview-in-unreal-engine)
- Android application integration (-> android-multiview-in-unreal-engine)

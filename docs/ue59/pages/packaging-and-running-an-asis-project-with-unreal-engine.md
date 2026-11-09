# Packaging and Running an ASIS Project

https://dev.epicgames.com/documentation/en-us/unreal-engine/packaging-and-running-an-asis-project-with-unreal-engine?application_version=5.9

> Information to help you package and run your ASIS project on an android device.

Once you’ve got your Android Single Instance Service (ASIS) project setup, you’ll want to package its contents.

## Package the Project

To package your project and run it on device, use the main menu to select **Platforms > Package Project > Android** and select your target.

For more information on the packaging process for Android, see Packaging Android Projects (-> packaging-android-projects-in-unreal-engine).

## Package Contents

Once the project packages successfully, it produces the following items:

- **Unreal APK**
- **ASIS helper AARs**

The Unreal APK hosts UnrealSharedInstanceService, and the ASIS helper AARs — when **Enable asis libs generation** is checked in the project settings — are generated in the `Binaries/Android/aars` folder.

The following files are generated:

- asisclientlib-1.0.1-debug.aar
- asisclientlib-1.0.1-debug.jar
- asiscommon-1.0.1-debug.aar
- asiscommon-1.0.1-debug.jar

The example client app — when **Compile ASISProject** is checked in the project settings — is located under your `{Project}\Binaries\Android\ExampleUseCase_{Project}\` folder.

## Build and Install the Example Client

You can open the Example Client in Android Studio, or build it from the command line using the following command:

 Command Line

```
cd {Project}\Binaries\Android\ExampleUseCase_{Project}\
gradlew assembleDebug
```

cd {Project}\Binaries\Android\ExampleUseCase_{Project}\
gradlew assembleDebug

Output APK:

 Console Output

```
{Project}\Binaries\Android\ExampleUseCase_{Project}\app\build\outputs\apk\debug\app-debug.apk
```

{Project}\Binaries\Android\ExampleUseCase_{Project}\app\build\outputs\apk\debug\app-debug.apk

Install both APKs on the device:

 Command Line

```
adb install {Project}.apk
adb install app-debug.apk
```

adb install {Project}.apk
adb install app-debug.apk

Now, you can launch the client. Use its controls (such as Activate View1, Activate View2, and so on) to bind surfaces to the running Unreal service. It’ll allow you to see multiple views rendered by the single engine instance that is running.

- automotive
- android
- hmi
- asis

On this page

- Package the Project (-> packaging-and-running-an-asis-project-with-unreal-engine)
- Package Contents (-> packaging-and-running-an-asis-project-with-unreal-engine)
- Build and Install the Example Client (-> packaging-and-running-an-asis-project-with-unreal-engine)

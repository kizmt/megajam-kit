# Remote Windows Deployment

https://dev.epicgames.com/documentation/en-us/unreal-engine/remote-windows-deployment-in-unreal-engine?application_version=5.9

> Use the Remote Iteration tools to test your game on a remote PC or Xbox console.

[image: Remote Windows Deployment]

Remote Windows Deployment supports building, cooking, deploying, and launching game builds on a separate Windows PC (including Windows on ARM64 hardware) directly from the Unreal Editor or from the command line using `RunUAT`. The feature is backed by Microsoft's **Xbox PC Remote Tools** which is currently still in preview.

## Prerequisites

Install the **Xbox PC Toolbox** app on both devices. This will install the latest version of the Remote Iteration tools which should be at least version **0.0.10-preview**.

On your development PC(s), choose “**Set as development device**” in the Xbox PC Toolbox app, and follow the instructions.

On your remote PC(s), choose “**Set as a target device**”. Lightweight mode is sufficient for UE remote deployment.

Once both development and remote PCs are set up, use the Xbox PC Toolbox app to pair the devices.

Please refer to Microsoft’s **Xbox PC Remote Tools** documentation for more detailed instructions.

## Configure Remote Devices in Unreal Engine

Once devices are paired, register them in Unreal Engine by adding their machine names to your user engine configuration file:

File: `%LOCALAPPDATA%\Unreal Engine\Engine\Config\UserEngine.ini`

 Config

```
[RemoteWin]
+DeviceNames=MyARM64Laptop
+DeviceNames=MyOtherTestPC
```

[RemoteWin]
+DeviceNames=MyARM64Laptop
+DeviceNames=MyOtherTestPC

Add one `+DeviceNames=` entry per remote device. After saving the file, registered devices appear in **Project Launcher** and the editor's **Launch On** menu (the device icon in the main toolbar).

## Deploy From the Editor

With a remote device configured, select it from the **Launch On** menu in the editor toolbar. The editor cooks, stages, and deploys the current project to the remote device and launches the game.

For ARM64 hardware, make sure your project is configured for the correct target architecture before using Launch On. You can set the default architecture in **Project Settings** > **Platforms** > **Windows**.

## Deploy Via RunUAT BuildCookRun

To deploy and run on a remote device from the command line, add `-deploy -run -device=DeviceName` to your `BuildCookRun` invocation. The device name must match the entry in `UserEngine.ini`.

### Example: Deploy an x64 build to a remote x64 PC

 Config

```
Engine\Build\BatchFiles\RunUAT.bat BuildCookRun
  -project=MyGame\MyGame.uproject
  -platform=Win64
  -build -cook -stage -pak
  -deploy -run
  -device=MyOtherTestPC
```

Engine\Build\BatchFiles\RunUAT.bat BuildCookRun
 -project=MyGame\MyGame.uproject
 -platform=Win64
 -build -cook -stage -pak
 -deploy -run
 -device=MyOtherTestPC

### Example: Deploy an arm64+x64 build to a remote ARM64 PC

 Config

```
Engine\Build\BatchFiles\RunUAT.bat BuildCookRun
  -project=MyGame\MyGame.uproject
  -platform=Win64
  -clientarchitecture=arm64+x64
  -build -cook -stage -pak
  -deploy -run
  -device=MyARM64Laptop
```

Engine\Build\BatchFiles\RunUAT.bat BuildCookRun
 -project=MyGame\MyGame.uproject
 -platform=Win64
 -clientarchitecture=arm64+x64
 -build -cook -stage -pak
 -deploy -run
 -device=MyARM64Laptop

## Visual Studio Remote Debugging

In order to use remote debugging, you must first install and launch the ******Visual Studio Remote Debugging** tools on the remote device.

Xbox PC Remote Tools are installed, GenerateProjectFiles automatically configures the Windows Remote Debugger for each game target.

You can specify the default remote device to deploy & attach to for each processor architecture using BuildConfiguration.xml.

For example: `%APPDATA%\Unreal Engine\UnrealBuildTool\BuildConfiguration.xml:`

 Config

```
<Configuration>
   <WindowsPlatform>
     <RemoteDebugMachineArm64>MyARM64Laptop</RemoteDebugMachineArm64>
     <RemoteDebugMachineX64>MyOtherTestPC</RemoteDebugMachineX64>
  </WindowsPlatform>
</Configuration>
```

<Configuration>
 <WindowsPlatform>
 <RemoteDebugMachineArm64>MyARM64Laptop</RemoteDebugMachineArm64>
 <RemoteDebugMachineX64>MyOtherTestPC</RemoteDebugMachineX64>
 </WindowsPlatform>
</Configuration>

Once configured, you can then choose the Remote Windows Debugger in Visual Studio and press F5 to deploy and launch on the remote device.

This only deploys the updated executable and dependencies. It will not deploy the game content. The staged build must first be deployed via the editor or `RunUAT`.

By default, the remote debugger is configured with no authentication. If you prefer to have authentication, add the following to BuildConfiguration.xml - it may depend on your IT policies whether this works:

 Config

```
<Configuration>
   <WindowsPlatform>
     <bRemoteDebuggerAuthentication>true</bRemoteDebuggerAuthentication>
  </WindowsPlatform>
</Configuration>
```

<Configuration>
 <WindowsPlatform>
 <bRemoteDebuggerAuthentication>true</bRemoteDebuggerAuthentication>
 </WindowsPlatform>
</Configuration>

## Known Limitations

- Devices must be pre-paired using the Xbox PC Toolbox. UE does not handle device discovery or pairing.
- The device list in `UserEngine.ini` is read on editor startup. Restart the editor after adding new devices.
- Visual Studio remote debugging on ARM64 requires MSVC; Clang builds are not supported on ARM64 targets.

- windows
- xbox
- game development
- game testing
- tooling

On this page

- Prerequisites (-> remote-windows-deployment-in-unreal-engine)
- Configure Remote Devices in Unreal Engine (-> remote-windows-deployment-in-unreal-engine)
- Deploy From the Editor (-> remote-windows-deployment-in-unreal-engine)
- Deploy Via RunUAT BuildCookRun (-> remote-windows-deployment-in-unreal-engine)
- Example: Deploy an x64 build to a remote x64 PC (-> remote-windows-deployment-in-unreal-engine)
- Example: Deploy an arm64+x64 build to a remote ARM64 PC (-> remote-windows-deployment-in-unreal-engine)
- Visual Studio Remote Debugging (-> remote-windows-deployment-in-unreal-engine)
- Known Limitations (-> remote-windows-deployment-in-unreal-engine)

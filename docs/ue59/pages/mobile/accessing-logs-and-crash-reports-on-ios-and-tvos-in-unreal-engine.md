# Accessing Logs and Crash Reports on iOS and tvOS

https://dev.epicgames.com/documentation/en-us/unreal-engine/accessing-logs-and-crash-reports-on-ios-and-tvos-in-unreal-engine?application_version=5.9

> Download and read iOS and tvOS logs and crash reports either directly from device or from TestFlight.

[image: Accessing Logs and Crash Reports on iOS and tvOS]

### Accessing iOS and tvOS Logs and Crash Reports

iOS applications built with Unreal Engine produce crash logs that developers can use to debug their projects and fix code issues. However, for security reasons, the debug symbols are not available with the crash logs themselves. You will see keys and numbers, but to see names of functions or information about variables in a human-readable format, you need to match your logs to a database of symbols for your project.

There are several processes for re-symbolicating your logs and reading them, depending on how you delivered your debug builds to devices. **TestFlight **is Apple's application for delivering test builds to a large number of possible devices, and it provides logs from those builds to developers. You can also obtain logs directly through USB debugging.

You need a Mac and Xcode to read logs for iOS projects. Other operating systems and IDEs will not work with the workflows on this page.

## 1. Accessing Logs Directly from Device

If you are debugging directly through USB or Ethernet, follow these steps to view a symbolicated crash log:

- In Xcode, from the main menu, select **Window** > **Devices and Simulators**.
- Click the iPhone you want to obtain crash data from, then click **View Device Logs**.
- Control-click the log you want to read, then click **Re-Symbolicate and export Log**.

This will provide a human-readable log with debug symbols.

## 2. Accessing Logs from TestFlight

When an application delivered through TestFlight crashes, it produces an **XCrashPoint** file containing crash information. To read these files, you need a `.dSYM` file with debug symbols for your project, then you need to extract the crash report and re-symbolicate it.

For specific information about deploying applications through TestFlight and accessing logs, refer to Apple's documentation on TestFlight. This section will provide information about how to symbolicate them once you have obtained them.

### Generating a .dSYM File During Packaging

To generate a `.dSYM` file when you package your project, follow these steps:

- Open **Unreal Editor**.
- Open your **Project Settings**, then navigate to **Platforms **> **iOS** > **Build**.
- Enable **Generate dSYM file for code debugging and profiling**.[image: Check the Generate dySM file option]
- Package your project.

The `.dSYM` file for your project will appear in your project folder, under `/Binaries/iOS`.

`.dSYM` files have a timestamp showing when they were packaged. Take note of this information so you can match `.dSYM` files to the correct build.

### Generating a .dSYSM File From a Command Line

To generate .dSYM file using UAT, execute the RunUAT script in a command line with the **GenerateDYSM** command. Specify the following parameters:

| Parameter | Optional | Valid Values | Description |
| --- | --- | --- | --- |
| -Platform=[Target Platform] | Yes | IOS, TVOS, Mac | Specifies target platform. Defaults to current platform if unspecified. |
| -Target=[Project Name] | Yes | The name of your project. | Specifies which project you want to use. Defaults to current project if unspecified. |
| -Config=[Build Configuration] | Yes | Debug, DebugGame, Development, Test, Shipping | Target build configuration. Defaults to Development if unspecified. |
| -Architecture=[Architecture Type] | No | x64, arm64, x64+arm64] | Target device architecture. |
| -flat | Yes | Does not take inputs. | If specified, the .dSYMs will be flat files that are easier to copy between computers or servers. |

For example, the following command will generate .dSYM files for iOS devices using the arm64 architecture:

 C++

```
```RunUAT.command GenerateDYSM -project=MyProject -platform=Mac -target=EngineTestEditor -config=Test -architecutre=arm64```
```

```RunUAT.command GenerateDYSM -project=MyProject -platform=Mac -target=EngineTestEditor -config=Test -architecutre=arm64```

### Extracting the Crash Report and Re-Symbolicating

To obtain your crash report and re-symbolicate it so that you can read it, follow these steps:

- Obtain an `XCrashPoint`** **file from TestFlight. You can use the following command line input to do this. C++ ```
export PATH="/Applications/Xcode.app/Contents/SharedFrameworks/DVTFoundation.framework/Versions/A/Resources:$PATH"
``` export PATH="/Applications/Xcode.app/Contents/SharedFrameworks/DVTFoundation.framework/Versions/A/Resources:$PATH"
- Control-click on the `.XCrashPoint` file, then click **Extract `.crash` file**. You can also export this information using the following command line input: C++ ```
export PATH="/Applications/Xcode.app/Contents/SharedFrameworks/DVTFoundation.framework/Versions/A/Resources:$PATH"
``` export PATH="/Applications/Xcode.app/Contents/SharedFrameworks/DVTFoundation.framework/Versions/A/Resources:$PATH"
- Open XCode, then look at the **terminal**. Use it to navigate to your Xcode `.package`.
- Use the symbolicatecrash tool by running the following command line: C++ ```
export DEVELOPER_DIR="/Applications/Xcode.app/Contents/Developer" cp -i /Applications/Xcode.app/Contents/SharedFrameworks/DVTFoundation.framework/Versions/A/Resources/symbolicatecrash ././symbolicatecrash unsymbolicated.crash symbols.dSYM > symbolicated.crash
``` export DEVELOPER_DIR="/Applications/Xcode.app/Contents/Developer" cp -i /Applications/Xcode.app/Contents/SharedFrameworks/DVTFoundation.framework/Versions/A/Resources/symbolicatecrash ././symbolicatecrash unsymbolicated.crash symbols.dSYM > symbolicated.crash

The above instructions use default directories. Use the locations of your `.crash` and `.dSYM` files when you run these command lines.

Xcode will then provide a crash log with function names and variables visible.

- testing
- debugging
- ios
- tvos
- xcode
- testflight
- platform delivery

On this page

- Accessing iOS and tvOS Logs and Crash Reports (-> accessing-logs-and-crash-reports-on-ios-and-tvos-in-unreal-engine)
- 1. Accessing Logs Directly from Device (-> accessing-logs-and-crash-reports-on-ios-and-tvos-in-unreal-engine)
- 2. Accessing Logs from TestFlight (-> accessing-logs-and-crash-reports-on-ios-and-tvos-in-unreal-engine)
- Generating a .dSYM File During Packaging (-> accessing-logs-and-crash-reports-on-ios-and-tvos-in-unreal-engine)
- Generating a .dSYSM File From a Command Line (-> accessing-logs-and-crash-reports-on-ios-and-tvos-in-unreal-engine)
- Extracting the Crash Report and Re-Symbolicating (-> accessing-logs-and-crash-reports-on-ios-and-tvos-in-unreal-engine)

# Debugging iOS Projects With Xcode

https://dev.epicgames.com/documentation/en-us/unreal-engine/debugging-ios-projects-with-xcode-in-unreal-engine?application_version=5.9

> Use Xcode to launch your project on device and debug with break points and LLDB commands.

[image: Debugging iOS Projects With Xcode]

You need a **macOS **device running **Xcode **to launch debugging builds of **Unreal Engine (UE)** applications on iOS, tvOS, and iPadOS devices for testing. However, you need to cook content with the Unreal Editor to fully package and finalize a build. To fulfill these requirements, you need to use a specialized workflow to prepare a build for debugging before you return to Xcode to launch it, rather than packaging and launching all in one step.

This page explains this workflow and the tools UE provides to streamline this process, including a method for launching your debug build without needing to create an editor build first.

## 1. Required Setup

The debugging workflow for iOS requires the following:

- A macOS machine with Xcode installed. Both macOS and Xcode must be up to date with the Development Requirements for iOS.

- A **code signing certificate** and **provisioning profile** for your application. Your build will fail to deploy to your iOS device without these. Refer to iOS Provisioning (-> setting-up-ios-tvos-and-ipados-provisioning-profiles-and-signing-certificates-for-unreal-engine-projects) for more information on this process.

- An Xcode project (`.xcodeproj`) for your application. If you do not already have one, locate your project's `.uproject` file, right-click it, and select **Generate Xcode Project**.

- If you want to skip creating an editor build, you will need cooked data from another computer to inject into your build. This data must be contained in the **Binaries/iOS **or **Binaries/tvOS **folder of your project.

## 2. Workflow Summary

The workflow for debugging on iOS, tvOS, or iPadOS is as follows:

- Cook content for iOS/tvOS. You can do this directly on your macOS machine, or you can use a separate computer.

- Use the **Prepare for Debugging** command to inject cooked data into the Xcode payload (.IPA) created during your build.

- Use Xcode to create a build using your .IPA and launch the build from your macOS machine.

## 3. Cook Content for iOS

While Xcode can create and launch a debugging build, it can't cook content. Therefore, you need to either import cooked content from a separate machine, or build Unreal Editor and use it to cook content on your macOS machine.

### 3A. Import Cooked Content From a Separate Machine

You can skip building Unreal Editor and cooking content if you already have cooked content available for your build. This will most likely be the case if your team has shared build resources (such as a build farm) or hosts the binaries for your project on your source control system. These files should be located in the **Binaries/iOS** or **Binaries/tvOS** folder.

If you need to manually bring cooked files into your project, copy and paste the .IPA file from another machine into your project's Binaries/iOS or Binaries/tvOS folder.

### 3B. Cook Content on Your macOS Machine

To cook your content on your macOS machine, follow these steps:

- Open your project in Unreal Editor. If you are using a source build of Unreal Engine, then you will need to build it from Xcode.

- Use one of the following options from the **Platforms **dropdown: For iOS and iPadOS: **Platforms **> **iOS **> **Cook Content**

- **Platforms **> **iOS **> **Package Project**

- For tvOS: **Platforms **> **tvOS **> **Cook Content**

- **Platforms **> **tvOS** > **Package Project**

You can also use the `RunUAT.command` script to run the `BuildCookRun` command from a command line. The following is an example of a cook-only command:

```
RunUAT.sh BuildCookRun -project=[ProjectName] -platform=iOS -build -cook -stage -pak -package -skipbuild
```

RunUAT.sh BuildCookRun -project=[ProjectName] -platform=iOS -build -cook -stage -pak -package -skipbuild

Refer to Build Operations and Cooking Content (-> build-operations-cooking-packaging-deploying-and-running-projects-in-unreal-engine) for more information.

## 4. Prepare for Debugging

The **Prepare for Debugging** command injects previously-cooked data into your builds from Xcode, producing a .IPA file you can use to launch on your target device from Xcode. This streamlines the debugging pipeline for projects in two ways:

- Prepare for Debugging automatically handles creating a debugging build without needing to reconfigure your Xcode project.

- Projects with only a small number of macs can import cooked data from other machines. This makes it possible to skip building or using Unreal Editor and simply launch a build from Xcode.

To use the Prepare for Debugging command, you can either run it through the **Platforms **dropdown menu in Unreal Editor, or you can run it from the **Turnkey command line** in **Unreal Automation Tool (UAT)**. Both processes are detailed below.

Prepare for Debugging is designed to work with the remote Mac workflow, and is especially helpful for saving time with debugging with a secondary remote Mac. Refer to the Remote Mac Builds (-> creating-remote-builds-of-unreal-engine-projects-for-ios) for more details.

### 4A. Prepare for Debugging Using a Command Line

You can run Prepare for Debugging using the `WrangleContentForDebugging` command in the Turnkey command line, along with the name of the project you want to use. The following is an example of how you should format this command:

```
RunUAT.command Turnkey -command=WrangleContentForDebugging -project=[name of your .uproject file]
```

RunUAT.command Turnkey -command=WrangleContentForDebugging -project=[name of your .uproject file]

### 4B. Prepare for Debugging Using the Platforms Menu

You can run Prepare for Debugging by clicking either of the following options in Unreal Editor:

- **Platforms **> **iOS **> **Prepare for Debugging**

- **Platforms **> **tvOS **> **Prepare for Debugging**

 [image: The Prepare for Debugging option in the toolbar, under Platforms > iOS]

## 5. Launch Your Project in Xcode

- Open your application's Xcode project.

- Change the target device from **My Mac** to your target iOS or tvOS device. [image: Change the target device to your test device]

- Click **Product **> **Perform Action** > **Run**, or use the keyboard shortcut **Command **+ **R**. This will create a build using the .IPA you created with Prepare for Debugging. [image: The Run option in the Product menu]

Once you have completed these steps, the project will build and launch on your device. From here, you can use breakpoints, logs, and LLDB commands to debug your project and examine information at runtime.

## 6. Manually Rebuilding Your Project for Debugging

If you do not have access to the Prepare for Debugging Command, you can manually rebuild your project for debugging from Xcode with the following steps. You must still cook and package your project before using this workflow.

- Open your application's Xcode project. In Xcode, from the main menu, select **Product **> **Scheme **> **Edit Scheme**. [image: The Product > Scheme > Edit Scheme option in the toolbar]

- Click the **Run** category, then change your **Build Configuration** to **DebugGame**. [image: The DebugGame configuration] If you are using a source code build of Unreal Engine, you can use the **Debug** configuration to debug the engine code.

- Change the target device from **My Mac** to the **iPhone** you have connected. [image: Change the target device to your test device]

- Click the **Build and Run** button to start building the project from Xcode and launch it on the device. [image: The Build and Run button]

This achieves the same result as the Prepare for Debugging workflow.

## 7. Xcode's Debugging Tools and LLDB

For more information about how to use Xcode's debugging features, refer to Apple's developer documentation on Debugging With Xcode.

For more information about LLDB, refer to the Getting Started with LLDB page in Apple's documentation archive.

- testing
- debugging
- ios
- xcode
- lldb
- platform delivery

On this page

- 1. Required Setup (-> debugging-ios-projects-with-xcode-in-unreal-engine)
- 2. Workflow Summary (-> debugging-ios-projects-with-xcode-in-unreal-engine)
- 3. Cook Content for iOS (-> debugging-ios-projects-with-xcode-in-unreal-engine)
- 3A. Import Cooked Content From a Separate Machine (-> debugging-ios-projects-with-xcode-in-unreal-engine)
- 3B. Cook Content on Your macOS Machine (-> debugging-ios-projects-with-xcode-in-unreal-engine)
- 4. Prepare for Debugging (-> debugging-ios-projects-with-xcode-in-unreal-engine)
- 4A. Prepare for Debugging Using a Command Line (-> debugging-ios-projects-with-xcode-in-unreal-engine)
- 4B. Prepare for Debugging Using the Platforms Menu (-> debugging-ios-projects-with-xcode-in-unreal-engine)
- 5. Launch Your Project in Xcode (-> debugging-ios-projects-with-xcode-in-unreal-engine)
- 6. Manually Rebuilding Your Project for Debugging (-> debugging-ios-projects-with-xcode-in-unreal-engine)
- 7. Xcode's Debugging Tools and LLDB (-> debugging-ios-projects-with-xcode-in-unreal-engine)

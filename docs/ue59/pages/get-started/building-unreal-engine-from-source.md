# Building Unreal Engine from Source

https://dev.epicgames.com/documentation/en-us/unreal-engine/building-unreal-engine-from-source?application_version=5.9

> Compiling Unreal Engine from source code.

[image: Building Unreal Engine from Source]

###### Prerequisite topics

In order to understand and use the content on this page, make sure you are familiar with the following topics:

- Downloading Unreal Engine Source Code (-> downloading-source-code-in-unreal-engine)
- Installing Unreal Engine (-> installing-unreal-engine)

Operating System

×Windows

Select an option from the dropdown to see content relevant to it.

## Building Unreal Engine from Source

Read about Hardware and Software Specifications (-> hardware-and-software-specifications-for-unreal-engine), and make sure that **Microsoft Visual Studio** is installed prior to building **Unreal Engine (UE)** from source. Also, depending on your system's specifications, it may take between 10 and 40 minutes to compile the Engine.

- Inside the root directory, where you downloaded and adjusted the UE Source Code (-> downloading-source-code-in-unreal-engine) run `GenerateProjectFiles.bat` to set-up your project files. [image: Generate project files] All project files are intermediate (`[UERoot]\Engine\Intermediate\ProjectFiles`). You must generate project files each time you sync a new build to ensure they are up to date. If you delete your `Intermediate` folder, you must regenerate project files using the `GenerateProjectFiles` batch file.
- Load the project into Visual Studio by double-clicking `UE5.sln`.[image: Load the project]
- Set your solution configuration to **Development Editor**.[image: Set solution configuration to Development Editor]
- Set your solution platform to **Win64**.[image: Set solution platform to Win64]
- Right-click the **UE5** target and select **Build**.[image: Build the UE target]

## Running the Editor

- Set your startup project by right-clicking the **UE5** target and selecting **Set as StartUp Project**. [image: Set as Startup Project]
- Right-click the **UE5** project, then select **Debug > Start New Instance** to launch the Editor. [image: Start New Instance]Alternatively, you can **press the F5 key** on your keyboard to start a new instance of the Editor.
- Congratulations! You've compiled and launched the Engine from source.

## Getting Started with Unreal Engine

Learn how to use Unreal Engine by referring to the Understanding the Basics (-> understanding-the-basics-of-unreal-engine) documentation!

If you're looking to quickly get started with UE, refer to the following tutorials:

- Programming Quick Start (-> unreal-engine-cpp-quick-start)
- Level Designer Quick Start (-> level-designer-quick-start-in-unreal-engine)

UE's in-editor help features are a great way to get your questions answered.

- programming
- unreal build system

On this page

- Building Unreal Engine from Source (-> building-unreal-engine-from-source)
- Running the Editor (-> building-unreal-engine-from-source)
- Getting Started with Unreal Engine (-> building-unreal-engine-from-source)

Related documents

Understanding the Basics

 [image: Understanding the Basics] (-> understanding-the-basics-of-unreal-engine)Programming Quick Start

 [image: Programming Quick Start] (-> unreal-engine-cpp-quick-start)Level Designer Quick Start

 [image: Level Designer Quick Start] (-> level-designer-quick-start-in-unreal-engine)Unreal Build Pipeline

 [image: Unreal Build Pipeline] (-> using-the-unreal-engine-build-pipeline)

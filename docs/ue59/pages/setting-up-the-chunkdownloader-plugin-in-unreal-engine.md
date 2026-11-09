# Setting Up the ChunkDownloader Plugin

https://dev.epicgames.com/documentation/en-us/unreal-engine/setting-up-the-chunkdownloader-plugin-in-unreal-engine?application_version=5.9

> How to set up a Project Settings and Plugins for working with ChunkDownloader

[image: Setting Up the ChunkDownloader Plugin]

The **ChunkDownloader** patching system is a built-in plugin for **Unreal Engine** that provides patching functionality. This page shows how to set up **Project Settings** and **Plugins** of your Unreal Engine project for using ChunkDowloader.

This example uses **C++ project** based on **Blank template**. This project has name **PatchingDemo**.

Click image to enlarge.

This example uses **C++ project** based on **Blank template**. The project has name **PatchingDemo**.

## Steps

- Open your **Project Settings**, navigate to **Project > Packaging**, then make sure that **Use Pak File** and **Generate Chunks** are both enabled.

- Open the **Plugins** window and enable the **Chunk Downloader** plugin. Restart the **Unreal Editor** for your changes to take effect.

- Open your project's `[ProjectName]Build.cs` file in **Visual Studio**. This file locates under `[ProjectName]/Source/[ProjectName]`.

- Edit file by adding **ChunkDownloader** to your `ModuleRules` as `PrivateDependencyModuleNames`. For this add the following section to the `ModuleRules` in the file. ```
         PrivateDependencyModuleNames.AddRange(new string[] { "ChunkDownloader" } );

``` PrivateDependencyModuleNames.AddRange(new string[] { "ChunkDownloader" } );

- **Save** your changes to this file.

- Right-click on your **[ProjectName].uproject** file and click **Generate Visual Studio project files**.

- Return to your project's solution in **Visual Studio**, then **Build** the project.

## Final Result

Now, ChunkDownloader is available to use in your project. You can proceed with implementing this in your game's code to download and mount packaging files (see Preparing Assets for Chunking (-> preparing-assets-for-chunking-in-unreal-engine)).

- patching
- chunkdownloader
- platform delivery

On this page

- Steps (-> setting-up-the-chunkdownloader-plugin-in-unreal-engine)
- Final Result (-> setting-up-the-chunkdownloader-plugin-in-unreal-engine)

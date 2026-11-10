# Preparing Assets for Chunking

https://dev.epicgames.com/documentation/en-us/unreal-engine/preparing-assets-for-chunking-in-unreal-engine?application_version=5.9

> How to divide assets into chunks and cook them into packaging files

[image: Preparing Assets for Chunking]

**Unreal Engine (UE)** can deliver assets outside of the main executable of your applications in the form of packaging files. To do this, you need to organize your assets into chunks, groups of asset files that are recognized by the cooking process. This tutorial shows you how to organize assets into chunks in the **Unreal Editor**. When you have finished, you will have a sample project that will produce packaging files you can deliver with a patching system.

## Recommended Assets

For this guide, the following assets are used: **Crunch**, **Boris**, and **Khaimera** from **Paragon**, which you can download from the **Unreal Marketplace** for free. As long as you have assets that you can safely group into separate folders, you do not need to use these specific assets. The **Paragon Character Assets** make a convenient test case since UE already organizes them this way.

## Required Setup

Before proceeding any further, you should review the Setting Up the ChunkDownloader Plugin (-> setting-up-the-chunkdownloader-plugin-in-unreal-engine).

As described in reference quide, you need:

- Create **C++ project** based on a **Blank template**. Name this project **PatchingDemo**.

- Enable **ChunkDownloader** plugin in the **Plugins** menu.

- Enable **Use Pak File** and **Generate Chunks** in **Project Settings > Project > Packaging**.

- Edit your project's `ProjectName]Build.cs` file in **Visual Studio**.

- Generate Visual Studio project files.

- Build your project in Visual Studio.

## Organizing Your Chunking Scheme

Now that you have enabled chunking and set up your plugins, you need to organize your assets and package them into chunks.

For more information about the chunking process, refer to Cooking and Chunking.

- Right-click inside the **ParagonBoris** folder, navigate to **Create Advanced Asset > Miscellaneous**, then create a new **Data Asset**.

- Choose **PrimaryAssetLabel** as the base class for the new Data Asset. You can create subclasses of PrimaryAssetLabel in C++ to add extra metadata. If you create subclasses for PrimaryAssetLabel in Blueprint, they will not work for chunking purposes.

- Name the new Primary Asset Label **Label_Boris**.

- Open **Label_Boris** and fill in the following properties: | Property | Value |
| --- | --- |
| **Chunk ID** | This should be a unique value for each folder. Here we use **1001** for Boris. |
| **Priority** | This should be a value greater than 0. Here we set them all to **1**. |
| **Cook Rule** | Set to **Always Cook**. |
| **Label Assets in My Directory** | Set to **Enabled**. |
| **Is Runtime Label** | Set to **Enable** |

- Repeat steps 1 through 4 for **ParagonCrunch** and **ParagonKhaimera**. In this example we set the **ChunkID** to **1002** for Crunch and **1003** for Khaimera.

- Package or cook content for your project.

## Final Result

If everything is set up correctly, you will see the packaging files in your build directory, under `/Windows/PatchingDemo/Content/Paks`, when UE has finished packaging them. UE will name each of them for the Chunk ID that you designated, and they each will contain the assets for your three characters.

You can also navigate click **Tools > Audit > Asset Audit** to view your chunks in the Asset Audit Window.

You can find more information about Asset Audit in Cooking and Chunking.

- cooking
- chunking
- patching
- platform delivery

On this page

- Recommended Assets (-> preparing-assets-for-chunking-in-unreal-engine)
- Required Setup (-> preparing-assets-for-chunking-in-unreal-engine)
- Organizing Your Chunking Scheme (-> preparing-assets-for-chunking-in-unreal-engine)
- Final Result (-> preparing-assets-for-chunking-in-unreal-engine)

# UGS Quick Start

https://dev.epicgames.com/documentation/en-us/unreal-engine/unreal-game-sync-quick-start-guide?application_version=5.9

> Learn how to get started using UnrealGameSync.

[image: UGS Quick Start]

The goal of this guide is to show you the primary workflow of syncing your **Unreal Project** (`.uproject`) using **UnrealGameSync (UGS)**. After working through this tutorial, you will know how to open an Unreal Project with UGS, and how to sync from the **Project Overview** and **Changelist Areas** of the application's main menu.

**Required Setup:** The following steps assume that your team has distributed and set up UGS on your machine or machines.

## 1 - Opening a Local File

The following steps show you how to open a local Unreal Project file with UGS.

- To open a `.uproject` on your local drive, click the **Open project...** link. [image: Unreal Game Sync start page]

- When the **Open Project** window opens, UGS enables the **Local File** radio button by default. To select a local file, click the **Browse...** button. [image: Open Project window]

- Navigate to and select the `.uproject` file before clicking **Open**. [image: Open File Browser] We are using the Lyra Sample Game (-> lyra-sample-game-in-unreal-engine) as an example Unreal Project.

- To open the Unreal Project with UGS, click the **Ok** button. [image: Open Project window with local file selected]

## 2 - Opening a Workspace File

The following steps show you how to open a workspace Unreal Project file with UGS.

- To open a `.uproject` file on your local drive, click the **Open project...** link. [image: Unreal Game Sync start page]

- When the **Open Project** window opens, UGS selects the **Local File** radio button by default. Select the **Workspace** radio button to get started. [image: Open Project window]

- The first field that needs to be populated is the Workspace's name. If you already have a Workspace to point UGS to, click the** Browse...** button next to the **Name:** field. [image: Open Project window with Workspace selected] If you need to create a new Workspace, click the **New...** button to set up a New Workspace. [image: New Workspace Setup]

- When the **Select Workspace** menu opens, it will show you a list of Workspaces that you can choose from. Go ahead and select a **Workspace (1)** and click the **Ok** button **(2)**. [image: Select Workspace]

- Now, click the **Browse...** button next to the **Path:** field. [image: Open Project window with Workspace field populated]

- With the **Select Project** menu open, expand the Workspace tree, select the `.uproject` file **(1)**, and click the **Ok** button **(2)**. [image: Select Project menu] We are using the Lyra Sample Game (-> lyra-sample-game-in-unreal-engine) as an example Unreal Project.

- Now that you have specified the **Workspace Name** and **Path**, you are ready to open the Unreal Project with UGS by clicking the **Ok** button. [image: Open Project window with both Workspace Name and Path selected]

## 3 - Syncing from the Changelist Area

Now that you have opened a project with UGS, you will want to perform a common task with UGS, syncing from the **Changelist Area**.

Make sure that you have logged into **Perforce** before proceeding with the following steps.

- Now that you have opened your project with UGS, locate the **Changelist Area** in the **Main Menu**. [image: Unreal Game Sync project tab]

- Locate the change that you are using, it will have an **arrow icon** next to it. [image: Project tab with current change indicated by arrow icon]

- To update to another change that was committed to the project's stream, double click on the other change while inside of the **Changelist Area**. [image: Project tab with another change selected]

When the sync finishes, UGS updates the **Output Log (3)**, the **Changelist Area (2)**, and the **Project Overview Area (1)**, which is where you will sync your project from in the next step.

 [image: Project tab with new sync finished]

## 4 - Syncing from the Project Overview Area

Now that you have performed a sync from the **Changelist Area**, having already opened the project with UGS, you will want to perform another common task with UGS, syncing from the **Project Overview Area**.

- First, locate the **Project Overview Area** in the **Main Menu**. [image: Project tab with Project Overview Area highlighted]

- Click the **down arrow** button next to the **Sync Now - To...** button link to open the shortcut menu. [image: Project tab with Sync Now - To... button highlighted]

- Now, select the **Latest Change** option. [image: Project tab with Latest Change selected] To learn more about navigating the interface, options, and menus built into UGS, check out the UGS Reference (-> unreal-game-sync-reference-guide-for-unreal-engine) Guide.

At the end of the sync, UGS will notify you that you have successfully updated to the latest **Change**.

You have now reached the end of this guide, where you learned how to open a project and how to sync it from the **Changelist** and **Project Overview Areas** of the user interface. If you want to continue learning more about UGS on your own, including how to deploy a binary version of your project or how to navigate the interface with all of its menus and options, check out the next section of this guide.

## 5 - On Your Own!

Now that you have opened your project, having performed a couple of common sync methods with UGS, try the following:

- Enable the **Build** and **Run** check boxes, which are found at the bottom of the UGS main menu to sync, build, and run your Unreal project. [image: Unreal Editor opened after selecting Build and Run]

- If you are a developer looking to make use of the precompiled binaries feature for Creators who do not need to compile from source, read through the UGS Reference (-> unreal-game-sync-reference-guide-for-unreal-engine) guide for more information on how to set up your build system to periodically submit a zip file containing Editor binaries to Perforce, enabling UGS to extract it to your creative's workspace.

- unrealgamesync

On this page

- 1 - Opening a Local File (-> unreal-game-sync-quick-start-guide)
- 2 - Opening a Workspace File (-> unreal-game-sync-quick-start-guide)
- 3 - Syncing from the Changelist Area (-> unreal-game-sync-quick-start-guide)
- 4 - Syncing from the Project Overview Area (-> unreal-game-sync-quick-start-guide)
- 5 - On Your Own! (-> unreal-game-sync-quick-start-guide)

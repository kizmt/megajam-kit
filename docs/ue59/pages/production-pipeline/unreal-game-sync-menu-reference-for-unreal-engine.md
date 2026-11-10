# UGS Menu Reference

https://dev.epicgames.com/documentation/en-us/unreal-engine/unreal-game-sync-menu-reference-for-unreal-engine?application_version=5.9

> All the options in the Unreal Game Sync menus

[image: UGS Menu Reference]

This page provides a reference for the menus and options available in **UnrealGameSync (UGS)**.

 [image: Unreal Game Sync main screen]

## Project Overview

Provides information about:

- The stream opened.

- The local path to the `.uproject`/`.uprojectdirs` file.

- The latest sync status.

| Option | Description |
| --- | --- |
| **Settings** | Change what file is being used to open the project. |
| **Sync Now** | Sync the project using the **To…** setting: **Latest Change**: Sync to the absolute latest, could be unstable. **Latest Good Change**: Sync to the latest change that has been used by another member of the organization (requires a metadata server). **Latest Starred Change**: Sync to the latest change marked by someone using the **Add Star** context menu option in the **Changelist** area. |
| **Unreal Editor** | Run the project in the editor. Leverages the **Precompiled Binary (PCB) editor** when available. |
| **SDK Info** | View SDK availability in the stream. |
| **Perforce** | Open the stream in **Helix Visual Client (P4V)**. |
| **Visual Studio** | Open the project in **Visual Studio**. |
| **Windows Explorer** | Open the project in **Windows Explorer**. |
| **More -> Clean Workspace** | Clean the **Perforce** Workspace |
| **Show Log** | Show the log of the latest sync in the **Log** section. Available upon a failed or cancelled sync operation. |

## Changelists

Sync to a particular changelist, and view information about each changelist.

| Option | Description |
| --- | --- |
| **Type** | Code change, content change, or both. |
| **Change** | The changelist number in Perforce. |
| **Time** | Identifies when the change was submitted. |
| **Author** | Identifies who submitted the change. |
| **Description** | The description of the changelist written by its author. |
| **CIS** | The status of the **Continuous Integration System (CIS)** merge after this change. Requires a metadata server. |
| **Status** | Identifies who is currently using the build from a changelist, and their status with it. Requires a metadata server. |

### Right-Click Context Menu

Different options are available for each changelist, some of which are replicated from the Project Overview Area.

 [image: Changelist right-click context menu]

| Option | Description |
| --- | --- |
| Currently Synced Changelist |  |
| **Launch Editor** | Available if the editor has been previously built for the given changelist. |
| **Build** | Build the changelist. |
| **Rebuild** | Rebuild the changelist. |
| **Generate project files** | Generate project files. |
| **Open in Visual Studio** | Opens the changelist in Visual Studio. |
| General Options |  |
| **Sync** | Sync with Perforce. |
| **Sync (Just this Change)** | Does not pick up changes in between the currently synced changelist and the selected changelist. |
| **Mark as good** | Visible to other users. Requires a metadata server. |
| **Mark as bad** | Visible to other users. Requires a metadata server. |
| **Withdraw review** | Cancels **Mark as good** or **Mark as bad**. Requires a metadata server. |
| **Leave comment** | Leave a comment that is visible to other UGS users. Requires a metadata server. |
| **Start investigating** | Mark the changelist as bad, along with all following changelists, and open up an investigation. Requires a metadata server. |
| **Add Star** | Add a star to the build that others can see, meaning it's a special or approved build. Requires a metadata server. |
| **Copy Changelist** | Copy the changelist number to your clipboard. |
| **More Info…** | Open the changelist in P4V. |

## Log

The log of the current sync operations, including Perforce operations and build operations. The right-click context menu allows for selecting and copying from the log.

## Filter Menu

 [image: Unreal Game Sync filter menu]

| Option | Description |
| --- | --- |
| **Type** | Switch between code and content changelists, or both (default). |
| **Badges** | Filter based on CIS badges. |
| **Show Build Machine Changes** | Show build machine changelists as well as user changelists (off by default). |

## After Sync Options

 [image: Unreal Game Sync after sync options]

| Option | Description |
| --- | --- |
| **Build** | Use **Unreal Build Tool (UBT)** to build the project automatically in the **Editor Build Configuration** selected from the **Options** menu. Default is **Debug**. |
| **Run** | Automatically runs the output of the build step upon a successful build. |
| **Open Solution** | Open the solution in Visual Studio automatically after generating the project files. |

## Options Menu

 [image: Unreal Game Sync Options menu]

| Option | Description |
| --- | --- |
| **Application Settings** | Refer to the Application Settings (-> unreal-game-sync-menu-reference-for-unreal-engine) table. |
| **Scheduled Sync** | Set what projects are synced and built, what changelist type, and when: [image: Unreal Game Sync scheduled sync settings] This can also be used to turn off the scheduled syncs. |
| **Sync Precompiled Binaries** | Sync PCBs automatically if available. |
| **Auto-Resolve Conflicts** | Automatically resolve Perforce conflicts. |
| **Sync Filter…** | Open up the sync filter options dialog. For more information on this dialog and its usage, refer to the UGS Sync Filter Setup (-> unreal-game-sync-filters-for-unreal-engine) documentation. |
| **Editor Build Configuration** | Select from **Debug**, **DebugGame**, or **Development**. |
| **Customize Build Steps…** | Refer to the Custom Build Steps (-> unreal-game-sync-menu-reference-for-unreal-engine) table |
| **Editor Command Line Arguments…** | [image: Unreal Game Sync command line arguments] The **Command Line Arguments** window lets you edit, add, and remove command line arguments, as well as change the order they're passed. You can force this dialog on each launch if you find yourself editing command line arguments repeatedly. |
| **Tab Names** | Select from **Stream**, **Workspace Name**, **Workspace Root**, or **Project File**. |
| **Show Changes** | Independently toggle showing changes without reviews and showing changes by automated processes. |
| **Time Zone** | Select either **Local** or **Perforce Server** time. |
| **Diagnostics…** | [image: Unreal Game Sync diagnostics window] Open the **Diagnostics** window for UGS. Clicking **View logs** in this dialog will take you to where UGS writes its logs. This can be very useful for diagnosing UGS-related issues. |

### Application Settings

 [image: Unreal Game Sync application settings window]

| Setting | Description |  |
| --- | --- | --- |
| **Startup and Shutdown** | Configure the app to run on startup and keep running when minimized. |  |
| **Default Perforce Settings** | The credentials UGS will use to log into Perforce. |  |
| **Updates** | Where the program will look in Perforce to update itself, and if it's acceptable to use an unstable (test) version of the application. |  |
| **Integration** | Mechanisms for UGS to integrate with other applications and tools. |  |
| **Custom Tools** | Tools to use along with UGS. |  |
| **Advanced** | [image: Unreal Game Sync advanced application settings] Option | Description |
| **Retries on timeout** | How many times to try again after a timeout. |  |
| **TCP Buffer Size** | The size of the TCP buffer in bytes. |  |

### Custom Build Steps

The **Custom Build Steps** window lets you modify and add new build steps.

 [image: Unreal Game Sync custom build steps window]

| Option | Description |
| --- | --- |
| **Normal Sync** | Run the step every time a user syncs. |
| **Scheduled Sync** | Run the step as part of a scheduled (automatic) sync. |
| **Show as Tool** | The step will be displayed in the **Project Overview**'s **More…** option as a tool the user can run. |
| **New Step…** | Refer to the New Step (-> unreal-game-sync-menu-reference-for-unreal-engine) table. |

#### New Step

The **New Step** window shows all the fields necessary to define and execute a new build step task.

 [image: Unreal Game Sync New Step window]

| Field / Option | Description |
| --- | --- |
| **Description** | The name or short description of the step. |
| **Status Text** | The status text displayed when running the task. |
| **Approximate Duration** | How long it will take to run the step. |
| **Compile** | Build a target using UBT with the selected configuration, platforms, and additional command line arguments to UBT. |
| **Cook** | Cook through **BuildCookRun** given a specified profile. |
| **Other** | Run a generic executable from a given working directory with a given set of command line arguments. Also allows you to use the log window to show the program's output. |
| **Variables** | [image: Unreal Game Sync Variables window] The **Variables** window will open up the environment variables for the task and allows editing them. |

- unreal game sync

On this page

- Project Overview (-> unreal-game-sync-menu-reference-for-unreal-engine)
- Changelists (-> unreal-game-sync-menu-reference-for-unreal-engine)
- Right-Click Context Menu (-> unreal-game-sync-menu-reference-for-unreal-engine)
- Log (-> unreal-game-sync-menu-reference-for-unreal-engine)
- Filter Menu (-> unreal-game-sync-menu-reference-for-unreal-engine)
- After Sync Options (-> unreal-game-sync-menu-reference-for-unreal-engine)
- Options Menu (-> unreal-game-sync-menu-reference-for-unreal-engine)
- Application Settings (-> unreal-game-sync-menu-reference-for-unreal-engine)
- Custom Build Steps (-> unreal-game-sync-menu-reference-for-unreal-engine)
- New Step (-> unreal-game-sync-menu-reference-for-unreal-engine)

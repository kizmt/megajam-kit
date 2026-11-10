# Horde UnrealGameSync Tutorial

https://dev.epicgames.com/documentation/en-us/unreal-engine/horde-unrealgamesync-tutorial-for-unreal-engine?application_version=5.9

> A tutorial on using Horde and UnrealGameSync together for Unreal Engine.

[image: Horde UnrealGameSync Tutorial]

## Introduction

Projects built with Unreal Engine typically require close collaboration between artists, designers and engineers - especially with technologies such as Blueprint, which allow interop of C++ code and gameplay scripting.

Coordinating these development efforts can be challenging due to the way that different developers interact with the revision control system - engineers may modify code and build their own editor, then submit assets created with those code changes, for example - and artists need to be able to sync and use those same assets in lock-step, without having to navigate a code IDE.

**UnrealGameSync** (often abbreviated as **UGS**) is a tool to provide a unified frontend to developers syncing a project from **Perforce**, providing content creators and engineers with the same view of the repository. Engineers can use it to version their editor correctly for editing assets, and content creators can use it to sync pre-built editor binaries produced by Horde's build automation system. The interface provides an overview of the health of the project and the state of recent CI builds, and acts as a jumping-off point for launching other tools.

Epic Games uses UnrealGameSync for development on all internal projects, such as Fortnite. More information about UnrealGameSync can be found here (-> unreal-game-sync-ugs-for-unreal-engine).

The graphical UnrealGameSync client is only available on Windows. A command line version is available for use on MacOS and Linux.

 [image: UnrealGameSync]

## Prerequisites

- Horde Server installation (see the Horde Installation Tutorial (-> horde-installation-tutorial-for-unreal-engine)).

## Installation (Windows)

- Navigate to the `Tools > Downloads` page on the Horde dashboard.

- Click the `Download` button to the right of the `UnrealGameSync` item, and run the downloaded installer.

- After installation, you'll be prompted to configure auto-update settings for UnrealGameSync. Select 'Horde' and enter the path to your Horde server. This will also configure UnrealGameSync to fetch build information and metadata from other users from Horde. You can modify this later using the `Options > Application Settings...` dialog inside UnrealGameSync.

- Select `Open Project...`, and select a project you already have synced locally, or create a new workspace with the project to sync.

## Installation (Mac)

- Install the .NET 8 Runtime and Helix Command Line Tools.

- Open a terminal and run: ```
     curl "{{ HORDE_SERVER_URL }}/api/v1/tools/ugs-cmd?action=download" -o ~/ugs.zip
     unzip -eo ~/ugs.zip -d ~/ugs/
     ~/ugs/ugs install
     source ~/.zshrc
``` curl "{{ HORDE_SERVER_URL }}/api/v1/tools/ugs-cmd?action=download" -o ~/ugs.zip unzip -eo ~/ugs.zip -d ~/ugs/ ~/ugs/ugs install source ~/.zshrc

- Run `ugs -help` for information on available commands.

## Installation (Linux)

- Install the .NET 8 Runtime and Helix Command Line Tools.

- Open a terminal and run: ```
     curl "{{ HORDE_SERVER_URL }}/api/v1/tools/ugs-cmd?action=download" -o ~/ugs.zip
     unzip -eo ~/ugs.zip -d ~/ugs/
     ~/ugs/ugs install
     source ~/.bashrc
``` curl "{{ HORDE_SERVER_URL }}/api/v1/tools/ugs-cmd?action=download" -o ~/ugs.zip unzip -eo ~/ugs.zip -d ~/ugs/ ~/ugs/ugs install source ~/.bashrc

- Run `ugs -help` for information on available commands.

## Server Setup

### Default Perforce Server

- If your whole team uses the same Perforce server, you can configure UGS with a default value by modifying the server's globals.json (-> horde-orientation-for-unreal-engine) file. As long as UGS is configured to use your Horde server, it will query this property on startup. ```
      "parameters": {
          "ugs":
          {
              // Set the default Perforce server for anyone using UGS.
              "defaultPerforceServer": "perforce:1666"
          }
      }
``` "parameters": { "ugs": { // Set the default Perforce server for anyone using UGS. "defaultPerforceServer": "perforce:1666" } }

### Editor Builds

UnrealGameSync was originally created with small teams in mind, where artists would be able to sync and build code code changes locally without any infrastructure (eg. a CI/CD system) set up. While it can still be used in this way, for larger teams it's typically easier to have Horde's build automation system generate editor builds centrally.

UnrealGameSync can query Horde for available editor builds (often referred to aspre-compiled binaries or PCBs). These builds can be stored and discovered on the Horde server automatically. Earlier builds of UnrealGameSync required storing these binaries in a zip file in Perforce; this is no longer necessary.

The example stream configuration referenced from Horde's build automation (-> horde-build-automation-tutorial-for-unreal-engine) tutorial guide includes an **Incremental Build** job template which will compile and upload these binaries using the `Engine/Build/Graph/Examples/BuildEditorAndTools.xml` BuildGraph (-> buildgraph-for-unreal-engine) script.

Once you've built your project's editor on Horde, check the `Options > Sync Precompiled Binaries` option to download them rather than building locally.

### Badges

You can surface information from Horde's build automation system directly in UGS by using the BuildGraph `<Label>` element.

- horde
- bronze

On this page

- Introduction (-> horde-unrealgamesync-tutorial-for-unreal-engine)
- Prerequisites (-> horde-unrealgamesync-tutorial-for-unreal-engine)
- Installation (Windows) (-> horde-unrealgamesync-tutorial-for-unreal-engine)
- Installation (Mac) (-> horde-unrealgamesync-tutorial-for-unreal-engine)
- Installation (Linux) (-> horde-unrealgamesync-tutorial-for-unreal-engine)
- Server Setup (-> horde-unrealgamesync-tutorial-for-unreal-engine)
- Default Perforce Server (-> horde-unrealgamesync-tutorial-for-unreal-engine)
- Editor Builds (-> horde-unrealgamesync-tutorial-for-unreal-engine)
- Badges (-> horde-unrealgamesync-tutorial-for-unreal-engine)

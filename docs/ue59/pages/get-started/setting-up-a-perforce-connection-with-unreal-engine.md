# Setting Up a Perforce Connection

https://dev.epicgames.com/documentation/en-us/unreal-engine/setting-up-a-perforce-connection-with-unreal-engine?application_version=5.9

> Guide to connecting to Epic Games' Perforce server to obtain Unreal Engine builds.

[image: Setting Up a Perforce Connection]

Using the content of this page requires a custom license support agreement with Epic Games that includes access to the Unreal Engine P4 Perforce depot.

Epic Games makes QA-approved builds of Unreal Engine, as well as other specialized code drops, available to licensees through a Perforce depot that can be accessed externally. This is one of the methods licensees use to first obtain the engine, as well as update to new versions as they are released and it is deemed appropriate by the licensee. This document covers the steps to set up Perforce locally in order to connect to the Epic Games' Unreal Engine depot and sync to a build of the engine.

## Connectivity Policy

Please note that only one authorized user should log into the Perforce account. Multiple users logging into the same account is a violation of the Perforce terms of service.

Epic Games' guidance is for a single user or automation to use the account to sync engine builds to your local Perforce depot, and allow your staff access with their own individual Perforce accounts licensed by your company.

If you don’t already have a Perforce license for your team, it is free for up to 5 users or you can explore licensing options.

The complete process for downloading builds or revisions of Unreal Engine from Epic Games' Perforce depot is detailed on the Downloading Unreal Engine with Perforce (-> downloading-unreal-engine-with-perforce) page.

## Installation and Configuration

### Setting Up P4V

The P4V client is the current client provided by Perforce. It provides access to versioned files through a graphical interface and also includes tools for merging and visualizing code evolution.

The full P4V installer can be downloaded from the Perforce Downloads page. Refer to Perforce's P4V documentation for instructions on installing and setting up P4V.

Be sure to download the version that applies to your operating system, including 32- or 64-bit.

You must be running a 2017.2 or later version of a Perforce client

### Character Encoding

If you store Unicode files as text in Perforce, it will add in a 0xd to match the local line end; so the Unicode line end 0x0a 0x00 0x0d 0x00 will be converted to 0x0a 0x0d 0x00 0x0d 0x00 and break. However, when it does this, it will leave your local version unchanged (and working). Sync to a previous version and then back to head to see the problem.

Perforce defines UTF-8 as Unicode. UTF-16 is ideal, provided no one accidentally converts to ASCII. Binary also works OK provided you do not miss merging or multiple checkouts.

Unreal Engine will load ASCII or UTF-16 with BOM, provided they are valid files.

### Setting up Perforce for Unreal Engine Distribution

Your team is granted a single account on Epic Games’ Perforce P4 server from which you can download the Unreal Engine source. Follow the instructions below to set up a process for sharing builds with your team.

#### Perform initial setup and import

- Create your own (local) P4 Server.
- Create a stream’s depot on that server for importing into, for example: `//UE5`
- Create a stream for the particular release you are importing from Epic, for example: `//UE5/Release-5.6.0`Do not add any files to this local stream – you will add them below as a separate step.

- Create a workspace on the Epic Games Perforce P4 Server (see Downloading Unreal Engine with Perforce (-> downloading-unreal-engine-with-perforce)) and sync the data you want.Set the workspace Root folder to something like: `c:\UE5\release-5.6`
- Note the latest changelist you are syncing to (view the history tab in P4V with the stream selected).

- Create a new connection in P4V to your own Perforce P4 Server.
- Create a workspace for your new Stream (`//UE5/Release-5.6.0`)
- Set the root of the workspace to be the same folder as for your workspace on the Epic Games Perforce P4 server (in this example, `c:\UE\release-5.6`).
- Right click on the root folder and select **Mark for Add**.
- Go to the pending changelists folder, and submit the changelist.In the description, note the particular changelist number you synced from the Epic Games server

### Get and Import a New Snapshot from Epic Games

This is a regular process using the workspaces you previously created. It is a modified subset of the steps above, and this workflow assumes you still have your workspaces as previously set up. You will import the latest changes.

- Connect to the Epic Games Perforce P4 serverSelect the workspace you previously created.
- Click **Get Latest** to update the files.
- Note the latest changelist you synced to.

- Connect to your local Perforce P4 Server.
- Select the workspace you previously created.
- Right click on the root folder and select **Reconcile offline work**.
- Go to the pending changelists folder, and submit the changelist.In the description, note the particular changelist number you synced from the Epic Games server.

## Support

### Connection Issues

If you are unable to connect to the Perforce depot for any reason, please contact [email protected] or post on Epic Pro Support.

On this page

- Connectivity Policy (-> setting-up-a-perforce-connection-with-unreal-engine)
- Installation and Configuration (-> setting-up-a-perforce-connection-with-unreal-engine)
- Setting Up P4V (-> setting-up-a-perforce-connection-with-unreal-engine)
- Character Encoding (-> setting-up-a-perforce-connection-with-unreal-engine)
- Setting up Perforce for Unreal Engine Distribution (-> setting-up-a-perforce-connection-with-unreal-engine)
- Perform initial setup and import (-> setting-up-a-perforce-connection-with-unreal-engine)
- Get and Import a New Snapshot from Epic Games (-> setting-up-a-perforce-connection-with-unreal-engine)
- Support (-> setting-up-a-perforce-connection-with-unreal-engine)
- Connection Issues (-> setting-up-a-perforce-connection-with-unreal-engine)

# Capture Manager Quick Start

https://dev.epicgames.com/documentation/en-us/unreal-engine/capture-manager-quick-start?application_version=5.9

> Get started using Capture Manager in Live Link Hub.

This page provides the basic steps to get started using **Capture Manager** and ingest a take. It assumes you are already familiar with Live Link Hub (-> live-link-hub-in-unreal-engine), and have captured footage ready to ingest.

## Enable Capture Manager Editor Plugin

The **Capture Manager Editor** plugin is required to use Capture Manager in **Live Link Hub**. It is shipped with **Unreal Engine** 5.6 or later.

Follow these steps to enable the Capture Manager Editor plugin in your Unreal Engine project:

- Create or open an Unreal Engine project.

- From the Unreal Editor menu bar, navigate to** Edit > Plugins**. This will open the **Plugins **window.

- In this window, search for “Capture Manager Editor.”

- Enable the **Capture Manager Editor** plugin.

For more information about how to enable plugins in your project, refer to the Working with Plugins (-> working-with-plugins-in-unreal-engine) page in the Unreal Engine documentation.

> **note:** When enabling plugins, a warning message may appear stating, "You must restart Unreal Editor for your changes to take effect." If you have enabled all the plugins you want and you are ready to restart the Unreal Editor, click **Restart Now**.

## Capture Manager Workflow

The Capture Manager workflow to ingest a take consists of the following steps:

- To open **Capture Manager**, select it from the **Layouts **drop down. [image: UE Capture Manager]

- Click **Add Device** and select the option that matches the data to be ingested. [image: UE Capture Manager Add Device] - **Mono Video**: Ingest individual video files as mono takes. If the video contains an audio track it will also be extracted during ingest. - **Live Link Face**: Ingest takes directly from a connected iOS device running the Live Link Face App. - **Take Archive**: Ingest an arbitrary take of video, audio, depth, and calibration data identified using a take metadata file (`.cptake`). - **Stereo Video**: Ingest pairs of video files as stereo takes. An audio file (`.wav`) may also be provided alongside the video. > **tip:** The **Take Archive** device is backwards compatible with takes created for use with Capture Manager and **MetaHuman Animator** in Unreal Engine 5.5 and earlier.

- Select the **Pipeline **to define the stages that are executed during ingest. The supported pipelines are: - **Ingest**: Download (from Live Link Face — if applicable), convert (to formats required for Unreal Engine), and create assets (in Unreal Engine). - **Download**: Download only (from Live Link Face — if applicable).

- Select one or more takes in the **Take Browser **and click **Add to Queue** to add them to the ingest queue. [image: Capture Manager Add To Queue]

- Ingest options can be edited in the **Job Details** panel. [image: Capture Manger Job List]

- With takes in the **Jobs List** ready to ingest, click on **Start **to begin processing. | [image: Job List Start] | [image: Job List In Progress] | | --- | --- |

On successful ingest of the selected takes, assets will be created and visible in the **Content Browser** for the current project.

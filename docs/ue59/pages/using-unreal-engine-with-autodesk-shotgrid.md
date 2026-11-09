# Using Unreal Engine with Autodesk ShotGrid

https://dev.epicgames.com/documentation/en-us/unreal-engine/using-unreal-engine-with-autodesk-shotgrid?application_version=5.9

> Describes how to use Unreal with the Autodesk ShotGrid integration.

[image: Using Unreal Engine with Autodesk ShotGrid]

Learn to use this **Beta** feature, but use caution when shipping with it.

 [image: Autodesk ShotGrid integration in Unreal Editor]

Epic Games has partnered with Autodesk to integrate Unreal Engine into the ShotGrid production management system. You can now make Unreal Editor a key player in your ShotGrid content pipeline: you can load assets from ShotGrid to work on in the Unreal Editor, and publish the Assets and Actors in your Unreal Engine Project back to ShotGrid for other people in your organization to work on.

- If you're new to ShotGrid, see its features page and Help Center to get started learning about what it can do for you.

- If you haven't used a desktop application that integrates with ShotGrid before, read over it's Integrations User Guide for some basics about the workflows and apps that it introduces to get your team working together across separate content creation tools.

While this integration covers all of the ShotGrid Pipeline Toolkit's base features, we don't consider it a fully finished pipeline that solves all your needs for working with Unreal Engine content in the context of a full-scale production. We expect this integration to evolve over time based on your feedback, and in time, we'll get to that point. For now, consider this integration as a helpful starting point if you already use ShotGrid (or are considering adopting it), and as a base for experienced pipeline developers to build on top of.

## Setting up an Unreal Engine Project

Any Unreal Engine Project can work with ShotGrid. However, you first have to enable the ShotGrid Plugin in your Project.

- From the main menu in Unreal Editor, select **Edit > Plugins** to open the **Plugins** window.

- In the **Editor** section, find the **ShotGrid Plugin** and check its **Enabled** checkbox.

- Restart your Project when prompted.

You won't see any difference in the Unreal Editor UI yet — this is normal. Refer to the next section to learn how to launch Unreal Editor from the ShotGrid Desktop application.

Enabling the ShotGrid plugin also enables the **Python Editor Script Plugin** for your Project. While this plugin is enabled, you can run Python code in the Unreal Editor to work with your content. For details, see Scripting the Editor using Python.

## Launching Unreal Editor

In order to activate the ShotGrid integration in your sessoin, you must launch the Unreal Editor from the ShotGrid Desktop application.

If you haven't used ShotGrid on the web before, refer to the Setting up a ShotGrid Project documentation (-> setting-up-a-shotgrid-project-to-work-with-unreal-engine) to get started.

- Launch **ShotGrid Desktop** and log in to your organization's ShotGrid site with your user account.

- Open any ShotGrid project that has been configured to work with Unreal Editor (-> setting-up-a-shotgrid-project-to-work-with-unreal-engine).

- ShotGrid Desktop then scans your computer for installations of Unreal Engine, and offers shortcuts on the **Apps** page: Click one of these shortcuts.

- In the **Unreal Project Browser**, select a Project that already has the ShotGrid Plugin enabled, and click **Open**.

## The ShotGrid Menu

When Unreal Editor is running in the context of a ShotGrid project, a ShotGrid menu is added to the main Toolbar:

 [image: The ShotGrid menu via the Toolbar]

You can also open the same menu by right-clicking on **Assets** in the **Content Browser**.

Some aspects of the ShotGrid integration are context-aware and provide additional functionality based on your selection.

 [image: Accessing ShotGrid via Assets in the Content Browser]

| Option | Description |
| --- | --- |
| Toggle Debug Logging | Determines whether the ShotGrid integration writes debug messages to the Output Log and to a log file on disk. Refer to the Debug Logs (-> using-unreal-engine-with-autodesk-shotgrid) below. |
| Open Log Folder | Opens the location on your computer that contains your ShotGrid log files. |
| Jump to ShotGrid | Opens the current ShotGrid project in your system's default web browser. |
| Work Area Info... | Opens the ShotGrid **Your Current Work Area** tool, which shows your current project, environment settings, and toolkit apps that are running. For details, refer to the ShotGrid documentation. |
| Load... | Opens the ShotGrid **Loader** tool. Refer to Loading Content from ShotGrid into Unreal Editor (-> using-unreal-engine-with-autodesk-shotgrid) below. |
| Publish... | Opens the ShotGrid **Publish** tool. See Publishing Content from Unreal to ShotGrid (-> using-unreal-engine-with-autodesk-shotgrid) below. You'll typically want to open this tool by right-clicking the Assets or Actors you want to publish. When you open this panel from the Toolbar, it does not support dragging and dropping Assets or Actors from your Unreal session. |
| ShotGrid Panel... | Opens the **ShotGrid Panel** tool. Use this to get a view on all the activity happening in your ShotGrid project without having to leave the Unreal Editor. For details, refer to the ShotGrid documentation. |

## Loading Content from ShotGrid into Unreal Editor

The ShotGrid Toolkit includes a **Loader** app you can use in the Unreal Editor to import content published to ShotGrid by artists into your Unreal Project.

- To launch the Loader app, choose **Load...** from the ShotGrid menu.

- In the Loader, you can browse the full collection of assets that have ever been published to your ShotGrid project, or that are related to your ShotGrid Tasks: [image: The ShotGrid toolkit Loader app]

- Choose one or more assets that you want to import, and import them into the Content Browser. To do so, you can either right-click assets and choose **Import into Content Browser** from the context menu, or click the **Actions** button for any selected asset and select **Import into Content Browser**.

- The Unreal integration currently supports importing FBX files from ShotGrid. It uses the built-in FBX import pipeline to convert them into Static Meshes in Unreal.

- ShotGrid Toolkit's template system helps organize imported published content into folders within the Unreal Editor's Content Browser based on metadata from the production tracking database. You can use this to leverage data from ShotGrid to automate best practices within your Project for naming conventions. [image: The Toolkit folder in Unreal Editor] [image: The Toolkit folder in ShotGrid]

- For details about using the **Loader** app, refer to the ShotGrid Loader Documentation.

## Publishing Content from Unreal Editor to ShotGrid

The ShotGrid Toolkit includes a **Publish** app, which you can use in the Unreal Editor to export content that you've created or modified in Unreal Editor out to the ShotGrid project. Other artists, working in Unreal Editor or in other applications, can then use their own ShotGrid Loader apps to import that content and work on it downstream. Or, others in your organization can review the work you did in Unreal Editor within the ShotGrid web application.

- To launch the Publish app, right-click the Asset(s) in the Content Browser you want to publish, and choose **Publish...** from the ShotGrid menu.

- The Publish app lists all of the items that you had selected that it is able to export. [image: The ShotGrid Publish app]

- The Unreal integration currently supports publishing: **Static Mesh Assets**. These are exported to ShotGrid as FBX files, using the built-in FBX exporter.

- **Level Sequences**. These are rendered to movie files and exported to ShotGrid for viewing in RV, either in the ShotGrid web application or on the desktop.

- In the Publish app, you can add a description and thumbnail for each Unreal Asset you're publishing. This helps downstream artists and reviewers understand what you've published.

- When you have all your published assets set up the way you want them, click **Publish** to export them all to FBX and make them available to other ShotGrid applications in your project's shared storage location.

- For details about using the **Publish** app, refer to the ShotGrid Integrations User Guide.

## Publishing Content from Maya and Rendering in Unreal

The `tk-config-unrealbasic` Pipeline Configuration includes a **Publish** hook for **Maya** that offers a full Maya-to-Unreal-to-ShotGrid asset review workflow that automatically performs the following actions when triggerd:

- Exports the model from **Maya** as an FBX file.

- Publishes the exported **FBX** to the ShotGrid database and on disk.

- Imports the FBX file to an **Unreal Editor** template project for turntables.

- Executes a real-time turntable render fo the model in **Unreal Editor** with **Movie Render Queue**.

- Uploads the render to **ShotGrid** for review.

 [image: Publishing Maya content]

You can customize the Unreal Editor template project to meet the needs of your asset review requirements.

## Debug Logging

The ShotGrid integration logs messages about everything it does to the **Output Log** in the Unreal Editor. These messages are logged with the `LogPython` category:

 [image: Debug logging for ShotGrid]

It also logs the same messages to the `tk-unreal.log` and `tk-desktop.log` files in the ShotGrid log folder for your platform. You can go straight to this folder at any time by choosing **Open Log Folder** from the ShotGrid menu.

These log messages can be useful for you to observe what tasks the integration is carrying out, and to diagnose problems or unexpected behavior. However, by default the integration logs messages at the most verbose level. If you want to reduce the number of messages printed to your Output Log, you can disable logging by choosing **Toggle Debug Logging** from the ShotGrid menu.

- beta
- landing page
- shotgrid
- integration

On this page

- Setting up an Unreal Engine Project (-> using-unreal-engine-with-autodesk-shotgrid)
- Launching Unreal Editor (-> using-unreal-engine-with-autodesk-shotgrid)
- The ShotGrid Menu (-> using-unreal-engine-with-autodesk-shotgrid)
- Loading Content from ShotGrid into Unreal Editor (-> using-unreal-engine-with-autodesk-shotgrid)
- Publishing Content from Unreal Editor to ShotGrid (-> using-unreal-engine-with-autodesk-shotgrid)
- Publishing Content from Maya and Rendering in Unreal (-> using-unreal-engine-with-autodesk-shotgrid)
- Debug Logging (-> using-unreal-engine-with-autodesk-shotgrid)

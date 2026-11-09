# Using Datasmith Direct Link

https://dev.epicgames.com/documentation/en-us/unreal-engine/using-datasmith-direct-link-in-unreal-engine?application_version=5.9

> An overview of Datasmith Direct Link technology in Unreal Engine.

[image: Using Datasmith Direct Link]

Learn to use this **Beta** feature, but use caution when shipping with it.

**Datasmith Direct Link** is a feature found in many Datasmith Exporter plugins that can incrementally update the viewport in an Unreal Engine-based application, such as **Twinmotion**, with the push of a button.

|  |  |
| --- | --- |
| [image: Archicad Direct Link] | [image: Collab Viewer Direct Link] |
| Source Application | Destination Application |

With the Direct Link workflow, you can set up a Datasmith Direct Link between one or more source applications and multiple destinations such as an Unreal Engine-based application or Twinmotion.

 [image: Direct Link Diagram]

Datasmith Direct Link allows multiple Source applications to connect to one or more Destinations.

This link updates your Unreal Engine Level or Twinmotion model, removing the need to re-export a `*.udatasmith` file from your source every time you make a change. This makes it easier to update and visualize incremental changes to your 3D scene in near real time.

## Setting up a Direct Link Connection

Getting started with the Datasmith Direct Link workflow begins with creating the connection between your 3D application and your Unreal Engine-based application.

- Download and install the appropriate Datasmith Exporter plugin for your application. You can download the appropriate plugin here. For more information on using the Datasmith Exporter plugin with your application, see Datasmith Software Interop Guides (-> datasmith-software-interop-guides-for-unreal-engine). [image: Archicad Plugin Install] Installing the Datasmith Exporter plugin for Archicad.

- Once you have installed the Datasmith Exporter plugin for your 3D application, check to ensure the Datasmith features are enabled. This will depend on your application.

- Open your destination application and select your 3D application as the **Source**. [image: Direct Link Destination setup] Datasmith options panel in the Collab Viewer template. For example, when running a local session in a project setup with the **Collab Viewer** template, press and hold the **spacebar** and select the **Datasmith** options to add one or more Direct Link sources to the Level. For more information on using the Collab Viewer template, see Collab Viewer Template Quick Start (-> collab-viewer-template-quick-start-in-unreal-engine).

- Back in your source application, sync your Direct Link connection by clicking the Synchronize with Direct Link button. [image: Archicad Toolbar] Sync your changes between applications by clicking the Synchronize with Direct Link button.

## Using Direct Link in Packaged Projects

To use Direct Link in packaged projects, you must take an additional step to enable UDP messaging for your project's `.exe` file.

- From Windows Explorer or another file explorer, go to your project folder, then open the `WindowsNoEditor` folder.

- Right-click your project's executable file and, from the context menu, select **Create Shortcut**. [image: Creating a shortcut to the packaged Unreal Engine project]

- Right-click the shortcut you created and, from the context menu, select **Properties**. [image: Opening the properties of the newly created shortcut]

- In the shortcut's **Properties** window, add the `-messaging` parameter to the **Target** property. For the current example, the full line would look like this: `"C:\Users\admin\Documents\Unreal Projects\DirectLinkTest\WindowsNoEditor\DirectLinkTest.exe" -messaging` [image: Adding a parameter to the shortcut's target]

- Click **OK** to save your changes.

## End Result

With the Direct Link connection established, you are now able to update your Unreal Engine or Twinmotion models with the push of a button.

 [image: Direct Link Example]

Disabling the **Use Less CPU when in Background** option enables the engine to update the 3D viewport when the Unreal Engine window is not focused and when a Pawn in the level is not possessed. This option is found in the **Editor Preferences** under **General > Performance**.

- importing
- beta
- datasmith

On this page

- Setting up a Direct Link Connection (-> using-datasmith-direct-link-in-unreal-engine)
- Using Direct Link in Packaged Projects (-> using-datasmith-direct-link-in-unreal-engine)
- End Result (-> using-datasmith-direct-link-in-unreal-engine)

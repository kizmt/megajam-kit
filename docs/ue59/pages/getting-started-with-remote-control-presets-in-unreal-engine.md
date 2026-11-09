# Getting Started with Remote Control Presets

https://dev.epicgames.com/documentation/en-us/unreal-engine/getting-started-with-remote-control-presets-in-unreal-engine?application_version=5.9

> With Remote Control Preset, collect and organize any UI parameters or functions in a single panel and expose them to the Remote Control API.

[image: Getting Started with Remote Control Presets]

Learn to use this **Beta** feature, but use caution when shipping with it.

With **Remote Control Preset**, you can collect and organize any UI parameters or functions in a single panel and expose them to the Remote Control API. These parameters and functions can be connected to widgets in a companion web application provided by the **Remote Control Web Interface** plugin to control the engine remotely.

 [image: Remote Control panel in action]

This page covers how to expose properties and functions from the Unreal Editor to the Remote Control API. For more details on all the settings in the Remote Control Panel, refer to Remote Control Panel Reference (-> remote-control-panel-reference-for-unreal-engine).

## Prerequisites

The **Remote Control API** plugin provides the web server that hosts the data and websocket connections for the **Remote Control Preset**.

Follow these steps to enable the plugin for your project.

- Open your project in the Unreal Editor.

- In the Editor's main menu, choose **Edit > Plugins** to open the **Plugins** window.

- In the **Plugins** window, find the **Remote Control API** plugin in the **Messaging** category. Check its **Enabled** checkbox. [image: Remote Control API plugin]

- Restart the engine.

## Exposing Properties to the Remote Control Panel and Remote Control API

The **Remote Control Panel** in the **Unreal Editor** is where you can collect properties from multiple objects in the level together for easy access. You can also add functions to the panel and call them from the panel. When properties and functions are exposed to the **Remote Control Panel**, they are also exposed to the **Remote Control API**. This helps an operator easily organize any items that they need to control in a live environment.

Follow these steps to add a **Remote Control Preset** and open the **Remote Control Panel**.

- Press **Add** in the **Content Drawer** and navigate to the **Miscellaneous** section. Select **Remote Control Preset**. [image: Remote Control Preset menu option] [image: Remote Control Preset in the Content Browser]

- Open the **Remote Control Panel** by double-clicking the **Remote Control Preset Asset**. [image: Empty Remote Control Panel]

- Check the **Edit Mode** checkbox. [image: Edit Mode checkbox]

- In the **Details** panels for **Assets**, every property now has the settings menu for that property (three dots). [image: Remote Control settings menu in the Details panel]

- Left-click on the setting menu to see a closed or open eye icon. [image: Remote Control eye icons in the Details panel]

- The eye icon determines whether a property is added to the **Remote Control Panel**: An **open** eye icon means the property **is** added to the Remote Control Panel.

- A **closed** eye icon means the property **is not** added to the Remote Control Panel.

- Clicking on an open eye icon closes it, and vice versa; the property is added or removed from the Remote Control Panel accordingly.

- When the property is in the Remote Control Panel, it has the same interface as in the **Details** panel. [image: Remote Control panel interface] [image: Details panel interface] A Light Color property with RGB values in the Remote Control Panel (left) and in the Details panel (right).

- Right-click on the **Remote Control Preset** and select **Save** to keep your changes.

## Exposing Properties and Functions via Blueprint Library

This feature is experimental and may change in the next release.

You can use a Blueprint Library to expose properties, functions, and Actors to the Remote Control API and automate the process of populating a Remote Control Preset. Refer to Blueprint API for more details on how to expose these using Blueprints.

In the following example Blueprint, the function is set up to expose all trees of the class** Light_BP**.

Click image to expand.

When the function is run, the Remote Control Preset will show all the trees of the class **Light_BP**.

Click image to expand.

## Next Steps

In this guide, you learned how to expose properties to the Remote Control API and create a Remote Control Preset. Refer to the following documentation for using these exposed properties in a live environment:

- Remote Control Web Application (-> remote-control-web-application-for-unreal-engine)

- Remote Control Protocols (-> remote-control-protocols-in-unreal-engine)

- beta
- optimization
- remote control

On this page

- Prerequisites (-> getting-started-with-remote-control-presets-in-unreal-engine)
- Exposing Properties to the Remote Control Panel and Remote Control API (-> getting-started-with-remote-control-presets-in-unreal-engine)
- Exposing Properties and Functions via Blueprint Library (-> getting-started-with-remote-control-presets-in-unreal-engine)
- Next Steps (-> getting-started-with-remote-control-presets-in-unreal-engine)

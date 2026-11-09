# Widget Reflector

https://dev.epicgames.com/documentation/en-us/unreal-engine/using-the-slate-widget-reflector-in-unreal-engine?application_version=5.9

> An overview of Widget Reflector, a tool that enables developers to identify and debug Slate widgets.

[image: Widget Reflector]

The Unreal Editor's UI was built using the Slate UI framework (-> slate-user-interface-programming-framework-for-unreal-engine), and the **Widget Reflector** tool enables developers to identify the Slate API being used to render the different Widgets for the toolset.

Widget Reflector running in Unreal Editor.

Widget Reflector is built-into the editor by default, and if you are a developer wanting to optimize and debug your project's UI, keep reading to get started.

## Get Started

To open Widget Reflector while the editor is running, select **Tools** > **Debug** > **Widget Reflector**. Alternatively, type Ctrl+Shift+W or enter WidgetReflector into the console to open the tool.

Widget Reflector is available in the editor and as a standalone application.

## User Interface

When using the tool for the first time, the following interface is displayed.

Click for full image.

| Area | Description |
| --- | --- |
| **1** | The main menu area, featuring demo modes, atlases, and windows. |
| **2** | The application scale and Slate Debug Options area. |
| **3** | The Widget Hierarchy area enables users to visualize Widget hierarchies, foreground visibility, and focus, clipping, source, and address information. Additionally, users can take and load snapshots of their Unreal application from here. |
| **4** | The tab menu area, which enables users to visualize and debug snapshot Widgets, Widget Events, and Hit Test Grids. |
| **5** | The Widget Details area. |

### Demo Mode

| Demo Mode Options | Usage |
| --- | --- |
| **Mouse Click** | Enabling this option allows users to demonstrate mouse click events, ideal for visualizing cursor events for demonstrations or recording presentations. |
| **Key** | Enabling this option allows users to demonstrate keypress events, ideal for visualizing key presses for demonstration or recording presentations. |

### Atlases

| Atlases Options | Usage |
| --- | --- |
| **Display Texture Atlases** | Selecting this option opens a NxN atlas of textures. |
| **Display Font Atlases** | Selecting this option opens a NxN atlas of fonts. |

#### Texture Atlas

#### Font Atlas

### Window

| Window Options | Usage |
| --- | --- |
| **Slate Debug Options** | The Slate Debug Options enable users to adjust the Application Scale, and to toggle Widget Caching, Invalidation Debugging, Invalidation Root Debugging, Update Debugging, Paint Debugging, Show Clipping, and Debug Culling flags. To learn more about these flags, read the Console Slate Debugger. |
| **Widget Hierarchy** | The Widget Hierarchy displays the parents and children of widgets, including whether those widgets are visible or in focus. Users can also Pick Hit-Testable widgets, enable UMG root as a hierarchy filter, take or load snapshots of the application's UI, and if available, point to the Slate source code for the widget. |
| **Sanpshot Widget Picker** | After taking a snapshot from the Widget Hierarchy area, the application's UI snapshot displays in the Snapshot Widget Picker tab. |
| **Widget Details** | When available, additional widget details appear in this area. Users may optionally dock other menus in this area. |
| **Widget Events** | Filtered events, such as focus, input, navigation, bab, warnings, or mouse capture events appear in the Widget Events area. |
| **Hit Test Grid** | When debugging hit tests, navigation and event information will appear in the Hit Test Grid tab. |

## Application Scale

To change your application's scale for presentations, screenshots, or debugging purposes, either enter a new value or use the slider belonging to Widget Reflector's **Application Scale**.

Adjusting the application's scale.

## Flags

Adjusting the application's scale.

To begin debugging your application's UI, set any of the following **Flags**.

- Invalidation Debugging

- Invalidation Root Debugging

- Update Debugging

- Paint Debugging

To learn more about the previously mentioned flags, read the Slate Debugger Console Reference.

### Show Clipping

The **Show Clipping** flag displays how a widget was clipped. For example, this flag is useful for identifying when a big widget is clipped by a smaller panel.

### Debug Culling

**Debug Culling** provides a way for developers to debug when a widget is culled by another widget, such as a panel.

### Widget Caching

The InvalidationBox caching system enables **Widget Caching**, and it is always disabled when in GlobalInvalidation mode.

## Widget Hierarchy

To inspect hierarchical information about your widgets, you can either **Pick Painted Widgets**, **Pick Hit-Testable Widgets**, or **Show Focus** widgets.

### Pick Painted Widgets

To Pick Painted Widgets, perform the following steps:

- From the Widget Hierarchy area, select **Pick Painted Widgets**.

- Move the mouse cursor over your application's UI until you find the widget you want to inspect.

- Hit the escape key to mantain focus on the widget you want to inspect.

From the Widget Hierarchy area, you can inspect the following properties.

To display available properties, right-click the **Property** header.

| Property | Description |
| --- | --- |
| **Widget Name** | This is the widget's name, and it can reveal if you or one of your UI developers named a widget incorrectly. |
| **FG Visibility** | Foreground (FG) visibility is used to help determine if a widget should be visible in the foreground or not. |
| **Focus?** | This is useful to help determine if a widget should be in focus. |
| **Clipping** | This property helps identify if a widget is being clipped. |
| **Source** | This is a link to the source code, and it is the location where the widget was creative. When your application is connected to an IDE (such as a C++ debugger), you can click the hyperlink to open the file at the correct location. |
| **Address** | Knowing a widget's address is useful when setting a conditional breakpoint in the C++ debugger. |

### Hit Test Grid

The Hit Test Grid is useful for developers wanting to visualize and inspect a widget's hitbox. To use this feature, perform the following steps.

- Select **Pick Hit-Testable Widgets**.

- Hover the mouse cursor over the widget you want to hit, and press the ESC key to retain focus over the widget.

In addition to the available options in the Hit Test Grid feature, the following flags may be set.

| Flag | Description |
| --- | --- |
| **Visualize on Navigation** | This setting is only available when performing a Snapshot, and it enables the Hit Test Grid feature to pick the widget inside the Widget Reflector. |
| **Reject Widget Reflector navigation events** | This setting tells the Hit Test Grid feature to reject navigation events originating from the Widget Reflector. |

### Show Focus

If you want to show the widget that has focus, perform these steps:

- Select **Show Focus**.

- Select the widget with your mouse cursor, and press the ESC key to retain focus over the widget.

## Snapshot Widget Picker

**Snapshot Widget Picker** saves an image and the current state of all widgets in the application. To take a snapshot of the application's UI, perform the following steps.

- In the Widget Hierarchy area, click **Options**.

- Enable **Navigation Event Simulation**. This option enables developers to simulate navigation events for widgets captured by the snapshot. Also, this setting is optional, and it should only be enabled when necessary.

- Select the application to snapshot.

- Click **Take Snapshot**.

From here, users can use Hit Test Grid from the snapshot, and the result will display in the Widget Hierarchy panel. The snapshot saves the state of the application's UI to help developers identify bugs that need to be fixed. Additionally, developers can debug your UI and simulate your application's navigation events from the Snapshot area.

Snapshots can only be taken from the editor's PIE mode and from a Standalone application.

## Widget Events

The Widget Events system flushes messages to an output log in the Widget Reflector while the user navigates over the UI.

- ui
- slate
- widget reflector

On this page

- Get Started (-> using-the-slate-widget-reflector-in-unreal-engine)
- User Interface (-> using-the-slate-widget-reflector-in-unreal-engine)
- Demo Mode (-> using-the-slate-widget-reflector-in-unreal-engine)
- Atlases (-> using-the-slate-widget-reflector-in-unreal-engine)
- Texture Atlas (-> using-the-slate-widget-reflector-in-unreal-engine)
- Font Atlas (-> using-the-slate-widget-reflector-in-unreal-engine)
- Window (-> using-the-slate-widget-reflector-in-unreal-engine)
- Application Scale (-> using-the-slate-widget-reflector-in-unreal-engine)
- Flags (-> using-the-slate-widget-reflector-in-unreal-engine)
- Show Clipping (-> using-the-slate-widget-reflector-in-unreal-engine)
- Debug Culling (-> using-the-slate-widget-reflector-in-unreal-engine)
- Widget Caching (-> using-the-slate-widget-reflector-in-unreal-engine)
- Widget Hierarchy (-> using-the-slate-widget-reflector-in-unreal-engine)
- Pick Painted Widgets (-> using-the-slate-widget-reflector-in-unreal-engine)
- Hit Test Grid (-> using-the-slate-widget-reflector-in-unreal-engine)
- Show Focus (-> using-the-slate-widget-reflector-in-unreal-engine)
- Snapshot Widget Picker (-> using-the-slate-widget-reflector-in-unreal-engine)
- Widget Events (-> using-the-slate-widget-reflector-in-unreal-engine)

Related documents

Widget Type Reference

 [image: Widget Type Reference] (-> widget-type-reference-for-umg-ui-designer-in-unreal-engine)

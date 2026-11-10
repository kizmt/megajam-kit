# Niagara Script Editor Reference

https://dev.epicgames.com/documentation/en-us/unreal-engine/script-editor-reference-for-niagara-effects-in-unreal-engine?application_version=5.9

> This page describes the user interface (UI) of the Niagara Script Editor.

[image: Niagara Script Editor Reference]

## Overview

You can use the **Niagara Script Editor** to create new modules, dynamic inputs, or other scripts to use in Niagara systems and emitters. You can open the Script Editor by double-clicking in the header of any module. This document describes the user interface (UI) of the Script Editor, broken down into the following parts.

Click image for full size.

- Menu Bar

- Toolbar

- Script Details Panel

- Parameters Panel

- Stats Panel

- Node Graph

- Niagara Message Log Panel

- Selected Details Panel

## Menu Bar

 [image: Menu Bar]

The tables below only describe commands that apply to the Niagara Editor itself; there may be additional commands displayed in those menus that open asset editors or other parts of the Unreal Editor.

### File

| Command | Description |
| --- | --- |
| **Save** | Saves the current emitter. |
| **Save As** | Saves the current emitter under a different name. |
| **Open Asset** | Displays a window to select other assets. |
| **Save All** | Saves all assets and levels in this project. |
| **Choose Files to Save** | Displays a dialog with options for saving assets and levels. |
| **Connect to Source Control** | Displays a dialog where you can connect to source control, allowing source control functions to be performed on content. |

### Edit

| Command | Description |
| --- | --- |
| **Undo** | Undoes the last action. |
| **Redo** | Redoes an action that was undone. |
| **Undo History** | Displays a dialog listing all undo actions. |

### Asset

| Command | Description |
| --- | --- |
| **Find in Content Browser** | Switches to most recently used Content Browser, and selects the current asset in that Content Browser. |
| **Reference Viewer** | Displays a dialog that shows all of the current asset's references. |
| **Size Map** | Displays an interactive map showing the approximate size of the asset and everything it references. |
| **Audit Assets** | Opens the Asset Audit UI and displays information about the selected assets. |
| **Shader Cook Statistics** | Displays statistics for the shader cook process. |

### Window

| Command | Description |
| --- | --- |
| **Toolbar** | Shows or hides the Toolbar. |
| **Node Graph** | Shows or hides the Node Graph. |
| **Script Details** | Shows or hides the Script Details panel. |
| **Selected Details** | Shows or hides the Selected Details panel. |
| **System Details** | Shows or hides the System Details panel. |
| **Parameters** | Shows or hides the Parameters panel. |
| **Stats** | Shows or hides the Stats panel. |
| **Niagara Message Log** | Shows or hides the Niagara Message Log panel. |

## Toolbar

 [image: Script Editor Toolbar]

| Tool Name | Description |
| --- | --- |
| **Save** [image: Save Icon] | Saves the current script. |
| **Browse** [image: Browse Icon] | Switches to the most recent Content Browser and selects the current Asset. |
| **Apply** [image: Apply Icon] | Applies unsaved changes to the current Asset. |
| **Compile** [image: Compile Icon] | Compiles all changes made to the script. |
| **Refresh** [image: Refresh Icon] | Refreshes panels to correctly depict dependencies. |

## Script Details Panel

Click image for full size.

| Setting | Description |
| --- | --- |
| **Module Usage Bitmask** | Use this dropdown to select the kinds of scripts that are appropriate to reference this module. You can select more than one. |
| **Category** | Use this field to indicate what category this module or script will be listed under when the user opens the add menu. Click the small downward arrow to display advanced text settings for this text field. |
| **Provided Dependencies** | Use this to create an array of the IDs of any dependencies this module provides to other modules. Add elements to the array by clicking the **Plus sign** icon (**+**). |
| **Required Dependencies** | This array contains dependencies this module requires from other modules in the stack. Each array element contains four members: **ID**: This is the unique ID of the required dependent module. **Type**: This indicates whether the dependency belongs before or after this module. **Script Constraints**: Specifies constraints related to the source script for modules providing dependencies. **Description**: Enter a description of the required dependency. Click the small downward arrow to display advanced text settings for this text field. |
| **Deprecated** | This box is checked if the module is no longer used. Enabling this setting activates the next two settings. If this box is unchecked, the next two settings are unavailable. |
| **Deprecation Message** | Enter the message you want displayed when this module is deprecated. Click the small downward arrow to display advanced text settings for this text field. |
| **Deprecation Recommendation** | This is the module you want to recommend in place of the deprecated module. Click the dropdown to select the recommended module. |
| **Conversion Utility** | Use this to write or select custom logic to convert the contents of an existing script assignment to this script. |
| **Experimental** | Check this box to label this module as experimental (and therefore less supported). If this box is checked, the next setting becomes active; if left unchecked the next setting is unavailable. |
| **Experimental Message** | If this module is experimental, you can use this setting to enter a message you want displayed when the module is selected. Click the small downward arrow to display advanced text settings for this text field. |
| **Expose to Library** | Check this box to expose this module to the library. |
| **Description** | Use this to enter a description for this module. Click the small downward arrow to display advanced text settings for this text field. |
| **Keywords** | This is a text field where you can enter a list of space-separated keywords that can be used to find this module in editor menus. |
| **Highlights** | Use this to choose which color-coded icons appear in the module when it is displayed in the System Overview. The list is structured as an array. You can add to the array by clicking the **Plus sign** icon (**+**). |
| **Script Metadata** | Use this to create maps, which are associative, unordered containers that pair a set of keys with a set of values. |
| **Input Parameters** | This lists the input parameters included in this script. You can add parameters by clicking the **Plus sign** icon (**+**). |
| **Output Parameters** | This lists the output parameters included in this script. You can add parameters by clicking the **Plus sign** icon (**+**). |

## Parameters Panel

This panel lists all the parameters that are used by the module you are editing. When you are building your script, you can drag and drop parameters from this panel into the Node Graph. The following table lists the categories, along with a description of that category. You can click the **Plus sign** (**+**) icon to display a menu of parameters to add to that category. You can also drag and drop parameters from this panel into the Graph while you are building a script.

| Parameter Category | Description |
| --- | --- |
| **System Attributes** | Persistent attributes that are written in the System stage, and can be read anywhere. |
| **Emitter Attributes** | Persistent attributes that are written in the Emitter stage, and can be read in the Emitter and Particle stages. |
| **Particle Attributes** | Persistent attributes that are written in the Particle stage, and can be read in Particle stages. |
| **Module Inputs** | Values that expose a module input to the System and Emitter Editor. |
| **Static Switch** | Values that can only be set at edit time. |
| **Modules Locals** | Transient values that can be written to and read from within a single module. Transient values do not persist from frame to frame, or between stages. |
| **Engine Provided** | Read-only values that are provided by the Engine. The source of these values can be the simulation itself, or the owner of the simulation. |
|  |  |

## Stats Panel

 [image: Stats Panel]

## Node Graph

Similar to other types of Node Graphs used in UE4, this is a visual representation of the HLSL script you are building. You can right-click anywhere in the Graph to open a menu of nodes to choose from. You can also drag off an input or output on one of the existing nodes to open the same menu.

## Niagara Message Log Panel

 [image: Message Log Panel]

If there are any warnings or errors that occur when you compile your script, they will appear here.

## Selected Details Panel

This panel displays details about a specific node that you have selected in the Node Graph.

Not all selected nodes will have information displayed in this panel.

- effects
- vfx
- niagara
- visual effects
- particle effects
- script editor

On this page

- Overview (-> script-editor-reference-for-niagara-effects-in-unreal-engine)
- Menu Bar (-> script-editor-reference-for-niagara-effects-in-unreal-engine)
- File (-> script-editor-reference-for-niagara-effects-in-unreal-engine)
- Edit (-> script-editor-reference-for-niagara-effects-in-unreal-engine)
- Asset (-> script-editor-reference-for-niagara-effects-in-unreal-engine)
- Window (-> script-editor-reference-for-niagara-effects-in-unreal-engine)
- Toolbar (-> script-editor-reference-for-niagara-effects-in-unreal-engine)
- Script Details Panel (-> script-editor-reference-for-niagara-effects-in-unreal-engine)
- Parameters Panel (-> script-editor-reference-for-niagara-effects-in-unreal-engine)
- Stats Panel (-> script-editor-reference-for-niagara-effects-in-unreal-engine)
- Node Graph (-> script-editor-reference-for-niagara-effects-in-unreal-engine)
- Niagara Message Log Panel (-> script-editor-reference-for-niagara-effects-in-unreal-engine)
- Selected Details Panel (-> script-editor-reference-for-niagara-effects-in-unreal-engine)

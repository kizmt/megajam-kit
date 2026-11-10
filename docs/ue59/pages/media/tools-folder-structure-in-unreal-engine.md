# Tools Folder Structure

https://dev.epicgames.com/documentation/en-us/unreal-engine/tools-folder-structure-in-unreal-engine?application_version=5.9

> A reference guide for organizing your In-Camera VFX project's Tools files in the Content Browser.

[image: Tools Folder Structure]

[image: The recommended Tools folder structure in the Content Browser]

The **Tools** folder contains custom Blueprints (-> blueprints-visual-scripting-in-unreal-engine) and widgets, Level Snapshot (-> level-snapshots-in-unreal-engine) Filters and Presets, and Remote Control (-> remote-control-for-unreal-engine) Presets. The following list describes each tool.

- Blueprint Tool A: Separate folder per-Stage blueprint used, containing it's source:BP_Tool or WBP_WidgetTool — The principle Blueprint.
- Enums - Related enumerations used in the Blueprint.E_(Description)

- Structs - Related structures used in the Blueprint.F_(Description)

- SubBlueprints - Only present if any sub-blueprints are used.BP_(Description)

- SubWidgets - Only present if any sub-widget blueprints are used.WBP_(Description)

- Remote Control: Remote control presets usedRCP_(Description)

- Common

[image: A diagram of the recommended Tools folder structure] A diagram showing the recommended tools folder structure for your project in the Content Browser.

- content browser
- blueprints
- remote control
- icvfx
- level snapshots
- virtual sets

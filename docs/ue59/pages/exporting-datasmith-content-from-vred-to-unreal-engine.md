# Exporting Datasmith Content from VRED

https://dev.epicgames.com/documentation/en-us/unreal-engine/exporting-datasmith-content-from-vred-to-unreal-engine?application_version=5.9

> Describes how to install the export plugin script for Autodesk VRED, and how to export your VRED scene to an FBX that Datasmith can import into Unreal.

[image: Exporting Datasmith Content from VRED]

## Installing the Exporter Plugin Script

Before you can get started working with your VRED content in the Unreal Engine, you need to install a plugin script for VRED.

To see what versions of VRED Professional the exporter plugin currently supports, see .

Follow the steps below to install the Datasmith exporter plugin script for any supported version of VRED that you have installed on your computer.

- In your Unreal Engine installation folder, find the `Engine/Plugins/Enterprise/DatasmithFBXImporter/Resources/VREDPlugin` folder.

- Copy this folder, along with all of its contents, to a location that your VRED installation searches for plugins. For example, on Windows platforms this may be `C:\Users[username]\Documents\Autodesk\VRED-[internalVersion]\ScriptPlugins`, where `[username]` is your Windows user ID, and `[InternalVersion]` represents the version of VRED you have installed. For complete details on how to find this path, see VRED documentation on creating, editing, and using scripts. You can also use the VRED Terminal window to help you find this path. Open the Terminal by selecting **View > Terminal** from the main menu, then look for lines that begin with the text: **Looking for script plugins in**. For example: [image: VRED terminal window]

- Restart VRED.

## Exporting to Datasmith

When you have your VRED scene the way you want it, and you've registered your variants, export the scene to FBX:

- From the main menu in VRED, choose: **File > Export > Export to Datasmith...** (for VRED 2018)

- **File > Export Scene Data > Export to Datasmith...** (for VRED 2019) [image: Datasmith export from VRED]

- Browse to a folder and choose a file name.

The exporter creates a `.FBX` file in the location you choose.

### End Result

You should now be ready to try importing your new `.FBX` file into the Unreal Editor. See Importing Datasmith Content into Unreal Engine (-> importing-datasmith-content-into-unreal-engine).

The exporter also creates additional files next to the `.FBX`:

- A `.lights` file that contains additional information about the lights in your scene.

- A `.var` file that contains information about your registered variants.

- A `.clips` file that contains the animations.

- A `.mats` file that contains additional information about materials.

These files contain information required by the Datasmith importer. If you move your `.FBX` file to a new location, make sure to keep these additional files at the same relative path.

- datasmith
- enterprise
- vred

On this page

- Installing the Exporter Plugin Script (-> exporting-datasmith-content-from-vred-to-unreal-engine)
- Exporting to Datasmith (-> exporting-datasmith-content-from-vred-to-unreal-engine)
- End Result (-> exporting-datasmith-content-from-vred-to-unreal-engine)

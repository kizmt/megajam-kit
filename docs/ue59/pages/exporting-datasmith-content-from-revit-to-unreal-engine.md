# Exporting Datasmith Content from Revit

https://dev.epicgames.com/documentation/en-us/unreal-engine/exporting-datasmith-content-from-revit-to-unreal-engine?application_version=5.9

> Describes how to export a Revit scene into a Datasmith file that you can then import into the Unreal Editor.

[image: Exporting Datasmith Content from Revit]

Learn to use this **Beta** feature, but use caution when shipping with it.

Once you've installed the Datasmith Exporter plugin for Revit, you'll have a **Datasmith** ribbon that you can use to export a selected 3D view to a `.udatasmith` file.

 [image: Datasmith ribbon in Revit]

Follow the steps below in Revit to export your scene using this file type.

- In the **Project Browser**, select and open the 3D View that you want to export. [image: Select a 3D View] The Datasmith Exporter plugin uses the visibility settings defined for the current 3D View to determine what parts of the scene it should export. For details, see Revit (-> using-datasmith-with-revit-in-unreal-engine).

- Open the **Datasmith** ribbon, then click **Export 3D View**. [image: Export 3D View button on the Datasmith toolbar]

- In the **Export 3D View to Unreal Datasmith** window, browse to the location you want to save your .udatasmith file, and use the **File Name box** to give your new file a name. [image: Set the location and file name]

- Click **Save**.

### End Result

You should now be ready to try importing your new `.udatasmith` file into the Unreal Editor. See Importing Datasmith Content into Unreal Engine (-> importing-datasmith-content-into-unreal-engine) and Reimporting Datasmith Content (-> reimporting-datasmith-content-into-unreal-engine).

Along with your new `.udatasmith` file, you'll see a folder that has the same name but with the suffix `_Assets`. If you move your `.udatasmith` file to a new location, make sure that you also move this folder to the same location.

- beta
- datasmith
- revit

On this page

- End Result (-> exporting-datasmith-content-from-revit-to-unreal-engine)

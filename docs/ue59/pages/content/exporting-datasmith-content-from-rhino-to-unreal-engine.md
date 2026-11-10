# Exporting Datasmith Content from Rhino

https://dev.epicgames.com/documentation/en-us/unreal-engine/exporting-datasmith-content-from-rhino-to-unreal-engine?application_version=5.9

> How to export Datasmith content for Rhino

[image: Exporting Datasmith Content from Rhino]

Once you install the Datasmith Exporter Plugin for Rhino, you have an **Unreal Datasmith ** (`.udatasmith`) filetype available to you when you save or export a scene.

 [image: New Rhino export option]

Follow the steps below in Rhino to export your scene using this new filetype.

From the Rhino **File** menu, select either one of the following options:

 [image: Rhino export menu]

- **Save As**: A `.udatasmith` file is created containing all visible elements.

- **Export Selected** : A `.udatasmith` file is created containing all the selected elements. Layers containing no selected elements are not exported.

- **Export with Origin** : A `.udatasmith` file is created containing all visible elements. The scene exports with the specified position offset.

In the **Export** window, select the **Unreal Datasmith **(`.udatasmith`) option from the **Save As type** dropdown.

 [image: Rhino export filetypes]

Browse to the location where you want to save your exported file, set the **File name**, and click **Save**.

Alternatively, click the **Export 3D View** button on the Datasmith Toolbar. This creates a `.udatasmith` file containing all visible elements.

 [image: Datasmith toolbar Export 3D View button]

For more information about the Datasmith toolbar, see Using the Datasmith Toolbar (-> using-datasmith-with-rhino-in-unreal-engine).

## End Result

Your `.udatasmith` file should now be ready to try importing into Unreal Engine 4. See Importing Datasmith Content into Unreal Engine (-> importing-datasmith-content-into-unreal-engine). If your data needs additional cleaning, merging, or other modifications during the import process, see Dataprep Import Customization (-> dataprep-import-customization-in-unreal-engine).

- datasmith
- enterprise

On this page

- End Result (-> exporting-datasmith-content-from-rhino-to-unreal-engine)

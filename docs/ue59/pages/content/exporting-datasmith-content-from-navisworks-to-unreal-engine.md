# Exporting Datasmith Content from Navisworks

https://dev.epicgames.com/documentation/en-us/unreal-engine/exporting-datasmith-content-from-navisworks-to-unreal-engine?application_version=5.9

> How to Export Datasmith Content from Autodesk Navisworks

[image: Exporting Datasmith Content from Navisworks]

## Exporting From the Ribbon Menu

Once you installed the **Datasmith Exporter Plugin for Navisworks**, you will have an **Unreal Datasmith** tab added to the ribbon menu at the top of the screen:

 [image: Unreal Datasmith tab added to the ribbon menu]

Once you have hidden the elements that you do not want to export, follow the steps below to export your scene for Datasmith using the (`*.udatasmith`) filetype:

From the ribbon menu, click the Datasmith Export button to open the export panel:

 [image: Datasmith exporter dialog box inside Navisworks]

| Name | Description |
| --- | --- |
| Merge | Allows you to select the level of an object's tree at which elements are merged to create static meshes. See Navisworks (-> using-datasmith-with-navisworks-in-unreal-engine) for more information. |
| Origin | Specify the origin point for the scene. This will become 0,0,0 inside Unreal. |

Set the level of object merging and the origin point in the Export panel and then click the **Export** button.

 [image: Saving the file]

Browse to the location where you want to save your exported file, set the File name, and click Save.

## Exporting With a Python Script

You can use a Python script to bulk export Datasmith content from Naviswork. You can try the example

```

        import sys

        import clr

        # Add location of Navisworks assembly dlls
        sys.path.append(r'C:\Program Files\Autodesk\Navisworks Manage 2022')

        # Add Navisworks assemblies
        clr.AddReference('Autodesk.Navisworks.Api')
        clr.AddReference('Autodesk.Navisworks.Automation')

        from Autodesk.Navisworks.Api import *
        from Autodesk.Navisworks.Api.Automation import *

        navisworks_app = NavisworksApplication()  # Create an app instance

        try:
            source_fpath = r'C:\Program Files\Autodesk\Navisworks Manage 2022\Samples\snowmobile.nwd'

            navisworks_app.OpenFile(source_fpath, [])

            print(f'Exporting {source_fpath}...', end='')
            if 0 == navisworks_app.ExecuteAddInPlugin('DatasmithNavisworksExporter.EpicGames', [
                r'C:\temp\test.udatasmith',
                'Merge=8',  # merge hierarchies up to depth 8
                'Origin=10, 20.0, 300.0',  # origin location
                'Hello=world',  # invalid option
            ]):
                print("DONE")
            else:
                print("FAILED")
        finally:
            navisworks_app.Dispose()  # Exit app
            # You can also keep open (e.g. if you need to review app console output for debugging)
            # navisworks_app.StayOpen()
```

import sys

 import clr

 # Add location of Navisworks assembly dlls
 sys.path.append(r'C:\Program Files\Autodesk\Navisworks Manage 2022')

 # Add Navisworks assemblies
 clr.AddReference('Autodesk.Navisworks.Api')
 clr.AddReference('Autodesk.Navisworks.Automation')

 from Autodesk.Navisworks.Api import *
 from Autodesk.Navisworks.Api.Automation import *

 navisworks_app = NavisworksApplication() # Create an app instance

 try:
 source_fpath = r'C:\Program Files\Autodesk\Navisworks Manage 2022\Samples\snowmobile.nwd'

 navisworks_app.OpenFile(source_fpath, [])

 print(f'Exporting {source_fpath}...', end='')
 if 0 == navisworks_app.ExecuteAddInPlugin('DatasmithNavisworksExporter.EpicGames', [
 r'C:\temp\test.udatasmith',
 'Merge=8', # merge hierarchies up to depth 8
 'Origin=10, 20.0, 300.0', # origin location
 'Hello=world', # invalid option
 ]):
 print("DONE")
 else:
 print("FAILED")
 finally:
 navisworks_app.Dispose() # Exit app
 # You can also keep open (e.g. if you need to review app console output for debugging)
 # navisworks_app.StayOpen()

## End Result

Your `.udatasmith` file should now be ready to try importing into Unreal. See Importing Datasmith Content into Unreal Engine (-> importing-datasmith-content-into-unreal-engine). If your data needs additional cleaning, merging, or other modifications during the import process, see Dataprep Import Customization (-> dataprep-import-customization-in-unreal-engine).

- datasmith
- enterprise
- navisworks
- how-to

On this page

- Exporting From the Ribbon Menu (-> exporting-datasmith-content-from-navisworks-to-unreal-engine)
- Exporting With a Python Script (-> exporting-datasmith-content-from-navisworks-to-unreal-engine)
- End Result (-> exporting-datasmith-content-from-navisworks-to-unreal-engine)

Related documents

Datasmith Import Process

 [image: Datasmith Import Process] (-> datasmith-import-process-in-unreal-engine)

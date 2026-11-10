# Importing Skeletal Meshes Using FBX

https://dev.epicgames.com/documentation/en-us/unreal-engine/importing-skeletal-meshes-using-fbx-in-unreal-engine?application_version=5.9

> Learn how to import skeletal meshes.

[image: Importing Skeletal Meshes Using FBX]

Windows
 macOS
 Linux

We can import static meshes into Unreal Engine from external 3D modeling applications, such as **3DS Max**, **Maya** or **Blender**. Although we're using 3DS Max and Maya to illustrate this lesson's goal, you can import **skeletal meshes** into Unreal Engine from any 3D modeling application with a save feature.

Before getting started: Please make sure you have access to a 3D modeling application.

## Goals

The focus of this guide is to you how to import skeletal meshes from external 3D modeling applications.

## Objectives

After going through this guide, you'll know:

- How to export skeletal meshes from external 3D modeling applications.

- How to import skeletal meshes into Unreal Editor.

- How to verify that skeletal meshes were imported properly.

The Unreal Engine FBX import pipeline uses **FBX 2020.2**. Using a different version during export may result in incompatibilities.

Autodesk Maya
 Autodesk 3ds Max

## Exporting Skeletal Meshes from External 3D Modeling Applications

Skeletal meshes can be exported individually or multiple meshes can be exported to a single FBX file. The import pipeline will separate multiple Skeletal Meshes into multiple assets within the destination package.

- Select the mesh(es) and joints to be exported in the viewport. [image: meshAndJointsSel.png]

- In the File menu choose Export Selection (or Export All if you want to export everything in the scene regardless of selection). [image: maya_export_2.jpg]

- Choose the location and name for the FBX file to export the mesh(es) to and set the appropriate options in the **FBX Export** dialog and then click the [image: maya_export_button.jpg] button to create the FBX file containing the mesh(es). [image: maya_export_3.jpg]

- Select the mesh(es) and bones to be exported in the viewport. [image: max_export_1.png]

- In the File menu, choose Export Selected (or Export All if you want to export everything in the scene regardless of selection). [image: max_export_2.jpg]

- Choose the location and name for the FBX file to export the mesh(es) to and click the [image: max_save_button.jpg] button. [image: max_export_3.jpg]

- Set the appropriate options in the **FBX Export** dialog and then click the [image: max_ok_button.jpg] button to create the FBX file containing the mesh(es). [image: max_export_4.jpg]

## Importing Skeletal Meshes

- In the **Content Browser**, click the **Import** button.

- Locate and select the FBX file you want to import.

- Click **Open** to begin importing the FBX file you want to import to your project.

- Update the appropriate settings in the **FBX Import Options** dialog. Default settings should be sufficient when importing a mesh that doesn't share an existing skeleton. Refer to our FBX Import Options Reference (-> fbx-import-options-reference-in-unreal-engine) for detailed information on all of the settings. There are two import buttons available to us in the FBX Importer. The first option we have is the Import button, allowing us to import the currently selected FBX file with our specified settings. The second option we have is the Import All button, allowing us to import all of the currently selected FBX files with our specified settings. For more information on the settings available to us in the FBX Importer, go to the FBX Import Options Reference (-> fbx-import-options-reference-in-unreal-engine) page.

- Clicking **Import** or **Import All** adds your meshes to the project. If the **Skeletal Mesh** being imported shares an existing skeleton, click the **Select Skeleton** dropdown menu and select the skeleton asset from the list.

- The imported mesh appears inside the **Content Browser** if the process succeeded.

## Verifying Imported Skeletal Meshes

Double-click the imported mesh to view it in **Persona**.

Verify that the asset imported properly by viewing it in **Persona**.

Now that we've reached the end of this guide, you've learned:

✓ How to export skeletal meshed from external 3D modeling applications.

✓ How to import skeletal meshes into Unreal Editor.

✓ How to verify that skeletal meshes were imported properly.

- import
- skeletal mesh

On this page

- Goals (-> importing-skeletal-meshes-using-fbx-in-unreal-engine)
- Objectives (-> importing-skeletal-meshes-using-fbx-in-unreal-engine)
- Exporting Skeletal Meshes from External 3D Modeling Applications (-> importing-skeletal-meshes-using-fbx-in-unreal-engine)
- Importing Skeletal Meshes (-> importing-skeletal-meshes-using-fbx-in-unreal-engine)
- Verifying Imported Skeletal Meshes (-> importing-skeletal-meshes-using-fbx-in-unreal-engine)

Related documents

FBX Import Options Reference

 [image: FBX Import Options Reference] (-> fbx-import-options-reference-in-unreal-engine)FBX Skeletal Mesh Pipeline

 [image: FBX Skeletal Mesh Pipeline] (-> fbx-skeletal-mesh-pipeline-in-unreal-engine)

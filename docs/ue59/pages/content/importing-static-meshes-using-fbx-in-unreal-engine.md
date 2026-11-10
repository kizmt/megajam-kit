# Importing Static Meshes Using FBX

https://dev.epicgames.com/documentation/en-us/unreal-engine/importing-static-meshes-using-fbx-in-unreal-engine?application_version=5.9

> Learn how to import static meshes.

Windows
 macOS
 Linux

We can import static meshes into Unreal Engine from external 3D modeling applications, such as **3DS Max**, **Maya** or **Blender**. Although we're using 3DS Max and Maya to illustrate this lesson's goal, you can import **static meshes** into Unreal Engine from any 3D modeling application with a save feature.

Before getting started: Please make sure you have access to a 3D modeling application.

## Goals

The focus of this guide is to show you how to import static meshes from external 3D modeling applications.

## Objectives

After going through this guide, you'll know:

- How to import static meshes into Unreal Editor from external 3D modeling applications.

- How to verify that static meshes were imported properly.

The Unreal Engine FBX import pipeline uses **FBX 2020.2**. Using a different version during export may result in incompatibilities.

Autodesk Maya
 Autodesk 3ds Max

## Importing Static Meshes from External 3D Modeling Applications

- Select the mesh(es) and joints to be exported in the viewport. [image: meshAndJointsSel.png]

- In the File menu choose Export Selection (or Export All if you want to export everything in the scene regardless of selection). [image: maya_export_2.jpg]

- Choose the location and name for the FBX file to export the mesh(es) to and set the appropriate options in the **FBX Export** dialog and then click the [image: maya_export_button.jpg] button to create the FBX file containing the mesh(es). [image: maya_export_3.jpg]

- Select the mesh(es) and bones to be exported in the viewport. [image: max_export_1.png]

- In the File menu, choose Export Selected (or Export All if you want to export everything in the scene regardless of selection). [image: max_export_2.jpg]

- Choose the location and name for the FBX file to export the mesh(es) to and click the [image: max_save_button.jpg] button. [image: max_export_3.jpg]

- Set the appropriate options in the **FBX Export** dialog and then click the [image: max_ok_button.jpg] button to create the FBX file containing the mesh(es). [image: max_export_4.jpg]

## Verifying Imported Static Meshes

Double-click the imported mesh to view it in the **Static Mesh Editor**.

Click image for full size.

Click image for full size.

Verify that the asset imported properly by viewing the imported mesh in the **Static Mesh Editor**.

Now that we've reached the end of this guide, you've learned:

✓ How to import static meshes into Unreal Editor from external 3D modeling applications.

✓ How to verify that static meshes were imported properly.

# Importing Animations Using FBX

https://dev.epicgames.com/documentation/en-us/unreal-engine/importing-animations-using-fbx-in-unreal-engine?application_version=5.9

> Learn how to import animations.

[image: Importing Animations Using FBX]

We can import animations into Unreal Engine from external 3D modeling applications, such as **3DS Max**, **Maya** or **Blender**. Although we're using 3DS Max and Maya to illustrate this lesson's goal, you can import animations into Unreal Engine from any 3D modeling application with a save feature.

Before getting started: Please make sure you have access to a 3D modeling application.

## Goals

The focus of this guide is to show you how to import animations from external 3D modeling programs.

## Objectives

After going through this guide, you'll know:

- How to export animations from external 3D modeling applications.

- How to import animations into Unreal Editor from external 3D modeling applications.

The Unreal Engine FBX import pipeline uses **FBX 2020.2**. Using a different version during export may result in incompatibilities.

Autodesk Maya
 Autodesk 3ds Max

## Exporting Animations

Animations must be exported individually with one animation per skeletal mesh in a single file.

- Select the joints to be exported in the viewport. [image: maya_export_1.jpg]

- In the **File** menu, choose **Export Selection** (or **Export All** if you want to export everything in the scene regardless of selection). [image: maya_export_2.jpg]

- Choose the location and name for the FBX file to export the animation to and set the appropriate options in the **FBX Export** dialog. For the purposes of exporting animations, you must enable the **Animations** checkbox. [image: maya_export_3.jpg]

- Click the [image: maya_export_button.jpg] button to create the FBX file containing the mesh(es).

- Select the bones corresponding to the animation to be exported in the viewport. [image: max_export_1.jpg]

- In the **File** menu, choose **Export Selected** (or **Export All** if you want to export everything in the scene regardless of selection). [image: max_export_2.jpg]

- Choose the location and name for the FBX file to export the animation to and click the [image: max_save_button.jpg] button. [image: max_export_3.jpg]

- Set the appropriate options in the **FBX Export** dialog. For the purposes of exporting animations, you must enable the **Animations** checkbox. [image: max_export_4.jpg]

- Click the [image: max_ok_button.jpg] button to create the FBX file containing the mesh(es).

## Importing Animations

Unreal's FBX animation import pipeline allows content developers to import animations with or without skeletal meshes.

### Importing Animation with Skeletal Mesh

- In the **Content Browser**, click the **Import** button.

- Locate and select the FBX file you want to import.

- Click **Open** to begin importing the FBX file you want to import to your project.

- Update the appropriate settings in the **FBX Import Options** dialog. Default settings should be sufficient when importing a mesh that doesn't share an existing skeleton. When importing LODs, the name of the imported mesh will follow default Naming Conventions (-> fbx-import-options-reference-in-unreal-engine). Refer to our FBX Import Dialog (-> fbx-import-options-reference-in-unreal-engine) documentation for additional information about all of the settings. There are two import buttons available to us in the FBX Importer. The first option we have is the Import button, allowing us to import the currently selected FBX file with our specified settings. The second option we have is the Import All button, allowing us to import all of the currently selected FBX files with our specified settings. For more information on the settings available to us in the FBX Importer, go to the FBX Import Options Reference (-> fbx-import-options-reference-in-unreal-engine) page.

- Clicking **Import** or **Import All** adds your meshes to the project.

- The imported skeletal mesh and animations appear inside the **Content Browser** if the process succeeded. By default, the AnimationSequence created to hold the imported animation is named after the skeleton's root bone.

### Importing Animation without Skeletal Mesh

Unreal allows content creators to import multiple animations in a single FBX file; however, many DCC tools (such as 3ds Max and Maya) do no support the saving of multiple animations to a single file. If you export from supporting applications (such as Motion Builder), Unreal will import all of the animations contained in that file.

Before beginning this section, you'll need an **AnimationSequence** to import the animation into. Animation sequences can be created through the **Content Browser** or directly in the **AnimationSequence Editor**.

- Inside the editor, click the **Import** button.

- Locate and **select** the FBX file you want to import.

- Click **Open** to begin importing the FBX file you want to import to your project.

- Update the appropriate settings in the **FBX Import Options** dialog. Default settings should be sufficient when importing a mesh that doesn't share an existing skeleton. When importing LODs, the name of the imported mesh will follow default naming conventions. Refer to our FBX Import Dialog (-> fbx-import-options-reference-in-unreal-engine) documentation for additional information about all of the settings. You must specify an existing skeleton when importing animations individually.

- The imported skeletal mesh and animations appear inside the **Content Browser** if the process succeeded. By default, the AnimationSequence created to hold the imported animation is named after the skeleton's root bone.

Now that we've reached the end of this guide, you've learned:

✓ How to export animations from external 3D modeling applications.

✓ How to import animations into Unreal Editor from external 3D modeling applications.

- import
- animation

On this page

- Goals (-> importing-animations-using-fbx-in-unreal-engine)
- Objectives (-> importing-animations-using-fbx-in-unreal-engine)
- Exporting Animations (-> importing-animations-using-fbx-in-unreal-engine)
- Importing Animations (-> importing-animations-using-fbx-in-unreal-engine)
- Importing Animation with Skeletal Mesh (-> importing-animations-using-fbx-in-unreal-engine)
- Importing Animation without Skeletal Mesh (-> importing-animations-using-fbx-in-unreal-engine)

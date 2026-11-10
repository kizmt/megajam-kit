# Importing Skeletal Mesh LODs Using FBX

https://dev.epicgames.com/documentation/en-us/unreal-engine/importing-skeletal-mesh-lods-using-fbx-in-unreal-engine?application_version=5.9

> Learn how to import Skeletal Mesh LODs.

Windows
 macOS
 Linux

We can import Skeletal Mesh Levels of Detail (LOD) into Unreal Engine from external 3D modeling applications, such as **3DS Max**, **Maya** or **Blender**. Although we're using 3DS Max and Maya to illustrate this lesson's goal, you can import Skeletal Mesh LODs into Unreal Engine from any 3D modeling application with a save feature.

Before getting started: Please make sure you have access to a 3D modeling application.

## Goals

The focus of this guide is to show you how to import Skeletal Mesh LODs from external 3D modeling programs.

## Objectives

After going through this guide, you'll know:

- How to set-up Skeletal Mesh LODs from external 3D modeling applications.

- How to export Skeletal Mesh LODs from external 3D modeling applications.

- How to import Skeletal Mesh LODs into Unreal Editor from external 3D modeling applications.

The Unreal Engine FBX import pipeline uses **FBX 2020.2**. Using a different version during export may result in incompatibilities.

Autodesk Maya
 Autodesk 3ds Max

## Setting-up Skeletal Mesh LODs

- Select all of the meshes (base plus LODs) in order from the base LOD down to the last LOD. This is important so that they are added in the correct order in terms of complexity. Then select the Level of Detail > Group command from the Edit menu. [image: maya_lod_group.jpg]

- You should now have the meshes all grouped under the LOD Group. [image: maya_lod_contents.jpg]

- Select all of the meshes (base plus LODs - the order is not important) and then select the Group command from the Group menu. [image: max_lod_group.jpg]

- Enter a name for the new group in the dialog that opens and the click the [image: max_lod_ok_button.jpg] button to create the group. [image: max_lod_group_name.jpg]

- Click the [image: max_utilities_button.jpg] button to view the Utilities panel and then choose the Level of Detail utility. **Note:** You may need to click [image: max_utility_more_button.jpg] and select it from the list. [image: max_lod_utility.jpg]

- With the group selected, click the [image: max_lod_create_button.jpg] button to create a new LOD Set and add the meshes in the selected group to it. The meshes will automatically be ordered according to their complexity. [image: max_lod_contents.jpg]

Setting up LODs for **Multi-Part Skeletal Meshes** is almost identical to setting up LODs for a full mesh with the exception that each individual part containing LODs will have an LOD group created for it. The process for setting up those LOD groups is identical to the process outlined above.

## Exporting Skeletal Mesh LODs

- Select the LOD GRoups and the joints to be exported. Follow the same export steps used for the base mesh (described in the Export Mesh from 3D App (-> fbx-skeletal-mesh-pipeline-in-unreal-engine) section).

- Select the group of meshes that comprise the LOD Set and the bones to be exported. Follow the same export steps used for the base mesh (described in the Export Mesh from 3D App (-> fbx-skeletal-mesh-pipeline-in-unreal-engine) section).

## Importing Skeletal Mesh LODs

**Skeletal Mesh LODs** can be imported through the **Mesh Details** panel in **Persona** under **LOD Settings**.

Persona is the animation editing toolset within UE4. Refer to the Animation Editors (-> animation-editors-in-unreal-engine) for additional information.

- To apply an **LOD** to a skeletal mesh, double-click the animation asset from the **Content Browser** to open **Persona** (example sequence pictured below).

- In the **Mesh Details** panel, scroll down to find the **LOD Settings** section and click the **LOD Import** option.

- In the file browser, locate and select the FBX file you want to import.

- The imported LOD is now added to the **Mesh Details** panel.

- Under each LOD, the **Display Factor** setting indicates when to use the LOD. In the example pictured below, LOD0 is used when your position is closer to the **Skeletal Mesh**, whereas LOD1 is used when your position is further away from the **Skeletal Mesh**. Using a small **Display Factor** tells Unreal Engine to use the LOD when your position is further away from the **Skeletal Mesh**. Larger **Display Factors** tell Unreal Engine to use the LOD when your position is closer to the **Skeletal Mesh**.

Now that we've reached the end of this tutorial, you've learned:

✓ How to set-up Skeletal Mesh LODs from external 3D modeling applications.

✓ How to export Skeletal Mesh LODs from external 3D modeling applications.

✓ How to import Skeletal Mesh LODs into Unreal Editor from external 3D modeling applications.

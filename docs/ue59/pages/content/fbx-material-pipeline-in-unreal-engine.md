# FBX Material Pipeline

https://dev.epicgames.com/documentation/en-us/unreal-engine/fbx-material-pipeline-in-unreal-engine?application_version=5.9

> Guide to transferring basic materials and textures with meshes using the FBX content pipeline.

[image: FBX Material Pipeline]

The FBX pipeline transfers materials and textures applied to meshes (both Static Meshes and Skeletal Meshes) from 3D applications into Unreal.
Simple materials can be converted by importing the textures used in source materials, thereby creating materials in Unreal with textures hooked-up
to the appropriate channels and then, finally, applying the materials to the imported meshes. The FBX pipeline streamlines the mesh import process
by automating what used to be a manually intensive process.

The Unreal Engine FBX import pipeline uses **FBX 2020.2**. Using a different version during export may result in incompatibilities.

This page includes information on both **Autodesk Maya** and **Autodesk 3ds Max**. Please choose your preferred content creation tool below.
The tool's relevant information will then be displayed:

Autodesk Maya
 Autodesk 3ds Max

## Material Support

Only basic materials are supported for import with the FBX pipeline. The types of materials that can be transferred are:

 Surface
 Anisotropic
 Blinn
 Lambert
 Phong
 Phone E

 Standard
 Multi/Sub-Object

In addition to these material types, only specific features of those materials can be transferred. The FBX material pipeline does not transfer individual
settings, but it does support the transfer of certain maps or textures used by the materials.

Currently, the supported maps (textures) being imported with the mesh will be added to the material, and some common types will be connected to their default inputs on the material, but some will require manual connections.
 Furthermore, the more uncommon map types may not be imported at all, such as using the Diffuse channel in Maya for Ambient Occlusion.

## Multiple Materials

Meshes can have several materials applied to them, each covering certain faces of the mesh, and the FBX pipeline has the ability to handle the import of meshes with several materials (assuming they have been set up correctly in the 3D application).

Maya is pretty straightforward when it comes to the use of multiple materials on a mesh. You simply select the faces of the mesh you want to have the material applied to and then apply the material.

 [image: mat_mult_maya.jpg]
 [image: mat_mult_maya_result.jpg]

A material will be created in Unreal Editor for each material applied to the mesh in Maya, and the imported mesh will have material slots for each of these materials. When applied to the mesh, the materials will only affect the corresponding polygons of the mesh (just as they did in Maya).

In 3dsMax, multiple materials are handled by the use of a **Multi/Sub-Object** material. Each face of a mesh has a Material ID and each Standard material within the Multi/Sub-Object material is applied to the corresponding Material ID.

 [image: mat_multi_max.jpg]
 [image: mat_multi_max_result.jpg]

A material will be created in Unreal Editor for each of the Standard materials within the Multi/Sub-Object material and the imported mesh will have material slots for each of these materials. When applied to the mesh, the materials will only affect the corresponding polys of the mesh, just as they did in 3dsMax.

## Material Naming

Materials created by Unreal Editor during the import process will be named the same as the source materials in the 3D application. Where the name is pulled from, depends on which application exported the mesh.

Coming from Maya, the material name in Unreal Editor is transferred from the name of the shading engine applied to the mesh in Maya.

 [image: mat_name_maya.jpg]

Coming from 3dsMax, the material name in Unreal Editor is transferred directly from the name of the material applied to the mesh in 3dsMax.

 [image: mat_name_max.jpg]

### Material Ordering

As of 4.14, the `Skin##` naming convention is no longer required to specify Material order.

When Materials are initially imported from an FBX, the Material Name is assigned to the Material Slot, so that when you reimport your FBX, the **Orginal Import Material Name** can be used to match up the
Materials to the correct Element Index. This method is much more consistent than using the `Skin##` naming convention to order your Materials, guaranteeing that the import process looks directly at the
name in the FBX file to determine which sections should match up with the existing Materials already populated in the list. The Slot Name here will match the Material Name drop-down selection in the
Level of Detail (LOD) sections of your meshes.

If you hover over the text for **Slot Name**, the tooltip will list the name of the Material that was imported. Any Static Meshes or Skeletal Meshes that were imported prior to 4.14 will be given a Material Name of `None` in the tooltip.

#### Adding or Removing Material Slots

To add or remove any Material Slots, use the **add** (**+**) button at the top of the Materials list, and the **remove** (**x**) button next to the Slot Name. Added Slots can be used to override the lower LOD sections, but not the base LOD.

|  |  |
| --- | --- |
|  |  |
| Add (+) Material Slot | Remove (x) Material Slot |

#### Setting Material Slots in Blueprints and C++

You can set your Material on a component at runtime, using the Slot Name you gave your Material by calling **Set Material By Name**. This saves you from having to hard-code the Material Element's index number to retrieve the Material Slot
you're looking for. It also ensures that your gameplay code still works properly if the order of the Materials on the meshes were to ever change (since it references the Slot Name instead).

## Texture Import

If a Material has a texture assigned as either the diffuse or normal map in the 3D application, those textures will be imported into Unreal as long as the **Import Textures** setting is enabled in FBX Import Properties (-> fbx-import-options-reference-in-unreal-engine).

A Texture Sample expression will be built in the newly-created material in Unreal Editor and the imported texture will be assigned to that Texture Sample. A Texture Coordinate expression will also be added to the material and connected to the **UVs** input of the Texture Sample. However, you will need to connect some textures to their material slots.

If the textures applied to the material in the 3D application are in a format that is not compatible with Unreal, or are connected to an unknown material attribute (for example, Diffuse in Maya), they will not be imported. In this case, and also if no textures were present in the material to begin with, the material in Unreal Editor will be populated with a randomly-colored Vector Parameter.

- fbx

On this page

- Material Support (-> fbx-material-pipeline-in-unreal-engine)
- Multiple Materials (-> fbx-material-pipeline-in-unreal-engine)
- Material Naming (-> fbx-material-pipeline-in-unreal-engine)
- Material Ordering (-> fbx-material-pipeline-in-unreal-engine)
- Adding or Removing Material Slots (-> fbx-material-pipeline-in-unreal-engine)
- Setting Material Slots in Blueprints and C++ (-> fbx-material-pipeline-in-unreal-engine)
- Texture Import (-> fbx-material-pipeline-in-unreal-engine)

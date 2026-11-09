# Importing Materials Reference

https://dev.epicgames.com/documentation/en-us/unreal-engine/importing-materials-reference-in-unreal-engine?application_version=5.9

> Reference guide for importing materials.

We're using reference images from **3DS Max** and **Maya** throughout this reference guide. Although there are other 3D modeling applications available for your use, this reference guide only covers 3DS Max and Maya.

The Unreal Engine FBX import pipeline uses **FBX 2020.2**. Using a different version during export may result in incompatibilities.

Autodesk Maya
 Autodesk 3ds Max

## Supported Materials

Unreal's FBX pipeline supports the following materials:

 Surface
 Anisotropic
 Blinn
 Lambert
 Phong
 Phone E

 Standard
 Multi/Sub-Object

Only basic materials are supported by Unreal's FBX pipeline. Uncommon map (texture) types will not be imported.

## Material Naming

Unreal names materials in correlation with the originating application.

For Maya, the material name in Unreal Editor is transferred from the name of the shading engine applied to the mesh in Maya.

 [image: mat_name_maya.jpg]

For 3dsMax, the material name in Unreal Editor is transferred directly from the name of the material applied to the mesh in 3dsMax.

 [image: mat_name_max.jpg]

## Material Ordering

If material order is important, content creators can specify imported material order by using the ***_skin##** naming convention.

For example, order can be established by naming materials accordingly:

- `M_ExampleMesh_skin00`

- `M_ExampleMesh_skin01`

## Importing Meshes with Multiple Materials

Unreal's FBX pipeline can import meshes with multiple materials.

Maya is pretty straightforward when it comes to the use of multiple materials on a mesh. You simply select the faces of the mesh you want to have the material applied to and then apply the material.

 [image: mat_mult_maya.jpg]
 [image: mat_mult_maya_result.jpg]

A material will be created in Unreal Editor for each material applied to the mesh in Maya, and the imported mesh will have material slots for each of these materials. When applied to the mesh, the materials will only affect the corresponding polygons of the mesh (just as they did in Maya).

In 3dsMax, multiple materials are handled by the use of a **Multi/Sub-Object** material. Each face of a mesh has a Material ID and each Standard material within the Multi/Sub-Object material is applied to the corresponding Material ID.

 [image: mat_multi_max.jpg]
 [image: mat_multi_max_result.jpg]

A material will be created in Unreal Editor for each of the Standard materials within the Multi/Sub-Object material and the imported mesh will have material slots for each of these materials. When applied to the mesh, the materials will only affect the corresponding polys of the mesh, just as they did in 3dsMax.

## Importing Textures

If the material has a texture assigned as either a diffuse or normal map in the 3D application, those textures will be imported into Unreal as long as the **Import Textures** setting is enabled.

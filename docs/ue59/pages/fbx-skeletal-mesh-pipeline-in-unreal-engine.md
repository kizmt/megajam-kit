# FBX Skeletal Mesh Pipeline

https://dev.epicgames.com/documentation/en-us/unreal-engine/fbx-skeletal-mesh-pipeline-in-unreal-engine?application_version=5.9

> Setting up, exporting, and importing Skeletal Meshes using the FBX content pipeline.

[image: FBX Skeletal Mesh Pipeline]

Skeletal Mesh support in the FBX import pipeline provides a streamlined workflow for getting animated meshes
from 3D applications into Unreal for use in games. In addition to the meshes being imported, animations and
morph targets can be transferred using the FBX format all within the same file if desired. Also, the textures
(diffuse and normal map only) used in the materials applied to those meshes in the 3D application will be
imported and materials will be automatically created and applied to the imported meshes.

Features supported for importing Skeletal Meshes using FBX:

- Materials including textures (-> fbx-skeletal-mesh-pipeline-in-unreal-engine)

- Animations (-> fbx-skeletal-mesh-pipeline-in-unreal-engine)

- Morph Targets (-> fbx-skeletal-mesh-pipeline-in-unreal-engine)

- Multiple UV sets

- Smoothing groups

- Vertex colors (-> fbx-skeletal-mesh-pipeline-in-unreal-engine)

- LODs (-> fbx-skeletal-mesh-pipeline-in-unreal-engine)

Currently, only a single animation for each Skeletal Mesh can be imported in a single file. Multiple morph
targets can be transferred for a Skeletal Mesh in one file, though.

This page is a technical overview of using the FBX content pipeline to import Skeletal Meshes into Unreal.

The Unreal Engine FBX import pipeline uses **FBX 2020.2**. Using a different version during export may result in incompatibilities.

In any case below where the document tells you to use the **Import Asset** button, you can also just click and drag an FBX file in from your OS's file browser.

This page includes information on both Autodesk Maya and Autodesk 3ds Max, please choose your preferred content creation tool below and the information relevant only to the chosen tool will be displayed:

Autodesk Maya
 Autodesk 3ds Max

## General Setup

### Single Mesh vs Multi-Part Mesh

Skeletal Meshes can be comprised of a single, contiguous mesh or they can be made up of several separate meshes
all skinned to the same skeleton.

 [image: multipart.png]

Using multiple meshes makes it possible to LOD individual parts differently as well as exporting parts separately
for use in modular character systems. There is no performance penalty for creating your Skeletal Meshes this way.
The individual parts are all combined when being imported into Unreal Editor.

### Rigging

Rigging refers to the binding of a mesh to a skeletal hierarchy of bones/joints. This allows the bones/joints of the underlying skeleton to influence the vertices of the mesh, deforming it as they move.

#### Skeleton

In Maya, you will generally use the Joint Tool to create the skeleton for your Skeletal Mesh. Again, there are
endless tutorials on using this tool and creating rigs in Maya. The Maya help is also a good source of information
on the subject.

How you go about creating skeletal hierarchies in 3dsMax is up to you. You may use the standard Bones Tools as
they work quite well, or create your own hierarchy of objects to allow for completely custom geometry and controls.
There are many ways to skin a cat (pardon the pun) and tons of tutorials out there that show how to create animation
rigs for game characters. You can also refer to the 3dsMax Help for complete details on how the tools work.

 [image: max_rig.png]

#### Binding

In Maya, the mesh(es) are bound to the skeleton using the Smooth Bind command. The process is the same whether
the Skeletal Mesh consists of a single complete mesh or is made up of multiple mesh parts.

- Select the mesh(es) to be bound.

- **Shift** + Select the root joint of the skeleton.

- Select Smooth Bind from the Skin > Bind Skin menu. [image: maya_skin_3.jpg]

- Now you can adjust the weights of the vertices of the mesh for each joint to determine which vertices are influenced by which bones and to what degree. This can be done using the Paint Skin Weights Tool or whichever method you prefer.

In 3dsMax, the mesh(es) must be bound to the skeleton using the Skin modifier. The process is the same whether the
Skeletal Mesh consists of a single complete mesh or is made up of multiple mesh parts.

- Select the mesh to be bound. [image: max_skin_1.png]

- Add a Skin modifier from the Modifier List. [image: max_skin_2.jpg]

- In the Parameters rollout of the Skin modifier, click the [image: skin_add_button.jpg] button to add the bones that will influence the mesh. The **Select Bones** window will open. [image: max_skin_3.jpg]

- Select the bones in the **Select Bones** window and click the **Select** button to add the bones. [image: max_skin_4.jpg]

- The bones are now displayed in the Bones list of the modifier. [image: max_skin_5.jpg]

- Now you can adjust the weights of the vertices of the mesh for each bone to determine which vertices are influenced by which bones and to what degree. This can be done using envelopes, directly entering the weights for the vertices, or whichever method you prefer. [image: max_skin_6.png]

### Pivot Point

The pivot point of the mesh in Unreal Engine determines the point around which any transformations (translation,
rotation, scale) will be performed.

 [image: pivot.png]

The pivot point of a Skeletal Mesh is always located at the root bone/joint of the skeleton. This means it does
not matter where the root of the skeleton is located within the scene. It will be as though it is at the origin
(0,0,0) when exporting from a 3D modeling application.

 [image: pivot_root.png]

### Triangulation

Meshes in Unreal Engine must be triangulated as the graphics hardware only deals with triangles.

 [image: tris.jpg]

There are several ways you can ensure your mesh is triangulated.

- Model the mesh with only tris - best solution, provides the most control over the end result.

- Triangulate the mesh in the 3D app - good solution, allows cleanup and modification before export.

- Allow the importer to triangulate the mesh - okay solution, allows no cleanup but can work for simple meshes.

- Allow the FBX exporter to triangulate the mesh - okay solution, allows no cleanup but can work for simple meshes.

**Note:** Allowing the FBX exporter to triangulate the mesh results in completely random smoothing when Split Non-Matching
Triangles is checked. Importing an FBX-triangulated mesh back into Maya and re-exporting shows proper smoothing.

It will always be best to manually triangulate the mesh in the 3D application, controlling the direction and placement of
edges. Automatic triangulation can lead to undesirable results.

 [image: tris_bad.jpg]

### Creating Normal Maps

Normal maps can be created for your meshes directly inside of most modeling applications by creating both a low-res render mesh and a high-res detail mesh.

 [image: SideBySide.jpg]

The geometry of the high-res detail mesh is used to generate the normals for the normal map. Epic uses a workflow internally that introduces XNormal into the process and generally results in much better normals when rendering inside of Unreal Engine 4. For details on this process, see Textures (-> textures-in-unreal-engine).

### Materials

The materials applied to meshes modeled in external applications will be exported along with the mesh and then imported into
Unreal. This streamlines the process as textures do not need to be imported separately in Unreal Ed, materials do not need
to be created and applied, etc. The import process is capable of performing all of these actions when using the FBX pipeline.

These materials also need to be set up in a specific way, especially when the mesh has multiple materials or the order of the
materials on the mesh is important (i.e. for character models where material 0 needs to be the body and material 1 needs to be
the head).

For complete details of setting up materials for export, see the **FBX Material Pipeline** (-> fbx-material-pipeline-in-unreal-engine) page.

### Vertex Colors

Vertex colors (one set only) for Skeletal Meshes can be transferred using the FBX pipeline. No special setup is necessary.

 [image: vertex_color.jpg]

## Export Mesh from 3D App

Skeletal Meshes can be exported individually or multiple meshes can be exported to a single FBX file. The import pipeline will separate multiple Skeletal Meshes into multiple assets within the destination package.

- Select the mesh(es) and joints to be exported in the viewport. [image: meshAndJointsSel.png]

- In the File menu choose Export Selection (or Export All if you want to export everything in the scene regardless of selection). [image: maya_export_2.jpg]

- Choose the location and name for the FBX file to export the mesh(es) to and set the appropriate options in the **FBX Export** dialog and then click the [image: maya_export_button.jpg] button to create the FBX file containing the mesh(es). [image: maya_export_3.jpg]

- Select the mesh(es) and bones to be exported in the viewport. [image: max_export_1.png]

- In the File menu, choose Export Selected (or Export All if you want to export everything in the scene regardless of selection). [image: max_export_2.jpg]

- Choose the location and name for the FBX file to export the mesh(es) to and click the [image: max_save_button.jpg] button. [image: max_export_3.jpg]

- Set the appropriate options in the **FBX Export** dialog and then click the [image: max_ok_button.jpg] button to create the FBX file containing the mesh(es). [image: max_export_4.jpg]

## Import Mesh

- Click the button in the **Content Browser**. Navigate to and select the FBX file you want to import in the file browser that opens. **Note:** you may want to select [image: import_fbxformat.jpg] in the dropdown to filter out unwanted files. [image: import_file.jpg] The path of the imported asset depends on the current location of the **Content Browser** while importing. Make sure to navigate to the appropriate folder prior to performing the import. You may also drag the imported assets into a new folder once import is complete.

- Choose the appropriate settings in the **FBX Import Options** dialog. The defaults should be sufficient when importing a mesh that does not share an existing Skeleton. See the **FBX Import Dialog** (-> fbx-import-options-reference-in-unreal-engine) section for complete details of all of the settings. If the Skeletal Mesh being imported shares an existing Skeleton, click the **Select Skeleton** dropdown menu and select the Skeleton asset from the list. [image: FBX Skeletal Mesh Skeleton Browser]

- Click the [image: Import Button] button to import the mesh(es). The resulting mesh (as well as materials and textures if those options were enabled) are displayed in the **Content Browser** if the process was successful. By viewing the imported mesh within Persona, you can determine that the process worked as expected.

## Skeletal Mesh LODs

Skeletal Meshes can make use of levels of detail (LODs) in-game in order to limit the impact of meshes as they get farther
from the camera. Generally, this means each level of detail will have a reduced number of tris, simpler skeleton, and, perhaps,
a simpler material (or materials) applied to it.

The FBX pipeline can be used to export/import these LOD meshes.

### LOD Setup

In general, LODs are handled by creating models of varying complexity going from the full-detail base mesh to the lowest-detail
LOD mesh. These should all be aligned and occupying the same space with the same pivot point and should all be skinned to the
same skeleton. It is also possible for Skeletal Meshes to be made up of multiple individual meshes within the 3D application.
Each of these parts can have LODs independent of the rest of the mesh. This means that some parts can have simplified versions
in different LODs while other parts continue to use higher detail versions. Each LOD mesh can have completely different materials
assigned, including different amounts of materials. This means the base mesh could use multiple materials to give the desired
amount of detail up close, but the lower-detail meshes could use a single material since details will be less noticeable.

- Select all of the meshes (base plus LODs) in order from the base LOD down to the last LOD. This is important so that they are added in the correct order in terms of complexity. Then select the Level of Detail > Group command from the Edit menu. [image: maya_lod_group.jpg]

- You should now have the meshes all grouped under the LOD Group. [image: maya_lod_contents.jpg]

- Select all of the meshes (base plus LODs - the order is not important) and then select the Group command from the Group menu. [image: max_lod_group.jpg]

- Enter a name for the new group in the dialog that opens and the click the [image: max_lod_ok_button.jpg] button to create the group. [image: max_lod_group_name.jpg]

- Click the [image: max_utilities_button.jpg] button to view the Utilities panel and then choose the Level of Detail utility. **Note:** You may need to click [image: max_utility_more_button.jpg] and select it from the list. [image: max_lod_utility.jpg]

- With the group selected, click the [image: max_lod_create_button.jpg] button to create a new LOD Set and add the meshes in the selected group to it. The meshes will automatically be ordered according to their complexity. [image: max_lod_contents.jpg]

#### Multi-Part LODs

Setting up LODs for multi-part Skeletal Meshes is almost identical to setting up LODs for a full mesh with the exception that
each individual part that has LODs will have an LOD group created for it. The process for setting up those individual LOD groups
is identical to the process outlined above.

### Export LODs

To export the Skeletal Mesh LODs:

- Select the LOD Group(s) and the joints to be exported. [image: meshAndJointsSel.png]

- Follow the same export steps used for the base mesh (described above in the Export Mesh (-> fbx-skeletal-mesh-pipeline-in-unreal-engine) section).

- Select the Group(s) of meshes that comprise the LOD Set and the bones to be exported. [image: max_export_1.png]

- Follow the same export steps used for the base mesh (described above in the Export Mesh (-> fbx-skeletal-mesh-pipeline-in-unreal-engine) section).

### Import LODs

**Skeletal Mesh** LODs can be imported easily through the **Mesh Details** panel in **Persona** under **LOD Settings**.

- Open the **Skeletal Mesh** you wish to apply an LOD to in **Persona** and go to the **Mesh** Tab.

- In the **Mesh Details** panel, scroll down and find the **LOD Settings** section and click the **LOD Import** option.

- Navigate to and select the FBX file you want to import in the file browser that opens.

- The imported LOD will be added to the **Mesh Details** panel.

- Under each LOD, the **Screen Size** setting indicates when to use the LOD. **Note:** Using a smaller number means use the LOD when further away while larger numbers mean use the LOD when closer. In the image above, LOD0 is used when closer to the **Skeletal Mesh** while LOD1 is used when further away.

- When importing or adding LODs, **Reduction Settings** can also be adjusted for the LOD.

## Export to FBX from Unreal Editor

Skeletal Meshes previously imported into Unreal Editor can be exported back to an FBX file from within the **Content Browser**.

Assets in cooked packages cannot be exported as the source data which has been cooked out is required for the export process.

- In the **Content Browser**, select the Skeletal Mesh you want to export.

- **Right-click** on the Skeletal Mesh and choose **Asset Actions** > **Export**.

- Choose a location and name for the file to export in the file browser that appears. **Note:** make sure FBX File (*.FBX) is selected as the file type. [image: export_file.jpg]

## Physics Assets

For complete details on using the Physics Asset Tool (PhAT), see the **Physics Asset Tool** (-> physics-asset-editor-in-unreal-engine) user documentation.

## Animations

For complete details on using the FBX content pipeline to create and import animations, see the **FBX Animation Pipeline** (-> fbx-animation-pipeline-in-unreal-engine) page.

## Morph Targets

For complete details on using the FBX content pipeline to create and import morph targets, see the **FBX Morph Target Pipeline** (-> fbx-morph-target-pipeline-in-unreal-engine) page.

On this page

- General Setup (-> fbx-skeletal-mesh-pipeline-in-unreal-engine)
- Single Mesh vs Multi-Part Mesh (-> fbx-skeletal-mesh-pipeline-in-unreal-engine)
- Rigging (-> fbx-skeletal-mesh-pipeline-in-unreal-engine)
- Skeleton (-> fbx-skeletal-mesh-pipeline-in-unreal-engine)
- Binding (-> fbx-skeletal-mesh-pipeline-in-unreal-engine)
- Pivot Point (-> fbx-skeletal-mesh-pipeline-in-unreal-engine)
- Triangulation (-> fbx-skeletal-mesh-pipeline-in-unreal-engine)
- Creating Normal Maps (-> fbx-skeletal-mesh-pipeline-in-unreal-engine)
- Materials (-> fbx-skeletal-mesh-pipeline-in-unreal-engine)
- Vertex Colors (-> fbx-skeletal-mesh-pipeline-in-unreal-engine)
- Export Mesh from 3D App (-> fbx-skeletal-mesh-pipeline-in-unreal-engine)
- Import Mesh (-> fbx-skeletal-mesh-pipeline-in-unreal-engine)
- Skeletal Mesh LODs (-> fbx-skeletal-mesh-pipeline-in-unreal-engine)
- LOD Setup (-> fbx-skeletal-mesh-pipeline-in-unreal-engine)
- Multi-Part LODs (-> fbx-skeletal-mesh-pipeline-in-unreal-engine)
- Export LODs (-> fbx-skeletal-mesh-pipeline-in-unreal-engine)
- Import LODs (-> fbx-skeletal-mesh-pipeline-in-unreal-engine)
- Export to FBX from Unreal Editor (-> fbx-skeletal-mesh-pipeline-in-unreal-engine)
- Physics Assets (-> fbx-skeletal-mesh-pipeline-in-unreal-engine)
- Animations (-> fbx-skeletal-mesh-pipeline-in-unreal-engine)
- Morph Targets (-> fbx-skeletal-mesh-pipeline-in-unreal-engine)

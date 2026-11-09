# FBX Morph Target Pipeline

https://dev.epicgames.com/documentation/en-us/unreal-engine/fbx-morph-target-pipeline-in-unreal-engine?application_version=5.9

> Creating and importing Morph Targets for Skeletal Meshes using the FBX content pipeline.

[image: FBX Morph Target Pipeline]

A **Morph Target** is a snapshot of vertex locations for a specific mesh that have been deformed in some way. For instance, you can take a character model, reshape their face to create a facial expression, and then save that edited version as a Morph Target. In Unreal, you can blend the Morph Target to cause the character's face to make that expression. Morph Targets can be imported into Unreal via FBX, and will be encapsulated within an Animation Sequence.

This makes it very easy to import complex Morph Target animations into Unreal, since you can have any number of Morph Targets driving a single animation. For instance, you could use Morph Targets in your animation package to animate a character speaking some dialog. This animation may use any number of Morph Targets to capture the full motion of the face. However, when imported, the result will appear to be just a single Animation Sequence. You still have access to the animation data for each Morph Target via **Curves** (-> animation-curves-in-unreal-engine).

Morph Target support in the FBX import pipeline provides an easy method for getting morph targets for skeletal meshes from 3D applications into Unreal for use in games. The pipeline allows for any number of morph targets for any number of Skeletal Meshes to be imported within a single file.

This page is a technical overview of using the FBX content pipeline to import morph targets into Unreal.

The Unreal Engine FBX import pipeline uses **FBX 2020.2**. Using a different version during export may result in incompatibilities.

This page includes information on both Autodesk Maya and Autodesk 3ds Max, please choose your preferred content creation tool below and the information relevant only to the chosen tool will be displayed:

Autodesk Maya
 Autodesk 3ds Max

## Naming

When importing morph targets into Unreal using the FBX format, the individual morph targets will be named according to the names of the blend shapes or morphs in the 3D application.

* The name will be the name of the blendshape added to the name of the blendshape node, i.e. `[BlendShapeNode]_[BlendShape]`.

* The name will be the name of the channel in the Morpher modifier.

## Setting Up Morph Targets

Setting up morph targets in Maya to be exported to FBX requires the use of blend shapes. The steps below provide a brief explanation of the steps necessary to set up a morph target for export. Refer to the help files of the application for more detailed information.

- Start with the base mesh. [image: maya_setup_1.png]

- Duplicate the mesh that will be modified to create the target pose. In this case, it is the head. Create the target pose. For this example, the target pose is the character winking. [image: maya_setup_2.png]

- Select the target mesh and then the base mesh in that order. [image: maya_setup_3.png]

- In the **Create Deformers** menu of the **Animation** menu set, select **Blend Shape**. The target mesh can be deleted after this step if desired. [image: maya_setup_4.jpg]

- The blend shape node is now visible in the base mesh's properties. These are the names that will be used in Unreal. You can change the names of the blendshape node and the blendshape here. [image: maya_setup_5.png]

- Adjusting the blendshape's weight up to 1.0 causes the base mesh to interpolate toward the target pose. [image: maya_setup_6.png]

Setting up morph targets in 3dsMax to be exported to FBX requires the use of the Morpher modifier. The steps below provide a brief explanation of the steps necessary to set up a morph target for export. Refer to the help files of the application for more detailed information.

- Start with the base mesh. [image: max_setup_1.jpg]

- Duplicate the mesh that will be modified to create the target pose. In this case, it is the head. Create the target pose. For this example, the target pose is the character winking. [image: max_setup_2.jpg]

- Add a **Morpher** modifier to the base mesh. It needs to be before the **Skin** modifier in the stack. [image: max_setup_3.jpg]

- With the morph channel you want to populate selected, press the [image: max_pick_button.jpg] in the **Morpher** modifier's properties rollout or **right-click** on the channel and choose Pick Object From Scene. [image: max_setup_4.jpg]

- In the viewport, click on the target mesh. [image: max_setup_5.jpg]

- The morph channel is now populated and displays the name of the target mesh. This is the name that will be given to the morph target in Unreal. You can change it in the **Channel Parameters** section of the **Morpher** modifier's rollout. [image: max_setup_6.jpg]

- Adjusting the channel's weight up to 100.0 causes the base mesh to interpolate toward the target pose. [image: max_setup_7.jpg]

## Exporting Morph Targets

- Select the base mesh(es) and joints to be exported in the viewport. [image: maya_export_1.png]

- In the File menu, choose Export Selection (or Export All if you want to export everything in the scene regardless of selection). [image: maya_export_2.jpg]

- Choose the location and name for the FBX file to export the morph target to and set the appropriate options in the **FBX Export** dialog. For the purposes of exporting morph targets, you must enable the **Animations** checkbox and all of the **Deformed Models** options. [image: maya_export_3.jpg]

- Click the [image: maya_export_button.jpg] button to create the FBX file containing the morph target(s).

- Select the base mesh(es) and bones to be exported in the viewport. [image: max_export_1.jpg]

- In the File menu, choose Export Selected (or Export All if you want to export everything in the scene regardless of selection). [image: max_export_2.jpg]

- Choose the location and name for the FBX file to export the morph target to and click the [image: max_save_button.jpg] button. [image: max_export_3.jpg]

- Set the appropriate options in the **FBX Export** dialog. For the purposes of exporting morph targets, you must enable the **Animations** checkbox and all of the **Deformations** options. [image: max_export_4.jpg]

- Click the [image: max_ok_button.jpg] button to create the FBX file containing the morph target(s).

## Importing Morph Targets

The FBX morph target import pipeline allows for importing both a SkeletalMesh and morph target all at once. If you import and add morph targets to an existing Skeleton with morph targets already applied, the existing ones will be overridden.

**Skeletal Mesh with Morph Targets**

- Click the **Import** button in the **Content Browser**. Navigate to and select the FBX file you want to import in the file browser that opens. **Note:** you may want to select [image: import_fbxformat.jpg] in the dropdown to filter out unwanted files.

- Choose the appropriate settings in the **Import** dialog. Make sure that Import Morph Targets is enabled. **Note:** The name of the imported mesh will follow the default **Naming Rules** (-> fbx-import-options-reference-in-unreal-engine). See the **FBX Import Dialog** (-> fbx-import-options-reference-in-unreal-engine) section for complete details of all of the settings.

- Click the **OK** button to import the mesh and LODs. The resulting mesh, morph target (MorphTargetSet), material(s), and texture(s) will be displayed in the **Content Browser** if the process was successful. You can see the MorphTargetSet that was created to hold the morph target was named after the root bone of the skeleton by default. By viewing the imported mesh in Persona and using the **Morph Target Previewer** tab, you can adjust the strength of the imported morph target and see that it is working as expected.

The effect of **Morph Targets** is often subtle, but the control it offers the animator and the believability it adds to a character cannot be overstated.

On this page

- Naming (-> fbx-morph-target-pipeline-in-unreal-engine)
- Setting Up Morph Targets (-> fbx-morph-target-pipeline-in-unreal-engine)
- Exporting Morph Targets (-> fbx-morph-target-pipeline-in-unreal-engine)
- Importing Morph Targets (-> fbx-morph-target-pipeline-in-unreal-engine)

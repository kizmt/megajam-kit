# FBX Animation Pipeline

https://dev.epicgames.com/documentation/en-us/unreal-engine/fbx-animation-pipeline-in-unreal-engine?application_version=5.9

> Setting up, exporting, and importing animations for Skeletal Meshes using the FBX content pipeline.

[image: FBX Animation Pipeline]

Animation support in the FBX import pipeline provides a simple workflow for getting animations for Skeletal Meshes from 3D applications into Unreal for use in games. Currently, only a single animation for each Skeletal Mesh can be exported/imported in a single file.

This page is a technical overview of using the FBX content pipeline to import animations into Unreal.

The Unreal Engine FBX import pipeline uses **FBX 2020.2**. Using a different version during export may result in incompatibilities.

This page includes information on both Autodesk Maya and Autodesk 3ds Max, please choose your preferred content creation tool below and the information relevant only to the chosen tool will be displayed:

Autodesk Maya
 Autodesk 3ds Max

## Naming

When importing animations into Unreal using the FBX format, the AnimationSequence will be named the same as the name of the file. When importing animations along with a Skeletal Mesh, the AnimationSequence that is created will be taken from the name of the root bone in the animation sequence. This can easily be renamed after the import process is complete through the **Content Browser**.

## Creating Animations

Animations can be unique to a single Skeletal Mesh or they can be reused for any number of Skeletal Meshes as long as each Skeletal Mesh uses the same skeleton. All you really need to create an animation and export it into Unreal using the FBX pipeline is a skeleton that has been animated. Having a mesh bound to the skeleton is completely optional, though it makes the process of creating the animation much easier as you can see how the mesh is deforming during the animation. At export time, only the skeleton is required though.

## Exporting Animations from 3D Apps

Animations must be exported individually; one animation per Skeletal Mesh to a single file. The steps below are for exporting a single animation into a file by itself. The mesh bound to this skeleton has been hidden as it is not absolutely necessary for exporting animations by themselves.

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

The FBX animation import pipeline allows for importing both a Skeletal Mesh and animation all at once, or importing one or the other individually.

**Skeletal Mesh with Animation**

- Click the button in the **Content Browser**. Navigate to and select the FBX file you want to import in the file browser that opens. **Note:** you may want to select [image: import_fbxformat.jpg] in the dropdown to filter out unwanted files. [image: import_file.jpg] The imported path of the imported asset depends on the current location of the **Content Browser** while importing. Make sure to navigate to the appropriate folder prior to performing the import. You may also drag the imported assets into a new folder once import is complete.

- Choose the appropriate settings in the **FBX Import Options** dialog. The name of the imported mesh will follow the default naming rules See the **FBX Import Dialog** (-> fbx-import-options-reference-in-unreal-engine) section for complete details of all of the settings.

- Click the [image: button_import.png] button to import the mesh and LODs. The resulting mesh, animation (AnimationSequence), material(s), and texture(s) will be displayed in the **Content Browser** if the process was successful. You can see the AnimationSequence that was created to hold the animation was named after the root bone of the skeleton by default.

**Individual Animations**

To import animations, you first need an AnimationSequence to import the animation into. This can be created through the **Content Browser** or directly in the AnimationSequence Editor.

Unreal Editor supports importing multiple animations contained in a single FBX file; however, many DCC tools such as 3ds Max and Maya do not currently support saving multiple animations to a single file. If you export from a supporting application such as Motion Builder, Unreal will import all the animations in that file.

- Click the button in the **Content Browser**. Navigate to and select the FBX file you want to import in the file browser that opens. **Note:** you may want to select [image: import_fbxformat.jpg] in the dropdown to filter out unwanted files. [image: import_file.jpg] The imported path of the imported asset depends on the current location of the **Content Browser** while importing. Make sure to navigate to the appropriate folder prior to performing the import. You may also drag the imported assets into a new folder once import is complete.

- Choose the appropriate settings in the **FBX Import Options** dialog. The name of the imported mesh will follow the default naming rules. See the **FBX Import Dialog** (-> fbx-import-options-reference-in-unreal-engine) section for complete details of all of the settings. When importing animation on its own, you must specify an existing skeleton!

- Click the [image: button_import.png] button to import the mesh and LODs. The resulting mesh, animation (AnimationSequence), material(s), and texture(s) will be displayed in the **Content Browser** if the process was successful. You can see the AnimationSequence that was created to hold the animation was named after the root bone of the skeleton by default.

Unreal Editor supports non-uniform scale animations. When importing an animation, if scale exists, it will also import without the need for setting additional options. For memory reasons, the engine does not save scale for all animations and only saves it if it has scale that is not 1.

Refer to the **Skeletal Mesh Animation** (-> skeletal-mesh-animation-system-in-unreal-engine) page for more information and video samples.

On this page

- Naming (-> fbx-animation-pipeline-in-unreal-engine)
- Creating Animations (-> fbx-animation-pipeline-in-unreal-engine)
- Exporting Animations from 3D Apps (-> fbx-animation-pipeline-in-unreal-engine)
- Importing Animations (-> fbx-animation-pipeline-in-unreal-engine)

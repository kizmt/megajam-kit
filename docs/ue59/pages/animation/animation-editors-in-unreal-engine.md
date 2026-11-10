# Animation Editors

https://dev.epicgames.com/documentation/en-us/unreal-engine/animation-editors-in-unreal-engine?application_version=5.9

> An overview of the Animation Editor modes in Unreal Engine.

[image: Animation Editors]

The **Skeletal Mesh Animation System** in **Unreal Engine** is comprised of specialized animation asset editors that feature robust animation tools that you can use when working with Skeletal Meshes and other **Animation Assets**. With these animation editors, you can create character animations, interactions within the levels, and other procedural behaviors.

This document provides an overview of the specialized animation editors in Unreal.

## Overview

A character's skeletal mesh has many associated assets that can be opened through the **Content Browser**. These assets include a **Skeleton**, **Skeletal Mesh**, **Animation Sequences**, and** Animation Blueprints**. Depending on which asset is opened, the corresponding **Editor Mode** will open.

Here you will find an overview of an Animation Editor window with highlighted features, common across all of the Animation Editor Modes.

 [image: animation editor overview window]

- Toolbar (-> animation-editors-in-unreal-engine)

- Viewport (-> animation-editors-in-unreal-engine)

- Editor Modes (-> animation-editors-in-unreal-engine)

- Preview Scene Settings (-> animation-editors-in-unreal-engine)

## Toolbar

The **Toolbar**, which is found in all of the Animation Editor modes, is similar to the **Toolbar** found across Unreal Engine's many editors and windows. For general Toolbar functions refer to the Main Toolbar (-> unreal-editor-interface), and for specific animation editor toolbar features, reference their respective pages for more information.

 [image: animation editor toolbar buttons]

The following unique features are common across all of the Animation Editors:

| Name | Icon | Description |
| --- | --- | --- |
| **Preview Mesh** | [image: preview mesh icon button toolbar] | Set a new preview Skeletal Mesh for the current asset (Stored per-animation or per-skeleton). |
| **Preview Animation** | [image: preview animation icon button toolbar] | Select a preview animation for playback with the current asset. |
| **Create Asset** | [image: create asset icon button toolbar] | From this drop down menu, the following Animation Assets can be created: Create Animation (-> animation-sequences-in-unreal-engine) creates a new Animation Sequence from either the current default **Reference Pose**, or from the displayed meshes **Current Pose**. Create Pose Asset (-> animation-pose-assets-in-unreal-engine) creates a new Pose Asset from either the **Current Pose** displayed on the mesh, the **Current Animation** description, or the **Insert Pose** Description. Anim Blueprint (-> animation-blueprints-in-unreal-engine) creates a new **Animation Blueprint** for the current Skeletal Mesh. Anim Composite (-> animation-composites-in-unreal-engine) created a new **AnimComposite** using the selected Skeleton. Anim Montage (-> animation-montage-in-unreal-engine) creates a new **AnimMontage** using the selected skeleton. Blend Space (-> blend-spaces-in-unreal-engine) creates a new **Blend Space** used for smoothly blending transitions between animations. Blend Space 1D (-> blend-spaces-in-unreal-engine) creates a new **1D Blend Space** using the selected Skeleton. Aim Offset (-> aim-offset-in-unreal-engine) creates a new **Aim Offset Blend Space** using the selected skeleton. Aim Offset 1D (-> aim-offset-in-unreal-engine) creates a new **Aim Offset 1D Blend Space** using the selected skeleton. |

## Viewport

The Viewport (-> editor-viewports-in-unreal-engine) window allows you to preview playback of animation assets on your selected Skeletal Mesh and provides information about your assets. Below you will find highlighted features relevant to the Animation Editors.

 [image: animation viewport window]

- Viewport Property Settings Listed below are the viewport properties relevant to the Animation Sequence Editor Viewport. | Name | Description |
| --- | --- |
| **Preview Animation** | Lists the current selected animation sequence. |
| **LOD (Level of Detail)** | The current displayed LOD or Level of Detail assigned value of the character. |
| **Current Screen Size** | This is a value that represents how much of the viewport is occupied by the character's bounding box (By default, the bounding box is derived from the Physics Asset, if one is present, and Skeleton Asset if not.). Factors that affect this number are how large the animation's bounding box is (or the displacement in 3D space), how close the character is to the camera, and the amount of zoom applied to the camera. Based on this value you can assign when your LOD should switch between levels. |
| **Triangles** | Lists the number of triangles rendered that comprise the previewed mesh. |
| **Vertices** | Lists the number of vertices, or individual coordinate points, that comprise the previewed mesh. |
| **UV Channels** | Lists the current mesh's UV Channel (-> using-uv-channels-with-static-meshes-in-unreal-engine). |
| **Approximate Size** | Dimensions of a bounding box containing the current animations displaced space, calculated by one of the animations assets. By default the physics asset will be used, and if no physics asset is present then the Skeleton asset will be referenced. Listed in Unreal Units (Centimeters). |
| **Frame Rate** | Lists the preview animations frame rate of playback. |

- Debug Text Here you the Animation Editor Debug Text can also be seen in the top right of the Viewport. Here you can find important reference information about the animation asset currently being used such as the name of the animation asset, the LOD mode, Current screen Size and display output of mesh properties such as displayed triangles and vertices.

## Editor Modes

Each Animation Editor Mode, can be opened with their respective buttons in the top right of your project window:

 [image: animation editor modes]

- Skeleton Editor (-> skeleton-editor-in-unreal-engine): This editor is used for working with Skeleton Rigs and provides visual control of bone and joint hierarchy associated with a Skeletal Mesh.

- Skeletal Mesh Editor (-> animation-sequence-editor-in-unreal-engine): The Skeletal Mesh Editor is where you can make edits to meshes, assign **Materials**, adjust **Level of Detail** (LOD), and test Morph Target (-> animation-editors-in-unreal-engine) functionality.

- Animation Sequence Editor (-> paper-2d-setting-up-an-animation-state-machine-in-unreal-engine): If the Skeletal Mesh has associated Animation Sequences, you can edit and preview them, including augmentation tools such as, **Blendspaces**, Morph Targets and **Animation Notifies** here.

- Animation Blueprint Editor (-> animation-blueprints-in-unreal-engine): Similar to Unreal's Blueprint Editor (-> blueprints-visual-scripting-in-unreal-engine), The Animation Blueprint editor is a visual scripting environment for directing animation functionality and behaviors within the level. You can access this Mode after an Animation Blueprint asset has been created for your mesh.

- Physics Asset Editor (-> physics-asset-editor-in-unreal-engine): The Physics Asset Editor is a dedicated animation editor you can use to manipulate the Physics Asset assigned to your Skeletal Mesh.

After opening a Skeletal Mesh asset for the first time, the Skeletal Mesh Editor will be the default Editor Mode open. By clicking any of the other Editor Modes, a new window tab will open in your current editor window.

### Skeleton Editor

In the Skeleton Editor Mode you will find a hierarchy outline and visual preview of the Bone data found within your Skeleton Mesh. Here you can adjust bone placement, create Skeleton Sockets (-> skeletal-mesh-sockets-in-unreal-engine), and preview Animation Curves (-> animation-curves-in-unreal-engine).

### Skeletal Mesh Editor

The Skeletal Mesh Editor Mode is where you can edit visual attributes of Skeletal Meshes. For instance, manipulating the polygonal structures of meshes, editing the associated Materials, and even assigning LODs.

### Animation Sequence Editor

With the Animation Sequencer Editor mode, you can perform animation focused editing, specific to any of your project's animation asset types. Examples include creating and managing **Animation Sequences**, **Animation Notifies**, **Animation Montages**, and more.

## Preview Scene Settings

The **Preview Scene** is the visual preview found in all of Unreal Engine's many project windows. With this window you can quickly see what your asset and animations will look like in different lighting environments and playback scenarios.

 [image: animation editor preview scene settings]

Below are a few features of the Preview Scene Settings window that are unique to the animation editors modes:

| Name | Description |
| --- | --- |
| **Preview Controller** | Here you have control over which animation is previewed in the viewport. **Default** will use the Animation tool's default settings. In most cases, this will cause the character to use the reference pose, except when an animation sequence is being viewed. **Reference Pose** will use the Skeletal Mesh's Reference Pose. **Use Specific Animation** will open an option to select a specific Animation Sequence associated with your skeletal mesh to preview. **Live Link Preview Controller** will use preview using Live Link settings. The selected mode will also be displayed on the first line of the **Debug Text** in the viewport. [image: viewport debug text window] |
| **Preview Mesh (Skeleton)** | This property enables you to change the Skeletal Mesh used for previewing purposes. Only found in Skeleton Editor and Animation Editor. |
| **Allow Different Skeletons** | When this property is enabled you can select an additional mesh, even ones not associated with the current skeleton, to preview in the viewport. Only found in Skeleton Editor and Animation Editor. |
| **Allow Custom AnimBP Override** | If using a Preview Collection, you can enable this property to allow an override of custom Animation Blueprints. Only found in Skeleton Editor and Animation Editor |
| **Additional Meshes** | For use in instances of Mesh Collection implementation. View other meshes included in the current Mesh Collection for previewing purposes. Only found in Skeleton Editor and Animation Editor. |
| **Skeletal Meshes** | The Skeletal Mesh assets that are included in the specified **Preview Mesh Collection**. Only found in Skeleton Editor and Animation Editor. |
| **Settings** | General scene lighting and rendering settings. |

- animation

On this page

- Overview (-> animation-editors-in-unreal-engine)
- Toolbar (-> animation-editors-in-unreal-engine)
- Viewport (-> animation-editors-in-unreal-engine)
- Editor Modes (-> animation-editors-in-unreal-engine)
- Skeleton Editor (-> animation-editors-in-unreal-engine)
- Skeletal Mesh Editor (-> animation-editors-in-unreal-engine)
- Animation Sequence Editor (-> animation-editors-in-unreal-engine)
- Preview Scene Settings (-> animation-editors-in-unreal-engine)

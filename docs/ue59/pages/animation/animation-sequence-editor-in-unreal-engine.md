# Animation Sequence Editor

https://dev.epicgames.com/documentation/en-us/unreal-engine/animation-sequence-editor-in-unreal-engine?application_version=5.9

> An in depth look at the Animation Sequence Editor in Unreal Engine.

[image: Animation Sequence Editor]

The **Animation Sequence Editor** provides access to the various animation-centric assets available for **Skeletal Meshes** in Unreal Engine. In the Animation Sequence Editor, you can edit and preview animation **Sequences**, **Montages**, **Curves**, and more.

Here is an highlighted overview of the Animation Sequence Editor, showing the following tools and windows:

 [image: animation sequence editor overview]

- Toolbar (-> animation-sequence-editor-in-unreal-engine)

- Asset Details / Skeleton Tree (-> animation-sequence-editor-in-unreal-engine)

- Viewport (-> animation-sequence-editor-in-unreal-engine)

- Details / Preview Scene Settings (-> animation-sequence-editor-in-unreal-engine)

- Asset Editor (-> animation-sequence-editor-in-unreal-engine)

- Asset Browser (-> animation-sequence-editor-in-unreal-engine)

## Toolbar

 [image: animation editor]

Here is a list of unique buttons found in the Animation Sequence Editor Toolbar and a description of their functionalities.

| Name | Icon | Description |
| --- | --- | --- |
| **Reimport Animation** | [image: reimport animation icon button] | With this button you can reimport Animations from their original file's location on your computer. If the location is not known or cannot be located, Unreal will prompt you to browse for the file you wish to Reimport. |
| **Apply Compression** | [image: apply compression icon button] | You can use this button to apply **Animation Compression** to your animation to reduce the animations resource demand. |
| **Export Asset** | [image: export asset icon button] | With this button you can export the current animation asset for the current Skeleton either as Animation Data or a Preview Mesh. For more information see, Exporting and Importing FBX Files (-> import-and-export-cinematic-fbx-animations-in-unreal-engine). |
| **Key** | [image: key icon button] | Add a **Keyframe** of the current pose to the Asset Editor as an additive layer. |
| **Make Static Mesh** | [image: make static mesh icon button] | Create a new Static Mesh Asset from the current pose displayed by the Mesh. |
| **Edit In Sequencer** | [image: edit in sequencer icon button] | Open the current animation in Sequencer. From this drop down you can also toggle the button to open the Animation in Control Rig (-> control-rig-in-unreal-engine) or Bake the animation to Control Rig. |

## Asset Details / Skeleton Tree

This window contains two panels by default, the Asset Details (-> animation-sequence-editor-in-unreal-engine) panel and the Skeleton Tree (-> animation-sequence-editor-in-unreal-engine) panel.

### Animation Asset Details

 [image: animation asset details window panel]

The **Animation Asset Details** panel is a context-sensitive property editor where you can edit and modify settings pertaining to the selected Animation Sequence and its assets such as, Blend Spaces, Animation Montages and Animation Notifies.

| Name | Description |
| --- | --- |
| **Animation Track Names** | Displays the currently selected Animation Track's name. |
| **Interpolation** | This property controls the interpolation between key frames of animation. **Linear interpolation** will implement linear easing between keyframes, causing abrupt starts and stops when reaching each keyframe. [image: linear interpolation] **Step interpolation** will implement non-interpolating keyframes, which maintain their value until the next keyframe is reached. [image: step interpolation] |
| **Target Frame Rate** | Listed here is the read only target frame rate the animation had been imported or created at. |
| **Number of Sampled Keys** | Here you will find a numerical read out of the number of sampled keys the current animation has been imported or created with. |
| **Number of Sampled Frames** | Listed is the number of sampled frames the animation has been imported or created with. |
| **Resampled Animation Track Data** | A list of bones being manipulated in your animation. Depending on how you export your animation, not all bones will always be animated. |
| **Rate Scale** | The speed of the animation playback. 1 is default, lower values are slower, higher values are faster. |
| **Skeleton** | Reference to the in use Skeleton Asset. This can be double-clicked to open the Skeleton Editor (-> skeletons-in-unreal-engine). |
| **Parent Asset** | Lists associated **Parent Asset**, only when working with Animation Montages and the currently selected AnimMontage is a Child. However, modifications to the current montage will be disabled, apart from assigning unique child behaviors through the Asset **Mapping Table**. This data will be used to bake out to a normal asset during cooking. Useful for mapping animations to exact timing and displacement of other animations. |
| **Asset Mapping Table** | Displays Asset Mapping Table, for use when working with Parent and Child Animation Montages. When a Mapping Table is present double-click to reference the associated Source Asset and Target Asset. |
| **Retargeting Source** | Base pose to use when Retargeting an Animation (-> animation-retargeting-in-unreal-engine). |
| **Retarget Source Asset** | If the Retarget Source property is set to Default (None), then the selected skeletal mesh here, will serve as the base pose for use when retargeting. Transform data will be saved in RetargetSouceAssetReferencePose. |
| **Preview Pose Asset** | The default Skeletal Mesh Pose Asset to use when previewing this Skeletal Mesh - this only applies when you open one of the Animation Editor modes using the associated asset. |
| **Asset User Data** | Asset User Data is a general array of applied functions that can be attached to animations in order to derive data or perform uniform behaviors. In addition to Animation Sequences this data is shared across multiple asset types such as, Skeletal Meshes and Skeleton Assets, and attach arbitrary user data to these targets. |
| **Allow Frame Stripping** | If enabled, this will allow low priority frames of animation to be removed if the export platform requests it. Can be disabled if animation has high frequency movements that are being lost. |
| **Compression Error Threshold Scale** | Set a scale for error threshold on compression. This is useful if the animation will be played back at a different applied scale. For example, if the animation will be played on an actor or component that is scaled up by a factor of 10, then set this value to 10. |
| **Bone Compression Settings** | The bone compression settings used to compress animation data on bones in this sequence. |
| **Curve Compression Settings** | The curve compression settings used to compress Anim Curve (-> animation-curves-in-unreal-engine) data in this sequence. |
| **Do Not Override Compression** | For use to prevent an override of the compression scheme when running a CompressAnimations commandlet. Some high frequency animations are too sensitive and shouldn't be changed. |
| **Additive Anim Type** | **Overview** Animations can be used as absolute or additive. When absolute animations are set to control the same bones, each will compete and influence one another. Additive animations can circumvent this issue by having priority of their respective region so as not to conflict with other animations. **Additive Animation** The Additive Animation calculates the delta, or the displacement value, from their starting position of the base animation and the current animation. You can then apply the difference of delta to any base animation with an Additive Animation. With Additive Animations you can create different permutations of animations by applying this delta to different base animations. Two necessary components are needed to create an additive animation. The **Current Animation** is the animation you wish to add to a base animation. The **Base Animation** is the foundation animation form which delta can be calculated. Which base animation is selected can change how the delta is extracted. **Additive Animation Type** This decides what kind of additive animation you want to use. **No additive**: This animation is not additive and will compete with any other animation data present. **Local Space**: This animation is additive and delta is calculated using the local space. This is the most common option for additive animation. Using the local space as reference the additive animation can implement delta, to smoothly incorporate the additive animation data onto the existing location of the properties. **Mesh Space**: This animation is additive and delta will be applied in component space. This is required for Aim Offset (-> aim-offset-in-unreal-engine) because aim offset should be applied in component space. There are many different ways to obtain the base animation pose to which the additive animation can be derived. After selecting which additive animation type, the options are as follows: **Skeleton Reference Pose**: will use the current skeleton's reference pose as the base pose. **Selected Animation Scaled**: will use a whole animation sequence as a base pose. BasePoseSeq must be set. **Selected Animation Frame**: Use one frame of an animation sequence as a base pose. BasePoseSeq and RefFrameIndex must be set (RefFrameIndex will be clamped). **Frame from this Animation**: Will use one specified frame of this animation as the base pose. |
| **EnableRootMotion** | If enabled, this will allow for extraction of root motion data and transfer it to in-place animation. For more information, see Root Motion (-> root-motion-in-unreal-engine). |
| **Root Motion Root Lock** | Root Bone will be locked to the following selected position when extracting root motion. **Ref Pose**: Use the Reference Pose's Root Bone position. **Anim First Frame**: Use the Root Bone position of the animation's first frame. **Zero**: Use the Root Bone position on the first frame of the Animation. |
| **Force Root Lock** | Enable to force Root Bone Lock even if Root Motion is not Enabled. |
| **Use Normalized Root Motion Scale** | If enabled, a normalized scale value for the root motion extracted: FVector(1.0, 1.0, 1.0) will be used. |
| **Animation length** | Select the desired animation range, or length to import. **Exported Time**: This option imports animation frames based on what is defined at the time of export. **Animated Time**: Will import the range of frames that have animation data assigned. Can be useful if the exported range is longer than the actual animation in the FBX file. **Set Range**: This will enable manual control to define the Start Frame and End Frame of the imported animation. |
| **Import Meshes in Bone Hierarchy** | If checked, meshes nested in bone hierarchies will be imported instead of being converted to bones. |
| **Frame Import Range** | If under the Animation Length property above, Set Range is selected, then you can manually set the frame range used during an importation or reimportation of the current animation. |
| **Use Default Sampler Rate** | If enabled, samples all animation curves to 30 FPS. |
| **Custom Sample Rate** | Sample FBX animation data at the specified sample rate. If set to 0, Unreal will automatically find the best sample rate. |
| **Import Custom Attribute** | If one is present, Unreal will import a custom attribute as a curve within the animation. |
| **Delete Existing Custom Attribute Curves** | If enabled, all previous custom attribute curves will be deleted when doing a re-import. |
| **Delete Existing Non Curve Custom Attributes** | If enabled, all previous non-curve custom attributes will be deleted when doing a re-import. |
| **Import Bone Tracks** | By default, Unreal is set to Import bone transform tracks. If disabled, this will discard any bon transform tracks. Useful for curves only animation. |
| **Set Material Curve Type** | Set Material Curve Type for all custom attributes that exist. |
| **Material Curve Suffixes** | Set Material Curve Type for a custom attribute with the following suffixes. This property is disregarded if Set Material Curve Type is true. |
| **Remove Redundant Keys** | If enabled, this will remove redundant keys when importing custom attributes as curves. |
| **Delete Existing Morph Target Curves** | If enabled, this will delete existing **Morph Targets** from the FBX. |
| **Do not import curves with only 0 values** | When enabled, Unreal will disregard any curves with a value of zero during Importation. Useful when importing custom attributes or Morph Targets as curves, to avoid adding extra curves to evaluate. |
| **Preserves Local Transform** | If enabled, this will import a curve within the animation. |
| **Import Transform** | Controllable offset for importation Transform placement. More relevant when working with Skeleton and Skeletal Mesh assets. |
| **Import Rotation** | Controllable offset for importation Rotation placement. More relevant when working with Skeleton and Skeletal Mesh assets. |
| **Import Uniform Scale** | Controllable Uniform Scale for importation. More relevant when working with Skeleton and Skeletal Mesh assets. |
| **Convert Scene** | Convert the scene from FBX coordinate system to UE coordinate system. |
| **Force Front XAxis** | Convert the scene from FBX coordinate system to UE coordinate system with front X axis instead of -Y. |
| **Convert Scene Unit** | Convert the scene from FBX unit to UE unit (centimeters), |
| **Source File** | Viewable file path for currently selected asset. |
| **Per Bone Custom Attribute Data** | Custom Attribute Data array for each bone in current Skeleton Asset. |
| **Data Model** | Here you can locate a viewable Data Asset containing important animation data for the current animation such as, Bone Animation Tracks and Curve Data, in addition to foundational values like the animations frame rate, sampled frames and keys. |
| **Controller** | Here you can locate an instance of the current animation's Data Controller. This asset handles the operation of the Data Model asset found above. |
| **Meta Data** | Meta data that can be saved with the asset. You can query available data with the 'GetMetaData' debug command. |

You can also double-click an animation from the Asset Browser (-> animation-sequence-editor-in-unreal-engine) panel to open its Asset Details.

### Skeletal Tree

Skeleton Tree panel displays the **Skeletal Hierarchy** of the current Skeleton Asset where you can create and edit skeleton Sockets (-> skeletal-mesh-sockets-in-unreal-engine) and define settings related to Animation Retargeting (-> animation-retargeting-in-unreal-engine).

 [image: animation skeleton tree window]

Although the Skeleton Tree is accessible in the Animation Sequence Editor, the panel and its contents are more relevant to the **Skeleton Editor** which you can find by following the link below.

Skeleton Editor (-> skeletons-in-unreal-engine)

## Viewport

The Viewport (-> unreal-editor-interface) window is where you can preview playback of animation assets on your selected Skeletal Mesh and provides information about your assets.

 [image: animation viewport window]

To see more information about the Viewport features unique to the Animation Editors, please see the Animation Viewport (-> animation-editors-in-unreal-engine) window.

## Details / Preview Scene Settings

The Editor Details panel, similar other **Details Panels** found in Unreal Engine, is primarily used for modifying options that have been added while working in the Asset Editor. For example, when you select a bone from the Skeleton Tree window, the Details panel will populate with options related to the selected bone.

 [image: details preview scene settings window]

For more information about The Editor Details Panel, see the Skeleton Editor (-> skeletons-in-unreal-engine) documentation.

Also located in this section is a tab for the Preview Scene Settings (-> animation-editors-in-unreal-engine) panel which enable the ability to control the preview settings such as selected animation, applied Skeletal Meshes, as well as viewport lighting and Post Process settings.

## Asset Editor

The Asset Editor is a contextual window that will change its interface and features based on the type of animation asset opened. You can playback and modify **Blend Spaces**, **Animation Montages**, and more.

 [image: asset editor window]

Here you will find links to the various animation assets in Unreal Engine. Each page contain descriptions of the asset type as well as an explanation of the unique Asset Editor layout and its properties.

- Animation Sequence (-> animation-sequences-in-unreal-engine)

- Pose Asset (-> animation-pose-assets-in-unreal-engine)

- Anim Blueprint (-> animation-blueprints-in-unreal-engine)

- Anim Composite (-> animation-composites-in-unreal-engine)

- Anim Montage (-> animation-montage-in-unreal-engine)

- Blend Space (-> blend-spaces-in-unreal-engine)

- Blend Space 1D (-> blend-spaces-in-unreal-engine)

- Aim Offset (-> aim-offset-in-unreal-engine)

- Aim Offset 1D (-> blend-spaces-in-unreal-engine)

## Asset Browser

Similar to Content Browser the Asset Browser is where you can view and filter animation assets associated with the current Skeleton Asset.

 [image: asset browser window]

- With the forward and backward buttons, you can navigate between previously selected animations.

- Here you can toggle the Other Developers filter to view assets located in other developers folders. For use on shared server team based projects.

- With the settings button you can access the Asset Browser's many settings, such as to toggle **View Options** such as the **Advanced Details** column, to view more advanced information about the listed assets.

Consistent color coding between the **Asset Browser** and the **Content Browser** is applied to each type of animation asset for easier distinction between asset types.

Animation assets can be opened in the **Animation Sequence Editor**, or the Content Browser from the Asset Browser by **double-clicking** the desired asset. Depending on the asset opened, the Asset Editor will populate with tools and properties relevant to the asset type automatically.

Before opening an asset you can hover your cursor over the asset to view advanced details.

 [image: asset browser mouse hover details]

**Right-clicking** an asset will open a context menu, with options to **Save** the asset, **Open** the asset in a new window, or **Browse** for the **File Path** in a File Explorer window on your computer.

- animation

On this page

- Toolbar (-> animation-sequence-editor-in-unreal-engine)
- Asset Details / Skeleton Tree (-> animation-sequence-editor-in-unreal-engine)
- Animation Asset Details (-> animation-sequence-editor-in-unreal-engine)
- Skeletal Tree (-> animation-sequence-editor-in-unreal-engine)
- Viewport (-> animation-sequence-editor-in-unreal-engine)
- Details / Preview Scene Settings (-> animation-sequence-editor-in-unreal-engine)
- Asset Editor (-> animation-sequence-editor-in-unreal-engine)
- Asset Browser (-> animation-sequence-editor-in-unreal-engine)

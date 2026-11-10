# Animation Sequences

https://dev.epicgames.com/documentation/en-us/unreal-engine/animation-sequences-in-unreal-engine?application_version=5.9

> Animation assets that contains animations for skeletal meshes.

[image: Animation Sequences]

## Overview

An Animation Sequence is an animation asset that contains animation data that can be played on a Skeletal Mesh (-> skeletal-mesh-assets-in-unreal-engine) to animate a character. An Animation Sequence contains keyframes that specify the position, rotation, and scale of the Skeletal Mesh's Skeleton (-> skeletons-in-unreal-engine) at specific points in time. By blending between keyframes during sequential playback, the Skeleton's motion animates the Mesh.

 [image: animation sequence demo]

Animation Sequences are tied to specific Skeletons, which enables animations to be shared across Skeletal Meshes that use the same Skeleton.

 [image: animations playing on the same skeleton with different meshes]

## Creating Animations

Animation Sequences are most often created in external animation and modeling software and are contained within an FBX file. You can import Animation Sequences into Unreal Engine during the FBX import process for use in your project.

### Importing Animations

To import an animation, select** Import** in the **Content Browser**.

 [image: import button in the content browser]

Navigate in your computer's File Explorer window and select the FBX file containing an animation you want to import.

You will be prompted with the **FBX Import Options** window. Here you can fine-tune the import process for animations.

 [image: fbx import options window]

The **FBX Import Options** window contains the following configurable properties:

| Property | Description |
| --- | --- |
| **Import Animation** | When importing an FBX file that contains animations, enable this property to import the animations as Animation Sequence Assets. |
| **Animation Length** | **Exported Time**: Imports animations at their exported lengths, based on time. **Advanced Time**: Imports animations at the length for which there is animation data present. **Set Range**: Imports animations at a set range of frames as defined in the **Frame Import Range** property. |
| **Override Animation Name** | If used, this property will override the name of the animation being imported with the given name. By default, animations will be imported with the name of the FBX file. |
| **Import Meshes in Bone Hierarchy** | If enabled, meshes nested within bone hierarchies will be imported separately instead of being converted to bones. |
| **Frame Import Range** | Defines the frame range that will be used when importing animations. Only used when **Animation Length** is set to **Set Range**. |
| **Default Sample Rate** | If enabled, all present animation curves will be sampled at 30fps. |
| **Custom Sample Rate** | Defines a custom sample rate to import animation data. If this is set to 0, Unreal Engine will automatically find the best sample rate. |
| **Import Custom Attribute** | If enabled, imports any FBX attribute as a Curve (-> animation-curves-in-unreal-engine), or as an Animation Attribute (-> fbx-attributes-in-unreal-engine). |
| **Delete Existing Custom Attribute Curves** | If enabled when re-importing, any present custom-attribute curves will be deleted. |
| **Delete Existing Non Curve Custom Attributes** | If enabled when re-importing, all previous non-curve attributes will be deleted. |
| **Import Bone Tracks** | If enabled, bone transform tracks will be imported. If disabled, all bone transform tracks will be discarded. It can be useful to discard bone transform tracks when working with curves-only animations. |
| **Set Material Curve Type** | When enabled, this property sets Material Curve Types for all custom attributes. |
| **Material Curve Suffixes** | Here you can manually set Material Curve Types for the custom attributes. This property has no effect if **Set Material Curve Type** is enabled. |
| **Remove Redundant Keys** | When enabled and importing custom attributes as curves, this property will remove unnecessary keys. |
| **Delete Existing Morph Target Curves** | If enabled, this property will delete any existing **Morph Target** curves. |
| **Do not Import Curve with Zero** | When enabled, any present curves with a value of 0 will be removed in order to avoid adding extra curves to evaluate. |
| **Preserve Local Transform** | If enabled, this property will import all present curves within the animation. |

Using the **Skeleton** property in the **Import Settings** window, you can choose a Skeleton which drives your imported animations. Leaving this property blank will import any skeletal structure found in the FBX file as a new Skeleton.

 [image: select skeleton option when importing an fbx file]

In order to drive any imported animations using an existing Skeleton, the animation must be using a similar skeleton. Unreal Engine will automatically match bones from the animation to match the existing Skeleton's bones using the bone **names** and **hierarchy** in the Skeleton Tree (-> skeleton-editor-in-unreal-engine).

Ensure the **Import Animation** option is enabled and select **Import**.

 [image: enable import animations and click import]

When importing multiple FBX files at once, you can use** Import All** to import all selected FBX files with the same **FBX Import Options**.

After the import process is complete, your animation will now appear as an Animation Sequence Asset in the Content Browser.

Animations with non-whole end frame values will not import into Unreal Engine correctly.

 [image: maya timeline showing an animation ending frame value of a decimal error importing animation]

You can correct this issue by importing the animation Sequenece into an external DCC and editing the end frame to a whole frame value or by setting the **Animation Length** property in the FBX Import Options to **Frame Range** and manually setting the **Frame Import Range** property in the Advanced section.

For more information on importing animations into Unreal Engine, see FBX Animation Pipeline (-> fbx-animation-pipeline-in-unreal-engine) and Importing Animations Using FBX (-> importing-animations-using-fbx-in-unreal-engine).

### Sequencer

Using Sequencer (-> fk-control-rig-in-unreal-engine), you can create animations in Unreal Engine with just a Skeletal Mesh. This can be useful if you want to save animations as a new Animation Sequence, when using the Animation Track (-> cinematic-animation-track-in-unreal-engine), or when animating using Control Rig (-> animating-with-control-rig-in-unreal-engine).

To create a new Animation Sequence from an animation created using Sequencer,** right-click** the Skeletal Mesh Actor track and select **Bake Animation Sequence** from the context menu.

 [image: bake animations as new animation sequences in control rig]

You can also create unique variants and modified versions of Sequences by editing existing animations with FK Control Rig.

For more information on Control Rig and how you can use Control Rig to animate characters in Unreal Engine, see the Control Rig (-> control-rig-in-unreal-engine) documentation.

## Editing Animation Sequences

When working with Animation Sequences, you can make additive edits and adjustments to existing animations using the Animation Sequence Editor (-> animation-sequence-editor-in-unreal-engine). Within the Animation Sequence Editor, you can preview playback, tweak animations with additive layers, and add notfies and curves.

 [image: animation sequence editor window]

The following are a few methods that you can use to edit and modify existing animations within your project.

### Additive Animation Tracks

You can tweak the position of your Character's bones in an Animation Sequence with the **Bone Manipulation** tool. Select a bone in the Viewport or the Skeleton Tree panel and, using the movement tools, manipulate a bones position and rotation.

 [image: manipulate the potion and rotation of selected bones in the viewport with the movement tools]

After manipulating a bone, add a key with **Add Key** in the **Toolbar** to save the movement data in an **additive animation track** that will appear in the sequence timeline.

 [image: after making a manipulation click add key add movement in an additive track]

The additive track will blend the bones' positions to match their manipulated positions at the added keyframes.

For more information about Bone Manipulation, see the Bone Manipulation (-> skeleton-editor-in-unreal-engine) section of the Skeleton Editor documentation.

### Record Feature

When editing an Animation Sequence, you can record directed movement in real time and save the animation as a new Sequence using the **Record Button**.

 [image: use the record button to record new animation sequences]

The resulting animation will then be usable as a unique Animation Sequence asset.

 [image: example new animation sequence from a recorded animation]

You can also use the record feature to create Assets from blended animations.

 [image: recording a blended animation in an animation blueprint]

## Sharing Animations

If your project is using a combination of different Skeletons and Skeletal Meshes, you can share Animation Sequences across these different Assets. There are a few methods of sharing animations or retargeting Skeletons that you can choose from depending on your project's needs.

 [image: IK rig retargeting example]

For Skeletal Meshes that do not share the same Skeleton but have **identical skeletal structures**, you can define their Skeletons as **Compatible** to share Animation Sequences. See the Compatible Skeletons (-> skeletons-in-unreal-engine) section of the **Skeleton** documentation for more information.

%animating-characters-and-objects/SkeletalMeshAnimation/AssetsFeatures/Skeleton:topic%

To share Animation Sequences between Skeletal Meshes that share the same Skeleton but possess **different mesh proportions**, you can use Animation Retargeting. See the Animation Retargeting (-> animation-retargeting-in-unreal-engine) documentation for more information.

You can use Animation Sequences from one Skeletal Mesh to create **new Animation Sequences** for another Skeletal Mesh using a different Skeleton with IK Rig Retargeting. See the IK Rig Retargeting documentation for more information.

%animating-characters-and-objects/SkeletalMeshAnimation/AssetsFeatures/IKRig/IKRetargeting:topic%

## Animation Compression

Compression Settings are data Assets that you can define. They apply compression to animation Assets. Compression removes animation data, lowering your animation's memory cost to improve your project's performance. Animations with minimal movement are affected less by compression, while compression effects on animations with intricate movement will be far more noticeable.

To create a Compression Settings asset, click the **Add (+)** in the Content Browser; and, from the context menu, select **Animation > Bone Compression Settings** or **Curve Compression Settings**.

 [image: add compression asset in the content browser]

After creating a compression Asset, you can open its **Details** panel by **double-clicking** it in the **Content Browser**.

### Bone Compression Settings

The Bone Compression Settings Asset is used to define and apply a compression method to an Animation Sequence's bone data. Bone compression removes unnecessary or arbitrary bone motion data based on the codec method you define in the Bone Compression Settings' properties.

 [image: bone compression settings asset settings]

The Bone Compression Settings Asset has the following configurable properties:

| Property | Description |
| --- | --- |
| **Codecs** | Here you can define a list of animation bone compression codecs to try when compressing bone data in an Animation Sequence. The available Codes are as follows: **Anim Compress Bitwise Compress Only**: Focuses on Bitwise compression and retains all keys. **Anim Compress Least Destructive**: Restores any present animation compression to raw data. **Anim Compress Per Track Compression**: Focuses compression to a per- track basis, and compresses each track individually. **Anim Compress Removes Every Second Key**: Removes every second key present in the animation. **Anim Compress Revolve Linear Keys**: Removes any keys that are unchanged from surrounding keys. **Anim Compress Removes Trivial Keys**: Removes any keys where position and orientation of Assets are unchanged from surrounding keys. Empty entries in the list are ignored when running bone compression on the Animation Sequence. However, the list must contain at least one codec in order to compress the bone data. |
| **Error Threshold** | When enabled and triggered during compression, this property will use the best codec below this error threshold. The default error threshold value is 0.1. |
| **Force Below Threshold** | If enabled, any codec with a lower error threshold will be used until it falls below the threshold. |

You can apply a Bone Compression Settings Asset in the Animation Sequence's **Asset Details** panel, under the **Bone Compression Settings** property.

 [image: add bone compression asset]

### Curve Compression Settings

When using curves to drive animation sequence properties, curve compression can provide a useful resource to maintain your project's performance.

 [image: curve compression settings asset settings]

The Curve Compression Settings Asset has the following configurable properties:

| Property | Description |
| --- | --- |
| **Codec** | Define the animation curve compression Codec. The available codec types you can choose are as follows: **Compressed Rich Curves**: Only targets and compresses Rich Curves. **Uniform Indexable**: Compresses curves so that their points are indexable for other features to access. **Uniformly Sampled**: After compression, any curves will be sampled at a uniform rate. |
| **Max Curve Error** | Maximum error threshold allowed when compressing Rich Curves. By default, this value is 0. |
| **Use Anim Sequence Sample Rate** | Enable this property to use an explicit value for the Animation Sequence sample rate. |
| **Error sample rate** | When Use Anim Sequence Sample Rate is enabled, the Animation Sequence will use the defined value as the sample rate to use when measuring the curve error. By default, this value is 60. |

You can apply a Curve Compression Settings Asset in the Animation Sequence's Asset Details panel, under the Curve Compression Settings property.

 [image: add curve compression settings asset]

## Animation Sequence Features

Here, you can find related Animation Sequence features you can use when working with Animation Sequences in your project.

- animation
- animation blending
- animation assets
- animation montage

On this page

- Overview (-> animation-sequences-in-unreal-engine)
- Creating Animations (-> animation-sequences-in-unreal-engine)
- Importing Animations (-> animation-sequences-in-unreal-engine)
- Sequencer (-> animation-sequences-in-unreal-engine)
- Editing Animation Sequences (-> animation-sequences-in-unreal-engine)
- Additive Animation Tracks (-> animation-sequences-in-unreal-engine)
- Record Feature (-> animation-sequences-in-unreal-engine)
- Sharing Animations (-> animation-sequences-in-unreal-engine)
- Animation Compression (-> animation-sequences-in-unreal-engine)
- Bone Compression Settings (-> animation-sequences-in-unreal-engine)
- Curve Compression Settings (-> animation-sequences-in-unreal-engine)
- Animation Sequence Features (-> animation-sequences-in-unreal-engine)

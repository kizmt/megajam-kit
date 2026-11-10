# Auto Retargeting

https://dev.epicgames.com/documentation/en-us/unreal-engine/auto-retargeting-in-unreal-engine?application_version=5.9

> Use the Auto Retarget Chains tool and the Auto Align tools to automatically generate IK chains for Skeletal Mesh Characters.

Retargeting a character’s animations to a new character skeleton can be a manual and intensive process. You can retarget animations directly from the **Content Browser** when selecting two Animation Sequence assets, that use different Skeleton Assets, using the **Retarget Animation Assets** context menu option.

 [image: ImageAltText]

Additionally, using the **Auto Retarget Chains** tool in the IK (Inverse Kinematic) Rig asset editor, you can automatically generate retarget chains for a Skeletal Mesh character. After generating or manually setting retarget chains, you can use the **Auto Align** tool in the IK Retargeter asset editor, to automatically align character poses based on the IK Rig chains, for entire skeletons or individual bones.

### Auto Retargeting Animations

You can retarget animations from one Skeletal Mesh to be played back on another Skeletal Mesh asset directly from the Content Browser.

#### Prerequisite

- Your project contains two Skeletal Mesh assets with different Skeletons.

- At least one of the Skeletal Mesh assets has Animation Sequences you want to retarget.

### Retargeting Animations

You can retarget animations directly in the Content Bowser. To retarget an Animation Sequence **right-click** the asset and select the** Retarget Animation Assets **option in the context menu.

 [image: ImageAltText]

Then set the Target Preview Mesh property with the Skeletal Mesh asset you want to retarget the Animation Sequence too. [image: ImageAltText]

After opening the Source and Target meshes in the Auto Retarget window, select the animation assets you would like to retarget in the Asset Browser panel by multi-selecting the assets using** Shift **+ **Click**, or **Ctrl** + **Click**.

 [image: ImageAltText]

After making your selections use the **Export Animations** button to open the export options.

 [image: ImageAltText]

The Export Options will not appear if you are using a pre-configured IK Retargeter asset.

Using the** Export Animations** window, select the file destination you would like to save your retargeted animations to and use the** Export** button.

 [image: ImageAltText]

You can also set naming properties, such **Add Prefix**, **Add Suffix**, or finding and replacing words or characters, to rename your retargeted animations during the export process using the **Rename New Assets** properties.

 [image: ImageAltText]

You can now use the retargeted animations with your Target Skeletal Mesh.

When exporting multiple retargeted Animation assets, the **Batch Export Options** window. Here you can reference the available options and a description of their functionality:

 [image: ImageAltText]

| Property | Description |
| --- | --- |
| **Overwrite Existing Files** | Any files with the same name will be overwritten instead of creating new files with numeric suffixes. This is useful when iterating on a batch process. |
| **Include Referenced Assets** | Duplicates and retargets any animation assets referenced by the input assets. For example, sequences in an animation blueprint or blendspace. |

Additionally you can use the Export Retarget Assets button to export the generated IK Rig and IK Retagreter assets.

 [image: ImageAltText]

## Retarget Animations Window

Here is an overview of the Retarget Animations window:

 [image: ImageAltText]

- **Viewport:** Here you can see the two Skeletal Mesh assets you have selected to retarget animations with. The left mesh will be the Source Mesh, the right mesh will be the Target Mesh.

- **Retarget Output Log:** Here you can view messages about the retargeting process, such as messages that will provide information and insight if the retargeting process was unsuccessful.

- Details Panel (-> auto-retargeting-in-unreal-engine)

- **Asset Browser**: Here you can view the available animation assets of the Source Mesh you can select to retarget. You can double click assets in the panel to preview their playback in the Viewport. Use the Checkbox to the left of each animation asset to set it to be retargeted.

- **Retarget Animations Button**: Use this button to begin retargeting the selected animations in the Asset Browser from the Source Mesh to the Target Mesh.

#### Details Panel

Here you can reference a list of the available options that you can use to set up the Animation retargeting process:

| Property | Description |
| --- | --- |
| **Source Preview Mesh** | Here you can view or change the **Source** Skeletal Mesh you are using to retarget animations from. |
| **Target Preview Mesh** | Here you can view or change the **Target** Skeletal Mesh you are retargeting animations too. |
| **Auto Generate Retargeter** | When **enabled**, the Retarget Animations window will automatically retarget the selection animations by creating **IK Rig** assets and an **IK Retargeter** asset for the Source and Target Skeletal Mesh. When **not enabled**, you can set a custom IK Retargeter asset to set the properties of the Retargeting process using the **IK Retargeter Asset** property. By default, this property is enabled. |
| **IKRetargeter Asset** | When the **Auto Retarget** property is **not enabled**, you can set a IK Retargeter asset that will be used to retarget the animations from the Source Skeletal Mesh to the Target Skeletal Mesh. |

## Auto Retarget Chains

Use the Auto Retarget Chains tool in the IK Rig asset editor, to automatically generate retarget chains for your Skeletal Mesh character.

 [image: ImageAltText]

#### Prerequisite

- Your project contains a Skeletal Mesh character with an** IK Rig** asset. For more information about setting up an IK Rig asset, see the Creating an IK Rig section (-> ik-rig-in-unreal-engine) of the IK Rig Editor documentation.

### Generating Retarget Chains

After creating your IK Rig asset for your Skeletal Mesh, open the IK Rig asset editor by** double clicking** the asset in the **Content Browser**. You can then use the **Auto Retarget Chains** tool in the toolbar to initiate the automatic retarget chain generation.

 [image: ImageAltText]

This process will analyze the hierarchy of your Skeletal Mesh’s skeleton, and try to match bone chains with pre-configured templates based on the bone names.

The naming convention of your skeleton hierarchy is a factor in how well the Auto Retarget Chains tool will work, but exact name matches are not required. For example, if your Skeleton has a series of bones that comprise the spine named `spineBone_{}` these bones will be matched with the Biped template’s `Spine_{}` bones.

Structures like spine and neck chains can contain more or less bones than the templates and the chains will adapt, growing or shrinking, to accommodate all of your character’s bones. After the generation process is complete you will see the new chains in the IK Retargeting panel of the IK Rig asset editor, and a notification window will appear in the bottom right corner of the editor window.

The IK Rig will attempt to match your character’s skeleton with the pre-configured templates, in order to generate retarget chains for the IK Rig asset. In situations where an exact match is not found, the notification window will display a warning with insights into how you can improve your results. In situations where the IK Rig asset editor can not match your character’s skeleton with a template, the notification window will display an error message.

For more information about the kind of skeletons the Auto Generate Chains tool can reference, see the Templates Section (-> auto-retargeting-in-unreal-engine) of this document.

## Auto Create FBIK

You can use the** Auto Create IK** tool to automatically generate a **FBIK** (Full Body Inverse Kinematic) solver for your Skeletal Mesh character, along with FBIK solver settings, goals and bone settings for preferred angles.

#### Prerequisite

- Your project contains a Skeletal Mesh asset with an** IK Rig** asset. For more information about setting up an IK Rig asset, see the Creating an IK Rig section (-> ik-rig-in-unreal-engine) of the IK Rig Editor documentation.

To use the **Auto Create IK** tool, open your IK Rig asset in the IK Rig asset editor by **double-clicking** it in the **Content Browse**r. Then use the **Auto Create IK** tool in the toolbar.

 [image: ImageAltText]

The Auto Create FBIK tool generates a FBIK solver by analyzing your Skeletal Mesh’s skeleton and trying to match bone hierarchies to match a set of pre-configured templates. These templates contain tuned FBIK solvers for common skeleton hierarchies, that the Auto Create FBIK tool can apply to your Skeletal Mesh. The process involves analyzing the names of your bones.

For more information about the kind of skeletons the Auto Create FBIK tool can reference, see the Templates Section (-> auto-retargeting-in-unreal-engine) of this document.

While the naming convention your skeletal mesh uses is a factor in how well the process works, it does not require exact matches of bone names.

## Templates

Here you can reference a list of the pre-configured templates that the IK Rig asset editor can use to automatically generate retarget chains for your skeletal mesh characters:

| Mesh Type | Example Skeletons |
| --- | --- |
| **Common Biped Skeletons** | Bipeds are human like characters standing on two feet. UE4 and UE5 Mannequins Metahumans Stack O Bot |

For more information about the structures of skeletons that are supported when using the Auto Retargeting workflow, see the Auto Retargeting for Bipeds video.

## Auto Align Poses

You can use the **Auto Align** tool in the IK Retargeter asset editor to quickly realign source mesh poses to match the Target mesh poses.

 [image: ImageAltText]

#### Prerequisites

- You have two Skeletal Mesh assets with** IK Rig **assets. For more information about setting up an IK Rig asset, see the Creating an IK Rig section (-> ik-rig-in-unreal-engine) of the IK Rig Editor documentation.

- You have a **IK Retargeter **asset with a** Source** and** Target IK Rigs **defined. For more information about setting up an IK Retargeter asset, see the IK Rig Retargeting doucumentaiton.

### Auto Aligning Character Poses

After creating your IK Retargeter asset and defining your Source and Target IK Rigs for your characters, set the Editor to the **Edit Retarget Pose** mode in the menu bar.

 [image: ImageAltText]

You can now use the various properties in the Auto Align tool’s context menu to copy the pose of the Source IK Rig to the Target IK Rig.

 [image: ImageAltText]

You can use the following options when using the Auto Align tool:

| Property | Description |
| --- | --- |
| **Align All Bones** | Automatically aligns all bones of the Target Skeletal Mesh to match the position and rotation of the Source Skeletal Mesh. |
| **Align Selected** | Aligns only the selected bones of the Target Skeletal Mesh to the position and rotation of the corresponding bones in the Source Skeletal Mesh’s hierarchy. This option is helpful when you want to isolate what bones you want to retarget, for example, you may only want to retarget a character's lower body animation, rather than the entire skeleton, to retarget a walking or running animation. |
| **Align Selected and Children** | Aligns the selected bones, and the bones lower in the bone’s chain of the Target Skeletal Mesh to the position and rotation of the corresponding bones in the Source Skeletal Mesh’s hierarchy. This option automatically aligns all the bones in a chain, such as a limb, without needing to select every bone individually. |
| **Align Selected Using Mesh** | This property will align all the skinned vertices of the Target Skeletal Mesh associated with the selected bones, with the corresponding Source Skeletal Mesh. You must select a bone or a series of bones to use this option. |
| **Snap Character to Ground** | This property will snap the lowest point in the character’s mesh to the ground in order to realign the Skeletal Mesh. When Auto Aligning characters with different proportions this can be useful to ensure the character is not floating in the final retargeted animation assets. |

This property is useful when the bone alignments are not producing adequate results between your meshes such as when your Target Skeletal Mesh has very different mesh geometry than the Source Skeletal Mesh.

Depending on the mode the IK Retarget asset editor is set to, the auto align tool can be used to copy poses from the source mesh to the target, or from the target mesh to the source mesh.

 [image: ImageAltText]

- animation
- control rig
- sequencer

On this page

- Auto Retargeting Animations (-> auto-retargeting-in-unreal-engine)
- Prerequisite (-> auto-retargeting-in-unreal-engine)
- Retargeting Animations (-> auto-retargeting-in-unreal-engine)
- Retarget Animations Window (-> auto-retargeting-in-unreal-engine)
- Details Panel (-> auto-retargeting-in-unreal-engine)
- Auto Retarget Chains (-> auto-retargeting-in-unreal-engine)
- Prerequisite (-> auto-retargeting-in-unreal-engine)
- Generating Retarget Chains (-> auto-retargeting-in-unreal-engine)
- Auto Create FBIK (-> auto-retargeting-in-unreal-engine)
- Prerequisite (-> auto-retargeting-in-unreal-engine)
- Templates (-> auto-retargeting-in-unreal-engine)
- Auto Align Poses (-> auto-retargeting-in-unreal-engine)
- Prerequisites (-> auto-retargeting-in-unreal-engine)
- Auto Aligning Character Poses (-> auto-retargeting-in-unreal-engine)

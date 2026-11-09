# Skeletons

https://dev.epicgames.com/documentation/en-us/unreal-engine/skeletons-in-unreal-engine?application_version=5.9

> Learn about Skeletons, Bones, and animation data management in Unreal Engine.

[image: Skeletons]

A **Skeleton **is a hierarchy that is used to define **Bones **(sometimes called **joints**) in a Skeletal Mesh (-> skeletal-mesh-actors-in-unreal-engine). In some ways, these Bones mimic a real biological skeleton due to their position and control over how characters deform.

In Unreal Engine, Skeletons are used to store and associate animation data, the overall skeletal hierarchy, and Animation Sequences (-> animation-sequences-in-unreal-engine). Skeleton Assets can also be shared through a variety of methods, enabling for additional animations and data to be shared between different Skeletons.

This document provides an overview of how to create and use Skeletons.

#### Prerequisites

- Your project contains a Skeletal Mesh Actor (-> skeletal-mesh-actors-in-unreal-engine), or you have a skinned FBX character to import into Unreal Engine.

## Creating Skeletons

The primary way to create a Skeleton is to import (-> importing-skeletal-meshes-using-fbx-in-unreal-engine) a skinned character FBX, which then converts to a **Skeletal Mesh** in Unreal Engine. When importing a Skeletal Mesh, in the FBX Import Options (-> fbx-import-options-reference-in-unreal-engine) window, leaving the **Skeleton **field empty will automatically create a Skeleton Asset based on the skinned character being imported.

[image: import skeletal mesh]

After importing your character, the **Skeleton Asset** will be created along with other Skeletal Mesh Assets.

[image: skeleton asset]

You can also create a copy of a Skeleton from any Skeletal Mesh by right-clicking on it in the **Content Browser** and selecting **Skeleton > Create Skeleton**. This creates a new Skeleton associated with an existing mesh. If that mesh had another Skeleton associated with it, it will re-link to the new Skeleton and any animations will then link to the new Skeleton.

[image: create skeleton copy]

Double-click the Skeleton Asset to open the Skeleton Editor (-> skeleton-editor-in-unreal-engine).

[image: skeleton editor]

## Skeleton Tree Information

Bones and other items displayed in the Skeleton Tree (-> skeleton-editor-in-unreal-engine) can appear different depending on several factors.

| Icon | Description |
| --- | --- |
|  | A normal Bone that influences vertices on the Skeletal Mesh. |
|  | A Bone in the current Skeleton that doesn't influence vertices on the Skeletal Mesh. These Bones are typically used in an auxiliary manner, such as for attaching weapons or props, while still being animatable as a Bone. |
|  | A Socket (-> skeletal-mesh-sockets-in-unreal-engine), which is a static point that acts as an offset attachment point for Bones. |
|  | A Virtual Bone (-> virtual-bones-in-unreal-engine), which is a Bone that follows the transforms of another Bone, but in a different Bone space. These are useful for locking down unwanted joint movements, and are used in conjunction with IK (-> animation-blueprint-two-bone-ik-in-unreal-engine). |
|  | A Bone that exists in the Skeleton, but is not used by the current Skeletal Mesh. This can happen if you have merged (-> skeletons-in-unreal-engine) Skeletons, or are previewing different LODs on this Skeleton that are not using certain Bones. |

## Animation Data Storage

In addition to controlling animation, Skeletons in Unreal Engine also store animation-specific data. When data is created from those sources, such as creating an Animation Notify (-> animation-notifies-in-unreal-engine) in an Animation Sequence, it gets added to the Skeleton as shared data.

Skeletons store the following types of animation data:

- Animation Notifies (-> animation-notifies-in-unreal-engine).
- Animation Curves (-> animation-curves-in-unreal-engine).
- Slots (-> animation-slots-in-unreal-engine).
- Retarget Sources (-> retarget-manager-in-unreal-engine).
- Blend Profiles and Blend Masks (-> blend-masks-and-blend-profiles-in-unreal-engine).

This data can be viewed in dedicated tool panels by clicking **Window **in the Skeleton Editor menu, then enabling one or more of these panels.

[image: animation data panels]

## Sharing Skeletons

An important feature of Skeleton Assets is that a single Skeleton Asset can be used by multiple Skeletal Meshes, so long as the Skeletal Meshes use the same general rig hierarchy. This means that the names and hierarchical order of your Bones must be consistent in order for sharing to work correctly.

For example, consider a limb with three Bones in a Skeletal Mesh. The bones are named **1**, **2**, and **3**:

[image: sharing skeleton example 1]

If you want to share this Skeleton with another Skeletal Mesh, you will need to keep these Bones in the same order and with the same names. The second Skeletal Mesh, however, can contain Bones that are additions or peripheral to the hierarchy. Any time animation data is received for a Bone that is not included in the Skeletal Mesh, that animation data will be ignored.

In that case, your new hierarchy could look like the image below. Here, the second Skeletal Mesh has extra Bones, while still retaining and not interfering with the original hierarchy from the first Skeletal Mesh.

[image: sharing skeleton example 2]

However, in order for both Skeletal Meshes to use the same Skeleton Asset, you cannot change the hierarchy order or rename the Bones. If a second Skeletal Mesh uses a different Bone hierarchy and naming structure, you will need to create a new Skeleton Asset.

[image: sharing skeleton example 3]

If you insert a bone into the hierarchy without changing the order, you will be able to share successfully. However in most cases the extra bone may cause unintended transform offsets in your skeleton. It is recommended that you avoid this if possible.

[image: sharing skeleton example 4]

Taking these sharing rules into account, there are several ways you can share Skeletons between Skeletal Meshes in Unreal Engine. These are detailed below.

### Merging during Import

The first method for sharing Skeletons is done during the FBX import process. When importing your new Skeletal Mesh (with additional and peripheral Bones compliant with the rules above), you can select a Skeleton from a Skeletal Mesh that already exists in your project. Unreal Engine will then merge the Skeletons, appending any new Bones into the hierarchy. Additionally, your Skeleton's proportions will be defined by the original Skeletal Mesh from which it was created.

[image: merge sharing]

If you are importing a Skeleton that is vastly different from the Skeleton you are attempting to merge to and breaks any sharing rules, you will see an error message:

[image: failed to merge bones]

In this case, you may need to create a new Skeleton Asset for the Skeletal Mesh you are importing, rather than merge into an existing one.

When viewing your merged Skeleton, you will see these additional Bones listed in your hierarchy, but they will only be visible and active for the Skeletal Mesh they are intended for.

|  |  |
| --- | --- |
|  |  |
| Skeletal Mesh Variant 1 | Skeletal Mesh Variant 2 |

### Compatible Skeletons

Additionally, skeletons can non-destructively share animation assets by defining other skeletons as compatible. Compatible skeletons can share Animation Sequences (-> animation-sequences-in-unreal-engine), Montages (-> animation-montage-in-unreal-engine), Animation Blueprints (-> animation-blueprints-in-unreal-engine), and more.

To define another skeleton as compatible for a character, open the character's skeleton asset in the Skeleton Editor (-> skeleton-editor-in-unreal-engine), and then open the **Retarget Manager** by clicking the button in the **Toolbar**.

[image: compatible skeletons]

In the **Retarget Manager**, locate the **Manage Compatible Skeletons** section of the **Retarget Sources** panel and click **Add Skeleton** to select another skeleton asset in your project using the context menu.

[image: add compatible skeleton]

Now, animations can be shared from the Skeleton that was added to the **Manage Compatible Sources** list.

[image: compatible skeletons]

Skeleton compatibility is bi-directional. If you set Skeleton 1 to be compatible with Skeleton 2, that also means that Skeleton 2 is now compatible with Skeleton 1.

Creating and managing a system of compatible skeletons can be an effective way to optimize the number of animation assets your project requires to animate multiple characters. However, in order to utilize the Compatible Skeletons system, all characters must have nearly identical skeleton hierarchy structures and naming conventions. Additionally, all characters must have similar mesh proportions to achieve ideal results.

To share animations across characters with the same skeleton structure but with different proportions see the Animation Retargeting (-> animation-retargeting-in-unreal-engine) documentation.

To rebuild animation sequences to work across characters with radically different skeleton structures, see the IK Rig Retargeting (-> ik-rig-animation-retargeting-in-unreal-engine) documentation.

## Skeleton Features

Skeletons in Unreal Engine support a variety of features for attaching, blending, and other settings. Refer to the following pages to learn more about these features:

- [image: Animation Retargeting] Animation RetargetingDescribes how retargeted animations can be used with multiple Skeletal Meshes, allowing you to share animations. (-> animation-retargeting-in-unreal-engine)
- [image: Blend Masks and Blend Profiles] Blend Masks and Blend ProfilesExclude Bones or change their individual blend speed by using Blend Masks and Blend Profiles. (-> blend-masks-and-blend-profiles-in-unreal-engine)
- [image: Skeletal Mesh LODs] Skeletal Mesh LODsGenerate and modify LODs for Skeletal Meshes using the Skeletal Mesh Reduction Tool (-> skeletal-mesh-lods-in-unreal-engine)
- [image: Skeleton Editing] Skeleton EditingCreate and edit skeleton assets using the Skeleton Editing tools. (-> skeleton-editing-in-unreal-engine)
- [image: Skeletal Mesh Sockets] Skeletal Mesh SocketsCreate attachment points within your Skeletal Mesh using Sockets. (-> skeletal-mesh-sockets-in-unreal-engine)
- [image: Virtual Bones] Virtual BonesResolve layered animation problems by using Virtual Bones with IK. (-> virtual-bones-in-unreal-engine)

- animation
- skeleton

On this page

- Prerequisites (-> skeletons-in-unreal-engine)
- Creating Skeletons (-> skeletons-in-unreal-engine)
- Skeleton Tree Information (-> skeletons-in-unreal-engine)
- Animation Data Storage (-> skeletons-in-unreal-engine)
- Sharing Skeletons (-> skeletons-in-unreal-engine)
- Merging during Import (-> skeletons-in-unreal-engine)
- Compatible Skeletons (-> skeletons-in-unreal-engine)
- Skeleton Features (-> skeletons-in-unreal-engine)

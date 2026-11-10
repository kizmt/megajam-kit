# Animation Curves

https://dev.epicgames.com/documentation/en-us/unreal-engine/animation-curves-in-unreal-engine?application_version=5.9

> Animate Material Parameters, Morph Targets, and other properties synchronized to your animations using Animation Curves.

[image: Animation Curves]

As you play Animation Sequences (-> animation-sequences-in-unreal-engine) on your **Skeletal Mesh**, you may find it necessary to animate additional properties and values synchronized to that animation. You can accomplish this using **Animation Curves** (also called **anim curves**, or **curves**), which are float-type values you can add and keyframe within an Animation Sequence. Curves can be useful for augmenting your animations with additional animatable properties, such as animating Material Parameters (-> instanced-materials-in-unreal-engine), Morph Targets (-> fbx-morph-target-pipeline-in-unreal-engine), and other attributes.

This document provides an overview of Animation Curves, and the various ways you can use them.

#### Prerequisites

- Your project contains a Skeletal Mesh (-> skeletal-mesh-assets-in-unreal-engine) and Animation Sequences (-> animation-sequences-in-unreal-engine).

- If you are using anim curves to affect **Material Parameters**, you need a basic understanding of Material Instancing (-> instanced-materials-in-unreal-engine).

- If you are using anim curves to affect **Morph Targets**, you need a basic understanding of setting up Morph Targets (-> fbx-morph-target-pipeline-in-unreal-engine) on your Skeletal Mesh.

## Creating Animation Curves

Animation Curves can be created in the following ways:

- When viewing an **Animation Sequence** in the Animation Sequence Editor (-> animation-sequence-editor-in-unreal-engine), click the **Curves **track dropdown menu and select **Add Curve… > Create Curve**. Type in the name of the new curve and press **Enter **to create it. [image: create curve]

- In the Anim Curves panel (-> animation-curves-in-unreal-engine), right-click in the **curve list area** and select **Add Curve**. Type in the name of the new curve and press **Enter **to create it. [image: anim curve panel add curve]

- If your skeleton already has curves, you can select them from the **Curves > Add Curve…** dropdown menu. [image: add existing curve]

Animation Curves are stored on the **Skeleton Asset**. Therefore, when you are creating curves, you are also editing the Skeleton (-> skeletons-in-unreal-engine), which will require you to save it.

### Importing Animation Curves

Custom attributes can also be created externally in animation software like Autodesk Maya, and then imported as curves along with your Animation Sequence.

To do this, first create a custom attribute on any bone in your skeleton and keyframe it. You must ensure that it is a float-type attribute, as that is the only compatible data type with curves. Once finished, export your animation.

 [image: create bone attribute]

Your custom attribute must be keyframed in order for curve data to correctly import.

Next, import your Animation Sequence (-> animation-sequences-in-unreal-engine) containing the custom attributes. When importing the FBX, ensure that **Import Custom Attribute** is enabled.

 [image: import animation]

Once imported, your curves should appear in your Animation Sequence. In this example, two attributes were created on different bones and then imported.

 [image: attribute to curve]

## Creating Curve Animation

Once you have created an Animation Curve and added it to your Animation Sequence, you can animate its value. Select the **Curve **dropdown menu on the Animation Curve track and click **Edit Curve**. This will open the Curve Editor (-> animation-curve-editor-in-unreal-engine).

 [image: edit curve]

You can also open the Curve Editor by double-clicking the **timeline region** for the specific curve track.

 [image: double click to edit curve]

Once the Curve Editor is open, you can create keyframes by pressing **Enter**. This creates a keyframe at the **Playhead **location, which can be moved by dragging it to set keyframes at different times along the sequence. You can click and drag keyframes to change their time and value.

 [image: edit curve in curve editor]

Refer to the Curve Editor (-> animation-curve-editor-in-unreal-engine) page for more information on navigation, keyframes, and tangent editing using the Curve Editor.

## Anim Curves Panel

Your created and stored curves can be viewed and managed from the **Anim Curves** panel. To view this panel, navigate to the main editor menu and enable **Window > Anim Curves**. The Anim Curve panel can only be viewed from the Skeleton Editor (-> skeleton-editor-in-unreal-engine), Animation Sequence Editor (-> animation-sequence-editor-in-unreal-engine), or Animation Blueprints Editor (-> animation-blueprint-editor-in-unreal-engine).

 [image: anim curves panel]

### Curve Management

Several settings and features can be adjusted on your curve entries within the Anim Curve panel.

 [image: curve settings]

| Name | Description |
| --- | --- |
| **Curve Name** | The name of the curve. You can rename curves by right-clicking one in the Anim Curve panel and selecting **Rename Curve**. [image: rename curve] |
| **Type** | Enables this curve to either be used for Morph Targets (-> animation-curves-in-unreal-engine) or Materials (-> animation-curves-in-unreal-engine). |
| **Weight** | The current value of the curve. |
| **Auto** | Enabling this causes the **Weight** value to change automatically according to its keyframed values if the curve is being animated in this sequence. If disabled, it ignores its animated values. Disabling this can be useful for testing how the curve value affects the character without keyframing it. [image: auto setting] |
| **Bones** | The number of bones connected (-> animation-curves-in-unreal-engine) to this curve. |

### Curve Filtering

You can filter the list of curves in the Anim Curves panel to display only the actively-used curves, or only certain types of curves.

- Disabling **All Curves** causes only the currently-used curves for this Animation Sequence to be displayed.

- Disabling **Morph Target**, **Attribute**, and **Material **curves disables those curve types from being displayed.

 [image: curve filtering]

### Curve Details

Selecting a curve reveals the following properties in the **Details **panel.

 [image: curve details]

| Name | Description |
| --- | --- |
| **Curve Name** | The name of the curve. |
| **Connected Bones** | An array of bones that you can connect to this curve. This is useful if you want certain curves to be active depending on if a bone is being used or not. Bones can be active or inactive depending on if different skeletons are merged (-> skeletons-in-unreal-engine), or bones are being reduced (-> skeletal-mesh-lods-in-unreal-engine) for different LODs. |
| **Max LOD** | The maximum LOD (-> skeletal-mesh-lods-in-unreal-engine) to use before this curve no longer evaluates. For example, setting this value to **1** will cause this curve to evaluate for LODs 0 and 1, but not for 2 and beyond. |

## Using Animation Curves

Once you have created and animated your curve, there are a variety of ways you can use it to affect your character.

### Materials

You can use Animation Curves to automatically affect Scalar Material Parameters (-> instanced-materials-in-unreal-engine). This requires you to do the following:

- Match the curve name to the name of the Material Parameter in the Material. [image: curve name matching material parameter]

- Enable the Material curve type in the **Anim Curves** panel. [image: enable material type on anim curve]

Once this is done, the curve value starts to affect the Material Parameter.

 [image: curve affecting material]

Material Animation Curves affect all Materials (and their parameters) assigned to a Skeletal Mesh. Therefore, you may need to adjust your content appropriately if you want your anim curve to only affect a parameter from a single Material. This can happen if your Skeletal Mesh has multiple assigned Materials deriving from a single parent, which will cause parameter names to share between all assigned Materials.

 [image: multiple materials]

### Morph Targets

Similarly to Materials, you can use Animation Curves to automatically affect Morph Targets (-> fbx-morph-target-pipeline-in-unreal-engine) on your Skeletal Mesh. This requires you to do the following:

- Match the curve name to the name of the Morph Target found in the Morph Target Previewer (-> morph-target-previewer) [image: match anim curve name to morph target]

- Enable the Morph Target curve type in the **Anim Curves** panel. [image: enable morph target type on anim curve]

Once this is done, the curve value starts to affect the Morph Target.

 [image: curve affecting morph target]

### Animation Blueprints

You can use Animation Curves to affect arbitrary values in Animation Blueprints (-> animation-blueprints-in-unreal-engine). In most cases, you can use them to affect the alpha values of certain Anim Graph nodes, such as IK, in order to change IK states during animation playback.

 [image: curve values in animation blueprints]

The following curve-related functions are available in both the Animation Blueprint Anim Graph, and Event Graph:

| Name | Image | Description |
| --- | --- | --- |
| **Get Active Curve Names** | [image: get active curve names] | This targets an Anim Instance and returns the last up-to-date list of active curve names for the specified curve type. |
| **Get All Curve Names** | [image: get all curve names] | This targets an Anim Instance and returns all Curve Names into a string array. |
| **Get Curve Value** | [image: get curve value] | This targets an Anim Instance and returns the value of a specified Curve Name. |

## Metadata Curves

Metadata Curves are Animation Curves that output a static curve value of **1.0** when added to an Animation Sequence. They can work conversely with normal Animation Curves, which by default (with no keyframes) output a static curve value of **0.0**. If no curve is added to a sequence, the anim curve value also falls back to a value of **0.0**.

This behavior can be useful in larger projects that contain many Animation Sequences. In these projects, many of those animations may require constant **1.0** curve values throughout them. Therefore, you can use **Metadata Curves** to expedite this process, rather than manually adding normal curves and keyframing them to **1.0**. In other words, large projects that are using anim curves can structure their usage in Animation Sequences in the following way:

- A small number of Animation Sequences may require explicit curve animation on them. Therefore, add **Animation Curves** to those animations and **keyframe** them accordingly.

- A larger number of Animation Sequences may require curve values set constantly to **1.0**, in order to maintain a property value. Therefore, add **Metadata Curves** to those animations.

- The remainder of all Animation Sequences may not require curve value considerations, or require curve values set constantly to **0.0**. No action is required.

To create a Metadata Curve, click the **Curves **track dropdown menu and select **Add Curve… > Create Curve**. You can either select a currently-existing curve, or click **Create New** to create a new curve.

 [image: create metadata curve]

Alternatively, a currently-existing anim curve can be converted to a Metadata Curve by clicking the **Curve **drop down menu on a curve track and selecting **Convert To Metadata**.

 [image: convert to metadata curve]

Once created, Metadata Curves are read-only and output a constant curve value of **1.0**.

 [image: metadata curve]

- animation

On this page

- Prerequisites (-> animation-curves-in-unreal-engine)
- Creating Animation Curves (-> animation-curves-in-unreal-engine)
- Importing Animation Curves (-> animation-curves-in-unreal-engine)
- Creating Curve Animation (-> animation-curves-in-unreal-engine)
- Anim Curves Panel (-> animation-curves-in-unreal-engine)
- Curve Management (-> animation-curves-in-unreal-engine)
- Curve Filtering (-> animation-curves-in-unreal-engine)
- Curve Details (-> animation-curves-in-unreal-engine)
- Using Animation Curves (-> animation-curves-in-unreal-engine)
- Materials (-> animation-curves-in-unreal-engine)
- Morph Targets (-> animation-curves-in-unreal-engine)
- Animation Blueprints (-> animation-curves-in-unreal-engine)
- Metadata Curves (-> animation-curves-in-unreal-engine)

# Animation Composite

https://dev.epicgames.com/documentation/en-us/unreal-engine/animation-composites-in-unreal-engine?application_version=5.9

> Animation Composites serve as a way to combine multiple animations together and treat them as a single unit.

[image: Animation Composite]

With **Animation Composites (Composites)** you can combine several Animation Sequences (-> animation-sequences-in-unreal-engine) into a single asset that can be played back as one sequence. However, be aware that a Composite only stitches animation sequences for combining playback and does not provide any additional ability, such as blending. For a more advanced asset type that can be used to combine sequences and add additional functionality, please refer to Animation Montages (-> animation-montage-in-unreal-engine) for more information.

 [image: demonstration of animation composite playback with multiple sequences]

Like Animation Sequences, Animation Composites can also have Notifies (-> animation-notifies-in-unreal-engine) and Curves (-> animation-curves-in-unreal-engine).

## Creating a Composite

You can create a new Composite inside the Content Browser by** Right-Clicking **(or selecting the **Add New Button**) and choosing** Animation** **> Animation Composite **from the context menu.

 [image: create a new animation composite in the content browser]

After creating the new Composite, you will need to specify the Skeleton (-> skeletons-in-unreal-engine) asset with which to associate your new Animation Composite.

You can also create a Composite from an existing Animation Sequence (-> animation-sequences-in-unreal-engine) by **Right-Clicking** the Sequence in the **Content Browser** and selecting **Create > Create AnimComposite**.

When creating a Composite from an Animation Sequence any present Notifies or Curves will not be copied by default. You can manually copy these assets by selecting them and using the hotkey **CTRL** + **C** and selecting the Notifies track in the new Composite asset and using the hotkey **CTRL** + **V**.

 [image: copy notifies from source animation sequence to a new animation composite]

The Composite will now be accessible and indicated by a lighter shade of green to distinguish it from Animation Sequences.

## Editing a Composite

**Double-clicking** a Composite will open Animation Sequence Editor (-> animation-sequence-editor-in-unreal-engine) and populate the editor with relevant properties and features.

In the **Timeline,** you can add Sequences from the **Asset Browser**, to the Composite track.

 [image: add animation sequence to an animation composite from the asset browser]

You can edit the order of the Sequences in the Composite by dragging them to the desired order. Sequences will snap into place either before or after another Sequence.

You can remove a Sequence by selecting one, **Right-Clicking** and choosing **Delete Segment.** You can also open the asset in its respective asset editor by selecting **Open Asset**.

## Using Composites

Once assembled, an Animation Composite is used in the same way as an Animation Sequence in the **AnimGraph** of an **Animation Blueprint**.

 [image: use animation composites in animation blueprints in the anim graph]

You can also add an Animation Composite to another Animation Composite or to an Animation Montage (-> animation-montage-in-unreal-engine) in the same fashion as a singular Animation Sequence using the Asset Browser.

## Anim Asset Details

When opening your Animation Composite in the Animation Sequence Editor, there are a few unique properties that can be accessed from the **Asset Details** panel. Here you can see a reference of these properties for Animation Composites in the Animation Sequence Editor.

 [image: highlighted asset details panel in the animation sequence editor when working with animation composites]

| Property | Description |
| --- | --- |
| **Preview Base Pose** | Here you can assign and reference the base pose for an **Additive BlendSpace**. For more information about Blend Spaces please see Blend Spaces (-> blend-spaces-in-unreal-engine). |
| **Sequence Length** | Length (in seconds) of the selected AnimSequence playback, assuming a playback speed factor of 1.0. |

- animation
- animation assets

On this page

- Creating a Composite (-> animation-composites-in-unreal-engine)
- Editing a Composite (-> animation-composites-in-unreal-engine)
- Using Composites (-> animation-composites-in-unreal-engine)
- Anim Asset Details (-> animation-composites-in-unreal-engine)

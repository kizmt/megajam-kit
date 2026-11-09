# Animation Track

https://dev.epicgames.com/documentation/en-us/unreal-engine/cinematic-animation-track-in-unreal-engine?application_version=5.9

> The Animation Track enables the adding of Animation Sequences to your Skeletal Mesh track.

[image: Animation Track]

The Animation track applies animation to your Skeletal Mesh Actors using Animation Sequence assets in Sequencer. This guide provides an overview of the usage of this track and its properties.

#### Prerequisites

- You have an understanding of Sequencer (-> how-to-make-movies-in-unreal-engine) and its Interface.

- Your project has a Skeletal Mesh (-> skeletal-mesh-assets-in-unreal-engine) actor and can play Animation Sequences (-> animation-sequences-in-unreal-engine) in it.

## Creation

By default, the Animation track is automatically created (-> cinematic-editor-and-project-settings-in-unreal-engine) under your Actor's track when a Skeletal Mesh Actor class is added to Sequencer. If you have added a different Actor class that supports animation, or have deleted the track, then you can add the track manually by clicking **Add Track (+) > Animation** on the Actor's track, and selecting an **Animation Sequence**.

 [image: add animation track]

Doing this creates the Animation track with an Animation Sequence section at the playhead.

 [image: sequencer animation]

### Adding Animations

Once an Animation track is created, you can add animations to it. You can do this in the following ways:

Click **Add Animation (+)** on the Animation track and select an Animation Sequence. The animations listed here are filtered to only display compatible (-> skeletons-in-unreal-engine) animations for the Skeletal Mesh.

 [image: add animation sequencer]

You can also drag Animation Sequences from the **** into the timeline area of Sequencer. This operation will preview the clip's length and drop points as you drag along the Animation track.

 [image: drag drop add animation sequencer]

Dragging onto another clip will create a separate track for the animation.

## Usage

### Animation Mode

When a Skeletal Mesh is animated in Sequencer, its **Animation Mode** property will switch to **Use Custom Mode**. This is done to ensure Sequencer drives the Actor's animation using a special Animation Blueprint (-> animation-blueprints-in-unreal-engine).

 [image: animation custom mode]

Animation Mode will not switch to **Use Custom Mode** if an Animation Blueprint is already assigned. In that case, you should ensure the Animation Blueprint contains a Slot (-> animation-slots-in-unreal-engine) to receive animation from Sequencer.

### Layers and Blending

The Animation track supports multiple track layers, animations, and allows animations to be blended together in various ways.

 [image: sequencer animation layers blend]

You can add a second animation by clicking **Add Animation (+)** and selecting another Animation Sequence. This will add the new sequence to your current playhead time. If your playhead is placed over an animation, then it will create a new track layer for the animation.

 [image: sequencer animation layer]

Expanding the Animation track reveals the Weight attribute for the section, which has a value range of 0-1. Weights can be keyframed to allow for dynamic weighting and blending of animation sections.

 [image: sequencer animation weight]

Animations can be moved between tracks by dragging them up and down.

 [image: sequencer animation layer stack move up down]

Intersecting two animation sections creates an automatic blend curve between them, and the animations blend over the duration of the intersection.

 [image: sequencer blend clips together]

You can adjust the **Start **and **End **blend curves by selecting and moving the blend curve handle located on the upper portion of the animation section's edge. A curve symbol will appear above the cursor to aid your selection accuracy.

 [image: sequencer start end blend curve]

Right-clicking a blend curve reveals blend-specific context menu commands.

 [image: blend curve menu]

| Name | Description |
| --- | --- |
| **Easing Length** | The length of the blend curve. Enabling **Auto** causes the blend curve to return to the default behavior and support automatic length calculation when sections are intersecting. [image: blend curve length] |
| **Method** | **Method** controls the type of curves to apply to the blend, and enables custom external blends based on functions. |
| **Options** | The Options menu will display a list of curve shapes that you can apply to your blend curve. Selecting one of these will replace your current curve shape with the selected curve. [image: blend curve shape] |

### Trim, Loop, and Play Rate

There are various ways you can edit your clips by looping, trimming, and time-scaling them.

Selecting either edge of the section and dragging inward will trim the section.

 [image: sequencer trim animation]

You can also split a selected animation section at the current playhead time by pressing **Ctrl + /**.

 [image: sequencer split cut animation]

Trim and split commands are also located in the **Edit** menu when right-clicking a section.

Sections can be looped by dragging the right-side edge outward. Loop segments are indicated by notches in the section.

 [image: sequencer loop animation]

Holding **Ctrl** when hovering on a section edge will engage the **Play Rate** modifier.

 [image: sequencer scale animation time play rate]

Once the **Play Rate** modifier is engaged, dragging the clip edge will scale the clip's playback rate instead of looping or trimming.

 [image: sequencer play rate animation]

If you have trimmed or looped an animation and want to restore it to its original length, you can right-click it and select **Edit > Auto Size**.

## Properties

Animation tracks display the following properties when right-clicking them and navigating to the **Properties **menu.

 [image: sequencer animation properties]

| Name | Description |
| --- | --- |
| **Section Range Start** | The start time of the animation section. |
| **Section Range End** | The end time of the animation section. |
| **When Finished** | Determines what the Actor should do when the animation section finishes. **Keep State** will keep the Actor in Sequencer's animation mode. This will not cause the Actor to snap back to its previous state and will instead hold on its last animation frame. **Restore State** will return the Actor back to its state before Sequencer animated them. **Project Default** is the default behaviour, and will use the settings defined in your **DefaultEngine.ini** project file. Adding the following lines to the .ini file will set the project default. `[/Script/LevelSequence.LevelSequence]` `DefaultCompletionMode=KeepState` or `DefaultCompletionMode=RestoreState` |
| **Timecode Source** | The timecode information for the clip, if timecode is being used. You can also specify delta frames here to control offset information. |
| **Is Active** | Activates the selected section. This is similar to **Muting Tracks**, but is used for sections instead of tracks. |
| **Is Locked** | Locks the selected section. This is similar to **Locking Tracks**, but for sections instead of tracks. |
| **Pre/Post Roll Frames** | Specifies the extra padding to apply to the start and end regions of your animation track. This padding causes the first and last frame of the animation to be held for the specified duration. The roll visual can be enabled or disabled in **Sequencer's Editor Preferences (-> cinematic-editor-and-project-settings-in-unreal-engine)** to preview this padding in the timeline. [image: pre post roll hold start end frame] |
| **Animation** | The **Animation Sequence (-> animation-sequences-in-unreal-engine)** asset being referenced. |
| **First Loop Start Frame Offset** | When the sequence is being looped, this property controls the amount of start trim to apply to the first loop of the sequence. Subsequent loops will be full length. When holding **Shift**, you can also change this value directly by dragging your mouse left and right. [image: first loop start frame offset] |
| **Start/End Frame Offsets** | The frame offset properties control the amount of offset to apply to the start and end of a section. The result is an effect similar to trimming, but looping will now respect these trimmed regions as the new loop segments. |
| **Play Rate** | The playback speed of the section. A value of **1.0** will result in normal-speed playback, lower values will playback more slowly, and higher numbers will playback more quickly. |
| **Reverse** | Enabling this will cause the sequence to play backwards, reversing the animation. |
| **Slot Name** | Specifies the Animation Slot (-> animation-slots-in-unreal-engine) to play animation from. In order to use **Slot Name** you must also set the **Animation Mode** of your Skeletal Mesh to use the appropriate Animation Blueprint. [image: sequencer animation slot] |
| **Mirror Data Table** | Mirrors (-> mirroring-animation-in-unreal-engine) this animation according to the assigned Mirror Data Table Asset. |
| **Skip Anim Notifiers** | When enabled, any **Animation Notifies (-> animation-notifies-in-unreal-engine)** for this animation are ignored. |
| **Force Custom Mode** | When enabled, the Skeletal Mesh's **Animation Mode** will be forced into using **Custom Mode** for the duration of this animation. |
| **Swap Root Bone** | Options for making the root bone of the Skeletal Mesh swap with the following: **Component**, which causes the Skeletal Mesh Component to follow the root bone. **Actor**, which causes the Actor to follow the root bone. **None**, which does not swap the root bone. |
| **Start Location Offset** | Specifies the location offset to apply to the Actor at the beginning of its animation when using root motion. |
| **Start Rotation Offset** | Specifies the rotation offset to apply to the Actor at the beginning of its animation when using root motion. |
| **Show Skeleton** | Draws a skeleton in the viewport for this animation sequence. Multiple animation sequence skeletons can also be enabled at once, allowing for the display of multiple skeletons per animation on the same character. This is useful when using Sequencer's **Motion Blending (-> motion-blending-tools-in-unreal-engine)**. [image: sequencer show skeleton animation] |

## Blending Tools

The Animation Track also supports aligning bones in order to better support dynamic blending. Visit the **Motion Blending (-> motion-blending-tools-in-unreal-engine)** page to learn more about this feature.

- sequencer
- animation sequence
- tracks

On this page

- Prerequisites (-> cinematic-animation-track-in-unreal-engine)
- Creation (-> cinematic-animation-track-in-unreal-engine)
- Adding Animations (-> cinematic-animation-track-in-unreal-engine)
- Usage (-> cinematic-animation-track-in-unreal-engine)
- Animation Mode (-> cinematic-animation-track-in-unreal-engine)
- Layers and Blending (-> cinematic-animation-track-in-unreal-engine)
- Trim, Loop, and Play Rate (-> cinematic-animation-track-in-unreal-engine)
- Properties (-> cinematic-animation-track-in-unreal-engine)
- Blending Tools (-> cinematic-animation-track-in-unreal-engine)

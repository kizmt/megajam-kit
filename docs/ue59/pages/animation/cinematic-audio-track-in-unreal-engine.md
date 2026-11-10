# Audio Track

https://dev.epicgames.com/documentation/en-us/unreal-engine/cinematic-audio-track-in-unreal-engine?application_version=5.9

> An overview of the animation blending tools for non-linear animation.

[image: Audio Track]

You can add Sound Waves (-> sound-waves) and Sound Cues (-> sound-cues-in-unreal-engine) using Seqeuncer's **Audio Track** to add sounds to your cinematics in Unreal Engine. Similar to other film editing software, the Audio Track provides controls for adjusting the volume, pitch, and crossfading sounds together.

This document provides an overview of the creation and usage of the audio track.

#### Prerequisites

- You have an understanding of Sequencer (-> how-to-make-movies-in-unreal-engine) and its Interface.

- You have a basic understanding of How to Import Audio Files (-> importing-audio-files) or your project already contains audio files.

## Create an Audio Track

To create a new Audio Track, open a **Level Sequence** in the Sequencer Editor, and use **Track** (**+**) to select **Audio Track**.

 [image: add new audio track]

After creating an Audio Track in your Level Sequence you can add an audio section to the track at the location of your Playhead, by clicking the **Audio** (**+**) dropdown on the track and selecting a Sound Waves (-> sound-waves) and Sound Cues (-> sound-cues-in-unreal-engine) asset.

 [image: add audio asset]

You can also drag **Sound Waves** and **Sound Cues** from the Content Browser into your sequence, which will automatically create the Audio Track and add the sound.

 [image: adding audio asset demo]

Additional audio clip sections can be added to the same audio track for linear playback. You can also add additional Audio Tracks for layered audio playback and blending, each with their own mixing and object binding properties.

 [image: wroking with multiple audio assets and tracks]

## Working With Audio Sections

Similar to most Sequencer Sections (-> creating-animation-keyframes-in-unreal-engine), **Audio Sections** can be edited by trimming, looping, and moving sections within the Sequencer Editor. Audio Sections can also be attached to other Skeletal Meshes (-> skeletal-mesh-assets-in-unreal-engine), and Object Actors (-> unreal-engine-actors-reference), in order to create dynamic sound sources (-> sound-sources-in-unreal-engine) and spatial sounds (-> spatialization-overview-in-unreal-engine).

### Editing Audio Sections

Like most sections in Sequencer, audio sections can be edited (-> creating-animation-keyframes-in-unreal-engine) in the following ways:

- Dragging the left and right edges of an audio section will trim the **Start **and **End **times.

- Dragging the end time past the duration of the clip will cause the sound to **Loop **for the trimmed duration.

 [image: trimming audio assets]

Audio sections that have been trimmed or edited from their default lengths may not play correctly due to the **Platform Specific** codec settings. To fix this, you must ensure that **Sound Asset Compression Type** is set either to **Bink Audio** or **PCM**. This property is found within the Sound Wave Asset.

 [image: codec settings compression audio]

### Blending Audio Sections

Dragging the upper corner edges of an audio section will cause the volume to blend up and down for the duration of the blend.

 [image: audio asset fade handles]

Intersecting two or more sound sections will cause them to crossfade for the duration of the overlap. You can adjust the crossfade between the clips by clicking and dragging the fade handles on each clip independently.

 [image: blandning audio assets]

For more information about blending techniques and properties you can use on audio sections, see the Keyframe Blending (-> creating-animation-keyframes-in-unreal-engine) documentation.

### Attaching Sounds

You can create spatial audio effects for more immersive and dynamic cinematic audio, such as 3D sound and distance falloff, by attaching Audio Tracks to characters and objects within the Level Sequence. To attach an audio track to a source within your level sequence, expand the Audio Track in the Sequence Editor's outline and select a source from the **Attach** property's drop-down menu.

 [image: attach audio tracks to objects]

You can only attach Audio Tracks to Actors that are currently referenced in your Level Sequence.

After attaching an Audio Track, you must specify an Attenuation Mode (-> sound-attenuation-in-unreal-engine) for each audio clip in the track to drive its 3D audio behavior. To specify an Attenuation mode, right-click an audio section and navigate to the **Properties** section. Then select a mode from the **Attenuation** mode property's drop-down menu or **Create New Asset**.

If your Sound Wave or Cue asset already has a Sound Attenuation specified, then you do not need to specify a Sound Attenuation asset for the audio section.

 [image: sound attenuation]

If you are unfamiliar with **Sound Attenuation** assets, the Meerkat Seqeuncer Demo (-> meerkat-sample-project-for-unreal-engine) contains a Sound Attenuation asset for you to reference and use. Additionally you can reference the Sound Attenuation (-> sound-attenuation-in-unreal-engine) page to learn more about it.

The Audio Track's Attach track can also be keyframed (-> creating-animation-keyframes-in-unreal-engine), so the audio source attachment can be changed at any point during playback. When you attach an Audio Track to multiple sources, selecting the **Attach **track will display a sound icon on all the attached sources. The sound icon will be highlighted** green **during playback or scrubbing when the audio is attached to that source.

 [image: use keyframes to attach audio assets]

You can also create a dedicated Audio Track under any Actor added to Sequencer by clicking the Actor's **Track (+)** dropdown and selecting an audio asset from the **Audio **menu. This automatically attaches the sound source to that Actor.

 [image: dedicated audio track for actors]

When creating a dedicated Audio Track for an Actor is Sequencer, the Audio Tracks attachment cannot be changed to any other Actor, which is denoted by the lack of an **Attach **track.

 [image: no attach track]

### Attaching Sounds to Bones

If you are attaching an Audio Track to an Actor with a **Skeletal Mesh Component**, you can attach sounds to specific bones for more control over the audio source. After selecting the Skeletal Mesh Actor in the Audio Track's Attach Property, you can then specif the Skeletal Mesh Component and a specific Bone from the character's skeleton.

 [image: select a bone to attach audio tracks]

## Audio Track Properties

Once a sound asset is added to the Audio Track, it can be expanded to reveal the following keyframable tracks.

 [image: audio track settings]

| Name | Description |
| --- | --- |
| **Attach** | Set an actor within the Level Sequence to attach the sound to (-> cinematic-audio-track-in-unreal-engine) for the purposes of spatial audio. |
| **Pitch** | Set the Pitch value for the audio clip. Higher values increase the pitch, and lower values decrease the pitch. A value of `1` is the default pitch. |
| **Volume** | Set the Volume of the audio clip. Higher values increase the volume, and lower values decrease the volume. A value of `1` is the default volume. |

### Audio Section Properties

Right-clicking an audio section and navigating to the **Properties **menu will reveal the following properties.

 [image: audio section properties]

| Name | Description |
| --- | --- |
| **Sound** | Set the Sound Wave (-> sound-waves) or Sound Cue (-> sound-cues-in-unreal-engine) asset for the Audio section. |
| **Start Frame Offset** | Set the number of frames to offset the start time of this audio section by. This value provides a similar effect to Slip Editing, as it is used to adjust the playable region of a sound without affecting the duration. Holding the **Shift** key and dragging on the clip provides a shortcut to changing this property using your mouse. |
| **Looping** | Toggle if the audio section is able to loop or not. |
| **Suppress Subtitles** | When enabled, the display of subtitles will be suppressed, if subtitles are being used on the asset. |
| **Override Attenuation** | When enabled, the Sound Wave attenuation asset will be overridden with the attenuation specified in **Attenuation Settings**. |
| **Attenuation Settings** | Set a Sound Attenuation (-> sound-attenuation-in-unreal-engine) asset to drive the 3D audio behavior for the audio section. |

- animation
- audio
- sequencer

On this page

- Prerequisites (-> cinematic-audio-track-in-unreal-engine)
- Create an Audio Track (-> cinematic-audio-track-in-unreal-engine)
- Working With Audio Sections (-> cinematic-audio-track-in-unreal-engine)
- Editing Audio Sections (-> cinematic-audio-track-in-unreal-engine)
- Blending Audio Sections (-> cinematic-audio-track-in-unreal-engine)
- Attaching Sounds (-> cinematic-audio-track-in-unreal-engine)
- Attaching Sounds to Bones (-> cinematic-audio-track-in-unreal-engine)
- Audio Track Properties (-> cinematic-audio-track-in-unreal-engine)
- Audio Section Properties (-> cinematic-audio-track-in-unreal-engine)

Related documents

Working with Audio

 [image: Working with Audio] (-> working-with-audio-in-unreal-engine)

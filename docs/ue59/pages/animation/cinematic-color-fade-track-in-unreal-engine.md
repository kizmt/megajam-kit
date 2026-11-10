# Fade Track

https://dev.epicgames.com/documentation/en-us/unreal-engine/cinematic-color-fade-track-in-unreal-engine?application_version=5.9

> The Fade Track in Sequencer is used to fade the entire screen to a solid color. With it, you can fade to black, white, or any other color.

[image: Fade Track]

There may be times when you want to fade in or out of your Level Sequence. You can accomplish this using the Fade Track. This page provides an overview of the Fade Track, as well as additional considerations when fading your cinematics.

#### Prerequisites

- You have an understanding of Sequencer.

- If you are fading between gameplay and cinematics, then you should have an understanding of Blueprints (-> blueprints-visual-scripting-in-unreal-engine).

## Fade Track Overview

### Creation and Usage

To create a Fade Track, click **Add track (+)** and select **Fade Track**.

 [image: create fade track]

The Fade Track is a Float Property Track (-> cinematic-transform-and-property-tracks-in-unreal-engine) that you animate between values of **0** (no fade) and **1** (fully faded).

Set keyframes on the track by selecting the Fade Track and pressing **Enter**, which keys the default value of **0**. Next, move the playhead to a new time and change the track value to **1**, which sets a new key with that value at the playhead time.

 [image: keyframe fade track]

Now, when playing your sequence, you should see the fade happen gradually.

 [image: fade track playing]

### Fade Color and Settings

You can change the color of the fade and adjust other fade settings by right-clicking the fade section and navigating to the **Properties **menu.

 [image: fade track properties]

The following properties have special interaction with the **Fade Track**:

| Name | Description |
| --- | --- |
| **When Finished** | Determines what the property should do when the section finishes. You can select either: **Keep State**, which can be used to persist your fade after the sequence ends for the length of the fade section. **Restore State**, which restores the fade back to its state before it was animated. **Project Default**, which uses the settings defined in your `DefaultEngine.ini` project file. By default, it is set to **Restore State**. |
| **Fade Color** | You can change the color of the fade effect to be any color you want. In some cases, you may want to fade to white instead of fading to black. The track section inherits the color specified here to indicate the color the Fade Track is fading to. |
| **Fade Audio** | Enabling this causes the fade effect to also reduce the audio of all sounds playing, including sounds from the Audio Track (-> cinematic-audio-track-in-unreal-engine), during runtime. |

Because Fade Color is set on the section (-> creating-animation-keyframes-in-unreal-engine), you need to create two different fade sections if you want to have fades with different colors in a single sequence.

 [image: create different sections for each fade color]

## Fading Between Gameplay and Cinematics

The Fade Track is essentially a track version of the **Set Manual Camera Fade** Blueprint function. Because of this, you can use both the Fade Track and camera fade functions to script fading behavior. This can be useful if your project requires you to create fade transitions between gameplay and cinematics.

 [image: camera fade functions]

Fading using these Blueprint functions requires targeting the **Player Camera Manager**. You can get a reference to this Object by right-clicking in the graph and selecting **Get Player Camera Manager**.

 [image: get player camera manager function]

In your Sequence, you must also set your fade section property **When Finished** to **Keep State**. By default, when the Sequence ends, the fade state reverts back to its previous state before Sequencer begins to play. Keep State overwrites this with the final value from the Fade Track. This may be required in cases to ensure that the Fade Track propagates after the Sequence ends.

 [image: set when finished to keep state]

### Gameplay to Cinematic

If you need to cover a transition from gameplay to cinematic with a fade, do the following:

 [image: fade from gameplay to cinematic]

- Create a **Start Camera Fade** node and set the following parameters on it: Connect **Get Player Camera Manager** to **Target**.

- Set **To Alpha** to **1**.

- Set **Duration **to any number greater than **0**, which is the length (in seconds) of the blend. The fade will not work if Duration is 0.

- Enable **Hold when Finished**, which holds the fade until Sequencer fades in with the Fade Track.

- Add a **Delay **node that executes after Start Camera Fade and set **Duration **to the same number as Start Camera Fade's Duration. Start Camera Fade's out execution does not occur on fade complete, so you need a delay to wait for the fade to complete before continuing.

- Play your Sequence, which contains a **Fade Track** fading in, and **When Finished** is set to **Keep State**, to ensure the fade does not revert after the Sequence ends.

### Cinematic to Gameplay

If you need to cover a transition from cinematic to gameplay with a fade, do the following:

 [image: fade from cinematic to gameplay]

- Create an **On Finished** event bound to your Sequence, which contains a **Fade Track** fading out, and **When Finished** is set to **Keep State**.

- Create a **Start Camera Fade** node and set the following parameters on it: Connect **Get Player Camera Manager** to **Target**.

- Set **From Alpha** to **1**.

- Set **Duration **to any number greater than **0**, which is the length (in seconds) of the blend. The fade will not work if Duration is 0.

- Enable **Hold when Finished**, which holds the fade in and does not revert back to faded out, due to Sequencer keeping the Fade Track state.

- sequencer

On this page

- Prerequisites (-> cinematic-color-fade-track-in-unreal-engine)
- Fade Track Overview (-> cinematic-color-fade-track-in-unreal-engine)
- Creation and Usage (-> cinematic-color-fade-track-in-unreal-engine)
- Fade Color and Settings (-> cinematic-color-fade-track-in-unreal-engine)
- Fading Between Gameplay and Cinematics (-> cinematic-color-fade-track-in-unreal-engine)
- Gameplay to Cinematic (-> cinematic-color-fade-track-in-unreal-engine)
- Cinematic to Gameplay (-> cinematic-color-fade-track-in-unreal-engine)

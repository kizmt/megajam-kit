# Enable Particles

https://dev.epicgames.com/documentation/en-us/unreal-engine/how-to-trigger-cinematic-particle-effects-in-unreal-engine?application_version=5.9

> A beginner's look at how to enable different types of particles in Sequencer.

[image: Enable Particles]

This page provides a beginner's overview of triggering effects in Sequencer and is intended for those who are new to Cinematics and Unreal.

#### Prerequisites

- You have read through the Sequencer Basics (-> how-to-make-movies-in-unreal-engine) page and have created and opened a **Level Sequence** in your level.

- Your project contains Niagara Systems (-> creating-visual-effects-in-niagara-for-unreal-engine). The example below uses effects from the Stack O Bot project.

## Adding an Effect to Sequencer

Start by adding an effect to your Level. Do this by opening the Content Browser, locate a **Niagara System** asset, and drag it into your Level.

 [image: add particle to level]

You may want to disable the **Auto Activate** property in the Particle's **Details Panel**, to prevent interference with how you want to control it in Sequencer.

 [image: disable auto activate]

Next, with your sequence open and the Niagara System selected, click **Add Track (+) **and select **Actor to Sequencer > Add 'Niagara System'**. This adds a track referencing the effect into your sequence.

 [image: add particle to sequencer]

Once the track is added, do the following:

- On the Niagara track, click **Add Track (+)** and select **NiagaraComponent0**.

- On the NiagaraComponent0 track, click **Add Track (+)** and select **FX System Toggle Track**.

 [image: add component and add FX System track]

## Activating the Effect

Now that your effect is added to Sequencer, there are two main ways to trigger it depending on if the effect is meant to be continuous (-> how-to-trigger-cinematic-particle-effects-in-unreal-engine) or singularly triggered (-> how-to-trigger-cinematic-particle-effects-in-unreal-engine).

### Continuous Effects

For effects that loop indefinitely, you need to create **Activate **and **Deactivate **keyframes.

First, select the FX System track, ensure the dropdown menu is set to **Activate**, then press **Enter**. This sets an **Activate **keyframe on the particle system track which enables the effect at this time.

 [image: create activate keyframe]

Next, move the playhead to a later point in the sequence by dragging it. Then click the dropdown menu on the FX System track and select **Deactivate**. This sets a **Deactivate **keyframe, which disables the effect at this time.

 [image: create deactivate keyframe]

Now when you play your sequence, you should see the particle activate and deactivate at their corresponding keyframes.

 [image: play effect]

### Trigger Effect

For effects that are meant to only play once, and not loop indefinitely, you can use the **Trigger **keyframe.

To start, click the dropdown menu on the FX System track and select **Trigger**. This changes the type of keyframe to Trigger, which has no enable/disable states.

 [image: set trigger mode]

Next, select the **FX System** track and press **Enter **to place a keyframe. You should now see your effect play.

 [image: create trigger keyframe]

You can set as many **Trigger **keyframes as you want for the particle system. They will all trigger with their corresponding keyframes when the sequence is played.

 [image: multiple trigger keyframes]

## Animating Parameters

If your Niagara System contains User Exposed Parameters (-> overview-of-niagara-effects-for-unreal-engine), you can animate them in Sequencer as well.

To access a parameter, click **Add Track (+)** on NiagaraComponent0 and select the **Parameter Track**. This adds a compatible Property Track (-> cinematic-transform-and-property-tracks-in-unreal-engine) for the parameter.

 [image: add niagara parameter track]

Next, select the Parameter Track and press enter to create a keyframe, then move the playhead to a different location and change the property value on the track to set a new keyframe for that value. You can now play the sequence to see the parameter animate.

 [image: animate niagara parameter]

- sequencer
- particle effects

On this page

- Prerequisites (-> how-to-trigger-cinematic-particle-effects-in-unreal-engine)
- Adding an Effect to Sequencer (-> how-to-trigger-cinematic-particle-effects-in-unreal-engine)
- Activating the Effect (-> how-to-trigger-cinematic-particle-effects-in-unreal-engine)
- Continuous Effects (-> how-to-trigger-cinematic-particle-effects-in-unreal-engine)
- Trigger Effect (-> how-to-trigger-cinematic-particle-effects-in-unreal-engine)
- Animating Parameters (-> how-to-trigger-cinematic-particle-effects-in-unreal-engine)

Related documents

Creating Visual Effects

 [image: Creating Visual Effects] (-> creating-visual-effects-in-niagara-for-unreal-engine)

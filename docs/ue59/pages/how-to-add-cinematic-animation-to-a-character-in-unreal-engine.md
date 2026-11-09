# Apply Animation to a Character

https://dev.epicgames.com/documentation/en-us/unreal-engine/how-to-add-cinematic-animation-to-a-character-in-unreal-engine?application_version=5.9

> A beginner's guide at how to add character animation in Sequencer.

[image: Apply Animation to a Character]

This page provides a beginner's overview of how to animate Skeletal Meshes in Sequencer, and is intended for those who are new to Sequencer and Unreal Engine.

#### Prerequisites

- You have read through the Sequencer Basics (-> how-to-make-movies-in-unreal-engine) page and have already created and opened a **Level Sequence** in your Level.

- Your project contains a Skeletal Mesh (-> skeletal-mesh-assets-in-unreal-engine) and Animation Sequence (-> animation-sequences-in-unreal-engine). If not, you can create a project using the Third Person template, which provides sample Skeletal Meshes and animations.

## Adding a Character to Sequencer

Start by adding a character to your Level. Do this from the Content Browser by navigating to your asset and dragging it into your Level.

 [image: add skeletal mesh]

Next, with your sequence open and the character selected, click **Add Track (+)** and select **Actor to Sequencer > Add 'SKM_Manny2'**. This will add a track referencing the character into your sequence.

 [image: character add sequencer]

When the Skeletal Mesh track is added to the sequence, it automatically adds (-> cinematic-actor-tracks-in-unreal-engine) commonly used tracks for this Actor. In this example, Animation (-> cinematic-animation-track-in-unreal-engine) and Transform (-> cinematic-transform-and-property-tracks-in-unreal-engine) tracks are automatically created.

## Applying Animation to a Character

Click **Add Animation (+)** on the Animation track. This will list all available animations that are compatible with your character's skeleton. Select one of these animations to add it to your sequence.

 [image: add animation sequencer]

Once the animation is added, click **Play **to preview the sequence. If the animation is intended to continue past the current endpoint, you can drag the edge of the clip to extend it.

 [image: play character animation sequencer]

- animation
- sequencer
- character

On this page

- Prerequisites (-> how-to-add-cinematic-animation-to-a-character-in-unreal-engine)
- Adding a Character to Sequencer (-> how-to-add-cinematic-animation-to-a-character-in-unreal-engine)
- Applying Animation to a Character (-> how-to-add-cinematic-animation-to-a-character-in-unreal-engine)

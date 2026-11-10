# Creating Level Sequences with Dynamic Transforms

https://dev.epicgames.com/documentation/en-us/unreal-engine/creating-level-sequences-with-dynamic-transforms-in-unreal-engine?application_version=5.9

> Dynamically change locations of your Sequencer content using Transform Origin Actors.

[image: Creating Level Sequences with Dynamic Transforms]

If your project requires cinematics or other **Level Sequence** content that takes place in more than one location, it may be beneficial to use Sequencer's **Transform Origin** features to dynamically change the location of the animation at runtime. By default, all Sequencer transforms are relative to the world origin (0, 0, 0). However, by using Transform Origin, you can make transforms relative to any transform, or even to an Actor's transform.

This document provides instructions on how to bind Transform Origin to an Actor to change the location of Sequencer content.

#### Prerequisites

- You are familiar with creating content with Sequencer. Refer to these pages for more information: Create Camera Animation (-> how-to-animate-cinematic-cameras-in-unreal-engine)

- Apply Animation to a Character (-> how-to-add-cinematic-animation-to-a-character-in-unreal-engine)

## Level Sequencer Setup

To start, create a Level Sequence Actor (-> unreal-engine-sequencer-movie-tool-overview) in your Level. Select it, and in the **Details **panel do the following:

- Enable **Override Instance Data**.

- Assign the **Level Sequence Actor** to **Transform Origin Actor**.

 [image: assign transform origin actor]

Which Actor to assign to Transform Origin Actor is arbitrary and depends on the context of your scene. For example, if you have a scene where characters are interacting with an object, like a table, then it may be better to assign the table as the Transform Origin Actor.

Depending on your use-case, you may want to assign the Transform Origin Actor first, before creating any Sequencer content in Unreal Engine. If you create content first and then assign a Transform Origin Actor with a non-zero location, your content will move relative to that Actor. In other words, your current Sequencer transforms do not compensate when assigning the Transform Origin Actor.

## Content Setup

Next, create content in your sequence (-> creating-level-sequences-with-dynamic-transforms-in-unreal-engine), aligning your Sequencer content to the Transform Origin Actor. In this example, the Mannequin character walks to the same location as the Level Sequence Actor.

 [image: create cinematic content aligned to transform origin actor]

You can now move the Transform Origin Actor and see your animation change location when playing.

 [image: move transform origin actor]

## Results

Changing the location of the Transform Origin Actor affects all transforms and animations within the sequence. This makes it possible to dynamically change where a scene takes place.

 [image: dynamic scene location]

All objects within a Root Sequence also receive Transform Origin offsets.

## Animated Transform Origin

Transform Origins also correctly adjust Sequencer content if the origin Actor is animated. In this example, the boat Actor is set as the Transform Origin Actor, causing the character and any other transformed actors in the sequence to follow the animation of the boat during runtime.

 [image: animated transform origin actor]

- sequencer

On this page

- Prerequisites (-> creating-level-sequences-with-dynamic-transforms-in-unreal-engine)
- Level Sequencer Setup (-> creating-level-sequences-with-dynamic-transforms-in-unreal-engine)
- Content Setup (-> creating-level-sequences-with-dynamic-transforms-in-unreal-engine)
- Results (-> creating-level-sequences-with-dynamic-transforms-in-unreal-engine)
- Animated Transform Origin (-> creating-level-sequences-with-dynamic-transforms-in-unreal-engine)

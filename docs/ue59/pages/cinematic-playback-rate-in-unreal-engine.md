# Time Dilation Track

https://dev.epicgames.com/documentation/en-us/unreal-engine/cinematic-playback-rate-in-unreal-engine?application_version=5.9

> Speed up or slow down your Cinematics with the Time Dilation Track.

[image: Time Dilation Track]

The **Time Dilation Track** allows you to speed up or slow down a Cinematic Sequence. Keyframes can also be added in order to add a time warp effect to the sequence.

This document explains how to create, use, and understand the Time Dilation Track.

#### Prerequisites

- You have already created and opened a Level Sequence asset.

- You have an animated Actor in Sequencer to preview the Time Dilation effect.

## Creation

To create a Time Dilation Track, click **Add Track (+)** and select **Time Dilation Track**.

 [image: Time Dilation]

The Time Dilation Track creates with a value of **1.0**, which is the default speed of the game simulation.

 [image: Time Dilation]

## Usage

You can preview different play rates by changing the track's value while playing the sequence.

 [image: time dilation warp]

You can also set keyframes on the Time Dilation Track in order to create a time warp effect for your sequence.

Select the track and press **Enter **to add a starting keyframe, then move the Time Marker along the timeline and change the Time Dilation value. This should automatically create a new keyframe with this value set.

 [image: time dilation warp]

## Time Dilation Effects

The Time Dilation Track affects more than just the Tracks contained within your Cinematic. It also slows down the global time scale of all simulations in your Level. This means that any materials, particles, or other dynamic objects in your Level will have their simulation speed affected by the Time Dilation regardless of whether they are referenced by Tracks in your sequence or not.

The example below shows the Time Dilation Track affecting the **speed of a particle simulation**, as well as the **panning texture** of the background clouds. These assets are not being directly referenced by any Tracks in Sequencer.

 [image: time dilation world level]

- sequencer
- play rate
- time warp

On this page

- Prerequisites (-> cinematic-playback-rate-in-unreal-engine)
- Creation (-> cinematic-playback-rate-in-unreal-engine)
- Usage (-> cinematic-playback-rate-in-unreal-engine)
- Time Dilation Effects (-> cinematic-playback-rate-in-unreal-engine)

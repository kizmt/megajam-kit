# Time Warp Track

https://dev.epicgames.com/documentation/en-us/unreal-engine/time-warp-track-in-unreal-engine?application_version=5.9

> Change the playback speed of a sequence using the Time Warp track in Sequencer.

You can change the playback speed of a sequence using the **Time Warp** track in Sequencer. Add a play rate curve to the track to change the fixed playback speed of the whole sequencer, or add a time warp curve to change the playback speed of the sequence dynamically using keyframes.

The **Time Warp** track affects the timing of the objects inside the level sequence, but not the rest of the game. To affect the timing of the entire game, use the Time Dilation (-> cinematic-playback-rate-in-unreal-engine) track.

## Prerequisites

You have an understanding of Sequencer (-> unreal-engine-sequencer-movie-tool-overview) and Tracks (-> sequencer-track-list-in-unreal-engine).

## Create a Time Warp Track

To add the **Time Warp** track to a sequence, follow these steps:

- In **Sequencer**, click **Add (+)**.
- Click **Time Warp**, then click either** Play Rate Curve** or** Time Warp Curve**.

[image: Creating a Time Warp track]

When adding a time warp curve, keys are automatically added in the start and end bounds of the sequence or section. This does not happen with the play rate curve.

[image: Keys at the start and end of a sequence]

## Usage

You can edit a play rate curve or a time warp curve in Sequencer by moving the playhead and adjusting the value in the track. You can also use Show Curves (-> creating-animation-keyframes-in-unreal-engine) to edit the curves in Sequencer.

For a time warp curve, the value in the track is a frame number. For example, you could select frame 22 and set the time warp value to 30. Then, when playing back the sequence, frames 0 to 30 of the sequence will be sped up and shown between frames 0 and 22 of playback.

[image: frames 0 to 30 of the sequence will be sped up and shown between frames 0 and 22 of playback]

You can also edit time warp and play rate curves in the **Sequencer Curve Editor**.

[image: The Sequencer Curve Editor]

## Playback

When playing back a sequence with a **Time Warp** track, two playheads appear. The red playhead is constrained to the **Time Warp** track and moves at the set playback speed. The orange playhead shows what part of the sequence is being played back at the position of the red playhead, depending on the time warp curve.

[image: The two playheads]

To disable the effects of the time warp on the asset, click the **disable** icon on the **Time Warp** track.

[image: The disable icon]

- sequencer
- tracks

On this page

- Prerequisites (-> time-warp-track-in-unreal-engine)
- Create a Time Warp Track (-> time-warp-track-in-unreal-engine)
- Usage (-> time-warp-track-in-unreal-engine)
- Playback (-> time-warp-track-in-unreal-engine)

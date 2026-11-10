# Editing Timelines

https://dev.epicgames.com/documentation/en-us/unreal-engine/editing-timelines-in-unreal-engine?application_version=5.9

> This document contains an overview of how to edit Timeline nodes in Blueprints.

**Timelines** can be edited by **Double-clicking** on the Timeline node in the **Graph** tab or on the Timeline in the **My Blueprint** tab. This opens the **Timeline Editor** in a new tab.

## Timeline Editor

[image: Blueprint Timeline Editor]

| Button/Checkbox | Description |
| --- | --- |
|  | Adds a new float track to the Timeline, for animating scalar float values. |
|  | Adds a new vector track to the Timeline, for animating float vector values such as rotation or translation. |
|  | This adds an event track, which provides another execution output pin that will be triggered at keyframed times on the track. |
|  | Adds a new linear color track to the Timeline, for animating colors. |
|  | Add an external curve to the Timeline. This button is only active if an external curve is selected in the **Content Browser**. |
|  | Allows you to set the playback length for this Timeline. |
|  | If this is not active, the last keyframe of a sequence is ignored. This can help prevent skipping when an animation is looping. |
|  | If active, this Timeline node does not require an execution input to begin, and will start playing as soon as the level begins. |
|  | If active, the Timeline animation will repeat indefinitely unless stopped via the Stop input pin. |
|  | If active, the Timeline animation will be replicated across clients. |

## Adding Tracks

Timelines use **Tracks** to define the animation of a single piece of data. This can be a float value, vector value, color value, or events. Tracks can be added to the Timeline by clicking one of the **Add Track** buttons. For instance, click the button and enter a name for the new track.
Press **Enter** to save the name for your new float track.

[image: Blueprint Timeline - Add Float Track]

- **Track Name** - You can enter a new name for the track into this field at any time.

- **External Curve group** - Allows you to choose an external curve asset from the **Content Browser** instead of creating your own curve.

- **Track timeline** - This is the keyframe graph for this track. You will place keyframes into this and see the resulting interpolation curve.

## Adding Keys

Once you have tracks in place, you can then start adding keys to define your animation.

For more information on working with keys and curves in Timelines, please see the Keys and Curves page (-> keys-and-curves-in-unreal-engine).

Once you have finished editing your track, the data or event execution from the track is output through a data or execution pin with the same name as the track.

[image: Blueprint Timelines - Track Data Output]

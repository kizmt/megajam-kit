# Frames Panel

https://dev.epicgames.com/documentation/en-us/unreal-engine/using-the-frames-panel-in-unreal-insights-for-unreal-engine?application_version=5.9

> View the CPU and GPU time used by your application on a frame-by-frame basis.

[image: Frames Panel]

The **Frames** panel displays the total time taken by each frame using a bar graph format. This is useful for identifying general trends, such as low performance or framerate drops when a level is loaded, an unoptimized scene is visible, or spawning a large number of Actors simultaneously.

 [image: The Frames Panel displayed in Unreal Insights.]

The frames panel displays the Frames, Timing, Timers, Callers, Callees, Counters, and Log tracks.

Hovering the cursor over a bar causes that frame's index and running time to appear.

 [image: image alt text]

If you right-click on on the bar, the following **Zoom** context menu options will appear:

 [image: image alt text]

| **Option** | **Description** |
| --- | --- |
| **Auto Zoom** | Toggles auto zoom, which fits the entire session time range into the frames display window. |
| **Zoom Timing View on Frame Selection** | Toggles whether the timing view is zoomed when a frame is selected. |

These options are also available to edit in the UnrealInsightsSettings.ini file.

- unreal insights
- timing insights

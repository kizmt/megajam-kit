# Routing, Mixing, and Metering in Audio Insights

https://dev.epicgames.com/documentation/en-us/unreal-engine/routing-mixing-in-metering-with-audio-insights-in-unreal-engine?application_version=5.9

> An overview of Audio Insight's audio analysis and visualization tools.

[image: Routing, Mixing, and Metering in Audio Insights]

The **Submixes**, **Audio Buses**, **Signal Flow**, and **Audio Meters** tabs show how individual sounds get routed and combined into your final mix. Submixes and Audio Buses list the routing groups in your project, the Signal Flow graph maps how sounds actually flow between them in real time, and Audio Meters shows the resulting signal levels for whatever you've selected.

## Submixes

The **Submixes **tab lists all the Sound Submixes in the current project, and indicates which ones are sending active signals at the moment. You can select a set of submixes to display signal levels in the Audio Meters tab.

### Submixes Data

| Data | Description |
| --- | --- |
| **Active** | A dot in this column indicates an active signal on that submix. |
| **Select** | An enabled checkbox in this column indicates the submix levels show visually on meters in the Audio Meters tab. You need to manually open the Audio Meters tab if it is not visible in your current configuration. |
| **Name** | Shows the Sound Submix asset name. |

### Submixes Controls

Double-click a submix in the list to open the asset editor for that asset (editor only).

To reduce data storage and unnecessary computations, only submixes with enabled checkboxes send data for Audio Insights to process. When using Audio Insights with Unreal Insights to read a trace file, selecting a specific submix for the meter tab is disabled, but the enabled checkboxes do show what submixes were recorded with meterable data. If you want to inspect a specific submix in a trace file, make sure you select it to be metered when you are recording that trace.

## Audio Buses

The **Audio Buses** tab lists all the audio buses in the current project, and indicates which ones are sending active signals at the moment. You can select a set of audio buses to display signal levels in the Audio Meters tab.

### Audio Buses Data

| Data | Description |
| --- | --- |
| **Active** | A dot in this column indicates an active signal on that audio bus. |
| **Select** | An enabled checkbox in this column indicates the audio bus levels show visually on meters in the Audio Meters tab. You need to manually open the Audio Meters tab if it is not visible in your current configuration. |
| **Name** | Shows the Audio Bus asset name. |

### Audio Buses Controls

The Type Filter gives you the options to display Audio Bus assets, code-generated audio buses, or both.

Double-click an audio bus in the list to open the asset editor for that asset (editor only).

To reduce data storage and unnecessary computations, only audio buses with enabled checkboxes send data for Audio Insights to process. When using Audio Insights with Unreal Insights to read a trace file, selecting a specific audio bus for the meter tab is disabled, but the enabled checkboxes do show what audio buses were recorded with meterable data. If you want to inspect a specific audio bus in a trace file, make sure you select it to be metered when you are recording that trace.

## Signal Flow Graph

The Signal Flow graph is an interactive, real-time visualization of the active audio routing hierarchy. It displays the connections between sound sources, buses, submixes, and their send levels as a live node graph.

Each node represents an active audio entity, such as a playing sound source, source bus, or submix. The wires connecting the nodes display amplitude envelopes that visually reflect signal strength as audio flows through the chain. The table view on the left provides quick access to all the assets and nodes in the complete signal flow graph.

### Signal Flow Toolbar Controls

The menu bar at the top of the **Signal Flow** tab has the following controls:

| Toolbar Option | Description |
| --- | --- |
| **Horizontal Flow** (Ctrl + H) | Toggles the graph between horizontal (signal flows left-to-right) and vertical (top-to-bottom) orientation. The button highlights green when horizontal flow is active. |
| **Node Details** (Ctrl + D) | Toggles visibility of per-node parameter readouts (Amplitude, Volume, Pitch, filters, etc.). The Node Detail Filters in the settings menu controls which parameters are shown. Highlights green when on. |
| **Pause on Select** (Ctrl + P) | When enabled, clicking a node pauses the cache playhead at the current timestamp so the graph stops updating. Highlights green when on. Only valid on a live trace. |
| **Center View** (Ctrl + F) | Scrolls and resets zoom to focus the graph on the currently-selected node (or the active audio device if no node is selected). |
| **Justification: Edge / Center** (Ctrl + E / Ctrl + C) | Controls how nodes are laid out perpendicular to the flow direction. **Edge **pins nodes towards one side of the graph; **Center **balances them around the middle. Icons rotate to match the current Horizontal/Vertical orientation. |
| **Clear All Mutes/Solos** (Editor only) | Clears every mute and solo state currently assigned across the audio device debugger. Not present in default builds. |
| **Highlight Path** | A status indicator that turns yellow while you are holding **Shift**, to remind you that Shift-clicking a node will highlight its full connection path. |
| Pause Banner | When trace processing is paused, a purple "Processing is paused! Press Esc to resume." notification banner appears in the bottom-right corner of the graph. Press **Esc **to resume live processing. |

### Signal Flow Graph Node and Asset Interactions

You can perform the following actions in the Signal Flow node graph:

| Action | Result |
| --- | --- |
| Select a node | Left-clicking a node toggles selection on and off for a node. This also pauses the cache controls if Pause on Select is highlighted, and indicates the asset in both the asset tree on the left side of this tab and in the Details dashboard. Click empty space to unselect. |
| Select an asset from the asset tree | The left-hand panel groups entries into Owner Objects, Active Sources, Active Buses, and Active Submixes. Clicking a row selects the corresponding node in the graph and centers the view on it, and pauses the cache if that feature is selected. Sections are collapsible. |
| Shift-click a node | Holding Shift while clicking a node, either in the graph or in a side-panel list, sets it as the Highlighted Item. The graph then dims everything not in that node's upstream/downstream signal path so you can isolate "what feeds this" and "where does this go." Click any node normally (without Shift) to clear the highlight. |
| Right-click context menu (editor only) | Offers the option to browse to the asset in the Content Browser or open an editor window for that asset. |
| Panning the screen | Right-click and drag on the graph background to pan the view. The cursor switches to grab/hand while dragging. |
| Zoom the view | The mouse wheel zooms in/out around the cursor. Zoom is clamped, and content padding is re-applied after each step so the scroll range stays valid at any zoom level. |

### Signal Flow Settings

Click the **Settings **gear icon in the Signal Flow tab's toolbar to access these settings that customize and filter the display:

| Setting | Description |
| --- | --- |
| Amp (Peak) Display Mode (dB / Lin) | Switches the amplitude (peak) readout on nodes between decibels and linear scale. |
| Animate Wires | Enables connection-wire amplitude animation. Wires modulate their thickness based on the live amplitude envelope of the sending node. Disable for a static graph that is cheaper to render. |
| Node Detail Filters | Chooses which per-node parameters are shown when Node Details is enabled in the toolbar. These are the same values found in the Sounds dashboard, except Send Output Volume, which applies to submix nodes. |
| Graph Padding | Spacing between nodes along the horizontal and vertical axis of the graph. The slider is exponential and normalized 0–1. |

## Audio Meters

The **Audio Meters** tab shows metered visualizations of both the submixes (green text) and the audio buses (blue text) selected on the respective tabs. The metered amplitude uses a logarithmic dB scale. Each channel in a bus configuration is represented with a separate meter in canonical speaker orders. The tab window scrolls to accommodate all the selected submixes and buses.

On this page

- Submixes (-> routing-mixing-in-metering-with-audio-insights-in-unreal-engine)
- Submixes Data (-> routing-mixing-in-metering-with-audio-insights-in-unreal-engine)
- Submixes Controls (-> routing-mixing-in-metering-with-audio-insights-in-unreal-engine)
- Audio Buses (-> routing-mixing-in-metering-with-audio-insights-in-unreal-engine)
- Audio Buses Data (-> routing-mixing-in-metering-with-audio-insights-in-unreal-engine)
- Audio Buses Controls (-> routing-mixing-in-metering-with-audio-insights-in-unreal-engine)
- Signal Flow Graph (-> routing-mixing-in-metering-with-audio-insights-in-unreal-engine)
- Signal Flow Toolbar Controls (-> routing-mixing-in-metering-with-audio-insights-in-unreal-engine)
- Signal Flow Graph Node and Asset Interactions (-> routing-mixing-in-metering-with-audio-insights-in-unreal-engine)
- Signal Flow Settings (-> routing-mixing-in-metering-with-audio-insights-in-unreal-engine)
- Audio Meters (-> routing-mixing-in-metering-with-audio-insights-in-unreal-engine)

Related documents

Profiling with Audio Insights

 [image: Profiling with Audio Insights] (-> audio-insights-in-unreal-engine)

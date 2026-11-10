# Modulation in Audio Insights

https://dev.epicgames.com/documentation/en-us/unreal-engine/modulation-in-audio-insights-in-unreal-engine?application_version=5.9

> An overview of Audio Insight's audio analysis and visualization tools.

[image: Modulation in Audio Insights]

The Modulation Dashboard is a consolidated view of Unreal Engine's Audio Modulation system that displays a live window of all active modulator asset values, including Control Buses, Parameter Patches, Generators, and Control Bus Mixes, along with their bypass states, contributing modulators, and the connections between them. This dashboard is enabled using the Audio Modulation Insights plugin.

The **Modulation **dashboard has two panes, the modulator pane on the left, and the contributor pane on the right. The modulator pane has a list of all the modulation assets active at that moment. You can filter by asset type using the dropdown menu near the top of the dashboard:

When you select a specific modulator in the modulator pane, the contributor pane opens up to show the values of each modulator that contributes to the selected asset, with the final contributed value shown.

**Modular Type** can be one of four types, each with its own icon:

- **Control Bus**: A named modulation value that other systems read/write.
- **Bus Mix**: A snapshot applying values to multiple buses at once.
- **Generator**: A value source (LFO, envelope follower, etc.).
- **Parameter Patch**: A combined output formed from multiple input modulators.

Modular values shows the modulator's current output, shown in linear-volume formatting. Bus Mixes intentionally show no value; they are containers, not signal sources.

Related documents

Profiling with Audio Insights

 [image: Profiling with Audio Insights] (-> audio-insights-in-unreal-engine)

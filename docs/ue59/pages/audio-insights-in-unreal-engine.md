# Profiling with Audio Insights

https://dev.epicgames.com/documentation/en-us/unreal-engine/audio-insights-in-unreal-engine?application_version=5.9

> An overview of Audio Insight's audio analysis and visualization tools.

[image: Profiling with Audio Insights]

**Audio Insights** provides a suite of tools to profile, debug, and monitor runtime aspects of audio in Unreal Engine (UE). Using several tabbed windows, Audio Insights provides visualizations and numerical values for current pitch, volume, and other parameter values for Sources (-> sound-sources-in-unreal-engine), Audio Buses (-> audio-bus-overview), Submixes (-> submixes-in-unreal-engine), and more during live gameplay. It can provide information for both Play In Editor (PIE) (-> ineditor-testing-play-and-simulate-in-unreal-engine) sessions and standalone games.

[image: Audio Insights main window]

## Audio Insights at Unreal Fest

This session recorded at Unreal Fest Chicago 2026 gives an overview of the tool, explores all the ways to use it to visualize audio data, and suggests workflows to enhance sound design and debug efficiency.

Sound Profiling and Debugging with Audio Insights | Unreal Fest Chicago 2026

## Audio Insights Topics

- [image: Getting Started with Audio Insights] Getting Started with Audio InsightsLearn to open Audio Insights and start monitoring a live PIE session. (-> getting-started-with-audio-insights-in-unreal-engine)
- [image: Connecting Audio Insights to Builds] Connecting Audio Insights to BuildsSet up Audio Insights to trace standalone Windows builds or networked console builds using Unreal Insights. (-> connecting-to-builds-in-audio-insights-in-unreal-engine)
- [image: Audio Insights Controls and Event Log] Audio Insights Controls and Event LogGet a tour of Audio Insights' toolbars, timeline controls, and Event Log. (-> audio-insights-controls-and-event-log-in-unreal-engine)
- [image: Sounds, Virtual Loops, and Plots in Audio Insights] Sounds, Virtual Loops, and Plots in Audio InsightsSee live sound parameters, mute or solo individual sounds, and track virtualized sounds that aren't currently audible. (-> sounds-virtual-loops-and-plots-in-audio-insights-in-unreal-engine)
- [image: Routing, Mixing, and Metering in Audio Insights] Routing, Mixing, and Metering in Audio InsightsAn overview of Audio Insight's audio analysis and visualization tools. (-> routing-mixing-in-metering-with-audio-insights-in-unreal-engine)
- [image: Analyzers and Output Metering in Audio Insights] Analyzers and Output Metering in Audio InsightsCheck your final mix against industry loudness standards and inspect its waveform and frequency content. (-> analyzers-and-output-metering-in-audio-insights-in-unreal-engine)
- [image: Modulation in Audio Insights] Modulation in Audio InsightsAn overview of Audio Insight's audio analysis and visualization tools. (-> modulation-in-audio-insights-in-unreal-engine)

## Extending Audio Insights

Unreal Engine includes a plugin template to extend the functionality of Audio Insights with your own workflow. To access this in Unreal Editor, go to **Edit > Plugins** and click **Add** in the upper right to select the **Audio Insights Template**:

This creates the base code for you to begin development on a custom plugin that is integrated with Audio Insights similar to how the Audio Modulation Insights plugin appears (as the **Modulation **tab in Audio Insight's middle panel). To learn how to develop a new plugin, see the comments in the base code.

To build a custom plugin using an agentic workflow, add the following file to your prompts to create an Audio Insights plugin from scratch:

`Engine\Plugins\AudioInsights\Templates\AUDIO_INSIGHTS_PLUGIN_GUIDE.md`

A plugin created this way can respond to cache controls for timeline playback, send asset selection notices to the Details dashboard, and get compiled into the standalone version of Unreal Insights for standalone game support.

On this page

- Audio Insights at Unreal Fest (-> audio-insights-in-unreal-engine)
- Audio Insights Topics (-> audio-insights-in-unreal-engine)
- Extending Audio Insights (-> audio-insights-in-unreal-engine)

# Getting Started with Audio Insights

https://dev.epicgames.com/documentation/en-us/unreal-engine/getting-started-with-audio-insights-in-unreal-engine?application_version=5.9

> Learn to open Audio Insights and start monitoring a live PIE session.

[image: Getting Started with Audio Insights]

Audio Insights is enabled by default in UE. To disable or re-enable it, go to **Edit > Plugins** in the main menu, and search for the **Audio Insights**, **Audio Insights Runtime**, and **Audio Modulation Insights** plugins.

Audio Insights Runtime and Audio Modulation Insights plugins add additional functionality to Audio Insights, including Blueprint event nodes and an additional tab for modulation parameters.

To start monitoring audio with Audio Insights from within Unreal Editor, follow these steps:

- In Unreal Editor's main menu, select **Tools > Audio Insights**.
- Confirm **Monitoring **is active (shows a green icon).If necessary, click **Start Monitoring**.

- Enter **PIE mode** in your project.

## Saving a Trace

By default, monitoring data does not save data. Click **Start Recording** to begin saving a trace.

Both of these states (monitoring and recording) show a trace stream generated in Unreal Editor. Use the Recording button's state to validate whether Audio Insights is saving the data to disk.

## Audio Insights Tabs and Panels

You can configure the visible tabs using the **View **menu in the Audio Insights tab:

You can reposition detailed tabs anywhere within the Audio Insights tab or pull them out as free-floating windows. Selecting **Reset Layout** reverts the tabs to their default positions if your layout gets too scrambled.

## Logs

The **Logs **tab is available in the editor only. This tab is another way to filter and observe Unreal Editor logs next to any pertinent audio information you might be looking at. This data defaults to displaying all audio-specific log categories, but you can change the filters to include or exclude any other log categories and verbosities.

## Details Panel

The **Details **panel is available in the editor only. This tab is a properties inspector built into Audio Insights that displays the editable attributes of any asset you select across the dashboards. It provides a quick way to inspect and edit assets without leaving Audio Insights.

This panel is similar to the Details panels found in other editor windows, but also includes controls for opening or saving the asset.

**Save All** saves all dirtied assets if you have edited more than one.

On this page

- Saving a Trace (-> getting-started-with-audio-insights-in-unreal-engine)
- Audio Insights Tabs and Panels (-> getting-started-with-audio-insights-in-unreal-engine)
- Logs (-> getting-started-with-audio-insights-in-unreal-engine)
- Details Panel (-> getting-started-with-audio-insights-in-unreal-engine)

Related documents

Profiling with Audio Insights

 [image: Profiling with Audio Insights] (-> audio-insights-in-unreal-engine)

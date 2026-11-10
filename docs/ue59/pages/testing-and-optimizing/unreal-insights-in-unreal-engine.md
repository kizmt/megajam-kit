# Unreal Insights

https://dev.epicgames.com/documentation/en-us/unreal-engine/unreal-insights-in-unreal-engine?application_version=5.9

> Profile your project's performance with Unreal Insights.

[image: Unreal Insights]

**Unreal Insights** is a telemetry capture and analysis suite that can capture events from your project at high data rates. Unreal Insights helps you identify areas of data that might require optimization.

The major components of Unreal Insights are:

- **Trace events**, which contain `EventName` and `FieldName` parameters to define an event and specify a field that the event should include.
- The **Unreal Trace Server**, which records and saves traces from the application.
- **Unreal Insights**, which analyzes and visualizes the data.

[image: insights-diagram]

Visualization of the major components of the Unreal Insights framework.

Trace sessions are self-describing, and compatible with different engine release versions. They are stored in `.utrace` files. Any companion data that is generated is stored in `.ucache` files located within the same directory as your trace files.

## Setting Up Unreal Insights

### Launch From Editor

To start Unreal Insights from the **Unreal Editor**, navigate to the **Trace/Insights Status Bar Widget** located in the bottom toolbar of the Editor.

[image: insights-widget]

When you run a Trace to profile your project data, you can choose from multiple workflow options that vary depending on your Unreal Engine Build and Operating System. For more information about these workflow options, see the following pages:

- Trace (-> trace-in-unreal-engine-5)
- Trace Quick Start Guide (-> trace-quick-start-guide-in-unreal-engine)

### Launch a Prebuild of Unreal Insights

If you installed a binary version of Unreal Engine you should have a compiled version of Unreal Insights located in the following directory:

 C++

```
Engine\Binaries\[Platform]\UnrealInsights[.exe]
```

Engine\Binaries\[Platform]\UnrealInsights[.exe]

### Build From Source

If you don't have a binary version of the engine installed, or you want to compile Unreal Insights from source, you can use the following options:

- **Using an Integrated Development Enviroment (IDE)**. Find the UnrealInsights target located in the Programs folder.
- **From the command prompt**. In your engine installation folder build Unreal Insights using the Unreal Build Tool:

On Windows:

 C++

```
Engine/Build/BatchFiles/RunUBT.bat UnrealInsights Win64 Development
```

Engine/Build/BatchFiles/RunUBT.bat UnrealInsights Win64 Development

On Linux or Mac:

 C++

```
./Engine/Build/BatchFiles/RunUBT.sh UnrealInsights [Linux|Mac] Development
```

./Engine/Build/BatchFiles/RunUBT.sh UnrealInsights [Linux|Mac] Development

## Trace

**Trace** is a structured logging framework for tracing instrumentation events from a running process. The **Unreal Trace Server** runs in the background as a single server instance and can be shared between multiple projects or branches. It is an optimized program that has minimal impact on performance and does not include a User Interface.

The **Trace Server** is launched automatically by a separate server process executable, `UnrealTraceServer.exe`, which is located in the `Engine/Binaries/Win64` directory folder.

The **Trace Server** has two components:

- The **Trace Recorder** listens on port 1981 for incoming trace connections and records the live trace stream.
- The **Trace Store** stores the recorded traces as files in a folder. It watches this folder for changes and exposes the list of available traces to Unreal Insights UI.

The **Trace Server** stores configuration and log files in:

- Windows: `%LOCALAPPDATA%/UnrealEngine/Common/UnrealTrace`
- MacOS: `~/UnrealEngine/UnrealTrace`
- Linux: `~/UnrealEngine/UnrealTrace`

The default `Store` folder is created here.

For additional documentation see the following pages:

- Trace (-> trace-in-unreal-engine-5)
- Trace Quick Start Guide (-> trace-quick-start-guide-in-unreal-engine)
- Trace Developer Guide (-> developer-guide-to-tracing-in-unreal-engine)

### Shut Down Trace Server

The server can be shut down using the "kill" command:

`> UnrealTraceServer kill`

### Configuring the Unreal Trace Server

You can configure the Unreal Trace Server to add additional directories to scan for trace files like the download folder or the profiling directory of a specific project. In Unreal Insights, you can control these settings to:

- Set the trace store directory. This is the location where new traces are saved.
- Set additional trace directories and additional sources for trace files, for example, your user Download folder.

When configured with additional watch folders, multiple traces, and their corresponding trace file origin will be displayed with the associated color

- The Unreal Trace Server can store settings persistently while your computer is shut down or restarted.

As of UE 5.3, the Unreal Trace Server is enabled for all desktop platforms. This deprecates the store which was hosted in Unreal Insights for Linux and Mac.

Follow the steps below to Configure the Unreal Trace Server.

- Open Unreal Insights. This will start the Unreal Trace Server, if not already running, on Windows, Mac, or Linux
- Click on the **Manage store settings** dropdown button then modify the default store directory by clicking the "Set Trace Store directory" button. When starting a new trace the file will be stored in this directory.
- The old trace store directory is automatically added to watch folders.
- You can add one or more watch folders by clicking the **Add directory** button. If the new folder contains trace files they will appear in the session list with an icon colored by a unique color.

## Unreal Insights Session Browser

The Unreal Insights Session Browser (-> unreal-insights-session-browser-for-unreal-engine) is an interface to observe trace data. To launch the browser, navigate to the bottom toolbar, and click **Trace** > **Insights** > **Unreal Insights** (**Session Browser**.)

### Trace Store

The **Trace Store** is an interface for you to observe and manage all of your stored Trace Sessions. The recorded traces are stored as files in a folder and Unreal Insights watches this folder for any data changes and then exposes the list of available traces to Unreal Insights UI.

[image: session-browser]

### Connection Tab

The connection tab provides an interface to connect to a running game or editor with a trace server. It features multiple options to change your connection settings.

[image: connection-tab]

### Load a Trace for Analysis

There are multiple options to choose to load a Trace for Analysis. You can:

- Double-click any trace session in the Unreal Insights Browser.
- Select a trace session and click **Open Trace**.
- Search for `.utrace` files in other locations by using the **Open Trace** drop-down arrow.
- Start an analysis of a respective trace file immediately, drag and drop a .utrace file from Explorer over the Unreal Insights window.

[image: trace-drop-down-menu]

### Live Connect

If a live Trace session connects to the tool, it also appears in the list. Live sessions display the word **LIVE** in the status column and update in real-time while you analyze them. Otherwise, they are identical to pre-recorded sessions.

[image: live-connect]

The tool can connect to multiple sessions at the same time, and it automatically records data for all of them as the data streams in. To analyze these sessions in real-time, load them from the list the same way you load pre-recorded sessions.

## Insights Menu

When viewing a session in Unreal Insights, you can select Menu in the upper-left corner of the window to access the menu.

In the menu, you can access several functions, including the following:

- **Import Table** - Import a `.csv` or `.tsv` file into an Insights table.
- **Session Browser** - Opens the Unreal Insights Session Browser window.
- **Open Trace File** - Opens a specified trace file for analysis.
- **Auto Open Live Trace** - If enabled, analysis starts automatically for each new live trace session, replacing the current analysis session.

## Timing Insights Window

The **Timing Insights** window collects performance data. It displays the data for **CPU** and **GPU** tracks. These tracks feature multiple sub-menus to help you sort and visualize the various processing tasks and the amount of time your project spends on executing them.

[image: timing-insights-window]

The Timing Insights window features the Frames panel (1), the Timing panel filters (2), the Timing panel (3), the Log panel (4),Timers and Counters tabs (5) and the Callers and Callees panels (6).

To learn more, see Timing Insights (-> timing-insights-in-unreal-engine).

## Memory Insights

The **Memory Insights** component allows you to investigate memory usage and call stack tracing in your project.

[image: memory-insights-window]

Memory Insights traces events for every allocation, reallocation, or free event that occurs during runtime, then reconstructs that memory usage pattern during analysis.

[image: allocation-table]

See the Memory Insights (-> memory-insights-in-unreal-engine) documentation for instructions on how to set up, trace, query, and sort your data.

## Networking Insights

Unreal Insights includes **Networking Insights** to analyze, optimize and debug network traffic.

Refer to the Networking Insights (-> networking-insights-in-unreal-engine) for additional documentation.

## Slate Insights

**Slate Insights** extends Unreal Insights to help developers improve the performance of their UI. it provides tools to identify the root cause of a specific Slate and UMG update.

See Slate Insights (-> slate-insights-in-unreal-engine) for additional documentation.

## Asset Loading Insights

**Asset Loading Insights** provides a way to profile the amount of time it takes to load a project's assets into UnrealEngine. Asset Loading Insights is based on the data traced from the AssetLoadTime trace channel.

This profiling tool is useful in several ways, including the following:

- Viewing details about data sets per asset type.
- Assessing the load order of packages
- Determining if AsyncLoading is respecting package priorities as expected.
- Filtering the Asset Loading tracks.

## Cooking Insights

**Unreal Cooking Insights** allows you to gather and display information about the way packages are cooked in your project. Long cooking times can significantly affect the productivity of teams that are working on larger projects. By displaying the time it takes to cook each package, you can observe which packages to focus your investigation into optimizing.
See Cooking Insights (-> unreal-cooking-insights-in-unreal-engine-5) for additional documentation.

## Audio Insights

**Audio Insights** extends Unreal Insights with a suite of dashboards for profiling, debugging, and monitoring runtime audio in your project. It connects to the `audio` and `audiomixer` trace channels to show live and recorded data for sounds, submixes, audio buses, and more, whether you're in a Play in Editor session or a standalone build. See Audio Insights (-> audio-insights-in-unreal-engine) for additional documentation.

## Reference

To get the most out of the many features that ship with **Unreal Insights**, You can customize your project's output with macros and command-line options.

Refer to the Reference (-> unreal-insights-reference-in-unreal-engine-5) for additional documentation.

## Topics

- [image: Session Browser] Session BrowserBrowse trace sessions to analyze with Unreal Insights. (-> unreal-insights-session-browser-for-unreal-engine)
- [image: Timing Insights] Timing InsightsAn Overview of the Timing Insights Window in Unreal Insights. (-> timing-insights-in-unreal-engine)
- [image: Trace Control Tab] Trace Control TabUse the Trace Control tab to start and control traces for running sessions of a project. (-> using-the-trace-control-tab-in-unreal-insights-for-unreal-engine)
- [image: Trace] TraceAn overview of the Trace logging framework in Unreal Insights. (-> trace-in-unreal-engine-5)
- [image: Memory Insights] Memory InsightsAn Overview of Memory Insights (-> memory-insights-in-unreal-engine)
- [image: Networking Insights] Networking InsightsOverview of Networking Insights, the network performance profiling tool (-> networking-insights-in-unreal-engine)
- [image: Slate Insights] Slate InsightsOverview of Slate Insights, an extension of Unreal Insights that helps users debug Slate and Unreal Motion Graphics (UMG). (-> slate-insights-in-unreal-engine)
- [image: Unreal Insights Reference] Unreal Insights ReferenceUnreal Insights reference covering input shortcuts, macros, and command-line options (-> unreal-insights-reference-in-unreal-engine-5)

- optimization
- insights
- profiling

On this page

- Setting Up Unreal Insights (-> unreal-insights-in-unreal-engine)
- Launch From Editor (-> unreal-insights-in-unreal-engine)
- Launch a Prebuild of Unreal Insights (-> unreal-insights-in-unreal-engine)
- Build From Source (-> unreal-insights-in-unreal-engine)
- Trace (-> unreal-insights-in-unreal-engine)
- Shut Down Trace Server (-> unreal-insights-in-unreal-engine)
- Configuring the Unreal Trace Server (-> unreal-insights-in-unreal-engine)
- Unreal Insights Session Browser (-> unreal-insights-in-unreal-engine)
- Trace Store (-> unreal-insights-in-unreal-engine)
- Connection Tab (-> unreal-insights-in-unreal-engine)
- Load a Trace for Analysis (-> unreal-insights-in-unreal-engine)
- Live Connect (-> unreal-insights-in-unreal-engine)
- Insights Menu (-> unreal-insights-in-unreal-engine)
- Timing Insights Window (-> unreal-insights-in-unreal-engine)
- Memory Insights (-> unreal-insights-in-unreal-engine)
- Networking Insights (-> unreal-insights-in-unreal-engine)
- Slate Insights (-> unreal-insights-in-unreal-engine)
- Asset Loading Insights (-> unreal-insights-in-unreal-engine)
- Cooking Insights (-> unreal-insights-in-unreal-engine)
- Audio Insights (-> unreal-insights-in-unreal-engine)
- Reference (-> unreal-insights-in-unreal-engine)
- Topics (-> unreal-insights-in-unreal-engine)

Related documents

Profiling with Audio Insights

 [image: Profiling with Audio Insights] (-> audio-insights-in-unreal-engine)Unreal Cooking Insights

 [image: Unreal Cooking Insights] (-> unreal-cooking-insights-in-unreal-engine-5)Slate Insights

 [image: Slate Insights] (-> slate-insights-in-unreal-engine)Networking Insights

 [image: Networking Insights] (-> networking-insights-in-unreal-engine)Memory Insights

 [image: Memory Insights] (-> memory-insights-in-unreal-engine)Timing Insights

 [image: Timing Insights] (-> timing-insights-in-unreal-engine)

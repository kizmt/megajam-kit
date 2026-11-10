# Trace

https://dev.epicgames.com/documentation/en-us/unreal-engine/trace-in-unreal-engine-5?application_version=5.9

> An overview of the Trace logging framework in Unreal Insights.

[image: Trace]

**Trace** is a structured logging framework for tracing instrumentation events from a running process. The modules **TraceLog** and **TraceAnalysis** are the principal modules that constitute the framework.
The **Unreal Trace Server** runs in the background as a single server instance and can be shared between multiple projects or branches. It is an optimized program that has minimal impact on performance and does not include a user interface.

The Trace Server launches automatically by a separate server process, `UnrealTraceServer.exe`, which is located in the `Engine/Binaries/Win64` directory folder.

[image: insights-major-components-diagram]

The Trace Server has two components:

- The **Trace Recorder** listens on port 1981 for incoming trace connections and records the live trace stream.
- The **Trace Store** stores the recorded traces as files in a folder. It watches this folder for changes and exposes the list of available traces to Unreal Insights UI.

An example of the path to the trace folder is:

 C++

```
C:/Users/<user>/AppData/Local/UnrealEngine/Common/UnrealTrace/Store/001/
```

C:/Users/<user>/AppData/Local/UnrealEngine/Common/UnrealTrace/Store/001/

## Unreal Trace Server

Unreal Editor builds automatically launch the `UnrealTraceServer.exe`, when you make a connection from the Unreal Trace session browser. The Unreal Trace Server runs in the background as a single server instance and can be shared between multiple projects and branches.

[image: trace-executable]

You can shut down Unreal Trace Server by accessing your system's Task Manager, and navigating to the Processes tab.

[image: task-manager]

Unreal Trace Server runs in the background as a single instance that does not need to be terminated in order to launch a new version. It can receive and record data from multiple sources simultaneously.

Currently, we only support Unreal Trace Server for one user per machine. If multiple users are logged in simultaneously, then traces will be stored in the first user's trace directory, therefore leaving them inaccessible to other users.

## Trace Insights Widget

The **Trace Insights Widget** provides a way to control and manage your **Trace Data** using an Editor interface. You can access the **Trace Insights Widget **from the Editor** **by navigating to the bottom toolbar and clicking the** Trace **button.

[image: Trace Button]

The follows sections describe settings within each category of the Trace menu.

### Trace Data

The **Trace Data **category contains settings on data channels, Trace bookmarks, Trace screenshots, and more.

[image: Trace Data]

#### Channels

Trace is capable of recording large amounts of data. You can choose which type of data to record by using **Trace Channels**.

Channels control the data rate when tracing. Each event type is tied to one or more channels. If the required channels are not enabled then the event will not be emitted to the trace stream.

[image: Trace Channels]

**Channel presets **group channels together to provide scenario-based entry points.

| Channel | Description |
| --- | --- |
| **Animation** | Animation Insights Plugin. |
| **AssetLoadTime** | Contains named CPU timers for `UObject::Serialize`. |
| **AssetMetadata** | Asset Names and Class Names as metadata for memory allocations. Requires **Metadata** channel. Used by **Memalloc** channel. |
| **Audio** | Audio Insights Plugin. |
| **AudioMixer** | AudioMixer Insights Plugin. |
| **Bookmark** | Low-frequency markers to signify important transitions. Bookmarks provide a quick overview of features such as level loading or engine boot phases. |
| **Callstack** | Callstack descriptions. Allows allocations to be associated with callstacks. |
| **ContextSwitch** | Trace context switch events. On Windows, game or editor runtime should be run as administrator. |
| **Cook** | Displays named CPU timers specific to cooking. This requires the CPU channel to be enabled. Cook will add the both the `CookByTheBook` and `SaveCookedPackage` CPU timing events. |
| **Counters** | Generic counters. Traces float and integer values over time. Counters Trace API. It enables the CSV Profiler Trace. |
| **Cpu** | Named CPU timers. Additional timers can be added by enabling the Stat Named Events channel from the Insights Widget or using the `-statnamedevents` command line argument. |
| **File** | File I/O trace channel that contains Open, ReOpen, Read, Write, Close events. |
| **Frame** | Game and Rendering frames. |
| **Gpu** | Named GPU timers. Based on GpuProfiler data. |
| **LoadTime** | Asset Loading Insights trace channel. Only works for runtime loading from the pak/iostore. |
| **Log** | Logs Messages. |
| **MemAlloc** | Memory allocations. Uses Module and Callstack. |
| **MemTag** | Memory tag statistics. Traces snapshots of memory usage per tag at regular rate. Relies on LLM subsystem for tracing. Implies "-llm". Available after `Init()`. |
| **Messaging** | UDP Messaging plugin. |
| **Metadata** | Support for generic metadata scopes. |
| **Module** | Module loading information. |
| **Net** | Networking trace channel. |
| **Niagara** | Niagara Plugin. |
| **Object** | GameplayInsights/RewindDebugger plugin. `UObject` classes, worlds, instances, and events. |
| **Physics** | Chaos Visual Debugger (-> chaos-visual-debugger-in-unreal-engine). |
| **RDG** | RDG Insights Plugin. |
| **RHICommands** | CPU or GPU named timers for RHI commands. |
| **RenderCommands** | CPU or GPU named timers for commands executed on the rendering thread. |
| **SaveTime** | Named CPU timers specific to package saving. |
| **Screenshot** | Captures screenshots triggered with `Trace.Screenshot` console command or using the `TRACE_SCREENSHOT()` API. |
| **Slate** | Slate Insights Plugin. |
| **StackSampling** | Trace stack sampling events based on Event Tracing for Windows (ETW). |
| **Stats** | Stats counters. Based on the Stats system. |
| **Task** | Task Graph trace channel. |
| **VisualLogger** | Visual Logger starts recording to file. |

The following channels are enabled by default:

- Bookmark
- Cpu
- Frame
- Gpu
- Log
- Region
- Screenshot

The MemAlloc, MemTag, and Module channels are grey because they must be run from the command the prompt. See From the Command Prompt (-> trace-in-unreal-engine-5)

You can define your own presets using config files added to the `[Trace.ChannelPresets]` category. See the Trace Developer Guide (-> developer-guide-to-tracing-in-unreal-engine) for documentation.

#### Trace Screenshot

**Trace Screenshot** takes a picture of your project's viewport during that frame and sends it to the trace. By default, Trace Screenshot is enabled from the channel panel.

You can take a Trace Screenshot in two ways:

- In the bottom toolbar, click **Trace >** **Trace Screenshot**.[image: Trace Screenshot]
- In the console, enter the command `trace.screenshot`.

When using Trace Screenshot, the Timing Insights timeline displays a vertical line that contains a name generated based on the current timestamp, using the date and time of your screenshot.

[image: trace-screenshot]

#### Trace Bookmark

**Trace Bookmark** emits a `TRACE_BOOKMARK()` event with the given string name. When used from the Editor, both the screenshot and bookmark events will generate a name based on the current timestamp using the format of date and time.

You can set a Trace Bookmark in two ways:

- In the bottom toolbar, click **Trace > Trace Bookmark**.[image: Trace Bookmark]
- In the console, enter the command `trace.bookmark`.

Bookmarks and screenshots are visible in the **Timing Insights **tab. You can find them in the **markers track** docked on the top toolbar, underneath the **ruler track**. Bookmarks are available in the **Log **view.

[image: trace-bookmark]

[image: log-window]

#### Stat Named Events

**Stat Named Events** provide additional profiling metrics. You can enable or disable them by clicking the **State Named Events **checkbox.

[image: stat-named-events]

### Trace Destination

In the **Trace Destination **category, you can choose where to store your trace data.

[image: Trace Destination]

| Option | Description |
| --- | --- |
| **Trace Store** | Writes the trace data to a file in its managed trace store directory. |
| **File** | Writes trace data directly to the specified file. |

### Tracing

The **Tracing **category contains settings for starting and stopping a recording, and saving Trace Snapshots.

[image: Tracing]

#### Start and Stop Recording

| Option | Description |
| --- | --- |
| **Start Trace** | Starts a trace to the selected trace destination. You can start a trace from the Trace Insights widget by clicking the **Start Trace** button. |
| **Stop Trace** | When a Trace is started, the Start Trace UI icon displays in red. You can stop the trace from recording by clicking the **Stop Trace** button. |

#### Save Trace Snapshot

There are two ways to save a **Trace Snapshot**:

- In the bottom toolbar, click the **Save Trace Snapshot** button.[image: save-snapshot-button]
- In the bottom toolbar, click **Trace** **> ****Save Trace Snapshot**.[image: Save Trace Snapshot]

### Options

The **Options **category controls automation, such as automatically opening Unreal Insights or destination folders.

[image: Options]

| Option | Description |
| --- | --- |
| **Open Live Session on Trace Start** | When tracing is started, the live session automatically opens in Unreal Insights.This option only applies when Tracing in the Trace Store. |
| **Open Insights after Trace** | When tracing is stopped or a snapshot is saved, the recorded session automatically opens in Unreal Insights. |
| **Shown in Explorer after Trace** | When tracing is stopped or a snapshot is saved, the folder containing the recorded session automatically opens. |

### Locations

The **Locations **category controls where traces (saved to File and the Trace Server) are stored.

[image: Locations]

| Option | Description |
| --- | --- |
| **Open Trace Store Directory** | The location where traces saved to the Trace Server are stored. |
| **Open Profiling Directory** | Opens the profiling directory of the current project. This is the location where traces to the file are stored. |

### Insights

The **Insights **category contains settings that open Unreal Insights, live sessions, and recorded files.

[image: Insights]

| Option | Description |
| --- | --- |
| **Unreal Insights**(**Session Browser**) | Launches the Unreal Insights Session Browser. |
| **Open Live Session** | Opens the current live session. This is only possible when tracing to the store. |
| **Recent Traces** | Opens the latest traces recorded to the trace store or as a file. |

## Trace Status

You can check information about your **Connection**, **Memory Used**, **Important Events cache**, **Sent** data, **Enabled** and **Available** Trace channels by using the console command `Trace.Status`.

[image: trace-status]

## Run Insights From the Command Prompt

To run Unreal Insights from the Command Prompt, follow these steps:

- Navigate to your `Engine\Binaries\Win64` folder and double-click `UnrealInsights.exe`.[image: unreal-insights-executable-in-binaries-folder]
- Launch the **Command Prompt** from your operating system and run your project. In the following example, replace the installation path and project name with your own: C++ ```
cd C:\[MyEngineInstallLocation]\
         Samples\Games\Binaries\Win64\[YourProject].exe
``` cd C:\[MyEngineInstallLocation]\ Samples\Games\Binaries\Win64\[YourProject].exe

## Tail Tracing

**Tail Tracing** tracks events over the last few seconds (depending on the buffer size). Therefore, any machines that may be able to display a lead-up.

The default size of the buffer is 4MB, however if you wish to modify or deactivate it, you can do so by entering using the console command `-tracetailmb=X`.

Setting **X** to **0 MB** will deactivate it and other values will change the buffer size accordingly.

## Late Connect

**Important events** are cached on the Unreal Engine client side, then sent to late-connecting machines during connection. Therefore, one-time events (Important Events) won't be missed before you can make a connection.

Insights can instruct remote running Unreal Engine instances to connect to the remote trace servers from its local UI instance without needing to involve the local machine.

Late connect can be initiated by navigating to **Unreal Insights** **> ****Connect**, or from the Editor console by entering any of the following commands or arguments:

- `"trace.send [ip]" / "trace.start [filename]"`
- `-trace.start [file] [channelSet] -tracehost=[ip]`
- `-tracefile = [filepath]`

Unreal Insights has a file-based caching system that makes it possible for the application to attach additional information to a trace. This can be used to retrieve previously calculated results faster, or store data that would otherwise be lost such as symbols. The cache is stored in a `.ucache` file next to the trace file.

## Trace User Guide

You can use different workflows to run traces in Unreal Insights. See the Trace User Guide (-> trace-quick-start-guide-in-unreal-engine) for documentation.

## Trace Developer Guide

You can develop your own traces in Unreal Insights. See the Trace Developer Guide (-> developer-guide-to-tracing-in-unreal-engine) for documentation.

- optimization
- insights
- profiling

On this page

- Unreal Trace Server (-> trace-in-unreal-engine-5)
- Trace Insights Widget (-> trace-in-unreal-engine-5)
- Trace Data (-> trace-in-unreal-engine-5)
- Channels (-> trace-in-unreal-engine-5)
- Trace Screenshot (-> trace-in-unreal-engine-5)
- Trace Bookmark (-> trace-in-unreal-engine-5)
- Stat Named Events (-> trace-in-unreal-engine-5)
- Trace Destination (-> trace-in-unreal-engine-5)
- Tracing (-> trace-in-unreal-engine-5)
- Start and Stop Recording (-> trace-in-unreal-engine-5)
- Save Trace Snapshot (-> trace-in-unreal-engine-5)
- Options (-> trace-in-unreal-engine-5)
- Locations (-> trace-in-unreal-engine-5)
- Insights (-> trace-in-unreal-engine-5)
- Trace Status (-> trace-in-unreal-engine-5)
- Run Insights From the Command Prompt (-> trace-in-unreal-engine-5)
- Tail Tracing (-> trace-in-unreal-engine-5)
- Late Connect (-> trace-in-unreal-engine-5)
- Trace User Guide (-> trace-in-unreal-engine-5)
- Trace Developer Guide (-> trace-in-unreal-engine-5)

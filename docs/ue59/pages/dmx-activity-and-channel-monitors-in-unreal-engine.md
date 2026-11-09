# DMX Activity and Channel Monitors

https://dev.epicgames.com/documentation/en-us/unreal-engine/dmx-activity-and-channel-monitors-in-unreal-engine?application_version=5.9

> Use the DMX Activity and Channel Monitors to track your DMX installations.

[image: DMX Activity and Channel Monitors]

# Introduction

The **DMX Monitors** are tools to visualize DMX input and output.

# Accessing the DMX Monitors

DMX Monitors are available from the DMX Toolbar menu.

 [image: The DMX monitors in the DMX Toolbar menu]

A Channel Monitor is also available in the DMX Library's Fixture Patch Editor. It monitors DMX Input only.

 [image: The DMX Monitor in the Fixture Patch Editor.]

# Channel Monitor

The monitor displays information when Unreal Engine receives data for the specified universe.

A selection widget provides you with a way to pick which universe to monitor.

 [image: Selecting a universe to monitor with the DMX universe selection widget.]

| **Property** | **Description** |
| --- | --- |
| **Monitor All Ports** | If selected, all Input or Output Ports are monitored. |
| **Source** | Select a source to monitor, either all **Inputs** or all **Outputs** when you select **Monitor All Ports**, otherwise you can select a specific Input or Output Port. |
| **Local Universe** | Specifies the local Universe monitored. |
| **Clear DMX Buffers** | Clears all DMX Buffers. This empties the buffers, it does not send zero or default values. |

# Activity Monitor

The **DMX Activity Monitor** is a debugging tool for visualizing DMX input and output across many universes. The activity monitor displays any non-zero DMX value received across the universes it monitors.

 [image: the DMX Activity Monitor]

| **Property** | **Description** |
| --- | --- |
| **Monitor All Ports** | If selected, all Input or Output Ports are monitored. |
| **Source** | Select a source to monitor, either all **Inputs** or all **Outputs** when you select **Monitor All Ports**, otherwise you can select a specific Input or Output Port. |
| **Universes ** | Selects the range of Universes monitored |
| **Clear DMX Buffers** | Clears all DMX Buffers. This empties the buffers, it does not send zero or default values. |

- dmx

On this page

- Introduction (-> dmx-activity-and-channel-monitors-in-unreal-engine)
- Accessing the DMX Monitors (-> dmx-activity-and-channel-monitors-in-unreal-engine)
- Channel Monitor (-> dmx-activity-and-channel-monitors-in-unreal-engine)
- Activity Monitor (-> dmx-activity-and-channel-monitors-in-unreal-engine)

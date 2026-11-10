# DMX Conflict Monitor

https://dev.epicgames.com/documentation/en-us/unreal-engine/dmx-data-conflict-monitoring-in-unreal-engine?application_version=5.9

> Information about the DMX Conflict Monitor, which checks for potential data collisions between DMX tools in Unreal Engine.

[image: DMX Conflict Monitor]

The DMX Conflict Monitor checks for potential DMX data collisions on all enabled Universes and Patch ranges when sending DMX data from the engine to an external device. Conflicts can occur between the different DMX tools in Unreal Engine (such as Control Console, Pixel Mappers, and Blueprints) if they are writing DMX data to the same address.

To open the Conflict Monitor, click **DMX** > **Conflict Monitor** in the **Main Toolbar**.

 [image: Conflict Monitor in the Main Toolbar]

The Conflict Monitor opens as a dockable window. Click the **ellipsis (...)** to configure the options.

- **Play/stop**: Start and stop the monitoring process.

- **Options** **Auto Pause**: Pause when a conflict is detected.

- **Print to Log**: Print conflicts to the UE Output Log. Only available when Auto-Pause is enabled.

- **Monitor** **Run when opened**: Monitoring automatically starts when opened.

- **Depth**: Controls how much detail is included in the log entry.

When the Conflict Monitor is running, the **Objects Sending DMX** section updates to show which assets are currently sending DMX. You can then open the asset or navigate to it in the **Content Browser**.

 [image: The Objects Sending DMX section]

Conflict monitoring can be CPU intensive. You can check the current CPU usage in the top right of the Conflict Monitor.

 [image: The CPU usage bar]

If the Conflict Monitor detects a conflict, then the monitor logs information about the conflict, including the conflicting DMX tools and the affected ports.

 [image: Conflict Monitor log with information about a conflict]

If the **Print To Log** option is selected, then the Conflict Monitor also sends the same information to the UE Output Log.

 [image: UE Output log with Conflict Monitor information]

- reference
- dmx
- ar/vr/xr

# Unreal Insights Trace Quick Start Guide

https://dev.epicgames.com/documentation/en-us/unreal-engine/trace-quick-start-guide-in-unreal-engine?application_version=5.9

> Get started with using Unreal Insights by following the setup steps below.

[image: Unreal Insights Trace Quick Start Guide]

## Setting Up Unreal Insights

When building **Unreal Insights** you will have multiple options available.

#### Option 1: Launch Unreal Insights from the Explorer

Check if you already have a prebuilt copy of Unreal Insights with your engine by navigating to `Engine\Binaries\Win64\UnrealInsights.exe`

 [image: unreal-insights-executable-in-binaries-folder]

#### Option 2: Build from Visual Studio

You can build Unreal Insights from your **Program**'s directory in your **Solution Explorer**.

 [image: build-from-visual-studio]

#### Option 3: From the Command Prompt

Navigate to **Start** > **Command Prompt**, then build Unreal Insights from your command directory.

```
		cd C:\MyEngineInstallLocation\

		Engine\Build\BatchFiles\RunUBT.bat UnrealInsights Win64 Development
```

cd C:\MyEngineInstallLocation\

 Engine\Build\BatchFiles\RunUBT.bat UnrealInsights Win64 Development

#### Option 4: From the Editor

Start Unreal Insights from the **Unreal Editor** by navigating to **Tools** >** Unreal Insights** > **Run Unreal Insights**. Insights will attempt to compile automatically.

When running a Trace to profile your project data, you have multiple workflow options available depending on your Unreal Engine build and operating system.

## Default Tracing Workflow (Win64, Binary Launcher)

#### 1. Run Unreal Insights:

Navigate to your `Engine\Binaries\Win64` folder and double-click `UnrealInsights.exe`.

 [image: unreal-insights-executable-in-binaries-folder]

#### 2. Insights Session Browser:

When you launch the **Unreal Insights Session Browser**, you will notice that there are currently no live sessions available.

#### 3. Run Your Game Project:

Launch the **Command Prompt** from your operating system and run the Lyra Game Sample.

```
	cd C:\MyEngineInstallLocation\

	Samples\Games\Lyra\Binaries\Win64\LyraGame.exe
```

cd C:\MyEngineInstallLocation\

 Samples\Games\Lyra\Binaries\Win64\LyraGame.exe

If you have downloaded a sample of Lyra from the Epic Games Launcher, you can run Lyra from the default path `UnrealProjects\Lyra\Lyra.uproject`.

#### 4. Live Insights Session Browser:

Navigate back to the Unreal Insights Session Browser and observe that a new session has appeared with the "LIVE" status, indicating it is currently recording.

#### 5. Check Your Trace Status:

In Lyra, press the tilde (`) twice to open the console, then type in the command:

```
	Trace.Status
```

Trace.Status

 [image: checking-the-trace-status]

The channels **Gpu**, **Bookmark**, **Frame**, **Cpu**, and **Log** are enabled by default.

If Unreal Insights is already running before starting your project, then Unreal Insights will connect to the local trace server automatically and the default trace channels will be enabled.

#### 6. Open Your Trace Session:

Navigate back to the Unreal Insights Session Browser, then double-click your `.utrace` file to open it for analysis in a new Unreal **Timing Insights** window.

To open a Trace file, you can drag and drop your `.utrace` file from the explorer onto the Unreal Insights Session Browser. Alternatively, you can open a .utrace file from a specific folder by clicking the **Arrow** button next to **Open Trace**, and selecting **Open File **from the drop-down menu.

Opening a trace launches a new instance of Unreal Insights. Timing Insights is the default component opened and provides you the capability to interact with a trace session to see how much time your project spends on various tasks.

Refer to the Timing Insights (-> timing-insights-in-unreal-engine) documentation for more information on how to view your data for analysis.

### Advanced Controls of Tracing

Unreal Insights provides several Trace commands for you to control how your data is profiled.

- `Trace.SnapshotFile `: This writes a snapshot of the current in-memory trace buffer to a file. If you are already tracing actively, it does not interrupt the active trace, but instead records a second trace file in parallel just for this snapshot.

- `Trace.Bookmark `: This emits a Bookmark event with the given string name. Bookmarks appear in Timing Insights as a vertical line at the time the Bookmark was recorded. Previously this was available through the API only as `TRACE_BOOKMARK()`.

- `Trace.Screenshot `: As mentioned above, you can run this console command to generate a vertical line and optionally include the UI by specifying true or false for a screenshot in Timing Insights.

You may want to have visibility on specific trace channels like CPU or GPU profiling data, or to disable tracing a channel. Refer to the Trace (-> trace-in-unreal-engine-5) and Reference (-> unreal-insights-reference-in-unreal-engine-5) documentation for additional information on Trace commands.

## Late Connect

There may be instances where you forget to run the `UnrealInsights.exe` before launching your project, or perhaps you have discovered a situation you want to record without initially tracing from the beginning. You can **Late Connect** to Unreal Insights by following the steps below.

Before continuing, check the **Unreal Insights Session Browser** to ensure a live session is not already running. You can stop the connection by entering the console command:

```
	Trace.Stop
```

Trace.Stop

- **Build**, **Cook**, or **Run** your project as you normally would.

- Open **Unreal Insights**.

- Click **Connection** to open the Connection tab. Confirm your desired connection settings, then click **Connect.**

After a successful connection, click the **Trace Store** tab. A new LIVE session will appear in the Session list.

- optimization
- insights
- profiling

On this page

- Setting Up Unreal Insights (-> trace-quick-start-guide-in-unreal-engine)
- Option 1: Launch Unreal Insights from the Explorer (-> trace-quick-start-guide-in-unreal-engine)
- Option 2: Build from Visual Studio (-> trace-quick-start-guide-in-unreal-engine)
- Option 3: From the Command Prompt (-> trace-quick-start-guide-in-unreal-engine)
- Option 4: From the Editor (-> trace-quick-start-guide-in-unreal-engine)
- Default Tracing Workflow (Win64, Binary Launcher) (-> trace-quick-start-guide-in-unreal-engine)
- 1. Run Unreal Insights: (-> trace-quick-start-guide-in-unreal-engine)
- 2. Insights Session Browser: (-> trace-quick-start-guide-in-unreal-engine)
- 3. Run Your Game Project: (-> trace-quick-start-guide-in-unreal-engine)
- 4. Live Insights Session Browser: (-> trace-quick-start-guide-in-unreal-engine)
- 5. Check Your Trace Status: (-> trace-quick-start-guide-in-unreal-engine)
- 6. Open Your Trace Session: (-> trace-quick-start-guide-in-unreal-engine)
- Advanced Controls of Tracing (-> trace-quick-start-guide-in-unreal-engine)
- Late Connect (-> trace-quick-start-guide-in-unreal-engine)

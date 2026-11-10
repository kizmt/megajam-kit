# Profiling iOS Projects with Platform-Native Tools

https://dev.epicgames.com/documentation/en-us/unreal-engine/profiling-ios-projects-with-platformnative-tools?application_version=5.9

> Perform diagnostics on Unreal Engine iOS projects using Xcode and Instruments.

[image: Profiling iOS Projects with Platform-Native Tools]

During mobile development, Unreal Engine’s built-in profiling tools (Unreal Insights (-> unreal-insights-in-unreal-engine) and stat commands (-> stat-commands-in-unreal-engine)) can provide answers to most diagnostic questions. However, these tools only assess issues from inside the engine. For diagnostics outside of the engine (such as driver overhead, memory pressure, or power draw), you need platform-native tools like Xcode and Instruments.

Insights, Xcode, and Instruments are complementary, and most diagnoses use more than one. Unreal Insights tells you what your engine is doing. Xcode's live gauges and frame debugger give you a fast read on the running process, plus access to crash and performance reports from shipped builds. Instruments records traces that show your engine in the context of the rest of iOS over time.

In this document, you’ll learn how to connect your project to both Xcode and Instruments, and learn about selected features and best practices for both tools.

## Connect to Xcode and Instruments

The sections below cover prerequisites and how to connect your project to Xcode and Instruments.

### Prerequisites

To follow this guide, you’ll need the following:

- An Apple Silicon Mac (M1/M2/M3/M4) with Unreal Engine and the required version of Xcode installed. For more information, see iOS, iPadOS, and tvOS Development Requirements (-> ios-ipados-and-tvos-development-requirements-for-unreal-engine).
- Xcode signed in to your Apple Developer account.
- A Mac registered as a development device on the Apple Developer team that signs your iOS builds.
- A physical iPhone or iPad connected to your Mac via a cable.Instruments can profile Designed for iPad on Mac, but the results don't translate to actual iPhone or iPad performance. Use physical hardware for any diagnosis you intend to act on.
- A generated `UE5 (iOS).xcworkspace` for your project.
- An Unreal Engine iOS build packaged with the Development or Shipping configuration.The **Development **configuration includes debug symbols useful for call stack interpretation. The **Shipping **configuration more accurately reflects production performance.

#### Generate the Xcode Workspace

You can generate `UE5 (iOS).xcworkspace` for your project in two ways:

- In Finder, right-click your `.uproject` file and select **Services > Generate Xcode Project**.
- If you’re working from a source build, run `GenerateProjectFiles.sh` from your engine root folder.

#### Cook and Stage Content

Xcode can build and launch your app, but it cannot cook content. You can cook and stage your project's content in two ways:

- In the Unreal Engine Editor, in the menu bar, select **Platforms > Quick Launch Current Level > [your device]**.
- In the Editor, from the command line, run the BuildCookRun command:`./Engine/Build/BatchFiles/RunUAT.sh BuildCookRun -project= -platform=IOS -clientconfig= -cook -stage`

For a deep dive into cooking and staging, see Packaging Unreal Engine Projects (-> packaging-your-project).

#### Generate a dSYM File

A debug symbol file (dSYM) lets Instruments and Xcode translate raw memory addresses into readable function names, file paths, and line numbers. Without one, call stacks in builds may appear as unresolved addresses, making profiling results difficult to interpret.

If you're building using configuration that doesn't include debug symbols, you can generate a dSYM file after the build completes. Symbols allow Instruments and Xcode to resolve addresses into readable function names in call stacks.

To generate a dSYM file, run the following command from your machine’s terminal:

`./Engine/Build/BatchFiles/RunUAT.sh -ScriptsForProject=<absolute path to your .uproject> GenerateDSYM -project=<absolute path to your .uproject> -platform=IOS -target=YourTarget -config=<Debug|DebugGame|Development|Test|Shipping>`

### Connect Your Project to Xcode

Xcode includes several profiling views built right into its integrated development environment (IDE) — you don't need to launch Instruments to use them. The views show live data while your app runs on a connected device, and they're often the fastest way to spot a problem before deciding whether a deeper Instruments session is needed. You can learn more about select views in Xcode Profiling Views (-> profiling-ios-projects-with-platformnative-tools).

To connect to your device to Xcode, follow these steps:

- Connect your iOS device to your Mac via a cable and launch Xcode.
- In Xcode, select **Window > Devices and Simulators** and confirm that your device is listed and trusted.
- Open your project's `UE5 (iOS).xcworkspace` in Xcode.
- In the scheme selector, choose your project's iOS target and select your connected device as the destination.
- Click **Run **to build, deploy, and launch the app under Xcode's debugger.

Once the app is running, the Debug Navigator gauges light up, the Debug bar shows the Metal frame-capture and Memory Graph buttons, and the views described in following sections (-> profiling-ios-projects-with-platformnative-tools) become available.

The Xcode Organizer (-> profiling-ios-projects-with-platformnative-tools) pulls performance data from builds you've already shipped to the App Store, so it works any time. You can open it by clicking **Window > Organizer** — no device needed.

### Connect Your Project to Instruments

Instruments comes with a library of trace templates that record performance data over time. They run on your app while it's deployed to a connected device and capture diagnostics that Xcode's live views can't. This includes sustained behavior across many frames, how your threads are scheduled alongside other OS processes, and detailed time-series data that's only useful once you can step through it offline. You can learn more about select templates in Instruments Templates (-> profiling-ios-projects-with-platformnative-tools).

To connect your device to Instruments, follow these steps:

- Connect your iOS device to your Mac via a cable and launch Xcode.
- In Xcode, select **Window > Devices and Simulators **and confirm that your device is listed and trusted.
- Build and deploy your app to your device. You can do this in two ways:In Xcode, click **Run **with your `UE5 (iOS).xcworkspace open`.
- In the Unreal Engine Editor, in the menu bar, select **Platforms > Quick Launch Current Level > [your device]**.

Make sure the build is signed with a provisioning profile that includes your device.

- Launch Instruments from Xcode by selecting **Xcode > Open Developer Tool > Instruments**.
- In the Instruments target picker, select your iOS device, then pick your app from the process list.If the app isn't running, choose it from the target application list and Instruments will launch it for you.

To capture a trace, follow these steps:

- Choose a trace template and click **Record **to begin capture.
- When you've collected enough data, click **Stop**.

Instruments will load the trace for analysis.

## Xcode Profiling Views

Xcode includes several built-in views for monitoring and diagnosing your app's performance without leaving your development environment. The views covered in this section focus on the most practical entry points for identifying CPU, memory, and GPU issues during iOS development.

### Debug Navigator Gauges

When you run your app from Xcode, the Debug Navigator shows live gauges that update in real time. Each tracks one resource:

- CPU
- GPU
- Memory
- Energy
- Disk
- Network activity

Gauges are the fastest way to identify which resource is under strain — such as memory that keeps climbing, a busy processor when the app should be idle, or energy draw that's too high.

Remember that gauges show symptoms, not causes, and can't be saved for later study. Once a gauge points to the problem resource, switch to the matching Instruments template to record a trace and identify the cause:

| Metric | Instruments Template |
| --- | --- |
| CPU | Time Profiler |
| GPU | Metal System Trace |
| Memory | Allocations |
| Energy | Power Profiler |
| Disk | File Activity |
| Network Activity | Network |

### Metal Frame Debugger

Metal is Apple's low-level graphics API — the layer that drives the GPU on iOS. Unreal Engine reaches it through Unreal's Metal Render Hardware Interface.

Every image your app draws is built from a long list of instructions sent to the GPU. Xcode's Metal Frame Debugger freezes one frame and displays the full list of instructions. Using this, you can see exactly what the app asked the GPU to do. This is useful for working out why a particular frame is slow.

You can use the debugger to dig into a specific frame's GPU work, to:

- Find the **draw calls** that take up the most frame time, and tracing them back to a Material, a primitive component, or a Render Dependency Graph (-> render-dependency-graph-in-unreal-engine) pass.Draw calls are individual draw commands sent to the GPU.
- Check whether render passes keep their data in the GPU's fast built-in memory, rather than moving it to slower system memory.
- Read the source of compiled shaders and inspecting the inputs Unreal handed them.

The debugger breaks down each captured frame by:

- Render pass
- Command buffer
- Draw callBound pipeline
- State
- Vertex and fragment shaders
- Textures
- Buffers
- Pixel output

The debugger’s Performance Insights also flag expensive draw calls, and surface warnings from the graphics driver such as redundant state changes, inefficient load/store actions, and operations that move a lot of data.

### Xcode Organizer

Xcode Organizer collects metrics from people running your shipped app who agree to share analytics, not from your development sessions. It's where you find out how your app performs in the real world, including on hardware and operating system versions you can't test against locally.

You can use it to track the following metrics and more:

| Metric | What It Measures | Why It Matters for Unreal Engine |
| --- | --- | --- |
| Hangs | The app's main thread stopped responding for 250 milliseconds or more. | Usually points to Game Thread spikes, level streaming, or audio issues that didn't show up in single-device testing. |
| Disk Writes | How often and how much your app writes to disk. | Projects with active analytics, logging, or save systems can write more than expected, draining battery and triggering operating system throttling. |
| Energy | Battery impact across your user base, broken down by subsystem. | Pairs with Instruments' Power Profiler, which measures one recording session at a time rather than aggregated real-world data. |
| Crashes | Crash reports grouped by cause, with **symbolicated **stack traces.Symbolicated means the crash report shows real function names instead of raw memory addresses. | Catches iOS-specific crashes that don't reproduce on your development device. |

To get readable crash and energy traces, upload your app's symbols when you submit the build. Otherwise, they come back as raw, unsymbolicated addresses.

### Memory Graph Debugger

The Memory Graph Debugger captures a snapshot of every object your app currently has in memory and shows you how they're all connected. For any object, you can see what's referencing it and why it hasn't been released. That makes it useful for tracking down memory leaks and the retain cycles that cause them.

You can use it to:

- Find memory leaks in third-party libraries or the Objective-C parts of Unreal Engine's iOS modules that the engine's own memory tracking doesn't catch.
- Understand why a specific object or system is still in memory when you expected it to have been released.
- Locate a leaked GPU resource such as a texture or buffer. You'll see that it's leaked and that something is holding onto it. In an Unreal project, that holder often shows up as an unnamed C++ memory block instead of readable engine code — so it points you toward the cause rather than to an exact line.

Because it's a snapshot rather than a continuous recording, trigger it right after a specific action you suspect is leaking. For example, after loading and unloading a level several times, or after navigating through an interface flow and back. For more data to work with, turn on **malloc stack logging** in your scheme before you run. Without it, the graph shows what leaked. With it, you also get the backtrace of where each object was first allocated.

## Instruments Templates

Instruments displays diagnostics via templates. Each template is a ready-made configuration built for investigating a specific type of performance problem. The templates covered in this section tackle the most common performance concerns in iOS development.

### Time Profiler

Time Profiler periodically checks what every thread in your app is doing and records it. This builds up a picture of where your app is spending most of its time: which functions are running the most, and on which threads. This helps you confirm whether a performance problem is coming from your own code or from something else on the device, such as the operating system doing background work at the same time.

By default, Time Profiler records every thread and merges the results by function — the busiest functions float to the top no matter which thread they ran on. This is useful for spotting the busiest code, but it hides which thread is the bottleneck. To mitigate this, filter the trace to the engine's own threads:

- Game Thread
- Render Thread
- Audio Thread
- Render Hardware Interface Thread (if your app runs one)

To see where CPU work is going, leave **Sample Perspective** on **Running Sample Times** — the main view this section is about. To investigate a specific thread you suspect is stuck waiting, switch to All Sample Counts. **All Sample Counts** counts a thread whether or not it was actually doing work, so you can see what it's holding up on.

If function names are not showing for functions belonging to your game’s libraries, in Instruments, follow these steps:

- Open **File > Symbols** and select your process on the left sidebar.
- Click **Add Symbols > Add Individual dSYMs on Binaries…** and select the dSYM created in Generate a dSYM File (-> profiling-ios-projects-with-platformnative-tools).

### Metal System Trace

The Metal System Trace template records everything that contributes to frame generation: the graphics commands your app sends, the work of compiling shaders, how that work gets scheduled, and how long the GPU takes to run it. The template displays this information as a timeline, separated into tracks.

This is useful for seeing what Unreal Engine asked the graphics system to do, what the GPU actually did, and when each happened. These are details that Unreal Insights can't fully show.

When reading a trace, it helps to understand some of the different tracks and the flags that can occur on those tracks.

Tracks:

- **Metal Application track: **Unreal Engine's command buffer encoding — the graphics work the engine hands off to be drawn.
- **GPU track:** when that work actually runs on the hardware, and whether it overlaps with the next frame being prepared.

Flags:

- **Shader compilation mid-frame:** Points to missing Pipeline State Object precaching, a common cause of visible stutter.
- **Driver-side stalls: **Work that shows up separately from the engine's own timing, revealing GPU stalls that Unreal Insights would otherwise fold into the engine's GPU time.

### Allocations

The Allocations template keeps a record of every piece of memory your app sets aside while it runs, and shows you where in the code each one came from. This matters because Unreal Insights doesn't catch everything. Some memory gets set aside further down — by third-party libraries, the Metal driver, or the system itself.

To focus on memory that your own code allocates, turn on **Hide System Libraries** in the call-tree settings — it hides Apple's frameworks and leaves the functions you wrote (marked with a person icon). Turn it back off when you're chasing an allocation deeper down, in a third-party library or the Metal driver.

You can also use a feature called **Mark Generation** to compare memory at different moments. You drop a marker at different points, for example, before and after loading a level. Each marker captures the memory still in use at that point, so you can see what changed between events.

What you're watching for is memory that keeps building up and never gets freed. In Unreal Engine projects, that tends to collect in a few places:

- Unreal Engine's memory pools
- Texture streaming buffers
- Audio mix buffers

Unreal Engine's binned allocator manages memory in its own arena and bypasses **libc malloc**. Since Instruments tracks libc malloc behavior rather than Unreal Engine's real allocator, allocation patterns, fragmentation, and overhead will not reflect production.

To capture Unreal Engine allocations in the Allocations template, add `Target.StaticAllocator = StaticAllocatorType.Ansi;` to your project's `Target.cs` for non-Shipping iOS builds and repackage.

### Power Profiler

The Power Profiler measures how much battery your app drains and breaks it down by potential cause, including:

- CPU
- GPU
- Network
- Display

Power Profiler plots energy use on a timeline, broken down by potential cause. It's useful for tuning apps for longer battery life and for diagnosing stutters caused by thermal throttling.

When an app pushes the hardware for a sustained stretch, the device heats up. To protect itself, the system lowers CPU and GPU performance — this is called **thermal throttling** — and that drop in performance can show up as stuttering.

To diagnose this, record a session that includes stuttering, then look at the energy timeline. If sustained high energy use precedes the moments where the app stutters, throttling is the likely cause. A potential solution is to reduce the load that's heating the device over time, rather than optimizing the individual frame where the stutter appears.

Other possible sources of battery drain:

- The display can drain a lot of battery, especially if your app doesn't follow the device's automatic screen refresh-rate setting — forcing a high refresh rate is expensive.
- Unexpected battery drain from third-party libraries, such as advertising or analytics code that quietly uses the network or location in the background.

## Correlate Traces with Unreal Insights

Xcode, Instruments, and Unreal Insights timestamp their data, but their clocks aren’t synchronized to each other. There are several ways to mitigate this:

- Mark a known point in each trace, in the same way that a clapperboard is used in film to mark a synchronization point for audio and video. Choosing a recognizable event in your app, such as a button press, gives you a reference point to align the two recordings during analysis.
- Capture each trace in succession. Capture an Instruments trace first, then an Unreal Insights trace, then another Instruments trace — using the same test sequence each time. The pair of Instruments traces brackets the Insights trace and isolates whether observed behavior was platform-native or engine-native.
- When in doubt, trust each tool for specific diagnostics:Instruments for OS-level diagnostics (such as thread scheduling, driver costs, or memory pressure).
- Xcode's frame debugger for per-frame GPU diagnostics.
- Unreal Insights for engine-level questions (such as determining which Unreal Engine function ran, which RDG pass was active, which stat group accumulated time).

## Common iOS Performance Patterns

When your app doesn’t perform as expected, the following patterns can help you identify the root cause and point you to the right Xcode or Instruments workflow to investigate:

| Symptom | Root Cause | How to Diagnose | Resolution |
| --- | --- | --- | --- |
| Shader compilation stutters at frame N. | PSO precaching is incomplete. | The Metal System Trace template shows shader compilation events mid-frame. | Extend PSO precaching coverage and ensure the PSO cache is shipped with the build. |
| Sustained GPU time exceeds frame time. | GPU bound. | Debug Navigator GPU gauge confirms this live.Metal System Trace template’s GPU track.Xcode’s Metal Frame Debugger. | Investigate resolution scaling, post-processing, or forward shading settings. |
| Energy Impact in Xcode Debug Navigator gauges rated Very High with unstable framerate.Thermal State in Instruments rated Serious or Critical with unstable framerates. | CPU, GPU, display, and network usage all contribute to thermal state. | Debug Navigator Energy gauge confirms this live.The Power Profiler template's Energy Log breakdown identifies which subsystem is contributing. | Profile CPU, GPU, display, and network usage and reduce these as much as possible, even if they have no impact on frame rate. |
| App killed by **jetsam **with no Unreal Engine error.Jetsam is iOS's kernel-level memory pressure mechanism. | Memory pressure. | The Debug Navigator memory gauge warns when watermark grows. The Allocations template identifies where new memory is being committed.Watermark is the peak memory usage reached by the app during a session, even if current usage has since dropped. Use it to assess whether allocations have approached jetsam thresholds. | Investigate unbounded texture streaming pool, audio mix buffer growth, or third-party SDK leaks. |

## Next Up

- [image: Profiling Android Projects With Platform-Native Tools] Profiling Android Projects With Platform-Native ToolsUse Android profiling tools to capture your app's runtime performance data and identify performance improvements in mobile projects. (-> profile-android-projects-with-platformnative-tools)

- [image: iOS, iPadOS, and tvOS Development Requirements] iOS, iPadOS, and tvOS Development RequirementsiOS development requirements including compatible hardware, software, and SDK information. (-> ios-ipados-and-tvos-development-requirements-for-unreal-engine)

- [image: Packaging Unreal Engine Projects] Packaging Unreal Engine ProjectsPackaging Unreal game projects for distribution. (-> packaging-your-project)

- [image: Unreal Insights] Unreal InsightsProfile your project's performance with Unreal Insights. (-> unreal-insights-in-unreal-engine)

On this page

- Connect to Xcode and Instruments (-> profiling-ios-projects-with-platformnative-tools)
- Prerequisites (-> profiling-ios-projects-with-platformnative-tools)
- Generate the Xcode Workspace (-> profiling-ios-projects-with-platformnative-tools)
- Cook and Stage Content (-> profiling-ios-projects-with-platformnative-tools)
- Generate a dSYM File (-> profiling-ios-projects-with-platformnative-tools)
- Connect Your Project to Xcode (-> profiling-ios-projects-with-platformnative-tools)
- Connect Your Project to Instruments (-> profiling-ios-projects-with-platformnative-tools)
- Xcode Profiling Views (-> profiling-ios-projects-with-platformnative-tools)
- Debug Navigator Gauges (-> profiling-ios-projects-with-platformnative-tools)
- Metal Frame Debugger (-> profiling-ios-projects-with-platformnative-tools)
- Xcode Organizer (-> profiling-ios-projects-with-platformnative-tools)
- Memory Graph Debugger (-> profiling-ios-projects-with-platformnative-tools)
- Instruments Templates (-> profiling-ios-projects-with-platformnative-tools)
- Time Profiler (-> profiling-ios-projects-with-platformnative-tools)
- Metal System Trace (-> profiling-ios-projects-with-platformnative-tools)
- Allocations (-> profiling-ios-projects-with-platformnative-tools)
- Power Profiler (-> profiling-ios-projects-with-platformnative-tools)
- Correlate Traces with Unreal Insights (-> profiling-ios-projects-with-platformnative-tools)
- Common iOS Performance Patterns (-> profiling-ios-projects-with-platformnative-tools)
- Next Up (-> profiling-ios-projects-with-platformnative-tools)

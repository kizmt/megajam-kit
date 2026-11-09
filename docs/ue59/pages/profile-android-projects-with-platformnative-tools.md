# Profiling Android Projects With Platform-Native Tools

https://dev.epicgames.com/documentation/en-us/unreal-engine/profile-android-projects-with-platformnative-tools?application_version=5.9

> Use Android profiling tools to capture your app's runtime performance data and identify performance improvements in mobile projects.

[image: Profiling Android Projects With Platform-Native Tools]

**Profiling **is the process of measuring your app's runtime behavior to identify performance bottlenecks. Common metrics to capture include CPU usage, GPU workload, memory consumption, and thread activity. Always approach profiling with specific questions in mind (for example, “what is consuming memory between levels?”) rather than collecting data without a clear goal.

Some mobile-specific performance metrics such as CPU scheduling, GPU driver activity, memory pressure, thermal throttling, and power draw across the system-on-a-chip (SoC) must be collected with platform-native tools instead of Unreal Engine’s (UE) built-in profiling tools. In this guide, you’ll learn about Android profiling tools, when to use each of them, and how to correlate platform traces with Unreal Insights data.

### Choosing a Tool

Android has several platform-native profilers with different tools optimized for different layers of the stack and SoC vendors:

- **Android Performance Analyzer**: Google's first-party local system profiler with project-based trace management and AI-assisted analysis. Use this tool to see where the app is spending frame time, memory bandwidth, and thread scheduling on the device.
- **Arm Performance Studio**: This suite covers counters, frame analysis, shader compilation, and CI capture. APS includes five components: Streamline, Frame Advisor, RenderDoc, Mali Offline Compiler, and Performance Advisor. Use this tool to see what your Mali GPU is doing system-wide, per-frame, and per-shader.
- **Android Studio profiler**: Use this tool to see your app's CPU, memory, and energy use over time.
- **Perfetto**: Use this tool to see what CPU work the kernel is scheduling and how the app fits alongside system threads.
- **Snapdragon Profiler**: Use this tool to see what is happening per-frame in the GPU on Adreno hardware, and what a Snapdragon SoC is doing across CPU, GPU, DSP, and memory.

| If the question is… | Use… |
| --- | --- |
| What is my app's live CPU / GPU / memory / network / energy use? | Android Performance AnalyzerArm Streamline |
| What is the kernel scheduling, and how does my app fit alongside system threads? | Android Performance AnalyzerAndroid Studio ProfilerPerfetto |
| Which callstacks are the most heavy on CPU? | Android Studio ProfilerArm Streamline |
| Where is my Mali GPU bound? | Arm StreamlineAndroid Performance AnalyzerRenderDoc for Arm GPUs |
| Where is my Adreno GPU bound? | Android Performance AnalyzerSnapdragon Profiler |

In a typical profiling workflow, you’d start with Android Performance Analyzer or Arm Performance Studio’s Streamline for system-level questions, then use the vendor-specific GPU suites (Arm Performance Studio for Mali devices; Snapdragon Profiler for Adreno devices) for rendering bottlenecks.

Each tool has a dedicated section below covering setup, device connection, and what to look for in the captured data.

## Prerequisites

To follow this guide, make sure you have the following:

- A development host (Windows, Linux, or macOS) with Unreal Engine and the Android SDK toolchain installed. See the Android Quick Start (-> android-quick-start) page for more details.
- An Android device set up for development (-> setting-up-your-android-device-for-developing-applications-in-unreal-engine):In Developer Mode.
- Connected with a USB cable.
- USB Debugging enabled.

- An Unreal Engine Android build packaged in **Development**, **Test**, or **Shipping **configuration, installed on the device you want to profile on. **Development **includes debug symbols that improve callstack symbolization in Android Studio, Perfetto, and Arm’s Streamline. A **Shipping **build more accurately reflects production performance. **Test **is similar to shipping but with some profiling hooks and stats enabled.
- If using a **Development **build, debug symbol compression must be disabled so CPU sampling profilers can attach symbols correctly. In Unreal Editor, go to **Edit > Project Settings**, go to **Platforms > Android**, and ensure that the **Enable compression of debug symbols** checkbox is disabled.

Some tools (Arm Performance Studio, Snapdragon Profiler) may require additional permissions, vendor-specific debug layer APKs, or registration with the tool's developer to enable profiling on production-signed builds.

### Debuggable/Profilable Build Requirements

Android profiling tools distinguish between two app manifest settings: profileable and debuggable. A profileable build allows profiling tools to attach with low overhead, similar to a release build. A debuggable build allows full debug access but carries higher runtime overhead and does not reflect production performance. For any tool where profileable is sufficient, use it instead of debuggable.

To create a debuggable build in Unreal Engine:

- In Unreal Editor, go to **Edit > Project Settings**, go to **Project > Packaging > Project**, and ensure that the **For Distribution** checkbox is disabled.

Profiling tools that require a debuggable build:

- **Arm**: Streamline, Frame Advisor
- **Android Studio Profiler**: Java/Kotlin Allocations, Heap Dump, and View Live Telemetry's Interactions timeline
- **Android Performance Analyzer** (recommended; without it, Vulkan-specific trace data is unavailable)

Profiling tools where a profileable build is sufficient:

- **Android Studio Profiler**: Callstack Sample, System Trace, Native Allocations, Java/Kotlin Method Recording
- **Arm Performance Studio**: RenderDoc for Arm GPUs and Mali Offline Compiler
- **Perfetto**
- **Snapdragon Profiler**

## Android Performance Analyzer

Android Performance Analyzer (APA) is Google's local system profiler for Android. It runs as a Windows or macOS desktop app, connects to a single Android device over Android Debug Bridge (`adb`), and records system traces with breakdowns for frame timing, memory efficiency, texture and vertex memory bandwidth, and thread scheduling. APA organizes captures into projects for comparison and supports AI-assisted analysis using Perfetto SQL.

The Android SDK platform tools include the `adb` command-line tool.

### Record a System Trace in Android Performance Analyzer

To connect APA to your Unreal Engine Android build and start capturing performance data, follow these steps:

- Download APA for Windows or macOS from the Android Performance Analyzer webpage.
- Follow the instructions in the APA Quickstart guide in Android's APA documentation.

When you stop a recording, APA retrieves the trace and opens it in the trace view. For more information about tracks in trace view, see Understand trace data in Android's APA documentation.

### Interpreting APA Data for Unreal Engine Projects

In the trace view, focus on the following when assessing performance of your Unreal Engine app:

- **Frame processing times**: Identifies which frames overran the budget and where the time went (CPU work, GPU submission, or GPU execution). Useful when Unreal Insights reports a steady framerate but playtest still feels choppy. See Analyze frame processing times in Android's APA documentation.
- **Texture and vertex memory bandwidth**: Unreal Engine mobile content is often bandwidth bound; the bandwidth panels show whether the budget is being spent on texture sampling or geometry streaming. See Analyze texture memory bandwidth usage and Analyze vertex memory bandwidth usage in Android's APA documentation
- **Thread scheduling**: Reveals context switches between UE’s named threads (UnrealMain, RenderThread, RHIThread, and so on) and other OS work, so this is useful for frame pacing issues that don't show up in Unreal Insights. See Analyze thread scheduling in Android's APA documentation.

APA displays Vulkan render-pass names from UE's RHI in the trace view, so you can map captured GPU work back to specific passes.

You can also query your collected data using AI — describe what you want to find in plain language and it generates Perfetto SQL queries for you. Refer to Use AI-powered analysis features in Android's APA documentation.

## Arm Performance Studio

Arm Performance Studio (APS) is Arm's suite of mobile performance tools. It is the most detailed Mali and Immortalis GPU toolchain available outside vendor-internal builds and helps determine how your Mali GPU's time is being spent on Android.

APS has five components, each answering a different profiling question:

- **Streamline**: Start with this system-wide, time-based profiler.
- **Frame Advisor**: A per-frame deep dive with Arm-opinionated render-graph and tile-memory advice.
- **RenderDoc for Arm GPUs**: Arm's distribution of RenderDoc with Mali extensions and inline shader analysis.
- **Mali Offline Compiler (malioc)**: Offline static analysis of compiled shaders. Diagnoses which pipeline stage is bound.

For example, in a typical APS workflow on UE Android projects, you’d start in Streamline to find the bottleneck system, use Frame Advisor or RenderDoc for Arm GPUs to inspect the offending frame, and then use Mali Offline Compiler to analyze specific shaders.

Frame Advisor and RenderDoc for Arm GPUs are complementary. Frame Advisor focuses on Arm-opinionated advice and offline analysis; RenderDoc covers broader graphics-debugger workflows including the newest Vulkan extensions.

APS tools work on any Android device for their SoC-agnostic features. The Mali-specific counters (hardware counters, Mali Timeline, and tile-memory traffic) are only available when capturing against a Mali or Immortalis GPU.

### Download and Install APS

Go to the Arm Performance Studio website to download and install APS, and then learn more about using each APS component below. Ensure you have APS installed and a USB-connected Android device in Developer mode before continuing.

We recommend closing Android Studio when running APS tools; otherwise, Android Studio interferes with APS debugging by attaching to the package itself.

### Streamline

Streamline is APS's system-wide profiler and your starting point for determining whether a performance issue is CPU- or GPU-bound. It samples CPU hardware counters and captures Mali and Immortalis GPU counters including shader-core utilization, memory bandwidth, and GPU scheduling.

Streamline requires a debuggable build. For more information, see the **Prerequisites **section near the top of this page.

To connect Streamline to a UE Android build and capture a profile, follow Capture a profile in the APS Developer documentation.

Streamline is best at correlating CPU and GPU work at counter level. In the charts data, focus on the following when assessing performance of your Unreal Engine app:

- **Cycles per pixel on the Mali GPU**: High values indicate fragment-shader-heavy content.
- **Memory bandwidth peaks**: UE mobile content is often bandwidth bound; spikes correlate with texture sampling and post-process passes.
- **Mali shader-core occupancy**: Low occupancy under load indicates branch-heavy shaders, register pressure, or shader cores waiting on memory — load/store stalls or texture fetches that haven't returned.

For more information about navigating charts data in Streamline, see Analyze the Profile in the APS Developer documentation.

To learn how to use Performance Advisor’s `streamline_me.py` script to integrate Streamline profile captures into your automated CI pipeline, see the following pages in Arm’s Performance Advisor documentation:

- Running Performance Advisor in continuous integration workflows
- Run the streamline_me.py script
- streamline_me.py script options

### Frame Advisor

Frame Advisor is APS's frame analyzer for Mali and Immortalis GPUs. Use it after Streamline reveals a slow frame; Frame Advisor captures a short multi-frame window and lets you analyze it offline. You get a visual breakdown of your render passes, tile-memory traffic, and Arm's built-in advice flags problem areas. Its frame hierarchy view is designed for multi-threaded command submission, making it well-suited for UE's Vulkan renderer.

To use Frame Advisor, you need the following:

- Android 11 or later.
- A device without permission monitoring. If your phone has **Settings > Developer options > Disable permission monitoring**, ensure that **Disable permission monitoring** is selected. If you do not have the option to disable permission monitoring, you can ignore this step.
- A UE project with PSO caching disabled. To disable PSO caching, add the following arguments to your `DefaultEngine.ini` and `DefaultGame.ini` files: Command Line ```
[/Script/Engine.RendererSettings]
r.psoprecaching=0

[/Script/AndroidRuntimeSettings.AndroidRuntimeSettings]
Android.Vulkan.NumRemoteProgramCompileServices=0
``` [/Script/Engine.RendererSettings] r.psoprecaching=0 [/Script/AndroidRuntimeSettings.AndroidRuntimeSettings] Android.Vulkan.NumRemoteProgramCompileServices=0
- A debuggable build. For more information, see the **Prerequisites **section near the top of this page.

To connect Frame Advisor to a UE Android build and capture a trace, follow Capture your frames in the Arm Frame Advisor User Guide.

In the **Analysis **screen, focus on the following when assessing performance of your Unreal Engine app:

- In the **Render Graph **view, check render-pass structure and tile-memory usage. Mali is a tile-based renderer, so attachments that spill to external DRAM are expensive — look for passes that could be merged, attachments that aren't cleared or invalidated at render pass boundaries, and output attachments writing to external memory unnecessarily.
- In the **Frame Hierarchy **view, look for inefficient Vulkan submission patterns such as frequent small submissions or large barriers causing serialization — both are common in multi-threaded engines like Unreal Engine.

For more information about Frame Advisor’s Analysis screen, see Explore the Analysis screen and Analyze your frames in the Arm Frame Advisor User Guide.

### RenderDoc for Arm GPUs

RenderDoc for Arm GPUs is Arm's distribution of RenderDoc with added support for Mali and Immortalis GPUs. Use it to diagnose rendering problems on Mali-equipped devices — step through a captured frame's API calls and rendering events to identify problem draw calls, then inspect graphics state, textures, buffers, and shaders to find the cause. Most MediaTek Dimensity and Samsung Exynos phones use Mali GPUs.

RenderDoc for Arm GPUs embeds the Mali Offline Compiler as a shader-view tool, so static cycle-cost analysis is available inline while inspecting a captured shader.

To connect RenderDoc for Arm GPUs to a UE Android build and capture frames, follow these steps:

- On your device, ensure the Mali GPU debug layers are available. In your device **Settings**, go to **Developer Options**, and turn on **Enable GPU Debug Layers**. For some devices this requires a userdebug build or a vendor-provided debug layer APK. **Enable GPU Debug Layers** can impact GPU performance, so remember to turn this setting off when not using Frame Advisor or RenderDoc.
- Launch RenderDoc for Arm GPUs from Arm Performance Studio and follow the instructions in Capture frames from your application in the Arm RenderDoc Documentation. In the **Launch Application** tab, you can set the **Executable Path** to the UE app and Android activity you want to profile and keep all other default settings before clicking **Launch**.
- When RenderDoc launches the app on your device, navigate to the area that you want a frame capture of, and click **Capture Frame(s) Immediately** in RenderDoc’s capture frame controls.

- In RenderDoc, double-click a capture’s thumbnail to load and play it back on your connected device.

When the frame loads, use the Event Browser to navigate through the frame capture. For more information, see Analyze and debug your capture in the Arm RenderDoc Documentation.

RenderDoc for Arm GPUs shows the full Vulkan command stream that Unreal Engine submits. Look for:

- **Render-pass load/store operations**: In the **Event Browser**, navigate to a draw call, then go to the **Pipeline State **tab to inspect render pass configuration. Unreal Engine's mobile renderer aggressively uses memoryless attachments; verify that load and store operations match your expectations.
- **Tile size and bandwidth counters**: In the **Performance Counter Viewer** tab, click **Capture counters **and select per-region counters to generate a heatmap of processing activity by screen region. Unreal Engine mobile content typically wants tile-resident attachments (bright red regions indicate bandwidth pressure).
- **Shader register usage**: In the **Pipeline State** tab, select a shader and click View**. **In the Disassembly type dropdown, select **Mali Shader Performance **to open an inline Mali Offline Compiler report. High register counts indicate overly complex Material graphs.

### Mali Offline Compiler

Mali Offline Compiler (malioc) is APS's offline shader analyzer. It does not require a device. Give it a compiled shader (GLSL ESSL, Vulkan SPIR-V, or an OpenCL kernel) and a target Mali generation, and it returns a static estimate of cycle cost, register pressure, and which pipeline stage is bound (ALU, load-store, varying, or texture). For UE projects, malioc is most useful in continuous integration (CI) workflows.

On Linux or macOS, add the install location of Mali Offline Compiler to your PATH environment variable so you can compile from any directory. If on Windows, this step is done automatically. If you omit this step, you must navigate to the `<install_location>/mali_offline_compiler` directory each time you want to run the tool.

To catch Material regressions over time using malioc, follow these steps:

- Export your shaders using UE's shader-dump path by enabling `r.ShaderDevelopmentMode` and `r.DumpShaderDebugInfo`.
- Run `malioc --format json` against each exported shader. This generates machine-readable reports that are easier to parse and diff automatically in a CI pipeline.
- Diff the results over time to identify regressions before they ship.

In the output, the **Bound **column maps directly to a Material-graph optimization strategy. For example, ALU-bound shaders want simpler math, texture-bound shaders want fewer samples, and so on.

malioc analyzes shaders in isolation and cannot account for optimizations the driver applies at runtime. Treat its output as a useful estimate, not a guarantee of on-device performance.

For more information about JSON reports in Mali, see the following pages in the Arm Mali Offline Compiler User Guide:

- Generating JSON reports
- Performance analysis: Performance table
- Performance analysis: Resource usage

## Android Studio Profiler

Android Studio profiler captures CPU, memory, and energy data with a more accessible UI than Perfetto.

The profiler is organized around named **tasks**. On the profiler’s Home screen, you can select one of these tasks before starting a recording.

Here are some guidelines for when to use each task:

- **View Live Telemetry**: You want a quick check before committing to a recording.
- **Callstack Sample**: The Game Thread is stalling or CPU usage is spiking and you want to see what native code is running.
- **System Trace**: You need a system-wide view of frame timing, thread scheduling, CPU core assignment, and power draw alongside CPU data.
- **Java/Kotlin Method Recording**: A hang or delay is coming from the Java layer.
- **Native Allocations**: Native memory is growing and you want to find which callsite is responsible.
- **Java/Kotlin Allocations**: Java or Kotlin objects are accumulating and you want to trace which code is allocating them.
- **Heap Dump**: You suspect a plugin is holding references that prevent activity teardown, or you want a point-in-time snapshot of live Java objects.

In a typical workflow with UE Android projects, you would start with Live Telemetry as an initial check of CPU and memory after a build. Then, switch to Callstack Sample, System Trace, or Native Allocations depending on what the live numbers suggest needs deeper investigation. The Java/Kotlin tasks are reserved for investigating UE's Java bridge layer (GameActivity, third-party plugins, and JNI surfaces).

### Connect Android Studio Profiler to a Build

To connect a profiler to an Unreal Engine Android build and start a task, follow these steps:

- Package your UE Android build with debug symbols preserved and native libraries left uncompressed. UE strips and compresses `.so` files by default.To find these UE build settings, in Unreal Editor, go to **Edit > Project Settings**, then go to **Platforms > Android**.** **
- In Android Studio's welcome window, click **Profile **or **Debug APK** and select your packaged UE Android APK. Android Studio unpacks it into `~/ApkProjects/`.
- In the **Project **pane, expand **cpp** and double-click **libUnreal.so**. The editor shows an ABI table with a missing debug symbols banner.
- Click **Add.** In your project's `Intermediate/Android` directory, navigate to the unstripped `libUnreal.so`, then click **OK **to attach.
- Open the Profiler from **View > Tool Windows > Profiler**, pick your device and the UE app's process, select a task from the **Home **tab, and click **Start profiler task**.

Android Studio starts a recording automatically.

The following sections cover each task and what to look for when profiling Unreal Engine Android projects.

### View Live Telemetry

View Live Telemetry shows live CPU and memory metrics for the running app without producing a recording or trace file. Start the task, watch the graphs during gameplay, and decide whether a deeper recording is worth taking.

Use Live Telemetry as a first check after a build. If CPU or memory looks reasonable at idle and during gameplay, you can move on. If CPU or memory spikes or trends in unexpected ways, switch to one of the other Android Studio Profiler tasks.

Live Telemetry shows a general trend, not precise measurements — treat the numbers as an initial signal.

### Find CPU Hotspots: Callstack Sample

The Callstack Sample task records a snapshot of the native callstack at regular intervals. The result is a **Threads **timeline showing what each thread was executing at each sample point. The sampling interval is configurable — shorter intervals give more resolution but produce larger trace files that can be slow to parse.

If you attached debug symbols to `libUnreal.so`, the **Threads **timeline shows symbolicated UE function names for every sample.

To sample the callstack, API level 26 or higher is required on the device.

To investigate what a specific thread is doing during a stall, follow these steps:

- Filter the **Threads **section to the UE thread of interest (**GameThread**, **RenderThread**, **RHIThread**).
- In the **Threads **section, expand a thread to see its stack frames sampled chronologically.
- Select a region of the sampled callstacks to see them in the Analysis panel.

### Capture System Activities: System Trace

The System Trace task records a Perfetto trace and displays it in Android Studio's UI rather than the Perfetto web app. The recording combines several stacked timelines:

- **CPU Usage**: Overall CPU consumption as a percentage of available capacity.
- **Display**: Per-frame timing on the main thread and the RenderThread.
- **Threads**: Every thread your app and the system run, with kernel scheduling events visible inline.
- **CPU Cores**: Per-core activity, showing which thread ran on which core at each moment.
- **Process Memory (RSS)**: Physical memory in use by the app.
- **Power Rails**: Power draw broken down by SoC subsystem.
- **Battery**: Overall battery state.

System Trace is the broadest tool inside Android Studio. Look for the following:

| If the question is... | Check... |
| --- | --- |
| Where is RenderThread time going relative to the Game Thread? | The **Display **timeline shows main-thread versus RenderThread cost per frame. |
| Are UE threads bouncing across CPU cores or stuck on one? | The **CPU cores** timeline. The Game Thread pinned to a little core is a common Android stall pattern on big.LITTLE SoCs. |
| Where is power going during gameplay? | The **Power Rails** row, if you are on a supported device. |
| Are kernel scheduling events stalling UE threads? | The **Threads **timeline for context switches and runqueue waits. |

#### Inspect Power Usage with Power Rails

Power Rails data appears in System Trace on supported physical devices. It breaks down power draw by SoC subsystem, letting you correlate power consumption with thread and frame activity in the same trace. Use it to validate battery optimization changes on an Unreal Engine build. Sustained high GPU power draw correlates with thermal throttling and shorter play sessions.

Power Rails requires a Pixel 6 or later running Android 10 (API 29) or higher. On other physical devices, the Battery row shows overall battery gauge data instead. Power Rails data is not available on emulators.

### Find CPU Hotspots: Java/Kotlin Method Recording

The Java/Kotlin Method Recording task records Java and Kotlin method calls during the recording window with exact timing.

Two modes are available: **Sampling **(lower overhead, sampled at intervals) and **Tracing **(instrumented; precise timing but 10–20% runtime overhead). Use Sampling mode unless you specifically need precise method timing.

Most of Unreal Engine’s runtime is in native code, which this task does not capture. Instead, use this task to investigate the Java bridge layer, which includes GameActivity, third-party plugin Java sides, and JNI surfaces. If a Java-side event such as audio focus loss, a lifecycle callback, or an intent handler is causing a hang, it will appear in the captured trace.

### Track Memory Consumption: Native Allocations

The Native Allocations task tracks every malloc/new and free/delete during the recording window and attaches a backtrace to each event. Results are presented in a table showing allocation and deallocation counts, sizes, and net totals per callsite. For a full description of each column, see Record native allocations in Android’s profiling documentation.

If you attached debug symbols to `libUnreal.so`, Native Allocations shows native memory activity by callsite.

To capture Unreal Engine allocations in Android Studio, add ``Target.StaticAllocator = StaticAllocatorType.Ansi;`` to your project's `Target.cs` for non-Shipping Android builds (arm64) and repackage. UE's binned allocator manages memory in its own arena and bypasses libc malloc otherwise, so without this override, UE allocations will not appear. Note that this substitutes UE's real allocator with bionic libc, so allocation patterns, fragmentation, and per-allocation overhead will not reflect production. Use this override for profiling only and revert when done.

By default, every time 2048 bytes of memory are allocated, a snapshot of memory is taken. To change this sample size, open the profiler’s **Task Settings** and change **Native Allocations > Sample interval**. Decrease the sample size for more accurate data on small allocations or increase it to reduce profiling overhead.

In the results, change the data sorting dropdown menu above the table to **Sort by Remaining Size** to find callsites whose allocations were not freed during the window, as this is the most common signature of native leaks.

The **Visualization **tab aggregates allocations by call stack, revealing the UE subsystems responsible for unbounded growth (texture streaming pools, audio mix buffers, third-party plugins).

### Track Memory Consumption: Java/Kotlin Allocations

The Java/Kotlin Allocations task records every Java or Kotlin object allocated during the recording window with a callstack.

This task requires a debuggable build.

In the **Allocation Tracking** dropdown, use **Sampled **allocation tracking to reduce overhead in allocation-heavy apps. **Full **mode captures every allocation but can visibly slow the app.

For UE projects, this task is useful for the Java side only (GameActivity, third-party Java plugins) and the few UE Android runtime classes. UE's native allocations do not appear here; for those, use Native Allocations.

### Analyze Memory Usage: Heap Dump

The Heap Dump task captures a single snapshot of every live Java or Kotlin object in the process, with reference chains showing what holds each object in memory. Use it to identify memory leaks by finding objects that should have been released but are still referenced.

This task requires a debuggable build.

The Java heap is small relative to Unreal Engine’s native heap, so heap dumps are mainly useful for plugin issues. For example, a third-party Android SDK holding strong references that prevent activity teardown, leftover bitmap allocations from UI overlays, or similar.

## Perfetto

Perfetto is the system-wide tracing tool that ships with Android and is supported on every modern device. It captures kernel scheduling events, ftrace data, CPU frequency changes, GPU memory usage, ATRACE markers from UE, and more. Use it to understand how your UE app interacts with the rest of the Android system.

Perfetto UI requires an Android device running Android 11 (API 30) or higher. If using an older version of Android, use the command line instructions in Perfetto’s System Tracing documentation.

If you are already familiar with Perfetto, use this guide to connect it with your UE Android builds. However, we recommend Android Performance Analyzer instead when possible — it provides similar system-wide trace data with a more accessible interface.

To connect Perfetto to a UE Android Build and record a trace, follow these steps:

- Open the Perfetto UI at ui.perfetto.dev in your browser.
- Click **Record new trace**.
- To select your connected device, click the wire button near the top of the screen.
- In the **Probes **list, we recommend configuring the following trace settings:In the **CPU **tab, ensure **Scheduling details** and **CPU frequency and idle states** are enabled (for thread-level performance).
- In the **GPU **tab, enable the following:GPU frequency
- **GPU memory**
- **GPU work period**
- If your device has a Mali GPU, Mali GPU Counters and Mali Fence Events

- In the **Power **tab, enable** Battery drain & power rails**.
- In the **Memory **tab, enable the following: Kernel meminfo. In its list of options, select mem_total and mem_free (as well as any other desired options).
- Native heap profiling if you need allocation-level data.

- In the **Android apps & svcs** tab, ensure **Atrace userspace annotations** is enabled, and add a checkmark to the **view **and **gfx **categories at minimum.

- Click the **Start tracing** button near the top of the screen, run your test scenario in the UE app, then click the **Stop **button.
- The trace opens in the Perfetto UI for analysis.

Unreal Engine emits ATRACE markers from its named threads (GameThread, RenderThread, RHIThread, and so on). Search for these thread names in the timeline to locate the UE-relevant rows.

## Snapdragon Profiler

Snapdragon Profiler is Qualcomm's profiling tool for Adreno GPUs and Snapdragon SoCs. It captures real-time and offline data across CPU, GPU, DSP, and memory subsystems. Use it for Adreno-equipped devices in the same role that Arm Performance Studio fills for Mali devices. Snapdragon Profiler's strength is broad Snapdragon SoC visibility alongside the Unreal Engine rendering pipeline.

To connect Snapdragon Profiler to a UE Android build and start a capture, follow these steps:

- Download Qualcomm Software Center and Snapdragon Profiler from the Qualcomm Developer Network. Install on your development host (Windows, Linux).If you have trouble downloading the Qualcomm Software Center, try a different web browser.
- Launch your UE app on your device.
- In Snapdragon Profiler, click **Connect**, select your device, then select your UE app's process.
- Choose a session type:**Realtime**: Live counters and graphs across CPU, GPU, and memory while the app runs.
- **Trace Capture**: System-wide trace covering CPU, GPU, kernel scheduling, and Vulkan / OpenGL ES calls over a span of time.
- **Snapshot Capture**: Single-frame GPU capture for offline inspection.

- Click Start to begin capture. Stop when done.

In the resulting data, look for:

- Adreno GPU counters such as fragment shader cycles, ALU and texture and load-store utilization, and tile bandwidth. High fragment cost typically points back to UE Material complexity.
- Memory bandwidth peaks. As with Mali, Adreno mobile rendering is often bandwidth bound. Spikes correlate with texture sampling and post-process passes.
- DSP and CPU activity. UE audio mixing and decode work runs on the CPU; unexpectedly high DSP usage typically points to third-party plugins.
- Frame snapshots show the full Vulkan command stream UE submits, similar to RenderDoc. Inspect render-pass load and store operations and confirm UE's mobile renderer is using the expected on-chip attachments.

## Correlating Platform and Engine Traces

Android platform tools and Unreal Insights timestamp their data, but their clocks are independent. To align the timelines, use one of the following approaches:

- **Mark a known point in both**: Trigger a recognizable event, such as a level load, a jump, or a button press, shortly after starting both traces. Use that event's timestamp as a reference point when comparing the two.
- **Capture sequentially**: Record a platform trace and an Insights trace separately, using the same test sequence each time. Comparing the two helps identify whether a problem originates in the engine or in the platform or driver layer.

For Perfetto specifically, Unreal Engine emits its own ATRACE scopes for major engine systems, which makes UE's internal structure visible directly inside Perfetto traces alongside the kernel and driver data.

## Further Reading

For a workflow that uses Mali Offline Compiler to improve shader performance, see Authoring Efficient Shaders for Optimal Mobile Performance by Zandro Fargnoli (Arm) and David Sena (NaturalMotion), GDC 2022.

- [image: Profiling iOS Projects with Platform-Native Tools] Profiling iOS Projects with Platform-Native ToolsPerform diagnostics on Unreal Engine iOS projects using Xcode and Instruments. (-> profiling-ios-projects-with-platformnative-tools)

- [image: Unreal Insights] Unreal InsightsProfile your project's performance with Unreal Insights. (-> unreal-insights-in-unreal-engine)

- android
- platform development
- mobile development

On this page

- Choosing a Tool (-> profile-android-projects-with-platformnative-tools)
- Prerequisites (-> profile-android-projects-with-platformnative-tools)
- Debuggable/Profilable Build Requirements (-> profile-android-projects-with-platformnative-tools)
- Android Performance Analyzer (-> profile-android-projects-with-platformnative-tools)
- Record a System Trace in Android Performance Analyzer (-> profile-android-projects-with-platformnative-tools)
- Interpreting APA Data for Unreal Engine Projects (-> profile-android-projects-with-platformnative-tools)
- Arm Performance Studio (-> profile-android-projects-with-platformnative-tools)
- Download and Install APS (-> profile-android-projects-with-platformnative-tools)
- Streamline (-> profile-android-projects-with-platformnative-tools)
- Frame Advisor (-> profile-android-projects-with-platformnative-tools)
- RenderDoc for Arm GPUs (-> profile-android-projects-with-platformnative-tools)
- Mali Offline Compiler (-> profile-android-projects-with-platformnative-tools)
- Android Studio Profiler (-> profile-android-projects-with-platformnative-tools)
- Connect Android Studio Profiler to a Build (-> profile-android-projects-with-platformnative-tools)
- View Live Telemetry (-> profile-android-projects-with-platformnative-tools)
- Find CPU Hotspots: Callstack Sample (-> profile-android-projects-with-platformnative-tools)
- Capture System Activities: System Trace (-> profile-android-projects-with-platformnative-tools)
- Inspect Power Usage with Power Rails (-> profile-android-projects-with-platformnative-tools)
- Find CPU Hotspots: Java/Kotlin Method Recording (-> profile-android-projects-with-platformnative-tools)
- Track Memory Consumption: Native Allocations (-> profile-android-projects-with-platformnative-tools)
- Track Memory Consumption: Java/Kotlin Allocations (-> profile-android-projects-with-platformnative-tools)
- Analyze Memory Usage: Heap Dump (-> profile-android-projects-with-platformnative-tools)
- Perfetto (-> profile-android-projects-with-platformnative-tools)
- Snapdragon Profiler (-> profile-android-projects-with-platformnative-tools)
- Correlating Platform and Engine Traces (-> profile-android-projects-with-platformnative-tools)
- Further Reading (-> profile-android-projects-with-platformnative-tools)

Related documents

Profiling iOS Projects with Platform-Native Tools

 [image: Profiling iOS Projects with Platform-Native Tools] (-> profiling-ios-projects-with-platformnative-tools)Testing and Optimizing Your Content

 [image: Testing and Optimizing Your Content] (-> testing-and-optimizing-your-content)Android Support

 [image: Android Support] (-> android-support-for-unreal-engine)Performance and Optimization

 [image: Performance and Optimization] (-> performance-and-optimization-for-mobile-in-unreal-engine)

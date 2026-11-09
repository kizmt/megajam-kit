# Context Switches

https://dev.epicgames.com/documentation/en-us/unreal-engine/context-switches-in-unreal-engine-5?application_version=5.9

> An Overview of the Context Switches in Unreal Insights.

[image: Context Switches]

## Context Switches

A **Context Switch** stores the state of a process or a thread, so it can be restored and resume execution at a later point. When attempting to profile Context Switches with a Launcher Build, You will want to ensure that you enable "Editor Symbols for Debugging" from the Options for your Engine Version.

Context Switches are supported on Windows, XB1/XSX, and PS4/PS5 platforms.

- You can enable the **ContextSwitch** trace channel in the command line: ```
         -trace=default,ContextSwitch

``` -trace=default,ContextSwitch On Windows, depending on your user permission settings your project runtime should be "run as administrator".

- Open your trace file in Unreal Insights, If a session has the `ContextSwitch` trace event enabled, then the following information will be displayed in the Timing Insights view:

a) Additional CPU Core tracks. One for each CPU core in the recorded trace; shows timing events indicating what thread does execute on the respective CPU core. "Unknown" timing events indicate execution of threads from other applications / processes or from the OS.

b) Each CPU Thread has a header lane with core number events indicating on which core the respective thread is executing. The time range when a thread is executing and when it is preempted it is highlighted.

 [image: cpu-thread]

c) CPU/GPU drop down menu shows additional options re Context Switches:

 [image: cou-gpu-context-menu]

d). The context menu of a "Core" timing event in a Cpu Thread track shows additional options:

 [image: core-timing-event-track]

e). The context menu of a "Thread" timing event in a CPU Core track shows additional options:

 [image: thread-timing-event]

- optimization
- insights
- profiling

On this page

- Context Switches (-> context-switches-in-unreal-engine-5)

# Stage Monitor

https://dev.epicgames.com/documentation/en-us/unreal-engine/stage-monitor-with-unreal-engine?application_version=5.9

> Stage Monitor reports events from multiple instances of Unreal Engine

[image: Stage Monitor]

Learn to use this **Beta** feature, but use caution when shipping with it.

When operating a stage in a live environment, multiple machines running instances of **Unreal Engine** (UE) work in tandem and rely on each other. Operators may use some instances to render on a LED wall, some could be used to modify the scene in the Editor, and others may be used for compositing. With Stage Monitor, you can receive reports of different events from all these instances of UE and be able to troubleshoot any issues in the setup.

Click image to expand.

At the end of this overview, you will be familiar with how to use Stage Monitor and how to add custom events for your project.

## Required Plugins

Add the following plugins to your Project to get started with Stage Monitor.

| **Plugin Name** | **Purpose** |
| --- | --- |
| **Stage Monitoring** | Required - Main plugin enabling data providers and stage monitoring logic. |
| **Virtual Production Utilities** | Required - Enabled with StageMonitoring plugin to be able to use VirtualProduction role's feature. |
| **Switchboard** | Optional - Facilitates launching multiple instances of UE operating a stage. It can also be used to configure the role assigned to each instance. |

Follow these steps to enable the plugins for your project:

- From the Main Menu Bar, select **Edit** > **Plugins**.

- In the **Plugins** window, find the **Stage monitor** plugin and check **Enable**. Click image to expand.

- When prompted, select **Yes**.

- Click **Restart Now** to close the Editor and restart with your new Plugin activated.

- Repeat the above process to enable the **Virtual Production Utilities** and **Switchboard** plugins.

These plugins may already be enabled by default, depending on the version of UE that you are working in. It's best to double-check that they're enabled while in the Plugins menu.

## Setting up Timecode

Each instance of Unreal Engine generates its own timecode. With multiple machines communicating together, events can appear to be out of order in Stage Monitor if they're not synchronized. To effectively monitor UE instances, enable Timecode on all instances you want to monitor and use the same timecode provider. See Timecode and Genlock (-> timecode-and-genlock-in-unreal-engine) for more information on synchronizing timecode across machines.

## Assigning Machine Roles

When operating a stage, each machine can perform a different role, such as renderer, editor, or compositor. Instances of UE can be assigned roles in a command-line argument or in Switchboard to utilize different logic based on their function. Stage Monitor uses these roles to determine what events an instance can generate and whether the instance should be monitored.

### Assigning Roles in Switchboard

Switchboard will look for the file `VPRoles.ini` in each instance's project folder at `\Config\Tags\VPRoles.ini`. In the following example, the roles Render, Editor, and Compositor were added to the `VPRoles.ini` file:

```
[/Script/GameplayTags.GameplayTagsList]
GameplayTagList=(Tag="Render", DevComment="")
GameplayTagList=(Tag="Editor", DevComment="")
GameplayTagList=(Tag="Compositor", DevComment="")
```

[/Script/GameplayTags.GameplayTagsList]
GameplayTagList=(Tag="Render", DevComment="")
GameplayTagList=(Tag="Editor", DevComment="")
GameplayTagList=(Tag="Compositor", DevComment="")

In Switchboard, you can adjust the roles for each instance in the settings.

Click image to expand.

### Assigning Roles in Command Line

You can assign each instance a role through a command-line argument. When launching the instance of UE, add the argument `: -VPRole=RoleName`, where `RoleName` is the role you assign to the machine, such as Editor.

## Opening Stage Monitor

Stage Monitor data providers are started by default unless role filtering is used. When each instance is launched, they will look for a Stage Monitor, and once found they will start sending events. Periodically, an instance that is monitoring others will broadcast messages to discover data providers. Once a monitor is found, the data provider will start to send out any events that are emitted. Launch Stage Monitor to confirm that it sends and recieves information in the expected order.

Follow these steps to launch Stage Monitor:

- Click the **Window** tab and **Virtual Production** > **Stage monitor.**

- Activate the Stage Monitor using the **Monitor Status** toggle switch.

- Once activated, you should be able to view connected instances in the upper menu. Click image to expand.

- Additionally, once activated you should see a steady stream of stage events populating the lower window. Click image to expand.

## Using Stage Monitor

Once the information starts flowing into Stage Monitor, it can be a lot to process. Here are some items to look for, and some tips to help you manage the event logs.

### Critical State

Take Recorder (-> record-gameplay-in-unreal-engine) uses the event type Critical State to designate when the scene is being recorded. While you're recording, any event could impact the result. This means that when a take has started, the stage enters Critical State, and when you stop the take, the stage exits Critical State. Since Critical State is an event type, you can set your own Critical States for any scenario.

To see Stage Monitor enter Critical State with TakeRecorder follow these steps.

- Launch **Stage Monitor** and confirm that all instances of UE are connected and properly reporting events.

- Launch **Take Recorder** by going to **Window** > **Cinematics** > **Take Recorder.**

- In the **Take Recorder**, click the **Start Take** button.

- After a brief pause, you will notice the Stage Monitor status indicator turn from green (not operational) to red (operational), indicating that the Stage Monitor is now in the Critical State.

- Notice that while in the Critical State, events in the Event Log will be highlighted.

- Click the **Stop Take** button in the **Take Recorder** to stop the take.

The video below shows this process in action.

### Filtering

After a while, message logs become bigger and it might get harder to find something specific within them. Using the filtering menu, you can easily focus on the message types you are interested in, data providers that you want to isolate, and to only see events that happened while the stage was operational.

- Launch the **Stage Monitor** by selecting **Window** > **Virtual Production** > **Stage Monitor**.

- Under the **Event Log**, expand the **Filters** dropdown menu.

- Select **Message Type** to filter by specific message types.

- Select **Provider** to filter events by **Event Provider.**

- Enable and select **Role** option to filter based on Role.

- Enable and select **Critical State Source** option to filter based on Critical State sources.

- Enable and select **Time** option to filter events by Time.

### Exporting / Importing

Once a session is done, it is possible to export all events and providers to a JSON file. You can then review these logs externally, or directly in UE.

- Launch the **Stage Monitor** by choosing **Window** > **Virtual Production** > **Stage Monitor.**

- Near the upper left of the Stage Monitor, note the series of five buttons.

- Click the **disk icon** to export the current log. After clicking the button you will be asked where you would like to save the log.

- Click the **orange dot** on the left to enter review mode.

- When entering review mode, you will see the name next to **CurrentSession** change to reflect the file you are reviewing.

- While in review mode, click the **folder icon** to load a previously recorded log and review it.

Once a file has been opened, you can use the same filters to isolate specific events.

## Stage Monitor Event Types

A couple of types of Stage Monitor events are triggered with the base version of UE. New types can be added through C++ by adding a dependency to the `StageDataCore` module, and inheriting FStageProviderEventMessage for events. Additionally, you can extend FStageProviderPeriodicMessage for repetitive messages. Below is a table listing common events, their file location, and their purpose.

| **Event Name** | **File Location** | **Description** |
| --- | --- | --- |
| **Critical State Provider Message** | `StageMessages.h` | Sent when entering or exiting Critical State. |
| **Stage Provider Discovery Response Message** | `StageMessages.h` | Part of the discovery protocol between monitors and providers. |
| **Stage Provider Close Message** | `StageMessages.h` | Sent when a provider is shutting down. |
| **Frame Performance Provider Message** | `StageMonitorUtils.h` | Periodically sent to refresh provider's frame data. |
| **Hitch Detection Message** | `FramePerformanceProvider.h` | Sent when a frame takes more time than the maximum allowed time desired. |
| **Genlock State Event** | `GenlockWatchdog.h` | Sent when CustomTimeStep is a genlocked one and its stage changed. |
| **Genlock Hitch Event** | `GenlockWatchdog.h` | Sent when CustomTimeStep is a genlocked one and a genlock signal (a frame) was missed. |
| **Timecode Provider State Event** | `TimecodeProviderWatchdog.h` | Sent when state of TimecodeProvider changes. |
| **Timed Data Monitor Channel ConnectionState Event** | `TimecodeProviderWatchdog.h` | Requires TimedDataMonitor plugin. Sent when a channel connection state changes. |
| **Timed Data Monitor Channel Evaluation State Event** | `TimedDataMonitorSubsystem.h` | Requires TimedDataMonitor plugin. Sent when a channel evaluation state changes. |

### Adding Event Types

Follow these steps to add custom Stage Monitor event types.

- In the Editor's main menu, choose File > Open Visual Studio. If you don't see this option, select New C++ Class...

- In Visual Studio's Solution Explorer find the module, defined in a .Build.cs file, where you want to emit stage events. Append `StageDataCore` to the PublicDependencyModuleNames range: ```
     PublicDependencyModuleNames.AddRange(new string[] { "Core", "CoreUObject", "Engine", "InputCore", "StageDataCore" });
``` PublicDependencyModuleNames.AddRange(new string[] { "Core", "CoreUObject", "Engine", "InputCore", "StageDataCore" });

- In a C++ header file, define your stage event data structure and inherit from either FStageProviderEventMessage or FStageProviderPeriodicMessage . In the following header file MyStageEvents.h, FMyStageEvent is inheriting from FStageProviderEventMessage and expects the data to be int32: ```
             #include "StageMessages.h"

             #include "MyStageEvents.generated.h"

             USTRUCT ()
             struct FMyStageEvent : public FStageProviderEventMessage
             {
             GENERATED_BODY ()

             public:
             FMyStageEvent () = default;
             FMyStageEvent (int32 InMyVariable) : MyVariable (InMyVariable)
             {}

             public:
             int32 MyVariable = 0;
             }
``` #include "StageMessages.h" #include "MyStageEvents.generated.h" USTRUCT () struct FMyStageEvent : public FStageProviderEventMessage { GENERATED_BODY () public: FMyStageEvent () = default; FMyStageEvent (int32 InMyVariable) : MyVariable (InMyVariable) {} public: int32 MyVariable = 0; }

- In your code, whenever you want to emit an event, call IStageDataProvider::SendMessage<>() with your event as the template parameter. For example, emit the event created above with the following:: ```
             int32 DataToSend = 3;
             IStageDataProvider::SendMessage<FMyStageEvent>(EStageMessageFlags::Reliable, DataToSend);
``` int32 DataToSend = 3; IStageDataProvider::SendMessage(EStageMessageFlags::Reliable, DataToSend);

Since UE sends messages using UDP, a message could be lost or dropped and never received. Using the flag `EStageMessageFlags::Reliable` ensures that the Stage Monitor will receive the message.

If you are sending a periodic message, you can use `EStageMessageFlags::None` instead of the Reliable flag.

## Stage Monitor Settings

You can find settings for Stage Monitor either directly within the tool, or under your project's Project Settings.

- To access Stage Monitor settings from the Unreal Editor, go to **Edit** > **Project Settings** and Search **Stage.**

- To access Stage Monitor settings from within the tool, start by launching the **Stage Monitor** by going to **Window** > **Virtual Production** > **Stage Monitor.**

- Once in the tool click the **cogs** button.

Below is a review of the most important settings and their purposes.

### General Settings

| **Setting Name** | **Description** |
| --- | --- |
| **Use Session ID** | You can use a sessionId to differentiate between two stages operating on the same network. You can then pass that sessionId using the command line to each instance using -StageSessionId=. |
| **Timeout Interval** | Time required for a provider to consider a monitor to be disconnected as well as the time for a monitor to consider a provider to be disconnected. |

### Monitor Settings

| **Setting Name** | **Description** |
| --- | --- |
| **Supported Roles** | Used to filter monitoring logic to only be used when an instance has a specific role. Useful when you auto start monitoring but don't want it to be used on render nodes for example. |
| **Auto Start** | By default, monitoring logic doesn't start automatically. You can start it in the monitor panel but if you want it to be started when an instance is launched, you can check that setting. If you are not using role filtering, this means that any instance will be monitoring, which can increase network traffic a lot in case of multiple instances being used. |

### Provider Settings

| **Setting Name** | **Description** |
| --- | --- |
| **Supported Roles** | Only enable data provider logic when an instance has a role from that list. |
| **Message Type Role Exclusion** | By default, any data provider will emit any event that is triggered. This can clutter monitoring logs a lot especially when hitch detection is enabled. For example, when using the editor, for sure some hitches will be triggered when the user goes in menus. To filter that, you can use this setting to assign specific roles for a given event type to filter which kind of instance can trigger that event. |
| **Update Interval** | UE periodically sends this message from all data providers. It includes information about frame timing and is used as a heartbeat. It can give you a quick idea in the monitor panel about all your providers and how they are going. That setting controls the rate at which UE sends these messages. |
| **Enable Hitch Detection** | Enable basic hitch detection logic. This will use the stat thread so messages will be drawn on the viewport, including render nodes. To avoid that, you need to launch with -ExecCmds="DisableAllScreenMessages". |
| **Minimum Frame Rate** | When rendering or game thread takes more than that frame rate interval, a hitch event will be triggered. |

### Export Settings

| **Setting Name** | **Description** |
| --- | --- |
| **Keep Only Last Period Message** | When exporting to JSON, only export the last message for all period types of events. This is used to reduce file size. |
| **Exclude Message Types** | Add the message type you want to exclude when exporting to JSON. |

- beta
- virtual production
- networking

On this page

- Required Plugins (-> stage-monitor-with-unreal-engine)
- Setting up Timecode (-> stage-monitor-with-unreal-engine)
- Assigning Machine Roles (-> stage-monitor-with-unreal-engine)
- Assigning Roles in Switchboard (-> stage-monitor-with-unreal-engine)
- Assigning Roles in Command Line (-> stage-monitor-with-unreal-engine)
- Opening Stage Monitor (-> stage-monitor-with-unreal-engine)
- Using Stage Monitor (-> stage-monitor-with-unreal-engine)
- Critical State (-> stage-monitor-with-unreal-engine)
- Filtering (-> stage-monitor-with-unreal-engine)
- Exporting / Importing (-> stage-monitor-with-unreal-engine)
- Stage Monitor Event Types (-> stage-monitor-with-unreal-engine)
- Adding Event Types (-> stage-monitor-with-unreal-engine)
- Stage Monitor Settings (-> stage-monitor-with-unreal-engine)
- General Settings (-> stage-monitor-with-unreal-engine)
- Monitor Settings (-> stage-monitor-with-unreal-engine)
- Provider Settings (-> stage-monitor-with-unreal-engine)
- Export Settings (-> stage-monitor-with-unreal-engine)

# Capturing Data with Chaos Visual Debugger

https://dev.epicgames.com/documentation/en-us/unreal-engine/capturing-data-with-chaos-visual-debugger?application_version=5.9

> Capture and play back recordings with Chaos Visual Debugger.

[image: Capturing Data with Chaos Visual Debugger]

In the following tutorials, you’ll use **Chaos Visual Debugger (-> chaos-visual-debugger-in-unreal-engine)** (**CVD**) to capture and play back recordings for targets on local or remote machines, including:

- Game clients and servers
- Packaged builds
- Play-in-editor sessions

[image: CVD Capture City Sample]

## Data Channels

CVD records a considerable amount of data from several systems. The more complex a scene is, the larger the CVD file becomes — which can impact performance. To manage file size, you can opt-out of recording certain data by toggling the **data channels**.

Data channels control which simulation stages or data visualization flags that CVD records.

To toggle data channels, click **Data Channels **in the main toolbar and check the desired channels.

[image: Toggle Data Channels]

Recording in CVD requires access to the console, such as in the **Test** or **Development** build configurations. When using the Test configuration, the CVD outliner does not display objects’ debug names. For more information on build configurations, see Packaging Unreal Engine Projects (-> packaging-your-project).

## Session Targets

CVD describes the application or editor that you intend to record (such as a game client, game server, packaged build, or a PIE session) as a **target**. With the exception of PIE sessions, you can record one or more targets at a time, referred to as **single **or **multiple **sources.

The **Session Target **dropdown menu provides target presets to choose from when preparing to record, but you can also specify a custom target. By default, this menu is set to Local Editor — meaning that if you intend to record a local PIE session, you can leave this as is.

[image: Session Targets]

| Target | Description | Source Amount |
| --- | --- | --- |
| **Local Editor** | Records a local PIE session. | Single |
| **All Remote** | Records all instances that are not the Editor. | Multiple |
| **All Remote Servers** | Records all game servers that are not the Editor. | Multiple |
| **All Remote Clients** | Records all game clients that are not the Editor. | Multiple |
| **All** | Records all available targets. | Multiple |
| **Custom Selection** | Records a custom target or targets. | Single or Multiple |

Recording multiple targets is useful if you are already recording a game server and game client, and need to record an additional client.

## Next Up

- [image: Recording to File] Recording to FileRecord to file with Chaos Visual Debugger (-> recording-to-file)

- [image: Recording a Live Session] Recording a Live SessionRecord a live session with Chaos Visual Debugger (-> live-debugging-with-chaos-visual-debugger)

- [image: Playback in Chaos Visual Debugger] Playback in Chaos Visual DebuggerPlay back recordings in Chaos Visual Debugger. (-> playback-in-chaos-visual-debugger)

- chaos visual debugger

On this page

- Data Channels (-> capturing-data-with-chaos-visual-debugger)
- Session Targets (-> capturing-data-with-chaos-visual-debugger)
- Next Up (-> capturing-data-with-chaos-visual-debugger)

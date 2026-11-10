# Recording to File

https://dev.epicgames.com/documentation/en-us/unreal-engine/recording-to-file?application_version=5.9

> Record to file with Chaos Visual Debugger

[image: Recording to File]

In this tutorial, you’ll learn how to record visualizations in **Chaos Visual Debugger (-> chaos-visual-debugger-in-unreal-engine) **(**CVD**) and save them as a `.utrace` file for later debugging. Recording to file is useful if you don't want the performance overhead of live playback.

For information on recording visualizations in real time, see Recording a Live Session (-> live-debugging-with-chaos-visual-debugger).

## Start a Recording Using the UI

In this section you’ll learn how to record a PIE session using the Local Editor target preset, and the process to record all other target types.

### Local Editor

To record and play back a local PIE session, follow these steps:

- In CVD, in the **Data Channels** menu, toggle the data channels you want to record.[image: Toggle Data Channels]
- In Unreal Editor, click the **Play **button in the main toolbar to begin a PIE session. You can choose to begin the PIE session before or after beginning a recording in CVD.[image: Play Button]
- Since the target Local Editor is already selected by default, you can begin the recording by clicking **Record to File**. While recording, this button turns into a red recording icon.[image: Record To File]
- To stop recording, hover over the recording icon and click the red square icon.[image: Stop Recording]
- This process outputs a single `.utrace` file that you can load immediately after recording by clicking **Yes **in the dialog box.[image: Save To File]

 If you are currently recording, you can quit an existing PIE session and begin a new one — CVD automatically connects to it.

### All Other Targets

To record all other target types, follow these steps:

- Verify that your target application or applications are running.
- In CVD, toggle the data channels you want to record.[image: Toggle Data Channels]
- To select a target to record, click the **Session Target** dropdown menu in CVD’s main toolbar and choose a preset or custom target(s).[image: Session Targets]
- To begin a recording, in CVD’s main toolbar, click the **Record to File**. While recording, this button turns into a red recording icon.[image: Record To File]
- To stop recording, highlight the recording icon and click the red square icon.[image: Stop Recording]

Depending on whether you record a single or multiple targets, this process outputs one or more `.utrace` files. If you record multiple targets, the dialog that prompts you to load the recording does not appear.

## (Legacy) Record to File Using the Command Line Interface

We recommend using CVD’s UI to start and end recordings, however, you can use the command line to record PIE sessions, game clients and servers, and packaged builds.

### Enable a Data Channel

- To modify data channels, open the command line in the target application. In a packaged build, press **Backtick** (`).
- Enter the following console command, replacing `[newstate]` with true or false and `[channelname]` with the desired data channel:`p.Chaos.VD.SetCVDDataChannelEnabled [newstate] [channelname]`For example:[image: Legacy Record To File]
- Press **Enter **to execute the command.

### Enable Multiple Data Channels

To enable or disable multiple channels by listing them, separated by commas. The following example enables the **PostIntegrate **and **Scene Queries** channels:

`p.Chaos.VD.SetCVDDataChannelEnabled true SceneQueries,PostIntegrate`

[image: Legacy Multiple Channels]

### Enable Predefined Data Channels

To launch a game client or server with a predefined set of enabled channels, add the following command line argument:

`CVDDataChannelsOverride=[ChannelName1,ChannelName2]`

The following example enables the Integrate and Scene Queries channels:

`CVDDataChannelsOverride=SceneQueries,PostIntegrate`

### Start a Recording Using the Command Line

- To start a recording, open the command line in the target application. If you’re running a packaged build, you can press **Backtick** (`).
- Type the following command and press **Enter **to execute it:`p.Chaos.StartVDRecording`[image: Start Recording (Console)][image: Start Recording (Legacy)]When the recording begins, the string Chaos Visual Debugger recording in progress… displays on screen.[image: Recording In Progress String]
- To stop a recording, open the command line, type the following command, and press Enter to execute it.`p.Chaos.StopVDRecording`[image: Stop Recording (Console)]

## Next Up

In the next tutorial, you’ll learn how to locate your `.utrace` files and play back your recordings.

- [image: Recording a Live Session] Recording a Live SessionRecord a live session with Chaos Visual Debugger (-> live-debugging-with-chaos-visual-debugger)

- [image: Playback in Chaos Visual Debugger] Playback in Chaos Visual DebuggerPlay back recordings in Chaos Visual Debugger. (-> playback-in-chaos-visual-debugger)

On this page

- Start a Recording Using the UI (-> recording-to-file)
- Local Editor (-> recording-to-file)
- All Other Targets (-> recording-to-file)
- (Legacy) Record to File Using the Command Line Interface (-> recording-to-file)
- Enable a Data Channel (-> recording-to-file)
- Enable Multiple Data Channels (-> recording-to-file)
- Enable Predefined Data Channels (-> recording-to-file)
- Start a Recording Using the Command Line (-> recording-to-file)
- Next Up (-> recording-to-file)

# Recording a Live Session

https://dev.epicgames.com/documentation/en-us/unreal-engine/live-debugging-with-chaos-visual-debugger?application_version=5.9

> Record a live session with Chaos Visual Debugger

[image: Recording a Live Session]

In this tutorial, you’ll learn how to record and play back an application in real time using **Chaos Visual Debugger (-> chaos-visual-debugger-in-unreal-engine)** (**CVD**). Unlike recording to file (-> recording-to-file), recording a live session can be done **locally **(on your machine) or **remotely **(over a network). This is useful for live debugging on the fly but also saves the recording as a `.utrace` file for you to review and share later on.

[image: Recording a Live Session]

## Record Live Sessions

In this section you’ll learn how to record a PIE session using the Local Editor target preset, and the process to record all other target types.

### Local Editor

To record and play back a live PIE session on a local or a remote machine, follow these steps:

- In CVD, toggle the data channels you want to record.[image: Toggle Data Channels]
- In Unreal Editor, click the **Play **button in the main toolbar to begin a PIE session. You can start the PIE session before or after beginning a recording in CVD[image: Play Button]
- Since the Local Editor target is already selected by default, you can begin the recording by clicking **Record Live Session**. While recording, this button turns into a red recording icon.[image: Record Live Session]
- To stop recording, highlight the recording icon and click the red square icon. This process outputs a single `.utrace` file.[image: Stop Recording]If you are currently recording, you can quit an existing PIE session and begin a new one — CVD automatically connects to it.

### All Other Targets

To record and playback a game client, server, or packaged build on a local or remote machine, follow these steps:

- Verify that your target application or applications are running.
- Toggle the data channels you want to record.[image: Toggle Data Channels]
- To select a target to record, in CVD’s main toolbar, click the **Session Target **dropdown menu and choose your target.[image: Session Target]
- To begin a recording, in CVD’s main toolbar, click **Record Live Session**. While recording, this button turns into a red recording icon.[image: Record Live Session]
- To stop recording, highlight the recording icon and click the red square icon. This process outputs one or more `.utrace` files.[image: Stop Recording]

The game client and CVD compete for GPU resources. If the playback in CVD is struggling, you can limit the game client’s framerate or reduce the graphics quality.

## (Legacy) Record a Live Session with the Command Line Interface

We recommend using CVD’s UI to start and end recordings, however, you can use the command line to record PIE sessions, game clients and servers, and packaged builds. The session can be local (on the same workstation or even in the same PIE instance) or over the network.

### Enable a Data Channel

- To modify data channels, open the command line in the target application. In a packaged build, press **Backtick **(`).
- Enter the following console command, making sure to replace `[newstate]` with true or false and `[channelname]` with the desired data channel:` p.Chaos.VD.SetCVDDataChannelEnabled [newstate] [channelname]` For example:[image: Recording Live (Console)]
- Press **Enter **to execute the command.

### Enable Multiple Data Channels

You can enable or disable multiple channels by listing them, separated by commas. The following example enables the **PostIntegrate **and **Scene Queries **channels:

`p.Chaos.VD.SetCVDDataChannelEnabled true SceneQueries,PostIntegrate`

[image: Recording Live Multiple Channels (Console)]

### Enable Predefined Data Channels

If you want to launch a game client or server with a predefined set of enabled channels, add the following command line argument:

`CVDDataChannelsOverride=[ChannelName1,ChannelName2]`

The following example enables the Integrate and Scene Queries channels:

`CVDDataChannelsOverride=SceneQueries,PostIntegrate`

### Start a Recording Using the Command Line

- To start a recording, open the command line.
- If you are working on a local machine, type the following command and press **Enter **to execute it:`p.Chaos.StartVDRecording Server`[image: Start Recording Server (Console)]If you are working on a remote machine, type the following command and press **Enter **to execute it:`p.Chaos.StartVDRecording Server [YOURWORKSTATIONIP]`
- In CVD’s main toolbar, click **Connect To Session**. In the **Live Session Browser**, next to **Selected Live Session**, select the available live session running on the local trace store.
- (Optional) If you’re connecting to multiple targets, from the **Connection Mode** dropdown menu, select **Multi Source**.[image: Multi Source Connection Mode]
- Click **Connect to Session **(in the **Live Session Browser** dialog). When the recording begins, the string **Chaos Visual Debugger recording in progress…** displays on screen.[image: Recording String]
- To stop a recording, open the command line. If you’re working on a local machine, type the following command and press **Enter**:`p.Chaos.StopVDRecording Server`[image: Stop Recording Server (Console)]If you’re working on a remote machine, type:`p.Chaos.StopVDRecording Server [YOURWORKSTATIONIP]`

## Next Up

In the next tutorial, you’ll learn how to locate your `.utrace` files and play back your recordings.

- [image: Playback in Chaos Visual Debugger] Playback in Chaos Visual DebuggerPlay back recordings in Chaos Visual Debugger. (-> playback-in-chaos-visual-debugger)

On this page

- Record Live Sessions (-> live-debugging-with-chaos-visual-debugger)
- Local Editor (-> live-debugging-with-chaos-visual-debugger)
- All Other Targets (-> live-debugging-with-chaos-visual-debugger)
- (Legacy) Record a Live Session with the Command Line Interface (-> live-debugging-with-chaos-visual-debugger)
- Enable a Data Channel (-> live-debugging-with-chaos-visual-debugger)
- Enable Multiple Data Channels (-> live-debugging-with-chaos-visual-debugger)
- Enable Predefined Data Channels (-> live-debugging-with-chaos-visual-debugger)
- Start a Recording Using the Command Line (-> live-debugging-with-chaos-visual-debugger)
- Next Up (-> live-debugging-with-chaos-visual-debugger)

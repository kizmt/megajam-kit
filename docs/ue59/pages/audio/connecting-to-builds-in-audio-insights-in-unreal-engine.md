# Connecting Audio Insights to Builds

https://dev.epicgames.com/documentation/en-us/unreal-engine/connecting-to-builds-in-audio-insights-in-unreal-engine?application_version=5.9

> Set up Audio Insights to trace standalone Windows builds or networked console builds using Unreal Insights.

[image: Connecting Audio Insights to Builds]

Audio Insights works out of the box with Play in Editor sessions, but you can also connect it to a running standalone build to profile audio closer to what players will actually experience. This requires Unreal Insights as the bridge between your build and Audio Insights. This page covers setting up that connection, whether you want a live view with nothing saved to disk, or a recorded trace file you can review later.

## Using Audio Insights with Standalone Builds

You can use Audio Insights with standalone builds, either on the same device in the case of Windows builds, or connected over the network for console builds. Using Audio Insights with a standalone build requires you to also use Unreal Insights.

- In Unreal Editor's bottom toolbar, in the **Trace **menu, click **Unreal Insights (Session Browser)**, then exit the editor after Unreal Insights starts.Alternatively, you can run Unreal Insights from the command line using:`/Engine/Binaries/Win64/UnrealInsights.exe -DisableFramerateThrottle`The DisableFramerateThrottle flag enables Unreal Insights to run at 60fps even when not in focus.
- This connects to the currently-running game on the localhost. In the **Trace Store**, find the trace with LIVE (in red) in the **Status **column, then double-click it to bring up the trace session window.
- Go to **Menu** and select **Audio Insights**.
- This opens an Audio Insights window that functions similar to Unreal Editor's Audio Insights window that connects to a PIE session.If you do not specify `audio,audiomixer` trace channels when you are connecting, Audio Insights asks you to enable them as the window opens.
- Start your standalone game with the `-Messaging` flag and connect to it from Unreal Insights by using the **Connection **tab. Enter `audio,audiomixer` (with no space after the comma) in the **Initial Channels** field, then click **Connect**.

A standalone instance of Audio Insights does not have the same messaging as when you use it with PIE. The differences are documented below for each tab.

Standalone trace recording summary:

- Run `/Engine/Binaries/Win64/UnrealInsights.exe -DisableFramerateThrottle`
- Enter `audio,audiomixer` in the **Initial Channels** field of the **Connection **tab.
- Start your game using the command `MyGame.exe -messaging`.
- In Unreal Insights, click **Connect**.
- Go to the **Trace Store** tab and double-click on the **LIVE session**.
- In the new window's menu, select **Audio Insights**.

### Controlling Trace Recordings in Standalone Mode

When running Audio Insights in standalone mode from Unreal Insights, you need to use the Session Frontend tab to control the recording of your trace file.

To stop or restart the recording, select the current session for your application and click the start/stop tracing button.

### Using Audio Insights with a Console Build

You can use Audio Insights with a console build on another networked machine.

- Set the following additional command-line arguments for the game executable: `-messaging -tracehost=192.168.1.100 -trace=audio,audiomixer`
- Replace the **Tracehost IP address** with the address of the computer running Unreal Insights and the Unreal Trace Server. The image below uses an Xbox dev system as an example:

### Monitor a Standalone Build Without a Trace File

You can monitor a standalone build on the local host without recording a trace file using Unreal Insights.

- In the **Connection **tab, click **Start Unreal Insights**:
- When the timing window appears, open the Audio Insights window from the menu as before, then start your `game.exe` with the `-messaging` option. This displays audio information in Audio Insights without saving a file.
- You can verify this by returning to the Trace Store tab on Unreal Insights and confirming there are no current traces indicated with the red LIVE text.

Monitoring a standalone game is not an option with networked console builds; you must record a trace for networked console builds.

On this page

- Using Audio Insights with Standalone Builds (-> connecting-to-builds-in-audio-insights-in-unreal-engine)
- Controlling Trace Recordings in Standalone Mode (-> connecting-to-builds-in-audio-insights-in-unreal-engine)
- Using Audio Insights with a Console Build (-> connecting-to-builds-in-audio-insights-in-unreal-engine)
- Monitor a Standalone Build Without a Trace File (-> connecting-to-builds-in-audio-insights-in-unreal-engine)

Related documents

Profiling with Audio Insights

 [image: Profiling with Audio Insights] (-> audio-insights-in-unreal-engine)

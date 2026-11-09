# VR Profiling Tools

https://dev.epicgames.com/documentation/en-us/unreal-engine/vr-profiling-tools-in-unreal-engine?application_version=5.9

> Internal and external tools you can use for profiling your Unreal Engine VR project

[image: VR Profiling Tools]

This page contains information about profilng tools specifically designed for VR projects and devices. For general performance troubleshooting and information, you can use Unreal Insights (-> unreal-insights-in-unreal-engine) to gather details about the performance of your project.

## Oculus Performance Head-Up Display

Oculus Performance Head-Up Display is a tool that can be used to display performance information, whether in the editor or a packaged build. This tool will help verify the actual CPU and GPU timings, excluding any throttling done by the application. For an overview of the screens and what the values mean, refer to Oculus' documentation.

In general, you'll want to look at the graphs and values on the **Application Render Timing** screen. These will give you the CPU and GPU timings as the Oculus compositor sees them, and will be more accurate for Draw and GPU timings.

To use Oculus PerfHud with Unreal Engine, you will need to do the following:

- First, go to `C:\Program Files\Oculus\Support\oculus-diagnostics` and locate the **OculusDebugTool.exe**.

- Double - click on the OculusDebugTool.exe to open it up and set the **Visible HUD** to the **Performance** option.

- Now launch your project and put your Oculus Rift HMD on and you will see the performance information related to your UE project being displayed on the Rift. To change what type of information is displayed, you will need to change what is input into the Visible HUD option like in the image below.

## SteamVR Frame Timing Tool

The SteamVR Frame Timing Tool lets you see how your VR project is performing in both the Editor or in a packaged build. This tool will help verify the actual CPU and GPU timings, excluding any throttling done by the application. For an overview of how to open the tool as well as what all of the values relate to, refer to the Valve Developer Community page. Please note that there is nothing inside of UE that needs to be done in order for the SteamVR Frame Timing tools to work. All of the functionality is provided by the SteamVR Application.

## RenderDoc

RenderDoc is an external tool you can also use for profiling Unreal Engine projects. To use it with Unreal Engine:

- Download the latest RenderDoc.

- In RenderDoc, configure it to launch your game (e.g. UE5Editor.exe, with appropriate command line arguments).

- Run `ToggleDrawEvents` from the command line of your app to get human readable events.

- Press F12 to capture a frame.

On this page

- Oculus Performance Head-Up Display (-> vr-profiling-tools-in-unreal-engine)
- SteamVR Frame Timing Tool (-> vr-profiling-tools-in-unreal-engine)
- RenderDoc (-> vr-profiling-tools-in-unreal-engine)

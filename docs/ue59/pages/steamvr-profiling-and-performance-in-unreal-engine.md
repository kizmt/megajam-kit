# SteamVR Profiling & Performance

https://dev.epicgames.com/documentation/en-us/unreal-engine/steamvr-profiling-and-performance-in-unreal-engine?application_version=5.9

> Information profiling the performance of your Unreal Engine SteamVR projects.

On this page, you will find information about how to profile the performance of your SteamVR projects in Unreal Engine .

## SteamVR Frame Timing

The SteamVR Frame Timing tool can be used to help track down what is causing your UE project to perform poorly. Whether in the editor or packaged builds, the SteamVR Frame Timing tool can help verify the actual CPU and GPU timings while accounting for things like throttling being done by the application. For a more in-depth look at everything you can do with the SteamVR Frame Timing tool, check out the official documentation on the SteamVR Frame Timing Tool.

To display the SteamVR **Frame Timing** tool, you will need to do the following.

- Right-click on the SteamVR tools and from the displayed menu, select the **Settings** option.

- Then from the Settings menu, click on the **Display Frame Timing** button to display the Frame Timing tool.

- Once the Frame Timing tool is open, you can then launch your UE4 project and check to see what is happening in the Frame Timing tool.

## Saving SteamVR Frame Timing

You can save the information that is generated from the **Frame Timing** tool so that it can be reviewed later or sent to someone else for review. To save the SteamVR Frame Timing, you will need to do the following.

- Right-click on the SteamVR tools and from the displayed menu, select the **Settings** option.

- Then from the Settings menu, click on the **Save Frame Data Now** button to save the Frame Data.

- The Frame Timings will then be saved to a .CSV file called **VRFrames.csv** which can be found under, **C:\Program Files (x86)\Steam\logs**.

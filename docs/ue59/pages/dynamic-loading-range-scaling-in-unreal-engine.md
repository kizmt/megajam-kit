# Dynamic Loading Range Scaling

https://dev.epicgames.com/documentation/en-us/unreal-engine/dynamic-loading-range-scaling-in-unreal-engine?application_version=5.9

> Use dynamic loading range scaling to improve your Play In Editor experience on World Partition maps.

## Introduction

Iteration time on large partitioned worlds is a known pain point. **Dynamic Loading Range Scaling** reduces the time it takes for Play-In-Editor (PIE) to reach an interactive state on large World Partition maps, which results in increased iteration rate.

When enabled, World Partition starts PIE with each streaming source's initial loading range multiplied by a configurable initial factor (between 0% and 100%). This shrinks the volume of cells that must be streamed in before you can begin interacting with the map. In effect, it reduces the time from when you click PIE to when you can actually play.

After PIE begins playing, the scale ramps linearly from the initial value back up to the full map loading in over a configurable duration, after an optional delay. There is a trade-off, in that lower initial range means faster startup, but more visible pop-in as cells stream in over the scale ramp duration. The feature is editor-only, and disabled by default. It only affects PIE; it does not affect cooked or packaged builds.

## Enabling Dynamic Loading Range Scaling

You must first enable dynamic loading range scaling in any World Partition map where you want to use the feature. To enable the feature, proceed as described below:

- Open a World Partition map in the editor.
- In the menu, select **Window > World Settings**.[image: Window menu World Settings]
- In the **World Partition** category, expand **Advanced**.
- Expand **Dynamic Loading Range Scaling**, then click the **Enabled** checkbox.[image: Dynamic Loading Range Scaling settings]
- Change the default settings to appropriate values for your project. See the table below for information on the specific settings.
- Save your map.

| Setting | Description |
| --- | --- |
| **Initial Dynamic Loading Range Scaling** | Determines how much of the map is loaded in before the player can interact with the map in PIE. The default is 100% The default setting at 100% means the feature is effectively still disabled until you reduce it to something below 100%.Avoid setting the value to 0%, as it can cause your pawn to fall through geometry. |
| **Dynamic Loading Range Scaling Delay** | Determines how long to delay after starting PIE before beginning to scale up the loading range. The default is 0 seconds.Many systems compete for resources during PIE initialization, which can lead to hitches. The delay smooths out the initial performance by giving time for the other PIE startup systems to finish before starting the loading range scaling. |
| **Dynamic Loading Range Scaling Duration** | Determines the duration for the full map scale to load in after the delay ends. The default is 10 seconds. |

## Using Dynamic Loading

When using dynamic loading, the goal is to reach interaction as quickly as possible in PIE. Choose settings appropriate for the size of your map. In general, this means the larger the map, the smaller the initial scaling percentage, and the longer the delay and the scaling duration.

For example, when working with the City Sample PCG map, we found the following values effective:

- Initial Dynamic Loading Range Scaling: 1%
- Dynamic Loading Range Scaling Delay: 5 seconds.
- Dynamic Loading Range Scaling Duration: 10 seconds

You might need to try several different combinations of settings to find what works best.

### Locally Disabling Dynamic Loading Scaling

If you are working in a shared map and need to disable dynamic loading scaling temporarily, you can do so locally without affecting the shared settings for the rest of your team. Under **World Settings > World Partition > Advanced**, enable L**ocally Disable Dynamic Range Scaling**.

You can't enable this setting if you are only working locally with a map. It is only functional on a shared map.

On this page

- Introduction (-> dynamic-loading-range-scaling-in-unreal-engine)
- Enabling Dynamic Loading Range Scaling (-> dynamic-loading-range-scaling-in-unreal-engine)
- Using Dynamic Loading (-> dynamic-loading-range-scaling-in-unreal-engine)
- Locally Disabling Dynamic Loading Scaling (-> dynamic-loading-range-scaling-in-unreal-engine)

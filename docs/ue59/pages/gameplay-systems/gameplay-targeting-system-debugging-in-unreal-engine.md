# Gameplay Targeting System Debugging

https://dev.epicgames.com/documentation/en-us/unreal-engine/gameplay-targeting-system-debugging-in-unreal-engine?application_version=5.9

> A Debugging and Troubleshooting guide of the Gameplay Targeting System plugin framework in Unreal Engine.

[image: Gameplay Targeting System Debugging]

## Debugging and Troubleshooting

You can enable debugging from the Editor by pressing the tilde (~) key. See the table below for a complete list of Console Commands.

Currently debug visualizations only run on targeting requests on the client.

| Console Command | Description |
| --- | --- |
| `ts.debug.EnableTargetingDebugging false/true` | Toggles whether the targeting system is actively in debugging mode. |
| `ts.debug.PrintTargetingDebugToLog false/true` | Toggles whether to print the targeting debug text to the log. |
| `ts.debug.TotalDebugRecentRequestsTracked #` | Sets the total number of targeting requests that will be tracked upon starting. The default amount is 5. |
| `ts.debug.ClearTrackedTargetRequests` | Clears all tracked targeting handles when in debug mode. |
| `ShowDebug TargetingSystem` | Brings up the visualization of the targeting tasks when `ts.debug.EnableTargetingDebugging` is enabled. |

## Developer Reference

For an in-depth Engineering reference guide, see the Gameplay Targeting Plugin Reference (-> gameplay-targeting-system-reference-in-unreal-engine) documentation.

- blueprints
- programming

On this page

- Debugging and Troubleshooting (-> gameplay-targeting-system-debugging-in-unreal-engine)
- Developer Reference (-> gameplay-targeting-system-debugging-in-unreal-engine)

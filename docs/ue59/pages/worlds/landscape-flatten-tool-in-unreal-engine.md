# Landscape Flatten Tool

https://dev.epicgames.com/documentation/en-us/unreal-engine/landscape-flatten-tool-in-unreal-engine?application_version=5.9

> This is an overview of the Flatten painting tool.

[image: Landscape Flatten Tool]

The **Flatten** tool pushes or pulls all other parts of the heightmap to the level that is currently under the mouse when activated. This can raise or lower the surrounding
heightmap values to be the same value.

## Using the Flatten Tool

In this example, the Flatten tool is being used in the middle of the hillside to flatten out areas at the point where the mouse click was initiated. As long as the mouse button is held down, the height value
that was detected is used along any surface to raise or lower (depending on your tool settings) to that height.

[image: Flatten Tool]

Use the following controls to sculpt your Landscape heightmap:

| Controls | Operation |
| --- | --- |
| **Left Mouse Button** | Flattens or levels by both raising and lowering or individually raising and lowering the heightmap. |

 [image: Before Flattening]

 [image: After Flattening]

The brush strength determines the amount of Flattening that can happen when using the Flatten tool.

## Tool Settings

| Property | Description |
| --- | --- |
| **Flatten Target** | Sets the target height toward which to flatten. |
| **Tool Strength** | Controls how much smoothing occurs with each brush stroke. |
| **Combined Layers Operation** | When enabled, the tool uses the combined result of the selected edit layer and all layers below it to determine the flatten height. When disabled, the tool uses only the data in the selected edit layer. Changes are always applied to the selected edit layer. |
| **Flatten Mode** | Determines whether the tool will raise or lower the heightmap section under the brush.**Both**: Raises and lowers values to the current height value when the mouse click is activated.**Raise**: Raises values that are lower than the currently selected height when the mouse click is activated. Any values above this clicked point will be left unchanged.**Lower**: Lower values that are higher than the currently selected height when the mouse click is activated. Any values lower than this clicked point will be left unchanged. |
| **Use Slope Flatten** | If checked, flattens along the Landscape's existing slope instead of flattening toward a horizontal plane. |
| **Pick Value Per Apply** | If checked, constantly selects new values to flatten toward, instead of only using the first clicked point. |
| Advanced |  |
| **Show Preview Grid** | When **Flatten Target** is enabled, you can enable this option to show a preview grid for the flatten target height. |
| **Terrace Interval** | Sets the height of the Terrace interval for Terrace Flatten mode. |
| **Terrace Smoothing** | Sets the smoothing value for Terrace Flatten mode |

- landscape

On this page

- Using the Flatten Tool (-> landscape-flatten-tool-in-unreal-engine)
- Tool Settings (-> landscape-flatten-tool-in-unreal-engine)

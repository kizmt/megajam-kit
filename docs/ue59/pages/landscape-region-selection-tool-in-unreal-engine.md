# Landscape Region Selection Tool

https://dev.epicgames.com/documentation/en-us/unreal-engine/landscape-region-selection-tool-in-unreal-engine?application_version=5.9

> This is an overview of the Region Selection tool.

[image: Landscape Region Selection Tool]

The **Region Selection** tool selects specific areas of a Landscape. The tool uses the standard landscape brush settings to help select portions of the landscape actor. This selection can be used to fit a Landscape gizmo to a particular area, or to act as a mask when copying data to/pasting data from a gizmo.

## Using the Region Selection Tool

Using the Region Selection tool.

The example above demonstrates features of the Region Selection tool.

- The example shows the functioning of the default selection method, where you can paint a mask on the landscape by clicking and dragging the brush over it.
- Shift-click and drag removes landscape area from an existing selection.
- Disabling **Use Region As Mask** removes the mask effect, but does not clear the selected area.
- Disabling **Negative Mask** inverts the selection, so that the area painted by the brush is now the unmasked area.
- Clicking **Clear Region Selection** reverts all the landscape selection.
- With no selected landscape, disabling Negative Mask means the entire landscape is the mask.

Use the following controls to paint areas that can be used for selection by doing the following:

| Controls | Operation |
| --- | --- |
| **Left Mouse Button** | Adds to the selected region. |
| **Shift + Left Mouse Button** | Removes from the selected region. |

 [image: Without Selection]

 [image: With Selection]

In this example, an area has been painted for selection that can then be used for masking layers, or with the Copy/Paste tool.

## Select Mask Settings

[image: Select-mask-tool]

[image: Select-mask-options]

| Property | Description |
| --- | --- |
| **Clear Region Selection** | Clears the current selected region(s). |
| **Use Region as Mask** | When enabled, the region selection acts as a mask, where the active area is the selected region.When disabled, the region selection does not show as a mask, but is not cleared.Enabled by default. |
|  | [image: Region Selection] |
| **Negative Mask** | When enabled, and when **Use Region as Mask** is also enabled, the region selection acts as the mask's area.When disabled, the mask's area is the unselected region.Enabled by default. |
|  | [image: Region Mask Negative Selection] |

- landscape
- region

On this page

- Using the Region Selection Tool (-> landscape-region-selection-tool-in-unreal-engine)
- Select Mask Settings (-> landscape-region-selection-tool-in-unreal-engine)

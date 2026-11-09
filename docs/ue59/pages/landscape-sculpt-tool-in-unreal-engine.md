# Landscape Sculpt and Erase Tool

https://dev.epicgames.com/documentation/en-us/unreal-engine/landscape-sculpt-tool-in-unreal-engine?application_version=5.9

> This is an overview of the Landscape Sculpt and Landscape Erase painting tools.

The **Sculpt** tool gives you a way to raise and lower the height of the landscape heightmap in the shape of the currently selected brush and falloff.

## Using the Sculpt Tool

[video]

In this example, the Sculpt tool applies height values to raise or lower the height data for the landscape. Clicking and applying movement over the region you want to paint adjusts the values based on the tool settings used.

Use the following controls to sculpt your landscape heightmap:

| Controls | Operation |
| --- | --- |
| **Left Mouse Button** | Heightens or increases the heightmap data for the selected edit layer. |
| **Shift + Left Mouse Button** | Lowers or decreases the heightmap for the selected edit layer. |

### Tool Settings

| [image: Sculpt Tool] | [image: Sculpt Tool Properties] |
| --- | --- |

| Property | Description |
| --- | --- |
| **Tool Strength** | Controls how much effect each brush stroke has. If you're using a pen or tablet with pressure-sensing enabled, this affects the strength of the tool. |
| **Use Target Value** | Enables a target value that the tools blend toward with each brush stroke. |

The brush strength determines how much raising or lowering happens when you use the Sculpting tool.

## Using the Erase Tool

The **Erase** tool removes height data from the active landscape edit layer, restoring the heightmap data. It’s used to selectively clear sculpting changes, making it easy to refine terrain.

| Controls | Operation |
| --- | --- |
| **Left Mouse Button** | Removes height data from the selected edit layer’s heightmap. |

|  |  |
| --- | --- |

| Property | Description |
| --- | --- |
| **Tool Strength** | Controls how much effect each erase stroke has. If you're using a pen or tablet with pressure-sensing enabled, this affects the strength of the tool. |

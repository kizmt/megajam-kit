# Landscape Sculpt Mode

https://dev.epicgames.com/documentation/en-us/unreal-engine/landscape-sculpt-mode-in-unreal-engine?application_version=5.9

> Guide to the Landscape tool's Sculpt mode.

[image: Landscape Sculpt Mode]

The **Landscape Sculpt Mode** provides direct control over the shape of the landscape terrain. Using a variety of brush types and configurations, you can raise, lower, smooth, flatten or otherwise modify the landscape’s heightmap data in real time. This mode offers hands-on sculpting for shaping hills, valleys, cliffs, and other terrain features directly in the viewport.

Sculpt mode operates on the currently-active **Edit Layer**, making every change non-destructive and reversible. Combined with procedural systems such as **Blueprint Brushes** and **Landscape Splines**, it provides for hybrid workflows that mix hand-sculpted terrain with procedural features.

[image: Tools available in Landscape Sculpt Mode]

## Tool Workflow

Once you've created your Landscape (-> creating-landscapes-in-unreal-engine), you have access to the other features of the Landscape tool. To use sculpting, select the **Sculpt** mode tab.

When you select Sculpt mode, the **Sculpt tool options** become available for choosing the type of sculpting tool along with the brush style and falloff type (-> landscape-brushes-in-unreal-engine) you want to use to apply their effects to your landscape heightmap using strokes.

[image: Brush-type-and-falloff-menu]

With your Sculpting tool selected, you can now use the following controls to start sculpting your landscape:

| Common Controls | Operation |
| --- | --- |
| **Left Mouse Button** | Performs a stroke that applies an additive application of the selected tool's effects to the heightmap and raises the terrain. |
| **Left Mouse Button + Shift** | Performs a stroke that applies a subtractive application of the selected tool's effects to the heightmap and lowers the terrain. |
| **Ctrl + Z** | Undo last stroke. |
| **Ctrl + Y** | Redo last undone stroke. |

## Sculpting Tools

Use the **Sculpting Tools** to modify the shape of your Landscape in various ways. Explore the different sculpting selections available below:

- Sculpt (-> landscape-sculpt-mode-in-unreal-engine)
- Smooth (-> landscape-smooth-tool-in-unreal-engine)
- Flatten (-> landscape-flatten-tool-in-unreal-engine)
- Ramp (-> landscape-ramp-tool-in-unreal-engine)
- Erosion (-> landscape-erosion-tool-in-unreal-engine)
- Hydro (-> landscape-hydroerosion-tool-in-unreal-engine)
- Noise (-> landscape-noise-tool-in-unreal-engine)
- Visibility (-> landscape-visibility-tool-in-unreal-engine)
- Mirror (-> landscape-mirror-tool-in-unreal-engine)
- Region Select (-> landscape-region-selection-tool-in-unreal-engine)
- Copy (-> landscape-copy-tool-in-unreal-engine)

- landscape

On this page

- Tool Workflow (-> landscape-sculpt-mode-in-unreal-engine)
- Sculpting Tools (-> landscape-sculpt-mode-in-unreal-engine)

Related documents

Landscape Brushes

 [image: Landscape Brushes] (-> landscape-brushes-in-unreal-engine)

# Material Analyzer

https://dev.epicgames.com/documentation/en-us/unreal-engine/unreal-engine-material-analyzer-tool?application_version=5.9

> This page describes how to locate and use the Material Analyzer tool.

[image: Material Analyzer]

The **Material Analyzer** is a developer tool that helps you identify and analyze all Materials, or Material instances (-> instanced-materials-in-unreal-engine), in your project. This enables you to make changes that can provide savings in shader permutations and data storage. When you select a Material or Material instance to analyze, the tool will find all descendants of that Material (or all descendants of the Material instance's parent Material). The tool also identifies all of the base property overrides, static switches, and static component mask parameters.

## Opening the Material Analyzer

- In the menu bar, click **Tools > Audit > Material Analyzer**. The **Material Analyzer** window opens. [image: Material Analyzer menu path]

- Click the dropdown menu next to **Material to Analyze**. Use the list or search bar to select the Material or Material instance you want to analyze. [image: Select Material to analyze]

- The Material Analyzer tool displays a list of all instances of the Material you selected.

## Viewing the Suggestion List

Below the Material instance hierarchy is a suggestion list. The suggestion list groups all Material instances with the same set of static overrides. You can click the arrow next to each line to see the specific instances identified.

 [image: Suggestion list]

## Create a Local Collection

Each suggestion list has a **Create Local Collection** button. Click this button to place all the related instances into a local collection, so you can easily find them and update them to have more efficient parameter setups.

 [image: Create local collection]

## Viewing the Static Switch Parameters List

To see the static switch parameters for a Material instance, click the arrow next to the Static Switch Parameters column to display the full list. The columns are resizable, so you can move them if the text is cut off.

 [image: Static switch parameters]

## Reparenting Material Instances

You can reparent these Material instances to a new instance that has those same static overrides, so that the reparented Material instances only change their unique overrides. This can provide a savings in shader permutations and data storage. Make sure to remove all the static parameter overrides from the Material instances you have reparented, or else the additional data is still stored.

- materials
- shaders

On this page

- Opening the Material Analyzer (-> unreal-engine-material-analyzer-tool)
- Viewing the Suggestion List (-> unreal-engine-material-analyzer-tool)
- Create a Local Collection (-> unreal-engine-material-analyzer-tool)
- Viewing the Static Switch Parameters List (-> unreal-engine-material-analyzer-tool)
- Reparenting Material Instances (-> unreal-engine-material-analyzer-tool)

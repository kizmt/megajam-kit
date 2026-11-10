# Scripting and Automating the Unreal Editor

https://dev.epicgames.com/documentation/en-us/unreal-engine/scripting-and-automating-the-unreal-editor?application_version=5.9

> Introduction to using Blueprints and Python to control the Unreal Editor programmatically.

[image: Scripting and Automating the Unreal Editor]

In the Unreal Editor user interface, you have access to a vast range of visual tools for setting up your Project, designing and building Levels, creating gameplay interactions, and more. But sometimes, once you've figured out what you need the Editor to do, you might want to invoke its tools and commands programmatically — either in a reusable script, or by constructing your own interfaces to drive the Editor.

This can help you:

- Minimize or eliminate the need to repeat the same series of tasks over and over,
- Automate or randomize the placement, layout and settings of Actors in your Levels,
- Create your own Asset import and management pipelines,
- Interoperate with other third-party applications and pipeline scripts,
- Extend the Editor with additional tools, and even UIs, that you customize specifically for the needs of your Project or content.

The pages in this section show how you can run these kinds of in-Editor scripts using Blueprints (-> scripting-the-unreal-editor-using-blueprints), Python, and remote control ol (-> remote-control-for-unreal-engine).

## Installing the Editor Scripting Utilities Plugin

If you're planning to do any Editor automation, regardless of the language or system you plan to use, you will almost certainly want to install the **Editor Scripting Utilities** plugin. This plugin simplifies many of the most common operations you'll need to do in the Editor, handling uncommon edge cases so that you don't have to understand all the internal details of how the Editor works in order to do something conceptually simple.

To install the plug-in:

- From the main menu, choose **Edit > Plugins** to open the **Plugins** window.[image: Open Plugins window]
- Under the **Scripting** category, find the entry for the **Editor Scripting Utilities** and check its **Enabled** box.[image: Enable the Editor Scripting Utilities plugin]
- If you're interested in using Python, you can also check the **Enabled** box for the Python plugin while you're here. For more, see Scripting the Unreal Editor Using Python (-> scripting-the-unreal-editor-using-python).
- Restart the Editor and reload your Project.

- blueprints
- python
- programming
- scripting

On this page

- Installing the Editor Scripting Utilities Plugin (-> scripting-and-automating-the-unreal-editor)

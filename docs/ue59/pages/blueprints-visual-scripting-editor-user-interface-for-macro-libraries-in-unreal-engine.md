# Blueprint Editor Macro Library UI

https://dev.epicgames.com/documentation/en-us/unreal-engine/blueprints-visual-scripting-editor-user-interface-for-macro-libraries-in-unreal-engine?application_version=5.9

> A breakdown of the UI elements of the Blueprint Editor when working on Blueprint Macro Libraries.

[image: Blueprint Editor Macro Library UI]

A **Blueprint Macro Library** is a container that holds a collection of **Macros** or self-contained graphs that can
be placed as nodes in other Blueprints. These can be time-savers as they can store commonly used sequences of nodes
complete with inputs and outputs for both execution and data transfer.

Macros are shared among all graphs that reference them, but they are auto-expanded into graphs as if they were a
collapsed node during compiling. This means that Blueprint Macro Libraries do not need to be compiled. However, changes
to a Macro are only reflected in graphs that reference that Macro when the Blueprint containing those graphs is
recompiled.

For more information on Macro Libraries and how to use them, please see the Blueprint Macro Library (-> blueprint-macro-library-in-unreal-engine) documentation.

## Interface

Much like with Blueprint Interfaces, when you first open the Blueprint Editor for a Macro Library, you will see a simplified UI without a graph:

| Default Visible UI Components | Available in the Window Menu |
| --- | --- |
| Menu (-> menu-for-the-blueprints-visual-scripting-editor-in-unreal-engine) Toolbar (-> toolbar-in-the-blueprints-visual-scripting-editor-for-unreal-engine) My Blueprint (-> my-blueprint-panel-in-the-blueprints-visual-scripting-editor-for-unreal-engine) Details (-> details-panel-in-the-blueprints-visual-scriting-editor-for-unreal-engine) Graph Editor (-> graph-editor-for-the-blueprints-visual-scripting-editor-in-unreal-engine) | Debug (-> debug-panel-in-the-blueprints-visual-scripting-editor-for-unreal-engine) Find Results (-> find-result-panel-in-the-blueprints-visual-scripting-editor-for-unreal-engine) Palette (-> palette-in-the-bleprints-visual-scripting-editor-for-unreal-engine) |

- blueprints

On this page

- Interface (-> blueprints-visual-scripting-editor-user-interface-for-macro-libraries-in-unreal-engine)

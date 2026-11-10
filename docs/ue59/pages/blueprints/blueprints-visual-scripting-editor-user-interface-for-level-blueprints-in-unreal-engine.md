# Blueprint Editor Level Blueprint UI

https://dev.epicgames.com/documentation/en-us/unreal-engine/blueprints-visual-scripting-editor-user-interface-for-level-blueprints-in-unreal-engine?application_version=5.9

> A breakdown of the UI elements of the Blueprint Editor when working on Level Blueprints.

[image: Blueprint Editor Level Blueprint UI]

A **Level Blueprint** is a specialized type of **Blueprint** that acts as a level-wide global event graph.
Each level in your project has its own Level Blueprint created by default that can be edited within the Unreal Editor, however new Level Blueprints
cannot be created through the editor interface.

Events pertaining to the level as a whole, or specific instances of Actors within the level, are
used to fire off sequences of actions in the form of Function Calls or Flow Control operations.
Those familiar with Unreal Engine 3 should be very familiar with this concept as this is very similar
to how Kismet worked in Unreal Engine 3.

Level Blueprints also provide a control mechanism for level streaming and Sequencer (-> real-time-compositing-with-sequencer-in-unreal-engine) as well
as for binding events to Actors placed within the level.

## Interface

The Blueprint Editor contains the following sections when editing Level Blueprints:

| Default Visible UI Components | Available in the Window Menu |
| --- | --- |
| Menu (-> menu-for-the-blueprints-visual-scripting-editor-in-unreal-engine) Toolbar (-> toolbar-in-the-blueprints-visual-scripting-editor-for-unreal-engine) My Blueprint (-> my-blueprint-panel-in-the-blueprints-visual-scripting-editor-for-unreal-engine) Details (-> details-panel-in-the-blueprints-visual-scriting-editor-for-unreal-engine) Graph Editor (-> graph-editor-for-the-blueprints-visual-scripting-editor-in-unreal-engine) | Compiler Results (-> compiler-results-in-the-blueprints-visual-scripting-editor-for-unreal-engine) Debug (-> debug-panel-in-the-blueprints-visual-scripting-editor-for-unreal-engine) Find Results (-> find-result-panel-in-the-blueprints-visual-scripting-editor-for-unreal-engine) Palette (-> palette-in-the-bleprints-visual-scripting-editor-for-unreal-engine) Viewport (-> components-mode-viewport-in-the-blueprints-visual-scripting-editor-for-unreal-engine) |

- blueprints

On this page

- Interface (-> blueprints-visual-scripting-editor-user-interface-for-level-blueprints-in-unreal-engine)

# Blueprint Editor Blueprint Interface UI

https://dev.epicgames.com/documentation/en-us/unreal-engine/blueprints-visual-scripting-editor-user-interface-for-blueprint-interfaces-in-unreal-engine?application_version=5.9

> A breakdown of the UI elements of the Blueprint Editor when working on Blueprint Interfaces.

[image: Blueprint Editor Blueprint Interface UI]

A **Blueprint Interface** is a collection of one or more functions - name only, no implementation - that can be added to
other Blueprints. Any Blueprint that has the Interface added is guaranteed to have those functions. The functions
of the Interface can be given functionality in each of the Blueprints that added it. This is essentially like the
concept of an interface in general programming, which allows multiple different types of Objects to all share and be accessed
through a common interface. Put simply, Blueprint Interfaces allow different Blueprints to share with and send data to one another.

Blueprint Interfaces can be made by content creators through the editor in a similar fashion to other Blueprints, but they
come with certain limitations in that they cannot:

- Add new variables

- Edit graphs

- Add Components

## Blueprint Interface Editor UI

When you first open a Blueprint Interface (-> blueprint-interface-in-unreal-engine), the UI will look extremely simple, consisting only of the following:

| Default Visible UI Components | Available in the Window Menu |
| --- | --- |
| Menu (-> menu-for-the-blueprints-visual-scripting-editor-in-unreal-engine) Toolbar (-> toolbar-in-the-blueprints-visual-scripting-editor-for-unreal-engine) My Blueprint (-> my-blueprint-panel-in-the-blueprints-visual-scripting-editor-for-unreal-engine) Details (-> details-panel-in-the-blueprints-visual-scriting-editor-for-unreal-engine) Graph Editor (-> graph-editor-for-the-blueprints-visual-scripting-editor-in-unreal-engine) | Debug (-> debug-panel-in-the-blueprints-visual-scripting-editor-for-unreal-engine) Compiler Results (-> compiler-results-in-the-blueprints-visual-scripting-editor-for-unreal-engine) Find Results (-> find-result-panel-in-the-blueprints-visual-scripting-editor-for-unreal-engine) |

## Usage Notes

It is important to note that the Graph View in this case is a bit different than the Graph Editor usually available within the Blueprint Editor. You might notice that it is grayed out and that you can neither navigate it nor can you add any nodes to it. That is because this is more of a visualization tool than it is a way to edit the graph. Keep in mind that an Interface holds no functionality in and of itself, so there is no need to create an actual functioning network in this case. Think of this view as just a preview of what your inputs and outputs will be.

For more information on creating and working with Blueprint interfaces, please see Blueprint Interface (-> blueprint-interface-in-unreal-engine).

- blueprints

On this page

- Blueprint Interface Editor UI (-> blueprints-visual-scripting-editor-user-interface-for-blueprint-interfaces-in-unreal-engine)
- Usage Notes (-> blueprints-visual-scripting-editor-user-interface-for-blueprint-interfaces-in-unreal-engine)

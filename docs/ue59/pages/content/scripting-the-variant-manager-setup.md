# Scripting the Variant Manager Setup

https://dev.epicgames.com/documentation/en-us/unreal-engine/scripting-the-variant-manager-setup?application_version=5.9

> Use Editor Scripting to set up the Variant Manager with all your scene variants.

[image: Scripting the Variant Manager Setup]

Programming Language

×Blueprint

Select an option from the dropdown to see content relevant to it.

If you've read through the Variant Manager Overview (-> variant-manager-template-overview), you've seen that the Variant Manager offers a Blueprint API that you can use at runtime to access information about the variant sets and variants that it contains, and to switch variants on dynamically. However, the Variant Manager also exposes a separate API that is only available to scripts that run in the Editor. You can use this Editor-only API to create new Level Variant Sets Assets and Actors, and to set them up with your scene variants programmatically.

This may be particularly useful if you need to set up scene variants in your Unreal Engine Project automatically to reflect variants or settings that you've already authored in another application. If you can export the data about those scene variants into a format that the Unreal Editor scripting systems can read, you may be able to use the methods described on this page to set up the same scene variants in Unreal Engine. This saves you the time and effort of rebuilding the same variants by hand in the Variant Manager UI. It may also be less error-prone, and more repeatable.

You can use either Blueprints or Python to script the setup of your Variant Manager.

The most important nodes involved in setting up your scene variants are under the **Variant Manager** category in the Blueprint palette. The nodes in this category let you create new **Level Variant Sets** Assets, add Variant Sets and Variants to that Asset, bind Actors to Variants, and capture property values for those Actors.

You can't currently use the Editor scripting API to set up a bound Actor with a **Function Caller** as described in Calling Functions on Variant Activation (-> calling-functions-on-variant-activation). You can only use the scripting API to capture and set property values on bound Actors.

The following table describes some of the nodes you might use most frequently:

| Blueprint Name | Description |
| --- | --- |
| **Create Level Variant Sets Asset** | Creates a new, empty **Level Variant Sets** Asset in the Content Browser, with the specified name and path.Always make sure your path begins with `/Game/` to save your new asset in your project's content folder. |
| **Add Variant Set** | Adds the specified Variant Set to the Level Variant Sets Asset. This is the equivalent to clicking the **+ Variant Set** button in the Variant Manager UI. See the tip below for instructions on how to create a new Variant Set from scratch. |
| **Add Actor Binding** | Adds the specified Actor to the specified Variant. This is the equivalent of dragging the Actor from the **World Outliner** and dropping it on to the Variant in the Variant Manager UI. |
| **Get Capturable Properties** | Returns the names of all the properties that the Variant Manager can control for the specified Actor. You can use any of these values when you call the **Capture Property** node. |
| **Capture Property** | Saves the value of the property you specify for an Actor in the specified Variant. |
| **Add Variant** | Adds the specified Variant as a child of the specified Variant Set. |

If you need to create a new Variant Set to add to a Level Variant Sets Asset, or create a new Variant to add to a Variant Set, use you can use the **Construct Object from Class** node. In the first input, specify the **VariantSet** or **Variant** class, depending on which one you need to create. In the second **Outer** input, always use the Level Variant Sets Asset that you're setting up. Finally, pass the output value to your **Add** node.

For example, this snippet creates a new Variant Set and adds it to the Asset, then creates a new Variant and adds it to that new Variant Set:

 Blueprint

 context_graph

[INCLUDE:working-with-content/working-with-scene-variants-in-unreal-engine/Scripting/blueprint-graph-tip#BlueprintTipExample]

### Blueprint Example

The following graph from an Editor Utility Widget shows how to set up the Variant Manager programmatically. First it creates a new Actor to work with. Then, it creates a new Level Variant Sets Asset, and sets it up with a new Variant Set. Finally, it adds two Variants to that Variant Set: one where the Actor is visible, and another where the Actor is hidden.

 Blueprint

 context_graph

[INCLUDE:working-with-content/working-with-scene-variants-in-unreal-engine/Scripting/blueprint-graph-example#BlueprintExample]

After you run this example, you'll see a new cube created at the origin point of the Level. You'll also have a new Level Variant Sets Asset that lets you show and hide that cube by switching its Variants.

- datasmith
- enterprise
- manufacturing
- variants

On this page

- Blueprint Example (-> scripting-the-variant-manager-setup)

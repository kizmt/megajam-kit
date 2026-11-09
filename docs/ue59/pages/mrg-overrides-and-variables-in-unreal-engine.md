# MRG Overrides and Variables

https://dev.epicgames.com/documentation/en-us/unreal-engine/mrg-overrides-and-variables-in-unreal-engine?application_version=5.9

> Learn how parameters are set and how you can override them at different levels.

[image: MRG Overrides and Variables]

## Settings Override

Each node has its own set of applicable parameters.

 [image: ImageAltText]

To change or override the default settings just enable the checkbox and update the new desired values. Keeping in line with how the rest of the engine works, overridden parameters have a return arrow next to them that resets the parameter back to the class-default.

 [image: ImageAltText]

Full nodes can easily be overwritten and redeclared in the render graph. Remember how the evaluation of the graph flows back from the Output to the Input , or right to left. This means that whole nodes can be redeclared further down the graph.

In this simple example, we have the default Warm Up settings node. If we evaluate the graph we can see its end effect.

 [image: ImageAltText]

Now if we add a second Warmup Settings node downstream and set some different values we see that those have been fully redeclared in the Graph Evaluation debug.

 [image: ImageAltText]

This also works "per chain".

This works with Subgraphs as well. In this example the default Warm Up node is in the subgraph. When we evaluate the graph we see that the parent graph is inheriting the warm up settings from the subgraph.

 [image: ImageAltText]

But we can override that down stream.

 [image: ImageAltText]

You can even re-declare collection membership per chain.

 [image: ImageAltText]

You can also create new collections, change the renderer and re-declare modifiers making this notion of graph flow evaluation incredibly editable and flexible.

 [image: ImageAltText]

## Exposing Parameters and Variables

Right clicking over a node will show you what is available to expose as a variable.

 [image: ImageAltText]

When a property is selected its pin is exposed.

 [image: ImageAltText]

If you hover over the pin it will tell you the data type.

 [image: ImageAltText]

You can create your own variable by hitting the plus icon under the Variables sections in the Members tab. Then set the name of the variable as well as the type and default value.

 [image: ImageAltText]

Then just drag the variable into the graph and connect it to the applicable pin.

 [image: ImageAltText]

Alternatively you can Right Mouse Click over the desired pin and select Promote to Variable.

 [image: ImageAltText]

A variable of the correct data type will be created and connected for you. You can then edit the name and the default values in the details panel.

 [image: ImageAltText]

Once you have an exposed variable these parameters can now be set on the job level in Movie Render Queue if desired when the graph is assigned.

 [image: ImageAltText]

Just like with the graph nodes to override the parameter on the MRQ job level just enable the checkbox and set the desired parameter setting.

 [image: ImageAltText]

- sequencer
- movie render queue
- render

On this page

- Settings Override (-> mrg-overrides-and-variables-in-unreal-engine)
- Exposing Parameters and Variables (-> mrg-overrides-and-variables-in-unreal-engine)

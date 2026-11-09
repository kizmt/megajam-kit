# From Material Expression

https://dev.epicgames.com/documentation/en-us/unreal-engine/from-material-expression-shading-model-in-unreal-engine?application_version=5.9

> Using the From Material Expression Shading Model to combine multiple shading models in a single Material.

[image: From Material Expression]

The **From Material Expression** Shading Model is an advanced feature enabling you to combine multiple Shading Models within a single Material (or Material Instance) through logic in the Material Graph.

 [image: From Material Expression]

When the **From Material Expression** Shading Model is enabled, you can blend between Shading Models on a per-pixel basis using alpha masks, or with conditional logic like **Switch Expressions** and **If** statements.

## Usage

To use multiple Shading Models in a single Material, you must first set the Shading Model property to **From Material Expression** in the Details panel.

- Click anywhere in the background of the Material Graph, or select the Main Material Node (-> using-the-main-material-node-in-unreal-engine) to display the Material Properties in the Details panel.

- In the **Details Panel**, use the **Shading Model** drop-down menu to select **From Material Expression.** When From Material Expression is selected, the **Shading Model** pin on the Main Material Node changes to white, indicating that it is enabled. [image: Shading Model From Material Expression]

- **Right-click** in the Material Graph and search for "Shading Model" in the context menu. Add a **Shading Model** Material Expression to your graph. [image: Shading Model Material Expression]

- Select the **Shading Model** node in the graph. In the Details Panel, use the drop-down menu to choose the Shading Model you want to use. [image: Select Shading Model in node]

- Connect the **Shading Model** node to the **Shading Model** input pin on the Main Material Node. This Material is now using the **Clear Coat** Shading Model, as derived from the **Shading Model Material Expression**. [image: Connect Shading Model node to input]

The primary benefit of this workflow is that you can blend between multiple Shading Models within a single Material. Read the sections below for usage examples.

### Used Shading Models in the Material

When multiple Shading Models are used in your Material Graph, they are convienently listed next to **Used Shading Models** in the **Details** panel properties.

 [image: Used Shading Models]

This example shows a Material that is using both the Default Lit and Clear Coat Shading Models.

Keep in mind that this list only shows Shading Models set in the Material Graph and does not always represent what is actually compiled. **Switch** nodes can be used to remove entire parts of the graph, including Shading Models. For examples of this, see the Material Switch Nodes (-> from-material-expression-shading-model-in-unreal-engine) section below.

## Blending Multiple Shading Models

The following sections provide three different ways to blend between Shading Models in a Material.

### Blending Material Attributes

The most straightforward way to create a per-pixel blend between two different Shading Models is to use a **Set Material Attributes** expression to define each surface, and then blend them using the **BlendMaterialAttriutes** node.

This example assumes some knowledge of how to use the **Material Attributes** workflow to define the physical attributes of a Material. If you are unfamilar with this process, read the documentation on Material Attributes Expressions (-> material-attributes-expressions-in-unreal-engine).

In the example below, a checkerboard texture is plugged into the **Alpha** input on the **BlendMaterialAttriubtes** node to mask between the **Default Lit** and **Clear Coat** Shading Models in each set of Material Attributes.

Click image for full size.

#### Material Setup

Use the following steps to create a Material like the one above.

- In the Details Panel, set the **Shading Model** to **From Material Expression**. In the same section, enable the **Use Material Attributes** option. When this option is checked, the Main Material Node disappears and is replaced by a **Material Attributes** output node. [image: Material Properties settings]

- Use the **SetMaterialAttributes** Expression to define each of the two surface types. Select the **SetMaterialAttributes** node in the Material Graph, and click the **Add Element** icon in the Details panel. Add a **Shading Model** input pin to both SetMaterialAttributes nodes in your graph. After you define both Materials, add a **BlendMaterialAttributes** node to blend between the two sets of attributes. Connect the **BlendMaterialAttributes** expression to the **Material Attributes** output node. This process is shown in the video below.

The full Material Graph used in this example is pictured below. The carbon fiber normal map texture used in the **Clear Coat** part of the graph is available for download on the Clear Coat with Dual Normals (-> using-dual-normals-with-clear-coat-in-unreal-engine) page.

Click image for full size.

When the Material is applied to a Static Mesh, it uses only a single draw call to render both shading models instead of two draw calls. With the Alpha mask applied, you can clearly see the two Shading Models mapped to different regions on the sphere.

### If-Statements

You can also use an **If** Material Expression to blend between Shading Models within the same set of Material Attributes. The **If** expression compares the float values in the **A and B** inputs, and outputs a different results based on whether the value in A is greater than, equal to, or less than B. In the example below, this logic is used to select between the two Shading Models in the graph.

 [image: Per-pixel blend with If expression]

If no value is set for **B**, it defaults to a value of **0**. You can set a hardcoded value in the **Details** panel, use another float vlaue derived from a texture, constant, or Scalar parameter for the **B** input to control it within a Material Instance. This example uses a Constant value of 0.5 for the **B** value.

In the comparison below, the If expression evaluates the value of **B** against **A** to set the shading model to either **Default Lit** or **Clear Coat**. If the float value of **A** is greater than that of **B**, **Default Lit** is used, if **A** is less than **B**, **Clear Coat** is used.

 [image: A > B: Uses Default Lit | B = 0.0]

 [image: A <= B: Uses Clear Coat | B = 0.5]

### Switch Nodes

Use the available **Switch** nodes below to control functionality and quality of your Material.

- A **Shading Path Switch** is useful for specifying what part of your material logic should be used for a render path.

- A **Quality Switch** is useful when using the engine's quality levels to control material logic.

- A **Feature Level Switch** is useful when setting up a material for use on different devices.

- A **Static Switch** or **Static Switch Parameter** is useful to exclude entire branches of your material in a base material or controllable through a Material Instance.

In the graph and comparison below, a **Static Switch** expression sets the shading model to **Default Lit** when set to `True` and **Clear Coat** when set to `False`.

Click image for full size.

 [image: Static Switch = True | Default Lit Shading Model]

 [image: Static Switch = False | Clear Coat Shading Model]

### Material Instancing

Material Instancing is fully supported enabling you to setup and use logic in your Material Graph to drive parameters and variables to set which shading model(s) is used.

Keep in mind that the Material Instance's shading model is shown as **From Material Expression** and it can be overridden to a static shading model. However, you cannot override a Material Instance's shading model to be **From Material Expression.** It will silently fail and do nothing.

## Additional Information

- **Shading Model Input Always Shown Enabled** When **Use Material Attributes** is enabled and using the Set, Get, Make, or Break Material Attributes nodes, the **Shading Model** input will always be shown enabled (not grayed out) even though **From Material Expression** may not be set as the selected shading model. The pin will not do anything unless **From Material Expression** is set as the shading model for the Material. This does not affect the Main Material Inputs node that is default.

- **Material Instance Overrides** Overriding the **Shading Model** of a Material Instance works as expected, however, setting it to **From Material Expression** will silently fail and do nothing unless the Parent Material uses it.

- **Unlit Shading Model** There is a lot of information that is compiled out, which means means that shading path cannot be properly supported without introducing regressions.

- materials
- shading models

On this page

- Usage (-> from-material-expression-shading-model-in-unreal-engine)
- Used Shading Models in the Material (-> from-material-expression-shading-model-in-unreal-engine)
- Blending Multiple Shading Models (-> from-material-expression-shading-model-in-unreal-engine)
- Blending Material Attributes (-> from-material-expression-shading-model-in-unreal-engine)
- Material Setup (-> from-material-expression-shading-model-in-unreal-engine)
- If-Statements (-> from-material-expression-shading-model-in-unreal-engine)
- Switch Nodes (-> from-material-expression-shading-model-in-unreal-engine)
- Material Instancing (-> from-material-expression-shading-model-in-unreal-engine)
- Additional Information (-> from-material-expression-shading-model-in-unreal-engine)

Related documents

Shading Models

 [image: Shading Models] (-> shading-models-in-unreal-engine)

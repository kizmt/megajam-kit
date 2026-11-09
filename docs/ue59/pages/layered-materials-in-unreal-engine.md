# Layered Materials Overview

https://dev.epicgames.com/documentation/en-us/unreal-engine/layered-materials-in-unreal-engine?application_version=5.9

> An introductory document on using Material Functions to create complex layered Materials.

[image: Layered Materials Overview]

This document is an overview of the original Layered Materials workflow, which uses Material Functions to create complex layer blends. For information about the newer **Material Layers** feature in the Material Instance Editor, read here (-> using-material-layers-in-unreal-engine).

**Layered Materials** provide a means to create a single Material that has a series of sub-Materials (or layers) that you can place across the surface of your objects using per-pixel operations such as masks. They are perfect for handling complex blending between unique surface types. In the image of the rockets below, the rocket on the far right is using a separate layer for the chrome, aluminum, and copper parts of the rocket. These are blended across the Material on a per-pixel basis.

 [image: Layered Materials example]

As a feature, Layered Materials exist as an extension of Material Functions (-> unreal-engine-material-functions-overview). Material Functions are self-contained node networks that perform a specific operation, such as a complex math equation. You can then reuse these functions at will in any number of Materials. Using the **Make Material Attributes (-> material-attributes-expressions-in-unreal-engine)** and **Break Material Attributes** nodes, you can define a full set of Material attributes entirely within a Material Function. You can then call these Material Functions in a base Material, and blend between them using Material Layer Blend Functions.

 [image: Chrome Material layer function]

The image above shows a simple chrome Material defined entirely within a Material Function using the **Make Material Attributes** node. You can use this function as a layer in your base Material, and blend it with other Material Functions (layers).

It is important to realize that since Material Functions cannot be applied directly to a surface, you need to insert each Material Function layer into a standard base Material, which you can then apply to static meshes. You can use Material Functions to create as many layers as you wish, blending them together however you see fit.

At a high level, the workflow looks like this:

- Create a new Material Function and edit the node graph to perfection. This function will act as a layer when you call it in your base Material.

- Connect your node network to a new **Make Material Attributes** node, and connect it to the Function output.

- Save the Material Function.

- Repeat this process for any other Material Function layers you wish to create.

- Create a new Material and open it in the Material Editor.

- Drag your Material Functions from the Content Browser into the new Material to use as layers.

- Blend multiple Material Functions together using the **Material Layer Blend** functions.

Your final object can now have multiple distinct Materials blended across its surface.

## Key Benefits

Layered Materials allow you to create what would otherwise be a very complicated Material, and keep it much more manageable from a future editability standpoint.

For instance, it is possible to create the effect of layered Materials using a conventional Material graph (without layers or functions). However, this would require complex networks to blend between different textures and values for each Material input (-> material-inputs-in-unreal-engine). Since most Materials make use of multiple inputs, the complexity of such a Material would increase significantly.

 [image: Rocket image with layers]

Consider the complexity of the network below, which uses no Material layers and blends a chrome and copper effect, as seen on the rocket above.

**A traditional Material graph without layers.**

Click image to enlarge.

With a layered Material, each distinct Material type is contained within its own node. This makes blending much simpler and far easier for an artist to edit and debug. By using the **Make Material Attributes** and **Break Material Attributes** nodes, you can connect each of the Material Function layers directly without having to worry about wiring up individual properties.

The network below achieves the same result as the one above, but the chrome and copper Materials are modularized into their own Material Functions.

**This is the same Material using Material Functions as layers. **

Click image to enlarge.

Another benefit of a layered Material approach is that since they utilize Material Functions, each layer is reusable. This allows you to set up a library of Material archetypes, or Materials that define a basic real-world surface type. For example, you can create layers that represent generic surfaces such as aluminum, steel, leather, plastic, rubber, and so on. You can then use a layered Material to blend between them. This is very useful when wanting to create a detailed object, such as a character, without having to create a massive set of Materials to apply separately to the surface.

 [image: Character with layered Materials]

## Blend Types

Within the Material Functions list in the Material Editor palette is a list of various **Material Layer Blend** functions. These exist to help you blend Materials without needing to recreate complex node-graphs every time. Different types allow for specialized types of blends, such as with the ability to override specific Material features.

 [image: Material Layer Blend Functions in the palette]

| Material Layer Blend Functions |  |
| --- | --- |
| **MatLayerBlend_AO** | Blends an ambient occlusion (AO) map over the surface to remove reflection. |
| **MatLayerBlend_BaseColorOverride** | Allows the Base Color to be replaced. |
| **MatLayerBlend_BreakBaseColor** | Outputs the Base Color from an incoming Material Layer. |
| **MatLayerBlend_BreakNormal** | Outputs the Normal from an incoming Material Layer. |
| **MatLayerBlend_Decal** | Blends a decal sheet over the Material using the 2nd UV channel. |
| **MatLayerBlend_Decal_UV3** | Blends a decal sheet over the Material Layer using the 3rd UV channel. |
| **MatLayerBlend_Emissive** | Blends an Emissive texture over the Material Layer. |
| **MatLayerBlend_GlobalNormal** | Blends a Normal texture over the Material Layer. |
| **MatLayerBlend_LightmassReplace** | Replaces the Base Color in Lightmass, allowing for changes to indirect lighting results. |
| **MatLayerBlend_ModulateRoughness** | Multiplies the Material Layer's Roughness by an incoming texture. Useful for a "greasy" look. |
| **MatLayerBlend_NormalBlend** | Blends a Normal texture across the surface, but by way of a mask texture, allowing for control of where the normal will appear. |
| **MatLayerBlend_NormalFlatten** | Diminishes the effect of the Normal map. |
| **MatLayerBlend_RoughnessOverride** | Replaces the Roughness texture of a Material Layer. |
| **MatLayerBlend_Simple** | Provides a simple linear interpolation (Lerp) blending solution for 2 Material Layers. Does not blend Normal; instead, retains Normal of the Base Material. |
| **MatLayerBlend_Stain** | Blends the Top Material over the Base Material as a stain, meaning that only the Base Color and Roughness values from the Top Material are used. |
| **MatLayerBlend_Standard** | Blends all attributes of two Material Layers. |
| **MatLayerBlend_Tint** | Allows for tinting of a Material Layer by inputting a tint color and a mask to control the tint's location. Useful for making partial color changes. |
| **MatLayerBlend_TintAllChannels** | Similar to Tint, but also affects Specular. This is a very special case function; generally, you will not need it. |
| **MatLayerBlend_TopNormal** | Blends all attributes of both Materials but only uses the Normal of the Top Material. |

## Instancing Layered Materials

Because Layered Materials are essentially Material Functions, parameterizing them for instancing requires some extra forethought. To make better use of **Scalar** and **Vector Parameters**, you can create a **Function Input** expression as part of a Material Layer. You can then connect a parameter into this input from the top-level Material. See the Material Functions overview (-> unreal-engine-material-functions-overview) for more information.

The flow works something like this:

- Material Parameter (Scalar Parameter, Vector Parameter, etc.)

- Material Layer (Function)

- Function Input expression

- Some network to define the Material Layer

- Function Output

- Final Material

**Some helpful tips:**

- When pasting your Material Expressions into a function to create your layer, replace all parameters with appropriately named Function Input nodes.

- When you bring your new Material Function into a Material, connect new parameter nodes into the inputs.

- You can now instance the final Material, and your parameters will drive the appropriate aspects of your layers.

- Make sure to supply default values for your Function Inputs. This speeds up the workflow for those who do not need to make changes.

## Caveats

Although Layered Materials are useful for handling multi-Material setups, you must take care when employing them. They can be heavy in terms of performance, particularly if the Materials used in the layer functions are complex themselves.

Keep in mind that all your layers are rendered simultaneously, and then blended. For instance, if you have four layers in a Material, for each pixel of your object the engine must test to see which of the four is blended and then reject any not in use. This added calculation makes the Material more performance intensive.

Your first impulse may be to use Layered Materials any time you wish to have multiple surface types on an object. For example, on an automobile you may want to have a distinct layer for paint, another for steel, for rubber, for glass, and so on. Instead, it is more efficient to separate many of those layers at the geometry level. This creates more Material Elements on your objects, which increases draw calls, but is generally much more efficient. In short, if you can apply multiple Materials instead of using a Layered Material, then do so. If you must have per-pixel control over where Materials are placed, then use layered Material functions or Material Layers (-> using-material-layers-in-unreal-engine).

Although condensing multiple individual Materials down to one will reduce draw calls, the resulting Layered Material is generally too heavy for this to be used on mobile platforms.

- materials
- shaders

On this page

- Key Benefits (-> layered-materials-in-unreal-engine)
- Blend Types (-> layered-materials-in-unreal-engine)
- Instancing Layered Materials (-> layered-materials-in-unreal-engine)
- Caveats (-> layered-materials-in-unreal-engine)

# Landscape Materials

https://dev.epicgames.com/documentation/en-us/unreal-engine/landscape-materials-in-unreal-engine?application_version=5.9

> A reference guide to Landscape Materials and how to use them with your terrain.

[image: Landscape Materials]

Unreal Engine (UE) provides several landscape-specific Material (-> unreal-engine-materials) Blueprint nodes that can help improve the textures for your Landscape. You can use the nodes alongside any other material in UE.

You can create and modify **Landscape Materials** in the Material Editor (-> unreal-engine-material-editor-user-guide) in the same way as other materials.

## Layer Weights and Ordering

Landscape materials operate as a blend between multiple layers, where painted blend weights control the influence of each layer.

Each layer is identified by a (case-insensitive) name that gets used in one of the landscape-specific material nodes (e.g. **Landscape Layer Sample**, **Landscape Layer Blend**, etc.). The nodes allow the material to access a specific weightmap of a specific target layer.

To be paintable, the layer needs to be created and associated with a **Landscape Layer Info** asset. For more information, see Target Layers (-> creating-and-using-custom-heightmaps-and-layers-in-unreal-engine). It is okay to create a target layer in the landscape and not use it in the landscape material. However, if a material looks for a layer name that has no target layer entry in the landscape, its weight will always be considered zero.

In the Blueprints editor, the material graph determines how the weights are interpreted to achieve the blended result. The blending method defines how the landscape uses those weights in the final result.

There are two possible blending modes: **W****eight Blending** and **Alpha Blending**. You can use these methods together to create different effects, such as snow on top of your grass and dirt layers.

| Blending Mode | Description |
| --- | --- |
| **Weight Blending** | Assigns a value between `0` and `1.0` to each layer of the material, which corresponds to a percentage value. Landscape Paint tools ensure that the weight value of all weight blended layers does not exceed `1.0`. The excess value is removed and the other layers scale down appropriately, so that a total of 100% remains.When one layer is painted to 100%, the weight values for all other layers are 0%. This means that when you use the Paint (-> landscape-paint-mode-in-unreal-engine) tool to remove the layer that is at 100%, there is nothing to replace it with, because all other layers are valued at 0%. This makes it appear as if the layer hasn’t changed. |
| **Alpha Blending** | Assigns each layer an alpha percentage value between 0 and 100%. If your material graph is set up for ordered blending, this method respects the order in which the layers are applied.The alpha layer exists separately from the other weighted layers, so when the alpha layer weight increases, other existing layer weights decrease. |

The landscape material is responsible for interpreting weight values from the target layers in the landscape actor, then turning them into shading properties. However, the landscape system also comes with an edit-time layer weight blending system that can transform the weight values before they reach the material. For more information on weighted blending, see Landscape Paint Mode (-> landscape-paint-mode-in-unreal-engine).

## Landscape-Specific Material Nodes

Inside the Material Editor (-> unreal-engine-material-editor-user-guide), there are several specific nodes that you can use with the Landscape system. You can find these nodes by right-clicking and searching the context sensitive menu, or by searching in the **Palette** menu.

[image: Material Editor Context Menu] Click image for full size.

### Landscape Layer Blend Node

The **Landscape Layer Blend** node blends together multiple per-layer values, such as texture samples or materials. Layers with higher blend weights have more influence on the blended result.

To add a new layer, click the plus (**+**) icon.

[image: Layer Blend Array Elements] Click image for full size.

After you’ve added layers to the node, the Layer Names appear in the LandscapeLayerBlend node. The node has the following inputs:

[image: Landscape Layer Blend Mode] Click image for full size.

| Number | Property | Description |
| --- | --- | --- |
| **1** | **Layers** | Lists layers contained in the array. Add new layers by clicking the plus icon (). |
| **2** | **Additional Layers** | Shows any additional collapsed layers. |
| **3** | **Layer Name** | Displays the unique name of the layer. The **Layer Name** corresponds to the layer name used in Paint mode (-> landscape-paint-mode-in-unreal-engine) in the Landscape tool window. |
| **4** | **Blend Type** | Defines the blend mode used by this layer. It contains the following options: **LB Alpha Blend**, **LB Height Blend**, or **LB Weight Blend.** For more information, see Landscape Layer Blend Types (-> landscape-materials-in-unreal-engine). |
| **5** | **Preview Weight** | Displays the weight value to use when previewing the blending in the Material Editor. |
| **6** | **Const Layer Input** | Defines an RGB value to use when you do not want to use a texture. This is used for debugging a layer. |
| **7** | **Const Height Input** | Defines a height value to use when you do not want to use a texture. |

The **Landscape Layer Blend** node has the following inputs and outputs:

[image: Layer Blend Node] Click image for full size.

| Number | Item | Description |
| --- | --- | --- |
| **1** | **Layer Layer Name** | Displays the unique name of the layer. This input is only available after you have added and names layers in the **Details** panel. |
| **2** | **Height Layer Name** | Defines a height map to blend with the named layer. This input is only visible on layers where the **Blend Type** property is set to **LB Height Blend**. |
| **3** | **Output** | Outputs the blended result. |

All layer names must be unique. It is recommended to name your layers with a descriptive name that indicates the layer’s contents.

#### Landscape Layer Blend Types

The **Landscape Layer Blend** node has three types of blend modes. Each different **Layer Blend** mode is used to achieve a different result.

| Blend Mode | Function |
| --- | --- |
| **LB Weight Blend** | Implements a weighted blend between all LB Weight Blend layers. This type is not order dependent. |
| **LB Alpha Blend** | Implements an alpha-blended overlay on top of the LB Weight Blend and LB Height Blend layers. Each LB Alpha Blend layer is applied in the order they appear in the list. For example, painting snow over rock and grass occludes both, but erasing snow reveals the rock and grass beneath it. |
| **LB Height Blend** | This is the same as LB Weight Blend, but also adds detail to the transition between layers based on a height map. For example, you can have dirt appear in the gaps between rocks at the layer transition point, instead of just smoothly blending between rock and dirt.[image: LB-blend-image]The dirt appears in the gaps between rocks at the layer transition point, creating a smooth transition where the layers meet. |

#### Adding a Landscape Layer Node

The `LandscapeLayerBlend` node automatically blends multiple layers together using either alpha blending or alpha blending with a height-based offset. The height-based offset lets a layer blend with other layers based on a heightmap input.

- In the **Material Editor**, add a `LandscapeLayerBlend` node.
- In the **Details** panel, next to **Layers**, click the plus icon (**+**) to add a layer.[image: Landscape-layer-blend-add-new-layer]
- Expand the layer to view its properties.
- Change the **Layer Name** to a descriptive name for the layer, for example, **Snow**.
- Determine whether you want the layer to be alpha blended or height blended, and set the **Blend Type** accordingly.[image: Landscape-layer-blend-change-name]
- **Add** as many additional layers as you want for your Landscape Material. Rename them, and set their Blend Types appropriately.
- **Connect** the `LandscapeLayerBlend` node's output to the **Base Color** input of your material's base node.
- Add **Texture Sample** nodes, and connect their main outputs to the **Layer** inputs of the `LandscapeLayerBlend` nodes. Alternatively, you can create a more complex material network and connect it to the **Landscape Layer Blend Layer** input. For any height-blended layers, connect the **Texture Sample**'s alpha output to the `LandscapeLayerBlend`'s **Height** input.

When you are done, your Landscape material network should look something like this:

[image: Landscape-layer-blend-in-Blueprints]

You can preview the effects of different weights on the material by changing the **Preview Weight** properties of the `LandscapeLayerBlend` nodes.

For more information on the Landscape Layer Blend node, see Landscape Layer Blend Technical Information (-> landscape-materials-in-unreal-engine).

### Landscape Layer Sample Node

The **Landscape Layer Sampl****e** node returns the weight value associated with a given target layer. Its result is a value between `0.0` (when the target layer is not used) and `1.0` (when the target layer is fully painted), that you can then use at will in its material computations.

[image: Landscape-layer-sample-node-menu]

|  |  |
| --- | --- |
| **Parameter Name** | Defines the name of the target layer to sample from. |
| **Preview Weight** | Defines the weight to use for preview purposes in the Material Editor. |

### Landscape Layer Coords Node

The **Landscape Layer Coords** node generates UV coordinates used for mapping the Landscape material onto Landscapes.

[image: Landscape Layer Coords Node] Click image for full size.

This node has the following options:

| Number | Property | Description |
| --- | --- | --- |
| 1 | **Mapping Type** | Specifies the orientation to use when mapping the material or network to the Landscape. It contains the following options:**TCMT Auto**: Uses landscape vertex coordinates, in the range [0, OverallLandscapeResolution]**TCMT XY**: Uses object space XY mapping. This is equivalent to TCMT Auto.**TCMT XZ**: Uses object space XZ mapping. Recommended for side-projected textures.**TCMT YZ**: Uses object space YZ mapping. Recommended for side-projected textures. |
| 2 | **Custom UVType** | Outputs the UV coordinates to map the material to the Landscape based on the type. It contains the following options:**LCCT None**: Do not use custom UVs.**LCCT Custom UV0**: Use custom UVs in channel 0.**LCCT Custom UV1**: Use custom UVs in channel 1.**LCCT Custom UV2**: Use custom UVs in channel 2.**LCCT Weight Map UV**: Use original Weightmap UVs. |
| 3 | **Mapping Scale** | Applies uniform scaling to the UV coordinates. |
| 4 | **Mapping Rotation** | Applies the rotation, in degrees, to the UV coordinates. |
| 5 | **Mapping Pan [U]** | Applies the offset in the [U] direction to the UV coordinates. |
| 6 | **Mapping Pan [V]** | Applies the offset in the [V] direction to the UV coordinates. |
| 7 | **Unlabeled Output** | Outputs the UV coordinates to map the material to the Landscape based on the given property values. |

### Landscape Layer Switch Node

You can use the **Landscape Layer Switch** node to exclude some material operations when a specific layer is not contributing to a region of the Landscape. You can use this to optimize your material by removing calculations that are not necessary when a layer's weight is zero.

[image: Landscape Layer Switch Node] Click image for full size.

This node has the following options:

| Number | Property | Description |
| --- | --- | --- |
| 1 | **Parameter Name** | Displays the unique name of the parameter. |
| 2 | **Preview Used** | If checked, uses a preview. |
| 3 | **Layer Used** | Indicates the material network to use if the specific layer is in use by the current region of the Landscape. |
| 4 | **Layer Not Used** | Indicates the material network to use if the specific layer is not used by the current region of the Landscape. |
| 5 | **Output** | Either the **Layer Used** or **Layer Not Used** inputs, depending on whether the layer contributes to the particular region of the Landscape. |

### Landscape Layer Weight Node

You can use the **Landscape Layer Weight** node to access layer weights and implement your own custom blending solution in the material graph. The output returns (Base + Layer * LayerWeight). By chaining multiple Landscape Layer Weight nodes together, you can produce a weighted sum that blends between the specified layers.

You can directly access the `LayerWeight` value without modification by setting the **Base** value to `0` and the **Layer** value to `1.0`.

[image: Landscape Layer Weight Node] Click image for full size.

This node has the following options:

| Number | Property | Description |
| --- | --- | --- |
| 1 | **Parameter Name** | Displays the name of the layer whose weight you want to read. |
| 2 | **Preview Weight** | Defines the weight to use for preview purposes in the Material Editor. |
| 3 | **Const Base** | Defines a specific RGB constant value to use when Base is not connected. |
| 4 | **Base** | The node network to blend with this layer. This includes the value of the previous layers and any other underlying data. This gives the layer value multiplied by the painted layer weight. |
| 5 | **Layer** | The value for the specified layer. This input value is multiplied by the layer weight and accumulated onto Base to produce the Output value. |
| 6 | **Output** | Outputs the result of the blending between the Base and Layer inputs, based on the layer weights of the inputs. |

#### Adding a Landscape Layer Weight Node

- In the **Material Editor**, add a `LandscapeLayerWeight` node.[image: Landscape-layer-weight-node-in-Blueprints]
- In the **Details** panel, change the **Parameter Name** to a descriptive name for the layer, for example, **Rock**.[image: Landscape-layer-weight-menu-options]All layer names must be unique. It is recommended to name your layers with a descriptive name that indicates the layer’s contents.
- **Add** additional Landscape Layer Weight nodes, until you have one for each layer that you want your material to have. This example uses two `LandscapeLayerWeight` nodes.
- Add and connect your **Texture Samples** or material network expressions to your **Landscape Layer Weight** nodes.
- **Add** a `LandscapeLayerCoords` node and **set the UV** titling. Connect it to the **Texture Sample** nodes.
- **Connect** each Layer node's output pin to the Base pin of the next layer node, while leaving the first layer node's Base pin unconnected.
- Connect the last Layer node's output pin to the **Base Color** input of the `NewMaterial` node.

You should have something similar to the example below:

[image: Landscape-layer-weight-in-Blueprints]

### Landscape Visibility Mask Node

The **Landscape Visibility Mask** node outputs the visibility value of the landscape. The output is the visibility mask value. The value is `0.0` where the landscape is transparent and `1.0` where the landscape is visible.

[image: Landscape-visibility-mask-node]

On a standard landscape, landscape visibility requires the material to use a **Masked Opacity Blend Mode**, as the landscape shader needs to sample the visibility weightmap to discard pixels that are not visible enough. In order to do this, you have to connect the **Landscape Visibility Mask** material node to the **Opacity Mask**. This is more costly performance-wise, and should be avoided as much as possible on the global landscape material.

The landscape system is able to automatically detect the regions (landscape components) where visibility information is present. It can then override the material instance’s blend mode, only in those regions, in order to limit where a masked material is actually used. You need to leave the landscape material’s **Blend Mode** to **Opaque**, but connect the **Opacity Mask** (even if it appears greyed out), like this:

[image: Visibility-mask-in-blueprints-editor]

When generating a Nanite landscapes (-> using-nanite-with-landscapes-in-unreal-engine) mesh, there’s no cost in the landscape material, as the Nanite renderer can keep on using the hardware rasterizer (the fast path), as it does with any other opaque materials.

## Landscape Layer Blend Technical Information

Landscape layer nodes behave similar to a Static Switch Parameter (-> material-parameter-expressions-in-unreal-engine) node. This switches between using one branch of the material and another. Each component of the Landscape has its own **Material Instance Constant** created from the main Landscape material, which is applied to only that component.

If a Landscape component does not use a specific layer, the subtree of nodes connected to the layer is discarded. This reduces the complexity, letting the material applied to the Landscape contain any number of texture samples, as long as it is within the limits set by the shader model.

Using this method, you can create a main Landscape material that contains every texture or material you need, while keeping the final result within the parameters allowed by the hardware.

Please note that currently most RHIs support shared texture samplers, which means that there’s no hard constraint about how many layers can be used on a given landscape component. The exception being ES3.1 (mobile), which still has a hard limit in terms of sampler count (16), across all texture accesses in the material. Hence, if the game is planned to ship on such a platform, it’s important to make sure that the number of landscape layers remains low, since a new weightmap texture will be added every 4 target layers (1 target layer per channel of an RGB8 texture). This means another texture sampler will be added (on top of all the textures that might get sampled by the target layer’s shader code path). For more information, see Mobile Landscape Materials (-> landscape-materials-in-unreal-engine).

Any network of material expressions can be connected to the **Layer** inputs in place of a simple **Texture Sample**. This makes it possible to do more complex effects such as transitioning from detail textures to larger macro textures depending on the distance the layer is being viewed from.

### Landscape Layer Blend Issues

When you use the LB Height Blend mode for multiple Landscape layers, you may find black spots on your Landscape where different layers meet. LB Height Blend works by managing the blend factor, or weight, for the layer, using the specified height value. When multiple layers are painted on an area and are set to LB Height Blend, the layers painted in a particular area can simultaneously have a `0` height value, so the desired blend factor for each layer becomes `0`.

Because there is no specific ordering, black spots can appear because no layers have any contributions in that area. When you blend a Normal map, even more black spots can appear, because this blending results in a Normal value of (`0,0,0`), which is invalid and causes lighting issues. If this happens, paint the area with a material with a non-zero weight.

In the left image, all layers are LB Height Blend, causing some areas to be black. On the right, the red "1" layer has been changed to use LB Alpha Blend.

[image: LB Height Blend Problem] Click image for full size.

Below is an example of the properties of the **Landscape Layer Blend** node for all the layers being blended together. The **Soil** layer has its blend mode set to LB Alpha Blend, while the other layers have theirs set to LB Height Blend. This is to stop the issue mentioned above from happening.

[image: Layer Blend Properties] Click image for full size.

To delete a layer, click the dropdown arrow to the right of the layer's element number, and select **Delete**.

[image: Delete Layer] Click image for full size.

## Mobile Landscape Materials

You can use any number of Landscape layers, as long as you have enough **Texture Sampler** nodes. The Landscape layer allocation uses the Feature Level Switch material node (-> utility-material-expressions-in-unreal-engine), letting a single PC or console Landscape material also have a mobile version. The following image shows how the Landscape in Fortnite Battle Royale looks when used for mobile devices.

[image: Mobile Landscape Feature Level]

While you can use any number of nodes, we recommend that you only use three.

## Assigning Materials to Landscapes

After creating a Landscape material, assign the material to a Landscape actor in your level.

- In the **Content Browser**, locate the Landscape material that you want to use.
- Either in the viewport or using the **World Outliner**, select the Landscape.
- In the **Details** panel for the Landscape, locate the **Landscape Material** option, and click the dropdown to select a material.[image: Assigned Material] Click image for full size.

- materials
- landscape

On this page

- Layer Weights and Ordering (-> landscape-materials-in-unreal-engine)
- Landscape-Specific Material Nodes (-> landscape-materials-in-unreal-engine)
- Landscape Layer Blend Node (-> landscape-materials-in-unreal-engine)
- Landscape Layer Blend Types (-> landscape-materials-in-unreal-engine)
- Adding a Landscape Layer Node (-> landscape-materials-in-unreal-engine)
- Landscape Layer Sample Node (-> landscape-materials-in-unreal-engine)
- Landscape Layer Coords Node (-> landscape-materials-in-unreal-engine)
- Landscape Layer Switch Node (-> landscape-materials-in-unreal-engine)
- Landscape Layer Weight Node (-> landscape-materials-in-unreal-engine)
- Adding a Landscape Layer Weight Node (-> landscape-materials-in-unreal-engine)
- Landscape Visibility Mask Node (-> landscape-materials-in-unreal-engine)
- Landscape Layer Blend Technical Information (-> landscape-materials-in-unreal-engine)
- Landscape Layer Blend Issues (-> landscape-materials-in-unreal-engine)
- Mobile Landscape Materials (-> landscape-materials-in-unreal-engine)
- Assigning Materials to Landscapes (-> landscape-materials-in-unreal-engine)

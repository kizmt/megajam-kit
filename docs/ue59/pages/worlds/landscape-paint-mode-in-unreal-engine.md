# Landscape Paint Mode

https://dev.epicgames.com/documentation/en-us/unreal-engine/landscape-paint-mode-in-unreal-engine?application_version=5.9

> Guide to the Landscape Paint mode tools and how to use them.

[image: Landscape Paint Mode]

The **Landscape Paint Mode** tools adjust layer weights to selectively apply materials and modify the appearance of your landscape.

[image: Grassy Field Example by Quixel] Grassy Field Example by Quixel

The Landscape Paint Mode offers various ways to paint weightmaps onto the landscape. This page covers:

- the concept of target layers
- how target layers should be set up on the landscape
- the ways layers can blend with one another (weight blending)
- the different painting tools

## Target Layers

**Target Layers** are a part of the assigned **Landscape Material** that defines which material you are painting on your Landscape.

Landscape target layers determine how the material is applied. A landscape material can use multiple layers with different textures, scaling, rotation, and panning blended together to create the final textured terrain.

Each landscape layer that is declared in the Landscape Material can populate the list of Target Layers**** found in the Landscape Mode panel and is displayed with its name and thumbnail image.

[image: Landscape Target Layer] Select your active layer from the Target Layers list in the Landscape Mode panel

Landscape thumbnails remain an approximation and can be turned off if they’re not deemed representative enough of the final look. Deselect the checkbox for **Display Target Layer Thumbnails** in the Landscape project Settings.

[image: Display-target-thumbnails-checkbox]

The highlighted layer is applied to the landscape according to the tool’s options and brush settings.

[image: Moutain Landscape with multiple paint layers] Moutain Landscape with multiple paint layers

The Paint tools manipulate the weightmap of the landscape similar to how the Sculpting tools manipulate heightmaps.

Layers are created in the Landscape Material. For more information about layers and Landscape Materials, see Landscape Material Layer Blending.

### Layer Info Objects

A **L****ayer Info Object** is an asset that contains the weightmap and other information about a particular Landscape layer. Every Landscape layer must have a layer info object assigned to it. You can create layer info objects in the Landscape Mode panel.

There are two kinds of layer info object, Weight-Blended and Non Weight-Blended:

- **Weight-Blended** - Painting a weight-blended layer will decrease the weight of all other weight-blended layers. For example, painting mud will remove grass, and painting grass will remove mud. This is the most commonly used type of layer info object.
- **Non Weight-Blended** - Layers that are independent of each other. Painting a non weight-blended layer does not affect the weights of the other layers. These are used for more advanced effects, such as blending snow onto other layers: instead of having grass, mud, rock or snow, you would use a non weight-blended snow layer to blend between "grass, mud, or rock" and "snowy grass, snowy mud, or snowy rock."

You can either create a layer info object from the layer itself, or reuse an existing layer info object from another Landscape.

#### Create a Layer Info Object

- Click the **Plus** icon to the right of the Layer name.
- Select **Weight-Blended Layer (normal)** or **Non Weight-Blended Layer**.[image: Weight Blended Non Weight Blended]
- Choose the save location for the new layer info object.

Layer Info Objects exist as assets in the **Content Browser** after creation, and can be reused with other landscapes. Layer Info Objects can be re-used across levels and shared between landscapes in the same level. Each target layer of your landscape must use a different layer info object.

[image: Layer Info Object]

#### Reuse an Existing Layer Info Object from Another Landscape

- Find and select the layer info object in the **Content Browser**.
- In the **Target Layers** section, click the **Assign** icon to the right of the layer you want to use as the layer info object.[image: Icon-with-circle-and-arrow]

Layer info objects can only be used if their layer name matches the layer they were originally created for.

The primary purpose of layer info objects is to store the weightmap data for a painted layer.

## Setting Up Target Layers and Layer Info Object Assets

The Landscape Editor has tools to quickly generate and populate target layers. This can greatly reduce the amount of time it takes to set up a new landscape, especially one that re-uses an existing landscape material.

The **Create Layers From Materials** and **Auto-Fill Target Layer Asset** tools utilize the **Default Layer Assets Path** to find shared Layer Info assets. It’s recommended that Target Layer Info Object Assets are saved in a common folder (Eg. saved in a common Landscape folder: `All/Landscape/LayerInfos` or saved alongside Landscape Materials: `All/Materials/Landscape/LayerInfos`). Storing target layer info assets in a common location avoids the unnecessary creation of assets for every new landscape.

In Paint Mode, enable the **Default Layer Assets Pat****h** and select the shared layer Info folder. The file path is saved to the Landscape Editor and will persist across levels.

[image: Step-1-default-layer-asset-path-checkbox]

Use the **Create Layers From Materials** tool to auto-generate target layers based on landscape layers found in the landscape actor’s materials. This feature automatically detects missing landscape target layers and creates new layers with the proper layer names. The Create Layers From Materials tool will generate missing landscape target layers from the Landscape Material, Landscape Hole Material, and Landscape LOD override materials. The feature searches through each **Landscape Proxy**, so any individual Proxy’s override material will also be considered during the missing target layer generation.

[image: Step-2-create-layers-from-materials]

The Create Layers From Materials generates target layers but does not fill their corresponding Layer Info Assets. Use the **Auto-Fill Target Layer Assets** tool to quickly create or assign assets to each target layer.

[image: Step-3-Auto-Fill-target-layers-tool]

The **Auto-Fill Target Layer Assets** dialog has two options: auto-fill **Unassigned Layers Onl****y** or **All Layers**.

- **Unassigned Layers Only**: will only populate the Target Layers with no existing Layer Info Asset.
- **All Layers**: will update every target layer’s Layer Info Asset with assets found in the Default Layer Assets Path.

By default the Auto-Fill Target Layer feature will leave target layers empty if no asset is found. Enable the **Create new assets** checkbox to automatically create missing Target Layer Info Assets not found within the Default Layer Assets Path.

[image: Step-4-auto-fill-target-layers-modal]

#### Target Layer Info Assets Properties

| Option | Description |
| --- | --- |
| **Layer Name** | Displays the name of the layer |
| **Phys Material** | The Physical Material (-> physical-materials-in-unreal-engine) (if any) assigned to areas of Landscape where this layer is dominant. |
| **Hardness** | The value used by the Erosion (-> landscape-erosion-tool-in-unreal-engine) tool. |
| **Minimum Collision Relevance Weight** | Determines the minimum required weight needed to be considered the dominant layer. |
| **Weight Blending Method** | Described in the Weight Blending (-> landscape-paint-mode-in-unreal-engine) section. |
| **Weight Blend Group** | Described in the Weight Blending (-> landscape-paint-mode-in-unreal-engine) section. |
| **Layer Usage Debug Color** | Determines the color used when debugging layers. |
| **Spline Falloff Modulation** | Settings for controlling Spline Falloff Modulation. |

#### Orphaned Layers

If a layer is removed from the landscape material after it has been populated in the **Target Layers** list and it has painted data on the Landscape, it will be displayed in the list with a **?** icon. This denotes an orphaned layer.

[image: Interface showing a missing Grass layer] Interface showing a missing Grass layer

Areas previously painted with this layer likely appear black, though the exact behavior depends on your landscape material.

#### Deleting Orphaned Layers

You can delete orphaned layers from the Landscape. It is recommended that you first paint over any areas where the layer was used. Painted layer data is preserved until the layer is deleted, so no information is lost if you make a mistake in the landscape material.

To remove a layer from your Landscape, click the **X** icon to the right of the layer's name.

[image: Click the X to delete the orphaned layer] Click the X to delete the orphaned layer

### Weight Editing

At each vertex in your landscape, each target layer has a weight specifying how much influence that layer has on the Landscape. Layers have no particular blending order. It is up to the material to decide what to do with the layer’s weight value, and how it should influence the final shading properties via a variety of landscape material (-> landscape-materials-in-unreal-engine) nodes. That means that the “weight blending” behavior is entirely controlled at the landscape material level. However, the landscape editor mode offers a way to manipulate the weights of target layers at edit-time, which achieves a form of “weight-blending” that can take into account other target layers (and/or edit layers). This ensures that the weights of a certain set of target layers end up normalized (i.e. their sum is equal or inferior to 255).

### Weight Blending

The Landscape Layer Info assets have some Weight Blending-related settings that describe how this particular layer should behave against other weight-blended layers:

| Option | Description |
| --- | --- |
| **Weight Blending Method** | Allows this layer's final weight to be adjusted against others (read further on for details). |
| **Weight Blending Group** | (Only available for the Advanced Weight Blending method). Allows target layers from the same group only to have their weight adjusted against one another. For example, all layers with the blending group “Group A” will be weight-blended together, but not against those assigned to another group “Group B” (which will themselves be weight-blended against one another). An empty group name is also valid, it’s simply considered as another standard weight blending group. |

#### Weight Blending Methods

- **No Weight Blending**: No weight blending will be performed to adjust this target layer’s weight against others. This blending method also does not affect the edit layers blending behavior. Unless using procedural edit layers, BP brushes, or subtractive edit layer blending, the final weight of the target layer will be equal to the sum of the weight on each of the target layers.
- **Final Weight Blending (Legacy)**: All target layers will have their final weight normalized against one another, so that their sum will always be equal to 255 (except when they’re all zero, in which case their sum will also remain at zero). In the case where target layers represent a landscape “matter” (e.g. sand, grass, rock), this allows you to ensure that the final “matter” remains realistic with a sum of each of its parts that doesn’t exceed 100%. For example, if you have painted 255 on layer “Sand” (i.e. the max value), 255 on layer “Grass” and 255 on layer “Rock”, with weight-blending, the final “matter” will be made of ⅓ of each, leading to a sum of all matters of 100%, rather than 300% (when using “No Weight Blending”). Similar to the No Weight Blending method, Final Weight Blending does not affect the edit layers blending behaviors. It will only be applied **at the end** of the edit layers stack evaluation. This can lead to a somewhat counterintuitive behavior, where painting on an edit layer on top of another will not actually let you “override” what’s underneath. It doesn’t let you decrease the value of the other target layers. In practice, this makes it impossible to force a given matter (say, “Sand”) to 100% when edit layers underneath have introduced other matters (e.g. ⅓ “Sand”, ⅓ “Grass”, ⅓ “Rock”).
- **Advanced Weight Blending**: All target layers (from a given weight blending group) will have their final weight normalized against one another, so that their sum doesn’t exceed 255 (i.e. 100%). Therefore, the result of this blending method will appear similar to the Final Weight Blending (Legacy) method and can be used to simulate the effect of “blending matters” (e.g. a given point in space might be made of ⅓ “Sand”, ⅓ “Grass” and ⅓ “Rock”). However, the key difference is that blending is performed **at each step** of the edit layers stack evaluation (rather than at the end). The weight sum of the blended target layers on a given edit layer is used as an alpha value to decide how much this edit layer “overrides” the weight evaluated so far. It decreases the values of the other target layers from edit layers underneath, depending on how much you paint a given target layer on the edit layer above. In the previous example (⅓ “Sand”, ⅓ “Grass” and ⅓ “Rock” on the edit layer underneath), if you paint 255 (i.e. 100%) on, say, the “Sand” layer, then the final result would completely override the weights from underneath, leaving the final weights at 100% “Sand”, 0% “Grass” and 0% “Rock”. This completely overrides the results from underneath, which leads to a much more natural behavior when you try to “hand-paint” the target layers combination at a given point in space.

## Using the Painting Tools

Painting tools modify the appearance of your landscape by selectively applying layers of specially designed Landscape Materials to portions of the landscape components.

The tools use the following controls:

| Controls | Description |
| --- | --- |
| **LMB** | Performs a stroke that applies the selected tool's effects to the selected layer. |
| **Shift+LMB** | Performs a stroke that applies the opposite of the selected tool's effects to the selected layer. |
| **Ctrl+Z** | Undo last stroke. |
| **Ctrl+Y** | Redo last undone stroke. |

Though each tool has specific options, they all use the brush options described here (-> landscape-brushes-in-unreal-engine) and share this setting:

| Common Option | Description |
| --- | --- |
| **Tool Strength** | Determines how much effect each brush stroke has. |

### Paint

[image: Paint Tool Interface button] Paint Tool Interface button

The Paint tool increases or decreases the weight of the material layer being applied to the Landscape using the currently selected brush and falloff.

| Option | Description |
| --- | --- |
| **Use Target Value** | Blends the weight toward a target value. |

### Smooth

[image: Smooth Tool Interface button] Smooth Tool Interface button

The Smooth tool averages the layer weights across the area on which the tool is used. The strength determines the amount of smoothing.

**Layer Smoothing**

 [image: Landscape Smooth Layer Before]

 [image: Landscape Smooth Layer After]

| Option | Description |
| --- | --- |
| **Filter Kernal Scale** | Sets the scale multiplier for the smoothing filter kernel. |
| **Detail Smooth** | Performs a detail preserving smooth using the specified detail smoothing value. Larger detail smoothing values remove more details, while smaller values preserve more details. |

### Flatten

[image: Flatten Tool Interface button] Flatten Tool Interface button

The Flatten tool directly sets the selected layer's weight to the value of the **Tool Strength** slider.

| Option | Description |
| --- | --- |
| **Flatten Mode** | Determines whether the tool will increase or decrease the application of the selected layer's weight, or do both. |

### Noise

[image: Noise Tool Interface button] Noise Tool Interface button

This tool applies a noise filter to the layer weight. The strength determines the amount of noise.

| Option | Description |
| --- | --- |
| **Use Target Value** | Blends the values of the noise being applied toward a target value. |
| **Noise Mode** | Determines whether to apply all noise effects, only the noise effects that result in increasing the application of the layer, or only the noise effects that result in reducing the application of the layer. |
| **Noise Scale** | Determines the size of the perlin noise filter used. The noise filter is related to position and scale. If the Noise Scale does not change, the same filter is applied to the same position many times. |

### Landscape Painting Tips

- When using the **Paint Tools**, you might find it easier to paint over what you would like to erase than to try and erase it using **Shift + Left Mouse Button**.
- When using the **Alpha Brush**, remember that you can change what the pattern that the brush uses by selecting a different RGB channels from the **Texture Channel** drop down menu. This is very useful because you can pack up to three different Alpha patterns in a single texture.
- Landscape compiles shaders separately for each component based on which layers are painted on them. For example, if you have a component with a dirt layer on it but no trace of the grass layer has been painted on it, the textures for the grass layer are left out of the material for that component, making it cheaper to render. So when you do an optimization pass, it can be worthwhile to go over a Landscape and look for components that only have a tiny trace of a given layer and erase them to reduce material complexity.
- Another issue to watch out for when painting layers is to avoid having too many textures on one component. The material editor stats show the limit of how many texture samples you are allowed to use, but for Landscape materials the masks for each layer count as texture samples too and do not show in the stats. If a component starts showing the default texture (Grey Squares) when you paint a new layer onto it, it is likely that it is gone over the texture sample limit and either needs to have a layer erased or the material needs to be optimized to use less textures.
- You can change the LOD Distance Factor for individual Landscape components so they will simplify at closer or further distance thresholds. Things like mountain peaks or anything with a distinct silhouette will LOD most noticeably as you move further away, so you can reduce the LOD bias for those components to preserve their shape. You can also raise the LOD bias for low-detail areas like flat plains that will not look noticeably different with less tessellation.

- landscape

On this page

- Target Layers (-> landscape-paint-mode-in-unreal-engine)
- Layer Info Objects (-> landscape-paint-mode-in-unreal-engine)
- Create a Layer Info Object (-> landscape-paint-mode-in-unreal-engine)
- Reuse an Existing Layer Info Object from Another Landscape (-> landscape-paint-mode-in-unreal-engine)
- Setting Up Target Layers and Layer Info Object Assets (-> landscape-paint-mode-in-unreal-engine)
- Target Layer Info Assets Properties (-> landscape-paint-mode-in-unreal-engine)
- Orphaned Layers (-> landscape-paint-mode-in-unreal-engine)
- Deleting Orphaned Layers (-> landscape-paint-mode-in-unreal-engine)
- Weight Editing (-> landscape-paint-mode-in-unreal-engine)
- Weight Blending (-> landscape-paint-mode-in-unreal-engine)
- Weight Blending Methods (-> landscape-paint-mode-in-unreal-engine)
- Using the Painting Tools (-> landscape-paint-mode-in-unreal-engine)
- Paint (-> landscape-paint-mode-in-unreal-engine)
- Smooth (-> landscape-paint-mode-in-unreal-engine)
- Flatten (-> landscape-paint-mode-in-unreal-engine)
- Noise (-> landscape-paint-mode-in-unreal-engine)
- Landscape Painting Tips (-> landscape-paint-mode-in-unreal-engine)

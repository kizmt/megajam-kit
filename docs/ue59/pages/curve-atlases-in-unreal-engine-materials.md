# Curve Atlases in Materials

https://dev.epicgames.com/documentation/en-us/unreal-engine/curve-atlases-in-unreal-engine-materials?application_version=5.9

> Curve Atlases store a combination of Curve assets that enables you to access Curve Linear Color data through your Materials.

[image: Curve Atlases in Materials]

Curve Atlases store a combination of Curve (-> animation-curve-editor-in-unreal-engine) assets which enable you to access Curve Linear Color data through your Materials. The Curve Atlas stores any number of Curves in a texture that can be used with Materials (-> unreal-engine-materials). When creating Material Instances (-> instanced-materials-in-unreal-engine) and changing Material Instance Dynamics (-> instanced-materials-in-unreal-engine) (MIDs) through Blueprint, you are able to set a curve as an override, enabling you to quickly iterate and change RGBA curve values without changing your base Material.

## Curve Linear Color Asset

A **Curve Linear Color** asset is used to store the interpolated RGBA points that are evaluated over a given range, producing a color gradient that can be used with Materials.

 [image: Curve Gradient example]

Example of a Curve Gradient created with a Curve Linear Color asset

**Right-click** in the **Content Browser**, and select **Miscellaneous > Curve** to create a new Curve Asset.

 [image: Create Curve Asset]

In the **Pick Curve Class** dialog, select **CurveLinearColor**.

 [image: Pick Curve Class dialog]

A new Curve Linear Color asset is added to the Content Browser displaying a preview of its current gradient. Double-click the thumbnail to open the **Curve Asset Editor**, where you can add, subtract, and adjust keys for the individual RGBA curves in the graph.

 [image: Curve Asset in Content Browser]

When you open the Curve in its Asset Editor, you'll be able to set the individual RGBA curves, adjust color values for the Curve, and preview the Curve Gradient Result.

Click image for full size.

- The **Curve Gradient Result** shows you the resulting gradient.

- The **Curve Graph** is where you add, adjust, and subtract any keys for the individual RGBA curves.

- The **Color** panel is where you adjust color values that affect all keys.

To add a key to an individual curve, click the curve with the **Middle Mouse Button**. A key is inserted at the mouse pointer. If you **right-click** in the empty graph and choose **Add Key** from the context menu, you can add a key on all curves at the point on the x-axis where you clicked.

## Curve Atlas Asset

A **Curve Atlas** asset is used to store and access multiple Curve assets, enabling management of gradient lookup tables (LUT). The **Curve Atlas Asset Editor** is similar to the Texture Editor, enabling you to make adjustments for Brightness, Vibrance, Hue, and more.

 [image: Curve Atlas Example]

Example of the Curve Atlas LUT

The curves assigned to the Curve Atlas as **Gradient Curves** make up the atlas. The Material Graph uses the texture created to perform the lookup for Materials applied to Actors.

You can create a new Curve Atlas by right-clicking in the **Content Browser** and selecting **Miscellaneous > Curve Atlas**.

 [image: Create Curve Atlas Asset]

When you open the Curve Atlas in its Asset Editor, you can set the number of curves it can store, assign your curves, and adjust color values for all assigned curves. This is similar to the functionality of the Texture Editor.

Click image for full size.

- The main viewport displays the **Curve Atlas** lookup table, which displays all assigned **Gradient Curves** for the **Texture Size** that is applied.

- The **Curves** panel is where you sets the **Texture Size** for the number of **Gradient Curves** you need. The default is 256. The **Gradient Curves** subcategory is where you can add Gradient Curve assets to your asset.

- The **Adjustments** panel makes texture adjustments to all **Gradient Curves** assigned to the Curve Atlas.

For maximum texture efficiency, it's best to use a **power of 2** value (such as 32, 64, 128). You can uncheck **Square Resolution** and change the **Texture Height** to eliminate vertical white space.

The **Texture Size** used can have an impact on the fidelity of your gradients, so it's best not to use a small atlas size for a complex curve. However, you can save texture size by using a small atlas for a set of simple curves.

To add a new Gradient Curve to the Curve Atlas, click the **Plus** (**+**) icon to add array elements. You can use the **Trash Can** icon to remove all elements from from the array.

 [image: Add Curve Element]

Use the drop-down menu next to the new array element, and in the context menu select the Curve Asset you want to add to the Curve Atlas.

 [image: Reference curve asset]

Each Gradient Curve you add to your Curve Atlas is displayed as a row in the Curve Atlas lookup table.

 [image: Gradients in Curve Atlas]

## Using a Curve Atlas with Materials

After creating your Curves and applying them to a Curve Atlas, you can create a Material that references the Curve Atlas and retrieves one of the curves assigned to the atlas.

To sample one of the curves in the atlas, create a new Material and in the graph, right-click and add a **Curve Atlas Row Parameter** node.

 [image: Curve Atlas Row Parameter]

This node is similar to a Scalar Parameter in that it enables you to work with Material Instance Dynamics (-> instanced-materials-in-unreal-engine) (MIDs). These can then be used through Blueprint for the V-axis of the atlas UVs, but the node will do the sampling for you and return a Vector 3, along with R, G, B, and A, masks.

Select the Curve Atlas Row Parameter expression to display its **Details Panel** properties. Here you can assign the **Atlas** and select a **Curve** from that atlas to use with this Material by default.

 [image: Curve Atlas Row Parameter properties]

The Curve Atlas bakes down when it is compiled, which means there is currently no runtime support for changing what is in the atlas or the curve data that is stored in the atlas at runtime. However, you can store a large amount of data in a single Curve Atlas, and use Blueprint to override the curve being sampled from a Material Instance.

As an example, here is a "Rock" Material that samples one of the curves assigned to a Curve Atlas.

Click image for full size.

When you create any **Material Instances**, you can override the **Curve** Scalar Parameter to reference a different Curve in the **Curve Atlas** that is applied to your mesh.

The examples here show a Material Instance applied and the Curve that is being referenced from the Curve Atlas.

| [image: Curve Base] | [image: Curve 1] | [image: Curve 2] | [image: Curve 3] |
| --- | --- | --- | --- |
| Base | Curve 1 | Curve 2 | Curve 3 |

### Accessing Curve Atlases through Blueprint

In Blueprint, you can set the Scalar Parameter value on a Dynamic Material Instance using the **Get Curve Position** node. Get Curve Position takes the Curve Atlas as an input, passes the scalar value to the **Set Scalar Parameter Value**, and returns a Boolean indicating whether the curve was found in the atlas.

Click image for full size.

- materials
- shaders

On this page

- Curve Linear Color Asset (-> curve-atlases-in-unreal-engine-materials)
- Curve Atlas Asset (-> curve-atlases-in-unreal-engine-materials)
- Using a Curve Atlas with Materials (-> curve-atlases-in-unreal-engine-materials)
- Accessing Curve Atlases through Blueprint (-> curve-atlases-in-unreal-engine-materials)

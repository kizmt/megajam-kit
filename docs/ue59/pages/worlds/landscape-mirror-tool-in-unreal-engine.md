# Landscape Mirror Tool

https://dev.epicgames.com/documentation/en-us/unreal-engine/landscape-mirror-tool-in-unreal-engine?application_version=5.9

> This is an overview of the Mirror tool.

[image: Landscape Mirror Tool]

The **Mirror** tool enables you to mirror or rotate the existing Landscape heightmap geometry along the X or Y axis.

In this example, the Mirror tool is used to mirror the entire entire Landscape Actor along the Y axis.

## Using the Mirror Tool

- In the Landscape toolbar, in **Sculpt** tab, select the **Mirror** tool. [image: Mirror Tool button]

- Use the **Operation** drop-down selection to choose the axis and mirroring method you would like to use for your selected landscape. The directional arrow indicates which side of the landscape geometry will be mirrored on. [image: Mirror Settings]

- If necessary, adjust the **Mirror Point** values for the mirror plane or Left-click and drag the directional arrow on mirror plane into the position you want to mirror. Only the currently selected **Operation** axis will be used for the **Mirror Point**. For example, if the Operation method is "-X to +X" the X axis is the only active Mirror Point that will be affected. [image: Setting the Mirror Point]

- Once you are satisfied with your edits, you can hit the **Apply** button to see the results. [image: Applying Mirror] You now have a landscape with mirrored geometry.

### Mirror Smoothing Width

If the edge seams from mirroring your landscape look unnatural or too sharp in contrast after you apply your changes you can use **CTRL + Z** to undo your last action. Then you should adjust the **Smoothing Width** so that these
edge vertices that are merged are softened.

 [image: Smoothing Width Before]

 [image: Smoothing Width After]

In this example, the left image has no smoothing applied after the Landscape is mirrored, whereas the right is using a value of 10 to smooth the mirrored edges and reduce the harshness of the seam.

## Tool Settings

|  |  |
| --- | --- |
| [image: Mirror Tool] | [image: Mirror Tool properties] |

| **Property** | **Description** |
| --- | --- |
| **Mirror Point** | This sets the location of the mirror plane. This will default to the center of the selected Landscape and in most cases will not normally need to be changed. |
| **Operation** | The type of mirroring operation to perform. For example, -X to +X will copy and flip the -X half of the Landscape onto the +X half. |
| **Recenter** | This button places the mirror plane back at the center of the selected Landscape. |
| **Smoothing Width** | This will set the number of vertices on either side of the mirror plane to smooth over reducing sharp contrasting angles for mirrored sides. |

- landscape
- region

On this page

- Using the Mirror Tool (-> landscape-mirror-tool-in-unreal-engine)
- Mirror Smoothing Width (-> landscape-mirror-tool-in-unreal-engine)
- Tool Settings (-> landscape-mirror-tool-in-unreal-engine)

# Creating Hair Cards and LODs using Hair Card Generator

https://dev.epicgames.com/documentation/en-us/unreal-engine/creating-hair-cards-and-lods-using-hair-card-generator?application_version=5.9

> This tutorial explains how to create hair cards and LODs from a groom using the Hair Card Generator plugin.

This tutorial explains how to create hair cards and LODs from a groom using the Hair Card Generator (-> hair-card-generator-for-grooms-in-unreal-engine) with Dataflow. This tutorial uses **Hair_M_UpdoMessyBun** as an example asset.

[image: The UpdoMessyBun groom on the left, and the finished hair card representation on the right.]

## Prerequisites

Before following this tutorial, follow these steps:

- In Unreal Engine, go to **Edits** > **Plugins** and enable the following plugins for your project: - **Editor Dataflow Graph** - **Geometry Dataflow** - **Hair Card Generator** - **Metahuman Creator**

- Download the MetaHuman Updo Messy Bun Groom. This includes the **Hair_M_UpdoMessyBun** groom asset.

## Creating Card Groups in the Groom Asset File

For this tutorial, the **Hair_M_UpdoMessyBun** groom asset has already been set up to support card groups. This section explains that process. To continue the tutorial, go to Set Up Hair Card Generator on the Groom Asset.

Hair Card Generator can be used without card groups, but using card groups creates more precise geometry and textures. Card groups also give you control over polycount, so you can spend more triangles on strands that are visible, and fewer triangles on strands that provide coverage for the scalp. When creating a groom asset in DCC (Digital Content Creation software), the hair for each card should be separated into its own layer.

The **Hair_M_UpdoMessyBun** groom asset has already been divided into card group layers, which include the following parts of the hair:

- **Coverage**: Shown in white below. The core layer, meant for creating coverage for the scalp. This layer uses wide cards with less overall triangles. The **Num Textures** setting inside the hair card generator should be low, meaning that textures will repeat heavily across the cards generated for this layer. Having a low texture setting will allow further layers to have a higher setting, thus increasing texture detail for visible layers. Try to maximize the amount of strands in this card group, as the more coverage you can provide in this layer, the more triangles and textures can be spent on the visible portions of the hairdo.

- **Mid Layer**: Shown in green below. Meant for building the overall shapes of the hair. This layer has some definition to it, meaning a higher clump and triangles setting than the core layer.

- **Top Layer**: Shown in red below. The main bulk of triangles should be spent here, as this layer should have the most detail. The clump number can be increased as well for greater detail.

- **Flyaways**: Shown in yellow below. This layer is for flyaway strands. You can use the **Num Flyaways** setting inside the hair card generator to create these, but creating a separate card group layer for them gives you more direct control over which strands are flyaways.

- **Short Hairs**: Shown in black below. Short hairs should have their own card group since the parameters for short hairs differ from long hairs. Use a fairly high clump setting but a lower triangle setting. This produces small cards where most of the shape is in the texture instead of the geometry.

[image: The card group layers used for the example asset in this tutorial, visualized in red, green, white, black and yellow.]

## Set Up Hair Card Generator on the Groom Asset

To set up **Hair Card Generator** on the **Hair_M_UpdoMessyBun** groom asset, follow these steps:

- In the **Content Browser**, go to **Content** > **Hair_M_UpdoMessyBun**.

- Right-click the **Hair_M_UpdoMessyBun** groom asset and click **Create Dataflow Asset**.

- In the **Select a Groom Dataflow Template** pop-up window, click **Cards**.

- Double-click the **Hair_M_UpdoMessyBun** groom asset to open the groom asset interface.

## Create Card Groups in Dataflow

Next you need to add a filter to the Dataflow graph to generate the card groups. To add this filter, follow these steps:

- In the **Dataflow Graph** section, select the **BuildCardSettings **node.

- In the **Node Details** panel, click the **+** icon next to **Generation Settings** to add an element. [image: An element under Generation Settings]

- Click the **+** icon next to **Filter Settings** five times to create five filters, one for each of the card group layers defined on the groom.

- Set the **Filter Name** for each filter: **Coverage**, **Mid Layer**, **Top Layer**, **Flyaways**, and **Short Hairs**.

- Adjust the settings for each filter, using the following suggestions: - **Coverage**: - Set **Num Clumps** to 50. - Set **Num Triangles** to 2000. - Set **Num Textures **to 25. - Set **Num Flyaways** to 0. - Preview the geometry in the **Construction Viewport** by selecting the **GenerateCardsGeometry** node. These cards can appear somewhat jagged, but should not intersect with the scalp geometry. [image: A preview of the Coverage layer with these settings] - **Mid Layer**: - Set **Num Clumps** to 200. - Set **Num Triangles** to 7500. - Set **Num Textures** to 60. - Set **Num Flyaways** to 0. - Preview the geometry in the **Construction Viewport** by selecting the **GenerateCardsGeometry** node. - Click **Evaluate Dataflow Graph** and preview the combined geometry in the **Simulation Viewport**. - Check for any intersections between the low-resolution **Coverage** layer and the **Mid** **Layer**. If intersections occur, you might need to increase the **Num Triangles** for the **Coverage** layer. [image: A preview of the Mid Layer with these settings.] - **Top Layer**: - Set **Num Clumps** to 500. - Set **Num Triangles** to 25000. - Set **Num Textures** to 60. [image: A preview of the Top Layer with these settings.] - **Flyaways**: - Check in the **Construction Viewport** for the amount of splines in this card group, in this case 371 splines. [image: The Construction Viewport, showing 371 splines for the Flyaways layer] - Set **Num Flyaways** to 371. This way, the tool creates one card per strand. This will ignore the **Num Clumps** parameter. - Set **Num Triangles** to 10000. - Set **Num Textures** to 25, as the shape of the flyaways will be in geometry and not textures. The textures for this card group will be straight hairs and can be shared amongst the generated cards. [image: A preview of the Flyaways layer with these settings] - **Short Hairs**: - Set **Num Clumps** to 500. - Set **Num Triangles** to 10000. - Set **Num Textures** to 75. [image: A preview of the Short Hairs layer with these settings]

- Click **Evaluate Dataflow Graph** to generate the geometry and textures, then preview the result in the **Simulation Viewport**.

[image: The resulting hair cards shown in the Simulation Viewport]

## Create LODs in Dataflow

Dataflow includes the following options for creating LODs (layers of detail):

- **Reduce Cards from Previous LOD**, which will reduce the tricount of each card in the previous LOD while retaining the overall hair card count, as well as the texture

- Generate a new mesh with less triangles and a new set of texture islands that share the same texture atlas as the previous LODs

### Create LODs Using Reduce Cards From Previous LOD

To create LODs using Reduce Cards from Previous LOD, follow these steps:

- In the **Dataflow Graph** section, select the **BuildCardSettings** node.

- In the **Node Details** panel, click the **+** icon next to **Generation Settings** to add an element.

- Copy the settings from the first element (**Index [0]**) by right-clicking and selecting **Copy**.

- Rick-click the new element (**Index [1]**) and click **Paste**. [image: Click Paste]

- For the new element, set **LODindex** to 1.

- Set Filter Name to "Coverage LOD1".

- Adjust the **Num Triangles** and** Num Flyaways** in each filter to meet the requirements for the new LOD. In this case, set **Num Triangles** to 1000, which is a 50% reduction from LOD0’s 2000 triangles. Set **Num Flyaways** to 0. [image: Num Triangles set to 1000 and Num Flyaways set to 0]

- In the **Advanced Options** for the **Coverage LOD1** element, enable **Reduce Cards from Previous LOD**. This will reuse textures from the first LOD element while reducing the triangle count for the current LOD element.

- Click **Evaluate Dataflow Graph** to generate the newly created **Coverage LOD1**. This will also regenerate the original LOD element, since all elements in a filter are generated simultaneously.

### Generate a New Mesh and Texture Islands

To create LODs by generating a new mesh and texture islands, follow these steps:

- In the **Advanced Options** for the first element (Index [0]) under **Generation Settings**, set the **Reserve Texture Space LOD** to the amount of available space in the texture atlas that you wish to reserve for future LODs. [image: Reserve Texture Space LOD set to 50] Since the texture atlas is empty on this first element, all space is currently available, meaning the following: - If you set **Reserve Texture Space LOD** to 50, then 50% of the texture atlas will be empty and reserved to higher LODs, meaning that your first LOD element would occupy 50% of the texture atlas. - If you set **Reserve Texture Space LOD** to 75, then 75% of the texture atlas will be empty and reserved to higher LODs, meaning that the first LOD element would occupy 25% of the texture atlas.

- With the **BuildCardSettings** node selected, click the **+** icon next to Generation Settings to add a new element.

- Copy the settings from the first element (Index [0]) by right-clicking the element and selecting Copy.

- Right-click the new element (Index [1]) and click Paste.

- For the new element, set **LODIndex** to 1.

- Set **Filter Name** to "Coverage LOD1".

- Adjust **Num Clumps**, **Num Flyaways**, **Num Triangles**, and **Num Textures** in each filter to meet the requirements for the new LOD element. In this case, set **Num Clumps** to 25, set **Num Flyaways **to 0, **Num Triangles** to 1000, and **Num Textures** to 20. [image: set Num Clumps to 25, set Num Flyaways to 0, Num Triangles to 1000, and Num Textures to 20]

- In the **Advanced Options** for the **Coverage LOD1** element, set the **Reserve Texture Space LOD **to the amount of available space in the texture atlas that you wish to reserve for future LODs. [image: Reserve Texture Space LOD set to 50] Since the texture atlas is now 50% occupied by the first LOD element, 50% of the texture atlas is currently available, meaning the following: - If you set **Reserve Texture Space LOD** to 50, 25% of the texture atlas will be empty and reserved to higher LODs, meaning **Coverage LOD1** would occupy 25% of the texture atlas. - If you set **Reserve Texture Space LOD** to 25, 12.5% of the texture atlas will be empty and reserved to higher LODs, meaning **Coverage LOD1** would occupy 37.5% of the texture atlas. - If you set **Reserve Texture Space LOD** to 0, 0% of the texture atlas will be empty and reserved to higher LODs, meaning your **Coverage LOD1** would occupy 50% of the texture atlas.

- Click Evaluate Dataflow Graph to generate **Coverage LOD1**. This will also regenerate the first LOD element, since all elements in a filter are generated simultaneously.

As another example of reserving texture space, here’s the coverage texture for **Beard_L_Full**. The LODs were created by generating a new mesh and texture islands for each LOD, while sharing the same texture atlas. The settings for R**eserve Texture Space LOD** for each LOD looked like this:

- **LOD0**: 75

- **LOD1**: 50

- **LOD2**: 25

- **LOD3**: 0

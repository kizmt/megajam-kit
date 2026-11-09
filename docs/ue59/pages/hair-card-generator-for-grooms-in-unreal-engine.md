# Hair Card Generator

https://dev.epicgames.com/documentation/en-us/unreal-engine/hair-card-generator-for-grooms-in-unreal-engine?application_version=5.9

> Overview of using the hair card generator plugin to create card grooms.

[image: Hair Card Generator]

Learn to use this **Experimental** feature, but use caution when shipping with it.

To divide a groom asset into hair cards, you can use the **Hair Card Generator** plugin with the Dataflow Graph (-> dataflow-graph) system. Each stage of the card generation process is represented as a node in the Dataflow graph. Whenever you make changes to the nodes in Dataflow, you can preview the results in the editor before generating the final cards.

[image: A screenshot of the groom asset, a screenshot of the generated hair cards, and a screenshot of a dataflow graph that generates hair cards.] A groom asset (left), the groom asset divided into hair cards (right), and the hair card generator graph in Dataflow (bottom).

## Glossary

The following terminology is used in this document and the **Hair Card Generator** tool:

- **Hair Card**: A single rectangular geometry strip with a hair strand texture applied to it.
- **Multi-Card Clumps**: Multiple cards (3) per strand clump to give the appearance of volume.
- **Strand Clump**: A collection of hair strands that converge, creating a distinct volume in the groom.
- **Card Group**: A collection of strands in a groom stored in the **groom_group_cards_id** attribute. Card groups are set up and exported from DCC (Digital Content Creation software) in an Alembic file.
- **Groom Group**: A collection of strands in a groom stored in the **groom_group_id** attribute, used to enable different physics settings for different parts of a groom. Groom groups are set up and exported from DCC in an alembic file.
- **Element**: Used to store unique parameter settings for various parts of the groom or for Levels of Detail (LODs), where each LOD is created in a separate element. Elements are stored in the BuildCardSettings node.
- **Filter**: Used to store unique parameter settings for card groups. Filters are stored in elements.
- **DCC**: Digital Content Creation software, such as Maya or Houdini.
- **Texture Island**: The texture within a single UV shell on a texture atlas.
- **Texture Atlas**: A collection of texture islands that is used by the groom asset to apply textures to the hair cards.

## Enable Dataflow and the Hair Card Generator Plugin

To enable Dataflow and the Hair Card Generator plugin, follow these steps:

- Go to **Edit** > **Plugins**.
- Search for "dataflow".
- Enable the **Editor Dataflow Graph** and **Geometry Dataflow** plugins. [image: the Editor Dataflow Graph and Geometry Dataflow plugins]
- Search for "hair card" and enable the **Hair Card Generator** plugin.[image: the Hair Card Generator plugin]

## Set Up Hair Card Generator for a Groom Asset

To set up a hair card generator for a groom asset, follow these steps:

- In the **Content Browser**, right-click a groom asset and select **Create Dataflow Asset**.[image: Create Dataflow Asset]
- In the **Select a Groom Dataflow Template** pop-up window, click **Cards**. The template you choose will automatically create the nodes required for the operation inside Dataflow.

When a Dataflow asset is connected to a groom asset, the groom asset interface updates to show the Dataflow integration. The original groom asset functionalities remain accessible under the **Asset Details** panel.

## Using the Groom Asset Interface with Dataflow

[image: The groom asset interface]

The updated interface includes the following key components:

- **Construction Viewport**: Displays the results of the operations conducted in the graph **Dataflow** graph.
- **Simulation Viewport**: Displays the groom asset as defined in **Asset Details**.
- **Asset Details**: Contains all parameters pertaining to the groom asset. You can toggle between strand or card display based on the **LOD - Geometry Type** setting.
- **Dataflow Graph**: Displays the node tree that generates the hair cards.
- **Node Details**: Displays the properties of the selected node.

[image: The automatically-generated node tree in the Dataflow Graph] The automatically-generated node tree in the Dataflow Graph

The automatically-generated node tree in the Dataflow graph includes the following nodes:

- **GetGroomAsset**: Imports the groom asset into the Dataflow graph.
- **GroomAssetToCollection**: Converts the groom asset into a collection for card generation.
- **BuildCardSettings**: Configures settings for card generation.
- **GenerateCardsTextures:** Displays card groups and the number of strands per group in the **Construction Viewport**.
- **GenerateCardsClumps**: Generates clumps to identify similar hair groups across the asset. Higher clump values increase the detail in the hair card asset. When the node is selected, clumps are displayed in the **Construction Viewport**.
- **GenerateCardsGeometry**: Generates the hair card geometry and displays it in the Construction Viewport.
- **GenerateCardsTextures**: Creates textures for hair cards and displays them in the Construction Viewport using different colors. Brighter colors represent source textures applied to the darker-colored cards.
- **CardAssetTerminal**: Finalizes and saves the generated geometry and textures.

## Using the Scene Outliner

[image: The scene outlier]

Selecting the **GenerateCardsClumps** node displays the resulting clumps in the **Scene Outliner**. If the groom asset includes multiple filters, clumps are organized under their respective filters, and can be viewed separately by filter in the **Construction Viewport**.

[image: Selecting a single card under its parent texture] Selecting a single card under its parent texture

When the **GenerateCardsTextures** node is selected, you can select a single card under their parent texture in the **Construction Viewport**. The parent texture, displayed in a brighter color, can have multiple cards parented to it.

## Configure Hair Card Generation

[image: The BuildCardSettings node]

All parameters for generating hair cards are managed in the **BuildCardSettings** node. Selecting this node displays the asset’s hair card groups (created in your DCC) and their respective spline counts in the **Construction Viewport**.

To configure hair card generation settings for a groom asset, follow these steps:

- In the **Dataflow Graph**, click the **BuildCardSettings** node.
- In the **Node Details** panel, click the **+** icon next to **Generation Settings** to add an element. Each element corresponds to a set of generation settings, such as for different LODs.
- You can adjust the following parameters for each element:**LOD Index**: Specifies the output LOD for card generation.
- **Group Index**: Defines which **Groom Group ID** the LOD will be assigned to.
- **Filter Settings**: Contains parameters for card, clump, and texture generation.
- **Advanced Options**: Includes settings like texture atlas size or options to reduce cards from the previous LOD.

For each element in the Generation Settings array, you can create a filter and adjust the number of clumps and triangles. After adjusting these settings, you can generate the hair cards.

### Create a Filter

To create a filter for a hair card, follow these steps:

- Click the **+** icon next to **Filter Settings** to create a filter. By default, one filter is created per card group to allow customized settings. If no card group is assigned, the filter settings apply to all strands in the groom.[image: The filter settings]Each filter includes the following settings:**Filter Name**: The name of the filter.
- **Num Clumps**: The number of multi-card clumps that the filter creates. A multi-card clump is a group of three hair cards that represent a volume of hair.
- **Num Flyaways**: The number of flyaways that the filter creates. A flyaway is a card with a single strand projected on it, used for details. For example, if you set Num Flyaways to 10, the filter will create 10 flyaway cards for the strands.
- **Num Triangles**: The number of triangles that will be distributed across all cards in this filter.
- **Num Textures**: The number of unique texture islands generated for all cards in this filter. These texture islands will be source textures used by multiple cards and can be displayed using the **Outliner**.
- **Card Groups**: A groups of strands in your groom that you can define in your DCC. For example, a card group can be the short hairs along the groom’s hairline, or groom layers (blockout layer, mid layer, top layer, flyaways).
- **Advanced Options**: Optional settings for adaptive subdivision, strand width, multi-card clumps, and texture compression. In most cases, we recommend using the default value for these parameters.**Adaptive Subdivision**: Automatically adjusts the amount of subdivisions for a card based on its curvature. Useful for optimizing the geometry while retaining detail.
- Max Vertical Segments: Sets the maximum number of subdivisions per card. This parameter is ignored if **Adaptive Subdivision** is enabled. This is useful if you need a specific amount of subdivision per card. For example, if you have a buzzcut where each card should have exactly two triangles per card, set **Max Vertical Segments** to 2.
- **Strand Width**: Used to scale the strands’ width in the texture. A Strand Width of 1 mimics the groom asset, and a higher number increases the width of each hair in the texture.
- **Multi-Card Clumps**: Generates three cards per strand clump to give the appearance of volume.
- **Texture Compression**: Compresses the texture along strand direction to save texture space.

- Click the **+** icon next to **Card Groups** to define card groups for the filter.[image: the + icon next to Card Groups]The number set in the filter’s **Card Group** corresponds to the number of the hair card group seen in the construction viewport. For example, by setting the filter to 3 for this groom, the filter will generate hair cards and textures only for the strands in **Card Group 3**.[image: Setting the filter's Card Group to 3]

### Adjusting Clumps and Triangles

The quality of the hair card asset depends on balancing the **Num Clumps** and** Num Triangles** settings. First, the Dataflow workflow determines the tricount, as the tricount may be a prerequisite for the asset. Then, the workflow distributes the triangles between the card groups based on each card's strand count and coverage.

You can test different clump values to refine the result, where a higher number of clumps generates more cards that are less wide, and a smaller number of clumps generates fewer, wider cards. If the cards look jagged, increase the number of triangles.

To preview clumps, select the **GenerateCardsClumps** node. To preview the triangle geometry, select the **GenerateCardsGeometry** node.

### Generate Hair Cards

After adjusting the generation settings, you can evaluate the Dataflow graph and generate the hair cards.

To generate hair cards, follow these steps:

- Click **Evaluate Dataflow Graph** to generate the hair card asset.
- In** Asset Details**, set **LOD - Geometry Type** to **Cards**.[image: The Geometry Type setting]
- In the **Simulation Viewport**, preview the final card generation with textures.

- rendering
- experimental
- physics
- hair
- metahumans
- grooms

On this page

- Glossary (-> hair-card-generator-for-grooms-in-unreal-engine)
- Enable Dataflow and the Hair Card Generator Plugin (-> hair-card-generator-for-grooms-in-unreal-engine)
- Set Up Hair Card Generator for a Groom Asset (-> hair-card-generator-for-grooms-in-unreal-engine)
- Using the Groom Asset Interface with Dataflow (-> hair-card-generator-for-grooms-in-unreal-engine)
- Using the Scene Outliner (-> hair-card-generator-for-grooms-in-unreal-engine)
- Configure Hair Card Generation (-> hair-card-generator-for-grooms-in-unreal-engine)
- Create a Filter (-> hair-card-generator-for-grooms-in-unreal-engine)
- Adjusting Clumps and Triangles (-> hair-card-generator-for-grooms-in-unreal-engine)
- Generate Hair Cards (-> hair-card-generator-for-grooms-in-unreal-engine)

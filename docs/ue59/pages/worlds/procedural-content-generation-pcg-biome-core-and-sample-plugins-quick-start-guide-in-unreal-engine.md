# PCG Biome Quick Start

https://dev.epicgames.com/documentation/en-us/unreal-engine/procedural-content-generation-pcg-biome-core-and-sample-plugins-quick-start-guide-in-unreal-engine?application_version=5.9

> Learn how to use the PCG framework with the PCG Biome Core and Sample Plugins.

[image: PCG Biome Quick Start]

Learn to use this **Experimental** feature, but use caution when shipping with it.

The PCG Biome Core and Sample Plugins are examples of how to use the PCG Framework with features like Attribute Set Tables, Feedback loops, Recursive Sub-graphs and Runtime Hierarchical Generation.

This quick start guide explains how to use the biome creation tool from scratch, followed by instructions on how to add new biomes and assets.

## Requirements

This section covers the requirements and steps required to get the PCG Biome Core working in a world.

## Enabling Plugins

The PCG Biome Core and PCG Biome Sample are two distinct plugins:

- **PCG Biome Core**: A standalone plugin that contains only what is required for the biome creation tool to work. This plugin has a dependency on the **PCG Framework** and **PCG Geometry Script Interop** plugins.
- **PCG Biome Sample**: A content example showcasing the biome creation tool, which can be enabled in any project. This plugin has a dependency on the **PCG Biome Core** plugin.

To enable the plugins, open the Plugins settings. Enable **PCG Biome Core** to access the tool, and enable the **PCG Biome Sample** to access the content example. For more information on enabling plugins, see Working with Plugins.

[image: The PCG Biome Core and PCG Biome Sample plugins in the Plugin settings.]

## Resources

To access all the content related to both the PCG Biome Core and Sample plugins, the **Show Engine Content** and **Show Plugin Content** content browser settings must be enabled. Open the **Settings** menu in the **Content Browser** and click the checkbox next to both options.

[image: The Show Engine Content and Show Plugin Content checkboxes.]

[image: The PCG Biome Core and Sample plugin content visible in the Content Browser.]

Content Browser paths:

- `/All/EngineData/Plugins/PCGBiomeCore`
- `/All/EngineData/Plugins/PCGBiomeSample`

Disk paths:

- `..\Engine\Plugins\Experimental\PCGBiomeCore\`
- `..\Engine\Plugins\Experimental\PCGBiomeSample\`

## PCG Biome Core Content

All the base blueprint classes are located in the following folder: `/All/EngineData/Plugins/PCGBiomeCore/Blueprints`

[image: The Blueprints folder.]

The **BP_PCGBiomeCore** is the main blueprint class. It is pre-configured with a PCG component that refers to the Biome Core PCG graph and holds a box collision component as its volume.

The Biome Core PCG graph located at the plugin's root is the source and main graph to execute all logic for the Biome Core to work. It contains multiple subgraphs with their own nested subgraphs. All of these separate subgraphs are stored under the `Core` folder.

The Biome Core graph is located at the following path: `/Script/PCG.PCGGraph'/PCGBiomeCore/BiomeCore.BiomeCore'`

The tool relies on multiple data assets made from pre-made classes with specific structures to generate content. These assets are **BiomeDefinitions**, **BiomeAssets** and **BiomeGenerators**. They are located in their respective folders and `../Setup` sub-folders. The default assets of each type are also available for testing and debugging.

### PCG Biome Sample Content

The **BiomeSampleLevel** world is located in the following folder: `/All/EngineData/Plugins/PCGBiomeSample/Maps`

[image: The BiomeSampleLevel in the Maps folder.]

The world contains the pre-configured **BP_PCGBiomeCore**, biome textures, volume, and spline actors. Use this as a starting point to learn how to set up the tool and understand it.

The sample contains multiple biomes, generators, and assets as well as custom structures and data assets classes that inherit from the base Biome Core classes. These assets are located in their respective `BiomeSample` folders and `../Setup` sub-folders.

The PCG Biome Sample plugin contains additional data, including a BiomeMap** **texture, a tiled Flow, and a SunExposure texture2Darray, located in the Tiles folder. The Sample plugin also includes example PCG assemblies, meshes, and filter graph instances.

## World Setup

To set up a world and start using the PCG Biome Core, follow these steps:

- Create a new level or open an existing world. The PCG Biome Core works with both World Partitioned and non-partitioned levels.
- Add a new Landscape and set the world scale through the Landscape Editor mode. If you are starting from the Open World template or any existing level with an existing landscape, this step is not required.The presence of a landscape is **optional** when working with the PCG Biome Core.
- Add or drag a **BP_PCGBiomeCore** actor into the level. The provided BP_PCGBiomeCore blueprint class is located in the following folder: `/Script/Engine.Blueprint'/PCGBiomeCore/Blueprints/BP_PCGBiomeCore.BP_PCGBiomeCore'`
- Adjust the BP_PCGBiomeCore actor's **Volume** component scale to change the world coverage. The tool uses this volume to constrain its generation and output.

The next section explains how to place a Biome actor that generates and spawns assets in the Biome Core volume.

## Biomes, Generators, and Assets Setup

After the original world setup is done and validated, you can create a new biome with its definition and assets.

To create a new biome, add or drag a new **BP_PCGBiomeVolume** or **BP_PCGBiomeSpline** actor into the world. The actor must be added within the Biome Core actor volume, and must be overlapping the landscape surface.

The blueprint classes are available in the following folders:

- `/Script/Engine.Blueprint'/PCGBiomeCore/Blueprints/BP_PCGBiomeVolume.BP_PCGBiomeVolume'`
- `/Script/Engine.Blueprint'/PCGBiomeCore/Blueprints/BP_PCGBiomeSpline.BP_PCGBiomeSpline'`

[image: The volume and spline Blueprint classes.]

Next, you need to create a set of data assets for the biome definition, generators, and assets. Data assets can be added from the Content Browser, from the right-click menu, or by duplicating existing assets of the same class.

In Unreal Engine 5.6 and later, biome actors support local biome assets and a local default biome definition that is saved in the actor directly. This removes the need for separate data assets for biome definitions and biome assets. Having separate assets is still supported, and can be used for sharing and maintenance when working with multiple levels or instances.

### Set the Biome Definition

To set the Biome definition, open the **BP_PCGBiomeVolume** asset and set the **BiomeName**, **BiomeColor**, and **BiomePriority** properties. This sets the default definition for the biome.

[image: The default definition for a Biome volume asset.]

Optionally, you can overwrite the default definition by creating a separate data asset, following these steps:

- Add a data asset of class **BiomeDefinitionTemplate** to the project’s content folder.
- Open the data asset and set the **BiomeName**, **BiomeColor**, and **BiomePriority** properties.
- Open the **BP_PCGBiomeVolume** asset and set the **Definition **property to refer to the definition data asset you created in step 1. This overwrites the default definition of the volume asset.

The definition asset can be shared and re-used in multiple biome volumes, splines, and worlds.

For more information about biome definitions, see Biome Definition (-> procedural-content-generation-pcg-biome-core-and-sample-plugins-reference-guide-in-unreal-engine).

### Create a Biome Generator

To create a biome generator, add a new data asset of class **BiomeGeneratorTemplate** in the project’s content folder, and set its **GeneratorType**, **GeneratorPriority**, and **GeneratorGraph** properties.

[image: The properties of a Biome generator.]

These properties define your generator. The generator asset can and should be shared and re-used in multiple assets, as it provides the initial point data from a linked **GeneratorGraph** on which to assign and spawn assets.

The **GeneratorGraph** is a PCG graph or PCG graph instance, which creates and outputs point data created by sampling the world through world ray hit or raycasts.

To set the **GeneratorGraph** property, create a new PCG graph using the **TPL_BiomeCore_Generator** template, or copy it from the following folder:

`/Script/PCG.PCGGraph'/PCGBiomeCore/GraphTemplates/TPL_BiomeCore_Generator.TPL_BiomeCore_Generator'`

[image: The generator graph template.]

For more information about Biome generators, see Biome Generator (-> procedural-content-generation-pcg-biome-core-and-sample-plugins-reference-guide-in-unreal-engine).

### Create a Biome Asset

To create a Biome asset, open the **BP_PCGBiomeVolume** asset and add an entry to the **Local Assets** array property. Set the asset's **Generator** property, a mandatory reference to the biome generator data asset created above, and set the **Mesh** property, a reference to the visual to spawn.

Optionally, you can create and add a separate data asset, following these steps:

- Add a new separate data asset of class **BiomeAssetTemplate** in the project’s content folder.
- Open the data asset.
- Add an entry to the **Biome Assets** array property and set its **Generator** and **Mesh** properties.
- Open the **BP_PCGBiomeVolume** asset.
- Refer to the data asset as a new entry to the **Assets** array property.

All local assets and assets references are combined together when generating the local biome.

In the data asset, the **Biome Assets** array is the collection of assets to process and spawn. Each entry contains multiple properties to configure. Assets sharing the same generator reference use the same point data to spawn on and will be distributed randomly onto the generated points according to their weight value. The biome assets can be shared and re-used easily across any biomes.

[image: The Generator and Mesh properties in a Biome Assets array entry.]

For more information about biome assets, see Biome Assets (-> procedural-content-generation-pcg-biome-core-and-sample-plugins-reference-guide-in-unreal-engine).

### Biome Generation

After setting up a biome definition, biome generator, and biome asset, an automatic refresh occurs. A new biome is created by spawning the defined assets constrained within the BP_PCGBiomeVolume and the Biome Core volume.

You can now extend the biome with more generators and assets. Any number of biomes can be created using the same process and exist in the same world or across multiple worlds. See the **BiomeSampleLevel** in the **PCGBiomeSample** plugin for a complete setup.

For reference, in the following image, a biome volume actor has been configured with multiple assets referencing and sharing only 2 custom generators, one for trees and one for rocks.

[image: Screenshot of a single biome filled with rocks and trees.]

In the following example, several biome spline actors with their respective assets and priorities are overlapping and fades out using a 64m blending range.

[image: Screenshot of five overlapping biomes filled with various levels of trees and rocks.]

- landscape
- experimental
- building virtual worlds
- procedural generation

On this page

- Requirements (-> procedural-content-generation-pcg-biome-core-and-sample-plugins-quick-start-guide-in-unreal-engine)
- Enabling Plugins (-> procedural-content-generation-pcg-biome-core-and-sample-plugins-quick-start-guide-in-unreal-engine)
- Resources (-> procedural-content-generation-pcg-biome-core-and-sample-plugins-quick-start-guide-in-unreal-engine)
- PCG Biome Core Content (-> procedural-content-generation-pcg-biome-core-and-sample-plugins-quick-start-guide-in-unreal-engine)
- PCG Biome Sample Content (-> procedural-content-generation-pcg-biome-core-and-sample-plugins-quick-start-guide-in-unreal-engine)
- World Setup (-> procedural-content-generation-pcg-biome-core-and-sample-plugins-quick-start-guide-in-unreal-engine)
- Biomes, Generators, and Assets Setup (-> procedural-content-generation-pcg-biome-core-and-sample-plugins-quick-start-guide-in-unreal-engine)
- Set the Biome Definition (-> procedural-content-generation-pcg-biome-core-and-sample-plugins-quick-start-guide-in-unreal-engine)
- Create a Biome Generator (-> procedural-content-generation-pcg-biome-core-and-sample-plugins-quick-start-guide-in-unreal-engine)
- Create a Biome Asset (-> procedural-content-generation-pcg-biome-core-and-sample-plugins-quick-start-guide-in-unreal-engine)
- Biome Generation (-> procedural-content-generation-pcg-biome-core-and-sample-plugins-quick-start-guide-in-unreal-engine)

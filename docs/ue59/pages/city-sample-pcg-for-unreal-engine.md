# City Sample PCG

https://dev.epicgames.com/documentation/en-us/unreal-engine/city-sample-pcg-for-unreal-engine?application_version=5.9

> An overview of the features used to create the City Sample PCG learning example.

## Introduction

The City Sample PCG demo is a re-imagining of the original City Sample demo. Its plugin contains all the PCG graphs and assets required to recreate the city sample using the PCG tools. The original city sample delivered with Unreal Engine 5.0 was produced with Houdini; the PCG version, by contrast, relies exclusively on internal Unreal Engine systems. You can now generate this city entirely within PCG without any external software, which provides a fully independent, procedural, and infinitely regenerable workflow.

This procedural city is designed for full compatibility with the Unreal MCP server. We used the MCP server for Unreal Engine to assist in the city’s development and creation and fully leverages the PCG Primitive plugin. For more information on developing with PCG and MCP, see Working with PCG and LLMs Using Unreal MCP (-> working-with-pcg-and-llms-using-unreal-mcp-in-unreal-engine).

### Key Features

- A large procedural city within a world-partitioned level, which replicates the procedural configuration we used to construct the original City Sample. In contrast to the original city, this version incorporates uneven terrain, curved roads and sidewalks, and realistic leafy vegetation and forests.

- Multiple PCG graph examples designed to demonstrate the procedural recreation of a city, which can also serve as baseline references for the MCP server.

- Five distinct species of Megaplant trees used to generate vegetation throughout the procedural city.

- An extensive list of PCG assembly data assets, which offer ready-to-use configurations of static meshes for rooftop plazas and piers.

- Several shape grammar definition assets for buildings and roads, giving you a way to construct assets based on selected profile presets.

- An additional PCG primitive subgraph specifically engineered to construct the buildings for the City Sample project (`Assign_CitySample_Buildings`).

We featured the City Sample PCG demo plugin in the State of Unreal 2026 in Chicago, to illustrate the new MCP server functionality.

The demo plugin is also the main subject of our technical talk From Words to Worlds: Integrating MCP into the Unreal Editor at Unreal Fest Chicago 2026.

> **tip:** **Using Nanite Foliage**
> By default when loading the demo plugin, the black alder trees from Quixel are featured in the different levels and the PCG graph. You can instead use Megaplants trees using Nanite foliage. If you want to use the Megaplants trees, you need to enable the options in the respective PCG graph and enable Nanite foliage at the project level in the project settings.
> All the screenshots in this documentation feature the Megaplants trees.
> [image: Enable Nanite foliage]

## PCG Primitives

The PCG Primitive plugin provides a comprehensive collection of ready-to-use subgraphs, actions, and examples that extend the capabilities of the Procedural Content Generation (PCG) framework. We engineered this specialized toolbox to interface seamlessly with a Model Context Protocol (MCP) server and a Large Language Model (LLM) to streamline the adoption and understanding of PCG workflows. The plugin is also highly beneficial for standard standalone use by any PCG developer. The City Sample PCG implementation uses the capabilities of this new plugin extensively.

You can find the content of the plugin in the following directory: `/PCGPrimitives/Primitives`

Some examples of the available functionality include:

- Shape creation

- Spatial subdivision

- Spline management and procedural manipulation

- Polygon management and optimization

- Complex asset spawning

[image: Some of the PCG primitives.]

## PCG Examples

The PCG Primitive plugin includes a comprehensive suite of examples demonstrating the use of primitives within world-building contexts. You can find these assets in the following directory: `/PCGPrimitives/Examples`

### City Examples 

The specific CitySamplePCG_plugin offers an additional set of examples tailored to urban environments using the City Sample assets. These examples clarify the methodologies for city construction using PCG.

The example folder contains: **City_Circular_1km_2_arteries**

`/CitySamplePCG/Examples/City/City_Circular_1km_2_arteries.City_Circular_1km_2_arteries`

[image: A PCG graph city example.]

This foundational PCG graph establishes the core principles of procedural city generation:

- Define a closed boundary shape and divide it using major arterial routes.

- Subdivide the zones further to establish districts, sub-districts, and grid blocks.

- Generate the road network using the resulting subdivision splines.

- Allocate the final subdivided areas for lot construction and building footprints.

- Reserve designated zones for alternative public spaces, such as parks or plazas.

The remaining PCG graphs in the City directory function as variants or components derived from this primary baseline example :

- The **CitySample_generator_steps** level demonstrates the construction of the same urban environment through a sequence of interdependent PCG graphs. - Rather than consolidating all processes into a single, complex graph, each stage is structured sequentially. This methodology means technical artists can isolate and iterate on specific execution phases and their direct dependencies. - Consequently, this approach provides a highly efficient means of managing technical complexity, preventing graphs from becoming overly resource-intensive while enabling intricate logic branching and functional interdependence between city components.

- The **City_Circular_1km_2_arteries_slopes** level is a specialized variant that illustrates the technique for projecting the city layout onto uneven mesh terrain to ensure proper structural alignment.

#### The Edits Folder

The Edits folder contains minor variations of the primary **City_Circular_1km_2_arteries** graph. We made deliberate modifications to these assets that allow the MCP server to evaluate graph changes against explicit structural prompts. You can review the designated prompt within the graph description field and inspect the pipeline layout to verify the expected differences.

- This system serves as an effective framework for calibrating Large Language Models (LLMs) on the modification of intricate PCG graphs within procedural city building pipelines.

- For scenarios involving LLM-driven graph modifications based on complex prompting, this structural organization—combining a dedicated edits folder with descriptive prompts embedded in the graph metadata—presents an optimal reference architecture.

- Each variation maintains the identical base naming convention of the source graph it modifies. For example: - **City_Circular_1km_2_arteries > City_Circular_1km_2_arteries_Half_Forest** - **Prompt**: Make half the sub-districts spawn trees instead of being subdivided for building.

### Other Examples

The other folders (building, parking lot, plaza) feature more PCG graphs demonstrating how to procedurally build those types of structures within the city.

[image: More PCG graph examples demonstrating a building, a parking lot, and a plaza.]

## The Main City Sample PCG Demo Level 

[image: The main City Sample PCG demo level.]

This level contains a city procedurally built with PCG, equivalent in complexity to the City Sample `Big_City_LVL` level. This is a deeper and more advanced PCG example intended to demonstrate how to produce a large open world urban environment only using PCG.

We built it out of 18 interdependent PCG graphs meant to be run in a specific order. It features two hand-placed landmarks:

- A main tower, used as a hero building and the tallest tower in the city

- A quarter scale reproduction of Central Park.

It is surrounded by a lush and leafy forest, and is built onto unlevel terrain modeled procedurally using Mesh terrain and the PCG workflow. It features complex curved roads and arteries organized in 3 categories:

- Arteries

- Collector

- Local

The map also features three categories of districts:

- Small

- Medium

- Large

When compared to the original `Big_City_LVL` level, it does not include the mass AI setup necessary to run traffic and pedestrians through its roads. It also does not feature any traffic light system. This sample is meant to demonstrate PCG building and actor management only. The base game mode makes it possible for you to walk and fly through the city but we did not set it up to be a playable experience like the original `Big_City_LVL`.

### Pausing Procedural Generation 

The City Sample PCG demo features a complex PCG graph dependency network. Although city generation is efficient and capable of completely regenerating within a few minutes, we strongly recommend pausing the PCG process when iterating or conducting experiments within the graph. This prevents the full generation sequence from triggering with every individual modification. To do this, enable the PCG pause button in the Editor Preferences panel, then use the PCG pause button to suspend procedural generation during graph development.

[image: Enabling and using the PCG pause button.]

#### Debug Mode

Several PCG graphs have a debug mode, particularly the most resource-intensive ones such as roads, lots, and buildings. This mode gives you a way to view simplified shapes and iterate exclusively on the layout of the city, which increases iteration speed.

[image: PCG graph debug mode.]

### Start Fresh 

To familiarize yourself with the generation process, you can use the Cleanup All PCG components function to regenerate the scene and start fresh. You can find it in the menu at Tools > PCG framework > Cleanup All PCG components.

You can then start generating PCGs, following their order in the level outliner.

[image: Cleanup all PCG components to start fresh.]

### Building Steps Description

To regenerate the level, you need to work with the sample's splines and PCG graphs.

#### Splines

[image: City Sample PCG splines.]

The Spline Guides folder contains the actors with spline components you need to shape the city.  You can edit all the splines, and adjust how the city looks.

- **The terrain shaping**: Defines the shape of the island where your city will live. It modifies the mesh terrain to create an island using a 3 km by 3 km mesh terrain.

- **The city shape**: Defines the boundaries of your city.

- **The arteries**: Creates the main roads that define the main districts.

- **The highways** : Places two elevated one-way highways that cross and surround the city, connecting to the rest of the world.

- **The high rise zone** : The limited area where buildings can grow higher, creating business districts. The example features two different zones.

#### PCG graphs 

There are 18 PCG graphs that create the procedural city. When iterating on these graphs, you can adjust several different parameters including:

- The street width

- The block size

- The amount of vegetation

- The building height

- The amount of parking

Every individual aspect of the city is fully parametric and customizable.

Because this procedural framework is built upon a foundational spline, each phase of urban generation relies strictly on the outcomes of previous stages. When modifying any city parameters, you must adhere closely to the sequence defined by the dependency graph.

The naming convention of the PCG graphs reflects the sequence required for their generation. Modifying a graph with a lower numerical designation automatically initiates a rebuild of all subsequent graphs. For example, altering the overall shape of the city impactfully resets the entire generation process due to its foundational nature. Conversely, adjusting parameters within the ground PCG graph yields a more localized effect, only influencing elements generated afterward, such as leftover lots and parking.

Below is a basic representation of the dependency graph of the City sample PCG demo:

[image: City Sample PCG dependency flow.]

##### PCG_1_1_Terrain 

This PCG graph procedurally shapes the mesh terrain (-> mesh-terrain-in-unreal-engine) to create the island base on which the city will exist. It shapes the island using the TerrainShaping spline.

[image: PCG_1_1_Terrain graph]

##### PCG_1_2_BG_Buildings

This PCG graph generates the distant background city silhouette visible beyond the playable area, excluding a center zone so it never overlaps the real city.

[image: PCG_1_2_BG_Buildings graph]

##### PCG_1_3_BG_Mountains

This PCG graph spawns distant mountain and cliff silhouettes around the city from a pre-baked PCG data asset.

[image: PCG_1_3_BG_Mountains graph]

##### PCG_2_1_MainTower_Footprint

This PCG graph defines the main hero tower landmark footprint as a parametric hexagonal spline shape. This is consumed by downstream graphs as an exclusion zone.

[image: PCG_2_1_MainTower_Footprint graph]

##### PCG_2_2_CentralPark_Footprint

This PCG graph defines the Central Park boundary as a rectangular spline, at 1:4 scale relative to the real NYC Central Park. Consumed by downstream graphs as an exclusion zone.

[image: PCG_2_2_CentralPark_Footprint graph]

##### PCG_3_1_1_Districts

This PCG graph defines the main city layout. It consumes the city shape and the arteries. It produces districts, sub-districts, city blocks, and the first network of roads. There are several parameters you can use to adjust those districts and blocks.

[image: PCG_3_1_1_Districts graph]

##### PCG_3_1_2_Roads

This PCG graph creates all the roads. It reads the road categories created by the District PCG graph from the district subdivisions. It also solves intersections and assigns shape grammar definitions to create, spawn, and project the roads onto the terrain. The road footprint is used later to create the lots for the buildings. You can adjust road widths for each category. Note

The roads partially level the terrain to ensure smooth slopes. Generating the road PCG graph modifies the terrain and re-triggers anything that uses the terrain as a base.

[image: PCG_3_1_2_Roads graph]

##### PCG_3_1_3_Highways

This PCG graph generates the elevated highways running through the city.

[image: PCG_3_1_3_Highways graph]

##### PCG_3_1_4_Lots

This PCG graph creates the city's lots and building footprints. It consumes the city shape and the road network footprint. You can adjust how many lots are reserved for plazas or vegetation and the different building footprint sizes of the district categories.

[image: PCG_3_1_4_Lots graph]

##### PCG_3_2_1_Ground

This PCG graph spawns the ground assets, including sidewalk and ground tiles.

[image: PCG_3_2_1_Ground graph]

##### PCG_3_2_2_LeftOverLots

This PCG graph populates the leftover space that regular building placement skips, placing plazas and vegetation.

[image: PCG_3_2_2_LeftOverLots graph]

##### PCG_3_2_3_Parkings

This PCG graph creates parking lots from its input footprints.

[image: PCG_3_2_3_Parkings graph]

##### PCG_3_3_1_Buildings

This PCG graph generates the buildings from the three categories defined in PCG_3_1_4_Lots. When iterating on the different building heights or any other parameter you implement, you can use the debug mode for faster iteration.

[image: PCG_3_3_1_Buildings graph]

##### PCG_3_3_2_Rooftops

This PCG graph spawns the rooftop assemblies on top of the buildings generated in the previous step.

[image: PCG_3_3_2_Rooftops graph]

##### PCG_4_1_MainTower_Visuals

This PCG graph generates the hero tower of the City. It consumes the input footprint defined in PCG_2_1_MainTower_Footprint.

[image: PCG_4_1_MainTower_Visuals graph]

##### PCG_4_2_CentralPark_Visuals

This PCG graph generates the Central Park visuals at 1:4 scale. It populates the park footprint with transverse roads, user-drawn walkpaths, a lake with terrain deformation, noise-driven tree and grass scatter, and a CHA building representing the Met museum on the eastern edge.

[image: PCG_4_2_CentralPark_Visuals graph]

##### PCG_5_1_CityEdge

This PCG graph generates pier and warehouse structures along the shore, at the boundary between terrain and water.

[image: PCG_5_1_CityEdge graph]

##### PCG_5_2_OuterForest

This PCG graph scatters a dense and lush forest around the city that fades in size and density as it approaches the water level.

[image: PCG_5_2_OuterForest graph]

### World Partition Mode 

Although the `L_CitySamplePCG_demo` level uses World Partition, level streaming is disabled by default, and actors generated using PCG are not partitioned. Each PCG volume instantiates its assets as individual Instanced Static Mesh components, making each of them one actor only.

While this implementation offers the advantage of rapid generation times and facilitates an efficient, iterative workflow during city design, it is incompatible with streaming configurations and standard World Partition requirements. To ensure you can stream the city properly, you must systematically partition every constituent element.

Every PCG graph is designed to span extensive areas and includes a specific partitioning configuration option. When you enable this setting, the graph generates multiple localized actors across a predefined grid instead of a single object. The dimensions of this grid are governed by the **Partition Grid Size** parameter, which defaults to 128 meters; this ensures that each resulting actor encompasses generated meshes within a square zone measuring 128 meters per side.

The sole exception to this rule is the building PCG graph, which generates one dedicated actor for each individual building structure. Configuring these elements as partitioned actors ensures the PCG framework spawns meshes complete with corresponding collision geometry, establishing a fully functional and playable urban environment.

You must manually enable a specific collision generation checkbox for the building PCG graph, as generating collisions for unique building forms requires the local creation and storage of specialized static meshes to match their arbitrary geometric shapes.

Once fully partitioned and populated, the complete city environment comprises approximately 2,600 individual actors.

> **note:** To fully take advantage of the partitioned actors, you must **enable streaming** in the world settings.

[image: PCG graph partition settings.]

[image: Enable streaming in the World settings.]

After you enable streaming in the World settings, you must manually load the actors using the World Partition editor.

[image: Open the World Partition editor.]

[image: Manually load actors.]

> **note:** To regenerate a given PCG graph, you must ensure all its actors are loaded in the world. Usually that means loading the entire world's actors before iterating on the PCG generation. While iterating on the city shape or PCG generation, we advise disabling streaming temporarily so all actors are always loaded.

## Shape Grammar Definition 

A **Shape Grammar Definition** is a data asset that procedurally arranges modular meshes along a spline (open, closed, or polygon) using a grammar-string language, rather than manual placement. It divides the spline's cross-section into slots (for example, sidewalk, lane, curb), each driven by a rule asset that defines its own modules (mesh and symbol) and a grammar string controlling how those modules repeat, randomize, or prioritize to fill the available space.

This is a built-in PCG framework to streamline the creation of 2 dimensional grammar. Typical uses include roads (lane, curb, or sidewalk cross-sections), building facades (window, wall, or door sequences per floor), and fences or railings — anywhere a repeatable, rule-driven module pattern needs to follow a spline, and needs made into an asset for ease of use. For more information about the semantics of shape-grammar building rules in this documentation from PCG, see Using Shape Grammar With PCG (-> using-shape-grammar-with-pcg-in-unreal-engine).

In a PCG graph, the shape grammar definition is consumed by the `Assign_ShapeGrammarDefinition` primitive, which applies the definition to a spline within a max cross-section size and outputs both spawn points and a 2D footprint, which is reusable as an exclusion zone by other systems.

The sample project features specific shape grammar definitions ready for use in the city, including a sidewalk, a road, and a highway. You can find them in: `/CitySamplePCG/PCG/DataAssets/Roads`

#### MCP Server Interaction with Shape Grammar Definitions

Constructing a shape grammar definition from the ground up requires generating numerous distinct assets, ranging from the core shape grammar definition itself to the individual constituent rules. The process frequently demands extensive fine-tuning of these grammars alongside the manual mapping of dozens of static meshes, ensuring their dimensions and orientations align correctly. Although the Shape Grammar definition framework automates and streamlines much of the PCG graph management process, initial configuration remains complex.

To help, you can integrate a MCP server to enhance the shape grammar authoring workflow. Included with the PCG Primitives plugin is a dedicated Shape Grammar Definition skill designed to guide a LLM through the process of building a shape grammar from scratch. This integration minimizes the manual workload and accelerates overall development.

You can find the shape grammar definition skill asset here:

`/PCGToolset/Skills/Skill_PCGShapeGrammarDefinition.Skill_PCGShapeGrammarDefinition`

For more information on using City Sample PCG with a MCP Server, see City Sample PCG and MCP Server Interaction (-> city-sample-pcg-and-mcp-server-interaction-in-unreal-engine).

#### Shape Grammar Definition Creation Process

The steps below outline the process for creating a shape grammar definition:

- Create a **Rule** asset: A data asset of class `BP_ShapeGrammarRule` (for example, `RULE_MyLane`).

- Add a module to the rule: - In the module's information, reference a static mesh, give it a symbol (for example, "A") - Set the size and mesh forward axis or choose the option “Guess Size” if the bounds of the chosen mesh can be used as the symbol size.

- Set the rule's grammar, for example: - grammar: "A*" repeats module A to fill the slot (see `RULE_Road_Car_Lane`).

- Create the **Shape Grammar Definition** asset: A data asset of class `BP_ShapeGrammarDefinition` (for example, `SGD_MyRoad`).

- Add a slot, and in the slot give it: - A symbol (for example, "C") - A size in cm - Set scalable to true - Reference your **Rule** asset in the shape grammar rules.

- Set the top-level fields: - Main Grammar: "C" - Use Grammar: true - Orientation: horizontal - Spawn on: spline

- Use it in a PCG graph: - Add `Assign_ShapeGrammarDefinition` - Feed it a spline, - Set the **Shape Grammar Definition** to your new asset. - Set the **Size** to the cross-section width.

[image: Splines created with shape grammar definitions.]

[image: Shape grammar rules associated with data assets.]

## Assign City Sample Building Primitive

The City Sample PCG plugin includes an additional primitive we designed for constructing City Sample buildings using PCG. The Assign City Sample Building primitive operates on a principle similar to the shape grammar definition, but tailored to replicate the original shape grammar developed for the City Sample. Rather than using assets as inputs, this primitive reads the entire shape grammar configuration from a dedicated data asset (`CitySamplePCG/PCG/Primitives/Buildings/Subgraphs/LoadCitySampleData`).

This primitive accepts building footprints defined as splines as its input. It extrudes each footprint to a height between the minimum and maximum height parameters, or alternatively reads the height value directly from the built-in `@data.MaxHeight` attribute if it is present in the input data. It constructs the building structure by applying the shape grammar to the extruded geometry, randomly assigning one of the predefined building styles. If the string is not set, the primitive randomly uses all available building styles.

| Building Style Code | Definition |
| --- | --- |
| **CHA** | Chicago early 1900s office building built with medium-sized white concrete blocks and hosting stores on the ground floor. |
| **CHB** | Chicago 1920s office skyscraper built with a base of large, light-colored stone blocks and featuring ornate, Gothic-style entrances on the ground floor. |
| **CHC** | Chicago early 1900s office building built with large, light-colored stone blocks and hosting storefronts next to a grand central entrance. |
| **CHD** | Chicago early 1900s bank building built with large, light-colored stone blocks and featuring ornate entrances on the ground floor and large pillars. |
| **CHE** | Chicago early 1900s commercial building built with a light-colored stone base, hosting stores on the ground floor and topped with a modern glass addition. |
| **CHF** | Chicago 1950s commercial building built with white and green bricks and concrete frame, hosting storefronts on a deeply recessed ground floor. |
| **CHG** | Chicago early 1900s commercial building built with dark stone and red brick with several ornate entrances. |
| **CHH** | Chicago 1970s low-rise commercial building built with precast concrete panels and featuring a continuous row of ground-floor storefronts. |
| **CHI** | Chicago early 1900s office building built with a reddish brick and terra-cotta facade, and featuring large display windows on its ground floor. |
| **CHJ** | Chicago 1970s monolithic office building built with a dark glass curtain wall and featuring several service bays on the ground floor. |
| **NYAA** | New York late 1800s tenement building built with a grey brick ground floor and yellow brick upper stories, and featuring a row of neighborhood storefronts. |
| **NYAB** | New York early 1900s apartment building built with red brick and brownstone, and hosting cafes alongside sunken residential entrances on the ground floor. |
| **NYAC** | New York late 1800s mixed-use tenement building built with a light-colored brick facade, and featuring street-level shops below its high residential stoops. |
| **NYAD** | New York early 1900's apartment building built with medium-sized tan bricks and a red brick base with a street-level entrance. |
| **NYAE** | New York early 1900's apartment building built with medium-sized tan bricks and a red brick base with stores on the ground floor. |
| **NYAF** | New York early 1900's apartment building built with medium-sized tan and red bricks and a concrete base with stores on the ground floor. |
| **NYG** | New York early 1900's office building built with medium-sized white stone blocks and hosting stores on the ground floor. |
| **NYGA** | New York early 1900's office building built with medium-sized white stone blocks and hosting stores on the ground floor. |
| **NYH** | New York late 1800's office building built with medium-sized red bricks and a black stone base with a bank and stores on the ground floor. |
| **QBA** | New York early 1900's hotel built with medium-sized white concrete blocks and hosting stores on the ground floor. |
| **QBAA** | New York early 1900's hotel built with medium-sized white concrete blocks and hosting stores on the ground floor. |
| **SFA** | San Francisco late 1800's hotel built with medium-sized white stone blocks and hosting stores on the ground floor. |
| **SFB** | San Francisco late 1800's government building built with large white stone blocks and not hosting stores on the ground floor. |
| **SFC** | San Francisco 1960's office building built with large white concrete panels and hosting a bank on the ground floor. |
| **SFD** | San Francisco 1970's office building built with large black glass and steel panels and hosting no stores on the ground floor. |
| **SFE** | San Francisco 1980's office building built with large black glass and white stone panels and hosting a bank on the ground floor. |
| **SFJ** | San Francisco early 1900's bank built with large white stone blocks and hosting stores on the ground floor. |

> **note:** To function properly, the primitive needs this subgraph as a second input :
> `/CitySamplePCG/PCG/Primitives/Buildings/Subgraphs/LoadCitySampleData.LoadCitySampleData`
> This is the repository of all the building shape-grammer for the different styles available. It is gathered in one single external subgraph to prevent PCG loading multiple instances of this database whenever you use the primitive several times in a graph.

[image: Examples of some of the building styles.]

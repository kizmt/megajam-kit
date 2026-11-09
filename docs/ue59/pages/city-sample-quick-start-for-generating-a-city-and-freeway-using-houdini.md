# City Sample Quick Start - Generating a City and Freeway using Houdini

https://dev.epicgames.com/documentation/en-us/unreal-engine/city-sample-quick-start-for-generating-a-city-and-freeway-using-houdini?application_version=5.9

> A guide using Houdini with City Sample source files to generate your own procedural city in Unreal Engine.

[image: City Sample Quick Start - Generating a City and Freeway using Houdini]

The City Sample project is a technical demonstration of how you can use procedurally generated data from SideFX's Houdini Engine in Unreal Engine 5 to create a working simulated world. The City Sample uses the data generated from Houdini to populate assets, drive simulations for artificial intelligence, traffic, and audio, and much more.

This guide is part one of a two-part series that walks you through the process of creating your own city with a road network and freeway system in Houdini Engine using Epic-developed tools.

In this guide, you'll learn how to:

- Access the Houdini Source files to create your own city.

- Setup and configure Houdini with the provided source files.

- Setup the basis for your city shape, size, and layout.

- Specify zones and define the silhouette of your city.

- Create a road network that supports a freeway system.

- Generate all the necessary data which can be exported and ready for import into Unreal Engine 5.

## Prerequisites for this Guide

- SideFX Houdini We recommend you use version 18.5.532 since it's the version used to develop the City Sample project.

- You need to run Houdini once to generate the startup files necessary for the Required Houdini Project Setup.

- At least 2 gigabytes (GB) of free hard disk space to extract the data and generate small-sized cities. For bigger cities, you can expect to use from 5 to 10 GB of space.

- Refer to the City Sample Recommended System Specifications (-> city-sample-project-unreal-engine-demonstration).

- Download the City Sample Unreal Engine 5 project through the Epic Games Launcher.

### Additional Notes about this guide

- This guide assumes you have working knowledge of Houdini and using its tools.

- The workflow and files used in this guide work with the Windows 10 operating system. While Unreal Engine and Houdini support Mac and Linux, the workflows and source files have not been tested with those systems and we cannot guarantee they will work as intended.

## Step 1 - Required Houdini Project Setup

Before you can effectively use Houdini to start generating your city, you first need to set up a few things on your computer, including extracting the source files needed to complete this guide. You also need to specify and create some directories used later in this guide to store data for your city.

- In the root directory where your City Sample project is saved, locate the **CitySample_HoudiniFiles.zip** file. It contains the Houdini source files required to complete this guide. [image: Windows Folder Houdini Source Files]

- Create a new folder to save the source files to. For the purposes of this guide, the save location used is `D:\CitySampleSource`. The remainder of this guide assumes you are using a similarly named and placed folder path.

- Extract the content of **CitySample_HoudiniFiles.zip** file to your folder. Once extracted, a folder named **Small_City** is added. The file path should look like `D:\CitySampleSource\Small_City`. [image: Windows Folder Unzip Source Files with folder named Small_City]

- In your Windows system's **Documents** folder located in `C:\Users\{your_user_name}\Documents\houdini18.5`, open the file named **houdini.env** with a text editor. [image: Windows Folder open Houdini Environment File]

- At the bottom of the houdini.env file, add the following new line: ```
     HOUDINI_PATH = D:/CitySampleSource/Small_City/houdini;&
``` HOUDINI_PATH = D:/CitySampleSource/Small_City/houdini;& Your edit should look like: [image: Edit Houdini Environment file] Be sure to replace the file path with the one you used while extracting the Houdini source files. Also, it is important to use forward slashes (/) in the folder path like the example above. Windows defaults to using backslashes ().

- **Save** the **houdini.env** file.

- Start **Houdini**.

Once Houdini starts, when you open the **Asset Manager**, you should see a list of **Sample Houdini Operators**. You can view them from the main menu under **Asset > Asset Manager**. Expand the **Operator Type Libraries > Scanned Asset Library Directories** to view them, they are located at the bottom where you should see a listing of `.hda` (Houdini Digital Asset) files from the folder path you specified in this section.

 [image: Houdini Asset Manage Confirm edits to Houdini Environment File]

## Step 2 - Creating a Directory for Your City

In this step, you will create a new folder to store city data from Houdini generated throughout this guide. This folder will also contain duplicated parts of the files included with the "CitySample_HoudiniSource.zip" so that you don't inadvertently overwrite them if you create additional cities using Houdini.

- Create a new folder in your **CitySampleSource** folder to store the data for your city. For the purpose of this guide, the folder is named **MyCity** and is located in `D:\CitySampleSource\MyCity`. [image: Windows Folder create folder named for your city]

- **Copy** the content located in `D:\CitySampleSource\Small_City\houdini` to the **MyCity** folder. For example, `D:\CitySampleSource\MyCity`.

Now that you have copied the Houdini source files to your own named city folder, in the remainder of this guide you will create your own city and save it to this location.

## Step 3 - Starting the City Creation Process by Defining the City Shape

In Houdini, you will create and define the shape of your city using the City Layout operator created specifically for the City Sample project. The City Layout operator takes input for the shape of your city, arterial splines used to define main through-roads in the city, and specified zones for types and heights of buildings in sections of the city.

This step has you starting by defining the shape of your city using a Houdini Geometry object and Curve.

- In the **Network** pane, use the right-click context menu to create a **Geometry** object. [image: Create a geometry object]

- Double-click on the **Geometry** object to open its graph, and use the right-click context menu to add a **Curve** node. [image: Create a Curve object] With the **Curve** node selected, **left-click** in the viewport to place points that make up your city shape. To give you an idea of size, the Small City in the City Sample project is approximately 1 kilometer (km) wide, and the Big City is approximately 5 km wide. [image: Draw curve points for city shape] We recommend using a **Top** view when drawing the city shape, and use a large enough area.

- In the **Network** panel, use the right-click context menu to add a **City Layout** node to the graph. Connect the output of the **Curve** node to the first input of the **City Layout** node in the graph. This generates a street layout using the drawn curve points. [image: Connect Curve to City Layout] If the **City_Layout** operator is not visible in the context menu, refer to Step 1: Required Houdini Project Setup (-> city-sample-quick-start-for-generating-a-city-and-freeway-using-houdini) to ensure the files and paths are set up properly for your project. Once the inputs are connected, the layout of the city is contained within the drawn curve shape. You can re-select the Curve node at any time and drag the points around until you achieve the desired shape of your city layout. The output is automatically updated in the viewport. [image: Adjust curve points for city shape]

- In the **Network** pane, select the **City Layout** (1) node in the graph. Using the text field for **City Name** (2), give your city a name. For the purposes of this guide, the name is "MyCity." Click image for full size.

- **Save** the scene to your source folder created earlier in this guide and give it a name. For example, `D:/CitySampleSource/MyCity/MyCity.hip`.

In this step, you took the first steps of creating your city shape with the City Layout operator. With the Curve wired in, an overlay of the city block sizes can give you an idea of the road flow within the city.

## Step 4 - Creating the City Arteries

Now that you have defined the shape of your city, you can look at creating major roadways that travel through parts of your city. These roadways are referred to as arteries and you can create several to break up your city.

In this step, you will create one or more splines to define major roadways through the city, and explore the Road Network Options of the City Layout operator to ensure clean results.

- In the **Network** pane, use the right-click context menu and add a **Curve** to the graph. With the **Curve** selected, draw two points by left clicking within the **Viewport**. [image: Add a curve for road artery through city]

- Connect the **Curve** (1) to the **second input (Arterial Splines)** of the **City Layout** (2) node. [image: Connect arterial curve to City Layout] Re-selecting the second **Curve** node and moving either of its two points will automatically adjust the layout of the city.

- [Optional] Add additional Curves to create additional arterial splines. Wire both **Curves** to a **Merge** node, then wire the **Merge** node to the **second input** of the **City Layout** node. The example below uses two curves and represents what is used throughout the rest of this guide. Click image for full size.

- [Optional] Make adjustments to the shape of the city by selecting the **Curve** node used to define the city shape. Select its points and move them as needed.

With splines defining the major roadways and creating a more natural look and flow to your city, explore adding or moving their placement to change the dynamics of the roadways through the city. Use the City Layout properties to further explore roadway layouts within your defined city shape.

 [image: City Layout properties]

Look at adjusting the **density** to change the subdivision grid used as a base for creating the road lines. Adjust the **angle** property to create city streets that have a more natural and consistent flow.

Before moving onto the next step, ensure that your layout and road network appear without error. Adding multiple arteries or having a unique city shape could cause issues. Look for signs of issues and make adjustments accordingly.

## Step 5 - Adjusting Road Network Options

In this step, you will continue refining the city by making adjustments to its roadways using the **Road Network Options** found in the City Layout properties. You will learn how to use the full preview mode and look at making smaller changes to merge city blocks or merging of roads near intersections to create smoother traffic flow.

- In the **Network** pane, select the **City Layout** node (1). In the pane (2) above the Network pane, you can modify the details and properties of the node. Click image for full size.

- In the **City Layout** properties pane in the **preview_options** section, enable the checkbox for **full preview**. This property enables a more accurate preview of the network with all the clean up that happens down the graph, but it also requires more computing power thus reducing interactivity. [image: City Layout enable Full Preview option] [image: Full Preview disabled] [image: Full Preview enabled]

- Click the **Road Network Options** tab to adjust properties of the generated road network. It is important to adjust these properties to ensure a smooth road network for traffic flow in the city by occluded intersections, or having roads that are too short or too close to one another. [image: City layout Road Network Options] Be mindful of not creating one-way roads. You should not have any through streets, and use road length minimums to ensure good traffic flow.

In the examples below, the city is using multiple arterial splines to define major roadways, effectively splitting the city into four quadrants. This includes roads that travel in different directions for each quadrant but also creates areas where multiple roads meet at intersections. Explore using the Road Network Properties to merge city blocks and city streets along the major through roads.

|  |  |
| --- | --- |
|  |  |
| Road Network: Default Settings | Road Network: Adjusted Block Percent and Fuse Factor |

Click images for full size.

## Step 6 - Draw City Zone and Adjust Cityscape

Now that your city is taking shape with multiple arterial roadways, zones can be defined to better define your cityscape. In this step, you will learn how to define a single area using a Curve with the City Zone operator plugged into the City Layout node. The City Zone operator properties enable you to define the height using multiple points on a graph and set how that curve is represented.

- In the **Network** pane, use the right-click context menu and add a **Curve** to the graph to create a zone that defines what types of buildings and structures reside in that area of the city. In the **Viewport**, draw an area around the city shape you want to define as a zone. [image: Draw City Zone Shapes]

- In the **Network** pane, use the right-click context menu to add a **City_Zone** operator. Wire the **Curve** (1) to the **Zone** (2) node. Wire the **Zone** (2) node to the **third input (City Zones)** (3) input of the **City Layout** node. [image: connect city zones to city layout]

- In the **Network** pane, select the **City Zone** node. Its properties are displayed in the pane above the graph. [image: City Zone Properties] **Height** defines the maximum height of the defined zone.

- **Point No.** selects between the available points that are on the graph. By default there are only two points, one at 0 and another at 1. Automatically add points by clicking in the graph.

- **Position** and **Value** moves a selected point along the X and Y-axes of the graph to define the falloff and maximum height of the zone shape.

- **Interpolation** defines the type of curve applied to the shape relative to Position and Value

- Use the **City Zone properties** to adjust the attributes of the zone. [image: adjust height of city zone]

- [Optional] Repeat the previous steps to add additional zones and use a **Merge** node to wire them to the **City Layout** node. [image: Multiple City zones defined] With the **City Layout** node selected, enable **preview_zones** under the **preview_options** section to display the defined City Zones.

For the purposes of this guide, two zones are defined within the city. One that has more high-rise skyscrapers and primarily takes up one quadrant of the city and another with slightly less height split between two quadrants. Later in this guide, you will generate the building volumes that populate the city. These zones help define the look of your cityscape.

## Step 7 - Drawing the Freeway Path Through the City

With most cities, there are ways to navigate around using a multi-lane freeway that bypasses pedestrians, crosswalks, and intersections with traffic lights. The City Sample provides tools and operators to set your own freeway path or loop that contains entry and exit points.

In this step, you will learn how you can add a freeway path to your own city with entry and exit points that connect to the arterial roadways (red) using a Curve and Freeway Util Curve Attribute operator.

- In the **Network** pane, use the right-click context menu to add a **Curve** node. In the **Viewport**, click points where you want the freeway path to go. [image: Freeway path curve] Optionally, you can use **Polywire** and **Merge** nodes to better visualize the freeway path over the city layout. With the **Polywire** node selected, use the properties to set the **Wire Radius** to a high enough value that it makes the path easy to see. [image: Freeway Path polywire combined]

- Use the right-click context menu to add a **Freeway Util Curve Attribute** operator to the graph. [image: Select the Freeway Path Attributes node] With the **Freeway Util Curve Attribute** node selected, there are two properties you can modify: [image: freeway path node attributes] **Number of Lanes:** You can set it to 4 or 6 lanes.

- **Closed:** Enable the checkbox for any freeway path you want to be a closed loop.

When choosing a freeway path that does not loop on itself, ensure its bounds connect to the arterial roadways (red) and that it runs within the continuity of the road.

Once you have finished setting your freeway path or loop, you can remove the **Merge** and **Polywire** nodes from the graph, as they are for visualization and are no longer needed. Wire the **Curve** node to the **Freeway Util Curve Attributes** node to finish the set up.

 [image: Connect the freeway curve to the freeway util curve attributes]

With the Freeway Util Curve Attributes operator, you can create multiple freeway paths and decide whether to use a closed loop or path with their own entry and exit points to the city streets below. When creating your own city, explore using different numbers of lanes and connection points to the freeway from various parts of the city.

## Step 8 - Assemble Your Inputs in the City Processor

Now that you have done a lot of the foundational work for your city, defining its shape, setting up its roadways and freeway system, it is time to assemble your work using the **City Processor** operator. This is where all this data you have compiled and set up over the previous steps in this guide starts to come together with the various zones, freeway, arterial roadways, and so on.

 [image: Processed City with zones, arteries, and freeway]

- Set Houdini to **Manual** mode using the selection box in the bottom-right of the editor window. By default, Houdini is set up to cook content automatically. In this instance it is better to delay cooking this content until all inputs have been connected. [image: Enable Manual update mode. ]

- In the **Network** pane, use the right-click context menu to add a **City Processor** operator.

- Wire the second output of the **City Layout** node (1) to the first input of the **City Processor** node (2). [image: Connect City Layout to City Processor in the graph] You can ignore the warning on the City Processor node as it will be resolved in the next step.

- Wire the **Freeway Util Curve Attributes** node (1) to the second input of the **City Processor** node (2). [image: Connect Freeway path to City Processor in graph]

- Set Houdini back to **Auto Update** mode, which triggers the City Processor node to cook the input data. [image: Enable Auto Update mode] Re-enabling **Auto Update** mode triggers processing of the City Processor, which can take several minutes to complete.

Once processing completes, you can preview your generated city based on all the input data from the previous steps.

In the example below, you can see how the freeway way path is placed throughout part of the city, the two arterial roadways stretching across the city, the multiple quadrants with city streets flowing in different directions, and the two defined zones, one with taller buildings and the other with a gradual increase in size but not quite as tall.

 [image: Processed City]

## Step 9 - Create a Freeway Connection to the City

Now that the city has been processed and takes into account the various data from city operators, the freeway needs to connect its path to the city streets below.

- In the **Network** pane, double-click on the **City Processor** node to open its network graph, then access the **Freeway** part of the graph. Click image for full size.

- In the graph in the commented (blue) section named **FREEWAY OUTPUT**, look for the **FREEWAY** node. Right-click it and select **Allow Editing of Contents** from the context menu. Click image for full size.

- Double-click to open the **FREEWAY** node to see its network of nodes. Look to the left side under the blue notes called **Process Freeway, Connections and Ramp** for the **connections_blank** node. Click image for full size.

- Double-click the **connections_blank** node to access its network of nodes. Locate the **all_connections** node and double-click it to open its graph. Click image for full size.

- Click **Display** on the **ROAD_REFERENCE** node. [image: Display Template for Road Reference]

- Hold **Ctrl** and select the **ROAD_REFERENCE** and **merge_freeway** nodes. Click **Display Template** (pink) on the nodes. [image: Enable Display Template for Freeway Path]

- In the graph, select the **connection_set_1** node and in its properties window, enable **Preview Mode** for faster feedback while making edits. [image: Preview Mode Connection Set 1]

- In the properties window, click the **plus (+)** button next to the **Connections property**. This adds a curve used to connect the freeway path to a street. Click image for full size.

- Click **Edit Curve 0**. [image: Freeway Build Connection Edit Curve]

- With the **Handle** tool enabled, click two points: one close to the freeway path and the second on the street you want to connect to. You can make adjustments to the two points by holding **Ctrl + left-click** for street connections, or holding **Shift + left-click** for freeway connections. [image: Connect Freeway path to City Streets] Ensure the streets and connections have the same number of lanes. Change this using the **Number of Lanes** slider for the added Connection curve. When clicking the final point in place, you should see a result similar to the image below. [image: Freeway Connection to City Streets]

- **Repeat** the steps above to add additional entry and exit ways to the freeway path as needed.

- In the graph, select the **connection_set_1** node, and in its properties window, disable **Preview Mode** once you've completed connections to the freeway.

The connection_set_1 properties provide various settings to adjust how the freeway connects to the streets below. You can explore the available properties when adding a new Connection element to the array. Look at the **Interpolation**, **Elevation**, and **Banking** properties to make adjustments to how the connection meets the street.

 [image: City Processor Connection Set 1 properties]

## Step 10 - Adjust the Cityscape and Buildings Volume

The City Processor enables you to control different aspects of how the city is generated for export later in this guide. The **City_Lot_Processor** operator provides properties for both the lots and the buildings that fill them. Their respective properties enable you to define different attributes related to size, setbacks for sidewalks, style of buildings, variation beyond default settings, and so on.

In this step, you will learn where these settings live and make adjustments as you see fit. You are encouraged to try out different settings to create different styles and variations using these properties.

- In the **Network** pane, open the **City Processor** node. In its network graph, examine **3. LOTS** (orange) and select the **City_Lot_Processor** node (yellow circle). Click image for full size.

- With the **City_Lot_Processor** node selected, look at the properties pane where you can select the **LOTS** and **BUILDINGS** tabs. [image: City Lot Properties Tabs]

You can use the City Lot Processor properties to make adjustments to the lots and buildings generated. For lots, this includes lot size, removal distance from the freeway, and consideration for sidewalks. For buildings, you can define their style, height, and size.

Explore the settings found in each of these panels and try out different variations for your own city.

Changing these properties causes the buildings volumes and lots around the city to regenerate. Each change will complete its regeneration before another than can be made. If your city is large, it can take more than several minutes to complete the regeneration process.

|  |  |
| --- | --- |
| [image: CIty Processor Lots Properties] | [image: City Processor Buildings Properties] |
| City Lot Processor Properties: Lots | City Lot Processor Properties: Buildings |

## Step 11 - Generate the City Caches and Export Data

In this final step, you will use the **City Processor** properties pane to set whether you want to use the Procedural Dependency Graph (PDG) with selected processing options for some part. Doing so will generate and export the necessary data which you can later import into Unreal Engine 5 to create your city there.

- Set Houdini to **Manual** mode to delay the regeneration process when making changes to the City Processor node. [image: Set Houdini to Manual Update mode]

- In the **Network** pane, select the **City Processor** node.

- In the **City Processor** properties pane, choose whether to generate the city caches and export data using the PDG by adding or removing the checkbox next to **use PDG**. [image: City Processor enable Use PDG]

PDG is used to improve the processing speed, depending on your machine and number of processes. Consider the following:

1. **With PDG**, there are three sub-steps that need to be processed. Click the processes for **process city base**, **PDG process**, and **process city furniture**. PDG processing happens at the building generation stage and is especially useful when the city is large because it parallelizes the building generation that requires the most computing power.

 [image: City Processor with Use PDG enabled]

2. **Without PDG**, click **process city without PDG** to generate the different caches.

 [image: City Processor without PDG]

- Once processing is complete, do the following based on the state of **use PDG**: If enabled, click **EXPORT ALL PBC** to export the geometry and the Point Cloud Alembics (PBC).

 [image: City Processor with PBC Export]

- If disabled, first use the **Caches and Exports** tab to ensure that the results you are seeing are read from disk. At the bottom, under the **geometry and pbc export** section, click **EXPORT ALL PBC**.

 [image: City Processor without PBC export]

In this final step, you now have processed and exported all the data necessary to move onto the second part of this series of guides where you can import your city's Houdini data into Unreal Engine using the City Sample project.

Follow along with the City Sample: Generating a City and Freeway in Unreal Engine 5 (-> city-sample-quick-start-for-generating-a-city-and-freeway-in-unreal-engine-5) to complete development of your own city and see it come together in Unreal Engine.

 [image: Generated City in UE5]

## Step 12 - On Your Own!

Now that you've finished generating all the data and files necessary to fully realize your city in Unreal Engine's City Sample project, there are plenty of things that you can continue to explore using the procedural tools developed by Epic Games for the Houdini Engine to generate a city.

Below are some suggestions you can explore on your own:

- Revisit Step 3 (-> city-sample-quick-start-for-generating-a-city-and-freeway-using-houdini) and explore creating various shapes and sizes for your city with different spline shapes.

- Revisit Step 4 (-> city-sample-quick-start-for-generating-a-city-and-freeway-using-houdini) and add multiple arterial roadways to your city. Use these to create interesting shapes and zones for your city.

- Revisit Step 5 (-> city-sample-quick-start-for-generating-a-city-and-freeway-using-houdini) and explore the settings within the City Layout node. You can experiment with changing settings under the City Layout Options, Road Network Options, and Road Network Sizes for your city.

- Revisit Step 6 (-> city-sample-quick-start-for-generating-a-city-and-freeway-using-houdini) to set up and draw different zone types around the city. This is useful for creating areas with high rise buildings, and areas with moderately sized buildings. Use the Zone Shape graph to define the shape of the curve for each zone.

- Revisit Step 7 (-> city-sample-quick-start-for-generating-a-city-and-freeway-using-houdini) to experiment with different types of freeway layouts, such as drawing multiple freeways and having a closed loop freeway. This guide only demonstrates a single linear freeway. Use the Freeway Util Curve Attribute node to set whether the freeway should be closed and try using multiple connected freeways that use four and six lanes.

- Revisit Step 10 (-> city-sample-quick-start-for-generating-a-city-and-freeway-using-houdini) and look at the City Lot Processor properties where you can experiment with different Lot and Buildings settings. For Lots, you can set distances that lots should be from freeways, their minimum size, control how sidewalks are affected, and more. For Buildings, you have finer control over building heights, lot size between roads, applying a noise amount to vary building sizes outside of specified zones set up in Step 6, and much more. Experiment with different settings but be aware that each change will be automatically processed and updated in the Houdini viewport, which can take a few moments to several minutes to complete.

- rendering
- lighting
- optimization
- global illumination
- artificial intelligence
- metasounds
- vehicle physics
- procedural generation

On this page

- Prerequisites for this Guide (-> city-sample-quick-start-for-generating-a-city-and-freeway-using-houdini)
- Additional Notes about this guide (-> city-sample-quick-start-for-generating-a-city-and-freeway-using-houdini)
- Step 1 - Required Houdini Project Setup (-> city-sample-quick-start-for-generating-a-city-and-freeway-using-houdini)
- Step 2 - Creating a Directory for Your City (-> city-sample-quick-start-for-generating-a-city-and-freeway-using-houdini)
- Step 3 - Starting the City Creation Process by Defining the City Shape (-> city-sample-quick-start-for-generating-a-city-and-freeway-using-houdini)
- Step 4 - Creating the City Arteries (-> city-sample-quick-start-for-generating-a-city-and-freeway-using-houdini)
- Step 5 - Adjusting Road Network Options (-> city-sample-quick-start-for-generating-a-city-and-freeway-using-houdini)
- Step 6 - Draw City Zone and Adjust Cityscape (-> city-sample-quick-start-for-generating-a-city-and-freeway-using-houdini)
- Step 7 - Drawing the Freeway Path Through the City (-> city-sample-quick-start-for-generating-a-city-and-freeway-using-houdini)
- Step 8 - Assemble Your Inputs in the City Processor (-> city-sample-quick-start-for-generating-a-city-and-freeway-using-houdini)
- Step 9 - Create a Freeway Connection to the City (-> city-sample-quick-start-for-generating-a-city-and-freeway-using-houdini)
- Step 10 - Adjust the Cityscape and Buildings Volume (-> city-sample-quick-start-for-generating-a-city-and-freeway-using-houdini)
- Step 11 - Generate the City Caches and Export Data (-> city-sample-quick-start-for-generating-a-city-and-freeway-using-houdini)
- Step 12 - On Your Own! (-> city-sample-quick-start-for-generating-a-city-and-freeway-using-houdini)

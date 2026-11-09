# Creating a Fence Generator Using Shape Grammar

https://dev.epicgames.com/documentation/en-us/unreal-engine/creating-a-fence-generator-using-shape-grammar-in-unreal-engine?application_version=5.9

> A how to guide to building a Fence Generator using Shape Grammar.

[image: Creating a Fence Generator Using Shape Grammar]

A common use case for Shape Grammar (-> using-shape-grammar-with-pcg-in-unreal-engine) in Unreal Engine's Procedural Content Generation Framework (-> procedural-content-generation-overview) is building systems. In this example, you will create a fence generator that spawns several static meshes along a spline using grammar and changes the meshes when the spline control points are altered.

This sample uses the Privacy Fence Pack (with damaged sections) pack available for free on Fab. However, this example could be made using any static meshes you choose.

## Prerequisites

This how-to guide uses terms and concepts discussed in the following documentation:

- Procedural Content Generation Overview (-> procedural-content-generation-overview)
- Using Shape Grammar With PCG (-> using-shape-grammar-with-pcg-in-unreal-engine)

## Project Setup

- Create a new Project (-> creating-a-new-project-in-unreal-engine) in Unreal Engine.
- Create a new level (-> working-with-levels-in-unreal-engine) using the Basic level template. Save your level.
- Open **Edit > Plugins** and confirm the following plugin is enabled (it is enabled by default):**Procedural Content Generation Framework (PCG)**

[image: Activate the Plugins]

## Create the Fence Blueprint

The PCG graph connects to a PCG component and a spline, both of which are contained with a new blueprint class.

Create the blueprint class by following the steps below:

- Create a new blueprint class by right-clicking in the **Content Drawer** or **Content Browser** and selecting **Blueprint Class**.
- Name your new blueprint class **FenceSpline**.
- In the **Components** tab, add a utility **Spline** component and a **PCG** component.
- Save your blueprint class.

[image: Create the FenceSpline Blueprint Class]

## PCG Graph Asset

The **PCG Graph** is the foundation of the fence generator and contains the instructions that are used to generate the fence sections along the spline. Create a new PCG graph asset by following the steps below:

- Right-click in the **Content Drawer** or **Content Browser**, navigate to **Procedural**, and select **PCG Graph**. If the **Create Graph From Template **window appears, select **Create empty graph**.[image: Create a New PCG Graph]
- Name the new asset **PCG_FenceGen** and press **Enter**.
- Double-click **PCG_FenceGen** to open the PCG Graph Editor.

## Create the PCG Grammar

The grammar is stored in a graph parameter as a string. Storing the value in a parameter makes it possible to use **Parameters Overrides** to customize each instance of the fence generator in the level. The **Grammar **attribute is then added to the spline data and passed to a **Subdivide Spline** node to assign points along the spline.

- In the **PCG Graph Editor** window, add a **Get Spline Data** node to the graph.
- Click **Graph Parameters** in the toolbar to open the Graph Parameters panel, then click the **+** button to create a new parameter. Name it **Grammar **and change its type to **String**.[image: Set Grammar to String]
- Set the initial value of **Grammar** to `A*`. This will tell the graph to place an initial static mesh and then fill the rest of the spline in with static meshes as long as there is room.
- Drag from the output of **Get Spline Data** and create an **Add Attribute** node. In the Details panel, change the **Output Target** to **Grammar**. Leave the value fields alone; the value comes from the node you connect in the next step.
- Create a **Get Grammar** node from the **Graph Parameters** category and connect it to the **Attributes **input on **Add Attribute.**
- Drag from the output of **Add Attribute** and create a **Subdivide Spline** node.
- Click the checkbox for **Accept Incomplete Subdivision**. The spline is rarely an exact multiple of the fence section length, so without this, the node reports that the grammar does not fit, and spawns nothing.
- Click the checkbox for **Grammar as Attribute** and set **Grammar Attribute** to `Grammar`.[image: Add Subdivide Spline node]

## Assign Meshes to the Grammar

Each symbol in the grammar needs to be assigned a static mesh to spawn. This is done by using two parameters: **Module Info** and **Mesh Info**. Module Info contains an array of symbols. Mesh Info contains an array of static meshes. This information is passed to the **Subdivide Spline** node later as an attribute set.

- Select the **Subdivide Spline** node and click the checkbox for **Module Info as Input**. This adds a **ModulesInfo **input pin that takes an attribute set describing your grammar symbols.
- Create a new parameter in the Graph Parameters panel and name it **Module Info**. Change the type to **PCG Subdivision Submodule**, then click the dropdown menu next to the type and select **Array**. This holds your symbol information.[image: Set Module Info to an Array]
- Click the **+** button to add a new array element and click the arrow next to **Index [0]** to open the entry.
- Set **Symbol **to **A **and click the checkbox next to **Scalable **so the last fence section can stretch to fill the spline. Leave **Size **at its default; the subgraph you create next replaces it with the real size of the mesh.
- Create a new parameter in the Graph Settings and name it **Mesh Info**. Change the type to **Static Mesh** and click the dropdown menu next to the type and select **Array**. This will hold our static mesh information.[image: Create Mesh Info]
- Click the **+** button to add a new array element to Mesh Info.
- Open the dropdown menu next to **Index [0]** and select the **Fence_17_DE** static mesh.

## Create the Extract Info Subgraph

The subdivision process assigns each module a size and places a pivot point in the middle of the bounds. This creates a problem if the mesh changes later or does not have its pivot in the middle of the mesh. This subgraph extracts the size information directly from the selected mesh’s bounds and adjusts its pivot point to be at the center.

### Set Up the Input Node

- Click the **Input **node and open the **Pins **option in the Details panel. Open I**ndex [0] **and change the **Label **from In to Mesh Info.
- Click the Input node and open the **Pins **option in the Details panel. Open **Index [0]** and change the **Label **from In to **Mesh Info**.
- Change **Allowed Types** to **Point **or **Attribute Set**.
- Change the **Pin Status** option to **Normal**.
- Set the **Tooltip** to `List of meshes to extract info from`.[image: Input Node Settings]

### Extract the Mesh Bounds

- Open the **Graph Parameters** panel and create a new parameter. Name it **Mesh Attribute Name** and set the type to **Name**. Set the initial value to **Mesh**.
- Drag from the **Attribute Rename** node and create a new **Bounds From Mesh** node.
- In the Details panel, set the **New Attribute Name** to `Mesh`.
- Create a **Get Mesh Attribute Name** node and connect it to the **Attribute to Rename** input on the **Attribute Rename** node.
- Drag from the **Attribute Rename** node and create a new **Bounds From Mesh** node.
- Click the new node and set the **Mesh Attribute** value to `**Mesh**`.[image: Add Attribute Rename node and settings]
- Drag from the output of **Attribute Rename **and connect it to the **Attribute **input on the **Bounds From Mesh** node. The editor adds an **Attribute Set To Point** node for you, so the graph works with both point data and attribute sets.

### Adjust the Pivot Point

- To move the pivot of the static mesh so that it displays correctly on the spline, drag from **Bounds From Mesh** and create a **Multiply **node. You can find it under **Metadata > Attribute Maths Op**.
- Click on the new node and set the value of **Input Source 1** to `$Extents.X` This will extract the X extents from the bounds data.
- Drag off the **In B** input and create a **Create Constant** node. Change the **Double Value** to **2.0**.
- Click back on the **Multiply** node and change the **Output Target** value to `Size`. This will output the full X value multiplied by two and store it in an attribute called **Size**.[image: Add Multiply node and settings]
- Drag off from the **Multiply** node and create a **Copy Attributes** node. Drag off the **Multiply** output again and connect it to the **Source** input on the new node. This node extracts the Z extents from the bounds data and saves it to an attribute to help with future scaling, if needed.
- Click on **Copy Attributes** and set the **Input Source** to `$Extents.Z`.
- Set the **Output Target** to **ExtentsZ**.[image: The Copy Attributes node]
- Drag from the output on **Copy Attributes** and create another **Multiply** node. This node will help move the pivot of the mesh to the center.
- Drag off from the **In B** input and create a **Create Attribute** node. Change the **Double Value** to `-1.0`.
- Click back to the **Multiply** node. In the Details panel, set the value of **Input Source 1** to `$LocalCenter.`
- Set the value of **Output Target** to `PivotOffset`.[image: Add a second Multiply node]

### Set Up the Output Node

- Click on the **Output** node and position it at the end of the graph.
- Open the **Pins** option in the Details panel. **Open Index [0]** and change the **Allowed Types** to **Attribute Set**.
- Change the **Pin Status** option to **Normal**.[image: Output node settings]
- Drag from the output on the **Multiply** node and create a new **Point to Attribute** Set node.
- Connect the output of the new node to the **Out** pin on the **Output** node.[image: Convert the point data to an attribute set]
- Save the completed graph.[image: The complete subgraph]
- Return to the **PCG_FenceGen** graph editor window. Drag and drop your **PCG_ExtractInfo** graph asset from the **Content Drawer** or **Content Browser** into the viewport and select **Create PCG_ExtractInfo Subgraph Node**. You can also hold **Ctrl **while you drop the asset to create the subgraph node directly.[image: Create the Subgraph node]

## Apply the Module and Mesh Information

- Back in the **PCG_FenceGen** graph, create an **Add Attribute** node and position it near the **Subdivide Spline** node.
- Create a **Get Module Info** node and connect it to the **In** on **Add Attribute**.
- Create a **Get Mesh Info** node and connect it to the **Attributes** input on **Add Attribute**.
- Connect the **Out** from **Add Attribute** to the **Mesh Info** input on your **PCG_ExtractInfo** subgraph node.
- Connect the output from the subgraph node to the **Modules Info** input on the **Subdivide Spline** node.[image: Connect the Module and Mesh data]
- Drag from the output of the Subdivide Spline node and create a Match And Set Attributes node. Connect the output of the subgraph node to its Match Data input. This node takes the point data and grammar from Subdivide Spline and matches them with the Module Info and Mesh Info from those parameters.
- Click on the **Match and Set Attributes** node and set the following options:Click the checkbox next to **Match Attributes**.
- Set the value of the **Input Attribute** and the **Match Attribute** to `Symbol`.

[image: The Match And Set Attributes node]

## Apply the Pivot Offset Transform

- Drag from the output of **Match and Set Attribute** to create a **Multiply** node.This node scales the pivot of each mesh using data from the **PCG_ExtractInfo** subgraph.
- Drag from the output of **Match and Set Attribute** and connect it to the **In B** input on the **Multiply** node.
- Click on the **Multiply** node. Set the **Input Source 1** value to `PivotOffset` and the **Input Source 2** value to `$Scale`.[image: Scale the Pivot with the Multiply node]
- Drag from the **Multiply **node and create a **Vector: Transform Direction** node. You can find it under **Metadata > Attribute Vector Op > Transform Direction**. This node rotates the pivot to match the points on the spline.
- Drag from the output of **Multiply** and connect it to the **Transform** input on the **Vector: Transform Direction** node.
- Click on the new node and set the **Operation** to **Transform Direction**.
- Set the **Input Source 1** value to `PivotOffset` and the **Input Source 2** value to `$Transform`.[image: Rotate the pivot with Tranform Direction]
- Drag from **Vector: Transform Direction** and create a new **Add** node. This node adds the final pivot offset to the position of the pivot on the mesh.
- Drag from the output of **Vector: Transform Direction** and connect it to the **In B** input on the **Add** node.
- Set the **Input Source 1** value to `$Position` and the **Input Source 2** value to `PivotOffset`.[image: Apply the offset with the Add node]

## Spawn the Static Meshes

- Drag from the output of the **Add** node and create a new **Static Mesh Spawner**. This node spawns the static meshes along the spline.
- In the Details panel, set the Mesh Selector Type to **PCGMeshSelectorByAttribute**.
- Set the **Attribute Name** value to `Mesh`.
- Save the graph.[image: Connect the Static Mesh Spawner]
- Click the **FenceSpline** actor in the level. In the Details panel, select the **PCG** component and use the dropdown menu to set the **Graph** option to **PCG_FenceGen**.[image: Connect the PCG Graph to the PCG component]

## Result

You should see a line of fence static meshes spawning along the length of the spline.

[image: The complete Fence Generator]

You can add more variety to the static meshes by adding symbols to your grammar, defining them in your Module Info, and assigning them static meshes in your Mesh Info. Each symbol needs a Module Info entry and a Mesh Info entry at the same index. You can do this in the graph itself or on a per-instance basis using **Parameter Overrides**.

[image: Parameter Overrides work on a per instance basis]

In the example below, the fence line has the following extra features:

- Posts using the symbol `P`.
- A gate using the symbol `G`.
- Large broken sections using the symbol `BL`.
- Small broken sections using the symbol `BS`.

The grammar has been updated to `{[A,P]:2,[BL,P]:1,[BS,P]:1}*,[G,P], {[A,P]:2,[BL,P]:1,[BS,P]:1}*`.

[image: The updated grammar generates a more interesting result]

- landscape
- building virtual worlds
- procedural generation
- grammar

On this page

- Prerequisites (-> creating-a-fence-generator-using-shape-grammar-in-unreal-engine)
- Project Setup (-> creating-a-fence-generator-using-shape-grammar-in-unreal-engine)
- Create the Fence Blueprint (-> creating-a-fence-generator-using-shape-grammar-in-unreal-engine)
- PCG Graph Asset (-> creating-a-fence-generator-using-shape-grammar-in-unreal-engine)
- Create the PCG Grammar (-> creating-a-fence-generator-using-shape-grammar-in-unreal-engine)
- Assign Meshes to the Grammar (-> creating-a-fence-generator-using-shape-grammar-in-unreal-engine)
- Create the Extract Info Subgraph (-> creating-a-fence-generator-using-shape-grammar-in-unreal-engine)
- Set Up the Input Node (-> creating-a-fence-generator-using-shape-grammar-in-unreal-engine)
- Extract the Mesh Bounds (-> creating-a-fence-generator-using-shape-grammar-in-unreal-engine)
- Adjust the Pivot Point (-> creating-a-fence-generator-using-shape-grammar-in-unreal-engine)
- Set Up the Output Node (-> creating-a-fence-generator-using-shape-grammar-in-unreal-engine)
- Apply the Module and Mesh Information (-> creating-a-fence-generator-using-shape-grammar-in-unreal-engine)
- Apply the Pivot Offset Transform (-> creating-a-fence-generator-using-shape-grammar-in-unreal-engine)
- Spawn the Static Meshes (-> creating-a-fence-generator-using-shape-grammar-in-unreal-engine)
- Result (-> creating-a-fence-generator-using-shape-grammar-in-unreal-engine)

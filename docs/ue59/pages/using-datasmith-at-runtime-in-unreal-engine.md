# Using Datasmith at Runtime

https://dev.epicgames.com/documentation/en-us/unreal-engine/using-datasmith-at-runtime-in-unreal-engine?application_version=5.9

> How to use Datasmith functionality from within an Unreal-based application at runtime.

[image: Using Datasmith at Runtime]

Learn to use this **Beta** feature, but use caution when shipping with it.

## What is Datasmith Runtime?

**Datasmith Runtime** is a collection of Datasmith features that are available at runtime (as opposed to an in-editor workflow) in an Unreal Engine-based application. You can use these features to create applications that can import `.udatasmith` files and manipulate them using Blueprints.

 [image: Collab Viewer Direct Link]

Datasmith Direct Link is accessible in a cooked Unreal Engine-based application using Datasmith Runtime and Blueprints.

With Datasmith Runtime, you can create custom applications that take advantage of Datasmith Direct Link (-> using-datasmith-direct-link-in-unreal-engine) or visualize Datasmith data on demand as part of an iterative 3D workflow.

Enable the following plugins in your project to work with Datasmith Runtime:

- Datasmith Content

- Datasmith Importer

- Datasmith Runtime

Datasmith Runtime is officially supported in Unreal Engine 4 and Unreal Engine 5 using Windows and MacOS. While Datasmith Runtime will work with Linux, this is experimental and you may experience instability and performance issues.

## Using Datasmith Runtime with Blueprints

Datasmith Runtime exposes a variety of Datasmith features and import options using several Blueprint nodes. Listed below are the most common:

 [image: Runtime Nodes]

The most common Datasmith Runtime Blueprint nodes.

### Make Datasmith Runtime Import Options

Exposes several import parameters and converts them to a data structure:

 [image: Make Datasmith Runtime Import Options]

| **Inputs** | **Description** |
| --- | --- |
| **Build Hierarchy** | Determines whether the hierarchy of Actors is built. Choosing a more detailed hierarchy increases loading and rendering time. **None**: Imports the source content with the hierarchy stored in the Datasmith Runtime Actor. Your content will not be represented in the World Outliner. **Simplified**: Imports the source content while minimizing the number of Actors created. Allows exposing objects so the application can modify their properties, while limiting the number of draw calls due to the high number of Actors in the scene. **Unfiltered**: Imports the source content with full hierarchy. |
| **Build Collision** | Determines the type of collision used for components. **No Collision**: Does not have any representation in the physics engine. Provides the best possible performance. **Query Only (No Physical Collision)**: Uses only spatial queries. Useful for objects that do not need physical simulation such as pawn navigation. Improves performance. **Physics Only (No Query Collision)**: Uses only physics simulation. Useful for objects that do not need spatial queries. Improves performance. **Collision Enabled (Query and Physics)**: Uses both spatial queries and physics simulation. |
| **Collision Type** | Determines the type of collision used for Static Meshes. **Project Default**: Uses the project's physics settings. **Simple and Complex**: Uses both simple and complex shapes. Simple shapes are used for regular scene queries and collisions. Complex (per-poly) shapes are used for complex scene queries. **Use Simple Collision as Complex**: Uses only simple shapes for all scene queries and collision tests. **Use Complex Collision as Simple**: Uses complex (per-poly) shapes for all scene queries and collision tests. Can be used for simulation in static shapes only. Might be necessary if precise collision is needed while navigating a scene. |
| **Import Metadata** | Reads and imports metadata for Actors. Increases load time. |

The **Tesselation Options** input is currently not used.

### Set Import Options

Sets the value of the selected import options for Datasmith content using a **Datasmith Runtime Actor**. Uses a Datasmith Runtime Actor as the **Target** and **Datasmith Runtime Import Options** as its value.

 [image: Set Import Options]

### Load File

Loads the `.udatasmith` file located at the specified file path. Requires a **File Path** and **Datasmith Runtime Actor** as inputs.

 [image: Load File]

### Load File from Explorer

Opens a File Browser window so you can browse to a location and select a `.udatasmith` file. Requires a **Datasmith Runtime Actor** as input. A **Default File Path** is optional.

 [image: Load File from Explorer]

Though it works with both Windows and Mac operating systems in Play In Editor (PIE), Load File from Explorer works only with Windows at runtime.

### Get Direct Link Proxy

Returns an interface to a **Direct Link** connection called a Direct Link Proxy. This is the first step in creating a **Datasmith Direct Link** connection.

 [image: Get Direct Link Proxy]

### Get List of Sources

Gets a list of Datasmith Direct Link Sources. Requires a **Direct Link Proxy** as input.

 [image: Direct Link Get List of Sources]

### Open Connection with Index

Opens a Direct Link connection with the source located at the specified index value. Requires a **Datasmith Runtime Actor** and a **Source Index** as input.

 [image: Open Connection with Index]

### Close Connection

Closes an open Direct Link connection associated with a specified **Datasmith Runtime Actor**.

 [image: Close Connection]

## Loading Datasmith Content at Runtime

Using Datasmith Runtime, you can load Datasmith content inside a cooked application while having access to the hierarchy and Actor properties.

Click for full image.

To load Datasmith content using Blueprints:

- Create a new **Actor Blueprint** to contain the anchor point for the Datasmith content. You can do this by right-clicking in the **Content Browser** and selecting **Blueprint Class** from the context menu. In the **Pick Parent Class** window, select **Actor** and name the new Blueprint class **DatasmithActor**. Double-click the new Blueprint to open the editor. [image: Pick Parent Class] This anchor will serve as the origin point for the imported Datasmith content. If your content is offset from the origin in your source application, then Unreal Engine will maintain that offset from the anchor when the content is imported.

- Select the **Event Graph** tab and remove every event except Event **BeginPlay**. Drag a connection from Event BeginPlay and add the **Spawn Actor From Class** node. Open the **Class** dropdown menu and select **DatasmithRuntimeActor**. Promote the **Return Value** to a variable and name it **Anchor**. [image: Runtime Spawn Actor]

- **Spawn Actor** requires a Transform to spawn the Anchor. Right-click to the left of Spawn Actor and add a **Make Transform** node. Connect the output from Make Transform to the **Spawn Transform** pin on Spawn Actor. [image: Make Transform]

- To finish the Blueprint, click and drag from the execute pin of the **Set** node and add a **Load File from Explorer** node. Connect a reference to the **Anchor** variable to the **Datasmith Runtime Actor** input. [image: Runtime Load Datasmith]

- **Save** and **Compile** the Blueprint. Add a copy of your Anchor Blueprint to the level and press **Play** to test.

Unreal Engine will open a File Explorer window and ask you to select a file.

## Creating a Datasmith Direct Link with Blueprints

You can also open a Datasmith Direct Link between one or more source applications and your Unreal Engine project at runtime using Datasmith Runtime.

- Start by creating a new **Actor** Blueprint to contain the anchor point for your Datasmith content. Double-click the new Blueprint to open the editor.

- Similar to the previous example, select the tab for the **Event Graph** and remove every event except for **Event BeginPlay**. Drag a connection off Event BeginPlay and add the **Spawn Actor From Class** node. Open the **Class** dropdown menu and select **DatasmithRuntimeActor**.

- A Transform is required to spawn the Anchor. Right-click to the left of Spawn Actor and add a **Make Transform** node. Connect the output from Make Transform to the **Spawn Transform** pin on Spawn Actor. [image: Make Transform]

- Next, you need a **Direct Link Proxy** to act as a connection point between your application and your source application. Drag a connection from the **Set** node and create a **Get Direct Link Proxy**. Promote the output to a variable and name it **Direct Link Sources Proxy**. Set it to be Public. [image: Load Direct Link Blueprint]

- Click the plus **(+)** button in the **Functions** section of the **My Blueprints** panel to create a new function. Name it **DirectLinkUpdate**. You will use this new function to trigger the Direct Link connection during runtime. [image: Creating a new Blueprint Function]

- Start by getting a copy of your **Direct Link Proxy** variable. Drag a line from the variable and create a **Get List of Sources** node. Promote the output to a variable to hold the list of Direct Link sources and make this variable public. [image: Get List of Sources]

- Drag the Anchor variable you created earlier from the **My Blueprint** tab into the Direct Link Update function. Drag the a line from the output, then type in **Set Import Options** to select and insert that node. [image: Set Import Options]

- Right-click and create a **Make Datasmith Runtime Import Options** node, and then drag a connection from the output to the **Import Options** input. [image: Make Import Options]

- Finish the function by dragging a line from Set Import Options and creating an **Open Connection with Index** node. This takes in an anchor and a **Source Index** as input. Connect the reference to the Anchor to the Target input. [image: Open Connection with Index]

- Click the plus **(+)** next to Variables to create a new variable. Name it **SourceIndex**, and make it of type Integer. [image: Adding a Source Index]

- Connect the new variable to the **Source Index** input on the **Open Connection with Index** node. An index value of 0 will connect to the first source in the list. [image: Connecting the Source Index]

- Finally, click on the **DirectLinkUpdate** function in My Blueprints and enable **Call In Editor** in the **Details** panel. This option makes the function available at runtime in the Details of the Anchor object. Click for full image.

- **Save** and **Compile**. The finished Blueprint should look like the example below:

Click for full image.

Start your source application and run the project by clicking the **Play** button. Select your Anchor in the **World Outliner** and click the **Direct Link Update** button in the **Details** panel. Then, click the **Synchronize with Direct Link** button in your source application. You will see your Datasmith content appear in your Level using the import options specified in the Blueprint.

Disabling the **Use Less CPU when in Background** option enables the engine to update the 3D viewport when the Unreal Engine window is not focused and when a Pawn in the level is not possessed. This option is found in the **Editor Preferences** under **General > Performance**.

- importing
- beta
- datasmith
- datasmith runtime

On this page

- What is Datasmith Runtime? (-> using-datasmith-at-runtime-in-unreal-engine)
- Using Datasmith Runtime with Blueprints (-> using-datasmith-at-runtime-in-unreal-engine)
- Make Datasmith Runtime Import Options (-> using-datasmith-at-runtime-in-unreal-engine)
- Set Import Options (-> using-datasmith-at-runtime-in-unreal-engine)
- Load File (-> using-datasmith-at-runtime-in-unreal-engine)
- Load File from Explorer (-> using-datasmith-at-runtime-in-unreal-engine)
- Get Direct Link Proxy (-> using-datasmith-at-runtime-in-unreal-engine)
- Get List of Sources (-> using-datasmith-at-runtime-in-unreal-engine)
- Open Connection with Index (-> using-datasmith-at-runtime-in-unreal-engine)
- Close Connection (-> using-datasmith-at-runtime-in-unreal-engine)
- Loading Datasmith Content at Runtime (-> using-datasmith-at-runtime-in-unreal-engine)
- Creating a Datasmith Direct Link with Blueprints (-> using-datasmith-at-runtime-in-unreal-engine)

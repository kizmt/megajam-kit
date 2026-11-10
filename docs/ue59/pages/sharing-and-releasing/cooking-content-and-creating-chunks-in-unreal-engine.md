# Cooking and Chunking

https://dev.epicgames.com/documentation/en-us/unreal-engine/cooking-content-and-creating-chunks-in-unreal-engine?application_version=5.9

> Cooking Content and Building .pak Files for Distribution

[image: Cooking and Chunking]

When you **cook** your project, **Unreal Engine** can divide up your game's assets into separate **chunks** that can be independently distributed, such as with DLC and patches. A chunk is a numbered collection of assets recognized by the engine's asset management system, and when a project cooks, each chunk generates a **.pak** file which you can then distribute through a content delivery system.

You can designate assets as belonging to specific chunks using the **Asset Manager** or using **Primary Asset Labels**. Both use a system of rules and metadata to construct chunks, which are then read during the cooking process. The sections below outline how to use these tools and how to interact with chunks in the editor.

## Understanding Primary Asset Rules

A **primary asset** is an asset that can be manipulated directly by the asset manager, while **secondary assets** are assets that are loaded automatically when a primary asset references them. Primary assets are the type referenced in the cooking and chunking process.

**Primary asset rules** are used to determine which primary assets have management authority over which secondary assets, as well as how to handle assets during the cooking process. These rules are defined by the `FPrimaryAssetRules` structure, and are used by the Asset Manager to determine how to handle Assets at cook time. For detailed information on the options available within `FPrimaryAssetRules`, check its API Page (-> API) . You may also want to look up the Cooking Rules defined on the `EPrimaryAssetCookRule` API Page (-> API).

One of the functions of primary asset rules is organizing chunks. By defining a rule and giving it a **Chunk ID**, all primary assets that fall under that rule are divided into a chunk with that ID number. Any secondary assets that those primary assets have authority over will be chunked alongside it.

### Chunk Organization

Any asset not given a specific chunk ID or given a negative chunk ID will be packaged as part of chunk 0, which is the "default" chunk that is distributed with your game's base data. Any chunks with a higher ID value than 0 are separated into different `.pak` files at cook time. You can organize chunks in any way that suits your project. For example, the ShooterGame sample project has three chunks:

- Chunk 1 for the "Sanctuary" map
- Chunk 2 for the "Highrise" map
- Chunk 0 for all other data

ShooterGame recognizes maps as primary assets, therefore any secondary asset used by a map, like a texture or a mesh, will use the chunk ID of the map that owns it, provided that the map has authority over it.

As another example, if you are creating a MOBA or any other "hero-based" game, you would divide different heroes' base assets into specific chunks, and then you might divide any additional costumes or skins into their own chunks as well so that they can be distributed separately.

## Defining Chunks In Your Project

Unreal Engine provides several methods for manipulating primary asset rules and defining chunks. You can define primary asset rules in the Asset Manager, edit them directly in your `*Game.ini` file, or you can use Primary Asset Labels in the Content Browser.

### Defining Chunks With the Asset Manager

You can manually edit primary asset rules for your project by opening your **Project Settings** and navigating to **Game** > **Asset Manager**.

[image: Primary Asset Rules settings in the Asset Manager, under Project Settings] Editing Primary Asset Rules in the Asset Manager's settings. Click image to enlarge.

**Primary Asset Types to Scan** designates the asset types that you want the asset manager to recognize as primary assets. The **primary asset rules** list lets you designate the **Priority** and **Chunk ID** of individual primary assets.

### Defining Chunks With Rules Overrides in Configs

**Rules Overrides** in configs can be used to establish the priority and chunk settings for a specific primary asset. To build our three-chunk setup for ShooterGame using Rules Overrides instead of Primary Asset Labels, the following section should be created in `DefaultGame.ini`:

 C++

```
[/Script/Engine.AssetManagerSettings]
	+PrimaryAssetRules=(PrimaryAssetId="Map:/Game/Maps/Sanctuary",Rules=(Priority=-1,ChunkId=1,CookRule=Unknown))
	+PrimaryAssetRules=(PrimaryAssetId="Map:/Game/Maps/Highrise",Rules=(Prority=-1,ChunkId=2,CookRule=Unknown))
	+PrimaryAssetRules=(PrimaryAssetId="Map:/Game/Maps/ShooterEntry",Rules=(Priority=-1,ChunkId=0,CookRule=AlwaysCook))
```

[/Script/Engine.AssetManagerSettings]
 +PrimaryAssetRules=(PrimaryAssetId="Map:/Game/Maps/Sanctuary",Rules=(Priority=-1,ChunkId=1,CookRule=Unknown))
 +PrimaryAssetRules=(PrimaryAssetId="Map:/Game/Maps/Highrise",Rules=(Prority=-1,ChunkId=2,CookRule=Unknown))
 +PrimaryAssetRules=(PrimaryAssetId="Map:/Game/Maps/ShooterEntry",Rules=(Priority=-1,ChunkId=0,CookRule=AlwaysCook))

Cooking and chunking rules in the DefaultGame.ini file. We have added an explicit reference to the startup map, "ShooterEntry", in this example.

This sets our main game maps to be in specific chunks, which will cause all of their references to be added to those chunks as well. The final entry, governing chunk 0, ensures that anything referenced by the map that loads when the game first starts up will be in chunk 0, which is also the default chunk. The priority value of -1 sets priority to the default value, which is 1.

### Defining Chunks With Primary Asset Labels

Primary Asset Labels are a type of data asset that designates other assets for cooking and chunking. These can be much quicker compared with creating rules for individual assets.

[image: An example of a Primary Asset Label in the Content Browser] An example of a Primary Asset Label in the Content Browser.

To create a Primary Asset Label, **right-click** inside the **content browser**, then click **Miscellaneous** > **Data Asset**.

[image: Creating a Data Asset in the Content Browser]

In the **Pick Data Asset Class** menu, select **PrimaryAssetLabel** and click **Select**.

[image: The Pick Data Asset Class menu] The Pick Data Asset Class menu pops up when you create a new Data Asset. Click image to enlarge.

Your new primary asset label is created in the **Content Browser**. If you **double-click** it, you can edit its data.

[image: The Primary Asset Label for the Highrise chunk] The settings for the HighriseLabel Primary Asset Label in ShooterGame. Click image to enlarge.

Primary Asset Labels include both a **Chunk ID** and **Priority**, just like Primary Asset Rules in the Asset Manager. However, you can apply those rules to multiple assets at a time in a Primary Asset Label. The **Explicit Assets** field lets you designate a list of specific assets, or you can designate an **Asset Collection** as belonging to this label. Alternatively, you can check **Label Assets in My Directory**, and the primary asset label will then affect all assets in the same folder in the content browser.

## Packaging Chunks

Once you have defined your chunk IDs, packaging your project will automatically create .pak files for each chunk. You can locate them in your project's `Saved/StagedBuilds/[PlatformName]/[ProjectName]/Content/Paks` folder.

[image: The location of Pak files in StagedBuilds] Packaged .pak files are located in the StagedBuilds folder, under a subfolder for your platform and project, inside the Content/Paks directory.

The `.pak` files are generated based on the platform that you are packaging for, so they are not interchangeable between platforms. Once you have generated them, you can use them in your delivery system of choice.

## Analyzing Asset-to-Chunk Assignments

UE provides several built-in tools to audit your chunks. Using these tools, you can see which Assets are assigned to which chunks, what source is giving them those assignments, and information about the size of chunked assets.

### Asset Audit Window

To open the **Asset Audit Window**, open the **Windows** dropdown menu, expand **Developer Tools**, and choose **Asset Audit**.

[image: Locating the Asset Audit window in the Windows dropdown] Click image to enlarge.

The Asset Audit Window will display, but it will be blank.

 The Asset Audit Window, as it appears when it is initially opened. Click image to enlarge.

Clicking the **Add Chunks** button will fill in the window with a summary of all chunks that exist in the current project.

 In ShooterGame, Assets are distributed between three Chunks. Click image to enlarge.

To inspect an individual chunk, right-click it and choose either the **Size Map** or the **Reference Viewer**.

 Click image to enlarge.

### Size Map

The **size map** provides a visual representation of the type and size of each asset contained within a chunk. Assets are displayed as colored boxes with their icon or thumbnail in the box, and are scaled to represent the size of the asset. Boxes nested within other boxes represent a parent-child reference relationship. For example, a texture that is referenced by a material would appear inside the material's box, because loading the material implicitly involves loading the texture.

In ShooterGame, chunk 0 contains the assets needed to display the game's menu and get into a match, while Chunks 1 and 2 are used for the game's playable maps. As a result, chunk 0 is smaller than the other chunks, and also has a wider variety of asset types. Here we can see the asset breakdown and total shipping disk size for chunks 0 and 1:

[image: Size map for Chunk 0] Chunk 0 of ShooterGame contains many independent assets, but is relatively small. Click image to enlarge.

[image: Size map for chunk 1] Chunk 1 (pictured) and chunk 2 contain the individual maps in which the game takes place, so they feature a single, large group of connected assets. Click image to enlarge.

The size map also supports visualization of the memory usage (in the Editor) of the assets it contains. In-editor memory size can be substantially different from a shipped product's disk space usage for the same group of assets.

[image: Size map for Chunk 0 in Memory Size mode] Chunk 0 displayed in Memory Size mode. This mode scales box sizes based on the memory usage of the assets in the editor. Click image to enlarge.

Individual assets can be examined or edited by right-clicking the asset's box. You can use the mouse wheel to zoom in or out, or double-click an asset to expand it so that it fills the window.

[image: context menu for an individual asset in Chunk 0] The context menu for the "loading screen" texture asset. Click image to enlarge.

### Reference Viewer

The Reference Viewer (-> reference-viewer-in-unreal-engine) generates a graph which represents inter-asset references as a network of connections between the assets themselves. Chunks and individual assets can be examined with this tool. In our ShooterGame example, examining chunk 1 reveals only two directly connected assets: The "Sanctuary" map, and the Primary Asset Label associated with chunk 1.

[image: The reference graph for Chunk 1] The Reference Viewer's graph of assets directly referenced by chunk 1 in ShooterGame. The sanctuary map asset's node has been right-clicked. Click image to enlarge.

Right-clicking a node in the Content Browser or Reference Viewer and selecting **Re-Center Graph** (or double-clicking the node in the Reference Viewer) displays that node's references. In the following image, we have re-centered from chunk 1 to the `Map:/Game/Maps/Sanctuary` node, revealing that the "Sanctuary" map is referenced by two nodes (chunk 1 and chunk 1's Primary Asset Label) to its left, and references many child nodes to its right, such as the `M_FFA_Wall_01` material:

[image: The reference graph for the Sanctuary map] Examination of ShooterGame's "Sanctuary" map (part of chunk 1) in the Reference Viewer. Click image to enlarge.

The graph shown above is not complete. It has been limited by the options set in the Reference Viewer. Limiting the scope of the graph can greatly reduce the time taken by the Engine in building it. For detailed information on those options, see the Reference Viewer page (-> reference-viewer-in-unreal-engine).

Crawling through references in this way, you can see exactly why a given asset is associated with another asset, or a chunk. This can help to discover and remove unnecessary asset references, or adjust your chunking strategy to better fit your project's needs.

- assets
- asset management
- cooking
- chunking
- patching
- dlc
- downloadable content

On this page

- Understanding Primary Asset Rules (-> cooking-content-and-creating-chunks-in-unreal-engine)
- Chunk Organization (-> cooking-content-and-creating-chunks-in-unreal-engine)
- Defining Chunks In Your Project (-> cooking-content-and-creating-chunks-in-unreal-engine)
- Defining Chunks With the Asset Manager (-> cooking-content-and-creating-chunks-in-unreal-engine)
- Defining Chunks With Rules Overrides in Configs (-> cooking-content-and-creating-chunks-in-unreal-engine)
- Defining Chunks With Primary Asset Labels (-> cooking-content-and-creating-chunks-in-unreal-engine)
- Packaging Chunks (-> cooking-content-and-creating-chunks-in-unreal-engine)
- Analyzing Asset-to-Chunk Assignments (-> cooking-content-and-creating-chunks-in-unreal-engine)
- Asset Audit Window (-> cooking-content-and-creating-chunks-in-unreal-engine)
- Size Map (-> cooking-content-and-creating-chunks-in-unreal-engine)
- Reference Viewer (-> cooking-content-and-creating-chunks-in-unreal-engine)

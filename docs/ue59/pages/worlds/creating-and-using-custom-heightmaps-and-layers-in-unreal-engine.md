# Creating and Using Custom Heightmaps and Target Layers

https://dev.epicgames.com/documentation/en-us/unreal-engine/creating-and-using-custom-heightmaps-and-layers-in-unreal-engine?application_version=5.9

> How to use custom heightmaps and target layers to add more dimension to your Landscapes.

[image: Creating and Using Custom Heightmaps and Target Layers]

There will be times your **Landscape** will require that you use external programs to create both the **heightmap** and **target layers** that you need.
Unreal Engine accommodates this style of workflow by allowing for the import of custom heightmaps and target layers.

You use an **Edit Layer** (like a temporary paint layer) to make changes, and those changes are applied to a **Target Layer** (like a specific material blend) on the landscape.

Edit layers function as containers for actors (e.g. meshes, lights) to toggle them on/off or assign them to specific views or visibility sets.

A target layer is a specific layer in your material (e.g. a "grass" or "mud" weightmap) that your active edit is modifying.

[image: Image from the Electric Dreams sample project] The Electric Dreams project

If this is your first time using the Landscape tools, you might want to check out the Landscape Overview first.

## Importing Landscape Data from Image Files

Image files can be imported into landscape heightmaps and target layers, which can be used to customize the look and feel of your Landscape.

### Image File Formats

Image data from .PNG and .RAW files can be imported. The native data format for heightmaps should be single-channel, grayscale, 16 bits per pixel. The native data format for target layers should be single-channel, grayscale, 8 bits per pixel. Standard three-channel RGB images can be used, but color information will be lost and the precision of the import process may be limited. If you are creating an image file in Photoshop to use for importing landscape data, use the following settings when creating a new document for a target layer:

[image: Image of Photoshop sample settings]

Custom image file import formats can be implemented using the `ILandscapeHeightmapFileFormat` and `ILandscapeWeightmapFileFormat` interfaces.

## Using Target Layers in a Landscape Material

Importing image files that are made in an external application provides you with the flexibility to use your preferred terrain workflow, but you first need to make sure that a few things are set up in order to get everything to work smoothly.

- First, make sure that you have created a Landscape to work with. If you have questions regarding the Landscape creation process, check out Landscape Creation.
- Next, make a new material. For this example, you will be making a very basic material that ca be easily expanded upon if needed. The setup for your material should look something like this.[image: Blueprints-showing-materials] | Number | Description |
| --- | --- |
| 1 | `LandscapeLayerCoords` |
| 2 | TextureSample: Uncut Grass from Quixel Megascans (Fab) |
| 3 | TextureSample: Rocky Forest Floor from Quixel Megascans (Fab) |
| 4 | TextureSample: Rock Cliff from Quixel Megascans (Fab) |
| 5 | `LandscapeLayerBlend` |
- Once the material is complete, apply it to the Landscape actor. This will turn your landscape black.[image: Apply the Material to the Landscape Actor] Apply the Material by selecting it in the Content Browser and dragging it to the Landscape Material option in the Details panel.
- To fix the issue, add some Layer Info to your Landscape actor. For this example, create one Layer Info object for each of the three layers. To read more about Layer Info objects, refer to the Layer Info Objects (-> landscape-paint-mode-in-unreal-engine) page.[image: Create Layer Info objects and save them] Create each Layer Info object and save them.
- When completed, your Target Layers section of your Landscape panel should look something like this.[image: Target Layers section with each Layer having a Layer Info] Target Layers section with each Material having an assigned Layer Info.
- Now it is time to import your custom layer. In **Landscape Mode**, on the **Manage** tab, select the Import from file tab. At the **Heightmap** field, use the (**...**) button to **Browse for file**. This will prompt you to choose the .PNG or .RAW file that contains your custom layer data. Your custom layer file should be the same resolution as your Landscape actor's **Overall Resolution** that was set when you created it (the default is 505 x 505).The following chart shows the relation between Landscape heightmap size and Landscape layer size. It is very important that you make sure that your Landscape layer is the correct size. If the layer size is wrong it will not import into UE4. | Landscape Heightmap | Layer size |
| --- | --- |
| 16 x 16 | 16 x 16 |
| 32 x 32 | 32 x 32 |
| 64 x 64 | 64 x 64 |
| 128 x 128 | 128 x 128 |
| 256 x 256 | 256 x 256 |
| 512 x 512 | 505 x 505 |
| 1024 x 1024 | 1072 x 1072 |
| 2048 x 2048 | 2160 x 2160 |
| 4096 x 4096 | 4336 x 4336 |
- If your layers are not output at the correct size, you will see the following warning:[image: error-message-about-file-size]To fix this issue, return to your image editing software and resize your file to match the correct Landscape extent as displayed by the warning message.

## Heightmaps

Using external tools to create a base heightmap to use inside Unreal Engine can be an excellent way of speeding up the Landscape creation process. Programs such as World Machine and Terragen can quickly create the base heightmap for your Landscape. The base can then be imported, cleaned up, or modified using the editing tools inside Unreal Editor, making it a better fit with the world and the desired game play.

For more information on importing and exporting heightmaps, see Importing and Exporting Landscape Heightmaps (-> importing-and-exporting-landscape-heightmaps-in-unreal-engine).

- landscape

On this page

- Importing Landscape Data from Image Files (-> creating-and-using-custom-heightmaps-and-layers-in-unreal-engine)
- Image File Formats (-> creating-and-using-custom-heightmaps-and-layers-in-unreal-engine)
- Using Target Layers in a Landscape Material (-> creating-and-using-custom-heightmaps-and-layers-in-unreal-engine)
- Heightmaps (-> creating-and-using-custom-heightmaps-and-layers-in-unreal-engine)

Related documents

Editing Landscapes

 [image: Editing Landscapes] (-> editing-landscapes-in-unreal-engine)Landscape Paint Mode

 [image: Landscape Paint Mode] (-> landscape-paint-mode-in-unreal-engine)Creating Landscapes

 [image: Creating Landscapes] (-> creating-landscapes-in-unreal-engine)

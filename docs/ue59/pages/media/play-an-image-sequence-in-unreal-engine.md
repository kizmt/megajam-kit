# Play an Image Sequence

https://dev.epicgames.com/documentation/en-us/unreal-engine/play-an-image-sequence-in-unreal-engine?application_version=5.9

> Example of how you can use playback an Image Sequence with the Image Media Source asset.

[image: Play an Image Sequence]

The **Image Media Source** asset provides a way for you play back Image Sequences inside Unreal Engine 5 (UE5) as part of the Media Framework tools.
Image Media Source assets are similar to the File Media Source (-> play-a-video-file-in-unreal-engine) in that you specify a path to your Image Sequence files so it can play them back instead of linking to a video.
Naming conventions are important and it's recommended that you follow a sequentially based system for your images; for example, Image_01, Image_02, Image_03, ensuring that they play back correctly in order.

In this how-to, we apply and use the Image Media Source to play an Image Sequence on a Static Mesh inside the Level.

The **Electra Media Player** does not currently support Image Sequence playback.

This tutorial covers manual workflows for image sequences. As of 5.1, you can also use the Media Plate Actor (-> the-media-plate-actor-in-unreal-engine), which offers drag'n'drop addition of media sources and optimized streaming for pre-built meshes.

## Steps

For this how-to we are using the **Blueprint Third Person Template** project with **Starter Content** enabled.
You will also need an Image Sequence or if you do not have one, you can right-click and download the Sample Image Sequence used with this tutorial.

- In the **Content Browser** expand the **Sources Panel**, then under **Content**, create a new folder called **Movies**.[image: New Folder Movies]
- Right-click on the **Movies** folder, then select **Show in Explorer**.[image: Show in Explorer]While not required, in order to package and deploy your media with your project correctly it is recommended you place it inside **Content/Movies** folder.
- Place the images from your Image Sequence inside the **Content/Movies** folder.[image: Images inside Movies Folder]In the image above, we have created a new folder within **Content/Movies** called **UE5_Images** and within it, placed our JPG images. We also created another folder called **lowres** that contains lower resolution versions of the images in our sequence. The Media Framework tools provide a way for you to work with (typically) lower resolution versions of your images through media source proxies during development. This is more efficient and will help minimize any performance issues when working with larger image sequences and file sizes.
- Return to the **Editor** and click the **Don't Import** button on the **Auto-Import** dialog window inside your Unreal Engine 5 project.[image: Click Don't Import Button]There is no need to import the images into the project as we can point to where they are located within our project's directory.
- Right-click in your **Content/Movies** folder and under **Media**, select **Img Media Source** and call it **MyImageSequence**.[image: Img Media Source]
- Inside the new **MyImageSequence** asset, click the **...** button next to **Sequence Path** and point it to the first image in your image sequence.[image: Sequence Path Button]
- Click the **Advanced Options** rollout button to expand the **Sequence** options and under **Proxy Override**, enter **lowres**.[image: Proxy Override]Here we are pointing to a folder called **lowres** containing our lower resolution images that we will use for development. Working with the lower resolution image files will reduce the memory requirements and provide a more optimized experience than working with the full resolution files.The Proxy Override path must point to a folder of the same name, in the same directory structure as your full resolution images in order to locate it.
- Right-click in the **Content/Movies** folder and under **Media**, select **Media Player**.[image: Media Player]The Media Player asset is what we will use to play back our image sequence we have created.
- In the **Create Media Player** window, enable the **Video output Media Texture asset** option, then click the **OK** button.[image: Video Output Media Texture Asset]This will create and automatically assign a **Media Texture** asset that is associated with this Media Player that will be used for playing our image sequence.
- Name the **Media Player** asset **MyPlayer** (which will automatically name the Media Texture) and double-click to open it.[image: My Player Asset]
- Inside the **Media Editor**, in the **Details** panel, enable the **Loop** option.[image: Enable Loop Option]Enabling this option will cause the Media Player to continually loop (playback) our image sequence.
- Double-click on the **MyImageSequence** asset to start playing the image sequence.[image: Start Playing the Image Sequence]Your image sequence will start to play inside the Media Editor and if you click on the **Info** tab, you will see information about the image sequence that is playing. In our example, we can see that the **Dimension** for our image sequence is **640 x 360** as we are currently set to use our **lowres** images.
- In the **Content Browser**, open the **MyImageSequence** asset and clear out the **Proxy Override** section.[image: Clear Out the Proxy Override Section]This enables us to switch to our full resolution images, where if we open the Media Player asset and play our image sequence again, the **Dimension** values are different.[image: Full Resolution Images]The **Image Cache** progress bar at the bottom of the Player window reflects the amount of content cached in memory (green means fully ready and loaded, yellow is currently being loaded, gray means it's being scheduled for loading). Based on your system hardware, the amount of caching and colors displayed may vary. See the Image Media section of the Media Framework Overview (-> media-framework-overview-for-unreal-engine) for more information.
- From the Main Editor, in the **Place Actors** panel in the **Shapes** tab, drag a **Plane** into the Level and resize and position as desired.[image: Plane Actor]You can use the Transform Tools (-> transforming-actors-in-unreal-engine) to move, rotate or scale the plane as you would like.
- From the **Content Browser**, drag the **MyPlayer_Video** Media Texture asset on top of the **Plane** in the Level.[image: Add My Player Video Media Texture Asset]This will automatically create and apply a **Material** using the Media Texture to the Plane in the Level, which our image sequence will play back on.
- From the Main Toolbar, click the **Blueprints** button then select **Open Level Blueprint**.[image: Open Level Blueprint]Before we can start testing, we will use Blueprint (-> blueprints-visual-scripting-in-unreal-engine) to tell our Media Player to open our Image Media Source asset at the start of gameplay so it can start playing.
- In the **MyBlueprint** panel, create a variable called **MediaPlayer** of the **Media Player Reference** type and assign **MyPlayer** as the **Media Player**.[image: Variable Media Player]You may need to click **Compile** after creating your variable in order to assign the **Default Value** for the **Media Player**.
- Hold **Ctrl** and drag the **MediaPlayer** variable into the graph, then right-click and create an **Event Begin Play** node.[image: Drag the Media Player]
- Drag off the **Media Player** variable and use the **Open Source** node and set **Media Source** to **MyImageSequence** and connect as shown.[image: Set Media Source]
- **Compile** and **Save**, then from the Main Editor click the **Play** button to play inside the editor.

## End Result

After playing in the editor, the image sequence will start to play on the Static Mesh in the Level and loop thereafter.

This example used JPG files, however, you can use any image files that are of the supported file type (-> media-framework-technical-reference-for-unreal-engine) within an Image Media Source. DDS image sequences compressed with BC6H play back as HDR and are decoded on the GPU. Use unsigned BC6H (BC6H_UF16); signed BC6H isn't supported.

- vfx
- media framework
- video playback
- image sequences

On this page

- Steps (-> play-an-image-sequence-in-unreal-engine)
- End Result (-> play-an-image-sequence-in-unreal-engine)

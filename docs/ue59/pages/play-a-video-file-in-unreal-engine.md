# Play a Video File

https://dev.epicgames.com/documentation/en-us/unreal-engine/play-a-video-file-in-unreal-engine?application_version=5.9

> Illustrates how you can play a video file inside a level on a Static Mesh with the File Media Source asset.

[image: Play a Video File]

If you are looking for a way to play a video inside your level, whether it is playing on a TV inside the level, playing in the background as part of your UI or even playing fullscreen you will need to use the **Media Framework** tools and Media Source asset.
While there are different Media Source asset types, the **File Media Source** asset is used when you have a video file stored on a device (for example on your computer, phone or console) that you want to play inside Unreal Engine 5 (UE5).

In this how-to, we use the File Media Source asset to play a video on a Static Mesh inside our level.

This tutorial covers manual workflows for playing video files. As of 5.1, you can also use the Media Plate Actor, which offers drag'n'drop addition of media sources and optimized streaming for pre-built meshes.

## Steps

For this how-to we are using the **Blueprint Third Person Template** project with **Starter Content** enabled.
You will also need a Supported Video File saved on our computer that you want to play. You can use your own or if you do not have a video, you can right-click and download this Sample Video for this tutorial.

- In the **Content Browser** expand the **Sources Panel**, then under **Content** create a folder called **Movies**. Placing your media files inside the **Content/Movies** folder of your project will ensure that your media is packaged with your project correctly.

- Right-click on the **Movies** folder and select **Show in Explorer**.

- Drag your desired video file into the **Content/Movies** folder of your project. In order to package and deploy your content with your project, your media must reside in the **Content/Movies** folder of your project.

- Inside your project, right-click in the **Movies** folder and under **Media** select **File Media Source** and call the asset **SampleVideo**.

- Inside the File Media Source asset, under **File Path** click the **...** button and point to your sample video on your computer. Click image to expand.

- Right-click inside the **Movies** folder again and under **Media** select **Media Player**.

- In the **Create Media Player** window, enable the **Video out Media Texture asset** option then click **OK**. This will create a **Media Texture** asset and automatically assign it to the Media Player we are creating. The Media Texture is responsible for playing back the media content and we can use this to create a **Material** that will be applied to a Static Mesh in our level a little later in this guide.

- Name the Media Player and Media Texture asset, **MyPlayer** and **MyPlayer_Video** then open the **MyPlayer** Media Player asset. Click image to expand.

- Double-click on the **SampleVideo** in the **Media Library** section. Click image to expand. When double-clicking on the File Media Source asset inside the Media Library section, the video will start playing back. This is because the **Play on Open** option is enabled in the **Playback** section of the **Details** panel. When this option is checked, whenever a Media Source asset is opened, it will automatically start playing back and does not need to explicitly be told to start playing. While our video plays back inside the Media Editor, a little later in this guide we will need to tell our Media Player through Blueprint Visual Scripting (-> blueprints-visual-scripting-in-unreal-engine) to open our File Media Source asset during gameplay so that the file will start playing while we are playing our game.

- From the **Place Actors** panel in the **Basic** tab, drag a **Plane** into the level and use the **Transform** tools to move/scale the mesh as desired. Click image to expand. With the Plane selected in the level, use the Transform tools and **Translate (W)**, **Rotate (E)** and **Scale (R)** the mesh to your desired appearance.

- Drag the **MyPlayer_Video** Media Texture asset onto the **Plane** inside the level to auto create and assign a new **Material**. Click image to expand. When dragging the Media Texture onto the Static Mesh in the level, it will automatically create a new Material in the **Content Browser** and apply it to the mesh in the level.

- With the **Plane** selected in the level, in the **Details** panel click the **Add Component** button and search for and add a **Media Sound**. The **Media Sound** component is used to define the audio that will playback alongside the video.

- In the **Details** panel, select the new **Media Sound** component then under the **Media** section, set the **Media Player** to use **MyPlayer**. Click image to expand. Here we are associating the Media Sound component with our Media Player asset so it knows where to draw audio from.

- From the main toolbar, click the **Blueprints** button and select **Open Level Blueprint**. We will use the **Level Blueprint** and tell our Media Player to open our File Media Source asset at the start of gameplay so it will start playing in the level.

- Add a **Variable** of the **Media Player Reference** type called **MediaPlayer** and set the **Default Value** to **MyPlayer**. Click image to expand. You may need to create the variable, then click the **Compile** button in order to define a **Default Value**.

- Hold the **Ctrl** key and drag the **MediaPlayer** into the graph, then right-click in the graph and search for and add an **Event Begin Play** node.

Click image to expand.

We now have a node to signify the start of gameplay and a reference to our Media Player asset. The last thing we need to do is tell our player to open a Media Source.

- Left-click and drag off the **Media Player** node and use the **Open Source** function with **Media Source** set to **SampleVideo** and connect to the **Event Begin Play**. Click image to expand.

- Close the **Level Blueprint**, then click the **Play in Editor** button.

## End Result

When you play in the Editor, the video will start playing on the Static Mesh.

**Media Player** assets by default are set to **Play on Open** which is why the video automatically starts playing when calling the **Open Source** function.
There are additional commands you can issue to the Media Player asset such as pausing, rewinding or stopping the video once it has begun playing which can be found under the **Media Player** section when dragging off the Media Player Reference.

In this example we elected to put our media content inside our project's **Content/Movies** folder. While this is not a requirement it is recommended in the event that you want to package your project, as this is the only folder that will automatically include the content as part of the packaging/deployment process.
You could point your File Media Source asset to folders outside of this location and the media will play, however if you were to deploy this to a mobile device for example, the content would not be included as part of deployment.

- media framework
- video playback
- virtual sets

On this page

- Steps (-> play-a-video-file-in-unreal-engine)
- End Result (-> play-a-video-file-in-unreal-engine)

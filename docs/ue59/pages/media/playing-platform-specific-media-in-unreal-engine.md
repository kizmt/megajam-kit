# Playing Platform Specific Media

https://dev.epicgames.com/documentation/en-us/unreal-engine/playing-platform-specific-media-in-unreal-engine?application_version=5.9

> Shows how the Platform Media Source asset can be used to play platform specific media.

[image: Playing Platform Specific Media]

If you are working on a multi-platform project, there may be instances where you want to play platform specific media.
For example, you may want a specific movie to play when playing on PlayStation 4 (PS4) and a different movie to play when playing on the Xbox One.
Or you may be using the same type of media, but it is encoded differently for performance reasons and want those different formats to play on different platforms.

With the **Platform Media Source** asset, you can determine which Media Source assets should play based on the platform it is running on.
When you open/play the Platform Media Source, it will look at which platform you are currently on and play the assigned Media Source automatically.

In this how-to, we create a Platform Media Source and assign two different Media Sources for Android and Windows platforms.

## Steps

For this how-to we are using the **Blueprint Third Person Template** project with **Starter Content** enabled.
We are also using two sample videos which you can download by right-clicking this Platform Videos link and extract the contents on your computer.

- In the **Content Browser** expand the **Sources Panel** and add a new folder called **Movies** then right-click on it and **Show in Explorer**.

- Drag the sample videos or your desired media files into the **Content/Movies** folder of your project. If you want to package and deploy your project along with any media files, you will need to place them inside the **Content/Movies** folder of your project.

- In your project under the **Content/Movies** folder of the **Content Browser**, right-click and under **Media** select **File Media Source** and name it **Android_Movie**. Here we are creating a Media Source asset that the **Platform Media Source** asset can point to and use if it is running on an Android device.

- Create another **File Media Source** asset and call it **Windows_Movie**.

- Open the **Android_Movie** Media Source, then for the **File Path** use the **Gideon_720x480** (or your desired video) and select **Open**. For our Android movie, we are using a **.3GP** video file which is better suited for playback on Android devices while our Windows movie is an **.MP4** file.

- Open the **Windows_Movie** Media Source, then point the **File Path** to the **Infiltrator Demo** (or your desired video) and select **Open**.

- Right-click in the **Content/Movies** folder then under **Media**, select **Platform Media Source** and call it **Platform_Source**. Now that we have multiple Media Source assets, we can define which Media Source is to be played on which Platform with the **Platform Media Source** asset.

- Open the **Platform_Source**, then under **Android** select the **Android_Movie** and under **Windows** select the **Windows_Movie**. In our example we are using two different videos. However, you can use the same video that is encoded differently or in a different format for use with different devices. You may also use different Media Source types, for example, on Windows you may elect to use a Media Stream (-> play-a-video-stream-in-unreal-engine) to pull content from a website instead of using a file on disk.

- Right-click in the **Content/Movies** folder then under **Media**, select **Media Player**. We still need to use a **Media Player** to open and play our **Platform Media Source** asset.

- In the **Create Media Player** window, enable the **Video output Media Texture asset** option then click **OK** and call the asset **Media Player**. This will automatically create a **Media Texture** associated with this Media Player that we can use inside a Material (-> unreal-engine-materials). We can then take that Material and apply it to a mesh in our Level to play our content on.

- Inside the **Media Player** asset, double-click on the **Platform_Media** asset in the **Media Library** window. Double-clicking on the **Platform_Source** asset will start playback of only the **Windows** assigned Platform Media Source (since we are running on the Windows platform). Through Blueprint or C++, we could open the **Android_Movie** Media Source for playback however when we open the Platform_Source, only the Media Source assigned to Windows will play. Also, the **Play on Open** option is enabled by default which will allow the Media Player to start playback of whatever Media Source is opened.

- In the Main Editor window, from the **Modes** panel under **Basic**, drag a **Plane** into the Level and resize as desired then drag the **MediaPlayer_Video** texture onto it. By dragging the **Media Texture** asset onto the Static Mesh in the Level, a Material is created and applied and will playback our media. If you are using a Texture Sample or Texture Object with the **Electra Media Player**, set the **Sampler Type** to **Color**.

- With the **Plane** selected, in the **Details** panel add a **Media Sound** component with the **Media Player** option set to use your **MediaPlayer** asset.

- From the Main Toolbar, click the **Blueprints** option then select **Open Level Blueprint**.

- In the **MyBlueprint** panel create a variable called **MediaPlayer** of the **Media Player Object Reference** type then assign your **MediaPlayer** as the **Media Player** to use. This creates a reference to your Media Player asset which you can then use within Blueprint and call actions on. In order to set the **Default Value** for the variable, you may need to first click **Compile** to compile the Blueprint.

- Hold **Ctrl** and drag the **MediaPlayer** variable into the graph, right-click and add a **1** keyboard event and connect to an **Open Source** node pointing to the **Platform_Source**. Here we are telling our Media Player to open the **Platform Media Source** asset which is set to open other Media Source assets based on which platform it is being run on.

- Close the **Level Blueprint** then click the **Play** button to play in the Editor.

## End Result

When you play in the Editor, pressing the **1** key will open the Windows-defined Media Source inside the Platform Media Source.

If you were to deploy this project to an Android Device, the Android assigned Media Source asset would play.

- vfx
- media framework
- video playback

On this page

- Steps (-> playing-platform-specific-media-in-unreal-engine)
- End Result (-> playing-platform-specific-media-in-unreal-engine)

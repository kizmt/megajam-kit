# Play a Video Stream

https://dev.epicgames.com/documentation/en-us/unreal-engine/play-a-video-stream-in-unreal-engine?application_version=5.9

> Shows how you can stream video from the internet and play it inside a UI element.

[image: Play a Video Stream]

A **Stream Media Source** is an asset that enables you to stream a video in the supported URL format inside Unreal Engine 5 (UE5).
With the stream defined, you can load it up and play it inside UE5 with a **Media Player** asset and (with an associated **Media Texture**) can assign it to various aspects of your level.

The stream can be loaded and played as part of a UI element, played fullscreen or even applied to a Static Mesh (such as a TV) and played inside your level.

For this how-to, we use Unreal Motion Graphics (-> umg-editor-reference-for-unreal-engine) (UMG) to create a UI element that will play a streamed video fullscreen.

You don't need to use C++ for this how-to.

## Recommended Setup

For this how-to we are using the **Blueprint Third Person Template** project with **Starter Content** enabled.

## 1. Creating the Streaming Media Source and Texture

- In the **Content Browser** expand the **Sources Panel** and create a new folder called **Media** inside the **Content** folder.

- Right-click inside the empty Media folder, then under **Media**, select **Stream Media Source** and name the asset **MediaStream**.

- Open **MediaStream** then enter your desired **Stream URL**. If you do not have a URL file to link to, right-click this Sample Video and copy the link address and paste it in the Stream URL field. Your Stream URL must link directly to a supported format in order to play the video. For example, PS4Media (PS4) only supports MP4 through HLS in the latest engine version, while WmfMedia (Windows) can support a number of other stream sources. For further information on supported formats per platform/player plug-in, see the page.

- Right-click inside the Media folder, then under **Media**, select the **Media Player** asset.

- In the **Create Media Player** window, enable **Video output Media Texture asset** then click **Ok**. This will automatically create and associate a Media Texture asset linked to this **Media Player** asset which is needed for playback.

- Name the new Media Player Asset **MyPlayer** which will automatically be applied to the created **Media Texture** asset. If you are using the **Electra Media Player**, open the newly created Media Texture asset in the Editor. In the Details panel: Enable **Enable new style output**.

- Set **Output format (new style)** to **Default (sRGB)**.

## 2. Associating the Media Source With a Material

- In the Media folder, create a new **Material** and call it **MyPlayer_Material**. [image: New material that will be used for the streaming media source]

- Open **MyPlayer_Material** and change its **Material Domain** to **User Interface**. This will change the Result node so that it has user interface outputs. [image: Material domain set to User Interface]

- Click and drag **MyPlayer_Video** from the Content Browser into the graph for **MyPlayer_Material**. This will create a **Texture Sample** node with MyPlayer_Video as the source.

- Connect the **RGB** pin to the **Final Color** input for your material. [image: Final material using streaming media source] If you are using a Texture Sample or Texture Object with the Electra Media Player, you will need to set the **Sampler Type** to **Color**.

## 3. Adding the Media Source to a User Interface Widget

- Right-click in the Media folder, then under **User Interface** select **Widget Blueprint** and call it **HUD**. A **Widget Blueprint** is an asset that is used with UMG (-> umg-editor-reference-for-unreal-engine) to create UI elements within Unreal Engine which we will apply our streaming video to.

- Inside the **HUD** Widget Blueprint, from the **Palette** window drag an **Canvas Panel** into the graph and stretch it to fill the grid's aspect ratio.

- From the **Palette** window drag an **Image** into the graph inside **Canvas Panel** and stretch it to fit. We are going to apply our Media Texture to this image, and the image will fill the player's viewport when playing the game (creating a video that will play fullscreen).

- In the **Details** panel for the **Image** under **Appearance** expand **Brush** then set the **Image** to **MyPlayer_Material**.

- In the **Details** panel for the **Image** under **Slot**, click the **Anchors** dropdown and select the anchor middle option. This will ensure that the image stays fixed in the center of the viewport regardless of viewport size.

## 4. Playing the Media Source

- Close the **HUD** Widget Blueprint, then from the Level Editor Toolbar, select **Blueprints** and **Open Level Blueprint**.

- Create a new variable called **MediaPlayer** of the **Media Player Reference** type and set the **Default Value** to your **MyPlayer** Media Player asset. You may need to click **Compile** in order to see the Default Value of your **MediaPlayer** variable.

- Hold **Ctrl** and drag the **MediaPlayer** variable into the graph to create a **Get** node for this variable, then right-click and add an **Event Begin Play** node. When our game starts, we will go through the process of creating and displaying our **HUD**, set up sound for our stream, then open our stream so that it plays.

- Right-click and add a **Create Widget** node and set **Class** to **HUD**, then off the **Return Value** use **Add to Viewport** and connect as shown.

- Following the **Add to Viewport** node, right-click and use **Add Media Sound Component** and set the **Media Player** to **MyPlayer** in the **Details** panel. In order to hear audio along with your video, you will need to use a Media Sound Component which points to your Media Player asset. Here we are dynamically creating and adding one at runtime. However, you can also add this component to an Actor that exists in the level or as part of a Blueprint from the **Components** panel.

- Following the **Add Media Sound Component** node off the **Media Player** reference node, use **Open Source** and set **Media Source** to your **MediaStream** asset. Click image for full view. With our node network complete, when the game starts our **HUD** will be created and displayed, and sound will play along with our Media Stream we open it for play.

- Close out the Level Blueprint, then click the **Play** button to play in the Level.

## End Result

After playing in the Editor, the video will start playing back in full screen as part of our **HUD** Widget Blueprint.

Similar to using a File Media Source (-> play-a-video-file-in-unreal-engine) which plays a video file from disk, Stream Media Sources will automatically play when calling **Open Source** if their associated **Media Player** asset are set to **Play on Open** which by default is enabled.
There are additional commands you can issue to the Media Player asset such as pausing, rewinding or stopping the video once it has begun playing which can be found under the **Media Player** section when dragging off the Media Player Reference.

- vfx
- media framework
- video playback

On this page

- Recommended Setup (-> play-a-video-stream-in-unreal-engine)
- 1. Creating the Streaming Media Source and Texture (-> play-a-video-stream-in-unreal-engine)
- 2. Associating the Media Source With a Material (-> play-a-video-stream-in-unreal-engine)
- 3. Adding the Media Source to a User Interface Widget (-> play-a-video-stream-in-unreal-engine)
- 4. Playing the Media Source (-> play-a-video-stream-in-unreal-engine)
- End Result (-> play-a-video-stream-in-unreal-engine)

Related documents

UMG Editor Reference

 [image: UMG Editor Reference] (-> umg-editor-reference-for-unreal-engine)

# Using Media Playlists

https://dev.epicgames.com/documentation/en-us/unreal-engine/using-media-playlists-in-unreal-engine?application_version=5.9

> Shows how to create and work with Media Playlists using the Media Framework tools.

[image: Using Media Playlists]

When working with media assets in Unreal Engine 5 (UE5), there may be times where you have a series of videos that you want to play in a specific order or you want to allow players to access videos within a specific series of videos.
This can be accomplished by using a **Media Playlist** asset which points to **Media Source** assets assigned in a predefined order.

In this how-to, we create a Media Playlist and allow the player to play each asset sequentially or access a specific video inside the playlist through a key press.

## Steps

For this how-to we are using the **Blueprint Third Person Template** project with **Starter Content** enabled.
We are also using three sample videos in our playlist which you can download by right-clicking this Sample Videos link and extracting the contents on your computer.

- In the **Content Browser** expand the **Sources Panel**, and create a folder called **Movies** then right-click on it and **Show in Explorer**. In order to successfully package and deploy your video files along with your project, your videos must be placed inside the **Content/Movies** folder of your project.

- Drag the Sample Video files provided into the **Content/Movies** folder of your project.

- In your project, right-click in the **Content/Movies** folder then under **Media** select **File Media Source**.

- Create three **File Media Source** assets called **Video_01**, **Video_02** and **Video_03** respectively.

- Inside **Video_01**, point the **File Path** to the **Gideon_720x480** file (or your desired video file) then click the **Open** button.

- Repeat the previous step and assign videos for the **Video_02** and **Video_03** assets.

- Create a **MediaPlayer** asset called **MediaPlayer** with an associated **Media Texture**, then open the **MediaPlayer** asset. Double-clicking on a video inside the **Media Library** window will play the selected file. You can also set the player to **Shuffle** the playback order of videos in a playlist by enabling the option in the **Details** panel. The **Loop** option will loop the playback of entire playlist (or a single source if there is only one source in the Media Playlist). Our Media Player is also set to **Play on Open** which means, when we open this Media Source associated with this Media Player, it will automatically start playing. In the **Playlist** window, you can save out new playlist assets.

- Inside the **Content/Movies** folder of the **Content Browser**, right-click and under **Media** select **Media Playlist** and call it **MyPlaylist**.

- Open the **MyPlaylist** asset, then in the **Media Library** window, double-click on a video and add each to the playlist. You can also use the **+** button to add new items to the playlist and the drop-down menu to select the type of Media Source to add. Inside the **Playlist** window you can insert, duplicate or delete items from the playlist or left-click and drag rows to reorder the playback order by clicking the tab along the left side of each row. At the top of the Media Playlist window, the **Loop** option is available if you want to loop the entire playlist.

- From the **Place Actors** panel of the Main Editor window in the **Shapes** tab, drag a **Plane** into the Level and use the **Transform Tools** to resize it. Using the Transform Tools you can move (**W key**), rotate (**E key**), or scale (**R key**) the plane as desired as we will play our videos on this Static Mesh.

- From the **Content Browser**, drag the **MediaPlayer_Video** Media Texture asset onto the plane in the Level to create and apply a new Material. When dragging the **Media Texture** onto the Static Mesh in the Level, a **Material** will automatically be created and applied to the mesh, enabling us to play our videos.

- With the **Plane** selected in the Level, in the **Details** panel click the **Add Component** button and add a **Media Sound** component. The **Media Sound** component enables us to associate audio with a Media Player and provides a way for the audio to be played along with our video.

- Select the **Media Sound** component, then under the **Media** section assign your **MediaPlayer** asset.

- From the Main Toolbar, click the **Blueprints** button and select **Open Level Blueprint**. While our video plays inside the Media Editor, in order to play during gameplay we will need to open our playlist so it can start playing.

- In the **MyBlueprint** window, create a variable called **MediaPlayer** of the **Media Player Object Reference** type and set the **Default Value** to your **Media Player** asset. You may need to **Compile** your Blueprint in order to set the **Default Value**.

- In the graph, right-click and add a **1** Keyboard Event, then hold **Ctrl** and drag the **MediaPlayer** variable into the graph.

- Drag off the **MediaPlayer** variable and use **Open Playlist Index** (with **In Playlist** set to **MyPlaylist**) and connect to the **Pressed** of the **1** keyboard event. Here, when the Player presses the **1** key on the keyboard, the playlist will open (and start playing) with the first video in the list. The index refers to the playlist index order specified inside your Media Playlist asset (pictured below) and is zero-based with zero being the first video in your playlist. With the **Open Playlist Index** node, you can specify which file you want to open within a playlist by entering its index value.

- Right-click and add **2** and **3** keyboard events to **Open Playlist Index** for **Index 1** and **Index 2** respectively. With this setup, when you press 1 you will open the first file in the playlist, 2 the second and 3 the third.

- Right-click and add a **Left** and **Right** keyboard event to call **Previous** and **Next** nodes and **0** to **Open Playlist**. The **Previous** and **Next** nodes will jump to the previous video and next video in a playlist respectively while the **Open Playlist** node executes the same functionality as opening a playlist at index 0 (or the start of the playlist). With these nodes, we will be able to cycle through our playlist by using the **Left** and **Right** arrow keyboard keys and pressing the **0** key will open the playlist at the start of our playlist.

- Close the **Level Blueprint** then click the **Play** button to play in the Editor.

## End Result

When you play in the Editor pressing the **1**, **2**, **3** or **0** keys will start playback at the specified index (if applicable).

When a video ends, it will automatically jump to the next video in the playlist. If you enabled **Loop**, once the final video in the playlist plays, it will jump back to the start of the playlist.
While the video is playing, you can press the **Left** or **Right** arrow keys to jump to the previous or next video in the playlist or the **1**, **2**, or **3** keys to jump directly to a video in the playlist.

- vfx
- media framework
- video playback

On this page

- Steps (-> using-media-playlists-in-unreal-engine)
- End Result (-> using-media-playlists-in-unreal-engine)

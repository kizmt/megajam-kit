# Geometry Cache Track

https://dev.epicgames.com/documentation/en-us/unreal-engine/cinematic-geometry-cache-track-in-unreal-engine?application_version=5.9

> The Geometry Cache Track enables the scrubbing and playback of cloth and other Alembic mesh simulations on Static Meshes.

[image: Geometry Cache Track]

Learn to use this **Experimental** feature, but use caution when shipping with it.

The **Geometry Cache Track** enables you to scrub through a **Geometry Cache** and render it out with frame accuracy. Once you have imported your Alembic file into Unreal Engine and added it to a Level, you can add it to a **Level Sequence** and add the **Geometry Cache Track** to play your content.

## Steps

For this How-to guide, we are using the **Blueprint Third Person **template project. You will also need an Alembic file to import into the Engine. If you do not have your own asset, download this Sample File.

- Import your Alembic file(s) into Unreal Engine as a Geometry Cache and define your desired settings.

- Place your **Geometry Cache** in the Level, then create a **Level Sequence** and add it to **Sequencer** with the **+ Track** button.

- Click the **+ Track **button for the newly created Track and select **Geometry Cache **from the **Tracks **menu.

- Scrub the **Timeline** to view a playback. You can also set the **Level Sequence** to **Auto Play** before selecting Play in the Level.

## End Result

With the **Geometry Cache Track **set, you can scrub through your content or it will play back automatically when your Level Sequence plays.

You can access the properties of the Geometry Cache by right-clicking on the Track in the **Tracks Window**. From the properties menu, you can change which **Geometry Cache **asset is being used, add a **Start **or **End Offset**, or adjust the **Play Rate.** There are also options for the **Section **itself and whether to play the animation in **Reverse**.

The following properties are available for Geometry Cache tracks from the right-click context menu, under **Properties**:

| Property | Description |
| --- | --- |
| **Geometry Cache** | Specifies the Geometry Cache asset to play. |
| **Start Offset** | Number of frames to offset into the beginning of the animation clip. |
| **End Offset** | Number of frames to offset into the end of the animation clip. |
| **Play Rate** | Defines the playback rate of the animation clip (lower to slow down, increase to speed up). |

- landing page
- experimental
- alembic
- sequencer
- geometry cache

On this page

- Steps (-> cinematic-geometry-cache-track-in-unreal-engine)
- End Result (-> cinematic-geometry-cache-track-in-unreal-engine)

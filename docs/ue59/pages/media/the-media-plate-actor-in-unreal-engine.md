# The Media Plate Actor

https://dev.epicgames.com/documentation/en-us/unreal-engine/the-media-plate-actor-in-unreal-engine?application_version=5.9

> Using the Media Plate Actor in Unreal Engine

[image: The Media Plate Actor]

Unreal Engine’s **Media Plate** is a pre-built actor that you can add to your scene to play video, image sequences, and any URL towards a Media framework supported asset. The Media Plate actor is the easiest way to play a Media Source in your scene. You can use a Media Plate to display video backgrounds that sync with virtual cameras, making it valuable in virtual production for film or broadcasting. It’s useful for adding in-game TVs, screens, or billboards, where you want to dynamically play different media content.

[image: The Media Plate Actor shown streaming media in the Viewport]

The Media Plate Actor supports:

- A simplified process for importing video
- Optimized streaming for tiled EXR image sequences with the built-in Sphere and Plane meshes (-> the-media-plate-actor-in-unreal-engine). Requires DX12 or higher.
- Media Playlists
- Drag and drop assets and Actors
- Sequencer integration
- View frustum culling
- Seamless looping

## Creating a Media Plate Actor

There are multiple ways to create a Media Plate Actor.

You can either:

- Drag a media file (video file or an image from a sequence) directly into the Viewport.
- Drag a media source asset (-> the-media-plate-actor-in-unreal-engine) from your Content Drawer into the Viewport.
- Use the Place Actors menu (-> placing-actors-in-unreal-engine)

## Importing Media Sources

Media Plate supports a variety of Media Source assets, including video files, image sequences, and capture cards like the AJA Media Source, the Black Magic Media Source, the Rivermax Media Source, and other similar capture card Media Sources. Depending on which media type you use, there are different ways to import them and denote the reference path of the related assets in Unreal Editor.

Common to all of these ways is that they immediately create the Media Plate Actor, which you can then configure using the Media Plate Controls (-> the-media-plate-actor-in-unreal-engine).

### Import Video Files

To import a video file:

- Open the **Content Drawer**.
- Drag your video file into the **Content Drawer** and drop it there.
- Drag the file from the **Content Drawer** into the **Viewport**. This creates the Media Plate actor.

[image: Drag a video file into the Content Drawer]

### Import Media Sequences

To import a media sequence:

- In the **Content Drawer**, create an **Img Media Source**.
- Under **Sequence** > **Sequence Path**, assign the path to the folder containing your images.
- Optional: Under **Advanced** > **Frame Rate Override**, set the image sequence frame rate. If you don't specify anything here, the Media Plate Actor uses the default frame rate under your global settings.
- Drag the **Img Media Source** from the **Content Drawer** into the **Viewport**. This creates the Media Plate actor.

### Import Capture Card Media Sources

To import a capture card media source, including AJA, Blackmagic and Rivermax:

- Open the **Content Drawer**.
- Create and configure a new capture card Media Source asset.
- Drag the capture card Media Source asset from the Content Drawer into the **Viewport**. This creates the Media Plate actor.

Using capture card Media Source assets requires you to first install and configure a capture card. For more information on using a capture card, see theProfessional Video I/O (-> professional-video-io-in-unreal-engine) (for AJA and Blackmagic) and Using SMPTE 2110 with nDisplay (-> using-smpte-2110-with-ndisplay) (for Rivermax) documentation.

## Play Media Files Using an Existing Media Plate Actor

If you've already created a Media Plate Actor, you can reference media files you want to play directly from the **Details** panel. There are three ways to do this:

### Play an External Media File

To play an external media file directly on a Media Plate actor without importing it to the Content Browser (to avoid cluttering your project with reference media or when video files are too big to be embedded in your UE project), follow these steps:

- Select the **Media Plate actor** in the **Viewport**.
- In the **Details** panel, go to **Media **> **Playlist**.
- Click **File.**
- Click the **ellipsis (…)** to select a media file and set the file path.

[image: Media Plate external file]

You can configure which media player to use to play external media files, under **Project Settings > Electra Protron Factory**. You can select Protron as your preferred player when none is defined (for external files). This also directs the automatic schema of the File Media Source to prefer Protron over Electra or WMF players.

[image: Electra Protron Factory plugin settings]

### Play a File Media Source Asset

To play a File Media Source asset in the Content Browser on an existing Media Plate actor, follow these steps:

- Select the **Media Plate actor** in the **Viewport**.
- In the **Details** panel, go to **Media **> **Playlist**.
- Click **Asset.**
- Find and select your **File Media Source asset** in the Content Browser.

[image: Media Plate File Media Source asset]

### Play a Media Playlist

To play multiple media files using a Media Playlist asset in the Content Browser on an existing Media Plate actor, follow these steps:

- Select the **Media Plate actor** in the **Viewport**.
- In the **Details** panel, go to **Media **> **Playlist**.
- Click **Playlist.**
- Find and select your **Media Playlist asset** in the Content Browser.

[image: Media Plate Playlist]

## Media Plate Settings

In the Media Plate Actor settings, you can adjust the look and playback of your video or image sequence. You do not need to create a Media Texture or Media Player.

The Media Plate has the following settings

### Transform

In the **Transform section**, you can adjust the position, scale, and orientation of the Media Plate Actor. To read more about these settings, refer to Transforming Actors in Unreal Engine (-> transforming-actors-in-unreal-engine).

### Control

| Property | Description |
| --- | --- |
| Play on Open | Makes the video or image automatically start playing when opened. |
| Auto Play | Automatically opens the video or image sequence when you enter game mode. |
| Enable Audio | If an audio track exists, this setting enables audio for the active video decode engine. |
| Start time | You can use this to set a custom start time. This allows different Media Plate Actors that use the same source video to start at different times. You can then use the same loopable clip in multiple instances in your level, appearing different each time. |
| Play Only when Visible | Applies frustum culling to the Media Plate Actor so the whole video decode and streaming stops when the Actor is outside of the frustum. This is typically useful for large installations with clustered rendering like nDisplay. Especially if you're using several large and resource heavy Media Plates. |
| Loop | Automatically loops the video when it reaches the last frame. |

### Geometry

Here, you can select whether to use a **Plane**, **Sphere**, or a **Custom** mesh. When you select one, the referenced mesh automatically appears and the relevant settings for that mesh type become available for you to configure.

If you are using a tiled EXR image sequence and have DX12, or above, graphics capability, we recommend you select a **Plane** or **Sphere** mesh. Both these pre-built meshes use the Media Plate Actor's optimized streaming, so only the tiles visible to the camera are streamed. Custom meshes stream all tiles, regardless of their visibility to the camera. If you want to convert your media to the EXR format, you can use the Process EXR tool (-> convert-media-into-the-exr-format-with-the-process-exr-tool-in-unreal-engine). You can also convert your media to tiled EXR or TMV with the **TMV Transcoder**. In the **Content Browser**, right-click your media source asset and select **Transcode to EXR** or **Transcode to TMV**.

### Playlist

When you add a video or image sequence, Unreal Editor automatically creates a **Media Playlist** to hold the video asset reference, visible in the Media Playlist section. This section also displays the references to the initial Media Source as well as the Media Path.

This section also contains clickable icons you can use to **Restart**, **Rewind**, **Play**, **Pause**, **Fast Forward**, **Open**, and **Close** the playlist.

The **Open Media Plate** button lets you open a media plate window with a flat-facing mesh that shows you more in-depth information about the media. In this window, you can also use the **Previous** and **Next** icons to access other media in your playlist.

### Media Details

The **Media Details** section includes information about your media's resolution, frame rate, size, method, format, combined level of detail bias, and its number of mips and tiles.

### Media Texture

| Property | Description |
| --- | --- |
| Enable RealTime Mips | If true, the Media Texture generates the Mip Map chain for every video frame. When enabled, video frames visible in the Media Plate Quad are smoother and without aliasing artifacts. The mips count is computed automatically without requiring you to specify a value. |

### Materials

The **Materials** section lets you pick another Material to override the existing default Media Plate Material. The default is a translucent and non-lit Material that renders pixels in the emissive channel. This Material is bundled within the **Media Plate Plugin** content directory.

To pick another material for the Media Plate Actor:

- Select the Media Plate Actor.
- In the **Details** panel, click the **Rendering** filter to bring up the **Materials** section.
- In the **Materials** section, click the **Select Media Plate Material** dropdown and select the new material.

[image: A screenshot of the Details panel. The Select Media Plate Material dropdown is highlighted.]

The Media Plate Actor looks for a special **Texture** parameter called **MediaTexture**. This parameter must exist within the chosen Material so that it can bind and access the pixels received from the video decoder **MediaTexture**.

Media Plate comes with the following default materials:

For 2D plates:

| Material name | Description |
| --- | --- |
| M_MediaPlate | Is translucent. This is the default selection. If you move away from a translucent material, you might experience TSR ghosting artifacts. |
| M_MediaPlateCC | Color correction material. |

For Skies:

| Material name | Description |
| --- | --- |
| M_Sky | Opaque, with the `IsSky` boolean enabled. |
| M_SkyCC | Color correction material for skies. |

**Holdout Composite Checkbox**

You can enable the Media Plate actor **Holdout Composite** feature (used to bypass TSR and Tonemap) through a checkbox in the Rendering > Material settings.

[image: Media Plate actor Holdout Composite feature]

### EXR Tiles and Maps

| Property | Description |
| --- | --- |
| Visible Mips Tiles Calculations | By default, this setting matches the static mesh you've chosen. If you want to use a Plane or Sphere, but do not want the Media Plate to only stream pixels visible to the camera, then you can set this to **None**. This can be useful for debugging, but we recommend that you do not use this for production. |
| Mip Map Bias | Offsets the requested mipmap level to adjust performance. Sometimes, a PC is unable to playback a certain EXR sequence because of bandwidth, even though the sequence is split in tiles and mips. To reduce the input/output (IO) bandwidth, you can offset the Media Plate Actor in either direction to load higher mips, which are lower resolution. The estimated Mip Map level matches the renderer by default, which makes it dependent on Field Of View (FOV) and resolution. |
| Enable Mip Map Upscaling | If true, this option forces upscale the selected Mip Map level set in the **Upscale Mip Level** setting. Normally, Media Plate only loads the required quality mips and tiles in the viewport. In some cases, for example for reflections and skylights, you might have to load lower-quality tiles outside of the viewport for areas of the EXR texture that are not directly visible to the camera but do still contribute to lighting and reflection. |
| Upscale Mip Level | The Mip Map level that’s enabled by the **Enable Mip Map Upscaling** setting. For example, if this property is set to 3, then textures with a Mip Map level of 3 or higher are fully read into the texture. Textures with a Mip Map level of 2 or lower use the texture for Mip Map level 3, but are scaled up to the dimensions of the texture for the actual Mip Map level. When recording, the area visible by the camera contains the proper quality mips, while everything not directly visible by the camera contains lower quality mips that have been upscaled. |

When **Visible Tiles & Mips Logic** is set to **Sphere**, the section includes another property:

| Property | Description |
| --- | --- |
| Adaptive Pole Mip Upscale | Reduces quality at the poles of the sphere to reduce load. Only available if spheric mesh is used. With a spheric mesh, the tiles are bunched up near the poles of the sphere. If you have a large `.exr` file (16k), the system needs to load more tiles. Using this option, the system decides if it should load higher level mips (lower quality) to reduce load. |

### Cache

| Property | Description |
| --- | --- |
| Override | Reduces quality at the poles of the sphere to reduce load. Only available if spheric mesh is used. With a spheric mesh, the tiles are bunched up near the poles of the sphere. If you have a large `.exr` file (16k), the system needs to load more tiles. Using this option, the system decides if it should load higher level mips (lower quality) to reduce load. |
| Look Ahead | The time in seconds to look ahead for caching. For adequate caching, we suggest 2-4 frames. At 24fps, 2 frames should take 0.084 seconds. The default value of this setting is 0.2s. The more frames you cache, the more frames need to be invalidated and reloaded when the camera moves. |

### Advanced Settings

| Property | Description |
| --- | --- |
| Audio Component | Contains details of any audio components used. |
| Static Mesh Component | Contains advanced details and properties of the mesh component used. |
| Other > Letterboxes | Contains details of any letterboxes used. |

## Overlay Materials Technique

To help with temporal and anti-aliasing artifacts present while doing playback, Overlay Materials allow the Media Plate Actor to render the video frame in its own compositing pass. The actor does so without jitter into the after-motion-blur translucency render target, and composites back into scene color after Temporal Super Resolution (TSR). You can set the overlay material to the correct final resolution (after upscale) with **r.Translucency.SeparateResolution.Basis**.

Because the Overlay Materials technique uses the translucency render target, it is only effective on videos with no translucency.

To apply Overlay Materials, follow these steps:

- Create a Media Plate Actor (-> the-media-plate-actor-in-unreal-engine) in your level.
- In the Level Editor, right-click on the Media Plate Actor and click **Apply Overlay Composite Materials**. This replaces the Base Material, adds an Overlay Material, and enables the translucency variable.

[image: Apply Overlay Composite Materials and Reset Default Materials]

To remove the Overlay Composite Material from the Mediate Plate Actor, you can click Reset Default Materials.

## Sequencer Integration

**Sequencer** integration is important to precisely control when video or image sequence clips start, end, or loop. You can also use it to make sure all clips are framelocked to the exact Sequencer time, providing you the means to finely control sequences with the overall level animation and logic. In Python, you can make a Media track section play through a Media Plate with the section's `set_media_source_proxy` function.

To add your Media Plate Actor to Sequencer:

- Drag the **Actor** from within the **World Outliner** and drop it in your **Sequencer Track**.

[image: Drop the Actor into the Sequencer track]

For proper sync in Sequencer, you must disable audio in the Media Plate Controls (general settings > uncheck Enable Audio) or any manually-created Blueprint using Electra Media Player.

### Crossfade between clips

Using the Sequencer, you can apply a crossfade to two Media Tracks:

- Set the Media Plate Material (-> the-media-plate-actor-in-unreal-engine) to **M_MediaPlateCrossFade**.
- In the **Details** panel, under **Materials**, click **Create Dynamic Material**. This requires the Virtual Production Utilities plugin.
- To open the Sequencer, in the main menu bar, go to **Window** > **Cinematics** > **Sequencer**. If the Sequencer is blank, you need to create a level sequence (-> unreal-engine-sequencer-movie-tool-overview).
- From the **Outliner** panel, click and drag a **Media Plate Actor** into the **Sequencer** panel to create a **Media Track**. In the popup window, click **Yes** to disable autoplay.
- Repeat step 4 to create a second Media Track.

After you've created two Media tracks, you can either create a crossfade automatically by merging the tracks, or create a crossfade manually on separate tracks.

#### Create a Crossfade Automatically

- Drag the newly created track into the first.
- Drag one track so that it overlaps the other. Sequencer will automatically compute crossfade values.[image: A screenshot of Sequencer, showing a track A being dragged to overlap a track B.]

#### Create a Crossfade manually

- Press the **Ctrl** key to show arrows on the tracks.
- Right-click and drag the arrows to define ease-in and ease-out curves for the first track.[image: A screenshot of Sequencer, highlighting the arrows on the first of two tracks that can be used to define curves.]
- Repeat step 2 for the second track.[image: A screenshot of Sequencer, highlighting the arrows on the second track.]

## Considerations and Limitations

When you use the Media Plate Actor, be aware of the following considerations and limitations:

- **Media Players**: Only Electra and IMGMedia Players support synchronization. By default, the engine picks the first player it finds. To guarantee sync playback, you can manually force Electra as your player by selecting it inside **FileMediaSource** > **Player Overrides** > **Windows** > **Electra player (ElectraPlayer)**.
- **Genlock**: If you are using an nDisplay cluster setup and want to optimize image playback frame accuracy, you can use a custom timestep known as Genlocked Fixed Rate (-> the-media-plate-actor-in-unreal-engine).
- Real-time skylights and reflections: If you want to use the mips and tiles outside of your viewport to contribute to real-time skylights and reflections, you must use the [anchor link upscalehigherlevelmip] console variable.

### Genlocked Fixed Rate

To implement the Genlocked Fixed Rate timestep, follow these steps:

- In the **Content Browser**, click **Add (+)** > **Media** and create a new **Media Profile**.
- Under **Media Sources** > **Index [0]**, choose **File Media Source**.
- Tick **Override Project Settings**.
- Click **Genlock** > **CustomTimeStep** > **Genlocked Fixed Rate**.
- Untick **Should Block**.[image: Genlock settings]
- Save the Media Profile, but do not load it on your editor machine. This Media Profile is for nDisplay nodes only.
- After creating the Media Profile, you need to deploy it to the nDisplay nodes. In the **Switchboard** settings menu, click the **Media Profile** dropdown, then select the media profile.You can also set the Media Profile for individual nodes using the **Media Profile** dropdown in each node's settings.

## Useful Console Variables

- **ImgMedia.FieldOfViewMultiplier:** (`ImgMedia.FieldOfViewMultiplier=1`)Since Media Plate only loads tiles visible by the current views, in some cases a fast-panning shot can cause temporary missing tiles around the edges. This console variable lets you increase the number of tiles loaded around the edges of the view.
- **ImgMedia.MipMapLevelPadding:** (`ImgMedia.MipMapLevelPadding=0`)If the mipmap estimation doesn't match the renderer with sufficient precision, this value is padded onto the calculated minimum and maximum mipmap levels.This increases the number of loaded tiles but can help eliminate artifacts under exceptional conditions.
- **Concert.EnableLoopingOnPlayer:** (`Concert.EnableLoopingOnPlayer=1`) (Default)By default, the Multi-User Sequence Manager ensures media playback is looped when looping is enabled on the Sequencer player. Prior to 5.1 Multi-user would not enable looping on the nDisplay sequence player and the looping would be handled by the reset of the play head with sequencer. This allows the playhead to remain in sync with the content on an ICVFX wall. If you prefer the playhead to be synchronized between the editor and nDisplay cluster then set this value to 0.
- **r.EXRReaderGPU.UpscaleHigherLevelMip:** (`r.EXRReaderGPU.UpscaleHigherLevelMip=-1`)Normally, Media Plate only loads the required quality mips and tiles in the viewport. However in some cases, such as reflections and skylights, you might want to load lower-quality tiles outside of the viewport for the areas of the EXR texture that are not filled with any data, in order for them to contribute to lighting and reflection.For example, if you set this console variable to a mip level of 3, then mip level 3 will be fully read, loaded and upscaled into mip 0, 1, 2. Mip levels including and above 3 (4, 5, 6 etc) will be fully read into the texture. When recording, the area visible by the camera contains the proper quality mips, while everything not directly visible by the active views contains lower quality mips.

## Debugging

You can use the following Stat commands for debugging the Media Plate Actor:

- **Stat Media**: Displays information about the current Media being played.
- **ImgMedia.MipMapDebug 1**: Prints visible tile and mip debug information to the screen in game mode. Only usable for files in the `.exr` media format.
- **Log LogImgMedia Verbose**: Enables verbose log data specific to ImgMedia.

- media plate
- streaming media

On this page

- Creating a Media Plate Actor (-> the-media-plate-actor-in-unreal-engine)
- Importing Media Sources (-> the-media-plate-actor-in-unreal-engine)
- Import Video Files (-> the-media-plate-actor-in-unreal-engine)
- Import Media Sequences (-> the-media-plate-actor-in-unreal-engine)
- Import Capture Card Media Sources (-> the-media-plate-actor-in-unreal-engine)
- Play Media Files Using an Existing Media Plate Actor (-> the-media-plate-actor-in-unreal-engine)
- Play an External Media File (-> the-media-plate-actor-in-unreal-engine)
- Play a File Media Source Asset (-> the-media-plate-actor-in-unreal-engine)
- Play a Media Playlist (-> the-media-plate-actor-in-unreal-engine)
- Media Plate Settings (-> the-media-plate-actor-in-unreal-engine)
- Transform (-> the-media-plate-actor-in-unreal-engine)
- Control (-> the-media-plate-actor-in-unreal-engine)
- Geometry (-> the-media-plate-actor-in-unreal-engine)
- Playlist (-> the-media-plate-actor-in-unreal-engine)
- Media Details (-> the-media-plate-actor-in-unreal-engine)
- Media Texture (-> the-media-plate-actor-in-unreal-engine)
- Materials (-> the-media-plate-actor-in-unreal-engine)
- EXR Tiles and Maps (-> the-media-plate-actor-in-unreal-engine)
- Cache (-> the-media-plate-actor-in-unreal-engine)
- Advanced Settings (-> the-media-plate-actor-in-unreal-engine)
- Overlay Materials Technique (-> the-media-plate-actor-in-unreal-engine)
- Sequencer Integration (-> the-media-plate-actor-in-unreal-engine)
- Crossfade between clips (-> the-media-plate-actor-in-unreal-engine)
- Create a Crossfade Automatically (-> the-media-plate-actor-in-unreal-engine)
- Create a Crossfade manually (-> the-media-plate-actor-in-unreal-engine)
- Considerations and Limitations (-> the-media-plate-actor-in-unreal-engine)
- Genlocked Fixed Rate (-> the-media-plate-actor-in-unreal-engine)
- Useful Console Variables (-> the-media-plate-actor-in-unreal-engine)
- Debugging (-> the-media-plate-actor-in-unreal-engine)

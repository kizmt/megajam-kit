# Media Asset Reference

https://dev.epicgames.com/documentation/en-us/unreal-engine/media-asset-reference-for-unreal-engine?application_version=5.9

> Information about Media asset settings.

[image: Media Asset Reference]

This document contains references for the settings of several basic Media assets. For capture cards, refer instead to the Professional Video I/O (-> professional-video-io-in-unreal-engine) documentation.

## Player Overrides

Many of the Media Source assets provide Player Override settings, which you can use to control which player to use to play the asset. Each platform has its own options which you can set separately using a dropdown menu. In all cases, the Automatic option means playback uses the UE default player. Refer to the Electra Protron Player (-> electra-protron-player-in-unreal-engine) documentation for more information on setting the default player.

Capture card players (AJA and Blackmagic) are only available when the associated capture card hardware is installed and the plugin is enabled. Similarly, NDI is only available when the associated plugin is enabled.

| Platform | Options |
| --- | --- |
| **Android** | AutomaticAndroid Media (AndroidMedia)Electra Player (ElectraPlayer) |
| **iOS** | AutomaticApple AV Foundation (AvfMedia)Electra Player (ElectraPlayer) |
| **Linux** | AutomaticBlackmagic Device Interface (BlackmagicMedia)Electra Player (ElectraPlayer)Image Sequence (ImgMedia)NDI (NDIMedia)WebM Media (WebMMedia) |
| **Mac** | AutomaticApple AV Foundation (AvfMedia)Electra Player (ElectraPlayer)ElectraProtron mp4 playback (ElectraProtron)Image Sequence (ImgMedia)NDI (NDIMedia)WebM Media (WebMMedia) |
| **tvOS** | AutomaticElectra Player (ElectraPlayer) |
| **VisionOS** | Automatic |
| **Windows** | AutomaticAJA Device Interface (AJAMedia)Blackmagic Device Interface (BlackmagicMedia)Electra Player (ElectraPlayer)ElectraProtron mp4 playback (ElectraProtron)Image Sequence (ImgMedia)NDI (NDIMedia)WebM Media (WebMMedia)Windows Media Foundation (WmfPlayer) |

## Player Details

A Media Player asset's settings control basic aspects of the media playback. Media Source assets have a Player Details panel with the same settings, which are used by the Media Player when playing back those Media Source assets. For more information on Media Player settings, see the Media Editor Reference (-> media-editor-reference-for-unreal-engine)

## File Media Source

Uses the Player Details (-> media-asset-reference-for-unreal-engine) panel. For step-by-step instructions for using a File Media Source, see the Play a Video File (-> play-a-video-file-in-unreal-engine) tutorial.

| Setting | Description |
| --- | --- |
| **File Path** | The path to the media file. If the media file is not in the `…/Content/Movies` directory, the media file will not be included in the packaged project, and a warning icon is displayed. |
| **Precache File** | When enabled, the entire media file is loaded into memory for playback (when possible). |
| **Player Overrides** | See Player Overrides (-> media-asset-reference-for-unreal-engine) above. |

## File Media Output

| Setting | Description |
| --- | --- |
| **Format** | Options are:EXR (default)BMPJPGPNG |
| **Compression Quality** | Format specific.For EXR, either 0 (default) or 1 (uncompressed).For other formats, a value from 0 to 100. |
| **Overwrite File** | When enabled, overwrites the image if it already exists. |
| **Async** | When enabled, the image is saved asynchronously.When disabled, the game thread is blocked until saving is complete. |
| **File Path** | Defines where to save the image output. |
| **Base **File Name | The base file name for the images. The frame number will be appended. |
| **Desired ******Size | When enabled, you can specify the X and Y dimensions for the image output.When disabled, the default back buffer size is used. |
| **Desired Pixel Format** | When enabled, specify a pixel format. Options are:8 bit RGBAFloat RGBAWhen disabled, the default back buffer pixel format is used. |
| **Invert Alpha** | When enabled, inverts the alpha for formats that support alpha. |
| **Number of Texture Buffers** | The number of textures used to transfer the texture from the GPU to the system memory.Small numbers can block the GPU.Large numbers can cause latency. Only works with captures that use the GPU. |

## Img Media Source

Uses the Player Details (-> media-asset-reference-for-unreal-engine) panel. For step-by-step instructions for using an Img Media Source, see the Play an Image Sequence (-> play-an-image-sequence-in-unreal-engine) tutorial.

| Setting | Description |
| --- | --- |
| **Player Overrides** | See Player Overrides (-> media-asset-reference-for-unreal-engine) above. |
| **Fill Gaps in Sequence** | When enabled, any gaps in the sequence are filled with blank frames. |
| **Sequence Path** | The path to the image sequence. If the image sequence is not in the `…/Content/Movies` directory, the image sequence will not be included in the packaged project, and a warning icon is displayed. |
| **Frame Rate Override** | Overrides the default frame rate stored in the image sequence. Defaults to no override. Options are:12 fps (animation)15 fps24 fps (film)25 fps (PAL/25)30 fps48 fps50 fps (PAL/50)60 fps100 fps120 fps240 fps23.976 fps (NTSC/24)29.97 fps (NTSC/30)59.94 fps (NTSC/60)Custom |
| **Proxy Override** | Provide the name of the proxy directory. Defaults to no proxy. |
| **Encoding Override** | Overrides the source encoding of the image sequence. Options are:None (default)LinearsRGB |
| **Color Space Override** | Overrides the color space of the image sequence. Options are:sRGB/Rec 709Rec 2020ACES AP0ACES AP1 / ACEScgP3DCIP3D65RED Wide GamutSony S-Gamut3Sony S-Gamut3 CineAlexa Wide GamutCanon Cinema GamutGoPro Protune NativePanasonic V-GamutCustom |
| **Red/Green/Blue/White Chromaticity Coordinate** | Four separate fields that define the chromaticity. Each Color Space Override option provides specific values for these fields. These values are editable when the source white point differs from the working color space white point, and when the Color Space Override is set to Custom. |
| **Chromatic Adaptation Method** | Determines the chromatic adaptation method applied if the source white point differs from the working color space white point. Not always modifiable, depending on the value of the Color Space Override. Options are:NoneBradfordCAT02 |
| **Start Timecode** | Specifies a timecode associated with the start of the sequence. |

For more information on Color Space Overrides, refer to the Working Color Space (-> working-color-space-in-unreal-engine) documentation.

## Media Playlist

For step-by-step instructions for using a Media Playlist, see the Using Media Playlists (-> using-media-playlists-in-unreal-engine) tutorial.

| Setting | Description |
| --- | --- |
| **Playlist (Array)** | Each element in the Playlist array is a separate media source selected from the Content Browser. You can create new media assets directly from the playlist, and then populate them with media according to the type of media asset.[image: Media Playlist] |

## Platform Media Source

Uses the Player Details (-> media-asset-reference-for-unreal-engine) panel. For step-by-step instructions for using a Platform Media Source, see the Playing Platform Specific Media (-> playing-platform-specific-media-in-unreal-engine) tutorial.

| Setting | Description |
| --- | --- |
| **Player Overrides** | See Player Overrides (-> media-asset-reference-for-unreal-engine) above. |

## Stream Media Source

Uses the Player Details (-> media-asset-reference-for-unreal-engine) panel. For step-by-step instructions for using a Stream Media Source, see the Play a Video Stream (-> play-a-video-stream-in-unreal-engine) tutorial.

| Setting | Description |
| --- | --- |
| **Player Overrides** | See Player Overrides (-> media-asset-reference-for-unreal-engine) above. |
| **Stream URL** | Defines the URL sending the media stream. |

On this page

- Player Overrides (-> media-asset-reference-for-unreal-engine)
- Player Details (-> media-asset-reference-for-unreal-engine)
- File Media Source (-> media-asset-reference-for-unreal-engine)
- File Media Output (-> media-asset-reference-for-unreal-engine)
- Img Media Source (-> media-asset-reference-for-unreal-engine)
- Media Playlist (-> media-asset-reference-for-unreal-engine)
- Platform Media Source (-> media-asset-reference-for-unreal-engine)
- Stream Media Source (-> media-asset-reference-for-unreal-engine)

# Tiled Mipmap Video

https://dev.epicgames.com/documentation/en-us/unreal-engine/tiled-mipmap-video-in-unreal-engine?application_version=5.9

> Play large footage efficiently with Tiled Mipmap Video, and convert and inspect it with the TMV tools.

[image: Tiled Mipmap Video]

Learn to use this **Beta** feature, but use caution when shipping with it.

Tiled Mipmap Video (TMV) is a video format for playing very large footage in Unreal Engine, such as plates for LED walls and 360 video. Each frame is stored as several mip levels split into tiles, so the engine only loads the tiles and mip levels the camera needs. TMV uses the Advanced Professional Video (APV) codec.

Use the **TMV Transcoder** to convert footage into TMV or into tiled EXR with mips, and the **TMV Media Texture Viewer** to inspect how a media texture streams.

## Prerequisites

To enable the **Tiled Mipmap Video Player** plugin:

- In the menu bar, go to **Edit > Plugins**.
- Find **Tiled Mipmap Video Player** in the **Media Players** category and enable it.
- Restart the editor.

## TMV Transcoder

The TMV Transcoder converts a media file or media source into TMV or tiled EXR. It runs transcode jobs one at a time, in the order you add them.

### Opening the TMV Transcoder

Right-click a media source asset in the Content Browser and select **Transcode to TMV** or **Transcode to EXR**. This opens the TMV Transcoder with a new job for that media.

You can also open the **TMV Transcoder tab** from the **Window** menu.

### Input Sequence

| Setting | Description |
| --- | --- |
| Input Source | File, for an external media file in any supported format, or Media Source, for a media source asset in your project. |
| Input Path / Input Media Source | The file or media source asset to transcode. |
| Override Frame Rate | Sets the frame rate of the input. Default 24 fps. |
| Start Timecode Override (advanced) | Sets the start timecode of the input sequence, overriding the timecode in the input media. |

### Output Sequence

| Setting | Description |
| --- | --- |
| Output Format | **TMV Video File** (default) writes a single container file. **TMV Image Sequence** writes each frame as a separate file. |
| Output Path | The folder to write the output to. |
| Output Base Name | The base name of the output. Supports the `{frame_number}` token. |
| Make Output Asset | Creates a media source asset for the output, in **Output Asset Directory**. The asset is named after the job. |
| Include Audio | Carries the source's audio into the output, for containers that hold audio. The audio follows the trim range. |
| Audio Input Path | Reads the output's audio from this file instead of the input, for example a soundtrack for an image sequence. You can trim it separately with **Audio Input Trim Start Seconds** and **Audio Input Trim Duration Seconds** (advanced). |

### Encoder Settings

| Setting | Description |
| --- | --- |
| Quality | How much to compress:**Maximum**: Fills the maximum data rate of the selected band. Near-lossless, largest files.**High**: Looks identical to the source, even zoomed in.**Standard**: The default. Hard to tell from the source at normal viewing.**Compact**: Smaller files; blocks show when zoomed in.**Custom**: Uses the **QP** setting. |
| QP | Quantization parameter for Custom quality, on a 10–bit scale. Lower values give higher quality and larger files. |

### Frame Producer

| Setting | Description |
| --- | --- |
| Enable Mip Mapping | Generates mips and encodes them in the output. Enabled by default. |
| Use Media Player | Uses a media player to read the source. Enabled by default. Transform, Overlay, Trim and Output Frame Rate need it. |
| Transform (advanced) | Crops, scales, flips and rotates each frame and places it on an output canvas:**Crop Origin** and **Crop Size**: The region of the source to keep, in source pixels.**Layer Size**: The size the kept region is scaled to.**Flip Horizontal** and **Flip Vertical**.**Rotation Degrees**: Clockwise rotation. Multiples of 90 don't resample the image.**Canvas Size**, **Offset** and **Background Color**: The output frame size, where the layer sits on it, and the color where the layer doesn't cover it. |
| Overlay (advanced) | Draws an image or video over each frame, after the transform. Set the **File Path**, its own **Transform**, a **Blend Mode**, the **Opacity**, and what a video overlay shows after its last frame (**End**: Hold the last frame, loop, or show nothing). |
| Trim (advanced) | **Trim Start Seconds** and **Trim Duration Seconds** set the part of the source to read. A duration of 0 reads to the end. |
| Output Frame Rate (advanced) | Changes the output frame rate. Source frames are dropped or repeated as needed. Default 30 fps. |

### Scripting the TMV Transcoder

Python scripts can run transcode jobs in the editor through the **TMV Media Transcode Editor Subsystem**. Scripted jobs share a queue with the TMV Transcoder panel.

It includes the following functions:

| Function | Description |
| --- | --- |
| make_transcode_job | Returns a new job with the TMV Transcoder's default settings. |
| submit_transcode_job | Adds a job to the queue. |
| list_transcode_jobs | Returns the queued and running jobs, including jobs submitted from the TMV Transcoder panel. |
| get_transcode_job | Returns a queued or running job by its ID. Raises an error if no job with that ID is queued or running. |
| cancel_transcode_job | Cancels a queued or running job by its ID. Raises an error if no job with that ID is queued or running. |
| load_transcode_job_list | Reads a job list file, as the TMV Transcoder panel saves it. |
| load_transcode_job | Reads a single job file, as the TMV Transcoder panel exports a job. The job is named after the file. |
| probe_frame_rate | Returns the frame rate a media player plays a media source at. |

## TMV Media Texture Viewer

The **TMV Media Texture Viewer** shows every mip of a media texture at the same time and, below them, which tiles of each mip are loaded. Use it to check how TMV media streams and to debug playback.

Open it from the **TMV Media Texture Viewer** tab.

On this page

- Prerequisites (-> tiled-mipmap-video-in-unreal-engine)
- TMV Transcoder (-> tiled-mipmap-video-in-unreal-engine)
- Opening the TMV Transcoder (-> tiled-mipmap-video-in-unreal-engine)
- Input Sequence (-> tiled-mipmap-video-in-unreal-engine)
- Output Sequence (-> tiled-mipmap-video-in-unreal-engine)
- Encoder Settings (-> tiled-mipmap-video-in-unreal-engine)
- Frame Producer (-> tiled-mipmap-video-in-unreal-engine)
- Scripting the TMV Transcoder (-> tiled-mipmap-video-in-unreal-engine)
- TMV Media Texture Viewer (-> tiled-mipmap-video-in-unreal-engine)

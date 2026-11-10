# Importing Audio Files

https://dev.epicgames.com/documentation/en-us/unreal-engine/importing-audio-files?application_version=5.9

> Learn how to create Sound Wave assets by importing audio files.

[image: Importing Audio Files]

Unreal Engine provides several features for you to create the desired audio for your project. **Sound Wave** assets are representations of audio files and are one of the basic building blocks required to work with many of those features. You can create Sound Waves by importing audio files into the Unreal Editor.

### Supported Audio Files

| **Format** | `.wav`, `.ogg`, `.flac`, `.aif`, `.opus`, `.mp3` |
| --- | --- |
| **Bit Depth** | 16, 24 |
| **Sample Rate** | Any |
| **Speaker Channels** | Mono, Stereo, 4.0, 5.1, 7.1 |

All imported audio files are converted to 16-bit `.wav` files internally. As such, exporting (by right-clicking a Sound Wave and selecting **Asset Actions > Export...**) will produce the converted file and not the originally imported file. Additionally, 24-bit files are not dithered during conversion so importing 16-bit files is recommended.

### How to Import an Audio File

- In the Content Browser, click the **Import** button. [image: Content Browser Import Button]

- Select the file you wish to import using the **File Explorer**.

- Find the newly created **Sound Wave** asset. [image: Content Browser Imported Sound Wave]

- To preview the Sound Wave, hover over it until a **Play/Stop** toggle button appears and click it. [image: Play Sound Wave] [image: Stop Sound Wave]

- Double-click the Sound Wave to open the **Details** panel. You can view and edit the properties of your asset here. [image: Sound Wave Details Panel]

You can also import audio files by dragging them from Windows Explorer directly into the **Content Browser**.

Unreal Engine also supports importing first-order ambisonic files. See Native Soundfield Ambisonics Rendering (-> native-soundfield-ambisonics-rendering-in-unreal-engine) for information on importing and using ambisonic assets.

### Compression

All Sound Waves are compressed with the **Default Audio Compression Type** specified in the **Project Settings**. You can also set the codec and quality level for each platform and Sound Wave.

| Codec | Type | Ratio | Description |
| --- | --- | --- | --- |
| **Bink Audio** | Lossy | Up to 10:1 | (Default) A perceptual-based codec that supports all features across all platforms. Low memory usage and comparable CPU usage to **ADPCM**. |
| **ADPCM** | Lossy | Up to 4:1 | A time-domain codec with fixed-sized quality and is relatively cheap to decode. |
| **PCM** | Lossless | Uncompressed | Uses uncompressed audio that results in higher memory usage as streamed chunks contain less audio per chunk but provides extremely cheap decoding and support for all features. |
| **Platform Specific** | - | - | Encodes the asset in a platform-specific format. Seeking is not supported. |

- audio
- sound sources
- sound waves

On this page

- Supported Audio Files (-> importing-audio-files)
- How to Import an Audio File (-> importing-audio-files)
- Compression (-> importing-audio-files)

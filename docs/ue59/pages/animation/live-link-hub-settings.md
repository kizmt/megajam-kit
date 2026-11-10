# Live Link Hub Settings

https://dev.epicgames.com/documentation/en-us/unreal-engine/live-link-hub-settings?application_version=5.9

> Configuring Capture Manager in Live Link Hub.

## General Settings

The **Capture Manager** settings in **Live Link Hub** can be accessed through the **Settings **menu.

| [image: Live Link Hub Settings] | [image: Plugins Capture Manager] |
| --- | --- |

- **Default Working Directory**: Specify the (potentially temporary) location where converted data will be stored during the ingest process.

- **Should Clean Working Directory**: Whether the downloaded and converted files should be deleted from the **Working Directory** after ingest is complete (successfully or otherwise).

- **Download Directory**: Location where data downloaded from a remote device (such as Live Link Face device) will be stored.

- **Enable Third Party Encoder**: If enabled, use a third party encoder/decoder (FFmpeg) for data conversion, with additional settings as provided.

- **Parallel Jobs**: The number of jobs to process in parallel when ingesting.

Naming tokens can be used to automatically populate parts of the **Working Directory** and **Download Directory** locations.

## Third Party Encoder Support

It is possible to use an external third party media encoder or decoder (FFmpeg) for data conversion during ingest. This may be desirable if the default workflow using Windows Media Foundation does not support the data format you wish to work with.

To configure a third party encoder or decoder:

- Download and install FFmpeg from ffmpeg.org.

- Ensure E**nable Third Party Encoder** is enabled in the settings. This will cause some additional options to be available.

- Provide the additional settings as needed: - **Third Party Encoder**: The full path to the ffmpeg executable. - **Custom Video Command Arguments**: To be used when executing the third party encoder with video data. - **Custom Audio Command Arguments**: To be used when executing the third party encoder with audio data.

# Capture Data Asset

https://dev.epicgames.com/documentation/en-us/unreal-engine/capture-data-asset?application_version=5.9

> Overview of the Capture Data asset in Unreal Engine.

The **Capture Data** asset is created by **Capture Manager** as part of the ingest process. It tracks the assorted set of data and metadata that is required when working with performance capture data. Some of that data is optional but commonly available (such as audio).

A Capture Data asset can be input to the MetaHuman Identity and MetaHuman Performance asset.

> **warning:** Although the asset is typically created by an automated process, it can be created manually if required. While a Capture Data asset can be configured manually, be mindful of the fact that incompletely or incorrectly configured information will create unpredictable issues that might be difficult to troubleshoot.

[image: Footage Capture Data]

A **Capture Data** asset may reference one or more of the following other assets depending on the data it represents:

- **Img Media Source** (for depth and/or RGB video)

- **Sound Wave** (for audio tracks)

- **Camera Calibration**

> **warning:** It is important to not confuse the difference between the **Device Class** and the **Device Model** for iOS devices. The **Device Class** inside a **Capture Data **asset is a fixed choice from limited options, and it’s the commonly known name of the model from a consumer point of view. The **Device Model **is a less visible versioning that** doesn’t necessarily line up** with the public-facing model number. This is usually ahead of the consumer branding. For example, an iPhone 12 device is likely to have a model number of iPhone 13,N.

## Timecode Information

The Timecode for the Image and Depth Sequences can be viewed and set via the **ImgMediaSource** asset editor.

[image: Timecode]

The Timecode and Timecode Frame Rate for SoundWave assets can be viewed and set selecting **Scripted Asset Actions > Set Timecode Info**.

[image: Scripted Asset Actions]

Enter the desired Timecode and Timecode Frame Rate values and click **OK **to set the values.

[image: Set Timecode Info]

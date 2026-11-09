# Multi-Track Audio Capture for Take Recorder

https://dev.epicgames.com/documentation/en-us/unreal-engine/multi-track-audio-capture-for-take-recorder-in-unreal-engine?application_version=5.9

> Record multi-track audio with Take Recorder.

Multi-Track Audio Capture for Take Recorder
**Take Recorder** provides options for recording audio. You can create multiple (up to 8) **Microphone Audio** sources in Take Recorder to record audio from multi-channel audio devices.

 [image: Multi-track audio sources]

Each **Microphone Audio** source has an associated **Audio Input Device Channel** that designates the input channel on the selected audio device. Up to 8 channels are supported via the **Windows Audio Session API**. It is important to note that the audio device must have **Windows WDM multi-channel support** in order to have 8 channels available. There are third-party audio device manufacturers that offer Windows WDM multi-channel support.

See Microphone Audio Recorder (-> take-recorder-in-unreal-engine) and Audio Input Device (-> take-recorder-in-unreal-engine) sections for more information about these audio settings.

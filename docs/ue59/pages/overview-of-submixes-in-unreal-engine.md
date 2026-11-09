# Submixes Overview

https://dev.epicgames.com/documentation/en-us/unreal-engine/overview-of-submixes-in-unreal-engine?application_version=5.9

> An overview of submixes and how to use them.

[image: Submixes Overview]

A **submix **is a **DSP (digital signal processing) graph** that is always running, even when no audio is being sent.

A fundamental component of the audio renderer in **Unreal Engine**, submixes have a dual purpose:

- To mix audio generated from individual sources into a single output buffer, and

- To optimize the application of digital signal processing (DSP) effects to multiple sound sources simultaneously.

Think of your submixes as flowing rivers — when a sound plays, it pours into the submix. When one submix connects to another, it cascades into the next. All of the sounds pouring together mix into one stream of sound and flow down. And like a river, the flow is in one direction only.

Each submix **endpoint **(hardware output) is fed from a single graph. For example, the master submix — a single, default submix endpoint — defines a single submix graph.

A **Sound Cue** can send to a submix the same as any other `USoundBase`.

You can use a **Blueprint** to modify properties on a submix, changing the way that submix processes audio.

## Creating a Submix

A submix can be created directly in the Content Browser, much like other sound-related assets: right-click in the Content Browser asset area, then select **Audio > Mix > Sound Submix**.

## The Submix Graph Editor

Double-click a submix asset to open the **Submix Graph Editor**.

Click image for full size.

You can connect submixes into a graph structure and set the output of one submix as the input to another submix.

 [image: Connect Submixes]

To create a new submix from within the graph editor, drag an output or input pin into the graph, then name the new submix (names cannot contain spaces.) The new submix will be added to the Content Browser.

 [image: A Submix with Multiple Inputs]

A submix can have multiple inputs but only one output.

### The Master Submix

The **Master Submix** parameters are set from Project Settings (**Edit > Project Settings > Engine > Audio > Mix**):

Click image for full size.

Double-click the **submix** icon to access the **Master Submix** properties.

Click image for full size.

The Master Submix is directly connected to an output endpoint (such as hardware speakers). This is the final rendering stage for the Audio Mixer, after which audio is passed on to the platform audio backend, then to the audio device that platform uses.

If a submix output pin is not connected to anything else, it will send the output to the Master Submix.

### Master Reverb Submix

Master Reverb Submix settings are in the **Sound Class**.

 [image: Master Reverb Submix Settings]

- **Send to Master Reverb Submix**: Sends sounds to the Master Reverb.

- **Default 2DReverb Send Amount**: Sets the send level for 2D sounds when sent to the Master Reverb.

### Master EQ Submix

Settings for the **Master EQ Submix** are in **Sound Class**, under **Legacy**, **Advanced**.

 [image: Master EQ Submix Settings]

The **Output to Master EQ Submix** setting must be enabled for the **EQ Settings** on **Sound Class Mixes** to work.

## Sending Audio to a Submix

There are several ways to send sound sources to a submix:

- Set up the send manually in a sound source asset.

- Use Attenuation settings.

- Set dynamically in a Blueprint.

- Set it through Audio Volumes.

### Manually Set Up a Submix Send

To play a sound source on a submix, or to send its generated audio to a submix, assign the new submix asset to the **Submix **property on the sound source. The Submix property on sound assets is considered the **base submix** of the sound, and 100% of the audio is sent to that submix.

Click image for full size.

Properties:

- **Submix Sends**: The Submix Sends array on a sound asset is an array of further submixes to which sound sources can send a portion of their audio. Sends can be done either manually or via distance; for example, the farther away a sound is, the less audio it might send to a submix.

- **Send Level Control Method**: How the source should send its audio to the indicated submix:

- **Manual**: The sound sends its audio directly using the Send Level value.

- **Linear**: The sound sends its audio to the submix using a linear mapping between the Min and Max Send Level, and the Min and Max Send Distance.

- **Custom Curve**: Uses the Custom Send Level Curve to send its audio to the submix, instead of using linear mapping.

- **Send Stage**: Determines whether the source send should be done before or after distance attenuation is applied.

- **Sound Submix**: Which submix the sound source is sending its audio to using this submix send entry.

- **Send Level**: The send level to use if the Send Level Control Method is set to Manual.

- **Disable Manual Send Clamp**: Enables or disables the 0–1 clamp when using the manual Send Level Control Method.

- **Min Send Level**: The minimum send level to use when using the non-manual Send Level Control Method.

- **Max Send Level**: The maximum send level to use when applying a Linear control method.

- **Min Send Distance**: The minimum distance to use when applying a Linear control method.

- **Max Send Distance**: The maximum distance to use when applying a Linear control method.

- **Custom Send Level Curve**: The curve to use for mapping the minimum and maximum Send Level and Distance.

### Send to Submixes Using Sound Attenuation

Submix sends can also be set using **Attenuation **settings. This is a convenient way to set up submix sends on large numbers of assets from one place. Since submix sends can send their audio based on distance to the listener, it makes sense to use this where distance attenuation is also defined.

Click image for full size.

For more on this method, see Sound Attenuation (-> sound-attenuation-in-unreal-engine).

### Send Dynamically to Submixes in Blueprint

This Blueprint function provides a way for audio components to dynamically route their audio to arbitrary submixes using whatever method you choose.

 [image: Send Dynamically to Submixes in Blueprint]

To set a Submix Send you will need:

- **Target**: The audio component to use for sending audio to the submix.

- **Submix**: The submix where audio will be sent.

- **Send Level**: The amount of audio to send, as a % of total volume.

Also see Blueprint APIs and Submixes (-> overview-of-submixes-in-unreal-engine) later in this document.

### Send to Submixes using Audio Volume

Audio Volume supports sending audio to submixes in a similar way to how sends are set up directly on sound sources. The primary difference is that the submix send is based on its location relative to the audio volume geometry.

Click image for full size.

The properties in the Submix Send Array are identical to the properties that are directly set on the sound sources themselves.

 [image: Set Submix Send Settings]

Sound sources will send their audio to a given Submix Send Array based on whether the **Listener Location State** shows the listener inside or outside the Volume.

Audio Volume also supports **Submix Override,** depending on the Listener Location State. The submix is overridden by a specified effect chain, depending on whether the listener is inside or outside of the Volume.

## Submix Properties

While in the **Graph Editor**, the **Property Details **panel displays for the selected submix in the submix graph.

Click image for full size.

Properties:

- **Mute when Backgrounded**: Allows a submix to automatically mute itself by applying a volume scaler of **0.0** on its output when the application is backgrounded. This feature allows a game to continue playing audio in the background by default for some audio but not all.

- **Submix Effect Chain**: This is an array of submix effects through which the mixed submix audio will be fed. These effects are implemented with the **Synthesis and DSP Effects** plugin. Other Unreal Engine plugins can also extend the list of submix effects available.

- **Ambisonics Plugin Settings**: This property allows plugins to optionally allow a submix to encode audio sources sent to it as an ambisonic soundfield. These settings define the soundfield encoding properties. The only settings type this property will accept is for Oculus Ambisonics Settings (when the Oculus Plugin is enabled). For more information on soundfields, see Native Soundfield Ambisonics Rendering (-> native-soundfield-ambisonics-rendering-in-unreal-engine).

- **Parent Submix**: The parent to the selected submix. The parent submix receives the rendered output as input.

- **Child Submixes**: An array of child submixes that feed their audio as input into the selected submix.

- **Envelope Follower**: A DSP algorithm that outputs the amplitude of an audio signal that has been smoothed over time. Attack Time values define how quickly the algorithm reacts to increasing amplitude (**attack**) and decreasing amplitudes (**release**).

Deriving the amplitude of an audio signal using an envelope follower is significantly more effective than using the raw audio data because audio signals can be significantly faster (for example, 48,000 samples per second) than game frames (for example, 60 frames per second).

Submixes also have a Blueprint API (-> overview-of-submixes-in-unreal-engine) that allows a Blueprint to receive an amplitude envelope for audio rendered in a submix. These properties define how the envelope follower behaves.

- **Submix Level**: Controls the overall volume levels for the submix. The values in this category can be optionally set to display linear volume gain (such as **0.0** to **1.0**), or decibels (**-120 dB** to **0 dB**). The decibel is a common volume measurement that accounts for the fact that volume is perceived logarithmically.

- **Output Volume**: Controls the overall output volume for the whole submix in both dry and wet channels. It is not recommended that you mix game volume using this property, but it can be useful for tweaking the volume in a submix.

- **Wet Level**: The output volume of the audio that was fed through the submix effect chain. By default, this is set to **1.0** as it is assumed that most uses of a submix are intended to be fully wet, with all audio sent through the effects.

- **Dry Level**: This is the output volume of the audio that was not fed through the submix effect chain. By default, this is set to 0.0 as it's assumed that most uses of a submix are intended to be fully wet (all audio sent through the effects).

- **Audio Link Settings**: An optional audio link settings object.

- **Auto Disable**: This will automatically enable or disable a submix whether it is silent or audible. This is useful for CPU optimization.

- **Auto Disable Time**: This is the minimum amount of time to wait before disabling a submix.

## Submix Effects

A number of submix effects are available using the **Synthesis and DSP Effects** plugin. This plugin is made by Epic, and new synthesis, source effects and submix effects are often added to this plugin. Third-party plugin makers can also easily add to the list of available submix effects.

The general requirement for non-soundfield submix effects is that they are able to handle multiple audio channels (up to 8 channels).

### Making Submix Effect Presets

A **Submix Effect Preset** is an asset that exists in the Content Browser and is hooked up to a Submix Effect Chain. To create a Submix Effect Preset, right-click in the Content Browser, then select **Audio > Effects > Submix Effect Preset**. This will give you a class picker where you can select the effect you want to create a preset asset for.

 [image: Pick a Submix Effect Class]

Plugins will automatically extend the options available in the **Pick Submix Effect Class** list.

## Blueprint APIs and Submixes

Submixes can be very useful in **Blueprints**. For example, you can reference a submix in a Blueprint by creating a **Sound Submix Variable** reference.

Click image for full size.

## Recording Submix Audio in a Blueprint

Submixes support recording the audio output of a submix to either a PCM (pulse code modulation) `.wav` file that is output to disk, or to a Sound Wave asset. Only one recording per submix can be active at a time.

- The default path for saved `.wav` files is `Saved\BouncedWavFiles`.

- **Sound Waves** are saved to the root directory of the Content Browser.

You can change either of these paths when setting up **Finish Recording Output** (see below).

 [image: Start Recording Submix Output]

**Start Recording Output** properties:

- **Expected Duration**: An optional advanced parameter to preallocate an internal audio buffer (in seconds) for the anticipated duration.

- **Submix to Record**: The submix you want to record.

**Pause Recording Output** pauses the recording.

 [image: Pause Recording Submix Output]

**Resume Recording Output** resumes the recording.

 [image: Resume Recording Submix Output]

**Finish Recording Output** ends the recording and saves it.

 [image: Finish Recording Submix Output]

Properties:

- **Export Type**: Whether to export (or save) the submix recording as a `.wav` file or a Sound Wave (UAsset).

- **Name**: The name of the asset.

- **Path**: The path of the exported asset. If nothing is entered it will save to the default path for the export type.

- **Submix to Record**: The submix that was recorded.

- **Existing Sound Wave to Overwrite**: If saving as a Sound Wave, you have the option of overwriting a previous asset.

## Real Time Analysis in Blueprints

Submixes support the retrieval of real-time analysis in a Blueprint either through **envelope following** or through **spectral analysis**, such as a fast Fourier transform (FFT).

### Envelope Following Analysis

**Add Envelope Follower Delegate** is called when new envelope data is available on the submix.

Click image for full size.

It is called with the **envelope value of the submix per channel** (left, right, center, left-surround, right-surround, and so on).

**Start Envelope Following** starts the submix envelope follower on the given submix. If a delegate is hooked up, it will begin to fire.

 [image: Start Submix Envelope Follower]

**Stop Envelope Following** stops the follower on the given submix.

 [image: Stop Submix Envelope Follower]

### Spectral Analysis

**Add Spectral Analysis Delegate** provides spectral analysis.

 [image: Add Spectral Analysis]

Properties:

- **In Band Settings**: A struct that defines the settings for the spectral analyzer.

- **In Num Bands**: How many spectral bands to analyze.

- **In Minimum Frequency**: The minimum frequency range (in Hz) to consider in the spectrum analyzer.

- **In Maximum Frequency**: The maximum frequency range.

The delegate is called with the spectral data for each spectral band defined in the setting.

**Start Spectral Analysis** starts the spectrum analyzer.

 [image: Start Spectral Analysis]

**Stop Spectral Analysis **stops the spectrum analyzer.

 [image: Stop Spectral Analysis]

## Volume Control in Blueprints

Volume controls can also be set for submixes from a Blueprint.

**Set Submix Output Volume** directly sets the output volume of the submix.

 [image: Set Submix Output Volume]

## Submix Effect Control in Blueprints

**Add Submix Effect** dynamically adds a submix effect preset to the end of a submix effect chain.

 [image: Add Submix Effect Preset]

**Remove Submix Effect Preset** removes the submix effect preset in the submix effect chain of the submix.

 [image: Remove Submix Effect Preset]

**Remove Submix Effect Preset At Index** is similar to Remove Submix Effect Preset, but removes the submix effect preset at the given index in the submix effect chain if an effect exists at that index.

 [image: Add Submix Effect Preset at Index]

**Replace Submix Effect** replaces the submix effect preset at the given index with a new effect preset.

 [image: Replace Submix Effect]

**Clear Submix Effects** clears the submix effects chain on the given submix.

 [image: Clear Submix Effects]

**Set Submix Effect Chain Override** provides a way to override the entire submix effect chain at once.

 [image: Set Submix Effect Chain Override]

Properties:

- **Sound Submix**: The submix to override with the submix effect preset chain.

- **Submix Effect Preset Chain**: An array of submix effect presets.

- **Fade Time Sec**: The cross-fade time of the submix effect chain. This will fade from the current effect chain to the new effect chain override.

Setting a Submix Effect Chain Override can also be done via Audio Volumes (-> audio-volumes-in-unreal-engine).

Click image for full size.

**Clear Submix Effect Chain Override** clears any submix effect chain overrides that are set.

 [image: Clear Submix Effect Chain Override]

Properties:

- **Sound Submix**: The submix to be cleared.

- **Fade Time Sec**: The cross-fade time from the current submix effect chain override to the default submix effect chain.

- audio
- unreal audio engine
- submix
- dsp graph
- submix graph editor
- master submix

On this page

- Creating a Submix (-> overview-of-submixes-in-unreal-engine)
- The Submix Graph Editor (-> overview-of-submixes-in-unreal-engine)
- The Master Submix (-> overview-of-submixes-in-unreal-engine)
- Master Reverb Submix (-> overview-of-submixes-in-unreal-engine)
- Master EQ Submix (-> overview-of-submixes-in-unreal-engine)
- Sending Audio to a Submix (-> overview-of-submixes-in-unreal-engine)
- Manually Set Up a Submix Send (-> overview-of-submixes-in-unreal-engine)
- Send to Submixes Using Sound Attenuation (-> overview-of-submixes-in-unreal-engine)
- Send Dynamically to Submixes in Blueprint (-> overview-of-submixes-in-unreal-engine)
- Send to Submixes using Audio Volume (-> overview-of-submixes-in-unreal-engine)
- Submix Properties (-> overview-of-submixes-in-unreal-engine)
- Submix Effects (-> overview-of-submixes-in-unreal-engine)
- Making Submix Effect Presets (-> overview-of-submixes-in-unreal-engine)
- Blueprint APIs and Submixes (-> overview-of-submixes-in-unreal-engine)
- Recording Submix Audio in a Blueprint (-> overview-of-submixes-in-unreal-engine)
- Real Time Analysis in Blueprints (-> overview-of-submixes-in-unreal-engine)
- Envelope Following Analysis (-> overview-of-submixes-in-unreal-engine)
- Spectral Analysis (-> overview-of-submixes-in-unreal-engine)
- Volume Control in Blueprints (-> overview-of-submixes-in-unreal-engine)
- Submix Effect Control in Blueprints (-> overview-of-submixes-in-unreal-engine)

# Audio Bus Overview

https://dev.epicgames.com/documentation/en-us/unreal-engine/audio-bus-overview?application_version=5.9

> An overview of Audio Buses in Unreal Engine.

[image: Audio Bus Overview]

In **Unreal Engine**, **Audio Buses** combine sound sources into a single signal path.

You can use the combined audio signal in two primary ways:

- Use the signal to perform audio-rate modulation on parameters or other signals. For example, use it to dynamically control digital signal process (DSP) effect parameters (known as sidechaining).

- Output the mixed audio signal from a point in space. In particular, using the rendered output, create speakers or other audio-producing objects within your Level.

### Creating Audio Buses

To create an Audio Bus:

- In the **Content Browser**, click the **Add** button.

- Select **Audio > Mix > Audio Bus**.

 [image: Audio Bus Details]

To edit an Audio Bus, you can double-click it in the **Content Browser** or right-click it and select **Edit** from the context menu. Then, in the **Details** panel that appears, set the number of **Audio Bus Channels** you want to use.

If you send audio to an Audio Bus with a different channel configuration, it will be mixed accordingly. For example, sending a mono source to a stereo Audio Bus will upmix to stereo.

### Sending Audio to Audio Buses

 [image: Audio Bus Project Settings]

You have to start an Audio Bus before it can receive audio. Set the **Default Audio Buses** in the **Project Settings** (-> audio-settings-in-the-unreal-engine-project-settings) to have the specified Audio Buses start automatically.

You can also start an Audio Bus manually by using the **Start Audio Bus** Blueprint node. Similarly, you can stop an Audio Bus by using the **Stop Audio Bus** Blueprint node.

 [image: Source Details Bus Sends]

You can set an Audio Bus to send audio to in the **Details** panel for your source asset (such as a **Sound Wave**, **Sound Cue**, or **MetaSound Source**). Under **Effects > Source**, click the **Add (+)** button for **Post-Effect Bus Sends** or **Pre-Effect Bus Sends** to add a bus send that will occur before or after an optionally provided **Source Effect Chain**.

 [image: Source Details Audio Bus]

Expand the new bus send index to set the **Audio Bus** and the **Send Level**.

You can change the **Source Bus Send Level Control Method** (in combination with the other related properties) to send based on distance or a custom curve.

 [image: Source Details Submix]

If you want the original source audio to be inaudible (by only sending it to the Audio Bus), you can disable **Enable Base Submix** and **Enable Submix Sends** under **Source > Submix** in the **Details** panel.

### Audio-Rate Modulation with Audio Buses

 [image: Source Effects]

Modulation is the process of using a signal to alter other audio signals or parameters of a sound. You can modulate at an audio rate using Audio Buses.

By default, two **Source Effect Preset** classes allow for audio-rate modulation with an Audio Bus:

- **Filter**: The Audio Bus signal controls the filter frequency cutoff.

- **Ring Modulation**: The Audio Bus signal is multiplied by the input signal.

To create a Source Effect Preset:

- In the **Content Browser**, click the **Add** button.

- Select **Audio > Effects > Source Effect Preset**.

- Choose from the list of classes available in the **Pick Source Effect Class** window.

 [image: Filter Preset Details]

You can set the Audio Bus you want to modulate with in the **Details** panel for the Source Effect Preset.

After you create a Source Effect Preset, you must add it to a **Source Effect Preset Chain**.

To create a Source Effect Preset Chain:

- In the **Content Browser**, click the **Add** button.

- Select **Audio > Effects > Source Effect Preset Chain**.

 [image: Source Effect Chain Details]

You can set the Source Effect Presets you want to use in the Source Effect Preset Chain's **Details** panel.

 [image: Source Effect Chain Set]

After you configure a Source Effect Preset Chain, you can set it in the **Source > Source Effects Chain** property in a source's **Details** panel. The Source Effects Preset Chain specified will take effect after any bus sends in the **Pre-Effect Bus Sends** and before any bus sends in the **Post-Effect Bus Sends**.

### Outputting Audio from Audio Buses

By default, Audio Buses are not audible. To output Audio Bus audio, you must use a **Source Bus** or **MetaSound Source**.

#### Source Buses

A Source Bus renders the output of an Audio Bus. Source Buses can use sound source features, such as spatialization, attenuation, and concurrency resolution. They can even output audio to other Audio Buses and Source Buses.

Source Buses only support **Mono** or **Stereo**. Use a MetaSound Source to support additional channel configurations.

To create a Source Bus:

- In the **Content Browser**, click the **Add** button.

- Select **Audio > Source > Source Bus**.

 [image: Source Bus Details]

Set the Audio Bus you want to render in the Source Bus **Details** panel. Additionally, you can select the number of **Source Bus Channels** and the **Source Bus Duration**.

If the **Source Bus Duration** is set to 0, the Source Bus will play indefinitely. Use any positive value to create a one-shot sound source that will stop after the duration.

#### MetaSound Sources

You can also render Audio Bus audio by using a MetaSound Source. On the MetaSound graph, use an **Audio Bus Reader** node to read in Audio Bus data, then attach it to the corresponding outputs.

In addition to mono and stereo, you can produce quad, 5.1, and 7.1 audio with a MetaSound Source by setting the **Output Format** accordingly.

For more information on MetaSounds, see the MetaSounds documentation (-> metasounds-in-unreal-engine).

### Audio Buses vs. Submixes

Audio Buses are comparable to **Submixes** but differ in several important ways:

- They don't have graphs.

- Their audio is not audible by default.

- They provide a way to define spatialization behavior.

- They can't have DSP effects applied to them directly.

- They only use CPU resources when receiving source audio.

See Submixes Overview (-> overview-of-submixes-in-unreal-engine) for more information on Submixes.

- audio
- audio bus
- submix
- metasounds
- source bus

On this page

- Creating Audio Buses (-> audio-bus-overview)
- Sending Audio to Audio Buses (-> audio-bus-overview)
- Audio-Rate Modulation with Audio Buses (-> audio-bus-overview)
- Outputting Audio from Audio Buses (-> audio-bus-overview)
- Source Buses (-> audio-bus-overview)
- MetaSound Sources (-> audio-bus-overview)
- Audio Buses vs. Submixes (-> audio-bus-overview)

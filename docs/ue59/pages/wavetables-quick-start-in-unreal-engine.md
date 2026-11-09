# WaveTables Quick Start

https://dev.epicgames.com/documentation/en-us/unreal-engine/wavetables-quick-start-in-unreal-engine?application_version=5.9

> A quick guide on getting started with WaveTables.

[image: WaveTables Quick Start]

Learn to use this **Beta** feature, but use caution when shipping with it.

**WaveTables** store periodic wave data in lookup tables and provide a way to perform wavetable synthesis and sampling in **MetaSounds**.

This guide teaches you how to create a MetaSound powered by two WaveTables with different Sample Modes.

- **Fixed Resolution** - Enforces uniform resolution of all WaveTables in the bank. This mode supports lockstep mixing, interpolating, and spatializing, which is useful for oscillating or enveloping.

- **Fixed Sample Rate** - Enforces uniform sample rate for all WaveTables in the bank. This mode supports discrete audio playback at a shared speed, which is helpful for sampling and granulating.

## Create the Fixed Resolution WaveTable Bank

Click image for full size.

To create the Fixed Resolution WaveTable Bank:

- In the **Content Browser**, click the **Add **button.

- Select **Audio > WaveTable > WaveTable Bank**.

- Name the WaveTable Bank `WTB_FixedResolution`.

- Double-click the WaveTable Bank to open the **WaveTable Bank Editor**.

- In the **Details** panel: Disable **Bipolar**.

- Click the **Add Element (+)** button for **Entries** twice.

- Expand **Index [0]** and set **Curve Type** to **Linear (Ramp Out)**.

- Expand **Index [1]** and set **Curve Type** to **Linear (Ramp In)**.

- Save the WaveTable Bank.

- Close the **WaveTable Bank Editor**.

## Create the Fixed Sample Rate WaveTable Bank

Click image for full size.

To create the Fixed Sample Rate WaveTable Bank:

- In the **Content Browser**, click the **Add **button.

- Select **Audio > WaveTable > WaveTable Bank**.

- Name the WaveTable Bank `WTB_FixedSampleRate`.

- Double-click the WaveTable Bank to open the **WaveTable Bank Editor**.

- In the **Details** panel: Click the **Add Element (+)** button for **Entries** twice.

- Expand **Index [0]**: Set **Curve Type** to **Sine (360 deg)**

- Set **Duration (Sec)** to 0.5.

- Expand **Index [1]**: Set **Curve Type** to **Sine (360 deg)**.

- Set **Duration (Sec)** to 1.0.

- Save the WaveTable Bank.

- Close the **WaveTable Bank Editor**.

## Create the MetaSound Source

Click image for full size.

Construct a MetaSound that uses the WaveTable Banks for generating and enveloping. Follow the steps below to build a MetaSound with the graph above.

- In the **Content Browser**, click the **Add **button.

- Select **Audio > MetaSound Source**.

- Name the new MetaSound `MSS_WaveTableDemo`.

- Double-click the MetaSound to open the **MetaSound Editor**.

- In the **Interfaces **panel, click the **Remove (Trash Bin)** button next to the **UE.Source.OneShot** Interface entry. This removes the On Finished Output node, which isn't used on looping sounds.

### Build the Generator Section

- Find the **On Play Input** node in the graph and drag off of the pin into an empty space. Enter "Trigger Repeat" into the node search to create a connected node. You can move the node around the graph by dragging it.

- On the **Trigger Repeat** node: Set **Period** to 1.0.

- Drag off** **the **RepeatOut** pin and create a **Trigger Counter** node.

- On the **Trigger Counter** node: Set **Reset Count** to 2.0.

- Drag off the **On Trigger** pin and create a **WaveTable** **Player** node.

- Connect the **Count** pin to the **Index** pin of the **WaveTable Player** node.

- On the **WaveTable Player** node: Click the **Bank** dropdown and set it to `WTB_FixedSampleRate`.

- Set **Pitch Shift** to 440.0.

- Enable **Loop**.

### Build the Envelope Section

- Right-click in an empty space and create a **Get WaveTable From Bank** node.

- On the **Get WaveTable From Bank** node: Click the **Bank** dropdown and set it to `WTB_FixedResolution`.

- Drag off the **TableIndex** pin and select **Promote to Graph Input**. This creates a **Float Input** node named TableIndex.

- Drag off the **Out** pin and create a **WaveTable Envelope** node.

- On the **WaveTable Envelope** node: Drag off the **On Play** pin and create a **Get On Play** node.

- Click the down arrow at the bottom of the node to expand the pin list.

- Set **Mode** to Loop.

### Connect the Outputs

- Right-click in an empty space and create a **Mono Mixer (2)** node.

- On the **Mono Mixer (2)** node: Connect the **In 0** pin to the **Mono Out** pin of the **WaveTable Player** node.

- Connect the **Gain 0 (Lin) **pin to the **Out** pin of the **WaveTable Envelope** node.

- Connect the **Out** pin to the **Out Mono Output** node.

- Save the MetaSound.

## Test the MetaSound

Click the **Play** button on the **MetaSound Editor Toolbar** to play the MetaSound. You can adjust the **TableIndex** graph input value by clicking the **Input Widget (Dial)** on the node and dragging up or down.

The WaveTables in `WTB_FixedSampleRate` alternate playback every second. The gain is controlled by a WaveTable from `WTB_FixedResolution`, which is selected by the TableIndex graph input. TableIndex values between 0 and 1 produce a blend between the WaveTables in the bank.

## Own Your Own!

Now that you've finished this Quick Start, consider taking this project further. Below are some suggestions you can explore on your own.

- Build a MetaSound with the WaveTable nodes not used in this guide, such as the **WaveTable Oscillator** node and **Evaluate WaveTable** node. For more information on WaveTable nodes, see MetaSounds Reference Guide (-> metasounds-reference-guide-in-unreal-engine).

- Customize your WaveTable curves by setting the **Curve Type** to **Custom**. See Curve Editor (-> animation-curve-editor-in-unreal-engine) for more information about the toolbar and editing curves.

- Import audio files as a WaveTable by setting the **Curve Type** to **File** and the **Wave Table Settings > File Path.**

- beta
- audio
- sound sources
- metasounds
- wavetables

On this page

- Create the Fixed Resolution WaveTable Bank (-> wavetables-quick-start-in-unreal-engine)
- Create the Fixed Sample Rate WaveTable Bank (-> wavetables-quick-start-in-unreal-engine)
- Create the MetaSound Source (-> wavetables-quick-start-in-unreal-engine)
- Build the Generator Section (-> wavetables-quick-start-in-unreal-engine)
- Build the Envelope Section (-> wavetables-quick-start-in-unreal-engine)
- Connect the Outputs (-> wavetables-quick-start-in-unreal-engine)
- Test the MetaSound (-> wavetables-quick-start-in-unreal-engine)
- Own Your Own! (-> wavetables-quick-start-in-unreal-engine)

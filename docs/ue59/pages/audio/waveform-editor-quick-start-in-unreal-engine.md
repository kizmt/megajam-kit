# Waveform Editor Quick Start

https://dev.epicgames.com/documentation/en-us/unreal-engine/waveform-editor-quick-start-in-unreal-engine?application_version=5.9

> Get started with the Waveform Editor.

[image: Waveform Editor Quick Start]

Learn to use this **Beta** feature, but use caution when shipping with it.

The Waveform Editor is an Unreal Engine plugin that lets you view, preview, and edit Sound Wave assets directly inside the editor. You can also export .wav files for use outside of the editor without losing transformation metadata.

## Enable Waveform Editor

To enable Waveform Editor, follow these steps:

- In the Unreal Editor’s main menu, select **Edit > Plugins**.
- In the **Plugins **window, search for **Waveform Editor** and check the checkbox next to it.

- Restart the editor when prompted.

To open Waveform Editor, you must have a Sound Wave asset in your project. In the **Content Browser**, double click on the asset and the Waveform Editor will open.

You can learn more about importing Sound Waves in Importing Audio Files (-> importing-audio-files).

If you encounter issues locating the plugin through the editor, you can find the Waveform Editor in your engine’s root folder at the following path:

`\Engine\Plugins\Editor\WaveformEditor`

## Waveform Editor UI

 With the Waveform Editor open, take a moment to get familiar with the user interface.

| Number | UI Element | Description |
| --- | --- | --- |
| 1 | File Controls | Save the current Sound Wave or locate it in the Content Browser. |
| 2 | Playback Controls | Play, pause, and stop the active Sound Wave. |
| 3 | Zoom Controls | Zoom the waveform timeline in or out. |
| 4 | Export/Reimport Options | Export or Reimport the current Sound Wave. You can learn more about exporting and reimporting Sound Waves in Export and Reimport (-> waveform-editor-quick-start-in-unreal-engine). |
| 5 | Fade In/Fade Out Options | Toggle fade in/fade out for current Sound Wave, and curve options. |
| 6 | Marker/Loop Region Options | Create or delete markers and loop regions. |
| 7 | Details Panel | View or modify the Sound Wave asset details (including transformations). |
| 8 | Processing Panel | View or apply waveform transformations. |
| 9 | Timeline | Display the timing of the current Sound Wave. Track and change playback by moving the playhead.To change the unit from seconds to frames, right-click the playhead. |

You can change colors, line thickness, and other display settings for the Waveform Editor in **Edit > Editor Preferences > Waveform Editor Display**.

## Transformations

**Transformations** are effects that you can stack on a Sound Wave. Sound Waves can have up to one instance of each of the following transformations, in this order:

- Trim Fade (-> waveform-editor-quick-start-in-unreal-engine)
- Markers and Loop Regions (-> waveform-editor-quick-start-in-unreal-engine)
- Normalize (-> waveform-editor-quick-start-in-unreal-engine)
- Fade (-> waveform-editor-quick-start-in-unreal-engine)

You can choose which transformations are added automatically the first time you open a Sound Wave by selecting them in **Launch Transformations**. To open this menu, follow these steps:

- In the Waveform Editor, select **Edit > Editor Preferences**.
- Under **Plugins**, select **Waveform Editor Transformations**.
- Under **Launch Options**, click the **Add (+)** button to add transformations.

### Trim Fade

**Trim Fade** combines two audio editing operations into one:

- **Trim **cuts the Sound Wave down to a specific range by setting a start time and end time.
- **Fade **applies a fade-in at the beginning and/or a fade-out at the end of that trimmed audio.

To apply Trim Fade transformation, follow these steps:

- In the **Details **panel or the **Processing **panel, under **Transformations**, click the **Add (+) **button.
- Select **Waveform Transformation Trim Fade** from the dropdown menu.

In either panel, Trim Fade appears as one transformation with both a Trim group and a Fade group of properties that you can expand and adjust.

For more information on editing fades and an explanation of curve control options, see Fade (-> waveform-editor-quick-start-in-unreal-engine).

Trim Fade is applied by default and is automatically removed if unused. Because of this, it does not appear in the Launch Transformations menu.

### Marker and Loop Regions

**Markers** are timestamped points placed at specific positions within a Sound Wave. For example, you can use markers to indicate where a gunshot sound should sync with something in-game. Markers don't have duration; they're a labeled point in time that other systems (like Blueprint or Metasounds) can reference to trigger events at that exact moment during playback.

A **loop region **is a segment within a Sound Wave with a start time and end time that indicates a section of the audio meant to repeat during playback. This is useful for audio like ambient background noise or a sustained engine hum, where you want the sound to play indefinitely without an audible seam.

#### Adding, Editing, and Removing Markers and Loop Regions

You can add, edit, or remove markers and loop regions in a four places:

- In the **Processing **panel, under the **Transformations **dropdown.
- In the **Details **panel, under the **Transformations **dropdown.
- In the **Waveform Editor toolbar**, using the create and delete marker/loop buttons.
- In the **Timeline**.

If a loop region is selected, playback in the Waveform Editor will loop infinitely within that region. Clearing the selection allows playback to run through all active wave data, ignoring loop regions.

Marker and loop region display parameters can be adjusted under **Edit > Editor Preferences > Waveform Transformations Display**.

#### Converting Between Markers and Loop Regions

Markers are functionally the same object as loop regions. This means a marker can be converted into a loop region, and vice versa, rather than needing to be recreated from scratch.

To convert a loop region into a marker (and vice versa), follow theses steps:

- In the Timeline, right-click the loop region and select **Toggle Between Marker - Loop Region**.
- To toggle it back, right-click the marker’s grab handle and select **Toggle Between Marker - Loop Region** again.

#### Interaction with Trim Fade

Markers and loop regions can be trimmed by a Trim Fade transformation. Playback is limited to within the trim range, meaning markers and loop regions outside of it will not play. However, these markers and loop regions aren't deleted; they remain inactive and are still loaded and saved during import and export.

#### Cue Point Origin

In a Sound Wave asset, there are two sources of marker data — from the original .wav file's data, and from the Waveform Editor's Marker Transformation.

Markers and loop regions are stored as a separate transformation layered on top of the original Sound Wave, rather than overwriting the Sound Wave's original data. This means that if the original .wav file already had marker data embedded in it, that data isn't destroyed by anything you add in the editor.

You can switch between which one is active using the **Cue Point Origin** dropdown in the Sound Wave's Details panel. If no marker data is present in the original .wav file, Cue Point Origin defaults to **Marker Transformation** and **Wave File** if there is data. If it's set to Wave File and you add a marker in the Waveform Editor, you'll be prompted to change Cue Point Origin to Marker Transformation.

#### Marker and Loop Region Properties

Markers and loop regions are defined by the **FSoundWaveCuePoint **struct. The following properties are readable by Blueprint:

| Property | Description |
| --- | --- |
| CuePointID (int32) | Unique identifier; read-only, automatically assigned. |
| Label (FString) | User-defined string data. |
| Frame Position (int64) | Frame offset in uncompressed wave data. |
| Frame Length (int64) | 0 for markers; forced to be ≥10 frames for loop regions. |
| IsLoopRegion (bool) | Loops this transformation when selected during playback in the editor. |

### Normalize

**Normalize **applies a constant amount of gain to target a maximum volume level.

To apply a Normalize transformation, follow these steps:

- In the **Details **panel or the **Processing **panel, under **Transformations**, click the **Add (+) **button.
- Select **Waveform Transformation Normalize**.

Under Normalization you’ll find three options to control the transformation:

| Setting | Description |
| --- | --- |
| **Target** | The maximum target volume in decibels. |
| **Max Gain** | The maximum target gain. |
| **Mode** | The type of analysis used to find the peak volume:**Peak**: Finds the single loudest sample in the file and normalizes based on that.**RMS**: Measures average signal power over time rather than just the single highest peak.**DWeighted Loudness**: Applies a frequency-dependent filter that approximates how the human ear perceives loudness. |

When applied after a Trim Fade transformation, Normalization will apply only to the trimmed section of the waveform.

### Fade

**Fade** gradually raises or lowers volume at points you choose within the Sound Wave. Each fade region includes a fade-in and a fade-out, and can be placed anywhere on the waveform, with or without a Trim Fade transformation.

 You can apply a Fade transformation in three places:

- From the **Processing **panel
- From the **Details **panel
- From the Waveform Editor Toolbar

** Curve shapes** control the rate at which volume changes over the course of a fade:

| Curve Shape | Description |
| --- | --- |
| **Linear** | Volume changes at a constant, steady rate from start to end. |
| **Exponential** | Volume starts slow and accelerates toward the end. |
| **Logarithmic** | Volume starts fast and decelerates toward the end. |
| **Sigmoid** | Volume starts slow, accelerates through the middle, and decelerates toward the end. |

You can adjust curve shapes in four places:

- From the Waveform Editor's toolbar.
- From the **Processing **panel
- From the **Details **panel
- By right-clicking the triangle handles of a fade in or fade out in the Timeline.

You can adjust the duration and shape of curves in the Details or Processing panels, or by dragging the curve handles in the Timeline. The triangle handles adjust duration, and the square handles adjust the fade's start and end time.

Selecting a triangle handle and scrolling changes the Fade Curve.

## Export and Reimport

**Export **and **Reimport **let you share edited audio with other tools or teammates, or bring in marker and loop data that was created outside the editor, without redoing your edits from scratch.

To export audio files, follow these steps:

- In the Waveform Editor’s toolbar, click the three-dot button to choose **Mono **or **Stereo**.
- Click the export button.

You can import files from the Waveform Editor's toolbar in three different ways:

| Reimport Options | Description |
| --- | --- |
| **Reimports asset via referenced .wav file** | Import the most recent .wav files without cue and smpl chunks. This keeps existing transformations in the editor. |
| **Reimport asset via referenced .wav file and overwrite transformations** | Import the .wav file along with cue and smpl chunks. |
| **Reimport from a selected .wav file** | Import any .wav files without cue and smpl chunks. This keeps existing transformations in the editor. |

To locate the reimport options, navigate to the editor toolbar and click the three-dot menu next to the reimport button.

Markers and loop regions can also be exported back out to .wav files as cue and smpl chunk data.

The number of times to play the loop from the smpl chunk is ignored. Looped playback is instead controlled by the Waveform Editor.

If the Start Time is set past a Cue Marker and you export it, that Cue Marker will default to a Frame Position of 0.

## Audio Analysis

Waveform Editor gives you access to audio analysis tools for calculating LUFS and SamplePeakDB. LUFS measures perceived loudness, and SamplePeakDB measures the highest sample amplitude in the audio. These are USoundWave members that display as metadata when hovering over a USoundWave asset in the Content Browser.

These values update automatically whenever you apply a transformation, so you can confirm your edits (such as a Normalize or Fade) have the loudness or peak level you expect without needing to check in an external tool.

Audio analysis is triggered in three cases:

- On asset import or reimport (per asset)
- When opening an asset in the Waveform Editor (per asset)
- Using the ResaveSoundWaveLoudness (-> waveform-editor-quick-start-in-unreal-engine) commandlet (bulk analysis)

## Commandlets

### FixSoundWaveTimecodeInfoCommandlet

This commandlet fixes LogSlate warnings from USoundWave::TimecodeInfo caused by incorrect symbols.

To use the commandlet, run the following command from your OS command line:

 Command Line

```
UnrealEditor-Cmd.exe "Path\To\YourProject.uproject" -run=FixSoundWaveTimecodeInfoCommandlet
```

UnrealEditor-Cmd.exe "Path\To\YourProject.uproject" -run=FixSoundWaveTimecodeInfoCommandlet

To confirm the commandlet was successful, check the log output for the category LogFixSoundWaveTimecodeInfoCommandlet — that's where this commandlet writes its output. When the commandlet starts, you'll see this line first:

`Fixing soundwave timecodeInfo. Note: Params are ignored.`

After that, the log will list every Sound Wave the commandlet fixed. If a particular Sound Wave couldn't be saved after being fixed, an error will be logged for that asset so you know it needs attention.

### ResaveSoundWaveLoudness

This commandlet analyzes legacy USoundWaves and updates their metadata to include LUFS and SamplePeakDB.

To use the commandlet, run the following command from your OS command line:

 Command Line

```
UnrealEditor-Cmd.exe "Path\To\YourProject.uproject" -run=ResaveSoundWaveLoudness
```

UnrealEditor-Cmd.exe "Path\To\YourProject.uproject" -run=ResaveSoundWaveLoudness

If your project uses source control (like Perforce), this commandlet needs to check out any Sound Wave files it modifies before it can save changes to them. Add the -AutoCheckOut flag to the command above to have it do this automatically, for example:

 Command Line

```
UnrealEditor-Cmd.exe "Path\To\YourProject.uproject" -run=ResaveSoundWaveLoudness -AutoCheckOut
```

UnrealEditor-Cmd.exe "Path\To\YourProject.uproject" -run=ResaveSoundWaveLoudness -AutoCheckOut

Without this flag, the commandlet may fail to save changes to files that are still checked in.

## Keyboard Shortcuts

You can customize the following default shortcuts under **Edit > Editor Preferences > General > Keyboard Shortcuts > Waveform Editor**.

| Shortcut | Action |
| --- | --- |
| , | Move loop region start earlier. |
| . | Move loop region start later. |
| ] | Move loop region end earlier. |
| [ | Move loop region end later. |
| Shift + , | Move start to next earlier zero crossing. |
| Shift + . | Move start to next later zero crossing. |
| Shift + ] | Move end to next earlier zero crossing. |
| Shift + [ | Move end to next later zero crossing. |
| = | Increase move amount (1, 10, 50, or 100 ms; default 50 ms). |
| - | Decrease move amount. |
| F | Select next loop marker. |
| B | Select previous loop marker. |
| G | Skip playhead to next marker. |
| H | Snap playhead to next zero crossing. |
| Enter | Stop playback and rewind to start. |
| Space | Toggle play/pause. |
| Shift + Space | Reset playhead to start. |
| Delete | Delete selected marker or loop region. |
| Right-click + drag | Pan. |

A **zero crossing** is a point where the waveform's amplitude passes through zero — snapping edits to these points helps avoid audible clicks or pops at cut points.

- beta
- audio
- sound sources
- waveform editor

On this page

- Enable Waveform Editor (-> waveform-editor-quick-start-in-unreal-engine)
- Waveform Editor UI (-> waveform-editor-quick-start-in-unreal-engine)
- Transformations (-> waveform-editor-quick-start-in-unreal-engine)
- Trim Fade (-> waveform-editor-quick-start-in-unreal-engine)
- Marker and Loop Regions (-> waveform-editor-quick-start-in-unreal-engine)
- Adding, Editing, and Removing Markers and Loop Regions (-> waveform-editor-quick-start-in-unreal-engine)
- Converting Between Markers and Loop Regions (-> waveform-editor-quick-start-in-unreal-engine)
- Interaction with Trim Fade (-> waveform-editor-quick-start-in-unreal-engine)
- Cue Point Origin (-> waveform-editor-quick-start-in-unreal-engine)
- Marker and Loop Region Properties (-> waveform-editor-quick-start-in-unreal-engine)
- Normalize (-> waveform-editor-quick-start-in-unreal-engine)
- Fade (-> waveform-editor-quick-start-in-unreal-engine)
- Export and Reimport (-> waveform-editor-quick-start-in-unreal-engine)
- Audio Analysis (-> waveform-editor-quick-start-in-unreal-engine)
- Commandlets (-> waveform-editor-quick-start-in-unreal-engine)
- FixSoundWaveTimecodeInfoCommandlet (-> waveform-editor-quick-start-in-unreal-engine)
- ResaveSoundWaveLoudness (-> waveform-editor-quick-start-in-unreal-engine)
- Keyboard Shortcuts (-> waveform-editor-quick-start-in-unreal-engine)

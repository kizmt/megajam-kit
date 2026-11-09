# Sounds, Virtual Loops, and Plots in Audio Insights

https://dev.epicgames.com/documentation/en-us/unreal-engine/sounds-virtual-loops-and-plots-in-audio-insights-in-unreal-engine?application_version=5.9

> See live sound parameters, mute or solo individual sounds, and track virtualized sounds that aren't currently audible.

[image: Sounds, Virtual Loops, and Plots in Audio Insights]

When used together, the **Sounds**, **Plots**, and **Virtual Loops** tabs give you a full picture of every sound in your project, including what's currently playing, how it sounds the way it does, and why it might not be playing at all.

The **Sounds **tab lists every currently-playing sound with its live parameters, and lets you mute or solo sounds. From there, you can send any sound's data to the **Plots **tab to see how a parameter like volume or pitch changes over time. Virtual Loops covers the sounds Unreal Engine is still tracking but not currently outputting.

## Sounds

The **Sounds **tab displays all the currently-playing sound assets, listed by category, with text displays of runtime data for each. It gives you a way to interact with the playing sounds to mute and solo (isolate) elements of the mix. The sounds are identified using their .uasset names and not the runtime instance name.

### Filter Sounds

Click the Filter button to filter the sounds listed. The sound filter category options are:

- **MetaSound**: MetaSound Source assets.
- **Sound Cue**: Sound Cues and any child Sound Waves.
- **Procedural Source**: Any mixer input object that inherits from USoundWaveProcedural in code.
- **Sound Wave**: Simple wave assets.
- **Sound Cue Template**: Sound Cues built at runtime from a template.
- **Other**: Audio Source Buses.
- **Pinned**: Specific selected sounds you pinned at the top of the list.

You can right-click a sound to pin it and then use the filter button to filter for pinned sounds.

### Sounds Toolbar

The menu bar at the top of the **Sounds **tab has the following controls for muting, soloing, and plotting sounds:

| Sounds Toolbar Button | Description |
| --- | --- |
| **Mute** | **Mute by Text**: Mutes all sounds that are currently filtered to show in the sounds list. If you update the filter text in the search box, the mute mode updates the muted sounds accordingly. Mute by Text mode is indicated by the mute icon turning green. **Mute Selected**: Mutes selected sounds. This is a toggle control as opposed to a modal control for filtered sounds |
| **Solo** | **Solo by Text**: Solos all sounds that are currently filtered to show in the sounds list. Soloed sounds are updated as you change the filter text in the search bar. If everything is filtered, nothing is played. Solo by Text mode is indicated by the solo icon turning green. Solo takes precedence over mute; if a sound is both muted and soloed, it is still played.**Solo Selected**: Toggles soloing on selected sounds. This is a toggle control as opposed to a modal control for filtered sounds. |
| **Clear All Mutes/Solos** | Reset the muted and soloed sounds so that the mix is unaffected. |
| **Plot Selected, Plot by Text ** | Sends data from the selected or filtered sounds to the **Plots **tab. |
| **Clear All Plots** | Stops sending any sound data to the Plots tab. |

### Sounds Data

Customize the data columns in the **Sounds **tab with the **Settings **menu in the Sounds toolbar. In addition to the individual columns, you can use the **Select All** control to select or deselect all the columns at once.

In a hierarchical sound asset (such as a Sound Cue with several child Sound Waves), the Volume and Pitch columns show different values depending on the row you're looking at.

The Sound Cue's row shows its own top-level Volume and Pitch. Each child Sound Wave's row shows an aggregated value instead. This value combines the Sound Cue's top-level value with any additional modulation applied specifically to that child Sound Wave.

| Column Name | Description |
| --- | --- |
| **Muted** | Selects and displays if this instance of the sound is muted (editor only). |
| **Soloed** | Selects and displays if this instance of the sound is soloed (editor only). |
| **Plotted** | Selects and displays if this instance of the sound is plotted on the Plots tab. |
| **Name** | Displays the UAsset name of the sound, not the runtime instance name. |
| **Play ******Order | Displays the unique ID given to the audio source in the engine. This is the same value used in the **Events Log** tab. In aggregated sounds such as a Sound Cue, the underlying wave players have a unique Play Order; this column shows the parent and wave player Play Order values separated by a comma. |
| **Priority** | Set for concurrency, a positive float value with higher numbers indicating greater priority |
| **Distance** | Displays the positive distance from the sound renderer in map units. |
| **Distance/Occlusion Attenuation** | Displays the value of the volume and filtering multiplier applied based on distance and occlusion of a sound, a float value from 0.0 to 1.0, with 1.0 being unattenuated. |
| **Amp (Peak)** | Displays the value of an envelope follower tracking the sound amplitude, a float value from 0.0 to 1.0, with 1.0 being the maximum output amplitude. |
| **Volume** | Displays the product of all volume values and modulators for this instance of the sound, excluding distance attenuation, a positive float value which is a linear amplitude multiplier. |
| **LPF** | Displays the lowest frequency of all low-pass filter controls and modulators for this mixer source, indicating the cutoff frequency in Hertz. |
| **HPF** | Displays the highest frequency of all high-pass filter controls and modulators for this mixer source, indicating the cutoff frequency in Hertz. |
| **Pitch** | Displays the sum of all pitch values and modulators for this instance of the sound, a positive float value as a linear playback rate multiplier. |
| **Relative Render Cost** | Displays a numerical value indicating how many wave-playing resources the specific sound uses. This is useful to see how expensive a Sound Cue or MetaSound is with embedded wave players. |
| **Actor Label** | Displays either the name of the world actor that holds the Audio Component or the actor that triggered the sound. |
| **Audio Component** | If you've given the Audio Component a custom name, it is shown in this column |
| **Category** | Displays a text indication of the sound category listed above. The category icon to the left of the name column is considered part of the name, and is not controlled by this column setting. |

### Sounds Settings

The following settings are available in the **Settings **menu in the **Sounds **tab.

| Sounds Setting | Description |
| --- | --- |
| **Amp (Peak) Display Mode** | Toggle between decibel (dB) and linear amplitude displays. |
| **View** | Controls the displayed sound hierarchy. Options are:**Tree View**: Listing by categories.**Active Sounds**: Grouped by active sounds.**Flat List**: Show individual wave players in a flat list. |
| **Auto-Expand** | Sounds are hierarchically grouped by category first, then by sound source. This controls how the nested sound assets are automatically displayed. Options are:**Categories****Everything****Nothing** |
| **Visible Columns** | Select the data columns described above under Sound Data Columns. |
| **Show Stopped Sounds** | When enabled, sounds that recently stopped stay visible in the list grayed out for a short time, making it easier to observe short sounds. |
| **Recently Stopped Timeout** | Determines how many seconds stopped sounds remain visible in the list after they stop. |

### Sound Asset Controls

In the **Sounds **tab, right-click on a selected sound to access the following options:

- Pin a sound to the top of the display.
- Browse to the asset in the content browser.
- Open up the asset editor from this window.

## Plots

The **Plots **tab displays a line graph of value histories for the sounds selected to plot in the Sounds tab. The plot line colors match the colors displayed in the Plot column of the Sounds tab. Plots display the most recent 5 seconds of value history.

### Plot Controls

- **Parameter selection**: Use this pull down menu to select the specific sound parameters from the Sounds tab to display. All selected sounds display the same parameter, differentiated by color.Amp (Peak)
- Volume
- Distance
- Distance/Occlusion Attenuation
- Pitch
- Priority
- LPF Freq (Hz)
- HPF Freq (Hz)

- **Y Axis Range**: You can choose between an automatic range scaled to fit all the data in the window or a custom range with min and max values you select.
- **Select Time Stamp**: When you select a time stamp point on the plot, the Sounds tab displays the data at that time stamp, and the **Event Log** tab shows the nearest event to that time stamp.
- **Bold Sound Tab Selection**: If you select a plotting sound in the Sounds tab, its plot is shown thicker than others to help identify the selection.

## Virtual Loops

The **Virtual Loops** tab displays a list of all Active Sounds currently tracked by the renderer but not producing samples for the mixer due to concurrency or distance attenuation factors.

### Virtual Loops Data

The data shown on the Virtual Loops tab. You can select which data is displayed using the Virtual Loop Controls.

| Data | Description |
| --- | --- |
| **Play Order** | Shows the unique ID given to the audio source in the engine. This is the same value used in the **Event Log** tab. |
| **Name** | Shows the .uasset name for the virtualized mixer source. |
| **Time (Virtualized)** | Shows the time in seconds since this sound last sourced samples for the mixer. |
| **Time (Total)** | Shows the total playing time in seconds for this sound, both virtually and not. |
| **Update Interval** | Shows the time in seconds between position or concurrency updates that determine if this sound remains virtual. This value varies with distance from the renderer. |

### Virtual Loops Controls

- **Browse**: Click to show the selected asset in the Content Browser (editor only).
- **Open**: Click to open the asset editor for the selected asset (editor only).
- **Data Filter**: Right-click on the list header bar to open a context menu you can use to select which audio data values are shown for each mixer source.
- **Edit Asset**: Double-click on a mixer source in the list display to open the asset editor with that asset (editor only).
- **Selection**:**Single-click**: Selects a virtual loop and draws a debug sphere at its location.
- **Shift-click**: Multi-selects virtual loops and draws a debug sphere for each one selected at each location.
- **Control-click**: Adds a virtual loop to a multi-selection and draws a debug sphere at its location.

- **De-selection**: Control-click a selected virtual loop to de-select it and remove its debug sphere.
- **Debug String**: In the editor, selected assets in this list show a debug string at the location of a virtualized sound.

On this page

- Sounds (-> sounds-virtual-loops-and-plots-in-audio-insights-in-unreal-engine)
- Filter Sounds (-> sounds-virtual-loops-and-plots-in-audio-insights-in-unreal-engine)
- Sounds Toolbar (-> sounds-virtual-loops-and-plots-in-audio-insights-in-unreal-engine)
- Sounds Data (-> sounds-virtual-loops-and-plots-in-audio-insights-in-unreal-engine)
- Sounds Settings (-> sounds-virtual-loops-and-plots-in-audio-insights-in-unreal-engine)
- Sound Asset Controls (-> sounds-virtual-loops-and-plots-in-audio-insights-in-unreal-engine)
- Plots (-> sounds-virtual-loops-and-plots-in-audio-insights-in-unreal-engine)
- Plot Controls (-> sounds-virtual-loops-and-plots-in-audio-insights-in-unreal-engine)
- Virtual Loops (-> sounds-virtual-loops-and-plots-in-audio-insights-in-unreal-engine)
- Virtual Loops Data (-> sounds-virtual-loops-and-plots-in-audio-insights-in-unreal-engine)
- Virtual Loops Controls (-> sounds-virtual-loops-and-plots-in-audio-insights-in-unreal-engine)

Related documents

Profiling with Audio Insights

 [image: Profiling with Audio Insights] (-> audio-insights-in-unreal-engine)

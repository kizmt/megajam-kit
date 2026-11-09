# Sequencer Hotkeys

https://dev.epicgames.com/documentation/en-us/unreal-engine/sequencer-hotkeys-in-unreal-engine?application_version=5.9

> A list and description of Sequencer's main hotkeys.

[image: Sequencer Hotkeys]

The following is a list of Sequencer's main hotkeys and their functions.

## Playback and Timing

| Command | Description |
| --- | --- |
| **Spacebar** | Toggles playback of the sequence between play and pause. |
| **Down Arrow** | Plays the sequence. |
| **K** | Pauses the sequence. |
| **Up Arrow** | Jumps to the start of the sequence. |
| **Ctrl + Up Arrow** | Jumps to the end of the sequence. |
| **Left Arrow** | Steps backward in the sequence by a single frame. |
| **Right Arrow** | Steps forward in the sequence by a single frame. |
| **L** | Shuttles forward. Shuttle is an editing concept that describes playing the sequencer at incremental speeds. Pressing this key will start playing the sequence and repeatedly pressing it will increase the speed. |
| **J** | Shuttles backward. If the sequence is already playing or shuttling forward, then this will decrease the speed with each press and eventually start playing backwards. |
| **Shift + Left Arrow** | Steps backward in the sequence by the amount defined by **Jump Frame Increment** in the Playback Options (-> sequencer-cinematic-toolbar-in-unreal-engine) menu. |
| **Shift + Right Arrow** | Steps forward in the sequence by the amount defined by **Jump Frame Increment** in the Playback Options menu. |
| **Ctrl + Left Arrow** | Moves a selected keyframe or section backward by a single frame. |
| **Ctrl + Right Arrow** | Moves a selected keyframe or section forward by a single frame. |
| **[** | Sets the start time of the sequence to the playhead. |
| **]** | Sets the end time of the sequence to the playhead. |
| **End** | Sets both the start and end times of a master sequence to match the duration of all shots. |
| **.** | Steps forward in the sequence by each keyframe and section bounds. |
| **,** | Steps backward in the sequence by each keyframe and section bounds. |
| **I** | Sets the start point of a custom timeline selection range to the playhead. |
| **O** | Sets the end point of a custom timeline selection range to the playhead. |
| **Page Up** | Creates a custom timeline selection range which encompasses the previous shot from the playhead. |
| **Page Down** | Creates a custom timeline selection range which encompasses the next shot from the playhead. |
| **M** | Toggles the creation or deletion of a custom timeline mark at the current playhead time. |
| **Ctrl + Shift + .** | Fast-forwards Sequencer playback to the previous custom timeline mark. |
| **Ctrl + Shift + ,** | Fast-forwards Sequencer playback to the next custom timeline mark. |
| **Ctrl + Shift + T** | Cycles time display between Timecode, Seconds, and Frames. |
| **Ctrl + A** | Adds the currently-selected Actor to Sequencer. |
| **Shift + S** | Toggles auto-scroll. When enabled, this automatically scrolls the timeline to keep the playhead visible as the sequence plays. |
| **Ctrl + T** | Go to a specific time in the timeline by typing in a numeric value and then pressing Enter. |
| **Ctrl + R** | Restores all objects animated by Sequencer back to their original editor-default state. |

## Timeline and Track Navigation

| Command | Description |
| --- | --- |
| **Right-Click Drag** | Pans the timeline view according to your cursor movement. |
| **Scroll Mouse Wheel** | Pans the timeline up and down. |
| **Shift + Scroll Mouse Wheel** | Pans the timeline left and right. |
| **Ctrl + Scroll Mouse Wheel** | Zooms the timeline. |
| **Alt + Shift + Right-click Drag** | Zooms the timeline according to your cursor movement. |
| **Home** | Restores the timeline zoom level to frame the start and end times. |
| **-** | Zooms in the timeline by 10%. |
| **=** | Zooms out the timeline by 10%. |
| **V** | Toggles expanding and collapsing selected tracks by a single level. |
| **Shift + V** | Toggles expanding and collapsing selected tracks and their descendants. |
| **Ctrl + G** | Groups the selected tracks into a new folder (-> organize-cinematic-tracks-in-unreal-engine). |
| **Shift + G** | Removes the selected tracks from a folder. |
| **Alt + Left** | Goes back and opens the previously-viewed shot or sequence. |
| **Alt + Right** | Goes forward and opens the previously-viewed shot or sequence. |
| **Ctrl + F** | Focuses on the search bar so you can search for track names in the Sequencer. |
| **Ctrl + [** | Selects all keyframes and sections backward from the playhead. |
| **Ctrl + ]** | Selects all keyframes and sections forward from the playhead. |

## Keyframing

You can use the following commands for primary keyframe operations.

| Command | Description |
| --- | --- |
| **Enter** | Creates a keyframe for each selected track at the playhead. |
| **Middle-Click** | Creates a keyframe for the selected track at your cursor location. |
| **Ctrl + Shift + V** | Pastes copied keyframes from Sequencer's clipboard history. Each time you copy keyframes, they are added to a special Sequencer clipboard history. You can then choose to paste any specific set of copied keys anytime from this history. |
| **Ctrl + Left** | Moves selected keyframes and sections left by a single frame. |
| **Ctrl + Right** | Moves selected keyframes and sections right by a single frame. |
| **Ctrl + M** | Moves selected keyframes and sections by a specified amount. |

### Keyframe Interpolation

You can use the following hotkeys to set keyframe interpolation (-> creating-animation-keyframes-in-unreal-engine) modes.

| Command | Description |
| --- | --- |
| **1** | Sets the selected keyframes to **Cubic (Auto)**. It attempts to maintain a smooth curve between keyframes and eases both the start and end keyframes. It automatically adjusts whenever you add or move keyframes. |
| **2** | Sets the selected keyframes to **Cubic (User)**. Cubic (User) is similar to Cubic (Auto), but it locks the tangent from any further automatic edits when you add or move keyframes. |
| **3** | Sets the selected keyframes to **Cubic (Break)**. Cubic (Break) is similar to Cubic (Auto), but its tangents are broken, allowing you to specify different incoming and outgoing angles from the Curve Editor. |
| **4** | Sets the selected keyframes to **Linear**. Linear tangents cause keyframes to have no smoothing or easing between them, causing abrupt starts and stops when reaching each keyframe. |
| **5** | Sets the selected keyframes to **Constant**. Constant tangents function similarly to non-interpolating keyframes by maintaining their current value until the next keyframe is reached. |

### Section Editing

You can edit Sections (-> creating-animation-keyframes-in-unreal-engine) with the following commands.

| Command | Description |
| --- | --- |
| **Ctrl + /** | Splits the selected section at the playhead location. |
| **Ctrl + ,** | Trims the selected section's left side to the playhead location. This command only removes section data. |
| **Ctrl + .** | Trims the selected section's right side to the playhead location. This command only removes section data. |
| **Alt + [** | Trims all sections' left sides on the selected track to the playhead location. This command can add or remove section data. |
| **Alt + ]** | Trims all sections' right sides on the selected track to the playhead location. This command can add or remove section data. |

### Transform Track

You can use the following commands to keyframe an Actor's transform (-> cinematic-transform-and-property-tracks-in-unreal-engine).

| Command | Description |
| --- | --- |
| **S** | Creates a Transform track (if it does not exist) and keyframes the Location, Rotation, and Scale properties. |
| **Shift + W** | Creates a Transform track (if it does not exist) and keyframes the Location property only. |
| **Shift + E** | Creates a Transform track (if it does not exist) and keyframes the Rotation property only. |
| **Shift + R** | Creates a Transform track (if it does not exist) and keyframes the Scale property only. |

- sequencer
- hotkeys

On this page

- Playback and Timing (-> sequencer-hotkeys-in-unreal-engine)
- Timeline and Track Navigation (-> sequencer-hotkeys-in-unreal-engine)
- Keyframing (-> sequencer-hotkeys-in-unreal-engine)
- Keyframe Interpolation (-> sequencer-hotkeys-in-unreal-engine)
- Section Editing (-> sequencer-hotkeys-in-unreal-engine)
- Transform Track (-> sequencer-hotkeys-in-unreal-engine)

# Sequencer Playlists

https://dev.epicgames.com/documentation/en-us/unreal-engine/sequencer-playlists-in-unreal-engine?application_version=5.9

> Prepare and trigger Sequences during your virtual production session.

[image: Sequencer Playlists]

For broadcasts, live events, or timing-critical playback, you may find it necessary to trigger different sequences to play at arbitrary times. You can do this using **Sequencer Playlists**, where you can prepare sequences and trigger them to play during a virtual production session.

This document provides an overview of how to use Sequencer Playlists.

#### Prerequisites

- Sequencer Playlists is a Plugin (-> working-with-plugins-in-unreal-engine) that must be enabled prior to use. Navigate in the Unreal Engine menu to **Edit > Plugins**, locate **Playlists **in the **Virtual Production** section, and enable it. You will need to restart the editor afterward. [image: enable playlits plugin]

- Your project already contains some Level Sequences (-> unreal-engine-sequencer-movie-tool-overview) that you can reference in your playlist.

## Overview

To start using Sequencer Playlists, navigate to the main Unreal Engine menu and click **Window > Virtual Production > Playlists**. This will open the **Playlists **panel.

 [image: open playlists panel]

The **Playlists **panel contains the following interface:

 [image: playlists panel interface]

- The **Toolbar**, where you can **Save**, **Load**, and **create new playlists**.

- The name of the current playlist and a short description. You can name a playlist by **Saving **it, and you can edit the description by clicking on the playlist description field.

- Adds a **Sequencer item** to the playlist. When one is added, you need to specify the **Sequence** you want to play in the main dropdown menu of the item.

- The **Playlist**, which displays the list of Sequences added to the playlist. The following properties can also be set on each item: **Offset**, which controls the start and end trim of the Sequence, when played.

- **Hold**, which holds the first frame of the Sequence until it is played. This is done by creating a second instance of the Sequence with its **Time Scale** property set to **0**.

- **Loop**, which enables the Sequence to loop when triggered. If looping is enabled, then you must also set the number of times to loop before stopping.

- **Play Mode**, which enables a more streamlined overlay for your items, making it easier to select **Play** and **Stop** for each Sequence.

- **Playback Controls**, which contains the following buttons: **Play All**: Starts playing all playlist items at the same time.

- **Stop All**: Stops all playlist items.

- **Reset All**: Stops all playlist items and re-holds the first frame for any Sequences that have **Hold **enabled.

Hovering your cursor over a Sequence item also reveals additional buttons and properties.

 [image: sequence item interface]

- **Playback Controls**, where you can **Play**, **Stop**, and **Reset** this Sequence.

- **Settings **for this Sequence, which contains the following: **Playback Controls**.

- **Playback Speed**, which controls the playback rate of the Sequence when triggered.

- **Mute**, which disables this Sequence from being triggered when clicking **Play All**. This Sequence can still be triggered directly by clicking **Play**.

- **Remove from Playlist**, which deletes this Sequence from the playlist.

## Workflow Example

The main purpose of Sequencer Playlists is to add pre-created Sequences to a "playlist" so that you can trigger them to play as Subsequences (-> cinematic-subscequences-track-in-unreal-engine) during the playback or recording of another Sequence. In most cases, this is during recording with Take Recorder (-> take-recorder-in-unreal-engine).

### Create and Populate Playlist

Click the **Add (+) Item** button to start adding Sequences to your playlist.

 [image: create playlist item]

Next, assign a Sequence to the item by clicking the **dropdown menu** and selecting a **Sequence**.

 [image: assign sequence to item]

Continue to add and assign Sequences to your Playlist until you are satisfied with your list.

 [image: populate playlist with items]

### Trigger Playlist Playback

To trigger the playback of your entire playlist, click **Play All**. This will open a new pending Sequence, if one was not open already, and play all Sequences indefinitely until you stop the playback. Playlist Subsequences will be stored in a folder called **Playlist - (Your Playlist Name)**.

 [image: trigger playlist playback]

The most typical use-case for Playlists will be triggering them during a **Take Recorder** session. During recording, you can trigger your sequences to play at different times by clicking on each Sequence's playback controls. Sequences can be started, stopped, and reset multiple times during the recording and playback process.

 [image: trigger during take recorder session]

You can also enable **Play Mode**, which will enable a more streamlined overlay for your items, making it easier to select Play and Stop for each Sequence.

 [image: play mode easier selection]

### Saving and Managing Playlists

You can save Sequence Playlists by either clicking **Save**, or by opening the Save **dropdown menu** to clicking **Save Playlist As**. Saved playlists are stored in the **Content Browser** as **SequencerPlaylist Assets**.

 [image: save playlist]

Clicking **Load **will display a list of all playlists in your project. Selecting one will load it as the current playlist.

 [image: load playlist]

You can clear your current playlist and start over by clicking **Create New Playlist**.

 [image: create new playlist]

- sequencer
- playlist

On this page

- Prerequisites (-> sequencer-playlists-in-unreal-engine)
- Overview (-> sequencer-playlists-in-unreal-engine)
- Workflow Example (-> sequencer-playlists-in-unreal-engine)
- Create and Populate Playlist (-> sequencer-playlists-in-unreal-engine)
- Trigger Playlist Playback (-> sequencer-playlists-in-unreal-engine)
- Saving and Managing Playlists (-> sequencer-playlists-in-unreal-engine)

# Tracks

https://dev.epicgames.com/documentation/en-us/unreal-engine/sequencer-track-list-in-unreal-engine?application_version=5.9

> Create tracks that affect your actors in Sequencer.

[image: Tracks]

In Sequencer, Actor properties and other elements are accessed by the adding of tracks to your timeline. Depending on the track's type, they can be used to organize your tracks, create keyframes, or enable other auxiliary functions.

#### Prerequisites

- You have an understanding of Sequencer (-> how-to-make-movies-in-unreal-engine) and its Interface (-> sequencer-cinematic-toolbar-in-unreal-engine).

## Track List

Below is a list of the main tracks you can add in Sequencer.

- [image: Object Binding Track] Object Binding TrackThe Object Binding Track is a track that binds Actors and Objects to Sequencer and provides controls to manipulate their specialized properties or components. (-> cinematic-actor-tracks-in-unreal-engine)
- [image: Animation Track] Animation TrackThe Animation Track enables the adding of Animation Sequences to your Skeletal Mesh track. (-> cinematic-animation-track-in-unreal-engine)
- [image: Audio Track] Audio TrackAn overview of the animation blending tools for non-linear animation. (-> cinematic-audio-track-in-unreal-engine)
- [image: Event Track] Event TrackEvent Tracks support the creation of custom events that are scripted in a dedicated Sequencer Blueprint layer. (-> cinematic-event-track-in-unreal-engine)
- [image: Geometry Cache Track] Geometry Cache TrackThe Geometry Cache Track enables the scrubbing and playback of cloth and other Alembic mesh simulations on Static Meshes. (-> cinematic-geometry-cache-track-in-unreal-engine)
- [image: Fade Track] Fade TrackThe Fade Track in Sequencer is used to fade the entire screen to a solid color. With it, you can fade to black, white, or any other color. (-> cinematic-color-fade-track-in-unreal-engine)
- [image: Level Visibility Track] Level Visibility TrackSet the contents of Levels to be visible or hidden with the Level Visibility track. (-> cinematic-level-visibility-track-in-unreal-engine)
- [image: Material Tracks] Material TracksAnimate Materials in Sequencer in various ways using Material Tracks with different features. (-> animate-materials-in-unreal-engine-cinematic)
- [image: Time Dilation Track] Time Dilation TrackSpeed up or slow down your Cinematics with the Time Dilation Track. (-> cinematic-playback-rate-in-unreal-engine)
- [image: Subsequences Track] Subsequences TrackOrganize and enable multiple artists to work in the same sequence by using the Subsequences Track. (-> cinematic-subscequences-track-in-unreal-engine)
- [image: Media Track] Media TrackThe Media Track provides controls for the playback of movies and images from Sequencer using Unreal Engine's Media Framework features. (-> cinematic-movie-media-track-in-unreal-engine)
- [image: Camera Cut Track] Camera Cut TrackThe Camera Cut Track controls which Cine Camera Actor is currently active during playback in Sequencer. (-> cinematic-camera-cut-track-in-unreal-engine)
- [image: Folder Track] Folder TrackFolder Tracks allow for the organization of your tracks within Sequencer's Outliner. (-> organize-cinematic-tracks-in-unreal-engine)
- [image: Transform and Property Tracks] Transform and Property TracksSequencer's Property Tracks are used to animate an Actor's common variables or properties such as transform, floats, or color. (-> cinematic-transform-and-property-tracks-in-unreal-engine)
- [image: Console Variable Track] Console Variable TrackAdjust render settings and other console variables in your real-time cinematic using the Console Variable Track (-> cinematic-console-variable-track-in-unreal-engine)
- [image: Customizable Sequencer Track] Customizable Sequencer TrackCreate your own tracks for use in Sequencer using Blueprints and the Customizable Sequencer Track feature. (-> customizable-sequencer-track-in-unreal-engine)

## Adding Tracks

Sequencer provides a variety of ways to add tracks to your timeline.

Clicking **Add Track (+)** in Sequencer's Outliner reveals the list of tracks to add to your sequence. Select any track here to add it to Sequencer.

[image: sequencer track list]

Right-clicking in the empty region of the outliner will also bring up the track list.

[image: sequencer track list]

### Adding Actors

One of the most common track Sequencer uses is the Object Binding Track (-> cinematic-actor-tracks-in-unreal-engine). These are tracks that bind to **Skeletal Meshes**, **Static Meshes**, **Effects**, **Blueprints**, **Components** and other objects in a Level.

You can add Actors to your sequence by navigating in the **Add Track (+)** menu to the **Actor To Sequencer** submenu. Here you can choose any Actor currently in your Level to add to your sequence, or you can also search for a specific Actor using the search bar.

[image: actor to sequencer]

If an Actor is already selected in your Level, then it will be listed at the top of the **Actor To Sequencer** list for convenience.

You can also drag Actors from other windows, like the and add them into Sequencer.

[image: actor to sequencer drag drop]

Actors can also be added as Spawnables by dragging them from the Content Browser (-> content-browser-in-unreal-engine) or Place Actors (-> placing-actors-in-unreal-engine) panels.

[image: actor to sequencer content browser place actor]

### Adding Components

Some tracks allow for components and other track types to be added under their main header track. This is done to access specific track functionality, such as transform, components, properties, and other similar features.

To add a component track, hover over the track and click **Add Track (+)** to view a list of tracks available for the selected track. Typically, this list will be filtered based on the types of tracks and components that track or Actor can support.

[image: add child track]

As you can with most menus in Unreal Engine, you can type to filter the results in the **Add Track (+)** menu, making it easier to locate a specific property, component, or other track to add.

[image: type to filter tracks]

## Organization

Most tracks have properties that allow for them to be edited and displayed in different ways. These properties are saved in Sequencer and can be shared with others working on your project.

### Renaming

To assist in organization, all top-level tracks and components can be renamed in Sequencer. You can rename a track by triple-clicking on the track text, or right-clicking and selecting **Rename**, or by pressing **F2**.

[image: rename track]

When renaming a track bound to an Actor in the Level, the Actor in the level also renames.

[image: rename track renames actor]

Most, but not all tracks can be renamed. Typically, you cannot rename a track if it is a property. However, some property tracks can be renamed, such as Transform.

[image: rename track restrict]

Tracks in Green can be renamed, tracks in Red cannot.

### Lock

Tracks can be locked to prevent keyframes on them and their subtracks from being edited. Right-click a track and select **Locked** to lock that track. When a track is locked, all keyable tracks under it will display with a red border denoting the lock state.

[image: lock track]

### Pin

You can **Pin **tracks so that they will appear in a separate outliner section at the top of your Sequencer outliner. Right-click a track and select **Pinned **to pin that track.

[image: pin track]

Only one track can be pinned within each sequence.

### Mute

Muting tracks causes them to become inactive and to not display any of their properties or keyframe results from Sequencer. Right-click a track and select **Mute **to mute that track.

[image: mute track]

If the **Object Binding Track (-> cinematic-actor-tracks-in-unreal-engine)** is muted, it will also hide the Actor in the viewport.

### Solo

When you **Solo** a track, all other tracks will be muted, allowing for the soloed track to be viewed in isolation. Right-click a track and select **Solo **to solo that track.

[image: solo track]

Soloing and muting are editor-only operations and do not impact the Level at runtime, unless you are previewing through **Play In Editor**.

### Reordering

Tracks can be reordered in the outliner by dragging them above or below each other. Visual cues appear when dragging to indicate where the track will be placed.

[image: reorder tracks]

## Search and Filter

You can search and filter for specific track names using Sequencer's search field. Typing the full or partial name of a track will filter out tracks that do not match that name and will include child tracks as part of its search.

[image: search track]

Clicking the **Filters **button will also reveal a list of common track types that you can filter for.

[image: filter track]

When a filter is applied, the **Filter** button will indicate with a red dot.

[image: filter indication]

## Adding Conditions

Adding a condition to a track creates custom logic that controls the active state of the track during playback. For example, you can use conditions to deactivate a track on certain platforms, or to deactivate a track when it's outside of the view distance.

To add a condition to a track, right-click the track, go to** Edit Track**, and select a condition from the **Condition** dropdown.

[image: The Condition dropdown]

You can either pick an existing condition class, or create a custom condition class. The existing condition classes include the following:

- **Group Condition**: Set multiple conditions using logic gates.
- **Platform Condition**: Set whether the section is active on different platforms.
- **Scalability Condition**: Set whether the section is active on different scalability levels, based on the engine scalability settings.

Every condition has the following options:

- **Editor Force True**: A checkbox that forces the condition to always be true while playing in the editor. In play outside of the editor, the checkbox status is ignored.
- **Invert**: A checkbox that will invert the condition result behavior. For example, if the condition returns false, then the active state is set to true.

You can also create a custom condition class, either in the level sequence Director Blueprint or a custom Blueprint. Both options can be found in the Condition dropdown:

- To create a custom condition in the Director Blueprint, click **Director Blueprint Condition** > **Create New Condition Endpoint**.
- To create a custom condition Blueprint class, click **Condition Class** > **Create new Condition Blueprint Class**.

Sections that have conditions have a condition icon on the left side of the section row.

[image: The condition icon on the left side of the section row]

By default, conditions work for sections that have been converted to ECS.

#### Creating a Custom Condition

When the user creates a custom condition in the Director Blueprint, it creates a new function named **Evaluate Condition**. For Blueprint asset conditionals, it will create a function override for **On Evaluate Condition**.

[image: The On Evaluate Condition node and the Return Node in the Blueprint editor]

On the **On Evaluate Condition** node, the** Condition Context** pin has a struct that breaks out into the following pins:

- **World Context**: The world context object instance where the condition is being evaluated.
- **Binding**: The binding where this condition exists.
- **Bound Objects**: An array of the objects bound by the binding.

[image: The World Context, Binding, and Bound Object pins under Condition Context]

To pass the result, pass the **Return Value** bool to the **Return Node**. Here are some examples:

[image: The example condition described in the caption] This condition checks whether the binding is a static mesh actor and whether the static mesh is a cube.

[image: The example condition described in the caption] This condition checks the current game instance to see whether the player is hurt.

Custom Director Blueprint conditions have the following settings:

- **Scope**: Sets where the condition should get its result based on the world, on the binding, or on the owner object.[image: The options under Scope (Global, Binding, Owner Object)]

- Check Frequency: Sets whether the condition should be checked once, or on every tick.[image: The options under Check Frequency (Once, On Tick)]

Blueprint conditions don't have these settings by default, but they can access these settings using function overrides.

[image: The function overrides for Get Check Frequency and Get Scope]

- sequencer
- tracks

On this page

- Prerequisites (-> sequencer-track-list-in-unreal-engine)
- Track List (-> sequencer-track-list-in-unreal-engine)
- Adding Tracks (-> sequencer-track-list-in-unreal-engine)
- Adding Actors (-> sequencer-track-list-in-unreal-engine)
- Adding Components (-> sequencer-track-list-in-unreal-engine)
- Organization (-> sequencer-track-list-in-unreal-engine)
- Renaming (-> sequencer-track-list-in-unreal-engine)
- Lock (-> sequencer-track-list-in-unreal-engine)
- Pin (-> sequencer-track-list-in-unreal-engine)
- Mute (-> sequencer-track-list-in-unreal-engine)
- Solo (-> sequencer-track-list-in-unreal-engine)
- Reordering (-> sequencer-track-list-in-unreal-engine)
- Search and Filter (-> sequencer-track-list-in-unreal-engine)
- Adding Conditions (-> sequencer-track-list-in-unreal-engine)
- Creating a Custom Condition (-> sequencer-track-list-in-unreal-engine)

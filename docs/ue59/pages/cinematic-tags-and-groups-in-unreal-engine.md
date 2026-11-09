# Sequencer Tags and Groups

https://dev.epicgames.com/documentation/en-us/unreal-engine/cinematic-tags-and-groups-in-unreal-engine?application_version=5.9

> Reference your Sequencer Actors using Tags for Blueprint scripting, and organize your tracks with Groups.

[image: Sequencer Tags and Groups]

Sequencer provides the ability to tag tracks with metadata in order to support additional functions and behavior. Actors can have **Tags **assigned to them, and those tags can be referenced in Blueprints, which enables referencing Actors and tracks more generically. Tracks can also be placed into **Groups**, in order to manage their display and selection.

This page provides an overview of the Tags and Groups features in Sequencer.

#### Prerequisites

- You have an understanding of **Sequencer (-> how-to-make-movies-in-unreal-engine)**, its **Interface**, and how to add ****.

- You have an understanding of **Blueprints Visual Scripting (-> blueprints-visual-scripting-in-unreal-engine)**.

## Tags

Tags are metadata markers that you can assign to the **Object Binding Track (-> cinematic-actor-tracks-in-unreal-engine)** in Sequencer, and can be referenced by tag-based Blueprint nodes.

 [image: sequencer tag blueprint]

The quickest way to add a tag to a track is by right-clicking it, navigating to the **Tags** menu, and typing a name in the **Add Tag** field. Once done you can either press **Enter **or the **Add (+)** button to create the tag.

 [image: create sequencer tag]

You can have more than one tag assigned to an Actor.
 [image: multiple tags]

Once a tag is assigned, the **Tags **context menu will now show the list of tags added to the track. They can be toggled on and off by clicking them.

 [image: enable disable tag menu]

### Binding Tag Manager

To view and manage your tags in Sequencer, you can open the Binding Tag Manager by clicking **Open Binding Tag Manager** in the Tags context menu. You can also open it from the toolbar's **Actions** (-> cinematic-tags-and-groups-in-unreal-engine) menu.

 [image: sequencer binding tag manager]

The Binding Tag Manager has two main areas:

 [image: binding tag manager]

- The first area contains a list of all object bindings in the sequence, including any subsequences. Tags assigned to Actors are displayed next to them, and can be unassigned by clicking **Delete (X) **on the tag. New tags can be added by right-clicking a binding, typing in a name, and pressing **Enter**. [image: tag manager create tag]

- The second area lists all existing tags for this sequence. Clicking **Delete (X) **will unassign it from all bindings.

### Referencing in Blueprints

Binding Tags can be accessed in Blueprints by calling one of the "by Tag" **Binding **functions from **Level Sequence Actors**. You can use these functions to get the current binding or bindings of Actors with tags, rebinding those Actors, or resetting bindings.

"By Tag" binding functions can be found by right-clicking in the Blueprints graph or by dragging off from a Level Sequence Actor reference and locating them within **Sequencer > Player > Bindings**.

 [image: binding by tag blueprints]

Most of the "by Tag" Blueprint functions have the following input pins:

 [image: add binding by tag]

- **Target**: The reference to the Level Sequence Actor.

- **Binding Tag**: The Tag name to look for.

- **Actor**: The Actor to bind, rebind, or add binding to.

- **Allow Bindings from Asset**: Disabling this will lock the sequence from further binding actions.

## Groups

Tracks in Sequencer can be added into groups, which aid in quick selection and display filtering.

To create new groups and add tracks to them, right-click a single track or multiple tracks, and select **Add to Group > New Group**. This will open the **Sequencer Group Manager** and create the new group and add the tracks to it.

 [image: sequencer add to group new group]

With a new group created, new tracks can also be added to that group from the **Add to Group** context menu.

 [image: add to group]

You can also drag tracks from Sequencer's outliner into the Sequencer Group Manager to add tracks to groups.

 [image: add group drag and drop]

### Group Manager

The Sequencer Group Manager is where you manage your groups and tracks that are assigned to them. If you are not creating a new group, you can open it by clicking **Open Sequencer Group Manager** in the toolbar's **Actions** (-> cinematic-tags-and-groups-in-unreal-engine) menu.

 [image: open sequencer group manager]

#### Management

Right-clicking in the Group Manager window will show the context menu, where you can create new groups, rename your group, delete groups, or **Filter Groups** (-> cinematic-tags-and-groups-in-unreal-engine).

 [image: group manager context menu]

#### Selection

You can quickly select the contents of a group by clicking the group header, or by clicking each group item individually.

 [image: sequencer group selecting]

#### Filtering

Clicking the **Filter **icon will filter all tracks out in the Sequencer outliner except for the tracks (and their children).

 [image: sequencer group track filter]

Clicking the **Filters **menu in Sequencer's outliner will also display controls for enabling **Group Filters**.

 [image: sequencer group track filter]

- sequencer
- tag
- group

On this page

- Prerequisites (-> cinematic-tags-and-groups-in-unreal-engine)
- Tags (-> cinematic-tags-and-groups-in-unreal-engine)
- Binding Tag Manager (-> cinematic-tags-and-groups-in-unreal-engine)
- Referencing in Blueprints (-> cinematic-tags-and-groups-in-unreal-engine)
- Groups (-> cinematic-tags-and-groups-in-unreal-engine)
- Group Manager (-> cinematic-tags-and-groups-in-unreal-engine)
- Management (-> cinematic-tags-and-groups-in-unreal-engine)
- Selection (-> cinematic-tags-and-groups-in-unreal-engine)
- Filtering (-> cinematic-tags-and-groups-in-unreal-engine)

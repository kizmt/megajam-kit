# Customizable Sequencer Track

https://dev.epicgames.com/documentation/en-us/unreal-engine/customizable-sequencer-track-in-unreal-engine?application_version=5.9

> Create your own tracks for use in Sequencer using Blueprints and the Customizable Sequencer Track feature.

[image: Customizable Sequencer Track]

Learn to use this **Beta** feature, but use caution when shipping with it.

Using Blueprints and child classes, you can create your own customizable Sequencer tracks. This feature can be used to extend Sequencer track functionality without using C++. It can be useful for prototyping or implementing new tracks you may need on your project.

This document provides an overview of the Custom Sequencer Track feature, how to create new track types, and the various functions used to communicate with common Sequencer objects.

#### Prerequisites

- The Customizable Sequencer Track feature is a Plugin (-> working-with-plugins-in-unreal-engine) that must be enabled prior to use. From Unreal Engine's main menu, go to **Edit > Plugins**, locate **Customizable Sequencer Tracks** in the **Runtime **section, and click the checkbox to enable it. Then, restart Unreal Engine. [image: customizable sequencer tracks plugin]

- You should be familiar with creating and using Blueprints (-> blueprints-visual-scripting-in-unreal-engine).

## Create New Track

New custom Sequencer tracks require creating three different Blueprint classes that are inherited from:

- `SequencerSectionBP`

- `SequencerTrackBP`

- `SequencerTrackInstanceBP`

To do this, in the **Content Browser**, click **Add (+) > Blueprint Class**, then navigate in the **All Classes** section to these three classes. Create a new child Blueprint class for each one.

 [image: create track classes]

Next, you must associate the different classes so they communicate. To do this, open the new Blueprint that inherits from `SequencerTrackBP` and set the following properties in the **Class Defaults** section of the **Details** panel:

- Set **Default Section Type** to the new Blueprint that inherits from `SequencerSectionBP`.

- Set **Track Instance Type** to the new Blueprint that inherits from `SequencerTrackInstanceBP`.

 [image: set track properties]

After you compile and save the Blueprint, you can now add the track as a master track from Sequencer's main **Add Track (+)** menu.

 [image: add custom track to sequencer]

## Creating Track Logic

Although you can now create your new track in Sequencer, its sections have no logic, so nothing will happen when you create the track. To start making logic for your track, open the new Blueprint that inherits from `SequencerTrackInstanceBP`. In the Functions section, you can override Events to add them to the Event Graph, where you can create Blueprint logic.

 [image: override functions]

### Section Events

The following section events can be overridden in the `SequencerTrackInstanceBP` Event Graph.

| Name | Image | Description |
| --- | --- | --- |
| **OnBeginUpdateInputs** |  | This event executes when a section is about to begin or end. It executes first, but after **OnInitialize**. |
| **OnEndUpdateInputs** |  | This event executes when a section has finished beginning or ending. It executes after **OnBeginUpdateInputs** and **OnInputAdded/Removed**. |
| **OnDestroyed** |  | This event executes when a section is ending and there are no other sections playing. It executes last. |
| **OnInitialize** |  | This event executes when a section is starting and there are no other sections playing. It executes first. |
| **OnInputAdded** |  | This event executes when a section is starting. It executes after **OnBeginUpdateInputs**. |
| **OnInputRemoved** |  | This event executes when a section is ending. It executes after **OnBeginUpdateInputs**. |
| **OnUpdate** |  | This event executes continuously every frame as long as any section is active. When first initializing a section, it starts executing after **OnEndUpdateInputs**. |

As an example, this image shows the total execution order of all singular events in a multi-section scenario:

 [image: execution order]

Custom Sequencer Tracks only use sections (-> creating-animation-keyframes-in-unreal-engine), and not keyframes.

### Section Functions

When building logic in the `SequencerTrackInstanceBP` child Blueprint, you can use the following functions to get section or owning object information:

| Name | Image | Description |
| --- | --- | --- |
| Get Animated Object |  | Gets the object or Actor that this track is a child of, if Track Type (-> customizable-sequencer-track-in-unreal-engine) is set to **Object Track**. This function should be paired with a **Cast** function to get a usable Blueprint reference of the returned object. |
| Get Input |  | Gets the currently playing section according to the index (if more than one section is playing). The default return pin is a struct that must be broken to access the actual section object. You can break it either with **Break SequencerTrackInstanceInput**, or by right-clicking the pin and selecting **Split Struct Pin**. |
| Get Inputs |  | Returns an array of currently playing sections. |
| Get Num Inputs |  | Gets the number of currently playing sections. |

## Overview of Classes

This section contains information about the three main Blueprint classes that make up the custom track as well as their properties.

### SequencerSectionBP

SequencerSectionBP is a transient class that is constructed at runtime. You can also use it to set default section properties, which can be overwritten on the section properties in Sequencer. To access and change these properties, navigate to the **Class Defaults** section in the **Details** panel.

 [image: sequencer section class properties]

| Name | Description |
| --- | --- |
| **Timecode Source** | The default timecode information for the section, if timecode is being used. You can also specify delta frames here to control offset information. |
| **Is Active** | Sets whether or not the section is active by default |
| **Is Locked** | Sets whether or not the section is locked by default. |
| **Pre / Post Roll Frames** | Specifies extra padding to apply to the start and end regions of the section by default, which causes the first and last frame of the section to be held for the specified duration |

### SequencerTrackBP

This class is used to set general properties and rules for the track, such as name, type, and supported sections. To access and change these properties, navigate to the **Class Defaults** section of the **Details** panel.

 [image: sequencer track properties]

| Name | Description |
| --- | --- |
| **Supports Multiple Rows** | If enabled, this allows for the track to encompass multiple sub-tracks (rows). This can be useful if you intend to layer data using this track. |
| **Supports Blending** | Enabling this will allow the sections to blend between each other. |
| **Track Type** | Sets in what context this track can be added and exist in Sequencer. You can select either: **Master Track**, which adds the track to the main Add Track (+) menu in Sequencer. This makes the track a top-level Sequencer track. **Object Track**, which adds the track to another track's Add (+) menu. The parent track is dependent on the object class defined in **Supported Object Type**. |
| **Supported Object Type** | If **Track Type** is set to **Object Track**, this property is used to specify which object type this track can be added under. |
| **Default Section Type** | Specifies the inherited base `SequencerSectionBP` class created as part of the required track setup. |
| **Supported Sections** | An array where you can add additional `SequencerSectionBP` classes to add from the track's **Add Section (+)** menu. You can use the various **Get Input** functions when creating your logic to differentiate these sections. |
| **Track Instance Type** | Specifies the inherited `SequencerTrackInstanceBP` class created as part of the required track setup. |
| **Icon** | Displays a preview of the track's icon. Expanding this property reveals the following icon properties: **Image**: The texture or material to use as the icon image. **Image Size**: The size and X/Y dimensions of the image. **Tint**: The color of the image. Enabling **Inherit** will disable any color tinting and instead use the parent widget color. **Draw As**: You can select different methods to draw the icon: **Box**, **Border**, **Image**, or **Rounded Box**. **Tiling**: Enables tiling the image in **horizontal**, **vertical**, or **both** directions. **Preview**: An area to preview the final look and size of your icon. |
| **Display Name** | The default name for the track. This can be overwritten in Sequencer through normal track renaming operations. |
| **Track Row Display Names** | An array where you can specify row names if **Supports Multiple Rows** is enabled. If more than one array element is added, then adding section rows will add all named rows at once. |
| **Color** | Sets the default color for the track and its sections. You must ensure that the color's alpha value is not 0, otherwise the transparency will fall through to the default gray color. |
| **Show Vertical Frames** | If enabled, this will cause section start and end bounds to display vertical lines in the timeline. |

### SequencerTrackInstanceBP

This class is used to create the primary logic and behavior of the track within the **Event Graph** by overriding events (-> customizable-sequencer-track-in-unreal-engine) and creating functions (-> customizable-sequencer-track-in-unreal-engine).

 [image: track instance class]

- animation
- beta
- sequencer

On this page

- Prerequisites (-> customizable-sequencer-track-in-unreal-engine)
- Create New Track (-> customizable-sequencer-track-in-unreal-engine)
- Creating Track Logic (-> customizable-sequencer-track-in-unreal-engine)
- Section Events (-> customizable-sequencer-track-in-unreal-engine)
- Section Functions (-> customizable-sequencer-track-in-unreal-engine)
- Overview of Classes (-> customizable-sequencer-track-in-unreal-engine)
- SequencerSectionBP (-> customizable-sequencer-track-in-unreal-engine)
- SequencerTrackBP (-> customizable-sequencer-track-in-unreal-engine)
- SequencerTrackInstanceBP (-> customizable-sequencer-track-in-unreal-engine)

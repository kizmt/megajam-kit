# Using the Unreal Stage Outliner

https://dev.epicgames.com/documentation/en-us/unreal-engine/using-the-unreal-stage-outliner-in-unreal-engine?application_version=5.9

> The Unreal Stage Outliner will show any actors in the scene and provides some handy tools, including filtering, visibility, and multi-select, as well as some utility tools, including duplicating or deleting selected actors.

[image: Using the Unreal Stage Outliner]

Learn to use this **Experimental** feature, but use caution when shipping with it.

## The Outliner

The Outliner can optionally be displayed at any time and will list out all of the ICVFX content within the scene and show anything that is currently selected.

## Outliner Tools

The Outliner menu bar offers the following tools for managing ICVFX content.

### Filtering

As with the Outliner in desktop Unreal Engine, the list of content can be filtered by type to more easily find a desired actor, especially in larger and more complex scenes.

There is also a 'search by' to find content by name.

### Visibility

The visibility button in Unreal Stage toggles the Actor Hidden in Game property, which will hide the selected content from view. Hidden content will no longer be visible in nDisplay on the LED volume, but it is still available for further manipulation (such as making adjustments without disrupting other work on-stage, or finding it to make it visible again) through the Editor and in-app. Hidden content will display as italicized in the Outliner to distinguish it from content that is visible.

### Multi-Select

Multi-selection mode can be toggled on and off via the Outliner. When on, selecting content will add it to the selection to create a selection set instead of changing the selection from one actor to another.

If multi-selecting content with different visibility states (ex. one visible, one hidden), Unreal Stage will treat the selection as visible. This means that tapping the visibility button will hide all selected actors on the LED Volume.

### Ellipsis Menu

- Additional utility operations can be found in the ellipsis menu:

- Focus Selected

- The Editor Preview will be zoomed and panned to focus on the selected actor.

- Duplicate Selected

- Delete Selected

- Rename Selected

### Swipe Operations

Actors in the Outliner can also be swiped left and right for quicker and easier access to key operations:

- Swipe Right

- Toggle Visibility

- Swipe Left

- Delete Selected

- getting started
- experimental
- virtual production
- ndisplay
- icvfx
- virtual sets
- bronze

On this page

- The Outliner (-> using-the-unreal-stage-outliner-in-unreal-engine)
- Outliner Tools (-> using-the-unreal-stage-outliner-in-unreal-engine)
- Filtering (-> using-the-unreal-stage-outliner-in-unreal-engine)
- Visibility (-> using-the-unreal-stage-outliner-in-unreal-engine)
- Multi-Select (-> using-the-unreal-stage-outliner-in-unreal-engine)
- Ellipsis Menu (-> using-the-unreal-stage-outliner-in-unreal-engine)
- Swipe Operations (-> using-the-unreal-stage-outliner-in-unreal-engine)

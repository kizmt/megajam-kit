# Light Mixer

https://dev.epicgames.com/documentation/en-us/unreal-engine/using-the-light-mixer-in-unreal-engine?application_version=5.9

> Editor window that displays all lights in the scene in a compact tabular format for rapid inspection and editing.

The **Light Mixer** provides a dedicated interface tailored to the creative requirements for lighting. Artists can isolate lights, change their visibility, and have relevant settings readily available to achieve a desired look. Lights can also be grouped into collections for quicker access to groups of lights.

The Light Mixer focuses on management of standard Light Types and is complementary to the Environment Light Mixer, which focuses on environment lighting components, such as sky, clouds, atmosphere lights, and skylight.

The Light Mixer panel displays all the lights that exist in the currently loaded Level and its sub-levels. It even shows lights that are components of existing scene Actors or inside Blueprints. You can specify which light parameters you want to display in the panel and change their values directly within this panel.

[image: Light Mixer Panel]

## Light Mixer Interface

Open the Light Mixer from the Editor main menu by selecting **Window > Light Mixer**.

The **Light Mixer** interface consists of these elements:

[image: Light Mixer Interface]

- Toolbar (-> using-the-light-mixer-in-unreal-engine)
- Light Mixer Panel (-> using-the-light-mixer-in-unreal-engine)

### Toolbar

The **Toolbar** is where you can add different types of lights to the scene, and to the list of lights in this component panel.

[image: Light Mixer Toolbar]

You can do the following from the Toolbar:

- Add Lights to the scene.
- Filter Lights using the Search bar.
- Sync the Lights in the Level with Light Mixer.
- Toggle Light Mixer options.
- Manage Light Collections.

### Sync Selection

The **Sync Selection** toggle synchronizes the Light selection in the Light Mixer to the Outliner selection.

[image: Light Mixer Toolbar Sync Selection button]

If enabled, clicking items in the Light Mixer list also selects the same items in the Outliner.

You can use **Alt + Click** to select items only in the Light Mixer list without selecting them in the Outliner.

If this option is disabled, selections will not synchronize unless you hold down the **Alt** key while clicking lights in the Light Mixer.

### Settings Menu

The Light Mixer **Settings** menu contains options to configure the list view, as well as a command to force the list of scene lights to rebuild.

[image: Light Mixer Panel toolbar setting menu]

The **Settings** menu contains the following options:

[image: Light Mixer settings dropdown menu options.]

- **List View Options** to toggle whether folders are visible or not in the Light Mixer panel.
- **Open Generic Object Mixer Instance** opens a blank panel for development purposes. This underlying toolset is used to make panels similar to the Light Mixer and Environment Light Mixer panels composed of different objects that can be edited in a singular place.
- **Rebuild List** forces the Light Mixer panel to re-evaluate the entire scene for lights and updates to lights if the list doesn't update as expected. This is like a hard refresh of the Light Mixer.

## Managing Lights

The **Light Mixer** panel is where you can manage and edit Lights in your scene.

### Filtering Lights

Use the **Search Filter** at the top of the Light Mixer panel to filter lights or objects by name.

[image: Light Mixer Search Filter]

For large scenes with many lights, filtering lights with search can speed up workflows.

### Selecting Multiple Lights

You can select one or more Lights using the following keyboard shortcuts:

- Individually select Lights by holding **Ctrl** and clicking them.
- Select groups of Lights by clicking one, then holding **Shift** and selecting another light in the list. Any objects between the first clicked and last clicked will be selected as a group.

You can deselect individual Lights or groups of Lights in the same manner.

### Editing Multiple Lights

By selecting multiple Lights at once, you can change the values of their shared attributes from within the Light Mixer panel without having to update each Light individually. Editing multiple Lights' attributes simultaneously can speed up your workflow for lighting and editing scenes. This includes being able to isolate lights and change light visibility to work on areas of your Level.

### Light Visibility

Toggling the visibility (or muting) Lights will turn them off and on in a non-destructive way. Click the **Eye** icon to toggle the visibility of the selected Light or Lights.

### Isolating Lights

There is an option to isolate (or **Solo**) any selected Light(s) so that only they are visible. This way, you can quickly see the lighting influences from one or more lights in the scene in a non-destructive way. Lights can be isolated individually or as a group when the parent object or folder is isolated.

Click the **Dash ( - )** icon under the **Headphones** column to toggle the **Visibility** flag of all unselected Lights in the scene. When a Light is set to Solo, the dash is replaced by the Headphones icon. Clicking the **Headphones** icon next to a light that is set to **Solo** will re-enable visibility of all other lights in the scene.

### Adding Lights

Use the **Add** button to add directional, spot, point, or rectangular area lights to the scene, which you can then click and drag into place.

[image: Light Mixer toolbar Add lights dropdown selection.]

Alternatively, you can drag any one of the light types directly from the menu into the scene to place it.

## Light Context Menu

The right-click **Context Menu** looks and works similarly to the one used in the Outliner.

[image: Light Mixer panel component context menu.]

One additional option provided by the Context Menu is to **Select or Add Collection**, which you can read about in the Light Collections (-> using-the-light-mixer-in-unreal-engine) section below.

### Edit Options

Use the **Edit** menu to **Cut**, **Copy**, **Paste**, **Duplicate**, **Delete**, and **Rename** lights. Alternatively, you can either use keyboard shortcuts (like Ctrl+X, Ctrl+V, and so on) in place of the menu options.

### Replacing Lights

Use the **Replace Selected Actors With** option to replace a selected Light with another Light. You can even replace them with other Actors in the list that are not lights. All Actors in the list must have at least one light as a child component.

### Reparenting Lights

There are two ways to reparent one or more lights:

- **Drag and Drop Method**Select the Lights you want to reparent and drag them over the listed object you want them to be parented to.

- **Attach to Method**Select the Lights you want to re-parent.
- Right-click the selected Lights and, from the context menu, select **Attach To**.
- Select an Actor from the list you want to reparent the Lights to.

## Light Collections

Collections (-> filters-and-collections-in-unreal-engine) serve as a way to organize Assets into groups into non-destructive user-defined sets. In the Light Mixer panel, you can use this same workflow to make a collection of lights to speed up lighting workflows by organizing and isolating lights that you frequently change for easier access.

All the lights in the scene automatically belong to a default light collection called **All**. This particular collection category doesn't appear until another collection is created.

### Creating a Light Collection

Create Light Collections using the right-click **Context Menu** in the Light Mixer panel.

- Select one or more lights in the **Light Mixer** panel.
- Right-click the selected lights to open the **Context Menu**.
- Click **Select or Add Collection**.
- In the text field, give the collection a **Name** and press **Enter** to confirm.

The newly created Light Collection will be listed between the Search Filter and Light Mixer Panel columns. There is no limit to the number of Light Collections you can create to help manage your scene.

[image: Light Mixer Light Collections]

### Viewing a Light Collection

You can view a Light Collection by clicking its name in the **Collections** bar under the Search. Clicking a collection shows only the Lights and components belonging to that collection. The **All** collection restores all the lights to the Light Mixer panel.

### Adding Lights to a Light Collection

Add lights to Light Collections using the right-click **Context Menu**. The workflow is the same as creating a collection, except that you can choose from a list of existing Light Collections to add a light to instead of creating a new collection.

From the **Context Menu** next to **Select or Add Collection**, under the text field, find an existing Light Collection from the list to add the Lights to, and check the box next to the Collection to add the Lights to it.

Lights are not exclusive to a single Light Collection. You can have as many collections as you need and the same Lights can belong to any of them.

### Removing Lights from a Light Collection

Remove lights from Light Collections using the right-click **Context Menu**. The workflow is the same as creating a collection, except that you are changing the selection of collections the Light belongs to.

In the **Context Menu** next to **Select or Add Collection**, under the text field, uncheck any Light Collections to remove the selected Lights from those collections.

### Deleting, Duplicating, and Renaming Light Collections

Right-click the tab of any Light Collection to **Delete**, **Duplicate**, or **Rename** that collection.

[image: Light Mixer light collection right-click options to delete, duplicate, and rename.]

The **All** Light Collection is the only one that cannot be deleted, duplicated, or renamed. Right-clicking it will not expose these options.

### Reordering Light Collections

Reorder Light Collections by left-clicking and dragging them to a new position.

The **All** Light Collection is the only one that cannot be reordered.

## Customizing Light Mixer

The Light Mixer provides a customizable list of light attributes to display in the panel. You can add and remove light attributes to fit the needs of your workflow by exposing the most important light information and the options you need most frequently for editing.

[image: Light Mixer panel overflow menu to add user-editable light attribute columns.]

The light attributes available to choose from to add to the Light Mixer panel.

### Adding and Removing Light Attributes

The attributes columns list Light attributes for quick access without the need to go back and forth between the Details panel and Light Mixer panel.

You can add and remove light attributes by moving the mouse over any **Column** header and clicking the **Overflow Menu** icon (it looks like three vertical dots), which opens a list of user-editable Light attributes. You can perform these actions in the attributes list:

- **Add** a column for the selected attribute by enabling the checkbox next to the Light attribute.
- **Remove** a column for the selected attribute by disabling the checkbox next to a Light attribute that has an enabled checkbox.
- **Search** for a particular attribute by starting to type when the attribute list is open. A search filter will replace the menu and then only display results that match your search terms.

Currently, when you add any attribute columns to the Light Mixer panel, columns are added in the order in which they appear in the list. Column placement will be configurable in a future release.

## Lights as Components

The Light Mixer lists and displays Lights that are components of other Actors and Blueprints in the scene. You can edit the Lights contained within these other Actors and Blueprints like any other light in the scene, but you can't move or reparent them within the Light Mixer panel.

### Lights Contained Inside Other Actors

You can add Lights to scene Actors as components using Level's Details panel. These Lights will be listed as components in the Light Mixer Panel, along with their parent Actor.

[image: Scene Actor example with two Light Components being viewed in the Outliner and the Light Mixer.]

This is an Actor in the scene that has two Point Lights as components.

[image: Scene Actor with two Light Components viewed in the Level's Details panel.]

The Light Mixer recognizes that this Actor has two Lights as components and lists them in the Light Mixer panel, along with the Actor they are components of.

[image: Scene Actor with two Light Components viewed in the Light Mixer's list of lights as individual editable line entries.]

If the Actor only has a single Light as a component, it collapses into a single editable line.

[image: Scene Actor with a single Light Component viewed in the Light mixer's list of lights as a single editable line entry.]

### Lights Contained Inside Blueprints

Lights contained within a Blueprint Actor as a component are listed in the Light Mixer. You can also click the Blueprint to open it for editing directly in the Blueprint Editor.

[image: Blueprint Asset example with two Light Components being viewed in the Level's Details panel and the Light Mixer.]

This is a Blueprint that has two Point Lights as child components of a Static Mesh component.

[image: Blueprint Editor showing a component with two Light Components.]

When this Blueprint is added to a Level, the Light Mixer recognizes that it contains Lights as components and lists them in the Light Mixer panel.

[image: Blueprint with two Light Components viewed in the Light Mixer's list of lights as individual editable line entries.]

If the Blueprint only contains a single Light, it collapses into a single editable line.

[image: Blueprint with a single Light Component viewed in the Light mixer's list of lights as a single editable line entry.]

- rendering
- lighting

On this page

- Light Mixer Interface (-> using-the-light-mixer-in-unreal-engine)
- Toolbar (-> using-the-light-mixer-in-unreal-engine)
- Sync Selection (-> using-the-light-mixer-in-unreal-engine)
- Settings Menu (-> using-the-light-mixer-in-unreal-engine)
- Managing Lights (-> using-the-light-mixer-in-unreal-engine)
- Filtering Lights (-> using-the-light-mixer-in-unreal-engine)
- Selecting Multiple Lights (-> using-the-light-mixer-in-unreal-engine)
- Editing Multiple Lights (-> using-the-light-mixer-in-unreal-engine)
- Light Visibility (-> using-the-light-mixer-in-unreal-engine)
- Isolating Lights (-> using-the-light-mixer-in-unreal-engine)
- Adding Lights (-> using-the-light-mixer-in-unreal-engine)
- Light Context Menu (-> using-the-light-mixer-in-unreal-engine)
- Edit Options (-> using-the-light-mixer-in-unreal-engine)
- Replacing Lights (-> using-the-light-mixer-in-unreal-engine)
- Reparenting Lights (-> using-the-light-mixer-in-unreal-engine)
- Light Collections (-> using-the-light-mixer-in-unreal-engine)
- Creating a Light Collection (-> using-the-light-mixer-in-unreal-engine)
- Viewing a Light Collection (-> using-the-light-mixer-in-unreal-engine)
- Adding Lights to a Light Collection (-> using-the-light-mixer-in-unreal-engine)
- Removing Lights from a Light Collection (-> using-the-light-mixer-in-unreal-engine)
- Deleting, Duplicating, and Renaming Light Collections (-> using-the-light-mixer-in-unreal-engine)
- Reordering Light Collections (-> using-the-light-mixer-in-unreal-engine)
- Customizing Light Mixer (-> using-the-light-mixer-in-unreal-engine)
- Adding and Removing Light Attributes (-> using-the-light-mixer-in-unreal-engine)
- Lights as Components (-> using-the-light-mixer-in-unreal-engine)
- Lights Contained Inside Other Actors (-> using-the-light-mixer-in-unreal-engine)
- Lights Contained Inside Blueprints (-> using-the-light-mixer-in-unreal-engine)

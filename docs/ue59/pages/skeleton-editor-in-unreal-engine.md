# Skeleton Editor

https://dev.epicgames.com/documentation/en-us/unreal-engine/skeleton-editor-in-unreal-engine?application_version=5.9

> An in depth look at the Skeleton Editor mode in Unreal Engine.

[image: Skeleton Editor]

In Unreal Engine, Skeleton Assets (-> skeletons-in-unreal-engine) are the foundation for all animation work with **Skeletal Meshes**. The **Skeleton Editor Mode** is the visual editor where you can find the tools and properties to make changes to **Skeleton Assets**.

In this editor you can manipulate individual bones and bone structures, attach Skeletal Mesh Sockets (-> skeletal-mesh-sockets-in-unreal-engine), and preview any **Animation Curves** and **Animation Notifies** associated with your skeleton. The Skeleton Editor is also where you can find the **Retargeting Manager**, a tool for managing meshes associated with the current Skeleton Asset.

Below is the Skeleton Editor window with the following tools and Panels:

 [image: skeleton editor overview window]

- Toolbar (-> skeleton-editor-in-unreal-engine)

- Skeleton Tree / Retarget Sources (-> skeleton-editor-in-unreal-engine)

- Viewport (-> skeleton-editor-in-unreal-engine)

- Preview Scene Settings / Details (-> skeleton-editor-in-unreal-engine)

- Anim Curves / Animation Notifies (-> skeleton-editor-in-unreal-engine)

## Toolbar

The Toolbar found in the Skeletal Mesh Editor is similar to the **Toolbar** found across Unreal Engine's many editors and windows. For general Animation Editor functions refer to the Animation Editors Overview's Toolbar Section (-> animation-editors-in-unreal-engine) for more information. The following are features unique to the Skeletal Mesh Editor Mode.

 [image: skeleton editor toolbar]

| Name | Icon | Description |
| --- | --- | --- |
| **Anim Notifies** | [image: animation notifies animnotifies icon button] | Opens the Animation Notifies (-> skeleton-editor-in-unreal-engine) panel where you can manage the animation notifies associated with the skeleton. |
| **Retarget Sources** | [image: retarget sources icon button] | Will open the Retarget Sources (-> skeleton-editor-in-unreal-engine) panel where you can manage retarget sources and setups with the current skeleton asset. |
| **Import Mesh** | [image: import mesh icon button] | Imports a new mesh for this skeleton. |
| **Make Static Mesh** | [image: make static mesh icon button] | Makes a new static mesh out of the preview's current pose. |

## Skeleton Tree / Retarget Sources

This panel features the Skeleton Tree tab by default. After clicking Retarget Sources in the Toolbar, the Retarget Sources (-> skeleton-editor-in-unreal-engine) tab will also appear here.

### Skeleton Tree

Skeleton Tree tab displays the **Skeletal Hierarchy** of the current Skeleton Asset, which allows you to create and edit Skeleton Sockets (-> skeletal-mesh-sockets-in-unreal-engine) and define settings related to Animation Retargeting (-> skeleton-editor-in-unreal-engine).

 [image: skeleton tree window]

- Using the green **Plus** (**+**) button, assets and profiles can be added to your skeleton. Below you will find a list of the assets the Plus (+) button can create. | Name | Description |
| --- | --- |
| **Socket** | Sockets are offsets from bones that allow you to attach game objects to skeletons. |
| **Virtual Bone** | Virtual Bones are auxiliary bones that are children of a bone but constrained to another. |
| **Add Time Blend Profile** | A Time Blend Profile is a set of per-bone scales that can be used in transitions to tweak the weights of specific bones, relative to the transitions' blend time. |
| **Add Weight Blend Profile** | A Weight Blend Profile is a set of per-bone scales that can be used in transitions to tweak the weights of specific bones, relative to the transitions' blend weight. |
| **Add Blend Mask** | A Blend Mask is used to specify the alpha of individual bones when layering poses. (It is used by the Layered Blend Per Bone node and the Pose Watch.) |

- The **Gear** icon to the right of the Search Bar will open a menu providing settings and toggle filters you can use to alter Skeleton preview and skeleton tree behavior. Below you will find a description of each property and a description of its function. | Setting | Description |
| --- | --- |
| **Blend Profiles** | Select the Blend Profile you want to preview and edit with the current Skeleton Asset. The profile from the base Skeleton Asset will appear as a column in the Skeleton Tree tab displaying each bone's weight in the form of a slider. The Clear option at the bottom of the Blend Profiles header will clear the currently selected Blend Profile. [image: blend profiles window] |
| **Add Time Blend Profiles** | Add a new Time Blend Profile for this skeleton. |
| **Add Weight Blend Profiles** | Add a new Weight Blend Profile for this skeleton. |
| **Add Blend Mask** | Add a new Blend Mask to this skeleton. |
| **Show Retargeting Options** | Opens a new column in the Skeleton Tree showing each bone's **Bone Translation Retargeting** mode. The selectable options are: **Animation**: Displays translation data from the associated animation. **Skeleton**: Shows translations from the associated Skeleton. **Animation Scaled**: Shows translations from the associated animation, but scales the length by the current skeleton's proportions. **Animation Relative**: Uses relative translations from the associated animation similar to an additive animation. **Orient and Scale**: Orients and scales a uniform translation. |
| **Filtering Flattens Hierarchy** | A visual filter that determines whether to display the above hierarchy or flatten it when searching for tree items. |
| **Hide Parents When Filtering** | A visual filter that determines whether to show the parent items as grayed out, or hide them entirely. |
| **Show all Bones** | Shows all bones in the current skeleton. |
| **Show Mesh Bones** | Shows all bones used in the current mesh. |
| **Show LOD Bones** | Shows all bones that are used in the current LOD. |
| **Show Weighted Bones** | Shows all bones that have vertices weighted to them. |
| **Hide Bones** | Hides all bones, but will still list any sockets and attached assets. |
| **Show Active Sockets** | Shows mesh and skeleton sockets, hiding the skeleton sockets that have a customized mesh socket. |
| **Show Mesh Sockets** | Shows any sockets that are in the mesh only. |
| **Show Skeleton Sockets** | Show any sockets that are in the skeleton only. |
| **Show All Sockets** | Shows all sockets that are in the mesh and skeleton. |
| **Hide Sockets** | Hides all sockets. |

### Bone Manipulation

The **Bone Manipulation** tool is useful for previewing animations with altered bone positions. Using Bone Manipulation, you can preview how skeletons interact with other assets and even create new animations by assigning altered bone positions using the Timeline Record.

To use the Bone Manipulation Mode, select the desired Bone in the Skeletal Tree Window. You can now see the highlighted bone has a **Manipulator** in the Viewport and you can now manipulate the Bone through **Transform** (**W**), **Rotation** (**E**) and **Scale** (**R**).

 [image: bone manipulation window]

After you have manipulated a bone, the manipulation persists when you select different animation assets, so you can preview the change with different animations. Any modified bones will return to their default translation, rotation, or scale when you close and re-open the Animation Editor.

### Retarget Sources

The **Retarget Sources** tool in the toolbar will open a panel which stores and manages a list of your retarget sources. Retarget sources are used to import animations on authored characters with different proportions, a method called Animation Retargeting (-> animation-retargeting-in-unreal-engine).

 [image: retarget sources window panel]

## Viewport

The Viewport (-> editor-viewports-in-unreal-engine) window allows you to preview your selected Skeletal Mesh and provides information about your assets.

 [image: viewport window]

For more information about the unique animation centric features of the viewport, refer to the Animation Editors Overview (-> animation-editors-in-unreal-engine) page.

## Preview Scene Settings / Details

This panel has two tabs, **Preview Scene Settings** and **Details**.

### Preview Scene Settings

Located in this section is a tab for Preview Scene Settings (-> animation-editors-in-unreal-engine) which you can use to control the preview settings such as the selected animation, applied Skeletal Meshes, Viewport lighting, and Post Process settings.

 [image: preview scene settings window]

### Details

Similar to the main editor, the Details panel is primarily used for modifying the properties of elements like bones.

 [image: details window panel]

Clicking a Socket in the Skeleton Tree will populate the Details panel with options related to how the Socket functions.

 [image: socket detail window panel]

Below you will find a list of unique properties of Skeleton Sockets.

| Name | Description |
| --- | --- |
| **Force Always Animate** | When enabled, the current socket and the associated hierarchy of bones will always be evaluated for animation, even in instances where the structure has been optimized for the current LOD. |
| **Socket Name** | Lists the selected Socket's name. |
| **Bone Name** | Displays the bone to which the current Socket is attached. |

## Anim Curves / Animation Notifies

In this section, you find the Anim Curves tab by default. Additionally, this is also where the Animation Notifies tab will open after selecting Anim Notifies in the Toolbar.

### Anim Curves

Using the **Anim Curves** panel, you can create and manage curve values for **Morph Targets**, as well as **Attribute** and **Material** curves for the selected skeleton.

 [image: animation anim curves window panel]

You can filter the visible curves to show only active curves by clicking **All Curves** to deselect it, then you can toggle filters by checking the boxes next to Morph Target, Attribute, and Material curves.

For more information about Animation Curves and the **Curve Editor**, refer to the Animation Curves (-> animation-curves-in-unreal-engine) page.

### Animation Notifies

**Animation Notifications** (**AnimNotifies** or just **Notifies**) provide a way for animation programmers to set up events to occur at specific points during an **Animation Sequence**. Notifies are commonly used to add effects to animation like footstep sounds during a walk.

 [image: animation anim notification notifies window panel]

Here you can create and manage the Notifies associated with the current skeleton asset.

For more information about Animation Notifies and workflow examples, refer to the Animation Notifies (-> animation-notifies-in-unreal-engine) page.

- animation

On this page

- Toolbar (-> skeleton-editor-in-unreal-engine)
- Skeleton Tree / Retarget Sources (-> skeleton-editor-in-unreal-engine)
- Skeleton Tree (-> skeleton-editor-in-unreal-engine)
- Bone Manipulation (-> skeleton-editor-in-unreal-engine)
- Retarget Sources (-> skeleton-editor-in-unreal-engine)
- Viewport (-> skeleton-editor-in-unreal-engine)
- Preview Scene Settings / Details (-> skeleton-editor-in-unreal-engine)
- Preview Scene Settings (-> skeleton-editor-in-unreal-engine)
- Details (-> skeleton-editor-in-unreal-engine)
- Anim Curves / Animation Notifies (-> skeleton-editor-in-unreal-engine)
- Anim Curves (-> skeleton-editor-in-unreal-engine)
- Animation Notifies (-> skeleton-editor-in-unreal-engine)

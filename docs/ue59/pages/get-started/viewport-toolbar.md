# Viewport Toolbar

https://dev.epicgames.com/documentation/en-us/unreal-engine/viewport-toolbar?application_version=5.9

> An reference for the viewport toolbar and its functionality with the Unreal Editor.

When working in the Unreal Editor, there are Level Editor Modes that each have their own workflows, functionality, and toolbar that corresponds to this. This **Viewport Toolbar** is located above the editor viewport, they include quick-select tools and menu options that affect how you interact with objects, the level in general, and what you see there. These viewport toolbar options can change depending on which mode the level editor is currently using.

## Improved Viewport Toolbar versus the Legacy Viewport Toolbar

Unreal Engine 5.6 introduces the improved viewport toolbar that has a new layout that accommodates modern workflows. This viewport toolbar replaces the previous viewport toolbar entirely for the Level Viewport and any other asset editors that also have a viewport.

[image: The improved level viewport toolbar in Unreal Engine 5.6 and later compared to the legacy viewport toolbar found in earlier versions of Unreal Engine.] The improved level viewport toolbar in Unreal Engine 5.6 and later compared to the legacy viewport toolbar found in earlier versions of Unreal Engine.

This update to the viewport toolbar provides the following benefits:

- It has consistent locations for features ordered by logical categories, such as those for transforms, snapping, and viewport modes.
- Unification of related tools and options that were previously located in high-level settings dropdowns.
- Better overflow management for smaller viewports as quick-select elements and menu condense and collapse into an overflow menu.
- Unique toolbars for Level Editor Modes and asset editors with their own specific controls.
- User-customizable menus.
- Better extensibility and customization with the `ToolsMenu` system.

## Viewport Toolbar Interface

The toolbar — whether it’s in the level editor or an asset editor — is located just above the viewport window.

[image: Toolbar interface]

The improved Viewport Toolbar is located at the top of any viewport as a separate toolbar above the viewport window. Its settings and tools are grouped into the following categories:

[image: Toolbar settings grouped into 5 categories.]

- Transform and Snapping Tools (-> viewport-toolbar)
- Camera-Related Tools (-> viewport-toolbar)
- View Mode and Show Flag Options (-> viewport-toolbar)
- Performance and Scalability Options (-> viewport-toolbar)
- Viewport-Related Options (-> viewport-toolbar)

## Viewport Toolbar Transform & Snapping Tools

The **Transform** and **Snapping** tools make up most of the tools you’ll use to select and manipulate objects within the editor viewport. This includes tools for selection, snapping, space orientation, and quick-select options for the most common ones.

### Transform Tools

The **Transform** **tools** are a set of quick selection tools to move, rotate, and scale objects and set what space (local or world) these should operate in. These options are how you will interact with objects in the level. This part of the toolbar also includes a dropdown menu with additional transform-related options.

[image: Viewport transform tools area.]

You can use these quick-select toolbar options to manipulate objects in the viewport:

[image: Viewport quick-select transform tools.]

| Icon | Name | Keyboard Shortcut | Description |
| --- | --- | --- | --- |
| [image: Transform tool select icon] | **Select Objects** | **Q** | Use this option to select objects within the viewport. |
| [image: Select and transform icon] | **Select and Translate Objects** | **W** | Use this option to select objects and move them around the world using the translate gizmo. Use the gizmo to move objects along individual axes, dual axes, or on all three axes. |
| [image: Select and rotate objects tool icon] | **Select and Rotate Objects** | **E** | Use this option to select objects and rotate them using the rotate gizmo. Use the gizmos to rotate the selected object along individual axes. |
| [image: Select and scale objects tool icon] | **Select and Scale Objects** | **R** | Use this option to select objects and scale them using the scale gizmo. Use the gizmo to scale objects along individual axes, dual axes, or uniformly on all three axes. |

|  |  |  |
| --- | --- | --- |
| [image: Transform tools video of object moving.] | [image: Transform tools video of object rotating..] | [image: Transform tools video of object rotating.] |
| **Move** | **Rotate** | **Scale** |

 You can click the **Coordinate Space** icon to toggle between World and Local space that affects how objects in the viewport are translated and rotated.

[image: Coordinate space tool in toolbar.]

| Icon | Name | Keyboard Shortcut | Description |
| --- | --- | --- | --- |
| [image: World space coordinates icon] | **World Space Coordinates** | **CTRL + `** | This icon is the coordinate system used for World Space (the entire level), with its origin being the center of the scene (the world grid). This coordinate system is fixed — you cannot transform it. Objects are translated and rotated in absolute units relative to the level’s origin and scale relative to the entire level. |
| [image: Local space coordinates icon] | **Local Space Coordinates** | **CTRL + `** | This icon is the coordinate system used for Local (Object) Space with its coordinate system relative to the scene component to which the actor is attached. Every actor has a local space coordinate system within a scene relative to the actor’s pivot point. Use local space to translate or rotate an object relative to its parent. |

|  |  |
| --- | --- |
| [image: Video of world space view and rotate.] | [image: Video of local space move and rotate.] |
| **World Space Move and Rotate** | **Local Space Move and Rotate** |

 For more in-depth explanations of Unreal Engine’s coordinate system and coordinate spaces for transforming objects within a 3D space, see Coordinate System and Spaces (-> coordinate-system-and-spaces-in-unreal-engine).

#### Viewport-Related Transform Tools Menu

The **Transform** toolbar dropdown menu contains a list of transform options, coordinate spaces, and options for how the gizmo is displayed in the level editor viewport. Some options here, such as transform tool and coordinate system are available as quick-select options in the viewport toolbar.

[image: Image of transform tools menu with checkbox options.]

 The menu is broken down into the following categories:

| Menu Section | Name | Description |
| --- | --- | --- |
| [image: Transform tools menu.] | **Transform Tools** | Menu options to select the transform tool or coordinate space you want to use. These options are available as quick-select options in the viewport toolbar. |
| [image: Transform tools menu, gizmo options.] | **Gizmo Options** | Menu options to change how you view and interact with the transform tools gizmo when objects are selected. |
| [image: Transform tools menu, selection options.] | **Selection Options** | Menu options to change how you select objects in the viewport. |

### Snapping Tools & Snap Settings

The **Snapping** tools includes a set of quick selection tools for snap sizes and angles to move, rotate, and scale objects in incremental steps. The snap settings also include options for how objects should snap to other objects and surfaces.

The **Snapping Settings** dropdown displays a list of optional toggles for how objects snap within the world.

[image: Snapping tools menu.]

The toolbar includes quick-select snapping toggles and size / angle increments settings.

[image: Snapping tools increment settings.]

When clicking on the values next to any quick-select snapping icon in the toolbar, you can use its dropdown to set a value, or select from available ones to use.

|  |  |  |  |
| --- | --- | --- | --- |
| [image: Surface snapping setting options.] | [image: Snapping menu, grid snap options.] | [image: Rotation angle snap increments.] | [image: Snapping menu scaling options.] |
| **Surface Snapping Settings** | **Grid Snap Sizes** | **Rotation Angle Snap Increments** | **Scaling Snap Sizes** |

#### Snap to Surfaces Settings

The **Surface Snapping** settings dropdown sets the snapping behavior of objects when you drag them around in the scene.

[image: Surface snapping menu.]

The **Rotate to Normal Surface** setting toggles whether objects should align to the surface's normal direction they are being snapped to. For example, when an object, like the pillar below, is dragged along a curved surface, it aligns to the direction of the curved surface when this setting is enabled. When disabled, the pillar will always face in the direction it is oriented.

|  |  |
| --- | --- |
| [image: Video clip of normal rotate to surface action.] | [image: Video of Rotate to surface in off mode.] |
| **Rotate to Surface Normal: ON (default)** | **Rotate to Surface Normal: OFF** |

## Viewport Toolbar Camera Settings

The **Camera Settings** contain options that affect the camera view for the viewport and the look of the scene.

[image: Toolbar camera settings.]

| Icon | Name | Description |
| --- | --- | --- |
| [image: Camera perspective options] | **Camera Options** | A selection of options that affect the look of the viewport, its view, and includes the access to the high resolution screenshot tool. |
| [image: Camera speed options icon] | **Camera Speed Options** | Options that control the speed of the camera when moving through the world. |

### Camera Options Menu

You can click on the **Camera Options** dropdown menu that includes options to change the look of the viewport, switch between camera views for perspective and orthographic, set the viewport to a cinematic view, and more. The options available in this menu change depending on cameras placed in the level and whether you are using a perspective or orthographic view.

[image: Camera toolbar menu.]

 This menu is broken up into the following sections:

| Menu Section | Name | Description |
| --- | --- | --- |
| [image: Camera perspective menu options.] | **Perspective** | This camera view simulates how the human eye perceives the world. This camera view is the default view used for all viewports. The **View** options in this menu that affect field of view, near view plane, and far view plane are specific to the perspective camera view. |
| [image: Camera orthographic menu options.] | **Orthographic** | This camera view uses a projection that maintains parallel lines, whereby objects appear to have the same scale regardless of their distance from the camera. This includes views for top, bottom, left, right, front, and back. |
| [image: Camera movement menu options.] | **Movement** | Options to change how the viewport camera moves. You can pilot other actors in the scene and change the movement of the camera. |
| [image: Camera view menu options.] | **View** | When the **Perspective** view is used, these options change the field of view, near view plane, and far view plane for how content is shown in the viewport. |
| [image: Camera exposure menu options.] | **Exposure** | Override settings change the exposure value in the viewport. When Game Settings is disabled, you can use the text field to override the camera exposure for the viewport. |
| [image: Camera viewport type menu options.] | **Viewport Type** | Choose a viewport layout to use. The **Cinematic Viewport** layout is tailored for cinematic workflows and adds the **Composition Overlays** options menu to the toolbar, where you can select different overlays for framing, masking, and composition. |
| [image: Camera create menu options.] | **Create** | Options to create camera actors in the world and scene bookmarks for camera views in the world. |
| [image: Camera options menu choices.] | **Options** | Toggleable settings that affect the viewport, such as game view that disables selection highlight and gizmos tools, or **Preview Selected Cameras** sets how large the preview window for a selected camera is in the bottom-right of the viewport. |

### Camera Perspective & Orthographic Views

You can use the **Camera Options** menu to select how content is displayed in the viewport. The default viewport uses the **Perspective** view, but you can select from a list of **Orthographic** views to use as well.

[image: Perspective and orthographic menu options.]

 Below is an example of different views in the viewport for both orthographic and perspective.

[image: Orthographic and perspective views in 4 viewports.]

### Movement Options

The **Movement** options section of the menu includes options for how you pilot actors using the viewport, and change camera movement in the viewport.

[image: Camera movement options menu.]

 This section of the menu includes the following settings:

| Setting Name | Description |
| --- | --- |
| Pilot |  |
| **Pilot [Selected Actor]** | Move the selected actor around using the viewport controls, and bind the viewport to the actor’s location and orientation. |
| **Stop Piloting Actor** | When piloting is enabled for an actor, this stops piloting of an actor with the current viewport. It unlocks the viewport’s position and orientation from the actor the viewport is currently piloting. |
| **Exact Camera View** | Toggles showing the exact camera view when using the viewport to pilot a camera. |
| **Selected Piloted Actor** | Selects the currently piloted actor in the Outliner. |
| Camera Movement |  |
| **Camera Speed** | Set the camera speed for movement in the viewport. These options are available from the quick-select toolbar as well. |
| **Frame Selected** | Centers the viewport on the selected actor(s). |
| **Move Camera to Object** | Move the current camera to match the location and rotation of the selected object. |
| **Move Object to Camera** | Move the selected object to match the location and rotation of the current camera. |
| **Orbit Around Selection** | If enabled, the camera will orbit around the current selection in the viewport. |
| **Link Ortho Camera Movement** | If enabled, all orthographic viewports are linked to the same position and move together. When disabled, they move independent of one another. |
| **Ortho Zoom to Cursor** | If enabled, orthographic viewport zooming centers on the mouse cursor’s position. When disabled, the zoom is around the center of the viewport. |

### View Options

The **View** options are available when the viewport is using the **Perspective** view. These options configure the viewing angle of the viewport camera, and at what distance content should be visible from this camera.

[image: Image of menu options for field of view.]

 This section includes the following settings:

| Setting Name | Description |
| --- | --- |
| **Field of View** | Sets the viewing angle of the viewport camera. This angle defines the extent of the world that is visible to the camera at any given time. The default is a **90 degree** viewing angle. Higher angles give you wider views to see more of the world but this skews the camera view. Lower angles show less of the world, feeling zoomed in, but the view of content is limited. |
| **Near View Plane** | Sets the size of the plane used to clip through objects when the camera is close to a surface. Large values make the clip plane bigger to see through objects more easily. |
| **Far View Plane** | Sets the far distance at which objects stop being rendered on screen. This value does not affect objects that have Nanite enabled. |

In the example below, you can see how adjusting the field of view angle affectss your view:

|  |  |  |
| --- | --- | --- |
| [image: Example field of view at 65 degrees.] | [image: Example field of view at 90 degrees.] | [image: Example field of view at 120 degrees.] |
| **Field of View: 65 Degrees** | **Field of View: 90 Degrees (Default)** | **Field of View: 120 Degrees** |

### Create Options

The **Create** options provide a way to place cameras and bookmarks in the world based on the current viewport location and orientation.

[image: Options in the Create camera menu.]

 This section includes the following options:

| Setting Name | Description |
| --- | --- |
| Create Camera |  |
| **Camera Actor** | Spawn a Camera actor in the current location and orientation of the viewport. |
| **Cine Camera Actor** | Spawn a Cine Camera actor in the current location and orientation of the viewport. |
| Bookmarks |  |
| **Set Bookmark** | Choose a bookmark from the list to set with the current viewport location and orientation. |
| **Manage Bookmarks** | **Clear Bookmark**: Clears a specific bookmark that has been saved.**Compact Bookmarks**: Attempts to move bookmark indices so they are continuous. For example, if you have bookmarks for 1, 2, and 4 slots bookmarked, this will attempt to move bookmark 4 to the bookmark 3 slot.**Clear All Bookmarks**: Clears any saved bookmarks. |
| **Bookmarks List** | A list of any bookmarks that have been saved and what keyboard shortcut they are assigned to. |

### General Options

The **Options** section of the menu includes general settings you can enable for the viewport. It also includes access to the **High Resolution Screenshot** tool, to capture still images from the viewport quickly.

[image: General options menu items.]

 This section includes the following options:

| Setting Name | Description |
| --- | --- |
| **Allow Cinematic Control** | When enabled, this allows for cinematic (Sequencer) previews to play in this viewport. |
| **Game View** | When enabled, the viewport shows the scene as it appears in the game — without editor widgets, selection highlights, or any other element usually only visible in the editor. |
| **Allow Camera Shakes** | When enabled, it allows for the camera shake previewer panel to apply shaking to this viewport. |
| **Preview Selected Cameras** | When enabled, selecting a camera actor displays a live picture-in-picture preview from the camera’s perspective within the current editor viewport. This can be used to make adjustments to positioning, post processing, and other settings without having to possess the camera itself. The **Preview Size** value adjusts the size of this picture-in-picture preview window for the camera view. |
| **High Resolution Screenshot** | Opens the control panel dialog to take high resolution screenshots of the currently used viewport. |

#### High Resolution Screenshot Tool

The **High Resolution Screenshot** tool is a dialog window you can use to capture still images of the current viewport window or you can use the **Crop** tool to select a part of the viewport to capture. It includes additional output options you can toggle on.

[image: Menu options for the high resolution screenshot tool.]

 For more information on using this tool, see High Resolution Screenshot Tool (-> taking-screenshots-in-unreal-engine).

### Camera Speed Options

The **Camera Speed** dropdown menu includes options that affect the speed at which the camera can move around the world.

[image: View of camera speed menu items.]

| Setting Name | Description |
| --- | --- |
| **Camera Speed** | Sets the speed of the camera in first person mode. Hold either mouse button (LMB or RMB) and use the scroll wheel to adjust the camera speed up or down. |
| **Speed Scalar** | Multiplies the effective value of the camera speed slider, changing how quickly the slider changes camera speed. |
| **Distance Based Camera Speed** | When enabled, this scales the perspective camera speed based on the distance between the camera and its look-at position. |

## Viewport Toolbar View Mode and Show Flag Options

The **View Mode** and **Show Flag** options for the viewport enable different visualization modes and options to enable or disable elements being rendered in the viewport.

[image: View of toolbar icons for view mode and show flag.]

| Icon | Name | Description |
| --- | --- | --- |
| [image: Image of view mode button.] | **Viewport Modes** | A listing of visualization modes to help see specific types of data being processed in your scene, such as lighting only, reflections, or buffer visualizations. These can help you diagnose and investigate specific issues for your project. |
| [image: View of show flag icon.] | **Show Flags** | A list of engine features you can show and hide within the viewport. For example, you can disable all particle systems, individual post processing features, and more. |

### Viewport Modes

The **Viewport Modes** dropdown menu includes many visualization options to select from. When selected, they apply to the current viewport only.

[image: Image of the viewport modes dropdown menu items.]

These are some examples of different viewport modes being applied to the viewport:

|  |  |  |
| --- | --- | --- |
| [image: View of a set with the walls and actors lit.] | [image: View of a set with the walls and actors unlit.] | [image: View of a set with the walls and actors in light gradient..] |
| Viewport Mode: Lit (default) | Viewport Mode: Unlit | View Modeport: Light Complexity |

For more information on using these viewport modes in your project workflows, see Viewport Modes (-> viewport-modes-in-unreal-engine).

### Show Flags

The **Show Flags** dropdown menu includes many options to toggle visibility of engine features, such as lighting, post processing, geometry types, and more.

[image: Image of show flags menu items.]

For more information on using these show flags in your project, see Viewport Show Flags (-> viewport-show-flags-in-unreal-engine).

## Viewport Toolbar Performance and Scalability Tools

The **Performance** and **Scalability Tool** menu includes options that affect the look and performance of content in the viewport. These tools are useful for approximating what content looks like on a particular platform, setting scalability for the project (to make it easier to work with), and looking at how the game can look with different scalability options. This can help you to set up your own scalability options for your project.

[image: Image of scalability menu options on the toolbar.]

### Realtime Viewport

The **Realtime Viewport** toggles whether the current viewport should update every frame.

When disabled, the viewport only updates when you move around the scene. A warning icon is added to the viewport toolbar next to the performance and scalability dropdown menu. Clicking it restores realtime to the viewport.

[image: Image of warning icon next to the realtime viewer.]

### Preview Platform

The **Preview Platform** rollout menu includes a variety of platform options to select from. Selecting platform and its target, triggers a shader recompile for the engine. Once completed, the viewport updates to display an approximation of what the scene would render like using this target.

Each platform can have multiple targets depending on what rendering paths of the engine it supports.

[image: Preview platform menu dropdowns.]

This menu rollout includes the following options:

| Setting Name | Description |
| --- | --- |
| Preview Platform |  |
| **Disable Preview** | Disables any currently selected preview platform target and sets it back to the operating system's default preview. For Windows, this would be Windows with Shader Model 6 (SM6). |
| **[Platform Preview Select]** | Choose from a list of platform targets to preview in the main editor viewport. Each platform can support multiple targets, such as Android with OpenGL and Vulkan preview options. Some platform preview options, such as console platforms, only become available when their SDKs are installed. |

The scene below shows a comparison of the default viewport preview settings on WIndows compared to previewing the scene on Android in the viewport.

|  |  |
| --- | --- |
| [image: Statue in a foyer, darker version image.] | [image: Statue in a foyer, better lighting.] |
| **Windows with SM6** | **Android with Vulkan High** |

For more information, see Mobile Previewer (-> using-the-mobile-previewer-in-unreal-engine).

### Viewport Scalability

The **Viewport Scalability** options include a rollout menu of common settings of the engine. You can change individual feature categories to be Low, Medium, High, Epic, or Cinematic, or you can select any of these quality options to set all categories to be Low, Medium, High, Epic, or Cinematic. Optionally, you can use **Auto** to configure the scalability options based on your system specifications and its performance.

[image: Image of viewport scalability groups.]

When the scalability options are set to anything other than the default, this warning icon appears in the toolbar. This is an indicator that what the game would look like running outside of the editor doesn’t reflect the options currently set in the scalability options. You can click this icon to reset the scalability options to their default settings.

[image: Viewport scalability icon on the toolbar.]

For more information, see Scalability (-> scalability-in-unreal-engine).

### Material Quality Level

The **Material Quality Level** rollout menu lists quality levels for Low, Medium, High, and Epic to choose from. You can use these to check any materials that use the **Quality Switch** node in a material. You can use these menu options to inspect only materials in the viewport. The material quality switches also work with the scalability options.

[image: Material quality menu options.]

### Screen Percentage

The **Screen Percentage** rollout menu includes information about the current screen percentage used in the viewport, and options to override screen percentage in the viewport. The summary in this menu provides specific information about the viewport and its current settings.

[image: Image of the screen percentage menu options.]

## Viewport-Related Settings

The viewport **Settings** and **Overlay** menus assist with audio settings, mouse movement within the viewport, viewport layout options (for working with multiple viewports), and more.

[image: Image of the settings and viewport-layout icons on the toolbar.]

| Icon | Name | Description |
| --- | --- | --- |
| [image: Viewport settings icon.] | **Viewport Settings ** | A list of settings to control the volume of sounds in the level editor, configurable controls for interacting and traversing the scene in the level editor viewport, and more. |
| [image: Viewport layout icon.] | **Viewport Layout Options** | A list of viewport layouts to choose from when using more than one viewport. |

### Viewport Settings

The **Viewport Settings** menu includes options that affect controls and interactions with objects within the viewport, sound levels for audio playback, and quick access to the **Editor Preferences** you can configure for the viewport.

[image: Viewport settings menu options.]

| Settings Name | Description |
| --- | --- |
| Settings |  |
| **Level Editor Volume (dB)** | Sets the preview volume (in decibels) of audio placed in the level while working in the level editor. |
| Controls |  |
| **Mouse Sensitivity** | How fast the perspective camera moves through the world when using the mouse scroll wheel. |
| **Mouse Scroll Zoom Speed** | Sets the incremental speed at which the camera should move in a forward or reverse direction when using the mouse scroll wheel. |
| **Invert Middle Mouse Pan** | When enabled, the direction of the middle mouse panning in the viewport is inverted. |
| **Invert Orbit Axis** | When enabled, the Y-axis of the mouse movement when orbiting is inverted. |
| **Invert Right Mouse Dolly** | When enabled, the direction of the right mouse dolly on the Y-axis in orbit mode is inverted. |
| **Scroll Gestures** | Set whether scroll gestures should use standard or natural scrolling when working in the **Perspective** and **Orthographic** viewports. |
| **Open Viewport Preferences** | Opens the advanced viewport settings of the **Editor Preferences**. There, you can configure settings for the look and feel, controls, grid snapping, and more. |
| Cascade |  |
| **Cascade** | These settings only apply to the deprecated particle systems created with Cascade.Enable Particle Systems LOD Switching: When enabled, Cascade particle systems will use distance level of detail (LOD) switching in perspective viewports.**Toggle Particle System Helpers**: When enabled, Cascade particle systems show helper widgets in viewports.**Freeze Particle Simulation**: When enabled, Cascade particle systems will freeze their simulation state. |

### Viewport Layouts and Sizing Settings

The **Viewport Layouts** includes a layouts window to select the type of viewport layout you prefer, and a quick-toggle to switch between a selected layout and maximized viewport screen.

[image: Viewport layouts icon and ellipses on the toolbar.]

The vertical ellipses menu includes different layout configurations you can choose from, including an option to use **Immersive View** with the selected viewport.

[image: Viewport panes menu options in the toolbar.]

The quick-toggle button switches between maximizing the currently selected viewport or switching to the selected layout configuration with multiple viewports displayed in the editor window.

[image: Quick toggle menu icon on the toolbar.]

In this example, clicking the overlay toggle buttons will switch between the maximized and selected layout for the editor viewports.

Video of clicking through adjusting to multiple viewports view.

### Viewport Toolbar Warning Indicators

When the interaction within a menu alters something critical that affects the viewport, such as a change that could cause visual or performative differences, actionable warning indicators appear in the viewport toolbar alongside the category they affect. This is helpful to indicate a change has occurred that can affect what you see in the viewport in some way.

For example, when **Realtime Viewport** is disabled, the warning indicator can clue you into the fact that the viewport isn’t updating what you see, which can have unintended consequences.

When these indicators are shown, you can click them to rest the changed setting to its default state, in turn removing the warning.

[image: Realtime viewport warning icon on the toolbar.]

### Other Editor Viewports

The **Viewport Toolbar** is adapted to different modes of the level editor and to the individual asset editors it has.

The sections below are some examples of these differences.

### Level Editor Viewport Modes

The level editor can be put into different **Modes** to enable specialized editing interfaces and workflows for editing particular types of actors and geometry within the viewport.

You can change the level editor mode using the dropdown selection menu in the main toolbar.

[image: Menu of categories you can select via the selection tool.]

These modes change the primary behavior of the level editor viewport for a specialized task, such as moving and transforming assets in the world, sculpting landscapes, generating foliage, animating objects, and more.

| Level Editor Mode | Viewport Toolbar |
| --- | --- |
| **Selection (default)** | [image: Default toolbar for level editor modes.] |
| **Animation** | [image: Animation toolbar for level editor modes.] |
| **Modeling** | [image: Modeling toolbar for level editor modes.] |

For more information on these editor modes, see Level Editor Modes (-> level-editor-modes-in-unreal-engine).

### Asset Editors

Individual **Asset Editors** use a viewport toolbar adapted to their editors and functionality within.

In this example, you can see a comparison of the legacy viewport toolbar to the improved viewport toolbar.

[image: Legacy editor under current toolbar for comparison.]

Below are examples of the different viewport toolbars you’ll see in different editors:

| Viewport Toolbar Location | Viewport Toolbar Representation |
| --- | --- |
| **Level Editor Selection Mode** | [image: Level editor selection mode toolbar layout.] |
| **Static Mesh Editor** | [image: Static mesh editor toolbar layout.] |
| **Material / Material Instance Editor** | [image: Material instance editor toolbar layout.] |

### Asset Editor Preview Scene Settings

**Asset Editor** viewports use a preview scene to display their assets. This scene can give you an idea of how that asset will look in a lit environment. You can change properties of the scene using the **Preview Scene Settings**.

You can access a portion of these settings from the viewport toolbar by clicking its menu.

[image: Asset editor preview scene menu settings.]

If you want to make additional changes to the scene in the viewport, select Preview Scene Settings from this menu to open the Preview Scene Settings panel, where you’ll have access to additional lighting, post process, and scene options.

[image: The preview scene settings panel for more options.]

### Materials and Material Instances Viewport Toolbars

The **Material** and **Material Instance** editors display a limited viewport toolbar. Since these editors are previewing a material and how it renders on an object within an environment, viewport controls found in other editors simply aren’t necessary here.

[image: Materials options icons on the toolbar.]

The notable difference between these editors and others is that **Preview Mesh** options are included in the viewport toolbar. You can choose one of the provided shapes, or select a custom mesh from the **Content Browser** to preview the material.

- editor

On this page

- Improved Viewport Toolbar versus the Legacy Viewport Toolbar (-> viewport-toolbar)
- Viewport Toolbar Interface (-> viewport-toolbar)
- Viewport Toolbar Transform & Snapping Tools (-> viewport-toolbar)
- Transform Tools (-> viewport-toolbar)
- Viewport-Related Transform Tools Menu (-> viewport-toolbar)
- Snapping Tools & Snap Settings (-> viewport-toolbar)
- Snap to Surfaces Settings (-> viewport-toolbar)
- Viewport Toolbar Camera Settings (-> viewport-toolbar)
- Camera Options Menu (-> viewport-toolbar)
- Camera Perspective & Orthographic Views (-> viewport-toolbar)
- Movement Options (-> viewport-toolbar)
- View Options (-> viewport-toolbar)
- Create Options (-> viewport-toolbar)
- General Options (-> viewport-toolbar)
- High Resolution Screenshot Tool (-> viewport-toolbar)
- Camera Speed Options (-> viewport-toolbar)
- Viewport Toolbar View Mode and Show Flag Options (-> viewport-toolbar)
- Viewport Modes (-> viewport-toolbar)
- Show Flags (-> viewport-toolbar)
- Viewport Toolbar Performance and Scalability Tools (-> viewport-toolbar)
- Realtime Viewport (-> viewport-toolbar)
- Preview Platform (-> viewport-toolbar)
- Viewport Scalability (-> viewport-toolbar)
- Material Quality Level (-> viewport-toolbar)
- Screen Percentage (-> viewport-toolbar)
- Viewport-Related Settings (-> viewport-toolbar)
- Viewport Settings (-> viewport-toolbar)
- Viewport Layouts and Sizing Settings (-> viewport-toolbar)
- Viewport Toolbar Warning Indicators (-> viewport-toolbar)
- Other Editor Viewports (-> viewport-toolbar)
- Level Editor Viewport Modes (-> viewport-toolbar)
- Asset Editors (-> viewport-toolbar)
- Asset Editor Preview Scene Settings (-> viewport-toolbar)
- Materials and Material Instances Viewport Toolbars (-> viewport-toolbar)

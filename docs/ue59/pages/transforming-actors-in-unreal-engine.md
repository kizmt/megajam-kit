# Transforming Actors

https://dev.epicgames.com/documentation/en-us/unreal-engine/transforming-actors-in-unreal-engine?application_version=5.9

> How to modify the location, rotation, and scale of Actors in a Level.

[image: Transforming Actors]

**Transforming** an actor in **Unreal Engine** refers to moving, rotating, or scaling it (in other words, adjusting the position, orientation, and / or size of the actor). This page describes how to perform each of these actions, as well as some of the commonly used keyboard shortcuts when working with actors.

There are two ways to transform actors in the Unreal Editor:

- Manual transformation
- Interactive transformation

In Unreal Engine, the vertical axis is the **Z axis**.

## Manual Transformation

You can do **manual transformation** through the **Transform** section of the **Details** panel. When you select one or more actors in the **Level Viewport**, you can view and edit their **Location**, **Rotation**, and **Scale** in this section. Where applicable, this section also contains Actor mobility (-> actor-mobility-in-unreal-engine) settings.

[image: Transform section in the Unreal Enigne] The Transform section of an Actor's Details panel, showing values for the actor's Location, Rotation, and Scale.

Each **Transform** property has numeric entry fields for the X, Y, and Z axes. You can type specific values directly into these fields to adjust the selected Actors, or click inside a field and drag your mouse up or down to adjust that field's value.

If you select more than one actor, and their Location or Rotation has multiple values, the relevant fields will display Multiple Values. In this case, if you enter a number it will overwrite that value for all selected Actors. Note that this may cause the Actors to overlap.

[image: Multiple values in the Transform section] With multiple actors selected, one or more Transform fields can have multiple values, as this example illustrates.

To reset an Actor's **Location**, **Rotation**, or **Scale** to their default values after you've made changes, click the **Reset to Default** button ( ).

You can lock the **Scale** fields by clicking the **Lock Scale** button ( ). When locked, the values for each axis (X, Y, and Z) change in unison, which allows for uniform scaling and prevents distortion.

Transform properties default to relative coordinate space, which means the transform occurs relative to the Actor's parent. You can toggle between relative and world transforms by clicking the dropdown arrow next to a property label. World transforms occur relative to world coordinates instead of the Actor's parent. For more information, see the **World and Local Transformation Modes** section on this page.

## Interactive Transformation

You can do **Interactive transformation** directly inside the **Level Viewport**, using a visual tool called a **gizmo**. Sometimes, a gizmo can also be called a **widget**; in Unreal Engine, these terms mean the same thing.

A gizmo is made up of several parts that are color-coded according to which axis they affect:

- Red represents the X axis.
- Green represents the Y axis.
- Blue represents the Z axis.

You can use transformation gizmos to move, rotate, or scale Actors.

Gizmos are more intuitive to use, but they can be less precise than entering coordinates manually. Use **grid snapping** for precise positioning when using gizmos.
For more information, refer to the Actor Snapping (-> actor-snapping-in-unreal-engine) page.

The gizmo takes different forms depending on what type of transformation is being performed: translation, rotation, or scale. You can choose which type of gizmo you want to use by clicking its icon on the right side of the **Level Viewport** toolbar, itself located in the upper section of the Viewport, or by using keyboard shortcuts.

[image: Level Viewport toolbar] The Level Viewport toolbar is located in the upper section of the viewport, with the gizmo selection icons on the right.

[image: Shortcuts to transformation gizmos on the Level Viewport toolbar.] Left to right: Shortcuts to the Selection, Translation, Rotation, and Scaling gizmos in the Level Viewport toolbar.

With one or more actors selected, you can toggle between the different types of gizmos by pressing the **Space Bar** on your keyboard.

You can toggle the visibility of transformation gizmos on and off from the main toolbar's **Settings** menu by enabling or disabling the **Show Transform Widget** option.

### Translation Gizmo

The **Translation** gizmo is a set of color-coded arrows pointing down the positive direction of each axis in the world. Use it to move an actor along an axis, a plane, or freely.

Click an arrow and drag an arrow to move the selected actor along that axis.

Translating a cube along a single axis.

To move an actor along two axes simultaneously, click the square near the point where the two axes meet, then drag to move the actor along the plane defined by the two axes (XY, XZ, or YZ).

 [image: Translating a cube along two axes (a single plane).] Translating a cube along two axes (a single plane).

To move the actor freely along all three axes, click and drag the grey square or circle at the point where all three axes intersect. You can also use the mouse wheel to move the actor nearer or farther.

 [image: Translating a cube along all three axes.] Translating a cube along all three axes.

#### Duplicating an Actor Using the Translation Gizmo

To duplicate an actor, hold down the **Alt** key, then click and drag a Translation gizmo arrow. This creates and moves a duplicate of the selected actor, leaving the original unchanged at the starting position.

 [image: Duplicating an actor using the Translation gizmo.] Duplicating an actor using the Translation gizmo.

You can also duplicate actors by holding the Alt key while rotating an actor, but in that case the actors end up overlapping each other.

[image: Alt rotation actor duplication] Duplicating an actor using the Rotation gizmo.

While translating an object, you can place copies of it at your current position by tapping the Alt key.

### Rotation Gizmo

The **Rotation** gizmo is a set of four color-coded arcs, each associated with one axis. When you drag one of the arcs, the selected Actor rotates around that axis. For this gizmo, the axis affected by any one of the arcs involved is the one perpendicular to the arc. For example, the arc aligned to the XY plane rotates the Actor around the Z axis. The outer white arc rotates the selected Actor around the virtual axis pointing to the camera.

Rotating an actor using the Rotation gizmo.

When you hover the cursor over a particular arc, that arc turns yellow, indicating that you can drag it to rotate the actor. When you start to rotate the actor, the gizmo changes shape to show only the axis around which the actor is being rotated. The amount of rotation is displayed in real time to help you gauge your progress.

You can also rotate the selected actor by clicking and dragging in the space between the arcs. This is called the **arc ball**. It provides freeform rotation as if you were turning a ball by pulling and pushing on its surface.

### Scale Gizmo

The **Scale** gizmo has handles that end in cubes. When you drag the gizmo by one of these handles, you scale the selected actor only along the associated axis. The handles are color-coded by axis, similar to the **Translation** and **Rotation** gizmos.

 [image: Scaling an actor along a single axis.] Scaling an actor along a single axis.

You can scale an actor along two axes simultaneously in the same way you can use the **Translation** gizmo to move an actor along a plane defined by two axes. Each axis is connected to each other axis with a line that forms a triangle. These triangles align with one of the three planes (XY, XZ, YZ). Dragging one of these triangles scales the actor along both axes that define that plane. When the mouse hovers over one of these triangles, the associated handles turn yellow.

Scaling an actor along a single plane.

You can also scale an actor along all three axes, thus maintaining its original proportions. If you hover the cursor over the cube where all three axes meet, all three handles turn yellow. Dragging by that center cube scales the actor proportionally.

When you enable scale snapping, the three axes meet at a sphere, not a cube.

 [image: Scaling an actor proportionally.] Scaling an actor proportionally.

### Transformation Modes — World, Local, Parent, and Explicit

When using the interactive transformation method, you can choose which reference coordinate system you want to use when performing translations and rotations. This means you can transform the actor in accordance with any of the following:

| Transformation Mode Icon | Transformation Mode Name | Description |
| --- | --- | --- |
| [image: World space icon] | **World Space** | When selected, you can translate and rotate objects relative to its space in the world. |
| [image: Local space icon] | **Local Space** | When selected, you can transform an object relative to itself. The Scale gizmo always uses local space only. |
| [image: Parent space icon] | **Parent Space** | When selected, you can translate and rotate objects relative to its parent’s axes. |
| [image: Explicit space icon] | **Explicit Space** | When selected, you can translate the object relative to its parent’s axes and rotate using gimbal axes.This option is enabled from the Editor Preferences > Gizmos > Gizmo Interaction. Use the dropdown menu for **Additional Coordinate Systems**. [image: Gizmo additional coordinate systems] |

The examples below show the difference between World, Local, Parent, and Explicit space, using identical static mesh actors.

#### World Space

The translation gizmo's XYZ axes are the same as the world's XYZ axes. Dragging along the Z axis moves the cube up and down in relation to the floor.

 [image: Translating in world space] Translating in world space

Similarly, when rotating in world space, the three colored rotation arcs always align with the X, Y, Z axes of the world space. Rotation on one axis does not affect the others.

 [image: World space rotation] Rotating in world space

#### Local Space

The translation gizmo's XYZ axes use the cube's local coordinates. Dragging along the Z axis also moves the cube up and down, but at an angle.

 [image: Translating in local space] Translating in local space

When rotating an actor in local space, the axes of rotation are fixed relative to the actor, which means rotating the actor on one axis affects the rotation on the other two axes.

 [image: Rotating in local space] Rotating in local space

#### Parent Space

The translation gizmo’s XYZ axes use the parent’s axes, relative to the position of the child actor compared to its parent. Dragging along the Z axis moves the cube.

Translating in parent space

Similarly, rotation in parent space means the child actor's axes of rotation are those of the parent, relative to the child's position.

Rotating in parent space

#### Explicit Space

The translation gizmo’s XYZ axes use the parent’s axes to move objects (the same as for parent space), and the gimbal axes for rotation.

Rotating in explicit space

By default, the Unreal Editor starts out in **World Space** transformation mode. You can cycle through all of the options for Local, Parent, and Explicit (when enabled) by clicking the icon in the level viewport toolbar. Alternatively, you can use the options menu (**⋮**) to directly select the transformation mode you want to use.

[image: Transformation mode cycle icon in the Level Viewport toolbar] The globe icon indicates that transformations for the currently selected actor use world space coordinates.

## Adjusting an Actor's Pivot Point

When transforming actors, you typically perform your transforms from the base pivot of the actor. If you have a transformation gizmo enabled, you can see the **pivot point** where the three axes of that gizmo intersect.

You can adjust the location of an actor's pivot temporarily by **Alt+middle-clicking** on a translation handle. You can then transform the object around the new pivot point.

The pivot point can be inside or outside an actor.

 [image: In this example, the static mesh actor rotates around an external pivot point.] In this example, the static mesh actor rotates around an external pivot point.

### Gizmos Editor Preferences

The Editor Preferences includes a number of customizable options you can apply to the gizmos in Unreal Editor.

You can locate these options by opening the **Editor Preferences** from the main menu under the **Edit Menu**. In the Editor Preferences, the configurable gizmo options are are located in the **Gizmos **section.

[image: Gizmos editor preferences]

The Gizmo section of the Editor Preferences includes the following categories of options to set for the project:

| Category Name | Definition |
| --- | --- |
| **Gizmo Presets** | Select a predefined configuration preset for gizmos to quickly apply style and interaction settings. Selections include the current default settings, UE Classic, and Maya-style interaction. Changing between these options changes options configured in the **Gizmo Interaction** category of the Editor Preferences. |
| **Gizmo Interaction** | Configure options that change how the gizmo interaction works in your project. This includes configurable options to change rotation, scaling, and enabling additional coordinate systems (see Transformation Modes section above). |
| **Gizmo Appearance** | Configure options that affect the look of the gizmo. This includes configurable options to change line length and thickness, adjust visibility, shading on the gizmo, and more. |
| **Legacy Gizmo** | Enabling this option reverts backs to the transformation mode gizmo used in Unreal Engine 5.7 and earlier. It also enables a set of configurable options related to the legacy gizmo. |

## Keyboard Shortcuts

Below are some of the common keyboard shortcuts when working with actors.

| Control | Tool or Action |
| --- | --- |
| **Q** | Hides the gizmo. |
| **W** | Selects the Move tool. |
| **E** | Selects the Rotate tool. |
| **R** | Selects the Scale tool. |
| **Z** (tap to toggle or hold to engage while translating) | Toggles or enables Surface Snapping. |
| **X** (tap to toggle or hold to engage while translating) | Toggles or enables Translation/Rotation/Scale snapping based on the gizmo’s current mode. |
| **V** (hold down while using a translation gizmo) | Toggles vertex snapping. |
| **Left-click and drag** (on a transformation gizmo) | Moves, rotates, or scales the selected actor, depending on the transformation gizmo that is currently active. |
| ******Alt+Middle-click and dra****g** (on a translation handle) | Moves the pivot of the selected actor. |
| **Ctrl + W** (on an actor) | Duplicates the selected actor at the same coordinates as the original. |
| **Alt + Left-click and drag** (on a translation gizmo) | Duplicates the selected actor. |
| **H** (on an actor) | Hides the selected actor. |
| **Ctrl + H** | Shows all hidden actors. |
| **Shift + E** (on a mesh actor) | Selects all actors with the same static mesh as the selected actor. |
| **Ctrl + Left-click** (on an actor) | Adds the actor to the current selection of actors. |

- unreal engine
- actors
- gizmo
- transform
- gizmos
- translation
- rotation
- unreal
- ue

On this page

- Manual Transformation (-> transforming-actors-in-unreal-engine)
- Interactive Transformation (-> transforming-actors-in-unreal-engine)
- Translation Gizmo (-> transforming-actors-in-unreal-engine)
- Duplicating an Actor Using the Translation Gizmo (-> transforming-actors-in-unreal-engine)
- Rotation Gizmo (-> transforming-actors-in-unreal-engine)
- Scale Gizmo (-> transforming-actors-in-unreal-engine)
- Transformation Modes — World, Local, Parent, and Explicit (-> transforming-actors-in-unreal-engine)
- World Space (-> transforming-actors-in-unreal-engine)
- Local Space (-> transforming-actors-in-unreal-engine)
- Parent Space (-> transforming-actors-in-unreal-engine)
- Explicit Space (-> transforming-actors-in-unreal-engine)
- Adjusting an Actor's Pivot Point (-> transforming-actors-in-unreal-engine)
- Gizmos Editor Preferences (-> transforming-actors-in-unreal-engine)
- Keyboard Shortcuts (-> transforming-actors-in-unreal-engine)

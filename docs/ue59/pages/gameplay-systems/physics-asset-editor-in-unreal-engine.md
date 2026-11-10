# Physics Asset Editor

https://dev.epicgames.com/documentation/en-us/unreal-engine/physics-asset-editor-in-unreal-engine?application_version=5.9

> The editor used to set up physics bodies and constraints for physical simulation and collision for Skeletal Meshes.

[image: Physics Asset Editor]

[image: The Physics Asset Editoris specifically designed to manipulate Physics Assets for Skeletal Meshes.]

The **Physics Asset Editor** is an integrated editor that is part of the Animation Editors (-> animation-editors-in-unreal-engine) in Unreal Engine. It is specifically designed to manipulate
**Physics Assets** for **Skeletal Meshes**.

[image: A Physics Asset is used to define the physics and collision used by a Skeletal Mesh]

A Physics Asset is used to define the physics and collision used by a Skeletal Mesh. These contain a set of rigid bodies and constraints that make up a single ragdoll, which is not
limited to humanoid ragdolls. They can be used for any physical simulation using bodies and constraints. Because only a single Physics Asset is allowed for a Skeletal Mesh, they can
be turned on or off for many Skeletal Mesh components.

|  |  |
| --- | --- |
| [image: A humanoid character] | [image: The Buggy from demo] |
| Character Physics Asset | Vehicle Physics Asset |

A Physics Asset can be set up for any Skeletal Mesh for simulation. These are two examples of their usage; a humanoid character and the Buggy from Epic's demo Vehicle Game.

## Creating Physics Assets

There are two ways that Physics Assets can be created for your Skeletal Meshes:

- On import by having **Create Physics Asset** enabled.[image: On import by having Create Physics Asset enabled]
- By creating a Physics Asset using the **Content Drawer** and selecting a Skeletal Mesh to use.[image: Use the Content Drawer and select a Skeletal Mesh]The first time the Physics Asset is selected, a window to set how bodies and constraints should be generated will open:[image: A window to set the how bodies and constraints should be generated]

## Opening the Physics Asset Editor

The **Physics Asset Editor** can be opened in several different ways:

- By double-clicking the **Physics Asset** in the **Content Drawer**.[image: By double-clicking the Physics Asset in the Content Drawer]
- By using the right-click context menu and selecting **Edit...**.[image: By using the right-click context menu and selecting Edit]
- By selecting the **Physics** tab in the Animation Editors (-> animation-editors-in-unreal-engine) selection tabs.[image: By selecting the Physics tab in the Animation Editors selection tabs]The dropdown menu next to the **Physics** tab can be used to select any Physics Asset located in the **Content Drawer** that is using the currently opened Skeletal Mesh.[image: The dropdown menu can be used to select any Physics Asset]

## Essentials

- [image: Physics Bodies] Physics BodiesDescribes how to use Physics Bodies (Body Instance) for physics simulation. (-> physics-bodies-in-unreal-engine)

- [image: Physics Constraints] Physics ConstraintsConstraining physics objects together and to the world. (-> physics-constraints-in-unreal-engine)

## Tutorials

- [image: Physics Asset Editor Tutorials] Physics Asset Editor TutorialsLanding page for the Physics Asset Tool how-to section. (-> physics-asset-editor-tutorial-directory-for-unreal-engine)

- physics

On this page

- Creating Physics Assets (-> physics-asset-editor-in-unreal-engine)
- Opening the Physics Asset Editor (-> physics-asset-editor-in-unreal-engine)
- Essentials (-> physics-asset-editor-in-unreal-engine)
- Tutorials (-> physics-asset-editor-in-unreal-engine)

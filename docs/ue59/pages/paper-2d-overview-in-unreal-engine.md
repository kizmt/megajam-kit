# Paper 2D

https://dev.epicgames.com/documentation/en-us/unreal-engine/paper-2d-overview-in-unreal-engine?application_version=5.9

> Paper 2D is a sprite-based system for creating 2D and 2D/3D hybrid games in Unreal Engine.

[image: Paper 2D]

**Paper 2D** is **Unreal Engine**'s gameplay and animation system that you can use to create 2D and 2D/3D hybrid projects. In this document you can read about the components of the Paper 2D system that you can use to create 2D and 2D/3D hybrid games in Unreal Engine.

#### Prerequisites

- Enable the Paper 2D Plugin (-> working-with-plugins-in-unreal-engine). Navigate in the **Menu Bar** to **Edit > Plugins** and locate the **Paper 2D** plugin in the **2D** section, or by using the **Search Bar**. **Enable** the plugin and restart the editor.

 [image: paper 2d plugin]

## Sprites

Paper 2D's primary asset type is called a **Sprite**. Sprites are static 2-dimensional textures that you can use to represent characters or objects, when developing projects in Unreal Engine.

 [image: single manny sprite example]

Sprites often come in the form of a **Sprite Sheet**, or a single image file that contains many variations of the sprite, that you can use to animate characters and objects.

 [image: manny running sprite sheet example with every frame of animation]

By playing the static sprites from a sprite sheet sequentially, using a Flipbook (-> paper-2d-overview-in-unreal-engine), you can animate Sprite based characters and objects.

For more information about importing and editing sprites with the Sprite Editor, please see the Paper 2D Sprites documentation.

### Tiles

**Tiles** are 2D-textures that you can use to create the background and environment of a level.

 [image: example of tile map being used as a level]

Many tiles can be imported as a single image file, and divided into individual tiles using a **TileSet** asset.

 [image: example of tile sheet]

You can then use TileSets to build a **TileMap** asset, to create a 2D level or environment.

 [image: tile map being built]

For more information about importing Tiles and creating TileSets see the Tiles (-> paper-2d-tile-sets-and-tile-maps-in-unreal-engine) documentation.

## Flipbooks

You can use **Flipbooks** in Unreal Engine, to play a sequence of sprites to animate characters and objects in your project.

 [image: flipbook example manny running] (convert:false)

After importing a sprite sheet, you can combine the extracted sprites to create a Flipbook to animate a character or object. You can then add FlipBooks directly to your character's or object's Blueprint to dynamically play animations during run time.

For more information about editing and using FlipBooks see the Flipbook documentation.

## Workflow Guides

Here you can find workflow guides that you can reference when creating Paper2D projects in Unreal Engine.

- animation
- paper 2d

On this page

- Prerequisites (-> paper-2d-overview-in-unreal-engine)
- Sprites (-> paper-2d-overview-in-unreal-engine)
- Tiles (-> paper-2d-overview-in-unreal-engine)
- Flipbooks (-> paper-2d-overview-in-unreal-engine)
- Workflow Guides (-> paper-2d-overview-in-unreal-engine)

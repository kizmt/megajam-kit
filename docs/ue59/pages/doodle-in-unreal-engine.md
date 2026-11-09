# Doodle

https://dev.epicgames.com/documentation/en-us/unreal-engine/doodle-in-unreal-engine?application_version=5.9

> Draw 2D notes over editor viewports and save or share them with Doodle.

Doodle lets you draw 2D notes on top of editor viewports. You can sketch over a shot or a level during a review, then save the drawing as an image or texture, copy it to the clipboard, keep it with a World Bookmark, or add it to a Level Sequence.

> **warning:** Doodle is an Experimental feature. Its tools and workflow may change in future releases.

## Prerequisites

To enable the **Doodle **plugin:

- In the menu bar, go to **Edit > Plugins**.

- Find **Doodle **in the **Virtual Production** category and enable it.

- Restart the editor.

Optionally, enable the **Stylus Input** plugin to draw with pen pressure on a graphics tablet.

## Opening Doodle

Open Doodle from the viewport toolbar of an editor viewport. The Doodle overlay opens on top of that viewport, and the Doodle toolbox appears with the drawing tools. Select the same toolbar entry again, or click Exit, to close the overlay.

> **note:** The drawing is cleared when the overlay closes. Save or share it before you close the overlay.

## Drawing Tools

The Doodle toolbox groups its tools into the following categories:

| Tool | Description |
| --- | --- |
| Select | Select marks to move or remove them. |
| Free Draw | Draws a free-hand stroke, like a pen. With the Stylus Input plugin enabled, pen pressure changes the stroke width. |
| Lasso | Draws a free-hand closed shape, with an optional fill. |
| Line | Draws a straight line. |
| Arrow | Draws an arrow. A bidirectional option draws a head at both ends. |
| Ellipse | Draws an ellipse, with an optional fill. |
| Rectangle | Draws a rectangle, with an optional fill. |
| Triangle | Draws a triangle, with an optional fill. |
| Eraser | Erases parts of the drawing. |

## Brush and Eraser Settings

| Setting | Description |
| --- | --- |
| Brush Size | Small, Medium (default) or Large. |
| Color | Pick a color from the color bar, which shows up to seven preset colors plus a custom color. |
| Stroke Opacity | Opacity of the strokes the drawing tools make, from 0 to 1. Default 1. |
| Fill Opacity | Opacity of the fill for the Lasso, Ellipse, Rectangle and Triangle tools, from 0 to 1. Default 0.25. |
| Eraser Size | Small, Medium (default) or Large. The eraser has its own size, separate from the brush. |
| Eraser Opacity | How much one eraser stroke erases at most, from 0 to 1. Default 1. |
| Eraser Hardness | The part of the eraser's radius that erases at full opacity, from 0 to 1. Past it, the eraser fades to nothing at the edge. Default 1. |

> **tip:** Doodle remembers the tool and settings you last used.

## Saving and Sharing a Drawing

Use **Share** in the Doodle toolbox to keep the drawing. You can:

- **Save as PNG**: Saves the drawing as a PNG file. By default the file goes to the project's Saved/Doodles folder.

- **Save as Texture 2D**: Saves the drawing as a Texture 2D asset in your project.

- **Copy to clipboard**: Copies the drawing so you can paste it into another application.

- **Save to World Bookmark**: Saves the drawing with a new World Bookmark, so it reopens when you load the bookmark.

- **Add to Level Sequence**: Adds the drawing to the open Level Sequence as a new binding.

By default, captures include the viewport with the drawing on top. To capture only the drawing, turn off **Include Context In Capture** in the Doodle settings.

## Doodle Settings

To change Doodle's defaults, go to **Edit > Editor Preferences** and select **Doodle Editor**.

| Setting | Description |
| --- | --- |
| Include Context In Capture | Whether captures include the viewport with the drawing on top, or only the drawing. Enabled by default. |
| Capture Asset Output Path | Folder the save dialog for Texture 2D assets starts in. If empty, it starts in the last folder an asset was created in. |
| Capture PNG Output Path | Folder PNG files are saved to. If empty, PNGs are saved to the project's Saved/Doodles folder. |
| Colors | The preset colors shown in the color bar, up to seven. |

## Scripting Doodle

Python scripts can open a Doodle overlay and read, add, move or remove its marks through the **Doodle Script Subsystem**. AI agents that use the editor's scripting tools can call the same functions.

Points and sizes are in drawing units, with (0, 0) at the top-left corner. The level editor drawing is 1920 by 1080 units, fitted to the viewport. Each change is one undo step. The subsystem doesn't save the assets it changes. The add functions draw with a brush that sets the stroke size and color.

It includes the following functions:

| Function | Description |
| --- | --- |
| open_level_editor_overlay | Opens the Doodle overlay on the active level editor viewport, unless it's already open, and returns its drawing. |
| is_level_editor_overlay_open | Returns whether the Doodle overlay is open on the active level editor viewport. |
| get_level_editor_scene | Returns the drawing of the Doodle overlay on the active level editor viewport. Raises an error if the overlay isn't open. |
| get_scenes | Returns other drawings registered in a scope, such as the Doodle tracks of a Level Sequence. |
| get_scene_info | Returns the marks in a drawing. |
| add_line | Adds a straight line between two points. |
| add_arrow | Adds an arrow from a start point to an end point. With bidirectional on, the arrow has a head at both ends. |
| add_free_line | Adds a line through a list of points, like a pen stroke. A single point draws a dot. |
| add_lasso | Adds a closed shape through three or more points, with an optional fill. |
| add_rectangle | Adds a rectangle from its top-left corner and size, with an optional fill. |
| add_ellipse | Adds an ellipse from its center and its radius on each axis, with an optional fill. |
| add_triangle | Adds a triangle from its three corners, with an optional fill. |
| move_primitives | Moves marks by an offset and returns them. |
| remove_primitives | Removes marks from a drawing. |
| clear_scene | Removes every mark and erased part from a drawing. |
| get_objects_under_primitives | Returns the actors and components that appear under the given marks in the level editor viewport. An arrow also returns the objects it points at. |

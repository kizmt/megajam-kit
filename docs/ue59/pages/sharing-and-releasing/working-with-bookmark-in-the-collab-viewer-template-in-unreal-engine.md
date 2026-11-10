# Working with Bookmarks in the Collab Viewer Template

https://dev.epicgames.com/documentation/en-us/unreal-engine/working-with-bookmark-in-the-collab-viewer-template-in-unreal-engine?application_version=5.9

> Describes how to place Bookmarks in your Level to provide pre-set points of view, and how to assign those Bookmarks to hotkeys.

[image: Working with Bookmarks in the Collab Viewer Template]

The Collab Viewer offers a built-in type of Blueprint Asset called a **BP_Bookmark**, which you can use to set up predetermined locations and camera views in your Level. Users can easily teleport to these predetermined locations at runtime.

This page explains how to place new Bookmarks into your Level, and how to set up hotkeys that teleport the user between different Bookmarks when they press number keys on the keyboard.

## Placing a Bookmark

You can place new Bookmarks anywhere in your Level. However, it's best to make sure that each new Bookmark is:

- At ground level.

- Immediately above a Static Mesh that has a Collision Mesh set up for it, as instructed in Adding Your Own Content to the Collab Viewer (-> adding-your-own-content-to-the-collab-viewer-in-unreal-engine).

Otherwise, if the user is in Walk mode or in VR, they may fall to the ground or through the ground after the teleport.

### Steps

To place a Bookmark:

- Each Bookmark is represented in the Level by an instance of the **BP_Bookmark** Blueprint class. You'll find this class in the CollaborativeViewer/Blueprints/Commands/Bookmark/BPs folder of the **Content Browser**. [image: BP_Bookmark Asset]

- To set up a new Bookmark, drag the **BP_Bookmark** from the **Content Browser** into your Level. [image: Drag a Bookmark into the Level]

- Select the Bookmark Actor in the Viewport or the **Outliner** and move it to the position and rotation that you want it in the Level. Make sure you're moving the Bookmark Actor, and not just its child Camera Component. **Piloting** the Actor is a fast and easy way to set its viewpoint the way you want it. See Pilot Actors in the Viewport (-> using-editor-viewports-in-unreal-engine).

- In the **Details** panel, find the **Hotkey** setting in the **~ Bookmarks** section, and set the hotkey that you want to assign to the new Bookmark. You can enter the number you want to assign directly in the **Hotkey** field, or use the **Assign Unused Hotkey** button to assign the Bookmark the lowest available numeric key.

### End Result

Users who join the session in desktop mode can teleport to your bookmark location by pressing the hotkey you assigned, by using the Bookmarks menu in the toolbar, or by using the **Bookmark** item in the Interaction Menu.

See also Interacting with the Collab Viewer Template (-> interacting-with-the-collab-viewer-in-unreal-engine).

## Saving Bookmarks during a Session

During a session in the Collab Viewer, you can record your current position as a new bookmark. The new bookmark will then appear in the Bookmark menu list as an option, and it will be saved and available on reload.

To save a bookmark:

- Move to the location where you want to save a bookmark.

- Open the **Interaction** menu, and select **Bookmark**.

- In the **Bookmark** menu, select **Create Bookmark**. [image: Create bookmark in the interaction menu]

- Give your new Bookmark a name, and click the **+Add** button. [image: Name and save a bookmark]

- You can delete saved Bookmarks by clicking the **bin** icon next to a saved Bookmark in the **Create Bookmark** menu.

- collaboration
- templates
- collab viewer
- design review
- ar/vr/xr

On this page

- Placing a Bookmark (-> working-with-bookmark-in-the-collab-viewer-template-in-unreal-engine)
- Steps (-> working-with-bookmark-in-the-collab-viewer-template-in-unreal-engine)
- End Result (-> working-with-bookmark-in-the-collab-viewer-template-in-unreal-engine)
- Saving Bookmarks during a Session (-> working-with-bookmark-in-the-collab-viewer-template-in-unreal-engine)

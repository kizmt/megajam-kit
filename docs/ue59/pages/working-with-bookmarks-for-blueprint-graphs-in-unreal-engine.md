# Blueprint Bookmarks

https://dev.epicgames.com/documentation/en-us/unreal-engine/working-with-bookmarks-for-blueprint-graphs-in-unreal-engine?application_version=5.9

> Product documentation including reference and guides for Unreal Engine 4

With **Blueprint Bookmarks** you can create named Bookmarks in any function graph in the Blueprint Editor. This bookmark will capture the position and zoom level of the Viewport and the active tab you were viewing when you created the bookmark. Bookmarks are stored locally on your machine, so they won't affect the Blueprint itself, and syncing your content will not overwrite your Bookmarks with another user's Bookmarks.

## Creating Bookmarks

To create a Blueprint Bookmark:

- With the Graph and Zoom position you wish to Bookmark, click the **Star** icon in the upper-left of the graph.

- In the **New Bookmark **dialog box, enter your desired name and click the **Add **button.

## Viewing and Using Bookmarks

To view or use a previously created Bookmark, select the **Bookmarks** option from the **Window** menu.

This will open the **Bookmarks** menu that displays all the Bookmarks for the current asset as well as any Comment Nodes (-> comments-in-unreal-engine).

In the Bookmarks window, clicking the **Eye** icon in the upper-right corner will expand additional options. Disabling **Show Comment Blocks** removes Comment Nodes from being displayed in the menu.

Enabling **Show Bookmarks for Current Graph Only** will show Bookmarks for your active Graph, while disabling it will show all Bookmarks for the asset while on any Graph.

For Bookmarks displayed in the window, you can right-click on a Bookmark (or Comment) to expand additional options.

The right-click context menu enables you to **Delete** or **Rename** Bookmarks, as well as to jump directly to the selected Bookmark (or Comment).

Double-click on a Bookmark or Comment Node block to jump to that section of your Graph.

When jumping to a Bookmark, the **Star** icon in the upper-left of the Graph will also be filled indicating you are at the Bookmark.

## Quick Jump Bookmarks

In addition to creating **Bookmarks**, you can create a **Quick Jump Bookmark**, similarly to how Bookmarks work in the Level Editor Viewport. As with labeled Bookmarks in the Blueprint Editor, Quick Jump Bookmarks will persist across Editor sessions and are local to the user and machine where they were created.

To assign and use a Quick Jump Bookmark:

- With a Graph open, press **Ctrl + 0-9** (any number key) to remember your current Blueprint, Graph location and Zoom level.

- Inside any Graph, press **Shift + 0-9** (the same number from previous step) to return to that Blueprint, Graph location and Zoom level.

Quick Jump Bookmarks do not require you to have the asset open. They will automatically open the asset, Graph location and Zoom level (as shown in the example video below).

As of 4.21, Quick Jump Bookmarks are currently not displayed in the Bookmarks window.

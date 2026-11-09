# Content Browser Settings Reference

https://dev.epicgames.com/documentation/en-us/unreal-engine/content-browser-settings-in-unreal-engine?application_version=5.9

> Adjust thumbnail display, Asset filtering, and other areas of the Content Browser.

[image: Content Browser Settings Reference]

The **Settings** button is located in the top-right corner of the **Content Browser**. Clicking it opens a menu where you can adjust various settings for the current instance of the Content Browser, such as:

- View type (how Assets are displayed: Tiles, Lists, or Columns).

- Search filters.

- Content to include or exclude.

- Search options.

 [image: Settings menu in the Content Browser]

## View Type

These settings affect how Assets in the Asset View are displayed. You can choose one of the following View Types:

### Tiles

The **Tiles** view lays out all Assets into a grid of tiles, like so:

 [image: Asset View using the Tiles view]

### List

The **List** view lays out all Assets into a list of thumbnails with names and file types, like so:

 [image: Asset View using the List view]

### Columns

The **Columns **view lays out all Assets with a spreadsheet-like arrangement of properties, like so:

 [image: Asset View using the Columns view]

The details displayed change depending on the type of Asset. For example, Blueprint Assets display their Type and Parent Class, and Static Meshes display their vertices and triangles counts.

You can perform the following operations on each column:

- Sort the Assets by the column's value in ascending or descending order by left-clicking the column name.

- Hide a column by hovering over its name, then clicking the vertical ellipsis menu and selecting **Hide Column**.

- Unhide columns from the **Settings** menu by selecting the **Toggle Columns** option and enabling the columns you want to display.

You can also export all of the Asset details as a `.csv` file. From the **Settings** menu, select the **Export to CSV** option. Note that this option only displays if the Asset Viewer is currently using the Columns view.

## Locking

The **Lock Content Browser** option is a toggleable setting. If enabled, this instance of the Content Browser will ignore Find in Content Browser requests.

## View

Use the **View** settings to toggle what displays in the Content Browser, as well as filtering behavior.

| **Option** | **Description** |
| --- | --- |
| **Show Folders** | Disable this option to have the Content Browser show all Assets in the project in a single view. Disable the **Show Empty Folders** sub-option to have the Content Browser show only folders that contain at least one Asset. |
| **Show Empty Folders** | Disable this option to have the Content Browser hide empty folders. |
| **Show Favorites** | Enabling this option adds a new **Favorites** category at the top of the Sources panel. This category displays if you have added at least one folder or Asset to your Favorites. To add a folder or Asset to your Favorites, right-click it, then select **Add To Favorites** from the context menu. |
| **Filter Recursively** | Toggle this option to control whether Asset View filters should apply recursively. |
| **Show All Folder** | Toggles the visibility of the `All` folder in the Sources Panel folder hierarchy. If disabled, the folder hierarchy will move one level up. |
| **Organize Folders** | Enable this option to organize folders automatically in the Content Browser's **Asset** view. |
| **Path View Filters** | Toggles options that affect the **Path View** in the Content Browser. This option is useful when working with large-scale projects that use content from multiple sources. |
| **Show Sources Panel** | Toggle this option to show or hide the Sources panel. |

### Content

Toggle the following options to control whether or not certain types of Assets display in the Asset View.

| **Option** | **Description** |
| --- | --- |
| **Show C++ Classes** | If enabled, shows the `Engine C++ Classes` folder in the Sources panel. This folder contains a browseable hierarchy of all C++ classes in Unreal Engine. |
| **Show Developers Content** | If enabled, shows the `Developers` folder in the Sources panel. This folder is used to collaborate with other developers on multi-user projects. |
| **Show Engine Content** | If enabled, shows the `Engine Content` folder in the Sources panel. This folder contains a collection of Unreal Engine stock Assets with various contents and functionality. |
| **Show Plugin Content** | If enabled, plugin-specific content will display in the Content Browser. |
| **Show Localized Content** | If enabled, localized content will display in the Content Browser. |

## Search

Use the **Search** options to control what gets included or excluded from searches performed within the Content Browser:

- Asset class names

- Asset paths

- Collection names

### Thumbnails

Use the **Thumbnail** options to control how thumbnails are generated and displayed.

| **Option** | **Description** |
| --- | --- |
| **Thumbnail Size** | Choose from one of the five possible sizes for thumbnails that display in the Asset View: Tiny Small Medium Large Huge |
| **Thumbnail Edit Mode** | If enabled, you can adjust the thumbnails of 3D Assets by left-clicking and dragging inside the thumbnail. When you are finished, click the Done Editing button to save your changes. To revert your changes, click the Undo button in the top-right corner of the thumbnail. [image: Editing an Asset's thumbnail from the Content Browser] You must save your Asset to save the changes you made to its thumbnail. / |
| **Real-Time Thumbnails** | If enabled, Asset thumbnails are rendered in real time. |

## Content Browser Editor Preferences

You can adjust further settings that affect the Content Browser from the Editor Preferences (-> unreal-editor-preferences) (menu: **Edit > Editor Preferences**, then select the **Content Browser** section).

| **Setting** | **Description** |
| --- | --- |
| **Assets to Load at Once Before Warning** | The number of Assets that can be loaded simultaneously in the Content Browser before Unreal Engine shows a warning. |
| **Open Sources Panel by Default** | If enabled, the Content Browser will open the Sources Panel by default. |
| **Number of Assets to Keep in the Recently Opened Filter** | The number of Assets that will be displayed by the Recently Opened filter in the Asset View. |
| **Enable Realtime Material Instance Thumbnails** | If enabled, Material instance thumbnails will be rendered in real time. |

- content browser

On this page

- View Type (-> content-browser-settings-in-unreal-engine)
- Tiles (-> content-browser-settings-in-unreal-engine)
- List (-> content-browser-settings-in-unreal-engine)
- Columns (-> content-browser-settings-in-unreal-engine)
- Locking (-> content-browser-settings-in-unreal-engine)
- View (-> content-browser-settings-in-unreal-engine)
- Content (-> content-browser-settings-in-unreal-engine)
- Search (-> content-browser-settings-in-unreal-engine)
- Thumbnails (-> content-browser-settings-in-unreal-engine)
- Content Browser Editor Preferences (-> content-browser-settings-in-unreal-engine)

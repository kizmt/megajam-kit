# Content Browser Interface

https://dev.epicgames.com/documentation/en-us/unreal-engine/content-browser-interface-in-unreal-engine?application_version=5.9

> Describes the Content Browser interface and functionality.

[image: Content Browser Interface]

The **Content Browser** is divided into the following areas:

 [image: Areas of the Content Browser window]

| ***Number** | **Name** |
| --- | --- |
| 1 | Navigation Bar |
| 2 | Sources Panel |
| 3 | Collections |
| 4 | Filters |
| 5 | Search Bar |
| 6 | Asset View |
| 7 | Settings Button |

## Navigation Bar

The **Navigation Bar** contains controls for working with Assets, navigating back and forward between folder paths, and shows a breadcrumb trail path for the folder that is currently open.

 [image: Navigation Bar in the Content Browser]

| **Number** | **Name** | **Description** |
| --- | --- | --- |
| 1 | **Asset Control Buttons** | These buttons have the following functionality: **Add**: Click this button to add existing Assets to your project or create a new Asset. **Import**: Click this button to open a file browser and select one or more Assets to add to your project. **Save All**: Click this button to save all Assets that have unsaved changes. To learn more about importing Assets to your project, refer to the Importing Assets Directly (-> importing-assets-directly-into-unreal-engine) page. |
| 2 | **History Back and Forward Buttons** | These buttons function like the Back and Forward buttons in a web browser. Use them to navigate back and forward between recent file paths. |
| 3 | **Breadcrumb Trail Path** | This section shows the current folder path. Click any folder to quickly navigate to it. |

## Sources Panel

The **Sources** panel contains a list of all folders inside your Unreal Engine project.

 [image: Sources Panel in the Content Browser]

| **Number** | **Name** | **Description** |
| --- | --- | --- |
| 1 | **Favorites Panel** | This panel contains references to Assets that you have added to your Favorites. |
| 2 | **Project Name** | This is the name of the project that is currently open. Click the arrow next to the project name to collapse or expand the folders list. |
| 3 | **Search Buttons** | Click this button to open the Search bar, which you can use to narrow down the list of available folders in the button's associated panel by entering search criteria. Folders are filtered down in real time to only those whose names include the characters you enter. |
| 4 | **Asset Tree** | This hierarchical list shows all folders in your Unreal Engine project. It behaves the same as the folder tree in Windows Explorer or the Finder in macOS. To expand or collapse a folder, click the arrow next to its name. You can exclude folders from the Asset Tree by prefixing the search text with a hyphen (-). For example, entering -anim in the Search box hides any folder whose name contains that string, such as Animation or Animator. |

For more information about the Sources panel, refer to the Sources Panel Reference (-> sources-panel-reference-in-unreal-engine) page.

## Collections

The **Collections** panel displays a list of all the Collections you have access to.

 [image: Sources Panel in the Content Browser]

| **Number** | **Name** | **Description** |
| --- | --- | --- |
| 1 | **Collapse / Expand Button** | Click this button to collapse or expand the Collections area. |
| 2 | **Add Collections Button** | Click this button to create a new Collection. |
| 3 | **Search Buttons** | Click this button to open the Search bar, which you can use to narrow down the list of available Collections by entering search criteria. Collections are filtered down in real time to only those whose names include the characters you enter. |
| 4 | **Collections List** | An alphabetical list of all Collections in this project. |
| 5 | **Asset Count** | Shows the number of Assets in each Collection. |

For more information on Collections and their use, refer to the Filters and Collections (-> filters-and-collections-in-unreal-engine) page.

## Filters Column

The **Filters** column contains all built-in and custom filters for the user that is currently logged in. Click a filter to enable or disable it.

 [image: Filters column in the Content Browser]

For more information on working with filters, refer to the Filters and Collections (-> filters-and-collections-in-unreal-engine) page.

## Search Bar

The **Search** bar provides a wide range of functionality for quickly locating Assets based on their name and type. The **Asset View**, which displays the contents of the folder you select in the **Sources** panel, updates dynamically based on the parameters you enter here.

 [image: Search bar in the Content Browser]

| **Number** | **Name** | **Description** |
| --- | --- | --- |
| 1 | **Filters Button** | Click this button to open the Filters menu, which you can use to customize the kinds of Assets that display in the Asset View. For more information on working with filters, refer to the Filters and Collections (-> filters-and-collections-in-unreal-engine) page. |
| 2 | **Search Bar** | Use the Search bar to search for Assets by name. Assets are filtered down in real time to only those whose names include the characters you enter. |
| 3 | **Save Search Button** | Click this button to save your current search as a new filter or Collection. This is useful if you want to run the same search again in the future. |
| 4 | **Previous Searches Button** | Click this button to see a list of previous searches. |

## Asset View

The **Asset View** shows all available Assets within the currently selected folder or Collection.

From the Asset View, you can:

- Drag and drop Assets directly into the Level.

- Create and import Assets from the **context menu** that opens when you right-click inside the Asset View.

- Create new folders.

 [image: Asset View in the Content Browser]

| **Number** | **Name** | **Description** |
| --- | --- | --- |
| 1 | **View Area** | This shows all of the Assets in the currently selected folders or Collections after all filters and search criteria have been applied. |
| 2 | **Asset Count** | Shows the current number of assets displayed once all filters and searches are applied. |

## Settings Button

 [image: Settings button in the Content Browser]

This button opens the **Settings** menu, where you can adjust the following settings for the Content Browser:

- View style (how Assets are displayed: Tiles, Lists, or Columns).

- Search filters.

- Content to include or exclude.

- Search options.

For more information, refer to the Content Browser Settings Reference (-> content-browser-settings-in-unreal-engine) page.

- content browser

On this page

- Navigation Bar (-> content-browser-interface-in-unreal-engine)
- Sources Panel (-> content-browser-interface-in-unreal-engine)
- Collections (-> content-browser-interface-in-unreal-engine)
- Filters Column (-> content-browser-interface-in-unreal-engine)
- Search Bar (-> content-browser-interface-in-unreal-engine)
- Asset View (-> content-browser-interface-in-unreal-engine)
- Settings Button (-> content-browser-interface-in-unreal-engine)

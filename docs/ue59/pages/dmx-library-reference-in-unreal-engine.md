# DMX Library Reference

https://dev.epicgames.com/documentation/en-us/unreal-engine/dmx-library-reference-in-unreal-engine?application_version=5.9

> Describes the DMX library and patching interfaces.

To use the DMX Library asset, you must first enable the DMX plugins (-> dmx-quick-start-in-unreal-engine).

The DMX Library asset is the main DMX plugin data structure that holds the following information:

- Controllers

- Fixture Types

- Fixture Patches

The DMX Library asset is under **DMX** > **DMX Library** when navigating the asset creation menu.

When you open a DMX Library from the Content Drawer, a window appears with a navigation bar and three tabs: the Library Settings tab, the Fixture Types tab, and the Fixture Patch tab.

 [image: The navigation bar and the three tabs for a DMX Library.]

## Navigation bar

The **Navigation Bar** contains controls for saving, browsing assets, and importing and exporting MVR files.

 [image: The 3 sections of the navigation bar.]

| Number | Name | Description |
| --- | --- | --- |
| 1 | **Save** | Saves changes made to the DMX library. |
| 2 | **Browse** | Opens the **Content Browser** and selects the DMX Library asset. |
| 3 | **Import** and **Export** | These buttons have the following functionality: **Import**: Imports a DMX Library from an MVR file. **Export**: Exports the DMX Library to an MVR file. |

## Library Settings

In the library settings, you can enable or disable input and output ports. To update other DMX port settings, select **Open DMX Project Settings**.

 [image: The library settings.]

## Fixture Types

In the Fixture Types tab, you can create and update Fixture Types, including their modes and functions.

 [image: The six areas of the Fixture Types tab.]

| Number | Name | Description |
| --- | --- | --- |
| 1 | **Fixture Type** list | A list for creating and organizing Fixture Types. |
| 2 | **Fixture Settings** | Fixture settings and imported Fixture data from GDTF. |
| 3 | **Mode** list | A list for creating and organizing Modes. |
| 4 | **Mode Settings** | Properties and settings for the selected Mode. |
| 5 | **Function** list | A list of attributes and functions. |
| 6 | **Function Settings** | Protocol settings for the selected Function, such as bit depth and channel assignment. |

## Fixture Patch

The Fixture Patch tab is divided into the following areas:

 [image: The three areas of the Fixture Patch tab.]

| Number | Name | Description |
| --- | --- | --- |
| 1 | **Fixture List** | A list of all Fixture Patches. |
| 2 | **Patcher Tool** | A visual representation of Patch locations per Universe. |
| 3 | **Fixture Patch** panel | Details about the selected Fixture Patch. |

### Fixture List

The Fixture List has the following columns:

![The Fixture List columns.]](fixture-list.png)

- **Fixture Patch**: The name of the Patch.

- **FID**: The Fixture ID. Each fixture should use its own FID.

- **Fixture Type**: The fixture type the Patch is based on.

- **Mode**: The mode of the fixture type the Patch uses.

- **Patch**: The Universe and first channel of the Patch. (For example, 2.1 * means Universe 2, Channel 1.)

The Fixture List has a context menu with the following options.

 [image: The context menu for the Fixture List.]

| Action | Description |
| --- | --- |
| **Cut** | Cuts the selected Patch. |
| **Copy** | Copies the selected Patch. |
| **Paste** | Pastes the cut or copied Patch in the first free channel, starting in the select Universe. |
| **Duplicate** | Creates a copy of the selected Patch in the first free channel, starting in the selected Universe. |
| **Auto-assign in selected universe** | Assigns selected Patches to the first free channels, starting in the selected Universe. |

### Patch Window

The Patch Window includes the following options.

 [image: The options for the Patch Window.]

- **Local Universe**: The currently selected Universe.

- **Show all patches in Universes**: When this option is enabled, the Patcher displays all Patches in the library instead of showing a specific selection.

- **Monitor DMX inputs**: When this option is enabled, the Patcher monitors inbound DMX.

The Patch Window has a context menu with the following options.

 [image: The context menu for the Patch Window.]

| Action | Description |
| --- | --- |
| **Auto-assign in selected universe** | Assigns a Patch to the first free channels, starting from the selected Universe. |
| **Auto-assign at [Universe.Channel]** | Assigns a Patch to the first free channels, starting from the right-clicked channel. |
| **Assign at [Universe.Channel]** | Assigns a Patch to the right-clicked channel, regardless if the channel range is already occupied. |
| **Align** (multi-selection only) | Aligns all selected Patches one after another. |
| **Stack** (multi-selection only) | Stacks all selected Patches on top of each other. |
| **Spread over Universes** (multi-selection only) | Puts each Patch into its own Universe. |

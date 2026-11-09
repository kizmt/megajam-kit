# Migrating Assets

https://dev.epicgames.com/documentation/en-us/unreal-engine/migrating-assets-in-unreal-engine?application_version=5.9

> How to copy Assets from one project to another.

[image: Migrating Assets]

If you want to use the same Assets across multiple projects, use the **Migrate tool** to copy the Assets, along with their references and dependencies. For example, if you migrate a Material, any Texture Assets that define that Material will automatically be copied along with it. This is useful when you need to merge or fork projects, or when transitioning from a test environment into a production project.

To use the Migrate tool, follow these steps:

- From the **Content Browser**, select the Asset or Assets you want to migrate. To select multiple Assets, hold down **Ctrl **and **left-click** each Asset you want to select. If you want to select a range of Assets, **left-click** the first one, then hold down **Shift** and **left-click** the last one. This selects all Assets between the fist and last one. [image: Selecting Assets to migrate from the Content Browser] In this example, we have selected four Material Assets.

- **Right-click** any of the selected Assets. From the context menu that appears, select **Asset Actions > Migrate**. This opens the **Asset Report** window, which shows all of the Assets that will be copied as part of the migration process. [image: Asset Report window] If you don't want to migrate an Asset in this list, uncheck the checkbox next to that Asset. Keep in mind, however, that this might break other Assets you are trying to migrate (for example, a Material will no longer show correctly if one of its Textures is missing).

- Click **OK** to confirm that you want to migrate the Assets. This will open a file browser window where you can select the project to migrate the Assets to (also known as the target project). [image: Selecting a destination folder] Select the `Content` folder in your target project, then click the **Select Folder** button.

- After you confirm the migration, a progress bar will appear to track the migration progress. If the target project's `Content` folder contains an Asset with the same name as an Asset you want to migrate, you will see the following warning: [image: An asset already exists at (location), would you like to overwrite it?] Click **Yes** to overwrite the Asset, or **No** to skip the Asset and continue migrating the others. You can also make this choice for all Assets by clicking **Yes All** or **No All**.

- Once the migration completes, you will see a dialog confirming that all Assets have been migrated. Click **Show Message Log** in this dialog to view a full list of migrated Assets. [image: A list of migrated Assets]

## Troubleshooting Asset Migration

If you attempt to migrate Assets into anything other than an Unreal project's `Content` folder, you will receive the following message:

"[file path] does not appear to be a game Content folder. Migrated content will only work properly if placed in a Content folder. Would you like to place your content here anyway?"

If you want to be able to use your migrated content in the target project right away, click **No**, then select that project's `Content` folder.

If an Asset doesn't display correctly after migration, make sure that you also migrated all of its dependencies. Check if the Asset displays correctly in the original project, then reattempt the migration and make sure all of the Asset's dependencies are selected in the **Asset Report** window.

-

On this page

- Troubleshooting Asset Migration (-> migrating-assets-in-unreal-engine)

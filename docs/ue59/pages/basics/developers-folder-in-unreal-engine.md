# Developers Folder

https://dev.epicgames.com/documentation/en-us/unreal-engine/developers-folder-in-unreal-engine?application_version=5.9

> Iterate and collaborate with other developers using the Developers folder.

[image: Developers Folder]

The **Developers** folder in the **Content Browser **is where you can duplicate and work on Assets without worrying about breaking things in your project. Use the Developers folder to experiment with different things, from small-scale Asset modification to project-wide refactors.

If you work in a shared project with other developers, each developer has their own folder.

The Developers folder uses the same name as your Windows username, but without characters that aren't allowed in Unreal Engine folder names, like periods or spaces.

Because the Developers folder is meant to act as a sandbox environment, you should never reference Assets from this folder anywhere outside this folder. Doing so can cause errors when cooking the project or cause cooking to fail.

## Enabling the Developers Folder

If you don't see the Developers folder in your Content Browser, follow these steps to enable it:

- In the **Content Browser**, click **Settings**.

- From the Settings menu, enable the **Show Developer Content** option.

Click the image for full size.

## Collaborating with Other Developers

If you use source control (-> source-control-in-unreal-engine), you can configure Unreal Engine to see Assets in other developers' folders. To do this, follow these steps:

Click the image for full size.

- In the **Content Browser**, click the **Filters** button.

- From the Filters menu, select **Other Filters > Other Developers**.

## Excluding the Developers Folder from Cooked Builds

If you want to make sure that you don't accidentally package broken or in-progress Assets, you can exclude the Developers folder from cooked builds.To do this, follow these steps:

Click the image for full size.

- From the main menu, go to **Edit > Project Settings** and search for the **Directories to never cook** array. You can find this array by using the **Search** box at the top of the section.

- Click the **Add (+)** button to add a new item to the array.

- Click **…** to open a list of folders in your project.

- Click the **Developers** folder to select it.

On this page

- Enabling the Developers Folder (-> developers-folder-in-unreal-engine)
- Collaborating with Other Developers (-> developers-folder-in-unreal-engine)
- Excluding the Developers Folder from Cooked Builds (-> developers-folder-in-unreal-engine)

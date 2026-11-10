# Working with Plugins

https://dev.epicgames.com/documentation/en-us/unreal-engine/working-with-plugins-in-unreal-engine?application_version=5.9

> Installing, enabling, and disabling plugins in Unreal Engine

[image: Working with Plugins]

A **plugin** is an optional software component that adds specific functionality to **Unreal Engine**. Plugins can add entirely new features and modify built-in functionality without modifying the Unreal Engine code directly. For example, a plugin might add new menu items and toolbar commands to the editor, or even add entirely new features and editor sub-modes.

You can enable or disable plugins independently for each project, depending on your needs.

There are two types of plugins available in Unreal Engine:

- Unreal Engine plugins.
- Third-party plugins.

## Accessing Plugins in Unreal Engine

Before you can use content from plugins in Unreal Engine, you must first make plugin content visible in the Content Drawer. Click the **gear icon** in the upper right corner of the Content Drawer to access the settings menu, and enable **Plugin Content**.

[image: Enable Plugin Content]

## Enabling a Plugin

To enable an Unreal Engine plugin, follow these steps:

- From the main menu, go to **Edit > Plugins**. This opens the **Plugins** window.[image: Plugins window in Unreal Engine 5] Plugins window in Unreal Engine 5.
- Find the plugin you want to enable using the list on the left of the screen. Alternatively, enter a term in the **Search** box to search for all plugin names and descriptions that contain this term.[image: Searching for a plugin by name] This example shows all search results for the term "xr". Note that the search term is highlighted everywhere it appears.
- To enable a plugin, click the checkbox next to it.[image: Enabling a plugin.] Enabling a plugin. For plugins that are not production-ready, such as beta plugins, you might see a warning asking you to confirm that you want to enable that plugin.
- Save your work, then restart Unreal Engine.

Third-party plugins might require additional steps before you can enable them. For more information, refer to the documentation for the third-party plugin you want to install. Note that Epic Games is not responsible for the contents of third-party plugins.

## Disabling a Plugin

To disable a plugin, follow these steps:

- From the main menu, go to **Edit > Plugins**. This opens the **Plugins** window.[image: Plugins window in Unreal Engine 5] Plugins window in Unreal Engine 5.
- Find the plugin you want to disable using the list on the left of the screen. Alternatively, enter a term in the **Search** box to search for all plugin names and descriptions that contain this term.[image: Searching for a plugin by name] This example shows all search results for the term "xr". Note that the search term is highlighted everywhere it appears.
- To disable a plugin, clear the checkbox next to it.[image: Disabling a plugin] Disabling a plugin. If the plugin you want to disable is a dependency for other plugins (that is, other plugins require it to function), you will see a notification asking you if you want to disable those plugins as well. Note that this might break existing functionality in your project if you used any of those plugins to implement it.
- Save your work, then restart Unreal Engine.

## Installing Plugins from Fab

While Unreal Engine contains plugins that offer many different kinds of functionality, you can also install additional plugins from Fab, using the methods described below. The examples shown here use the free glTF Exporter plugin by Epic Games.

### Downloading Plugins from Fab

You can browse and download plugins for Unreal Engine directly from the Fab site, or from the Fab tab in the Epic Games Launcher.

To download plugins from the site, follow these steps:

- Do either of the following: In the **Epic Games Launcher**, navigate to the **Fab** tab. [image: Fab in Launcher]
- Go to the Fab website.[image: Fab website]

- Search for the plugin you want to install and click the thumbnail to open the listing.[image: Searching for a plugin on Fab]

The next step depends on whether you selected a free plugin (-> working-with-plugins-in-unreal-engine) or a paid plugin (-> working-with-plugins-in-unreal-engine).

The following information is adapted from the Acquiring Products section of the Purchasing and Downloading Products page in the Fab documentation. Refer to that page for more information.

#### Free Plugin

To download a free plugin, follow these steps:

- On the plugin's listing click **Add to My Library**.[image: Adding a plugin to your library]
- Accept the Fab EULA.[image: Accept the Fab EULA]
- Your free plugin is now available in your Fab library on the Fab site and in the Epic Games launcher.[image: Plugin saved in my library notification]

#### Paid Plugin

To download a plugin for sale, follow these steps:

- Click the **Select a License** dropdown to view the available licenses. Select a license type if applicable. This can vary depending on the size of your organization.[image: Select a license]
- Select either **Buy now** or **Add to cart**.If you select Buy now, you are shown the checkout screen where you can pay for your selected plugin directly. Go to step 4.
- If you select Add to cart, your plugin is added to your cart. Continue to step 3.

- Click **View in cart**, then click the **Checkout** button to pay for your selections once you have all the plugins (and any other Fab products) you want to buy.[image: Checking out]
- Complete the checkout process, and you will see the same notification as for free plugins.[image: Plugin saved in my library notification]

#### Install your Plugin

After you have added your new plugin to your Fab library, you need to install it to Unreal Engine.

- Go to the Library tab in the launcher, then scroll down to the Fab Library section. Search for your new plugin, then click **Install to Engine**.[image: Install to Engine button for a plugin]If you can't find your new plugin, refresh the Fab Library.[image: Refresh the Fab Library]
- Select the engine version for the plugin installation, then click **Install**.[image: Selecting an Unreal Engine version]When installing a plugin or other asset, only supported versions of Unreal Engine are available, even if you have other Unreal Engine versions installed.
- After the installation completes, open the version of Unreal Engine you installed the plugin for, and **enable** the plugin following the instructions in the Enabling a Plugin (-> working-with-plugins-in-unreal-engine) section on this page.

### Downloading Plugins From Fab Inside Unreal Engine

You can download plugins (and other content) using the Fab plugin while you are working inside Unreal Engine. Before you can install additional plugins from Fab, you must first enable the Fab plugin (-> working-with-plugins-in-unreal-engine).

[image: Fab plugin in Unreal Engine]

After you install the plugin, you can access it from the following options in Unreal Engine:

- In the **Windows** menu, scroll down to the **Get Content** section and click **Fab**.[image: Fab in the Unreal Engine Windows menu]
- In the **Content Drawer**, click the **Fab** button right next to the **+Add** button.[image: Fab in the Content Drawer]

In the Fab window, you can search for and acquire plugins (both free or paid) in the same way as on the Fab site.

[image: Fab window in Unreal Engine]

Only plugins usable with Unreal Engine appear in the Fab window inside Unreal Engine. Content for other platforms is not available.

After you add a plugin to your library, you must download and install it to use it. To install your new plugin, quit out of Unreal Engine, and find the plugin in your Fab Library. Click **Install to Engine**, and proceed as previously described above.

[image: Install to Engine button for a plugin]

[image: Selecting an Unreal Engine version]

## Plugin Installation Locations

Unreal Engine stores all plugins at the following locations:

- `C:\Program Files\Epic Games\UE_[version]\Engine\Plugins` on Windows
- `/Users/Shared/Epic Games/UE_[version]/Engine/Plugins` on macOS

- plugins

On this page

- Accessing Plugins in Unreal Engine (-> working-with-plugins-in-unreal-engine)
- Enabling a Plugin (-> working-with-plugins-in-unreal-engine)
- Disabling a Plugin (-> working-with-plugins-in-unreal-engine)
- Installing Plugins from Fab (-> working-with-plugins-in-unreal-engine)
- Downloading Plugins from Fab (-> working-with-plugins-in-unreal-engine)
- Free Plugin (-> working-with-plugins-in-unreal-engine)
- Paid Plugin (-> working-with-plugins-in-unreal-engine)
- Install your Plugin (-> working-with-plugins-in-unreal-engine)
- Downloading Plugins From Fab Inside Unreal Engine (-> working-with-plugins-in-unreal-engine)
- Plugin Installation Locations (-> working-with-plugins-in-unreal-engine)

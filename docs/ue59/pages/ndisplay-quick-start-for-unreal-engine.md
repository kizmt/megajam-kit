# nDisplay Quick Start

https://dev.epicgames.com/documentation/en-us/unreal-engine/ndisplay-quick-start-for-unreal-engine?application_version=5.9

> A guide to your first steps getting up and running with nDisplay.

[image: nDisplay Quick Start]

This page describes how to get up and running with nDisplay for the first time.

**Prerequisites:**

- Make sure you have your physical equipment — screens, projectors, and so on — set up and working correctly.

- Make sure that the Windows account you intend to use on the primary computer has administrative rights on all computers you intend to use in the nDisplay network.

- Make sure that all computers you want to use in the nDisplay network can receive TCP/IP communications over ports 41000, 41001, 41002, and 41003. (You can use different ports instead; see Changing nDisplay Communication Ports (-> changing-ndisplay-communication-ports-in-unreal-engine).)

## Step 1 - Set Up Your Project for nDisplay

The easiest way to get a Project setup to use nDisplay is to create it from the nDisplay Template Project (-> ndisplay-template-in-unreal-engine). You'll find this Template in the Film, Television, and Live Events category in the New Project window.

Click image for full view.

This Template automatically enables the nDisplay and Switchboard plugins, configures some helpful additional settings, and includes some sample configuration assets.

This guide uses the **NDC_Basic** nDisplay Config Asset to show how to launch nDisplay with one Cluster Node and one Viewport.

If you have an existing Project that you want to use with nDisplay, you can do the same configuration by hand. See Adding nDisplay to an Existing Project (-> adding-ndisplay-to-an-existing-project-in-unreal-engine).

## Step 2 - Set up the Configuration File

The template project already includes an nDisplay Root Actor for the NDC_Basic configuration. Select the actor and move it around the scene to preview it in the nDisplay cluster configuration. This real-time config preview is meant to be a replica of your nDisplay setup that you can preview in any level or project.

To preview other nDisplay Configurations, you can drag the nDisplay Config asset from the **Content Browser** into the **Viewport**.

## Step 3 - Package and Deploy

A core concept with nDisplay is that it does not run in the Editor. Instead nDisplay runs as a separate instance of Unreal Engine launched with Switchboard (-> switchboard-in-unreal-engine). Switchboard and its companion application SwitchboardListener also run outside of Unreal Engine.

These examples do not use the loopback address 127.0.0.1, because its use cannot be combined with other non-loopback addresses, such as those belonging to other machines, in the same Switchboard configuration. Loopback may be used, but only in a simple configuration where it is the only address used, and every device is local to the machine running Switchboard. Mixing loopback and non-loopback addresses in a multi-machine setup leads to connectivity errors.

Follow these steps to launch your nDisplay cluster.

- In the **Toolbar**, click the dropdown arrow next to **Switchboard** and choose **Launch SwitchboardListener**. SwitchboardListener launches and immediately minimizes itself. SwitchboardListener needs to be launched on every computer that will be in the nDisplay cluster. [image: Switchboard menu options in the toolbar] If you don't see the Switchboard options in the Toolbar, click the double right arrow to see more options. [image: Switchboard menu options under the toolbar arrow]

- In the **Toolbar**, click the **Switchboard** button to launch the Switchboard application on your computer. [image: Launch Switchboard button in the toolbar] When launching Switchboard for the first time, a command prompt window may appear, installing required dependencies before the Switchboard window opens.

- When Switchboard opens, the **Add new Switchboard Configuration** window appears. In the window, ensure the **Config Path**, **uProject**, and **Engine Dir** fields are correct, and click **OK** to open a blank configuration. [image: Add new Switchboard Configuration window] Switchboard Configurations are a collection of settings for Switchboard and are saved to disk. They can be reloaded and switched out at any time. Typically, you will want to create a Switchboard Configuration per project.

- In Switchboard, click **Add Device** in the top left and choose **nDisplay** to open the **Add nDisplay Device** window. [image: Add Device and choose nDisplay]

- Browse and select the **NDC_Basic.uasset** configuration file in your project, and click **OK** to add all the nDisplay devices described in the configuration asset to Switchboard.

- Since only one nDisplay Cluster Node is specified in the configuration asset, only one nDisplay device appears in Switchboard under **nDisplay Devices**. Set the IP address to your computer's external IP address. You must use your computer's external IP address instead of the default localhost IP address 127.0.0.1, if you want to add more computers to your nDisplay cluster later, because you cannot use both loopback and non-loopback addresses in a multi-machine setup. These steps use the IP address 192.0.2.0 as an example. [image: Switchboard showing one nDisplay Cluster Node]

- Click the **Connect to listener** button to connect to the SwitchboardListener on the computer. [image: Connect to SwitchboardListener]

- Click the **Start Unreal** button launch Unreal with the nDisplay renderer on the computer. [image: Click arrow button to launch the nDisplay instance]

- When the nDisplay instance launches, all other windows on the computer minimize and the nDisplay viewport appears on the desktop.

The default Switchboard launch mechanism described above uses -game mode. You can also work with cooked builds. This will require you to specify the file path of the cooked executable instead of the uproject file.

When working with cooked builds, you must update Switchboard settings to include the path of the .exe file and empty the UProject path. This tells Switchboard to ignore project location and use the cooked .exe file instead.

 [image: Path to a cooked build]

## Step 4 - On Your Own

This guide covered setting up and launching one nDisplay cluster node on one computer with Switchboard.

- Use the other nDisplay configurations available in the nDisplay Template (-> ndisplay-template-in-unreal-engine) to see how to set up nDisplay on multiple machines. Ensure you have SwitchboardListener running on every machine, to connect to them from Switchboard.

- To create a seamless view across multiple displays, see Synchronization in nDisplay (-> synchronization-in-ndisplay-in-unreal-engine) for information on setting up display sync and genlock on the machines.

- To use a tracking system with your nDisplay cluster, you must add a LiveLinkComponent to your Cluster configuration. See Live Link (-> live-link-in-unreal-engine) for more.

- getting started
- rendering
- vfx
- graphics
- ndisplay

On this page

- Step 1 - Set Up Your Project for nDisplay (-> ndisplay-quick-start-for-unreal-engine)
- Step 2 - Set up the Configuration File (-> ndisplay-quick-start-for-unreal-engine)
- Step 3 - Package and Deploy (-> ndisplay-quick-start-for-unreal-engine)
- Step 4 - On Your Own (-> ndisplay-quick-start-for-unreal-engine)

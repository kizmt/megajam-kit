# SteamVR Quick Start

https://dev.epicgames.com/documentation/en-us/unreal-engine/steamvr-quick-start-in-unreal-engine?application_version=5.9

> Instructions on how to quickly setup and deploy projects for use with SteamVR.

## Goals

The SteamVR Quick Start will walk you through How To setup your Unreal Engine 4 (UE4) project to work with and SteamVR and the Vive Head Mounted Display (HMD) headset.

## Objectives

- Create a new UE4 project that is targeted towards SteamVR development.

- Setting the required project settings so your project can be used with SteamVR.

## 1 - SteamVR Initial Setup

In the following section, we will take a look at how to get SteamVR setup so that it will work with Unreal Engine (UE).

### Steps

With each SteamVR development kit, Valve has provided detailed instructions that will show you how to correctly set everything up. If you have not read this document, please do so before going any further as the following information is not a substitute for the information contained in the document created by Valve.

- Ensure that the Vive Head Mounted Display (HMD), Steam Controllers, Breakout Box, and Lighthouse Base stations are all unpacked, powered on, connected and setup according to the instructions provided by Valve.

- If you have not done so already, make sure to download and install the Steam Client on your development PC.

- To install the **SteamVR** tools, use your mouse to hover over the Steam **Library** option and from the menu that is displayed, select the **Tools** option.

- Once you are in the Tools section, search for **SteamVR** using the search bar at the top. Once SteamVR is located, double-click on it to download and install it. Click for full image. You can also install SteamVR by clicking on the **VR** icon that is located on the upper right-hand corner of the Steam Client and following the provided instructions.

- Double-clicking on the **SteamVR** option in the Tools menu will launch the SteamVR tools as shown in the image below. When SteamVR shows all devices in green (like in the image above) that means everything is working correctly. If a device shows up in gray then there is a problem with that device. SteamVR will tell you what is wrong with a grayed out device if you hover your mouse over it.

- Before you can use SteamVR with UE4, you must set up the SteamVR interaction area. To do this, right-click on the SteamVR window and select the **Run Room Setup** and follow the on-screen directions to set up the SteamVR interaction area.

### End Result

When completed you will now have SteamVR setup and ready to be used with UE.

## 2 - Setting up UE to work with SteamVR

In the following section, we will go over How To set up a new Unreal Engine (UE) project to work with SteamVR.

### Steps

If you have not done so already, make sure to run the SteamVR **Room Setup** to establish and calibrate the VR tracking area. Failing to do this could result in SteamVR and UE4 not working correctly together.

- Create a new Project from the **Games > Blank** template, with the following settings:

 **Blueprint** enabled
 **Scalable 3D or 2D** enabled
 **Mobile / Tablet** enabled
 **No Starter Content** enabled

- Once the project loads, click on the small triangle next to the **Play** button and then from the menu that is displayed, select the **VR Preview** option.

### End Result

When the VR Preview launches, put on your HMD and you should now see the basic level being displayed. You should also have the ability to rotate your head around in any direction like in the video below.

## 3 - On Your Own!

Now that you can view a UE project using SteamVR and the HTC Vive, try adding the following items to your project.

- Use the Migrate Tool (-> migrating-assets-in-unreal-engine) to move content from one of the mobile content examples into your project for use.

- Add support for Motion Controllers (-> motion-controller-component-setup-in-unreal-engine) so that the user can move objects around in VR just like they would in real life.

- Use the Render Resource Viewer (-> render-resource-viewer-in-unreal-engine) to help track your project's performance while you are building it.

Here are some additional resources that provide useful information for developing VR projects inside of Unreal Engine.

### Documentation

- Virtual Reality Development (-> developing-for-xr-experiences-in-unreal-engine) VR Cheat Sheet (-> xr-best-practices-in-unreal-engine)

- SteamVR Best Practices (-> xr-best-practices-in-unreal-engine)

- SteamVR Documentation User Guide

- Developer Guide

### Content to Try

|  |  |
| --- | --- |
|  |  |
| CouchKnights | Showdown |
|  |  |
| VR Mode |  |

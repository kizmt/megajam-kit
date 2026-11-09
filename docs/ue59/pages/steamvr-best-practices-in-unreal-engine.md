# SteamVR Best Practices

https://dev.epicgames.com/documentation/en-us/unreal-engine/steamvr-best-practices-in-unreal-engine?application_version=5.9

> An introduction to getting started with SteamVR

The SteamVR SDK is unlike other Unreal Engine (UE) Virtual Reality SDKs as it is not bound to be used with a particular Head Mounted Display (HMD). Because of this UE projects that are developed for SteamVR can be used with any HMD that supports SteamVR. The following guide will help to highlight some information that you need to know about when developing content for SteamVR and UE.

## SteamVR Beta

To make sure that you have the most up to date version of SteamVR installed, make sure that you opted into the SteamVR Beta by right-clicking on the SteamVR Tool and going to **Properties** > **Betas** and then select the **beta - SteamVR Beta Update** option.

## SteamVR HMD Target Frame Rate

Below you will find the frame rate that your UE project must meet when using SteamVR.

| HMD Device | Target Frame Rate |
| --- | --- |
| **HTC Vive** | 90 FPS |
| **Oculus Rift** | 90 FPS |

## SteamVR Sanity Check

Unreal Engine will automatically use SteamVR if a supported HMD is plugged in and the SteamVR plug-in is enabled. If for some reason SteamVR is not working first check that the SteamVR plug-in is enabled. You can find the SteamVR plugin under the **Virtual Reality** section in the Plug-in (-> plugins-in-unreal-engine) menu.

Click for full image.

## Checking Work With SteamVR

SteamVR will not work with any of the UE Editor viewports or the default Play In Editor (PIE) session. To view your project with SteamVR, you will need to use the **VR Preview** option. To access the VR Preview option, you will need to do the following inside the UE Editor:

- On the main Toolbar in the **Play** section, click on the small white triangle that is next to the Play button.

- From the drop-down menu, select the **VR Preview** option and then put your Rift on to view your project in VR. Once you have changed the play mode to the VR Preview option, your project will always launch in VR, even when using shortcuts like **ALT + P**.

## SteamVR Mirror Mode

The SteamVR Headset Mirror enables you to see what the user sees in the HMD. Enabling this mode is particularly useful if you need to record what you are seeing in your UE project and the SteamVR compositor. To enable the mirror, you will need to do the following:

- First, locate the SteamVR Tools and then right-click on them to display the menu and select the **Display Mirror** option.

- The mirror will then be displayed in a new window called **Headset Mirror**, like in the image below. The above image shows exactly what the user would be seeing inside their HMD.

## SteamVR Developer Links

The following is a collection of links that will provide useful information on items such as hardware or software issues with SteamVR.

- SteamVR Developer Support

- HTC Vive Developer Support

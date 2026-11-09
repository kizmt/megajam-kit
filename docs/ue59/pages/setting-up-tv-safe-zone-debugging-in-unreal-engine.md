# Setting Up TV Safe Zone Debugging

https://dev.epicgames.com/documentation/en-us/unreal-engine/setting-up-tv-safe-zone-debugging-in-unreal-engine?application_version=5.9

> How to use TV Safe Zone Debugging tool for working on UI

[image: Setting Up TV Safe Zone Debugging]

During working on UI for **Unreal Engine** (UE) projects, it's important to avoid placing UI elements (text or widgets) too close to the edges of the screen.
If you place UI elements near edge of the screen, it can cause them to be distorted depends on device.
Use **TV Safe Zone Debugging** tool for ensure that UI items are located as you need.
Get familiar with this document for understanding how to use TV Safe Zone Debugging tool in UE projects.

## What are TV Safe Zones

A TV Safe Zone or Safe Area is the term used in television production to describe the area of the television picture that ensures the content can be cleanly viewed by a majority of TV viewers.
Generally speaking, the most important content for a TV show will be placed in this area to ensure that it will not be distorted when viewed on a wide range of TV sets.

You can read more about TV Safe Zones and Safe Areas on the following Wikipedia page: TV Safe area.

## Difference between Title Safe Zones & Action Safe Zones

UE has two different types of TV Safe Zones: the Title Safe Zone and the Action Safe Zone.

- **Title Safe Zone -** The Title Safe Zone is for UI or Text elements, to make sure they are not cut off or distorted when viewed.

- **Action Safe Zone -** The Action Safe Zone is used to allow characters or enemies to wander partially offscreen.

The area outside of the Action Safe zone will probably be clipped on displays with overscan, while areas between the Action Safe zone and Title Safe zone may be partially clipped.
It's OK to have some action (such as other characters or enemies) occur in that region. The Action Safe zone is the same size as the Title Safe zone on many platforms.

## TV Safe Zone Commands

Following section provides commands you can use with the TV Safe Zone. Also section describes two different ways you can enable and use the TV Safe Zone Debugging tool in your UE project.

Use following TV Safe Zone commands via the UE console.

| Command Name | Value | Description |
| --- | --- | --- |
| `r.DebugSafeZone.Mode` | 0 | Disables all overlays. |
| `r.DebugSafeZone.Mode` | 1 | Enables Title safe zone. |
| `r.DebugSafeZone.Mode` | 2 | Enables Action safe zone. |
| `r.DebugSafeZone.OverlayAlpha` | 0 to 1 | Controls how opaque the debug visualization overlay is (Default is 0.3) |
| `r.DebugSafeZone.TitleRatio` | 0 to 1 | Controls the action safe zone margins returned in FDisplayMetrics (Default is 0.9). |
| `r.DebugActionZone.ActionRatio` | 0 to 1 | Controls the action safe zone margins returned in FDisplayMetrics (Default is 0.9). |

You can also place the TV Safe Zone commands in your projects `DefaultEngine.ini` file under the `[SystemSettings]` section.

```
	[SystemSettings]
	r.DebugSafeZone.Mode 1
	r.DebugSafeZone.TitleRatio 0.9
	r.DebugSafeZone.ActionRatio 0.9
```

[SystemSettings]
 r.DebugSafeZone.Mode 1
 r.DebugSafeZone.TitleRatio 0.9
 r.DebugSafeZone.ActionRatio 0.9

## Activating the Title Safe Zone Debug Preview

To correctly display the ratio of the safe areas, you **must** run the project in either **Windowed Fullscreen** or **Fullscreen** mode.
If you don't, the safe zone will not display correctly, or will display a smaller size than expected.

Following section shows how to activate the Safe Zones in the Debug preview.

- From the **Main Toolbar**, go to the **Play** buttons panel and click to open drop-down menu. In the **Play Modes** menu, select **New Editor Window (PIE)**. This launches the game in a new window. [image: Launch project in New Editor Window]

- Enlarge window with launched project for fullscreen view. [image: Enlarge window to fullscreen]

- Press the **TILDE ( ~ )** key to open the **Unreal Console**. Do the following: Type `r.DebugSafeZone.TitleRatio 0.9`, and press the **ENTER** key to apply it.

- Type `r.DebugSafeZone.OverlayAlpha 0.4`, and press the **ENTER** key to apply it.

- Type `r.DebugSafeZone.Mode 1`, and press the **ENTER** key to apply it.

 [image: Example entering command]

- You should now see a slightly transparent red border placed around the entire play window, as seen in the image below. Click image for full view.

## Adjusting the Size of the Safe & Action Zones

You can adjust the size of either the Safe or Action Zones by entering the following commands into the Unreal Console.

| Command Name | Value | Description |
| --- | --- | --- |
| `r.DebugSafeZone.TitleRatio` | 0 to 1 Range | Controls the Safe Zone margins returned in FDisplayMetrics (Default is 0.9). |
| `r.DebugActionZone.ActionRatio` | 0 to 1 Range | Controls the Action Safe Zone margins returned in FDisplayMetrics (Default is 0.9). |

It is not possible to have both the Safe and Action Zone active at the same time. To view another zone, you will have to disable the one you are currently viewing and then enable the one you want to view.

In the images below, the command `r.DebugActionZone.ActionRatio` was used to decrease to size of the Action Zone from **0.99** all the way down to **0.1**.

 [image: Set Action Ratio 0.99]
 [image: Set Action Ratio 0.9]
 [image: Set Action Ratio 0.8]
 [image: Set Action Ratio 0.7]
 [image: Set Action Ratio 0.6]
 [image: Set Action Ratio 0.5]
 [image: Set Action Ratio 0.4]
 [image: Set Action Ratio 0.3]
 [image: Set Action Ratio 0.2]
 [image: Set Action Ratio 0.1]

**Dragging the slider will show what happens when adjusting the size of the Safe Zone.**

## Adjusting the Alpha of the Safe & Action Zone Overlay

You can increase or decrease the opacity of the Safe & Action Zones by entering the following command into the Unreal console.

| Command Name | Value | Description |
| --- | --- | --- |
| `r.DebugSafeZone.OverlayAlpha` | 0 to 1 | Controls the opacity of the Safe & Action Zones overlays(Default is 0.3). |

In the images below you can see what happens to the opacity of the Safe & Action Zone overlays when the value of `r.DebugSafeZone.OverlayAlpha` was set from a value of 1.0 to a value of 0.1.

 [image: Set Overlay Alpha 1]
 [image: Set Overlay Alpha 0.8]
 [image: Set Overlay Alpha 0.6]
 [image: Set Overlay Alpha 0.4]
 [image: Set Overlay Alpha 0.2]

**Dragging the slider will show what happens when adjusting the opacity of the Overlay Alpha.**

## TV Safe Zone Troubleshooting

In the following section we will go over some pieces of information you need to be aware of to ensure that you are using the TV Safe Zone tool correctly.

- Right now the safe areas are defined in terms of the full screen size (the API wasn't really designed for non-consoles) rather than returning the ratios directly to let them be used in windowed mode. This could be changed in the future, but for now you need to be running in **windowed fullscreen** or **fullscreen** for the ratio to be correct.

- The UI isn't currently expected to be able to handle this changing at runtime, so if you change the TitleRatio / ActionRatio via the console while running you'll probably need to switch game modes to see the changes (e.g., go from front-end to in-game or vis-versa, or 'open FrontEndScene' again).

- When using this tool on the PS4, you only need the first command, **r.DebugSafeZone.Mode 1** as the Safe Zone values are driven by the system setting you can pick in the PS4 OS menus.

- ui
- debugging
- safe zone
- safe zones
- platform delivery

On this page

- What are TV Safe Zones (-> setting-up-tv-safe-zone-debugging-in-unreal-engine)
- Difference between Title Safe Zones & Action Safe Zones (-> setting-up-tv-safe-zone-debugging-in-unreal-engine)
- TV Safe Zone Commands (-> setting-up-tv-safe-zone-debugging-in-unreal-engine)
- Activating the Title Safe Zone Debug Preview (-> setting-up-tv-safe-zone-debugging-in-unreal-engine)
- Adjusting the Size of the Safe & Action Zones (-> setting-up-tv-safe-zone-debugging-in-unreal-engine)
- Adjusting the Alpha of the Safe & Action Zone Overlay (-> setting-up-tv-safe-zone-debugging-in-unreal-engine)
- TV Safe Zone Troubleshooting (-> setting-up-tv-safe-zone-debugging-in-unreal-engine)

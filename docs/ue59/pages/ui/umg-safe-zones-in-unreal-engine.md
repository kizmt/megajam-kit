# UMG Safe Zones

https://dev.epicgames.com/documentation/en-us/unreal-engine/umg-safe-zones-in-unreal-engine?application_version=5.9

> This page describes Safe Zones, which are designed to keep the UI from displaying somewhere the player can't see.

[image: UMG Safe Zones]

**Safe Zone** widgets are an essential part of developing a game user interface (UI) that can run on a lot of different devices. Safe zones are designed to keep the UI from displaying somewhere that it can technically use but the player can't see, such as the edge of a TV display or under the notch and home bar of the iPhoneX. The UMG Designer enables you to test the resolution (or rotation) of the device with your UI and applied Safe Zone widgets.

When you add a **Safe Zone** widget to the **Designer** , the widget will scale any other widgets that are made children of it from the **Hierarchy** panel. These child widgets will scale and adjust anytime there is an "unsafe" zone.

 [image: Without Safe Zone widget]

 [image: With Safe Zone widget]

In this example, a 1080p display has a **Uniform Safe Zone** area of 0.9 (red) for testing and debugging purposes. When the widgets are parented to a Safe Zone widget, the child widgets will scale to the safe zone area. This prevents widgets from being cut off at the screen edge deemed "unsafe". This can be seen in the example, with the "My Menu" title text.

## Setting and Testing Safe Zone Resolutions

In UMG (or for Play-in-Editor (-> ineditor-testing-play-and-simulate-in-unreal-engine) settings), the screen sizes chosen are now linked with Device Profiles (-> setting-up-device-profiles-in-unreal-engine) which also takes into account the Mobile Content Scale Factor (-> performance-guidelines-for-mobile-devices-in-unreal-engine), meaning that the final resolution and DPI scale will change based on the selected device.

To test the screen resolution of a device, use the UMG **Designer** viewport to select the **Screen Size** dropdown and select from the listed devices.

 [image: ScreenSizeSelection.png]

If the device supports screen orientation, like a phone or tablet, use the **Portrait/Landscape** button to swap between the two view modes. This option will be grayed out when the device selected doesn't support orientation shifting.

Here is an example of the two view modes:

Left: Landscape, Right: Portrait

When a device is selected, relevant information and marked "unsafe" zones will be displayed in the **Designer** graph.

Marked "Unsafe" Zones
 Device Details for Mobile Content Scale Factor, Device Name or Uniform Safe Zone, and Screen Size
 DPI Scale

For non-uniform safe zones, you can use the **Flip** button to simulate device rotation for Landscape mode.

This option is only available on some devices and only for Landscape view mode.

When previewing TVs and Monitors from the list, if you've set a debug title safe zone (-> setting-up-tv-safe-zone-debugging-in-unreal-engine) that is less than 1, the **Uniform Safe Zone** will display that size. The debug safe zone area is represented by the red area around the canvas widgets.

The **Debug Safe Zone** mode is on by default in UMG which enables the red "unsafe" zone area to be represented.

For some devices, there are now custom "unsafe" zones represented within the Designer graph. These are used to represent hardware or software specific areas of the device that take up screen real estate, such as the iPhoneX where these zones represent the notch and home bar sections of the screen.

In this example of the iPhoneX, the Safe Zone widget is parented to the section of the widget hierarchy where the menu and buttons are contained. When areas are "unsafe," the encapsulated widgets scale to avoid these areas (see example above).

## Testing UI in PIE and Standalone Game

When testing your UI in the Editor, you can set the screen size based on a common device screen size when using PIE with a **New Editor Window** or when using **Standalone Game** without deploying content to a device. Use the **Editor Preferences** to set the device under **Level > Play > Game Viewport Settings** to choose a common device resolution.

Use the **Landscape/Portrait Orientation** button to swap which orientation should be used.

- ui
- umg ui designer

On this page

- Setting and Testing Safe Zone Resolutions (-> umg-safe-zones-in-unreal-engine)
- Testing UI in PIE and Standalone Game (-> umg-safe-zones-in-unreal-engine)

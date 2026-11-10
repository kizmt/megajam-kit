# Anchors

https://dev.epicgames.com/documentation/en-us/unreal-engine/umg-anchors-in-unreal-engine-ui?application_version=5.9

> Information on using and setting Anchors to keep UI Widgets in fixed locations based on different screen sizes and aspect ratios.

[image: Anchors]

Use **Anchors** to set location of the UI widgets on a **Canvas Panel**. The Anchors supports settings with different screen sizes and aspect ratios.

**Minimum (X,Y)** and **Maximum (X,Y)** Anchors parameters and offset parameters determine location of each widget.

You are able to select from a number of Anchors presets or set up it manually by the Minimum (X,Y) and Maximum (X,Y) parameters (where **Min (0,0)** and **Max (0,0)** determine the upper left corner of the Canvas Panel; **Min(1,1)** and **Max(1,1)** determine the bottom right corner of the Canvas Panel). Anchors presets differ in the set of offset parameters.

## How Anchors Work

**Anchor Medallion** shows the Anchor position in the Canvas Panel. It is marked by the yellow box in the image below.

Image below shows you the **Image Widget** placed on the Canvas Panel. For this you should drag the **Image** from the **Palette panel** onto the **Canvas Panel**. Use default settings of Anchors (top left corner location).

The horizontal yellow line is X-axis Button offset. It determines distance in Slate Units from Anchor Medallion to the Image in the X-direction.

The vertical yellow line is Y-axis Button offset. It determines distance in Slate Units from Anchor Medallion to the Image in the Y-direction.

The offset parameters based on Canvas Panel size and adapt to size changes.

Click the **Screen Size** Button in the graph to change the currently used size. It is very useful to test the UI widget layout with different screen sizes or aspect ratios and adjust accordingly.

It is important to take into account differences in device screen sizes and aspect ratios, when you set Anchors and offset parameters of the widgets. You should avoid shifting widget out of the viewport. It could happen in case innapropriate Anchors settings for some screen sizes.

Image below shows what it looks like. Yellow box marks the location of Anchor point. Image is shifted off viewport.

Set up the Anchor location to the lower right corner.

These settings allow you to avoid cropped off screen, and the Image is shifted inside viewport. Image below shows what it looks like. Yellow box marks the location of Anchor point.

This example shows the effect of the Anchors on widgets position in viewport, depending on aspect ratios. You can also split the Anchor Medallion into several components. With the help of this, you will be able to set more offset options to customize the display of widgets with different screen sizes and aspect ratios (see the Manual Anchors (-> umg-anchors-in-unreal-engine-ui) section for more information).

## Preset Anchors

Preset Anchors is the most common method of Anchor point setting for widgets. With the help of this, you will be able to cover most of your needs in setting position of UI widget.

Select preset from **Anchors** drop-down window at the **Details** panel. Each preset determines the Anchor point location. The silver box marks this location.

For example, select the Center/Center preset Anchor option for widget you need.

There are also preset stretching methods of the Anchor Medallion, when it is splitted into several components.

|  |  |  |
| --- | --- | --- |
|  |  |  |
| Horizontal Stretch | Vertical Stretch | Stretch Both |

With the help of this, you will be able set up widget to stretch along with the viewport, based on screen size.

Image below shows the preset, which stretch Anchor of widget along bottom side of the Canvas Panel.

In this case, the stretching of the Anchor Medallion means splitting it into two pieces.

You can split the Anchor Medallion by draging one of the pins.

Progress Bar with Anchors settings, which is described before, in game process looks as following:

In case of using another aspect ratios of viewport, it looks as following:

## Manual Anchors

In some cases, it is necessary to set Anchors manually. For example, this is useful, when you need to anchor widgets to each other.

Image below shows the Image Widget next to the Progress Bar Widget. Both of them are inside the Canvas Panel, which is placed on another Canvas Panel.

The Progress Bar Widget and the Image Widget has Anchors to the upper left corner of the Canvas Panel.

The following shows adjustment process of the sizes proportional dependence between the Canvas Panel, widgets, and their positions.

Set the Progress Bar to stretch along longitudinal side of the Canvas Panel and fix distance from right side. You should do it by setting Anchors as following: move the Anchor Medallion of the Progress Bar to the center of the Progress Bar left side, then splitting apart the Anchor Medallion by dragging the left center pin.

With the help of these settings, there is a proportional dependence between the Canvas Panel and the Progress Bar horizontally. Also, there is a fixed distance between right sides.

The next step is to fix the Image Widget position in the Canvas Panel and fix the distance between the Image Widget and the Progress Bar Widget.

Move the Anchor Medallion of the Image to the Progress Bar top left corner.

With the help of these settings, Image moves with resizing of the Canvas Panel. Distance between the Image and the Progress Bar is fixed.

Set fixed distance between the Image and right side of the Canvas Panel. With the help of this, you avoid cropping the Image off with the Canvas Panel resizing.

Move and split the Anchor Medallion of the Image as shown below.

With the help of these settings, the Image location is fixed horizontally. Also, there is a proportional dependence between the Canvas Panel and the Image horizontally.

The next step is to fix the Image Widget position in vertical direction. With the help of this, you avoid displacement of the Image relative to the Progress Bar.

Fix the Image position based on Progress Bar position in X and Y direction, by setting the Anchor Medallion as shown.

As a result, there is a proportional dependence of sizes in any direction between the Canvas Panel, the Progress Bar, and the Image. Also, there is fixed positions of each item.

- ui
- umg ui designer

On this page

- How Anchors Work (-> umg-anchors-in-unreal-engine-ui)
- Preset Anchors (-> umg-anchors-in-unreal-engine-ui)
- Manual Anchors (-> umg-anchors-in-unreal-engine-ui)

Related documents

UMG Editor Reference

 [image: UMG Editor Reference] (-> umg-editor-reference-for-unreal-engine)Blueprints Visual Scripting

 [image: Blueprints Visual Scripting] (-> blueprints-visual-scripting-in-unreal-engine)

# Converting Colors in Composure with OpenColorIO

https://dev.epicgames.com/documentation/en-us/unreal-engine/converting-colors-in-composure-with-opencolorio-in-unreal-engine?application_version=5.9

> Apply color transformation to a Composure Element and to the composited output with OpenColorIO in Unreal Engine.

[image: Converting Colors in Composure with OpenColorIO]

This page explains how to apply OpenColorIO (-> color-management-with-opencolorio-in-unreal-engine) (**OCIO**) color conversions to input and output media in Composure.

## Prerequisites

You must set up the following in your project to complete the sections below:

- An **OpenColorIO Configuration Asset**. Refer to the OpenColorIO Quick Start (-> opencolorio-quick-start-for-unreal-engine) for steps on creating this Asset.

- A **Composure Element** set up with a valid **Media Source** and an **Output**. Refer to the Real-Time Compositing Quick Start (-> realtime-compositing-quick-start-for-unreal-engine) for steps on setting these up.

## Converting a Media Element in Composure

This procedure shows how to create a new **Transform Pass** for a Composure Element, and set up that Transform Pass to convert the color space of the Element's media source from one color profile to another.

- In the **Outliner**, select your **Composure Element** to open its **Details **panel.

- In the **Details** panel under the **Composure > Transform/Compositing Passes** section, click **Add (+)** to add a new Transform Pass entry. [image: Add New Transform Pass]

- In the settings for your new **Transform Pass**, open the **dropdown menu** and select **OpenColorIO Pass** from the list. [image: Set Transform Pass to OpenColorIO Pass]

- Expand the settings for your **Transform Pass**, then expand its **Color Conversion Settings**. [image: Expand Color Conversion Settings]

- Under Color Conversion Settings: Set the **Configuration Source** parameter to point to your **OpenColorIO Configuration Asset**.

- Set the **Source Color Space** parameter to the color profile you want to convert from. This is typically the color space that the media source was originally captured in.

- Set the** Destination Color Space **parameter to the color profile you want to convert to. Typically you will want to use the **linear **color space so your media matches the linear color space used in Unreal Engine.

- Toggle the **Enabled **setting on.

 [image: Set Color Conversion Settings]

- As soon as you set up the source and destination color spaces for your Transform Pass, the colors in your Media Source change in the Composure Element's Preview and in the Level Viewport.

## Converting Media Output in Composure

This procedure shows how to set up an output from Composure with a new Color Correction pass that converts the colors of the composited media from one OCIO color profile to another.

- In the **Outliner**,** **select your **Composure Element** to open its **Details **panel.

- In the **Details** panel under **Composure > Output**, expand your **Output Pass**. [image: Expand Output Pass]

- In the settings for your new **Output Pass**, open the **dropdown menu** and select **OpenColorIO Pass** from the list. [image: Set Output Pass to OpenColoriO Pass]

- Expand the **Color Conversion** **Settings** for the **Output Pass**. Under Color Conversion Settings: Set the **Configuration Source** parameter to point to your **OpenColorIO Configuration Asset**.

- Set the **Source Color Space** parameter to the color profile you want to convert from. Typically you will want to use the **linear **color space so your media matches the linear color space used in Unreal Engine.

- Set the** Destination Color Space **parameter to the color profile you want to convert to. Typically you will want to match the color space used by the monitor to display the result, or another destination color space that you want.

- Toggle the **Enabled **setting on.

 [image: Set Color Conversion Settings]

- When you display your composited media, the colors are changed.

- vfx

On this page

- Prerequisites (-> converting-colors-in-composure-with-opencolorio-in-unreal-engine)
- Converting a Media Element in Composure (-> converting-colors-in-composure-with-opencolorio-in-unreal-engine)
- Converting Media Output in Composure (-> converting-colors-in-composure-with-opencolorio-in-unreal-engine)

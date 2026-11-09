# In-Camera VFX Template

https://dev.epicgames.com/documentation/en-us/unreal-engine/in-camera-vfx-template-in-unreal-engine?application_version=5.9

> An overview of the In-Camera VFX Template

[image: In-Camera VFX Template]

The **In-Camera VFX Template** is the starting point for creating the complex configuration that goes into a live-action LED stage. It provides a basic map and a variety of features to help you get started with your in-camera VFX project.

## Creating a Project from the Template

- Launch **Unreal Engine**.

- Select the **Film, Television, and Live Events** template category. Click image for full size.

- Click **InCamera VFX**. Click image for full size.

- Choose whether to include starter content and whether to enable retracing, and select the path and name for your project.

- Click **Create**.

## Template Features

- An nDisplay configuration and Blueprint set up for In-Camera VFX

- Configurable inner frustum and outer frustum

- Live Link

- A chroma key and tracking markers

- Color Correction Regions

- Web remote control

- OSC

Refer to the In-Camera VFX Overview (-> in-camera-vfx-overview-in-unreal-engine) and In-Camera VFX Quick Start (-> in-camera-vfx-quick-start-for-unreal-engine) for information on how to use these features.

In order to access the **Blueprints** and other assets described in the template, make sure to enable **Show Engine Content** and **Show Plugin Content** in the **View Options** menu in the **Content Browser**.

 [image: View engine content and plugin content options]

## Maps

Click image for full size.

**LED_CurvedStage** is the main map. It is provided for typical in-camera VFX set-ups and configurations.

### LED Curved Stage

 [image: LED Curved Stage]

This map provides an alternative set up with a curved mesh used for the LED wall. The LED wall is composed of four sub-sections, two on the left and two on the right, hence why there are four screens within **nDisplay_InCamVFX_Config** under the root component. You can customize these sub-sections to use this as a starting point to describe any type of curved LED displays, so that it matches your hardware configuration.

 [image: Curved screen section in the hierarchy]

#### Chroma Key

In the Details for **nDisplay_InCamVFX_Config** in the Curved Stage map, there is a control setting to enable the chroma key, allowing control over the visibility of that layer.

Click image for full size.

- templates
- virtual production
- vfx
- in-camera vfx

On this page

- Creating a Project from the Template (-> in-camera-vfx-template-in-unreal-engine)
- Template Features (-> in-camera-vfx-template-in-unreal-engine)
- Maps (-> in-camera-vfx-template-in-unreal-engine)
- LED Curved Stage (-> in-camera-vfx-template-in-unreal-engine)
- Chroma Key (-> in-camera-vfx-template-in-unreal-engine)

# Connecting your Preston System

https://dev.epicgames.com/documentation/en-us/unreal-engine/connecting-your-preston-system-in-unreal-engine?application_version=5.9

> A guide to how to use the LiveLink Preston MDR Plugin with a virtual camera.

[image: Connecting your Preston System]

## Steps

Follow these steps if you are using a Preston system with your production camera.

In this example, the Preston MDR unit needs to convert the serial output to Ethernet. This is done by using a Tibo serial-to-Ethernet converter. This Ethernet connection needs to be on the same network as Unreal Engine. There are other hardware devices for streaming Preston data. Refer to the vendor for the relevant plugin or setup if sending Preston data using a different device.

- Click **Settings > Plugins** to open the **Plugins Menu**. Click the **Virtual Production** category and search for the **LiveLinkPrestonMDR** plugin. [image: Open the Plugins Menu]

- Enable the plugin and click **Yes** on the message window. Click **Restart Now** to restart the editor. [image: Enable the Preston plugin] [image: Click Restart Now]

- Once the editor finishes loading, go to the **Live Link** window and click **+ Source > PrestonMDR**. Enter the **Tibo's IP Address** and **Port Number 1001** and click **OK**. [image: Add your Preston subject]

- Select your Preston subject from the list and set the **Incoming Data Mode** dropdown to **Calibrated Data**. [image: Select Calibrated Data]

- Select the Preston MDR device with the green circle. Open the **View Options** dropdown and change the setting to **Show Frame Data**. This will display live link data. [image: View Options Show Frame Data]

- Change the focus and iris on the Preston hand unit to see the values for Aperture and Focus distance change and verify that these values match the values on the camera.

- Select your **CineCamera Actor** in the **World Outliner** window and go to the **Details** panel. Select your **Live Link Controller** component and scroll down to the **Live Link** section. Click the **Subject Representation** dropdown and select your Preston subject. [image: Select your Preston subject]

- Scroll down to the **Camera Calibration** section and click the **Lens File** dropdown. Select the Lens File for your camera. [image: Select your Preston subject]

- Change the **Focus Method** setting from **Manual** to **Disabled**. This stops the focus changing on the CG Cinema camera as focus is being controlled by the physical camera by the value manually input using the Live Link Virtual Subject. [image: Change Focus Method from Manual to Disabled]

#### Results

In this guide you set up and connected a Preston MDR using Live Link to stream Focus Iris and Zoom to the Lens File connected to the Cine camera in UE.

- virtual production
- in-camera vfx

On this page

- Steps (-> connecting-your-preston-system-in-unreal-engine)
- Results (-> connecting-your-preston-system-in-unreal-engine)

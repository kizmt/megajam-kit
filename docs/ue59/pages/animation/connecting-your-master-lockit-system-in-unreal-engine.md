# Connecting your Master Lockit System

https://dev.epicgames.com/documentation/en-us/unreal-engine/connecting-your-master-lockit-system-in-unreal-engine?application_version=5.9

> Guide on how to use the LiveLink MasterLockit Plugin with a virtual camera

[image: Connecting your Master Lockit System]

## Steps

In this section you will connect a Smart lens using an Ambient Master Lockit Plus device using Live Link.

The Smart lens on the production camera will be connected to the Master Lockit Plus and the Master Lockit Plus will connect to the Unreal Engine workstation network by Ethernet.

- Click **Settings > Plugins** to open the **Plugins Menu**. Click the **Virtual Production** category and search for the **LiveLinkMasterLockit** plugin. [image: Open the Plugins Menu]

- Enable the plugin and click **Yes** on the message window. Click **Restart Now** to restart the editor. [image: Add a Master Lockit] [image: Click Restart Now]

- Once the editor finishes loading, go to the **Live Link** window and click **+ Source > MasterLockit**. Enter the **Master Lockit's IP Address** and click **OK**. [image: Add a Master Lockit]

- Select the **Master Lockit Device** in the window and click **View Options**, then select **Show Frame Data**. Confirm the values are updating correctly in the **Live Link** section. [image: Show Frame Data]

- Select the **CineCamera Actor** in the **World Outliner** window and go to the **Details** panel. Select the **Live Link Controller** component and scroll down to the **Live Link** section. Click the **Subject Representation** dropdown and select your **Master Lockit Device**. [image: Add a Master Lockit Device to the Subject Representation]

- Select the **Camera Component** and scroll down to the **Focus Settings**. Verify that changing the focus and aperture on the physical camera updates those same settings in the **CineCamera Actor**.

- Change the **Focus Method** setting from **Manual** to **Disabled**. This stops the focus changing on the CG Cinema Camera as focus is being controlled by the physical camera [image: Change Focus Method from Manual to Disabled]

#### Results

In this guide you connected your Master Lockit Device by using Live Link and streamed Focus Iris and Zoom from a Smart Lens on the Production camera.

- virtual production
- in-camera vfx

On this page

- Steps (-> connecting-your-master-lockit-system-in-unreal-engine)
- Results (-> connecting-your-master-lockit-system-in-unreal-engine)

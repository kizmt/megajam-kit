# Using Lens Distortion in a Cine Camera Actor

https://dev.epicgames.com/documentation/en-us/unreal-engine/using-lens-distortion-in-a-cine-camera-actor-in-unreal-engine?application_version=5.9

> How to use the Camera Calibration plugin to apply lens distortion to a CineCamera Actor.

[image: Using Lens Distortion in a Cine Camera Actor]

- Select your **CineCamera Actor** in the **Outliner** and go to the **Details** panel. [image: Select the CineCamera Actor]

- Select the **LiveLink Component Controller component** and scroll down to the **Camera Role** category. Verify that the correct **Lens File** is assigned to the **Lens File** slot. In this example the **LumixLens** file is used from the Quick Start Guide (-> camera-lens-calibration-quick-start-for-unreal-engine). [image: Select the Live Link Component]

- Click the **Add Component** button, then search for and select **Lens Distortion** to add the component. [image: Add the Lens Distortion component]

- Scroll down to the **Default** section and click the dropdown next to **Distortion Source**. Select the **LumixLens** file and **enable** the **Apply Distortion** checkbox. [image: Add the Lens Distortion Source]

- You should now see the lens distortion applied to the CineCamera Actor in the viewport.

## Section Results

In this guide you learned how to apply the lens distortion effect from the Camera Calibration plugin to the CineCamera Actor.

- camera
- camera lens calibration
- virtual sets

On this page

- Section Results (-> using-lens-distortion-in-a-cine-camera-actor-in-unreal-engine)

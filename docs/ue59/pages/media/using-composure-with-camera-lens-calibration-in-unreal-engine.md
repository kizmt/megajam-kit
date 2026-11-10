# Using Composure with Camera Calibration

https://dev.epicgames.com/documentation/en-us/unreal-engine/using-composure-with-camera-lens-calibration-in-unreal-engine?application_version=5.9

> How to use the Camera Calibration plugin with Composure.

[image: Using Composure with Camera Calibration]

- Go to **Window > Virtual Production > Composure Compositing** to open the **Composure** window. [image: Open Composure Compositing]

- Right-click inside the **Composure** window and select **Create New Comp** from the menu. Click the **Empty Comp Shot** button to create a new empty composition. [image: Create a new Comp] [image: Create an Empty Comp Shot]

- Right-click the composure and select **Add Layer Element**. Click the **Media Plate** button. This media plate will use the live video feed from your camera. [image: Add Layer Element] [image: Add a Media Plate]

- Navigate to **Content Browser > Your project folder for MediaIO >** and drag **MediaBundle-01** into your Level. Click image to expand.

- Select the **media plate** in the **Composure** window and go to the **Details** panel. Scroll down to the **Composure** section and expand the **Input** category. Click the **Media Source** dropdown and select **T_MediaBundle-01_BC** from the list. You should now see the live video feed streamed on the media plate. [image: Select the Media Plate] Click image to expand.

- Right-click the composure and select **Add Layer Element**. Click the **CG Layer** button. [image: Add a CG Layer]

- Go to **Window > Layers** to open the **Layers** window. [image: Open the Layers Window]

- Select the **BP_UE_Tracker3** and the **CameraCalibrationCheckerboard** Blueprints from the **Outliner**. Go to the **Layers** window then right-click and select **Add Selected Actors to New Layer** from the menu. Name the layer **cglayer**. Click image to expand. You can also find **BP_UE_Tracker3** in the Content Browser under Engine content folder. Click image to expand.

- Select the **cg element** layer in the **Composure** window and go to the **Details** panel. Scroll down to the **Composure** section and click the **+** button to expand the **Capture Actors** options. Click the **ActorSet** dropdown and select **cglayer** from the list. Click image to expand.

- With the **cg element** layer selected, scroll down to the **LensDistortion** section and select the **Distortion Source** as the **LumixLens** file. [image: Apply Distortion to the CG Layer]

- Right-click in the **Content Browser** and select **Material **from the **Create Basic Asset** section. Name the Material **M_SimpleComp**. [image: Create a New Material]

- Double-click **M_SimpleComp** to open it. Select the Material node and go to the **Details** panel. Set the **Shading Model** to **Unlit**. [image: Set the Material to Unlit]

- Right-click in the graph then search for and select **TextureSample**. Right-click the **Texture Sample** node and select **Convert to Parameter**. Name it **CGLayer**. Go to the **Details **panel and add a texture to the **CG Layer** dropdown. [image: Add a Texture Sample] [image: Convert the Texture to a Parameter] [image: Add a Texture]

- Repeat the previous step and add another **Texture Sample**. Name the parameter **MediaPlate**. Click image to expand.

- Right-click in the graph then search for and select **Over**. Connect the **RGBA **pins of both nodes to the **A** and **B pins** of the **Over **node. Finally, connect the **RGBA **pin of the **Over **node to the **Emissive Color** pin of the Material node. [image: Add an Over Node] Click image to expand.

- Select your composition from the **Composure** window and go to the **Details** panel. Scroll down to the **Transform / Compositing Passes** section and expand **Transform Passes**. Add the **M_SimpleComp** Material to the **Material** slot. Click image to expand.

- Expand **Input Elements** and add Media Plate and CG Element layers to their corresponding slots. You should now have the video feed streamed to the Media Plate and your selected Actors displayed in the CG Elements layer. Click image to expand.

## Section Results

In this guide you learned how to use Composure with the Camera Calibration plugin.

- composure
- camera lens calibration
- ar/vr/xr

On this page

- Section Results (-> using-composure-with-camera-lens-calibration-in-unreal-engine)

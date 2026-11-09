# OpenXR Stereo Layers Quick Start

https://dev.epicgames.com/documentation/en-us/unreal-engine/openxr-stereo-layers-quick-start-in-unreal-engine?application_version=5.9

> Learn how to add an OpenXR Stereo Layer to your project.

[image: OpenXR Stereo Layers Quick Start]

This page describes how to get started with Stereo Layers in your OpenXR project.

The steps and images on this page use the VR Template (-> vr-template-in-unreal-engine) Project as a starting point. The steps should apply to any project set up for OpenXR.

To add an OpenXR Stereo Layer to your project's Pawn:

- In the **Content Drawer**, navigate to **Content > VRTemplate > Blueprints** and double-click the **VRPawn **Asset to open it in the **Blueprint Editor**.

- In the **Components **panel of the Blueprint Editor, click the **Add Component** button and search for **Stereo Layer**.

- Drag the new **Stereo Layer** Component on top of the **Camera **Component to make it a Child Actor of the Camera.

- Select the Stereo Layer Component from the Components list to open its **Details **panel. Under the **Transform **section, set the **X **value of **Location **to **100**.

- Switch to the **Viewport **tab of the Blueprint Editor to see the location of the Stereo Layer relative to the Pawn's Camera.

- In the **Details **panel, under the **Stereo Layer** section: Assign a texture to the **Texture **parameter. In this example, the **T_Grid** texture is used.

- Set the **Stereo Layer Shape** to **Quad Layer**.

- **Compile** the Blueprint and close the Blueprint Editor.

- Press **Play in VR** to launch your project on the headset and verify that the texture is displayed in front of you and locked to the HMD. [image: image alt text]

To change where the Stereo Layer appears, change the Stereo Layer Type parameter. See the OpenXR Stereo Layers Overview (-> openxr-stero-layers-overview-in-unreal-engine) for details on the available options.

- xr
- vr
- openxr
- stereo layers
- ar/vr/xr

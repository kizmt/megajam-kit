# Converting Colors in Blueprints

https://dev.epicgames.com/documentation/en-us/unreal-engine/converting-colors-in-unreal-engine-blueprints?application_version=5.9

> Apply color transformation using Blueprints with OpenColorIO in Unreal Engine

[image: Converting Colors in Blueprints]

You can apply OpenColorIO (-> color-management-with-opencolorio-in-unreal-engine) (**OCIO**) color transformations with **Blueprints** on any input texture, including a **MediaTexture** that plays back a video source, and get the converted results in a **RenderTarget**. This page shows how to use the **Apply Color Space Transform **Blueprint function in your project.

## Prerequisites

You must set up the following in your project to complete the sections below:

- An **OpenColorIO Configuration Asset**. Refer to the OpenColorIO Quick Start (-> opencolorio-quick-start-for-unreal-engine) for steps on creating this Asset.

- A **Blueprint Class**, created from a **Blueprint Actor** that has an **Event Tick**.

## Using the Apply Color Space Transform Function

Follow these steps to apply color conversions with Blueprints. These steps use the **EditorUtilityActor **Blueprint Class as an example.

- Double-click your **Blueprint Class** to open it in the **Blueprint Editor**.

- In the **My Blueprint** panel, under **Variables > Components**, click **Add (+) Variable** to create a new variable. Name the new variable **InputTexture**. [image: Add new variable in Blueprint Class]

- Next to the new InputTexture variable, click **Make Public** to make it visible outside this Blueprint. [image: InputTexture variable set to public]

- Set the **Variable Type** for the variable InputTexture to **Object Types > Texture > Object Reference**. [image: Setting InputTexture variable type to Texture Object Reference]

- Create two more variables and make them public: **OutputTexture **with the Variable Type **Texture Render Target 2D > Object Reference**

- **ColorConversionSettings **with the Variable Type **Open Color IOColor Conversion Settings**.

 [image: Blueprint with all variables created]

- Drag the **InputTexture** variable into the **Event Graph**, and choose **Get InputTexture**. This creates a new InputTexture node in the Event Graph. [image: InputTexture variable dragged into Event Graph to create Get InputTexture node]

- Repeat the process for the **OutputTexture** and **ColorConversionSettings** variables. [image: Blueprint nodes created from all the variables]

- Right-click within the **Event Graph**, and add a new **Apply Color Space Transform** node. [image: Apply Color Space Transform node created]

- Connect the nodes together: Connect the **output execution pin** from the pre-supplied **Event Tick** node to the **input execution pin** of the **Apply Color Space Transform** node.

- Connect the **output data pin** of the **InputTexture** node to the **Input Texture input data pin** on the **Apply Color Space Transform** node.

- Connect the **output data pin** of the **Output Texture** node to the **Output Render Target** **input data pin** on the **Apply Color Space Transform** node.

- Connect the **output data pin** of the **Color Conversion Settings** node to the **Conversion Settings input data pin** of the **Apply Color Space Transform** node.

 [image: Blueprint nodes connected]

- **Compile** and **Save** the Blueprint. Close the Blueprint Editor.

- Drag your **Blueprint Asset** into the level to create its **Actor**.

- In the **Outliner**, select your **Blueprint Actor** to open its **Details **panel.

- In the **Details** panel, expand the **Default **section, and set **Input Texture** to your desired input file.

- Create a **Render Target Asset** in the **Content Browser**, and set **Output Texture** to point to the new Render Target Asset. [image: Details panel of the Blueprint Class Actor with all the variables assigned]

- In the **Details** panel of the **Blueprint Actor,** expand the **Color Conversion Settings** section. Set **Configuration Source** to your OpenColorIO Configuration Asset, and adjust the **Source Color Space** and **Destination Color Space** to match the color space of the input and output media.

- Drag your **Render Target Asset** onto an **Actor** in the Level to preview your media with the color transformation. You can continue to adjust the Source Color Space and Destination Color Space settings to preview different outputs.

- vfx

On this page

- Prerequisites (-> converting-colors-in-unreal-engine-blueprints)
- Using the Apply Color Space Transform Function (-> converting-colors-in-unreal-engine-blueprints)

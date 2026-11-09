# Converting from mGPU to Multi-Processing Rendering

https://dev.epicgames.com/documentation/en-us/unreal-engine/converting-from-mgpu-to-multi-process-rendering-in-unreal-engine?application_version=5.9

> Convert an existing multi-GPU config for multi-process rendering.

[image: Converting from mGPU to Multi-Processing Rendering]

## Converting an mGPU Config

Existing nDisplay ICVFX users may have already used Multi-GPU and have configs that they would like to convert for multi-process rendering. Some settings on the computer and in Unreal Engine must be changed to make this possible.

The following section is focused on converting an existing nDisplay config from Multi-GPU to Multi-Process. With the knowledge gained on the Getting Started page, this section is written as a step-by-step guide to provide a practical example.

### Settings

These NVIDIA Control Panel settings are specific to the context of converting a Multi-GPU config to Multi-Process. To access the NVIDIA Control Panel, right-click on your computer desktop and select it from the context menu.

- **SLI:** A machine set up for mGPU will have SLI enabled. We’ll go to the section titled Set SLI and PhysX Configuration and **disable SLI**.

- **Mosaic:** Multi-GPU uses maximum GPU topology, while Multi-Process requires minimum GPU topology. If you are using Mosaic, then this setting will need to be changed under the Set Up Mosaic section of the NVIDIA Control Panel. If you are not using Mosaic then this setting does not apply.

### Adding Offscreen Nodes

The nDisplay config in this example is slightly more complex and has a few more nodes to represent what advanced users will likely be working with.

In the Cluster panel, select the host of each machine and **+add** a new Cluster Node.

In the **Add New Cluster Node** window, adjust the following settings:

Using the naming conventions of the nodes we already have, I’m naming this Node_1_OS to indicate that it is offscreen.

**Disable** Adding a Viewport.

**Enable** Headless Rendering.

Keep the IP Address the same, so it matches the regular onscreen node address.

Set the **Graphics Adapter** to **1**, which is our secondary GPU.

Click **Add**.

For more information on the Add New Cluster Node settings, check out the Getting Started page.

**I’ll go ahead and repeat that process for the other nodes.** We will end up with Node_2_OS and Node_3_OS, all with the same settings as above.

### Camera Setup

Next, we need to set up our ICVFXCamera component. In this project, we have two cameras, which means we also have two frustums.

We will open the Details panel for the first ICVFX Camera. These initial steps are the same as when we created a Multi-Process Rendering config in the Getting Started section.

In this example, instead of just one node, we have three nodes that will receive information in the project. Use the dropdown menu to set them to **Node_1, Node_2, and Node_3**.

The Media Source will be **Shared Media**.

I’ll set the Unique Name to **ICVFXCamA**.

Now we’ll set up our **Output Group**. We’ll again add three nodes, but this time we will set them to **Node_1_OS, Node_2_OS, and Node_3_OS**.

The Media Source will be **Shared Media**.

The Unique Name will be exactly the same - **ICVFXCamA**. We recommend copying and pasting because it is string-sensitive, and even slight differences in the names can cause errors.

Now we will repeat those steps for the second camera, but with a different Unique Name. This is very important - I’ll name mine **ICVFXCamB**.

**Compile** and save.

## Switchboard

In the Switchboard you can see that we have three Multi-Process Nodes and three regular nDisplay nodes. All six of these need to be launched because for each machine there is both a regular nDisplay render node and an offscreen render node.

Your Multi-GPU config is now converted and ready to be used for Multi-Process rendering!

- ndisplay
- icvfx
- bronze
- multi-process rendering
- mgpu

On this page

- Converting an mGPU Config (-> converting-from-mgpu-to-multi-process-rendering-in-unreal-engine)
- Settings (-> converting-from-mgpu-to-multi-process-rendering-in-unreal-engine)
- Adding Offscreen Nodes (-> converting-from-mgpu-to-multi-process-rendering-in-unreal-engine)
- Camera Setup (-> converting-from-mgpu-to-multi-process-rendering-in-unreal-engine)
- Switchboard (-> converting-from-mgpu-to-multi-process-rendering-in-unreal-engine)

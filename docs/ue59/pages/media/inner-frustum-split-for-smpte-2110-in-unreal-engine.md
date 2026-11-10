# Configuring an Inner Frustum Split

https://dev.epicgames.com/documentation/en-us/unreal-engine/inner-frustum-split-for-smpte-2110-in-unreal-engine?application_version=5.9

> A guide to setting up an inner frustum split using SMPTE 2110

[image: Configuring an Inner Frustum Split]

This tutorial guides you through the configuration setup for an inner frustum split on a nDisplay ICVFX Camera using SMPTE 2110.

With SMPTE 2110 support, you can now dedicate an entire nDisplay render node to just the inner frustum. Unreal Engine provides the ability to render the Inner Frustum with even more hardware resources, across both multiple nodes as well as multiple GPUs (similar to a Multi-Process (-> multiprocess-rendering-with-unreal-engine) deployment), to produce the highest quality Inner Frustum possible. As new cameras increase in resolution and volumes increase in size, the system can scale with the needs of modern productions.

 [image: Using multiple nodes for an inner frustum split on-set for an ICVFX shoot.]

Using multiple nodes for an inner frustum split on-set for an ICVFX shoot.

## Configuration

 [image: A sample configuration diagram for an inner frustum split using nDisplay and SMPTE 2110.]

A sample configuration diagram for an inner frustum split using nDisplay and SMPTE 2110.

- Create an nDisplay configuration.

- Add a Node layout that reflects the deployment of your setup. [image: Add a Node layout.] Nodes 1 and 2 render the wall and ceiling, respectively.

- Nodes 3 and 4 render the inner frustum tiles (0,0) and (0,1) respectively, and both have the **Headless Rendering** setting enabled (set this in their configuration accordingly), which means they render no (outer) viewports.

- Add an ICVFX Camera component. [image: Add an ICVFX Camera component.]

- Select the ICVFX Camera component and go to the **Details** panel. [image: Enable Media and select Tiled as the Inner Frustum Type.] Enable **Media**, and set the **Inner Frustum Type** to **Tiled**.

- Use the **Tiled Split Layout** values to set the number of tiles in the horizontal (x) and vertical (y) directions. In this example, the total number of tiles to render is two (2) – two tiles horizontally and one vertically.

- Under the settings for **Tile Overscan** set the following properties to use overscan to improve tile blending: Enable **No Overscan for Edges**.

- Set the **Overscan Value** to 5% or higher. [image: Set the Overscan Value]

- (Optional, see the Tile Configuration Wizard (-> inner-frustum-split-for-smpte-2110-in-unreal-engine) section below.) Under **Media Output Groups**, create a group for each set of nodes that will render Inner Frustum tiles. In this example, the first tile (0,0) will render on Node_3 and the second tile will render on Node_4 (1,0). [image: Create groups for each set of nodes under Media Output Groups.]

- Select **NVIDIA Rivermax Output** as the Media Output. This means you can set up the SMPTE 2110 stream with the specified parameters. [image: Set up the SMPTE 2110 stream parameters] Most properties will be initialized by default. The **Resolution** is automatically set based on the tile layout, and you should not need to set specific values.

- Set the correct **Interface Address** and **Stream Address** for your network.

- You must set the **Frame Rate** higher than the rendering rate. If the bandwidth permits it, it should be at least twice as high.

- If you want to use GPU Direct, Unreal Engine supports it when **Frame Locking Mode** is set to **Block on Reservation** and **Alignment Mode** is set to **Frame Creation**, so set those values accordingly.

- Leave **Capture Synchronization** set to **None**.

- Under **Media Input Groups**, specify the nodes that will receive the inner frustum tiles. [image: image alt text] Create a **Media Input Group** for each group of outer viewports that will receive the inner frustum tiles. In this example, there are two tiles, and both should be visible by Node_1 (wall) and Node_2 (ceiling).

- Add the number of tiles to match the number configured to render in **Media Output Groups**. Each index is an inner frustum tile to deliver to the Nodes above.

- For each tile, specify the relevant tile coordinates, add an **NVIDIA Rivermax Source**, and match the stream settings of the Media Output groups. Some deployments might want to specify a different **Interface Address** or remove the wild card. Ensure the frame rate matches between input and output.

- GPUDirect is supported on input if the PCI-e root complex is the same.

## Media Tiles Configuration Wizard

You can use an automated workflow to configure your tiles, by means of the **Media Tiles Configuration** wizard. Its purpose is to simplify the process of configuring tiles, as much as possible.

Steps 6-8 in the configuration workflow above remain valid, and you can use them for manual split configuration.

The key features of the Media Tiles Configuration wizard are to:

- Automatically generate input and output groups based on the tile layout.

- Automatically configure pre-defined media parameters with default settings. The only pre-defined media are NVIDIA Rivermax and Shared Memory Media.

- Default parameters are pre-configured and ready to use.

To start the configuration wizard, click **Configure Tiles**.

 [image: The Configure Tiles button starts the tile configuration wizard.]

The Configure Tiles button starts the tile configuration wizard.

The configuration process starts with the layout configuration of the tiles.

 [image: The Media Tiles Configuration wizard.]

The Media Tiles Configuration wizard.

- Select the tiles that represent the split layout you need for your setup, then click **Next**. For the example shown below, we split the inner frustum into two tiles horizontally, and therefore selected the **2x1** layout. [image: Selecting a two-tile split layout.]

- Specify your **Media Source** and **Media Output** types. The example below uses NVIDIA Rivermax for both. [image: Specify your Media Source and Media Output.]

- Specify which nodes produce and send tiles, and which ones consume and receive tiles. This is a preliminary input and output configuration step. The next step has more flexibility. [image: Specify your nodes.]

- The tile mapping is pre-configured based on the data provided in the previous step. If necessary, you can manually map the tiles to nodes that will render them. In the example below, there are two tiles. The left one is mapped to **Node_3**, the right one is mapped to **Node_4**. For a simple example such as this, this is fine, but for more complex setups, you can click any tile and manually pick another node(s) to render it. [image: Review your tile mapping.]

- Click **Finish** to complete the configuration process.

With the configuration wizard complete, the camera settings are updated with all the tiled media settings.

 [image: image alt text]

NVIDIA Rivermax and Shared Memory Media are configured automatically by default. You can manually modify settings if needed, but in most cases the default settings should be sufficient.

The **Reset Media Input and Output to Default** button resets all the existing media input and output settings to the default pre-configured settings. You can use this to revert unsuccessful manual changes back to the original default settings.

## Multi-Process Inner Frustum Split

If you have a deployment with render nodes that have multiple (2 or more) GPUs, you might choose to combine a Shared Memory/Multi Process (-> multiprocess-rendering-with-unreal-engine) deployment with SMPTE 2110 and an inner frustum split. This means you can devote more resources to each viewport and inner frustum tile, while reducing the total number of render nodes required for the deployment.

In the following example, the same setup as in the previous example is laid out with 3 hosts instead of 4, with the outer viewports no longer sharing the same process/GPU:

- Each viewport is rendered on its own Node/GPU on the same host, and the configuration uses both shared memory and SMPTE 2110 media.

- Each inner frustum tile is rendered on its own node/GPU on the same host, and the configuration shares with SMPTE media only.

 [image: The hosts and nodes for a multi-process inner frustum split using nDisplay and SMPTE 2110.]

The hosts and nodes for a multi-process inner frustum split using nDisplay and SMPTE 2110.

 [image: A sample configuration diagram for a multi-process inner frustum split using nDisplay and SMPTE 2110.]

A sample configuration diagram for a multi-process inner frustum split using nDisplay and SMPTE 2110.

- rendering
- graphics

On this page

- Configuration (-> inner-frustum-split-for-smpte-2110-in-unreal-engine)
- Media Tiles Configuration Wizard (-> inner-frustum-split-for-smpte-2110-in-unreal-engine)
- Multi-Process Inner Frustum Split (-> inner-frustum-split-for-smpte-2110-in-unreal-engine)

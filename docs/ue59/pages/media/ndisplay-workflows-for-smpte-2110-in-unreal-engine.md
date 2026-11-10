# NDisplay Workflows

https://dev.epicgames.com/documentation/en-us/unreal-engine/ndisplay-workflows-for-smpte-2110-in-unreal-engine?application_version=5.9

> A guide to setting up NDisplay workflows using SMPTE 2110.

[image: NDisplay Workflows]

This guide provides instructions for setting up SMPTE 2110 using NVIDIA Rivermax to work with nDisplay, specifically when working with in-camera VFX (ICVFX) and an LED wall.

### nDisplay ICVFX Camera Streaming

The integration of media sharing and offscreen rendering provides a way for you to leverage SMPTE 2110 media sources and outputs to make your clusters perform more optimally. You can move the render of each ICVFX camera to its own machine, and then use SMPTE 2110’s multicast capabilities to deliver those camera streams to other nodes that depend on them.

This means you can dedicate render nodes to rendering cameras, which generally scales better than rendering all the inner frustums on all render nodes. With this configuration, you are not changing the way UE sends pixels to the wall. A synchronization card is still used by compositor nodes to send their output synchronously. However, render nodes dedicated to rendering inner frustums don’t need a synchronization card. Also, in this configuration PTP timing isn’t used for the SMPTE 2110 stream shared between instances of UE.

[image: SMPTE ST 2110 ICVFX camera streaming.] SMPTE ST 2110 ICVFX camera streaming.

Here’s an example of how you can configure a cluster of three nodes and two ICVFX cameras. This example starts from an existing stage configuration to show the process of converting it to leverage these new additions.

#### Node Configuration

- In the **Content Browser**, search for then open your nDisplay configuration. This example is named **NDC_MyStage**:[image: image alt text]This configuration has 3 nodes driving the wall, and each of them renders a set of viewports. These won’t be modified. | Node | Viewports |
| --- | --- |
| Node_1 | VP_W1 |
| Node_2 | VP_W2 |
| Node_3 | VP_C1 VP_C2 |
- It also has two ICVFX cameras. For each of them, click **+Add,** then select **Add New Cluster Node** to create a node you will use to render that camera.[image: Add button options]For each node:Give it a name that identifies the camera to render for.
- Disable **Adjust Cluster Node Position to Prevent Overlap**.
- Disable **Add Viewport to New Cluster Node**.
- Set the desired host IP.
- Enable Headless Rendering.
- Configure the graphics adapters if your system has more than one.

- When fully configured, your **Add New Cluster Node** dialog box should resemble the following image.[image: Add New Cluster Node dialog box options]
- When you are done creating the nodes, your cluster should resemble the following image:[image: Cluster nodes]

#### Media Configuration–ICVFX Camera A Output

Once you have configured nodes dedicated to rendering the camera frustums, continue and configure the media sharing.

- In your stage outliner, select **ICVFXCameraA**.[image: Select ICVFXCameraA]
- In the **Details** panel, find the **Media** section:[image: Media section in the Details panel]
- Check the **Enable** checkbox.
- Add a **Media Output Group**. Here, you are configuring which node will render this inner frustum and how it will be shared.
- The node you want to render this camera is **Node_CamA** for **ICVFXCameraA**. If you want to configure ICVFXCameraB, select Node_CamB instead.
- Configure the **MediaOutput type** to be **Nvidia Rivermax Output **to share it using ST 2110. Some settings here are important:Set **Alignment Mode** to **Frame Creation**, which means that your output will start streaming the rendered frustum as soon as it’s available, always respecting the configured frame interval of the stream.
- Set **Frame Locking** mode to be **Block On Reservation**, to make sure you are sharing every frame rendered.
- Enable **DoFrameCounterTimestamp**. This embeds Unreal Engine’s frame number in the video stream, and will be used by the receiving nodes to know which samples correspond to what frame.
- Enforcing **Resolution** isn’t required, because UE will detect the frustum size automatically once it is captured.
- **Frame Rate** is important. The 2110 standard, like SDI, transfers a video frame over the whole frame interval. If you configure your 2110 video stream at 24 fps, each frame takes 41ms to be entirely received by listeners. To minimize latency, and depending on the available bandwidth of your network card, configure your frame rate to be faster than the rate your cluster is presenting. This means that for a cluster running at 24 fps, you should stream out the inner frustum faster than this. Using 48, 60, or an even faster frame rate is preferable, but take into consideration bandwidth usage.
- For the **Interface Address**, use wildcards to make the configuration as flexible as possible to work on different machines with different IPs.
- For the **Stream Address**, pick a unique multicast address to avoid two inner frustums streaming on the same address. If that occurs, receivers won’t be able to distinguish them. In the example shown here, CameraA will use 225.1.1.10 and CameraB will use 225.1.1.11.
- **Capture Synchronization** isn’t needed here since this stream isn’t going to the wall.

Your output configuration should resemble the following image:

[image: SMPTE 2110 nDisplay ICVFX output settings configuration.] SMPTE 2110 nDisplay ICVFX output settings configuration.

#### Media Configuration–ICVFX Camera A Input

Now that the output side of the ICVFXCameraA render is configured, you can work on the reception side. Here, you will configure which nodes will receive the shared render and how they will receive it.

- First, add a **Media Input Group**.
- Add **Cluster Nodes** to receive this output. In this case, you want all nodes that are driving the wall (Node_1, Node_2, Node_3).
- To receive the shared render using ST 2110, configure the **Media Source** to be **Rivermax Media Source**. Some settings need to be set up correctly for low-latency framelocking to work.For **Player Mode**, use **Framelock** to have receivers wait for an expected frame every render. Using the embedded frame number, receiving instances of UE can match video samples with the current frame number. If a frame hasn’t arrived yet, the receiving instances will wait for it with the expectation that it will arrive.
- You can use the **Use Zero Latency** option to have the receiver UE instances wait for a frame number matching the current one with no added latency. Depending on the content, this might not be achievable, so you have the option to add a frame of latency to get more margin waiting for the inner.
- The **Resolution** doesn’t need to be enforced because it will be auto-detected by the receiver UE instances when the stream is received.
- Configure the **Frame Rate** with the same rate you used for the output.
- For the **Interface Address**, use wildcards again because this will be used by multiple nodes of the cluster and they won’t have the same interface IP.
- Configure **Stream Address** and **Port** match the output configuration.
- You can enable **GPU Direct**, however make sure that the GPU and DPU (Mellanox card) are on the same root complex. If they aren't, the 2110 packets can be lost especially if there are multiple input streams.
- To fully enable GPU Direct on input, set `Rivermax.GPUDirectInput=1` on Unreal Engine startup or before starting the Rivermax stream.

You input configuration should resemble the following image:

[image: SMPTE 2110 nDisplay ICVFX input settings configuration.] SMPTE 2110 nDisplay ICVFX input settings configuration.

Your ICVFXCameraA is now configured to be shared from one render node to the cluster. Media settings should look like this:

[image: SMPTE 2110 nDisplay ICVFX media settings configuration.] SMPTE 2110 nDisplay ICVFX media settings configuration.

#### Media Configuration–ICVFX Camera B

When you are done configuring ICVFXCameraA, you can configure ICVFXCameraB which will use mostly the same settings except for the following details:

- Media Output GroupsThe **Cluster Node** rendering ICVFXCameraB will be Node_CamB.
- The **Stream Address** must be different. Use 225.1.1.11, but keep the same **Port** number.

- Media Input GroupsThe **Stream Address** is the only setting you must change to match the output configuration, in this example 225.1.1.11.

You can use a faster frame rate for your 2110 streams to reduce latency. This comes at a higher bandwidth cost, so take that into account based on your network configuration. If there are other devices using bandwidth on the same network, you must also consider them too.

Example bandwidth usage:

- 4k24 RGB10~6.3Gb/s

- 4k48 RGB10~12.6Gb/s

- 8k24 RGB10~25Gb/s

- 8k48 RGB10~50Gb/s

### nDisplay ICVFX Camera Streaming and Synchronous Output (Experimental)

#### Requirements

The other nDisplay area you can update is about how you send your renders to the LED wall. Instead of sending streams from the GPU, you can now send ST 2110 streams directly from the network card. By providing a common PTP time reference to each node, you can framelock and synchronize each stream going to the wall, instead of relying on a synchronization card.

This requires:

- A master clock generating PTP.
- A switch that supports ST 2110 streams.
- A compliant Nvidia network card, such as the ConnectX-6 BlueField-2 card.
- The LED processor must also be able to receive ST 2110 streams.

[image: SMPTE ST 2110 ICVFX synchronous camera streaming.] SMPTE ST 2110 ICVFX synchronous camera streaming.

When configured in this way, all your nodes are configured as headless or offscreen. You don’t need to have mosaic configured or deal with EDID settings anymore, since you are not streaming using the GPU. However, the PTP time reference going to each node needs to be valid all the time.

For this configuration to work, **the optional section about PTP setup mentioned in the deployment phase is mandatory.**

#### Configuration Basics

In terms of nDisplay configuration, this feature doesn’t change how you configure the ICVFX camera streaming. Instead, this feature leverages the media output configuration you can set at the node level to stream out the final back buffer rendered by a given node. You must also configure the framelocking.

When configuring each node’s window size, depending on the LED processor receiving the streams, there might be constraints on this. If the same processor receives two streams, you might need to make each stream the same size. Here's how to enforce that constraint for the same example cluster described previously.

[image: The 3 node streams in their original configuration.] The 3 node streams in their original configuration.

In the example, you have three nodes to send out, Node_1, Node_2 and Node_3. As you don’t have resolution constraints, you can make the nodes window as tight as possible to send the minimum amount of pixels required. In this case, you will set Node_1 and Node_2’s window to the same size by adding a constraint. Consider them as using the same LED processor. The Node_3 stream won’t have this constraint and won’t have the same window size.

#### Node Configuration–Node_1 and Node_2

Begin with the Node_1 and Node_2 configurations. In the original configuration:

- Node_1 used a full-screen node with a window size of 7680x2160 with a viewport of 2640x1408.
- Node_2 used a full-screen node with a window size of 3840x2160 with a viewport of 3344x1408.

[image: The original example configuration settings of Node_1.] The original example configuration settings of Node_1.

[image: The Node_1 stream in the VP_W1 viewport using the original example settings.] The Node_1 stream in the VP_W1 viewport using the original example settings.

[image: The Node_2 stream in the VP_W2 viewport using the original example settings.] The Node_2 stream in the VP_W2 viewport using the original example settings.

- Since viewport VP_W2 is the largest, make the settings for Node_1 and Node_2 identical, and use VP_W2’s size of 3344x1408.
- Enable the **Headless Rendering** setting to set both nodes offscreen, and disable the **Fullscreen** setting.

[image: The modified settings for both Node_1 and Node_2.] The modified settings for both Node_1 and Node_2.

[image: The Node_1 stream in the VP_W1 viewport after changing the settings.] The Node_1 stream in the VP_W1 viewport after changing the settings.

[image: The Node_2 stream in the VP_W2 viewport after changing the settings.] The Node_2 stream in the VP_W2 viewport after changing the settings.

This change added some extra pixels to Node_1's stream to match the dimensions of Node_2’s stream. When viewports are not all equal, it’s important to consider how they are organized per node to minimize wasted bandwidth.

Now, configure the media output of each node. Media can be configured at the node level (final backbuffer) and the viewport level. It’s important to do this configuration on the node to send the final composited and warped result.

- Select Node_1 and find its Media section:[image: Node 1 Media section]
- Enable **Media** configuration:[image: Enable Media configuration]
- Add a **Media Output**:[image: Add a Media Output]
- Configure the Media Output to be **NVIDIA Rivermax Output** and configure the settings accordingly:**Alignment Mode: AlignmentPoint**. You need to align your output with Genlock by using PTP time reference so you need your output to send at known alignment points.
- **Do Continuous Output: True**. If a frame was not rendered in time, your output must continue and repeat the previous frame.
- **Frame Locking Mode: Block on Reservation**. You want to stream all rendered frames.
- **Presentation Queue Size: 2**. Double buffering is ideal to minimize latency.
- **Number of Texture Buffers: 3**. There are no hard requirements for this one.
- **Resolution: Unchecked**. You don't need to enforce a resolution. Leaving it unchecked will create a stream using the size of the node’s back buffer.
- **Frame Rate: **Project dependent. The example uses 24fps but your project might use a different setting.
- **Pixel Format: RGB10**. This can vary for your project and the receiver (LED Processor) must support that format.
- **Interface Address: 10.69.70.**. In this example, all nodes are in the subnet 10.69.70. to facilitate changing which machine is rendering each node. Using a wildcard on the last octet means the selected node is able to resolve to its local interface address.
- **Stream Address**: Unique Node_1 stream address. For this example, use** 225.1.2.1** here and increment the last octet for each node to have a unique multicast address per node. Make sure the multicast group used here is not already used on your network to avoid collisions.
- **Port: 50000**. This example uses 50000 for all nodes and only the multicast address changes.
- **Use GPUDirect: FALSE**. This isn’t supported for framelocked ST 2110 output at the moment.

[image: Configured Media Output settings]

- Configure the **Capture Synchronization** to use **Rivermax (PTP)**. This enables a mechanism enforcing framelocking across the cluster by using an ethernet synchronization barrier leveraging a common PTP time reference for the whole cluster.**Margin (ms): 5**. Use the default value. This is a time margin referenced when the node is about to enter the capture sync barrier, just before queuing a frame for presentation. If it detects that it’s too close to the next alignment point (by the margin), it delays entering the barrier.
- **Barrier Timeout (ms): 3000**. Use the default value. This is a timeout to exit the barrier when all nodes haven’t joined before the timeout period ends.

[image: Configured Capture Synchronization settings]

The Node_1 configuration is now complete, and its settings should look like this:

[image: The Node_1 Media settings for the nDisplay ICVFX camera streaming and synchronous output example.] The Node_1 Media settings for the nDisplay ICVFX camera streaming and synchronous output example.

Now that the Node_1 configuration is complete, proceed to configure Node_2. Its configuration should be identical to Node_1's, except for the **Stream Address**, which needs to be **unique**.

- Configure the Node_2 settings to be identical to Node_1.
- Set the Node_2 **Stream Address** to use 225.1.2.2.

Here’s the final configuration of Node_2:

[image: The Node_2 Media settings for the nDisplay ICVFX camera streaming and synchronous output example.] The Node_2 Media settings for the nDisplay ICVFX camera streaming and synchronous output example.

#### Node Configuration–Node_3

Proceed to configure Node_3. In the original example described above, there was a gap between the two viewports.

[image: The original example viewports setup showing the gap between them.] The original example viewports setup showing the gap between them.

To reduce wasted space, you can configure the viewports to eliminate the gap.

[image: The viewports configured to eliminate the gap.] The viewports configured to eliminate the gap.

Then, as you did for Node_1 and Node_2, configure this node to be headless and adjust its window size to be the minimum required to contain both viewports.

- Instead of using 7680x2160, set the **Window Size** to 6336x1408.
- Enable **Headless Rendering**.

[image: The modified Node_3 settings.] The modified Node_3 settings.

[image: The Node_3 stream showing in the VP_C1 and VP_C2 viewports.] The Node_3 stream showing in the VP_C1 and VP_C2 viewports.

Next, configure the Node_3 media output configuration. Again, the settings will be the same as for Node_1 and Node_2 except for the stream address, which needs to be unique in the cluster.

- Configure the Node_3 settings to be identical to Node_1 and Node_2.
- Set the Node_3 **Stream Address** to use 225.1.2.3.

With this configuration complete, your cluster now uses 5 multicast groups:

- 225.1.1.10:50000 : ICVFXCameraA
- 225.1.1.11:50000 : ICVFXCameraB
- 225.1.2.1:50000 : Node_1
- 225.1.2.2:50000 : Node_2
- 225.1.2.3:50000 : Node_3

Here’s the final configuration of Node_3:

[image: The Node_3 Media settings for the nDisplay ICVFX camera streaming and synchronous output example.] The Node_3 Media settings for the nDisplay ICVFX camera streaming and synchronous output example.

- rendering
- graphics

On this page

- nDisplay ICVFX Camera Streaming (-> ndisplay-workflows-for-smpte-2110-in-unreal-engine)
- Node Configuration (-> ndisplay-workflows-for-smpte-2110-in-unreal-engine)
- Media Configuration–ICVFX Camera A Output (-> ndisplay-workflows-for-smpte-2110-in-unreal-engine)
- Media Configuration–ICVFX Camera A Input (-> ndisplay-workflows-for-smpte-2110-in-unreal-engine)
- Media Configuration–ICVFX Camera B (-> ndisplay-workflows-for-smpte-2110-in-unreal-engine)
- nDisplay ICVFX Camera Streaming and Synchronous Output (Experimental) (-> ndisplay-workflows-for-smpte-2110-in-unreal-engine)
- Requirements (-> ndisplay-workflows-for-smpte-2110-in-unreal-engine)
- Configuration Basics (-> ndisplay-workflows-for-smpte-2110-in-unreal-engine)
- Node Configuration–Node_1 and Node_2 (-> ndisplay-workflows-for-smpte-2110-in-unreal-engine)
- Node Configuration–Node_3 (-> ndisplay-workflows-for-smpte-2110-in-unreal-engine)

# Experimental Pixel Streaming Features

https://dev.epicgames.com/documentation/en-us/unreal-engine/experimental-pixel-streaming-features?application_version=5.9

> New and exciting features in Pixel Streaming that are still in development, but ready for play!

[image: Experimental Pixel Streaming Features]

Learn to use this **Experimental** feature, but use caution when shipping with it.

The below features are exciting new tools we've implemented into Pixel Streaming. Though they provide new possibilities, it's important to note that these are unstable and should be used with caution.
We recommend you do not build critical components of your product on them as they may change or be removed in subsequent releases of Unreal Engine.

## VCam

VCam is a new feature that allows you to use the new VCam actor to stream the video content of the Level Viewport to an output provider.

At this stage, VCam is mostly intended for virtual production use cases. It can be paired with the Live Link VCam iOS application and used for ARKit tracking. This is useful for piloting virtual cameras in Unreal Engine, with Pixel Streaming handling touch events and streaming the Level Viewport as real-time video feedback to the iOS device. For more information on Live Link VCam, please head to this site here: iOS Live Link VCam

### How to use VCam

- Ensure you have the Virtual Camera plugin enabled.
- Add the VCam actor, found under Virtual Production.
- As soon as you add the actor, you'll be presented with the view of the VCam as shown below:
- As soon as the actor is added, it will start streaming. You can start and stop this via the Pixel Streaming Toolbar.
- Once started, open a local browser and navigate to 127.0.0.1 to see your streamed display, or open the Live Link iOS application and navigate to your computer's IP address and press connect.

If you want to interact with the stream through the browser, open the control panel in-browser and change the Control Scheme to Hovering.

## Use Microphone

With Pixel Streaming, you can now allow in-engine playback of a particular peer / player microphone using WebRTC audio through the web browser.

### Setting up Use Microphone in Project

Making your project microphone compatible is simple and only requires a single addition to your project.

- Enable the Pixel Streaming Plugin.
- On any Actor in scene, add the `PixelStreamingAudio` component. You can leave its settings as the default.

Each audio component associates itself with a particular Pixel Streaming player/peer (using the the Pixel Streaming Player ID)

### Using Microphone in Stream

- Once your project is set up with the `PixelStreamingAudio` component, run your application as per usual for Pixel Streaming (packaged or standalone with Pixel Streaming launch args) and launch your signalling server.
- Connect to your signalling server via web browser.
- Open the frontend settings panel and set `Use Mic` to `true`. Click **Restart** at the bottom to reconnect.
- Your browser may ask permission to use your microphone, ensure you allow access.
- Speak into your microphone, you should hear your voice played back through the stream!

For cloud streaming you’ll need HTTPS set up for this to work, see steps to create a HTTPS certificate in the VR guide below. Additionally, Firefox requires HTTPS for successful microphone capture in both local and cloud deployments.

## Pixel Streaming in Virtual Reality

Virtual Reality (VR) Pixel Streaming is a new feature that provides users with the means to connect to a VR-compatible application using Pixel Streaming. This allows users to enjoy a VR experience with their own headsets, without running a local application.

### Setting Up the Project

For this example, we'll use the Virtual Reality template project.

- **Create** a new project using the Virtual Reality template.
- Enable the **Pixel Streaming 2** plugin and disable the **OpenXR** plugin. **Restart** the editor.[image: Disable-OpenXR-plugin] [image: Enable-pixel-streaming-2-plugin]
- In the Content Browser, search for `Asset_Guideline` and delete `BP_AssetGuideline`. When prompted, click **Force Delete**.[image: Asset-guideline-in-search-bar][image: BP-asset-guideline-in-search-bar]
- Now search for **VRPawn** in the Content Browser. Double-click the VRPawn to open it, then compile the Blueprint. If working properly it should compile successfully. **Save** and **close** this Blueprint.
- Open **Editor Preferences > Level Editor > Play** and add `-PixelStreamingURL=ws://127.0.0.1:8888 -PixelStreamingEnableHMD -ResY=1080`.

If you’re using Pixel Streaming 2, you can also **EnableHMD** in the PixelStreaming2 plugin settings. Doing so will remove the need to run `-PixelStreamingEnableHMD`.

[image: Enable-HMD-in-plugin]

You only need to specify the vertical resolution, as the horizontal resolution automatically adjusts to suit the device's aspect ratio. Set the best resolution for your performance-to-quality ratio.

### Creating the Required Certificates

You need a HTTPS certificate to use VR with Pixel Streaming. This is due to the fact that the standard for WebXR requires that the API is only available to sites loaded over a secure connection (HTTPS). For production use, you will need to use a secure origin to support WebXR. You can find extra information on these requirements here: https://developer.oculus.com/documentation/web/port-vr-xr/#https-is-required.

For this example, we'll be setting up a basic certificate via Gitbash. If you don't have Gitbash installed prior, head to this page here for steps on how to install Gitbash: https://www.atlassian.com/git/tutorials/git-bash.

- Create a `certificates` folder inside the `SignallingWebServer` directory, as shown below:
- Right click inside the `certificates` directory and open Gitbash. Type in `openssl req -x509 -newkey rsa:4096 -keyout client-key.pem -out client-cert.pem -sha256 -nodes`.
- Press Enter multiple times, until the command is complete. You'll know it's done when done as it will have created 2 `.pem` files in the certificates folder.
- Open the `config.json` file found in the `SignallingWebServer` folder, set the `https` value to `true`. If the `config.json` file is missing, runt he signalling server once.

You should now be ready to run and test your VR application!

The certificate created above is only for testing purposes. For full cloud deployment, you will need to organize a proper certificate.

### Joining the VR Stream

For this example, we'll be using the Meta Quest 2.

- Start the `start_with_stun.bat` script found in `\SignallingWebServer\platform_scripts\cmd`
- Going back to the editor, run the application standalone. As you added the launch args in previous steps, it should connect to the signalling server once it's fully started up.
- Now using your VR headset, open the web browser and enter your computer's IP address. You'll be presented with a "Connection not secure" page, open the "Advanced" tab and click "Proceed to IP"
- You should see the application streamed to two views in the browser window. Click the XR button on the left to switch to VR.
- Done! You should now be in your Pixel Streamed VR project!

## Pixel Streaming Player

The Pixel Streaming Player allows you to display active Pixel Streams within your Unreal Engine project on a display within 3D space. With this, you can display cloud-hosted content as a media source within local applications.

The Pixel Streaming Player is an experimental feature with an API currently under development. As of 5.4, the Pixel Streaming Player is compatible with H264, VPX, and AV1 encoders.

Setting up the Pixel Streaming Player has changed in Pixel Streaming 2. For more information, please refer to Pixel Streaming 2 Overview (-> pixel-streaming-2-overview-in-unreal-engine).

### Setting up your Pixel Streaming Player

- Enable the Pixel Streaming 2 plugin.
- Create a new **Blueprint** class (Actor). Save and name this anything you like.
- Open the new Blueprint class and add the **PixelStreaming2Peer **component.[image: Pixel-streaming-2-peer-in-components]
- Drag the **PixelStreamingSignalling** component into the event graph. Drag off from this node and create a **Connect** node. Connect **BeginPlay** to the input of the new node and enter "ws://127.0.0.1:80" into the URL value. Adding the port to the URL field is importing, as the Pixel Streaming Player may not automatically connect to the right port. For Windows, the port is 80, but for Linux, use port 8080.
- Select the PixelStreaming2Peer component and add the **OnStreamerList** event from the details panel.[image: On-streamer-list-event-node]
- From the new On Streamer List node; drag from the output and create a **Branch** node. From the true output, drag and create a **Subscribe** node. From the Streamer List array output, drag out and create a **Length** node. Do this again and create a **Get (a ref)** node. Plug your Get (a ref) node into your “Subscribe” nodes streamer **id input**. Lastly, create a **Greater (>)** node from your Length node, ensure the value is **0**, and plug this into your branch condition input. You can see the finished blueprint below:
- Select the PixelStreaming2Peer component in the Components window on the left. In the Details window under Properties, you should see Pixel Streaming Video Consumer. Select the dropdown and choose Pixel Streaming Media Texture. Name and save it accordingly. [image: Pixel-streaming-2-texture-component]
- Drag your blueprint actor into the scene. Create a simple plane object and then resize and shape it into a suitable display.
- Drag your saved Pixel Streaming media texture directly from the Content Browser onto the plane in the scene. This will automatically create a material and apply it to the object.[image: Drag-material-to-the-plane]
- Play in editor. You should now see your PiE stream displayed on the plane. This will work with any active stream, such as an editor stream, an external packaged project or a remote stream. Simply update the connect node to suit the IP and port of the stream.[image: Play-in-editor-stream]

- experimental
- guide
- pixel streaming
- platform delivery

On this page

- VCam (-> experimental-pixel-streaming-features)
- How to use VCam (-> experimental-pixel-streaming-features)
- Use Microphone (-> experimental-pixel-streaming-features)
- Setting up Use Microphone in Project (-> experimental-pixel-streaming-features)
- Using Microphone in Stream (-> experimental-pixel-streaming-features)
- Pixel Streaming in Virtual Reality (-> experimental-pixel-streaming-features)
- Setting Up the Project (-> experimental-pixel-streaming-features)
- Creating the Required Certificates (-> experimental-pixel-streaming-features)
- Joining the VR Stream (-> experimental-pixel-streaming-features)
- Pixel Streaming Player (-> experimental-pixel-streaming-features)
- Setting up your Pixel Streaming Player (-> experimental-pixel-streaming-features)

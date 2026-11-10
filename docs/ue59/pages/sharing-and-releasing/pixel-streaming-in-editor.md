# Pixel Streaming in Editor

https://dev.epicgames.com/documentation/en-us/unreal-engine/pixel-streaming-in-editor?application_version=5.9

> Editor streaming is an experimental feature that leverages the power of Pixel Streaming to allow users to stream and interact with the Unreal Editor remotely. Additionally, there is now a new toolbar specifically for Pixel Streaming functions within the editor.

[image: Pixel Streaming in Editor]

Learn to use this **Experimental** feature, but use caution when shipping with it.

## Pixel Streaming Toolbar

The Pixel Streaming Toolbar is your primary means for controlling Pixel Streaming within the editor.

To access the Pixel Streaming toolbar, make sure you have the Pixel Streaming plugin enabled.

#### Use Remote Signalling Server

Toggling this option stops the editor from creating an embedded signalling server when you use the Level and Full editor streaming options. You must manually launch a signalling server external to the editor and specify its URL. The default values should be sufficient in most use cases however.

#### Embedded Signalling Server Options

These values specify the ports of the embedded signalling server created when you use the editor streaming functions. Unless you specifically need to change these, the default values should cover most use cases.

Due to Unreal Editor not running as sudo on Linux, it cannot create port bindings below 1000. As port 80 is the default viewer port for streaming, we've changed the default editor streaming viewer port to 8080 on Linux. You must specify this port in your browser URL when connecting to the stream.

This only applies to the embedded signaling server. An external signaling server will still use port 80, which does not need to be specified in the browser.

#### Virtual Camera

The virtual camera is a new experimental feature added to Pixel Streaming. For more detail on how to use this feature, please refer to the Virtual Camera (-> experimental-pixel-streaming-features) page.

#### Codecs

These options specify what encoder your stream will use. For more information about each codec as well as comparisons, please refer to the Support Codecs (-> unreal-engine-pixel-streaming-reference) page.

## Editor Streaming

Editor streaming streams the Unreal Editor to web browsers, including browsers on mobile devices. This opens new potential for remote interaction with the editor as well as providing security benefits and enabling a new way for users to collaborate. Furthermore, eliminating the need to run the application on local hardware can open up new, efficient work pipelines.

Editor streaming leverages the base Pixel Streaming module, meaning users who are familiar with Pixel Streaming their applications will feel right at home with editor streaming.

### How do I use it?

Editor streaming is designed to be as easy to use as possible. To start editor streaming:

- Make sure you have the Pixel Streaming plugin enabled.

- Once the editor restarts, locate the new **Pixel Streaming** menu on your toolbar.

- Open the Pixel Streaming menu and click **Stream Full Editor**.

- Your editor is now being streamed. Open a browser and navigate to your public IP (127.0.0.1 works for testing a local stream).

- Open the toolbar again and you will see several IP addresses that you may be able to access your stream from, depending on your network configuration.

The above steps will launch a signaling server that is embedded within Unreal Editor. If you prefer a workflow that uses the signaling server found in the **PixelStreamingInfrastructure** repo, check the **Use Remote Signaling Server** check box and enter the IP address of this signaling server before beginning streaming.

### How do I stream my editor in the cloud?

Streaming the editor from a cloud instance can be achieved in much the same manner as streaming your regular pixel streamed applications, albeit with a few minor modifications:

- If your application launch args contain: `-res=1920x1080` or similar, you'll want to replace this with `-EditorPixelStreamingRes=1920x1080`

- If your application launch args contain: `-resx=1920 -resy=1080` or similar, you'll want to replace this with `-EditorPixelStreamingResX=1920 -EditorPixelStreamingResY=1080`

- If your application launch args contain: `-renderoffscreen`, you'll want to add `-EditorPixelStreamingStartOnLaunch=true` to start streaming without needing to interact with the toolbar

- If you want to use a signaling server that isn't the server embedded within the engine, you'll want to add `-EditorPixelStreamingUseRemoteSignallingServer=true`

- An example of what your final command will look like is: `Engine\Binaries\Win64\UnrealEditor-Cmd.exe -project Path\To\Your\Project.uproject -RenderOffscreen -EditorPixelStreamingRes=1920x1080 -EditorPixelStreamingStartOnLaunch=true -PixelStreamingURL=ws://127.0.0.1:8888`

Editor streaming when rendering off screen is currently experimental and may be unstable.

### Stream Level Editor

Alongside full editor streaming, there is an option to exclusively stream the editor's level viewport. With only the level viewport streamed, connected peers will not see any surrounding elements, including but not limited to the outliner, content browser, and any and all pop-up menus.

To use level streaming, select **Stream Level Editor** from the toolbar option instead of **Stream Full Editor**.

- experimental
- guide
- pixel streaming
- platform delivery

On this page

- Pixel Streaming Toolbar (-> pixel-streaming-in-editor)
- Use Remote Signalling Server (-> pixel-streaming-in-editor)
- Embedded Signalling Server Options (-> pixel-streaming-in-editor)
- Virtual Camera (-> pixel-streaming-in-editor)
- Codecs (-> pixel-streaming-in-editor)
- Editor Streaming (-> pixel-streaming-in-editor)
- How do I use it? (-> pixel-streaming-in-editor)
- How do I stream my editor in the cloud? (-> pixel-streaming-in-editor)
- Stream Level Editor (-> pixel-streaming-in-editor)

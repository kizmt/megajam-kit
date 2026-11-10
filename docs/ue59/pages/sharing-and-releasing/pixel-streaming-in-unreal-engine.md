# Pixel Streaming

https://dev.epicgames.com/documentation/en-us/unreal-engine/pixel-streaming-in-unreal-engine?application_version=5.9

> Run your Unreal Engine application on a server in the cloud and stream its rendered frames and audio to browsers and mobile devices over WebRTC.

[image: Pixel Streaming]

**Pixel streaming** for Unreal Engine (UE) works similarly to streaming a video using an online streaming service, except that you can also interact with the application through the streaming interface. UE's pixel streaming system can run a packaged UE application on a desktop PC or a cloud server alongside a small stack of web services. You can then connect to the pixel streaming application's frontend using a web browser on a desktop machine or mobile device of your choice.

Once connected, you can then stream the rendered frames and audio from the remote UE application and interact with it through the frontend, which supports the following types of input:

- Keyboard
- Mouse
- Touch input
- Gamepad + XR
- Custom HTML5 UI created for the player's web page

Because the frontend is embedded in a web page, you do not need to install or download any additional software to support pixel streaming.

The pages in this section provide instructions and reference guides for deploying and managing your own pixel streaming application with UE.

## Getting Started

- [image: Pixel Streaming Overview] Pixel Streaming OverviewDescribes the components that make up the Pixel Streaming system and how they work together at a high level. (-> overview-of-pixel-streaming-in-unreal-engine)
- [image: Getting Started with Pixel Streaming in Unreal Engine] Getting Started with Pixel Streaming in Unreal EngineGet up and running streaming an Unreal Engine application from one computer to other computers and mobile devices on the same network. (-> getting-started-with-pixel-streaming-in-unreal-engine)

## Development Guides

- [image: Hosting and Networking Guide] Hosting and Networking GuideAdvanced networking configuration and other considerations for hosting the Pixel Streaming system. (-> hosting-and-networking-guide-for-pixel-streaming-in-unreal-engine)
- [image: Pixel Streaming in Editor] Pixel Streaming in EditorEditor streaming is an experimental feature that leverages the power of Pixel Streaming to allow users to stream and interact with the Unreal Editor remotely. Additionally, there is now a new toolbar specifically for Pixel Streaming functions within the editor. (-> pixel-streaming-in-editor)
- [image: Stream Tuning Guide] Stream Tuning GuideInformation about how quality, latency, and resiliency are achieved in Pixel Streaming while additionally giving guidance about cases where optimizing for either image quality, latency, or resiliency is more important than a balanced stream. (-> stream-tuning-guide)
- [image: Interacting with the Pixel Streaming System] Interacting with the Pixel Streaming SystemWays your Unreal Engine application can interact with the Pixel Streaming system at runtime. (-> interacting-with-the-pixel-streaming-system-in-unreal-engine)
- [image: Experimental Pixel Streaming Features] Experimental Pixel Streaming FeaturesNew and exciting features in Pixel Streaming that are still in development, but ready for play! (-> experimental-pixel-streaming-features)
- [image: Pixel Streaming 2 Overview] Pixel Streaming 2 OverviewLearn about the next-generation of Pixel Streaming. (-> pixel-streaming-2-overview-in-unreal-engine)

## Reference

- [image: Pixel Streaming Reference] Pixel Streaming ReferenceSupported browsers, networking ports, and configuration options for the components of the Pixel Streaming system. (-> unreal-engine-pixel-streaming-reference)

## Pixel Streaming Infrastructure

- [image: Customizing the Player Web Page] Customizing the Player Web PageHow to customize the web page that plays back streamed video and audio, and how to exchange events between the page and the UE5 application. (-> customizing-the-player-web-page-in-unreal-engine)
- [image: Pixel Streaming Infrastructure] Pixel Streaming InfrastructureThe Pixel Streaming servers and web frontend are now externally hosted on GitHub, consisting of the Signalling Server, Matchmaker and SFU. This is often referred to as the "Pixel Streaming Infrastructure" (-> pixel-streaming-infrastructure)

## Sample Content

- [image: Pixel Streaming Sample Project] Pixel Streaming Sample ProjectThe Pixel Streaming Demo showcase demonstrates how you can design Unreal Engine content for viewers to experience as a live stream in a Web browser or mobile device. (-> pixel-streaming-sample-project-for-unreal-engine)

- pixel streaming
- cloud platform
- platform delivery

On this page

- Getting Started (-> pixel-streaming-in-unreal-engine)
- Development Guides (-> pixel-streaming-in-unreal-engine)
- Reference (-> pixel-streaming-in-unreal-engine)
- Pixel Streaming Infrastructure (-> pixel-streaming-in-unreal-engine)
- Sample Content (-> pixel-streaming-in-unreal-engine)

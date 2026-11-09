# Media Framework

https://dev.epicgames.com/documentation/en-us/unreal-engine/media-framework-in-unreal-engine?application_version=5.9

> Working with Media Playback functionality in Unreal Engine.

[image: Media Framework]

While there is currently a **Startup Movie Player** system in UE, it can only be used for playing startup movies while the Engine loads up. It cannot be used to play movies in-game,
say for instance as part of a UI element or perhaps on a Static Mesh in your level like a movie playing on a TV. This is where the **Media Framework** comes in, as not only
will it allow you to do both of the examples presented above, it will also provide much more general media playback capabilities (outlined below) and is also scheduled to replace the deprecated Startup Movie Player framework in a future engine release.

The Media Framework in Unreal Engine is:

- Both Engine & Slate Agnostic
- Able to support Localized Audio & Video Tracks
- Accessible in the Content Browser, Material Editor, & Sound System
- Available for use with Blueprint & the UMG UI Designer
- Able to support Streaming Media
- Able to Fast Forward, Reverse, Play, Pause, & Scrub Media
- Able to support Pluggable Players

As stated above, the Media Framework itself is both Engine and Slate agnostic, which means it can be used in pretty much any application not just the game engine or the Editor. There are layers on top of the framework that provide media playback capabilities to other sub-systems as well, such as **Engine**, **Blueprints**, **Slate**, and
the **UMG UI Designer**. This will cover most expected use cases, such as in-game textures & UI, in-Editor video tutorials, and Marketplace videos.

This page contains several links to additional documentation regarding Media Framework. It is recommended that you check out the Overview page for more of a breakdown of the features of Media Framework as well as the How-To and Quick Start pages for step-by-step instructions to working with Media Framework.

## Essentials

- [image: Electra Media Player] Electra Media PlayerAn overview of how to use the Electra Media Player. (-> electra-media-player-in-unreal-engine)
- [image: Media Framework Overview] Media Framework OverviewDescribes the core features and functionality for video playback using the Media Framework tools in UE5. (-> media-framework-overview-for-unreal-engine)
- [image: Media Framework Quick Start] Media Framework Quick StartA guide on how to quickly add and play videos inside your game levels with the Media Framework tools. (-> media-framework-quick-start-for-unreal-engine)
- [image: Media Framework Tutorials] Media Framework TutorialsLinks to step-by-step guides for working with Media Framework in Unreal Engine 5. (-> media-framework-unreal-engine-tutorials)
- [image: Media Editor Reference] Media Editor ReferenceBreaks down the interface elements and options within the Media Editor used with Media Framework. (-> media-editor-reference-for-unreal-engine)
- [image: Media Framework Technical Reference] Media Framework Technical ReferenceTechnical information regarding Media Framework in Unreal Engine 5. (-> media-framework-technical-reference-for-unreal-engine)
- [image: Media Asset Reference] Media Asset ReferenceInformation about Media asset settings. (-> media-asset-reference-for-unreal-engine)

- vfx
- media framework
- video playback
- media player

On this page

- Essentials (-> media-framework-in-unreal-engine)

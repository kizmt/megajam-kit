# Level Streaming

https://dev.epicgames.com/documentation/en-us/unreal-engine/level-streaming-in-unreal-engine?application_version=5.9

> Asynchronously loading and unloading levels during play to decrease memory usage and create seamless worlds.

[image: Level Streaming]

The Level Streaming feature makes it possible to load and unload map files into memory as well as toggle their visibility during play. This makes it possible to have worlds broken up
into smaller chunks so that only the relevant parts of the world are taking up resources and being rendered at any point. If done properly, this allows for the creation of very
large, seamless games that can make the player feel as if they are playing within a world that dwarfs them in size.

- [image: Level Streaming Overview] Level Streaming OverviewStreaming Levels can be loaded with Level Streaming Volumes or programmatically with Blueprints or C++. (-> level-streaming-overview-in-unreal-engine)
- [image: Level Streaming Volumes Reference] Level Streaming Volumes ReferenceGuide to using volumes to control the streaming of Levels based on the player's viewpoint. (-> level-streaming-volumes-reference-in-unreal-engine)
- [image: Loading and Unloading Levels using Blueprints] Loading and Unloading Levels using BlueprintsHow to stream levels with a custom streaming Actor created with Blueprints (-> loading-and-unloading-levels-using-blueprints-in-unreal-engine)
- [image: Loading and Unloading Levels using C++] Loading and Unloading Levels using C++How to stream levels with a custom streaming Actor created in C++ (-> loading-and-unloading-levels-using-cplusplus-in-unreal-engine)
- [image: World Composition] World CompositionSystem for managing large worlds including origin shifting technology. (-> world-composition-in-unreal-engine)
- [image: Level Streaming using Volumes] Level Streaming using VolumesHow to use volumes to control the streaming of Levels based on the player's viewpoint. (-> level-streaming-using-volumes-in-unreal-engine)

## World Composition

World Composition is a specific form of level streaming used to create large worlds. Levels are arranged in a planar grid, and streamed in as the player approaches them.

- [image: World Composition] World CompositionSystem for managing large worlds including origin shifting technology. (-> world-composition-in-unreal-engine)

World Composition is a legacy system used for level streaming. We recommended you use World Partition (-> world-partition-in-unreal-engine) for level streaming in projects using Unreal Engine 5.0 or later.

- level streaming

On this page

- World Composition (-> level-streaming-in-unreal-engine)

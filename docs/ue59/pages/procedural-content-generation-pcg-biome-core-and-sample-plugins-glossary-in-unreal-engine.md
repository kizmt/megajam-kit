# PCG Biome Glossary

https://dev.epicgames.com/documentation/en-us/unreal-engine/procedural-content-generation-pcg-biome-core-and-sample-plugins-glossary-in-unreal-engine?application_version=5.9

> Learn the terms used when working with the PCG Biome Core and Sample Plugins.

[image: PCG Biome Glossary]

Learn to use this **Experimental** feature, but use caution when shipping with it.

The PCG Biome Core and Sample Plugins are examples of how to use the PCG Framework (-> procedural-content-generation-overview). This page provides definitions for many of the terms used in the documentation for this project.

 assembly (PCG)

PCG point data created and exported from all static meshes and instanced static meshes found in a level, using the **Asset Action > Create PCG Assets from Level(s)**.

 biome

A volume in space defined by a biome definition and a list of biome assets.

 biome actor

Blueprint actors that are used to set up biomes in a world. These include biome volumes, biome splines, and biome textures.

 biome asset

A data asset that contains asset properties to be spawned by Biome Core.

 Biome Core

A data-driven biome creation tool that provides a fixed pipeline with customizable steps. The PCG Biome Core plugin contains a collection of PCG graphs and sub-graphs used to procedurally generate biomes.

 Biome Core Runtime

A separate PCG component and graph, used for GPU runtime generation of detailed assets spawning around the camera.

 Biome Sample

The PCG Biome Sample plugin contains a level, data assets and custom PCG graphs used to showcase procedural biome generation using Biome Core.

 child points

All points created from the recursive transform step to spawn child assets.

 filter graph

A PCG Graph that processes points and writes to a defined filter attribute from its logic or texture projection.

 filters

A list of filter graphs.

 generator

A data asset with **type**, **priority**, and **generator graph** properties, referred to by biome assets entries.

 generator graph

A PCG graph that produces root points used for placing assets in the world.

 global Biome Core graph

On the Biome Core BP actor, the PCG component has the Biome Core graph assigned to it. When executed, the graph gets all data produced by all local Biome Core graphs in each Biome actor. The data goes through a difference by priority step, then spawns the remaining points as static meshes, assemblies, or actors.

 global parameters

Graph parameters on the global Biome Core that impact its global behavior. Includes filter graphs and the debug cache display.

 hierarchical generation

Subdivides the volume into multiple grids. Hierarchical generation speeds up local updates by distributing computing at different grid sizes and outputs data into separate actors that can be streamed individually. For more information, see Using PCG Generation Modes (-> using-pcg-generation-modes-in-unreal-engine).

 injected data

External data injected at different stages of the Biome Core to exclude or add points. Divided in different types based on their entry point within the pipeline: exclusions and custom biome data.

 local biome cache

Point data computed locally for each biome actor and used as the bounding shape for generators used in the biome. The local cache is also used to apply the biome definition onto the produced points.

 local Biome Core graph

Each biome actor has its own PCG component and a local Biome Core graph assigned to it. The local Biome Core graph generates all data locally per biome actor. The output of that local generation is then used in the global Biome Core graph.

 local parameters

Graph parameters in the local Biome Core that impact its local behavior. This includes preview mode, debug local cache display, and biome blending controls. Partitioning Biome Core graph parameters that impact its global behavior. Includes filter graphs and the debug cache display.

 root points

All points provided by the generators and their graphs.

 runtime assets

A data asset containing properties of assets to be spawned by Biome Core runtime.

 runtime hierarchical generation

Generates grid cells at runtime based on streaming source or PCG generation source components. Uses the generation radius of each grid size configured in the PCG Graph. Uses the same multi-level grid size approach as the Hierarchical Generation. For more information, see Using PCG Generation Modes (-> using-pcg-generation-modes-in-unreal-engine).

 transform graph

A PCG Graph that takes points from a generator or parent transformed points to change their properties. Used for generating and placing child points.

- landscape
- experimental
- building virtual worlds
- procedural generation

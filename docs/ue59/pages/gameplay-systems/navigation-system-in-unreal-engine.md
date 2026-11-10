# Navigation System

https://dev.epicgames.com/documentation/en-us/unreal-engine/navigation-system-in-unreal-engine?application_version=5.9

> Describes the different components of the Navigation System available in Unreal Engine.

[image: Navigation System]

The **Unreal Engine Navigation System** allows artificial intelligence Agents to navigate the Level using pathfinding.

The system generates a Navigation Mesh from the collision geometry in the Level and divides the mesh into tiles. These tiles are then divided into polygons to form a graph that is used by Agents when navigating to their destination. Each polygon is assigned a cost which Agents use to determine the optimal path with the overall lowest cost.

The Navigation System includes a variety of components and settings that can modify the way the Navigation Mesh is generated, such as the cost assigned to polygons. This, in turn, affects the way Agents navigate through your Level. You can also connect areas of the Navigation Mesh that are not contiguous, such as platforms and bridges.

The Navigation System includes three **Generation Modes**: **Static**, **Dynamic**, and **Dynamic Modifiers Only**. These modes control the way the Navigation Mesh is generated in your project and provide a variety of options to suit your needs.

The system also provides two methods of avoidance for Agents: **Reciprocal Velocity Obstacles (RVO)**, and the **Detour Crowd Manager**. These methods allow Agents to navigate around dynamic obstacles and other Agents during gameplay.

In the following guides you will learn about the different components and settings of the Navigation System and how you can use them to create interactive artificial intelligence Agents for your project.

You can download the Navigation System sample project here. It contains sample levels covering the guides below.

- [image: Basic Navigation] Basic NavigationThis guide shows how to use the Navigation System in Unreal Engine. (-> basic-navigation-in-unreal-engine)
- [image: How to Modify the Navigation Mesh] How to Modify the Navigation MeshDescribes the different ways you can modify Navigation Mesh generation in Unreal Engine. (-> modifying-the-navigation-mesh-in-unreal-engine)
- [image: Custom Navigation Areas and Query Filters] Custom Navigation Areas and Query FiltersThis guide shows how to use Custom Areas and Query Filters with the Navigation System. (-> custom-navigation-areas-and-query-filters-in-unreal-engine)
- [image: Using Avoidance With the Navigation System] Using Avoidance With the Navigation SystemThis guide shows how to use avoidance with the Navigation System. (-> using-avoidance-with-the-navigation-system-in-unreal-engine)
- [image: Using Navigation Invokers] Using Navigation InvokersThis guide shows how to use Navigation Invokers. (-> using-navigation-invokers-in-unreal-engine)
- [image: Optimizing Navigation Mesh Generation Speed] Optimizing Navigation Mesh Generation SpeedA How-To guide on how to optimize the Navigation Mesh generation speed. (-> optimizing-navigation-mesh-generation-speed-in-unreal-engine)
- [image: Navigation Mesh Resolutions User Guide] Navigation Mesh Resolutions User GuideThis guide will teach you how to use multiple resolutions within the same Navigation Mesh in Unreal Engine. (-> navigation-mesh-resolutions-user-guide)
- [image: World Partitioned Navigation Mesh] World Partitioned Navigation MeshAn overview of how to use a Navigation Mesh with World Partition. (-> world-partitioned-navigation-mesh)
- [image: Automatic Navigation Link Generation] Automatic Navigation Link GenerationLearn how to automatically generate Navigation Links in Unreal Engine. (-> automatic-navigation-link-generation)
- [image: Navigation Components] Navigation ComponentsBriefly describes how to use Navigation Components to modify or extend pathfinding functionality. (-> navigation-components-in-unreal-engine)

- ai
- navigation

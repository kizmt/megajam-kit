# Actors and Geometry

https://dev.epicgames.com/documentation/en-us/unreal-engine/actors-and-geometry-in-unreal-engine?application_version=5.9

> Defines Actors and describes how to use them in level design. Also includes a rundown of the most common types of Actors.

[image: Actors and Geometry]

An **Actor** is any object that can be placed into a Level, such as a camera, Static Mesh, or player start location. Actors support 3D transformations such as translation, rotation, and scaling. They can be created (spawned) and destroyed through gameplay code (C++ or Blueprints).

In C++, `AActor` is the base class of all Actors.

To create a Level, you place Actors into a Level (map), then move and scale them to create an environment, and add script to make them behave the way you want. This section covers the basic techniques of working with Actors, such as placing, selecting, and transforming Actors. It also covers some of the most commonly used Actor types.

## Working with Actors

%understanding-the-basics/actors/transforming-actors:Topic%

## Common Actor Types

This is not a comprehensive list of every Actor type available in Unreal Engine. Some plugins and project templates add their own Actors, and certain Actors may not be available for all projects.

- actors

On this page

- Working with Actors (-> actors-and-geometry-in-unreal-engine)
- Common Actor Types (-> actors-and-geometry-in-unreal-engine)

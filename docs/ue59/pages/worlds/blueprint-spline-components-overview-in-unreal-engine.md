# Blueprint Spline Components Overview

https://dev.epicgames.com/documentation/en-us/unreal-engine/blueprint-spline-components-overview-in-unreal-engine?application_version=5.9

> An overview of how to use the Blueprint Spline Components and Blueprint Spline Mesh Components.

[image: Blueprint Spline Components Overview]

At their core, a **Blueprint Spline Component** is just a path for you to define and use positional data. You can use it to move **Actors** (or other **Components**) around the world, or place a series of **Actors** (or other **Components**) along the spline. They are fully editable in the Blueprint Viewport and in the Level Editor, with the ability to add/remove/duplicate Spline Points, change their tangent types, and even animate them on tick. Further, they are also editable using the **Blueprint Construction Script**, taking in edits made in the Blueprint Viewport or Level Editor, and modifying them further.

**Blueprint Spline Mesh Components** have a completely different use case. These deform a single **Static Mesh** along a two point spline. You cannot add more Spline Points to a Blueprint Spline Mesh Component, but the two points are completely controllable through Blueprints.

While their use cases are very different, they share the same procedures for adding them to a Blueprint, and use the same editing tools.

- splines

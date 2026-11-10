# Construction Script

https://dev.epicgames.com/documentation/en-us/unreal-engine/construction-script-in-unreal-engine?application_version=5.9

> Executed when instances of a Blueprint are created to perform initialization actions.

[image: Construction Script]

 [image: User Construction Script]

The **Construction Script** runs following the Components list when an instance of a Blueprint Class is created. It contains a node graph that is executed allowing the Blueprint Class instance to perform initialization operations. This can be extremely powerful as actions like performing traces into the world, setting meshes and materials, and so on can be used to achieve context-specific setup. For instance, a light Blueprint could determine what type of ground it is placed upon and choose the correct mesh to use from a set of meshes or a fence Blueprint could perform traces extending out in each direction to determine how long of a fence is needed to span the distance.

Only Blueprint Classes contain **Construction Scripts**. Level Blueprints do not have them.

The execution entry point into the **Construction Script** Graph is through a **ConstructionScript** node that is always present.

## Working with Graphs

See the Blueprint Editor Graph Editor (-> graph-editor-for-the-blueprints-visual-scripting-editor-in-unreal-engine) for a detailed guide to working with the **ConstructionScript** and other Graphs within Blueprints.

- blueprints
- graphs

On this page

- Working with Graphs (-> construction-script-in-unreal-engine)

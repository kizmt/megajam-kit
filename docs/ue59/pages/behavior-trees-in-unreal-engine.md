# Behavior Trees

https://dev.epicgames.com/documentation/en-us/unreal-engine/behavior-trees-in-unreal-engine?application_version=5.9

> Documents the Behavior Trees asset in Unreal Engine and how it can be used to create Artificial Intelligence (AI) for non-player characters in your projects.

[image: Behavior Trees]

**Behavior Trees** assets in Unreal Engine 5 (Unreal Engine) can be used to create artificial intelligence (AI) for non-player characters in your projects. While the Behavior Tree asset is used to execute branches containing logic, to determine which branches should be executed, the Behavior Tree relies on another asset called a **Blackboard **which serves as the "brain" for a Behavior Tree.

The Blackboard contains several user-defined **Keys** that hold information used by the Behavior Tree to make decisions. For example, you could have a Boolean Key called Is Light On which the Behavior Tree can reference to see if the value has changed. If the value is true, it could execute a branch that causes a roach to flee. If it is false, it could execute a different branch where the roach maybe moves randomly around the environment. Behavior Trees can be as simplistic as the roach example given, or as complex as simulating another human player in a multiplayer game that finds cover, shoots at players, and looks for item pickups.

If you are new to Behavior Trees in Unreal Engine, it is recommended that you go through the **Behavior Tree Quick Start** guide to quickly get an AI character up and running. If you are already familiar with the concept of Behavior Trees from other applications, you may want to check out the **Essentials** section which contains an overview of how Behavior Trees work in Unreal Engine, a User Guide to working with Behavior Trees and Blackboards, as well as reference pages for the different types of nodes available within Behavior Trees.

## Starting Out

- [image: Behavior Tree Quick Start Guide] Behavior Tree Quick Start GuideThis guide shows how to use Behaviour Trees to set up an AI character that will patrol or chase a player. (-> behavior-tree-in-unreal-engine---quick-start-guide)

## Essentials

- [image: Behavior Tree Overview] Behavior Tree OverviewDescribes the concepts behind Behavior Trees in Unreal Engine and how they differ from traditional Behavior Trees. (-> behavior-tree-in-unreal-engine---overview)

- [image: Behavior Tree User Guide] Behavior Tree User GuideDescribes how to create and edit Behavior Trees and Behavior Tree related assets. (-> behavior-tree-in-unreal-engine---user-guide)

- [image: Behavior Tree Node Reference] Behavior Tree Node ReferenceOutlines the different types of nodes available when working in the Behavior Tree Editor. (-> behavior-tree-node-reference-in-unreal-engine)

- ai
- artificial intelligence
- behavior trees
- ai systems

On this page

- Starting Out (-> behavior-trees-in-unreal-engine)
- Essentials (-> behavior-trees-in-unreal-engine)

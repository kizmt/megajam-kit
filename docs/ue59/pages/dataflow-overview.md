# Dataflow Overview

https://dev.epicgames.com/documentation/en-us/unreal-engine/dataflow-overview?application_version=5.9

> Overview of the Dataflow graph system in Unreal Engine.

[image: Dataflow Overview]

## Introduction

 [image: Dataflow graph system]

The **Dataflow Graph **system is a **node-based procedural asset generation environment** inside the Unreal Engine editor.

Dataflow exists as an asset in the **Content Browser** and contains a node graph that produces a specific asset after it is evaluated.

Dataflow is implemented as a **dependency-based node graph** where changes to a node trigger reevaluation of its downstream dependencies. Each node in the graph is designed to take one or more inputs, process the data, and produce one or more outputs, which are then passed to the next dependent node.

## System Benefits

 [image: Captain Roux]

Dataflow was created to **improve iteration times** when creating certain asset types in the engine. The same Dataflow graph can be **used by multiple assets** and the graph itself can produce different results depending on the inputs given by the source asset.

Dataflow is a **general-purpose system** that can be adapted to various physics asset types, such as **Chaos Cloth**, **Chaos Flesh**, and **Geometry Collection fracturing**.

Dataflow is also **designed to be extensible** by developers using C++. Developers can further adapt the system to accommodate their specific needs.

## Dataflow vs traditional workflows in Unreal Engine

 [image: Workflow differences]

The Dataflow Graph system differs from traditional workflows in the following ways:

**Traditional workflow**:

- **Generally destructive workflow**: When creating the asset, the changes are permanent and cannot be easily reversed. This increases iteration time and limits exploration.

- **Manual workflow**: The developer has to go through the workflow manually to produce different assets of the same type.

**Dataflow workflow**:

- **Procedural, non-destructive workflow**: The Dataflow nodes can be modified inside the graph and the results are reflected instantly. All of the steps in the graph can be reverted or skipped if desired.

- **Automatic workflow**: The Developer can automate the workflow to process thousands of assets automatically.

- **Modular workflow**: The same Dataflow graph can be used with multiple assets, each providing different inputs and generating different results.

- **Flexible workflow**: Developers can easily connect and disconnect different nodes to apply different effects and can see the results instantly.

## Extensible and Battle Tested

 [image: Lego Fortnite]

The Dataflow Graph system was **designed with extensibility** in mind. Developers can create **custom Dataflow nodes with C++** to extend the system. Dataflow can also be used to fully automate creation of specific types of assets, such as clothing simulation and Geometry Collection fracturing.

Dataflow was designed for and tested in Lego Fortnite. The system has been tested in production and will continue to improve in future versions of Unreal Engine.

On this page

- Introduction (-> dataflow-overview)
- System Benefits (-> dataflow-overview)
- Dataflow vs traditional workflows in Unreal Engine (-> dataflow-overview)
- Extensible and Battle Tested (-> dataflow-overview)

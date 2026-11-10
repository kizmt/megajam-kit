# EQS Node Reference: Contexts

https://dev.epicgames.com/documentation/en-us/unreal-engine/eqs-node-reference-contexts-in-unreal-engine?application_version=5.9

> Describes how Contexts are used within Tests and Generators in the EQS system.

[image: EQS Node Reference: Contexts]

Within the Environment Query System (EQS), **Contexts** provide a frame of reference for any Tests (-> eqs-node-reference-tests-in-unreal-engine) or Generators (-> eqs-node-reference-generators-in-unreal-engine) used. A Context can be as simple as the **Querier **(who is performing the Test) or more complex such as **All Actors of a Type**. A Generator, such as a **Points: Grid**, can use a Context that returns multiple locations or Actors. This will create a grid (of the defined size and density) at the location of each Context. In addition to Engine supplied Contexts, you can create custom Contexts in Blueprint with the **EnvQueryContext_BlueprintBase **class or through C++ code.

## EnvQueryContext_Item

**Items **are created by the Generator, and if using the **EQS Testing Pawn**, they are the spheres that appear in the Editor. An EnvQueryContext_Item is either a location (FVector) or an Actor (AActor).

## EnvQueryContext_Querier

The **Querier** is the Pawn that is currently possessed by an AI Controller and is executing the Behavior Tree (-> behavior-trees-in-unreal-engine) that initiated the Environment Query. An example of where Querier as the Context could be used is if you want to search the environment around the AI character for an item they can use or find a place that provides cover from the player, or just to determine the current location of the AI performing the query.

In the **Details** panel for a Generator type, you can assign the Querier as a Context for the following properties:

| Generator | Property |
| --- | --- |
| **Actors of Class** | **Search Center**[image: Actors of Class] |
| **Current Location** | **Query Context**[image: Current Location] |
| **Points: Circle** | **Circle Center**[image: Circle Point] |
| **Points: Cone** | **Center Actor**[image: Cone Point] |
| **Points: Donut** | **Center**[image: Donut Point] |
| **Points: Grid** | **Generate Around**[image: Grid Point] |
| **Points: Pathing Grid** | **Generate Around**[image: Pathing Grid Point] |

## EnvQueryContext_BlueprintBase

You can create a custom Context through Blueprint using the **EnvQueryContext_BlueprintBase** Class. This provides four functions that can be overridden, enabling you to add your custom Contexts for use within Tests in a query.

To use a custom Context:

- Create a new Blueprint of the **EnvQueryContext_BlueprintBase** class.[image: Create a new Blueprint of the EnvQueryContext BlueprintBase class]
- In EnvQueryContext_BlueprintBase, click **Override** and select the type of function you wish to use.[image: Click Override and select the type of function you wish to use]

Refer to the table below for a description of each function override:

| Function | Description |
| --- | --- |
| Provide Single Location | This returns a single location (vector). How you generate that location is up to you. For example, the function below will return the trace hit location of a random Actor (one that is found in the DesiredObjectType array, such as Pawn, Vehicle) found within 1500 cm of the Querier:[image: Provide Single Location] |
| Provide Single Actor | This returns a single Actor. You can obtain that Actor through any method you desire. In this example, the function will return Player 0's controlled Actor:[image: Provide Single Actor] |
| Provide Locations Set | This returns an array of locations (vectors). How you generate these locations is up to you. In the example below, this function will trace from 16 evenly spaced locations on a circle with a radius of 1500 units, returning successful hits on the environment:[image: Provide Locations Set] |
| Provide Actors Set | This returns an array of Actors. You can use any desired method to obtain those Actors. In the example below, we use a Get All Actors of Class node to retrieve our specified class as the Actors to return:[image: Provide Actors Set] |

- ai
- eqs
- environmental query system
- eqs node reference list

On this page

- EnvQueryContext_Item (-> eqs-node-reference-contexts-in-unreal-engine)
- EnvQueryContext_Querier (-> eqs-node-reference-contexts-in-unreal-engine)
- EnvQueryContext_BlueprintBase (-> eqs-node-reference-contexts-in-unreal-engine)

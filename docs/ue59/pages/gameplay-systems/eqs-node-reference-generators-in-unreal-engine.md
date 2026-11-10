# EQS Node Reference: Generators

https://dev.epicgames.com/documentation/en-us/unreal-engine/eqs-node-reference-generators-in-unreal-engine?application_version=5.9

> Describes how Generators are used within the EQS system.

[image: EQS Node Reference: Generators]

Within the Environmental Query System (EQS), **Generators **are used to produce the locations or Actors (referred to as **Items**) that will be tested and weighted, with the highest weight location or Actor being returned to the Behavior Tree (-> behavior-trees-in-unreal-engine). There are different types of Generators that you can use to retrieve information and they can be created either in Blueprint or C++.

## Actors of Class

[image: Actors Of Class]

The **Actors of Class **Generator finds all of the Actors of a given class within the specified **Search Radius **around the **Search Center**. The Actors returned can be used as Items in your tests.

[image: The Actors of Class Generator finds all of the Actors of a given class within the specified Search Radius around the Search Center]

| Property | Description |
| --- | --- |
| **Searched Actor Class** | The Actor class to look for (for example, Pawn, Character). |
| **Generate Only Actors in Radius** | If enabled, this will only return Actors of the specified **Searched Actor Class** within the **Search Radius. **If disabled, it will return all Actors of the specified **Searched Actor Class **in the game world. You can also optionally include user-defined **Data Bindings **to go along with this option. |
| **Search Radius** | The max distance to look for the specified **Searched Actor Class**. Zero and negative values will never return any results. |
| **Search Center** | The context to center to search for, such as from the Querier or perhaps some other context. |
| **Option Name** | This property is inherited from the base class of the Generator ActorsOfClass. It is mostly used when displaying the Name of this Generator (for example, HUDs or output messages). |
| **Auto Sort Tests** | If enabled, Tests will automatically be sorted for best performance before the query is run. |

## Composite

[image: Composite Generator]

When setting up an EQS Query, there may be instances where you want to include more than one **Generator **in a test case. With the **Composite **node, you can add multiple **Generators** to an array, which can be used in your Tests.

[image: With the Composite node you can add multiple Generators to an array]

| Property | Description |
| --- | --- |
| **Generators** | Enables you to add multiple Generators to include in the test. |
| **Allow Different Item Types** | This allows tests to be performed on Generators with different Item types. The generator will use **ForcedItemType** for raw data and you must ensure the proper memory layout of child Generators as they write to memory blocks through their Item types. For example, data must fit into blocks allocated by **ForcedItemType** while Tests will read item location/properties through **ForcedItemType**. |
| **Forced Item Type** | The Item type to use in Tests. For example Actor, Direction, or Point. |
| **Option Name** | This property is inherited from the base class of the Generator ActorsOfClass. It is mostly used when displaying the name of this Generator (for example, HUDs or output messages). |
| **Auto Sort Tests** | If enabled, Tests will automatically be sorted for best performance before the query is run. |

## Current Location

[image: Current Location]

The **Current Location** Generator can be used to get the location of the specified **Query Context ** to validate Tests.

[image: The Current Location Generator can be used to get the location of the specified Query Context for the purposes of validating Tests]

| Property | Description |
| --- | --- |
| **Query Context** | The Context to use in the Test and its current location. |
| **Option Name** | This property is inherited from the base class of the Generator ActorsOfClass. It is mostly used when displaying the Name of this Generator (for example, HUDs or output messages). |
| **Auto Sort Tests** | If enabled, Tests will automatically be sorted for best performance before the query is run. |

## Custom Generators

In addition to the Generator types provided by the Engine, you can create your custom Generators by creating a new Blueprint of the **EnvQueryGenerator_BlueprintBase** class type.

[image: Custom Generators]

Generators developed in C++ will execute generally faster than that developed through Blueprint.

Once created, your custom Generator will be available within an Environmental Query:

[image: Your custom Generator will be available within an Environmental Query]

Inside your custom Generator, there is a function you can override called **Do Item Generation**:

[image: There is a function you can override called Do Item Generation]

When you override this function, you'll get an array of locations that are the Context locations passed in from the Environmental Query.

[image: You will get an array of locations that are the Context locations passed in from the Environmental Query]

Depending on the Context, the array may vary. For example, this could be an array of just a single entry containing the location of the Querier, or, it could be the locations of every health pickup inside your Level.

Since functions can only return one value, the Do Item Generation function has two arrays it can pass back to the Environment Query: **Add Generated Actor** and **Add Generated Vector**.

[image: Add Generated Actor]

The Add Generated Actor node will add an Actor to the Actor return array. This node can also be used with the **Add Generated Vector **node (below) to also return location values. How the Generator determines what it is passing back to the Behavior Tree is based on what Blackboard key you are setting from the Environment Query node.

[image: Add Generated Actor]

## Points: Circle

[image: Circle Generator]

The **Points: Circle** Generator radiates traces out from the **Circle Center**, returning the hits on the edge of the radius (of the generated Circle) as Items.

[image: Circle Generator radiates traces out from the Circle Center]

| Property | Description |
| --- | --- |
| **Circle Radius** | The max radius of the circle that will expand out from the **Circle Center** context. |
| **Spawn Between** | The space (in centimeters) between the Items generated on the outer edge of the circle. |
| **Number Of Points** | The number of Items to be generated on a circle. |
| **Arc Direction** | Define the mode at which the arc direction is determined. You can choose between **Two Points **(direction from the location of one context to another) or **Rotation **(where the context's rotation will be used as a direction). |
| **Arc Angle** | Defines the angle at which the arc is measured in degrees. |
| **Circle Center** | The context used as the center for the circle. |
| **Ignore Any Context Actors when Generating Circle** | When enabled, ignore tracing into context Actors when generating the circle. |
| **Circle Center ZOffset** | Optional offset to apply to the context in the Z-axis. |
| **Trace Data** | Options related to how the trace is performed. **Trace Mode**: Shape used for geometry tracing.**Navigation Filter**: Navigation filter used for tracing.**Extent X**: Shape parameter for the trace. |
| **Projection Data** | If the resulting Items should be projected onto the NavMesh (and which NavMesh data set to use). |
| **Option Name** | This property is inherited from the base class of the Generator ActorsOfClass. It is mostly used when displaying the Name of this Generator (for example, HUDs or output messages). |
| **Auto Sort Tests** | If enabled, Tests will automatically be sorted for best performance before the query is run. |

## Points: Cone

[image: Cone Generator]

The **Points: Cone** radiates a trace out from the **Center Actor **in the shape of a cone with the specified **Cone Degrees **as Items.

[image: Cone radiates a trace out from the Center Actor in the shape of a cone with the specified Cone Degrees as Items]

| Property | Description |
| --- | --- |
| **Aligned Points Distance** | The distance between each point on the same angle. |
| **Cone Degrees** | Maximum degrees of the generated cone. |
| **Angle Step** | The step of the angle increase. Angle step must be greater than or equal to one. Smaller values generate fewer Items. |
| **Range** | Distance to generate the cone from the context. |
| **Center Actor** | The Actor (or Actors) that will generate a cone in their facing direction. |
| **Include Context Location** | Whether to include **Center Actor **locations when generating Items. This option skips the **MinAngledPointsDistance** parameter. |
| **Projection Data** | If the resulting Items should be projected onto the NavMesh (and which NavMesh data set to use). |
| **Option Name** | This property is inherited from the base class of the Generator ActorsOfClass. It is mostly used when displaying the Name of this Generator (for example, HUDs or output messages). |
| **Auto Sort Tests** | If enabled, Tests will automatically be sorted for best performance before the query is run. |

## Points: Donut

[image: Donut Generator]

The **Points: Donut **Generator, creates a shape-based trace with the user specified **Number Of Rings** radiating from the **Center **Context.

[image: Donut Generator, creates a shape based trace with the user specified Number Of Rings radiating from the Center Context]

| Property | Description |
| --- | --- |
| **Inner Radius** | The minimum distance between point and context. |
| **Outer Radius** | The maximum distance between point and context. |
| **Number of Rings** | The number of rings to generate. |
| **Points Per Rig** | Number of Items to generate for each ring. |
| **Arc Direction** | Define the mode in which the arc direction is determined. You can choose between **Two Points** (direction from the location of one context to another) or **Rotation** (where the context's rotation will be used as a direction). |
| **Arc Angle** | Defines the angle at which the arc is measured in degrees. |
| **Use Spiral Pattern** | If enabled, the rings of the wheel will be rotated in a spiral pattern. If disabled, they will all be at a zero rotation, looking more like spokes on a wheel. |
| **Center** | The context to center the search on, such as from the Querier or perhaps some other context. |
| **Projection Data** | If the resulting Items should be projected onto the NavMesh (and which NavMesh data set to use). |
| **Option Name** | This property is inherited from the base class of the Generator ActorsOfClass. It is mostly used when displaying the Name of this Generator (for example, HUDs or output messages). |
| **Auto Sort Tests** | If enabled, Tests will automatically be sorted for best performance before the query is run. |

## Points: Grid

[image: Grid Generator]

The **Points: Grid **Generator will generate a grid of Items around the specified querier assigned under **Generate Around**.

[image: Grid Generator will generate a grid of Items around the specified querier assigned under Generate Around]

| Property | Description |
| --- | --- |
| **GridHalfSize** | The height and width of the grid of Items to generate. |
| **Space Between** | The distance between the grid Items. |
| **Generate Around** | The context used to generate the grid around. |
| **Projection Data** | If the resulting Items should be projected onto the NavMesh (and which NavMesh data set to use). This will move Items that may be inside walls or blocked, back onto the NavMesh, which can create bunching if a grid line happens to be just beyond the edge of the NavMesh. |
| **Option Name** | This property is inherited from the base class of the Generator ActorsOfClass. It is mostly used when displaying the Name of this Generator (for example, HUDs or output messages). |
| **Auto Sort Tests** | If enabled, Tests will automatically be sorted for best performance before the query is run. |

## Points: Pathing Grid

[image: Pathing Grid]

You can use **Points: Pathing Grid **to generate a grid around the given Context location.

[image: Pathing Grid to generate a grid around the given Context location]

| Property | Description |
| --- | --- |
| **Path to Item** | If the pathfinding direction should be towards (enabled) or away (disabled) from the Item. |
| **Navigation Filter** | Navigation filter to use in pathfinding. |
| **GridHalfSize** | Half of square's extent (edge distance). |
| **Space Between** | Defines the generation density of points on the grid. |
| **Generate Around** | The context used to generate the grid around. |
| **Projection Data** | If the resulting Items should be projected onto the NavMesh (and which NavMesh data set to use). This will move Items that may be inside walls or blocked, back onto the NavMesh, which can create bunching if a grid line happens to be just beyond the edge of the NavMesh. |
| **Option Name** | This property is inherited from the base class of the Generator ActorsOfClass. It is mostly used when displaying the Name of this Generator (for example, HUDs or output messages). |
| **Auto Sort Tests** | If enabled, Tests will automatically be sorted for best performance before the query is run. |
| **Scan Range Multiplier** | Multiplier for the max distance between point and context. |

- ai
- eqs
- environmental query system
- eqs node reference list

On this page

- Actors of Class (-> eqs-node-reference-generators-in-unreal-engine)
- Composite (-> eqs-node-reference-generators-in-unreal-engine)
- Current Location (-> eqs-node-reference-generators-in-unreal-engine)
- Custom Generators (-> eqs-node-reference-generators-in-unreal-engine)
- Points: Circle (-> eqs-node-reference-generators-in-unreal-engine)
- Points: Cone (-> eqs-node-reference-generators-in-unreal-engine)
- Points: Donut (-> eqs-node-reference-generators-in-unreal-engine)
- Points: Grid (-> eqs-node-reference-generators-in-unreal-engine)
- Points: Pathing Grid (-> eqs-node-reference-generators-in-unreal-engine)

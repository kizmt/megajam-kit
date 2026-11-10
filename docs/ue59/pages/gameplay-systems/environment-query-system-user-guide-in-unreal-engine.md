# Environment Query System User Guide

https://dev.epicgames.com/documentation/en-us/unreal-engine/environment-query-system-user-guide-in-unreal-engine?application_version=5.9

> Describes the common methods of creating and working with EQS assets.

[image: Environment Query System User Guide]

This page covers the typical workflows for enabling, creating, and editing Environmental Query System (EQS) assets.

## Enabling EQS

Before you can start working with EQS, you will need to enable it from the **Project Settings** menu.

- Under the **Settings > Plugins ** section, enable the **Environment Query Editor** option if necessary.[image: Enable the **Environment Query Editor** option]

## Creating an EQS Query

To create an EQS Asset:

- Click the **+Add** button in the **Content Drawer**, then under **Artificial Intelligence**, select **Environment Query**.[image: Click the +Add button in the Content Drawer, then under Artificial Intelligence, select Environment Query]
- Enter in a name for your new EQS asset.[image: Enter in a name for your new EQS asset]

In addition to Environment Query, you can create custom Generator (-> eqs-node-reference-generators-in-unreal-engine) and Context (-> eqs-node-reference-contexts-in-unreal-engine) Blueprint assets in the Content Drawer.

## Editing an EQS Query

Inside the EQS asset, you can use a Generator (-> eqs-node-reference-generators-in-unreal-engine) to produce the locations or Actors that will be tested and weighted, provide a Context (-> eqs-node-reference-contexts-in-unreal-engine) or frame of reference, and Tests (-> eqs-node-reference-tests-in-unreal-engine) to determine which item from the Generator is the best option. The following section will illustrate how to create each of these within the EQS asset.

To add a Generator:

- Right-click in the EQS Graph and select your desired Generator type.[image: Right-click in the EQS Graph and select your desired Generator type]After adding a Generator, drag off the Root node and connect it to your Generator.[image: Drag off the Root node and connect it to your Generator]While you can have more than one Generator connected to the Root, only the left-most Generator is used in the Query.

To add a Test:

- Right-click on a Generator and select a Test to add.[image: Right-click on a Generator and select a Test to add]After adding a Test, it will appear attached to the Generator. Select the Test to adjust properties in the **Details **panel.[image: Select the Test to adjust properties in the Details panel]

To define a Context:

- In the **Details **panel for a Test, change the **EnvQueryContext** to your desired Context.[image: Change the EnvQueryContext to your desired Context]The property name may vary based on the type of Test. Please see Tests (-> eqs-node-reference-tests-in-unreal-engine) for more information.

## Previewing an EQS Query

You can preview the results of an EQS Query inside the Editor, where weighted/filtered results will be represented by debugging spheres.

[image: You can preview the results of an EQS Query inside the Editor]

In the image above, we debug an EQS Query that returns a location that provides a line of sight to the Player Character in the Level.

Please see AI Debugging (-> ai-debugging-in-unreal-engine) or EQS Testing Pawn (-> environment-query-testing-pawn-in-unreal-engine) for more information.

## Using EQS with Behavior Trees

After creating EQS Query, you can run the query inside a Behavior Tree (-> behavior-trees-in-unreal-engine) as part of a **Task.**

- Inside a Behavior Tree, right-click and add the **Run EQS Query** Task node.[image: Right-click and add the Run EQS Query Task node]
- For **Run EQS** **Query**, assign the **Query Template** (desired EQS asset) to execute, and the **Blackboard Key** it should return.[image: Assign the Query Template to execute and the Blackboard Key it should return]The Blackboard Key that is returned will be the highest weight result (Object or Vector). In the example above, we have an EQS Query that is used to locate the Player and provide that location back to a Blackboard Key called **MoveToLocation. **You can optionally add parameters to pass to the EQS asset through the **Query Config** option.

## Using EQS with Native Code

While EQS Queries generally run within Behavior Trees, you can also use them directly from native code. The following example shows a hypothetical query that finds a safe place for a character or item to spawn within a specific zone:

 C++

```
// These names must match the variable names used in the query
	static const FName SafeZoneIndexName = FName(TEXT("SafeZoneIndex"));
	static const FName SafeZoneRadiusName = FName(TEXT("SafeZoneRadius"));

	// Run a query to find a safe spawn point based on the zone's index and a safety radius
	bool AMyActor::RunPlacementQuery(const UEnvQuery* PlacementQuery)
	{
		if (PlacementQuery)
		{
			// Set up a query request
```

- ai
- eqs
- environment query system
- eqs essentials

On this page

- Enabling EQS (-> environment-query-system-user-guide-in-unreal-engine)
- Creating an EQS Query (-> environment-query-system-user-guide-in-unreal-engine)
- Editing an EQS Query (-> environment-query-system-user-guide-in-unreal-engine)
- Previewing an EQS Query (-> environment-query-system-user-guide-in-unreal-engine)
- Using EQS with Behavior Trees (-> environment-query-system-user-guide-in-unreal-engine)
- Using EQS with Native Code (-> environment-query-system-user-guide-in-unreal-engine)

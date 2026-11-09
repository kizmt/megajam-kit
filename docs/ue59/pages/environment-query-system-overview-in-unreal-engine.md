# Environment Query System Overview

https://dev.epicgames.com/documentation/en-us/unreal-engine/environment-query-system-overview-in-unreal-engine?application_version=5.9

> Overview page for Environment Query System.

[image: Environment Query System Overview]

The **Environment Query System** (or EQS for short) is a feature within the AI Tools in Unreal Engine 5 (Unreal Engine) that can be used for collecting data about the environment. Then, through the use of a Generator (-> eqs-node-reference-generators-in-unreal-engine), the system can ask questions about that data through a variety of user-defined Tests (-> eqs-node-reference-tests-in-unreal-engine), returning the best **Item** that fits the types of questions being asked. Some example use-cases for EQS could be to find the closest health pickup or ammo, figure out which enemy is the highest threat, or find a line of sight to the Player (an example of which is shown below).

[image: Find line of sight to the Player]

The conceptual idea and theory behind EQS come from Unreal Engine 3's **Environment Tactical Query** (ETQ) system which you can read more about in the following article, Asking the Environment Smart Questions.

## EQS Basics

EQS Query assets can be created in the **Content Drawer **and can be edited inside a special **Environmental Query Editor**. The Environmental Query Editor is a node-based editor where you can add a Generator node to produce Items, add your desired Tests to run on those Items and the Context (-> eqs-node-reference-contexts-in-unreal-engine) in which to run them. Unreal Engine supplies many Generator types by default, however, you can create your custom Generators through Blueprint (or C++ for even faster execution).

[image: Add a Distance Test to our existing Generator] Above, we add a Distance Test to our existing Generator.

Similar to Generators, there are several different types of Tests you can run to filter and (or) score the Items returned. Unlike Generators, custom Tests can only be created through C++. Multiple Tests can be added to a Generator and is a common practice to narrow down the Item results that are returned. The order in which you add Tests to a Generator does not matter as filter Tests are done before scoring Tests. This is done so that fewer Items are returned and need to be scored. Refer to the table below for the type of tests.

| Node Type | Description |
| --- | --- |
| **Generator** | This produces the locations or Actors, referred to as **Items**, that will be tested and weighted. |
| **Contexts** | These are a frame of reference for the various Tests and Generators. |
| **Tests** | These are how the Environment Query decides which Item from the Generator is the "best" option. |

Please refer to the EQS Node Reference (-> environment-query-system-node-reference-in-unreal-engine) page for more information on each type.

Once you have set up your EQS Query, you can run it through a Behavior Tree (-> behavior-trees-in-unreal-engine) using the **Run EQS Query **Task node.

[image: Run EQS Query Task node]

For a full walk-through of creating and using an EQS Query, please see the EQS Quick Start Guide.

## Enabling EQS

Before you can start working with EQS, you will need to enable it from the **Project Settings** menu.

- Under the **Settings > Plugins ** section, enable the **Environment Query Editor** option if necessary.[image: Enable the Environment Query Editor option]

## Previewing an EQS Query

You can preview the results of an EQS Query inside the Editor, where weighted/filtered results will be represented by debugging spheres.

[image: Debug Spheres]

In the image above, we debug an EQS Query that returns a location that provides a line of sight to the Player Character in the Level.

Please see AI Debugging (-> ai-debugging-in-unreal-engine) or EQS Testing Pawn (-> environment-query-testing-pawn-in-unreal-engine) for more information.

- ai
- eqs
- environment query system
- eqs essentials

On this page

- EQS Basics (-> environment-query-system-overview-in-unreal-engine)
- Enabling EQS (-> environment-query-system-overview-in-unreal-engine)
- Previewing an EQS Query (-> environment-query-system-overview-in-unreal-engine)

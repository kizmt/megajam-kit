# Environment Query System

https://dev.epicgames.com/documentation/en-us/unreal-engine/environment-query-system-in-unreal-engine?application_version=5.9

> Documents the Environment Query System (EQS) and how it can be used to query the environment for data. That data can then be used to provide the AI with data used in the decision-making process on how to proceed.

[image: Environment Query System]

The **Environment Query System (EQS) **is a feature within the Artificial Intelligence system in Unreal Engine 5 (Unreal Engine) that is used to collect data from the environment. Within EQS, you can ask questions about the data collected through a variety of different Tests which produces an Item that best fits the type of question asked.

An EQS Query can be called from a Behavior Tree (-> behavior-trees-in-unreal-engine) and used to make decisions on how to proceed based on the results of your Tests. EQS Queries are primarily made up of Generators (-> eqs-node-reference-generators-in-unreal-engine) (which are used to produce the locations or Actors that will be tested and weighted) and Contexts (-> eqs-node-reference-contexts-in-unreal-engine) (which are used as a frame of reference for any Tests or Generators). EQS Queries can be used to instruct AI characters to find the best possible location that will provide a line of sight to a player to attack, the nearest health or ammo pickup, or where the closest cover point (among other possibilities).

Once you have a general understanding of how Behavior Trees work in Unreal Engine and want to have your AI query the environment, you may want to start with the **Environment Query System Quick Start **guide which will walk you through an end-to-end example of having the AI find the best possible position to attack from a range against the player. Also refer to the Essentials section for an overview of EQS, a User Guide to working with EQS, and a node reference page that breaks down the available nodes and properties within EQS.

## Starting Out

- [image: Environment Query System Quick Start] Environment Query System Quick StartThe Environment Query System Quick Start aims to get you up to speed on some of the systems and tools for working with EQS and AI. (-> environment-query-system-quick-start-in-unreal-engine)

## Essentials

- [image: Environment Query System Overview] Environment Query System OverviewOverview page for Environment Query System. (-> environment-query-system-overview-in-unreal-engine)

- [image: Environment Query System User Guide] Environment Query System User GuideDescribes the common methods of creating and working with EQS assets. (-> environment-query-system-user-guide-in-unreal-engine)

- [image: Environment Query System Node Reference] Environment Query System Node ReferenceEnvironment Query System Node Reference page. (-> environment-query-system-node-reference-in-unreal-engine)

- [image: Environment Query Testing Pawn] Environment Query Testing PawnOutlines how you can use the EQS Testing Pawn to debug and view what your EQS Queries are doing. (-> environment-query-testing-pawn-in-unreal-engine)

- ai
- behavior trees
- ai systems
- eqs
- environment query system

On this page

- Starting Out (-> environment-query-system-in-unreal-engine)
- Essentials (-> environment-query-system-in-unreal-engine)

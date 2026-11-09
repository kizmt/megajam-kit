# City Sample PCG and MCP Server Interaction

https://dev.epicgames.com/documentation/en-us/unreal-engine/city-sample-pcg-and-mcp-server-interaction-in-unreal-engine?application_version=5.9

> An overview of using prompts with the MCP server to modify the City Sample PCG.

## Introduction

The City Sample PCG and its PCG primitive framework are designed to work with an MCP server. Using the PCG graph generation skill and the shape grammar definition skill, a LLM can interact with the different PCG graphs present in the level. From basic prompts that alter a few parameters to more complex endeavors like modifying the structure of a PCG graph, the MCP server can help explore the possibilities of procedural generation with PCG and UE. Before proceeding with interacting with the City Sample PCG and an MCP server, we strongly suggest you read Working with PCG and LLMs Using Unreal MCP (-> working-with-pcg-and-llms-using-unreal-mcp-in-unreal-engine).

## Basic Prompting

Here are some prompt examples that work with the current setup.

**Prompt**: **Make the city look older by only using older building styles.**

After analyzing the levels in the different PCG graphs, the LLM can find the building PCG graph and the assigned city sample building PCG graph as an input to enforce the use of specific building styles. The tooltips for this primitive feature provide a complete description of all the building styles available, including:

- The overall look.

- Type of building such as residential, commercial, or business.

- Their approximate date of construction.

Using this information, the LLM can enforce building styles only from older times.

**Prompt**: **Ensure no building is higher than 200 m.**

The LLM can recognize that the building PCG graph features a height parameter for different buildings and either clamp it with the Clamp node or input a precise value to limit the height of the buildings.

**Prompt**: **This city is located in a tropical latitude. Adjust the vegetation accordingly.**

With the help of semantic search and given that you have tropical trees and vegetation assets available in your project, the LLM can automatically replace all the tree assets that it can find in the PCG graph with corresponding tropical trees.

**Prompt**: **Adjust the lighting of the scene so it is set in Bogota at 9 AM On the 29th of July 2026.**

With the help of the Default Lighting Outdoor skill, the LLM can modify the lighting of the scene and adjust the parameters to exactly match the geographic location required, by modifying sun position, atmosphere thickness, and volumetric cloud material. You can also do this by providing specific images.

**Prompt**: **Make road width twice as large as their current.**

Since the road width parameters are available under the Road PCG Graph, the LLM can find it and adjust those parameters all at once for all road categories: local, collector, and arteries.

**Prompt**: **Increase the amount of parking available in the city.**

There is already a branch of the PCG_3_2_2_LeftOverLots graph that points directly to the parking PCG graph. The LLM can find it and ensure that more lots are fed to that branch, increasing the amount of parking.

## Advanced Prompting

Below are some more advanced prompt examples that can work as a starting point for  more planning and back-and-forth conversation because they involve deeper modification of some PCG graphs. You need a deeper understanding of how the PCG graph works in order to check the quality of the LLM's work.

**Prompt**: **Add another category of districts to the current procedural city.**

Currently the city features three categories of districts called small, medium, and large. The LLM can recognize the three branches available in the graph and create another one based on new size parameters, by mimicking one of the branches. It can then reintegrate everything accordingly.

**Prompt**: **Remove all the parked cars in the city.**

The LLM can recognize that parked cars are present both in the parking and on the streets. Removing the cars from the parking area requires removing the spawning of the asset. Removing the cars on the streets is more complicated since it needs to either modify the current shape grammar definition asset or create a duplicate of the current sidewalk that does not feature any cars.

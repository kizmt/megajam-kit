# Working with PCG and LLMs Using Unreal MCP

https://dev.epicgames.com/documentation/en-us/unreal-engine/working-with-pcg-and-llms-using-unreal-mcp-in-unreal-engine?application_version=5.9

> Guidance and workflow recommendations for PCG-driven LLM workflows using the Unreal MCP server.

Learn to use this **Experimental** feature, but use caution when shipping with it.

The Unreal MCP (-> unreal-mcp-in-unreal-editor) server provides LLM-driven access to Unreal Engine and can interact with a variety of engine systems and editor workflows.

This guide focuses on the dedicated PCG toolset you can access through the MCP server. These tools are designed to manipulate Procedural Content Generation (PCG) (-> procedural-content-generation-framework-in-unreal-engine) systems and graphs directly using LLM interaction. PCG workflows involve complex graph structures, procedural logic, and attribute-driven data flow, it is important to follow specific practices.

This document summarizes recommended workflows and practical usage patterns gathered from day-to-day production use.

## Prerequisites

Enable the **Unreal MCP** plugin and follow the startup process to begin working with the MCP server. For more information on how to use the Unreal MCP plugin, see Unreal MCP (-> API).

After loading the Unreal MCP server, start by loading the **PCG Toolset** and then the **PCG graph generation skill**. The PCG graph generation skill provides the LLM with the foundational understanding required for reliable graph manipulation and generation.

PCG skill loading is a mandatory part of session setup. Without the proper skill context, the LLM will often:

- Misunderstand PCG concepts
- Overcomplicate solutions
- Misuse nodes or parameters
- Produce unreliable graph logic

For more information on how to load a skill, refer to your LLMs documentation.

## Skill_PCGGraphGeneration

The primary skill for tasks that involve generating content through repeatable rules or spatial computation, such as scattering vegetation, populating city blocks, or building road networks. It knows the full library of available primitive nodes and how to wire them together correctly.

Use this skill when the task can be expressed as a system or a pattern, not a one-off placement.

## Key Principles

The LLM performs best when:

- It is properly grounded in context.
- It has analyzed existing examples.
- It is given explicit context.
- It is kept within well-defined tasks.
- It is iterated through tight feedback loops.
- It is encouraged to reuse and adapt existing solutions whenever possible.

## Recommended Workflow

The most effective LLM workflows in Unreal Engine are:

- Collaborative between you and your LLM
- Reference-driven
- Iterative

When using the Unreal MCP server with the PCG toolset it is recommended to use the following workflow:

- Load the Unreal MCP (-> API) server.
- Load the PCG toolset. This can be done within your LLM or by going to **Edit > Plugins** and enabling the **PCGToolset** plugin.
- Load the PCG graph generation skill. This is done within your LLM.
- Identify relevant example graphs.
- Select relevant assets or actors manually in the **Content Browser**.
- Ask your LLM to review references before planning.
- Ask for a plan or graph review before execution.
- Execute incrementally to provide oversight.
- Supervise and course-correct actively during execution.

## Setting up Context

### Use Existing PCG Example Graphs

Reference-driven workflows consistently produce the most reliable results.

One of the most effective ways to improve LLM output quality in PCG workflows is to explicitly reference existing example graphs.

This includes:

- Example graphs provided in the PCG plugin
- Internal project example graphs
- Existing production-ready graphs
- Reference implementations created by experienced users

These graphs should be treated as operational ground truth for the LLM.

Without references, the model may:

- Overcomplicate solutions
- Misuse nodes or parameters
- Build unreliable graph logic
- Ignore established workflow conventions

For complex tasks, encourage the model to:

- Inspect existing examples first
- Reuse established patterns
- Follow existing graph conventions
- Compare proposed solutions against working implementations

Many can be found in the **Engine > Plugins > Procedural Content Framework (PCG) > SampleContent** folder and can be analyzed by your LLM.

Even though this guidance already exists inside the PCG graph generation skill, models may still overlook references and attempt to build solutions from first principles. Reinforcing the importance of references during the session significantly improves consistency and accuracy.

### Adapt Existing Patterns

In many cases, it is more effective to reuse or duplicate an existing graph than to build a new one from scratch.

A good general workflow is:

- Reuse an existing graph if it already solves the problem.
- Duplicate and modify a graph if it is close to the desired result.
- Only create a new graph when no suitable reference exists.

This approach preserves proven methods and graph structures while reducing ambiguity. This avoids unnecessary node creation and can significantly reduce context window usage.

### Prompt Examples

“Look for an example graph that performs a similar operation.”

“Use the existing PCG examples as reference before modifying the graph.”

“Find how this node is used in the plugin examples.”

“Match the conventions used in the existing project graphs.”

“Review relevant examples before proposing a solution.”

## Use Explicit Context

Direct user-provided context is faster and more reliable than autonomous discovery. When interacting with assets or actors, give the LLM explicit context instead of asking it to discover content on its own.

It is recommended to use the following steps:

- Select assets directly in the Content Browser.
- Select actors directly in the Level Editor.
- Issue the request or action.

This approach is typically faster, more reliable, and less expensive in terms of context and execution cost.

Without explicit context, the LLM may generate temporary Python scripts to inspect content and gather information, which can slow down interaction, increase token usage, and introduce unnecessary additional steps.

### Semantic Search

Semantic Search is an AI-driven information retrieval technique that attempts to understand the contextual meaning and intent behind your search. The MCP workflow includes access to semantic asset search across your project.

While the LLM can use semantic search autonomously, it is often faster and more user-friendly for the user to perform the search directly in the Content Browser before interacting with selected assets.

 Semantic search integration is shipped with Unreal Engine 5.8 or later.

## Plan Execution

Planning and reviewing the execution steps can improve reliability for complex workflows. For involved operations, ask the LLM to explain or review its approach before execution.

This method is useful for:

- Large graph edits
- Multi-step workflows
- Attribute manipulation
- Experimental setups

For these types of requests, it is beneficial to explicitly ask the model what references, examples, or existing graphs it intends to inspect before acting. Encourage the model to base its plan on existing examples whenever possible.

### Prompt Example

“Review the graph before acting.”

“Explain the intended approach first.”

“Provide a step-by-step plan.”

“List the nodes you intend to modify.”

“Base the solution on an existing example graph if possible.”

“What examples or references are you planning to use?”

## Monitor Execution

LLM-driven workflows should be treated as supervised collaborations between you and your LLM, rather than fully autonomous execution.

During execution, it is recommended to do the following:

- Monitor actions as they happen
- Interrupt incorrect approaches early
- Reorient the model with references or examples
- Provide concrete corrections

If execution produces errors or unexpected results, review the issue with the model before proceeding with additional automated modifications.

Shorter feedback loops are more efficient than allowing the model to fully complete an incorrect approach.

## Expensive Operations

Some PCG operations can become expensive through the MCP interface, in terms of execution time and context usage. For example:

- Large graph analysis
- Multiple graph analysis
- Large dataset inspection
- Broad asset analysis

## Dataview

Inspecting PCG attributes means analyzing generated PCG point data and associated attributes, similar to reading a large procedural spreadsheet.

The LLM cannot inspect PCG attributes directly on its own. For attribute inspection, the LLM uses the dedicated Dataview workflow. Dataview performs the heavy processing outside of the normal token context window, substantially reducing context usage.

Even though Dataview is part of the PCG toolset, it can still be beneficial to explicitly mention it when prompting, as the model may not always select it automatically.

### Prompt Examples

“Use Data View for the attribute inspection.”

“Inspect the PCG points through Data View.”

“Use Data View to analyze the generated attributes.”

## Additional Skills

The PCG toolset also has an additional set of skills to extend the PCG workflow.The LLM can scan for these skills, but it can be good to ask it to load a specific one if you know it can help.

### Skill_PCGShapeGrammarDefinition

Use this skill when the output requires a composed, rule-driven sequence (-> using-shape-grammar-with-pcg-in-unreal-engine) of modules that fit together like puzzle pieces along a path. This includes content such as building facades, corridor modules, street furniture arrangements, or any linear sequence that follows grammar rules.

### Skill_PCGMeshPartition

Use this skill when your project uses Mesh Terrain (-> mesh-terrain-in-unreal-engine) as its landscape system and you need to use it with PCG. It explains to the LLM how the terrain modification layers are ordered, how material weight channels work, and how to author PCG graphs that correctly write to the terrain without breaking the priority system.

### Skill_PCGInstancingOnMeshActor

Use this skill when you want to cover a mesh with detail, such as sci-fi greebles, surface clutter, and micro-props scattered across an object's surface. It handles this using a Poisson sampling setup and avoids accidentally generating millions of points on a large or heavily scaled mesh.

### Skill_PCGBiomeCore

Use this skill when creating a biome system from scratch (-> procedural-content-generation-pcg-biome-core-and-sample-plugins-in-unreal-engine) and want to define what assets spawn where based on landscape rules, priority zones, and density filters. It walks through the full asset creation chain (definition, assets, generator, filter) and placement in the world, with guardrails for the most common silent failures that cause nothing to spawn.

- ai
- pcg
- mcp

On this page

- Prerequisites (-> working-with-pcg-and-llms-using-unreal-mcp-in-unreal-engine)
- Skill_PCGGraphGeneration (-> working-with-pcg-and-llms-using-unreal-mcp-in-unreal-engine)
- Key Principles (-> working-with-pcg-and-llms-using-unreal-mcp-in-unreal-engine)
- Recommended Workflow (-> working-with-pcg-and-llms-using-unreal-mcp-in-unreal-engine)
- Setting up Context (-> working-with-pcg-and-llms-using-unreal-mcp-in-unreal-engine)
- Use Existing PCG Example Graphs (-> working-with-pcg-and-llms-using-unreal-mcp-in-unreal-engine)
- Adapt Existing Patterns (-> working-with-pcg-and-llms-using-unreal-mcp-in-unreal-engine)
- Prompt Examples (-> working-with-pcg-and-llms-using-unreal-mcp-in-unreal-engine)
- Use Explicit Context (-> working-with-pcg-and-llms-using-unreal-mcp-in-unreal-engine)
- Semantic Search (-> working-with-pcg-and-llms-using-unreal-mcp-in-unreal-engine)
- Plan Execution (-> working-with-pcg-and-llms-using-unreal-mcp-in-unreal-engine)
- Prompt Example (-> working-with-pcg-and-llms-using-unreal-mcp-in-unreal-engine)
- Monitor Execution (-> working-with-pcg-and-llms-using-unreal-mcp-in-unreal-engine)
- Expensive Operations (-> working-with-pcg-and-llms-using-unreal-mcp-in-unreal-engine)
- Dataview (-> working-with-pcg-and-llms-using-unreal-mcp-in-unreal-engine)
- Prompt Examples (-> working-with-pcg-and-llms-using-unreal-mcp-in-unreal-engine)
- Additional Skills (-> working-with-pcg-and-llms-using-unreal-mcp-in-unreal-engine)
- Skill_PCGShapeGrammarDefinition (-> working-with-pcg-and-llms-using-unreal-mcp-in-unreal-engine)
- Skill_PCGMeshPartition (-> working-with-pcg-and-llms-using-unreal-mcp-in-unreal-engine)
- Skill_PCGInstancingOnMeshActor (-> working-with-pcg-and-llms-using-unreal-mcp-in-unreal-engine)
- Skill_PCGBiomeCore (-> working-with-pcg-and-llms-using-unreal-mcp-in-unreal-engine)

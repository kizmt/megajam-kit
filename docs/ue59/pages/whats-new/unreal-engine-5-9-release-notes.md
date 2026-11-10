# Unreal Engine 5.9 Preview Release Notes

https://dev.epicgames.com/documentation/en-us/unreal-engine/unreal-engine-5-9-release-notes?application_version=5.9

> Overview of new and updated features in Unreal Engine 5.9 Preview.

Last updated 11/9/26

## What's New

Unreal Engine 5.9 Preview comes with significant improvements to Python scripting and the Unreal MCP, as well as improvements to AI-assisted workflows and machine learning.

This release introduces a new experimental feature called Unreal Canvas that provides a way to combine your development and iterative processes with agentic workflows and tools.

UE 5.9 also includes improvements in animation, rendering, world building, gameplay and much more.

## Unreal Canvas

UE 5.9 introduces **Unreal Canvas**, a shared workspace where people and agents create and refine content using Unreal Engine and the other connected tools.

Its canvases include text, images, videos, and mesh generators that you drive with a prompt and a chosen generation service. Several companion plugins arrive with it:

- **Unreal Canvas Bridge** exposes Movie Render Graph rendering to Canvas as MCP tools. This plugin requires the Model Context Protocol plugin.
- **Unreal Canvas Spatial Annotations** places annotations in the 3D scene and captures the scene for use in Canvas.

You can learn more about these new features by reading our documentation (-> unreal-canvas-overview-in-unreal-engine).

## Python & MCP updates

Python scripting receives several improvements, such as the ability to manage extra Python search paths. The new **Slate Qt Bridge** embeds PySide6 widgets inside editor windows, styled to match the editor. The old Python Foundation Packages plugin was removed.

Scripting the editor also gets improvements with new Blueprint and Python libraries that let you edit Blueprints, chooser tables, StateTrees and Dataflow graphs from scripts.

The **Unreal MCP** also receives improvements, with new Editor Preferences to set the MCP server's port, its allowed origins and the highest protocol version it accepts. A new project-level Model Context Protocol settings page joins them.

Unreal MCP and Semantic Search add server and provider settings so external agents can connect to the editor and search project content. A new Knowledge Base lets the assistant and agents query knowledge built from the live engine state or from markdown files on disk.

In addition, this release increases the available AI toolsets that let agents work across the editor: Blueprints, editor actions, MVVM, Slate inspection, performance, files, scene capture, console, Texture Graph, widget animation and more.

A Toolset Registry controls which toolsets agents may use, and an MCP Client toolset manages a list of external MCP servers.

You can learn more about these new features by reading our documentation (-> ai-features-tools-and-plugins-in-unreal-engine).

## AI Assisted Workflows and Machine Learning

The **Unreal Assistant** gains notification preferences, so it can play a sound, flash the taskbar or show a taskbar badge when it needs your attention. It can also hand work to an external agent through a custom command, and a new tool-access setting (Ask, Read, Edit, Auto or Full) controls how much it may do on its own.

UE 5.9 also adds a live AI-processed viewport preview and several generative-service integrations: Fab image and mesh generation, chat completion, ElevenLabs voice, Google Gemini and Claude Code.

On the machine learning side, UAF gains AI-driven animation generation, Learning Agents observation functions, and the Neural Network Engine gets a new LiteRT inference runtime.

## Animation & Rigging

UE 5.9 includes significant improvements to its animation and rigging capabilities.

The **IK Retargeter** gains three spatially aware operations: the **Proximity IK** keeps limbs and contacts correct relative to the body, the **Pelvis Volume** places the pelvis sensibly across characters with different proportions, and the **Limb Twist** spreads twist along the limbs.

Control Rig can now be referenced as an asset as well as a class, with new Blueprint nodes to check, convert and spawn rigs from those references. Several older nodes are deprecated in favor of the asset-reference versions. Control Rig also adds hierarchy-key helpers and edit-mode options for mirroring controls, and Control Rig Dynamics and Control Rig Physics gain new options.

The Unreal Animation Framework has been significantly expanded in 5.9. It adds new animation node and layering settings. It also gains a notify system with built-in Play Sound and Play Niagara Effect handlers, new StateTree conditions such as Animation Is Looping and Animation Time Remaining, and updates to its Chooser, Pose Search, Warping, Mirroring and Control Rig integrations.

A new **UAF AnimGen plugin** brings AI-driven animation generation into UAF. Chooser tables can now be built and edited from Blueprint or Python, and smaller updates reach the morph target editing tools, Sequencer animation tools, IK Rig, Motion Warping, Rig Mapper, the Ease Curve tool and Animation Insights.

## Rendering & Lighting

**Lumen World Cache (-> lumen-world-cache-in-unreal-engine)**

Lumen World Cache is a way for Lumen to store the lighting it finds when rays hit surfaces. Instead of relying on mesh cards prepared for each mesh, it builds its cache while the game runs by path tracing the scene. So it works the same way for tiny meshes, large single meshes, spline meshes, skeletal meshes and meshes deformed by World Position Offset, with no mesh fix-up or card cooking needed. It requires Hardware Ray Tracing and is turned on per project.

**Adaptive Voxel-Based Order Independent Transparency (ABVOIT) (-> adaptive-voxelbased-order-independent-transparency-in-unreal-engine)**

AVBOIT blends overlapping translucent surfaces, such as glass, smoke and particles, correctly no matter what order they're drawn in. That removes the popping and sorting errors you get where transparent objects overlap. It works with both Nanite and non-Nanite translucency, handles coloured glass, and skips pixels hidden behind fully opaque smoke. Translucent materials need to output only their own colour for it to composite correctly.

**Nanite Culling Improvements (-> nanite-technical-details)**

Nanite culling decides which pieces of Nanite geometry are visible each frame, so only what's on screen gets drawn. It sorts instances into simple and complex work, such as skinned, spline-deformed or World Position Offset meshes, and handles each kind separately. It can also test several levels of a mesh's detail hierarchy in a single step. Scenes get the benefit automatically with no content changes, and the gains grow with scene size.

**Ambient Lighting Volumes (-> ambient-lighting-volumes-in-unreal-engine)**

An Ambient Lighting Volume is a placeable box or sphere that tints or darkens the sky lighting on surfaces inside it. It lets you darken the ambient light under a bridge or in an alley, or give one area a coloured cast, without adding lights or changing the Sky Light. Volumes fade softly at their edges and can overlap. They're Experimental and work with a Movable Sky Light when Lumen isn't the global illumination method.

**Debugging Shadows (-> debugging-shadows-in-unreal-engine)**

Unreal Engine has a set of visualization modes for tracking down shadow problems, such as blurry or blocky shadows, visible cascade seams, or objects that shadow the wrong way. A Virtual Shadow Map Overview mode shows several shadow debug views side by side. For cascaded shadow maps, one view colors each pixel by the cascade it falls in and another shows the shadow depth buffers as tiles. A Far Shadow view highlights which objects cast far shadows. You can also set far shadows to update at their own rate and turn far shadow casting on or off per component from Blueprint or code, which helps you tune their cost.

**Dynamic Wind for Nanite Foliage (-> dynamic-wind-for-nanite-foliage-in-unreal-engine)**

Dynamic Wind is an Experimental plugin that makes foliage and other skeletal plants move in the wind. It simulates each bone's motion on the GPU: a slow sway combined with a fast flutter, based on each part's mass and how much wind it catches. Plants share a small set of simulations to stay cheap, then switch to their own simulation when a local force reaches them. Those forces include radial bursts, swirls, cone-shaped gusts and directional pushes, or a character brushing through. A lighter mode is also available that gives stylized animated wind at lower cost.

**Lighting Documentation Audit (-> lighting-the-environment-in-unreal-engine)**

Using AI, we reviewed the entire Lighting the Environment section, all 72 pages, against the UE 5.9 engine source and its scanned property and console-variable index. We had AI address the drift in documentation and engine source between late UE4 and early UE5, such as outdated labels and menu paths, added and removed features, renamed settings, and defaults that no longer match the project. These changes have been writer-reviewed and approved. Some suggestions still require SME and verification approvals, but what you’ll see in this audit (and experiment) is improved accuracy and trustworthiness of documentation making its way directly from the source code to the content you reference. Here are just some of the stats from this exercise:

- Pages reviewed: 72, across 11 subsections, each with a tracked-suggestions draft alongside a clean copy of the live page.
- 671 fixes to inaccurate text
- 162 additions, including 177 missing property-table rows
- 76 removals of content for features or settings that no longer exist
- 5.9-specific changes, confirmed against the source delta, folded into the affected sections

## World Building and Procedural Content

The Procedural Content Generation framework adds a **Concave Hull** node. Blueprints can now read and write the source of custom HLSL nodes, and new functions add and validate graph edges from script.

Mesh Partition gains mesh simplification settings, a ray-tracing proxy option and better interop with PCG.

Shallow-water rivers can now exclude chosen actors from capture and set their collision resolution, and a new paint tool paints water input.

World Partition gains many new Blueprint functions, and new **Data Layer** nodes get child layers and check whether an actor can be added to a layer.

## Gameplay, AI and Mass

**StateTrees **can now be edited from Blueprint or Python scripts: tasks, considerations, evaluators and global tasks can all be added and rearranged in code.

The new **Mass Characters** plugin brings Mass traits for character interpolation and visualization, selective pawn replication, and a game feature action that sets up Mass characters.

The **Navmesh **can now build progressively, with control over how many tiles build per tick, and a new option keeps tiles outside the invoker radius.

## Editor and Workflows

UE 5.9 adds a new set of scripting functions that lets you create and edit Blueprints, graphs, nodes and variables from Python or Editor Utility Blueprints.

The editor adds a Map Check subsystem with Blueprint logging, functions to replace actors with an asset or class, and preview-platform options in Editor Preferences.

In Sequencer, marked frames become "marks and mark ranges", with new Blueprint nodes and preferences for mark range duration, snapping and playback. Data Validation, the Curve Editor and user asset tags have also received updates.

For UI work, widget components can output depth and velocity, editable text gains selection events and colors, and list and tile views gain orientation and selection options. Common UI adds editor passthrough commands.

This release also introduces **Forge**, a collection of web-based designer tools inside the editor.

## Core Engine and Programming

UE 5.9 introduces a new experimental **WebAssembly target** with its own project settings and WebGPU rendering support.

Two new frameworks arrive: the **Modular Test Framework**, for writing and running scoped plugin tests, and **GraphDsl**, a text-based language for authoring and editing graph assets.

Platform settings also change, with a new iOS home-indicator option, a source-control option to validate soft dependencies, and updated bandwidth-manager settings.

On this page

- What's New (-> unreal-engine-5-9-release-notes)
- Unreal Canvas (-> unreal-engine-5-9-release-notes)
- Python & MCP updates (-> unreal-engine-5-9-release-notes)
- AI Assisted Workflows and Machine Learning (-> unreal-engine-5-9-release-notes)
- Animation & Rigging (-> unreal-engine-5-9-release-notes)
- Rendering & Lighting (-> unreal-engine-5-9-release-notes)
- World Building and Procedural Content (-> unreal-engine-5-9-release-notes)
- Gameplay, AI and Mass (-> unreal-engine-5-9-release-notes)
- Editor and Workflows (-> unreal-engine-5-9-release-notes)
- Core Engine and Programming (-> unreal-engine-5-9-release-notes)

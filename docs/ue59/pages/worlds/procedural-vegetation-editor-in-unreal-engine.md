# Procedural Vegetation Editor (PVE)

https://dev.epicgames.com/documentation/en-us/unreal-engine/procedural-vegetation-editor-in-unreal-engine?application_version=5.9

> Use the Procedural Vegetation Editor to generate realistic, high-quality, Nanite-ready vegetation.

PVE is a node-based vegetation creation tool built on PCG. You use it to create vegetation assets from scratch using one of three creation workflows.

## Supported creation workflows

- **Grower node** — the primary method. Grow vegetation from scratch based on pseudo-botanical principles.
- **Recursive Growth (Grafting)** — distributes pregrown plant structures (grafts) onto a host skeleton.
- **Import** — import existing vegetation meshes and extract PVE data from them.

The Grower node is the primary workflow: a pseudo-botanical simulator that produces highly realistic results. Recursive scattering is also available through the Grafting node.

In addition, PVE includes a broad selection of nodes for manipulating the skeletal output, most of which are non-destructive, procedural operations:

- **The Mesh Builder** dynamically constructs the mesh.
- **The Foliage Palette and Foliage Distributor** together provide a flexible, non-destructive system for placing foliage on the trunk mesh.

The output of the system is a Nanite asset that uses the latest Nanite Foliage technology, including instancing, GPU-based skeletal-driven animation, and voxel representation in the distance.

## Important Changes (UE 5.7 → 5.8)

- **The Procedural Vegetation Preset Loader has been removed**. Similar functionality is provided through the Growth Data Loader and Profile Loader.
- **Importing foliage from an external source has been removed**. It is now handled by the more capable Foliage Distributor.
- **5.7 assets are not compatible with 5.8. **As a result of the changes above, assets made for PVE in UE 5.7 cannot be opened in 5.8.

PVE is experimental. Substantial architectural changes can occur between releases. The 5.8 release was a significant departure from the previous release; maintaining parity with earlier releases would have compromised further development.

## Node categories

|  |  |
| --- | --- |
| **Category** | **Contents** |
| **Import** | Import existing data. |
| **Growth** | Grower; Grafter Palette; Graft Distributor. |
| **Post Growth Modifier** | Modify the skeletal data without re-running the botanical simulation. |
| **Manual Editing** | Manual Edit (Trim, TRS); Object Avoidance (lets vegetation adapt to external objects). |
| **Meshing** | Build renderable geometry from a skeleton. |
| **Foliage** | Distribute pre-baked foliage meshes on the trunk mesh (Foliage Palette, Foliage Distributor). |
| **Export** | Bake graph outputs into renderable assets. |
| **Other helper nodes** | Bring in, export, or modify supporting data. |

## Enable the Plugin

PVE ships with Unreal Engine as an experimental plugin. It is not enabled by default and must be turned on for each project that uses it.

- Open the project in the editor.
- From the menu bar, select **Edit > Plugins**.
- In the **Plugins** window, search for **Procedural Vegetation Editor**. It is listed under **Other** in the **Experimental** section.
- Enable the checkbox next to it.
- When prompted, click **Restart Now**. The editor closes and re-launches with the plugin loaded.

## Create a New Graph

PVE graphs are assets created from the Content Browser.

- Right-click in the **Content Browser** and select **Foliage > Procedural Vegetation > Procedural Vegetation Graph**. Name and save the asset.
- In the menu that appears, select a pre-made sample graph, or select **Create New Procedural Vegetation** to create a blank graph.
- Double-click the new asset to open it. The editor opens in its own window.

PVE graph output is viewable directly in the graph. Do not drop PVE graph output into the world — only exported assets should be added to the world.

## PVE Graph UI

The 5 main UI panels for PVE:

- The Graph (-> procedural-vegetation-editor-in-unreal-engine)
- The Viewport (-> procedural-vegetation-editor-in-unreal-engine)
- Viewport Settings (-> procedural-vegetation-editor-in-unreal-engine)
- Details Panel and Graph Parameters (-> procedural-vegetation-editor-in-unreal-engine)
- Embedded SubGraphs (-> procedural-vegetation-editor-in-unreal-engine)

### The Graph

The graph is where the node network is located. A node is a visual representation of an operation, with input and output pins that connect operations together.

- **Add a node:** right-click or press Tab to open the node menu. Select a node from a category, or type the node name directly.
- **View a node’s output**: select the node. The viewport shows its output.
- **Lock the view to a node:** press Ctrl+L. A locked node shows a blue bar at the top of the viewport indicating which node the view is locked to. To unlock, reselect the locked node and press Ctrl+L again.
- **Nodes without a visualization:** not all nodes have a viewport visualization. Math and parameter nodes in particular have no viewable output of their own.
- **Connect nodes:** drag a wire from an output pin to an input pin (or vice versa). Incompatible pins will not form a wire. Dragging from a pin and releasing on empty space opens the node menu showing only compatible candidates — a useful way to find a valid input.
- **Break a connection:** hold Alt, then hold the left mouse button and drag across the wire.

### The Viewport

The viewport shows the output of the selected node, which is not necessarily the output of the graph. As in PCG, this allows inspection of intermediate output from node to node. The viewport behaves like other Unreal Engine viewports and offers the same navigation and shortcuts.

### Viewport Settings

Perspective options match Unreal Engine in general. When working on vegetation, it can help to reduce the **Field of View** from 90 to 35.

The **default viewstate** button selects the type of data to display. Available options are tied to specific nodes and render additional data as geometry:

- **Point data (default)** — view skeletons as trunks with their internal radius.
- **Point data + Foliage** — view the foliage used in the light and gravity computation, for better insight.

### Details Panel and Graph Parameters

The Details panel works like other node editors in Unreal Engine and is the main way to interact with the selected node. It is where the parameters that control a node’s internal behavior are set.

Some parameters may be grayed out for one of two reasons:

- **Disabled by another value** — a parameter can be disabled based on another parameter’s value. For example, on the Grower, **BranchPhyllotaxy** is hidden when **BranchPhyllotaxySameAsTrunk** is on. Turn the toggle off to reveal the disabled parameters.
- **Driven by an override** — PVE supports overrides via input pins. For example, the Grower has a **Phyllotaxy** input pin that takes a Phyllotaxy Settings node and drives those parameters in place of the Details panel values.

Most PVE parameters have a slider set to a reasonable range. Some parameters accept values higher than the slider maximum; others clamp the value back to the closest accepted value.

**Graph Parameters** holds parameters that can be promoted to a user at a higher level in a nested graph. Unlike Details panel parameters, these behave more like nodes that can drive logic in the network. This tab is relevant only when creating SubGraphs and Embedded SubGraphs

### Embedded SubGraphs

An Embedded SubGraph is a PVE graph nested inside another PVE graph, useful for organizing complex graphs or building tools.

- **SubGraph** — becomes an asset in the Content Browser and can be reused across multiple networks.
- **Embedded SubGraph **— exists only inside the current graph and is typically single-use: for organizing the network or building asset-specific tooling.

All Embedded SubGraphs for the current graph appear in this panel and can be created here. Drag an Embedded SubGraph from this panel into the node network to use it.

## Nodes

### Grower

The Grower is the most important addition in UE 5.8. It provides a botanical growth simulation that uses an advanced light-detection system together with plant hormones and phyllotactic properties to generate realistic growth.

**Primary input ("in"):**

- A seed, to grow multiple plants simultaneously.
- The output of another Grower, to resume growth — useful for separating growth into stages with different properties, or for redirecting growth.
- The output of any node that produces a PVE-compatible skeleton, such as Extract From Mesh or a Graft workflow.

**Other inputs:** Settings-type input pins (for example, Grower Growth Settings) compartmentalize settings and make it possible to reuse them across multiple nodes that share the same properties, without reconfiguring an entire Grower. Settings nodes expose input pins for all their parameters and can drive logic from those parameters — particularly useful when building tools.

**Outputs:**

- **Growth Data (primary)** — typically used with the Mesh Builder to build geometry, and also consumed by most other skeletal node operations in PVE.
- **params** — contains all the settings the node currently holds. Use it with the Save Grower Preset node to save presets that can later be loaded into the node’s preset section.

**Key parameters:**

|  |  |
| --- | --- |
| **Parameter** | **Description** |
| **Cycles** | How many cycles (iterations) the Grower runs. This is not equivalent to years — the simulation emulates the output rather than running for 200+ cycles. |
| **Phyllotaxy** | The principal growth structure, such as the angle between parent and child and how many branches complete one full revolution. Can be set separately for trunk, branch, and foliage. The input pin accepts multiple Settings-type nodes, and each node determines its own target. Nodes that take multiple inputs like this use a different pin icon. |
| **Growth** | Basic growth information, such as segment length (Internode), incremental radius, plant length, and probability rates tied to gradients. |
| **Phototropism** | Controls how plants interact with the internal scene light. Phototropism (also a parameter here) refers to attraction to light or avoidance of occlusion. Also sets light sensitivity and how much light a plant requires before it begins to lose branches. |
| **Gravity** | How the plant is affected by gravity. Uses a beam-deflection model with control over stiffness, weight, wood density, and how much gravitational stress a plant can withstand. |
| **Bifurcations** | Controls codominant splits, where a branch tip splits into multiple branches, including when and how splits occur. |
| **Directional** | Basic settings for randomizing directions on top of the natural growth. |
| **Foliage** | Controls the foliage used in the simulation. Selects a mesh for all light calculations (a basic proxy is preferable, to avoid unnecessary cost in the ray-traced light system), and sets how quickly foliage is shed and how its scale develops over its lifespan. |
| **Auxin** | Controls apical dominance; requires fairly advanced botanical understanding. In general, it controls how far from a tip a lateral/axillary branch must wait before it is allowed to spawn — a key aspect of plants, particularly acropetal plants such as conifers. |

### Point Scatter

A general-purpose node that uses a PCG graph to scatter points. In PVE 5.8, its purpose is to initiate points for the Grower so that multiple plants can be grown at the same time. For more details, see Seed Generator (-> procedural-vegetation-editor-in-unreal-engine).

**Details:** A default PCG graph is provided. It controls the number of points and their size and position through noise, border distance, and other parametric data. Custom graphs can be used, and the default graph can be modified for specific needs.

**Output:** Point data, currently compatible only with the Seed Generator node.

### Seed Generator

Converts scatter point data into initial Grower data. It also allows modification of Grower-specific data, such as the primary direction of the seed and the direction in which branches start spawning.

**Primary input:** Point data from the Point Scatter node.

**Output:** Growth data that can connect directly to a Grower node for multi-plant growth.

### Mesh Builder

Meshes skeletons. Before this node, a visual representation is available, but it is not exportable or renderable outside the PV Editor. The Mesh Builder adds extensive control over the shape, radii, material assignment, and geometry construction of the meshed skeleton.

**Inputs:**

- **Primary input **— any node with a Grower-type output (not restricted to the Grower node itself).
- **Profile** — takes a Plant Profile Loader node. In the Mesh Builder, this is a 2D radial shape describing the trunk profile.
- **Trunk Texture Setup** — takes a Trunk Texture Setup node, containing the UV coordinates needed to use the trim sheet that node provides.

**Output: **Mesh-type data, used by the Export node and subsequent nodes.

**Key parameters:**

|  |  |
| --- | --- |
| **Parameter** | **Description** |
| **Skeleton Shaping** | Adds noise to the skeleton and/or smooths sharper edges. The Grower is a sparse representation; noise restores detail and irregularities it cannot provide. Shaping can be controlled per generation and stacked for various effects. |
| **Branch Radius** | Controls branch and trunk radius, based on the Da Vinci rule (the combined radius of branches stemming from a trunk equals the radius of that trunk). Most important is control over the overall radius of each generation and the falloff shape, which can be controlled by gradients. |
| **Profile Details** | Controls how profiles are applied, sweeping the profile over the skeleton’s branches — useful for emulating root flares at the base of the trunk. If Apply to Branches is disabled, the profile applies only to the trunk (main generation). If no profile is provided, a circle is the default. |
| **Mesh Details** | Controls trunk meshing. Segments are points along the spline; divisions are points on the sweeping profile. Segment reduction is the primary way to reduce segments, keeping points that contribute most to each spline’s shape and removing straight runs. Resolution can be reintroduced in areas of interest using the retention controls. |
| **Material Details** | Assigns materials to the trunk and branches. Material Mode sets how materials are assigned: by generation (default), by radius, or by age. Offset skips entries at the start of the trim sheet (typically arranged oldest to youngest); for a sapling, skip the starting generations. Enter the number of material slots to use. To use tiles from the trim sheet, enable Use Trunk Texture Setup to fetch data from the Trunk Texture Setup node. |
| **Displacement** | Currently a basic implementation that displaces vertices using a displacement image. |

### Trunk Texture Setup

Generates the tileable texture sheet and its supporting data. Texture sheets greatly reduce the draw calls required to render a tree — one of the most important steps for optimizing material cost in UE. A single sheet can be shared across multiple variations that share one material and its texture sets.

**Output: **TrunkTextureSetup-type data, used by the Mesh Builder’s Trunk Texture Setup input pin.

**Key parameters:**

|  |  |
| --- | --- |
| **Parameter** | **Description** |
| **Baked Textures** | Configures output data. For example, Prefix sets the leading text of texture names before descriptive properties are appended. This is also where the bake-out location for the resulting textures is set. |
| **Trunk Texture Setup** | Where the texture sheet is filled in. Generations are compiled into a single sheet, beginning with the first generation and adding subsequent generations in order. Select the texture channels associated with each generation; the number and types of channels should match across generations. Dilation adds padding on the sides to avoid texture bleeding at lower-resolution mips. The material slot expects a material instance whose texture channels match the parent material. |

### Foliage Distributor

Places foliage on the plant. Like the Mesh Builder, the Grower can show foliage in the viewport, but those are low-poly proxy models for the light simulation; they are never exported and are not renderable outside the PV Editor. This node distributes the final foliage geometry.

**Inputs:**

- **Primary input **— the output of a Mesh Builder node, or another Foliage Distributor (when chaining).
- **Foliage** — takes a Foliage Palette node, where spawn candidates are selected and assigned attributes for the distributor’s condition system.

**Usage note:** Foliage Distributors can be chained, and each step can target different elements. For example, distribute flowers on all tips, then distribute leaves in the next distributor, using chain masking to prevent foliage instances from overlapping.

**Distribution methods:**

- **Botanical distribution** — relies more on growth data to produce botanically plausible results.
- **Parametric distribution** — an easier way to create specific results, relying more on ramps and gradients.

**Key parameters:**

|  |  |
| --- | --- |
| **Parameter** | **Description** |
| **Parametric Settings** | Controls parametric distribution. Spacing distributes instances along the curve; the Branch Density parameter controls the total number of instances spawned. Relative Start and Relative End control where spawning begins and ends on the plant but do not change the number of branches. All ramps are relative to the modified start and end positions. |
| **Hormone Based Settings** | Uses hormone-based distribution. It uses the Ethylene levels from the Grower to control where foliage ends, but always starts from the tip. Distances use direct metrics for the spacing between instances, modifiable with the Instance Spacing Ramp. Instead of a total instance count, define max per branch; the resulting count depends heavily on parameter configuration. |
| **Vector Settings** | Shared between both methods. Offers high control over foliage orientation using a layered approach, stacking effects and blending between directions using ramps. Aim is the direction a leaf or branch points, root to tip. Face vector is which direction the top side of a leaf faces. Extreme configurations are possible but may produce odd results — for example, aiming leaves directly upward and facing them directly upward is contradictory. Aim is solved first, then face, so aim will be correct while face appears random. Random Roll, Pitch, and Yaw run on top of Aim and Face to add variation. |
| **Condition Settings** | Shared. The primary way to assign specific foliage to specific parts of the plant, pairing skeleton properties with the properties set in the Foliage Palette. Example: a dying brown branch with a light condition of 0.2 and a healthy green branch with 0.8 — enabling the light condition makes the distributor pick unhealthy foliage where light was low and healthy foliage where light was high; adjust the Offset parameter to make the plant overall healthier. Conditions can be combined, using weight to control the importance of each. |

### Foliage Palette

A support node for the Foliage Distributor. Selects the foliage to instance and sets the conditions used to place instances correctly on the tree.

Empty (null) instances can be spawned: opt out of selecting a mesh and enable Use as Mask. This is useful for creating negative space. For example, if all foliage has a height value of 0.5 and the null instance has 0.0, the lower section of the tree picks the null instance (when the height condition is enabled in the Foliage Distributor), leaving the lower plant bare.

### Graft Distributor

Nearly identical to the Foliage Distributor, but operates over skeletons rather than foliage. It distributes smaller plant skeletons (Grafts) over larger plant skeletons (Hosts). This can be repeated to build larger branches or a combined large plant. Commonly known as recursive scattering, with added flexibility in the order of operations.

**Example: **Use Extract From Image to get a branch structure from an image. Grow a tree with the Grower, then use the extracted branch as a graft and the grown tree as the host to extend growth. A small twig can then be grown and used as a new graft over the combined output. The order of operations can be any configuration.

**Inputs:**

- **Primary input** — a Grower-type input from any PVE node that operates before the mesher.
- **Graft **— takes a Graft Palette node (the counterpart to the Foliage Palette in the Foliage Distributor workflow).

### Graft Palette

Nearly identical to the Foliage Palette, but takes Grower data as input. Unlike the Foliage Palette, content is not loaded from the Content Browser; instead, add input pins that accept any Grower data.

### Extract From Image

Extracts skeletons from images. The result is a native PVE skeleton that can be treated like any other PVE growth data. Useful for branches with structures that are hard to reproduce through botanical growth, or that require specific art direction.

**Output:** By default, a single output pin combines all branches, which is not useful in PVE’s current state. Adding plants in the Plant Generation section creates additional pins, one per plant — these are the outputs to use with successive nodes.

**Key parameters:**

|  |  |
| --- | --- |
| **Parameter** | **Description** |
| **Texture** | The node’s starting point. By default it expects a black-and-white image where white is the area to extract from; this can be inverted. Input should be as binary as possible, with a clear distinction between inside and outside. Grayscale images should be level-adjusted for clear separation; white-level adjustment can compensate for soft edges. |
| **Image Trace** | Controls conversion of image to curves and how curves are treated before becoming geometry for path extraction. Sample resolution here is not the image resolution, but the resolution of a grid used to extract features. Smoothing iterations remove false positives where image noise is mistaken for branches. Simplification reduces segments on the resulting skeleton; keeping it low is generally better, aiming for parity with the host’s segment density in grafting workflows. This can also be done later in the Simplify node. |
| **Tip Detection** | Removes false-positive branch tips, or re-introduces points if the default algorithm removed too many. |
| **Plant Generation** | Generates plant skeletons; multiple skeletons can be extracted from one image. The main setting is the number of skeletons to extract. Root Position and Orientation are mostly driven by viewport interaction. Recommended: add one branch at a time. A handle appears in the viewport — left-click and drag to position the pivot, and left-click and drag the end point to orient until the branch is upright, then add another plant if needed. |

### Extract From Mesh

Like Extract From Image, produces a native PVE skeleton usable like any other PVE growth data. Powerful and simple to use: it takes any static mesh and extracts PVE growth data from it.

If the mesh has foliage, the foliage and trunk must use separate materials; select the trunk material to act as a mask for what the skeleton is extracted from. The node does not extract the foliage itself for reuse as instances — it focuses purely on skeletal data.

### Post Growth Modifiers

Post Growth Modifier nodes modify the skeleton in a more parametric way. They are useful for substantial changes that should not affect the existing growth, and for building tools that operate at a granular level in a safe, non-destructive manner.

#### New in 5.8

##### Object Interaction

Brings external objects/geometry into the graph and lets the skeleton interact with them in several ways.

**Modes:**

- **Avoidance (default)** — one or more meshes that the plant avoids by going around, while still attempting to reach its rest state.
- **Trim Outside** — removes any part of the skeleton not enclosed by the geometry. Useful for fitting a plant within a shape the Grower could not achieve. Note: if a branch lower in the hierarchy is culled, its children are also removed.
- **Trim Inside** — the inverse of Trim Outside; removes branches inside a mesh. The mesh need not be solid — it only checks whether a point is closer to the front or back — so a plane is also valid.

Input mesh transforms do not need to be set manually. Viewport interaction is available — click the collision mesh to interact with, and a transformation gizmo appears.

##### Manual Edit

Allows direct manipulation of the skeleton in multiple ways, providing a more artistic authoring approach alongside the parametric options. All edits use viewport interaction and require no manual parameter input.

Manual edits are generally destructive; modifying data upstream is not intended.

**Modes:**

- **TRS (Translation, Rotation, and Scale) **— edits have an associated falloff for gradual transitions, which can be eliminated for absolute behavior. Selection modes help target specific elements even with a diffuse selection.
- **Branch removal **— removes branches and, using Trim Branch, can cut at a segment rather than removing entire branches.

##### Recompute Point Scale

A companion to the extraction nodes. Extraction nodes attempt to extract radius from the source mesh/image, but miscalculations occur or the source radius may be undesirable.

Radius can be reshaped in the Mesh Builder, but when pairing with a Grower and resuming growth, it is generally better to modify the radius before resuming growth so it is evaluated correctly in the subsequent simulation.

##### Rotate Branches

A companion to the extraction nodes, particularly Extract From Image. Skeletons extracted from images are too flat; Rotate Branches applies an alternating rotation to give the appearance of phyllotaxy on an otherwise two-dimensional structure. The rotation can be extensively modified and chained for additional effects.

##### Simplify

The final companion node to the extraction nodes. Extraction can produce a very high-frequency skeleton with excessive points, causing unnecessary computation and a mismatch with growth data when resuming growth.

Uses a path-simplification algorithm to remove points that do not contribute to the overall shape, bringing the skeleton in line with the Grower’s output. High-frequency detail is better added later in the Mesh Builder.

#### Carried over from 5.7

##### Carve

Shortens the plant or branches based on intrinsic data such as distance to the root point, radius, or distance to the ground. Useful for minor adjustments without major rework, and for parametric behavior when turning an asset into a parameter-driven tool.

##### Gravity

Applies a simplified gravity model as a post-operation — useful for adding gravitational pull to a skeleton or component without changing the Grower.

Adjusting gravity in the Grower produces more realistic structures because it occurs during the simulation and affects how the plant grows, but it also makes results change drastically. The Gravity node adds gravity in a more parametric way that, while lower quality, behaves more predictably and is easier for minor modifications or tool building.

##### Slope

A parametric way to emulate a tree growing on a slope, where the tree starts at an angle and grows more upright over time. This can be done in the Grower, but the Slope node is better for parametric assets that do not require that precision, offering a fast, predictable outcome.

##### Scale

A basic operation that globally scales the skeletal structure and its associated data.

## Utility Nodes

Several PVE nodes do not directly modify growth, meshing, or foliage distribution; instead they bring in, export, or modify data. Some nodes are inherited from PCG and behave identically to their PCG counterparts.

### Export

Bakes PVE graph outputs into renderable geometry. It also binds the mesh to the skeleton and generates wind data.

**Support: **Supports export to full Nanite Foliage, using the latest advancements such as skeletal deformations, assemblies, and voxelization, ready for use in a project and compatible with the Dynamic Wind plugin. Can also write geometry as a standard static mesh if needed.

**Primary input: **Mesh-type data provided by a Mesh Builder or subsequent nodes. Note: Grower data cannot be exported from the graph, as it holds only transient data.

### Bone Reduction

Similar to, but not the same as, the Simplify node. Bone Reduction is not related to the PVE growth-type skeleton; it refers to the bones on the animation skeleton. The default skeleton is generally too complex for real-time animation, and this node reduces its complexity.

Uses a path-simplification algorithm; the only parameter is the delta that controls when a bone is removed.

### Save Grower Preset

The method for generating custom presets. The preset is written to a data asset that can be loaded into a Grower — a good way to expand a preset library. A preset can be loaded into the Grower, modified, and written out as a new preset, or new presets can be generated from scratch.

Connects to the params output pin of a Grower node (visible by expanding the Grower node). It reads all parameters and evaluates any connected override nodes to get the final values written to the preset.

### Profile Loader

Takes a Procedural Vegetation Plant Profile Data Asset. This data asset is based on a JSON file containing a list of arrays, each containing 100 distances from origin, describing a trunk profile. Most users are not expected to create these; a default data asset is provided with a wide range of shapes for shaping the trunk in the Mesh Builder.

**Output: **PlantProfile-type data, valid only with the Mesh Builder’s Plant Profile input pin.

### Growth Data Loader

An internal legacy node that supports MegaPlants generated in previous versions of PVE. Not intended for general use beyond data provided by updated MegaPlants. It replaces the Procedural Vegetation Preset Loader.

**Output:** Growth data, for use with any PVE nodes that support that input type.

- unreal engine
- experimental
- procedural vegetation editor
- pve
- node

On this page

- Supported creation workflows (-> procedural-vegetation-editor-in-unreal-engine)
- Important Changes (UE 5.7 → 5.8) (-> procedural-vegetation-editor-in-unreal-engine)
- Node categories (-> procedural-vegetation-editor-in-unreal-engine)
- Enable the Plugin (-> procedural-vegetation-editor-in-unreal-engine)
- Create a New Graph (-> procedural-vegetation-editor-in-unreal-engine)
- PVE Graph UI (-> procedural-vegetation-editor-in-unreal-engine)
- The Graph (-> procedural-vegetation-editor-in-unreal-engine)
- The Viewport (-> procedural-vegetation-editor-in-unreal-engine)
- Viewport Settings (-> procedural-vegetation-editor-in-unreal-engine)
- Details Panel and Graph Parameters (-> procedural-vegetation-editor-in-unreal-engine)
- Embedded SubGraphs (-> procedural-vegetation-editor-in-unreal-engine)
- Nodes (-> procedural-vegetation-editor-in-unreal-engine)
- Grower (-> procedural-vegetation-editor-in-unreal-engine)
- Point Scatter (-> procedural-vegetation-editor-in-unreal-engine)
- Seed Generator (-> procedural-vegetation-editor-in-unreal-engine)
- Mesh Builder (-> procedural-vegetation-editor-in-unreal-engine)
- Trunk Texture Setup (-> procedural-vegetation-editor-in-unreal-engine)
- Foliage Distributor (-> procedural-vegetation-editor-in-unreal-engine)
- Foliage Palette (-> procedural-vegetation-editor-in-unreal-engine)
- Graft Distributor (-> procedural-vegetation-editor-in-unreal-engine)
- Graft Palette (-> procedural-vegetation-editor-in-unreal-engine)
- Extract From Image (-> procedural-vegetation-editor-in-unreal-engine)
- Extract From Mesh (-> procedural-vegetation-editor-in-unreal-engine)
- Post Growth Modifiers (-> procedural-vegetation-editor-in-unreal-engine)
- New in 5.8 (-> procedural-vegetation-editor-in-unreal-engine)
- Object Interaction (-> procedural-vegetation-editor-in-unreal-engine)
- Manual Edit (-> procedural-vegetation-editor-in-unreal-engine)
- Recompute Point Scale (-> procedural-vegetation-editor-in-unreal-engine)
- Rotate Branches (-> procedural-vegetation-editor-in-unreal-engine)
- Simplify (-> procedural-vegetation-editor-in-unreal-engine)
- Carried over from 5.7 (-> procedural-vegetation-editor-in-unreal-engine)
- Carve (-> procedural-vegetation-editor-in-unreal-engine)
- Gravity (-> procedural-vegetation-editor-in-unreal-engine)
- Slope (-> procedural-vegetation-editor-in-unreal-engine)
- Scale (-> procedural-vegetation-editor-in-unreal-engine)
- Utility Nodes (-> procedural-vegetation-editor-in-unreal-engine)
- Export (-> procedural-vegetation-editor-in-unreal-engine)
- Bone Reduction (-> procedural-vegetation-editor-in-unreal-engine)
- Save Grower Preset (-> procedural-vegetation-editor-in-unreal-engine)
- Profile Loader (-> procedural-vegetation-editor-in-unreal-engine)
- Growth Data Loader (-> procedural-vegetation-editor-in-unreal-engine)

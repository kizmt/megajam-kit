# Using Shape Grammar With PCG

https://dev.epicgames.com/documentation/en-us/unreal-engine/using-shape-grammar-with-pcg-in-unreal-engine?application_version=5.9

> An introduction to using Shape Grammar with the Procedural Content Generation Framework.

[image: Using Shape Grammar With PCG]

Unreal Engine’s **Procedural Content Generation Framework** provides technical artists and designers with a powerful set of tools for creating procedural content. In the context of procedural content generation, a **Shape Grammar** is a set of rules that defines how content should be generated and structured. In a grammar, user-defined symbols called **Modules** represent assets and are combined together in a string to create more complex structures.

[image: Fence Generator Created Using Shape Grammar] A fence generator created using shape grammar.

## Important Concepts and Terms

- **Modules**: User-defined symbols that represent assets. These can be letters or words. Modules are stored as an Attribute or can be hardcoded into a node
- **Syntax**: The symbols and methods for combining modules in a string to form rules.

## Prerequisites

This documentation builds on concepts and information presented in the Procedural Content Generation Overview (-> procedural-content-generation-overview).

## Grammar Syntax

PCG Grammar follows a specific syntax to combine modules using the following symbols:

- You can use Modules by themselves or combine them with other modules. Here are some examples using modules with the symbols `A` and `B`:`A` means to place the module with the symbol `A`.
- `A, B` means to place modules `A` and `B` together.
- `*` means to place a module as many times as possible. For example, `A*` means to place module `A` as many times as possible.
- `+` means to place a module at least one time and then as many times as possible. For example, `A+` means to place module `A` at least once and then as many times as possible.

- You can encapsulate Modules using square brackets `[]` to create module combinations:`[A, B]` combines modules `A` and `B`, and is placed together.
- `[A, B]*` means to place `A` and `B` together as many times as possible.
- `[A, B]+` means to place `A` and `B` together once and then as many times as possible.
- `[A, B]2` means to place `A` and `B` together twice.

- Module combinations can be randomized using curly brackets `{}` and weights : `{A:2, B:1}` means to choose A or B at random, with A twice as likely as B. The number after the colon is the weight. If you leave it out, the weight is 1. Only modules that still fit in the remaining space are considered.
- `{[A, B]:2, C:1}*` repeats the random choice as many times as possible, choosing again each time.

- You can set a priority order using angle brackets `<>`:`` means to place module `A` if there is enough room for it, otherwise module `B`, otherwise module `C`.

For example, the fence generator shown in the image above uses grammar rules to determine where to place a gate, fence sections, and posts along a spline. It uses the following modules:

| Symbol | Rule |
| --- | --- |
| `A` | Place a regular fence section. |
| `G` | Place a gate. |
| `P` | Place a fence post. |
| `BL` | Place a fence with a large broken section. |
| `BS` | Place a fence with a small broken section. |

It uses the grammar `{[A,P]:2,[BL,P]:1,[BS,P]:1}*,[G,P], {[A,P]:2,[BL,P]:1,[BS,P]:1}*`

The numbers after the colons are weights, so a regular fence section with a post is chosen twice as often as either broken section. Any space left over at the end of the spline is filled by stretching the modules that are marked Scalable in the module info.

The syntax translates to the following:

| Syntax | Meaning |
| --- | --- |
| `{[A,P]:2,[BL,P]:1,[BS,P]:1}*` | Randomly chooses between placing a fence section with a post, a large broken fence section with a post, or a small broken fence section with a post using the weighted values shown in the syntax. Fill until placing the gate at the midpoint of the spline. |
| `[G,P]` | Places a gate and a fence post. |
| `{[A,P]:2,[BL,P]:1,[BS,P]:1}*` | Randomly chooses between placing a fence section with a post, a large broken fence section with a post, or a small broken fence section with a post using the weighted values shown in the syntax. Fill until reaching the end of the spline. |

## PCG Grammar Nodes

PCG Grammar uses several graph nodes that define the grammar and shape of your system.

### Subdivision Nodes

#### Spline to Segment

The **Spline to Segment** node breaks a spline into segments of point data. Each segment is defined by two connected control points.

Each point sits at the midpoint of its segment, and its extents are half the distance between the two control points.

[image: Spline to Segment Node] Spline to Segment node

This node has the following options:

| Option | Description |
| --- | --- |
| **Extract Tangents** | Extracts the tangent between the previous segment and the next segment. Off by default. |
| **Extract Angles** | Extracts the angle between the previous segment and the next segment. The angle is zero at the ends of an open spline. On by default. |
| **Extract Connectivity Info** | Writes the index of each segment and of the previous and next segments, so you can keep track of how segments connect. On by default. |
| **Extract Clockwise Info** | Outputs a global attribute that tracks whether the spline points run clockwise or counterclockwise. Only applies to closed splines. On by default. |

#### Duplicate Cross-Sections

The **Duplicate Cross-Sections** node duplicates a spline along an extrusion vector following the rules of the selected grammar.

[image: Duplicate Cross-Sections node] Duplicate Cross-Sections node

This node has the following options:

| Option | Description |
| --- | --- |
| **Extrude Vector as Attribute** | Determines if the extrude vector is taken from the input spline as an attribute or fixed in the settings. |
| **Extrude Vector** | Defines the extrude vector. The default is (0, 0, 1000). |
| **Module Info as Input** | Reads the module info from an attribute set connected to the ModulesInfo pin, if checked. When checked, Attribute Names for Module Info lets you choose which attributes hold the Symbol and Size (required) and the Scalable and Debug Color values (optional). |
| **Modules Info** | Defines an array of modules to use for subdivision. Each module has a Symbol, a Size, whether it is Scalable, and a Debug Color. |
| **Seed Attribute** | Drives the random choices from an attribute instead of the seed, if checked. The attribute must convert to an integer. |
| **Seed** | Defines the seed value used to drive random generation. |
| **Extra Output Attributes** | Sets the names of the attributes written to the output: Symbol, Size, Scalable, and Debug Color. Size and Scalable are on by default, Debug Color is off. When module info comes from an input, Forward Attributes From Modules Info copies the module's own attributes instead. This node also writes a Spline Index attribute, and Extra Output Attributes On Data Domain chooses whether these attributes are written on the data domain or on the elements (control points) domain. |
| **Grammar As Attribute** | Reads the grammar from an attribute on the input instead of the grammar string, if checked. When checked, use Grammar Attribute to choose the attribute. |
| **Grammar String** | Defines the grammar string used for generation. |
| **Silence Grammar Does Not Fit Errors** | Stops the node from reporting an error when the grammar does not fit a cross-section. Found under Advanced. |

#### Subdivide Segment

The **Subdivide Segment **node subdivides segments based on the selected grammar and module information.

[image: Subdivide Segment Node] Subdivide Segment Node

This node has the following options:

| Option | Description |
| --- | --- |
| **Subdivision Axis** | Defines the subdivide direction in point local space. Choose the X, Y, or Z axis. The default is X. |
| **Flip Axis as Attribute** | Uses an attribute to define whether the axis should be flipped, if checked. |
| **Should Flip Axis** | Defines whether the axis should be flipped, if checked. |
| ** Module Info as Input** | Reads the module info from an attribute set connected to the ModulesInfo pin, if checked. When checked, Attribute Names for Module Info lets you choose which attributes hold the Symbol and Size (required) and the Scalable and Debug Color values (optional). |
| ** Modules Info** | Defines an array of modules to use for subdivision. Each module has a Symbol, a Size, whether it is Scalable, and a Debug Color. |
| **Accept Incomplete Subdivision** | Determines whether it is valid for a grammar not to fill the whole segment. Use this to address the “One segment has an incomplete subdivision” warning message. Off by default. |
| **Seed Attribute** | Drives the random choices from an attribute instead of the seed, if checked. The attribute must convert to an integer. |
| **Seed** | Defines the seed value used to drive random generation. |
| **Extra Output Attributes** | Sets the names of the attributes written to the output: Symbol, Size, Scalable, and Debug Color. Size and Scalable are on by default, Debug Color is off. When module info comes from an input, Forward Attributes From Modules Info copies the module's own attributes instead. |
| **Grammar As Attribute** | Reads the grammar from an attribute on the input instead of the Grammar String, if checked. When checked, use Grammar Attribute to choose the attribute. |
| **Grammar String** | Defines the grammar string used for generation. |
| **Module Index** | Writes the index of the module within the grammar to each point, if checked. Off by default. |
| **Output Extremity Attributes** | Writes IsFirst and IsFinal attributes that mark the first and last points of the segment, if checked. Off by default. |
| **Extremity Neighbor Index:** | Writes the index of the neighboring point at each end of the segment, if checked. Off by default. |
| **Silence Grammar Does Not Fit Errors** | Stops the node from reporting an error when the grammar does not fit a segment. Found under Advanced. |

#### Subdivide Spline

The **Subdivide Spline** node subdivides a spline based on the selected grammar and module information. Modules are placed so that both ends fall on the spline.

Tight corners might be underestimated and produce incorrect results.

[image: Subdivide Spline Node] Subdivide Spline node

This node has the following options:

| Option | Description |
| --- | --- |
| **Accept Incomplete Subdivision** | Determines whether it is valid for a grammar not to fill the whole spline. Use this to address the “The spline has an incomplete subdivision” warning message. Off by default. |
| **Module Height as Attribute** | Defines the module Z height using an attribute. |
| **Module Height** | Defines the module Z height. The default is 100. |
| **Module Info as Input** | Reads the module info from an attribute set connected to the ModulesInfo pin, if checked. When checked, Attribute Names for Module Info lets you choose which attributes hold the Symbol and Size (required) and the Scalable and Debug Color values (optional). |
| **Modules Info** | Defines an array of modules to use for subdivision. Each module has a Symbol, a Size, whether it is Scalable, and a Debug Color. |
| **Seed Attribute** | Drives the random choices from an attribute instead of the seed, if checked. The attribute must convert to an integer. |
| **Seed** | Defines the seed value used to drive random generation. |
| **Extra Output Attributes** | Sets the names of the attributes written to the output: Symbol, Size, Scalable, and Debug Color. Size and Scalable are on by default, Debug Color is off. When module info comes from an input, Forward Attributes From Modules Info copies the module's own attributes instead. |
| **Grammar As Attribute** | Reads the grammar from an attribute on the input instead of the Grammar String, if checked. When checked, use Grammar Attribute to choose the attribute. |
| **Grammar String** | Defines the grammar string used for generation. |
| **Module Index** | Writes the index of the module within the grammar to each point, if checked. Off by default. |
| **Output Extremity Attributes** | Writes IsFirst and IsFinal attributes that mark the first and last points of the spline, if checked. Off by default. |
| **Module Placement Tolerance** | Sets how much overlap or gap is acceptable between placed modules. Smaller values are more precise but slower. The default is 0.01. Found under Advanced. |
| **Center Bounds** | Centers each point's bounds on the spline, from -Height/2 to Height/2. On by default; older assets keep the previous 0 to Height behavior. Found under Advanced. |
| **Silence Grammar Does Not Fit Errors** | Stops the node from reporting an error when the grammar does not fit the spline. Found under Advanced. |

### Shape Definition Nodes

Shape definition nodes define the contours of your generated shapes.

#### Clean Spline

The **Clean Spline** node removes extraneous control points from splines and 2D polygons based on a user-defined threshold. These points can be either too close in proximity (co-location) or be unnecessary to defining the spline (collinear). If you turn off both operations, the input passes through unchanged.

[image: Clean Spline Node] Clean Spline node

This node has the following options:

| Option | Description |
| --- | --- |
| **Fuse Colocated Control Points** | Fuses control points that share the same location within a defined distance threshold. On by default. |
| **Colocation Distance Threshold** | Defines the distance threshold for fusing colocated control points. The default is a very small distance, so only points at the same location are fused. |
| **Use Spline Local Space** | Uses spline local space for distance calculations, if checked. |
| **Fuse Mode** | Controls how two colocated control points are fused. The default is Auto. This dropdown contains the following options:**Keep First**: Fuses the points at the location of the first point.**Keep Second**: Fuses the points at the location of the second point.**Merge**: Merges the points at a location halfway between the first and second points.**Auto**: Keeps the first point in most cases, but keeps the second point at the end of an open spline so that the spline does not get shorter. |
| **Remove Collinear Control Points** | Removes unnecessary points along linear sections of the spline that have no effect on the final result. On by default. |
| **Collinear Angle Threshold** | Defines the angle threshold used to determine whether points are collinear. The default is 5 degrees. |
| **Use Radians** | Uses radians instead of degrees when checking the angle threshold, if checked. |

#### Spline Direction

The **Spline Direction** node reverses the order of the control points, and their arrive and leave tangents.

Clockwise and counterclockwise are judged on the XY plane. If a node saved before Unreal Engine 5.6 shows a warning that the clockwise detection has changed, replace it with a new copy of the node.

[image: Spline Direction Node] Spline Direction node

This node has the following options:

| Option | Description |
| --- | --- |
| **Operation** | Defines the operation the node will perform. This dropdown contains the following options:**Reverse**: Reverses the spline points regardless of their initial orientation.**Force Clockwise**: Reverses the spline points if they are counter clockwise.**Force Counter Clockwise**: Reverses the spline points if they are clockwise. |

This can be a destructive operation with spline components, as some of the user data that defines the spline’s curves may be lost in the process.

#### Primitive Cross-Section

The **Primitive Cross-Section** node assists with transforming a set of primitive cross-sections into a spline. This node requires the **Procedural Content Generation Framework (PCG) Geometry Script Interop** plugin.

This node is part of the Procedural Content Generation Framework (PCG) Geometry Script Interop plugin, which is in Beta and disabled by default.

[image: Primitive Cross-Section Node] Primitive Cross-Section node

This node has the following options:

| Option | Description |
| --- | --- |
| **Slice Direction** | Defines the direction that slices will occur. Begins at the minimum vertex along the defined direction vector. |
| **Extrusion Vector Attribute** | Defines the name of the attribute that is populated with each cross-section extrusion vector. This vector contains length and direction data. |
| **Minimum Coplanar Vertices** | Defines the number of vertices that must be coplanar to be considered a tier feature. |
| **Tier Merging Threshold** | Defines the distance in centimeters from the previous tier within which a new tier is culled. Off by default. |
| **Min Area Culling Threshold** | Defines the minimum surface area a new tier must have or it will be culled. Off by default. The default threshold is 100. |
| **Min Height Culling Threshold** | Defines the minimum height a new tier must have, or it is culled. On by default, with a threshold of 1.0. |
| **Remove Redundant Sections** | Removes unnecessary tiers if it will not affect the contour of the cross-section. |
| M**ax Mesh Vertex Count** | Defines a maximum vertex count to avoid creating overly complex meshes. Meshes above the count are skipped with a warning. The default is 2048. Found under Advanced. |

### Generic Grammar Nodes

#### Select Grammar

The **Select Grammar** node selects a grammar string based on a user-defined key value and a set of criteria. For each point in a point data, the node checks the criteria that match the point's key, in order, until one is satisfied.

Each criterion has a Key, a Comparator, one or two values to compare against, and the Grammar to use when the comparison succeeds. Comparators are Select (always succeeds), less than, less than or equal, equal, greater than or equal, greater than, and inclusive or exclusive ranges. The node reports an error if a range is inverted or if several Select criteria share the same key.

[image: Select Grammar Node] Select Grammar Node

This node has the following options:

| Option | Description |
| --- | --- |
| **Key as Attribute** | Selects the key using an attribute. If Key as Attribute is unchecked, a single key defined using the **Key** option is used. |
| **Key Attribute** | Defines the attribute to use as the key. This option is set to **None** if **Key as Attribute** is unchecked. |
| **Compared Value Attribute** | Defines the attribute to compare to the key value. Evaluates each value numerically. The default value is ` $ScaledLocalSize.X `, which is the size of the scaled bounds of the point on the X axis. |
| **Criteria as Input** | Reads the criteria from an attribute set connected to the Selection Criteria Data pin, if checked. The attribute set needs Key, Comparator, FirstValue, SecondValue, and Grammar attributes, with the exact names. To use other names, enable Remap Criteria Attribute Names. |
| **Criteria** | Selects and defines the comparison criteria that is used to compare the key and compare value attributes. |
| **Copy Key for Unselected Grammar** | Passes through the key value for a given point, if no grammar is selected. |
| **Output Grammar Attribute** | Defines the name of the attribute that the selected grammar is written to. |
| **Remap Criteria Attribute Names** | Defines the specific attribute names that are expected for the comparison criteria, if checked. Available only when Criteria **as Input** is checked. |

#### Print Grammar

The **Print Grammar** node writes a detailed description of the current grammar string to its Description output pin, one line per module, showing how the string is interpreted. This is a utility node that helps you validate grammar strings. If the grammar has a problem, such as a missing bracket or an unknown symbol, the node reports it as a warning or an error on the graph.

This node has the following options:

| Option | Description |
| --- | --- |
| **Grammar** | Defines the grammar to validate. The breakdown is written to the Description output. |

- landscape
- building virtual worlds
- procedural generation
- grammar

On this page

- Important Concepts and Terms (-> using-shape-grammar-with-pcg-in-unreal-engine)
- Prerequisites (-> using-shape-grammar-with-pcg-in-unreal-engine)
- Grammar Syntax (-> using-shape-grammar-with-pcg-in-unreal-engine)
- PCG Grammar Nodes (-> using-shape-grammar-with-pcg-in-unreal-engine)
- Subdivision Nodes (-> using-shape-grammar-with-pcg-in-unreal-engine)
- Spline to Segment (-> using-shape-grammar-with-pcg-in-unreal-engine)
- Duplicate Cross-Sections (-> using-shape-grammar-with-pcg-in-unreal-engine)
- Subdivide Segment (-> using-shape-grammar-with-pcg-in-unreal-engine)
- Subdivide Spline (-> using-shape-grammar-with-pcg-in-unreal-engine)
- Shape Definition Nodes (-> using-shape-grammar-with-pcg-in-unreal-engine)
- Clean Spline (-> using-shape-grammar-with-pcg-in-unreal-engine)
- Spline Direction (-> using-shape-grammar-with-pcg-in-unreal-engine)
- Primitive Cross-Section (-> using-shape-grammar-with-pcg-in-unreal-engine)
- Generic Grammar Nodes (-> using-shape-grammar-with-pcg-in-unreal-engine)
- Select Grammar (-> using-shape-grammar-with-pcg-in-unreal-engine)
- Print Grammar (-> using-shape-grammar-with-pcg-in-unreal-engine)

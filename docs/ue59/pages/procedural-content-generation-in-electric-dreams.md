# Procedural Content Generation in Electric Dreams

https://dev.epicgames.com/documentation/en-us/unreal-engine/procedural-content-generation-in-electric-dreams?application_version=5.9

> Learn how Electric Dreams incorporates traditional and procedural workflows in Unreal Engine.

[image: Procedural Content Generation in Electric Dreams]

The **Electric Dreams Environment** incorporates both traditional and procedural workflows directly within Unreal Engine using the **Procedural Content Generation** framework (PCG). This page discusses the PCG framework in the context of the Electric Dreams demo with a description of important pieces that you can find in the sample, including:

- Tools (-> procedural-content-generation-in-electric-dreams)

- Custom Nodes and Subgraphs (-> procedural-content-generation-in-electric-dreams)

To learn more about the Procedural Content Generation framework in Unreal Engine, see our Procedural Content Generation framework (-> procedural-content-generation-framework-in-unreal-engine) documentation.

## Tools

This section describes the tools used to produce the Electric Dreams Environment demo's procedural content.

### Level to PCG Asset Utility

#### Description

The **Level to PCG Asset Utility** exports all static meshes, hierarchical instanced static meshes (HISM), and instanced static meshes (ISM) within a selected Level to a PCG Settings asset. The data is stored as PCG Point Data. In particular, the data is a point cloud of all the exported visuals with their transforms, mesh and material soft object paths, actor tags, and actor scene hierarchy information as attributes.

The resulting PCG Settings (-> procedural-content-generation-in-electric-dreams) asset can be added as an instanced node to any PCG Graph. This PCG Point Data can then be processed by any procedural rule (PCG Graph) to be augmented and/or spawned.

#### Setup

The blueprint asset utility is distributed with the PCG plugin and can be accessed here after enabling **Show Plugin Content**.

The content file path for the Level to PCG Asset Utility is: `/PCG/Utilities/PCGUtility_LevelToPCG`.

The content file path for all Electric Dreams' PCG Settings and their source levels is: `/PCG/Assets/PCGAssemblies`.

#### How to Use

To use the Level to PGG Asset Utility workflow, follow these steps:

- Select a Level in the **Content Browser**.

- Right-click and select the **Scripted Asset Action > PCG - Level To PCG Settings**. Click image to expand. If the selected level is World Partitioned or One File Per Actor (-> one-file-per-actor-in-unreal-engine) (OFPA) you'll first need to open it in the editor and load its content. For non-OFPA levels, it can be done directly from the content browser without opening the level in the editor.

- The previous step creates a **PCG Settings** asset next to the selected Level file using the level name with a "_PCG" suffix appended to the level name. If a PCG Settings asset with this name already exists, the existing asset is updated instead of creating a new one.

- Drag and drop the **PCG Setting** file from the **Content Browser** directly into your **PCG Graph** as an **Instanced** node.

- In the **PCG Graph**, connect the asset node's **Points** output to the source input of a **Copy Points** node and target the sets of points to which the source points should be copied onto. In the copy points node, set the Attribute Inheritance to Source Only to speed up processing when possible.

- Connect the **Copy Points** output to a **Static Mesh Spawner** node with its **Mesh Selector Type** set to "PCGMeshSelectorByAttribute" and its **Attribute Name** set to "Mesh". Click image to expand. By Attribute Material Overrides can be activated with "Material" as the value for Index0 if material overrides were used on the exported visuals.

You can also use the exported **Actor Tags** attributes to filter points using the **Point Filter **node in the PCG Graph. Examples of tag filtering use cases include:

- **NoCol**: Filter points based on their collision requirements and spawn them accordingly.

- **Clutter**: Add random noise and parameterized density to augment assemblies.

- **Helper**: Filter points that have a specific purpose in the rule but should not be spawned.

### Actor Tagger Editor Utility Widget

 [image: Actor Tagger Editor Utility Widget]

#### Description

The **Actor Tagger Editor Utility Widget** helps you compose actor tags on assets in a level. This utility widget speeds up the tagging workflow for levels intended to be exported to a PCG Settings asset.

While Unreal Engine has a qualified workflow for adding, editing, and removing actor tags on assets, it is not currently well suited for mass editing. An example of this is applying different actor tags to several selected actors. This results in the actor tags being obfuscated in the **Details** panel.

This is one of the current editor actor tag behaviors the Actor Tagger editor utility widget was created to mitigate, while also providing a localized palette of actions to keep the user focused on the tagging composition in the 3D viewport.

#### Setup

The content file path for the Actor Tagger editor utility widget is: `/Game/PCG/Utilities/ActorTagger/EUW_ActorTagger`

#### How to Use

To run the Actor Tagger, follow these steps:

- Select the **Actor Tagger** in the **Content Browser**.

- Right-click on the **Actor Tagger **and select **Run Editor Utility Widget**.

#### Features

##### Select Tag

Select all actors in the loaded level that have the tag entered in the **Select Tag** field. The current outliner selection is replaced with the result.

##### Remove Tag

Search all currently selected actors for the tag entered in the **Remove Tag** field. If the tag is present on an actor, that tag is removed.

##### Add Tag

Add the tag entered in the **Add Tag** field to all currently selected actors. If the tag already exists on a selected actor, it is not added a second time.

##### Hide

Hide all currently selected actors. If no actors are currently selected, any previously hidden actors are made visible.

##### Unlit / Lit

Toggle the state of the viewport lighting mode between lit and unlit.

##### Tools Section

###### Output Level Tags

All unique tags present in the loaded level are printed to the output log. This gives a quick overview of all actors tags in the loaded level.

 [image: Level Tags in the Output Log]

###### Make Tags Unique

This function runs over all actors in the currently loaded level and reduces any duplicate tags on a per-actor basis to a single tag entry.

###### Reference Level

This function loads or unloads a designated reference level. This might contain lighting and reference objects to help with the construction of a level to be exported as a PCG Settings asset.

 [image: Default Reference Level]

A default reference level is assigned when the editor utility widget is run. The default reference level can be found here: `/Game/PCG/Utilities/ActorTagger/ActorTagger_ReferenceLevel`.

This default can be customized by changing the assigned level in the widget construction script.

Click image to expand.

###### Set Reference Level

This function gives you the ability to assign your own reference level for loading and unloading. To assign your own reference level, choose a non-world partition level in the **Content Browser** and select this button. The assigned reference is not saved by the widget and needs to be re-assigned each time the widget is run.

## Custom Nodes and Subgraphs

This section describes the PCG custom nodes and subgraphs created for specific purposes in the Electric Dreams Environment's PCG Graphs.

### Copy Points With Hierarchy and Apply Hierarchy

 [image: Copy Points Hero Image]

#### Description

The **SG_CopyPointsWithHierarchy** and **ApplyHierarchy** nodes are used in conjunction with PCG Settings assets created with the Level to PCG asset utility.

You can use these nodes to manipulate hierarchies of points in a similar manner as hierarchies of actors in a level. Points can inherit from transformations of parent points. For example, using this feature, points representing tree trunks can be randomly rotated and scaled. Their child points, representing tree branches, then follow their parent trunk transforms, while also adding their own random rotation or scale building on the parent trunk transforms.

Points can be removed using Point Filter operators and have their child points automatically removed. This is useful to add random variation to complex points setups.

#### Setup

The SG_CopyPointsWithHierarchy and ApplyHierarchy nodes are present in the **Node Palette** in the Electric Dreams Environment sample project. They are also accessible through the **PCG Editor** context menu in the Graph area.

The content file path for the SG_CopyPointsWithHierarchy subgraph is: `/Game/PCG/Assets/PCGCustomNodes/SG_CopyPointsWithHierarchy`.

The content file path for the ApplyHierarchy custom node is: `/Game/PCG/Assets/PCGCustomNodes/ApplyHierarchy`.

The following PCG Graphs use these nodes:

- `/Game/PCG/Graphs/Ditch/PCGDemo_DitchBP`

- `/Game/PCG/Graphs/Ground/PCGDemo_GroundBP`

- `/Game/PCG/Assets/BP_PCG_LargeAssembly`

- `/Game/Levels/PCG/Breakdown_Levels/ElectricDreams_PCGSplineExample`

#### How to Use

Typical use of Hierarchy nodes in a PCG Graph. (Click image to expand.)

Typical use of the hierarchy nodes in the PCG Graph follows these steps:

- The **Level to PCG asset utility** converts a level to a PCG Settings asset containing PCG Points with associated scene hierarchy information stored as metadata attributes (-> procedural-content-generation-in-electric-dreams).

- The **SG_CopyPointsWithHierarchy** subgraph duplicates the PCG Settings assets at multiple locations using target point transforms, similar to what the **Copy Points** node does, but also maintaining and offsetting hierarchy attributes values so that parenting information becomes unique to each copy of the original asset's points.

- **Point Filter** nodes select points by attributes.

- **Transform Points** nodes with the **ApplyToAttributes** option transform selected points' relative transform attributes.

- **Merge** nodes recombine all points in the same hierarchy in the same data stream.

- The **ApplyHierarchy** node applies the relative transform attributes, combined with the parent transforms, to the points.

##### Hierarchy Attributes Produced by a PCG Settings Node

View of the Hierarchy attributes of the FallenTree PCG Settings asset. (Click image to expand.)

When exporting level actors to PCG Settings assets, actor hierarchy information in the source level is associated with each PCG Point using metadata attributes. These metadata attributes are:

| **Metadata Attribute** | **Type** | **Description** |
| --- | --- | --- |
| **ActorIndex** | int | Unique identifier of the point. |
| **ParentActorIndex** | int | Unique identifier of the point's parent point. |
| **HierarchyDepth** | int | How deep the point is in the parenting hierarchy. In other words, how many parents a point has between itself and the root point. |
| **RelativeTransform** | transform | The offset transform between the point and its parent in the source level of the PCG Settings (-> procedural-content-generation-in-electric-dreams) asset. |

A dummy point represents the hierarchy root point with the following metadata attributes:

- **ActorIndex**: 0

- **ParentActorIndex**: -1

- **HierarchyDepth**: 0

- **RelativeTransform**: Unit Transform

All points that have no parent specified in the source level hierarchy are parented by this root point to avoid handling special cases for orphan or root points.

##### Hierarchy Attributes Transformed by SG_CopyPointsWithHierarchy

Actor and Parent Actor Indices produced for each copy of the PCG Asset produced by SG_CopyPointsWithHierarchy. Note the 6 different root points ActorIndex values. (Click image to expand.)

SG_CopyPointsWithHierarchy subgraph. (Click image to expand.)

A custom version of the Copy Points node is needed to handle hierarchy indices. Its role is to ensure that, when a point is looking for its parent point, both the point and its resolved parent belong to the same copy or set of points produced by the Copy Points node.

This custom Copy Points node is implemented in the form of a subgraph that contains:

- A regular Copy Points node.

- A PostCopyPoints-OffsetIndices blueprint node responsible for assigning a unique set of Ids to each copy, computed from the original indices, the copy number and a unique task id.

- Two Create Attributes nodes used to initialize IgnoreParentRotation and IgnoreParentScale bool attributes to "false".

##### Points Manipulations in a Hierarchy

Once the points are copied at the location specified by the SG_CopyPointsWithHierarchy target points, it is possible to filter the resulting points by attributes present in the PCG Settings assets using **Point Filter** nodes:

 [image: Filter points with the Clutter Attribute]

Points filtering in PCGDemo_Ditch, using the Clutter attribute to randomly remove points in a hierarchy.

 [image: Filter points with the Rotation Z Attribute]

Points filtering in PCGDemo_Ditch, using the RotZ attribute to randomly rotate points in a hierarchy.

In the two images above, points are selected by tag, either filtered out or rotated, then merged back with points that were not selected by the **Point Filter**. This **Merge** operation is important because it ensures that all points, transformed or not, stay in the same data stream and can be processed together later when applying the final point transformations.

Click image to expand.

When a Transform Points node is used in a hierarchy, it is important to note that the transform must not be applied directly to the point's Transform, but rather to the RelativeTransform attribute. To do this, use "RelativeTransform" as the **Attribute Name** in the **Apply To Attribute** option. Optionally, you can set **IgnoreParentRotation** and/or **IgnoreParentScale** attributes to true if you want to partially inherit from the parent points transforms.

 [image: Apply Hierarchy]

Finally, the **ApplyHierarchy** node is used immediately before spawning the meshes with a **Static Mesh Spawner** node. The role of the ApplyHierarchy node is to:

- Iterate over all the existing hierarchy levels by ascending order (resolved from the hierarchy depth point attributes). Compute the final point transform from its parent transform and its RelativeTransform attribute value.

- Remove points whose parents have been discarded.

### Flat Area Detector

 [image: Flat Area Detector Hero]

#### Description

The **Flat Area Detector** subgraph is used to determine if a surface is flat enough to place points of a given size and avoid instances of misplaced assets, such as assets partially floating over the ground. The Flat Area Detector works on horizontal or sloped surfaces by sampling the surface at four different locations around each source point. Input points are discarded if any of the four sample locations don't intersect with a plane defined by the input points location and orientation. These planes are displayed as blue wireframes in the image above. Input points are further discarded if the surface orientation at any of the four sample locations diverges from the input point's orientation.

This subgraph is used in the following graphs:

- **PCGDemo_Ground** The Flat Area Detector is used in this graph to place clover patches on rough rocky mesh surfaces.

- The content file path for this graph is: `/Game/PCG/Graphs/Ground/PCGDemo_Ground`.

- **PCGDemo_Forest** The Flat Area Detector is used in this graph to place large, flat stone patches and hero rock assemblies on the landscape.

- The content file path for this graph is: `/Game/PCG/Graphs/Forest/PCGDemo_Forest`.

 [image: Flat stone patches partially floating over the landscape.]

 [image: Floating flat stone patches removed.]

#### Setup

The content file path for the Flat Area Detector subgraph is: `/Game/PCG/Graphs/Forest/DiscardPointsInBumpyAreas`.

#### How to Use

To use the Flat Area Detector as a node in a PCG Graph, drag and drop this graph from the **Content Browser** into the **PCG Graph** editor:

Click image to expand.

##### Description of Node Pins

The **DiscardPointsInBumpyAreas** node has the following pins and descriptions:

| **Pin** | **Type** | **Description** |
| --- | --- | --- |
| **In** | Points | The input points that are tested against the ProjectionTarget surface. |
| **InNoProjection** | Points | (Optional) This pin is an optimization and can be used instead of the In pin to feed input points if they already lie on the surface. |
| **ProjectionTarget** | Surface | Connect this pin to the surface whose flatness you want to evaluate. It can be a surface produced by a Get Landscape Data or World Ray Hit node. |
| **SampleDistance** | Attribute Set - Double | This pin takes a float or double attribute input, such as one provided by a Create Attribute node. This pin controls the distance between each source point and the sample points used to probe the surface. Visually, these points are represented by the X-Y extents of the blue wireframe in the image above. |
| **HeightThreshold** | Attribute Set - Double | This pin takes a float or double attribute input, such as one provided by a Create Attribute node. Sample points whose distance from the blue wireframe surface is greater than this value are considered off-plane and are then used to discard the input point. The off-plane points are the red boxes in the images above. |
| **NormalThreshold** | Attribute Set - Double | This pin takes a float or double attribute input, such as one provided by a Create Attribute node. This pin controls how much the sample points' up vectors can differ from the input points' up vector before discarding the input point. This value must be negative. More points are discarded the closer this value is to zero. |
| **Out** | Points | The set of remaining points that passed the HeightThreshold and NormalThreshold tests. |

#### Subgraph Overview

Click image to expand.

This section provides an overview of how the Flat Area Detector subgraph works.

##### Create Sample Points

 [image: Create Sample Points]

Attribute Math operations and Transform Points nodes create four sample points as follows:

- The sample points are placed in a 2D box around each input point.

- The size of this box is determined by the Sample Distance attribute.

- The bounds of each sample point are determined by the Height Threshold attribute.

##### Build Planes

 [image: Build Planes]

The flattened points, represented by the blue wireframes in the images above, are built from the Sample Distance attribute using Attribute Math operations.

##### Project Sample Points to the Surface

 [image: Project Points to Surface]

The four sample points are projected to the surface taking into account position and orientation. The difference between these projected points and the blue wireframe is then computed. This difference node outputs the points that are outside the plane.

Enabling the Debug state of these three nodes displays the blue wireframe, the four sample points in green, and the sample points that are not intersecting with the blue plane (visually, the blue wireframe) in red as seen in the images above.

##### Estimate the Variance of the Sample Points Orientation

Click image to expand.

Next, the variance of the sample points orientation is estimated. A point is created from the Input point and translated negatively along its up vector by the Normal Threshold value. This is shown as a solid blue plane in the images below. The intersection is computed between this point and flattened sample points, aligned to the surface normal vector. This is shown as the blue wireframe in the images below.

 [image: Normal Threshold = -300]

 [image: Normal Threshold = -10]

The image on the left represents a Normal Threshold value of -300, pushing down the blue solid plane along its up vector. The image on the right represents a Normal Threshold of -10. Using this value, the intersection now outputs a point shown as a red axis tripod. This demonstrates how to use Normal Threshold value to control the output of the intersection based on the variance of the sample points orientation.

Parallel sample points/planes only intersect with the solid blue point at a Normal Threshold value of 0.

##### Final Point Filtering

Click image to expand.

Lastly, points resulting from these two tests are expanded and used as a difference against the input points to filter them out. This leaves only points that respect the provided parameters in the DiscardPointsInBumpyAreas node's input pins.

### Look At

 [image: Look At Hero]

#### Description

The **LookAt** node reorients points to a target provided as a vector3 attribute. This attribute can be created through attribute math operations and distance nodes.

In the context of Electric Dreams, this node is used:

- In the ground rule to reorient points against the Large Assembly spline to achieve the desired visuals of the river bed.

- To rotate the fog card points toward the center of the area in both the fog cards and forest graphs.

#### Setup

The content file path for the LookAt custom node is: `/Game/PCG/Assets/PCGCustomNodes/LookAt`.

#### How to Use

The LookAt node iterates through a single point data input and expects a vector3 attribute as per point look at target coordinates.

Click image to expand.

To use the LookAt node, follow these steps:

- Create your point data.

- Add a new **LookAt** attribute to your point data using the **AddAttribute** set to **From Source Param**.

- Override the **Attributes** with any of these options: A **Create Attribute** node of type vector and your look at coordinates.

- A **Get Actor Property** from a Blueprint vector3 variable which can be exposed for customization.

- Create a PCG vector3 Graph parameter in the **Graph Settings** and get "parameter name" in the graph which will be exposed on every graph instance, editable per PCG Component.

- Set the **LookAt** node settings: Set the **LookAt** **Target** as the attribute name to use.

- The **2D LookAt** setting ignores the Z-component.

- **Forward X** uses the X-axis for the **LookAt** instead of the Y-axis.

- procedural content generation
- pcg
- electric dreams

On this page

- Tools (-> procedural-content-generation-in-electric-dreams)
- Level to PCG Asset Utility (-> procedural-content-generation-in-electric-dreams)
- Description (-> procedural-content-generation-in-electric-dreams)
- Setup (-> procedural-content-generation-in-electric-dreams)
- How to Use (-> procedural-content-generation-in-electric-dreams)
- Actor Tagger Editor Utility Widget (-> procedural-content-generation-in-electric-dreams)
- Description (-> procedural-content-generation-in-electric-dreams)
- Setup (-> procedural-content-generation-in-electric-dreams)
- How to Use (-> procedural-content-generation-in-electric-dreams)
- Features (-> procedural-content-generation-in-electric-dreams)
- Select Tag (-> procedural-content-generation-in-electric-dreams)
- Remove Tag (-> procedural-content-generation-in-electric-dreams)
- Add Tag (-> procedural-content-generation-in-electric-dreams)
- Hide (-> procedural-content-generation-in-electric-dreams)
- Unlit / Lit (-> procedural-content-generation-in-electric-dreams)
- Tools Section (-> procedural-content-generation-in-electric-dreams)
- Output Level Tags (-> procedural-content-generation-in-electric-dreams)
- Make Tags Unique (-> procedural-content-generation-in-electric-dreams)
- Reference Level (-> procedural-content-generation-in-electric-dreams)
- Set Reference Level (-> procedural-content-generation-in-electric-dreams)
- Custom Nodes and Subgraphs (-> procedural-content-generation-in-electric-dreams)
- Copy Points With Hierarchy and Apply Hierarchy (-> procedural-content-generation-in-electric-dreams)
- Description (-> procedural-content-generation-in-electric-dreams)
- Setup (-> procedural-content-generation-in-electric-dreams)
- How to Use (-> procedural-content-generation-in-electric-dreams)
- Hierarchy Attributes Produced by a PCG Settings Node (-> procedural-content-generation-in-electric-dreams)
- Hierarchy Attributes Transformed by SG_CopyPointsWithHierarchy (-> procedural-content-generation-in-electric-dreams)
- Points Manipulations in a Hierarchy (-> procedural-content-generation-in-electric-dreams)
- Flat Area Detector (-> procedural-content-generation-in-electric-dreams)
- Description (-> procedural-content-generation-in-electric-dreams)
- Setup (-> procedural-content-generation-in-electric-dreams)
- How to Use (-> procedural-content-generation-in-electric-dreams)
- Description of Node Pins (-> procedural-content-generation-in-electric-dreams)
- Subgraph Overview (-> procedural-content-generation-in-electric-dreams)
- Create Sample Points (-> procedural-content-generation-in-electric-dreams)
- Build Planes (-> procedural-content-generation-in-electric-dreams)
- Project Sample Points to the Surface (-> procedural-content-generation-in-electric-dreams)
- Estimate the Variance of the Sample Points Orientation (-> procedural-content-generation-in-electric-dreams)
- Final Point Filtering (-> procedural-content-generation-in-electric-dreams)
- Look At (-> procedural-content-generation-in-electric-dreams)
- Description (-> procedural-content-generation-in-electric-dreams)
- Setup (-> procedural-content-generation-in-electric-dreams)
- How to Use (-> procedural-content-generation-in-electric-dreams)

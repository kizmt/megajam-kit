# Dataprep Selection Transform Reference

https://dev.epicgames.com/documentation/en-us/unreal-engine/dataprep-selection-transform-reference-in-unreal-engine?application_version=5.9

> Details on ways you can transform the list of objects you want to modify in the Dataprep system.

[image: Dataprep Selection Transform Reference]

This page describes each of the **Transform** blocks that you can use in the Visual Dataprep system to change the objects selected for an Action.

Each type of **Transform** block encapsulates a specific type of modification that the Unreal Editor can make to the selection of Assets and Actors passed to it. The block then passes the modified selection on to the next block below it within the same Dataprep Action.

Transform blocks are like filters, in that they determine the set of Actors and Assets that other Dataprep blocks in the same Action will operate on. However, a filter block can only cut down the list of objects passed down to it. A **Transform** block, on the other hand, can add objects to the current selection.

## Common Controls

All **Transform** blocks offer the **Output Can Include Input** setting.

- When this setting is enabled, the **Transform** block always adds the Actors and Assets passed in to the block to the output selection that it passes on to the next block in the Dataprep Action.

- When this setting is disabled, the **Transform** block only adds the Actors and Assets passed in to the block to the output selection if those Actors and Assets also pass the other selection criteria built in to the block.

## Reference Selection Transform

This operation checks each Actor and Asset in the input list looking for references to other Assets in the temporary world. It then adds each referenced Static Mesh, Material, and Texture Asset that it finds to the output selection that it passes on to the next block.

 [image: Reference Selection Transform]

## Select Hierarchy

For each Actor passed in to this block, this transform looks for other Actors that are children of that input Actor. It then adds all of those child Actors to the output selection that it passes on to the next block.

 [image: Select Hierarchy]

| Setting | Description |
| --- | --- |
| **Select** | Determines how deeply the selection extends into the descendants of each input Actor. Use **Immediate Children** to have the output selection contain only Actors that are direct children of the Actors passed in to the transform block. Use **All Descendants** to have the output selection recurse to include the complete hierarchies under the Actors passed in to the transform block. |

## Select Actor Components

For each Actor passed into this block, this transform looks for all Components of previously selected Actors. It then adds those Components to the output selection that it passes on to the next block.

 [image: Select Actor Components]

## Select Owning Actor

This transform looks for the parent Actor of each Component passed in to this block. It then adds the parent Actor to the output selection that it passes on to the next block.

 [image: Select Owning Actor]

- ui
- datasmith
- enterprise
- manufacturing
- dataprep

On this page

- Common Controls (-> dataprep-selection-transform-reference-in-unreal-engine)
- Reference Selection Transform (-> dataprep-selection-transform-reference-in-unreal-engine)
- Select Hierarchy (-> dataprep-selection-transform-reference-in-unreal-engine)
- Select Actor Components (-> dataprep-selection-transform-reference-in-unreal-engine)
- Select Owning Actor (-> dataprep-selection-transform-reference-in-unreal-engine)

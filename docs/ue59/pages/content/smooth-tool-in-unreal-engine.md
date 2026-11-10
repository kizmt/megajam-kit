# Smooth

https://dev.epicgames.com/documentation/en-us/unreal-engine/smooth-tool-in-unreal-engine?application_version=5.9

> Overview of the Smooth modeling tool for softening the edges of a mesh.

[image: Smooth]

Learn to use this **Beta** feature, but use caution when shipping with it.

The **Smooth** tool softens the edges of surfaces by moving vertices towards the averaged location of their neighbors. This operation is helpful to use when a mesh has jagged edge artifacts.

 [image: Jagged Cobble]

 [image: Smooth Cobble]

## Accessing the Tool

You can access the Smooth tool from the following:

- The **Deform** category in **Modeling Mode**. To learn more about Modeling Mode and how to access it, see Modeling Mode Overview (-> modeling-mode-in-unreal-engine).

- The **Editing Tools** tab in the **Skeleton Editor**. To learn more, see Skeleton Editing.

## Using Smooth

How you smooth your mesh is set by the **Smoothing Type** property. Each smoothing type has options to adjust the smoothing amount.

The **Fast Iterative** and **Fast Implicit** smoothing types have a vertex weight map option to adjust specific areas of your mesh. You must first create the weight map layer in the Attribute Edit (-> edit-attributes-tool-in-unreal-engine) tool. The comparison images above use a weight map to create the cobblestone effect.
To learn more about creating weight maps, see Paint Maps Tool (-> paint-maps-tool-in-unreal-engine).

Sometimes, your mesh can seem to have disappeared when using the Smooth tool. Your mesh has not disappeared but has significantly smoothed and shrunken in size. This change in size happens based on the resolution (number of triangles) of your mesh and values used with the **Iterative Smoothing Options**.

To avoid this issue, do one of the following:

- Increase the number of triangles the mesh has with the **Remesh** tool (you must cancel the current tool session to do this).

- Lower the **Smoothing Per Step** setting under the **Iterative Smoothing Options**.

- Lower the **Steps** settings under **Iterative Smoothing Options**.

Once you are done using the tool, accept or cancel the changes in the Tool Confirmation (-> modeling-mode-in-unreal-engine) panel.

### Hotkeys

| **Key Command** | **Operation** |
| --- | --- |
| **F** | Zooms into the location of the mesh. |
| **ESC** | Cancels the changes and exits the tool. |
| **Enter** | Accepts the tool changes. |

- beta
- modeling mode
- sculpting
- skeleton editing

On this page

- Accessing the Tool (-> smooth-tool-in-unreal-engine)
- Using Smooth (-> smooth-tool-in-unreal-engine)
- Hotkeys (-> smooth-tool-in-unreal-engine)

Related documents

Modeling Tools

 [image: Modeling Tools] (-> modeling-tools-in-unreal-engine)Modeling Mode Overview

 [image: Modeling Mode Overview] (-> modeling-mode-in-unreal-engine)

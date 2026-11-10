# Setting Up Level of Detail for Grooms

https://dev.epicgames.com/documentation/en-us/unreal-engine/setting-up-level-of-detail-for-grooms-in-unreal-engine?application_version=5.9

> Learn how you can set up and manage level of detail groups for your grooms.

Like many other types of geometry in Unreal Engine, it's just as important to set up levels of detail (LOD) for your grooms. Simplifying your grooms the farther they are from the camera decreases their rendering cost while improving performance.

You can set up and manage LODs for your groom in the Groom Asset Editor (-> groom-asset-editor-user-guide-in-unreal-engine) from the **LOD** panel. This is where you can define how the various hair groups behave according to their screen coverage.

 [image: Groom Asset Editor LOD Panel]

- Current LOD visualization stats

- LOD Mode

- Manual Decimation and Screen Size Properties

## Setting Up Level of Detail

At the top of the **LOD** panel, you can select the **LOD Mode** you want to use for this groom. This mode affects how the strand geometry handles switching between levels of detail.

Choose one of the following options:

 [image: Groom LOD Mode]

- **Default:** Uses the LOD mode defined in the project settings.

- **Auto:** Automatically adapts the number of curves of the strands based on the groom's screen size, meaning there is no need to create manual LOD entries. This overrides the default LOD mode.

- **Manual:** Adapts the number of curves and points of strand geometry based on information in the LOD entries. This overrides the default LOD mode.

You can use **Auto LOD Bias** to increase the distance at which the groom starts to reduce the number of curves. This can be useful when the automatic curve reduction is too visible.

For each colored hair group, you can create up to 8 LOD entries. Each LOD entry primarily defines the screen size at which it becomes active, the type of geometry used, the type of binding to use, and more. You can add additional LODs to each group by clicking on the **Add (+)** next to the first group in the LOD panel.

 [image: Add a LOD to the groom.]

For each hair group, you can decide which type of geometry to use:

- **Strands:** Uses strand geometry and supports skinning, RBF, and simulation.

- **Cards:** Uses card (or flat sheets) geometry and supports skinning, RBF, and simulation.

- **Meshes:** Uses mesh geometry, such as a hair helmet. Only RBF is supported.

To learn more about setting up cards and mesh geometry, see Setting up Cards and Meshes for Grooms (-> setting-up-cards-and-meshes-for-grooms-in-unreal-engine).

These are examples of each geometry type on a MetaHuman character created in MetaHuman Creator.

|  |  |  |
| --- | --- | --- |
| [image: Strands Geometry] | [image: Cards Geometry] | [image: Hair Helmet Mesh] |
| Strands | Cards | Mesh |

When specifying a geometry type, the settings change to reflect the selected type. Strands include its own decimation settings, while cards and meshes only use screen size.

|  |  |
| --- | --- |
| [image: Strands LOD Settings] | [image: Cards and Meshes LOD Settings] |
| Strands LOD Settings | Cards and Meshes LOD Settings |

When you set the **LOD Mode** to **Manual**, the hair group settings for decimation and screen size become editable for any of the three groom geometry types. The topmost portion of the panel, under the colored hair group ID, is the number of **Curves** and **Points** this LOD group has.

 [image: LOD number of curves and points]

## Visualizing Groom LODs

In the Groom Asset Editor preview window, you can visualize the level of detail automatically or by specifying a particular level when using the **LOD** selection menu.

 [image: Viewport LOD Visualization Selection]

When set to **LOD Auto**, LODs switch between levels automatically based on their screen size. Alternatively, you can use the dropdown to view the available levels of detail regardless of screen size.

The following stats for each LOD type displays its:

- Geometry type

- LOD Index

- Screen Size

- Number of curves

- Number of points

- Hair thickness scale

 [image: Groom LOD Stats]

Examples of LOD stats for Strands, Cards, and Meshes geometries.

## Groom Asset Editor LOD Properties

The following properties are available in the **LOD** panel:

| Property | Description |
| --- | --- |
| **LOD Mode** | Defines how LOD adapts curves and points for strand geometry. **Auto** adapts the curve count based on screen coverage. **Manual** uses the discrete LOD created for each group. |
| **Auto LOD Bias** | When Auto LOD is selected, it decreases the screen size at which the curve's reduction occurs. |
| Hair Groups |  |
| **Curve Decimation** | Reduces the number of hair strands in a uniform manner. |
| **Vertex Decimation** | Reduces the number of points for each hair strand. |
| **Angular Threshold** | Max angular difference between adjacent vertices to remove vertices during simplification, in degrees. |
| **Screen Size** | Screen size at which this LOD should be enabled. |
| **Thickness Scale** | Scales the hair strands radius. This can only be used for manually compensating the reduction of curves. |
| **Visible** | Defines whether this hair group's LODs are visible. |
| **Geometry Type** | Defines the type of geometry used by this LOD: Strands, Cards, or Meshes. |
| **Binding Type** | Defines the type of attachment: **Rigid:** When attached to a skeletal mesh, the groom uses the provided attachment name on the groom component. **Skinning:** When attached to a skeletal mesh, the groom is deformed by the skeletal mesh's skinned surface. |
| **Simulation** | Sets whether this groom simulates physics interactions. This overrides the global **Simulation Enable** settings in the **Physics** panel of the Groom Asset Editor. |
| **RBF Interpolation** | Sets whether this groom uses RBF Interpolation. This overrides the global **RBF Interpolation** setting in the **Interpolation** panel of the Groom Asset Editor. |

- rendering
- physics
- hair
- metahumans
- grooms

On this page

- Setting Up Level of Detail (-> setting-up-level-of-detail-for-grooms-in-unreal-engine)
- Visualizing Groom LODs (-> setting-up-level-of-detail-for-grooms-in-unreal-engine)
- Groom Asset Editor LOD Properties (-> setting-up-level-of-detail-for-grooms-in-unreal-engine)

# Groom Asset Editor

https://dev.epicgames.com/documentation/en-us/unreal-engine/groom-asset-editor-user-guide-in-unreal-engine?application_version=5.9

> A reference and user guide for the managing attributes and editing Groom Assets.

[image: Groom Asset Editor]

The **Groom** system is designed to handle hair strands from imported groom Alembic `.abc` files. However, for scalability purposes, it also supports alternative geometry representations using cards and meshes. All of these geometric representations are managed within a single asset and component for ease of setup. The **Groom Asset Editor** manages most of the aspects of your groom, enabling you to modify various parts of the groom for how it's rendered, how it handles physics simulation, creating and managing levels of detail (LODs), and much more.

## Opening the Groom Asset Editor

The Groom Asset Editor is opened from the Content Browser by **double-clicking any Groom Asset**, or through the **right-click context menu of a Groom Asset**.

 [image: Groom Asset in the Content Browser]

## Groom Asset Editor Interface

The Groom Asset Editor is comprised of these regions:

Click image for full size.

- Viewport Display Options (-> groom-asset-editor-user-guide-in-unreal-engine): Includes viewport options, view perspectives, view modes, debug views, and level of detail visualization.

- Viewport (-> groom-asset-editor-user-guide-in-unreal-engine): Displays the groom asset with its assigned materials, level of details, and physics representation.

- Details Panels (-> groom-asset-editor-user-guide-in-unreal-engine): Includes

## Viewport Display Options

The **Viewport Display Options** toolbar provides basic rendering and visualization options.

 [image: The Viewport Display Option Toolbar]

### Viewport Options

The **Viewport Options** dropdown menu provides basic rendering options within the viewport. You can toggle real-time mode, change the field of view, and set the screen percentage for supersampling.

These options, and more, are accessed using the dropdown **arrow** in the viewport display options toolbar.

 [image: Viewport Options Dropdown Menu]

### Perspectives

The **Perspectives** dropdown provides perspective and orthographic views; a perspective view that's a 3D window into the level, and orthographic views that are 2D viewports that look down on of the main XYZ axes.

 [image: The Perspectives Viewport Dropdown Menu]

### View Modes

The **View Modes** dropdown provides a number of visualization options common to all editor viewports, such as lighting, optimization, materials, and exposure value control for the viewport.

 [image: The View Modes Dropdown Menu]

### Show

The **Show** dropdown provides Groom Asset Editor specific visualization options to help you see the type of data being processed in your scene, as well as diagnose errors or unexpected results for this groom.

 [image: The Show Dropdown Menu]

| Property | Description |
| --- | --- |
| **Guide** | Displays the guides used for simulation. |
| **Guide Influence** | Shows simulation clumps (all the strands influenced by one guide) in color visualization. |
| **UV** | Displays the UV along each strand. |
| **Root UV** | Displays the UV at the root of each strand. |
| **Root UDIM** | Displays the UDIM at the root of each strand. |
| **Dimension** | Displays the width/length variations of each strand. |
| **Seed** | Displays (in color) the random seed used per strand. |
| **Radius Variation** | Shows (in color) the size of the strands. Blue represents thinner strands. Yellow represents thicker strands. |
| **Tangent** | Displays tangents direction of each strand. |
| **Base Color** | Displays the base color stored per vertex. If base color is not exported from your modeling application with your groom, the strands will appear black. |
| **Roughness** | Displays the roughness stored per vertex. If the roughness is not exported from your modeling application with your groom, the strands will appear black. |
| **Hair CVs** | Displays hair strands CVs. |
| **Vis. Clusters** | Shows clusters of hair used for culling and level of detail purposes. |
| **Hair Groups** | Displays hair groups. |
| **Cards Guide** |  |

These are some example visualizations from the **Show** dropdown.

|  |  |  |  |
| --- | --- | --- | --- |
| [image: Show Seed Visualization] | [image: Show Hair CVs Visualization] | [image: Show Vis. Clusters Visualization] | [image: Show Base Color Visualization] |
| Seed | Hair CVs | Vis.Clusters | Base Color |

### LODs

The LODs dropdown enables you to visualize levels of detail within the viewport automatically or by specifying a particular level.

 [image: The LODs Dropdown]

Switch between LODs automatically based on the options specified in the Level of Detail (-> groom-asset-editor-user-guide-in-unreal-engine) panel when using the LODs Auto option. This option automatically switches LODs based on their screen size in the viewport. Alternatively, use the dropdown to select from the available levels of detail that have already been generated to see them represented regardless of screen size.

## Viewport

The **Viewport** is where you can view your imported Groom Asset with changes made in its different details panels, and use different visualization and debug view modes to inspect your groom.

## Details Panels

The Groom Asset Editor has several **Details** panels to set and configure a variety of attributes related to your groom.

 [image: Groom Asset Editor Details Panels]

Explore the pages below to learn more about each of these Details panels:

| Details Panel | Description |
| --- | --- |
| Level of Detail (-> setting-up-level-of-detail-for-grooms-in-unreal-engine) | Use this panel to configure the number of LODs your groom has and each of their properties. |
| Interpolation (-> groom-interpolation-in-unreal-engine) | Use this panel to define how the groom's curves should move with respect to skinning and physics simulation. |
| Strands (-> groom-strands-in-unreal-engine) | Use this panel to configure properties of your groom's strand geometry. |
| Cards (-> setting-up-cards-and-meshes-for-grooms-in-unreal-engine) | Use this panel to configure and generate card geometry for your groom's LODs. These cards are generated and assigned per-LOD. |
| Meshes (-> setting-up-cards-and-meshes-for-grooms-in-unreal-engine) | Use this panel to configure and generate mesh geometry for your groom's LODs. These can be generated and assigned per-LOD. |
| Materials (-> groom-materials-in-unreal-engine) | Use this panel to assign materials to your groom. |
| Physics (-> enabling-physics-simulation-on-grooms-in-unreal-engine) | Use this panel to set up your groom's physics simulation. |

- rendering
- lighting
- physics
- hair
- metahumans

On this page

- Opening the Groom Asset Editor (-> groom-asset-editor-user-guide-in-unreal-engine)
- Groom Asset Editor Interface (-> groom-asset-editor-user-guide-in-unreal-engine)
- Viewport Display Options (-> groom-asset-editor-user-guide-in-unreal-engine)
- Viewport Options (-> groom-asset-editor-user-guide-in-unreal-engine)
- Perspectives (-> groom-asset-editor-user-guide-in-unreal-engine)
- View Modes (-> groom-asset-editor-user-guide-in-unreal-engine)
- Show (-> groom-asset-editor-user-guide-in-unreal-engine)
- LODs (-> groom-asset-editor-user-guide-in-unreal-engine)
- Viewport (-> groom-asset-editor-user-guide-in-unreal-engine)
- Details Panels (-> groom-asset-editor-user-guide-in-unreal-engine)

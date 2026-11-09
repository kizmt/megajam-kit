# Setting Up Bindings for Grooms

https://dev.epicgames.com/documentation/en-us/unreal-engine/setting-up-bindings-for-grooms-in-unreal-engine?application_version=5.9

> Learn how to bind groom components to skeletal meshes.

[image: Setting Up Bindings for Grooms]

**Groom Binding** assets are used to attach and skin a Groom component to a Skeletal Mesh component. No binding is needed if a groom asset only needs to be “rigidly” attached to a skeletal mesh.

## Creating a Binding Asset

To create a Binding asset:

- Locate a **Groom** asset in the **Content Browser**.

- Right-click on the groom and select **Create Binding** from the context menu.

- In the **Groom Binding Options** dialog window, set the following: [image: Groom Binding Options] Set **Groom Binding Type** to **Skeletal Mesh** or **Geometry Cache** to bind the groom to. Selecting **Geometry Cache** as the Groom Binding Type requires the **Geometry Cache** plugin to be enabled.

- Set **Target Skeletal Mesh / Target Geometry Cache** to select which skeletal mesh or geometry cache asset this groom should be bound to. You must select a skeletal mesh or geometry cache to create a binding asset.

### Advanced Options for Creating a Binding Asset

The Groom Binding Options dialog contains some advanced options you can use when creating a binding asset:

- Use **Num Interpolation Points** to define the number of samples used for the hair global interpolation, which is optionally enabled within the Groom Asset Editor under the **Interpolation** panel with the setting **RBF Interpolation** under the **Hair Interpolation** section. Global interpolation preserves the original groom shape under large skeletal mesh deformations. Using more samples means more accurate deformation but also implies additional cost. In general, a 100 samples or less should be good enough.

- **Source Skeletal Mesh** optionally defines the mesh on which the groom was authored on. The mesh could be different from the Target Skeletal Mesh assigned, and the topology could also be different. The system assumes both the Source and Target meshes share the same UV mapping to transfer the hair curves and positions. The **Matching Section** constrains the transfer to use only a particular mesh section.

## Setup

To use a groom binding asset to bind a groom to a skinned mesh:

- Create a **Groom** component and make it a child component of a skeletal mesh. You can do this directly on a Skeletal Mesh in a level or in a Blueprint. |  |  |
| --- | --- |
| [image: A Groom component on a level actor.] | [image: A groom component in a Blueprint.] |
| A Groom component on a level actor. | A Groom component in a Blueprint. |

- With the **Groom** component selected, perform the following actions in the **Details** panel: Assign a groom asset to the **Groom Asset** assignment slot.

- Assign a groom binding asset to the **Binding Asset** assignment slot.

Your groom should look attached similarly to how the one pictured below is:

 [image: Groom Attached to a Skeletal Mesh]

The binding data is only used if the current level of detail (LOD) **Binding Type** is set to **Skinning**. This can be set up separately for each LOD in the Groom Asset Editor (-> groom-asset-editor-user-guide-in-unreal-engine) under the **LOD** panel settings. You can verify the current active binding type in the level by selecting **Lit > Instances** in the viewport menus and visualizing the Binding Type for each.

Click image for full size.

## Previewing Groom Bindings in Groom Asset Editor

The **Binding** panel in the Groom Asset Editor is where you'll manage any binding asset assigned to this groom. It lists all the groom binding assets compatible with the current groom asset.

 [image: Previewing Groom Bindings in the Groom Asset Editor.]

You can use the **Eye** icon below the binding asset assignment slot to preview the binding asset within the preview window.

 [image: Groom Binding Visibility Toggle.]

You can use the animation assignment slot above the preview window to select an available animation to preview the hair deformation for the current groom. Use the play and stop buttons to start and stop the animation in the preview window.

 [image: Groom Binding Preview with Animation]

You can visualize a groom's **Root** data in a level by selecting **Lit > Groom > Root Bindings**. The root binding data for each rendered strand is shown by a colored white line at the root of the hair, along with the corresponding triangle on which the root is bound.

 [image: Groom Root Bindings Visualization]

## Groom Binding Properties

### Groom Binding Options Properties

The following properties are found in the Groom Binding Options dialog when creating a groom binding asset:

 [image: Groom Binding Options]

| Property | Description |
| --- | --- |
| Build Settings |  |
| **Groom Binding Type** | Select the type of mesh to create a groom binding for: **Skeletal Mesh** or **Geometry Cache**. |
| **Target Skeletal Mesh / Target Geometry Cache** | Select the Skeletal Mesh / Geometry Cache asset on which this groom is attached to. |
| Hair Interpolation Points |  |
| **Num Interpolation Points** | The number of points used for the RBF interpolation. |
| Conversion |  |
| **Source Skeletal Mesh / Source Geometry Cache** | The Skeletal Mesh / Geometry Cache on which the groom has been authored. This is optional and used only if the hair binding is done on a different mesh than the one which it has been authored. For instance, only if the curve's roots and the surface geometry don't align and need to be wrapped / transformed. |
| **Matching Section** | Section to pick to transfer the position. |

### Groom Binding Asset Editor Properties

The following properties are found in the Groom Asset Editor when opening a groom asset:

| Property | Description |
| --- | --- |
| Build Settings |  |
| **Groom Binding Type** | Select the type of mesh to create a groom binding for: **Skeletal Mesh** or **Geometry Cache**. |
| **Groom** | The groom this binding asset uses. |
| **Source Skeletal Mesh / Source Geometry Cache** | The Skeletal Mesh / Geometry Cache on which the groom has been authored. This is optional and used only if the hair binding is done on a different mesh than the one which it has been authored. For instance, only if the curve's roots and the surface geometry don't align and need to be wrapped / transformed. |
| **Target Skeletal Mesh / Target Geometry Cache** | Select the Skeletal Mesh / Geometry Cache asset on which this groom is attached to. |
| **Num Interpolation Points** | The number of points used for the radial bias function (RBF) interpolation. |
| **Matching Section** | Section to pick to transfer the position. |
| Hair Groups |  |
| **Curve Count** | Number of curves this hair group has. |
| **Curve LOD** | Number of curve LOD this hair group has. |
| **Guide Count** | Number of guides this hair group has. |
| **Guide LOD** | Number of guide LODs this hair group has. |

### Groom Asset Editor Binding Properties

The following properties are found in the **Groom Asset Editor** under the **LOD** panel:

 [image: Groom Asset Editor Binding Properties]

| Property | Description |
| --- | --- |
| Groom |  |
| **Binding Type** | Sets the groom simulation mode to represent this level of detail. Each level of detail group can choose between the following binding types: **Rigid:** The hair follows the provided attachment name of a skeletal mesh. **Skinning:** The hair follows a skin surface of a skeletal mesh. |

- rendering
- physics
- hair
- metahumans
- grooms

On this page

- Creating a Binding Asset (-> setting-up-bindings-for-grooms-in-unreal-engine)
- Advanced Options for Creating a Binding Asset (-> setting-up-bindings-for-grooms-in-unreal-engine)
- Setup (-> setting-up-bindings-for-grooms-in-unreal-engine)
- Previewing Groom Bindings in Groom Asset Editor (-> setting-up-bindings-for-grooms-in-unreal-engine)
- Groom Binding Properties (-> setting-up-bindings-for-grooms-in-unreal-engine)
- Groom Binding Options Properties (-> setting-up-bindings-for-grooms-in-unreal-engine)
- Groom Binding Asset Editor Properties (-> setting-up-bindings-for-grooms-in-unreal-engine)
- Groom Asset Editor Binding Properties (-> setting-up-bindings-for-grooms-in-unreal-engine)

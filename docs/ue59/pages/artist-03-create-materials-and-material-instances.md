# Create Materials and Material Instances

https://dev.epicgames.com/documentation/en-us/unreal-engine/artist-03-create-materials-and-material-instances?application_version=5.9

> Use materials and material instances to surface a level.

[image: Create Materials and Material Instances]

In this tutorial, you’ll dive further into **Materials** and **Material Instances**. You’ll learn about Material toolsets and techniques that can help you make artistic choices, increase development speed, and control overhead in your project. Later on, you’ll apply Materials to game assets and use Blueprints to control Materials based on player actions within your level.

## Before You Begin

This module requires bright level lighting. If you've reduced lighting in your level per the previous tutorial (-> artist-02-light-a-scene), use the following settings:

|  |  |
| --- | --- |
| **Directional Light Intensity** | 6.0 |
| **Min EV100** | False |
| **Max EV100** | False |

## Materials and Material Instances

Materials (-> essential-unreal-engine-material-concepts) define the surface properties of assets in your game. Like textures (-> textures-in-unreal-engine), Materials are like wrapping paper that covers a mesh, changing how its surface looks and reacts to light sources.

[image: From left to right: a bare mesh and a surfaced mesh.] From left to right: a bare mesh and a surfaced mesh.

Unlike textures, Materials offer non-destructive customization through node-based workflow. For example, Materials contain preset **properties **that mimic attributes of real-world substances like stone or metal. The only difference between the Materials in the image below is their **metallic **and **roughness **properties.

Materials can combine textures and logic to produce complex substances layer-by-layer. Through these combinations, you can make artistic choices that influence the worldbuilding in your project. This can be as simple as adding scratches to metal game assets, or as complex as water washing over sand.

[image: Water and sand substrate material.] Water and sand, rock and ice, and opal substrate Materials.

Beyond artistic choices, you can use Materials to streamline your development process. For example, Materials produce child filetypes, called Material Instances. A **Material Instance** is a copy that inherits properties from its parent Material. Instances can nondestructively override those inheritances to hold their own unique properties.

[image: Using only one parent Material, Material Instances can hold blue, yellow, and red properties.] Using only one parent Material, Material Instances can hold blue, yellow, and red properties.

In a development environment, you can use parent Materials and Material Instances to:

- **Receive Instant Visual Feedback:** Changes made to instances are immediately visible in all viewports, without recompiling the parent Material’s shader.
- **Improve Performance:** Instances use the same shader code as their parent, which can reduce the total amount of shaders to compile and reduce** shader switching** during runtime.
- **Streamline Workflow:** Instances strip away complexity by only exposing relevant properties for artistic teams.
- **Interact with Blueprints: **Because Materials and their child instances use logic, material properties can be controlled externally by Blueprints (-> introduction-to-blueprints-visual-scripting-in-unreal-engine).

Tips:

- Materials aren’t limited to meshes. They can be used for UI, post processing, lighting, and more.
- Materials are not shaders; they're an interface that silently converts node-based expressions to High-Level Shader Language (HLSL), to calculate the final look of an asset.
- **Shader switching** is when the Unreal Engine selects the relevant shader for the asset it’s drawing. Frequent shader switching can cause stuttering during runtime.

Let’s get familiar with the tools and interfaces you’ll use in this tutorial.

## The Anatomy of a Material

To better understand Material toolsets, let’s open up an existing Material. In the **Content Browser**, navigate to the following path:

**All > Content > LevelPrototyping > Materials******

Inside the **Materials **folder, locate `M_FlatCol`.

Notice the naming convention for this Material; it uses the prefix **M_**. This is a common Unreal Engine naming convention (-> recommended-asset-naming-conventions-in-unreal-engine-projects) that keeps Materials distinct from other files. While the exact prefix is up to you, team-wide naming conventions can prevent confusion when development teams work with hundreds of assets.

Double-click on `M_FlatCol`. The window that opens is the **Material Editor**. For this tutorial, the most important tabs in this editor are the **Preview Window**, the **Material Graph**, and the **Details **panel.

[image: Material Editor]

| Number | Tab Name | Description |
| --- | --- | --- |
| 1 | **Preview Window** | Displays a real-time example of the Material you’re editing. Contains options to change the lighting, view mode, and preview mesh. |
| 2 | **Material Graph** | Materials are built by combining nodes (called **expressions**) in this node-based graph.By default, Materials come with one node already in the graph, called a **base material node** or **material root node**.Instead of using a texture map, `M_FlatCol` uses an **expression **to set a gray **Base Color**. |
| 3 | **Details Panel** | A property window for all selected Material expressions. If no nodes are selected, it displays the **base properties** of the Material.The base properties **Material Domain**, **Blend Mode**, and **Shading Model **affect which properties appear on the material root node in the graph. |

Try changing the Material’s **Base Color **by following these steps:

- In the Material Graph, double-click the** Base Color** node.
- In the **Color Picker**, enter the **HEX sRGB **`FFBC00FF` and click **OK**.
- Save the Material by clicking **Save**, **File > Save**, or **Ctrl + S**.

If assets in your project use `M_FlatCol`, you may notice a change in your level.

Navigate back to the Content Browser and locate `MI_DefaultColorway`. This is a Material Instance that uses `M_FlatCol` as its parent.

Double-click it to open the **Material Instance Editor**.

Unlike the Material Editor, the Material Instance Editor doesn’t allow for customization. In the **Details **panel, notice that `M_FlatCol` is displayed under the **Parent **heading. Since parent Materials pass on properties to their children, this instance’s **Base Color** should be yellow — but take a look at the **Preview Window**. The sample mesh is still gray.

This is because the **Base Color** property in `M_FlatCol` is **exposed **(meaning editable) and is currently overridden by a gray color. Instances can hold their own unique properties by overriding exposed parent properties.

Let’s do two different experiments:

- Removing the override.
- Applying the override to change the Base Color of this instance.

To follow along, follow these steps:

- In the **Details Panel**, under **Surface Properties**, uncheck **Base Color**. This removes the override. In the Preview Window, the example mesh should turn from gray to yellow.
- To reapply the override, check **Base Color**. Click the color swatch to open the **Color Picker **and choose a new color.
- **Save** the Material Instance.

Notice that assets in your level that use this instance will update with the new base color, but assets using `M_FlatCol` stay yellow.

This is because materials are hierarchical:

- Parent Materials can propagate changes to their child instances.
- Instances can hold unique exposed properties.
- Instances can propagate changes to their own child instances.
- Instances cannot propagate changes to parent Materials.

[image: Hierarchy of propagation in Materials and instances.] Hierarchy of propagation in Materials and instances.

An efficient and useful parent Material acts as a flexible foundation for all child instances, reducing the amount of compiling, shader switching, and repetitive actions in your development pipeline. When creating a parent Material, consider which properties your team will access frequently and iterate upon.

To reset the materials altered in this section, set M_Flat_Col's **Base Color** to `767676FF`, and MI_DefaultColorway’s **Base Color** to `C0C0C0FF`.

For a deeper dive into the Material Editor UI, see Material Editor UI (-> unreal-engine-material-editor-ui).

## Create a Parent Material

In this section, you’ll build a parent Material with the properties **Base Color**, **Metallic**, **Normal**, and **Roughness**. You’ll control these properties by using textures, expressions, and a combination of both.

To create a new Material, follow these steps:

- In the **Content Browser**, at the file path **All > Content > AdventureGame > Artist > Materials**, click **Add **and select **Material **from the list.
- Name the material `M_Surfaces`.
- Double-click `M_Surfaces` to open the Material Editor.

Next, you’ll use textures to control properties within the Material.

### Control Properties through Textures

**Texture maps **(or textures) are image files that can be layered and customized inside a Material to produce different visual results.

Textures are useful for Materials that have complex or spatially-varying detail because each pixel stores unique RGB and alpha information. For example, when creating a material that mimics scratched metal, a specular map uses alpha information to pinpoint areas that should reflect light and areas that should not.

 Notice reflective and non-reflective areas of the rocket.

In this section, you’ll use the expression **TextureSample **to apply a **diffuse **map and a **normal **map to your Material.

A **diffuse map **contains basic color and visual properties, without lighting information. A **normal map** mimics surface texture (such as bumps or cracks) without adding geometry to the mesh.

To add texture maps, follow these steps:

- Right-click in the graph, search for, and select **TextureSample **from the list. You can also use the keyboard shortcut **T + LMB**.
- Add two **TextureSample** nodes and move one underneath the other.
- Select the top **TextureSample** node. In the **Details **panel, under **Material Expression Texture Base,** click the empty **Texture** dropdown and search for `DefaultDiffuse`. Select the diffuse map from the list.
- With the top **TextureSample **node still selected, connect the **RGB **output to the **Base Color** input on the material root node (`M_Surfaces`).
- Select the bottom **TextureSample **node. In the **Details **panel, under** Material Expression Texture Base**, click the **Texture** dropdown and search for `DefaultNormal`. Select the normal map from the list.
- With the bottom **TextureSample **node still selected, connect the **RGB **output to the **Normal **input on the material root node
- **Save **your Material.

Your Material Graph should now look like this:

Next, you’ll use expressions to control properties.

### Control Properties through Constants

In this section, you’ll create a stone-like material by using a **Constant **expression to control the properties **Metallic **and **Roughness**. Using constants to control properties is useful for uniform, global adjustments.

Constants control properties through a single **float value**. For example, **Metallic **has a float value range from 0–1. 0 mimics non-metallic surfaces (such as plastic) and 1 mimics metallic surfaces (such as chrome).

In Unreal Engine, reflections on metallic surfaces are tinted by the Base Color, and reflections on non-metallic surfaces are tinted by environmental light sources.

**Roughness **also has a float value range from 0–1. 0 mimics smooth surfaces and 1 mimics rough surfaces. Roughness affects how light is scattered off a surface; smooth surfaces have a tighter specular reflection (appearing glossy) and rough surfaces have diffused reflection (appearing matte).

By using constants to control these properties, you can mimic substances like matte plastic, glossy plastic, rough metal, or smooth chrome.

To create your stone material, follow these steps:

- Right-click in the Material Graph and select **Constant **from the list. Alternatively, you can use the keyboard shortcut **1 + LMB**. Add two constants.
- Drag off the first constant pin and connect it to the **Metallic **input on the base node. Connect the second constant to the **Roughness **input.
- With the metallic constant selected, verify that its **Value **is `0`.
- With the roughness constant selected, set its **Value **to `1`.
- **Save **your material.

Your Material Graph should now look like this:

In the next section, you’ll learn more about tiling textures within Materials.

### Scale and Tile Textures

You may have noticed that your diffuse and normal maps look like floor tiles. In this section you’ll use material expressions to scale (-> uvs-category-in-unreal-engine)UVs (-> uvs-category-in-unreal-engine) and create a stone floor that can repeat infinitely in all directions. This is called **tiling**.

Tiling is often used to cover large meshes without increasing overhead; scaling down and tiling a texture is less costly than using large, high-resolution textures that are unique to specific meshes.

 A tiling wooden floor material.

Resource allocation often affects decisions made in game development. By conserving resources in areas where players might not focus their attention (such as flooring), your team has more resources to spend on high-resolution, unique, or hand-painted textures for characters, items, or geometry that receive close-ups in real-time cinematics.

Here, you’ll use the **Texture Coordinate **expression to control tiling for both the diffuse and normal maps. You’ll also use a new expression called Multiply. The **Multiply **expression takes two inputs and combines them into one output.

To create a tiling texture, follow these steps:

- In the Material Editor’s preview window, set the mesh to a primitive plane to see the material more clearly.You may need to adjust the preview lighting to see the texture better. Hold **L** and **LMB **in the preview window to drag the light source around.
- In the Material Graph, right-click and add a **Texture Coordinate** node from the list.
- Drag off the **output **of the **Texture Coordinate **node, search for, and create a **Multiply **node.
- Drag off the **Multiply **node’s** B** input and create a **Constant**.
- Set the **Constant’s **float **Value **to `1`.
- Drag off the **Multiply **node’s **output **and connect it to the **UVs **input on the **Diffuse **and **Normal Texture Sample **nodes.

Your tiling material is done. Let’s try two experiments with tiling; scaling up with whole numbers and scaling down with fractions:

- In the Material Graph, select the **Constant **that controls the **Texture Coordinate**.
- Set its **Value **to `2`.

Since the diffuse and normal maps are a 5x5 brick grid at their native scale (1.0), scaling them up by 2 produces a 10x10 brick grid. If you look closely, you can spot where the texture’s imperfections repeat themselves.

|  |  |
| --- | --- |
|  |  |
| Texture Coordinate Scale: 1.0 | Texture Coordinate Scale: 2.0 |

Now, set the **Value** to `0.5`. Notice that the texture isn’t tiling correctly. If the diffuse map were a 6x6 grid, scaling down to 0.5 wouldn’t be cut off. How a texture will scale in Unreal Engine is important to keep in mind when creating maps.

|  |  |
| --- | --- |
|  |  |
| Texture Coordinate Scale: 0.5 | Texture Coordinate Scale: 0.6 |

A mesh’s UVs can also impact how a texture tiles; stretched UVs can result in unwanted texture stretching. You’ll learn more about this later in this tutorial and discover a solution in the next part of this tutorial series.

### Material Graph Housekeeping

Let’s pause and think about organization. As your Material graph gets more complex, it can be useful to organize nodes and keep logic transparent for a development team — or to remind yourself during development. To stay organized, you can** **create superficial boundaries and headers within the graph by using **Comment Boxes**.

To create a comment box, follow these steps:

- Select the **Texture Coordinate** and **Multiply **nodes. Press the keyboard hotkey **Q** to align them horizontally.
- Select the **Texture Coordinate**, **Multiply**, and **Constant**, and press the keyboard hotkey **C** to comment.
- Rename the comment box heading `UV Tiling`.
- **Save **your Material.

To clean up the white connector splines, double-click on them to add a breakpoint. Press **Q** to horizontally align any expressions or breakpoints.

Your Material graph should now look like this:

### Control Properties through Constant3Vectors

Now that you’re familiar with constants, you’re ready to use the **Constant3Vector**. Like a vector variable, Constant3Vectors can hold three float values instead of one. This is useful for adjusting XYZ coordinates or RGB information.

In this section, you’ll use a Constant3Vector to set an RGB color. You’ll use a multiply node to combine that color with your diffuse map and non-destructively alter its hue.

[image: From left to right: M_Surfaces diffuse texture with no change (white), tan, and gray.] From left to right: M_Surfaces diffuse texture with no change (white), tan, and gray.

To change the hue of your diffuse map, follow these steps:

- In the Material Graph, drag off the **Diffuse Texture Sample** node’s **RGB **output and create a **Multiply **node from the selection menu.
- Drag off the **Multiply **node’s **output **and connect it to the **Base Color** input of the material root node.
- Drag off the **Multiply **node’s **B** output and create a **Constant3Vector **node.
- Double-click in the **Constant3Vector** node’s **color box** to open the **Color Picker** and choose a color or follow along by entering the HEX sRGB `CDDAFFFF`.
- Select the Constant3Vector and Multiply nodes and press C to create a comment box called `Diffuse Hue`.
- Save your material.

 Your Material Graph should now look like this:

Your parent Material is now complete. In the next section, you’ll learn more about working with Material hierarchies and propagating changes to instances.

## Static Values and Parameters

So far, you’ve been working exclusively with **static **values. Static values are values set during compile time and cannot be changed at runtime. In the next section, you’ll learn how to convert static values to **parameters**. Parameters can be modified at runtime through Blueprints.

Remember the propagation hierarchy? Like any property, parameters are propagated from parent to child.

However, unlike other properties, parameters can be overridden in child Material instances. You’ve already worked with parameters when you changed the Base Color of `MI_DefaultColorway`.

This is also called **exposing **and **exposed **parameters.

### Convert Static Values to Parameters

Remember that parent Materials act as a flexible foundation for all child instances. When exposing properties, it's important to think about how your Material will be used across different assets. In this case, you’ll use `M_Surfaces` to surface three game assets:

- Set dressing
- A floor
- A wet and dry look for the floor (in the next tutorial).

**Set dressing** or **set decoration** (set dec) is a term from film that refers to static assets in a level that a player can’t interact with.

With those applications in mind, you’ll need to convert the **Constants **that control:

- UV tiling
- Diffuse map
- Diffuse hue
- Normal map
- Roughness

To convert an expression to a parameter, follow these steps:

- In the Material Graph of `M_Surfaces`, select the **Constant **in UV Tiling.
- Right-click on the node and select** Convert to Parameter.**
- Give the parameter a name so that it’s identifiable and relevant to the value it's changing. In this case, `UV Tiling`.
- Select the Constant attached to the **Roughness **property, right-click it, and select **Convert to Parameter**.
- Name the new parameter `Roughness`.
- Select the Constant3Vector that controls the diffuse hue, convert it to a vector parameter, and rename it `Diffuse Hue`.
- Select the diffuse **TextureSample**, convert it to a parameter, and rename it `Diffuse`.
- Select the normal **TextureSample**, convert it to a parameter, and rename it `Normal`.
- Save your material.

 Your Material Graph should now look like this:

Next, you’ll create Material instances to surface your game assets.

## Create a Material Instance

Let’s create one Material Instance for each asset that you’ll surface in this section: the floor and the set dressing.

To create a Material Instance, follow these steps:

- In the Content Browser, right-click `M_Surface` and choose **Create Material Instance**.
- Name it `MI_Surfaces_Floor`.
- Create a second Material Instance called `MI_Surfaces_Tile`.
- Double-click `MI_Surfaces_Floor` to open the Material Instance Editor.

Notice that the parameters you exposed in `M_Surfaces` are now grouped in the **Details** panel of this child instance.

Next, you’ll apply these instances to mesh in your level and make adjustments to the properties you exposed.

### Material Instance Overrides

In this section, you’ll apply ****`**MI_Surfaces_Floor**` to the floor mesh in `Hallway 2` of **Lvl_Adventure**.

To apply the instance to the floor, follow these steps:

- In the **Outliner**, locate the **Hallway2** folder and select all items with `Floor` in their name.
- In the **Details **panel under the **Materials** category, next to **Element 0**, replace `MI_ProcGrid` with `MI_Surfaces_Floor`.

Take a closer look at the floor. You can see repetition in the texture across the floor mesh. Depending on your project, obvious repetition might not be desirable.

[image: MI_Surfaces_Floor using a UV Tiling of 1.0 from its parent Material.] MI_Surfaces_Floor using a UV Tiling of 1.0 from its parent Material.

There are many ways to disguise tiling issues, such as texture blending, distance blending, texture bombing, or decals. For this tutorial, you have enough **texture resolution** to afford scaling it up.

To scale up the UVs in your instance, follow these steps:

- In the **Details **panel of `MI_Surface_Floor`, under **Global Scalar Parameter Values**, check **UV Tiling** and set its value to `0.2`.
- **Save** the Material Instance.

With scaled-up UVs, the floor looks less noticeably tiled, the floor tiles are a reasonable size compared to the player character, the texture is still crisp from the player’s point of view, and a large area of your level is surfaced. You’ve achieved all this without spending unnecessary resources on a high-resolution texture.

### Reuse Material Instances

Let’s say you need to quickly surface another asset that’s made of stone. By overriding properties, you can reuse your parent Material to inexpensively create unique assets. In this case, you’ll create set decoration: a stack of stone flooring materials.

To create floor tile meshes, follow these steps:

- In the Unreal Editor toolbar, click **Add > Shapes > Cube**. In the **Outliner**, rename it `Tile`.
- With Tile selected, in the **Details **panel, change the **Scale **to `0.5`, `0.5`, and `0.05`.
- In the Unreal Editor toolbar, click **Add > Shapes > Cube** and name it `Slab`.
- With Slab selected, in the **Details** panel, change the **Scale **to `1.5`, `1.0`, and `0.05`.
- With Tile selected, hold **Alt **and **drag** off duplicate static meshes in the viewport. Do the same for Slab. Arrange these assets as you like.

To make the tiles subtly stand out against the floor, follow these steps:

- Double-click on `M_Surfaces_Tile` to open it. In the **Details **panel, check **UV Tiling** and set the value to `0.2` to match the floor mesh.
- Under **Global Vector Parameter Values**, check **Diffuse Hue **and set the HEX sRBG to `A5AEC9FF`.
- **Save **your instance.
- In the **Outliner**, select all instances of **Tile**. In the **Details **panel, under **Materials > Element 0**, add `MI_Surfaces_Tile`.
- Select all instances of **Slab **and apply `MI_Surfaces_Tile`.

Notice there’s a problem. The resolution of the **Tiles **is comparable to the floor mesh, but when you adjust the **Slab**’s scale, its UVs scale (uniformly and non-uniformly) with the mesh. Because of this, your stone material is stretched. This is especially noticeable along the sides of the meshes.

Depending on your project, you’d likely want material resolution to appear cohesively scaled across various assets — not stretched.

 (1) Appropriately scaled material. (2) Uniformly scaled-up material. (3) Non-uniformly scaled-up material.

In a development environment, you could solve this problem by adjusting mesh geometry, UV mapping, or using triplanar projection — a method that applies a material uniformly along XYZ axes of the mesh.

For this example, you’ll create a brand new look for the set dressing by overriding the texture maps inherited from `M_Surfaces`:

- In the **Details **panel of `MI_Surfaces_Tile`, next to **UV Tiling**, set the value to `1`.
- Check **Diffuse **and search for `Gray`.
- Check **Normal **and search for `T_Base_Tile_Normal`.
- Next to **Diffuse Hue**, enter the HEX sRGB `D0CECBFF`.
- **Save **your instance.

Your set dressing and floor are now complete.

In a more practical development environment, you’d likely take an even more efficient approach to creating set dressing. For example, you might include the loose floor tiles as part of the floor mesh to save on geometry.

You’ve now created a flexible parent Material and two unique Material Instances. Along the way, you’ve also learned about:

- **Managing resource allocation: **Careful resource allocation means you can spend more on important game assets.
- **Organizing assets within the Editor: **Organization and naming conventions avoid confusion when teams work with hundreds of assets.
- **Building a modular workflow:** A non-destructive, modular workflow avoids repetitive or time-consuming work — this is essential when development schedules are tight.
- **Balancing artistic choices with technical limitations:** Game development often involves thinking creatively to work around technical limitations and finding compromises that limit sacrificing artistic look and feel.

## Next Up

In the next tutorial, you’ll learn about triplanar projection, break propagation hierarchies with Static Switches, and use Blueprints to control Materials based on player actions within your level.

- [image: Expanded Material Instances] Expanded Material InstancesUse dynamic material instances to create an interactive tech demo. (-> artist-04-expanded-material-instances)

On this page

- Before You Begin (-> artist-03-create-materials-and-material-instances)
- Materials and Material Instances (-> artist-03-create-materials-and-material-instances)
- The Anatomy of a Material (-> artist-03-create-materials-and-material-instances)
- Create a Parent Material (-> artist-03-create-materials-and-material-instances)
- Control Properties through Textures (-> artist-03-create-materials-and-material-instances)
- Control Properties through Constants (-> artist-03-create-materials-and-material-instances)
- Scale and Tile Textures (-> artist-03-create-materials-and-material-instances)
- Material Graph Housekeeping (-> artist-03-create-materials-and-material-instances)
- Control Properties through Constant3Vectors (-> artist-03-create-materials-and-material-instances)
- Static Values and Parameters (-> artist-03-create-materials-and-material-instances)
- Convert Static Values to Parameters (-> artist-03-create-materials-and-material-instances)
- Create a Material Instance (-> artist-03-create-materials-and-material-instances)
- Material Instance Overrides (-> artist-03-create-materials-and-material-instances)
- Reuse Material Instances (-> artist-03-create-materials-and-material-instances)
- Next Up (-> artist-03-create-materials-and-material-instances)

Related documents

Materials

 [image: Materials] (-> materials)

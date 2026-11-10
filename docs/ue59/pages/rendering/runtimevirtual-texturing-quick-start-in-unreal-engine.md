# Runtime Virtual Texturing Quick Start

https://dev.epicgames.com/documentation/en-us/unreal-engine/runtimevirtual-texturing-quick-start-in-unreal-engine?application_version=5.9

> A walkthrough of setting up runtime virtual textures with a material applied to a landscape.

[image: Runtime Virtual Texturing Quick Start]

This guide refers to materials found in the Content Examples project available from the Epic Games Launcher under the Samples tab. While the materials are not required to do the steps below, setting up the landscape to function properly with painted landscape materials is. See the Landscape Quick Start Guide (-> landscape-outdoor-terrain-in-unreal-engine) before continuing, or open the Content Examples project **Landscapes** map under the **Samples** tab for use with this guide.

In this **Runtime Virtual Texturing** (RVT) quick start, we'll walk through the process of setting up and using RVT for your Landscape and non-Landscape components in your projects.

Before starting this guide, it's important to understand that Runtime Virtual Textures work best with Landscape terrains for a few reasons:

- Complex Landscape materials cache the shading results for a performance win.
- Improved quality and variation are achievable with spline and decal-type effects.
- Blending of non-Landscape Actors with your Landscape is handled by the same RVT Asset.

After going through this guide, you'll have a better understanding of:

- Setting up a Runtime Virtual Texture Asset and how it connects to different components.
- Enabling Runtime Virtual Texturing for a Landscape Material.
- Setting up a Runtime Virtual Texture Volume in your Level.
- Setting up additional Actors to render to the Runtime Virtual Texture.

## 1 - Project Setup

Before you can use Runtime Virtual Textures, you must first enable it for your project. Follow these steps:

- From the main menu, select the **Edit** menu and select **Project Settings**. Under the **Engine** > **Rendering** > **Virtual Textures** category, set **Enable virtual texture support** to true.[image: Under the Virtual Textures category set Enable virtual texture support to true]
- **Restart** the Project.

## 2 - Creating a Runtime Virtual Texture Asset

The **Runtime Virtual Texture** Asset contains the configuration details for the RVT Asset assigned to a Runtime Virtual Texture Volume. The RVT Asset also works by linking Materials and other Actors in your scene that need to share data.

- In the **Content Drawer**, use the right-click context menu or the **+Add** button to create a **Runtime Virtual Texture** Asset from the **Textures** category.[image: Create a Runtime Virtual Texture Asset from the Materials andTextures category]
- Give the **Runtime Virtual Texture** Asset a name. For this guide, it is named `VT_Test`.
- Double-click the Asset to open the **Runtime Virtual Texture** Asset Editor where you can configure its properties.[image: Double-click the Asset to open the Runtime Virtual Texture Asset Editor where you can configure its properties]From this window, you can define the size, tile size, and type of Material Attributes the runtime virtual texture supports. These properties can be adjusted in real-time while working in the editor to see their changes take effect.For details and usage of these settings, see Virtual Texture Settings (-> virtual-texturing-settings-and-properties-in-unreal-engine) page.

## 3 - Creating a Runtime Virtual Texture Material

For details and usage of these settings, see Virtual Texture Settings (-> virtual-texturing-settings-and-properties-in-unreal-engine) page.

In this step, we'll be using a simple Landscape material for runtime virtual texturing support. In addition, we'll set up logic using some RVT-specific Material Expressions that allow for the material to fall back to its original use when virtual texturing isn't available on a supported platform.

Setting up your material to work with RVT requires that two contexts be considered:

- Part of the material will **write to** the RVT Asset.
- Part of the material will **sample from** the RVT asset and apply further logic.

This example landscape material, taken from the **Content Examples** project, has a simple layer blend setup for Snow, Grass, and Rock.

[image: This example landscape material has a simple layer blend setup] Click the image for full size.

If you're not using the material from Content Examples, you can recreate it as shown above. However, keep in mind that you'll still need to properly set up the Material for use with a Landscape. Follow the Landscape Quick Start Guide (-> landscape-outdoor-terrain-in-unreal-engine) if you need a starting point.

The sections that follow will break down parts of this Material to demonstrate how we're writing to and sampling from the RVT Asset.

### Required Material Setup

Setting up a Landscape material for use with an RVT Asset is the same as setting up a traditional one, with one exception; **Use Material Attributes** should be enabled. This option enables us to use **Make Material Attributes** expressions to rebuild and output the material for different use cases supported.

- Open your existing or available Landscape material. Right-click in the graph and search for a **Make Material Attributes** expression. Add one to your graph.
- Move the wire connections from the Main Attributes node to the **Make Material Attributes** node. You should have something that looks like this:[image: Move the wire connections from the Main Attributes node to the Make Material Attributes node] Click the image for full size.
- Now, with the **Main Attributes** node selected, use the **Details** panel to enable **Use Material Attributes**.[image: Use the Details panel to enable Use Material Attributes]
- Pull off the output of the **Make Material Attributes** node and create a **Virtual Textures Feature Switch** node. This should plug it into the **No** input. Connect that to the **Material Attributes** output.[image: Pull off the output of the Make Material Attributes node and create a Runtime Virtual Textures Feature Switch node]

Your material should now look like this:

[image: Material Setup] Click the image for full size.

### Writing to the Runtime Virtual Texture Asset

Next, the material needs to write to the RVT Asset through the **Runtime Virtual Texture Output** expression. This node references the RVT Asset created earlier in this guide and enables corresponding Material Attributes (such as Base Color, Roughness, and Normal) to be used as input attributes of this node.

- Right-click and add a **Runtime Virtual Texture Output** node to the graph.[image: Right-click and add a Runtime Virtual Texture Output node to the graph] Click the image for full size.
- Connect the node wires for each material attribute input that is listed on the node. For ones not used in your base material, use a constant value in its place.[image: Connect the node wires for each material attribute input that is listed on the node]

Your material should now look like this:

[image: Runtime Virtual Texture Output Setup] Click the image for full size.

The first part of this material is where all the layer blending and logic is happening. It is all the camera-independent shading that can be cached to the RVT Asset. Other objects (such as splines and decals) are expected to be composited to the output of this node by the RVT System.

### Sampling from the Runtime Virtual Texture Asset

Next, the material needs to sample from the RVT Asset using the **Runtime Virtual Texture Sample** expression.

During this part of the graph, the RVT Asset is sampled and applies camera-dependent or additional shading operations here. The RVT Asset attributes are sampled and routed to the final Material output, so the less work is done during this part of the graph, the cheaper the rendering for this material will be.

- Right-click and add a **Runtime Virtual Texture Sample** node.[image: Right-click and add a Runtime Virtual Texture Sample node] Click the image for full size.
- Right-click and create another **Make Material Attributes** node. Connect the outputs of the **Runtime Virtual Texturing Sample** node to the corresponding inputs of the **Make Material Attributes** node.[image: Connect the outputs of the Runtime Virtual Texturing Sample node to the corresponding inputs of the Make Material Attributes node]
- Connect the output of the **Make Material Attributes** node to the **Yes** input of the **Virtual Texture Feature Switch** node.[image: Connect the output of the Make Material Attributes node to the Yes input of the Virtual Texture Feature Switch node] Click the image for full size.
- Select the **Runtime Virtual Texture Sample** node. In the **Details** panel, use the **Virtual Textures** Asset selection box to assign the RVT Asset you created earlier in this guide.[image: Use the Virtual Textures Asset selection box to assign your RVT Asset you created earlier in this guide]
- Connect the output of the **Virtual Texture Feature Switch** node to the input of the main **Material Attributes** node.[image: Connect the output of the Virtual Texture Feature Switch node to the input of the main Material Attributes node]
- **Save** and **Close** this Material.

Your material should now look like this:

[image: Runtime Virtual Texture Sample Output] Click the image for full size.

## 4 - Placing a Runtime Virtual Texture Volume

Now that your material is set up to support runtime virtual texturing, you can move to your Level where you will place a **Runtime Virtual Texture Volume** to apply the RVT material to a surface, in this case, a landscape terrain.

- In the **Place Actors** panel, search for a **Runtime Virtual Texture Volume** under the **Volumes** category and drag it into the scene.[image: Search for a Runtime Virtual Texture Volume under the Volumes category and drag it into the scene] Click the image for full size.
- With the RVT Volume selected, under the **Virtual Texture** section, set the **Virtual Texture** material assignment box to use the Runtime Virtual Texture Asset created in Step 2 of this guide.[image: Set the Virtual Texture material assignment box to use the Runtime Virtual Texture Asset created in Step 2 of this guide]
- The RVT Volume is not yet properly scaled to cover the areas you want to apply the RVT material. Select the RVT Volume, and in its **Details** panel in the **Transform from Bounds** section, set the **Source Actor** to the one you want to use. In this example, **Landscape_2** is used.[image: In the Transform from Bounds section set the Source Actor to the one you want to use]
- Click the **Set Bounds** button to scale the Runtime Virtual Texture Volume to the bounds of the selected Actor.[image: Click the Set Bounds button to scale the Runtime Virtual Texture Volume to the bounds of the selected Actor]Any Actor sampling from or writing to the Runtime Virtual Texture must be within the RVT Volume's bounds.
- Select the scene Actor (Landscape_2) and in the **Details** panel under the **Virtual Texture** section, click the **Add Element** icon next to **Draw in Virtual Textures**.[image: Click the Add Element icon next to Draw in Virtual Textures]Use the Asset assignment dropdown to select your **Runtime Virtual Texture Asset**.[image: click the Add Element icon next to Draw in Virtual Textures]

With the Runtime Virtual Texture Volume placed and scaled around the landscape terrain and the Runtime Virtual Texture Asset assigned to the landscape, the terrain material should immediately become visible. If something is not set up correctly, the landscape will render black.

## 5 - Rendering Actors to a Runtime Virtual Texture

With your landscape's material set up, other scene Actors can be set up to render into the runtime virtual texture, such as the road spline following the terrain. Any Actors that are set up to output to a runtime virtual texture and are within the placed RVT Volume will be captured and rendered as part of the Runtime Virtual Texture Asset applied to the landscape.

The spline in this section of the guide is a Landscape Spline that is already set up in Content Examples. The steps shown here can be applied to other scene Actors and their Materials to achieve the same effect.

- Navigate to the **Modes** dropdown menu, select **Landscape**.[image: Navigate to the Modes dropdown menu and select Landscape]
- On the **Landscape** toolbar, click on **Splines**.[image: Click on Splines]
- In the Level Viewport, select any part of the spline. In the level **Details** panel, click the **Segments** button to select all segments that make up this spline.[image: Click the Segments button to select all segments that make up this spline]
- Under the **Landscape Spline Meshes** category, expand the **Spline Meshes** array. The Static Mesh **SM_Street** should be assigned. Double-click on it to open the Static Mesh Editor.[image: The Static Mesh SM_Street should be assigned and double-click on it to open the Static Mesh Editor]Under its **Material Slots**, double-click on Element 0 **M_Street** material to open it in the Material Editor.[image: Double-click on Element 0 M_Street material to open it in the Material Editor]For this Static Mesh and Material assigned, Element 0 was chosen because it is the parent Material used for slots 0 and 1, with Element 1 being a child Material Instance of Element 0. Keep in mind that any Material that is to be rendered to the RVT Asset needs to be set up to render into a runtime virtual texture using the steps that follow.
- In the material graph, right-click and add a **Runtime Virtual Texture Output** node. Connect the **Color** and **Roughness** node outputs to the **BaseColor** and **Roughness **inputs on the Runtime Virtual Texture Output node.[image: Connect the Color and Roughness node outputs to the BaseColor and Roughness inputs on the Runtime Virtual Texture Output node]
- **Save and Close** for both the Material and Static Mesh Editors.
- In the Level Viewport, select any part of the Landscape Spline. In the **Details** panel, click the **Segments** button to select all attached spline segments.[image: Click the Segments button to select all attached spline segments in the details panel]
- With the spline segments still selected, scroll down in the **Details** panel to the **Virtual Texture** section, and click the **Add Elements (+)** icon. Select your **Runtime Virtual Texture Asset** from the assignment dropdown.[image: Select your Runtime Virtual Texture Asset from the assignment dropdown]
- The primitive (or landscape spline in this demonstration) is now rendered into the RVT. However, the primitive is still visible. If you don't want the primitive to be visible in the main pass and to only have it rendered to the RVT, place the Level Viewport back into **Select** mode using the **Modes** dropdown and select the **Runtime Virtual Texture Volume** placed in the Level. Under the **Virtual Texture** section's advanced properties, enable **Hide Primitives**.[image: Enable Hide Primitives under the Virtual Texture section's advanced properties]

In the Level Viewport when in Game View, the Landscape Spline should be rendered into the Runtime Virtual Texture Asset and applied to the terrain's surface, and the spline primitive should no longer be visible.

 [image: Without Runtime Virtual Texturing]

 [image: With Runtime Virtual Texturing]

Here's a closer look at the spline material being applied to the surface of the landscape using RVT.

 [image: Without Runtime Virtual Texturing]

 [image: With Runtime Virtual Texturing]

## 6 - On Your Own!

Now that you've worked through this guide and set up a Landscape material to use a Runtime Virtual Texture, you can start to explore applying your own Actor's materials to be rendered to the RVT. Use some of the suggestions below to get started:

- Add another Static Mesh to the RVT that can be applied like a decal. Look at how you can use a Static Mesh Plane with a masked material to add decal-like details to your terrain.
- Use Foliage instances to paint meshes that can render to the RVT to create unique variations to your terrain.
- Use multiple Runtime Virtual Texture Assets to manage different types of Actors, and how they render to your Runtime Virtual Texture Volume.
- Use the **Translucency Sort Priority** to set the layer order for how Actors are rendered to the RVT. For example, 0 would be the bottom layer and higher values would stack on top of each other.

- materials
- performance
- rendering
- optimization
- textures

On this page

- 1 - Project Setup (-> runtimevirtual-texturing-quick-start-in-unreal-engine)
- 2 - Creating a Runtime Virtual Texture Asset (-> runtimevirtual-texturing-quick-start-in-unreal-engine)
- 3 - Creating a Runtime Virtual Texture Material (-> runtimevirtual-texturing-quick-start-in-unreal-engine)
- Required Material Setup (-> runtimevirtual-texturing-quick-start-in-unreal-engine)
- Writing to the Runtime Virtual Texture Asset (-> runtimevirtual-texturing-quick-start-in-unreal-engine)
- Sampling from the Runtime Virtual Texture Asset (-> runtimevirtual-texturing-quick-start-in-unreal-engine)
- 4 - Placing a Runtime Virtual Texture Volume (-> runtimevirtual-texturing-quick-start-in-unreal-engine)
- 5 - Rendering Actors to a Runtime Virtual Texture (-> runtimevirtual-texturing-quick-start-in-unreal-engine)
- 6 - On Your Own! (-> runtimevirtual-texturing-quick-start-in-unreal-engine)

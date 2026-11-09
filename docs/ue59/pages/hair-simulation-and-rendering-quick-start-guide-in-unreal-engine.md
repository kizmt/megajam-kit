# Groom Simulation and Rendering Quick Start Guide

https://dev.epicgames.com/documentation/en-us/unreal-engine/hair-simulation-and-rendering-quick-start-guide-in-unreal-engine?application_version=5.9

> A guide to getting started using hair rendering and simulation with characters in your project.

The focus of this quick start guide is to walk you through the basics of working with your hair grooms on skinned meshes in Unreal Engine.

After going through this tutorial, you will know how to:

- Set up a project for hair rendering and simulation.

- Set up a groom for use with an animated skeletal mesh.

- Set up a basic Hair material.

- Enable and control physics for hair.

## Required Setup

- Create a new project using using the Third Person template (-> working-with-projects-and-templates-in-unreal-engine).

- In the editor, go to the **Main Menu** and select **Edit > Project Settings** to open the Project Settings window. Under the **Rendering > Optimization** category, enable the **Support Compute Skin Cache** option. [image: Enable Support Compute Skin Cache in Project Settings] You can ignore the **Restart Now** popup that appears in the bottom right of the editor window since the next steps also require you to restart the editor.

- Go to the Main Menu again and this time select **Edit > Plugins** to open the Plugins browser window. [image: Enabling Groom Plugins] In the search bar start typing `groom` and enable the following plugins: **Alembic Groom Importer**

- **Groom**

- Restart the editor for changes to the Project Settings and Plugins to take effect. [image: Restarting the Unreal Editor]

## Creating and Importing your Groom

Grooms for a character — even a simple one — can contain different types of hair, such as that for heads, beards, brows, and more. Each of these types of hair could have its own Material and physics settings. There are also types of hair within each group, such as hairs that are to be used during simulation. This information can be defined during grooming in your DCC application, and Unreal Engine looks at this information to define guides.

- In your preferred DCC application, create your Groom and then export it to Alembic `.abc` file format. Use the Alembic for Grooms Specification (-> using-alembic-for-grooms-in-unreal-engine) to prepare your groom for Unreal Engine with proper naming conventions.

- In the Content Drawer, click the **Import** button to import your Alembic file with your groom, or drag and drop your Alembic file into the Content Browser. [image: From your Content Drawer, click Import]

- In the **Groom Import Options** window, consider the following options: [image: The Groom Import Options Window] Modify the initial Rotation that is baked into the groom, which avoids some extra runtime cost.

- Use the Override Guides check box to replace the imported guides with a set of strands selected from the imported strands. The amount of guides depends on the Hair to Guide Density value.

- Use the Interpolation Quality and Interpolation Distance to modify how the pairing between guides and the strands is handled for transferring the guide motion.

- The Randomize Guide and Unique Guide checkboxes affect how a guide influences a strand is handled; whether only a single or multiple guides should influence a strand.

- Click **Import**.

During the import process, the Groom system looks for attributes and groups that follow the Alembic naming conventions outlined in the Alembic for Grooms (-> using-alembic-for-grooms-in-unreal-engine) specifications page, and imports them to a new Groom Asset. Among these attributes, the RootUV attribute fetches the UV of the underlying surface, such as a skin surface, which allows for the creation of some spatial variation across the groom.

## Attaching a Groom to a Skeletal Mesh

The Groom component enables you to attach a Groom Asset and bind a groom to a Skeletal Mesh's surface. An optional Binding Asset caches the projected data of the groom onto the Skeletal Mesh, which saves GPU costs of doing this at startup when one is not created and assigned.

### Setting up the Groom Component

For this part of the guide, we'll use the `SKM_Manny` found in the **Third Person** template. If you do not have this, you can add it to your project from the Content Browser by clicking **Add New** > **Add Feature or Content Pack**, and selecting the **Third Person** template.

Also, note that this same setup can be applied inside of a character Blueprint.

- In the **Content Browser**, locate the **SKM_Manny** Skeletal Mesh found in the **Characters > Mannequins > Meshes** folder and drag it into the scene. [image: Drag the SKM_Manny into the Scene]

- With the Skeletal Mesh selected, use the **Details** panel to click the **Add Component** button and add a **Groom** Component. [image: Adding the Groom Component to the Skeletal Mesh]

- Select the **Groom** component and use the **Groom Asset** slot to assign your imported groom to this Skeletal Mesh. [image: Assigning a Groom Asset to the Skeletal Mesh]

### Creating a Binding Asset

- In your Content Drawer, locate your Groom Asset. Right-click it and select **Create Binding**. [image: Create a Binding Asset]

- The **Groom Binding Options** window will open. To create the asset, it's required that you assign a **Target Skeletal Mesh** and you can optionally specify a **Source Skeletal Mesh** that shares similar topology as the Target Skeletal Mesh. With these slots assigned, click **Create**. [image: Assigning a Target Skeletal Mesh for the Groom Binding Asset]

- This will open your Groom Binding Asset. Save it and close the window. [image: Groom Binding Asset Details]

- Select the Skeletal Mesh in your level. Use the **Details** panel to select the **Groom** Component in the Components panel. Under the **Groom** section, use the **Binding Asset** slot to assign the Binding Asset you created. [image: Assigning a Binding Asset to the Skeletal Mesh]

## Setting Up Your Hair Material

By Default, Unreal Engine contains a simple Hair Material with `HairDefaultMaterial`.

The steps below are optional for this guide since Unreal Engine includes a default hair material. However, if you've not set one up before, the steps below will guide you through the properties and setting required to do so.

- In the Content Drawer, click the **Add** button and select **Material**. [image: Create new Material]

- Give your Material Asset a name and open it.

- In the Material Editor, use the **Details** panel to set the following: [image: Select Hair for the Shading Model Property] Shading Model: **Hair** You also need to enable **Use with Hair Strands**. When the material is applied to a groom component, this checkbox should automatically enable itself and recompile the material. If it doesn't, you can enable it from the **Usage** category of the Details panel in the Material Editor.

- In the Material Graph, use the following node setup for a basic hair material: [image: Basic Hair Material Node Setup] Use a **Constant4Vector** for the Base Color and a **Constant** to control the Roughness. If you're setting up more complex hair materials, use the **HairAttribute** expression in the Material Graph to access the hair attributes such as UV, Dimensions, RootUV, and Seed.

- **Save and close** the Material Editor.

- You can apply your hair material in one of two ways; directly on the Groom Asset component through its Details panel in the Level or Blueprint, or by opening the Groom Asset from the Content Browser. Assign your hair material to the **Material** element slot. [image: Applying the hair Material through the Details Panel] Groom Asset Actor (Details panel) [image: Applying the hair Material in the Groom Asset Editor] Groom Asset (Groom Asset Editor)

## Setting Up Hair Physics

In this step, you'll enable physics simulation for your Groom Asset.

- In your Conent Drawer, locate your Groom Asset and open it in the **Groom Asset Editor**.

- Go to the **Physics** tab and check the box next to the **Enable Simulation** option. [image: Enabling Simulation from the Physics window in the Groom Asset Editor]

Once enabled, the properties in the **Physics** tab can be used to control the physics properties of the hair.

See the Enabling Physics Simulation on Grooms (-> enabling-physics-simulation-on-grooms-in-unreal-engine) page for more information on these Groom Asset properties.

Once enabled, you should see physics applied to the hair while working in the editor and when using play-in-editor (PIE) or simulate-in-editor modes.

- rendering
- lighting
- physics
- hair
- metahumans

On this page

- Required Setup (-> hair-simulation-and-rendering-quick-start-guide-in-unreal-engine)
- Creating and Importing your Groom (-> hair-simulation-and-rendering-quick-start-guide-in-unreal-engine)
- Attaching a Groom to a Skeletal Mesh (-> hair-simulation-and-rendering-quick-start-guide-in-unreal-engine)
- Setting up the Groom Component (-> hair-simulation-and-rendering-quick-start-guide-in-unreal-engine)
- Creating a Binding Asset (-> hair-simulation-and-rendering-quick-start-guide-in-unreal-engine)
- Setting Up Your Hair Material (-> hair-simulation-and-rendering-quick-start-guide-in-unreal-engine)
- Setting Up Hair Physics (-> hair-simulation-and-rendering-quick-start-guide-in-unreal-engine)

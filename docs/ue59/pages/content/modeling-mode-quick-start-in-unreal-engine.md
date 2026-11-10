# Modeling Mode Quick Start

https://dev.epicgames.com/documentation/en-us/unreal-engine/modeling-mode-quick-start-in-unreal-engine?application_version=5.9

> Getting started with Modeling Mode and creating 3D assets in Unreal Engine

[image: Modeling Mode Quick Start]

Learn to use this **Beta** feature, but use caution when shipping with it.

The **Modeling Mode** toolset in Unreal Engine is used to create meshes, rapidly prototype new level geometry, and edit existing meshes all without leaving the Editor.

[image: Pine Wood Crate Created Using Modeling Mode] In this quick start, you will create this pine crate using Modeling Mode.

This quick start guide walks you through the creation of a wood crate using several of the tools in Modeling Mode. You start by creating a new primitive shape and add detail using several of the **PolyEdit** tools. Next, you prepare your model for texturing using the UV tools. Finally, you add a **Material** and drop it into your **Level** with full collision and physics simulation.

### Prerequisite Topics

Before starting this quick start guide, we recommend you familiarize yourself with Modeling Mode and how Unreal Engine handles 3D models (-> static-meshes).

Although many tools in Modeling Mode are similar to their counterparts in other modeling software, there are a few key differences in how the Modeling Mode editor structures mesh editing that you should know before you begin working with it.

For more information, see the Modeling Mode Overview (-> modeling-mode-in-unreal-engine).

## 1 - Creating a Box Primitive

Before you start, create a new project based on the First Person Game template. For more information on creating new projects in Unreal Engine, see Creating a New Project (-> creating-a-new-project-in-unreal-engine).

- Open **Modeling Mode** by clicking the **Select Mode** drop down menu and select **Modeling**. This will open the **Mode Toolbar** and **Modeling** panel.[image: Opening Modeling Mode using the Modes drop down] Opening Modeling Mode using the Modes drop down
- In the **Shapes** category at the top of the** Mode Toolbar**, click **Box** and adjust the settings in the ** Modeling** panel to your desired size. For this guide, the default settings are fine. This creates a 100 centimeter box that is about half the height of the default character.[image: Create a box primitive with the Box tool] Creating a box primitive with the default settings using the Box tool.
- Click in the **Viewport** to create your box, then click **Complete** at the bottom of the screen or press **Enter**.

## 2 - Creating the Outer Frame

Turning your primitive shape into a detailed 3D model begins with defining its **PolyGroups**.

[image: A box displays Modeling Mode PolyGroups] A box primitive with six defined PolyGroups.

It can be helpful to collapse the sections you are not using in the **Mode Toolbar**.

[image: Collapsing Tool Catagories in the Modeling Tools Pallette]

- Select the box in the viewport. In the **Mode Toolbar**, find the **Attributes** section and click **GrpGen**. This will generate PolyGroups for the box.[image: Select the GrpGen tool in the Modeling Tools palette] Select the GrpGen tool in the Modeling Tools palette.
- The default **Conversion Mode** and settings are fine for this Quick Start, so click the **Accept** button at the bottom of the viewport or press **Enter**.[image: Create your PolyGroups using the default settings] Create your PolyGroups using the default settings
- In the **Mode Toolbar**, locate the **PolyModel** tools section and click **PolyEd**. This will open the **PolyEdit** tools in the **Modeling** panel.[image: Click on PolyEd to open the PolyModel tools in the Tools Details panel] Click on PolyEd to open the PolyModel tools in the Tools Details panel
- Select one of the faces in the **Viewport** and click **Inset**. Move the mouse in the viewport until the face is inset the amount shown in the image below.[image: Inset the face to create the outer frame] Inset the selected face to create the outer frame of the crate. Click the mouse again to inset the face.
- Select the inner face you created and click **Extrude**. Extrude the face inward to create the outer frame of the crate.[image: Extrude the inner face inward to finish creating the outer frame] Extrude the inner face inward to finish creating the outer frame. This face has been extruded 5 centimeters. If grid snapping is enabled in the viewport, the distance that the face extrudes is equal to the **Position Grid Snap** value set in your Viewport. Adjusting this setting can give you more control during the editing process.
- Repeat this process for each side of the crate. Don't forget the bottom face.

## 3 - Adding Additional Detail

Next, you will add a cross brace to the outer frame of the crate.

- In the **PolyEd** tools, select the inner face you just extruded and click the **Decompose** button. This will split the face into its component triangles and create an edge from corner to corner.[image: Decompose the inner face of the crate] Using the Decompose tool on the center face will split the face into two triangles.
- Select the new edge you created. Then hold **Shift** and select the additional edges in the corners connected to the new edge as shown in the image below.[image: Select the new edge and the two connected corner edges and Bevel] Select the new edge and the two connected corner edges. Bevel them to create a new face that will be used for the cross brace. With the edges selected, navigate to the **Edge Edits** section and click **Bevel**. Leave the settings at the defaults and click the **Apply** button at the top of the menu. This splits the edge and creates a new face.You can disable Select Vertices and Select Faces in the Selection Filter section of the Tools Details panel to make selecting individual edges easier.
- Select the new face and extrude it until it is level with the outer frame.[image: Extrude the new face to create the cross brace] Extrude the new face until it is level with the outer frame to create the cross brace.
- This creates two inner faces, one at the end of the extruded cross brace and one in the inner corner. Move your camera view inside the crate and select the inside faces as shown below.[image: Move the camera inside the crate and select the inner face at the end of the cross brace] Move the camera inside the crate and select the inner face at the end of the cross brace. [image: Move the camera down and to the left to select the inner face in the corner] Move the camera down and to the left to select the inner face in the corner. Click Delete or press the Delete key to remove the faces.
- The **Weld** tool joins two edges at the location of the last one selected. Select the two edges shown below.[image: Move the camera back outside the crate to select the two edges where the cross beam meets the corner] Move the camera back outside the crate to select the two edges located where the cross beam meets the corner. Click **Weld**.
- Repeat this process for the other end of the inner frame.
- Repeat the process for each side of the crate.

## 4 - Unwrapping UVs

To display the wood texture correctly, the crate will need to be UV unwrapped.

- Since you have made significant changes to the original box shape, click **GrpGen** and generate new PolyGroups for the crate. Change the **Min Group Size** to `3` to generate six new PolyGroups (one per side) similar to the image below.[image: Generate six new PolyGroups] Use the GrpGen tool to generate six new PolyGroups. Click **Accept** or press **Enter** to continue.
- Next, go to the **UVs** section of the menu and select the **Unwrap** tool. At the top of the **Modeling** panel, open the **Island Generation** dropdown menu and select **PolyGroups**.[image: Use the Unwrap tool to create a UV map] Use the Unwrap tool to create a UV map for the crate.
- Change the value of the **Texture Resolution** to 2048. This changes the offset between the UV islands to make sure there are enough pixels between them.[image: Change the Texture Resolution to 2048] Change the Texture Resolution to 2048 to generate enough space between UV islands.
- To see the generated UV map, click the checkbox for the **Enabled** option in the **Preview UV Layout** section of the menu. Your UV map will look similar to the image below. Click **Accept** or press **Enter** to finalize the UV map.[image: Enable the UV map preview window] Enable the UV map preview window.
- Finally, check the quality of the generated UV map by adding a wood material to the crate. In the **Details** panel, open the **Materials** section and click the dropdown menu for **Element 0**. Search for the **M_Wood_Pine** Material and apply it to the crate.[image: Add the M_Wood_Pine Material in the Details panel] Add the M_Wood_Pine Material in the Details panel.

## 5 - Bring the Crate into the Level

Make the crate ready for your Level by adding **Simplified Box Collision** in the **Static Mesh Editor** and enabling **Physics Simulation**.

- Locate your crate asset in the **Content Browser** and open it in the **Static Mesh Editor**. This can be done by navigating to the `FirstPerson/Maps/_GENERATED/User` folder and double clicking your box asset.[image: Return to Select mode and open the crate in the Static Mesh Editor] Return to Select mode and open the crate in the Static Mesh Editor. You will notice that the version of your crate in the Static Mesh Editor does not have the M_Wood_Pine Material applied to it. Adding a Material to a Static Mesh through the Details panel only applies it to that instance of the static mesh. Applying the pine Material in the Static Mesh Editor will apply it to all future instances of the crate.
- Click on the **Collision** menu and select **Add Box Simplified Collision** to add a basic collision box to the crate.[image: Add a collision box to the crate using the Add Box Simplified Collision option] Open the Collision menu and select Add Box Simplified Collision.
- Locate the **Collision Complexity** section in the **Details** panel. Open the drop down menu and select **Project Default**.[image: Change the Collision Complexity property to Project Default] Change the Collision Complexity property to Project Default in the Details panel in the Static Mesh Editor.
- Back in the **Editor** window, enable **Simulate Physics** in the **Details** panel.[image: Enable Simulate Physics in the Details panel] Enable Simulate Physics in the Details panel.

## Result

Over the course of this quick start, you created a wood crate Asset using the Modeling Mode toolset, entirely inside the Unreal Editor. You added detail to your model, added a UV map, and a wood Material.

Finally, you added appropriate collision settings and enabled physics to make your crate a game ready Asset.

[image: The final version of the pine crate inside the level] The final version of the pine crate inside the Level.

- static mesh
- beta
- working with content
- modeling mode

On this page

- Prerequisite Topics (-> modeling-mode-quick-start-in-unreal-engine)
- 1 - Creating a Box Primitive (-> modeling-mode-quick-start-in-unreal-engine)
- 2 - Creating the Outer Frame (-> modeling-mode-quick-start-in-unreal-engine)
- 3 - Adding Additional Detail (-> modeling-mode-quick-start-in-unreal-engine)
- 4 - Unwrapping UVs (-> modeling-mode-quick-start-in-unreal-engine)
- 5 - Bring the Crate into the Level (-> modeling-mode-quick-start-in-unreal-engine)
- Result (-> modeling-mode-quick-start-in-unreal-engine)

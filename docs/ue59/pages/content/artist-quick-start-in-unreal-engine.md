# Artist Quick Start

https://dev.epicgames.com/documentation/en-us/unreal-engine/artist-quick-start-in-unreal-engine?application_version=5.9

> Learn how to get started with Unreal Engine 5 as a content creator.

[image: Artist Quick Start]

###### Prerequisite topics

In order to understand and use the content on this page, make sure you are familiar with the following topics:

- Installing Unreal Engine (-> install-unreal-engine)
- Creating a New Project (-> creating-a-new-project-in-unreal-engine)

Operating System

×Windows

3D Art Tool

×Autodesk Maya

Select an option from the dropdown to see content relevant to it.
[image: Materials Header] Click image for full size.

This quick start guide shows you how to add assets to your **Unreal Engine (UE5)** games. By the end of this guide, you'll know how to use the **Project Browser** to create new projects and navigate the **Content Browser** to find and add content. You'll also know where to find information on the **FBX Content Pipeline** while learning how to use the **Material Editor** to modify **Materials** before applying them to a **Static Mesh Actor**.

## 1. Required Project Setup

- Open **Unreal Engine** from the Launcher.
- Create a new Project using the **Games > Blank** template using the following settings:**C++** enabled
- **With Starter Content** enabled

- You'll need to enter a project name, so use **Artist_QuickStart**.
- You can now click **Create Project** and get started.

The **Unreal Editor** now opens your new project. **Visual Studio** also opens and loads the solution file your project created.

## 2. Creating Folders

It's always good practice to keep your project's content organized.
The first thing you're going to learn is how to create a folder that
will store your imported content.

Before you get started: Download Quick Start Assets from the following link.

- Sample Assets

- Extract the downloaded assets to a location on your computer. Click image for full size.
- From the **Content Browser** inside the Editor, click the **Add New** button. Click image for full size.
- Select **New Folder** to create a new folder. Click image for full size.
- Name the folder **QuickStartContent.** Click image for full size.
- Double-click the **QuickStartContent** folder.

Naming conventions matter! Be consistent when naming folders and files.

## 3. Importing Meshes

There are a few ways to add content to your UE5 project; however, we'll focus on the Content Browser's **Import** functionality.

- Now that you're inside the **QuickStartContent** folder, click the Content Browser's **Import** button to open a file dialog box. Click image for full size.
- Locate and select the **Basic_Asset1** and **Basic_Asset2** FBX mesh files. Click image for full size.
- Click **Open** to begin importing the FBX mesh files to your project.
- Inside the editor, the **FBX Import Options** dialog box appears. Clicking **Import** or **Import All** adds your meshes to the Project. Click image for full size.
- Click **Save All** to save your imported meshes. Click image for full size.
- A **Save Content** dialog box appears. Click **Save Selected** to save your imported assets. Click image for full size.
- Navigate to the **QuickStartContent** folder, then verify UE5 created the corresponding **.uasset files**. Click image for full size.

Organize your assets so that you can easily find them.

## 4. Importing Textures

- Navigate to the **QuickStartContent** folder in the Editor, then click the Content Browser's **Import** button to open a file dialog box. Click image for full size.
- Locate and select the **T_Rock_04_D** and **T_Rock_04_n** Targa (TGA) image files. Click image for full size.
- Click **Open** to begin importing the TGA image files to your project.
- A confirmation box appears in the lower right corner of the Unreal Editor. Click image for full size.
- Click **OK** to accept the **T_Rock_04_n.TGA** normal map's settings.
- Click **Save All** to save your imported images. Click image for full size.
- A **Save Content** dialog box appears.
- Click **Save Selected** to save your imported assets.
- Navigate to the **QuickStartContent** folder, then verify UE5 created the corresponding **.uasset files**. Click image for full size.

Fab (also accessible from the **Epic Launcher**) is a great place to find and share content.

## 5. Preparing Meshes for Import

If you have your own meshes to import, this section is for you.

The UE5 FBX import pipeline uses **FBX 2018**. Using a different version during export may result in incompatibilities.

- Select the mesh(es) to be exported in the viewport.[image: Maya Export] Click image for full size.
- In the **File** menu, choose **Export Selection** (or **Export All** if you want to export everything in the scene regardless of selection).[image: Maya Export] Click image for full size.
- In the **Export** dialog box:Choose the **Content** folder inside your UE5 Project (1)
- Enter a name for the file and set it to FBX Export (2)
- Set your Export Options (3)
- Click **Export All** (4)[image: Maya Export] Click image for full size.

The settings in the Geometry category above are the most basic requirements for exporting **Static Meshes** to Unreal Engine 5.

You can use the default options for importing. Refer to FBX Import Options Reference (-> fbx-import-options-reference-in-unreal-engine) for more information on each option.

- Your asset has now been imported and you can drag-and-drop it from the **Content Browser** into your level.[image: Asset into your Level] Click image for full size. In the example above (as part of our Import Options), we imported **Materials** and **Textures**.

Well done! You've learned how to prepare meshes for import into UE5.

✓ Click here if you want to learn more about the FBX content pipeline. (-> fbx-content-pipeline).

Clean modeling improves a game's performance.

## 6. Creating Materials

**Materials** are assets applied to meshes, contributing to a scene's visual aesthetic.
There are a few ways to create and edit materials for your UE5 project; however, we'll focus on using the **Material Editor**.

- Navigating to your **Content Browser**, click **Add New** and select **Material**.[image: New Create Material] Click image for full size.
- Name your material **Rock**.[image: Material Naming] Click image for full size.
- Your **Rock Material** is now ready to be used.[image: New Rock Material] Click image for full size.
- Double-clicking the **Rock Material** will open the Material Editor (-> unreal-engine-material-editor-user-guide).[image: Material Editor] Click image for full size. Read our Material - How-to (-> unreal-engine-materials-tutorials) documentation if you want to learn more about working with material nodes.

Size your textures using powers of two.

## 7. Editing Materials

At this point, you should have created a new material and opened the **Material Editor**.

[image: Material Editor] Click image for full size.

You can define a material's color, shininess, transparency, and much more in the Material Editor (-> unreal-engine-material-editor-user-guide). You're now ready to edit the **Rock Material** you created.

- Select the **Main Material Node** in the center of the **Material Graph**. The **Material Editor** will highlight the node for you when you select it.[image: Main Material Node] Click image for full size. It is the only node in the graph (named after your material).
- Inside the **Details** panel, change the **Shading Model** from **Default Lit** to **Subsurface**.[image: Select Subsurface] Click image for full size.
- The **Subsurface Shading Model** enables two more pins in the **Main Material Node**: **Opacity** and **Subsurface Color**.[image: New More Pins] Click image for full size.
- Get your textures into the Graph. Hold the **T** key and left-click inside the Editor's Graph area. A **Texture Sample Node** should appear inside the graph.[image: Texture Sample] Click image for full size.
- You'll want at least 2 textures. Repeat Step 4 until your graph looks like the image below.[image: New Texture Sample Nodes] Click image for full size.
- Select one of the **Texture Sample Nodes** and locate the **Details Panel** under the **Material Expression Texture Base** category.[image: Material Expression Texture Base] Click image for full size. Under the texture property, left-click the pull down menu labeled **None** and select the color texture named **T_Rock_04_D**.You can also use the search field to locate the texture asset by entering **T_Rock_04_D** in the search field.
- Repeat Step 6 for the other **Texture Sample Node**, making sure to select the normal map texture named **T_Rock_04_n**.[image: New Both Textures Selected] Click image for full size. The Material Graph should resemble the image pictured above.
- Connect the **T_Rock_04_D** Texture Sample's **Color pin (white)** to the Rock Material's **Base Color pin**.[image: New Connect Color Pin] Click image for full size. The newly connected **white pin** contains the texture's color channels.
- Connect the **T_Rock_04_n** Texture Sample's **Normal pin (white)** to the Rock Material's **Normal pin**.[image: New Connect Normal Pin] Click image for full size. The newly connected **white pin** contains information for the texture's normal map.
- The **Preview** should look similar to the image pictured below.[image: New Preview DN] Click image for full size.
- Hold the **1** key and left-click in the **Graph Panel** to create three (**3**) **Constant** nodes.[image: Constants] Click image for full size. The **Constant Node** is a modifiable scalar float variable.
- Hold the **3** key and left-click in the Graph Panel to create one (**1**) **Constant3Vector**.[image: Constant 3] Click image for full size. The **Constant3Vector** node is a modifiable vector corresponding to color without an alpha channel.Read our Constant Expression (-> constant-material-expressions-in-unreal-engine) documentation if you want to learn more about working with constant expressions.
- Your nodes should be arranged so that connections can be easily made without wires crossing or sliding beneath each other.[image: New Mat Constants Added] Click image for full size.
- Connect all of the **Constant** and **Constant3Vector** nodes to corresponding pins in the **Rock Material Main Node**.[image: New All Nodes Connected NoVal] Click image for full size.
- Change the values of each **Constant** and **Constant3Vector** by updating their **Value** parameter in the **Details** panel.**Specular Value** = 0.0
- **Roughness Value** = 0.8
- **Opacity Value** = 0.95
- **Subsurface Color** = Red(1,0,0)[image: New All Connected All Adjusted] Click image for full size.

- The **Preview** should look similar to the image pictured below.[image: New Preview All] Click image for full size. Make sure to save your material before exiting the **Material Editor**.

You're almost done! You've just used the **Material Editor** to edit your **Rock Material**.

A list of all Material Editor Keyboard Shortcuts can be found by going to **Edit Menu > Editor Preferences > Keyboard Shortcuts > "Material Editor" and "Material Editor-Spawn Nodes"** categories.

## 8. Applying Materials to Static Mesh Actors

You're now ready to bring things together!

The objective of this step is to apply our **Material** to the Static Mesh we imported. Specifically, you'll learn how to:

- Set an Actor's default Material (-> artist-quick-start-in-unreal-engine)
- Change Materials used by an Actor (-> artist-quick-start-in-unreal-engine)

### Setting an Actor's Default Material

This section will show you how to set a **Static Mesh Actor's** default material. The default material will be used whenever an **Actor** is placed in the level.

- Inside the **Content Browser**, double-click the asset you imported earlier in this guide.[image: New Browser Conten Asset] Click image for full size. The Static Mesh Editor (-> static-mesh-editor-ui-in-unreal-engine) will load your asset for editing.[image: Static Mesh Editor] Click image for full size.
- Inside the **Details** panel under **LOD0**, left-click the material's drop-down menu.[image: LOD 0] Click image for full size.0
- Select the **Rock Material** you created earlier. The material should be available in the selection window.[image: Select Rock Material] Click image for full size. Your **Preview Pane** will update to reflect the newly applied material.[image: New Default Material] Click image for full size.
- Clicking the **Save** button first, close the **Material Editor**.
- Inside the **Content Browser**, drag-and-drop the newly textured **Static Mesh Actor** into your level.[image: New Material In Level] Click image for full size. The specified **Material** will be used anytime you place this asset in the level.

### Changing Material Used by an Actor

When we placed a **Static Mesh** object in our level, we created an instance of our object (an Actor (-> actors-and-geometry-in-unreal-engine)). For every instance of that **Actor**, we're able to specify its **Material**.

Here's how you change a **Static Mesh Actor's** Material.

- Select your **Static Mesh Actor**.[image: New Statis Mesh Selected] Click image for full size.
- Inside the **Details** panel, locate the **Materials** section and click the **Materials** dropdown menu.[image: Material DropDown] Click image for full size.
- Inside the pop-up menu, select a different Material.[image: Select Tutorial Asset Material] Click image for full size.
- Alternatively, drag-and-drop a new Material onto the **Static Mesh Actor**.[image: New Material Drop] Click image for full size.

You've just applied materials to your Static Mesh Actors by:

- Setting your Actor's Default Material
- Changing Material used by your Actor

We've now reached the end of the Artist Quick Start Guide. By now, you should have the skills needed to:

✓ Set-up a Project

✓ Create Materials

✓ Edit Materials

✓ Apply Materials to a Static Mesh Actor

Are you ready to do some exercises on your own?

## 9. On your own!

Using what you know, create a new **Material** similar to this graph:

[image: Plastic Material Network] Click image for full size.

The Main Material node settings simulate a plastic material.

Add **Basic_Asset1** to the level, apply the Material to it, and update the Material to apply a "Brick" Normal Map Texture.

[image: Normal Map Added] Click image for full size.

For information on importing different types of content, refer to:

- Information on the FBX pipeline (in general): FBX Content Pipeline (-> fbx-content-pipeline).
- Information on the FBX Skeletal Mesh pipeline: FBX Skeletal Mesh Pipeline (-> fbx-skeletal-mesh-pipeline-in-unreal-engine).
- Information on the FBX Animation pipeline: FBX Animation Pipeline (-> fbx-animation-pipeline-in-unreal-engine).
- Information on the FBX Morph Target pipeline: FBX Morph Target Pipeline (-> fbx-morph-target-pipeline-in-unreal-engine).
- Information on the FBX Material pipeline: FBX Material Pipeline (-> fbx-material-pipeline-in-unreal-engine).
- Information on Importing Audio: Audio Files (-> importing-audio-files).

For specifics covered in this Quick Start Guide, refer to:

- Information on Supported Image Types: Texture Import Guide (-> textures-in-unreal-engine).
- Information on Materials: Materials (-> unreal-engine-materials).
- Information on the Content Browser: Content Browser (-> content-browser-in-unreal-engine).
- Information on the Static Mesh Editor: Static Mesh Editor UI (-> static-mesh-editor-ui-in-unreal-engine).

- ui
- static meshes

On this page

- 1. Required Project Setup (-> artist-quick-start-in-unreal-engine)
- 2. Creating Folders (-> artist-quick-start-in-unreal-engine)
- 3. Importing Meshes (-> artist-quick-start-in-unreal-engine)
- 4. Importing Textures (-> artist-quick-start-in-unreal-engine)
- 5. Preparing Meshes for Import (-> artist-quick-start-in-unreal-engine)
- 6. Creating Materials (-> artist-quick-start-in-unreal-engine)
- 7. Editing Materials (-> artist-quick-start-in-unreal-engine)
- 8. Applying Materials to Static Mesh Actors (-> artist-quick-start-in-unreal-engine)
- Setting an Actor's Default Material (-> artist-quick-start-in-unreal-engine)
- Changing Material Used by an Actor (-> artist-quick-start-in-unreal-engine)
- 9. On your own! (-> artist-quick-start-in-unreal-engine)

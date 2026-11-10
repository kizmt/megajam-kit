# Vertex Key Framed Meshes

https://dev.epicgames.com/documentation/en-us/unreal-engine/vertex-animation-tool---key-framed-meshes-in-unreal-engine?application_version=5.9

> User guide for the 3Ds Max Vertex Animation tool set.

[image: Vertex Key Framed Meshes]

You can also use the Vertex Animation tool with meshes that do not make use of the Animation Timeline in 3Ds Max.
Generally speaking mesh animations that use this method have been exported frame by frame from another 3D package like Maya or Blender.
In this section we will go over how to use this method as well as any differences in setup that you need to be aware of.

## 3Ds Max Content Creation

Please note that while we are using 3Ds Max for this example, the method in which the content is created and setup inside 3Ds Max is no different than how content could be set up inside other 3D Packages such as Maya or Blender.

- First inside 3Ds Max create a new scene and then create a Teapot with the following settings and place it at 0,0,0 in the world. **Radius:** 70.0

- **Segments:** 5

- Next from the **Modifier List** add a **Melt Modifier** to the Teapot mesh.

- Now make a copy of the mesh by holding down the **Shift** key and moving the Teapot along the X axis with the mouse. Position the Teapot copy so that the orange bounding box of the Melt modifier does not intersect the original mesh. Once the Teapot copy is in position release the mouse and the shift key and the Clone Options will be displayed. Make sure the **Object** is set to **Copy** and then set the **Number of Copies** to **Four** and press the **Ok** button to create the copies.

- Then select the 2nd Teapot mesh and set the **Melt Amount** in the Melt modifier to **25**. Then select the next Teapot in line and set the **Melt Amount** of the Melt modifier to **50** and the next one to **75**, and finally set the last Teapot **Melt Amount** to **100**.

- With all the Teapots now having some type of deformation on them, select all the Teapots and then with the mouse **Right-Click** in the 3Ds Max viewport and select **Convert To:** > **Convert to Editable Poly**. You have to convert any mesh that you want to use with this tool to Editable Poly. The tool **WILL NOT** work with any other mesh type.

- Now that the Teapot meshes have all been converted to Editable Poly, select all the meshes and move them to 0,0,0 in the world. Once the meshes are in the center of the world, deselect the Teapot meshes and then select them in the order that the animation is supposed to play. For this example we want to select Teapot001 first then select Teapot002 and so on till all five are selected. The Sequence Painter Tool requires that you select the meshes in the order that they should be played in the animation. Failing to do this will result in the animation that gets played in Unreal Engine not syncing up to the bone driven animation that it is supposed to replace.

- With the Teapots now in the center of the world and selected in the order that the animation is supposed to be played, it is now time to run the **Sequence Painter** script. To do this all you need to do is press the **Paint Selection Sequence** button that is in the **Sequence Painter** section of the tool. Depending on the amount of vertices your mesh has the time that it takes for the **Paint Selection Sequence** to finish is quite fast.

- Now that position data has been saved to the UVs of the Teapot, it is time to export the Teapot mesh for use in the Unreal Engine. When exporting the Teapot mesh use the same setting as you would for any other Static Meshes and make sure that **Smoothing Groups** are enabled. For this example the Teapot mesh was given the name **SM_Teapot_PSS.FBX**.

## Unreal Engine Setup

Once the Teapot mesh has been exported from 3Ds Max, it is now time for the Teapot mesh to be imported and setup so that it will work the same inside Unreal Engine.

- First import the Teapot mesh, **SM_Teapot_PSS.FBX** by dragging it from the location it was exported to into the **Content Browser**, making sure that the following options are enabled / disabled. Disable the **Auto Generate Collision** option.

- Disable the **Remove Degenerates** option.

- Disable the **Generate Lightmap UV's** option.

- Enable the **Combine Meshes** option.

- Disable both **Import Materials** & **Import Textures** option.

- After the Teapot mesh has been imported, open the mesh up by **Double-Clicking** on it with the **Left Mouse button** in Content Browser. Once the mesh has been opened enable the **Use Full Precision UVs** option and set the **Distance Field Resolution Scale** to **0.0** then press the **Apply Changes** button.

- With the Teapot mesh now set up correctly, create a new **Material** in the Content Browser and name it **MAT_Sequance_Painter** and then open up the Material.

- Once the Material is opened up, add two **Constant Parameter** nodes to the Material Graph by holding down the **1** key on the keyboard and **Left-Clicking** with the mouse in the Material Graph to place the Constant Parameter nodes. Set the value of one of the Constant Parameter node and plug that into the **Base Color** input on the Main Material Node. Then set the value of the other Constant Parameter node to 5.

- Next use the mouse and **Right-Click** in the Material Graph to expose the search menu and then search for **MS_SequencePainter_SequenceFlipbook** Material Function using MS as the search term. When you find the MS_SequencePainter_SequenceFlipbook Material Function, click on it with the Left Mouse button to add it to the Material Graph.

- With the correct Material Function now in place, connect the output of the **MS_SequencePainter_SequenceFlipbook**, into the World Position Offset input on the Main Material node and then connect the remaining Scalar parameter to the **Number Of Frames** input on the MS_SequencePainter_SequenceFlipbook Material Function node.

- Now that everything has been hooked up press the **Apply** button to compile the Material and then press the **Save** button. After that is completed you can then close down the Material Graph Editor.

- With the Material created, compiled, and saved drag the Teapot mesh from the Content Browser into the level and then drag the **Material** that was just created for it from the Content Browser on to the mesh that was placed in the level. Once this has been completed you will now see the mesh "playing" the animation.

- animation
- tool
- deformer
- 3ds

On this page

- 3Ds Max Content Creation (-> vertex-animation-tool---key-framed-meshes-in-unreal-engine)
- Unreal Engine Setup (-> vertex-animation-tool---key-framed-meshes-in-unreal-engine)

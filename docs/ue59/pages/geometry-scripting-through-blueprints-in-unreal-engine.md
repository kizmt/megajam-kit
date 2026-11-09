# Geometry Scripting Through Blueprints

https://dev.epicgames.com/documentation/en-us/unreal-engine/geometry-scripting-through-blueprints-in-unreal-engine?application_version=5.9

> Build a fundamental understanding of using Geometry Scripting through Blueprints by generating a procedural mesh.

[image: Geometry Scripting Through Blueprints]

Learn to use this **Beta** feature, but use caution when shipping with it.

Geometry Scripting provides Blueprint and Python functions for creating custom modeling tools and workflows. This guide covers the fundamentals of using Geometry Scripting through Blueprints. The steps below go through generating a procedural mesh tool for level design, similar to the geometry tools created for the Lyra sample project (-> lyra-geometry-tools-in-unreal-engine).

This guide shows you how to:

- Generate procedural geometry for quick level blocking.

- Use boolean operations to cut out a mesh dynamically.

- Create a Static Mesh bake function.

The tool you develop is a small example of procedural mesh generation and tools you can create with Geometry Scripting. An advanced example is the **Procedural Content Generation Framework**, which uses Geometry Scripting as a base. To learn more about this toolset, see Procedural Content Generation Overview.

Additional workflows you can create besides procedural generation include:

- Assigning multiple materials to assets.

- Applying mesh booleans with Python.

- Generating Blocking Volumes based on convex hulls.

## Prerequisite Knowledge

To understand and use the content on this page, you must:

- Have a fundamental understanding of Blueprints (-> introduction-to-blueprints-visual-scripting-in-unreal-engine).

- Be familiar with the introductory topic of Geometry Scripting (-> geometry-scripting-users-guide-in-unreal-engine), specifically the new object types introduced.

This guide uses the Third Person template. However, you can use any project to follow along.

## Enabling Plugin

Using Geometry Scripting requires having the associated plugin enabled.

To enable the plugin or verify that it is already enabled, follow these steps:

- In the **menu bar (-> level-editor-in-unreal-engine)**, select **Edit** > **Plugins**.

- In the search bar, type "geometry script". [image: Enable Geometry Scripting Plugin]

- Enable **Geometry Script** plugin, and select **Yes** in the dialog popup.

- Restart the engine.

## Creating a Blueprint Class

To get started, you must ensure you have the correct Blueprint class. Since the goal is to create a procedural mesh for level design, use the **GeneratedDynamicMeshActor** class.

To select a Blueprint class, follow these steps:

- In the **Content Browser**, right-click and select **Blueprint Class**.

- Search for and select **GeneratedDynamicMeshActor**. [image: Generated Dynamic Mesh Actor Class]

- Name the Blueprint **BP_ProceduralGen**.

If you do not see **GeneratedDynamicMeshActor** as an option, the Geometry Scripting plugin is not enabled.

### Event Setup

After creating the class, you must set up the specific event to populate the Dynamic Mesh you will use for building your tool.

To create the event, follow these steps:

- In the Content Browser, double-click the Blueprint class.

- Open the **Event Graph**.

- Right-click in the graph, and type "generated mesh" to filter the available nodes, then select **Event on Rebuild Generated Mesh**. This event triggers every time you update the parameters of the Dynamic Mesh–causing the mesh to be rebuilt. [image: Event Rebuild Generated Mesh]

- Promote the **Target Mesh** output to a local variable by right-clicking its pin and selecting **Promote to Variable**. [image: Promote Pin to Variable]

- Name the variable **DynamicMesh**, set the type to **Dynamic Mesh**, and keep it private. This variable represents the Dynamic Mesh you edit.

## Building Geometry

With the Blueprint class and event created, you can begin adding geometry scripting functions. The goal in this guide is to generate block-out shapes that you can transform and cut out. For that, you need first create the mesh you want to edit.

To create a mesh, follow these steps:

- Drag off the **DynamicMesh** variable's execution pin, then search and select the **Append Box** node. This adds a box primitive to the Dynamic Mesh.

- Connect the out pin of the **DynamicMesh** variable to the **Target Mesh** input pin. [image: Dynamic Mesh Variable]

With these first few nodes, you have created a procedural mesh. You can test it by compiling and dragging the Blueprint into your Level. To learn what other shapes you can instantly make, see the Primitive Generation section of the Geometry Scripting Reference document.

### Adding Transformation Widget

In order to be able to dynamically adjust the transformation of your mesh, you can add interactive controls.

To add interactive controls, follow these steps:

- Create a new public variable called **BoxSize** and set the type to Vector. [image: BoxSize Variable]

- In the **Details** panel of this variable, enable **Instance Editable** and **Show 3D widget**. Set the **Default Value** to 200, 200, 200. Enabling the 3D widget creates a manipulator for interactively controlling the X, Y, and Z transforms. [image: Variable Details Panel]

- Drag out the variable and select **Get BoxSize**.

- Right-click the variable and select **Split Struct Pin**. The X, Y, and Z values of the variable will drive the dimensions of the box.

- Connect the corresponding X, Y, and Z values to the respective dimension values of **Append Box**. [image: Widget Size Values]

- **Compile** (Ctrl + Alt) and **Save** (Ctrl + S).

You can now generate a cube mesh and dynamically adjust the dimensions. Each adjustment with the widget generates a new dynamic mesh of the set size versus scaling the mesh.

 [image: Dynamic Mesh]

For the widget to appear you must be in **Selection Mode**.

## Editing with Booleans

Boolean operations subtract or add mesh pairs. These are helpful for quickly adding detail and displacement effects to your mesh. To create the second mesh for the boolean function, you can allocate a temporary mesh from a mesh pool. The temporary mesh avoids unnecessary geometry in the editor, which puts less strain on computing processing.

To create a boolean operation, follow these steps:

- Right-click the graph, then search and select **Get Compute Mesh Pool**. This allocates a temporary mesh to perform a boolean operation.

- Pin **Append Box's** execution pin to **Get Compute Mesh Pool**.

- Drag out the **Return Value** pin, then search and select **Request and Release Mesh**. Connect the execution pins.

- Drag out the **Mesh** pin, then search and select **Append Cylinder**. This node adds a cylinder mesh that you will use to subtract from the box mesh.

- Promote the output **Target Mesh** to a variable called **BoolMesh**. Set the type to **Dynamic Mesh** and leave it private. [image: Bool Mesh Variable]

- Drag out the execution pin of **BoolMesh**, then search and select **Apply Mesh Boolean**. You will use this node to apply the boolean operation to your mesh.

- Drag out and connect the **DynamicMesh** variable to the **Target Mesh** input of **Apply Mesh Boolean**.

- Connect **BoolMesh** to the **Tool Mesh** pin of **Apply Mesh Boolean**. **Tool Mesh** represents the mesh you want to do the boolean with. This parameter is why you added the **Append Cylinder** node. [image: Apply Mesh Boolean Node]

- Set the Operation type in the Apply Mesh Boolean node to **Subtract**.

- **Compile** (Ctrl + Alt) and **Save** (Ctrl + S).

When you compile and view the Blueprint in the Level Editor, you might not see the boolean effect because it's too small. To see the effect, you can manually set the size of the boolean mesh or dynamically adjust it using widgets.

### Adding Widgets

Just as you created a widget for the box primitive, you can do the same for the boolean mesh and location.

To create a widget, follow these steps:

- Under the **Variables** panel, create a public variable for the location of the boolean mesh, name it **BoolLocation**, and set the type to **Vector**.

- In the **Details** panel, enable **Instance Editable** and **Show 3D widget**.

- Right-click the **Transform** pin of the **Append Cylinder** node, select **Split Struct Pin**, then connect the **BoolLocation** variable to the **Transform Location**. [image: Bool Location Variable]

- Create another public variable, name it **BoolSize**, and set the type to Vector. You can use this to adjust the size of the boolean mesh.

- In the **Details** panel, enable **Instance Editable** and **Show 3D widget**, then set the **Default Value** to 1, 1, and 5.

- Drag the variable into the graph and select **Get Bool Size**.

- Right-click the pin and select **Split Struct Pin**.

- Connect the **Bool Size** pins to the corresponding **Transform Scale** pins of the **Append Cylinder** node. [image: Bool Size Variable]

- **Compile** (Ctrl + Alt) and **Save** (Ctrl + S).

You now have a mesh you can dynamically transform into different shapes.

 [image: Dynamic Boolean Editing]

## Bake to Static Mesh Function

Now that you have your dynamically generated mesh, you can apply it to existing static meshes for quick level design. To do so, you can create a bake function and expose it to the Level Editor's **Details** panel.

To create the function, follow these steps:

- Create a new function called **Bake Static Mesh**. [image: Bake Static Mesh Function]

- In the **Details** panel of the function, enable **Call in Editor** to activate the event from the Level Editor. [image: Enable Call in Editor ]

- Drag off the function's execution pin, then search for and select **Get Dynamic Mesh**. The function pulls the dynamic mesh currently in use.

- Drag off the **Get Dynamic Mesh** execution pin, then search for and select **Copy Mesh to Static Mesh**. Also, connect the **Return Value** to **From Dynamic Mesh**. When the function executes, the dynamic mesh is baked to the selected static mesh. [image: Copy Mesh to Static Mesh Function]

- To select the static mesh you want to bake, you must expose the parameter to the editor. Create a public variable, call it **TargetMesh**, and set the type to **Static Mesh**.

- Drag the variable into the graph and select **Get TargetMesh**.

- Right-click the variable pin and select **Convert to Validated Get**. This conversion sets up the function to only run the code if you have a mesh selected.

- Connect **Target Mesh** pin to **To Static Mesh Asset**. [image: Bake Static Mesh Graph] Finale Bake Script.

- **Compile** and **Save**.

- A **Bake to Static Mesh** button now appears in the Level Editor's **Details** panel. Before using the button, update the **Target Mesh** to the static mesh you want to bake. [image: Bake Static Mesh Button]

## Reviewing End Results

With the Bake Static Mesh function and procedural mesh script, you can use a dynamic mesh to update the static meshes in your level continually.

Final procedural mesh script. Click to expand.

## On Your Own

Using what you learned, try making the following adjustments:

- Change the box mesh to a sphere.

- Add a second boolean mesh for extra modeling control.

- Use the **Create New Static Mesh Asset From Mesh** node to bake the dynamic mesh to a new static mesh instead of an existing one.

- animation
- landscape
- modeling
- beta
- geometry scripting
- procedural geometry

On this page

- Prerequisite Knowledge (-> geometry-scripting-through-blueprints-in-unreal-engine)
- Enabling Plugin (-> geometry-scripting-through-blueprints-in-unreal-engine)
- Creating a Blueprint Class (-> geometry-scripting-through-blueprints-in-unreal-engine)
- Event Setup (-> geometry-scripting-through-blueprints-in-unreal-engine)
- Building Geometry (-> geometry-scripting-through-blueprints-in-unreal-engine)
- Adding Transformation Widget (-> geometry-scripting-through-blueprints-in-unreal-engine)
- Editing with Booleans (-> geometry-scripting-through-blueprints-in-unreal-engine)
- Adding Widgets (-> geometry-scripting-through-blueprints-in-unreal-engine)
- Bake to Static Mesh Function (-> geometry-scripting-through-blueprints-in-unreal-engine)
- Reviewing End Results (-> geometry-scripting-through-blueprints-in-unreal-engine)
- On Your Own (-> geometry-scripting-through-blueprints-in-unreal-engine)

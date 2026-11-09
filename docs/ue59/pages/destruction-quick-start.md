# Destruction Quick Start

https://dev.epicgames.com/documentation/en-us/unreal-engine/destruction-quick-start?application_version=5.9

> Quick Start guide for Unreal Engine's Destruction system.

[image: Destruction Quick Start]

You can find similar information in video format in the Developer Community site by watching the Chaos Destruction Overview tutorial.

## 1 - Required Setup

- Create a new project and select the **Games** category and the **First Person** template. Enter your project's name and click **Create**. Click for full view.

- In the editor, click **File > New Level**. Select the **Basic** template and click **Create**. Save the level. [image: Create a new level and select the Basic template]

### Section Results

In this section, you created a new project and set it up so you can add a Static Mesh which can be fractured in the next section of this guide.

## 2 - Creating the Geometry Collection

Destruction within the Chaos system starts with a new kind of asset called a **Geometry Collection**. These assets can be built from one or more Static Meshes, including those gathered together in Blueprints or even nested Blueprints.

Once you have a Geometry Collection, you can break it apart using the **Fracture Mode** and define the settings that determine how it breaks apart.

In this section you will create a Geometry Collection from a Static Mesh actor.

- Add a Static Mesh to the level which you'll use to create a fractured mesh. In this example, I'm using the Chaos Primitive Box included in the Content Examples project available in Fab. Click for full view.

- Click the **Mode** dropdown and select **Fracture**. [image: Select the Fracture mode from the Select Mode dropdown] This will open the **Fracture Mode** windows that contain all the tools for fracturing your mesh. Alternatively, you can press **Shift-6** to switch to the Fracture Mode. Click for full view.

- Go to the **Generate** section and click **New** to create a new **Geometry Collection**. This new asset type will be saved in the **Content Browser** and will be used to create your fractured mesh. [image: Click New to create a new Geometry Collection] Select the **directory location** where the Geometry Collection will be saved.

- Enter the name for the Geometry Collection asset.

- Click **Create Geometry Collection**. [image: Select the directory location, enter a name for your asset and click Create Geometry Collection]

- Click **Save All** in the **Content Browser** to save the new Geometry Collection asset. [image: Click Save All in the Content Browser to save the new Geometry Collection asset]

- The Static Mesh will be replaced with the Geometry Collection in the level. In the **Fracture Hierarchy** window you will see that the Geometry Collection has a single node in the hierarchy. This means that the Geometry Collection is composed of only one piece (single node). As you fracture your Geometry Collection, you will see each fractured piece represented as a separate leaf (child) node in the hierarchy. This hierarchy represents how the entire object was fractured, from a single solid piece to individual pieces that can break off as strain is applied. [image: The Static Mesh will be replaced with the Geometry Collection in the level] Click for full view.

### Section Results

In this section you learned how to create a Geometry Collection from a Static Mesh actor. You also learned how to enable the Fracture Mode in the editor and view a Geometry Collection's Fracture Hierarchy.

In the next section you will learn how to fracture the Geometry Collection.

## 3 - Fracturing the Geometry Collection

There are several different types of fracture methods available. Combining the different techniques may lead to more interesting-looking destruction. You will have to experiment with the different options and settings to achieve your desired results.

In this guide you will learn about the standard **Uniform Voronoi** method. With this method you define a minimum and maximum number of sites to create cell volumes for fracturing.

- Go to the **Fracture** section and click the **Uniform** fracture button. [image: Click the Uniform fracture button]

- Leave the default settings as they appear and click **Fracture**. [image: Click Fracture]

- The Geometry Collection is now fractured and you can see the newly created nodes (fractured pieces) in the **Fracture Hierarchy** window. For this example, you created 20 nodes. Click for full view.

- You can see the current fracture hierarchy by going to the **Level Statistics** window. In this example, Level 0 has 1 piece, and Level 1 has 20 pieces. If you continue to further fracture the Geometry Collection, the new structure will be reflected in this window. Click for full view.

- You can preview how the Geometry Collection will fracture by changing the value of the **Explode Amount** field inside the **Fracture** window. Click for full view.

- In the example below, you can see the results of changing the value from 0 to 1 in the field. [image: Change the Explode Amount to preview how the Geometry Collection will fracture]

- Select the **Geometry Collection** and move it above the ground. Click the **Play Mode options** button and select **Simulate** or **Selected Viewport** to see the results. [image: Click Simulate from the Play Modes option menu]

- Below you can see the result of the performed steps. [image: The box falls to the ground and fractures on impact]

### Section Results

In this section you learned how to use the **Fracture Mode** to fracture a Geometry Collection by using the standard Uniform Voronoi method.

In the next section you will learn how you can destroy the Geometry Collection by shooting it.

## 4 - Destroying the Geometry Collection by shooting it

In this section you will use the First Person Rifle Blueprint that comes with the template to shoot and destroy the Geometry Collection you created.

The fractured pieces of a Geometry Collection break apart when enough strain is applied to its **Connection Graph** (how the fractured pieces are connected to one another).

The most common way to apply strain to a Geometry Collection is by using a Physics Field (-> physics-fields-in-unreal-engine). In this example, you will use a pre-built **Master Field** that comes with Unreal Engine by default. You will spawn this Field at the projectile's impact location, and the Field will cause the Geometry Collection's pieces to break apart.

- In the **Content Browser** go to **FirstPerson > Blueprints** and drag **BP_Rifle** to the level. During gameplay you can pick up the rifle and shoot by using the left mouse button. Click for full view.

- In the same folder, double-click **BP_FirstPersonProjectile** to open it. In the **Event Graph**, select all the nodes except **Event Hit** and delete them. Click for full view.

- Drag from the **Event Hit** node and search for then select **Spawn Actor from Class**. [image: Drag from the Event Hit node and search for then select Spawn Actor from Class] Click the **Class** dropdown of the **Spawn Actor** node and search for then select **FS_MasterField**. [image: Click the Class dropdown of the Spawn Actor node and search for then select FS_MasterField]

- Drag from the **Spawn Transform** pin of the **Spawn Actor** node and select **Make Transform**. [image: Drag from the Spawn Transform pin of the Spawn Actor node and select Make Transform]

- Connect the **Hit Location** pin of the **Event Hit** node to the **Location** pin of the **Make Transform** node. [image: Connect the Hit Location pin of the Event Hit node to the Location pin of the Make Transform node]

- Drag from the **Return Value** pin of the **Spawn Actor** node and search for then select **Set Activation Type**. [image: Drag from the Return Value pin of the Spawn Actor node and search for then select Set Activation Type] Connect the **Spawn Actor** node to the **Activation Type** node.

- Click the **Activation Type** dropdown and select **Trigger**. This will set the Master Field to activate when triggered. [image: Click the Activation Type dropdown and select Trigger]

- Drag from the **Return Value** pin of the **Spawn Actor** node and search for then select **CE Trigger**. [image: Drag from the Return Value pin of the Spawn Actor node and search for then select CE Trigger]

- Connect the **Activation Type** node to the **CE Trigger** node. The **CE Trigger** node immediately activates the Master Field. Click for full view.

- Drag from the **CE Trigger** node and search for then select **Delay**. [image: Drag from the CE Trigger node and search for then select Delay]

- Drag from the **Delay** node and search for then select **Destroy Actor**. This will destroy the projectile after a brief delay on impact. [image: Drag from the Delay node and search for then select Destroy Actor]

- Your complited Blueprint Script should look as following: Click for full view.

- Go back to **Fracture Mode** and select the Geometry Collection. Press **Shift-B** to toggle the bone colors of the Geometry Collection so you can see the box materials. [image: Press shift B to toggle the bone colors]

- Press **Play** and move to the rifle to pick it up. Use the left mouse button to shoot a projectile at the Geometry Collection and destroy it [image: Use the left mouse button to shoot a projectile at the Geometry Collection and destroy it]

### Section Results

In this section you learned how to spawn a Physics Field that applies strain to a Geometry Collection, causing it to break apart.

## 5 - On Your Own!

Now that you know how to create and fracture a Geometry Collection, you can take what you've learned and apply it to more complex examples.

Here are some additional examples you might want to try:

- Use several Static Meshes to create a more complex Geometry Collection.

- Create more fracture levels and use different fracturing methods to create more interesting destruction patterns.

- Build a more complex structure by combining several Geometry Collections and destroy them by shooting them.

 [image: Geometry Collection with different types of fracture methods]

## Next Steps

You can learn more about the Fracture Mode and the Destruction system by reading the Key Concepts documentation or watching the Chaos Destruction video tutorials (-> physics-fields-in-unreal-engine) in the Developer Community site.

- physics
- chaos
- chaoseditor

On this page

- 1 - Required Setup (-> destruction-quick-start)
- Section Results (-> destruction-quick-start)
- 2 - Creating the Geometry Collection (-> destruction-quick-start)
- Section Results (-> destruction-quick-start)
- 3 - Fracturing the Geometry Collection (-> destruction-quick-start)
- Section Results (-> destruction-quick-start)
- 4 - Destroying the Geometry Collection by shooting it (-> destruction-quick-start)
- Section Results (-> destruction-quick-start)
- 5 - On Your Own! (-> destruction-quick-start)
- Next Steps (-> destruction-quick-start)

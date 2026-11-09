# Material Parameter Collections

https://dev.epicgames.com/documentation/en-us/unreal-engine/using-material-parameter-collections-in-unreal-engine?application_version=5.9

> Assets that store an arbitrary set of Scalar and Vector Parameters which can be referenced in any Material.

[image: Material Parameter Collections]

A **MaterialParameterCollection** is an asset that stores an arbitrary set of scalar and vector parameters (-> creating-and-using-material-instances-in-unreal-engine) which you can reference in an Material. It is a powerful tool that artists can use to pass global data into multiple Materials at once. You can also use Material Parameter Collections to drive per-level effects, such as snow amount, destruction amount, wetness, and so on, which would otherwise require setting individual parameter values within many different Material Instances in your Level.

In the example above, global parameters stored in a Material Parameter Collection are used to control the following aspects of the scene.

- The flower morph states along with the speed and strength of the wind.

- The player's position is tracked and fed into the foliage. That position information is used to move the flowers and grass away from the player as they walk nearby.

- The sun angle and color is also tracked and used to correctly colorize the water crests and limit the effect to only times when light shines directly through the wave crests (when the player is looking toward the sun).

- The coloration of effect across the time of day and overall diffuse lighting color for the water are also being controlled.

## Creating and Editing Material Parameter Collections

MaterialParameterCollections are a discrete asset type created in the Content Browser. Use the following steps to create a MaterialParameterCollection and add a parameter.

- **Right-click** in the Content Browser, and expand the **Material** subcategory in the Create Advanced Asset section. Select **MaterialParameterCollection** in the context menu. [image: Create new MaterialParameterCollection]

- Rename the MaterialParameterCollection asset to describe the types of parameters it will contain. This example uses the name **MPC_GlobalParams**. **Double-click** the asset to edit the MaterialParameterCollection. [image: Rename Material Parameter Collection]

- A new window opens displaying the **Scalar** and **Vector Parameters** contained within the MaterialParameterCollection. [image: Open Material Parameter Collection]

- To add parameters to the collection, click the **Add Element** (+) icon in either the Scalar or Vector Parameter section. For this example, add a **Scalar Parameter**. Name it **GlobalEmissivePower** and change the default value to **1.0**. [image: Add Scalar Parameter to MPC]

- Add any additional Scalar or Vector Parameters as needed. A single Material Parameter Collection can hold up to 1024 Scalar Parameters and 1024 Vector Parameters.

## Using Material Parameter Collections in Materials

You can now use the parameters in your MaterialParameterCollection to define the attributes in your Materials. One of the main benefits of Material Parameter Collections is that the parameter values are stored in a separate asset from the Materials themselves. This means you can reference a Material Parameter Collection in as many Materials as you want, and when you change the values in the Material Parameter Collection, it automatically affects every Material that references it.

Use the following steps to reference your Material Parameter Collection in a base Material.

- **Right-click** in the Content Browser and click **Material** in the Create Basic Asset section of the context menu. Give the Material a descriptive name. [image: Create new Material]

- In the Content Browser you should now have a Material, as well as the MaterialParameterCollection you created in the previous section. **Double-click** the **Material** to open it in the Material Editor. [image: Material and MPC in Content Browser]

- This Material will be a simple emissive surface that uses a Fresnel expression to make the Material glow slightly brighter around the edges. Add the following Material Expression nodes to your Material Graph. | Material Expression Type | Name | Default Value |
| --- | --- | --- |
| Vector Parameter | Base Color | 1,0,0,0 |
| Vector Parameter | Emissive Color | 0.1,0.01,0.14,0 |
| Multiply - x2 | n/a | n/a |
| Fresnel | n/a | n/a | Connect the Material Expressions as shown in the image below. [image: Emissive starting Material Graph]

- Select the **Fresnel** node in the Material Graph. In the Details Panel set the **Exponent** to **6** and the **Base Reflect Fraction** to **0.1**. These properties control the falloff of the rim lighting effect. Experiment with a higher or lower **Exponent** to influence how much of the surface is affected by the Fresnel node. [image: Fresnel Material Expression properties]

- **Right-click** in the Material Graph and search for "collection" and add a **CollectionParameter** to your graph. This node is used to bring infromation from your MaterialParameterCollection into the Material Graph. [image: Unspecified Collection Parameter]

- Select the **Collection Parameter** node in the Material Graph. In the Details Panel, use the **Collection** drop-down menu to select the **MPC_GlobalParameters** collection you created earlier. [image: Select Material parameter Collection]

- Use the **Parameter Name** drop-down menu to select the **EmissivePower** parameter. [image: Select Emissive Power parameter]

- Connect the **'EmissivePower'** node to the open **B** input on the Multiply node as pictured below. [image: Select Emissive Power parameter]

- Click **Save** in the Material Editor Toolbar to compile and save the Material. After saving the asset you can close the Material Editor. [image: Save Material Asset]

## Testing the Material Parameter Collection

To demonstrate the Material Collection Parameter's usefulness in controlling the attributes of multiple Materials, you can create one or more Material Instances and apply them to different objects in the scene.

- **Right-click** your base Material and choose **Create Material Instance** from the context menu. [image: Create a Material Instance]

- Apply the base Material and the Material Instance to two different objects in your level. You can change the Base Color and Emissive Color parameters in the Material Instance so you can tell the two apart. [image: Apply Materials to objects in level]

- Now when you open the Material Parameter Collection and change the **EmissivePower** value, the new value will immediately propagate to both the base Material and the Material Instance.

## Updating Material Parameters Collections Through Blueprints

You can also interact with Material Parameter Collections through Blueprints. This is an extremely powerful tool, as it means players can manipulate the appearance of a Material during game play. The example below demonstrates how to change the **EmissivePower** of the two Materials in response to a keystroke. At runtime, pressing the **B** key will make the emissive value brighter, and pressing the **D** key will make it dimmer. Releasing either key sets the parameter back to its original value of **1**.

- In the toolbar above the main Editor viewport, expand the **Blueprints** drop-down menu, and select **Open Level Blueprint** from the list. [image: Open Level Blueprint]

- **Right-click** in the Level Blueprint and search for **keyboard event**. Add a **B** Keyboard Event from the context menu. Repeat this action and add a **D** Keyboard Event. [image: B and D Keyboard Event nodes]

- **Right-click** in the Level Blueprint and add a **Set Scalar Parameter Value** node to the Blueprint. Use the **Collection** drop-down menu to reference your ***MPC_GlobalParams** Material Parameter Collection. [image: Collection drop-down menu] Use the **Parameter** drop-down to reference the **EmissivePower** Parameter. [image: Emissive Power Parameter]

- Duplicate the **Set Scalar Parameter Value Node** twice, so you have three copies in your Blueprint. Wire up the nodes so your Blueprint Graph looks like the image below. The **Pressed** output on the **B and D** Keyboard Event nodes should connect to the input on the first and third **Set Scalar Parameter Value** nodes. The **Released** outputs on both Keyboard Event nodes should connect to input on the second **Set Scalar Parameter Value** node. [image: Blueprint Graph completed]

- The final step is to set a **Parameter Value** for the **EmissivePower** in response to each Keyboard Event. In this example, when the **B** key is pressed, the **EmissivePower** increases to **50**. When the **D** key is pressed the **Emissive Power** decreases to **0.05**. When both keys are released, the Parameter is set to its original value of **1**. [image: EmissivePower values]

- Click **Compile** in Blueprint Editor toolbar to compile the Level Blueprint. You can now test the changes in-game.

- Click the **Play in Editor** icon in the Editor toolbar, and test the Blueprint by pressing and releasing the **B** and **D** keys. The results are shown in the video below.

## Limitations and Performance Characteristics

A Material can reference, at most, two different MaterialParameterCollections. One is typically used for game-wide values
while the other can be used for level specific parameters. A collection can have up to 1024 scalar parameters and 1024 vector
parameters.

Modifying the number of parameters in a collection will cause a recompile of all Materials that reference that collection.
If you need to add numerous parameters, it can be faster to add a lot of parameters up front in an empty map.

If you rename a parameter, any Materials referencing that parameter will continue to work as expected. However, any Blueprint
referencing that parameter will now be broken. You must reassign the ParameterName of the Blueprint function which operates on
the collection to fix this.

Updating values in a MaterialParameterCollection is much more efficient than setting many different parameters
on various Material instances.

- materials
- rendering

On this page

- Creating and Editing Material Parameter Collections (-> using-material-parameter-collections-in-unreal-engine)
- Using Material Parameter Collections in Materials (-> using-material-parameter-collections-in-unreal-engine)
- Testing the Material Parameter Collection (-> using-material-parameter-collections-in-unreal-engine)
- Updating Material Parameters Collections Through Blueprints (-> using-material-parameter-collections-in-unreal-engine)
- Limitations and Performance Characteristics (-> using-material-parameter-collections-in-unreal-engine)

Related documents

Material Editor Guide

 [image: Material Editor Guide] (-> unreal-engine-material-editor-user-guide)Creating and Using Material Instances

 [image: Creating and Using Material Instances] (-> creating-and-using-material-instances-in-unreal-engine)

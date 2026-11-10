# Creating and Using Material Instances

https://dev.epicgames.com/documentation/en-us/unreal-engine/creating-and-using-material-instances-in-unreal-engine?application_version=5.9

> Guide for setting up and using Material Instances.

[image: Creating and Using Material Instances]

Creating and editing standard Materials in Unreal Engine can be a time consuming process. To help speed up and streamline the Material creation workflow, Unreal Engine offers a special type of Material called a **Material instance**. This tutorial demonstrates how to set up and use Material instances in your projects.

## Material Instancing

Material instancing is a way to create a parent Material that you can use as a base to make a wide variety of different looking children (Material instances).

To achieve this flexibility, Material instancing (-> instanced-materials-in-unreal-engine) uses a concept called **inheritance:** the properties of the parent Material are passed to its children. Properties that are designated as **parameters** in the parent Material are exposed to artists in the **Material Instance Editor**.

 [image: Material Instance Editor]

Using Material instances, you can create numerous variations from a single base Material:

 [image: Three Material instances]

### Creating Material Instances is a Two Step Process

- First create a **parameterized** Material that you will use as the parent Material for your instances.

- Create a **Material Instance Constant** in the Content Browser. You can then customize the Material in the Material Instance Editor.

For additional background information about Material instancing, read the overview here (-> instanced-materials-in-unreal-engine).

## Creating a Parameterized Material

A Material instance inherits all the attributes of its parent Material, but not all of these attributes can be customized in the Material Instance Editor by default.

To make Material attributes editable in a Material instance, you must designate certain attributes as **parameters** by using parameter nodes instead of regular Material Expressions (-> unreal-engine-material-expressions-reference).

There are two ways to add parameter nodes to your Material graph.

### Adding Parameter Nodes from the Material Palette

If you search for the word "parameter" in the **Material Palette**, or from the right-click menu in the Material Editor, you can find all of the parameter nodes that are available.

You can drag and drop these parameter nodes from the Palette or select them in the right-click menu to add them to your Material graph.

 [image: Material Expression palette and context menu]

Parameters in the right-click menu (left) and the Materials Palette (right).

#### Parameter Shortcuts

Two of the most commonly used Material parameters have keyboard shortcuts in the Material Editor:

- **Scalar Parameter** - Hold the **s key** and **left-click** in the Material graph to place a Scalar Parameter. A Scalar Parameter is the parameterized version of a Constant, and contains a single numeric value.

- **Vector Parameter** - Hold the **v key** and **left-click** in the Material graph to place a Vector Parameter. A Vector Parameter is the parameterized version of a Constant 4 Vector and contains four floating-point values.

Use the shortcut or palette to place a Scalar parameter in your Material graph:

 [image: Roughness scalar parameter]

Name the parameter **Roughness** and connect it to the corresponding Material input (-> material-inputs-in-unreal-engine).

#### Default Value and Value Range

If you want to set a default value for the parameter or limit the value range, you can do so in the Details panel.

 [image: Default values Roughness]

For example, the Roughness input accepts a value from 0 to 1. To make sure the Roughness parameter always stays within this expected range, set the **Slider Min** and **Slider Max** values to 0 and 1.

If you want a default Roughness value other than 0, enter it in the **Default Value** field.

Select the Roughness parameter and press **Ctrl+D** to duplicate the node. Rename the second scalar parameter **Metallic** and connect it to the appropriate input. Your graph should now look like this:

 [image: Metallic and Roughness parameters]

### Converting a Node into a Parameter

You can also convert standard Material Expressions into parameters within an existing Material graph.

For the sake of demonstration, place a **Constant3Vector** node in your Material graph. This is a standard (non-parameterized) Material expression, which is often used to define the Base Color of a Material.

 [image: Insert Constant3 Vector]

To convert this node into a parameter, **right-click** the node and choose **Convert to Parameter** from the contextual menu.

 [image: Convert to parameter]

Remember to give the parameter a unique, descriptive name like BaseColor. The naming field is selected automatically when you convert a node.

 [image: Rename parameter in details panel]

You can change the color in the **Default Value** field shown above, or you can double click the BaseColor node to open the color picker.

 [image: Color picker interface]

You cannot parameterize every Material node in Unreal Engine, but the **Convert To Parameter** option is available from the right-click menu for any Material expression that can be parameterized.

### Parameterized Material Example

Your Material graph should now contain a Vector parameter plugged into BaseColor and two Scalar parameters, plugged into the Metallic and Roughness inputs:

 [image: Parameterized Material example]

These three parameters will allow you to change the color, roughness, and metallic properties of the Material once you create a Material instance.

Click **Apply** in the upper left corner of the Material Editor (-> unreal-engine-material-editor-ui) to compile the Material, and then click **Save**.

 [image: Compile Material]

## Creating a Material Instance

Now that you have a simple parameterized Material, you can create Material instances and customize them in the Material Instance Editor (-> unreal-engine-material-instance-editor-ui).

To create a Material instance, right-right click your Material in the Content Browser and choose **Create Material Instance** from the menu.

 [image: Create Material Instance]

Your Material instance will derive its name from the Material that you are using to create it. You can rename the Material instance by selecting it and pressing **F2** or by **single-clicking** the name field.

 [image: Rename Instance]

## Editing a Material Instance

**Double-click** the Material instance in the Content Browser to open the **Material Instance Editor**.

 [image: Open Material Instance]

The Material Instance Editor is the interface where you can customize Material parameters to produce different looking variations of your parent Material.

A Material instance in the Material Instance Editor.

### Adjusting Material Parameters

Material Parameters are found in the Details panel on the right side of the Material Instance Editor. Note that these parameters take their names from the parameter nodes in your original Material graph.

Use the following steps to edit a parameter:

 [image: Override Material Parameters]

- Place a check in the box next to the parameter to enable it for editing.

- Type a new value in the field or left-click and drag to slide the value up and down. For Vector parameters, left-click the color swatch to activate the color picker.

- To reset a parameter to its default value, click the arrow icon pictured here.

As you adjust parameters, the Material preview will update in real-time in the Material Instance Editor, and in the Level if the Material is currently applied to any Actors.

## Using Parameter Groups

You can sort your parameters into **Parameter Groups** to improve the organization and readability of your Material instances.

While the above example with only three parameters is easy to read, heavily parameterized master Materials can be inefficient to interact with if you do not use parameter groups.

The slider below shows a Material instance with and without groups. In the example without parameter groups, scalar parameters appear in a single unorganized list. The instance with parameter groups is neatly organized by Material attribute.

 [image: Material Instance without Parameter Groups]

 [image: Material Instance with Parameter Groups]

### How to Use Parameter Groups

Parameter groups are configured within the parent Material, not within the Material instance. This is done in the details panel of the Material Editor.

Select a Material parameter node in your Material graph.

 [image: Color tint Vector 3 Parameter]

In the Details panel, type a name into the **Group** field. You can name your groups however you wish, but one suggestion is to group parameters by the Material attribute they control.

 [image: Base color parameter group]

Once you assign a parameter group name to one Material parameter expression, that name will appear in the drop-down menu next to the Group field.

For the rest of your parameters, you can either type in new group names or select one of the existing parameter groups from the drop-down menu.

 [image: Select existing parameter group]

### Ordering Parameters Within Groups

You can use the **Sort Priority** field to change the order that parameters are listed within a group. By default all parameters are listed alphabetically, which can lead to clumsy or inefficient ordering in the Material Instance Editor. In the slider below, the UV tiling and offset controls are broken up when listed alphabetically, but by assigning a sort priority value to each parameter the experience is improved.

 [image: Alphabetical parameters]

 [image: Reordered parameters]

To change order of a parameter, select the node and enter a new value in the **Sort Priority** field in the Details Panel.

 [image: Parameter group sort priority]

### Ordering Parameter Groups

By default, parameter groups appear alphabetically in the Material Instance Editor.

There are two ways to change the order of your parameter groups. One solution is to simply add numbers to your group names.

The Megascans parent Material uses this approach, with parameter groups numbered from **00 – 07**.

 [image: Megascans Parameter Groups]

This allows the parameter groups to display in the same order they appear in the Main Material Node.

#### Group Sort Priority

You can also use the **Group Sort Priority** property in the details panel to change the order of your parameter groups. This property is found in the parent Material, not in the Material Instance.

- Deselect all nodes in the Material Graph to access its Material Properties.

- In the Details Panel, expand **Group Sorting**, and then **Parameter Group Data.**

- The array in this section lists all the parameters in your Material. Expand each Index and change the **Group Sort Priority** to modify the order of the groups. [image: Group Sort Priority]

## Changing the Parent Material of a Material Instance

You can easily change the parent Material used by a Material instance, in the Material Instance Editor.

To change the parent Material, open a Material instance in the Material Instance Editor. Under the **General** section in the Details panel, find the **Parent** property.

 [image: Parent Material Field]

Use the drop-down menu to search for and select a different parent Material. You can also select a Material in the Content Browser and click the **Use Selected Asset in Content Browser button** (left-facing arrow).

Note that if you change the parent Material it can completely change the appearance and properties of the Material instance. The parameters you were using before may no longer be available in the new parent.

 [image: Change parent Material]

For example, if you select the **M_Metal_Gold** Material from the drop-down list, the three parameters that were present in the **M_Parameterized** example (roughness, metallic, base color) are no longer available in the gold instance.

 [image: New parent Material]

## Conclusion

Material Instancing is a powerful tool that you can use across all aspects of your project.
From helping to add some variation to weapons and props, to helping artists make better use of available Materials,
Material Instances can help to streamline and unify how Materials are created and used in your project.

- materials
- shaders

On this page

- Material Instancing (-> creating-and-using-material-instances-in-unreal-engine)
- Creating Material Instances is a Two Step Process (-> creating-and-using-material-instances-in-unreal-engine)
- Creating a Parameterized Material (-> creating-and-using-material-instances-in-unreal-engine)
- Adding Parameter Nodes from the Material Palette (-> creating-and-using-material-instances-in-unreal-engine)
- Parameter Shortcuts (-> creating-and-using-material-instances-in-unreal-engine)
- Default Value and Value Range (-> creating-and-using-material-instances-in-unreal-engine)
- Converting a Node into a Parameter (-> creating-and-using-material-instances-in-unreal-engine)
- Parameterized Material Example (-> creating-and-using-material-instances-in-unreal-engine)
- Creating a Material Instance (-> creating-and-using-material-instances-in-unreal-engine)
- Editing a Material Instance (-> creating-and-using-material-instances-in-unreal-engine)
- Adjusting Material Parameters (-> creating-and-using-material-instances-in-unreal-engine)
- Using Parameter Groups (-> creating-and-using-material-instances-in-unreal-engine)
- How to Use Parameter Groups (-> creating-and-using-material-instances-in-unreal-engine)
- Ordering Parameters Within Groups (-> creating-and-using-material-instances-in-unreal-engine)
- Ordering Parameter Groups (-> creating-and-using-material-instances-in-unreal-engine)
- Group Sort Priority (-> creating-and-using-material-instances-in-unreal-engine)
- Changing the Parent Material of a Material Instance (-> creating-and-using-material-instances-in-unreal-engine)
- Conclusion (-> creating-and-using-material-instances-in-unreal-engine)

Related documents

Material Editor UI

 [image: Material Editor UI] (-> unreal-engine-material-editor-ui)Material Inputs

 [image: Material Inputs] (-> material-inputs-in-unreal-engine)Essential Material Concepts

 [image: Essential Material Concepts] (-> essential-unreal-engine-material-concepts)

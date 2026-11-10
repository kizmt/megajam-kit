# Blueprint Variables

https://dev.epicgames.com/documentation/en-us/unreal-engine/blueprint-variables-in-unreal-engine?application_version=5.9

> Properties that hold a value or reference an Object or Actor in the world.

[image: Blueprint Variables]

**Variables** are properties that hold a value or reference an Object or Actor in the world. These
properties can be accessible internally to the **Blueprint** containing them, or they can be made
accessible externally so that their values can be modified by designers working with instances
of the Blueprint placed in a level.

Variables are displayed as rounded boxes that contain the name of the variable:

 [image: Variable Nodes]

## Variable Types

Variables can be created in a variety of different types, including data types - such as Boolean, integer, and float - as well as reference types for holding things like Objects, Actors, and particular Classes.
Arrays of each variable type can also be created. Each type is color coded for easy identification:

| Variable Type | Color | Example | Represents |
| --- | --- | --- | --- |
| **Boolean** | Maroon |  | True or false value (`bool`). |
| **Byte** | Sherpa blue |  | Whole number value between 0 and 255 (`unsigned char`). |
| **Integer** | Sea green |  | Whole number value between −2,147,483,648 and 2,147,483,647 (`int`). |
| **Integer64** | Moss green |  | Whole number value between −9,223,372,036,854,775,808 and 9,223,372,036,854,775,807 (`long`). |
| **Float** | Yellow green |  | Number value with a decimal such as 0.0553, 101.2887, and -78.322 (`float`). |
| **Name** | Mauve |  | Piece of text used to identify something in the game. |
| **String** | Magenta |  | Group of alphanumeric characters such as `Hello World` (`string`). |
| **Text** | Pink |  | Text that you display to users. Use this type for text that you want to localize. |
| **Vector** | Gold |  | Set of three numbers (X, Y, and Z). This type is useful for 3D coordinates and RGB color data. |
| **Rotator** | Cornflower blue |  | Group of numbers that define rotation in 3D space. |
| **Transform** | Orange |  | Set of data that combines translation (3D position), rotation, and scale. |
| **Object** | Blue |  | Blueprint objects such as Lights, Actors, StaticMeshes, Cameras, and SoundCues. |

## Variables in the My Blueprint Tab

The **My Blueprint** tab allows custom variables to be added to the Blueprint and lists any existing
variables, including component instance variables added in the Components List (-> components-window-in-unreal-engine)
or variables created by promoting a value to a variable in the graph.

 [image: My BLueprint Pane]

### Public Variables

To allow a variable to be modified from outside its Blueprint, make it public.

By default the eye is closed (private); select the eye to open it and make it public. You can also select or clear the **Instance Editable** box to make the variable private or public.

After you've made the variable public, you can modify its value from the **Details** panel of the Main Editor window.

Above, the variable **LightColor** has been set to Editable and we can now set this value in the **Details** panel of the Level Editor.

### Variable Tooltips

You can also add a **Tooltip** for your variables that will appear when mousing over the variable in the editor.

You can add the **Tooltip** from the **Details** panel of the variable. When doing so, if the variable is set to **Public**, the Eye Icon will change from yellow to green indicating that a Tooltip has been written for the variable.

### Expose on Spawn

**Expose on Spawn** enables you to set if the variable should be accessible at the time of spawning the Blueprint it sits in.

Above we have a variable called **LightColor** which is a Linear Color property that is set to **Expose on Spawn**. This variable is implemented in a Blueprint for a Point Light that uses the **Set Light Color** node and the **LightColor** variable to determine the color the light should be.

Below, inside a different Blueprint, a script is used to spawn the Point Light Blueprint and since the **LightColor** variable was set to Expose on Spawn, the option to set the value is made available on the **Spawn Actor from Class** node, allowing us to set its color when the light spawns in the game world.

### Private Variables

With the **Private** option checked on a variable, this prevents the variable from being modified from external Blueprints.

For example, we have a variable below that is not set to private:

Inside another Blueprint, we spawn the Blueprint that contains the variable, then off the **Return Value** we can access our variable.

If we were to set it Private however:

And spawn the Blueprint again and try to access that variable, we cannot.

### Expose to Cinematics

If you want the value of your variable to be affected by **Sequencer**, select **Expose to Cinematics**.

To learn more about the sequencer, see Real-Time Compositing with Sequencer (-> real-time-compositing-with-sequencer-in-unreal-engine).

## Promoting to Variable

You can also create variables by using **Promote to Variable**.

Right-click any input or output data pins on a Blueprint node and select **Promote to Variable**.

By right-clicking the **New Light Color** pin and selecting **Promote to Variable**, we can assign a variable as the **New Light Color** value.

Alternatively, you can drag off an input or output pin and select **Promote to Variable**.

## Accessing Variables in Blueprints

When working with variables in Blueprints, you will access them in one of two ways: by using the **Get** node (referred to as a Getter) to get the value of the variable or by using the **Set** node (referred to as a Setter) to set the value of the variable.

You can create a **Set** node (1 above) or **Get** node (2 above) for a variable by right-clicking in the graph and typing either **Set (variable name)** or **Get (variable name)**. Another method you can use is to hold down the **Ctrl** key and drag in the variable from the **MyBlueprint** window to create a **Get** node or hold down the **Alt** key and drag in the variable from **MyBlueprint** window to create a **Set** node.

## Editing Variables

Variable values can be set either as a part of the Blueprint node network or as a default value prior to execution. To set variable default values:

- Click **Class Defaults** on the Blueprint Editor Toolbar to open the Defaults in the **Details** panel.

- In the **Details** panel, enter the desired default values to the right of your variable name. Above, we highlight our Color variable in which we can set its default color.

If you do not see your variable listed in the defaults, make sure to click **Compile**.

### Renaming Variables

To rename a variable:

- Right-click the variable name in the **My Blueprint** tab and select **Rename** in the menu that appears.

- Type the new variable name in the text box and then press **Enter**.

### Variable Properties

You can set all the properties for a variable in the **Details** panel. Some variables may have more properties than those shown here, such as **Expose to Cinematics** for Vectors or a **Slider Range** for numeric variables like Integers or Floats.

| Property | Description |
| --- | --- |
| **Variable Type** | Set the variable type in the dropdown menu and determine whether or not the variable is an array. |
| **Instance Editable** | Set whether or not it is possible to edit the value of the variable in the **Class Defaults** and the Blueprint's **Details** tab. |
| **Tooltip** | Set the tooltip for the variable. |
| **Private** | Set whether or not this variable should be private and not modified by derived Blueprints. |
| **Category** | Choose from an existing category or type a new Category name. Setting the Category determines where the variable appears in the **Class Defaults**, the **My Blueprint** tab, and the Blueprint's **Details** tab. |
| **Replication** | Choose if the variable's value should or should not be replicated across clients, and if the value is replicated, if there should be a notification by way of a callback function. |

### Advanced Variable Properties

| Property | Description |
| --- | --- |
| **Config Variable** | Read its default value from a config file if it is present? Use this option to customize variable default values and behavior between different projects and configurations. |
| **Transient** | Not serialize and be zero-filled at load. |
| **SaveGame** | Be serialized for saved games. |
| **Advanced Display** | Be hidden in Class Defaults windows by default. |
| **Multi line** | Be capable of displaying multiple lines. To add a new line while editing the variable, press Shift+Enter. This option applies only to **String** and **Text** variables. |
| **Deprecated** **Deprecation Message** | Be deprecated. Any nodes that reference the variable will produce a compiler warning indicating that it should be removed or replaced. (Optional) You can specify a message to include with the warning. For example: `X is no longer supported. Please use Y instead.` |

### Getting and Setting Variable Values

Variables can also be edited as a part of your Blueprint network by way of Get and Set nodes. The easiest way to create these is by dragging a variable from the Variables tab directly into the Event Graph. A small menu will appear asking if you would like to create a Get or Set node.

#### Get Nodes

Get nodes supply portions of the network with a variable value. Once created, these nodes can be plugged into any node that takes the appropriate type.

#### Set Nodes

Set nodes enable you to change the value of a variable. Note that these must be called by an execution wire in order to execute.

| **Shortcuts when dragging from the My Blueprint tab** |  |
| --- | --- |
| **Ctrl-drag** | Creates a Get node. |
| **Alt-drag** | Creates a Set node. |

- blueprints
- blueprint
- data types

On this page

- Variable Types (-> blueprint-variables-in-unreal-engine)
- Variables in the My Blueprint Tab (-> blueprint-variables-in-unreal-engine)
- Public Variables (-> blueprint-variables-in-unreal-engine)
- Variable Tooltips (-> blueprint-variables-in-unreal-engine)
- Expose on Spawn (-> blueprint-variables-in-unreal-engine)
- Private Variables (-> blueprint-variables-in-unreal-engine)
- Expose to Cinematics (-> blueprint-variables-in-unreal-engine)
- Promoting to Variable (-> blueprint-variables-in-unreal-engine)
- Accessing Variables in Blueprints (-> blueprint-variables-in-unreal-engine)
- Editing Variables (-> blueprint-variables-in-unreal-engine)
- Renaming Variables (-> blueprint-variables-in-unreal-engine)
- Variable Properties (-> blueprint-variables-in-unreal-engine)
- Advanced Variable Properties (-> blueprint-variables-in-unreal-engine)
- Getting and Setting Variable Values (-> blueprint-variables-in-unreal-engine)
- Get Nodes (-> blueprint-variables-in-unreal-engine)
- Set Nodes (-> blueprint-variables-in-unreal-engine)

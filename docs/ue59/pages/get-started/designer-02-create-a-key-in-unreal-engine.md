# Create a Key

https://dev.epicgames.com/documentation/en-us/unreal-engine/designer-02-create-a-key-in-unreal-engine?application_version=5.9

> Using blueprints, learn how to create a key that players can pick up.

[image: Create a Key]

In this section, you’ll create your first gameplay object: a Key Blueprint.

To create the functionality for gameplay objects in your level, you’ll use Blueprint Visual Scripting (-> blueprint-foundations). Blueprints in Unreal Engine are assets with a physical representation and special functionality, like the player being able to pick them up.

The Blueprint Visual Scripting system can be used to create functionality without writing code, as you are using a node-based interface to create a gameplay object’s behavior.

First, you’ll define the key’s in-game actor, adding components that let you configure keys to appear in three different variations: a yellow oval, a blue rectangle, or a red cone. Instead of making separate assets for each variation, Blueprints let you build all of these options into one asset.

Next, you’ll add the key’s behavior — the ability for the player character to pick it up. Picking up objects is one of the most common gameplay mechanics.

Here's an overview of all of the assets you'll make to create a key with three different appearance options and allow a player character to pick up the key:

## Before You Begin

Make sure you understand the following topics, covered in previous sections of Design a Puzzle Adventure (-> design-a-puzzle-adventure-game-in-unreal-engine):

- Unreal Editor UI, such as the **Content Browser (-> BlueprintAPI) **and **Viewport (-> BlueprintAPI)**.
- An understanding of Blueprints. See the Blueprint Foundations (-> blueprint-foundations) documentation for more information.

You’ll need the following assets from Project Setup and Level Blockout (-> designer-01-project-setup-and-level-blockout-in-unreal-engine):

- A level with blocked-out rooms.

## Define Key Types and Key Attributes

Before you create the key blueprint, you’ll define some key data that the blueprint will use to create the red, yellow, and blue variations.

To represent the different types of keys used in your game, you’ll use both an **Enumeration **and a **Structure**.

| Asset Type | Description |
| --- | --- |
| **Enumerations** | Also known as **enums**, store a list of unique values that you can use across your project. For the key, you will use an enum to define the different key types you can choose from (yellow oval, blue rectangle, red cone). |
| **Structures** | Also known as **structs**, are used to group related information together. For the key, you will use a struct to hold all of the key’s attributes: a mesh (3D model), and material color (red, yellow, blue) to apply to that mesh. |

Each enumerator acts like a label on a container, and the struct is like the contents of each container.

### Define Key Types in an Enum

First, create an Enumeration asset that defines your key variants: Red, Yellow, and Blue.

To create an enum asset, follow these steps:

- Open the **Content Browser**, or a **Content Drawer**,** **by using the **Content Drawer **button in the bottom-left corner of Unreal Engine.
- Create a place to store the blueprints and supporting assets you’ll create in this tutorial. Go to the **Content > AdventureGame > Designer** folder. Right-click in this folder and click **New Folder**.
- Name the new folder `Blueprints`.
- In the **Blueprints **folder, create another folder named `Core`.
- Right-click in the **Core **folder, go to **Blueprint**, and click **Enumeration **from the Create Asset menu. Name the new asset `Enum_KeyType`.[image: Creating an Enumerator]
- Double-click the asset to open it in a new window.

The Enumeration contains a list of Enumerator options.

To add key types to the enum, follow these steps:

- Click the **Add Enumerator **button three times to add three new enums to the list.
- Change the first enumerator’s **Display Name **to `Blue`. Change the second one to `Yellow`, and the third one to `Red`.[image: Add Enumerator]
- Save the enum asset file by clicking the **Save **button in the top-left corner of the window. Alternatively, use **CTRL + S**.

When you add an enumerator, you are adding an option to the list. Blue, Yellow, and Red are all values you’ll use to distinguish between the different key types.

In comparison to blueprints, you don’t have to compile **data assets **since you are not compiling any functionality.

### Define Key Attributes in a Struct

Next, create a struct that defines the attributes that distinguish each key type: a mesh shape and a color.

To build a Structure (struct) asset, follow these steps:

- Go to the **Content Browser **again and make sure that you are still in the **Content > AdventureGame > Designer > Core** folder.
- Right-click anywhere in the **Core **folder, go to **Blueprint**, and click **Structure**. Name this asset `Struct_KeyData`.[image: Create a Struct]
- Double-click the new asset to open it in a new window with the struct’s properties.
- The struct will have a variable by default, named **MemberVar_0**. Click **Add Variable **to add a second variable.
- Change the first variable’s name to `Key Material` and the second variable to `Key Mesh`.
- Each variable has a data **type **assigned to it. This is set to Boolean (a true or false value) by default. You need to change the type of both variables.For the **Key Material** variable, click the dropdown that says **Boolean**. Enter `material instance` into the search field, hover over **Material Instance**, and select **Object Reference**. [image: Material Instance Actor]
- Repeat these steps to change the variable type of **Key Mesh **to **Static Mesh > Object Reference**. [image: Static Mesh]
- **Save **the struct asset file.

[image: Struct Key Data]

You have now created two attributes that each key type will use — a Key Material that will set the key color, and a Key Mesh that will set the key shape.

You’ve finished defining what sort of data the key has. Next, you’ll set up the key’s colors and then actually build each key type.

## Create Key Colors

Now that you have the data for blue, yellow, and red key types, you’ll create **Materials **with corresponding colors that you’ll assign to each key type.

In Unreal Engine, a **Material **defines how a surface looks. It controls things like color, texture, shininess, transparency, and more. A **Material Instance **is a copy of a material that uses the material as a foundation, but can override specific settings like colors or textures, without needing to create a brand new material from scratch.

In this example, you will create a base **Material **that defines attributes for all keys in the game. Then, you will create two **Material Instances **of that material to copy all attributes but override the colors.

This section briefly guides you through creating some materials so you can use them throughout this tutorial series; Materials are not explained in detail.

To create a colored Material asset, follow these steps:

- Go to the **Content Browser**. Navigate to the **Content > AdventureGame > Designer **folder.
- Right-click in the **Designer **folder and click **New Folder**. Name this folder `Materials`.
- Go to the **Materials **folder. Right-click in the folder and select **Material **to create a material asset.[image: Creating a Material]
- Change the name of the material asset to `M_BasicColor`.The tutorial’s sample level uses the `M_` prefix as a naming convention to identify materials.
- Double-click the Material to open it. This opens the **Material Editor **in a new window.

The **Material Editor **is a node-based editor, meaning that it’s built with some similarities to Blueprint Visual Scripting. You should see a node called **M_BasicColor**, which is the main node that you can use to change the properties of this material.

[image: Material Window]

The **Base Color** property sets the color of this material. You can click the gray color swatch next to **Base Color **to manually set the color.

Instead of using the color picker, you’ll create a **Color **parameter node that you can override in each material instance, therefore making one material that can become many colors. Creating a parameter is like adding a variable — it turns the material color into an editable parameter in a Material Instance.

To create a color parameter node, follow these steps:

- Next to **Base Color**, you will see a **pin**. Click the pin and drag to an empty area of the graph. [image: Base Color Material]
- In the dropdown list, type `VectorParameter` into the search field, and select **VectorParameter**.This will create a new node that has a color picker. A vector-type variable has three values so you can use it to define the RGB values of a color.
- The node’s default name, **Param**, is highlighted when you first create the node. Rename the node **Color **to make it easier to identify in your Material Instances.If Param isn’t highlighted, click the node, then click the node name to rename it.
- On the new **Color **node, click the checkered square next to **Default Value **to open a color picker.[image: Checkered Box on the Color Parameter]
- In the Hex sRGB field, change the value to `F7DE0000`, a yellow color, and click OK. [image: Color Picker]
- **Save **and close the Material asset.

Next, you’ll create Material Instances to add more colors without having to recreate the main material.

To create three Material Instances for your key colors, follow these steps:

- In the **Content Browser**, right-click the `M_BasicColor` asset you created. Near the top of the context menu, click **Create Material Instance**.
- Name the material instance asset `M_BasicColor_Red`. Double-click the asset to open it.[image: Material Instance Window]You’ll notice this window is different from the Material Editor. This is because a **Material Instance **does not need the full editing suite of a **Material **— instead, it focuses on modifying parameters you defined in the base **Material**.
- In the **Details **panel, under the **Parameter Groups **at the top, expand **Global Vector Parameter Values**.[image: Global Vector Parameter Values]
- You will see a disabled **Color**, which is the VectorParameter node you added to the base material. Click the checkbox next to Color to enable and override it.[image: Global Vector Parameter Values Color Heading]
- Click on the color swatch next to Color and set the **Hex sRGB **value to `F7005A00`. This changes the material instance to a beautiful, hot-red color!
- It’s your turn to lead the way! Repeat this process to create two more Material Instances: Create a Material Instance named `M_BasicColor_Blue`. Override the Color with **Hex sRGB** = `00AFF700` and **Save **the asset.
- Create a Material Instance named `M_BasicColor_Yellow`. Keep the base material color, and **Save **the asset.

Material Instance parameters inherited from a Material asset always use the parent material’s values unless you override them. For example, if you open the `M_BasicColor` material and change its color, the `M_BaseColor_Yellow` material instance would also change color; however, the Blue and Red material instances would keep their colors.

## Build the Key Blueprint

Now that you’ve got all the pieces you need, it’s time to create the Key Blueprint. The Key Blueprint is the asset that you can add to a level to create an instanced actor of it, which has the functionality to be picked up by the player.

To create a new blueprint class for your key, follow these steps:

- Go to the **Content Browser **and navigate to the **Content > AdventureGame > Designer > Blueprints** folder.
- Create a new folder named `Key`.
- Go to the **Key **folder. Right-click in the folder and select **Blueprint Class**.
- Select **Actor **as the parent class.[image: Pick Parent Class]
- Name this new actor ****`**BP_Key**` and double-click to open it.The tutorial’s sample level uses the `BP_` prefix as a naming convention to identify blueprint classes.

The **Actor **parent class is commonly used for an object that can be placed in a level — it doesn’t come with additional features like movement, like in the Character parent class, but it can be used to build interactions and logic.

To dock a window in the main editor, drag its tab next to your level’s tab.

Docking Blueprint Editor Window

You need to add a few things to our Key blueprint to make it function properly:

- A static mesh to visually represent the key in your project.
- A collision volume that detects when the player is close enough to pick up the key.
- A way to know what type of key it is.
- Game logic to determine what happens when the player collides with the key.

Collision is the detection of two objects coming into contact at runtime. Box, capsule, and sphere collisions are shapes used to make these detections.

### Set up the Key’s Components

First, set up the key’s components so you have something to place and interact with in the game world.

To add a collision component and mesh shape to the key, follow these steps:

- In `BP_Key`, go to the **Viewport **tab.
- In the **Components **panel in the top-left corner, click **Add **and search for and select **Capsule Collision**.[image: Capsule Collision Component]This is the collision volume that the player can touch to pick up the key. Without this, the player wouldn’t be able to detect the key. You could add collision to the key mesh itself, but using a collision shape helps even out complex geometry, improving collision detection and game performance.
- Select the **Capsule **component and click **Add **again. This time, search for and select a **Sphere **basic shape, and rename it `KeyMesh`. By selecting the **Capsule **component and then adding the **Sphere **mesh, the mesh becomes a child of the **Capsule**, and the **Capsule **is the parent of the mesh. The child component inherits all properties from the parent.
- Set up the **KeyMesh **component:Select the **KeyMesh **component. In the **Details **panel, go to the **Transform **category. Next to **Scale**, change the values to `0.3` , `0.3`, and `1.0`. [image: Key Mesh Scale]This shrinks the sides of the mesh into an oval shape.
- Under the **Collision **category, set **Collision Presets **to **NoCollision**.[image: Collision Presets]You’ve added collision with the Capsule component, so this turns off collision on the mesh, ensuring the player character can smoothly collect the key without bouncing off the static mesh.

- Set up the Capsule component:Select the **Capsule **component. In the **Details **panel, under the **Transform **category, set the **Location **to `0.0`, `0.0`, `80.0`. This makes the key float above the ground. The mesh moves with the capsule because the mesh is a child component that inherits all properties from its parent component.
- Under the **Shape **category, set the **Capsule Half** **Height** to `60.0`. This stretches the collision volume to better surround the mesh.

- In the **Components **panel, select the **DefaultSceneRoot**. Click **Add**, and select **Rotating Movement**. This slowly spins your key to make it more interesting to the player.[image: Rotating Movement]
- **Save **and **Compile **the blueprint.

### Set Up the Key’s Properties

Your key also needs to store information, like what type of key it is, and what materials and meshes correspond to each type of key.

To set this up, you’ll use the Key Type enum and Key Data struct that you created earlier.

To add a key type variable to the blueprint, follow these steps:

- Under the **Components **panel, you will see a **My Blueprint **panel. In the **Variables **section, click the plus (**+**) button to add a new variable.
- Name the variable `KeyType`.
- By default, its type is **Boolean**. Click the type dropdown, search for **Enum Key Type**, and select it. This variable type is the enum that you created earlier — so it’s time to use it! Here, it means the **KeyType** variable can be set to **Red**, **Yellow**, or **Blue**.In blueprints, the variable type is also called the **pin type** because variables appear as pins in nodes.
- Click the **Eye **next to the **KeyType **variable to make it a public and editable variable. This is important to do so you can edit the value of this variable in the Unreal Editor later and set the type of each key in your level.[image: Key Type Variable]
- Click **KeyType **to select it. In the **Details **panel, next to the **Category **property, delete **Default **and enter `Setup`. This makes the KeyType property appear in the **Details **panel under a category named **Setup**.[image: Key Type Blue]

Each key type should have a shape and color combination. In the next step, you’ll create a Map variable to define these combinations.

To set up a variable that maps key types to shapes and colors, follow these steps:

- In the **My Blueprint **panel, add a new variable named **KeyMap**, also of type **Enum Key Type**.
- With the **KeyMap **variable selected, in the **Details **panel, next to the type dropdown, there’s another menu that sets the variable’s **container type**, or how many values the variable holds. Change the container type to **Map**.[image: Set Variable Container Type]
- When you set the **Map **container, another type dropdown appears next to the container type. This is the type of data stored in each map option. You defined this key data earlier in a struct, so click the dropdown and set the data type to **Struct_KeyData**.
- **Compile **the blueprint so you can populate the KeyMap with materials and mesh shapes, setting up a material-mesh pair for each KeyType option.
- In the **Details **panel, go to the **Default Value **category.
- Next to **Key Map**, click the **+ **button to add a new **element **to the map.
- Change the **Key Type** from **Blue **to a different color. If you don’t do this, you might not be able to add a new element since an element with the default Key Type already exists.
- Repeat this two more times to create second and third elements.
- With your three map elements added, set up your key types with the following values: | Key Type | Key Material | Key Mesh |
| --- | --- | --- |
| Red | `M_BasicColor_Red` | Cone |
| Yellow | `M_BasicColor_Yellow` | Sphere |
| Blue | `M_BasicColor_Blue` | Cube | There are multiple meshes named `Cube` and `Sphere` in the project. The correct `Cube` and `Sphere` meshes should appear second in the list when you search for them. When you hover over them, they should have a **Path **of /**Engine/BasicShapes** in their tooltip. [image: File Path for Cube Static Mesh]Your **KeyMap **should now look like the following: [image: Key Map Reference] Key Map Reference
- **Save **and **Compile **the blueprint.

Finally, you need a variable that stores a reference to the player character when they touch the key.

To create a variable that stores a reference to another actor, follow these steps:

- Under the **Variables **section, add a new variable named `OtherActor`.
- Change its type to **Actor > Object Reference**.
- In the **Details **panel, change its **Container Type **to **Single**, since you only need to reference one actor who interacts with this key — the player.

Now, the key’s variables should look like the following:

[image: Key Variable]

### Test the Key

Give the key a test and see what it looks like so far.

Go back to your level and, in the **Content Browser**, drag `BP_Key` into your level. You’ve created a blueprint that you can add instances of to your game, and that’s worth celebrating! However, it’s still gray.

[image: BP_Key Gray]

With the key selected, go to the **Details **panel. Look for the **Setup **category you created, and find the **Key Type **property. You can change this from **Blue**, to **Yellow**, to **Red**, but it’s not changing your gray oval key yet.

This is because you’ve added components and data to your key, but those parts are not communicating with each other yet. This is where Blueprint Visual Scripting comes in — you’ll build logic (nodes and wires) to pass information around a blueprint and perform actions with that information.

## Set Key Values With a Blueprint Function

Next, you’ll create a function that connects the KeyMap options to the KeyMesh component, automatically setting the correct mesh shape and material color for a key based on its type.

A **function **is a reusable set of blueprint nodes that performs a specific task. They help keep your node graphs organized and let you execute (or “call”) the same logic multiple times without recreating it. With functions, you can trigger the execution of that part of a blueprint's logic from other blueprints.

Instead of creating the function in the key blueprint, you’ll put it in a new **Blueprint Function Library**, which is a type of Blueprint asset that stores a collection of reusable functions. These functions are not tied to a specific blueprint or actor. Instead, they’re globally accessible across your entire project. Libraries keep useful functions in one place so you don’t have to copy and paste them into multiple blueprints.

To create a Blueprint Function Library with a new function, follow these steps:

- Go to the **Content Browser** and navigate to **Content > AdventureGame > Designer > Core**.
- Right-click in the **Core **folder, go to **Blueprint**, and select **Blueprint Function Library**. Name the new asset `BPL_FPGame` and open it.[image: Create a Blueprint Function Library]
- In the **My Blueprint **panel, in the **Functions **section, you start with one new function that’s highlighted. Name it `fnBPLSetKey`.[image: Adding a New Function]The tutorial’s sample project uses a `BPL` label for functions in a blueprint library and an `fn` prefix for functions. This helps identify what SetKey is and where it comes from, and makes it easier to find the function in the node actions list.

Next, set up the function with the inputs and outputs it needs.

**Inputs **are values you pass into a function so it can do its work. They act similarly to variables. The **fnBPLSetKey **function needs to perform actions between the KeyType, KeyMap, and KeyMesh, so these should be inputs.

**Outputs **are information that the function passes back to the blueprint, usually after creating a result. The **fnBPLSetKey **function doesn’t need any outputs.

To add inputs to the **fnBPLSetKey **function, follow these steps:

- Click the **fnBPLSetKey **function to select it. In the **Details **panel, next to the **Inputs **category, click the **+ **button to create a new input.Like variables, each input has a name, variable pin type, and container type.
- Change the input’s name to `Static Mesh Array`.
- Change its type to a **Static Mesh Component > Object Reference**. In the function’s node graph, notice how the purple function entry node now has a pin with the input you created, and the style of pin reflects the type (static mesh array).
- Click the **Container Type **dropdown next to the type, and choose **Array**.[image: BPL Static Mesh Array]An **array **is a variable that stores multiple values of the same type in a single container. Each value is stored as an **array element**.
- Set up another input to match the key’s **KeyMap** property:Add another input, and name it `KeyMap`.
- Click the **Pin Type** dropdown and set it to **Enum Key Type**.
- Click the **Container Type **dropdown and select **Map**.
- Click the **Value Type **dropdown and set it to **Struct Key Data**.

- Set up a Key Type input:Add another input named `Key`.
- Set its **Container **to **Single**, and keep its type as **Enum Key Type**.

Your three inputs should now look like this:

[image: Final Inputs]

Now, you can build the function’s nodes. In the graph panel, you can see the function entry node **fnBPLSetKey **with the inputs you just created — a **Static Mesh Array**, **Key Map**, and **Key**.

Navigating the blueprint graph:

- **Pan: **Right-click and drag.
- **Zoom: **Use the mouse wheel.

To add logic to the function that sets up the keys with a new Key Mesh shape, follow these steps:

- Drag off the triangle **execution (exec)** pin of this node, search for **For Each Loop**, and select it in the node actions list. This creates a new node connected to the **fnBPLSetKey **node.With the **For Each Loop** node, you can perform some actions on each item in an array. Any logic you connect to the Loop Body execution pin runs once per array element. When the loop is done, execution continues through the Completed pin.[image: EventGraph 01]
- Drag the **Static Mesh Array** pin of the **fnBPLSetKey **node, and connect it to the **Array **pin of the **For Each Loop**.[image: EventGraph 02]The key only has one mesh, but **fnBPLSetKey **uses a static mesh array so you can use it with a variety of level objects. For example, in the next part of this tutorial series, you’ll work with the door blueprint that has two static meshes for the right and left doors.
- Next, drag the **Key Map **pin of the **fnBPLSetKey **node and search for and select a **Find** node. This node can take a Key Type and pull the corresponding mesh and material from the KeyMap.
- Right-click the **blue output** pin of the **Find **node, and click **Split Struct Pin**. [image: Find Node Split Struct Pin]This splits the output into **Key Material** and **Key Mesh**, which are the two variables in `Struct_KeyData`.
- Connect the **Key **pin of the **fnBPLSetKey **node to the turquoise **Key **pin of the **Find **node. [image: Connect Key Pin]
- Now, on the **For Each Loop** node, drag from the **Loop Body **pin and search for **Is Valid **under the **Struct **category. Add the **Is Valid** node with a question mark icon (**?**) next to it, since this is the one that you use for struct values. [image: Connect Loop Body Pin]This node checks if a valid mesh shape was passed into the function. If it is, you’ll set both the static mesh of the object and its material. If not, you’ll only set the material.
- Connect the **Key Mesh** pin of the **Find **node to the **Input Object **pin of the** Is Valid **node. [image: Connect Key Mesh Pin]
- In the **Is Valid** node, drag the **Is Valid **pin and toggle the **Context Sensitive **option to false.[image: Toggle Context Sensitive]
- Search for and add a **Set Static Mesh **node.
- From the **For Each Loop** node, drag the **Array Element **pin and connect it to the **Set Static Mesh **node’s **Target **pin.The **Target **is the entity the node will act on. You want to execute the Set Static Mesh action on the KeyMesh, so the Static Mesh Array should be the target.
- From the **Find **node, drag the **Key Mesh **pin and connect it to the **Set Static Mesh** node’s **New Mesh **pin.

The function’s graph should now look like this:

[image: EventGraph 03]

You can double-click a wire between two nodes to create an additional connector. Hover over the connector until your cursor turns into four arrows, and then drag the connector to reshape the wires. This can help you position your nodes and lines freely.

[image: Blueprint Wire Pivot]

Select a wire and press the **Q** key to straighten the wire.

You’ve set the new mesh shape on the key, now you just need to set the new material as well.

To add logic that sets up the keys with a new Key Material color, follow these steps:

- Drag the** Set Static Mesh** node’s **Exec **pin and search for the **Set Material **node (in the **Rendering > Material** category) and create it.
- Drag its **Target **pin to the **Array Element** of the **For Each Loop** node.
- Drag its **Material** pin to the **Key Material** pin of the **Find **node.[image: EventGraph 04]
- To make sure the material is set when a mesh isn’t provided, connect the **Is Not Valid** pin of the node to the **Set Material** node’s exec pin. Add two connectors to reshape the wire.
- **Save **and **Compile **the blueprint.

Your complete **fnBPLSetKey **function should now look like this:

 Blueprint

Begin Object Class=/Script/BlueprintGraph.K2Node_FunctionEntry Name="K2Node_FunctionEntry_0" ExportPath="/Script/BlueprintGraph.K2Node_FunctionEntry'/Game/AdventureGame/Designer/Blueprints/Core/BPL_FPGame.BPL_FPGame:fnBPLSetKey.K2Node_FunctionEntry_0'"
 ExtraFlags=201465856
 FunctionReference=(MemberName="fnBPLSetKey")
 bIsEditable=True
 NodePosX=-16
 NodeGuid=5025DA9F4B2774BE3CBDFB9D0510FD4F
 CustomProperties Pin (PinId=637532224A0C4A3C4FCDFD99FD4648F7,PinName="then",Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_MacroInstance_0 70F6A7E640ED81695510C69C7B53A686,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=C288B24E40B142BF750E67A5ACBDD4D3,PinName="Static Mesh Array",Direction="EGPD_Output",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/Engine.StaticMeshComponent'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=Array,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_MacroInstance_0 EA2F0DB9461D8A30B0465CA5594EC470,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=3738EA244D97B5EC08F41AB08AAA2F0C,PinName="KeyMap",Direction="EGPD_Output",PinType.PinCategory="byte",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/Engine.UserDefinedEnum'/Game/AdventureGame/Designer/Blueprints/Core/Enum_KeyType.Enum_KeyType'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(TerminalCategory="struct",TerminalSubCategoryObject="/Script/CoreUObject.UserDefinedStruct'/Game/AdventureGame/Designer/Blueprints/Core/Struct_KeyData.Struct_KeyData'"),PinType.ContainerType=Map,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="NewEnumerator0",AutogeneratedDefaultValue="NewEnumerator0",LinkedTo=(K2Node_CallFunction_0 4D58D85A46B7D2141DC301B76553A740,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=E17A97DA49FE0E0A3D4281957A760259,PinName="Key",Direction="EGPD_Output",PinType.PinCategory="byte",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/Engine.UserDefinedEnum'/Game/AdventureGame/Designer/Blueprints/Core/Enum_KeyType.Enum_KeyType'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="NewEnumerator0",AutogeneratedDefaultValue="NewEnumerator0",LinkedTo=(K2Node_CallFunction_0 327216CB49D4F8DD6B9419A872773A0B,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=EF58A37C4A5D5EDC0EB87688921C154B,PinName="__WorldContext",Direction="EGPD_Output",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/CoreUObject.Object'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=True,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties UserDefinedPin (PinName="Static Mesh Array",PinType=(PinCategory="object",PinSubCategoryObject="/Script/CoreUObject.Class'/Script/Engine.StaticMeshComponent'",ContainerType=Array),DesiredPinDirection=EGPD_Output)
 CustomProperties UserDefinedPin (PinName="KeyMap",PinType=(PinCategory="byte",PinSubCategoryObject="/Script/Engine.UserDefinedEnum'/Game/AdventureGame/Designer/Blueprints/Core/Enum_KeyType.Enum_KeyType'",PinValueType=(TerminalCategory="struct",TerminalSubCategoryObject="/Script/CoreUObject.UserDefinedStruct'/Game/AdventureGame/Designer/Blueprints/Core/Struct_KeyData.Struct_KeyData'"),ContainerType=Map),DesiredPinDirection=EGPD_Output)
 CustomProperties UserDefinedPin (PinName="Key",PinType=(PinCategory="byte",PinSubCategoryObject="/Script/Engine.UserDefinedEnum'/Game/AdventureGame/Designer/Blueprints/Core/Enum_KeyType.Enum_KeyType'"),DesiredPinDirection=EGPD_Output,PinDefaultValue="NewEnumerator0")
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_MacroInstance Name="K2Node_MacroInstance_0" ExportPath="/Script/BlueprintGraph.K2Node_MacroInstance'/Game/AdventureGame/Designer/Blueprints/Core/BPL_FPGame.BPL_FPGame:fnBPLSetKey.K2Node_MacroInstance_0'"
 MacroGraphReference=(MacroGraph="/Script/Engine.EdGraph'/Engine/EditorBlueprintResources/StandardMacros.StandardMacros:ForEachLoop'",GraphBlueprint="/Script/Engine.Blueprint'/Engine/EditorBlueprintResources/StandardMacros.StandardMacros'",GraphGuid=99DBFD5540A796041F72A5A9DA655026)
 NodePosX=240
 NodeGuid=F6737A1547F8E1965FB7F9B9796C7CE9
 CustomProperties Pin (PinId=70F6A7E640ED81695510C69C7B53A686,PinName="Exec",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_FunctionEntry_0 637532224A0C4A3C4FCDFD99FD4648F7,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=EA2F0DB9461D8A30B0465CA5594EC470,PinName="Array",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/Engine.StaticMeshComponent'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=Array,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_FunctionEntry_0 C288B24E40B142BF750E67A5ACBDD4D3,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=A2C95D904970E182590DCDBE4A9B9D14,PinName="LoopBody",Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_MacroInstance_2 FCC3F9024CC7C503EEF94CA631C56341,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=F884D5EE4C149CEB3EF333B1FAA35C71,PinName="Array Element",Direction="EGPD_Output",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/Engine.StaticMeshComponent'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_Knot_0 E559A873422952D3D27CBDA93A983AD0,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=4C8584524E1EAAAE36EE89A6A8F55411,PinName="Array Index",Direction="EGPD_Output",PinType.PinCategory="int",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=53F5B88146B9DD66E6EDEAA58B93375D,PinName="Completed",Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_CallFunction Name="K2Node_CallFunction_0" ExportPath="/Script/BlueprintGraph.K2Node_CallFunction'/Game/AdventureGame/Designer/Blueprints/Core/BPL_FPGame.BPL_FPGame:fnBPLSetKey.K2Node_CallFunction_0'"
 bDefaultsToPureFunc=True
 FunctionReference=(MemberParent="/Script/CoreUObject.Class'/Script/Engine.BlueprintMapLibrary'",MemberName="Map_Find")
 NodePosX=240
 NodePosY=192
 NodeGuid=BE36F7E447964585820BF89D6CBE9BF8
 CustomProperties Pin (PinId=17EF0F554F2AE741059A22A15BC34138,PinName="self",PinFriendlyName=NSLOCTEXT("K2Node", "Target", "Target"),PinToolTip="Target\nBlueprint Map Library Object Reference",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/Engine.BlueprintMapLibrary'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultObject="/Script/Engine.Default__BlueprintMapLibrary",PersistentGuid=00000000000000000000000000000000,bHidden=True,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=4D58D85A46B7D2141DC301B76553A740,PinName="TargetMap",PinToolTip="Target Map\nMap of Enum_KeyType Enums to Struct Key Data Structures\n\nThe map to perform the lookup on",PinType.PinCategory="byte",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/Engine.UserDefinedEnum'/Game/AdventureGame/Designer/Blueprints/Core/Enum_KeyType.Enum_KeyType'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(TerminalCategory="struct",TerminalSubCategoryObject="/Script/CoreUObject.UserDefinedStruct'/Game/AdventureGame/Designer/Blueprints/Core/Struct_KeyData.Struct_KeyData'"),PinType.ContainerType=Map,PinType.bIsReference=True,PinType.bIsConst=True,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="NewEnumerator0",LinkedTo=(K2Node_FunctionEntry_0 3738EA244D97B5EC08F41AB08AAA2F0C,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=True,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=327216CB49D4F8DD6B9419A872773A0B,PinName="Key",PinToolTip="Key\nEnum_KeyType Enum (by ref)\n\nThe key that will be used to look the value up",PinType.PinCategory="byte",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/Engine.UserDefinedEnum'/Game/AdventureGame/Designer/Blueprints/Core/Enum_KeyType.Enum_KeyType'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=True,PinType.bIsConst=True,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="NewEnumerator0",LinkedTo=(K2Node_FunctionEntry_0 E17A97DA49FE0E0A3D4281957A760259,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=20D24A3041E17A68BE80DCA733FBD687,PinName="Value",PinToolTip="Value\nStruct Key Data Structure\n\nThe value associated with the key, default constructed if key was not found",Direction="EGPD_Output",PinType.PinCategory="struct",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.UserDefinedStruct'/Game/AdventureGame/Designer/Blueprints/Core/Struct_KeyData.Struct_KeyData'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,SubPins=(K2Node_CallFunction_0 0509BD564B6A029A5C70DEBFB1459047,K2Node_CallFunction_0 EB2F570F454651263AC2BA804E94D5A7,),PersistentGuid=00000000000000000000000000000000,bHidden=True,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=0509BD564B6A029A5C70DEBFB1459047,PinName="Value_KeyMaterial_4_38C9567C4325DA796ACECCA28FD7C197",PinFriendlyName=INVTEXT("Key Material"),PinToolTip="Key Material\nMaterial Instance Object Reference",Direction="EGPD_Output",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/Engine.MaterialInstance'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CallFunction_3 995DE87B4E93BDC8617DEC8FC99A36A0,),ParentPin=K2Node_CallFunction_0 20D24A3041E17A68BE80DCA733FBD687,PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=EB2F570F454651263AC2BA804E94D5A7,PinName="Value_KeyMesh_5_B1FCEBAC447E91AFA8E665970CC6F241",PinFriendlyName=INVTEXT("Key Mesh"),PinToolTip="Key Mesh\nStatic Mesh Object Reference",Direction="EGPD_Output",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/Engine.StaticMesh'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_MacroInstance_2 CE3538894B4EB6EE64B2E6A1E0D5D8AD,K2Node_Knot_1 08917084400500BB4A99C1AAB61D6740,),ParentPin=K2Node_CallFunction_0 20D24A3041E17A68BE80DCA733FBD687,PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=1752F1F6493565A6784725B69713F222,PinName="ReturnValue",PinToolTip="Return Value\nBoolean\n\nTrue if an item was found (False indicates nothing in the map uses the provided key)",Direction="EGPD_Output",PinType.PinCategory="bool",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="false",AutogeneratedDefaultValue="false",PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_MacroInstance Name="K2Node_MacroInstance_2" ExportPath="/Script/BlueprintGraph.K2Node_MacroInstance'/Game/AdventureGame/Designer/Blueprints/Core/BPL_FPGame.BPL_FPGame:fnBPLSetKey.K2Node_MacroInstance_2'"
 MacroGraphReference=(MacroGraph="/Script/Engine.EdGraph'/Engine/EditorBlueprintResources/StandardMacros.StandardMacros:IsValid'",GraphBlueprint="/Script/Engine.Blueprint'/Engine/EditorBlueprintResources/StandardMacros.StandardMacros'",GraphGuid=64422BCD430703FF5CAEA8B79A32AA65)
 NodePosX=512
 NodePosY=96
 NodeGuid=0F08E8374FAA8AC5EED9B9B96D45A094
 CustomProperties Pin (PinId=FCC3F9024CC7C503EEF94CA631C56341,PinName="exec",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_MacroInstance_0 A2C95D904970E182590DCDBE4A9B9D14,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=CE3538894B4EB6EE64B2E6A1E0D5D8AD,PinName="InputObject",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/CoreUObject.Object'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CallFunction_0 EB2F570F454651263AC2BA804E94D5A7,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=42A205864FB67804327981AA8979F0D5,PinName="Is Valid",Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CallFunction_2 6394E835479A0C97B9BB45BB9873654D,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=3115F23F4146CB558B84D8BC26938E9D,PinName="Is Not Valid",Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_Knot_2 FBE2F4054235F21AB94C58BD10A9141D,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_CallFunction Name="K2Node_CallFunction_2" ExportPath="/Script/BlueprintGraph.K2Node_CallFunction'/Game/AdventureGame/Designer/Blueprints/Core/BPL_FPGame.BPL_FPGame:fnBPLSetKey.K2Node_CallFunction_2'"
 FunctionReference=(MemberParent="/Script/CoreUObject.Class'/Script/Engine.StaticMeshComponent'",MemberName="SetStaticMesh")
 NodePosX=864
 NodePosY=48
 NodeGuid=B4A035B44A57A1622A4869842434FCCE
 CustomProperties Pin (PinId=6394E835479A0C97B9BB45BB9873654D,PinName="execute",PinToolTip="\nExec",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_MacroInstance_2 42A205864FB67804327981AA8979F0D5,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=C57A536B4F16674AC5C031A9C0FAC947,PinName="then",PinToolTip="\nExec",Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CallFunction_3 7755B5C14A8FAE34FE82228ACFF9E8C7,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=F9614CFD44BA773F7251F3B0BCDE8F11,PinName="self",PinFriendlyName=NSLOCTEXT("K2Node", "Target", "Target"),PinToolTip="Target\nStatic Mesh Component Object Reference",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/Engine.StaticMeshComponent'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_Knot_0 E673681747A97557EA0D858EA604EDE0,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=AC8AEB5F48D3E1567F8C9DA7A9BA3907,PinName="NewMesh",PinToolTip="New Mesh\nStatic Mesh Object Reference",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/Engine.StaticMesh'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_Knot_1 A5F9AFBC452397728633AAA2449D9327,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=12FFB04942AF9E654E56DBB64604B0C9,PinName="ReturnValue",PinToolTip="Return Value\nBoolean\n\nChange the StaticMesh used by this instance.",Direction="EGPD_Output",PinType.PinCategory="bool",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="false",AutogeneratedDefaultValue="false",PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_Knot Name="K2Node_Knot_0" ExportPath="/Script/BlueprintGraph.K2Node_Knot'/Game/AdventureGame/Designer/Blueprints/Core/BPL_FPGame.BPL_FPGame:fnBPLSetKey.K2Node_Knot_0'"
 NodePosX=752
 NodePosY=64
 NodeGuid=412EBBAE4D7D951D44AB04A131E137A6
 CustomProperties Pin (PinId=E559A873422952D3D27CBDA93A983AD0,PinName="InputPin",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/Engine.StaticMeshComponent'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_MacroInstance_0 F884D5EE4C149CEB3EF333B1FAA35C71,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=True,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=E673681747A97557EA0D858EA604EDE0,PinName="OutputPin",Direction="EGPD_Output",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/Engine.StaticMeshComponent'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CallFunction_2 F9614CFD44BA773F7251F3B0BCDE8F11,K2Node_CallFunction_3 D4A783F14B08CB19C469139746C1195D,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_Knot Name="K2Node_Knot_1" ExportPath="/Script/BlueprintGraph.K2Node_Knot'/Game/AdventureGame/Designer/Blueprints/Core/BPL_FPGame.BPL_FPGame:fnBPLSetKey.K2Node_Knot_1'"
 NodePosX=752
 NodePosY=224
 NodeGuid=34DF52AB4F23AE6199B5ED825A1AED17
 CustomProperties Pin (PinId=08917084400500BB4A99C1AAB61D6740,PinName="InputPin",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/Engine.StaticMesh'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CallFunction_0 EB2F570F454651263AC2BA804E94D5A7,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=True,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=A5F9AFBC452397728633AAA2449D9327,PinName="OutputPin",Direction="EGPD_Output",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/Engine.StaticMesh'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CallFunction_2 AC8AEB5F48D3E1567F8C9DA7A9BA3907,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_CallFunction Name="K2Node_CallFunction_3" ExportPath="/Script/BlueprintGraph.K2Node_CallFunction'/Game/AdventureGame/Designer/Blueprints/Core/BPL_FPGame.BPL_FPGame:fnBPLSetKey.K2Node_CallFunction_3'"
 FunctionReference=(MemberParent="/Script/CoreUObject.Class'/Script/Engine.PrimitiveComponent'",MemberName="SetMaterial")
 NodePosX=1184
 NodePosY=48
 NodeGuid=06C06A4A4E71EF03DA7348A33AA076EE
 CustomProperties Pin (PinId=7755B5C14A8FAE34FE82228ACFF9E8C7,PinName="execute",PinToolTip="\nExec",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CallFunction_2 C57A536B4F16674AC5C031A9C0FAC947,K2Node_Knot_3 6F9D9FF240584B8EB11953B784FDFFF7,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=A0EECADA4EE412B745C10EABD9854521,PinName="then",PinToolTip="\nExec",Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=D4A783F14B08CB19C469139746C1195D,PinName="self",PinFriendlyName=NSLOCTEXT("K2Node", "Target", "Target"),PinToolTip="Target\nPrimitive Component Object Reference",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/Engine.PrimitiveComponent'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_Knot_0 E673681747A97557EA0D858EA604EDE0,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=A613993141456F19951F428006582923,PinName="ElementIndex",PinToolTip="Element Index\nInteger\n\nThe element to access the material of.",PinType.PinCategory="int",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="0",AutogeneratedDefaultValue="0",PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=995DE87B4E93BDC8617DEC8FC99A36A0,PinName="Material",PinToolTip="Material\nMaterial Interface Object Reference",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/Engine.MaterialInterface'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CallFunction_0 0509BD564B6A029A5C70DEBFB1459047,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_Knot Name="K2Node_Knot_2" ExportPath="/Script/BlueprintGraph.K2Node_Knot'/Game/AdventureGame/Designer/Blueprints/Core/BPL_FPGame.BPL_FPGame:fnBPLSetKey.K2Node_Knot_2'"
 NodePosX=784
 NodePosY=288
 NodeGuid=CC422D284A7C87E8B390DAA9BD00AF80
 CustomProperties Pin (PinId=FBE2F4054235F21AB94C58BD10A9141D,PinName="InputPin",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_MacroInstance_2 3115F23F4146CB558B84D8BC26938E9D,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=True,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=0E8775F845DA8AFF93FED1984811161F,PinName="OutputPin",Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_Knot_3 85D5799A444E61A6F0562983D39747AA,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_Knot Name="K2Node_Knot_3" ExportPath="/Script/BlueprintGraph.K2Node_Knot'/Game/AdventureGame/Designer/Blueprints/Core/BPL_FPGame.BPL_FPGame:fnBPLSetKey.K2Node_Knot_3'"
 NodePosX=1088
 NodePosY=288
 NodeGuid=2E43E1CF4DA880AB2342AE886CFEF2D3
 CustomProperties Pin (PinId=85D5799A444E61A6F0562983D39747AA,PinName="InputPin",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_Knot_2 0E8775F845DA8AFF93FED1984811161F,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=True,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=6F9D9FF240584B8EB11953B784FDFFF7,PinName="OutputPin",Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CallFunction_3 7755B5C14A8FAE34FE82228ACFF9E8C7,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/UnrealEd.EdGraphNode_Comment Name="EdGraphNode_Comment_8" ExportPath="/Script/UnrealEd.EdGraphNode_Comment'/Game/AdventureGame/Designer/Blueprints/Core/BPL_FPGame.BPL_FPGame:fnBPLSetKey.EdGraphNode_Comment_8'"
 CommentColor=(R=0.150000,G=0.150000,B=0.150000,A=0.500000)
 FontSize=16
 bCommentBubbleVisible_InDetailsPanel=False
 NodePosX=192
 NodePosY=-112
 NodeWidth=1328
 NodeHeight=544
 bCommentBubblePinned=False
 bCommentBubbleVisible=False
 NodeComment="Pull the given key type from the Key Map and apply the key type\'s color (and shape, if it exists) to all elements in the static mesh array "
 NodeGuid=1273B94B4916E35238002BB209110DAF
End Object

To copy this group of nodes into your project, click **Copy Full Snippet**, click a blank area in the corresponding graph in your blueprint, and press **Ctrl **+ **V**. Then, connect the function entry node’s pins to the **For Each Loop** and **Find **nodes.

### Initialize the Keys

You are now ready to use the functionality you’ve created inside the key blueprint. First, you will initialize the key based on the KeyType you assign to it.

To **initialize **a Blueprint level object means to set it up when it’s created, either in the viewport or when the game begins.

To initialize the key, follow these steps:

- Drag the **Exec **pin of the **Construction Script **node and search for the **fnBPLSetKey **function you created earlier.[image: Add fnBPLSetKey]The function node requires a **Static Mesh Array**, **Key Map**, and **Key**, which you will provide from `BP_Key`.
- In the **My Blueprint** panel, under the **Variables **section, expand the **Setup **category, and drag the **KeyType **variable into the node graph near the function node. [image: Get Variable Reference Node]
- This prompts you if you would like to **Get **or **Set **the value of the variable. In this case, you need to check the type of key this is, so select **Get**.
- Connect the new **Get Key Type **node’s pin to the **Key **pin of the **Fn BPLSet Key** node.[image: Connect Get Key Type]
- Repeat the same process for the **KeyMap **variable. Drag it into the node graph and create a **Get **node. Connect the pin of this node to the **KeyMap **pin of the **Fn BPLSet Key** node.[image: Connect Get Key Map]
- Next, from the **Components **panel, drag **KeyMesh **into the graph and create a **Get **node.
- The **Key Mesh **node contains a single static mesh component reference, but the function node needs an array. Unreal Engine can take care of this for you: connect the **Key Mesh **pin to the **Static Mesh Array** pin of the **Fn BPLSet Key** node.
- **Save** and **Compile **your blueprint.

 The key’s construction script should now look like this:

 Blueprint

Begin Object Class=/Script/BlueprintGraph.K2Node_FunctionEntry Name="K2Node_FunctionEntry_0" ExportPath="/Script/BlueprintGraph.K2Node_FunctionEntry'/Game/AdventureGame/Designer/Blueprints/Key/BP_Key.BP_Key:UserConstructionScript.K2Node_FunctionEntry_0'"
 FunctionReference=(MemberParent="/Script/CoreUObject.Class'/Script/Engine.Actor'",MemberName="UserConstructionScript")
 NodePosX=-336
 NodePosY=80
 NodeGuid=61878545441B0F09AACCDB940A616004
 CustomProperties Pin (PinId=244D947B4AB2413F1D5C5DA59BE34560,PinName="then",Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_Knot_0 3A85247B4126B2217A9055A459C7FD40,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_CallFunction Name="K2Node_CallFunction_0" ExportPath="/Script/BlueprintGraph.K2Node_CallFunction'/Game/AdventureGame/Designer/Blueprints/Key/BP_Key.BP_Key:UserConstructionScript.K2Node_CallFunction_0'"
 FunctionReference=(MemberParent="/Script/Engine.BlueprintGeneratedClass'/Game/AdventureGame/Designer/Blueprints/Core/BPL_FPGame.BPL_FPGame_C'",MemberName="fnBPLSetKey",MemberGuid=7AF3D58C4C63BF2B73042CBAB0D00407)
 NodePosX=672
 NodePosY=80
 ErrorType=1
 NodeGuid=370C84654C0B9FD85B637984CB717874
 CustomProperties Pin (PinId=5378A3314BB30F69A596AAB100EEF245,PinName="execute",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_Knot_1 54096EB04CF781D0D7FACA9D0ECDAA6A,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=0C0B38CD4A0A52546981AD96E9AC1656,PinName="then",Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=4F2C8716477B58B99F5576B2A3467B8E,PinName="self",PinFriendlyName=NSLOCTEXT("K2Node", "Target", "Target"),PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/Engine.BlueprintGeneratedClass'/Game/AdventureGame/Designer/Blueprints/Core/BPL_FPGame.BPL_FPGame_C'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultObject="/Game/AdventureGame/Designer/Blueprints/Core/BPL_FPGame.Default__BPL_FPGame_C",PersistentGuid=00000000000000000000000000000000,bHidden=True,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=F02E86A942BF7E4F42DCABA0EDE2DAA7,PinName="Static Mesh Array",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/Engine.StaticMeshComponent'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=Array,PinType.bIsReference=True,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_MakeArray_0 1D625CEB4AC26705EB9558B7E1EFED7E,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=A8BF37E2422606D2C775A6869B7F2816,PinName="KeyMap",PinType.PinCategory="byte",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/Engine.UserDefinedEnum'/Game/AdventureGame/Designer/Blueprints/Core/Enum_KeyType.Enum_KeyType'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(TerminalCategory="struct",TerminalSubCategoryObject="/Script/CoreUObject.UserDefinedStruct'/Game/AdventureGame/Designer/Blueprints/Core/Struct_KeyData.Struct_KeyData'"),PinType.ContainerType=Map,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="NewEnumerator0",LinkedTo=(K2Node_VariableGet_2 F43B899E4CEB1C2548D6DBB320568846,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=1DD199F44AABC365B77C6B84CC20C26A,PinName="Key",PinType.PinCategory="byte",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/Engine.UserDefinedEnum'/Game/AdventureGame/Designer/Blueprints/Core/Enum_KeyType.Enum_KeyType'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="NewEnumerator0",AutogeneratedDefaultValue="NewEnumerator0",LinkedTo=(K2Node_VariableGet_0 A1CA5660405D66A447FE20B1FB7268AC,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=F0E2B34D480B1B107115BB85B258F99F,PinName="__WorldContext",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/CoreUObject.Object'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=True,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_VariableGet Name="K2Node_VariableGet_0" ExportPath="/Script/BlueprintGraph.K2Node_VariableGet'/Game/AdventureGame/Designer/Blueprints/Key/BP_Key.BP_Key:UserConstructionScript.K2Node_VariableGet_0'"
 VariableReference=(MemberName="KeyType",MemberGuid=BCEA10BD4C19AA0E7944C9B57D455D1C,bSelfContext=True)
 NodePosX=432
 NodePosY=240
 NodeGuid=B03E8EAB4CFB332DBC0C2DB4262E66B2
 CustomProperties Pin (PinId=A1CA5660405D66A447FE20B1FB7268AC,PinName="KeyType",Direction="EGPD_Output",PinType.PinCategory="byte",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/Engine.UserDefinedEnum'/Game/AdventureGame/Designer/Blueprints/Core/Enum_KeyType.Enum_KeyType'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="NewEnumerator0",LinkedTo=(K2Node_CallFunction_0 1DD199F44AABC365B77C6B84CC20C26A,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=D072E77D4783391E497E51B860E732A4,PinName="self",PinFriendlyName=NSLOCTEXT("K2Node", "Target", "Target"),PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/Engine.BlueprintGeneratedClass'/Game/AdventureGame/Designer/Blueprints/Key/BP_Key.BP_Key_C'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=True,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_VariableGet Name="K2Node_VariableGet_1" ExportPath="/Script/BlueprintGraph.K2Node_VariableGet'/Game/AdventureGame/Designer/Blueprints/Key/BP_Key.BP_Key:UserConstructionScript.K2Node_VariableGet_1'"
 VariableReference=(MemberName="KeyMesh",bSelfContext=True)
 NodePosY=128
 NodeGuid=CD0848B547AE0C3273629DAD3310F095
 CustomProperties Pin (PinId=265D0B3548F0855FDFAC3284374F5E67,PinName="KeyMesh",Direction="EGPD_Output",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/Engine.StaticMeshComponent'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_MakeArray_0 14CB70974DB6078096491BBF6EDF9D97,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=62FE74954B6EAFDAE33690ACCC7B0719,PinName="self",PinFriendlyName=NSLOCTEXT("K2Node", "Target", "Target"),PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/Engine.BlueprintGeneratedClass'/Game/AdventureGame/Designer/Blueprints/Key/BP_Key.BP_Key_C'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=True,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_MakeArray Name="K2Node_MakeArray_0" ExportPath="/Script/BlueprintGraph.K2Node_MakeArray'/Game/AdventureGame/Designer/Blueprints/Key/BP_Key.BP_Key:UserConstructionScript.K2Node_MakeArray_0'"
 NodePosX=208
 NodePosY=112
 NodeGuid=AF2F9CBE45883775CE8571A58DA8D3F8
 CustomProperties Pin (PinId=1D625CEB4AC26705EB9558B7E1EFED7E,PinName="Array",Direction="EGPD_Output",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/Engine.StaticMeshComponent'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=Array,PinType.bIsReference=True,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CallFunction_0 F02E86A942BF7E4F42DCABA0EDE2DAA7,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=14CB70974DB6078096491BBF6EDF9D97,PinName="[0]",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/Engine.StaticMeshComponent'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_VariableGet_1 265D0B3548F0855FDFAC3284374F5E67,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_VariableGet Name="K2Node_VariableGet_2" ExportPath="/Script/BlueprintGraph.K2Node_VariableGet'/Game/AdventureGame/Designer/Blueprints/Key/BP_Key.BP_Key:UserConstructionScript.K2Node_VariableGet_2'"
 VariableReference=(MemberName="KeyMap",MemberGuid=FE2762FD48C6FA7CB42C47B75EBC633E,bSelfContext=True)
 NodePosX=432
 NodePosY=176
 NodeGuid=8AC5557A4C3A59A045C2EF8C1D94C52C
 CustomProperties Pin (PinId=F43B899E4CEB1C2548D6DBB320568846,PinName="KeyMap",Direction="EGPD_Output",PinType.PinCategory="byte",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/Engine.UserDefinedEnum'/Game/AdventureGame/Designer/Blueprints/Core/Enum_KeyType.Enum_KeyType'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(TerminalCategory="struct",TerminalSubCategoryObject="/Script/CoreUObject.UserDefinedStruct'/Game/AdventureGame/Designer/Blueprints/Core/Struct_KeyData.Struct_KeyData'"),PinType.ContainerType=Map,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="NewEnumerator0",LinkedTo=(K2Node_CallFunction_0 A8BF37E2422606D2C775A6869B7F2816,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=BBB37802418C40561DB639A1B6938E89,PinName="self",PinFriendlyName=NSLOCTEXT("K2Node", "Target", "Target"),PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/Engine.BlueprintGeneratedClass'/Game/AdventureGame/Designer/Blueprints/Key/BP_Key.BP_Key_C'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=True,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_Knot Name="K2Node_Knot_0" ExportPath="/Script/BlueprintGraph.K2Node_Knot'/Game/AdventureGame/Designer/Blueprints/Key/BP_Key.BP_Key:UserConstructionScript.K2Node_Knot_0'"
 NodePosX=-48
 NodePosY=48
 NodeGuid=F3EE9A1F420F75561B501E86032610EC
 CustomProperties Pin (PinId=3A85247B4126B2217A9055A459C7FD40,PinName="InputPin",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_FunctionEntry_0 244D947B4AB2413F1D5C5DA59BE34560,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=True,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=5CEAECC54B08BCF6C784C39D57588D98,PinName="OutputPin",Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_Knot_1 A54326FA4068EF6244AFCEAD5A1CCCDA,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_Knot Name="K2Node_Knot_1" ExportPath="/Script/BlueprintGraph.K2Node_Knot'/Game/AdventureGame/Designer/Blueprints/Key/BP_Key.BP_Key:UserConstructionScript.K2Node_Knot_1'"
 NodePosX=320
 NodePosY=48
 NodeGuid=53FEBA5C48D54FD248D4B1BCF909F6CE
 CustomProperties Pin (PinId=A54326FA4068EF6244AFCEAD5A1CCCDA,PinName="InputPin",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_Knot_0 5CEAECC54B08BCF6C784C39D57588D98,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=True,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=54096EB04CF781D0D7FACA9D0ECDAA6A,PinName="OutputPin",Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CallFunction_0 5378A3314BB30F69A596AAB100EEF245,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/UnrealEd.EdGraphNode_Comment Name="EdGraphNode_Comment_3" ExportPath="/Script/UnrealEd.EdGraphNode_Comment'/Game/AdventureGame/Designer/Blueprints/Key/BP_Key.BP_Key:UserConstructionScript.EdGraphNode_Comment_3'"
 CommentColor=(R=0.150000,G=0.150000,B=0.150000,A=0.500000)
 bCommentBubbleVisible_InDetailsPanel=False
 NodePosX=-59
 NodePosY=-6
 NodeWidth=992
 NodeHeight=320
 bCommentBubblePinned=False
 bCommentBubbleVisible=False
 NodeComment="Call BPLSetKey to apply the selected KeyType color and shape to the key\'s static mesh"
 NodeGuid=37AF2A08487975D118FE848D94294E47
End Object

If you copy this snippet into your project, you need to connect the **FnBPLSetKey** node to the **Construction Script **node.

### Test the Key’s Functionality

Now, you can test the color-changing functionality you created in your key and new function.

Close down the Blueprint Editor window and go back to the level editor.

Since the default **Key Type** value is **Blue**, your key should be initialized as a blue rectangle.

Select the key actor, and in the **Details **panel, under the **Setup **section, change the **Key Type **between **Yellow **and **Red**. As you change it, you should see your key update its color and shape in the level!

If your rectangle and oval keys appear too large, you may have selected the wrong mesh assets when building the **KeyMap**. Go back to your **KeyMap’s **details and ensure the Sphere and Cube meshes are from the **/Engine/BasicShapes** path.

[image: Cube Path]

## Grant Keys to the Player Character

Your player needs a way to pick up keys, and for other objects to know what keys the player holds. To handle granting and retrieving keys, you’re going to use a **Blueprint Interface**.

### Use a Blueprint Interface to Communicate Between Blueprints

A **Blueprint Interface **stores a list of functions that can be used by each blueprint that has access to the interface. To **implement **an interface means giving your blueprint the ability to respond to a shared set of events (or **messages**).

In a game where player and NPC characters are walking around, the key needs a way to make sure it’s only interacting with the player character. To do this, you'll create a Blueprint Interface to implement in `BP_AdventureCharacter`. This acts like a permission slip that the player blueprint uses to listen to the pick-up-key message.

Blueprint Interfaces are useful when you want different Blueprints to communicate without knowing each other’s details.

To create a Blueprint Interface with two functions, follow these steps:

- Go to the **Content Browser** and navigate to **Content > AdventureGame > Designer > Blueprints > Core**.
- Right-click in the **Core **folder, go to **Blueprint**, and create a new **Blueprint Interface**. Name this asset `BPI_PlayerKeys` and open it by double-clicking on it. This window looks similar to the Blueprint Editor. On the right side, you have the **My Blueprint** panel that lists all functions in this interface. Below that is the **Details **panel.
- In the **My Blueprint **panel, there’s already an initial function made for you. Name it `fnBPIAddKey`.
- Select the function, and in the **Details **panel, under the **Inputs **section, press the **+ **button to add a new input.
- Name the input `KeyType`, and change its type to **Enum Key Type**.[image: Added Input]
- Also in the **Details **panel, next to **Category**, enter `Keys`. This makes your function easier to find in the blueprints’ Interfaces list.
- Next, add a new function in the My Blueprint panel named fnBPIGetKeys, which will handle retrieving keys. [image: Add New Function]
- Select the new **fnBPIGetKeys **function, and in the **Details **panel, under the **Outputs **section, click the **+ **button to add a new parameter named **Held Keys**.
- Change its type to **Enum Key Type**, and the return value to **Array **so it can return the player’s found keys. [image: Add Input]
- **Save **and **Compile **your interface. You can now close the **BPI_PlayerKeys **window.Since an interface is related to the blueprint system, you need to compile it just like you do with blueprints.

Notice that in the Blueprint Interface, you only created function declarations. Interface functions don’t contain logic themselves, but their setup determines how you can use them in blueprints.

Interface functions without outputs (**fnBPIAddKeys**) act like events, while functions with outputs (**fnBPIGetKeys**) work like regular functions you can add logic to.

### Create a New Player Character

Before adding to the character, you’ll duplicate a default player character that comes with the project to create your own variant. You’ll also need to change your game mode settings to use your new character.

To create a player character to use in your project, follow these steps:

- Go to the **Content Browser **and navigate to the **Content > AdventureGame > Designer > Blueprints** folder.
- Create a new folder named `Characters`.
- Go to the **Content > Variant_Shooter > Blueprints > FirstPerson** folder.
- Drag the `BP_ShooterChracter` asset into the **Characters **folder you created, and select **Copy Here**.
- Right-click the new copy in the **Characters **folder to rename it `BP_AdventureCharacter`.
- Go to **Edit > Project Settings**. In the left panel, go to **Project > Maps & Modes** settings.
- Under the **DefaultGameMode** setting, expand **SelectedGameMode**.A **Game Mode **asset that defines a set of rules for the world — including the default player character. You will need to change it to use the new character you created. You can change game mode settings here, or by opening the asset itself.
- Change the **Default Pawn Class** to `BP_AdventureCharacter`.[image: Default Pawn Class]
- Close the **Project Settings **window.

To change game mode settings on a per-level basis instead of for your entire project, use **World Settings**. You can find this tab next to the **Details **panel.

[image: World Settings]

If you can’t see the **World Settings** panel, in the main menu bar, go to **Window**, and select **World Settings**.

### Add the Blueprint Interface to the Player

In this section, you’re going to modify the player character blueprint. This character has many helpful functions and interfaces already set up for you, and you’ll add the **BPI_PlayerKeys **interface you made earlier to allow them to pick up keys.

Next, you will modify the new `BP_AdventureCharacter` to use keys.

To add the Blueprint Interface functions to the character, follow these steps:

- Navigate to your new **Characters **folder and open `BP_AdventureCharacter`.
- You’ll add the **BPI Player Keys** interface to make sure that the player blueprint implements it. In the toolbar at the top of the new window, click the **Class Settings **button.
- In the **Details **panel on the right-hand side, under the **Interfaces > Implemented Interfaces** section, click **Add**, then select `BPI_PlayerKeys` from the dropdown. This grants your character the ability to implement the **fnBPIGetKeys **and **fnBPIAddKey **functions.[image: Add Interface]
- **Compile **the blueprint so you can use the interface functions. In the Interfaces section of the **My Blueprint **panel, you’ll see a **Keys **category containing **fnBPIAddKey **and **fnBPIGetKey**. It has a yellow icon instead of gray, meaning these functions act like **events**.

### Store Picked Up Keys

The player needs to store the keys they’ve collected, so create a new variable for this. The variable needs to hold up to three keys, so it should be an array.

To create an array variable to store the player’s keys, follow these steps:

- In the `BP_AdventureCharacter` blueprint, add a new variable to the **Variables **list in the **My Blueprint **panel.
- Name the variable `Held Keys`.
- Select the variable, and in the **Details **panel, set the container to an **array **of the type **Enum** **Key Type**. Using an array is important since the player can hold multiple keys simultaneously.[image: Held Keys Variable]

To add keys to the **Held Keys** array when the player picks up a key, follow these steps:

- Go to the character’s **Event Graph **tab.
- Right-click the graph and search for Event **fnBPIAddKey**. This is the event node that executes when the **fnBPIAddKey **function is called.
- Drag from its execution pin and search for `Array Add`, and select an **Add **node. This node takes a new element and adds it to an array.
- Add a reference to the **Held Keys** variable by dragging the variable into the Event Graph, and select **Get**.
- Connect the **Held Keys** node to the **Array Add **node’s **Target Array** input. This pin looks like a square.
- Connect the Event node’s **Key Type** pin to the Add node’s **New Item** input.[image: Connect Key Type to Add Node]

Now, when this event function is triggered, the player character adds the provided **Key Type** to their **Held Keys **array.

### Retrieve the Player’s List of Keys

The door you’ll work with in the next part of this tutorial needs to check all of the player’s keys, so add functionality to the player that returns an array of keys they have picked up.

To handle retrieving keys, follow these steps:

- In the `BP_AdventureCharacter `blueprint, under **My Blueprint > Interfaces**, expand the **Keys **section.[image: My Blueprint Interfaces] In the list, **fnBPIGetKeys **has a grey icon, meaning you can use it as a regular function, not just an event.
- Double-click **fnBPIGetKeys **to open the function’s graph.
- Add a reference to the **Held Keys **variable by dragging it in and selecting **Get**.
- Connect the **Get Held Keys** node to the **Return **node’s **Held Keys **pin.

The **fnBPIGetKeys **graph should now look like the following:

[image: fnBPIGetKeys]

### Make Keys Detect Collisions With the Player

Next, you will add functionality that triggers the **fnBPIGetKeys **event function when the player picks up a key. This should happen when the player touches the key’s collision volume.

You will add an event that belongs to the **Capsule **collision component. An event triggers when something happens during gameplay. In this case, when the player actor overlaps with the key’s Capsule, the key should perform some actions.

To add an overlap event and check if the overlapping actor is the player, follow these steps:

- Open your `BP_Key` blueprint and navigate to an empty area of the **EventGraph**.
- In the **Components **panel, right-click the **Capsule **component and select **Add Event > Add OnComponentBeginOverlap**. The associated node appears in your event graph. This event node triggers if an overlap happens between this and another actor.[image: Add BeginOverlap]The event node comes with information about that event. For example, the overlapping actor that triggered the event is passed through the **Other Actor** pin.
- Drag your **OtherActor **variable from the **Variables **list into your graph and select **Set**. A **Set **node saves a new value to that variable.
- Drag the **Exec **pin of the Event **OnComponentBeginOverlap **node and connect it to the **Exec **input of the** Set Other Actor** node.
- Drag the **Other Actor** pin of the **Event OnComponentBeginOverlap** node and connect it to the **Other Actor **input of the **Set Other Actor **node.[image: Adding the Set Other Actor Node]
- Before you do anything with the key, check if the overlapping actor is the player, since that’s the only character that should be able to collect keys. You know it’s the player if they have the Blueprint Interface. Right-click near the **Set **node and add a **Does Object Implement Interface** node.
- On the **Does Object Implement Interface** node, change the **Interface **pin to **BPI_PlayerKeys**.
- Connect the **Test Object **input pin to the **Set Other Actor** node’s blue pin. This pin works like a **Get Other Actor** node.
- On the **Does Object Implement Interface** node, drag the **Return Value **pin and add a **Branch** node.
- Connect the **exec **input pin of the **Branch **node to the **Set **node. [image: Connect to Branch Node]

A **Branch **node checks if a condition is true or false so you can execute different actions for each result. Here, you’ll create logic for two scenarios, true and false, based on what happens if the overlapping actor is or isn’t the player.

To call the add-key function when the player has touched the key, follow these steps:

- If the Branch result is true, the actor can pick up keys, so trigger the interface’s event function. Drag off the **True **pin of the **Branch **node and add an **Fn BPIAdd Key (Message) **node.You’re adding a message node instead of a regular function node because when you call a blueprint interface function, you’re sending a message. The **Target **blueprint only responds if it implements that interface.
- Drag the **Fn BPIAdd Key **node’s **Target **pin and add a **Get Other Actor** node.
- Drag the **Key Type** pin and add a **Get Key Type** node. This is another way to add variable references. [image: Add Get Key Type]
- When your key is picked up, it should disappear after a short delay so it can’t be picked up again. To handle this, drag the **Fn BPIAdd Key** node’s **exec **pin and add a **Delay **node. Keep the default Duration of `0.2`.
- When the timer expires your key should disappear, so connect a **Destroy Actor **node to the **Delay **node’s **Completed **pin. Make sure the **Target **is set to **self**, meaning that the key actor should remove itself from the level.[image: Connecting a Delay Node]
- **Save **and **Compile **your blueprint.

You’ll notice you didn’t add any nodes to the **Branch **node’s **False** result. This is because if the overlapping actor doesn’t have the keys interface, they can’t pick up the key, so do nothing.

 The key’s complete event graph should now look like the following:

 Blueprint

Begin Object Class=/Script/BlueprintGraph.K2Node_ComponentBoundEvent Name="K2Node_ComponentBoundEvent_0" ExportPath="/Script/BlueprintGraph.K2Node_ComponentBoundEvent'/Game/AdventureGame/Designer/Blueprints/Key/BP_Key.BP_Key:EventGraph.K2Node_ComponentBoundEvent_0'"
 DelegatePropertyName="OnComponentBeginOverlap"
 DelegateOwnerClass="/Script/CoreUObject.Class'/Script/Engine.PrimitiveComponent'"
 ComponentPropertyName="Capsule"
 EventReference=(MemberParent="/Script/CoreUObject.Package'/Script/Engine'",MemberName="ComponentBeginOverlapSignature__DelegateSignature")
 bInternalEvent=True
 CustomFunctionName="BndEvt__BP_Key_Capsule_K2Node_ComponentBoundEvent_0_ComponentBeginOverlapSignature__DelegateSignature"
 NodePosX=38
 NodePosY=566
 NodeGuid=C5E68C03468A77677E553AA9F1B116FB
 CustomProperties Pin (PinId=B9F4C0474884F049FEA70CB95276EE49,PinName="OutputDelegate",Direction="EGPD_Output",PinType.PinCategory="delegate",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(MemberParent="/Script/Engine.BlueprintGeneratedClass'/Game/AdventureGame/Designer/Blueprints/Key/BP_Key.BP_Key_C'",MemberName="BndEvt__BP_Key_Capsule_K2Node_ComponentBoundEvent_0_ComponentBeginOverlapSignature__DelegateSignature"),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=C3E22B26473D232536CA09A3E9A13C00,PinName="then",Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_VariableSet_0 5E7EF2084FE75C73EB5F84AECEC455F4,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=25D9CF9A43056C368EC207A121C94B83,PinName="OverlappedComponent",PinToolTip="Overlapped Component\nPrimitive Component Object Reference",Direction="EGPD_Output",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/Engine.PrimitiveComponent'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=0E31640D4D731D5CB22DC08463C25691,PinName="OtherActor",PinToolTip="Other Actor\nActor Object Reference",Direction="EGPD_Output",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/Engine.Actor'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_VariableSet_0 CCD65A04482E437F22F869B5090AB450,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=025B101F449132175491FF81C731F27F,PinName="OtherComp",PinToolTip="Other Comp\nPrimitive Component Object Reference",Direction="EGPD_Output",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/Engine.PrimitiveComponent'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=18F15B2B4C26BBB2613B81A76E65B3A7,PinName="OtherBodyIndex",PinToolTip="Other Body Index\nInteger",Direction="EGPD_Output",PinType.PinCategory="int",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="0",AutogeneratedDefaultValue="0",PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=F3C10D85449ED2D7FFD55786D056181B,PinName="bFromSweep",PinToolTip="From Sweep\nBoolean",Direction="EGPD_Output",PinType.PinCategory="bool",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="false",AutogeneratedDefaultValue="false",PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=7F8EC2FD47E10690355331BE20703929,PinName="SweepResult",PinToolTip="Sweep Result\nHit Result Structure (by ref)",Direction="EGPD_Output",PinType.PinCategory="struct",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.ScriptStruct'/Script/Engine.HitResult'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=True,PinType.bIsConst=True,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_VariableSet Name="K2Node_VariableSet_0" ExportPath="/Script/BlueprintGraph.K2Node_VariableSet'/Game/AdventureGame/Designer/Blueprints/Key/BP_Key.BP_Key:EventGraph.K2Node_VariableSet_0'"
 VariableReference=(MemberName="OtherActor",MemberGuid=D341B7944DE0CC040A67FC86B571A38A,bSelfContext=True)
 NodePosX=374
 NodePosY=582
 NodeGuid=C9E0F3BC40E5195A14D5C797834C1F02
 CustomProperties Pin (PinId=5E7EF2084FE75C73EB5F84AECEC455F4,PinName="execute",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_ComponentBoundEvent_0 C3E22B26473D232536CA09A3E9A13C00,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=7458C70F463061A5A38E90910719D91F,PinName="then",Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_IfThenElse_0 DCE8D45D4D85E164CE06CFA687EC5D36,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=CCD65A04482E437F22F869B5090AB450,PinName="OtherActor",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/Engine.Actor'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_ComponentBoundEvent_0 0E31640D4D731D5CB22DC08463C25691,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=90E67951413D245BF035F7A5E1F7731C,PinName="Output_Get",PinToolTip="Retrieves the value of the variable, can use instead of a separate Get node",Direction="EGPD_Output",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/Engine.Actor'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CallFunction_0 9082388A4177357A574356BB10323A35,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=5725C1424D0CB09C453D829C81678857,PinName="self",PinFriendlyName=NSLOCTEXT("K2Node", "Target", "Target"),PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/Engine.BlueprintGeneratedClass'/Game/AdventureGame/Designer/Blueprints/Key/BP_Key.BP_Key_C'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=True,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_CallFunction Name="K2Node_CallFunction_0" ExportPath="/Script/BlueprintGraph.K2Node_CallFunction'/Game/AdventureGame/Designer/Blueprints/Key/BP_Key.BP_Key:EventGraph.K2Node_CallFunction_0'"
 bDefaultsToPureFunc=True
 FunctionReference=(MemberParent="/Script/CoreUObject.Class'/Script/Engine.KismetSystemLibrary'",MemberName="DoesImplementInterface")
 NodePosX=576
 NodePosY=656
 NodeGuid=E80D0CD14D745A08226D38A59B9C0FC1
 CustomProperties Pin (PinId=9480FB024A2D0F5F23F19589E08F2D4D,PinName="self",PinFriendlyName=NSLOCTEXT("K2Node", "Target", "Target"),PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/Engine.KismetSystemLibrary'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultObject="/Script/Engine.Default__KismetSystemLibrary",PersistentGuid=00000000000000000000000000000000,bHidden=True,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=9082388A4177357A574356BB10323A35,PinName="TestObject",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/CoreUObject.Object'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=True,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_VariableSet_0 90E67951413D245BF035F7A5E1F7731C,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=D4FDE4EC41F6E8071353C08EE35A67F2,PinName="Interface",PinType.PinCategory="class",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/CoreUObject.Interface'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=True,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultObject="/Game/AdventureGame/Designer/Blueprints/Core/BPI_PlayerKeys.BPI_PlayerKeys_C",PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=A09D99DC47204415DBEE32AC01C12E01,PinName="ReturnValue",Direction="EGPD_Output",PinType.PinCategory="bool",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="false",AutogeneratedDefaultValue="false",LinkedTo=(K2Node_IfThenElse_0 BAA573A14149CCA89125309AA1567425,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_IfThenElse Name="K2Node_IfThenElse_0" ExportPath="/Script/BlueprintGraph.K2Node_IfThenElse'/Game/AdventureGame/Designer/Blueprints/Key/BP_Key.BP_Key:EventGraph.K2Node_IfThenElse_0'"
 NodePosX=976
 NodePosY=592
 NodeGuid=EF10284D441DF57359916891FD4F9EE3
 CustomProperties Pin (PinId=DCE8D45D4D85E164CE06CFA687EC5D36,PinName="execute",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_VariableSet_0 7458C70F463061A5A38E90910719D91F,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=BAA573A14149CCA89125309AA1567425,PinName="Condition",PinType.PinCategory="bool",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="true",AutogeneratedDefaultValue="true",LinkedTo=(K2Node_CallFunction_0 A09D99DC47204415DBEE32AC01C12E01,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=06A0083C42900B29498FCD85C595D954,PinName="then",PinFriendlyName=NSLOCTEXT("K2Node", "true", "true"),Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_Message_0 7182EBEE46BB3780C00EBA99E932DAB5,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=714D543342308306D8DD65A3DA9A6E58,PinName="else",PinFriendlyName=NSLOCTEXT("K2Node", "false", "false"),Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_VariableGet Name="K2Node_VariableGet_0" ExportPath="/Script/BlueprintGraph.K2Node_VariableGet'/Game/AdventureGame/Designer/Blueprints/Key/BP_Key.BP_Key:EventGraph.K2Node_VariableGet_0'"
 VariableReference=(MemberName="OtherActor",MemberGuid=D341B7944DE0CC040A67FC86B571A38A,bSelfContext=True)
 NodePosX=1024
 NodePosY=704
 NodeGuid=08BAC92347B9AA954878E6A7D2C38664
 CustomProperties Pin (PinId=07B112B248C4853984F1719B7022364F,PinName="OtherActor",Direction="EGPD_Output",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/Engine.Actor'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_Message_0 D842618B4C76B9113069BDA9BEF6947E,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=15271DF74EB980E812D62A82D951624D,PinName="self",PinFriendlyName=NSLOCTEXT("K2Node", "Target", "Target"),PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/Engine.BlueprintGeneratedClass'/Game/AdventureGame/Designer/Blueprints/Key/BP_Key.BP_Key_C'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=True,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_VariableGet Name="K2Node_VariableGet_2" ExportPath="/Script/BlueprintGraph.K2Node_VariableGet'/Game/AdventureGame/Designer/Blueprints/Key/BP_Key.BP_Key:EventGraph.K2Node_VariableGet_2'"
 VariableReference=(MemberName="KeyType",MemberGuid=BCEA10BD4C19AA0E7944C9B57D455D1C,bSelfContext=True)
 NodePosX=1024
 NodePosY=768
 NodeGuid=A3E91B98475339AEB959B1A9AAFE1C90
 CustomProperties Pin (PinId=A3546238436305459124A1B410EF9CCB,PinName="KeyType",Direction="EGPD_Output",PinType.PinCategory="byte",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/Engine.UserDefinedEnum'/Game/AdventureGame/Designer/Blueprints/Core/Enum_KeyType.Enum_KeyType'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="NewEnumerator0",LinkedTo=(K2Node_Message_0 DC1FC5B74CB10DBF4688C8B467E41757,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=D4829AEE495CBA00FC9FA1A339C6769F,PinName="self",PinFriendlyName=NSLOCTEXT("K2Node", "Target", "Target"),PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/Engine.BlueprintGeneratedClass'/Game/AdventureGame/Designer/Blueprints/Key/BP_Key.BP_Key_C'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=True,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_CallFunction Name="K2Node_CallFunction_5" ExportPath="/Script/BlueprintGraph.K2Node_CallFunction'/Game/AdventureGame/Designer/Blueprints/Key/BP_Key.BP_Key:EventGraph.K2Node_CallFunction_5'"
 FunctionReference=(MemberParent="/Script/CoreUObject.Class'/Script/Engine.KismetSystemLibrary'",MemberName="Delay")
 NodePosX=1424
 NodePosY=592
 NodeGuid=25BFFF67497833F649BC5AB618C74591
 CustomProperties Pin (PinId=7F0FAAE24C3DB4A8B27B78A294EE9888,PinName="execute",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_Message_0 0F1F05C4425B155C27702E94A8AB69AC,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=72486F0048987850EF2C1B8C9547A167,PinName="then",PinFriendlyName=NSLOCTEXT("", "5837A039458312FB8320A2871F94AE00", "Completed"),Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CallFunction_6 7B46632E4C74D183CA486A95F733437D,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=61BA7687433181E17E0BAAA61436ACE4,PinName="self",PinFriendlyName=NSLOCTEXT("K2Node", "Target", "Target"),PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/Engine.KismetSystemLibrary'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultObject="/Script/Engine.Default__KismetSystemLibrary",PersistentGuid=00000000000000000000000000000000,bHidden=True,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=404160F54A1AB3E06630F79168644721,PinName="WorldContextObject",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/CoreUObject.Object'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=True,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=True,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=3B19653E4537839D06F3479E164F4CBF,PinName="Duration",PinType.PinCategory="real",PinType.PinSubCategory="float",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="0.2",AutogeneratedDefaultValue="0.2",PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=A9A4151A4D66879F46D80DB5DDD922EE,PinName="LatentInfo",PinType.PinCategory="struct",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.ScriptStruct'/Script/Engine.LatentActionInfo'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="(Linkage=-1,UUID=-1,ExecutionFunction=\"\",CallbackTarget=None)",AutogeneratedDefaultValue="LatentInfo",PersistentGuid=00000000000000000000000000000000,bHidden=True,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_CallFunction Name="K2Node_CallFunction_6" ExportPath="/Script/BlueprintGraph.K2Node_CallFunction'/Game/AdventureGame/Designer/Blueprints/Key/BP_Key.BP_Key:EventGraph.K2Node_CallFunction_6'"
 FunctionReference=(MemberName="K2_DestroyActor",bSelfContext=True)
 NodePosX=1696
 NodePosY=576
 NodeGuid=BB66FD3642F42EFD2986009240802497
 CustomProperties Pin (PinId=7B46632E4C74D183CA486A95F733437D,PinName="execute",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CallFunction_5 72486F0048987850EF2C1B8C9547A167,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=CABE7BAF4B90CAE5CB6C929EC76C06F2,PinName="then",Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=797344DB4B8BF4F3A631EB86BE72721E,PinName="self",PinFriendlyName=NSLOCTEXT("K2Node", "Target", "Target"),PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/Engine.Actor'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_Message Name="K2Node_Message_0" ExportPath="/Script/BlueprintGraph.K2Node_Message'/Game/AdventureGame/Designer/Blueprints/Key/BP_Key.BP_Key:EventGraph.K2Node_Message_0'"
 FunctionReference=(MemberParent="/Script/Engine.BlueprintGeneratedClass'/Game/AdventureGame/Designer/Blueprints/Core/BPI_PlayerKeys.BPI_PlayerKeys_C'",MemberName="fnBPIAddKey",MemberGuid=5DDCBD08481325B5AB238394857DBDAF)
 NodePosX=1200
 NodePosY=576
 NodeGuid=02DEC55C448FC547C4D8249E247F4C54
 CustomProperties Pin (PinId=7182EBEE46BB3780C00EBA99E932DAB5,PinName="execute",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_IfThenElse_0 06A0083C42900B29498FCD85C595D954,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=0F1F05C4425B155C27702E94A8AB69AC,PinName="then",Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CallFunction_5 7F0FAAE24C3DB4A8B27B78A294EE9888,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=D842618B4C76B9113069BDA9BEF6947E,PinName="self",PinFriendlyName=NSLOCTEXT("K2Node", "Target", "Target"),PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/CoreUObject.Object'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_VariableGet_0 07B112B248C4853984F1719B7022364F,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=True,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=DC1FC5B74CB10DBF4688C8B467E41757,PinName="Key Type",PinType.PinCategory="byte",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/Engine.UserDefinedEnum'/Game/AdventureGame/Designer/Blueprints/Core/Enum_KeyType.Enum_KeyType'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="NewEnumerator0",AutogeneratedDefaultValue="NewEnumerator0",LinkedTo=(K2Node_VariableGet_2 A3546238436305459124A1B410EF9CCB,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/UnrealEd.EdGraphNode_Comment Name="EdGraphNode_Comment_9" ExportPath="/Script/UnrealEd.EdGraphNode_Comment'/Game/AdventureGame/Designer/Blueprints/Key/BP_Key.BP_Key:EventGraph.EdGraphNode_Comment_9'"
 CommentColor=(R=0.150000,G=0.150000,B=0.150000,A=0.500000)
 bCommentBubbleVisible_InDetailsPanel=False
 NodePosY=496
 NodeWidth=912
 NodeHeight=352
 bCommentBubblePinned=False
 bCommentBubbleVisible=False
 NodeComment="When a character collides with a key, save it in OtherActor and check if it uses keys"
 NodeGuid=9D51FB28488CFB313D6D348B201AAE1C
End Object
Begin Object Class=/Script/UnrealEd.EdGraphNode_Comment Name="EdGraphNode_Comment_10" ExportPath="/Script/UnrealEd.EdGraphNode_Comment'/Game/AdventureGame/Designer/Blueprints/Key/BP_Key.BP_Key:EventGraph.EdGraphNode_Comment_10'"
 CommentColor=(R=0.150000,G=0.150000,B=0.150000,A=0.500000)
 bCommentBubbleVisible_InDetailsPanel=False
 NodePosX=944
 NodePosY=496
 NodeWidth=960
 NodeHeight=352
 bCommentBubblePinned=False
 bCommentBubbleVisible=False
 NodeComment="If the character uses keys, trigger the character\'s FnBPIAddKey event, and make the key disappear after 0.2 seconds"
 NodeGuid=B78B98E74D797C3E1DB0AF99BE0DCA8F
End Object

Here's the asset diagram from the beginning of this page again, but this time it shows a summary of all the assets and functions you've created and how they combine together to create the key's appearance and behavior:

## Test the Final Key

Go back to your level and add a key of each color. You can now try to pick up the keys in-game by walking over them.

To place a key on the floor after dragging it in from the **Content Browser**, press **End**. This snaps the selected level object to the floor.

## Next Up

In the next section, you’ll change the door blueprint to be able to change color like the keys and remain closed unless the player has picked up the corresponding key.

- [image: Open Doors with Keys] Open Doors with KeysConfigure the BP_DoorFrame blueprint so the doors can change color and only open with the matching BP_Key. (-> designer-03-open-doors-with-keys-in-unreal-engine)

- types
- blueprints
- collision
- attributes
- beginner

On this page

- Before You Begin (-> designer-02-create-a-key-in-unreal-engine)
- Define Key Types and Key Attributes (-> designer-02-create-a-key-in-unreal-engine)
- Define Key Types in an Enum (-> designer-02-create-a-key-in-unreal-engine)
- Define Key Attributes in a Struct (-> designer-02-create-a-key-in-unreal-engine)
- Create Key Colors (-> designer-02-create-a-key-in-unreal-engine)
- Build the Key Blueprint (-> designer-02-create-a-key-in-unreal-engine)
- Set up the Key’s Components (-> designer-02-create-a-key-in-unreal-engine)
- Set Up the Key’s Properties (-> designer-02-create-a-key-in-unreal-engine)
- Test the Key (-> designer-02-create-a-key-in-unreal-engine)
- Set Key Values With a Blueprint Function (-> designer-02-create-a-key-in-unreal-engine)
- Initialize the Keys (-> designer-02-create-a-key-in-unreal-engine)
- Test the Key’s Functionality (-> designer-02-create-a-key-in-unreal-engine)
- Grant Keys to the Player Character (-> designer-02-create-a-key-in-unreal-engine)
- Use a Blueprint Interface to Communicate Between Blueprints (-> designer-02-create-a-key-in-unreal-engine)
- Create a New Player Character (-> designer-02-create-a-key-in-unreal-engine)
- Add the Blueprint Interface to the Player (-> designer-02-create-a-key-in-unreal-engine)
- Store Picked Up Keys (-> designer-02-create-a-key-in-unreal-engine)
- Retrieve the Player’s List of Keys (-> designer-02-create-a-key-in-unreal-engine)
- Make Keys Detect Collisions With the Player (-> designer-02-create-a-key-in-unreal-engine)
- Test the Final Key (-> designer-02-create-a-key-in-unreal-engine)
- Next Up (-> designer-02-create-a-key-in-unreal-engine)

Related documents

Code a First-Person Adventure Game

 [image: Code a First-Person Adventure Game] (-> code-a-firstperson-adventure-game-in-unreal-engine)Open Doors with Keys

 [image: Open Doors with Keys] (-> designer-03-open-doors-with-keys-in-unreal-engine)Design a Puzzle Adventure

 [image: Design a Puzzle Adventure] (-> design-a-puzzle-adventure-game-in-unreal-engine)Blueprint Foundations

 [image: Blueprint Foundations] (-> blueprint-foundations)

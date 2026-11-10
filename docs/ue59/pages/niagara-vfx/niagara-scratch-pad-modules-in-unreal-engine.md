# Scratch Pad Modules in Niagara

https://dev.epicgames.com/documentation/en-us/unreal-engine/niagara-scratch-pad-modules-in-unreal-engine?application_version=5.9

> Learn about using Scratch Pad Modules, Niagara's visual-scripted local modules.

This tutorial is an introduction to scratch pad modules in Unreal Engine. It builds upon a single Niagara system to explore the fundamentals of this feature. The tutorial is less about the final result, and more about learning different ways to use the feature.

## Scope

Scratch pad modules are local Niagara modules that can be authored using visual scripting graphs. There are two asset types that support the creation of Scratch Pad Modules: Niagara** emitters** and Niagara** systems**. The modules are limited in scope to the system or emitter they are created within, and don't appear as standalone assets in the Content Browser.

### Emitter-Based Scratch Pad Module

If a scratch pad module is made inside a Niagara emitter asset, it will apply to all uses of that emitter in whatever Niagara systems it’s been added to. In the `NE_Example` emitter asset below, the **ScratchModuleInEmitter** module appears in the modules list, and its stack entry is editable within the emitter.

[image: An emitter asset (NE_Example).]

However, a scratch pad module made in an emitter cannot be used by any other system or emitter assets, and will not appear in a Niagara system's modules list. The example below shows the `NE_Example` emitter asset used within the `NS_Example` Niagara system. Just like other modules, the scratch pad module is locked (can be disabled but not deleted) when the emitter is instanced in a Niagara system.

[image: An emitter (NE_Example) instanced inside a Niagara system asset (NS_Example).]

### System-Based Scratch Pad Module

If the Scratch Pad Module is made inside a Niagara System asset, it can be used on any Emitters inside that system. As is the case for all Scratch Pad Modules, they are unavailable to Emitters in other Niagara Systems.

[image: A Niagara system with a scratch module applied to multiple emitters.]

### Niagara Module Script

A scratch pad module can be exported as a Niagara module script asset. This export process is covered more in-depth in the Share Scratch Modules (-> niagara-scratch-pad-modules-in-unreal-engine) section of this tutorial. Niagara module scripts are entirely separate assets that appear in the Content Browser, and can be used by any Niagara emitter and in any Niagara system within your project. This is comparable to how material nodes can be converted into material functions, which then can be used by separate material assets throughout a project.

[image: A Niagara module script asset in the Content Browser.]

## Getting Started

To create a Scratch Pad Module, you'll need to work within a Niagara System asset or Niagara Emitter asset. This tutorial uses a simple grid-spawned Niagara System as the basis for working with Scratch Pad Modules.

### Create a Niagara System

> **note:** This section explains how to create a Niagara system for new users and those who want to follow this tutorial from beginning to end. If you already have created a Niagara system, you can use that to follow the rest of the tutorial.

To create a new Niagara system, follow these steps:

- In the **Content Browser**, right-click, then click Niagara System. [image: The Niagara System option in the right-click menu.]

- In the **Template** menu, select **Minimal**, and then click** Create**. [image: The template menu with Minimal emitter type selected.]

- Name the new Niagara system (for example, **NS_Minimal**). Open the asset by double-clicking or pressing **Enter**. [image: The Niagara System asset in the Content Browser.]

By default, the system will have a system node (blue) and a single **Minimal** emitter (orange).

[image: The Niagara system with a Minimal default emitter.]

### Spawn Particles

To make the emitter spawn particles, follow these steps:

- Navigate to the Minimal emitter.

- In the Emitter Update section, click Add (+).

- Search for and click Spawn Particles in Grid option.

[image: The Spawn Particles in Grid option]

> **tip:** You can add often-used modules to the top of the **Add New Module** menu. Hover over the module's name and click on the ******star** (⭐) icon. The icon will change from an outline to a filled-in star. Close and reopen the menu to see your module listed in the **Suggested** section. To remove it, click the **star **icon again.

#### Fix Dependency Issue

The new module will have a red dot next to its name, indicating an error. In this case, the **Spawn Particles in Grid** module also needs a **Grid Location** module to work correctly.

To fix this issue, click on the module. Review the issue in the **Details** panel, and then click **Fix Issue**.

[image: Module with dependency error and Fix Issue button]

A **Grid Location** module will be added to the **Particle Spawn** section of the emitter. After that happens, the dependency will be met, and the error icon in the **Spawn Particles in Grid** module will be removed.

[image: The Grid Location module.]

### Emitter Settings

To configure the emitter for this tutorial, follow these steps:

- On the **Minimal** emitter, select **Spawn Particles in Grid**.

- In the **Details** panel, do the following: - Set X Count to 10. - Set Y Count to 1. - Set Z Count to 1. - Set Spawn Time to 0.

- On the Minimal emitter, select Initialize Particle.

- In the **Details** panel, set the following: - Set **Lifetime Mode** to **Direct Set**. - Set **Lifetime** to 5. - Set **Color Mode** to **Direct Set**. - Set **Color** to 1, 0, 0. - Set **Position Mode** to **Simulation Position**. - Set **Position Offset** to 0, 0, 0. - Set **Mass Mode** to ******Unset** / (Mass of 1). - Set **Sprite Size Mode** to **Uniform**. - Set **Uniform Sprite Size** to 10. - Set **Sprite Rotation Mode** to **Unset**. - Set **Sprite UV Mode** to **Unset**. - Set all other mesh and ribbon attributes to **Unset**.

In this example, the **Grid Location** module is left with its default values.

## Create a Scratch Pad Module

On the Minimal emitter, click **Add (+)** next to the **Particle Spawn** header. Search for and select the **New Scratch Pad Module** option.

[image: Adding a New Scratch Pad Module.]

The scratch module graph opens automatically as a tab next to the original **System Overview** tab. A **Local Modules** tab appears below the **Preview** window, next to the **Parameters** and **User Parameters** tabs.

[image: The Local Modules tab.]

Rename your scratch module to something descriptive (for example, **ApplyOffset**).

While module names will appear as one word (**ApplyOffset**) in the **Modules** list, they are displayed with spaces based on letter capitalization (**Apply Offset**) in search menus and for stack entries.

In the **System Overview** graph, the **Apply Offset** module is now listed as a module in the Minimal Emitter. The new scratch module will also appear in the search menus and be labeled as a scratch pad (rather than Niagara) item.

[image: The ApplyOffset module on the Minimal emitter.]

### Navigation

To open the scratch pad module's graph, you can do any of the following:

- Click the scratch module's tab, located next to the **System Overview** tab.

- Select the scratch module in the emitter, then click the scratch pad button in the **Details** panel.

- Double-click the scratch module stack entry in the emitter.

- Double-click the scratch module in the **Local Modules** > **Modules** list.

### Data Flow

Like other graphs in Unreal Engine, the data in a module flows from left to right. The data starts at the red **Input Map** node, flows through the white **Niagara Parameter Map** line, and ends at the green **Output Module** node.

You can use **Map Get** nodes to extract data from this **Niagara Parameter Map** line, and use **Map Set** nodes to set data into it.

[image: Data flowing from left to right in the scratch pad module graph.]

## Add Location Offset

Next, add some functionality to the scratch pad module, starting with a location offset.

### Get Position Attribute from Particles

On the **Map Get **node, click the **Add +** pin, then search for and click the **PARTICLES Position **parameter. This is data that is held on each individual particle.

These parameters are written as one word, with a period between the namespace and the name (

NAMESPACE.Name). If you are accessing parameters (especially user parameters) using code or Blueprints, use the version with the period, not spaces.

[image: The Position parameter.]

[image: The PARTICLES Position parameter in the Map Get node.]

### Add a Vector Input

On the **Map Get** node, click the **Add (+)** pin, then search for and click the **Vector** (INPUT.Vector) option.

[image: The Vector parameter.]

[image: The Vector parameter on the Map Get node.]

### Data Namespaces

The text inside the colored blocks in parameter names specifies which namespace the data is coming from.

The **Position** comes from the **PARTICLES** namespace, meaning the data is held on the particles. This data is persistent from frame to frame throughout the particle's lifetime.

The **INPUT** namespace, used for the **Vector**, indicates that its data comes from the module, which a user can modify directly.

## Calculate Location Offset

Drag from the **PARTICLES.Position** pin, then search for and click the **Add** node.

[image: PARTICLES.Position to Add node]

By default, the inputs of the **Add** node will be dark blue, showing that it is a type of wildcard called the Niagara Numeric. It accepts positions, vectors, floats, and integers. When connected to other nodes with specific types, the pin and connection wire change to reflect the data type used in those pins.

Drag from the **INPUT.Vector** pin to the second pin of the Add node. It will turn yellow to show that it is a vector type.

[image: INPUT.Vector to Add node]

### Update Data

After adding the offset amount (**INPUT.Vector**) to the **PARTICLES.Position**, the particle data needs to be updated using a **Map Set** node.

In the existing **Map Set **node, click the **Add (+)** pin, then search for and click **PARTICLES.Position**.

[image: PARTICLES.Position in Map Set node]

Connect the output of the Add node to the Map Set node's PARTICLES Position pin. This will update (overwrite) the PARTICLES.Position value (accessed in the Map Get node) with the new value.

[image: Add node to PARTICLES.Position in Map Set]

## Apply Graph Changes

Click either the **Apply** or **Apply & Save** button to commit the changes in the graph to the scratch module and its stack entries in the Niagara system.

[image: The Apply and Apply & Save buttons]

In the **System Overview** graph, select the **Apply Offset** scratch module stack entry on the Minimal emitter. The **Vector** input created in the prior steps is now a valid module input.

[image: The Vector input in the scratch module.]

To test the module's functionality, enter a value into the **Vector** input and note how it changes the system's visual output in the Niagara system viewport. In this example, changing the Z value from 0 to 200 moves the red particles up 200 units (centimeters).

[image: The Z value set to 0]

[image: The Z value set to 200]

## Module Context

You can set up modules to be visible and usable only in specific emitter contexts.

### Set Module Usage Bitmask

In the **Apply Offset** module graph, click anywhere in the background of the graph. This brings up the module settings in the **Details** panel. The first setting in the list is the **Module Usage Bitmask**, which defines where the module can be created and moved to. Click the dropdown menu to check, search, and set the various context options.

The following contexts are available:

- Function

- Module (enabled by default)

- Dynamic Input

- Particle Spawn Script (enabled by default)

- Particle Update Script (enabled by default)

- Particle Event Script (enabled by default)

- Particle Simulation Stage Script (enabled by default)

- Emitter Spawn Script

- Emitter Update Script

- System Spawn Script

- System Update Script

You can limit where and how the module can be used by checking or unchecking the items in the dropdown menu.

[image: The Module Usage Bitmask options.]

To try this out, disable the **Particle Update Script** option, then press the **Apply** button.

[image: Disabling the Particle Update Script option.]

Go to the **System Overview** graph view, and try to drag the **Apply Offset** module stack entry into the **Particle Update** section. The bright blue drop line will not appear between the entries of the emitter, and a warning tooltip will appear that says: "This module can't be moved to this section of the stack because it's not valid for this usage context."

[image: The warning tooltip]

Additionally, this context limitation applies to the search results of that restricted section. In this case, the **Apply Offset** module doesn't appear in the **Particle Update** section's search.

[image: Apply Offset not valid in Particle Update search]

The Apply Offset module is still available in the Particle Spawn search results.

[image: ApplyOffset valid in Particle Spawn search]

Enable the **Particle Update Script** context to continue following this tutorial.

### Particle Spawn and Particle Update

Modules located in the **Particle Spawn** section of the emitter only execute when the particle is created (spawned).

Modules located in the **Particle Update** section of the emitter execute every tick.

To demonstrate, drag the **Apply Offset** stack entry from **Particle Spawn** to a spot under the **Particle Update** section. Change the Vector input Z value to 1. In the viewport, the red dots will move upward, as the 1cm offset is applied to the particles every tick.

[image: Apply Offset moved to Particle Spawn section and Vector Z set to 1]

When you're done, drag it back into the **Particle Spawn** section to continue following the tutorial.

## Rotation Offset

There are a few ways to let the user (in this case, a VFX artist) rotate the offset around an axis. In this section, you will add rotation inside the module. Later in the tutorial you will learn how to leverage dynamic inputs for user-entered data.

### Add Node

Right-click on the graph background, search for "rotation", and then click XYZRotationToQuaternion.

[image: The XYZ Rotation to Quaterion node.]

### Create Inputs

The next step is creating inputs that the user can access and enter values into. The easiest way is to drag a line from the desired pin (in this example, X, Y, and Z) onto the **Add (+)** icon in the **Map Get** node. This creates a corresponding INPUT parameter of the same name and correct type. Do this for all three float values (green pins, XYZ) in the **Rotation to Quaternion** node.

[image: The XYZRotationToQuaterion node connected to Map Get.]

### Calculate Rotation Offset

Drag from the **Map Get**'s **INPUT.Vector** pin, then search for and click the **Multiply Vector With Quaternion** node. Drag the output pin of the **XYZRotation to Quaternion** node to the **Quaternion** input pin in the **Multiply Vector with Quaternion** node.

[image: The INPUT.Vector connected to Multiply Vector with Quaternion.]

Connect the output pin of the **Multiply Vector with Quaternion** node to the second pin of the **Add** node, replacing the plain **INPUT.Vector** value with the new multiplied **Vector** and **Quaternion** value.

[image: Rearrange nodes to put Multiply Quaternion node between the INPUT.Vector and Add node.]

### Apply Rotation Offset Changes

Click **Apply & Save**, then open the **System Overview** graph.

Select the **Apply Offset** stack entry (located in the **Particle Update** section of the emitter), and set the Y value to 30. This causes the red particles to move upward and to the right.

[image: Vector Y set to 30, particle trajectory changed.]

## Parameters Tabs

There are two tabs under the viewport in a Niagara system with different data and interaction options.

### Parameters

The Parameters tab lists all the parameters included within a Niagara system. This includes:

- **System Attributes** (such as  SYSTEM.Age, SYSTEM.LoopCount)

- **Emitter Attributes** (such as EMITTER.Age, EMITTER.DistanceTraveled)

- **Particle Attributes** (such as PARTICLES.Position, PARTICLES.SpriteSize)

- **Module Outputs** (such as OUTPUT.GRIDLOCATION.GridSpacing, OUTPUT.PARTICLESTATE.FirstFrame)

- **Engine Provided** (such as ENGINE.DeltaTime, ENGINE.EMITTER.NumParticles, ENGINE.OWNER.Velocity)

- **Stage Transients** (such as TRANSIENT.FirstFrame, TRANSIENT.ScalabilityExecutionState)

There are also headings in this tab that will be empty by default:

- **User Exposed** (same as in the User Parameters tab)

- **Stack Context Sensitive**

- **Niagara Parameter Collection**

[image: The Parameters tab.]

## User Parameters

The **User Parameters **tab lists all the user parameters created in a Niagara system. It is empty by default. The user parameters here are the same as in the **User Exposed** section of the **Parameters** tab.

[image: The User Parameters tab with an example USER.test parameter.]

### View-Dependent Changes & Renaming

When you're viewing the graph for a specific module, like **Apply Offset**, the **Parameters** list is filtered down to the inputs that you currently have available to you.

[image: The same inputs in Map Get and the Parameters tab.]

In these tabs, you can rename your inputs (like INPUT.RotationAngleX). As with other parts of Unreal Engine, click twice on the input name or press **F2**.

[image: Renamed inputs in the Parameters tab.]

When you click **Apply & Save**, the new names are visible in the module's stack entry.

[image: Renamed inputs in the Details Panel.]

## Edit Hierarchy Tool

In the **Edit Hierarchy** window, you can order the inputs, add tooltips, and manage dependencies.

To access the **Edit Hierarchy** interface, open the scratch pad module you want to edit (in this case, the **Apply Offset** module).

In the **Parameters** tab, click **Edit Input Hierarchies**.

[image: The Edit Input Hierarchy button in the Parameters tab.]

This opens the **Edit Hierarchy** window.

[image: The Edit Hierarchy window.]

From the left column, drag the relevant inputs into the center column, where the blue highlight appears.

[image: The INPUT.Vector added to the Hierarchy list]

Drag the inputs in the center column to reorder them.

### Defaults

As in the Details panel, you can access the item's Default Value and Variable settings.

- **Default Mode**: Options include **Binding**, **Custom**, **Fail if Previously Not Set**, and the default value**.**

- **Default Value**: Based on type, such as float or vector.

- **Tooltip (and localization options)**: Add helpful implementation details, units, caveats, or other notes that are valuable to users.

- **Display Unit**: Options include **Centimeters**, **Lumens**, **Hours**, **Gigabytes**, **Grams**, **Degrees**, and the default **Unspecified**.

- **Advanced Display**: False by default.

- **Display in Overview Stack**: False by default.

- **Inline Parameter Sort Priority and Color Override**: Disabled by default.

- **Edit Condition and Visible Condition** (Input Name and Target Values): None and 0 elements by default.

- **Property Metadata**: 0 elements by default.

- **Alternate Aliases for Variable**: 0 elements by default.

- **Widget Type**: Default.

- **Min Value**: 0 by default.

- **Max Value**: 1 by default.

- **Step Width**: 1 by default.

- **Broadcast Value Change On Commit Only**: False (set to true if you only want values to be updated when committed, not when typing).

[image: Default Value and Variable sections of the Rotation Angle X input]

### Tooltips

Add text into the **Tooltip** field of the **Rotation Angle X** input, then click **Apply** or **Apply & Save**.

[image: The Tooltip field]

Then, go to the **System Overview** graph, select the **Apply Offset** module, and hover over the **Rotate Angle X** option in the **Details** panel. Your tooltip will be the first line in the popup, followed by the **Name** and **Type** information of the input you're hovering over.

[image: The Tooltip in the Details panel.]

### Display Unit

In the **Edit Hierarchy** window (or the **Details** panel), change the **Display Unit** of the value. Select the **Rotation Angle X** input, and change the **Display Unit** from **Unspecified** to **Degrees**.

[image: Display Unit set to Degrees]

Then, change the **Vector** input's **Display Unit** to **Centimeters**.

[image: Display Unit set to Centimeters]

## Local Parameters

When making complex modules, you can leverage local parameters to help keep your module graph organized and easy to read. Separating the graph by operations is a common and generally recommended approach.

Local parameters only exist in the module, and are not persistent from frame to frame. They are often used for temporary value storage within a graph.

### Split Inputs Between Different Map Gets and Map Sets

Right-click the **PARTICLES.Position** pin from the **Map Get** and click **Remove**. Disconnect the node (**Alt + click**).

Near the **Multiply Vector with Quaternion** node, add a **Map Set** node (listed as **Parameter Map Set** in the right-click menu). Connect it to the **Niagara Parameter Map** line, between the **Input node** and the **Map Set** node.

[image: The Map Set node]

Drag the **Multiply Vector with Quaternion** output pin to the **Add (+)** icon on **Map Set**. This creates a local parameter of the same name and type as the pin you pulled from. In this case, it creates **LOCAL.Vector**. Rename this to something more descriptive (for example, **LOCAL.Offset**).

[image: LOCAL.Offset in Map Set node]

On the right side of the **Map Set** node, drag from the white **Dest** pin, then search for and click the **Map Get** option.

[image: The Map Get node connected to the Map Set node]

Click **Add (+)**, then search for and select the **LOCAL.Offset** created in the previous step.

[image: LOCAL.Offset in new Map Get node]

Now you can use that cached Offset value in another organized section of the graph.

### Break & Rearrange

When rearranging or adding nodes in any Unreal Engine graph, you might need to disconnect the wires connecting specific nodes. Use **Alt + Left Click** on a pin or wire to disconnect it.

To grab and move a pin connection instead, hold **Ctrl + Left Click** to pick up the wire. Release over a valid pin. The connection will be deleted if you release over empty graph space.

To remove, rename, reorder, or perform other actions on a pin, right-click to bring up a menu and click the desired action.

[image: The Remove Pin option in the right-click menu.]

## Transformation Space & Position Offset

There are three different types of **Transformation Spaces**:

- **Simulation**: Calculations are done in whatever context (local or world) that is set in the emitter's **Properties** section, where **Local Space** is set to either true or false.

- **World**: Calculations are done in the context of the world values.

- **Local**: Calculations are done in the context of the system itself, regardless of where it is in the world.

### User-Set Transform Space

For this example, let’s give the user an option to choose which **Transformation Space** to use in this module.

Create a **Transform Vector** node. Drag the **Map Get**'s Offset pin to the **InVector** pin of the **Transform Vector** node.

[image: The Transform Vector node]

To let the user set the **Source Space** as an input, drag the **Transform Vector**'s **Source Space** pin back to the **Map Get** node's **Add (+)** icon. This creates an input of the same name and type.

[image: The Source Space input]

Add another **Map Set** node, and connect it between the previous Map Set and the final Map Set. Create a **LOCAL.Offset** entry on the **Map Set** node, and drag it to the **Transform Vector**’s **OutVector** pin.

[image: Set LOCAL.Offset]

### Re-Implement Position Offset

From the new **Map Set** node, create a **Map Get** node, and click the **Add (+)** button to access the **LOCAL.Offset** variable.

[image: The Map Get node]

Next, click the **Add (+) **button to access the **PARTICLES.Position** parameter.

[image: PARTICLES.Position in Map Get]

Add the **LOCAL.Offset** to the **PARTICLES.Position** using the **Add** node from before.

[image: Using the add node to add LOCAL.Offset]

> **tip:** If you want to change the order of the elements in a node, right-click on one of the items and click **Move pin up**.

Connect the **Add** node to the **Map Set** node using the **PARTICLES.Position** pin, and drag the **Dest** to the final **Output Module**.

[image: Connecting Add, Map Set, and Output Module.]

### Apply Changes

[image: The scratch pad module graph so far]

Click** Apply** or **Apply & Save**, then open the **System Overview** graph. Select the **Minimal** emitter, then select the **Apply Offset** stack entry on it. In the **Details** panel, there's now a **Source Space** input option.

[image: Source Space in the Details Panel]

## Add Comments

Comments visually group nodes together, and often include text to describe that portion of the graph or any other notes pertinent to that section. Like with text-based code, leaving comments throughout your work is considered a best practice. Comments make it easier for other developers to understand your decisions.

Open the **Scratch Module** graph. Select nodes in the graph, and press the **C** key to create a comment. Rename it to be descriptive (for example, **Initial Offset Vector**).

[image: Initial Offset Vector comment]

With the comment box selected, the **Detail** panel displays the available settings: **Color**, **Font Size**, **Show Bubble When Zoomed**, **Color Bubble**, **Move Mode**, and the **Details** field.

[image: The comment Details panel]

Commenting provides visual and textual information about what's happening in each section of the graph. Comments on this example graph could include: **Initial Offset Vector**, **Transform Into Space**, and **Set Position**. Each comment box here includes the initial **Map Get** and the subsequent **Map Set** node, where the next **Map Get** starts the next section.

[image: The scratch pad module graph with comment boxes throughout]

## Module Outputs

Module outputs can supply extra data to the user without having to fill in particle data. Since emitter stack entries are executed from top to bottom, module output data is available only to stack entries below it. Knowing the outputs and other parameters written to them can be helpful when figuring out how to work with the data in your particle system.

### Show Parameter Writes

Select any module in the Minimal emitter. In the **Details** panel, select the **gear (⚙️)** icon, and enable **Show Parameter Writes**. The **Parameter Writes** section is collapsed by default. Click the **arrow (🔽)** to expand the list and see all the outputs the stack entry writes to.

In the **Apply Offset** scratch pad module stack entry below, the **Parameter Writes** section only includes **PARTICLES.Position**.

[image: The Show Parameter Writes option]

### Use Module Outputs

Select the **Grid Location** module stack entry, and expand the **Parameter Writes** section. It writes to **PARTICLES.Position**, as well as other **OUTPUT** parameters.

[image: The Parameter Writes section for the Grid Location module]

As an example, let’s use **OUTPUT.GRIDLOCATION.GridUVW** to change the color of our particles.

To demonstrate this, open the **Spawn Particles in Grid** stack entry, then change the X, Y, and Z values to 10. You'll see a cube-shaped group of particles, rather than a line of them.

[image: Spawn Particles in Grid XYZ set to 10]

Then, in the **Particle Spawn** section of the emitter, click the **Add (+)** button to create a **Color** module.

[image: Color module with default Color setting]

Using the drop-down menu next to the **Color **swatch, search for and click both **Make Linear Color from Vector** and **Float.**

[image: Make Linear Color from Vector and Float]

Using the dropdown menu next to the new **Vector (RGB)** field, search for and click **OUTPUT.GRIDLOCATION.GridUVW**.

[image: Vector RGB set to OUTPUT.GRIDLOCATION.GridUVW]

Now, the RGB values are determined by the **OUTPUT.GRIDLOCATION.GridUVW** information.

[image: Colors from OUTPUT.GRIDLOCATION.GridUVW]

### Create Module Outputs

Open the **Apply Offset** scratch pad module graph. In the **Set Position** comment section (the last Map Get and Map Set), drag the Map Get's LOCAL.Offset pin to the **Add (+)** pin of the **Map Set **node.

[image: Set Position LOCAL.Offset to Map Set]

> **tip:** Double-click a connection wire to create a reroute node, then move it as needed to reduce overlap and increase visibility in the graph. You can also manually create reroute nodes through the graph's right-click menu.

Right-click the new **LOCAL.Offset** pin in the **Map Set** node. Click **Change Namespace** > **OUTPUT**.

[image: Changing the namespace to OUTPUT]

This changes the **LOCAL** namespace to **OUTPUT**. It also adds a namespace modifier (for example, **MODULE**) and appends the module name (**Apply Offset**). The result is** OUTPUT.MODULE.Offset** in the **Map Set** node.

[image: LOCAL.Offset changed to OUTPUT.MODULE.Offset]

Click **Apply**, then open the **System Overview** graph. Select the **Minimal** emitter's **Apply Offset** stack entry, and expand the **Parameter Writes **section in the **Details** panel. The **OUTPUT.APPLYOFFSET.Offset** parameter will be in the list and available for use by any module stack entries below it.

### Set Parameter Directly

For example, let's query the offset. Click the **Add (+)** button to create a **Set Parameters** stack entry underneath the **Apply Offset** stack entry. This module appears as **Set new or existing parameter directly** in the search menu.

[image: Set new or existing parameter directly]

In the **Details** panel, click the **Add (+)** button to create a **Vector** (PARTICLES.Vector) item in the list.

[image: Add Vector parameter]

In the new entry, click the **arrow** to open the type menu, then search for and click **OUTPUT.APPLYOFFSET.Offset**.

[image: PARTICLES Vector set to OUTPUT.APPLYOFFSET.Offset]

## Dynamic Module Inputs

When writing a module script, there are a few options for where the functionality can be set up. Many dynamic inputs are available, which can give the user more options and power when implemented.

For example, you can rework the **Quaternion** in the **Apply Offset** module. Open the **Apply Offset** graph, and navigate to the first **Map Get** in the graph (the one with the separate X, Y, and Z Map Get inputs connected to the **Quaternion** node).

[image: Initial Offset Vector section]

Handling the **Quaternion** in this way has some limitations. The rotation angle is exposed separately as X, Y, and Z, and it assumes the angle type is in degrees. These are the only options provided to the user.

It could be more powerful for the user to expose the quaternion as an input, and then let the pre-existing dynamic inputs do the work for us. In this case, you can use the quaternion directly, instead of the rotation angles in the first **Map Get**.

### Set Up Dynamic Inputs

Right-click and remove each of the X, Y, and Z pins from the first **Map Get** node. Also, delete the **XYZRotation to Quaternion** node.

[image: Map Get with INPUT.Vector, Multiply Vector with Quaternion, Map Set]

In Map Get, click the **Add (+)** pin to search for and click **INPUT.Quaternion** (Quat). Rename it to something descriptive (for example, **INPUT.RotationQuaternion**). Drag that pin to the **Quaternion** pin of the **Multiply Vector With Quaternion** node.

[image: INPUT.RotationQuaternion added to Map Get]

Click **Apply**, then open the **System Overview** graph. The **Rotation Quaternion** is now available in the **Apply Offset** module's** Details** panel, and the separate X, Y, and Z options have been removed.

[image: The Rotation Quaternion in the Details panel]

### Use Dynamic Inputs

In the emitter’s **Apply Offset** stack entry, open the drop-down for the **Rotation Quaternion** item, then search for and click **Make Quaternion**.

[image: Make Quaternion]

A user can now choose any of the options predefined by the dynamic input. They can change the **Angle Type**, select **XYZ Rotations** as the **Quaternion From**, and specify a different **Coordinate Space**. These are all built-in options that Niagara provides.

[image: Make Quaternion applied]

### Considerations

When figuring out how to author and present the modules, consider what's easiest for you to manage and what's most powerful and usable for the user. Try to find a balance between what’s flexible for your end user without being too open-ended.

In this case, the drawback is that a "Rotation Quaternion” might be a bit esoteric or unclear for the user.

To address such potential roadblocks, add tooltips to your inputs. Select the input from the **Parameters** list, and enter a tooltip in the **Details** panel **Tooltip** field. For this input, you can enter something like, "Use the Make Quaternion Dynamic Input." This gives the user a clear next step.

[image: INPUT.RotationQuaternion tooltip]

Click **Apply**. Open the **System Overview** graph, select the **Apply Offset** module, and hover over the **Rotation Quaternion** item in the **Details** Panel. The custom text will appear as the first line in the tooltip.

[image: The Tooltip in the Details Panel]

## Module Notes

Every module, including scratch pad modules, has a **Note** field available. These **Module Usage Notes** appear at the top of the **Details** panel when a module's stack entry is selected in an emitter. You can put information here about how the module works, including any quirks about its usage, and dependency notes.

[image: Module Usage Note in the Details panel]

### Add Module Notes

To find and edit this option, click the graph background to deselect any nodes. This populates the Details panel with information about the module as a whole, rather than a specific part of it. Enter information about the module to the **Note Message** field.

For the **Apply Offset** scratch module, a helpful tooltip could be: "This module applies an offset to the particle position. Use the Make Quaternion Dynamic Input as a utility to provide the Quaternion."

[image: The Note Message field]

### View Module Notes

Click Apply, then open the **System Overview** graph. Select the **Apply Offset** scratch module stack entry, and the **Module Usage Note** will be at the top of the Details panel.

[image: The Module Usage Note in the Details panel]

### Dismiss and Show Notes

Notes (and other issues or warnings) at the top of the **Details** panel can be hidden by clicking **Dismiss**.

[image: The Dismiss button]

Notes can be made visible again by clicking the** gear (⚙️) **icon at the top of the module, and clicking U**ndismiss All Stack Issues**.

[image: Undismiss All Stack Issues]

When dismissed on one stack entry, the **Notes** section will appear on newly added stack entries of the same module type.

## Managing Parameters

All the parameters and inputs are listed in the **Parameters** tab.

[image: The Parameters tab]

The list might include parameters and inputs that are no longer in use in your module.

### Parameter Usage Stats

The easiest way to identify what parameters and inputs need to be cleaned up is to check the field on the right of each input. This shows the references for the reads and writes for each input. In this case, all three of the **INPUT.RotationAngle** parameters (X, Y, and Z) are not in use, because those entries are all listed as having 0 reads and 0 writes (**0|0**).

[image: Highlighted inputs have 0 reads and 0 writes (no usages)]

### Remove Unused Parameters

Even when its usages are deleted in a module graph, parameters will remain in the **Parameters** list. You’ll need to manually delete them when you no longer need them.

To remove unused parameters like these, select them in the Parameters list and press the **Delete** key, or right-click on the parameter and click **Delete**.

## Data Interfaces

These special data types take information from the general editor and pass it into Niagara, so you can use it to direct your particles or influence your simulation.

### Access Data Interfaces

To access data interfaces, open your scratch module graph. On a **Map Ge**t node, click the **Add (+)** pin to open the **Make New** drop-down. Click **Data Interface** to show a list of options.

[image: Data Interface options]

Most of these data interfaces have modules already written for them in the engine. Sometimes, you might want to add that functionality directly into your scratch module instead.

### Work With Data Interfaces

For this example, create space between the Transform Into Space and Set Position sections on the graph.

[image: Space created in the graph]

Add a **Map Set **node before the **Set Position** section, and reroute the pins. Connect the **Map Set **from **Transform Into Space** into the new **Map Set** node, and drag the **Dest** pin on the Map Set into the **Map Get** in **Set Position** and subsequent **Map Set**.

[image: New Map Set]

Create a **Map Get** node, and add an** INPUT.CameraQuery** input.

Drag the **INPUT.CameraQuery** pin to an empty space on the graph to open the **Source Filtering** menu. The first entry is specific to the data interface selected, and when expanded, lists all the methods that are available on that data interface.

[image: New Map Get with Camera Query input]

For this example, click **Get Camera Properties CPU/GPU**. This provides the **Camera Position**, **Forward Vector**, **Up Vector**, and **Right Vector** (all in World context). You can use this data to apply an offset towards or away from the camera.

[image: Get Camera Properties CPU/GPU]

Add an **INPUT.Float** to the **Map Get**, and name it something descriptive (for example, **CameraOffsetScale**).

[image: INPUT.Float connected to INPUT.CameraOffsetScale]

Use a **Multiply** node to multiply the** Forward Vector World** by the new** INPUT.CameraOffsetScale **float.

[image: Multiply Camera Properties by Camera Offset Scale float]

Add the **LOCAL.Offset** to the **Map Get** node. Add it to the **Multiply** node's result.

[image: Add Local Offset to Multiplication result]

In the Map Set node n this new section, add **LOCAL.Offset**. Then, connect the result of the **Add** node to that **LOCAL.Offset** pin.

[image: Addition result connected to Map Set LOCAL.Offset]

### Use Data Interface

Click **Apply**, then open the **System Overview** graph. Select the **Apply Offset** scratch module stack entry. The **Details** panel now has a **Camera Query** section with additional options for the user, including the **Camera Offset Scale** float input.

[image: Camera Query in Details panel]

Change the Camera Offset scale to -200, to see the offset in action.

[image: Camera Offset Scale set to 0]

[image: Camera Offset Scale set to 200]

## Hide Fields

As a module author, you can hide fields you don't expect or want the user to change.

In this example, you can expect that the user won’t need to edit the **Player Controller Index** or **Require Current Frame Data** fields. Therefore, you can hide these options.

Open the **Apply Offset** scratch pad module graph. In the **Details** panel (or the **Edit Hierarchy** view), enable the **Advanced Display** option. This determines whether this input should be visible if the user has expanded the **Advanced** section.

[image: Advanced Display]

In the **System Overview** graph, select the **Apply Offset** stack entry. In the **Details** panel, the extra data interface information is now hidden inside the Advanced options section. The information can be viewed by opening up the Advanced section of the panel. Click the **arrow **button to expand this section, and click again to collapse it.

[image: Advanced panel, Camera Query hidden]

This setup allows more advanced users to change these settings, like if they're working with a split-screen game and want to manually set the camera, while removing clutter for most users that won't need to change those settings.

[image: Advanced panel, Camera Query shown]

You can use the **Edit Hierarchy** interface to make the **Camera Offset Scale** input available in the **Details** panel even when your **Camera Query** is set to be in the **Advanced** section.

In the scratch pad module graph, open the **Parameters** tab, then open the **Edit Hierarchies** panel. Drag **INPUT.CameraOffsetScale** from the left column into the center column to rearrange the order.

[image: Camera Offset Scale in hierarchy]

Click **Apply**. In the **System Overview** graph, select the **Apply Offset** module stack entry. In the** Details** panel, the **Camera Offset Scale** input will be included in the main list of inputs, even with the **Advanced **panel collapsed.

[image: Camera Offset Scale in Details panel without Camera Query settings]

## User Parameters

User parameters let you change Niagara settings without repeatedly opening and editing the Niagara System or module graph. When a Niagara system is added to a level, the user parameters are available in the asset’s **Details** Panel. This can speed up workflows since users can adjust those parameters directly within the scene’s context.

There is a cost associated with user parameters. Every time a user parameter is adjusted, the parameters get pushed to the corresponding execution context, and all parameters within that same context are updated:

- System & Emitter Spawn

- System & Emitter Update

- Particles Spawn & Particle Updates (per Emitter)

- Simulation Stages

Using a data interface as a user parameter is generally discouraged due to performance concerns. The engine makes a copy of the data interface per instance, and because they are UObjects, they get garbage collected. The main cost of a data interface is when you create an instance. After it’s created, it has the same overhead as if it were elsewhere in the stack.

### Promote Module Input

Module inputs can be promoted to user parameters. To promote a module input, follow these steps:

- In the System Overview graph's Minimal emitter, select the Apply Offset stack entry.

- Click the Dynamic Input dropdown next to the Camera Offset Scale input.

- Search for and click Read from new User parameter.

[image: The Read from new User parameter]

A new user parameter is created with the same name and value as the **Details** panel field. The display name for this parameter is **USER Camera Offset Scale**. If you want to access this or other user parameters in code or Blueprints, it must be formatted as `USER.CameraOffsetScale` or `User.CameraOffsetScale.`

[image: The USER Camera Offset Scale user parameter in the Details panel.]

### Edit User Parameters

The **Parameters** tab shows user parameters, but they are not editable in that interface. The **User Parameters** tab provides a field for editing values. For this tutorial, change the **USER Camera Offset Scale** back to 0.

[image: The USER Camera Offset Scale set to 0 in the User Parameter tab.]

### Use User Parameters

Open a level, and drag the Niagara system (in this example, **NS_Minimal**) into the scene. Select the Niagara system in the **Outliner**. In the **Details** panel, expand the **User Parameters** section. The **Camera Offset Scale **user parameter is included in the list. This means a user can set these parameters interactively, in the context of the world, rather than while in the Niagara viewport.

[image: The Niagara system in level, and the Camera Offset Scale is available for editing in Details Panel.]

## Static Switches

Static switches control the flow of the script. They are helpful when you want certain parts of your graph compiled out of your module except under certain circumstances.

### Implement Static Switch

For this example, make a switch for the USER.CameraOffsetScale parameter. It might be something that an end user would rarely use, so the code wouldn’t need to be available in the emitter most of the time.

Open the **Apply Offset** scratch module graph, and go to the section that has the **USER.CameraOffsetScale**.

[image: The USER.CameraOffsetScale section of the Apply Offset graph]

In this section, right-click and create a **Static Switch** node.

[image: The Static Switch node]

Rename the Static Switch to something descriptive (for example, **Use Camera Offset**).

The Static Switch expects a type (often numeric, but not always). Add a type by clicking the **Add (+)** pin, then search for and select the **Niagara Parameter Map** type for this example.

[image: The Niagara Parameter Map type on the Static Switch node.]

Drag the Camera Offset **Map Set** output to the Static Switch node, then drag the Static Switch output to both the** Map Get** and **Map Set** in the Set Position section.

> **tip:** Use **Ctrl** + **Click** to pick up connection wires and move them to a different pin.

Then, connect the **Map Set** of the Transform Into Space section to the **False** pin of the **Static Switch** node.

If the **Static Switch** is false, it will skip (compile out) the **Camera Offset** section, and go right from the **Transform Into Space** section to the switch and the following **Set Position** section. If it's true, the Camera Offset nodes will be used.

### Static Switch Settings

By default, the **Static Switch** type is a Boolean. Other options are available, but use the default Boolean for this example. The **Default Value** can be set to true or false, but leave it false for this example. The **Expose as** pin can also be left false for this tutorial. Setting it to true will expose a pin for the setting on the node in the graph, creating a way to set that value using data in the graph.

[image: The Details panel for the Static Switch.]

### Use the Static Switch

Open the **System Overview** graph, and select the **Apply Offset** scratch module stack entry. The **Details** panel will now have a **Use Camera Offset** option. While set to false, no other camera offset options will appear in the list, and the skipped nodes will not affect the Emitter. The **Camera Data Interface** information has also been removed from the **Advanced** options section.

[image: Use Camera Offset static switch in Details panel]

While set to true, the **Camera Offset** nodes are compiled, and all the relevant options (both outside and inside the **Advanced** section) are available in the **Details** panel.

[image: Use Camera Offset set to true]

## Share Scratch Modules

To share your scratch module with other Niagara systems or with the rest of your team, you need to export your scratch module as a Niagara nodule script asset.

Open the **Apply Offset** graph, and click the **Local Modules** tab. Right-click the listed module's name, then click **Create Asset**.

[image: Create asset from scratch module]

This opens the **Create Script As** window. Name your module (for example, **NMS_ApplyOffset**), and select the folder where you would like this asset to be located. Then, click **Save**.

[image: Name and save the script asset]

The asset is created, and can be accessed from the Content Browser.

[image: NMS_ApplyOffset asset in Content Browser]

The engine then automatically opens the new Niagara module script asset.

[image: Niagara module script asset window]

### Library Exposure

The first thing you'll likely want to change in the Niagara module script asset is the **Library Visibility** flag in the **Script Details** panel.

By default, it's set to Unexposed, which means it does not appear in menus and searches with the **Library Only** option enabled (which is the case by default).

[image: Library Visibility set to Unexposed]

To demonstrate this, open your Niagara System, and use the Add + button to search for ApplyOffset. The only result will be the Scratch Pad, not the NMS asset we just created (which would be listed as Game).

[image: Unexposed NMS asset not visible with Library Only set to true]

There are two different ways to handle this, depending on how discoverable you want that Niagara module script asset to be.

#### Unexposed and Library Only Off

One option is to leave the module set to **Unexposed**, and turn the **Library Only** filter option to false on your workstation. This might be preferred if you don't want or need the module to be easily accessible by users with default filter settings. If anyone else wanted to use this module, they would need to know to uncheck the **Library Only** option in their **Add New Module** window as well.

[image: Unexposed NMS asset visible with Library Only set to false]

#### Exposed and Library Only On

The other option is to change the Niagara module script asset's **Library Visibility** to **Exposed**. This would make the module much more discoverable, as it would appear in the **Add New Module** menu with the default filtering options in place (**Library Only** set to true). This is ideal for modules that you want to be readily accessible to your team or other end users.

Open the Niagara module script asset, change the **Library Visibility** to **Exposed**, then click **Compile** and **Save**.

[image: Library Visibility set to Exposed]

To see this in action, open any Niagara system, and click the **Add (+)** button to search for **Apply Offset**. Unlike before, the Niagara module script asset (labeled **Game**) is included in the search results while the** Library Only** option is set to true.

[image: Exposed NMS asset visible with Library Only set to true]

### Module Usage Bitmask

Check the new Niagara module script asset's **Module Usage Bitmask** to ensure the visibility settings are appropriate for this module's intended functionality.

### Description Field

Text in the Niagara module script's **Description** field is included in the tooltip that appears when hovering over the module in the **Add New Module** menu. Include any information here that would help a user decide whether or not to use this module. For example, explain what it's meant to do, what circumstances are more or less ideal for this module to be used, and what other factors might make this more or less relevant to your user’s creative or technical goals.

[image: Module tooltip with description]

### Note Message

If a Niagara script module is created from a scratch module, the **Note** field is automatically filled with whatever text was included in the scratch module. If your scratch module didn't include any **Note** text, this will be blank. This message appears at the top of the **Details** panel when the module's stack entry is selected within an emitter.

[image: The Note Message field]

### Keywords

Keywords help make the Niagara module script more discoverable during menu searches. Keywords should be separated by spaces. The **Keywords **field for the **Apply Offset** Niagara module script could include "offset position camera", which would allow an end user to search for "camera offset" and have **Apply Offset** pop up as an option in the menu.

[image: NMS Apply Offset appearing when searching for "camera offset".]

## Conclusion

You can use scratch pad modules to directly add new functionality to your emitters and Niagara systems using visual scripting.

For more information about using Niagara, see Creating Visual Effects (-> creating-visual-effects-in-niagara-for-unreal-engine) and Niagara Script Editor Reference (-> script-editor-reference-for-niagara-effects-in-unreal-engine).

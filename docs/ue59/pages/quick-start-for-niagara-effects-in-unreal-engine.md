# Niagara Quick Start

https://dev.epicgames.com/documentation/en-us/unreal-engine/quick-start-for-niagara-effects-in-unreal-engine?application_version=5.9

> A guide to help you quickly start using the Niagara visual effects system.

[image: Niagara Quick Start]

###### Prerequisite topics

In order to understand and use the content on this page, make sure you are familiar with the following topics:

- Installing Unreal Engine (-> installing-unreal-engine)
- Creating a New Project (-> creating-a-new-project-in-unreal-engine)
- Enable the Niagara Plugin (-> how-to-enable-the-niagara-effects-plugin-in-unreal-engine)

## Goals

The Niagara Quick Start is designed to get you acquainted with creating visual effects (VFX) in Unreal Engine using Niagara. You will create a puff of smoke effect and attach it to your character's footsteps. It will look like the following.

## Objectives

- Set up your project with meshes and materials for use with Niagara.
- Create a basic smoke effect using a Niagara system.
- Attach the smoke effect to a character's run animation.

## 1 - Setting Up Your Project

For the duration of this guide, use the **Blueprint Third Person Template** project with **Starter Content** enabled. If you have not created a project in Unreal Engine, see Create a Project (-> creating-a-new-project-in-unreal-engine).

- Launch **Unreal Engine** from the **Epic Games Launcher**.
- Click **Games**, then select the **Third Person Template**. Enable **Starter Content**.
- If needed, **Browse** to a new **Project Path**.
- Give your project a **Project Name**.
- Click **Create** to create your project.

[image: Create a New Project]

Click image for full size.

Before you start creating your Niagara effect, you need to set up your project with some basic materials and assets that you will be using in the rest of this guide. After you complete this section, you will have everything you need to create your Niagara effect.

### Create or Import a Mesh Shape

The first thing you need for your project is a mesh shape for your effect. The shape you want to create or import is a **cloud**. There are a few ways of bringing in a mesh object into Unreal Engine:

- Create your model in the 3D software of your choice, then export it as an **.fbx** file to easily import it into Unreal Engine.
- Browse for a free cloud model on a site like Sketchfab, then import it into Unreal Engine.
- Model the cloud directly in Unreal Engine using the Modeling Mode (-> getting-started-with-modeling-mode) tools.

Create or download a cloud model similar to the following.

[image: Cloud Model by gaelinix] Click image for full size.

The cloud asset used in this tutorial is from Sketchfab. This model is called **CLOUD high poly**, created by and copyrighted to **gaelinix**. This model is licenced under the Creative Commons Attribution license.

You can download the model here.

You can also model your own cloud. Even if you do not have access to a high-end 3D modeling application like 3DS Max or Maya, you can use an open-source 3D modeling application such as Blender.

Once you have the model created or downloaded, create a place to store that model in the **Content** folder for easy organization.

- In the Content Browser, right-click and select **New Folder** to create a folder for your assets. Name it **Cloud**.[image: Create Cloud Folder] Click image for full size.
- Drag and drop your 3D model into the Content Browser to import it into your project.

For more information on how to import your model into Unreal Engine, see Importing Content (-> importing-assets-directly-into-unreal-engine).

### Create and Configure a Material

When you imported your cloud model, Unreal Engine may have created a **Material** for that model automatically. If not, you must create your own.

- Right-click in the Content Drawer and select **Material**. You can skip this step if Unreal Engine imported a material when you imported the model.[image: Create Material] Click image for full size.
- Name the new material **CloudMaterial**.[image: Rename Material] Click image for full size.
- Double-click the material to open it in the **Material Editor**.
- With the main Material node selected, locate the **Material** section in the **Details** panel. Change the **Blend Mode** to **Translucent**. Check the box for **Two Sided**. Leave the other settings at their default.[image: Set Material Blend Mode] Click image for full size.
- If you imported a model and you are using that material, there may already be something connected to the **Base Color** of the material. Delete this, as you will use the Niagara system's **Particle Color** setting to drive the material's color instead. If your material has nothing connected to **Base Color**, you can skip this step.[image: Delete the Base Color Node] Click image for full size.
- Right-click in the graph and type `particle` in the search bar. Select **Particle Color** to add the node.[image: Create a Particle Color Node] Click image for full size.
- Plug the top output of the Particle Color node into the **Base Color** input on the main Material Node.[image: Connect Particle Color to Base Color] Click image for full size.
- If you imported a model, it may have automatically created a **Texture Sample** node and connected it. If there isn't one, create your own. You can do this by holding **T** and clicking inside the Node Graph.[image: Create a Texture Sample Node] Click image for full size.
- You will add some noise from the **Starter Content** to the texture to make it appear more like smoke. With the Texture Sample node selected, locate the **Material Expression Texture Base** section in the **Details** panel. Next to **Material**, click the dropdown, then type **Noise** in the search bar. Select the **T_Perlin_Noise_M** texture.[image: Set Texture to Noise] Click image for full size.
- Right-click in the graph and type `dynamic` in the search bar. Select **Dynamic Parameter** to add that node.[image: Create a Dynamic Parameter] Click image for full size.
- With the Dynamic Parameter node selected, locate the **Material Expression Dynamic Parameter** section in the **Details** panel. In **Array 0**, change the name to **Erode**.[image: Set Erode Parameter] Click image for full size.
- Right-click in the graph and type `step` in the search bar. Select **Value Step** to add that node.[image: Add Value Step Node] Click image for full size.
- Drag off the **R** output of the Texture Sample node, and plug it into the **Gradient** input of the Value Step node.[image: Connect Texture Sample to Gradient] Click image for full size.
- Drag off the **Erode** output of the Dynamic Parameter node, and plug it into the **Mask Offset Value** input of the **Value Step** node.[image: Connect Erode to Mask Offset Value] Click image for full size.
- Drag off the **Results** output of the Value Step node, and plug it into the **Opacity** input of the main Material node.[image: Final Material Setup] Click image for full size.
- Click **Apply** and **Save**, then close the Material Editor.

#### Section Result

You have now imported a mesh model of a cloud. You have also set up the material. You are now ready to create the Niagara effect.

## 2 - Creating Your Effect

### Create the System

Next you will create your Niagara system.

- To create a new Niagara system, right-click in the **Content Browser** and click **FX > Niagara System**.[image: Right-click in the Content Browser and click FX - Niagara System]
- Click the **Template** category on the left-hand side and select the **Simple Sprite Burst** system. Click **Create**.[image: Select the Simple Sprite Burst system and click Create]
- Name the system **FX_DustCloud**. Double-click to open it in the Niagara Editor.[image: Name the system FX_DustCloud and open it in the Niagara Editor]
- The emitter instance in your new system has the default name of **SimpleSpriteBurst**. You can rename it, however. Double-click the name of the emitter instance in the **System Overview**, and the field will become editable. Name the emitter **FX_DustCloud**.

[image: Rename the Emitter] Click image for full size.

If you only have one emitter in your Niagara System, renaming it is optional. However, if you create a Niagara system with more than one emitter, naming them is important for organization and clarity.

### Configure the Render Group

The Emitter is set up as a vertical stack, broken up into groups. The default groups in the emitter are:

- Emitter Spawn
- Emitter Update
- Particle Spawn
- Particle Update
- Render

To find out more about Emitter Groups and how they work, see the Niagara Overview (-> overview-of-niagara-effects-for-unreal-engine) page.

Because you are using a 3D model to generate the effect, you need to set up the Render group first in order to see the preview.

- In the **System Overview**, select **Render** to open the Render group in the **Selection** panel.[image: Select Render Group] Click image for full size.
- Because you are using a 3D model, you need a Mesh Renderer and not a Sprite Renderer. Click the **Trashcan** icon to delete the Sprite Renderer. **Selection** panel.

[image: Delete Sprite Renderer] Click image for full size.

- With the Render group selected, in the **Details** panel, click the **Plus sign** icon (**+**). Select **Mesh Renderer** from the list to add this module to the Render group.[image: Add Mesh Renderer] Click image for full size.
- For **Facing Mode**, click the dropdown and select **Velocity**.
- Click the triangle next to **Meshes** to expand the array. This array is where you can add one or more mesh objects to the renderer. Click the dropdown next to **Index (0)** in the array, then select the mesh you imported in the **Project Setup** section.[image: Add Mesh Renderer] Click image for full size.
- Click to the checkbox **Enable Override Materials**. You can then specify the material to apply to the mesh. The default is **0 Array elements**. Click the **Plus sign** (**+**) icon to add an array element.[image: Enable Material Overrides] Click image for full size.
- Click the dropdown next to **Explicit Mat**, then select the material you made in the Project Setup section.[image: Set the Material] Click image for full size.
- From the **Content Browser**, drag your Niagara system into your Level. Position it near the foot of the Player Character, so you can check the size and shape of the effect in relationship to the character.

When you make a particle effect, it is always a good idea to drag your system into your level. This gives you a chance to see every change and edit in context.

#### Section Result

After completing this section, you have a Niagara system and an emitter instance, and you have dragged the system into the Level so you can preview it next to the Player Character. In the next part, you will edit the settings in the Niagara system to create the dust cloud effect.

## 3 - Editing the Module Settings

The Niagara Editor displays each emitter as a stack, with several groups of settings. You will edit the modules in each group one at a time.

This effect does not have any modules in the Emitter Spawn group, so you will skip that section. For more information on the different groups and what they do, see the Niagara Overview (-> overview-of-niagara-effects-for-unreal-engine) page.

### Configure the Emitter Update Group

First you will edit the modules in the Emitter Update group. Modules placed in this group will update every frame as the system ages.

- In the **System Overview**, click the **Emitter Update** group to open it in the **Selection** panel.[image: Select the Emitter Update Group] Click image for full size.
- Expand the **Emitter State** module. By default, the **Life Cycle Mode** should be set to **Self**.
- Change the **Emitter State** settings to the following values. This will give you a dust poof that appears once and then dissipates.[image: Set the Life Cycle Settings] Click image for full size. | Parameter | Value |
| --- | --- |
| **Life Cycle Mode** | Self |
| **Inactive Response** | Complete |
| **Loop Behavior** | Once |
| **Loop Duration Mode** | Fixed |
| **Loop Duration** | 1 |
- Expand the **Spawn Burst Instantaneous** module. Set the **Spawn Count** to **10**. A spawn count of 10 gives us a dust cloud that is big enough to be visible, but small enough to be plausible.

[image: Set the Spawn Count] Click image for full size.

### Configure the Particle Spawn Group

Next, you will edit the modules in the Particle Spawn group. These are behaviors that apply to particles when they first spawn.

- In the **System Overview**, click the **Particle Spawn** group to open it in the **Selection** panel.[image: Select the Particle Spawn Group] Click image for full size.
- Expand the **Initialize Particle** module. Under **Point Attributes**, locate the **Lifetime Mode** dropdown. Use the dropdown to select **Random**. This adds **Minimum** and **Maximum** fields to the Lifetime value. This will add some variation in how long each particle displays. Set the Minimum and Maximum fields to the following.[image: Set the Lifetime Settings] Click image for full size. | Setting | Value |
| --- | --- |
| **Minimum** | .4 |
| **Maximum** | .6 |
- Locate the **Color** setting. In the example, the **Color** is set to a light tan color that looks like dust. Click on the color swatch, then use a color picker to choose a color. This value is saved to **Particle Color**, that you already connected to the material in the Project Setup step.[image: Set the Particle Color] Click image for full size.
- You will add some variation to the size of the particles by adding a random factor to the mesh scale. Under **Mesh Attributes**, locate the **Mesh Scale Mode** dropdown. Select **Random Uniform**. Set the following values for **Mesh Uniform Scale Min** and **Mesh Uniform Scale Max**.[image: Set the Mesh Size] Click image for full size. | Setting | Value |
| --- | --- |
| Mesh Uniform Scale Min | 1.0 |
| Mesh Uniform Scale Max | 2.0 |
- With the **Particle Spawn** group selected, click the **Plus sign** icon (**+**) to add a new module to this group. Select **Orientation > Initial Mesh Orientation**. This contains rotation settings for your particle mesh. You want to add some rotation to the shape so it is less uniform. This will make the dust cloud look a little more natural.[image: Add the Initial Mesh Orientation Module] Click image for full size.
- Under **Rotation**, click to enable initial rotation in the module. Click the downward arrow next to **Rotation**, then select **Dynamic Inputs > Random Ranged Vector**.[image: Set Rotation to Random Range Vector] Click image for full size.
- Minimum and maximum values generate a random factor to the initial rotation. Leave the **Minimum** and **Maximum** values at their default.[image: Set Rotation values] Click image for full size.
- With the **Particle Spawn** group selected, click the **Plus sign** icon (**+**) to add a new module. Select **Location > Shape Location**. The Shape Location module lets you set a region in which new particles are created when they are born.[image: Add Shape Location Module] Click image for full size.
- For this example, set **Shape Primitive** to **Cylinder**. You can experiment with different shapes in future examples depending on the look you want to achieve. For now, you want the dust cloud to stay close to the ground, so change the **Cylinder Height** to **1**. You do not want the dust cloud to be too much bigger than the foot, so change the **Cylinder Radius** to **10**.[image: Set Shape Location Settings] Click image for full size. | Setting | Value |
| --- | --- |
| Shape Primitive | Cylinder |
| Cylinder Height | 1.0 |
| Cylinder Radius | 10.0 |
- With the **Particle Spawn** group selected, click the **Plus sign** icon (**+**) to add a new module to this group. Select **Velocity > Add Velocity**. When you add velocity in the Particle Spawn group, it adds an initial velocity to the particles at the moment of their birth, at the specified speed.[image: Add an Add Velocity Module] Click image for full size.
- Set the **Velocity Mode** to **From Point**. This will apply velocity radially outwards from the origin point of the Niagara system. Set the **Velocity Speed** to **20**. you do not want the particles to spread too far, just enough to represent dust that is disturbed by the runner's footsteps. You can adjust this value as needed to achieve the look you like.[image: Set the Add Velocity Settings] Click image for full size.
- With the **Particle Spawn** group selected, click the **Plus sign** icon (**+**) to add a new module to this group. Select **Forces > Acceleration Force**. You are going to use this to give the dust cloud a small amount of upward momentum, so the dust cloud spreads out and up from the character's footstep.[image: Add the Acceleration Force Module] Click image for full size. An error displays after you add a velocity or force module, because added modules are always positioned at the bottom of the group's stack. That positioning places them after the **Solve Forces and Velocity** module. All velocity and force modules need to be placed above the solver to be properly computed.
- Click **Fix Issue** to resolve this error. Alternatively, You could manually move the module above Solve Forces and Velocity by dragging it up in the stack.[image: Solve Forces and Velocity Warning] Click image for full size.
- In the Acceleration Force module, set the **Acceleration** to **X:0, Y:0, and Z:200**. Now the dust cloud spreads out and up, but the upward momentum is a little too much. In the Particle Update step, you will add drag to slow down the upward momentum of the dust particles on each frame.

[image: Set the Acceleration Settings] Click image for full size.

### Configure the Particle Update Group

Finally, you will edit the settings in the Particle Update group. These behaviors are calculated on each particle every frame.

- In the **System Overview**, click the **Particle Update** group to open it in the **Selection** panel.[image: Select the Particle Update Group] Click image for full size.
- Click the **Trashcan** icon to delete the **Scale Color** module. You will not need it for this effect.[image: Delete the Scale Color Module] Click image for full size.
- With the **Particle Update** group selected, click the **Plus sign** icon (**+**) to add a new module. Select **Materials > Dynamic Material Parameters**. This is how you will connect to the Erode Dynamic Parameter in your Material.You can drag to reorder modules in the emitter in the System Overview. However, you cannot reorder modules in the Selection panel.[image: Add the Dynamic Material Parameters Module] Click image for full size.
- In the **Dynamic Material Parameters** module, you see the **Erode** parameter you set up in your material. Click the downward arrow for Erode, and select **Dynamic Inputs > Float from Curve**.[image: Set Erode to Float From Curve] Click image for full size.
- In the curve editor, click the **Drop Off** template to apply that style to the curve. This will make the material fade out over time.[image: Apply the Drop Off Template to Float From Curve] Click image for full size.
- With the **Particle Update** group selected, click the **Plus sign** icon (**+**) to add a module to this group. Select **Forces > Drag**.An error displays after you add a velocity or force module, because added modules are always positioned at the bottom of the group's stack. That positioning places them after the Solve Forces and Velocity module. Click **Fix Issue** to resolve this error.[image: Add Drag Module] Click image for full size.
- In the Drag module, set the **Drag** to **8**. The **Drag** setting interacts with the acceleration force and keeps the dust cloud's upward movement from seeming too unrealistic.

[image: Set the Drag Settings] Click image for full size.

#### Section Result

You have created the dust effect, and you should be able to see it in your level, next to the Player Start model. If the effect does not look right to you, you can adjust the various module settings until you like the look of the effect.

## 4 - Attaching the Niagara Effect to a Character

Now you are going to add this effect to a character's run animation. In this example, you will attach the effect to the generic **Quinn** character included in the Third Person template. However, you can use these steps to add a Niagara effect to any character you have set up in Unreal Engine.

- In the **Content Drawer**, navigate to **Content > Characters > Mannequins > Animations > Quinn**. Double-click the **MF_Run_Fwd** animation to open it in the **Animation Editor**.[image: Open Run Animation] Click image for full size.
- In the **Animation timeline**, click **Pause** to pause the looping animation. Use the scrub pointer to find the moment the character's right foot hits the ground. You are going to put your dust effect right at that spot.[image: Scrub Playhead to Foot Impact Time] Click image for full size.
- Locate the **Notifies** section. With a notify, you are marking the animation with a location for an effect. To keep your timeline organized, create a new track to put the Niagara events on. Click on **Track**, then select **Add Notify Track.** Name it **Niagara**.[image: Add Notify Track] Click image for full size.
- You will see a line that runs down from the scrub bar in the timeline. Right-click where the playhead intersects with the Niagara notify track. Select **Add Notify > Play Niagara Particle Effect**. A marker is placed at that point in the animation, with the default label PlayNiagaraEffect.[image: Add Niagara Particle Effect Notify] Click image for full size.
- With the **PlayNiagaraEffect** notify selected, locate the **Anim Notify** section in the **Details** panel. This is where you select the Niagara System you want to add to the animation. Click the dropdown next to **Niagara System**, and select the **FX_DustCloud** system you created in Niagara. The label on the notify changes to **FX_DustCloud**.[image: Set the Niagara System in Notify] Click image for full size.
- Repeat the above steps for the left foot. You can also copy and paste Notifies directly in the timeline. To refine the look further, you can offset the location of the cloud to match the position of each foot where it hits the ground. With the **Anim Notify** selected, locate the **Location Offset** values. Adjust the values as needed.[image: Set the Location Offset in Notify] Click image for full size.
- Click **Play** in the Timeline to see a preview of the effect, and refine values as needed.
- Close the Animation Editor. In the **Level Editor**, click the **Play** button to preview the level. Run around and see your effect in action.

#### Section Result

You have attached the Niagara effect to your character's run animation. Congratulations!

### Refining the Look of the Smoke Cloud

You may want to continue tweaking the values to get the final look that you want. Here are some ideas of things you can try to go back and play around with, now that your scene is set up:

- Try adjusting the color in the **Initialize Particle** module.
- Add a **Scale Mesh Size** module to the **Particle Update** group. Set the **Scale Factor** to **Vector from Curve**, and play around with different shapes to change the size of the cloud over time.
- Refine the size of the model in the **Mesh Renderer**.
- Refine the location of the cloud in the **Anim Notify**.

## 5 - Reviewing the End Result

You have finished making the effect in the Quick Start guide. It should look similar to the following.

## 6 - On Your Own

Now that you have created a basic effect and attached it to a character, you can try some other related tutorials to do more with this character. You can also make more effects in Niagara.

- You can use a Ribbon (-> how-to-create-a-ribbon-effect-in-niagara-for-unreal-engine) to create a trail behind your character as it runs.
- You can check out our Animation tutorials (-> animation-workflow-guides-and-examples-in-unreal-engine) to learn how to create or modify additional animations for your character.
- You can learn how to use Animation Blueprints (-> animation-blueprints-in-unreal-engine) to do even more with your character.

- effects
- getting started
- vfx
- niagara
- visual effects
- particle effects
- quick start

On this page

- Goals (-> quick-start-for-niagara-effects-in-unreal-engine)
- Objectives (-> quick-start-for-niagara-effects-in-unreal-engine)
- 1 - Setting Up Your Project (-> quick-start-for-niagara-effects-in-unreal-engine)
- Create or Import a Mesh Shape (-> quick-start-for-niagara-effects-in-unreal-engine)
- Create and Configure a Material (-> quick-start-for-niagara-effects-in-unreal-engine)
- Section Result (-> quick-start-for-niagara-effects-in-unreal-engine)
- 2 - Creating Your Effect (-> quick-start-for-niagara-effects-in-unreal-engine)
- Create the System (-> quick-start-for-niagara-effects-in-unreal-engine)
- Configure the Render Group (-> quick-start-for-niagara-effects-in-unreal-engine)
- Section Result (-> quick-start-for-niagara-effects-in-unreal-engine)
- 3 - Editing the Module Settings (-> quick-start-for-niagara-effects-in-unreal-engine)
- Configure the Emitter Update Group (-> quick-start-for-niagara-effects-in-unreal-engine)
- Configure the Particle Spawn Group (-> quick-start-for-niagara-effects-in-unreal-engine)
- Configure the Particle Update Group (-> quick-start-for-niagara-effects-in-unreal-engine)
- Section Result (-> quick-start-for-niagara-effects-in-unreal-engine)
- 4 - Attaching the Niagara Effect to a Character (-> quick-start-for-niagara-effects-in-unreal-engine)
- Section Result (-> quick-start-for-niagara-effects-in-unreal-engine)
- Refining the Look of the Smoke Cloud (-> quick-start-for-niagara-effects-in-unreal-engine)
- 5 - Reviewing the End Result (-> quick-start-for-niagara-effects-in-unreal-engine)
- 6 - On Your Own (-> quick-start-for-niagara-effects-in-unreal-engine)

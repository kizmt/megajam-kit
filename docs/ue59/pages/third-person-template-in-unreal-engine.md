# Third Person Template

https://dev.epicgames.com/documentation/en-us/unreal-engine/third-person-template-in-unreal-engine?application_version=5.9

> Introduction to the Third Person template in Unreal Engine.

[image: Hero image of the Third Person arena with a mannequin running.]

When you create a new project, **Unreal Engine** gives you a list of templates you can choose from. These templates contain some ready-to-use assets, such as level geometry, a character you can control, and simple character animations. Many tutorials use one of these templates as a starting point.

In a third-person game, by default, the player sees the game world from a camera that's located at a fixed distance behind and slightly above their character. In Unreal Engine, you can control camera distance and position, and adjust it as needed.

The **Third Person** template in Unreal Engine 5 contains the following elements:

- A playable third-person character that can move and jump.
- Additional meshes for the character.
- A level with basic geometry (ramps, platforms).
- Physics-enabled cubes that react when the player collides with them.

The template also comes with redesigned mannequins.

### Creating a Third Person Project

Launching Unreal Engine opens the **Project Browser** window, where you can choose to open an existing Unreal Engine project or create a new one.

To create a third-person project, select the **Games** category on the left, and then select the **Third Person **template.

[image: Image of landing page for launching a template option, third person is selected.]

### Variants

The next set of options in creating your project are located in the **Variants **dropdown menu. Variants give you a way to build select gameplay styles faster. The Third Person template offers three specialized variants: Combat, Platforming, and Side Scroller.

[image: Image of Variants dropdown menu options.] Choose the None option for the standard template.

For a deeper dive into the features of these variants, see Variants in Games Templates (-> variants-in-game-templates).

#### Combat Variant

The **Combat** variant delivers combat mechanics, enemy targeting, and a built-in health management system to efficiently build action-oriented games.

[image: Image of two characters in the combat arena.]

#### Platforming Variant

The **Platforming **variant delivers advanced jumping, climbing, and dynamic movement mechanics with precise control.

[image: Image of the platforming variant gameplay terrain.]

#### Side Scroller Variant

The **Side Scrolle**r variant adapts the third-person perspective to a side-scrolling format, with pre-configured camera and movement systems.

[image: Image of a character moving through a side-view oriented gameplay space.]

There are several additional settings you can configure for your Third Person project. For an overview of these, refer to the Creating a New Project (-> creating-a-new-project-in-unreal-engine) page.

After following these steps, you now have a basic level with a third-person character you can control.

Why don't you try out your new level? In the main toolbar at the top of the editor, click **Play**. Use the **WASD** keys to move your character, press the **Space** bar to jump, and look around by moving the mouse.

## Template Contents

The Third Person template contains all of the basic elements of a simple third-person experience. You can use it as a starting point for a traditional role-playing game (RPG), third-person shooter, or any other kind of application. The following section details the main template elements and where to find them in the **Content Browser**.

### Third-Person Character

Assets for the player character are located in the `Content/Characters` folder. By default, the Third Person template starts with the feminine Unreal Engine 5 mannequin. This folder contains additional **Skeletal Meshes** for the player character, both in the style of Unreal Engine 5 and the legacy Unreal Engine mannequin.

| Female Mannequin: Quinn (default) | Male Mannequin: Manny |
| --- | --- |
| [image: Image female mannequin.] | [image: Image male mannequin.] |

Unreal Engine mannequins also come with configurable Level of Detail (LOD) settings. LODs help optimize your application for different platforms.

For example, applications targeting mobile platforms (Android, iOS) should use less detailed character models. This helps improve the application's performance on these platforms. The **Data Asset** that controls mannequin LODs is located in the `Content/Characters/Mannequins/Meshes` folder.

### Animations

Animations for Unreal Engine mannequins are located in the `Content/Characters/Mannequins/Animations` folder. There are two sets of animations specific to the two mannequins.

The **Animation Blueprints** make full use of the new IK Rig (-> unreal-engine-ik-rig) system in Unreal Engine. Unlike legacy animations, the IK Rig can be used to dynamically modify pose-based solver parameters. An example of this can be seen in the screenshots below: the position of Quinn's feet adjusts dynamically to match the kind of terrain she is standing on.

|  |  |  |
| --- | --- | --- |
| [image: Quinn in a step position.] | [image: Quinn on an angled incline.] | [image: Quinn facing front with feet flat on ground.] |

To see how this was implemented, have a look at the **CR_Mannequin_BasicFootIK** rig in the `Content/Mannequins/Rigs` folder.

Also in the `Rigs` folder, the **CR_Mannequin_Body** Control Rig asset can be used to easily pose and animate the mannequin directly in the editor. To learn more about how to pose and animate with Control Rig, refer to the Control Rig (-> control-rig-in-unreal-engine) documentation.

### Level

The assets that make up level geometry (static meshes, materials, and textures) are located in the `Content/LevelPrototyping` folder.

## Improving Your Project

Now that you have a playable level, you can start to import content and adjust things to make your game more interesting and unique.

### Character

You can change your character's appearance by changing its **Static Mesh**. As an example, let's change the default mannequin mesh. To do this, follow these steps:

- In the **Content Browser**, go to `Content/ThirdPerson/Blueprints`, then double-click the `BP_ThirdPersonCharacter` Blueprint to open it in the Blueprint Editor.[image: Image file structure for content to third person to blueprints with key image.]
- In the Blueprint Editor, in the Components panel, click the Mesh(CharacterMesh) Component to select it.[image: image blueprints page with mesh selected in the components menu.]
- With the Mesh(CharacterMesh) Component selected, find the Details panel on the right side of the Blueprint Editor. Then, in the Mesh section, click the drop-down next to the Skeletal Mesh parameter and select `SKM_Manny` from the list.[image: In the Details menu, select mesh, then the Manny mesh.]
- Still in the **Details** panel, in the **Animation** section, set the following options:Animation Mode: **Use Animation Blueprint**
- Anim Class: **ABP_Manny**[image: Image of menus to change animation class.]
- Compile and Save the Blueprint.[image: Image of compile in menu and save icon.]
- Click the Viewport tab to confirm that the mesh has updated.[image: Image of viewport tab with mannequin.]

Your character can already run and jump, but you can also add other types of character movement, like walking or crouching. For a detailed tutorial, see Setting Up Character Movement (-> setting-up-character-movement).

### Level

Your level already has some simple geometry, like stairs and platforms. The easiest way to add more content inside is to drag-and-drop it from the **Content Browser**.

If you chose to include **starter content** when you created your project, you should already have some things you can drag-and-drop into your level.

For an introductory tutorial on level design, see Level Design Tutorial.

## What's Next?

Now that you've gone through the basics of creating a third-person experience, here are some other things you can try:

- In-depth tutorials:Retarget animations to a MetaHuman
- Import and configure (-> fbx-skeletal-mesh-pipeline-in-unreal-engine) a different FBX model for your player character

- Download premade characters from Fab
- Populate your level with free content and props from Quixel Bridge (-> quixel-bridge-plugin-for-unreal-engine). You can build a variety of indoor and outdoor environments, and new content is added regularly.
- Add some fancy visual effects to your game, like motion blur or vignette, by using post-processing effects (-> post-process-effects-in-unreal-engine).
- Refine how your skeletal meshes (-> skeletal-mesh-rendering-paths-in-unreal-engine) are rendered, or learn to update your 3D imported data through a Datasmith tutorial (-> datasmith-tutorials-in-unreal-engine).
- Add AI characters using Behavior Trees (-> behavior-trees-in-unreal-engine). You can set them up to chase, flee, help, or harm the player.

On this page

- Creating a Third Person Project (-> third-person-template-in-unreal-engine)
- Variants (-> third-person-template-in-unreal-engine)
- Combat Variant (-> third-person-template-in-unreal-engine)
- Platforming Variant (-> third-person-template-in-unreal-engine)
- Side Scroller Variant (-> third-person-template-in-unreal-engine)
- Template Contents (-> third-person-template-in-unreal-engine)
- Third-Person Character (-> third-person-template-in-unreal-engine)
- Animations (-> third-person-template-in-unreal-engine)
- Level (-> third-person-template-in-unreal-engine)
- Improving Your Project (-> third-person-template-in-unreal-engine)
- Character (-> third-person-template-in-unreal-engine)
- Level (-> third-person-template-in-unreal-engine)
- What's Next? (-> third-person-template-in-unreal-engine)

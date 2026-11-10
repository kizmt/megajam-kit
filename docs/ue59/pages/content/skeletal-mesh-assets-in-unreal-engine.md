# Skeletal Meshes

https://dev.epicgames.com/documentation/en-us/unreal-engine/skeletal-mesh-assets-in-unreal-engine?application_version=5.9

> Create characters in Unreal Engine using Skeletal Mesh assets.

[image: Skeletal Meshes]

Characters in **Unreal Engine** are created using multiple unique assets that render the visual geometry, play animations, and construct logic that control the character's behaviors in real time. The foundational asset for characters in Unreal Engine is the **Skeletal Mesh** asset, which contains the character's visual mesh, or geometric model render of the character, and the character's skeleton (-> skeletons-in-unreal-engine) that contains bone data, which is used to animate the character.

A Skeletal Mesh asset is created in external **Digital Content Creation** (**DCC**) software and exported as an `.fbx` file. FBX files are then imported into Unreal Engine (-> importing-skeletal-meshes-using-fbx-in-unreal-engine) projects. After importing a character into Unreal Engine, you can view and edit the components of the Skeletal Mesh asset in the Skeletal Mesh Editors (-> animation-editors-in-unreal-engine), such as the characters Mesh (-> skeletal-mesh-editor-in-unreal-engine), Skeleton (-> skeleton-editor-in-unreal-engine), physics asset (-> physics-asset-editor-in-unreal-engine) and animation sequence (-> animation-sequence-editor-in-unreal-engine) properties.

For more information about importing character FBX files into Unreal Engine, refer to the following documentation:

- [image: Importing Skeletal Meshes Using FBX] Importing Skeletal Meshes Using FBXLearn how to import skeletal meshes. (-> importing-skeletal-meshes-using-fbx-in-unreal-engine)

FBX files imported into Unreal Engine as Skeletal Mesh assets will contain the character's model, and skeleton. The character's skeleton will be imported as an additional asset called a Skeleton asset (-> skeletons-in-unreal-engine), which you can view and edit in the Skeleton Editor (-> skeleton-editor-in-unreal-engine).

 [image: ImageAltText]

 [image: ImageAltText]

FBX files can also contain animations for the character, and are imported along with the character model, as Animation Sequence assets (-> animation-sequences-in-unreal-engine). Animation Sequences can be viewed and edited using the Animation Sequence Editor (-> animation-sequence-editor-in-unreal-engine). Animation Sequence assets can be dynamically played on a characters using Character (-> characters-in-unreal-engine) and Animation Blueprints (-> animation-blueprints-in-unreal-engine) at runtime, as well as used in authored cinematics using Sequencer (-> cinematics-and-movie-making-in-unreal-engine).

[image: ImageAltText]

After importing a character's Skeletal Mesh asset, along with its accompanying Skeleton asset and Animation Sequences, you can add the Skeletal Mesh asset directly into a level. In order to control a Skeletal Mesh asset, as a Character or other non-playable characters and objects, you must create a Character blueprint and add the Skeletal Mesh as a Mesh component (-> anatomy-of-a-blueprint-in-unreal-engine) to build game and animation logic to govern its behaviors and assemble its parts.

## Create a Character Blueprint

There are many ways a Character Blueprint can be built depending on your character and projects needs, here you can follow an example workflow of building a simple character blueprint to apply animations to your character in a level.

[image: ImageAltText]

To create a character blueprint navigate in the **Content Browser** and use (**+**)** Add** to select **Blueprint Class**.

[image: ImageAltText]

Then Select the Character class option and select create.

[image: ImageAltText]

In the **Content Bowser**, **name** and **open** your Character Blueprint asset.

[image: ImageAltText]

In the blueprint's** Components** panel, select the **Mesh** component, and navigate in the **Details** panel to the **Skeletal Mesh** property.

[image: ImageAltText]

Using the drop-down menu, select your** Skeletal Mesh** asset.

[image: ImageAltText]

Position your Skeletal Mesh in the** Viewport **panel to align with the** Arrow **and** Capsule** components..

After saving and compiling your blueprint, you can then add the Character Blueprint to your level.

[image: ImageAltText]

You can create gameplay controls and behaviors using the Character Blueprint's **Event Graph** and functions.

For more information about setting up a character in Unreal Engine, refer to the following documentation:

- [image: Setting Up a Character] Setting Up a CharacterA high-level overview of how to set up a basic character or Skeletal Mesh in Unreal Engine. (-> setting-up-a-character-in-unreal-engine)

### Modular characters

Some characters are built using multiple skeletal meshes that represent pieces of a character, and are assembled in the level. This is common when creating characters that may change outfits or appearances, or have dynamic elements that depend on gameplay sineros, or player achievements.

[image: ImageAltText]

For more information about creating modular characters in Unreal Engine, see the following documentation:

- [image: Working with Modular Characters] Working with Modular CharactersCreate characters by combining multiple skeletal mesh components. (-> working-with-modular-characters-in-unreal-engine)

## Animating Skeletal Meshes

Animation Sequences can be played on a Skeletal Mesh's Skeleton asset. You can play animations by assigning a Character Blueprint's Mesh component's **Animation Mode** property to **Use Animation Asset **and then selecting an Animation Sequence asset in the** Anim to Play** property's drop-down menu.

After saving and compiling the blueprint, this animation will play on the character blueprint in the level.

### Animation Blueprints

Using an animation blueprint (-> animation-blueprints-in-unreal-engine), you can create animation logic, such as blend spaces (-> blend-spaces-in-unreal-engine), to play animation sequence on the character model in the level.

To create an Animation Blueprint for a Skeletal Mesh, open the content browser, and select **Add **(**+**) >** Animation** > **Animation Blueprint**, and select the skeleton asset imported with your skeletal mesh.

[image: ImageAltText]

You now have access to an Anim Graph (-> animation-workflow-guides-and-examples-in-unreal-engine) that can dynamically select Animation Sequences to play back on the character based on blueprint logic.

[image: ImageAltText]

### Animating Compatible Skeletal Meshes

Multiple Skeletal Meshes assets can be linked when they share the same or very similar skeleton structures. Skeleton compatibility can be manually set when skeletons share a similar structure using identical naming conventions.

[image: ImageAltText]

For more information about skeleton compatibility and sharing animations across multiple meshes, refer to the Sharing Skeletons section of the Skeleton Asset (-> skeletons-in-unreal-engine) documentation.

### Non-Skeleton Animation

In addition to Animation Sequences, you can animate the mesh of Skeletal Mesh assets using deformer animation techniques. Deformers transform the geometry of the mesh rather than the bones, to create more intricate animations, such as facial expressions, skin, clothing, or muscle movement.

For more information about animating Skeletal Meshes using deformers, see the following documentation:

- [image: Morph Target Previewer] Morph Target PreviewerUser guide for the editing modes available in the Animation Editor. (-> morph-target-previewer)

- animation
- skeletal mesh

On this page

- Create a Character Blueprint (-> skeletal-mesh-assets-in-unreal-engine)
- Modular characters (-> skeletal-mesh-assets-in-unreal-engine)
- Animating Skeletal Meshes (-> skeletal-mesh-assets-in-unreal-engine)
- Animation Blueprints (-> skeletal-mesh-assets-in-unreal-engine)
- Animating Compatible Skeletal Meshes (-> skeletal-mesh-assets-in-unreal-engine)
- Non-Skeleton Animation (-> skeletal-mesh-assets-in-unreal-engine)

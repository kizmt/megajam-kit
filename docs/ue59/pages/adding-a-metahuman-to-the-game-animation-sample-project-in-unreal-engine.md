# Adding a MetaHuman to the Game Animation Sample Project

https://dev.epicgames.com/documentation/en-us/unreal-engine/adding-a-metahuman-to-the-game-animation-sample-project-in-unreal-engine?application_version=5.9

> How to add a MetaHuman to the Game Animation Sample project.

The Game Animation Sample Project (-> game-animation-sample-project-in-unreal-engine) is an example project that you can download to access a suite of motion capture animations, and learn how to use Motion Matching in Unreal Engine. The project contains a sample MetaHuman, with preview meshes for all MetaHuman body types, that you can enable in the Game Utility Widget, to observe how the system functions when using a MetaHuman character. This example project exemplifies the premiere example for using a MetaHuman as the player character, with a high-fidelity animation system.

We also recommend you try adding and implementing your own MetaHuman character to observe how the system functions for your own character. You can use the following documentation to learn how to add and implement your own MetaHuman character to the Game Animation Sample Project.

#### Prerequisites

- You have downloaded and created a new project using the Game Animation Sample Project template. For more information about setting up the Game Animation Sample project for the first time, see the Game Animation Sample Project (-> game-animation-sample-project-in-unreal-engine) documentation.

- You have a MetaHuman character you would like to implement in the Game Animation Sample Project. For more information about creating and adding a MetaHuman to an Unreal Engine project, see the following documentation: - MetaHuman Creator - MetaHuman Animator - Animation

## Implementing your MetaHuman

- Navigate in the Content Browser to `Content/Blueprints/RetargetedCharacters`.

[image: ImageAltText]

- Locate the `CBP_SandboxCharacter_Metahuman_Kellan` Character Blueprint, and duplicate the asset by right-clicking the asset and navigate to the Duplicate option in the Context Menu.

[image: ImageAltText]

- Open your new duplicated Character Blueprint.

- In the Blueprint Editor’s components panel, select the **Body** Skeletal Mesh Component and all of its Child Components, and the **LODSync** component, and delete them using the delete key, or by right-clicking the selected components and selecting **Delete** from the context menu.

[image: ImageAltText]

- Open the MetaHuman Blueprint that you would like to add as a player in the Game Animation Sample Project. In this example workflow Danielle is used.

- Select the Body including the child components and the LODSync component again, right-click the selected components, and select **Copy** from the context menu.

[image: ImageAltText]

- Back in the Character Blueprint and paste the components onto the existing Mesh component, by selecting and right-clicking the Mesh Component, and selecting the **Paste** option in the context menu.

[image: ImageAltText]

- Reparent the Body Mesh Component to the Blueprint Mesh Component, by selecting and dragging the Body onto the Mesh in the** Components **panel.

[image: ImageAltText]

- Select the Body component to open its **Details** panel, and then navigate to the **Anim Class **property and select the `ABP_GenericRetarget AnimBP` animation blueprint.

[image: ImageAltText]

- Additionally, you will need to let the Retarget AnimBP know about the new body type, by adding a tag to the Body Mesh Component. In the **Details** panel, navigate to the Component tags property, and add a new element to the array using (**+**) **Add**. Then using the array’s text field, input the following tag:

`RTG_UEFN_to_Metahuman_nrw`

[image: ImageAltText]

- Open the **Viewport** panel within the Blueprint Editor.

[image: ImageAltText]

- Align the MetaHumans Mesh with the capsule component, by selecting the Body component, and transforming the mesh down so their feet match with the Capsule’s button, and Rotate the MetaHuman so it faces the arrow in forward direction.

[image: ImageAltText]

- Next you will need to repair the Construction Script. Open the Construction Script by selecting it in the **My Blueprint** panel, then re-add the Feet, Legs, and Torso get reference variables, by dragging each component into the graph, so that each Enable Master Pose node has a definition.

[image: ImageAltText]

- Then open the `EnableMasterPose` function in the **My Blueprint** panel in order to rebind the Body reference variable. Drag the **Body** Mesh Component into the graph, and connect its output pin to the **Ne****w Leader Bone Component** pin of the existing **Set Leader Pose Component **node.

[image: ImageAltText]

- After setting and connecting your Skeletal Mesh Component reference variables, **Save** and **Compile** your Character Blueprint.

## Add Your Character to the Game Animation Widget

- Open the Game Animation Widget asset, which can be found in the **Content** > **Widgets** folder path.

- In the Widget Editor’s **Designer** panel, copy one of the character tiles and paste it right next to the last one on the right.

[image: ImageAltText]

- Select your new Tile to open its** Details** panel, and then in the Object property, select the **Character Blueprint** that you created using the asset selection menu.

[image: ImageAltText]

- Finally **Save **and **Compile** the Game Animation Widget.

You can now play the project using PIE and use your new button in the Game Animation Widget to swap the player to be your new MetaHuman character, using the project’s animation system.

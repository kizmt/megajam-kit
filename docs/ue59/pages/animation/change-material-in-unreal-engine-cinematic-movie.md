# Switching Actor Materials in Sequencer

https://dev.epicgames.com/documentation/en-us/unreal-engine/change-material-in-unreal-engine-cinematic-movie?application_version=5.9

> How to change materials for an Actor in a Sequence.

[image: Switching Actor Materials in Sequencer]

The **Material Element Switcher** track is a Sequencer track that you can use to animate Materials on an Actor. This enables you to change materials on an Actor by adding keys for specific materials on the track.

For this how to, we can use the Paragon Phase and Fey materials from the Epic Marketplace. You can see that we already have a Material Element Switcher for Phase's Skirt. This is so we can easily see the change in materials in contrast with the jacket.

- Navigate to **Cinematics** > **Add Level Sequence**. Name and save the sequence, such as "MaterialAnim", and then open it from the **Content Browser**.

- Add the Skeletal Mesh for your actor to the Viewport. Then add the mesh as a track to your sequence.

- Under **Skeletal Mesh** Component, add a new **Track** and select a **Material Element Switcher**. You can find which material number corresponds to the element you want to change on the actor in the Skeletal Mesh animation Blueprint. [image: selecting a specific material switcher]

In this example, I want to change the jacket material, which is Material Element 10.

- In the dropdown labeled **None**, select the first material for the sequence. Then, add a key for this material in the Sequence. [image: selecting material switcher dropdown] [image: choosing material]

In this example, we will start with **MIC_Phase_jacket**, which is Phase's jacket material.

- Move the slider along the **Timeline** to where you want to change materials. Using the dropdown, select a new material and add a new key to the sequence. [image: using M_Fey_Armor material]

In this example, we changed the material to the **M_Fey_Armours** material.

- Repeat the previous step to add a third material. [image: using M_Fey_Plantseed material]

In this example, we change the material to the **M_Fey_Plantseed** material.

- The last material change is back to Phase's original jacket material, MIC_Phase_jacket. Move the slider and add a key to change the material again. In this example, I change the jacket material before the skirt material changes at the end of the sequence.

You can now playback the sequence and watch the materials change.

## End Result

- materials
- animation
- sequencer

On this page

- End Result (-> change-material-in-unreal-engine-cinematic-movie)

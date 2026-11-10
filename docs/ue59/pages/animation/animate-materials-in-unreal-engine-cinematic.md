# Material Tracks

https://dev.epicgames.com/documentation/en-us/unreal-engine/animate-materials-in-unreal-engine-cinematic?application_version=5.9

> Animate Materials in Sequencer in various ways using Material Tracks with different features.

[image: Material Tracks]

In **Sequencer**, you can change and animate **Materials** on your **Actors** in a variety of ways. Change which Material is currently applied to an Actor using the **Material Switcher Track**, animate Material Parameters (-> instanced-materials-in-unreal-engine) using the **Material Parameter Track**, or animate several Materials at once using the **Material Parameter Collection Track**.

This page provides information about the variety of ways you can animate Materials on your Actors in Sequencer.

#### Prerequisites

- You have an understanding of Sequencer (-> how-to-make-movies-in-unreal-engine) and its Interface.

- You have a basic understanding of creating Materials (-> unreal-engine-materials), Material Parameters (-> instanced-materials-in-unreal-engine), and Material Parameter Collections (-> using-material-parameter-collections-in-unreal-engine).

## Switch Materials

To switch an Actor's Material with a different one during playback of your sequence, use the **Material Switch Track**. This track can be useful if you have already created preset Material Instances and want to immediately switch between them.

To switch Materials on your Actor, first add the Mesh Component Track of the Actor in Sequencer. Click **Add Track (+)** and select the **Mesh Component**.

 [image: add mesh component]

Next, add the Material Switcher Track for this Component by clicking **Add Track (+)** on the **Component Track** and adding a **Material Element Switcher**. The element numbers correspond to the **Material Elements** currently assigned to the mesh. To change more than one material, add switchers for all necessary elements.

 [image: add material element switcher]

Once the tracks are added, you can keyframe (-> creating-animation-keyframes-in-unreal-engine) them to set materials you want to apply at a specific time. To change the assigned material, click the dropdown menu on the Material Switcher Track and select a different material.

 [image: material switcher change material]

You can now scrub or play your sequence and observe the material switching.

 [image: material switcher]

## Animate Material Parameters

To animate specific Material Parameters (-> instanced-materials-in-unreal-engine) over time within a material, use the **Material Parameter Track**.

Similar to switching Materials, you must first add the Mesh Component Track of the Actor in Sequencer. Click **Add Track (+)** on the Actor Track and select the **Mesh Component**.

 [image: add mesh component]

Next, add the Material Parameter Track for this Component by clicking **Add Track (+)** on the **Component Track** and adding a **Material Parameter Element**. The element numbers correspond to the **Material Elements** currently assigned to the mesh. To animate parameters on more than one material, add Material Parameter Tracks for all necessary elements.

 [image: add material elements]

Once the element track is added, add a specific Material Parameter to animate. Click **Add Parameter (+)** on the **Material Element Track** then select a parameter. Add as many parameter tracks as needed for your element.

 [image: add parameters]

Depending on the type of parameter added, Sequencer will interface with it using compatible Property Tracks (-> cinematic-transform-and-property-tracks-in-unreal-engine). For example, adding a **Vector Parameter** will create a Color Track (-> cinematic-transform-and-property-tracks-in-unreal-engine)

Once the parameter tracks are added, you can keyframe (-> creating-animation-keyframes-in-unreal-engine) them normally to animate the parameters. Afterward, scrub or play your sequence to observe the effects of the parameter changing.

 [image: animate material parameter]

As you can with usual section usage, Material Parameter Sections can be blended (-> creating-animation-keyframes-in-unreal-engine) with one another by overlapping their sections. This can be useful to blend between different preset material states, rather than directly animating them.

 [image: blend material parameter section]

## Animate Material Parameter Collections

Sequencer also contains the **Material Parameter Collection Track** for animating Material Parameter Collections (-> using-material-parameter-collections-in-unreal-engine). Use it to directly animate any material where the collection is referenced, so Sequencer can affect multiple materials at the same time.

To create a Material Parameter Collection track, click **Add Track (+)** in **Sequencer** and select your **Material Parameter Collection Asset** from the **Material Parameter Collection Track** menu.

 [image: create material parameter collection track]

You can then add individual parameters from this collection by clicking **Add Parameter (+)** on the track and selecting a parameter. The parameters listed here are based on the parameters created in the collection asset. Once a parameter is selected, its corresponding track is created with a keyframe set at your current time along the timeline.

 [image: add material parameter collection parameter]

Due to the arbitrary nature of Material Parameter Collections and how they are set up within each Material's graph, there are a variety of ways the Material Parameter Collection Track can affect your scene. In this example, a vector parameter is used to control additional color tinting on the character. Changing this parameter affects all child instances of this material.

 [image: material parameter collection material setup]

Once the parameter tracks are added, you can keyframe (-> creating-animation-keyframes-in-unreal-engine) them as usual to animate the parameters. Afterward, scrub or play your sequence to observe the effects of your animated parameter collection.

 [image: animate material parameter collection]

- materials
- sequencer

On this page

- Prerequisites (-> animate-materials-in-unreal-engine-cinematic)
- Switch Materials (-> animate-materials-in-unreal-engine-cinematic)
- Animate Material Parameters (-> animate-materials-in-unreal-engine-cinematic)
- Animate Material Parameter Collections (-> animate-materials-in-unreal-engine-cinematic)

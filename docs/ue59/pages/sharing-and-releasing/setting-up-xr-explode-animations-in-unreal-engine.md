# Setting Up Explode Animations

https://dev.epicgames.com/documentation/en-us/unreal-engine/setting-up-xr-explode-animations-in-unreal-engine?application_version=5.9

> Describes how to set up an "exploded" view of an assembly or a group of objects.

[image: Setting Up Explode Animations]

A common way to interact with an assembly made up of smaller parts is to explode it: to break its component parts apart from each other in space, so that viewers can see each individual part on its own as well as how they all fit together.

The Collab Viewer Template includes a Blueprint class that you can use to set up an exploded view of your parts, and to toggle the assembly smoothly between its default view and its exploded view at runtime.

## Setting Up Initial and Exploded Positions

To set up an exploded view for your own content:

- Remove any **BP_Explode** Actors that you have in your scene already. (You can have multiple **BP_Explode** Actors in your Level, but the Interaction Menu currently only lists one explode animation at a time.)

- Make sure you're working in the same Level as the content that you want your Actor to manage. The **BP_Explode** Blueprint can only work for content within the same Level as itself. For example, if you're working with the default sample content, open the **Levels** window (**Window > Levels**) and double-click **SampleLevel**. [image: SampleLevel]

- Find the **BP_Explode** Blueprint class in the **Content Browser**, under the **CollaborativeViewer/Blueprints/Commands/Explode** folder, and drag it into the Viewport. [image: Drag and drop a BP_Explode]

- Select the new Blueprint Actor in the Viewport or the **Outliner**. [image: Select the BP_Explode]

- At the top of the **Details** panel, give your Actor a descriptive name. This name will be visible at runtime in the Interaction Menu so you can trigger and reverse the explode animation. [image: Rename BP_Explode Actor]

- In the **Details** panel, find the **Explode** group. You'll use this group of controls to set up the default and exploded views for your assembly. [image: BP_Explode Details]

- In the **Actors Root** list, you'll need to identify which Actors this Blueprint should animate in the Level. You can add each Actor to the list separately.

- If all the Actors you want to animate are children of the same parent Actor in the **World Outliner**, you only need to add the parent to this list.

For example, in the image shown above for the previous step, the **Building_Parrent** Actor is selected. This Actor is the parent of all the default content items that are part of the building. This makes the Blueprint capable of animating all the Actors that make up that building, but not the trees, the transmission assembly, or the exterior ground.

- When you have all the Actors you need in the list, move them all in the Viewport (if necessary) so that they appear in the arrangement that you want to be their default starting position. Click the **Set Initial Location** button to record these transforms.

- Now, move all the Actors in the Viewport to the positions you want them to be in when exploded. Click the **Set Explode Location** button to lock in these transforms.

- You can test the recorded transforms in the Unreal Editor by clicking the **View Explode** and **View Initial Location** buttons. When you click these buttons, all the animated parts should swap between the preset positions in the Level Viewport. They won't animate smoothly the way they do at runtime, but you'll be able to check that the Actor positions in 3D space are set up the way you're expecting. [image: Select View Explode]

The **BP_Explode** Actor keeps lists of the Actors it manages. If you need to modify the objects owned by the **BP_Explode**—for example, to delete some Actors from the Level or change their parenting hierarchy—you must re-set **both** the initial and explode locations right away before you attempt to view either the initial or explode locations in the Editor. If you don't, these lists of Actors may become out of date. This may result in losing the desired placement of some Actors in your scene.

You can add multiple **BP_Explode** Actors to your Level to animate different parts of your assembly. However, only the first one will appear in the Interaction Menu.

If you do create multiple **BP_Explode** Actors, don't include any Actor in more than one **BP_Explode**. If you do, its positions may not end up where you're expecting.

## Switching Between Positions at Runtime

To switch between the exploded and default views at runtime:

- Run or test your game, and open the Interaction Menu. (In desktop mode, press **Spacebar**. In VR mode, press the shoulder buttons on the right-hand controller.) You'll see an item at the bottom of the menu with the name of the **BP_Explode** Actor you created.

- Highlight this menu item and select **Execute** to make all parts registered with the same **BP_Explode** move smoothly from their current location in the Level to their exploded position. [image: Execute command]

- If you re-open the Interaction Menu while the assembly is exploded, you'll see a **Execute command** option. Select this to return the exploded parts from their current location back to their default starting positions. [image: Back to default]

The following video shows the custom animation we built in the previous section in operation at runtime.

- collaboration
- templates
- collab viewer
- design review
- ar/vr/xr

On this page

- Setting Up Initial and Exploded Positions (-> setting-up-xr-explode-animations-in-unreal-engine)
- Switching Between Positions at Runtime (-> setting-up-xr-explode-animations-in-unreal-engine)

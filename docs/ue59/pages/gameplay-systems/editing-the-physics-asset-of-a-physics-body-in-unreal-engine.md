# Editing the Physics Asset of a Physics Body

https://dev.epicgames.com/documentation/en-us/unreal-engine/editing-the-physics-asset-of-a-physics-body-in-unreal-engine?application_version=5.9

> This tutorial covers the procedures for editing the Physics Bodies of a Physics Asset.

[image: Editing the Physics Asset of a Physics Body]

Below are several common procedures and steps associated with editing **Physics Bodies** in the **Physics Asset Editor**.

If it is difficult to see the Physics Body you want to edit, in the **Viewport** select **Character > Mesh > Wireframe/None** to adjust the visibility of the **Skeletal Mesh**.

 [image: Character Mesh options in the Viewport]

## Editing a Physics Body

- Double-click your **Physics Asset** to open it in the Physics Asset Editor.

- Select a Physics Body in the **Viewport** or in the **Skeleton Tree** panel.

- **Select, move, rotate, and scale** the Physics Body using the **Selection**, **Translation**, **Rotation**, and **Scale** tools so it fits the **Skeletal Mesh Bone**. [image: Select, move, Rotate, and Scale tools]

- Edit the Physics Body's properties in the **Details** panel.

- Use the **Enable Collision** and **Disable Collision** tools in the toolbar to edit Collisions between the current Physics Bodies and others in the Physics Asset. Any Physics Bodies that can collide with the currently selected Physics Body will be blue; if they cannot collide, they will be gray. [image: Enable Collision and Disable Collision tools]

- If a series of bodies should act as one, such as with the twist joints that form a wrist, use the Weld (-> welding-physics-bodies-in-unreal-engine-by-using-the-physics-asset-editor) tool to prevent undesired physics simulation behavior. Welded Physics Bodies will be yellow.

- **Save** often.

See the Physics Bodies Reference (-> physics-bodies-reference-for-unreal-engine) for more information on the Physics Bodies properties in the Physics Asset Editor.

## Copying Physics Bodies

While in either mode, properties from one Physics Body can be copied to other Physics Bodies:

- Select the **Physics Body** you wish to copy data from.

- **Press Ctrl + C**.

- Select the **Physics Bodies** you wish to apply data to.

- **Press Ctrl + V**.

This will not overwrite the shape of a Physics Body.

## Deleting Physics Bodies

- Double-click your **Physics Asset** to open it in the Physics Asset Editor.

- Select a **Physics Body** you wish to delete in the **Viewport** or in the **Skeleton Tree** panel.

- Press the **Delete** key.

## Physical Materials

Each Physics Body in a Physics Asset can have a **Physical Material** assigned to it. To apply a Physical Material to a single Physics Body:

- Double-click your **Physics Asset** to open it in the Physics Asset Editor.

- Select a **Physics Body** in the **Viewport** or in the **Skeleton Tree** panel.

- In the **Details** panel, locate the **Simple Collision Physical Material** property and assign a **Physical Material**.

 [image: Apply a Physical Material to a single Physics Body]

- physics

On this page

- Editing a Physics Body (-> editing-the-physics-asset-of-a-physics-body-in-unreal-engine)
- Copying Physics Bodies (-> editing-the-physics-asset-of-a-physics-body-in-unreal-engine)
- Deleting Physics Bodies (-> editing-the-physics-asset-of-a-physics-body-in-unreal-engine)
- Physical Materials (-> editing-the-physics-asset-of-a-physics-body-in-unreal-engine)

# Level Streaming using Volumes

https://dev.epicgames.com/documentation/en-us/unreal-engine/level-streaming-using-volumes-in-unreal-engine?application_version=5.9

> How to use volumes to control the streaming of Levels based on the player's viewpoint.

[image: Level Streaming using Volumes]

We want to start streaming in the patio level here, so that by the time the player rounds the corner and begins approaching the patio, the streaming level
will be loaded and visible.

As part of the setup, we have two levels, **SunTemple_Persistent** and **SunTemple_Streaming**. Our **Player Start** is in **SunTemple_Persistent**, and our player in the game is
represented by a Character.

- Open **SunTemple_Persistent** in the **Content Browser**.

- Move the **Player Start** to the very beginning of the temple.

- Click on **Windows**, then select **Levels**.

- Click on the **Levels** dropdown menu, then select **Add Existing...** to add a new sublevel.

- Select **SunTemple_Streaming** to add in the **Open Level** dialog, then click on **Open**.

- **Right-click** on **Persistent Level** and select **Make Current** from the dropdown menu.

## Streaming In Levels with Volumes

- In the **Place Actors** panel, select the **Volumes** tab and then drag a **Level Streaming Volume** into your level.

- Arrange the **Level Streaming Volume** to encompass the whole walkable area of **SunTemple_Streaming**. Keep in mind that the logic for Level Streaming Volumes tracks where your active camera is, so if you have a camera placed at a distance from your player's Pawn or Character, you may need to adjust the size and placement of the Level Streaming Volume accordingly.

- Click on **Windows**, then select **Levels**.

- Select **SunTemple_Streaming**, then click on the **Level Details** icon.

- Next to **Streaming Volumes**, click on the plus sign (**+**) to add a new volume. Then, use the dropdown menu or the eyedropper to select the **Level Streaming Volume** you just placed in the level.

- Ensure that the **Initially Loaded** and **Initially Visible** checkboxes are unchecked, then close the **Level Details** panel.

- Back in the **Viewport**, select the **Level Streaming Volume**. In the **Details** panel, set the following properties of the volume: **Editor Pre Vis Only** and **Disabled** should be unchecked, and **Streaming Usage** should be set to **SVB Visibility Blocking on Load**.

- Use **Play in Editor** to test out your streaming level.

- level streaming

On this page

- Streaming In Levels with Volumes (-> level-streaming-using-volumes-in-unreal-engine)

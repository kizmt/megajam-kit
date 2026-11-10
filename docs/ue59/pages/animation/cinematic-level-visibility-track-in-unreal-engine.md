# Level Visibility Track

https://dev.epicgames.com/documentation/en-us/unreal-engine/cinematic-level-visibility-track-in-unreal-engine?application_version=5.9

> Set the contents of Levels to be visible or hidden with the Level Visibility track.

[image: Level Visibility Track]

There may be times when you want to toggle the visibility of entire **Levels** (-> levels-in-unreal-engine) during your sequences. You can do so with the **Level Visibility Track** by setting Levels to either **Visible** or **Hidden** within Sequencer.
This does not stream in/out the level but sets all the content within the level to either Visible or Hidden.

In this example we create two very small levels with unique content and toggle the visibility of those levels during our cinematic.

## Steps

For this how-to, we are using the **Blueprint Third Person Template** with **Starter Content** enabled.

- Inside your project in the **Content Browser**, **Right-click** and create two **Levels** named **Level01** and **Level02**.

- Open **Level01**, then in the viewport click the **ViewMode** drop-down and select **Unlit** This will make it easier to see the items that we place in the level since there are no lights.

- From the **Content Browser** under **Content/StarterContent/Architecture** drag the **SM_AssetPlatform** into the level.

- From the **Content Browser** under **Content/StarterContent/Props** drag the **SM_Chair** into the level.

- **Save** the level, then open the **Level02** level and drag a **Wall_Door_400x300** into the level.

- Drag the **Floor_400x400** (or any other assets) into the level as shown below. The content we are added are for example purposes to distinguish Level 01 from Level 02. Feel free to add your own content!

- In the **Content Browser** under **Content/ThirdPersonBP/Maps** open the **ThirdPersonExampleMap** and set the viewport to **Lit**.

- From the Menu Bar, select **Window** then select **Levels**.

- Click the **Levels** drop-down menu then select **Add Exisiting...**. We need to add which levels we want to affect with the Level Visibility Track.

- In the **Open Level** window point to your **Level01** then repeat the process and add **Level02**.

- Hold **Shift** and click on each level, then **Right-click** and change the **Streaming Method** to **Always Loaded**. This will allow us to selectively turn on/off each level with Sequencer's Visibility Track.

- **Right-click** on the **Persistent Level** and select **Make Current**. Our Levels are now set and we can jump into Sequencer and use our Level Visibility Track to affect them. Please see the Level Streaming (-> level-streaming-in-unreal-engine) for more information on Level Streaming.

- From the Toolbar, click **Cinematics** and **Add Level Sequence**.

- In Sequencer, click the **Add** button and add the **Level Visibility Track**.

- On the Level Visibility Track, click the **Visibility Trigger** button and add two **Visible** and two **Hidden** tracks.

- **Right-click** on the top-most Visible track, then under **Properties** click the **+** for **Level Names** and enter **Level01**. The **Level Names** field is where we define what level we want to affect, which we set to **Level01** for this track.

- Repeat the previous step for the second **Visible** track, but use **Level02** instead.

- For the two **Hidden** tracks, set one of the **Level Names** to **Level01** and the other to **Level 02** then arrange as shown below. Above, the top-most tracks are pertaining to **Level01** where we move from Visible to Hidden. The bottom two tracks pertain to **Level02** where we start out **Hidden** then move to **Visible**. You may not see your items in the level, used the **WASD** keys and check under the level. The location where they appear when streamed in is based on the location they are placed in their corresponding levels. You can select the level streamed in Actors like you can any other Actor and manipulate them with the **Transform Tools**.

- Use the preview **Play** button for the Sequencer Editor to play the Level Sequence.

## End Result

The items placed in Level 01 will appear in the Persistent Level before disappearing at which point the items placed in Level 02 appear.

We also dragged the Level Sequence asset into the Level and enabled the **Auto Play** option so that we could use the **Play in Editor** option.

One thing to keep in mind with using the Level Visibility Track is that while you can toggle whether or not a level and its assets are hidden or visible, it does not unload or load levels as each level still sits in memory and is either rendered or not rendered based on the setting you choose.

- sequencer

On this page

- Steps (-> cinematic-level-visibility-track-in-unreal-engine)
- End Result (-> cinematic-level-visibility-track-in-unreal-engine)

Related documents

Levels

 [image: Levels] (-> levels-in-unreal-engine)

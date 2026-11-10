# Keeping or Restoring Changes Made by Sequencer

https://dev.epicgames.com/documentation/en-us/unreal-engine/what-happens-when-my-cinematic-ends-in-unreal-engine?application_version=5.9

> Describes how to keep any changes made through Sequencer when it has completed or restore changes back to their original state.

[image: Keeping or Restoring Changes Made by Sequencer]

When working in Sequencer, you may make changes to the properties of your Actors that you want to persist after the cinematic finishes. For example, you might create a cinematic where a player unlocks and opens a door, and the door remains in the open state afterward. In a film production environment, however, you may want animated values in a shot to return to their pre-animated state so they don't bleed into the next shot. With the **When Finished** property, you can determine on a per-track basis whether tracks should return to their pre-animated state or keep changes when the sequence finishes.

In this how-to guide, you will use the When Finished property to restore the color change of a light but keep the changes made to the movement of a door.

## Steps

For this how-to guide, we are using the **Blueprint Third Person Template** with **Starter Content** enabled.

- From the **Content/StarterContent/Props** folder, drag an **SM_Door** and **SM_DoorFrame** into the **Level Viewport** and position the door inside the frame. Press the **W** key to enter translation mode and, if needed, disable grid snapping (pictured below) to fine tune the position of the door in the frame.

- From the **Place Actors** panel in the **Lights** tab, drag a **Point Light** into the **Level Viewport** and position it in front of the door.

- Position the **ThirdPersonCharacter** in the **Level Viewport** in front of the door.

- From the **Main Toolbar**, click the **Cinematics** button and select **Add Level Sequence**.

- In the **Save Asset As** window, select a **Name** and save location, then click **Save**.

- In the **Sequencer** window, click the **Add** button and select **Shot Track**. This will create a Shot Track which enables you to section off parts of your cinematic into self-contained "shots" that you can arrange and re-arrange.

- On the **Shot Track**, click the **+ Shot** button and **Insert Shot** and use the default naming convention when prompted.

- Grab the end of the shot and pull it back to **Frame 75** so the shot is half the length of the entire sequence. We are going to use the shot to affect the light in our scene, but restore those changes once the shot is over.

- With the **Timeline** at **Frame 0** and the **SM_Door** selected in the level, add the **Actor To Sequencer** from the **+ Add** button. We will affect the door on the master level and keep the state of the changes we are going to apply.

- Click the **Add (+)** button on the **Transform** track of **SM_Door**.

- Move the **Timeline** marker to **Frame 150**, then rotate the door (**E** key) in the level so it is open and press the **S** key to add its transform while open. This will cause the door to go from closed to open once we reach the end of the cinematic.

- Double-click on the shot in the **Shot Track** to open it, then in the level select the **Point Light** and add it to the shot.

- On the **Light Color** track, click the **+** sign to assign the default color to use at **Frame 0** of the shot.

- Move the **Timeline** marker to **Frame 75** and change the **Light Color** to **Green** (or any color you desire) adding keys for the new values.

- Right-click on the **Light Color** track in the tracks window and select **Properties** to view the **When Finished** state. By default, **When Finished** states that this track will **Restore State** (return to its original state) when the section is completed.

- Exit the **Shot** and return to the **Master Sequence** level by clicking the breadcrumb buttons in the upper-right of the **Sequencer** window.

- Right-click on the **Transform** track of the **SM_Door** and select **Properties**, then change the **When Finished** property to **Keep State**. We are now stating that we want to **Keep State**, meaning we want to keep the changes that we apply through Sequencer when the cinematic is complete.

- Select the **Level Sequence** Actor in the level, then, in the **Details** panel, set the **Auto Play** option to **True**.

- From the **Main Toolbar**, click the **Build** button and select **Build Lighting Only**, then (after lighting has built) click the **Play** button.

## End Result

When you play in the level, the light will change colors before returning to white. Our door, however, will remain in the opened state.

For the light inside our shot, we used the default **When Finished** property value of **Restore State**, which will restore it back to its original state when the shot is finished.
For the door, however, we changed the When Finished property to **Keep State** preserving our changes and keeping the door in the open state when the cinematic completes.

One thing to consider is that, while Keep State has a local effect, there is a global **Restore State** option contained within the **Level Sequence** actor:

The Restore State option in the **Details** panel of a Level Sequence actor will restore all states when the Level Sequence stops. If you want to keep the state of a track after the sequence has completely finished, you will need to make sure both that your section is set to Keep State, and the Level Sequence actor is **not** set to Restore State, otherwise the global value will override your local settings.

- how-to
- sequencer

On this page

- Steps (-> what-happens-when-my-cinematic-ends-in-unreal-engine)
- End Result (-> what-happens-when-my-cinematic-ends-in-unreal-engine)

# Playing and Simulating

https://dev.epicgames.com/documentation/en-us/unreal-engine/playing-and-simulating-in-unreal-engine?application_version=5.9

> Play-testing and simulating your game inside the Unreal Editor.

[image: Playing and Simulating]

You can instantly preview your game inside Unreal Editor at any time, without needing to build it into a standalone application first. This can help you quickly iterate on gameplay and asset tweaks and see how your game changes as a result.

There are two ways to preview your game in **Unreal Engine**:

- **Play In Editor** (PIE), which you can access from the **Play** button on the **Main Toolbar**.

- **Simulate In Editor** (SIE), which you can access from the **Play** drop-down menu or by using the **Alt + S** on Windows keyboard shortcut (or **Option + S** on macOS).

The key difference between playing and simulating in the Editor is that **playing** will always start the game at the Player Start location and give you control of the player character. **Simulating** doesn't move the Camera and doesn't spawn a player character.

You can toggle between Play In Editor and Simulate In Editor sessions as needed.

For this tutorial, we have created a new project using the **Blueprint Third Person** template with **Starter Content** enabled. If you have not created a project based off a template before or are not sure how to enable Starter Content, refer to the Creating a New Project (-> creating-a-new-project-in-unreal-engine) page to learn how to do this.

## Play In Editor (PIE)

This section will show you how you can use **Play In Editor** to play your game.

- With the **Blueprint Third Person** Template Project open, from the **Main Toolbar**, click the **Play** button. [image: Play button on the Main Toolbar] After you click the **Play** button, the game should start and you should see the character in the Level Editor Viewport. [image: A third-person project in Play mode]

You will also see the text "Click for Mouse Control" flash briefly in the upper-left corner of the Level Viewport. When playing inside the Level Viewport, you must click inside the viewport to assign mouse control to the playable character.

- Click or right-click in the Level Editor Viewport. You will see the text "Shift+F1 for Mouse Cursor" appear in the upper-left corner of the Level Editor Viewport. If you want to give mouse control back to the Editor itself, press **Shift + F1** (Windows) or **Shift + fn + F1** (macOS). While the game is running, you can use the **WASD** keys for movement, **Spacebar** to jump and **Mouse** movement to move the camera.

- During the Play session, the **Main Toolbar** will change to provide additional controls. [image: Main Toolbar during PIE] Left to right, the controls are: **Pause**: Pauses the game.

- **Frame Skip**: This will be grayed out and unavailable while your game is running in this mode.

- **Stop**: Ends the Play session.

- **Eject**: Releases control of the playable character and switches to mouse cursor controls.

You can click inside the Level and use the mouse to move around, or you can use the Editor to make changes to your Level.

- While the game is still running in PIE mode, press **Shift + F1** to unlock the mouse cursor from the Level Viewport, then click **Pause** to pause the game. You will notice that the first two buttons on the **Main Toolbar** look slightly different: [image: Controls available while PIE is paused] The **Play** button has been replaced with a **Resume** button. Clicking the **Resume** button will resume the game simulation inside the Level Viewport.

- The **Frame Skip** button is now available. Clicking it will advance gameplay by 1 frame (you can see this easily if you have animated objects, such as particle emitters).

The **Stop** and **Eject** buttons have the same functionality as described in step 3 above.

- While the game is still paused, **click** the **Eject** button on the **Main Toolbar**.

- **Left-click** the text in the Level Viewport to select it. Then in the **Details** panel, change its **Text** value to something else. [image: Changing the value of a text Actor during PIE] Press **Enter** to confirm the new text. Your changes will immediately appear in the Level Viewport.

- From the **Main Toolbar**, click the **Possess** button (1), then click the **Resume** button (2). [image: Possess and Resume buttons]

- Note that the text in the Level has changed from its default value. This method is useful for changing and testing different values for the Actors in your Level during gameplay. [image: New value of the text Actor] Changes you make to Actors in the Level using this method are **not** saved by default. To learn how to keep these changes, follow the steps below.

- Press **Shift + F1** to regain mouse control. Then, from the main toolbar, click the **Eject** button.

- With the game still running in the Level Viewport, **right-click** the text Actor. Then, from the pop-up menu, select **Keep Simulation Changes**. [image: Keep Simulation Changes menu option] Alternatively, **left-click** the text Actor to select it, then press **K** on your keyboard.

- Press **Esc** to stop the play session. Note that your changes have been saved.

### Play Modes

When you start a PIE session, you can select from several different **Play Modes**. This section describes what they are and how to access them.

- From the **Main Toolbar**, click the vertical ellipsis button. [image: Play Options button on the Main Toolbar] This will open the **Play Options** menu.

- Choose from one of the following options: **Selected Viewport**: Launches the game inside the currently selected Viewport (-> editor-viewports-in-unreal-engine).

- **Mobile Preview ES3.1 (PIE)**: Launches the game in a standalone version outside of the Editor and provides additional tools used to mimic devices as closely as possible.

- **New Editor Window (PIE)**: Launches the game within the Editor; however, it creates a new standalone window, leaving the Level Viewport the same.

- **VR Preview**: Launches a preview of the game on a connected VR device.

- **Standalone Game**: Launches the game in a standalone version outside of the Editor

The default setting is **Selected Viewport**.

### PIE Console

The **PIE Console** is an in-game console where you can enter commands to display performance data, enable and disable Unreal Engine features, and much more.

To open the PIE console, press the **tilde** (~) key while playing the game in PIE mode.

 [image: Play In Editor Console]

Press the **tilde** key again to expand the console, and press **tilde** a third time to close it.

The PIE console behaves the same as the Unreal Editor's main console. When you start typing, it automatically tries to complete the console command you are trying to enter.

A great use case for the PIE Console is to profile a project's performance. To learn more, refer to the Stat Commands (-> stat-commands-in-unreal-engine) page.

## Simulate In Editor (SIE)

In this section, we will take a look at **Simulate In Editor** and how to simulate your game.

- With your project open, inside the **Content Browser**, open the **Starter Content > Props** folder.

- Click and drag the **Material Sphere** prop into the Level, just above the stairs. [image: Dragging a sphere into the Level] To find the **Material Sphere** prop quickly, use the **Search Box** inside the Content Browser.

- Click the sphere to select it, then click the arrows of the Translation widget to move the sphere up above the stairs, as shown in the screenshot below. [image: Position the sphere as shown]

- In the **Details** panel for the sphere, scroll down to the **Physics** section and enable the **Simulate Physics** checkbox. [image: The sphere's Details panel]

When you start to simulate (or play), the sphere now has physics and should fall to the ground.

- Press **Alt + S** (Windows) or **Options + S** (macOS) to Simulate in the Editor. [image: Sphere with physics enabled] Note that, although there is no player character in the Level, the game starts and the sphere falls to the ground.

- Press **Esc** to stop the simulation. Note that the **Main Toolbar** now displays a **Simulate** button instead of the **Play** button. This button will always reflect the most recently selected **Play** or **Simulate** mode that ran for this project. [image: Simulate button on the Main Toolbar]

- Click the **Simulate** button again, then immediately click the **Pause** button.

- From the **Main Toolbar**, click the **Frame Advance** button to step through the simulation. Every time you click the button, the sphere should move further down. [image: Advancing the simulation one frame at a time]

- testing

On this page

- Play In Editor (PIE) (-> playing-and-simulating-in-unreal-engine)
- Play Modes (-> playing-and-simulating-in-unreal-engine)
- PIE Console (-> playing-and-simulating-in-unreal-engine)
- Simulate In Editor (SIE) (-> playing-and-simulating-in-unreal-engine)

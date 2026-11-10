# Recording Animation Using Take Recorder

https://dev.epicgames.com/documentation/en-us/unreal-engine/recording-animation-using-take-recorder-in-unreal-engine?application_version=5.9

> Learn how to use Take Recorder to capture animation from actor manipulation, physics simulations, and gameplay.

**Take Recorder (-> take-recorder-in-unreal-engine)** can record from various sources in both editor and gameplay contexts. The tutorials below illustrate how you can record your actions in Take Recorder.

## Record Actor Manipulation in the Viewport

You can use **Take Recorder** to record actor manipulation in the **Viewport (-> using-editor-viewports-in-unreal-engine)**.

- Add the object you want to record to the **Sources (-> take-recorder-in-unreal-engine)** list. Select the actor in the **Viewport**.

- Click **Add Source (+) > From Actor > Add 'Sphere'**.

 [image: Select the sphere as the source]

Once the actor is sourced, you are ready to record your animation.

- Click **Record (-> take-recorder-in-unreal-engine)**. A countdown and notification appears. When the countdown reaches 0, the sequence starts to record. Select your actor in the Viewport and move it around to capture its editor motion. When finished, click the **Stop** button or press the **Esc** key. [image: Recording of hand animated sphere]

- Click **Review Last Recording** to view the recording.

- Click **Play** in Sequencer (-> unreal-engine-sequencer-movie-tool-overview) to observe your recorded actor data. [image: Sequence playback]

You might see a duplicate actor performing the actions instead of the editor object. This is because the record type for the actor was set to record as a **Spawnable Actor**. You can change this on the source object or globally on the project by changing the **Record to Possessable (-> take-recorder-in-unreal-engine)** property in the Take Recorder details. If you record to a Possessable Actor, then you only see the original actor animate.

## Physics

You can use **Take Record** to capture physics simulations as animation data.

- Add a sphere to your scene.

- In order to break the sphere, you need to move the sphere away from the ground surface so it can gain momentum. Move the sphere up, away from the ground surface.

- In the Details panel, enable Simulate Physics (-> playing-and-simulating-in-unreal-engine).

- Now, the timing to record physics to a sequence is a bit tricky. You need to start **Take Recorder** at the same time as you hit play to capture the motion you're looking to capture. In order to accomplish this, you need to remove the countdown timer for Take Recorder. Open the **Show/Hide user/project settings (-> take-recorder-in-unreal-engine)** (gear icon) in the Take Recorder panel.

- Under **User Settings**, set **Countdown (-> take-recorder-in-unreal-engine)** to **0.0s**.

- Hover your mouse over **Record** in **Take Recorder**.

- Use the **hotkey Alt-P** to start playback and immediately click the **Record** in **Take Recorder**.

- Let the simulation play through and stop the recording (click **Stop Recording** or press **ESC**) when you are satisfied with the recording. [image: Recording physics simulation]

Now that you have recorded your physical simulation, you can review it.

- To open your take, click **Review Last Recording**.

- In **Sequencer**, click **Play** and watch your recording from any angle.

## Gameplay

You can use **Take Recorder** to record gameplay actions such as the player's movement and animation in a Level.

- From **Take Recorder**, select **Add Source (+) > Player** to add the **Player Actor (-> take-recorder-in-unreal-engine)** to the **Sources** list

- Click **Play** in the Unreal Engine toolbar to start a Play in Editor (-> ineditor-testing-play-and-simulate-in-unreal-engine) (PIE) session.

- After the session has started, click **Record**. When the countdown reaches 0, the sequence starts to record. Move the character around your Level to capture its animation. When finished, click **Stop** or press **Esc**. [image: Record gameplay]

- Click **Review Last Recording** to view the recording.

- Click **Play** in Sequencer to preview the animation of your recorded player. [image: Playback for gameplay recording]

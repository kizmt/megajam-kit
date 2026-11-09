# Rendering your Niagara Systems

https://dev.epicgames.com/documentation/en-us/unreal-engine/rendering-your-niagara-systems?application_version=5.9

> Learn how to set up and render your Niagara systems in Unreal Engine.

[image: Rendering your Niagara Systems]

## Configuring your Project

Before creating a Level Sequence, click **Settings > Plugins** to open the **Plugins window** and **enable** the following plugins:

- Niagara MRQ Support

- Niagara SIM Caching

Restart the editor if prompted. Now you are ready to create your Level Sequence.

## Creating a Level Sequence

Follow these steps to create a **Level Sequence** with a **Camera** and generate frames with the **Movie Render Queue (MRQ)**:

- Right-click in the **Content Browser**, navigate to **Cinematics** and create a **Level Sequence**.

- Rename your Level Sequence to something appropriate.

- Double-click the Level Sequence to open it.

- Click the **Camera** button at the top of the Sequencer panel to create a new **Cine Camera** and a **Camera Cuts track**.

- Use the 3D view controls to position your camera to a framing that you like.

## Rendering Frames with Movie Render Queue

- Press the **Clapper Board** button on the top of the **Sequencer panel** to open **Movie Render Queue (MRQ)**.

- If you have ffmpeg configured: Click on the **Settings** for your sequence, probably called '**Unsaved Config**'.

- Press the **+Setting** button

- Add a **Command Line Encoder** settings block.

- Press the **Accept** button to leave the Settings dialog.

- On the Movie Render Queue panel, press the **Render (Local)** button.

MRQ will now run. It may compile necessary shaders as a first step before showing you a preview of the frames being generated.

If you do not have the FFmpeg codec installed on your computer, read the How to use FFmpeg with the Command Line Encoder in Movie Render Queue document to learn how to install it.

On this page

- Configuring your Project (-> rendering-your-niagara-systems)
- Creating a Level Sequence (-> rendering-your-niagara-systems)
- Rendering Frames with Movie Render Queue (-> rendering-your-niagara-systems)

# ML Deformer Sample

https://dev.epicgames.com/documentation/en-us/unreal-engine/ml-deformer-sample-in-unreal-engine?application_version=5.9

> Example use of Unreal Engine's Machine Learning (ML) techology to create a high-fidelity character with realistic deformations.

The Machine Learning (ML) Deformer Sample demonstrates how you can use Unreal Engine's Machine Learning (ML) technology to create a high-fidelity real-time game character, with realistic deformations driven by learned offline muscle, flesh and cloth simulations. The sample uses the ML Deformer (-> how-to-use-the-machine-learning-deformer-in-unreal-engine) plugin.

This main Level in the sample is an interactive demo sequence. It shows muscles bulging and sliding under the skin and folds forming on clothing. You can also compare the results with ML Deformer on and off, and animate the model with the included ControlRig Asset.

## Downloading the Sample

To create a project with the ML Deformer sample, follow these steps:

- Access the ML Deformer sample from **Fab** and click **Add to My Library** for the project file to show in the **Epic Games Launcher**. - Alternatively, you can search for the sample project using Fab in Launcher, or the Fab plugin for UE.

- From the **Epic Games Launcher**, go to **Unreal Engine > Library > Fab Library** to access the project. > **note:** Sample projects only appear in **Fab Library** when you install the compatible engine version.

- Click **Create Project** and follow the on-screen instructions to download the sample and start a new project.

To learn more about accessing sample content from Fab, see Samples and Tutorials (-> samples-and-tutorials-for-unreal-engine).

## Navigating the Scene

While the scene is playing in-Editor, you can use keyboard or PlayStation gamepad controls to navigate the scene. These controls are configured in the `KeyboardGamepadMapping` file, located in the `Content/Input/` folder, and you can customize them.

### ML Deformation Toggle and Layers

While the scene is playing, press and hold the **M** key, or **left D-pad** button on your gamepad, to temporarily disable ML deformation.

Press the **Up** and **Down** arrow keys or use the D-pad **up / down** buttons to switch between the cloth, skin, and muscle layers.

[image: Character layers]

Toggle between normal Materials and a clay shader with the **N** key or the **right D-pad** button.

### Playback and HUD Controls

While the scene is playing in PIE, you can use the following playback controls:

| Action | Keyboard Shortcut | Gamepad Shortcut |
| --- | --- | --- |
| Pause playback | Spacebar | X button |
| Decrease playback speed | Comma | Square button |
| Increase playback speed | Period | Circle button |

You can also enable two separate Heads-Up Display (HUD) widgets:

| Widget | Keyboard Shortcut | Gamepad Shortcut |
| --- | --- | --- |
| Stats and performance widget | H | L1 button |
| Shortcut helper widget (shows gamepad button shortcuts) | Tab | Special button (right) |

### Camera Controls

Press the **O** key, or **triangle** button on your gamepad, to enable or disable camera controls.

While camera controls are enabled, you can use the following keyboard shortcuts:

| Action | Keyboard Shortcut | Gamepad Shortcut |
| --- | --- | --- |
| Orbit camera left / right | A / D | Left thumbstick (move horizontally) |
| Dolly (zoom) in / out | W / S | Left thumbstick (move vertically) |

## Character and Rig Details

The character used for the shot is a high-fidelity digital human, with a musculoskeletal system and true-to-life face and body materials.

The musculoskeletal system was created by combining MRI scan data, a 3D skeleton scan, and hand-authored muscles. For the face and body materials, 3D face and body scans were used, along with a reference shoot.

The sample contains a Control Rig that you can use to further explore how ML deformation interacts with different character poses. The rig is located in the `Content/Characters/Emil/Rig` folder, and the Asset file is named `CR_Emil`. Unlike a MetaHuman rig, the rig used in this sample is asymmetrical (that is, joint positions are not mirrored perfectly). This achieves the most realistic deformation possible.

## Further Information

The 2023 State of Unreal GDC presentation included an in-depth segment of how the results in this technical demo were achieved. You can learn about the whole process, from scanning the character, to training the ML model, then combining different software and technologies to achieve the final result. Watch the full segment on YouTube at this link.

To learn more about the ML Deformer plugin, see the ML Deformer (-> how-to-use-the-machine-learning-deformer-in-unreal-engine) page.

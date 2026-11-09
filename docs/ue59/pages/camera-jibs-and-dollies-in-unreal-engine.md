# Camera Rigs

https://dev.epicgames.com/documentation/en-us/unreal-engine/camera-jibs-and-dollies-in-unreal-engine?application_version=5.9

> Film with real-world techniques in Unreal Engine by using Camera Rigs.

[image: Camera Rigs]

One of the methods real-world filmmakers use to produce smooth, sweeping shots, is by utilizing **Camera Rigs**, which are apparatuses that the camera attaches to. In Unreal Engine, you can use **Rail **and **Crane **rigs to create realistic camera movements.

#### Prerequisites

- You have an understanding of the **Cine Camera Actor (-> cinematic-cameras-in-unreal-engine)**, and have already added one into your Level.

- You know how to **Create Camera Animation (-> how-to-animate-cinematic-cameras-in-unreal-engine)** within **Sequencer (-> how-to-make-movies-in-unreal-engine)**.

## Camera Rig Rail

The Camera Rig Rail is used to emulate a **Camera Dolly** system, which is used to create **Tracking Shots**. The rail's track length and curvature can be modified to suit the needs of your shot.

 [image: camera rig rail]

### Creation

To add a rail rig to your Level, navigate to the **Cinematic **tab in the **Place Actors (-> placing-actors-in-unreal-engine)** panel and locate **Camera Rig Rail**. Drag it from the panel and into your viewport.

 [image: create camera rig rail]

Next, move the camera to your chosen position, relative to the dolly, and attach it to the rail by dragging the camera Actor onto the rig rail in the **World Outliner (-> outliner-in-unreal-engine)**.

 [image: attach camera rig rail]

After a camera is attached to the dolly, it can still be moved to fine-tune its final position.

### Track Length and Shape

The Camera Rig Rail uses Unreal Engine's **Blueprint Splines (-> blueprint-splines-in-unreal-engine)** for determining its track's length and shape. By default, the rail uses linear spline points at the start and end of the track. These points can be selected and moved to adjust the length and direction of the track.

 [image: camera rig rail length]

Selecting and moving the spline tangent points will add curvature to the track based on the tangent angle.

 [image: camera rig rail curve]

Additional points can be added to the track's spline to fine-tune the track's shape. Select the rig rail, right-click the spline, and select **Add Spline Point Here** to add a new point at your cursor's position.

 [image: camera rail spline point]

### Rail Controls

When selecting the **Camera Rig Rail Actor**, it displays the following properties for controlling its behavior and movement.

 [image: rail details]

| Name | Description |
| --- | --- |
| **Current Position on Rail** | This property controls the dolly movement along the track. The value range is clamped between **0** and **1**, where **0** is the **start point** of the track, and **1** is the **end point**. [image: current position on rail] |
| **Lock Orientation to Rail** | By default, the camera's orientation is set independently from the orientation of the dolly. Enabling **Lock Orientation to Rail** will cause the camera's rotation to be set relative to the dolly's rotation. [image: lock orientation to rail] |
| **Show Rail Visualization** | Disabling **Show Rail Visualization** will hide the dolly and track mesh, leaving only the spline visible. [image: show rail visualization] |
| **Preview Mesh Scale** | This property changes the size of the track and dolly preview geometry. [image: preview mesh scale] |

## Camera Rig Crane

The **Camera Rig Crane Actor** is used to emulate a boom arm or **Camera Jib** system, which is used to create **Crane Shots**. The crane can be pivoted along horizontal and vertical axes, and can be extended as needed.

 [image: camera rig crane]

### Creation

To add a crane rig to your Level, navigate to the **Cinematic **tab in the **Place Actors (-> placing-actors-in-unreal-engine)** panel and locate **Camera Rig Crane**. Drag it from the panel and into your viewport.

 [image: create camera rig crane]

Next, move the camera to your chosen position, relative to the crane anchor, and attach it by dragging the camera onto the rig crane in the **World Outliner (-> outliner-in-unreal-engine)**.

 [image: attach camera crane]

### Crane Controls

When selecting the **Camera Rig Crane Actor**, it displays the following properties for controlling its behavior and movement.

 [image: camera rig crane details]

| Name | Description |
| --- | --- |
| **Crane Pitch** | Controls the pitch movement of the crane mechanism. [image: crane pitch] |
| **Crane Yaw** | Controls the yaw movement of the crane mechanism. [image: crane yaw] |
| **Crane Arm Length** | Controls the crane arm length in centimeters. This is a type-aware field, meaning that if you were to type in other units such as **2m** will automatically convert to **200cm**. [image: crane arm length] |
| **Lock Mount Pitch / Yaw** | By default, the camera's orientation is independent from the crane's pitch and yaw movement. Enabling either **Lock Mount Pitch** or **Lock Mount Yaw** will cause the camera's rotation to be set relative to the pitch or yaw rotation of the crane. [image: crane lock axis] |

## Camera Rigs In Sequencer

The primary way you will be manipulating Camera Rigs will be by animating them in **Sequencer**. Both the Camera Rig Rail and Camera Rig Crane Actor tracks can be **added to your sequence**

 [image: add camera rig sequencer]

You will also need to add the attached camera Actors as tracks in Sequencer in order to animate them in conjunction with the movement of your rigs.

 [image: add camera rig sequencer]

### Rail

Camera Rail Rig property tracks can be added to Sequencer by clicking the **+ Track** button on the track and selecting from the **Properties **category.

 [image: camera rail tracks]

Once the tracks have been added, you can **set keyframes (-> creating-animation-keyframes-in-unreal-engine)** on the rail and camera property tracks to create your tracking shot.

 [image: camera rig rail example]

### Crane

Camera Crane Rig property tracks can be added by clicking the **+ Track** button on the track and selecting from the **Properties **category.

 [image: camera crane tracks]

Once the tracks have been added, you can **set keyframes (-> creating-animation-keyframes-in-unreal-engine)** on the crane and camera property tracks to create your crane shot.

 [image: camera rig crane example]

### Combining Crane and Rail

You can also attach a rail to a crane, using the same camera attachment steps detailed above, to create a camera **dolly and crane** system. Crane and rail properties can be animated together to allow for more freedom and realism in your shot creation.

 [image: crane and rail example]

- sequencer
- camera

On this page

- Prerequisites (-> camera-jibs-and-dollies-in-unreal-engine)
- Camera Rig Rail (-> camera-jibs-and-dollies-in-unreal-engine)
- Creation (-> camera-jibs-and-dollies-in-unreal-engine)
- Track Length and Shape (-> camera-jibs-and-dollies-in-unreal-engine)
- Rail Controls (-> camera-jibs-and-dollies-in-unreal-engine)
- Camera Rig Crane (-> camera-jibs-and-dollies-in-unreal-engine)
- Creation (-> camera-jibs-and-dollies-in-unreal-engine)
- Crane Controls (-> camera-jibs-and-dollies-in-unreal-engine)
- Camera Rigs In Sequencer (-> camera-jibs-and-dollies-in-unreal-engine)
- Rail (-> camera-jibs-and-dollies-in-unreal-engine)
- Crane (-> camera-jibs-and-dollies-in-unreal-engine)
- Combining Crane and Rail (-> camera-jibs-and-dollies-in-unreal-engine)

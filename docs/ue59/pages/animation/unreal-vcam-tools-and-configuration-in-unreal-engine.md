# Unreal VCam Tools and Configuration

https://dev.epicgames.com/documentation/en-us/unreal-engine/unreal-vcam-tools-and-configuration-in-unreal-engine?application_version=5.9

> Tools and configuration options for the Unreal VCam app.

[image: Unreal VCam Tools and Configuration]

The **Tools** menu includes configurable settings and toggles that let you adjust how you interact with the Live Link-enabled device and the virtual camera in the Unreal Engine scene.

To open the Tools menu, tap the **Wrench** icon on the right side of the screen.

The **Tools **menu includes the following settings:

| Icon | Dial Name / Action | Description |
| --- | --- | --- |
| [image: Takes Browser icon] | Takes Browser (-> unreal-vcam-tools-and-configuration-in-unreal-engine) | Opens the Virtual Camera’s Takes Browser, where you can search for and open level sequences for review or recording. |
| [image: Scale and Gain icon] | Scale and Gain Settings (-> unreal-vcam-tools-and-configuration-in-unreal-engine) | Contains settings to configure how movement of the Live Link-enabled device works with the Unreal Engine scene. This includes how sensitive the movement of the device is in a physical space and the sensitivity of the joystick movement. |
| [image: Hold icon] | **Hold** | Toggles whether the virtual camera's location and rotation is frozen. This is useful for repositioning your physical live link-enabled devices without losing your virtual camera's position in the scene. |
| [image: Zero to Stage icon] | **Zero To Stage ** | Removes any offsets to the virtual camera’s tracked location. This puts the camera back into tracking space. |
| [image: Zero to Parent icon] | **Zero to Parent** | Snaps the virtual camera onto its parent with an effective relative location of (0,0,0). If the virtual camera has no parent, this snaps to the world origin. |
| [image: Local Space Flight Mode icon] | **Local Space Flight Mode** | When enabled, this makes the forward joystick movement follow the forward direction of the camera instead of the world. When in Local Space Flight Mode, looking up or down moves the camera in that direction when you push a joystick forward. When disabled, the camera can freely look around the scene but move forward without moving in the direction the camera is pointed. |
| [image: Kill Roll icon] | **Kill Roll** | Toggles whether the virtual camera rotation along the X-axis is disabled, keeping the camera level when moving around while the Live Link-connected device is moving in a physical space. |
| [image: Spline Mode icon] | Spline Mode (-> unreal-vcam-tools-and-configuration-in-unreal-engine) | When enabled, you can create and edit your own Rig Rails from the Unreal VCam app. |
| [image: Tile Offset icon] | **Tile Offset** | Applies an arbitrary offset to the Tilt of the virtual camera. This makes holding shot angles more comfortable. When enabled, the Tilt HUD value will display a + symbol.[image: Tile offset enabled HUD display] |
| [image: Bookmark Browser icon] | **Bookmark Browser** | Opens the Virtual Camera Bookmark Browser. |
| [image: Multi User Replication] | **Multi User Replication** | Sets the current client as the author of the Virtual Camera in Multi User. Changes made from this client propagate to others, while changes from others are overridden from this client. |
| [image: The GameView icon] | **GameView** | When enabled, the GameView displays the scene as if it would appear in the game. |

### Virtual Camera Movement with Scale and Gain Settings

Movement in the Live Link-enabled device is registered by tracking positional data from the device and through the use of touch-screen joysticks, including tilt, pan, and roll movement. The touch-screen joysticks layer directional and rotational movement on top of the ARKit motion.

Virtual camera movement from a Live-Link-enabled device is controlled by:

- ARKit tracked axial and locomotor movement.
- Touch-screen Joysticks
- The **Left **joystick controls directional forward, backward, diagonal, and side-to-side movement.
- The **Right **joystick includes two separate movement controls:
- **Rotational **movement by dragging left and right on the screen.
- **Vertical **movement by dragging up and down on the screen.

You can adjust the sensitivity of each type of movement so that small movements can have a bigger effect, or the opposite where bigger movements have smaller impact. You can find these controls under the **Scale and Gain** settings menu on the right side of the screen.

[image: image alt text]

The menu includes the following settings:

| Dial Name / Action | Description |
| --- | --- |
| Left Dials |  |
| **Axis** | Sets the axis constraint for movement:**All** allows movement along all axes.**Planar** allows only movement along the X-axis and Y-axis to be scaled. Vertical movement is unaffected.**Vertical** allows movement along the Z-axis to be scaled. Planar movement along the X-axis and Y-axis is unaffected. |
| **Scale** | Scales the ARKit tracked movement of the device in physical space. The scale adjusts how movements are translated from real-world physical space to the virtual camera digital space through Live ink. Small scale values translate as larger physical space movement to smaller digital space movement. Larger scale values translate as smaller physical space movement to larger digital space movement. |
| Right Dials |  |
| **Joystick Movement Gain** | Controls the speed of both the left directional joystick and the right vertical-only joystick movement. |
| **Joystick Rotation Gain** | Controls the speed of rotation when engaging the right joystick in left or right rotational movement. |

Setting any dial to **Locked** or **0** restricts movement being tracked through Live Link or any engagements of the joystick. For example, setting the Axis to Vertical with a Scale set to Locked means that vertical movement cannot happen. Another example is setting the Joystick Rotation Gain to 0 restricts any rotation applied through the joystick.

## Browsing for Sequences and Reviewing Takes

### Takes Browser

Tapping the **Takes Browser** button in the tools menu opens the Takes Browser. The Takes Browser displays a sorted list of level sequences that can be opened for review or recording.

[image: The Takes Browser]

Tapping on a level sequence brings up two options

| Icon | Description |
| --- | --- |
| [image: Takes Reload icon] | Tap this to load the selected sequence into the Take Recorder, making it the base for the next recording. Use this option to select the animation that you want to record cameras onto. |
| [image: Takes Review icon] | Tap this to open a sequence into review. This pilots the camera cuts track of the sequence and provides simplified controls for reviewing the sequence. |

Holding on a level sequence shows the asset path. It also shows the dirty state when the level sequence is modified

[image: Take overlay showing asset path]

#### Tagging Takes

Swiping left or right on a sequence in the Takes Browser tags that sequence with the selected metadata, which can be used to filter the sequences in the Takes Browser.

| Option | Description |
| --- | --- |
| [image: Star tag] | Swiping to the right illuminates one, two, or three stars, depending on how far you swipe. Stopping at a number of illuminated stars tags the take with that number of stars. |
| [image: Flag take] | Swiping to the left reveals a yellow flag. Tapping this tags the take as flagged. Use this flag to denote any information relevant to your workflow. |
| [image: Take no good] | Swiping to the left reveals a red thumbs down. Tapping this marks the take as "no good" and filters it out of the Takes Browser. After tapping, you are presented with a short undo prompt. Tapping this before the time has elapsed removes the No Good tag and returns the take to the browser.This does not delete the level sequence, only hides it from the Takes Browser list by default. |

#### Filtering and Ordering the Takes Browser

The top of the Takes Browser contains a search bar and filters dropdown. Typing into this search bar filters the list by takes containing the matching string.

[image: Filter takes]

Tapping the filters dropdown reveals or hides the Takes Browser filters and sorting options.

[image: Take Sorting options]

The available filters are:

| Icon | Description |
| --- | --- |
| [image: Show Only Take icon] | Tap this to toggle showing only sequences recorded from Take Recorder and hide Non-recorded sequences. |
| [image: Show Flagged icon] | Tap this to toggle showing only sequences marked with the flag tag. |
| [image: Show No Good icon] | Tap this to toggle only sequences marked as "no good". Use this if a sequence needs to be recovered or was marked no good in error. |
| [image: Show Starred icon] | Tap this to cycle between showing only sequences tagged with a number of stars greater than the number shown. For example, tapping until the star displays the number 2 shows only sequences with 2 or 3 stars. |
| [image: Sort Takes by Time icon] | Tap this to cycle between sorting the Takes Browser newest to oldest or oldest to newest. There is no sub sorting, so the list can only be sorted by creation date or alphabetically. |
| [image: Sort Takes Alphabetical icon] | Tap this to cycle between sorting the Takes Browser in alphabetical or reverse alphabetical order. There is no sub sorting, so the list can only be sorted by creation date or alphabetically. |

### Take Viewer

You can use the Take Viewer to navigate between individual takes, so you can tag and smooth them.

The Take Viewer window opens when you load a take from the Takes Browser. Alternatively, you can tap the Take thumbnail in the lower left corner in the HUD to open the latest Take.

[image: Take Viewer]

#### Tagging Takes

On the current Take, you can add stars, a flag tag, or mark the take as "no good.

[image: Take tagging options]

#### Smoothing Takes

When viewing a take, you can tap the button in the top right corner to show a slider to smooth the camera keyframes in the level sequence

[image: Slider for Take smoothing]

#### Navigating Takes With Carousel View

To open the carousel view, tap the Take thumbnail in the lower left corner. The carousel view lists all takes in chronological order.

[image: Take Viewer carousel]

In the carousel view, you can do the following:

- Swipe the thumbnails to navigate the takes. The thumbnail in the center becomes the current item, which is indicated by the white highlight on top and the thumbnail being bigger in the preview window.
- Tap the preview window to open the level sequence for review. The blue highlight on the top indicates the current level sequence in review.
- Tap the down arrow in the lower button to close the carousel view.
- Tap the **** buttons next to the carousel to navigate the takes one by one.

#### Open Takes Browser

You can tap the magnifier icon on the lower right corner to open Takes Browser for more search and filtering options. For more information about the Takes Browser, see the Takes Browser section under Browsing for Sequences and Reviewing Tasks further up on this page.

[image: Open Takes Browser icon]

## Teleporting

Pressing down on the screen with 2 fingers and dragging enables teleportation of the VCam for faster movement around the scene. While 2 fingers are held down, a blue landing zone indicator is displayed where you are touching. Moving your fingers causes the landing zone to follow your fingers. Upon releasing your fingers, the Virtual Camera teleports to the location indicated by the landing zone.

Teleportation can only detect surfaces with collision.

### Sequencer and Bookmarks Settings

The bottom-most section of the Virtual Camera actor includes quick reference to camera settings, and Sequencer playback. The top-most section contains camera bookmarks and recording.

[image: Virtual Camera actor top]

[image: Virtual Camera actor bottom]

| Icon | Dial Name / Action | Description |
| --- | --- | --- |
| Section 1 |  |  |
| [image: Create Bookmark icon] | **Create Bookmark** | Tap this to create a bookmark of the current position and rotation and camera settings used by the virtual camera. If you have Photo Save Mode enabled, an icon image of a DSLR Camera appears instead. |
| [image: Re-inherit Camera Settings icon] | **Re-inherit Camera Settings** | Bookmarks store camera parameters (including aperture and focal length). This controls whether those stored camera parameters are loaded when jumping to a bookmark. |
| [image: Bookmark Navigation icon] | **Bookmark Navigation** | Navigational controls to cycle forward and backwards through any virtual camera bookmarks in the scene. |
| [image: Remove Bookmark icon] | **Remove Bookmark** | Tap this to remove the currently selected bookmark from the Unreal VCam app. This button removes the bookmark scene actor from your Unreal Engine project. |
| [image: The Current/Select Bookmark button] | **Current/Select Bookmark** | Displays the most recently loaded bookmark. Tapping this brings up the Bookmark Browser. |
| Section 2 |  |  |
| [image: Scale icon] | **Scale** | Displays the current scales applied to device movement. For more information, see Virtual Camera Movement with Scale and Gain Settings (-> controlling-a-virtual-camera-actor-using-live-link-in-unreal-engine). |
| [image: Stabilization icon] | **Stabilization** | Displays the amount of stabilization applied to the virtual camera's rotation and location movement. Higher values give more stabilization to movement at the cost of responsiveness creating smoother camera movement. Lower values give less stabilization and are more responsive, which creates rougher camera movement. For more information, see Virtual Camera Stabilization (-> controlling-a-virtual-camera-actor-using-live-link-in-unreal-engine). |
| [image: Orientation icon] | **Tilt, Pan, Roll Orientation** | Displays the virtual camera's rotational position. For more information, see Virtual Camera Movement with Scale and Gain Settings (-> controlling-a-virtual-camera-actor-using-live-link-in-unreal-engine). |
| Section 3 |  |  |
| [image: Timeline icon] | **Timeline** | Displays the timeline for the currently loaded Sequence in the Unreal Editor. To move the slider to a different frame within the Sequence, drag your finger along the timeline. |
| [image: Sequencer Playback Controls icon] | **Sequencer Playback Controls** | The playback controls function similarly to standard media playback applications with play, skip frame, skip to beginning and end frames, and so on. For more information, see Sequencer Cinematic Editor. |
| [image: Playback TimeScale icon] | **Playback TimeScale** | Use this to the time scale of the sequencer. For example, setting a value of 0.5x causes the sequence to playback at half speed. |
| [image: Slate icon] | **Slate** | Displays the slate name to be used for the next recording. This can be tapped to bring up the on screen keyboard, allowing the slate name to be edited |
| [image: Take number icon] | **Take** | Displays the take number of the next recording. This can be tapped to bring up the on screen keyboard, allowing the take number to be edited. |
| [image: Sequencer Frame Counter icon] | **Sequencer Frame Counter** | Displays the current frame number the timeline is reading. |
| [image: Take Recorder icon] | **Take Recorder** | Tap this to open Take Recorder and start recording of gameplay, live performance, and other sources directly into Unreal Engine. For more details, see Take Recorder (-> take-recorder-in-unreal-engine) and Using Take Recorder (-> record-gameplay-in-unreal-engine). |
| [image: Recording Time Scale icon] | **Recording Time Scale** | Use this to set the current time scale for the recording. For example, recording at 0.5x plays the pending take back at half speed. When reviewed, your camera move is sped up 2x to match the original speed of the sequence. |
| [image: Open Last Take icon] | **Open Last Take** | Tap the thumbnail to open the last recorded take in Take Viewer. |

### Virtual Camera Stabilization

Tap on the **Stabilization** text to open the virtual camera stabilization dials. These dials affect how much the camera prevents or compensates for unwanted camera movement. Camera movement appears smoother and less responsive when using higher stabilization values. Lower values tend to be more responsive, causing a lot of shake and instability in camera movement.

The **Left** dial controls **Rotation Stabilization**, and the **Right** dial controls **Location Stabilization**. In the video below, you can see the difference between using a value of 0x, 50x (default), and 100x.

## Parenting and Platforming

When not in Spline Mode, the top right of the virtual camera displays the parenting and platforming control.

[image: Parenting and Platforming controls]

### Creating an Attach Mount

Though the virtual camera can be attached to anything from the desktop, the available options to the handheld operator are limited to Cine Camera RigRails, Cine Camera Actors, and Cine Camera Attach Mounts. Using the Cine Camera Attach Mount gives you more control over how the virtual camera attaches to its parent, including enabling and disabling certain axes as well as introducing lag in following the parent for a more natural follow behavior.

To create an Attach Mount click the place actors menu and search for "attach." Drag and drop the **Cine Camera Attach Mount** into the world.

[image: Create an Attach Mount]

To configure the parent for the attach mount, select it in the world outliner and in the **Details **panel**,** set the **Target Actor** to the desired actor. If the Target Actor is skeletal, specify the **Target Socket **to enable attachment to a specific bone or socket.

[image: Configure an Attach Mount]

Name the Attach Mount to something indicative of its parent for later.

### Selecting and Attaching to a Parent

Tapping the central dropdown brings up a list of available parents. Though the virtual camera can be attached to anything in your scene, the available options to the handheld operator are limited to Cine Camera Rig Rails, Cine Camera Actors, and Cine Camera Attach Mounts. Selecting an option from this drop-down automatically snaps the virtual camera to its new parent and enables attachment. Attachment can be toggled on and off using the **paperclip** button.

[image: Select and attach a camera to a parent]

### Inheriting Specific Axes and Camera Parameters

By default, the virtual camera inherits all axes from its parent, though it can still move on top of this platform. Selecting the right most axis button, however, expands a list of axis and camera parameters that can optionally be disabled, inherited (the virtual camera inherits its parent’s axis value but can still offset on top), or locked (the virtual camera inherits its parent’s axis value but can’t offset on top). These options are only available if the parent is CineCamera Rig Rail, Cine Camera Actor, or Cine Camera Attach Mount.

The available options are:

| Icon | Dial Name / Action | Description |
| --- | --- | --- |
| [image: Dolly icon] | **Dolly** | Tap this to cycle between inheriting, locking, or ignoring the forward and backward movement of its parent. |
| [image: Truck icon] | **Truck** | Tap this to cycle between inheriting, locking, or ignoring the side to side movement of its parent. |
| [image: Crane icon] | **Crane** | Tap this to cycle between inheriting, locking, or ignoring the up and down movement of its parent. |
| [image: Roll icon] | **Roll** | Tap this to cycle between inheriting, locking, or ignoring the roll rotation of its parent. |
| [image: Tilt icon] | **Tilt** | Tap this to cycle between inheriting, locking, or ignoring the tilt rotation of its parent. |
| [image: Pan icon] | **Pan** | Tap this to cycle between inheriting, locking, or ignoring the pan rotation of its parent. |
| [image: Iris icon] | **Iris** | Tap this to cycle between inheriting, locking, or ignoring the iris camera parameter of its parent. Camera parameters can only be inherited from Cine Camera Rig Rails and Cine Camera Actor parents. |
| [image: Focal Length icon] | **Focal Length** | Tap this to cycle between inheriting, locking, or ignoring the focal length camera parameter of its parent. Camera parameters can only be inherited from Cine Camera Rig Rails and Cine Camera Actor parents. |
| [image: Focus Distance icon] | **Focus Distance** | Tap this to cycle between inheriting, locking, or ignoring the focus distance camera parameter of its parent. Camera parameters can only be inherited from Cine Camera Rig Rails and Cine Camera Actor parents. |

### Introducing Lag to the Attachment

If attached to a CineCameraAttachMount, the virtual camera has the additional ability to enable and disable lag into the follow. This allows for more natural feeling movement when following things like cars, where a physical camera would not immediately follow a movement. To toggle lag on and off, tap the lag button in the attach menu.

[image: Toggle Lag]

The speed of this lag can be controlled from the Details panel of the CineCameraAttachMount. Lower Values for Location/Rotation Lag Speed lead to a larger delay in response, while higher values lead to a faster response.

[image: Set lag in the Details panel]

## Creating and Operating Custom Rig Rails

Press the Spline icon in the tools menu to enter Spline Mode. In this mode, the attachment controls in the upper-right change to spline controls. The bottom-left now also includes keyframing controls.

Dolly splines for Virtual Camera are represented by CineCameraRigRail actors. The CineCameraRigRail allows for the creation of spline points which store both transform and camera parameters (Focus, Iris, and Zoom), which can be inherited back to and operated upon by the virtual camera.

[image: Creating a Spline point]

### Creating a New CineCameraRigRail

To create a new CineCameraRigRail, ensure the controls are set to the spline selection controls, represented by a spline icon.

[image: Select the Spline controls]

This mode offers the following controls:

| Icon | Dial Name / Action | Description |
| --- | --- | --- |
| [image: Spline Mode Select icon] | Mode | Tapping an option in this segmented control switches the current operating mode between **RigRail** selection mode, **Edit** mode, and **Drive** mode.In **RigRail** selection mode, the blue spline icon is highlighted. |
| [image: Active RigRail icon] | Active RigRail | This dropdown indicates the currently selected RigRail. This is the RigRail that is acted upon by all other editing, attachments, and driving tools. To change the current selection, expand the drop-down and select a new RigRail. |
| [image: New RigRail icon] | New RigRail | Tapping this creates a new RigRail, and sets it to the current selection. |
| [image: Delete RigRail icon] | Delete RigRail | Pressing this deletes the currently selected RigRail. To confirm deletion, hold the button until the red time indicator has completed a full circle. Releasing anytime before this cancels the action.This is a destructive action that fully deletes the CineCameraRigRail from the scene. |
| [image: Attach icon] | Attach | Toggling this attaches/detaches the virtual camera from the currently selected RigRail. |
| [image: Attach Axes icon] | Attach Axes | This dropdown offers controls for axis inheritance from the RigRail to the Virtual Camera. |

Tapping the New Rig Rail button creates a new CineCameraRigRail with its first point set with the current transform and camera parameters of the virtual camera. The Controls immediately switch to Editing Mode.

### Editing a CineCameraRigRail

Switching the mode segmented control to the pencil icon switches the controls to Edit Mode. This mode is used to add, remove, and modify points on the currently selected RigRail.

[image: Select Edit mode]

This mode offers the following controls:

| Icon | Dial Name / Action | Description |
| --- | --- | --- |
| [image: Edit Mode Select icon] | Mode | Tapping an option in this segmented control switches the current operating mode between **RigRail** selection mode, **Edit** mode, and **Drive** mode.In **Edit** mode, the blue pencil icon is highlighted. |
| [image: Current Point icon] | Current Point | This stepper displays the current position of the mount along the spline and the current point of editing. Tapping the forward and backward arrow jumps to the next or previous point, respectively. Interacting with the stepper in any way brings up a slider, which can be used to scrub along the RigRail. |
| [image: Delete Current Point icon] | Delete Current Point | Pressing this deletes the currently selected Point. To confirm deletion, hold the button until the red time indicator has completed a full circle. Releasing anytime before this cancels the action. If the icon is grayed out, the current value of the stepper is between points.This is a destructive action that fully deletes the point. |
| [image: Add Point icon] | Add Point | Pressing this adds a new point to the RigRail with the current transform and camera parameters of the virtual camera. The position along spline value ascribed to this point is contextual to your current position value:If the current value n of the stepper is at the end of the RigRail, the value is n+1.If the current value n is at a point and not at the end, the value is between the current value and the next point. For example, if you press this on point 1 when there is a point 2, this creates a point with position 1.5.If the current value n is not at a point, the position value is n. |
| [image: The Update Point icon] | Update Point | Updates the currently selected point using the current transform and camera parameters of the virtual camera. |
| [image: Attach icon] | Attach | Toggling this attaches/detaches the virtual camera from the currently selected RigRail. |
| [image: Attach Axes icon] | Attach Axes | This dropdown offers controls for axis inheritance from the RigRail to the Virtual Camera. |

To create a RigRail, move the virtual camera to a position and add a point to the RigRail at that transform and with those camera parameters. Repeat this process for every point along the rail.

After completing the RigRail, tap the car icon to enter Drive mode.

### Riding and Driving a CineCamera RigRail

Switching the mode segmented control to the pencil icon switches the controls to Edit Mode. This mode is used to drive the RigRail mount movement and differs from the other two modes in that it uses the dials in addition to the spline controls.

[image: Creating a Custom RigRail]

Drive Mode offers 3 drive modes for controlling the RigRail, selected by the right dial:

- **Manual: **Manual mode** **is used to drive RigRail by hand. When in this mode, drag the left dial to scrub the position along the rail. Manual mode should also be used if the position is being driven by hardware input or by sequencer.
- **Duration: **Duration mode** **drives the RigRail automatically to complete the full path within the set amount of time. When in this mode, a second right dial appears. Use this dial to set the desired amount of time for the completion of one full path.
- **Speed: **Speed mode** **drives the RigRail automatically to move at a set speed. When in this mode, a second right dial appears. Use this dial to set the desired speed (measured in cm/s). To speed up or slow down the RigRail, turn this dial while in motion.

Regardless of the mode selected, you can use the RigRail controls in the top-right to manage the attachment and to offer transport controls for the two automatic drive modes.

The available options are:

| Icon | Dial Name / Action | Description |
| --- | --- | --- |
| [image: Drive Mode Select icon] | Mode | Tapping an option in this segmented control switches the current operating mode between **RigRail** selection mode, **Edit **mode, and **Drive **mode.In **Drive** mode, the blue car icon is highlighted. |
| [image: Back to Start icon] | Back to Start | Tap this to reset the current position along the RigRail back to the first point. |
| [image: Play and Reverse Play icon] | Play and Reverse Play | These controls are only available in speed and duration modes. To make the mount move forward along the RigRail, tap the forward arrow. To make the mount move backward along the RigRail, tap the back arrow. The speed of the movement is determined by your current drive mode and settings.While moving in either direction, the respective arrow changes to a pause icon. Tap this to pause the mount at its current position. |
| [image: Loop icon][image: The bouncing icon] | Loop | Tap this to cycle between looping, not looping, and bouncing the spline. When looping, the spine returns to its start upon completion and continues moving according to your drive mode. When bouncing, the spline plays forward to the end, reverses direction to play backward, and repeats. |
| [image: Attach icon] | Attach | Toggling this attaches/detaches the virtual camera from the currently selected RigRail. |
| [image: Attach Axes icon] | Attach Axes | This dropdown offers controls for axis inheritance from the RigRail to the Virtual Camera. |

### Using Cine Camera Rig Rails with Sequencer

When in Spline Mode, an additional set of controls in the bottom-left appears, which you can use for keyframing in Sequencer. You can add and remove keyframes for the Rig Rail mount manually or through autokey. Keyframing the Rig Rail mount position allows for specific positions along the Rig Rail to be tied to frames of the current sequence. Playing a level sequence with keyframes for a Rig Rail causes the mount to move according to the keyed positions. To prevent conflicting attempts to drive the rail, the Rig Rail should be either in Manual mode or should have speed/duration modes paused.

[image: Using RigRail with Sequencer]

The color of the timeline indicates the relative speed that the mount moves during that portion of the sequence. Red indicates the fastest segments, gradienting to green for the slowest segments. A blue color indicates that the mount is stationary

The available keyframing commands are:

| Icon | Dial Name / Action | Description |
| --- | --- | --- |
| [image: Autokey icon] | Autokey | Tap this to toggle autokey on and off.When autokey is enabled, any new points added to the Rig Rail keys the respective position of the mount into sequencer at the current frame. Removing a point along the rail removes its respective keyframe. |
| [image: Remove Keyframe icon] | Remove Keyframe | Tap this to remove the keyframe at the current playhead position. To confirm removal, hold the button until the red time indicator has completed a full circle. Releasing anytime before this cancels the action. If the icon is grayed out, the sequencer playhead is not on a Rig Rail keyframe. |
| [image: Add Keyframe icon] | Add Keyframe | Tap this to add a new keyframe to the open level sequence. This keyframe is placed at the playhead position and uses the current mount position as indicated on the drive mode dial or the Rig Rail controls. |

## Virtual Camera Bookmarks

To create a new **VPBookmark** actor in the scene, press the green **Bookmark** icon in the top-left of the screen on your Live Link-enabled device. This actor stores information about the virtual camera, including its position and rotation. The bookmark also stores any settings that have been adjusted for the camera, for example, the exposure and lens settings.

You can reload any placed bookmark by using the Bookmark navigation controls in the bottom-left of the screen using the forward and backwards arrows, or by tapping the bookmark drop down and choosing a bookmark from the list. Toggle the **Camera** icon to load the camera parameters stored with this bookmark, such as the aperture, filmback, and focus settings.

Use the **Minus **(-) icon to remove a currently referenced bookmark from the Live Link-enabled device. Because bookmarks exist as an actor in your Unreal Engine scene, you can also add and remove them manually from the Editor using the **Outliner** panel.

### Bookmark Browser

You can also use the Bookmark Browser to list and manage VPBookmark actors in the scene. You can launch Bookmark Browser from the bookmark icon in the right ear menu, or from the bookmark name in the bookmark selector in the top left side of the viewport.

[image: Bookmark ear menu icon]

[image: The bookmark selector in the viewport]

The VPBookmark Actors are listed in the tile view:

[image: The Bookmark Browser]

#### Loading a bookmark

To open a bookmark, tap the thumbnail for an entry to jump to the bookmark. Once you have opened a bookmark, you have several options.

#### Tagging bookmarks

| Icon | Description |
| --- | --- |
| [image: Bookmark swipe right options] | Swipe to the right to add stars. |
| [image: Bookmark swipe left options] | Swipe to the left to either add a flag tag, or delete the bookmark. |

#### Renaming bookmarks

To rename bookmarks, in the LiveLinkVCam app, tap and hold an entry to activate text input and type the new name.

#### Filtering and sorting bookmarks

The filtering and sorting options are displayed in the top part of the bookmark browser. Once you’ve expanded the Filter button, further options appear.

[image: Bookmark Browser filtering and sorting]

| Icon | Description |
| --- | --- |
| [image: Bookmark search filter] | Type in the search field to filter bookmarks with matching words or strings. |
| [image: Bookmark flag filter] | Tap the flag icon to list only bookmarks that are flagged. |
| [image: Bookmark star filter] | Tap the star icon to cycle between showing only bookmarks tagged with a number of stars greater than the number shown. For example, tapping until the star displays the number 2 shows only bookmarks with 2 or 3 stars. |
| [image: Bookmark time filter] | Tap this to cycle between sorting the bookmarks newest to oldest or oldest to newest. The list can only be sorted by creation date or alphabetically. |
| [image: Bookmark alphabetical filter] | Tap this to cycle between sorting the bookmarks in alphabetical or reverse alphabetical order. The list can only be sorted by creation date or alphabetically. |

#### Other Options

Tap the gear icon to open the settings menu for the bookmark, which opens the following options:

[image: Bookmark Browser settings]

| Icon | Description |
| --- | --- |
| [image: Bookmark store camera parameters] | Bookmarks store camera parameters, including aperture and focal length. You can use this setting to determine if those stored camera parameters should be restored when jumping to a bookmark. |
| [image: Bookmark refresh thumbnails] | Tap to refresh all thumbnails. |

### Controlling a Sequence

When a **Sequence** is open in the Unreal Editor, you can control the timeline and playback of it using the **Transport** buttons on your Live Link-connected device. You can use the playback controls for **Play**, **Pause**, and the **Scrub** marker on the timeline to observe the current Sequence's data.

### Using Take Recorder with Unreal VCam App

You can use **Take Recorder** to record your own Sequences (or shots) of the scene and characters in your Unreal Engine project. These can be played back within Unreal Editor using the Take Recorder and Sequencer for review.

To start recording a shot, tap the **Record** button in the top-right of the Unreal VCam app.

When you use Take Recorder with the Unreal VCam app, be aware of these things:

- The **Take Recorder** window automatically opens in Unreal Engine (if not already open) when a recording is started.
- When you start a recording, the current Level Sequence plays automatically.
- After recording a take, you can click **Review the last recording** button in the Take Recorder window to see the shot. This plays back the shot and hides the virtual camera HUD. Exiting review mode unhides the virtual camera HUD.
- All recorded takes are saved as **Sequencer Clips**. Saving the clip replaces the Virtual Camera actor with a Cine Camera actor (-> cinematic-cameras-in-unreal-engine), since virtual cameras are used to animate the camera and record its settings and movements.

When the Virtual Camera is active, it displays the current **Timecode**, **Slate**, and **Sequence Frame** in the HUD. This data is derived from the Take Recorder window, and displays the same information across the Unreal Editor and the Live Link-connected device.

For more information about using Take Recorder in a project, see:

- Take Recorder (-> take-recorder-in-unreal-engine)
- Using Take Recorder (-> record-gameplay-in-unreal-engine)
- Multi-User Take Recorder (-> multi-user-take-recorder-in-unreal-engine)

In previous releases, the VCam actor used a separate CineCameraActor for recording, rather than recording on the VCam actor itself. If you prefer the previous workflow with the record camera, you can enable **Use Legacy Record Camera Workflow** in the following modifiers, and re-activate VCam.

[image: The VCam actor]

## VCam Photos

When using VCam, you can create a photo any time you create a bookmark.

When this mode is enabled in the Project Settings, the bookmark icon is replaced with a DSLR camera icon.

 The bookmark icon

 The DSLR camera icon

In the **Project Settings**, under **Plugins** > **Virtual Camera**, you can set the **Photo Save Mode** to save a texture asset, a PNG, or both. You can also disable it to prevent creating any photos when you create a bookmark. In this same window, you can set the desired destination for the assets or leave the default values.

[image: The Photo Save Mode options]

You can change the size of the photos that get saved. In the **Details** panel for the VCam component, go to **Photo Modifier** > **Photo Settings**. Set **VcamPhoto Size Settings** to **1920**, **3840**, **Match Output**, or **Custom**. The saved Photos are cropped to match the VCam frame.

[image: The VCam Photo Size Settings options]

This setting indicates the highest dimension of the image. The other dimension is determined by the filmback currently being used. When you select **Custom**, you can set the **Custom Photo Size** to any value. Custom values over 4000 may take longer to process.

VCam photos are saved to the `Content/VCamPhotos` folder.

[image: The VCamPhotos folder]

- getting started
- virtual camera
- working with media

On this page

- Virtual Camera Movement with Scale and Gain Settings (-> unreal-vcam-tools-and-configuration-in-unreal-engine)
- Browsing for Sequences and Reviewing Takes (-> unreal-vcam-tools-and-configuration-in-unreal-engine)
- Takes Browser (-> unreal-vcam-tools-and-configuration-in-unreal-engine)
- Tagging Takes (-> unreal-vcam-tools-and-configuration-in-unreal-engine)
- Filtering and Ordering the Takes Browser (-> unreal-vcam-tools-and-configuration-in-unreal-engine)
- Take Viewer (-> unreal-vcam-tools-and-configuration-in-unreal-engine)
- Tagging Takes (-> unreal-vcam-tools-and-configuration-in-unreal-engine)
- Smoothing Takes (-> unreal-vcam-tools-and-configuration-in-unreal-engine)
- Navigating Takes With Carousel View (-> unreal-vcam-tools-and-configuration-in-unreal-engine)
- Open Takes Browser (-> unreal-vcam-tools-and-configuration-in-unreal-engine)
- Teleporting (-> unreal-vcam-tools-and-configuration-in-unreal-engine)
- Sequencer and Bookmarks Settings (-> unreal-vcam-tools-and-configuration-in-unreal-engine)
- Virtual Camera Stabilization (-> unreal-vcam-tools-and-configuration-in-unreal-engine)
- Parenting and Platforming (-> unreal-vcam-tools-and-configuration-in-unreal-engine)
- Creating an Attach Mount (-> unreal-vcam-tools-and-configuration-in-unreal-engine)
- Selecting and Attaching to a Parent (-> unreal-vcam-tools-and-configuration-in-unreal-engine)
- Inheriting Specific Axes and Camera Parameters (-> unreal-vcam-tools-and-configuration-in-unreal-engine)
- Introducing Lag to the Attachment (-> unreal-vcam-tools-and-configuration-in-unreal-engine)
- Creating and Operating Custom Rig Rails (-> unreal-vcam-tools-and-configuration-in-unreal-engine)
- Creating a New CineCameraRigRail (-> unreal-vcam-tools-and-configuration-in-unreal-engine)
- Editing a CineCameraRigRail (-> unreal-vcam-tools-and-configuration-in-unreal-engine)
- Riding and Driving a CineCamera RigRail (-> unreal-vcam-tools-and-configuration-in-unreal-engine)
- Using Cine Camera Rig Rails with Sequencer (-> unreal-vcam-tools-and-configuration-in-unreal-engine)
- Virtual Camera Bookmarks (-> unreal-vcam-tools-and-configuration-in-unreal-engine)
- Bookmark Browser (-> unreal-vcam-tools-and-configuration-in-unreal-engine)
- Loading a bookmark (-> unreal-vcam-tools-and-configuration-in-unreal-engine)
- Tagging bookmarks (-> unreal-vcam-tools-and-configuration-in-unreal-engine)
- Renaming bookmarks (-> unreal-vcam-tools-and-configuration-in-unreal-engine)
- Filtering and sorting bookmarks (-> unreal-vcam-tools-and-configuration-in-unreal-engine)
- Other Options (-> unreal-vcam-tools-and-configuration-in-unreal-engine)
- Controlling a Sequence (-> unreal-vcam-tools-and-configuration-in-unreal-engine)
- Using Take Recorder with Unreal VCam App (-> unreal-vcam-tools-and-configuration-in-unreal-engine)
- VCam Photos (-> unreal-vcam-tools-and-configuration-in-unreal-engine)

# Troubleshooting Mixed Reality Capture

https://dev.epicgames.com/documentation/en-us/unreal-engine/troubleshooting-mixed-reality-capture-in-unreal-engine?application_version=5.9

> Troubleshooting tips when working with Mixed Reality Capture.

[image: Troubleshooting Mixed Reality Capture]

Learn to use this **Beta** feature, but use caution when shipping with it.

This page provides troubleshooting information for Mixed Reality Capture (MRC).

## Flickering During Captures

Depending on the resolution of the MR capture target (the default is 1080p), your app may be constrained by its render target pool size. By default, render targets are set to reallocate as needed, which can lead to ping-ponging and flickering as the MR capture targets fight with the stereo render targets. (shown in the video below)

If you see this kind of behavior, you can change the render target resize rule to 'Grow' (in your engine.ini file, set r.SceneRenderTargetResizeMethod=2). Making this change should resolve the issue.

## Capture Not Displaying on Spectator Screen

The MRC framework uses the Virtual Reality Spectator Screen (-> virtual-reality-spectator-screen-in-unreal-engine) to display the composited scene. This means the Mixed Reality capture will only be displayed when running in Virtual Reality. If your project also uses the spectator screen, then you need to conditionally guard where you use them. There are MRC methods to help with this:

**Get Mixed Reality Capture Texture**

Returns the Capture Texture, or a nullptr if there isn't one.

**Is Mixed Reality Capture Broadcasting**

Returns true, if the system is sending the capture texture to the spectator screen.

**Set Mixed Reality Capture Broadcasting**

Toggles whether the capture system is sending the capture texture to the spectator screen or not.

**An Example of Using the MRC Methods**

Click image to expand.

## Controller/Trigger Not Responding During Calibration

If your controller input does not appear to respond during calibration, below are several possible causes.

- **The headset sensor in not covered.** If theheadset's sensor is not covered, the controllers may not be active.

- **The application window needs to have focus.** If theMRCalibration window is not the current active window, the controller actions may not be captured by the calibration program.

- **The Oculus system may not be configured to run from Unknown Sources.** As a part of Beta access, the calibration program is still in active development and has not been reviewed by Oculus.

- beta
- mr
- landingpage
- troubleshooting
- ar/vr/xr

On this page

- Flickering During Captures (-> troubleshooting-mixed-reality-capture-in-unreal-engine)
- Capture Not Displaying on Spectator Screen (-> troubleshooting-mixed-reality-capture-in-unreal-engine)
- Controller/Trigger Not Responding During Calibration (-> troubleshooting-mixed-reality-capture-in-unreal-engine)

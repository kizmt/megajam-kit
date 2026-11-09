# Unreal VCam Virtual Camera Settings

https://dev.epicgames.com/documentation/en-us/unreal-engine/unreal-vcam-virtual-camera-settings?application_version=5.9

> Settings and configuration information for the Unreal VCam app

[image: Unreal VCam Virtual Camera Settings]

The **Virtual Camera** settings are located on the left side of the Unreal VCam app. This menu includes options to control the different camera, lens, and exposure settings of the virtual camera in your scene.

[image: image alt text]

The menu includes the following settings:

| Icon | Dial Name / Action | Description |
| --- | --- | --- |
| [image: image alt text] | **Lens Settings** | Set virtual camera parameters including lens size, focus, iris, and more. |
| [image: image alt text] | **Focus Settings** | Set the virtual camera’s focus mode and focus distance. |
| [image: image alt text] | **Filmback Settings** | Configurable settings for the virtual camera's image sensor. |
| [image: image alt text] | **ISO and Exposure Compensation Settings** | Configurable settings for how the virtual camera's exposure is handled. |
| [image: image alt text] | **Near Clip Plane Settings** | Set the distance from the camera where polygons no longer render. |
| [image: image alt text] | **Mask / Overlay / Reticle Settings** | Set what type of aspect ratio mask, grid overlay, and reticle are used with the virtual camera. |

### Lens Settings

The **Lens** settings include virtual camera presets for lenses, focus, and iris settings.

[image: image alt text]

#### Lens Preset and Focal Length

When in **Lens Mode**, you can adjust between configurable presets for common focal lengths and iris. You can also set the iris and dial-in the focus distance manually.

[image: image alt text]

You can configure Lens presets in the **Project Settings** under **Cinematic Camera > Lens Presets**. Here, you can add your own, alter, or remove any existing presets.

| Dial Name / Action | Description |
| --- | --- |
| **Left Dials** |  |
| **Lens Preset** | Select from a list of presets for focal lengths and irises. Some presets include the Focal Length dial. Lens presets include:12mm Prime f/2.812mm Prime f/2.812mm Prime f/2.830mm Prime f/1.450mm Prime f/1.885mm Prime f/1.8105mm Prime f/2200mm Prime f/224-70mm Zoom f/2.870-200mm Zoom f/2.8Universal ZoomLens presets are set up in the Project Settings in the **Cinematic Camera** category. You can add new presets and edit existing ones. |
| **Focal Length** | Sets the length of the lens (in millimeters). Longer lengths lead to higher magnification with a narrower angle of view. Shorter lengths have lower magnification and a wider angle of view. (Only available on some Lens Presets.) |
| **Right Dials** |  |
| **Focus Distance** | Sets the distance (in meters) from the virtual camera lens where objects are in focus. |
| **Iris** | Controls the amount of light (in f-stops) by making the aperture wider (low f-stop) or narrower (high f-stop). |

#### Using Pinch to Zoom

Pinching in and out with two fingers on the center of the virtual camera screen zooms in and out within the range of your currently selected lens. If your lens is a prime that has a set focal length and cannot zoom, pinch to zoom does nothing.

### Focus Settings

The **Focus** settings contain options for configuring how the virtual camera focuses on objects.

[image: image alt text]

| Icon | Dial Name / Action | Description |
| --- | --- | --- |
| [image: image alt text] | **Focus Method** | Choose how you want the virtual camera to apply focus in the scene:**Do Not Override** removes the ability to change the focus distance dial in any menu and causes the **Post Process Volume** settings to persist**Manual** lets you manually adjust the focus using the **Focus Distance** dial to set the distance from the camera to the subject**Tracking** locks focus on specific actors in the shot**Disable** stops all depth of field from happening |
| [image: image alt text] | **Focus Distance** | Specifies the distance (in meters) from the virtual camera lens to the point where objects appear in focus. |
| [image: image alt text] | **Pick Actor to Track** | Use this to pick an actor in the scene to focus on. When in **Tracking** mode, the selected actor always remains in focus, and its distance from the camera drives the Focus Distance. When in **Manual** mode, the Manual Focus Distance is set to the distance to this target, but it does not track the selected actor ifthe camera or target moves. |
| [image: image alt text] | **Toggle Focus Peaking** | Toggles a visual reference in the scene where the focus distance is currently set. |

#### Using Tap to Focus

You can select a focus target by double tapping on that actor in the scene. A yellow focus indicator appears to confirm where you have tapped. Tap to focus is available even if you are not in **Focus Mode.**

The behavior of tap to focus differs based on your current mode:

- In **Manual Focus**, tapping an actor sets the manual focus distance to the distance to the tapped actor. This value does not update if the actor or camera moves.
- In **Tracking Focus**, tapping an actor sets the tracking focus target and lock focus distance to the tapped point on the selected actor or skeletal mesh socket. If the actor/socket or camera moves, focus adjusts to keep the point in focus.

Only actors with collision (or physics assets in the case of skeletal actors) can be detected with tap to focus.

[image: image alt text]

#### Using Tracking Focus

You can track an actor in the scene and maintain the virtual camera's focus on it by using the **Pick Actor to Track** option in the HUD or by using **Tap to Focus**.

To use Tracking Focus:

- In the **Lens settings** menu, navigate to the **Focus** settings. Here, **Focus Method** is selected by default with its adjustable dials present on screen.
- Drag the **left dial** to **Tracking**.

[image: image alt text]

While holding and looking at your device, double-tap on an actor in the scene. Alternatively, point the virtual camera **Reticle** at the object you want to keep focused on. Tap the **Pick Actor to Track** icon in the left menu. Once you've done this, look at the **Right** dial and you'll see the **Tracking Offset** along with the **Name** of the focused asset/skeletal mesh socket below.

[image: image alt text]

When using the Tracking focus method, use the right dial for **Tracking Focus Offset** to dial-in the focus on the subject. When tracking a Skeletal Mesh actor, the target point moves to the closest socket for focus, which may not always be the exact spot you're wanting to focus on.

Tracking focus is effective as long as the target actor remains within the camera view. When the target actor moves out of the view, the system automatically switches to **Manual**** **focus mode. By switching to Manual, the focus distance stays stable and is not influenced by objects that are no longer visible from the camera.

#### Using Focus Peaking

You can use the **Focus Peaking **toggle to see exactly where the focus distance is in the scene. A red outline represents the focal distance. **Focus Peaking **is useful for quickly seeing where the focus distance is in the scene to dial it in. The outlined area expands and contracts to show the **depth of field** based on your current **iris**. To dial in the focus, use the **Focus Distance** dial on the right side of the app.

### Filmback Settings

**Filmback** describes the dimensions of the frame for the digital imaging sensor. This size determines what the camera sees through its viewfinder. The filmback determines frame size, depth of field, resolution, and more.

[image: image alt text]

There standard presets are:

- 16:9 Film
- 16:9 Digital Film
- 16:9 DSLR
- Super 8mm
- Super 16mm
- Super 35mm
- 35mm Academy
- 35mm Full Aperture
- 35mm Vista Vision
- IMAX 70mm
- APS-C (Canon)
- Full Frame DSLR
- Micro Four Thirds

The examples below are using the **30mm Prime f/1.4** Lens Preset.

|  |  |  |  |
| --- | --- | --- | --- |
| [image: image alt text] | [image: image alt text] | [image: image alt text] | [image: image alt text] |

You can configure Filmback presets in the Project Settings under **Cinematic Camera > Filmback Presets**. Here, you can add your own, alter, or remove any existing presets.

### ISO, Iris, Shutter Speed and Exposure Compensation Settings

The **Exposure** settings control how bright or dark the image is.

[image: image alt text]

| Dial Name / Action | Description |  |
| --- | --- | --- |
| **Left Dials** |  |  |
| **ISO** | Sets the sensitivity of the camera's sensor. Lower numbers have a lower sensitivity to light, which makes the image darker. Higher numbers have a higher sensitivity to light, which makes the image brighter. When not set to **Auto Exposure**, the ISO is dependent on what f-stop the camera iris is set to. |  |
| **Iris** | Sets the diameter (measured in f-stops) of the aperture's opening. This controls the amount of light that is allowed to pass through the lens of the camera. It also has an effect on depth of field. For more information, see Cinematic Depth of Field (-> cinematic-depth-of-field-in-unreal-engine). |  |
| **Right Dials** |  |  |
| **Exposure Compensation** | Applies a compensation (measured in stops) to override exposure to brighten or darken the frame. Lower numbers give a higher exposure, which makes the result brighter. Higher numbers give a lower exposure, which makes the result darker. |  |
| **Shutter Speed** | Adjusts the camera’s "exposure time" (measured in fractions of a second). Slower shutter speeds result in a brighter image. Faster speeds result in a darker image. Unlike a physical camera, shutter speed on the Virtual Camera only affects exposure and not motion blur. |  |

#### Using Zebra Striping

Tapping the **Zebra striping** button from **Exposure Mode** or the top quick action buttons toggles zebra striping. When enabled Zebra Striping marks areas of the frame that are over-exposed.

[image: image alt text]

### Near Clip Plane

The **Near Clip Plane** sets the distance (measured in centimeters) from the camera that polygons no longer render. This option is useful when you want to not render objects blocking the view but also continue to render their shadows and interaction with the scene.

In the example below, the virtual camera is using a longer lens to capture the subject, but the view is partially obstructed by a plant. Using the near clip plane, Unreal doesn't render any geometry within the set distance from the camera.

### Mask, Overlay, and Reticle Settings

The **Mask / Overlay / Reticle** settings include optional visual guides for the virtual camera viewfinder. This includes grids, safe zones, different reticles, and mattes to mask off different aspect ratios.

[image: image alt text]

Each of the groups for overlays, reticles, and masks include their own **Opacity** dial. You can use this to set how opaque or transparent each is. At 0, they are not visible, at 0.5 they're partially transparent, and at 1.0 they're fully opaque.

|  |  |  |
| --- | --- | --- |
| [image: image alt text] | [image: image alt text] | [image: image alt text] |

#### Overlay Selections

Use the **Overlay** dial to choose the type of grid to overlay on the virtual camera viewfinder.

You can choose from the following options:

|  |  |  |  |
| --- | --- | --- | --- |
| [image: image alt text] | [image: image alt text] | [image: image alt text] | [image: image alt text] |

#### Reticle Selections

You can use the **Reticle** dial to choose the design for the center of the frame used to aim what the virtual camera is looking at.

You can choose from the following options:

|  |  |  |  |  |
| --- | --- | --- | --- | --- |
| [image: image alt text] | [image: image alt text] | [image: image alt text] | [image: image alt text] | [image: image alt text] |

#### Mask Selections

You can use the **Mask** dial to choose from the presets for different size aspect ratio mattes in the virtual camera viewfinder. The mask presets include common industry standards.

You can choose from:

- 9:16 (0.562)
- 1:1
- 4:3 (1.333)
- 3:2 (1.5)
- 16:9 (1.778)
- 1.85:1 (1.85)
- 2:1
- 2.39:1 (2.39)
- 2.4:1 (2.4)
- 2.76:1 (2.76)
- Custom

Below is an example of the mask presets overlaying the virtual camera viewfinder:

If none of the included presets fit your requirements, you can use the **Custom** option to define your own masked area. When selected, a new dial appears on the right side of the screen. Drag the dial to the left to make the mask smaller, drag the dial to the right to make the mask larger. The mask can fill the tops and bottoms of the frame or the sides of the frame.

[image: image alt text]

- getting started
- virtual camera
- working with media

On this page

- Lens Settings (-> unreal-vcam-virtual-camera-settings)
- Lens Preset and Focal Length (-> unreal-vcam-virtual-camera-settings)
- Using Pinch to Zoom (-> unreal-vcam-virtual-camera-settings)
- Focus Settings (-> unreal-vcam-virtual-camera-settings)
- Using Tap to Focus (-> unreal-vcam-virtual-camera-settings)
- Using Tracking Focus (-> unreal-vcam-virtual-camera-settings)
- Using Focus Peaking (-> unreal-vcam-virtual-camera-settings)
- Filmback Settings (-> unreal-vcam-virtual-camera-settings)
- ISO, Iris, Shutter Speed and Exposure Compensation Settings (-> unreal-vcam-virtual-camera-settings)
- Using Zebra Striping (-> unreal-vcam-virtual-camera-settings)
- Near Clip Plane (-> unreal-vcam-virtual-camera-settings)
- Mask, Overlay, and Reticle Settings (-> unreal-vcam-virtual-camera-settings)
- Overlay Selections (-> unreal-vcam-virtual-camera-settings)
- Reticle Selections (-> unreal-vcam-virtual-camera-settings)
- Mask Selections (-> unreal-vcam-virtual-camera-settings)

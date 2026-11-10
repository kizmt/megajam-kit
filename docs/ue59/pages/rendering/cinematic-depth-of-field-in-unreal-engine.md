# Cinematic Depth of Field

https://dev.epicgames.com/documentation/en-us/unreal-engine/cinematic-depth-of-field-in-unreal-engine?application_version=5.9

> Setting up and using depth of field on desktop and console platforms.

[image: Cinematic Depth of Field]

The following depth of field methods provides a cinematic look that closely resembles photography and film for desktop and console platforms using the Deferred Shading renderer and Clustered Forward renderer.

## Cinematic

**Cinematic** DOF closely matches real-world cameras, similarly to Circle and Bokeh DOF, you can see circular-shaped Bokeh (out-of-focus areas) with sharp High Dynamic Range (-> high-dynamic-range-display-output-in-unreal-engine) (HDR) content. This method uses a procedural Bokeh simulation that provides dynamic resolution stability and alpha channel support while being faster, scalable, and optimized for projects developing on desktops and consoles.

 [image: Depth of Field Disabled]

 [image: Cinematic Depth of Field]

### Focus on the Shot's Subject

The key to achieving an aesthetically pleasing depth of field effect is all in how the subject(s) of the shot is focused. There are three core factors that affect setting up Depth of Field for any given shot:

- Decide on the Lens **Focal Length** to use.

- Choose an appropriate **Aperture** (f-stop number).

- Choose a **Distance to your Subject(s)** from the camera.

Let's break down the elements that make up the camera and scene being captured to understand what's going on when we adjust these settings:

 [image: Camera Elements Diagram]

- Points in the Scene Red: Out of Focus

- Blue: Perfectly in Focus

- Green: Marginally in Focus

- Focus Distance to Shot's Subject (1. ii)

- Camera Lens

- Lens Diaphragm (measured in F-Stop)

- Lens Focal Length

- Filmback / Image Sensor

- Final Image Result

Take note that the rendered image on the right is inverted through the camera lens. Red is part of the background and more out of focus, and Green is part of the foreground and marginally out of focus.

Here we have the multiple points (1) representing objects captured by the camera to a defined **Focus Distance** (2), in this case, the blue subject. The **Aperture** (4) defines how blurred objects in the foreground and background will be that are not in focus, and, finally, the **Focal Length** (5) of the lens controls the field of view, or how zoomed in the image will be.

#### Aperture

The **Aperture** defines how sharp or blurred the foreground and background are based on the diameter of the **Diaphragm** which is controlled in f-stop.

 [image: Camera Elements Aperture Diagram]

- Camera Lens

- Lens Aperture Diaphragm measured in F-stop

This diagram demonstrates the **Diaphragm** (2) blocking light passing through the **Lens** (1). The size of the Aperture (or f-stop number) sets how much light passes through the Lens in turn controlling how much the foreground and background are blurred based on the Focus Distance of the shot.

Two elements make up the Aperture; the **F-stop** number and the **Diaphragm**.

 [image: Camera Aperture Parts]

- The **Aperture** is the diameter of the opening through which light passes. The Aperture is defined by Focal Length divided by an **F-stop** number.

- The **Diaphragm** is a mechanical structure made up of multiple blades used to block light. It opens and closes based on the supplied F-stop.

The lens Aperture is defined by the diameter of the Diaphragm which decreases as the F-stop number increases controlling how shallow or deep the depth of field effect is. See Focus Distance (-> cinematic-depth-of-field-in-unreal-engine) for a diagram showing this effect.

To demonstrate how the Aperture works, drag the slider to change the F-stop number between 1.4, 2.8, and 5.6. Smaller F-stop numbers create a shallower DOF with more background and foreground blur. Larger F-stops increase the depth of DOF with less blur.

Note that only the F-stop is being changed here, the Focus Distance and Focal Length remain constant at 7m and 75mm, respectively.

 [image: Camera Element Aperture]
 [image: Camera Element Aperture]
 [image: Camera Element Aperture]

Drag the slider to change the Aperture F-stop.

Normally when you would adjust the Aperture settings of a real camera, you'd have to also adjust the Exposure settings at the same time to maintain the same light intensity received by the filmback/image sensor. However, in Unreal Engine this is not a real camera, so adjusting the F-stop and Diaphragm does not control the light intensity.

#### Focal Length

The **Focal Length** is the distance from the center of the lens to the **Filmback** (or image sensor) measured in millimeters (mm).

 [image: Focal Length Diagram]

- Camera Lens

- Focal Length

To demonstrate how this works, drag the slider to change the Lens Focal Length to be between 50mm, 75mm, and 100mm. Notice how effectively it changes the shot's Field of View (FOV); as the focal length increases, the FOV decreases. You can think of the focal length as being similar to zooming in with a camera, except when doing so, the out-of-focus areas of the shot in the background and foreground are becoming more pronounced. In the example below, you can see this when changing between a focal length of 50mm and 100mm; the shot appears mostly in focus throughout the foreground but when using a 100mm focal length, it's easier to see that the background is more out of focus and the foreground has a minimal amount of blur too.

Note that the diagram and example here are only changing the lens Focal Length; the Focus Distance and F-stop remain constant at 7m and f/2.8, respectively.

 [image: Camera Elements Focal Length]
 [image: Camera Elements Focal Length]
 [image: Camera Elements Focal Length]

#### Focus Distance

The **Focus Distance** is the distance from the center of the camera lens to the subject of the shot that is put into focus, creating a focal plane. The closer the camera is to the subject, the more the background will end up out-of-focus.

 [image: Focus Distance Diagram]

- Focal Points in the Scene Red: Out of Focus

- Blue: Perfectly in Focus

- Green: Marginally in Focus

- Focus Distance to the Subject (1b)

- Camera Lens

This diagram demonstrates objects (1) that make up the scene; background, shot subject, and foreground. The distance from the Lens (3) to the focal subject (2) - in this case the blue dot - is the Focus Distance. Areas in the background and foreground are blurred depending on the F-stop used and the Lens Focal Length.

We can visualize the DOF Layers by using the **Show** dropdown in the **Viewport** to select **Advanced** \> **Depth of Field Layers**. In this instance, Green represents the foreground objects, Black is the area where objects are focused, and Blue is part of the background.

 [image: Rendered Scene]

 [image: Depth of Field Layers Visualization]

To demonstrate how this works, drag the slider to change the Focus Distance between 4m, 7m, and 10m. Adjusting the Focus Distance adjusts the Focal Plane (purple dotted line) in the scene, indicating where the in-focus region of the shot is. The blue reference point in the diagram uses the Character as the focal subject here, so as the camera shifts shot focus (black/gray area above) to different parts of the scene, objects in the foreground and background will shift too. Starting with 4m, the Police car in the foreground is in sharp focus and the character is out of focus in the background. The blue reference in the diagram indicates this with its focal point intersection in front of the filmback. At 7m, the character is completely in focus with background and foreground objects out of focus. At 10m, the construction barriers are in sharp focus and the character and a Police car are out of focus in the foreground. The blue reference in the diagram indicates this since the intersection point extends beyond the filmback. Through all these Focus Distance changes, the DOF effect increases or decreases depending on an object being in the foreground or background.

Note that only the Focus Distance is being changed here; the F-stop and Focal Length remain constant at f/1.4 and 75mm, respectively.

 [image: Focus Distance]
 [image: Focus Distance]
 [image: Focus Distance]

### Procedural Diaphragm Simulation

The job of Depth of Field is to apply focal importance to a subject(s) in your scene. Just as importantly, out-of-focus areas can be as important. Unreal Engine 4's depth of field simulates the lens diaphragm by enabling you to aesthetically control the shape of the Bokeh (out-of-focus areas) by adjusting the number and curvature of diaphragm blades.

 [image: Depth of Field Shot]

For performance reasons, the diaphragm simulation is only supported on Engine Scalability settings of Epic and Cinematic. Lower quality settings will fall back to circle Bokeh shapes of equal area to ensure similar behavior with auto exposure functionality, in turn disabling the diaphragm blade simulation.

#### Number of Diaphragm Blades

The **Diaphragm** (or Iris) is a mechanism made up of blades that can adjust to aesthetically inform the look of Bokeh shapes. Using a lower number of blades will result in a polygon-shaped diaphragm whereas a higher number of blades improves the curvature of the diaphragm to appear more natural with rounded out-of-focus Bokeh.

 [image: Blades]
 [image: Blades]
 [image: Blades]
 [image: Blades]

The number of diaphragm blades directly influences the shape of the Bokeh when the Maximum Aperture is increased (minimum F-stop number is decreased).

 [image: Diaphragm Zoomed]
 [image: Diaphragm Zoomed]
 [image: Diaphragm Zoomed]
 [image: Diaphragm Zoomed]

#### Aperture and Max Aperture

The **Aperture** is the opening of the lens controlled by the diameter of the **Diaphragm** which is measured in **F-stops**. The amount of light allowed to pass through the lens is controlled by the size of the aperture. Adjusting the size of the aperture sets the focal plane to adjust how in-focus or out-of-focus areas outside of the focal region are.

The following chart shows the correlation between aperture size (f-stop number), max aperture (min f-stop number), and depth of field effects.

 [image: Aperture Range]

A larger aperture (lower f-stop number) has a shallow focal region, causing the foreground and background to become more out-of-focus. A small aperture (higher f-stop number) has a deeper focal region that includes more objects in focus in the foreground and background.

 [image: Aperture Stop]
 [image: Aperture Stop]
 [image: Aperture Stop]
 [image: Aperture Stop]
 [image: Aperture Stop]
 [image: Aperture Stop]

Aperture F-stops: 1.4, 2.0, 2.8, 4.0, 5.6, 8.0

While the Aperture can be as small as you'd like, it can only ever be as large as the maximum size of the lens. The **Maximum Aperture** (measured in f-stop) defines how large the lens can be. This also defines the curvature of the blades that make up the diaphragm by limiting the size that the aperture can open; limiting the size of the aperture shortens the effective focal region which limits how out-of-focus areas can be.

 [image: Max Aperture And Bokeh]
 [image: Max Aperture And Bokeh]
 [image: Max Aperture And Bokeh]
 [image: Max Aperture And Bokeh]

5 Diaphragm Blades with Different Max Aperture Values

In this example, the **Number of Diaphragm Blades** is set to 5. With a smaller Aperture, the blades of the diaphragm become more visible in the Bokeh shapes. Using a larger Aperture (f-stop is equal to minimal f-stop) the Bokeh shapes will begin to become circular.

In this example, a Cine Camera Actor is being used with the following values:

- **Min F-Stop**: 1.4

- **Max F-Stop**: 4.0

- **Diaphragm Blade Count**: 5

- **Current Aperture**: 1.4 - 4.0

With these values, the F-stop can only accept values between **1.4** and **4.0**. As the depth of field effect is deepened with a larger F-stop (smaller aperture), the diaphragm blades become more visible in the Bokeh shapes.

Keep in mind that the aperture is not controlling the light intensity. This choice has been made so that you don't have to continually adjust the exposure at the same time as with a real camera.

### Cinematic DOF Settings

#### Cinematic Camera

The following settings are specific to the Cinematic Camera Actor (-> cinematic-cameras-in-unreal-engine). Note that you have access to the Camera and Depth of Field settings as well.

| Property | Description |
| --- | --- |
| Filmback |  |
| **Sensor Width** | Sets the horizontal size of the filmback or digital sensor (measured in millimeters (mm)). |
| **Sensor Height** | Sets the vertical size of the filmback or digital sensor (measured in millimeters (mm)). |
| **Sensor Aspect Ratio** | Read-Only. Computed from Sensor dimensions. |
| Lens Settings |  |
| **Min Focal Length** | Sets the minimum focal length for the lens (measured in millimeters (mm)). |
| **Max Focal Length** | Sets the maximum focal length for the lens (measured in millimeters (mm)). |
| **Min FStop** | The maximum aperture for this lens. For example, 2.8 for an f/2.8 lens. This will also define the curvature of the blades of the diaphragm. |
| **Max FStop** | The minimum aperture for this lens. For example, 8.0 for an f/8.0 lens. |
| **Diaphragm Blade Count** | The number of blades that make up the diaphragm mechanism. |
| Focus Settings |  |
| **Focus Method** | Select the camera focus method to use: **None: **Disables DOF entirely. **Manual:** Allows for specifying or animating exact focus distances. **Tracking:** Locks focus on a specific object in the shot. |
| **Manual Focus Distance** | Set the manually-controlled focus distance. This is only available when the **Focus Method** is set to **Manual**. |
| **Draw Debug Focus Plane** | Enable to draw a translucent plane at the current focus depth. This enables a visual way to track where the focus is for the shot. |
| **Debug Focus Plane Color** | When this setting is enabled, it sets a color for **Draw Debug Focus Plane.** |
| **Smooth Focus Changes** | Enable this to use interpolation to smooth out changes in focus distance. When disabled, the focus changes will be instantaneous. |
| **Focus Smoothing Interp Speed** | Controls the interpolation speed when smoothing focus distance changes. This option is ignored if **Smooth Focus Changes** is not enabled. |
| **Focus Offset** | This adds offset to focus depth which can be used to manually tweak focus if the chosen focus method needs adjustment. |
| **Current Focal Length** | Controls the current focal length of the camera which controls the field of view (FOV) and zoom. |
| **Current Aperture** | Sets the current aperture size based on an f-stop number. Note that this setting only accepts values that are within the **Min FStop** and **Max FStop** range. |
| **Current Focal Distance** | Displays a read-only value that is used by the **Focus Settings**. |
| **Current Horizontal FOV** | Displays a read-only value that is used by **Current Focal Length** and **Filmback Settings**. |

#### Post Process Volume and Camera Actor

The following settings are available with the Cine Camera Actor (-> cinematic-cameras-in-unreal-engine), Camera (-> movie-and-cinematic-cameras-in-unreal-engine), and Post Process Volumes (-> post-process-effects-in-unreal-engine).

| Property | Description |
| --- | --- |
| Camera Settings |  |
| **Shutter Speed (1/s)** | The camera shutter in seconds. |
| **ISO** | The camera sensor sensivity. |
| **Aperture (F-stop)** | Defines the opening of the camera lens. The aperture is 1/f-stop with a typical lens going down to f/1.2 (larger opening). Larger numbers will reduce the DOF effect. |
| **Maximum Aperture (minimum f-stop)** | Defines the maximum opening of the camera lens to control the curvature of the diaphragm. Set this to 0 to get straight blades. |
| **Number of Diaphragm Blades** | Defines the number of blades of the diaphragm within the lens. Values between 4 and 16 can be used. |
| Depth of Field Settings |  |
| **Focal Distance** | The distance in which the depth of field effect should be sharp. This value is measured in Unreal Units (cm). |
| **Depth Blur km for 50%** | Defines the distance at which the pixel is blurred with a radius half of the Depth blur Radius. This is particularly useful to emulate cheap atmospheric scattering. |
| **Depth Blur Radius** | Radius in pixels at 1080p resolution to apply according to distance from the camera to emulate atmospheric scattering. |

### Useful Console Variables for Optimization

The challenge of DOF is that it can vary depending on your content and how much importance has been given to the artistic direction of your game with DOF. With that in mind, the DOF implementation offers a variety of console variables ready to be customized per platform for developers to better control the performance budget allocated.

Below are some console variables that can be useful for binding Cinematic DOF performance.

- **r.DOF.Kernel.MaxBackgroundRadius:** The maximum size of the background blurring radius in horizontal screen space.

- **r.DOF.Kernel.MaxForegroundRadius:** The maximum size of the foreground blurring radius in horizontal screen space.

- **r.DOF.Scatter.MaxSpriteRatio:** The maximum ratio of scattered pixel quads as sprites. Useful to control DOFs scattering upper bound.

Note that these are a good starting point and additional console variables can be found under **r.DOF.***.

## Bokeh DOF Method (Legacy)

As of Unreal Engine 4.23, Bokeh DOF has been removed from Unreal Engine and the source code. If using 4.22 and 4.21, Bokeh DOF has been deprecated for the Deferred Desktop Renderer and the Forward Rendering path.

**Bokeh** DOF refers to the name of the shape that can be seen in photos or movies when objects are out of focus. This method renders a textured quad for each pixel using a user-specified texture to define a shape with which to reproduce the effect of a camera lens.

The implementation only uses half-resolution to perform this intensive effect. It attempts to save render performance in areas where the effect is not noticeable by using Adaptive Depth of Field. Bokeh DOF is more costly than other DOF methods available in Unreal Engine making this a prime candidate for cinematics and showcases where appealing visuals often outweigh any performance concerns in those situations.

 [image: Depth of Field Disabled]

 [image: Bokeh Depth of Field Enabled]

### Adaptive Depth of Field for Bokeh DoF

Bokeh DOF is rendered at quarter resolution (half resolution in each direction) by default for performance reasons. In most cases, the downsampling is barely noticeable, which is perfectly acceptable; however, in some situations, it can lead to artifacts and unwanted results. Adaptive Depth of Field resolves these types of artifacts where possible.

 [image: Adaptive DOF without Downsampling]

 [image: Adaptive DOF with Downsampling]

The characters being blurred in the background appear blocky when using only the downsampled DOF technique. Also, some artifacts appear around the horns of the character in the foreground. Adaptive DOF eliminates these types of artifacts, and the background characters have a much smoother appearance.

Adaptive DOF can be visualized by using the **Adaptive Depth of Field** to show the flag in the Level Viewport under **Show** \> **Visualize**. When enabled, an overlay is shown where the downsampled effect is being used (green) and where the full-resolution effect is being used (red). The regular scene color is shown where no blurring is being applied.

 [image: Depth Of Field Adaptive Vesualize]

In general, you want the Adaptive DOF to display all green. The more red shown by the visualization, the more expensive the scene is to render each frame.

 [image: Adaptive DOF mostly optimized]

 [image: Adaptive DOF unoptimized ]

### Bokeh DOF Settings

The following settings are available with the Cine Camera, Camera, and Post Process Volumes, located under the Lens tab in the Depth of Field section.

| **Property** | **Description** |
| --- | --- |
| **Focal Distance** | The distance in which the depth of field effect should be sharp. This value is measured in Unreal Units (cm). |
| **Near Transition Region** | The distance in Unreal Units from the focal region on the side nearer to the camera over which the scene transitions from focused to blurred when using Bokeh or Gaussian DOF. |
| **Far Transition Region** | The distance in Unreal units from the focal region on the side farthest from the camera over which the scene transitions from focused to blurred when using Bokeh or Gaussian DOF. |
| **Scale** | An overall scaling factor for Bokeh-based blurring. |
| **Max Bokeh Size** | The maximum size (in percent of the view width) of the blur for the Bokeh-based DOF. Note that performance scales with the size. |
| **Shape Texture** | A texture that defines the shape of the Bokeh when objects get out of focus. Note that these cannot be blended with other Post Process Volumes. |
| **Occlusion** | Controls how much the blurred geometry extends beyond its usual silhouette and its opacity. A value of 0.18 gives a fairly natural occlusion result. A value of 0.4 may be necessary to solve layer color leaking issues. Very small values (less than 0.18) generally result in negating the blur effect, though can work well when objects are very near to the camera. |
| **Color Threshold** | Controls the threshold where adaptive DOF switches to using full resolution based on color. Smaller values cause more of the scene to use full-resolution processing. |
| **Size Threshold** | Controls the threshold where adaptive DOF switches to using full-resolution based on size. Larger values cause more of the scene to use full-resolution processing. |

## External Resources

- SIGGRAPH 2018 - "A Life of a Bokeh" by Guillaume Abadie (PowerPoint presentation ~150 Mb)

- Diaphragm (Optics)

- Aperture

- F-Number

- Understanding Factors that affect Depth of Field

- rendering
- lighting
- post process
- depth of field
- dof

On this page

- Cinematic (-> cinematic-depth-of-field-in-unreal-engine)
- Focus on the Shot's Subject (-> cinematic-depth-of-field-in-unreal-engine)
- Aperture (-> cinematic-depth-of-field-in-unreal-engine)
- Focal Length (-> cinematic-depth-of-field-in-unreal-engine)
- Focus Distance (-> cinematic-depth-of-field-in-unreal-engine)
- Procedural Diaphragm Simulation (-> cinematic-depth-of-field-in-unreal-engine)
- Number of Diaphragm Blades (-> cinematic-depth-of-field-in-unreal-engine)
- Aperture and Max Aperture (-> cinematic-depth-of-field-in-unreal-engine)
- Cinematic DOF Settings (-> cinematic-depth-of-field-in-unreal-engine)
- Cinematic Camera (-> cinematic-depth-of-field-in-unreal-engine)
- Post Process Volume and Camera Actor (-> cinematic-depth-of-field-in-unreal-engine)
- Useful Console Variables for Optimization (-> cinematic-depth-of-field-in-unreal-engine)
- Bokeh DOF Method (Legacy) (-> cinematic-depth-of-field-in-unreal-engine)
- Adaptive Depth of Field for Bokeh DoF (-> cinematic-depth-of-field-in-unreal-engine)
- Bokeh DOF Settings (-> cinematic-depth-of-field-in-unreal-engine)
- External Resources (-> cinematic-depth-of-field-in-unreal-engine)

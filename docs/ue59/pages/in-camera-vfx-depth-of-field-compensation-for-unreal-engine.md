# In-Camera VFX Depth of Field Compensation

https://dev.epicgames.com/documentation/en-us/unreal-engine/in-camera-vfx-depth-of-field-compensation-for-unreal-engine?application_version=5.9

> A tool designed for Virtual Production that corrects depth of field mismatches between for physical and virtual cameras.

[image: In-Camera VFX Depth of Field Compensation]

Learn to use this **Experimental** feature, but use caution when shipping with it.

## Introduction

### The challenge with DOF on an LED wall

Managing Depth of Field (DOF) on an LED wall for In-Camera VFX (ICVFX) is a long-standing challenge. This is due in part to the fact that two DOFs are present, one from the virtual camera rendering using nDisplay on the LED wall, and the other from the physical camera. With these two cameras, matching Focus, Iris, and Zoom, the resulting image is inaccurate and blurrier than would otherwise be expected, and there is a break in the continuity between physical and virtual props and set dressing.

 [image: A depth of field continuity break between physical and virtual elements.]

In other scenarios, to mitigate the extra blurring effect, DOF is sometimes disabled leading to a lack of depth in the virtual background, or arbitrary adjustments are applied to the focus distance and aperture to attempt to achieve an desired accurate or creative result. These methods can result in non-accurate depth of field falloff and send confusing lens data downstream into post production.

 [image: Correcting the depth of field continuity break.]

### ICVFX Depth of Field Compensation

The ICVFX Depth of Field Compensation feature provides a simple and effective method to achieve accurate DOF for LED wall virtual production, with full creative control, whilst retaining contiguous DOF falloff between the physical and virtual set.

This feature is new and experimental; it has been rigorously tested and visually verified by the virtual production team, the level of accuracy it achieves has been shown to provide enormous value on set. Supporting both spherical and anamorphic lenses, the compensation works by adjusting the Circle of Confusion (CoC, or amount of blur) of each pixel, based on the camera's distance to the wall and the pixel's depth in the scene. The compensation dynamically adjusts based on the real world camera’s focus distance, aperture and focal length.

## ICVFX DOF Compensation: How to use the feature

 [image: An In Camera VFX shoot in progress.]

### Prerequisites

#### Camera tracking and LED wall mesh

The main parameter the DOF compensation feature relies on is the camera’s distance to the LED wall, therefore camera tracking is required along with an nDisplay wall mesh matching the real world LED wall.

#### Matching camera parameters

It is also important that the ICVFX camera component or its assigned Cine Camera actor, share the same focus distance, aperture and focal length parameters (sometimes referred to as focus/iris/zoom or "FIZ") as the real world camera and lens. The Cine Camera actor must also share the same sensor size, and squeeze factor is also required for anamorphic lenses. This is best achieved with a lens encoding system and a well calibrated lens file, giving you a fully dynamic real time compensation, capable of compensation throughrack focuses!

However, without such a system, it is possible to enter all the parameters manually, just be sure to update the parameters each time the lens FIZ values are adjusted by the camera team. The blade count for the aperture is also important to achieve a complementary Bokeh.

#### Engine settings

Lastly, ensure the minimum engine scalability setting for Post Processing is set to Epic, otherwise the render will be utilizing legacy DOF which is not physically accurate.

Prerequisites in summary:

- Camera tracking

- Reasonably accurate LED wall mesh

- Lens encoding (ideal but optional)

- Lens file (ideal but optional

- All Cine Camera actor settings must match the real world camera Focus distance

- Aperture (Iris)

- Focal length (zoom)

- Sensor size

- Squeeze factor

- Aperture blade count

- Minimum engine scalability: Epic

### Location

The ICVFX Depth of Field Compensation feature is located on the ICVFX Camera Component of the nDisplay Config actor.

 [image: ICVFX Depth of Field settings under the ICVFX Camera Component.]

### Controls

The two main controls are:

- Enabling the feature

- Depth of Field Gain

 [image: Main ICVFX Depth of Field controls.]

Enabling the feature immediately compensates for DOF on the LED wall using the nDisplay render. You can also observe this compensation on the nDisplay Config actor preview render.

The **Depth of Field Gain** property is the main creative control, as it defines how shallow the depth of field is. A value of 1 is default and represents a match with the real world lens. A gain value higher than 1 (max 4) will make the DOF falloff more shallow. For example if you want a DOF which is twice as shallow then set the gain to 2. Gain values lower than 1 will make the DOF less shallow, i.e lower gain numbers increase the depth of field. For example, to halve how shallow the DOF is then set the DOF gain to 0.5. This works all the way down to a value of 0, at which point there is no DOF in the rendered LED wall content.

 [image: Additional ICVFX Depth of Field controls.]

Other controls include the **Automatically Set Distance to Wall** and **Distance to Wall Offset** properties. As this feature is experimental, the development team wanted to include controls to allow users to tinker and experiment, however these are not required to be altered for regular intended use. The Automatically Set Distance to Wall property is enabled by default and is responsible for providing a dynamic update of the compensation based on the camera’s position.

The Distance to Wall Offset property simply adds or subtracts a number from the distance to wall parameter. This can be used to artistically control the blur on the objects closer to the wall without changing the falloff. Bear in mind that defocusing the virtual objects at the wall depth, can in turn produce a double blur and break the transition from physical to virtual set, **but in the end if a shot looks correct through the monitor then it is!**

Lastly there is the **Compensation LUT** (look up table) property. Not to be confused with any color correction, this LUT defines the non-linear depth based adjustment to the circle of confusion required for DOF compensation. This can be left as default, but it was added to allow for further experimentation where it is felt to be required.

### Workflow Improvements

Improvements have been made to the way the Cine Camera actor and ICVFX Camera Component interact, such that changes to focus distance, aperture, focal length, and other lens parameters can be made on either actor/component and will be instantly reflected on the other. This means that these often used settings are now accessible from the nDisplay Config actor details panel.

The ICVFX Stage app also includes controls for the ICVFX Depth of Field compensation. This provides remote control on set for enabling and disabling compensation, adjusting the distance to wall offset and controlling the DOF Gain. When no lens encoding system is present, from the app it is possible to control all of the Cine Camera actor lens parameters, including focal length, aperture, focus distance, and its associated settings.

 [image: The ICVFX Stage app on a tablet.]
 [image: Controlling ICVFX Depth of Field Compensation from a tablet.]

## ICVFX Depth of Field Compensation: Caveats

### Bokeh

Bokeh rendered on the wall will appear slightly softer when compared with the bokeh produced in the lens. Therefore in scenarios where the focus distance is closer to the camera with a larger aperture leading to a very shallow depth of field, it may be worth setting the DOF gain to lower values, including 0. In our tests, in this limited scenario, DOF gain 0 provided more accurate Bokeh when compared with a reference image.

### Convert T-stop to F-stop

The Unreal engine Cine Camera actor expects F-stop values to be entered, therefore if your lens is in T-stops you will want to convert to F-stop for the most accurate results. However you may find very good results using the T-stop value without conversion, so don’t sweat it.

### Asymmetric Frustum Overscan

It’s worth also noting that the asymmetric frustum over scan settings can in some extreme situations impact the DOF, therefore adjust the DOF gain accordingly.

### Virtual Foreground Objects

It is not possible to compensate for virtual objects rendered on the wall that are between the Cine Camera actor and nDisplay Config actor, so you may wish to disable these for best results and rely on physical set props to provide foreground elements instead.

### Anamorphic Frustum Resolution

Lastly, the lens squeeze factor parameter increases the horizontal resolution of the frustum, so be sure to optimize content with this in mind. In situations where this has not been possible, a good work-around would be to reduce the frustum resolution multiplier or reduce the height of the frustum resolution based on the squeeze factor (for example, squeeze factor of 1.8 would require that you divide the vertical resolution by 1.8)

- experimental
- virtual production
- ndisplay
- icvfx
- virtual sets
- bronze

On this page

- Introduction (-> in-camera-vfx-depth-of-field-compensation-for-unreal-engine)
- The challenge with DOF on an LED wall (-> in-camera-vfx-depth-of-field-compensation-for-unreal-engine)
- ICVFX Depth of Field Compensation (-> in-camera-vfx-depth-of-field-compensation-for-unreal-engine)
- ICVFX DOF Compensation: How to use the feature (-> in-camera-vfx-depth-of-field-compensation-for-unreal-engine)
- Prerequisites (-> in-camera-vfx-depth-of-field-compensation-for-unreal-engine)
- Camera tracking and LED wall mesh (-> in-camera-vfx-depth-of-field-compensation-for-unreal-engine)
- Matching camera parameters (-> in-camera-vfx-depth-of-field-compensation-for-unreal-engine)
- Engine settings (-> in-camera-vfx-depth-of-field-compensation-for-unreal-engine)
- Location (-> in-camera-vfx-depth-of-field-compensation-for-unreal-engine)
- Controls (-> in-camera-vfx-depth-of-field-compensation-for-unreal-engine)
- Workflow Improvements (-> in-camera-vfx-depth-of-field-compensation-for-unreal-engine)
- ICVFX Depth of Field Compensation: Caveats (-> in-camera-vfx-depth-of-field-compensation-for-unreal-engine)
- Bokeh (-> in-camera-vfx-depth-of-field-compensation-for-unreal-engine)
- Convert T-stop to F-stop (-> in-camera-vfx-depth-of-field-compensation-for-unreal-engine)
- Asymmetric Frustum Overscan (-> in-camera-vfx-depth-of-field-compensation-for-unreal-engine)
- Virtual Foreground Objects (-> in-camera-vfx-depth-of-field-compensation-for-unreal-engine)
- Anamorphic Frustum Resolution (-> in-camera-vfx-depth-of-field-compensation-for-unreal-engine)

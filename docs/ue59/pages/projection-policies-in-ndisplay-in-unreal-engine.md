# Projection Policies in nDisplay

https://dev.epicgames.com/documentation/en-us/unreal-engine/projection-policies-in-ndisplay-in-unreal-engine?application_version=5.9

> Reference for policies supported in Unreal Engine for multiple screen displays

[image: Projection Policies in nDisplay]

## Projection Policies in nDisplay

As part of the development strategy for new features, Epic Games is constantly evaluating existing tools that could add functionality to Unreal Engine. After much research, we found the following technologies to help us achieve our goals for scaled displays.

## Simple

Simple refers to the standard policy used to render on regular 2D flat displays. This policy requires a rectangle in 3D space to be used to build camera frustum. The rectangle (screen) must be defined in the Components panel, then referenced in the simple projection policy section on the viewport's Details panel.

Follow the steps below to use the Simple policy in your project.

- Open your nDisplay Config Asset in the nDisplay 3D Config Editor (-> ndisplay-3d-config-editor-in-unreal-engine).

- In the **Components** panel, select **Add Component** and choose **NDisplay Screen**. [image: Add nDisplay Screen component]

- In the **Cluster** panel, select **Add New Viewport**.

- In the Add New Viewport window under **Configuration > Projection Policy**, modify the following fields: Set **Type** to **simple**.

- Set **Screen** to the screen component that you created in Step 2. In this example, the screen was named nDisplayScreen. [image: Configuration Projection Policy settings]

- Verify the screen is rendering the Viewport correctly. You may need to set the **View Origin** in the Viewport's **Details** panel to see the test scene. Click image to expand

## Camera

Since it is impossible to get a view from a regular Unreal Engine camera or cine camera with nDisplay, the camera policy was introduced. This policy allows you to map a view of any UE4 camera to the nDisplay viewport.

Follow the steps below to use the Camera policy in your project.

- Open your nDisplay Config Asset in the nDisplay 3D Config Editor (-> ndisplay-3d-config-editor-in-unreal-engine).

- In the **Components** panel, select **Add Component** and choose one of the Camera components: **ICVFX Camera**, **Camera**, or **Cine Camera**. [image: Add a Camera component]

- In the **Cluster** panel, select **Add New Viewport**.

- In the Add New Viewport window under **Configuration > Projection Policy**, modify the following fields: Set **Type** to **camera**.

- Set **Camera** to the camera that you created in Step 2. In this example, the camera was named ICVFXCamera.

- Choose the setting for Use nDisplay Renderer. By default, this enables the nDisplay render path for clustered rendering. When disabled, the nDisplay renderer is bypassed and displays native UE pixels for this specific camera. Disable this for debugging purposes or to compare native camera rendering vs nDisplay cluster rendering. [image: Configure the Projection Policy for your camera]

- Verify the camera is rendering the viewport correctly. [image: Camera rendering the Viewport]

## Manual

As a generic solution for those systems that are not yet supported by nDisplay, a new manual projection policy was introduced. The key idea is that the user explicitly sets a view frustum for a particular viewport.
For stereo rendering, two frustums are required. This can be done either via projection matrix or frustum angles. For more details on the difference between Mono and Stereo Rendering in nDisplay, see Stereoscoping Rendering in nDisplay (-> stereoscopic-rendering-with-ndisplay-in-unreal-engine).

Follow the steps below to use the Manual policy in your project.

- Open your nDisplay Config Asset in the nDisplay 3D Config Editor (-> ndisplay-3d-config-editor-in-unreal-engine).

- In the **Cluster** panel, select **Add New Viewport**.

- In the **Add New Viewport** window under **Configuration > Projection Policy**, modify the following fields: Set **Type** to **Manual**.

- Set **Rendering** to **Mono**, **Stereo**, or **Mono&Stereo**.

- Set **Frustum** to **Matrix** or **Angles** For **Frustum Matrix**: Set the **Rotation** and **Matrix** fields (or **MatrixLeft** and **MatrixRight** if you picked **Stereo** instead of **Mono**). [image: Frustrum Matrix settings]

- For **Frustum Angles**: Set the **Rotation** and **Frustum** fields (or **FrustumLeft** and **FrustumRight** if you picked **Stereo** instead of **Mono**). [image: Frustrum Angles settings]

- Verify the viewport is rendering correctly.

## Mesh

This projection policy simplifies warp-rendering workflows. Instead of a PFM (portable float map) workflow, it is now possible to simply assign a mesh to effectively warp the rendered output. You can use either an **NDisplayScreen**, which creates a 2D display regardless of ratio and pixel density, or a **StaticMesh** Component, which can be a screen of an arbitrary shape and form, to specify the shape of the rendered output. The UV channel 0 is used for warp mapping.

Follow the steps below to use the Mesh policy in your project.

- Open your nDisplay Config Asset in the nDisplay 3D Config Editor (-> ndisplay-3d-config-editor-in-unreal-engine).

- In the **Components** panel, select **Add Component** and choose either **NDisplayScreen** or **StaticMesh**.

- In the **Cluster** panel, select **Add New Viewport**.

- In the **Add New Viewport** window under **Configuration > Projection Policy**, modify the following fields: Set **Type** to **Mesh**

- Set **Mesh** to the Component you created in Step 2. In this example, it's assigned to a StaticMesh with the name SM_Screen_0. [image: Configure the Projection Policy for your mesh]

- Verify the viewport is rendering correctly on the mesh. You may need to set the **View Origin** in the Viewport's **Details** panel to see the test scene. Click image to expand

## MPCDI

An integration of the MPCDI standard is used for complex projects that rely on this industry protocol.

The MPCDI (Multiple Projection Common Data Interchange) standard was developed by the VESA Multi-Projector Automatic Calibration (MPAC) Task Group. This is a standard data format for projection calibration systems to communicate with devices in a multi-display configuration.

The standard provides a way for multi-projector systems to generate the data needed to combine individual display components into a single, seamless image by a variety of devices. Any new hardware introduced into a system can be easily integrated with the standard.

MPCDI is used throughout the industry by content producers and vendors such as:

- Scalable Display Technologies

- VIOSO

- Dataton Watchout

- 7thSense Design

Support for the MPCDI standard enables nDisplay to read and store data describing a complex projector system in a standardized and formalized fashion, so that we can easily communicate and interface with various other tools from within the industry. MPDCI is supported in the Editor Preview and Overscan.

There are two ways to use mpcdi projection policy. The first is a native approach where the user has to specify the .mpcdi file, buffer, and region to use. The second is where the user explicitly specifies files stored in .mpcdi (which is basically a file archive).

### Using the .mpcdi File

Follow the steps below to use a native approach for the MPCDI policy in your project.

- Open your nDisplay Config Asset in the nDisplay 3D Config Editor (-> ndisplay-3d-config-editor-in-unreal-engine).

- In the **Cluster** panel, select **Add New Viewport**.

- In the **Add New Viewport** window under **Configuration > Projection Policy**, modify the following fields: Set **Type** to **MPCDI**.

- Set **MPCDI Type** to **MPCDI**.

- Next to **File**, browse to the `.mpcdi` file on your computer.

- Set **Buffer** to the name of the buffer in the `.mpcdi` file.

- Set **Region** to the name of a region within the `.mpcdi` file's buffer. [image: Configure the Projection Policy for MPCDI]

- Verify the viewport is rendering correctly.

### Explicit Specification

Follow the steps below to explicitly specify how to use the MPCDI policy in your project.

- Open your nDisplay Config Asset in the nDisplay 3D Config Editor (-> ndisplay-3d-config-editor-in-unreal-engine).

- In the **Cluster** panel, select **Add New Viewport**.

- In the **Add New Viewport** window under **Configuration > Projection Policy**, modify the following fields: Set **Type** to **MPCDI**.

- Set **MPCDI Type** to **Explicit PFM**.

- Next to **File**, browse to the `.pfm` file that represents warp geometry on your computer.

- Next to **Alpha Mask**, browse to the `.png` file that represents the alpha mask on your computer.

- Set the **Alpha Gamma** field to the associated alpha masks's gamma value. Alpha masks with no gamma can use a value of 1.0, which would be equivalent to linear.

- Next to **Beta Mask**, browse to the `.png` file that represents the beta mask on your computer.

- Set the **Scale** field to the geometry scale used in the `.pfm` file.

- Enable **Use Unreal Axis** if you want to use Unreal's axis. [image: Configure the Projection Policy for Explicit MPCDI]

- Verify the viewport is rendering correctly.

## EasyBlend (Scalable Display)

Integration of EasyBlend calibration data is done with a Scalable SDK that enables warp, blend, and keystoning features. This meets the requirement to display on non-planar and complex display surfaces, such as curved or dome-shaped surfaces, using multi-projectors.

Scalable Display Technologies is a company that focuses on software and SDKs for complex projection systems. Their SDK is designed to provide a solution for large displays of a single image through warping and blending. Since Scalable Display Technologies already had the EasyBlend solution in place to handle warping and blending of large images, we chose to integrate it with Unreal Engine.

The Unreal Engine nDisplay supports warp and blend through the integration of the industry-standard middlewares Scalable SDK and EasyBlend for all supported modes, native warp and blend with MPCDI, and custom implementations.

We implemented the integration of EasyBlend to provide a seamless experience in configuring a complex projective system. Once calibration is completed using the third-party tool or software, the user only needs to specify a few parameters in the nDisplay configuration file to get it running.

Follow the steps below to use the EasyBlend policy in your project.

- Open your nDisplay Config Asset in the nDisplay 3D Config Editor (-> ndisplay-3d-config-editor-in-unreal-engine).

- In the **Cluster** panel, select **Add New Viewport**.

- In the **Add New Viewport** window under **Configuration > Projection Policy**, modify the following fields: Set **Type** to **EasyBlend**.

- Next to **File**, browse to the `.pol` file on your computer.

- Set the **Origin** and **Scale** fields. [image: Configure your Projection Policy for EasyBlend]

- Verify that the viewport rendering is properly deformed in regards to the provided EasyBlend calibration files. The render result should match the reference images from the vendor.

## VIOSO

Native SDK integration of VIOSO calibration data is available for projector warping and soft edge blending on complex surfaces.

Once calibration is completed using VIOSO's tools and software, follow the steps below to use the VIOSO policy in your project.

- Open your nDisplay Config Asset in the nDisplay 3D Config Editor (-> ndisplay-3d-config-editor-in-unreal-engine).

- In the **Cluster** panel, select **Add New Viewport**.

- In the **Add New Viewport** window under **Configuration > Projection Policy**, modify the following fields: Set **Type** to **VIOSO**.

- Next to **File**, browse to the `.vwf` file on your computer.

- Set the **Origin** and **Matrix** fields. [image: Configure the Projection Policy for VIOSO]

- Verify that the viewport rendering is properly deformed in regards to the provided VIOSO calibration files. The render result should match the reference images from the vendor.

## DomeProjection

Native SDK integration of DomeProjection calibration data is available for projector warping and soft edge blending on massive dome surfaces. Once calibration is completed using DomeProjection's tools and software, add a couple parameters to the nDisplay configuration file to use it in your project.

- Open your nDisplay Config Asset in the nDisplay 3D Config Editor.

- In the **Cluster** panel, select **Add New Viewport**.

- In the **Add New Viewport** window under **Configuration > Projection Policy**, modify the following fields: Set **Type** to **DomeProjection**.

- Next to **File**, browse to the `.xml` file exported from DomeProjection's software on your computer.

- Set the **Origin** and **Channel** fields. [image: Configure the Projection Policy for DomeProjection]

- Verify that the viewport rendering is properly deformed in regards to the provided DomeProjection calibration files. The render result should match the reference images from the vendor.

- rendering
- vfx
- graphics
- ndisplay
- projection policies
- multiple screen projection

On this page

- Projection Policies in nDisplay (-> projection-policies-in-ndisplay-in-unreal-engine)
- Simple (-> projection-policies-in-ndisplay-in-unreal-engine)
- Camera (-> projection-policies-in-ndisplay-in-unreal-engine)
- Manual (-> projection-policies-in-ndisplay-in-unreal-engine)
- Mesh (-> projection-policies-in-ndisplay-in-unreal-engine)
- MPCDI (-> projection-policies-in-ndisplay-in-unreal-engine)
- Using the .mpcdi File (-> projection-policies-in-ndisplay-in-unreal-engine)
- Explicit Specification (-> projection-policies-in-ndisplay-in-unreal-engine)
- EasyBlend (Scalable Display) (-> projection-policies-in-ndisplay-in-unreal-engine)
- VIOSO (-> projection-policies-in-ndisplay-in-unreal-engine)
- DomeProjection (-> projection-policies-in-ndisplay-in-unreal-engine)

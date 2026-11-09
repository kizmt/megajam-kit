# Material Instance Editor UI

https://dev.epicgames.com/documentation/en-us/unreal-engine/unreal-engine-material-instance-editor-ui?application_version=5.9

> Guide to using the Material Instance Editor for modifying MaterialInstanceConstants.

[image: Material Instance Editor UI]

The Material Instance Editor is used for modifying parameters in Material Instances. If you are unfamiliar with Material parameterization and instancing, read the following pages:

- Material Instances Overview (-> instanced-materials-in-unreal-engine)

- Creating and Using Material Instances (-> creating-and-using-material-instances-in-unreal-engine)

## Opening the Material Instance Editor

Double-click a **Material Instance** asset in the Content Browser to open the Material Instance Editor.

 [image: Double-click instance]

You can also **Right-click** the Material Instance thumbnail in the Content Browser and choose **Edit** from the context menu.

## Material Instance Editor Interface

The Material Instance Editor is comprised of these regions:

- Toolbar (-> unreal-engine-material-instance-editor-ui) - Save your asset, locate it in the Content Browser, show hidden parameters, display inheritance hierarchy and platform stats.

- Viewport (-> unreal-engine-material-instance-editor-ui) - A realtime viewport showing a preview of the Material instance.

- Viewport display options (-> unreal-engine-material-instance-editor-ui) - Allows you to edit the camera and display settings in the viewport, and change the mesh used for the Material preview.

- Details Panel (-> unreal-engine-material-instance-editor-ui) - All exposed Material parameters and properties are found here.

### Toolbar

| **Icon** | **Description** |
| --- | --- |
| [image: Save icon] | Saves the current asset. |
| [image: Content Browser] | Finds and selects the Material instance in the **Content Browser**. |
| [image: Show hidden] | Displays inactive parameters that are hidden behind static swtiches. |
| [image: Hierarchy] | Shows the inheritance hierarchy of the Material instance. See below (-> unreal-engine-material-instance-editor-ui). |
| [image: Platform Stats] | Opens a window displaying render statistcs for different target platforms. |

#### Hierarchy Menu

The **Hierarchy menu** displays the inheritance chain for the current Material instance. Since Material instances can be used as the parent for other Material instances, both parents and children are listed in the Hierarchy menu.

 [image: Hierarchy]

- **Parents** of the current Material Instance are listed under Parent Chain. If there are multiple parents, the first one listed is at the top of the inheritance hierarchy.

- **Children** of the current Material Instances are listed under Material Instances.

Selecting a parent Material or Material instance from the Hierarchy menu opens that asset in a **new tab** of the Material Instance Editor window.

 [image: Material parent tab]

### Viewport

 [image: Preview Viewport]

The viewport shows a preview of your Material instance applied to a Static Mesh. The Material preview updates in real time as you make changes to the parameters in your Material Instance.

You can interact with the viewport using these controls:

- Click and drag the **left mouse button** to rotate the preview mesh.

- Click and drag the **middle mouse button** to pan the camera.

- Click and drag the **right mouse button** to zoom in an out, or use your scroll wheel.

- Rotate the light direction by holding down the **L** key and dragging with the **left mouse button**.

### Viewport Display Options

| **Icon** | **Description** |
| --- | --- |
| [image: Viewport options] | Contains toggle to enable real time preview, display FPS, and change FOV of the preview window. |
| [image: Camera options] | Switch between Perspective and Orthographic viewport cameras. |
| [image: View mode options] | lContains standard view modes like Lit, Unlit, Wireframe and others. Also contains an exposure override. |
| [image: Show options] | Enable or disable rendering stats, the grid and the background. |
| [image: Cylinder preview] | Preview the Material instance on a cylinder. |
| [image: Sphere preview] | Preview the Material instance on a sphere. |
| [image: Plane preview] | Preview the Material instance on a plane. |
| [image: Cube preview] | Preview the Material instance on a cube. |
| [image: Custom static mesh] | Preview the Material instance on a custom Static Mesh. |

You can change the Material preview mesh by clicking one of the shape icons at the bottom of the Viewport.

 [image: Preview Mesh options]

To preview your Material instance on a custom mesh, select a **Static Mesh** asset in the Content Browser, and then click the **brick icon**. The preview mesh is saved with the Material instance so that the next time it is opened it will appear on the same preview mesh.

 [image: Custom mesh preview]

The Viewport also displays statistics about the Material, such as instruction counts for the various shader types as well as the number of Texture
samples used by the Material.

 [image: Viewport statistics]

To preview any sort of movement or animation in your Material Instance, you must enable the **Realtime** Viewport option. Click the hambuerger menu to open Viewport options and make sure Realtime is checked. This option is enabled by default.

 [image: Toggle Realtime]

You can also press **Ctrl+R** to toggle real-time rendering.

### Details Panel

The Details panel is where you can override the parameters and settings in your Material Instance. All of the changes you make to your Material instance will occur in this interface.

 [image: Details Panel]

There are three main subsections in the Details Panel:

#### Parameter Groups

Material attributes that you have exposed through parameters in your parent Material are listed here. To override the value in a parameter, check the box to the left of the parameter name and modify the value in the field. See here (-> unreal-engine-material-instance-editor-ui) for more information about overriding parameters.

#### General

The General section allows you to select a different Parent Material, or Physical Material. You can also adjust how this Material Instance will influence the Lightmass build and override some of the properties inherited from the parent Material. Read more about these settings here (-> unreal-engine-material-instance-editor-ui).

#### Previewing

This section provides another input to change the static mesh used for the Material Instance preview.

## Overriding Material Instance Parameters

Parameters are listed under the **Parameter Groups** section in the Details panel. To override a Material parameter:

- Place a check in the box to the left of the parameter name.

- Type a new value into the field or use the color picker to set a new value.

 [image: Override parameters]

Any parameter that is checked is currently overridden in the Material Instance. Unchecked parameters use the value from the parent Material, even if there is a different value in the field:

 [image: Unchecked parameter]

Remember to **Save** your Material instance when you are finished editing parameters so that your work is not lost. For memory conservation, values in unchecked fields will be lost when the Material Instance Editor window is closed.

To reset a parameter to its default value, click the **Reset** button to the right of the parameter.

 [image: Reset parameter]

### Overriding Material Instance Lightmass Settings

You can override the way your Material interacts with Lightmass under the **General > Lightmass Settings** section.

For example, if you increase the Emissive Boost attribute of an emissive Material, the Material will contribute more emissive light to the static lighting solution produced by Lightmass. This makes the result brighter.

 [image: Override Emissive Boost]

### Overriding Parent Material Properties

The Material Property Overrides section allows you to override some of the Material Properties in the parent Material of your instance.

For example, if you need an instance of your Material to render on both the front and back side of a surface, you can enable the Two Sided option.

 [image: Override Two Sided]

The advantage of overriding these properties in the Material Instance Editor instead of editing the parent is that it only affects a single instance of the Material. Every other instance will inherit settings from the parent.

- materials
- rendering
- shaders

On this page

- Opening the Material Instance Editor (-> unreal-engine-material-instance-editor-ui)
- Material Instance Editor Interface (-> unreal-engine-material-instance-editor-ui)
- Toolbar (-> unreal-engine-material-instance-editor-ui)
- Hierarchy Menu (-> unreal-engine-material-instance-editor-ui)
- Viewport (-> unreal-engine-material-instance-editor-ui)
- Viewport Display Options (-> unreal-engine-material-instance-editor-ui)
- Details Panel (-> unreal-engine-material-instance-editor-ui)
- Parameter Groups (-> unreal-engine-material-instance-editor-ui)
- General (-> unreal-engine-material-instance-editor-ui)
- Previewing (-> unreal-engine-material-instance-editor-ui)
- Overriding Material Instance Parameters (-> unreal-engine-material-instance-editor-ui)
- Overriding Material Instance Lightmass Settings (-> unreal-engine-material-instance-editor-ui)
- Overriding Parent Material Properties (-> unreal-engine-material-instance-editor-ui)

# Water Body Actors

https://dev.epicgames.com/documentation/en-us/unreal-engine/water-body-actors-in-unreal-engine?application_version=5.9

> A look at the various water bodies available and how to use them to build worlds with the water system.

[image: Water Body Actors]

You can use **Water Body Actors** to define the location and shape of the water surface and their transitions in the level. Water bodies are made up of water mesh tiles that are managed by the **Water Mesh Actor**. This actor sets the quality and properties of all water bodies. You can set the water mesh actor up to cover the area where you want water bodies rendered. When you do so, Unreal Engine automatically generates the needed mesh. Rendering all the water bodies as a single water tile mesh allows for smooth and seamless transitions between them.

Water Bodies also determine wave movement and shading of the water surface, as well as the underwater post-processing. Each water body contains information about its depth and flow. You can query these for gameplay usage. For example, you can create physics interactions with the water's surface.

## Types of Water Bodies

There are several types of Water Body Actors to choose from.

- Water Bodies for **Oceans**, **Lakes**, and **Rivers**. These are all defined using splines that store data about their type.

- A **Custom** type. This also has a spline for querying data, but you define the shape with a Static Mesh.

- An **Island**. This is used to raise landscape terrain within a defined spline area.

- An **Exclusion Volume**. You can use this to create underwater zones where gameplay can act as if it was not under water.

To add a Water Body Actor to your Level:

- Go to the **Place Actors** panel, select the **Water Body Actor**, and drag and drop it into your level

 [image: Placing a water body in the level.]

Water bodies automatically work with Landscape Terrain (-> landscape-outdoor-terrain-in-unreal-engine) to carve out the terrain beneath them using a Landscape Brush. The Landscape Brush only edits the landscape layer when the Landscape has **Enable Edit Layers** checked.

|  |  |
| --- | --- |
| [image: Enable Edit Layers in Landscape Mode.] | [image: Enable Edit Layers on the Landscape Actor.] |
| Enabling Edit Layers on new landscapes in Landscape Mode options. | Enabling Edit Layers on existing Landscape terrains. |

Water Bodies include their own underwater post-processing that happens when the camera moves below the water's surface. This enables you to define the look of water with a subset of the standard post-process settings.

### Ocean Water Body

The **Ocean Water Body** is defined by a closed loop spline that forms a shoreline and renders water out to a far distance from those spline points. The spline points all have the same height placement in the level.

Water Bodies are limited by how far they can reach, or their largest **Extent Size**. However, Ocean Water Bodies can reach this without completely filling the level, leaving a gap between the horizon line and the water depending on the perspective of the camera. **Water Zone** Actors provide an option to fill that gap with a simplified mesh and water material.

The example below demonstrates how the simplified water mesh can fill the empty space without the added cost of a highly tessellated mesh and complex material.

|  |  |
| --- | --- |
| [image: Example scene with a far distance mesh.] | [image: Example scene without a far distance mesh.] |
| Ground perspective with a Far Distance Mesh (default) | Ground perspective without a Far Distance Mesh. |

From an aerial perspective, it can be clear where the Ocean Water Body ends. You can use the Far Distance Mesh and match the color of its material to the Ocean Water Body to seamlessly fill the scene. This has less impact on performance.

|  |  |
| --- | --- |
| [image: Example scene with a far distance mesh.] | [image: Example scene without a far distance mesh.] |
| Aerial perspective with a Far Distance Mesh (default) | Aerial perspective without a Far Distance Mesh. |

The **Far Distance Mesh** is enabled by default in the **Water Zone** Actor. The **Far Distance Mesh Extent** is already set with a large enough distance to stretch to the world's edge.

To change the size of the extent:

- Go to the **WaterZone Actor > Rendering > FarDistance**, and change the value for **Far Distance Mesh Extent**.

 [image: Water Zone details FarDistance settings.]

By default, the **Water_FarMesh** material is assigned to the **Far Distance Material** slot. This material matches the default water materials used by the other water bodies ensuring that it will have a consistent look.

For consistency, when you adjust the color or other properties of your ocean water material, make sure to make the same changes to the **Water_FarMesh** material. Doing so ensures they blend together in the distance.

You can use **Far Distance Mesh Extent** to set how far (in world units) the Far Distance Mesh should extend beyond the Ocean Water Body. Make sure to use a large enough value that the mesh completely fills any gaps between the edge of the Ocean Water Body and the horizon line.

### Lake Water Body

The **Lake Water Body** is defined by its closed loop, which forms the lake and carves out the landscape beneath it. Each of its spline points is limited to having all points reside at the same height, unlike river spline points.

### River Water Body

The **River Water Body** is defined by its open spline with starting and ending points. Rivers carve out the landscape beneath them along the path of the spline. Rivers allow spline points to have varying heights. They do not drive surface motion using waves. Instead, rivers use velocity from the individual points along the spline to drive motion. The velocity is written to a flow map that visually drives the flow of water along the surface in the direction the spline is going.

River Water Bodies act as connections between other water bodies. At the points where lakes and oceans intersect a river, you can use a transitional material to automatically blend them together seamlessly.

 [image: Water Body transition example.]

### Custom Water Body

The **Water Body Custom** uses a Static Mesh with the same water material used by other Water Bodies. It also uses the same meshing system with some added flexibility for customization, such as creating a water surface for a pool. The primary difference is that custom water bodies do not use the Water Mesh Actor (-> water-meshing-system-and-surface-rendering-in-unreal-engine) and therefore do not automatically carve out the terrain. Custom water bodies can use a **Wave Source** from a Water Wave Asset (-> simulating-waves-using-the-water-waves-asset-in-unreal-engine) and underwater post-processing.

### Island Water Body

The **Island Water Body** creates islands based on a spline and includes similar terraforming controls to other water bodies. Their only purpose is to affect the landscape underneath them, to make sure that a given piece of land is always above water. Their terraforming is applied after all other water bodies.

## Water Body Properties

All Water Bodies share core properties that make up the Water Body Component, but there are some settings specific to individual Water Body types.

### Selected Points

The **Selected Points** category enables you to cycle through any of the currently selected Water Body's spline points. Each spline point has properties that include its location, rotation, and type. Some spline points also have Water Body-specific properties, such as Rivers having extra properties to define depth and width.

 [image: Water Body selected spline points.]

When a single or all spline points are selected, their properties are displayed below, showing their location, rotation, and type.

Each Water Body has its own Water (-> water-body-actors-in-unreal-engine) category of settings that relate to the spline points. These include settings for the velocity and audio intensity. River Water Bodies also include settings for depth and river width. The Depth values are fed to the Curve (-> water-body-actors-in-unreal-engine) controls of the water body.

|  |  |
| --- | --- |
| [image: Ocean and Lake Water Body spline properties.] | [image: River Water Body spline properties.] |
| Ocean and Lake Water Body Spline Properties | River Water Body Spline Properties |

| Property | Description |
| --- | --- |
| **Input Key** | The numerical ordering of spline points that make up the Water Body. |
| **Location** | The world location coordinates of the selected spline point relative to its pivot point location. |
| **Rotation** | The relative rotation of the selected spline point. |
| **Arrive Tangent** | This tangent is used when interpolating towards this point. |
| **Leave Tangent** | This tangent is used when interpolating away from this point. |
| Water |  |
| **Depth** | (Rivers Only) Sets the depth of the river at each spline point along the river's path. Depth can be specified individually for each point along the spline. |
| **River Width** | (Rivers Only) Sets the width of the river at each spline point along the river's path. You can specify the width for each individual point along the spline. |
| **Velocity** | (Rivers Only) Sets the directional speed along the river's spline path. Higher values control the speed of the water between each spline point. Positive and negative values control the direction that the water flows along the spline. |
| **Audio Intensity** | Modulates the audio volume level driven by the spline. |

#### River Spline Visualization and Manipulation

Water splines have the same features as generic splines. They have additional manipulators that you can enable through the right-click context menu.

 [image: River Water Body selected spline point visualization options.]

- **Visualize Water Velocity** displays the velocity at each spline through a trio of arrows, which are scaled according to the velocity of the points. [image: River Water Body velocity visualization.]

- **Visualize River Width** displays two handles that you can select and drag to edit the width of river water bodies in the viewport. [image: River Water Body width visualization.]

- **Visualize Depth** displays an additional handle that you can select and drag to edit the depth within the viewport. [image: River Water Body velocity visualization.]

You can set a global scale in the Project Settings, under the **Plugins > Water Editor** settings.

### Water

The **Water** category contains information about the selected Water Body. It also lists what **Islands** and **Exclusion Volumes** affect it. Under each of those categories, you can find the index number of the GPU-driven wave data.

 [image: Water Body Water settings]

This index is automatically used in the default **Water_Material** to calculate the correct surface waves. You can also manually set it to read from the parent material or any child instances through the scalar parameter called **WaterBodyIndex**.

 [image: Water Material Water Body Index parameter.]

| Property | Description |
| --- | --- |
| **Water Body Index** | The index into the GPU where the wave data for each Water Body Actor is stored. This index is automatically used in the water material to calculate the correct surface waves. |
| Advanced Properties |  |
| **Water Body Islands** | An array listing of any Water Body Islands that affect this water body. |
| **Water Body Exclusion Volumes** | An array listing of any Water Body Exclusion Volumes that affect this water body. |
| **Owning Water Zone** | The Water Zone that this Water Body belongs to. |
| **Water Zone Override** | An override to set which of the Water Zones in the world this Water Body should belong to. |
| **Fixed Water Depth** | If the Water Material assigned to this component has Fixed Depth enabled, this is the depth that is passed to the material. |

### Terrain

The **Terrain** category contains settings that change how the Water Body carves the terrain around the water.

For Water Bodies to interact with terrain, the Landscape must have **Enable Edit Layers** checked.

#### Curve Settings

The **Curve Settings** define the shape of the surface that is carved under the water, and primarily provides the water depth profile.

 [image: Water Body Curve settings]

| Property | Description |
| --- | --- |
| Curve Settings |  |
| **Use Curve Channel** | Toggles the carved surface under the water effect on and off. |
| **Elevation Curve Asset** | Use a Curve Asset to change how the landscape is carved below the water surface. |
| **Channel Edge Offset** | An offset from the edge of the water to where the curve starts. |
| **Channel Depth** | Sets the depth of Lake Water Bodies only. For River Water Bodies, depth is set per spline point. |
| **Curve Ramp Width** | The width of the curve (in world units). |

An **Elevation Curve Asset** is defined within a 0 to 1 range on both the X and Y axis. The Y axis represents the water's depth, and is multiplied with the Depth value set on each spline point. The default curve is a simple S curve that works for most cases.

|  |  |  |
| --- | --- | --- |
| [image: Float Curve] | [image: River Water Body S Curve] | [image: River Water Body hidden surface] |
| Float Curve Asset with an "S" Curve | Default S Curve with River Water Body | Default S Curve with River Water Body Surface Hidden |

The bottom-left corner of the curve is at 0,0. This is where the shoreline is located and the upper-right corner of the curve represents the maximum water depth.

For the Depth value that you set on River Water Body spline points to be accurate, you must keep the Y value at **1**.

#### Water Heightmap Settings

| Property | Description |
| --- | --- |
| **Blend Mode** | Choose between one of the following blend modes: **Alpha Blend:** Affects the height map of the landscape terrain both upwards and downwards. **Min:** Limits the brush to only lowering the landscape terrain. **Max:** Limits the brush to only raising the landscape terrain. **Adaptive:** Performs an additive blend using a flat Z height as the input. This is useful when you want to preserve underlying detail or ramps that you have added. |
| **Invert Shape** | Flips the carved shape inside out so that if you were carving a lake, it would now become an island. |
| Falloff Settings |  |
| **Falloff Mode** | Choose between Angle and Width based falloff for the selected Water Body. See Falloff Settings (-> water-body-actors-in-unreal-engine). |
| **Falloff Angle** | The angle at which the Water Body blends with the terrain beneath it. |
| **Falloff Width** | The width (in world units) of falloff from the Water Body's edge to the terrain. |
| **Edge Offset** | Applies a flat offset to the edge of the Water Body before the specified falloff begins. It can create a flat shoreline around a Waterbody. |
| **ZOffset** | Applies a Z offset to the height of the water surface for terrain carving. |
| Effects |  |
| **Blurring** | The distance field generation process can cause artifacts (such as pinching) that come from aliasing due to texture resolution. A small amount of blurring is applied automatically, but you can make manual adjustments to improve results. **Blur Shape:** Applies a small amount of blurring to the result to avoid artifacts that can occur. You should only disable this if there is a problem that is not automatically resolved. **Radius:** When Blur Shape is disabled, use this to increase or decrease the strength of the blurring that happens. |
| **Curl Noise** | This adds procedural distortion to the supplied spline. Two octaves of curl noise are exposed, each with a separate tiling parameter and strength. By default, the amount is set to 0, disabling any curl noise effects. Use the Curl Amount and Curl Tiling to apply different amounts of procedural noise to the result. |
| **Displacement** | Use a texture to add some additional detail to the Water Body. |
| **Smooth Blending** | Applies a smoothing parameter to the inner and outer edge of a Water Body. It is useful for seamlessly blending into nearby terrain for player navigation. **Inner Smooth Distance:** Applies an inner distance (in world units) to a Water Body to blend with the terrain. **Outer Smooth Distance:** Applies an outer distance (in world units) to a Water Body to blend with the terrain. |
| **Terracing** | This applies steps to the terrain area affected by a Water Body. The terracing can be masked to only occur a specified distance away from the water's edge using a specified alpha range. Terraces can also be blended from sharp to smooth. **Terrace Alpha:** The alpha used for the final application of the terraces. A value of 0 means terracing is disabled. A value of 0.5 means terracing is blended to 50% opacity, and a value of 1 displays full terracing. **Terrace Spacing:** The spacing (in world units) between terrace levels. **Terrace Smoothness:** Terraces are defined by a function that can blend between sharp steps, and smooth curved steps to a linear slope. A value of 0 has sharp terraces. A value of 0.5 has rounded terraces. A value of 1 has no terraces, giving the same result as Terrace Alpha of 0. **Mask Length:** Defines an alpha gradient from the edge of the water to where terraces become their full specified strength. **Mask Start Offset:** An offset to the distance the terrace mask starts from the edge of the Water Body. |
| **Layer Weightmap Settings** | Each water body contains this array that allows each to affect any number of weight maps. Each item added to the array exposes another Struct of settings for how the weight map will be applied. These controls allow mapping custom gradients from the distance field created for the brush and using textures to break up the results and add noise. Negative opacity is possible for creating subtractive effects. |
| **Affects Landscape** | If enabled, the Landscape terrain will be deformed based on the Water Body's placement on top of it, and the landscape height is considered when determining water depth at runtime. |

##### Blend Mode

The **Blend Mode** provides a selection of modes that gives different results for how Water Bodies carve out the landscape terrain beneath them.

You can choose between Blend Modes called **Alpha Blend**, **Min**, **Max**, and **Additive**.

|  |  |  |  |
| --- | --- | --- | --- |
| [image: Alpha Blend Mode] | [image: Min Blend Mode] | [image: Max Blend Mode] | [image: Additive Blend Mode] |
| Alpha Blend | Min | Max | Additive |

| Property | Description |
| --- | --- |
| **Alpha Blend** | This affects the heightmap both upwards and downwards. |
| **Min** | Limits the brush to only lowering the terrain. |
| **Max** | Limits the brush to only raising the terrain. |
| **Additive** | Performs an additive blend using a flat Z=0 terrain as the input. This is useful when you want to preserve the underlying detail or ramps. |

Most Water Bodies only need to use **Alpha Blend**, since it can both lower and raise the terrain to make sure a foundation exists at the height of the water.

The **Min** and **Max** options are ideally used in situations where you'd want to intersect a river with another water body without having the elevation of one affecting the other. For example, a river intersecting a lake should use a Min blend mode to prevent the river from raising the elevation inside the lake's carved-out terrain.

The **Additive** mode should be saved for special cases where you want to preserve the underlying detail since it does not ensure exact values are written to the landscape terrain.

##### Falloff Settings

The Falloff Settings determine how the Water Body carving blends into the existing terrain. You can customize this in several ways.

You can choose between two **Falloff Modes** called **Angle** and **Width**.

Angle-based falloff extends the object at a specified angle until an intersection with the landscape terrain occurs. Width-based falloff sets a fixed width that is used regardless of intersection with the landscape.

|  |  |
| --- | --- |
| [image: Angle-based falloff] | [image: Width-based falloff] |
| Angle-Based Falloff | Width-Based Falloff |

The **Edge Offset** applies a flat edge around the Water Body. This can be useful for flat shores on the sides of rivers, even when the river is carved through a mountain.

|  |  |
| --- | --- |
| [image: Edge offset 0] | [image: Edget offset 1024] |
| Edge Offset: 0 | Edge Offset: 1024 |

##### Effects

The **Effects** settings are a powerful sub-category of terrain carving settings. They provide controls to tweak the output and blending of a Water Body into the landscape terrain.

###### Blurring

The **Blurring** settings reduce artifacts that can occur during distance field generation. Such items come from aliasing due to texture resolution. A small amount of blurring is applied automatically, but you can increase or decrease the strength of the blurring by disabling **Blur Shape** and setting a custom **Radius**.

|  |  |
| --- | --- |
| [image: Blurring enabled] | [image: Blurring disabled] |
| Blurring Enabled (Default) | Blurring Disabled |

###### Curl Noise

The **Curl Noise** settings add procedural distortion to the Water Body's spline. It uses two octaves of curl noise, each with a separate tiling parameter and strength. By default, the curl noise is set to 0 and the effect is disabled.

The examples below have different **Curl Amounts** and **Curl Tiling** applied.

|  |  |
| --- | --- |
| [image: River water body without Curl noise.] | [image: River water body with Curl applied] |
| River Water Body without any Curl noise applied. | River Water Body with Curl 1 and Curl 2 |

**Smooth Blending**

The **Smooth Blending** provides smoothing parameters for the inner and outer edges of a Water Body, which is useful for seamlessly blending into nearby terrain for player navigation.

The example below shows the effect of an increased **Inner Smooth Distance** and **Outer Smooth Distance**.

|  |  |  |  |
| --- | --- | --- | --- |
| [image: No Smooth Blending] | [image: Inner Smooth Blending] | [image: Outer Smooth Blending] | [image: Inner and Outer Smooth Blending] |
| No Smooth Blending | Inner Smooth Blending | Outer Smooth Blending | Inner and Outer Smooth Blending |

**Terracing**

Terracing applies steps to the terrain area affected by a Water Body. Terracing can be masked to only occur a specified distance away from the water's edge using an alpha range. Terraces can also be blended from sharp to smooth.

Below is an example of various terracing values for smoothness, spacing, and masking working together.

 [image: Examples of different terracing values.]

You can use the **Mask Length** and **Mask Start Offset** to adjust where the terracing starts within the falloff area.

 [image: Terracing mask length and start offset.]

### Wave

The **Wave** section defines the waves of the selected Water Body. You can set the depth at which waves are attenuated, their max height bounds, and specify a Water Waves Asset used to drive Gerstner wave properties for a Water Body.

 [image: Water Body Wave settings]

The Wave category contains the following:

| Property | Description |
| --- | --- |
| **Wave Attenuation Water Depth** | The depth at which waves start to attenuate, or reduce their force. Waves attenuate the more shallow the water is, and this property determines how shallow the water must be for waves to start attenuating. A value of 0 makeswaves not attenuate based on depth. |
| **Max Wave Height Offset** | This value adds an offset to the automatically calculated max wave height bounds. This offset can help in cases where the automatically calculated max height bounds don't match your waves, like if the water surface is manually altered through the material with World Position Offset or some other means. |
| **Waves Source** | Provides a selection of algorithms for generating waves. The default algorithm is for Gerstner Waves. You can also assign a Water Wave Asset (-> simulating-waves-using-the-water-waves-asset-in-unreal-engine) with your own wave generator that replaces the Gerstner Waves source. |
| **Water Waves Asset** | Assign a custom Water Wave Asset (-> simulating-waves-using-the-water-waves-asset-in-unreal-engine) when **Waves Source** is set to `Water Waves Asset Reference`. |

### Rendering

The **Rendering** category is where all Materials are applied to the Water Body, such as the surface material and the underwater post-process material. This section also contains common rendering properties found on all Actors and Components.

 [image: Water Body Rendering settings]

The properties table below covers water-related properties.

Not all properties are displayed that fall under the **Rendering > Advanced** category. Only the ones directly related to water bodies.

| Property | Description |
| --- | --- |
| **Water Material** | The water material assigned to this Water Body. |
| **Underwater Post Process Settings** | The underwater post process material assigned to this Water Body. |
| **Water Info Material** | The material with which this water body renders into the Water Info Texture. |
| **Water LOD Material** | The material used by this water body when rendered as a Static Mesh. Only applies when the non-tessellated LOD is enabled on the Water Zone. |
| **Water Mesh Override** | Sets a custom mesh to be used instead of the water body's default mesh. |
| **Overlap Material Priority** | Determines which Water Body to use the material from when no transition material is assigned to either Water Body. Higher values are given greater precedence and valid ranges are -8192 to 8191. |
| **Custom Primitive Data Defaults** | Optional values for the custom primitive data of this primitive. These are user-defined. |
| **Visible** | Determines whether or not to completely draw the primitive. When false, the primitive is not drawn and does not cast a shadow. |
| **Actor Hidden in Game** | When enabled, the Actor is only rendered in the Editor and not while in the game. |
| **Editor Billboard Scale** | Sets the scale to apply to any billboard component in the Editor. |
| Advanced Properties |  |
| **Underwater Post Process Settings** | See Underwater Post Process Settings (-> water-body-actors-in-unreal-engine) below. |
| **Shape Dilation** | Distance by which to expand the water body geometry in the water info texture. This can help alleviate artifacts created by having low-resolution water information. |
| **Always Generate Water Mesh Tiles** | When true, the water mesh always generates tiles for this water body. For example, this can be useful to generate water tiles even when the water material is invalid, for the case where "empty" water tiles are actually desirable. |

Water Bodies have their own default surface material and underwater post-process materials already assigned. You can create your own water materials for use with Water Bodies, but we recommend that you use the default water material as a starting point.

River Water Bodies contain two additional material assignment slots for transition materials for **River to Lake** and **River to Ocean**. These transition materials enable the seamless blending of rivers into other Water Body types that it connects to.

 [image: Water Body Transitions Materials slots]

Below is an example of a River Water Body flowing into an Ocean Water Body with a transition material.

 [image: Water Body River transitions]

The **Overlap Material Priority** determines the priority given to that Water Body when it comes to generating water tiles. Higher valued priorities take precedence over others. When a Transition material is not applied to the River Water Body, this property is used to determine the precedence of the overlapping Water Body.

#### Underwater Post Process Settings

The **Underwater Post Process Settings** apply post-processing when the camera goes underwater.

 [image: Underwater Post Processing]

| Property | Description |
| --- | --- |
| **Enabled** | Determines whether or not to use underwater post-processing with this Water Body. If your game doesn't need to render underwater, this should be disabled. |
| **Priority** | Specifies the priority of this Water Body's underwater post-processing. In cases where water bodies overlap, the one with the highest priority overrides the lower priority ones. If two or more overlapping volumes have the same priority, the order is undefined. |
| **Blend Radius** | Sets the radius (in world units) around the water body used for blending. It creates a transitional area where the volume renders. |
| **Blend Weight** | The amount of influence this Water Body's underwater post process has. A value of 1 has a full effect.A value of 0 has no effect. |
| **Post Process Settings** | These settings define the look of your underwater post process. The underwater post process includes many of the settings found in the Post Process Volume. For property definitions and examples, see Post Process Effects (-> post-process-effects-in-unreal-engine). |

## Water Body Exclusion Volume

You can use Water Body Exclusion Volumes to create cavities in any kind of Water Body. This creates underwater zones where gameplay can act as if it was not underwater. For example, you could have an underwater base or tunnel where players can walk as normal.

Like Geometry Brushes (-> geometry-brush-actors-in-unreal-engine), these volumes can be placed using the **Place Actors** panel. You can edit their shapes when the Level Editor has its **Mode** set to **Brush Editing**.

For Water Body Exclusion Volumes to work, you must set which Water Bodies they must ignore by choosing **Exclude All Overlapping Water Bodies** or by adding them to the **Water Bodies to Exclude** array.

 [image: Water Body Exclusion properties]

| Property | Description |
| --- | --- |
| **Exclude All Overlapping Water Bodies** | This toggle excludes all Water Bodies from visually appearing within the bounds of the exclusion volume. It ensures that Water Data Queries fail so that the requested location is considered outside of the water for all Water Bodies. |
| **Water Bodies to Exclude** | An array listing of specified Water Bodies to exclude by this Water Body Exclusion Volume. It allows for all Water Data Queries to fail so the requested location is considered outside of the water for all listed Water Bodies. |

- materials
- water
- rendering
- physics
- water body
- oceans
- rivers
- lakes

On this page

- Types of Water Bodies (-> water-body-actors-in-unreal-engine)
- Ocean Water Body (-> water-body-actors-in-unreal-engine)
- Lake Water Body (-> water-body-actors-in-unreal-engine)
- River Water Body (-> water-body-actors-in-unreal-engine)
- Custom Water Body (-> water-body-actors-in-unreal-engine)
- Island Water Body (-> water-body-actors-in-unreal-engine)
- Water Body Properties (-> water-body-actors-in-unreal-engine)
- Selected Points (-> water-body-actors-in-unreal-engine)
- River Spline Visualization and Manipulation (-> water-body-actors-in-unreal-engine)
- Water (-> water-body-actors-in-unreal-engine)
- Terrain (-> water-body-actors-in-unreal-engine)
- Curve Settings (-> water-body-actors-in-unreal-engine)
- Water Heightmap Settings (-> water-body-actors-in-unreal-engine)
- Blend Mode (-> water-body-actors-in-unreal-engine)
- Falloff Settings (-> water-body-actors-in-unreal-engine)
- Effects (-> water-body-actors-in-unreal-engine)
- Blurring (-> water-body-actors-in-unreal-engine)
- Curl Noise (-> water-body-actors-in-unreal-engine)
- Wave (-> water-body-actors-in-unreal-engine)
- Rendering (-> water-body-actors-in-unreal-engine)
- Underwater Post Process Settings (-> water-body-actors-in-unreal-engine)
- Water Body Exclusion Volume (-> water-body-actors-in-unreal-engine)

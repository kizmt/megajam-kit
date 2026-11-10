# MaterialX Extensions

https://dev.epicgames.com/documentation/en-us/unreal-engine/materialx-extensions-in-unreal-engine?application_version=5.9

> Nodes definitions and custom attributes for using MaterialX in Unreal Engine.

[image: MaterialX Extensions]

The definitions of the MaterialX™ Extensions used in Unreal Engine (UE) can be found in `Engine/Binaries/ThirdParty/MaterialX/libraries/Interchange/Interchange_defs.mtlx`.

### Nodes Definitions

##### ND_ue_displacement_float

| Port | Description | Type | Default |
| --- | --- | --- | --- |
| displacement | Scalar displacement amount along the surface normal direction. | float | 0.0 |
| scale | Scale factor for the displacement vector. | float | 1.0 |
| bias | Bias factor for the displacement vector. | float | 0.0 |
| out | The computed displacement shader. | displacementshader |  |

#### Custom Attributes

##### AD_ue_displacement_attribute

Specify the values which should be respectively set in the Magnitude and Center in the shader's Displacement property:

`<attributedef name="AD_ue_displacement_attribute" attrname="ue_displacement_attribute" type="boolean" value="false" target="unrealengine" elements="displacementshader/scale, displacementshader/bias">`

UE extends MaterialX spec by adding the support for sparse_volume.

- **sparse_volume** : A Sparse Volume Texture (SVT) is a texture that stores texels (voxels) in a 3D data structure. You can index SVTs' data with three-dimensional UV coordinates, similar to 3D textures and volume textures.**file **(uniform filename): the URI of a static or animated sparse volume texture (SVT).
- **texcoord **(vector3) : 3D texture coordinates used to sample the sparse volume texture.
- **outA **: first texture output up to 4 RGBA channels, represented as Attributes A in the SVT.
- **outB** : second texture output up to 4 RGBA channels, represented as Attributes B in the SVT.

On this page

- Nodes Definitions (-> materialx-extensions-in-unreal-engine)
- ND_ue_displacement_float (-> materialx-extensions-in-unreal-engine)
- Custom Attributes (-> materialx-extensions-in-unreal-engine)
- AD_ue_displacement_attribute (-> materialx-extensions-in-unreal-engine)

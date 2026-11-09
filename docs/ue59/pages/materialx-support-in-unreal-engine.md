# MaterialX Support

https://dev.epicgames.com/documentation/en-us/unreal-engine/materialx-support-in-unreal-engine?application_version=5.9

> Settings and configurations support for using MaterialX in Unreal Engine.

[image: MaterialX Support]

The MaterialX™ format is an open standard for representing rich material and look-development content in computer graphics, enabling its platform-independent description and exchange across applications and renderers. The project is now open-source, hosted by the Academy Software Foundation, and is ongoing development.

MaterialX allows the description of materials through graphs. Those graphs are fully built using MaterialX nodes describing a surface or a volume shader, combined with or without predefined distribution functions (BXDFs).

For a MaterialX file to be correctly supported in Unreal Engine, each file must have at least one `surfacematerial` or `volumematerial` node as en entry point, connected to either a predefined `surfaceshader/volumeshader` (BXDF) node or their generic counterpart surface/volume described in the MaterialX PBR Lib spec.

The different BXDF and nodes supported in Unreal Engine (UE) are described in the next sections.

## Supported MaterialX version

Unreal Engine 5.8+ supports version 1.39.4 of the MaterialX specifications.

If you are using UE 5.7, the supported version is 1.39.3.

## Support of MaterialX Nodes

### Shading Model Examples

**Autodesk Standard Surface** and **USD Preview Surface** are supported with Substrate enabled or disable.

**OpenPBR Surface** is supported with Substrate enabled. However, if Substrate is disabled, the material functions of the StandardSurface are used.

**glTF Surface** is supported with Substrate enabled.

**Disney Principled BSDF** is not supported.

### MaterialX Physically Based Shading Nodes

|  |  |
| --- | --- |
| BSDF Nodes | All BSDF nodes are implemented as pass-through. None of their inputs are connected. |
| EDF Nodes | With the exception of `uniform_edf`, EDF nodes are implemented as pass-through, and none of their inputs are connected. |
| VDF Nodes | All VDF nodes are supported. |
| Utility Nodes (labeled in the PBR lib) | Supported: `surface`, `displacement`, `roughness_anisotropy`, `roughness_dual`, `glossiness_anisotropy`, `blackbody`, and `artistic_ior`.Supported with Substrate enabled:`add`, `layer`, `mix` and `multiply`. |

### MaterialX NPR Shading Nodes

`g18_rec709_to_lin_rec709`, `g22_rec709_to_lin_rec709`, `rec709_display_to_lin_rec709`, `acescg_to_lin_rec709`, `g22_ap1_to_lin_rec709`, `srgb_texture_to_lin_rec709`, `lin_adobergb_to_lin_rec709`, `adobergb_to_lin_rec709`, `srgb_displayp3_to_lin_rec709`, `lin_displayp3_to_lin_rec709` are supported.

The entire CM lib is supported.

### MaterialX CM Nodes (Color Transforms)

`viewdirection`, `facingratio` and g`ooch_shade` are supported.

### MaterialX Standard Nodes

#### Standard Source Nodes

**Types**: All MaterialX types are supported except for:

|  |  |  |
| --- | --- | --- |
| matrix33matrix44integerarrayfloatarray | color3arraycolor4arrayvector2arrayvector3array | vector4arraystringarraygeomnamearray |

All other input/output nodes listed below are supported, unless specified otherwise.

**Texture nodes**:

|  |  |
| --- | --- |
| image | filtertype (uniform string): unsupportedlayer (uniform string): unsupportedframerange (uniform string): unsupportedframeoffset (uniform string): unsupportedframeendaction (uniform string): unsupported |
| tiledimage (nodegraph) | filtertype (uniform string): unsupportedframerange (uniform string): unsupportedframeoffset (uniform string): unsupportedframeendaction (uniform string): unsupported |
| triplanarprojection (nodegraph) | filtertype (uniform string): unsupportedlayerx (uniform string): unsupportedlayery (uniform string): unsupportedlayerz (uniform string): unsupportedframerange (uniform string): unsupportedframeoffset (uniform string): unsupportedframeendaction (uniform string): unsupported |

**Procedural nodes**:

|  |
| --- |
| constantrandomfloatrandomcolor |

**Procedural2D nodes**:

|  |  |
| --- | --- |
| rampramp_gradientramplrramptbramp4splitlrsplittbnoise2d | cellnoise2dnoise2dworleynoise2djitter (float): unsupportedstyle (integer): only the distance to the cell center is supportedunifiednoise2dstyle (integer): only the distance to the cell center is supported |

 **Shape nodes** (same nodegroup as Procedural2D):

|  |  |
| --- | --- |
| checkerboardlinecirclecloverleafhexagon | gridcrosshatchtiledcirclestiledcloverleafstiledhexagons |

**Procedural3D nodes**:

|  |  |
| --- | --- |
| noise3dcellnoise3dfractal3d | worleynoise3djitter (float): unsupportedstyle (integer): only the distance to the cell center is supportedunifiednoise3dstyle (integer): only the distance to the cell center is supported |

**Math nodes**:

|  |  |  |
| --- | --- | --- |
| addsubtractmultiplydividemodulofractinvertabsvalfloorceilroundpowersafepowersincos | tanasinacosatan2sqrtlnexpsignclampminmaxnormalizemagnitudedistancedotproduct | crossproducttransformpointtransformvectortransformnormaltransformmatrix (unsupported)transpose (unsupported)determinant (unsupported)invertmatrix (unsupported)creatematrix (unsupported)normalmaprotate2drotate3dtrianglewavereflectRefract |

**Geometric nodes**:

|  |
| --- |
| positionnormaltangenttexcoordgeomcolorgeompropvalue : unsupported, see Geompropvalue section for further explanationgeompropvalueuniform : unsupported |

**Application nodes**:

|  |
| --- |
| timeframe : unsupported |

**Adjustment Nodes**:

|  |  |
| --- | --- |
| remapsmoothstepluminance**lumacoeffs **only supported as a uniform value set in the details panelrgbtohsvhsvtorgb | contrastrangehsvadjustsaturate**lumacoeffs** only supported as a uniform value set in the details panelcolorcorrect |

**Compositing nodes**:

|  |  |
| --- | --- |
| premultunpremultplusminusdifferenceburndodgescreenoverlay | disjointoverinmaskmatteoutoverinsideoutside |

**Mix nodes**:

|  |
| --- |
| All mix operations are supported except for displacementshader types |

**Conditional Nodes**:

|  |
| --- |
| ifgreaterifgreatereqifequalswitch |

Channel nodes:

|  |  |
| --- | --- |
| convert : all conversion operations are supported, conversion to a surfaceshader creates a **surfaceunlit **materialcombine2combine3combine4 | extractseparate2separate3separate4 |

**Convolution nodes**:

|  |
| --- |
| blurSize is inconsistent when zooming in the viewport, as stated here.heighttonormal If the direct input is an **image** node, then the `NormalFromHeight`map material function is used. Otherwise, `HeightToNormalSmooth` material function is used.andorxornot |

**Organization nodes**:

|  |
| --- |
| **dot** : not to be confused with `dotproduct`, this node acts as a noop. |

#### Geompropvalues

For MaterialX standalone files, `geompropvalues` are not supported, unless if the type is a vector2 and the name is “**st**” following USD standard, then the node is converted to a texcoord node.

For MaterialX shader model embedded into USD, `geompropvalues` are linked to their USD counterpart “**primvar**” then are baked into texture and converted to an <image> node.

#### Standard Shader Nodes

All nodes are supported.

General nodes are used when the MaterialX file does not use one of the predefined BXDFs.

- [image: Importing MaterialX Files] Importing MaterialX FilesWorkflows for importing MaterialX files into Unreal Engine. (-> importing-materialx-files-in-unreal-engine)
- [image: MaterialX Extensions] MaterialX ExtensionsNodes definitions and custom attributes for using MaterialX in Unreal Engine. (-> materialx-extensions-in-unreal-engine)

On this page

- Supported MaterialX version (-> materialx-support-in-unreal-engine)
- Support of MaterialX Nodes (-> materialx-support-in-unreal-engine)
- Shading Model Examples (-> materialx-support-in-unreal-engine)
- MaterialX Physically Based Shading Nodes (-> materialx-support-in-unreal-engine)
- MaterialX NPR Shading Nodes (-> materialx-support-in-unreal-engine)
- MaterialX CM Nodes (Color Transforms) (-> materialx-support-in-unreal-engine)
- MaterialX Standard Nodes (-> materialx-support-in-unreal-engine)
- Standard Source Nodes (-> materialx-support-in-unreal-engine)
- Geompropvalues (-> materialx-support-in-unreal-engine)
- Standard Shader Nodes (-> materialx-support-in-unreal-engine)

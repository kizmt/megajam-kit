# Material Expressions Reference

https://dev.epicgames.com/documentation/en-us/unreal-engine/unreal-engine-material-expressions-reference?application_version=5.9

> Reference for all Material expressions available for use in the Material Editor.

[image: Material Expressions Reference]

This page is a reference index for all **Material expression** nodes available in the Material Editor (-> unreal-engine-material-editor-user-guide). Material Expressions are the building blocks for creating fully functional Materials in Unreal Engine.

Each Material expression is a self-contained black box that either outputs a set of one or more specific values, or performs a single operation on one or more inputs and then outputs the results of that operation.

## Parameters

Certain Material expressions are parameters, meaning you can modify their values (dynamically during runtime in some cases) in a Material Instance (-> instanced-materials-in-unreal-engine) of the base material containing the parameter.

You should assign all parameters a unique name using the **Parameter Name** details property. This name is used to identify each specific parameter when you edit an instance in the Material Instance Editor (-> unreal-engine-material-instance-editor-ui).

If two parameters of the same type have the same name within a Material, they are treated as the same parameter. Changing the value of one parameter in the Material Instance would change the value of both parameter expressions in the Material. You can set a default value for your parameters in the Details Panel. This default value is used in the Material Instance unless it is overridden and modified there.

## Material Expression Properties

All Material Expression nodes contain the same properties that provide different kinds of information. Below, we use a Texture Sample node to highlight these
on properties.

[image: Material Expression breakdown]

| Number | Property Name | Description |
| --- | --- | --- |
| 1 | Description | All materials expressions have a common **Desc** (Description) property, which is accessible from the Details Panel. Any text entered into this in this property displays in the Material Editor just above the expression in the workspace. It can be used for any purpose, but usually serves as a good way to leave short notes about the purpose or function of the expression. |
| 2 | Title bar | Displays the name and/or pertinent information about the the Material Expression. |
| 3 | Inputs | Links to any values used by the Material Expression. |
| 4 | Outputs | Links that output the results of the Material Expression operation. |
| 5 | Preview | Displays a preview of the values that are output by the Material Expression. This updates automatically when realtime update is enabled and can be manually updated using the Spacebar. |

### Material Expression Types

These reference pages are organized according to the categories in the Material Editor palette.

- [image: Atmosphere Material Expressions] Atmosphere Material ExpressionsMaterial Expressions that affect fog and other atmospheric level effects. (-> atmosphere-material-expressions-in-unreal-engine)
- [image: Color Material Expressions] Color Material ExpressionsMaterial expressions that perform actions on color inputs. (-> color-material-expressions-in-unreal-engine)
- [image: Constant Material Expressions] Constant Material ExpressionsMaterial Expressions whose outputs generally do not change once set in the Editor or when play begins. (-> constant-material-expressions-in-unreal-engine)
- [image: Coordinates Material Expressions] Coordinates Material ExpressionsExpressions that perform actions on texture coordinates or output values that can be used as, or to modify, texture coordinates. (-> coordinates-material-expressions-in-unreal-engine)
- [image: Custom Material Expressions] Custom Material ExpressionsMaterial expressions that allow the use of custom, plain shader code. (-> custom-material-expressions-in-unreal-engine)
- [image: Depth Material Expressions] Depth Material ExpressionsMaterial expressions that deal with depth of the pixel being rendered. (-> depth-material-expressions-in-unreal-engine)
- [image: Font Material Expressions] Font Material ExpressionsMaterial Expressions that sample and output font assets. (-> font-material-expressions-in-unreal-engine)
- [image: Material Function Expressions] Material Function ExpressionsMaterial expressions that are used to create or execute Materials Functions. (-> material-function-expressions-in-unreal-engine)
- [image: Landscape Material Expressions] Landscape Material ExpressionsMaterial expressions for creating Materials apply to Landscape terrains. (-> landscape-material-expressions-in-unreal-engine)
- [image: Material Attributes Expressions] Material Attributes ExpressionsThese expression nodes serve as a way to separate or combine various Material attributes, which is particularly useful when creating Layered Materials. (-> material-attributes-expressions-in-unreal-engine)
- [image: Math Material Expressions] Math Material ExpressionsExpressions that perform mathematical operations on one or more inputs. (-> math-material-expressions-in-unreal-engine)
- [image: Material Parameter Expressions] Material Parameter ExpressionsExpressions that expose properties to Material Instances to be overridden in child instances or modified at runtime. (-> material-parameter-expressions-in-unreal-engine)
- [image: Particle Material Expressions] Particle Material ExpressionsExpressions used for creating Materials for emitters in Particle Systems. (-> particle-material-expressions-in-unreal-engine)
- [image: Texture Material Expressions] Texture Material ExpressionsExpressions that sample and output textures. (-> texture-material-expressions-in-unreal-engine)
- [image: Utility Material Expressions] Utility Material ExpressionsMaterial expressions that perform various utility operations on one or more inputs. (-> utility-material-expressions-in-unreal-engine)
- [image: Vector Material Expressions] Vector Material ExpressionsMaterial expressions that output a vector value, such as a position or normal. (-> vector-material-expressions-in-unreal-engine)
- [image: Vector Operation Material Expressions] Vector Operation Material ExpressionsMaterial Expressions that perform operations on vector input values. (-> vector-operation-material-expressions-in-unreal-engine)

## Expression Index

This is a reference list of many, but not all, Material Expressions. All links shown here can also be accessed through the Expression Types pages listed above.
Additionally, you can use **Ctrl+F** to find the expression node you need and follow the link to its description.

Atmosphere (-> atmosphere-material-expressions-in-unreal-engine)

- AtmosphericFogColor (-> atmosphere-material-expressions-in-unreal-engine)

Color (-> color-material-expressions-in-unreal-engine)

- Desaturation (-> color-material-expressions-in-unreal-engine)

Constants (-> constant-material-expressions-in-unreal-engine)

- Constant (-> constant-material-expressions-in-unreal-engine)
- Constant2Vector (-> constant-material-expressions-in-unreal-engine)
- Constant3Vector (-> constant-material-expressions-in-unreal-engine)
- Constant4Vector (-> constant-material-expressions-in-unreal-engine)
- DistanceCullFade (-> constant-material-expressions-in-unreal-engine)
- PerInstanceFadeAmount (-> constant-material-expressions-in-unreal-engine)
- PerInstanceRandom (-> constant-material-expressions-in-unreal-engine)
- Time (-> constant-material-expressions-in-unreal-engine)
- TwoSidedSign (-> constant-material-expressions-in-unreal-engine)
- VertexColor (-> constant-material-expressions-in-unreal-engine)

Coordinates (-> coordinates-material-expressions-in-unreal-engine)

- ActorPositionWS (-> coordinates-material-expressions-in-unreal-engine)
- CameraPositionWS (-> coordinates-material-expressions-in-unreal-engine)
- LightmapUVs (-> coordinates-material-expressions-in-unreal-engine)
- ObjectOrientation (-> coordinates-material-expressions-in-unreal-engine)
- ObjectPositionWS (-> coordinates-material-expressions-in-unreal-engine)
- ObjectRadius (-> coordinates-material-expressions-in-unreal-engine)
- Panner (-> coordinates-material-expressions-in-unreal-engine)
- ParticlePositionWS (-> coordinates-material-expressions-in-unreal-engine)
- PixelNormalWS (-> coordinates-material-expressions-in-unreal-engine)
- Rotator (-> coordinates-material-expressions-in-unreal-engine)
- SceneTexelSize (-> coordinates-material-expressions-in-unreal-engine)
- ScreenPosition (-> coordinates-material-expressions-in-unreal-engine)
- TextureCoordinate (-> coordinates-material-expressions-in-unreal-engine)
- VertexNormalWS (-> coordinates-material-expressions-in-unreal-engine)
- ViewSize (-> coordinates-material-expressions-in-unreal-engine)
- WorldPosition (-> coordinates-material-expressions-in-unreal-engine)

Custom (-> custom-material-expressions-in-unreal-engine)

- Custom (-> custom-material-expressions-in-unreal-engine)

Depth (-> depth-material-expressions-in-unreal-engine)

- DepthFade (-> depth-material-expressions-in-unreal-engine)
- PixelDepth (-> depth-material-expressions-in-unreal-engine)
- SceneDepth (-> depth-material-expressions-in-unreal-engine)

Font (-> font-material-expressions-in-unreal-engine)

- FontSample (-> font-material-expressions-in-unreal-engine)
- FontSampleParameter (-> font-material-expressions-in-unreal-engine)

Functions (-> material-function-expressions-in-unreal-engine)

- FunctionInput (-> material-function-expressions-in-unreal-engine)
- FunctionOutput (-> material-function-expressions-in-unreal-engine)
- MaterialFunctionCall (-> material-function-expressions-in-unreal-engine)
- StaticBool (-> material-function-expressions-in-unreal-engine)
- StaticSwitch (-> material-function-expressions-in-unreal-engine)
- TextureObject (-> material-function-expressions-in-unreal-engine)

MaterialAttributes (-> material-attributes-expressions-in-unreal-engine)

- BreakMaterialAttributes (-> material-attributes-expressions-in-unreal-engine)
- MakeMaterialAttributes (-> material-attributes-expressions-in-unreal-engine)

Math (-> math-material-expressions-in-unreal-engine)

- Abs (-> math-material-expressions-in-unreal-engine)
- Add (-> math-material-expressions-in-unreal-engine)
- AppendVector (-> math-material-expressions-in-unreal-engine)
- Ceil (-> math-material-expressions-in-unreal-engine)
- Clamp (-> math-material-expressions-in-unreal-engine)
- ComponentMask (-> math-material-expressions-in-unreal-engine)
- Cosine (-> math-material-expressions-in-unreal-engine)
- CrossProduct (-> math-material-expressions-in-unreal-engine)
- Divide (-> math-material-expressions-in-unreal-engine)
- DotProduct (-> math-material-expressions-in-unreal-engine)
- Floor (-> math-material-expressions-in-unreal-engine)
- Fmod (-> math-material-expressions-in-unreal-engine)
- Frac (-> math-material-expressions-in-unreal-engine)
- If (-> math-material-expressions-in-unreal-engine)
- LinearInterpolate (-> math-material-expressions-in-unreal-engine)
- Multiply (-> math-material-expressions-in-unreal-engine)
- Normalize (-> math-material-expressions-in-unreal-engine)
- OneMinus (-> math-material-expressions-in-unreal-engine)
- Power (-> math-material-expressions-in-unreal-engine)
- Sine (-> math-material-expressions-in-unreal-engine)
- SquareRoot (-> math-material-expressions-in-unreal-engine)
- Subtract (-> math-material-expressions-in-unreal-engine)

******Parameters (-> material-parameter-expressions-in-unreal-engine)**

- CollectionParameters (-> material-parameter-expressions-in-unreal-engine)
- DynamicParameter (-> material-parameter-expressions-in-unreal-engine)
- FontSampleParameter (-> material-parameter-expressions-in-unreal-engine)
- ScalarParameter (-> material-parameter-expressions-in-unreal-engine)
- StaticBoolParameter (-> material-parameter-expressions-in-unreal-engine)
- StaticSwitchParameter (-> material-parameter-expressions-in-unreal-engine)
- StaticComponentMaskParameter (-> material-parameter-expressions-in-unreal-engine)
- VectorParameter (-> material-parameter-expressions-in-unreal-engine)
- TextureObjectParameter (-> material-parameter-expressions-in-unreal-engine)
- TextureSampleParameter2D (-> material-parameter-expressions-in-unreal-engine)
- TextureSampleParameterSubUV (-> material-parameter-expressions-in-unreal-engine)
- TextureSampleParameterCube (-> material-parameter-expressions-in-unreal-engine)
- TextureSampleParameterMovie (-> material-parameter-expressions-in-unreal-engine)

Particles (-> particle-material-expressions-in-unreal-engine)

- DynamicParameter (-> particle-material-expressions-in-unreal-engine)
- ParticleColor (-> particle-material-expressions-in-unreal-engine)
- ParticleDirection (-> particle-material-expressions-in-unreal-engine)
- ParticleMacroUV (-> particle-material-expressions-in-unreal-engine)
- ParticleMotionBlurFade (-> particle-material-expressions-in-unreal-engine)
- ParticlePositionWS (-> particle-material-expressions-in-unreal-engine)
- ParticleRadius (-> particle-material-expressions-in-unreal-engine)
- ParticleRelativeTime (-> particle-material-expressions-in-unreal-engine)
- ParticleSize (-> particle-material-expressions-in-unreal-engine)
- ParticleSpeed (-> particle-material-expressions-in-unreal-engine)
- SphericalParticleOpacity (-> particle-material-expressions-in-unreal-engine)
- ParticleSubUV (-> particle-material-expressions-in-unreal-engine)
- TextureSampleParameterSubUV (-> particle-material-expressions-in-unreal-engine)

******Terrain (-> landscape-material-expressions-in-unreal-engine)**

- LandscapeLayerBlend (-> landscape-material-expressions-in-unreal-engine)
- LandscapeLayerCoords (-> landscape-material-expressions-in-unreal-engine)
- LandscapeLayerSwitch (-> landscape-material-expressions-in-unreal-engine)

Texture (-> texture-material-expressions-in-unreal-engine)

- FontSample (-> texture-material-expressions-in-unreal-engine)
- FontSampleParameter (-> texture-material-expressions-in-unreal-engine)
- SceneColor (-> texture-material-expressions-in-unreal-engine)
- TextureObject (-> texture-material-expressions-in-unreal-engine)
- TextureSample (-> texture-material-expressions-in-unreal-engine)

******Utility (-> utility-material-expressions-in-unreal-engine)**

- AntialiasedTextureMask (-> utility-material-expressions-in-unreal-engine)
- BlackBody (-> utility-material-expressions-in-unreal-engine)
- BumpOffset (-> utility-material-expressions-in-unreal-engine)
- ConstantBiasScale (-> utility-material-expressions-in-unreal-engine)
- DDX (-> utility-material-expressions-in-unreal-engine)
- DDY (-> utility-material-expressions-in-unreal-engine)
- DepthFade (-> utility-material-expressions-in-unreal-engine)
- DepthOfFieldFunction (-> utility-material-expressions-in-unreal-engine)
- Desaturation (-> utility-material-expressions-in-unreal-engine)
- Distance (-> utility-material-expressions-in-unreal-engine)
- DistanceFieldGradient (-> utility-material-expressions-in-unreal-engine)
- DistanceToNearestSurface (-> utility-material-expressions-in-unreal-engine)
- FeatureLevelSwitch (-> utility-material-expressions-in-unreal-engine)
- Fresnel (-> utility-material-expressions-in-unreal-engine)
- LightmassReplace (-> utility-material-expressions-in-unreal-engine)
- LinearInterpolate (-> utility-material-expressions-in-unreal-engine)
- Noise (-> utility-material-expressions-in-unreal-engine)
- Previous Frame Switch (-> utility-material-expressions-in-unreal-engine)
- QualitySwitch (-> utility-material-expressions-in-unreal-engine)
- RotateAboutAxis (-> utility-material-expressions-in-unreal-engine)
- SphereMask (-> utility-material-expressions-in-unreal-engine)
- Thin Translucent
- Vector Noise (-> utility-material-expressions-in-unreal-engine)

VectorOps (-> vector-operation-material-expressions-in-unreal-engine)

- AppendVector (-> vector-operation-material-expressions-in-unreal-engine)
- ComponentMask (-> vector-operation-material-expressions-in-unreal-engine)
- CrossProduct (-> vector-operation-material-expressions-in-unreal-engine)
- DeriveNormalZ (-> vector-operation-material-expressions-in-unreal-engine)
- DotProduct (-> vector-operation-material-expressions-in-unreal-engine)
- Normalize (-> vector-operation-material-expressions-in-unreal-engine)
- Transform (-> vector-operation-material-expressions-in-unreal-engine)
- TransformPosition (-> vector-operation-material-expressions-in-unreal-engine)

Vectors (-> vector-material-expressions-in-unreal-engine)

- ActorPositionWS (-> vector-material-expressions-in-unreal-engine)
- CameraPositionWS (-> vector-material-expressions-in-unreal-engine)
- CameraVectorWS (-> vector-material-expressions-in-unreal-engine)
- Constant2Vector (-> vector-material-expressions-in-unreal-engine)
- Constant3Vector (-> vector-material-expressions-in-unreal-engine)
- Constant4Vector (-> vector-material-expressions-in-unreal-engine)
- LightVector (-> vector-material-expressions-in-unreal-engine)
- ObjectBounds (-> vector-material-expressions-in-unreal-engine)
- ObjectOrientation (-> vector-material-expressions-in-unreal-engine)
- ObjectPositionWS (-> vector-material-expressions-in-unreal-engine)
- ParticlePositionWS (-> vector-material-expressions-in-unreal-engine)
- PixelNormalWS (-> vector-material-expressions-in-unreal-engine)
- ReflectionVectorWS (-> vector-material-expressions-in-unreal-engine)
- VertexNormalWS (-> vector-material-expressions-in-unreal-engine)

- materials
- shaders
- material expressions

On this page

- Parameters (-> unreal-engine-material-expressions-reference)
- Material Expression Properties (-> unreal-engine-material-expressions-reference)
- Material Expression Types (-> unreal-engine-material-expressions-reference)
- Expression Index (-> unreal-engine-material-expressions-reference)

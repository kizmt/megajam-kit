# Font Material Expressions

https://dev.epicgames.com/documentation/en-us/unreal-engine/font-material-expressions-in-unreal-engine?application_version=5.9

> Material Expressions that sample and output font assets.

[image: Font Material Expressions]

## FontSample

The **FontSample** expression enables you to sample the texture pages out of a font resource as regular 2D textures. The alpha channel of the font will contain the font outline value. Only valid font pages can be specified.

| Item | Description |
| --- | --- |
| Properties |  |
| **Font** | Holds the default font asset (from the **Content Browser**) to be held within the expression. |
| **Font Texture Page** | The current font texture page to be used as a part of the texture. |

 [image: Font Sample Material Expression]

## FontSampleParameter

The **FontSampleParameter** expression provides a way to expose a font-based parameter in a Material Instance Constant, making it easy to use different fonts in different instances. The alpha channel of the font will contain the font outline value. Only valid font pages can be specified.

| Item | Description |
| --- | --- |
| Properties |  |
| **Parameter Name** | Specifies the name used to identify the parameter in instances of the Material and through code. |
| **Group** | Provides a way to organize parameter names into groups, or categories, within a MaterialInstanceConstant. All parameters within a Material that have the same Group property name will be listed underneath that category in the Instance Editor. |
| **Font** | Holds the default font asset (from the **Content Browser**) to be held within the expression. |
| **Font Texture Page** | The current font texture page to be used as a part of the texture. |

 [image: Font Sample Parameter]

- materials
- shaders

On this page

- FontSample (-> font-material-expressions-in-unreal-engine)
- FontSampleParameter (-> font-material-expressions-in-unreal-engine)

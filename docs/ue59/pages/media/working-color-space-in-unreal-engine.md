# Working Color Space

https://dev.epicgames.com/documentation/en-us/unreal-engine/working-color-space-in-unreal-engine?application_version=5.9

> An overview of Working Colour Space in Unreal Engine

[image: Working Color Space]

Working Color Space lets you define the color space of the Unreal Engine(UE) Renderer. You can change the color space of the UE Renderer if you are working with textures created in a different color space, or to work in a specific color space for the display you are using.

[image: image alt text]

Unreal Engine defaults to sRBG/REC709 but you can choose to use another color space from the provided list, or you can define a custom color space using chromaticity coordinates.

To adjust the Working Color Space:

- Navigate to **Edt > Project Settings > Rendering > Working Color Space. **
- Select the Working Color Space dropdown and choose the color space you want to use for your project.

[image: image alt text]

Unreal Engine supports the following color spaces:

| Color Space | Description |
| --- | --- |
| sRGB / Rec709 | sRGB / Rec uses the parameter values for the HDTV standards for production and international programme exchange from the International Telecommunication Union (ITU). |

For more information, refer to the ITU parameter values |

|  |  |
| --- | --- |
| Rec2020 | Rec2020 uses the** **parameter values for ultra-high definition television systems for production and international programme exchange from the ITU. |

For more information, refer to the ITU parameter values |

|  |  |
| --- | --- |
| ACES AP0 | For more information about the ACES color spaces, refer to the Academy Color Encoding Specification documentation |
| ACES AP1 / ACEScg |  |
| P3DCI | For more information about the P3DCI color space, refer to the International Color Consortium website |
| P3D65 | For more information about the P3DCI color space, refer to the International Color Consortium website |
| Custom | To use a custom color space, enter the Red, Green, Blue and White Chromaticity coordinate values that you want to use for your custom color space. |

## Texture Settings: Input Conversions

- (Advanced) Source Color SettingsColor SpaceWhen the Color Space is set to None (default), no conversions are applied.
- When the Color Space is manually specified, conversions to the working color space are automatically applied when the texture is serialized. If the working color space is changed, textures are automatically re-serialized with the updated conversion.

- Encoding OverrideSource encoding of the texture, exposing more options than just sRGB.
- Note: This differs from the sRGB checkbox, which specifies the stored encoding of the texture resource in the engine.

[image: image alt text]

On this page

- Texture Settings: Input Conversions (-> working-color-space-in-unreal-engine)

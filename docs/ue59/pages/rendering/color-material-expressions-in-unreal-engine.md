# Color Material Expressions

https://dev.epicgames.com/documentation/en-us/unreal-engine/color-material-expressions-in-unreal-engine?application_version=5.9

> Material expressions that perform actions on color inputs.

[image: Color Material Expressions]

## Desaturation

The **Desaturation** expression desaturates its input, or converts the colors of its input into shades of gray, based a certain percentage.

| Item | Description |
| --- | --- |
| Properties |  |
| **Luminance Factors** | Specifies the amount that each channel contributes to the desaturated color. This is what controls that green is brighter than red which is brighter than blue when desaturated. |
| Inputs |  |
| **Fraction** | Specifies the amount of desaturation to apply to the input. Percent can range from 0.0(full original color, no desaturation) to 1.0 (fully desaturated). |

[image: Desaturation Material Expression]

**Programmers:** Define desaturated color `D`, input color `I` and luminance factor `L`. The output will be `O = (1 - Percent)*( D.dot( I )) + Percent * I`

- materials
- shaders

On this page

- Desaturation (-> color-material-expressions-in-unreal-engine)

# Font Materials and Outlines

https://dev.epicgames.com/documentation/en-us/unreal-engine/font-materials-and-outlines-in-unreal-engine?application_version=5.9

> Examples of how you can style your UMG fonts using colors, Materials, and outlines.

[image: Font Materials and Outlines]

In addition to being able to set a **Color and Opacity** for your **Font** in UMG, you can also use Materials and font outlines for additional **Font** styling.

## Font Colors

You can set the **Vertex Color** for your **Font** by setting its **Color and Opacity**.

 [image: Set the Font Color and Opacity]

Without a **Font Material** specified, this will apply a solid color to your text.

 [image: Example of the Font Block without a Font Material specified]

## Font Materials

You can specify a **Font Material** for your **Font** in the **Details** panel.

 [image: Set Font Material]

If your **Font Material** doesn't have a **Vertex Color** node, the effect is like a simple multiplication.

|  |  |  |
| --- | --- | --- |
|  | [image: Base Color material preview] | [image: Example of the Font Block with a Base Color node] |
| Font Material Setup | Font Material Preview | Final Font |

However, if you place a **Vertex Color** node in your **Font Material**, you can use its outputs to do math within your shader.

|  |  |  |
| --- | --- | --- |
|  | [image: Vertex Red Color material preview] | [image: Example of the Font Block with a Vertex Red Color node] |
| Font Material Setup | Font Material Preview | Final Font |

Materials used as font materials must be in the **User Interface** domain.

 [image: Set Material Domain to UI]

## Font Outlines

You can specify a different **Outline Color** as well as a different Material to use for a font outline.

 [image: Set the Font Outline Settings]

The size of the outline is specified in Slate units, but when the font's scale is 1.0, 1 Slate unit is equivalent to 1 pixel.

 [image: Example of the Font Block with Outline]

One interesting note is that you can specify whether or not to use **Separate Fill Alpha**.

 [image: Separate Fill Alpha option]

When this is enabled, the outline is translucent
where the filled area will be, allowing you to adjust the alphas of the font and the font outline independently. When it is disabled, the font is overlaid
on the outline, so the alphas are additive and the outline color and Material is visible through a font with an alpha less than 1.

 [image: Font Color Alpha = 0.5, Separate Fill Alpha disabled]

 [image: Font Color Alpha = 0.5, Separate Fill Alpha enable]

- ui
- umg ui designer
- fonts

On this page

- Font Colors (-> font-materials-and-outlines-in-unreal-engine)
- Font Materials (-> font-materials-and-outlines-in-unreal-engine)
- Font Outlines (-> font-materials-and-outlines-in-unreal-engine)

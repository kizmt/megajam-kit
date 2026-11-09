# Using Look-up Tables for Color Grading

https://dev.epicgames.com/documentation/en-us/unreal-engine/using-lookup-tables-for-color-grading-in-unreal-engine?application_version=5.9

> Using look-up tables for color grading.

[image: Using Look-up Tables for Color Grading]

A **Lookup Table** (LUT) can be used to achieve color correction using a Post Process Volume. Instead of using three one-dimensional (1D) lookup tables, a single three-dimensional (3D) Lookup Table is used. This offers
more sophisticated color transformation, which can be used for something like desaturation.

|  |  |
| --- | --- |
| [image: Neutral LUT] | [image: Sepia Tone LUT] |
| Color Neutral LUT | Sepia Toned LUT |

A Lookup Table used in Unreal Engine is a 16x16x16 color neutral LUT unwrapped to a 256x16 texture. These examples show a color neutral and a sepia toned one. If you were to apply the neutral LUT, you wouldn't see any changes to a default scene, however, if you used the sepia toned one, you'd get something like this:

 [image: Color Neutral LUT]

 [image: Sepia Tone LUT]

## Using a LUT Texture

To make use of a LUT, use the following properties to assign the LUT texture to the Post Process Volume you want to use it with and adjust its intensity.

| Property | Description |
| --- | --- |
| **Color Grading LUT Intensity** | A scaling factor that controls the effect of the color correction. |
| **Color Grading LUT** | The LUT texture to use as a lookup table for color correction. See below for examples. (-> using-lookup-tables-for-color-grading-in-unreal-engine) |

#### Color Grading LUT

|  |  |  |
| --- | --- | --- |
| [image: Natural Scene]Click image for full size. | [image: Greenish Scene]Click image for full size. | [image: Reddish Scene]Click image for full size. |
| [image: Neutral LUT] | [image: Greenish LUT] | [image: Reddish LUT] |

## Creating Your Own LUT Texture

To create your own LUT texture, you'll first need an image editing application (like Photoshop or GIMP) that can make color adjustments to a captured image. For this demonstration,
the **Sun Temple** project available in the Epic Games Launcher via the **Learn** tab will be used, and Photoshop will be the application of choice for the LUT image editing. Some terms may be specific
to Photoshop in this example.

- Start by taking at least one screenshot that is representative of your scene that you want to apply color correction too. You can use the Screenshot Tool available in the Editor to capture a high-resolution image of your scene.
- Open the screenshot in Photoshop and proceed to add your own **Adjustment** layers from the Adjustments tab located above the Layers panel on the right. Here you'll find many different icons that represent the various types of changes you can make to your images, such as brightness and contrast, hue, saturation, and many others.Click image for full size.
- From the **Adjustments** panel, click any of the icons to add a layer to the Layers panel. You can use these to make specific color corrections to the final image. For this example, **Vibrance** and **Brightness/Contrasts** have been added and adjusted. Once these are added to your Layers panel, select them from the list to expose their properties, or if these aren't visible, you can right-click and choose **Edit Adjustment** to expose them.
- Any adjustments you make will be visible in the viewport. Adjust the properties of the Adjustment layers until you get the color correction you desire. In the example below, the adjustments for Vibrance and Brightness/Contrast have been adjusted to give the captured screenshot more color saturation and definition for visual appeal. [image: Before] [image: After]
- Now that you've achieved your desired look with the Adjustment layers, you'll need to open a copy of the **Neutral Color LUT** on its own. The adjustment layers that were created for your screenshot can be dragged onto the neutral color LUT.If you do not have a Neutral Color LUT available to use, you can use the RGBTable16x1.png image shown in the introduction to this page. * LUT Texture Example Zip File Right-click and **Save as**.With your Screenshot with the adjustment layers and the Neutral Color LUT opened, **drag and drop** the Adjustment layers from your Screenshot Layers panel onto the Neutral Color LUT image. You should now see them populate in the LUT's Layer panel.
- Now, navigate to **File** > **Save As** and give your LUT with the color corrections a name.
- Import your color corrected LUT into the Editor using the **drag and drop** method into the Content Browser or by using the **Import** button that is also available in the Content Browser.
- For the best results using your LUT in a Post Process Volume, open the LUT image in the Texture Editor and set the following properties: |  |  |
| --- | --- |
|  | Mip Gen Settings: **NoMipMaps**Texture Group: **Color Lookup Table** |
- Next, in the Post Process Volume, use the **Details** panel and under the **Color Grading** > **Global** section, enable **Color Grading LUT** and apply your LUT. |  |  |
| --- | --- |
|  | [image: Default] [image: With Created LUT] |

## Additional Notes

The following are some things you should be aware of when using LUTs in your projects:

- Since LUTs happen in Low Dynamic Range (LDR) and on the final image color that was output to the monitor in sRGB space, this means that it's just a snapshot in time for what display support is and will not necessarily look the same on any display its output to, unlike High Dynamic Range (-> high-dynamic-range-display-output-in-unreal-engine) (HDR) which is processed so that any color correction happens before tone mapping. For this reason, it is recommended to use the latest Color Grading (-> color-grading-and-the-filmic-tonemapper-in-unreal-engine) color correction tools available in Unreal Engine 4.16 and later in place of using LUTs.
- LUTs can be a good way to quickly target a particular look for your project on your current display but then you should make final adjustments using the color correction properties found under the **Color Grading** section of the Post Process Volume to guarantee the look is consistent across different types of displays.
- Consistency is lost when using a LUT because any color corrections that have taken place will not work for an HDR display. The color grading properties in the Post Process Volume all operate in what is referred to as **Scene Referred Linear Space**. It means that the colors are consistent because they happen before tone mapping and before they are transformed into a particular display's color space. For example, if you wanted to output to a tv that uses Rec709 instead of sRGB, the color corrections would not carry over if using a LUT since color correction happens after the image has already been output to the display. For this reason, LUTs are being moved away from as a way of doing color correction image processing.

- rendering
- lighting
- post process

On this page

- Using a LUT Texture (-> using-lookup-tables-for-color-grading-in-unreal-engine)
- Color Grading LUT (-> using-lookup-tables-for-color-grading-in-unreal-engine)
- Creating Your Own LUT Texture (-> using-lookup-tables-for-color-grading-in-unreal-engine)
- Additional Notes (-> using-lookup-tables-for-color-grading-in-unreal-engine)

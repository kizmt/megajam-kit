# Refraction Using Pixel Normal Offset

https://dev.epicgames.com/documentation/en-us/unreal-engine/refraction-using-pixel-normal-offset-in-unreal-engine?application_version=5.9

> Overview of the Refraction Mode for Pixel Normal Offset in your Materials.

[image: Refraction Using Pixel Normal Offset]

By default, Unreal Engine uses a physically based refraction model derived from **Index of Refraction** values. The physical **Index of Refraction** model mimics the way light rays refract as they transfer between mediums. This works well for small objects, like jars, glasses, and other curved surfaces. However, when used with large flat surfaces it can produce unpredictable results and artifacts as the scene color is being read from off screen.

**Pixel Normal Offset** is an alternative Refraction Mode available in the Material Editor (-> unreal-engine-material-editor-user-guide). It uses the vertex normal as a reference and then computes the refraction offset by calculating how different the per-pixel normal is from the vertex normal. This is useful for large flat surfaces, like water, where you do not want a constant offset that is reading data from off screen.

## Physical vs Non-Physical Refraction Model

You can change the **Refraction Mode** of your Material in the Details Panel. Scroll down and expand the **Refraction** section, and then choose between the two options in the Refraction Mode drop-down. All Materials use **Index of Refraction** by default.

For additional information about the physical model of refraction, and how to use it in your Materials, you can read the page on Using Refraction (-> using-refraction-in-unreal-engine).

|  |  |
| --- | --- |
|  |  |
| Physical Refraction Model: Index of Refraction | Non-Physical Refraction Model: Pixel Normal Offset |

The comparisons below demonstrate the differences in how the normal is read in the Material when the Refraction Mode is changed from **Index of Refraction** to **Pixel Normal Offset.**

 [image: Refraction Mode: Index of Refraction without Normal Map]

 [image: Refraction Mode: Pixel Normal Offset without Normal Map]

Above you will notice that the image is shifted when using the **Index of Refraction** mode compared to the **Pixel Normal Offset** mode where you do not read from off screen so much. Note that **Index of
Refraction** will work without a Normal map plugged into the Material, whereas with **Pixel Normal Offset**, if there is no Normal map you will not get any refraction.

 [image: Refraction Mode: Index of Refraction with Normal Map]

 [image: Refraction Mode: Pixel Normal Offset with Normal Map]

When you add a Normal map to your Material with a value greater than 1 plugged into the Refraction input, the normal will translate along the surface when using **Pixel Normal Offset**.
However, you will notice that with **Index of Refraction**, you will still have an offset that reads from off screen, which is not a desirable effect for flat surfaces using refraction.

### Final Result

In this example, the refraction amount is adjusted between a value of 1.0, which is no refraction at all, to a value of 2.0, for some refraction along the surface without shifting the image while using
**Pixel Normal Offset**.

## Pixel Normal Offset and Glass

Pixel Normal Offset is also beneficial for large flat glass surfaces, such as the windows in the cafe scene below. The first image in the slider uses the default **Index of Refraction** setting. The window refraction is chaotic and contains an artifact in the bottom right corner. When the refraction mode is changed to **Pixel Normal Offset,** the windows appear much more true to life and the artifact disappears.

 [image: Cafe glass with IOR]
 [image: Cafe glass with Pixel Normal Offset]

**Move the slider to see how the glass changes when the Refraction Mode is changed from Index of Refraction (image 1) to Pixel Normal Offset (image 2).**

In **Pixel Normal Offset** mode, the refraction in this example is extremely slight because the normal map for this glass only contains micro abrasions and minor surface imperfections. This is an expected result for clean architectural glass.

However if you wanted a textured or patterned glass effect you could use a more representative normal map and raise the **Refraction** value to something around **1.52**.

This is how the normal map affects the refraction in the glass windows.

- materials
- rendering

On this page

- Physical vs Non-Physical Refraction Model (-> refraction-using-pixel-normal-offset-in-unreal-engine)
- Final Result (-> refraction-using-pixel-normal-offset-in-unreal-engine)
- Pixel Normal Offset and Glass (-> refraction-using-pixel-normal-offset-in-unreal-engine)

Related documents

Using Refraction

 [image: Using Refraction] (-> using-refraction-in-unreal-engine)

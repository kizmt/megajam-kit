# Color Picker

https://dev.epicgames.com/documentation/en-us/unreal-engine/color-picker-in-unreal-engine?application_version=5.9

> Tool for interactively choosing colors to assign to color properties of actors.

[image: Color Picker]

The **Color Picker** allows you to easily adjust a color value for a color property in the Unreal Editor. You can adjust colors by RGBA (red, green, blue, alpha), HSV (hue, saturation, value), and Hex (ARGB). Alternatively you can select a color by clicking anywhere in the color wheel or by capturing the color under your mouse, anywhere on your monitors.

 [image: ColorPicker]

| Item | Description |
| --- | --- |
| [image: Themes & sRGB] | Allows for Theme (-> color-picker-in-unreal-engine) selection and **sRGB** previews (see note below). |
| [image: Color Wheel] | A Color wheel that allows a color to be selected graphically by clicking and dragging with the mouse. Additional adjustments can be made by using the two vertical bars. Instead of Color Wheel, a Color Spectrum may be used if the option is toggled on. |
| [image: Color Swatches] | Displays the color currently assigned (Old) to the property and the color currently selected in the Color Picker (New). Colors can be dragged from either the Old or New sections to the **Themes** bar to save them for reuse later on. |
| [image: Picker Options] | Toggles between the Color Wheel or Color Spectrum (left image). The **Eye Dropper** (right image) can be used for selecting a colored pixel from any window inside or outside of Unreal Engine. |
| [image: Red Channel] | Drag or type value to set the **Red** channel. |
| [image: Green Channel] | Drag or type value to set the **Green** channel. |
| [image: Blue Channel] | Drag or type value to set the **Blue** channel. |
| [image: Hue Channel] | Drag or type value to set the **Hue**. |
| [image: Saturation Channel] | Drag or type value to set the **Saturation**. |
| [image: Value Channel] | Drag or type value to set the **Value** (color brightness). |
| [image: Alpha Channel] | Drag or type value to set the **Alpha** channel. |
| [image: Hex Values] | Enter in Hexadecimal Linear or Hexadecimal sRGB values manually. |

When working with the Color Picker, it does not assume a straight inverse gamma conversion from colors sampled on the screen using the Eye Dropper. Instead, sRGB is the assumed space all colors are sampled in, making sampling colors from Photoshop the identical version of the color converted into linear space. When transformed back into sRGB space, it will be the same color you saw in Photoshop.

`FColor` and `FLinearColor` can also default to the sRGB space using a UPROPERTY meta tag of **sRGB=true** (or **false**), you can force a specific default checking of the sRGB checkbox.

Several places in Unreal Motion Graphics (UMG) (-> creating-user-interfaces-with-umg-and-slate-in-unreal-engine) now force this default since sRGB is the space UMG will be rendered in (on PC). Additional work will be needed on Mac where the final rendering space is gamma 2.2.

## Themes

**Themes** are collections of colors that can be easily reused. These can be used to make commonly used colors available or to restrict the colors used by artists and designers to a specific palette.

 [image: Example Theme]

### Creating Themes

New themes can be added by clicking the **Theme Menu** button.

Click the **New Theme** button to add an empty theme to the list.

Click the **Duplicate** button to create a new theme that copies an existing theme.

### Renaming Themes

Themes can be renamed by clicking the **Rename** button.

This displays a text field, with the default text "New Theme".

Type in a new name for the theme. Then click the **Accept** button.

### Adding and Removing Colors

Colors can be added, removed, or reordered within the theme using drag and drop.

Drag colors from the main swatch to add them to a theme.

Reorder colors within a theme by dragging them right or left.

Drag colors to the **Trashcan** icon to delete them from the theme.

Colors can also be reordered and removed from the **Theme Menu**.

To edit the theme, drag colors left or right.

To delete a color from the theme, drag it to the **Trashcan** icon.

### Labeling Saved Colors in a Theme

You can label colors saved in your **Theme Bar** by right-clicking a saved color, and typing a name for the color in the **Color Label** window.

When you hover the mouse cursor over the color that has been labeled, you will see the name listed in the tooltip properties for the color.

Colors can also be labeled from the **Theme Menu**. Right-click the color, then type a name for the color�into the **Color Label** window.

### Using Themes

To change themes, select the theme you want to be active from the **Theme Menu**.

 [image: Select Theme]

To use a color from the current theme, double-click the color to be applied. This will update the currently selected color in the Color Picker.

 [image: Use Color]

Hovering the cursor over a color in the theme will display the color information.

 [image: Color Info]

On this page

- Themes (-> color-picker-in-unreal-engine)
- Creating Themes (-> color-picker-in-unreal-engine)
- Renaming Themes (-> color-picker-in-unreal-engine)
- Adding and Removing Colors (-> color-picker-in-unreal-engine)
- Labeling Saved Colors in a Theme (-> color-picker-in-unreal-engine)
- Using Themes (-> color-picker-in-unreal-engine)
